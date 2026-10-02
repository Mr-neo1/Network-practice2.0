import type { Lesson } from "../types.ts";

// Topology used throughout (matches src/anim/scenes/ospf-basics.ts):
//   R1-R2 10.0.12.0/30 (R1 Gi0/0 .1, R2 Gi0/0 .2)    R1-R3 10.0.13.0/30 (R1 Gi0/1 .1, R3 Gi0/0 .2)
//   R2-R4 10.0.24.0/30 (R2 Gi0/1 .1, R4 Gi0/0 .2)    R3-R4 10.0.34.0/30 serial T1 (R3 Se0/0/0 .1, R4 Se0/0/0 .2)
//   PC1 LAN 10.1.1.0/24 on R1 Gi0/2                   PC4 LAN 10.4.4.0/24 on R4 Gi0/2
//   Router IDs 1.1.1.1 to 4.4.4.4, all interfaces in area 0, default reference bandwidth.

const lesson: Lesson = {
  slug: "ospf-basics",
  intro: {
    en: "OSPF is the routing protocol you are most likely to meet inside an enterprise network, and the one the CCNA tests in the most depth. Instead of trusting what neighbours say about distant networks, every OSPF router collects a description of every link in its area, builds the same map as everyone else, and works out the shortest paths itself. To configure it or fix it, you need to know how routers become neighbours, how the map is shared, and how cost decides the path.",
    hi: "Enterprise network ke andar sabse zyada chance hai ki tumhe OSPF milega, aur CCNA bhi sabse zyada depth mein isi ko test karta hai. Yeh neighbours ki suni-sunai baat par bharosa nahi karta. Har OSPF router apne area ke har link ka description jama karta hai, baaki sabke jaisa same map banata hai, aur shortest paths khud nikalta hai. Ise configure ya troubleshoot karne ke liye tumhe pata hona chahiye ki routers neighbours kaise bante hain, map kaise share hota hai, aur cost path kaise decide karti hai.",
  },
  outcomes: [
    { en: "Explain how OSPF uses LSAs, the LSDB and SPF to build its routes", hi: "Samjha sako ki OSPF apne routes banane ke liye LSAs, LSDB aur SPF ka use kaise karta hai" },
    { en: "List the settings two routers must agree on before they become OSPF neighbours", hi: "Woh settings list kar sako jin par do routers ka agree hona zaroori hai, tabhi woh OSPF neighbours bante hain" },
    { en: "Walk through the neighbour states from Down to Full and say which packets move a neighbour forward", hi: "Down se Full tak neighbour states samjha sako, aur bata sako ki kaunse packets neighbour ko aage badhate hain" },
    { en: "Calculate OSPF interface and path costs, and spot why 100 Mbps, 1 Gbps and 10 Gbps all cost 1 by default", hi: "OSPF interface aur path cost calculate kar sako, aur samjho ki default mein 100 Mbps, 1 Gbps aur 10 Gbps sab ki cost 1 kyun hoti hai" },
    { en: "Read `show ip ospf neighbor` and OSPF routes in `show ip route`", hi: "`show ip ospf neighbor` aur `show ip route` mein OSPF routes padh sako" },
  ],
  sections: [
    {
      id: "link-state-idea",
      heading: { en: "The link-state idea, applied to OSPF", hi: "Link-state ka idea, OSPF par" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 3.5 you saw the difference between distance vector and link state. **OSPF (Open Shortest Path First)** is the open-standard link-state IGP. **OSPFv2** routes IPv4 and is the version this lesson covers; **OSPFv3** does the same job for IPv6. Its administrative distance is **110**, and its packets ride directly inside IP as protocol number **89**, not inside TCP or UDP.",
            hi: "Lesson 3.5 mein tumne distance vector aur link state ka fark dekha tha. **OSPF (Open Shortest Path First)** open-standard link-state IGP hai. **OSPFv2** IPv4 ke liye hai aur yeh lesson usi ka hai; **OSPFv3** yahi kaam IPv6 ke liye karta hai. Iski administrative distance **110** hai, aur iske packets TCP ya UDP ke andar nahi, seedha IP ke andar protocol number **89** ke saath jaate hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "We will use the square from lesson 3.5 with one change. R1 connects to R2 and R3, and both connect to R4. Three links are still Gigabit Ethernet, but the R3-R4 link is now an old **T1 serial** line (1.544 Mbps), so the two paths are no longer equal. The links use /30 subnets named after their routers: **10.0.12.0**, **10.0.13.0**, **10.0.24.0** and **10.0.34.0**, with the lower-numbered router as .1. PC1 sits on R1's LAN, **10.1.1.0/24**, and PC4 on R4's LAN, **10.4.4.0/24**. Each router has a **router ID (RID)**, a 32-bit number written like an IP address: 1.1.1.1 for R1 up to 4.4.4.4 for R4. Lesson 3.7 shows how the RID is chosen.",
            hi: "Hum lesson 3.5 wala square hi use karenge, bas ek badlaav ke saath. R1, R2 aur R3 se juda hai, aur dono R4 se jude hain. Teen links abhi bhi Gigabit Ethernet hain, lekin R3-R4 link ab ek purani **T1 serial** line hai (1.544 Mbps), isliye dono paths ab barabar nahi rahe. Links par /30 subnets hain jinke naam routers se bane hain: **10.0.12.0**, **10.0.13.0**, **10.0.24.0** aur **10.0.34.0**, aur chhote number wala router .1 hai. PC1, R1 ke LAN **10.1.1.0/24** par hai, aur PC4, R4 ke LAN **10.4.4.0/24** par. Har router ka ek **router ID (RID)** hota hai, 32-bit number jo IP address ki tarah likha jaata hai: R1 ka 1.1.1.1 se lekar R4 ka 4.4.4.4 tak. RID kaise chuna jaata hai, yeh lesson 3.7 mein hai.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "**Become neighbours.** Each router sends Hellos out of its OSPF interfaces and forms adjacencies with the routers it hears. These go in the **neighbour table**.", hi: "**Neighbours bano.** Har router apne OSPF interfaces se Hellos bhejta hai aur jinhe sunta hai unke saath adjacency banata hai. Yeh **neighbour table** mein jaate hain." },
            { en: "**Share the map.** Each router describes its own links and their costs in an **LSA (Link-State Advertisement)** and floods it. Every router keeps every LSA in its **LSDB (link-state database)**.", hi: "**Map share karo.** Har router apne links aur unki costs ko ek **LSA (Link-State Advertisement)** mein describe karke flood karta hai. Har router saare LSAs apne **LSDB (link-state database)** mein rakhta hai." },
            { en: "**Calculate.** Each router runs the **SPF (Dijkstra)** algorithm on the LSDB with itself as the root and puts the lowest-cost path to every network into the **routing table**.", hi: "**Calculate karo.** Har router LSDB par khud ko root maan kar **SPF (Dijkstra)** algorithm chalata hai, aur har network ka lowest-cost path **routing table** mein daal deta hai." },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Three tables", hi: "Teen tables" },
          text: {
            en: "Every OSPF router keeps three tables: the neighbour table (`show ip ospf neighbor`), the LSDB (`show ip ospf database`) and the routing table (`show ip route`). The LSDB is identical on every router in an area; the routing table is not, because each router calculates from its own position.",
            hi: "Har OSPF router teen tables rakhta hai: neighbour table (`show ip ospf neighbor`), LSDB (`show ip ospf database`) aur routing table (`show ip route`). Area ke har router par LSDB bilkul same hota hai; routing table same nahi hoti, kyunki har router apni position se calculate karta hai.",
          },
        },
      ],
    },
    {
      id: "areas",
      heading: { en: "Areas: why OSPF divides the map", hi: "Areas: OSPF map ko kyun baantta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every router in an area holds the whole LSDB for that area and reruns SPF whenever any link in it changes. With hundreds of routers the database gets large and SPF runs often. So OSPF lets you split the network into **areas**. Routers inside an area know every link in it; other areas are summarised to them as a list of networks.",
            hi: "Area ka har router us area ka poora LSDB rakhta hai, aur area mein koi bhi link badle toh SPF dobara chalata hai. Sainkdon routers hon toh database bada ho jaata hai aur SPF baar baar chalta hai. Isliye OSPF network ko **areas** mein baantne deta hai. Area ke andar ke routers uske har link ko jaante hain; doosre areas unhe sirf networks ki list ki tarah dikhte hain.",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Area 0** is the **backbone**. In a multi-area design, every other area must connect to area 0.", hi: "**Area 0** **backbone** hai. Multi-area design mein har doosra area area 0 se juda hona chahiye." },
            { en: "An area is a property of an **interface**, not of a whole router. Both ends of a link must be in the same area.", hi: "Area **interface** ki property hai, poore router ki nahi. Link ke dono ends same area mein hone chahiye." },
            { en: "A router with interfaces in area 0 and another area is an **ABR (Area Border Router)**. Lesson 7.2 covers multi-area OSPF.", hi: "Jis router ke interfaces area 0 aur kisi doosre area mein hon, woh **ABR (Area Border Router)** hai. Multi-area OSPF lesson 7.2 mein hai." },
            { en: "For the CCNA you configure **single-area OSPF**: every interface in area 0. Our square is one area 0.", hi: "CCNA ke liye tum **single-area OSPF** configure karte ho: har interface area 0 mein. Hamara square bhi ek hi area 0 hai." },
          ],
        },
      ],
    },
    {
      id: "hellos-and-neighbours",
      heading: { en: "Hellos and the neighbour rules", hi: "Hellos aur neighbour banne ke rules" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An OSPF router sends a **Hello** out of each OSPF interface to the multicast address **224.0.0.5** (all OSPF routers). On Ethernet (broadcast) and point-to-point links the **Hello interval is 10 seconds** and the **dead interval is 40 seconds**: if a router hears no Hello from a neighbour for 40 seconds, it declares that neighbour down and recalculates. Hellos keep flowing for as long as the adjacency lives.",
            hi: "OSPF router apne har OSPF interface se multicast address **224.0.0.5** (saare OSPF routers) par **Hello** bhejta hai. Ethernet (broadcast) aur point-to-point links par **Hello interval 10 second** aur **dead interval 40 second** hota hai: agar kisi neighbour se 40 second tak koi Hello na aaye, toh router use down declare karke dobara calculate karta hai. Jab tak adjacency zinda hai, Hellos chalte rehte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "A Hello carries the sender's RID, area ID, subnet mask, Hello and dead intervals, authentication data, the stub area flag, its priority, the DR and BDR it knows of, and the list of **neighbours it has already heard**. The receiving router checks several of these fields against its own interface. If one does not match, it ignores the Hello and the two never become neighbours.",
            hi: "Hello mein sender ka RID, area ID, subnet mask, Hello aur dead intervals, authentication data, stub area flag, uski priority, use pata DR aur BDR, aur un **neighbours ki list hoti hai jinhe woh pehle se sun chuka hai**. Receive karne wala router inme se kai fields apne interface se match karta hai. Ek bhi match na ho, toh woh Hello ignore kar deta hai aur dono kabhi neighbours nahi bante.",
          },
        },
        {
          type: "table",
          caption: { en: "What two routers need before they become neighbours", hi: "Neighbours banne se pehle do routers ko kya chahiye" },
          columns: [{ en: "Requirement", hi: "Requirement" }, { en: "If it is wrong", hi: "Galat ho toh" }],
          rows: [
            [{ en: "Same area on both interfaces", hi: "Dono interfaces par same area" }, { en: "Hellos ignored; no neighbour", hi: "Hellos ignore; neighbour nahi banta" }],
            [{ en: "Same subnet and mask", hi: "Same subnet aur mask" }, { en: "Hellos ignored; no neighbour", hi: "Hellos ignore; neighbour nahi banta" }],
            [{ en: "Same Hello and dead intervals", hi: "Same Hello aur dead intervals" }, { en: "Hellos ignored; no neighbour", hi: "Hellos ignore; neighbour nahi banta" }],
            [{ en: "Same authentication settings", hi: "Same authentication settings" }, { en: "Hellos rejected; no neighbour", hi: "Hellos reject; neighbour nahi banta" }],
            [{ en: "Same stub area flag", hi: "Same stub area flag" }, { en: "Hellos ignored; no neighbour", hi: "Hellos ignore; neighbour nahi banta" }],
            [{ en: "Same interface MTU", hi: "Same interface MTU" }, { en: "Neighbour forms but sticks in ExStart or Exchange", hi: "Neighbour banta hai lekin ExStart ya Exchange mein atak jaata hai" }],
            [{ en: "Unique router IDs", hi: "Unique router IDs" }, { en: "No adjacency between the two routers; elsewhere, unstable routing", hi: "Dono ke beech adjacency nahi; baaki jagah routing unstable" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "What does not have to match", hi: "Kya match hona zaroori nahi" },
          text: {
            en: "The OSPF **process ID** (the 1 in `router ospf 1`) is local to each router. R1 can run process 1 and R2 process 10, and they still become neighbours. This is the opposite of the EIGRP AS number from lesson 3.5.",
            hi: "OSPF **process ID** (`router ospf 1` wala 1) har router ka local hota hai. R1 process 1 chala sakta hai aur R2 process 10, phir bhi dono neighbours ban jaayenge. Lesson 3.5 ke EIGRP mein ulta tha: wahan AS number match na ho toh neighbour nahi banta.",
          },
        },
      ],
    },
    {
      id: "neighbour-states",
      heading: { en: "Neighbour states: Down to Full", hi: "Neighbour states: Down se Full tak" },
      blocks: [
        {
          type: "p",
          text: {
            en: "OSPF uses five packet types. Hellos find and keep neighbours; the other four synchronise the databases.",
            hi: "OSPF paanch tarah ke packets use karta hai. Hellos neighbours dhoondhte aur banaye rakhte hain; baaki chaar databases ko sync karte hain.",
          },
        },
        {
          type: "table",
          caption: { en: "OSPF packet types", hi: "OSPF packet types" },
          columns: ["Type", { en: "Name", hi: "Naam" }, { en: "Job", hi: "Kaam" }],
          rows: [
            ["1", "Hello", { en: "Discover neighbours and keep the adjacency alive", hi: "Neighbours discover karna aur adjacency zinda rakhna" }],
            ["2", "DBD (Database Description)", { en: "List the headers of the LSAs a router has", hi: "Router ke paas jo LSAs hain, unke headers ki list" }],
            ["3", "LSR (Link-State Request)", { en: "Ask for specific LSAs that are missing or older", hi: "Missing ya purane LSAs maangna" }],
            ["4", "LSU (Link-State Update)", { en: "Carry full LSAs", hi: "Poore LSAs le jaana" }],
            ["5", "LSAck", { en: "Confirm that an LSU arrived", hi: "Confirm karna ki LSU pahunch gaya" }],
          ],
        },
        {
          type: "table",
          caption: { en: "R1 and R2 forming an adjacency on Gi0/0", hi: "R1 aur R2 ka Gi0/0 par adjacency banana" },
          columns: [{ en: "State", hi: "State" }, { en: "What has happened", hi: "Kya hua hai" }],
          rows: [
            ["Down", { en: "No Hello received from this neighbour within the dead interval", hi: "Dead interval ke andar is neighbour se koi Hello nahi aaya" }],
            ["Init", { en: "R2 received R1's Hello, but R2's own RID is not in R1's neighbour list yet", hi: "R2 ko R1 ka Hello mila, lekin R1 ki neighbour list mein abhi R2 ka RID nahi hai" }],
            ["2-Way", { en: "Each router has seen its own RID in the other's Hello: two-way communication confirmed. On Ethernet the DR/BDR election happens here", hi: "Dono ne ek doosre ke Hello mein apna RID dekh liya: two-way communication confirm. Ethernet par DR/BDR election yahin hota hai" }],
            ["ExStart", { en: "Empty DBDs decide master and slave; the higher RID (R2) is master", hi: "Khaali DBDs se master aur slave decide hota hai; bada RID (R2) master banta hai" }],
            ["Exchange", { en: "DBDs list LSA headers, like a table of contents", hi: "DBDs mein LSA headers ki list jaati hai, jaise kitaab ki index" }],
            ["Loading", { en: "Each router requests missing LSAs with LSRs and receives them in LSUs, which it acknowledges", hi: "Har router missing LSAs LSR se maangta hai, LSU mein paata hai, aur LSAck bhejta hai" }],
            ["Full", { en: "Both LSDBs are synchronised. This is a working adjacency", hi: "Dono LSDBs sync ho gaye. Yeh working adjacency hai" }],
          ],
        },
        {
          type: "cli",
          title: { en: "The log and the neighbour table on R1", hi: "R1 par log aur neighbour table" },
          lines: [
            { out: "%OSPF-5-ADJCHG: Process 1, Nbr 2.2.2.2 on GigabitEthernet0/0 from LOADING to FULL, Loading Done" },
            { prompt: "R1#", cmd: "show ip ospf neighbor" },
            { out: "Neighbor ID     Pri   State           Dead Time   Address         Interface" },
            { out: "2.2.2.2           1   FULL/DR         00:00:36    10.0.12.2       GigabitEthernet0/0", comment: { en: "R2, adjacency complete", hi: "R2, adjacency poori" } },
            { out: "3.3.3.3           1   FULL/DR         00:00:33    10.0.13.2       GigabitEthernet0/1", comment: { en: "R3 over the other Gigabit link", hi: "R3, doosre Gigabit link par" } },
          ],
          note: {
            en: "Dead Time counts down from 40 and jumps back each time a Hello arrives. The part after the slash is the neighbour's DR/BDR role on that Ethernet link, which lesson 3.7 explains.",
            hi: "Dead Time 40 se neeche girta hai aur har Hello aane par wapas upar chala jaata hai. Slash ke baad wala hissa us Ethernet link par neighbour ka DR/BDR role hai, jo lesson 3.7 mein samjhaya gaya hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Where it gets stuck tells you why", hi: "Kahan atka, isse pata chalta hai kyun" },
          text: {
            en: "No neighbour at all, or stuck in Init: look at Hello fields (area, subnet, timers, authentication) or an ACL blocking 224.0.0.5. Stuck in ExStart or Exchange: check the MTU on both ends.",
            hi: "Neighbour hi nahi dikh raha, ya Init mein atka hai: Hello fields dekho (area, subnet, timers, authentication), ya koi ACL 224.0.0.5 ko block toh nahi kar raha. ExStart ya Exchange mein atka hai: dono ends ka MTU check karo.",
          },
        },
      ],
    },
    {
      id: "lsas-and-spf",
      heading: { en: "LSAs, the LSDB and SPF", hi: "LSAs, LSDB aur SPF" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Once adjacencies are Full, each router floods its **Router LSA** (type 1), which lists its links, the networks on them and their costs. Neighbours store it, acknowledge it and flood it out of their other interfaces, without changing it. Each LSA carries a **sequence number**; a router keeps only the newest copy, so when R1 receives R4's LSA twice (via R2 and via R3) it keeps one. On Ethernet segments the DR also originates a **Network LSA** (type 2). Other LSA types belong to multi-area OSPF (lesson 7.2).",
            hi: "Adjacencies Full hote hi har router apna **Router LSA** (type 1) flood karta hai, jisme uske links, un par ke networks aur unki costs hoti hain. Neighbours use store karte hain, acknowledge karte hain aur bina badle apne baaki interfaces se flood kar dete hain. Har LSA mein ek **sequence number** hota hai; router sirf sabse naya copy rakhta hai, isliye jab R1 ko R4 ka LSA do baar milta hai (R2 se aur R3 se), woh ek hi rakhta hai. Ethernet segments par DR ek **Network LSA** (type 2) bhi banata hai. Baaki LSA types multi-area OSPF ke hain (lesson 7.2).",
          },
        },
        {
          type: "list",
          items: [
            { en: "When a link changes, the routers attached to it flood a new version of their LSA at once. Every router updates its LSDB and reruns SPF.", hi: "Jab koi link badalta hai, us se jude routers turant apne LSA ka naya version flood karte hain. Har router apna LSDB update karke SPF dobara chalata hai." },
            { en: "Even with no change, each router refreshes its own LSAs every **30 minutes**. An LSA that reaches 60 minutes old without a refresh is removed.", hi: "Kuch na badle tab bhi, har router apne LSAs har **30 minute** mein refresh karta hai. Jo LSA bina refresh ke 60 minute purana ho jaaye, woh hata diya jaata hai." },
            { en: "SPF builds a tree of shortest paths with the calculating router as the root. R1's tree and R4's tree are different, even though they were built from the same LSDB.", hi: "SPF calculate karne wale router ko root maan kar shortest paths ka tree banata hai. R1 ka tree aur R4 ka tree alag hain, jabki dono same LSDB se bane." },
          ],
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Same map, different starting point", hi: "Same map, alag starting point" },
          text: {
            en: "Four friends in different parts of a city each hold the same printed map. Each one plans the quickest route home from where they stand, so they draw four different routes on identical maps.",
            hi: "Shehar ke alag alag hisson mein chaar dost hain, aur sabke paas same printed map hai. Har koi jahan khada hai wahan se ghar ka sabse jaldi raasta plan karta hai, toh same map par chaar alag routes bante hain.",
          },
        },
      ],
    },
    {
      id: "cost",
      heading: { en: "Cost: how OSPF measures a path", hi: "Cost: OSPF path ko kaise naapta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Each OSPF interface has a **cost**: **reference bandwidth ÷ interface bandwidth**, with a default reference bandwidth of **100 Mbps**. Fractions are dropped and the minimum is 1. The cost of a route is the **sum of the costs of the outgoing interfaces** from this router to the destination network, including the interface on the last router that connects to that network. Incoming interfaces do not count.",
            hi: "Har OSPF interface ki ek **cost** hoti hai: **reference bandwidth ÷ interface bandwidth**, aur default reference bandwidth **100 Mbps** hai. Decimal hata diya jaata hai aur minimum cost 1 hoti hai. Route ki cost hoti hai is router se destination network tak ke **outgoing interfaces ki costs ka sum**, jisme last router ka woh interface bhi shaamil hai jo us network se juda hai. Incoming interfaces count nahi hote.",
          },
        },
        {
          type: "table",
          caption: { en: "Costs with the default 100 Mbps reference", hi: "Default 100 Mbps reference par costs" },
          columns: [{ en: "Interface", hi: "Interface" }, { en: "Bandwidth", hi: "Bandwidth" }, { en: "Cost", hi: "Cost" }],
          rows: [
            ["Serial T1", "1.544 Mbps", { en: "100 ÷ 1.544 = 64", hi: "100 ÷ 1.544 = 64" }],
            ["Ethernet", "10 Mbps", "10"],
            ["FastEthernet", "100 Mbps", "1"],
            ["GigabitEthernet", "1000 Mbps", { en: "0.1, raised to 1", hi: "0.1, badha kar 1" }],
            ["TenGigabitEthernet", "10000 Mbps", { en: "0.01, raised to 1", hi: "0.01, badha kar 1" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Work out R1's routes to PC4's LAN, 10.4.4.0/24. Via R2: R1 Gi0/0 (1) + R2 Gi0/1 (1) + R4 Gi0/2 (1) = **3**. Via R3: R1 Gi0/1 (1) + R3 Se0/0/0 (64) + R4 Gi0/2 (1) = **66**. Both paths cross the same number of routers, so RIP would see a tie. OSPF installs only the path via R2. If two paths had the same lowest cost, OSPF would install both (up to 4 by default) and share the traffic.",
            hi: "R1 se PC4 ke LAN 10.4.4.0/24 tak ke routes nikalo. R2 se: R1 Gi0/0 (1) + R2 Gi0/1 (1) + R4 Gi0/2 (1) = **3**. R3 se: R1 Gi0/1 (1) + R3 Se0/0/0 (64) + R4 Gi0/2 (1) = **66**. Dono paths same number of routers cross karte hain, toh RIP ko yeh tie lagta. OSPF sirf R2 wala path install karta hai. Agar do paths ki lowest cost barabar hoti, toh OSPF dono install karta (default mein 4 tak) aur traffic baant deta.",
          },
        },
        {
          type: "cli",
          title: { en: "R1's OSPF routes", hi: "R1 ke OSPF routes" },
          lines: [
            { prompt: "R1#", cmd: "show ip route ospf" },
            { out: "      10.0.0.0/8 is variably subnetted, 9 subnets, 3 masks" },
            { out: "O        10.0.24.0/30 [110/2] via 10.0.12.2, 00:02:11, GigabitEthernet0/0", comment: { en: "1 (R1 Gi0/0) + 1 (R2 Gi0/1)", hi: "R1 Gi0/0 ka 1 + R2 Gi0/1 ka 1" } },
            { out: "O        10.0.34.0/30 [110/65] via 10.0.13.2, 00:02:11, GigabitEthernet0/1", comment: { en: "1 + 64 via R3 beats 1 + 1 + 64 via R2", hi: "R3 se 1 + 64, R2 wale 1 + 1 + 64 se kam" } },
            { out: "O        10.4.4.0/24 [110/3] via 10.0.12.2, 00:02:11, GigabitEthernet0/0", comment: { en: "AD 110, cost 3, next hop R2", hi: "AD 110, cost 3, aur next hop R2 hai" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The default reference is too low for modern links", hi: "Default reference aaj ke links ke liye bahut kam hai" },
          text: {
            en: "With the 100 Mbps reference, a 100 Mbps link and a 10 Gbps link both cost 1, so OSPF cannot tell them apart. The fix is to raise the reference bandwidth with `auto-cost reference-bandwidth` on **every** router, for example to 10000 Mbps. You will configure that in lesson 3.7.",
            hi: "100 Mbps reference par 100 Mbps link aur 10 Gbps link dono ki cost 1 hai, toh OSPF dono mein fark nahi kar paata. Iska fix hai **har** router par `auto-cost reference-bandwidth` se reference bandwidth badhana, jaise 10000 Mbps. Yeh tum lesson 3.7 mein configure karoge.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "OSPF", def: { en: "Open Shortest Path First: the open-standard link-state IGP, AD 110, IP protocol 89. OSPFv2 is for IPv4.", hi: "Open Shortest Path First: open-standard link-state IGP, AD 110, IP protocol 89. OSPFv2 IPv4 ke liye hai." } },
    { term: "Router ID (RID)", def: { en: "A unique 32-bit number, written like an IPv4 address, that names an OSPF router in Hellos and LSAs.", hi: "Ek unique 32-bit number, IPv4 address ki tarah likha hua, jo Hellos aur LSAs mein OSPF router ki pehchaan hai." } },
    { term: "Hello", def: { en: "OSPF packet sent to 224.0.0.5 every 10 seconds on Ethernet to find neighbours and keep adjacencies alive.", hi: "Ethernet par har 10 second mein 224.0.0.5 par jaane wala OSPF packet, jo neighbours dhoondhta hai aur adjacency zinda rakhta hai." } },
    { term: "Dead interval", def: { en: "How long a router waits without a Hello before declaring a neighbour down; 40 seconds by default on Ethernet.", hi: "Bina Hello ke router kitna wait karega phir neighbour ko down declare karega; Ethernet par default 40 second." } },
    { term: "LSA", def: { en: "Link-State Advertisement: one router's description of its links and costs, flooded unchanged through the area.", hi: "Link-State Advertisement: ek router ka apne links aur costs ka description, jo bina badle poore area mein flood hota hai." } },
    { term: "LSDB", def: { en: "The link-state database holding every LSA; identical on all routers in an area.", hi: "Link-state database jisme saare LSAs hote hain; area ke saare routers par ek jaisa." } },
    { term: "SPF", def: { en: "The Dijkstra shortest path first algorithm that each router runs on the LSDB, with itself as the root.", hi: "Dijkstra ka shortest path first algorithm, jo har router LSDB par khud ko root maan kar chalata hai." } },
    { term: "Cost", def: { en: "OSPF's metric: reference bandwidth (100 Mbps default) divided by interface bandwidth, summed along the path.", hi: "OSPF ka metric: reference bandwidth (default 100 Mbps) ko interface bandwidth se divide karo, aur path par sab jod do." } },
  ],
  commands: [
    { cmd: "show ip ospf neighbor", mode: "Privileged EXEC", does: { en: "List OSPF neighbours with their state, dead time, address and interface", hi: "OSPF neighbours ko unki state, dead time, address aur interface ke saath dikhata hai" } },
    { cmd: "show ip ospf database", mode: "Privileged EXEC", does: { en: "Show the LSAs in the LSDB", hi: "LSDB ke LSAs dikhata hai" } },
    { cmd: "show ip route ospf", mode: "Privileged EXEC", does: { en: "Show only the routes learned by OSPF, with [110/cost]", hi: "Sirf OSPF se seekhe routes dikhata hai, [110/cost] ke saath" } },
    { cmd: "auto-cost reference-bandwidth 10000", mode: "Router configuration", does: { en: "Raise the reference bandwidth (in Mbps) used to calculate interface costs", hi: "Interface cost nikalne wali reference bandwidth (Mbps mein) badhata hai" } },
    { cmd: "router ospf 1", mode: "Global configuration", does: { en: "Start OSPF process 1 (used in the lab; explained in lesson 3.7)", hi: "OSPF process 1 start karta hai (lab mein use hua; lesson 3.7 mein explain hai)" } },
    { cmd: "network 10.0.0.0 0.255.255.255 area 0", mode: "Router configuration", does: { en: "Enable OSPF in area 0 on every interface with an address in 10.0.0.0/8", hi: "10.0.0.0/8 mein address wale har interface par area 0 mein OSPF enable karta hai" } },
    { cmd: "ip ospf hello-interval 5", mode: "Interface configuration", does: { en: "Change the Hello interval on one interface (IOS also sets the dead interval to 4 times it)", hi: "Ek interface par Hello interval badalta hai (IOS dead interval ko bhi uska 4 guna kar deta hai)" } },
  ],
  mistakes: [
    {
      en: "Thinking the routing tables of all OSPF routers are identical. The LSDB is identical inside an area; each router's routing table is calculated from its own position.",
      hi: "Yeh sochna ki saare OSPF routers ki routing tables same hoti hain. Area ke andar LSDB same hota hai; har router ki routing table uski apni position se calculate hoti hai.",
    },
    {
      en: "Expecting the OSPF process ID to match between neighbours. It is local; area, subnet, timers, authentication, stub flag and MTU are what must match.",
      hi: "Yeh expect karna ki neighbours ka OSPF process ID match hona chahiye. Woh local hai; match area, subnet, timers, authentication, stub flag aur MTU ko karna hai.",
    },
    {
      en: "Adding the cost of incoming interfaces. A route's cost is the sum of the outgoing interface costs towards the destination, including the last router's interface into the destination LAN.",
      hi: "Incoming interfaces ki cost bhi jod dena. Route ki cost destination ki taraf outgoing interfaces ki costs ka sum hai, jisme last router ka destination LAN wala interface bhi aata hai.",
    },
    {
      en: "Believing a 10 Gbps link always wins over a 100 Mbps link. With the default 100 Mbps reference both cost 1; you must raise the reference bandwidth.",
      hi: "Yeh maan lena ki 10 Gbps link hamesha 100 Mbps link se jeetega. Default 100 Mbps reference par dono ki cost 1 hai; reference bandwidth badhani padegi.",
    },
    {
      en: "Treating 2-Way as a fault. It is the normal final state between two DROTHERs on an Ethernet segment (lesson 3.7). A neighbour stuck in ExStart or Exchange is the real warning sign, usually an MTU mismatch.",
      hi: "2-Way ko fault samajhna. Ethernet segment par do DROTHERs ke beech yahi normal final state hai (lesson 3.7). Asli warning sign hai neighbour ka ExStart ya Exchange mein atakna, jo aksar MTU mismatch hota hai.",
    },
  ],
  recap: [
    { en: "OSPF: link state, AD 110, IP protocol 89. Three tables: neighbours, LSDB, routing table.", hi: "OSPF link state hai, AD 110 aur IP protocol 89. Iske teen tables hain: neighbours, LSDB aur routing table." },
    { en: "Hellos go to 224.0.0.5 every 10 s; dead interval 40 s on Ethernet and point-to-point links.", hi: "Hellos har 10 s mein 224.0.0.5 par jaate hain; Ethernet aur point-to-point par dead interval 40 s." },
    { en: "Must match: area, subnet and mask, Hello/dead timers, authentication, stub flag, MTU. RIDs must be unique. Process ID need not match.", hi: "Match hona chahiye: area, subnet aur mask, Hello/dead timers, authentication, stub flag, MTU. RIDs unique hone chahiye. Process ID match hona zaroori nahi." },
    { en: "States: Down, Init, 2-Way, ExStart, Exchange, Loading, Full. Packets: Hello, DBD, LSR, LSU, LSAck.", hi: "States ka order yaad rakho: Down, Init, 2-Way, ExStart, Exchange, Loading, Full. Packets paanch hain: Hello, DBD, LSR, LSU aur LSAck." },
    { en: "Cost = 100 Mbps ÷ interface bandwidth (minimum 1); route cost = sum of outgoing interface costs. 100M, 1G and 10G all cost 1 by default.", hi: "Cost = 100 Mbps ÷ interface bandwidth (minimum 1); route cost = outgoing interface costs ka sum. Default mein 100M, 1G aur 10G sab ki cost 1." },
    { en: "Area 0 is the backbone; CCNA uses single-area OSPF.", hi: "Area 0 backbone hai; CCNA mein single-area OSPF use hota hai." },
  ],
  quiz: [
    {
      q: { en: "To which destination address does an OSPF router send its Hello packets on an Ethernet link?", hi: "Ethernet link par OSPF router apne Hello packets kis destination address par bhejta hai?" },
      options: [
        { en: "255.255.255.255", hi: "255.255.255.255" },
        { en: "224.0.0.9", hi: "224.0.0.9" },
        { en: "224.0.0.5", hi: "224.0.0.5" },
        { en: "224.0.0.10", hi: "224.0.0.10" },
      ],
      answer: 2,
      explain: {
        en: "224.0.0.5 is the all-OSPF-routers multicast address. 224.0.0.9 is used by RIPv2 and 224.0.0.10 by EIGRP. OSPF never uses broadcast.",
        hi: "224.0.0.5 all-OSPF-routers multicast address hai. 224.0.0.9 RIPv2 use karta hai aur 224.0.0.10 EIGRP. OSPF broadcast kabhi use nahi karta.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1's Gi0/0 uses Hello 10 / dead 40. R2's Gi0/0 on the same subnet and area was set to Hello 5 / dead 20. What happens?",
        hi: "R1 ke Gi0/0 par Hello 10 / dead 40 hai. Same subnet aur area mein R2 ke Gi0/0 par Hello 5 / dead 20 set hai. Kya hoga?",
      },
      options: [
        { en: "They never become neighbours, because the timers must match", hi: "Woh kabhi neighbours nahi banenge, kyunki timers match hone chahiye" },
        { en: "They become neighbours and both use the lower timers", hi: "Neighbours ban jaayenge aur dono kam wale timers use karenge" },
        { en: "They become neighbours but stay in ExStart", hi: "Neighbours banenge lekin ExStart mein atke rahenge" },
        { en: "R2 becomes neighbour, and R1 changes its timers to match", hi: "R2 neighbour banega, aur R1 apne timers match karne ke liye badal lega" },
      ],
      answer: 0,
      explain: {
        en: "Hello and dead intervals are checked in every Hello. A mismatch makes each router ignore the other's Hellos, so no neighbour appears at all. OSPF never negotiates timers. Getting stuck in ExStart points to an MTU mismatch instead.",
        hi: "Har Hello mein Hello aur dead intervals check hote hain. Mismatch par dono ek doosre ke Hellos ignore karte hain, toh neighbour dikhta hi nahi. OSPF timers negotiate nahi karta. ExStart mein atakna MTU mismatch ki nishaani hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "With the default reference bandwidth, a route leaves R1 through a GigabitEthernet interface, then R2 through a FastEthernet interface, then R3 through a 10 Mbps Ethernet interface into the destination LAN. What is R1's cost for the route?",
        hi: "Default reference bandwidth par ek route R1 se GigabitEthernet interface se nikalta hai, phir R2 se FastEthernet interface se, phir R3 se 10 Mbps Ethernet interface se destination LAN mein jaata hai. R1 par is route ki cost kya hogi?",
      },
      options: [
        { en: "3", hi: "3" },
        { en: "12", hi: "12" },
        { en: "21", hi: "21" },
        { en: "111", hi: "111" },
      ],
      answer: 1,
      explain: {
        en: "Gigabit = 1 (0.1 is raised to the minimum of 1), FastEthernet = 100 ÷ 100 = 1, Ethernet = 100 ÷ 10 = 10. Adding the outgoing interfaces gives 1 + 1 + 10 = 12.",
        hi: "Gigabit = 1 (0.1 ko minimum 1 kar diya jaata hai), FastEthernet = 100 ÷ 100 = 1, Ethernet = 100 ÷ 10 = 10. Outgoing interfaces jodo: 1 + 1 + 10 = 12.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "`show ip ospf neighbor` on R1 shows R2 in the EXSTART state for several minutes. Area, subnet and timers match. What is the most likely cause?",
        hi: "R1 par `show ip ospf neighbor` mein R2 kai minute se EXSTART state mein dikh raha hai. Area, subnet aur timers match karte hain. Sabse likely reason kya hai?",
      },
      options: [
        { en: "The process IDs are different", hi: "Process IDs alag hain" },
        { en: "An ACL is blocking 224.0.0.5", hi: "Ek ACL 224.0.0.5 ko block kar raha hai" },
        { en: "R2 has a lower router ID than R1", hi: "R2 ka router ID R1 se chhota hai" },
        { en: "The interface MTUs do not match", hi: "Interface MTUs match nahi karte" },
      ],
      answer: 3,
      explain: {
        en: "Reaching ExStart means Hellos are fine, so a Hello mismatch or a blocked 224.0.0.5 is ruled out. The DBD packets exchanged here carry the interface MTU, and a mismatch stops the exchange. Process IDs never need to match, and RIDs only decide master and slave.",
        hi: "ExStart tak pahunchne ka matlab Hellos theek hain, toh Hello mismatch ya 224.0.0.5 block hona possible nahi. Yahan jo DBD packets jaate hain unme interface MTU hota hai, aur mismatch hone par exchange ruk jaata hai. Process IDs match hona zaroori hi nahi, aur RIDs sirf master aur slave decide karte hain.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R2 lists R1 in the INIT state. What does that tell you?",
        hi: "R2 ki list mein R1 INIT state mein hai. Isse kya pata chalta hai?",
      },
      options: [
        { en: "R1 and R2 are exchanging LSA headers", hi: "R1 aur R2 LSA headers exchange kar rahe hain" },
        { en: "R2 has not received any Hello from R1", hi: "R2 ko R1 se koi Hello nahi mila" },
        { en: "R2 received a Hello from R1, but R1's Hello did not list R2's router ID", hi: "R2 ko R1 ka Hello mila, lekin R1 ke Hello mein R2 ka router ID nahi tha" },
        { en: "The LSDBs are synchronised", hi: "LSDBs sync ho chuke hain" },
      ],
      answer: 2,
      explain: {
        en: "Init means one-way: R2 hears R1, but R1 has not shown that it hears R2. When R2 sees its own RID in a Hello from R1, it moves R1 to 2-Way. No Hello at all would be Down; LSA headers are exchanged in Exchange; synchronised databases mean Full.",
        hi: "Init ka matlab one-way: R2, R1 ko sun raha hai, lekin R1 ne abhi nahi dikhaya ki woh R2 ko sun raha hai. Jab R2 ko R1 ke Hello mein apna RID dikhega, woh R1 ko 2-Way mein le jaayega. Koi Hello na aaye toh Down; LSA headers Exchange mein jaate hain; sync databases ka matlab Full.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1 can reach 10.9.9.0/24 by path A, two 10 Gbps links, or path B, two 100 Mbps links. Both end at the same router and LAN interface. The reference bandwidth is the default. What does R1 install?",
        hi: "R1, 10.9.9.0/24 tak path A (do 10 Gbps links) ya path B (do 100 Mbps links) se pahunch sakta hai. Dono same router aur same LAN interface par khatam hote hain. Reference bandwidth default hai. R1 kya install karega?",
      },
      options: [
        { en: "Only path A, because it is faster", hi: "Sirf path A, kyunki woh fast hai" },
        { en: "Only path B, because it was learned first", hi: "Sirf path B, kyunki woh pehle seekha gaya" },
        { en: "Neither, until the reference bandwidth is changed", hi: "Koi nahi, jab tak reference bandwidth na badle" },
        { en: "Both, because they have the same cost", hi: "Dono, kyunki dono ki cost same hai" },
      ],
      answer: 3,
      explain: {
        en: "With a 100 Mbps reference, 10 Gbps and 100 Mbps links both cost 1, so each path costs 2 plus the same LAN interface. Equal costs mean OSPF installs both and load-shares, sending half the traffic over the slow links. Raising the reference bandwidth on every router fixes it.",
        hi: "100 Mbps reference par 10 Gbps aur 100 Mbps dono links ki cost 1 hai, toh har path ki cost 2 plus same LAN interface. Cost barabar hai, toh OSPF dono install karke load-share karta hai, aur aadha traffic slow links par jaata hai. Har router par reference bandwidth badhane se yeh theek hota hai.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "pvuaoJ9YzoI",
      title: "Free CCNA | OSPF Part 1 | Day 26",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Watch the first part for link state, LSA flooding and areas. The configuration at the end belongs to lesson 3.7.", hi: "Link state, LSA flooding aur areas ke liye pehla hissa dekho. End wala configuration part lesson 3.7 ka hai." },
    },
    {
      id: "VtzfTA21ht0",
      title: "Free CCNA | OSPF Part 2 | Day 27",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "OSPF cost, the reference bandwidth and every neighbour state from Down to Full.", hi: "OSPF cost, reference bandwidth aur Down se Full tak har neighbour state." },
    },
    {
      id: "qxtYBM23zxs",
      title: "57. Free CCNA (NEW) | OSPF - Idea Behind Link State Concept - Part 1",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "The link-state idea and how OSPF builds its map, in Hindi.", hi: "Link-state ka idea aur OSPF apna map kaise banata hai, Hindi mein." },
    },
    {
      id: "CQNQgRVh6PA",
      title: "61. Free CCNA (NEW) | OSPF - Neighborship Conditions & Hello Packets - Part 1",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hello packet fields and the conditions for becoming neighbours.", hi: "Hello packet ke fields aur neighbour banne ki conditions." },
    },
  ],
  lab: {
    title: { en: "Watch OSPF build the square in Packet Tracer", hi: "Packet Tracer mein OSPF ko square banate dekho" },
    steps: [
      { en: "Build the square with four 2911 routers; add an HWIC-2T serial module to R3 and R4. Use Gigabit links for R1-R2 (10.0.12.0/30), R1-R3 (10.0.13.0/30) and R2-R4 (10.0.24.0/30), and a serial link for R3-R4 (10.0.34.0/30), with the lower-numbered router as .1. Put a PC LAN on Gi0/2 of R1 (10.1.1.0/24) and of R4 (10.4.4.0/24).", hi: "Chaar 2911 routers se square banao; R3 aur R4 mein HWIC-2T serial module lagao. R1-R2 (10.0.12.0/30), R1-R3 (10.0.13.0/30) aur R2-R4 (10.0.24.0/30) Gigabit links par, aur R3-R4 (10.0.34.0/30) serial link par, chhote number wala router .1. R1 (10.1.1.0/24) aur R4 (10.4.4.0/24) ke Gi0/2 par ek ek PC LAN lagao." },
      { en: "On each router enter `router ospf 1` and then `network 10.0.0.0 0.255.255.255 area 0`. Lesson 3.7 explains these lines in detail.", hi: "Har router par `router ospf 1` aur phir `network 10.0.0.0 0.255.255.255 area 0` daalo. Yeh lines lesson 3.7 mein detail mein samjhaayi gayi hain." },
      { en: "Once the network has converged only Hellos flow, so make the adjacency form again: switch to Simulation mode, filter on OSPF only, then `shutdown` and `no shutdown` R1's Gi0/0. Find a Hello, a DBD and an LSU. Open the Hello and note its destination, 224.0.0.5.", hi: "Network converge hone ke baad sirf Hellos chalte hain, isliye adjacency dobara banwao: Simulation mode mein jao, sirf OSPF filter karo, phir R1 ke Gi0/0 par `shutdown` aur `no shutdown` karo. Ek Hello, ek DBD aur ek LSU dhoondho. Hello kholo aur uska destination 224.0.0.5 note karo." },
      { en: "Run `show ip ospf neighbor` on R1 and `show ip route ospf`. Confirm 10.4.4.0/24 shows [110/3] via R2.", hi: "R1 par `show ip ospf neighbor` aur `show ip route ospf` chalao. Confirm karo ki 10.4.4.0/24 [110/3] ke saath R2 ke through dikhta hai." },
      { en: "Shut R2's Gi0/1 and check R1's routing table again. The route should now be [110/66] via R3.", hi: "R2 ka Gi0/1 shut karo aur R1 ki routing table phir dekho. Ab route [110/66] ke saath R3 ke through hona chahiye." },
      { en: "Change the Hello interval on one end with `ip ospf hello-interval 5` and watch the neighbour disappear after the dead interval. Remove it with `no ip ospf hello-interval`.", hi: "Ek end par `ip ospf hello-interval 5` se Hello interval badlo aur dekho dead interval ke baad neighbour gayab ho jaata hai. `no ip ospf hello-interval` se wapas theek karo." },
    ],
  },
};

export default lesson;
