// 期末大作业汇报 PPT（13 页）—— 「附近厕所」
// 定位：结题汇报，补充实现细节与技术深度
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
  s.addText(title, { x: M, y: 0.32, w: 10.4, h: 0.7, fontSize: 27, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(String(no).padStart(2, "0"), { x: W - 1.3, y: 0.36, w: 0.8, h: 0.6, fontSize: 22, bold: true, color: ACCENT, fontFace: F, align: "right", margin: 0 });
}

// 截图占位框（仅期末使用）
function shot(s, x, y, w, h, label) {
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: h, fill: { color: "F3F6F7" }, line: { color: "B9C6CB", width: 1, dashType: "dash" }, rectRadius: 0.06 });
  s.addText(label, { x: x, y: y, w: w, h: h, fontSize: 11, italic: true, color: "8A9AA1", fontFace: F, align: "center", valign: "middle", margin: 0.05 });
}

// ============ 1 封面 ============
let s = P.addSlide();
s.background = { color: DEEP };
s.addShape(P.shapes.OVAL, { x: -1.5, y: -1.8, w: 4.2, h: 4.2, fill: { color: "FFFFFF", transparency: 92 } });
s.addShape(P.shapes.OVAL, { x: W - 2.6, y: H - 2.4, w: 3.6, h: 3.6, fill: { color: "FFFFFF", transparency: 93 } });
s.addText("《移动应用开发及安全》期末大作业汇报", { x: M, y: 1.5, w: W - 2 * M, h: 0.5, fontSize: 18, color: "BFE8E8", fontFace: F, align: "center" });
s.addText("附近厕所", { x: M, y: 2.2, w: W - 2 * M, h: 1.35, fontSize: 66, bold: true, color: "FFFFFF", fontFace: F, align: "center" });
s.addText("搜得到 · 看得懂 · 走得到 —— 公共厕所查询 / 评价 / 导航 App", { x: M, y: 3.68, w: W - 2 * M, h: 0.5, fontSize: 19, color: "D9F2F2", fontFace: F, align: "center" });
s.addShape(P.shapes.LINE, { x: W / 2 - 1.2, y: 4.5, w: 2.4, h: 0, line: { color: ACCENT, width: 2.5 } });
s.addText("项目组：【组长姓名】 · 【成员B】 · 【成员C】        指导教师：【教师姓名】", { x: M, y: 4.8, w: W - 2 * M, h: 0.45, fontSize: 14, color: "9ED4D4", fontFace: F, align: "center" });
s.addText("2026 年 12 月", { x: M, y: 5.3, w: W - 2 * M, h: 0.4, fontSize: 14, color: "9ED4D4", fontFace: F, align: "center" });

// ============ 2 项目概览（仅一句话定位） ============
s = P.addSlide();
header(s, "项目概览", 2);
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 1.0, y: 2.0, w: W - 2.0, h: 3.0, fill: { color: LIGHT }, rectRadius: 0.1, shadow: shadow() });
s.addText("一句话定位", { x: 1.4, y: 2.35, w: W - 2.8, h: 0.5, fontSize: 16, bold: true, color: PRIMARY, fontFace: F, align: "center", margin: 0 });
s.addText("一款帮用户在陌生环境里\n「快速找到干净厕所并走过去」的本地工具 App", {
  x: 1.4, y: 3.0, w: W - 2.8, h: 1.6, fontSize: 28, bold: true, color: DARK, fontFace: F, align: "center", valign: "middle", margin: 0, lineSpacing: 42,
});

// ============ 3 需求分析 ============
s = P.addSlide();
header(s, "需求分析", 3);
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.25, w: 3.5, h: 5.0, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText("用户需求", { x: M + 0.28, y: 1.45, w: 2.95, h: 0.45, fontSize: 16, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "快：急用时立刻找到最近的公共厕所", options: { bullet: bu(), breakLine: true } },
  { text: "准：结果要真的近，而不是按平台权重排", options: { bullet: bu(), breakLine: true } },
  { text: "明：提前知道有没有纸、干不干净", options: { bullet: bu(), breakLine: true } },
  { text: "顺：一步导航过去，不用来回切换应用", options: { bullet: bu() } },
], { x: M + 0.28, y: 2.05, w: 2.95, h: 2.6, fontSize: 13, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 10 });
s.addText("目标用户：游客、通勤的上班族与学生、户外工作者、带小孩的家庭。", { x: M + 0.28, y: 4.8, w: 2.95, h: 1.3, fontSize: 12, color: MUTED, fontFace: F, margin: 0, lineSpacing: 19 });

