// Structural and style checks for lessons and scenes.
// Runs in Node (scripts/check-lesson.ts) and in Vitest. No DOM, no Vite features.

import type { Block, L, Lesson, LessonMeta } from "./types.ts";
import type { Scene, TopologyScene } from "../anim/types.ts";

export type Report = { errors: string[]; warnings: string[] };

const DEVANAGARI = /[ऀ-ॿ]/;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Words that show a string really is Hinglish (Hindi grammar in Roman script).
const HINGLISH_MARKERS =
  /\b(hai|hain|ho|hota|hoti|hote|ka|ki|ke|ko|se|mein|par|aur|ya|nahi|nahin|karo|karta|karti|karte|karna|kar|jata|jaata|jati|jaati|jaate|jate|yeh|ye|woh|wo|jab|tab|agar|toh|to|kyun|kya|kaise|kaun|kaunsa|kaunsi|sirf|bhi|sab|apna|apne|tum|tumhara|tumhe|hum|isme|usme|iska|uska|isse|usse|wala|wali|wale|chahiye|milta|milti|dekho|socho|samjho|pehle|phir|baad|saath|bina|liye|lekin|matlab)\b/i;

// Filler that makes text read as machine-written.
const SLOP = [
  "delve",
  "tapestry",
  "in today's",
  "fast-paced",
  "let's dive",
  "dive into",
  "dive deep",
  "embark",
  "game-changer",
  "game changer",
  "unleash",
  "supercharge",
  "seamlessly",
  "in the realm of",
  "it's important to note",
  "it is important to note",
  "plays a crucial role",
  "plays a vital role",
  "crucial role",
  "vital role",
  "ever-evolving",
  "cutting-edge",
  "unlock the power",
  "harness the power",
  "look no further",
  "navigating the",
  "buckle up",
  "without further ado",
];

function checkText(where: string, s: unknown, r: Report, lang: "en" | "hi") {
  if (typeof s !== "string" || !s.trim()) {
    r.errors.push(`${where}.${lang} is empty`);
    return;
  }
  if (DEVANAGARI.test(s)) r.errors.push(`${where}.${lang} contains Devanagari script; write Hinglish in Roman letters`);
  if (EMOJI.test(s)) r.warnings.push(`${where}.${lang} contains an emoji`);
  const lower = s.toLowerCase();
  for (const phrase of SLOP) if (lower.includes(phrase)) r.warnings.push(`${where}.${lang} uses filler phrase "${phrase}"`);
  if (/\s—\s|—/.test(s) && lang === "en" && (s.match(/—/g)?.length ?? 0) > 2) r.warnings.push(`${where}.en has many em dashes`);
}

export function checkL(where: string, value: unknown, r: Report, opts: { hinglishCheck?: boolean } = {}) {
  const v = value as L | undefined;
  if (!v || typeof v !== "object") {
    r.errors.push(`${where} must be { en, hi }`);
    return;
  }
  checkText(where, v.en, r, "en");
  checkText(where, v.hi, r, "hi");
  if (typeof v.en === "string" && typeof v.hi === "string") {
    const words = v.hi.split(/\s+/).filter(Boolean).length;
    if (opts.hinglishCheck !== false && words >= 7 && !HINGLISH_MARKERS.test(v.hi)) {
      r.warnings.push(`${where}.hi looks like English, not Hinglish: "${v.hi.slice(0, 70)}..."`);
    }
    if (words >= 7 && v.hi.trim() === v.en.trim()) r.errors.push(`${where}.hi is identical to .en`);
  }
}

