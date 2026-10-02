// Cisco IOS command line for the simulator: modes, commands, prompts, and PC command prompts.

import { ipToString, maskFromPrefix } from "../lib/subnet.ts";
import { compile, complete as completeTok, help as helpFor, resolve, type Args, type Spec } from "./grammar.ts";
import { macOf, newIface, type Ace, type Acl, type Device, type Iface, type Line } from "./model.ts";
import { compareIf, ifTypeOf, parentOf, shortName } from "./names.ts";
import { dhcpRequest, ifStatus, isL2, l3Ifaces, ospfNeighbors, ping, physUp, peerOf, tcpConnect, topology, routingTables, forward, newCtx, type Net } from "./net.ts";
import * as show from "./render.ts";

export type Mode = "user" | "priv" | "config" | "if" | "subif" | "if-range" | "line" | "vlan" | "router" | "dhcp" | "nacl-std" | "nacl-ext";

type Frame = { dev: string; mode: Mode; via?: string };

export type Session = {
  net: Net;
  dev: string;
  mode: Mode;
  ifaces: string[];
  line?: "con" | "vty";
  vlans: number[];
  ospf?: number;
  pool?: string;
  acl?: string;
  /** Waiting for a password or a confirmation. */
  pending?: { prompt: string; secret: boolean; then: (input: string) => string };
  /** Remote sessions (ssh/telnet) stack on top of the console session. */
  stack: Frame[];
  history: string[];
};

export type Result = { output: string; /** Text to put back in the input after "?" help. */ keep?: string };

const ip = ipToString;
const prefixFromMask = (m: number) => {
  const bits = (m >>> 0).toString(2).padStart(32, "0");
  return /^1*0*$/.test(bits) ? bits.indexOf("0") === -1 ? 32 : bits.indexOf("0") : null;
};

export function newSession(net: Net, dev: string): Session {
  return { net, dev, mode: net.devices[dev].host ? "priv" : "user", ifaces: [], vlans: [], stack: [], history: [] };
}

export function device(s: Session): Device {
  return s.net.devices[s.dev];
}

export function prompt(s: Session): string {
  if (s.pending) return s.pending.prompt;
  const d = device(s);
  if (d.host) return "C:\\>";
  const h = d.hostname;
  switch (s.mode) {
    case "user":
      return `${h}>`;
    case "priv":
      return `${h}#`;
    case "config":
      return `${h}(config)#`;
    case "if":
      return `${h}(config-if)#`;
    case "subif":
      return `${h}(config-subif)#`;
    case "if-range":
      return `${h}(config-if-range)#`;
    case "line":
      return `${h}(config-line)#`;
    case "vlan":
      return `${h}(config-vlan)#`;
    case "router":
      return `${h}(config-router)#`;
    case "dhcp":
      return `${h}(dhcp-config)#`;
    case "nacl-std":
      return `${h}(config-std-nacl)#`;
    case "nacl-ext":
      return `${h}(config-ext-nacl)#`;
  }
}

const isSwitch = (d: Device) => d.kind === "switch" || d.kind === "l3switch";
const INVALID = "% Invalid input detected at '^' marker.";

// ─── ACL entry parsing ────────────────────────────────────────────────────

const PORTS: Record<string, number> = { "ftp-data": 20, ftp: 21, ssh: 22, telnet: 23, smtp: 25, domain: 53, bootps: 67, bootpc: 68, tftp: 69, www: 80, http: 80, pop3: 110, ntp: 123, snmp: 161, https: 443 };

/** Parse "permit tcp 10.1.1.0 0.0.0.255 host 10.2.2.2 eq 80" style text. Returns the entry or the token index that failed. */
export function parseAce(type: "standard" | "extended", toks: string[]): Omit<Ace, "seq" | "hits"> | { failAt: number } {
  let i = 0;
  const action = toks[i]?.toLowerCase();
  if (action !== "permit" && action !== "deny") return { failAt: 0 };
  i++;
  const addr = (): { ip: number; wc: number } | null => {
    const t = toks[i]?.toLowerCase();
    if (t === "any") {
      i++;
      return { ip: 0, wc: 0xffffffff };
    }
    if (t === "host") {
      const v = parseDot(toks[i + 1]);
      if (v === null) return null;
      i += 2;
      return { ip: v, wc: 0 };
    }
    const a = parseDot(toks[i]);
    if (a === null) return null;
    const w = parseDot(toks[i + 1]);
    if (w === null) {
      // Standard ACLs accept a bare address as a host.
      if (type === "standard") {
        i++;
        return { ip: a, wc: 0 };
      }
      return null;
    }
    i += 2;
    return { ip: (a & ~w) >>> 0, wc: w };
  };
  if (type === "standard") {
    const src = addr();
    if (!src) return { failAt: i };
    let log = false;
    if (toks[i]?.toLowerCase() === "log") {
      log = true;
      i++;
    }
    if (i < toks.length) return { failAt: i };
    return { action, src, log };
  }
  const proto = toks[i]?.toLowerCase();
  if (!["ip", "tcp", "udp", "icmp"].includes(proto)) return { failAt: i };
  i++;
  const src = addr();
  if (!src) return { failAt: i };
  const portSpec = () => {
    const op = toks[i]?.toLowerCase();
    if (!["eq", "neq", "gt", "lt", "range"].includes(op)) return undefined;
    const p1 = portNum(toks[i + 1]);
    if (p1 === null) return null;
    if (op === "range") {
      const p2 = portNum(toks[i + 2]);
      if (p2 === null) return null;
      i += 3;
      return { op: op as "range", ports: [p1, p2] };
    }
    i += 2;
    return { op: op as "eq", ports: [p1] };
  };
  let srcPort, dstPort;
  if (proto === "tcp" || proto === "udp") {
    srcPort = portSpec();
    if (srcPort === null) return { failAt: i };
  }
  const dst = addr();
  if (!dst) return { failAt: i };
  if (proto === "tcp" || proto === "udp") {
    dstPort = portSpec();
    if (dstPort === null) return { failAt: i };
  }
  let established = false;
  let icmpType: string | undefined;
  let log = false;
  while (i < toks.length) {
    const t = toks[i].toLowerCase();
    if (t === "established" && proto === "tcp") established = true;
    else if (proto === "icmp" && ["echo", "echo-reply", "unreachable"].includes(t)) icmpType = t;
    else if (t === "log") log = true;
    else return { failAt: i };
    i++;
  }
  return { action, proto: proto as Ace["proto"], src, dst, srcPort: srcPort ?? undefined, dstPort: dstPort ?? undefined, established, icmpType, log };
}

function parseDot(t: string | undefined) {
  if (!t || !/^\d{1,3}(\.\d{1,3}){3}$/.test(t)) return null;
  const parts = t.split(".").map(Number);
  if (parts.some((p) => p > 255)) return null;
  return parts.reduce((n, o) => n * 256 + o, 0) >>> 0;
}

function portNum(t: string | undefined) {
  if (!t) return null;
  if (/^\d+$/.test(t) && Number(t) <= 65535) return Number(t);
  return PORTS[t.toLowerCase()] ?? null;
}

function aclFor(d: Device, name: string, type: "standard" | "extended", numbered: boolean): Acl {
  return (d.acls[name] ??= { name, type, numbered, entries: [] });
}

function addAce(acl: Acl, entry: Omit<Ace, "seq" | "hits">, seq?: number) {
  const next = seq ?? (acl.entries.length ? Math.max(...acl.entries.map((e) => e.seq)) + 10 : 10);
  acl.entries.push({ ...entry, seq: next, hits: 0 });
  acl.entries.sort((a, b) => a.seq - b.seq);
}

// ─── Interface helpers ────────────────────────────────────────────────────

function targetIfaces(s: Session): Iface[] {
  const d = device(s);
  return s.ifaces.map((n) => d.ifaces[n]).filter(Boolean);
}

function ensureVlan(d: Device, v: number): string | void {
  if (!d.vlans[v]) {
    d.vlans[v] = { name: `VLAN${String(v).padStart(4, "0")}` };
    return `% Access VLAN does not exist. Creating vlan ${v}`;
  }
}

function linkEvents(s: Session, before: Record<string, boolean>) {
  const out: string[] = [];
  for (const [name, wasUp] of Object.entries(before)) {
    const st = ifStatus(s.net, s.dev, name);
    const nowUp = st.up;
    if (nowUp === wasUp) continue;
    if (ifTypeOf(name) === "Vlan" || parentOf(name)) {
      out.push(`%LINEPROTO-5-UPDOWN: Line protocol on Interface ${name}, changed state to ${nowUp ? "up" : "down"}`);
      continue;
    }
    out.push(st.status === "administratively down" ? `%LINK-5-CHANGED: Interface ${name}, changed state to administratively down` : `%LINK-3-UPDOWN: Interface ${name}, changed state to ${nowUp ? "up" : "down"}`);
    out.push(`%LINEPROTO-5-UPDOWN: Line protocol on Interface ${name}, changed state to ${nowUp ? "up" : "down"}`);
  }
  return out;
}

