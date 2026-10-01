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

    // LEFT JOIN 聚合：厕所表左连评价表，一次查出均分与评价数
    @Query(
        """
        SELECT t.id AS id, t.name AS name, t.address AS address,
               t.lat AS lat, t.lng AS lng, t.createdAt AS createdAt,
               AVG(r.rating) AS avgRating, COUNT(r.id) AS reviewCount
        FROM toilets t
        LEFT JOIN reviews r ON r.toiletId = t.id
        GROUP BY t.id
        """
    )
    suspend fun getAllWithStats(): List<ToiletWithStats>
}
