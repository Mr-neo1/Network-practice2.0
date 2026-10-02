// Progress store: one copy per account (or "guest") in localStorage, synced to the server when signed in.

import { useSyncExternalStore } from "react";
import {
  emptyProgress,
  isDone,
  mergeProgress,
  normalize,
  reviewCard as sm2,
  scheduleAnswer,
  dayKey,
  type LabState,
  type Progress,
  type Session,
  type Settings,
} from "./progress-model";

export type { Progress } from "./progress-model";
export { isDone } from "./progress-model";

const LEGACY_KEY = "nz2h.progress.v1";
const keyFor = (owner: string) => `nz2h.progress.v2:${owner}`;

function read(owner: string): Progress {
  try {
    const raw = localStorage.getItem(keyFor(owner));
    if (raw) return normalize(JSON.parse(raw));
    if (owner === "guest") {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) return normalize(JSON.parse(legacy));
    }
  } catch {
    /* unreadable: start fresh */
  }
  return emptyProgress();
}

function write(owner: string, p: Progress) {
  try {
    localStorage.setItem(keyFor(owner), JSON.stringify(p));
  } catch {
    /* storage full or blocked: progress stays in memory for this visit */
  }
}

let owner = "guest";
let state: Progress = typeof localStorage === "undefined" ? emptyProgress() : read(owner);
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

// ─── Sync ─────────────────────────────────────────────────────────────────

export type Pusher = (p: Progress, opts?: { keepalive?: boolean; replace?: boolean }) => Promise<Progress | null>;
let pusher: Pusher | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
let dirty = false;
/** After a reset, the next push replaces the server copy instead of merging with it. */
let replaceNext = false;
export type SyncStatus = "off" | "saved" | "pending" | "saving" | "error";
let syncStatus: SyncStatus = "off";
const syncListeners = new Set<() => void>();
const setSyncStatus = (s: SyncStatus) => {
  syncStatus = s;
  syncListeners.forEach((l) => l());
};

async function flush(keepalive = false) {
  if (!pusher || !dirty) return;
  dirty = false;
  setSyncStatus("saving");
  const sent = state;
  const replace = replaceNext;
  replaceNext = false;
  try {
    const merged = await pusher(sent, { keepalive, replace });
    if (merged) {
      // Keep anything that changed while the request was in flight.
      state = mergeProgress(merged, state);
      write(owner, state);
      notify();
    }
    setSyncStatus(dirty ? "pending" : "saved");
  } catch {
    dirty = true;
    replaceNext = replaceNext || replace;
    setSyncStatus("error");
  }
}

function schedule() {
  if (!pusher) return;
  dirty = true;
  setSyncStatus("pending");
  clearTimeout(timer);
  timer = setTimeout(() => void flush(), 1500);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => void flush(true));
  window.addEventListener("online", () => dirty && void flush());
  window.addEventListener("storage", (e) => {
    if (e.key === keyFor(owner)) {
      state = read(owner);
      notify();
    }
  });
}

/** Called by the auth layer after sign-in (with the server copy) and after sign-out (null). */
export function switchOwner(userId: string | null, server: Progress | null, push: Pusher | null) {
  clearTimeout(timer);
  if (userId) {
    // Bring guest work into the account so nothing done before signing in is lost.
    const guest = read("guest");
    let merged = mergeProgress(read(userId), guest);
    if (server) merged = mergeProgress(merged, server);
    owner = userId;
    state = merged;
    write(owner, state);
    try {
      localStorage.removeItem(keyFor("guest"));
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      /* ignore */
    }
    pusher = push;
    dirty = true;
    void flush();
  } else {
    owner = "guest";
    pusher = null;
    state = read("guest");
    setSyncStatus("off");
  }
  notify();
}

export function useSyncStatus() {
  return useSyncExternalStore(
    (cb) => {
      syncListeners.add(cb);
      return () => syncListeners.delete(cb);
    },
    () => syncStatus,
    () => syncStatus,
  );
}

