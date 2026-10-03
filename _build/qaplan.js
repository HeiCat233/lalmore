// 期中开题答辩预案 docx
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType,
  AlignmentType, HeadingLevel, BorderStyle, ShadingType, Footer, PageNumber, VerticalAlign,
} = require("docx");
const fs = require("fs");

const INK = "1F2937", MUTED = "6B7280", BRAND = "006D6D";
const YH = { ascii: "Arial", eastAsia: "Microsoft YaHei" };
const SONG = { ascii: "Times New Roman", eastAsia: "SimSun" };

const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 180 }, children: [new TextRun({ text: t, bold: true, size: 30, color: INK, font: YH })] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 260, after: 120 }, children: [new TextRun({ text: t, bold: true, size: 26, color: INK, font: YH })] });
const body = (t) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 480 }, spacing: { line: 312, after: 60 }, children: [new TextRun({ text: t, size: 24, color: INK, font: SONG })] });
const qa = (q, a) => {
  const out = [new Paragraph({
    spacing: { before: 160, after: 60 }, keepNext: true,
    children: [new TextRun({ text: "问：" + q, bold: true, size: 24, color: BRAND, font: YH })],
  })];
  out.push(new Paragraph({
    alignment: AlignmentType.JUSTIFIED, indent: { firstLine: 480 }, spacing: { line: 312, after: 80 },
    children: [new TextRun({ text: "答：" + a, size: 24, color: INK, font: SONG })],
  }));
  return out;
};
const tip = (t) => new Paragraph({
  spacing: { line: 312, after: 80 }, indent: { left: 360 },
  shading: { type: ShadingType.CLEAR, fill: "FFF8E8" },
  children: [new TextRun({ text: t, size: 22, color: "7C4A03", font: YH })],
});
const bullets = (arr) => arr.map(t => new Paragraph({
  spacing: { line: 312, after: 50 }, indent: { left: 480, hanging: 240 },
  children: [new TextRun({ text: "▸ " + t, size: 24, color: INK, font: SONG })],
}));

const children = [];
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 160 }, children: [new TextRun({ text: "期中开题汇报 · 答辩预案", size: 36, bold: true, color: INK, font: YH })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "「附近厕所」—— 基于高德地图的公共厕所查询、评价与导航 App（内部材料，答辩前请替换占位姓名）", size: 22, color: MUTED, font: YH })] }));

children.push(h1("一、汇报策略与时间分配"));
children.push(body("开题汇报的核心目标不是炫技，而是让老师相信三件事：选题真实成立、方案想清楚了、进度是可控的。建议总时长控制在 6~8 分钟（以老师要求为准），时间分配如下，宁可少讲技术细节，也要把选题逻辑和分工讲完整。"));
children.push(...bullets([
  "0:00~0:45 封面与选题背景：两句话痛点 + 一句话方案（详见逐字稿）",
  "0:45~2:30 需求与产品设计：功能清单表 + 页面路径图，点出与考核点的映射",
  "2:30~4:30 技术路线：选型理由 + 三层架构 + 数据库三表，点到为止",
  "4:30~5:30 当前进度：85% 完成度 + 已完成清单，一句「核心闭环已在真机跑通」",
  "5:30~7:00 计划分工与风险：Issue 认领机制 + Git 流程（老师大概率会问）",
  "7:00 之后 Q&A：按本预案第三部分应对",
]));
children.push(tip("提示：PPT 第 10 页「85%」是全场记忆点，讲到它时放慢语速；如果老师中途打断提问，先回答当前问题再回到提纲，不要慌。"));

children.push(h1("二、开场白逐字稿（约 40 秒）"));
children.push(body("各位老师好，我们是第【X】组。我们组的选题是「附近厕所」——一款帮人在陌生环境里快速找到干净厕所并走过去的工具 App。我们做它的原因很朴素：找厕所是每个人的高频刚需，但市面工具要么搜不准、要么看不到好坏、要么导航还要跳好几步。目前项目核心功能已经在 realme 真机上完整跑通，整体完成度约 85%，剩下的收尾任务已经通过 Issue 分派给组员。下面我从四个部分汇报：选题与需求、产品设计、技术路线、进度与分工。"));
children.push(tip("背熟这段开场白。它预先回答了老师最关心的三个问题：做什么、为什么做、做到哪了——后续被打断也不影响信息完整传达。"));

children.push(h1("三、Q&A 应答预案（23 问）"));

