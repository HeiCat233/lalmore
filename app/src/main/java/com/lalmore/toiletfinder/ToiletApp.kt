package com.lalmore.toiletfinder

import android.app.Application
import android.util.Log
import com.amap.api.location.AMapLocationClient
import com.amap.api.maps.MapsInitializer
import com.amap.api.services.core.ServiceSettings
import com.lalmore.toiletfinder.data.AppDatabase

/**
 * 全局 Application：进程启动时最先执行，适合放 SDK 初始化逻辑。
 *
 * 【重要原理】高德 SDK 自 2021 年起新增「隐私合规」强制要求：
 * 必须在调用任何地图 / 定位 / 搜索能力之前，声明用户已同意隐私政策，
 * 否则定位回调错误码 12、地图瓦片一片空白。
 * 三套 SDK（地图 / 定位 / 搜索）各自有独立的合规接口，缺一不可。
 */
class ToiletApp : Application() {

    // 懒加载全局数据库单例，整个 App 共用一个 SQLite 连接池
    val database: AppDatabase by lazy { AppDatabase.getInstance(this) }

    override fun onCreate() {
        super.onCreate()

        // 3D 地图 SDK 隐私合规
        MapsInitializer.updatePrivacyShow(this, true, true)
        MapsInitializer.updatePrivacyAgree(this, true)
        // 定位 SDK 隐私合规
        AMapLocationClient.updatePrivacyShow(this, true, true)
        AMapLocationClient.updatePrivacyAgree(this, true)
        // 搜索 SDK 隐私合规
        ServiceSettings.updatePrivacyShow(this, true, true)
        ServiceSettings.updatePrivacyAgree(this, true)

        Log.i(TAG, "高德 SDK 隐私合规声明完成")
    }

    companion object {
        private const val TAG = "ToiletApp"
    }
}
