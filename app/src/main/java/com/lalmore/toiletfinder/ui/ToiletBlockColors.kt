package com.lalmore.toiletfinder.ui

import com.lalmore.toiletfinder.R

/**
 * 厕所色块取色器：按 POI id 的哈希在四色渐变里稳定取色。
 * 首页信息流卡片与详情页头图共用，保证"列表认色 → 进详情同色"的视觉关联。
 */
object ToiletBlockColors {

    fun blockFor(id: String): Int {
        val blocks = intArrayOf(
            R.drawable.bg_block_teal, R.drawable.bg_block_sky,
            R.drawable.bg_block_violet, R.drawable.bg_block_coral
        )
        return blocks[Math.abs(id.hashCode()) % blocks.size]
    }
}
