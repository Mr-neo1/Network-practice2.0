// The learner's progress: what it contains, how it starts, and how two copies merge.
// Pure TypeScript with no browser APIs, so the server uses the same merge when syncing.

export type QuizScore = { best: number; last: number; total: number; at: number };

/** Per-question history. Questions answered wrong come back for review: 1, 3 and 7 days later. */
export type AnswerStat = {
  /** Exam domain 1-6, or 0 if none. */
  d: number;
  seen: number;
  right: number;
  last: number;
  lastRight: boolean;
  /** 0 = due for first review, 1-2 = in later reviews, 3 = learned. -1 = never wrong. */
  stage: number;
  /** When it is due for review (ms). 0 = not scheduled. */
  due: number;
};

export type Session = {
  id: string;
  at: number;
  kind: "lesson" | "practice" | "exam" | "review" | "plan";
  label: string;
  total: number;
  correct: number;
  seconds: number;
  /** domain -> [correct, total] */
  perDomain?: Record<string, [number, number]>;
};

export type CardState = { ef: number; reps: number; interval: number; due: number; at: number };

export type LabState = { done: boolean; tasks: number[]; notes: string; at: number; score?: number };

export type PlanEntry = { status: "done" | "skipped" | "cleared"; at: number };

export type Settings = {
  examDate?: string;
  /** Daily study goal in minutes. */
  dailyGoal: number;
  /** First day of the 8-week plan (YYYY-MM-DD). */
  planStart?: string;
  at: number;
};

export type SubnetStats = { attempts: number; correct: number; seconds: number; recent: { at: number; ok: boolean; sec: number; kind: string }[] };

export type Progress = {
  v: 2;
  updatedAt: number;
  /** Lesson slug -> time completed. */
  done: Record<string, number>;
  /** Lesson slug -> time it was un-marked (so a merge doesn't bring it back). */
  undone: Record<string, number>;
  quiz: Record<string, QuizScore>;
  answers: Record<string, AnswerStat>;
  sessions: Session[];
  cards: Record<string, CardState>;
  labs: Record<string, LabState>;
  plan: Record<string, PlanEntry>;
  /** YYYY-MM-DD -> minutes studied. */
  activity: Record<string, number>;
  subnet: SubnetStats;
  settings: Settings;
  last?: string;
  lastAt?: number;
};

export const DAY = 86_400_000;

export function emptyProgress(): Progress {
  return {
    v: 2,
    updatedAt: 0,
    done: {},
    undone: {},
    quiz: {},
    answers: {},
    sessions: [],
    cards: {},
    labs: {},
    plan: {},
    activity: {},
    subnet: { attempts: 0, correct: 0, seconds: 0, recent: [] },
    settings: { dailyGoal: 45, at: 0 },
  };
}

/** Accepts anything that was ever stored (v1 or v2) and returns a complete v2 object. */
export function normalize(raw: unknown): Progress {
  const p = emptyProgress();
  if (!raw || typeof raw !== "object") return p;
  const r = raw as Record<string, any>;
  const obj = (x: unknown) => (x && typeof x === "object" && !Array.isArray(x) ? (x as Record<string, any>) : {});
  p.updatedAt = Number(r.updatedAt) || 0;
  p.done = obj(r.done);
  p.undone = obj(r.undone);
  p.quiz = obj(r.quiz);
  p.answers = obj(r.answers);
  p.sessions = Array.isArray(r.sessions) ? r.sessions : [];
  p.cards = obj(r.cards);
  p.labs = obj(r.labs);
  p.plan = obj(r.plan);
  p.activity = obj(r.activity);
  if (r.subnet && typeof r.subnet === "object") p.subnet = { ...p.subnet, ...r.subnet, recent: Array.isArray(r.subnet.recent) ? r.subnet.recent : [] };
  if (r.settings && typeof r.settings === "object") p.settings = { ...p.settings, ...r.settings };
  p.last = typeof r.last === "string" ? r.last : undefined;
  p.lastAt = Number(r.lastAt) || undefined;
  // v1 stored wrong answers as { qid: count }.
  if (r.wrong && typeof r.wrong === "object" && !r.answers) {
    for (const [qid, n] of Object.entries(r.wrong)) p.answers[qid] = { d: 0, seen: Number(n) || 1, right: 0, last: 0, lastRight: false, stage: 0, due: 1 };
  }
  return p;
}

