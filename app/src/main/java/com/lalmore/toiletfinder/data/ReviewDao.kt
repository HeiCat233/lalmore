package com.lalmore.toiletfinder.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query

@Dao
interface ReviewDao {

    @Insert
    suspend fun insert(review: ReviewEntity)

    @Insert
    suspend fun insertAll(reviews: List<ReviewEntity>)

    @Query("DELETE FROM reviews")
    suspend fun deleteAll()

    @Query("SELECT * FROM reviews ORDER BY createdAt DESC")
    suspend fun getAll(): List<ReviewEntity>

    @Query("SELECT * FROM reviews WHERE toiletId = :toiletId ORDER BY createdAt DESC")
    suspend fun getByToiletId(toiletId: String): List<ReviewEntity>

    @Query("SELECT * FROM reviews WHERE userId = :userId ORDER BY createdAt DESC")
    suspend fun getByUserId(userId: Long): List<ReviewEntity>

    @Query("SELECT COUNT(*) FROM reviews WHERE userId = :userId")
    suspend fun countByUserId(userId: Long): Int
}
