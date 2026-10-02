import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "forwarding-decisions",
  intro: {
    en: "A real routing table is full of overlaps: a default route, a summary such as 10.0.0.0/8, more specific routes inside it, and sometimes the same network offered by two protocols. For every packet the router still has to choose exactly one entry, and it follows a fixed order to do it. Once you know that order you can predict the path of any packet from `show ip route`, which is what exam topic 3.2 asks you to do.",
    hi: "Asli routing table overlaps se bhari hoti hai: ek default route, 10.0.0.0/8 jaisa summary, uske andar ke zyada specific routes, aur kabhi-kabhi ek hi network do protocols se aata hua. Phir bhi har packet ke liye router ko exactly ek entry chunni hoti hai, aur iske liye woh ek fixed order follow karta hai. Yeh order samajh gaye toh `show ip route` dekh kar kisi bhi packet ka path predict kar sakte ho, aur exam topic 3.2 yahi poochta hai.",
  },
  outcomes: [
    { en: "Find the route a router uses for any destination with longest prefix match", hi: "Longest prefix match se kisi bhi destination ke liye router ka route nikaal sako" },
    { en: "Explain why a longer prefix wins even when its administrative distance is worse", hi: "Samjha sako ki lamba prefix kyun jeetta hai, chahe uska administrative distance zyada (yaani kam trusted) ho" },
    { en: "Recall the default administrative distances and use them when two sources offer the same prefix", hi: "Default administrative distances yaad rakho aur jab do sources same prefix dein tab unka use kar sako" },
    { en: "Explain how a metric chooses between paths inside one protocol, and what equal-cost multipath does", hi: "Samjha sako ki ek protocol ke andar metric paths mein se kaise chunta hai, aur equal-cost multipath kya karta hai" },
    { en: "Read [AD/metric] values and multiple `via` lines in `show ip route`", hi: "`show ip route` mein [AD/metric] values aur multiple `via` lines padh sako" },
  ],
  sections: [
    {
      id: "the-order",
      heading: { en: "The order a router follows", hi: "Router kis order mein decide karta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Three rules decide which route forwards a packet. Apply them in this order, and move to the next rule only when the one before it cannot separate the candidates.",
            hi: "Teen rules decide karte hain ki packet kis route se forward hoga. Inhe isi order mein lagao, aur agle rule par tabhi jao jab pichla rule candidates ke beech fark na kar paaye.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Longest prefix match.** Of all the routes that contain the destination address, use the one with the longest prefix: /24 beats /16, /16 beats /8, and anything beats /0. This rule always comes first.",
              hi: "**Longest prefix match.** Jitne routes destination address ko contain karte hain, unme se sabse lamba prefix wala use hota hai: /24 jeetega /16 se, /16 jeetega /8 se, aur /0 har kisi se haar jaata hai. Yeh rule hamesha sabse pehle aata hai.",
            },
            {
              en: "**Administrative distance (AD).** Only when exactly the same prefix, such as `10.1.1.0/24`, is offered by different sources (static, OSPF, EIGRP and so on), the source with the lowest AD wins and only its route enters the routing table.",
              hi: "**Administrative distance (AD).** Sirf tab, jab bilkul same prefix, jaise `10.1.1.0/24`, alag-alag sources (static, OSPF, EIGRP waghera) se aaye, toh sabse kam AD wala source jeetta hai aur sirf uska route routing table mein jaata hai.",
            },
            {
              en: "**Metric.** Only when one routing protocol knows several paths to the same prefix, the path with the lowest metric is installed. If the metrics tie, the router installs all of them and shares traffic across them (equal-cost multipath).",
              hi: "**Metric.** Sirf tab, jab ek hi routing protocol ko same prefix ke kai paths pata hon, toh sabse kam metric wala path install hota hai. Metric barabar ho, toh router sab paths install karke traffic unme baant deta hai (equal-cost multipath).",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "Strictly, rules 2 and 3 run while the routing table is being built: they decide which single route per prefix gets in. Rule 1 runs for every packet and chooses among the routes that got in. The effect is the order above: AD and metric never make a /8 beat a /24.",
            hi: "Technically dekho toh rule 2 aur 3 routing table bante waqt chalte hain: yeh decide karte hain ki har prefix ka kaunsa ek route andar jaayega. Rule 1 har packet ke liye chalta hai aur andar aaye routes mein se chunta hai. Result wahi order hai jo upar hai: AD aur metric kabhi bhi /8 ko /24 se jeetne nahi dete.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Prefix length first, always", hi: "Pehle prefix length, hamesha" },
          text: {
            en: "A static route has AD 1 and OSPF has AD 110, yet a packet to 10.1.1.5 uses the OSPF route `10.1.1.0/24` rather than the static `10.0.0.0/8`. The two routes have different prefixes, so their ADs are never compared. Exam questions are built around exactly this trap.",
            hi: "Static route ka AD 1 hai aur OSPF ka 110, phir bhi 10.1.1.5 ka packet static `10.0.0.0/8` ki jagah OSPF route `10.1.1.0/24` use karta hai. Dono routes ke prefixes alag hain, isliye unke AD compare hi nahi hote. Exam ke questions isi trap par bante hain.",
          },
        },
      ],
    },
    {
      id: "longest-prefix-match",
      heading: { en: "Longest prefix match, worked through", hi: "Longest prefix match, example ke saath" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A route matches a destination when the first N bits of the destination equal the first N bits of the route, where N is the prefix length. When the prefix ends on an octet boundary you can compare whole octets: `10.1.1.0/24` matches any address that starts `10.1.1.`. The default route `0.0.0.0/0` compares zero bits, so it matches every address and loses to anything longer.",
            hi: "Route destination se tab match karta hai jab destination ke pehle N bits route ke pehle N bits ke barabar hon, jahan N prefix length hai. Prefix octet boundary par khatam ho, toh poore octets compare kar sakte ho: `10.1.1.0/24` har us address se match karta hai jo `10.1.1.` se shuru hota hai. Default route `0.0.0.0/0` zero bits compare karta hai, isliye har address se match karta hai aur har lambe route se haar jaata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "R1's routes at the start of the animation", hi: "Animation ki shuruaat mein R1 ke routes" },
          columns: ["Route", { en: "Next hop", hi: "Next hop" }],
          rows: [
            ["S* 0.0.0.0/0 [1/0]", "203.0.113.1 (ISP)"],
            ["S 10.0.0.0/8 [1/0]", "172.16.12.2 (R2)"],
            ["O 10.1.0.0/16 [110/2]", "172.16.13.2 (R3)"],
            ["O 10.1.1.0/24 [110/2]", "172.16.14.2 (R4)"],
          ],
        },
        {
          type: "table",
          caption: { en: "Four packets, four different next hops", hi: "Chaar packets, chaar alag next hops" },
          columns: [
            { en: "Destination", hi: "Destination" },
            { en: "Routes that match", hi: "Match karne wale routes" },
            { en: "Longest match", hi: "Longest match" },
            { en: "Sent to", hi: "Kahan gaya" },
          ],
          rows: [
            ["10.1.1.5", "0.0.0.0/0, 10.0.0.0/8, 10.1.0.0/16, 10.1.1.0/24", "10.1.1.0/24", "R4"],
            ["10.1.2.5", "0.0.0.0/0, 10.0.0.0/8, 10.1.0.0/16", "10.1.0.0/16", "R3"],
            ["10.2.0.1", "0.0.0.0/0, 10.0.0.0/8", "10.0.0.0/8", "R2"],
            ["8.8.8.8", { en: "0.0.0.0/0 only", hi: "Sirf 0.0.0.0/0" }, "0.0.0.0/0", "ISP"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Look at 10.1.2.5. It shares the first two octets with `10.1.1.0/24`, but a /24 needs all three to match, and the third octet is 2, not 1. A near miss is still a miss. The most specific route possible is a /32, such as the local routes from lesson 3.1.",
            hi: "10.1.2.5 ko dekho. Iske pehle do octets `10.1.1.0/24` se milte hain, lekin /24 ke liye teeno octets match hone chahiye, aur teesra octet 2 hai, 1 nahi. Thoda sa miss bhi miss hi hai. Sabse specific route /32 hota hai, jaise lesson 3.1 ke local routes.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Prefixes that do not end on an octet", hi: "Jo prefixes octet par khatam nahi hote" },
          text: {
            en: "For a route such as `172.16.32.0/19`, work out its address range the way you did in subnetting (lesson 1.5). A /19 has a block size of 32 in the third octet, so `172.16.32.0/19` covers 172.16.32.0 to 172.16.63.255. Then check whether the destination falls inside that range.",
            hi: "`172.16.32.0/19` jaise route ke liye uski address range waise hi nikaalo jaise subnetting (lesson 1.5) mein kiya tha. /19 ka block size teesre octet mein 32 hai, isliye `172.16.32.0/19` 172.16.32.0 se 172.16.63.255 tak cover karta hai. Phir dekho destination us range ke andar aata hai ya nahi.",
          },
        },
      ],
    },
    {
      id: "administrative-distance",
      heading: { en: "Administrative distance: which source to trust", hi: "Administrative distance: kis source par trust karein" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Routing protocols measure paths in different units. RIP counts hops, OSPF adds up interface costs, and EIGRP combines bandwidth and delay. An OSPF cost of 2 and an EIGRP metric of 3072 cannot be compared, so when two sources offer the same prefix, IOS ignores their metrics and compares a fixed trust value for each source: the **administrative distance**. Lower is better.",
            hi: "Routing protocols paths ko alag-alag units mein naapte hain. RIP hops ginta hai, OSPF interface costs jodta hai, aur EIGRP bandwidth aur delay ko milata hai. OSPF ki cost 2 aur EIGRP ka metric 3072 compare nahi ho sakte, isliye jab do sources same prefix dete hain, IOS unke metrics ignore karke har source ki ek fixed trust value compare karta hai: **administrative distance**. Kam matlab behtar.",
          },
        },
        {
          type: "table",
          caption: { en: "Default administrative distances on Cisco IOS. Learn this table.", hi: "Cisco IOS ke default administrative distances. Yeh table yaad karo." },
          columns: [
            { en: "Route source", hi: "Route source" },
            { en: "Default AD", hi: "Default AD" },
          ],
          rows: [
            [{ en: "Connected interface", hi: "Connected interface" }, "0"],
            [{ en: "Static route", hi: "Static route" }, "1"],
            [{ en: "eBGP (external BGP)", hi: "eBGP (external BGP)" }, "20"],
            [{ en: "EIGRP (internal)", hi: "EIGRP (internal)" }, "90"],
            ["OSPF", "110"],
            ["IS-IS", "115"],
            ["RIP", "120"],
            [{ en: "EIGRP external", hi: "EIGRP external" }, "170"],
            [{ en: "iBGP (internal BGP)", hi: "iBGP (internal BGP)" }, "200"],
            [{ en: "Unknown or unreachable", hi: "Unknown ya unreachable" }, { en: "255 (never installed)", hi: "255 (kabhi install nahi hota)" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "In the animation, OSPF offers `10.1.1.0/24` through R4, then R3 starts offering the same /24 with EIGRP. EIGRP's 90 beats OSPF's 110, so the EIGRP route replaces the OSPF one in the routing table. OSPF still keeps its path in its own database; if the EIGRP route disappears, the OSPF route is installed again.",
            hi: "Animation mein OSPF, R4 ke through `10.1.1.0/24` deta hai, phir R3 wahi /24 EIGRP se dene lagta hai. EIGRP ka 90, OSPF ke 110 se behtar hai, isliye routing table mein OSPF route ki jagah EIGRP route aa jaata hai. OSPF apna path apne database mein rakhta hai; EIGRP route gayab hua toh OSPF route phir se install ho jaata hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Ask R1 which route it has for one address", hi: "R1 se ek address ka route poochho" },
          lines: [
            { prompt: "R1#", cmd: "show ip route 10.1.1.5" },
            { out: "Routing entry for 10.1.1.0/24", comment: { en: "The longest match for 10.1.1.5", hi: "10.1.1.5 ka longest match" } },
            {
              out: "  Known via \"eigrp 100\", distance 90, metric 3072, type internal",
              comment: { en: "Source, AD and metric of the installed route", hi: "Installed route ka source, AD aur metric" },
            },
            { comment: { en: "Next hop and path details follow", hi: "Aage next hop aur path ki details aati hain" } },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "AD is local, and you can change it", hi: "AD local hai, aur badla ja sakta hai" },
          text: {
            en: "AD matters only inside one router and is never advertised to neighbours. You can change it: a static route given a higher AD than your routing protocol stays out of the table until the dynamic route is lost, then takes over. That backup is a floating static route, covered in lesson 3.4.",
            hi: "AD sirf ek router ke andar matter karta hai aur neighbours ko kabhi advertise nahi hota. Ise badal bhi sakte ho: agar static route ko routing protocol se zyada AD de do, toh woh tab tak table se bahar rehta hai jab tak dynamic route chala na jaaye, phir uski jagah le leta hai. Is backup ko floating static route kehte hain, lesson 3.4 mein.",
          },
        },
      ],
    },
    {
      id: "metric-and-ecmp",
      heading: { en: "Metric and equal-cost multipath", hi: "Metric aur equal-cost multipath" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Inside one routing protocol, several paths to the same prefix are compared by that protocol's **metric**, and the lowest wins. Each protocol has its own metric, which is why metrics are only ever compared within one protocol.",
            hi: "Ek routing protocol ke andar, same prefix ke kai paths us protocol ke **metric** se compare hote hain, aur sabse kam wala jeetta hai. Har protocol ka apna metric hota hai, isiliye metrics sirf ek hi protocol ke andar compare hote hain.",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Protocol", hi: "Protocol" },
            { en: "Metric", hi: "Metric" },
            { en: "A lower value means", hi: "Kam value ka matlab" },
          ],
          rows: [
            ["RIP", { en: "Hop count, maximum 15", hi: "Hop count, maximum 15" }, { en: "Fewer routers on the path", hi: "Path par kam routers" }],
            ["OSPF", { en: "Cost: the sum of interface costs, based on bandwidth", hi: "Cost: interface costs ka total, bandwidth par based" }, { en: "Faster links", hi: "Tez links" }],
            ["EIGRP", { en: "Composite of bandwidth and delay by default", hi: "By default bandwidth aur delay ka composite" }, { en: "Faster, lower-delay path", hi: "Tez aur kam delay wala path" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "If two paths tie on metric, the router installs both. This is **equal-cost multipath (ECMP)**. Cisco IOS installs up to 4 equal-cost paths by default for OSPF, EIGRP and RIP, and the `maximum-paths` command changes the limit. Traffic is then shared per flow: by default CEF (Cisco Express Forwarding) hashes the source and destination addresses, so each flow stays on one path and its packets arrive in order.",
            hi: "Agar do paths ka metric barabar ho, toh router dono install kar leta hai. Yahi **equal-cost multipath (ECMP)** hai. Cisco IOS by default OSPF, EIGRP aur RIP ke liye 4 tak equal-cost paths install karta hai, aur `maximum-paths` command se yeh limit badalti hai. Phir traffic flow ke hisaab se baantta hai: by default CEF (Cisco Express Forwarding) source aur destination addresses ka hash banata hai, isliye har flow ek hi path par rehta hai aur uske packets order mein pahunchte hain.",
          },
        },
        {
          type: "cli",
          title: { en: "Two equal-cost OSPF paths to one prefix", hi: "Ek prefix ke do equal-cost OSPF paths" },
          lines: [
            { prompt: "R1#", cmd: "show ip route ospf" },
            { comment: { en: "Code legend and gateway line omitted", hi: "Code legend aur gateway line hata di" } },
            { out: "      10.0.0.0/8 is variably subnetted, 3 subnets, 3 masks" },
            { out: "O        10.1.0.0/16 [110/2] via 172.16.13.2, 00:03:40, GigabitEthernet0/2" },
            {
              out: "                     [110/2] via 172.16.12.2, 00:00:04, GigabitEthernet0/1",
              comment: { en: "Second line under the same prefix: an equal-cost path", hi: "Same prefix ke neeche doosri line: equal-cost path" },
            },
          ],
          note: {
            en: "If the path through 172.16.12.2 cost 3 instead of 2, it would not be listed at all; only the cost-2 path would be installed.",
            hi: "Agar 172.16.12.2 wale path ki cost 2 ki jagah 3 hoti, toh woh list hi nahi hota; sirf cost 2 wala path install hota.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Beyond the CCNA", hi: "CCNA ke aage" },
          text: {
            en: "EIGRP can also share traffic over paths with unequal metrics, using the `variance` command. The CCNA exam does not test it; lesson 7.3 covers it.",
            hi: "EIGRP `variance` command se unequal metric wale paths par bhi traffic baant sakta hai. CCNA exam ise test nahi karta; yeh lesson 7.3 mein hai.",
          },
        },
      ],
    },
    {
      id: "putting-it-together",
      heading: { en: "Putting it together: R1's final table", hi: "Sab ek saath: R1 ki final table" },
      blocks: [
        {
          type: "p",
          text: {
            en: "This is R1 at the end of the animation, after the EIGRP route and the second OSPF path arrived. Connected and local routes are left out to keep it short.",
            hi: "Yeh animation ke end wala R1 hai, EIGRP route aur doosra OSPF path aane ke baad. Chhota rakhne ke liye connected aur local routes hata diye hain.",
          },
        },
        {
          type: "cli",
          lines: [
            { prompt: "R1#", cmd: "show ip route" },
            { comment: { en: "Code legend omitted", hi: "Code legend hata diya" } },
            { out: "Gateway of last resort is 203.0.113.1 to network 0.0.0.0" },
            { out: "S*    0.0.0.0/0 [1/0] via 203.0.113.1" },
            { out: "      10.0.0.0/8 is variably subnetted, 3 subnets, 3 masks" },
            { out: "S        10.0.0.0/8 [1/0] via 172.16.12.2" },
            { out: "O        10.1.0.0/16 [110/2] via 172.16.13.2, 00:03:40, GigabitEthernet0/2" },
            { out: "                     [110/2] via 172.16.12.2, 00:00:04, GigabitEthernet0/1" },
            { out: "D        10.1.1.0/24 [90/3072] via 172.16.13.2, 00:02:11, GigabitEthernet0/2" },
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**10.1.1.200**: the longest match is `10.1.1.0/24`, now learned by EIGRP, so it goes to 172.16.13.2 (R3).",
              hi: "**10.1.1.200**: longest match `10.1.1.0/24` hai, jo ab EIGRP se aaya hai, toh packet 172.16.13.2 (R3) ko jaata hai.",
            },
            {
              en: "**10.1.2.5** and **10.1.3.7**: the longest match is `10.1.0.0/16`, which has two equal-cost next hops. CEF puts each flow on one of them.",
              hi: "**10.1.2.5** aur **10.1.3.7**: longest match `10.1.0.0/16` hai, jiske do equal-cost next hops hain. CEF har flow ko unme se ek par daalta hai.",
            },
            {
              en: "**10.200.0.1**: only `10.0.0.0/8` and the default match, so it goes to 172.16.12.2 (R2).",
              hi: "**10.200.0.1**: sirf `10.0.0.0/8` aur default match karte hain, toh packet 172.16.12.2 (R2) ko jaata hai.",
            },
            {
              en: "**192.0.2.10**: nothing but the default matches, so it goes to the gateway of last resort, 203.0.113.1.",
              hi: "**192.0.2.10**: default ke alawa kuch match nahi karta, toh packet gateway of last resort 203.0.113.1 ko jaata hai.",
            },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Longest prefix match", def: { en: "The rule that the matching route with the most network bits (the longest prefix) is used to forward a packet.", hi: "Woh rule jisme sabse zyada network bits (sabse lamba prefix) wala matching route packet forward karta hai." } },
    { term: "Prefix length", def: { en: "The number of network bits in a route, written after the slash, such as /24.", hi: "Route ke network bits ki ginti, slash ke baad likhi jaati hai, jaise /24." } },
    { term: "Administrative distance (AD)", def: { en: "A router's trust in a route source, used only to choose between sources offering the same prefix; lower wins.", hi: "Route source par router ka trust, sirf tab use hota hai jab alag sources same prefix dein; kam wala jeetta hai." } },
    { term: "Metric", def: { en: "A routing protocol's own cost for a path, used to choose between paths inside that protocol; lower wins.", hi: "Kisi path ki routing protocol wali apni cost, usi protocol ke paths mein chunne ke liye; kam wala jeetta hai." } },
    { term: "Equal-cost multipath (ECMP)", def: { en: "Installing several paths with the same metric for one prefix and sharing traffic across them.", hi: "Ek prefix ke same metric wale kai paths install karke unme traffic baantna." } },
    { term: "Default route", def: { en: "The route 0.0.0.0/0. It matches every destination but is the shortest possible match, so it is used only when nothing longer matches.", hi: "Route 0.0.0.0/0. Yeh har destination se match karta hai lekin sabse chhota match hai, isliye tabhi use hota hai jab koi lamba route match na kare." } },
    { term: "CEF", def: { en: "Cisco Express Forwarding, the IOS forwarding engine; by default it shares ECMP traffic per source-destination pair.", hi: "Cisco Express Forwarding, IOS ka forwarding engine; by default yeh ECMP traffic ko har source-destination pair ke hisaab se baantta hai." } },
  ],
  commands: [
    { cmd: "show ip route", mode: "Privileged EXEC", does: { en: "Show every installed route with its [AD/metric] and next hops", hi: "Har installed route ko uske [AD/metric] aur next hops ke saath dikhata hai" } },
    { cmd: "show ip route 10.1.1.5", mode: "Privileged EXEC", does: { en: "Show the longest-match route for one address, with its source, AD and metric", hi: "Ek address ka longest-match route, uske source, AD aur metric ke saath dikhata hai" } },
    { cmd: "show ip route ospf", mode: "Privileged EXEC", does: { en: "Show only the routes learned by OSPF", hi: "Sirf OSPF se seekhe routes dikhata hai" } },
    { cmd: "maximum-paths 4", mode: "Router configuration", does: { en: "Set how many equal-cost paths the protocol may install", hi: "Protocol kitne equal-cost paths install kar sakta hai, yeh set karta hai" } },
    { cmd: "ip route 10.1.1.0 255.255.255.0 172.16.12.2 200", mode: "Global configuration", does: { en: "Add a static route with AD 200 instead of 1 (used in the lab)", hi: "AD 1 ki jagah AD 200 wala static route add karta hai (lab mein use hota hai)" } },
    { cmd: "traceroute 10.1.1.5", mode: "Privileged EXEC", does: { en: "Show the routers a packet actually passes through", hi: "Packet asal mein kin routers se guzarta hai, yeh dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Comparing AD across different prefixes. A static `10.0.0.0/8` (AD 1) never beats an OSPF `10.1.1.0/24` (AD 110) for 10.1.1.5; the /24 is longer, so it wins.",
      hi: "Alag prefixes ke beech AD compare karna. 10.1.1.5 ke liye static `10.0.0.0/8` (AD 1) kabhi OSPF `10.1.1.0/24` (AD 110) ko nahi harata; /24 lamba hai, isliye wahi jeetta hai.",
    },
    {
      en: "Comparing metrics across protocols. An OSPF cost of 2 is not better than an EIGRP metric of 3072; routes from different protocols are compared by AD only.",
      hi: "Alag protocols ke metrics compare karna. OSPF ki cost 2, EIGRP ke metric 3072 se behtar nahi hai; alag protocols ke routes sirf AD se compare hote hain.",
    },
    {
      en: "Treating `10.1.0.0/16` and `10.1.0.0/24` as the same route. They have different prefix lengths, so both can be installed and AD is not compared between them.",
      hi: "`10.1.0.0/16` aur `10.1.0.0/24` ko ek hi route samajhna. Inki prefix lengths alag hain, isliye dono install ho sakte hain aur inke beech AD compare nahi hota.",
    },
    {
      en: "Thinking the default route is tried when a more specific route leads nowhere. The router uses the longest match in its table; the default is used only when no longer route is in the table.",
      hi: "Yeh sochna ki specific route kaam na kare toh router default route try karega. Router table ka longest match use karta hai; default tabhi use hota hai jab table mein koi lamba route hai hi nahi.",
    },
    {
      en: "Expecting ECMP to alternate packet by packet. By default CEF keeps each source-destination flow on one path.",
      hi: "Yeh expect karna ki ECMP har packet ko baari-baari alag path par bhejega. By default CEF har source-destination flow ko ek hi path par rakhta hai.",
    },
    {
      en: "Letting a near miss count as a match. `10.1.1.0/24` does not match 10.1.2.5; all 24 bits must be equal.",
      hi: "Thode se miss ko match maan lena. `10.1.1.0/24`, 10.1.2.5 se match nahi karta; saare 24 bits barabar hone chahiye.",
    },
  ],
  recap: [
    { en: "Longest prefix match comes first, always: /32 beats /24 beats /16 beats /8 beats /0.", hi: "Longest prefix match hamesha pehle: /32 > /24 > /16 > /8 > /0." },
    { en: "AD only chooses between different sources offering exactly the same prefix; the lowest AD is installed.", hi: "AD sirf tab chunta hai jab alag sources bilkul same prefix dein; sabse kam AD wala install hota hai." },
    { en: "Default ADs: connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, IS-IS 115, RIP 120, EIGRP external 170, iBGP 200, 255 never used.", hi: "Default ADs: connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, IS-IS 115, RIP 120, EIGRP external 170, iBGP 200, 255 kabhi use nahi hota." },
    { en: "Metric compares paths inside one protocol; equal metrics give ECMP, up to 4 paths by default.", hi: "Metric ek protocol ke andar paths compare karta hai; barabar metric se ECMP milta hai, by default 4 paths tak." },
    { en: "In `show ip route`, [AD/metric] sits in brackets, and extra `via` lines under one prefix are equal-cost paths.", hi: "`show ip route` mein [AD/metric] brackets mein hota hai, aur ek prefix ke neeche extra `via` lines equal-cost paths hain." },
  ],
  quiz: [
    {
      q: {
        en: "Several routes in a router's table contain a packet's destination address. What does the router compare first to choose one?",
        hi: "Router ki table ke kai routes packet ke destination address ko contain karte hain. Ek chunne ke liye router sabse pehle kya compare karta hai?",
      },
      options: [
        { en: "Administrative distance", hi: "Administrative distance" },
        { en: "Metric", hi: "Metric" },
        { en: "Prefix length", hi: "Prefix length" },
        { en: "The age of each route", hi: "Har route ki age" },
      ],
      answer: 2,
      explain: {
        en: "Longest prefix match always comes first. AD only matters between sources offering exactly the same prefix, and metric only between paths inside one protocol.",
        hi: "Longest prefix match hamesha pehle aata hai. AD sirf tab matter karta hai jab alag sources bilkul same prefix dein, aur metric sirf ek protocol ke andar ke paths ke beech.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1 has 172.16.0.0/16 via 10.0.0.1, 172.16.32.0/19 via 10.0.0.2, 172.16.40.0/21 via 10.0.0.3 and 0.0.0.0/0 via 10.0.0.4. Where does it send a packet for 172.16.45.9?",
        hi: "R1 ke paas 172.16.0.0/16 via 10.0.0.1, 172.16.32.0/19 via 10.0.0.2, 172.16.40.0/21 via 10.0.0.3 aur 0.0.0.0/0 via 10.0.0.4 hain. 172.16.45.9 ka packet kahan jaayega?",
      },
      options: [
        { en: "10.0.0.3", hi: "10.0.0.3" },
        { en: "10.0.0.2", hi: "10.0.0.2" },
        { en: "10.0.0.1", hi: "10.0.0.1" },
        { en: "10.0.0.4", hi: "10.0.0.4" },
      ],
      answer: 0,
      explain: {
        en: "A /21 has a block size of 8 in the third octet, so 172.16.40.0/21 covers 172.16.40.0 to 172.16.47.255, and 45 is inside it. The /19 (32 to 63) and the /16 also match, but /21 is the longest.",
        hi: "/21 ka block size teesre octet mein 8 hai, isliye 172.16.40.0/21, 172.16.40.0 se 172.16.47.255 tak cover karta hai, aur 45 iske andar hai. /19 (32 se 63) aur /16 bhi match karte hain, lekin /21 sabse lamba hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "R1 has `S 10.0.0.0/8 [1/0] via 172.16.12.2` and `O 10.1.1.0/24 [110/2] via 172.16.14.2`. Which next hop does it use for 10.1.1.5?",
        hi: "R1 ke paas `S 10.0.0.0/8 [1/0] via 172.16.12.2` aur `O 10.1.1.0/24 [110/2] via 172.16.14.2` hain. 10.1.1.5 ke liye kaunsa next hop use hoga?",
      },
      options: [
        { en: "172.16.12.2, because static routes have a lower AD", hi: "172.16.12.2, kyunki static routes ka AD kam hota hai" },
        { en: "Both, because the router shares the load between them", hi: "Dono, kyunki router unme load baantta hai" },
        { en: "Neither; the router drops it because the routes overlap", hi: "Koi nahi; routes overlap karte hain isliye router drop kar deta hai" },
        { en: "172.16.14.2, because /24 is a longer match than /8", hi: "172.16.14.2, kyunki /24, /8 se lamba match hai" },
      ],
      answer: 3,
      explain: {
        en: "Both routes match, but they are different prefixes, so AD is never compared. The /24 is the longest match. Overlapping routes are normal and never cause a drop.",
        hi: "Dono routes match karte hain, lekin prefixes alag hain, isliye AD compare hi nahi hota. /24 longest match hai. Overlapping routes normal hain aur inse kabhi drop nahi hota.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "R1 learns 192.168.50.0/24 from OSPF with cost 3 and from EIGRP with metric 30720. Which route goes into the routing table?",
        hi: "R1 192.168.50.0/24 ko OSPF se cost 3 ke saath aur EIGRP se metric 30720 ke saath seekhta hai. Routing table mein kaunsa route jaayega?",
      },
      options: [
        { en: "The OSPF route, because 3 is lower than 30720", hi: "OSPF route, kyunki 3, 30720 se kam hai" },
        { en: "The EIGRP route, because EIGRP's AD of 90 is lower than OSPF's 110", hi: "EIGRP route, kyunki EIGRP ka AD 90, OSPF ke 110 se kam hai" },
        { en: "Both, as equal-cost paths", hi: "Dono, equal-cost paths ke roop mein" },
        { en: "Whichever route was learned first", hi: "Jo route pehle seekha gaya" },
      ],
      answer: 1,
      explain: {
        en: "Same prefix, different sources, so AD decides and EIGRP (90) beats OSPF (110). Metrics from different protocols are in different units and are never compared, which is why the 3 vs 30720 option is a trap.",
        hi: "Prefix same hai, sources alag, isliye AD decide karta hai aur EIGRP (90), OSPF (110) ko harata hai. Alag protocols ke metrics alag units mein hote hain aur kabhi compare nahi hote, isliye 3 vs 30720 wala option trap hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`show ip route` shows `O 10.1.0.0/16 [110/2] via 172.16.13.2` and, on the next line, `[110/2] via 172.16.12.2`. What does this mean?",
        hi: "`show ip route` mein `O 10.1.0.0/16 [110/2] via 172.16.13.2` aur agli line mein `[110/2] via 172.16.12.2` dikhta hai. Iska matlab kya hai?",
      },
      options: [
        { en: "Only 172.16.13.2 is used; the second line is a standby path", hi: "Sirf 172.16.13.2 use hota hai; doosri line standby path hai" },
        { en: "The route is flapping between two next hops", hi: "Route do next hops ke beech flap ho raha hai" },
        { en: "R1 has two equal-cost OSPF paths and shares traffic across both", hi: "R1 ke paas do equal-cost OSPF paths hain aur woh dono par traffic baantta hai" },
        { en: "172.16.12.2 has a better administrative distance", hi: "172.16.12.2 ka administrative distance behtar hai" },
      ],
      answer: 2,
      explain: {
        en: "Both lines show [110/2]: same AD, same metric, same prefix. That tie gives equal-cost multipath, and CEF shares traffic across both next hops per flow.",
        hi: "Dono lines mein [110/2] hai: same AD, same metric, same prefix. Is tie se equal-cost multipath banta hai, aur CEF flow ke hisaab se dono next hops par traffic baantta hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "Which list orders route sources from most trusted to least trusted by default AD?",
        hi: "Kaunsi list route sources ko default AD ke hisaab se sabse trusted se sabse kam trusted tak sahi order mein rakhti hai?",
      },
      options: [
        { en: "Static, connected, EIGRP, OSPF, RIP", hi: "Static, connected, EIGRP, OSPF, RIP" },
        { en: "Connected, static, eBGP, EIGRP, OSPF, RIP", hi: "Connected, static, eBGP, EIGRP, OSPF, RIP" },
        { en: "Connected, static, OSPF, EIGRP, RIP, eBGP", hi: "Connected, static, OSPF, EIGRP, RIP, eBGP" },
        { en: "Connected, eBGP, static, OSPF, EIGRP, RIP", hi: "Connected, eBGP, static, OSPF, EIGRP, RIP" },
      ],
      answer: 1,
      explain: {
        en: "Connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120. A common slip is putting OSPF before EIGRP; EIGRP's 90 is lower, so it is trusted more.",
        hi: "Connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120. Aam galti hai OSPF ko EIGRP se pehle rakhna; EIGRP ka 90 kam hai, isliye us par zyada trust hota hai.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "xSTgb8JLkvs",
      title: "Free CCNA | Dynamic Routing | Day 24",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Watch the parts on metric, ECMP and administrative distance; the protocol overview comes back in lesson 3.5.",
        hi: "Metric, ECMP aur administrative distance wale parts dekho; protocols ka overview lesson 3.5 mein phir aayega.",
      },
    },
    {
      id: "9x_u839WDcs",
      title: "Think Like a Router: Mastering Longest Prefix Match Logic",
      channel: "Wendell Odom's Network Upskill",
      lang: "en",
      note: {
        en: "The author of the CCNA Official Cert Guide works through overlapping routes and longest prefix match.",
        hi: "CCNA Official Cert Guide ke author overlapping routes aur longest prefix match ko step by step samjhaate hain.",
      },
    },
    {
      id: "IMdP2W_u2lM",
      title: "LPM - Longest Prefix Match",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Longest prefix match explained in Hindi.", hi: "Longest prefix match ka Hindi mein explanation." },
    },
    {
      id: "_vQBmwE0tX4",
      title: "What is Administrative Distance in Network Routing",
      channel: "JagvinderThind",
      lang: "hi",
      note: { en: "A short Hindi explanation of administrative distance as the believability of a route.", hi: "Administrative distance, yaani route ki believability, ka chhota Hindi explanation." },
    },
  ],
  lab: {
    title: { en: "Predict R1's choices, then prove them", hi: "R1 ke decisions predict karo, phir prove karo" },
    steps: [
      {
        en: "In Packet Tracer, link R1 to R2 on 172.16.12.0/30 and to R3 on 172.16.13.0/30. R1 is .1 on both links, R2 is 172.16.12.2 and R3 is 172.16.13.2. Bring all interfaces up and check that R1 can ping both neighbours.",
        hi: "Packet Tracer mein R1 ko R2 se 172.16.12.0/30 par aur R3 se 172.16.13.0/30 par jodo. Dono links par R1 .1 hai, R2 172.16.12.2 hai aur R3 172.16.13.2. Saare interfaces up karo aur check karo ki R1 dono neighbours ko ping kar pa raha hai.",
      },
      {
        en: "On R1 add `ip route 10.0.0.0 255.0.0.0 172.16.12.2` and `ip route 10.1.1.0 255.255.255.0 172.16.13.2`.",
        hi: "R1 par `ip route 10.0.0.0 255.0.0.0 172.16.12.2` aur `ip route 10.1.1.0 255.255.255.0 172.16.13.2` add karo.",
      },
      {
        en: "Write down which next hop you expect for 10.1.1.5 and for 10.2.0.1. Check with `show ip route 10.1.1.5` and `show ip route 10.2.0.1`.",
        hi: "Likh lo ki 10.1.1.5 aur 10.2.0.1 ke liye kaunsa next hop expect karte ho. Phir `show ip route 10.1.1.5` aur `show ip route 10.2.0.1` se check karo.",
      },
      {
        en: "Add `ip route 10.1.1.0 255.255.255.0 172.16.12.2 200`. It does not appear in `show ip route`, because the AD 1 route for the same prefix wins. Shut down R1's interface to R3 and look again: the AD 1 route is gone, and `S 10.1.1.0/24 [200/0] via 172.16.12.2` has taken its place.",
        hi: "`ip route 10.1.1.0 255.255.255.0 172.16.12.2 200` add karo. Yeh `show ip route` mein nahi dikhega, kyunki same prefix ka AD 1 wala route jeetta hai. R1 ka R3 wala interface shut down karke dobara dekho: AD 1 wala route gayab hai, aur uski jagah `S 10.1.1.0/24 [200/0] via 172.16.12.2` aa gaya hai.",
      },
      {
        en: "Bring the interface back up, remove the AD 200 route with `no ip route 10.1.1.0 255.255.255.0 172.16.12.2 200`, and add `ip route 10.1.1.0 255.255.255.0 172.16.12.2`. Now find the two `via` lines under `10.1.1.0/24`.",
        hi: "Interface wapas up karo, `no ip route 10.1.1.0 255.255.255.0 172.16.12.2 200` se AD 200 wala route hatao, aur `ip route 10.1.1.0 255.255.255.0 172.16.12.2` add karo. Ab `10.1.1.0/24` ke neeche do `via` lines dhoondho.",
      },
    ],
  },
};

export default lesson;
