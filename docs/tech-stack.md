# 「附近厕所」技术栈与项目结构说明

> 阅读对象：小组成员 / 答辩评委。本文档同时是大作业报告「系统架构与技术选型」章节的底稿。
> 更新于 2026-10-01，与仓库 28 号提交（9c28acd）状态一致。

---

## 一、技术栈选型总览

| 层次 | 技术 | 版本 | 为什么选它（不重复造轮子） |
|---|---|---|---|
| 开发语言 | **Kotlin** | 2.0.21 | Google 官方首选：空安全杜绝 NPE、协程简化异步、扩展函数让代码更短 |
| 构建系统 | **Gradle + AGP** | Gradle 8.9 / AGP 8.7.3 | Android 官方构建体系；依赖走**阿里云镜像**加速国内同步 |
| UI 体系 | **View 体系 + ViewBinding + Material 3** | material 1.12.0 | 不用 Compose 的理由：XML 与设计稿一一对应、初学可读性高、资料最全。Material 组件白送：底部导航、卡片、Chip、ToggleGroup、BottomSheet |
| 页面组织 | **单 Activity 宿主 + Fragment** | — | MainActivity 只做底部导航容器，首页/榜单/我的各是一个 Fragment；Activity 之间跳转用 Intent |
| 异步模型 | **Kotlin 协程** | coroutines-android 1.8.1 | `lifecycleScope.launch` + `suspend` 函数，数据库/网络回调不卡主线程，比手写线程池优雅 |
| 本地数据库 | **Room（SQLite ORM）** | 2.6.1 | 编译期校验 SQL、注解处理器（KSP）自动生成实现类，免去 SQLiteOpenHelper 模板代码 |
| 注解处理 | **KSP** | 2.0.21-1.0.28 | Kotlin 首选符号处理器（替代 kapt），编译更快 |
| 地图/定位/POI | **高德开放平台 SDK（三合一组合包）** | 11.3.100_loc11.3.000_sea9.8.1 | 定位、3D 地图、POI 检索、逆地理编码一站搞定，免费配额对课程项目绰绰有余。⚠️ 必须用组合包：三个独立包内嵌相同公共类会 Duplicate class 冲突 |
| 依赖注入 | 无框架，**手写单例** | — | 课程项目规模下，`AppDatabase.getInstance()` / `ToiletRepository` object 单例足够，不引入 Hilt 增加心智负担 |
| 密码安全 | **SHA-256 + 随机盐** | — | 不存明文：每用户独立盐，彩虹表失效（生产应换 BCrypt/Argon2，报告中已说明） |
| 导航跳转 | **URL Scheme 深链** | — | `amapuri://route/plan/` 唤起高德 App 步行导航，未装则回退网页版——不引入重量级导航 SDK |
| 版本管理 | **Git + GitHub** | — | 分支 + PR + 规范 commit（见 docs/team-git-workflow.md） |

## 二、项目目录结构

