import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "static-routing",
  intro: {
    en: "A router learns its connected networks by itself, and nothing else. To reach any other network it needs a route, either typed in by you or learned from a routing protocol. A static route is the typed kind: \"to reach this network, hand the packet to that neighbour\". Small sites, internet default routes and backup paths commonly use static routes, and the two routes that carried the ping in the previous lesson were static.",
    hi: "Router apne connected networks khud seekh leta hai, aur kuch nahi. Kisi bhi doosre network tak pahunchne ke liye use route chahiye, ya toh tum type karo ya routing protocol se seekha jaaye. Static route type kiya hua route hai: \"is network tak jaana hai toh packet us neighbour ko do\". Chhote sites, internet ke default routes aur backup paths aksar static routes par hi chalte hain, aur pichhle lesson mein ping ko le jaane wale dono routes bhi static hi the.",
  },
  outcomes: [
    { en: "Configure an IPv4 static route with a next hop, an exit interface, or both, and predict how each looks in `show ip route`", hi: "Next hop, exit interface, ya dono ke saath IPv4 static route configure kar sako, aur predict kar sako ki har ek `show ip route` mein kaisa dikhega" },
    { en: "Choose and configure network, host and default routes", hi: "Network, host aur default routes chun sako aur configure kar sako" },
    { en: "Build a floating static route and predict exactly when it takes over and when it does not", hi: "Floating static route bana sako aur exactly predict kar sako ki woh kab takeover karega aur kab nahi" },
    { en: "Configure IPv6 static and default routes, including one with a link-local next hop", hi: "IPv6 static aur default routes configure kar sako, link-local next hop wala route bhi" },
    { en: "Verify static routes with `show ip route static`, ping and traceroute, in both directions", hi: "`show ip route static`, ping aur traceroute se static routes verify kar sako, dono directions mein" },
  ],
  sections: [
    {
      id: "why-static",
      heading: { en: "Why routers need static routes", hi: "Routers ko static routes kyun chahiye" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 3.1 you saw that a router adds a C and an L route for every interface that is up/up with an address, and that is all it knows. R1 below has three connected networks. SRV1 at 192.168.2.10 sits behind R2, so R1 has no route to it and drops PC1's packets. Someone has to tell R1 where 192.168.2.0/24 is.",
            hi: "Lesson 3.1 mein dekha tha ki router har up/up interface (jispar address ho) ke liye ek C aur ek L route add karta hai, aur bas itna hi jaanta hai. Neeche R1 ke teen connected networks hain. SRV1 (192.168.2.10) R2 ke peeche hai, isliye R1 ke paas uska koi route nahi hai aur woh PC1 ke packets drop kar deta hai. Kisi ko R1 ko batana padega ki 192.168.2.0/24 kahan hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The network used in this lesson and its animation", hi: "Is lesson aur animation ka network" },
          columns: ["Device", "Interface", "IPv4 address", "Connects to"],
          rows: [
            ["R1", "Gi0/0", "192.168.1.1/24", { en: "LAN with PC1 (192.168.1.10)", hi: "PC1 (192.168.1.10) wala LAN" }],
            ["R1", "Gi0/1", "10.0.12.1/30", { en: "R2 Gi0/1, 10.0.12.2 (primary path)", hi: "R2 Gi0/1, 10.0.12.2 (primary path)" }],
            ["R1", "Gi0/2", "10.0.13.1/30", { en: "R3 Gi0/1, 10.0.13.2 (backup path)", hi: "R3 Gi0/1, 10.0.13.2 (backup path)" }],
            ["R2", "Gi0/2", "10.0.23.1/30", { en: "R3 Gi0/2, 10.0.23.2", hi: "R3 Gi0/2, 10.0.23.2" }],
            ["R2", "Gi0/0", "192.168.2.1/24", { en: "LAN with SRV1 (192.168.2.10)", hi: "SRV1 (192.168.2.10) wala LAN" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "You have two ways to fill the gap: type static routes, or run a routing protocol such as OSPF (lessons 3.5 to 3.7) so routers tell each other. Real networks use both. Static routes are the right tool when the answer rarely changes:",
            hi: "Yeh gap bharne ke do tareeke hain: static routes type karo, ya OSPF jaisa routing protocol chalao (lessons 3.5 se 3.7) taaki routers ek doosre ko khud batayein. Asli networks dono use karte hain. Static routes tab sahi tool hain jab jawab kabhi-kabhi hi badalta hai:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Stub networks.** A branch with one link to HQ has only one way out, so one default route covers every destination.",
              hi: "**Stub networks.** Jis branch ka HQ tak ek hi link hai, uske paas bahar jaane ka ek hi raasta hai, toh ek default route har destination cover kar leta hai.",
            },
            {
              en: "**The internet edge.** An enterprise edge router sends everything it does not know to the ISP with a default route.",
              hi: "**Internet edge.** Enterprise ka edge router jo kuch nahi jaanta, woh sab default route se ISP ko bhej deta hai.",
            },
            {
              en: "**Backup paths.** A floating static route waits unused until the main route fails.",
              hi: "**Backup paths.** Floating static route tab tak bina use hue wait karta hai jab tak main route fail na ho.",
            },
            {
              en: "**One-off exceptions.** A host route can send traffic for a single server along a different path.",
              hi: "**One-off exceptions.** Host route ek single server ka traffic alag path se bhej sakta hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Static routes compared with a routing protocol", hi: "Static routes vs routing protocol" },
          columns: [
            { en: "Question", hi: "Sawaal" },
            { en: "Static route", hi: "Static route" },
            { en: "Routing protocol (OSPF)", hi: "Routing protocol (OSPF)" },
          ],
          rows: [
            [
              { en: "Who builds the route?", hi: "Route kaun banata hai?" },
              { en: "You, on every router that needs it", hi: "Tum, har us router par jise zaroorat hai" },
              { en: "The routers, by exchanging messages", hi: "Routers khud, messages exchange karke" },
            ],
            [
              { en: "Reacts to a failure?", hi: "Failure par react karta hai?" },
              { en: "Only to a failure the router can see locally (an interface going down)", hi: "Sirf us failure par jo router ko locally dikhe (interface down hona)" },
              { en: "Yes, anywhere in the network", hi: "Haan, network mein kahin bhi" },
            ],
            [
              { en: "Cost to the router", hi: "Router par load" },
              { en: "None: no CPU, memory or bandwidth for updates", hi: "Kuch nahi: updates ke liye na CPU, na memory, na bandwidth" },
              { en: "Some CPU, memory and bandwidth", hi: "Thoda CPU, memory aur bandwidth" },
            ],
            [
              { en: "Default AD", hi: "Default AD" },
              "1",
              "110",
            ],
          ],
        },
      ],
    },
    {
      id: "ip-route-command",
      heading: { en: "The ip route command: three ways to say where to go", hi: "ip route command: kahan bhejna hai, kehne ke teen tareeke" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In global configuration mode the syntax is `ip route <network> <mask> <next-hop | exit-interface | exit-interface next-hop> [distance]`. The network and mask describe the destination, exactly as they appear in a routing table. The rest tells R1 where to send matching packets.",
            hi: "Global configuration mode mein syntax hai `ip route <network> <mask> <next-hop | exit-interface | exit-interface next-hop> [distance]`. Network aur mask destination batate hain, bilkul waise jaise routing table mein dikhte hain. Baaki hissa R1 ko batata hai ki match hone wale packets kahan bhejne hain.",
          },
        },
        {
          type: "cli",
          title: { en: "The same route written three ways (configure only one of them)", hi: "Ek hi route teen tareeke se likha (inmein se sirf ek configure karo)" },
          lines: [
            { prompt: "R1(config)#", cmd: "ip route 192.168.2.0 255.255.255.0 10.0.12.2", comment: { en: "Next hop only: the usual choice", hi: "Sirf next hop: normal choice" } },
            { prompt: "R1(config)#", cmd: "ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1", comment: { en: "Exit interface only", hi: "Sirf exit interface" } },
            { prompt: "R1(config)#", cmd: "ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1 10.0.12.2", comment: { en: "Both: a fully specified route", hi: "Dono: fully specified route" } },
          ],
        },
        {
          type: "table",
          caption: { en: "How each form appears in show ip route", hi: "Har form show ip route mein kaise dikhta hai" },
          columns: [
            { en: "Form", hi: "Form" },
            { en: "show ip route line", hi: "show ip route line" },
            { en: "What R1 does with a packet", hi: "R1 packet ke saath kya karta hai" },
          ],
          rows: [
            [
              { en: "Next hop", hi: "Next hop" },
              "S 192.168.2.0/24 [1/0] via 10.0.12.2",
              { en: "Looks up 10.0.12.2 again to find the exit interface, then ARPs for 10.0.12.2", hi: "Exit interface jaanne ke liye 10.0.12.2 ka dobara lookup, phir 10.0.12.2 ke liye ARP" },
            ],
            [
              { en: "Exit interface", hi: "Exit interface" },
              "S 192.168.2.0/24 is directly connected, GigabitEthernet0/1",
              { en: "Treats the whole network as if it were on Gi0/1 and ARPs for each destination address. The AD is still 1, even though the line says directly connected", hi: "Poore network ko aise treat karta hai jaise woh Gi0/1 par ho, aur har destination address ke liye ARP karta hai. Line mein directly connected likha hai, phir bhi AD 1 hi hai" },
            ],
            [
              { en: "Fully specified", hi: "Fully specified" },
              "S 192.168.2.0/24 [1/0] via 10.0.12.2, GigabitEthernet0/1",
              { en: "Sends out of Gi0/1 and ARPs for 10.0.12.2, with no second lookup", hi: "Gi0/1 se bhejta hai aur 10.0.12.2 ke liye ARP karta hai, doosre lookup ke bina" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "A next-hop-only route needs a **recursive lookup**. The route says \"via 10.0.12.2\" but not which interface, so R1 looks up 10.0.12.2 in its own table and finds C 10.0.12.0/30 on Gi0/1. This is also how IOS decides whether to install the route at all: if no route covers the next hop, the static route stays in the configuration but does not enter the routing table. You will use this rule for floating static routes below.",
            hi: "Sirf next hop wale route ko **recursive lookup** chahiye. Route kehta hai \"via 10.0.12.2\" lekin interface nahi batata, isliye R1 apni hi table mein 10.0.12.2 dhoondhta hai aur Gi0/1 wala C 10.0.12.0/30 paata hai. IOS isi se decide karta hai ki route install karna hai ya nahi: agar next hop tak koi route nahi hai, toh static route configuration mein rehta hai lekin routing table mein nahi aata. Yahi rule neeche floating static routes mein kaam aayega.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Avoid exit-interface-only routes on Ethernet", hi: "Ethernet par sirf exit interface wale routes se bacho" },
          text: {
            en: "With `ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1`, R1 believes every 192.168.2.x host is on the Gi0/1 link, so it ARPs for 192.168.2.10 itself. It only works because R2 answers with proxy ARP (on by default in IOS), and R1 builds an ARP entry for every destination it talks to. On Ethernet, give a next hop or both. An exit interface alone is fine on a point-to-point serial link, where there is only one possible neighbour.",
            hi: "`ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1` ke saath R1 maanta hai ki har 192.168.2.x host Gi0/1 link par hai, isliye woh seedha 192.168.2.10 ke liye ARP karta hai. Yeh sirf isliye chalta hai kyunki R2 proxy ARP se jawab deta hai (IOS mein default on), aur R1 har destination ke liye alag ARP entry banata hai. Ethernet par next hop do, ya dono do. Point-to-point serial link par sirf exit interface theek hai, kyunki wahan ek hi neighbour ho sakta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "The network and mask must agree", hi: "Network aur mask match hone chahiye" },
          text: {
            en: "Type the network address, not a host in it. `ip route 192.168.2.1 255.255.255.0 10.0.12.2` is rejected with `%Inconsistent address and mask`, because 192.168.2.1 has host bits set for a /24.",
            hi: "Network address type karo, uske andar ka koi host nahi. `ip route 192.168.2.1 255.255.255.0 10.0.12.2` `%Inconsistent address and mask` ke saath reject hota hai, kyunki /24 ke hisaab se 192.168.2.1 mein host bits set hain.",
          },
        },
      ],
    },
    {
      id: "route-types",
      heading: { en: "Network, host and default routes", hi: "Network, host aur default routes" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every static route uses the same command. What changes is how much of the address space the network and mask cover, and longest match (lesson 3.2) decides which one a packet uses.",
            hi: "Har static route ek hi command use karta hai. Badalta sirf yeh hai ki network aur mask address space ka kitna hissa cover karte hain, aur packet kaunsa route use karega yeh longest match (lesson 3.2) decide karta hai.",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Type", hi: "Type" },
            { en: "Example on R1", hi: "R1 par example" },
            { en: "Matches", hi: "Kisse match karta hai" },
          ],
          rows: [
            [{ en: "Network route", hi: "Network route" }, "ip route 192.168.2.0 255.255.255.0 10.0.12.2", { en: "Every address in 192.168.2.0/24", hi: "192.168.2.0/24 ka har address" }],
            [{ en: "Host route (/32)", hi: "Host route (/32)" }, "ip route 192.168.2.10 255.255.255.255 10.0.13.2", { en: "Only 192.168.2.10", hi: "Sirf 192.168.2.10" }],
            [{ en: "Default route (/0)", hi: "Default route (/0)" }, "ip route 0.0.0.0 0.0.0.0 10.0.12.2", { en: "Any address, but only when no longer prefix matches", hi: "Koi bhi address, lekin sirf tab jab koi lamba prefix match na kare" }],
          ],
        },
        {
          type: "cli",
          title: { en: "R1 with all three routes at once", hi: "Teeno routes ek saath R1 par" },
          lines: [
            { prompt: "R1#", cmd: "show ip route static" },
            { comment: { en: "Code legend omitted", hi: "Code legend hata diya" } },
            { out: "Gateway of last resort is 10.0.12.2 to network 0.0.0.0", comment: { en: "Set by the default route", hi: "Default route ki wajah se set hua" } },
            { out: "S*    0.0.0.0/0 [1/0] via 10.0.12.2", comment: { en: "* = candidate default route", hi: "* = candidate default route" } },
            { out: "      192.168.2.0/24 is variably subnetted, 2 subnets, 2 masks" },
            { out: "S        192.168.2.0/24 [1/0] via 10.0.12.2" },
            { out: "S        192.168.2.10/32 [1/0] via 10.0.13.2", comment: { en: "The host route: /32 is the longest possible match", hi: "Host route: /32 sabse lamba possible match hai" } },
          ],
          note: {
            en: "A packet to 192.168.2.10 matches all three routes and takes the /32 via R3. A packet to 192.168.2.20 matches the /24 and the /0, and takes the /24 via R2. A packet to 203.0.113.5 matches only the default route.",
            hi: "192.168.2.10 ka packet teeno routes se match karta hai aur /32 lekar R3 ki taraf jaata hai. 192.168.2.20 ka packet /24 aur /0 se match karta hai aur /24 lekar R2 ki taraf jaata hai. 203.0.113.5 ka packet sirf default route se match karta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "`0.0.0.0 0.0.0.0` means \"zero bits must match\", so the default route matches everything and is always the last choice. For a stub branch like R1 with a single uplink, one default route can replace every network route. The `Gateway of last resort` line at the top of `show ip route` confirms that a default route is installed.",
            hi: "`0.0.0.0 0.0.0.0` ka matlab hai \"zero bits match hone chahiye\", isliye default route sab kuch match karta hai aur hamesha aakhri choice hota hai. R1 jaisi stub branch par, jiska ek hi uplink hai, ek default route saare network routes ki jagah le sakta hai. `show ip route` ke upar wali `Gateway of last resort` line confirm karti hai ki default route install hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "A router's default route is `ip route 0.0.0.0 0.0.0.0 <next-hop>`, shown as `S*`. Do not confuse it with `ip default-gateway`, which is for a Layer 2 switch or any device that is not routing; a router with IP routing enabled ignores it.",
            hi: "Router ka default route hai `ip route 0.0.0.0 0.0.0.0 <next-hop>`, jo table mein `S*` dikhta hai. Ise `ip default-gateway` se confuse mat karo, woh Layer 2 switch ya aise device ke liye hai jo routing nahi kar raha; IP routing enabled router use ignore karta hai.",
          },
        },
      ],
    },
    {
      id: "floating-static",
      heading: { en: "Floating static routes: a backup that waits", hi: "Floating static routes: backup jo wait karta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "R1 has a second path to 192.168.2.0/24 through R3. If you add a second static route to the same prefix with the default AD of 1, both routes enter the table and R1 load-balances across them. To make the second path a backup instead, give it a **higher administrative distance**. AD is the last number on the command.",
            hi: "R1 ke paas R3 ke through 192.168.2.0/24 tak doosra path hai. Agar same prefix ka doosra static route default AD 1 ke saath add karo, toh dono routes table mein aa jaate hain aur R1 dono par load-balance karta hai. Doosre path ko backup banana hai toh use **zyada administrative distance** do. AD command ka aakhri number hota hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Primary and floating static routes on R1", hi: "R1 par primary aur floating static routes" },
          lines: [
            { prompt: "R1(config)#", cmd: "ip route 192.168.2.0 255.255.255.0 10.0.12.2", comment: { en: "Primary, AD 1", hi: "Primary, AD 1" } },
            { prompt: "R1(config)#", cmd: "ip route 192.168.2.0 255.255.255.0 10.0.13.2 200", comment: { en: "Backup, AD 200", hi: "Backup, AD 200" } },
            { prompt: "R1(config)#", cmd: "end" },
            { prompt: "R1#", cmd: "show ip route static" },
            { out: "S        192.168.2.0/24 [1/0] via 10.0.12.2", comment: { en: "Only the primary is in the table", hi: "Table mein sirf primary hai" } },
            { prompt: "R1#", cmd: "show running-config | include ip route" },
            { out: "ip route 192.168.2.0 255.255.255.0 10.0.12.2" },
            { out: "ip route 192.168.2.0 255.255.255.0 10.0.13.2 200", comment: { en: "The backup lives here until it is needed", hi: "Backup zaroorat padne tak yahin rehta hai" } },
          ],
        },
        {
          type: "steps",
          items: [
            {
              en: "Both routes are for exactly the same prefix, so R1 compares AD. 1 beats 200, and only the primary is installed.",
              hi: "Dono routes bilkul same prefix ke hain, isliye R1 AD compare karta hai. 1, 200 ko harata hai, aur sirf primary install hota hai.",
            },
            {
              en: "The R1–R2 cable is cut. Gi0/1 goes down and its C and L routes leave the table.",
              hi: "R1–R2 ka cable kat jaata hai. Gi0/1 down hota hai aur uske C aur L routes table se nikal jaate hain.",
            },
            {
              en: "The next hop 10.0.12.2 now matches no route, so the recursive lookup fails and IOS removes the primary static route.",
              hi: "Ab next hop 10.0.12.2 kisi route se match nahi karta, isliye recursive lookup fail hota hai aur IOS primary static route hata deta hai.",
            },
            {
              en: "The AD 200 route is now the best route to 192.168.2.0/24, so it **floats** into the table and traffic goes via R3.",
              hi: "Ab AD 200 wala route 192.168.2.0/24 ka sabse achha route hai, isliye woh table mein **float** karke aa jaata hai aur traffic R3 se jaata hai.",
            },
            {
              en: "When Gi0/1 comes back up, the AD 1 route returns and pushes the backup out of the table again. No one has to type anything.",
              hi: "Gi0/1 wapas up hote hi AD 1 wala route laut aata hai aur backup ko phir table se bahar kar deta hai. Kisi ko kuch type nahi karna padta.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "R1 while the primary link is down", hi: "Jab primary link down hai, tab R1" },
          lines: [
            { out: "%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down" },
            { prompt: "R1#", cmd: "show ip route" },
            { comment: { en: "Code legend omitted", hi: "Code legend hata diya" } },
            { out: "Gateway of last resort is not set" },
            { out: "      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks" },
            { out: "C        10.0.13.0/30 is directly connected, GigabitEthernet0/2", comment: { en: "10.0.12.0/30 is gone", hi: "10.0.12.0/30 gayab hai" } },
            { out: "L        10.0.13.1/32 is directly connected, GigabitEthernet0/2" },
            { out: "      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks" },
            { out: "C        192.168.1.0/24 is directly connected, GigabitEthernet0/0" },
            { out: "L        192.168.1.1/32 is directly connected, GigabitEthernet0/0" },
            { out: "S     192.168.2.0/24 [200/0] via 10.0.13.2", comment: { en: "The floating route, AD 200", hi: "Floating route, AD 200" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "It only reacts to failures R1 can see", hi: "Yeh sirf un failures par react karta hai jo R1 ko dikhte hain" },
          text: {
            en: "The primary route is withdrawn only when its next hop becomes unreachable in R1's own table, which in practice means R1's interface went down. If R1 and R2 were connected through a provider's switch and R2 failed, R1's Gi0/1 would stay up/up, the primary route would stay, and traffic would be lost. Tracking the path with IP SLA fixes this but is beyond the CCNA; a routing protocol also detects it.",
            hi: "Primary route tabhi hatta hai jab uska next hop R1 ki apni table mein unreachable ho jaaye, aur practically iska matlab hai R1 ka interface down hua. Agar R1 aur R2 provider ke switch ke through jude hote aur R2 fail hota, toh R1 ka Gi0/1 up/up hi rehta, primary route bana rehta, aur traffic lost hota. IP SLA se path track karna iska fix hai lekin woh CCNA se bahar hai; routing protocol bhi ise detect kar leta hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Backing up a dynamic route", hi: "Dynamic route ka backup" },
          text: {
            en: "A floating static route can also back up a route learned by OSPF. Its AD must be higher than OSPF's 110, for example 130 or 200. With the default AD of 1 the static route would replace the OSPF route instead of backing it up.",
            hi: "Floating static route OSPF se seekhe route ka backup bhi ban sakta hai. Uska AD OSPF ke 110 se zyada hona chahiye, jaise 130 ya 200. Default AD 1 ke saath static route OSPF route ka backup nahi banega, balki uski jagah le lega.",
          },
        },
      ],
    },
    {
      id: "ipv6-static",
      heading: { en: "IPv6 static routes", hi: "IPv6 static routes" },
      blocks: [
        {
          type: "p",
          text: {
            en: "IPv6 static routes follow the same logic with the `ipv6 route` command, and the prefix is written with its length instead of a mask. Remember from lesson 1.8 that IOS forwards IPv6 only after `ipv6 unicast-routing`. Here the R1 LAN is 2001:db8:1::/64, the R2 LAN is 2001:db8:2::/64, the R1–R2 link is 2001:db8:12::/64 (R1 is ::1, R2 is ::2) and the R1–R3 link is 2001:db8:13::/64 (R1 is ::1, R3 is ::2). As with IPv4 you can give a next hop, an exit interface or both, and on Ethernet you should always include the next hop.",
            hi: "IPv6 static routes same logic par `ipv6 route` command se chalte hain, aur prefix mask ki jagah length ke saath likha jaata hai. Lesson 1.8 se yaad rakho ki IOS IPv6 tabhi forward karta hai jab `ipv6 unicast-routing` on ho. Yahan R1 LAN 2001:db8:1::/64 hai, R2 LAN 2001:db8:2::/64, R1–R2 link 2001:db8:12::/64 (R1 ::1, R2 ::2) aur R1–R3 link 2001:db8:13::/64 (R1 ::1, R3 ::2). IPv4 ki tarah yahan bhi next hop, exit interface ya dono de sakte ho, aur Ethernet par next hop hamesha do.",
          },
        },
        {
          type: "cli",
          title: { en: "IPv6 static routes on R1", hi: "R1 par IPv6 static routes" },
          lines: [
            { prompt: "R1(config)#", cmd: "ipv6 unicast-routing" },
            { prompt: "R1(config)#", cmd: "ipv6 route 2001:db8:2::/64 2001:db8:12::2", comment: { en: "Network route, global unicast next hop", hi: "Network route, global unicast next hop" } },
            { prompt: "R1(config)#", cmd: "ipv6 route 2001:db8:2::/64 2001:db8:13::2 200", comment: { en: "Floating backup via R3", hi: "R3 ke through floating backup" } },
            { prompt: "R1(config)#", cmd: "ipv6 route ::/0 2001:db8:12::2", comment: { en: "Default route", hi: "Default route" } },
            { prompt: "R1(config)#", cmd: "ipv6 route 2001:db8:2::10/128 GigabitEthernet0/1 FE80::2", comment: { en: "Host route with a link-local next hop: interface required", hi: "Link-local next hop wala host route: interface zaroori" } },
          ],
        },
        {
          type: "p",
          text: {
            en: "Why does a link-local next hop need the exit interface? Every IPv6 interface has a link-local address, and the same FE80 address can exist on every link of the router. `FE80::2` alone does not say which link to use, so IOS requires the interface and rejects the route without it. R2's Gi0/1 was given that address with `ipv6 address fe80::2 link-local`, so it is easy to type.",
            hi: "Link-local next hop ke saath exit interface kyun chahiye? Har IPv6 interface ka link-local address hota hai, aur same FE80 address router ke har link par ho sakta hai. Sirf `FE80::2` se pata nahi chalta ki kaunsa link use karna hai, isliye IOS interface maangta hai aur uske bina route reject kar deta hai. R2 ke Gi0/1 ko `ipv6 address fe80::2 link-local` se yeh address diya gaya hai, taaki type karna aasaan ho.",
          },
        },
        {
          type: "cli",
          title: { en: "Verifying IPv6 static routes", hi: "IPv6 static routes verify karna" },
          lines: [
            { prompt: "R1#", cmd: "show ipv6 route static" },
            { comment: { en: "Header and code legend omitted", hi: "Header aur code legend hata diya" } },
            { out: "S   ::/0 [1/0]" },
            { out: "     via 2001:DB8:12::2" },
            { out: "S   2001:DB8:2::/64 [1/0]", comment: { en: "The AD 200 backup is not shown while this is up", hi: "Jab tak yeh up hai, AD 200 wala backup nahi dikhta" } },
            { out: "     via 2001:DB8:12::2" },
            { out: "S   2001:DB8:2::10/128 [1/0]" },
            { out: "     via FE80::2, GigabitEthernet0/1", comment: { en: "Link-local next hop with its interface", hi: "Link-local next hop apne interface ke saath" } },
          ],
          note: {
            en: "IPv6 output prints the next hop on its own line under the prefix. IOS also shows addresses in capitals, whatever case you typed.",
            hi: "IPv6 output mein next hop prefix ke neeche alag line par print hota hai. IOS addresses capital letters mein dikhata hai, chahe tumne kisi bhi case mein type kiya ho.",
          },
        },
      ],
    },
    {
      id: "verify",
      heading: { en: "Verify and troubleshoot", hi: "Verify aur troubleshoot" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A static route in the table proves only that R1 knows a way out. Test real traffic from a real host, and remember from the previous lesson that the reply is routed on its own: R2 needs a route back to 192.168.1.0/24, and on the backup path R3 needs routes to both LANs.",
            hi: "Table mein static route hona sirf itna proof hai ki R1 ko bahar jaane ka raasta pata hai. Asli host se asli traffic test karo, aur pichhle lesson se yaad rakho ki reply alag se route hota hai: R2 ko 192.168.1.0/24 ka wapas ka route chahiye, aur backup path par R3 ko dono LANs ke routes chahiye.",
          },
        },
        {
          type: "cli",
          title: { en: "Tracing the path from PC1, before and during the failure", hi: "PC1 se path trace karna, failure se pehle aur failure ke time par" },
          lines: [
            { prompt: "C:\\>", cmd: "tracert -d 192.168.2.10" },
            { out: "  1    <1 ms    <1 ms    <1 ms  192.168.1.1" },
            { out: "  2     1 ms     1 ms     1 ms  10.0.12.2", comment: { en: "Primary path: straight to R2", hi: "Primary path: seedha R2" } },
            { out: "  3     1 ms     1 ms     1 ms  192.168.2.10" },
            { comment: { en: "R1 Gi0/1 goes down", hi: "R1 ka Gi0/1 down hota hai" } },
            { prompt: "C:\\>", cmd: "tracert -d 192.168.2.10" },
            { out: "  1    <1 ms    <1 ms    <1 ms  192.168.1.1" },
            { out: "  2     1 ms     1 ms     1 ms  10.0.13.2", comment: { en: "Backup path: R3 first", hi: "Backup path: pehle R3" } },
            { out: "  3     1 ms     1 ms     1 ms  10.0.23.1" },
            { out: "  4     1 ms     1 ms     1 ms  192.168.2.10" },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Pings from the router use the exit interface address", hi: "Router se ping exit interface ka address use karta hai" },
          text: {
            en: "A plain `ping 192.168.2.10` on R1 is sourced from the exit interface, 10.0.12.1 or 10.0.13.1, not from the LAN. On the backup path R2 has no route to 10.0.13.0/30, so that test fails even though PC1's traffic works. Use `ping 192.168.2.10 source 192.168.1.1` (or test from PC1) so the test matches real traffic.",
            hi: "R1 par simple `ping 192.168.2.10` exit interface se source hota hai, 10.0.12.1 ya 10.0.13.1, LAN se nahi. Backup path par R2 ke paas 10.0.13.0/30 ka route nahi hai, isliye yeh test fail hoga jabki PC1 ka traffic chal raha hai. `ping 192.168.2.10 source 192.168.1.1` use karo (ya PC1 se test karo) taaki test asli traffic jaisa ho.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Route missing from `show ip route`?** Check `show running-config | include ip route` for typos, then check that the next hop is inside a connected network that is up/up.",
              hi: "**Route `show ip route` mein nahi hai?** `show running-config | include ip route` mein typo dekho, phir check karo ki next hop kisi up/up connected network ke andar hai.",
            },
            {
              en: "**Route present but ping fails?** Check the next hop is the neighbour's address (10.0.12.2), not your own (10.0.12.1), and that the mask matches the destination network.",
              hi: "**Route hai lekin ping fail?** Check karo ki next hop neighbour ka address (10.0.12.2) hai, apna (10.0.12.1) nahi, aur mask destination network se match karta hai.",
            },
            {
              en: "**Request arrives, reply does not?** Look at the routers on the way back, starting with the one nearest the destination.",
              hi: "**Request pahunchti hai, reply nahi?** Wapas ke raaste ke routers dekho, destination ke sabse paas wale router se shuru karo.",
            },
            {
              en: "**Backup never takes over?** Compare the floating route's AD with the primary's, and ask whether the failure actually takes R1's interface down.",
              hi: "**Backup kabhi takeover nahi karta?** Floating route ka AD primary ke AD se compare karo, aur socho ki failure se R1 ka interface sach mein down hota hai ya nahi.",
            },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Static route", def: { en: "A route typed by an administrator with `ip route` or `ipv6 route`; code S, default AD 1.", hi: "Administrator ka `ip route` ya `ipv6 route` se type kiya route; code S, default AD 1." } },
    { term: "Next hop", def: { en: "The address of the neighbouring router that matching packets are handed to.", hi: "Neighbour router ka address, jise match hone wale packets diye jaate hain." } },
    { term: "Recursive lookup", def: { en: "A second routing table lookup on a route's next-hop address to find the exit interface.", hi: "Route ke next-hop address par doosra routing table lookup, exit interface dhoondhne ke liye." } },
    { term: "Fully specified static route", def: { en: "A static route that names both the exit interface and the next hop, so no recursive lookup is needed.", hi: "Aisa static route jismein exit interface aur next hop dono diye hon, isliye recursive lookup ki zaroorat nahi padti." } },
    { term: "Host route", def: { en: "A route to a single address: /32 in IPv4, /128 in IPv6.", hi: "Ek single address ka route: IPv4 mein /32, IPv6 mein /128." } },
    { term: "Default route", def: { en: "The route 0.0.0.0/0 (IPv6 ::/0) that matches every destination and is used only when nothing longer matches.", hi: "Route 0.0.0.0/0 (IPv6 mein ::/0) jo har destination se match karta hai aur sirf tab use hota hai jab koi lamba route match na kare." } },
    { term: "Floating static route", def: { en: "A backup static route given a higher AD than the primary, so it enters the table only when the primary disappears.", hi: "Backup static route jise primary se zyada AD diya jaata hai, taaki woh sirf primary ke gayab hone par table mein aaye." } },
    { term: "Stub network", def: { en: "A network with only one way out, where a single default route is enough.", hi: "Aisa network jiska bahar jaane ka ek hi raasta ho, jahan ek default route kaafi hai." } },
  ],
  commands: [
    { cmd: "ip route 192.168.2.0 255.255.255.0 10.0.12.2", mode: "Global configuration", does: { en: "Static network route via a next hop", hi: "Next hop ke through static network route" } },
    { cmd: "ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1 10.0.12.2", mode: "Global configuration", does: { en: "Fully specified static route (exit interface and next hop)", hi: "Fully specified static route (exit interface aur next hop)" } },
    { cmd: "ip route 192.168.2.10 255.255.255.255 10.0.13.2", mode: "Global configuration", does: { en: "Host route to a single address", hi: "Ek single address ka host route" } },
    { cmd: "ip route 0.0.0.0 0.0.0.0 10.0.12.2", mode: "Global configuration", does: { en: "IPv4 default route", hi: "IPv4 default route" } },
    { cmd: "ip route 192.168.2.0 255.255.255.0 10.0.13.2 200", mode: "Global configuration", does: { en: "Floating static route with AD 200", hi: "AD 200 wala floating static route" } },
    { cmd: "ipv6 unicast-routing", mode: "Global configuration", does: { en: "Turn on IPv6 forwarding (off by default)", hi: "IPv6 forwarding on karta hai (default mein off)" } },
    { cmd: "ipv6 route 2001:db8:2::/64 2001:db8:12::2", mode: "Global configuration", does: { en: "IPv6 static route via a global unicast next hop", hi: "Global unicast next hop ke through IPv6 static route" } },
    { cmd: "ipv6 route ::/0 2001:db8:12::2", mode: "Global configuration", does: { en: "IPv6 default route", hi: "IPv6 default route" } },
    { cmd: "ipv6 route 2001:db8:2::10/128 GigabitEthernet0/1 FE80::2", mode: "Global configuration", does: { en: "IPv6 route with a link-local next hop (interface required)", hi: "Link-local next hop wala IPv6 route (interface zaroori)" } },
    { cmd: "show ip route static", mode: "Privileged EXEC", does: { en: "Show only the installed static routes", hi: "Sirf installed static routes dikhata hai" } },
    { cmd: "show ipv6 route static", mode: "Privileged EXEC", does: { en: "Show only the installed IPv6 static routes", hi: "Sirf installed IPv6 static routes dikhata hai" } },
    { cmd: "show running-config | include ip route", mode: "Privileged EXEC", does: { en: "List every configured static route, including floating ones not in the table", hi: "Har configured static route list karta hai, table se bahar wale floating routes bhi" } },
    { cmd: "ping 192.168.2.10 source 192.168.1.1", mode: "Privileged EXEC", does: { en: "Ping from the router using its LAN address as the source", hi: "Router se ping, LAN address ko source bana kar" } },
    { cmd: "tracert -d 192.168.2.10", mode: "Windows command prompt", does: { en: "Show the routers on the path, to confirm which path is in use", hi: "Path ke routers dikhata hai, taaki confirm ho kaunsa path use ho raha hai" } },
  ],
  mistakes: [
    {
      en: "Using `ip default-gateway` on a router to create a default route. That command is for switches and other devices that are not routing; a router needs `ip route 0.0.0.0 0.0.0.0 <next-hop>`.",
      hi: "Router par default route banane ke liye `ip default-gateway` use karna. Woh command switches aur aise devices ke liye hai jo routing nahi karte; router ko `ip route 0.0.0.0 0.0.0.0 <next-hop>` chahiye.",
    },
    {
      en: "Putting your own interface address as the next hop (`via 10.0.12.1` on R1). The next hop is always the neighbour's address on the shared link, here 10.0.12.2.",
      hi: "Apne hi interface ka address next hop bana dena (R1 par `via 10.0.12.1`). Next hop hamesha shared link par neighbour ka address hota hai, yahan 10.0.12.2.",
    },
    {
      en: "Configuring routes in one direction only. R1's route gets the request to SRV1, but without R2's route back to 192.168.1.0/24 the reply is dropped.",
      hi: "Routes sirf ek direction mein configure karna. R1 ka route request ko SRV1 tak pahuncha deta hai, lekin R2 ka 192.168.1.0/24 wala wapas ka route na ho toh reply drop ho jaata hai.",
    },
    {
      en: "Giving the backup route the same AD as the primary. Two static routes with AD 1 to the same prefix are both installed and load-balanced; a floating route needs a higher AD.",
      hi: "Backup route ko primary jitna hi AD dena. Same prefix ke do AD 1 wale static routes dono install hote hain aur load-balance hote hain; floating route ko zyada AD chahiye.",
    },
    {
      en: "Expecting a floating static route to cover every failure. It takes over only when the primary's next hop becomes unreachable, usually because the local interface went down.",
      hi: "Yeh expect karna ki floating static route har failure cover karega. Woh sirf tab takeover karta hai jab primary ka next hop unreachable ho, aam taur par isliye kyunki local interface down hua.",
    },
    {
      en: "Using a link-local IPv6 next hop without the exit interface. `ipv6 route ::/0 FE80::2` is rejected; write `ipv6 route ::/0 GigabitEthernet0/1 FE80::2`.",
      hi: "Exit interface ke bina link-local IPv6 next hop use karna. `ipv6 route ::/0 FE80::2` reject hota hai; `ipv6 route ::/0 GigabitEthernet0/1 FE80::2` likho.",
    },
  ],
  recap: [
    { en: "`ip route <network> <mask> <next-hop>` adds a static route with code S and AD 1; the next hop is the neighbour's address.", hi: "`ip route <network> <mask> <next-hop>` code S aur AD 1 wala static route add karta hai; next hop neighbour ka address hai." },
    { en: "Next-hop routes need a recursive lookup and are installed only while the next hop is reachable. Fully specified routes name the interface too. Avoid exit-interface-only routes on Ethernet.", hi: "Next-hop routes ko recursive lookup chahiye aur woh tabhi install rehte hain jab next hop reachable ho. Fully specified routes interface bhi batate hain. Ethernet par sirf exit interface wale routes se bacho." },
    { en: "Host route = /32 (/128 in IPv6). Default route = `ip route 0.0.0.0 0.0.0.0 <next-hop>` or `ipv6 route ::/0 <next-hop>`, shown as `S*` with a gateway of last resort.", hi: "Host route = /32 (IPv6 mein /128). Default route = `ip route 0.0.0.0 0.0.0.0 <next-hop>` ya `ipv6 route ::/0 <next-hop>`, jo `S*` aur gateway of last resort ke saath dikhta hai." },
    { en: "Floating static = same prefix, higher AD (for example 200). It stays in the config and enters the table only when the primary is withdrawn.", hi: "Floating static = same prefix, zyada AD (jaise 200). Yeh config mein rehta hai aur table mein tabhi aata hai jab primary hat jaaye." },
    { en: "IPv6 needs `ipv6 unicast-routing`, and a link-local next hop needs the exit interface.", hi: "IPv6 ko `ipv6 unicast-routing` chahiye, aur link-local next hop ko exit interface chahiye." },
    { en: "Every path needs routes in both directions; test from a host or with `ping ... source`.", hi: "Har path ko dono directions mein routes chahiye; host se ya `ping ... source` se test karo." },
  ],
  quiz: [
    {
      q: {
        en: "R1's only uplink is to R2 at 10.0.12.2. Which command gives R1 a default route?",
        hi: "R1 ka ek hi uplink R2 (10.0.12.2) ki taraf hai. Kaunsa command R1 ko default route dega?",
      },
      options: [
        { en: "ip default-gateway 10.0.12.2", hi: "ip default-gateway 10.0.12.2" },
        { en: "ip route 0.0.0.0 255.255.255.255 10.0.12.2", hi: "ip route 0.0.0.0 255.255.255.255 10.0.12.2" },
        { en: "ip route 0.0.0.0 0.0.0.0 10.0.12.2", hi: "ip route 0.0.0.0 0.0.0.0 10.0.12.2" },
        { en: "ip route 10.0.12.2 0.0.0.0 0.0.0.0", hi: "ip route 10.0.12.2 0.0.0.0 0.0.0.0" },
      ],
      answer: 2,
      explain: {
        en: "The default route is network 0.0.0.0 with mask 0.0.0.0, meaning no bits have to match. `ip default-gateway` is for devices that are not routing, a 255.255.255.255 mask would make a host route to 0.0.0.0, and the last option puts the next hop where the network belongs.",
        hi: "Default route ka network 0.0.0.0 aur mask 0.0.0.0 hota hai, yaani koi bhi bit match hona zaroori nahi. `ip default-gateway` un devices ke liye hai jo routing nahi karte, 255.255.255.255 mask se 0.0.0.0 ka host route banega, aur aakhri option mein next hop network ki jagah likha hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1 has `S* 0.0.0.0/0 via 10.0.12.2`, `S 192.168.2.0/24 via 10.0.12.2` and `S 192.168.2.10/32 via 10.0.13.2`. Where does R1 send packets for 192.168.2.10 and for 192.168.2.20?",
        hi: "R1 par `S* 0.0.0.0/0 via 10.0.12.2`, `S 192.168.2.0/24 via 10.0.12.2` aur `S 192.168.2.10/32 via 10.0.13.2` hain. R1 192.168.2.10 aur 192.168.2.20 ke packets kahan bhejega?",
      },
      options: [
        { en: "Both to 10.0.12.2", hi: "Dono 10.0.12.2 ko" },
        { en: "192.168.2.10 to 10.0.13.2; 192.168.2.20 to 10.0.12.2", hi: "192.168.2.10, 10.0.13.2 ko; 192.168.2.20, 10.0.12.2 ko" },
        { en: "Both to 10.0.13.2", hi: "Dono 10.0.13.2 ko" },
        { en: "192.168.2.10 to 10.0.12.2; 192.168.2.20 is dropped", hi: "192.168.2.10, 10.0.12.2 ko; 192.168.2.20 drop" },
      ],
      answer: 1,
      explain: {
        en: "Longest match decides. 192.168.2.10 matches the /32, the longest possible prefix, so it goes to 10.0.13.2. 192.168.2.20 does not match the /32; its longest match is the /24 via 10.0.12.2. The default route is only used when nothing longer matches.",
        hi: "Longest match decide karta hai. 192.168.2.10 /32 se match karta hai, jo sabse lamba possible prefix hai, isliye 10.0.13.2 ko jaata hai. 192.168.2.20 /32 se match nahi karta; uska longest match /24 via 10.0.12.2 hai. Default route sirf tab use hota hai jab koi lamba route match na kare.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "R1 learns 10.5.0.0/16 through OSPF. You want a static route to 10.5.0.0/16 via a backup link that is used only if the OSPF route disappears. Which AD should the static route have?",
        hi: "R1, OSPF se 10.5.0.0/16 seekhta hai. Tumhe backup link ke through 10.5.0.0/16 ka aisa static route chahiye jo sirf OSPF route gayab hone par use ho. Static route ka AD kya hona chahiye?",
      },
      options: [
        { en: "1", hi: "1" },
        { en: "20", hi: "20" },
        { en: "90", hi: "90" },
        { en: "130", hi: "130" },
      ],
      answer: 3,
      explain: {
        en: "The backup must lose to OSPF while OSPF's route exists, so its AD must be higher than 110. Only 130 is. With 1, 20 or 90 the static route would win and replace the OSPF route instead of waiting behind it.",
        hi: "Jab tak OSPF ka route hai, backup ko us se haarna chahiye, isliye uska AD 110 se zyada hona chahiye. Sirf 130 aisa hai. 1, 20 ya 90 ke saath static route jeet jaata aur OSPF route ka intezaar karne ki jagah uski jagah le leta.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "`show ip route` on R1 shows `S 192.168.2.0/24 is directly connected, GigabitEthernet0/1`. Which command created this route?",
        hi: "R1 ke `show ip route` mein `S 192.168.2.0/24 is directly connected, GigabitEthernet0/1` dikhta hai. Yeh route kis command se bana?",
      },
      options: [
        { en: "ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1", hi: "ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1" },
        { en: "ip route 192.168.2.0 255.255.255.0 10.0.12.2", hi: "ip route 192.168.2.0 255.255.255.0 10.0.12.2" },
        { en: "ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1 10.0.12.2", hi: "ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1 10.0.12.2" },
        { en: "ip address 192.168.2.1 255.255.255.0 on Gi0/1", hi: "Gi0/1 par ip address 192.168.2.1 255.255.255.0" },
      ],
      answer: 0,
      explain: {
        en: "A static route with only an exit interface is shown as \"directly connected\" with code S. A next-hop route shows `[1/0] via 10.0.12.2`, a fully specified one shows `via 10.0.12.2, GigabitEthernet0/1`, and an interface address would create a C route, not an S route.",
        hi: "Sirf exit interface wala static route code S ke saath \"directly connected\" dikhta hai. Next-hop route `[1/0] via 10.0.12.2` dikhata hai, fully specified route `via 10.0.12.2, GigabitEthernet0/1`, aur interface address se C route banta, S route nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1 must reach 2001:db8:2::/64 through R2, whose Gi0/1 link-local address is FE80::2. R1's Gi0/1 faces R2. Which command works?",
        hi: "R1 ko R2 ke through 2001:db8:2::/64 tak pahunchna hai, aur R2 ke Gi0/1 ka link-local address FE80::2 hai. R1 ka Gi0/1 R2 ki taraf hai. Kaunsa command kaam karega?",
      },
      options: [
        { en: "ipv6 route 2001:db8:2::/64 FE80::2", hi: "ipv6 route 2001:db8:2::/64 FE80::2" },
        { en: "ipv6 route 2001:db8:2::/64 GigabitEthernet0/1 FE80::2", hi: "ipv6 route 2001:db8:2::/64 GigabitEthernet0/1 FE80::2" },
        { en: "ip route 2001:db8:2::/64 GigabitEthernet0/1 FE80::2", hi: "ip route 2001:db8:2::/64 GigabitEthernet0/1 FE80::2" },
        { en: "ipv6 route FE80::2/64 GigabitEthernet0/1", hi: "ipv6 route FE80::2/64 GigabitEthernet0/1" },
      ],
      answer: 1,
      explain: {
        en: "A link-local address is only unique on its own link, so IOS needs the exit interface to know which link FE80::2 is on. The first option is rejected for that reason, `ip route` is the IPv4 command, and the last option makes FE80::2 the destination instead of the next hop.",
        hi: "Link-local address sirf apne link par unique hota hai, isliye IOS ko exit interface chahiye taaki pata chale FE80::2 kis link par hai. Pehla option isi wajah se reject hota hai, `ip route` IPv4 ka command hai, aur aakhri option FE80::2 ko next hop ki jagah destination bana deta hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1 has a primary route to 192.168.2.0/24 via 10.0.12.2 and a floating route via 10.0.13.2 with AD 200. R1 and R2 are connected through a provider switch. R2 loses power, but R1's Gi0/1 stays up/up. What happens?",
        hi: "R1 par 192.168.2.0/24 ka primary route via 10.0.12.2 hai aur AD 200 ke saath floating route via 10.0.13.2. R1 aur R2 ek provider switch ke through jude hain. R2 ki power chali jaati hai, lekin R1 ka Gi0/1 up/up rehta hai. Kya hoga?",
      },
      options: [
        { en: "R1 notices R2 has stopped replying and installs the floating route", hi: "R1 notice karta hai ki R2 reply nahi kar raha aur floating route install kar deta hai" },
        { en: "R1 load-balances across both routes", hi: "R1 dono routes par load-balance karta hai" },
        { en: "R1 keeps the primary route and traffic to 192.168.2.0/24 is lost", hi: "R1 primary route rakhta hai aur 192.168.2.0/24 ka traffic lost hota hai" },
        { en: "R1 removes both routes from its table", hi: "R1 dono routes table se hata deta hai" },
      ],
      answer: 2,
      explain: {
        en: "A static route has no way to check its neighbour. 10.0.12.2 is still inside the up/up connected network on Gi0/1, so the primary stays installed and the floating route stays out. Traffic is sent to a dead next hop. Routing protocols or IP SLA tracking (beyond the CCNA) are needed to detect this kind of failure.",
        hi: "Static route ke paas neighbour check karne ka koi tareeka nahi hai. 10.0.12.2 ab bhi Gi0/1 ke up/up connected network ke andar hai, isliye primary install rehta hai aur floating route bahar hi rehta hai. Traffic ek dead next hop ko bheja jaata hai. Aise failure ko detect karne ke liye routing protocol ya IP SLA tracking (CCNA se bahar) chahiye.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "YCv4-_sMvYE",
      title: "Free CCNA | Static Routing | Day 11 (part 2)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Static and default routes on Cisco routers, with the routing table output explained.", hi: "Cisco routers par static aur default routes, routing table output ke explanation ke saath." },
    },
    {
      id: "XHxOtIav2k8",
      title: "Free CCNA | Configuring Static Routes | Day 11 Lab 1",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "A short Packet Tracer lab: configure static routes and test end to end.", hi: "Chhota Packet Tracer lab: static routes configure karo aur end to end test karo." },
    },
    {
      id: "IPMJQfYXgR0",
      title: "52. Free CCNA (NEW) | What is Static Routing in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of static routing and its configuration.", hi: "Static routing aur uski configuration ka Hindi explanation." },
    },
    {
      id: "BQhsJDPSUzY",
      title: "108. Free CCNA (NEW) | IPv6 in Hindi - Static & Default Routing",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "IPv6 static and default routes in Hindi; watch after the IPv6 section.", hi: "IPv6 static aur default routes Hindi mein; IPv6 section ke baad dekho." },
    },
  ],
  lab: {
    title: { en: "Primary and floating static routes in Packet Tracer", hi: "Packet Tracer mein primary aur floating static routes" },
    steps: [
      {
        en: "Build the triangle from this lesson: three 2911 routers, PC1 on R1 Gi0/0 and SRV1 on R2 Gi0/0, with the addresses from the table. Run `no shutdown` on every interface and check that `show ip route` on R1 lists only C and L routes.",
        hi: "Is lesson ka triangle banao: teen 2911 routers, R1 ke Gi0/0 par PC1 aur R2 ke Gi0/0 par SRV1, table wale addresses ke saath. Har interface par `no shutdown` karo aur check karo ki R1 ke `show ip route` mein sirf C aur L routes hain.",
      },
      {
        en: "On R1 add `ip route 192.168.2.0 255.255.255.0 10.0.12.2` and `ip route 192.168.2.0 255.255.255.0 10.0.13.2 200`. On R2 add `ip route 192.168.1.0 255.255.255.0 10.0.12.1` and `ip route 192.168.1.0 255.255.255.0 10.0.23.2 200`.",
        hi: "R1 par `ip route 192.168.2.0 255.255.255.0 10.0.12.2` aur `ip route 192.168.2.0 255.255.255.0 10.0.13.2 200` add karo. R2 par `ip route 192.168.1.0 255.255.255.0 10.0.12.1` aur `ip route 192.168.1.0 255.255.255.0 10.0.23.2 200` add karo.",
      },
      {
        en: "On R3 add `ip route 192.168.1.0 255.255.255.0 10.0.13.1` and `ip route 192.168.2.0 255.255.255.0 10.0.23.1`. Ping SRV1 from PC1 and run `tracert -d 192.168.2.10`: hop 2 should be 10.0.12.2.",
        hi: "R3 par `ip route 192.168.1.0 255.255.255.0 10.0.13.1` aur `ip route 192.168.2.0 255.255.255.0 10.0.23.1` add karo. PC1 se SRV1 ko ping karo aur `tracert -d 192.168.2.10` chalao: hop 2 10.0.12.2 hona chahiye.",
      },
      {
        en: "Compare `show ip route static` with `show running-config | include ip route` on R1. Which configured route is missing from the table, and why?",
        hi: "R1 par `show ip route static` ko `show running-config | include ip route` se compare karo. Kaunsa configured route table mein nahi hai, aur kyun?",
      },
      {
        en: "Run `shutdown` on R1 Gi0/1. Check `show ip route static` again for `[200/0] via 10.0.13.2`, then repeat the tracert from PC1 and find R3 in the path. Run `no shutdown` and watch the primary return.",
        hi: "R1 ke Gi0/1 par `shutdown` karo. `show ip route static` mein `[200/0] via 10.0.13.2` dhoondho, phir PC1 se tracert dobara chalao aur path mein R3 dhoondho. `no shutdown` karo aur primary ko wapas aate dekho.",
      },
      {
        en: "Extra: enable `ipv6 unicast-routing`, add the IPv6 addresses from the IPv6 section, and configure `ipv6 route 2001:db8:2::/64 GigabitEthernet0/1 FE80::2` on R1. Try it without the interface first and read the error.",
        hi: "Extra: `ipv6 unicast-routing` enable karo, IPv6 section wale addresses lagao, aur R1 par `ipv6 route 2001:db8:2::/64 GigabitEthernet0/1 FE80::2` configure karo. Pehle interface ke bina try karo aur error padho.",
      },
    ],
  },
};

export default lesson;
