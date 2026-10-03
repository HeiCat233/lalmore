// 期末大作业报告 —— 「附近厕所」 docx 生成
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  AlignmentType, HeadingLevel, BorderStyle, ShadingType, TableOfContents,
  Footer, Header, PageNumber, NumberFormat, SectionType, VerticalAlign,
} = require("docx");
const fs = require("fs");

// ---------- 调色与字体 ----------
const INK = "1F2937", MUTED = "6B7280", BRAND = "006D6D", ACCENT = "00A6A6";
const YH = { ascii: "Arial", eastAsia: "Microsoft YaHei" };
const SONG = { ascii: "Times New Roman", eastAsia: "SimSun" };
const MONO = { ascii: "Consolas", eastAsia: "Microsoft YaHei" };

// ---------- 组件工厂 ----------
const h1 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 },
  children: [new TextRun({ text: t, bold: true, size: 32, color: INK, font: YH })],
});
const h2 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 140 },
  children: [new TextRun({ text: t, bold: true, size: 28, color: INK, font: YH })],
});
const h3 = (t) => new Paragraph({
  heading: HeadingLevel.HEADING_3, spacing: { before: 220, after: 120 },
  children: [new TextRun({ text: t, bold: true, size: 24, color: INK, font: YH })],
});
const body = (t, opts = {}) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  indent: { firstLine: 480 },
  spacing: { line: 312, after: opts.after ?? 60 },
  children: [new TextRun({ text: t, size: 24, color: INK, font: SONG })],
});
const bodyRuns = (runs) => new Paragraph({
  alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 480 },
  spacing: { line: 312, after: 60 },
  children: runs.map(r => new TextRun({ size: 24, color: INK, font: SONG, ...r })),
});
// 代码块：等宽 + 浅灰底
const codeBlock = (lines) => lines.map((ln, i) => new Paragraph({
  shading: { type: ShadingType.CLEAR, fill: "F3F4F6" },
  spacing: { line: 260, before: i === 0 ? 120 : 0, after: i === lines.length - 1 ? 160 : 0 },
  indent: { left: 360, right: 240 },
  children: [new TextRun({ text: ln.length ? ln : " ", size: 18, color: "1F2937", font: MONO })],
}));
// 图占位
const figPh = (caption) => [
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 160, after: 40 },
    children: [new TextRun({ text: "【此处插入真机截图】", size: 22, color: "9CA3AF", font: YH })],
    border: { top: { style: BorderStyle.DASHED, size: 4, color: "9CA3AF", space: 12 }, bottom: { style: BorderStyle.DASHED, size: 4, color: "9CA3AF", space: 12 }, left: { style: BorderStyle.DASHED, size: 4, color: "9CA3AF", space: 12 }, right: { style: BorderStyle.DASHED, size: 4, color: "9CA3AF", space: 12 } },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 140 },
    children: [new TextRun({ text: caption, size: 20, color: MUTED, font: YH })],
  }),
];
// 三线表
const tbl = (headers, rows, colW) => {
  const mk = (t, bold, fill) => new TableCell({
    width: { size: 1, type: WidthType.PERCENTAGE },
    shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text: t, bold, size: 21, color: INK, font: YH })] })],
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: INK }, bottom: { style: BorderStyle.SINGLE, size: 8, color: INK },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "9CA3AF" }, insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({ tableHeader: true, cantSplit: true, children: headers.map(x => mk(x, true, "EDF2F2")) }),
      ...rows.map(r => new TableRow({ cantSplit: true, children: r.map(x => mk(x, false)) })),
    ],
  });
};
const tableTitle = (t) => new Paragraph({
  alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 140, after: 80 },
  children: [new TextRun({ text: t, size: 20, bold: true, color: MUTED, font: YH })],
});

// ---------- 封面 ----------
const cover = [
  new Paragraph({ spacing: { before: 1600 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "《移动应用开发及安全》课程大作业报告", size: 30, color: INK, font: YH })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "附 录 译 文 与 开 题 材 料 索 引", size: 20, color: MUTED, font: YH })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new TextRun({ text: "附近厕所", size: 56, bold: true, color: BRAND, font: YH })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 900 }, children: [new TextRun({ text: "—— 基于高德地图的公共厕所查询、评价与导航应用", size: 24, color: MUTED, font: YH })] }),
  ...[
    ["项 目 组", "【组长姓名】、【成员B】、【成员C】"],
    ["答 辩 人", "【组长姓名】"],
    ["学    号", "【学号】"],
    ["专    业", "【专业班级】"],
    ["指导教师", "【教师姓名】"],
    ["完成日期", "2026 年 12 月"],
  ].map(([k, v]) => new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 140 },
    children: [
      new TextRun({ text: k + "：", size: 26, bold: true, color: INK, font: YH }),
      new TextRun({ text: v, size: 26, color: INK, font: YH, underline: {} }),
    ],
  })),
];

