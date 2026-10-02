import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "bgp-basics",
  intro: {
    en: "OSPF and EIGRP pick the fastest path inside one organisation. Between organisations the question is different: which neighbour do you trust, which link do you pay less for, and which networks are you willing to carry for others. BGP is the protocol that answers those questions for the whole internet, and as soon as a company connects to two ISPs, its edge routers run BGP too.",
    hi: "OSPF aur EIGRP ek organisation ke andar sabse fast path chunte hain. Organisations ke beech sawaal alag hota hai: kis neighbour par trust karna hai, kaunsa link sasta padta hai, aur kiske networks tum doosron ke liye carry karne ko taiyaar ho. Poore internet ke liye in sawaalon ka jawab BGP deta hai, aur jaise hi koi company do ISPs se judti hai, uske edge routers par bhi BGP chalta hai.",
  },
  outcomes: [
    { en: "Explain what an autonomous system is and tell public, private and 4-byte ASNs apart", hi: "Samjha sako ki autonomous system kya hai, aur public, private aur 4-byte ASNs mein fark bata sako" },
    { en: "Compare eBGP and iBGP and describe how a BGP session forms over TCP port 179", hi: "eBGP aur iBGP compare kar sako, aur samjha sako ki BGP session TCP port 179 par kaise banta hai" },
    { en: "Use AS_PATH, NEXT_HOP, LOCAL_PREF, MED and WEIGHT to predict which path BGP chooses", hi: "AS_PATH, NEXT_HOP, LOCAL_PREF, MED aur WEIGHT dekh kar predict kar sako ki BGP kaunsa path chunega" },
    { en: "Steer outbound traffic with local preference and inbound traffic with AS-path prepending", hi: "Local preference se outbound traffic aur AS-path prepending se inbound traffic steer kar sako" },
    { en: "Configure a basic eBGP session and read `show ip bgp summary` and `show ip bgp`", hi: "Basic eBGP session configure kar sako aur `show ip bgp summary` aur `show ip bgp` padh sako" },
  ],
  sections: [
    {
      id: "why-bgp",
      heading: { en: "Why the internet runs on BGP", hi: "Internet BGP par kyun chalta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 3.5 you met the split between IGPs and EGPs. An **IGP** (OSPF, EIGRP, IS-IS) finds the best path inside one organisation, using a metric such as cost or bandwidth. Every router trusts every other router, and the goal is speed. Between organisations neither assumption holds. Your ISP does not want your routers flooding LSAs into its network, and the cheapest path for you might be the one your contract says to avoid.",
            hi: "Lesson 3.5 mein tumne IGP aur EGP ka fark dekha tha. **IGP** (OSPF, EIGRP, IS-IS) ek organisation ke andar best path dhoondhta hai, cost ya bandwidth jaise metric se. Har router doosre router par trust karta hai, aur goal speed hai. Organisations ke beech yeh dono baatein sach nahi hoti. Tumhara ISP nahi chahega ki tumhare routers uske network mein LSAs flood karein, aur jo path tumhe sabse sasta lagta hai, ho sakta hai contract ke hisaab se wahi avoid karna ho.",
          },
        },
        {
          type: "p",
          text: {
            en: "**BGP (Border Gateway Protocol, version 4)** solves this with three design choices. It is a **path-vector** protocol: each route carries the list of autonomous systems it passed through, not a speed metric. It is **policy-driven**: you decide with route-maps which routes to accept, prefer or advertise. And it is built for **scale**: the global IPv4 table holds roughly a million prefixes, so BGP runs over TCP and sends only changes, never periodic full tables.",
            hi: "**BGP (Border Gateway Protocol, version 4)** yeh problem teen design choices se solve karta hai. Yeh **path-vector** protocol hai: har route ke saath un autonomous systems ki list chalti hai jinse woh guzra, koi speed metric nahi. Yeh **policy-driven** hai: route-maps se tum decide karte ho ki kaunse routes accept karne hain, prefer karne hain ya advertise karne hain. Aur yeh **scale** ke liye bana hai: global IPv4 table mein lagbhag das lakh (ek million) prefixes hain, isliye BGP TCP par chalta hai aur sirf changes bhejta hai, kabhi periodic full table nahi.",
          },
        },
        {
          type: "table",
          caption: { en: "IGP versus BGP", hi: "IGP versus BGP" },
          columns: ["", "OSPF / EIGRP (IGP)", "BGP"],
          rows: [
            [{ en: "Works", hi: "Kahan kaam karta hai" }, { en: "Inside one AS", hi: "Ek AS ke andar" }, { en: "Between ASes (eBGP) and across one AS (iBGP)", hi: "ASes ke beech (eBGP) aur ek AS ke paar (iBGP)" }],
            [{ en: "Chooses by", hi: "Kis basis par chunta hai" }, { en: "Metric: cost, bandwidth, delay", hi: "Metric: cost, bandwidth, delay" }, { en: "Path attributes and your policy", hi: "Path attributes aur tumhari policy" }],
            [{ en: "Neighbours", hi: "Neighbours" }, { en: "Discovered automatically with multicast hellos", hi: "Multicast hellos se apne aap discover hote hain" }, { en: "Configured by hand, one `neighbor` line each", hi: "Haath se configure hote hain, har ek ki `neighbor` line" }],
            [{ en: "Transport", hi: "Transport" }, { en: "Directly over IP (OSPF protocol 89, EIGRP 88)", hi: "Seedha IP par (OSPF protocol 89, EIGRP 88)" }, "TCP port 179"],
            [{ en: "Typical table size", hi: "Typical table size" }, { en: "Hundreds to thousands of routes", hi: "Sau se hazaar routes tak" }, { en: "About a million IPv4 routes on the internet", hi: "Internet par lagbhag das lakh IPv4 routes" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "How much BGP is on the CCNA", hi: "CCNA mein BGP kitna hai" },
          text: {
            en: "CCNA 200-301 v1.1 expects you to know that BGP is the EGP of the internet, that eBGP has AD 20 and iBGP AD 200, and that `B` marks BGP routes in the routing table. Attributes, best-path selection and configuration are CCNP ENCOR material. You learn them here because you will meet BGP on the job long before you sit ENCOR.",
            hi: "CCNA 200-301 v1.1 mein itna aana chahiye: BGP internet ka EGP hai, eBGP ka AD 20 aur iBGP ka AD 200 hai, aur routing table mein `B` BGP route dikhata hai. Attributes, best-path selection aur configuration CCNP ENCOR ka material hai. Hum ise yahan isliye padh rahe hain kyunki job par BGP tumhe ENCOR se kaafi pehle mil jaayega.",
          },
        },
      ],
    },
    {
      id: "autonomous-systems",
      heading: { en: "Autonomous systems, ASNs, eBGP and iBGP", hi: "Autonomous systems, ASNs, eBGP aur iBGP" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An **autonomous system (AS)** is a set of networks run by one organisation with one routing policy: an ISP, a cloud provider, a bank. Each AS that runs BGP on the internet has an **AS number (ASN)** from a regional registry; in India that is APNIC, or IRINN, the national registry under it. Google, for example, is AS15169. BGP identifies paths by these numbers, not by router names.",
            hi: "**Autonomous system (AS)** networks ka ek set hai jo ek organisation chalata hai, ek routing policy ke saath: koi ISP, cloud provider ya bank. Internet par BGP chalane wale har AS ke paas regional registry se mila **AS number (ASN)** hota hai; India mein yeh APNIC deta hai, ya uske neeche wali national registry IRINN. Jaise Google AS15169 hai. BGP paths ko inhi numbers se pehchanta hai, router ke naam se nahi.",
          },
        },
        {
          type: "table",
          caption: { en: "ASN ranges you should recognise", hi: "ASN ranges jo pehchaanni chahiye" },
          columns: ["Range", { en: "Use", hi: "Use" }],
          rows: [
            ["1 - 64495", { en: "Public 2-byte ASNs, assigned by registries", hi: "Public 2-byte ASNs, registries assign karti hain" }],
            ["64496 - 64511", { en: "Reserved for documentation and examples (used for the ISPs in this lesson)", hi: "Documentation aur examples ke liye reserved (is lesson ke ISPs inhi se hain)" }],
            ["64512 - 65534", { en: "Private 2-byte ASNs: labs, internal use, customers of one ISP", hi: "Private 2-byte ASNs: labs, internal use, ek hi ISP ke customers" }],
            ["65536 - 4199999999", { en: "Public 4-byte ASNs (a few small blocks reserved), written as plain numbers (asplain, e.g. 131072) or as asdot (2.0)", hi: "Public 4-byte ASNs (kuch chhote blocks reserved hain), plain number (asplain, jaise 131072) ya asdot (2.0) mein likhe jaate hain" }],
            ["4200000000 - 4294967294", { en: "Private 4-byte ASNs", hi: "Private 4-byte ASNs" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "2-byte ASNs ran out, so registries now hand out **4-byte ASNs** (RFC 6793). Private ASNs work like RFC 1918 addresses: fine inside your network or towards one ISP, but they must never appear in a path on the public internet. This lesson's lab uses private AS 65001 for the company. A real company connected to two different ISPs normally gets a public ASN for exactly that reason.",
            hi: "2-byte ASNs khatam ho gaye, isliye registries ab **4-byte ASNs** (RFC 6793) deti hain. Private ASNs RFC 1918 addresses jaise hain: tumhare network ke andar ya ek ISP ki taraf theek hain, lekin public internet par kisi path mein kabhi nahi dikhne chahiye. Is lesson ke lab mein company ke liye private AS 65001 use hua hai. Asli company jo do alag ISPs se judi ho, aam taur par isi wajah se public ASN leti hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**eBGP (external BGP)**: a session between routers in **different** ASes, usually directly connected (R1 in AS 65001 and ISP-A in AS 64500). Routes learned this way get **AD 20**.",
              hi: "**eBGP (external BGP)**: **alag-alag** ASes ke routers ke beech session, aam taur par directly connected (AS 65001 ka R1 aur AS 64500 ka ISP-A). Aise seekhe routes ka **AD 20** hota hai.",
            },
            {
              en: "**iBGP (internal BGP)**: a session between routers in the **same** AS, often between loopbacks several hops apart. It carries externally learned routes across your AS. Routes learned this way get **AD 200**, so your IGP wins for internal prefixes.",
              hi: "**iBGP (internal BGP)**: **same** AS ke routers ke beech session, aksar loopbacks ke beech jo kai hops door hon. Yeh bahar se seekhe routes ko tumhare AS ke paar le jaata hai. Aise routes ka **AD 200** hota hai, isliye internal prefixes ke liye tumhara IGP jeetta hai.",
            },
            {
              en: "A router does not pass a route learned from one iBGP peer to another iBGP peer. That is why iBGP routers need a full mesh of sessions, or route reflectors in larger networks.",
              hi: "Router ek iBGP peer se seekha route doosre iBGP peer ko aage nahi deta. Isi wajah se iBGP routers ko sessions ka full mesh chahiye, ya bade networks mein route reflectors.",
            },
          ],
        },
      ],
    },
    {
      id: "sessions",
      heading: { en: "How a BGP session comes up", hi: "BGP session kaise up hota hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "BGP neighbours are never discovered. You configure each one, and the two routers open a **TCP connection to port 179**. Because TCP already guarantees delivery and order, BGP has no need for its own acknowledgements or periodic refreshes. After the initial exchange it sends only changes.",
            hi: "BGP neighbours kabhi apne aap discover nahi hote. Har neighbour tum configure karte ho, aur dono routers **TCP port 179** par connection kholte hain. TCP pehle se delivery aur order ki guarantee deta hai, isliye BGP ko apne acknowledgements ya periodic refresh ki zaroorat nahi. Pehle exchange ke baad yeh sirf changes bhejta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Neighbour states, in order", hi: "Neighbour states, order mein" },
          columns: [{ en: "State", hi: "State" }, { en: "What is happening", hi: "Kya ho raha hai" }],
          rows: [
            ["Idle", { en: "Not trying yet, or waiting after an error. `Idle (Admin)` means the neighbour is shut down in config.", hi: "Abhi try nahi kar raha, ya error ke baad ruka hai. `Idle (Admin)` ka matlab config mein neighbour shutdown hai." }],
            ["Connect", { en: "Waiting for the TCP three-way handshake to finish.", hi: "TCP three-way handshake poora hone ka wait." }],
            ["Active", { en: "The TCP attempt failed; the router keeps retrying. Despite the name, this is a problem state.", hi: "TCP attempt fail hua; router baar-baar retry kar raha hai. Naam se dhokha mat khao, yeh problem wali state hai." }],
            ["OpenSent", { en: "TCP is up and an Open message was sent; waiting for the peer's Open.", hi: "TCP up hai aur Open message bhej diya; peer ke Open ka wait." }],
            ["OpenConfirm", { en: "The peer's Open was accepted; waiting for a Keepalive.", hi: "Peer ka Open accept ho gaya; ab Keepalive ka wait." }],
            ["Established", { en: "The session is up. Update messages carry routes.", hi: "Session up hai. Ab Update messages routes le jaate hain." }],
          ],
        },
        {
          type: "table",
          caption: { en: "The four core BGP messages", hi: "BGP ke chaar main messages" },
          columns: [{ en: "Message", hi: "Message" }, { en: "Purpose", hi: "Kaam" }],
          rows: [
            ["Open", { en: "Starts the session: BGP version 4, my ASN, hold time, router ID. The ASN must match the peer's `remote-as`.", hi: "Session shuru karta hai: BGP version 4, mera ASN, hold time, router ID. ASN peer ke `remote-as` se match hona chahiye." }],
            ["Update", { en: "Advertises prefixes with their path attributes, or withdraws prefixes that are gone.", hi: "Prefixes ko unke path attributes ke saath advertise karta hai, ya jo prefixes chale gaye unhe withdraw karta hai." }],
            ["Keepalive", { en: "Proves the peer is alive. Cisco default: every 60 seconds, hold time 180 seconds.", hi: "Batata hai ki peer zinda hai. Cisco default: har 60 seconds, hold time 180 seconds." }],
            ["Notification", { en: "Reports an error, then the session is closed.", hi: "Error report karta hai, phir session band ho jaata hai." }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Active is not good", hi: "Active achha nahi hai" },
          text: {
            en: "In `show ip bgp summary`, a healthy neighbour shows a number in the State/PfxRcd column (the prefixes received). A word such as `Active` or `Idle` means the session is down. Check reachability to the neighbour address, the `remote-as` number on both sides, and ACLs blocking TCP 179.",
            hi: "`show ip bgp summary` mein healthy neighbour ke State/PfxRcd column mein ek number dikhta hai (kitne prefixes mile). Agar `Active` ya `Idle` jaisa word dikhe, toh session down hai. Neighbour address tak reachability, dono taraf ka `remote-as` number, aur TCP 179 block karne wale ACLs check karo.",
          },
        },
      ],
    },
    {
      id: "attributes-best-path",
      heading: { en: "Path attributes and the best-path decision", hi: "Path attributes aur best-path decision" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every prefix in an Update carries **path attributes**. BGP may learn the same prefix from several neighbours; it compares their attributes, installs one best path in the routing table and advertises only that best path onwards.",
            hi: "Update mein har prefix ke saath **path attributes** hote hain. BGP ko same prefix kai neighbours se mil sakta hai; woh unke attributes compare karta hai, ek best path routing table mein daalta hai aur aage sirf wahi best path advertise karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The attributes you will use first", hi: "Woh attributes jo sabse pehle use karoge" },
          columns: [{ en: "Attribute", hi: "Attribute" }, { en: "What it holds", hi: "Ismein kya hota hai" }, { en: "Preferred", hi: "Kaunsa jeetta hai" }, { en: "Scope", hi: "Kahan tak jaata hai" }],
          rows: [
            ["WEIGHT", { en: "Cisco-only value set on one router. Default 0, or 32768 for routes the router originates.", hi: "Sirf Cisco ki value, ek router par set hoti hai. Default 0, aur router ke apne routes ke liye 32768." }, { en: "Highest", hi: "Sabse zyada" }, { en: "That router only; never advertised", hi: "Sirf usi router par; kabhi advertise nahi hota" }],
            ["LOCAL_PREF", { en: "Your AS's preference for an exit. Default 100.", hi: "Tumhare AS ki pasand ki kaunse exit se bahar jaana hai. Default 100." }, { en: "Highest", hi: "Sabse zyada" }, { en: "Shared by iBGP inside your AS; not sent to eBGP peers", hi: "iBGP se tumhare AS ke andar share hota hai; eBGP peers ko nahi jaata" }],
            ["AS_PATH", { en: "The list of ASNs the route has crossed, newest first", hi: "Route jin ASNs se guzra unki list, sabse naya pehle" }, { en: "Shortest", hi: "Sabse chhota" }, { en: "Every AS adds its own number when sending over eBGP", hi: "Har AS eBGP par bhejte waqt apna number jodta hai" }],
            ["MED", { en: "A hint to a neighbour AS about which of your entry points to use", hi: "Neighbour AS ko hint ki tumhare kaunse entry point se aaye" }, { en: "Lowest", hi: "Sabse kam" }, { en: "Sent to one neighbour AS, not passed further", hi: "Ek neighbour AS ko jaata hai, uske aage nahi" }],
            ["NEXT_HOP", { en: "The IP address to forward to for this prefix", hi: "Is prefix ke liye packet kis IP par forward karna hai" }, { en: "Must be reachable", hi: "Reachable hona zaroori" }, { en: "Set to the sender's address on eBGP; unchanged across iBGP by default", hi: "eBGP par sender ka address; iBGP par by default nahi badalta" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "**AS_PATH is also BGP's loop prevention.** When a router receives an Update whose AS_PATH already contains its own ASN, it discards it. R1 in AS 65001 will never accept a path like `64510 64496 64500 65001`, because that route started in its own AS.",
            hi: "**AS_PATH hi BGP ka loop prevention bhi hai.** Jab router ko aisa Update milta hai jiske AS_PATH mein uska apna ASN pehle se hai, toh woh use discard kar deta hai. AS 65001 ka R1 kabhi `64510 64496 64500 65001` jaisa path accept nahi karega, kyunki woh route uske apne AS se hi shuru hua tha.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "The NEXT_HOP must be reachable, otherwise the path is not even considered.", hi: "NEXT_HOP reachable hona chahiye, warna path consider hi nahi hota." },
            { en: "Highest **WEIGHT** (Cisco only).", hi: "Sabse zyada **WEIGHT** (sirf Cisco)." },
            { en: "Highest **LOCAL_PREF**.", hi: "Sabse zyada **LOCAL_PREF**." },
            { en: "A route this router originated itself (`network` command or redistribution).", hi: "Jo route is router ne khud originate kiya (`network` command ya redistribution)." },
            { en: "Shortest **AS_PATH**.", hi: "Sabse chhota **AS_PATH**." },
            { en: "Lowest **ORIGIN** code: IGP (`i`) before EGP (`e`) before incomplete (`?`).", hi: "Sabse kam **ORIGIN** code: IGP (`i`), phir EGP (`e`), phir incomplete (`?`)." },
            { en: "Lowest **MED**, compared by default only between paths from the same neighbouring AS.", hi: "Sabse kam **MED**, by default sirf same neighbouring AS se aaye paths ke beech compare hota hai." },
            { en: "eBGP over iBGP, then the lowest IGP metric to the NEXT_HOP, then tie-breakers such as the oldest eBGP path and the lowest neighbour router ID.", hi: "eBGP ko iBGP par preference, phir NEXT_HOP tak sabse kam IGP metric, phir tie-breakers jaise sabse purana eBGP path aur sabse kam neighbour router ID." },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "A way to remember the order", hi: "Order yaad rakhne ka tareeka" },
          text: {
            en: "\"**W**e **L**ove **O**ranges **A**S **O**ranges **M**ean **P**ure **R**efreshment\": Weight, Local pref, Originated, AS_PATH, Origin, MED, Paths (eBGP over iBGP), Router ID. The full Cisco list has a few more steps; this simplified order is what you need to reason about real designs.",
            hi: "\"**W**e **L**ove **O**ranges **A**S **O**ranges **M**ean **P**ure **R**efreshment\": Weight, Local pref, Originated, AS_PATH, Origin, MED, Paths (eBGP over iBGP), Router ID. Cisco ki poori list mein kuch aur steps bhi hain; real designs samajhne ke liye yeh simplified order kaafi hai.",
          },
        },
      ],
    },
    {
      id: "steering-traffic",
      heading: { en: "Steering traffic: outbound with LOCAL_PREF, inbound with prepending", hi: "Traffic steer karna: outbound LOCAL_PREF se, inbound prepending se" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Take the company in the animation: R1 in AS 65001 owns `203.0.113.0/24` and connects to ISP-A (AS 64500) on a 1 Gbps link and ISP-B (AS 64510) on a cheaper 200 Mbps link. It wants to use ISP-A for both directions and keep ISP-B as backup. These are two separate problems, because each direction is decided by a different AS.",
            hi: "Animation wali company lo: AS 65001 ka R1 `203.0.113.0/24` ka owner hai, ISP-A (AS 64500) se 1 Gbps link par aur ISP-B (AS 64510) se saste 200 Mbps link par juda hai. Use dono directions mein ISP-A use karna hai aur ISP-B ko backup rakhna hai. Yeh do alag problems hain, kyunki har direction ka decision alag AS leta hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Outbound** (your users to the internet) is your own decision. R1 learns `192.0.2.0/24` from both ISPs with equal AS_PATH lengths. Setting **LOCAL_PREF 200** on everything from ISP-A makes R1, and every iBGP router in your AS, choose ISP-A. LOCAL_PREF is checked before AS_PATH, so it wins even against a shorter path.",
              hi: "**Outbound** (tumhare users se internet tak) tumhara apna decision hai. R1 ko `192.0.2.0/24` dono ISPs se barabar AS_PATH length ke saath milta hai. ISP-A se aane wale har route par **LOCAL_PREF 200** set karo, toh R1 aur tumhare AS ka har iBGP router ISP-A chunega. LOCAL_PREF AS_PATH se pehle check hota hai, isliye yeh chhote path ke against bhi jeet jaata hai.",
            },
            {
              en: "**Inbound** (the internet to your servers) is decided by other ASes, using the paths you advertise. You cannot set their LOCAL_PREF, but you can make the ISP-B path look worse. **AS-path prepending** adds your own ASN extra times to the Updates sent to ISP-B, so the rest of the internet sees `64510 65001 65001 65001 65001` via ISP-B against `64500 65001` via ISP-A, and picks ISP-A.",
              hi: "**Inbound** (internet se tumhare servers tak) ka decision doosre ASes lete hain, tumhare advertise kiye paths dekh kar. Tum unka LOCAL_PREF set nahi kar sakte, lekin ISP-B wala path kharab dikha sakte ho. **AS-path prepending** ISP-B ko bheje gaye Updates mein tumhara apna ASN extra baar jod deta hai, toh baaki internet ko ISP-B ke through `64510 65001 65001 65001 65001` dikhta hai aur ISP-A ke through `64500 65001`, aur woh ISP-A chunta hai.",
            },
            {
              en: "**MED** is the other inbound tool, but it only influences one neighbouring AS that you connect to in several places, such as two links to the same ISP.",
              hi: "**MED** inbound ka doosra tool hai, lekin yeh sirf us ek neighbouring AS par asar karta hai jisse tum kai jagah jude ho, jaise same ISP se do links.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Prepending is a request, not a command", hi: "Prepending request hai, command nahi" },
          text: {
            en: "Other ASes apply their own policy first. Real ISPs usually give their customers' routes a higher LOCAL_PREF than routes learned from other ISPs, so ISP-B will keep using its direct link to you no matter how long your prepended path is. Prepending shifts most inbound traffic, rarely all of it. In the animation every AS uses default settings, so you also see what happens when nobody overrides AS_PATH length.",
            hi: "Doosre ASes pehle apni policy lagate hain. Real ISPs aam taur par apne customers ke routes ko doosre ISPs se seekhe routes se zyada LOCAL_PREF dete hain, isliye tumhara prepended path kitna bhi lamba ho, ISP-B tum tak apna direct link hi use karta rahega. Prepending zyadatar inbound traffic shift karta hai, poora kam hi. Animation mein har AS default settings par hai, isliye wahan yeh bhi dikhta hai ki jab koi AS_PATH length ko override nahi karta tab kya hota hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Expect **asymmetric routing** while you tune this: before prepending, R1 sends to `192.0.2.10` through ISP-A, while the replies arrive through ISP-B, because AS 64496 made its own choice. That is normal for BGP, but it matters for stateful firewalls and NAT that expect to see both directions.",
            hi: "Yeh tune karte waqt **asymmetric routing** expect karo: prepending se pehle R1 `192.0.2.10` ko ISP-A se bhejta hai, jabki replies ISP-B se aate hain, kyunki AS 64496 ne apna choice khud kiya. BGP mein yeh normal hai, lekin stateful firewalls aur NAT ke liye yeh maayne rakhta hai, kyunki unhe dono directions dekhni hoti hain.",
          },
        },
      ],
    },
    {
      id: "basic-config",
      heading: { en: "Basic eBGP configuration and verification", hi: "Basic eBGP configuration aur verification" },
      blocks: [
        {
          type: "cli",
          title: { en: "R1: two eBGP neighbours and one advertised prefix", hi: "R1: do eBGP neighbours aur ek advertised prefix" },
          lines: [
            { prompt: "R1(config)#", cmd: "router bgp 65001", comment: { en: "Your own ASN. A router runs only one BGP process.", hi: "Tumhara apna ASN. Router par sirf ek BGP process chalta hai." } },
            { prompt: "R1(config-router)#", cmd: "bgp router-id 203.0.113.1" },
            { prompt: "R1(config-router)#", cmd: "neighbor 198.51.100.1 remote-as 64500", comment: { en: "remote-as differs from 65001, so this is eBGP", hi: "remote-as 65001 se alag hai, isliye yeh eBGP hai" } },
            { prompt: "R1(config-router)#", cmd: "neighbor 198.51.100.5 remote-as 64510" },
            { prompt: "R1(config-router)#", cmd: "network 203.0.113.0 mask 255.255.255.0", comment: { en: "Advertise this prefix, if an exact match is in the routing table", hi: "Yeh prefix advertise karo, agar routing table mein exact match ho" } },
            { prompt: "R1(config-router)#", cmd: "exit" },
            { prompt: "R1(config)#", cmd: "ip route 203.0.113.0 255.255.255.0 Null0", comment: { en: "Gives the network command its exact /24 match", hi: "Network command ko exact /24 match deta hai" } },
            { out: "%BGP-5-ADJCHANGE: neighbor 198.51.100.1 Up" },
          ],
          note: {
            en: "R1's LAN uses only `203.0.113.0/25`, so there is no /24 in its routing table. Unlike OSPF, BGP's `network` command does not enable anything on interfaces; it only advertises a prefix that already exists in the routing table with exactly that mask. The static route to `Null0` creates that /24, and it can never flap.",
            hi: "R1 ka LAN sirf `203.0.113.0/25` use karta hai, toh uski routing table mein koi /24 nahi hai. OSPF ke ulat, BGP ka `network` command interfaces par kuch enable nahi karta; yeh sirf woh prefix advertise karta hai jo routing table mein exactly usi mask ke saath pehle se ho. `Null0` wala static route woh /24 bana deta hai, aur yeh kabhi flap nahi hota.",
          },
        },
        {
          type: "cli",
          title: { en: "Policy: LOCAL_PREF in from ISP-A, prepending out to ISP-B", hi: "Policy: ISP-A se aate routes par LOCAL_PREF, ISP-B ko jaate routes par prepending" },
          lines: [
            { prompt: "R1(config)#", cmd: "route-map FROM-ISPA permit 10" },
            { prompt: "R1(config-route-map)#", cmd: "set local-preference 200" },
            { prompt: "R1(config-route-map)#", cmd: "route-map TO-ISPB permit 10" },
            { prompt: "R1(config-route-map)#", cmd: "set as-path prepend 65001 65001 65001", comment: { en: "Three extra copies; eBGP adds the fourth when sending", hi: "Teen extra copies; chauthi eBGP bhejte waqt khud jodta hai" } },
            { prompt: "R1(config-route-map)#", cmd: "router bgp 65001" },
            { prompt: "R1(config-router)#", cmd: "neighbor 198.51.100.1 route-map FROM-ISPA in" },
            { prompt: "R1(config-router)#", cmd: "neighbor 198.51.100.5 route-map TO-ISPB out" },
            { prompt: "R1(config-router)#", cmd: "end" },
            { prompt: "R1#", cmd: "clear ip bgp * soft", comment: { en: "Re-applies policy without dropping the sessions", hi: "Sessions tode bina policy dobara apply karta hai" } },
          ],
        },
        {
          type: "cli",
          title: { en: "Verification", hi: "Verification" },
          lines: [
            { prompt: "R1#", cmd: "show ip bgp summary" },
            { out: "BGP router identifier 203.0.113.1, local AS number 65001" },
            { out: "Neighbor        V           AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd" },
            { out: "198.51.100.1    4        64500      14      12        5    0    0 00:09:51        1", comment: { en: "A number = Established, 1 prefix received", hi: "Number = Established, 1 prefix mila" } },
            { out: "198.51.100.5    4        64510      13      12        5    0    0 00:09:47        1" },
            { prompt: "R1#", cmd: "show ip bgp" },
            { out: "     Network          Next Hop            Metric LocPrf Weight Path" },
            { out: " *   192.0.2.0        198.51.100.5                           0 64510 64496 i" },
            { out: " *>                   198.51.100.1                  200      0 64500 64496 i", comment: { en: "> = best path, chosen on LOCAL_PREF 200", hi: "> = best path, LOCAL_PREF 200 ki wajah se chuna gaya" } },
            { out: " *>  203.0.113.0      0.0.0.0                  0         32768 i", comment: { en: "Locally originated: next hop 0.0.0.0, weight 32768", hi: "R1 ka apna route: next hop 0.0.0.0, weight 32768" } },
            { prompt: "R1#", cmd: "show ip route bgp" },
            { out: "B        192.0.2.0/24 [20/0] via 198.51.100.1, 00:02:13", comment: { en: "B = BGP, AD 20 = eBGP", hi: "B matlab BGP, AD 20 matlab eBGP" } },
          ],
          note: {
            en: "`show ip bgp` lists every path BGP knows (the BGP table). Only the `>` path goes into the routing table. A prefix whose mask matches its old class, such as 192.0.2.0/24, is shown without the length.",
            hi: "`show ip bgp` BGP ko pata har path dikhata hai (BGP table). Routing table mein sirf `>` wala path jaata hai. Jis prefix ka mask uski purani class se match karta hai, jaise 192.0.2.0/24, woh length ke bina dikhta hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Autonomous system (AS)", def: { en: "A set of networks under one organisation's routing policy, identified in BGP by its ASN.", hi: "Ek organisation ki routing policy ke neeche networks ka set, jise BGP mein uske ASN se pehchana jaata hai." } },
    { term: "ASN", def: { en: "Autonomous system number. Public ones come from registries; 64512-65534 and 4200000000-4294967294 are private.", hi: "Autonomous system number. Public ASNs registries se milte hain; 64512-65534 aur 4200000000-4294967294 private hain." } },
    { term: "eBGP / iBGP", def: { en: "eBGP runs between different ASes (AD 20); iBGP runs inside one AS (AD 200).", hi: "eBGP alag ASes ke beech chalta hai (AD 20); iBGP ek AS ke andar chalta hai (AD 200)." } },
    { term: "AS_PATH", def: { en: "The list of ASNs a route has crossed; shorter is preferred, and a router rejects a path containing its own ASN.", hi: "Route jin ASNs se guzra unki list; chhota path prefer hota hai, aur router apne ASN wala path reject kar deta hai." } },
    { term: "LOCAL_PREF", def: { en: "An attribute shared inside one AS that picks the exit for outbound traffic; highest wins, default 100.", hi: "Ek AS ke andar share hone wala attribute jo outbound traffic ka exit chunta hai; sabse zyada jeetta hai, default 100." } },
    { term: "MED", def: { en: "Multi-exit discriminator: a hint to one neighbouring AS about which entry point to use; lowest wins.", hi: "Multi-exit discriminator: ek neighbouring AS ko hint ki kaunsa entry point use kare; sabse kam jeetta hai." } },
    { term: "WEIGHT", def: { en: "A Cisco-only, per-router preference that is never advertised; highest wins.", hi: "Sirf Cisco ka, per-router preference jo kabhi advertise nahi hota; sabse zyada jeetta hai." } },
    { term: "AS-path prepending", def: { en: "Adding your own ASN extra times to outgoing Updates so other ASes see that path as longer.", hi: "Bahar jaate Updates mein apna ASN extra baar jodna taaki doosre ASes ko woh path lamba dikhe." } },
  ],
  commands: [
    { cmd: "router bgp 65001", mode: "Global config", does: { en: "Start the BGP process for your AS", hi: "Tumhare AS ke liye BGP process start karta hai" } },
    { cmd: "bgp router-id 203.0.113.1", mode: "Router config", does: { en: "Set the BGP router ID by hand", hi: "BGP router ID haath se set karta hai" } },
    { cmd: "neighbor 198.51.100.1 remote-as 64500", mode: "Router config", does: { en: "Define a BGP neighbour and its AS", hi: "BGP neighbour aur uska AS define karta hai" } },
    { cmd: "network 203.0.113.0 mask 255.255.255.0", mode: "Router config", does: { en: "Advertise a prefix that exactly matches a routing-table entry", hi: "Woh prefix advertise karta hai jo routing table entry se exactly match kare" } },
    { cmd: "ip route 203.0.113.0 255.255.255.0 Null0", mode: "Global config", does: { en: "Create a stable /24 for BGP to advertise", hi: "BGP ke advertise karne ke liye stable /24 banata hai" } },
    { cmd: "set local-preference 200", mode: "Route-map config", does: { en: "Prefer the matched routes as the exit from your AS", hi: "Match hue routes ko AS ke exit ke roop mein prefer karta hai" } },
    { cmd: "set as-path prepend 65001 65001 65001", mode: "Route-map config", does: { en: "Make your path look longer to the neighbour", hi: "Neighbour ko tumhara path lamba dikhata hai" } },
    { cmd: "neighbor 198.51.100.5 route-map TO-ISPB out", mode: "Router config", does: { en: "Apply a route-map to Updates sent to that neighbour", hi: "Us neighbour ko jaane wale Updates par route-map apply karta hai" } },
    { cmd: "clear ip bgp * soft", mode: "Privileged EXEC", does: { en: "Re-apply policy without resetting sessions", hi: "Sessions reset kiye bina policy dobara apply karta hai" } },
    { cmd: "show ip bgp summary", mode: "Privileged EXEC", does: { en: "List neighbours, their state and prefixes received", hi: "Neighbours, unki state aur mile prefixes dikhata hai" } },
    { cmd: "show ip bgp", mode: "Privileged EXEC", does: { en: "Show the BGP table with every path and its attributes", hi: "BGP table har path aur uske attributes ke saath dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Treating BGP's `network` command like OSPF's. It does not enable BGP on interfaces; it advertises a prefix only when that exact prefix and mask are already in the routing table.",
      hi: "BGP ke `network` command ko OSPF jaisa samajhna. Yeh interfaces par BGP enable nahi karta; prefix tabhi advertise hota hai jab wahi prefix aur mask routing table mein pehle se ho.",
    },
    {
      en: "Reading `Active` in `show ip bgp summary` as healthy. Active means TCP to the neighbour keeps failing; only a prefix count means Established.",
      hi: "`show ip bgp summary` mein `Active` ko healthy samajhna. Active ka matlab neighbour tak TCP baar-baar fail ho raha hai; sirf prefix count ka matlab Established hai.",
    },
    {
      en: "Using LOCAL_PREF to control how traffic enters your AS. LOCAL_PREF only picks your exit; to influence inbound traffic use AS-path prepending or MED.",
      hi: "LOCAL_PREF se yeh control karne ki koshish ki traffic tumhare AS mein kaise aaye. LOCAL_PREF sirf tumhara exit chunta hai; inbound traffic ke liye AS-path prepending ya MED use karo.",
    },
    {
      en: "Mixing up the direction of comparison. WEIGHT and LOCAL_PREF: highest wins. AS_PATH length and MED: lowest wins.",
      hi: "Comparison ki direction ulti kar dena. WEIGHT aur LOCAL_PREF: sabse zyada jeetta hai. AS_PATH length aur MED: sabse kam jeetta hai.",
    },
    {
      en: "Expecting WEIGHT on one edge router to steer the whole AS. WEIGHT never leaves the router; use LOCAL_PREF when several routers must agree.",
      hi: "Yeh expect karna ki ek edge router par WEIGHT poore AS ko steer karega. WEIGHT router se bahar nahi jaata; jab kai routers ko ek hi exit chunna ho, LOCAL_PREF use karo.",
    },
    {
      en: "Changing a route-map and expecting the routes to change at once. Run `clear ip bgp * soft` (or for one neighbour) so BGP re-applies the policy.",
      hi: "Route-map badal kar yeh expect karna ki routes turant badal jaayenge. `clear ip bgp * soft` (ya ek neighbour ke liye) chalao taaki BGP policy dobara apply kare.",
    },
  ],
  recap: [
    { en: "BGP is the path-vector EGP of the internet: policy over speed, TCP 179, incremental Updates.", hi: "BGP internet ka path-vector EGP hai: speed se zyada policy, TCP 179, sirf incremental Updates." },
    { en: "Private ASNs: 64512-65534 and 4200000000-4294967294. eBGP AD 20, iBGP AD 200.", hi: "Private ASNs: 64512-65534 aur 4200000000-4294967294. eBGP AD 20, iBGP AD 200." },
    { en: "States: Idle, Connect, Active, OpenSent, OpenConfirm, Established. Messages: Open, Update, Keepalive, Notification.", hi: "States ka order hai Idle, Connect, Active, OpenSent, OpenConfirm, Established. Messages chaar hain: Open, Update, Keepalive, Notification." },
    { en: "Best path, simplified: highest WEIGHT, highest LOCAL_PREF, locally originated, shortest AS_PATH, lowest origin, lowest MED, eBGP over iBGP.", hi: "Best path ka simplified order yeh hai: sabse zyada WEIGHT, sabse zyada LOCAL_PREF, locally originated, sabse chhota AS_PATH, sabse kam origin, sabse kam MED, phir eBGP ko iBGP par preference." },
    { en: "Outbound traffic: set LOCAL_PREF. Inbound traffic: prepend your AS (or MED to one neighbour AS).", hi: "Outbound traffic: LOCAL_PREF set karo. Inbound traffic: apna AS prepend karo (ya ek neighbour AS ke liye MED)." },
    { en: "A router drops any Update whose AS_PATH contains its own ASN; that is BGP's loop prevention.", hi: "Jis Update ke AS_PATH mein router ka apna ASN ho, router use drop kar deta hai; yahi BGP ka loop prevention hai." },
  ],
  quiz: [
    {
      q: {
        en: "Which ASN is from the private range, so it must never appear in an AS_PATH on the public internet?",
        hi: "Kaunsa ASN private range ka hai, yaani public internet par kisi AS_PATH mein kabhi nahi dikhna chahiye?",
      },
      options: [
        { en: "15169", hi: "15169" },
        { en: "64500", hi: "64500" },
        { en: "65010", hi: "65010" },
        { en: "65535", hi: "65535" },
      ],
      answer: 2,
      explain: {
        en: "The private 2-byte range is 64512-65534, so 65010 is private. 15169 is Google's public ASN, 64500 sits in the documentation range 64496-64511, and 65535 is reserved.",
        hi: "Private 2-byte range 64512-65534 hai, isliye 65010 private hai. 15169 Google ka public ASN hai, 64500 documentation range 64496-64511 mein aata hai, aur 65535 reserved hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "`show ip bgp summary` lists neighbour 198.51.100.5 with `Active` in the State/PfxRcd column. What does that tell you?",
        hi: "`show ip bgp summary` mein neighbour 198.51.100.5 ke State/PfxRcd column mein `Active` likha hai. Isse kya pata chalta hai?",
      },
      options: [
        { en: "The session is up and actively exchanging routes", hi: "Session up hai aur actively routes exchange ho rahe hain" },
        { en: "R1 keeps trying to open a TCP session to the neighbour and failing", hi: "R1 neighbour se TCP session kholne ki baar-baar koshish kar raha hai aur fail ho raha hai" },
        { en: "The neighbour is up but sent zero prefixes", hi: "Neighbour up hai lekin zero prefixes bheje" },
        { en: "The neighbour has been shut down in the configuration", hi: "Configuration mein neighbour shutdown kiya gaya hai" },
      ],
      answer: 1,
      explain: {
        en: "Active means the TCP connection to port 179 is not succeeding, so the router keeps retrying. An Established session shows a number there (0 if no prefixes were received), and an administratively shut neighbour shows `Idle (Admin)`.",
        hi: "Active ka matlab port 179 tak TCP connection ban nahi raha, isliye router retry karta rehta hai. Established session wahan number dikhata hai (koi prefix na mila ho toh 0), aur admin shutdown neighbour `Idle (Admin)` dikhata hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1 has two paths to 192.0.2.0/24, both with WEIGHT 0. Path A: LOCAL_PREF 100, AS_PATH `64500 64496`. Path B: LOCAL_PREF 150, AS_PATH `64510 64499 64496`. Which does R1 choose?",
        hi: "R1 ke paas 192.0.2.0/24 ke do paths hain, dono ka WEIGHT 0. Path A: LOCAL_PREF 100, AS_PATH `64500 64496`. Path B: LOCAL_PREF 150, AS_PATH `64510 64499 64496`. R1 kaunsa chunega?",
      },
      options: [
        { en: "Path B, because LOCAL_PREF is compared before AS_PATH length", hi: "Path B, kyunki LOCAL_PREF AS_PATH length se pehle compare hota hai" },
        { en: "Path A, because its AS_PATH is shorter", hi: "Path A, kyunki uska AS_PATH chhota hai" },
        { en: "Path A, because a lower LOCAL_PREF is preferred", hi: "Path A, kyunki kam LOCAL_PREF prefer hota hai" },
        { en: "Both, load-sharing equally by default", hi: "Dono, by default barabar load-sharing" },
      ],
      answer: 0,
      explain: {
        en: "Weights tie, so LOCAL_PREF decides, and the higher value (150) wins. AS_PATH length is only looked at when LOCAL_PREF ties. BGP installs a single best path unless you configure multipath.",
        hi: "Weight barabar hai, isliye LOCAL_PREF decide karta hai, aur zyada value (150) jeetti hai. AS_PATH length tabhi dekhi jaati hai jab LOCAL_PREF barabar ho. Multipath configure na karo toh BGP ek hi best path install karta hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "R1 in AS 65001 receives an Update for 203.0.113.0/24 with AS_PATH `64510 64496 64500 65001`. What does R1 do with it?",
        hi: "AS 65001 ke R1 ko 203.0.113.0/24 ka Update milta hai jiska AS_PATH `64510 64496 64500 65001` hai. R1 iske saath kya karega?",
      },
      options: [
        { en: "Installs it as a backup path with AS_PATH length 4", hi: "Ise AS_PATH length 4 wale backup path ki tarah install karega" },
        { en: "Discards it, because its own ASN is already in the path", hi: "Ise discard karega, kyunki uska apna ASN path mein pehle se hai" },
        { en: "Sends a Notification and resets the session to ISP-B", hi: "Notification bhej kar ISP-B wala session reset karega" },
        { en: "Accepts it and removes 65001 from the path", hi: "Ise accept karke path se 65001 hata dega" },
      ],
      answer: 1,
      explain: {
        en: "That is BGP loop prevention: an AS that sees its own number in the AS_PATH knows the route has already passed through it, so it drops the Update quietly. The session stays up; this is normal behaviour, not an error.",
        hi: "Yahi BGP ka loop prevention hai: jis AS ko AS_PATH mein apna number dikhe, use pata hai ki route usi se hokar guzar chuka hai, isliye woh Update chupchaap drop kar deta hai. Session up rehta hai; yeh normal behaviour hai, koi error nahi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "AS 65001 has two edge routers running iBGP to each other: R1 connects to ISP-A and R2 to ISP-B. Which single change makes both routers send internet-bound traffic out through ISP-A?",
        hi: "AS 65001 ke do edge routers aapas mein iBGP chalate hain: R1 ISP-A se juda hai aur R2 ISP-B se. Kaunsa ek change dono routers ka internet wala traffic ISP-A se bahar bhejega?",
      },
      options: [
        { en: "Set WEIGHT 200 on R1 for routes learned from ISP-A", hi: "R1 par ISP-A se seekhe routes ka WEIGHT 200 set karna" },
        { en: "Prepend 65001 twice on Updates sent to ISP-B", hi: "ISP-B ko bheje Updates mein 65001 do baar prepend karna" },
        { en: "Send a lower MED to ISP-A", hi: "ISP-A ko kam MED bhejna" },
        { en: "Set LOCAL_PREF 200 on R1 for routes learned from ISP-A", hi: "R1 par ISP-A se seekhe routes ka LOCAL_PREF 200 set karna" },
      ],
      answer: 3,
      explain: {
        en: "LOCAL_PREF travels over iBGP, so R2 also sees the ISP-A paths at 200 against its own 100 and sends traffic to R1. WEIGHT never leaves R1, so R2 would still use ISP-B. Prepending and MED change how traffic enters your AS, not how it leaves.",
        hi: "LOCAL_PREF iBGP par travel karta hai, isliye R2 ko bhi ISP-A wale paths 200 par dikhte hain aur apne 100 wale path ke against woh traffic R1 ko bhejta hai. WEIGHT R1 se bahar nahi jaata, toh R2 ISP-B hi use karta rahega. Prepending aur MED yeh badalte hain ki traffic AS mein kaise aaye, bahar kaise jaaye yeh nahi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "R1 has `network 203.0.113.0 mask 255.255.255.0` under BGP, but neither ISP receives the prefix. The routing table shows only connected 203.0.113.0/25 and 203.0.113.128/25. What is the cleanest fix?",
        hi: "R1 par BGP ke neeche `network 203.0.113.0 mask 255.255.255.0` hai, lekin dono ISPs ko prefix nahi milta. Routing table mein sirf connected 203.0.113.0/25 aur 203.0.113.128/25 hain. Sabse saaf fix kya hai?",
      },
      options: [
        { en: "Rewrite the network command with a wildcard mask, 0.0.0.255", hi: "Network command ko wildcard mask 0.0.0.255 ke saath likhna" },
        { en: "Change both `remote-as` values to 65001", hi: "Dono `remote-as` values ko 65001 karna" },
        { en: "Add `ip route 203.0.113.0 255.255.255.0 Null0`", hi: "`ip route 203.0.113.0 255.255.255.0 Null0` add karna" },
        { en: "Add `redistribute connected` under BGP", hi: "BGP ke neeche `redistribute connected` add karna" },
      ],
      answer: 2,
      explain: {
        en: "BGP's network command needs an exact prefix and mask in the routing table. The Null0 static route creates the /24 so it is advertised, and it never goes down. BGP does not use wildcard masks, `remote-as 65001` would turn the sessions into iBGP and break them, and redistributing connected would leak the /25s and the link subnets instead of the /24.",
        hi: "BGP ke network command ko routing table mein exact prefix aur mask chahiye. Null0 static route /24 bana deta hai, toh woh advertise hota hai, aur yeh kabhi down nahi hota. BGP wildcard masks use nahi karta, `remote-as 65001` sessions ko iBGP bana kar tod dega, aur connected redistribute karne se /24 ki jagah /25s aur link subnets leak ho jaayenge.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "e6H7DHuonz8",
      title: "BGP - Complete ENCOR (350-401) Exam Coverage",
      channel: "Kevin Wallace Training, LLC",
      lang: "en",
      note: { en: "A clear walk through ASNs, eBGP and iBGP, neighbour states, attributes and best-path selection.", hi: "ASNs, eBGP aur iBGP, neighbour states, attributes aur best-path selection ka saaf walkthrough." },
    },
    {
      id: "QXoxx0df-QU",
      title: "FREE CCNA Lab 067: BGP",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "A short Packet Tracer lab: configure eBGP neighbours and network statements, then verify.", hi: "Chhota Packet Tracer lab: eBGP neighbours aur network statements configure karo, phir verify karo." },
    },
    {
      id: "sbLgq3Bmuus",
      title: "164. CCNA 200-301 Full Course in Hindi 2024 | BGP - Border Gateway Protocol",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of autonomous systems, eBGP vs iBGP and how BGP sessions work.", hi: "Autonomous systems, eBGP vs iBGP aur BGP sessions kaise kaam karte hain, Hindi mein." },
    },
    {
      id: "VJF83K7UUJo",
      title: "BGP Attributes in Hindi | Border Gateway Protocol in Hindi",
      channel: "JagvinderThind",
      lang: "hi",
      note: { en: "Path attributes and the best-path order, in Hindi.", hi: "Path attributes aur best-path order, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Dual-home a company to two ISPs", hi: "Ek company ko do ISPs se dual-home karo" },
    steps: [
      {
        en: "Build R1 (AS 65001), ISP-A (AS 64500), ISP-B (AS 64510) and a Remote router (AS 64496) as in the animation. Use 198.51.100.0/30 for R1 to ISP-A, 198.51.100.4/30 for R1 to ISP-B, two more /30s such as 198.51.100.8/30 and 198.51.100.12/30 from each ISP to Remote, and a loopback 192.0.2.1/24 on Remote.",
        hi: "Animation jaisa R1 (AS 65001), ISP-A (AS 64500), ISP-B (AS 64510) aur ek Remote router (AS 64496) banao. R1 se ISP-A ke liye 198.51.100.0/30, R1 se ISP-B ke liye 198.51.100.4/30, har ISP se Remote tak do aur /30 jaise 198.51.100.8/30 aur 198.51.100.12/30, aur Remote par loopback 192.0.2.1/24 use karo.",
      },
      {
        en: "Configure eBGP on every link and advertise 203.0.113.0/24 from R1 with a Null0 static route. Packet Tracer handles this basic eBGP part.",
        hi: "Har link par eBGP configure karo aur R1 se Null0 static route ke saath 203.0.113.0/24 advertise karo. Yeh basic eBGP wala hissa Packet Tracer mein ho jaata hai.",
      },
      {
        en: "Run `show ip bgp summary` and `show ip bgp` on R1 and on Remote. Find both paths to each prefix and the `>` best path.",
        hi: "R1 aur Remote par `show ip bgp summary` aur `show ip bgp` chalao. Har prefix ke dono paths aur `>` wala best path dhoondho.",
      },
      {
        en: "Packet Tracer's route-map support under BGP is limited, so for the policy steps use Cisco CML, GNS3 or EVE-NG. Apply LOCAL_PREF 200 in from ISP-A and check `show ip bgp` on R1.",
        hi: "Packet Tracer mein BGP ke saath route-map support limited hai, isliye policy wale steps Cisco CML, GNS3 ya EVE-NG mein karo. ISP-A se aate routes par LOCAL_PREF 200 lagao aur R1 par `show ip bgp` check karo.",
      },
      {
        en: "Prepend 65001 three times towards ISP-B, run `clear ip bgp * soft`, and watch Remote's best path to 203.0.113.0/24 move to ISP-A.",
        hi: "ISP-B ki taraf 65001 teen baar prepend karo, `clear ip bgp * soft` chalao, aur dekho Remote ka 203.0.113.0/24 wala best path ISP-A par shift hota hai.",
      },
      {
        en: "Shut R1's link to ISP-A and confirm that both directions fail over to ISP-B.",
        hi: "R1 ka ISP-A wala link shut karo aur confirm karo ki dono directions ISP-B par fail over ho jaati hain.",
      },
    ],
  },
};

export default lesson;
