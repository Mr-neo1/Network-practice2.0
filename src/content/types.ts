// Content model for every lesson.
//
// Every learner-facing string is bilingual:
//   en = plain English
//   hi = Hinglish, written in Roman script (never Devanagari)
// Inline formatting inside any string: **bold** and `code`.

export type L = { en: string; hi: string };

export type Lang = "en" | "hi";

export type Level = "zero" | "ccna" | "expert";

export type Cell = string | L;

export type Block =
  | { type: "p"; text: L }
  | { type: "list"; items: L[] }
  | { type: "steps"; items: L[] }
  | { type: "callout"; tone: "tip" | "warn" | "exam" | "analogy"; title?: L; text: L }
  | { type: "table"; caption?: L; columns: Cell[]; rows: Cell[][] }
  | { type: "cli"; title?: L; lines: CliLine[]; note?: L }
  | { type: "code"; lang: "json" | "yaml" | "xml" | "python" | "text"; title?: L; code: string };

/** One line in a CLI block. Use `prompt` + `cmd` for input, `out` for device output, `comment` for an explanation. */
export type CliLine = { prompt?: string; cmd?: string; out?: string; comment?: L };

export type Section = { id: string; heading: L; blocks: Block[] };

export type Question = {
  q: L;
  /** Exactly four options. */
  options: L[];
  /** Index (0-3) of the correct option. */
  answer: number;
  explain: L;
  kind?: "concept" | "scenario" | "cli" | "calc";
};

export type Video = {
  /** 11-character YouTube video id. */
  id: string;
  title: string;
  channel: string;
  /** Spoken language of the video. */
  lang: "en" | "hi";
  /** Why this video fits, or which part to watch. */
  note?: L;
};

export type Command = { cmd: string; mode: string; does: L };

export type Term = { term: string; def: L };

export type Lesson = {
  slug: string;
  /** Why this topic matters, in 2-3 sentences. */
  intro: L;
  /** "After this lesson you can..." outcomes. */
  outcomes: L[];
  sections: Section[];
  terms: Term[];
  commands?: Command[];
  /** Common mistakes and exam traps. */
  mistakes: L[];
  /** Recap bullets. */
  recap: L[];
  quiz: Question[];
  videos: Video[];
  /** A small Packet Tracer (or real gear) task to try. */
  lab?: { title: L; steps: L[] };
};

export type LessonMeta = {
  slug: string;
  title: L;
  summary: L;
  minutes: number;
  /** Scene id in src/anim/scenes/<id>.ts */
  scene: string;
  /** CCNA 200-301 v1.1 exam topic reference, e.g. "1.6". */
  exam?: string;
};

export type ModuleMeta = {
  id: string;
  num: number;
  level: Level;
  title: L;
  blurb: L;
  /** Exam domain, e.g. "CCNA 1.0 · 20% of the exam" */
  domain?: string;
  lessons: LessonMeta[];
};
