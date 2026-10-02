// A small command grammar in the style of Cisco IOS: keyword prefixes ("conf t"), typed arguments,
// ambiguity and "invalid input" detection, and "?" help.
//
// Pattern syntax, space separated:
//   word              keyword
//   {name:a|b|c}      one of several keywords, captured as `name`
//   <type:name>       argument; types: word line int ip iface ifrange vlanlist ipv6 wild
//   <int:name:1-4094> integer with a range
//   [elem]            optional (only at the end of a pattern)

import { parseIfName, parseIfRange } from "./names.ts";
import { parseIp } from "../lib/subnet.ts";

export type ArgType = "word" | "line" | "int" | "ip" | "iface" | "ifrange" | "vlanlist" | "ipv6";
type El =
  | { k: "kw"; word: string; opt: boolean }
  | { k: "choice"; name: string; words: string[]; opt: boolean }
  | { k: "arg"; type: ArgType; name: string; min?: number; max?: number; opt: boolean };

export type Args = Record<string, any>;

export type Spec<C> = {
  pattern: string;
  els: El[];
  run?: (c: C, a: Args) => string | void;
  no?: (c: C, a: Args) => string | void;
};

export function compile(pattern: string): El[] {
  return pattern.split(/\s+/).map((raw) => {
    const opt = raw.startsWith("[") && raw.endsWith("]");
    const t = opt ? raw.slice(1, -1) : raw;
    if (t.startsWith("{")) {
      const [name, words] = t.slice(1, -1).split(":");
      return { k: "choice", name, words: words.split("|"), opt };
    }
    if (t.startsWith("<")) {
      const [type, name, range] = t.slice(1, -1).split(":");
      const [min, max] = range ? range.split("-").map(Number) : [];
      return { k: "arg", type: type as ArgType, name, min, max, opt };
    }
    return { k: "kw", word: t, opt };
  });
}

export const HELP: Record<string, string> = {
  enable: "Turn on privileged commands",
  disable: "Turn off privileged commands",
  configure: "Enter configuration mode",
  terminal: "Configure from the terminal",
  show: "Show running system information",
  ping: "Send echo messages",
  traceroute: "Trace route to destination",
  copy: "Copy from one file to another",
  write: "Write running configuration to memory",
  memory: "Write to NV memory",
  reload: "Halt and perform a cold restart",
  exit: "Exit from the EXEC",
  logout: "Exit from the EXEC",
  end: "Exit to privileged EXEC mode",
  do: "To run exec commands in config mode",
  no: "Negate a command or set its defaults",
  hostname: "Set system's network name",
  interface: "Select an interface to configure",
  line: "Configure a terminal line",
  vlan: "Vlan commands",
  name: "Ascii name of the VLAN",
  ip: "Global IP configuration subcommands",
  ipv6: "IPv6 configuration commands",
  router: "Enable a routing process",
  "access-list": "Add an access list entry",
  "spanning-tree": "Spanning Tree Subsystem",
  service: "Modify use of network based services",
  "password-encryption": "Encrypt system passwords",
  banner: "Define a login banner",
  username: "Establish User Name Authentication",
  crypto: "Encryption module",
  ntp: "Configure NTP",
  logging: "Modify message logging facilities",
  "snmp-server": "Modify SNMP engine parameters",
  cdp: "Global CDP configuration subcommands",
  lldp: "Global LLDP configuration subcommands",
  description: "Interface specific description",
  shutdown: "Shutdown the selected interface",
  switchport: "Set switching mode characteristics",
  "channel-group": "Etherchannel/port bundling configuration",
  encapsulation: "Set encapsulation type for an interface",
  duplex: "Configure duplex operation.",
  speed: "Configure speed operation.",
  password: "Set a password",
  login: "Enable password checking",
  transport: "Define transport protocols for line",
  "exec-timeout": "Set the EXEC timeout",
  "access-class": "Filter connections based on an IP access list",
  "router-id": "router-id for this OSPF process",
  network: "Enable routing on an IP network",
  "passive-interface": "Suppress routing updates on an interface",
  "default-information": "Control distribution of default information",
  "auto-cost": "Calculate OSPF interface cost according to bandwidth",
  "default-router": "Default routers",
  "dns-server": "DNS servers",
  "domain-name": "Domain name",
  remark: "Access list entry comment",
  permit: "Specify packets to forward",
  deny: "Specify packets to reject",
  running: "Current operating configuration",
  "running-config": "Current operating configuration",
  "startup-config": "Contents of startup configuration",
  version: "System hardware and software status",
  interfaces: "Interface status and configuration",
  brief: "Brief summary of IP status and configuration",
  route: "IP routing table",
  ospf: "OSPF information",
  neighbor: "Neighbor list",
  "mac-address-table": "MAC forwarding table",
  "mac address-table": "MAC forwarding table",
  etherchannel: "EtherChannel information",
  "port-security": "Show secure port information",
  arp: "ARP table",
  nat: "NAT configuration",
  translations: "Translation entries",
  dhcp: "Show items in the DHCP database",
  binding: "DHCP address bindings",
  pool: "DHCP pools information",
  trunk: "Show interface trunk information",
  status: "Show interface line status",
  protocols: "IP routing protocol process parameters and statistics",
  clock: "Display the system clock",
  history: "Display the session command history",
  ssh: "Open a secure shell client connection",
  telnet: "Open a telnet connection",
};

