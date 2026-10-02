// The network engine: from device configs and cables, work out what is up, which VLANs reach
// where, what each router's routing table holds, and whether a packet gets through.

import { ipToString, maskFromPrefix } from "../lib/subnet.ts";
import type { Acl, Device, Iface } from "./model.ts";
import { macOf } from "./model.ts";
import { bandwidthKbps, ifTypeOf, parentOf, shortName } from "./names.ts";

export type Link = { a: [string, string]; b: [string, string] };
export type Net = { devices: Record<string, Device>; links: Link[] };

const inSubnet = (ip: number, net: number, prefix: number) => ((ip & maskFromPrefix(prefix)) >>> 0) === ((net & maskFromPrefix(prefix)) >>> 0);
const netOf = (ip: number, prefix: number) => (ip & maskFromPrefix(prefix)) >>> 0;

// ─── Physical layer ───────────────────────────────────────────────────────

export function peerOf(net: Net, dev: string, ifname: string): [string, string] | null {
  for (const l of net.links) {
    if (l.a[0] === dev && l.a[1] === ifname) return l.b;
    if (l.b[0] === dev && l.b[1] === ifname) return l.a;
  }
  return null;
}

const adminUp = (i: Iface | undefined) => Boolean(i && !i.shutdown && !i.errDisabled);

/** Line protocol of a physical (or host) interface: both ends enabled and cabled together. */
export function physUp(net: Net, dev: string, ifname: string) {
  const d = net.devices[dev];
  if (!adminUp(d?.ifaces[ifname])) return false;
  const p = peerOf(net, dev, ifname);
  return Boolean(p && adminUp(net.devices[p[0]]?.ifaces[p[1]]));
}

/** "up", "down" or "administratively down" plus protocol state, as show ip interface brief prints them. */
export function ifStatus(net: Net, dev: string, ifname: string): { status: string; protocol: string; up: boolean } {
  const d = net.devices[dev];
  const i = d.ifaces[ifname];
  if (!i) return { status: "deleted", protocol: "down", up: false };
  if (i.shutdown) return { status: "administratively down", protocol: "down", up: false };
  if (i.errDisabled) return { status: "down", protocol: "down", up: false };
  const type = ifTypeOf(ifname);
  if (type === "Loopback") return { status: "up", protocol: "up", up: true };
  const parent = parentOf(ifname);
  if (parent) {
    const ps = ifStatus(net, dev, parent);
    return { status: ps.status === "administratively down" ? "down" : ps.status, protocol: ps.up ? "up" : "down", up: ps.up };
  }
  if (type === "Vlan") {
    const vlan = Number(ifname.slice(4));
    const up = Boolean(d.vlans[vlan]) && vlanHasUpPort(net, dev, vlan);
    return { status: "up", protocol: up ? "up" : "down", up };
  }
  if (type === "Port-channel") {
    const up = channelMembers(d, Number(ifname.slice(12))).some((m) => bundled(net, dev, m.name));
    return { status: up ? "up" : "down", protocol: up ? "up" : "down", up };
  }
  const up = physUp(net, dev, ifname);
  return { status: up ? "up" : "down", protocol: up ? "up" : "down", up };
}

// ─── EtherChannel ─────────────────────────────────────────────────────────

export function channelMembers(d: Device, group: number) {
  return Object.values(d.ifaces).filter((i) => i.channel?.group === group);
}

const PAIRS: Record<string, string[]> = {
  active: ["active", "passive"],
  passive: ["active"],
  on: ["on"],
  desirable: ["desirable", "auto"],
  auto: ["desirable"],
};

/** A member port is bundled when it is up and its peer is in a channel group with a compatible mode. */
export function bundled(net: Net, dev: string, ifname: string) {
  const i = net.devices[dev].ifaces[ifname];
  if (!i?.channel || !physUp(net, dev, ifname)) return false;
  const p = peerOf(net, dev, ifname);
  const pi = p && net.devices[p[0]].ifaces[p[1]];
  return Boolean(pi?.channel && PAIRS[i.channel.mode].includes(pi.channel.mode));
}

/** Layer 2 settings that apply to a port: a channel member uses its port-channel's settings. */
function l2(d: Device, i: Iface): Iface {
  if (i.channel) return d.ifaces[`Port-channel${i.channel.group}`] ?? i;
  return i;
}

// ─── Layer 2 ──────────────────────────────────────────────────────────────

const isSwitch = (d: Device) => d.kind === "switch" || d.kind === "l3switch";

/** Is this interface a Layer 2 switchport? */
export function isL2(d: Device, i: Iface) {
  return isSwitch(d) && i.switchport && !ifTypeOf(i.name)?.match(/Vlan|Loopback/);
}

/** Negotiated mode of a switchport on a link (DTP). */
export function operMode(net: Net, dev: string, ifname: string): "access" | "trunk" {
  const d = net.devices[dev];
  const i = l2(d, d.ifaces[ifname]);
  const p = peerOf(net, dev, ifname);
  const pd = p && net.devices[p[0]];
  const pi = pd && pd.ifaces[p[1]];
  if (i.mode === "access") return "access";
  if (i.mode === "trunk") return "trunk";
  // Dynamic modes need a DTP-speaking switch on the other end.
  if (!pd || !pi || !isL2(pd, pi)) return "access";
  const peer = l2(pd, pi);
  if (peer.mode === "access") return "access";
  if (peer.mode === "trunk") return peer.nonegotiate ? "access" : "trunk";
  if (i.mode === "dynamic desirable" || peer.mode === "dynamic desirable") return "trunk";
  return "access"; // auto + auto
}

function trunkAllows(i: Iface, vlan: number) {
  return i.allowed === null || i.allowed.includes(vlan);
}