const g3 = [
  ["定位与搜索", "F1 用户定位 · F2 周边搜索 · F3 距离排序 · F4 地图展示"],
  ["详情与评价", "F5 厕所详情 · F7 发布评价（星级 + 标签 + 三项指标）"],
  ["账号与榜单", "F6 用户账号 · F8 排行榜 · F9 步行导航"],
];
g3.forEach((g, i) => {
  const x = 4.25, y = 1.25 + i * 1.15, w = 8.58;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 0.98, fill: { color: "F7F9FA" }, line: { color: PRIMARY, width: 0.75 }, rectRadius: 0.07 });
  s.addText(g[0], { x: x + 0.25, y: y, w: 2.0, h: 0.98, fontSize: 14, bold: true, color: DARK, fontFace: F, valign: "middle", margin: 0 });
  s.addText(g[1], { x: x + 2.3, y: y, w: w - 2.55, h: 0.98, fontSize: 12, color: TEXT, fontFace: F, valign: "middle", margin: 0 });
});
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 4.25, y: 4.75, w: 8.58, h: 1.5, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText("非功能需求", { x: 4.5, y: 4.88, w: 8.1, h: 0.4, fontSize: 14, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "易用性：主流程不超过 3 步   |   稳定性：权限拒绝、断网、未装第三方地图不崩溃", options: { breakLine: true } },
  { text: "性能：列表差量刷新，冷启动优先展示缓存   |   安全性：密码不明文存储   |   兼容性：最低支持 Android 8.0", options: {} },
], { x: 4.5, y: 5.3, w: 8.1, h: 0.85, fontSize: 11.5, color: TEXT, fontFace: F, margin: 0, lineSpacing: 20 });

// ============ 4 系统设计：总体架构 ============
s = P.addSlide();
header(s, "系统设计：三层架构 + 统一数据出口", 4);
const layers = [
  ["界面层", "首页 / 榜单 / 我的（Fragment）· 地图页 / 详情页 / 登录页（Activity）· 各列表 Adapter", "展示与交互", "F0FAFA"],
  ["数据仓库层", "ToiletRepository（object 单例）", "定位 → 逆地理 → POI → 排序 → 缓存 → 聚合，各页面共用", LIGHT],
  ["数据层", "Room（toilets / reviews / users）· 高德 SDK · SharedPreferences", "持久化、外部服务、轻量键值", "F0FAFA"],
];
layers.forEach((t, i) => {
  const y = 1.3 + i * 1.55;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: y, w: 12.33, h: 1.3, fill: { color: t[3] }, line: { color: PRIMARY, width: 1 }, rectRadius: 0.08 });
  s.addText(t[0], { x: M + 0.3, y: y + 0.16, w: 2.2, h: 0.5, fontSize: 18, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: M + 0.3, y: y + 0.7, w: 11.7, h: 0.45, fontSize: 12.5, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[2], { x: M + 2.7, y: y + 0.16, w: 9.3, h: 0.5, fontSize: 12, color: MUTED, fontFace: F, margin: 0 });
  if (i < 2) s.addShape(P.shapes.LINE, { x: W / 2, y: y + 1.3, w: 0, h: 0.25, line: { color: PRIMARY, width: 2.5, endArrowType: "triangle" } });
});
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 6.05, w: 12.33, h: 0.85, fill: { color: "F7F9FA" }, rectRadius: 0.07 });
s.addText("页面结构：底部三 Tab（首页 / 榜单 / 我的）+ 地图页 / 详情页 / 登录页；Repository 是唯一数据出口，保证多页面数据一致。", {
  x: M + 0.3, y: 6.05, w: 11.9, h: 0.85, fontSize: 13, bold: true, color: DARK, fontFace: F, valign: "middle", margin: 0,
});

