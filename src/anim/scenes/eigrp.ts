import type { TopologyScene } from "../types.ts";

// The diamond from src/content/lessons/eigrp.ts. Classic-mode EIGRP AS 100, default K-values (K1 = K3 = 1).
//   R1 Gi0/0 10.0.12.1 -- R2 Gi0/0 10.0.12.2  (1 Gbps: BW 10, delay 1)
//   R1 Fa0/1 10.0.13.1 -- R3 Fa0/0 10.0.13.2  (100 Mbps: BW 100, delay 10)
//   R2 Gi0/1 -- R4 Gi0/0, R3 Gi0/1 -- R4 Gi0/1 (1 Gbps)
//   LANs: R2 Gi0/2 10.2.2.0/24, R4 Gi0/2 10.4.4.0/24
// Metrics at R1:
//   10.4.4.0/24 via R2 3328 (RD 3072) successor; via R3 28672 (RD 3072) feasible successor
//   10.2.2.0/24 via R2 3072 (RD 2816) successor; via R3 28928 (RD 3328) fails the feasibility condition
// Colours: purple = Hello, teal = Update, orange = Query, green = Reply, blue = user data.

const scene: TopologyScene = {
  kind: "topology",
  id: "eigrp",
  title: { en: "EIGRP DUAL: a feasible successor takes over, or the router queries", hi: "EIGRP DUAL: feasible successor turant takeover karta hai, warna router query karta hai" },
  height: 420,
  nodes: [
    { id: "r1", kind: "router", x: 130, y: 200, label: "R1", sub: "RID 1.1.1.1" },
    { id: "r2", kind: "router", x: 400, y: 90, label: "R2", sub: "LAN 10.2.2.0/24", sub2: "Gi0/0 10.0.12.2" },
    { id: "r3", kind: "router", x: 400, y: 310, label: "R3", sub: "Fa0/0 10.0.13.2" },
    { id: "r4", kind: "router", x: 670, y: 200, label: "R4", sub: "LAN 10.4.4.0/24" },
  ],
  links: [
    { id: "l12", a: "r1", b: "r2", aPort: "Gi0/0", bPort: "Gi0/0", label: "1 Gbps" },
    { id: "l13", a: "r1", b: "r3", aPort: "Fa0/1", bPort: "Fa0/0", label: "100 Mbps" },
    { id: "l24", a: "r2", b: "r4", aPort: "Gi0/1", bPort: "Gi0/0", label: "1 Gbps" },
    { id: "l34", a: "r3", b: "r4", aPort: "Gi0/1", bPort: "Gi0/1", label: "1 Gbps" },
  ],
  steps: [
    {
      title: { en: "Hellos to 224.0.0.10 form neighbours", hi: "224.0.0.10 par Hellos se neighbours bante hain" },
      text: {
        en: "Every router sends Hellos to 224.0.0.10 out of each EIGRP interface every 5 seconds. Both ends of each link use AS 100 and the same K-values, so all four links form neighbourships. R1 lists R2 on Gi0/0 and R3 on Fa0/1, with a hold time counting down from 15.",
        hi: "Har router apne har EIGRP interface se har 5 second mein 224.0.0.10 par Hellos bhejta hai. Har link ke dono ends par AS 100 aur same K-values hain, isliye chaaron links par neighbourship ban jaati hai. R1 ki list mein R2 Gi0/0 par aur R3 Fa0/1 par hai, hold time 15 se neeche girta hua.",
      },
      packets: [
        { path: ["r1", "r2"], label: "Hello", tone: "purple" },
        { path: ["r2", "r1"], label: "Hello", tone: "purple" },
        { path: ["r1", "r3"], label: "Hello", tone: "purple" },
        { path: ["r3", "r1"], label: "Hello", tone: "purple" },
        { path: ["r2", "r4"], label: "Hello", tone: "purple" },
        { path: ["r4", "r2"], label: "Hello", tone: "purple" },
        { path: ["r3", "r4"], label: "Hello", tone: "purple" },
        { path: ["r4", "r3"], label: "Hello", tone: "purple" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 neighbours",
          columns: ["Address", "Interface", "Hold"],
          rows: [
            ["10.0.12.2", "Gi0/0", "14"],
            ["10.0.13.2", "Fa0/1", "13"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "R4 advertises 10.4.4.0/24", hi: "R4 10.4.4.0/24 advertise karta hai" },
      text: {
        en: "R4's own metric to its LAN is 256 x (10 + 1) = 2816: Gigabit bandwidth gives 10, one 10 usec delay gives 1. It sends that in an Update to R2 and R3. Each adds the delay of the Gigabit interface it heard it on: 256 x (10 + 2) = 3072.",
        hi: "R4 ka apne LAN tak metric 256 x (10 + 1) = 2816 hai: Gigabit bandwidth se 10, ek 10 usec delay se 1. Yahi woh Update mein R2 aur R3 ko bhejta hai. Dono jis Gigabit interface par Update suna, uska delay jodte hain: 256 x (10 + 2) = 3072.",
      },
      focus: ["r4"],
      packets: [
        { path: ["r4", "r2"], label: "Update 2816", tone: "teal" },
        { path: ["r4", "r3"], label: "Update 2816", tone: "teal" },
      ],
      badges: [
        { node: "r2", text: "metric 3072", tone: "teal" },
        { node: "r3", text: "metric 3072", tone: "teal" },
      ],
      tables: [{ node: "r1", title: "R1 neighbours", columns: ["Address", "Interface", "Hold"], rows: [] }],
    },
    {
      title: { en: "R1 hears RD 3072 from both sides", hi: "R1 ko dono taraf se RD 3072 milta hai" },
      text: {
        en: "R2 and R3 each tell R1 \"my distance is 3072\": that is their reported distance (RD). R1 adds its own link. Via R2 (Gi0/0): 256 x (10 + 3) = 3328. Via R3 (Fa0/1): the 100 Mbps link sets bandwidth to 100 and adds 100 usec, so 256 x (100 + 12) = 28672.",
        hi: "R2 aur R3 dono R1 ko bolte hain \"meri doori 3072 hai\": yeh unka reported distance (RD) hai. R1 apna link jodta hai. R2 ke through (Gi0/0): 256 x (10 + 3) = 3328. R3 ke through (Fa0/1): 100 Mbps link bandwidth ko 100 kar deta hai aur 100 usec jodta hai, toh 256 x (100 + 12) = 28672.",
      },
      focus: ["r1"],
      packets: [
        { path: ["r2", "r1"], label: "Update 3072", tone: "teal" },
        { path: ["r3", "r1"], label: "Update 3072", tone: "teal" },
      ],
      badges: [
        { node: "r2", text: "" },
        { node: "r3", text: "" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 topology 10.4.4.0/24",
          columns: ["Neighbour", "Metric/RD", "Role"],
          rows: [
            ["R2 10.0.12.2", "3328/3072", "?"],
            ["R3 10.0.13.2", "28672/3072", "?"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Successor, FD and the feasibility check", hi: "Successor, FD aur feasibility check" },
      text: {
        en: "The lowest metric, 3328 via R2, becomes the feasible distance (FD) and R2 the successor; R1 installs D 10.4.4.0/24 [90/3328] via 10.0.12.2. Then R3's RD is tested: 3072 < 3328, so R3 is closer to the LAN than R1 and cannot be routing back through R1. R3 becomes the feasible successor.",
        hi: "Sabse kam metric, R2 ke through 3328, feasible distance (FD) banta hai aur R2 successor; R1 D 10.4.4.0/24 [90/3328] via 10.0.12.2 install karta hai. Phir R3 ka RD test hota hai: 3072 < 3328, matlab R3 LAN ke R1 se zyada paas hai aur R1 se hokar wapas route nahi kar raha ho sakta. R3 feasible successor ban jaata hai.",
      },
      focus: ["r1", "r3"],
      badges: [
        { node: "r2", text: "successor", tone: "green" },
        { node: "r3", text: "FS", tone: "teal" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 topology 10.4.4.0/24",
          columns: ["Neighbour", "Metric/RD", "Role"],
          rows: [
            ["R2 10.0.12.2", "3328/3072", "Successor, FD"],
            ["R3 10.0.13.2", "28672/3072", "FS: 3072 < 3328"],
          ],
          hl: [0, 1],
        },
        {
          node: "r1",
          title: "R1 routes",
          columns: ["Code", "Prefix", "AD/metric", "Next hop"],
          rows: [["D", "10.4.4.0/24", "90/3328", "10.0.12.2"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "10.2.2.0/24: R3 fails the check", hi: "10.2.2.0/24: R3 check fail karta hai" },
      text: {
        en: "R2 advertises its own LAN with 2816, so R1's FD for 10.2.2.0/24 is 256 x (10 + 2) = 3072. R3 learns the same LAN the long way, R4 then R2, and reports 3328. 3328 is not lower than 3072, so R3 is not a feasible successor, even though its path is loop-free. R1 has no backup for this prefix.",
        hi: "R2 apna LAN 2816 ke saath advertise karta hai, toh 10.2.2.0/24 ke liye R1 ka FD 256 x (10 + 2) = 3072 hai. R3 yahi LAN lambe raaste se seekhta hai, R4 phir R2, aur 3328 report karta hai. 3328, 3072 se kam nahi hai, toh R3 feasible successor nahi hai, chahe uska path loop-free ho. Is prefix ke liye R1 ke paas koi backup nahi.",
      },
      focus: ["r1", "r3"],
      packets: [
        { path: ["r2", "r1"], label: "Update 2816", tone: "teal" },
        { path: ["r2", "r4"], label: "Update 2816", tone: "teal" },
        { path: ["r4", "r3"], label: "Update 3072", tone: "teal", delay: 1 },
        { path: ["r3", "r1"], label: "Update 3328", tone: "teal", delay: 2 },
      ],
      badges: [{ node: "r3", text: "FS for 10.4.4 only", tone: "teal" }],
      tables: [
        {
          node: "r1",
          title: "R1 topology 10.2.2.0/24",
          columns: ["Neighbour", "Metric/RD", "Role"],
          rows: [
            ["R2 10.0.12.2", "3072/2816", "Successor, FD"],
            ["R3 10.0.13.2", "28928/3328", "fails: 3328 >= 3072"],
          ],
          hl: [0, 1],
        },
        {
          node: "r1",
          title: "R1 routes",
          columns: ["Code", "Prefix", "AD/metric", "Next hop"],
          rows: [
            ["D", "10.2.2.0/24", "90/3072", "10.0.12.2"],
            ["D", "10.4.4.0/24", "90/3328", "10.0.12.2"],
          ],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "Link to R2 fails: the FS takes over", hi: "R2 wala link fail: FS takeover karta hai" },
      text: {
        en: "R1's Gi0/0 goes down and neighbour 10.0.12.2 is lost, so both successors are gone. For 10.4.4.0/24, R3 was already proven loop-free: R1 promotes it at once, asks nobody, and the route stays passive. The routing table now shows D 10.4.4.0/24 [90/28672] via 10.0.13.2, and the next packet to 10.4.4.10 goes R1, R3, R4, while 10.2.2.0/24, with no backup, drops out of the table.",
        hi: "R1 ka Gi0/0 down hota hai aur neighbour 10.0.12.2 chala jaata hai, toh dono successors gaye. 10.4.4.0/24 ke liye R3 pehle se loop-free proven tha: R1 use turant promote karta hai, kisi se poochta nahi, aur route passive hi rehta hai. Routing table mein ab D 10.4.4.0/24 [90/28672] via 10.0.13.2 hai, aur 10.4.4.10 ka agla packet R1, R3, R4 se jaata hai, jabki 10.2.2.0/24 ka koi backup nahi, isliye woh table se hat jaata hai.",
      },
      focus: ["r1", "r3"],
      links: [{ id: "l12", state: "down", note: "Gi0/0 down" }],
      packets: [{ path: ["r1", "r3", "r4"], label: "to 10.4.4.10", tone: "blue" }],
      badges: [
        { node: "r2", text: "" },
        { node: "r3", text: "successor", tone: "green" },
        { node: "r1", text: "10.4.4: passive", tone: "green" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 topology 10.4.4.0/24",
          columns: ["Neighbour", "Metric/RD", "Role"],
          rows: [["R3 10.0.13.2", "28672/3072", "Successor (was FS)"]],
          hl: [0],
        },
        {
          node: "r1",
          title: "R1 topology 10.2.2.0/24",
          columns: ["Neighbour", "Metric/RD", "Role"],
          rows: [
            ["R2 10.0.12.2", "-", "lost: link down"],
            ["R3 10.0.13.2", "28928/3328", "not an FS"],
          ],
          hl: [0],
        },
        {
          node: "r1",
          title: "R1 routes",
          columns: ["Code", "Prefix", "AD/metric", "Next hop"],
          rows: [["D", "10.4.4.0/24", "90/28672", "10.0.13.2"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "No FS for 10.2.2.0/24: go active, query", hi: "10.2.2.0/24 ka FS nahi: active, query" },
      text: {
        en: "For 10.2.2.0/24 there is no feasible successor, so R1 cannot prove R3's path is safe. DUAL marks the route active (A) and sends a Query for 10.2.2.0/24 to every remaining neighbour, here only R3. R1 has no route to 10.2.2.0/24 until the reply comes back.",
        hi: "10.2.2.0/24 ke liye koi feasible successor nahi hai, toh R1 prove nahi kar sakta ki R3 ka path safe hai. DUAL route ko active (A) mark karta hai aur bache hue har neighbour ko, yahan sirf R3 ko, 10.2.2.0/24 ke liye Query bhejta hai. Reply aane tak R1 ke paas 10.2.2.0/24 ka koi route nahi.",
      },
      focus: ["r1"],
      packets: [{ path: ["r1", "r3"], label: "Query 10.2.2.0", tone: "orange" }],
      badges: [{ node: "r1", text: "A 10.2.2.0/24", tone: "orange" }],
      tables: [
        {
          node: "r1",
          title: "R1 topology 10.2.2.0/24",
          columns: ["Neighbour", "Metric/RD", "Role"],
          rows: [["R3 10.0.13.2", "?", "query sent"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "R3 answers with its own path", hi: "R3 apne path ke saath jawab deta hai" },
      text: {
        en: "R3's successor for 10.2.2.0/24 is R4, not R1, so losing R1's path changes nothing for R3. It sends a Reply straight away with its metric, 3328. If R3 had also depended on R1, it would go active too and query R4 before answering: that is how a query diffuses.",
        hi: "10.2.2.0/24 ke liye R3 ka successor R4 hai, R1 nahi, toh R1 ka path jaane se R3 ke liye kuch nahi badalta. Woh turant apne metric 3328 ke saath Reply bhejta hai. Agar R3 bhi R1 par depend karta, toh woh bhi active hota aur jawab dene se pehle R4 se query karta: query aise hi diffuse hoti hai.",
      },
      focus: ["r3"],
      packets: [{ path: ["r3", "r1"], label: "Reply 3328", tone: "green" }],
      badges: [{ node: "r3", text: "succ. via R4", tone: "gray" }],
      tables: [
        {
          node: "r1",
          title: "R1 topology 10.2.2.0/24",
          columns: ["Neighbour", "Metric/RD", "Role"],
          rows: [["R3 10.0.13.2", "28928/3328", "reply received"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "Passive again via R3", hi: "R3 ke through phir passive" },
      text: {
        en: "Every query has its reply, so R1 picks the best answer: 256 x (100 + 13) = 28928 via R3. The route returns to passive with FD 28928 and D 10.2.2.0/24 [90/28928] via 10.0.13.2 goes into the routing table. Traffic to 10.2.2.10 now runs R1, R3, R4, R2.",
        hi: "Har query ka reply aa gaya, toh R1 best jawab chunta hai: R3 ke through 256 x (100 + 13) = 28928. Route FD 28928 ke saath wapas passive ho jaata hai aur D 10.2.2.0/24 [90/28928] via 10.0.13.2 routing table mein jaata hai. 10.2.2.10 ka traffic ab R1, R3, R4, R2 se chalta hai.",
      },
      focus: ["r1"],
      packets: [{ path: ["r1", "r3", "r4", "r2"], label: "to 10.2.2.10", tone: "blue" }],
      badges: [
        { node: "r1", text: "all passive", tone: "green" },
        { node: "r3", text: "successor", tone: "green" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1 topology 10.2.2.0/24",
          columns: ["Neighbour", "Metric/RD", "Role"],
          rows: [["R3 10.0.13.2", "28928/3328", "Successor, FD"]],
          hl: [0],
        },
        {
          node: "r1",
          title: "R1 routes",
          columns: ["Code", "Prefix", "AD/metric", "Next hop"],
          rows: [
            ["D", "10.2.2.0/24", "90/28928", "10.0.13.2"],
            ["D", "10.4.4.0/24", "90/28672", "10.0.13.2"],
          ],
          hl: [0],
        },
      ],
    },
  ],
};

export default scene;
