package com.lalmore.toiletfinder.model

/**
 * 列表页展示用的厕所模型（UI 层）。
 * 从高德 POI 检索结果转换而来，distanceM 由 Haversine 公式本地计算。
 */
data class ToiletItem(
    val id: String,        // 高德 POI 的 uid，同时是 Room 里 toilets 表的主键
    val name: String,
    val address: String,
    val lat: Double,
    val lng: Double,
    val distanceM: Int,    // 距用户的球面距离（米）
    val rating: Float      // 本地评价平均分（0~5），暂无评价时为 0
)
