package com.lalmore.toiletfinder.ui

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.lalmore.toiletfinder.MainActivity
import com.lalmore.toiletfinder.R
import com.lalmore.toiletfinder.ToiletDetailActivity
import com.lalmore.toiletfinder.databinding.FragmentHomeBinding
import com.lalmore.toiletfinder.model.ToiletItem
import com.lalmore.toiletfinder.util.SessionManager
import com.lalmore.toiletfinder.util.ToiletRepository
import kotlinx.coroutines.launch

/**
 * 首页（点评式信息流）：
 * 冷启动先读 Room 缓存秒出列表，同时定位 → POI 周边搜索刷新最新数据；
 * 搜索框在内存中实时过滤；金刚区提供 地图/榜单/搜索历史 三大入口。
 */
class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    private lateinit var session: SessionManager
    private lateinit var adapter: HomeAdapter

    private var allItems: List<ToiletItem> = emptyList()
    private var userLat: Double = 0.0
    private var userLng: Double = 0.0

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        session = SessionManager(requireContext())
        userLat = session.getLastLat()
        userLng = session.getLastLng()

        adapter = HomeAdapter(::openDetail)
        binding.recyclerHome.layoutManager = LinearLayoutManager(requireContext())
        binding.recyclerHome.adapter = adapter

        setupSearch()
        setupKongArea()

        // 1) 先用缓存秒出列表；2) 定位后发起最新搜索覆盖
        lifecycleScope.launch { refreshFromCache() }
        locateAndSearch()
    }

    private fun setupSearch() {
        binding.etSearch.addTextChangedListener(object : android.text.TextWatcher {
            override fun afterTextChanged(s: android.text.Editable?) = applyFilter(s?.toString().orEmpty())
            override fun beforeTextChanged(s: CharSequence?, a: Int, b: Int, c: Int) = Unit
            override fun onTextChanged(s: CharSequence?, a: Int, b: Int, c: Int) = Unit
        })
    }

    private fun applyFilter(keyword: String) {
        val kw = keyword.trim()
        adapter.submitList(if (kw.isEmpty()) allItems else allItems.filter {
            it.name.contains(kw) || it.address.contains(kw)
        })
    }

    private fun setupKongArea() {
        binding.kongMap.setOnClickListener {
            startActivity(Intent(requireContext(), MapActivity::class.java))
        }
        binding.kongRanking.setOnClickListener {
            (requireActivity() as MainActivity).switchToTabById(R.id.nav_ranking)
        }
        binding.kongHistory.setOnClickListener { showSearchHistory() }
    }

    private fun showSearchHistory() {
        val history = session.getSearchHistory()
        if (history.isEmpty()) {
            android.widget.Toast.makeText(requireContext(), R.string.history_empty, android.widget.Toast.LENGTH_SHORT).show()
            return
        }
        AlertDialog.Builder(requireContext())
            .setTitle(R.string.history_title)
            .setAdapter(
                ArrayAdapter(requireContext(), android.R.layout.simple_list_item_1, history)
            ) { _, which ->
                binding.etSearch.setText(history[which])
                binding.etSearch.setSelection(history[which].length)
            }
            .setNegativeButton(R.string.cancel, null)
            .show()
    }

    private fun locateAndSearch() {
        ToiletRepository.locate(requireContext()) { lat, lng, city, district ->
            userLat = lat
            userLng = lng
            session.saveLocation(lat, lng, city, district)
            val cityText = listOf(city, district).filter { it.isNotEmpty() }.joinToString("·")
            binding.tvCity.text = cityText.ifEmpty { getString(R.string.city_unknown) }
            ToiletRepository.searchNearby(requireContext(), lat, lng) { items ->
                allItems = items
                applyFilter(binding.etSearch.text.toString())
                Log.d("HomeFragment", "首页数据刷新: ${items.size} 条")
            }
        }
    }

    /** 从 Room 聚合缓存刷新（返回首页时评价可能已变化） */
    private suspend fun refreshFromCache() {
        if (userLat == 0.0 && userLng == 0.0) return
        val cached = ToiletRepository.loadFromCache(requireContext(), userLat, userLng)
        if (cached.isNotEmpty()) {
            allItems = cached
            applyFilter(binding.etSearch.text.toString())
        }
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
        viewLifecycleOwner.lifecycleScope.launch { refreshFromCache() }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