```
lalmore/                                  ← 仓库根目录
├── settings.gradle.kts                   ← 仓库源配置（阿里云镜像优先）+ 项目名 NearbyToilet
├── build.gradle.kts                      ← 插件版本声明（AGP/Kotlin/KSP）
├── gradle.properties                     ← 构建参数（AndroidX、2G JVM 内存）
├── gradle/wrapper/                       ← Gradle Wrapper（distributionUrl 走腾讯镜像）
├── gradlew.bat / gradlew                 ← 构建入口脚本
├── local.properties                      ← SDK 路径（不入 Git）
├── docs/                                 ← 全部文档
│   ├── step1-guide.md                    ← 环境搭建与高德Key申请手册
│   ├── team-git-workflow.md              ← 团队 Git 协作规范
│   ├── team-tasks.md                     ← 组员任务认领清单（v2）
│   ├── report-outline.md                 ← 大作业报告写作提纲
│   └── tech-stack.md                     ← 本文档
└── app/
    ├── build.gradle.kts                  ← 应用模块：SDK 版本、依赖清单、ViewBinding
    ├── proguard-rules.pro                ← 混淆规则（高德 keep 规则）
    └── src/main/
        ├── AndroidManifest.xml           ← 权限声明、四个组件注册、高德 Key
        ├── java/com/lalmore/toiletfinder/
        │   ├── ToiletApp.kt              ← 全局 Application：高德三SDK隐私合规 + 数据库单例
        │   ├── MainActivity.kt           ← 底部导航宿主（首页/榜单/我的 三个 Fragment）
        │   ├── ToiletDetailActivity.kt   ← 厕所详情页：指标卡/标签统计/评价流/步行导航
        │   ├── data/                     ← 【数据层】Room 三表 + DAO
        │   │   ├── ToiletEntity.kt       ←   toilets 表（POI 缓存）
        │   │   ├── ReviewEntity.kt       ←   reviews 表（评价 + 三项指标）
        │   │   ├── UserEntity.kt         ←   users 表（本地账号）
        │   │   ├── ToiletWithStats.kt    ←   JOIN 聚合结果（均分+评价数）
        │   │   ├── ToiletDao.kt          ←   toilets 的增查（含 LEFT JOIN 聚合查询）
        │   │   ├── ReviewDao.kt          ←   reviews 的增查删、按厕所/按用户查
        │   │   ├── UserDao.kt            ←   users 的注册与登录查询
        │   │   └── AppDatabase.kt        ←   Room 数据库单例（v3）
        │   ├── model/
        │   │   └── ToiletItem.kt         ← UI 层数据模型（POI/数据库 → 列表卡片）
        │   ├── ui/                       ← 【界面层】各页面
        │   │   ├── HomeFragment.kt       ←   首页：城市栏+搜索+金刚区+信息流
        │   │   ├── HomeAdapter.kt        ←   首页信息流适配器（DiffUtil 增量刷新）
        │   │   ├── RankingFragment.kt    ←   榜单页：好评榜/热评榜
        │   │   ├── RankingAdapter.kt     ←   榜单适配器（金银铜奖牌）
        │   │   ├── MineFragment.kt       ←   我的：登录态展示/我的评价数/演示数据入口
        │   │   ├── LoginActivity.kt      ←   登录/注册双模式页
        │   │   ├── MapActivity.kt        ←   全屏地图页：蓝点+POI搜索+Marker
        │   │   ├── ReviewAdapter.kt      ←   评价流适配器
        │   │   └── ToiletBlockColors.kt  ←   四色取色器（列表卡片与详情头图同色）
        │   └── util/                     ← 【工具层】
        │       ├── ToiletRepository.kt   ←   数据流水线单例（定位→逆地理→POI→缓存→聚合）
        │       ├── DemoDataGenerator.kt  ←   演示数据一键生成（测试账号+随机评价）
        │       ├── DistanceUtil.kt       ←   Haversine 球面距离（排序依据）
        │       ├── SessionManager.kt     ←   登录态/最近定位/搜索历史（SharedPreferences）
        │       └── PasswordUtil.kt       ←   SHA-256 加盐哈希
        └── res/
            ├── layout/                   ← 11 个布局文件（页面×7 + 列表项×3 + 弹窗×1）
            ├── menu/bottom_nav.xml       ← 底部导航菜单（首页/榜单/我的）
            ├── drawable/                 ← 渐变背景、四色卡片、奖牌徽章、矢量图标
            ├── values/                   ← strings.xml / colors.xml / themes.xml
            └── mipmap-anydpi-v26/        ← 自适应启动图标（定位针）
```

## 三、架构与数据流

### 3.1 三层架构

```
┌─────────────── 界面层 ───────────────┐
│ Fragment×3 + Activity×3 + Adapter×3  │  只负责展示与交互
└──────────────┬───────────────────────┘
               │ suspend 函数 / 回调
┌──────────────▼───────────────────────┐
│        ToiletRepository（数据仓库）    │  统一数据出口，首页/地图/榜单共用
│  定位 → 逆地理 → POI检索 → 转换/排序   │
└──────────────┬───────────────────────┘
               │ suspend
┌──────────────▼───────────────────────┐
│   数据层：Room（toilets/reviews/users）│  持久化 + JOIN 聚合
│   外部服务：高德 SDK（定位/搜索/地图）  │
└──────────────────────────────────────┘
```