// ============ 5 数据库设计（无版本演进） ============
s = P.addSlide();
header(s, "数据库设计：Room 三表", 5);
function tbox(x, y, w, h, title, lines, dark) {
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: h, fill: { color: dark ? LIGHT : "F7F9FA" }, line: { color: PRIMARY, width: 1 }, rectRadius: 0.07, shadow: shadow() });
  s.addText(title, { x: x + 0.22, y: y + 0.16, w: w - 0.44, h: 0.42, fontSize: 15, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(lines.map((t, i) => ({ text: t, options: { breakLine: i < lines.length - 1 } })), {
    x: x + 0.22, y: y + 0.66, w: w - 0.44, h: h - 0.82, fontSize: 11.5, color: TEXT, fontFace: F, margin: 0, lineSpacing: 17,
  });
}
tbox(0.6, 1.4, 3.5, 2.9, "users（用户表）", ["id 主键，自增", "username 唯一索引", "passwordHash 密码哈希", "salt 随机盐值", "nickname 昵称", "createdAt 注册时间"], false);
tbox(4.9, 1.4, 3.5, 3.2, "reviews（评价表）", ["id 主键，自增", "toiletId 外键 → toilets", "userId 外键 → users", "rating 星级 1~5", "content 评价内容", "tags 标签，逗号分隔", "paperStatus / sinkType / cleaned", "createdAt 发布时间"], true);
tbox(9.2, 1.4, 3.5, 2.9, "toilets（厕所表）", ["id 主键", "复用高德 POI 唯一标识", "name 名称", "address 地址", "lat / lng 经纬度", "createdAt 入库时间"], false);
s.addText("1 : N", { x: 4.18, y: 2.5, w: 0.65, h: 0.35, fontSize: 13, bold: true, color: DARK, fontFace: F, align: "center", margin: 0 });
s.addShape(P.shapes.LINE, { x: 4.15, y: 2.7, w: 0.7, h: 0, line: { color: PRIMARY, width: 2, endArrowType: "triangle" } });
s.addText("N : 1", { x: 8.5, y: 2.5, w: 0.65, h: 0.35, fontSize: 13, bold: true, color: DARK, fontFace: F, align: "center", margin: 0 });
s.addShape(P.shapes.LINE, { x: 8.48, y: 2.7, w: 0.7, h: 0, line: { color: PRIMARY, width: 2, endArrowType: "triangle", beginArrowType: "triangle" } });
s.addText([
  { text: "设计合理性：", options: { bold: true, color: DARK, breakLine: true } },
  { text: "厕所表主键直接复用高德 POI 唯一标识，地图点位与数据库记录一一对应", options: { bullet: bu(), breakLine: true } },
  { text: "结构化数据进数据库，登录态、最近定位等轻量数据进 SharedPreferences 文件，形成两级存储", options: { bullet: bu(), breakLine: true } },
  { text: "密码采用「随机盐 + 哈希」方式存储，不保存明文", options: { bullet: bu() } },
], { x: M, y: 4.95, w: W - 2 * M, h: 2.0, fontSize: 13, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8 });

// ============ 6 核心实现①：定位与周边搜索 ============
s = P.addSlide();
header(s, "核心实现 ①：定位与周边搜索的数据流水线", 6);
const flow = [
  ["隐私合规", "初始化地图 SDK 前完成隐私声明，否则定位失败、地图白屏"],
  ["混合定位", "融合 GPS / Wi-Fi / 基站信号获取经纬度，精度约 30m"],
  ["逆地理兜底", "城市字段为空时，用经纬度反向查询补齐城市区县"],
  ["POI 圆形检索", "以用户为圆心、3km 为半径检索「公共厕所」"],
  ["距离排序", "对结果重新计算球面距离并按由近到远排序"],
  ["缓存与聚合", "结果写入数据库，并聚合评价统计后返回"],
];
flow.forEach((t, i) => {
  const col = i % 3, row = Math.floor(i / 3);
  const x = M + col * 4.18, y = 1.4 + row * 2.35, w = 3.95;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 2.0, fill: { color: i % 2 === 0 ? LIGHT : "F7F9FA" }, line: { color: PRIMARY, width: 0.75 }, rectRadius: 0.08, shadow: shadow() });
  s.addText(String(i + 1), { x: x + 0.25, y: y + 0.15, w: 0.6, h: 0.5, fontSize: 20, bold: true, color: ACCENT, fontFace: F, margin: 0 });
  s.addText(t[0], { x: x + 0.85, y: y + 0.2, w: w - 1.1, h: 0.45, fontSize: 15.5, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: x + 0.25, y: y + 0.8, w: w - 0.5, h: 1.05, fontSize: 12, color: MUTED, fontFace: F, margin: 0, lineSpacing: 18 });
});
s.addText("代码位置：ToiletRepository.kt（数据流水线单例）· ToiletApp.kt（隐私合规）", {
  x: M, y: 6.3, w: W - 2 * M, h: 0.4, fontSize: 12.5, bold: true, color: PRIMARY, fontFace: F, margin: 0,
});