/** VLANs this port forwards: [vlan, tagged?] */
function portVlans(net: Net, dev: string, ifname: string): [number, boolean][] {
  const d = net.devices[dev];
  const i = l2(d, d.ifaces[ifname]);
  if (operMode(net, dev, ifname) === "access") return d.vlans[i.accessVlan] ? [[i.accessVlan, false], ...(i.voiceVlan && d.vlans[i.voiceVlan] ? ([[i.voiceVlan, true]] as [number, boolean][]) : [])] : [];
  return Object.keys(d.vlans)
    .map(Number)
    .filter((v) => v < 1002 && trunkAllows(i, v))
    .map((v) => [v, v !== i.nativeVlan] as [number, boolean]);
}

function vlanHasUpPort(net: Net, dev: string, vlan: number) {
  const d = net.devices[dev];
  return Object.values(d.ifaces).some((i) => isL2(d, i) && !i.channel && physUp(net, dev, i.name) && portVlans(net, dev, i.name).some(([v]) => v === vlan))
    || Object.values(d.ifaces).some((i) => i.channel && bundled(net, dev, i.name) && portVlans(net, dev, i.name).some(([v]) => v === vlan));
}

class UnionFind {
  parent = new Map<string, string>();
  find(x: string): string {
    if (!this.parent.has(x)) this.parent.set(x, x);
    const p = this.parent.get(x)!;
    if (p === x) return x;
    const r = this.find(p);
    this.parent.set(x, r);
    return r;
  }
  union(a: string, b: string) {
    const ra = this.find(a), rb = this.find(b);
    if (ra !== rb) this.parent.set(ra, rb);
  }
}

/** L3 interfaces (with addresses) on a device that are up. */
export type L3If = { dev: string; name: string; ip: number; prefix: number; up: boolean };

export function l3Ifaces(net: Net, dev: string): L3If[] {
  const d = net.devices[dev];
  const out: L3If[] = [];
  if (d.host) {
    if (d.host.ip !== undefined && d.host.prefix !== undefined) out.push({ dev, name: "FastEthernet0", ip: d.host.ip, prefix: d.host.prefix, up: physUp(net, dev, "FastEthernet0") });
    return out;
  }
  for (const i of Object.values(d.ifaces)) {
    if (!i.ipv4 || i.ipv4 === "dhcp") continue;
    if (isL2(d, i)) continue;
    out.push({ dev, name: i.name, ip: i.ipv4.ip, prefix: i.ipv4.prefix, up: ifStatus(net, dev, i.name).up });
  }
  return out;
}

export type Topo = {
  segOf: (dev: string, ifname: string) => string | null;
  /** Up L3 interfaces in a segment. */
  members: (seg: string) => L3If[];
  /** Switches and VLANs a segment spans (for MAC learning). */
  uf: UnionFind;
};

/** Build broadcast domains (segments) from VLANs, trunks and cables. */
export function topology(net: Net): Topo {
  const uf = new UnionFind();
  const swNode = (dev: string, v: number) => `sw:${dev}:${v}`;
  const ifNode = (dev: string, n: string) => `if:${dev}:${n}`;

  for (const [id, d] of Object.entries(net.devices)) {
    if (!isSwitch(d)) continue;
    for (const v of Object.keys(d.vlans)) uf.find(swNode(id, Number(v)));
    // SVIs join their VLAN on this switch.
    for (const i of Object.values(d.ifaces)) {
      if (ifTypeOf(i.name) === "Vlan" && !i.shutdown) {
        const v = Number(i.name.slice(4));
        if (d.vlans[v]) uf.union(ifNode(id, i.name), swNode(id, v));
      }
    }
  }

  for (const link of net.links) {
    const [ad, ai] = link.a, [bd, bi] = link.b;
    if (!physUp(net, ad, ai)) continue;
    const A = net.devices[ad], B = net.devices[bd];
    const aL2 = isL2(A, A.ifaces[ai]), bL2 = isL2(B, B.ifaces[bi]);
    if (A.ifaces[ai].channel && !bundled(net, ad, ai)) continue;
    if (aL2 && bL2) {
      const av = portVlans(net, ad, ai), bv = portVlans(net, bd, bi);
      const aUntag = av.find(([, t]) => !t), bUntag = bv.find(([, t]) => !t);
      // Untagged frames: native/access VLAN on each side (a mismatch leaks between VLANs, as on real switches).
      if (aUntag && bUntag) uf.union(swNode(ad, aUntag[0]), swNode(bd, bUntag[0]));
      for (const [v, tagged] of av) if (tagged && bv.some(([w, t]) => t && w === v)) uf.union(swNode(ad, v), swNode(bd, v));
    } else if (aL2 || bL2) {
      const [sd, si, rd, ri] = aL2 ? [ad, ai, bd, bi] : [bd, bi, ad, ai];
      const sv = portVlans(net, sd, si);
      const untag = sv.find(([, t]) => !t);
      const R = net.devices[rd];
      // Router's untagged traffic: the physical interface itself or a native subinterface.
      if (untag) {
        uf.union(ifNode(rd, ri), swNode(sd, untag[0]));
        for (const sub of Object.values(R.ifaces)) if (parentOf(sub.name) === ri && sub.encapsulation?.native && !sub.shutdown) uf.union(ifNode(rd, sub.name), swNode(sd, untag[0]));
      }
      for (const sub of Object.values(R.ifaces)) {
        if (parentOf(sub.name) !== ri || !sub.encapsulation || sub.encapsulation.native || sub.shutdown) continue;
        if (sv.some(([v, t]) => t && v === sub.encapsulation!.vlan)) uf.union(ifNode(rd, sub.name), swNode(sd, sub.encapsulation.vlan));
      }
    } else {
      uf.union(ifNode(ad, ai), ifNode(bd, bi));
      // Matching 802.1Q subinterfaces on a router-to-router link.
      for (const sa of Object.values(A.ifaces)) {
        if (parentOf(sa.name) !== ai || !sa.encapsulation) continue;
        for (const sb of Object.values(B.ifaces)) if (parentOf(sb.name) === bi && sb.encapsulation?.vlan === sa.encapsulation.vlan) uf.union(ifNode(ad, sa.name), ifNode(bd, sb.name));
      }
    }
  }

  const all = Object.keys(net.devices).flatMap((id) => l3Ifaces(net, id));
  const bySeg = new Map<string, L3If[]>();
  for (const i of all) {
    if (!i.up) continue;
    const s = uf.find(ifNode(i.dev, i.name));
    bySeg.set(s, [...(bySeg.get(s) ?? []), i]);
  }
  return {
    segOf: (dev, ifname) => uf.find(ifNode(dev, ifname)),
    members: (seg) => bySeg.get(seg) ?? [],
    uf,
  };
}

