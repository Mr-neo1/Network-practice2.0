import type { TopologyScene } from "../types.ts";

// Colours: purple = RIP update, teal = OSPF LSA, blue = user data.
const costNotes = ["l12", "l13", "l24", "l34", "l4l"].map((id) => ({ id, state: "normal" as const, note: "cost 1" }));

const scene: TopologyScene = {
  kind: "topology",
  id: "dynamic-routing",
  title: { en: "Distance vector vs link state on four routers", hi: "Chaar routers par distance vector vs link state" },
  height: 400,
  nodes: [
    { id: "r1", kind: "router", x: 170, y: 95, label: "R1" },
    { id: "r2", kind: "router", x: 470, y: 95, label: "R2" },
    { id: "r3", kind: "router", x: 170, y: 290, label: "R3" },
    { id: "r4", kind: "router", x: 470, y: 290, label: "R4" },
    { id: "lan", kind: "switch", x: 680, y: 290, label: "LAN", sub: "10.4.4.0/24" },
  ],
  links: [
    { id: "l12", a: "r1", b: "r2", aPort: "Gi0/0", bPort: "Gi0/0", label: "10.0.12.0/30" },
    { id: "l13", a: "r1", b: "r3", aPort: "Gi0/1", bPort: "Gi0/0", label: "10.0.13.0/30" },
    { id: "l24", a: "r2", b: "r4", aPort: "Gi0/1", bPort: "Gi0/0", label: "10.0.24.0/30" },
    { id: "l34", a: "r3", b: "r4", aPort: "Gi0/1", bPort: "Gi0/1", label: "10.0.34.0/30" },
    { id: "l4l", a: "r4", b: "lan", aPort: "Gi0/2" },
  ],
  steps: [
    {
      title: { en: "Only R4 knows 10.4.4.0/24", hi: "10.4.4.0/24 sirf R4 ko pata hai" },
      text: {
        en: "R4 is directly connected to the LAN 10.4.4.0/24 on Gi0/2. R1, R2 and R3 have no route to it, and with static routing you would have to type one on each. First the four routers run RIP, a distance-vector protocol.",
        hi: "R4 Gi0/2 par LAN 10.4.4.0/24 se directly connected hai. R1, R2 aur R3 ke paas iska koi route nahi hai, aur static routing mein tumhe har ek par route type karna padta. Pehle chaaron routers RIP chalate hain, jo ek distance-vector protocol hai.",
      },
      focus: ["r4", "lan"],
      tables: [{ node: "r1", title: "R1 RIP routes", columns: ["Network", "Next hop", "Hops"], rows: [["10.4.4.0/24", "(none)", "-"]] }],
    },
    {
      title: { en: "R4 tells its neighbours: 1 hop", hi: "R4 neighbours ko batata hai: 1 hop" },
      text: {
        en: "R4 sends a RIP update out of Gi0/0 and Gi0/1: \"10.4.4.0/24, 1 hop.\" R2 and R3 each install the route with R4 as the next hop and metric 1.",
        hi: "R4 Gi0/0 aur Gi0/1 se RIP update bhejta hai: \"10.4.4.0/24, 1 hop.\" R2 aur R3 dono yeh route install karte hain, next hop R4 aur metric 1.",
      },
      packets: [
        { path: ["r4", "r2"], label: "10.4.4.0 hops 1", tone: "purple" },
        { path: ["r4", "r3"], label: "10.4.4.0 hops 1", tone: "purple" },
      ],
      tables: [
        { node: "r2", title: "R2 RIP routes", columns: ["Network", "Next hop", "Hops"], rows: [["10.4.4.0/24", "10.0.24.2", "1"]], hl: [0] },
        { node: "r3", title: "R3 RIP routes", columns: ["Network", "Next hop", "Hops"], rows: [["10.4.4.0/24", "10.0.34.2", "1"]], hl: [0] },
      ],
    },
    {
      title: { en: "R2 and R3 pass the rumour on", hi: "R2 aur R3 baat aage badhate hain" },
      text: {
        en: "R2 and R3 add one hop and tell R1: \"10.4.4.0/24, 2 hops.\" R1 has never heard from R4 and simply trusts its neighbours. Both offers are 2 hops, so R1 installs both paths and shares traffic across them.",
        hi: "R2 aur R3 ek hop jod kar R1 ko batate hain: \"10.4.4.0/24, 2 hops.\" R1 ne R4 se kabhi kuch nahi suna, woh bas neighbours par bharosa karta hai. Dono offers 2 hops ke hain, isliye R1 dono paths install karta hai aur traffic dono mein baant deta hai.",
      },
      packets: [
        { path: ["r2", "r1"], label: "10.4.4.0 hops 2", tone: "purple" },
        { path: ["r3", "r1"], label: "10.4.4.0 hops 2", tone: "purple" },
      ],
      badges: [{ node: "r1", text: "2 equal paths", tone: "teal" }],
      tables: [
        {
          node: "r1",
          title: "R1 RIP routes",
          columns: ["Network", "Next hop", "Hops"],
          rows: [
            ["10.4.4.0/24", "10.0.12.2", "2"],
            ["10.4.4.0/24", "10.0.13.2", "2"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Every 30 seconds, the whole table again", hi: "Har 30 second, poori table phir se" },
      text: {
        en: "Nothing has changed, yet every router sends its full routing table to its neighbours at 224.0.0.9 every 30 seconds. RIP's metric only counts routers, and 16 hops means unreachable, so it suits only small networks.",
        hi: "Kuch nahi badla, phir bhi har router har 30 second mein apni poori routing table 224.0.0.9 par neighbours ko bhejta hai. RIP ka metric sirf routers ginta hai, aur 16 hops ka matlab unreachable, isliye yeh sirf chhote networks ke liye theek hai.",
      },
      badges: [{ node: "r1", text: "" }],
      packets: [
        { path: ["r1", "r2"], label: "Full table", tone: "purple" },
        { path: ["r2", "r1"], label: "Full table", tone: "purple" },
        { path: ["r1", "r3"], label: "Full table", tone: "purple" },
        { path: ["r3", "r1"], label: "Full table", tone: "purple" },
        { path: ["r2", "r4"], label: "Full table", tone: "purple" },
        { path: ["r4", "r2"], label: "Full table", tone: "purple" },
        { path: ["r3", "r4"], label: "Full table", tone: "purple" },
        { path: ["r4", "r3"], label: "Full table", tone: "purple" },
      ],
    },
    {
      title: { en: "Link state: R4 floods its own LSA", hi: "Link state: R4 apna LSA flood karta hai" },
      text: {
        en: "Now the same routers run OSPF. R4 describes its own links in an LSA (R2, R3 and 10.4.4.0/24, each cost 1), and R2 and R3 copy it unchanged to R1. R1 gets R4's own description, not a rumour; the second copy is a duplicate and is ignored.",
        hi: "Ab yahi routers OSPF chalate hain. R4 apne links ek LSA mein describe karta hai (R2, R3 aur 10.4.4.0/24, har ek cost 1), aur R2 aur R3 use bina badle R1 tak copy kar dete hain. R1 ko R4 ka apna description milta hai, suni-sunai baat nahi; doosri copy duplicate hai, isliye ignore hoti hai.",
      },
      reset: true,
      links: costNotes,
      packets: [
        { path: ["r4", "r2", "r1"], label: "R4 LSA", tone: "teal" },
        { path: ["r4", "r3", "r1"], label: "R4 LSA", tone: "teal" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 LSDB",
          columns: ["LSA from", "Links it lists"],
          rows: [
            ["R1", "R2, R3"],
            ["R4", "R2, R3, 10.4.4.0/24"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "Everyone floods: one shared map", hi: "Sab flood karte hain: ek shared map" },
      text: {
        en: "R1, R2 and R3 flood their own LSAs the same way, and each LSA reaches every router. When flooding ends, all four routers hold the same four LSAs: an identical map of routers, links and costs.",
        hi: "R1, R2 aur R3 bhi apne LSAs isi tarah flood karte hain, aur har LSA har router tak pahunchta hai. Flooding khatam hone par chaaron routers ke paas same chaar LSAs hote hain: routers, links aur costs ka ek jaisa map.",
      },
      packets: [
        { path: ["r1", "r2", "r4"], label: "R1 LSA", tone: "teal" },
        { path: ["r1", "r3"], label: "R1 LSA", tone: "teal" },
        { path: ["r2", "r1", "r3"], label: "R2 LSA", tone: "teal" },
        { path: ["r2", "r4"], label: "R2 LSA", tone: "teal" },
        { path: ["r3", "r4", "r2"], label: "R3 LSA", tone: "teal" },
        { path: ["r3", "r1"], label: "R3 LSA", tone: "teal" },
      ],
      badges: [
        { node: "r1", text: "same LSDB", tone: "green" },
        { node: "r2", text: "same LSDB", tone: "green" },
        { node: "r3", text: "same LSDB", tone: "green" },
        { node: "r4", text: "same LSDB", tone: "green" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 LSDB",
          columns: ["LSA from", "Links it lists"],
          rows: [
            ["R1", "R2, R3"],
            ["R2", "R1, R4"],
            ["R3", "R1, R4"],
            ["R4", "R2, R3, 10.4.4.0/24"],
          ],
          hl: [1, 2],
        },
      ],
    },
    {
      title: { en: "R1 runs SPF with itself as root", hi: "R1 khud ko root maan kar SPF chalata hai" },
      text: {
        en: "R1 runs SPF on the map. The cost to 10.4.4.0/24 is 1 + 1 + 1 = 3 through R2, and also 3 through R3. Equal cost, so both paths go into the routing table (ECMP).",
        hi: "R1 map par SPF chalata hai. 10.4.4.0/24 tak cost R2 ke through 1 + 1 + 1 = 3 hai, aur R3 ke through bhi 3. Cost barabar hai, isliye dono paths routing table mein jaate hain (ECMP).",
      },
      focus: ["r1"],
      badges: [
        { node: "r1", text: "SPF root", tone: "teal" },
        { node: "r2", text: "" },
        { node: "r3", text: "" },
        { node: "r4", text: "" },
      ],
      links: ["l12", "l13", "l24", "l34", "l4l"].map((id) => ({ id, state: "active" as const, note: "cost 1" })),
      tables: [
        {
          node: "r1",
          title: "R1 OSPF routes",
          columns: ["Network", "Next hop", "Cost"],
          rows: [
            ["10.4.4.0/24", "10.0.12.2", "3"],
            ["10.4.4.0/24", "10.0.13.2", "3"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "The R2-R4 link fails", hi: "R2-R4 link fail hota hai" },
      text: {
        en: "R2's Gi0/1 and R4's Gi0/0 go down. Both routers flood a new LSA straight away that no longer lists this link, with no 30-second wait. The LSAs go the long way round through R1 and R3, and every LSDB changes the same way.",
        hi: "R2 ka Gi0/1 aur R4 ka Gi0/0 down ho jaate hain. Dono routers turant naya LSA flood karte hain jisme yeh link nahi hai, koi 30-second wait nahi. LSAs R1 aur R3 wale lambe raaste se ghoom kar har router tak pahunchte hain, aur har LSDB ek jaisa update hota hai.",
      },
      badges: [{ node: "r1", text: "" }],
      links: [
        { id: "l12", state: "normal", note: "cost 1" },
        { id: "l13", state: "normal", note: "cost 1" },
        { id: "l24", state: "down", note: "down" },
        { id: "l34", state: "normal", note: "cost 1" },
        { id: "l4l", state: "normal", note: "cost 1" },
      ],
      packets: [
        { path: ["r2", "r1", "r3", "r4"], label: "R2 LSA (new)", tone: "teal" },
        { path: ["r4", "r3", "r1", "r2"], label: "R4 LSA (new)", tone: "teal" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 LSDB",
          columns: ["LSA from", "Links it lists"],
          rows: [
            ["R1", "R2, R3"],
            ["R2", "R1"],
            ["R3", "R1, R4"],
            ["R4", "R3, 10.4.4.0/24"],
          ],
          hl: [1, 3],
        },
      ],
    },
    {
      title: { en: "SPF again: one path left", hi: "SPF phir se: ek path bacha" },
      text: {
        en: "Every router reruns SPF on the new map. R1's path through R2 is gone, so 10.4.4.0/24 now points only to R3, still at cost 3. Traffic keeps flowing: the network has converged.",
        hi: "Har router naye map par SPF dobara chalata hai. R1 ka R2 wala path chala gaya, isliye 10.4.4.0/24 ab sirf R3 ki taraf point karta hai, cost abhi bhi 3. Traffic chalta rehta hai: network converge ho gaya.",
      },
      focus: ["r1"],
      links: [
        { id: "l13", state: "active", note: "cost 1" },
        { id: "l34", state: "active", note: "cost 1" },
        { id: "l4l", state: "active", note: "cost 1" },
      ],
      packets: [{ path: ["r1", "r3", "r4", "lan"], label: "To 10.4.4.10", tone: "blue" }],
      tables: [
        {
          node: "r1",
          title: "R1 OSPF routes",
          columns: ["Network", "Next hop", "Cost"],
          rows: [["10.4.4.0/24", "10.0.13.2", "3"]],
          hl: [0],
        },
      ],
    },
  ],
};

export default scene;