function checkBlock(where: string, b: Block, r: Report) {
  switch (b.type) {
    case "p":
      checkL(`${where}.text`, b.text, r);
      break;
    case "list":
    case "steps":
      if (!Array.isArray(b.items) || b.items.length < 2) r.errors.push(`${where} needs at least 2 items`);
      b.items?.forEach((it, i) => checkL(`${where}.items[${i}]`, it, r));
      break;
    case "callout":
      if (!["tip", "warn", "exam", "analogy"].includes(b.tone)) r.errors.push(`${where}.tone invalid`);
      if (b.title) checkL(`${where}.title`, b.title, r, { hinglishCheck: false });
      checkL(`${where}.text`, b.text, r);
      break;
    case "table":
      if (!Array.isArray(b.columns) || b.columns.length < 2) r.errors.push(`${where} needs 2+ columns`);
      if (!Array.isArray(b.rows) || b.rows.length < 1) r.errors.push(`${where} needs rows`);
      b.rows?.forEach((row, i) => {
        if (row.length !== b.columns.length) r.errors.push(`${where}.rows[${i}] has ${row.length} cells, expected ${b.columns.length}`);
        row.forEach((c, j) => typeof c !== "string" && checkL(`${where}.rows[${i}][${j}]`, c, r, { hinglishCheck: false }));
      });
      b.columns?.forEach((c, j) => typeof c !== "string" && checkL(`${where}.columns[${j}]`, c, r, { hinglishCheck: false }));
      if (b.caption) checkL(`${where}.caption`, b.caption, r, { hinglishCheck: false });
      break;
    case "cli":
      if (!Array.isArray(b.lines) || b.lines.length < 1) r.errors.push(`${where} needs lines`);
      b.lines?.forEach((ln, i) => {
        if (!ln.cmd && !ln.out && !ln.comment) r.errors.push(`${where}.lines[${i}] is empty`);
        if (ln.cmd && !ln.prompt) r.warnings.push(`${where}.lines[${i}] has a cmd without a prompt`);
        if (ln.comment) checkL(`${where}.lines[${i}].comment`, ln.comment, r, { hinglishCheck: false });
      });
      if (b.title) checkL(`${where}.title`, b.title, r, { hinglishCheck: false });
      if (b.note) checkL(`${where}.note`, b.note, r);
      break;
    case "code":
      if (!b.code?.trim()) r.errors.push(`${where}.code is empty`);
      if (b.title) checkL(`${where}.title`, b.title, r, { hinglishCheck: false });
      break;
    default:
      r.errors.push(`${where} has unknown block type ${(b as { type: string }).type}`);
  }
}