/** Snapshot interface states and OSPF neighbours, run a change, then print what changed. */
function withEvents(s: Session, fn: () => string | void): string {
  const d = device(s);
  const before: Record<string, boolean> = {};
  for (const n of Object.keys(d.ifaces)) before[n] = ifStatus(s.net, s.dev, n).up;
  const hasOspf = Object.keys(d.ospf).length > 0;
  const nb0 = hasOspf ? new Set((ospfNeighbors(s.net)[s.dev] ?? []).filter((n) => n.state.startsWith("FULL")).map((n) => `${n.neighborId}|${n.iface}`)) : new Set<string>();
  const out = fn();
  const lines: string[] = out ? [out] : [];
  // A switch with BPDU Guard err-disables a port that hears another switch.
  for (const [id, dev] of Object.entries(s.net.devices)) {
    if (!isSwitch(dev)) continue;
    for (const i of Object.values(dev.ifaces)) {
      if (!i.bpduguard || i.errDisabled || i.shutdown) continue;
      const p = peerOf(s.net, id, i.name);
      if (p && isSwitch(s.net.devices[p[0]]) && !s.net.devices[p[0]].ifaces[p[1]].shutdown) {
        i.errDisabled = "bpduguard";
        if (id === s.dev) lines.push(`%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port ${shortName(i.name)} with BPDU Guard enabled. Disabling port.`, `%PM-4-ERR_DISABLE: bpduguard error detected on ${shortName(i.name)}, putting ${shortName(i.name)} in err-disable state`);
      }
    }
  }
  lines.push(...linkEvents(s, before));
  if (Object.keys(d.ospf).length) {
    const nb1 = (ospfNeighbors(s.net)[s.dev] ?? []).filter((n) => n.state.startsWith("FULL"));
    for (const n of nb1) if (!nb0.has(`${n.neighborId}|${n.iface}`)) lines.push(`%OSPF-5-ADJCHG: Process ${Object.keys(d.ospf)[0]}, Nbr ${ip(n.neighborId)} on ${n.iface} from LOADING to FULL, Loading Done`);
    const now = new Set(nb1.map((n) => `${n.neighborId}|${n.iface}`));
    for (const k of nb0) if (!now.has(k)) {
      const [rid, iface] = k.split("|");
      lines.push(`%OSPF-5-ADJCHG: Process ${Object.keys(d.ospf)[0]}, Nbr ${ip(Number(rid))} on ${iface} from FULL to DOWN, Neighbor Down: Interface down or detached`);
    }
  }
  return lines.join("\n");
}

// ─── Exec-mode handlers ───────────────────────────────────────────────────

function doPing(s: Session, dst: number) {
  const r = ping(s.net, s.dev, dst, true);
  return [
    "Type escape sequence to abort.",
    `Sending 5, 100-byte ICMP Echos to ${ip(dst)}, timeout is 2 seconds:`,
    r.marks,
    `Success rate is ${(r.marks.split("!").length - 1) * 20} percent (${r.marks.split("!").length - 1}/5)${r.ok ? ", round-trip min/avg/max = 1/1/4 ms" : ""}`,
  ].join("\n");
}

function doTrace(s: Session, dst: number, windows: boolean) {
  const ctx = newCtx(s.net);
  const t = forward(s.net, s.dev, { src: 0, dst, proto: "icmp", icmpType: "echo" }, false, ctx);
  const hopIps: string[] = [];
  for (let k = 1; k < t.hops.length; k++) {
    const prev = t.hops[k - 1];
    const cur = t.hops[k];
    // The address a hop answers from: its interface on the segment shared with the previous hop.
    const topo = ctx.topo;
    const mine = l3Ifaces(s.net, cur).find((i) => l3Ifaces(s.net, prev).some((p) => topo.segOf(prev, p.name) === topo.segOf(cur, i.name)));
    hopIps.push(mine ? ip(k === t.hops.length - 1 && t.ok ? dst : mine.ip) : "*");
  }
  if (windows) {
    const lines = ["", `Tracing route to ${ip(dst)} over a maximum of 30 hops: `, ""];
    hopIps.forEach((h, k) => lines.push(`  ${k + 1}   0 ms      0 ms      1 ms      ${h}`));
    if (!t.ok) for (let k = hopIps.length; k < hopIps.length + 3; k++) lines.push(`  ${k + 1}   *         *         *         Request timed out.`);
    lines.push("", "Trace complete.");
    return lines.join("\n");
  }
  const lines = ["Type escape sequence to abort.", `Tracing the route to ${ip(dst)}`, "VRF info: (vrf in name/id, vrf out name/id)"];
  hopIps.forEach((h, k) => lines.push(`  ${k + 1} ${h} 0 msec 1 msec 0 msec`));
  if (!t.ok) for (let k = hopIps.length; k < hopIps.length + 3; k++) lines.push(`  ${k + 1}  *  *  *`);
  return lines.join("\n");
}

function snapshot(d: Device) {
  const copy: Partial<Device> = { ...d };
  delete copy.startup;
  return JSON.stringify(copy);
}

function connectRemote(s: Session, dst: number, proto: "ssh" | "telnet", user?: string): string {
  const port = proto === "ssh" ? 22 : 23;
  const r = tcpConnect(s.net, s.dev, dst, port, true);
  if (!r.ok) return proto === "ssh" ? "% Connection refused by remote host" : `Trying ${ip(dst)} ...\n% Connection timed out; remote host not responding`;
  const target = Object.entries(s.net.devices).find(([, d]) => l3Ifaces(s.net, d.id).some((i) => i.ip >>> 0 === dst >>> 0));
  if (!target) return "% Connection refused by remote host";
  const [tid, td] = target;
  const vty = td.lines.vty;
  const enter = (privileged: boolean) => {
    s.stack.push({ dev: s.dev, mode: s.mode, via: ip(dst) });
    s.dev = tid;
    s.mode = privileged ? "priv" : "user";
    return td.bannerMotd ? `\n${td.bannerMotd}\n` : "";
  };
  const askPassword = (check: (pw: string) => boolean, privileged: () => boolean) => {
    let tries = 0;
    const ask = (): string => {
      s.pending = {
        prompt: "Password: ",
        secret: true,
        then: (pw) => {
          s.pending = undefined;
          if (check(pw)) return enter(privileged());
          if (++tries >= 3) return "% Bad passwords\n\n[Connection to " + ip(dst) + " closed by foreign host]";
          ask();
          return "% Login invalid";
        },
      };
      return "";
    };
    return ask();
  };
  if (vty.login === "local" || proto === "ssh") {
    const u = user ?? "";
    if (proto === "ssh" && !u) return "% No user specified. Use: ssh -l <username> <address>";
    const banner = td.bannerMotd ? `${td.bannerMotd}\n` : "";
    void banner;
    return askPassword((pw) => Boolean(td.users[u] && (td.users[u].secret ?? td.users[u].password) === pw), () => (td.users[u]?.privilege ?? 1) >= 15);
  }
  if (vty.login === "login") {
    if (!vty.password) return "Password required, but none set\n\n[Connection to " + ip(dst) + " closed by foreign host]";
    return `Trying ${ip(dst)} ... Open\n\nUser Access Verification\n` + askPassword((pw) => pw === vty.password, () => false);
  }
  return enter(false);
}

function closeRemote(s: Session): string | null {
  const f = s.stack.pop();
  if (!f) return null;
  s.dev = f.dev;
  s.mode = f.mode;
  s.ifaces = [];
  return `\n[Connection to ${f.via} closed by foreign host]`;
}

function pipeFilter(text: string, pipe: string): string {
  const m = pipe.match(/^\s*(include|inc|i|exclude|exc|e|begin|beg|b|section|sec|s)\s+(.+)$/i);
  if (!m) return text;
  const kind = m[1].toLowerCase()[0] === "s" ? "section" : m[1].toLowerCase()[0] === "e" ? "exclude" : m[1].toLowerCase()[0] === "b" ? "begin" : "include";
  let re: RegExp;
  try {
    re = new RegExp(m[2].trim(), "i");
  } catch {
    re = new RegExp(m[2].trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  }
  const lines = text.split("\n");
  if (kind === "include") return lines.filter((l) => re.test(l)).join("\n");
  if (kind === "exclude") return lines.filter((l) => !re.test(l)).join("\n");
  if (kind === "begin") {
    const i = lines.findIndex((l) => re.test(l));
    return i < 0 ? "" : lines.slice(i).join("\n");
  }
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s/.test(lines[i]) && re.test(lines[i])) {
      out.push(lines[i]);
      while (i + 1 < lines.length && /^\s/.test(lines[i + 1])) out.push(lines[++i]);
    }
  }
  return out.join("\n");
}

// ─── Command tables ───────────────────────────────────────────────────────

type S = Spec<Session>;
const spec = (pattern: string, run?: S["run"], no?: S["no"]): S => ({ pattern, els: compile(pattern), run, no });

