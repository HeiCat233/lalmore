package com.lalmore.toiletfinder.ui

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.lalmore.toiletfinder.R
import com.lalmore.toiletfinder.data.UserEntity
import com.lalmore.toiletfinder.databinding.ActivityLoginBinding
import com.lalmore.toiletfinder.util.PasswordUtil
import com.lalmore.toiletfinder.util.SessionManager
import kotlinx.coroutines.launch

/**
 * 登录/注册页：一个页面两种模式（点底部文字切换），注册成功即自动登录。
 * 密码经「盐 + SHA-256」哈希后入库，登录时对输入做同样哈希比对。
 */
class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding
    private lateinit var session: SessionManager
    private var isRegisterMode = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        session = SessionManager(this)

        setMode(false)

        binding.btnSubmit.setOnClickListener { submit() }
        binding.tvSwitchMode.setOnClickListener { setMode(!isRegisterMode) }
    }

    private fun setMode(register: Boolean) {
        isRegisterMode = register
        binding.layoutNickname.visibility =
            if (register) android.view.View.VISIBLE else android.view.View.GONE
        binding.btnSubmit.text = getString(if (register) R.string.do_register else R.string.do_login)
        binding.tvSwitchMode.text =
            getString(if (register) R.string.switch_to_login else R.string.switch_to_register)
        binding.tvTitle.text = getString(if (register) R.string.register_title else R.string.login_title)
    }

    private fun submit() {
        val username = binding.etUsername.text.toString().trim()
        val password = binding.etPassword.text.toString()
        val nickname = binding.etNickname.text.toString().trim().ifEmpty { username }

        if (username.length < 3) {
            binding.etUsername.error = getString(R.string.username_too_short)
            return
        }
        if (password.length < 6) {
            binding.etPassword.error = getString(R.string.password_too_short)
            return
        }

        lifecycleScope.launch {
            try {
                val db = (application as com.lalmore.toiletfinder.ToiletApp).database
                if (isRegisterMode) {
                    if (db.userDao().findByUsername(username) != null) {
                        binding.etUsername.error = getString(R.string.username_taken)
                        return@launch
                    }
                    val salt = PasswordUtil.newSalt()
                    val user = UserEntity(
                        username = username,
                        passwordHash = PasswordUtil.hash(password, salt),
                        salt = salt,
                        nickname = nickname,
                        createdAt = System.currentTimeMillis()
                    )
                    db.userDao().insert(user)
                    val saved = db.userDao().findByUsername(username)!!
                    session.saveLogin(saved.id, saved.username, saved.nickname)
                    toast(getString(R.string.register_ok_welcome, saved.nickname))
                } else {
                    val user = db.userDao().findByUsername(username)
                    if (user == null || PasswordUtil.hash(password, user.salt) != user.passwordHash) {
                        toast(getString(R.string.login_failed))
                        return@launch
                    }
                    session.saveLogin(user.id, user.username, user.nickname)
                    toast(getString(R.string.login_ok_welcome, user.nickname))
                }
                finish()
            } catch (e: Exception) {
                toast("出错了：${e.message}")
            }
        }
    }

    private fun toast(msg: String) = Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
}
