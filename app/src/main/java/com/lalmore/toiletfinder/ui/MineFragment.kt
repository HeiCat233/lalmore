package com.lalmore.toiletfinder.ui

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.lalmore.toiletfinder.R
import com.lalmore.toiletfinder.ToiletApp
import com.lalmore.toiletfinder.databinding.FragmentMineBinding
import com.lalmore.toiletfinder.util.SessionManager
import kotlinx.coroutines.launch

/**
 * 我的页：未登录显示登录引导；已登录显示头像/昵称 + 我的评价数 + 退出登录。
 */
class MineFragment : Fragment() {

    private var _binding: FragmentMineBinding? = null
    private val binding get() = _binding!!
    private lateinit var session: SessionManager

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMineBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        session = SessionManager(requireContext())

        binding.profileArea.setOnClickListener {
            if (!session.isLoggedIn()) {
                startActivity(Intent(requireContext(), LoginActivity::class.java))
            }
        }
        binding.rowDemo.setOnClickListener {
            AlertDialog.Builder(requireContext())
                .setTitle(R.string.demo_confirm_title)
                .setMessage(R.string.demo_confirm_msg)
                .setPositiveButton(R.string.do_generate) { _, _ ->
                    viewLifecycleOwner.lifecycleScope.launch {
                        val summary = com.lalmore.toiletfinder.util.DemoDataGenerator.generate(requireContext())
                        android.widget.Toast.makeText(requireContext(), summary, android.widget.Toast.LENGTH_LONG).show()
                        refresh()
                    }
                }
                .setNegativeButton(R.string.cancel, null)
                .show()
        }
        binding.rowLogout.setOnClickListener {
            AlertDialog.Builder(requireContext())
                .setTitle(R.string.logout_confirm_title)
                .setMessage(R.string.logout_confirm_msg)
                .setPositiveButton(R.string.logout) { _, _ ->
                    session.clearLogin()
                    refresh()
                }
                .setNegativeButton(R.string.cancel, null)
                .show()
        }
    }

    private fun refresh() {
        val loggedIn = session.isLoggedIn()
        val nickname = session.getNickname()

        binding.tvNickname.text = if (loggedIn) nickname else getString(R.string.mine_not_logged_in)
        binding.tvSubTitle.text = if (loggedIn) {
            getString(R.string.mine_logged_in_tip, session.getUsername())
        } else {
            getString(R.string.mine_guest_tip)
        }
        binding.rowLogout.visibility = if (loggedIn) View.VISIBLE else View.GONE

        if (loggedIn) {
            // 头像取昵称首字
            binding.tvAvatar.text = nickname.take(1).uppercase()
            viewLifecycleOwner.lifecycleScope.launch {
                val db = (requireActivity().application as ToiletApp).database
                val count = db.reviewDao().countByUserId(session.getUserId())
                binding.tvMyReviewCount.text = count.toString()
            }
        } else {
            binding.tvAvatar.text = "?"
            binding.tvMyReviewCount.text = "0"
        }
    }

    override fun onResume() {
        super.onResume()
        refresh()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
