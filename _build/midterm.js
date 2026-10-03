// 期中开题汇报 PPT —— 「附近厕所」
const pptxgen = require("pptxgenjs");

const P = new pptxgen();
P.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
P.author = "附近厕所项目组";

const W = 13.33, H = 7.5, M = 0.5;
const BG = "FFFFFF", DEEP = "00575D", PRIMARY = "00A6A6", DARK = "006D6D";
const ACCENT = "FFB000", TEXT = "1B1B1B", MUTED = "6B7280", LIGHT = "E8F6F6";
const F = "Microsoft YaHei";

const bu = () => ({ code: "25B8", indent: 12 });
const shadow = () => ({ type: "outer", color: "000000", blur: 6, offset: 2, angle: 45, opacity: 0.12 });

// 内容页页眉：左上标题 + 右上页码（无色条装饰）
function header(s, title, no) {
  s.background = { color: BG };
  s.addText(title, { x: M, y: 0.32, w: 9.5, h: 0.7, fontSize: 27, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(String(no).padStart(2, "0"), { x: W - 1.3, y: 0.36, w: 0.8, h: 0.6, fontSize: 22, bold: true, color: ACCENT, fontFace: F, align: "right", margin: 0 });
}

// ================= 1 封面 =================
let s = P.addSlide();
s.background = { color: DEEP };
s.addShape(P.shapes.OVAL, { x: -1.5, y: -1.8, w: 4.2, h: 4.2, fill: { color: "FFFFFF", transparency: 92 } });
s.addShape(P.shapes.OVAL, { x: W - 2.6, y: H - 2.4, w: 3.6, h: 3.6, fill: { color: "FFFFFF", transparency: 93 } });
s.addText("《移动应用开发及安全》期中开题汇报", { x: M, y: 1.55, w: W - 2 * M, h: 0.5, fontSize: 18, color: "BFE8E8", fontFace: F, align: "center" });
s.addText("附近厕所", { x: M, y: 2.25, w: W - 2 * M, h: 1.35, fontSize: 66, bold: true, color: "FFFFFF", fontFace: F, align: "center" });
s.addText("基于高德地图的公共厕所查询 · 评价 · 导航 App", { x: M, y: 3.72, w: W - 2 * M, h: 0.5, fontSize: 20, color: "D9F2F2", fontFace: F, align: "center" });
s.addShape(P.shapes.LINE, { x: W / 2 - 1.2, y: 4.55, w: 2.4, h: 0, line: { color: ACCENT, width: 2.5 } });
s.addText("项目组：【组长姓名】·【成员B】·【成员C】        指导教师：【教师姓名】        2026 年 10 月", {
  x: M, y: 4.85, w: W - 2 * M, h: 0.45, fontSize: 14, color: "9ED4D4", fontFace: F, align: "center"
});
s.addText("汇报人：【组长姓名】  学号：【学号】", { x: M, y: 5.35, w: W - 2 * M, h: 0.4, fontSize: 14, color: "9ED4D4", fontFace: F, align: "center" });

// ================= 2 汇报提纲 =================
s = P.addSlide();
header(s, "汇报提纲", 2);
const toc = [
  ["01", "选题背景与需求分析", "四个真实痛点 → 一款工具 App 的立项依据"],
  ["02", "产品设计", "页面结构、功能清单与考核点映射"],
  ["03", "技术路线", "选型理由、三层架构、数据库设计"],
  ["04", "进度·分工·风险", "当前完成度、迭代计划、风险预案"],
];
toc.forEach((t, i) => {
  const y = 1.35 + i * 1.35;
  s.addText(t[0], { x: M, y: y, w: 1.1, h: 1.0, fontSize: 40, bold: true, color: PRIMARY, fontFace: F, margin: 0 });
  s.addText(t[1], { x: 1.75, y: y + 0.02, w: 10.5, h: 0.55, fontSize: 22, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[2], { x: 1.75, y: y + 0.58, w: 10.5, h: 0.45, fontSize: 14, color: MUTED, fontFace: F, margin: 0 });
  if (i < 3) s.addShape(P.shapes.LINE, { x: 1.75, y: y + 1.18, w: 10.5, h: 0, line: { color: "E5E7EB", width: 0.75 } });
});

// ================= 3 选题背景 =================
s = P.addSlide();
header(s, "选题背景：出门在外，「方便」这件事不方便", 3);
const pains = [
  ["急用时找不到", "陌生街区、景区、夜间场景下，地图 App 搜索结果杂乱，混入商场内部点位与已关闭点位，试错成本高"],
  ["好坏无从判断", "公共厕所普遍缺少评价体系：有没有纸、干不干净、要不要排队，全凭运气，找到才发现不能用的体验很糟"],
  ["信息不结构化", "厕纸供应、洗手台类型、是否有人清理等关键信息没有任何平台收录，用户无法提前决策"],
  ["流程割裂", "从「搜到」到「走到」需要在地图、点评类 App 之间反复跳转，急迫场景下体验很差"],
];
pains.forEach((t, i) => {
  const y = 1.25 + i * 1.42;
  s.addShape(P.shapes.OVAL, { x: M, y: y + 0.12, w: 0.62, h: 0.62, fill: { color: LIGHT } });
  s.addText(String(i + 1), { x: M, y: y + 0.12, w: 0.62, h: 0.62, fontSize: 20, bold: true, color: DARK, fontFace: F, align: "center", valign: "middle", margin: 0 });
  s.addText(t[0], { x: 1.45, y: y, w: 11.3, h: 0.45, fontSize: 18, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[1], { x: 1.45, y: y + 0.46, w: 11.3, h: 0.75, fontSize: 13.5, color: MUTED, fontFace: F, margin: 0 });
});

// ================= 4 解决方案 =================
s = P.addSlide();
header(s, "解决方案：一款「搜得到 · 看得懂 · 走得到」的工具 App", 4);
s.addText([
  { text: "定位用户 3km 内的公共厕所，按真实步行距离排序，", options: { breakLine: true } },
  { text: "用结构化指标与本地评价呈现「好坏」，再一键深链步行导航。", options: {} },
], { x: M, y: 1.25, w: W - 2 * M, h: 1.0, fontSize: 19, color: DARK, fontFace: F, bold: true, margin: 0, lineSpacing: 30 });
const pillars = [
  ["搜得到", "定位 + 3km 圆形 POI 检索", "高德混合定位（GPS/WiFi/基站），周边搜索关键词「公共厕所」，结果按 Haversine 球面距离由近到远排序（城市尺度误差 < 0.5%）"],
  ["看得懂", "指标卡 + 标签 + 评价流", "厕纸供应 / 洗手台类型 / 清理除味三项结构化指标，配合「大家都在说」标签统计与本地评价，好坏一目了然"],
  ["走得到", "深链导航 + 网页回退", "amapuri:// 直达高德步行导航；未安装高德时自动回退 uri.amap.com 网页导航，全机型可用"],
];
pillars.forEach((t, i) => {
  const x = M + i * 4.18, y = 2.5, w = 3.95;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 3.9, fill: { color: i === 1 ? LIGHT : "F7F9FA" }, rectRadius: 0.09, shadow: shadow() });
  s.addText(t[0], { x: x + 0.3, y: y + 0.32, w: w - 0.6, h: 0.65, fontSize: 26, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: x + 0.3, y: y + 1.0, w: w - 0.6, h: 0.5, fontSize: 14.5, bold: true, color: PRIMARY, fontFace: F, margin: 0 });
  s.addText(t[2], { x: x + 0.3, y: y + 1.55, w: w - 0.6, h: 2.1, fontSize: 13, color: MUTED, fontFace: F, margin: 0, lineSpacing: 21 });
});

// ================= 5 需求分析与考核点映射 =================
s = P.addSlide();
header(s, "需求分析：功能清单与考核点映射", 5);
const reqRows = [
  [{ text: "功能模块", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "实现要点", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "对应考核点", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }],
  ["定位与蓝点", "高德混合定位 + 逆地理编码显示城市区名", "地图定位（10分）"],
  ["周边搜索", "3km 圆形范围 POI 检索「公共厕所」", "地图定位（10分）"],
  ["距离排序", "Haversine 球面距离升序，本地重算", "创新性和实用性（10分）"],
  ["厕所详情", "头图 + 信息卡 + 三格指标卡 + 标签统计", "界面设计（10分）"],
  ["评价系统", "登录后发布：星级 + 标签 + 三指标", "数据存储（10分）"],
  ["排行榜", "好评榜（均分）/ 热评榜（条数），前三名奖牌", "创新性和实用性（10分）"],
  ["步行导航", "URL Scheme 深链 + 网页版回退", "地图定位（10分）"],
  ["本地账号", "注册登录，SHA-256 加盐存密码", "数据存储（10分）"],
  ["Git 协同", "feature 分支 + PR + 规范 commit", "团队协同（10分）"],
];
s.addTable(reqRows, {
  x: M, y: 1.25, w: W - 2 * M, colW: [2.4, 7.2, 3.23],
  border: { pt: 0.75, color: "D9E2E5" }, fontFace: F, fontSize: 12.5, color: TEXT,
  valign: "middle", rowH: 0.52, margin: 0.06, align: "left",
});

// ================= 6 页面结构流程 =================
s = P.addSlide();
header(s, "产品设计：页面结构与用户路径", 6);
function box(x, y, w, h, txt, dark) {
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: h, fill: { color: dark ? DARK : "FFFFFF" }, line: { color: PRIMARY, width: 1 }, rectRadius: 0.07, shadow: shadow() });
  s.addText(txt, { x: x, y: y, w: w, h: h, fontSize: 13.5, bold: true, color: dark ? "FFFFFF" : TEXT, fontFace: F, align: "center", valign: "middle", margin: 0.03 });
}
function arrow(x1, y1, x2, y2) {
  // 仅画水平/垂直正向线：保证 w、h 非负（负宽高会生成非法 XML，PowerPoint 拒开）
  const x = Math.min(x1, x2), y = Math.min(y1, y2);
  const w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  s.addShape(P.shapes.LINE, { x: x, y: y, w: w, h: h, line: { color: PRIMARY, width: 2, endArrowType: "triangle", beginArrowType: x1 > x2 || y1 > y2 ? "triangle" : "none" } });
}
box(0.7, 1.7, 2.3, 0.85, "启动 / 登录\n（本地账号）", false);
box(4.0, 1.7, 2.6, 0.85, "首页信息流\n定位城市 + 3km 列表", true);
box(7.9, 0.75, 2.4, 0.85, "地图找厕所\n蓝点 + Marker", false);
box(7.9, 2.75, 2.4, 0.85, "厕所详情页\n指标卡 + 评价流", false);
box(11.0, 0.75, 1.85, 0.85, "步行导航\n深链 / 网页", false);
box(11.0, 2.75, 1.85, 0.85, "发布评价\n星级+标签+指标", false);
box(4.0, 4.35, 2.6, 0.85, "榜单页\n好评榜 / 热评榜", false);
box(7.9, 4.35, 2.4, 0.85, "我的\n账号 + 我的评价", false);
arrow(3.0, 2.12, 4.0, 2.12);
arrow(6.6, 1.17, 7.9, 1.17);
arrow(6.6, 3.17, 7.9, 3.17);
arrow(10.3, 1.17, 11.0, 1.17);
arrow(10.3, 3.17, 11.0, 3.17);
arrow(5.3, 2.55, 5.3, 4.35);
arrow(6.6, 4.77, 7.9, 4.77);
s.addText("核心用户路径：定位 → 附近列表 → 详情（指标/评价）→ 步行导航；评价回流榜单与首页星级", {
  x: M, y: 5.65, w: W - 2 * M, h: 0.5, fontSize: 14, color: MUTED, fontFace: F, margin: 0
});
s.addText("底部导航三大 Tab（首页/榜单/我的）+ 金刚区快捷入口（地图/榜单/搜索历史）", {
  x: M, y: 6.15, w: W - 2 * M, h: 0.5, fontSize: 14, color: MUTED, fontFace: F, margin: 0
});

