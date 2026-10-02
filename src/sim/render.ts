// Text output: running-config and show commands, formatted like Cisco IOS.

import { ipToString, maskFromPrefix } from "../lib/subnet.ts";
import type { Acl, Ace, Device, Iface, Line } from "./model.ts";
import { macOf, sortedIfaces } from "./model.ts";
import { bundled, channelMembers, ifStatus, isL2, l3Ifaces, operMode, ospfIfaces, ospfNeighbors, peerOf, routerId, routingTables, spanningTree, topology, type Net, type Route } from "./net.ts";
import { compareIf, ifTypeOf, shortName } from "./names.ts";

const ip = ipToString;
const mask = (p: number) => ipToString(maskFromPrefix(p));
const pad = (s: string | number, n: number) => String(s).padEnd(n);
const lpad = (s: string | number, n: number) => String(s).padStart(n);

// ─── Password encodings ───────────────────────────────────────────────────

const XLAT = "dsfd;kfoA,.iyewrkldJKDHSUBsgvca69834ncxv9873254k;fg87";

/** Cisco type 7 (reversible "encryption" from service password-encryption). */
export function type7(plain: string) {
  let seed = 0;
  for (const ch of plain) seed = (seed + ch.charCodeAt(0)) % 16;
  let out = String(seed).padStart(2, "0");
  for (let i = 0; i < plain.length; i++) out += (plain.charCodeAt(i) ^ XLAT.charCodeAt((seed + i) % XLAT.length)).toString(16).toUpperCase().padStart(2, "0");
  return out;
}

/** A stable stand-in for an scrypt (type 9) hash; the simulator never needs to reverse it. */
export function type9(plain: string) {
  const chars = "./0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let h = 0x811c9dc5;
  let out = "";
  for (let i = 0; i < 57; i++) {
    h = Math.imul(h ^ (plain.charCodeAt(i % Math.max(1, plain.length)) + i), 16777619);
    out += chars[(h >>> 0) % 64];
  }
  return `$9$${out.slice(0, 14)}$${out.slice(14)}`;
}

// ─── running-config ───────────────────────────────────────────────────────

const PORT_NAMES: Record<number, string> = { 20: "ftp-data", 21: "ftp", 22: "22", 23: "telnet", 25: "smtp", 53: "domain", 67: "bootps", 68: "bootpc", 69: "tftp", 80: "www", 110: "pop3", 123: "ntp", 161: "snmp", 443: "443" };

function addr(a: { ip: number; wc: number } | undefined, standard = false) {
  if (!a || (a.ip === 0 && a.wc >>> 0 === 0xffffffff)) return "any";
  if (a.wc === 0) return standard ? ip(a.ip) : `host ${ip(a.ip)}`;
  return `${ip(a.ip)} ${ip(a.wc)}`;
}

function port(p: Ace["dstPort"]) {
  if (!p) return "";
  if (p.op === "range") return ` range ${p.ports[0]} ${p.ports[1]}`;
  return ` ${p.op} ${PORT_NAMES[p.ports[0]] ?? p.ports[0]}`;
}

export function aceText(acl: Acl, e: Ace) {
  if (e.action === "remark") return `remark ${e.remark}`;
  if (acl.type === "standard") return `${e.action} ${addr(e.src, true)}${e.log ? " log" : ""}`;
  return `${e.action} ${e.proto} ${addr(e.src)}${port(e.srcPort)} ${addr(e.dst)}${port(e.dstPort)}${e.established ? " established" : ""}${e.icmpType ? ` ${e.icmpType}` : ""}${e.log ? " log" : ""}`;
}

function pw(d: Device, value: string) {
  return d.servicePasswordEncryption ? `7 ${type7(value)}` : value;
}

function lineBlock(d: Device, name: string, l: Line, isVty: boolean) {
  const out = [name];
  if (l.accessClass) out.push(` access-class ${l.accessClass} in`);
  if (l.execTimeout) out.push(` exec-timeout ${l.execTimeout[0]} ${l.execTimeout[1]}`);
  if (l.password) out.push(` password ${pw(d, l.password)}`);
  if (l.loggingSync) out.push(" logging synchronous");
  if (l.login === "local") out.push(" login local");
  else if (l.login === "login" && (l.password || !isVty)) out.push(" login");
  else if (l.login === "login" && isVty) out.push(" login");
  if (isVty && l.transport) out.push(` transport input ${l.transport.length === 2 ? "ssh telnet" : l.transport[0] ?? "none"}`);
  return out;
}

