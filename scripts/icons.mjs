// Render the Android app icons and the web icons from the logo, using headless Chrome (no image libraries needed).
//
//   node scripts/icons.mjs
//
// Writes the launcher icons into android/app/src/main/res/mipmap-*/ and the web icons into public/.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const BRAND = "#1c6e8c";

// The logo: a hub with two links, drawn in a 32-unit box centred on (16, 16).
const graph = (stroke = 2.2) =>
  `<path d="M9 16 23 9M9 16l14 7" stroke="white" stroke-width="${stroke}" stroke-linecap="round" fill="none"/>` +
  `<circle cx="9" cy="16" r="3.4" fill="white"/><circle cx="23" cy="9" r="3.4" fill="white"/><circle cx="23" cy="23" r="3.4" fill="white"/>`;

// `scale` is how wide the drawing is relative to the canvas.
const centred = (canvas, scale) => {
  const s = (canvas * scale) / 21;
  return `<g transform="translate(${canvas / 2} ${canvas / 2}) scale(${s}) translate(-16 -16)">${graph()}</g>`;
};

const svg = (size, inner) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${inner}</svg>`;

const variants = {
  // Adaptive icon foreground: 108 units, keep the drawing inside the 66-unit safe circle.
  foreground: (px) => svg(px, centred(px, 0.4)),
  // Legacy square and round icons for launchers without adaptive icons.
  legacy: (px) => svg(px, `<rect width="${px}" height="${px}" rx="${px * 0.22}" fill="${BRAND}"/>${centred(px, 0.56)}`),
  round: (px) => svg(px, `<circle cx="${px / 2}" cy="${px / 2}" r="${px / 2}" fill="${BRAND}"/>${centred(px, 0.52)}`),
  // Web: full-bleed square for the manifest (maskable) and a rounded one for apple-touch-icon.
  maskable: (px) => svg(px, `<rect width="${px}" height="${px}" fill="${BRAND}"/>${centred(px, 0.42)}`),
};

const res = "android/app/src/main/res";
const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
const jobs = [];
for (const [d, k] of Object.entries(densities)) {
  jobs.push({ file: `${res}/mipmap-${d}/ic_launcher_foreground.png`, px: 108 * k, make: variants.foreground });
  jobs.push({ file: `${res}/mipmap-${d}/ic_launcher.png`, px: 48 * k, make: variants.legacy });
  jobs.push({ file: `${res}/mipmap-${d}/ic_launcher_round.png`, px: 48 * k, make: variants.round });
}
jobs.push({ file: "public/icon-192.png", px: 192, make: variants.maskable });
jobs.push({ file: "public/icon-512.png", px: 512, make: variants.maskable });
jobs.push({ file: "public/apple-touch-icon.png", px: 180, make: variants.legacy });

const browser = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((b) => existsSync(b));
if (!browser) throw new Error("needs Chrome or Edge");

const port = 9800 + Math.floor(Math.random() * 100);
const chrome = spawn(browser, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "icons-"))}`, "--no-first-run", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50 && !targets; i++) {
  await sleep(200);
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  } catch {}
}
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let nextId = 1;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) pending.get(m.id)(m), pending.delete(m.id);
});
const send = (method, params = {}) => new Promise((r) => (pending.set(nextId, r), ws.send(JSON.stringify({ id: nextId++, method, params }))));

try {
  await send("Page.enable");
  await send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
  for (const job of jobs) {
    const html = `<html><body style="margin:0;background:transparent">${job.make(job.px)}</body></html>`;
    await send("Page.navigate", { url: "data:text/html;base64," + Buffer.from(html).toString("base64") });
    await sleep(150);
    const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: job.px, height: job.px, scale: 1 } });
    mkdirSync(dirname(job.file), { recursive: true });
    writeFileSync(job.file, Buffer.from(shot.result.data, "base64"));
  }
  writeFileSync("public/icon.svg", variants.legacy(64));
  console.log(`${jobs.length + 1} icons written`);
} finally {
  ws.close();
  chrome.kill();
}
