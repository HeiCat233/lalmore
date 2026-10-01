package com.lalmore.toiletfinder.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.lalmore.toiletfinder.R
import com.lalmore.toiletfinder.databinding.ItemRankingBinding
import com.lalmore.toiletfinder.model.ToiletItem

/**
 * 排行榜适配器：前三名金/银/铜奖牌徽章，其余灰色数字名次。
 */
class RankingAdapter(
    private val onClick: (ToiletItem) -> Unit
) : ListAdapter<ToiletItem, RankingAdapter.ViewHolder>(DIFF) {

    inner class ViewHolder(val binding: ItemRankingBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder =
        ViewHolder(ItemRankingBinding.inflate(LayoutInflater.from(parent.context), parent, false))

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = getItem(position)
        val ctx = holder.binding.root.context

        holder.binding.tvName.text = item.name
        holder.binding.tvScore.text = if (item.rating > 0f) String.format("%.1f", item.rating) else ctx.getString(R.string.score_none)
        holder.binding.tvMeta.text = ctx.getString(R.string.ranking_meta, item.reviewCount)

        // 名次徽章：1金 2银 3铜，其余灰色圆形数字
        when (position) {
            0 -> { holder.binding.tvRank.setBackgroundResource(R.drawable.badge_gold); holder.binding.tvRank.text = "1" }
            1 -> { holder.binding.tvRank.setBackgroundResource(R.drawable.badge_silver); holder.binding.tvRank.text = "2" }
            2 -> { holder.binding.tvRank.setBackgroundResource(R.drawable.badge_bronze); holder.binding.tvRank.text = "3" }
            else -> { holder.binding.tvRank.setBackgroundResource(R.drawable.bg_rank_gray); holder.binding.tvRank.text = (position + 1).toString() }
        }
        holder.binding.root.setOnClickListener { onClick(item) }
    }

    companion object {
        private val DIFF = object : DiffUtil.ItemCallback<ToiletItem>() {
            override fun areItemsTheSame(oldItem: ToiletItem, newItem: ToiletItem) =
                oldItem.id == newItem.id

            override fun areContentsTheSame(oldItem: ToiletItem, newItem: ToiletItem) =
                oldItem == newItem
        }
    }
}