const showSpecs: S[] = [
  spec("show running-config", (s) => show.runningConfig(device(s))),
  spec("show startup-config", (s) => device(s).startup ?? "startup-config is not present"),
  spec("show version", (s) => show.showVersion(device(s))),
  spec("show ip interface brief", (s) => show.showIpIntBrief(s.net, s.dev)),
  spec("show interfaces <iface:if>", (s, a) => (device(s).ifaces[a.if] ? show.showInterface(s.net, s.dev, a.if) : INVALID)),
  spec("show interfaces status", (s) => (isSwitch(device(s)) ? show.showInterfacesStatus(s.net, s.dev) : INVALID)),
  spec("show interfaces trunk", (s) => (isSwitch(device(s)) ? show.showTrunks(s.net, s.dev) : INVALID)),
  spec("show vlan brief", (s) => (isSwitch(device(s)) ? show.showVlanBrief(s.net, s.dev) : INVALID)),
  spec("show vlan", (s) => (isSwitch(device(s)) ? show.showVlanBrief(s.net, s.dev) : INVALID)),
  spec("show mac address-table", (s) => (isSwitch(device(s)) ? show.showMacTable(s.net, s.dev) : INVALID)),
  spec("show ip route", (s) => show.showIpRoute(s.net, s.dev)),
  spec("show ip route {f:static|ospf|connected}", (s, a) => show.showIpRoute(s.net, s.dev, a.f)),
  spec("show ip ospf neighbor", (s) => show.showOspfNeighbors(s.net, s.dev)),
  spec("show ip ospf interface brief", (s) => show.showOspfIntBrief(s.net, s.dev)),
  spec("show ip protocols", (s) => show.showIpProtocols(s.net, s.dev)),
  spec("show access-lists", (s) => show.showAccessLists(device(s))),
  spec("show ip access-lists", (s) => show.showAccessLists(device(s), true)),
  spec("show ip nat translations", (s) => show.showNat(device(s))),
  spec("show ip arp", (s) => show.showArp(s.net, s.dev)),
  spec("show arp", (s) => show.showArp(s.net, s.dev)),
  spec("show etherchannel summary", (s) => (isSwitch(device(s)) ? show.showEtherchannel(s.net, s.dev) : INVALID)),
  spec("show spanning-tree", (s) => (isSwitch(device(s)) ? show.showSpanningTree(s.net, s.dev) : INVALID)),
  spec("show spanning-tree vlan <int:vlan:1-4094>", (s, a) => (isSwitch(device(s)) ? show.showSpanningTree(s.net, s.dev, a.vlan) : INVALID)),
  spec("show port-security interface <iface:if>", (s, a) => show.showPortSecurity(s.net, s.dev, a.if)),
  spec("show cdp neighbors", (s) => show.showCdp(s.net, s.dev)),
  spec("show ip dhcp binding", (s) => show.showDhcpBinding(device(s))),
  spec("show ip ssh", (s) => {
    const d = device(s);
    return d.rsaBits ? `SSH Enabled - version ${d.sshVersion === 2 ? "2.0" : "1.99"}\nAuthentication timeout: 120 secs; Authentication retries: 3\nMinimum expected Diffie Hellman key size : 1024 bits\nIOS Keys in SECSH format(ssh-rsa, base64 encoded): ${d.hostname}.${d.domainName}` : "SSH Disabled - version 1.99\n%Please create RSA keys to enable SSH (and of atleast 768 bits for SSH v2).";
  }),
  spec("show clock", () => "*09:14:32.118 UTC Thu Oct 1 2026"),
  spec("show history", (s) => s.history.slice(-10).map((h) => `  ${h}`).join("\n")),
];

const execSpecs: S[] = [
  spec("enable", (s) => {
    const d = device(s);
    if (!d.enableSecret && !d.enablePassword) {
      s.mode = "priv";
      return;
    }
    let tries = 0;
    const ask = () => {
      s.pending = {
        prompt: "Password: ",
        secret: true,
        then: (pw) => {
          s.pending = undefined;
          if (pw === (d.enableSecret ?? d.enablePassword)) {
            s.mode = "priv";
            return "";
          }
          if (++tries >= 3) return "% Bad secrets";
          ask();
          return "";
        },
      };
    };
    ask();
  }),
  spec("disable", (s) => {
    s.mode = "user";
  }),
  spec("configure terminal", (s) => {
    if (s.mode !== "priv") return INVALID;
    s.mode = "config";
    return "Enter configuration commands, one per line.  End with CNTL/Z.";
  }),
  spec("ping <ip:dst>", (s, a) => doPing(s, a.dst)),
  spec("traceroute <ip:dst>", (s, a) => doTrace(s, a.dst, false)),
  spec("copy {src:running-config|startup-config} {dst:startup-config|running-config}", (s, a) => {
    if (s.mode !== "priv") return INVALID;
    const d = device(s);
    if (a.src === "running-config" && a.dst === "startup-config") {
      s.pending = {
        prompt: "Destination filename [startup-config]? ",
        secret: false,
        then: () => {
          s.pending = undefined;
          d.startup = show.runningConfig(d).replace(/^Building configuration\.\.\.\n\nCurrent configuration/, "Using 1234 out of 65536 bytes");
          (d as Device & { snapshot?: string }).snapshot = snapshot(d);
          return "Building configuration...\n[OK]";
        },
      };
      return;
    }
    return "% Only copy running-config startup-config is available in this lab.";
  }),
  spec("write memory", (s) => {
    const d = device(s);
    d.startup = show.runningConfig(d);
    (d as Device & { snapshot?: string }).snapshot = snapshot(d);
    return "Building configuration...\n[OK]";
  }),
  spec("write", (s) => {
    const d = device(s);
    d.startup = show.runningConfig(d);
    (d as Device & { snapshot?: string }).snapshot = snapshot(d);
    return "Building configuration...\n[OK]";
  }),
  spec("reload", (s) => {
    s.pending = {
      prompt: "Proceed with reload? [confirm]",
      secret: false,
      then: (ans) => {
        s.pending = undefined;
        if (ans.trim().toLowerCase().startsWith("n")) return "";
        const d = device(s);
        const snap = (d as Device & { snapshot?: string }).snapshot;
        if (snap) Object.assign(d, JSON.parse(snap), { startup: d.startup });
        s.mode = "user";
        return `\nSystem Bootstrap, Version 15.1(4)M4, RELEASE SOFTWARE (fc1)\n...\nPress RETURN to get started!\n${snap ? "" : "\n(No startup-config was saved, so the device came back with a blank configuration.)"}`;
      },
    };
  }),
  spec("clear ip nat translation *", (s) => {
    device(s).nat.table = [];
  }),
  spec("clear arp-cache", (s) => {
    device(s).arp = {};
  }),
  spec("clear mac address-table dynamic", (s) => {
    device(s).macTable = {};
  }),
  spec("clear ip ospf process", (s) => {
    s.pending = { prompt: "Reset ALL OSPF processes? [no]: ", secret: false, then: () => ((s.pending = undefined), "") };
  }),
  spec("ssh -l <word:user> <ip:dst>", (s, a) => connectRemote(s, a.dst, "ssh", a.user)),
  spec("telnet <ip:dst>", (s, a) => connectRemote(s, a.dst, "telnet")),
  spec("terminal length <int:n:0-512>"),
  spec("terminal monitor"),
  ...showSpecs,
  spec("exit", (s) => logout(s)),
  spec("logout", (s) => logout(s)),
];

function logout(s: Session) {
  const remote = closeRemote(s);
  if (remote !== null) return remote;
  const d = device(s);
  s.mode = "user";
  s.pending = {
    prompt: "",
    secret: false,
    then: () => {
      s.pending = undefined;
      if (d.lines.con.login !== "none" && (d.lines.con.password || d.lines.con.login === "local")) {
        let tries = 0;
        const ask = () => {
          s.pending = {
            prompt: "Password: ",
            secret: true,
            then: (pw) => {
              s.pending = undefined;
              if (pw === d.lines.con.password) return "";
              if (++tries < 3) ask();
              return "% Login invalid";
            },
          };
        };
        ask();
        return `${d.bannerMotd ? `${d.bannerMotd}\n` : ""}\nUser Access Verification\n`;
      }
      return d.bannerMotd ?? "";
    },
  };
  return `\n${d.hostname} con0 is now available\n\n\n\n\n\nPress RETURN to get started.`;
}

const lineCfg = (s: Session): Line => device(s).lines[s.line ?? "con"];