// ============ 7 核心实现②：距离排序算法 ============
s = P.addSlide();
header(s, "核心实现 ②：距离排序算法", 7);
s.addText([
  { text: "为什么自己算距离？", options: { bold: true, color: DARK, breakLine: true } },
  { text: "地图平台默认按综合权重排序，权重包含热度、等级等因素，并不等于「离用户近」。本项目对结果重新计算真实距离并升序排序，让「附近」名副其实。", options: { color: TEXT } },
], { x: M, y: 1.3, w: W - 2 * M, h: 1.3, fontSize: 14.5, fontFace: F, margin: 0, paraSpaceAfter: 6, lineSpacing: 24 });

s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 2.85, w: 6.1, h: 3.4, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText("Haversine 球面距离公式", { x: M + 0.3, y: 3.05, w: 5.5, h: 0.45, fontSize: 16, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText("a = sin²(Δφ/2) + cosφ₁ · cosφ₂ · sin²(Δλ/2)", { x: M + 0.3, y: 3.6, w: 5.5, h: 0.5, fontSize: 14, color: DARK, fontFace: "Consolas", margin: 0 });
s.addText("c = 2 · atan2(√a, √(1−a))", { x: M + 0.3, y: 4.1, w: 5.5, h: 0.5, fontSize: 14, color: DARK, fontFace: "Consolas", margin: 0 });
s.addText("d = R · c   （R = 6371000 米）", { x: M + 0.3, y: 4.6, w: 5.5, h: 0.5, fontSize: 14, color: DARK, fontFace: "Consolas", margin: 0 });
s.addText("φ 纬度、λ 经度、R 地球半径；几公里范围内相对误差小于 0.5%。", { x: M + 0.3, y: 5.25, w: 5.5, h: 0.7, fontSize: 11.5, color: MUTED, fontFace: F, margin: 0, lineSpacing: 18 });

s.addText([
  { text: "为什么不用平面勾股定理？", options: { bold: true, color: DARK, breakLine: true } },
  { text: "地球近似球体，经线长度随纬度升高而缩短。直接对经纬度使用平面勾股定理，在城市尺度上会产生米级以上误差。", options: { bullet: bu(), breakLine: true } },
  { text: "Haversine 把经纬度视为球面角距换算成弧长，精度与计算效率兼顾。", options: { bullet: bu(), breakLine: true } },
  { text: "为什么不用更精确的椭球算法？", options: { bold: true, color: DARK, breakLine: true } },
  { text: "考虑地球椭率的算法计算量更大，而本项目只需几公里范围的排序，Haversine 已完全够用。", options: { bullet: bu() } },
], { x: 6.9, y: 2.85, w: 5.93, h: 3.4, fontSize: 12.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 7, lineSpacing: 19 });

s.addText("代码位置：util/DistanceUtil.kt", { x: M, y: 6.4, w: W - 2 * M, h: 0.4, fontSize: 12.5, bold: true, color: PRIMARY, fontFace: F, margin: 0 });

// ============ 8 核心实现③：结构化指标卡（含截图位） ============
s = P.addSlide();
header(s, "核心实现 ③：结构化指标卡", 8);
s.addText([
  { text: "设计来源：", options: { bold: true, color: DARK } },
  { text: "把公共厕所最受关注的三个维度提取为结构化指标，让用户在出发前就能判断实际条件。", options: { color: TEXT } },
], { x: M, y: 1.25, w: 7.6, h: 0.6, fontSize: 14, fontFace: F, margin: 0 });

const metrics = [
  ["厕纸供应", "没纸 / 偶尔有 / 充足"],
  ["洗手台", "无 / 公共 / 独立"],
  ["清理除味", "无专人 / 有专人"],
];
metrics.forEach((t, i) => {
  const x = M + i * 2.6, y = 2.0, w = 2.4;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 1.5, fill: { color: LIGHT }, line: { color: PRIMARY, width: 1 }, rectRadius: 0.07, shadow: shadow() });
  s.addText(t[0], { x: x + 0.18, y: y + 0.22, w: w - 0.36, h: 0.45, fontSize: 15, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: x + 0.18, y: y + 0.78, w: w - 0.36, h: 0.55, fontSize: 11.5, color: MUTED, fontFace: F, margin: 0, lineSpacing: 17 });
});

