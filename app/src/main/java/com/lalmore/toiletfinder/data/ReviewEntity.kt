package com.lalmore.toiletfinder.data

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * 评价实体：对应数据库 reviews 表。
 * 一个厕所（toiletId）可以有多条评价，后续通过 toiletId 关联查询。
 */
@Entity(tableName = "reviews")
data class ReviewEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val toiletId: String,
    val userName: String,
    val rating: Int,        // 1~5 星
    val content: String,
    val createdAt: Long
)
