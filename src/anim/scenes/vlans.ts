import type { TopologyScene, TopoTable } from "../types.ts";

// Colours: orange = broadcast, blue = PC data, teal = voice, purple = CDP (control), red = failure.
// Badges show each device's VLAN: gray = VLAN 1, blue = VLAN 10, pink = VLAN 20, teal = voice VLAN 100.
const vlanTable = (rows: string[][], hl?: number[]): TopoTable => ({
  node: "sw1",
  title: "SW1 VLANs",
  columns: ["VLAN", "Name", "Access ports"],
  rows,
  hl,
});

const scene: TopologyScene = {
  kind: "topology",
  id: "vlans",
  title: { en: "One switch, three broadcast domains: VLANs and a voice VLAN", hi: "Ek switch, teen broadcast domains: VLANs aur voice VLAN" },
  height: 520,
  nodes: [
    { id: "pc1", kind: "pc", x: 110, y: 80, label: "PC1", sub: "10.1.10.11" },
    { id: "pc2", kind: "pc", x: 110, y: 280, label: "PC2", sub: "10.1.10.12" },
    { id: "sw1", kind: "switch", x: 400, y: 180, label: "SW1" },
    { id: "pc3", kind: "pc", x: 690, y: 80, label: "PC3", sub: "10.1.20.13" },
    { id: "pc4", kind: "pc", x: 690, y: 280, label: "PC4", sub: "10.1.20.14" },
    { id: "phone", kind: "ipphone", x: 400, y: 320, label: "IP Phone", sub: "10.1.100.20" },
    { id: "pc5", kind: "pc", x: 400, y: 445, label: "PC5", sub: "10.1.10.15" },
  ],
  links: [
    { id: "l-1", a: "pc1", b: "sw1", bPort: "Fa0/1" },
    { id: "l-2", a: "pc2", b: "sw1", bPort: "Fa0/2" },
    { id: "l-3", a: "sw1", b: "pc3", aPort: "Fa0/3" },
    { id: "l-4", a: "sw1", b: "pc4", aPort: "Fa0/4" },
    { id: "l-5", a: "sw1", b: "phone", aPort: "Fa0/5" },
    { id: "l-6", a: "phone", b: "pc5" },
  ],
  steps: [
    {
      title: { en: "Out of the box: every port in VLAN 1", hi: "Naya switch: har port VLAN 1 mein" },
      text: {
        en: "SW1 is new, so Fa0/1 to Fa0/5 are all access ports in VLAN 1. Sales (PC1, PC2, PC5) and HR (PC3, PC4) are planned for different subnets, but the switch never looks at IP addresses: all five ports are one broadcast domain.",
        hi: "SW1 naya hai, isliye Fa0/1 se Fa0/5 tak saare ports VLAN 1 ke access ports hain. Sales (PC1, PC2, PC5) aur HR (PC3, PC4) ke subnets alag plan kiye gaye hain, lekin switch IP address kabhi dekhta hi nahi: paanchon ports ek hi broadcast domain hain.",
      },
      focus: ["sw1"],
      badges: [
        { node: "pc1", text: "VLAN 1", tone: "gray" },
        { node: "pc2", text: "VLAN 1", tone: "gray" },
        { node: "pc3", text: "VLAN 1", tone: "gray" },
        { node: "pc4", text: "VLAN 1", tone: "gray" },
        { node: "phone", text: "VLAN 1", tone: "gray" },
        { node: "pc5", text: "VLAN 1", tone: "gray" },
      ],
      tables: [vlanTable([["1", "default", "Fa0/1-24, Gi0/1-2"]])],
    },
    {
      title: { en: "A Sales broadcast reaches HR", hi: "Sales ka broadcast HR tak pahunchta hai" },
      text: {
        en: "PC1 sends an ARP request to FFFF.FFFF.FFFF. SW1 floods it out of every other VLAN 1 port: Fa0/2, Fa0/3, Fa0/4 and Fa0/5, where the phone passes it on to PC5. PC3 and PC4 in HR must receive and read a frame that was never meant for them.",
        hi: "PC1 FFFF.FFFF.FFFF par ARP request bhejta hai. SW1 use VLAN 1 ke baaki har port se flood karta hai: Fa0/2, Fa0/3, Fa0/4 aur Fa0/5, jahan phone use aage PC5 ko de deta hai. HR ke PC3 aur PC4 ko bhi woh frame receive karke padhna padta hai jo unke liye tha hi nahi.",
      },
      packets: [
        { path: ["pc1", "sw1"], label: "ARP broadcast", tone: "orange" },
        { path: ["sw1", "pc2"], label: "ARP broadcast", tone: "orange", delay: 1 },
        { path: ["sw1", "pc3"], label: "ARP broadcast", tone: "orange", delay: 1 },
        { path: ["sw1", "pc4"], label: "ARP broadcast", tone: "orange", delay: 1 },
        { path: ["sw1", "phone", "pc5"], label: "ARP broadcast", tone: "orange", delay: 1 },
      ],
    },
    {
      title: { en: "Create VLAN 10 and 20, assign ports", hi: "VLAN 10 aur 20 banao, ports assign karo" },
      text: {
        en: "On SW1: vlan 10 with name SALES, and vlan 20 with name HR. Fa0/1 and Fa0/2 get switchport access vlan 10; Fa0/3 and Fa0/4 get switchport access vlan 20. Nothing changes on the PCs; only the ports' VLAN membership changed.",
        hi: "SW1 par: vlan 10 naam SALES, aur vlan 20 naam HR. Fa0/1 aur Fa0/2 par switchport access vlan 10; Fa0/3 aur Fa0/4 par switchport access vlan 20. PCs par kuch nahi badla; sirf ports ki VLAN membership badli hai.",
      },
      focus: ["sw1"],
      badges: [
        { node: "pc1", text: "VLAN 10", tone: "blue" },
        { node: "pc2", text: "VLAN 10", tone: "blue" },
        { node: "pc3", text: "VLAN 20", tone: "pink" },
        { node: "pc4", text: "VLAN 20", tone: "pink" },
      ],
      tables: [
        vlanTable(
          [
            ["1", "default", "Fa0/5-24, Gi0/1-2"],
            ["10", "SALES", "Fa0/1, Fa0/2"],
            ["20", "HR", "Fa0/3, Fa0/4"],
          ],
          [1, 2],
        ),
      ],
    },
    {
      title: { en: "The same broadcast stays in VLAN 10", hi: "Wahi broadcast ab VLAN 10 mein rehta hai" },
      text: {
        en: "PC1 sends the same ARP broadcast. It arrived on a VLAN 10 port, so SW1 floods it only to the other VLAN 10 port, Fa0/2. PC3, PC4 and everything on Fa0/5 are in other VLANs and see nothing.",
        hi: "PC1 wahi ARP broadcast bhejta hai. Frame VLAN 10 ke port par aaya, isliye SW1 use sirf VLAN 10 ke doosre port Fa0/2 par flood karta hai. PC3, PC4 aur Fa0/5 wale devices doosre VLANs mein hain, unhe kuch nahi dikhta.",
      },
      focus: ["pc1", "pc2"],
      packets: [
        { path: ["pc1", "sw1"], label: "ARP broadcast", tone: "orange" },
        { path: ["sw1", "pc2"], label: "ARP broadcast", tone: "orange", delay: 1 },
      ],
    },
    {
      title: { en: "VLAN 10 cannot reach VLAN 20 on its own", hi: "VLAN 10 khud VLAN 20 tak nahi pahunch sakta" },
      text: {
        en: "PC1 pings PC3 at 10.1.20.13. That is another subnet, so PC1 ARPs for its gateway, 10.1.10.1. Only PC2 hears the request, and no router is attached to VLAN 10 yet, so nobody answers and the ping fails. Traffic between VLANs needs a router (lesson 2.3).",
        hi: "PC1, 10.1.20.13 par PC3 ko ping karta hai. Yeh doosra subnet hai, isliye PC1 apne gateway 10.1.10.1 ke liye ARP karta hai. Request sirf PC2 sunta hai, aur VLAN 10 mein abhi koi router nahi hai, toh koi jawab nahi deta aur ping fail ho jaata hai. VLANs ke beech traffic ke liye router chahiye (lesson 2.3).",
      },
      focus: ["pc1", "pc3"],
      packets: [
        { path: ["pc1", "sw1"], label: "ARP 10.1.10.1?", tone: "orange" },
        { path: ["sw1", "pc2"], label: "ARP 10.1.10.1?", tone: "orange", delay: 1 },
      ],
      badges: [
        { node: "pc1", text: "no gateway", tone: "red" },
        { node: "pc2", text: "not me", tone: "gray" },
      ],
    },
    {
      title: { en: "Fa0/5: data VLAN 10 + voice VLAN 100", hi: "Fa0/5 par data VLAN 10 aur voice VLAN 100" },
      text: {
        en: "PC5 sits behind an IP phone on Fa0/5. SW1 gets vlan 100 (name VOICE), and Fa0/5 gets switchport access vlan 10 and switchport voice vlan 100. SW1 then tells the phone its voice VLAN in a CDP message.",
        hi: "PC5 ek IP phone ke peeche Fa0/5 par hai. SW1 par vlan 100 (naam VOICE) banta hai, aur Fa0/5 par switchport access vlan 10 aur switchport voice vlan 100 lagta hai. Phir SW1 CDP message mein phone ko uska voice VLAN batata hai.",
      },
      focus: ["sw1", "phone"],
      links: [{ id: "l-5", state: "active", note: "data 10 + voice 100" }],
      packets: [{ path: ["sw1", "phone"], label: "CDP: voice 100", tone: "purple" }],
      badges: [
        { node: "pc1", text: "VLAN 10", tone: "blue" },
        { node: "pc2", text: "VLAN 10", tone: "blue" },
        { node: "phone", text: "voice 100", tone: "teal" },
        { node: "pc5", text: "VLAN 10", tone: "blue" },
      ],
      tables: [
        vlanTable(
          [
            ["1", "default", "Fa0/6-24, Gi0/1-2"],
            ["10", "SALES", "Fa0/1, Fa0/2, Fa0/5"],
            ["20", "HR", "Fa0/3, Fa0/4"],
            ["100", "VOICE", "Fa0/5 (voice)"],
          ],
          [1, 3],
        ),
      ],
    },
    {
      title: { en: "Phone frames tagged, PC frames untagged", hi: "Phone ke frames tagged, PC ke untagged" },
      text: {
        en: "The phone puts an 802.1Q tag with VLAN 100 on its voice frames, so SW1 places them in VLAN 100. PC5's frames pass through the phone untagged, and SW1 places untagged frames from Fa0/5 in the access VLAN, 10.",
        hi: "Phone apne voice frames par VLAN 100 wala 802.1Q tag lagata hai, isliye SW1 unhe VLAN 100 mein daalta hai. PC5 ke frames phone se bina tag ke guzarte hain, aur Fa0/5 se aaye untagged frames ko SW1 access VLAN 10 mein daalta hai.",
      },
      focus: ["phone", "pc5"],
      packets: [
        { path: ["phone", "sw1"], label: "Voice, tag 100", tone: "teal" },
        { path: ["pc5", "phone", "sw1"], label: "Data, untagged", tone: "blue", delay: 1 },
      ],
    },
    {
      title: { en: "PC5 shares the Sales broadcast domain", hi: "PC5 Sales ke broadcast domain mein hai" },
      text: {
        en: "PC5 sends an ARP broadcast. SW1 floods it only to Fa0/1 and Fa0/2, because PC5 is in VLAN 10 with PC1 and PC2. HR never sees it. One switch now carries three broadcast domains in use: VLAN 10, VLAN 20 and voice VLAN 100.",
        hi: "PC5 ek ARP broadcast bhejta hai. SW1 use sirf Fa0/1 aur Fa0/2 par flood karta hai, kyunki PC5, PC1 aur PC2 ke saath VLAN 10 mein hai. HR ko yeh kabhi nahi dikhta. Ek switch par ab teen broadcast domains use mein hain: VLAN 10, VLAN 20 aur voice VLAN 100.",
      },
      links: [{ id: "l-5", state: "normal" }],
      packets: [
        { path: ["pc5", "phone", "sw1"], label: "ARP broadcast", tone: "orange" },
        { path: ["sw1", "pc1"], label: "ARP broadcast", tone: "orange", delay: 2 },
        { path: ["sw1", "pc2"], label: "ARP broadcast", tone: "orange", delay: 2 },
      ],
    },
  ],
};

export default scene;