export function validateLesson(lesson: Lesson, meta: LessonMeta): Report {
  const r: Report = { errors: [], warnings: [] };
  const w = `lesson(${meta.slug})`;
  if (lesson.slug !== meta.slug) r.errors.push(`${w}.slug is "${lesson.slug}"`);
  checkL(`${w}.intro`, lesson.intro, r);
  if (!Array.isArray(lesson.outcomes) || lesson.outcomes.length < 3 || lesson.outcomes.length > 7) r.errors.push(`${w}.outcomes needs 3-7 items`);
  lesson.outcomes?.forEach((o, i) => checkL(`${w}.outcomes[${i}]`, o, r));

  if (!Array.isArray(lesson.sections) || lesson.sections.length < 4) r.errors.push(`${w}.sections needs at least 4 sections`);
  const ids = new Set<string>();
  lesson.sections?.forEach((s, i) => {
    const sw = `${w}.sections[${i}]`;
    if (!KEBAB.test(s.id)) r.errors.push(`${sw}.id "${s.id}" must be kebab-case`);
    if (ids.has(s.id)) r.errors.push(`${sw}.id "${s.id}" is duplicated`);
    ids.add(s.id);
    checkL(`${sw}.heading`, s.heading, r, { hinglishCheck: false });
    if (!Array.isArray(s.blocks) || s.blocks.length < 1) r.errors.push(`${sw} has no blocks`);
    s.blocks?.forEach((b, j) => checkBlock(`${sw}.blocks[${j}]`, b, r));
  });

  if (!Array.isArray(lesson.terms) || lesson.terms.length < 4) r.errors.push(`${w}.terms needs at least 4 terms`);
  lesson.terms?.forEach((t, i) => {
    if (!t.term?.trim()) r.errors.push(`${w}.terms[${i}].term empty`);
    checkL(`${w}.terms[${i}].def`, t.def, r);
  });
  lesson.commands?.forEach((c, i) => {
    if (!c.cmd?.trim() || !c.mode?.trim()) r.errors.push(`${w}.commands[${i}] needs cmd and mode`);
    checkL(`${w}.commands[${i}].does`, c.does, r, { hinglishCheck: false });
  });
  if (!Array.isArray(lesson.mistakes) || lesson.mistakes.length < 3) r.errors.push(`${w}.mistakes needs at least 3`);
  lesson.mistakes?.forEach((m, i) => checkL(`${w}.mistakes[${i}]`, m, r));
  if (!Array.isArray(lesson.recap) || lesson.recap.length < 4) r.errors.push(`${w}.recap needs at least 4`);
  lesson.recap?.forEach((m, i) => checkL(`${w}.recap[${i}]`, m, r));

  if (!Array.isArray(lesson.quiz) || lesson.quiz.length < 5 || lesson.quiz.length > 10) r.errors.push(`${w}.quiz needs 5-10 questions`);
  const answerSpread = new Set<number>();
  lesson.quiz?.forEach((q, i) => {
    const qw = `${w}.quiz[${i}]`;
    checkL(`${qw}.q`, q.q, r);
    if (!Array.isArray(q.options) || q.options.length !== 4) r.errors.push(`${qw} needs exactly 4 options`);
    q.options?.forEach((o, j) => checkL(`${qw}.options[${j}]`, o, r, { hinglishCheck: false }));
    const texts = new Set(q.options?.map((o) => o.en.trim().toLowerCase()));
    if (texts.size !== q.options?.length) r.errors.push(`${qw} has duplicate options`);
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) r.errors.push(`${qw}.answer must be 0-3`);
    answerSpread.add(q.answer);
    checkL(`${qw}.explain`, q.explain, r);
  });
  if ((lesson.quiz?.length ?? 0) >= 5 && answerSpread.size < 3) r.warnings.push(`${w}.quiz correct answers sit in only ${answerSpread.size} positions; vary them`);

  if (!Array.isArray(lesson.videos) || lesson.videos.length < 1) r.errors.push(`${w}.videos needs at least one video`);
  if (!lesson.videos?.some((v) => v.lang === "en")) r.errors.push(`${w}.videos needs an English video`);
  if (!lesson.videos?.some((v) => v.lang === "hi")) r.warnings.push(`${w}.videos has no Hindi video`);
  lesson.videos?.forEach((v, i) => {
    if (!VIDEO_ID.test(v.id)) r.errors.push(`${w}.videos[${i}].id "${v.id}" is not a YouTube id`);
    if (!v.title?.trim() || !v.channel?.trim()) r.errors.push(`${w}.videos[${i}] needs title and channel`);
    if (v.lang !== "en" && v.lang !== "hi") r.errors.push(`${w}.videos[${i}].lang must be en or hi`);
    if (v.note) checkL(`${w}.videos[${i}].note`, v.note, r);
  });
  if (lesson.lab) {
    checkL(`${w}.lab.title`, lesson.lab.title, r, { hinglishCheck: false });
    if (!Array.isArray(lesson.lab.steps) || lesson.lab.steps.length < 3) r.errors.push(`${w}.lab.steps needs 3+ steps`);
    lesson.lab.steps?.forEach((s, i) => checkL(`${w}.lab.steps[${i}]`, s, r));
  }
  return r;
}

// ─── scenes ────────────────────────────────────────────────────────────────

const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

