import type { TopologyScene } from "../types.ts";

// Colours: blue = test or user traffic from PC1/PC2, green = replies.
// Badges: green = check passed, red = check failed / fault found, orange = suspect.

const checkCols = ["Check", "Result"];

const checks = (rows: string[][], hl?: number[]) => ({
  node: "pc1",
  title: "Ticket 4471: checks",
  columns: checkCols,
  rows,
  hl,
});

const r1: string[] = ["Scope", "all VLAN 20; VLAN 10 ok"];
const r2: string[] = ["ipconfig, ping 10.1.20.1", "pass"];
const r3: string[] = ["tracert 10.1.100.10", "stops after hop 1"];
const r4: string[] = ["route + ARP on DSW1", "pass"];
const r5: string[] = ["ACL SERVERS out Vl100", "FAIL: no VLAN 20"];

const acl = (rows: string[][], hl?: number[]) => ({
  node: "dsw1",
  title: "DSW1 ACL SERVERS (out Vl100)",
  columns: ["Seq", "Rule", "Matches"],
  rows,
  hl,
});

const scene: TopologyScene = {
  kind: "topology",
  id: "troubleshooting-method",
  title: { en: "Following the path: why VLAN 20 cannot reach FS1", hi: "Path follow karna: VLAN 20 FS1 tak kyun nahi pahunchta" },
  height: 420,
  nodes: [
    { id: "pc2", kind: "pc", x: 110, y: 100, label: "PC2", sub: "VLAN 10", sub2: "10.1.10.25/24" },
    { id: "pc1", kind: "pc", x: 110, y: 300, label: "PC1", sub: "VLAN 20", sub2: "10.1.20.25/24" },
    { id: "sw1", kind: "switch", x: 300, y: 200, label: "SW1", sub: "access" },
    { id: "dsw1", kind: "l3switch", x: 500, y: 200, label: "DSW1", sub: "gw 10.1.x.1", sub2: "SVIs 10, 20, 100" },
    { id: "fs1", kind: "server", x: 690, y: 200, label: "FS1", sub: "10.1.100.10", sub2: "VLAN 100" },
  ],
  links: [
    { id: "l-pc2", a: "pc2", b: "sw1", bPort: "Gi1/0/1" },
    { id: "l-pc1", a: "pc1", b: "sw1", bPort: "Gi1/0/5" },
    { id: "l-trunk", a: "sw1", b: "dsw1", aPort: "Gi1/0/24", bPort: "Gi1/0/1", style: "trunk", label: "10,20,99" },
    { id: "l-fs1", a: "dsw1", b: "fs1", aPort: "Gi1/0/10" },
  ],
  steps: [
    {
      title: { en: "The symptom: VLAN 20 fails, VLAN 10 works", hi: "Symptom: VLAN 20 fail, VLAN 10 chalta hai" },
      text: {
        en: "PC2 in VLAN 10 opens the share on FS1 (TCP 445) and gets replies. PC1 in VLAN 20 sends the same request and gets nothing back. From PC1's chair you only see a timeout, not where the packet died.",
        hi: "VLAN 10 ka PC2 FS1 par share (TCP 445) kholta hai aur reply milta hai. VLAN 20 ka PC1 wahi request bhejta hai aur kuch wapas nahi aata. PC1 ki seat se sirf timeout dikhta hai, yeh nahi ki packet kahan mara.",
      },
      packets: [
        { path: ["pc2", "sw1", "dsw1", "fs1"], label: "SMB 445", tone: "blue" },
        { path: ["fs1", "dsw1", "sw1", "pc2"], label: "Reply", tone: "green", delay: 3 },
        { path: ["pc1", "sw1", "dsw1"], label: "SMB 445", tone: "blue", drop: true },
      ],
      badges: [
        { node: "pc2", text: "works", tone: "green" },
        { node: "pc1", text: "fails", tone: "red" },
      ],
    },
    {
      title: { en: "Define the problem and gather facts", hi: "Problem define karo, facts gather karo" },
      text: {
        en: "Every VLAN 20 user is affected, every VLAN 10 user is fine, and VLAN 20 was created on Friday. VLAN 10 reaches FS1 through DSW1, so FS1, its cable and DSW1's routing in general are proven. Look at what only VLAN 20 uses, and follow PC1's path hop by hop.",
        hi: "VLAN 20 ka har user affected hai, VLAN 10 ka har user theek hai, aur VLAN 20 Friday ko bana tha. VLAN 10 DSW1 se hokar FS1 tak pahunchta hai, toh FS1, uski cable aur DSW1 ki general routing proven hai. Woh dekho jo sirf VLAN 20 use karta hai, aur PC1 ka path hop by hop follow karo.",
      },
      focus: ["pc1"],
      badges: [
        { node: "pc2", text: "baseline", tone: "green" },
        { node: "fs1", text: "proven", tone: "green" },
      ],
      tables: [checks([r1], [0])],
    },
    {
      title: { en: "Check 1: PC1 can reach its gateway", hi: "Check 1: PC1 apne gateway tak pahunchta hai" },
      text: {
        en: "PC1's IP, mask and gateway (10.1.20.1) are correct, and a ping to 10.1.20.1 gets replies. That echo crossed PC1's cable, access port Gi1/0/5 in VLAN 20, and the trunk to the Vlan20 SVI, so all of that passes without logging in to SW1.",
        hi: "PC1 ka IP, mask aur gateway (10.1.20.1) sahi hain, aur 10.1.20.1 ko ping karne par reply aata hai. Woh echo PC1 ki cable, VLAN 20 wale access port Gi1/0/5, aur trunk se hokar Vlan20 SVI tak gaya, toh SW1 par login kiye bina yeh sab pass ho gaya.",
      },
      packets: [
        { path: ["pc1", "sw1", "dsw1"], label: "Ping .1", tone: "blue" },
        { path: ["dsw1", "sw1", "pc1"], label: "Reply", tone: "green", delay: 2 },
      ],
      links: [
        { id: "l-pc1", state: "active" },
        { id: "l-trunk", state: "active" },
      ],
      badges: [
        { node: "pc1", text: "IP ok", tone: "green" },
        { node: "sw1", text: "pass", tone: "green" },
      ],
      tables: [checks([r1, r2], [1])],
    },
    {
      title: { en: "Check 2: traceroute stops at DSW1", hi: "Check 2: traceroute DSW1 par ruk jaata hai" },
      text: {
        en: "`tracert -d 10.1.100.10` from PC1: hop 1, 10.1.20.1, answers. The hop 2 probe reaches DSW1 but never arrives at FS1, so hop 2 and every hop after it show \"Request timed out\". The fault is on DSW1 or between DSW1 and FS1.",
        hi: "PC1 se `tracert -d 10.1.100.10`: hop 1, yaani 10.1.20.1, jawab deta hai. Hop 2 ka probe DSW1 tak pahunchta hai lekin FS1 tak kabhi nahi jaata, isliye hop 2 aur uske baad ke har hop par \"Request timed out\" aata hai. Fault DSW1 par hai ya DSW1 aur FS1 ke beech.",
      },
      packets: [
        { path: ["pc1", "sw1", "dsw1"], label: "TTL 1 probe", tone: "blue" },
        { path: ["dsw1", "sw1", "pc1"], label: "Time exceeded", tone: "green", delay: 2 },
        { path: ["pc1", "sw1", "dsw1"], label: "TTL 2 probe", tone: "blue", delay: 4, drop: true },
      ],
      badges: [{ node: "dsw1", text: "suspect", tone: "orange" }],
      tables: [checks([r1, r2, r3], [2])],
    },
    {
      title: { en: "Check 3: routing and ARP on DSW1 pass", hi: "Check 3: DSW1 par routing aur ARP pass" },
      text: {
        en: "On DSW1, `show ip interface brief` shows Vlan20 and Vlan100 up/up, `show ip route` has `C 10.1.100.0/24` on Vlan100, and `show ip arp` has FS1's MAC. DSW1 knows where FS1 is, so something must be dropping the packet on purpose.",
        hi: "DSW1 par `show ip interface brief` mein Vlan20 aur Vlan100 up/up hain, `show ip route` mein Vlan100 par `C 10.1.100.0/24` hai, aur `show ip arp` mein FS1 ka MAC hai. DSW1 ko pata hai FS1 kahan hai, toh koi cheez packet ko jaan boojh kar drop kar rahi hai.",
      },
      focus: ["dsw1"],
      links: [
        { id: "l-pc1", state: "normal" },
        { id: "l-trunk", state: "normal" },
      ],
      tables: [checks([r1, r2, r3, r4], [3])],
    },
    {
      title: { en: "Hypothesis: an ACL drops VLAN 20", hi: "Hypothesis: ek ACL VLAN 20 ko drop karti hai" },
      text: {
        en: "`show ip interface vlan 100` shows outgoing access list SERVERS. It permits only 10.1.10.0/24, so DSW1 drops PC1's packet as it tries to leave towards VLAN 100, and each attempt raises the counter on line 30, deny ip any any. The hypothesis is confirmed by evidence, not by a hunch.",
        hi: "`show ip interface vlan 100` mein outgoing access list SERVERS dikhti hai. Yeh sirf 10.1.10.0/24 ko permit karti hai, isliye jab PC1 ka packet VLAN 100 ki taraf nikalne lagta hai, DSW1 use wahin drop kar deta hai, aur har koshish par line 30, deny ip any any, ka counter badhta hai. Hypothesis evidence se confirm hui, andaaze se nahi.",
      },
      packets: [{ path: ["pc1", "sw1", "dsw1"], label: "SMB 445", tone: "blue", drop: true }],
      links: [{ id: "l-fs1", state: "blocked", note: "ACL SERVERS out" }],
      badges: [{ node: "dsw1", text: "ACL deny", tone: "red" }],
      tables: [
        checks([r1, r2, r3, r4, r5], [4]),
        acl(
          [
            ["10", "permit tcp 10.1.10.0/24 > FS1 445", "1843"],
            ["20", "permit icmp 10.1.10.0/24 > FS1", "52"],
            ["30", "deny ip any any", "311"],
          ],
          [2],
        ),
      ],
    },
    {
      title: { en: "Fix: insert lines 15 and 25", hi: "Fix: lines 15 aur 25 insert karo" },
      text: {
        en: "One change, with the rollback written down first (`no 15`, `no 25`). Under `ip access-list extended SERVERS` the engineer adds line 15 for TCP 445 and line 25 for ICMP from 10.1.20.0/24. The new lines sit before the deny at 30.",
        hi: "Ek change, aur rollback pehle se likha hua (`no 15`, `no 25`). `ip access-list extended SERVERS` ke andar engineer line 15 TCP 445 ke liye aur line 25 ICMP ke liye add karta hai, 10.1.20.0/24 se. Nayi lines line 30 wale deny se pehle aati hain.",
      },
      focus: ["dsw1"],
      links: [{ id: "l-fs1", state: "normal" }],
      badges: [{ node: "dsw1", text: "fixed", tone: "green" }],
      tables: [
        acl(
          [
            ["10", "permit tcp 10.1.10.0/24 > FS1 445", "1843"],
            ["15", "permit tcp 10.1.20.0/24 > FS1 445", "0"],
            ["20", "permit icmp 10.1.10.0/24 > FS1", "52"],
            ["25", "permit icmp 10.1.20.0/24 > FS1", "0"],
            ["30", "deny ip any any", "311"],
          ],
          [1, 3],
        ),
      ],
    },
    {
      title: { en: "Verify from the user's side", hi: "User ki side se verify karo" },
      text: {
        en: "PC1 opens the share and FS1 replies; line 15's counter starts rising while line 30 stays at 311. PC2 is tested too and still works, so the fix broke nothing.",
        hi: "PC1 share kholta hai aur FS1 reply karta hai; line 15 ka counter badhne lagta hai aur line 30 311 par hi rukta hai. PC2 ko bhi test kiya, woh ab bhi chal raha hai, toh fix ne kuch nahi toda.",
      },
      packets: [
        { path: ["pc1", "sw1", "dsw1", "fs1"], label: "SMB 445", tone: "blue" },
        { path: ["fs1", "dsw1", "sw1", "pc1"], label: "Reply", tone: "green", delay: 3 },
        { path: ["pc2", "sw1", "dsw1", "fs1"], label: "SMB 445", tone: "blue", delay: 1 },
        { path: ["fs1", "dsw1", "sw1", "pc2"], label: "Reply", tone: "green", delay: 4 },
      ],
      badges: [
        { node: "pc1", text: "works", tone: "green" },
        { node: "pc2", text: "still works", tone: "green" },
      ],
      tables: [
        acl(
          [
            ["10", "permit tcp 10.1.10.0/24 > FS1 445", "1851"],
            ["15", "permit tcp 10.1.20.0/24 > FS1 445", "9"],
            ["20", "permit icmp 10.1.10.0/24 > FS1", "52"],
            ["25", "permit icmp 10.1.20.0/24 > FS1", "4"],
            ["30", "deny ip any any", "311"],
          ],
          [1, 3],
        ),
      ],
    },
    {
      title: { en: "Document and close", hi: "Document karo aur close karo" },
      text: {
        en: "The engineer saves the config and writes the ticket: symptom, root cause (SERVERS not updated when VLAN 20 was added), fix, rollback and the counter evidence. \"Update server ACLs\" goes onto the new-VLAN checklist so it does not happen again.",
        hi: "Engineer config save karta hai aur ticket likhta hai: symptom, root cause (VLAN 20 add karte waqt SERVERS update nahi hui), fix, rollback aur counters ka evidence. New-VLAN checklist mein \"server ACLs update karo\" jod diya jaata hai taaki yeh dobara na ho.",
      },
      badges: [
        { node: "sw1", text: "" },
        { node: "fs1", text: "" },
        { node: "dsw1", text: "documented", tone: "teal" },
      ],
      tables: [checks([r1, r2, r3, r4, ["Fix + verify", "pass, closed"]], [4])],
    },
  ],
};

export default scene;
