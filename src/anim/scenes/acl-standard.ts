import type { TopologyScene } from "../types.ts";

// Colours: green = permitted by the ACL, red = denied, blue = traffic the ACL never checks.
// Packet labels show the source address, because that is all a standard ACL looks at.

const aclRows = (hits10: string, hits20: string) => [
  ["10", "deny host 192.168.1.20", hits10],
  ["20", "permit 192.168.1.0 0.0.0.255", hits20],
  ["end", "deny any (implicit)", "not counted"],
];

const scene: TopologyScene = {
  kind: "topology",
  id: "acl-standard",
  title: { en: "Standard ACL 1 out on Gi0/2: who reaches the server LAN", hi: "Gi0/2 par out lagi standard ACL 1: server LAN tak kaun pahunchta hai" },
  height: 400,
  nodes: [
    { id: "pc1", kind: "pc", x: 110, y: 70, label: "PC1", sub: "192.168.1.10" },
    { id: "pc2", kind: "pc", x: 110, y: 200, label: "PC2", sub: "192.168.1.20" },
    { id: "pc3", kind: "pc", x: 110, y: 330, label: "PC3", sub: "192.168.2.10" },
    { id: "sw1", kind: "switch", x: 260, y: 135, label: "SW1" },
    { id: "r1", kind: "router", x: 450, y: 200, label: "R1" },
    { id: "srv", kind: "server", x: 680, y: 200, label: "SRV1", sub: "10.1.1.100" },
  ],
  links: [
    { id: "l-p1", a: "pc1", b: "sw1" },
    { id: "l-p2", a: "pc2", b: "sw1" },
    { id: "l-a", a: "sw1", b: "r1", bPort: "Gi0/0", label: "192.168.1.0/24" },
    { id: "l-b", a: "pc3", b: "r1", bPort: "Gi0/1", label: "192.168.2.0/24" },
    { id: "l-s", a: "r1", b: "srv", aPort: "Gi0/2", label: "10.1.1.0/24" },
  ],
  steps: [
    {
      title: { en: "ACL 1 guards traffic leaving Gi0/2", hi: "ACL 1 Gi0/2 se nikalne wala traffic check karti hai" },
      text: {
        en: "Policy: only LAN A may reach the server LAN, but not PC2. R1 has `access-list 1 deny host 192.168.1.20`, then `access-list 1 permit 192.168.1.0 0.0.0.255`, applied with `ip access-group 1 out` on Gi0/2. The invisible implicit deny sits under both lines.",
        hi: "Policy: server LAN tak sirf LAN A pahunche, lekin PC2 nahi. R1 par `access-list 1 deny host 192.168.1.20`, phir `access-list 1 permit 192.168.1.0 0.0.0.255` hai, aur Gi0/2 par `ip access-group 1 out` se apply ki gayi hai. Dono lines ke neeche invisible implicit deny baitha hai.",
      },
      focus: ["r1"],
      badges: [{ node: "r1", text: "ACL 1 out Gi0/2", tone: "purple" }],
      links: [{ id: "l-s", state: "active", note: "ACL 1 out" }],
      tables: [{ node: "r1", title: "R1 · access list 1", columns: ["Seq", "Entry", "Matches"], rows: aclRows("0", "0") }],
    },
    {
      title: { en: "PC1 to SRV1: line 20 permits", hi: "PC1 se SRV1: line 20 permit karti hai" },
      text: {
        en: "R1 routes the packet to Gi0/2, so ACL 1 runs. Line 10: source 192.168.1.10 is not .20, no match. Line 20: the first three octets are 192.168.1, match, permit. SRV1's reply leaves through Gi0/0, which has no ACL, so it is never checked.",
        hi: "R1 packet ko Gi0/2 ki taraf route karta hai, isliye ACL 1 chalti hai. Line 10: source 192.168.1.10 hai, .20 nahi, match nahi. Line 20: pehle teen octets 192.168.1 hain, match, permit. SRV1 ka reply Gi0/0 se nikalta hai jahan koi ACL nahi, toh woh check hi nahi hota.",
      },
      packets: [
        { path: ["pc1", "sw1", "r1", "srv"], label: "src 192.168.1.10", tone: "green" },
        { path: ["srv", "r1", "sw1", "pc1"], label: "reply", tone: "blue", delay: 3 },
      ],
      tables: [{ node: "r1", title: "R1 · access list 1", columns: ["Seq", "Entry", "Matches"], rows: aclRows("0", "1"), hl: [1] }],
    },
    {
      title: { en: "PC2 to SRV1: line 10 denies, then stop", hi: "PC2 se SRV1: line 10 deny karti hai, phir stop" },
      text: {
        en: "PC2's source 192.168.1.20 matches line 10 exactly, so R1 drops the packet. Line 20 would have permitted it, but it is never checked: the first match ends the search. That is why the host line sits above the subnet line.",
        hi: "PC2 ka source 192.168.1.20 line 10 se exactly match karta hai, toh R1 packet drop kar deta hai. Line 20 isse permit kar deti, lekin woh check hi nahi hoti: pehla match milte hi search khatam. Isiliye host wali line subnet wali line ke upar hai.",
      },
      focus: ["pc2", "r1"],
      packets: [{ path: ["pc2", "sw1", "r1"], label: "src 192.168.1.20", tone: "red", drop: true }],
      badges: [{ node: "pc2", text: "denied: line 10", tone: "red" }],
      tables: [{ node: "r1", title: "R1 · access list 1", columns: ["Seq", "Entry", "Matches"], rows: aclRows("1", "1"), hl: [0] }],
    },
    {
      title: { en: "PC3 to SRV1: the implicit deny", hi: "PC3 se SRV1: implicit deny" },
      text: {
        en: "Source 192.168.2.10 is not .20 and its third octet is 2, not 1, so neither line matches. The implicit deny drops it. Look at the counters: nothing changed, because the implicit deny has no counter.",
        hi: "Source 192.168.2.10 na .20 hai, na uska third octet 1 hai (2 hai), toh koi line match nahi karti. Implicit deny use drop kar deta hai. Counters dekho: kuch nahi badla, kyunki implicit deny ka koi counter nahi hota.",
      },
      focus: ["pc3", "r1"],
      packets: [{ path: ["pc3", "r1"], label: "src 192.168.2.10", tone: "red", drop: true }],
      badges: [{ node: "pc3", text: "implicit deny", tone: "red" }],
      tables: [{ node: "r1", title: "R1 · access list 1", columns: ["Seq", "Entry", "Matches"], rows: aclRows("1", "1"), hl: [2] }],
    },
    {
      title: { en: "PC3 to PC1: no ACL on this path", hi: "PC3 se PC1: is path par koi ACL nahi" },
      text: {
        en: "PC3 pings PC1. R1 routes it out Gi0/0, not Gi0/2, so ACL 1 is never consulted and the ping works both ways. Placed near the destination, a standard ACL blocks LAN B only from the server LAN.",
        hi: "PC3, PC1 ko ping karta hai. R1 ise Gi0/2 nahi, Gi0/0 se route karta hai, toh ACL 1 check hi nahi hoti aur ping dono taraf chalta hai. Destination ke paas lagi standard ACL LAN B ko sirf server LAN se block karti hai.",
      },
      focus: ["pc3", "pc1"],
      badges: [{ node: "pc3", text: "" }, { node: "pc2", text: "" }],
      packets: [
        { path: ["pc3", "r1", "sw1", "pc1"], label: "src 192.168.2.10", tone: "blue" },
        { path: ["pc1", "sw1", "r1", "pc3"], label: "reply", tone: "blue", delay: 3 },
      ],
    },
    {
      title: { en: "What if ACL 1 sat near the source?", hi: "Agar ACL 1 source ke paas hoti?" },
      text: {
        en: "Suppose ACL 1 were applied in on Gi0/1 instead. PC3's ping to PC1 enters Gi0/1, matches neither line and hits the implicit deny. A rule meant to protect the servers would cut LAN B off from everything. A standard ACL cannot see destinations, so keep it near them.",
        hi: "Maan lo ACL 1 Gi0/1 par in lagi hoti. PC3 ka PC1 wala ping Gi0/1 par aata, kisi line se match nahi karta aur implicit deny se takra jaata. Servers ko bachane wala rule LAN B ko har jagah se kaat deta. Standard ACL destination dekh nahi sakti, isliye use destination ke paas hi rakho.",
      },
      focus: ["pc3", "r1"],
      links: [
        { id: "l-s", state: "normal" },
        { id: "l-b", state: "blocked", note: "if ACL 1 in here" },
      ],
      badges: [{ node: "r1", text: "ACL 1 in Gi0/1 (wrong)", tone: "red" }],
      packets: [{ path: ["pc3", "r1"], label: "to PC1", tone: "red", drop: true }],
    },
    {
      title: { en: "access-class 10: who may SSH to R1", hi: "access-class 10: R1 par SSH kaun kar sakta hai" },
      text: {
        en: "Back to the real setup, plus `access-list 10 permit host 192.168.1.10` and `access-class 10 in` on `line vty 0 4`. PC1's SSH session to R1 is accepted. PC3's attempt matches nothing in ACL 10 and is refused before any login prompt.",
        hi: "Wapas asli setup par, aur saath mein `access-list 10 permit host 192.168.1.10` aur `line vty 0 4` par `access-class 10 in`. PC1 ka R1 par SSH session accept hota hai. PC3 ki koshish ACL 10 ki kisi line se match nahi karti, aur login prompt se pehle hi refuse ho jaati hai.",
      },
      focus: ["r1"],
      links: [
        { id: "l-b", state: "normal" },
        { id: "l-s", state: "active", note: "ACL 1 out" },
      ],
      badges: [
        { node: "r1", text: "VTY: access-class 10", tone: "purple" },
        { node: "pc1", text: "SSH ok", tone: "green" },
        { node: "pc3", text: "refused", tone: "red" },
      ],
      packets: [
        { path: ["pc1", "sw1", "r1"], label: "SSH to R1", tone: "green" },
        { path: ["pc3", "r1"], label: "SSH to R1", tone: "red", drop: true },
      ],
      tables: [{ node: "r1", title: "R1 · access list 10 (VTY)", columns: ["Seq", "Entry", "Matches"], rows: [["10", "permit host 192.168.1.10", "1"], ["end", "deny any (implicit)", "not counted"]], hl: [0] }],
    },
  ],
};

export default scene;
