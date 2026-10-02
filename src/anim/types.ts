// Scene model for lesson animations.
//
// A scene is pure data. The engine (src/anim/Player.tsx) renders it and plays
// it step by step. There are five kinds of scene:
//
//   topology  devices + links, packets travel along links, tables update
//   sequence  ladder diagram: messages between actors, accumulating over time
//   layers    rows of labelled blocks (headers, stacks, planes) that change per step
//   bits      binary views of IPv4 addresses / bytes with a network|host split
//   terminal  a Cisco-style console where commands type out and output appears
//
// Every step has a bilingual `title` and `text` (see L in content/types.ts).

import type { L } from "../content/types.ts";

export type Tone = "blue" | "green" | "orange" | "red" | "purple" | "teal" | "pink" | "gray";

// ─── topology ──────────────────────────────────────────────────────────────

export type DeviceKind =
  | "pc"
  | "laptop"
  | "phone" // smartphone / tablet
  | "ipphone"
  | "printer"
  | "server"
  | "switch"
  | "l3switch"
  | "hub"
  | "router"
  | "firewall"
  | "ap"
  | "wlc"
  | "cloud" // a generic WAN / provider cloud
  | "internet"
  | "controller" // SDN controller / automation server
  | "attacker";

/** Canvas is 800 wide; height defaults to 400. Keep nodes 50+ units from every edge. */
export type TopoNode = {
  id: string;
  kind: DeviceKind;
  x: number;
  y: number;
  label: string;
  /** Small monospace line under the label, e.g. an IP address. */
  sub?: string;
  /** Optional second small line, e.g. a MAC address. */
  sub2?: string;
};

export type LinkStyle = "copper" | "fiber" | "wireless" | "serial" | "trunk" | "tunnel" | "bundle";

export type TopoLink = {
  id: string;
  a: string;
  b: string;
  /** Interface name drawn near end a, e.g. "Gi0/1". */
  aPort?: string;
  bPort?: string;
  style?: LinkStyle;
  /** Text at the middle of the link, e.g. "VLAN 10,20" or "10.0.12.0/30". */
  label?: string;
};

export type PacketSpec = {
  /** Node ids from source to destination. Every consecutive pair must be joined by a link. */
  path: string[];
  /** Short text on the packet, e.g. "ARP Request", "SYN", "Offer". Keep under ~16 chars. */
  label: string;
  tone?: Tone;
  /** Start delay, in hops. 0 = leave at step start, 1 = leave after one hop's time. */
  delay?: number;
  /** The packet is dropped/filtered at the last node of its path. */
  drop?: boolean;
};

export type TopoTable = {
  /** Node the table belongs to. */
  node: string;
  title: string;
  columns: string[];
  rows: string[][];
  /** Row indexes to highlight as new/changed in this step. */
  hl?: number[];
};

export type TopoStep = {
  title: L;
  text: L;
  packets?: PacketSpec[];
  /** Nodes to emphasise in this step (not carried forward). */
  focus?: string[];
  /** Carried forward. Set text to "" to remove a node's badge. */
  badges?: { node: string; text: string; tone?: Tone }[];
  /** Carried forward. Use state "normal" to clear. */
  links?: { id: string; state: "normal" | "active" | "blocked" | "down" | "dim"; note?: string }[];
  /** Carried forward per (node + title). A table with rows: [] is removed. */
  tables?: TopoTable[];
  /** Clear all carried-forward badges, link states and tables before applying this step. */
  reset?: boolean;
};

export type TopologyScene = {
  kind: "topology";
  id: string;
  title: L;
  /** Canvas height (width is always 800). Default 400, allowed 260-560. */
  height?: number;
  nodes: TopoNode[];
  links: TopoLink[];
  steps: TopoStep[];
};

// ─── sequence ──────────────────────────────────────────────────────────────

export type SeqActor = { id: string; label: string; kind?: DeviceKind; sub?: string };

export type SeqMessage = {
  from: string;
  to: string;
  label: string;
  /** Small monospace detail under the arrow, e.g. "src 0.0.0.0:68 → 255.255.255.255:67". */
  detail?: string;
  tone?: Tone;
  /** Dashed arrow, typically for replies. */
  dashed?: boolean;
  /** Message is lost / rejected before reaching `to`. */
  drop?: boolean;
};

export type SeqStep = {
  title: L;
  text: L;
  /** Messages added in this step. Earlier messages stay on screen (dimmed). */
  messages?: SeqMessage[];
  /** A note box on an actor's lifeline for this step. */
  note?: { actor: string; text: string };
};

export type SequenceScene = {
  kind: "sequence";
  id: string;
  title: L;
  /** 2 to 5 actors, left to right. */
  actors: SeqActor[];
  steps: SeqStep[];
};

// ─── layers ────────────────────────────────────────────────────────────────

export type LayerBlock = {
  /** Stable id: a block with the same id in the next step animates to its new place. */
  id: string;
  label: string;
  sub?: string;
  tone?: Tone;
  /** Relative width inside its row. Default 1. */
  w?: number;
};

export type LayerRow = { label?: string; blocks: LayerBlock[] };

export type LayersStep = {
  title: L;
  text: L;
  rows: LayerRow[];
  /** Block ids to emphasise. */
  focus?: string[];
  /** Name of the active entry in the scene's `stack`. */
  stackActive?: string;
};

export type LayersScene = {
  kind: "layers";
  id: string;
  title: L;
  /** Optional vertical stack shown on the left (e.g. OSI layer names, top to bottom). */
  stack?: string[];
  steps: LayersStep[];
};

// ─── bits ──────────────────────────────────────────────────────────────────

export type BitsRow = {
  label: string;
  /** Dotted-decimal IPv4 address or mask, rendered as 32 bits in 4 octets. */
  ip?: string;
  /** Or a raw bit string (spaces ignored), max 32 bits, e.g. "1100 0000". */
  bits?: string;
  /** Short text shown at the right of the row. */
  note?: string;
};

export type BitsStep = {
  title: L;
  text: L;
  rows: BitsRow[];
  /** Bits before this index are "network" (blue), the rest "host" (orange). Omit for no split. */
  prefix?: number;
  /** Inclusive bit-index range to emphasise, e.g. borrowed subnet bits [24, 25]. */
  mark?: [number, number];
  /** Show 128 64 32 16 8 4 2 1 above each octet. */
  placeValues?: boolean;
  /** Result panel, e.g. [{ label: "Network", value: "192.168.1.128/26" }]. */
  results?: { label: string; value: string }[];
};

export type BitsScene = { kind: "bits"; id: string; title: L; steps: BitsStep[] };

// ─── terminal ──────────────────────────────────────────────────────────────

export type TermLine = {
  /** e.g. "R1(config)#". Omit for output-only lines. */
  prompt?: string;
  cmd?: string;
  /** Output text; may contain \n for several lines. */
  out?: string;
};

export type TerminalStep = {
  title: L;
  text: L;
  /** Lines added in this step. Earlier lines stay on screen. */
  lines: TermLine[];
  /** Clear the screen before this step's lines. */
  clear?: boolean;
};

export type TerminalScene = {
  kind: "terminal";
  id: string;
  title: L;
  /** Window caption, e.g. "R1 — console". */
  device: string;
  steps: TerminalStep[];
};

export type Scene = TopologyScene | SequenceScene | LayersScene | BitsScene | TerminalScene;
