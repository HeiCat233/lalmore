# 「附近厕所」大作业 · 第一步操作手册（环境搭建 + SDK 集成）

> 本手册由导师 Agent 生成于 2026-09-30。机器上已完成的部分会打 ✅，需要你亲自完成的部分标 ✋。
> 这份文档同时是大作业报告「设计开发过程」章节的素材，答辩时可直接引用。

## 一、已完成的环境搭建（✅ 导师已完成）

| 组件 | 位置 / 版本 |
|---|---|
| Android Studio（免安装版） | `D:\develop\Android Studio\bin\studio64.exe` |
| Android SDK | `D:\develop\Android\Sdk`（platform-tools r37 / android-35 / build-tools 35.0.0 / emulator） |
| Gradle | 本地 `D:\develop\gradle-8.9` + 项目内 wrapper |
| Git | 2.55.0（已装） |
| JDK | 17.0.19（已装，位于 `C:\Program Files\Java\jdk-17.0.19`） |
| 调试签名 | `C:\Users\60143\.android\debug.keystore`，别名 `androiddebugkey`，密码 `android` |
| **签名 SHA1** | **`9A:B3:18:93:9F:12:F4:D8:12:A8:DC:ED:DA:4B:92:06:98:71:A6:D9`** ← 申请高德 Key 要填这个 |
| 项目骨架 | `D:\develop\lalmore`（Kotlin 2.0.21 + AGP 8.7.3，高德三件套 + Room 已集成） |

> ⚠️ 你机器 PATH 里的 `java` 命令指向一个损坏的 Oracle shim，运行会崩溃。
> 已知可用路径是 `C:\Program Files\Java\jdk-17.0.19\bin\java.exe`（完整 JDK）。
> 不影响 Android Studio（它自带 JBR），但命令行里要手动用全路径。

## 二、✋ 你要做的第 1 件事：启动 Android Studio 并打开项目（约 10 分钟）

1. 双击桌面的 **Android Studio** 快捷方式（或运行 `D:\develop\Android Studio\bin\studio64.exe`）。
2. **不会弹出首次设置向导**：已在 `bin\idea.properties` 里配置了
   `disable.android.first.run=true` 跳过联网检查（SDK 已预装，向导在国内必然失败），
   会直接进入欢迎页。若某天又弹 SDK 下载报错，检查这个文件该行是否还在。
3. 进入欢迎页后点 **Open**，选择目录 `D:\develop\lalmore`，点 OK。
4. 打开项目后右下角会开始 **Gradle Sync**（首次会从阿里云镜像下载依赖，约 3~10 分钟）。
   - 只要底部进度条走完、左侧出现 `app` 目录结构、没有红色报错，就是成功。
   - 如果报 `SDK location not found`：确认项目根目录有 `local.properties` 且内容是 `sdk.dir=D:/develop/Android/Sdk`。

### 关于中文界面

