import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "routing-basics",
  intro: {
    en: "A switch moves frames inside one network. To reach any other network, a packet has to pass through a router, and the router decides where it goes from one source of truth: its routing table. If the destination is not in that table, the packet is dropped. Reading the table is the first skill every later routing topic builds on, and CCNA exam topic 3.1 tests each of its fields.",
    hi: "Switch ek network ke andar frames move karta hai. Kisi doosre network tak pahunchne ke liye packet ko router se guzarna padta hai, aur router sirf ek cheez dekh kar decide karta hai ki packet kahan jaayega: apni routing table. Destination table mein nahi hai, toh packet drop. Aage ka har routing topic isi table ko padhne par tika hai, aur CCNA exam topic 3.1 iska har field test karta hai.",
  },
  outcomes: [
    { en: "Describe the steps a router takes for every packet it receives", hi: "Bata sako ki router har aane wale packet ke saath kaunse steps leta hai" },
    { en: "Explain when connected (C) and local (L) routes appear, and why they disappear", hi: "Samjha sako ki connected (C) aur local (L) routes kab aate hain, aur kyun gayab ho jaate hain" },
    {
      en: "Read every field of a `show ip route` entry: code, prefix, mask, AD, metric, next hop, age and outgoing interface",
      hi: "`show ip route` entry ka har field padh sako: code, prefix, mask, AD, metric, next hop, age aur outgoing interface",
    },
    { en: "Explain what the gateway of last resort line tells you", hi: "Samjha sako ki gateway of last resort wali line kya batati hai" },
    { en: "Predict what happens to a packet that matches no route", hi: "Predict kar sako ki jis packet ka koi route match nahi karta, uska kya hota hai" },
  ],
  sections: [
    {
      id: "what-a-router-does",
      heading: { en: "What a router does with a packet", hi: "Router packet ke saath kya karta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A router has an interface in each network it joins. In the animation, R1 has Gi0/0 in `192.168.1.0/24`, Gi0/1 in `192.168.2.0/24`, and Gi0/2 on the link to R2, `10.0.12.0/30`. Hosts send packets for other networks to their default gateway (lesson 1.2), which here is R1. R1 then runs the same short process for every packet.",
            hi: "Router jis bhi network se juda hota hai, us network mein uska ek interface hota hai. Animation mein R1 ka Gi0/0 `192.168.1.0/24` mein hai, Gi0/1 `192.168.2.0/24` mein, aur Gi0/2 R2 wale link `10.0.12.0/30` par. Hosts doosre network ke packets apne default gateway (lesson 1.2) ko bhejte hain, jo yahan R1 hai. Phir R1 har packet ke saath yahi chhota sa process chalata hai.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "The frame arrives addressed to R1's MAC. R1 checks the FCS, removes the Ethernet header and trailer, and reads the **destination IP address**.",
              hi: "Frame R1 ke MAC par address hokar aata hai. R1 FCS check karta hai, Ethernet header aur trailer hata deta hai, aur **destination IP address** padhta hai.",
            },
            {
              en: "R1 looks the destination up in its **routing table**: a list of known networks (prefixes), each with directions. If several entries match, the most specific one wins; lesson 3.2 covers that rule in detail.",
              hi: "R1 destination ko apni **routing table** mein dhoondhta hai: known networks (prefixes) ki list, har ek ke saath direction. Agar kai entries match karein, toh sabse specific wali jeetti hai; yeh rule lesson 3.2 mein detail mein hai.",
            },
            {
              en: "If the match is a **local** route, the packet is for R1 itself, such as a ping to R1 or an SSH session. R1 processes it instead of forwarding it.",
              hi: "Match agar **local** route hai, toh packet khud R1 ke liye hai, jaise R1 ko ping ya SSH session. R1 use forward nahi karta, khud process karta hai.",
            },
            {
              en: "If the match is a **connected** route, the destination sits on a network R1 is attached to. R1 sends the packet out of that interface straight to the host, using ARP to find the host's MAC.",
              hi: "Match agar **connected** route hai, toh destination aise network par hai jisse R1 juda hua hai. R1 packet ko us interface se seedha host ko bhejta hai, aur host ka MAC ARP se nikalta hai.",
            },
            {
              en: "If the match is a route to a **remote** network, R1 sends the packet to the **next-hop** router named in the route, out of the listed interface, using ARP for the next hop's MAC.",
              hi: "Match agar kisi **remote** network ka route hai, toh R1 packet ko route mein likhe **next-hop** router ko, bataye gaye interface se bhejta hai, aur next hop ka MAC ARP se leta hai.",
            },
            {
              en: "If nothing matches, R1 **drops** the packet and normally sends an ICMP Destination Unreachable message back to the source.",
              hi: "Kuch bhi match nahi hua, toh R1 packet **drop** kar deta hai aur aam taur par source ko ICMP Destination Unreachable message wapas bhejta hai.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "Before forwarding, R1 also lowers the packet's TTL by 1 and builds a new Ethernet frame for the next link. Lesson 3.3 follows those rewrites hop by hop.",
            hi: "Forward karne se pehle R1 packet ka TTL 1 se kam karta hai aur agle link ke liye naya Ethernet frame banata hai. Yeh rewrites hop by hop lesson 3.3 mein dekhoge.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Signboards at a junction", hi: "Chauraahe ke signboard" },
          text: {
            en: "A routing table works like the signboard at a road junction: \"Pune: left. Nashik: straight.\" It does not show the whole journey, only the next road to take. Every junction has its own board. If your town is on no board and there is no \"all other places\" arrow, you cannot go on. That arrow is the default route.",
            hi: "Routing table chauraahe ke signboard jaisi hai: \"Pune: left. Nashik: seedha.\" Isme poora safar nahi likha hota, sirf agli sadak. Har chauraahe ka apna board hota hai. Agar tumhara shehar kisi board par nahi hai aur \"baaki sab jagah\" wala arrow bhi nahi hai, toh aage nahi ja sakte. Wahi arrow default route hai.",
          },
        },
      ],
    },
    {
      id: "where-routes-come-from",
      heading: { en: "Where routes come from", hi: "Routes aate kahan se hain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A router knows only the networks in its table. It cannot discover a remote network by itself. Routes get into the table in three ways:",
            hi: "Router sirf wahi networks jaanta hai jo uski table mein hain. Remote network woh khud se discover nahi kar sakta. Table mein routes teen tarike se aate hain:",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Source", hi: "Source" },
            { en: "Code in show ip route", hi: "show ip route mein code" },
            { en: "How it gets there", hi: "Table mein kaise aata hai" },
            { en: "Covered in", hi: "Kahan padhoge" },
          ],
          rows: [
            [
              { en: "Connected and local", hi: "Connected aur local" },
              "C, L",
              { en: "Automatically, when an interface has an IP address and is up/up", hi: "Apne aap, jab interface par IP address ho aur woh up/up ho" },
              { en: "This lesson", hi: "Yahi lesson" },
            ],
            [
              { en: "Static", hi: "Static" },
              "S (S* for a default)",
              { en: "You type it with `ip route`", hi: "Tum `ip route` se khud likhte ho" },
              { en: "Lesson 3.4", hi: "Lesson 3.4" },
            ],
            [
              { en: "Dynamic", hi: "Dynamic" },
              "O (OSPF), D (EIGRP), R (RIP), B (BGP)",
              { en: "Learned from neighbour routers through a routing protocol", hi: "Routing protocol ke through neighbour routers se seekha jaata hai" },
              { en: "Lessons 3.5 to 3.7", hi: "Lessons 3.5 se 3.7" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "R1 in the animation has only connected and local routes. It knows the three networks it touches and nothing else. That is why the ping to `172.16.3.10` fails even though R2 is connected to `172.16.3.0/24`: R2 knows that network, R1 does not.",
            hi: "Animation wale R1 ke paas sirf connected aur local routes hain. Woh sirf un teen networks ko jaanta hai jinse juda hai, aur kuch nahi. Isiliye `172.16.3.10` ka ping fail hota hai, jabki R2 `172.16.3.0/24` se connected hai: R2 us network ko jaanta hai, R1 nahi.",
          },
        },
      ],
    },
    {
      id: "connected-and-local",
      heading: { en: "Connected and local routes", hi: "Connected aur local routes" },
      blocks: [
        {
          type: "p",
          text: {
            en: "When an interface has an IP address and reaches **up/up** (Status up, Protocol up), IOS adds two routes at once:",
            hi: "Jab interface par IP address ho aur woh **up/up** (Status up, Protocol up) ho jaaye, IOS ek saath do routes add karta hai:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**C (connected)**: the whole subnet the interface is in, such as `192.168.1.0/24`. It tells R1 that every address in that subnet is reachable directly out of Gi0/0.",
              hi: "**C (connected)**: woh poora subnet jisme interface hai, jaise `192.168.1.0/24`. Yeh R1 ko batata hai ki us subnet ka har address Gi0/0 se seedha reachable hai.",
            },
            {
              en: "**L (local)**: the interface's own address as a `/32`, such as `192.168.1.1/32`. It tells R1 that packets to exactly that address are for R1 itself. Local routes are shown from IOS 15 onward; older IOS versions showed only the C route.",
              hi: "**L (local)**: interface ka apna address `/32` ke roop mein, jaise `192.168.1.1/32`. Yeh R1 ko batata hai ki exactly is address wale packets khud R1 ke liye hain. Local routes IOS 15 se dikhte hain; purane IOS versions mein sirf C route dikhta tha.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "Bring up Gi0/0 (the other two interfaces are done the same way)", hi: "Gi0/0 up karo (baaki do interfaces bhi aise hi)" },
          lines: [
            { prompt: "R1(config)#", cmd: "interface gigabitethernet0/0" },
            { prompt: "R1(config-if)#", cmd: "ip address 192.168.1.1 255.255.255.0" },
            { prompt: "R1(config-if)#", cmd: "no shutdown" },
            { out: "%LINK-3-UPDOWN: Interface GigabitEthernet0/0, changed state to up" },
            {
              out: "%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0, changed state to up",
              comment: { en: "Up/up: the C and L routes are added now", hi: "Up/up: C aur L routes abhi add hote hain" },
            },
          ],
        },
        {
          type: "cli",
          title: { en: "R1's table with all three interfaces up", hi: "Teeno interfaces up hone ke baad R1 ki table" },
          lines: [
            { prompt: "R1#", cmd: "show ip route" },
            { out: "Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP" },
            { out: "       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area" },
            { comment: { en: "Rest of the code legend omitted", hi: "Code legend ka baaki hissa hata diya" } },
            { out: "Gateway of last resort is not set", comment: { en: "No default route", hi: "Koi default route nahi" } },
            { out: "      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks" },
            { out: "C        10.0.12.0/30 is directly connected, GigabitEthernet0/2" },
            { out: "L        10.0.12.1/32 is directly connected, GigabitEthernet0/2" },
            { out: "      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks" },
            { out: "C        192.168.1.0/24 is directly connected, GigabitEthernet0/0" },
            { out: "L        192.168.1.1/32 is directly connected, GigabitEthernet0/0" },
            { out: "      192.168.2.0/24 is variably subnetted, 2 subnets, 2 masks" },
            { out: "C        192.168.2.0/24 is directly connected, GigabitEthernet0/1" },
            { out: "L        192.168.2.1/32 is directly connected, GigabitEthernet0/1" },
          ],
          note: {
            en: "Connected and local routes print no [AD/metric]. Their administrative distance is 0, the most trusted value there is.",
            hi: "Connected aur local routes ke saath [AD/metric] print nahi hota. Inka administrative distance 0 hai, jo sabse zyada trusted value hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "No up/up, no route", hi: "Up/up nahi, toh route nahi" },
          text: {
            en: "A connected route exists only while its interface is up/up with an IP address. Shut the interface, unplug the cable, or remove the address, and both the C and L routes vanish. When a network is missing from `show ip route`, check `show ip interface brief` first.",
            hi: "Connected route tabhi tak hai jab tak interface up/up hai aur uspar IP address hai. Interface shut karo, cable nikaalo, ya address hatao, toh C aur L dono routes gayab. `show ip route` mein koi network missing ho, toh sabse pehle `show ip interface brief` check karo.",
          },
        },
      ],
    },
    {
      id: "reading-show-ip-route",
      heading: { en: "Reading show ip route, field by field", hi: "show ip route ko field by field padhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Here is R1 later in the course, after it has learned `172.16.3.0/24` through OSPF (lesson 3.6) and been given a default static route to R2 (lesson 3.4). You do not need to know how those were configured yet. The goal is to read every part of the output.",
            hi: "Yeh course mein aage wala R1 hai, jab usne OSPF (lesson 3.6) se `172.16.3.0/24` seekh liya hai aur use R2 ki taraf ek default static route (lesson 3.4) de diya gaya hai. Yeh kaise configure hue, abhi jaanna zaroori nahi. Maksad sirf output ka har hissa padhna hai.",
          },
        },
        {
          type: "cli",
          title: { en: "R1 with a learned route and a default route", hi: "Seekhe hue route aur default route ke saath R1" },
          lines: [
            { prompt: "R1#", cmd: "show ip route" },
            { comment: { en: "Code legend omitted", hi: "Code legend hata diya" } },
            {
              out: "Gateway of last resort is 10.0.12.2 to network 0.0.0.0",
              comment: { en: "Unmatched packets go to 10.0.12.2", hi: "Jo packets kisi route se match nahi karte, woh 10.0.12.2 ko jaate hain" },
            },
            { out: "S*    0.0.0.0/0 [1/0] via 10.0.12.2", comment: { en: "The default route; * marks it as the candidate default", hi: "Default route; * batata hai ki yeh candidate default hai" } },
            { out: "      10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks" },
            { out: "C        10.0.12.0/30 is directly connected, GigabitEthernet0/2" },
            { out: "L        10.0.12.1/32 is directly connected, GigabitEthernet0/2" },
            { out: "      172.16.0.0/24 is subnetted, 1 subnets", comment: { en: "Heading line: every route below it is a /24", hi: "Heading line: iske neeche ka har route /24 hai" } },
            { out: "O        172.16.3.0 [110/2] via 10.0.12.2, 00:05:12, GigabitEthernet0/2", comment: { en: "The entry explained in the table below", hi: "Isi entry ko neeche table mein samjhaya hai" } },
            { comment: { en: "192.168.1.0/24 and 192.168.2.0/24 entries as before", hi: "192.168.1.0/24 aur 192.168.2.0/24 ki entries pehle jaisi" } },
          ],
        },
        {
          type: "table",
          caption: { en: "The OSPF entry, piece by piece", hi: "OSPF entry, ek-ek hissa" },
          columns: [
            { en: "Field", hi: "Field" },
            { en: "In the example", hi: "Example mein" },
            { en: "What it means", hi: "Matlab" },
          ],
          rows: [
            [
              { en: "Route code", hi: "Route code" },
              "O",
              { en: "How the route was learned: O is OSPF. The legend at the top lists every code.", hi: "Route kaise seekha gaya: O yaani OSPF. Upar ka legend har code batata hai." },
            ],
            [
              { en: "Prefix", hi: "Prefix" },
              "172.16.3.0",
              { en: "The destination network the route leads to", hi: "Woh destination network jahan tak yeh route le jaata hai" },
            ],
            [
              { en: "Mask", hi: "Mask" },
              "/24",
              { en: "Printed in the heading line here, because every route under that heading uses the same mask", hi: "Yahan heading line mein print hua hai, kyunki us heading ke neeche har route ka mask same hai" },
            ],
            [
              { en: "Administrative distance", hi: "Administrative distance" },
              "110 (in [110/2])",
              { en: "How much R1 trusts the source of the route; lower is better. 110 is OSPF's default.", hi: "R1 route ke source par kitna trust karta hai; kam matlab behtar. OSPF ka default 110 hai." },
            ],
            [
              { en: "Metric", hi: "Metric" },
              "2 (in [110/2])",
              { en: "The protocol's cost to reach the network; lower is better. For OSPF it is the cost.", hi: "Network tak pahunchne ki protocol wali cost; kam matlab behtar. OSPF mein yeh cost hai." },
            ],
            [
              { en: "Next hop", hi: "Next hop" },
              "via 10.0.12.2",
              { en: "The router R1 hands the packet to, here R2", hi: "Woh router jise R1 packet deta hai, yahan R2" },
            ],
            [
              { en: "Age", hi: "Age" },
              "00:05:12",
              { en: "How long ago the route was learned or last changed (hh:mm:ss)", hi: "Route kitni der pehle seekha gaya ya aakhri baar badla (hh:mm:ss)" },
            ],
            [
              { en: "Outgoing interface", hi: "Outgoing interface" },
              "GigabitEthernet0/2",
              { en: "The interface R1 sends the packet out of to reach the next hop", hi: "Woh interface jisse R1 next hop tak packet bhejta hai" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Lines such as `10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks` are not routes. IOS groups routes under their old classful network (lesson 1.3) and prints a heading line for each group. When every route in a group has the same mask, IOS prints the mask once in the heading (`172.16.0.0/24 is subnetted, 1 subnets`) and leaves it off the route line, so `172.16.3.0` there means `172.16.3.0/24`.",
            hi: "`10.0.0.0/8 is variably subnetted, 2 subnets, 2 masks` jaisi lines routes nahi hain. IOS routes ko unke purane classful network (lesson 1.3) ke neeche group karta hai aur har group ki ek heading line print karta hai. Group ke saare routes ka mask same ho, toh IOS mask ek hi baar heading mein likhta hai (`172.16.0.0/24 is subnetted, 1 subnets`) aur route line se hata deta hai. Isliye wahan `172.16.3.0` ka matlab `172.16.3.0/24` hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Gateway of last resort", hi: "Gateway of last resort" },
          text: {
            en: "This line tells you whether the router has a default route (`0.0.0.0/0`). `Gateway of last resort is not set` means it has none, so a packet that matches no other route is dropped. `Gateway of last resort is 10.0.12.2 to network 0.0.0.0` means unmatched packets go to 10.0.12.2. Static routes show no age or interface when they are configured with only a next hop, as the `S*` line does.",
            hi: "Yeh line batati hai ki router ke paas default route (`0.0.0.0/0`) hai ya nahi. `Gateway of last resort is not set` matlab nahi hai, isliye jo packet kisi aur route se match nahi karta woh drop hota hai. `Gateway of last resort is 10.0.12.2 to network 0.0.0.0` matlab aise packets 10.0.12.2 ko jaate hain. Sirf next hop ke saath configure kiye gaye static routes mein age ya interface nahi dikhta, jaise `S*` wali line mein.",
          },
        },
      ],
    },
    {
      id: "no-matching-route",
      heading: { en: "When no route matches", hi: "Jab koi route match nahi karta" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Routers do not guess, and they do not flood unknown packets the way a switch floods unknown frames. If no route matches the destination and there is no default route, the router drops the packet. By default a Cisco router then sends an **ICMP Destination Unreachable** message to the source, so the sender learns the network is unreachable instead of waiting for a timeout.",
            hi: "Router andaaza nahi lagata, aur unknown packets ko waise flood bhi nahi karta jaise switch unknown frames ko karta hai. Destination kisi route se match nahi hua aur default route bhi nahi hai, toh router packet drop kar deta hai. By default Cisco router phir source ko **ICMP Destination Unreachable** message bhejta hai, taaki sender ko timeout ka wait na karna pade aur pata chal jaaye ki network unreachable hai.",
          },
        },
        {
          type: "cli",
          title: { en: "What PC-A (Windows) and R1 show", hi: "PC-A (Windows) aur R1 kya dikhate hain" },
          lines: [
            { prompt: "C:\\>", cmd: "ping 172.16.3.10" },
            { out: "Pinging 172.16.3.10 with 32 bytes of data:" },
            {
              out: "Reply from 192.168.1.1: Destination net unreachable.",
              comment: { en: "The \"reply\" comes from R1, not from the server", hi: "Yeh \"reply\" R1 se aa raha hai, server se nahi" },
            },
            { prompt: "R1#", cmd: "show ip route 172.16.3.10" },
            { out: "% Network not in table", comment: { en: "R1 has no route for this address", hi: "R1 ke paas is address ka koi route nahi" } },
            { prompt: "R1#", cmd: "show ip route 192.168.2.10" },
            { out: "Routing entry for 192.168.2.0/24" },
            { out: "  Known via \"connected\", distance 0, metric 0 (connected, via interface)" },
            { out: "  Routing Descriptor Blocks:" },
            { out: "  * directly connected, via GigabitEthernet0/1" },
            { out: "      Route metric is 0, traffic share count is 1" },
          ],
          note: {
            en: "`show ip route <address>` shows the route R1 has for one destination, which is quicker than scanning the whole table. When you ping from a Cisco device, each `U` in the result is an ICMP unreachable that came back, while `.` means no answer at all. You will often see `U.U.U`: IOS limits how fast it sends unreachables (by default one every 500 ms), so every other echo gets no answer.",
            hi: "`show ip route <address>` ek destination ke liye R1 ka route dikhata hai, jo poori table scan karne se jaldi hai. Cisco device se ping karo, toh result mein har `U` ek wapas aaya ICMP unreachable hai, aur `.` ka matlab koi jawab hi nahi aaya. Aksar `U.U.U` dikhega: IOS unreachables bhejne ki speed limit karta hai (by default har 500 ms mein ek), isliye beech wale echoes ka koi jawab nahi aata.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "One hop at a time, and both ways", hi: "Ek hop ek baar mein, aur dono taraf" },
          text: {
            en: "R1 only decides the next hop; R2 then makes its own decision from its own table. A ping also needs a route back. Even after R1 learns `172.16.3.0/24`, the reply from the server fails unless R2 has a route to `192.168.1.0/24`. A missing return route is one of the most common routing faults.",
            hi: "R1 sirf next hop decide karta hai; uske baad R2 apni table se apna decision leta hai. Ping ko wapsi ka route bhi chahiye. R1 ke `172.16.3.0/24` seekh lene ke baad bhi server ka reply tab tak fail hoga jab tak R2 ke paas `192.168.1.0/24` ka route nahi hai. Return route ka missing hona sabse common routing faults mein se ek hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Routing table", def: { en: "The router's list of known destination networks, each with a next hop or exit interface.", hi: "Router ki known destination networks ki list, har ek ke saath next hop ya exit interface." } },
    { term: "Connected route (C)", def: { en: "A route to the subnet of an interface that has an IP address and is up/up; added automatically.", hi: "Us interface ke subnet ka route jispar IP address hai aur jo up/up hai; apne aap add hota hai." } },
    { term: "Local route (L)", def: { en: "A /32 route for the router's own interface address, so packets to it are processed by the router.", hi: "Router ke apne interface address ka /32 route, taaki us address ke packets router khud process kare." } },
    { term: "Next hop", def: { en: "The IP address of the neighbouring router a packet is handed to on its way to a remote network.", hi: "Padosi router ka IP address jise remote network ki taraf jaate hue packet diya jaata hai." } },
    { term: "Administrative distance (AD)", def: { en: "A router's trust in the source of a route; lower is more trusted. The first number in [AD/metric].", hi: "Route ke source par router ka trust; kam value matlab zyada trust. [AD/metric] ka pehla number." } },
    { term: "Metric", def: { en: "A routing protocol's cost to reach a network; lower is better. The second number in [AD/metric].", hi: "Kisi network tak pahunchne ki routing protocol wali cost; kam matlab behtar. [AD/metric] ka doosra number." } },
    { term: "Gateway of last resort", def: { en: "The next hop of the default route, used for packets that match no other route.", hi: "Default route ka next hop, un packets ke liye jo kisi aur route se match nahi karte." } },
    { term: "ICMP Destination Unreachable", def: { en: "The error a router sends back to the source when it drops a packet it has no route for.", hi: "Woh error jo router source ko wapas bhejta hai jab route na hone ki wajah se packet drop karta hai." } },
  ],
  commands: [
    { cmd: "show ip route", mode: "Privileged EXEC", does: { en: "Show the whole IPv4 routing table", hi: "Poori IPv4 routing table dikhata hai" } },
    { cmd: "show ip route 192.168.2.10", mode: "Privileged EXEC", does: { en: "Show the route for one address, or % Network not in table", hi: "Ek address ka route dikhata hai, ya % Network not in table" } },
    { cmd: "show ip interface brief", mode: "Privileged EXEC", does: { en: "Check each interface's address and up/up status", hi: "Har interface ka address aur up/up status check karo" } },
    { cmd: "interface gigabitethernet0/0", mode: "Global configuration", does: { en: "Enter interface configuration for Gi0/0", hi: "Gi0/0 ki interface configuration mein jao" } },
    { cmd: "ip address 192.168.1.1 255.255.255.0", mode: "Interface configuration", does: { en: "Give the interface its address and mask", hi: "Interface ko address aur mask do" } },
    { cmd: "no shutdown", mode: "Interface configuration", does: { en: "Enable the interface so it can come up/up", hi: "Interface enable karo taaki woh up/up ho sake" } },
    { cmd: "ping 172.16.3.10", mode: "Windows terminal or Cisco privileged EXEC", does: { en: "Test reachability and see any ICMP unreachable replies", hi: "Reachability test karo aur ICMP unreachable replies dekho" } },
  ],
  mistakes: [
    {
      en: "Expecting a connected route for an interface that is shut down, unplugged or has no IP address. C and L routes exist only while the interface is up/up with an address.",
      hi: "Aise interface ke liye connected route expect karna jo shut down hai, unplugged hai, ya jispar IP address nahi hai. C aur L routes tabhi hote hain jab interface up/up ho aur uspar address ho.",
    },
    {
      en: "Reading an L route as a network. `192.168.1.1/32` is R1's own interface address; the network is the C route, `192.168.1.0/24`.",
      hi: "L route ko network samajhna. `192.168.1.1/32` R1 ka apna interface address hai; network toh C route `192.168.1.0/24` hai.",
    },
    {
      en: "Reading `[110/2]` backwards. The first number is always the administrative distance, the second is the metric.",
      hi: "`[110/2]` ko ulta padhna. Pehla number hamesha administrative distance hai, doosra metric.",
    },
    {
      en: "Treating heading lines (`... is variably subnetted`, `... is subnetted`) as routes, or taking the classful /16 from `172.16.0.0` as the mask. The heading only groups the routes beneath it.",
      hi: "Heading lines (`... is variably subnetted`, `... is subnetted`) ko routes samajhna, ya `172.16.0.0` ka classful /16 mask maan lena. Heading sirf apne neeche ke routes ko group karti hai.",
    },
    {
      en: "Thinking a router sends a packet with no matching route somewhere anyway, or floods it like a switch. With no match and no default route, it drops the packet.",
      hi: "Yeh sochna ki bina matching route wala packet router kahin na kahin bhej dega, ya switch ki tarah flood karega. Match nahi aur default route bhi nahi, toh packet drop.",
    },
    {
      en: "Checking only the path there. A ping also needs every router on the way back to have a route to the source network.",
      hi: "Sirf jaane wala path check karna. Ping ke liye wapsi ke raste ke har router ke paas bhi source network ka route hona chahiye.",
    },
  ],
  recap: [
    { en: "A router forwards by destination IP, using the most specific matching route in its routing table.", hi: "Router destination IP dekh kar forward karta hai, apni routing table ke sabse specific matching route se." },
    { en: "An interface with an IP address that is up/up adds a C route (its subnet) and an L route (its own /32).", hi: "IP address wala up/up interface ek C route (apna subnet) aur ek L route (apna /32) add karta hai." },
    { en: "Remote networks need static routes or a routing protocol; the router cannot discover them on its own.", hi: "Remote networks ke liye static routes ya routing protocol chahiye; router unhe khud discover nahi kar sakta." },
    { en: "Route fields: code, prefix and mask, [AD/metric], via next hop, age, outgoing interface.", hi: "Route ke fields: code, prefix aur mask, [AD/metric], via next hop, age, outgoing interface." },
    { en: "No matching route and no gateway of last resort: the packet is dropped and ICMP Destination Unreachable goes back to the source.", hi: "Matching route nahi aur gateway of last resort bhi nahi: packet drop, aur source ko ICMP Destination Unreachable jaata hai." },
  ],
  quiz: [
    {
      q: {
        en: "Gi0/1 on R1 has `ip address 192.168.2.1 255.255.255.0`, but `show ip route` has no `192.168.2.0/24` entry. `show ip interface brief` shows Gi0/1 as `administratively down down`. What fixes it?",
        hi: "R1 ke Gi0/1 par `ip address 192.168.2.1 255.255.255.0` hai, lekin `show ip route` mein `192.168.2.0/24` ki entry nahi hai. `show ip interface brief` mein Gi0/1 `administratively down down` dikhta hai. Fix kya hai?",
      },
      options: [
        { en: "Add a static route to 192.168.2.0/24", hi: "192.168.2.0/24 ka static route add karo" },
        { en: "Enter `no shutdown` on Gi0/1", hi: "Gi0/1 par `no shutdown` karo" },
        { en: "Configure a default route", hi: "Default route configure karo" },
        { en: "Change the mask to 255.255.255.255", hi: "Mask ko 255.255.255.255 kar do" },
      ],
      answer: 1,
      explain: {
        en: "Connected routes appear only when the interface is up/up. `administratively down` means it is shut down in the configuration; `no shutdown` brings it up and the C and L routes appear by themselves. A static route to a network you are attached to is not the fix.",
        hi: "Connected routes tabhi aate hain jab interface up/up ho. `administratively down` matlab configuration mein interface shut down hai; `no shutdown` se woh up hoga aur C aur L routes apne aap aa jaayenge. Jis network se router juda hai, uske liye static route lagana fix nahi hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "What does `L 10.0.12.1/32 is directly connected, GigabitEthernet0/2` represent?",
        hi: "`L 10.0.12.1/32 is directly connected, GigabitEthernet0/2` kya represent karta hai?",
      },
      options: [
        { en: "A host on the 10.0.12.0/30 link that R1 has learned about", hi: "10.0.12.0/30 link ka ek host jiske baare mein R1 ne seekha hai" },
        { en: "The subnet of the link to R2", hi: "R2 wale link ka subnet" },
        { en: "R1's own IP address on Gi0/2", hi: "Gi0/2 par R1 ka apna IP address" },
        { en: "A backup route used when Gi0/2 goes down", hi: "Backup route jo Gi0/2 down hone par use hota hai" },
      ],
      answer: 2,
      explain: {
        en: "L routes are the router's own interface addresses as /32s, so a packet to 10.0.12.1 is processed by R1 itself. The subnet is the separate C route, 10.0.12.0/30. Both disappear if Gi0/2 goes down.",
        hi: "L routes router ke apne interface addresses hain, /32 ke roop mein, isliye 10.0.12.1 wala packet R1 khud process karta hai. Subnet alag C route hai, 10.0.12.0/30. Gi0/2 down hua toh dono gayab ho jaate hain.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "In `O 172.16.3.0 [110/2] via 10.0.12.2, 00:05:12, GigabitEthernet0/2`, what does the 2 mean?",
        hi: "`O 172.16.3.0 [110/2] via 10.0.12.2, 00:05:12, GigabitEthernet0/2` mein 2 ka kya matlab hai?",
      },
      options: [
        { en: "The metric (OSPF cost) to reach 172.16.3.0", hi: "172.16.3.0 tak pahunchne ka metric (OSPF cost)" },
        { en: "The administrative distance", hi: "Administrative distance" },
        { en: "The number of routers between R1 and the network", hi: "R1 aur network ke beech routers ki ginti" },
        { en: "The number of equal-cost paths", hi: "Equal-cost paths ki ginti" },
      ],
      answer: 0,
      explain: {
        en: "The brackets hold [administrative distance/metric]. 110 is OSPF's AD and 2 is the OSPF cost. OSPF measures cost, not hop count, so the router count is a tempting but wrong reading.",
        hi: "Brackets mein [administrative distance/metric] hota hai. 110 OSPF ka AD hai aur 2 OSPF cost. OSPF cost naapta hai, hop count nahi, isliye routers ki ginti wala option sahi lagta hai, par galat hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1 has only connected and local routes, and `show ip route` says `Gateway of last resort is not set`. A packet arrives for 203.0.113.50. What does R1 do?",
        hi: "R1 ke paas sirf connected aur local routes hain, aur `show ip route` kehta hai `Gateway of last resort is not set`. 203.0.113.50 ke liye packet aata hai. R1 kya karega?",
      },
      options: [
        { en: "Floods it out of every interface except the one it arrived on", hi: "Jis interface se aaya use chhod kar baaki sab se flood karega" },
        { en: "Sends it out of the interface with the highest bandwidth", hi: "Sabse zyada bandwidth wale interface se bhejega" },
        { en: "Holds it until a matching route is learned", hi: "Matching route seekhne tak rok kar rakhega" },
        { en: "Drops it and sends an ICMP Destination Unreachable to the source", hi: "Drop karega aur source ko ICMP Destination Unreachable bhejega" },
      ],
      answer: 3,
      explain: {
        en: "No route matches 203.0.113.50 and there is no default route, so the packet is dropped. Routers never flood unknown packets; flooding is what switches do with unknown frames.",
        hi: "203.0.113.50 kisi route se match nahi karta aur default route bhi nahi hai, isliye packet drop hota hai. Router unknown packets kabhi flood nahi karta; flooding switch unknown frames ke saath karta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "You configure `ip address 172.16.20.77 255.255.255.224` on Gi0/1 and bring it up. Which two routes appear?",
        hi: "Tum Gi0/1 par `ip address 172.16.20.77 255.255.255.224` configure karke use up karte ho. Kaunse do routes aayenge?",
      },
      options: [
        { en: "C 172.16.20.0/24 and L 172.16.20.77/32", hi: "C 172.16.20.0/24 aur L 172.16.20.77/32" },
        { en: "C 172.16.20.64/27 and L 172.16.20.77/32", hi: "C 172.16.20.64/27 aur L 172.16.20.77/32" },
        { en: "C 172.16.20.64/27 and L 172.16.20.77/27", hi: "C 172.16.20.64/27 aur L 172.16.20.77/27" },
        { en: "C 172.16.20.77/27 and L 172.16.20.64/32", hi: "C 172.16.20.77/27 aur L 172.16.20.64/32" },
      ],
      answer: 1,
      explain: {
        en: "A /27 has a block size of 32 in the last octet, so .77 falls in the 64-95 block and the subnet is 172.16.20.64/27. The C route is that subnet; the L route is always the interface's own address as a /32.",
        hi: "/27 ka block size last octet mein 32 hai, isliye .77, 64-95 wale block mein aata hai aur subnet 172.16.20.64/27 hai. C route yahi subnet hai; L route hamesha interface ka apna address /32 ke roop mein hota hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "PC-A (192.168.1.10) pings the server 172.16.3.10. R1 now has a correct route to 172.16.3.0/24 via R2, but the ping still fails. R2 has only its connected routes, 10.0.12.0/30 and 172.16.3.0/24. What is the most likely cause?",
        hi: "PC-A (192.168.1.10) server 172.16.3.10 ko ping karta hai. Ab R1 ke paas R2 ke through 172.16.3.0/24 ka sahi route hai, phir bhi ping fail hai. R2 ke paas sirf connected routes hain, 10.0.12.0/30 aur 172.16.3.0/24. Sabse likely wajah kya hai?",
      },
      options: [
        { en: "R2 has no route back to 192.168.1.0/24, so the reply is dropped", hi: "R2 ke paas 192.168.1.0/24 ka wapsi route nahi hai, isliye reply drop hota hai" },
        { en: "R1 needs a local route for 172.16.3.10", hi: "R1 ko 172.16.3.10 ka local route chahiye" },
        { en: "The server needs its own route to R1's Gi0/2 address", hi: "Server ko R1 ke Gi0/2 address ka apna route chahiye" },
        { en: "Routers cannot forward a ping across more than one hop", hi: "Router ek hop se zyada ping forward nahi kar sakte" },
      ],
      answer: 0,
      explain: {
        en: "The echo reaches the server, which sends its reply to its default gateway, R2. R2 has no route to 192.168.1.0/24 and no default, so it drops the reply. Routing has to work in both directions.",
        hi: "Echo server tak pahunch jaata hai, aur server reply apne default gateway R2 ko bhejta hai. R2 ke paas 192.168.1.0/24 ka route nahi hai aur default bhi nahi, isliye woh reply drop kar deta hai. Routing dono directions mein kaam karni chahiye.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "aHwAm8GYbn8",
      title: "Free CCNA | Routing Fundamentals | Day 11 (part 1)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Connected and local routes, the routing table and route selection, shown in Packet Tracer.",
        hi: "Connected aur local routes, routing table aur route selection, Packet Tracer mein dikhaya gaya.",
      },
    },
    {
      id: "EnFO09909Fc",
      title: "Routing Fundamentals - Need of Routing",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Why networks need routing and what a router does, in Hindi.", hi: "Network ko routing kyun chahiye aur router kya karta hai, Hindi mein." },
    },
    {
      id: "VqNfwCE7OIs",
      title: "Connected Routes on Cisco Routers in Hindi",
      channel: "JagvinderThind",
      lang: "hi",
      note: { en: "A short demo of connected routes appearing on a Cisco router.", hi: "Cisco router par connected routes aate hue dikhane wala chhota demo." },
    },
  ],
  lab: {
    title: { en: "Build R1's routing table one interface at a time", hi: "R1 ki routing table ek-ek interface karke banao" },
    steps: [
      {
        en: "In Packet Tracer, connect PC-A (192.168.1.10/24, gateway 192.168.1.1) to R1 Gi0/0 and PC-B (192.168.2.10/24, gateway 192.168.2.1) to R1 Gi0/1. Link R1 Gi0/2 (10.0.12.1/30) to R2 Gi0/0 (10.0.12.2/30), and put a server (172.16.3.10/24, gateway 172.16.3.1) behind R2 Gi0/1. Configure R2's two addresses (10.0.12.2/30 and 172.16.3.1/24) and enter `no shutdown` on both now, so R1's Gi0/2 has a live neighbour later.",
        hi: "Packet Tracer mein PC-A (192.168.1.10/24, gateway 192.168.1.1) ko R1 Gi0/0 se aur PC-B (192.168.2.10/24, gateway 192.168.2.1) ko R1 Gi0/1 se jodo. R1 Gi0/2 (10.0.12.1/30) ko R2 Gi0/0 (10.0.12.2/30) se link karo, aur R2 Gi0/1 ke peeche ek server (172.16.3.10/24, gateway 172.16.3.1) lagao. R2 ke dono addresses (10.0.12.2/30 aur 172.16.3.1/24) abhi configure karo aur dono par `no shutdown` kar do, taaki baad mein R1 ke Gi0/2 ke saamne ek live neighbour ho.",
      },
      {
        en: "Configure the three R1 addresses but leave the interfaces shut down. Run `show ip route` on R1: the table has no routes.",
        hi: "R1 ke teeno addresses configure karo lekin interfaces shut down hi rehne do. R1 par `show ip route` chalao: table mein koi route nahi hai.",
      },
      {
        en: "Enter `no shutdown` on Gi0/0 and run `show ip route` again. Find the new C and L lines. Repeat for Gi0/1 and Gi0/2.",
        hi: "Gi0/0 par `no shutdown` karo aur dobara `show ip route` chalao. Naye C aur L lines dhoondho. Gi0/1 aur Gi0/2 ke liye yahi repeat karo.",
      },
      {
        en: "From PC-A, ping PC-B and then 192.168.1.1. Next ping 172.16.3.10 and read which address the unreachable reply comes from.",
        hi: "PC-A se pehle PC-B ko, phir 192.168.1.1 ko ping karo. Uske baad 172.16.3.10 ko ping karo aur dekho unreachable reply kis address se aata hai.",
      },
      {
        en: "On R1 run `show ip route 172.16.3.10` and `show ip route 192.168.2.10`. Then shut down Gi0/1 and check which routes disappeared.",
        hi: "R1 par `show ip route 172.16.3.10` aur `show ip route 192.168.2.10` chalao. Phir Gi0/1 shut down karo aur dekho kaunse routes gayab hue.",
      },
    ],
  },
};

export default lesson;