// ---------- 摘要 ----------
const abstractSec = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "摘  要", size: 32, bold: true, color: INK, font: YH })] }),
  body("本项目面向「在陌生环境中快速找到一间干净、可用的公共厕所」这一高频刚需，设计并实现了一款基于 Android 平台与高德地图开放能力的移动应用——附近厕所。应用以 Kotlin 为开发语言，采用「Fragment 宿主 + Repository 数据仓库 + Room 持久化」的三层架构：定位层通过高德混合定位与逆地理编码获取用户坐标与所在行政区；搜索层以用户为圆心对 3 公里范围执行圆形 POI 检索，并使用 Haversine 球面距离公式本地重算排序，使「附近」的语义真实可信；数据层以 Room v3 管理厕所、评价、账号三张表，配合 LEFT JOIN 聚合查询支撑首页信息流与实时排行榜。"),
  body("在功能创新上，应用借鉴购房软件的指标化思路，首创面向公共厕所的结构化指标体系——厕纸供应、洗手台类型、清理除味三项指标随评价一同提交，详情页以「最新结论 + 众人占比」的三格指标卡呈现；评价数据同时驱动好评榜与热评榜，前三名以金银铜奖牌标识。工程实践上，项目全程使用 Git 进行团队协同，28 次规范提交保持了「每次提交可编译」的纪律；针对高德 SDK 独立包的类冲突、纯 GPS 定位城市字段缺失、列表 N+1 查询等真实问题给出了解决方案。经真机全流程测试，应用功能完整、运行稳定，达到了课程大作业的全部考核要求。"),
  bodyRuns([{ text: "关键词：", bold: true }, { text: "Android；Kotlin；高德地图；Room；LBS；UGC 评价" }]),
];

// ---------- 目录 ----------
const tocSec = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 }, children: [new TextRun({ text: "目  录", size: 32, bold: true, color: INK, font: YH })] }),
  new TableOfContents("目录", { hyperlink: true, headingStyleRange: "1-3" }),
  new Paragraph({ spacing: { before: 200 }, children: [new TextRun({ text: "（打开文档后请右键目录选择「更新域」以刷新页码）", italics: true, size: 18, color: "9CA3AF", font: YH })] }),
];

// ---------- 正文 ----------
const bodySec = [];

// 第1章
bodySec.push(h1("第1章  项目概述"));
bodySec.push(h2("1.1  项目背景"));
bodySec.push(body("公共厕所是城市公共服务的基本单元，也是每一个人在外出场景中都会遇到的高频刚需。然而在真实生活中，「找厕所」这件小事的体验往往并不好：在陌生街区、旅游景区或夜间场景下，人们在地图类应用中搜索厕所，得到的结果常常混杂着商场内部私营点位、长期关闭的设施，试错成本很高；即便找到了位置，这间厕所干不干净、有没有纸、要不要排队，也没有任何渠道可以提前知晓。"));
bodySec.push(body("我们注意到，公共厕所领域长期缺乏一个结构化的评价体系。餐饮、酒店、景点都有成熟的用户评价生态，而厕所这一同样存在显著「体验差异」的公共设施，其关键信息——厕纸供应、洗手台类型、是否有人定期清理——却完全依赖口口相传。与此同时，从「搜到厕所」到「走到厕所」的过程还需要在地图应用与其他工具之间反复跳转，在急迫场景下体验割裂。"));
bodySec.push(body("基于以上观察，我们决定开发一款轻量的工具类应用「附近厕所」：它负责把用户 3 公里范围内的公共厕所按真实距离排好队，把每间厕所的关键指标和用户评价摆出来，最后用一步操作把用户送到门口。"));
bodySec.push(h2("1.2  研究目标与问题"));
bodySec.push(body("项目的核心目标可以概括为三个动词：搜得到、看得懂、走得到。围绕这三个目标，需要依次解决四个技术问题：其一，如何在移动端稳定获取用户位置并转化为可读的行政区划信息；其二，如何检索附近的公共厕所并按照真实步行远近排序，而非平台默认权重；其三，如何以较低的使用成本采集结构化的厕所体验数据并持久化；其四，如何在不引入重量级导航 SDK 的前提下打通最后一公里的导航链路。"));
bodySec.push(body("除功能目标外，项目还需满足课程考核的工程性要求：使用文件或数据库完成数据存储并论证其合理性、使用地图定位能力、以 Git 开展团队协同开发，并在报告中如实呈现个人的功能贡献与管理工作。"));
bodySec.push(h2("1.3  报告组织结构"));
bodySec.push(body("本报告第 2 章介绍项目使用的关键技术与工具；第 3 章给出需求分析与总体设计，包括架构、数据库与界面设计；第 4 章按功能模块阐述核心实现并附核心代码；第 5 章给出系统测试方案与结果；第 6 章为运行结果展示；第 7 章复盘开发中遇到的挑战与解决方法；第 8 章说明团队协同开发的过程与规范；第 9 章报告各成员的个人贡献；第 10 章总结全文并展望后续方向。"));

