package com.lalmore.toiletfinder.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.lalmore.toiletfinder.data.ReviewEntity
import com.lalmore.toiletfinder.databinding.ItemReviewBinding
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** 评价列表适配器：详情页展示某间厕所的全部本地评价 */
class ReviewAdapter :
    ListAdapter<ReviewEntity, ReviewAdapter.ViewHolder>(DIFF) {

    inner class ViewHolder(val binding: ItemReviewBinding) :
        RecyclerView.ViewHolder(binding.root)

    private val timeFormat = SimpleDateFormat("MM-dd HH:mm", Locale.CHINA)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder =
        ViewHolder(ItemReviewBinding.inflate(LayoutInflater.from(parent.context), parent, false))

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val review = getItem(position)
        holder.binding.tvReviewer.text = review.userName
        holder.binding.ratingBar.rating = review.rating.toFloat()
        holder.binding.tvContent.text = review.content
        holder.binding.tvTime.text = timeFormat.format(Date(review.createdAt))
        // 昵称首字作为圆形头像的文字
        holder.binding.tvAvatar.text = review.userName.take(1).uppercase()
    }

    companion object {
        private val DIFF = object : DiffUtil.ItemCallback<ReviewEntity>() {
            override fun areItemsTheSame(oldItem: ReviewEntity, newItem: ReviewEntity) =
                oldItem.id == newItem.id

            override fun areContentsTheSame(oldItem: ReviewEntity, newItem: ReviewEntity) =
                oldItem == newItem
        }
    }
}
