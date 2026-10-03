// 期末大作业答辩 PPT —— 「附近厕所」
const pptxgen = require("pptxgenjs");

const P = new pptxgen();
P.layout = "LAYOUT_WIDE";
P.author = "附近厕所项目组";

const W = 13.33, H = 7.5, M = 0.5;
const BG = "FFFFFF", DEEP = "00575D", PRIMARY = "00A6A6", DARK = "006D6D";
const ACCENT = "FFB000", TEXT = "1B1B1B", MUTED = "6B7280", LIGHT = "E8F6F6";
const F = "Microsoft YaHei";

const bu = () => ({ code: "25B8", indent: 12 });
const shadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 45, opacity: 0.12 });

function header(s, title, no) {
  s.background = { color: BG };
  s.addText(title, { x: M, y: 0.32, w: 10.2, h: 0.7, fontSize: 27, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(String(no).padStart(2, "0"), { x: W - 1.3, y: 0.36, w: 0.8, h: 0.6, fontSize: 22, bold: true, color: ACCENT, fontFace: F, align: "right", margin: 0 });
}

// ============ 1 封面 ============
let s = P.addSlide();
s.background = { color: DEEP };
s.addShape(P.shapes.OVAL, { x: -1.5, y: -1.8, w: 4.2, h: 4.2, fill: { color: "FFFFFF", transparency: 92 } });
s.addShape(P.shapes.OVAL, { x: W - 2.6, y: H - 2.4, w: 3.6, h: 3.6, fill: { color: "FFFFFF", transparency: 93 } });
s.addText("《移动应用开发及安全》期末大作业答辩", { x: M, y: 1.5, w: W - 2 * M, h: 0.5, fontSize: 18, color: "BFE8E8", fontFace: F, align: "center" });
s.addText("附近厕所", { x: M, y: 2.2, w: W - 2 * M, h: 1.35, fontSize: 66, bold: true, color: "FFFFFF", fontFace: F, align: "center" });
s.addText("搜得到 · 看得懂 · 走得到 —— 公共厕所查询 / 评价 / 导航 App", { x: M, y: 3.68, w: W - 2 * M, h: 0.5, fontSize: 19, color: "D9F2F2", fontFace: F, align: "center" });
s.addShape(P.shapes.LINE, { x: W / 2 - 1.2, y: 4.5, w: 2.4, h: 0, line: { color: ACCENT, width: 2.5 } });
s.addText("项目组：【组长姓名】·【成员B】·【成员C】        指导教师：【教师姓名】", { x: M, y: 4.8, w: W - 2 * M, h: 0.45, fontSize: 14, color: "9ED4D4", fontFace: F, align: "center" });
s.addText("答辩人：【组长姓名】  学号：【学号】  ·  2026 年 12 月", { x: M, y: 5.28, w: W - 2 * M, h: 0.4, fontSize: 14, color: "9ED4D4", fontFace: F, align: "center" });

// ============ 2 项目概览（大数字） ============
s = P.addSlide();
header(s, "项目概览：三个数字看「附近厕所」", 2);
const stats = [
  ["3km / 20+", "以用户为圆心 3km 圆形检索「公共厕所」，单次可召回 20+ 条结果，按 Haversine 真实距离排序", "SEARCH"],
  ["3 表 / 11 项", "Room v3 三表（厕所/评价/账号）+ SharedPreferences 两级存储；评价含星级/标签/三项指标共 11 个字段", "STORAGE"],
  ["28 次 / 0 冲突", "Git 规范提交 28 次（feat/fix/docs/chore 前缀），feature 分支 + PR 协同，冲突 0 次", "TEAMWORK"],
];
stats.forEach((t, i) => {
  const x = M + i * 4.18, y = 1.45, w = 3.95;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 4.1, fill: { color: i === 1 ? LIGHT : "F7F9FA" }, rectRadius: 0.09, shadow: shadow() });
  s.addText(t[0], { x: x + 0.28, y: y + 0.4, w: w - 0.56, h: 1.1, fontSize: 32, bold: true, color: PRIMARY, fontFace: F, margin: 0 });
  s.addText(t[2], { x: x + 0.28, y: y + 1.5, w: w - 0.56, h: 0.4, fontSize: 13, bold: true, color: ACCENT, fontFace: F, charSpacing: 3, margin: 0 });
  s.addText(t[1], { x: x + 0.28, y: y + 2.0, w: w - 0.56, h: 1.9, fontSize: 13.5, color: MUTED, fontFace: F, margin: 0, lineSpacing: 21 });
});
s.addText("一句话定位：一款帮你在陌生环境里「快速找到干净厕所并走到」的本地工具 App", {
  x: M, y: 6.0, w: W - 2 * M, h: 0.5, fontSize: 16, bold: true, color: DARK, fontFace: F, align: "center", margin: 0
});

