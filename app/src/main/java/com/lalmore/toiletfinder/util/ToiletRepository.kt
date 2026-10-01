package com.lalmore.toiletfinder.util

import android.content.Context
import android.util.Log
import com.amap.api.location.AMapLocationClient
import com.amap.api.services.core.LatLonPoint
import com.amap.api.services.geocoder.GeocodeSearch
import com.amap.api.services.geocoder.RegeocodeQuery
import com.amap.api.services.geocoder.RegeocodeResult
import com.amap.api.services.poisearch.PoiResult
import com.amap.api.services.poisearch.PoiSearch
import com.lalmore.toiletfinder.ToiletApp
import com.lalmore.toiletfinder.data.ToiletEntity
import com.lalmore.toiletfinder.model.ToiletItem
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * 厕所数据仓库（Repository 模式，答辩加分点）：
 * 把「定位 → 逆地理编码 → POI 检索 → 数据转换 → Haversine 距离 → Room 缓存 → 评分聚合」
 * 的完整数据流水线封装成单例，首页与地图页共用同一数据源，
 * 避免两处页面各自维护一套搜索逻辑导致数据不一致。
 */
object ToiletRepository {

    private const val TAG = "ToiletRepository"
    private val mainScope = CoroutineScope(Dispatchers.Main)

    /**
     * 单次定位：回调经纬度与城市/区名（高德回调已在主线程）。
     * 注意：纯 GPS 定位成功时 AMapLocation.city 可能为空，
     * 此时用逆地理编码（经纬度→行政区）兜底补齐城市名。
     */
    fun locate(context: Context, onResult: (lat: Double, lng: Double, city: String, district: String) -> Unit) {
        val client = AMapLocationClient(context.applicationContext)
        client.setLocationListener { location ->
            if (location.errorCode == 0) {
                client.stopLocation()
                client.onDestroy()
                val lat = location.latitude
                val lng = location.longitude
                Log.i(TAG, "定位成功: lat=$lat, lng=$lng, city=${location.city}, district=${location.district}")
                val city = location.city.orEmpty()
                val district = location.district.orEmpty()
                if (city.isNotEmpty()) {
                    onResult(lat, lng, city, district)
                } else {
                    Log.d(TAG, "city 为空（可能为纯GPS定位），走逆地理编码兜底")
                    reverseGeocode(context, lat, lng) { c, d ->
                        Log.i(TAG, "逆地理编码结果: city=$c, district=$d")
                        onResult(lat, lng, c, d)
                    }
                }
            } else {
                Log.e(TAG, "定位失败: code=${location.errorCode}, info=${location.errorInfo}")
            }
        }
        client.startLocation()
    }

    /** 逆地理编码：把经纬度翻译成行政区（搜索 SDK 的 GeocodeSearch） */
    private fun reverseGeocode(context: Context, lat: Double, lng: Double, onResult: (String, String) -> Unit) {
        try {
            val geocodeSearch = GeocodeSearch(context)
            geocodeSearch.setOnGeocodeSearchListener(object : GeocodeSearch.OnGeocodeSearchListener {
                override fun onRegeocodeSearched(result: RegeocodeResult?, code: Int) {
                    if (code == 1000 && result?.regeocodeAddress != null) {
                        val addr = result.regeocodeAddress
                        onResult(addr.city.orEmpty(), addr.district.orEmpty())
                    } else {
                        Log.e(TAG, "逆地理编码失败: code=$code")
                        onResult("", "")
                    }
                }

                override fun onGeocodeSearched(p0: com.amap.api.services.geocoder.GeocodeResult?, p1: Int) = Unit
            })
            val query = RegeocodeQuery(LatLonPoint(lat, lng), 200f, GeocodeSearch.AMAP)
            geocodeSearch.getFromLocationAsyn(query)
        } catch (e: Exception) {
            Log.e(TAG, "逆地理编码异常", e)
            onResult("", "")
        }
    }

    /**
     * POI 周边搜索全流程：检索"公共厕所" → 转换 → Haversine 排序 →
     * Room 缓存（toilets 落库）→ 聚合均分/评价数 → 主线程回调。
     */
    fun searchNearby(
        context: Context,
        lat: Double,
        lng: Double,
        radiusM: Int = 3000,
        onResult: (List<ToiletItem>) -> Unit
    ) {
        val query = PoiSearch.Query("公共厕所", "", "")
        query.pageSize = 20
        query.pageNum = 1
        val poiSearch = PoiSearch(context, query)
        poiSearch.bound = PoiSearch.SearchBound(LatLonPoint(lat, lng), radiusM)
        poiSearch.setOnPoiSearchListener(object : PoiSearch.OnPoiSearchListener {
            override fun onPoiSearched(result: PoiResult?, code: Int) {
                if (code != 1000 || result == null) {
                    Log.e(TAG, "POI 搜索失败: code=$code")
                    onResult(emptyList())
                    return
                }
                val pois = result.pois.orEmpty().filter { it.latLonPoint != null }
                val items = pois.map { poi ->
                    ToiletItem(
                        id = poi.poiId,
                        name = poi.title,
                        address = poi.snippet,
                        lat = poi.latLonPoint.latitude,
                        lng = poi.latLonPoint.longitude,
                        distanceM = DistanceUtil.haversineMeters(lat, lng, poi.latLonPoint.latitude, poi.latLonPoint.longitude),
                        rating = 0f
                    )
                }.sortedBy { it.distanceM }
                mainScope.launch { onResult(mergeWithStats(context, items)) }
            }

            override fun onPoiItemSearched(poiItem: com.amap.api.services.core.PoiItem?, code: Int) = Unit
        })
        poiSearch.searchPOIAsyn()
    }

    /** 从 Room 缓存直接加载（首页冷启动秒出列表，不等网络） */
    suspend fun loadFromCache(context: Context, lat: Double, lng: Double): List<ToiletItem> =
        withContext(Dispatchers.Main) {
            val db = (context.applicationContext as ToiletApp).database
            db.toiletDao().getAllWithStats().map { it.toItem(lat, lng) }.sortedBy { it.distanceM }
        }

    /** POI 结果落库 toilets 表，再 JOIN 聚合评价统计后合并成 UI 模型 */
    private suspend fun mergeWithStats(context: Context, items: List<ToiletItem>): List<ToiletItem> {
        val db = (context.applicationContext as ToiletApp).database
        db.toiletDao().insertAll(
            items.map { ToiletEntity(it.id, it.name, it.address, it.lat, it.lng, System.currentTimeMillis()) }
        )
        return db.toiletDao().getAllWithStats()
            .filter { stats -> items.any { it.id == stats.id } }  // 只保留本次搜索半径内的结果
            .map { it.toItem(latOf(items, it.id), lngOf(items, it.id)) }
            .sortedBy { it.distanceM }
    }

    private fun latOf(items: List<ToiletItem>, id: String) = items.first { it.id == id }.lat
    private fun lngOf(items: List<ToiletItem>, id: String) = items.first { it.id == id }.lng

    private fun com.lalmore.toiletfinder.data.ToiletWithStats.toItem(userLat: Double, userLng: Double) =
        ToiletItem(
            id = id,
            name = name,
            address = address,
            lat = lat,
            lng = lng,
            distanceM = DistanceUtil.haversineMeters(userLat, userLng, lat, lng),
            rating = (avgRating ?: 0.0).toFloat(),
            reviewCount = reviewCount
        )
}
