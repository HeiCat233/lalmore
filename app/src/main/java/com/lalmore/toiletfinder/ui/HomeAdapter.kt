package com.lalmore.toiletfinder.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.lalmore.toiletfinder.R
import com.lalmore.toiletfinder.databinding.ItemHomeToiletBinding
import com.lalmore.toiletfinder.model.ToiletItem

/**
 * 首页信息流适配器（点评式卡片：左色块 + 名称/星级/评价数 + 距离）。
 */
class HomeAdapter(
    private val onClick: (ToiletItem) -> Unit
) : ListAdapter<ToiletItem, HomeAdapter.ViewHolder>(DIFF) {

    inner class ViewHolder(val binding: ItemHomeToiletBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder =
        ViewHolder(ItemHomeToiletBinding.inflate(LayoutInflater.from(parent.context), parent, false))

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = getItem(position)
        holder.binding.tvName.text = item.name
        holder.binding.tvAddress.text = item.address.ifEmpty {
            holder.binding.root.context.getString(R.string.address_unknown)
        }
        holder.binding.tvDistance.text = formatDistance(item.distanceM)
        holder.binding.tvScore.text = if (item.rating > 0f) {
            String.format("%.1f", item.rating)
        } else {
            holder.binding.root.context.getString(R.string.score_none)
        }
        holder.binding.tvReviewCount.text =
            holder.binding.root.context.getString(R.string.review_count_fmt, item.reviewCount)
        // 色块按 id 稳定取色：同一厕所刷新后颜色不变，详情页头图同色联动
        holder.binding.flBlock.setBackgroundResource(ToiletBlockColors.blockFor(item.id))
        holder.binding.root.setOnClickListener { onClick(item) }
    }

    private fun formatDistance(m: Int): String = if (m >= 1000) {
        String.format("%.1fkm", m / 1000.0)
    } else {
        "${m}m"
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
