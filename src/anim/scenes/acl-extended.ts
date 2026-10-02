import type { TopologyScene } from "../types.ts";

// Colours: green = permitted by USERS-IN, red = denied, blue = reply traffic the ACL never checks.
// USERS-IN is applied inbound on R1 Gi0/0, the interface facing the users (close to the source).

const entries = [
  "permit tcp 192.168.10.0 0.0.0.255 host 10.1.1.100 eq 443",
  "permit udp 192.168.10.0 0.0.0.255 host 10.1.1.53 eq domain",
  "permit tcp host 192.168.10.5 10.1.1.0 0.0.0.255 eq 22",
  "deny ip 192.168.10.0 0.0.0.255 10.1.1.0 0.0.0.255",
  "permit ip any any",
];

const acl = (hits: string[], hl?: number[]) => ({
  node: "r1",
  title: "R1 · USERS-IN (Gi0/0 in)",
  columns: ["Seq", "Entry", "Matches"],
  rows: [...entries.map((e, i) => [String((i + 1) * 10), e, hits[i]]), ["end", "deny ip any any (implicit)", "not counted"]],
  hl,
});

const scene: TopologyScene = {
  kind: "topology",
  id: "acl-extended",
  title: { en: "Extended ACL USERS-IN: each packet checked as it enters R1", hi: "Extended ACL USERS-IN: har packet R1 mein ghuste hi check hota hai" },
  height: 440,
  nodes: [
    { id: "pc1", kind: "pc", x: 80, y: 90, label: "PC1", sub: "192.168.10.10" },
    { id: "adm", kind: "pc", x: 80, y: 300, label: "ADMIN", sub: "192.168.10.5" },
    { id: "sw1", kind: "switch", x: 200, y: 195, label: "SW1" },
    { id: "r1", kind: "router", x: 330, y: 195, label: "R1" },
    { id: "inet", kind: "internet", x: 330, y: 345, label: "Internet", sub: "203.0.113.80" },
    { id: "r2", kind: "router", x: 480, y: 195, label: "R2" },
    { id: "sw2", kind: "switch", x: 600, y: 195, label: "SW2" },
    { id: "web", kind: "server", x: 720, y: 90, label: "WEB1", sub: "10.1.1.100" },
    { id: "dns", kind: "server", x: 720, y: 300, label: "DNS1", sub: "10.1.1.53" },
  ],
  links: [
    { id: "l-pc1", a: "pc1", b: "sw1" },
    { id: "l-adm", a: "adm", b: "sw1" },
    { id: "l-u", a: "sw1", b: "r1", bPort: "Gi0/0" },
    { id: "l-inet", a: "r1", b: "inet", aPort: "Gi0/2" },
    { id: "l-wan", a: "r1", b: "r2", aPort: "Gi0/1", bPort: "Gi0/1", label: "10.0.12.0/30" },
    { id: "l-s", a: "r2", b: "sw2", aPort: "Gi0/0" },
    { id: "l-web", a: "sw2", b: "web" },
    { id: "l-dns", a: "sw2", b: "dns" },
  ],
  steps: [
    {
      title: { en: "USERS-IN sits on Gi0/0, inbound", hi: "USERS-IN Gi0/0 par inbound lagi hai" },
      text: {
        en: "Users in 192.168.10.0/24 enter the network at R1 Gi0/0, so the extended ACL goes there, inbound: as close to the source as possible. Five entries, specific permits first, then a broad deny toward the server LAN, then permit ip any any for everything else.",
        hi: "192.168.10.0/24 ke users R1 ke Gi0/0 par network mein aate hain, isliye extended ACL wahin inbound lagti hai: source ke jitna paas ho sake. Paanch entries hain, pehle specific permits, phir server LAN ki taraf ek broad deny, phir baaki sab ke liye permit ip any any.",
      },
      focus: ["r1"],
      badges: [{ node: "r1", text: "USERS-IN in Gi0/0", tone: "purple" }],
      links: [{ id: "l-u", state: "active", note: "ACL in" }],
      tables: [acl(["0", "0", "0", "0", "0"])],
    },
    {
      title: { en: "PC1 HTTPS to WEB1: line 10 permits", hi: "PC1 ka WEB1 par HTTPS: line 10 permit" },
      text: {
        en: "TCP, source 192.168.10.10, destination 10.1.1.100, destination port 443. Every field of line 10 matches, so R1 forwards it across the WAN. WEB1's reply arrives at R1 on Gi0/1 and leaves Gi0/0 outbound, where no ACL is applied, so it is not checked.",
        hi: "TCP, source 192.168.10.10, destination 10.1.1.100, destination port 443. Line 10 ka har field match karta hai, toh R1 ise WAN ke paar forward kar deta hai. WEB1 ka reply R1 par Gi0/1 se aata hai aur Gi0/0 se outbound nikalta hai, jahan koi ACL nahi, isliye woh check nahi hota.",
      },
      packets: [
        { path: ["pc1", "sw1", "r1", "r2", "sw2", "web"], label: "HTTPS :443", tone: "green" },
        { path: ["web", "sw2", "r2", "r1", "sw1", "pc1"], label: "reply", tone: "blue", delay: 5 },
      ],
      tables: [acl(["1", "0", "0", "0", "0"], [0])],
    },
    {
      title: { en: "PC1 pings WEB1: line 40 denies at the edge", hi: "PC1 WEB1 ko ping karta hai: line 40 edge par deny karti hai" },
      text: {
        en: "ICMP is not TCP or UDP, so lines 10, 20 and 30 do not match. Line 40 matches any IP packet from 192.168.10.0/24 to 10.1.1.0/24: deny. R1 drops it the moment it arrives on Gi0/0, so it never uses the WAN link or reaches R2.",
        hi: "ICMP na TCP hai na UDP, toh lines 10, 20 aur 30 match nahi karti. Line 40 192.168.10.0/24 se 10.1.1.0/24 tak ka koi bhi IP packet match karti hai: deny. R1 ise Gi0/0 par aate hi drop kar deta hai, toh yeh na WAN link use karta hai, na R2 tak pahunchta hai.",
      },
      focus: ["pc1", "r1"],
      packets: [{ path: ["pc1", "sw1", "r1"], label: "ICMP echo", tone: "red", drop: true }],
      badges: [{ node: "pc1", text: "ping denied: 40", tone: "red" }],
      tables: [acl(["1", "0", "0", "1", "0"], [3])],
    },
    {
      title: { en: "PC1 SSH to WEB1: also line 40", hi: "PC1 ka WEB1 par SSH: yeh bhi line 40" },
      text: {
        en: "TCP to 10.1.1.100 port 22. Line 10 fails on the port (22, not 443), line 20 on the protocol, line 30 on the source (192.168.10.10, not .5). Line 40 matches and denies. There is no SSH line for users at all; the broad deny covers it.",
        hi: "10.1.1.100 par TCP port 22. Line 10 port par fail hoti hai (22 hai, 443 nahi), line 20 protocol par, line 30 source par (192.168.10.10 hai, .5 nahi). Line 40 match karke deny karti hai. Users ke SSH ke liye koi alag line hai hi nahi; broad deny use cover kar leta hai.",
      },
      focus: ["pc1", "r1"],
      packets: [{ path: ["pc1", "sw1", "r1"], label: "SSH :22", tone: "red", drop: true }],
      badges: [{ node: "pc1", text: "SSH denied: 40", tone: "red" }],
      tables: [acl(["1", "0", "0", "2", "0"], [3])],
    },
    {
      title: { en: "ADMIN SSH to WEB1: line 30 comes first", hi: "ADMIN ka WEB1 par SSH: line 30 pehle aati hai" },
      text: {
        en: "Same port 22, but the source is 192.168.10.5. Line 30 matches and permits before line 40 is ever read. If line 30 sat below line 40, ADMIN would be denied too, because 192.168.10.5 is inside 192.168.10.0/24. Specific before general.",
        hi: "Wahi port 22, lekin source 192.168.10.5 hai. Line 30 match karke permit kar deti hai, line 40 tak baat pahunchti hi nahi. Agar line 30, line 40 ke neeche hoti, toh ADMIN bhi deny ho jaata, kyunki 192.168.10.5, 192.168.10.0/24 ke andar hai. Specific pehle, general baad mein.",
      },
      focus: ["adm", "r1"],
      badges: [{ node: "pc1", text: "" }, { node: "adm", text: "SSH ok: 30", tone: "green" }],
      packets: [
        { path: ["adm", "sw1", "r1", "r2", "sw2", "web"], label: "SSH :22", tone: "green" },
        { path: ["web", "sw2", "r2", "r1", "sw1", "adm"], label: "reply", tone: "blue", delay: 5 },
      ],
      tables: [acl(["1", "0", "1", "2", "0"], [2])],
    },
    {
      title: { en: "PC1 asks DNS1: line 20 permits", hi: "PC1 DNS1 se poochta hai: line 20 permit" },
      text: {
        en: "UDP to 10.1.1.53 port 53. Line 10 needs TCP, so it fails; line 20 matches protocol, source, destination and `eq domain`, so the query is permitted and the answer comes back unchecked.",
        hi: "10.1.1.53 par UDP port 53. Line 10 ko TCP chahiye, toh woh fail; line 20 protocol, source, destination aur `eq domain` sab match karti hai, toh query permit hoti hai aur answer bina check ke wapas aata hai.",
      },
      focus: ["pc1", "dns"],
      badges: [{ node: "adm", text: "" }],
      packets: [
        { path: ["pc1", "sw1", "r1", "r2", "sw2", "dns"], label: "DNS :53", tone: "green" },
        { path: ["dns", "sw2", "r2", "r1", "sw1", "pc1"], label: "answer", tone: "blue", delay: 5 },
      ],
      tables: [acl(["1", "1", "1", "2", "0"], [1])],
    },
    {
      title: { en: "PC1 to the internet: line 50 permits", hi: "PC1 se internet: line 50 permit" },
      text: {
        en: "HTTPS to 203.0.113.80. Lines 10 to 40 all need a destination in 10.1.1.0/24, so none match. Line 50, permit ip any any, lets it through to Gi0/2. Without line 50 the implicit deny would drop it and the users would lose the internet.",
        hi: "203.0.113.80 par HTTPS. Lines 10 se 40 sab ko 10.1.1.0/24 wali destination chahiye, toh koi match nahi karti. Line 50, permit ip any any, ise Gi0/2 ki taraf jaane deti hai. Line 50 na hoti toh implicit deny ise drop kar deta aur users ka internet chala jaata.",
      },
      focus: ["pc1", "inet"],
      packets: [
        { path: ["pc1", "sw1", "r1", "inet"], label: "HTTPS :443", tone: "green" },
        { path: ["inet", "r1", "sw1", "pc1"], label: "reply", tone: "blue", delay: 3 },
      ],
      tables: [acl(["1", "1", "1", "2", "1"], [4])],
    },
    {
      title: { en: "Why not put it on R2?", hi: "Ise R2 par kyun nahi lagaya?" },
      text: {
        en: "Suppose R1 had no ACL and the same deny lived on R2 Gi0/0 out instead. PC1's ping would cross SW1, R1 and the WAN link before R2 dropped it, using bandwidth for a packet that was never going to be delivered. Near the source, R1 drops it on arrival.",
        hi: "Maan lo R1 par koi ACL nahi hoti aur wahi deny R2 ke Gi0/0 par out lagi hoti. PC1 ka ping SW1, R1 aur WAN link cross karke R2 tak jaata, tab drop hota, yaani ek aise packet par bandwidth kharch hoti jo deliver hona hi nahi tha. Source ke paas lagi ho toh R1 use aate hi drop kar deta hai.",
      },
      focus: ["r2"],
      reset: true,
      links: [{ id: "l-wan", state: "active", note: "wasted trip" }],
      badges: [
        { node: "r1", text: "no ACL (what-if)", tone: "gray" },
        { node: "r2", text: "if ACL here (worse)", tone: "orange" },
      ],
      packets: [{ path: ["pc1", "sw1", "r1", "r2"], label: "ICMP echo", tone: "red", drop: true }],
    },
  ],
};

export default scene;
