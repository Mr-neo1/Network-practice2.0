// Validate lesson and scene files.
//
//   node scripts/check-lesson.ts            check everything that exists (missing files listed at the end)
//   node scripts/check-lesson.ts arp nat    check specific lessons (and their scenes)
//   node scripts/check-lesson.ts --strict   treat missing lessons/scenes as errors
//
// Runs on plain Node 22+ (built-in TypeScript type stripping), no install needed.

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { allLessons } from "../src/content/curriculum.ts";
import { validateLesson, validateScene } from "../src/content/validate.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const wanted = args.filter((a) => !a.startsWith("--"));

const unknown = wanted.filter((s) => !allLessons.some((l) => l.slug === s));
if (unknown.length) {
  console.error(`Unknown lesson slug(s): ${unknown.join(", ")}`);
  process.exit(1);
}

const targets = wanted.length ? allLessons.filter((l) => wanted.includes(l.slug)) : allLessons;
let errors = 0;
let warnings = 0;
const missing: string[] = [];

for (const meta of targets) {
  const lessonFile = resolve(root, "src/content/lessons", `${meta.slug}.ts`);
  const sceneFile = resolve(root, "src/anim/scenes", `${meta.scene}.ts`);
  const out: string[] = [];

  if (existsSync(lessonFile)) {
    try {
      const mod = await import(pathToFileURL(lessonFile).href);
      const rep = validateLesson(mod.default, meta);
      rep.errors.forEach((e) => out.push(`  ERROR  ${e}`));
      rep.warnings.forEach((e) => out.push(`  warn   ${e}`));
      errors += rep.errors.length;
      warnings += rep.warnings.length;
    } catch (e) {
      out.push(`  ERROR  lesson file failed to load: ${(e as Error).message}`);
      errors++;
    }
  } else missing.push(`lesson ${meta.slug}`);

  if (existsSync(sceneFile)) {
    try {
      const mod = await import(pathToFileURL(sceneFile).href);
      const rep = validateScene(mod.default, meta.scene);
      rep.errors.forEach((e) => out.push(`  ERROR  ${e}`));
      rep.warnings.forEach((e) => out.push(`  warn   ${e}`));
      errors += rep.errors.length;
      warnings += rep.warnings.length;
    } catch (e) {
      out.push(`  ERROR  scene file failed to load: ${(e as Error).message}`);
      errors++;
    }
  } else missing.push(`scene ${meta.scene}`);

  if (out.length) console.log(`\n${meta.slug}\n${out.join("\n")}`);
}

if (missing.length) {
  console.log(`\nMissing (${missing.length}): ${missing.join(", ")}`);
  if (strict || wanted.length) errors += missing.length;
}
console.log(`\n${targets.length} lesson(s) checked: ${errors} error(s), ${warnings} warning(s).`);
process.exit(errors ? 1 : 0);
