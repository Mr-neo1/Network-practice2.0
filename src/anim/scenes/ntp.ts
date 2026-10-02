import type { TopologyScene } from "../types.ts";

// Colours: purple = NTP request / time signal, green = NTP reply, red = unsynchronised clock,
// orange = a log message timestamp.

const COLS = ["address", "ref clock", "st", "offset (ms)"];

const scene: TopologyScene = {
  kind: "topology",
  id: "ntp",
  title: { en: "NTP: from a GPS clock down to the access switches", hi: "NTP: GPS clock se access switches tak" },
  height: 300,
  nodes: [
    { id: "gps", kind: "cloud", x: 80, y: 140, label: "GPS", sub: "reference" },
    { id: "ntp1", kind: "server", x: 235, y: 140, label: "NTP-1", sub: "10.0.0.10" },
    { id: "r1", kind: "router", x: 400, y: 140, label: "R1", sub: "G0/0 10.0.0.1", sub2: "G0/1 10.1.1.1" },
    { id: "sw1", kind: "switch", x: 560, y: 140, label: "SW1", sub: "10.1.1.2" },
    { id: "sw2", kind: "switch", x: 710, y: 140, label: "SW2", sub: "10.1.1.3" },
  ],
  links: [
    { id: "l-gps", a: "gps", b: "ntp1", style: "wireless" },
    { id: "l-core", a: "ntp1", b: "r1", bPort: "G0/0" },
    { id: "l-r1", a: "r1", b: "sw1", aPort: "G0/1", bPort: "Gi0/1" },
    { id: "l-sw", a: "sw1", b: "sw2", aPort: "Gi0/2", bPort: "Gi0/1" },
  ],
  steps: [
    {
      title: { en: "GPS makes NTP-1 a stratum 1 server", hi: "GPS NTP-1 ko stratum 1 server banata hai" },
      text: {
        en: "The GPS receiver is the reference clock, stratum 0. It is wired straight into NTP-1, not reached over the network, so NTP-1 is stratum 1 and its clock reads the true time, 10:15:00.",
        hi: "GPS receiver reference clock hai, stratum 0. Yeh network ke through nahi, seedha NTP-1 se juda hai, isliye NTP-1 stratum 1 hai aur uski clock sahi time dikhati hai, 10:15:00.",
      },
      focus: ["gps", "ntp1"],
      packets: [{ path: ["gps", "ntp1"], label: "GPS time", tone: "purple" }],
      badges: [
        { node: "gps", text: "st 0", tone: "purple" },
        { node: "ntp1", text: "st 1 · 10:15:00", tone: "green" },
      ],
    },
    {
      title: { en: "Everyone else is guessing", hi: "Baaki sab andaaza laga rahe hain" },
      text: {
        en: "At that same instant R1 reads 10:11:42 (3 min 18 s slow), SW1 09:58:10 and SW2 10:22:31. None of them has a source, so all three are stratum 16. A failure logged by SW1 and SW2 would appear 24 minutes apart.",
        hi: "Usi pal R1 10:11:42 dikha raha hai (3 min 18 s peeche), SW1 09:58:10 aur SW2 10:22:31. Kisi ke paas source nahi hai, toh teeno stratum 16 hain. SW1 aur SW2 ek hi failure log karein toh entries 24 minute alag dikhengi.",
      },
      focus: ["r1", "sw1", "sw2"],
      badges: [
        { node: "r1", text: "st 16 · 10:11:42", tone: "red" },
        { node: "sw1", text: "st 16 · 09:58:10", tone: "red" },
        { node: "sw2", text: "st 16 · 10:22:31", tone: "red" },
      ],
    },
    {
      title: { en: "R1 asks NTP-1 for the time", hi: "R1 NTP-1 se time poochta hai" },
      text: {
        en: "R1 has `ntp server 10.0.0.10`, so it sends a client request to UDP port 123. NTP-1 replies with its timestamps. R1 learns that NTP-1 is stratum 1 and that its own clock is 198 seconds (3 min 18 s) behind.",
        hi: "R1 par `ntp server 10.0.0.10` hai, toh woh UDP port 123 par client request bhejta hai. NTP-1 apne timestamps ke saath reply karta hai. R1 ko pata chalta hai ki NTP-1 stratum 1 hai aur uski apni clock 198 seconds (3 min 18 s) peeche hai.",
      },
      packets: [
        { path: ["r1", "ntp1"], label: "NTP request", tone: "purple" },
        { path: ["ntp1", "r1"], label: "NTP reply", tone: "green", delay: 1 },
      ],
      tables: [{ node: "r1", title: "R1 show ntp associations", columns: COLS, rows: [["~10.0.0.10", ".GPS.", "1", "198000.0"]], hl: [0] }],
    },
    {
      title: { en: "R1 syncs and becomes stratum 2", hi: "R1 sync hota hai aur stratum 2 banta hai" },
      text: {
        en: "After a few more polls, which can take several minutes, R1 trusts NTP-1: it marks it `*` (sys.peer) and steps its clock forward the 198 seconds. R1's stratum is NTP-1's plus one, so 2. The offset left is under a millisecond.",
        hi: "Kuch aur polls ke baad, jisme kai minute lag sakte hain, R1 NTP-1 par bharosa karta hai: use `*` (sys.peer) mark karta hai aur apni clock ek jhatke mein 198 seconds aage kar deta hai. R1 ka stratum NTP-1 ka plus one, yaani 2. Bacha hua offset ek millisecond se kam hai.",
      },
      focus: ["r1"],
      packets: [
        { path: ["r1", "ntp1"], label: "NTP request", tone: "purple" },
        { path: ["ntp1", "r1"], label: "NTP reply", tone: "green", delay: 1 },
      ],
      badges: [{ node: "r1", text: "st 2 · 10:15:00", tone: "green" }],
      tables: [{ node: "r1", title: "R1 show ntp associations", columns: COLS, rows: [["*~10.0.0.10", ".GPS.", "1", "0.452"]], hl: [0] }],
    },
    {
      title: { en: "The switches ask R1", hi: "Switches R1 se poochte hain" },
      text: {
        en: "SW1 and SW2 both have `ntp server 10.1.1.1`. SW2's request passes through SW1 like any other packet. R1 is synchronised, so it answers as a stratum 2 server; if it were still stratum 16, the switches would ignore its replies.",
        hi: "SW1 aur SW2 dono par `ntp server 10.1.1.1` hai. SW2 ki request baaki packets ki tarah SW1 se hokar jaati hai. R1 synchronised hai, toh woh stratum 2 server ki tarah jawab deta hai; agar woh abhi bhi stratum 16 hota, toh switches uske replies ignore kar dete.",
      },
      packets: [
        { path: ["sw1", "r1"], label: "NTP request", tone: "purple" },
        { path: ["sw2", "sw1", "r1"], label: "NTP request", tone: "purple" },
        { path: ["r1", "sw1"], label: "NTP reply", tone: "green", delay: 2 },
        { path: ["r1", "sw1", "sw2"], label: "NTP reply", tone: "green", delay: 2 },
      ],
    },
    {
      title: { en: "The switches sync at stratum 3", hi: "Switches stratum 3 par sync hote hain" },
      text: {
        en: "Both switches select R1 as sys.peer and correct their clocks. Their source is stratum 2, so they are stratum 3. In SW1's table, `ref clock` shows 10.0.0.10: the server R1 itself syncs to.",
        hi: "Dono switches R1 ko sys.peer chunte hain aur apni clocks theek karte hain. Unka source stratum 2 hai, toh woh stratum 3 hain. SW1 ki table mein `ref clock` 10.0.0.10 dikhata hai: woh server jisse R1 khud sync karta hai.",
      },
      focus: ["sw1", "sw2"],
      badges: [
        { node: "sw1", text: "st 3 · 10:15:00", tone: "green" },
        { node: "sw2", text: "st 3 · 10:15:00", tone: "green" },
      ],
      tables: [{ node: "sw1", title: "SW1 show ntp associations", columns: COLS, rows: [["*~10.1.1.1", "10.0.0.10", "2", "0.203"]], hl: [0] }],
    },
    {
      title: { en: "One failure, one timestamp", hi: "Ek failure, ek timestamp" },
      text: {
        en: "Later the SW1 to SW2 link fails. SW1 logs Gi0/2 down and SW2 logs Gi0/1 down, both at 10:20:03. In step 2 the same two entries would have been 24 minutes apart.",
        hi: "Baad mein SW1 se SW2 wala link fail hota hai. SW1 Gi0/2 down log karta hai aur SW2 Gi0/1 down, dono 10:20:03 par. Step 2 wali halat mein yahi do entries 24 minute alag hoti.",
      },
      focus: ["sw1", "sw2"],
      links: [{ id: "l-sw", state: "down" }],
      badges: [
        { node: "sw1", text: "log 10:20:03", tone: "orange" },
        { node: "sw2", text: "log 10:20:03", tone: "orange" },
      ],
    },
  ],
};

export default scene;
