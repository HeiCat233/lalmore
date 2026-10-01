package com.lalmore.toiletfinder.data

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

/**
 * 用户实体：本地账号体系（无后端，注册信息存本机 SQLite）。
 * username 建唯一索引，数据库层面杜绝重名注册。
 * 注意：密码只存「盐 + SHA-256 哈希」，绝不落明文。
 */
@Entity(tableName = "users", indices = [Index(value = ["username"], unique = true)])
data class UserEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val username: String,
    val passwordHash: String,
    val salt: String,
    val nickname: String,
    val createdAt: Long
)