// ─── Routing ──────────────────────────────────────────────────────────────

export type Route = { code: string; prefix: number; len: number; ad: number; metric: number; nextHop?: number; iface?: string };

export const routes = (d: Device) => d.kind === "router" || (d.kind === "l3switch" && d.ipRouting);

function ospfCost(d: Device, ifname: string, refBw: number) {
  const i = d.ifaces[ifname];
  if (i?.ospfCost) return i.ospfCost;
  return Math.max(1, Math.floor((refBw * 1000) / bandwidthKbps(ifname)));
}

export function routerId(net: Net, dev: string, pid: number) {
  const d = net.devices[dev];
  const p = d.ospf[pid];
  if (p?.routerId) return p.routerId;
  const ups = l3Ifaces(net, dev).filter((i) => i.up);
  const loops = ups.filter((i) => ifTypeOf(i.name) === "Loopback");
  const pool = loops.length ? loops : ups;
  return pool.length ? Math.max(...pool.map((i) => i.ip >>> 0)) >>> 0 : 0;
}

/** Interfaces OSPF runs on: via `network` statements (most specific first) or `ip ospf <pid> area <a>`. */
export function ospfIfaces(net: Net, dev: string) {
  const d = net.devices[dev];
  const out: { name: string; pid: number; area: string; ip: number; prefix: number; passive: boolean; up: boolean }[] = [];
  for (const i of l3Ifaces(net, dev)) {
    const cfg = d.ifaces[i.name];
    let hit: { pid: number; area: string } | undefined = cfg?.ospf;
    if (!hit) {
      for (const p of Object.values(d.ospf)) {
        const nets = [...p.networks].sort((a, b) => (a.wc >>> 0) - (b.wc >>> 0));
        const n = nets.find((n) => ((i.ip & ~n.wc) >>> 0) === ((n.ip & ~n.wc) >>> 0));
        if (n) {
          hit = { pid: p.pid, area: n.area };
          break;
        }
      }
    }
    if (!hit || !d.ospf[hit.pid]) continue;
    const proc = d.ospf[hit.pid];
    const listed = proc.passive.includes(i.name);
    const passive = ifTypeOf(i.name) === "Loopback" || (proc.passiveDefault ? !listed : listed);
    out.push({ name: i.name, pid: hit.pid, area: normArea(hit.area), ip: i.ip, prefix: i.prefix, passive, up: i.up });
  }
  return out;
}

export const normArea = (a: string) => (/^\d+$/.test(a) ? String(Number(a)) : a.split(".").reduce((n, o) => n * 256 + Number(o), 0).toString());

export type OspfNeighbor = { dev: string; neighborId: number; address: number; iface: string; state: string; pri: number; peerIf: string };

/** OSPF adjacencies, with DR/BDR election on multi-access segments. */
export function ospfNeighbors(net: Net, topo = topology(net)): Record<string, OspfNeighbor[]> {
  const out: Record<string, OspfNeighbor[]> = {};
  type E = { dev: string; name: string; ip: number; prefix: number; area: string; rid: number; pri: number; p2p: boolean };
  const bySeg = new Map<string, E[]>();
  for (const [id, d] of Object.entries(net.devices)) {
    if (!routes(d)) continue;
    for (const o of ospfIfaces(net, id)) {
      if (!o.up || o.passive) continue;
      const rid = routerId(net, id, o.pid);
      const seg = topo.segOf(id, o.name);
      if (!seg || !rid) continue;
      const cfg = d.ifaces[o.name];
      bySeg.set(seg, [...(bySeg.get(seg) ?? []), { dev: id, name: o.name, ip: o.ip, prefix: o.prefix, area: o.area, rid, pri: cfg?.ospfPriority ?? 1, p2p: Boolean(cfg?.ospfPointToPoint) }]);
    }
  }
  for (const list of bySeg.values()) {
    // Neighbours must share subnet, mask and area, and have different router IDs.
    const groups: E[][] = [];
    for (const e of list) {
      const g = groups.find((g) => g[0].prefix === e.prefix && netOf(g[0].ip, g[0].prefix) === netOf(e.ip, e.prefix) && g[0].area === e.area && g[0].p2p === e.p2p);
      if (g) g.push(e);
      else groups.push([e]);
    }
    for (const g of groups) {
      if (g.length < 2) continue;
      const p2p = g.length === 2 && g.every((e) => e.p2p);
      const eligible = [...g].filter((e) => e.pri > 0).sort((a, b) => b.pri - a.pri || (b.rid >>> 0) - (a.rid >>> 0));
      const dr = p2p ? undefined : eligible[0];
      const bdr = p2p ? undefined : eligible[1];
      const role = (e: E) => (p2p ? "" : e === dr ? "DR" : e === bdr ? "BDR" : "DROTHER");
      for (const me of g) {
        for (const nb of g) {
          if (nb === me || nb.rid === me.rid) continue;
          const full = p2p || me === dr || me === bdr || nb === dr || nb === bdr;
          const state = p2p ? "FULL/  -" : `${full ? "FULL" : "2WAY"}/${role(nb)}`;
          (out[me.dev] ??= []).push({ dev: nb.dev, neighborId: nb.rid, address: nb.ip, iface: me.name, state, pri: nb.pri, peerIf: nb.name });
        }
      }
    }
  }
  return out;
}