function ifaceBlock(d: Device, i: Iface) {
  const out = [`interface ${i.name}`];
  if (i.description) out.push(` description ${i.description}`);
  if (i.encapsulation) out.push(` encapsulation dot1Q ${i.encapsulation.vlan}${i.encapsulation.native ? " native" : ""}`);
  const l2 = isL2(d, i) || (ifTypeOf(i.name) === "Port-channel" && i.switchport);
  if (l2) {
    if (i.accessVlan !== 1) out.push(` switchport access vlan ${i.accessVlan}`);
    if (i.nativeVlan !== 1) out.push(` switchport trunk native vlan ${i.nativeVlan}`);
    if (i.allowed) out.push(` switchport trunk allowed vlan ${vlanList(i.allowed)}`);
    if (i.mode !== "dynamic auto" || d.kind === "l3switch") if (i.mode !== "dynamic auto") out.push(` switchport mode ${i.mode}`);
    if (i.nonegotiate) out.push(" switchport nonegotiate");
    if (i.voiceVlan) out.push(` switchport voice vlan ${i.voiceVlan}`);
    if (i.portSecurity.on) {
      out.push(" switchport port-security");
      if (i.portSecurity.max !== 1) out.push(` switchport port-security maximum ${i.portSecurity.max}`);
      if (i.portSecurity.violation !== "shutdown") out.push(` switchport port-security violation ${i.portSecurity.violation}`);
      if (i.portSecurity.sticky) out.push(" switchport port-security mac-address sticky");
      for (const m of i.portSecurity.macs) out.push(` switchport port-security mac-address ${i.portSecurity.sticky ? "sticky " : ""}${m}`);
    }
  } else if (isSwitchDevice(d) && ifTypeOf(i.name) !== "Vlan" && ifTypeOf(i.name) !== "Loopback" && !i.switchport) out.push(" no switchport");
  if (i.ipv4 === "dhcp") out.push(" ip address dhcp");
  else if (i.ipv4) out.push(` ip address ${ip(i.ipv4.ip)} ${mask(i.ipv4.prefix)}`);
  else if (!l2) out.push(" no ip address");
  for (const h of i.helpers) out.push(` ip helper-address ${ip(h)}`);
  if (i.aclIn) out.push(` ip access-group ${i.aclIn} in`);
  if (i.aclOut) out.push(` ip access-group ${i.aclOut} out`);
  if (i.nat) out.push(` ip nat ${i.nat}`);
  if (i.ospf) out.push(` ip ospf ${i.ospf.pid} area ${i.ospf.area}`);
  if (i.ospfCost) out.push(` ip ospf cost ${i.ospfCost}`);
  if (i.ospfPriority !== undefined) out.push(` ip ospf priority ${i.ospfPriority}`);
  if (i.ospfPointToPoint) out.push(" ip ospf network point-to-point");
  for (const a of i.ipv6) out.push(` ipv6 address ${a}`);
  if (i.channel) out.push(` channel-group ${i.channel.group} mode ${i.channel.mode}`);
  if (i.portfast) out.push(" spanning-tree portfast");
  if (i.bpduguard) out.push(" spanning-tree bpduguard enable");
  if (!i.cdp) out.push(" no cdp enable");
  if (["GigabitEthernet", "FastEthernet"].includes(ifTypeOf(i.name) ?? "") && !i.name.includes(".")) {
    if (i.duplex !== "auto") out.push(` duplex ${i.duplex}`);
    if (i.speed !== "auto") out.push(` speed ${i.speed}`);
  }
  if (i.shutdown) out.push(" shutdown");
  return out;
}

const isSwitchDevice = (d: Device) => d.kind === "switch" || d.kind === "l3switch";

export function vlanList(vlans: number[]) {
  const s = [...new Set(vlans)].sort((a, b) => a - b);
  const out: string[] = [];
  for (let i = 0; i < s.length; i++) {
    let j = i;
    while (j + 1 < s.length && s[j + 1] === s[j] + 1) j++;
    out.push(j > i + 1 ? `${s[i]}-${s[j]}` : j === i + 1 ? `${s[i]},${s[j]}` : String(s[i]));
    i = j;
  }
  return out.join(",");
}