const configSpecs: S[] = [
  spec("hostname <word:name>", (s, a) => {
    device(s).hostname = a.name;
  }),
  spec("enable secret <word:pw>", (s, a) => void (device(s).enableSecret = a.pw), (s) => void (device(s).enableSecret = undefined)),
  spec("enable secret 0 <word:pw>", (s, a) => void (device(s).enableSecret = a.pw)),
  spec("enable algorithm-type {alg:scrypt|sha256|md5} secret <word:pw>", (s, a) => void (device(s).enableSecret = a.pw)),
  spec("enable password <word:pw>", (s, a) => void (device(s).enablePassword = a.pw), (s) => void (device(s).enablePassword = undefined)),
  spec("service password-encryption", (s) => void (device(s).servicePasswordEncryption = true), (s) => void (device(s).servicePasswordEncryption = false)),
  spec("service timestamps log datetime msec", (s) => void (device(s).logging.timestamps = true), (s) => void (device(s).logging.timestamps = false)),
  spec("banner motd <line:text>", (s, a) => {
    const t: string = a.text;
    const delim = t[0];
    const end = t.lastIndexOf(delim);
    device(s).bannerMotd = end > 0 ? t.slice(1, end).trim() : t.slice(1).trim();
  }, (s) => void (device(s).bannerMotd = undefined)),
  spec("ip domain-name <word:name>", (s, a) => void (device(s).domainName = a.name), (s) => void (device(s).domainName = undefined)),
  spec("ip domain name <word:name>", (s, a) => void (device(s).domainName = a.name), (s) => void (device(s).domainName = undefined)),
  spec("ip domain-lookup", (s) => void (device(s).domainLookup = true), (s) => void (device(s).domainLookup = false)),
  spec("ip domain lookup", (s) => void (device(s).domainLookup = true), (s) => void (device(s).domainLookup = false)),
  spec("ip name-server <ip:a>", (s, a) => void device(s).nameServers.push(a.a), (s, a) => void (device(s).nameServers = device(s).nameServers.filter((x) => x !== a.a))),
  spec("username <word:user> secret <word:pw>", (s, a) => void (device(s).users[a.user] = { secret: a.pw }), (s, a) => void delete device(s).users[a.user]),
  spec("username <word:user> privilege <int:p:0-15> secret <word:pw>", (s, a) => void (device(s).users[a.user] = { secret: a.pw, privilege: a.p })),
  spec("username <word:user> password <word:pw>", (s, a) => void (device(s).users[a.user] = { password: a.pw })),
  spec("username <word:user> privilege <int:p:0-15> password <word:pw>", (s, a) => void (device(s).users[a.user] = { password: a.pw, privilege: a.p })),
  spec("username <word:user>", undefined, (s, a) => void delete device(s).users[a.user]),
  spec("crypto key generate rsa modulus <int:bits:360-4096>", (s, a) => genRsa(s, a.bits)),
  spec("crypto key generate rsa general-keys modulus <int:bits:360-4096>", (s, a) => genRsa(s, a.bits)),
  spec("crypto key generate rsa", (s) => {
    s.pending = {
      prompt: `The name for the keys will be: ${device(s).hostname}.${device(s).domainName ?? ""}\nChoose the size of the key modulus in the range of 360 to 4096 for your\n  General Purpose Keys. Choosing a key modulus greater than 512 may take\n  a few minutes.\n\nHow many bits in the modulus [512]: `,
      secret: false,
      then: (ans) => {
        s.pending = undefined;
        const bits = Number(ans.trim() || 512);
        if (!(bits >= 360 && bits <= 4096)) return "% Invalid modulus size";
        return genRsa(s, bits) ?? "";
      },
    };
  }),
  spec("crypto key zeroize rsa", (s) => void (device(s).rsaBits = undefined)),
  spec("ip ssh version {v:1|2}", (s, a) => void (device(s).sshVersion = Number(a.v) as 1 | 2), (s) => void (device(s).sshVersion = undefined)),
  spec("line {kind:console|vty} <int:a:0-15>", (s, a) => enterLine(s, a.kind)),
  spec("line {kind:console|vty} <int:a:0-15> <int:b:0-15>", (s, a) => enterLine(s, a.kind)),
  spec("interface <iface:if>", (s, a) => enterIf(s, a.if)),
  spec("interface range <ifrange:list>", (s, a) => {
    const d = device(s);
    const missing = (a.list as string[]).find((n) => !d.ifaces[n]);
    if (missing) return INVALID;
    s.ifaces = a.list;
    s.mode = "if-range";
  }),
  spec("vlan <vlanlist:v>", (s, a) => {
    const d = device(s);
    if (!isSwitch(d)) return INVALID;
    for (const v of a.v as number[]) if (!d.vlans[v]) d.vlans[v] = { name: `VLAN${String(v).padStart(4, "0")}` };
    s.vlans = a.v;
    s.mode = "vlan";
  }, (s, a) => {
    const d = device(s);
    for (const v of a.v as number[]) if (v !== 1 && v < 1002) delete d.vlans[v];
  }),
  spec("ip routing", (s) => {
    const d = device(s);
    if (d.kind === "switch") return INVALID;
    d.ipRouting = true;
  }, (s) => void (device(s).ipRouting = device(s).kind === "router" ? false : false)),
  spec("ipv6 unicast-routing", () => undefined, () => undefined),
  spec("ip default-gateway <ip:gw>", (s, a) => void (device(s).defaultGateway = a.gw), (s) => void (device(s).defaultGateway = undefined)),
  spec("ip route <ip:net> <ip:mask> <ip:nh>", (s, a) => addStatic(s, a), (s, a) => delStatic(s, a)),
  spec("ip route <ip:net> <ip:mask> <ip:nh> <int:ad:1-255>", (s, a) => addStatic(s, a), (s, a) => delStatic(s, a)),
  spec("ip route <ip:net> <ip:mask> <iface:if>", (s, a) => addStatic(s, a), (s, a) => delStatic(s, a)),
  spec("ip route <ip:net> <ip:mask> <iface:if> <ip:nh>", (s, a) => addStatic(s, a), (s, a) => delStatic(s, a)),
  spec("ip route <ip:net> <ip:mask> <iface:if> <int:ad:1-255>", (s, a) => addStatic(s, a), (s, a) => delStatic(s, a)),
  spec("router ospf <int:pid:1-65535>", (s, a) => {
    const d = device(s);
    if (d.kind === "switch" || d.host) return INVALID;
    d.ospf[a.pid] ??= { pid: a.pid, networks: [], passive: [], passiveDefault: false, defaultOriginate: false, refBw: 100 };
    s.ospf = a.pid;
    s.mode = "router";
  }, (s, a) => void delete device(s).ospf[a.pid]),
  spec("ip dhcp excluded-address <ip:lo>", (s, a) => void device(s).dhcp.excluded.push([a.lo, a.lo]), (s, a) => void (device(s).dhcp.excluded = device(s).dhcp.excluded.filter(([l]) => l !== a.lo))),
  spec("ip dhcp excluded-address <ip:lo> <ip:hi>", (s, a) => void device(s).dhcp.excluded.push([a.lo, a.hi]), (s, a) => void (device(s).dhcp.excluded = device(s).dhcp.excluded.filter(([l]) => l !== a.lo))),
  spec("ip dhcp pool <word:name>", (s, a) => {
    const d = device(s);
    d.dhcp.pools[a.name] ??= { name: a.name, dns: [] };
    s.pool = a.name;
    s.mode = "dhcp";
  }, (s, a) => void delete device(s).dhcp.pools[a.name]),
  spec("ip nat inside source static <ip:local> <ip:global>", (s, a) => void device(s).nat.statics.push({ local: a.local, global: a.global }), (s, a) => void (device(s).nat.statics = device(s).nat.statics.filter((x) => x.local !== a.local))),
  spec("ip nat inside source list <word:acl> interface <iface:if> overload", (s, a) => void device(s).nat.rules.push({ acl: a.acl, iface: a.if, overload: true }), (s, a) => void (device(s).nat.rules = device(s).nat.rules.filter((r) => r.acl !== a.acl))),
  spec("ip nat inside source list <word:acl> pool <word:pool>", (s, a) => void device(s).nat.rules.push({ acl: a.acl, pool: a.pool, overload: false }), (s, a) => void (device(s).nat.rules = device(s).nat.rules.filter((r) => r.acl !== a.acl))),
  spec("ip nat inside source list <word:acl> pool <word:pool> overload", (s, a) => void device(s).nat.rules.push({ acl: a.acl, pool: a.pool, overload: true }), (s, a) => void (device(s).nat.rules = device(s).nat.rules.filter((r) => r.acl !== a.acl))),
  spec("ip nat pool <word:name> <ip:start> <ip:end> netmask <ip:mask>", (s, a) => {
    const p = prefixFromMask(a.mask);
    if (p === null) return "% Bad mask";
    device(s).nat.pools[a.name] = { start: a.start, end: a.end, prefix: p };
  }, (s, a) => void delete device(s).nat.pools[a.name]),
  spec("ip nat pool <word:name> <ip:start> <ip:end> prefix-length <int:p:1-32>", (s, a) => void (device(s).nat.pools[a.name] = { start: a.start, end: a.end, prefix: a.p })),
  spec("access-list <int:n:1-2699> <line:rest>", (s, a) => {
    const d = device(s);
    const type = (a.n >= 1 && a.n <= 99) || (a.n >= 1300 && a.n <= 1999) ? "standard" : (a.n >= 100 && a.n <= 199) || (a.n >= 2000 && a.n <= 2699) ? "extended" : null;
    if (!type) return INVALID;
    const toks = (a.rest as string).split(/\s+/);
    if (toks[0].toLowerCase() === "remark") {
      addAce(aclFor(d, String(a.n), type, true), { action: "remark", remark: toks.slice(1).join(" ") });
      return;
    }
    const e = parseAce(type, toks);
    if ("failAt" in e) return `${INVALID}`;
    addAce(aclFor(d, String(a.n), type, true), e);
  }),
  spec("access-list <int:n:1-2699>", undefined, (s, a) => void delete device(s).acls[String(a.n)]),
  spec("ip access-list {type:standard|extended} <word:name>", (s, a) => {
    aclFor(device(s), a.name, a.type, /^\d+$/.test(a.name));
    s.acl = a.name;
    s.mode = a.type === "standard" ? "nacl-std" : "nacl-ext";
  }, (s, a) => void delete device(s).acls[a.name]),
  spec("spanning-tree mode {m:pvst|rapid-pvst}", (s, a) => (isSwitch(device(s)) ? void (device(s).stp.mode = a.m) : INVALID)),
  spec("spanning-tree vlan <vlanlist:v> priority <int:p:0-61440>", (s, a) => {
    if (a.p % 4096) return "% Bridge Priority must be in increments of 4096.\n% Allowed values are:\n  0     4096  8192  12288 16384 20480 24576 28672\n  32768 36864 40960 45056 49152 53248 57344 61440";
    for (const v of a.v) device(s).stp.priorities[v] = a.p;
  }, (s, a) => {
    for (const v of a.v) delete device(s).stp.priorities[v];
  }),
  spec("spanning-tree vlan <vlanlist:v> root {r:primary|secondary}", (s, a) => {
    for (const v of a.v) {
      if (a.r === "secondary") {
        device(s).stp.priorities[v] = 28672;
        continue;
      }
      // Like IOS: 24576, or 4096 below the current root if that is already lower.
      const others = Object.values(s.net.devices).filter((d) => d !== device(s) && (d.kind === "switch" || d.kind === "l3switch") && d.vlans[v]);
      const lowest = Math.min(...others.map((d) => d.stp.priorities[v] ?? 32768), 32768);
      device(s).stp.priorities[v] = lowest > 24576 ? 24576 : Math.max(0, lowest - 4096);
    }
  }),
  spec("spanning-tree portfast default", () => undefined),
  spec("spanning-tree portfast bpduguard default", () => undefined),
  spec("cdp run", (s) => void (device(s).cdpRun = true), (s) => void (device(s).cdpRun = false)),
  spec("lldp run", (s) => void (device(s).lldpRun = true), (s) => void (device(s).lldpRun = false)),
  spec("ntp server <ip:a>", (s, a) => void device(s).ntpServers.push(a.a), (s, a) => void (device(s).ntpServers = device(s).ntpServers.filter((x) => x !== a.a))),
  spec("ntp master", (s) => void (device(s).ntpMaster = 8), (s) => void (device(s).ntpMaster = undefined)),
  spec("ntp master <int:st:1-15>", (s, a) => void (device(s).ntpMaster = a.st)),
  spec("logging host <ip:a>", (s, a) => void device(s).logging.hosts.push(a.a), (s, a) => void (device(s).logging.hosts = device(s).logging.hosts.filter((x) => x !== a.a))),
  spec("logging <ip:a>", (s, a) => void device(s).logging.hosts.push(a.a)),
  spec("logging trap {lvl:emergencies|alerts|critical|errors|warnings|notifications|informational|debugging|0|1|2|3|4|5|6|7}", (s, a) => void (device(s).logging.trap = a.lvl), (s) => void (device(s).logging.trap = undefined)),
  spec("logging buffered", (s) => void (device(s).logging.buffered = true)),
  spec("snmp-server community <word:name> {mode:RO|RW|ro|rw}", (s, a) => void device(s).snmp.communities.push({ name: a.name, rw: a.mode.toLowerCase() === "rw" }), (s, a) => void (device(s).snmp.communities = device(s).snmp.communities.filter((c) => c.name !== a.name))),
  spec("vtp mode {m:server|client|transparent|off}", () => undefined),
  spec("clock timezone <word:zone> <int:h:0-23> <int:m:0-59>", () => undefined),
];

