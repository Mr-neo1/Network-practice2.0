import type { TopologyScene } from "../types.ts";

// Colours: purple = HSRP control (Hello, Coup), orange = ARP broadcast,
// green = ARP reply, blue = user data.

const swMac = (vmacPort: string | null, hl?: number[]) => ({
  node: "sw1",
  title: "SW1 MAC table",
  columns: ["MAC", "Port"],
  rows: vmacPort
    ? [
        ["0050.56aa.0001", "Fa0/1"],
        ["0000.0c07.ac01", vmacPort],
      ]
    : [["0050.56aa.0001", "Fa0/1"]],
  hl,
});

const r2Brief = (state: string, active: string) => ({
  node: "r2",
  title: "R2 show standby brief",
  columns: ["Grp", "Pri", "State", "Active"],
  rows: [["1", "100", state, active]],
  hl: [0],
});

const scene: TopologyScene = {
  kind: "topology",
  id: "fhrp",
  title: { en: "HSRP: the gateway survives a router failure", hi: "HSRP: router fail hone par bhi gateway chalta rehta hai" },
  height: 440,
  nodes: [
    { id: "inet", kind: "internet", x: 400, y: 65, label: "Internet", sub: "server 203.0.113.10" },
    { id: "r1", kind: "router", x: 220, y: 175, label: "R1", sub: "10.1.1.1/24", sub2: "pri 110 preempt" },
    { id: "r2", kind: "router", x: 580, y: 175, label: "R2", sub: "10.1.1.2/24", sub2: "pri 100" },
    { id: "sw1", kind: "switch", x: 400, y: 275, label: "SW1" },
    { id: "pc1", kind: "pc", x: 220, y: 375, label: "PC1", sub: "10.1.1.10/24", sub2: "gw 10.1.1.254" },
    { id: "pc2", kind: "pc", x: 580, y: 375, label: "PC2", sub: "10.1.1.20/24", sub2: "gw 10.1.1.254" },
  ],
  links: [
    { id: "l-r1i", a: "r1", b: "inet", aPort: "Gi0/1" },
    { id: "l-r2i", a: "r2", b: "inet", aPort: "Gi0/1" },
    { id: "l-r1s", a: "r1", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/1" },
    { id: "l-r2s", a: "r2", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/2" },
    { id: "l-p1", a: "pc1", b: "sw1", bPort: "Fa0/1" },
    { id: "l-p2", a: "pc2", b: "sw1", bPort: "Fa0/2" },
  ],
  steps: [
    {
      title: { en: "Hellos elect the Active router", hi: "Hellos se Active router chuna jaata hai" },
      text: {
        en: "R1 and R2 both have `standby 1 ip 10.1.1.254` on Gi0/0 and send HSRP Hellos to 224.0.0.2 every 3 seconds. R1's priority 110 beats R2's 100, so R1 becomes Active and R2 Standby. Neither router has 10.1.1.254 on an interface, yet both PCs use it as their gateway.",
        hi: "R1 aur R2 dono ke Gi0/0 par `standby 1 ip 10.1.1.254` hai, aur dono har 3 second mein 224.0.0.2 par HSRP Hellos bhejte hain. R1 ki priority 110 hai, R2 ki 100, isliye R1 Active banta hai aur R2 Standby. 10.1.1.254 kisi router ke interface par nahi hai, phir bhi dono PCs ka gateway yahi hai.",
      },
      packets: [
        { path: ["r1", "sw1", "r2"], label: "Hello pri 110", tone: "purple" },
        { path: ["r2", "sw1", "r1"], label: "Hello pri 100", tone: "purple" },
      ],
      badges: [
        { node: "r1", text: "Active", tone: "green" },
        { node: "r2", text: "Standby", tone: "teal" },
      ],
      tables: [r2Brief("Standby", "10.1.1.1")],
    },
    {
      title: { en: "PC1 ARPs for the virtual IP", hi: "PC1 virtual IP ke liye ARP karta hai" },
      text: {
        en: "PC1 pings 203.0.113.10. That is outside 10.1.1.0/24, so PC1 ARPs for its gateway, 10.1.1.254. The request is a broadcast, so SW1 floods it to R1, R2 and PC2.",
        hi: "PC1 203.0.113.10 ko ping karta hai. Yeh 10.1.1.0/24 ke bahar hai, isliye PC1 apne gateway 10.1.1.254 ke liye ARP karta hai. Request broadcast hai, toh SW1 use R1, R2 aur PC2 tak flood kar deta hai.",
      },
      focus: ["pc1"],
      packets: [
        { path: ["pc1", "sw1"], label: "ARP 10.1.1.254?", tone: "orange" },
        { path: ["sw1", "r1"], label: "ARP 10.1.1.254?", tone: "orange", delay: 1 },
        { path: ["sw1", "r2"], label: "ARP 10.1.1.254?", tone: "orange", delay: 1 },
        { path: ["sw1", "pc2"], label: "ARP 10.1.1.254?", tone: "orange", delay: 1 },
      ],
      tables: [{ node: "pc1", title: "PC1 ARP cache", columns: ["IP address", "MAC address"], rows: [["(empty)", ""]] }],
    },
    {
      title: { en: "Only the Active router answers", hi: "Sirf Active router jawab deta hai" },
      text: {
        en: "R1 is Active, so only R1 replies: \"10.1.1.254 is at 0000.0c07.ac01\". R2 is Standby and stays silent. PC1 caches the virtual MAC, not R1's own MAC. SW1 maps 0000.0c07.ac01 to Gi0/1, because the Active router sends its Hellos and this reply from the virtual MAC.",
        hi: "R1 Active hai, isliye sirf R1 reply karta hai: \"10.1.1.254 is at 0000.0c07.ac01\". R2 Standby hai aur chup rehta hai. PC1 virtual MAC cache karta hai, R1 ka apna MAC nahi. SW1 0000.0c07.ac01 ko Gi0/1 par map karta hai, kyunki Active router apne Hellos aur yeh reply virtual MAC se hi bhejta hai.",
      },
      packets: [{ path: ["r1", "sw1", "pc1"], label: "ARP Reply", tone: "green" }],
      tables: [
        { node: "pc1", title: "PC1 ARP cache", columns: ["IP address", "MAC address"], rows: [["10.1.1.254", "0000.0c07.ac01"]], hl: [0] },
        swMac("Gi0/1", [1]),
      ],
    },
    {
      title: { en: "Traffic flows through R1", hi: "Traffic R1 se hokar jaata hai" },
      text: {
        en: "PC1's ping leaves with destination IP 203.0.113.10 and destination MAC 0000.0c07.ac01. SW1 sends the frame out Gi0/1, R1 routes it to the internet, and the echo reply comes back the same way.",
        hi: "PC1 ka ping destination IP 203.0.113.10 aur destination MAC 0000.0c07.ac01 ke saath nikalta hai. SW1 frame ko Gi0/1 se bhejta hai, R1 use internet ki taraf route karta hai, aur echo reply usi raaste se wapas aata hai.",
      },
      links: [
        { id: "l-r1s", state: "active" },
        { id: "l-r1i", state: "active" },
      ],
      packets: [
        { path: ["pc1", "sw1", "r1", "inet"], label: "Ping", tone: "blue" },
        { path: ["inet", "r1", "sw1", "pc1"], label: "Echo Reply", tone: "blue", delay: 3 },
      ],
    },
    {
      title: { en: "R1 fails and the pings are lost", hi: "R1 fail hota hai aur pings lost hote hain" },
      text: {
        en: "R1 loses power, so SW1's Gi0/1 goes down and SW1 deletes the MAC entries it learned there. PC1 still sends to 0000.0c07.ac01. SW1 no longer knows that MAC and floods the frame, but R2 is still Standby and does not accept frames for the virtual MAC. Pings fail while R2 waits for its 10-second hold time.",
        hi: "R1 ki power chali jaati hai, isliye SW1 ka Gi0/1 down hota hai aur SW1 us port par seekhi MAC entries delete kar deta hai. PC1 ab bhi 0000.0c07.ac01 par hi bhejta hai. SW1 ko yeh MAC ab pata nahi, toh woh frame flood karta hai, lekin R2 abhi Standby hai aur virtual MAC wale frames accept nahi karta. Jab tak R2 apna 10-second hold time pura hone ka wait karta hai, pings fail hote rehte hain.",
      },
      links: [
        { id: "l-r1s", state: "down" },
        { id: "l-r1i", state: "down" },
      ],
      packets: [
        { path: ["pc1", "sw1"], label: "Ping", tone: "blue" },
        { path: ["sw1", "r2"], label: "Ping", tone: "blue", delay: 1, drop: true },
        { path: ["sw1", "pc2"], label: "Ping", tone: "blue", delay: 1, drop: true },
      ],
      badges: [
        { node: "r1", text: "failed", tone: "red" },
        { node: "r2", text: "hold 10 s", tone: "orange" },
      ],
      tables: [swMac(null)],
    },
    {
      title: { en: "Hold time expires: R2 becomes Active", hi: "Hold time khatam: R2 Active banta hai" },
      text: {
        en: "No Hello from R1 for 10 seconds, so R2's hold timer expires. R2 logs `%HSRP-5-STATECHANGE: GigabitEthernet0/0 Grp 1 state Standby -> Active`. It now owns 10.1.1.254 and accepts frames sent to 0000.0c07.ac01.",
        hi: "10 second tak R1 ka koi Hello nahi aaya, isliye R2 ka hold timer expire ho jaata hai. R2 log karta hai `%HSRP-5-STATECHANGE: GigabitEthernet0/0 Grp 1 state Standby -> Active`. Ab 10.1.1.254 R2 ka hai, aur woh 0000.0c07.ac01 par aaye frames accept karta hai.",
      },
      focus: ["r2"],
      badges: [{ node: "r2", text: "Active", tone: "green" }],
      tables: [r2Brief("Active", "local")],
    },
    {
      title: { en: "Gratuitous ARP moves the MAC on SW1", hi: "Gratuitous ARP SW1 par MAC move karta hai" },
      text: {
        en: "R2 broadcasts a gratuitous ARP, \"10.1.1.254 is at 0000.0c07.ac01\", sent from the virtual MAC. SW1 learns that MAC on Gi0/2. The PCs receive it too, but their ARP entry already says exactly this, so nothing changes for them.",
        hi: "R2 ek gratuitous ARP broadcast karta hai, \"10.1.1.254 is at 0000.0c07.ac01\", jo virtual MAC se hi bheja jaata hai. SW1 yeh MAC ab Gi0/2 par seekh leta hai. PCs ko bhi yeh milta hai, lekin unki ARP entry mein pehle se yahi likha hai, isliye unke liye kuch nahi badalta.",
      },
      packets: [
        { path: ["r2", "sw1"], label: "Gratuitous ARP", tone: "orange" },
        { path: ["sw1", "pc1"], label: "Gratuitous ARP", tone: "orange", delay: 1 },
        { path: ["sw1", "pc2"], label: "Gratuitous ARP", tone: "orange", delay: 1 },
      ],
      tables: [swMac("Gi0/2", [1])],
    },
    {
      title: { en: "PC1 keeps working through R2", hi: "PC1 R2 ke through kaam karta rehta hai" },
      text: {
        en: "PC1 sends its next ping exactly as before: gateway 10.1.1.254, destination MAC 0000.0c07.ac01. SW1 now forwards it out Gi0/2 and R2 routes it to the internet. Nothing was changed on PC1 or PC2.",
        hi: "PC1 agla ping bilkul pehle jaisa bhejta hai: gateway 10.1.1.254, destination MAC 0000.0c07.ac01. SW1 ab use Gi0/2 se forward karta hai aur R2 use internet ki taraf route karta hai. PC1 ya PC2 par kuch bhi change nahi kiya gaya.",
      },
      links: [
        { id: "l-r2s", state: "active" },
        { id: "l-r2i", state: "active" },
      ],
      packets: [
        { path: ["pc1", "sw1", "r2", "inet"], label: "Ping", tone: "blue" },
        { path: ["inet", "r2", "sw1", "pc1"], label: "Echo Reply", tone: "blue", delay: 3 },
      ],
      badges: [{ node: "pc1", text: "no change", tone: "green" }],
    },
    {
      title: { en: "R1 returns and preempts", hi: "R1 wapas aata hai aur preempt karta hai" },
      text: {
        en: "R1 boots and hears R2's Hellos with priority 100. R1 has priority 110 and `standby 1 preempt`, so it sends a Coup message and takes the Active role back; R2 returns to Standby. R1's gratuitous ARP moves the virtual MAC back to Gi0/1. Without preempt on R1, R2 would have stayed Active.",
        hi: "R1 boot hota hai aur R2 ke priority 100 wale Hellos sunta hai. R1 ki priority 110 hai aur us par `standby 1 preempt` hai, isliye woh Coup message bhej kar Active role wapas le leta hai; R2 phir Standby ban jaata hai. R1 ka gratuitous ARP virtual MAC ko wapas Gi0/1 par le aata hai. R1 par preempt na hota, toh R2 hi Active rehta.",
      },
      links: [
        { id: "l-r1s", state: "normal" },
        { id: "l-r1i", state: "normal" },
        { id: "l-r2s", state: "normal" },
        { id: "l-r2i", state: "normal" },
      ],
      packets: [
        { path: ["r2", "sw1", "r1"], label: "Hello pri 100", tone: "purple" },
        { path: ["r1", "sw1", "r2"], label: "Coup pri 110", tone: "purple", delay: 2 },
        { path: ["r1", "sw1"], label: "Gratuitous ARP", tone: "orange", delay: 4 },
        { path: ["sw1", "pc1"], label: "Gratuitous ARP", tone: "orange", delay: 5 },
        { path: ["sw1", "pc2"], label: "Gratuitous ARP", tone: "orange", delay: 5 },
      ],
      badges: [
        { node: "r1", text: "Active", tone: "green" },
        { node: "r2", text: "Standby", tone: "teal" },
        { node: "pc1", text: "" },
      ],
      tables: [r2Brief("Standby", "10.1.1.1"), swMac("Gi0/1", [1])],
    },
  ],
};

export default scene;
