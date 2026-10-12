// 期中开题汇报 PPT（11 页）—— 「附近厕所」
// 定位：开题汇报，重选题/需求/选型/分工，弱化技术细节与进度
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

function header(s, title, no) {
  s.background = { color: BG };
  s.addText(title, { x: M, y: 0.32, w: 10.4, h: 0.7, fontSize: 27, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(String(no).padStart(2, "0"), { x: W - 1.3, y: 0.36, w: 0.8, h: 0.6, fontSize: 22, bold: true, color: ACCENT, fontFace: F, align: "right", margin: 0 });
}

function table(rows, opts) {
  return { rows, opts };
}

// ================= 1 封面（不出现任何人员信息） =================
let s = P.addSlide();
s.background = { color: DEEP };
s.addShape(P.shapes.OVAL, { x: -1.5, y: -1.8, w: 4.2, h: 4.2, fill: { color: "FFFFFF", transparency: 92 } });
s.addShape(P.shapes.OVAL, { x: W - 2.6, y: H - 2.4, w: 3.6, h: 3.6, fill: { color: "FFFFFF", transparency: 93 } });
s.addText("《移动应用开发及安全》期中开题汇报", { x: M, y: 1.75, w: W - 2 * M, h: 0.5, fontSize: 18, color: "BFE8E8", fontFace: F, align: "center" });
s.addText("附近厕所", { x: M, y: 2.45, w: W - 2 * M, h: 1.35, fontSize: 66, bold: true, color: "FFFFFF", fontFace: F, align: "center" });
s.addText("基于高德地图的公共厕所查询 · 评价 · 导航 App", { x: M, y: 3.92, w: W - 2 * M, h: 0.5, fontSize: 20, color: "D9F2F2", fontFace: F, align: "center" });
s.addShape(P.shapes.LINE, { x: W / 2 - 1.2, y: 4.75, w: 2.4, h: 0, line: { color: ACCENT, width: 2.5 } });
s.addText("2026 年 10 月", { x: M, y: 5.05, w: W - 2 * M, h: 0.45, fontSize: 14, color: "9ED4D4", fontFace: F, align: "center" });

// ================= 2 汇报提纲 =================
s = P.addSlide();
header(s, "汇报提纲", 2);
const toc = [
  ["01", "项目概述", "选题背景、项目目标与考核要求对应"],
  ["02", "需求分析", "目标用户与功能需求"],
  ["03", "系统设计", "技术选型与总体架构"],
  ["04", "界面设计", "设计思路与主要页面"],
  ["05", "团队分工协作与项目管理", "两人分工、Git 协作与阶段计划"],
];
toc.forEach((t, i) => {
  const y = 1.45 + i * 1.05;
  s.addText(t[0], { x: M, y: y, w: 1.1, h: 0.85, fontSize: 34, bold: true, color: PRIMARY, fontFace: F, margin: 0 });
  s.addText(t[1], { x: 1.75, y: y + 0.02, w: 10.5, h: 0.5, fontSize: 21, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[2], { x: 1.75, y: y + 0.5, w: 10.5, h: 0.4, fontSize: 13.5, color: MUTED, fontFace: F, margin: 0 });
  if (i < toc.length - 1) s.addShape(P.shapes.LINE, { x: 1.75, y: y + 0.95, w: 10.5, h: 0, line: { color: "E5E7EB", width: 0.75 } });
});

// ================= 3 选题背景 =================
s = P.addSlide();
header(s, "选题背景：找厕所这件「小事」并不小", 3);
const pains = [
  ["搜索结果杂乱", "地图搜索「厕所」时，结果中常混入商场内部点位、已关闭点位和名称相近的无关地点，需要逐个判断"],
  ["排序不符合真实距离", "地图默认按综合权重排序，权重包含热度、等级等因素，「最近的」未必排在最前"],
  ["缺少质量信息", "有没有纸、洗手台是公共还是独立、是否有人清理，这些关键信息没有任何平台收录"],
  ["流程割裂", "从「搜到」到「走到」需要在地图、点评等多个应用间切换，急迫场景下体验差"],
];
pains.forEach((t, i) => {
  const y = 1.3 + i * 1.42;
  s.addShape(P.shapes.OVAL, { x: M, y: y + 0.12, w: 0.62, h: 0.62, fill: { color: LIGHT } });
  s.addText(String(i + 1), { x: M, y: y + 0.12, w: 0.62, h: 0.62, fontSize: 20, bold: true, color: DARK, fontFace: F, align: "center", valign: "middle", margin: 0 });
  s.addText(t[0], { x: 1.45, y: y, w: 11.3, h: 0.45, fontSize: 18, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[1], { x: 1.45, y: y + 0.46, w: 11.3, h: 0.75, fontSize: 13.5, color: MUTED, fontFace: F, margin: 0 });
});

// ================= 4 项目目标与选题意义 =================
s = P.addSlide();
header(s, "项目目标：搜得到 · 看得懂 · 走得到", 4);
const goals = [
  ["搜得到", "快速找到附近真实可用的公共厕所", "定位当前位置，检索 3 公里范围内的公共厕所，并按真实距离由近到远排序"],
  ["看得懂", "提前判断厕所的实际条件", "用结构化指标与用户评价，呈现厕纸、洗手台、清理除味等关键信息"],
  ["走得到", "一键从详情页走到目的地", "从厕所详情页直接唤起步行导航，无需在多个应用之间来回切换"],
];
goals.forEach((t, i) => {
  const x = M + i * 4.18, y = 1.45, w = 3.95;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 3.5, fill: { color: i === 1 ? LIGHT : "F7F9FA" }, rectRadius: 0.09, shadow: shadow() });
  s.addText(t[0], { x: x + 0.3, y: y + 0.32, w: w - 0.6, h: 0.65, fontSize: 26, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: x + 0.3, y: y + 1.05, w: w - 0.6, h: 0.5, fontSize: 14.5, bold: true, color: PRIMARY, fontFace: F, margin: 0 });
  s.addText(t[2], { x: x + 0.3, y: y + 1.65, w: w - 0.6, h: 1.6, fontSize: 12.5, color: MUTED, fontFace: F, margin: 0, lineSpacing: 20 });
});
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 5.35, w: W - 2 * M, h: 1.35, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText([
  { text: "选题意义：", options: { bold: true, color: DARK } },
  { text: "场景虽小，但链路完整，能够覆盖移动应用开发的主要知识点 —— 定位与地图、网络检索、本地数据存储、多界面架构、用户体系与跨应用通信，是一个适合课程大作业的题目。", options: { color: TEXT } },
], { x: M + 0.3, y: 5.55, w: W - 2 * M - 0.6, h: 1.0, fontSize: 14, fontFace: F, margin: 0, lineSpacing: 24 });

// ================= 5 考核要求对应 =================
s = P.addSlide();
header(s, "选题与课程考核要求的对应", 5);
const reqRows = [
  [{ text: "考核要求", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "分值", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "本项目的落实方式", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }],
  ["大作业报告", "20 分", "按设计开发过程撰写，含核心流程与核心代码，附目录"],
  ["界面设计", "10 分", "采用蓝绿品牌色系，信息层次清晰，兼顾美观与信息密度"],
  ["演示过程", "10 分", "全流程真机演示，功能可现场复现"],
  ["程序功能创新性和实用性", "10 分", "结构化指标卡、真实距离排序、无断点导航"],
  ["数据存储使用", "10 分", "Room 数据库三张表 + SharedPreferences 文件存储"],
  ["地图定位使用", "10 分", "高德地图定位、周边搜索、Marker 渲染与步行导航"],
  ["团队协同开发工具使用", "10 分", "Git + GitHub，分支开发、PR 评审、规范提交"],
];
s.addTable(reqRows, {
  x: M, y: 1.35, w: W - 2 * M, colW: [3.1, 1.5, 8.23],
  border: { pt: 0.75, color: "D9E2E5" }, fontFace: F, fontSize: 13, color: TEXT,
  valign: "middle", rowH: 0.58, margin: 0.07, align: "left",
});
s.addText("每个功能模块都对应明确的评分点，保证开发不跑题。", {
  x: M, y: 6.35, w: W - 2 * M, h: 0.45, fontSize: 14, bold: true, color: DARK, fontFace: F, margin: 0,
});

// ================= 6 需求分析 =================
s = P.addSlide();
header(s, "需求分析：目标用户与功能需求", 6);
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.25, w: 3.4, h: 5.0, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText("目标用户", { x: M + 0.28, y: 1.45, w: 2.85, h: 0.45, fontSize: 16, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "游客", options: { bullet: bu(), breakLine: true } },
  { text: "通勤的上班族与学生", options: { bullet: bu(), breakLine: true } },
  { text: "户外工作者", options: { bullet: bu(), breakLine: true } },
  { text: "带小孩的家庭", options: { bullet: bu() } },
], { x: M + 0.28, y: 2.05, w: 2.85, h: 2.2, fontSize: 13.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 10 });
s.addText("共同特点：需求突发、时间紧迫、对位置和可用性要求高。", { x: M + 0.28, y: 4.4, w: 2.85, h: 1.6, fontSize: 12.5, color: MUTED, fontFace: F, margin: 0, lineSpacing: 20 });

const groups = [
  ["定位与搜索", ["F1 用户定位：获取当前位置并显示城市区县", "F2 周边搜索：检索 3 公里内的公共厕所", "F3 距离排序：按球面距离由近到远", "F4 地图展示：蓝点定位与 Marker 标注"]],
  ["详情与评价", ["F5 厕所详情：基础信息 + 指标 + 评价", "F7 发布评价：星级 + 标签 + 三项指标"]],
  ["账号与榜单", ["F6 用户账号：注册、登录与登录态保持", "F8 排行榜：好评榜与热评榜", "F9 步行导航：深链唤起，支持网页回退"]],
];
groups.forEach((g, i) => {
  const x = 4.15, y = 1.25 + i * 1.72, w = 8.68;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 1.55, fill: { color: "F7F9FA" }, line: { color: PRIMARY, width: 0.75 }, rectRadius: 0.07 });
  s.addText(g[0], { x: x + 0.28, y: y + 0.14, w: 2.0, h: 1.27, fontSize: 15, bold: true, color: DARK, fontFace: F, valign: "middle", margin: 0 });
  s.addText(g[1].map((t, k) => ({ text: t, options: { bullet: bu(), breakLine: k < g[1].length - 1 } })), {
    x: x + 2.35, y: y + 0.14, w: w - 2.6, h: 1.27, fontSize: 12.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 4,
  });
});

