package com.lalmore.toiletfinder.data

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * 厕所实体：对应数据库 toilets 表。
 * id 直接复用高德 POI 检索返回的 uid，保证和地图上的兴趣点一一对应。
 */
@Entity(tableName = "toilets")
data class ToiletEntity(
    @PrimaryKey val id: String,
    val name: String,
    val address: String,
    val lat: Double,
    val lng: Double,
    val createdAt: Long
)
