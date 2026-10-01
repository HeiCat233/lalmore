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
import com.lalmore.toiletfinder.ui.LoginActivity
import com.lalmore.toiletfinder.ui.ReviewAdapter
import com.lalmore.toiletfinder.util.DistanceUtil
import com.lalmore.toiletfinder.util.SessionManager
import kotlinx.coroutines.launch

/**
 * 厕所详情页（点评商家页结构）：
 *   头图 + 信息白卡（星级/分数/评价数/距离/标签）+ 步行导航 + 评价流。
 *   发布评价需要登录（未登录自动跳登录页），发布带 userId 与设施标签。
 */
class ToiletDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityToiletDetailBinding
    private lateinit var reviewAdapter: ReviewAdapter
    private lateinit var session: SessionManager

    private lateinit var toiletId: String
    private var toiletLat: Double = 0.0
    private var toiletLng: Double = 0.0
    private var toiletName: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityToiletDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)
        session = SessionManager(this)

        toiletId = intent.getStringExtra(EXTRA_ID) ?: ""
        toiletName = intent.getStringExtra(EXTRA_NAME).orEmpty()
        toiletLat = intent.getDoubleExtra(EXTRA_LAT, 0.0)
        toiletLng = intent.getDoubleExtra(EXTRA_LNG, 0.0)

        binding.tvToiletName.text = toiletName.ifEmpty { getString(R.string.default_toilet_name) }
        binding.tvToiletAddress.text = getString(
            R.string.address_line,
            intent.getStringExtra(EXTRA_ADDRESS).orEmpty().ifEmpty { getString(R.string.address_unknown) },
            DistanceUtil.haversineMeters(session.getLastLat(), session.getLastLng(), toiletLat, toiletLng)
        )
        binding.btnBack.setOnClickListener { finish() }

        reviewAdapter = ReviewAdapter()
        binding.recyclerReviews.layoutManager = LinearLayoutManager(this)
        binding.recyclerReviews.adapter = reviewAdapter

        binding.btnNavigate.setOnClickListener { navigateOnFoot() }
        binding.fabWriteReview.setOnClickListener { onWriteReviewClicked() }

        loadReviews()
    }

    // ---------- 评价系统 ----------

    private fun loadReviews() {
        lifecycleScope.launch {
            val db = (application as ToiletApp).database
            val reviews = db.reviewDao().getByToiletId(toiletId)
            reviewAdapter.submitList(reviews)
            binding.tvEmptyReviews.visibility =
                if (reviews.isEmpty()) View.VISIBLE else View.GONE

            if (reviews.isEmpty()) {
                binding.ratingOverall.rating = 0f
                binding.tvScore.text = getString(R.string.score_none)
                binding.tvReviewSummary.text = getString(R.string.review_summary_empty)
                binding.tvTags.visibility = View.GONE
            } else {
                val avg = reviews.map { it.rating }.average().toFloat()
                binding.ratingOverall.rating = avg
                binding.tvScore.text = String.format("%.1f", avg)
                binding.tvReviewSummary.text =
                    getString(R.string.review_count_fmt, reviews.size)
                showTopTags(reviews)
            }
        }
    }

    /** 统计所有评价勾选的标签，取出现最多的前 3 个展示（点评"大家都在说"风格） */
    private fun showTopTags(reviews: List<ReviewEntity>) {
        val counts = reviews
            .flatMap { it.tags.split(",").map { t -> t.trim() } }
            .filter { it.isNotEmpty() }
            .groupBy { it }
            .mapValues { it.value.size }
        if (counts.isEmpty()) {
            binding.tvTags.visibility = View.GONE
            return
        }
        val top = counts.entries.sortedByDescending { it.value }.take(3)
            .joinToString("  ") { "${it.key} ×${it.value}" }
        binding.tvTags.text = top
        binding.tvTags.visibility = View.VISIBLE
    }

    private fun onWriteReviewClicked() {
        if (!session.isLoggedIn()) {
            // 未登录：引导去登录（登录成功返回后自动带上身份）
            Toast.makeText(this, R.string.login_required, Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, LoginActivity::class.java))
            return
        }
        showPublishSheet()
    }

    private fun showPublishSheet() {
        val sheet = BottomSheetDialog(this)
        val sheetBinding = SheetPublishReviewBinding.inflate(LayoutInflater.from(this))
        sheet.setContentView(sheetBinding.root)

        sheetBinding.tvIdentity.text = getString(R.string.publish_identity, session.getNickname())
        sheetBinding.btnSubmit.setOnClickListener {
            val content = sheetBinding.etContent.text.toString().trim()
            if (content.isEmpty()) {
                sheetBinding.etContent.error = getString(R.string.review_content_required)
                return@setOnClickListener
            }
            // 勾选的标签取文字，逗号拼接入库（ChipGroup 只回传 id，需反查文本）
            val tags = sheetBinding.chipGroupTags.checkedChipIds
                .mapNotNull { id ->
                    sheetBinding.root.findViewById<com.google.android.material.chip.Chip>(id)?.text?.toString()
                }
                .joinToString(",")

            val review = ReviewEntity(
                toiletId = toiletId,
                userName = session.getNickname(),
                rating = sheetBinding.rbStars.progress.takeIf { it > 0 } ?: 5,
                content = content,
                createdAt = System.currentTimeMillis(),
                userId = session.getUserId(),
                tags = tags
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

    // ---------- 步行导航（URL Scheme + 网页回退） ----------

    private fun navigateOnFoot() {
        val name = Uri.encode(toiletName.ifEmpty { getString(R.string.default_destination) })
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
                Toast.makeText(this, R.string.no_browser, Toast.LENGTH_SHORT).show()
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
