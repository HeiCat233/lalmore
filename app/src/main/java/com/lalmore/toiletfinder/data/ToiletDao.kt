package com.lalmore.toiletfinder.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query

@Dao
interface ToiletDao {

    // 收藏厕所时如果已存在就覆盖（REPLACE），保证同一 POI 只有一条记录
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(toilets: List<ToiletEntity>)

    @Query("SELECT * FROM toilets ORDER BY createdAt DESC")
    suspend fun getAll(): List<ToiletEntity>

    @Query("SELECT * FROM toilets WHERE id = :id")
    suspend fun getById(id: String): ToiletEntity?
}
