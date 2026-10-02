import { describe, expect, it } from "vitest";
import { HOP_MS, MSG_MS, stepDuration, terminalHistory, terminalTimeline, topoState } from "./engine";
import type { SequenceScene, TerminalScene, TopologyScene } from "./types";

const L = (s: string) => ({ en: s, hi: s });

const topo: TopologyScene = {
  kind: "topology",
  id: "t",
  title: L("t"),
  nodes: [
    { id: "a", kind: "pc", x: 100, y: 100, label: "A" },
    { id: "s", kind: "switch", x: 400, y: 100, label: "S" },
    { id: "b", kind: "pc", x: 700, y: 100, label: "B" },
  ],
  links: [
    { id: "l1", a: "a", b: "s" },
    { id: "l2", a: "s", b: "b" },
  ],
  steps: [
    { title: L("1"), text: L("1"), packets: [{ path: ["a", "s", "b"], label: "x" }], tables: [{ node: "s", title: "MAC", columns: ["mac", "port"], rows: [["a", "1"]] }], badges: [{ node: "s", text: "ROOT" }] },
    { title: L("2"), text: L("2"), links: [{ id: "l2", state: "blocked" }], packets: [{ path: ["b", "s"], label: "y", delay: 1 }] },
    { title: L("3"), text: L("3"), badges: [{ node: "s", text: "" }], tables: [{ node: "s", title: "MAC", columns: [], rows: [] }] },
    { title: L("4"), text: L("4"), reset: true },
  ],
};

describe("topology timing and state", () => {
  it("times a step by its slowest packet", () => {
    expect(stepDuration(topo, 0)).toBe(2 * HOP_MS + 250);
    expect(stepDuration(topo, 1)).toBe(2 * HOP_MS + 250);
    expect(stepDuration(topo, 2)).toBe(500);
  });

  it("shows a step's tables and badges only once its packets have arrived", () => {
    expect(topoState(topo, 0, false).tables.size).toBe(0);
    expect(topoState(topo, 0, true).tables.size).toBe(1);
    expect(topoState(topo, 0, true).badges.get("s")?.text).toBe("ROOT");
  });

  it("carries state forward, applies link changes at step start, and removes on request", () => {
    const s1 = topoState(topo, 1, false);
    expect(s1.tables.size).toBe(1);
    expect(s1.links.get("l2")?.state).toBe("blocked");
    const s2 = topoState(topo, 2, true);
    expect(s2.badges.size).toBe(0);
    expect(s2.tables.size).toBe(0);
    expect(s2.links.get("l2")?.state).toBe("blocked");
    const s3 = topoState(topo, 3, true);
    expect(s3.links.size).toBe(0);
  });
});

describe("sequence and terminal timing", () => {
  it("gives each sequence message its own slot", () => {
    const seq: SequenceScene = {
      kind: "sequence",
      id: "s",
      title: L("s"),
      actors: [
        { id: "a", label: "A" },
        { id: "b", label: "B" },
      ],
      steps: [{ title: L("1"), text: L("1"), messages: [{ from: "a", to: "b", label: "1" }, { from: "b", to: "a", label: "2" }] }],
    };
    expect(stepDuration(seq, 0)).toBe(2 * MSG_MS);
  });

  it("types commands in order and keeps earlier lines on screen", () => {
    const term: TerminalScene = {
      kind: "terminal",
      id: "x",
      title: L("x"),
      device: "R1",
      steps: [
        { title: L("1"), text: L("1"), lines: [{ prompt: "R1>", cmd: "enable" }, { out: "ok" }] },
        { title: L("2"), text: L("2"), lines: [{ prompt: "R1#", cmd: "show ip route" }] },
        { title: L("3"), text: L("3"), clear: true, lines: [{ prompt: "R1#", cmd: "" }] },
      ],
    };
    const tl = terminalTimeline(term.steps[0].lines);
    expect(tl.events[1].start).toBeGreaterThanOrEqual(tl.events[0].typeEnd);
    expect(terminalHistory(term.steps, 1)).toHaveLength(2);
    expect(terminalHistory(term.steps, 2)).toHaveLength(0);
  });
});