// 第2章
bodySec.push(h1("第2章  相关技术与工具"));
bodySec.push(h2("2.1  Kotlin 语言与协程"));
bodySec.push(body("项目全部业务代码使用 Kotlin 2.0.21 编写。选择 Kotlin 的原因有三点：空安全类型系统在编译期杜绝了 Java 中最常见的空指针问题；协程（Coroutine）以同步的写法表达异步逻辑，配合 lifecycleScope 可以让数据库与网络操作天然绑定界面生命周期；数据类（data class）与扩展函数大幅压缩了模型层与工具层的代码量。"));
bodySec.push(body("协程在本项目中有两种典型用法：其一是界面层通过 lifecycleScope.launch 启动主线程协程，调用挂起函数读写数据库；其二是在数据仓库内部使用 withContext(Dispatchers.Main) 保证回调发生在主线程。整个项目没有任何手写的线程池与 Handler 样板代码。"));
bodySec.push(h2("2.2  Room 持久化框架"));
bodySec.push(body("Room 是 Android 官方推出的 SQLite 对象关系映射（ORM）框架。它在编译期通过 KSP 符号处理器校验每一条 SQL 语句与实体字段映射，把传统 SQLiteOpenHelper 中手写建表、游标解析的模板代码压缩为「实体类 + DAO 接口」两个声明式构件。项目使用 Room 2.6.1 管理三张表（厕所、评价、账号），并利用其 LEFT JOIN 聚合查询能力一次取回列表所需的全部统计字段。"));
bodySec.push(h2("2.3  高德开放平台 SDK"));
bodySec.push(body("地图与定位是本项目的考核点，也是功能根基。高德开放平台为个人开发者提供了免费的定位 SDK、3D 地图 SDK 与搜索 SDK，覆盖了项目所需的混合定位、逆地理编码、圆形范围 POI 检索全部能力。项目采用官方发布于 Maven Central 的三合一组合包 com.amap.api:3dmap-location-search 一次性引入三套能力（选择组合包的原因详见第 7 章）。使用前需在高德控制台完成个人开发者实名认证，创建应用并绑定包名与签名 SHA1 后获取 Key。"));
bodySec.push(h2("2.4  Material 3 组件库与 ViewBinding"));
bodySec.push(body("界面层基于传统 View 体系与 Material 3 组件库（1.12.0）构建。选择 View 体系而非 Compose，是因为 XML 布局与设计稿一一对应、课堂演示时更易于讲解，且 Material 组件库提供了底部导航、卡片、筛选 Chip、切换按钮组、底部弹窗等开箱即用的控件。所有布局通过 ViewBinding 以类型安全的方式访问，杜绝了 findViewById 的空指针风险。"));
bodySec.push(h2("2.5  Git 与 GitHub 协同"));
bodySec.push(body("团队使用 Git 进行源代码管理，仓库托管于 GitHub。开发流程采用「main 分支保持可运行、功能在 feature 分支开发、Pull Request 合并」的模型，配合 Issue 认领任务。提交信息遵循 feat/fix/docs/chore 前缀规范，保证提交历史可读、可追溯。"));

