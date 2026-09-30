package com.lalmore.toiletfinder.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

/**
 * Room 数据库入口。
 * Room = 官方 SQLite ORM：编译期校验 SQL、把「实体类 ↔ 表」自动映射，
 * 避免手写 SQLiteOpenHelper 的模板代码和 SQL 拼接错误。
 */
@Database(
    entities = [ToiletEntity::class, ReviewEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun toiletDao(): ToiletDao
    abstract fun reviewDao(): ReviewDao

    companion object {
        @Volatile
        private var instance: AppDatabase? = null

        // 经典单例写法：双重检查锁，保证多线程下只建一个数据库实例
        fun getInstance(context: Context): AppDatabase =
            instance ?: synchronized(this) {
                instance ?: Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "toilet.db"
                )
                    // 版本升级但没写迁移脚本时，直接重建表（开发期方便，上线前应换成正式 Migration）
                    .fallbackToDestructiveMigration()
                    .build()
                    .also { instance = it }
            }
    }
}
