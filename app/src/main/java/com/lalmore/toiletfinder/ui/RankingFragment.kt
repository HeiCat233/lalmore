package com.lalmore.toiletfinder.ui

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.google.android.material.tabs.TabLayout
import com.lalmore.toiletfinder.R
import com.lalmore.toiletfinder.ToiletDetailActivity
import com.lalmore.toiletfinder.databinding.FragmentRankingBinding
import com.lalmore.toiletfinder.model.ToiletItem
import com.lalmore.toiletfinder.util.DistanceUtil
import com.lalmore.toiletfinder.util.SessionManager
import kotlinx.coroutines.launch

/**
 * 榜单页：好评榜（均分降序，同分按评价数）/ 热评榜（评价数降序），
 * 数据来自 Room JOIN 聚合查询，评价一发布榜单实时变化。
 */
class RankingFragment : Fragment() {

    private var _binding: FragmentRankingBinding? = null
    private val binding get() = _binding!!
    private lateinit var session: SessionManager
    private lateinit var adapter: RankingAdapter

    private var allItems: List<ToiletItem> = emptyList()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentRankingBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        session = SessionManager(requireContext())
        adapter = RankingAdapter(::openDetail)
        binding.recyclerRanking.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerRanking.adapter = adapter

        binding.tabLayout.addTab(binding.tabLayout.newTab().setText(R.string.tab_best))
        binding.tabLayout.addTab(binding.tabLayout.newTab().setText(R.string.tab_hot))
        binding.tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab) = showRanking(tab.position)
            override fun onTabUnselected(tab: TabLayout.Tab) = Unit
            override fun onTabReselected(tab: TabLayout.Tab) = Unit
        })

        binding.tabLayout.getTabAt(0)?.select()
    }

    private fun loadAndShow() {
        viewLifecycleOwner.lifecycleScope.launch {
            val db = (requireActivity().application as com.lalmore.toiletfinder.ToiletApp).database
            val userLat = session.getLastLat()
            val userLng = session.getLastLng()
            allItems = db.toiletDao().getAllWithStats()
                .map {
                    ToiletItem(
                        id = it.id, name = it.name, address = it.address,
                        lat = it.lat, lng = it.lng,
                        distanceM = DistanceUtil.haversineMeters(userLat, userLng, it.lat, it.lng),
                        rating = (it.avgRating ?: 0.0).toFloat(),
                        reviewCount = it.reviewCount
                    )
                }
            showRanking(binding.tabLayout.selectedTabPosition)
        }
    }

    private fun showRanking(tabPosition: Int) {
        val ranked = if (tabPosition == 0) {
            // 好评榜：均分降序，同分按评价数多者优先
            allItems.filter { it.reviewCount > 0 }
                .sortedWith(compareByDescending<ToiletItem> { it.rating }.thenByDescending { it.reviewCount })
        } else {
            // 热评榜：评价条数降序
            allItems.filter { it.reviewCount > 0 }
                .sortedByDescending { it.reviewCount }
        }
        binding.tvEmptyRanking.visibility = if (ranked.isEmpty()) View.VISIBLE else View.GONE
        adapter.submitList(ranked)
    }

    private fun openDetail(item: ToiletItem) {
        startActivity(Intent(requireContext(), ToiletDetailActivity::class.java).apply {
            putExtra(ToiletDetailActivity.EXTRA_ID, item.id)
            putExtra(ToiletDetailActivity.EXTRA_NAME, item.name)
            putExtra(ToiletDetailActivity.EXTRA_ADDRESS, item.address)
            putExtra(ToiletDetailActivity.EXTRA_LAT, item.lat)
            putExtra(ToiletDetailActivity.EXTRA_LNG, item.lng)
        })
    }

    override fun onResume() {
        super.onResume()
        loadAndShow()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
