package com.lalmore.toiletfinder.data

/**
 * 厕所 + 评价统计的聚合查询结果（JOIN 视图，不对应独立表）。
 * 好处：一次 SQL 拿到「厕所 + 平均分 + 评价数」，避免 N+1 查询；
 * 答辩可讲：LEFT JOIN 保证没有评价的厕所也能出现在列表里（avgRating 为 null）。
 */
data class ToiletWithStats(
    val id: String,
    val name: String,
    val address: String,
    val lat: Double,
    val lng: Double,
    val createdAt: Long,
    val avgRating: Double?,
    val reviewCount: Int
)
