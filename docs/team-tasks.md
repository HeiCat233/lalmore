# 小组任务认领清单（方案 A：真实协作）

> 主体功能已由组长完成并推送。以下收尾模块按大作业要求拆给组员认领，
> 每人认领 1~2 项，**用自己电脑、自己的 GitHub 账号**完成提交——Git 协同评分
> 看的就是多人提交的真实痕迹，所以必须本人操作，不要把代码发给别人代交。

## 每人必做的准备工作（第一次参与前）

```bash
# 1. 克隆仓库（登录自己的 GitHub 账号）
git clone https://github.com/HeiCat233/lalmore.git
cd lalmore

# 2. 从最新 main 拉出自己的功能分支（分支名=feature/你的模块名）
git checkout -b feature/settings-page

# 3. 用 Android Studio 打开项目，等 Gradle Sync 成功后再动手
```

提交规范见 `docs/team-git-workflow.md`（feat/docs 前缀、一行讲清改动）。
完成后 push 分支 → 在 GitHub 上发 Pull Request → 找组长或另一名组员 review。

---

## 认领任务列表

### 任务 1：设置页（建议：成员 B，UI 方向）

- **目标**：新增 `SettingsActivity`，含两项功能：① 清空本地评价数据（调 `ReviewDao`，
  新增一条 `@Query("DELETE FROM reviews")` 即可）；② 显示"关于"信息（App 版本、小组成员、数据来源声明）。
- **涉及文件**：新建 `SettingsActivity.kt` + `activity_settings.xml`；在 `AndroidManifest.xml`
  注册；`MainActivity` 加一个设置入口按钮（右上角小图标即可）。
- **验收**：能进入设置页 → 点清空后详情页评价列表变空 → 返回键正常退出。

### 任务 2：搜索半径切换（建议：成员 A，地图方向）

- **目标**：主界面加一个简单的半径选择（1km / 3km / 5km，`PopupMenu` 或三个 Chip），
  选择后用新的半径重新发起 `PoiSearch.SearchBound` 搜索，并把选择存进 `PrefsHelper`。
- **涉及文件**：`MainActivity.searchNearbyToilets()`（把写死的 3000 改成变量）、
  `PrefsHelper` 加 `saveSearchRadius/getSearchRadius`、`activity_main.xml` 加入口。
- **验收**：切到 1km 后列表数量变少且重新排序；重启 App 后记住上次选择。

### 任务 3：README 与项目主页（建议：成员 C，文档方向）

- **目标**：写根目录 `README.md`：项目简介、功能截图（自己真机截图）、技术栈表、
  运行方法（填 Key 步骤引用 `docs/step1-guide.md`）、小组成员分工表。
- **验收**：GitHub 仓库首页展示正常，图片能加载（截图提交到 `docs/img/` 目录）。

### 任务 4：测试记录表（建议：成员 C，文档方向）

- **目标**：按 `docs/report-outline.md` 第 6 章的测试维度，实机执行并把结果写成
  `docs/test-records.md` 表格（功能×步骤×预期×实际×截图编号），至少覆盖：
  定位授权拒绝后的提示、断网时搜索失败的提示、发布空评价的校验、未装高德时的网页导航回退。
- **验收**：表格完整，附 2~3 张关键截图。

---

## 组长（你）要做的

1. 推送当前代码后，在 GitHub 仓库把 4 个任务发成 **4 个 Issue**（模板：目标/验收/认领人）；
2. 组员发 PR 后**本人 review**，留评论再 Merge（这一步是 Git 分数的关键证据）；
3. 项目中期在 GitHub 建一个 **Project 看板**（To do / In progress / Done）拖动卡片，管理痕迹更丰富。
