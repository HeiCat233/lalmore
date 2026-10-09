// 把 docs/答辩内容整理-期中期末.md 转成 Word（组员可直接传阅/编辑）
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
  Footer, PageNumber, TableOfContents, PageBreak,
} = require("docx");

const SRC = "D:/develop/lalmore/docs/答辩内容整理-期中期末.md";
const OUT = "D:/develop/lalmore/deliverables/答辩内容整理-期中期末.docx";

const INK = "1F2937", MUTED = "6B7280", BRAND = "006D6D";
const PRIMARY = "00A6A6", LIGHT = "E8F6F6", HEADBG = "00575D";
const YH = { ascii: "Arial", eastAsia: "Microsoft YaHei" };
const SONG = { ascii: "Times New Roman", eastAsia: "SimSun" };

const md = fs.readFileSync(SRC, "utf8");
const lines = md.split(/\r?\n/);

// ---------- 行内解析：**bold** 与 `code` ----------
function inline(text, base = {}) {
  const runs = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) runs.push(new TextRun({ text: text.slice(last, m.index), ...base }));
    const tok = m[0];
    if (tok.startsWith("**")) runs.push(new TextRun({ text: tok.slice(2, -2), bold: true, ...base }));
    else runs.push(new TextRun({ text: tok.slice(1, -1), font: { ascii: "Consolas", eastAsia: "Microsoft YaHei" }, color: "0F766E", ...base }));
    last = m.index + tok.length;
  }
  if (last < text.length) runs.push(new TextRun({ text: text.slice(last), ...base }));
  if (!runs.length) runs.push(new TextRun({ text: "", ...base }));
  return runs;
}

const children = [];
let i = 0;
let h1Count = 0;

function isTableRow(l) { return /^\s*\|.*\|\s*$/.test(l); }
function cells(l) {
  return l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(s => s.trim());
}

while (i < lines.length) {
  let line = lines[i];

  // 空行
  if (!line.trim()) { i++; continue; }

  // 分隔线
  if (/^---+$/.test(line.trim())) {
    children.push(new Paragraph({
      spacing: { before: 120, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "D1D5DB" } },
      children: [new TextRun({ text: "", size: 2 })],
    }));
    i++; continue;
  }

  // 表格
  if (isTableRow(line) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
    const header = cells(line);
    i += 2;
    const rows = [];
    while (i < lines.length && isTableRow(lines[i])) { rows.push(cells(lines[i])); i++; }
    const ncol = header.length;
    const all = [header, ...rows];
    const trs = all.map((r, ri) => new TableRow({
      tableHeader: ri === 0,
      children: Array.from({ length: ncol }, (_, ci) => new TableCell({
        width: { size: Math.floor(100 / ncol), type: WidthType.PERCENTAGE },
        shading: ri === 0 ? { type: ShadingType.CLEAR, fill: HEADBG } : (ri % 2 === 0 ? { type: ShadingType.CLEAR, fill: "F7F9FA" } : undefined),
        margins: { top: 60, bottom: 60, left: 100, right: 100 },
        children: [new Paragraph({
          spacing: { line: 276 },
          children: inline(r[ci] || "", ri === 0
            ? { bold: true, color: "FFFFFF", size: 21, font: YH }
            : { color: INK, size: 21, font: SONG }),
        })],
      })),
    }));
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 4, color: "D9E2E5" },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: "D9E2E5" },
        left: { style: BorderStyle.SINGLE, size: 4, color: "D9E2E5" },
        right: { style: BorderStyle.SINGLE, size: 4, color: "D9E2E5" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "D9E2E5" },
        insideVertical: { style: BorderStyle.SINGLE, size: 4, color: "D9E2E5" },
      },
      rows: trs,
    }));
    children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "", size: 2 })] }));
    continue;
  }

  // 标题
  let m;
  if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
    const level = m[1].length;
    const text = m[2];
    if (level === 1) {
      // 标题页与「第一部分」同页；「第二部分」等后续大章另起一页
      if (h1Count >= 2) children.push(new Paragraph({ children: [new PageBreak()] }));
      h1Count++;
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 200 },
        children: inline(text, { bold: true, size: 34, color: HEADBG, font: YH }),
      }));
    } else if (level === 2) {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 280, after: 140 },
        children: inline(text, { bold: true, size: 28, color: BRAND, font: YH }),
      }));
    } else {
      children.push(new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 220, after: 110 },
        children: inline(text, { bold: true, size: 24, color: INK, font: YH }),
      }));
    }
    i++; continue;
  }

  // 引用
  if (/^>\s?/.test(line)) {
    const buf = [];
    while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
    children.push(new Paragraph({
      spacing: { line: 312, after: 100 },
      indent: { left: 300 },
      shading: { type: ShadingType.CLEAR, fill: "F0FAFA" },
      children: inline(buf.join(" "), { size: 21, color: "0F5B5B", font: YH }),
    }));
    continue;
  }

  // 有序列表
  if (/^\s*\d+\.\s+/.test(line)) {
    const num = line.match(/^\s*(\d+)\.\s+(.*)$/);
    children.push(new Paragraph({
      spacing: { line: 312, after: 50 },
      indent: { left: 480, hanging: 300 },
      children: inline(num[1] + ". " + num[2], { size: 23, color: INK, font: SONG }),
    }));
    i++; continue;
  }

  // 无序列表（含两级缩进）
  if (/^\s*[-*]\s+/.test(line)) {
    const lead = line.match(/^(\s*)[-*]\s+(.*)$/);
    const depth = Math.floor(lead[1].length / 2);
    const bullet = depth > 0 ? "◦ " : "▸ ";
    children.push(new Paragraph({
      spacing: { line: 312, after: 40 },
      indent: { left: 420 + depth * 300, hanging: 260 },
      children: inline(bullet + lead[2], { size: 23, color: INK, font: SONG }),
    }));
    i++; continue;
  }

  // 普通段落
  children.push(new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 320, after: 90 },
    children: inline(line, { size: 23, color: INK, font: SONG }),
  }));
  i++;
}

const doc = new Document({
  creator: "附近厕所项目组",
  title: "答辩内容整理-期中期末",
  styles: { default: { document: { run: { font: SONG, size: 23, color: INK }, paragraph: { spacing: { line: 320 } } } } },
  sections: [{
    properties: { page: { margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 } } },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: MUTED })],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log("ANSWERS_DOCX_DONE " + buf.length);
});