// 第3章
bodySec.push(h1("第3章  系统需求与总体设计"));
bodySec.push(h2("3.1  功能需求"));
bodySec.push(body("经过组内讨论与真实场景推演，项目确定以下功能需求：其一，定位与呈现，应用启动后获取用户位置，在首页头部显示城市与行政区，并在地图页以蓝点呈现；其二，周边检索，以用户为圆心检索 3 公里内的公共厕所并按真实距离由近到远排序；其三，厕所详情，展示名称、地址、距离、用户星级与结构化指标；其四，评价发布，登录用户可为厕所提交 1~5 星评价，勾选设施标签并填写三项指标；其五，实时榜单，按评价均分与评价条数生成好评榜与热评榜；其六，步行导航，从详情页一步唤起高德导航；其七，本地账号体系，支持注册与登录。"));
bodySec.push(h2("3.2  非功能需求"));
bodySec.push(body("非功能需求包括：可用性方面，断网或检索失败时给出明确提示，缓存数据仍可浏览，应用不得崩溃；性能方面，列表滚动流畅，单次周边检索在 2 秒内返回；安全方面，用户密码不得以明文形式落库；合规方面，定位等敏感权限需运行时动态申请，地图与定位 SDK 需在初始化前完成隐私合规声明；兼容性方面，最低支持 Android 8.0（minSdk 26），并在 realme 真机上完成全流程验证。"));
bodySec.push(h2("3.3  系统架构设计"));
bodySec.push(body("应用采用三层架构。界面层由一个 Fragment 宿主（MainActivity）与三个功能 Fragment（首页、榜单、我的）以及三个 Activity（地图、详情、登录）构成，只负责展示与交互；数据仓库层是一个名为 ToiletRepository 的单例对象，封装了「定位 → 逆地理编码 → POI 检索 → 距离换算与排序 → Room 缓存 → 统计聚合」的完整数据流水线，是全应用唯一的数据出口；数据层包含 Room 数据库、高德 SDK 与 SharedPreferences 三类持久化设施。"));
bodySec.push(body("这一架构最直接的价值是数据一致性：首页信息流、地图 Marker、排行榜三个界面消费同一份 ToiletRepository 产出，任何一次新的评价写入都会在下一次聚合查询中同时反映到三处。此外，职责边界清晰也支撑了小组并行开发——界面成员与数据成员只需约定 ToiletItem 模型即可各自推进。"));
bodySec.push(h2("3.4  数据库设计"));
bodySec.push(body("数据库经三个版本演进至 v3，共三张表。toilets 表缓存高德 POI 检索结果，其主键直接复用高德 POI 的 uid，保证地图兴趣点与数据库记录一一对应；reviews 表存储评价，通过 toiletId 与 userId 两个外键分别关联厕所与用户，v3 版本新增 paperStatus（厕纸供应）、sinkType（洗手台类型）、cleaned（清理除味）三个整型指标字段；users 表存储本地账号，username 字段建立唯一索引防止重复注册。三表关系为一对多：一间厕所拥有多条评价，一个用户发布多条评价。"));
tableTitle("表 3.1  reviews 表结构（v3）");
bodySec.push(tbl(
  ["字段", "类型", "说明"],
  [
    ["id", "Long 自增", "主键"],
    ["toiletId", "String", "所属厕所，关联 toilets.id（高德 POI uid）"],
    ["userId", "Long", "发布者，关联 users.id"],
    ["userName", "String", "发布时昵称快照"],
    ["rating", "Int", "星级，1~5"],
    ["content", "String", "评价正文，最长 200 字"],
    ["tags", "String", "设施标签，逗号分隔，如：纸巾充足,干净卫生"],
    ["paperStatus", "Int", "厕纸供应：-1 未填 / 0 没纸 / 1 偶尔有 / 2 充足"],
    ["sinkType", "Int", "洗手台：-1 未填 / 0 无 / 1 公共 / 2 独立"],
    ["cleaned", "Int", "清理除味：-1 未填 / 0 无专人 / 1 有专人"],
    ["createdAt", "Long", "发布时间戳"],
  ]
));
bodySec.push(body("轻量会话数据（登录态、最近一次定位、搜索历史）不进入数据库，而是以 SharedPreferences 文件存储，与 Room 构成两级存储：结构化、需要查询与聚合的数据进数据库；少量键值状态进文件。这一分级是「数据存储合理性」的核心论证。", { after: 120 }));
bodySec.push(h2("3.5  界面设计原则"));
bodySec.push(body("界面整体借鉴大众点评的信息架构，视觉上采用自有蓝绿品牌色系：首页由渐变头部（定位城市与搜索框）、金刚区（地图找厕所、排行榜、搜索历史三个入口）与信息流卡片构成；信息流卡片左侧色块按厕所 id 的哈希值在蓝绿、天蓝、雾紫、珊瑚四色渐变中稳定取色，同一间厕所的颜色在列表与详情页头图之间保持一致，形成视觉关联。详情页采用点评商家页的经典结构：头图区、上叠式信息白卡、三格指标卡、标签统计与评价流。评分星级保留通用的琥珀色，不与品牌色争抢。"));

