// Network Zero2Hero server: accounts, progress sync, and (in production) the built site.
//
//   node --no-warnings=ExperimentalWarning backend/server.ts
//
// Env: PORT (default 8787), NZ2H_DB (default data/nz2h.sqlite), NZ2H_STATIC (default dist),
//      NZ2H_SECURE_COOKIES=1 behind HTTPS, NZ2H_ORIGINS (extra allowed origins, comma-separated).

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { extname, join, normalize as normPath, resolve } from "node:path";
import { mergeProgress, normalize } from "../src/lib/progress-model.ts";
import { createSession, dummyHash, endSession, hashPassword, newUserId, SESSION_DAYS, userForToken, verifyPassword } from "./auth.ts";
import { q, type UserRow } from "./db.ts";

const PORT = Number(process.env.PORT ?? 8787);
const STATIC_DIR = resolve(process.env.NZ2H_STATIC ?? "dist");
const SECURE = process.env.NZ2H_SECURE_COOKIES === "1";
const COOKIE = "nz2h_sid";
const MAX_BODY = 4 * 1024 * 1024;
const EXTRA_ORIGINS = (process.env.NZ2H_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ─── helpers ──────────────────────────────────────────────────────────────

function send(res: ServerResponse, status: number, body: unknown, headers: Record<string, string | string[]> = {}) {
  const json = JSON.stringify(body);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers });
  res.end(json);
}

function cookies(req: IncomingMessage) {
  const out: Record<string, string> = {};
  for (const part of (req.headers.cookie ?? "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function sessionCookie(token: string, maxAgeSec: number) {
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${SECURE ? "; Secure" : ""}`;
}

async function readJson(req: IncomingMessage): Promise<any> {
  if (!(req.headers["content-type"] ?? "").includes("application/json")) throw new HttpError(415, "Send JSON.");
  let size = 0;
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > MAX_BODY) throw new HttpError(413, "Request too large.");
    chunks.push(chunk as Buffer);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    throw new HttpError(400, "Invalid JSON.");
  }
}

/** Reject cross-site requests that change state (cookies are SameSite=Lax; this is a second check). */
function checkOrigin(req: IncomingMessage) {
  const origin = req.headers.origin;
  if (!origin) return;
  const host = req.headers.host;
  const ok = [`http://${host}`, `https://${host}`, ...EXTRA_ORIGINS].includes(origin) || /^http:\/\/localhost:\d+$/.test(origin);
  if (!ok) throw new HttpError(403, "Cross-origin request refused.");
}

// Simple fixed-window limit for login/register attempts per IP.
const attempts = new Map<string, { n: number; reset: number }>();
function rateLimit(req: IncomingMessage, limit = 10, windowMs = 10 * 60_000) {
  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0].trim() || req.socket.remoteAddress || "?";
  const now = Date.now();
  const e = attempts.get(ip);
  if (!e || e.reset < now) attempts.set(ip, { n: 1, reset: now + windowMs });
  else if (++e.n > limit) throw new HttpError(429, "Too many attempts. Wait a few minutes and try again.");
}

const publicUser = (u: { id: string; email: string; name: string; created_at: number }) => ({ id: u.id, email: u.email, name: u.name, createdAt: u.created_at });

function currentUser(req: IncomingMessage) {
  return userForToken(cookies(req)[COOKIE]);
}

function requireUser(req: IncomingMessage) {
  const u = currentUser(req);
  if (!u) throw new HttpError(401, "Not signed in.");
  return u;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── API ──────────────────────────────────────────────────────────────────

async function api(req: IncomingMessage, res: ServerResponse, path: string) {
  const method = req.method ?? "GET";
  if (method !== "GET") checkOrigin(req);

  if (path === "/api/health" && method === "GET") return send(res, 200, { ok: true });

  if (path === "/api/auth/register" && method === "POST") {
    rateLimit(req);
    const body = await readJson(req);
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim().slice(0, 60);
    const password = String(body.password ?? "");
    if (!EMAIL.test(email) || email.length > 200) throw new HttpError(400, "Enter a valid email address.");
    if (!name) throw new HttpError(400, "Enter your name.");
    if (password.length < 8 || password.length > 200) throw new HttpError(400, "Use a password of at least 8 characters.");
    if (q.userByEmail.get(email)) throw new HttpError(409, "An account with this email already exists. Sign in instead.");
    const id = newUserId();
    q.insertUser.run(id, email, name, await hashPassword(password), Date.now());
    const token = createSession(id);
    return send(res, 201, { user: publicUser({ id, email, name, created_at: Date.now() }) }, { "Set-Cookie": sessionCookie(token, SESSION_DAYS * 86400) });
  }

  if (path === "/api/auth/login" && method === "POST") {
    rateLimit(req);
    const body = await readJson(req);
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const user = q.userByEmail.get(email) as UserRow | undefined;
    const ok = user ? await verifyPassword(password, user.pass_hash) : (await verifyPassword(password, await dummyHash()), false);
    if (!user || !ok) throw new HttpError(401, "Email or password is incorrect.");
    const token = createSession(user.id);
    return send(res, 200, { user: publicUser(user) }, { "Set-Cookie": sessionCookie(token, SESSION_DAYS * 86400) });
  }

  if (path === "/api/auth/logout" && method === "POST") {
    endSession(cookies(req)[COOKIE]);
    return send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie("", 0) });
  }

  if (path === "/api/auth/me" && method === "GET") {
    const u = currentUser(req);
    return send(res, 200, { user: u ? publicUser(u) : null });
  }

  if (path === "/api/progress" && method === "GET") {
    const u = requireUser(req);
    const row = q.getProgress.get(u.id) as { data: string; updated_at: number } | undefined;
    return send(res, 200, { progress: row ? normalize(JSON.parse(row.data)) : null });
  }

  if (path === "/api/progress" && method === "PUT") {
    const u = requireUser(req);
    const body = await readJson(req);
    const incoming = normalize(body.progress);
    const row = q.getProgress.get(u.id) as { data: string } | undefined;
    // Normally merge with what is stored; after "reset progress" the client asks to replace.
    const merged = body.replace || !row ? incoming : mergeProgress(normalize(JSON.parse(row.data)), incoming);
    q.putProgress.run(u.id, JSON.stringify(merged), Date.now());
    return send(res, 200, { progress: merged });
  }

  throw new HttpError(404, "Not found.");
}