export function runningConfig(d: Device): string {
  const L: string[] = ["!", "version 15.2"];
  L.push(d.servicePasswordEncryption ? "service password-encryption" : "no service password-encryption");
  if (d.logging.timestamps) L.push("service timestamps log datetime msec");
  L.push("!", `hostname ${d.hostname}`, "!");
  if (d.enableSecret) L.push(`enable secret 9 ${type9(d.enableSecret)}`);
  if (d.enablePassword) L.push(`enable password ${pw(d, d.enablePassword)}`);
  if (d.enableSecret || d.enablePassword) L.push("!");
  for (const [lo, hi] of d.dhcp.excluded) L.push(`ip dhcp excluded-address ${ip(lo)}${hi !== lo ? ` ${ip(hi)}` : ""}`);
  for (const p of Object.values(d.dhcp.pools)) {
    L.push("!", `ip dhcp pool ${p.name}`);
    if (p.network) L.push(` network ${ip(p.network.ip)} ${mask(p.network.prefix)}`);
    if (p.defaultRouter !== undefined) L.push(` default-router ${ip(p.defaultRouter)}`);
    if (p.dns.length) L.push(` dns-server ${p.dns.map(ip).join(" ")}`);
    if (p.domain) L.push(` domain-name ${p.domain}`);
  }
  if (Object.keys(d.dhcp.pools).length || d.dhcp.excluded.length) L.push("!");
  if (!d.domainLookup) L.push("no ip domain-lookup");
  if (d.domainName) L.push(`ip domain-name ${d.domainName}`);
  if (d.nameServers.length) L.push(`ip name-server ${d.nameServers.map(ip).join(" ")}`);
  if (d.kind === "l3switch" && d.ipRouting) L.push("ip routing");
  if (!d.domainLookup || d.domainName || d.nameServers.length) L.push("!");
  for (const [u, v] of Object.entries(d.users)) L.push(`username ${u}${v.privilege ? ` privilege ${v.privilege}` : ""} ${v.secret ? `secret 9 ${type9(v.secret)}` : `password ${pw(d, v.password ?? "")}`}`);
  if (Object.keys(d.users).length) L.push("!");
  if (d.sshVersion) L.push(`ip ssh version ${d.sshVersion}`, "!");
  if (isSwitchDevice(d)) {
    L.push(`spanning-tree mode ${d.stp.mode}`);
    for (const [v, p] of Object.entries(d.stp.priorities)) L.push(`spanning-tree vlan ${v} priority ${p}`);
    L.push("!");
  }
  for (const i of sortedIfaces(d)) L.push(...ifaceBlock(d, i), "!");
  for (const p of Object.values(d.ospf)) {
    L.push(`router ospf ${p.pid}`);
    if (p.routerId !== undefined) L.push(` router-id ${ip(p.routerId)}`);
    if (p.refBw !== 100) L.push(` auto-cost reference-bandwidth ${p.refBw}`);
    if (p.passiveDefault) L.push(" passive-interface default");
    for (const n of p.passive) L.push(p.passiveDefault ? ` no passive-interface ${n}` : ` passive-interface ${n}`);
    for (const n of p.networks) L.push(` network ${ip(n.ip)} ${ip(n.wc)} area ${n.area}`);
    if (p.defaultOriginate) L.push(" default-information originate");
    L.push("!");
  }
  if (d.defaultGateway !== undefined) L.push(`ip default-gateway ${ip(d.defaultGateway)}`);
  for (const [name, p] of Object.entries(d.nat.pools)) L.push(`ip nat pool ${name} ${ip(p.start)} ${ip(p.end)} netmask ${mask(p.prefix)}`);
  for (const r of d.nat.rules) L.push(`ip nat inside source list ${r.acl} ${r.iface ? `interface ${r.iface}` : `pool ${r.pool}`}${r.overload ? " overload" : ""}`);
  for (const s of d.nat.statics) L.push(`ip nat inside source static ${ip(s.local)} ${ip(s.global)}`);
  for (const s of d.statics) L.push(`ip route ${ip(s.prefix)} ${mask(s.len)}${s.iface ? ` ${s.iface}` : ""}${s.nextHop !== undefined ? ` ${ip(s.nextHop)}` : ""}${s.ad !== 1 ? ` ${s.ad}` : ""}`);
  L.push("!");
  for (const a of Object.values(d.acls)) {
    if (a.numbered) for (const e of a.entries) L.push(`access-list ${a.name} ${aceText(a, e)}`);
    else {
      L.push(`ip access-list ${a.type} ${a.name}`);
      for (const e of a.entries) L.push(` ${aceText(a, e)}`);
    }
  }
  if (Object.keys(d.acls).length) L.push("!");
  for (const c of d.snmp.communities) L.push(`snmp-server community ${c.name} ${c.rw ? "RW" : "RO"}`);
  for (const h of d.logging.hosts) L.push(`logging host ${ip(h)}`);
  if (d.logging.trap) L.push(`logging trap ${d.logging.trap}`);
  if (!d.cdpRun) L.push("no cdp run");
  if (d.lldpRun) L.push("lldp run");
  if (d.bannerMotd !== undefined) L.push(`banner motd ^C${d.bannerMotd}^C`);
  L.push("!", ...lineBlock(d, "line con 0", d.lines.con, false), "!");
  L.push(...lineBlock(d, "line vty 0 4", d.lines.vty, true));
  L.push(...lineBlock(d, isSwitchDevice(d) ? "line vty 5 15" : "line vty 5 15", d.lines.vty, true));
  L.push("!");
  if (d.ntpMaster) L.push(`ntp master ${d.ntpMaster}`);
  for (const n of d.ntpServers) L.push(`ntp server ${ip(n)}`);
  L.push("!", "end");
  const body = L.join("\n");
  return `Building configuration...\n\nCurrent configuration : ${body.length + 40} bytes\n${body}`;
}

// ─── show commands ────────────────────────────────────────────────────────

