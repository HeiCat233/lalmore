package com.lalmore.toiletfinder

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.lalmore.toiletfinder.data.ReviewEntity
import com.lalmore.toiletfinder.databinding.ActivityToiletDetailBinding
import com.lalmore.toiletfinder.databinding.SheetPublishReviewBinding
import com.lalmore.toiletfinder.ui.ReviewAdapter
import kotlinx.coroutines.launch

/**
 * 厕所详情页（对应大作业步骤 4~5）：
 *   1. 展示厕所信息与本地评价（Room 查询）
 *   2. 发布评价：BottomSheet 输入昵称/星级/内容 → 落库 → 刷新均分
 *   3. 步行导航：通过高德 URL Scheme 唤起高德地图 App，未安装时回退网页版
 */
class ToiletDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityToiletDetailBinding
    private lateinit var reviewAdapter: ReviewAdapter

    private lateinit var toiletId: String
    private var toiletLat: Double = 0.0
    private var toiletLng: Double = 0.0
    private var toiletName: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityToiletDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        toiletId = intent.getStringExtra(EXTRA_ID) ?: ""
        toiletName = intent.getStringExtra(EXTRA_NAME).orEmpty()
        toiletLat = intent.getDoubleExtra(EXTRA_LAT, 0.0)
        toiletLng = intent.getDoubleExtra(EXTRA_LNG, 0.0)

        binding.tvToiletName.text = toiletName.ifEmpty { "公共厕所" }
        binding.tvToiletAddress.text = intent.getStringExtra(EXTRA_ADDRESS).orEmpty().ifEmpty { "位置信息待完善" }

        reviewAdapter = ReviewAdapter()
        binding.recyclerReviews.layoutManager = LinearLayoutManager(this)
        binding.recyclerReviews.adapter = reviewAdapter

        binding.btnNavigate.setOnClickListener { navigateOnFoot() }
        binding.fabWriteReview.setOnClickListener { showPublishSheet() }

        loadReviews()
    }

    // ---------- 第五步：评价系统 ----------

    private fun loadReviews() {
        lifecycleScope.launch {
            val db = (application as ToiletApp).database
            val reviews = db.reviewDao().getByToiletId(toiletId)
            reviewAdapter.submitList(reviews)
            binding.tvEmptyReviews.visibility =
                if (reviews.isEmpty()) View.VISIBLE else View.GONE
            if (reviews.isEmpty()) {
                binding.ratingOverall.rating = 0f
                binding.tvReviewSummary.text = getString(R.string.review_summary_empty)
            } else {
                val avg = reviews.map { it.rating }.average().toFloat()
                binding.ratingOverall.rating = avg
                binding.tvReviewSummary.text = getString(R.string.review_summary, avg, reviews.size)
            }
            Log.d(TAG, "已加载 ${reviews.size} 条评价")
        }
    }

    private fun showPublishSheet() {
        val sheet = BottomSheetDialog(this)
        val sheetBinding = SheetPublishReviewBinding.inflate(LayoutInflater.from(this))
        sheet.setContentView(sheetBinding.root)

        sheetBinding.btnSubmit.setOnClickListener {
            val nickname = sheetBinding.etNickname.text.toString().trim().ifEmpty { "匿名用户" }
            val content = sheetBinding.etContent.text.toString().trim()
            if (content.isEmpty()) {
                sheetBinding.etContent.error = getString(R.string.review_content_required)
                return@setOnClickListener
            }
            val review = ReviewEntity(
                toiletId = toiletId,
                userName = nickname,
                rating = sheetBinding.rbStars.progress.takeIf { it > 0 } ?: 5,
                content = content,
                createdAt = System.currentTimeMillis()
            )
            lifecycleScope.launch {
                (application as ToiletApp).database.reviewDao().insert(review)
                sheet.dismiss()
                Toast.makeText(this@ToiletDetailActivity, R.string.review_published, Toast.LENGTH_SHORT).show()
                loadReviews()
            }
        }
        sheet.show()
    }

    // ---------- 第四步：步行导航 ----------

    /**
     * 原理（答辩可讲）：App 间跳转用的是 Android 的隐式 Intent + URL Scheme。
     * 高德地图注册了 amapuri:// 协议，带坐标参数即可直接进入导航规划页；
     * 若手机未安装高德 App，startActivity 会抛 ActivityNotFoundException，
     * 此时回退到 uri.amap.com 网页版导航（无需任何 App）。
     */
    private fun navigateOnFoot() {
        val name = Uri.encode(toiletName.ifEmpty { "目的地" })
        val amapUri = Uri.parse(
            "amapuri://route/plan/?dlat=$toiletLat&dlon=$toiletLng&dname=$name&dev=0&t=2"
        )
        val intent = Intent(Intent.ACTION_VIEW, amapUri).apply { setPackage("com.autonavi.minimap") }
        try {
            startActivity(intent)
        } catch (e: Exception) {
            Log.w(TAG, "未检测到高德地图App，回退网页版导航", e)
            val webUri = Uri.parse("https://uri.amap.com/navigation?to=$toiletLng,$toiletLat,$name&mode=walk&src=lalmore")
            try {
                startActivity(Intent(Intent.ACTION_VIEW, webUri))
            } catch (e2: Exception) {
                Toast.makeText(this, "没有可用的浏览器", Toast.LENGTH_SHORT).show()
            }
        }
    }

    companion object {
        private const val TAG = "ToiletDetail"
        const val EXTRA_ID = "extra_id"
        const val EXTRA_NAME = "extra_name"
        const val EXTRA_ADDRESS = "extra_address"
        const val EXTRA_LAT = "extra_lat"
        const val EXTRA_LNG = "extra_lng"
    }
}