s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 3.85, w: 7.6, h: 2.75, fill: { color: "F7F9FA" }, rectRadius: 0.08 });
s.addText("指标卡的两行展示", { x: M + 0.28, y: 4.0, w: 7.1, h: 0.42, fontSize: 15, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "结论行：展示最新一条评价的指标取值，反映最新使用者的真实反馈", options: { bullet: bu(), breakLine: true } },
  { text: "统计行：展示所有填写者中的占比，例如「12/15 人表示有纸」，避免单条评价的偶然性", options: { bullet: bu(), breakLine: true } },
  { text: "录入方式：发布评价时单选录入，默认已选，填写成本低", options: { bullet: bu(), breakLine: true } },
  { text: "数据来源：全部来自用户评价（UGC），无需接入官方数据源", options: { bullet: bu() } },
], { x: M + 0.28, y: 4.5, w: 7.1, h: 2.0, fontSize: 12.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 7, lineSpacing: 19 });

shot(s, 8.4, 1.25, 4.43, 5.35, "此处贴真机截图\n详情页指标卡");

// ============ 9 核心实现④：评价、榜单与用户体系 ============
s = P.addSlide();
header(s, "核心实现 ④：评价、榜单与用户体系", 9);
s.addText([
  { text: "评价数据模型", options: { bold: true, color: DARK, breakLine: true } },
  { text: "星级 1~5 + 文字内容 + 发布者（userId 外键）+ 时间戳", options: { bullet: bu(), breakLine: true } },
  { text: "标签：纸巾充足 / 干净卫生 / 免费 / 好找 / 不用排队（多选，逗号入库）", options: { bullet: bu(), breakLine: true } },
  { text: "指标三项：paperStatus / sinkType / cleaned（整型编码，-1 未填）", options: { bullet: bu() } },
], { x: M, y: 1.3, w: 6.4, h: 2.6, fontSize: 13.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8, lineSpacing: 20 });
s.addText([
  { text: "实时榜单算法", options: { bold: true, color: DARK, breakLine: true } },
  { text: "好评榜：均分降序，同分按评价数多者优先", options: { bullet: bu(), breakLine: true } },
  { text: "热评榜：评价条数降序，反映数据热度", options: { bullet: bu(), breakLine: true } },
  { text: "前三名金 / 银 / 铜奖牌；数据源与首页同源，发布即变", options: { bullet: bu() } },
], { x: 7.1, y: 1.3, w: 5.73, h: 2.6, fontSize: 13.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8, lineSpacing: 20 });

s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.2, w: W - 2 * M, h: 2.4, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText([
  { text: "用户体系（本地账号）", options: { bold: true, color: DARK, breakLine: true } },
  { text: "发布评价强制登录，未登录自动跳转登录页，保证评价可追溯到账号", options: { bullet: bu(), breakLine: true } },
  { text: "users 表 username 唯一索引防重复注册；密码长度不足会被拒绝", options: { bullet: bu(), breakLine: true } },
  { text: "密码以「随机盐 + 哈希」方式落库：每用户随机生成 16 字节盐值，相同密码在不同用户处哈希值不同，彩虹表失效", options: { bullet: bu() } },
], { x: M + 0.3, y: 4.4, w: W - 2 * M - 0.6, h: 2.05, fontSize: 13, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8, lineSpacing: 20 });

