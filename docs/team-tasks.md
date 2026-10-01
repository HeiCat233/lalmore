# 小组任务认领清单（方案 A：真实协作）· v2

> 主体功能（点评式界面/登录/排行榜/地图/评价）已由组长完成。以下收尾模块按大作业要求
> 拆给组员认领，每人 1~2 项，**用自己电脑、自己的 GitHub 账号**提交——Git 协同评分
> 看的是多人提交的真实痕迹，必须本人操作。
> 当前代码结构：MainActivity 是 Fragment 宿主（首页/榜单/我的），数据层在 `data/`，
> 共享数据流水线在 `util/ToiletRepository.kt`，先读 `docs/step1-guide.md` 熟悉项目。

## 每人必做的准备工作（第一次参与前）

```bash
git clone https://github.com/HeiCat233/lalmore.git
cd lalmore
git checkout -b feature/你的模块名   # 英文小写+连字符
# 用 Android Studio 打开项目，Gradle Sync 成功后再动手
```

提交规范见 `docs/team-git-workflow.md`。完成后 push 分支 → 发 Pull Request → 找组长或
另一名组员 review 后合并。

## 认领任务列表

### 任务 1：深色模式（建议：成员 B，UI 方向）

- **目标**：新增 `res/values-night/colors.xml`，在保持蓝绿品牌色的前提下提供深色适配
  （背景 `#121212`、卡片 `#1E1E1E`、文字反白）；检查首页/榜单/详情/登录四页在深色下的可读性。
- **提示**：`colors.xml` 里 `bg_gray/text_dark/text_gray` 这三个颜色做 night 版本即可，
  布局代码不用动——这正是资源限定符的威力，答辩可讲。
- **验收**：系统切深色模式后四页无刺眼白块、文字清晰可读。

### 任务 2：收藏厕所（建议：成员 A，数据方向）

- **目标**：数据库升 v3 加 `is_collected` 列（或建 `favorites` 表）；详情页导航按钮旁
  加"收藏"图标切换；"我的"页已有一个"收藏"占位（`my_collection_label`），替换为真实
  数量并点击展示收藏列表。
- **提示**：Room 升版本记得写 `Migration(2,3)` 或继续开发期 `fallbackToDestructiveMigration`；
  收藏列表可直接复用 `ToiletDao.getAllWithStats()` 的思路加 WHERE 条件。
- **验收**：收藏后"我的"页数量 +1；取消收藏数量 -1；杀掉 App 重开数据仍在。

### 任务 3：README 与项目主页（建议：成员 C，文档方向）

- **目标**：根目录 `README.md`：项目简介、功能截图（真机截图，放 `docs/img/`）、技术栈表、
  运行方法（填 Key 步骤引用 `docs/step1-guide.md`）、小组成员分工表、界面结构说明
  （3 Tab + 地图页 + 登录页）。
- **验收**：GitHub 仓库首页展示正常、图片可加载。

### 任务 4：测试记录表（建议：成员 C，文档方向）

- **目标**：实机执行并写 `docs/test-records.md`（功能×步骤×预期×实际×截图编号），重点覆盖：
  - 未登录点"写评价"→ 被引导登录 → 登录后自动带昵称发布；
  - 注册重复用户名 → 被拒绝；密码 <6 位 → 被拒绝；
  - 退出登录后再看榜单/我的页状态；
  - 发评价勾选标签 → 详情页"大家都在说"标签计数变化；
  - 断网搜索失败提示；未装高德地图时导航回退网页版。
- **验收**：表格完整，附 3~5 张关键截图。

## 组长（你）要做的

1. 推送代码后在 GitHub 建 4 个 Issue（目标/验收/认领人）；
2. 组员 PR **本人 review 留言**再 Merge（Git 分数关键证据）；
3. 建 GitHub Project 看板（To do / In progress / Done）拖动管理。
