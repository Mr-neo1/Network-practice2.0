// End-to-end test of accounts and sync on a deployed site: two separate browsers ("devices") on one
// account, plus a second account that must not see the first one's data.
//
//   node scripts/live-sync-test.mjs [site-url]
//   default site: https://mr-neo1.github.io/Network-practice2.0/
//
// Creates two throwaway accounts named zero2hero.test.<time>@example.com (delete them later under
// Supabase > Authentication > Users if you like).

import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const site = (process.argv[2] ?? "https://mr-neo1.github.io/Network-practice2.0/").replace(/\/?$/, "/");
const env = Object.fromEntries(
  readFileSync(new URL("../.env.production", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => l.trim().split(/=(.*)/s).slice(0, 2)),
);
const SB = env.VITE_SUPABASE_URL, KEY = env.VITE_SUPABASE_ANON_KEY;
const browserPath = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((b) => existsSync(b));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
const check = (name, ok, detail = "") => {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  return ok;
};

async function device(name) {
  const port = 9400 + Math.floor(Math.random() * 400);
  const proc = spawn(browserPath, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), `sync-${name}-`))}`, "--no-first-run", "--window-size=1100,900", "about:blank"], { stdio: "ignore" });
  let targets;
  for (let i = 0; i < 50 && !targets; i++) {
    await sleep(200);
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    } catch {}
  }
  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 1;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) pending.get(m.id)(m), pending.delete(m.id);
  });
  const send = (method, params = {}) => new Promise((r) => (pending.set(id, r), ws.send(JSON.stringify({ id: id++, method, params }))));
  const js = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;
  await send("Page.enable");
  return {
    js,
    open: async (hash) => {
      await send("Page.navigate", { url: site + hash });
      await sleep(3500);
    },
    close: () => (ws.close(), proc.kill()),
  };
}

// Fill a React-controlled form field.
const fill = (selector, value) =>
  `(() => { const el = document.querySelector(${JSON.stringify(selector)}); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event("input", { bubbles: true })); })()`;

async function signUp(d, email, password, name) {
  await d.open("#/login");
  await d.js(`[...document.querySelectorAll('.page-tabs button')][1].click()`);
  await sleep(300);
  await d.js(fill("input[autocomplete=name]", name));
  await d.js(fill("input[type=email]", email));
  await d.js(fill("input[type=password]", password));
  await d.js(`document.querySelector('form.auth-form button[type=submit]').click()`);
  await sleep(4000);
  return d.js(`location.hash + ' | ' + (document.querySelector('.auth-page .error, .auth-page .ok-text')?.textContent ?? '')`);
}

async function signIn(d, email, password) {
  await d.open("#/login");
  await d.js(fill("input[type=email]", email));
  await d.js(fill("input[type=password]", password));
  await d.js(`document.querySelector('form.auth-form button[type=submit]').click()`);
  await sleep(4000);
  return d.js("location.hash");
}

async function completeLesson(d, slug) {
  await d.open(`#/lesson/${slug}`);
  await d.js(`[...document.querySelectorAll('button.btn')].find(b => /mark lesson complete/i.test(b.textContent))?.click()`);
  await sleep(4000); // past the 1.5 s save delay
}

const doneOn = (d, slug) =>
  d.js(`(() => { const k = Object.keys(localStorage).find(k => k.startsWith('nz2h.progress.v2:') && !k.endsWith(':guest')); if (!k) return 'no account copy'; const p = JSON.parse(localStorage.getItem(k)); return (p.done?.['${slug}'] ?? 0) > (p.undone?.['${slug}'] ?? 0); })()`);
const token = (d) => d.js(`(() => { const k = Object.keys(localStorage).find(k => /^sb-.*-auth-token$/.test(k)); return k ? JSON.parse(localStorage.getItem(k)).access_token : null; })()`);

const settings = await (await fetch(`${SB}/auth/v1/settings`, { headers: { apikey: KEY } })).json();
if (!settings.mailer_autoconfirm) {
  console.log("Supabase still asks new accounts to confirm their email, so sign-up can't finish.");
  console.log("Turn off Authentication > Sign In / Providers > Email > Confirm email (and Save), then run this again.");
  process.exit(2);
}

const stamp = Date.now();
const email = `zero2hero.test.${stamp}@example.com`;
const password = `Test-${stamp}-pw`;
const A = await device("A");
const B = await device("B");
try {
  console.log(`site: ${site}\naccount: ${email}\n`);

  const up = await signUp(A, email, password, "Sync Test");
  if (!check("sign up signs you straight in", up.startsWith("#/progress"), up)) {
    console.log("\nIf this says a confirmation link was sent, turn off Authentication > Sign In / Providers > Email > Confirm email in Supabase.");
    throw new Error("stop");
  }
  check("sync dot shows synced", (await A.js(`document.querySelector('.account-chip')?.className ?? ''`))?.includes("sync-saved"));

  await completeLesson(A, "what-is-a-network");
  check("device A: lesson 0.1 done locally", (await doneOn(A, "what-is-a-network")) === true);
  const tokA = await token(A);
  const rowA = await (await fetch(`${SB}/rest/v1/progress?select=user_id,data`, { headers: { apikey: KEY, Authorization: `Bearer ${tokA}` } })).json();
  check("server has device A's progress", rowA.length === 1 && (rowA[0].data?.done?.["what-is-a-network"] ?? 0) > 0, `${rowA.length} row(s)`);

  check("device B signs in", (await signIn(B, email, password)).startsWith("#/progress"));
  check("device B sees lesson 0.1 from device A", (await doneOn(B, "what-is-a-network")) === true);

  await completeLesson(B, "binary-and-hex");
  check("device B: lesson 0.3 done locally", (await doneOn(B, "binary-and-hex")) === true);
  check("device A doesn't have it yet", (await doneOn(A, "binary-and-hex")) === false);
  await sleep(16000); // A only re-checks the server every 15 s
  await A.js(`window.dispatchEvent(new Event('focus'))`);
  await sleep(3000);
  check("device A picks up lesson 0.3 when it comes back into focus", (await doneOn(A, "binary-and-hex")) === true);
  check("device A kept lesson 0.1", (await doneOn(A, "what-is-a-network")) === true);

  // A second account must not read or overwrite the first account's row.
  const C = B;
  await C.js(`localStorage.clear()`);
  const up2 = await signUp(C, `zero2hero.test.${stamp}.b@example.com`, password, "Other Person");
  check("second account signs up", up2.startsWith("#/progress"), up2);
  const tokC = await token(C);
  const seen = await (await fetch(`${SB}/rest/v1/progress?select=user_id`, { headers: { apikey: KEY, Authorization: `Bearer ${tokC}` } })).json();
  check("second account can't read the first account's progress", !seen.some((r) => r.user_id === rowA[0].user_id), `${seen.length} row(s) visible`);
  const overwrite = await fetch(`${SB}/rest/v1/progress?user_id=eq.${rowA[0].user_id}`, {
    method: "PATCH",
    headers: { apikey: KEY, Authorization: `Bearer ${tokC}`, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ data: { hacked: true } }),
  });
  const changed = await overwrite.json().catch(() => []);
  check("second account can't overwrite it", Array.isArray(changed) && changed.length === 0, `HTTP ${overwrite.status}`);
} catch (e) {
  if (e.message !== "stop") throw e;
} finally {
  A.close();
  B.close();
}
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
