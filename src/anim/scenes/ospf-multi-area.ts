import type { TopologyScene } from "../types.ts";

// Three OSPF areas in a line, matching src/content/lessons/ospf-multi-area.ts.
//   Area 1: R1 (internal, LANs 10.1.0.0/24-10.1.3.0/24) -- 10.0.12.0/30 -- R2 (ABR)
//   Area 0: R2 -- 10.0.23.0/30 -- R3 (backbone, ASBR) -- 10.0.34.0/30 -- R4 (ABR)
//   Area 2: R4 -- 10.0.45.0/30 -- R5 (internal, LANs 10.2.0.0/24-10.2.3.0/24)
//   R3 Gi0/2 -- ISP (203.0.113.1); static default + default-information originate on R3.
// All links Gigabit Ethernet (cost 1), router links point-to-point (no DR, no type 2).
// R2 has `area 1 range 10.1.0.0 255.255.252.0`, R4 has `area 2 range 10.2.0.0 255.255.252.0`.
// Colours: purple = type 1, teal = type 3, orange = type 4/5 (external), blue = user data, green = stub default.

const scene: TopologyScene = {
  kind: "topology",
  id: "ospf-multi-area",
  title: { en: "Multi-area OSPF: type 1 stays home, ABRs speak in type 3", hi: "Multi-area OSPF: type 1 ghar par rehta hai, ABRs type 3 mein baat karte hain" },
  height: 440,
  nodes: [
    { id: "isp", kind: "internet", x: 400, y: 70, label: "ISP", sub: "203.0.113.1" },
    { id: "r1", kind: "router", x: 90, y: 330, label: "R1", sub: "RID 1.1.1.1", sub2: "LANs 10.1.0-3.0/24" },
    { id: "r2", kind: "router", x: 245, y: 200, label: "R2", sub: "RID 2.2.2.2", sub2: "ABR area 1 | 0" },
    { id: "r3", kind: "router", x: 400, y: 200, label: "R3", sub: "RID 3.3.3.3", sub2: "area 0, ASBR" },
    { id: "r4", kind: "router", x: 555, y: 200, label: "R4", sub: "RID 4.4.4.4", sub2: "ABR area 0 | 2" },
    { id: "r5", kind: "router", x: 710, y: 330, label: "R5", sub: "RID 5.5.5.5", sub2: "LANs 10.2.0-3.0/24" },
  ],
  links: [
    { id: "l12", a: "r1", b: "r2", aPort: "Gi0/0", bPort: "Gi0/0", label: "Area 1" },
    { id: "l23", a: "r2", b: "r3", aPort: "Gi0/1", bPort: "Gi0/0", label: "Area 0" },
    { id: "l34", a: "r3", b: "r4", aPort: "Gi0/1", bPort: "Gi0/0", label: "Area 0" },
    { id: "l45", a: "r4", b: "r5", aPort: "Gi0/1", bPort: "Gi0/0", label: "Area 2" },
    { id: "l3i", a: "r3", b: "isp", aPort: "Gi0/2", label: "external" },
  ],
  steps: [
    {
      title: { en: "Three areas, four router roles", hi: "Teen areas, routers ke chaar roles" },
      text: {
        en: "R1 sits only in area 1 and R5 only in area 2: internal routers. R2 and R4 each have one interface in area 0 and one in another area, so they are ABRs. R3 is a backbone router and, because it will inject a route from the ISP, an ASBR. Every link costs 1.",
        hi: "R1 sirf area 1 mein hai aur R5 sirf area 2 mein: dono internal routers. R2 aur R4 ka ek interface area 0 mein aur ek doosre area mein hai, isliye dono ABR hain. R3 backbone router hai, aur ISP ka route andar laayega isliye ASBR bhi. Har link ki cost 1 hai.",
      },
      focus: ["r2", "r3", "r4"],
      badges: [
        { node: "r1", text: "internal", tone: "gray" },
        { node: "r2", text: "ABR", tone: "teal" },
        { node: "r3", text: "ASBR", tone: "orange" },
        { node: "r4", text: "ABR", tone: "teal" },
        { node: "r5", text: "internal", tone: "gray" },
      ],
    },
    {
      title: { en: "Type 1 LSAs stay inside their area", hi: "Type 1 LSAs apne area ke andar rehte hain" },
      text: {
        en: "In area 1, R1 and R2 flood their Router LSAs (type 1) to each other. R3 floods its type 1 only inside area 0, and R5 only inside area 2. R2 keeps two LSDBs, one per area. R1's LSDB holds exactly two Router LSAs: R1's and R2's.",
        hi: "Area 1 mein R1 aur R2 apne Router LSAs (type 1) ek doosre ko flood karte hain. R3 apna type 1 sirf area 0 mein flood karta hai, aur R5 sirf area 2 mein. R2 do LSDBs rakhta hai, har area ka ek. R1 ke LSDB mein exactly do Router LSAs hain: R1 ka aur R2 ka.",
      },
      packets: [
        { path: ["r1", "r2"], label: "Type 1 (R1)", tone: "purple" },
        { path: ["r2", "r1"], label: "Type 1 (R2)", tone: "purple" },
        { path: ["r3", "r2"], label: "Type 1 (R3)", tone: "purple" },
        { path: ["r3", "r4"], label: "Type 1 (R3)", tone: "purple" },
        { path: ["r5", "r4"], label: "Type 1 (R5)", tone: "purple" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 LSDB (area 1)",
          columns: ["Type", "Link ID", "ADV Router"],
          rows: [
            ["1", "1.1.1.1", "1.1.1.1"],
            ["1", "2.2.2.2", "2.2.2.2"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "R2 summarises area 1 into area 0", hi: "R2 area 1 ko area 0 mein summarise karta hai" },
      text: {
        en: "R2 runs SPF on its area 1 LSDB. It does not pass R1's type 1 on. It creates type 3 LSAs with itself as advertising router: 10.1.0.0/22 cost 2 (from `area 1 range`, replacing four /24s) and 10.0.12.0/30 cost 1. They flood through area 0 via R3 to R4.",
        hi: "R2 apne area 1 LSDB par SPF chalata hai. R1 ka type 1 aage nahi bhejta. Woh khud advertising router ban kar type 3 LSAs banata hai: 10.1.0.0/22 cost 2 (`area 1 range` se, chaar /24 ki jagah) aur 10.0.12.0/30 cost 1. Yeh area 0 mein R3 se hokar R4 tak flood hote hain.",
      },
      focus: ["r2"],
      packets: [{ path: ["r2", "r3", "r4"], label: "T3 10.1.0.0/22", tone: "teal" }],
      tables: [
        {
          node: "r3",
          title: "R3 LSDB (area 0, type 3)",
          columns: ["Link ID", "ADV Router", "Cost"],
          rows: [
            ["10.1.0.0 /22", "2.2.2.2", "2"],
            ["10.0.12.0 /30", "2.2.2.2", "1"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "ABRs regenerate type 3, in both directions", hi: "ABRs type 3 dobara banate hain, dono taraf" },
      text: {
        en: "R4 does not forward R2's LSA into area 2. It creates a new type 3 for 10.1.0.0/22 with ADV Router 4.4.4.4 and its own cost, 4, so R5 installs O IA at cost 5. The same happens the other way: R4 sends 10.2.0.0/22 into area 0, and R2 re-creates it in area 1. R1's type 3s (10.2.0.0 and the three transit links) all name 2.2.2.2.",
        hi: "R4, R2 ka LSA area 2 mein forward nahi karta. Woh 10.1.0.0/22 ke liye naya type 3 banata hai, ADV Router 4.4.4.4 aur apni cost 4 ke saath, toh R5 cost 5 par O IA install karta hai. Ulti taraf bhi yahi hota hai: R4 10.2.0.0/22 area 0 mein bhejta hai, aur R2 use area 1 mein dobara banata hai. R1 ke saare type 3 (10.2.0.0 aur teen transit links) mein 2.2.2.2 ka naam hai.",
      },
      focus: ["r4", "r2"],
      packets: [
        { path: ["r4", "r5"], label: "T3 10.1.0.0/22", tone: "teal" },
        { path: ["r4", "r3", "r2"], label: "T3 10.2.0.0/22", tone: "teal" },
        { path: ["r2", "r1"], label: "T3 10.2.0.0/22", tone: "teal", delay: 2 },
      ],
      tables: [
        {
          node: "r5",
          title: "R5 routes",
          columns: ["Code", "Prefix", "AD/cost"],
          rows: [
            ["O IA", "10.0.12.0/30", "110/4"],
            ["O IA", "10.0.23.0/30", "110/3"],
            ["O IA", "10.0.34.0/30", "110/2"],
            ["O IA", "10.1.0.0/22", "110/5"],
          ],
          hl: [3],
        },
        {
          node: "r1",
          title: "R1 LSDB (area 1)",
          columns: ["Type", "Link ID", "ADV Router"],
          rows: [
            ["1", "1.1.1.1", "1.1.1.1"],
            ["1", "2.2.2.2", "2.2.2.2"],
            ["3", "10.2.0.0 +3 more", "2.2.2.2"],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "The ASBR creates a type 5 for the default", hi: "ASBR default ke liye type 5 banata hai" },
      text: {
        en: "R3 has a static default route to the ISP and `default-information originate`. It creates a type 5 LSA for 0.0.0.0/0, type E2, metric 1, with ADV Router 3.3.3.3, and floods it across area 0 to R2 and R4.",
        hi: "R3 par ISP ki taraf static default route hai aur `default-information originate` laga hai. Woh 0.0.0.0/0 ke liye type 5 LSA banata hai, type E2, metric 1, ADV Router 3.3.3.3, aur use area 0 mein R2 aur R4 tak flood karta hai.",
      },
      focus: ["r3", "isp"],
      links: [{ id: "l3i", state: "active", note: "static 0.0.0.0/0" }],
      packets: [
        { path: ["r3", "r2"], label: "T5 0.0.0.0/0", tone: "orange" },
        { path: ["r3", "r4"], label: "T5 0.0.0.0/0", tone: "orange" },
      ],
    },
    {
      title: { en: "Type 5 passes unchanged; ABRs add type 4", hi: "Type 5 bina badle jaata hai; ABRs type 4 jodte hain" },
      text: {
        en: "R2 and R4 flood the type 5 into areas 1 and 2 as it is: ADV Router stays 3.3.3.3. But R1 has no type 1 for R3, so it cannot cost a path to it. R2 adds a type 4: \"ASBR 3.3.3.3 is reachable through me.\" R4 does the same for R5.",
        hi: "R2 aur R4 type 5 ko areas 1 aur 2 mein waisa hi flood karte hain: ADV Router 3.3.3.3 hi rehta hai. Lekin R1 ke paas R3 ka type 1 nahi hai, toh woh R3 tak ki cost nahi nikaal sakta. R2 ek type 4 jodta hai: \"ASBR 3.3.3.3 mere through milta hai.\" R4 R5 ke liye yahi karta hai.",
      },
      links: [{ id: "l3i", state: "normal" }],
      packets: [
        { path: ["r2", "r1"], label: "T5 0.0.0.0/0", tone: "orange" },
        { path: ["r2", "r1"], label: "T4 ASBR 3.3.3.3", tone: "orange", delay: 1 },
        { path: ["r4", "r5"], label: "T5 0.0.0.0/0", tone: "orange" },
        { path: ["r4", "r5"], label: "T4 ASBR 3.3.3.3", tone: "orange", delay: 1 },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 LSDB (area 1)",
          columns: ["Type", "Link ID", "ADV Router"],
          rows: [
            ["1", "1.1.1.1", "1.1.1.1"],
            ["1", "2.2.2.2", "2.2.2.2"],
            ["3", "10.2.0.0 +3 more", "2.2.2.2"],
            ["4", "3.3.3.3", "2.2.2.2"],
            ["5", "0.0.0.0", "3.3.3.3"],
          ],
          hl: [3, 4],
        },
        {
          node: "r5",
          title: "R5 routes",
          columns: ["Code", "Prefix", "AD/cost"],
          rows: [
            ["O*E2", "0.0.0.0/0", "110/1"],
            ["O IA", "10.0.12.0/30", "110/4"],
            ["O IA", "10.0.23.0/30", "110/3"],
            ["O IA", "10.0.34.0/30", "110/2"],
            ["O IA", "10.1.0.0/22", "110/5"],
          ],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "R1's routing table: O IA and O*E2", hi: "R1 ki routing table: O IA aur O*E2" },
      text: {
        en: "Every type 3 became an O IA route and the type 5 became O*E2 [110/1]; E2 keeps metric 1 however far away the ASBR is. All routes point at R2. A packet from R1's LAN to 198.51.100.7 follows the default route through R2 and R3 to the ISP.",
        hi: "Har type 3 ek O IA route bana aur type 5 O*E2 [110/1] bana; ASBR kitna bhi door ho, E2 metric 1 hi rehta hai. Saare routes R2 ki taraf hain. R1 ke LAN se 198.51.100.7 ka packet default route se R2 aur R3 hokar ISP tak jaata hai.",
      },
      focus: ["r1"],
      packets: [{ path: ["r1", "r2", "r3", "isp"], label: "to 198.51.100.7", tone: "blue" }],
      tables: [
        {
          node: "r1",
          title: "R1 routes",
          columns: ["Code", "Prefix", "AD/cost"],
          rows: [
            ["O*E2", "0.0.0.0/0", "110/1"],
            ["O IA", "10.0.23.0/30", "110/2"],
            ["O IA", "10.0.34.0/30", "110/3"],
            ["O IA", "10.0.45.0/30", "110/4"],
            ["O IA", "10.2.0.0/22", "110/5"],
          ],
          hl: [0, 4],
        },
      ],
    },
    {
      title: { en: "A flap in area 2 stays in area 2", hi: "Area 2 ka flap area 2 mein hi rehta hai" },
      text: {
        en: "R5's LAN 10.2.3.0/24 goes down. R5 floods a new type 1, but only to R4. R4 reruns SPF for area 2. Three LANs inside 10.2.0.0/22 are still up, so the summary does not change and R4 sends nothing into area 0. R1, R2 and R3 do no work at all.",
        hi: "R5 ka LAN 10.2.3.0/24 down hota hai. R5 naya type 1 flood karta hai, lekin sirf R4 tak. R4 area 2 ke liye SPF dobara chalata hai. 10.2.0.0/22 ke andar teen LANs abhi bhi up hain, toh summary nahi badalti aur R4 area 0 mein kuch nahi bhejta. R1, R2 aur R3 ko koi kaam nahi karna padta.",
      },
      focus: ["r5", "r4"],
      packets: [{ path: ["r5", "r4"], label: "Type 1 (new)", tone: "purple" }],
      badges: [
        { node: "r5", text: "10.2.3.0 down", tone: "red" },
        { node: "r4", text: "summary same", tone: "green" },
        { node: "r1", text: "no change", tone: "gray" },
        { node: "r2", text: "no change", tone: "gray" },
        { node: "r3", text: "no change", tone: "gray" },
      ],
    },
    {
      title: { en: "Make area 2 a stub", hi: "Area 2 ko stub banao" },
      text: {
        en: "With `area 2 stub` on R4 and R5, R4 stops flooding type 4 and type 5 into area 2 and sends a type 3 default instead, cost 1. R5's O*E2 is replaced by O*IA 0.0.0.0/0 at cost 2; its O IA routes stay. R5 still reaches the internet through R4.",
        hi: "R4 aur R5 par `area 2 stub` lagane ke baad R4 area 2 mein type 4 aur type 5 flood karna band karta hai aur unki jagah cost 1 ka type 3 default bhejta hai. R5 ka O*E2 hat kar O*IA 0.0.0.0/0 cost 2 aa jaata hai; O IA routes bane rehte hain. R5 internet tak ab bhi R4 se hi jaata hai.",
      },
      focus: ["r4", "r5"],
      badges: [
        { node: "r5", text: "stub", tone: "green" },
        { node: "r4", text: "stub ABR", tone: "green" },
        { node: "r1", text: "internal", tone: "gray" },
        { node: "r2", text: "ABR", tone: "teal" },
        { node: "r3", text: "ASBR", tone: "orange" },
      ],
      packets: [{ path: ["r4", "r5"], label: "T3 0.0.0.0/0", tone: "green" }],
      tables: [
        {
          node: "r5",
          title: "R5 routes",
          columns: ["Code", "Prefix", "AD/cost"],
          rows: [
            ["O*IA", "0.0.0.0/0", "110/2"],
            ["O IA", "10.0.12.0/30", "110/4"],
            ["O IA", "10.0.23.0/30", "110/3"],
            ["O IA", "10.0.34.0/30", "110/2"],
            ["O IA", "10.1.0.0/22", "110/5"],
          ],
          hl: [0],
        },
      ],
    },
  ],
};

export default scene;
