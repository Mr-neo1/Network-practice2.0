import type { Lesson } from "../types.ts";

// Topology used throughout (matches src/anim/scenes/eigrp.ts), classic-mode EIGRP AS 100, default K-values:
//   R1 Gi0/0 10.0.12.1/30 -- R2 Gi0/0 10.0.12.2   (1 Gbps, DLY 10 usec)
//   R1 Fa0/1 10.0.13.1/30 -- R3 Fa0/0 10.0.13.2   (100 Mbps, DLY 100 usec)
//   R2 Gi0/1 10.0.24.1/30 -- R4 Gi0/0 10.0.24.2   (1 Gbps)
//   R3 Gi0/1 10.0.34.1/30 -- R4 Gi0/1 10.0.34.2   (1 Gbps)
//   R2 Gi0/2 LAN 10.2.2.0/24, R4 Gi0/2 LAN 10.4.4.0/24, R1 Gi0/2 LAN 10.1.1.0/24
// Metrics seen by R1:
//   10.4.4.0/24 via R2: 256*(10+3)=3328, RD 3072    via R3: 256*(100+12)=28672, RD 3072  -> FS
//   10.2.2.0/24 via R2: 256*(10+2)=3072, RD 2816    via R3: 256*(100+13)=28928, RD 3328  -> not FS

