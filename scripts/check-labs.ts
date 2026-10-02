// Prove every CLI lab is solvable and not already solved.
//
//   node scripts/check-labs.ts            all labs in src/sim/labs
//   node scripts/check-labs.ts vlan-basics
//
// For each lab: the network builds, at least one task fails at the start, the solution typed through
// the real CLI produces no errors, and afterwards every task passes.

import { readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { applySolution, buildLab, taskDone, type CliLab } from "../src/sim/lab.ts";
import { checkL, type Report } from "../src/content/validate.ts";
import { allLessons } from "../src/content/curriculum.ts";

const dir = resolve(dirname(fileURLToPath(import.meta.url)), "../src/sim/labs");
const wanted = process.argv.slice(2);
const files = readdirSync(dir).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && f !== "index.ts").filter((f) => !wanted.length || wanted.includes(f.replace(/\.ts$/, "")));
let failures = 0;

for (const f of files) {
  const id = f.replace(/\.ts$/, "");
  const problems: string[] = [];
  const warnings: string[] = [];
  try {
    const lab: CliLab = (await import(pathToFileURL(resolve(dir, f)).href)).default;
    if (lab.id !== id) problems.push(`id is "${lab.id}", file is ${f}`);
    const r: Report = { errors: [], warnings: [] };
    checkL("title", lab.title, r, { hinglishCheck: false });
    checkL("scenario", lab.scenario, r);
    if (lab.debrief) checkL("debrief", lab.debrief, r);
    lab.tasks.forEach((t, i) => {
      checkL(`tasks[${i}].text`, t.text, r);
      checkL(`tasks[${i}].hint`, t.hint, r);
    });
    problems.push(...r.errors);
    warnings.push(...r.warnings);
    for (const s of lab.lessons) if (!allLessons.some((l) => l.slug === s)) problems.push(`unknown lesson ${s}`);
    const ids = new Set(lab.devices.map((d) => d.id));
    for (const [a, , b] of lab.links) if (!ids.has(a) || !ids.has(b)) problems.push(`link to unknown device ${a}/${b}`);
    for (const dev of Object.keys(lab.solution)) if (!ids.has(dev)) problems.push(`solution for unknown device ${dev}`);
    for (const d of lab.devices) {
      for (const o of lab.devices) if (o !== d && Math.abs(o.x - d.x) < 110 && Math.abs(o.y - d.y) < 95) warnings.push(`devices ${d.id} and ${o.id} overlap in the drawing`);
      if (d.x < 50 || d.x > 750 || d.y < 45 || d.y > (lab.height ?? 360) - 55) warnings.push(`device ${d.id} is near the drawing edge`);
    }
    const net = buildLab(lab);
    const before = lab.tasks.map((t) => taskDone(net, t));
    if (before.every(Boolean)) problems.push("every task already passes before the learner does anything");
    const solved = buildLab(lab);
    problems.push(...applySolution(solved, lab));
    lab.tasks.forEach((t, i) => {
      if (!taskDone(solved, t)) problems.push(`task ${i + 1} still fails after the solution: ${t.text.en.slice(0, 80)}`);
    });
    const passedBefore = before.filter(Boolean).length;
    console.log(`${problems.length ? "FAIL" : "ok  "}  ${id}  (${lab.tasks.length} tasks, ${passedBefore} already true at start)`);
  } catch (e) {
    problems.push(`crashed: ${(e as Error).stack?.split("\n").slice(0, 3).join(" | ")}`);
    console.log(`FAIL  ${id}`);
  }
  problems.forEach((p) => console.log(`      ERROR ${p}`));
  warnings.forEach((p) => console.log(`      warn  ${p}`));
  if (problems.length) failures++;
}
console.log(`\n${files.length} lab(s) checked, ${failures} failing.`);
process.exit(failures ? 1 : 0);
