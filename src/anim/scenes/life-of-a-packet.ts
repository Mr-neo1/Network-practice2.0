import type { TopologyScene } from "../types.ts";

// Colours: orange = ARP request (broadcast), teal = ARP reply (unicast),
// blue = ICMP echo request, green = ICMP echo reply, pink = ICMP error (Destination Unreachable).
// Router MACs are simplified so they are easy to tell apart: R1 = 0011.1111.xxxx, R2 = 0022.2222.xxxx.
// Hop tables are shown on their own so they are never squeezed next to another table.

const hopCols = ["Link", "Src MAC", "Dst MAC", "TTL"];
const echoTitle = "Echo request: IP 192.168.1.10 → 192.168.2.10 on every link";
const replyTitle = "Echo reply: IP 192.168.2.10 → 192.168.1.10 on every link";
const hop1 = ["PC1 → R1", "0050.56aa.0001", "0011.1111.0000", "128"];
const hop2 = ["R1 → R2", "0011.1111.0001", "0022.2222.0001", "127"];
const hop3 = ["R2 → PC2", "0022.2222.0000", "0050.56aa.0002", "126"];
const rtCols = ["Code", "Network", "Next hop / interface"];
const arpCols = ["IP address", "MAC address", "Interface"];

const scene: TopologyScene = {
  kind: "topology",
  id: "life-of-a-packet",
  title: { en: "One ping across two routers: what changes on every link", hi: "Do routers ke paar ek ping: har link par kya badalta hai" },
  height: 260,
  nodes: [
    { id: "pc1", kind: "pc", x: 70, y: 115, label: "PC1", sub: "192.168.1.10/24", sub2: "0050.56aa.0001" },
    { id: "sw1", kind: "switch", x: 190, y: 115, label: "SW1" },
    { id: "r1", kind: "router", x: 320, y: 115, label: "R1", sub: "Gi0/0 192.168.1.1", sub2: "Gi0/1 192.168.12.1" },
    { id: "r2", kind: "router", x: 480, y: 115, label: "R2", sub: "Gi0/1 192.168.12.2", sub2: "Gi0/0 192.168.2.1" },
    { id: "sw2", kind: "switch", x: 610, y: 115, label: "SW2" },
    { id: "pc2", kind: "pc", x: 730, y: 115, label: "PC2", sub: "192.168.2.10/24", sub2: "0050.56aa.0002" },
  ],
  links: [
    { id: "l-pc1", a: "pc1", b: "sw1" },
    { id: "l-r1", a: "sw1", b: "r1", bPort: "Gi0/0" },
    { id: "l-wan", a: "r1", b: "r2", aPort: "Gi0/1", bPort: "Gi0/1", label: "192.168.12.0/30" },
    { id: "l-r2", a: "r2", b: "sw2", aPort: "Gi0/0" },
    { id: "l-pc2", a: "sw2", b: "pc2" },
  ],
  steps: [
    {
      title: { en: "PC1: remote, so ARP for the gateway", hi: "PC1: remote hai, toh gateway ke liye ARP" },
      text: {
        en: "192.168.2.10 is outside PC1's network 192.168.1.0/24, so PC1 must send through its default gateway, 192.168.1.1, and its ARP cache is empty. It broadcasts \"Who has 192.168.1.1?\" and R1 replies with 0011.1111.0000, caching PC1's MAC from the request at the same time. PC1 never asks for PC2's MAC, because PC2 is not on its link.",
        hi: "192.168.2.10 PC1 ke network 192.168.1.0/24 ke bahar hai, isliye PC1 ko default gateway 192.168.1.1 ke through bhejna hoga, aur uska ARP cache khaali hai. Woh broadcast karta hai \"192.168.1.1 kiska hai?\" aur R1 0011.1111.0000 ke saath reply karta hai, saath hi request se PC1 ka MAC cache kar leta hai. PC1 kabhi PC2 ka MAC nahi poochta, kyunki PC2 uske link par hai hi nahi.",
      },
      focus: ["pc1", "r1"],
      packets: [
        { path: ["pc1", "sw1", "r1"], label: "ARP Request", tone: "orange" },
        { path: ["r1", "sw1", "pc1"], label: "ARP Reply", tone: "teal", delay: 2 },
      ],
      tables: [
        { node: "pc1", title: "PC1 ARP cache", columns: ["IP address", "MAC address"], rows: [["192.168.1.1", "0011.1111.0000"]], hl: [0] },
        { node: "r1", title: "R1 ARP table", columns: arpCols, rows: [["192.168.1.10", "0050.56aa.0001", "Gi0/0"]], hl: [0] },
      ],
    },
    {
      title: { en: "Hop 1: PC1 to R1", hi: "Hop 1: PC1 se R1" },
      text: {
        en: "PC1 sends the ICMP echo request. The IP header reads 192.168.1.10 → 192.168.2.10 with TTL 128, but the frame is addressed 0050.56aa.0001 → 0011.1111.0000: to R1, not to PC2. SW1 forwards it without changing anything.",
        hi: "PC1 ICMP echo request bhejta hai. IP header mein 192.168.1.10 → 192.168.2.10 aur TTL 128 hai, lekin frame ka address 0050.56aa.0001 → 0011.1111.0000 hai: yaani R1 ke liye, PC2 ke liye nahi. SW1 bina kuch badle ise forward kar deta hai.",
      },
      packets: [{ path: ["pc1", "sw1", "r1"], label: "Echo · TTL 128", tone: "blue" }],
      tables: [
        { node: "pc1", title: "PC1 ARP cache", columns: ["IP address", "MAC address"], rows: [] },
        { node: "r1", title: "R1 ARP table", columns: arpCols, rows: [] },
        { node: "pc1", title: echoTitle, columns: hopCols, rows: [hop1], hl: [0] },
      ],
    },
    {
      title: { en: "R1: strip, look up, lower the TTL", hi: "R1: header hatao, lookup karo, TTL ghatao" },
      text: {
        en: "The destination MAC is R1's own, so R1 accepts the frame and discards the Ethernet header. Its best match for 192.168.2.10 is S 192.168.2.0/24 via 192.168.12.2, and 192.168.12.2 lies in the connected network on Gi0/1. R1 lowers the TTL from 128 to 127 and recalculates the IP header checksum.",
        hi: "Destination MAC R1 ka apna hai, isliye R1 frame accept karta hai aur Ethernet header hata deta hai. 192.168.2.10 ke liye best match S 192.168.2.0/24 via 192.168.12.2 hai, aur 192.168.12.2 Gi0/1 wale connected network mein hai. R1 TTL 128 se 127 karta hai aur IP header checksum dobara calculate karta hai.",
      },
      focus: ["r1"],
      badges: [{ node: "r1", text: "TTL 128→127", tone: "purple" }],
      tables: [
        { node: "pc1", title: echoTitle, columns: hopCols, rows: [] },
        {
          node: "r1",
          title: "R1 routing table",
          columns: rtCols,
          rows: [
            ["C", "192.168.1.0/24", "Gi0/0"],
            ["C", "192.168.12.0/30", "Gi0/1"],
            ["S", "192.168.2.0/24", "via 192.168.12.2"],
          ],
          hl: [1, 2],
        },
      ],
    },
    {
      title: { en: "R1 ARPs for the next hop", hi: "R1 next hop ke liye ARP karta hai" },
      text: {
        en: "R1 needs the MAC of the next hop, 192.168.12.2, not the MAC of PC2. Its ARP table has no entry for 192.168.12.2, so it ARPs out of Gi0/1. R2 replies with 0022.2222.0001 and caches R1's Gi0/1 MAC from the request.",
        hi: "R1 ko next hop 192.168.12.2 ka MAC chahiye, PC2 ka nahi. ARP table mein 192.168.12.2 ki entry nahi hai, toh R1 Gi0/1 se ARP karta hai. R2 0022.2222.0001 ke saath reply karta hai aur request se R1 ke Gi0/1 ka MAC cache kar leta hai.",
      },
      packets: [
        { path: ["r1", "r2"], label: "ARP Request", tone: "orange" },
        { path: ["r2", "r1"], label: "ARP Reply", tone: "teal", delay: 1 },
      ],
      tables: [
        { node: "r1", title: "R1 routing table", columns: rtCols, rows: [] },
        {
          node: "r1",
          title: "R1 ARP table",
          columns: arpCols,
          rows: [
            ["192.168.1.10", "0050.56aa.0001", "Gi0/0"],
            ["192.168.12.2", "0022.2222.0001", "Gi0/1"],
          ],
          hl: [1],
        },
        { node: "r2", title: "R2 ARP table", columns: arpCols, rows: [["192.168.12.1", "0011.1111.0001", "Gi0/1"]], hl: [0] },
      ],
    },
    {
      title: { en: "Hop 2: a brand-new frame", hi: "Hop 2: bilkul naya frame" },
      text: {
        en: "R1 puts the same packet in a new frame: source 0011.1111.0001 (its Gi0/1), destination 0022.2222.0001 (R2's Gi0/1). The IP addresses are exactly as PC1 wrote them. Only the TTL, now 127, shows that a router has handled the packet.",
        hi: "R1 wahi packet ek naye frame mein daalta hai: source 0011.1111.0001 (apna Gi0/1), destination 0022.2222.0001 (R2 ka Gi0/1). IP addresses bilkul waise hi hain jaise PC1 ne likhe the. Sirf TTL, jo ab 127 hai, batata hai ki packet ek router se guzra hai.",
      },
      packets: [{ path: ["r1", "r2"], label: "Echo · TTL 127", tone: "blue" }],
      badges: [{ node: "r1", text: "" }],
      tables: [
        { node: "r1", title: "R1 ARP table", columns: arpCols, rows: [] },
        { node: "r2", title: "R2 ARP table", columns: arpCols, rows: [] },
        { node: "pc1", title: echoTitle, columns: hopCols, rows: [hop1, hop2], hl: [1] },
      ],
    },
    {
      title: { en: "R2: the network is directly connected", hi: "R2: network directly connected hai" },
      text: {
        en: "R2 strips the frame and looks up 192.168.2.10. The best match is its connected network 192.168.2.0/24 on Gi0/0, so there is no next-hop router left: the next hop is PC2 itself. R2 lowers the TTL from 127 to 126.",
        hi: "R2 frame hatata hai aur 192.168.2.10 ka lookup karta hai. Best match uska connected network 192.168.2.0/24 (Gi0/0) hai, yaani ab koi next-hop router bacha hi nahi: next hop khud PC2 hai. R2 TTL 127 se 126 kar deta hai.",
      },
      focus: ["r2"],
      badges: [{ node: "r2", text: "TTL 127→126", tone: "purple" }],
      tables: [
        { node: "pc1", title: echoTitle, columns: hopCols, rows: [] },
        {
          node: "r2",
          title: "R2 routing table",
          columns: rtCols,
          rows: [
            ["C", "192.168.2.0/24", "Gi0/0"],
            ["C", "192.168.12.0/30", "Gi0/1"],
            ["S", "192.168.1.0/24", "via 192.168.12.1"],
          ],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "R2 ARPs for PC2 itself", hi: "R2 seedha PC2 ke liye ARP karta hai" },
      text: {
        en: "R2 has no ARP entry for 192.168.2.10, so it broadcasts an ARP request on Gi0/0 and SW2 floods it to PC2. PC2 replies with 0050.56aa.0002 and caches R2's Gi0/0 MAC from the request, which it will need for the reply.",
        hi: "R2 ke paas 192.168.2.10 ki ARP entry nahi hai, toh woh Gi0/0 par ARP request broadcast karta hai aur SW2 use PC2 tak flood karta hai. PC2 0050.56aa.0002 ke saath reply karta hai aur request se R2 ke Gi0/0 ka MAC cache kar leta hai, jo use reply bhejte waqt chahiye hoga.",
      },
      packets: [
        { path: ["r2", "sw2", "pc2"], label: "ARP Request", tone: "orange" },
        { path: ["pc2", "sw2", "r2"], label: "ARP Reply", tone: "teal", delay: 2 },
      ],
      tables: [
        { node: "r2", title: "R2 routing table", columns: rtCols, rows: [] },
        {
          node: "r2",
          title: "R2 ARP table",
          columns: arpCols,
          rows: [
            ["192.168.12.1", "0011.1111.0001", "Gi0/1"],
            ["192.168.2.10", "0050.56aa.0002", "Gi0/0"],
          ],
          hl: [1],
        },
        { node: "pc2", title: "PC2 ARP cache", columns: ["IP address", "MAC address"], rows: [["192.168.2.1", "0022.2222.0000"]], hl: [0] },
      ],
    },
    {
      title: { en: "Hop 3: delivered to PC2", hi: "Hop 3: PC2 tak delivery" },
      text: {
        en: "R2 builds the third frame, 0022.2222.0000 → 0050.56aa.0002, and SW2 delivers it. PC2 gets an IP header that still reads 192.168.1.10 → 192.168.2.10, now with TTL 126. Three links, three different frames, one unchanged pair of IP addresses.",
        hi: "R2 teesra frame banata hai, 0022.2222.0000 → 0050.56aa.0002, aur SW2 use deliver karta hai. PC2 ko jo IP header milta hai usmein ab bhi 192.168.1.10 → 192.168.2.10 likha hai, bas TTL ab 126 hai. Teen links, teen alag frames, lekin IP addresses ka pair ek hi raha.",
      },
      packets: [{ path: ["r2", "sw2", "pc2"], label: "Echo · TTL 126", tone: "blue" }],
      badges: [{ node: "r2", text: "" }],
      tables: [
        { node: "r2", title: "R2 ARP table", columns: arpCols, rows: [] },
        { node: "pc2", title: "PC2 ARP cache", columns: ["IP address", "MAC address"], rows: [] },
        { node: "pc1", title: echoTitle, columns: hopCols, rows: [hop1, hop2, hop3], hl: [2] },
      ],
    },
    {
      title: { en: "The reply: a new packet, no ARP", hi: "Reply: naya packet, koi ARP nahi" },
      text: {
        en: "PC2 sends a new packet, 192.168.2.10 → 192.168.1.10, starting again at TTL 128. Every device learned the MAC it needs while the request passed, so the reply crosses all three links without a single ARP. R2 forwards it with its route S 192.168.1.0/24 via 192.168.12.1, and PC1 shows the reply with TTL=126.",
        hi: "PC2 ek naya packet bhejta hai, 192.168.2.10 → 192.168.1.10, aur TTL phir se 128 se shuru hota hai. Request ke guzarte waqt har device ne zaroori MAC seekh liya tha, isliye reply teeno links bina ek bhi ARP ke paar kar leta hai. R2 ise apne route S 192.168.1.0/24 via 192.168.12.1 se forward karta hai, aur PC1 par reply TTL=126 ke saath dikhta hai.",
      },
      packets: [
        { path: ["pc2", "sw2", "r2"], label: "Reply · TTL 128", tone: "green" },
        { path: ["r2", "r1"], label: "Reply · TTL 127", tone: "green", delay: 2 },
        { path: ["r1", "sw1", "pc1"], label: "Reply · TTL 126", tone: "green", delay: 3 },
      ],
      badges: [{ node: "pc1", text: "TTL=126", tone: "green" }],
      tables: [
        { node: "pc1", title: echoTitle, columns: hopCols, rows: [] },
        {
          node: "pc2",
          title: replyTitle,
          columns: hopCols,
          rows: [
            ["PC2 → R2", "0050.56aa.0002", "0022.2222.0000", "128"],
            ["R2 → R1", "0022.2222.0001", "0011.1111.0001", "127"],
            ["R1 → PC1", "0011.1111.0000", "0050.56aa.0001", "126"],
          ],
          hl: [0, 1, 2],
        },
      ],
    },
    {
      title: { en: "No route back: the reply dies at R2", hi: "Wapas ka route nahi: reply R2 par khatam" },
      text: {
        en: "Now delete R2's route to 192.168.1.0/24 and ping again. The request still reaches PC2, because R1's route is fine, but R2 has no route for the reply and drops it. R2 sends ICMP Destination Unreachable to the reply's source, PC2, so PC1 hears nothing and shows Request timed out: routing has to work in both directions.",
        hi: "Ab R2 ka 192.168.1.0/24 wala route delete karo aur dobara ping karo. Request ab bhi PC2 tak pahunchti hai, kyunki R1 ka route theek hai, lekin R2 ke paas reply ke liye route nahi hai, toh woh use drop kar deta hai. R2 ICMP Destination Unreachable reply ke source yaani PC2 ko bhejta hai, isliye PC1 tak kuch nahi aata aur use bas Request timed out dikhta hai: routing dono directions mein kaam karni chahiye.",
      },
      focus: ["r2"],
      packets: [
        { path: ["pc1", "sw1", "r1"], label: "Echo · TTL 128", tone: "blue" },
        { path: ["r1", "r2"], label: "Echo · TTL 127", tone: "blue", delay: 2 },
        { path: ["r2", "sw2", "pc2"], label: "Echo · TTL 126", tone: "blue", delay: 3 },
        { path: ["pc2", "sw2", "r2"], label: "Reply · TTL 128", tone: "green", delay: 5, drop: true },
        { path: ["r2", "sw2", "pc2"], label: "Unreachable", tone: "pink", delay: 7 },
      ],
      badges: [
        { node: "pc1", text: "timed out", tone: "red" },
        { node: "r2", text: "no route back", tone: "red" },
      ],
      tables: [
        { node: "pc2", title: replyTitle, columns: hopCols, rows: [] },
        {
          node: "r2",
          title: "R2 routing table",
          columns: rtCols,
          rows: [
            ["C", "192.168.2.0/24", "Gi0/0"],
            ["C", "192.168.12.0/30", "Gi0/1"],
          ],
        },
      ],
    },
  ],
};

export default scene;