function genRsa(s: Session, bits: number) {
  const d = device(s);
  if (d.hostname === "Router" || d.hostname === "Switch") return "% Please define a hostname other than Router.";
  if (!d.domainName) return "% Please define a domain-name first.";
  d.rsaBits = bits;
  return `The name for the keys will be: ${d.hostname}.${d.domainName}\n% The key modulus size is ${bits} bits\n% Generating ${bits} bit RSA keys, keys will be non-exportable...\n[OK] (elapsed time was 1 seconds)\n\n%SSH-5-ENABLED: SSH 1.99 has been enabled`;
}

function enterLine(s: Session, kind: string) {
  s.line = kind === "console" ? "con" : "vty";
  s.mode = "line";
}

function enterIf(s: Session, name: string) {
  const d = device(s);
  if (!d.ifaces[name]) {
    const type = ifTypeOf(name);
    const parent = parentOf(name);
    if (type === "Loopback") d.ifaces[name] = newIface(name);
    else if (type === "Vlan" && isSwitch(d)) d.ifaces[name] = newIface(name);
    else if (type === "Port-channel" && isSwitch(d)) d.ifaces[name] = newIface(name, { switchport: true });
    else if (parent && d.ifaces[parent] && !isL2(d, d.ifaces[parent])) d.ifaces[name] = newIface(name);
    else return INVALID;
  }
  s.ifaces = [name];
  s.mode = parentOf(name) ? "subif" : "if";
}

function addStatic(s: Session, a: Args) {
  const d = device(s);
  const len = prefixFromMask(a.mask);
  if (len === null) return "%Inconsistent address and mask";
  if (((a.net & ~maskFromPrefix(len)) >>> 0) !== 0) return "%Inconsistent address and mask";
  d.statics = d.statics.filter((r) => !(r.prefix === a.net && r.len === len && r.nextHop === a.nh && r.iface === a.if));
  d.statics.push({ prefix: a.net >>> 0, len, nextHop: a.nh, iface: a.if, ad: a.ad ?? 1 });
}

function delStatic(s: Session, a: Args) {
  const d = device(s);
  const len = prefixFromMask(a.mask);
  d.statics = d.statics.filter((r) => !(r.prefix === a.net && r.len === len && (a.nh === undefined || r.nextHop === a.nh)));
}

// Interface-mode commands apply to every selected interface (interface range).
const eachIf = (fn: (i: Iface, d: Device, s: Session) => string | void) => (s: Session, a: Args) => {
  const outs: string[] = [];
  const d = device(s);
  for (const i of targetIfaces(s)) {
    const o = fn(i, d, s);
    if (o && !outs.includes(o)) outs.push(o);
    void a;
  }
  return outs.join("\n") || undefined;
};
const withArgs = (fn: (i: Iface, d: Device, a: Args, s: Session) => string | void) => (s: Session, a: Args) => eachIf((i, d) => fn(i, d, a, s))(s, a);

const needL2 = (i: Iface, d: Device) => (isL2(d, i) || (ifTypeOf(i.name) === "Port-channel" && i.switchport) ? null : INVALID);

/** Changes on a port-channel are copied to its member ports, as IOS does. */
function toMembers(d: Device, i: Iface, fn: (m: Iface) => void) {
  if (ifTypeOf(i.name) !== "Port-channel") return;
  const g = Number(i.name.slice(12));
  for (const m of Object.values(d.ifaces)) if (m.channel?.group === g) fn(m);
}