// ============ 3 演示导览 ============
s = P.addSlide();
header(s, "现场演示导览（约 4 分钟）", 3);
const demo = [
  ["① 定位与首页", "打开 App：蓝点定位、城市区名（逆地理编码）、3km 信息流按距离排序"],
  ["② 地图找厕所", "金刚区进入地图页：蓝点 + Marker 全景，点 Marker 直达详情"],
  ["③ 厕所详情", "头图同色联动、信息卡、三格指标卡（纸/洗手台/清理）、大家都在说"],
  ["④ 发布评价", "登录态下打星 + 勾标签 + 填指标 → 发布，指标卡与星级实时更新"],
  ["⑤ 榜单变化", "好评榜/热评榜名次随新评价变化，前三名金银铜奖牌"],
  ["⑥ 步行导航", "一键深链高德导航；未装高德自动回退网页版导航"],
];
demo.forEach((t, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = M + col * 6.3, y = 1.3 + row * 1.72, w = 6.03;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 1.52, fill: { color: row % 2 === 0 ? "F7F9FA" : LIGHT }, rectRadius: 0.08 });
  s.addText(t[0], { x: x + 0.25, y: y + 0.14, w: w - 0.5, h: 0.42, fontSize: 16, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: x + 0.25, y: y + 0.6, w: w - 0.5, h: 0.82, fontSize: 12.5, color: MUTED, fontFace: F, margin: 0 });
});

// ============ 4 亮点：定位与搜索 ============
s = P.addSlide();
header(s, "核心实现 ①：定位与周边搜索的数据流水线", 4);
const flow = [
  ["混合定位", "GPS/WiFi/基站融合，精度约 30m"],
  ["逆地理编码", "city 为空时经纬度→「昆明市·呈贡区」"],
  ["POI 圆形检索", "SearchBound(圆心, 3000m) 关键词「公共厕所」"],
  ["Haversine 排序", "球面距离升序，误差 < 0.5%"],
  ["Room 缓存", "toilets 表按 uid 覆盖写入"],
  ["JOIN 聚合", "均分+评价数一条 SQL，防 N+1"],
];
flow.forEach((t, i) => {
  const x = M + i * 2.13, y = 1.5, w = 1.95;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 1.75, fill: { color: i % 2 === 0 ? LIGHT : "F7F9FA" }, line: { color: PRIMARY, width: 0.75 }, rectRadius: 0.07 });
  s.addText(String(i + 1), { x: x + 0.12, y: y + 0.1, w: 0.5, h: 0.4, fontSize: 17, bold: true, color: ACCENT, fontFace: F, margin: 0 });
  s.addText(t[0], { x: x + 0.1, y: y + 0.5, w: w - 0.2, h: 0.42, fontSize: 13, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: x + 0.1, y: y + 0.92, w: w - 0.2, h: 0.78, fontSize: 10.5, color: MUTED, fontFace: F, margin: 0 });
  if (i < 5) s.addShape(P.shapes.LINE, { x: x + w, y: y + 0.85, w: 0.18, h: 0, line: { color: PRIMARY, width: 2, endArrowType: "triangle" } });
});
s.addText([
  { text: "为什么自己重算距离？", options: { bold: true, color: DARK, breakLine: true } },
  { text: "高德 POI 返回的默认排序按平台权重，与用户真实步行远近不一致；用 Haversine 球面距离本地重算并升序排序，「附近」才名副其实。地球是球体，平面勾股定理在城市尺度会产生米级以上误差，Haversine 把经纬度视为球面角距换算成弧长，公式：a = sin²(Δφ/2) + cosφ1·cosφ2·sin²(Δλ/2)，d = 2R·atan2(√a, √(1−a))。", options: { color: MUTED } },
], { x: M, y: 3.65, w: W - 2 * M, h: 1.7, fontSize: 14, fontFace: F, margin: 0, paraSpaceAfter: 8, lineSpacing: 22 });
s.addText("代码位置：util/DistanceUtil.kt（Haversine）· util/ToiletRepository.kt（六步流水线单例）", {
  x: M, y: 5.6, w: W - 2 * M, h: 0.4, fontSize: 13, color: PRIMARY, fontFace: F, bold: true, margin: 0
});

