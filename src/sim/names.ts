// Interface names: parse what people type ("g0/1", "Gig 0/1", "fa0/1-4", "vlan 10", "g0/0.10")
// into canonical IOS names ("GigabitEthernet0/1") and short forms ("Gi0/1").

const TYPES = [
  { full: "FastEthernet", short: "Fa" },
  { full: "GigabitEthernet", short: "Gi" },
  { full: "TenGigabitEthernet", short: "Te" },
  { full: "Ethernet", short: "Et" },
  { full: "Serial", short: "Se" },
  { full: "Loopback", short: "Lo" },
  { full: "Vlan", short: "Vl" },
  { full: "Port-channel", short: "Po" },
] as const;

export type IfType = (typeof TYPES)[number]["full"];

/** Resolve a typed interface type ("g", "gig", "fa") to its full name, or null if unknown/ambiguous. */
export function resolveType(typed: string): IfType | null {
  const t = typed.toLowerCase();
  const hits = TYPES.filter((x) => x.full.toLowerCase().startsWith(t));
  if (hits.length === 1) return hits[0].full;
  // "e" alone means Ethernet on IOS; "t"/"te" means TenGigabitEthernet.
  const exact = hits.find((x) => x.full.toLowerCase() === t);
  if (exact) return exact.full;
  if (t === "e") return "Ethernet";
  if (t === "t" || t === "te") return "TenGigabitEthernet";
  return null;
}

/**
 * Parse one interface from 1 or 2 tokens ("g0/1" or "gigabitethernet", "0/1").
 * Returns the canonical name and how many tokens it used, or null.
 */
export function parseIfName(tokens: string[]): { name: string; used: number } | null {
  if (!tokens.length) return null;
  const one = tokens[0].match(/^([a-z-]+)([\d/.:]+)$/i);
  if (one) {
    const type = resolveType(one[1]);
    return type && /^\d+(\/\d+)*(\.\d+)?$/.test(one[2]) ? { name: type + one[2], used: 1 } : null;
  }
  if (tokens.length >= 2 && /^[a-z-]+$/i.test(tokens[0]) && /^\d+(\/\d+)*(\.\d+)?$/.test(tokens[1])) {
    const type = resolveType(tokens[0]);
    return type ? { name: type + tokens[1], used: 2 } : null;
  }
  return null;
}

/** "interface range f0/1 - 4 , f0/10" -> FastEthernet0/1..0/4, FastEthernet0/10 */
export function parseIfRange(text: string): string[] | null {
  const out: string[] = [];
  for (const raw of text.split(",")) {
    const part = raw.trim();
    if (!part) continue;
    const m = part.match(/^([a-z-]+)\s*((?:\d+\/)*)(\d+)\s*(?:-\s*(\d+))?$/i);
    if (!m) return null;
    const type = resolveType(m[1]);
    if (!type) return null;
    const from = Number(m[3]);
    const to = m[4] !== undefined ? Number(m[4]) : from;
    if (to < from || to - from > 64) return null;
    for (let n = from; n <= to; n++) out.push(`${type}${m[2]}${n}`);
  }
  return out.length ? out : null;
}

export function shortName(name: string) {
  for (const t of TYPES) if (name.startsWith(t.full)) return t.short + name.slice(t.full.length);
  return name;
}

export function ifTypeOf(name: string): IfType | null {
  // Longest match first so "TenGigabitEthernet" isn't read as something shorter.
  const t = [...TYPES].sort((a, b) => b.full.length - a.full.length).find((x) => name.startsWith(x.full));
  return t ? t.full : null;
}

/** Natural sort for interface names: Fa0/2 before Fa0/10, physical before logical. */
export function compareIf(a: string, b: string) {
  const order = ["Loopback", "Port-channel", "Tunnel", "FastEthernet", "GigabitEthernet", "TenGigabitEthernet", "Ethernet", "Serial", "Vlan"];
  const ta = ifTypeOf(a) ?? "", tb = ifTypeOf(b) ?? "";
  if (ta !== tb) return order.indexOf(ta) - order.indexOf(tb);
  const na = a.slice(ta.length).split(/[/.]/).map(Number);
  const nb = b.slice(tb.length).split(/[/.]/).map(Number);
  for (let i = 0; i < Math.max(na.length, nb.length); i++) {
    const d = (na[i] ?? -1) - (nb[i] ?? -1);
    if (d) return d;
  }
  return 0;
}

/** Parent of a subinterface ("GigabitEthernet0/0.10" -> "GigabitEthernet0/0"). */
export function parentOf(name: string) {
  const i = name.indexOf(".");
  return i > 0 ? name.slice(0, i) : null;
}

/** Bandwidth in kbit/s for an interface type, as IOS assumes. */
export function bandwidthKbps(name: string) {
  const t = ifTypeOf(name);
  if (t === "TenGigabitEthernet") return 10_000_000;
  if (t === "GigabitEthernet" || t === "Port-channel") return 1_000_000;
  if (t === "FastEthernet") return 100_000;
  if (t === "Ethernet") return 10_000;
  if (t === "Serial") return 1544;
  if (t === "Loopback") return 8_000_000;
  return 1_000_000;
}