AS Quail（261 平台）官方简体语言包停更、Google 打包未内置中文资源，Marketplace 里也搜不到
兼容版本。解决方案：采用社区维护的 [sollyu/AndroidStudioChineseLanguagePack](https://github.com/sollyu/AndroidStudioChineseLanguagePack)，
**该包已由导师安装到 `D:\develop\Android Studio\plugins\zh-261.22158.277.jar`**（适配 AI-261 平台）。

启用步骤：

1. 重启 Android Studio（若已开着，请完全退出再打开）
2. **File → Settings → Appearance & Behavior → System Settings → Language and Region**
3. Language 下拉框此时应出现 **简体中文** → 选中 → OK → 重启 IDE

后续 AS 升级大版本后若界面变回英文，去该项目 [Releases](https://github.com/sollyu/AndroidStudioChineseLanguagePack/releases)
下载与你 AS 平台版本号匹配的新 jar（如 AS 是 262 就下 zh-262 开头的），删掉旧 jar 放入
`plugins\` 目录即可。若该社区包将来停更，参考下面的英文对照表也能正常干活。

**高频操作中英对照表（建议收藏）：**

| 你想做的事 | 英文菜单位置 |
|---|---|
| 打开项目 | 欢迎页 **Open**，或 File → Open |
| 运行 App | 顶部绿色 **▶** 按钮（或 Shift+F10） |
| 看运行日志 | 底部 **Logcat** 标签，过滤框输入 `MainActivity` 或 `ToiletApp` |
| 重新同步依赖 | 顶部**大象图标**（Sync Project with Gradle Files），或 File → Sync |
| 打包 APK | **Build → Build App Bundle(s) / APK(s) → Build APK(s)** |
| 管理虚拟机 | 右上角设备下拉框旁的 **Device Manager** |
| 管理 SDK | Settings → Languages & Frameworks → **Android SDK** |
| 设置代理 | Settings → Appearance & Behavior → System Settings → **HTTP Proxy**（选 No proxy） |
| 装插件 | Settings → **Plugins** |
| 改主题字号 | Settings → Appearance & Behavior → **Appearance** |
| 提交代码 | 左侧 **Commit** 标签（Alt+0），或底部 **Git** 标签看历史 |
| 全局搜文字 | **Ctrl+Shift+F**（Find in Files） |
| 重命名变量/文件 | 选中按 **Shift+F6**（Rename） |
| 项目结构配置 | File → **Project Structure**（Ctrl+Alt+Shift+S） |

常用快捷键：注释 `Ctrl+/`；格式化 `Ctrl+Alt+L`；快速修复 `Alt+Enter`；查找类 `Ctrl+N`。

## 三、✋ 你要做的第 2 件事：申请高德 Key（约 15 分钟）

高德 SDK 没有 Key 会：**地图瓦片一片空白（但蓝点还能动）、POI 搜索全部失败**。

1. 打开 https://lbs.amap.com → 右上角「注册」→ 手机号注册。
2. 进入 **控制台** → 完善信息，选择 **个人开发者**，完成实名认证（需要支付宝扫码，个人开发者免费）。
3. 左侧「应用管理」→「我的应用」→ **创建新应用**：
   - 应用名称：`附近厕所`（随意）
   - 应用类型：`出行`
4. 在该应用下点 **添加 Key**：
   - Key 名称：`android-debug`
   - 服务平台：**Android 平台**
   - 发布版安全码 SHA1：填 `9A:B3:18:93:9F:12:F4:D8:12:A8:DC:ED:DA:4B:92:06:98:71:A6:D9`
   - 调试版安全码 SHA1：填同一个（平时调试用调试版，期末打包发布再申请新的）
   - **包名：`com.lalmore.toiletfinder`**（必须一字不差！这是项目里配置好的包名）
5. 提交后得到一串 Key，**把它发给导师填入项目**，或自己改：
   `app/src/main/AndroidManifest.xml` 里把 `YOUR_AMAP_KEY` 替换为真实 Key。

> 📌 原理（答辩可讲）：高德用「包名 + 签名 SHA1」做应用指纹校验，Key 请求时会带上
> 应用签名哈希，服务端比对不通过就拒绝服务——这防止别人盗用你的配额。

## 四、✋ 你要做的第 3 件事：注册 GitHub 并建仓库（约 5 分钟）

1. 打开 https://github.com/signup 注册（用户名建议全小写英文）。
2. 点右上角 **+** → **New repository**：
   - 名称：`nearby-toilet`（随意）
   - 可见性：**Public**（评分标准里「GitHub 星数超 100 满分」只对公开仓库有意义）
   - **不要**勾选任何初始化选项（README/.gitignore/license 都不勾，我们本地已有首次提交）
3. 建好后复制仓库地址（形如 `https://github.com/你的用户名/nearby-toilet.git`），发给导师，或自己执行：
   ```bash
   cd /d/develop/lalmore
   git remote add origin https://github.com/你的用户名/nearby-toilet.git
   git push -u origin main
   ```
   推送时浏览器会弹出 GitHub 登录授权（Git Credential Manager 已内置）。

## 五、✋ 你要做的第 4 件事：准备演示设备（约 10 分钟）

**真机（推荐）**：
1. 手机「设置 → 关于手机」连点「版本号」7 次，开启开发者选项。
2. 「开发者选项」里打开 **USB 调试**。
3. 数据线连电脑，手机弹「允许 USB 调试」选允许。
4. 验证：Android Studio 顶部设备选择器里出现你的手机型号。

**模拟器（备用）**：SDK 里 emulator 已装好，但还缺系统镜像和虚拟机加速驱动，
首次在 Device Manager 里创建虚拟机时按提示操作即可。演示定位真机更流畅、更真实。

## 六、验收清单（第一步完成的标志）

- [ ] Android Studio 打开项目，Gradle Sync 成功无红字
- [ ] 点绿色 ▶ 运行到设备：显示高德地图瓦片（有地图纹理，不是纯色网格）
- [ ] 授权定位权限后：地图上出现**蓝色定位点**
- [ ] Logcat 过滤 `MainActivity`：能看到 `单点定位成功: lat=..., lng=...`
- [ ] Logcat 过滤 `MainActivity`：能看到 `Room 验证通过：共 1 条评价...`
- [ ] 高德 Key 已填入 Manifest，再次运行无 `INVALID_USER_KEY` 报错
- [ ] GitHub 仓库能看到规范的首批提交（feat/chore 前缀）

## 七、常见问题排查

| 现象 | 原因与解决 |
|---|---|
| 地图显示空白网格但蓝点正常 | Key 未填/填错，或包名、SHA1 与高德控制台不一致 |
| Logcat 报 `INVALID_USER_KEY` | 同上 |
| Logcat 报 定位错误码 12 | 没有定位权限，去系统设置里给 App 授权 |
| Logcat 报 定位错误码 10/1907 | 高德隐私合规接口没调用（本项目已在 `ToiletApp` 里处理，一般不会遇到） |
| Gradle Sync 超时 | 已配置阿里云镜像；若仍超时，检查代理软件是否劫持了 maven.aliyun.com |
| 手机连上但设备列表为空 | 没装手机厂商的 USB 驱动，或 USB 模式要选「传输文件」 |

## 八、本项目已集成的技术点（报告素材）

- **高德隐私合规 API**：`MapsInitializer` / `AMapLocationClient` / `ServiceSettings` 三个 SDK 各自的 `updatePrivacyShow/updatePrivacyAgree` 必须在初始化前调用（见 `ToiletApp.kt`），这是 2021 年后高德 SDK 的强制要求，很多教程没讲，答辩时提出来是加分项。
- **MapView 生命周期绑定**：地图组件必须跟随 Activity 的 `onCreate/onResume/onPause/onDestroy`，否则渲染异常或内存泄漏（见 `MainActivity.kt`）。
- **Room 双层存储设计**：`toilets` 表（收藏的厕所）+ `reviews` 表（评价），以高德 POI 的 `uid` 作为外键关联；SharedPreferences 文件存用户偏好（最近搜索词、首启标记）——正好对应评分标准「文件或数据库的存储」。
- **运行时权限**：Android 6.0+ 定位权限必须动态申请（见 `requestLocationPermissionThenEnableBlueDot()`）。