// ============ 5 亮点：界面与指标卡 ============
s = P.addSlide();
header(s, "核心实现 ②：点评式信息架构与厕所指标卡", 5);
s.addText([
  { text: "界面设计原则（对应考核点：界面美观与合理）", options: { bold: true, color: DARK, breakLine: true } },
  { text: "借鉴大众点评的信息架构，皮肤采用自有蓝绿品牌色系，评分星保留通用琥珀色", options: { bullet: bu(), breakLine: true } },
  { text: "首页 = 渐变头部（定位城市+搜索）+ 金刚区三入口 + 四色信息流卡片，避免同色单调", options: { bullet: bu(), breakLine: true } },
  { text: "详情页 = 头图与列表卡片同色联动（按 POI id 稳定哈希取色）+ 上叠式信息白卡", options: { bullet: bu(), breakLine: true } },
  { text: "全程 ViewBinding + Material 3 组件：BottomNavigation / Chip / ToggleGroup / BottomSheet", options: { bullet: bu() } },
], { x: M, y: 1.3, w: 6.6, h: 3.6, fontSize: 14, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 9 });
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 7.4, y: 1.3, w: 5.43, h: 4.6, fill: { color: LIGHT }, rectRadius: 0.09 });
s.addText("🧻 厕纸供应 · 🚰 洗手台 · 🧹 清理除味", { x: 7.7, y: 1.55, w: 4.9, h: 0.5, fontSize: 15, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "三格指标卡（购房软件式）", options: { bold: true, color: DARK, breakLine: true } },
  { text: "结论行：取最近一条评价的指标（最新使用者反馈最真实）", options: { bullet: bu(), breakLine: true } },
  { text: "统计行：x/y 人——所有填写者的占比，单人偏差被稀释", options: { bullet: bu(), breakLine: true } },
  { text: "发布时 ToggleGroup 单选，默认已选，零成本填写", options: { bullet: bu(), breakLine: true } },
  { text: "数据来源全部为用户评价（UGC），无需官方数据接入", options: { bullet: bu() } },
], { x: 7.7, y: 2.15, w: 4.9, h: 3.5, fontSize: 13, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8 });
s.addText("此处贴真机截图：首页信息流 / 详情页指标卡", { x: M, y: 6.35, w: 6.6, h: 0.4, fontSize: 12.5, italic: true, color: MUTED, fontFace: F, margin: 0 });