export function showIpIntBrief(net: Net, id: string) {
  const d = net.devices[id];
  const rows = ["Interface                  IP-Address      OK? Method Status                Protocol"];
  for (const i of sortedIfaces(d)) {
    const st = ifStatus(net, id, i.name);
    const addr = i.ipv4 === "dhcp" ? "unassigned" : i.ipv4 ? ip(i.ipv4.ip) : "unassigned";
    const method = i.ipv4 === "dhcp" ? "DHCP" : i.ipv4 ? "manual" : "unset";
    rows.push(`${pad(i.name, 27)}${pad(addr, 16)}YES ${pad(method, 7)}${pad(st.status, 22)}${st.protocol}`);
  }
  return rows.join("\n");
}

export function showVlanBrief(net: Net, id: string) {
  const d = net.devices[id];
  const rows = ["", "VLAN Name                             Status    Ports", "---- -------------------------------- --------- -------------------------------"];
  for (const v of Object.keys(d.vlans).map(Number).sort((a, b) => a - b)) {
    const ports = sortedIfaces(d)
      .filter((i) => isL2(d, i) && !i.channel && (net.links.some((l) => (l.a[0] === id && l.a[1] === i.name) || (l.b[0] === id && l.b[1] === i.name)) ? operMode(net, id, i.name) === "access" : i.mode !== "trunk") && (i.accessVlan === v || i.voiceVlan === v))
      .map((i) => shortName(i.name));
    const chunks: string[] = [];
    for (let k = 0; k < ports.length; k += 4) chunks.push(ports.slice(k, k + 4).join(", "));
    const status = v >= 1002 ? "act/unsup" : "active";
    rows.push(`${pad(v, 5)}${pad(d.vlans[v].name, 33)}${pad(status, 10)}${chunks[0] ?? ""}`);
    for (const c of chunks.slice(1)) rows.push(`${" ".repeat(48)}${c}`);
  }
  return rows.join("\n");
}

export function showTrunks(net: Net, id: string) {
  const d = net.devices[id];
  const trunks = sortedIfaces(d).filter((i) => isL2(d, i) && ifStatus(net, id, i.name).up && operMode(net, id, i.name) === "trunk" && !i.channel);
  const pcs = Object.values(d.ifaces).filter((i) => ifTypeOf(i.name) === "Port-channel" && i.mode === "trunk" && ifStatus(net, id, i.name).up);
  const all = [...trunks, ...pcs];
  if (!all.length) return "";
  const allowed = (i: Iface) => (i.allowed ? vlanList(i.allowed) : "1-4094");
  const active = (i: Iface) => vlanList(Object.keys(d.vlans).map(Number).filter((v) => v < 1002 && (!i.allowed || i.allowed.includes(v))));
  const out = ["", "Port        Mode             Encapsulation  Status        Native vlan"];
  for (const i of all) out.push(`${pad(shortName(i.name), 12)}${pad(i.mode === "trunk" ? "on" : i.mode.replace("dynamic ", ""), 17)}${pad("802.1q", 15)}${pad("trunking", 14)}${i.nativeVlan}`);
  out.push("", "Port        Vlans allowed on trunk");
  for (const i of all) out.push(`${pad(shortName(i.name), 12)}${allowed(i)}`);
  out.push("", "Port        Vlans allowed and active in management domain");
  for (const i of all) out.push(`${pad(shortName(i.name), 12)}${active(i)}`);
  out.push("", "Port        Vlans in spanning tree forwarding state and not pruned");
  for (const i of all) out.push(`${pad(shortName(i.name), 12)}${active(i)}`);
  return out.join("\n");
}

function classful(prefix: number) {
  const o = prefix >>> 24;
  return o < 128 ? 8 : o < 192 ? 16 : 24;
}

