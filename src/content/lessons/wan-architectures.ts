import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "wan-architectures",
  intro: {
    en: "Your LAN ends at your building's wall. To connect a branch in Pune to headquarters in Mumbai you cannot lay your own cable along the highway, so you rent connectivity from a service provider. WAN architectures are the ways of doing that: dedicated leased lines, shared private services such as MPLS and Metro Ethernet, and the public internet protected by VPNs. Each trades cost, reach, reliability and security differently, and most companies combine two so that one can back up the other.",
    hi: "Tumhara LAN building ki deewar par khatam ho jaata hai. Pune ki branch ko Mumbai ke headquarters se jodna hai toh highway ke saath apni cable nahi bichha sakte, isliye service provider se connectivity kiraye par lete ho. WAN architectures yahi tareeke hain: dedicated leased lines, MPLS aur Metro Ethernet jaisi shared private services, aur VPN se protected public internet. Har option cost, reach, reliability aur security mein alag trade-off deta hai, aur zyadatar companies do options combine karti hain taaki ek fail ho toh doosra backup de.",
  },
  outcomes: [
    { en: "Compare leased lines, MPLS, Metro Ethernet and internet VPNs by cost, flexibility and security", hi: "Leased lines, MPLS, Metro Ethernet aur internet VPN ko cost, flexibility aur security ke hisaab se compare kar sako" },
    { en: "Identify CE, PE and P routers and explain what an MPLS Layer 3 VPN does", hi: "CE, PE aur P routers pehchaan sako aur samjha sako ki MPLS Layer 3 VPN kya karta hai" },
    { en: "Describe DSL, cable, fiber and 4G/5G internet access", hi: "DSL, cable, fiber aur 4G/5G internet access describe kar sako" },
    { en: "Tell hub-and-spoke from full mesh, and single-homed from dual-homed, multihomed and dual multihomed", hi: "Hub-and-spoke ko full mesh se, aur single-homed ko dual-homed, multihomed aur dual multihomed se alag pehchaan sako" },
    { en: "Explain how a branch fails over from MPLS to an internet VPN and back", hi: "Samjha sako ki branch MPLS se internet VPN par kaise fail over karti hai aur wapas kaise aati hai" },
  ],
  sections: [
    {
      id: "renting-a-wan",
      heading: { en: "Why WANs are rented, not built", hi: "WAN kiraye par kyun liya jaata hai, banaya kyun nahi jaata" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Inside a building you own the cables. Between cities the ground belongs to someone else, so a **WAN** (wide area network) is almost always a service you buy from a provider such as a telecom operator. What you choose decides how private the connection is, which sites can talk directly, and what happens when something breaks.",
            hi: "Building ke andar cables tumhari hoti hain. Shehron ke beech zameen kisi aur ki hai, isliye **WAN** (wide area network) lagbhag hamesha ek service hoti hai jo tum telecom operator jaise provider se khareedte ho. Tum kya chunte ho, isse decide hota hai ki connection kitna private hai, kaunsi sites seedhe baat kar sakti hain, aur kuch toote toh kya hota hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The four options in this lesson", hi: "Is lesson ke chaar options" },
          columns: [{ en: "Option", hi: "Option" }, { en: "What you get", hi: "Kya milta hai" }, { en: "Strength", hi: "Strength" }, { en: "Weakness", hi: "Weakness" }],
          rows: [
            [
              "Leased line",
              { en: "A dedicated circuit between two sites", hi: "Do sites ke beech dedicated circuit" },
              { en: "Private, predictable", hi: "Private, predictable" },
              { en: "Expensive, slow to install, point-to-point only", hi: "Mehnga, install hone mein time lagta hai, sirf point-to-point" },
            ],
            [
              "MPLS VPN",
              { en: "A private network shared with other customers but kept separate", hi: "Private network jo doosre customers ke saath share hai par alag rakha jaata hai" },
              { en: "Any-to-any, SLA, many access types", hi: "Any-to-any, SLA, kai access types" },
              { en: "Costs more than internet; not encrypted", hi: "Internet se mehnga; encrypted nahi" },
            ],
            [
              "Metro Ethernet",
              { en: "An Ethernet service across a city", hi: "Poore shehar mein Ethernet service" },
              { en: "Plain Ethernet ports, high speed", hi: "Simple Ethernet ports, high speed" },
              { en: "Only where the provider has fiber", hi: "Sirf wahan jahan provider ka fiber hai" },
            ],
            [
              "Internet + VPN",
              { en: "Any internet link plus an encrypted tunnel", hi: "Koi bhi internet link aur ek encrypted tunnel" },
              { en: "Cheap, available everywhere", hi: "Sasta, har jagah available" },
              { en: "No end-to-end guarantee of delay or loss", hi: "Delay ya loss ki end-to-end koi guarantee nahi" },
            ],
          ],
        },
      ],
    },
    {
      id: "leased-lines",
      heading: { en: "Leased lines and WAN topologies", hi: "Leased lines aur WAN topologies" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **leased line** is a dedicated circuit between two sites that you rent by the month. Traditionally it ended on a serial interface, at speeds such as T1 (1.544 Mbps, North America) or E1 (2.048 Mbps, used in India and Europe). Serial leased lines run HDLC or PPP at Layer 2, and both ends must use the same one. Cisco's default is HDLC. Today leased lines are usually delivered as Ethernet over fiber instead.",
            hi: "**Leased line** do sites ke beech ek dedicated circuit hai jo tum mahine ke hisaab se kiraye par lete ho. Pehle yeh serial interface par khatam hoti thi, T1 (1.544 Mbps, North America) ya E1 (2.048 Mbps, India aur Europe mein) jaisi speeds par. Serial leased lines Layer 2 par HDLC ya PPP chalati hain, aur dono ends par same hona zaroori hai. Cisco ka default HDLC hai. Aajkal leased lines zyadatar fiber par Ethernet ke roop mein milti hain.",
          },
        },
        {
          type: "cli",
          title: { en: "A serial leased line on a Cisco router", hi: "Cisco router par serial leased line" },
          lines: [
            { prompt: "HQ#", cmd: "show interfaces serial0/0/0" },
            { out: "Serial0/0/0 is up, line protocol is up", comment: { en: "Physical layer and Layer 2 are both working", hi: "Physical layer aur Layer 2 dono chal rahe hain" } },
            { out: "  Internet address is 172.16.12.1/30" },
            { out: "  MTU 1500 bytes, BW 1544 Kbit/sec, DLY 20000 usec,", comment: { en: "Default serial bandwidth is 1544 kbps, a T1", hi: "Serial ka default bandwidth 1544 kbps hai, yaani T1" } },
            { out: "  Encapsulation HDLC, loopback not set", comment: { en: "Cisco's default Layer 2 protocol on serial links", hi: "Serial links par Cisco ka default Layer 2 protocol" } },
          ],
          note: {
            en: "Change one end with `encapsulation ppp` and both ends report \"line protocol is down\" until the other end is changed to match.",
            hi: "Ek end par `encapsulation ppp` kar do toh dono ends \"line protocol is down\" dikhayenge, jab tak doosra end bhi match na kiya jaaye.",
          },
        },
        {
          type: "p",
          text: {
            en: "Because a leased line joins exactly two sites, the number of lines depends on the **topology**. In **hub-and-spoke**, every branch (spoke) has one line to HQ (hub), and branch-to-branch traffic goes through HQ. In a **full mesh**, every site has a line to every other site. A **partial mesh** sits in between, for example a full mesh between the big sites and single lines to the small ones.",
            hi: "Leased line sirf do sites ko jodti hai, isliye kitni lines chahiye yeh **topology** par depend karta hai. **Hub-and-spoke** mein har branch (spoke) ki ek line HQ (hub) tak hoti hai, aur branch-to-branch traffic HQ se hokar jaata hai. **Full mesh** mein har site ki line baaki har site tak hoti hai. **Partial mesh** beech ka raasta hai, jaise badi sites ke beech full mesh aur chhoti sites ke liye ek-ek line.",
          },
        },
        {
          type: "table",
          caption: { en: "Five sites (HQ + 4 branches) on leased lines", hi: "Leased lines par paanch sites (HQ + 4 branches)" },
          columns: [{ en: "Topology", hi: "Topology" }, { en: "Lines", hi: "Lines" }, { en: "Branch to branch", hi: "Branch se branch" }, { en: "Trade-off", hi: "Trade-off" }],
          rows: [
            [
              "Hub-and-spoke",
              "4",
              { en: "Via HQ", hi: "HQ ke through" },
              { en: "Cheapest; HQ carries everything and is a single point of failure", hi: "Sabse sasta; saara load HQ par, aur HQ single point of failure" },
            ],
            [
              "Full mesh",
              "10 (5 × 4 / 2)",
              { en: "Direct", hi: "Direct" },
              { en: "Best paths and redundancy; cost grows as n(n−1)/2", hi: "Best paths aur redundancy; cost n(n−1)/2 ki tarah badhta hai" },
            ],
            [
              "Partial mesh",
              { en: "5 to 9", hi: "5 se 9" },
              { en: "Direct for some pairs", hi: "Kuch pairs ke liye direct" },
              { en: "Redundancy only where it matters", hi: "Redundancy sirf wahan jahan zaroori hai" },
            ],
          ],
        },
      ],
    },
    {
      id: "mpls",
      heading: { en: "MPLS: a private network you share", hi: "MPLS: private network jo share hota hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Instead of renting a line per pair of sites, you connect each site once to the provider's network, and the provider carries traffic between them. Thousands of customers share that network. **MPLS** (Multiprotocol Label Switching) VPNs keep each customer's routes and traffic separate, so to you it looks like a private WAN. The link from a site into the provider can be almost anything: Ethernet over fiber, DSL, or 4G/5G.",
            hi: "Har do sites ke beech alag line lene ki jagah, har site ko ek baar provider ke network se jodte ho, aur provider unke beech traffic le jaata hai. Hazaron customers yeh network share karte hain. **MPLS** (Multiprotocol Label Switching) VPNs har customer ke routes aur traffic alag rakhte hain, toh tumhe yeh private WAN jaisa dikhta hai. Site se provider tak ka link lagbhag kuch bhi ho sakta hai: fiber par Ethernet, DSL, ya 4G/5G.",
          },
        },
        {
          type: "p",
          text: {
            en: "Inside the provider, routers forward by a short **label** added in front of the IP header, not by the customer's IP addresses. \"Multiprotocol\" means the same label switching can carry IPv4, IPv6 or even Ethernet frames.",
            hi: "Provider ke andar routers customer ke IP addresses se nahi, balki IP header ke aage lage ek chhote **label** se forward karte hain. \"Multiprotocol\" ka matlab hai ki yahi label switching IPv4, IPv6, ya Ethernet frames tak le ja sakti hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The three router roles", hi: "Teen router roles" },
          columns: [{ en: "Role", hi: "Role" }, { en: "Owned by", hi: "Kiska" }, { en: "What it does", hi: "Kya karta hai" }],
          rows: [
            [
              "CE (customer edge)",
              { en: "Customer", hi: "Customer" },
              { en: "Your site router. Sends and receives normal IP packets; never sees a label.", hi: "Tumhari site ka router. Normal IP packets bhejta aur leta hai; label kabhi nahi dekhta." },
            ],
            [
              "PE (provider edge)",
              { en: "Provider", hi: "Provider" },
              { en: "Connects to CEs, keeps each customer's routes separate, adds labels on the way in and removes them on the way out.", hi: "CEs se judta hai, har customer ke routes alag rakhta hai, andar aate waqt labels lagata hai aur bahar jaate waqt hatata hai." },
            ],
            [
              "P (provider)",
              { en: "Provider", hi: "Provider" },
              { en: "Core router. Forwards by label only and holds no customer routes.", hi: "Core router. Sirf label se forward karta hai aur uske paas koi customer route nahi hota." },
            ],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**Layer 3 MPLS VPN**: each CE exchanges routes with its PE, usually as a routing peer running OSPF or BGP (static routes also work). The provider learns your subnets and delivers any site to any site, as in the animation.",
              hi: "**Layer 3 MPLS VPN**: har CE apne PE ke saath routes exchange karta hai, aam taur par OSPF ya BGP chalane wala routing peer ban kar (static routes bhi chalte hain). Provider tumhare subnets seekhta hai aur kisi bhi site se kisi bhi site tak deliver karta hai, jaisa animation mein hai.",
            },
            {
              en: "**Layer 2 MPLS VPN**: the provider acts like a switch or a cable between your sites. Your CE routers are routing peers of each other, and the provider takes no part in your routing.",
              hi: "**Layer 2 MPLS VPN**: provider tumhari sites ke beech switch ya cable jaisa kaam karta hai. Tumhare CE routers aapas mein routing peers hote hain, aur provider tumhari routing mein koi hissa nahi leta.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Who peers with whom", hi: "Kaun kiska peer hai" },
          text: {
            en: "Layer 3 MPLS VPN: CE ↔ PE routing adjacency. Layer 2 MPLS VPN: CE ↔ CE adjacency, straight across the provider. P routers never peer with customers.",
            hi: "Layer 3 MPLS VPN: CE ↔ PE routing adjacency. Layer 2 MPLS VPN: CE ↔ CE adjacency, seedha provider ke aar-paar. P routers kabhi customers ke peer nahi bante.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Private is not encrypted", hi: "Private ka matlab encrypted nahi" },
          text: {
            en: "MPLS keeps customers apart, but it does not encrypt anything. If your data must be encrypted across the provider, run IPsec over the MPLS service as well.",
            hi: "MPLS customers ko alag rakhta hai, lekin kuch bhi encrypt nahi karta. Agar data ko provider ke aar-paar encrypted jaana hai, toh MPLS service ke upar IPsec bhi chalao.",
          },
        },
      ],
    },
    {
      id: "metro-ethernet",
      heading: { en: "Metro Ethernet", hi: "Metro Ethernet" },
      blocks: [
        {
          type: "p",
          text: {
            en: "With **Metro Ethernet** the provider hands each site an ordinary Ethernet port, usually on fiber, and its network behaves like one big switch between your sites. Your routers plug in with normal Ethernet interfaces: no serial cards, no special encapsulation. It is sold in three shapes.",
            hi: "**Metro Ethernet** mein provider har site ko ek normal Ethernet port deta hai, aam taur par fiber par, aur uska network tumhari sites ke beech ek bade switch jaisa behave karta hai. Tumhare routers normal Ethernet interfaces se judte hain: na serial cards, na koi special encapsulation. Yeh teen shapes mein bikta hai.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Service", hi: "Service" }, { en: "Shape", hi: "Shape" }, { en: "Behaves like", hi: "Kiske jaisa" }],
          rows: [
            ["E-Line", { en: "Point-to-point, two sites", hi: "Point-to-point, do sites" }, { en: "A virtual leased line", hi: "Virtual leased line" }],
            ["E-LAN", { en: "Multipoint, any site to any site (full mesh)", hi: "Multipoint, kisi bhi site se kisi bhi site tak (full mesh)" }, { en: "All sites plugged into one switch", hi: "Saari sites ek switch mein lagi hon" }],
            ["E-Tree", { en: "Hub-and-spoke: leaves talk only to the root", hi: "Hub-and-spoke: leaves sirf root se baat karte hain" }, { en: "A switch where branches can reach HQ but not each other", hi: "Aisa switch jahan branches HQ tak pahunch sakti hain par aapas mein nahi" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "On an E-LAN, the routers at every site sit in one subnet, for example 172.16.0.0/24, and form routing adjacencies directly with each other. The provider only switches frames, so, unlike a Layer 3 MPLS VPN, it never learns your routes.",
            hi: "E-LAN par har site ke routers ek hi subnet mein hote hain, jaise 172.16.0.0/24, aur seedhe aapas mein routing adjacencies banate hain. Provider sirf frames switch karta hai, isliye Layer 3 MPLS VPN ki tarah tumhare routes kabhi nahi seekhta.",
          },
        },
      ],
    },
    {
      id: "internet-access",
      heading: { en: "Getting onto the internet", hi: "Internet se judna" },
      blocks: [
        {
          type: "table",
          caption: { en: "Common internet access types", hi: "Common internet access types" },
          columns: [{ en: "Type", hi: "Type" }, { en: "Runs over", hi: "Kis par chalta hai" }, { en: "Box at the site", hi: "Site par box" }, { en: "Notes", hi: "Notes" }],
          rows: [
            [
              "DSL",
              { en: "Telephone copper pair", hi: "Telephone ki copper wire" },
              { en: "DSL modem", hi: "DSL modem" },
              { en: "Phone and data share the line; usually faster down than up; speed falls with distance from the exchange", hi: "Phone aur data ek hi line share karte hain; aam taur par download upload se fast; exchange se doori badhne par speed girti hai" },
            ],
            [
              "Cable",
              { en: "Cable TV coax", hi: "Cable TV ka coax" },
              { en: "Cable modem", hi: "Cable modem" },
              { en: "Bandwidth is shared with neighbours on the same segment", hi: "Bandwidth same segment ke padosiyon ke saath share hota hai" },
            ],
            [
              "Fiber (FTTH)",
              { en: "Fiber to the home or office", hi: "Ghar ya office tak fiber" },
              { en: "ONT (optical network terminal)", hi: "ONT (optical network terminal)" },
              { en: "Highest speeds of the home options", hi: "Home options mein sabse zyada speed" },
            ],
            [
              "4G / 5G",
              { en: "Cellular radio", hi: "Cellular radio" },
              { en: "Router or modem with a SIM", hi: "SIM wala router ya modem" },
              { en: "Works where no cable reaches; a popular backup link", hi: "Jahan cable nahi pahunchti wahan chalta hai; backup link ke liye popular" },
            ],
            [
              { en: "Dedicated internet (ILL)", hi: "Dedicated internet (ILL)" },
              { en: "Fiber, handed off as Ethernet", hi: "Fiber, Ethernet ke roop mein handoff" },
              { en: "Provider's router or switch", hi: "Provider ka router ya switch" },
              { en: "Guaranteed symmetric bandwidth with an SLA; called an internet leased line in India", hi: "Guaranteed symmetric bandwidth aur SLA; India mein ise internet leased line kehte hain" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "How many internet connections a site has, and to how many ISPs, decides which failures it survives. The exam uses four exact terms.",
            hi: "Site ke kitne internet connections hain, aur kitne ISPs se, isse decide hota hai ki woh kaunse failures jhel sakti hai. Exam chaar exact terms use karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Homing: links and ISPs", hi: "Homing: links aur ISPs" },
          columns: [{ en: "Term", hi: "Term" }, { en: "Connections", hi: "Connections" }, { en: "Survives", hi: "Kya jhel leta hai" }],
          rows: [
            ["Single-homed", { en: "1 link to 1 ISP", hi: "1 ISP tak 1 link" }, { en: "Nothing: any failure cuts the site off", hi: "Kuch nahi: koi bhi failure site ko kaat deta hai" }],
            ["Dual-homed", { en: "2 links to the same ISP", hi: "Same ISP tak 2 links" }, { en: "A link or router failure, but not an ISP outage", hi: "Link ya router failure, lekin ISP outage nahi" }],
            ["Multihomed", { en: "1 link each to 2 ISPs", hi: "2 ISPs tak 1-1 link" }, { en: "One ISP failing", hi: "Ek ISP ka fail hona" }],
            ["Dual multihomed", { en: "2 links to each of 2 ISPs", hi: "2 ISPs mein se har ek tak 2 links" }, { en: "Link failures and one ISP failing", hi: "Link failures aur ek ISP ka fail hona" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Dual-homed vs multihomed", hi: "Dual-homed vs multihomed" },
          text: {
            en: "\"Dual\" counts links to one ISP; \"multi\" counts ISPs. Two links to Airtel is dual-homed. One link to Airtel and one to Jio is multihomed.",
            hi: "\"Dual\" ek ISP tak links ginta hai; \"multi\" ISPs ginta hai. Airtel tak do links = dual-homed. Ek link Airtel aur ek Jio = multihomed.",
          },
        },
      ],
    },
    {
      id: "internet-vpns",
      heading: { en: "Internet VPNs: a preview", hi: "Internet VPNs: ek preview" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The internet is cheap and reaches everywhere, but it is public: your packets cross networks you do not control, and nobody guarantees their delay. A **VPN** solves the privacy half by building an encrypted tunnel across it. It cannot solve the guarantee half, which is why MPLS still sells.",
            hi: "Internet sasta hai aur har jagah pahunchta hai, lekin public hai: tumhare packets aise networks se guzarte hain jin par tumhara control nahi, aur unke delay ki koi guarantee nahi deta. **VPN** encrypted tunnel bana kar privacy wala hissa solve kar deta hai. Guarantee wala hissa solve nahi kar sakta, isiliye MPLS aaj bhi bikta hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Site-to-site IPsec VPN**: the routers or firewalls at two sites build a permanent tunnel. Each original packet is encrypted and wrapped in a new IP header between the two sites' public addresses. PCs send normal packets and need no VPN software.",
              hi: "**Site-to-site IPsec VPN**: do sites ke routers ya firewalls ek permanent tunnel banate hain. Har original packet encrypt hota hai aur dono sites ke public addresses wale naye IP header mein wrap hota hai. PCs normal packets bhejte hain, unhe koi VPN software nahi chahiye.",
            },
            {
              en: "**Remote-access VPN**: VPN client software on one laptop, such as Cisco Secure Client, builds a tunnel to the company's firewall, for example when you work from home.",
              hi: "**Remote-access VPN**: ek laptop par VPN client software, jaise Cisco Secure Client, company ke firewall tak tunnel banata hai, jaise jab tum ghar se kaam karte ho.",
            },
            {
              en: "Plain IPsec carries only unicast, so routing protocols that use multicast need **GRE over IPsec**. Cisco **DMVPN** lets you configure branches hub-and-spoke while the branches still build direct tunnels to each other when needed. Both come in lesson 5.9.",
              hi: "Plain IPsec sirf unicast le jaata hai, isliye multicast use karne wale routing protocols ke liye **GRE over IPsec** chahiye. Cisco **DMVPN** mein branches hub-and-spoke configure hoti hain, phir bhi zaroorat padne par branches aapas mein direct tunnels bana leti hain. Dono lesson 5.9 mein aayenge.",
            },
          ],
        },
      ],
    },
    {
      id: "branch-failover",
      heading: { en: "Putting it together: MPLS first, VPN as backup", hi: "Sab ek saath: pehle MPLS, backup mein VPN" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A very common design, and the one in the animation: every site has an MPLS Layer 3 VPN as the primary WAN and an internet connection with an IPsec tunnel to HQ as the backup. Branch1 is 10.1.0.0/16 with public address 203.0.113.10; HQ is 10.0.0.0/16 with public address 198.51.100.1.",
            hi: "Ek bahut common design, aur animation wala bhi yahi hai: har site par primary WAN ke liye MPLS Layer 3 VPN, aur backup ke liye internet connection jisme HQ tak IPsec tunnel hai. Branch1 10.1.0.0/16 hai, public address 203.0.113.10; HQ 10.0.0.0/16 hai, public address 198.51.100.1.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Normal**: Branch1 learns 10.0.0.0/16 and 10.2.0.0/16 from PE1. All traffic, including branch to branch, goes over MPLS.",
              hi: "**Normal**: Branch1 PE1 se 10.0.0.0/16 aur 10.2.0.0/16 seekhta hai. Saara traffic, branch se branch bhi, MPLS par jaata hai.",
            },
            {
              en: "**Waiting in reserve**: Branch1 also has a floating static route to 10.0.0.0/16 through the tunnel, with a worse administrative distance, so it stays out of the routing table while MPLS works (lesson 3.4).",
              hi: "**Reserve mein**: Branch1 ke paas tunnel ke through 10.0.0.0/16 ka floating static route bhi hai, jiska administrative distance zyada (kharab) hai, isliye MPLS chalte waqt yeh routing table mein nahi aata (lesson 3.4).",
            },
            {
              en: "**Failure**: the Branch1–PE1 link drops. The MPLS routes vanish and the floating static route is installed. Traffic to HQ now goes encrypted over the internet.",
              hi: "**Failure**: Branch1–PE1 link gir jaata hai. MPLS routes gayab ho jaate hain aur floating static route install ho jaata hai. Ab HQ ka traffic internet par encrypted jaata hai.",
            },
            {
              en: "**Replies**: HQ also loses its MPLS route to 10.1.0.0/16 as soon as the provider withdraws it, so HQ needs the mirror-image backup route through the tunnel, or replies will not get back.",
              hi: "**Replies**: provider jaise hi 10.1.0.0/16 withdraw karta hai, HQ ka yeh MPLS route bhi chala jaata hai. Isliye HQ par bhi tunnel ke through ulta backup route chahiye, warna replies wapas nahi aayenge.",
            },
            {
              en: "**Recovery**: the link returns, the MPLS routes come back with a better administrative distance, and the backup route drops out again.",
              hi: "**Recovery**: link wapas aata hai, MPLS routes behtar administrative distance ke saath laut aate hain, aur backup route phir se hat jaata hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Make the backup truly different", hi: "Backup sach mein alag rakho" },
          text: {
            en: "If the MPLS circuit and the internet line come in through the same cable duct, one digger cuts both. A 4G/5G backup uses a completely different path. Tools such as SD-WAN (lesson 7.6) automate this choice and can use both links at once.",
            hi: "Agar MPLS circuit aur internet line ek hi cable duct se aa rahi hain, toh ek JCB dono kaat degi. 4G/5G backup bilkul alag raasta use karta hai. SD-WAN (lesson 7.6) jaise tools yeh choice automate karte hain aur dono links ek saath use kar sakte hain.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Leased line", def: { en: "A dedicated point-to-point circuit between two sites, rented from a provider.", hi: "Do sites ke beech dedicated point-to-point circuit, jo provider se kiraye par liya jaata hai." } },
    { term: "MPLS", def: { en: "Multiprotocol Label Switching: a provider network that forwards by labels and keeps each customer in its own VPN.", hi: "Multiprotocol Label Switching: provider network jo labels se forward karta hai aur har customer ko uske apne VPN mein rakhta hai." } },
    { term: "CE / PE / P", def: { en: "Customer edge router, provider edge router that CEs connect to, and provider core router that forwards on labels only.", hi: "Customer edge router, provider edge router jisse CEs judte hain, aur provider core router jo sirf labels par forward karta hai." } },
    { term: "Layer 3 MPLS VPN", def: { en: "An MPLS service where each CE exchanges routes with its PE and the provider routes between sites.", hi: "MPLS service jisme har CE apne PE se routes share karta hai aur provider sites ke beech route karta hai." } },
    { term: "Metro Ethernet", def: { en: "A provider Ethernet service across a city, sold as E-Line, E-LAN or E-Tree.", hi: "Poore shehar mein provider ki Ethernet service, jo E-Line, E-LAN ya E-Tree ke roop mein milti hai." } },
    { term: "Hub-and-spoke", def: { en: "A topology where every branch connects only to a central hub and branch-to-branch traffic passes through it.", hi: "Topology jisme har branch sirf central hub se judi hoti hai aur branch-to-branch traffic usi se hokar jaata hai." } },
    { term: "Dual multihomed", def: { en: "Two connections to each of two different ISPs.", hi: "Do alag ISPs mein se har ek tak do connections." } },
    { term: "Site-to-site VPN", def: { en: "A permanent encrypted tunnel between the routers or firewalls of two sites across the internet.", hi: "Internet ke aar-paar do sites ke routers ya firewalls ke beech permanent encrypted tunnel." } },
  ],
  commands: [
    { cmd: "show interfaces serial0/0/0", mode: "Cisco privileged EXEC", does: { en: "Show a serial link's status, bandwidth and encapsulation", hi: "Serial link ka status, bandwidth aur encapsulation dikhata hai" } },
    { cmd: "show ip interface brief", mode: "Cisco privileged EXEC", does: { en: "List every interface with its IP address and up/down status", hi: "Har interface ko uske IP address aur up/down status ke saath list karta hai" } },
    { cmd: "show controllers serial0/0/0", mode: "Cisco privileged EXEC", does: { en: "Show whether this end of the serial cable is DCE or DTE, and its clock rate", hi: "Batata hai ki serial cable ka yeh end DCE hai ya DTE, aur clock rate kya hai" } },
    { cmd: "encapsulation ppp", mode: "Cisco interface config", does: { en: "Change a serial interface from HDLC to PPP", hi: "Serial interface ko HDLC se PPP par badalta hai" } },
    { cmd: "clock rate 64000", mode: "Cisco interface config", does: { en: "Set the clock on the DCE end of a back-to-back serial link", hi: "Back-to-back serial link ke DCE end par clock set karta hai" } },
    { cmd: "ip address 172.16.12.1 255.255.255.252", mode: "Cisco interface config", does: { en: "Give the interface an IPv4 address and mask", hi: "Interface ko IPv4 address aur mask deta hai" } },
    { cmd: "no shutdown", mode: "Cisco interface config", does: { en: "Enable an interface; router interfaces start shut down", hi: "Interface enable karta hai; router interfaces shuru mein shutdown hote hain" } },
    { cmd: "ping 172.16.12.2", mode: "Cisco privileged EXEC", does: { en: "Test reachability across the WAN link", hi: "WAN link ke aar-paar reachability test karta hai" } },
  ],
  mistakes: [
    {
      en: "Assuming MPLS is encrypted. It keeps customers separate but encrypts nothing; add IPsec if you need encryption.",
      hi: "Maan lena ki MPLS encrypted hai. Yeh customers ko alag rakhta hai par kuch encrypt nahi karta; encryption chahiye toh IPsec add karo.",
    },
    {
      en: "Thinking the CE router adds labels or that P routers know customer routes. CEs send plain IP; PEs add and remove labels; P routers forward on labels and hold no customer routes.",
      hi: "Sochna ki CE router labels lagata hai, ya P routers ko customer routes pata hote hain. CEs plain IP bhejte hain; PEs labels lagate aur hatate hain; P routers labels par forward karte hain aur unke paas customer routes nahi hote.",
    },
    {
      en: "Mixing up who peers with whom. Layer 3 MPLS VPN: CE peers with PE. Layer 2 MPLS VPN and Metro Ethernet E-LAN: CE routers peer with each other.",
      hi: "Kaun kiska peer hai, isme confuse hona. Layer 3 MPLS VPN: CE ka peer PE. Layer 2 MPLS VPN aur Metro Ethernet E-LAN: CE routers aapas mein peer hote hain.",
    },
    {
      en: "Calling two links to one ISP \"multihomed\". That is dual-homed; multihomed means two different ISPs.",
      hi: "Ek ISP tak do links ko \"multihomed\" bolna. Woh dual-homed hai; multihomed ka matlab do alag ISPs.",
    },
    {
      en: "Thinking users need VPN software for a site-to-site VPN. The routers or firewalls build the tunnel; client software is only for remote-access VPNs.",
      hi: "Sochna ki site-to-site VPN ke liye users ko VPN software chahiye. Tunnel routers ya firewalls banate hain; client software sirf remote-access VPN ke liye hota hai.",
    },
    {
      en: "Adding a backup route only at the branch. HQ loses its route to the branch too, so it needs a matching backup or the replies are lost.",
      hi: "Backup route sirf branch par lagana. HQ ka branch wala route bhi chala jaata hai, isliye HQ par bhi matching backup chahiye, warna replies kho jaayenge.",
    },
  ],
  recap: [
    { en: "Leased line = dedicated point-to-point circuit; serial ones use HDLC (Cisco default) or PPP, and both ends must match.", hi: "Leased line = dedicated point-to-point circuit; serial wali HDLC (Cisco default) ya PPP use karti hain, aur dono ends match hone chahiye." },
    { en: "MPLS: CE (customer), PE (provider edge, adds/removes labels), P (provider core, labels only). Layer 3 VPN = CE peers with PE, any-to-any.", hi: "MPLS: CE (customer), PE (provider edge, labels lagata/hatata hai), P (provider core, sirf labels). Layer 3 VPN = CE ka peer PE, any-to-any." },
    { en: "Metro Ethernet: E-Line point-to-point, E-LAN full mesh, E-Tree hub-and-spoke.", hi: "Metro Ethernet mein E-Line point-to-point hai, E-LAN full mesh, aur E-Tree hub-and-spoke." },
    { en: "Internet access: DSL (phone line), cable (coax), fiber (ONT), 4G/5G (SIM). Single-homed, dual-homed (2 links, 1 ISP), multihomed (2 ISPs), dual multihomed (2 links to each of 2 ISPs).", hi: "Internet access: DSL (phone line), cable (coax), fiber (ONT), 4G/5G (SIM). Single-homed, dual-homed (2 links, 1 ISP), multihomed (2 ISPs), dual multihomed (2 ISPs mein se har ek tak 2 links)." },
    { en: "Site-to-site IPsec VPN: routers encrypt and add a new IP header between public addresses; hosts need nothing.", hi: "Site-to-site IPsec VPN: routers encrypt karke public addresses wala naya IP header lagate hain; hosts ko kuch nahi chahiye." },
    { en: "Typical design: MPLS primary, internet VPN backup via a floating static route at both ends.", hi: "Typical design: MPLS primary, internet VPN backup, dono ends par floating static route ke saath." },
  ],
  quiz: [
    {
      q: {
        en: "R1's `show interfaces serial0/0/0` shows `Encapsulation HDLC`. The router at the other end of the leased line is configured with `encapsulation ppp`. The cable and clock are fine. What does R1 report?",
        hi: "R1 ka `show interfaces serial0/0/0` `Encapsulation HDLC` dikhata hai. Leased line ke doosre end ke router par `encapsulation ppp` configured hai. Cable aur clock theek hain. R1 kya report karega?",
      },
      options: [
        { en: "`Serial0/0/0 is up, line protocol is up`", hi: "`Serial0/0/0 is up, line protocol is up` dikhayega" },
        { en: "`Serial0/0/0 is up, line protocol is down`", hi: "`Serial0/0/0 is up, line protocol is down` dikhayega" },
        { en: "`Serial0/0/0 is administratively down, line protocol is down`", hi: "`Serial0/0/0 is administratively down, line protocol is down` dikhayega" },
        { en: "`Serial0/0/0 is down, line protocol is down`", hi: "`Serial0/0/0 is down, line protocol is down` dikhayega" },
      ],
      answer: 1,
      explain: {
        en: "The physical layer works, so the interface is up, but the two ends speak different Layer 2 protocols, so the line protocol is down. \"Administratively down\" appears only after `shutdown`, and \"down\" means a physical problem.",
        hi: "Physical layer chal rahi hai, isliye interface up hai, lekin dono ends alag Layer 2 protocols bol rahe hain, isliye line protocol down hai. \"Administratively down\" sirf `shutdown` ke baad dikhta hai, aur \"down\" ka matlab physical problem hai.",
      },
      kind: "cli",
    },
    {
      q: { en: "Which statement about an MPLS Layer 3 VPN is true?", hi: "MPLS Layer 3 VPN ke baare mein kaunsa statement sahi hai?" },
      options: [
        { en: "The CE routers add and remove the MPLS labels", hi: "CE routers MPLS labels lagate aur hatate hain" },
        { en: "P routers keep a copy of every customer's routes", hi: "P routers har customer ke routes ki copy rakhte hain" },
        { en: "The CE router exchanges routes with the PE router", hi: "CE router PE router ke saath routes exchange karta hai" },
        { en: "All traffic is encrypted by the provider", hi: "Provider saara traffic encrypt karta hai" },
      ],
      answer: 2,
      explain: {
        en: "In a Layer 3 MPLS VPN the CE is a routing peer of the PE, which is how the provider learns where your subnets are. PEs handle labels, P routers forward on labels without customer routes, and MPLS does not encrypt.",
        hi: "Layer 3 MPLS VPN mein CE PE ka routing peer hota hai, isi se provider ko pata chalta hai ki tumhare subnets kahan hain. Labels PEs handle karte hain, P routers bina customer routes ke labels par forward karte hain, aur MPLS encrypt nahi karta.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A company has 6 sites. How many leased lines does a full mesh need, and how many does hub-and-spoke with one site as the hub need?",
        hi: "Ek company ki 6 sites hain. Full mesh ke liye kitni leased lines chahiye, aur ek site ko hub bana kar hub-and-spoke ke liye kitni?",
      },
      options: [
        { en: "15 and 5", hi: "15 aur 5" },
        { en: "30 and 6", hi: "30 aur 6" },
        { en: "12 and 5", hi: "12 aur 5" },
        { en: "15 and 6", hi: "15 aur 6" },
      ],
      answer: 0,
      explain: {
        en: "Full mesh: n(n−1)/2 = 6 × 5 / 2 = 15. Hub-and-spoke: every site except the hub needs one line, so 6 − 1 = 5.",
        hi: "Full mesh: n(n−1)/2 = 6 × 5 / 2 = 15. Hub-and-spoke: hub ke alawa har site ko ek line chahiye, yaani 6 − 1 = 5.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "A company wants every office in the city to reach every other office as if all their routers were plugged into one switch. Which Metro Ethernet service fits?",
        hi: "Company chahti hai ki shehar ka har office baaki har office tak aise pahunche jaise saare routers ek hi switch mein lage hon. Kaunsi Metro Ethernet service fit hai?",
      },
      options: [
        { en: "E-Line", hi: "E-Line" },
        { en: "E-Tree", hi: "E-Tree" },
        { en: "A serial leased line", hi: "Serial leased line" },
        { en: "E-LAN", hi: "E-LAN" },
      ],
      answer: 3,
      explain: {
        en: "E-LAN is multipoint-to-multipoint: every site reaches every other, like ports on one switch. E-Line joins only two sites, and E-Tree lets leaf sites reach only the root.",
        hi: "E-LAN multipoint-to-multipoint hai: har site baaki har site tak pahunchti hai, jaise ek switch ke ports. E-Line sirf do sites jodta hai, aur E-Tree mein leaf sites sirf root tak pahunch sakti hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An HQ router has two links to ISP A and two links to ISP B. What is this called?",
        hi: "HQ router ke ISP A tak do links hain aur ISP B tak do links. Ise kya kehte hain?",
      },
      options: [
        { en: "Single-homed", hi: "Single-homed" },
        { en: "Dual-homed", hi: "Dual-homed" },
        { en: "Dual multihomed", hi: "Dual multihomed" },
        { en: "Multihomed", hi: "Multihomed" },
      ],
      answer: 2,
      explain: {
        en: "Two ISPs makes it multihomed, and two links to each of them makes it dual multihomed. Dual-homed would be two links to a single ISP.",
        hi: "Do ISPs hain toh multihomed, aur har ek tak do links hain toh dual multihomed. Dual-homed tab hota jab ek hi ISP tak do links hote.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A branch uses MPLS as its primary WAN and a site-to-site IPsec VPN over 4G as backup. The MPLS link fails. What happens to a packet from a branch PC to a server at HQ?",
        hi: "Ek branch primary WAN ke liye MPLS aur backup ke liye 4G par site-to-site IPsec VPN use karti hai. MPLS link fail ho jaata hai. Branch PC se HQ ke server tak ke packet ka kya hota hai?",
      },
      options: [
        { en: "It is dropped until the MPLS link is repaired", hi: "MPLS link theek hone tak drop hota hai" },
        { en: "The branch router encrypts it and sends it inside a new IP packet addressed to HQ's public address", hi: "Branch router use encrypt karke HQ ke public address wale naye IP packet ke andar bhejta hai" },
        { en: "The PC must connect its own VPN client before it can send", hi: "Bhejne se pehle PC ko apna VPN client connect karna padega" },
        { en: "The PE router sends it over the internet instead", hi: "PE router use internet par bhej deta hai" },
      ],
      answer: 1,
      explain: {
        en: "With the MPLS routes gone, the branch router's backup route points into the tunnel. The router encrypts the packet and adds a new IP header to HQ's public address. The PC notices nothing, and the PE plays no part, because the branch's link to it is down.",
        hi: "MPLS routes chale gaye, toh branch router ka backup route tunnel ki taraf point karta hai. Router packet encrypt karke HQ ke public address wala naya IP header lagata hai. PC ko kuch pata nahi chalta, aur PE ka isme koi role nahi, kyunki branch ka uske saath link hi down hai.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "BW3fQgdf4-w",
      title: "Free CCNA | WAN Architectures | Day 53",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Leased lines, MPLS with CE/PE/P, Metro Ethernet, internet access types, homing and VPNs: this whole lesson in one video.", hi: "Leased lines, CE/PE/P ke saath MPLS, Metro Ethernet, internet access types, homing aur VPNs: poora lesson ek video mein." },
    },
    {
      id: "xPi4uZu4uF0",
      title: "WAN....it's not the internet!! (sometimes) // FREE CCNA // EP 8",
      channel: "NetworkChuck",
      lang: "en",
      note: { en: "A lighter introduction to what a WAN is and how companies connect sites.", hi: "WAN kya hai aur companies sites ko kaise jodti hain, iska halka introduction." },
    },
    {
      id: "WSMPXwFndzQ",
      title: "173. CCNA 200-301 Full Course in Hindi 2024 | WAN Technologies - Wide Area Network",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walkthrough of WAN connection types and topologies.", hi: "WAN connection types aur topologies ka Hindi walkthrough." },
    },
    {
      id: "vYFlXd_zJsI",
      title: "174. CCNA 200-301 Full Course in Hindi 2024 | MPLS - Multi Protocol Label Switching",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of MPLS labels and the CE, PE and P roles.", hi: "MPLS labels aur CE, PE aur P roles ka Hindi explanation." },
    },
  ],
  lab: {
    title: { en: "A leased line and an Ethernet WAN link in Packet Tracer", hi: "Packet Tracer mein leased line aur Ethernet WAN link" },
    steps: [
      {
        en: "Add two 2911 routers named HQ and Branch1. On each, turn the power off, insert an HWIC-2T serial module, and turn it back on. Run `show ip interface brief` to see the new port names; the steps below assume Serial0/0/0.",
        hi: "Do 2911 routers add karo, naam HQ aur Branch1. Har ek ki power off karo, HWIC-2T serial module lagao, aur power wapas on karo. `show ip interface brief` chala kar naye ports ke naam dekho; aage ke steps Serial0/0/0 maan kar chalte hain.",
      },
      {
        en: "Connect Serial0/0/0 to Serial0/0/0 with a Serial DCE cable; this plays the leased line. On HQ enter `ip address 172.16.12.1 255.255.255.252` under the interface, use .2 on Branch1, and `no shutdown` both ends.",
        hi: "Serial DCE cable se Serial0/0/0 ko Serial0/0/0 se jodo; yeh leased line ka kaam karega. HQ par interface ke andar `ip address 172.16.12.1 255.255.255.252` do, Branch1 par .2 use karo, aur dono ends par `no shutdown` karo.",
      },
      {
        en: "Run `show controllers serial0/0/0` to see which end is DCE. If the line protocol stays down, set `clock rate 64000` on the DCE end. Then `ping 172.16.12.2` from HQ.",
        hi: "`show controllers serial0/0/0` chala kar dekho kaunsa end DCE hai. Line protocol down hi rahe toh DCE end par `clock rate 64000` set karo. Phir HQ se `ping 172.16.12.2` karo.",
      },
      {
        en: "Run `show interfaces serial0/0/0` and find `BW 1544 Kbit/sec` and `Encapsulation HDLC`.",
        hi: "`show interfaces serial0/0/0` chalao aur `BW 1544 Kbit/sec` aur `Encapsulation HDLC` dhoondho.",
      },
      {
        en: "Set `encapsulation ppp` on HQ only and watch the line protocol go down. Set it on Branch1 too and it comes back up.",
        hi: "Sirf HQ par `encapsulation ppp` set karo aur line protocol down hote dekho. Branch1 par bhi set karo, link wapas up ho jaayega.",
      },
      {
        en: "Now join Gi0/0 to Gi0/0 with a Copper Cross-Over cable as an Ethernet WAN link (like a Metro Ethernet E-Line), address it 172.16.21.1/30 and .2, run `no shutdown` on both ends, and ping. No clock and no HDLC: it is just Ethernet.",
        hi: "Ab Copper Cross-Over cable se Gi0/0 ko Gi0/0 se jodo, Ethernet WAN link ki tarah (Metro Ethernet E-Line jaisa), 172.16.21.1/30 aur .2 address do, dono ends par `no shutdown` karo, aur ping karo. Na clock, na HDLC: yeh bas Ethernet hai.",
      },
    ],
  },
};

export default lesson;
