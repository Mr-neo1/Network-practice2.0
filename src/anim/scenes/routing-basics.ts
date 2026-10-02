import type { TopologyScene } from "../types.ts";

// Colours: blue = data (ICMP echo), green = reply, red = ICMP error / dropped packet.

const cols = ["Code", "Network", "Interface"];
const lanA = [
  ["C", "192.168.1.0/24", "Gi0/0"],
  ["L", "192.168.1.1/32", "Gi0/0"],
];
const full = [
  ["C", "10.0.12.0/30", "Gi0/2"],
  ["L", "10.0.12.1/32", "Gi0/2"],
  ["C", "192.168.1.0/24", "Gi0/0"],
  ["L", "192.168.1.1/32", "Gi0/0"],
  ["C", "192.168.2.0/24", "Gi0/1"],
  ["L", "192.168.2.1/32", "Gi0/1"],
];
const title = "R1 routing table";

const scene: TopologyScene = {
  kind: "topology",
  id: "routing-basics",
  title: { en: "R1 builds its routing table, then forwards with it", hi: "R1 routing table banata hai, phir usi se forward karta hai" },
  height: 400,
  nodes: [
    { id: "pca", kind: "pc", x: 110, y: 95, label: "PC-A", sub: "192.168.1.10/24" },
    { id: "pcb", kind: "pc", x: 110, y: 305, label: "PC-B", sub: "192.168.2.10/24" },
    { id: "r1", kind: "router", x: 340, y: 200, label: "R1" },
    { id: "r2", kind: "router", x: 540, y: 200, label: "R2" },
    { id: "srv", kind: "server", x: 700, y: 200, label: "Server", sub: "172.16.3.10/24" },
  ],
  links: [
    { id: "l-a", a: "pca", b: "r1", bPort: "Gi0/0", label: "192.168.1.0/24" },
    { id: "l-b", a: "pcb", b: "r1", bPort: "Gi0/1", label: "192.168.2.0/24" },
    { id: "l-12", a: "r1", b: "r2", aPort: "Gi0/2", bPort: "Gi0/0", label: "10.0.12.0/30" },
    { id: "l-s", a: "r2", b: "srv", aPort: "Gi0/1", label: "172.16.3.0/24" },
  ],
  steps: [
    {
      title: { en: "Addresses set, interfaces still shut", hi: "Addresses set, interfaces abhi shut" },
      text: {
        en: "R1 has IP addresses on Gi0/0, Gi0/1 and Gi0/2, but all three are still administratively down. Its routing table is empty, so R1 cannot forward a single packet yet.",
        hi: "R1 ke Gi0/0, Gi0/1 aur Gi0/2 par IP addresses configure ho chuke hain, lekin teeno abhi administratively down hain. Routing table khaali hai, isliye R1 abhi ek bhi packet forward nahi kar sakta.",
      },
      focus: ["r1"],
      links: [
        { id: "l-a", state: "down" },
        { id: "l-b", state: "down" },
        { id: "l-12", state: "down" },
      ],
      tables: [{ node: "r1", title, columns: cols, rows: [["(empty)", "", ""]] }],
    },
    {
      title: { en: "Gi0/0 comes up: two routes appear", hi: "Gi0/0 up hua: do routes aa gaye" },
      text: {
        en: "The admin enters no shutdown on Gi0/0 and it goes up/up. R1 adds a connected route (C) for the whole subnet 192.168.1.0/24 and a local route (L) for its own address, 192.168.1.1/32.",
        hi: "Admin Gi0/0 par no shutdown karta hai aur interface up/up ho jaata hai. R1 turant poore subnet 192.168.1.0/24 ka connected route (C) aur apne khud ke address 192.168.1.1/32 ka local route (L) add kar deta hai.",
      },
      focus: ["r1"],
      links: [{ id: "l-a", state: "normal" }],
      tables: [{ node: "r1", title, columns: cols, rows: lanA, hl: [0, 1] }],
    },
    {
      title: { en: "Gi0/1 and Gi0/2 come up too", hi: "Gi0/1 aur Gi0/2 bhi up" },
      text: {
        en: "Gi0/1 and Gi0/2 reach up/up as well, and each adds its own C and L pair. R1 now knows three networks, all directly connected, and nothing beyond them.",
        hi: "Gi0/1 aur Gi0/2 bhi up/up ho jaate hain, aur dono apna-apna C aur L pair add karte hain. Ab R1 teen networks jaanta hai, teeno directly connected, aur inke aage kuch nahi.",
      },
      focus: ["r1"],
      links: [
        { id: "l-b", state: "normal" },
        { id: "l-12", state: "normal" },
      ],
      tables: [{ node: "r1", title, columns: cols, rows: full, hl: [0, 1, 4, 5] }],
    },
    {
      title: { en: "PC-A to PC-B: a connected route matches", hi: "PC-A se PC-B: connected route match hua" },
      text: {
        en: "PC-A pings 192.168.2.10 and sends the packet to its gateway, R1. R1 finds the destination inside the connected route 192.168.2.0/24 and sends it out Gi0/1 straight to PC-B. PC-B's reply to 192.168.1.10 matches the connected route 192.168.1.0/24 and goes out Gi0/0.",
        hi: "PC-A 192.168.2.10 ko ping karta hai aur packet apne gateway R1 ko bhejta hai. R1 ko destination connected route 192.168.2.0/24 ke andar milta hai, toh woh packet Gi0/1 se seedha PC-B ko bhej deta hai. PC-B ka reply 192.168.1.10 ke liye hai, woh connected route 192.168.1.0/24 se match hota hai aur Gi0/0 se nikal jaata hai.",
      },
      packets: [
        { path: ["pca", "r1", "pcb"], label: "To 192.168.2.10", tone: "blue" },
        { path: ["pcb", "r1", "pca"], label: "Echo Reply", tone: "green", delay: 2 },
      ],
      tables: [{ node: "r1", title, columns: cols, rows: full, hl: [2, 4] }],
    },
    {
      title: { en: "A packet for R1 itself: the local route", hi: "R1 ke liye hi packet: local route" },
      text: {
        en: "PC-A pings 192.168.1.1. That address matches the local route 192.168.1.1/32, which is more specific than 192.168.1.0/24, so R1 keeps the packet, processes the ping itself and replies.",
        hi: "PC-A 192.168.1.1 ko ping karta hai. Yeh address local route 192.168.1.1/32 se match hota hai, jo 192.168.1.0/24 se zyada specific hai, isliye R1 packet aage nahi bhejta; ping khud process karke reply karta hai.",
      },
      packets: [
        { path: ["pca", "r1"], label: "To 192.168.1.1", tone: "blue" },
        { path: ["r1", "pca"], label: "Echo Reply", tone: "green", delay: 1 },
      ],
      tables: [{ node: "r1", title, columns: cols, rows: full, hl: [3] }],
    },
    {
      title: { en: "172.16.3.10: no route, so dropped", hi: "172.16.3.10: route nahi, toh drop" },
      text: {
        en: "PC-A now pings the server at 172.16.3.10. R2 is connected to 172.16.3.0/24, but R1 has no route that matches and no default route, so R1 drops the packet.",
        hi: "Ab PC-A server 172.16.3.10 ko ping karta hai. R2 toh 172.16.3.0/24 se connected hai, lekin R1 ke paas na koi matching route hai na default route, isliye R1 packet drop kar deta hai.",
      },
      focus: ["r1", "srv"],
      packets: [{ path: ["pca", "r1"], label: "To 172.16.3.10", tone: "blue", drop: true }],
      badges: [{ node: "r1", text: "no route", tone: "red" }],
    },
    {
      title: { en: "R1 reports back with ICMP", hi: "R1 ICMP se wapas batata hai" },
      text: {
        en: "R1 sends an ICMP Destination Unreachable (network unreachable) back to 192.168.1.10. On Windows, PC-A prints \"Reply from 192.168.1.1: Destination net unreachable.\"",
        hi: "R1, 192.168.1.10 ko ICMP Destination Unreachable (network unreachable) message wapas bhejta hai. Windows par PC-A dikhata hai: \"Reply from 192.168.1.1: Destination net unreachable.\"",
      },
      packets: [{ path: ["r1", "pca"], label: "ICMP Unreachable", tone: "red" }],
      badges: [
        { node: "r1", text: "" },
        { node: "pca", text: "net unreachable", tone: "red" },
      ],
    },
    {
      title: { en: "Link down: its routes disappear", hi: "Link down: uske routes gayab" },
      text: {
        en: "The cable on Gi0/1 is pulled and the interface goes down/down, so R1 removes the C and L routes for 192.168.2.0/24. A new ping to PC-B now matches no route: R1 drops it and sends PC-A another ICMP unreachable.",
        hi: "Gi0/1 ka cable nikal diya gaya aur interface down/down ho gaya, isliye R1 ne 192.168.2.0/24 ke C aur L routes hata diye. Ab PC-B ko naya ping kisi route se match nahi karta: R1 use drop karta hai aur PC-A ko phir se ICMP unreachable bhejta hai.",
      },
      links: [{ id: "l-b", state: "down" }],
      packets: [
        { path: ["pca", "r1"], label: "To 192.168.2.10", tone: "blue", drop: true },
        { path: ["r1", "pca"], label: "ICMP Unreachable", tone: "red", delay: 1 },
      ],
      badges: [
        { node: "pca", text: "" },
        { node: "r1", text: "no route", tone: "red" },
      ],
      tables: [{ node: "r1", title, columns: cols, rows: full.slice(0, 4) }],
    },
  ],
};

export default scene;
