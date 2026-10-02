// Hands-on CLI labs: definition format, building the network, and automatic task checks.

import type { L } from "../content/types.ts";
import { parseIp } from "../lib/subnet.ts";
import { newSession, run } from "./cli.ts";
import { makeHost, makeL3Switch, makeRouter, makeSwitch, type Device, type DeviceKind } from "./model.ts";
import { bundled, channelMembers, ifStatus, isL2, operMode, ospfNeighbors, ping, routingTables, spanningTree, tcpConnect, type Net } from "./net.ts";
import { runningConfig } from "./render.ts";

export type LabDevice = {
  id: string;
  kind: DeviceKind;
  hostname: string;
  /** Position in the topology drawing (canvas 800 wide). */
  x: number;
  y: number;
  /** Starting configuration, typed in global config mode. */
  config?: string[];
  /** PCs and servers: starting address settings. */
  host?: { ip?: string; prefix?: number; gateway?: string; dhcp?: boolean; services?: string[] };
  /** Shown in the drawing under the name, e.g. an address. */
  note?: string;
  /** Learners can't open this device (e.g. the ISP router). */
  locked?: boolean;
};

export type Check =
  | { t: "ping"; from: string; to: string; ok?: boolean }
  | { t: "tcp"; from: string; to: string; port: number; ok?: boolean }
  | { t: "config"; dev: string; has: string; not?: boolean; section?: string }
  | { t: "route"; dev: string; prefix: string; code?: string }
  | { t: "ospf"; dev: string; neighbors: number }
  | { t: "vlan"; dev: string; id: number; name?: string }
  | { t: "access"; dev: string; iface: string; vlan: number }
  | { t: "trunk"; dev: string; iface: string; native?: number; allowed?: number[] }
  | { t: "up"; dev: string; iface: string }
  | { t: "dhcp"; host: string }
  | { t: "stpRoot"; vlan: number; dev: string }
  | { t: "channel"; dev: string; group: number }
  | { t: "saved"; dev: string };

export type LabTask = { text: L; hint: L; check: Check | Check[] };

export type CliLab = {
  id: string;
  title: L;
  level: "beginner" | "intermediate" | "advanced";
  kind: "build" | "troubleshoot" | "challenge";
  minutes: number;
  /** Lessons this lab practises. */
  lessons: string[];
  scenario: L;
  devices: LabDevice[];
  /** [deviceA, interfaceA, deviceB, interfaceB] with full interface names. */
  links: [string, string, string, string][];
  /** Drawing height (default 360). */
  height?: number;
  tasks: LabTask[];
  /** Commands that solve the lab, per device. Routers/switches: typed in global config. PCs: at C:\>. */
  solution: Record<string, string[]>;
  /** Short notes shown after completion: what to remember. */
  debrief?: L;
};

const IP = (s: string) => {
  const v = parseIp(s);
  if (v === null) throw new Error(`bad IP ${s}`);
  return v;
};

/** Build a fresh network for a lab, with its starting configuration applied. */
export function buildLab(lab: CliLab): Net {
  const devices: Record<string, Device> = {};
  for (const d of lab.devices) {
    const dev =
      d.kind === "router" ? makeRouter(d.id, d.hostname) : d.kind === "switch" ? makeSwitch(d.id, d.hostname) : d.kind === "l3switch" ? makeL3Switch(d.id, d.hostname) : makeHost(d.id, d.kind, d.hostname, d.host?.services ?? []);
    if (dev.host && d.host) {
      if (d.host.ip) dev.host.ip = IP(d.host.ip);
      if (d.host.prefix !== undefined) dev.host.prefix = d.host.prefix;
      if (d.host.gateway) dev.host.gateway = IP(d.host.gateway);
      dev.host.dhcp = Boolean(d.host.dhcp);
    }
    devices[d.id] = dev;
  }
  const net: Net = { devices, links: lab.links.map(([a, ai, b, bi]) => ({ a: [a, ai], b: [b, bi] })) };
  for (const d of lab.devices) {
    if (!d.config?.length) continue;
    const s = newSession(net, d.id);
    run(s, "enable");
    run(s, "configure terminal");
    for (const line of d.config) {
      const out = run(s, line).output;
      if (/^%\s*(Invalid|Incomplete|Ambiguous)|\^\n%/.test(out)) throw new Error(`Lab ${lab.id} ${d.id}: starting config "${line}" failed: ${out}`);
    }
    run(s, "end");
    // Logs from the setup are not news to the learner.
    devices[d.id].log = [];
  }
  return net;
}

