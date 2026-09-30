# 团队 Git 协作规范（对应评分项：团队协同开发工具使用 10 分）

> 评分标准要求「使用 git 进行源代码管理，根据管理情况给分」。
> 「管理情况」看的是：提交历史是否真实、规范、多人协作痕迹是否清晰。
> 这份规范就是我们组的团队源代码管理约定，报告里直接引用。

## 1. 分支模型

```
main            ← 始终保持可运行，只接受 PR 合并，禁止直接 push
feature/xxx     ← 每个人的每个功能点一个分支，做完走 PR 合回 main
```

常用操作：

```bash
# 开始新功能前，先从最新 main 拉出分支
git checkout main && git pull
git checkout -b feature/poi-search        # 分支名用英文小写+连字符

# 干完活推上去，然后到 GitHub 上发 Pull Request
git add . && git commit -m "feat: 实现POI周边搜索" && git push -u origin feature/poi-search
```

## 2. Commit 信息规范（conventional commits 简化版）

格式：`类型: 中文描述`，一行讲清「做了什么」。

| 类型 | 用途 |
|---|---|
| `feat` | 新功能 |
| `fix` | 修 bug |
| `docs` | 只改文档（报告、手册） |
| `style` | 只改格式/布局，不改逻辑 |
| `refactor` | 重构，不改功能 |
| `chore` | 构建、依赖、配置类杂项 |

好的例子：`feat: 评价弹窗支持1~5星打分`、`fix: 修复定位权限被拒后蓝点仍显示`
坏的例子：`update`、`111`、`修改了一堆东西`（这类提交会被要求重做）

## 3. Pull Request 流程

1. 推送 feature 分支到 GitHub，点 **Compare & pull request**。
2. PR 标题=commit 规范格式，描述里写清：做了什么、怎么验证的（最好贴截图）。
3. **至少 1 名队友 review 并 approve** 才能点 Merge（小问题留 comment 让作者改）。
4. 合并方式选 **Merge commit**（保留分支历史，git log 更丰富）。
5. 合完删掉远端 feature 分支。

## 4. 分工建议（2~4 人）

| 角色 | 负责模块 | 涉及文件 |
|---|---|---|
| 成员 A | 地图 + 定位 + POI 搜索 | MainActivity、高德 SDK 调用层 |
| 成员 B | UI 界面 + Room 数据层 + 评价系统 | res/、data/、详情页、弹窗 |
| 成员 C | 导航跳转 + 大作业报告 + 演示材料 + 原理汇报 | docs/、报告 docx、PPT |

三人共同参与：每人至少 5 个规范 commit、至少发起 2 个 PR、review 队友的 PR。
这样 git log 里每个人、每个模块都有清晰的多人协作痕迹。

## 5. 遇到冲突怎么办

- 两个分支改了同一个文件的同一处 → GitHub 会提示 conflict。
- 在自己分支执行 `git pull origin main`，手动解决冲突文件后 commit，再推上去。
- 解决原则：以「功能正确 + 双方意图都保留」为准，不确定就拉队友当面看。

## 6. 评分自查表

- [ ] 仓库不是一个人的 commit（多人、多分支）
- [ ] commit 信息全部符合规范，没有 `update`、`111` 这类
- [ ] 有 PR 合并记录，且 PR 有队友的 review 评论
- [ ] 有 issue（可用来记录待办和 bug，顺手加分）
- [ ] main 分支每个时刻都能编译运行
