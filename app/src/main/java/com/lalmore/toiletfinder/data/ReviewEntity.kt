package com.lalmore.toiletfinder.data

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * 评价实体：对应数据库 reviews 表。
 * 一个厕所（toiletId）可以有多条评价，通过 toiletId 关联查询；
 * v2 起增加 userId 关联发布者、tags 记录用户勾选的设施标签（逗号分隔）。
 */
@Entity(tableName = "reviews")
data class ReviewEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val toiletId: String,
    val userName: String,
    val rating: Int,        // 1~5 星
    val content: String,
    val createdAt: Long,
    val userId: Long = 0,   // 发布者用户 id（本地账号体系）
    val tags: String = ""   // 设施标签，逗号分隔，如"纸巾充足,干净卫生"
)
