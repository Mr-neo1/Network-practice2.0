import type { TopologyScene } from "../types.ts";

// Four routers in single-area OSPF (area 0), default reference bandwidth (100 Mbps).
// Gigabit links cost 1; the R3-R4 T1 serial link (1544 kbps) costs 64.
// Addressing matches the lesson:
//   R1-R2 10.0.12.0/30 (R1 .1, R2 .2)   R1-R3 10.0.13.0/30 (R1 .1, R3 .2)
//   R2-R4 10.0.24.0/30 (R2 .1, R4 .2)   R3-R4 10.0.34.0/30 (R3 .1, R4 .2)
//   PC1 LAN 10.1.1.0/24 on R1 Gi0/2     PC4 LAN 10.4.4.0/24 on R4 Gi0/2
// Colours: purple = Hello, orange = database packets (DBD, LSR, LSU, LSAck), blue = user data.

const scene: TopologyScene = {
  kind: "topology",
  id: "ospf-basics",
  title: { en: "OSPF from Hello to best path: adjacencies, flooding and SPF", hi: "Hello se best path tak OSPF: adjacencies, flooding aur SPF" },
  height: 440,
  nodes: [
    { id: "pc1", kind: "pc", x: 70, y: 220, label: "PC1", sub: "10.1.1.10/24" },
    { id: "r1", kind: "router", x: 215, y: 220, label: "R1", sub: "RID 1.1.1.1" },
    { id: "r2", kind: "router", x: 400, y: 95, label: "R2", sub: "RID 2.2.2.2" },
    { id: "r3", kind: "router", x: 400, y: 345, label: "R3", sub: "RID 3.3.3.3" },
    { id: "r4", kind: "router", x: 585, y: 220, label: "R4", sub: "RID 4.4.4.4" },
    { id: "pc4", kind: "pc", x: 730, y: 220, label: "PC4", sub: "10.4.4.10/24" },
  ],
  links: [
    { id: "l-p1", a: "pc1", b: "r1", bPort: "Gi0/2" },
    { id: "l12", a: "r1", b: "r2", aPort: "Gi0/0", bPort: "Gi0/0", label: "1 Gbps, cost 1" },
    { id: "l13", a: "r1", b: "r3", aPort: "Gi0/1", bPort: "Gi0/0", label: "1 Gbps, cost 1" },
    { id: "l24", a: "r2", b: "r4", aPort: "Gi0/1", bPort: "Gi0/0", label: "1 Gbps, cost 1" },
    { id: "l34", a: "r3", b: "r4", aPort: "Se0/0/0", bPort: "Se0/0/0", style: "serial", label: "T1, cost 64" },
    { id: "l-p4", a: "r4", b: "pc4", aPort: "Gi0/2" },
  ],
  steps: [
    {
      title: { en: "Four routers, OSPF just switched on", hi: "Chaar routers, OSPF abhi on hua" },
      text: {
        en: "Every router interface is in OSPF area 0, and each router has a router ID (RID) shown under it. The link labels are OSPF costs: 100 Mbps reference ÷ 1000 Mbps gives 1 for the Gigabit links, and 100 ÷ 1.544 gives 64 for the T1 serial link. No router knows anything beyond its own interfaces yet.",
        hi: "Har router ka har interface OSPF area 0 mein hai, aur har router ka router ID (RID) uske neeche likha hai. Link labels OSPF cost hain: 100 Mbps reference ÷ 1000 Mbps se Gigabit links ki cost 1 aati hai, aur 100 ÷ 1.544 se T1 serial link ki cost 64. Abhi kisi router ko apne interfaces ke aage kuch pata nahi.",
      },
      focus: ["r1", "r2", "r3", "r4"],
      tables: [
        { node: "r1", title: "R1 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["(none yet)", "", ""]] },
        { node: "r2", title: "R2 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["(none yet)", "", ""]] },
      ],
    },
    {
      title: { en: "R1 says Hello: R2 moves to INIT", hi: "R1 Hello bolta hai: R2 INIT mein" },
      text: {
        en: "R1 multicasts a Hello to 224.0.0.5 out of every OSPF interface every 10 seconds; follow the one on Gi0/0. It carries RID 1.1.1.1, area 0, Hello 10 / dead 40 and an empty list of neighbours heard, shown as [ ]. R2 checks that area, subnet, timers and authentication match, then lists 1.1.1.1 as INIT.",
        hi: "R1 har 10 second mein har OSPF interface se 224.0.0.5 par Hello multicast karta hai; Gi0/0 wala follow karo. Isme RID 1.1.1.1, area 0, Hello 10 / dead 40, aur ab tak sune gaye neighbours ki list hoti hai, jo abhi khaali hai: [ ]. R2 check karta hai ki area, subnet, timers aur authentication match karte hain, phir 1.1.1.1 ko INIT mein daal deta hai.",
      },
      focus: ["r1", "r2"],
      packets: [{ path: ["r1", "r2"], label: "Hello [ ]", tone: "purple" }],
      tables: [{ node: "r2", title: "R2 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["1.1.1.1", "INIT", "Gi0/0"]], hl: [0] }],
    },
    {
      title: { en: "Each sees its own RID: 2-WAY", hi: "Dono ko apna RID dikha: 2-WAY" },
      text: {
        en: "R2's next Hello lists 1.1.1.1 as heard. R1 finds its own RID in it, so it knows R2 hears it too, and moves R2 straight to 2-WAY. R1's next Hello lists 2.2.2.2, so R2 moves R1 to 2-WAY as well. On Ethernet the DR/BDR election happens in this state (lesson 3.7).",
        hi: "R2 ke agle Hello mein 1.1.1.1 heard list mein hai. R1 ko usme apna RID dikhta hai, yaani R2 bhi use sun raha hai, toh R1, R2 ko seedha 2-WAY mein le jaata hai. R1 ke agle Hello mein 2.2.2.2 hota hai, toh R2 bhi R1 ko 2-WAY kar deta hai. Ethernet par DR/BDR election isi state mein hota hai (lesson 3.7).",
      },
      focus: ["r1", "r2"],
      packets: [
        { path: ["r2", "r1"], label: "Hello [1.1.1.1]", tone: "purple" },
        { path: ["r1", "r2"], label: "Hello [2.2.2.2]", tone: "purple", delay: 1 },
      ],
      tables: [
        { node: "r1", title: "R1 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["2.2.2.2", "2WAY", "Gi0/0"]], hl: [0] },
        { node: "r2", title: "R2 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["1.1.1.1", "2WAY", "Gi0/0"]], hl: [0] },
      ],
    },
    {
      title: { en: "ExStart and Exchange: compare databases", hi: "ExStart aur Exchange: databases compare karo" },
      text: {
        en: "First the two routers swap empty DBD packets to agree who leads the exchange: the higher RID, R2, becomes master. Then each sends DBDs listing the headers of every LSA it holds, like a table of contents, not the LSAs themselves. An MTU mismatch shows up here: the routers get stuck in EXSTART or EXCHANGE.",
        hi: "Pehle dono routers khaali DBD packets bhej kar decide karte hain ki exchange kaun lead karega: bada RID, yaani R2, master banta hai. Phir dono DBDs bhejte hain jinme unke paas ke har LSA ka sirf header hota hai, jaise kitaab ki index, poore LSAs nahi. MTU mismatch yahin pakda jaata hai: routers EXSTART ya EXCHANGE mein atak jaate hain.",
      },
      focus: ["r1", "r2"],
      packets: [
        { path: ["r1", "r2"], label: "DBD (ExStart)", tone: "orange" },
        { path: ["r2", "r1"], label: "DBD (ExStart)", tone: "orange", delay: 1 },
        { path: ["r2", "r1"], label: "DBD headers", tone: "orange", delay: 2 },
        { path: ["r1", "r2"], label: "DBD headers", tone: "orange", delay: 3 },
      ],
      tables: [
        { node: "r1", title: "R1 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["2.2.2.2", "EXCHANGE", "Gi0/0"]], hl: [0] },
        { node: "r2", title: "R2 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["1.1.1.1", "EXCHANGE", "Gi0/0"]], hl: [0] },
      ],
    },
    {
      title: { en: "Loading, then FULL", hi: "Loading, phir FULL" },
      text: {
        en: "R1 saw LSA headers in R2's list that it does not have, so it asks for them with an LSR. R2 sends the full LSAs in an LSU, and R1 confirms with an LSAck. R2 does the same for anything it was missing. With nothing left to request, both reach FULL: their databases match.",
        hi: "R2 ki list mein R1 ko kuch LSA headers dikhe jo uske paas nahi hain, toh woh LSR bhej kar unhe maangta hai. R2 poore LSAs ek LSU mein bhejta hai, aur R1 LSAck se confirm karta hai. R2 bhi apne missing LSAs aise hi maang leta hai. Maangne ko kuch nahi bacha, toh dono FULL ho jaate hain: dono ke databases same hain.",
      },
      focus: ["r1", "r2"],
      packets: [
        { path: ["r1", "r2"], label: "LSR", tone: "orange" },
        { path: ["r2", "r1"], label: "LSU", tone: "orange", delay: 1 },
        { path: ["r1", "r2"], label: "LSAck", tone: "orange", delay: 2 },
      ],
      tables: [
        { node: "r1", title: "R1 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["2.2.2.2", "FULL", "Gi0/0"]], hl: [0] },
        { node: "r2", title: "R2 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["1.1.1.1", "FULL", "Gi0/0"]], hl: [0] },
      ],
    },
    {
      title: { en: "The same happens on every link", hi: "Har link par yahi hota hai" },
      text: {
        en: "Meanwhile the same states play out on the other three links, so every pair of directly connected routers becomes FULL. Hellos keep flowing every 10 seconds. If a router hears nothing from a neighbour for 40 seconds, the dead interval, it declares that neighbour down.",
        hi: "Isi dauraan baaki teen links par bhi yahi states chalti hain, aur directly connected routers ka har pair FULL ho jaata hai. Hellos har 10 second mein chalte rehte hain. Agar kisi neighbour se 40 second (dead interval) tak kuch sunai na de, toh router us neighbour ko down declare kar deta hai.",
      },
      packets: [
        { path: ["r1", "r3"], label: "Hello", tone: "purple" },
        { path: ["r2", "r4"], label: "Hello", tone: "purple" },
        { path: ["r3", "r4"], label: "Hello", tone: "purple" },
      ],
      links: [
        { id: "l12", state: "active" },
        { id: "l13", state: "active" },
        { id: "l24", state: "active" },
        { id: "l34", state: "active" },
      ],
      tables: [
        { node: "r1", title: "R1 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["2.2.2.2", "FULL", "Gi0/0"], ["3.3.3.3", "FULL", "Gi0/1"]], hl: [1] },
        { node: "r2", title: "R2 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [["1.1.1.1", "FULL", "Gi0/0"], ["4.4.4.4", "FULL", "Gi0/1"]], hl: [1] },
      ],
    },
    {
      title: { en: "R4's LSA floods: every LSDB is identical", hi: "R4 ka LSA flood hota hai: har LSDB same" },
      text: {
        en: "When its adjacencies came up, R4 built a new Router LSA listing its links and their costs, and flooded it in an LSU. R2 and R3 store it, acknowledge it and pass it on to R1. R1 gets two copies with the same sequence number and keeps one. Every router does the same with its own LSA, so all four end up with the same LSDB.",
        hi: "Adjacencies bante hi R4 ne naya Router LSA banaya, jisme uske links aur unki costs hain, aur use LSU mein flood kiya. R2 aur R3 use store karte hain, acknowledge karte hain aur aage R1 ko bhej dete hain. R1 ko same sequence number wali do copies milti hain, woh ek rakhta hai. Har router apne LSA ke saath yahi karta hai, isliye chaaron ka LSDB bilkul same ban jaata hai.",
      },
      packets: [
        { path: ["r4", "r2"], label: "LSU (R4 LSA)", tone: "orange" },
        { path: ["r4", "r3"], label: "LSU (R4 LSA)", tone: "orange" },
        { path: ["r2", "r1"], label: "LSU (R4 LSA)", tone: "orange", delay: 1 },
        { path: ["r3", "r1"], label: "LSU (R4 LSA)", tone: "orange", delay: 1 },
      ],
      links: [
        { id: "l12", state: "normal" },
        { id: "l13", state: "normal" },
        { id: "l24", state: "normal" },
        { id: "l34", state: "normal" },
      ],
      badges: [
        { node: "r1", text: "LSDB synced", tone: "teal" },
        { node: "r2", text: "LSDB synced", tone: "teal" },
        { node: "r3", text: "LSDB synced", tone: "teal" },
        { node: "r4", text: "LSDB synced", tone: "teal" },
      ],
      tables: [
        { node: "r2", title: "R2 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [] },
        {
          node: "r1",
          title: "R1 LSDB: router LSAs",
          columns: ["From", "Links it describes (cost)"],
          rows: [
            ["R1 1.1.1.1", "R2 (1), R3 (1), 10.1.1.0/24 (1)"],
            ["R2 2.2.2.2", "R1 (1), R4 (1)"],
            ["R3 3.3.3.3", "R1 (1), R4 (64)"],
            ["R4 4.4.4.4", "R2 (1), R3 (64), 10.4.4.0/24 (1)"],
          ],
          hl: [3],
        },
      ],
    },
    {
      title: { en: "SPF on R1: lowest total cost wins", hi: "R1 par SPF: sabse kam total cost jeetti hai" },
      text: {
        en: "R1 runs SPF with itself as the root. To reach 10.4.4.0/24 it adds the cost of each outgoing interface on the way, including R4's Gi0/2 into that LAN. Via R2: 1 + 1 + 1 = 3. Via R3: 1 + 64 + 1 = 66. Both paths cross two links between routers, so hop count would call it a tie; OSPF picks R2.",
        hi: "R1 khud ko root maan kar SPF chalata hai. 10.4.4.0/24 tak pahunchne ke liye woh raaste ke har outgoing interface ki cost jodta hai, R4 ke Gi0/2 (jo us LAN mein jaata hai) ko bhi. R2 se: 1 + 1 + 1 = 3. R3 se: 1 + 64 + 1 = 66. Dono paths do router-to-router links cross karte hain, toh hop count ke hisaab se tie hota; OSPF R2 wala path chunta hai.",
      },
      focus: ["r1"],
      links: [
        { id: "l12", state: "active" },
        { id: "l24", state: "active" },
        { id: "l-p4", state: "active" },
        { id: "l13", state: "dim" },
        { id: "l34", state: "dim" },
      ],
      badges: [{ node: "r1", text: "SPF root", tone: "purple" }],
      tables: [
        { node: "r1", title: "R1 neighbours", columns: ["Neighbor ID", "State", "Interface"], rows: [] },
        {
          node: "r1",
          title: "R1 SPF: paths to 10.4.4.0/24",
          columns: ["Path", "Costs added", "Total"],
          rows: [
            ["R1 → R2 → R4", "1 + 1 + 1", "3"],
            ["R1 → R3 → R4", "1 + 64 + 1", "66"],
          ],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "The route goes in; traffic follows it", hi: "Route install hota hai; traffic usi par chalta hai" },
      text: {
        en: "R1 installs O 10.4.4.0/24 [110/3] via 10.0.12.2: administrative distance 110, cost 3, next hop R2. PC1's ping to 10.4.4.10 follows that path. R4 ran SPF too and found its own best path back to 10.1.1.0/24 through R2, so the reply comes back the same way.",
        hi: "R1 route install karta hai: O 10.4.4.0/24 [110/3] via 10.0.12.2, yaani administrative distance 110, cost 3, next hop R2. PC1 ka 10.4.4.10 wala ping isi path par jaata hai. R4 ne bhi SPF chalaya aur 10.1.1.0/24 tak apna best path R2 se hi paaya, isliye reply bhi usi raaste wapas aata hai.",
      },
      packets: [
        { path: ["pc1", "r1", "r2", "r4", "pc4"], label: "Ping 10.4.4.10", tone: "blue" },
        { path: ["pc4", "r4", "r2", "r1", "pc1"], label: "Echo Reply", tone: "blue", delay: 4 },
      ],
      badges: [
        { node: "r1", text: "" },
        { node: "r2", text: "" },
        { node: "r3", text: "" },
        { node: "r4", text: "" },
      ],
      tables: [
        { node: "r1", title: "R1 LSDB: router LSAs", columns: ["From", "Links it describes (cost)"], rows: [] },
        { node: "r1", title: "R1 routing table (OSPF)", columns: ["Route", "[AD/cost]", "Next hop"], rows: [["O 10.4.4.0/24", "[110/3]", "10.0.12.2 Gi0/0"]], hl: [0] },
      ],
    },
    {
      title: { en: "A link fails: new LSAs, new SPF, new path", hi: "Link fail: naye LSAs, naya SPF, naya path" },
      text: {
        en: "The R2-R4 cable is cut. Both routers see their interface go down, so they drop the adjacency at once without waiting 40 seconds. Each floods a new version of its Router LSA without that link. Every router reruns SPF, and R1's best path becomes R3 at cost 66. The next ping takes the serial link.",
        hi: "R2-R4 ka cable kat gaya. Dono routers ko apna interface down dikhta hai, isliye woh 40 second ka wait kiye bina turant adjacency tod dete hain. Dono us link ke bina apne Router LSA ka naya version flood karte hain. Har router SPF dobara chalata hai, aur R1 ka best path ab R3 se hai, cost 66. Agla ping serial link se jaata hai.",
      },
      packets: [
        { path: ["r2", "r1"], label: "LSU (R2 LSA)", tone: "orange" },
        { path: ["r4", "r3", "r1"], label: "LSU (R4 LSA)", tone: "orange" },
        { path: ["pc1", "r1", "r3", "r4", "pc4"], label: "Ping 10.4.4.10", tone: "blue", delay: 2 },
      ],
      links: [
        { id: "l24", state: "down" },
        { id: "l12", state: "dim" },
        { id: "l13", state: "active" },
        { id: "l34", state: "active" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 SPF: paths to 10.4.4.0/24",
          columns: ["Path", "Costs added", "Total"],
          rows: [
            ["R1 → R2 → R4", "R2-R4 link down", "none"],
            ["R1 → R3 → R4", "1 + 64 + 1", "66"],
          ],
          hl: [0, 1],
        },
        { node: "r1", title: "R1 routing table (OSPF)", columns: ["Route", "[AD/cost]", "Next hop"], rows: [["O 10.4.4.0/24", "[110/66]", "10.0.13.2 Gi0/1"]], hl: [0] },
      ],
    },
  ],
};

export default scene;
