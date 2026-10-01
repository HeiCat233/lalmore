package com.lalmore.toiletfinder

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.lalmore.toiletfinder.databinding.ActivityMainBinding
import com.lalmore.toiletfinder.ui.HomeFragment
import com.lalmore.toiletfinder.ui.MineFragment
import com.lalmore.toiletfinder.ui.RankingFragment

/**
 * 主框架：底部导航宿主（首页 / 榜单 / 我的）。
 * 采用 Fragment 替换式切换，公共方法 switchToTab 供首页金刚区跳转榜单使用。
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> switchToTab(HomeFragment())
                R.id.nav_ranking -> switchToTab(RankingFragment())
                R.id.nav_mine -> switchToTab(MineFragment())
            }
            true
        }

        if (savedInstanceState == null) {
            switchToTab(HomeFragment())
        }
    }

    fun switchToTab(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }

    /** 首页金刚区跳榜单：切到指定 Tab（按 menu id） */
    fun switchToTabById(menuItemId: Int) {
        binding.bottomNav.selectedItemId = menuItemId
    }
}
