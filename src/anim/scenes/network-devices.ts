import type { TopologyScene } from "../types.ts";

// Colours: blue = user data, green = reply / allowed, purple = control traffic (PoE, CAPWAP),
// orange = wireless join, red = denied.

const scene: TopologyScene = {
  kind: "topology",
  id: "network-devices",
  title: { en: "A small office: what each device decides", hi: "Ek chhota office: har device kya decide karta hai" },
  height: 500,
  nodes: [
    { id: "pc1", kind: "pc", x: 90, y: 70, label: "PC1", sub: "10.1.10.11" },
    { id: "phone", kind: "ipphone", x: 90, y: 190, label: "Phone1", sub: "10.1.20.21" },
    { id: "ap", kind: "ap", x: 90, y: 310, label: "AP1", sub: "lightweight AP" },
    { id: "laptop", kind: "laptop", x: 90, y: 430, label: "Laptop", sub: "10.1.10.12" },
    { id: "sw1", kind: "switch", x: 250, y: 250, label: "SW1", sub: "L2 PoE switch" },
    { id: "l3sw", kind: "l3switch", x: 410, y: 250, label: "L3-SW1", sub: "Layer 3 switch" },
    { id: "wlc", kind: "wlc", x: 360, y: 420, label: "WLC1", sub: "10.1.30.20" },
    { id: "srv", kind: "server", x: 500, y: 420, label: "SRV1", sub: "10.1.30.10" },
    { id: "fw1", kind: "firewall", x: 560, y: 250, label: "FW1", sub: "NGFW + IPS", sub2: "out 203.0.113.2" },
    { id: "r1", kind: "router", x: 700, y: 250, label: "R1", sub: "edge router" },
    { id: "internet", kind: "internet", x: 700, y: 90, label: "Internet" },
  ],
  links: [
    { id: "l-pc1", a: "pc1", b: "sw1", bPort: "Gi1/0/1" },
    { id: "l-phone", a: "phone", b: "sw1", bPort: "Gi1/0/2" },
    { id: "l-ap", a: "ap", b: "sw1", bPort: "Gi1/0/3" },
    { id: "l-laptop", a: "laptop", b: "ap", style: "wireless" },
    { id: "l-up", a: "sw1", b: "l3sw", aPort: "Gi1/0/24" },
    { id: "l-wlc", a: "l3sw", b: "wlc" },
    { id: "l-srv", a: "l3sw", b: "srv" },
    { id: "l-in", a: "l3sw", b: "fw1", label: "inside" },
    { id: "l-out", a: "fw1", b: "r1", label: "outside" },
    { id: "l-isp", a: "r1", b: "internet", style: "fiber" },
  ],
  steps: [
    {
      title: { en: "SW1 powers the phone and the AP", hi: "SW1 phone aur AP ko power deta hai" },
      text: {
        en: "SW1 finds a PoE device on Gi1/0/2 and Gi1/0/3 and sends power down the same cables as data: 7 W reserved for Phone1, 30 W for AP1, out of a 370 W budget. PC1 has its own power supply and no PoE signature, so it gets none.",
        hi: "SW1 ko Gi1/0/2 aur Gi1/0/3 par PoE device milta hai, toh woh data wali cable se hi power bhejta hai: Phone1 ke liye 7 W aur AP1 ke liye 30 W reserve, total 370 W budget mein se. PC1 ki apni power supply hai aur usme PoE signature nahi hai, isliye use power nahi milti.",
      },
      focus: ["sw1", "phone", "ap"],
      badges: [
        { node: "phone", text: "PoE 7 W", tone: "purple" },
        { node: "ap", text: "PoE+ 30 W", tone: "purple" },
        { node: "pc1", text: "no PoE", tone: "gray" },
      ],
      tables: [
        {
          node: "sw1",
          title: "SW1 PoE (budget 370 W)",
          columns: ["Port", "Device", "Power"],
          rows: [
            ["Gi1/0/1", "PC1", "0 W"],
            ["Gi1/0/2", "Phone1", "7 W"],
            ["Gi1/0/3", "AP1", "30 W"],
            ["Total", "", "37 W used"],
          ],
          hl: [1, 2, 3],
        },
      ],
    },
    {
      title: { en: "AP1 joins its controller, WLC1", hi: "AP1 apne controller WLC1 se judta hai" },
      text: {
        en: "AP1 is a lightweight AP: it gets its settings from a controller. It builds a CAPWAP tunnel to WLC1, and WLC1 sends back the SSID, security settings, channel and power. Change a setting on WLC1 and every AP it manages picks it up.",
        hi: "AP1 ek lightweight AP hai: iski settings controller se aati hain. Woh WLC1 tak CAPWAP tunnel banata hai, aur WLC1 wapas SSID, security settings, channel aur power bhejta hai. WLC1 par ek setting badlo, toh uske saare APs ko mil jaati hai.",
      },
      focus: ["ap", "wlc"],
      packets: [
        { path: ["ap", "sw1", "l3sw", "wlc"], label: "CAPWAP join", tone: "purple" },
        { path: ["wlc", "l3sw", "sw1", "ap"], label: "SSID + config", tone: "purple", delay: 3 },
      ],
      badges: [
        { node: "phone", text: "" },
        { node: "pc1", text: "" },
        { node: "ap", text: "SSID OFFICE", tone: "purple" },
      ],
      tables: [{ node: "sw1", title: "SW1 PoE (budget 370 W)", columns: ["Port", "Device", "Power"], rows: [] }],
    },
    {
      title: { en: "The laptop joins the Wi-Fi", hi: "Laptop Wi-Fi se judta hai" },
      text: {
        en: "The laptop connects to SSID OFFICE. From now on AP1 is its link to the wired network: it takes the laptop's Wi-Fi frames off the air and puts them onto the cable, and does the reverse for replies.",
        hi: "Laptop SSID OFFICE se connect hota hai. Ab se AP1 hi uska wired network tak ka link hai: laptop ke Wi-Fi frames hawa se lekar cable par daalta hai, aur replies ke liye ulta karta hai.",
      },
      focus: ["laptop", "ap"],
      packets: [
        { path: ["laptop", "ap"], label: "Join OFFICE", tone: "orange" },
        { path: ["ap", "laptop"], label: "Joined", tone: "green", delay: 1 },
      ],
      badges: [{ node: "ap", text: "" }],
    },
    {
      title: { en: "SW1 forwards by MAC address", hi: "SW1 MAC address dekh kar forward karta hai" },
      text: {
        en: "PC1 needs SRV1 at 10.1.30.10, a different subnet, so it addresses the frame to the MAC of its default gateway, L3-SW1. SW1 notes PC1's source MAC on Gi1/0/1, reads only the destination MAC, finds it on Gi1/0/24 in its MAC table, and sends the frame out of that one port.",
        hi: "PC1 ko SRV1 (10.1.30.10) chahiye, jo doosre subnet mein hai, isliye woh frame apne default gateway L3-SW1 ke MAC par bhejta hai. SW1 PC1 ka source MAC Gi1/0/1 par note karta hai, sirf destination MAC padhta hai, MAC table mein use Gi1/0/24 par paata hai, aur frame sirf usi ek port se bhejta hai.",
      },
      focus: ["sw1"],
      packets: [{ path: ["pc1", "sw1", "l3sw"], label: "To SRV1", tone: "blue" }],
      tables: [
        {
          node: "sw1",
          title: "SW1 MAC table",
          columns: ["MAC", "Port"],
          rows: [
            ["0050.56aa.0011 (PC1)", "Gi1/0/1"],
            ["0011.2233.5501 (L3-SW1)", "Gi1/0/24"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "L3-SW1 routes by IP address", hi: "L3-SW1 IP address dekh kar route karta hai" },
      text: {
        en: "L3-SW1 reads the destination IP, 10.1.30.10, matches 10.1.30.0/24 in its routing table, and sends the packet to SRV1. The reply returns the same way. Traffic between the office's own subnets never has to go near R1.",
        hi: "L3-SW1 destination IP 10.1.30.10 padhta hai, routing table mein 10.1.30.0/24 se match karta hai, aur packet SRV1 ko bhej deta hai. Reply usi raaste wapas aata hai. Office ke apne subnets ke beech ka traffic R1 tak jaata hi nahi.",
      },
      focus: ["l3sw", "srv"],
      packets: [
        { path: ["l3sw", "srv"], label: "To SRV1", tone: "blue" },
        { path: ["srv", "l3sw", "sw1", "pc1"], label: "Reply", tone: "green", delay: 1 },
      ],
      tables: [
        {
          node: "l3sw",
          title: "L3-SW1 routing table",
          columns: ["Network", "Send to"],
          rows: [
            ["10.1.10.0/24", "users (local)"],
            ["10.1.20.0/24", "phones (local)"],
            ["10.1.30.0/24", "servers (local)"],
            ["0.0.0.0/0", "FW1 (everything else)"],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "Outbound: FW1 checks and remembers", hi: "Bahar jaate waqt: FW1 check karta hai aur yaad rakhta hai" },
      text: {
        en: "PC1 opens a website at 198.51.100.10. L3-SW1 has no specific route, so it uses its default route to FW1. FW1's policy allows staff to browse, its IPS finds nothing bad, and it records the connection, then sends the packet out from its public address 203.0.113.2 (NAT). R1 routes it to the ISP.",
        hi: "PC1 198.51.100.10 wali website kholta hai. L3-SW1 ke paas iska specific route nahi hai, isliye woh default route se FW1 ko bhejta hai. FW1 ki policy staff ko browsing allow karti hai, IPS ko kuch galat nahi milta, aur FW1 connection record kar leta hai, phir packet apne public address 203.0.113.2 se bahar bhejta hai (NAT). R1 use ISP ki taraf route karta hai.",
      },
      focus: ["fw1", "r1"],
      packets: [{ path: ["pc1", "sw1", "l3sw", "fw1", "r1", "internet"], label: "HTTPS request", tone: "blue" }],
      badges: [{ node: "fw1", text: "allowed, tracked", tone: "green" }],
      tables: [
        { node: "sw1", title: "SW1 MAC table", columns: ["MAC", "Port"], rows: [] },
        { node: "l3sw", title: "L3-SW1 routing table", columns: ["Network", "Send to"], rows: [] },
        {
          node: "fw1",
          title: "FW1 connection table",
          columns: ["Inside", "Outside", "App"],
          rows: [["10.1.10.11:51000", "198.51.100.10:443", "HTTPS"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "The reply matches, so it is allowed in", hi: "Reply match hota hai, isliye andar aane diya jaata hai" },
      text: {
        en: "The web server's reply comes back to 203.0.113.2. FW1 finds the matching entry in its connection table, swaps the address back to 10.1.10.11 and lets the reply through to PC1. This is what stateful means: the firewall remembers connections started inside and allows only their return traffic.",
        hi: "Web server ka reply 203.0.113.2 par wapas aata hai. FW1 ko connection table mein matching entry milti hai, woh address wapas 10.1.10.11 karta hai aur reply PC1 tak jaane deta hai. Stateful ka matlab yahi hai: firewall andar se shuru hue connections yaad rakhta hai aur sirf unka return traffic allow karta hai.",
      },
      packets: [{ path: ["internet", "r1", "fw1", "l3sw", "sw1", "pc1"], label: "HTTPS reply", tone: "green" }],
      badges: [{ node: "fw1", text: "matches entry", tone: "green" }],
    },
    {
      title: { en: "Unsolicited traffic is dropped", hi: "Bina maange aaya traffic drop hota hai" },
      text: {
        en: "A host on the internet tries to open a remote desktop session (TCP 3389) to the office's public address, 203.0.113.2. R1 forwards it, because a router's job is to route. FW1 finds no matching connection and no rule allowing it, so it drops the packet. Nothing inside ever sees it.",
        hi: "Internet ka ek host office ke public address 203.0.113.2 par remote desktop session (TCP 3389) kholne ki koshish karta hai. R1 use forward kar deta hai, kyunki router ka kaam route karna hai. FW1 ko na koi matching connection milta hai, na koi rule jo ise allow kare, isliye woh packet drop kar deta hai. Andar kisi ko yeh packet dikhta hi nahi.",
      },
      focus: ["fw1"],
      packets: [{ path: ["internet", "r1", "fw1"], label: "RDP 3389", tone: "red", drop: true }],
      badges: [{ node: "fw1", text: "no match: drop", tone: "red" }],
    },
  ],
};

export default scene;