// ============ 10 核心实现⑤：步行导航 ============
s = P.addSlide();
header(s, "核心实现 ⑤：步行导航", 10);
const nav = [
  ["深链唤起", "通过隐式 Intent 匹配高德导航协议，携带目的地经纬度直接唤起步行导航，无需引入重量级导航 SDK", "amapuri://route/plan"],
  ["网页回退", "当设备未安装高德地图时，系统会抛出异常；应用捕获后自动回退到网页版导航，保证所有机型可用", "uri.amap.com"],
];
nav.forEach((t, i) => {
  const y = 1.5 + i * 2.4;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: y, w: 7.6, h: 2.05, fill: { color: i === 0 ? LIGHT : "F7F9FA" }, line: { color: PRIMARY, width: 1 }, rectRadius: 0.08, shadow: shadow() });
  s.addText(t[0], { x: M + 0.3, y: y + 0.22, w: 7.0, h: 0.5, fontSize: 19, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: M + 0.3, y: y + 0.85, w: 7.0, h: 1.0, fontSize: 13, color: TEXT, fontFace: F, margin: 0, lineSpacing: 21 });
});
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 8.5, y: 1.5, w: 4.33, h: 4.45, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText("方案优势", { x: 8.8, y: 1.75, w: 3.7, h: 0.5, fontSize: 16, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "包体小：不引入额外导航 SDK", options: { bullet: bu(), breakLine: true } },
  { text: "覆盖广：已装高德直接跳转，未装则回退网页版", options: { bullet: bu(), breakLine: true } },
  { text: "体验顺：从详情页一步进入导航", options: { bullet: bu() } },
], { x: 8.8, y: 2.4, w: 3.7, h: 3.3, fontSize: 13, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 12, lineSpacing: 21 });

// ============ 11 界面设计（含截图位） ============
s = P.addSlide();
header(s, "界面设计", 11);
s.addText([
  { text: "设计思路：", options: { bold: true, color: DARK } },
  { text: "采用蓝绿品牌色系，信息层次清晰，兼顾美观与信息密度，减少无效操作。", options: { color: TEXT } },
], { x: M, y: 1.25, w: 6.6, h: 0.6, fontSize: 14, fontFace: F, margin: 0 });
s.addText([
  { text: "首页：渐变头部 + 定位搜索区 + 快捷入口 + 信息流卡片", options: { bullet: bu(), breakLine: true } },
  { text: "地图页：全屏地图，蓝点定位与 Marker 清晰可辨", options: { bullet: bu(), breakLine: true } },
  { text: "详情页：头图与卡片颜色联动，指标卡突出显示", options: { bullet: bu(), breakLine: true } },
  { text: "榜单页：排名清晰，前三名使用金银铜奖牌", options: { bullet: bu(), breakLine: true } },
  { text: "我的页：账号信息、我的评价与演示数据入口", options: { bullet: bu(), breakLine: true } },
  { text: "登录页：登录与注册双模式，校验提示明确", options: { bullet: bu() } },
], { x: M, y: 2.0, w: 6.6, h: 3.2, fontSize: 13, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8, lineSpacing: 20 });
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.35, w: 6.6, h: 1.35, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText([
  { text: "交互细节：", options: { bold: true, color: DARK, breakLine: true } },
  { text: "列表差量刷新、未登录引导登录、定位/搜索异常均有明确提示", options: { color: TEXT } },
], { x: M + 0.28, y: 5.55, w: 6.05, h: 1.0, fontSize: 12.5, fontFace: F, margin: 0, paraSpaceAfter: 5 });
shot(s, 7.4, 1.25, 5.43, 5.45, "此处贴真机截图\n首页信息流 / 地图 Marker / 详情指标卡 / 榜单 / 登录页");

