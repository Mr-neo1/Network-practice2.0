import type { TopologyScene } from "../types.ts";

// Management network 10.10.0.0/24: engineer 10.10.0.100, automation server 10.10.0.50, SW1-SW4 10.10.0.11-14.
// Old NTP server 10.0.0.10 (retired), new NTP server 10.0.0.20. PC1 10.20.0.25 is a user on SW2.
// Colours: teal = management traffic (SSH, NTP request), green = reply / success, red = failed,
// purple = control plane (BPDU), blue = user data.
const scene: TopologyScene = {
  kind: "topology",
  id: "automation-intro",
  title: { en: "One NTP change on four switches: by hand, then automated", hi: "Chaar switches par ek NTP change: haath se, phir automation se" },
  height: 540,
  nodes: [
    { id: "eng", kind: "laptop", x: 100, y: 110, label: "Engineer", sub: "10.10.0.100" },
    { id: "auto", kind: "controller", x: 100, y: 410, label: "Automation", sub: "10.10.0.50" },
    { id: "core", kind: "l3switch", x: 330, y: 260, label: "CORE" },
    { id: "ntp", kind: "server", x: 330, y: 455, label: "NTP-NEW", sub: "10.0.0.20" },
    { id: "sw1", kind: "switch", x: 600, y: 70, label: "SW1", sub: "10.10.0.11" },
    { id: "sw2", kind: "switch", x: 600, y: 200, label: "SW2", sub: "10.10.0.12" },
    { id: "sw3", kind: "switch", x: 600, y: 330, label: "SW3", sub: "10.10.0.13" },
    { id: "sw4", kind: "switch", x: 600, y: 460, label: "SW4", sub: "10.10.0.14" },
    { id: "pc1", kind: "pc", x: 725, y: 200, label: "PC1", sub: "10.20.0.25" },
  ],
  links: [
    { id: "l-eng", a: "eng", b: "core" },
    { id: "l-auto", a: "auto", b: "core" },
    { id: "l-ntp", a: "core", b: "ntp" },
    { id: "l-sw1", a: "core", b: "sw1" },
    { id: "l-sw2", a: "core", b: "sw2" },
    { id: "l-sw3", a: "core", b: "sw3" },
    { id: "l-sw4", a: "core", b: "sw4" },
    { id: "l-pc1", a: "sw2", b: "pc1" },
  ],
  steps: [
    {
      title: { en: "One change, four switches", hi: "Ek change, chaar switches" },
      text: {
        en: "The old NTP server 10.0.0.10 is being retired. All four switches must stop using it and use NTP-NEW at 10.0.0.20 instead. The engineer opens a change ticket with every switch pending.",
        hi: "Purana NTP server 10.0.0.10 hataya ja raha hai. Chaaron switches ko use chhod kar 10.0.0.20 wala NTP-NEW use karna hai. Engineer change ticket kholta hai, har switch pending hai.",
      },
      focus: ["eng", "sw1", "sw2", "sw3", "sw4"],
      tables: [
        {
          node: "eng",
          title: "Manual change ticket",
          columns: ["Switch", "Status"],
          rows: [["SW1", "pending"], ["SW2", "pending"], ["SW3", "pending"], ["SW4", "pending"]],
        },
      ],
    },
    {
      title: { en: "By hand: SSH to each switch in turn", hi: "Haath se: har switch par baari-baari SSH" },
      text: {
        en: "The engineer SSHes to SW1, then SW2, and on each types `no ntp server 10.0.0.10`, `ntp server 10.0.0.20` and `write memory`. Roughly five minutes per switch. Fine for four, days of work for 400.",
        hi: "Engineer pehle SW1 par, phir SW2 par SSH karta hai, aur har ek par `no ntp server 10.0.0.10`, `ntp server 10.0.0.20` aur `write memory` type karta hai. Har switch par lagbhag paanch minute. Chaar ke liye theek, 400 ke liye kai din ka kaam.",
      },
      packets: [
        { path: ["eng", "core", "sw1"], label: "SSH + config", tone: "teal" },
        { path: ["eng", "core", "sw2"], label: "SSH + config", tone: "teal", delay: 2 },
      ],
      badges: [
        { node: "sw1", text: "ntp 10.0.0.20", tone: "green" },
        { node: "sw2", text: "ntp 10.0.0.20", tone: "green" },
      ],
      tables: [
        {
          node: "eng",
          title: "Manual change ticket",
          columns: ["Switch", "Status"],
          rows: [["SW1", "done"], ["SW2", "done"], ["SW3", "pending"], ["SW4", "pending"]],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "A typo on SW3 that IOS accepts", hi: "SW3 par typo jo IOS accept kar leta hai" },
      text: {
        en: "On SW3 the engineer types `ntp server 10.0.0.200`. It is a valid address, so IOS accepts it with no error. The ticket says done.",
        hi: "SW3 par engineer `ntp server 10.0.0.200` type kar deta hai. Yeh valid address hai, isliye IOS bina error ke accept kar leta hai. Ticket mein done likha jaata hai.",
      },
      packets: [{ path: ["eng", "core", "sw3"], label: "SSH + config", tone: "teal" }],
      badges: [{ node: "sw3", text: "ntp 10.0.0.200", tone: "red" }],
      tables: [
        {
          node: "eng",
          title: "Manual change ticket",
          columns: ["Switch", "Status"],
          rows: [["SW1", "done"], ["SW2", "done"], ["SW3", "done (typo)"], ["SW4", "pending"]],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "SW4 is skipped: configuration drift", hi: "SW4 chhoot gaya: configuration drift" },
      text: {
        en: "The engineer is pulled into an outage call and SW4 is never changed. Four switches that should be identical now have three different NTP configs. That gap between intended and actual config is configuration drift.",
        hi: "Engineer ek outage call mein chala jaata hai aur SW4 kabhi change hi nahi hota. Jo chaar switches identical hone chahiye the, unke ab teen alag NTP configs hain. Intended aur actual config ka yahi fark configuration drift hai.",
      },
      focus: ["sw3", "sw4"],
      badges: [{ node: "sw4", text: "ntp 10.0.0.10", tone: "orange" }],
    },
    {
      title: { en: "Nothing alarms, but two clocks drift", hi: "Koi alarm nahi, par do clocks drift hote hain" },
      text: {
        en: "SW1 and SW2 ask 10.0.0.20 for the time and get answers. SW3 asks 10.0.0.200 and SW4 asks the retired 10.0.0.10: nobody answers, so CORE has nowhere to deliver them. Traffic still flows, so nobody notices, but SW3 and SW4 syslog timestamps slowly go wrong.",
        hi: "SW1 aur SW2 10.0.0.20 se time poochte hain aur jawab milta hai. SW3 10.0.0.200 se aur SW4 retired 10.0.0.10 se poochta hai: wahan koi hai hi nahi, toh CORE unhe kahin deliver nahi kar pata. Traffic chalta rehta hai, isliye kisi ko pata nahi chalta, lekin SW3 aur SW4 ke syslog timestamps dheere-dheere galat hote jaate hain.",
      },
      packets: [
        { path: ["sw1", "core", "ntp"], label: "NTP request", tone: "teal" },
        { path: ["sw2", "core", "ntp"], label: "NTP request", tone: "teal" },
        { path: ["ntp", "core", "sw1"], label: "NTP reply", tone: "green", delay: 2 },
        { path: ["ntp", "core", "sw2"], label: "NTP reply", tone: "green", delay: 2 },
        { path: ["sw3", "core"], label: "NTP to .200", tone: "red", drop: true },
        { path: ["sw4", "core"], label: "NTP to .10", tone: "red", drop: true },
      ],
      badges: [
        { node: "sw1", text: "synced", tone: "green" },
        { node: "sw2", text: "synced", tone: "green" },
        { node: "sw3", text: "unsynced", tone: "red" },
        { node: "sw4", text: "unsynced", tone: "red" },
      ],
    },
    {
      title: { en: "Automated: validate, then read every switch", hi: "Automation: validate karo, phir har switch padho" },
      text: {
        en: "Now the same job on the automation server. It first checks the input: 10.0.0.20 is in the approved NTP list, so it goes ahead. Then it reads `show running-config | include ntp server` from all four switches at once. The drift is visible immediately.",
        hi: "Ab wahi kaam automation server par. Pehle woh input check karta hai: 10.0.0.20 approved NTP list mein hai, toh aage badhta hai. Phir chaaron switches se ek saath `show running-config | include ntp server` padhta hai. Drift turant dikh jaata hai.",
      },
      packets: [
        { path: ["auto", "core", "sw1"], label: "Read config", tone: "teal" },
        { path: ["auto", "core", "sw2"], label: "Read config", tone: "teal" },
        { path: ["auto", "core", "sw3"], label: "Read config", tone: "teal" },
        { path: ["auto", "core", "sw4"], label: "Read config", tone: "teal" },
      ],
      tables: [
        { node: "eng", title: "Manual change ticket", columns: ["Switch", "Status"], rows: [] },
        {
          node: "auto",
          title: "Pre-check: ntp server",
          columns: ["Switch", "Found", "Verdict"],
          rows: [["SW1", "10.0.0.20", "ok"], ["SW2", "10.0.0.20", "ok"], ["SW3", "10.0.0.200", "wrong"], ["SW4", "10.0.0.10", "old"]],
          hl: [2, 3],
        },
      ],
    },
    {
      title: { en: "One template, rendered for every switch", hi: "Ek template, har switch ke liye render" },
      text: {
        en: "The template is rendered per switch from the pre-check: SW3 loses `ntp server 10.0.0.200`, SW4 loses `ntp server 10.0.0.10`, and all four get `ntp server 10.0.0.20` and a save. SW1 and SW2 already had that line, so nothing changes for them. In seconds every switch has the identical NTP config; on 400 switches it would run in parallel batches.",
        hi: "Template pre-check ke hisaab se har switch ke liye render hota hai: SW3 se `ntp server 10.0.0.200` hatta hai, SW4 se `ntp server 10.0.0.10`, aur chaaron ko `ntp server 10.0.0.20` aur save milta hai. SW1 aur SW2 par yeh line pehle se thi, toh unke liye kuch nahi badalta. Seconds mein har switch ka NTP config bilkul same ho jaata hai; 400 switches par yeh parallel batches mein chalega.",
      },
      packets: [
        { path: ["auto", "core", "sw1"], label: "Push template", tone: "teal" },
        { path: ["auto", "core", "sw2"], label: "Push template", tone: "teal" },
        { path: ["auto", "core", "sw3"], label: "Push template", tone: "teal" },
        { path: ["auto", "core", "sw4"], label: "Push template", tone: "teal" },
      ],
      badges: [
        { node: "sw1", text: "ntp 10.0.0.20", tone: "green" },
        { node: "sw2", text: "ntp 10.0.0.20", tone: "green" },
        { node: "sw3", text: "ntp 10.0.0.20", tone: "green" },
        { node: "sw4", text: "ntp 10.0.0.20", tone: "green" },
      ],
    },
    {
      title: { en: "Post-check: every switch really syncs", hi: "Post-check: har switch sach mein sync hota hai" },
      text: {
        en: "SW3 and SW4 now ask 10.0.0.20 and get replies. The server runs `show ntp associations` on each switch and looks for `*` next to 10.0.0.20. Only then is the job marked done, with who, when and what written to the log.",
        hi: "Ab SW3 aur SW4 10.0.0.20 se poochte hain aur reply milta hai. Server har switch par `show ntp associations` chala kar 10.0.0.20 ke saamne `*` dhoondhta hai. Tabhi job done mark hota hai, aur kisne, kab aur kya, sab log mein likha jaata hai.",
      },
      packets: [
        { path: ["sw3", "core", "ntp"], label: "NTP request", tone: "teal" },
        { path: ["sw4", "core", "ntp"], label: "NTP request", tone: "teal" },
        { path: ["ntp", "core", "sw3"], label: "NTP reply", tone: "green", delay: 2 },
        { path: ["ntp", "core", "sw4"], label: "NTP reply", tone: "green", delay: 2 },
      ],
      badges: [
        { node: "sw1", text: "synced", tone: "green" },
        { node: "sw2", text: "synced", tone: "green" },
        { node: "sw3", text: "synced", tone: "green" },
        { node: "sw4", text: "synced", tone: "green" },
      ],
      tables: [
        {
          node: "auto",
          title: "Post-check: sys.peer",
          columns: ["Switch", "Synced to", "Result"],
          rows: [["SW1", "*10.0.0.20", "pass"], ["SW2", "*10.0.0.20", "pass"], ["SW3", "*10.0.0.20", "pass"], ["SW4", "*10.0.0.20", "pass"]],
          hl: [2, 3],
        },
        { node: "auto", title: "Pre-check: ntp server", columns: ["Switch", "Found", "Verdict"], rows: [] },
      ],
    },
    {
      title: { en: "The three planes, seen on SW2", hi: "Teeno planes, SW2 par dekho" },
      text: {
        en: "Three kinds of traffic meet SW2 at once. An SSH session from the automation server is management plane. An STP BPDU from CORE is control plane: it helps decide which ports forward. PC1's frame to its gateway is data plane: SW2 just looks up the MAC table and forwards it.",
        hi: "SW2 par ek saath teen tarah ka traffic aata hai. Automation server ka SSH session management plane hai. CORE se aaya STP BPDU control plane hai: isse decide hota hai kaunse ports forward karenge. PC1 ka gateway ki taraf jaata frame data plane hai: SW2 bas MAC table dekh kar use forward kar deta hai.",
      },
      focus: ["sw2"],
      badges: [
        { node: "sw1", text: "" },
        { node: "sw2", text: "" },
        { node: "sw3", text: "" },
        { node: "sw4", text: "" },
      ],
      packets: [
        { path: ["auto", "core", "sw2"], label: "SSH", tone: "teal" },
        { path: ["core", "sw2"], label: "STP BPDU", tone: "purple" },
        { path: ["pc1", "sw2", "core"], label: "User data", tone: "blue" },
      ],
      tables: [
        { node: "auto", title: "Post-check: sys.peer", columns: ["Switch", "Synced to", "Result"], rows: [] },
        {
          node: "sw2",
          title: "SW2: three planes",
          columns: ["Plane", "Seen here", "Job"],
          rows: [
            ["Management", "SSH from 10.10.0.50", "configure, monitor"],
            ["Control", "STP BPDU from CORE", "build tables"],
            ["Data", "PC1 frame to gateway", "forward traffic"],
          ],
          hl: [0, 1, 2],
        },
      ],
    },
  ],
};

export default scene;
