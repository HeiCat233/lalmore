package com.lalmore.toiletfinder.util

import java.security.MessageDigest
import java.security.SecureRandom

/**
 * 密码安全工具：SHA-256 加盐哈希（答辩可讲的安全细节）。
 *
 * 为什么不直接存密码明文/普通哈希？
 * 1. 明文：数据库泄露即全部账号沦陷；
 * 2. 无盐哈希：相同密码哈希值相同，攻击者可用彩虹表反查；
 * 3. 加盐：每个用户随机盐，相同密码哈希也不同，彩虹表失效。
 * 生产环境应使用 BCrypt/Argon2 等慢哈希，课程项目用 SHA-256+盐演示原理。
 */
object PasswordUtil {

    fun newSalt(): String {
        val bytes = ByteArray(16)
        SecureRandom().nextBytes(bytes)
        return bytes.joinToString("") { "%02x".format(it) }
    }

    fun hash(password: String, salt: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        return digest.digest((salt + password).toByteArray())
            .joinToString("") { "%02x".format(it) }
    }
}
