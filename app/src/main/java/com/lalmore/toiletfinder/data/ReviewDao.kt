package com.lalmore.toiletfinder.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface ReviewDao {

    @Insert
    suspend fun insert(review: ReviewEntity)

    @Query("SELECT * FROM reviews ORDER BY createdAt DESC")
    suspend fun getAll(): List<ReviewEntity>

    @Query("SELECT * FROM reviews WHERE toiletId = :toiletId ORDER BY createdAt DESC")
    suspend fun getByToiletId(toiletId: String): List<ReviewEntity>
}