// ============ 6 亮点：评价与榜单 ============
s = P.addSlide();
header(s, "核心实现 ③：评价系统与实时榜单", 6);
s.addText([
  { text: "评价数据模型（每条评价 = 11 个字段）", options: { bold: true, color: DARK, breakLine: true } },
  { text: "星级 1~5 + 文字内容 + 发布者（userId 外键）+ 时间戳", options: { bullet: bu(), breakLine: true } },
  { text: "标签：纸巾充足 / 干净卫生 / 免费 / 好找 / 不用排队（多选，逗号入库）", options: { bullet: bu(), breakLine: true } },
  { text: "指标三项：paperStatus / sinkType / cleaned（整型编码，-1 未填）", options: { bullet: bu() } },
], { x: M, y: 1.35, w: 6.5, h: 2.6, fontSize: 14, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 9 });
s.addText([
  { text: "实时榜单算法", options: { bold: true, color: DARK, breakLine: true } },
  { text: "好评榜：均分降序，同分按评价数多者优先（compareByDescending 链）", options: { bullet: bu(), breakLine: true } },
  { text: "热评榜：评价条数降序（数据热度）", options: { bullet: bu(), breakLine: true } },
  { text: "前三名金/银/铜奖牌徽章；数据源与首页同源（ToiletRepository），发布即变", options: { bullet: bu() } },
], { x: 7.2, y: 1.35, w: 5.6, h: 2.6, fontSize: 14, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 9 });
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.2, w: W - 2 * M, h: 1.9, fill: { color: LIGHT }, rectRadius: 0.09 });
s.addText([
  { text: "登录体系（本地账号）", options: { bold: true, color: DARK, breakLine: true } },
  { text: "发布评价强制登录（未登录自动跳转登录页）——保证评价可追溯到账号；users 表 username 唯一索引防重复注册；密码以 SHA-256(salt + password) 哈希落库，salt 每用户随机生成（SecureRandom 16 字节），登录时重算比对，数据库泄露也无法直接得到明文", options: { color: TEXT } },
], { x: M + 0.3, y: 4.4, w: W - 2 * M - 0.6, h: 1.55, fontSize: 13.5, fontFace: F, margin: 0, paraSpaceAfter: 7 });

// ============ 7 系统架构 ============
s = P.addSlide();
header(s, "系统架构：三层分离 + Repository 统一数据出口", 7);
const layers = [
  ["界面层", "HomeFragment · RankingFragment · MineFragment · MapActivity · ToiletDetailActivity · LoginActivity + 3 个 Adapter", "展示与交互，Fragment 宿主 + BottomNavigation"],
  ["数据仓库层", "ToiletRepository（object 单例）", "定位 → 逆地理 → POI → 排序 → 缓存 → 聚合的完整流水线；首页/地图/榜单共用，数据永远一致"],
  ["数据层", "Room（toilets/reviews/users v3）+ 高德 SDK 组合包 + SharedPreferences", "持久化、外部 LBS 服务、轻量键值"],
];
layers.forEach((t, i) => {
  const y = 1.35 + i * 1.66;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: y, w: 12.33, h: 1.38, fill: { color: i === 1 ? LIGHT : "F7F9FA" }, line: { color: PRIMARY, width: 1 }, rectRadius: 0.08 });
  s.addText(t[0], { x: M + 0.3, y: y + 0.16, w: 2.2, h: 0.5, fontSize: 18, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: M + 0.3, y: y + 0.72, w: 11.7, h: 0.45, fontSize: 12.5, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[2], { x: M + 2.7, y: y + 0.16, w: 9.3, h: 0.5, fontSize: 12.5, color: MUTED, fontFace: F, margin: 0 });
  if (i < 2) s.addShape(P.shapes.LINE, { x: W / 2, y: y + 1.38, w: 0, h: 0.28, line: { color: PRIMARY, width: 2.5, endArrowType: "triangle" } });
});
s.addText("收益：更换数据源只改 Repository 一层；三条页面共用同一数据出口，杜绝不一致；职责边界清晰支撑小组并行开发", {
  x: M, y: 6.5, w: W - 2 * M, h: 0.45, fontSize: 13.5, bold: true, color: DARK, fontFace: F, margin: 0
});