children.push(h2("A. 选题价值类"));
children.push(...qa("这个题目是不是太小、太简单了？", "工具虽小，链路完整。它覆盖了移动开发的主要考点：定位与地图、网络检索、数据库、多界面架构、用户体系，还有跨应用通信。麻雀虽小五脏俱全，而且因为场景小而真实，每一环我们都能讲清楚为什么这么设计——比做一个大而空的平台更能体现工程能力。"));
children.push(...qa("高德地图自己就能搜厕所，你的差异在哪？", "三点差异：一是排序，高德按平台权重排序，我们用 Haversine 球面距离本地重算，「附近」按真实远近排；二是信息，高德只有位置没有好坏，我们补上了纸巾、洗手台、清理除味三项结构化指标和用户评价；三是流程，从看到详情到步行导航是一步深链，不用来回跳转。"));
children.push(...qa("目标用户是谁？使用频率高吗？", "游客、通勤者、户外工作者、带娃家庭，以及所有肠胃和膀胱不争气的普通人。单人使用频率不高，但刚需属性极强——一旦需要就是十分钟内必须解决的事，这正是工具类应用最容易建立信任的场景。"));
children.push(...qa("冷启动问题：谁来发评价？", "我们设计了三层方案：短期用演示数据生成器保证演示完整；中期靠工具自带流量沉淀——搜厕所的人天然是刚用过的人，发布门槛压到一次点选；长期如果产品成立，评价云端共享后自然形成网络效应。课程范围内我们把存储与展示链路做扎实即可。"));

children.push(h2("B. 技术实现类"));
children.push(...qa("为什么用 Kotlin 不用 Java？", "三个理由：空安全在编译期消灭空指针；协程让异步代码写成同步的样子，数据库操作不卡主线程；同等功能代码量大约少三成。而且 Kotlin 是 Google 对 Android 的官方首推语言。"));
children.push(...qa("为什么用 XML 布局不用 Compose？", "课程场景下 XML 有三个优势：与设计稿一一对应便于讲解和评审；Material 组件库配套最成熟；遇到问题可查的资料最多。Compose 我们了解过，声明式是方向，但本项目的重心在功能与工程规范，选择稳的。"));
children.push(...qa("Room 和直接写 SQLite 有什么区别？", "Room 是官方 ORM：建表、字段映射全部注解声明，SQL 在编译期校验，写错表名直接编译不过；它还自动生成实现类，省掉游标解析的全部样板代码。我们三张表、十几条查询，用 Room 后没有一行手写解析代码。"));
children.push(...qa("高德 SDK 怎么集成的？Key 要钱吗？", "在高德开放平台注册并完成个人实名认证后创建应用，绑定包名与签名 SHA1 获取免费 Key。集成用官方发布在 Maven Central 的三合一组合包，一行依赖引入定位、地图、搜索三套能力。个人开发者每个接口每日约五千次免费配额，我们还做了三层节省：结果缓存进数据库、定位间隔两秒、搜索半径收敛三公里——超出配额也只是调用失败，不会产生任何费用。"));
children.push(...qa("Haversine 是什么？为什么不用别的？", "Haversine 用半正矢函数把两点经纬度换算成球面弧长，公式是 a 等于 sin 半平方项加纬度余弦乘积项，d 等于 2R 乘 atan2。不用平面勾股定理是因为经线长度随纬度收缩，平面公式在城市尺度有米级以上误差；不用 Vincenty 是因为它考虑椭率但计算量大——Haversine 在几公里内误差不到千分之五，是精度与成本的平衡点。"));
children.push(...qa("定位不准怎么办？", "三层兜底：权限层，运行时申请并在拒绝时给出引导提示；精度层，混合定位精度约三十米，对找厕所完全够用；展示层，逆地理编码把坐标转成城市区名给用户一个可感知的确认。真机上定位精度约三十米，全流程验证通过。"));
children.push(...qa("密码怎么存的？", "每用户随机生成 16 字节盐，落库的是 SHA-256 加盐哈希，登录时重算比对。盐值逐用户独立，相同密码哈希不同，彩虹表失效。如果老师追问更强的方案：生产环境应使用 BCrypt 或 Argon2 这类慢哈希，我们的报告里如实写了这一点。"));
children.push(...qa("数据库为什么是三张表？", "对应三类实体：厕所、评价、用户。评价用 toiletId 和 userId 两个外键分别关联，是两条一对多关系。厕所表主键直接复用高德 POI 的 uid，地图上的点和数据库记录一一对应，这是设计里我们最满意的一处。"));
children.push(...qa("什么是 N+1 查询？你怎么发现的？", "列表页为每行单独查一次关联数据，20 行就发 21 条 SQL。我们发现首页刷新明显偏慢，打日志定位到逐条查询后，把它改写成一条 LEFT JOIN 加 GROUP BY 聚合，均分和条数一次取回，查询次数从 21 降到 1。"));
children.push(...qa("数据都在本地，卸载就没了，怎么看？", "课程考核要求的是文件或数据库的存储合理使用，本地方案完全满足且离线可用。架构上我们做了准备：所有数据访问走 Repository 单例，未来接入云端只需替换这一层的实现，界面层零改动。这在报告展望里有明确说明。"));
children.push(...qa("深链导航怎么做的？有什么坑？", "用隐式 Intent 匹配高德的 amapuri 协议，携带终点坐标发起跳转。坑是设备没装高德时会抛 ActivityNotFoundException，我们捕获后回退到高德网页版导航，真机验证两种路径都通过。"));

