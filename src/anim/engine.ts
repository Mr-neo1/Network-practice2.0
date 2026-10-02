// Timing and state rules shared by the player and the scene views.
// Everything here is pure so views can render any step at any time `t`.

import type { Scene, Tone, TopoStep, TopoTable, TopologyScene, SeqStep, TerminalStep, TermLine } from "./types";

/** Time for a packet to cross one link at 1x speed. */
export const HOP_MS = 950;
/** Time for one sequence message to draw. */
export const MSG_MS = 900;
/** Typing speed for terminal commands. */
export const CHAR_MS = 34;
export const LINE_PAUSE_MS = 260;
export const OUT_LINE_MS = 70;
export const BLOCK_MS = 700;

export function hops(path: string[]) {
  return Math.max(0, path.length - 1);
}

/** How long the moving part of a step takes at 1x, in ms. */
export function stepDuration(scene: Scene, index: number): number {
  const step = scene.steps[index];
  if (!step) return 0;
  switch (scene.kind) {
    case "topology": {
      const s = step as TopoStep;
      if (!s.packets?.length) return 500;
      return Math.max(...s.packets.map((p) => ((p.delay ?? 0) + hops(p.path)) * HOP_MS)) + 250;
    }
    case "sequence": {
      const s = step as SeqStep;
      return Math.max(1, s.messages?.length ?? 0) * MSG_MS;
    }
    case "terminal":
      return terminalTimeline((step as TerminalStep).lines).total;
    default:
      return BLOCK_MS;
  }
}

/** Reading time before auto-advancing, in ms at 1x. */
export function dwellFor(textLength: number) {
  return Math.min(9000, Math.max(2200, textLength * 42));
}

export function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export const tones: Tone[] = ["blue", "green", "orange", "red", "purple", "teal", "pink", "gray"];

// ─── topology state folding ────────────────────────────────────────────────

export type LinkState = { state: "normal" | "active" | "blocked" | "down" | "dim"; note?: string };
export type TopoState = {
  badges: Map<string, { text: string; tone?: Tone }>;
  links: Map<string, LinkState>;
  tables: Map<string, TopoTable>;
};

const tableKey = (t: TopoTable) => `${t.node}::${t.title}`;

function apply(state: TopoState, step: TopoStep, parts: { links: boolean; results: boolean }) {
  if (parts.links) {
    for (const l of step.links ?? []) {
      if (l.state === "normal" && !l.note) state.links.delete(l.id);
      else state.links.set(l.id, { state: l.state, note: l.note });
    }
  }
  if (parts.results) {
    for (const b of step.badges ?? []) {
      if (!b.text) state.badges.delete(b.node);
      else state.badges.set(b.node, { text: b.text, tone: b.tone });
    }
    for (const t of step.tables ?? []) {
      if (!t.rows.length) state.tables.delete(tableKey(t));
      else state.tables.set(tableKey(t), t);
    }
  }
}

/**
 * State to show for step `index`.
 * Link changes are causes: they show from the start of the step.
 * Badges and tables are effects: they show once the step's packets have arrived (`settled`).
 */
export function topoState(scene: TopologyScene, index: number, settled: boolean): TopoState {
  const state: TopoState = { badges: new Map(), links: new Map(), tables: new Map() };
  scene.steps.slice(0, index + 1).forEach((step, i) => {
    if (step.reset) {
      state.badges.clear();
      state.links.clear();
      state.tables.clear();
    }
    const current = i === index;
    apply(state, step, { links: true, results: !current || settled });
  });
  return state;
}

/** Tables changed in this step (to highlight after they appear). */
export function changedTables(step: TopoStep) {
  return new Set((step.tables ?? []).map(tableKey));
}

export { tableKey };

// ─── terminal ──────────────────────────────────────────────────────────────

export type TermEvent = { line: TermLine; start: number; typeEnd: number };

/** When each line of a terminal step starts and finishes typing. */
export function terminalTimeline(lines: TermLine[]) {
  let t = 0;
  const events: TermEvent[] = [];
  for (const line of lines) {
    if (line.cmd !== undefined || (line.prompt && !line.out)) {
      const typing = (line.cmd?.length ?? 0) * CHAR_MS;
      events.push({ line, start: t, typeEnd: t + typing });
      t += typing + (line.cmd ? LINE_PAUSE_MS : 0);
    } else {
      events.push({ line, start: t, typeEnd: t });
      t += OUT_LINE_MS * Math.max(1, (line.out ?? "").split("\n").length);
    }
  }
  return { events, total: Math.max(t, 300) };
}

/** Lines already on screen before step `index` begins. */
export function terminalHistory(steps: TerminalStep[], index: number): TermLine[] {
  let lines: TermLine[] = [];
  for (let i = 0; i < index; i++) {
    if (steps[i].clear) lines = [];
    lines = lines.concat(steps[i].lines);
  }
  if (steps[index]?.clear) lines = [];
  return lines;
}