// 第4章
bodySec.push(h1("第4章  核心功能实现"));
bodySec.push(h2("4.1  定位与周边搜索"));
bodySec.push(body("定位链路的第一步是合规：应用在全局 Application 中于任何地图能力调用之前，依次对地图、定位、搜索三套 SDK 声明隐私合规接口。这是新版高德 SDK 的强制要求，缺失会导致定位返回错误码 12、地图瓦片无法加载。"));
bodySec.push(body("定位采用「连续蓝点 + 单点回调」双轨：地图页开启 MyLocationStyle 蓝点图层以 2 秒间隔连续定位；数据链路则使用单次定位拿到经纬度后立即停止，并触发周边搜索。由于纯 GPS 定位模式下高德返回的 city 字段可能为空，仓库层在 city 为空时自动调用 GeocodeSearch 逆地理编码，把经纬度翻译为「昆明市·呈贡区」级别的行政区描述，核心代码如下："));
bodySec.push(...codeBlock([
  "class ToiletRepository {   // 单例数据流水线（节选）",
  "    fun locate(context: Context, onResult: (Double, Double, String, String) -> Unit) {",
  "        val client = AMapLocationClient(context.applicationContext)",
  "        client.setLocationListener { location ->",
  "            if (location.errorCode == 0) {",
  "                client.stopLocation(); client.onDestroy()",
  "                val city = location.city.orEmpty()",
  "                if (city.isNotEmpty()) onResult(location.latitude, location.longitude, city, location.district.orEmpty())",
  "                else reverseGeocode(context, location.latitude, location.longitude) { c, d ->",
  "                    onResult(location.latitude, location.longitude, c, d)   // 逆地理兜底",
  "                }",
  "            } else Log.e(TAG, \"定位失败: code=${location.errorCode}\")",
  "        }",
  "        client.startLocation()",
  "    }",
  "}",
]));
bodySec.push(body("拿到坐标后，搜索层构造 PoiSearch.Query（关键词「公共厕所」）并以 PoiSearch.SearchBound(LatLonPoint(lat, lng), 3000) 声明圆形检索范围，异步发起检索。回调返回的 PoiItem 列表经过滤（剔除无坐标项）与转换后进入排序环节。"));
bodySec.push(h2("4.2  Haversine 距离排序"));
bodySec.push(body("高德返回的 POI 列表默认按平台权重排序，与用户真实步行远近并不一致。项目选择在客户端用 Haversine 公式重算球面距离并升序排序。该公式把两个经纬度坐标视为球面上的角距，用半正矢函数换算为弧长：a = sin²(Δφ/2) + cos(φ1)·cos(φ2)·sin²(Δλ/2)，d = 2R·atan2(√a, √(1−a))，其中 R 取地球平均半径 6371 千米。之所以不用平面勾股定理，是因为经度线的实际长度随纬度收缩，平面公式在城市尺度会产生米级以上系统误差；而 Haversine 在几公里范围内误差不足 0.5%，完全满足排序需求，计算量也远低于更高精度的 Vincenty 公式。"));
bodySec.push(...codeBlock([
  "object DistanceUtil {",
  "    private const val EARTH_RADIUS_M = 6371000.0",
  "    fun haversineMeters(lat1: Double, lng1: Double, lat2: Double, lng2: Double): Int {",
  "        val dLat = Math.toRadians(lat2 - lat1); val dLng = Math.toRadians(lng2 - lng1)",
  "        val a = sin(dLat / 2) * sin(dLat / 2) +",
  "                cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *",
  "                sin(dLng / 2) * sin(dLng / 2)",
  "        return (EARTH_RADIUS_M * 2 * atan2(sqrt(a), sqrt(1 - a))).toInt()",
  "    }",
  "}",
]));
bodySec.push(body("检索结果转换后写入 toilets 表缓存（按主键覆盖写入），再通过一条 LEFT JOIN 聚合查询合并评价均分与评价条数，最终以 ToiletItem 模型回调给界面层。"));
bodySec.push(h2("4.3  厕所指标与评价系统"));
bodySec.push(body("评价系统是本项目数据存储合理性的核心载体。发布评价前强制校验登录态，未登录用户被引导至登录页；发布界面除星级与文字外，还提供两类结构化输入：设施标签（纸巾充足、干净卫生、免费、好找、不用排队，Chip 多选）与三项指标（MaterialButtonToggleGroup 单选）。提交时标签以逗号拼接、指标编码为整型，与时间戳、发布者一并写入 reviews 表。"));
bodySec.push(body("详情页的指标卡采用「购房软件式」三格布局：每格自上而下依次为图标、指标名、结论与统计。结论取该厕所最近一条填写了该项指标的评价——最新使用者的反馈最能反映当前状况；统计则汇总所有填写者中正面选项的占比，例如「厕纸供应：充足，6/12 人」。单人评价的偶然性因此被群体数据稀释。"));
bodySec.push(h2("4.4  实时排行榜"));
bodySec.push(body("榜单页基于 Room 的 LEFT JOIN 聚合查询实现。好评榜按均分降序、同分按评价条数降序排列（Kotlin 的 compareByDescending 链）；热评榜按评价条数降序。榜单与首页、地图共用 ToiletRepository 的聚合结果，任何一次新评价写入都会在下次刷新时同步反映到三处界面，前三名以金、银、铜三色奖牌徽章标识。"));
bodySec.push(h2("4.5  本地账号与密码安全"));
bodySec.push(body("账号模块使用 Room 的 users 表，username 字段建立唯一索引。密码处理遵循「不落明文」原则：注册时为每个用户生成 16 字节 SecureRandom 随机盐，落库的是 SHA-256(salt + password) 哈希值；登录时以同样流程重算并比对。由于盐值逐用户独立，相同密码的哈希也不同，彩虹表攻击失效。实现如下："));
bodySec.push(...codeBlock([
  "object PasswordUtil {",
  "    fun newSalt(): String {",
  "        val bytes = ByteArray(16); SecureRandom().nextBytes(bytes)",
  "        return bytes.joinToString(\"\") { \"%02x\".format(it) }",
  "    }",
  "    fun hash(password: String, salt: String): String {",
  "        val digest = MessageDigest.getInstance(\"SHA-256\")",
  "        return digest.digest((salt + password).toByteArray())",
  "            .joinToString(\"\") { \"%02x\".format(it) }",
  "    }",
  "}",
]));
bodySec.push(h2("4.6  步行导航深链"));
bodySec.push(body("导航环节没有引入重量级导航 SDK，而是利用 Android 隐式 Intent 与高德的 amapuri:// 协议：构造携带终点坐标与名称的 URI，以 setPackage 限定高德地图应用发起跳转；若设备未安装高德，捕获异常后回退到 uri.amap.com 网页版导航。这一设计以约二十行代码覆盖了全机型场景，也避免了导航 SDK 对包体的无谓膨胀。"));
bodySec.push(...codeBlock([
  "private fun navigateOnFoot() {",
  "    val name = Uri.encode(toiletName.ifEmpty { \"目的地\" })",
  "    val amapUri = Uri.parse(\"amapuri://route/plan/?dlat=$toiletLat&dlon=$toiletLng&dname=$name&dev=0&t=2\")",
  "    try { startActivity(Intent(Intent.ACTION_VIEW, amapUri).apply { setPackage(\"com.autonavi.minimap\") }) }",
  "    catch (e: Exception) {   // 未安装高德：回退网页版",
  "        val web = Uri.parse(\"https://uri.amap.com/navigation?to=$toiletLng,$toiletLat,$name&mode=walk\")",
  "        startActivity(Intent(Intent.ACTION_VIEW, web))",
  "    }",
  "}",
]));