// ================= 7 技术选型 =================
s = P.addSlide();
header(s, "系统设计：技术选型", 7);
s.addText("选型原则：成熟框架优先，不重复造轮子，把精力集中在业务整合与工程质量上。", {
  x: M, y: 1.2, w: W - 2 * M, h: 0.45, fontSize: 15, bold: true, color: DARK, fontFace: F, margin: 0,
});
const techRows = [
  [{ text: "层次", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "选型", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "选择理由", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }],
  ["开发语言", "Kotlin", "Google 官方首推，语法简洁、空安全"],
  ["开发工具", "Android Studio", "Android 官方 IDE，开发调试一体化"],
  ["地图定位", "高德地图 Android SDK", "定位、地图、POI 检索、逆地理编码一体化"],
  ["本地存储", "Room（SQLite）", "官方 ORM，编译期校验 SQL，安全可靠"],
  ["异步处理", "Kotlin 协程", "避免数据库与网络操作阻塞主线程"],
  ["版本管理", "Git + GitHub", "满足团队协同开发考核要求"],
];
s.addTable(techRows, {
  x: M, y: 1.85, w: W - 2 * M, colW: [2.2, 3.6, 7.03],
  border: { pt: 0.75, color: "D9E2E5" }, fontFace: F, fontSize: 14, color: TEXT,
  valign: "middle", rowH: 0.72, margin: 0.08, align: "left",
});