### 3.2 核心数据流水线（搜索一次厕所的全过程）

```
AMapLocationClient 定位（GPS/WiFi/基站混合）
   ↓ 拿到经纬度
city 为空？→ GeocodeSearch 逆地理编码补「昆明市·呈贡区」
   ↓
PoiSearch.SearchBound(当前位置, 3km) 检索"公共厕所"
   ↓ 每条 PoiItem
转 ToiletItem → Haversine 算距离 → 按距离升序
   ↓
Room 缓存：toilets 表按 uid 覆盖写入（数据存储评分点）
   ↓
LEFT JOIN reviews 聚合：平均分 + 评价数（一条 SQL，防 N+1 查询）
   ↓
ListAdapter（DiffUtil）增量刷新 UI / 地图批量打 Marker
```

### 3.3 评价与指标流（UGC 模式）

```
发布评价（需登录）＝ 星级 + 文字 + 标签(Chip多选) + 三指标(ToggleGroup单选)
   ↓
reviews 表落库（userId、tags、paperStatus/sinkType/cleaned）
   ↓ ┌── 详情页指标卡：结论=最近一条评价的指标，统计=所有人占比
     ├── 详情页标签区："大家都在说"取出现最多的 Top3
     └── 榜单页：好评榜(均分降序) / 热评榜(条数降序)，实时变化
```

## 四、数据库设计（Room v3）

```
users（本地账号）                toilets（POI 缓存）
├─ id          PK 自增          ├─ id        PK ← 高德 POI uid
├─ username    唯一索引          ├─ name / address
├─ passwordHash  ← SHA-256+盐   ├─ lat / lng
├─ salt                          └─ createdAt
├─ nickname                          │
└─ createdAt                         │ 1
                                     │
                    reviews（评价）   │ N
                    ├─ id          PK 自增
                    ├─ toiletId    ←── 关联 toilets.id
                    ├─ userId      ←── 关联 users.id
                    ├─ userName / rating / content / createdAt
                    ├─ tags        逗号分隔标签
                    └─ paperStatus / sinkType / cleaned   ← v3 三项指标
```

- **paperStatus**：-1 未填 / 0 没纸 / 1 偶尔有 / 2 充足
- **sinkType**：-1 未填 / 0 无 / 1 公共 / 2 独立
- **cleaned**：-1 未填 / 0 无专人 / 1 有专人
- 版本演进：v1(两表) → v2(+users, +userId/tags) → v3(+三指标列)，开发期用破坏式迁移，上线前应写正式 Migration（报告展望）

## 五、关键技术点速查（答辩问答准备）

| 问题 | 答案要点 | 代码位置 |
|---|---|---|
| 为什么"附近"按你的算法排而不是高德默认？ | 自己用 Haversine 球面距离重算并升序排序，不信任 POI 默认权重 | `DistanceUtil.kt` |
| 为什么地图会白屏/定位失败？ | 高德强制隐私合规 API 必须先调；Key 与包名+SHA1 绑定 | `ToiletApp.kt` / Manifest |
| 为什么用组合包？ | 三个独立高德包内嵌相同公共类，dex 合并时 Duplicate class 冲突 | `app/build.gradle.kts` |
| 数据库为什么用 Room 不直接写 SQLite？ | 编译期校验 SQL、自动映射实体、配合 KSP 零反射 | `data/` 目录 |
| 列表为什么用 ListAdapter 不用 RecyclerView.Adapter？ | 内置 DiffUtil 差量刷新，滚动不闪烁 | `HomeAdapter.kt` |
| 首页为什么先有数据后定位？ | 冷启动先读 Room 缓存秒出列表，定位+POI 回来后覆盖刷新（缓存优先策略） | `HomeFragment.kt` |
| 密码怎么存的？ | 每用户随机盐 + SHA-256(salt+password)，登录时重算比对 | `PasswordUtil.kt` |
| 导航怎么实现的？ | 隐式 Intent 匹配 `amapuri://` scheme，ActivityNotFoundException 时回退 uri.amap.com 网页版 | `ToiletDetailActivity.navigateOnFoot()` |