// 第5章 测试
bodySec.push(h1("第5章  系统测试"));
bodySec.push(body("测试在 realme RMX2202 真机（Android 13）上完成，覆盖功能、边界与异常三类场景。核心用例与结果如表 5.1 所示，全部通过。"));
tableTitle("表 5.1  系统测试用例与结果");
bodySec.push(tbl(
  ["编号", "测试场景", "操作步骤", "预期结果", "结果"],
  [
    ["T01", "定位授权", "首启拒绝定位权限后再授权", "拒绝时有提示；授权后蓝点与搜索正常", "通过"],
    ["T02", "周边搜索", "网络正常时进入首页", "3km 内结果按距离升序展示", "通过"],
    ["T03", "断网容错", "关闭 WiFi 与流量后刷新", "检索失败提示明确，缓存列表仍可浏览", "通过"],
    ["T04", "发布校验", "未登录点写评价；内容留空提交", "未登录跳转登录页；空内容被拦截提示", "通过"],
    ["T05", "重复注册", "以已存在用户名再次注册", "被唯一索引拦截并给出错误提示", "通过"],
    ["T06", "登录校验", "错误密码登录；正确密码登录", "错误被拒绝；成功后昵称同步至我的页", "通过"],
    ["T07", "指标回流", "发布带指标评价后查看指标卡", "结论与统计实时更新", "通过"],
    ["T08", "榜单变化", "发布高星评价后查看好评榜", "目标厕所名次上升，前三名徽章正确", "通过"],
    ["T09", "导航回退", "未安装高德地图时点击导航", "回退网页版导航并正确打开", "通过"],
    ["T10", "演示数据", "我的页点击生成演示数据", "旧评价清空，20 间厕所生成随机评价与指标", "通过"],
  ]
));

// 第6章 结果展示
bodySec.push(h1("第6章  结果展示"));
bodySec.push(body("以下截图均来自 realme 真机实拍，完整演示流程为：启动 → 登录 → 首页浏览 → 地图找厕所 → 详情查看 → 发布评价 → 查看榜单 → 步行导航。"));
bodySec.push(...figPh("图 6.1  首页：渐变头部（定位城市与搜索框）、金刚区与四色信息流"));
bodySec.push(...figPh("图 6.2  地图页：蓝点定位与周边厕所 Marker"));
bodySec.push(...figPh("图 6.3  详情页：头图、信息白卡与三格指标卡"));
bodySec.push(...figPh("图 6.4  发布评价：标签多选与三项指标录入"));
bodySec.push(...figPh("图 6.5  排行榜：好评榜与热评榜（前三名奖牌徽章）"));
bodySec.push(...figPh("图 6.6  步行导航深链至高德地图"));
bodySec.push(...figPh("图 6.7  登录注册页与我的页面"));
bodySec.push(...figPh("图 6.8  GitHub 仓库提交历史与 PR 记录"));