// ================= 7 技术选型 =================
s = P.addSlide();
header(s, "技术选型：成熟框架优先，不重复造轮子", 7);
const techRows = [
  [{ text: "层次", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "选型", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "版本", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "选型理由", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }],
  ["开发语言", "Kotlin", "2.0.21", "Google 官方首选：空安全、协程、代码量比 Java 少约 30%"],
  ["构建体系", "Gradle + AGP", "8.9 / 8.7.3", "官方构建链，依赖走阿里云镜像加速"],
  ["UI 体系", "View + ViewBinding + Material 3", "1.12.0", "XML 与设计稿一一对应、资料最全；Material 组件白送底部导航/卡片/弹窗"],
  ["本地存储", "Room（SQLite ORM）", "2.6.1", "编译期校验 SQL、KSP 生成实现类，三表 + JOIN 聚合"],
  ["地图能力", "高德 SDK 组合包", "11.3.x", "定位/3D地图/POI/逆地理一站集成，个人免费配额充足"],
  ["异步模型", "Kotlin 协程", "1.8.1", "lifecycleScope + suspend，数据库网络不卡主线程"],
  ["密码安全", "SHA-256 + 随机盐", "—", "不存明文，盐值逐用户独立，彩虹表失效"],
];
s.addTable(techRows, {
  x: M, y: 1.25, w: W - 2 * M, colW: [1.9, 3.5, 1.7, 5.73],
  border: { pt: 0.75, color: "D9E2E5" }, fontFace: F, fontSize: 12, color: TEXT,
  valign: "middle", rowH: 0.56, margin: 0.06, align: "left",
});