function connected(net: Net, dev: string): Route[] {
  const out: Route[] = [];
  for (const i of l3Ifaces(net, dev)) {
    if (!i.up) continue;
    out.push({ code: "C", prefix: netOf(i.ip, i.prefix), len: i.prefix, ad: 0, metric: 0, iface: i.name });
    if (i.prefix < 32) out.push({ code: "L", prefix: i.ip >>> 0, len: 32, ad: 0, metric: 0, iface: i.name });
  }
  return out;
}

function pick(cands: Route[]) {
  const best = new Map<string, Route[]>();
  for (const r of cands) {
    const k = `${r.prefix}/${r.len}`;
    const cur = best.get(k);
    if (!cur || r.ad < cur[0].ad || (r.ad === cur[0].ad && r.metric < cur[0].metric)) best.set(k, [r]);
    else if (r.ad === cur[0].ad && r.metric === cur[0].metric && r.code !== "C" && r.code !== "L") cur.push(r);
  }
  return [...best.values()].flat();
}

/** Installed routes of every routing device (OSPF computed across the whole network). */
export function routingTables(net: Net, topo = topology(net)): Record<string, Route[]> {
  const tables: Record<string, Route[]> = {};
  const nbrs = ospfNeighbors(net, topo);

  // Connected + static first (statics need connected routes to resolve).
  for (const [id, d] of Object.entries(net.devices)) {
    if (!routes(d)) continue;
    const conn = connected(net, id);
    const statics: Route[] = [];
    for (const s of d.statics) {
      if (s.iface) {
        if (!ifStatus(net, id, s.iface).up) continue;
      } else if (s.nextHop !== undefined) {
        if (!conn.some((c) => c.code === "C" && inSubnet(s.nextHop!, c.prefix, c.len)) && !d.statics.some((o) => o !== s && o.iface && inSubnet(s.nextHop!, o.prefix, o.len))) continue;
      }
      statics.push({ code: s.prefix === 0 && s.len === 0 ? "S*" : "S", prefix: s.prefix, len: s.len, ad: s.ad, metric: 0, nextHop: s.nextHop, iface: s.iface });
    }
    tables[id] = [...conn, ...statics];
  }

  // OSPF: shortest paths over the adjacency graph.
  const ospfDevs = Object.keys(nbrs).filter((id) => routes(net.devices[id]));
  const adj = new Map<string, { to: string; cost: number; via: number; iface: string }[]>();
  for (const id of ospfDevs) {
    const d = net.devices[id];
    const refBw = Object.values(d.ospf)[0]?.refBw ?? 100;
    adj.set(
      id,
      (nbrs[id] ?? []).filter((n) => n.state.startsWith("FULL")).map((n) => ({ to: n.dev, cost: ospfCost(d, n.iface, refBw), via: n.address, iface: n.iface })),
    );
  }
  const advertisers = (id: string) => {
    const d = net.devices[id];
    const refBw = Object.values(d.ospf)[0]?.refBw ?? 100;
    return ospfIfaces(net, id)
      .filter((o) => o.up)
      .map((o) => (ifTypeOf(o.name) === "Loopback" ? { prefix: o.ip >>> 0, len: 32, cost: 1 } : { prefix: netOf(o.ip, o.prefix), len: o.prefix, cost: ospfCost(d, o.name, refBw) }));
  };
  const originators = Object.keys(net.devices).filter((id) => Object.values(net.devices[id].ospf).some((p) => p.defaultOriginate) && (tables[id] ?? []).some((r) => r.len === 0));

  for (const src of ospfDevs) {
    // Dijkstra
    const dist = new Map<string, number>([[src, 0]]);
    const first = new Map<string, { via: number; iface: string }[]>();
    const todo = new Set(ospfDevs);
    while (todo.size) {
      let u: string | undefined;
      for (const n of todo) if (dist.has(n) && (u === undefined || dist.get(n)! < dist.get(u)!)) u = n;
      if (u === undefined) break;
      todo.delete(u);
      for (const e of adj.get(u) ?? []) {
        const nd = dist.get(u)! + e.cost;
        const hop = u === src ? [{ via: e.via, iface: e.iface }] : first.get(u)!;
        if (!dist.has(e.to) || nd < dist.get(e.to)!) {
          dist.set(e.to, nd);
          first.set(e.to, hop);
        } else if (nd === dist.get(e.to)) {
          const merged = [...first.get(e.to)!];
          for (const h of hop) if (!merged.some((m) => m.via === h.via)) merged.push(h);
          first.set(e.to, merged);
        }
      }
    }
    const own = new Set((tables[src] ?? []).filter((r) => r.code === "C" || r.code === "L").map((r) => `${r.prefix}/${r.len}`));
    const best = new Map<string, { metric: number; hops: { via: number; iface: string }[]; prefix: number; len: number }>();
    for (const [rtr, dd] of dist) {
      if (rtr === src) continue;
      for (const a of advertisers(rtr)) {
        const k = `${a.prefix}/${a.len}`;
        if (own.has(k)) continue;
        const metric = dd + a.cost;
        const cur = best.get(k);
        if (!cur || metric < cur.metric) best.set(k, { metric, hops: first.get(rtr)!, prefix: a.prefix, len: a.len });
        else if (metric === cur.metric) for (const h of first.get(rtr)!) if (!cur.hops.some((x) => x.via === h.via)) cur.hops.push(h);
      }
    }
    const extra: Route[] = [];
    for (const b of best.values()) for (const h of b.hops) extra.push({ code: "O", prefix: b.prefix, len: b.len, ad: 110, metric: b.metric, nextHop: h.via, iface: h.iface });
    for (const o of originators) {
      if (o === src || !dist.has(o)) continue;
      for (const h of first.get(o)!) extra.push({ code: "O*E2", prefix: 0, len: 0, ad: 110, metric: 1, nextHop: h.via, iface: h.iface });
    }
    tables[src] = [...tables[src], ...extra];
  }

  for (const id of Object.keys(tables)) tables[id] = pick(tables[id]);
  return tables;
}

