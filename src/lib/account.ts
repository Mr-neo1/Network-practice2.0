// Where accounts and synced progress live. Two interchangeable backends:
//   - Supabase (hosted sites): used when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set at build time.
//   - The bundled Node server (`npm run dev`, `npm start`): the /api routes in backend/.
import type { Progress, Pusher } from "./progress";
import { normalize } from "./progress-model";

export type User = { id: string; email: string; name: string; createdAt: number };

export interface AccountBackend {
  /** The signed-in user from an existing session, or null. Throws when the backend can't be reached. */
  me(): Promise<User | null>;
  login(email: string, password: string): Promise<User>;
  /** Returns null when the account still has to be confirmed from an email. */
  register(name: string, email: string, password: string): Promise<User | null>;
  logout(): Promise<void>;
  load(user: User): Promise<Progress | null>;
  /** Saves progress (merged with the stored copy unless `replace`) and returns the merged result. */
  push: Pusher;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let backend: Promise<AccountBackend> | null = null;

export function getBackend(): Promise<AccountBackend> {
  backend ??=
    SUPABASE_URL && SUPABASE_KEY
      ? import("./account-supabase").then((m) => m.supabaseBackend(SUPABASE_URL, SUPABASE_KEY))
      : Promise.resolve(apiBackend);
  return backend;
}

// ─── Node server (/api) ──────────────────────────────────────────────────

async function call<T>(method: string, path: string, body?: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  return data as T;
}

const apiBackend: AccountBackend = {
  async me() {
    return (await call<{ user: User | null }>("GET", "api/auth/me")).user;
  },
  async login(email, password) {
    return (await call<{ user: User }>("POST", "api/auth/login", { email, password })).user;
  },
  async register(name, email, password) {
    return (await call<{ user: User }>("POST", "api/auth/register", { name, email, password })).user;
  },
  async logout() {
    await call("POST", "api/auth/logout");
  },
  async load() {
    const data = await call<{ progress: unknown }>("GET", "api/progress");
    return data.progress ? normalize(data.progress) : null;
  },
  async push(p, opts) {
    const data = await call<{ progress: unknown }>("PUT", "api/progress", { progress: p, replace: opts?.replace }, { keepalive: opts?.keepalive });
    return normalize(data.progress);
  },
};