const ifSpecs: S[] = [
  spec("description <line:text>", withArgs((i, _d, a) => void (i.description = a.text)), eachIf((i) => void (i.description = undefined))),
  spec("shutdown", eachIf((i) => void (i.shutdown = true)), eachIf((i) => {
    i.shutdown = false;
    i.errDisabled = undefined;
  })),
  spec("ip address <ip:a> <ip:m>", withArgs((i, d, a, s) => {
    if (d.kind === "switch" && ifTypeOf(i.name) !== "Vlan") return INVALID;
    if (isL2(d, i)) return "% IP addresses may not be configured on L2 links.";
    const p = prefixFromMask(a.m);
    if (p === null) return `Bad mask 0x${(a.m >>> 0).toString(16).toUpperCase()} for address ${ip(a.a)}`;
    const hostBits = (a.a & ~maskFromPrefix(p)) >>> 0;
    if (p < 31 && (hostBits === 0 || hostBits === ~maskFromPrefix(p) >>> 0)) return `Bad mask /${p} for address ${ip(a.a)}`;
    // Overlap with another interface on this device
    const clash = l3Ifaces(s.net, s.dev).find((o) => o.name !== i.name && ((o.ip & maskFromPrefix(Math.min(o.prefix, p))) >>> 0) === ((a.a & maskFromPrefix(Math.min(o.prefix, p))) >>> 0));
    if (clash) return `% ${ip((a.a & maskFromPrefix(p)) >>> 0)} overlaps with ${clash.name}`;
    i.ipv4 = { ip: a.a, prefix: p };
  }), eachIf((i) => void (i.ipv4 = undefined))),
  spec("ip address dhcp", withArgs((i, d) => {
    if (isL2(d, i)) return "% IP addresses may not be configured on L2 links.";
    i.ipv4 = "dhcp";
  })),
  spec("ipv6 address <ipv6:a>", withArgs((i, _d, a) => void (i.ipv6.includes(a.a) || i.ipv6.push(a.a))), withArgs((i, _d, a) => void (i.ipv6 = i.ipv6.filter((x) => x !== a.a)))),
  spec("ipv6 address <ipv6:a> {k:eui-64|link-local}", withArgs((i, _d, a) => void i.ipv6.push(`${a.a} ${a.k}`))),
  spec("ipv6 enable", () => undefined),
  spec("switchport mode {m:access|trunk}", withArgs((i, d, a) => {
    const bad = needL2(i, d);
    if (bad) return bad;
    i.mode = a.m;
    toMembers(d, i, (m) => (m.mode = a.m));
  }), eachIf((i) => void (i.mode = "dynamic auto"))),
  spec("switchport mode dynamic {m:auto|desirable}", withArgs((i, d, a) => {
    const bad = needL2(i, d);
    if (bad) return bad;
    i.mode = `dynamic ${a.m}` as Iface["mode"];
  })),
  spec("switchport access vlan <int:v:1-4094>", withArgs((i, d, a) => {
    const bad = needL2(i, d);
    if (bad) return bad;
    i.accessVlan = a.v;
    toMembers(d, i, (m) => (m.accessVlan = a.v));
    return ensureVlan(d, a.v);
  }), eachIf((i) => void (i.accessVlan = 1))),
  spec("switchport voice vlan <int:v:1-4094>", withArgs((i, d, a) => {
    const bad = needL2(i, d);
    if (bad) return bad;
    i.voiceVlan = a.v;
    return ensureVlan(d, a.v);
  }), eachIf((i) => void (i.voiceVlan = undefined))),
  spec("switchport trunk native vlan <int:v:1-4094>", withArgs((i, d, a) => {
    const bad = needL2(i, d);
    if (bad) return bad;
    i.nativeVlan = a.v;
    toMembers(d, i, (m) => (m.nativeVlan = a.v));
  }), eachIf((i) => void (i.nativeVlan = 1))),
  spec("switchport trunk allowed vlan <vlanlist:v>", withArgs((i, d, a) => {
    const bad = needL2(i, d);
    if (bad) return bad;
    i.allowed = [...a.v];
    toMembers(d, i, (m) => (m.allowed = [...a.v]));
  }), eachIf((i) => void (i.allowed = null))),
  spec("switchport trunk allowed vlan {op:add|remove|except} <vlanlist:v>", withArgs((i, d, a) => {
    const bad = needL2(i, d);
    if (bad) return bad;
    const all = Array.from({ length: 4094 }, (_, k) => k + 1);
    const cur = i.allowed ?? all;
    const next = a.op === "add" ? [...new Set([...cur, ...a.v])] : a.op === "remove" ? cur.filter((x: number) => !a.v.includes(x)) : all.filter((x) => !a.v.includes(x));
    i.allowed = next.length === 4094 ? null : next.sort((x: number, y: number) => x - y);
    toMembers(d, i, (m) => (m.allowed = i.allowed && [...i.allowed]));
  })),
  spec("switchport trunk allowed vlan {kw:all|none}", withArgs((i, d, a) => {
    const bad = needL2(i, d);
    if (bad) return bad;
    i.allowed = a.kw === "all" ? null : [];
  })),
  spec("switchport trunk encapsulation dot1q", withArgs((i, d) => needL2(i, d) ?? undefined)),
  spec("switchport nonegotiate", withArgs((i, d) => {
    const bad = needL2(i, d);
    if (bad) return bad;
    if (i.mode.startsWith("dynamic")) return "Conflict between 'nonegotiate' and 'dynamic' status.";
    i.nonegotiate = true;
  }), eachIf((i) => void (i.nonegotiate = false))),
  spec("switchport", withArgs((i, d) => {
    if (d.kind !== "l3switch") return INVALID;
    i.switchport = true;
    i.ipv4 = undefined;
  }), withArgs((i, d) => {
    if (d.kind !== "l3switch") return INVALID;
    i.switchport = false;
  })),
  spec("switchport port-security", withArgs((i, d) => {
    const bad = needL2(i, d);
    if (bad) return bad;
    if (i.mode.startsWith("dynamic")) return `Command rejected: ${i.name} is a dynamic port.`;
    i.portSecurity.on = true;
  }), eachIf((i) => void (i.portSecurity.on = false))),
  spec("switchport port-security maximum <int:n:1-132>", withArgs((i, d, a) => needL2(i, d) ?? void (i.portSecurity.max = a.n)), eachIf((i) => void (i.portSecurity.max = 1))),
  spec("switchport port-security violation {v:shutdown|restrict|protect}", withArgs((i, d, a) => needL2(i, d) ?? void (i.portSecurity.violation = a.v)), eachIf((i) => void (i.portSecurity.violation = "shutdown"))),
  spec("switchport port-security mac-address sticky", withArgs((i, d) => needL2(i, d) ?? void (i.portSecurity.sticky = true)), eachIf((i) => {
    i.portSecurity.sticky = false;
    i.portSecurity.macs = [];
  })),
  spec("switchport port-security mac-address <word:mac>", withArgs((i, d, a) => {
    if (!/^[0-9a-f]{4}\.[0-9a-f]{4}\.[0-9a-f]{4}$/i.test(a.mac)) return INVALID;
    return needL2(i, d) ?? void i.portSecurity.macs.push(a.mac.toLowerCase());
  })),
  spec("spanning-tree portfast", withArgs((i, d) => needL2(i, d) ?? void (i.portfast = true)), eachIf((i) => void (i.portfast = false))),
  spec("spanning-tree portfast trunk", withArgs((i, d) => needL2(i, d) ?? void (i.portfast = true))),
  spec("spanning-tree bpduguard enable", withArgs((i, d) => needL2(i, d) ?? void (i.bpduguard = true)), eachIf((i) => void (i.bpduguard = false))),
  spec("spanning-tree bpduguard disable", eachIf((i) => void (i.bpduguard = false))),
  spec("channel-group <int:g:1-48> mode {m:active|passive|on|desirable|auto}", withArgs((i, d, a) => {
    if (!isSwitch(d) || ifTypeOf(i.name) === "Port-channel") return INVALID;
    const others = Object.values(d.ifaces).filter((x) => x.channel?.group === a.g && x !== i);
    const lacp = (m: string) => (m === "active" || m === "passive" ? "lacp" : m === "on" ? "on" : "pagp");
    if (others.length && lacp(others[0].channel!.mode) !== lacp(a.m)) return `Command rejected (Channel protocol mismatch for interface ${shortName(i.name)} in group ${a.g}): the interface can not be added to the channel group`;
    i.channel = { group: a.g, mode: a.m };
    const po = `Port-channel${a.g}`;
    if (!d.ifaces[po]) {
      d.ifaces[po] = newIface(po, { switchport: i.switchport, mode: i.mode, accessVlan: i.accessVlan, nativeVlan: i.nativeVlan, allowed: i.allowed });
      return `Creating a port-channel interface Port-channel ${a.g}`;
    }
  }), eachIf((i) => void (i.channel = undefined))),
  spec("encapsulation dot1Q <int:v:1-4094>", withArgs((i, _d, a) => (parentOf(i.name) ? void (i.encapsulation = { vlan: a.v, native: false }) : INVALID))),
  spec("encapsulation dot1Q <int:v:1-4094> native", withArgs((i, _d, a) => (parentOf(i.name) ? void (i.encapsulation = { vlan: a.v, native: true }) : INVALID))),
  spec("ip helper-address <ip:a>", withArgs((i, _d, a) => void (i.helpers.includes(a.a) || i.helpers.push(a.a))), withArgs((i, _d, a) => void (i.helpers = i.helpers.filter((x) => x !== a.a)))),
  spec("ip nat {side:inside|outside}", withArgs((i, _d, a) => void (i.nat = a.side)), eachIf((i) => void (i.nat = undefined))),
  spec("ip access-group <word:acl> {dir:in|out}", withArgs((i, d, a) => {
    if (isL2(d, i)) return "% Access groups are only supported on routed interfaces in this simulator.";
    if (a.dir === "in") i.aclIn = a.acl;
    else i.aclOut = a.acl;
  }), withArgs((i, _d, a) => {
    if (a.dir === "in") i.aclIn = undefined;
    else i.aclOut = undefined;
  })),
  spec("ip ospf <int:pid:1-65535> area <word:area>", withArgs((i, _d, a) => void (i.ospf = { pid: a.pid, area: a.area })), eachIf((i) => void (i.ospf = undefined))),
  spec("ip ospf cost <int:c:1-65535>", withArgs((i, _d, a) => void (i.ospfCost = a.c)), eachIf((i) => void (i.ospfCost = undefined))),
  spec("ip ospf priority <int:p:0-255>", withArgs((i, _d, a) => void (i.ospfPriority = a.p)), eachIf((i) => void (i.ospfPriority = undefined))),
  spec("ip ospf network point-to-point", eachIf((i) => void (i.ospfPointToPoint = true)), eachIf((i) => void (i.ospfPointToPoint = false))),
  spec("speed {v:10|100|1000|auto}", withArgs((i, _d, a) => void (i.speed = a.v))),
  spec("duplex {v:full|half|auto}", withArgs((i, _d, a) => void (i.duplex = a.v))),
  spec("cdp enable", eachIf((i) => void (i.cdp = true)), eachIf((i) => void (i.cdp = false))),
  spec("interface <iface:if>", (s, a) => enterIf(s, a.if)),
];