function section(cfg: string, header: string) {
  const lines = cfg.split("\n");
  const i = lines.findIndex((l) => l.trim().toLowerCase() === header.trim().toLowerCase());
  if (i < 0) return "";
  const out = [lines[i]];
  for (let k = i + 1; k < lines.length && /^\s/.test(lines[k]); k++) out.push(lines[k]);
  return out.join("\n");
}

export function evalCheck(net: Net, c: Check): boolean {
  switch (c.t) {
    case "ping":
      return ping(net, c.from, IP(c.to), false).ok === (c.ok ?? true);
    case "tcp":
      return tcpConnect(net, c.from, IP(c.to), c.port, false).ok === (c.ok ?? true);
    case "config": {
      const d = net.devices[c.dev];
      let text = runningConfig(d);
      if (c.section) text = section(text, c.section);
      const hit = new RegExp(c.has, "im").test(text);
      return c.not ? !hit : hit;
    }
    case "route": {
      const [p, len] = c.prefix.split("/");
      return (routingTables(net)[c.dev] ?? []).some((r) => r.prefix >>> 0 === IP(p) >>> 0 && r.len === Number(len) && (!c.code || r.code === c.code));
    }
    case "ospf":
      return (ospfNeighbors(net)[c.dev] ?? []).filter((n) => n.state.startsWith("FULL")).length >= c.neighbors;
    case "vlan": {
      const v = net.devices[c.dev].vlans[c.id];
      return Boolean(v && (!c.name || v.name.toLowerCase() === c.name.toLowerCase()));
    }
    case "access": {
      const d = net.devices[c.dev];
      const i = d.ifaces[c.iface];
      return Boolean(i && isL2(d, i) && i.mode === "access" && i.accessVlan === c.vlan);
    }
    case "trunk": {
      const d = net.devices[c.dev];
      const i = d.ifaces[c.iface];
      if (!i || !ifStatus(net, c.dev, c.iface).up || operMode(net, c.dev, c.iface) !== "trunk") return false;
      if (c.native !== undefined && i.nativeVlan !== c.native) return false;
      if (c.allowed && JSON.stringify([...(i.allowed ?? [])].sort((a, b) => a - b)) !== JSON.stringify([...c.allowed].sort((a, b) => a - b))) return false;
      return true;
    }
    case "up":
      return ifStatus(net, c.dev, c.iface).up;
    case "dhcp": {
      const h = net.devices[c.host].host;
      return Boolean(h?.dhcp && h.ip !== undefined);
    }
    case "stpRoot":
      return spanningTree(net, c.vlan)[c.dev]?.rootDev === c.dev;
    case "channel": {
      const d = net.devices[c.dev];
      const members = channelMembers(d, c.group);
      return members.length >= 2 && members.every((m) => bundled(net, c.dev, m.name));
    }
    case "saved": {
      const d = net.devices[c.dev];
      return Boolean(d.startup) && d.startup!.split("\n").slice(-40).join("\n").length > 0 && runningConfig(d).replace(/^[\s\S]*?\n!/, "") === (d.startup ?? "").replace(/^[\s\S]*?\n!/, "");
    }
  }
}

export function taskDone(net: Net, task: LabTask) {
  const checks = Array.isArray(task.check) ? task.check : [task.check];
  return checks.every((c) => {
    try {
      return evalCheck(net, c);
    } catch {
      return false;
    }
  });
}

/** Apply a lab's solution through the CLI exactly as a learner would type it. Returns problems found. */
export function applySolution(net: Net, lab: CliLab): string[] {
  const problems: string[] = [];
  for (const [dev, lines] of Object.entries(lab.solution)) {
    const s = newSession(net, dev);
    const isHost = Boolean(net.devices[dev].host);
    if (!isHost) {
      run(s, "enable");
      run(s, "configure terminal");
    }
    for (const line of lines) {
      const out = run(s, line).output;
      if (s.pending) run(s, ""); // accept defaults ([confirm], file names)
      if (/% (Invalid|Incomplete|Ambiguous)|^Invalid Command|Bad mask|overlaps with/m.test(out)) problems.push(`${dev}: "${line}" -> ${out.split("\n").pop()}`);
    }
    if (!isHost) run(s, "end");
  }
  return problems;
}