// ─── Static files (production) ────────────────────────────────────────────

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function serveStatic(req: IncomingMessage, res: ServerResponse, path: string) {
  if (!existsSync(STATIC_DIR)) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("No build found. Run `npm run build`, or use `npm run dev` while developing.");
  }
  let file = normPath(join(STATIC_DIR, decodeURIComponent(path)));
  if (!file.startsWith(STATIC_DIR)) {
    res.writeHead(403);
    return res.end();
  }
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(STATIC_DIR, "index.html");
  const hashed = /[-.][A-Za-z0-9_-]{8,}\.(js|css)$/.test(file);
  res.writeHead(200, {
    "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
    "Cache-Control": hashed ? "public, max-age=31536000, immutable" : "no-cache",
    "X-Content-Type-Options": "nosniff",
  });
  createReadStream(file).pipe(res);
}

// ─── Server ───────────────────────────────────────────────────────────────

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  try {
    if (path.startsWith("/api/")) await api(req, res, path);
    else serveStatic(req, res, path);
  } catch (e) {
    if (e instanceof HttpError) send(res, e.status, { error: e.message });
    else {
      console.error(e);
      send(res, 500, { error: "Something went wrong on the server." });
    }
  }
});

setInterval(() => q.deleteExpired.run(Date.now()), 3_600_000).unref();

server.listen(PORT, () => console.log(`Network Zero2Hero server on http://localhost:${PORT}`));
