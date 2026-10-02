import type { TopologyScene } from "../types.ts";

// Colours: blue = traffic started inside (PAT), green = return traffic,
// orange = connection started outside (static NAT), red = no translation.

const COLS = ["Pro", "Inside global", "Inside local", "Outside global"];
const STATIC = ["---", "203.0.113.10", "192.168.1.100", "---"];
const PC1 = ["tcp", "203.0.113.1:49152", "192.168.1.10:49152", "198.51.100.80:443"];
const PC2 = ["tcp", "203.0.113.1:1024", "192.168.1.11:49152", "198.51.100.80:443"];
const CLIY = ["tcp", "203.0.113.10:443", "192.168.1.100:443", "198.51.100.50:51544"];

const scene: TopologyScene = {
  kind: "topology",
  id: "nat",
  title: { en: "PAT and static NAT on R1: out, back, and in", hi: "R1 par PAT aur static NAT: bahar, wapas, aur andar" },
  height: 440,
  nodes: [
    { id: "pc1", kind: "pc", x: 100, y: 80, label: "PC1", sub: "192.168.1.10" },
    { id: "pc2", kind: "pc", x: 100, y: 215, label: "PC2", sub: "192.168.1.11" },
    { id: "web", kind: "server", x: 100, y: 350, label: "WebSrv", sub: "192.168.1.100" },
    { id: "sw1", kind: "switch", x: 250, y: 215, label: "SW1" },
    { id: "r1", kind: "router", x: 410, y: 215, label: "R1", sub: "G0/1 203.0.113.1" },
    { id: "inet", kind: "internet", x: 570, y: 215, label: "Internet" },
    { id: "srvx", kind: "server", x: 700, y: 80, label: "Server-X", sub: "198.51.100.80" },
    { id: "cliy", kind: "laptop", x: 700, y: 350, label: "Client-Y", sub: "198.51.100.50" },
  ],
  links: [
    { id: "l-pc1", a: "pc1", b: "sw1" },
    { id: "l-pc2", a: "pc2", b: "sw1" },
    { id: "l-web", a: "web", b: "sw1" },
    { id: "l-in", a: "sw1", b: "r1", bPort: "G0/0", label: "inside" },
    { id: "l-out", a: "r1", b: "inet", aPort: "G0/1", label: "outside" },
    { id: "l-x", a: "inet", b: "srvx" },
    { id: "l-y", a: "inet", b: "cliy" },
  ],
  steps: [
    {
      title: { en: "R1 is set up: inside, outside, two rules", hi: "R1 tayyar hai: inside, outside, do rules" },
      text: {
        en: "G0/0 is `ip nat inside` and G0/1 is `ip nat outside`. R1 has a static rule (WebSrv 192.168.1.100 is always 203.0.113.10) and a PAT rule (192.168.1.0/24 shares 203.0.113.1). Only the static entry exists so far.",
        hi: "G0/0 `ip nat inside` hai aur G0/1 `ip nat outside`. R1 par ek static rule hai (WebSrv 192.168.1.100 hamesha 203.0.113.10 hai) aur ek PAT rule (192.168.1.0/24 203.0.113.1 share karta hai). Abhi table mein sirf static entry hai.",
      },
      focus: ["r1"],
      tables: [{ node: "r1", title: "R1 NAT table", columns: COLS, rows: [STATIC], hl: [0] }],
    },
    {
      title: { en: "PC1 opens HTTPS; R1 rewrites the source", hi: "PC1 HTTPS kholta hai; R1 source badalta hai" },
      text: {
        en: "PC1 sends from 192.168.1.10:49152 to 198.51.100.80:443. The packet enters on the inside and matches ACL 1, so R1 changes the source to 203.0.113.1, keeps port 49152 because it is free, records the pair and sends the packet on.",
        hi: "PC1 192.168.1.10:49152 se 198.51.100.80:443 ko bhejta hai. Packet inside par aata hai aur ACL 1 se match karta hai, toh R1 source ko 203.0.113.1 kar deta hai, port 49152 free hai isliye wahi rakhta hai, jodi table mein likhta hai aur packet aage bhej deta hai.",
      },
      packets: [
        { path: ["pc1", "sw1", "r1"], label: "src 192.168.1.10", tone: "blue" },
        { path: ["r1", "inet", "srvx"], label: "src 203.0.113.1", tone: "blue", delay: 2 },
      ],
      tables: [{ node: "r1", title: "R1 NAT table", columns: COLS, rows: [STATIC, PC1], hl: [1] }],
    },
    {
      title: { en: "The reply is translated back", hi: "Reply wapas translate hota hai" },
      text: {
        en: "Server-X only ever saw 203.0.113.1, so it replies to 203.0.113.1:49152. R1 finds that in the inside global column, changes the destination back to 192.168.1.10:49152 and forwards it to PC1.",
        hi: "Server-X ne sirf 203.0.113.1 dekha tha, toh woh 203.0.113.1:49152 ko reply karta hai. R1 ise inside global column mein dhoondhta hai, destination wapas 192.168.1.10:49152 karta hai aur PC1 ko forward kar deta hai.",
      },
      packets: [
        { path: ["srvx", "inet", "r1"], label: "dst 203.0.113.1", tone: "green" },
        { path: ["r1", "sw1", "pc1"], label: "dst 192.168.1.10", tone: "green", delay: 2 },
      ],
    },
    {
      title: { en: "PC2 uses the same port; R1 picks another", hi: "PC2 bhi wahi port; R1 doosra chunta hai" },
      text: {
        en: "PC2 also sends from port 49152. 203.0.113.1:49152 is already PC1's, so R1 translates PC2 to 203.0.113.1:1024. Same public address, different port: that is overload.",
        hi: "PC2 bhi port 49152 se bhejta hai. 203.0.113.1:49152 pehle se PC1 ka hai, toh R1 PC2 ko 203.0.113.1:1024 mein translate karta hai. Same public address, alag port: yahi overload hai.",
      },
      packets: [
        { path: ["pc2", "sw1", "r1"], label: "src 192.168.1.11", tone: "blue" },
        { path: ["r1", "inet", "srvx"], label: "203.0.113.1:1024", tone: "blue", delay: 2 },
      ],
      tables: [{ node: "r1", title: "R1 NAT table", columns: COLS, rows: [STATIC, PC1, PC2], hl: [2] }],
    },
    {
      title: { en: "The port decides which PC gets the reply", hi: "Port decide karta hai reply kis PC ko jaaye" },
      text: {
        en: "Server-X replies to 203.0.113.1:1024. The address is the same as PC1's reply, but port 1024 matches only PC2's row, so R1 rewrites the destination to 192.168.1.11:49152 and PC1 never sees it.",
        hi: "Server-X 203.0.113.1:1024 ko reply karta hai. Address PC1 ke reply jaisa hi hai, lekin port 1024 sirf PC2 ki row se match karta hai, toh R1 destination 192.168.1.11:49152 kar deta hai aur PC1 ko yeh dikhta bhi nahi.",
      },
      focus: ["r1", "pc2"],
      packets: [
        { path: ["srvx", "inet", "r1"], label: "203.0.113.1:1024", tone: "green" },
        { path: ["r1", "sw1", "pc2"], label: "dst 192.168.1.11", tone: "green", delay: 2 },
      ],
    },
    {
      title: { en: "Inbound to the PAT address: no entry", hi: "PAT address par inbound: koi entry nahi" },
      text: {
        en: "Client-Y tries to start a session to 203.0.113.1:443. No row matches it, because PAT rows are only created by traffic from the inside. R1 has no inside host to send it to, so nothing reaches the LAN.",
        hi: "Client-Y 203.0.113.1:443 par session shuru karna chahta hai. Koi row match nahi karti, kyunki PAT rows sirf inside se aaye traffic se banti hain. R1 ke paas bhejne ke liye koi inside host nahi hai, toh LAN tak kuch nahi pahunchta.",
      },
      focus: ["r1", "cliy"],
      badges: [{ node: "r1", text: "no entry", tone: "red" }],
      packets: [{ path: ["cliy", "inet", "r1"], label: "dst 203.0.113.1", tone: "red", drop: true }],
    },
    {
      title: { en: "Static NAT lets Client-Y in", hi: "Static NAT Client-Y ko andar aane deta hai" },
      text: {
        en: "Client-Y now connects to 203.0.113.10:443. The static mapping always exists, so R1 changes the destination to 192.168.1.100 and forwards it to WebSrv. A row for this session is added.",
        hi: "Ab Client-Y 203.0.113.10:443 se connect karta hai. Static mapping hamesha maujood hai, toh R1 destination ko 192.168.1.100 karke WebSrv ko forward kar deta hai. Is session ki ek row add hoti hai.",
      },
      badges: [{ node: "r1", text: "" }],
      packets: [
        { path: ["cliy", "inet", "r1"], label: "dst 203.0.113.10", tone: "orange" },
        { path: ["r1", "sw1", "web"], label: "dst 192.168.1.100", tone: "orange", delay: 2 },
      ],
      tables: [{ node: "r1", title: "R1 NAT table", columns: COLS, rows: [STATIC, PC1, PC2, CLIY], hl: [3] }],
    },
    {
      title: { en: "WebSrv replies as 203.0.113.10", hi: "WebSrv 203.0.113.10 bankar reply karta hai" },
      text: {
        en: "WebSrv answers from 192.168.1.100:443. On the way out R1 rewrites the source to 203.0.113.10, so Client-Y gets the reply from the address it connected to.",
        hi: "WebSrv 192.168.1.100:443 se jawab deta hai. Bahar jaate waqt R1 source ko 203.0.113.10 kar deta hai, toh Client-Y ko reply usi address se milta hai jisse usne connect kiya tha.",
      },
      packets: [
        { path: ["web", "sw1", "r1"], label: "src 192.168.1.100", tone: "green" },
        { path: ["r1", "inet", "cliy"], label: "src 203.0.113.10", tone: "green", delay: 2 },
      ],
    },
    {
      title: { en: "clear ip nat translation *", hi: "clear ip nat translation *" },
      text: {
        en: "The admin runs `clear ip nat translation *`. Every session row goes, including Client-Y's row built on the static mapping, and those sessions break. The `---` static line stays, so WebSrv is still reachable on 203.0.113.10.",
        hi: "Admin `clear ip nat translation *` chalata hai. Har session row hat jaati hai, Client-Y wali row bhi jo static mapping par bani thi, aur woh sessions toot jaate hain. `---` wali static line rehti hai, toh WebSrv ab bhi 203.0.113.10 par reachable hai.",
      },
      focus: ["r1"],
      tables: [{ node: "r1", title: "R1 NAT table", columns: COLS, rows: [STATIC], hl: [0] }],
    },
  ],
};

export default scene;
