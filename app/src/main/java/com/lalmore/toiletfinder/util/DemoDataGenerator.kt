package com.lalmore.toiletfinder.util

import android.content.Context
import com.lalmore.toiletfinder.ToiletApp
import com.lalmore.toiletfinder.data.ReviewEntity
import com.lalmore.toiletfinder.data.UserEntity
import kotlin.random.Random

/**
 * 演示数据一键生成（答辩演示神器）：
 * 1. 注册 3 个测试账号（demo01~03 / 123456），登录演示可直接用；
 * 2. 清空旧评价，为 toilets 表的每间厕所生成 2~5 条带指标的评价。
 * 重复点击即"重新生成"，随时恢复新鲜演示环境。
 */
object DemoDataGenerator {

    private const val DEMO_PASSWORD = "123456"
    private val DEMO_USERS = listOf("demo01", "demo02", "demo03")

    private val NICKNAME_POOL = listOf(
        "探路小分队", "晨跑达人", "小圆圆", "老王进城", "奶茶不加糖",
        "今天也要加油", "大胃口琳琳", "夜猫子阿伟", "干爽星人", "路过的大学生",
        "宝妈小何", "附近的邻居", "拖鞋侠", "地标收集者", "讲卫生的小张"
    )

    private val CONTENT_POOL = listOf(
        "环境干净，纸巾充足，强烈推荐！",
        "位置好找，就在路口指示牌旁边。",
        "味道控制得不错，应该有专人定期清理。",
        "高峰期要排队，早上去人少体验更好。",
        "没有独立洗手台，但整体还算干净。",
        "晚上灯有点暗，一个人去的话注意安全。",
        "免费厕所里的天花板，五星好评！",
        "纸经常没有，建议大家自备纸巾。",
        "保洁很勤快，随时都能看到有人在打扫。",
        "就在公园侧门，跑步途中解决刚需很方便。",
        "洗手台水压有点小，干手器也是坏的。",
        "地方不大，但胜在干净整洁。",
        "新装修过的，没有异味，点赞。",
        "门锁有点松，其他都还行。",
        "通风很好，进来没有想象中的味道。",
        "带娃出门的救星，里面有母婴台。",
        "地面有水渍，走路小心滑。",
        "隔间数量多，基本不用等。",
        "旁边就是垃圾桶，扔纸方便。",
        "指示牌不太明显，找了一小会儿。"
    )

    private val TAG_POOL = listOf("纸巾充足", "干净卫生", "免费", "好找", "不用排队")

    /** 生成演示数据，返回摘要文案（在调用方 Toast） */
    suspend fun generate(context: Context): String {
        val db = (context.applicationContext as ToiletApp).database

        // 1. 确保测试账号存在（幂等）
        DEMO_USERS.forEach { username ->
            if (db.userDao().findByUsername(username) == null) {
                val salt = PasswordUtil.newSalt()
                db.userDao().insert(
                    UserEntity(
                        username = username,
                        passwordHash = PasswordUtil.hash(DEMO_PASSWORD, salt),
                        salt = salt,
                        nickname = "$username 体验官",
                        createdAt = System.currentTimeMillis()
                    )
                )
            }
        }
        val demoUsers = DEMO_USERS.mapNotNull { db.userDao().findByUsername(it) }

        // 2. 清空旧评价
        db.reviewDao().deleteAll()

        // 3. 为每间厕所生成 2~5 条带指标的评价
        val random = Random(System.currentTimeMillis())
        val now = System.currentTimeMillis()
        val dayMillis = 24L * 3600 * 1000
        val toilets = db.toiletDao().getAll()
        val reviews = mutableListOf<ReviewEntity>()

        toilets.forEach { toilet ->
            val count = 2 + random.nextInt(4)
            repeat(count) {
                val user = demoUsers.random()
                reviews += ReviewEntity(
                    toiletId = toilet.id,
                    userName = user.nickname,
                    // 星级加权 3~5，偶尔 2 星，让榜单有真实层次
                    rating = listOf(5, 5, 4, 4, 4, 3, 3, 2).random(random),
                    content = CONTENT_POOL.random(random),
                    createdAt = now - random.nextLong(30 * dayMillis),
                    userId = user.id,
                    tags = TAG_POOL.shuffled(random).take(1 + random.nextInt(3)).joinToString(","),
                    // 指标：有纸/有专人偏正面，洗手台以公共为主
                    paperStatus = listOf(2, 2, 2, 1, 1, 0).random(random),
                    sinkType = listOf(1, 1, 1, 2, 0).random(random),
                    cleaned = listOf(1, 1, 1, 0).random(random)
                )
            }
        }
        db.reviewDao().insertAll(reviews)
        return "已为 ${toilets.size} 间厕所生成 ${reviews.size} 条评价（含指标）"
    }
}
