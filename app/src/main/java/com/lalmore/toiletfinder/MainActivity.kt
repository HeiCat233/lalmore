package com.lalmore.toiletfinder

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.amap.api.location.AMapLocationClient
import com.amap.api.maps.AMap
import com.amap.api.maps.model.BitmapDescriptorFactory
import com.amap.api.maps.model.LatLng
import com.amap.api.maps.model.Marker
import com.amap.api.maps.model.MarkerOptions
import com.amap.api.maps.model.MyLocationStyle
import com.amap.api.services.core.PoiItem
import com.amap.api.services.core.LatLonPoint
import com.amap.api.services.poisearch.PoiResult
import com.amap.api.services.poisearch.PoiSearch
import com.lalmore.toiletfinder.data.ReviewEntity
import com.lalmore.toiletfinder.data.ToiletEntity
import com.lalmore.toiletfinder.databinding.ActivityMainBinding
import com.lalmore.toiletfinder.model.ToiletItem
import com.lalmore.toiletfinder.ui.ToiletAdapter
import com.lalmore.toiletfinder.util.DistanceUtil
import com.lalmore.toiletfinder.util.PrefsHelper
import kotlinx.coroutines.launch

/**
 * 主界面核心流程（对应大作业步骤 2~4）：
 *   定位成功 → 以当前位置为圆心发起 POI 周边搜索"公共厕所"（半径 3km）
 *   → Haversine 计算距离并按由近到远排序 → 地图打 Marker + 底部列表渲染
 *   → 搜索结果缓存进 Room（数据存储评分点），并回填本地平均评分
 * 点击列表项 / 地图 Marker → 进入厕所详情页（评价 + 步行导航）。
 */
class MainActivity : AppCompatActivity(), PoiSearch.OnPoiSearchListener {

    private lateinit var binding: ActivityMainBinding
    private lateinit var amap: AMap
    private lateinit var locationClient: AMapLocationClient
    private lateinit var toiletAdapter: ToiletAdapter
    private lateinit var prefs: PrefsHelper

    private var userLat: Double = 0.0
    private var userLng: Double = 0.0
    // uid → Marker 映射，点击地图 Marker 时反查对应的厕所数据
    private val markerIndex = mutableMapOf<String, Marker>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        prefs = PrefsHelper(this)
        binding.mapView.onCreate(savedInstanceState)
        amap = binding.mapView.map