export function showIpRoute(net: Net, id: string, filter?: string) {
  const tables = routingTables(net);
  let rs = tables[id] ?? [];
  if (filter) rs = rs.filter((r) => (filter === "static" ? r.code.startsWith("S") : filter === "ospf" ? r.code.startsWith("O") : filter === "connected" ? r.code === "C" || r.code === "L" : true));
  const head = [
    "Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP",
    "       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area",
    "       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2",
    "       E1 - OSPF external type 1, E2 - OSPF external type 2",
    "       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2",
    "       ia - IS-IS inter area, * - candidate default, U - per-user static route",
    "       o - ODR, P - periodic downloaded static route, H - NHRP, l - LISP",
    "       + - replicated route, % - next hop override",
    "",
  ];
  const def = (tables[id] ?? []).find((r) => r.len === 0);
  head.push(def ? `Gateway of last resort is ${def.nextHop !== undefined ? ip(def.nextHop) : "0.0.0.0"} to network 0.0.0.0` : "Gateway of last resort is not set", "");
  const line = (r: Route, indent: boolean) => {
    const code = pad(r.code === "O*E2" ? "O*E2" : r.code, indent ? 9 : 6);
    const net = `${ip(r.prefix)}/${r.len}`;
    if (r.code === "C" || r.code === "L") return `${code}${net} is directly connected, ${r.iface}`;
    const via = r.nextHop !== undefined ? `via ${ip(r.nextHop)}` : `is directly connected`;
    const age = r.code.startsWith("O") ? ", 00:01:12" : "";
    const ifs = r.iface && r.nextHop !== undefined && r.code.startsWith("O") ? `, ${r.iface}` : r.iface && r.nextHop === undefined ? `, ${r.iface}` : r.iface ? `, ${r.iface}` : "";
    return `${code}${net} [${r.ad}/${r.metric}] ${via}${age}${ifs}`;
  };
  const groups = new Map<string, Route[]>();
  const order = [...rs].sort((a, b) => (a.prefix >>> 0) - (b.prefix >>> 0) || a.len - b.len);
  for (const r of order) {
    if (r.len === 0) continue;
    const c = classful(r.prefix);
    const key = `${(r.prefix & maskFromPrefix(c)) >>> 0}/${c}`;
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  const body: string[] = [];
  for (const r of order.filter((r) => r.len === 0)) body.push(line(r, false));
  for (const [key, list] of groups) {
    const [n, c] = key.split("/").map(Number);
    const uniq = new Set(list.map((r) => `${r.prefix}/${r.len}`));
    const masks = new Set(list.map((r) => r.len));
    if (list.length === 1 && list[0].len === c) {
      body.push(line(list[0], false));
      continue;
    }
    body.push(`      ${ip(n)}/${c} is ${masks.size > 1 ? `variably subnetted, ${uniq.size} subnets, ${masks.size} masks` : `subnetted, ${uniq.size} subnets`}`);
    let prev = "";
    for (const r of list) {
      const k = `${r.prefix}/${r.len}`;
      if (k === prev) body.push(`${" ".repeat(25)}[${r.ad}/${r.metric}] via ${ip(r.nextHop ?? 0)}, 00:01:12, ${r.iface}`);
      else body.push(line(r, true));
      prev = k;
    }
  }
  return [...head, ...body].join("\n");
}

export function showOspfNeighbors(net: Net, id: string) {
  const nb = ospfNeighbors(net)[id] ?? [];
  const out = ["", "Neighbor ID     Pri   State           Dead Time   Address         Interface"];
  for (const n of nb) out.push(`${pad(ip(n.neighborId), 16)}${lpad(n.pri, 3)}   ${pad(n.state, 16)}00:00:3${n.neighborId % 10}    ${pad(ip(n.address), 16)}${n.iface}`);
  return out.join("\n");
}

export function showOspfIntBrief(net: Net, id: string) {
  const d = net.devices[id];
  const nbrs = ospfNeighbors(net)[id] ?? [];
  const out = ["Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C"];
  for (const o of ospfIfaces(net, id)) {
    const refBw = d.ospf[o.pid]?.refBw ?? 100;
    const cost = d.ifaces[o.name]?.ospfCost ?? Math.max(1, Math.floor((refBw * 1000) / (ifTypeOf(o.name) === "FastEthernet" ? 100_000 : ifTypeOf(o.name) === "Loopback" ? 8_000_000 : 1_000_000)));
    const n = nbrs.filter((x) => x.iface === o.name);
    const full = n.filter((x) => x.state.startsWith("FULL")).length;
    const myRole = ifTypeOf(o.name) === "Loopback" ? "LOOP" : !o.up ? "DOWN" : d.ifaces[o.name]?.ospfPointToPoint ? "P2P" : n.length === 0 ? "DR" : n.some((x) => x.state.endsWith("/DR")) ? (n.some((x) => x.state.endsWith("/BDR")) ? "DROTH" : "BDR") : "DR";
    out.push(`${pad(shortName(o.name), 13)}${pad(o.pid, 6)}${pad(o.area, 16)}${pad(`${ip(o.ip)}/${o.prefix}`, 19)}${pad(cost, 6)}${pad(myRole, 6)}${full}/${n.length}`);
  }
  return out.join("\n");
}

export function showIpProtocols(net: Net, id: string) {
  const d = net.devices[id];
  const out: string[] = [];
  for (const p of Object.values(d.ospf)) {
    out.push(`*** IP Routing is NSF aware ***`, "", `Routing Protocol is "ospf ${p.pid}"`, `  Router ID ${ip(routerId(net, id, p.pid))}`, "  Number of areas in this router is 1. 1 normal 0 stub 0 nssa", "  Maximum path: 4", "  Routing for Networks:");
    for (const n of p.networks) out.push(`    ${ip(n.ip)} ${ip(n.wc)} area ${n.area}`);
    const passive = ospfIfaces(net, id).filter((o) => o.passive && ifTypeOf(o.name) !== "Loopback");
    if (passive.length) out.push("  Passive Interface(s):", ...passive.map((o) => `    ${o.name}`));
    out.push("  Routing Information Sources:", "    Gateway         Distance      Last Update");
    for (const n of ospfNeighbors(net)[id] ?? []) out.push(`    ${pad(ip(n.neighborId), 16)}${pad(110, 14)}00:01:12`);
    out.push("  Distance: (default is 110)", "");
  }
  return out.join("\n") || "";
}

export function showAccessLists(d: Device, onlyIp = false) {
  const out: string[] = [];
  for (const a of Object.values(d.acls)) {
    out.push(`${a.type === "standard" ? "Standard" : "Extended"} IP access list ${a.name}`);
    for (const e of a.entries) out.push(`    ${e.seq} ${aceText(a, e)}${e.hits ? ` (${e.hits} match${e.hits > 1 ? "es" : ""})` : ""}`);
  }
  void onlyIp;
  return out.join("\n");
}

export function showNat(d: Device) {
  const out = ["Pro  Inside global         Inside local          Outside local         Outside global"];
  for (const s of d.nat.statics) out.push(`---  ${pad(ip(s.global), 22)}${pad(ip(s.local), 22)}${pad("---", 22)}---`);
  for (const t of d.nat.table) out.push(`${pad(t.proto, 5)}${pad(t.insideGlobal, 22)}${pad(t.insideLocal, 22)}${pad(t.outsideLocal, 22)}${t.outsideGlobal}`);
  return out.join("\n");
}

export function showMacTable(net: Net, id: string) {
  const d = net.devices[id];
  const out = ["          Mac Address Table", "-------------------------------------------", "", "Vlan    Mac Address       Type        Ports", "----    -----------       --------    -----"];
  const rows = Object.entries(d.macTable).sort((a, b) => a[1].vlan - b[1].vlan || a[0].localeCompare(b[0]));
  for (const [mac, e] of rows) {
    const sticky = Object.values(d.ifaces).some((i) => i.portSecurity.macs.includes(mac));
    out.push(`${lpad(e.vlan, 4)}    ${pad(mac, 18)}${pad(sticky ? "STATIC" : "DYNAMIC", 12)}${shortName(e.port)}`);
  }
  out.push(`Total Mac Addresses for this criterion: ${rows.length}`);
  return out.join("\n");
}

export function showArp(net: Net, id: string) {
  const d = net.devices[id];
  const out = ["Protocol  Address          Age (min)  Hardware Addr   Type   Interface"];
  for (const i of l3Ifaces(net, id).filter((i) => i.up)) out.push(`Internet  ${pad(ip(i.ip), 17)}${pad("-", 11)}${pad(macOf(d, i.name), 16)}ARPA   ${i.name}`);
  const topo = topology(net);
  for (const [a, mac] of Object.entries(d.arp)) {
    const target = Object.keys(net.devices).flatMap((x) => l3Ifaces(net, x)).find((i) => ip(i.ip) === a);
    const via = target ? l3Ifaces(net, id).find((m) => topo.segOf(id, m.name) === topo.segOf(target.dev, target.name))?.name ?? "" : "";
    out.push(`Internet  ${pad(a, 17)}${pad("0", 11)}${pad(mac, 16)}ARPA   ${via}`);
  }
  return out.join("\n");
}

export function showEtherchannel(net: Net, id: string) {
  const d = net.devices[id];
  const groups = [...new Set(Object.values(d.ifaces).filter((i) => i.channel).map((i) => i.channel!.group))].sort((a, b) => a - b);
  const out = [
    "Flags:  D - down        P - bundled in port-channel",
    "        I - stand-alone s - suspended",
    "        H - Hot-standby (LACP only)",
    "        R - Layer3      S - Layer2",
    "        U - in use      f - failed to allocate aggregator",
    "",
    "        M - not in use, minimum links not met",
    "        u - unsuitable for bundling",
    "        w - waiting to be aggregated",
    "        d - default port",
    "",
    "",
    `Number of channel-groups in use: ${groups.length}`,
    `Number of aggregators:           ${groups.length}`,
    "",
    "Group  Port-channel  Protocol    Ports",
    "------+-------------+-----------+-----------------------------------------------",
  ];
  for (const g of groups) {
    const members = channelMembers(d, g).sort((a, b) => compareIf(a.name, b.name));
    const proto = ["active", "passive"].includes(members[0].channel!.mode) ? "LACP" : ["desirable", "auto"].includes(members[0].channel!.mode) ? "PAgP" : "-";
    const flags = members.map((m) => `${shortName(m.name)}(${bundled(net, id, m.name) ? "P" : ifStatus(net, id, m.name).up ? "I" : "D"})`);
    const up = members.some((m) => bundled(net, id, m.name));
    const po = d.ifaces[`Port-channel${g}`];
    const layer = po && !po.switchport ? "R" : "S";
    out.push(`${pad(g, 7)}${pad(`Po${g}(${layer}${up ? "U" : "D"})`, 14)}${pad(proto, 12)}${flags.join("  ")}`);
  }
  return out.join("\n");
}

export function showSpanningTree(net: Net, id: string, vlan?: number) {
  const d = net.devices[id];
  const vlans = vlan !== undefined ? [vlan] : Object.keys(d.vlans).map(Number).filter((v) => v < 1002);
  const out: string[] = [];
  for (const v of vlans) {
    const st = spanningTree(net, v)[id];
    if (!st) continue;
    if (!st.ports.length) continue;
    const isRoot = st.rootDev === id;
    out.push(`VLAN${String(v).padStart(4, "0")}`, `  Spanning tree enabled protocol ${d.stp.mode === "rapid-pvst" ? "rstp" : "ieee"}`);
    out.push(`  Root ID    Priority    ${st.rootPriority}`, `             Address     ${st.rootMac}`);
    if (isRoot) out.push("             This bridge is the root");
    else out.push(`             Cost        ${st.rootCost}`, `             Port        ${portNum(d, st.rootPort!)} (${st.rootPort})`);
    out.push("             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec", "");
    out.push(`  Bridge ID  Priority    ${st.bridgePriority}  (priority ${st.bridgePriority - v} sys-id-ext ${v})`, `             Address     ${st.bridgeMac}`);
    out.push("             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec", "             Aging Time  300 sec", "");
    out.push("Interface           Role Sts Cost      Prio.Nbr Type", "------------------- ---- --- --------- -------- --------------------------------");
    for (const p of st.ports.sort((a, b) => compareIf(a.iface, b.iface))) {
      const i = d.ifaces[p.iface];
      const type = `P2p${i.portfast ? " Edge" : ""}`;
      out.push(`${pad(shortName(p.iface), 20)}${pad(p.role, 5)}${pad(p.state, 4)}${pad(p.cost, 10)}${pad(`128.${portNum(d, p.iface)}`, 9)}${type}`);
    }
    out.push("", "");
  }
  return out.join("\n").trimEnd() || `No spanning tree instance exists.`;
}

function portNum(d: Device, ifname: string) {
  return sortedIfaces(d).filter((i) => isL2(d, i)).findIndex((i) => i.name === ifname) + 1;
}

export function showPortSecurity(net: Net, id: string, ifname: string) {
  const d = net.devices[id];
  const i = d.ifaces[ifname];
  if (!i) return "% Invalid interface";
  const ps = i.portSecurity;
  const status = !ps.on ? "Secure-down" : i.errDisabled ? "Secure-shutdown" : ifStatus(net, id, ifname).up ? "Secure-up" : "Secure-down";
  const sticky = ps.sticky ? ps.macs.length : 0;
  return [
    `Port Security              : ${ps.on ? "Enabled" : "Disabled"}`,
    `Port Status                : ${status}`,
    `Violation Mode             : ${ps.violation[0].toUpperCase()}${ps.violation.slice(1)}`,
    "Aging Time                 : 0 mins",
    "Aging Type                 : Absolute",
    "SecureStatic Address Aging : Disabled",
    `Maximum MAC Addresses      : ${ps.max}`,
    `Total MAC Addresses        : ${ps.macs.length}`,
    `Configured MAC Addresses   : ${ps.sticky ? 0 : ps.macs.length}`,
    `Sticky MAC Addresses       : ${sticky}`,
    `Last Source Address:Vlan   : ${ps.macs.length ? `${ps.macs[ps.macs.length - 1]}:${i.accessVlan}` : "0000.0000.0000:0"}`,
    `Security Violation Count   : ${ps.violations}`,
  ].join("\n");
}

export function showCdp(net: Net, id: string) {
  const d = net.devices[id];
  const out = [
    "Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge",
    "                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone,",
    "                  D - Remote, C - CVTA, M - Two-port Mac Relay",
    "",
    "Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID",
  ];
  if (!d.cdpRun) return "% CDP is not enabled";
  for (const i of sortedIfaces(d)) {
    if (!i.cdp) continue;
    const p = peerOf(net, id, i.name);
    if (!p || !ifStatus(net, id, i.name).up) continue;
    const pd = net.devices[p[0]];
    if (!pd.cdpRun || pd.host || !pd.ifaces[p[1]]?.cdp) continue;
    const cap = pd.kind === "router" ? "R B S I" : pd.kind === "l3switch" ? "R S I" : "S I";
    const short = (n: string) => shortName(n).replace(/^Gi/, "Gig ").replace(/^Fa/, "Fas ");
    out.push(`${pad(pd.hostname, 17)}${pad(short(i.name), 18)}${pad(lpad(160 - (pd.hostname.length % 30), 6), 11)}${pad(lpad(cap, 10), 12)}${pad(pd.model.slice(0, 9), 10)}${short(p[1])}`);
  }
  const entries = out.length - 5;
  out.push("", `Total cdp entries displayed : ${entries}`);
  return out.join("\n");
}

export function showInterface(net: Net, id: string, ifname: string) {
  const d = net.devices[id];
  const i = d.ifaces[ifname];
  const st = ifStatus(net, id, ifname);
  const mac = macOf(d, ifname);
  const lines = [`${ifname} is ${st.status}, line protocol is ${st.protocol}${i.errDisabled ? ` (err-disabled)` : ""}`];
  const hw = ifTypeOf(ifname) === "Loopback" ? "  Hardware is Loopback" : ifTypeOf(ifname) === "Vlan" ? `  Hardware is EtherSVI, address is ${mac} (bia ${mac})` : `  Hardware is ${ifTypeOf(ifname) === "FastEthernet" ? "Fast Ethernet" : "Gigabit Ethernet"}, address is ${mac} (bia ${mac})`;
  lines.push(hw);
  if (i.description) lines.push(`  Description: ${i.description}`);
  if (i.ipv4 && i.ipv4 !== "dhcp") lines.push(`  Internet address is ${ip(i.ipv4.ip)}/${i.ipv4.prefix}`);
  const bw = ifTypeOf(ifname) === "FastEthernet" ? 100000 : 1000000;
  lines.push(`  MTU 1500 bytes, BW ${bw} Kbit/sec, DLY ${bw === 100000 ? 100 : 10} usec,`, "     reliability 255/255, txload 1/255, rxload 1/255", "  Encapsulation ARPA, loopback not set");
  if (["FastEthernet", "GigabitEthernet"].includes(ifTypeOf(ifname) ?? "")) {
    const duplex = i.duplex === "auto" ? "Full-duplex" : i.duplex === "full" ? "Full-duplex" : "Half-duplex";
    const speed = i.speed === "auto" ? (bw === 100000 ? "100Mb/s" : "1000Mb/s") : `${i.speed}Mb/s`;
    lines.push(`  ${st.up ? duplex : "Auto-duplex"}, ${st.up ? speed : "Auto-speed"}, media type is 10/100/1000BaseTX`);
  }
  lines.push("  5 minute input rate 0 bits/sec, 0 packets/sec", "  5 minute output rate 0 bits/sec, 0 packets/sec", "     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored", "     0 output errors, 0 collisions, 0 interface resets");
  return lines.join("\n");
}

export function showInterfacesStatus(net: Net, id: string) {
  const d = net.devices[id];
  const out = ["", "Port      Name               Status       Vlan       Duplex  Speed Type"];
  for (const i of sortedIfaces(d).filter((i) => isL2(d, i) || (d.kind === "l3switch" && ["GigabitEthernet"].includes(ifTypeOf(i.name) ?? "")))) {
    const st = ifStatus(net, id, i.name);
    const status = i.errDisabled ? "err-disabled" : i.shutdown ? "disabled" : st.up ? "connected" : "notconnect";
    const vlan = !i.switchport ? "routed" : st.up && operMode(net, id, i.name) === "trunk" ? "trunk" : String(i.accessVlan);
    const fast = ifTypeOf(i.name) === "FastEthernet";
    out.push(`${pad(shortName(i.name), 10)}${pad((i.description ?? "").slice(0, 18), 19)}${pad(status, 13)}${pad(vlan, 11)}${pad(st.up ? "a-full" : "auto", 8)}${pad(st.up ? (fast ? "a-100" : "a-1000") : "auto", 6)}10/100${fast ? "BaseTX" : "/1000BaseTX"}`);
  }
  return out.join("\n");
}

export function showVersion(d: Device) {
  const sw = d.kind !== "router";
  return [
    `Cisco IOS Software, ${sw ? "C2960 Software (C2960-LANBASEK9-M)" : "C2900 Software (C2900-UNIVERSALK9-M)"}, Version 15.2(4)E8, RELEASE SOFTWARE (fc3)`,
    "Technical Support: http://www.cisco.com/techsupport",
    "Copyright (c) 1986-2019 by Cisco Systems, Inc.",
    "",
    `${d.hostname} uptime is 1 hour, 12 minutes`,
    'System image file is "flash:/' + (sw ? "c2960-lanbasek9-mz.152-4.E8.bin" : "c2900-universalk9-mz.SPA.152-4.M7.bin") + '"',
    "",
    `cisco ${d.model} processor with 524288K bytes of memory.`,
    `${Object.values(d.ifaces).filter((i) => ifTypeOf(i.name) === "FastEthernet").length} FastEthernet interfaces`,
    `${Object.values(d.ifaces).filter((i) => ifTypeOf(i.name) === "GigabitEthernet" && !i.name.includes(".")).length} Gigabit Ethernet interfaces`,
    "",
    "Configuration register is 0x2102",
  ].join("\n");
}

export function showDhcpBinding(d: Device) {
  const out = ["Bindings from all pools not associated with VRF:", "IP address      Client-ID/              Lease expiration        Type       State      Interface", "                Hardware address/", "                User name"];
  for (const b of d.dhcp.bindings) out.push(`${pad(ip(b.ip), 16)}${pad(`01${b.mac.replace(/\./g, "")}`, 24)}${pad("Oct 02 2026 09:14 AM", 24)}${pad("Automatic", 11)}${pad("Active", 11)}`);
  return out.join("\n");
}