const lesson: Lesson = {
  slug: "eigrp",
  intro: {
    en: "In lesson 3.5 you met EIGRP as Cisco's advanced distance-vector protocol and saw its large metrics, such as 3328. This lesson opens the box: how that number is built, how each router keeps a loop-free backup path ready before anything fails, and what happens when it has none. These ideas (feasible distance, feasibility condition, queries) explain most EIGRP behaviour you will troubleshoot. They go beyond CCNA 200-301 v1.1, which only asks for EIGRP's protocol type, metric inputs and AD, and they are tested on the CCNP exams.",
    hi: "Lesson 3.5 mein tumne EIGRP ko Cisco ke advanced distance-vector protocol ke roop mein dekha, aur 3328 jaise bade metrics bhi. Is lesson mein andar jhaankte hain: yeh number banta kaise hai, har router kuch fail hone se pehle hi loop-free backup path kaise ready rakhta hai, aur backup na ho toh kya hota hai. Yahi ideas (feasible distance, feasibility condition, queries) EIGRP ke zyadatar behaviour ko samjhate hain jo tum troubleshoot karoge. Yeh CCNA 200-301 v1.1 se aage hain, jahan sirf EIGRP ka protocol type, metric inputs aur AD poocha jaata hai, aur CCNP exams mein test hote hain.",
  },
  outcomes: [
    { en: "List what two routers must agree on to become EIGRP neighbours", hi: "Bata sako ki EIGRP neighbours banne ke liye do routers ko kin cheezon par agree karna padta hai" },
    { en: "Calculate the default EIGRP metric from bandwidth and delay", hi: "Bandwidth aur delay se default EIGRP metric calculate kar sako" },
    { en: "Identify the feasible distance, reported distance, successor and feasible successor for a route", hi: "Kisi route ke liye feasible distance, reported distance, successor aur feasible successor pehchaan sako" },
    { en: "Apply the feasibility condition and explain why it prevents loops", hi: "Feasibility condition apply kar sako aur samjha sako ki yeh loops kaise rokti hai" },
    { en: "Predict whether a failure is handled locally or triggers queries", hi: "Predict kar sako ki failure local level par handle hoga ya queries shuru hongi" },
    { en: "Use `variance` for unequal-cost load balancing and read `show ip eigrp topology`", hi: "Unequal-cost load balancing ke liye `variance` use kar sako aur `show ip eigrp topology` padh sako" },
  ],
  sections: [
    {
      id: "neighbours-and-tables",
      heading: { en: "Neighbours and the three tables", hi: "Neighbours aur teen tables" },
      blocks: [
        {
          type: "p",
          text: {
            en: "EIGRP runs directly over IP as **protocol 88**. Each router sends **Hellos** to **224.0.0.10** out of every EIGRP interface, every **5 seconds** on LAN and point-to-point links, with a **hold time of 15 seconds**. If the hold time runs out, the neighbour is declared down. Updates, queries and replies use **RTP (Reliable Transport Protocol)**, so every one of them is acknowledged.",
            hi: "EIGRP seedha IP ke upar **protocol 88** ke roop mein chalta hai. Har router har EIGRP interface se **224.0.0.10** par **Hellos** bhejta hai, LAN aur point-to-point links par har **5 second** mein, aur **hold time 15 second** hota hai. Hold time khatam toh neighbour down. Updates, queries aur replies **RTP (Reliable Transport Protocol)** use karte hain, isliye har ek ka acknowledgement aata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "What must match before two routers become neighbours", hi: "Neighbours banne se pehle kya match hona chahiye" },
          columns: [{ en: "Setting", hi: "Setting" }, { en: "Must match?", hi: "Match zaroori?" }],
          rows: [
            [{ en: "AS number (`router eigrp 100`)", hi: "AS number (`router eigrp 100`)" }, { en: "Yes", hi: "Haan" }],
            [{ en: "K-values (metric weights)", hi: "K-values (metric weights)" }, { en: "Yes; the log says `K-value mismatch`", hi: "Haan; log mein `K-value mismatch` aata hai" }],
            [{ en: "Subnet of the interfaces", hi: "Interfaces ka subnet" }, { en: "Yes", hi: "Haan" }],
            [{ en: "Authentication", hi: "Authentication" }, { en: "Yes, if configured", hi: "Haan, agar configure hai" }],
            [{ en: "Hello and hold timers", hi: "Hello aur hold timers" }, { en: "No; each router uses the hold time its neighbour sends", hi: "Nahi; har router woh hold time use karta hai jo neighbour bhejta hai" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Like OSPF, EIGRP keeps three tables. The **neighbour table** (`show ip eigrp neighbors`) lists adjacent routers. The **topology table** (`show ip eigrp topology`) holds every route each neighbour advertised, with that neighbour's metric. The **routing table** gets only the best ones. The topology table is where EIGRP's speed comes from, so most of this lesson is about it.",
            hi: "OSPF ki tarah EIGRP bhi teen tables rakhta hai. **Neighbour table** (`show ip eigrp neighbors`) mein adjacent routers hain. **Topology table** (`show ip eigrp topology`) mein har neighbour ka advertise kiya har route hai, us neighbour ke metric ke saath. **Routing table** mein sirf best routes jaate hain. EIGRP ki speed topology table se hi aati hai, isliye yeh lesson zyadatar usi ke baare mein hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Our diamond: **R1** connects to **R2** over Gigabit Ethernet (10.0.12.0/30) and to **R3** over an older 100 Mbps FastEthernet link (10.0.13.0/30). R2 and R3 both connect to **R4** over Gigabit links. R4 has the LAN **10.4.4.0/24** and R2 has the LAN **10.2.2.0/24**. Everything runs `router eigrp 100` with default settings.",
            hi: "Hamara diamond: **R1** Gigabit Ethernet par **R2** se juda hai (10.0.12.0/30) aur ek purane 100 Mbps FastEthernet link par **R3** se (10.0.13.0/30). R2 aur R3 dono Gigabit links par **R4** se jude hain. R4 ke paas LAN **10.4.4.0/24** hai aur R2 ke paas LAN **10.2.2.0/24**. Sab par `router eigrp 100` default settings ke saath chal raha hai.",
          },
        },
        {
          type: "cli",
          title: { en: "R1's neighbours", hi: "R1 ke neighbours" },
          lines: [
            { prompt: "R1#", cmd: "show ip eigrp neighbors" },
            { out: "EIGRP-IPv4 Neighbors for AS(100)" },
            { out: "H   Address                 Interface              Hold Uptime   SRTT   RTO  Q  Seq" },
            { out: "                                                   (sec)         (ms)       Cnt Num" },
            { out: "1   10.0.13.2               Fa0/1                    13 00:20:05    2   100  0  21", comment: { en: "R3", hi: "R3" } },
            { out: "0   10.0.12.2               Gi0/0                    11 00:20:09    1   100  0  18", comment: { en: "R2; Hold counts down from 15", hi: "R2; Hold 15 se neeche girta hai" } },
          ],
        },
      ],
    },
    {
      id: "composite-metric",
      heading: { en: "The composite metric", hi: "Composite metric" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The full formula has five weights, K1 to K5, applied to bandwidth, load, delay and reliability. The defaults are **K1 = 1, K3 = 1** and K2 = K4 = K5 = 0, which removes load and reliability and leaves:",
            hi: "Poore formula mein paanch weights hote hain, K1 se K5, jo bandwidth, load, delay aur reliability par lagte hain. Defaults hain **K1 = 1, K3 = 1** aur K2 = K4 = K5 = 0, jisse load aur reliability hat jaate hain aur bachta hai:",
          },
        },
        {
          type: "code",
          lang: "text",
          title: { en: "Default EIGRP metric (classic mode)", hi: "Default EIGRP metric (classic mode)" },
          code: "metric = 256 x ( 10^7 / slowest bandwidth on the path in kbps\n               + sum of delays on the path in tens of microseconds )",
        },
        {
          type: "list",
          items: [
            { en: "**Bandwidth** is the lowest `bandwidth` value (in kbps) of the outgoing interfaces along the path. One slow link limits the whole path.", hi: "**Bandwidth** path ke outgoing interfaces mein sabse kam `bandwidth` value (kbps mein) hai. Ek slow link poore path ko limit kar deta hai." },
            { en: "**Delay** is the sum of the `DLY` values of those interfaces, divided by 10. It is a configured value, not a measured one.", hi: "**Delay** un interfaces ki `DLY` values ka total hai, 10 se divide karke. Yeh configured value hai, measure nahi hoti." },
            { en: "Fractions are dropped, so 10^7 / 1544 for a T1 becomes 6476.", hi: "Fractions hata diye jaate hain, toh T1 ke liye 10^7 / 1544 = 6476." },
          ],
        },
        {
          type: "table",
          caption: { en: "Default bandwidth and delay per interface type", hi: "Har interface type ki default bandwidth aur delay" },
          columns: ["Interface", "BW (kbps)", "DLY", { en: "Metric parts", hi: "Metric parts" }],
          rows: [
            ["GigabitEthernet", "1000000", "10 usec", { en: "BW 10, delay 1", hi: "BW 10, delay 1" }],
            ["FastEthernet", "100000", "100 usec", { en: "BW 100, delay 10", hi: "BW 100, delay 10" }],
            [{ en: "Serial (T1)", hi: "Serial (T1)" }, "1544", "20000 usec", { en: "BW 6476, delay 2000", hi: "BW 6476, delay 2000" }],
          ],
        },
        {
          type: "steps",
          items: [
            {
              en: "R1 to 10.4.4.0/24 **via R2**: the interfaces are R1 Gi0/0, R2 Gi0/1 and R4 Gi0/2 (the LAN). Slowest bandwidth 1 Gbps gives 10. Delays 10 + 10 + 10 = 30 usec give 3. Metric = 256 x (10 + 3) = **3328**.",
              hi: "R1 se 10.4.4.0/24 **R2 ke through**: interfaces hain R1 Gi0/0, R2 Gi0/1 aur R4 Gi0/2 (LAN). Sabse slow bandwidth 1 Gbps, toh 10. Delays 10 + 10 + 10 = 30 usec, toh 3. Metric = 256 x (10 + 3) = **3328**.",
            },
            {
              en: "R1 to 10.4.4.0/24 **via R3**: R1 Fa0/1, R3 Gi0/1, R4 Gi0/2. Slowest bandwidth 100 Mbps gives 100. Delays 100 + 10 + 10 = 120 usec give 12. Metric = 256 x (100 + 12) = **28672**.",
              hi: "R1 se 10.4.4.0/24 **R3 ke through**: R1 Fa0/1, R3 Gi0/1, R4 Gi0/2. Sabse slow bandwidth 100 Mbps, toh 100. Delays 100 + 10 + 10 = 120 usec, toh 12. Metric = 256 x (100 + 12) = **28672**.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "Where the inputs come from", hi: "Inputs kahan se aate hain" },
          lines: [
            { prompt: "R1#", cmd: "show interfaces FastEthernet0/1 | include BW" },
            { out: "  MTU 1500 bytes, BW 100000 Kbit/sec, DLY 100 usec," },
            { prompt: "R1#", cmd: "show ip protocols | include K1" },
            { out: "    Metric weight K1=1, K2=0, K3=1, K4=0, K5=0" },
          ],
          note: {
            en: "The `bandwidth` and `delay` interface commands change these values, and so change EIGRP's choice. `delay` is entered in tens of microseconds: `delay 10` means 100 usec. Named-mode EIGRP on newer IOS uses 64-bit wide metrics, so its numbers look different; this lesson uses classic mode.",
            hi: "Interface par `bandwidth` aur `delay` commands in values ko badalte hain, aur isse EIGRP ki choice bhi badalti hai. `delay` tens of microseconds mein diya jaata hai: `delay 10` matlab 100 usec. Naye IOS par named-mode EIGRP 64-bit wide metrics use karta hai, isliye uske numbers alag dikhte hain; yeh lesson classic mode use karta hai.",
          },
        },
      ],
    },
    {
      id: "fd-rd-successor",
      heading: { en: "FD, RD, successor and feasible successor", hi: "FD, RD, successor aur feasible successor" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every neighbour tells R1 its own metric to the destination. R1 adds the cost of reaching that neighbour and gets its own total. Four words describe the result:",
            hi: "Har neighbour R1 ko destination tak apna metric batata hai. R1 us neighbour tak pahunchne ki cost jodta hai aur apna total nikalta hai. Result ko chaar terms se describe karte hain:",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Reported distance (RD)**, also called advertised distance: the neighbour's own metric to the destination, as it advertised it. R2 reports 3072 for 10.4.4.0/24 (256 x (10 + 2)).", hi: "**Reported distance (RD)**, jise advertised distance bhi kehte hain: neighbour ka apna metric destination tak, jaisa usne advertise kiya. R2 10.4.4.0/24 ke liye 3072 report karta hai (256 x (10 + 2))." },
            { en: "**Feasible distance (FD)**: R1's own metric of its best path to the destination. Here 3328.", hi: "**Feasible distance (FD)**: destination tak R1 ke best path ka R1 ka apna metric. Yahan 3328." },
            { en: "**Successor**: the neighbour on the best path. Its route goes in the routing table. Here R2.", hi: "**Successor**: best path wala neighbour. Iska route routing table mein jaata hai. Yahan R2." },
            { en: "**Feasible successor (FS)**: a backup neighbour that passes the feasibility condition. It waits in the topology table, ready to take over. Here R3.", hi: "**Feasible successor (FS)**: backup neighbour jo feasibility condition pass karta hai. Topology table mein ready baitha rehta hai, takeover ke liye. Yahan R3." },
          ],
        },
        {
          type: "table",
          caption: { en: "R1's view of 10.4.4.0/24", hi: "10.4.4.0/24 ke liye R1 ka view" },
          columns: [{ en: "Neighbour", hi: "Neighbour" }, { en: "R1's metric via it", hi: "Iske through R1 ka metric" }, "RD", { en: "Role", hi: "Role" }],
          rows: [
            ["R2 (10.0.12.2)", "3328 (= FD)", "3072", "Successor"],
            ["R3 (10.0.13.2)", "28672", "3072", { en: "Feasible successor: 3072 < 3328", hi: "Feasible successor: 3072 < 3328" }],
          ],
        },
        {
          type: "cli",
          title: { en: "The same thing on R1", hi: "Yahi cheez R1 par" },
          lines: [
            { prompt: "R1#", cmd: "show ip eigrp topology" },
            { out: "EIGRP-IPv4 Topology Table for AS(100)/ID(1.1.1.1)" },
            { out: "Codes: P - Passive, A - Active, U - Update, Q - Query, R - Reply," },
            { out: "       r - reply Status, s - sia Status" },
            { out: "P 10.4.4.0/24, 1 successors, FD is 3328", comment: { en: "P = passive: stable, nothing to compute", hi: "P = passive: stable, kuch compute nahi karna" } },
            { out: "        via 10.0.12.2 (3328/3072), GigabitEthernet0/0", comment: { en: "Successor: (R1's metric / RD)", hi: "Successor: (R1 ka metric / RD)" } },
            { out: "        via 10.0.13.2 (28672/3072), FastEthernet0/1", comment: { en: "Feasible successor", hi: "Feasible successor" } },
            { out: "P 10.2.2.0/24, 1 successors, FD is 3072" },
            { out: "        via 10.0.12.2 (3072/2816), GigabitEthernet0/0", comment: { en: "No second line: R3 is not an FS here", hi: "Doosri line nahi: yahan R3 FS nahi hai" } },
          ],
          note: {
            en: "`show ip eigrp topology` lists only successors and feasible successors. `show ip eigrp topology all-links` also shows paths that fail the feasibility condition, such as `via 10.0.13.2 (28928/3328)` for 10.2.2.0/24.",
            hi: "`show ip eigrp topology` sirf successors aur feasible successors dikhata hai. `show ip eigrp topology all-links` woh paths bhi dikhata hai jo feasibility condition fail karte hain, jaise 10.2.2.0/24 ke liye `via 10.0.13.2 (28928/3328)`.",
          },
        },
      ],
    },
    {
      id: "feasibility-condition",
      heading: { en: "The feasibility condition: why RD < FD means no loop", hi: "Feasibility condition: RD < FD ka matlab loop nahi" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The rule is short: **a neighbour is a feasible successor only if its RD is lower than the current FD**. The reasoning is what matters. If R3's distance to 10.4.4.0/24 (3072) is lower than R1's own best distance (3328), then R3 is strictly closer to the destination than R1 is. R3's path cannot pass back through R1, because then R3's distance would be at least R1's distance plus the R3-to-R1 link. So sending traffic to R3 can never loop back to R1.",
            hi: "Rule chhota hai: **neighbour feasible successor tabhi hai jab uska RD current FD se kam ho**. Asli baat iska reason hai. Agar 10.4.4.0/24 tak R3 ki doori (3072) R1 ki apni best doori (3328) se kam hai, toh R3 destination ke R1 se zyada paas hai. R3 ka path wapas R1 se hokar nahi ja sakta, kyunki tab R3 ki doori kam se kam R1 ki doori plus R3-R1 link jitni hoti. Isliye R3 ko traffic bhejna kabhi R1 par loop hokar wapas nahi aayega.",
          },
        },
        {
          type: "p",
          text: {
            en: "Now look at 10.2.2.0/24, R2's own LAN. Via R2, R1's metric is 3072 (FD) and R2 reports 2816. R3 reaches 10.2.2.0/24 through R4 and R2 and reports 3328. Since 3328 is **not** lower than 3072, R3 fails the check. R1 cannot prove that R3's path avoids R1, so it does not keep R3 as a backup.",
            hi: "Ab 10.2.2.0/24 dekho, R2 ka apna LAN. R2 ke through R1 ka metric 3072 (FD) hai aur R2 2816 report karta hai. R3 10.2.2.0/24 tak R4 aur R2 se hokar pahunchta hai aur 3328 report karta hai. 3328, 3072 se kam **nahi** hai, toh R3 check fail karta hai. R1 prove nahi kar sakta ki R3 ka path R1 se nahi guzarta, isliye woh R3 ko backup nahi rakhta.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Failing the check does not mean a loop", hi: "Check fail hone ka matlab loop nahi" },
          text: {
            en: "R3's path to 10.2.2.0/24 (R3, R4, R2) is perfectly loop-free. The feasibility condition is conservative: it is sufficient to prove there is no loop, not necessary. It rejects some good paths so that it never accepts a bad one. Equal is not enough either: an RD equal to the FD fails.",
            hi: "10.2.2.0/24 tak R3 ka path (R3, R4, R2) bilkul loop-free hai. Feasibility condition conservative hai: yeh loop na hone ka proof dene ke liye kaafi hai, lekin zaroori nahi. Yeh kuch achhe paths reject karti hai taaki kabhi galat path accept na ho. Barabar bhi kaafi nahi: RD agar FD ke barabar ho toh fail.",
          },
        },
      ],
    },
    {
      id: "dual-active-passive",
      heading: { en: "DUAL in action: passive, active and queries", hi: "DUAL in action: passive, active aur queries" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**DUAL (Diffusing Update Algorithm)** decides what happens when a successor is lost. A route that is stable is **passive** (`P`). Suppose R1's Gi0/0 to R2 goes down. R1 logs `%DUAL-5-NBRCHANGE: EIGRP-IPv4 100: Neighbor 10.0.12.2 (GigabitEthernet0/0) is down: interface down` and handles each route that used R2:",
            hi: "**DUAL (Diffusing Update Algorithm)** decide karta hai ki successor chale jaane par kya hoga. Stable route **passive** (`P`) hota hai. Maan lo R1 ka R2 wala Gi0/0 down ho gaya. R1 log karta hai `%DUAL-5-NBRCHANGE: EIGRP-IPv4 100: Neighbor 10.0.12.2 (GigabitEthernet0/0) is down: interface down` aur R2 use karne wale har route ko handle karta hai:",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**10.4.4.0/24 has a feasible successor.** R1 promotes R3 at once, installs `D 10.4.4.0/24 [90/28672] via 10.0.13.2` and tells its neighbours about the new metric. No questions asked: this is a local computation, and the route stays passive.",
              hi: "**10.4.4.0/24 ka feasible successor hai.** R1 turant R3 ko promote karta hai, `D 10.4.4.0/24 [90/28672] via 10.0.13.2` install karta hai aur neighbours ko naya metric bata deta hai. Koi sawaal nahi: yeh local computation hai, aur route passive hi rehta hai.",
            },
            {
              en: "**10.2.2.0/24 has no feasible successor.** R1 marks the route **active** (`A`) and sends a **Query** for 10.2.2.0/24 to every remaining neighbour, here R3. The route stays out of service until the answers come back.",
              hi: "**10.2.2.0/24 ka koi feasible successor nahi.** R1 route ko **active** (`A`) mark karta hai aur bache hue har neighbour ko, yahan R3 ko, 10.2.2.0/24 ke liye **Query** bhejta hai. Jawab aane tak route kaam nahi karta.",
            },
            {
              en: "R3 checks its own table. Its successor for 10.2.2.0/24 is R4, not R1, so the loss of R1's path does not affect it. It sends a **Reply** at once with its metric, 3328.",
              hi: "R3 apni table dekhta hai. 10.2.2.0/24 ke liye uska successor R4 hai, R1 nahi, toh R1 ke path ke jaane se use koi farak nahi padta. Woh turant apne metric 3328 ke saath **Reply** bhejta hai.",
            },
            {
              en: "With all replies in, R1 picks the best: via R3, 256 x (100 + 13) = 28928. The route goes back to passive with FD 28928.",
              hi: "Saare replies aane ke baad R1 best chunta hai: R3 ke through, 256 x (100 + 13) = 28928. Route wapas passive ho jaata hai, FD 28928 ke saath.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "If a queried neighbour also has no feasible successor, it goes active too and queries its own neighbours. That is the \"diffusing\" part: the query spreads until routers can answer. If a reply never arrives, the route becomes **stuck in active (SIA)**; by default after 3 minutes the router resets the neighbour that did not answer. **Summarisation** and **EIGRP stub routers** (`eigrp stub`) limit how far queries spread: a router that only knows a summary has no entry for the lost prefix, so it replies \"unreachable\" at once instead of querying further, and stub routers are not queried at all.",
            hi: "Agar query paane wale neighbour ke paas bhi feasible successor nahi, toh woh bhi active hota hai aur apne neighbours se poochta hai. Yahi \"diffusing\" wala hissa hai: query tab tak failti hai jab tak routers jawab na de sakein. Reply kabhi na aaye toh route **stuck in active (SIA)** ho jaata hai; default 3 minute baad router us neighbour ko reset kar deta hai jisne jawab nahi diya. **Summarisation** aur **EIGRP stub routers** (`eigrp stub`) queries ko door tak failne se rokte hain: jis router ko sirf summary pata hai, uske paas us prefix ki entry hi nahi, toh woh aage query karne ki jagah turant \"unreachable\" reply kar deta hai, aur stub routers ko query bheji hi nahi jaati.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Where the speed comes from", hi: "Speed kahan se aati hai" },
          text: {
            en: "With a feasible successor, EIGRP converges in about the time it takes to notice the failure, because the backup was already proven loop-free. Without one, it has to ask and wait. When you design EIGRP, you want feasible successors for important prefixes.",
            hi: "Feasible successor ho toh EIGRP lagbhag utne hi time mein converge hota hai jitna failure detect karne mein lagta hai, kyunki backup pehle se loop-free proven tha. Na ho toh poochna aur wait karna padta hai. EIGRP design karte waqt important prefixes ke liye feasible successors chahiye.",
          },
        },
      ],
    },
    {
      id: "variance-and-ad",
      heading: { en: "Unequal-cost load balancing, AD and route codes", hi: "Unequal-cost load balancing, AD aur route codes" },
      blocks: [
        {
          type: "p",
          text: {
            en: "OSPF can share traffic only over equal-cost paths. EIGRP can also use unequal-cost paths with **`variance`**. A path is used if it is a **feasible successor** and its metric is **less than variance x FD**. For 10.4.4.0/24, FD is 3328 and R3's path is 28672. 28672 / 3328 is about 8.6, so `variance 9` (limit 29952) adds R3's path; `variance 8` (limit 26624) does not.",
            hi: "OSPF sirf equal-cost paths par traffic baant sakta hai. EIGRP **`variance`** se unequal-cost paths bhi use kar sakta hai. Path tab use hota hai jab woh **feasible successor** ho aur uska metric **variance x FD se kam** ho. 10.4.4.0/24 ke liye FD 3328 hai aur R3 ka path 28672. 28672 / 3328 lagbhag 8.6 hai, toh `variance 9` (limit 29952) R3 ka path jod deta hai; `variance 8` (limit 26624) nahi.",
          },
        },
        {
          type: "cli",
          title: { en: "R1 with variance 9", hi: "variance 9 ke saath R1" },
          lines: [
            { prompt: "R1(config)#", cmd: "router eigrp 100" },
            { prompt: "R1(config-router)#", cmd: "variance 9" },
            { prompt: "R1(config-router)#", cmd: "end" },
            { prompt: "R1#", cmd: "show ip route eigrp | begin 10.4.4.0" },
            { out: "D        10.4.4.0/24 [90/3328] via 10.0.12.2, 00:00:12, GigabitEthernet0/0" },
            { out: "                     [90/28672] via 10.0.13.2, 00:00:12, FastEthernet0/1", comment: { en: "Two paths, different metrics", hi: "Do paths, alag metrics" } },
          ],
          note: {
            en: "Traffic is shared in inverse proportion to the metrics, so most of it still uses R2. 10.2.2.0/24 keeps one path: R3 is not a feasible successor for it, and variance never uses a path that fails the feasibility condition.",
            hi: "Traffic metric ke hisaab se ulta bantta hai: jiska metric kam, use zyada traffic. Isliye zyadatar traffic abhi bhi R2 se jaata hai. 10.2.2.0/24 ka ek hi path rehta hai: uske liye R3 feasible successor nahi hai, aur variance feasibility condition fail karne wala path kabhi use nahi karta.",
          },
        },
        {
          type: "table",
          caption: { en: "EIGRP in the routing table", hi: "Routing table mein EIGRP" },
          columns: [{ en: "Route", hi: "Route" }, "Code", "AD"],
          rows: [
            [{ en: "Internal (learned inside EIGRP)", hi: "Internal (EIGRP ke andar seekha)" }, "D", "90"],
            [{ en: "External (redistributed into EIGRP)", hi: "External (EIGRP mein redistribute kiya)" }, "D EX", "170"],
            [{ en: "Summary, on the router that creates it", hi: "Summary, banane wale router par" }, "D", "5"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Auto-summary is off by default now", hi: "Auto-summary ab default off hai" },
          text: {
            en: "Older IOS summarised EIGRP routes at classful boundaries, which broke networks with discontiguous subnets. From IOS 15.0 onward, `no auto-summary` is the default. For a manual summary, configure it on the outgoing interface, for example `ip summary-address eigrp 100 10.4.0.0 255.255.0.0`.",
            hi: "Purane IOS EIGRP routes ko classful boundaries par summarise kar dete the, jisse discontiguous subnets wale networks toot jaate the. IOS 15.0 se `no auto-summary` default hai. Manual summary outgoing interface par configure karo, jaise `ip summary-address eigrp 100 10.4.0.0 255.255.0.0`.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Reported distance (RD)", def: { en: "A neighbour's own metric to a destination, as it advertised it; also called advertised distance.", hi: "Kisi destination tak neighbour ka apna metric, jaisa usne advertise kiya; ise advertised distance bhi kehte hain." } },
    { term: "Feasible distance (FD)", def: { en: "This router's lowest metric to a destination, through its successor; the bar a backup must beat.", hi: "Destination tak is router ka sabse kam metric, successor ke through; backup ko isse neeche hona padta hai." } },
    { term: "Successor", def: { en: "The neighbour on the best path; its route is installed in the routing table.", hi: "Best path wala neighbour; iska route routing table mein install hota hai." } },
    { term: "Feasible successor", def: { en: "A backup neighbour whose RD is lower than the FD, so it is proven loop-free and can take over at once.", hi: "Backup neighbour jiska RD, FD se kam ho, isliye woh loop-free proven hai aur turant takeover kar sakta hai." } },
    { term: "Feasibility condition", def: { en: "The check RD < FD that a neighbour must pass to become a feasible successor.", hi: "RD < FD wala check jo neighbour ko feasible successor banne ke liye pass karna padta hai." } },
    { term: "DUAL", def: { en: "Diffusing Update Algorithm: chooses successors and feasible successors and runs the query process when none is left.", hi: "Diffusing Update Algorithm: successors aur feasible successors chunta hai, aur koi na bache toh query process chalata hai." } },
    { term: "Active / passive", def: { en: "Passive: the route is stable. Active: the successor was lost with no feasible successor, and the router is querying neighbours.", hi: "Passive: route stable hai. Active: successor gaya aur feasible successor nahi tha, router neighbours se query kar raha hai." } },
    { term: "Variance", def: { en: "A multiplier of the FD; feasible successors with a metric below variance x FD are used for unequal-cost load balancing.", hi: "FD ka multiplier; jin feasible successors ka metric variance x FD se kam ho, woh unequal-cost load balancing mein use hote hain." } },
  ],
  commands: [
    { cmd: "router eigrp 100", mode: "Global configuration", does: { en: "Start classic-mode EIGRP for AS 100", hi: "AS 100 ke liye classic-mode EIGRP start karta hai" } },
    { cmd: "eigrp router-id 1.1.1.1", mode: "Router configuration", does: { en: "Set the EIGRP router ID shown in the topology table header", hi: "EIGRP router ID set karta hai jo topology table ke header mein dikhta hai" } },
    { cmd: "network 10.0.12.0 0.0.0.3", mode: "Router configuration", does: { en: "Enable EIGRP on interfaces inside this wildcard range", hi: "Is wildcard range ke interfaces par EIGRP enable karta hai" } },
    { cmd: "variance 9", mode: "Router configuration", does: { en: "Use feasible successors with metric below 9 x FD as well", hi: "9 x FD se kam metric wale feasible successors ko bhi use karta hai" } },
    { cmd: "metric weights 0 1 0 1 0 0", mode: "Router configuration", does: { en: "Set TOS and K1 to K5; the values shown are the defaults and must match on neighbours", hi: "TOS aur K1 se K5 set karta hai; dikhaye gaye values defaults hain aur neighbours par match hone chahiye" } },
    { cmd: "eigrp stub", mode: "Router configuration", does: { en: "Make a branch router a stub so it is not queried", hi: "Branch router ko stub banata hai taaki usse query na ho" } },
    { cmd: "delay 10", mode: "Interface configuration", does: { en: "Set the interface delay in tens of microseconds (10 = 100 usec)", hi: "Interface delay tens of microseconds mein set karta hai (10 = 100 usec)" } },
    { cmd: "show ip eigrp neighbors", mode: "Privileged EXEC", does: { en: "List neighbours with hold time, uptime and queue count", hi: "Neighbours ko hold time, uptime aur queue count ke saath list karta hai" } },
    { cmd: "show ip eigrp topology", mode: "Privileged EXEC", does: { en: "Show successors and feasible successors with (metric/RD)", hi: "Successors aur feasible successors (metric/RD) ke saath dikhata hai" } },
    { cmd: "show ip eigrp topology all-links", mode: "Privileged EXEC", does: { en: "Also show paths that fail the feasibility condition", hi: "Feasibility condition fail karne wale paths bhi dikhata hai" } },
    { cmd: "show ip protocols", mode: "Privileged EXEC", does: { en: "Show K-values, variance, AS number and networks", hi: "K-values, variance, AS number aur networks dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Calling a neighbour with RD equal to the FD a feasible successor. The condition is strictly lower: RD < FD.",
      hi: "Jis neighbour ka RD, FD ke barabar ho use feasible successor bolna. Condition strictly kam hai: RD < FD.",
    },
    {
      en: "Comparing the backup's total metric with the FD. The test uses the neighbour's **reported** distance, not R1's metric through it (3072, not 28672).",
      hi: "Backup ke total metric ko FD se compare karna. Test neighbour ka **reported** distance use karta hai, uske through R1 ka metric nahi (3072, 28672 nahi).",
    },
    {
      en: "Adding up bandwidths, or using the fastest one. EIGRP uses the slowest bandwidth on the path and the sum of the delays.",
      hi: "Bandwidths ko jodna, ya sabse fast wali lena. EIGRP path ki sabse slow bandwidth aur delays ka total use karta hai.",
    },
    {
      en: "Expecting `variance` to use any path within the multiplier. Only feasible successors qualify.",
      hi: "Yeh expect karna ki `variance` multiplier ke andar ka koi bhi path use karega. Sirf feasible successors qualify karte hain.",
    },
    {
      en: "Thinking Hello and hold timers must match. AS number, K-values, subnet and authentication must; timers need not.",
      hi: "Yeh sochna ki Hello aur hold timers match hone chahiye. AS number, K-values, subnet aur authentication match hone chahiye; timers nahi.",
    },
    {
      en: "Reading `show ip eigrp topology` and concluding that a missing path does not exist. Paths that fail the feasibility condition appear only with `all-links`.",
      hi: "`show ip eigrp topology` dekh kar yeh maan lena ki jo path nahi dikha woh exist nahi karta. Feasibility condition fail karne wale paths sirf `all-links` mein dikhte hain.",
    },
  ],
  recap: [
    { en: "EIGRP: IP protocol 88, Hellos to 224.0.0.10 every 5 s, hold 15 s. AS number, K-values, subnet and authentication must match.", hi: "EIGRP: IP protocol 88, har 5 s mein 224.0.0.10 par Hellos, hold 15 s. AS number, K-values, subnet aur authentication match hone chahiye." },
    { en: "Default metric = 256 x (10^7 / slowest BW in kbps + total delay in tens of usec). Gigabit: 10 and 1; FastEthernet: 100 and 10.", hi: "Default metric = 256 x (10^7 / sabse slow BW kbps mein + total delay tens of usec mein). Gigabit: 10 aur 1; FastEthernet: 100 aur 10." },
    { en: "RD = the neighbour's metric. FD = my best metric. Successor = best neighbour. Feasible successor = a neighbour with RD < FD.", hi: "RD = neighbour ka metric. FD = mera best metric. Successor = best neighbour. Feasible successor = woh neighbour jiska RD < FD." },
    { en: "RD < FD proves the neighbour is closer to the destination, so its path cannot loop back through me.", hi: "RD < FD prove karta hai ki neighbour destination ke zyada paas hai, isliye uska path mere through loop nahi kar sakta." },
    { en: "Successor lost with an FS: instant local switch, route stays passive. Without an FS: route goes active and queries neighbours; SIA after 3 minutes.", hi: "FS ke saath successor gaya: turant local switch, route passive rehta hai. FS ke bina: route active hota hai aur neighbours se query karta hai; 3 minute baad SIA." },
    { en: "`variance N` uses feasible successors with metric < N x FD. AD 90 internal, 170 external, 5 summary.", hi: "`variance N` un feasible successors ko use karta hai jinka metric < N x FD ho. AD 90 internal, 170 external, 5 summary." },
  ],
  quiz: [
    {
      q: {
        en: "A path's slowest link is 10 Mbps (bandwidth 10000 kbps). The outgoing interfaces along it have delays of 1000, 10 and 10 usec. With default K-values, what is the EIGRP metric?",
        hi: "Ek path ka sabse slow link 10 Mbps hai (bandwidth 10000 kbps). Raste ke outgoing interfaces ke delays 1000, 10 aur 10 usec hain. Default K-values ke saath EIGRP metric kya hoga?",
      },
      options: [
        { en: "281600", hi: "281600" },
        { en: "517120", hi: "517120" },
        { en: "282112", hi: "282112" },
        { en: "1102", hi: "1102" },
      ],
      answer: 2,
      explain: {
        en: "Bandwidth part: 10^7 / 10000 = 1000. Delay part: (1000 + 10 + 10) / 10 = 102. Metric = 256 x (1000 + 102) = 282112. 517120 forgets to divide the delay by 10, 281600 counts only the 1000 usec delay, and 1102 forgets the 256.",
        hi: "Bandwidth part: 10^7 / 10000 = 1000. Delay part: (1000 + 10 + 10) / 10 = 102. Metric = 256 x (1000 + 102) = 282112. 517120 mein delay ko 10 se divide karna bhool gaye, 281600 mein sirf 1000 usec wala delay gina, aur 1102 mein 256 bhool gaye.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "R1's FD to 10.9.9.0/24 is 3328 via its successor. Neighbour A advertises RD 3072 (R1's metric via A: 28672). Neighbour B advertises RD 3328 (R1's metric via B: 5120). Which neighbours are feasible successors?",
        hi: "10.9.9.0/24 ke liye successor ke through R1 ka FD 3328 hai. Neighbour A RD 3072 advertise karta hai (A ke through R1 ka metric: 28672). Neighbour B RD 3328 advertise karta hai (B ke through R1 ka metric: 5120). Kaunse neighbours feasible successors hain?",
      },
      options: [
        { en: "Only A", hi: "Sirf A" },
        { en: "Only B", hi: "Sirf B" },
        { en: "Both A and B", hi: "A aur B dono" },
        { en: "Neither", hi: "Koi nahi" },
      ],
      answer: 0,
      explain: {
        en: "The test compares each neighbour's RD with the FD. A's RD 3072 is below 3328, so A qualifies even though R1's metric through A is large. B's RD of 3328 equals the FD, and the condition is strictly lower, so B fails despite its lower total metric.",
        hi: "Test har neighbour ke RD ko FD se compare karta hai. A ka RD 3072 hai jo 3328 se kam hai, toh A qualify karta hai, chahe A ke through R1 ka metric bada ho. B ka RD 3328 FD ke barabar hai, aur condition strictly kam ki hai, toh B fail karta hai, uska total metric kam hone ke bawajood.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "`show ip eigrp topology` on R1 lists only one `via` line for 10.2.2.0/24, but `show ip eigrp topology all-links` lists two. What explains the difference?",
        hi: "R1 par `show ip eigrp topology` 10.2.2.0/24 ke liye sirf ek `via` line dikhata hai, lekin `show ip eigrp topology all-links` do. Fark kyun hai?",
      },
      options: [
        { en: "The second neighbour is down", hi: "Doosra neighbour down hai" },
        { en: "The second path is in the routing table but not the topology table", hi: "Doosra path routing table mein hai, topology table mein nahi" },
        { en: "Variance is set to 1", hi: "Variance 1 par set hai" },
        { en: "The second path fails the feasibility condition, and the plain command shows only successors and feasible successors", hi: "Doosra path feasibility condition fail karta hai, aur simple command sirf successors aur feasible successors dikhata hai" },
      ],
      answer: 3,
      explain: {
        en: "Without `all-links`, IOS hides paths that are neither successor nor feasible successor. The extra line under `all-links` is a real path from a live neighbour whose RD is not below the FD. Variance does not change what the topology table shows.",
        hi: "`all-links` ke bina IOS woh paths chhupa deta hai jo na successor hain na feasible successor. `all-links` wali extra line ek live neighbour ka asli path hai jiska RD, FD se kam nahi. Variance topology table ka display nahi badalta.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1 loses its successor for 10.2.2.0/24 and has no feasible successor. What does R1 do next?",
        hi: "R1 ka 10.2.2.0/24 ka successor chala gaya aur koi feasible successor nahi hai. R1 aage kya karega?",
      },
      options: [
        { en: "Installs the next-best path from the topology table immediately", hi: "Topology table se agla best path turant install kar dega" },
        { en: "Marks the route active and sends queries to its remaining neighbours", hi: "Route ko active mark karke bache hue neighbours ko queries bhejega" },
        { en: "Waits for the next periodic full update", hi: "Agle periodic full update ka wait karega" },
        { en: "Floods an LSA and reruns SPF", hi: "LSA flood karke SPF dobara chalayega" },
      ],
      answer: 1,
      explain: {
        en: "Without a feasible successor, R1 cannot prove any remaining path is loop-free, so DUAL makes the route active and queries neighbours. Once all replies arrive it picks the best and returns to passive. EIGRP has no periodic full updates, and LSAs and SPF belong to OSPF.",
        hi: "Feasible successor na ho toh R1 prove nahi kar sakta ki bacha hua koi path loop-free hai, isliye DUAL route ko active karke neighbours se query karta hai. Saare replies aane par best chunta hai aur wapas passive ho jaata hai. EIGRP mein periodic full updates nahi hote, aur LSAs aur SPF OSPF ke hain.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "For 10.4.4.0/24, R1's successor metric (FD) is 3328 and its feasible successor's metric is 28672. What is the smallest `variance` that makes R1 use both paths?",
        hi: "10.4.4.0/24 ke liye R1 ka successor metric (FD) 3328 hai aur feasible successor ka metric 28672. Dono paths use karne ke liye sabse chhota `variance` kya hoga?",
      },
      options: [
        { en: "8", hi: "8" },
        { en: "9", hi: "9" },
        { en: "10", hi: "10" },
        { en: "EIGRP cannot use unequal-cost paths", hi: "EIGRP unequal-cost paths use nahi kar sakta" },
      ],
      answer: 1,
      explain: {
        en: "The backup must be below variance x FD. 8 x 3328 = 26624, which is less than 28672, so 8 is not enough. 9 x 3328 = 29952, which is more than 28672, so 9 works. 10 also works but is not the smallest.",
        hi: "Backup ka metric variance x FD se kam hona chahiye. 8 x 3328 = 26624, jo 28672 se kam hai, toh 8 kaafi nahi. 9 x 3328 = 29952, jo 28672 se zyada hai, toh 9 chalega. 10 bhi chalega, lekin sabse chhota nahi.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "R1 and R2 both run `router eigrp 100` on the same subnet. R2 also has `metric weights 0 1 1 1 0 0`. R1 logs a neighbour down message. Why?",
        hi: "R1 aur R2 dono same subnet par `router eigrp 100` chala rahe hain. R2 par `metric weights 0 1 1 1 0 0` bhi hai. R1 neighbour down ka message log karta hai. Kyun?",
      },
      options: [
        { en: "Their Hello timers differ", hi: "Unke Hello timers alag hain" },
        { en: "Their router IDs are in different ranges", hi: "Unke router IDs alag ranges mein hain" },
        { en: "Load is too high on the link", hi: "Link par load bahut zyada hai" },
        { en: "The K-values do not match, so they cannot be neighbours", hi: "K-values match nahi karte, isliye woh neighbours nahi ban sakte" },
      ],
      answer: 3,
      explain: {
        en: "`metric weights 0 1 1 1 0 0` sets K2 = 1 on R2, while R1 keeps the default K2 = 0. K-values are carried in Hellos and must match, so IOS logs `K-value mismatch` and drops the adjacency. Timers do not have to match.",
        hi: "`metric weights 0 1 1 1 0 0` R2 par K2 = 1 set karta hai, jabki R1 par default K2 = 0 hai. K-values Hellos mein jaate hain aur match hone chahiye, isliye IOS `K-value mismatch` log karta hai aur adjacency gira deta hai. Timers ka match hona zaroori nahi.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "N8PiZDld6Zc",
      title: "Free CCNA | RIP & EIGRP | Day 25",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Watch the EIGRP half: the metric, feasible and reported distance, successors, feasible successors and variance.", hi: "EIGRP wala hissa dekho: metric, feasible aur reported distance, successors, feasible successors aur variance." },
    },
    {
      id: "TOzB1qIjxKI",
      title: "Introduction to EIGRP: Feasible Successor",
      channel: "Networklessons.com",
      lang: "en",
      note: { en: "A short walkthrough of how EIGRP picks a successor and a feasible successor.", hi: "EIGRP successor aur feasible successor kaise chunta hai, iska chhota walkthrough." },
    },
    {
      id: "E7yDiZfgFLk",
      title: "122. CCNP Encore + Enarsi | EIGRP - Key Technologies Used & DUAL Functions|CCNP Full Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of DUAL and what it does for EIGRP.", hi: "DUAL aur EIGRP ke liye woh kya karta hai, iska Hindi explanation." },
    },
    {
      id: "-eTWGUKeoYM",
      title: "126. CCNP Encore + Enarsi | EIGRP - Route States - Passive and Active | CCNP Full Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of passive and active routes and the query process.", hi: "Passive aur active routes aur query process ka Hindi explanation." },
    },
  ],
  lab: {
    title: { en: "Find the feasible successor, then break the successor", hi: "Feasible successor dhoondho, phir successor tod do" },
    steps: [
      { en: "Build the diamond: R1-R2 and R2-R4 and R3-R4 on Gigabit ports, R1-R3 on a FastEthernet port (or set `bandwidth 100000` and `delay 10` on both ends). Add LANs 10.2.2.0/24 on R2 and 10.4.4.0/24 on R4, and run `router eigrp 100` everywhere.", hi: "Diamond banao: R1-R2, R2-R4 aur R3-R4 Gigabit ports par, R1-R3 FastEthernet port par (ya dono ends par `bandwidth 100000` aur `delay 10` lagao). R2 par LAN 10.2.2.0/24 aur R4 par 10.4.4.0/24 jodo, aur sab par `router eigrp 100` chalao." },
      { en: "On R1 run `show ip eigrp topology` and `show ip eigrp topology all-links`. Work out by hand why 10.4.4.0/24 has a feasible successor and 10.2.2.0/24 does not.", hi: "R1 par `show ip eigrp topology` aur `show ip eigrp topology all-links` chalao. Haath se nikaalo ki 10.4.4.0/24 ka feasible successor kyun hai aur 10.2.2.0/24 ka kyun nahi." },
      { en: "Turn on `debug eigrp fsm`, then shut R1's Gi0/0. Read the debug: one route switches to the feasible successor, the other goes active.", hi: "`debug eigrp fsm` on karo, phir R1 ka Gi0/0 shut karo. Debug padho: ek route feasible successor par switch hota hai, doosra active hota hai." },
      { en: "Bring Gi0/0 back up, set `variance 9` on R1 and check `show ip route eigrp` for two paths to 10.4.4.0/24 with different metrics. Try `variance 8` and see one path disappear.", hi: "Gi0/0 wapas up karo, R1 par `variance 9` lagao aur `show ip route eigrp` mein 10.4.4.0/24 ke do alag metric wale paths dekho. `variance 8` try karo aur ek path gayab hote dekho." },
      { en: "Set `metric weights 0 1 1 1 0 0` on R2 only and watch the `K-value mismatch` messages. Remove it afterwards.", hi: "Sirf R2 par `metric weights 0 1 1 1 0 0` lagao aur `K-value mismatch` messages dekho. Baad mein ise hata do." },
    ],
  },
};

export default lesson;
