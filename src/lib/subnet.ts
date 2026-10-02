// IPv4 subnet arithmetic for the labs.

export type SubnetInfo = {
  ip: string;
  prefix: number;
  mask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  first: string;
  last: string;
  usable: number;
  total: number;
  blockSize: number;
  /** Octet (1-4) where the mask stops being 255. 0 for /0. */
  interestingOctet: number;
  cls: "A" | "B" | "C" | "D" | "E";
  isPrivate: boolean;
};

export function parseIp(s: string): number | null {
  const parts = s.trim().split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const v = Number(p);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n >>> 0;
}

export function ipToString(n: number) {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
}

export function maskFromPrefix(prefix: number) {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

/** Accepts "10.1.1.1/24", "10.1.1.1 255.255.255.0" or "10.1.1.1 /24". */
export function parseCidr(input: string): { ip: number; prefix: number } | null {
  const s = input.trim();
  const m = s.match(/^(\d{1,3}(?:\.\d{1,3}){3})\s*(?:\/\s*(\d{1,2})|\s+(\d{1,3}(?:\.\d{1,3}){3}))$/);
  if (!m) return null;
  const ip = parseIp(m[1]);
  if (ip === null) return null;
  if (m[2] !== undefined) {
    const prefix = Number(m[2]);
    return prefix >= 0 && prefix <= 32 ? { ip, prefix } : null;
  }
  const mask = parseIp(m[3]);
  if (mask === null) return null;
  const bits = mask.toString(2).padStart(32, "0");
  if (!/^1*0*$/.test(bits)) return null;
  return { ip, prefix: bits.indexOf("0") === -1 ? 32 : bits.indexOf("0") };
}

export function subnetInfo(ip: number, prefix: number): SubnetInfo {
  const mask = maskFromPrefix(prefix);
  const network = (ip & mask) >>> 0;
  const total = 2 ** (32 - prefix);
  const broadcast = (network + total - 1) >>> 0;
  const usable = prefix === 32 ? 1 : prefix === 31 ? 2 : total - 2;
  const first = prefix >= 31 ? network : network + 1;
  const last = prefix >= 31 ? broadcast : broadcast - 1;
  const o1 = ip >>> 24;
  const cls = o1 < 128 ? "A" : o1 < 192 ? "B" : o1 < 224 ? "C" : o1 < 240 ? "D" : "E";
  const isPrivate = o1 === 10 || (o1 === 172 && ((ip >>> 16) & 255) >= 16 && ((ip >>> 16) & 255) <= 31) || (o1 === 192 && ((ip >>> 16) & 255) === 168);
  const interestingOctet = prefix === 0 ? 0 : prefix === 32 ? 4 : Math.floor(prefix / 8) + (prefix % 8 === 0 ? 0 : 1);
  const octetIndex = Math.max(1, interestingOctet);
  const maskOctet = (mask >>> (8 * (4 - octetIndex))) & 255;
  return {
    ip: ipToString(ip),
    prefix,
    mask: ipToString(mask),
    wildcard: ipToString(~mask >>> 0),
    network: ipToString(network),
    broadcast: ipToString(broadcast),
    first: ipToString(first),
    last: ipToString(last),
    usable,
    total,
    blockSize: 256 - maskOctet,
    interestingOctet,
    cls,
    isPrivate,
  };
}

/** A random practice question, weighted toward the prefixes the exam uses most. */
export function randomSubnetQuestion(rand: () => number = Math.random) {
  const prefixes = [20, 21, 22, 23, 24, 25, 25, 26, 26, 26, 27, 27, 27, 28, 28, 28, 29, 29, 30, 30];
  const prefix = prefixes[Math.floor(rand() * prefixes.length)];
  const firsts = [10, 172, 192];
  const f = firsts[Math.floor(rand() * firsts.length)];
  const second = f === 10 ? Math.floor(rand() * 256) : f === 172 ? 16 + Math.floor(rand() * 16) : 168;
  const third = Math.floor(rand() * 256);
  const fourth = 1 + Math.floor(rand() * 254);
  const ip = parseIp(`${f}.${second}.${third}.${fourth}`)!;
  return subnetInfo(ip, prefix);
}
