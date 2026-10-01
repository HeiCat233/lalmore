package com.lalmore.toiletfinder.util

import android.content.Context

/**
 * 会话管理：用 SharedPreferences 维护登录态、最近定位、搜索历史。
 * 本质仍是 app 私有目录下的 XML 文件（文件存储评分点之一）。
 */
class SessionManager(context: Context) {

    private val sp = context.getSharedPreferences("session_prefs", Context.MODE_PRIVATE)

    // ---------- 登录态 ----------

    fun saveLogin(userId: Long, username: String, nickname: String) =
        sp.edit()
            .putLong(KEY_USER_ID, userId)
            .putString(KEY_USERNAME, username)
            .putString(KEY_NICKNAME, nickname)
            .apply()

    fun clearLogin() = sp.edit()
        .remove(KEY_USER_ID).remove(KEY_USERNAME).remove(KEY_NICKNAME).apply()

    fun isLoggedIn(): Boolean = sp.getLong(KEY_USER_ID, -1L) != -1L

    fun getUserId(): Long = sp.getLong(KEY_USER_ID, -1L)

    fun getNickname(): String = sp.getString(KEY_NICKNAME, "") ?: ""

    fun getUsername(): String = sp.getString(KEY_USERNAME, "") ?: ""

    // ---------- 最近一次定位（首页/榜单计算距离的基准） ----------

    fun saveLocation(lat: Double, lng: Double, city: String?, district: String?) =
        sp.edit()
            .putString(KEY_LAT, lat.toString())
            .putString(KEY_LNG, lng.toString())
            .putString(KEY_CITY, city ?: "")
            .putString(KEY_DISTRICT, district ?: "")
            .apply()

    fun getLastLat(): Double = sp.getString(KEY_LAT, null)?.toDoubleOrNull() ?: 0.0
    fun getLastLng(): Double = sp.getString(KEY_LNG, null)?.toDoubleOrNull() ?: 0.0
    fun getCity(): String = sp.getString(KEY_CITY, "") ?: ""
    fun getDistrict(): String = sp.getString(KEY_DISTRICT, "") ?: ""

    // ---------- 搜索历史（最多 8 条，新词置顶去重） ----------

    fun addSearchHistory(keyword: String) {
        val list = getSearchHistory().toMutableList()
        list.remove(keyword)
        list.add(0, keyword)
        sp.edit().putString(KEY_HISTORY, list.take(8).joinToString("\u0001")).apply()
    }

    fun getSearchHistory(): List<String> =
        sp.getString(KEY_HISTORY, "")?.split("\u0001")?.filter { it.isNotBlank() } ?: emptyList()

    private companion object {
        const val KEY_USER_ID = "user_id"
        const val KEY_USERNAME = "username"
        const val KEY_NICKNAME = "nickname"
        const val KEY_LAT = "last_lat"
        const val KEY_LNG = "last_lng"
        const val KEY_CITY = "city"
        const val KEY_DISTRICT = "district"
        const val KEY_HISTORY = "search_history"
    }
}