// ================= 8 系统总体架构 =================
s = P.addSlide();
header(s, "系统设计：总体架构", 8);
const layers = [
  ["界面层", "首页 · 榜单 · 我的 · 地图页 · 详情页 · 登录页", "只负责页面展示与用户交互", "F0FAFA"],
  ["数据仓库层", "ToiletRepository（统一数据出口）", "统一封装定位、检索、排序、缓存、聚合等流程，供各页面共用", LIGHT],
  ["数据层", "Room 数据库 · 高德 SDK · SharedPreferences", "负责数据持久化与外部服务调用", "F0FAFA"],
];
layers.forEach((t, i) => {
  const y = 1.45 + i * 1.62;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: y, w: 12.33, h: 1.35, fill: { color: t[3] }, line: { color: PRIMARY, width: 1 }, rectRadius: 0.08 });
  s.addText(t[0], { x: M + 0.3, y: y + 0.18, w: 2.2, h: 0.5, fontSize: 18, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: M + 0.3, y: y + 0.72, w: 11.7, h: 0.45, fontSize: 13, bold: true, color: TEXT, fontFace: F, margin: 0 });
  s.addText(t[2], { x: M + 2.7, y: y + 0.18, w: 9.3, h: 0.5, fontSize: 12.5, color: MUTED, fontFace: F, margin: 0 });
  if (i < 2) s.addShape(P.shapes.LINE, { x: W / 2, y: y + 1.35, w: 0, h: 0.27, line: { color: PRIMARY, width: 2.5, endArrowType: "triangle" } });
});
s.addText("架构收益：数据来源变化时只需修改仓库层，界面层无需改动；各页面共用同一数据出口，数据一致；职责清晰，便于两人分工。", {
  x: M, y: 6.45, w: W - 2 * M, h: 0.45, fontSize: 13.5, bold: true, color: DARK, fontFace: F, margin: 0,
});