const lineSpecs: S[] = [
  spec("password <word:pw>", (s, a) => void (lineCfg(s).password = a.pw), (s) => void (lineCfg(s).password = undefined)),
  spec("password 0 <word:pw>", (s, a) => void (lineCfg(s).password = a.pw)),
  spec("login", (s) => void (lineCfg(s).login = "login"), (s) => void (lineCfg(s).login = "none")),
  spec("login local", (s) => void (lineCfg(s).login = "local"), (s) => void (lineCfg(s).login = "none")),
  spec("transport input {t:ssh|telnet|all|none}", (s, a) => {
    if (s.line !== "vty") return INVALID;
    lineCfg(s).transport = a.t === "all" ? ["ssh", "telnet"] : a.t === "none" ? [] : [a.t];
  }),
  spec("transport input ssh telnet", (s) => void (lineCfg(s).transport = ["ssh", "telnet"])),
  spec("transport input telnet ssh", (s) => void (lineCfg(s).transport = ["ssh", "telnet"])),
  spec("exec-timeout <int:m:0-35791>", (s, a) => void (lineCfg(s).execTimeout = [a.m, 0])),
  spec("exec-timeout <int:m:0-35791> <int:sec:0-2147483>", (s, a) => void (lineCfg(s).execTimeout = [a.m, a.sec])),
  spec("access-class <word:acl> in", (s, a) => void (lineCfg(s).accessClass = a.acl), (s) => void (lineCfg(s).accessClass = undefined)),
  spec("logging synchronous", (s) => void (lineCfg(s).loggingSync = true), (s) => void (lineCfg(s).loggingSync = false)),
];

const vlanSpecs: S[] = [
  spec("name <word:name>", (s, a) => {
    for (const v of s.vlans) device(s).vlans[v].name = a.name;
  }),
];

const routerSpecs: S[] = [
  spec("router-id <ip:rid>", (s, a) => {
    device(s).ospf[s.ospf!].routerId = a.rid;
    return "% OSPF: Reload or use \"clear ip ospf process\" command, for this to take effect";
  }, (s) => void (device(s).ospf[s.ospf!].routerId = undefined)),
  spec("network <ip:net> <ip:wc> area <word:area>", (s, a) => {
    const p = device(s).ospf[s.ospf!];
    if (!p.networks.some((n) => n.ip === a.net && n.wc === a.wc)) p.networks.push({ ip: a.net, wc: a.wc, area: a.area });
  }, (s, a) => {
    const p = device(s).ospf[s.ospf!];
    p.networks = p.networks.filter((n) => !(n.ip === a.net && n.wc === a.wc));
  }),
  spec("passive-interface <iface:if>", (s, a) => {
    const p = device(s).ospf[s.ospf!];
    if (p.passiveDefault) p.passive = p.passive.filter((n) => n !== a.if);
    else if (!p.passive.includes(a.if)) p.passive.push(a.if);
  }, (s, a) => {
    const p = device(s).ospf[s.ospf!];
    if (p.passiveDefault) {
      if (!p.passive.includes(a.if)) p.passive.push(a.if);
    } else p.passive = p.passive.filter((n) => n !== a.if);
  }),
  spec("passive-interface default", (s) => {
    const p = device(s).ospf[s.ospf!];
    p.passiveDefault = true;
    p.passive = [];
  }, (s) => {
    const p = device(s).ospf[s.ospf!];
    p.passiveDefault = false;
    p.passive = [];
  }),
  spec("default-information originate", (s) => void (device(s).ospf[s.ospf!].defaultOriginate = true), (s) => void (device(s).ospf[s.ospf!].defaultOriginate = false)),
  spec("default-information originate always", (s) => void (device(s).ospf[s.ospf!].defaultOriginate = true)),
  spec("auto-cost reference-bandwidth <int:bw:1-4294967>", (s, a) => {
    device(s).ospf[s.ospf!].refBw = a.bw;
    return "% OSPF: Reference bandwidth is changed.\n        Please ensure reference bandwidth is consistent across all routers.";
  }),
];

const dhcpSpecs: S[] = [
  spec("network <ip:net> <ip:mask>", (s, a) => {
    const p = prefixFromMask(a.mask);
    if (p === null) return INVALID;
    device(s).dhcp.pools[s.pool!].network = { ip: a.net, prefix: p };
  }),
  spec("default-router <ip:gw>", (s, a) => void (device(s).dhcp.pools[s.pool!].defaultRouter = a.gw), (s) => void (device(s).dhcp.pools[s.pool!].defaultRouter = undefined)),
  spec("dns-server <ip:a>", (s, a) => void (device(s).dhcp.pools[s.pool!].dns = [a.a])),
  spec("dns-server <ip:a> <ip:b>", (s, a) => void (device(s).dhcp.pools[s.pool!].dns = [a.a, a.b])),
  spec("domain-name <word:name>", (s, a) => void (device(s).dhcp.pools[s.pool!].domain = a.name)),
  spec("lease <int:d:0-365>", () => undefined),
];

const naclSpecs = (type: "standard" | "extended"): S[] => [
  spec("{a:permit|deny} <line:rest>", (s, a) => {
    const e = parseAce(type, [a.a, ...(a.rest as string).split(/\s+/)]);
    if ("failAt" in e) return INVALID;
    addAce(device(s).acls[s.acl!], e);
  }),
  spec("<int:seq:1-2147483647> {a:permit|deny} <line:rest>", (s, a) => {
    const e = parseAce(type, [a.a, ...(a.rest as string).split(/\s+/)]);
    if ("failAt" in e) return INVALID;
    const acl = device(s).acls[s.acl!];
    if (acl.entries.some((x) => x.seq === a.seq)) return "% Duplicate sequence number";
    addAce(acl, e, a.seq);
  }),
  spec("remark <line:text>", (s, a) => void addAce(device(s).acls[s.acl!], { action: "remark", remark: a.text })),
  spec("<int:seq:1-2147483647>", undefined, (s, a) => {
    const acl = device(s).acls[s.acl!];
    acl.entries = acl.entries.filter((e) => e.seq !== a.seq);
  }),
];

const commonConfig: S[] = [
  spec("exit", (s) => {
    if (s.mode === "config") s.mode = "priv";
    else s.mode = "config";
    s.ifaces = [];
  }),
  spec("end", (s) => {
    s.mode = "priv";
    s.ifaces = [];
    return `%SYS-5-CONFIG_I: Configured from console by console`;
  }),
  spec("do <line:cmd>", (s, a) => {
    const saved = s.mode;
    s.mode = "priv";
    const r = runLine(s, a.cmd);
    if (s.mode === "priv") s.mode = saved;
    return r;
  }),
];

function specsFor(s: Session): S[] {
  switch (s.mode) {
    case "user":
      return execSpecs.filter((x) => /^(enable|ping|traceroute|show version|show ip interface brief|exit|logout|ssh|telnet|terminal)/.test(x.pattern));
    case "priv":
      return execSpecs;
    case "config":
      return [...configSpecs, ...commonConfig];
    case "if":
    case "subif":
    case "if-range":
      return [...ifSpecs, ...configSpecs.filter((x) => /^(interface|line|vlan|router|ip route|hostname)/.test(x.pattern)), ...commonConfig];
    case "line":
      return [...lineSpecs, ...configSpecs.filter((x) => /^(interface|line|router)/.test(x.pattern)), ...commonConfig];
    case "vlan":
      return [...vlanSpecs, ...configSpecs.filter((x) => /^(vlan|interface)/.test(x.pattern)), ...commonConfig];
    case "router":
      return [...routerSpecs, ...configSpecs.filter((x) => /^(interface|router)/.test(x.pattern)), ...commonConfig];
    case "dhcp":
      return [...dhcpSpecs, ...configSpecs.filter((x) => /^(ip dhcp|interface)/.test(x.pattern)), ...commonConfig];
    case "nacl-std":
      return [...naclSpecs("standard"), ...configSpecs.filter((x) => /^(ip access-list|interface)/.test(x.pattern)), ...commonConfig];
    case "nacl-ext":
      return [...naclSpecs("extended"), ...configSpecs.filter((x) => /^(ip access-list|interface)/.test(x.pattern)), ...commonConfig];
  }
}

// ─── PC command prompt ────────────────────────────────────────────────────

