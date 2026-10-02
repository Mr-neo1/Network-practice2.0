// Check every YouTube video referenced by a lesson against YouTube's public oEmbed endpoint.
// A video passes when it exists, is embeddable, and its real title/channel match what the lesson says.
//
//   node scripts/verify-videos.ts            all lessons
//   node scripts/verify-videos.ts arp nat    specific lessons

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { allLessons } from "../src/content/curriculum.ts";
import type { Lesson } from "../src/content/types.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const wanted = process.argv.slice(2);
const targets = wanted.length ? allLessons.filter((l) => wanted.includes(l.slug)) : allLessons;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

let bad = 0;
let checked = 0;
for (const meta of targets) {
  const file = resolve(root, "src/content/lessons", `${meta.slug}.ts`);
  if (!existsSync(file)) continue;
  const lesson: Lesson = (await import(pathToFileURL(file).href)).default;
  for (const v of lesson.videos ?? []) {
    checked++;
    const url = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${v.id}`)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        bad++;
        console.log(`FAIL  ${meta.slug}  ${v.id}  HTTP ${res.status} (missing, private or not embeddable)`);
        continue;
      }
      const data = (await res.json()) as { title: string; author_name: string };
      const titleOk = norm(data.title).includes(norm(v.title)) || norm(v.title).includes(norm(data.title)) || overlap(data.title, v.title) >= 0.6;
      const channelOk = norm(data.author_name) === norm(v.channel);
      if (!titleOk || !channelOk) {
        bad++;
        console.log(`DIFF  ${meta.slug}  ${v.id}\n      lesson:  "${v.title}" / ${v.channel}\n      youtube: "${data.title}" / ${data.author_name}`);
      } else console.log(`ok    ${meta.slug}  ${v.id}  ${data.author_name}: ${data.title}`);
    } catch (e) {
      bad++;
      console.log(`FAIL  ${meta.slug}  ${v.id}  ${(e as Error).message}`);
    }
  }
}

function overlap(a: string, b: string) {
  const wa = new Set(norm(a).split(" "));
  const wb = norm(b).split(" ");
  return wb.filter((w) => wa.has(w)).length / Math.max(1, wb.length);
}

console.log(`\n${checked} video(s) checked, ${bad} problem(s).`);
process.exit(bad ? 1 : 0);