// ============ 8 数据存储（评分点） ============
s = P.addSlide();
header(s, "数据存储设计：两级存储，各司其职（10 分考核点）", 8);
s.addText([
  { text: "Room 数据库 toilet.db（v3，结构化数据）", options: { bold: true, color: DARK, breakLine: true } },
  { text: "toilets：POI 缓存，主键直接复用高德 POI uid，地图点与库记录一一对应", options: { bullet: bu(), breakLine: true } },
  { text: "reviews：评价 + 标签 + 三指标，toiletId/userId 双外键关联", options: { bullet: bu(), breakLine: true } },
  { text: "users：本地账号，username 唯一索引防重复注册", options: { bullet: bu(), breakLine: true } },
  { text: "LEFT JOIN + GROUP BY + AVG/COUNT 聚合查询：一条 SQL 取回列表所需全部字段", options: { bullet: bu(), breakLine: true } },
  { text: "编译期 SQL 校验：Room 在编译阶段检查字段与表名，错误不过夜", options: { bullet: bu() } },
], { x: M, y: 1.3, w: 6.7, h: 4.0, fontSize: 13.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 9 });
s.addText([
  { text: "SharedPreferences 文件（轻量会话）", options: { bold: true, color: DARK, breakLine: true } },
  { text: "登录态：userId / username / nickname", options: { bullet: bu(), breakLine: true } },
  { text: "最近定位：经纬度 + 城市区名（距离计算基准）", options: { bullet: bu(), breakLine: true } },
  { text: "搜索历史：8 条上限、去重置顶", options: { bullet: bu(), breakLine: true } },
  { text: "本质是 /data/data/包名/shared_prefs/ 下的 XML 文件", options: { bullet: bu() } },
], { x: 7.5, y: 1.3, w: 5.3, h: 3.0, fontSize: 13.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 9 });
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 7.5, y: 4.45, w: 5.33, h: 1.7, fill: { color: LIGHT }, rectRadius: 0.09 });
s.addText([
  { text: "合理性论证", options: { bold: true, color: DARK, breakLine: true } },
  { text: "按数据特征选介质：需要查询/聚合/约束的进数据库，轻量键值进文件；密码加盐不落明文", options: { color: TEXT } },
], { x: 7.8, y: 4.65, w: 4.75, h: 1.35, fontSize: 13, fontFace: F, margin: 0, paraSpaceAfter: 6 });
s.addText("安全设计：SHA-256 + 每用户随机盐（SecureRandom 16 字节），彩虹表失效；开发期破坏式迁移，正式版规划 Migration", {
  x: M, y: 5.75, w: 6.7, h: 1.0, fontSize: 12.5, color: MUTED, fontFace: F, margin: 0, lineSpacing: 20
});

// ============ 9 地图定位（评分点） ============
s = P.addSlide();
header(s, "地图定位实现：从「拿到坐标」到「走到门口」（10 分考核点）", 9);
const mapFlow = [
  ["隐私合规", "updatePrivacyShow/Agree 三 SDK 先行声明，否则定位错误码 12、地图白屏"],
  ["蓝点图层", "MyLocationStyle 连续定位 2s 间隔，地图上实时蓝点"],
  ["单点定位", "AMapLocationClient 拿经纬度 → 移动镜头 → 触发周边搜索"],
  ["Marker 渲染", "逐点 addMarker，uid↔Marker 双向映射支持点选"],
  ["深链导航", "amapuri://route/plan 直达高德步行导航"],
  ["网页回退", "未装高德捕获异常回退 uri.amap.com，全机型可用"],
];
mapFlow.forEach((t, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = M + col * 6.3, y = 1.35 + row * 1.62, w = 6.03;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 1.42, fill: { color: "F7F9FA" }, line: { color: PRIMARY, width: 0.75 }, rectRadius: 0.08 });
  s.addText(String(i + 1) + ". " + t[0], { x: x + 0.25, y: y + 0.12, w: w - 0.5, h: 0.42, fontSize: 15.5, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: x + 0.25, y: y + 0.58, w: w - 0.5, h: 0.75, fontSize: 12.5, color: MUTED, fontFace: F, margin: 0 });
});
s.addText("代码位置：ui/MapActivity.kt（地图页全流程）· ToiletApp.kt（隐私合规）· ToiletDetailActivity.navigateOnFoot()（深链）", {
  x: M, y: 6.45, w: W - 2 * M, h: 0.4, fontSize: 13, color: PRIMARY, fontFace: F, bold: true, margin: 0
});

