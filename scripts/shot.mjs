// Take screenshots of app routes with headless Chrome or Edge (for visual checks).
//
//   node scripts/shot.mjs <out-dir> <width> <route> [<route> ...]
//   e.g. node scripts/shot.mjs shots 1280 "/lesson/arp" "/scene/arp/3"
//
// Routes are hash routes. Set SHOT_THEME=dark for the dark theme, SHOT_LANG=hi for Hinglish,
// SHOT_HEIGHT to change the window height (default 1400).

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const [outDir, width, ...routes] = process.argv.slice(2);
if (!outDir || !width || routes.length === 0) {
  console.error("usage: node scripts/shot.mjs <out-dir> <width> <route>...");
  process.exit(1);
}

const browsers = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const browser = browsers.find((b) => existsSync(b));
if (!browser) throw new Error("No Chrome or Edge found");

const base = process.env.SHOT_BASE ?? "http://localhost:5173/";
const height = process.env.SHOT_HEIGHT ?? "1400";
mkdirSync(outDir, { recursive: true });

// Preferences are read from localStorage; pass them through a tiny bootstrap query.
const prefs = encodeURIComponent(JSON.stringify({ theme: process.env.SHOT_THEME ?? "light", lang: process.env.SHOT_LANG ?? "en" }));

for (const route of routes) {
  const name = route.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "_") || "home";
  const file = resolve(outDir, `${name}_${width}${process.env.SHOT_THEME === "dark" ? "_dark" : ""}${process.env.SHOT_LANG === "hi" ? "_hi" : ""}.png`);
  // Headless Chrome won't go below ~500px wide, so narrow widths render inside an iframe.
  const narrow = Number(width) < 520;
  const url = narrow
    ? `${base}scripts/frame.html?w=${width}&h=${height}&prefs=${prefs}&route=${encodeURIComponent(route)}`
    : `${base}?prefs=${prefs}#${route}`;
  execFileSync(browser, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    `--user-data-dir=${resolve(outDir, ".profile")}`,
    `--window-size=${narrow ? 540 : width},${height}`,
    "--virtual-time-budget=6000",
    `--screenshot=${file}`,
    url,
  ], { stdio: "ignore", timeout: 60000 });
  console.log(file);
}