export function isDone(p: Progress, slug: string) {
  return (p.done[slug] ?? 0) > (p.undone[slug] ?? 0);
}

const latest = <T extends { at: number }>(a: T | undefined, b: T | undefined) => (!a ? b : !b ? a : b.at > a.at ? b : a);

function mergeMap<T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T | undefined, y: T | undefined) => T | undefined) {
  const out: Record<string, T> = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const v = pick(a[k], b[k]);
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/** Combine two copies of progress (e.g. this browser and the server) without losing work from either. */
export function mergeProgress(x: Progress, y: Progress): Progress {
  const a = normalize(x);
  const b = normalize(y);
  const max = (m: number | undefined, n: number | undefined) => Math.max(m ?? 0, n ?? 0);
  const sessions = new Map<string, Session>();
  [...a.sessions, ...b.sessions].forEach((s) => sessions.set(s.id, s));
  const subnet = b.subnet.attempts > a.subnet.attempts ? b.subnet : a.subnet;
  const lastFromB = (b.lastAt ?? 0) > (a.lastAt ?? 0);
  return {
    v: 2,
    updatedAt: Math.max(a.updatedAt, b.updatedAt),
    done: mergeMap(a.done, b.done, max),
    undone: mergeMap(a.undone, b.undone, max),
    quiz: mergeMap(a.quiz, b.quiz, (m, n) => {
      if (!m || !n) return m ?? n;
      const newer = n.at > m.at ? n : m;
      return { ...newer, best: Math.max(m.best, n.best) };
    }),
    answers: mergeMap(a.answers, b.answers, (m, n) => (!m ? n : !n ? m : n.last > m.last ? n : m)),
    sessions: [...sessions.values()].sort((s, t) => s.at - t.at).slice(-400),
    cards: mergeMap(a.cards, b.cards, latest),
    labs: mergeMap(a.labs, b.labs, (m, n) => {
      const pick = latest(m, n);
      if (!pick || !m || !n) return pick;
      return { ...pick, done: pick.done, score: Math.max(m.score ?? 0, n.score ?? 0) || undefined };
    }),
    plan: mergeMap(a.plan, b.plan, latest),
    activity: mergeMap(a.activity, b.activity, max),
    subnet,
    settings: b.settings.at > a.settings.at ? b.settings : a.settings,
    last: lastFromB ? b.last : a.last,
    lastAt: lastFromB ? b.lastAt : a.lastAt,
  };
}

// ─── Spaced repetition ────────────────────────────────────────────────────

const REVIEW_GAPS = [1, 3, 7];

/** Update a question's history after an answer. */
export function scheduleAnswer(prev: AnswerStat | undefined, correct: boolean, domain: number, now: number): AnswerStat {
  const base: AnswerStat = prev ?? { d: domain, seen: 0, right: 0, last: 0, lastRight: false, stage: -1, due: 0 };
  const next: AnswerStat = { ...base, d: domain || base.d, seen: base.seen + 1, right: base.right + (correct ? 1 : 0), last: now, lastRight: correct };
  if (!correct) {
    next.stage = 0;
    next.due = now + REVIEW_GAPS[0] * DAY;
  } else if (base.stage >= 0 && base.stage < 3) {
    next.stage = base.stage + 1;
    next.due = next.stage < 3 ? now + REVIEW_GAPS[next.stage] * DAY : 0;
  }
  return next;
}

/** SM-2 flashcard scheduling. grade: 0 again, 1 hard, 2 good, 3 easy. */
export function reviewCard(prev: CardState | undefined, grade: 0 | 1 | 2 | 3, now: number): CardState {
  const s = prev ?? { ef: 2.5, reps: 0, interval: 0, due: 0, at: 0 };
  const q = [1, 3, 4, 5][grade];
  let { ef, reps, interval } = s;
  if (q < 3) {
    reps = 0;
    interval = 0;
  } else {
    reps += 1;
    interval = reps === 1 ? 1 : reps === 2 ? (grade === 3 ? 4 : 3) : Math.round(interval * ef * (grade === 1 ? 0.8 : grade === 3 ? 1.3 : 1));
  }
  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  // "Again" comes back in ten minutes, the rest after `interval` days.
  const due = interval === 0 ? now + 10 * 60_000 : now + interval * DAY;
  return { ef: Math.round(ef * 100) / 100, reps, interval, due, at: now };
}

// ─── Dates ────────────────────────────────────────────────────────────────

export function dayKey(t: number | Date = Date.now()) {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