export function lookup(table: Route[], ip: number): Route | undefined {
  let best: Route | undefined;
  for (const r of table) if (inSubnet(ip, r.prefix, r.len) && (!best || r.len > best.len)) best = r;
  return best;
}

// ─── ACLs ─────────────────────────────────────────────────────────────────

export type Pkt = { src: number; dst: number; proto: "icmp" | "tcp" | "udp"; srcPort?: number; dstPort?: number; icmpType?: "echo" | "echo-reply" };

const wcMatch = (ip: number, m: { ip: number; wc: number }) => ((ip & ~m.wc) >>> 0) === ((m.ip & ~m.wc) >>> 0);
function portMatch(p: number | undefined, spec: { op: string; ports: number[] } | undefined) {
  if (!spec) return true;
  if (p === undefined) return false;
  const [a, b] = spec.ports;
  return spec.op === "eq" ? p === a : spec.op === "neq" ? p !== a : spec.op === "gt" ? p > a : spec.op === "lt" ? p < a : p >= a && p <= b;
}

/** Evaluate an ACL. A missing ACL permits everything, as on IOS. */
export function aclPermits(acl: Acl | undefined, pkt: Pkt, count: boolean) {
  if (!acl) return true;
  for (const e of acl.entries) {
    if (e.action === "remark") continue;
    if (acl.type === "standard") {
      if (!e.src || wcMatch(pkt.src, e.src)) {
        if (count) e.hits++;
        return e.action === "permit";
      }
      continue;
    }
    if (e.proto && e.proto !== "ip" && e.proto !== pkt.proto) continue;
    if (e.src && !wcMatch(pkt.src, e.src)) continue;
    if (e.dst && !wcMatch(pkt.dst, e.dst)) continue;
    if (e.proto === "tcp" || e.proto === "udp") {
      if (!portMatch(pkt.srcPort, e.srcPort) || !portMatch(pkt.dstPort, e.dstPort)) continue;
      if (e.established && pkt.dstPort !== undefined && pkt.dstPort < 1024) continue;
    }
    if (e.proto === "icmp" && e.icmpType && e.icmpType !== pkt.icmpType) continue;
    if (count) e.hits++;
    return e.action === "permit";
  }
  return false;
}

// ─── Forwarding ───────────────────────────────────────────────────────────

export type Trace = { ok: boolean; code: "!" | "U" | "."; reason?: string; hops: string[]; finalDev?: string; pkt: Pkt };

function ownsIp(net: Net, dev: string, ip: number) {
  return l3Ifaces(net, dev).some((i) => i.up && i.ip >>> 0 === ip >>> 0);
}

function natPermits(d: Device, acl: string, src: number) {
  return aclPermits(d.acls[acl], { src, dst: 0, proto: "icmp" }, false);
}

/** Walk a packet from `start` towards pkt.dst. Mutates NAT tables, MAC/ARP tables and ACL counters when `record` is true. */
export type Ctx = { topo: Topo; tables: Record<string, Route[]>; xlate: Map<string, { insideLocal: string; insideGlobal: string }[]> };

export function newCtx(net: Net): Ctx {
  const topo = topology(net);
  return { topo, tables: routingTables(net, topo), xlate: new Map() };
}