// ================= 9 界面设计（无配图、无类比表述） =================
s = P.addSlide();
header(s, "界面设计", 9);
s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 1.3, w: 5.6, h: 2.1, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText("设计思路", { x: M + 0.3, y: 1.5, w: 5.0, h: 0.45, fontSize: 17, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "采用蓝绿品牌色系，风格统一、辨识度高", options: { bullet: bu(), breakLine: true } },
  { text: "信息层次清晰，主流程操作一目了然", options: { bullet: bu(), breakLine: true } },
  { text: "兼顾美观与信息密度，减少无效操作", options: { bullet: bu() } },
], { x: M + 0.3, y: 2.02, w: 5.0, h: 1.25, fontSize: 13.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8 });

s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: M, y: 3.7, w: 5.6, h: 2.55, fill: { color: "F7F9FA" }, rectRadius: 0.08 });
s.addText("设计特色：三格结构化指标卡", { x: M + 0.3, y: 3.9, w: 5.0, h: 0.45, fontSize: 17, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "展示厕纸供应、洗手台类型、清理除味三项信息", options: { bullet: bu(), breakLine: true } },
  { text: "汇总所有评价者的统计结果，而非单条评价", options: { bullet: bu(), breakLine: true } },
  { text: "让用户在出发前就能判断厕所的实际条件", options: { bullet: bu() } },
], { x: M + 0.3, y: 4.42, w: 5.0, h: 1.6, fontSize: 13.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8 });

const pages = [
  ["首页", "定位城市 + 搜索入口 + 厕所信息流"],
  ["地图页", "蓝点定位 + Marker 标注"],
  ["详情页", "基础信息 + 指标卡 + 评价列表"],
  ["榜单页", "好评榜与热评榜"],
  ["我的页", "账号信息与我的评价"],
  ["登录页", "登录与注册双模式"],
];
pages.forEach((t, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const x = 6.5 + col * 3.2, y = 1.3 + row * 1.68, w = 3.03;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x, y: y, w: w, h: 1.5, fill: { color: "FFFFFF" }, line: { color: PRIMARY, width: 1 }, rectRadius: 0.07, shadow: shadow() });
  s.addText(t[0], { x: x + 0.22, y: y + 0.2, w: w - 0.44, h: 0.45, fontSize: 16, bold: true, color: DARK, fontFace: F, margin: 0 });
  s.addText(t[1], { x: x + 0.22, y: y + 0.72, w: w - 0.44, h: 0.6, fontSize: 12, color: MUTED, fontFace: F, margin: 0 });
});
s.addText("共六个主要页面：首页、地图页、详情页、榜单页、我的页、登录页。", {
  x: 6.5, y: 6.4, w: 6.33, h: 0.4, fontSize: 12.5, italic: true, color: MUTED, fontFace: F, margin: 0,
});