// ================= 8 系统架构 =================
s = P.addSlide();
header(s, "系统架构：三层分离 + 统一数据出口", 8);
const layers = [
  ["界面层", "HomeFragment · RankingFragment · MineFragment · MapActivity · ToiletDetailActivity · LoginActivity", "只负责展示与交互", "F0FAFA"],
  ["数据仓库层", "ToiletRepository（单例数据流水线）", "定位 → 逆地理 → POI 检索 → Haversine 排序 → 缓存 → 聚合，首页/地图/榜单共用同一数据源", LIGHT],
  ["数据层", "Room 数据库（toilets / reviews / users）＋ 高德 SDK ＋ SharedPreferences", "持久化、外部服务、轻量键值", "F0FAFA"],
];
layers.forEach((t, i) => {
  const y = 1.3 + i * 1.62;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: y, w: 12.33, h: 1.35, fill: { color: t[3] }, line: { color: PRIMARY, width: 1 }, rectRadius: 0.08 });
  s.addText(t[0], { x: M + 0.3, y: y + 0.18, w: 2.2, h: 0.5, fontSize: 18, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: M + 0.3, y: y + 0.72, w: 11.7, h: 0.45, fontSize: 13, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[2], { x: M + 2.7, y: y + 0.18, w: 9.3, h: 0.5, fontSize: 12.5, color: MUTED, fontFace: F, margin: 0 });
  if (i < 2) s.addShape(P.shapes.LINE, { x: W / 2, y: y + 1.35, w: 0, h: 0.27, line: { color: PRIMARY, width: 2.5, endArrowType: "triangle" } });
});
s.addText("Repository 模式的收益：换数据源只改一层；首页与地图搜索结果永远一致；单元职责清晰，便于小组分工", {
  x: M, y: 6.35, w: W - 2 * M, h: 0.45, fontSize: 13.5, color: DARK, fontFace: F, bold: true, margin: 0
});