// ─── Store ────────────────────────────────────────────────────────────────

function commit(next: Progress) {
  next.updatedAt = Date.now();
  state = next;
  write(owner, state);
  notify();
  schedule();
}

const edit = (fn: (p: Progress) => Progress) => commit(fn(state));

export function useProgress() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => state,
  );
}

export const progress = {
  get: () => state,
  isDone: (slug: string) => isDone(state, slug),

  setDone(slug: string, done: boolean) {
    const now = Date.now();
    edit((p) => (done ? { ...p, done: { ...p.done, [slug]: now } } : { ...p, undone: { ...p.undone, [slug]: now } }));
  },

  visit(slug: string) {
    if (state.last !== slug) edit((p) => ({ ...p, last: slug, lastAt: Date.now() }));
  },

  /** A lesson's own quiz. */
  recordQuiz(slug: string, correct: number, total: number) {
    const prev = state.quiz[slug];
    const now = Date.now();
    edit((p) => ({ ...p, quiz: { ...p.quiz, [slug]: { best: Math.max(prev?.best ?? 0, correct), last: correct, total, at: now } } }));
  },

  /** Any single question answered anywhere. */
  recordAnswer(qid: string, correct: boolean, domain: number) {
    const now = Date.now();
    edit((p) => ({ ...p, answers: { ...p.answers, [qid]: scheduleAnswer(p.answers[qid], correct, domain, now) } }));
  },

  recordSession(s: Omit<Session, "id" | "at">) {
    const now = Date.now();
    const session: Session = { ...s, id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 7)}`, at: now };
    edit((p) => ({ ...p, sessions: [...p.sessions, session].slice(-400) }));
    return session;
  },

  reviewCard(id: string, grade: 0 | 1 | 2 | 3) {
    const now = Date.now();
    edit((p) => ({ ...p, cards: { ...p.cards, [id]: sm2(p.cards[id], grade, now) } }));
  },

  setLab(id: string, patch: Partial<Omit<LabState, "at">>) {
    const prev: LabState = state.labs[id] ?? { done: false, tasks: [], notes: "", at: 0 };
    edit((p) => ({ ...p, labs: { ...p.labs, [id]: { ...prev, ...patch, at: Date.now() } } }));
  },

  setPlanDay(id: string, status: "done" | "skipped" | null) {
    // "cleared" keeps a timestamp so a merge with an older copy doesn't bring the old status back.
    edit((p) => ({ ...p, plan: { ...p.plan, [id]: { status: status ?? "cleared", at: Date.now() } } }));
  },

  /** Study time. Called by the activity timer while you are actively on the site. */
  addMinutes(minutes: number) {
    const key = dayKey();
    edit((p) => ({ ...p, activity: { ...p.activity, [key]: Math.round(((p.activity[key] ?? 0) + minutes) * 10) / 10 } }));
  },

  recordSubnet(kind: string, ok: boolean, sec: number) {
    edit((p) => ({
      ...p,
      subnet: {
        attempts: p.subnet.attempts + 1,
        correct: p.subnet.correct + (ok ? 1 : 0),
        seconds: p.subnet.seconds + sec,
        recent: [...p.subnet.recent, { at: Date.now(), ok, sec, kind }].slice(-60),
      },
    }));
  },

  setSettings(patch: Partial<Omit<Settings, "at">>) {
    edit((p) => ({ ...p, settings: { ...p.settings, ...patch, at: Date.now() } }));
  },

  exportJSON() {
    return JSON.stringify({ app: "network-zero2hero", exportedAt: new Date().toISOString(), progress: state }, null, 1);
  },

  /** Merges a backup into current progress. Returns false if the file isn't a backup. */
  importJSON(text: string) {
    try {
      const data = JSON.parse(text);
      const incoming = normalize(data.progress ?? data);
      commit(mergeProgress(state, incoming));
      return true;
    } catch {
      return false;
    }
  },

  reset() {
    replaceNext = true;
    commit(emptyProgress());
  },
};