function pcRun(s: Session, line: string): string {
  const d = device(s);
  const h = d.host!;
  const t = line.trim().split(/\s+/);
  const cmd = (t[0] ?? "").toLowerCase();
  const parse = (x?: string) => parseDot(x);
  if (!cmd) return "";
  if (cmd === "help" || cmd === "?")
    return ["Available commands:", "  ipconfig                       show this computer's IP settings", "  ipconfig /all                  include MAC address and DNS", "  ipconfig <ip> <mask> [gateway] set a static address", "  ipconfig /renew                get an address from DHCP", "  ipconfig /release              give the DHCP address back", "  ping <ip>                      test reachability", "  tracert <ip>                   list the routers on the path", "  arp -a                         show the ARP cache", "  curl http://<ip>               open a web page (TCP 80)", "  ssh -l <user> <ip>             log in to a device with SSH", "  telnet <ip>                    log in to a device with Telnet"].join("\n");
  if (cmd === "ipconfig") {
    const sub = t[1]?.toLowerCase();
    if (sub === "/renew") {
      const r = dhcpRequest(s.net, s.dev, true);
      if ("error" in r) return `DHCP request failed. ${r.error}`;
      h.dhcp = true;
      h.ip = r.ip;
      h.prefix = r.prefix;
      h.gateway = r.gateway;
      h.dns = r.dns;
      return pcRun(s, "ipconfig");
    }
    if (sub === "/release") {
      h.ip = h.prefix = h.gateway = h.dns = undefined;
      return "IP address released.";
    }
    if (sub && sub !== "/all") {
      const a = parse(t[1]), m = parse(t[2]), g = t[3] ? parse(t[3]) : undefined;
      const p = m === null ? null : prefixFromMask(m);
      if (a === null || p === null || g === null) return "Invalid command. Use: ipconfig <ip address> <subnet mask> [default gateway]";
      h.dhcp = false;
      h.ip = a;
      h.prefix = p;
      h.gateway = g;
      return "";
    }
    const lines = ["", "Ethernet adapter FastEthernet0:", ""];
    if (sub === "/all") lines.push(`   Physical Address. . . . . . . . . : ${macOf(d, "FastEthernet0").toUpperCase()}`, `   DHCP Enabled. . . . . . . . . . . : ${h.dhcp ? "Yes" : "No"}`);
    lines.push(`   IPv4 Address. . . . . . . . . . . : ${h.ip !== undefined ? ip(h.ip) : "0.0.0.0"}`);
    lines.push(`   Subnet Mask . . . . . . . . . . . : ${h.prefix !== undefined ? ip(maskFromPrefix(h.prefix)) : "0.0.0.0"}`);
    lines.push(`   Default Gateway . . . . . . . . . : ${h.gateway !== undefined ? ip(h.gateway) : "0.0.0.0"}`);
    if (sub === "/all") lines.push(`   DNS Servers . . . . . . . . . . . : ${h.dns !== undefined ? ip(h.dns) : "0.0.0.0"}`);
    return lines.join("\n");
  }
  if (cmd === "ping") {
    const dst = parse(t[1]);
    if (dst === null) return "Ping request could not find host. Please check the name and try again.";
    const r = ping(s.net, s.dev, dst, true);
    const out = ["", `Pinging ${ip(dst)} with 32 bytes of data:`, ""];
    const hops = r.back ? r.back.hops.length - 1 : 0;
    const replyTtl = (r.back && s.net.devices[r.back.hops[0]]?.host ? 128 : 255) - Math.max(0, hops - 1);
    let got = 0;
    for (let k = 0; k < 4; k++) {
      if (r.ok && !(k === 0 && r.firstArp)) {
        out.push(`Reply from ${ip(dst)}: bytes=32 time<1ms TTL=${replyTtl}`);
        got++;
      } else if (!r.ok && r.there?.code === "U") {
        const rtr = r.there.hops[r.there.hops.length - 1];
        const rip = l3Ifaces(s.net, rtr)[0];
        out.push(`Reply from ${rip ? ip(rip.ip) : ip(dst)}: Destination host unreachable.`);
      } else out.push("Request timed out.");
    }
    out.push("", `Ping statistics for ${ip(dst)}:`, `    Packets: Sent = 4, Received = ${r.ok ? got : r.there?.code === "U" ? 4 : 0}, Lost = ${r.ok ? 4 - got : r.there?.code === "U" ? 0 : 4} (${r.ok ? (4 - got) * 25 : r.there?.code === "U" ? 0 : 100}% loss),`);
    return out.join("\n");
  }
  if (cmd === "tracert" || cmd === "traceroute") {
    const dst = parse(t[1]);
    if (dst === null) return "Unable to resolve target system name.";
    return doTrace(s, dst, true);
  }
  if (cmd === "arp" && t[1] === "-a") {
    const rows = Object.entries(d.arp);
    if (!rows.length) return "No ARP Entries Found";
    return ["  Internet Address      Physical Address      Type", ...rows.map(([a, m]) => `  ${a.padEnd(22)}${m.padEnd(22)}dynamic`)].join("\n");
  }
  if (cmd === "curl" || cmd === "web" || cmd === "http") {
    const m = (t[1] ?? "").match(/^(?:https?:\/\/)?(\d{1,3}(?:\.\d{1,3}){3})(?::(\d+))?/);
    if (!m) return "Usage: curl http://<ip address>";
    const port = Number(m[2] ?? (t[1]?.startsWith("https") ? 443 : 80));
    const r = tcpConnect(s.net, s.dev, parse(m[1])!, port, true);
    return r.ok ? `HTTP/1.1 200 OK\n\n<html><body><h1>It works</h1><p>Served by ${m[1]}</p></body></html>` : `curl: (28) Failed to connect to ${m[1]} port ${port}: Connection timed out`;
  }
  if (cmd === "ssh") {
    const li = t.indexOf("-l");
    const user = li >= 0 ? t[li + 1] : undefined;
    const dst = parse(t[t.length - 1]);
    if (!user || dst === null) return "Usage: ssh -l <username> <ip address>";
    return connectRemote(s, dst, "ssh", user);
  }
  if (cmd === "telnet") {
    const dst = parse(t[1]);
    if (dst === null) return "Usage: telnet <ip address>";
    return connectRemote(s, dst, "telnet");
  }
  return "Invalid Command.";
}

// ─── Entry points ─────────────────────────────────────────────────────────

function tokenize(line: string) {
  return line.trim().split(/\s+/).filter(Boolean);
}

function runLine(s: Session, raw: string): string {
  const d = device(s);
  if (d.host) return pcRun(s, raw);
  const [cmdPart, ...pipes] = raw.split("|");
  let toks = tokenize(cmdPart);
  if (!toks.length) return "";
  let negate = false;
  if (toks[0].toLowerCase() === "no" && s.mode !== "user" && s.mode !== "priv") {
    negate = true;
    toks = toks.slice(1);
    if (!toks.length) return "% Incomplete command.";
  }
  const specs = specsFor(s).filter((x) => (negate ? x.no : x.run || !x.no));
  let r = resolve(specs, toks);
  // Like IOS, a global command typed in a sub-mode (e.g. access-list under an interface) drops back to global config.
  if (r.kind === "invalid" && !["user", "priv", "config"].includes(s.mode)) {
    const g = resolve([...configSpecs, ...commonConfig].filter((x) => (negate ? x.no : x.run || !x.no)), toks);
    if (g.kind === "run") {
      s.mode = "config";
      s.ifaces = [];
      r = g;
    }
  }
  if (r.kind === "ambiguous") return `% Ambiguous command:  "${raw.trim()}"`;
  if (r.kind === "incomplete") return "% Incomplete command.";
  if (r.kind === "invalid") {
    // In exec mode an unknown first word is treated as a hostname to telnet to, like real IOS.
    if (r.at === 0 && (s.mode === "user" || s.mode === "priv") && toks.length === 1) {
      return d.domainLookup
        ? `Translating "${toks[0]}"...domain server (255.255.255.255)\n% Unknown command or computer name, or unable to find computer address`
        : `Translating "${toks[0]}"\n% Unknown command or computer name, or unable to find computer address`;
    }
    const offset = cmdPart.indexOf(toks[Math.min(r.at, toks.length - 1)], negate ? cmdPart.toLowerCase().indexOf("no") + 2 : 0);
    return `${" ".repeat(prompt(s).length + Math.max(0, offset))}^\n${INVALID}`;
  }
  const handler = negate ? r.spec.no! : r.spec.run;
  if (!handler) return "";
  const configMode = !["user", "priv"].includes(s.mode);
  let out = configMode || r.spec.pattern.startsWith("reload") ? withEvents(s, () => handler(s, r.args)) : handler(s, r.args) ?? "";
  if (pipes.length && out) out = pipeFilter(out, pipes.join("|"));
  return out;
}

/** Run one line typed at the prompt. */
export function run(s: Session, input: string): Result {
  if (s.pending) {
    const p = s.pending;
    return { output: p.then(input) };
  }
  const d = device(s);
  const trimmed = input.replace(/\s+$/, "");
  if (trimmed.endsWith("?") && !d.host) {
    const body = trimmed.slice(0, -1);
    const endsWithSpace = /\s$/.test(body) || body === "";
    let toks = tokenize(body);
    const specs = specsFor(s);
    let negateSpecs = specs;
    if (toks[0]?.toLowerCase() === "no" && s.mode !== "user" && s.mode !== "priv") {
      toks = toks.slice(1);
      negateSpecs = specs.filter((x) => x.no);
    }
    const lines = endsWithSpace ? helpFor(negateSpecs, toks, null) : helpFor(negateSpecs, toks.slice(0, -1), toks[toks.length - 1] ?? "");
    return { output: lines.join("\n") || "% Unrecognized command", keep: body };
  }
  if (trimmed) s.history.push(trimmed);
  const out = runLine(s, trimmed);
  return { output: out };
}

/** Tab completion: returns the completed line or null. */
export function tab(s: Session, input: string): string | null {
  const d = device(s);
  if (d.host || /\s$/.test(input)) return null;
  let toks = tokenize(input);
  if (!toks.length) return null;
  let prefixNo = "";
  if (toks[0].toLowerCase() === "no" && toks.length > 1) {
    prefixNo = "no ";
    toks = toks.slice(1);
  }
  const done = completeTok(specsFor(s), toks.slice(0, -1), toks[toks.length - 1]);
  if (!done) return null;
  return `${prefixNo}${[...toks.slice(0, -1), done].join(" ")} `;
}

/** Interfaces sorted for display in device panels. */
export function interfaceList(net: Net, dev: string) {
  const d = net.devices[dev];
  return Object.keys(d.ifaces).sort(compareIf).map((n) => ({ name: n, ...ifStatus(net, dev, n), up: physUp(net, dev, n) }));
}

export { topology, routingTables };