// ================= 9 数据库设计 =================
s = P.addSlide();
header(s, "数据库设计：Room 三表（v3）", 9);
box(0.9, 1.6, 3.3, 2.5, "users（本地账号）\n\nid PK 自增\nusername 唯一索引\npasswordHash + salt\nnickname / createdAt", false);
box(5.0, 1.6, 3.3, 3.0, "reviews（评价 · v3）\n\nid PK 自增\ntoiletId FK → toilets\nuserId FK → users\nrating 1~5 / content\ntags 逗号分隔\npaperStatus / sinkType / cleaned", true);
box(9.1, 1.6, 3.3, 2.5, "toilets（POI 缓存）\n\nid PK = 高德 POI uid\nname / address\nlat / lng\ncreatedAt", false);
s.addText("1 : N", { x: 4.25, y: 2.55, w: 0.72, h: 0.4, fontSize: 14, bold: true, color: DARK, fontFace: F, align: "center", margin: 0 });
s.addShape(P.shapes.LINE, { x: 4.22, y: 2.75, w: 0.76, h: 0, line: { color: PRIMARY, width: 2, endArrowType: "triangle" } });
s.addShape(P.shapes.LINE, { x: 8.32, y: 2.75, w: 0.76, h: 0, line: { color: PRIMARY, width: 2, endArrowType: "triangle", beginArrowType: "triangle" } });
s.addText("N : 1", { x: 8.38, y: 2.55, w: 0.7, h: 0.4, fontSize: 14, bold: true, color: DARK, fontFace: F, align: "center", margin: 0 });
s.addText([
  { text: "合理性设计：", options: { bold: true, color: DARK, breakLine: true } },
  { text: "结构化数据进 Room（查询/聚合/唯一约束），轻量会话数据进 SharedPreferences 文件 —— 两级存储", options: { bullet: bu(), breakLine: true } },
  { text: "toilets 主键直接复用高德 POI uid，地图兴趣点与数据库记录一一对应", options: { bullet: bu(), breakLine: true } },
  { text: "密码经 SHA-256(salt+pwd) 哈希落库，不存明文；username 唯一索引防重复注册", options: { bullet: bu(), breakLine: true } },
  { text: "LEFT JOIN 一次查询同时取回厕所与均分/评价数，避免 N+1 查询", options: { bullet: bu() } },
], { x: M, y: 4.55, w: W - 2 * M, h: 2.3, fontSize: 14, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8 });

