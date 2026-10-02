// What a simulated device holds. The CLI edits this; show commands and the network engine read it.

import { compareIf } from "./names.ts";

export type DeviceKind = "router" | "switch" | "l3switch" | "pc" | "server";

export type SwitchportMode = "access" | "trunk" | "dynamic auto" | "dynamic desirable";
export type ChannelMode = "active" | "passive" | "on" | "desirable" | "auto";

export type Iface = {
  name: string;
  shutdown: boolean;
  description?: string;
  /** IPv4 address, or "dhcp" for a DHCP client interface. */
  ipv4?: { ip: number; prefix: number } | "dhcp";
  ipv6: string[];
  /** Layer 2 port (switches). Routed ports and router interfaces are false. */
  switchport: boolean;
  mode: SwitchportMode;
  accessVlan: number;
  voiceVlan?: number;
  nativeVlan: number;
  /** null = all VLANs allowed */
  allowed: number[] | null;
  nonegotiate: boolean;
  portSecurity: { on: boolean; max: number; violation: "shutdown" | "restrict" | "protect"; sticky: boolean; macs: string[]; violations: number };
  portfast: boolean;
  bpduguard: boolean;
  channel?: { group: number; mode: ChannelMode };
  /** Router subinterface 802.1Q tag. */
  encapsulation?: { vlan: number; native: boolean };
  helpers: number[];
  nat?: "inside" | "outside";
  aclIn?: string;
  aclOut?: string;
  ospf?: { pid: number; area: string };
  ospfCost?: number;
  ospfPriority?: number;
  ospfPointToPoint?: boolean;
  speed: "auto" | "10" | "100" | "1000";
  duplex: "auto" | "full" | "half";
  errDisabled?: "psecure-violation" | "bpduguard";
  cdp: boolean;
};

export type Line = {
  password?: string;
  login: "none" | "login" | "local";
  transport: ("ssh" | "telnet")[] | null;
  execTimeout?: [number, number];
  accessClass?: string;
  loggingSync: boolean;
};

export type Ace = {
  seq: number;
  action: "permit" | "deny" | "remark";
  remark?: string;
  proto?: "ip" | "tcp" | "udp" | "icmp";
  src?: { ip: number; wc: number };
  srcPort?: Port;
  dst?: { ip: number; wc: number };
  dstPort?: Port;
  established?: boolean;
  /** icmp type keyword, e.g. "echo", "echo-reply" */
  icmpType?: string;
  log?: boolean;
  hits: number;
};
export type Port = { op: "eq" | "neq" | "gt" | "lt" | "range"; ports: number[] };
export type Acl = { name: string; type: "standard" | "extended"; numbered: boolean; entries: Ace[] };

export type OspfProcess = {
  pid: number;
  routerId?: number;
  networks: { ip: number; wc: number; area: string }[];
  passive: string[];
  passiveDefault: boolean;
  defaultOriginate: boolean;
  refBw: number; // Mbit/s
};

export type DhcpPool = { name: string; network?: { ip: number; prefix: number }; defaultRouter?: number; dns: number[]; domain?: string };

export type Device = {
  id: string;
  kind: DeviceKind;
  model: string;
  hostname: string;
  enableSecret?: string;
  enablePassword?: string;
  servicePasswordEncryption: boolean;
  bannerMotd?: string;
  domainName?: string;
  domainLookup: boolean;
  nameServers: number[];
  users: Record<string, { secret?: string; password?: string; privilege?: number }>;
  rsaBits?: number;
  sshVersion?: 1 | 2;
  lines: { con: Line; vty: Line };
  ifaces: Record<string, Iface>;
  vlans: Record<number, { name: string }>;
  ipRouting: boolean;
  defaultGateway?: number;
  statics: { prefix: number; len: number; nextHop?: number; iface?: string; ad: number }[];
  ospf: Record<number, OspfProcess>;
  dhcp: { excluded: [number, number][]; pools: Record<string, DhcpPool>; bindings: { ip: number; mac: string; pool: string }[] };
  nat: {
    statics: { local: number; global: number }[];
    pools: Record<string, { start: number; end: number; prefix: number }>;
    rules: { acl: string; pool?: string; iface?: string; overload: boolean }[];
    table: { proto: string; insideLocal: string; insideGlobal: string; outsideLocal: string; outsideGlobal: string }[];
  };
  acls: Record<string, Acl>;
  ntpServers: number[];
  ntpMaster?: number;
  logging: { hosts: number[]; trap?: string; buffered?: boolean; timestamps?: boolean };
  snmp: { communities: { name: string; rw: boolean }[] };
  stp: { mode: "pvst" | "rapid-pvst"; priorities: Record<number, number> };
  cdpRun: boolean;
  lldpRun: boolean;
  /** Host settings for PCs and servers. */
  host?: { dhcp: boolean; ip?: number; prefix?: number; gateway?: number; dns?: number; services: string[] };
  /** MAC address table learned from traffic: mac -> { vlan, port } */
  macTable: Record<string, { vlan: number; port: string }>;
  arp: Record<string, string>;
  startup?: string;
  /** Log lines produced by events (shown on the console). */
  log: string[];
};