children.push(h2("C. 进度与分工类"));
children.push(...qa("现在完成多少？还剩什么？", "按功能点折算完成度约 85%。已完成：定位搜索排序、详情与指标卡、评价与榜单、登录、导航，核心闭环真机跑通。剩余：深色模式、收藏、README、测试记录表，已通过 Issue 认领到人。"));
children.push(...qa("小组怎么分工的？你具体做了什么？", "我作为组长负责架构设计、全部核心功能开发和仓库管理；成员B认领深色模式和收藏；成员C负责文档和测试记录。我的具体贡献在报告第九章有逐条清单，GitHub 提交历史可以逐条核对。"));
children.push(...qa("遇到最大的困难是什么？", "最典型的一个：三个独立高德 SDK 包内嵌了相同的公共类，编译期报大量 Duplicate class。排查后改用官方三合一组合包解决。另外还有纯 GPS 定位下城市字段为空、列表 N+1 查询两个问题，报告第七章有完整的「问题-分析-解决-结果」记录。"));
children.push(...qa("Git 具体怎么用的？", "main 分支保持可运行，功能在 feature 分支开发，PR 经队友 review 后合并；提交信息用 feat/fix/docs/chore 前缀加中文描述；任务拆 Issue 认领。目前 28 次提交，每次提交都保持可编译，可以现场打开 GitHub 展示。"));
children.push(...qa("演示数据是不是作弊？", "不是。生成器是「测试数据构造工具」，是工程里标准的做法，它的作用是让评委看到榜单和指标卡在真实数据量下的效果。同时我们如实区分了两类数据： toilets 表来自高德真实检索，评价是随机生成的测试数据，生成入口放在「我的」页且随时可重新生成，报告里明确标注了这一点。真实评价的写入链路与测试数据完全同一条。"));

children.push(h2("D. 压力测试类"));
children.push(...qa("这个 App 有商业化可能吗？", "有清晰的小切口：与市政环卫或商场物业合作获取真实设施数据，评价体系做口碑参考，导航导流给地图平台。但课程阶段我们不谈商业化，先把单机体验做扎实。"));
children.push(...qa("如果有人说「这就是个查询工具，没什么创新」？", "创新分两层：产品层，指标卡是把购房软件的决策辅助模式第一次迁移到公共设施领域；工程层，我们把一个小工具做成了三层架构、聚合查询、安全存储都规范的完整工程。创新不一定是发明新算法，把旧需求做得更顺、更透明同样是创新。"));
children.push(...qa("以后会继续维护吗？", "会。仓库是公开的，收尾任务已在 Issue 中排期；如果课程结束后有同学愿意继续，云端评价同步是最自然的下一步，架构上已经预留了替换空间。"));

children.push(h1("四、演示意外预案"));
children.push(...bullets([
  "定位失败或漂移：口头说明混合定位在室内会漂移，切到地图页展示蓝点仍在；必要时使用模拟器演示定位（可手动设坐标）。",
  "现场断网：首页有 Room 缓存可继续演示列表与详情；明确说明「断网容错是我们设计的非功能需求之一」，把事故变成加分点。",
  "App 崩溃或卡死：立即切到备用录屏视频（答辩前一天录制完整演示，存本地与网盘各一份），同时说明问题并现场查看 Logcat 定位原因——展示排查能力同样是加分项。",
  "高德配额/Key 异常：演示机上常备第二个已配好 Key 的备用机；Key 报错时展示控制台配额页面说明原因。",
  "被要求看代码：Android Studio 打开工程，直接展示 ToiletRepository.kt（数据流水线）与 DistanceUtil.kt（Haversine）两个文件，讲解注释即可。",
]));
children.push(h1("五、答辩前一晚检查清单"));
children.push(...bullets([
  "手机充满电、关掉无关通知、开勿扰；演示账号 demo01 已登录；演示数据已重新生成",
  "备用录屏视频已拷贝到演示电脑与手机各一份",
  "PPT 在演示电脑上用 Office 实际放映一遍，检查字体与动画",
  "Android Studio 打开工程并完成一次 Gradle Sync（防止现场 Sync 卡住）",
  "GitHub 仓库页面、提交历史、PR 记录在浏览器登录态就绪",
  "本预案第三部分通读两遍，23 个问题能说出每题的第一句",
]));

const doc = new Document({
  creator: "附近厕所项目组",
  title: "期中开题答辩预案",
  styles: { default: { document: { run: { font: SONG, size: 24, color: INK }, paragraph: { spacing: { line: 312 } } } } },
  sections: [{
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: MUTED })] })] }) },
    children,
  }],
});
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("D:/develop/lalmore/deliverables/期中开题答辩预案-附近厕所.docx", buf);
  console.log("QAPLAN_DONE");
});