function checkTopology(s: TopologyScene, r: Report, w: string) {
  const height = s.height ?? 400;
  if (height < 260 || height > 560) r.errors.push(`${w}.height must be 260-560`);
  const nodes = new Map(s.nodes.map((n) => [n.id, n]));
  if (nodes.size !== s.nodes.length) r.errors.push(`${w} has duplicate node ids`);
  if (s.nodes.length < 2) r.errors.push(`${w} needs 2+ nodes`);
  for (const n of s.nodes) {
    if (n.x < 50 || n.x > 750 || n.y < 45 || n.y > height - 55) r.errors.push(`${w} node ${n.id} at (${n.x},${n.y}) is too close to the edge (x 50-750, y 45-${height - 55})`);
    if (n.label.length > 14) r.warnings.push(`${w} node ${n.id} label "${n.label}" is long`);
    if ((n.sub?.length ?? 0) > 20 || (n.sub2?.length ?? 0) > 20) r.warnings.push(`${w} node ${n.id} sub text is long (max ~20 chars)`);
  }
  // Mirrors the renderer: icon ~56 units tall, label 14px under it, sub lines 11.5px monospace.
  const textWidth = (n: TopologyScene["nodes"][number]) => Math.max(56, n.label.length * 8.2, (n.sub?.length ?? 0) * 6.9, (n.sub2?.length ?? 0) * 6.9);
  const depthBelow = (n: TopologyScene["nodes"][number]) => (n.sub2 ? 80 : n.sub ? 66 : 50);
  for (let i = 0; i < s.nodes.length; i++)
    for (let j = i + 1; j < s.nodes.length; j++) {
      const a = s.nodes[i], b = s.nodes[j];
      const dx = Math.abs(a.x - b.x), dy = Math.abs(a.y - b.y);
      const minDx = Math.max(110, (textWidth(a) + textWidth(b)) / 2 + 14);
      const upper = a.y <= b.y ? a : b;
      const minDy = depthBelow(upper) + 44;
      if (dx < minDx && dy < minDy)
        r.errors.push(`${w} nodes ${a.id} and ${b.id} are too close: need ≥${Math.ceil(minDx)} apart horizontally or ≥${minDy} vertically (now ${dx}, ${dy})`);
    }
  const linkIds = new Set<string>();
  const adj = new Set<string>();
  for (const l of s.links) {
    if (linkIds.has(l.id)) r.errors.push(`${w} duplicate link id ${l.id}`);
    linkIds.add(l.id);
    if (!nodes.has(l.a) || !nodes.has(l.b)) r.errors.push(`${w} link ${l.id} references a missing node`);
    adj.add(`${l.a}|${l.b}`);
    adj.add(`${l.b}|${l.a}`);
  }
  s.steps.forEach((st, i) => {
    const sw = `${w}.steps[${i}]`;
    st.packets?.forEach((p, j) => {
      if (!Array.isArray(p.path) || p.path.length < 2) r.errors.push(`${sw}.packets[${j}] path needs 2+ nodes`);
      p.path?.forEach((id) => !nodes.has(id) && r.errors.push(`${sw}.packets[${j}] unknown node ${id}`));
      for (let k = 0; k + 1 < (p.path?.length ?? 0); k++)
        if (!adj.has(`${p.path[k]}|${p.path[k + 1]}`)) r.errors.push(`${sw}.packets[${j}] hop ${p.path[k]}→${p.path[k + 1]} has no link`);
      if (!p.label?.trim()) r.errors.push(`${sw}.packets[${j}] needs a label`);
      if ((p.label?.length ?? 0) > 18) r.warnings.push(`${sw}.packets[${j}] label "${p.label}" is long (max ~16)`);
    });
    st.focus?.forEach((id) => !nodes.has(id) && r.errors.push(`${sw}.focus unknown node ${id}`));
    st.badges?.forEach((b) => !nodes.has(b.node) && r.errors.push(`${sw}.badges unknown node ${b.node}`));
    st.links?.forEach((l) => !linkIds.has(l.id) && r.errors.push(`${sw}.links unknown link ${l.id}`));
    st.tables?.forEach((t, j) => {
      if (!nodes.has(t.node)) r.errors.push(`${sw}.tables[${j}] unknown node ${t.node}`);
      t.rows.forEach((row, k) => row.length !== t.columns.length && r.errors.push(`${sw}.tables[${j}].rows[${k}] has ${row.length} cells, expected ${t.columns.length}`));
      t.hl?.forEach((h) => (h < 0 || h >= t.rows.length) && r.errors.push(`${sw}.tables[${j}].hl ${h} out of range`));
    });
  });
}