export function newIface(name: string, opts: Partial<Iface> = {}): Iface {
  return {
    name,
    shutdown: false,
    ipv6: [],
    switchport: false,
    mode: "dynamic auto",
    accessVlan: 1,
    nativeVlan: 1,
    allowed: null,
    nonegotiate: false,
    portSecurity: { on: false, max: 1, violation: "shutdown", sticky: false, macs: [], violations: 0 },
    portfast: false,
    bpduguard: false,
    helpers: [],
    speed: "auto",
    duplex: "auto",
    cdp: true,
    ...opts,
  };
}

const line = (): Line => ({ login: "none", transport: null, loggingSync: false });

function base(id: string, kind: DeviceKind, model: string, hostname: string): Device {
  return {
    id,
    kind,
    model,
    hostname,
    servicePasswordEncryption: false,
    domainLookup: true,
    nameServers: [],
    users: {},
    lines: { con: line(), vty: { ...line(), login: "login" } },
    ifaces: {},
    vlans: {},
    ipRouting: kind === "router",
    statics: [],
    ospf: {},
    dhcp: { excluded: [], pools: {}, bindings: [] },
    nat: { statics: [], pools: {}, rules: [], table: [] },
    acls: {},
    ntpServers: [],
    logging: { hosts: [] },
    snmp: { communities: [] },
    stp: { mode: "pvst", priorities: {} },
    cdpRun: true,
    lldpRun: false,
    macTable: {},
    arp: {},
    log: [],
  };
}

const DEFAULT_VLANS = { 1: { name: "default" }, 1002: { name: "fddi-default" }, 1003: { name: "token-ring-default" }, 1004: { name: "fddinet-default" }, 1005: { name: "trnet-default" } };

/** A Cisco 2911-style router: Gi0/0-0/2, all administratively down by default (as on real IOS). */
export function makeRouter(id: string, hostname = "Router"): Device {
  const d = base(id, "router", "CISCO2911/K9", hostname);
  for (const n of ["GigabitEthernet0/0", "GigabitEthernet0/1", "GigabitEthernet0/2"]) d.ifaces[n] = newIface(n, { shutdown: true });
  return d;
}

/** A 2960-style access switch: Fa0/1-24 and Gi0/1-2, all up, VLAN 1. */
export function makeSwitch(id: string, hostname = "Switch"): Device {
  const d = base(id, "switch", "WS-C2960-24TT-L", hostname);
  for (let i = 1; i <= 24; i++) d.ifaces[`FastEthernet0/${i}`] = newIface(`FastEthernet0/${i}`, { switchport: true });
  for (let i = 1; i <= 2; i++) d.ifaces[`GigabitEthernet0/${i}`] = newIface(`GigabitEthernet0/${i}`, { switchport: true });
  d.ifaces.Vlan1 = newIface("Vlan1", { shutdown: true });
  d.vlans = structuredClone(DEFAULT_VLANS);
  return d;
}

/** A 3650-style Layer 3 switch: Gi1/0/1-24 and Gi1/1/1-4. `ip routing` is off until you enable it. */
export function makeL3Switch(id: string, hostname = "Switch"): Device {
  const d = base(id, "l3switch", "WS-C3650-24PS", hostname);
  for (let i = 1; i <= 24; i++) d.ifaces[`GigabitEthernet1/0/${i}`] = newIface(`GigabitEthernet1/0/${i}`, { switchport: true });
  for (let i = 1; i <= 4; i++) d.ifaces[`GigabitEthernet1/1/${i}`] = newIface(`GigabitEthernet1/1/${i}`, { switchport: true });
  d.ifaces.Vlan1 = newIface("Vlan1", { shutdown: true });
  d.vlans = structuredClone(DEFAULT_VLANS);
  return d;
}

export function makeHost(id: string, kind: "pc" | "server", hostname: string, services: string[] = []): Device {
  const d = base(id, kind, kind === "pc" ? "PC" : "Server", hostname);
  d.ifaces.FastEthernet0 = newIface("FastEthernet0");
  d.host = { dhcp: false, services };
  d.cdpRun = false;
  return d;
}

export function sortedIfaces(d: Device) {
  return Object.values(d.ifaces).sort((a, b) => compareIf(a.name, b.name));
}

/** Stable MAC for a device interface, Cisco dotted format. */
export function macOf(d: Device, ifname: string) {
  let h = 2166136261;
  for (const ch of `${d.id}/${ifname}`) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const hex = (h >>> 0).toString(16).padStart(8, "0");
  const oui = d.kind === "pc" || d.kind === "server" ? "0050.79" : d.kind === "router" ? "0019.e8" : "0023.04";
  return `${oui}${hex.slice(0, 2)}.${hex.slice(2, 6)}`;
}