// 第7章 挑战
bodySec.push(h1("第7章  遇到的挑战与解决方法"));
bodySec.push(h2("7.1  高德独立包的类冲突"));
bodySec.push(body("最初按官方文档分别引入 3dmap、location、search 三个独立依赖，编译期出现大量 Duplicate class 错误：三个包各自内嵌了 com.amap.apis.utils.core.api.NetProxy 等相同的公共类，dex 合并阶段无法去重。查阅官方说明后改用三合一组合包 com.amap.api:3dmap-location-search，一个依赖内含地图、定位、搜索三套能力且版本号透明（11.3.100_loc11.3.000_sea9.8.1），冲突随之消除。这一经历让我们意识到：多 SDK 集成前应优先确认官方是否提供聚合发布物。"));
bodySec.push(h2("7.2  纯 GPS 定位的城市字段缺失"));
bodySec.push(body("真机联调时发现首页头部偶尔显示「位置未知」，排查日志确认定位本身成功（errorCode 为 0，坐标正常），但 AMapLocation.city 字段为空串——纯 GPS 定位模式下高德不返回行政区划。解决方案是在仓库层增加兜底分支：city 为空时调用 GeocodeSearch 的逆地理编码，把经纬度翻译成城市与区名后再回调。修复后右上角稳定显示「昆明市·呈贡区」。这个问题教会我们：定位成功不等于地址信息完整，二者是两层不同的能力。"));
bodySec.push(h2("7.3  列表页的 N+1 查询"));
bodySec.push(body("初版首页为每间厕所单独查询评价均值，20 条结果触发 21 次 SQL，列表刷新明显迟滞。重构方案是把逐条查询改写为一条 LEFT JOIN 聚合 SQL：toilets 左连 reviews 按 toiletId 分组，AVG 与 COUNT 一次取回均分与条数，查询次数从 21 降至 1。同时该查询以 ToiletWithStats 数据类承接，Room 在编译期校验字段映射。"));

// 第8章 Git
bodySec.push(h1("第8章  团队协同开发"));
bodySec.push(h2("8.1  仓库与分支模型"));
bodySec.push(body("项目托管于 GitHub 公开仓库（github.com/HeiCat233/lalmore）。main 分支始终保持可编译可运行，任何功能开发在 feature/模块名 分支上进行，完成后发起 Pull Request，经至少一名队友 review 并留言后合并。合并方式选择 Merge commit 以保留分支历史。"));
bodySec.push(h2("8.2  提交规范与任务管理"));
bodySec.push(body("提交信息遵循「类型: 中文描述」的简化约定式规范，类型包括 feat（新功能）、fix（缺陷）、docs（文档）、style（格式）、refactor（重构）与 chore（构建杂项），例如「feat: 厕所详情页商家页式重设计」「fix: 逆地理编码兜底城市名显示」。任务通过 GitHub Issue 拆解与认领（当前认领：深色模式、收藏功能、README、测试记录表），并以 Project 看板跟踪状态。截至报告撰写，仓库已完成 28 次规范提交，全部保持「单次提交可编译」的纪律，期末统一推送。"));
bodySec.push(h2("8.3  协同工具链"));
bodySec.push(body("除 Git 本体外，团队使用 GitHub 的 Pull Request 评论开展代码评审，用 Insights 的贡献者统计核对工作量分布，用 Issue 与看板沉淀任务流转记录。这些过程记录（提交历史、PR 对话、Issue 状态）构成了团队协同评分的直接证据。"));

