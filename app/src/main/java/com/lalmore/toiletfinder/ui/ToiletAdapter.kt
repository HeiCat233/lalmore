package com.lalmore.toiletfinder.ui

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.lalmore.toiletfinder.databinding.ItemToiletBinding
import com.lalmore.toiletfinder.model.ToiletItem

/**
 * 附近厕所列表适配器。
 * 用 ListAdapter + DiffUtil：数据变化时只重绘差异项，滚动不闪（比手写 notifyXxx 优雅）。
 */
class ToiletAdapter(
    private val onClick: (ToiletItem) -> Unit
) : ListAdapter<ToiletItem, ToiletAdapter.ViewHolder>(DIFF) {

    inner class ViewHolder(val binding: ItemToiletBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder =
        ViewHolder(ItemToiletBinding.inflate(LayoutInflater.from(parent.context), parent, false))

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item = getItem(position)
        holder.binding.tvName.text = item.name
        holder.binding.tvAddress.text = item.address.ifEmpty { "位置信息待完善" }
        holder.binding.tvDistance.text = formatDistance(item.distanceM)
        holder.binding.ratingBar.rating = item.rating
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
