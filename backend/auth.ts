// Passwords (scrypt) and sessions (random tokens, stored only as SHA-256 hashes).

import { createHash, randomBytes, randomUUID, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { q, type UserRow } from "./db.ts";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number, opts: object) => Promise<Buffer>;
const PARAMS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
export const SESSION_DAYS = 30;

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64, PARAMS);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [alg, saltB64, keyB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !keyB64) return false;
  const expected = Buffer.from(keyB64, "base64");
  const key = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, PARAMS);
  return timingSafeEqual(key, expected);
}

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const now = Date.now();
  q.insertSession.run(sha(token), userId, now, now + SESSION_DAYS * 86_400_000);
  return token;
}

export function userForToken(token: string | undefined) {
  if (!token) return null;
  return (q.sessionUser.get(sha(token), Date.now()) as Omit<UserRow, "pass_hash"> | undefined) ?? null;
}

export function endSession(token: string | undefined) {
  if (token) q.deleteSession.run(sha(token));
}

export const newUserId = () => randomUUID();

// A dummy hash so a login for an unknown email takes as long as one with a wrong password.
let dummy: Promise<string> | null = null;
export function dummyHash() {
  dummy ??= hashPassword(randomBytes(12).toString("hex"));
  return dummy;
}