// ============ 10 工程攻坚 ============
s = P.addSlide();
header(s, "工程实践：三个真实踩坑与解决", 10);
const pits = [
  ["Duplicate class 冲突", "三个独立高德包（3dmap/location/search）各自内嵌 com.amap.apis.utils.core.api.* 等相同类，dex 合并直接编译失败", "改用官方三合一组合包 3dmap-location-search，版本号内含三个组件版本（11.3.100_loc11.3.000_sea9.8.1）", "App 构建成功，包体与依赖数下降"],
  ["定位成功但城市为空", "纯 GPS 定位模式下 AMapLocation.city 返回空串，界面显示「位置未知」", "定位成功后检测 city 为空则调用 GeocodeSearch 逆地理编码，经纬度 → 行政区补齐", "右上角稳定显示「昆明市·呈贡区」"],
  ["列表页 N+1 查询", "逐条查询每间厕所的评价均值，20 条结果发起 21 次 SQL，列表明显卡顿", "改写为 LEFT JOIN + GROUP BY 聚合查询（ToiletDao.getAllWithStats），一次 SQL 返回全部统计", "列表查询次数 21 → 1，刷新流畅"],
];
pits.forEach((t, i) => {
  const y = 1.3 + i * 1.82;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: y, w: 12.33, h: 1.62, fill: { color: i === 1 ? LIGHT : "F7F9FA" }, rectRadius: 0.08 });
  s.addText(t[0], { x: M + 0.28, y: y + 0.12, w: 3.4, h: 1.35, fontSize: 15, bold: true, color: "B45309", fontFace: F, valign: "middle", margin: 0 });
  s.addText([{ text: "问题：" + t[1], options: { breakLine: true } }, { text: "解决：" + t[2], options: {} }], {
    x: 3.9, y: y + 0.12, w: 5.9, h: 1.4, fontSize: 12, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 5
  });
  s.addText([{ text: "结果：", options: { bold: true, color: DARK } }, { text: t[3], options: { color: DARK } }], {
    x: 10.0, y: y + 0.12, w: 2.55, h: 1.4, fontSize: 12, fontFace: F, margin: 0, valign: "middle"
  });
});