// ================= 10 当前进度 =================
s = P.addSlide();
header(s, "当前进度：核心闭环已全部跑通", 10);
s.addText("85%", { x: M, y: 1.5, w: 3.6, h: 1.6, fontSize: 72, bold: true, color: PRIMARY, fontFace: F, margin: 0 });
s.addText("整体完成度\n（按计划功能点折算）", { x: M, y: 3.15, w: 3.6, h: 0.8, fontSize: 14, color: MUTED, fontFace: F, margin: 0 });
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.1, w: 3.6, h: 0.3, fill: { color: "E5E7EB" }, rectRadius: 0.14 });
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.1, w: 3.6 * 0.85, h: 0.3, fill: { color: PRIMARY }, rectRadius: 0.14 });
const done = [
  "定位蓝点 + 逆地理城市名 + 3km POI 搜索（真机验证通过）",
  "Haversine 距离排序 + 地图 Marker + 点选跳转详情",
  "点评式首页（四色信息流）+ 厕所指标卡（纸/洗手台/清理）",
  "评价系统（登录 + 标签 + 指标）+ 好评榜/热评榜",
  "本地账号（SHA-256 加盐）+ 演示数据一键生成",
  "步行导航深链 + 网页回退（真机跳转验证通过）",
];
s.addText(done.map((t, i) => ({ text: t, options: { bullet: bu(), breakLine: i < done.length - 1 } })), {
  x: 4.6, y: 1.45, w: 8.2, h: 3.1, fontSize: 14.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 9
});
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 4.6, y: 4.75, w: 8.2, h: 1.55, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText([
  { text: "剩余工作（组员认领中）：", options: { bold: true, color: DARK, breakLine: true } },
  { text: "深色模式适配 · 收藏功能 · README 与项目主页 · 系统测试记录表", options: { color: TEXT } },
], { x: 4.9, y: 4.95, w: 7.6, h: 1.2, fontSize: 14, fontFace: F, margin: 0, paraSpaceAfter: 6 });