export type Match = {
  spec: number;
  complete: boolean;
  /** Token index where matching failed (tokens.length if all consumed). */
  failAt: number;
  args: Args;
  /** For each token: keywords the token could be at that position (for ambiguity checks). */
  kwAt: string[][];
  exact: number;
};

function argOk(el: Extract<El, { k: "arg" }>, toks: string[], i: number): { used: number; value: any } | null {
  const t = toks[i];
  if (t === undefined) return null;
  switch (el.type) {
    case "word":
      return { used: 1, value: t };
    case "line":
      return { used: toks.length - i, value: toks.slice(i).join(" ") };
    case "int": {
      if (!/^\d+$/.test(t)) return null;
      const n = Number(t);
      if ((el.min !== undefined && n < el.min) || (el.max !== undefined && n > el.max)) return null;
      return { used: 1, value: n };
    }
    case "ip": {
      const v = parseIp(t);
      return v === null ? null : { used: 1, value: v };
    }
    case "iface": {
      const r = parseIfName(toks.slice(i));
      return r ? { used: r.used, value: r.name } : null;
    }
    case "ifrange": {
      const r = parseIfRange(toks.slice(i).join(" "));
      return r ? { used: toks.length - i, value: r } : null;
    }
    case "vlanlist": {
      if (!/^\d+(-\d+)?(,\d+(-\d+)?)*$/.test(t)) return null;
      const out: number[] = [];
      for (const part of t.split(",")) {
        const [a, b] = part.split("-").map(Number);
        for (let v = a; v <= (b ?? a); v++) out.push(v);
      }
      return out.every((v) => v >= 1 && v <= 4094) ? { used: 1, value: out } : null;
    }
    case "ipv6":
      return /^[0-9a-f:]+(\/\d{1,3})?$/i.test(t) && t.includes(":") ? { used: 1, value: t } : null;
  }
}

export function match(els: El[], toks: string[], specIdx: number): Match {
  const args: Args = {};
  const kwAt: string[][] = [];
  let i = 0;
  let exact = 0;
  for (const el of els) {
    if (i >= toks.length) {
      if (el.opt) continue;
      return { spec: specIdx, complete: false, failAt: i, args, kwAt, exact };
    }
    const t = toks[i].toLowerCase();
    if (el.k === "kw") {
      const w = el.word.toLowerCase();
      kwAt[i] = w.startsWith(t) ? [w] : [];
      if (!w.startsWith(t)) {
        if (el.opt) return { spec: specIdx, complete: false, failAt: i, args, kwAt, exact };
        return { spec: specIdx, complete: false, failAt: i, args, kwAt, exact };
      }
      if (w === t) exact++;
      i++;
    } else if (el.k === "choice") {
      const hits = el.words.filter((w) => w.toLowerCase().startsWith(t));
      kwAt[i] = hits.map((w) => w.toLowerCase());
      const pick = hits.length === 1 ? hits[0] : el.words.find((w) => w.toLowerCase() === t);
      if (!pick) return { spec: specIdx, complete: false, failAt: i, args, kwAt, exact };
      if (pick.toLowerCase() === t) exact++;
      args[el.name] = pick;
      i++;
    } else {
      const r = argOk(el, toks, i);
      kwAt[i] = [];
      if (!r) return { spec: specIdx, complete: false, failAt: i, args, kwAt, exact };
      args[el.name] = r.value;
      i += r.used;
    }
  }
  if (i < toks.length) return { spec: specIdx, complete: false, failAt: i, args, kwAt, exact };
  return { spec: specIdx, complete: true, failAt: i, args, kwAt, exact };
}

