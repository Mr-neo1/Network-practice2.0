import type { TopologyScene } from "../types.ts";

// Colours: blue = data packets, purple = routing protocol updates (control plane).
// Row order follows show ip route: default first, then 10.0.0.0/8, /16, /24.

const title = "R1 routing table";
const dflt = ["S* 0.0.0.0/0 [1/0]", "203.0.113.1 (ISP)"];
const r8 = ["S 10.0.0.0/8 [1/0]", "172.16.12.2 (R2)"];
const r16 = ["O 10.1.0.0/16 [110/2]", "172.16.13.2 (R3)"];
const r16b = ["O 10.1.0.0/16 [110/2]", "172.16.12.2 (R2)"];
const r24ospf = ["O 10.1.1.0/24 [110/2]", "172.16.14.2 (R4)"];
const r24eigrp = ["D 10.1.1.0/24 [90/3072]", "172.16.13.2 (R3)"];

const start = [dflt, r8, r16, r24ospf];
const afterEigrp = [dflt, r8, r16, r24eigrp];
const afterEcmp = [dflt, r8, r16, r16b, r24eigrp];

/** The table with a third column saying whether each route matches `dest`. */
const lookup = (rows: string[][], dest: string, marks: string[], best: number) => ({
  node: "r1",
  title,
  columns: ["Route", "Next hop", `${dest}?`],
  rows: rows.map((r, i) => [...r, marks[i]]),
  hl: [best],
});

