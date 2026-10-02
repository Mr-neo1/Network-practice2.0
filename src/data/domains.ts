// The six CCNA 200-301 v1.1 exam domains and how lessons map onto them.

import type { L } from "../content/types.ts";
import type { Domain } from "./types.ts";

export const DOMAINS: { id: Domain; name: L; weight: number; module: string }[] = [
  { id: 1, name: { en: "Network fundamentals", hi: "Network fundamentals" }, weight: 20, module: "m1" },
  { id: 2, name: { en: "Network access", hi: "Network access" }, weight: 20, module: "m2" },
  { id: 3, name: { en: "IP connectivity", hi: "IP connectivity" }, weight: 25, module: "m3" },
  { id: 4, name: { en: "IP services", hi: "IP services" }, weight: 10, module: "m4" },
  { id: 5, name: { en: "Security fundamentals", hi: "Security fundamentals" }, weight: 15, module: "m5" },
  { id: 6, name: { en: "Automation and programmability", hi: "Automation aur programmability" }, weight: 10, module: "m6" },
];

const byModule: Record<string, Domain> = { m0: 1, m1: 1, m2: 2, m3: 3, m4: 4, m5: 5, m6: 6 };

// "Beyond the CCNA" lessons still count toward the closest exam domain (or none).
const expert: Record<string, Domain | null> = {
  "troubleshooting-method": 2,
  "ospf-multi-area": 3,
  eigrp: 3,
  "bgp-basics": 3,
  "network-design": 1,
  "sd-wan-sd-access": 6,
  "python-netmiko": 6,
  "mega-lab": 3,
  "exam-strategy": null,
};

export function domainForLesson(slug: string, moduleId: string): Domain | null {
  if (moduleId === "m7") return expert[slug] ?? null;
  return byModule[moduleId] ?? null;
}

/** How many of an n-question exam each domain should get, by official weight. */
export function examDistribution(n: number): Record<Domain, number> {
  const raw = DOMAINS.map((d) => ({ id: d.id, exact: (d.weight / 100) * n }));
  const out = Object.fromEntries(raw.map((r) => [r.id, Math.floor(r.exact)])) as Record<Domain, number>;
  let left = n - Object.values(out).reduce((a, b) => a + b, 0);
  for (const r of [...raw].sort((a, b) => (b.exact % 1) - (a.exact % 1))) {
    if (left-- <= 0) break;
    out[r.id]++;
  }
  return out;
}