export function validateScene(scene: Scene, expectedId: string): Report {
  const r: Report = { errors: [], warnings: [] };
  const w = `scene(${expectedId})`;
  if (!scene || typeof scene !== "object") return { errors: [`${w} is missing`], warnings: [] };
  if (scene.id !== expectedId) r.errors.push(`${w}.id is "${scene.id}"`);
  checkL(`${w}.title`, scene.title, r, { hinglishCheck: false });
  if (!Array.isArray(scene.steps) || scene.steps.length < 3 || scene.steps.length > 14) r.errors.push(`${w} needs 3-14 steps`);
  scene.steps?.forEach((st, i) => {
    checkL(`${w}.steps[${i}].title`, st.title, r, { hinglishCheck: false });
    checkL(`${w}.steps[${i}].text`, st.text, r);
  });
  switch (scene.kind) {
    case "topology":
      checkTopology(scene, r, w);
      break;
    case "sequence": {
      const ids = new Set(scene.actors.map((a) => a.id));
      if (scene.actors.length < 2 || scene.actors.length > 5) r.errors.push(`${w} needs 2-5 actors`);
      if (ids.size !== scene.actors.length) r.errors.push(`${w} duplicate actor ids`);
      let total = 0;
      scene.steps.forEach((st, i) => {
        st.messages?.forEach((m, j) => {
          total++;
          if (!ids.has(m.from) || !ids.has(m.to)) r.errors.push(`${w}.steps[${i}].messages[${j}] unknown actor`);
          if (m.from === m.to) r.errors.push(`${w}.steps[${i}].messages[${j}] from and to are the same`);
          if (m.label.length > 26) r.warnings.push(`${w}.steps[${i}].messages[${j}] label is long`);
        });
        if (st.note && !ids.has(st.note.actor)) r.errors.push(`${w}.steps[${i}].note unknown actor`);
      });
      if (total > 16) r.errors.push(`${w} has ${total} messages; keep it to 16 or fewer`);
      if (total === 0) r.errors.push(`${w} has no messages`);
      break;
    }
    case "layers":
      scene.steps.forEach((st, i) => {
        if (!Array.isArray(st.rows) || st.rows.length < 1) r.errors.push(`${w}.steps[${i}] needs rows`);
        const seen = new Set<string>();
        st.rows?.forEach((row) =>
          row.blocks.forEach((b) => {
            if (seen.has(b.id)) r.errors.push(`${w}.steps[${i}] duplicate block id ${b.id}`);
            seen.add(b.id);
            if (b.label.length > 22) r.warnings.push(`${w}.steps[${i}] block "${b.label}" label is long`);
          }),
        );
        if (st.rows?.some((row) => row.blocks.length > 10)) r.warnings.push(`${w}.steps[${i}] has a row with more than 10 blocks`);
        // The renderer's track is roughly 640px wide on a laptop; a label may wrap onto 2 lines.
        st.rows?.forEach((row) => {
          const total = row.blocks.reduce((s, b) => s + (b.w ?? 1), 0) || 1;
          row.blocks.forEach((b) => {
            const px = ((b.w ?? 1) / total) * 640 - 22;
            const longestWord = Math.max(...b.label.split(/\s+/).map((x) => x.length));
            if (px < longestWord * 7.6 || (b.label.length * 7.4) / 2 > px)
              r.warnings.push(`${w}.steps[${i}] block "${b.label}" is too narrow for its label (~${Math.round(px)}px); raise its w, shorten the label, or split the row`);
          });
        });
        if (st.stackActive && !scene.stack?.includes(st.stackActive)) r.errors.push(`${w}.steps[${i}].stackActive "${st.stackActive}" is not in stack`);
        st.focus?.forEach((f) => !seen.has(f) && r.errors.push(`${w}.steps[${i}].focus unknown block ${f}`));
      });
      break;
    case "bits":
      scene.steps.forEach((st, i) => {
        if (!Array.isArray(st.rows) || st.rows.length < 1 || st.rows.length > 5) r.errors.push(`${w}.steps[${i}] needs 1-5 rows`);
        st.rows?.forEach((row, j) => {
          if (!row.ip && !row.bits) r.errors.push(`${w}.steps[${i}].rows[${j}] needs ip or bits`);
          if (row.ip && !IPV4.test(row.ip)) r.errors.push(`${w}.steps[${i}].rows[${j}].ip "${row.ip}" is not dotted-decimal IPv4`);
          if (row.bits) {
            const b = row.bits.replace(/\s/g, "");
            if (!/^[01]{1,32}$/.test(b)) r.errors.push(`${w}.steps[${i}].rows[${j}].bits must be 1-32 zeros/ones`);
          }
        });
        if (st.prefix !== undefined && (st.prefix < 0 || st.prefix > 32)) r.errors.push(`${w}.steps[${i}].prefix out of range`);
        if (st.mark && (st.mark[0] > st.mark[1] || st.mark[0] < 0 || st.mark[1] > 31)) r.errors.push(`${w}.steps[${i}].mark invalid`);
      });
      break;
    case "terminal":
      if (!scene.device?.trim()) r.errors.push(`${w}.device is empty`);
      scene.steps.forEach((st, i) => {
        if (!Array.isArray(st.lines) || st.lines.length < 1) r.errors.push(`${w}.steps[${i}] needs lines`);
        st.lines?.forEach((ln, j) => {
          if (ln.cmd === undefined && !ln.out && !ln.prompt) r.errors.push(`${w}.steps[${i}].lines[${j}] needs a prompt, cmd or out`);
          if (ln.cmd && !ln.prompt) r.errors.push(`${w}.steps[${i}].lines[${j}] cmd needs a prompt`);
        });
      });
      break;
    default:
      r.errors.push(`${w} has unknown kind`);
  }
  return r;
}