export type Resolution<C> =
  | { kind: "run"; spec: Spec<C>; args: Args }
  | { kind: "ambiguous" }
  | { kind: "incomplete" }
  | { kind: "invalid"; at: number };

/** Pick the command a line refers to, IOS-style. */
export function resolve<C>(specs: Spec<C>[], toks: string[]): Resolution<C> {
  const compiled = specs.map((s, i) => match(s.els, toks, i));
  // Ambiguity: at some position the token is a prefix of two or more different keywords,
  // among specs that agree on everything before it.
  for (let pos = 0; pos < toks.length; pos++) {
    const words = new Set<string>();
    for (const m of compiled) if (m.failAt >= pos && m.kwAt[pos]) m.kwAt[pos].forEach((w) => words.add(w));
    for (const m of compiled) if (m.failAt === pos && m.kwAt[pos]) m.kwAt[pos].forEach((w) => words.add(w));
    if (words.size > 1 && ![...words].includes(toks[pos].toLowerCase())) {
      const live = compiled.filter((m) => m.failAt > pos || (m.failAt === pos && (m.kwAt[pos]?.length ?? 0) > 0));
      if (live.length > 1) return { kind: "ambiguous" };
    }
  }
  const full = compiled.filter((m) => m.complete).sort((a, b) => b.exact - a.exact);
  if (full.length) return { kind: "run", spec: specs[full[0].spec], args: full[0].args };
  const furthest = Math.max(...compiled.map((m) => m.failAt), 0);
  if (compiled.some((m) => !m.complete && m.failAt === toks.length && m.failAt === furthest)) return { kind: "incomplete" };
  return { kind: "invalid", at: furthest };
}

const ARG_HELP: Record<ArgType, string> = {
  word: "WORD",
  line: "LINE",
  int: "<number>",
  ip: "A.B.C.D",
  iface: "Interface",
  ifrange: "Interface range",
  vlanlist: "WORD",
  ipv6: "X:X:X:X::X/<0-128>",
};

/** "?" help: what can come next after `toks`, or which keywords complete a partial last token. */
export function help<C>(specs: Spec<C>[], toks: string[], partial: string | null): string[] {
  const out = new Map<string, string>();
  let cr = false;
  for (const [i, s] of specs.entries()) {
    const m = match(s.els, toks, i);
    if (!(m.complete || m.failAt === toks.length)) continue;
    // Find the element at position toks.length
    let pos = 0;
    let elIdx = 0;
    const els = s.els;
    for (; elIdx < els.length && pos < toks.length; elIdx++) {
      const el = els[elIdx];
      if (el.k === "arg") {
        const r = argOk(el, toks, pos);
        pos += r?.used ?? 1;
      } else pos++;
    }
    if (pos !== toks.length) continue;
    const el = els[elIdx];
    if (!el) {
      cr = true;
      continue;
    }
    if (el.opt) cr = cr || els.slice(elIdx).every((e) => e.opt);
    if (el.k === "kw") out.set(el.word, HELP[el.word] ?? "");
    else if (el.k === "choice") el.words.forEach((w) => out.set(w, HELP[w] ?? ""));
    else out.set(el.type === "int" && el.min !== undefined ? `<${el.min}-${el.max}>` : ARG_HELP[el.type], el.name.replace(/-/g, " "));
  }
  if (partial !== null) {
    return [[...out.keys()].filter((k) => k.startsWith(partial.toLowerCase()) && !k.startsWith("<") && k === k.toLowerCase()).sort().join("  ")];
  }
  const lines = [...out.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => `  ${k.padEnd(18)}${v}`);
  if (cr) lines.push("  <cr>");
  return lines;
}

/** Tab completion of the last token, when it is unambiguous. */
export function complete<C>(specs: Spec<C>[], toks: string[], partial: string): string | null {
  const words = help(specs, toks, partial)[0]?.split(/\s+/).filter(Boolean) ?? [];
  return words.length === 1 ? words[0] : null;
}