const scene: TopologyScene = {
  kind: "topology",
  id: "forwarding-decisions",
  title: { en: "One destination, several matching routes: how R1 picks", hi: "Ek destination, kai matching routes: R1 kaise chunta hai" },
  height: 470,
  nodes: [
    { id: "pca", kind: "pc", x: 100, y: 230, label: "PC-A", sub: "192.168.1.10" },
    { id: "r1", kind: "router", x: 310, y: 230, label: "R1" },
    { id: "r2", kind: "router", x: 560, y: 75, label: "R2", sub: "172.16.12.2" },
    { id: "r3", kind: "router", x: 700, y: 180, label: "R3", sub: "172.16.13.2" },
    { id: "r4", kind: "router", x: 700, y: 295, label: "R4", sub: "172.16.14.2" },
    { id: "isp", kind: "router", x: 560, y: 395, label: "ISP", sub: "203.0.113.1" },
  ],
  links: [
    { id: "l-a", a: "pca", b: "r1", bPort: "Gi0/0", label: "192.168.1.0/24" },
    { id: "l-r2", a: "r1", b: "r2", aPort: "Gi0/1" },
    { id: "l-r3", a: "r1", b: "r3", aPort: "Gi0/2" },
    { id: "l-r4", a: "r1", b: "r4", aPort: "Gi0/3" },
    { id: "l-isp", a: "r1", b: "isp", aPort: "Gi1/0" },
  ],
  steps: [
    {
      title: { en: "Four routes, and they overlap", hi: "Chaar routes, aur sab overlap karte hain" },
      text: {
        en: "R1 has a default route to the ISP, a static 10.0.0.0/8 to R2, and OSPF routes for 10.1.0.0/16 (via R3) and 10.1.1.0/24 (via R4). One destination can match several of them, so R1 needs a fixed rule to pick one.",
        hi: "R1 ke paas ISP ki taraf default route hai, R2 ki taraf static 10.0.0.0/8, aur OSPF se seekhe hue 10.1.0.0/16 (R3 ke through) aur 10.1.1.0/24 (R4 ke through). Ek destination inme se kai routes se match ho sakta hai, isliye R1 ko ek chunne ke liye fixed rule chahiye.",
      },
      focus: ["r1"],
      tables: [{ node: "r1", title, columns: ["Route", "Next hop"], rows: start }],
    },
    {
      title: { en: "10.1.1.5: four matches, the /24 wins", hi: "10.1.1.5: chaar match, /24 jeeta" },
      text: {
        en: "All four routes match 10.1.1.5: /0 matches everything, and 10, 10.1 and 10.1.1 all agree with the address. The /24 matches the most bits, so the packet goes to R4. The static /8 has the lower AD, but AD is never compared between different prefixes.",
        hi: "10.1.1.5 chaaron routes se match karta hai: /0 sab kuch match karta hai, aur 10, 10.1 aur 10.1.1 teeno address se milte hain. /24 sabse zyada bits match karta hai, isliye packet R4 ko jaata hai. Static /8 ka AD kam hai, lekin alag-alag prefixes ke beech AD compare hi nahi hota.",
      },
      focus: ["r4"],
      packets: [{ path: ["pca", "r1", "r4"], label: "To 10.1.1.5", tone: "blue" }],
      tables: [lookup(start, "10.1.1.5", ["yes /0", "yes /8", "yes /16", "yes /24, best"], 3)],
    },
    {
      title: { en: "10.1.2.5: the /24 no longer fits", hi: "10.1.2.5: ab /24 fit nahi hota" },
      text: {
        en: "The third octet is 2, not 1, so 10.1.1.0/24 does not match. The longest route left is 10.1.0.0/16, so the packet goes to R3.",
        hi: "Teesra octet 2 hai, 1 nahi, isliye 10.1.1.0/24 match nahi karta. Bache hue routes mein sabse lamba 10.1.0.0/16 hai, toh packet R3 ko jaata hai.",
      },
      focus: ["r3"],
      packets: [{ path: ["pca", "r1", "r3"], label: "To 10.1.2.5", tone: "blue" }],
      tables: [lookup(start, "10.1.2.5", ["yes /0", "yes /8", "yes /16, best", "no"], 2)],
    },
    {
      title: { en: "10.2.0.1: only the /8 and the default", hi: "10.2.0.1: sirf /8 aur default" },
      text: {
        en: "10.2.0.1 is outside 10.1.0.0/16, so only 10.0.0.0/8 and the default route match. The /8 is longer, so the packet goes to R2.",
        hi: "10.2.0.1, 10.1.0.0/16 ke bahar hai, isliye sirf 10.0.0.0/8 aur default route match karte hain. /8 zyada lamba hai, toh packet R2 ko jaata hai.",
      },
      focus: ["r2"],
      packets: [{ path: ["pca", "r1", "r2"], label: "To 10.2.0.1", tone: "blue" }],
      tables: [lookup(start, "10.2.0.1", ["yes /0", "yes /8, best", "no", "no"], 1)],
    },
    {
      title: { en: "8.8.8.8: only the default matches", hi: "8.8.8.8: sirf default match karta hai" },
      text: {
        en: "No 10.x route contains 8.8.8.8. The default route 0.0.0.0/0 checks zero bits, so it matches every address but loses to anything longer. Here it is the only match, and the packet goes to the ISP.",
        hi: "Koi bhi 10.x route 8.8.8.8 ko cover nahi karta. Default route 0.0.0.0/0 zero bits check karta hai, isliye har address se match karta hai, lekin kisi bhi lambe route se haar jaata hai. Yahan sirf wahi match hai, toh packet ISP ko jaata hai.",
      },
      focus: ["isp"],
      packets: [{ path: ["pca", "r1", "isp"], label: "To 8.8.8.8", tone: "blue" }],
      tables: [lookup(start, "8.8.8.8", ["yes /0, best", "no", "no", "no"], 0)],
    },
    {
      title: { en: "Same prefix, two sources: AD decides", hi: "Same prefix, do sources: AD decide karta hai" },
      text: {
        en: "R3 now also advertises 10.1.1.0/24 with EIGRP. R1 has two offers for exactly the same prefix, so it compares administrative distance: EIGRP's 90 beats OSPF's 110, and the EIGRP route replaces the OSPF one.",
        hi: "Ab R3 bhi EIGRP se 10.1.1.0/24 advertise karta hai. R1 ke paas bilkul same prefix ke do offers hain, isliye woh administrative distance compare karta hai: EIGRP ka 90, OSPF ke 110 se behtar hai, aur EIGRP route OSPF wale ki jagah le leta hai.",
      },
      focus: ["r1", "r3"],
      packets: [{ path: ["r3", "r1"], label: "EIGRP Update", tone: "purple" }],
      tables: [
        { node: "r1", title, columns: ["Route", "Next hop"], rows: afterEigrp, hl: [3] },
        {
          node: "r1",
          title: "Offers for 10.1.1.0/24",
          columns: ["Source", "AD", "Next hop", "Result"],
          rows: [
            ["OSPF", "110", "R4", "not installed"],
            ["EIGRP", "90", "R3", "installed"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "10.1.1.5 again: same /24, new next hop", hi: "10.1.1.5 phir se: wahi /24, naya next hop" },
      text: {
        en: "Longest match still picks 10.1.1.0/24, but that entry now points to R3, so the packet goes there. OSPF keeps its path through R4 in its own database and reinstalls it only if the EIGRP route disappears.",
        hi: "Longest match abhi bhi 10.1.1.0/24 hi chunta hai, lekin ab yeh entry R3 ki taraf point karti hai, toh packet wahan jaata hai. OSPF, R4 wala path apne database mein rakhta hai aur use tabhi install karta hai jab EIGRP route gayab ho jaaye.",
      },
      focus: ["r3"],
      packets: [{ path: ["pca", "r1", "r3"], label: "To 10.1.1.5", tone: "blue" }],
      tables: [lookup(afterEigrp, "10.1.1.5", ["yes /0", "yes /8", "yes /16", "yes /24, best"], 3)],
    },
    {
      title: { en: "One protocol, equal cost: both paths", hi: "Ek protocol, barabar cost: dono paths" },
      text: {
        en: "OSPF now also finds a path to 10.1.0.0/16 through R2. Inside one protocol the metric decides, and both paths cost 2, so R1 installs both next hops. Had the path through R2 cost 3, only R3's path would be installed.",
        hi: "Ab OSPF ko R2 ke through bhi 10.1.0.0/16 ka path milta hai. Ek hi protocol ke andar metric decide karta hai, aur dono paths ki cost 2 hai, isliye R1 dono next hops install kar leta hai. Agar R2 wale path ki cost 3 hoti, toh sirf R3 wala path install hota.",
      },
      focus: ["r1", "r2"],
      packets: [{ path: ["r2", "r1"], label: "OSPF LSU", tone: "purple" }],
      tables: [
        { node: "r1", title: "Offers for 10.1.1.0/24", columns: ["Source", "AD", "Next hop", "Result"], rows: [] },
        { node: "r1", title, columns: ["Route", "Next hop"], rows: afterEcmp, hl: [2, 3] },
        {
          node: "r1",
          title: "OSPF paths to 10.1.0.0/16",
          columns: ["Next hop", "Cost", "Result"],
          rows: [
            ["R3", "2", "installed"],
            ["R2", "2", "installed"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "Equal-cost paths share the load", hi: "Equal-cost paths load baant lete hain" },
      text: {
        en: "Traffic for 10.1.0.0/16 is now shared between R3 and R2. By default CEF keeps each source-destination pair on one path, so, for example, the flow to 10.1.2.5 uses R3 while the flow to 10.1.3.7 uses R2.",
        hi: "Ab 10.1.0.0/16 ka traffic R3 aur R2 ke beech baant diya jaata hai. By default CEF har source-destination pair ko ek hi path par rakhta hai, jaise yahan 10.1.2.5 wala flow R3 se jaata hai aur 10.1.3.7 wala flow R2 se.",
      },
      focus: ["r2", "r3"],
      packets: [
        { path: ["pca", "r1", "r3"], label: "To 10.1.2.5", tone: "blue" },
        { path: ["pca", "r1", "r2"], label: "To 10.1.3.7", tone: "blue", delay: 1 },
      ],
      tables: [
        {
          node: "r1",
          title,
          columns: ["Route", "Next hop", "Flow"],
          rows: afterEcmp.map((r, i) => [...r, i === 2 ? "to 10.1.2.5" : i === 3 ? "to 10.1.3.7" : ""]),
          hl: [2, 3],
        },
      ],
    },
  ],
};

export default scene;