// ================= 11 开发计划 =================
s = P.addSlide();
header(s, "迭代计划：两周内完成收尾", 11);
const plan = [
  ["第 1~2 周", "调研选题 · 技术预研（高德SDK/Room）", "已完成"],
  ["第 3~4 周", "环境搭建 · 地图/定位/POI 原型", "已完成"],
  ["第 5~6 周", "评价/指标/榜单/登录核心功能", "已完成"],
  ["第 7 周", "大众点评式界面重设计 + 指标卡", "已完成"],
  ["第 8 周", "测试记录 · README · 修缺陷", "进行中"],
  ["第 9~10 周", "演示彩排 · 报告定稿 · 答辩准备", "计划中"],
];
plan.forEach((t, i) => {
  const y = 1.35 + i * 0.88;
  s.addShape(P.shapes.OVAL, { x: M, y: y + 0.06, w: 0.3, h: 0.3, fill: { color: t[2] === "已完成" ? PRIMARY : t[2] === "进行中" ? ACCENT : "C7CDD4" } });
  if (i < plan.length - 1) s.addShape(P.shapes.LINE, { x: M + 0.15, y: y + 0.4, w: 0, h: 0.54, line: { color: "D9E2E5", width: 1.5 } });
  s.addText(t[0], { x: 1.1, y: y, w: 1.7, h: 0.45, fontSize: 15, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[1], { x: 2.9, y: y, w: 7.0, h: 0.45, fontSize: 14.5, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[2], { x: 10.3, y: y, w: 2.4, h: 0.45, fontSize: 14, bold: true, color: t[2] === "已完成" ? PRIMARY : t[2] === "进行中" ? "D97706" : MUTED, fontFace: F, margin: 0 });
});

// ================= 12 团队分工 =================
s = P.addSlide();
header(s, "团队分工（2~4 人，含认领机制）", 12);
const team = [
  [{ text: "成员", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "角色", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "负责模块", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "状态", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }],
  ["【组长姓名】", "架构 / 主要开发", "三层架构搭建、地图与 POI 搜索、Room 数据层、评价与指标体系、榜单、登录、界面重设计", "进行中"],
  ["【成员B】", "功能开发", "深色模式适配（values-night）、收藏功能（Room v3 迁移练习）", "已认领"],
  ["【成员C】", "文档 / 测试", "README 项目主页、系统测试记录表、演示脚本", "已认领"],
];
s.addTable(team, {
  x: M, y: 1.3, w: W - 2 * M, colW: [2.0, 2.2, 6.63, 1.5],
  border: { pt: 0.75, color: "D9E2E5" }, fontFace: F, fontSize: 13, color: TEXT,
  valign: "middle", rowH: 0.85, margin: 0.08, align: "left",
});
s.addText([
  { text: "协同机制：", options: { bold: true, color: DARK, breakLine: true } },
  { text: "GitHub 仓库（HeiCat233/lalmore）+ feature 分支 + Pull Request + 至少 1 人 review 后合并", options: { bullet: bu(), breakLine: true } },
  { text: "commit 规范：feat / fix / docs / chore 前缀 + 中文描述；任务以 Issue 认领，看板跟踪", options: { bullet: bu(), breakLine: true } },
  { text: "当前已完成 28 次规范提交，全部本地留存，期末前统一推送", options: { bullet: bu() } },
], { x: M, y: 4.6, w: W - 2 * M, h: 2.2, fontSize: 14, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8 });

// ================= 13 风险与应对 =================
s = P.addSlide();
header(s, "风险识别与应对", 13);
const risks = [
  ["高德免费配额超限", "个人认证每接口约 5000 次/日，演示与调试用量远低于配额；已做三层节省：POI 结果缓存进 Room、定位间隔 2 秒、搜索半径收敛 3km；超出配额仅调用失败不会扣费", "低风险"],
  ["无后端导致评价不互通", "课程范围定位为本地闭环（评分标准只要求文件或数据库存储）；云端同步作为展望方向写入报告，架构上 Repository 单例已预留替换空间", "已规避"],
  ["真机兼容性差异", "minSdk 26（Android 8.0）覆盖主流机型；已在 realme 真机全流程验证；高德 SDK 官方兼容矩阵覆盖目标版本", "低风险"],
  ["进度风险", "核心闭环已 100% 跑通，剩余为文档与打磨类任务，通过 Issue 认领并行推进", "可控"],
];
risks.forEach((t, i) => {
  const y = 1.3 + i * 1.38;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: y, w: 1.5, h: 1.1, fill: { color: t[2] === "已规避" ? LIGHT : "FFF8E8" }, rectRadius: 0.08 });
  s.addText(t[2], { x: M, y: y, w: 1.5, h: 1.1, fontSize: 14, bold: true, color: t[2] === "已规避" ? DARK : "B45309", fontFace: F, align: "center", valign: "middle", margin: 0.04 });
  s.addText(t[0], { x: 2.25, y: y + 0.02, w: 10.5, h: 0.45, fontSize: 16.5, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[1], { x: 2.25, y: y + 0.48, w: 10.5, h: 0.8, fontSize: 13, color: MUTED, fontFace: F, margin: 0 });
});

// ================= 14 结尾 =================
s = P.addSlide();
s.background = { color: DEEP };
s.addShape(P.shapes.OVAL, { x: -1.2, y: H - 2.6, w: 4.0, h: 4.0, fill: { color: "FFFFFF", transparency: 92 } });
s.addText("谢谢聆听", { x: M, y: 2.5, w: W - 2 * M, h: 1.2, fontSize: 54, bold: true, color: "FFFFFF", fontFace: F, align: "center" });
s.addText("恳请老师与同学批评指正", { x: M, y: 3.85, w: W - 2 * M, h: 0.6, fontSize: 20, color: "D9F2F2", fontFace: F, align: "center" });
s.addText("项目组：【组长姓名】·【成员B】·【成员C】    ·    仓库：github.com/HeiCat233/lalmore", {
  x: M, y: 5.0, w: W - 2 * M, h: 0.45, fontSize: 13, color: "9ED4D4", fontFace: F, align: "center"
});

P.writeFile({ fileName: "D:/develop/lalmore/deliverables/期中开题汇报-附近厕所.pptx" }).then(() => console.log("MIDTERM_DONE"));