export function forward(net: Net, start: string, pkt: Pkt, record: boolean, ctx: Ctx): Trace {
  let at = start;
  let inIf: string | undefined;
  let p: Pkt = { ...pkt };
  const hops = [start];
  for (let ttl = 0; ttl < 32; ttl++) {
    const d = net.devices[at];
    // Undo NAT for traffic arriving on an outside interface.
    if (inIf && d.ifaces[inIf]?.nat === "outside") {
      const st = d.nat.statics.find((s) => s.global >>> 0 === p.dst >>> 0);
      const matches = (t: { insideGlobal: string }) => t.insideGlobal.split(":")[0] === ipToString(p.dst) && (p.dstPort === undefined || t.insideGlobal.endsWith(`:${p.dstPort}`));
      const dyn = (ctx.xlate.get(at) ?? []).find(matches) ?? d.nat.table.find(matches);
      if (st) p = { ...p, dst: st.local };
      else if (dyn) {
        const [ip, port] = dyn.insideLocal.split(":");
        p = { ...p, dst: parseDotted(ip), dstPort: p.dstPort === undefined ? undefined : Number(port) };
      }
    }
    if (inIf && !aclPermits(d.acls[d.ifaces[inIf]?.aclIn ?? ""], p, record)) return { ok: false, code: "U", reason: `${d.hostname}: access list ${d.ifaces[inIf].aclIn} denied the packet coming in on ${shortName(inIf)}`, hops, pkt: p };
    if (ownsIp(net, at, p.dst)) return { ok: true, code: "!", hops, finalDev: at, pkt: p };

    let egress: string | undefined;
    let nextHop: number | undefined;
    if (routes(d)) {
      const r = lookup(ctx.tables[at] ?? [], p.dst);
      if (!r) return { ok: false, code: at === start ? "." : "U", reason: `${d.hostname} has no route to ${ipToString(p.dst)}`, hops, pkt: p };
      if (r.iface) egress = r.iface;
      nextHop = r.code === "C" ? p.dst : r.nextHop;
      if (!egress && nextHop !== undefined) {
        const r2 = lookup(ctx.tables[at] ?? [], nextHop);
        egress = r2?.iface;
      }
      if (nextHop === undefined) nextHop = p.dst;
    } else {
      const mine = l3Ifaces(net, at).find((i) => i.up);
      if (!mine) return { ok: false, code: ".", reason: `${d.hostname} has no working IP address`, hops, pkt: p };
      egress = mine.name;
      const gw = d.host ? d.host.gateway : d.defaultGateway;
      if (inSubnet(p.dst, mine.ip, mine.prefix)) nextHop = p.dst;
      else if (gw !== undefined) nextHop = gw;
      else return { ok: false, code: ".", reason: `${d.hostname} has no default gateway for ${ipToString(p.dst)}`, hops, pkt: p };
    }
    if (!egress) return { ok: false, code: ".", reason: `${d.hostname} can't find an exit interface`, hops, pkt: p };
    if (at === start && p.src === 0) {
      const mine = l3Ifaces(net, at).find((i) => i.name === egress);
      p = { ...p, src: mine?.ip ?? 0 };
    }
    // Source NAT from an inside to an outside interface.
    const outIf = d.ifaces[egress];
    if (outIf?.nat === "outside" && (!inIf || d.ifaces[inIf]?.nat === "inside")) {
      const st = d.nat.statics.find((s) => s.local >>> 0 === p.src >>> 0);
      if (st) p = { ...p, src: st.global };
      else {
        const rule = d.nat.rules.find((r) => natPermits(d, r.acl, p.src));
        const outIp = !rule ? undefined : rule.iface ? l3Ifaces(net, at).find((i) => i.name === rule.iface)?.ip : rule.pool ? d.nat.pools[rule.pool]?.start : undefined;
        if (rule && outIp !== undefined) {
          const port = p.srcPort ?? 1024 + ((d.nat.table.length + (ctx.xlate.get(at)?.length ?? 0)) % 4000);
          const local = `${ipToString(p.src)}:${port}`;
          const global = `${ipToString(outIp)}:${port}`;
          const remote = `${ipToString(p.dst)}:${p.dstPort ?? port}`;
          ctx.xlate.set(at, [...(ctx.xlate.get(at) ?? []), { insideLocal: local, insideGlobal: global }]);
          if (record && !d.nat.table.some((t) => t.insideLocal === local && t.outsideGlobal === remote))
            d.nat.table.push({ proto: p.proto, insideLocal: local, insideGlobal: global, outsideLocal: remote, outsideGlobal: remote });
          p = { ...p, src: outIp };
        }
      }
    }
    if (!aclPermits(d.acls[outIf?.aclOut ?? ""], p, record)) return { ok: false, code: "U", reason: `${d.hostname}: access list ${outIf.aclOut} denied the packet going out ${shortName(egress)}`, hops, pkt: p };

    // ARP: find who owns the next hop on the egress segment.
    const seg = ctx.topo.segOf(at, egress);
    const owner = seg ? ctx.topo.members(seg).find((m) => m.ip >>> 0 === nextHop! >>> 0 && !(m.dev === at && m.name === egress)) : undefined;
    if (!owner) return { ok: false, code: ".", reason: `${d.hostname} sent an ARP request for ${ipToString(nextHop!)} out ${shortName(egress)} and nobody answered`, hops, pkt: p };
    if (record) {
      d.arp[ipToString(nextHop!)] = macOf(net.devices[owner.dev], owner.name);
      learnMacs(net, ctx.topo, at, egress, owner.dev, owner.name);
    }
    at = owner.dev;
    inIf = owner.name;
    hops.push(at);
  }
  return { ok: false, code: ".", reason: "Routing loop: the packet's TTL ran out", hops, pkt: p };
}

function parseDotted(s: string) {
  return s.split(".").reduce((n, o) => n * 256 + Number(o), 0) >>> 0;
}

/** Switches on the path learn the sender's MAC on the port it came in on. */
function learnMacs(net: Net, topo: Topo, fromDev: string, fromIf: string, toDev: string, toIf: string) {
  const mac = macOf(net.devices[fromDev], fromIf);
  const back = macOf(net.devices[toDev], toIf);
  const seg = topo.segOf(fromDev, fromIf);
  // Breadth-first walk over switch ports in the same segment.
  const visit = (startDev: string, startIf: string, learn: string) => {
    const seen = new Set<string>();
    const queue: [string, string][] = [];
    const p0 = peerOf(net, startDev, startIf);
    if (p0) queue.push(p0);
    while (queue.length) {
      const [sd, si] = queue.shift()!;
      const S = net.devices[sd];
      if (!S || !isSwitch(S) || seen.has(`${sd}`)) continue;
      seen.add(sd);
      const port = S.ifaces[si];
      if (!port || !isL2(S, port)) continue;
      const vlan = portVlans(net, sd, si).find(([v]) => topo.uf.find(`sw:${sd}:${v}`) === seg)?.[0];
      if (vlan === undefined) continue;
      S.macTable[learn] = { vlan, port: port.channel ? `Port-channel${port.channel.group}` : si };
      // Port security with sticky learning remembers the first MACs seen on the port.
      const ps = port.portSecurity;
      if (ps.on && ps.sticky && !ps.macs.includes(learn) && !(learn === mac && sd === fromDev)) {
        if (ps.macs.length < ps.max) ps.macs.push(learn);
      }
      for (const other of Object.values(S.ifaces)) {
        if (other.name === si || !isL2(S, other) || !physUp(net, sd, other.name)) continue;
        if (!portVlans(net, sd, other.name).some(([v]) => v === vlan)) continue;
        const nx = peerOf(net, sd, other.name);
        if (nx) queue.push(nx);
      }
    }
  };
  if (seg) {
    visit(fromDev, fromIf, mac);
    visit(toDev, toIf, back);
  }
}

