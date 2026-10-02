import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "dynamic-routing",
  intro: {
    en: "Static routes are fine for a handful of networks, but they never react to a failure further along the path. If a link two routers away fails, your static route keeps sending traffic towards it until someone logs in and changes it. A dynamic routing protocol lets routers tell each other which networks they can reach, choose the best path by a metric, and find a new path on their own when something breaks. Every enterprise network you work on will run at least one.",
    hi: "Kuch networks ke liye static routes theek hain, lekin path mein aage kahin failure ho toh woh react nahi karte. Do router door koi link fail ho jaaye, toh tumhara static route traffic usi taraf bhejta rehta hai, jab tak koi login karke use badle nahi. Dynamic routing protocol se routers ek doosre ko batate hain ki woh kaunse networks tak pahunch sakte hain, metric dekh kar best path chunte hain, aur kuch toote toh khud naya path dhoondh lete hain. Tum jis bhi enterprise network par kaam karoge, usme kam se kam ek routing protocol chal raha hoga.",
  },
  outcomes: [
    { en: "Explain what a dynamic routing protocol does that static routes cannot", hi: "Samjha sako ki dynamic routing protocol kya karta hai jo static routes nahi kar sakte" },
    { en: "Classify RIP, EIGRP, OSPF, IS-IS and BGP as IGP or EGP, and as distance vector, advanced distance vector, link state or path vector", hi: "RIP, EIGRP, OSPF, IS-IS aur BGP ko IGP ya EGP mein, aur distance vector, advanced distance vector, link state ya path vector mein classify kar sako" },
    { en: "Predict which path RIP, OSPF and EIGRP would each choose from their metrics", hi: "Metrics dekh kar predict kar sako ki RIP, OSPF aur EIGRP har ek kaunsa path chunega" },
    { en: "Explain convergence and why link-state protocols usually converge faster than RIP", hi: "Convergence samjha sako, aur yeh bhi ki link-state protocols aam taur par RIP se jaldi converge kyun hote hain" },
    { en: "Read `show ip route` entries learned by a routing protocol, including equal-cost paths", hi: "Routing protocol se seekhi gayi `show ip route` entries padh sako, equal-cost paths ke saath" },
    { en: "Configure basic EIGRP with a matching AS number and wildcard `network` statements (beyond the exam, but common on Cisco networks)", hi: "Matching AS number aur wildcard `network` statements ke saath basic EIGRP configure kar sako (exam se aage, lekin Cisco networks mein common)" },
  ],
  sections: [
    {
      id: "why-dynamic",
      heading: { en: "Why routers need to talk to each other", hi: "Routers ko aapas mein baat kyun karni padti hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Take four routers in a square: R1 connects to R2 and R3, and both of those connect to R4. R4 has a LAN, **10.4.4.0/24**. With static routes you would type a route to 10.4.4.0/24 on R1, R2 and R3, and another route on R4 for every network behind the others. Add a fifth router and you touch every box again. If the R2-R4 link fails, R1's static route still sends the traffic to R2. R2 has no other way to R4, so the traffic is dropped, even though the path through R3 is fine.",
            hi: "Chaar routers ek square mein socho: R1 R2 aur R3 se juda hai, aur yeh dono R4 se jude hain. R4 par ek LAN hai, **10.4.4.0/24**. Static routes se tumhe R1, R2 aur R3 par 10.4.4.0/24 ka route type karna padega, aur R4 par baaki routers ke peeche ke har network ka route. Paanchwa router aaya toh phir se har box par jaana padega. Aur agar R2-R4 link fail hua, toh R1 ka static route traffic phir bhi R2 ko hi bhejega. R2 ke paas R4 tak koi doosra raasta nahi, isliye traffic drop hoga, jabki R3 wala path bilkul theek hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "A **dynamic routing protocol** does four jobs for you:",
            hi: "**Dynamic routing protocol** tumhare liye chaar kaam karta hai:",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Finds neighbours**: routers running the same protocol on a shared link discover each other.", hi: "**Neighbours dhoondhta hai**: same link par same protocol chalane wale routers ek doosre ko discover karte hain." },
            { en: "**Shares routes**: each router advertises the networks it knows, so everyone learns remote networks without typing them.", hi: "**Routes share karta hai**: har router apne known networks advertise karta hai, toh sabko remote networks bina type kiye pata chal jaate hain." },
            { en: "**Picks the best path**: when there are several ways to a network, the protocol's **metric** decides which one goes into the routing table.", hi: "**Best path chunta hai**: kisi network tak jaane ke kai raaste hon, toh protocol ka **metric** decide karta hai ki routing table mein kaunsa jaayega." },
            { en: "**Reacts to change**: when a link or router fails, the routers agree on new paths. This is called **convergence**.", hi: "**Change par react karta hai**: link ya router fail ho toh routers naye paths par agree karte hain. Ise **convergence** kehte hain." },
          ],
        },
        {
          type: "table",
          caption: { en: "Static vs dynamic routing", hi: "Static vs dynamic routing" },
          columns: ["", "Static", "Dynamic"],
          rows: [
            [{ en: "Setup", hi: "Setup" }, { en: "One command per route, per router", hi: "Har router par har route ki ek command" }, { en: "Enable the protocol on interfaces once", hi: "Interfaces par ek baar protocol enable karo" }],
            [{ en: "Link fails", hi: "Link fail hone par" }, { en: "Cannot find another path; traffic is dropped unless a floating static backs it up", hi: "Doosra path khud nahi dhoondh sakta; floating static backup na ho toh traffic drop hota hai" }, { en: "Finds another path automatically", hi: "Khud doosra path dhoondh leta hai" }],
            [{ en: "Growth", hi: "Network badhne par" }, { en: "Every new network means edits on many routers", hi: "Har naye network par kai routers edit karne padte hain" }, { en: "New networks are advertised automatically", hi: "Naye networks automatically advertise hote hain" }],
            [{ en: "Cost", hi: "Kharcha" }, { en: "No CPU or bandwidth used", hi: "Koi CPU ya bandwidth use nahi hoti" }, { en: "Uses some CPU, memory and link bandwidth", hi: "Thoda CPU, memory aur link bandwidth use hota hai" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Static routes still have a job", hi: "Static routes ka kaam abhi bhi hai" },
          text: {
            en: "Real networks mix both. A default route to the ISP, a route to a small stub site, or a floating static backup (lesson 3.4) is often static, while the core runs OSPF or EIGRP.",
            hi: "Real networks mein dono mix hote hain. ISP ki taraf default route, kisi chhoti stub site ka route, ya floating static backup (lesson 3.4) aksar static hota hai, jabki core mein OSPF ya EIGRP chalta hai.",
          },
        },
      ],
    },
    {
      id: "igp-egp",
      heading: { en: "IGP vs EGP, and the protocol families", hi: "IGP vs EGP, aur protocol families" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An **autonomous system (AS)** is a network under one organisation's control, such as a company or an ISP. An **IGP (Interior Gateway Protocol)** routes inside one AS: RIP, EIGRP, OSPF and IS-IS. An **EGP (Exterior Gateway Protocol)** routes between autonomous systems. The only EGP in use today is **BGP**, which is how ISPs and large companies exchange routes across the internet.",
            hi: "**Autonomous system (AS)** ek aisa network hai jo ek organisation ke control mein ho, jaise ek company ya ek ISP. **IGP (Interior Gateway Protocol)** ek AS ke andar routing karta hai: RIP, EIGRP, OSPF aur IS-IS. **EGP (Exterior Gateway Protocol)** alag-alag autonomous systems ke beech routing karta hai. Aaj sirf ek EGP use hota hai, **BGP**, aur isi se ISPs aur badi companies internet par routes exchange karti hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "IGPs also differ in **how** they learn routes. That is the algorithm family, and it decides what each router knows about the network.",
            hi: "IGPs is baat mein bhi alag hain ki woh routes **kaise** seekhte hain. Yeh algorithm family hai, aur yahi decide karti hai ki har router ko network ke baare mein kitna pata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The protocols you must be able to place", hi: "Woh protocols jinhe tumhe sahi jagah rakhna aana chahiye" },
          columns: ["Protocol", { en: "Scope", hi: "Scope" }, { en: "Family", hi: "Family" }, "Metric", "AD"],
          rows: [
            ["RIPv2", "IGP", "Distance vector", { en: "Hop count (max 15)", hi: "Hop count (max 15)" }, "120"],
            ["EIGRP", "IGP", "Advanced distance vector", { en: "Bandwidth + delay", hi: "Bandwidth + delay" }, { en: "90 (170 external)", hi: "90 (170 external)" }],
            ["OSPF", "IGP", "Link state", { en: "Cost, from interface bandwidth", hi: "Cost, interface bandwidth se" }, "110"],
            ["IS-IS", "IGP", "Link state", { en: "Cost (10 per interface by default on Cisco)", hi: "Cost (Cisco par default har interface 10)" }, "115"],
            ["BGP", "EGP", "Path vector", { en: "Path attributes, such as AS path", hi: "Path attributes, jaise AS path" }, { en: "20 eBGP, 200 iBGP", hi: "20 eBGP, 200 iBGP" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "AD first, metric second", hi: "Pehle AD, phir metric" },
          text: {
            en: "A metric only compares routes from the **same** protocol. If OSPF and EIGRP both offer 10.4.4.0/24, the router does not compare OSPF cost 3 with EIGRP metric 3328. It picks the lower administrative distance, so the EIGRP route (AD 90) beats OSPF (AD 110). You met this order in lesson 3.2.",
            hi: "Metric sirf **same** protocol ke routes ko compare karta hai. Agar OSPF aur EIGRP dono 10.4.4.0/24 de rahe hain, toh router OSPF cost 3 ko EIGRP metric 3328 se compare nahi karta. Woh kam administrative distance wala route chunta hai, isliye EIGRP route (AD 90) OSPF (AD 110) se jeet jaata hai. Yeh order tumne lesson 3.2 mein dekha tha.",
          },
        },
      ],
    },
    {
      id: "distance-vector",
      heading: { en: "Distance vector: routing by rumour", hi: "Distance vector: suni-sunai baat par routing" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A distance-vector router knows only two things about each remote network: the **distance** (the metric) and the **vector** (the direction, meaning the next-hop neighbour). It never sees the shape of the network. It believes whatever its neighbours tell it, which is why this is called **routing by rumour**. RIP is the classic example.",
            hi: "Distance-vector router ko har remote network ke baare mein sirf do cheezein pata hoti hain: **distance** (metric) aur **vector** (direction, yaani next-hop neighbour). Network ka shape use kabhi dikhta hi nahi. Neighbours jo bolte hain, woh maan leta hai, isliye ise **routing by rumour** kehte hain. RIP iska classic example hai.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "R4 is directly connected to 10.4.4.0/24. It tells R2 and R3: \"10.4.4.0/24, 1 hop.\"", hi: "R4 seedha 10.4.4.0/24 se connected hai. Woh R2 aur R3 ko batata hai: \"10.4.4.0/24, 1 hop.\"" },
            { en: "R2 installs 10.4.4.0/24 via R4 with metric 1, adds one hop and tells R1: \"10.4.4.0/24, 2 hops.\" R3 does the same.", hi: "R2 10.4.4.0/24 ko R4 ke through metric 1 ke saath install karta hai, ek hop jodta hai aur R1 ko batata hai: \"10.4.4.0/24, 2 hops.\" R3 bhi yahi karta hai." },
            { en: "R1 has never talked to R4. It hears \"2 hops\" from both R2 and R3, so it installs both paths with metric 2 and shares traffic between them.", hi: "R1 ne kabhi R4 se baat nahi ki. Use R2 aur R3 dono se \"2 hops\" sunne ko milta hai, isliye woh dono paths metric 2 ke saath install karta hai aur traffic dono mein baant deta hai." },
            { en: "Every 30 seconds each RIP router sends its **whole routing table** to its neighbours again, even when nothing has changed.", hi: "Har 30 second mein har RIP router apni **poori routing table** neighbours ko phir se bhejta hai, chahe kuch bhi na badla ho." },
          ],
        },
        {
          type: "list",
          items: [
            { en: "**Metric**: hop count, the number of routers to cross. The maximum is **15**; a route with **16 hops is unreachable**. That limits RIP to small networks.", hi: "**Metric**: hop count, yaani kitne routers cross karne hain. Maximum **15** hai; **16 hops wala route unreachable** hota hai. Isliye RIP sirf chhote networks ke liye hai." },
            { en: "**Updates**: RIPv2 sends to multicast **224.0.0.9** every 30 seconds and carries the subnet mask. RIPv1 used broadcast and sent no mask. RIPng is the IPv6 version.", hi: "**Updates**: RIPv2 har 30 second mein multicast **224.0.0.9** par bhejta hai aur subnet mask bhi le jaata hai. RIPv1 broadcast use karta tha aur mask nahi bhejta tha. RIPng iska IPv6 version hai." },
            { en: "**Slow news**: if a neighbour silently stops sending updates, RIP waits for its **invalid timer (180 seconds)** before it stops trusting those routes.", hi: "**Khabar dheere pahunchti hai**: agar neighbour chupchaap updates bhejna band kar de, toh RIP un routes par bharosa chhodne se pehle **invalid timer (180 seconds)** ka wait karta hai." },
            { en: "**Loop prevention**: rumours can loop, so RIP uses **split horizon** (never advertise a route back out the interface it was learned on) and **route poisoning** (advertise a dead route with metric 16).", hi: "**Loop prevention**: rumours loop mein ghoom sakte hain, isliye RIP **split horizon** (jis interface se route seekha, usi se wapas advertise mat karo) aur **route poisoning** (dead route ko metric 16 ke saath advertise karo) use karta hai." },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Hop count ignores bandwidth", hi: "Hop count bandwidth ko ignore karta hai" },
          text: {
            en: "Suppose R1 had a direct 10 Mbps link to R4 as well as the 1 Gbps path through R2. RIP would send all traffic over the 10 Mbps link, because 1 hop is less than 2. A slow direct link beats a fast path with more routers.",
            hi: "Maan lo R1 ka R4 tak ek direct 10 Mbps link bhi hai, aur R2 ke through 1 Gbps path bhi. RIP saara traffic 10 Mbps link par bhejega, kyunki 1 hop 2 se kam hai. Kam routers wala slow link, zyada routers wale fast path se jeet jaata hai.",
          },
        },
      ],
    },
    {
      id: "link-state",
      heading: { en: "Link state: every router gets the same map", hi: "Link state: har router ke paas same map" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A link-state router does not pass on its conclusions. It describes **its own links** (its neighbours, its networks and the cost of each) in a **Link-State Advertisement (LSA)** and floods that LSA to every router in the area. Other routers copy it unchanged and pass it on. So R1 receives R4's own description of R4, not a rumour from R2.",
            hi: "Link-state router apne nateeje aage nahi bhejta. Woh **apne links** (apne neighbours, apne networks aur har ek ki cost) ko ek **Link-State Advertisement (LSA)** mein describe karta hai aur us LSA ko area ke har router tak flood karta hai. Baaki routers use bina badle copy karke aage bhej dete hain. Toh R1 ko R4 ke baare mein R4 ka apna description milta hai, R2 ki suni-sunai baat nahi.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "Each router floods its LSA. Every router stores all the LSAs in its **link-state database (LSDB)**.", hi: "Har router apna LSA flood karta hai. Har router saare LSAs apne **link-state database (LSDB)** mein store karta hai." },
            { en: "When flooding finishes, every router in the area has an **identical LSDB**: the same map of routers, links and costs.", hi: "Flooding khatam hone par area ke har router ka **LSDB ek jaisa** hota hai: routers, links aur costs ka same map." },
            { en: "Each router runs the **SPF (Dijkstra)** algorithm on that map with **itself as the root**, and puts the lowest-cost path to each network in its routing table.", hi: "Har router us map par **SPF (Dijkstra)** algorithm chalata hai, **khud ko root** maan kar, aur har network ka lowest-cost path apni routing table mein daal deta hai." },
            { en: "When a link changes, the routers at each end flood a new LSA at once. Everyone updates the map and reruns SPF. There is no 30-second full-table update.", hi: "Jab koi link badalta hai, uske dono end wale routers turant naya LSA flood karte hain. Sab apna map update karke SPF dobara chalate hain. 30 second wala full-table update yahan nahi hota." },
          ],
        },
        {
          type: "p",
          text: {
            en: "**OSPF** is the link-state protocol on the CCNA exam. Its metric is **cost = reference bandwidth / interface bandwidth**, with a default reference of 100 Mbps. That makes a 10 Mbps link cost 10 and both FastEthernet and GigabitEthernet cost 1. In the square topology, R1's cost to 10.4.4.0/24 is 1 + 1 + 1 = 3 through R2 and also 3 through R3. OSPF sends Hellos to **224.0.0.5**, and refreshes each LSA every 30 minutes even without a change. Lessons 3.6 and 3.7 cover OSPF in detail. **IS-IS** is the other link-state IGP, common in large ISP networks.",
            hi: "CCNA exam mein link-state protocol **OSPF** hai. Iska metric hai **cost = reference bandwidth / interface bandwidth**, aur default reference 100 Mbps hota hai. Isliye 10 Mbps link ki cost 10 hoti hai, aur FastEthernet aur GigabitEthernet dono ki cost 1. Square topology mein R1 ki 10.4.4.0/24 tak cost R2 ke through 1 + 1 + 1 = 3 hai, aur R3 ke through bhi 3. OSPF Hellos **224.0.0.5** par bhejta hai, aur har LSA ko har 30 minute mein refresh karta hai, change na ho tab bhi. OSPF ki detail lesson 3.6 aur 3.7 mein hai. **IS-IS** doosra link-state IGP hai, jo bade ISP networks mein common hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "The price of a full map", hi: "Poore map ki keemat" },
          text: {
            en: "Every router holds the whole LSDB and runs SPF, so link state needs more memory and CPU than distance vector. In very large networks OSPF is split into areas to keep the map small (lesson 7.2).",
            hi: "Har router poora LSDB rakhta hai aur SPF chalata hai, isliye link state ko distance vector se zyada memory aur CPU chahiye. Bahut bade networks mein map chhota rakhne ke liye OSPF ko areas mein baant dete hain (lesson 7.2).",
          },
        },
      ],
    },
    {
      id: "eigrp",
      heading: { en: "EIGRP: advanced distance vector", hi: "EIGRP: advanced distance vector" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**EIGRP** was created by Cisco. Cisco published it as an informational RFC (RFC 7868) in 2016, but you will still find it mostly on Cisco devices. It is a distance-vector protocol at heart: a router learns routes from its neighbours and never builds a full map. What makes it \"advanced\" is everything around that:",
            hi: "**EIGRP** Cisco ne banaya. Cisco ne 2016 mein ise informational RFC (RFC 7868) ke roop mein publish kiya, lekin yeh abhi bhi zyadatar Cisco devices par hi milta hai. Andar se yeh distance-vector protocol hai: router neighbours se routes seekhta hai aur poora map kabhi nahi banata. Isko \"advanced\" banati hain uske aas-paas ki cheezein:",
          },
        },
        {
          type: "list",
          items: [
            { en: "It forms **neighbour relationships** with Hellos to multicast **224.0.0.10** (every 5 seconds on Ethernet, hold time 15 seconds).", hi: "Yeh multicast **224.0.0.10** par Hellos bhej kar **neighbour relationships** banata hai (Ethernet par har 5 second, hold time 15 second)." },
            { en: "It sends updates **only when something changes**, and only the part that changed. No periodic full tables.", hi: "Yeh updates **sirf tab bhejta hai jab kuch badle**, aur sirf utna hissa jo badla. Periodic full tables nahi." },
            { en: "Its **DUAL** algorithm keeps a loop-free backup path (a feasible successor) ready when one exists, so it can switch paths almost instantly. Lesson 7.3 goes deeper.", hi: "Iska **DUAL** algorithm, jab possible ho, ek loop-free backup path (feasible successor) ready rakhta hai, isliye path lagbhag turant switch ho jaata hai. Lesson 7.3 mein iski detail hai." },
            { en: "Its default metric uses the **slowest bandwidth** along the path plus the **total delay**, so it prefers fast paths, unlike RIP.", hi: "Iska default metric path ki **sabse slow bandwidth** aur **total delay** use karta hai, isliye RIP ke ulat yeh fast paths ko prefer karta hai." },
            { en: "It is the only IGP here that can **load-balance over unequal-cost paths**, with the `variance` command.", hi: "Yahan sirf yahi IGP hai jo `variance` command se **unequal-cost paths par load-balance** kar sakta hai." },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "How much of this the exam wants", hi: "Exam isme se kitna maangta hai" },
          text: {
            en: "CCNA 200-301 v1.1 asks you to configure only OSPF (topic 3.4). For RIP, EIGRP, IS-IS and BGP you need the family, the metric, the AD and how their routes look in `show ip route` (topics 3.1 and 3.2). The EIGRP configuration below goes beyond the exam. It is here because you will meet EIGRP on real Cisco networks, and the wildcard `network` command works the same way in OSPF.",
            hi: "CCNA 200-301 v1.1 mein configure sirf OSPF karna aana chahiye (topic 3.4). RIP, EIGRP, IS-IS aur BGP ke liye tumhe family, metric, AD aur `show ip route` mein unke routes kaise dikhte hain, itna pata hona chahiye (topics 3.1 aur 3.2). Neeche wala EIGRP configuration exam se aage hai. Yeh isliye diya hai kyunki real Cisco networks mein EIGRP milta hai, aur wildcard `network` command OSPF mein bhi isi tarah kaam karta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Two routers only become EIGRP neighbours if they use the **same AS number**. The `network` command takes a **wildcard mask** and does not advertise the network you type. It turns EIGRP on for every interface whose IP address falls in that range; EIGRP then advertises those interfaces' subnets with their real masks. Here is R4:",
            hi: "Do routers EIGRP neighbours tabhi bante hain jab dono ka **AS number same** ho. `network` command **wildcard mask** leta hai, aur jo network tum type karte ho use advertise nahi karta. Yeh un sab interfaces par EIGRP on karta hai jinka IP address us range mein aata hai; phir EIGRP un interfaces ke subnets ko unke asli masks ke saath advertise karta hai. Yeh raha R4:",
          },
        },
        {
          type: "cli",
          title: { en: "Basic EIGRP on R4 (AS 100)", hi: "R4 par basic EIGRP (AS 100)" },
          lines: [
            { prompt: "R4(config)#", cmd: "router eigrp 100", comment: { en: "100 is the AS number; R2 and R3 must use 100 too", hi: "100 AS number hai; R2 aur R3 par bhi 100 hi hona chahiye" } },
            { prompt: "R4(config-router)#", cmd: "network 10.0.24.0 0.0.0.3", comment: { en: "Matches Gi0/0 (10.0.24.2), the link to R2", hi: "Gi0/0 (10.0.24.2) match hota hai, R2 wala link" } },
            { prompt: "R4(config-router)#", cmd: "network 10.0.34.0 0.0.0.3", comment: { en: "Matches Gi0/1 (10.0.34.2), the link to R3", hi: "Gi0/1 (10.0.34.2) match hota hai, R3 wala link" } },
            { prompt: "R4(config-router)#", cmd: "network 10.4.4.0 0.0.0.255", comment: { en: "Matches Gi0/2 (10.4.4.1), the LAN", hi: "Gi0/2 (10.4.4.1) match hota hai, LAN" } },
            { prompt: "R4(config-router)#", cmd: "passive-interface GigabitEthernet0/2", comment: { en: "Still advertise the LAN, but send no Hellos to the PCs", hi: "LAN advertise hota rahega, lekin PCs ki taraf Hellos nahi jaayenge" } },
            { out: "%DUAL-5-NBRCHANGE: EIGRP-IPv4 100: Neighbor 10.0.24.1 (GigabitEthernet0/0) is up: new adjacency" },
            { out: "%DUAL-5-NBRCHANGE: EIGRP-IPv4 100: Neighbor 10.0.34.1 (GigabitEthernet0/1) is up: new adjacency" },
          ],
          note: {
            en: "One line, `network 10.0.0.0 0.255.255.255`, would match all three interfaces. Without a wildcard, IOS assumes the classful mask, so `network 10.0.0.0` does the same.",
            hi: "Ek hi line `network 10.0.0.0 0.255.255.255` teeno interfaces match kar leti. Wildcard na do toh IOS classful mask maan leta hai, isliye `network 10.0.0.0` bhi yahi karega.",
          },
        },
        {
          type: "cli",
          title: { en: "Checking the neighbours from R1", hi: "R1 se neighbours check karna" },
          lines: [
            { prompt: "R1#", cmd: "show ip eigrp neighbors" },
            { out: "EIGRP-IPv4 Neighbors for AS(100)" },
            { out: "H   Address                 Interface              Hold Uptime   SRTT   RTO  Q  Seq" },
            { out: "                                                   (sec)         (ms)       Cnt Num" },
            { out: "1   10.0.13.2               Gi0/1                    12 00:05:31    1   100  0  12", comment: { en: "R3", hi: "R3" } },
            { out: "0   10.0.12.2               Gi0/0                    13 00:05:40    1   100  0  15", comment: { en: "R2", hi: "R2" } },
          ],
        },
      ],
    },
    {
      id: "metrics-convergence-ecmp",
      heading: { en: "Metrics, convergence and equal-cost paths", hi: "Metrics, convergence aur equal-cost paths" },
      blocks: [
        {
          type: "table",
          caption: { en: "What each metric looks at", hi: "Har metric kya dekhta hai" },
          columns: ["Protocol", "Metric", { en: "Based on", hi: "Kis par based" }, { en: "Blind spot", hi: "Kamzori" }],
          rows: [
            ["RIP", { en: "Hop count", hi: "Hop count" }, { en: "Number of routers to cross", hi: "Kitne routers cross karne hain" }, { en: "Ignores bandwidth completely", hi: "Bandwidth ko bilkul ignore karta hai" }],
            ["OSPF", "Cost", { en: "Sum of interface costs; 100 Mbps reference / bandwidth", hi: "Interface costs ka sum; 100 Mbps reference / bandwidth" }, { en: "With the default reference, 100 Mbps, 1 Gbps and 10 Gbps all cost 1", hi: "Default reference par 100 Mbps, 1 Gbps aur 10 Gbps sab ki cost 1" }],
            ["EIGRP", { en: "Composite", hi: "Composite" }, { en: "Slowest bandwidth on the path + total delay", hi: "Path ki sabse slow bandwidth + total delay" }, { en: "Large numbers that are hard to work out by hand", hi: "Bade numbers jo haath se nikalna mushkil hai" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "**Convergence** is the time from a change (a link fails, a router boots) until every router has agreed on the new best paths. Until then, some routers may send traffic into a dead link or even around a loop. RIP converges slowly when it has to wait on timers. OSPF floods the change and reruns SPF, usually within seconds. EIGRP with a feasible successor switches almost at once.",
            hi: "**Convergence** woh time hai jo kisi change (link fail hua, router boot hua) se lekar tab tak lagta hai jab tak har router naye best paths par agree na kar le. Tab tak kuch routers traffic dead link mein ya loop mein bhi bhej sakte hain. RIP ko jab timers ka wait karna pade, tab woh dheere converge hota hai. OSPF change flood karke SPF dobara chalata hai, aam taur par kuch seconds mein. Feasible successor ho toh EIGRP lagbhag turant switch kar leta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "When one protocol finds **two or more paths with the same best metric**, the router installs all of them and shares traffic across them. This is **equal-cost multipath (ECMP)**. IOS installs up to 4 equal-cost paths by default for RIP, OSPF and EIGRP; the `maximum-paths` command under the routing process changes that. In `show ip route` you see one prefix with several `via` lines:",
            hi: "Jab ek protocol ko **same best metric wale do ya zyada paths** milte hain, toh router sabko install karta hai aur traffic un sab mein baant deta hai. Ise **equal-cost multipath (ECMP)** kehte hain. IOS by default RIP, OSPF aur EIGRP ke liye 4 equal-cost paths tak install karta hai; routing process ke andar `maximum-paths` command se yeh badal sakte ho. `show ip route` mein ek prefix ke neeche kai `via` lines dikhti hain:",
          },
        },
        {
          type: "cli",
          title: { en: "R1 learns the square through EIGRP", hi: "R1 EIGRP se square seekh leta hai" },
          lines: [
            { prompt: "R1#", cmd: "show ip route" },
            { out: "Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP" },
            { out: "       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area" },
            { out: "Gateway of last resort is not set" },
            { out: "      10.0.0.0/8 is variably subnetted, 7 subnets, 3 masks" },
            { out: "C        10.0.12.0/30 is directly connected, GigabitEthernet0/0" },
            { out: "L        10.0.12.1/32 is directly connected, GigabitEthernet0/0" },
            { out: "C        10.0.13.0/30 is directly connected, GigabitEthernet0/1" },
            { out: "L        10.0.13.1/32 is directly connected, GigabitEthernet0/1" },
            { out: "D        10.0.24.0/30 [90/3072] via 10.0.12.2, 00:04:10, GigabitEthernet0/0", comment: { en: "D = EIGRP; AD 90, metric 3072", hi: "D ka matlab EIGRP; AD 90 aur metric 3072" } },
            { out: "D        10.0.34.0/30 [90/3072] via 10.0.13.2, 00:04:10, GigabitEthernet0/1" },
            { out: "D        10.4.4.0/24 [90/3328] via 10.0.13.2, 00:04:08, GigabitEthernet0/1", comment: { en: "Two lines, same metric: ECMP through R3 and R2", hi: "Do lines, same metric: R3 aur R2 dono se ECMP" } },
            { out: "                     [90/3328] via 10.0.12.2, 00:04:08, GigabitEthernet0/0" },
          ],
          note: {
            en: "If R1 ran RIP instead, the LAN would show as `R  10.4.4.0/24 [120/2]`, and with OSPF as `O  10.4.4.0/24 [110/3]`. Same network, same two paths; only the code, AD and metric change.",
            hi: "Agar R1 par RIP chal raha hota, toh LAN `R  10.4.4.0/24 [120/2]` dikhta, aur OSPF par `O  10.4.4.0/24 [110/3]`. Network wahi, do paths wahi; sirf code, AD aur metric badalte hain.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Autonomous system (AS)", def: { en: "A network under one organisation's control, identified by a number when it runs BGP.", hi: "Ek organisation ke control wala network, jo BGP chalane par ek number se pehchana jaata hai." } },
    { term: "IGP / EGP", def: { en: "An IGP routes inside one AS (RIP, EIGRP, OSPF, IS-IS); an EGP routes between autonomous systems (BGP).", hi: "IGP ek AS ke andar routing karta hai (RIP, EIGRP, OSPF, IS-IS); EGP autonomous systems ke beech routing karta hai (BGP)." } },
    { term: "Distance vector", def: { en: "A protocol family where each router knows only the metric and next hop that its neighbours advertised.", hi: "Protocol family jisme har router ko sirf woh metric aur next hop pata hota hai jo neighbours ne advertise kiya." } },
    { term: "Link state", def: { en: "A protocol family where every router floods a description of its own links, builds the same map and runs SPF on it.", hi: "Protocol family jisme har router apne links ka description flood karta hai, same map banata hai aur us par SPF chalata hai." } },
    { term: "LSDB", def: { en: "The link-state database: all the LSAs a router holds. Identical on every router in an OSPF area.", hi: "Link-state database: router ke paas saare LSAs. OSPF area ke har router par ek jaisa hota hai." } },
    { term: "Metric", def: { en: "The value a routing protocol uses to rank paths to the same network; lower is better.", hi: "Woh value jisse routing protocol same network ke paths ko rank karta hai; kam value behtar hai." } },
    { term: "Convergence", def: { en: "The state where all routers agree on the best paths again after a change, and the time it takes to get there.", hi: "Change ke baad woh state jab saare routers phir se best paths par agree kar lete hain, aur wahan tak pahunchne mein laga time." } },
    { term: "ECMP", def: { en: "Equal-cost multipath: installing several paths with the same best metric and sharing traffic across them.", hi: "Equal-cost multipath: same best metric wale kai paths install karke traffic un sab mein baantna." } },
  ],
  commands: [
    { cmd: "router eigrp 100", mode: "Global configuration", does: { en: "Start EIGRP for AS 100; neighbours must use the same AS number", hi: "AS 100 ke liye EIGRP start karta hai; neighbours ka AS number same hona chahiye" } },
    { cmd: "network 10.0.24.0 0.0.0.3", mode: "Router configuration", does: { en: "Enable EIGRP on interfaces whose IP falls in this wildcard range", hi: "Jin interfaces ka IP is wildcard range mein aata hai, un par EIGRP enable karta hai" } },
    { cmd: "passive-interface GigabitEthernet0/2", mode: "Router configuration", does: { en: "Advertise the interface's subnet but send no Hellos out of it", hi: "Interface ka subnet advertise karta hai, lekin us se Hellos nahi bhejta" } },
    { cmd: "maximum-paths 4", mode: "Router configuration", does: { en: "Set how many equal-cost paths the protocol may install", hi: "Protocol kitne equal-cost paths install kar sakta hai, yeh set karta hai" } },
    { cmd: "show ip route", mode: "Privileged EXEC", does: { en: "Show the routing table with the source code (R, D, O), AD and metric of each route", hi: "Routing table dikhata hai, har route ke source code (R, D, O), AD aur metric ke saath" } },
    { cmd: "show ip eigrp neighbors", mode: "Privileged EXEC", does: { en: "List EIGRP neighbours, their interfaces and uptime", hi: "EIGRP neighbours, unke interfaces aur uptime list karta hai" } },
    { cmd: "show ip protocols", mode: "Privileged EXEC", does: { en: "Show which routing protocols run, their networks, neighbours and AD", hi: "Kaunse routing protocols chal rahe hain, unke networks, neighbours aur AD dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Comparing metrics across protocols, such as OSPF cost 3 against EIGRP metric 3328. The router uses AD to choose between protocols; metrics only rank routes from the same protocol.",
      hi: "Alag protocols ke metrics compare karna, jaise OSPF cost 3 vs EIGRP metric 3328. Protocols ke beech router AD se decide karta hai; metric sirf same protocol ke routes ko rank karta hai.",
    },
    {
      en: "Thinking the EIGRP `network` command advertises exactly the prefix you type. It enables EIGRP on matching interfaces, and each interface's own subnet is advertised.",
      hi: "Yeh sochna ki EIGRP `network` command wahi prefix advertise karta hai jo tumne type kiya. Yeh matching interfaces par EIGRP enable karta hai, aur har interface ka apna subnet advertise hota hai.",
    },
    {
      en: "Using different AS numbers, such as `router eigrp 100` on R1 and `router eigrp 200` on R2. They never become neighbours. (OSPF process IDs, by contrast, do not have to match.)",
      hi: "Alag AS numbers use karna, jaise R1 par `router eigrp 100` aur R2 par `router eigrp 200`. Yeh kabhi neighbours nahi banenge. (OSPF ke process ID ko match karna zaroori nahi hota, woh alag baat hai.)",
    },
    {
      en: "Assuming RIP picks the fastest path. It counts routers only, so a one-hop 10 Mbps link beats a two-hop gigabit path.",
      hi: "Yeh maan lena ki RIP sabse fast path chunta hai. Woh sirf routers ginta hai, isliye one-hop 10 Mbps link two-hop gigabit path se jeet jaata hai.",
    },
    {
      en: "Calling EIGRP a link-state protocol. It is advanced distance vector: it learns routes from neighbours and never holds a full map of the network.",
      hi: "EIGRP ko link-state protocol bolna. Yeh advanced distance vector hai: neighbours se routes seekhta hai aur network ka poora map kabhi nahi rakhta.",
    },
    {
      en: "Forgetting RIP's limit: 15 hops is the maximum, and 16 means unreachable.",
      hi: "RIP ki limit bhool jaana: maximum 15 hops hai, aur 16 ka matlab unreachable.",
    },
  ],
  recap: [
    { en: "Routing protocols find neighbours, share routes, pick the best path by metric and reconverge after failures.", hi: "Routing protocols neighbours dhoondhte hain, routes share karte hain, metric se best path chunte hain aur failure ke baad reconverge karte hain." },
    { en: "IGPs (RIP, EIGRP, OSPF, IS-IS) work inside one AS; BGP is the EGP between autonomous systems.", hi: "IGPs (RIP, EIGRP, OSPF, IS-IS) ek AS ke andar kaam karte hain; BGP autonomous systems ke beech wala EGP hai." },
    { en: "Distance vector trusts neighbours (RIP: hop count, max 15, full table every 30 s, AD 120). Link state floods LSAs, builds one shared map and runs SPF (OSPF: cost, AD 110).", hi: "Distance vector neighbours par bharosa karta hai (RIP: hop count, max 15, har 30 s poori table, AD 120). Link state LSAs flood karke ek shared map banata hai aur SPF chalata hai (OSPF: cost, AD 110)." },
    { en: "EIGRP is advanced distance vector: DUAL, bandwidth + delay, updates only on change, AD 90, AS number must match, `network` uses wildcards.", hi: "EIGRP advanced distance vector hai: DUAL, bandwidth + delay, sirf change par updates, AD 90, AS number match hona chahiye, `network` wildcard use karta hai." },
    { en: "AD chooses between protocols; metric chooses within one protocol; equal best metrics give ECMP (up to 4 paths by default).", hi: "Protocols ke beech AD chunta hai; ek protocol ke andar metric chunta hai; best metric barabar ho toh ECMP milta hai (default 4 paths tak)." },
  ],
  quiz: [
    {
      q: { en: "Which routing protocol is used between autonomous systems, for example between two ISPs?", hi: "Autonomous systems ke beech, jaise do ISPs ke beech, kaunsa routing protocol use hota hai?" },
      options: [
        { en: "OSPF", hi: "OSPF" },
        { en: "EIGRP", hi: "EIGRP" },
        { en: "IS-IS", hi: "IS-IS" },
        { en: "BGP", hi: "BGP" },
      ],
      answer: 3,
      explain: {
        en: "BGP is the only EGP in use today. OSPF, EIGRP and IS-IS are IGPs that route inside a single AS.",
        hi: "Aaj sirf BGP hi EGP ke roop mein use hota hai. OSPF, EIGRP aur IS-IS IGPs hain jo ek hi AS ke andar routing karte hain.",
      },
      kind: "concept",
    },
    {
      q: { en: "What does an OSPF router know that a RIP router does not?", hi: "OSPF router ko kya pata hota hai jo RIP router ko nahi pata?" },
      options: [
        { en: "The next hop for each remote network", hi: "Har remote network ka next hop" },
        { en: "The metric of each remote network", hi: "Har remote network ka metric" },
        { en: "The full topology of its area: every router, link and cost", hi: "Apne area ki poori topology: har router, link aur cost" },
        { en: "The MAC address of every host in the network", hi: "Network ke har host ka MAC address" },
      ],
      answer: 2,
      explain: {
        en: "A RIP router also knows a next hop and a metric for each network, but only what its neighbours told it. An OSPF router holds every LSA in its LSDB, so it has the whole map of its area and computes paths itself with SPF.",
        hi: "RIP router ko bhi har network ka next hop aur metric pata hota hai, lekin sirf woh jo neighbours ne bataya. OSPF router ke LSDB mein har LSA hota hai, isliye uske paas apne area ka poora map hota hai aur woh SPF se khud paths calculate karta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1 can reach 10.9.9.0/24 over path A, one 10 Mbps link (1 hop), or path B, two 1 Gbps links through R2 (2 hops). Only RIPv2 is running. Which route does R1 install?",
        hi: "R1 10.9.9.0/24 tak path A se pahunch sakta hai, ek 10 Mbps link (1 hop), ya path B se, R2 ke through do 1 Gbps links (2 hops). Sirf RIPv2 chal raha hai. R1 kaunsa route install karega?",
      },
      options: [
        { en: "Path A, because it has fewer hops", hi: "Path A, kyunki usme hops kam hain" },
        { en: "Path B, because it has more bandwidth", hi: "Path B, kyunki usme bandwidth zyada hai" },
        { en: "Both, as equal-cost paths", hi: "Dono, equal-cost paths ki tarah" },
        { en: "Neither, because the paths have different hop counts", hi: "Koi nahi, kyunki dono ke hop count alag hain" },
      ],
      answer: 0,
      explain: {
        en: "RIP's only metric is hop count. Path A has metric 1 and path B has metric 2, so RIP installs path A even though it is 100 times slower. OSPF or EIGRP would choose path B.",
        hi: "RIP ka metric sirf hop count hai. Path A ka metric 1 hai aur path B ka 2, isliye RIP path A install karega, chahe woh 100 guna slow ho. OSPF ya EIGRP path B chunte.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "In `show ip route` on R1, 10.4.4.0/24 appears as `D 10.4.4.0/24 [90/3328] via 10.0.13.2, 00:04:08, GigabitEthernet0/1` followed by a second line, `[90/3328] via 10.0.12.2, 00:04:08, GigabitEthernet0/0`. What does this tell you?",
        hi: "R1 ke `show ip route` mein 10.4.4.0/24 aise dikhta hai: `D 10.4.4.0/24 [90/3328] via 10.0.13.2, 00:04:08, GigabitEthernet0/1`, aur uske neeche doosri line `[90/3328] via 10.0.12.2, 00:04:08, GigabitEthernet0/0`. Isse kya pata chalta hai?",
      },
      options: [
        { en: "The route was learned by OSPF with cost 3328", hi: "Route OSPF se cost 3328 ke saath seekha gaya" },
        { en: "R1 has two equal-cost EIGRP paths and shares traffic across them", hi: "R1 ke paas do equal-cost EIGRP paths hain aur woh traffic dono mein baant raha hai" },
        { en: "The path via 10.0.12.2 is a backup used only if the first one fails", hi: "10.0.12.2 wala path sirf backup hai, pehla fail hone par hi use hoga" },
        { en: "The network is 90 hops away", hi: "Network 90 hops door hai" },
      ],
      answer: 1,
      explain: {
        en: "`D` means EIGRP, 90 is the AD and 3328 the metric. Two `via` lines with the same metric under one prefix are equal-cost paths, and both are used at the same time. A backup path would not appear in the routing table until needed.",
        hi: "`D` ka matlab EIGRP, 90 AD hai aur 3328 metric. Ek prefix ke neeche same metric wali do `via` lines equal-cost paths hain, aur dono ek saath use hoti hain. Backup path zaroorat padne tak routing table mein dikhta hi nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1 learns 10.5.5.0/24 from OSPF with cost 3 and from EIGRP with metric 3328. Which route goes into the routing table?",
        hi: "R1 10.5.5.0/24 ko OSPF se cost 3 ke saath aur EIGRP se metric 3328 ke saath seekhta hai. Routing table mein kaunsa route jaayega?",
      },
      options: [
        { en: "The OSPF route, because 3 is lower than 3328", hi: "OSPF route, kyunki 3, 3328 se kam hai" },
        { en: "Both routes, as equal-cost paths", hi: "Dono routes, equal-cost paths ki tarah" },
        { en: "The OSPF route, because link state is preferred over distance vector", hi: "OSPF route, kyunki link state ko distance vector se zyada prefer kiya jaata hai" },
        { en: "The EIGRP route, because its AD of 90 is lower than OSPF's 110", hi: "EIGRP route, kyunki uska AD 90 hai jo OSPF ke 110 se kam hai" },
      ],
      answer: 3,
      explain: {
        en: "Metrics from different protocols are never compared. The router picks the route with the lower administrative distance, and EIGRP's 90 beats OSPF's 110.",
        hi: "Alag protocols ke metrics kabhi compare nahi hote. Router kam administrative distance wala route chunta hai, aur EIGRP ka 90 OSPF ke 110 se jeet jaata hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "R1 has Gi0/0 10.0.12.1/30, Gi0/1 10.0.13.1/30, Gi0/2 10.1.1.1/24 and Gi0/3 172.16.1.1/24. Under `router eigrp 100` you enter `network 10.0.0.0 0.0.255.255`. Which interfaces run EIGRP?",
        hi: "R1 par Gi0/0 10.0.12.1/30, Gi0/1 10.0.13.1/30, Gi0/2 10.1.1.1/24 aur Gi0/3 172.16.1.1/24 hain. `router eigrp 100` ke andar tum `network 10.0.0.0 0.0.255.255` daalte ho. Kin interfaces par EIGRP chalega?",
      },
      options: [
        { en: "Gi0/0 and Gi0/1 only", hi: "Sirf Gi0/0 aur Gi0/1" },
        { en: "Gi0/0, Gi0/1 and Gi0/2", hi: "Gi0/0, Gi0/1 aur Gi0/2" },
        { en: "All four interfaces", hi: "Chaaron interfaces" },
        { en: "None, because the wildcard must match a /30 exactly", hi: "Koi nahi, kyunki wildcard ko exactly /30 match karna chahiye" },
      ],
      answer: 0,
      explain: {
        en: "Wildcard 0.0.255.255 means the first two octets must equal 10.0 and the last two can be anything. 10.0.12.1 and 10.0.13.1 match; 10.1.1.1 fails on the second octet and 172.16.1.1 on the first.",
        hi: "Wildcard 0.0.255.255 ka matlab pehle do octets 10.0 hone chahiye aur aakhri do kuch bhi ho sakte hain. 10.0.12.1 aur 10.0.13.1 match karte hain; 10.1.1.1 doosre octet par fail hota hai aur 172.16.1.1 pehle octet par.",
      },
      kind: "calc",
    },
  ],
  videos: [
    {
      id: "xSTgb8JLkvs",
      title: "Free CCNA | Dynamic Routing | Day 24",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Dynamic vs static routing, IGP vs EGP, distance vector vs link state, metrics, ECMP and AD.", hi: "Dynamic vs static routing, IGP vs EGP, distance vector vs link state, metrics, ECMP aur AD." },
    },
    {
      id: "N8PiZDld6Zc",
      title: "Free CCNA | RIP & EIGRP | Day 25",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "RIP and EIGRP in more detail, including the EIGRP network command with wildcards.", hi: "RIP aur EIGRP zyada detail mein, EIGRP ke network command aur wildcards ke saath." },
    },
    {
      id: "UtzzX2o8EiI",
      title: "53. Free CCNA (NEW) | Introduction to Dynamic Routing in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Why dynamic routing exists, in Hindi.", hi: "Dynamic routing kyun chahiye, Hindi mein." },
    },
    {
      id: "1_F7gPyXv-8",
      title: "54. Free CCNA (NEW) | Types of Routing Protocols in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "IGP vs EGP and distance vector vs link state, in Hindi.", hi: "IGP vs EGP aur distance vector vs link state, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Build the square and watch EIGRP reconverge", hi: "Square banao aur EIGRP ko reconverge hote dekho" },
    steps: [
      { en: "In Packet Tracer, connect four 2911 routers in a square: R1-R2 on 10.0.12.0/30, R1-R3 on 10.0.13.0/30, R2-R4 on 10.0.24.0/30, R3-R4 on 10.0.34.0/30. Give R4 Gi0/2 the address 10.4.4.1/24 and attach a PC at 10.4.4.10.", hi: "Packet Tracer mein chaar 2911 routers ko square mein jodo: R1-R2 10.0.12.0/30 par, R1-R3 10.0.13.0/30 par, R2-R4 10.0.24.0/30 par, R3-R4 10.0.34.0/30 par. R4 ke Gi0/2 ko 10.4.4.1/24 do aur 10.4.4.10 wala ek PC lagao." },
      { en: "On every router enter `router eigrp 100` and a `network` statement with a wildcard for each of its interfaces. Watch for the `%DUAL-5-NBRCHANGE` messages.", hi: "Har router par `router eigrp 100` daalo aur uske har interface ke liye wildcard ke saath `network` statement. `%DUAL-5-NBRCHANGE` messages aate dekho." },
      { en: "On R1 run `show ip eigrp neighbors` and `show ip route eigrp`. Do you see two `via` lines for 10.4.4.0/24 with the same metric?", hi: "R1 par `show ip eigrp neighbors` aur `show ip route eigrp` chalao. Kya 10.4.4.0/24 ke liye same metric wali do `via` lines dikh rahi hain?" },
      { en: "Shut down R2's Gi0/1 (the link to R4) and run `show ip route eigrp` on R1 again. Only the path via 10.0.13.2 should remain.", hi: "R2 ka Gi0/1 (R4 wala link) shutdown karo aur R1 par phir se `show ip route eigrp` chalao. Ab sirf 10.0.13.2 wala path bachna chahiye." },
      { en: "Bring the link back, then remove EIGRP on R3 with `no router eigrp 100` and configure `router eigrp 200` with the same networks. Check that R1 and R3 never become neighbours, then put AS 100 back.", hi: "Link wapas up karo, phir R3 par `no router eigrp 100` se EIGRP hatao aur same networks ke saath `router eigrp 200` configure karo. Check karo ki R1 aur R3 kabhi neighbours nahi bante, phir AS 100 wapas lagao." },
    ],
  },
};

export default lesson;
