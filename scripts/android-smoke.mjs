// Smoke-test the Android app on an emulator: install it, drive its web view over the DevTools
// protocol, press the real Android back button, and take device screenshots.
//
//   node scripts/android-smoke.mjs <app-debug.apk> <out-dir>
//
// Needs adb and a running emulator (CI starts one in .github/workflows/android-smoke.yml).
// Writes <out-dir>/report.json and <out-dir>/*.png, and exits non-zero if a check fails.

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [apk, out = "smoke-out"] = process.argv.slice(2);
if (!apk) throw new Error("usage: node scripts/android-smoke.mjs <apk> <out-dir>");
mkdirSync(out, { recursive: true });

const PKG = "io.github.mrneo1.zero2hero";
const adbPath = process.env.ANDROID_HOME ? join(process.env.ANDROID_HOME, "platform-tools", "adb") : "adb";
const adb = (...args) => execFileSync(adbPath, args, { maxBuffer: 64 * 1024 * 1024 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const checks = [];
const check = (name, ok, detail = "") => {
  checks.push({ name, ok: Boolean(ok), detail: String(detail) });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};
const shot = (name) => writeFileSync(join(out, `${name}.png`), adb("exec-out", "screencap", "-p"));

adb("install", "-r", apk);
adb("shell", "am", "start", "-n", `${PKG}/.MainActivity`);
await sleep(9000);

// The debug build exposes its web view to DevTools through an abstract socket.
const sockets = adb("shell", "cat", "/proc/net/unix").toString();
const socket = sockets.match(/@(webview_devtools_remote_\d+)/)?.[1];
if (!socket) throw new Error("web view DevTools socket not found");
adb("forward", "tcp:9333", `localabstract:${socket}`);
const targets = await (await fetch("http://127.0.0.1:9333/json/list")).json();
const page = targets.find((t) => t.type === "page" && t.url.startsWith("https://localhost"));
if (!page) throw new Error(`app page not found: ${JSON.stringify(targets.map((t) => t.url))}`);

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r, j) => (ws.addEventListener("open", r, { once: true }), ws.addEventListener("error", j, { once: true })));
let nextId = 1;
const pending = new Map();
const problems = [];
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) pending.get(m.id)(m), pending.delete(m.id);
  if (m.method === "Runtime.exceptionThrown") problems.push(`exception: ${m.params.exceptionDetails?.exception?.description ?? m.params.exceptionDetails?.text}`);
  if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") problems.push(`console.error: ${m.params.args.map((a) => a.value ?? a.description).join(" ")}`);
});
const send = (method, params = {}) => new Promise((r) => (pending.set(nextId, r), ws.send(JSON.stringify({ id: nextId++, method, params }))));
const js = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return r.result?.result?.value;
};
const go = async (hash) => {
  await js(`location.hash = ${JSON.stringify(hash)}`);
  await sleep(2500);
};

await send("Runtime.enable");

try {
  // Start-up
  check("app runs from the bundled files", (await js("location.origin")) === "https://localhost", await js("location.href"));
  check("native glue loaded", await js("document.documentElement.classList.contains('is-native')"));
  check("plugins present", await js("['App','AppLauncher','SplashScreen','Filesystem','Share'].every(p => window.Capacitor?.Plugins?.[p])"));
  check("fonts are bundled, not fetched", await js("document.fonts.check('16px \"IBM Plex Sans\"') && ![...document.styleSheets].some(s => (s.href||'').includes('googleapis'))"));
  const width = await js("innerWidth");
  check("page fits the screen", (await js("document.documentElement.scrollWidth")) <= width, `scrollWidth vs ${width}`);
  const tab = await js("getComputedStyle(document.querySelector('.tabbar')).display");
  check("bottom tab bar shown", tab === "grid", tab);
  const top = await js("JSON.stringify({ topbarPadding: getComputedStyle(document.querySelector('.topbar')).paddingTop, topbarTop: document.querySelector('.topbar').getBoundingClientRect().top })");
  check("top bar measured (safe area)", true, top);
  shot("01-home");

  // Lesson page with its animation
  await go("#/lesson/subnetting");
  check("lesson renders", await js("!!document.querySelector('.lesson h1')"), await js("document.querySelector('.lesson h1')?.textContent"));
  shot("02-lesson");

  // Lab terminal, typed the way a phone keyboard types (text insertion, not key events)
  await go("#/lab/vlans-trunk");
  await js("document.querySelector('.t-input').focus()");
  await send("Input.insertText", { text: "enable" });
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await sleep(500);
  check("terminal: enable gives the # prompt", (await js("document.querySelector('.t-prompt')?.textContent")) === "SW1#", await js("document.querySelector('.t-prompt')?.textContent"));
  await send("Input.insertText", { text: "show " });
  await send("Input.insertText", { text: "?" });
  await sleep(500);
  const helpOut = await js("[...document.querySelectorAll('.t-out')].pop()?.textContent ?? ''");
  check("terminal: typed ? shows help", /running-config|vlan|interfaces/.test(helpOut), helpOut.slice(0, 80));
  check("terminal keys shown", (await js("getComputedStyle(document.querySelector('.term-keys')).display")) === "flex");
  check("tab bar hides while typing", (await js("getComputedStyle(document.querySelector('.tabbar')).display")) === "none");
  shot("03-lab-typing");
  await js("document.activeElement?.blur()");

  // The Android back button walks back through pages
  const before = await js("location.hash");
  adb("shell", "input", "keyevent", "4");
  await sleep(1500);
  const after = await js("location.hash");
  check("back button goes to the previous page", after === "#/lesson/subnetting", `${before} -> ${after}`);

  // Menu opens, and back closes it instead of leaving the page
  await js("document.querySelector('.menu-btn').click()");
  await sleep(500);
  shot("04-menu");
  adb("shell", "input", "keyevent", "4");
  await sleep(800);
  check("back closes the menu first", !(await js("!!document.querySelector('.drawer')")) && (await js("location.hash")) === "#/lesson/subnetting");

  // Dark theme and the remaining pages
  await js("localStorage.setItem('nz2h.prefs', JSON.stringify({ theme: 'dark', lang: 'hi' })); location.hash = '#/progress'; location.reload()");
  await sleep(5000);
  shot("05-progress-dark-hinglish");
  for (const [hash, name] of [["#/practice", "06-practice"], ["#/flashcards", "07-flashcards"], ["#/labs", "08-labs"], ["#/settings", "09-settings"]]) {
    await go(hash);
    const fits = (await js("document.documentElement.scrollWidth")) <= (await js("innerWidth"));
    check(`${hash} fits the screen`, fits);
    shot(name);
  }
} finally {
  const ignorable = (p) => /net::ERR|Failed to fetch|NetworkError|supabase|ERR_NAME_NOT_RESOLVED/i.test(p);
  const real = problems.filter((p) => !ignorable(p));
  check("no script errors", real.length === 0, real.slice(0, 5).join(" | "));
  writeFileSync(join(out, "report.json"), JSON.stringify({ when: new Date().toISOString(), checks, problems }, null, 2));
  const log = adb("logcat", "-d", "-s", "Capacitor:*", "Capacitor/Console:*", "chromium:*", "AndroidRuntime:E").toString();
  writeFileSync(join(out, "logcat.txt"), log);
  ws.close();
}

const failed = checks.filter((c) => !c.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);