export type PingResult = { ok: boolean; marks: string; reason?: string; firstArp: boolean; there?: Trace; back?: Trace };

/** ICMP echo there and back. */
export function ping(net: Net, from: string, dst: number, record = true, src = 0): PingResult {
  const ctx = newCtx(net);
  const d = net.devices[from];
  const firstHopKey = Object.keys(d.arp).length;
  const there = forward(net, from, { src, dst, proto: "icmp", icmpType: "echo" }, record, ctx);
  if (!there.ok) return { ok: false, marks: there.code === "U" ? "U.U.U" : ".....", reason: there.reason, firstArp: false, there };
  const back = forward(net, there.finalDev!, { src: there.pkt.dst, dst: there.pkt.src, proto: "icmp", icmpType: "echo-reply" }, record, ctx);
  if (!back.ok) return { ok: false, marks: ".....", reason: `Reply lost: ${back.reason}`, firstArp: false, there, back };
  const firstArp = record && Object.keys(d.arp).length > firstHopKey && d.kind !== "pc" && d.kind !== "server";
  return { ok: true, marks: firstArp ? ".!!!!" : "!!!!!", firstArp, there, back };
}

/** A TCP connection attempt (e.g. a browser to a web server). */
export function tcpConnect(net: Net, from: string, dst: number, port: number, record = true) {
  const ctx = newCtx(net);
  const there = forward(net, from, { src: 0, dst, proto: "tcp", srcPort: 49152 + (net.links.length % 1000), dstPort: port }, record, ctx);
  if (!there.ok) return { ok: false, reason: there.reason };
  const server = net.devices[there.finalDev!];
  const listening = server.host?.services.some((s) => (s === "http" && port === 80) || (s === "https" && port === 443) || (s === "dns" && port === 53) || (s === "ftp" && port === 21) || (s === "ssh" && port === 22));
  const sshOnDevice = !server.host && port === 22 && server.rsaBits && (server.lines.vty.transport === null || server.lines.vty.transport.includes("ssh"));
  const telnetOnDevice = !server.host && port === 23 && (server.lines.vty.transport === null || server.lines.vty.transport.includes("telnet")) && server.lines.vty.login !== "none" && (server.lines.vty.password || server.lines.vty.login === "local");
  if (!listening && !sshOnDevice && !telnetOnDevice) return { ok: false, reason: `${server.hostname} refused the connection on port ${port}` };
  // access-class on the VTY lines filters who may open a remote session.
  const ac = !server.host && (port === 22 || port === 23) ? server.lines.vty.accessClass : undefined;
  if (ac && !aclPermits(server.acls[ac], { src: there.pkt.src, dst: there.pkt.dst, proto: "tcp", dstPort: port }, record)) return { ok: false, reason: `${server.hostname}: access-class ${ac} refused ${ipToString(there.pkt.src)}` };
  const back = forward(net, there.finalDev!, { src: there.pkt.dst, dst: there.pkt.src, proto: "tcp", srcPort: port, dstPort: there.pkt.srcPort }, record, ctx);
  if (!back.ok) return { ok: false, reason: `Reply lost: ${back.reason}` };
  return { ok: true };
}

// ─── DHCP ─────────────────────────────────────────────────────────────────

export type Lease = { ip: number; prefix: number; gateway?: number; dns?: number; server: string };

export function dhcpRequest(net: Net, client: string, record = true): Lease | { error: string } {
  const ctx = newCtx(net);
  const topo = ctx.topo;
  const cd = net.devices[client];
  const nic = cd.host ? "FastEthernet0" : Object.values(cd.ifaces).find((i) => i.ipv4 === "dhcp")?.name;
  if (!nic || !physUp(net, client, nic)) return { error: "The network interface is not connected or is down." };
  const seg = topo.segOf(client, nic);
  const onSeg = topo.members(seg!).filter((m) => m.dev !== client);
  const used = new Set(Object.keys(net.devices).flatMap((id) => l3Ifaces(net, id).map((i) => i.ip >>> 0)));
  for (const d of Object.values(net.devices)) for (const b of d.dhcp.bindings) used.add(b.ip >>> 0);

  const serve = (serverId: string, giaddr: L3If): Lease | null => {
    const s = net.devices[serverId];
    const pool = Object.values(s.dhcp.pools).find((p) => p.network && inSubnet(giaddr.ip, p.network.ip, p.network.prefix) && p.network.prefix === giaddr.prefix);
    if (!pool?.network) return null;
    const base = netOf(pool.network.ip, pool.network.prefix);
    const size = 2 ** (32 - pool.network.prefix);
    for (let n = 1; n < size - 1; n++) {
      const ip = (base + n) >>> 0;
      if (used.has(ip)) continue;
      if (s.dhcp.excluded.some(([lo, hi]) => ip >= lo >>> 0 && ip <= hi >>> 0)) continue;
      if (record) s.dhcp.bindings.push({ ip, mac: macOf(cd, nic), pool: pool.name });
      return { ip, prefix: pool.network.prefix, gateway: pool.defaultRouter, dns: pool.dns[0], server: s.hostname };
    }
    return null;
  };

  // A server or router with a pool on this segment answers directly.
  for (const m of onSeg) {
    const lease = serve(m.dev, m);
    if (lease) return lease;
  }
  // Otherwise a relay agent (ip helper-address) on this segment forwards to a remote server.
  for (const m of onSeg) {
    const relay = net.devices[m.dev];
    for (const h of relay.ifaces[m.name]?.helpers ?? []) {
      const t = forward(net, m.dev, { src: m.ip, dst: h, proto: "udp", srcPort: 67, dstPort: 67 }, false, ctx);
      if (!t.ok) continue;
      const lease = serve(t.finalDev!, m);
      if (lease) return lease;
    }
  }
  return { error: "No DHCP server answered on this network." };
}