// ============ 12 团队协同与项目管理（三人） ============
s = P.addSlide();
header(s, "团队协同与项目管理", 12);
const teamRows = [
  [{ text: "成员", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "主要贡献", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }],
  ["【组长姓名】", "三层架构与 Repository 设计；地图与检索、数据存储、评价与榜单、登录模块、界面设计"],
  ["【成员B】", "部分功能开发、界面适配、测试记录与缺陷修复"],
  ["【成员C】", "项目文档、演示脚本、测试组织与材料整理"],
];
s.addTable(teamRows, {
  x: M, y: 1.3, w: 7.3, colW: [1.9, 5.4],
  border: { pt: 0.75, color: "D9E2E5" }, fontFace: F, fontSize: 12, color: TEXT,
  valign: "middle", rowH: 0.7, margin: 0.07, align: "left",
});
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 4.25, w: 7.3, h: 2.45, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText("协作流程", { x: M + 0.3, y: 4.38, w: 6.7, h: 0.42, fontSize: 15, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "认领任务（Issue）→ 创建功能分支 → 本地开发提交 → 推送分支 → 发起 Pull Request → 组员评审留言 → 合并到主分支", options: { color: TEXT, breakLine: true } },
  { text: "提交规范：feat 新增功能 / fix 修复缺陷 / docs 文档变更 / chore 构建配置，统一前缀加中文说明", options: { color: TEXT } },
], { x: M + 0.3, y: 4.88, w: 6.7, h: 1.7, fontSize: 12.5, fontFace: F, margin: 0, paraSpaceAfter: 8, lineSpacing: 20 });

s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 8.1, y: 1.3, w: 4.73, h: 2.6, fill: { color: "F7F9FA" }, rectRadius: 0.08 });
s.addText("管理成果", { x: 8.4, y: 1.5, w: 4.1, h: 0.45, fontSize: 16, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "仓库累计 31 次规范提交", options: { bullet: bu(), breakLine: true } },
  { text: "主分支始终保持可运行", options: { bullet: bu(), breakLine: true } },
  { text: "分支开发 + PR 评审机制", options: { bullet: bu() } },
], { x: 8.4, y: 2.05, w: 4.1, h: 1.7, fontSize: 13, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 10, lineSpacing: 21 });
shot(s, 8.1, 4.1, 4.73, 2.6, "此处贴截图\nGitHub 贡献者统计 / commit 历史");

// ============ 13 总结与展望 + 结尾 ============
s = P.addSlide();
header(s, "总结与展望", 13);
s.addText([
  { text: "项目总结", options: { bold: true, color: DARK, breakLine: true } },
  { text: "围绕「找厕所」这一真实高频场景，完成了从需求分析、方案设计、编码实现到测试验收的完整开发过程，实现了定位、周边搜索、距离排序、地图标注、厕所详情、用户账号、评价发布、排行榜与步行导航等核心功能。", options: { color: TEXT } },
], { x: M, y: 1.3, w: W - 2 * M, h: 1.7, fontSize: 13.5, fontFace: F, margin: 0, paraSpaceAfter: 7, lineSpacing: 22 });
s.addText([
  { text: "不足与改进", options: { bold: true, color: DARK, breakLine: true } },
  { text: "数据保存在本地，评价无法跨设备共享 —— 后续接入云端服务实现同步", options: { bullet: bu(), breakLine: true } },
  { text: "密码使用快速哈希算法 —— 生产环境改用 BCrypt、Argon2 等专用慢哈希", options: { bullet: bu(), breakLine: true } },
  { text: "缺少厕所实拍图片与即时状态上报 —— 后续增加图片与实时状态功能", options: { bullet: bu() } },
], { x: M, y: 3.2, w: W - 2 * M, h: 2.0, fontSize: 13.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8, lineSpacing: 21 });
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.5, w: W - 2 * M, h: 1.15, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText("未来展望：云端化实现评价共享与账号互通 · 增加图片与实时状态 · 完善无障碍与适老化设计", {
  x: M + 0.3, y: 5.5, w: W - 2 * M - 0.6, h: 1.15, fontSize: 13.5, bold: true, color: DARK, fontFace: F, valign: "middle", margin: 0,
});
s.addText("谢谢聆听 · 欢迎现场体验 · 恳请批评指正", { x: M, y: 6.72, w: W - 2 * M, h: 0.45, fontSize: 14, bold: true, color: PRIMARY, fontFace: F, align: "center", margin: 0 });

P.writeFile({ fileName: "D:/develop/lalmore/deliverables/期末大作业汇报-附近厕所.pptx" }).then(() => console.log("FINAL_V3_DONE"));
