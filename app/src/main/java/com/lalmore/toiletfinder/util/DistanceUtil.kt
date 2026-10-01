package com.lalmore.toiletfinder.util

import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

/**
 * 球面距离计算：Haversine 公式（大作业"原理汇报"的重点素材）。
 *
 * 为什么不直接用平面勾股定理？因为经纬度是球面坐标：
 * 1 度经线的实际长度随纬度变化（赤道 111km，北京附近只有 ~85km），
 * 平面公式在小范围会有米级以上误差，且方向感完全失真。
 *
 * Haversine 把两点经纬度视为球面上的角距，用半正矢函数换算成弧长：
 *   a = sin²(Δφ/2) + cos(φ1)·cos(φ2)·sin²(Δλ/2)
 *   c = 2·atan2(√a, √(1−a))
 *   d = R·c    R 取地球平均半径 6371km
 *
 * 在城市尺度（几公里内）Haversine 误差 <0.5%，完全满足"附近厕所"排序需求；
 * 若要更高精度可用 Vincenty 公式（考虑地球椭率），但计算量更大。
 */
object DistanceUtil {

    private const val EARTH_RADIUS_M = 6371000.0

    /** 返回两个经纬度坐标间的球面距离（米） */
    fun haversineMeters(lat1: Double, lng1: Double, lat2: Double, lng2: Double): Int {
        val dLat = Math.toRadians(lat2 - lat1)
        val dLng = Math.toRadians(lng2 - lng1)
        val a = sin(dLat / 2) * sin(dLat / 2) +
                cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
                sin(dLng / 2) * sin(dLng / 2)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return (EARTH_RADIUS_M * c).toInt()
    }
}