// ================= 10 团队分工协作与项目管理（无风险内容） =================
s = P.addSlide();
header(s, "团队分工协作与项目管理", 10);
const teamRows = [
  [{ text: "角色", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }, { text: "主要任务", options: { bold: true, color: "FFFFFF", fill: { color: DARK } } }],
  ["架构与主要开发", "架构设计、地图与检索、数据存储、评价与榜单、登录、界面设计"],
  ["功能开发与测试", "部分功能开发、界面适配、测试记录、项目文档与演示脚本"],
];
s.addTable(teamRows, {
  x: M, y: 1.3, w: 6.2, colW: [2.1, 4.1],
  border: { pt: 0.75, color: "D9E2E5" }, fontFace: F, fontSize: 13, color: TEXT,
  valign: "middle", rowH: 0.85, margin: 0.08, align: "left",
});
s.addText("本项目由 2 人组成，按模块分工、交叉评审。", { x: M, y: 4.05, w: 6.2, h: 0.4, fontSize: 12.5, italic: true, color: MUTED, fontFace: F, margin: 0 });

s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 1.3, w: 5.83, h: 2.6, fill: { color: LIGHT }, rectRadius: 0.08 });
s.addText("Git 协作方式", { x: 7.3, y: 1.5, w: 5.2, h: 0.45, fontSize: 16, bold: true, color: DARK, fontFace: F, margin: 0 });
s.addText([
  { text: "GitHub 托管，主干分支保持可运行", options: { bullet: bu(), breakLine: true } },
  { text: "功能在独立分支开发，PR 评审后合并", options: { bullet: bu(), breakLine: true } },
  { text: "提交信息统一前缀加中文说明", options: { bullet: bu(), breakLine: true } },
  { text: "任务拆分为 Issue 由两人认领", options: { bullet: bu() } },
], { x: 7.3, y: 2.02, w: 5.2, h: 1.7, fontSize: 13, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 8 });

s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 4.1, w: 5.83, h: 2.15, fill: { color: "F7F9FA" }, rectRadius: 0.08 });
s.addText("阶段计划", { x: 7.3, y: 4.28, w: 5.2, h: 0.4, fontSize: 16, bold: true, color: DARK, fontFace: F, margin: 0 });
const plan = [
  "第 1~3 周：选题调研、需求分析、技术选型",
  "第 4~6 周：环境搭建、地图与定位、周边搜索",
  "第 7~9 周：详情页、评价与账号、排行榜",
  "第 10~12 周：界面完善、测试记录、文档与答辩准备",
];
s.addText(plan.map((t, i) => ({ text: t, options: { bullet: bu(), breakLine: i < plan.length - 1 } })), {
  x: 7.3, y: 4.75, w: 5.2, h: 1.35, fontSize: 12.5, color: TEXT, fontFace: F, margin: 0, paraSpaceAfter: 5,
});

// ================= 11 结尾 =================
s = P.addSlide();
s.background = { color: DEEP };
s.addShape(P.shapes.OVAL, { x: -1.2, y: H - 2.6, w: 4.0, h: 4.0, fill: { color: "FFFFFF", transparency: 92 } });
s.addText("谢谢聆听", { x: M, y: 2.5, w: W - 2 * M, h: 1.2, fontSize: 54, bold: true, color: "FFFFFF", fontFace: F, align: "center" });
s.addText("恳请老师与同学批评指正", { x: M, y: 3.85, w: W - 2 * M, h: 0.6, fontSize: 20, color: "D9F2F2", fontFace: F, align: "center" });

P.writeFile({ fileName: "D:/develop/lalmore/deliverables/期中开题汇报-附近厕所.pptx" }).then(() => console.log("MIDTERM_V3_DONE"));