// ============ 11 Git 协同（评分点） ============
s = P.addSlide();
header(s, "团队协同：Git 全流程管理（10 分考核点）", 11);
s.addText([
  { text: "仓库与流程", options: { bold: true, color: DARK, breakLine: true } },
  { text: "GitHub 仓库：github.com/HeiCat233/lalmore（公开仓库，创新分与星数挂钩）", options: { bullet: bu(), breakLine: true } },
  { text: "分支模型：main 保持可运行，功能在 feature/xxx 分支开发", options: { bullet: bu(), breakLine: true } },
  { text: "合并机制：Pull Request + 至少 1 名队友 review 留言后 Merge", options: { bullet: bu(), breakLine: true } },
  { text: "任务管理：任务拆 Issue 认领（深色模式/收藏/README/测试记录），Project 看板跟踪", options: { bullet: bu(), breakLine: true } },
  { text: "冲突纪律：改前先 pull，冲突当面解决；main 任何时刻可编译运行", options: { bullet: bu() } },
], { x: M, y: 1.3, w: 6.6, h: 4.2, fontSize: 13.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 9 });
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 7.4, y: 1.3, w: 5.43, h: 4.2, fill: { color: "F7F9FA" }, rectRadius: 0.09 });
s.addText("提交纪律（commit 规范）", { x: 7.7, y: 1.5, w: 4.9, h: 0.45, fontSize: 15.5, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "feat: 新功能（feat: 厕所详情页商家页式重设计）", options: { bullet: bu(), breakLine: true } },
  { text: "fix: 修缺陷（fix: 逆地理编码兜底城市名显示）", options: { bullet: bu(), breakLine: true } },
  { text: "docs: 文档（docs: 组员认领清单 v2）", options: { bullet: bu(), breakLine: true } },
  { text: "chore/refactor: 构建、重构类改动", options: { bullet: bu(), breakLine: true } },
  { text: "已完成 28 次提交 · 分批提交保持每次可编译 · 期末统一推送", options: { bold: true, color: DARK } },
], { x: 7.7, y: 2.05, w: 4.9, h: 3.3, fontSize: 12.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8 });
s.addText("此处贴截图：GitHub Insights 贡献者统计 / PR 合并记录 / commit 历史截图", {
  x: M, y: 6.15, w: W - 2 * M, h: 0.4, fontSize: 12.5, italic: true, color: MUTED, fontFace: F, margin: 0
});

// ============ 12 创新点与展望 ============
s = P.addSlide();
header(s, "创新点与展望", 12);
const inns = [
  ["指标结构化", "把「有没有纸/洗手台类型/是否有人清理」做成三格指标卡 + 众人统计，首创性地将购房软件的指标体系迁移到公共设施评价"],
  ["距离自算", "不信任平台权重，用 Haversine 球面距离本地重算排序，「附近」名副其实"],
  ["无断点导航", "深链直达步行导航 + 未装高德自动回退网页版，0 额外依赖覆盖全机型"],
  ["离线可用", "搜索结果落库缓存，冷启动秒出列表，断网也能查看最近一次结果"],
];
inns.forEach((t, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = M + col * 6.3, y = 1.35 + row * 1.55, w = 6.03;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 1.4, fill: { color: LIGHT }, rectRadius: 0.08 });
  s.addText(t[0], { x: x + 0.25, y: y + 0.1, w: w - 0.5, h: 0.4, fontSize: 15.5, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: x + 0.25, y: y + 0.52, w: w - 0.5, h: 0.85, fontSize: 12, color: MUTED, fontFace: F, margin: 0 });
});
s.addText([
  { text: "展望：", options: { bold: true, color: DARK } },
  { text: "接入 BaaS 实现评价云端共享与账号互通 → 引入厕所实拍图与「即时状态上报」（排队/缺纸）→ 数据库正式 Migration 与 SQLCipher 加密 → 适老化大字模式", options: { color: TEXT } },
], { x: M, y: 4.75, w: W - 2 * M, h: 1.1, fontSize: 14, fontFace: F, margin: 0, lineSpacing: 22 });

// ============ 13 个人贡献（评分点 20 分） ============
s = P.addSlide();
header(s, "个人贡献（20 分考核点：写明具体功能与管理工作）", 13);
const contrib = [
  [{ text: "成员", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "具体功能贡献", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "管理工作", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }],
  ["【组长姓名】", "三层架构与 Repository 设计；地图页全流程（定位/POI/Marker/深链导航）；Room v3 三表与 JOIN 聚合；评价与指标体系；登录模块（SHA-256 加盐）；点评式界面重设计；演示数据生成器", "组长：任务拆解与 Issue 分派；仓库管理与 PR review；commit 规范制定；答辩材料统筹；进度风险跟踪"],
  ["【成员B】", "深色模式适配（values-night 资源限定符）；收藏功能（数据库迁移实践）", "参与 PR 交叉 review；界面走查反馈"],
  ["【成员C】", "README 项目主页；系统测试记录表（含断网/未授权/未装高德等边界用例）", "测试组织；演示脚本与计时；会议记录"],
];
s.addTable(contrib, {
  x: M, y: 1.3, w: W - 2 * M, colW: [1.9, 6.6, 3.83],
  border: { pt: 0.75, color: "D9E2E5" }, fontFace: F, fontSize: 12, color: TEXT,
  valign: "middle", rowH: 1.1, margin: 0.08, align: "left",
});
s.addText("佐证材料：GitHub 贡献者统计图 / 各成员 PR 与 commit 明细 / Issue 认领记录（答辩现场展示）", {
  x: M, y: 6.2, w: W - 2 * M, h: 0.4, fontSize: 12.5, italic: true, color: MUTED, fontFace: F, margin: 0
});