// ─── Spanning tree ────────────────────────────────────────────────────────

export type StpPort = { iface: string; role: "Root" | "Desg" | "Altn"; state: "FWD" | "BLK"; cost: number };
export type StpVlan = { vlan: number; rootDev: string; rootPriority: number; rootMac: string; rootCost: number; rootPort?: string; bridgePriority: number; bridgeMac: string; ports: StpPort[] };

const portCost = (ifname: string) => (ifTypeOf(ifname) === "FastEthernet" ? 19 : ifTypeOf(ifname) === "TenGigabitEthernet" ? 2 : 4);

export function bridgePriority(d: Device, vlan: number) {
  return (d.stp.priorities[vlan] ?? 32768) + vlan;
}

/** 802.1D-style computation per VLAN: root bridge, root ports, designated and blocked ports. */
export function spanningTree(net: Net, vlan: number): Record<string, StpVlan> {
  const sws = Object.entries(net.devices).filter(([, d]) => isSwitch(d) && d.vlans[vlan]).map(([id]) => id);
  const bid = (id: string) => [bridgePriority(net.devices[id], vlan), macOf(net.devices[id], "base")] as const;
  const less = (a: readonly [number, string], b: readonly [number, string]) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]);
  const carries = (id: string, ifname: string) => physUp(net, id, ifname) && portVlans(net, id, ifname).some(([v]) => v === vlan);
  // Links between switches in this VLAN.
  type E = { a: string; ai: string; b: string; bi: string };
  const edges: E[] = [];
  for (const l of net.links) {
    const [a, ai] = l.a, [b, bi] = l.b;
    if (!sws.includes(a) || !sws.includes(b)) continue;
    if (!isL2(net.devices[a], net.devices[a].ifaces[ai]) || !isL2(net.devices[b], net.devices[b].ifaces[bi])) continue;
    if (!carries(a, ai) || !carries(b, bi)) continue;
    edges.push({ a, ai, b, bi });
  }
  if (!sws.length) return {};
  let root = sws[0];
  for (const s of sws) if (less(bid(s), bid(root))) root = s;
  // Root path cost (Dijkstra with tie-break on neighbour bridge ID, then port).
  const cost = new Map<string, number>([[root, 0]]);
  const rport = new Map<string, { iface: string; nb: string; nbPort: string }>();
  const todo = new Set(sws);
  while (todo.size) {
    let u: string | undefined;
    for (const n of todo) if (cost.has(n) && (u === undefined || cost.get(n)! < cost.get(u)!)) u = n;
    if (u === undefined) break;
    todo.delete(u);
    for (const e of edges) {
      const [x, xi, y, yi] = e.a === u ? [e.a, e.ai, e.b, e.bi] : e.b === u ? [e.b, e.bi, e.a, e.ai] : [];
      if (!x || !todo.has(y!)) continue;
      const c = cost.get(u)! + portCost(yi!);
      const cur = rport.get(y!);
      const better =
        !cost.has(y!) ||
        c < cost.get(y!)! ||
        (c === cost.get(y!) && cur && (less(bid(x), bid(cur.nb)) || (x === cur.nb && xi! < cur.nbPort)));
      if (better) {
        cost.set(y!, c);
        rport.set(y!, { iface: yi!, nb: x, nbPort: xi! });
      }
    }
  }
  const out: Record<string, StpVlan> = {};
  for (const s of sws) {
    const d = net.devices[s];
    const ports: StpPort[] = [];
    for (const i of Object.values(d.ifaces)) {
      if (!isL2(d, i) || !carries(s, i.name)) continue;
      const e = edges.find((e) => (e.a === s && e.ai === i.name) || (e.b === s && e.bi === i.name));
      if (!e) {
        ports.push({ iface: i.name, role: "Desg", state: "FWD", cost: portCost(i.name) });
        continue;
      }
      if (rport.get(s)?.iface === i.name) {
        ports.push({ iface: i.name, role: "Root", state: "FWD", cost: portCost(i.name) });
        continue;
      }
      const [o] = e.a === s ? [e.b, e.bi] : [e.a, e.ai];
      const oPort = e.a === s ? e.bi : e.ai;
      // Designated: lower root cost, then lower bridge ID, then lower port name.
      const mine = [cost.get(s) ?? Infinity, ...bid(s), i.name] as const;
      const theirs = [cost.get(o) ?? Infinity, ...bid(o), oPort] as const;
      const iWin = mine[0] < theirs[0] || (mine[0] === theirs[0] && (mine[1] < theirs[1] || (mine[1] === theirs[1] && (mine[2] < theirs[2] || (mine[2] === theirs[2] && mine[3] < theirs[3])))));
      ports.push(iWin ? { iface: i.name, role: "Desg", state: "FWD", cost: portCost(i.name) } : { iface: i.name, role: "Altn", state: "BLK", cost: portCost(i.name) });
    }
    out[s] = {
      vlan,
      rootDev: root,
      rootPriority: bid(root)[0],
      rootMac: bid(root)[1],
      rootCost: cost.get(s) ?? 0,
      rootPort: rport.get(s)?.iface,
      bridgePriority: bid(s)[0],
      bridgeMac: bid(s)[1],
      ports,
    };
  }
  return out;
}
