import type { TopologyScene } from "../types.ts";

// Colours: blue = user data, green = replies, purple = control plane (HSRP, OSPF Hellos).
// Link states: dim = not built yet, blocked = RSTP alternate port, down = failed.

const uplinksToDs1 = ["l-f1-d1", "l-f2-d1", "l-f3-d1", "l-srv-d1"];
const uplinksToDs2 = ["l-f1-d2", "l-f2-d2", "l-f3-d2", "l-srv-d2"];
const edgeLinks = ["l-fw-d1", "l-fw-d2", "l-inet"];
const distLinks = [...uplinksToDs1, ...uplinksToDs2, "l-po1"];

const set = (ids: string[], state: "normal" | "active" | "blocked" | "down" | "dim") => ids.map((id) => ({ id, state }));

const roles = (root: string, active: string, hl?: number[]) => ({
  node: "ds1",
  title: "Roles per VLAN",
  columns: ["VLANs", "STP root", "HSRP Active"],
  rows: [
    ["10, 11 (floor 1)", root, active],
    ["20, 21 (floor 2)", root, active],
    ["30, 31 (floor 3)", root, active],
    ["50, 60, 99", root, active],
  ],
  hl,
});

const scene: TopologyScene = {
  kind: "topology",
  id: "network-design",
  title: { en: "Designing a 300-user campus, then failing DS1", hi: "300-user campus design karna, phir DS1 ko fail karna" },
  height: 560,
  nodes: [
    { id: "inet", kind: "internet", x: 400, y: 50, label: "Internet" },
    { id: "fw1", kind: "firewall", x: 400, y: 152, label: "FW1", sub: "PAT, OSPF" },
    { id: "ds1", kind: "l3switch", x: 220, y: 264, label: "DS1", sub: "10.20.x.2" },
    { id: "ds2", kind: "l3switch", x: 580, y: 264, label: "DS2", sub: "10.20.x.3" },
    { id: "f1", kind: "switch", x: 110, y: 378, label: "F1-ACC", sub: "VLAN 10, 11" },
    { id: "f2", kind: "switch", x: 290, y: 378, label: "F2-ACC", sub: "VLAN 20, 21" },
    { id: "f3", kind: "switch", x: 470, y: 378, label: "F3-ACC", sub: "VLAN 30, 31" },
    { id: "srv", kind: "switch", x: 670, y: 378, label: "SRV-SW", sub: "VLAN 60" },
    { id: "pc", kind: "pc", x: 290, y: 492, label: "PC-F2", sub: "10.20.20.50/24" },
    { id: "fs1", kind: "server", x: 670, y: 492, label: "FS1", sub: "10.20.60.10/26" },
  ],
  links: [
    { id: "l-inet", a: "fw1", b: "inet", label: "ISP" },
    { id: "l-fw-d1", a: "fw1", b: "ds1", style: "fiber" },
    { id: "l-fw-d2", a: "fw1", b: "ds2", style: "fiber" },
    { id: "l-po1", a: "ds1", b: "ds2", style: "bundle", label: "Po1 2x10G" },
    { id: "l-f1-d1", a: "f1", b: "ds1", style: "fiber" },
    { id: "l-f1-d2", a: "f1", b: "ds2", style: "fiber" },
    { id: "l-f2-d1", a: "f2", b: "ds1", style: "fiber" },
    { id: "l-f2-d2", a: "f2", b: "ds2", style: "fiber" },
    { id: "l-f3-d1", a: "f3", b: "ds1", style: "fiber" },
    { id: "l-f3-d2", a: "f3", b: "ds2", style: "fiber" },
    { id: "l-srv-d1", a: "srv", b: "ds1", style: "fiber" },
    { id: "l-srv-d2", a: "srv", b: "ds2", style: "fiber" },
    { id: "l-pc", a: "pc", b: "f2" },
    { id: "l-fs1", a: "fs1", b: "srv" },
  ],
  steps: [
    {
      title: { en: "Requirements before boxes", hi: "Boxes se pehle requirements" },
      text: {
        en: "Three floors of about 100 users each, a server room, phones and Wi-Fi, 30% growth, and no single switch or uplink failure may stop a floor. Nothing is connected yet: the grey links are what the design still has to justify.",
        hi: "Teen floors, har ek par lagbhag 100 users, ek server room, phones aur Wi-Fi, 30% growth, aur kisi ek switch ya uplink ke fail hone se koi floor nahi rukna chahiye. Abhi kuch connected nahi hai: grey links woh hain jinhe design ko abhi justify karna hai.",
      },
      focus: ["f1", "f2", "f3", "srv"],
      links: set([...distLinks, ...edgeLinks], "dim"),
      tables: [
        {
          node: "f2",
          title: "Requirements",
          columns: ["Item", "Value"],
          rows: [
            ["Users", "300 (100 per floor)"],
            ["Growth", "+30% in 5 years"],
            ["Uptime", "no single failure stops a floor"],
            ["Budget", "2 dist switches, 1 FW, 1 ISP"],
          ],
        },
      ],
    },
    {
      title: { en: "Access layer: one stack and VLANs per floor", hi: "Access layer: har floor ka ek stack aur VLANs" },
      text: {
        en: "Each floor gets one access stack with its own user and voice VLANs: 10/11, 20/21, 30/31. The server room is its own block with VLAN 60. A loop on floor 2 can now only hurt VLANs 20 and 21.",
        hi: "Har floor ko ek access stack milta hai, apne user aur voice VLANs ke saath: 10/11, 20/21, 30/31. Server room VLAN 60 ke saath apna alag block hai. Ab floor 2 ka loop sirf VLANs 20 aur 21 ko nuksaan pahuncha sakta hai.",
      },
      focus: ["f1", "f2", "f3", "srv"],
      tables: [
        { node: "f2", title: "Requirements", columns: ["Item", "Value"], rows: [] },
        {
          node: "ds1",
          title: "VLAN and IP plan",
          columns: ["VLAN", "Use", "Subnet"],
          rows: [
            ["10 / 20 / 30", "users F1-F3", "10.20.10/20/30.0/24"],
            ["11 / 21 / 31", "voice F1-F3", "10.20.11/21/31.0/24"],
            ["50", "wireless", "10.20.50.0/23"],
            ["60", "servers", "10.20.60.0/26"],
            ["99", "management", "10.20.99.0/26"],
          ],
          hl: [0, 1, 2, 3, 4],
        },
      ],
    },
    {
      title: { en: "Distribution pair with dual uplinks", hi: "Dual uplinks ke saath distribution pair" },
      text: {
        en: "DS1 and DS2 form a collapsed core. Every access stack gets one 10G uplink to each, from different stack members, and DS1 and DS2 are joined by Po1, two 10G links bundled with LACP and trunking every VLAN.",
        hi: "DS1 aur DS2 collapsed core banate hain. Har access stack ko dono mein se har ek tak ek 10G uplink milta hai, alag stack members se, aur DS1 aur DS2 Po1 se jude hain, jo LACP se bundle kiye gaye do 10G links hain aur har VLAN trunk karte hain.",
      },
      focus: ["ds1", "ds2"],
      links: set(distLinks, "normal"),
    },
    {
      title: { en: "STP root and HSRP Active on the same switch", hi: "STP root aur HSRP Active ek hi switch par" },
      text: {
        en: "DS1 is `root primary` and HSRP Active (priority 110, preempt); DS2 is `root secondary` and Standby. HSRP Hellos cross Po1 every 3 s. Each access stack's uplink to DS2 becomes an RSTP alternate port and discards, so frames reach the gateway on DS1 in one hop.",
        hi: "DS1 `root primary` aur HSRP Active hai (priority 110, preempt); DS2 `root secondary` aur Standby. HSRP Hellos har 3 s mein Po1 cross karte hain. Har access stack ka DS2 wala uplink RSTP alternate port ban kar discard karta hai, isliye frames ek hop mein DS1 par gateway tak pahunchte hain.",
      },
      packets: [
        { path: ["ds1", "ds2"], label: "HSRP Hello 110", tone: "purple" },
        { path: ["ds2", "ds1"], label: "HSRP Hello 100", tone: "purple" },
      ],
      links: set(uplinksToDs2, "blocked"),
      badges: [
        { node: "ds1", text: "root + Active", tone: "green" },
        { node: "ds2", text: "Standby", tone: "teal" },
      ],
      tables: [
        { node: "ds1", title: "VLAN and IP plan", columns: ["VLAN", "Use", "Subnet"], rows: [] },
        roles("DS1", "DS1", [0, 1, 2, 3]),
      ],
    },
    {
      title: { en: "Internet edge: FW1 with two routed links", hi: "Internet edge: do routed links ke saath FW1" },
      text: {
        en: "FW1 connects to DS1 over 10.20.255.0/30 and to DS2 over 10.20.255.4/30, and runs OSPF with both. FW1 advertises the default route and does PAT towards the ISP. FW1 and the ISP link are single points of failure, recorded as an accepted risk.",
        hi: "FW1 DS1 se 10.20.255.0/30 par aur DS2 se 10.20.255.4/30 par juda hai, aur dono ke saath OSPF chalata hai. FW1 default route advertise karta hai aur ISP ki taraf PAT karta hai. FW1 aur ISP link single points of failure hain, accepted risk ki tarah record kiye gaye.",
      },
      links: set(edgeLinks, "normal"),
      packets: [
        { path: ["fw1", "ds1"], label: "OSPF Hello", tone: "purple" },
        { path: ["fw1", "ds2"], label: "OSPF Hello", tone: "purple" },
      ],
      badges: [{ node: "fw1", text: "accepted risk", tone: "orange" }],
    },
    {
      title: { en: "Normal day: everything goes through DS1", hi: "Normal din: sab kuch DS1 se jaata hai" },
      text: {
        en: "PC-F2 (gateway 10.20.20.1) sends to FS1 and to the internet. F2-ACC forwards up its root port to DS1, the HSRP Active gateway, which routes to VLAN 60 through SRV-SW and to the internet through FW1. The DS2 uplinks stay idle.",
        hi: "PC-F2 (gateway 10.20.20.1) FS1 aur internet dono ko bhejta hai. F2-ACC apne root port se DS1 ko forward karta hai, jo HSRP Active gateway hai, aur DS1 SRV-SW ke through VLAN 60 tak aur FW1 ke through internet tak route karta hai. DS2 wale uplinks idle rehte hain.",
      },
      packets: [
        { path: ["pc", "f2", "ds1", "srv", "fs1"], label: "To FS1", tone: "blue" },
        { path: ["fs1", "srv", "ds1", "f2", "pc"], label: "Reply", tone: "green", delay: 4 },
        { path: ["pc", "f2", "ds1", "fw1", "inet"], label: "To internet", tone: "blue", delay: 1 },
      ],
    },
    {
      title: { en: "DS1 loses power", hi: "DS1 ki power chali jaati hai" },
      text: {
        en: "Every DS1 link goes down. Within about a second RSTP turns each access stack's alternate uplink into its root port, and DS2 (root secondary, priority 28672) becomes STP root. OSPF on FW1 drops the DS1 path because the link is down. But DS2 is still HSRP Standby, so it ignores frames sent to the virtual MAC until its 10 s hold timer expires.",
        hi: "DS1 ke saare links down ho jaate hain. Lagbhag ek second mein RSTP har access stack ke alternate uplink ko root port bana deta hai, aur DS2 (root secondary, priority 28672) STP root ban jaata hai. Link down hai, isliye FW1 par OSPF DS1 wala path hata deta hai. Lekin DS2 abhi bhi HSRP Standby hai, isliye 10 s hold timer expire hone tak woh virtual MAC par aaye frames ignore karta hai.",
      },
      links: [...set([...uplinksToDs1, "l-po1", "l-fw-d1"], "down"), ...set(uplinksToDs2, "normal")],
      packets: [{ path: ["pc", "f2", "ds2"], label: "To FS1", tone: "blue", drop: true }],
      badges: [
        { node: "ds1", text: "failed", tone: "red" },
        { node: "ds2", text: "root, Standby", tone: "orange" },
      ],
      tables: [roles("DS2", "none (hold 10 s)", [0, 1, 2, 3])],
    },
    {
      title: { en: "DS2 takes over: root and Active", hi: "DS2 take over karta hai: root aur Active" },
      text: {
        en: "The hold timer expires and DS2 becomes HSRP Active for every VLAN, sending gratuitous ARPs for the virtual MACs so the access switches learn where the gateway now is. Root and Active are on the same switch again, so traffic reaches the gateway in one hop. The design survived with about 10 s of loss.",
        hi: "Hold timer expire hota hai aur DS2 har VLAN ke liye HSRP Active ban jaata hai, aur virtual MACs ke liye gratuitous ARPs bhejta hai, taaki access switches seekh lein ki gateway ab kahan hai. Root aur Active phir se ek hi switch par hain, isliye traffic ek hop mein gateway tak pahunchta hai. Design lagbhag 10 s ke loss ke saath survive kar gaya.",
      },
      packets: [
        { path: ["pc", "f2", "ds2", "srv", "fs1"], label: "To FS1", tone: "blue" },
        { path: ["fs1", "srv", "ds2", "f2", "pc"], label: "Reply", tone: "green", delay: 4 },
        { path: ["pc", "f2", "ds2", "fw1", "inet"], label: "To internet", tone: "blue", delay: 1 },
      ],
      badges: [{ node: "ds2", text: "root + Active", tone: "green" }],
      tables: [roles("DS2", "DS2", [0, 1, 2, 3])],
    },
    {
      title: { en: "Validate and document the result", hi: "Result validate aur document karo" },
      text: {
        en: "This was one row of the failover test plan. Each test runs with a continuous ping from every floor, and the measured loss goes into the design document next to the accepted risks. When DS1 returns, it is STP root again at once, but waits out its 60 s preempt delay before taking HSRP Active back.",
        hi: "Yeh failover test plan ki ek row thi. Har test har floor se continuous ping ke saath chalta hai, aur measured loss design document mein accepted risks ke saath likha jaata hai. DS1 wapas aata hai toh turant STP root ban jaata hai, lekin HSRP Active wapas lene se pehle apna 60 s preempt delay poora karta hai.",
      },
      tables: [
        { node: "ds1", title: "Roles per VLAN", columns: ["VLANs", "STP root", "HSRP Active"], rows: [] },
        {
          node: "ds2",
          title: "Failover test plan",
          columns: ["Test", "Pass if"],
          rows: [
            ["Unplug F2 uplink to DS1", "about 1 s loss"],
            ["Unplug one Po1 member", "no STP or HSRP change"],
            ["Power off DS1", "about 10 s loss, DS2 Active"],
            ["Power DS1 back on", "Active again after 60 s"],
            ["Unplug FW1 outside link", "internal ok (accepted risk)"],
          ],
          hl: [2],
        },
      ],
    },
  ],
};

export default scene;