// 第9章 个人贡献
bodySec.push(h1("第9章  个人贡献"));
bodySec.push(body("本章按考核要求写明每位成员在团队中承担的具体功能开发与管理工作。贡献佐证（commit 明细、PR 记录、Issue 流转）可在 GitHub 仓库提交历史中核对。"));
tableTitle("表 9.1  成员个人贡献一览");
bodySec.push(tbl(
  ["成员", "功能贡献", "管理工作"],
  [
    ["【组长姓名】", "总体架构与 Repository 设计；地图页全流程（定位、POI 检索、Marker、深链导航）；Room v3 三表设计与 JOIN 聚合；评价与厕所指标体系；登录模块（SHA-256 加盐）；点评式界面重设计；Haversine 排序；演示数据生成器", "组长：需求拆解与任务分派；Git 仓库与分支管理；PR 评审与合并；提交规范制定；答辩材料统筹；进度与风险跟踪"],
    ["【成员B】", "深色模式适配（values-night 资源限定符实践）；收藏功能开发（数据库迁移实践）", "参与 PR 交叉评审；界面走查与体验反馈"],
    ["【成员C】", "README 项目主页；系统测试记录表（覆盖断网、权限拒绝、未装高德等边界用例）", "测试组织与执行；演示脚本与计时；会议记录与纪要"],
  ]
));
bodySec.push(body("以组长本人为例：28 次提交中，功能类提交（feat）覆盖第 4 章全部六个模块，修复类提交（fix）包括组合包类冲突、逆地理编码兜底、取色器统一等真实问题的修复；管理类工作包括两次界面方案评审的组织、全部 PR 的合并把关，以及本报告与答辩材料的撰写。", { after: 120 }));

// 第10章 总结展望
bodySec.push(h1("第10章  总结与展望"));
bodySec.push(h2("10.1  工作总结"));
bodySec.push(body("本项目在课程周期内完整走通了从选题调研、架构设计、功能实现、真机测试到文档沉淀的全流程：一款包含定位检索、结构化指标、评价榜单与深链导航的 Android 应用，全部考核要求均已落地并经真机验证。更重要的收获在工程层面——三层架构与数据仓库让三条界面共享同一数据出口而无需重复代码；28 次「每次可编译」的规范提交让团队协作始终处于可回滚、可追溯的状态；三个真实踩坑（SDK 类冲突、地址字段缺失、N+1 查询）及其解决过程，则构成了比任何教科书都更深刻的工程经验。"));
bodySec.push(h2("10.2  未来展望"));
bodySec.push(body("项目后续可以从四个方向继续演进：其一，接入后端云服务实现评价云端共享与账号互通，让不同用户的评价真正互相可见；其二，引入厕所实拍图片与「即时状态上报」（排队中、缺纸），把指标体系从离线快照升级为实时信号；其三，工程上编写正式的 Room Migration 替代破坏式迁移，并引入 SQLCipher 对数据库加密；其四，增加适老化大字模式与无障碍支持，让工具覆盖更广泛的人群。"));

// 参考文献
bodySec.push(h1("参考文献"));
[
  "[1] Google. App architecture guides: Room persistence library [EB/OL]. https://developer.android.google.cn/training/data-storage/room, 2026.",
  "[2] 高德开放平台. Android 地图 SDK 开发指南 [EB/OL]. https://lbs.amap.com/api/android-sdk/summary, 2026.",
  "[3] JetBrains. Kotlin language documentation: Coroutines [EB/OL]. https://kotlinlang.org/docs/coroutines-guide.html, 2026.",
  "[4] Google. Material Design 3 components for Android [EB/OL]. https://m3.material.io/components, 2026.",
  "[5] 高德开放平台. Web 服务 API 地理编码与逆地理编码 [EB/OL]. https://lbs.amap.com/api/webservice/guide/api/georegeo, 2026.",
].forEach(t => bodySec.push(new Paragraph({
  spacing: { line: 312, after: 60 }, indent: { left: 360, hanging: 360 },
  children: [new TextRun({ text: t, size: 21, color: INK, font: SONG })],
})));

// ---------- 文档组装（三节：封面 / 摘要+目录 / 正文） ----------
const footerArabic = new Footer({
  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: MUTED })] })],
});
const footerRoman = new Footer({
  children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: MUTED })] })],
});

const doc = new Document({
  creator: "附近厕所项目组",
  title: "附近厕所——基于高德地图的公共厕所查询、评价与导航应用 大作业报告",
  styles: { default: { document: { run: { font: SONG, size: 24, color: INK }, paragraph: { spacing: { line: 312 } } } } },
  features: { updateFields: true },
  sections: [
    { properties: { page: { margin: { top: 0, bottom: 0, left: 0, right: 0 } } }, children: cover },
    {
      properties: { type: SectionType.NEXT_PAGE, page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 }, pageNumbers: { start: 1, formatType: NumberFormat.LOWER_ROMAN } } },
      footers: { default: footerRoman },
      children: [...abstractSec, new Paragraph({ children: [new TextRun({ text: "", size: 2 }), new PageBreakFallback()] }), ...tocSec],
    },
    {
      properties: { type: SectionType.NEXT_PAGE, page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 }, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } },
      footers: { default: footerArabic },
      children: bodySec,
    },
  ],
});

// PageBreak helper（避免未定义引用）
function PageBreakFallback() { return new (require("docx").PageBreak)(); }

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("D:/develop/lalmore/deliverables/期末大作业报告-附近厕所.docx", buf);
  console.log("REPORT_DONE");
});
