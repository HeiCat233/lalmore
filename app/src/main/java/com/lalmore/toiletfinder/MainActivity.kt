package com.lalmore.toiletfinder

import android.Manifest
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
import com.amap.api.maps.model.MyLocationStyle
import com.lalmore.toiletfinder.data.ReviewEntity
import com.lalmore.toiletfinder.databinding.ActivityMainBinding
import kotlinx.coroutines.launch

/**
 * 第一步的验收页面：全屏高德地图 + 定位蓝点 + 一次单点定位 + Room 冒烟测试。
 * 后续步骤会在此基础上叠加「底部厕所列表」「详情页」「导航按钮」等 UI。
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var amap: AMap
    private lateinit var locationClient: AMapLocationClient

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // MapView 生命周期必须与 Activity 绑定，否则地图不渲染或内存泄漏
        binding.mapView.onCreate(savedInstanceState)
        amap = binding.mapView.map

        requestLocationPermissionThenEnableBlueDot()
        startOneShotLocation()
        runRoomSmokeTest()
    }

    // ---------- 定位 ----------

    /** Android 6.0+ 定位权限必须运行时申请，授权后才能开蓝点 */
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
                Toast.makeText(this, "未授予定位权限，地图蓝点不可用", Toast.LENGTH_LONG).show()
            }
        }
    }

    /** 开启地图自带的「定位蓝点」图层：连续定位并把当前位置画到地图上 */
    private fun enableMyLocationBlueDot() {
        val style = MyLocationStyle().apply {
            // 只定位、不移动镜头：显示蓝点但由用户手动控制视野
            myLocationType(MyLocationStyle.LOCATION_TYPE_LOCATION_ROTATE_NO_CENTER)
            // 定位间隔 2 秒
            interval(2000)
        }
        amap.myLocationStyle = style
        amap.isMyLocationEnabled = true
        Log.d(TAG, "定位蓝点已开启")
    }

    /** 单次定位：拿到经纬度（后续 POI 搜索就靠它算「附近」） */
    private fun startOneShotLocation() {
        locationClient = AMapLocationClient(applicationContext)
        locationClient.setLocationListener { location ->
            if (location.errorCode == 0) {
                Log.i(
                    TAG,
                    "单点定位成功: lat=${location.latitude}, lng=${location.longitude}, 精度≈${location.accuracy}m"
                )
                locationClient.stopLocation()
            } else {
                Log.e(TAG, "定位失败: code=${location.errorCode}, info=${location.errorInfo}")
            }
        }
        locationClient.startLocation()
    }

    // ---------- 数据存储冒烟测试 ----------

    /** 往 Room 写一条测试评价再读出来，验证「数据存储」链路通了 */
    private fun runRoomSmokeTest() {
        lifecycleScope.launch {
            try {
                val db = (application as ToiletApp).database
                val review = ReviewEntity(
                    toiletId = "TEST001",
                    userName = "冒烟测试",
                    rating = 5,
                    content = "环境干净，纸巾充足，强烈推荐",
                    createdAt = System.currentTimeMillis()
                )
                db.reviewDao().insert(review)
                val reviews = db.reviewDao().getAll()
                Log.i(TAG, "Room 验证通过：共 ${reviews.size} 条评价，最新一条：${reviews.first().content}")
                Toast.makeText(this@MainActivity, "数据库写入读取成功", Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                Log.e(TAG, "Room 验证失败", e)
            }
        }
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
        locationClient.onDestroy()
        binding.mapView.onDestroy()
        super.onDestroy()
    }

    companion object {
        private const val TAG = "MainActivity"
        private const val REQ_LOCATION = 1001
    }
}
