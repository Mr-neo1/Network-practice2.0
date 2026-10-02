import type { TopologyScene } from "../types.ts";

// Packet colours: blue = packet carrying a private address inside a home LAN,
// green = packet with a public address on the internet, red = dropped.
const scene: TopologyScene = {
  kind: "topology",
  id: "private-ipv4",
  title: { en: "Two homes, one private address, and why NAT sits at the edge", hi: "Do ghar, ek hi private address, aur NAT edge par kyun baithta hai" },
  height: 420,
  nodes: [
    { id: "lapa", kind: "laptop", x: 95, y: 95, label: "Laptop-A", sub: "192.168.1.10" },
    { id: "homea", kind: "router", x: 275, y: 95, label: "Home-A", sub: "in 192.168.1.1", sub2: "out 203.0.113.10" },
    { id: "pcb", kind: "pc", x: 95, y: 315, label: "PC-B", sub: "192.168.1.10" },
    { id: "homeb", kind: "router", x: 275, y: 315, label: "Home-B", sub: "in 192.168.1.1", sub2: "out 203.0.113.20" },
    { id: "isp", kind: "router", x: 450, y: 205, label: "ISP" },
    { id: "inet", kind: "internet", x: 590, y: 205, label: "Internet" },
    { id: "web", kind: "server", x: 710, y: 205, label: "Web server", sub: "198.51.100.80" },
  ],
  links: [
    { id: "l-a", a: "lapa", b: "homea", label: "192.168.1.0/24" },
    { id: "l-b", a: "pcb", b: "homeb", label: "192.168.1.0/24" },
    { id: "l-ia", a: "homea", b: "isp" },
    { id: "l-ib", a: "homeb", b: "isp" },
    { id: "l-in", a: "isp", b: "inet" },
    { id: "l-w", a: "inet", b: "web" },
  ],
  steps: [
    {
      title: { en: "Two homes, the same private network", hi: "Do ghar, same private network" },
      text: {
        en: "Home-A and Home-B both use 192.168.1.0/24, and Laptop-A and PC-B even share the address 192.168.1.10. That is allowed: 192.168.0.0/16 is an RFC 1918 private range, and a private address only has to be unique inside its own LAN. Only the routers' outside addresses, 203.0.113.10 and 203.0.113.20, are public and unique.",
        hi: "Home-A aur Home-B dono 192.168.1.0/24 use karte hain, aur Laptop-A aur PC-B ka address bhi same hai: 192.168.1.10. Yeh bilkul allowed hai: 192.168.0.0/16 RFC 1918 ki private range hai, aur private address ko sirf apne LAN ke andar unique hona hai. Sirf routers ke outside addresses, 203.0.113.10 aur 203.0.113.20, public aur unique hain.",
      },
      focus: ["lapa", "pcb"],
    },
    {
      title: { en: "Laptop-A sends to a public server", hi: "Laptop-A public server ko bhejta hai" },
      text: {
        en: "Laptop-A opens a web page on 198.51.100.80. The packet's source is 192.168.1.10 and its destination 198.51.100.80. That destination is outside 192.168.1.0/24, so the packet goes to the default gateway, Home-A at 192.168.1.1.",
        hi: "Laptop-A 198.51.100.80 par ek web page kholta hai. Packet ka source 192.168.1.10 hai aur destination 198.51.100.80. Yeh destination 192.168.1.0/24 ke bahar hai, isliye packet default gateway ke paas jaata hai, yaani Home-A (192.168.1.1).",
      },
      packets: [{ path: ["lapa", "homea"], label: "src 192.168.1.10", tone: "blue" }],
    },
    {
      title: { en: "Without NAT: dropped at the ISP", hi: "Bina NAT: ISP par drop" },
      text: {
        en: "Suppose Home-A forwarded the packet unchanged. The ISP's edge filters packets whose source is not the customer's assigned address, and RFC 1918 sources are the first to go, so the packet is discarded. Even if it slipped through, the reply to 192.168.1.10 could never come back, because no internet router has a route for a private address.",
        hi: "Maan lo Home-A packet ko bina badle aage bhej de. ISP ka edge un packets ko filter karta hai jinka source customer ko diya gaya address nahi hai, aur RFC 1918 source wale packets sabse pehle rok diye jaate hain, toh yeh packet discard ho jaata hai. Agar nikal bhi jaata, toh 192.168.1.10 ko reply kabhi wapas nahi aata, kyunki kisi internet router ke paas private address ka route hi nahi hota.",
      },
      packets: [{ path: ["homea", "isp"], label: "src 192.168.1.10", tone: "red", drop: true }],
      badges: [{ node: "isp", text: "private src: drop", tone: "red" }],
      focus: ["isp"],
    },
    {
      title: { en: "With NAT: the source becomes public", hi: "NAT ke saath: source public ban jaata hai" },
      text: {
        en: "Now Home-A does NAT: it replaces the source 192.168.1.10 with its own public address 203.0.113.10 and records the pair in its NAT table. The packet is now an ordinary internet packet, and it reaches the server. (A real home router also records port numbers, which is PAT; this table shows only the addresses.)",
        hi: "Ab Home-A NAT karta hai: source 192.168.1.10 ko apne public address 203.0.113.10 se badal deta hai aur yeh jodi apni NAT table mein likh leta hai. Ab yeh ek normal internet packet hai, aur server tak pahunch jaata hai. (Asli home router port numbers bhi note karta hai, jise PAT kehte hain; yahan table mein sirf addresses dikhaye hain.)",
      },
      badges: [{ node: "isp", text: "" }],
      focus: ["homea"],
      packets: [{ path: ["homea", "isp", "inet", "web"], label: "src 203.0.113.10", tone: "green" }],
      tables: [{ node: "homea", title: "Home-A NAT table", columns: ["Inside (private)", "Outside (public)"], rows: [["192.168.1.10", "203.0.113.10"]], hl: [0] }],
    },
    {
      title: { en: "The reply comes back through NAT", hi: "Reply NAT se hokar wapas aata hai" },
      text: {
        en: "The server replies to 203.0.113.10, a public address every internet router can reach. Home-A finds 203.0.113.10 in its NAT table, changes the destination back to 192.168.1.10 and forwards the reply into its LAN.",
        hi: "Server 203.0.113.10 ko reply karta hai, jo public address hai aur har internet router use reach kar sakta hai. Home-A apni NAT table mein 203.0.113.10 dhoondhta hai, destination ko wapas 192.168.1.10 kar deta hai aur reply apne LAN mein bhej deta hai.",
      },
      focus: ["homea"],
      packets: [
        { path: ["web", "inet", "isp", "homea"], label: "dst 203.0.113.10", tone: "green" },
        { path: ["homea", "lapa"], label: "dst 192.168.1.10", tone: "blue", delay: 3 },
      ],
    },
    {
      title: { en: "Same private address, different public one", hi: "Private address same, public alag" },
      text: {
        en: "PC-B has exactly the same address as Laptop-A, but Home-B translates it to 203.0.113.20. The server sees two different public sources, so the replies never get mixed up. This is how millions of networks reuse 192.168.1.0/24 at the same time.",
        hi: "PC-B ka address bilkul Laptop-A jaisa hai, lekin Home-B use 203.0.113.20 mein translate karta hai. Server ko do alag public sources dikhte hain, isliye replies kabhi mix nahi hote. Isi tarah laakhon networks ek saath 192.168.1.0/24 reuse karte hain.",
      },
      focus: ["pcb", "homeb"],
      packets: [
        { path: ["pcb", "homeb"], label: "src 192.168.1.10", tone: "blue" },
        { path: ["homeb", "isp", "inet", "web"], label: "src 203.0.113.20", tone: "green", delay: 1 },
      ],
      tables: [{ node: "homeb", title: "Home-B NAT table", columns: ["Inside (private)", "Outside (public)"], rows: [["192.168.1.10", "203.0.113.20"]], hl: [0] }],
    },
    {
      title: { en: "Nobody outside can address 192.168.1.10", hi: "Bahar se koi 192.168.1.10 ko address nahi kar sakta" },
      text: {
        en: "Now the server tries to send straight to 192.168.1.10, but which one? Internet routers carry no routes for 10.0.0.0/8, 172.16.0.0/12 or 192.168.0.0/16, so the packet is dropped. From outside, a private host is reachable only through its router's public address and NAT table.",
        hi: "Ab server seedha 192.168.1.10 ko bhejne ki koshish karta hai, lekin kaunsa 192.168.1.10? Internet routers ke paas 10.0.0.0/8, 172.16.0.0/12 ya 192.168.0.0/16 ka koi route nahi hota, isliye packet drop ho jaata hai. Bahar se private host tak pahunchne ka ek hi raasta hai: uske router ka public address aur NAT table.",
      },
      focus: ["web", "inet"],
      packets: [{ path: ["web", "inet"], label: "dst 192.168.1.10", tone: "red", drop: true }],
      badges: [{ node: "inet", text: "no route", tone: "red" }],
    },
  ],
};

export default scene;
