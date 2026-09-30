package com.lalmore.toiletfinder.util

import android.content.Context

/**
 * 文件存储演示：SharedPreferences 本质是 app 私有目录
 * (/data/data/包名/shared_prefs/) 下的一个 XML 文件，
 * 适合存少量键值对（如最近一次搜索关键词、是否首次启动）。
 *
 * 配合 Room 数据库，构成「文件 + 数据库」两种数据存储方式。
 */
class PrefsHelper(context: Context) {

    private val sp = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

    fun saveLastKeyword(keyword: String) =
        sp.edit().putString(KEY_LAST_KEYWORD, keyword).apply()

    fun getLastKeyword(): String? = sp.getString(KEY_LAST_KEYWORD, null)

    fun saveFirstLaunchDone() = sp.edit().putBoolean(KEY_FIRST_LAUNCH, false).apply()

    fun isFirstLaunch(): Boolean = sp.getBoolean(KEY_FIRST_LAUNCH, true)

    private companion object {
        const val PREF_NAME = "toilet_prefs"
        const val KEY_LAST_KEYWORD = "last_keyword"
        const val KEY_FIRST_LAUNCH = "first_launch"
    }
}
