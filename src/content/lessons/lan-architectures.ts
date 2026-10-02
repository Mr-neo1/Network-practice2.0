import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "lan-architectures",
  intro: {
    en: "Five switches can be cabled any way you like. A campus with 3,000 users, or a data center with 2,000 servers, cannot: without a plan, nobody can predict where traffic flows, and one failure can take down far more than it should. LAN architectures are the standard plans: which devices sit in which layer, what each layer does, and how the layers connect. The CCNA expects you to recognise each one and say what every layer is for.",
    hi: "Paanch switches ko tum kaise bhi cable kar sakte ho. Lekin 3,000 users wala campus, ya 2,000 servers wala data center aise nahi chalta: plan ke bina koi predict nahi kar sakta ki traffic kahan se jaayega, aur ek failure zaroorat se kahin zyada network gira sakta hai. LAN architectures yahi standard plans hain: kaunsa device kis layer mein baithega, har layer kya karegi, aur layers aapas mein kaise judengi. CCNA chahta hai ki tum har design pehchaan sako aur bata sako ki har layer kis kaam ki hai.",
  },
  outcomes: [
    { en: "Describe what the access, distribution and core layers each do", hi: "Bata sako ki access, distribution aur core layer mein se har ek kya karti hai" },
    { en: "Decide when a two-tier (collapsed core) design is enough and when a core layer is needed", hi: "Decide kar sako ki kab two-tier (collapsed core) design kaafi hai aur kab core layer chahiye" },
    { en: "Trace a packet through a three-tier campus and predict which layers it crosses", hi: "Three-tier campus mein packet ka path trace kar sako aur predict kar sako ki woh kaunsi layers cross karega" },
    { en: "Explain the spine-leaf rules and why they give every server the same hop count", hi: "Spine-leaf ke rules samjha sako aur bata sako ki inse har server ka hop count same kyun rehta hai" },
    { en: "Use star, full mesh, partial mesh, north-south and east-west correctly, and calculate full-mesh links", hi: "Star, full mesh, partial mesh, north-south aur east-west sahi use kar sako, aur full-mesh links calculate kar sako" },
    { en: "List the jobs an all-in-one SOHO router does", hi: "SOHO all-in-one router ke saare kaam gina sako" },
  ],
  sections: [
    {
      id: "why-a-plan",
      heading: { en: "Why networks need an architecture", hi: "Network ko architecture kyun chahiye" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Picture an office that grew one switch at a time: a new floor meant a new switch plugged into whichever switch was nearest. After a few years, traffic from the third floor to the server room crosses six switches, a single uplink carries everyone, and when one switch reboots, half the building goes dark. Nobody designed it; it just happened.",
            hi: "Socho ek office jo ek-ek switch karke bada hua: naya floor aaya toh naya switch, jo bhi paas wala switch mila usme laga diya. Kuch saal baad teesre floor se server room tak traffic chhe switches cross karta hai, ek hi uplink par sabka traffic hai, aur ek switch reboot ho toh aadhi building band. Kisi ne design nahi kiya; bas ho gaya.",
          },
        },
        {
          type: "p",
          text: {
            en: "A **hierarchical design** fixes this by giving every switch a layer and every layer one job. Paths become predictable, each part can be doubled for redundancy, and you grow the network by adding a whole block instead of patching in one more switch.",
            hi: "**Hierarchical design** isko fix karta hai: har switch ko ek layer milti hai aur har layer ka ek kaam hota hai. Paths predictable ho jaate hain, har hissa redundancy ke liye double kiya ja sakta hai, aur network badhana ho toh ek poora block add karte ho, ek aur switch jugaad se nahi lagate.",
          },
        },
        {
          type: "table",
          caption: { en: "Topology words you will meet", hi: "Topology ke words jo baar-baar milenge" },
          columns: ["Term", { en: "Shape", hi: "Shape" }, { en: "Where you see it", hi: "Kahan dikhta hai" }],
          rows: [
            [
              "Star",
              { en: "Every device connects to one central device", hi: "Har device ek central device se juda hai" },
              { en: "PCs and APs plugged into one access switch", hi: "Ek access switch mein lage PCs aur APs" },
            ],
            [
              "Full mesh",
              { en: "Every device connects directly to every other device", hi: "Har device baaki har device se seedha juda hai" },
              { en: "Small groups of critical devices, such as Core1, Core2 and Edge-R1 in the animation", hi: "Critical devices ke chhote groups, jaise animation mein Core1, Core2 aur Edge-R1" },
            ],
            [
              "Partial mesh",
              { en: "Some devices have several links, but not every pair is connected", hi: "Kuch devices ke kai links hain, par har pair juda nahi hai" },
              { en: "Three-tier and spine-leaf designs (leaves never link to leaves); most WANs", hi: "Three-tier aur spine-leaf designs (leaf kabhi leaf se nahi judta); zyadatar WANs" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Full-mesh link count", hi: "Full-mesh link count" },
          text: {
            en: "A full mesh of n devices needs **n(n−1)/2** links. 4 devices need 6 links, 6 need 15, 10 need 45. That fast growth is exactly why large designs use layers instead of meshing everything.",
            hi: "n devices ke full mesh ko **n(n−1)/2** links chahiye. 4 devices ko 6 links, 6 ko 15, 10 ko 45. Itni tezi se badhne ki wajah se hi bade designs sab kuch mesh karne ki jagah layers use karte hain.",
          },
        },
      ],
    },
    {
      id: "three-tier",
      heading: { en: "Three-tier campus: access, distribution, core", hi: "Three-tier campus: access, distribution, core" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **campus** is a LAN spread over one or more nearby buildings. The classic Cisco campus has three tiers, each with a clear job. The animation above uses this exact layout: building A with Dist1, Dist2, Acc1 and Acc2, building B with Dist3, Dist4, Acc3 and Acc4, and a core pair joining them.",
            hi: "**Campus** ek LAN hai jo ek ya kai paas-paas ki buildings mein faila hota hai. Classic Cisco campus mein teen tiers hote hain, aur har tier ka kaam clear hai. Upar wala animation yahi layout use karta hai: building A mein Dist1, Dist2, Acc1 aur Acc2, building B mein Dist3, Dist4, Acc3 aur Acc4, aur dono ko jodne wala core pair.",
          },
        },
        {
          type: "table",
          caption: { en: "The three tiers", hi: "Teen tiers" },
          columns: [{ en: "Layer", hi: "Layer" }, { en: "What connects to it", hi: "Isse kya judta hai" }, { en: "Its job", hi: "Iska kaam" }],
          rows: [
            [
              "Access",
              { en: "End hosts: PCs, IP phones, printers, APs", hi: "End hosts yahin lagte hain: PCs, IP phones, printers, APs" },
              { en: "Many ports, PoE, first line of security (port security, DHCP snooping, DAI), QoS marking", hi: "Bahut saare ports, PoE, security ki pehli line (port security, DHCP snooping, DAI), QoS marking" },
            ],
            [
              "Distribution",
              { en: "Uplinks from the access switches of one building or block", hi: "Ek building ya block ke access switches ke uplinks" },
              { en: "Aggregates access switches; Layer 2/Layer 3 boundary and default gateways; policy such as ACLs; route summaries toward the core", hi: "Access switches ko aggregate karna; Layer 2/Layer 3 boundary aur default gateways; ACL jaisi policy; core ki taraf route summaries" },
            ],
            [
              "Core",
              { en: "Distribution pairs, plus the WAN and internet edge", hi: "Distribution pairs, aur WAN aur internet edge" },
              { en: "Fast, highly available transport between blocks; all Layer 3 links; avoids CPU-heavy work such as complex filtering", hi: "Blocks ke beech fast aur highly available transport; saare Layer 3 links; complex filtering jaise CPU-heavy kaam se door" },
            ],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "Each access switch has **two uplinks**, one to each distribution switch of its block. Access switches do not connect to each other.",
              hi: "Har access switch ke **do uplinks** hote hain, apne block ke har distribution switch ko ek. Access switches aapas mein connect nahi hote.",
            },
            {
              en: "Distribution switches come in **pairs** that link to each other and to both core switches.",
              hi: "Distribution switches **pairs** mein aate hain, jo aapas mein bhi jude hote hain aur dono core switches se bhi.",
            },
            {
              en: "Hosts should not plug into distribution or core switches. Even the campus servers connect through access switches, usually in their own server block.",
              hi: "Hosts ko distribution ya core switches mein nahi lagana chahiye. Campus ke servers bhi access switches se hi judte hain, aam taur par apne alag server block mein.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Where Layer 2 ends", hi: "Layer 2 kahan khatam hota hai" },
          text: {
            en: "In the traditional design, access uplinks are Layer 2 and the distribution pair routes. PC-A's gateway 10.1.10.1 is shared by Dist1 and Dist2 using an FHRP (lesson 3.8), and STP (lesson 2.6) stops the loops that dual uplinks create. Some modern campuses route right at the access layer instead; that is beyond the CCNA.",
            hi: "Traditional design mein access uplinks Layer 2 hote hain aur distribution pair routing karta hai. PC-A ka gateway 10.1.10.1 Dist1 aur Dist2 FHRP (lesson 3.8) se share karte hain, aur dual uplinks se jo loops bante hain unhe STP (lesson 2.6) rokta hai. Kuch modern campuses access layer par hi route karte hain; woh CCNA se aage ka topic hai.",
          },
        },
      ],
    },
    {
      id: "packet-paths",
      heading: { en: "Following a packet through the tiers", hi: "Tiers ke through packet ko follow karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Once you know the tiers, you can predict any path. PC-A is 10.1.10.10/24 on Acc1 in building A, PC-B is 10.1.20.20/24 on Acc2 in the same building, and PC-C is 10.2.30.30/24 on Acc4 in building B.",
            hi: "Tiers samajh aa gaye toh koi bhi path predict kar sakte ho. PC-A 10.1.10.10/24 hai, building A ke Acc1 par. PC-B 10.1.20.20/24 hai, same building ke Acc2 par. PC-C 10.2.30.30/24 hai, building B ke Acc4 par.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Same switch, same subnet**: two PCs on Acc1 in 10.1.10.0/24 talk through Acc1 alone. The frame never leaves the access layer.",
              hi: "**Same switch, same subnet**: Acc1 par 10.1.10.0/24 ke do PCs sirf Acc1 ke through baat karte hain. Frame access layer se bahar hi nahi jaata.",
            },
            {
              en: "**Same building, different subnet**: PC-A to PC-B goes Acc1 → Dist1 → Acc2. Dist1 is the gateway, so it routes the packet and sends it back down.",
              hi: "**Same building, doosra subnet**: PC-A se PC-B tak Acc1 → Dist1 → Acc2. Dist1 gateway hai, toh woh packet route karke wapas neeche bhej deta hai.",
            },
            {
              en: "**Other building**: PC-A to PC-C goes Acc1 → Dist1 → Core1 → Dist4 → Acc4. Two access, two distribution and one core switch.",
              hi: "**Doosri building**: PC-A se PC-C tak Acc1 → Dist1 → Core1 → Dist4 → Acc4. Do access, do distribution aur ek core switch.",
            },
            {
              en: "**Internet**: PC-A to a website goes Acc1 → Dist1 → Core1 → Edge-R1 → internet.",
              hi: "**Internet**: PC-A se kisi website tak Acc1 → Dist1 → Core1 → Edge-R1 → internet.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Two directions of traffic", hi: "Traffic ki do directions" },
          columns: ["Term", { en: "Meaning", hi: "Matlab" }, { en: "Example", hi: "Example" }],
          rows: [
            [
              "North-south",
              { en: "Traffic entering or leaving the network (or data center)", hi: "Network (ya data center) mein aane ya bahar jaane wala traffic" },
              { en: "PC-A browsing a website; a user reaching a server in the data center", hi: "PC-A ka website browse karna; user ka data center ke server tak jaana" },
            ],
            [
              "East-west",
              { en: "Traffic between devices inside the same network or data center", hi: "Same network ya data center ke andar devices ke beech traffic" },
              { en: "PC-A to PC-B; a web server querying a database server", hi: "PC-A se PC-B; web server ka database server se query karna" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "One-line answers", hi: "Ek line ke answers" },
          text: {
            en: "Hosts connect at **access**. The Layer 2/Layer 3 boundary and default gateways sit at **distribution**. The layer that must be fast and should avoid CPU-intensive features is the **core**.",
            hi: "Hosts **access** par judte hain. Layer 2/Layer 3 boundary aur default gateways **distribution** par hote hain. Jo layer fast honi chahiye aur CPU-intensive features se bachni chahiye, woh **core** hai.",
          },
        },
      ],
    },
    {
      id: "two-tier",
      heading: { en: "Two-tier: the collapsed core", hi: "Two-tier: collapsed core" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A single building rarely needs a separate core. In a **two-tier** design the distribution pair also does the core's job: it links the access blocks together and connects to the WAN and internet routers. Because the core has been merged into the distribution layer, this is called a **collapsed core**. The access layer does not change.",
            hi: "Ek building ko aam taur par alag core ki zaroorat nahi hoti. **Two-tier** design mein distribution pair hi core ka kaam bhi karta hai: access blocks ko jodta hai aur WAN aur internet routers se connect karta hai. Core distribution layer mein merge ho gaya, isliye ise **collapsed core** kehte hain. Access layer waisi hi rehti hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "The problem appears when you add buildings. Each building has its own distribution block, and without a core every block must link to every other: n(n−1)/2 again. 4 blocks need 6 block-to-block connections, 8 blocks need 28. With a core, a new block only needs uplinks to the core pair.",
            hi: "Problem tab aati hai jab buildings badhti hain. Har building ka apna distribution block hota hai, aur core ke bina har block ko baaki har block se judna padta hai: phir wahi n(n−1)/2. 4 blocks ko 6 block-to-block connections chahiye, 8 blocks ko 28. Core ho toh naye block ko sirf core pair tak uplinks chahiye.",
          },
        },
        {
          type: "table",
          caption: { en: "Two-tier vs three-tier", hi: "Two-tier vs three-tier" },
          columns: ["", "Two-tier (collapsed core)", "Three-tier"],
          rows: [
            [
              { en: "Layers", hi: "Layers" },
              { en: "Access + distribution/core combined", hi: "Access + distribution/core ek saath" },
              { en: "Access, distribution, core", hi: "Access, distribution, core" },
            ],
            [
              { en: "Fits", hi: "Kahan fit hai" },
              { en: "One building or a small campus", hi: "Ek building ya chhota campus" },
              { en: "Large campus with many buildings", hi: "Kai buildings wala bada campus" },
            ],
            [
              { en: "Cost", hi: "Cost" },
              { en: "Fewer switches and links", hi: "Kam switches aur links" },
              { en: "Extra core pair, but links grow slowly as blocks are added", hi: "Ek extra core pair, par blocks add karne par links dheere badhte hain" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "When to add a core", hi: "Core kab add karein" },
          text: {
            en: "Cisco's rule of thumb: once a single location has more than three distribution blocks, add a core layer. \"Collapsed core\" always means the core is merged into distribution, never that the access layer is removed.",
            hi: "Cisco ka rule of thumb: jab ek location par teen se zyada distribution blocks ho jaayein, core layer add karo. \"Collapsed core\" ka matlab hamesha yeh hai ki core distribution mein merge hua, yeh nahi ki access layer hata di gayi.",
          },
        },
      ],
    },
    {
      id: "spine-leaf",
      heading: { en: "Spine-leaf in the data center", hi: "Data center mein spine-leaf" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Data centers used to copy the three-tier campus. Then virtualization changed the traffic: a single web request now makes a web server call an app server, which calls a database, and VMs move between hosts. Most traffic became **east-west**, server to server. In a three-tier design that traffic sometimes stayed on one switch and sometimes crossed the core, so delay varied, and Layer 2 uplinks left links blocked by STP.",
            hi: "Pehle data centers bhi three-tier campus ki copy hote the. Phir virtualization ne traffic badal diya: ab ek web request par web server app server ko call karta hai, app server database ko, aur VMs ek host se doosre host par move hote hain. Zyadatar traffic **east-west** ho gaya, yaani server se server. Three-tier mein yeh traffic kabhi ek hi switch par reh jaata tha aur kabhi core tak jaata tha, toh delay har baar alag hota tha, aur Layer 2 uplinks ke kuch links STP se blocked rehte the.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Spine-leaf** fixes this with two layers and strict rules. In a fabric with 2 spines and 4 leaves, each leaf has one link to Spine1 and one to Spine2: 4 × 2 = 8 leaf-to-spine links, and nothing else. The last step of the animation redraws the campus switches as exactly this fabric.",
            hi: "**Spine-leaf** do layers aur strict rules se yeh problem solve karta hai. 2 spines aur 4 leaves wale fabric mein har leaf ka ek link Spine1 ko aur ek Spine2 ko jaata hai: 4 × 2 = 8 leaf-to-spine links, aur kuch nahi. Animation ka last step campus ke switches ko bilkul isi fabric ki tarah dikhata hai.",
          },
        },
        {
          type: "list",
          items: [
            { en: "Every leaf connects to **every** spine.", hi: "Har leaf **har** spine se connect hota hai." },
            { en: "Spines never connect to other spines, and leaves never connect to other leaves.", hi: "Spine kabhi doosre spine se nahi judta, aur leaf kabhi doosre leaf se nahi." },
            {
              en: "Servers, storage, firewalls and routers connect only to leaves, never to spines.",
              hi: "Servers, storage, firewalls aur routers sirf leaves se judte hain, spines se kabhi nahi.",
            },
            {
              en: "Server to server on different leaves is always leaf → spine → leaf: the same hop count and similar delay for every pair.",
              hi: "Alag leaves par server se server hamesha leaf → spine → leaf jaata hai: har pair ke liye same hop count aur lagbhag same delay.",
            },
            {
              en: "The leaf-spine links are usually routed, so traffic is load-shared across all spines (equal-cost multipath) instead of STP blocking any of them.",
              hi: "Leaf-spine links aam taur par routed hote hain, isliye traffic saare spines par load-share hota hai (equal-cost multipath); STP koi link block nahi karta.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Three-tier campus vs spine-leaf data center", hi: "Three-tier campus vs spine-leaf data center" },
          columns: ["", "Three-tier", "Spine-leaf"],
          rows: [
            [
              { en: "Main traffic", hi: "Main traffic" },
              { en: "North-south: users to servers and the internet", hi: "North-south: users se servers aur internet tak" },
              { en: "East-west: server to server", hi: "East-west: server se server" },
            ],
            [
              { en: "Path length", hi: "Path length" },
              { en: "Varies: one switch, one block, or through the core", hi: "Alag-alag: ek switch, ek block, ya core ke through" },
              { en: "Leaf → spine → leaf between any two leaves", hi: "Kinhi bhi do leaves ke beech leaf → spine → leaf" },
            ],
            [
              { en: "To grow", hi: "Badhane ke liye" },
              { en: "Add a distribution block", hi: "Ek distribution block add karo" },
              { en: "More server ports: add a leaf. More bandwidth: add a spine.", hi: "Zyada server ports: leaf add karo. Zyada bandwidth: spine add karo." },
            ],
          ],
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "Leaves are the platforms of a metro station and spines are the connecting bridges. Every platform has a staircase to every bridge, and no platform connects straight to another. Whichever two platforms you pick, the trip is the same: up, across, down.",
            hi: "Leaves metro station ke platforms hain aur spines connecting bridges. Har platform se har bridge tak seedhi hai, aur koi platform seedha doosre platform se nahi juda. Koi bhi do platforms chuno, safar same rehta hai: upar, across, neeche.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "On-premises or cloud", hi: "On-premises ya cloud" },
          text: {
            en: "Exam topic 1.2 also lists on-premises and cloud. A data center whose switches and servers you own and run is **on-premises**. Renting servers and networks as a service from a provider such as AWS or Azure is **cloud**. Lesson 1.15 covers cloud in detail.",
            hi: "Exam topic 1.2 mein on-premises aur cloud bhi hai. Jis data center ke switches aur servers tumhare apne hain aur tum hi chalate ho, woh **on-premises** hai. AWS ya Azure jaise provider se servers aur network service ki tarah kiraye par lena **cloud** hai. Cloud ki detail lesson 1.15 mein hai.",
          },
        },
      ],
    },
    {
      id: "soho",
      heading: { en: "SOHO: one box does it all", hi: "SOHO: ek box sab kuch karta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **SOHO** (small office/home office) network has a handful of users and no IT team. Instead of separate devices, it uses one all-in-one box, usually called a wireless router. The box your ISP installed at home is exactly this.",
            hi: "**SOHO** (small office/home office) network mein gine-chune users hote hain aur koi IT team nahi hoti. Alag-alag devices ki jagah ek all-in-one box use hota hai, jise aam taur par wireless router kehte hain. Ghar par ISP ne jo box lagaya hai, woh yahi hai.",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Router**: routes between your LAN and the ISP, and does NAT so every device shares one public address (lesson 4.3).", hi: "**Router**: tumhare LAN aur ISP ke beech route karta hai, aur NAT karta hai taaki saare devices ek public address share karein (lesson 4.3)." },
            { en: "**Switch**: a few Ethernet ports for wired devices.", hi: "**Switch**: wired devices ke liye kuch Ethernet ports." },
            { en: "**Wireless AP**: the Wi-Fi network.", hi: "**Wireless AP**: Wi-Fi network." },
            { en: "**Firewall**: blocks connections started from the internet.", hi: "**Firewall**: internet se shuru hone wale connections block karta hai." },
            { en: "**DHCP server**: hands out addresses such as 192.168.1.10 to each device.", hi: "**DHCP server**: har device ko 192.168.1.10 jaise addresses deta hai." },
            { en: "Often a **modem** or fiber ONT too, for the DSL, cable or fiber line.", hi: "Aksar DSL, cable ya fiber line ke liye **modem** ya fiber ONT bhi isi mein hota hai." },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The trade-off", hi: "Trade-off" },
          text: {
            en: "One cheap box is simple to run, but it is a single point of failure: if it dies, the whole office is offline. That is acceptable for five people, not for a campus.",
            hi: "Ek sasta box chalana aasaan hai, lekin yeh single point of failure hai: yeh band hua toh poora office offline. Paanch logon ke liye yeh chalta hai, campus ke liye nahi.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Access layer", def: { en: "The tier where end hosts connect; provides ports, PoE and per-port security.", hi: "Woh tier jahan end hosts judte hain; ports, PoE aur per-port security deta hai." } },
    { term: "Distribution layer", def: { en: "The tier that aggregates access switches and is usually the Layer 2/Layer 3 boundary.", hi: "Woh tier jo access switches ko aggregate karta hai aur aam taur par Layer 2/Layer 3 boundary hota hai." } },
    { term: "Core layer", def: { en: "The high-speed Layer 3 backbone that links distribution blocks and the network edge.", hi: "High-speed Layer 3 backbone jo distribution blocks aur network edge ko jodta hai." } },
    { term: "Collapsed core", def: { en: "A two-tier design where the distribution layer also does the core's job.", hi: "Two-tier design jisme distribution layer hi core ka kaam bhi karti hai." } },
    { term: "Spine-leaf", def: { en: "A data center design where every leaf switch connects to every spine switch and hosts connect only to leaves.", hi: "Data center design jisme har leaf switch har spine switch se juda hota hai aur hosts sirf leaves se judte hain." } },
    { term: "East-west / north-south", def: { en: "East-west is traffic between devices inside the network; north-south is traffic entering or leaving it.", hi: "East-west network ke andar devices ke beech ka traffic hai; north-south network mein aane ya bahar jaane wala traffic." } },
    { term: "Full mesh", def: { en: "Every device links directly to every other; n devices need n(n−1)/2 links.", hi: "Har device baaki har device se seedha juda hai; n devices ko n(n−1)/2 links chahiye." } },
    { term: "SOHO", def: { en: "Small office/home office: a small network usually run by one all-in-one wireless router.", hi: "Small office/home office: chhota network jo aam taur par ek all-in-one wireless router se chalta hai." } },
  ],
  commands: [
    { cmd: "ping 10.1.1.20", mode: "PC command prompt (Packet Tracer)", does: { en: "Send ICMP echoes so you can follow the frames in Simulation mode", hi: "ICMP echoes bhejta hai taaki Simulation mode mein frames follow kar sako" } },
  ],
  mistakes: [
    {
      en: "Thinking \"collapsed core\" removes the access layer. It is the core that is merged into the distribution layer; hosts still connect to access switches.",
      hi: "Sochna ki \"collapsed core\" mein access layer hat jaati hai. Asal mein core distribution layer mein merge hota hai; hosts ab bhi access switches se hi judte hain.",
    },
    {
      en: "Connecting spines to spines or leaves to leaves. In spine-leaf the only switch-to-switch links are leaf-to-spine, and every leaf reaches every spine.",
      hi: "Spine ko spine se ya leaf ko leaf se jodna. Spine-leaf mein switch-to-switch links sirf leaf-to-spine hote hain, aur har leaf har spine tak pahunchta hai.",
    },
    {
      en: "Plugging servers or firewalls into spine switches. In spine-leaf every endpoint, including routers and firewalls, connects to a leaf.",
      hi: "Servers ya firewalls ko spine switches mein lagana. Spine-leaf mein har endpoint, routers aur firewalls bhi, leaf se hi judta hai.",
    },
    {
      en: "Putting heavy features such as complex ACLs or QoS classification on the core. The core should only forward fast; do that work at access and distribution.",
      hi: "Core par complex ACLs ya QoS classification jaise heavy features lagana. Core ka kaam sirf fast forward karna hai; yeh kaam access aur distribution par karo.",
    },
    {
      en: "Swapping east-west and north-south. East-west stays inside (server to server); north-south enters or leaves (user to internet or to the data center).",
      hi: "East-west aur north-south ko ulta samajhna. East-west andar rehta hai (server se server); north-south andar aata ya bahar jaata hai (user se internet ya data center tak).",
    },
    {
      en: "Calculating full-mesh links as n × (n−1) or n². Each link joins two devices, so divide by 2: 6 devices need 15 links, not 30.",
      hi: "Full-mesh links ko n × (n−1) ya n² se calculate karna. Har link do devices ko jodta hai, isliye 2 se divide karo: 6 devices ko 15 links chahiye, 30 nahi.",
    },
  ],
  recap: [
    { en: "Access = hosts, ports, PoE, port security. Distribution = aggregation, gateways, Layer 2/3 boundary. Core = fast Layer 3 backbone.", hi: "Access par hosts, ports, PoE aur port security. Distribution par aggregation, gateways aur Layer 2/3 boundary. Core ek fast Layer 3 backbone hai." },
    { en: "Two-tier (collapsed core) merges core into distribution; add a core when one site has more than three distribution blocks.", hi: "Two-tier (collapsed core) mein core distribution mein merge hota hai; ek site par teen se zyada distribution blocks hon toh core add karo." },
    { en: "Spine-leaf: every leaf to every spine, no spine-spine or leaf-leaf links, hosts only on leaves, leaf → spine → leaf between leaves.", hi: "Spine-leaf: har leaf har spine se, spine-spine ya leaf-leaf links nahi, hosts sirf leaves par, leaves ke beech leaf → spine → leaf." },
    { en: "East-west = inside the network; north-south = in or out. Data centers are mostly east-west.", hi: "East-west = network ke andar; north-south = andar ya bahar. Data centers mein zyadatar east-west hota hai." },
    { en: "Full mesh needs n(n−1)/2 links. Star = all to one centre. Partial mesh = some redundant links.", hi: "Full mesh ko n(n−1)/2 links chahiye. Star = sab ek centre se. Partial mesh = kuch redundant links." },
    { en: "SOHO: one wireless router acts as router, switch, AP, firewall, DHCP server and often modem.", hi: "SOHO: ek wireless router hi router, switch, AP, firewall, DHCP server aur aksar modem ka kaam karta hai." },
  ],
  quiz: [
    {
      q: {
        en: "In a traditional three-tier campus with Layer 2 access switches, where is the default gateway for the users' subnets usually configured?",
        hi: "Layer 2 access switches wale traditional three-tier campus mein users ke subnets ka default gateway aam taur par kahan configure hota hai?",
      },
      options: [
        { en: "On the access switches", hi: "Access switches par" },
        { en: "On the core switches", hi: "Core switches par" },
        { en: "On the distribution switches", hi: "Distribution switches par" },
        { en: "On the internet edge router", hi: "Internet edge router par" },
      ],
      answer: 2,
      explain: {
        en: "The distribution layer is the Layer 2/Layer 3 boundary, so the gateways for the access subnets live there, usually shared by the pair with an FHRP. The core only routes between blocks and never faces hosts.",
        hi: "Distribution layer Layer 2/Layer 3 boundary hai, isliye access subnets ke gateways wahin hote hain, aam taur par pair FHRP se share karta hai. Core sirf blocks ke beech route karta hai, hosts ke saamne kabhi nahi aata.",
      },
      kind: "concept",
    },
    {
      q: { en: "In a two-tier (collapsed core) design, which two layers are combined?", hi: "Two-tier (collapsed core) design mein kaunsi do layers combine hoti hain?" },
      options: [
        { en: "Access and distribution", hi: "Access aur distribution" },
        { en: "Distribution and core", hi: "Distribution aur core" },
        { en: "Access and core", hi: "Access aur core" },
        { en: "Core and the WAN edge", hi: "Core aur WAN edge" },
      ],
      answer: 1,
      explain: {
        en: "The core is \"collapsed\" into the distribution layer, which then also links blocks and connects to the WAN and internet. The access layer stays separate, because hosts still need access ports.",
        hi: "Core distribution layer mein \"collapse\" hota hai, jo phir blocks ko jodne aur WAN aur internet se connect karne ka kaam bhi karti hai. Access layer alag rehti hai, kyunki hosts ko ab bhi access ports chahiye.",
      },
      kind: "concept",
    },
    {
      q: { en: "Six routers must be connected in a full mesh. How many links are needed?", hi: "Chhe routers ko full mesh mein connect karna hai. Kitne links chahiye?" },
      options: [
        { en: "12", hi: "12" },
        { en: "30", hi: "30" },
        { en: "36", hi: "36" },
        { en: "15", hi: "15" },
      ],
      answer: 3,
      explain: {
        en: "n(n−1)/2 = 6 × 5 / 2 = 15. 30 counts every link twice, once from each end, and 36 is simply 6².",
        hi: "n(n−1)/2 = 6 × 5 / 2 = 15. 30 mein har link do baar gina gaya hai, dono ends se ek-ek baar, aur 36 sirf 6² hai.",
      },
      kind: "calc",
    },
    {
      q: { en: "Which statement about a spine-leaf architecture is true?", hi: "Spine-leaf architecture ke baare mein kaunsa statement sahi hai?" },
      options: [
        { en: "Every leaf switch connects to every spine switch", hi: "Har leaf switch har spine switch se connect hota hai" },
        { en: "Spine switches connect to each other in a full mesh", hi: "Spine switches aapas mein full mesh mein connect hote hain" },
        { en: "Servers connect to spine switches for the fastest path", hi: "Sabse fast path ke liye servers spine switches se connect hote hain" },
        { en: "Leaf switches connect to neighbouring leaves to reach other racks", hi: "Doosre racks tak pahunchne ke liye leaf switches padosi leaves se connect hote hain" },
      ],
      answer: 0,
      explain: {
        en: "The only switch-to-switch links are leaf-to-spine, and each leaf has one to every spine. Spines never link to spines, leaves never link to leaves, and all endpoints attach to leaves.",
        hi: "Switch-to-switch links sirf leaf-to-spine hote hain, aur har leaf ka har spine tak ek link hota hai. Spine kabhi spine se nahi judta, leaf kabhi leaf se nahi, aur saare endpoints leaves par lagte hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A data center fabric has 4 spines and 10 leaves. A server on Leaf1 sends to a server on Leaf7. How many switches does the traffic pass through?",
        hi: "Ek data center fabric mein 4 spines aur 10 leaves hain. Leaf1 ka server Leaf7 ke server ko bhejta hai. Traffic kitne switches se guzarta hai?",
      },
      options: [
        { en: "2: Leaf1 and Leaf7", hi: "2: Leaf1 aur Leaf7" },
        { en: "3: Leaf1, one spine, Leaf7", hi: "3: Leaf1, ek spine, Leaf7" },
        { en: "4: Leaf1, two spines, Leaf7", hi: "4: Leaf1, do spines, Leaf7" },
        { en: "It depends on how far apart Leaf1 and Leaf7 are", hi: "Yeh Leaf1 aur Leaf7 ki doori par depend karta hai" },
      ],
      answer: 1,
      explain: {
        en: "Between any two different leaves the path is always leaf → spine → leaf. Leaves have no direct links to each other, and spines have no links to other spines, so it is never 2 or 4, and distance does not matter.",
        hi: "Kinhi bhi do alag leaves ke beech path hamesha leaf → spine → leaf hota hai. Leaves ke beech direct link nahi hota aur spines ke beech bhi nahi, isliye na 2 hota hai na 4, aur doori se koi farak nahi padta.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "An application server in a data center queries a database server in the same data center. What kind of traffic is this?",
        hi: "Data center ka application server usi data center ke database server se query karta hai. Yeh kis tarah ka traffic hai?",
      },
      options: [
        { en: "East-west traffic", hi: "East-west traffic" },
        { en: "North-south traffic", hi: "North-south traffic" },
        { en: "Broadcast traffic", hi: "Broadcast traffic" },
        { en: "WAN traffic", hi: "WAN traffic" },
      ],
      answer: 0,
      explain: {
        en: "Both servers are inside the same data center, so the traffic moves sideways between them: east-west. North-south would be a user or the internet reaching into the data center.",
        hi: "Dono servers same data center ke andar hain, toh traffic unke beech side mein chalta hai: east-west. North-south tab hota jab koi user ya internet data center ke andar aata.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "PvyEcLhmNBk",
      title: "Free CCNA | LAN Architectures | Day 52",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Covers star and mesh terms, two-tier, three-tier, spine-leaf and SOHO, in the same order as this lesson.", hi: "Star aur mesh terms, two-tier, three-tier, spine-leaf aur SOHO, isi lesson ke order mein cover karta hai." },
    },
    {
      id: "6-66D9J5PkY",
      title: "Data Center NETWORKS (what do they look like??) // FREE CCNA // EP 7",
      channel: "NetworkChuck",
      lang: "en",
      note: { en: "Watch from the \"OLD data center design\" chapter for why data centers moved from three-tier to spine-leaf.", hi: "\"OLD data center design\" chapter se dekho: data centers three-tier se spine-leaf par kyun shift hue." },
    },
    {
      id: "C1x7K_PSni0",
      title: "CCNA Lesson - 32: 3 Tier and 2 Tier Network Architecture",
      channel: "Network Bulls",
      lang: "hi",
      note: { en: "A short Hindi explanation of three-tier and two-tier (collapsed core) designs.", hi: "Three-tier aur two-tier (collapsed core) design ka chhota Hindi explanation." },
    },
    {
      id: "KDOr3jqMoBo",
      title: "CCNA 200 - 301 - Lesson - 33: Spine & Leaf Network Architecture",
      channel: "Network Bulls",
      lang: "hi",
      note: { en: "A short Hindi video on spine-leaf and east-west traffic.", hi: "Spine-leaf aur east-west traffic par chhota Hindi video." },
    },
  ],
  lab: {
    title: { en: "Build a two-tier block in Packet Tracer", hi: "Packet Tracer mein two-tier block banao" },
    steps: [
      {
        en: "Place four 2960 switches named Dist1, Dist2, Acc1 and Acc2. This lab is about the shape, so Layer 2 switches are fine even for the distribution pair.",
        hi: "Chaar 2960 switches rakho aur naam do Dist1, Dist2, Acc1 aur Acc2. Yeh lab shape ke baare mein hai, isliye distribution pair ke liye bhi Layer 2 switches chalenge.",
      },
      {
        en: "Connect Dist1 to Dist2, then connect each access switch to both distribution switches. Do not connect Acc1 to Acc2.",
        hi: "Dist1 ko Dist2 se jodo, phir har access switch ko dono distribution switches se jodo. Acc1 ko Acc2 se mat jodna.",
      },
      {
        en: "Add two PCs on Acc1 (10.1.1.10 and 10.1.1.11) and one on Acc2 (10.1.1.20), all /24. Wait for the link lights: 4 switches with 5 links have 2 links too many for a loop-free tree, so STP blocks two of them and those ports stay amber (lesson 2.6).",
        hi: "Acc1 par do PCs (10.1.1.10 aur 10.1.1.11) aur Acc2 par ek (10.1.1.20) lagao, sab /24. Link lights ka wait karo: 4 switches aur 5 links mein loop-free tree se 2 links zyada hain, isliye STP unme se do block karta hai aur woh ports amber rehte hain (lesson 2.6).",
      },
      {
        en: "In Simulation mode, ping 10.1.1.11 from 10.1.1.10. The first ARP request is a broadcast, so it is flooded through the whole block, but the ARP reply and the ICMP frames never leave Acc1. Then ping 10.1.1.20: those frames must go up to a distribution switch and back down, because Acc1 and Acc2 have no direct link.",
        hi: "Simulation mode mein 10.1.1.10 se 10.1.1.11 ping karo. Pehla ARP request broadcast hai, isliye woh poore block mein flood hota hai, lekin ARP reply aur ICMP frames Acc1 se bahar nahi jaate. Phir 10.1.1.20 ping karo: in frames ko ek distribution switch tak upar jaakar wapas neeche aana hi padega, kyunki Acc1 aur Acc2 ke beech direct link nahi hai.",
      },
      {
        en: "On paper, add buildings one at a time. Without a core, building n must link to all n−1 existing blocks: the 5th needs 4 new block connections, the 9th needs 8. With a core pair, every new building needs the same 4 uplinks (each distribution switch to both core switches).",
        hi: "Paper par ek-ek karke buildings add karo. Core ke bina building n ko pehle se maujood saare n−1 blocks se judna padega: 5th ko 4 naye block connections chahiye, 9th ko 8. Core pair ho toh har nayi building ko wahi 4 uplinks chahiye (har distribution switch dono core switches tak).",
      },
    ],
  },
};

export default lesson;