// ============ 14 测试与总结 ============
s = P.addSlide();
header(s, "测试情况与总结", 14);
const tests = [
  ["定位授权拒绝", "拒绝权限后给出 Toast 引导，App 不崩溃", "通过"],
  ["断网搜索", "POI 搜索失败有明确提示，缓存数据仍可浏览", "通过"],
  ["空内容校验", "发布空评价被拦截并提示，默认值兜底", "通过"],
  ["重复注册", "相同用户名被唯一索引拦截，前端先行查重", "通过"],
  ["未装高德导航", "捕获 ActivityNotFoundException，回退网页版导航", "通过"],
  ["真机全流程", "realme RMX2202（Android 13+）全功能走查，无崩溃", "通过"],
];
s.addTable(tests.map(r => [r[0], r[1], r[2]]).map((r, i) => i === 0
  ? [{ text: "用例", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "预期", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "结果", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }]
  : r), {
  x: M, y: 1.3, w: 7.6, colW: [1.9, 4.5, 1.2],
  border: { pt: 0.75, color: "D9E2E5" }, fontFace: F, fontSize: 12, color: TEXT,
  valign: "middle", rowH: 0.5, margin: 0.06, align: "left",
});
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 8.5, y: 1.3, w: 4.33, h: 4.3, fill: { color: LIGHT }, rectRadius: 0.09 });
s.addText("总结", { x: 8.8, y: 1.55, w: 3.7, h: 0.5, fontSize: 17, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "完成度高：考核点全部落地，真机验证通过", options: { bullet: bu(), breakLine: true } },
  { text: "工程规范：28 次规范提交、三层架构、真实踩坑记录", options: { bullet: bu(), breakLine: true } },
  { text: "有真实价值：解决高频刚需，可继续迭代为成熟产品", options: { bullet: bu() } },
], { x: 8.8, y: 2.15, w: 3.75, h: 3.3, fontSize: 13, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 10 });

// ============ 15 谢谢 ============
s = P.addSlide();
s.background = { color: DEEP };
s.addShape(P.shapes.OVAL, { x: -1.2, y: H - 2.6, w: 4.0, h: 4.0, fill: { color: "FFFFFF", transparency: 92 } });
s.addText("谢谢聆听", { x: M, y: 2.4, w: W - 2 * M, h: 1.2, fontSize: 54, bold: true, color: "FFFFFF", fontFace: F, align: "center" });
s.addText("欢迎现场体验 · 恳请批评指正", { x: M, y: 3.75, w: W - 2 * M, h: 0.6, fontSize: 20, color: "D9F2F2", fontFace: F, align: "center" });
s.addText("仓库：github.com/HeiCat233/lalmore    ·    演示设备：realme 真机 + 备用录屏", {
  x: M, y: 4.95, w: W - 2 * M, h: 0.45, fontSize: 13, color: "9ED4D4", fontFace: F, align: "center"
});

P.writeFile({ fileName: "D:/develop/lalmore/deliverables/期末答辩-附近厕所.pptx" }).then(() => console.log("FINAL_DONE"));
