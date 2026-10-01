package com.lalmore.toiletfinder.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

/**
 * Room 数据库入口（v2：新增 users 表，reviews 增加 userId/tags 列）。
 * Room = 官方 SQLite ORM：编译期校验 SQL、把「实体类 ↔ 表」自动映射。
 */
@Database(
    entities = [ToiletEntity::class, ReviewEntity::class, UserEntity::class],
    version = 2,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun toiletDao(): ToiletDao
    abstract fun reviewDao(): ReviewDao
    abstract fun userDao(): UserDao

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
                    // v1→v2 未写迁移脚本：开发期直接重建表（演示前需重新录入评价），
                    // 上线前应换成正式 Migration 保留用户数据
                    .fallbackToDestructiveMigration()
                    .build()
                    .also { instance = it }
            }
    }
}
