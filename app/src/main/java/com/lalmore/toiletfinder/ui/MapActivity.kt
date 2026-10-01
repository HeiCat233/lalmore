package com.lalmore.toiletfinder.ui

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
import com.amap.api.location.AMapLocationClient
import com.amap.api.maps.AMap
import com.amap.api.maps.CameraUpdateFactory
import com.amap.api.maps.model.BitmapDescriptorFactory
import com.amap.api.maps.model.LatLng
import com.amap.api.maps.model.Marker
import com.amap.api.maps.model.MarkerOptions
import com.amap.api.maps.model.MyLocationStyle
import com.amap.api.services.core.LatLonPoint
import com.amap.api.services.core.PoiItem
import com.amap.api.services.poisearch.PoiResult
import com.amap.api.services.poisearch.PoiSearch
import com.lalmore.toiletfinder.R
import com.lalmore.toiletfinder.ToiletApp
import com.lalmore.toiletfinder.ToiletDetailActivity
import com.lalmore.toiletfinder.data.ToiletEntity
import com.lalmore.toiletfinder.databinding.ActivityMapBinding
import com.lalmore.toiletfinder.model.ToiletItem
import com.lalmore.toiletfinder.util.DistanceUtil
import com.lalmore.toiletfinder.util.SessionManager
import kotlinx.coroutines.launch

/**
 * 地图找厕所（独立地图页）：定位蓝点 + 3km POI 周边搜索 + Marker 渲染 + 跳详情。
 * 由首页金刚区进入；首页信息流同样走 ToiletRepository，两处数据同源。
 */
class MapActivity : AppCompatActivity(), PoiSearch.OnPoiSearchListener {

    private lateinit var binding: ActivityMapBinding
    private lateinit var amap: AMap
    private lateinit var locationClient: AMapLocationClient
    private lateinit var session: SessionManager

    private var userLat: Double = 0.0
    private var userLng: Double = 0.0
    private var latestItems: List<ToiletItem> = emptyList()
    private val markerIndex = mutableMapOf<String, Marker>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMapBinding.inflate(layoutInflater)
        setContentView(binding.root)
        session = SessionManager(this)

        binding.mapView.onCreate(savedInstanceState)
        amap = binding.mapView.map
        binding.btnBack.setOnClickListener { finish() }

        requestLocationPermissionThenEnableBlueDot()
    }

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
                Toast.makeText(this, R.string.location_denied, Toast.LENGTH_LONG).show()
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

        locationClient = AMapLocationClient(applicationContext)
        locationClient.setLocationListener { location ->
            if (location.errorCode == 0 && userLat == 0.0) {  // 只处理首次定位，避免重复搜索
                userLat = location.latitude
                userLng = location.longitude
                Log.i(TAG, "定位成功: lat=$userLat, lng=$userLng")
                locationClient.stopLocation()
                amap.moveCamera(CameraUpdateFactory.newLatLngZoom(LatLng(userLat, userLng), 15f))
                searchNearbyToilets()
            } else if (location.errorCode != 0) {
                Log.e(TAG, "定位失败: code=${location.errorCode}")
            }
        }
        locationClient.startLocation()
    }

    private fun searchNearbyToilets() {
        val query = PoiSearch.Query("公共厕所", "", "")
        query.pageSize = 20
        query.pageNum = 1
        val poiSearch = PoiSearch(this, query)
        poiSearch.bound = PoiSearch.SearchBound(LatLonPoint(userLat, userLng), 3000)
        poiSearch.setOnPoiSearchListener(this)
        poiSearch.searchPOIAsyn()
    }

    override fun onPoiSearched(result: PoiResult?, code: Int) {
        if (code != 1000 || result == null) {
            Log.e(TAG, "POI 搜索失败: code=$code")
            Toast.makeText(this, R.string.search_failed, Toast.LENGTH_SHORT).show()
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
                distanceM = DistanceUtil.haversineMeters(userLat, userLng, poi.latLonPoint.latitude, poi.latLonPoint.longitude),
                rating = 0f
            )
        }.sortedBy { it.distanceM }

        renderMarkers(items)
        cacheAndShow(items)
    }

    override fun onPoiItemSearched(poiItem: PoiItem?, code: Int) = Unit

    private fun renderMarkers(items: List<ToiletItem>) {
        amap.clear(true)
        markerIndex.clear()
        latestItems = items
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
            markerIndex.entries.firstOrNull { it.value.id == marker.id }?.let { (uid, _) ->
                latestItems.firstOrNull { it.id == uid }?.let { openDetail(it) }
            }
            true
        }
    }

    private fun cacheAndShow(items: List<ToiletItem>) {
        lifecycleScope.launch {
            val db = (application as ToiletApp).database
            db.toiletDao().insertAll(
                items.map { ToiletEntity(it.id, it.name, it.address, it.lat, it.lng, System.currentTimeMillis()) }
            )
            val rated = items.map { item ->
                val ratings = db.reviewDao().getByToiletId(item.id).map { it.rating }
                val avg = if (ratings.isEmpty()) 0.0 else ratings.average()
                item.copy(rating = avg.toFloat())
            }
            latestItems = rated
        }
    }

    private fun openDetail(item: ToiletItem) {
        startActivity(Intent(this, ToiletDetailActivity::class.java).apply {
            putExtra(ToiletDetailActivity.EXTRA_ID, item.id)
            putExtra(ToiletDetailActivity.EXTRA_NAME, item.name)
            putExtra(ToiletDetailActivity.EXTRA_ADDRESS, item.address)
            putExtra(ToiletDetailActivity.EXTRA_LAT, item.lat)
            putExtra(ToiletDetailActivity.EXTRA_LNG, item.lng)
        })
    }

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
        if (::locationClient.isInitialized) locationClient.onDestroy()
        binding.mapView.onDestroy()
        super.onDestroy()
    }

    companion object {
        private const val TAG = "MapActivity"
        private const val REQ_LOCATION = 1002
    }
}