        setupRecyclerView()
        requestLocationPermissionThenEnableBlueDot()
    }

    // ---------- 第二步：UI 框架 ----------

    private fun setupRecyclerView() {
        toiletAdapter = ToiletAdapter(::openDetail)
        binding.recyclerToilets.layoutManager = LinearLayoutManager(this)
        binding.recyclerToilets.adapter = toiletAdapter
    }

    // ---------- 定位（第三步的数据源） ----------

    private fun requestLocationPermissionThenEnableBlueDot() {
        val granted = ContextCompat.checkSelfPermission(
            this, Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        if (granted) {
            enableMyLocationBlueDot()
        } else {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
                ),
                REQ_LOCATION
            )
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQ_LOCATION) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                enableMyLocationBlueDot()
            } else {
                Toast.makeText(this, "未授予定位权限，无法搜索附近厕所", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun enableMyLocationBlueDot() {
        val style = MyLocationStyle().apply {
            myLocationType(MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE_NO_CENTER)
            interval(2000)
        }
        amap.myLocationStyle = style
        amap.isMyLocationEnabled = true

        // 单次定位拿到经纬度后触发周边搜索
        locationClient = AMapLocationClient(applicationContext)
        locationClient.setLocationListener { location ->
            if (location.errorCode == 0) {
                userLat = location.latitude
                userLng = location.longitude
                Log.i(TAG, "定位成功: lat=$userLat, lng=$userLng, 精度≈${location.accuracy}m")
                locationClient.stopLocation()
                amap.moveCamera(com.amap.api.maps.CameraUpdateFactory.newLatLngZoom(LatLng(userLat, userLng), 15f))
                searchNearbyToilets()
            } else {
                Log.e(TAG, "定位失败: code=${location.errorCode}, info=${location.errorInfo}")
            }
        }
        locationClient.startLocation()
    }

    // ---------- 第三步：POI 周边搜索 ----------

    private fun searchNearbyToilets() {
        // 记录最近一次搜索关键词（SharedPreferences 文件存储演示）
        prefs.saveLastKeyword("公共厕所")

        val query = PoiSearch.Query("公共厕所", "", "")
        query.pageSize = 20
        query.pageNum = 1
        val poiSearch = PoiSearch(this, query)
        // 周边搜索模式：以用户为圆心、半径 3km 的圆形范围
        poiSearch.bound = PoiSearch.SearchBound(LatLonPoint(userLat, userLng), 3000)
        poiSearch.setOnPoiSearchListener(this)
        poiSearch.searchPOIAsyn()
        Log.d(TAG, "已发起周边搜索: 半径3000m, 关键词=公共厕所")
    }

    override fun onPoiSearched(result: PoiResult?, code: Int) {
        // 高德 SDK 回调已在主线程
        if (code != 1000 || result == null) {
            Log.e(TAG, "POI 搜索失败: code=$code（1000=成功）")
            Toast.makeText(this, "周边搜索失败，请检查网络后重试", Toast.LENGTH_SHORT).show()
            return
        }
        val pois = result.pois.orEmpty().filter { it.latLonPoint != null }
        Log.i(TAG, "POI 搜索成功: ${pois.size} 条结果")

        val items = pois.map { poi ->
            ToiletItem(
                id = poi.poiId,
                name = poi.title,
                address = poi.snippet,
                lat = poi.latLonPoint.latitude,
                lng = poi.latLonPoint.longitude,
                distanceM = DistanceUtil.haversineMeters(userLat, userLng, poi.latLonPoint.latitude, poi.latLonPoint.longitude),
                rating = 0f
            )
        }.sortedBy { it.distanceM }

        renderMarkers(items)
        cacheAndShow(items)
    }

    override fun onPoiItemSearched(poiItem: PoiItem?, code: Int) = Unit

    // ---------- 渲染与数据缓存 ----------

    private fun renderMarkers(items: List<ToiletItem>) {
        amap.clear(true)
        markerIndex.clear()
        items.forEach { item ->
            val marker = amap.addMarker(
                MarkerOptions()
                    .position(LatLng(item.lat, item.lng))
                    .title(item.name)
                    .snippet(item.address)
                    .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_AZURE))
            )
            markerIndex[item.id] = marker
        }
        amap.setOnMarkerClickListener { marker ->
            // 通过反向映射把 Marker 对应的列表项找出来
            markerIndex.entries.firstOrNull { it.value.id == marker.id }?.let { (uid, _) ->
                items.firstOrNull { it.id == uid }?.let { openDetail(it) }
            }
            true
        }
    }

    private fun cacheAndShow(items: List<ToiletItem>) {
        lifecycleScope.launch {
            val db = (application as ToiletApp).database
            // 1. 搜索结果落库：toilets 表按 uid 覆盖写入（数据存储评分点）
            db.toiletDao().insertAll(
                items.map { ToiletEntity(it.id, it.name, it.address, it.lat, it.lng, System.currentTimeMillis()) }
            )
            // 2. 回填每间厕所的本地评价均分后再刷新列表
            val rated = items.map { item ->
                val ratings = db.reviewDao().getByToiletId(item.id).map { it.rating }
                val avg = if (ratings.isEmpty()) 0.0 else ratings.average()
                item.copy(rating = avg.toFloat())
            }
            toiletAdapter.submitList(rated)
        }
    }

    // ---------- 第四步入口：跳详情页 ----------

    private fun openDetail(item: ToiletItem) {
        startActivity(Intent(this, ToiletDetailActivity::class.java).apply {
            putExtra(ToiletDetailActivity.EXTRA_ID, item.id)
            putExtra(ToiletDetailActivity.EXTRA_NAME, item.name)
            putExtra(ToiletDetailActivity.EXTRA_ADDRESS, item.address)
            putExtra(ToiletDetailActivity.EXTRA_LAT, item.lat)
            putExtra(ToiletDetailActivity.EXTRA_LNG, item.lng)
        })
    }

    // ---------- 生命周期 ----------

    override fun onResume() {
        super.onResume()
        binding.mapView.onResume()
    }

    override fun onPause() {
        binding.mapView.onPause()
        super.onPause()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        binding.mapView.onSaveInstanceState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        if (::locationClient.isInitialized) {
            locationClient.onDestroy()
        }
        binding.mapView.onDestroy()
        super.onDestroy()
    }

    companion object {
        private const val TAG = "MainActivity"
        private const val REQ_LOCATION = 1001
    }
}
