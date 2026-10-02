// Drive a real headless Chrome through the DevTools protocol: open a page, click, wait in real time,
// and take screenshots. Useful for checking animations mid-flight.
//
//   node scripts/drive.mjs <url> <action> [<action> ...]
//     wait:<ms>          wait in real time
//     eval:<js>          run JavaScript in the page (prints the result)
//     click:<selector>   click the first element matching a CSS selector
//     shot:<file.png>    save a screenshot
//     size:<w>x<h>       set the viewport size
//
// Example:
//   node scripts/drive.mjs "http://localhost:5173/#/scene/arp" "click:.player-start" "wait:1800" "shot:mid.png"

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, ...actions] = process.argv.slice(2);
const browser = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((b) => existsSync(b));
if (!browser || !url) throw new Error("usage: node scripts/drive.mjs <url> <actions...> (needs Chrome or Edge)");

const port = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), "drive-"));
const chrome = spawn(browser, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--hide-scrollbars", "--window-size=1100,900", "about:blank"], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50 && !targets; i++) {
  await sleep(200);
  try {
    targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  } catch {}
}
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

let nextId = 1;
const pending = new Map();
ws.addEventListener("message", (e) => {
  const msg = JSON.parse(e.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = nextId++;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });

try {
  await send("Page.enable");
  await send("Page.navigate", { url });
  await sleep(1500);
  for (const action of actions) {
    const [kind, ...rest] = action.split(":");
    const arg = rest.join(":");
    if (kind === "wait") await sleep(Number(arg));
    else if (kind === "size") {
      const [w, h] = arg.split("x").map(Number);
      await send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile: w < 600 });
    } else if (kind === "eval" || kind === "click") {
      const expression = kind === "click" ? `(() => { const el = document.querySelector(${JSON.stringify(arg)}); if (!el) return "not found: ${arg.replace(/"/g, "'")}"; el.click(); return "clicked"; })()` : arg;
      const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      console.log(`${kind}: ${JSON.stringify(res.result?.result?.value ?? res.result?.exceptionDetails?.text ?? null)}`);
    } else if (kind === "shot") {
      const res = await send("Page.captureScreenshot", { format: "png" });
      writeFileSync(arg, Buffer.from(res.result.data, "base64"));
      console.log(`shot: ${arg}`);
    } else throw new Error(`unknown action ${action}`);
  }
} finally {
  ws.close();
  chrome.kill();
}
