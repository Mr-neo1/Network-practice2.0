import type { Lesson } from "../types.ts";

// Topology used throughout (matches src/anim/scenes/ospf-multi-area.ts):
//   Area 1: R1 (internal, RID 1.1.1.1, LANs 10.1.0.0/24-10.1.3.0/24) -- 10.0.12.0/30 -- R2 (ABR, 2.2.2.2)
//   Area 0: R2 Gi0/1 -- 10.0.23.0/30 -- R3 (backbone + ASBR, 3.3.3.3) -- 10.0.34.0/30 -- R4 (ABR, 4.4.4.4)
//   Area 2: R4 Gi0/1 -- 10.0.45.0/30 -- R5 (internal, 5.5.5.5, LANs 10.2.0.0/24-10.2.3.0/24)
//   R3 Gi0/2 203.0.113.2/30 -- ISP 203.0.113.1, static default + default-information originate
// All links GigabitEthernet (cost 1), router-to-router links use network type point-to-point.

const lesson: Lesson = {
  slug: "ospf-multi-area",
  intro: {
    en: "Single-area OSPF works well for a few dozen routers. As the network grows, every router carries the full map of every link and recalculates whenever any link anywhere flaps. Areas fix this: routers keep the detailed map only for their own area and see the rest as a short list of prefixes and costs. The CCNA 200-301 v1.1 exam stops at single-area OSPFv2 (topic 3.4), but in a real enterprise network or a CCNP exam you will meet ABRs, LSA types and `O IA` routes every day.",
    hi: "Single-area OSPF kuch dozen routers tak badhiya chalta hai. Network bada hota hai toh har router ko har link ka poora map rakhna padta hai, aur kahin bhi koi link flap ho toh sab recalculate karte hain. Areas isi ka solution hain: router sirf apne area ka detailed map rakhta hai, baaki network use prefixes aur costs ki chhoti list ke roop mein dikhta hai. CCNA 200-301 v1.1 exam single-area OSPFv2 (topic 3.4) par ruk jaata hai, lekin real enterprise network mein ya CCNP exam mein ABRs, LSA types aur `O IA` routes roz milenge.",
  },
  outcomes: [
    { en: "Explain why OSPF uses areas and why every area must touch area 0", hi: "Samjha sako ki OSPF areas kyun use karta hai aur har area ka area 0 se judna kyun zaroori hai" },
    { en: "Identify internal routers, backbone routers, ABRs and ASBRs in a topology", hi: "Topology mein internal routers, backbone routers, ABRs aur ASBRs pehchaan sako" },
    { en: "Say which router creates each LSA type 1 to 5 (and 7) and how far it floods", hi: "Bata sako ki LSA type 1 se 5 (aur 7) kaunsa router banata hai aur woh kahan tak flood hota hai" },
    { en: "Read `O`, `O IA`, `O E1` and `O E2` routes and predict which one wins", hi: "`O`, `O IA`, `O E1` aur `O E2` routes padh sako aur predict kar sako ki kaunsa jeetega" },
    { en: "Configure a two-area design with summarisation at the ABR using `area range`", hi: "Do areas wala design configure kar sako, aur ABR par `area range` se summarisation kar sako" },
    { en: "Choose between a normal, stub, totally stubby and NSSA area", hi: "Normal, stub, totally stubby aur NSSA area mein se sahi choose kar sako" },
  ],
  sections: [
    {
      id: "why-areas",
      heading: { en: "Why one big area stops scaling", hi: "Ek bada area scale kyun nahi karta" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 3.6 every router held the same LSDB and ran SPF on it. That LSDB holds one Router LSA per router, describing every link. With 300 routers, every one of them stores all 300 LSAs, and when a single WAN link in a branch flaps, all 300 routers flood the change and rerun SPF. The cost grows with the size of the network, not with how much you care about that branch.",
            hi: "Lesson 3.6 mein har router ke paas same LSDB tha aur har router us par SPF chalata tha. Us LSDB mein har router ka ek Router LSA hota hai, jisme uske saare links hote hain. 300 routers hon toh har router 300 LSAs store karta hai, aur kisi branch ka ek WAN link flap ho toh saare 300 routers change flood karte hain aur SPF dobara chalate hain. Kharcha network ke size ke saath badhta hai, is baat se nahi ki us branch se tumhe kitna matlab hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "OSPF solves this by splitting the routing domain into **areas**. Inside an area nothing changes: routers flood type 1 and type 2 LSAs, keep an identical LSDB and run SPF. At the border, an **ABR (Area Border Router)** does not pass those LSAs on. It sends a much shorter message into the next area: \"I can reach 10.1.0.0/22 at cost 2.\" That gives you four benefits:",
            hi: "OSPF iska hal routing domain ko **areas** mein baant kar nikalta hai. Area ke andar kuch nahi badalta: routers type 1 aur type 2 LSAs flood karte hain, same LSDB rakhte hain aur SPF chalate hain. Border par **ABR (Area Border Router)** yeh LSAs aage nahi bhejta. Woh agle area mein ek bahut chhota message bhejta hai: \"Main 10.1.0.0/22 tak cost 2 par pahunch sakta hoon.\" Isse chaar fayde milte hain:",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Smaller LSDB**: routers store the full detail of their own area only.", hi: "**Chhota LSDB**: routers sirf apne area ki poori detail store karte hain." },
            { en: "**Smaller SPF scope**: a link change inside area 2 triggers a full SPF only in area 2. Other areas at most update one inter-area prefix, which is a much cheaper partial calculation.", hi: "**SPF ka scope chhota**: area 2 ke andar link change ho toh full SPF sirf area 2 mein chalta hai. Baaki areas zyada se zyada ek inter-area prefix update karte hain, jo kaafi sasta partial calculation hai." },
            { en: "**Summarisation**: an ABR can advertise four /24s as one /22. OSPF can only summarise at ABRs and ASBRs, so areas are what make summarisation possible.", hi: "**Summarisation**: ABR chaar /24 ko ek /22 bana kar advertise kar sakta hai. OSPF sirf ABRs aur ASBRs par summarise kar sakta hai, isliye summarisation areas ki wajah se hi possible hai." },
            { en: "**Stability**: if a summarised LAN flaps, the summary does not change, so the rest of the network never hears about it.", hi: "**Stability**: summarised LAN flap ho toh summary nahi badalti, isliye baaki network ko pata hi nahi chalta." },
          ],
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "A courier company does not give every driver the street map of every city. The Mumbai hub knows Mumbai street by street; for Delhi it only knows \"send it to the Delhi hub, about 1,400 km\". If a Delhi street closes, Mumbai drivers never need to know.",
            hi: "Courier company har driver ko har shehar ka street map nahi deti. Mumbai hub ko Mumbai ki har gali pata hai; Delhi ke liye use bas itna pata hai ki \"Delhi hub ko bhejo, lagbhag 1,400 km\". Delhi ki koi gali band ho jaaye toh Mumbai ke drivers ko jaanne ki zaroorat nahi.",
          },
        },
      ],
    },
    {
      id: "backbone-and-roles",
      heading: { en: "Area 0 and the four router roles", hi: "Area 0 aur routers ke chaar roles" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Area 0 is the backbone**, and every other area must connect to it through an ABR. Traffic and routing information between two non-backbone areas always pass through area 0. Between areas, OSPF behaves like a distance-vector protocol: routers see prefixes and costs, not the links behind them. Forcing everything through one central area is what keeps that loop-free.",
            hi: "**Area 0 backbone hai**, aur baaki har area ko ABR ke through isse judna hi padega. Do non-backbone areas ke beech traffic aur routing information hamesha area 0 se hokar jaati hai. Areas ke beech OSPF distance-vector protocol jaisa behave karta hai: routers ko prefixes aur costs dikhte hain, unke peeche ke links nahi. Sab kuch ek central area se guzarna hi ise loop-free rakhta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Our network for this lesson: **R1** has four user LANs, 10.1.0.0/24 to 10.1.3.0/24, and connects to **R2** over 10.0.12.0/30 in area 1. R2 and **R4** connect to **R3** in area 0 (10.0.23.0/30 and 10.0.34.0/30). R4 connects to **R5** over 10.0.45.0/30 in area 2, and R5 has LANs 10.2.0.0/24 to 10.2.3.0/24. R3 also has an internet link, 203.0.113.2/30, to the ISP. Every link is Gigabit Ethernet with cost 1, and router IDs are 1.1.1.1 to 5.5.5.5.",
            hi: "Is lesson ka network: **R1** ke paas chaar user LANs hain, 10.1.0.0/24 se 10.1.3.0/24, aur woh area 1 mein 10.0.12.0/30 par **R2** se juda hai. R2 aur **R4** area 0 mein **R3** se jude hain (10.0.23.0/30 aur 10.0.34.0/30). R4 area 2 mein 10.0.45.0/30 par **R5** se juda hai, aur R5 ke LANs 10.2.0.0/24 se 10.2.3.0/24 hain. R3 ka ek internet link bhi hai, 203.0.113.2/30, ISP ki taraf. Har link Gigabit Ethernet hai aur cost 1, router IDs 1.1.1.1 se 5.5.5.5 tak.",
          },
        },
        {
          type: "table",
          caption: { en: "OSPF router types, using our network", hi: "OSPF router types, hamare network ke saath" },
          columns: ["Role", { en: "Definition", hi: "Definition" }, { en: "In our network", hi: "Hamare network mein" }],
          rows: [
            [{ en: "Internal router", hi: "Internal router" }, { en: "All OSPF interfaces in one area", hi: "Saare OSPF interfaces ek hi area mein" }, { en: "R1 (area 1), R5 (area 2), R3 (area 0)", hi: "R1 (sirf area 1), R5 (sirf area 2), R3 (sirf area 0)" }],
            [{ en: "Backbone router", hi: "Backbone router" }, { en: "At least one interface in area 0", hi: "Kam se kam ek interface area 0 mein" }, { en: "R2, R3, R4", hi: "R2, R3, R4" }],
            ["ABR", { en: "Interfaces in area 0 and at least one other area; keeps one LSDB per area", hi: "Interfaces area 0 aur kam se kam ek doosre area mein; har area ka alag LSDB rakhta hai" }, { en: "R2 (areas 0 and 1), R4 (areas 0 and 2)", hi: "R2 (areas 0 aur 1), R4 (areas 0 aur 2)" }],
            ["ASBR", { en: "Injects routes from outside OSPF (static, connected, another protocol)", hi: "OSPF ke bahar ke routes (static, connected, doosra protocol) andar laata hai" }, { en: "R3, which advertises a default route towards the ISP", hi: "R3, jo ISP ki taraf default route advertise karta hai" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "One router, several roles", hi: "Ek router, kai roles" },
          text: {
            en: "The roles overlap. R3 is a backbone router, an internal router of area 0 and an ASBR at the same time. Every ABR is also a backbone router. Remember too that an area belongs to an interface, not to a router.",
            hi: "Roles overlap karte hain. R3 ek saath backbone router, area 0 ka internal router aur ASBR hai. Har ABR backbone router bhi hota hai. Yeh bhi yaad rakho ki area interface ka hota hai, router ka nahi.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "An area that does not touch area 0", hi: "Aisa area jo area 0 ko touch nahi karta" },
          text: {
            en: "If you add area 3 behind R5 and connect it only to area 2, routers in area 3 do not learn routes from the other areas, and the rest of the network does not learn area 3. The proper fix is a link into area 0. A **virtual link** through area 2 can patch it temporarily; it is beyond this lesson.",
            hi: "Agar R5 ke peeche area 3 banao aur use sirf area 2 se jodo, toh area 3 ke routers doosre areas ke routes nahi seekhte, aur baaki network area 3 ko nahi seekhta. Sahi fix hai area 0 tak ek link. Area 2 ke through **virtual link** ise temporarily jod sakta hai; woh is lesson ke scope se bahar hai.",
          },
        },
      ],
    },
    {
      id: "lsa-types",
      heading: { en: "LSA types 1 to 5, and 7", hi: "LSA types 1 se 5, aur 7" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Each LSA type answers one question for the routers that receive it. Types 1 and 2 describe the **inside** of an area. Type 3 describes a **prefix in another area**. Types 4 and 5 deal with **routes from outside OSPF**. The key fact is the flooding scope: types 1, 2, 3 and 4 never leave the area they were created for, while type 5 floods everywhere except stub-type areas.",
            hi: "Har LSA type receive karne wale routers ke ek sawaal ka jawab deta hai. Type 1 aur 2 area ke **andar** ka description hain. Type 3 **doosre area ka prefix** batata hai. Type 4 aur 5 **OSPF ke bahar ke routes** ke liye hain. Sabse zaroori baat flooding scope hai: type 1, 2, 3 aur 4 jis area ke liye bane, usse bahar nahi jaate, jabki type 5 stub type areas ko chhod kar har jagah flood hota hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The LSA types you need", hi: "Jo LSA types tumhe chahiye" },
          columns: ["Type", { en: "Name", hi: "Name" }, { en: "Created by", hi: "Kaun banata hai" }, { en: "Flooded to", hi: "Kahan flood hota hai" }, { en: "In our network", hi: "Hamare network mein" }],
          rows: [
            ["1", "Router", { en: "Every router, once per area it is in", hi: "Har router, har us area ke liye jisme woh hai" }, { en: "Its own area only", hi: "Sirf apne area mein" }, { en: "R1 and R2 in area 1; R2, R3, R4 in area 0", hi: "Area 1 mein R1 aur R2; area 0 mein R2, R3, R4" }],
            ["2", "Network", { en: "The DR on a multi-access segment", hi: "Multi-access segment ka DR" }, { en: "Its own area only", hi: "Sirf apne area mein" }, { en: "None: router links are point-to-point", hi: "Koi nahi: router links point-to-point hain" }],
            ["3", "Summary", "ABR", { en: "Into one area, describing prefixes from other areas", hi: "Ek area mein, doosre areas ke prefixes batata hai" }, { en: "R2 sends 10.1.0.0/22 into area 0", hi: "R2 area 0 mein 10.1.0.0/22 bhejta hai" }],
            ["4", "ASBR summary", "ABR", { en: "Into one area, saying how to reach an ASBR in another area", hi: "Ek area mein, batata hai ki doosre area ke ASBR tak kaise pahunchein" }, { en: "R2 tells area 1 how to reach 3.3.3.3", hi: "R2 area 1 ko batata hai ki 3.3.3.3 tak kaise jaana hai" }],
            ["5", "AS external", "ASBR", { en: "Every normal area, unchanged by ABRs", hi: "Har normal area mein, ABRs ise badalte nahi" }, { en: "R3's 0.0.0.0/0", hi: "R3 ka 0.0.0.0/0" }],
            ["7", "NSSA external", { en: "ASBR inside an NSSA", hi: "NSSA ke andar ka ASBR" }, { en: "That NSSA only; its ABR translates it to type 5", hi: "Sirf woh NSSA; uska ABR ise type 5 mein badalta hai" }, { en: "Not used here", hi: "Yahan use nahi hua" }],
          ],
        },
        {
          type: "steps",
          items: [
            {
              en: "Inside area 1, R1 and R2 flood their **type 1** Router LSAs. R1's LSDB holds exactly two Router LSAs. It never sees R3's or R5's.",
              hi: "Area 1 ke andar R1 aur R2 apne **type 1** Router LSAs flood karte hain. R1 ke LSDB mein exactly do Router LSAs hain. R3 ya R5 ka Router LSA use kabhi nahi dikhta.",
            },
            {
              en: "R2 runs SPF on its area 1 LSDB and finds the area 1 prefixes. For each one (or each summary) it creates a **type 3** LSA with itself as the advertising router and its own cost, and floods it into area 0.",
              hi: "R2 apne area 1 LSDB par SPF chalata hai aur area 1 ke prefixes nikalta hai. Har prefix (ya har summary) ke liye woh ek **type 3** LSA banata hai, advertising router khud R2 aur cost R2 ki apni, aur use area 0 mein flood karta hai.",
            },
            {
              en: "R4 receives those type 3 LSAs in area 0. It does not forward them into area 2. It creates **new** type 3 LSAs with advertising router 4.4.4.4 and its own, larger cost. This is the distance-vector behaviour between areas.",
              hi: "R4 ko area 0 mein yeh type 3 LSAs milte hain. Woh inhe area 2 mein forward nahi karta. Woh **naye** type 3 LSAs banata hai, advertising router 4.4.4.4 aur cost apni, jo badi hai. Areas ke beech yahi distance-vector wala behaviour hai.",
            },
            {
              en: "R3, the ASBR, creates a **type 5** LSA for 0.0.0.0/0. It floods across area 0 and through R2 and R4 into areas 1 and 2 **unchanged**: the advertising router stays 3.3.3.3.",
              hi: "ASBR R3 0.0.0.0/0 ke liye **type 5** LSA banata hai. Yeh area 0 mein aur R2, R4 ke through areas 1 aur 2 mein **bina badle** flood hota hai: advertising router 3.3.3.3 hi rehta hai.",
            },
            {
              en: "R1 now knows the default route belongs to 3.3.3.3, but R3's Router LSA lives in area 0, so R1 cannot work out the cost to it. R2 fixes that with a **type 4** LSA: \"ASBR 3.3.3.3 is reachable through me at cost 1.\"",
              hi: "Ab R1 ko pata hai ki default route 3.3.3.3 ka hai, lekin R3 ka Router LSA area 0 mein hai, isliye R1 uski cost nahi nikaal sakta. R2 ise **type 4** LSA se solve karta hai: \"ASBR 3.3.3.3 mere through cost 1 par milta hai.\"",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Who advertised it? Look at ADV Router", hi: "Kisne advertise kiya? ADV Router dekho" },
          text: {
            en: "In `show ip ospf database`, every type 3 and type 4 LSA in an area shows the ABR as ADV Router, because the ABR created it. A type 5 LSA shows the ASBR, because nobody re-creates it on the way.",
            hi: "`show ip ospf database` mein area ke har type 3 aur type 4 LSA ka ADV Router ABR hota hai, kyunki ABR ne hi use banaya. Type 5 LSA mein ASBR dikhta hai, kyunki raste mein koi use dobara nahi banata.",
          },
        },
      ],
    },
    {
      id: "route-codes",
      heading: { en: "Route codes: O, O IA, O E1 and O E2", hi: "Route codes: O, O IA, O E1 aur O E2" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The routing table tells you which kind of LSA each route came from. **`O`** is intra-area (types 1 and 2). **`O IA`** is inter-area (type 3). **`O E1`** and **`O E2`** are external (type 5), and **`O N1`**/**`O N2`** are their NSSA versions (type 7).",
            hi: "Routing table batata hai ki har route kis type ke LSA se aaya. **`O`** intra-area hai (type 1 aur 2). **`O IA`** inter-area hai (type 3). **`O E1`** aur **`O E2`** external hain (type 5), aur **`O N1`**/**`O N2`** unke NSSA versions hain (type 7).",
          },
        },
        {
          type: "cli",
          title: { en: "R1's OSPF routes", hi: "R1 ke OSPF routes" },
          lines: [
            { prompt: "R1#", cmd: "show ip route ospf" },
            { out: "Gateway of last resort is 10.0.12.2 to network 0.0.0.0" },
            { out: "O*E2  0.0.0.0/0 [110/1] via 10.0.12.2, 00:03:12, GigabitEthernet0/0", comment: { en: "Type 5 default from R3; E2 metric 1", hi: "R3 ka type 5 default; E2 metric 1" } },
            { out: "      10.0.0.0/8 is variably subnetted, 14 subnets, 4 masks" },
            { out: "O IA     10.0.23.0/30 [110/2] via 10.0.12.2, 00:08:41, GigabitEthernet0/0", comment: { en: "Area 0 link; cost 1 to R2 + R2's cost 1", hi: "Area 0 ka link; R2 tak cost 1 + R2 ki cost 1" } },
            { out: "O IA     10.0.34.0/30 [110/3] via 10.0.12.2, 00:08:41, GigabitEthernet0/0" },
            { out: "O IA     10.0.45.0/30 [110/4] via 10.0.12.2, 00:08:30, GigabitEthernet0/0" },
            { out: "O IA     10.2.0.0/22 [110/5] via 10.0.12.2, 00:02:05, GigabitEthernet0/0", comment: { en: "R4's summary of area 2's four LANs", hi: "Area 2 ke chaar LANs ka R4 wala summary" } },
          ],
          note: {
            en: "R1 has no `O` routes because area 1 has no other LANs; its own LANs are connected routes. Every route points at R2: from inside area 1, the ABR is the door to everything else.",
            hi: "R1 ke paas koi `O` route nahi hai kyunki area 1 mein aur koi LAN nahi; uske apne LANs connected routes hain. Har route R2 ki taraf jaata hai: area 1 ke andar se ABR hi baaki sab ka darwaza hai.",
          },
        },
        {
          type: "table",
          caption: { en: "E1 versus E2", hi: "E1 aur E2 mein fark" },
          columns: ["", "O E2 (default)", "O E1"],
          rows: [
            [{ en: "Metric", hi: "Metric" }, { en: "The external metric only. It stays the same on every router.", hi: "Sirf external metric. Har router par same rehta hai." }, { en: "External metric plus the internal cost to the ASBR. It grows with distance.", hi: "External metric plus ASBR tak ki internal cost. Doori ke saath badhta hai." }],
            [{ en: "Default seed metric", hi: "Default seed metric" }, { en: "20 for redistributed routes; 1 for `default-information originate`", hi: "Redistributed routes ke liye 20; `default-information originate` ke liye 1" }, { en: "Same seed, set with `metric-type 1`", hi: "Same seed, `metric-type 1` se set hota hai" }],
            [{ en: "Use it when", hi: "Kab use karein" }, { en: "There is one exit, so distance to it does not matter", hi: "Exit ek hi hai, toh uski doori matter nahi karti" }, { en: "There are several ASBRs and each router should use the nearest", hi: "Kai ASBRs hain aur har router ko sabse paas wala use karna chahiye" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Route type beats metric", hi: "Route type metric se pehle aata hai" },
          text: {
            en: "When OSPF has the same prefix from different LSA types, it prefers **O, then O IA, then E1, then E2**, whatever the metrics. An `O IA` route with cost 50 beats an `O E2` route with metric 1. Compare metrics only between routes of the same type.",
            hi: "Jab OSPF ke paas same prefix alag LSA types se aaye, toh woh **pehle O, phir O IA, phir E1, phir E2** chunta hai, metrics chahe jo hon. Cost 50 wala `O IA` route metric 1 wale `O E2` route se jeetega. Metrics sirf same type ke routes ke beech compare karo.",
          },
        },
      ],
    },
    {
      id: "configuration",
      heading: { en: "Configuring two areas and summarising at the ABR", hi: "Do areas configure karna aur ABR par summarise karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "There is no special command to make a router an ABR. You put its interfaces in different areas, and it becomes one. The `network` command and `ip ospf 1 area` work exactly as in lesson 3.7; only the area number changes. The router-to-router links here use `ip ospf network point-to-point`, so there are no DRs and no type 2 LSAs.",
            hi: "Router ko ABR banane ka koi alag command nahi hai. Uske interfaces alag areas mein daal do, woh ABR ban jaata hai. `network` command aur `ip ospf 1 area` bilkul lesson 3.7 jaise kaam karte hain; sirf area number badalta hai. Yahan router-to-router links par `ip ospf network point-to-point` laga hai, isliye na DR hai na type 2 LSAs.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: internal router in area 1", hi: "R1: area 1 ka internal router" },
          lines: [
            { prompt: "R1(config)#", cmd: "router ospf 1" },
            { prompt: "R1(config-router)#", cmd: "router-id 1.1.1.1" },
            { prompt: "R1(config-router)#", cmd: "network 10.0.12.0 0.0.0.3 area 1", comment: { en: "Link to R2", hi: "R2 wala link" } },
            { prompt: "R1(config-router)#", cmd: "network 10.1.0.0 0.0.3.255 area 1", comment: { en: "All four LANs, 10.1.0.0 to 10.1.3.255", hi: "Chaaron LANs, 10.1.0.0 se 10.1.3.255 tak" } },
            { prompt: "R1(config-router)#", cmd: "passive-interface default" },
            { prompt: "R1(config-router)#", cmd: "no passive-interface GigabitEthernet0/0" },
          ],
        },
        {
          type: "cli",
          title: { en: "R2: ABR between area 1 and area 0", hi: "R2: area 1 aur area 0 ke beech ABR" },
          lines: [
            { prompt: "R2(config)#", cmd: "router ospf 1" },
            { prompt: "R2(config-router)#", cmd: "router-id 2.2.2.2" },
            { prompt: "R2(config-router)#", cmd: "network 10.0.12.0 0.0.0.3 area 1", comment: { en: "Gi0/0 joins area 1", hi: "Gi0/0 area 1 mein" } },
            { prompt: "R2(config-router)#", cmd: "network 10.0.23.0 0.0.0.3 area 0", comment: { en: "Gi0/1 joins area 0: R2 is now an ABR", hi: "Gi0/1 area 0 mein: ab R2 ABR hai" } },
            { prompt: "R2(config-router)#", cmd: "area 1 range 10.1.0.0 255.255.252.0", comment: { en: "Advertise area 1's 10.1.x LANs as one /22", hi: "Area 1 ke 10.1.x LANs ko ek /22 bana kar advertise karo" } },
          ],
          note: {
            en: "`area range` uses a subnet mask, not a wildcard, and works only on the ABR for the area the prefixes live in. As long as at least one LAN inside 10.1.0.0/22 is up, R2 advertises the /22 and nothing else from that range. It also installs `10.1.0.0/22 is a summary ... Null0` in its own table, so packets for unused addresses in the range are dropped instead of looping.",
            hi: "`area range` subnet mask leta hai, wildcard nahi, aur sirf ABR par us area ke liye kaam karta hai jisme prefixes hain. Jab tak 10.1.0.0/22 ke andar kam se kam ek LAN up hai, R2 /22 advertise karta hai aur us range se aur kuch nahi. Woh apni table mein `10.1.0.0/22 is a summary ... Null0` bhi daalta hai, taaki range ke unused addresses ke packets loop hone ki jagah drop ho jaayein.",
          },
        },
        {
          type: "cli",
          title: { en: "R3: backbone router and ASBR", hi: "R3: backbone router aur ASBR" },
          lines: [
            { prompt: "R3(config)#", cmd: "ip route 0.0.0.0 0.0.0.0 203.0.113.1", comment: { en: "Static default to the ISP", hi: "ISP ki taraf static default" } },
            { prompt: "R3(config)#", cmd: "router ospf 1" },
            { prompt: "R3(config-router)#", cmd: "router-id 3.3.3.3" },
            { prompt: "R3(config-router)#", cmd: "network 10.0.23.0 0.0.0.3 area 0" },
            { prompt: "R3(config-router)#", cmd: "network 10.0.34.0 0.0.0.3 area 0" },
            { prompt: "R3(config-router)#", cmd: "default-information originate", comment: { en: "Creates the type 5 LSA for 0.0.0.0/0; R3 becomes an ASBR", hi: "0.0.0.0/0 ka type 5 LSA banata hai; R3 ASBR ban jaata hai" } },
          ],
          note: {
            en: "R4 mirrors R2 with `network 10.0.34.0 0.0.0.3 area 0`, `network 10.0.45.0 0.0.0.3 area 2` and `area 2 range 10.2.0.0 255.255.252.0`. To summarise external routes, the command is different: `summary-address` on the ASBR.",
            hi: "R4, R2 jaisa hi hai: `network 10.0.34.0 0.0.0.3 area 0`, `network 10.0.45.0 0.0.0.3 area 2` aur `area 2 range 10.2.0.0 255.255.252.0`. External routes summarise karne ka command alag hai: ASBR par `summary-address`.",
          },
        },
        {
          type: "cli",
          title: { en: "R1's LSDB: only area 1 in detail", hi: "R1 ka LSDB: sirf area 1 ki detail" },
          lines: [
            { prompt: "R1#", cmd: "show ip ospf database" },
            { out: "            OSPF Router with ID (1.1.1.1) (Process ID 1)" },
            { out: "                Router Link States (Area 1)" },
            { out: "Link ID         ADV Router      Age         Seq#       Checksum Link count" },
            { out: "1.1.1.1         1.1.1.1         412         0x80000004 0x00A1B2 6", comment: { en: "Type 1 from R1: p2p link, its subnet, 4 LANs", hi: "R1 ka type 1: p2p link, uska subnet, 4 LANs" } },
            { out: "2.2.2.2         2.2.2.2         409         0x80000003 0x00C3D4 2" },
            { out: "                Summary Net Link States (Area 1)" },
            { out: "Link ID         ADV Router      Age         Seq#       Checksum" },
            { out: "10.0.23.0       2.2.2.2         402         0x80000001 0x0015E6" },
            { out: "10.0.34.0       2.2.2.2         398         0x80000001 0x00F803" },
            { out: "10.0.45.0       2.2.2.2         390         0x80000001 0x00B740" },
            { out: "10.2.0.0        2.2.2.2         120         0x80000001 0x0091A7", comment: { en: "Type 3 created by R2, not by R4", hi: "Type 3 R2 ne banaya, R4 ne nahi" } },
            { out: "                Summary ASB Link States (Area 1)" },
            { out: "Link ID         ADV Router      Age         Seq#       Checksum" },
            { out: "3.3.3.3         2.2.2.2         96          0x80000001 0x00D25C", comment: { en: "Type 4: how to reach ASBR 3.3.3.3", hi: "Type 4: ASBR 3.3.3.3 tak kaise pahunchein" } },
            { out: "                Type-5 AS External Link States" },
            { out: "Link ID         ADV Router      Age         Seq#       Checksum Tag" },
            { out: "0.0.0.0         3.3.3.3         96          0x80000001 0x00E28B 1", comment: { en: "Type 5 still names R3", hi: "Type 5 mein abhi bhi R3 ka naam" } },
          ],
        },
      ],
    },
    {
      id: "stub-areas",
      heading: { en: "Stub areas: keep external routes out", hi: "Stub areas: external routes ko bahar rakho" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Area 2 has one exit: R4. Every packet leaving area 2 goes through R4 whatever the destination, so R5 gains nothing from holding hundreds of type 5 LSAs. **Stub area** types tell the ABR to replace that detail with a default route.",
            hi: "Area 2 ka ek hi exit hai: R4. Destination kuch bhi ho, area 2 se nikalne wala har packet R4 se hi jaata hai, toh R5 ko saikdon type 5 LSAs rakhne se koi fayda nahi. **Stub area** types ABR ko bolte hain ki yeh detail hata kar ek default route de do.",
          },
        },
        {
          type: "table",
          caption: { en: "Area types (configure them on every router in the area)", hi: "Area types (area ke har router par configure karo)" },
          columns: [{ en: "Area type", hi: "Area type" }, { en: "Command", hi: "Command" }, { en: "What the area receives", hi: "Area ko kya milta hai" }],
          rows: [
            [{ en: "Normal", hi: "Normal" }, { en: "(none)", hi: "(kuch nahi)" }, { en: "Types 1, 2, 3, 4 and 5", hi: "Types 1, 2, 3, 4 aur 5" }],
            [{ en: "Stub", hi: "Stub" }, "area 2 stub", { en: "Types 1, 2, 3, plus a type 3 default from the ABR. No 4 or 5", hi: "Types 1, 2, 3, aur ABR se ek type 3 default. 4 ya 5 nahi" }],
            [{ en: "Totally stubby (Cisco)", hi: "Totally stubby (Cisco)" }, { en: "area 2 stub no-summary on the ABR; area 2 stub on the others", hi: "ABR par area 2 stub no-summary; baaki par area 2 stub" }, { en: "Types 1 and 2, plus only the type 3 default", hi: "Types 1 aur 2, aur sirf type 3 default" }],
            ["NSSA", "area 2 nssa", { en: "Types 1, 2, 3 and 7. No type 4 or 5, and no automatic default. An ASBR inside the area injects type 7 LSAs, which the ABR turns into type 5", hi: "Types 1, 2, 3 aur 7. Type 4 ya 5 nahi, aur default apne aap nahi aata. Area ke andar ka ASBR type 7 LSAs daalta hai, jinhe ABR type 5 mein badalta hai" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "After `area 2 stub` on R4 and R5, R5's `O*E2 0.0.0.0/0` disappears and is replaced by `O*IA 0.0.0.0/0 [110/2]`: the type 3 default from R4 (cost 1 by default) plus R5's own link cost of 1. The `O IA` routes stay.",
            hi: "R4 aur R5 par `area 2 stub` ke baad R5 ka `O*E2 0.0.0.0/0` gayab ho jaata hai aur uski jagah `O*IA 0.0.0.0/0 [110/2]` aata hai: R4 ka type 3 default (default cost 1) plus R5 ke apne link ki cost 1. `O IA` routes bane rehte hain.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The stub flag is in every Hello", hi: "Stub flag har Hello mein hota hai" },
          text: {
            en: "Lesson 3.6 listed the stub flag as a neighbour requirement. If you configure `area 2 stub` on R4 but not on R5, their Hellos disagree and the adjacency goes down. Area 0 can never be a stub, and a stub or totally stubby area cannot contain an ASBR; use an NSSA for that.",
            hi: "Lesson 3.6 mein stub flag neighbour requirement tha. Agar R4 par `area 2 stub` lagao aur R5 par nahi, toh dono ke Hellos match nahi karenge aur adjacency down ho jaayegi. Area 0 kabhi stub nahi ho sakta, aur stub ya totally stubby area mein ASBR nahi ho sakta; uske liye NSSA use karo.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Area", def: { en: "A group of OSPF interfaces that share one LSDB; detail stays inside it and only summaries leave it.", hi: "OSPF interfaces ka group jo ek LSDB share karta hai; detail andar rehti hai aur bahar sirf summaries jaati hain." } },
    { term: "Backbone (area 0)", def: { en: "The central area that every other area must connect to; inter-area traffic passes through it.", hi: "Central area jisse baaki har area ka judna zaroori hai; inter-area traffic isi se guzarta hai." } },
    { term: "ABR", def: { en: "Area Border Router: has interfaces in area 0 and another area, keeps one LSDB per area and creates type 3 and type 4 LSAs.", hi: "Area Border Router: iske interfaces area 0 aur kisi doosre area mein hote hain, har area ka alag LSDB rakhta hai aur type 3 aur type 4 LSAs banata hai." } },
    { term: "ASBR", def: { en: "Autonomous System Boundary Router: brings routes from outside OSPF into OSPF as type 5 (or type 7) LSAs.", hi: "Autonomous System Boundary Router: OSPF ke bahar ke routes ko type 5 (ya type 7) LSAs bana kar OSPF mein laata hai." } },
    { term: "Type 3 summary LSA", def: { en: "An LSA an ABR creates for one prefix from another area, carrying only the prefix and the ABR's cost to it.", hi: "ABR ka banaya LSA jo doosre area ke ek prefix ke liye hota hai, isme sirf prefix aur ABR ki cost hoti hai." } },
    { term: "Type 5 external LSA", def: { en: "An LSA from an ASBR describing an external route; it floods through all normal areas unchanged.", hi: "ASBR ka LSA jo external route batata hai; yeh saare normal areas mein bina badle flood hota hai." } },
    { term: "area range", def: { en: "ABR command that replaces an area's component prefixes with one summary type 3 LSA.", hi: "ABR ka command jo area ke chhote prefixes ki jagah ek summary type 3 LSA bhejta hai." } },
    { term: "Stub area", def: { en: "An area that receives no type 4 or type 5 LSAs and uses a default route from its ABR instead.", hi: "Aisa area jise type 4 ya type 5 LSAs nahi milte aur jo inki jagah ABR ka default route use karta hai." } },
  ],
  commands: [
    { cmd: "network 10.0.12.0 0.0.0.3 area 1", mode: "Router configuration", does: { en: "Enable OSPF in area 1 on interfaces in this range", hi: "Is range ke interfaces par area 1 mein OSPF enable karta hai" } },
    { cmd: "area 1 range 10.1.0.0 255.255.252.0", mode: "Router configuration (on the ABR)", does: { en: "Summarise area 1 prefixes into one type 3 LSA", hi: "Area 1 ke prefixes ko ek type 3 LSA mein summarise karta hai" } },
    { cmd: "default-information originate", mode: "Router configuration (on the ASBR)", does: { en: "Advertise this router's default route as a type 5 LSA, E2 metric 1", hi: "Router ke default route ko type 5 LSA bana kar advertise karta hai, E2 metric 1" } },
    { cmd: "redistribute static subnets", mode: "Router configuration (on the ASBR)", does: { en: "Inject static routes as type 5 LSAs, E2 metric 20; newer IOS XE adds `subnets` automatically", hi: "Static routes ko type 5 LSAs bana kar daalta hai, E2 metric 20; naye IOS XE mein `subnets` apne aap lagta hai" } },
    { cmd: "summary-address 198.51.100.0 255.255.255.0", mode: "Router configuration (on the ASBR)", does: { en: "Summarise external routes before they become type 5 LSAs", hi: "External routes ko type 5 LSA banne se pehle summarise karta hai" } },
    { cmd: "area 2 stub", mode: "Router configuration (every router in area 2)", does: { en: "Make area 2 a stub area: no type 4 or 5, default route from the ABR", hi: "Area 2 ko stub area banata hai: type 4 ya 5 nahi, ABR se default route" } },
    { cmd: "area 2 stub no-summary", mode: "Router configuration (ABR only)", does: { en: "Make area 2 totally stubby: also block type 3 except the default", hi: "Area 2 ko totally stubby banata hai: default ke alawa type 3 bhi block" } },
    { cmd: "show ip ospf", mode: "Privileged EXEC", does: { en: "Show the areas this router is in and whether it is an ABR or ASBR", hi: "Router kin areas mein hai aur ABR ya ASBR hai ya nahi, yeh dikhata hai" } },
    { cmd: "show ip ospf database", mode: "Privileged EXEC", does: { en: "List the LSAs per area and type, with their advertising router", hi: "Har area aur type ke LSAs, advertising router ke saath, list karta hai" } },
    { cmd: "show ip ospf border-routers", mode: "Privileged EXEC", does: { en: "List the ABRs and ASBRs this router knows how to reach", hi: "Jin ABRs aur ASBRs tak router pahunch sakta hai, unki list" } },
    { cmd: "show ip route ospf", mode: "Privileged EXEC", does: { en: "Show OSPF routes with codes O, O IA, O E1, O E2", hi: "OSPF routes codes O, O IA, O E1, O E2 ke saath dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Thinking ABRs pass type 1 and type 2 LSAs into other areas. They stay in their own area; the ABR creates type 3 LSAs instead.",
      hi: "Yeh sochna ki ABR type 1 aur type 2 LSAs doosre areas mein bhejta hai. Woh apne area mein hi rehte hain; ABR unki jagah type 3 LSAs banata hai.",
    },
    {
      en: "Configuring `area range` on an internal router or with a wildcard mask. It belongs on the ABR and takes a subnet mask: `area 1 range 10.1.0.0 255.255.252.0`.",
      hi: "`area range` internal router par ya wildcard mask ke saath lagana. Yeh ABR par lagta hai aur subnet mask leta hai: `area 1 range 10.1.0.0 255.255.252.0`.",
    },
    {
      en: "Using `area range` to summarise redistributed routes. External routes are summarised on the ASBR with `summary-address`.",
      hi: "Redistributed routes ko `area range` se summarise karne ki koshish. External routes ASBR par `summary-address` se summarise hote hain.",
    },
    {
      en: "Choosing by metric across route types. OSPF prefers O, then O IA, then E1, then E2, before it looks at the metric.",
      hi: "Alag route types ke beech metric se choose karna. OSPF metric dekhne se pehle O, phir O IA, phir E1, phir E2 prefer karta hai.",
    },
    {
      en: "Configuring `area 2 stub` on the ABR only. The stub flag must match in Hellos, so every router in the area needs it, or the adjacencies drop.",
      hi: "`area 2 stub` sirf ABR par lagana. Hellos mein stub flag match hona chahiye, isliye area ke har router par chahiye, warna adjacencies gir jaati hain.",
    },
    {
      en: "Building an area that connects only to another non-backbone area. Every area must have an ABR into area 0.",
      hi: "Aisa area banana jo sirf kisi doosre non-backbone area se juda ho. Har area ka area 0 mein ek ABR hona zaroori hai.",
    },
  ],
  recap: [
    { en: "Areas shrink the LSDB, contain SPF runs, allow summarisation and hide flaps. Every area attaches to area 0.", hi: "Areas LSDB chhota karte hain, SPF ko apne area tak hi rakhte hain, summarisation possible karte hain aur flaps chhupate hain. Har area area 0 se judta hai." },
    { en: "Roles: internal, backbone, ABR (area 0 + another area), ASBR (injects external routes). One router can hold several.", hi: "Roles: internal, backbone, ABR (area 0 + doosra area), ASBR (external routes laata hai). Ek router ke kai roles ho sakte hain." },
    { en: "Type 1 router and type 2 network stay in their area; type 3 summary and type 4 ASBR summary come from ABRs; type 5 external from the ASBR floods everywhere except stubs; type 7 lives in an NSSA.", hi: "Type 1 router aur type 2 network apne area mein rehte hain; type 3 summary aur type 4 ASBR summary ABR banata hai; type 5 external ASBR ka, stubs ke alawa har jagah flood hota hai; type 7 NSSA mein rehta hai." },
    { en: "O = intra-area, O IA = inter-area, O E1/E2 = external. Preference: O > O IA > E1 > E2. E2 keeps the seed metric (20, or 1 for a default); E1 adds internal cost.", hi: "O = intra-area, O IA = inter-area, O E1/E2 = external. Preference: O > O IA > E1 > E2. E2 seed metric hi rakhta hai (20, default ke liye 1); E1 internal cost jodta hai." },
    { en: "Summarise on the ABR with `area X range` (mask, not wildcard) and on the ASBR with `summary-address`.", hi: "ABR par `area X range` se summarise karo (mask, wildcard nahi) aur ASBR par `summary-address` se." },
    { en: "Stub: no type 4/5, default instead. Totally stubby: also no type 3 except the default. NSSA: stub plus a local ASBR using type 7.", hi: "Stub: type 4/5 nahi, unki jagah default. Totally stubby: default ke alawa type 3 bhi nahi. NSSA: stub plus local ASBR jo type 7 use karta hai." },
  ],
  quiz: [
    {
      q: {
        en: "Which router creates the type 3 LSA that describes area 1's prefixes inside area 0?",
        hi: "Area 0 ke andar area 1 ke prefixes batane wala type 3 LSA kaunsa router banata hai?",
      },
      options: [
        { en: "The ASBR", hi: "ASBR" },
        { en: "The DR of the area 0 segment", hi: "Area 0 segment ka DR" },
        { en: "The ABR between area 1 and area 0", hi: "Area 1 aur area 0 ke beech ka ABR" },
        { en: "Every internal router in area 1", hi: "Area 1 ka har internal router" },
      ],
      answer: 2,
      explain: {
        en: "Only an ABR creates type 3 LSAs. It runs SPF on area 1's LSDB and advertises each resulting prefix (or summary) into area 0 with its own cost. Internal routers create type 1 LSAs, DRs type 2, ASBRs type 5.",
        hi: "Type 3 LSAs sirf ABR banata hai. Woh area 1 ke LSDB par SPF chala kar har prefix (ya summary) ko apni cost ke saath area 0 mein advertise karta hai. Internal routers type 1 banate hain, DR type 2, ASBR type 5.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1 shows `O IA 10.2.0.0/22 [110/5] via 10.0.12.2`. What does this tell you?",
        hi: "R1 par `O IA 10.2.0.0/22 [110/5] via 10.0.12.2` dikhta hai. Isse kya pata chalta hai?",
      },
      options: [
        { en: "The prefix is in another area and was learned from a type 3 LSA", hi: "Prefix doosre area mein hai aur type 3 LSA se seekha gaya" },
        { en: "The prefix is external and was learned from a type 5 LSA", hi: "Prefix external hai aur type 5 LSA se seekha gaya" },
        { en: "The prefix is in R1's own area and was learned from a type 1 LSA", hi: "Prefix R1 ke apne area mein hai aur type 1 LSA se seekha gaya" },
        { en: "The route has AD 5 and cost 110", hi: "Route ka AD 5 hai aur cost 110" },
      ],
      answer: 0,
      explain: {
        en: "`IA` means inter-area, which comes from a type 3 summary LSA. In the brackets the first number is the AD (110) and the second is the cost (5). External routes show `E1` or `E2`; intra-area routes show plain `O`.",
        hi: "`IA` matlab inter-area, jo type 3 summary LSA se aata hai. Brackets mein pehla number AD (110) hai aur doosra cost (5). External routes par `E1` ya `E2` dikhta hai; intra-area routes par sirf `O`.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A new area 3 is connected only to area 2 through R6. Nothing else changes. What happens?",
        hi: "Naya area 3 sirf R6 ke through area 2 se juda hai. Aur kuch nahi badla. Kya hoga?",
      },
      options: [
        { en: "Area 3 works normally because area 2 forwards its LSAs to area 0", hi: "Area 3 normal chalega kyunki area 2 uske LSAs area 0 ko forward karega" },
        { en: "R6 automatically becomes part of area 0", hi: "R6 apne aap area 0 ka hissa ban jaayega" },
        { en: "Area 3 learns only external routes", hi: "Area 3 sirf external routes seekhega" },
        { en: "Inter-area routes do not reach area 3 or come from it until it connects to area 0 or uses a virtual link", hi: "Jab tak area 3 area 0 se na jude ya virtual link na ho, inter-area routes na area 3 tak pahunchenge na usse aayenge" },
      ],
      answer: 3,
      explain: {
        en: "Inter-area routing in OSPF always goes through the backbone. R6 has no interface in area 0, so it is not a working ABR, and area 3's prefixes are not exchanged with the other areas. The fix is a link into area 0, or a virtual link as a temporary patch.",
        hi: "OSPF mein inter-area routing hamesha backbone se hokar hoti hai. R6 ka koi interface area 0 mein nahi, isliye woh kaam karne wala ABR nahi hai, aur area 3 ke prefixes baaki areas se exchange nahi hote. Fix hai area 0 tak ek link, ya temporary patch ke liye virtual link.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "R3 also redistributes a static route to 198.51.100.0/24. R2 is one hop from R3 and R1 is two hops away, yet both show `O E2 198.51.100.0/24 [110/20]`. Why is the metric the same?",
        hi: "R3 ek static route 198.51.100.0/24 bhi redistribute karta hai. R2, R3 se ek hop door hai aur R1 do hop, phir bhi dono par `O E2 198.51.100.0/24 [110/20]` dikhta hai. Metric same kyun hai?",
      },
      options: [
        { en: "Both paths happen to have the same internal cost", hi: "Dono paths ki internal cost ittefaq se same hai" },
        { en: "An E2 metric is only the external metric; the internal cost to the ASBR is not added", hi: "E2 metric sirf external metric hai; ASBR tak ki internal cost nahi judti" },
        { en: "ABRs reset external metrics to 20 when they forward type 5 LSAs", hi: "ABRs type 5 LSA forward karte waqt external metric 20 kar dete hain" },
        { en: "All external routes always have metric 20", hi: "Saare external routes ka metric hamesha 20 hota hai" },
      ],
      answer: 1,
      explain: {
        en: "E2 is the default external type, and its metric is the seed metric set at the ASBR (20 for redistributed routes). It does not grow with distance. With `metric-type 1` the routes would be E1 and each router would add its internal cost to the ASBR. A default route from `default-information originate` starts at 1, so not every external has 20.",
        hi: "E2 default external type hai, aur iska metric ASBR par set hua seed metric hai (redistributed routes ke liye 20). Yeh doori ke saath nahi badhta. `metric-type 1` lagao toh routes E1 ban jaate aur har router ASBR tak ki apni internal cost jodta. `default-information originate` wala default 1 se shuru hota hai, isliye har external 20 nahi hota.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Area 1 contains 10.1.0.0/24, 10.1.1.0/24, 10.1.2.0/24 and 10.1.3.0/24. Which command on the ABR advertises them into area 0 as one route?",
        hi: "Area 1 mein 10.1.0.0/24, 10.1.1.0/24, 10.1.2.0/24 aur 10.1.3.0/24 hain. ABR par kaunsa command inhe area 0 mein ek route bana kar advertise karega?",
      },
      options: [
        { en: "area 1 range 10.1.0.0 0.0.3.255", hi: "area 1 range 10.1.0.0 0.0.3.255" },
        { en: "summary-address 10.1.0.0 255.255.252.0", hi: "summary-address 10.1.0.0 255.255.252.0" },
        { en: "area 0 range 10.1.0.0 255.255.252.0", hi: "area 0 range 10.1.0.0 255.255.252.0" },
        { en: "area 1 range 10.1.0.0 255.255.252.0", hi: "area 1 range 10.1.0.0 255.255.252.0" },
      ],
      answer: 3,
      explain: {
        en: "Four /24s starting at 10.1.0.0 fit in a /22, mask 255.255.252.0. `area range` names the area the prefixes come **from** (area 1) and takes a subnet mask, not a wildcard. `summary-address` is for external routes on an ASBR.",
        hi: "10.1.0.0 se shuru hone wale chaar /24 ek /22 mein aate hain, mask 255.255.252.0. `area range` mein woh area likhte hain jahan **se** prefixes aate hain (area 1), aur yeh subnet mask leta hai, wildcard nahi. `summary-address` ASBR par external routes ke liye hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "Area 2 is configured as a stub area on all its routers. What changes on R5, inside area 2?",
        hi: "Area 2 ke saare routers par stub area configure kiya gaya. Area 2 ke andar R5 par kya badlega?",
      },
      options: [
        { en: "It loses all inter-area routes and keeps the external ones", hi: "Saare inter-area routes chale jaayenge aur external bane rahenge" },
        { en: "It stops forming adjacencies with R4", hi: "R4 ke saath adjacency banana band kar dega" },
        { en: "Type 4 and type 5 LSAs no longer arrive, and a type 3 default route from the ABR replaces them", hi: "Type 4 aur type 5 LSAs aana band ho jaate hain, aur ABR ka type 3 default route unki jagah le leta hai" },
        { en: "It starts translating type 7 LSAs into type 5", hi: "Woh type 7 LSAs ko type 5 mein badalna shuru kar dega" },
      ],
      answer: 2,
      explain: {
        en: "A stub area blocks type 4 and type 5 and gets a default route as a type 3 LSA from the ABR, so R5 shows `O*IA 0.0.0.0/0`. Inter-area routes stay; removing those too is totally stubby. The adjacency only drops if the stub setting is missing on one side. Type 7 translation belongs to an NSSA's ABR.",
        hi: "Stub area type 4 aur type 5 block karta hai aur ABR se type 3 LSA ke roop mein default route paata hai, isliye R5 par `O*IA 0.0.0.0/0` dikhta hai. Inter-area routes rehte hain; unhe bhi hatana totally stubby hai. Adjacency tabhi girti hai jab ek side par stub setting na ho. Type 7 translation NSSA ke ABR ka kaam hai.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "Wf755546JhA",
      title: "OSPF LSA - the BEST explanation of the Types of OSPF LSAs",
      channel: "Practical Networking",
      lang: "en",
      note: { en: "Clear diagrams of LSA types 1 to 5 and of intra-area, inter-area and external routes.", hi: "LSA types 1 se 5 aur intra-area, inter-area aur external routes ke clear diagrams." },
    },
    {
      id: "W-pqyjNc0VM",
      title: "FREE CCNA Lab 055: OSPF (Part 2: Multi-Area)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "A short Packet Tracer lab that configures OSPF across several areas and checks the routes on each router.", hi: "Chhota Packet Tracer lab jisme OSPF kai areas mein configure hota hai aur har router par routes check hote hain." },
    },
    {
      id: "U_Duis1g3bQ",
      title: "50. CCNP Encor + Enarsi | OSPF - Introduction to LSA Types | CCNP Full Hindi Course",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi introduction to the LSA types and where each one floods.", hi: "LSA types aur har type kahan flood hota hai, iska Hindi introduction." },
    },
    {
      id: "x6V9dIKeKRM",
      title: "63. Free CCNA (NEW) | OSPF - Multi Area Configuration Lab | CCNA 200-301 Complete Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi lab walkthrough of a multi-area OSPF configuration.", hi: "Multi-area OSPF configuration ka Hindi lab walkthrough." },
    },
  ],
  lab: {
    title: { en: "Build three areas and watch the LSAs", hi: "Teen areas banao aur LSAs dekho" },
    steps: [
      { en: "Build R1 to R5 in a line as in this lesson. Give R1 four loopbacks 10.1.0.1/24 to 10.1.3.1/24 with `ip ospf network point-to-point` so they advertise as /24s, and do the same on R5 with 10.2.0.1/24 to 10.2.3.1/24.", hi: "Is lesson jaisa R1 se R5 ek line mein banao. R1 par chaar loopbacks 10.1.0.1/24 se 10.1.3.1/24 banao aur `ip ospf network point-to-point` lagao taaki woh /24 ke roop mein advertise hon; R5 par 10.2.0.1/24 se 10.2.3.1/24 ke saath yahi karo." },
      { en: "Configure areas 1, 0 and 2 with fixed router IDs. On R2 and R4 run `show ip ospf` and confirm \"It is an area border router\".", hi: "Fixed router IDs ke saath areas 1, 0 aur 2 configure karo. R2 aur R4 par `show ip ospf` chalao aur \"It is an area border router\" confirm karo." },
      { en: "On R1 run `show ip ospf database`. Count the Router LSAs and note which ADV Router created each Summary Net LSA.", hi: "R1 par `show ip ospf database` chalao. Router LSAs gino aur dekho har Summary Net LSA kis ADV Router ne banaya." },
      { en: "Add `area 1 range 10.1.0.0 255.255.252.0` on R2 and `area 2 range 10.2.0.0 255.255.252.0` on R4. Compare `show ip route ospf` on R1 and R5 before and after.", hi: "R2 par `area 1 range 10.1.0.0 255.255.252.0` aur R4 par `area 2 range 10.2.0.0 255.255.252.0` lagao. Pehle aur baad mein R1 aur R5 par `show ip route ospf` compare karo." },
      { en: "Add a static default on R3 with `default-information originate`. Find the `O*E2` route and the type 4 and type 5 LSAs on R1.", hi: "R3 par static default ke saath `default-information originate` lagao. R1 par `O*E2` route aur type 4 aur type 5 LSAs dhoondho." },
      { en: "Configure `area 2 stub` on R4 only and watch the adjacency drop, then add it on R5 and check that R5 now has `O*IA 0.0.0.0/0`.", hi: "Sirf R4 par `area 2 stub` lagao aur adjacency girte dekho, phir R5 par bhi lagao aur check karo ki ab R5 par `O*IA 0.0.0.0/0` hai." },
    ],
  },
};

export default lesson;
