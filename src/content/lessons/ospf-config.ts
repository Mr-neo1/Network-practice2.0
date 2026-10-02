import type { Lesson } from "../types.ts";

// Topology used throughout (matches src/anim/scenes/ospf-config.ts):
//   Shared Ethernet segment 10.0.0.0/24 through SW1: R1 Gi0/0 .1, R2 Gi0/0 .2, R3 Gi0/0 .3, R4 Gi0/0 .4
//   LANs on Gi0/1: R1 10.1.1.0/24, R2 10.2.2.0/24, R3 10.3.3.0/24 (each router is .1)
//   R4 Gi0/1 203.0.113.2/30 to the ISP (203.0.113.1), not in OSPF; R4 has a static default route
//   Router IDs 1.1.1.1 to 4.4.4.4 set manually; R2 Gi0/0 has priority 0; all in area 0.

const lesson: Lesson = {
  slug: "ospf-config",
  intro: {
    en: "Knowing how OSPF works is half the job; the other half is making four routers actually run it, picking which interfaces join, who the router ID is, and which router speaks for an Ethernet segment. Most OSPF problems in real networks come from small configuration choices: a wrong wildcard, a passive interface on the wrong side, or an unexpected DR. This lesson configures single-area OSPFv2 and shows you how to prove it works.",
    hi: "OSPF kaise kaam karta hai, yeh jaanna aadha kaam hai; baaki aadha hai chaar routers par use sach mein chalana: kaunse interfaces join karenge, router ID kya hoga, aur Ethernet segment ki taraf se kaunsa router bolega. Real networks mein zyadatar OSPF problems chhote configuration choices se aati hain: galat wildcard, galat taraf passive interface, ya koi unexpected DR. Is lesson mein tum single-area OSPFv2 configure karoge, aur show commands se prove karoge ki woh sahi chal raha hai.",
  },
  outcomes: [
    { en: "Enable OSPF with `router ospf`, wildcard `network` statements or `ip ospf area` on the interface", hi: "`router ospf`, wildcard wale `network` statements ya interface par `ip ospf area` se OSPF enable kar sako" },
    { en: "Predict and set the router ID, and know when a change takes effect", hi: "Router ID predict aur set kar sako, aur jaano ki change kab lagta hai" },
    { en: "Use passive interfaces, a default route, the reference bandwidth and interface cost", hi: "Passive interfaces, default route, reference bandwidth aur interface cost use kar sako" },
    { en: "Predict the DR and BDR on a segment and explain why DROTHERs stay 2-WAY with each other", hi: "Segment par DR aur BDR predict kar sako, aur samjha sako ki DROTHERs aapas mein 2-WAY kyun rehte hain" },
    { en: "Choose between the broadcast and point-to-point network types", hi: "Broadcast aur point-to-point network types mein se sahi chun sako" },
    { en: "Verify OSPF with `show ip ospf neighbor`, `show ip ospf interface`, `show ip protocols` and `show ip route ospf`", hi: "`show ip ospf neighbor`, `show ip ospf interface`, `show ip protocols` aur `show ip route ospf` se OSPF verify kar sako" },
  ],
  sections: [
    {
      id: "turning-it-on",
      heading: { en: "Turning OSPF on: process, network and area", hi: "OSPF on karna: process, network aur area" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Our network: four routers, R1 to R4, share one Ethernet segment, **10.0.0.0/24**, through switch SW1, each on Gi0/0 with address .1 to .4. R1, R2 and R3 each have a user LAN on Gi0/1 (**10.1.1.0/24**, **10.2.2.0/24**, **10.3.3.0/24**). R4's Gi0/1 goes to the ISP. Everything runs in area 0.",
            hi: "Hamara network: chaar routers, R1 se R4, switch SW1 ke through ek hi Ethernet segment **10.0.0.0/24** share karte hain, har ek Gi0/0 par, address .1 se .4 tak. R1, R2 aur R3 ke Gi0/1 par ek ek user LAN hai (**10.1.1.0/24**, **10.2.2.0/24**, **10.3.3.0/24**). R4 ka Gi0/1 ISP ki taraf jaata hai. Sab kuch area 0 mein chalta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "`router ospf 1` starts an OSPF process. The **process ID** (1 to 65535) only matters inside this router, so neighbours do not need the same one. The `network` command then works exactly like the EIGRP one in lesson 3.5: it does not advertise the prefix you type. It looks for **interfaces** whose IP address falls inside the wildcard range, and on each match it (1) sends Hellos out of that interface and (2) advertises that interface's subnet, in the area you name.",
            hi: "`router ospf 1` ek OSPF process start karta hai. **Process ID** (1 se 65535) sirf is router ke andar matter karta hai, isliye neighbours ka same hona zaroori nahi. Phir `network` command bilkul lesson 3.5 ke EIGRP wale jaisa kaam karta hai: jo prefix tum type karte ho, use advertise nahi karta. Woh aise **interfaces** dhoondhta hai jinka IP address wildcard range mein aata hai, aur har match par (1) us interface se Hellos bhejta hai aur (2) us interface ka subnet advertise karta hai, us area mein jo tumne likha.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: OSPF with network statements", hi: "R1: network statements ke saath OSPF" },
          lines: [
            { prompt: "R1(config)#", cmd: "router ospf 1" },
            { prompt: "R1(config-router)#", cmd: "router-id 1.1.1.1", comment: { en: "Set the RID by hand (next section)", hi: "RID haath se set kiya (agla section)" } },
            { prompt: "R1(config-router)#", cmd: "network 10.0.0.0 0.0.0.255 area 0", comment: { en: "Matches Gi0/0, 10.0.0.1", hi: "Gi0/0 (10.0.0.1) match hota hai" } },
            { prompt: "R1(config-router)#", cmd: "network 10.1.1.0 0.0.0.255 area 0", comment: { en: "Matches Gi0/1, 10.1.1.1", hi: "Gi0/1 (10.1.1.1) match hota hai" } },
            { prompt: "R1(config-router)#", cmd: "passive-interface GigabitEthernet0/1", comment: { en: "Only PCs on this LAN: no Hellos needed", hi: "Is LAN par sirf PCs hain: Hellos ki zaroorat nahi" } },
            { out: "%OSPF-5-ADJCHG: Process 1, Nbr 4.4.4.4 on GigabitEthernet0/0 from LOADING to FULL, Loading Done" },
          ],
          note: {
            en: "`network 10.1.1.1 0.0.0.0 area 0` would match exactly one interface address. `network 0.0.0.0 255.255.255.255 area 0` matches every interface, which is quick in a lab but rarely what you want in production: on R4 it would also send Hellos to the ISP.",
            hi: "`network 10.1.1.1 0.0.0.0 area 0` sirf ek interface address match karega. `network 0.0.0.0 255.255.255.255 area 0` har interface match karta hai; lab mein jaldi kaam ho jaata hai, lekin production mein aksar yeh nahi chahiye hota: R4 par isse ISP ki taraf bhi Hellos jaane lagenge.",
          },
        },
        {
          type: "p",
          text: {
            en: "Instead of `network` statements you can enable OSPF directly on each interface with `ip ospf 1 area 0`. It is clearer, because you see the area right in the interface config. If both methods match an interface, the interface command wins.",
            hi: "`network` statements ki jagah tum har interface par seedha `ip ospf 1 area 0` se OSPF enable kar sakte ho. Yeh zyada clear hai, kyunki area interface config mein hi dikh jaata hai. Agar dono methods ek interface ko match karein, toh interface wali command jeetti hai.",
          },
        },
        {
          type: "cli",
          title: { en: "R2: the interface method", hi: "R2: interface method" },
          lines: [
            { prompt: "R2(config)#", cmd: "router ospf 1", comment: { en: "Set the RID before any interface joins", hi: "Koi interface join kare usse pehle RID set karo" } },
            { prompt: "R2(config-router)#", cmd: "router-id 2.2.2.2" },
            { prompt: "R2(config-router)#", cmd: "passive-interface GigabitEthernet0/1" },
            { prompt: "R2(config-router)#", cmd: "interface GigabitEthernet0/0" },
            { prompt: "R2(config-if)#", cmd: "ip ospf 1 area 0", comment: { en: "No network statement needed", hi: "Network statement ki zaroorat nahi" } },
            { prompt: "R2(config-if)#", cmd: "interface GigabitEthernet0/1" },
            { prompt: "R2(config-if)#", cmd: "ip ospf 1 area 0" },
          ],
        },
      ],
    },
    {
      id: "router-id",
      heading: { en: "The router ID", hi: "Router ID" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every LSA and Hello names its router by the RID, so it must be unique and it should not change. When the OSPF process starts, IOS picks the RID in this order:",
            hi: "Har LSA aur Hello router ko RID se pehchanta hai, isliye RID unique hona chahiye aur badalna nahi chahiye. OSPF process start hote waqt IOS RID is order mein chunta hai:",
          },
        },
        {
          type: "steps",
          items: [
            { en: "The value set with the `router-id` command.", hi: "`router-id` command se set ki gayi value." },
            { en: "Otherwise, the highest IP address on an up/up **loopback** interface.", hi: "Woh na ho, toh kisi up/up **loopback** interface ka sabse bada IP address." },
            { en: "Otherwise, the highest IP address on an up/up physical interface.", hi: "Woh bhi na ho, toh kisi up/up physical interface ka sabse bada IP address." },
          ],
        },
        {
          type: "p",
          text: {
            en: "The interface does not need to run OSPF to supply the RID. A loopback wins over a physical interface even if its address is lower: with Lo0 at 10.255.255.1 and Gi0/1 at 203.0.113.2, the RID is 10.255.255.1.",
            hi: "RID dene ke liye interface par OSPF chalna zaroori nahi. Loopback physical interface se jeet jaata hai, chahe uska address chhota ho: Lo0 par 10.255.255.1 aur Gi0/1 par 203.0.113.2 ho, toh RID 10.255.255.1 hoga.",
          },
        },
        {
          type: "cli",
          title: { en: "Changing the RID on a running router", hi: "Chalte router par RID badalna" },
          lines: [
            { prompt: "R3(config)#", cmd: "router ospf 1" },
            { prompt: "R3(config-router)#", cmd: "router-id 3.3.3.3" },
            { out: "% OSPF: Reload or use \"clear ip ospf process\" command, for this to take effect", comment: { en: "Nothing changes yet", hi: "Abhi kuch nahi badla" } },
            { prompt: "R3(config-router)#", cmd: "end" },
            { prompt: "R3#", cmd: "clear ip ospf process" },
            { out: "Reset ALL OSPF processes? [no]: yes", comment: { en: "Every adjacency on R3 drops and re-forms, and R3 loses any DR/BDR role it held", hi: "R3 ki har adjacency tootkar dobara banti hai, aur R3 ka DR/BDR role bhi chala jaata hai" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "clear ip ospf process is disruptive", hi: "clear ip ospf process disruptive hai" },
          text: {
            en: "Resetting the process drops every neighbour on that router for a few seconds. In production, set `router-id` before you enable OSPF so you never need it.",
            hi: "Process reset karne par us router ke saare neighbours kuch second ke liye toot jaate hain. Production mein OSPF enable karne se pehle hi `router-id` set kar do, taaki iski zaroorat hi na pade.",
          },
        },
      ],
    },
    {
      id: "passive-default-cost",
      heading: { en: "Passive interfaces, the default route and cost", hi: "Passive interfaces, default route aur cost" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**`passive-interface`**: the interface's subnet is still advertised, but no Hellos are sent out of it, so no neighbour can form there. Use it on every LAN that has only hosts: it saves traffic and stops a rogue router on that LAN from joining OSPF. `passive-interface default` makes every interface passive; then `no passive-interface GigabitEthernet0/0` re-enables the ones facing routers.",
              hi: "**`passive-interface`**: interface ka subnet advertise hota rehta hai, lekin us se Hellos nahi jaate, isliye wahan koi neighbour nahi ban sakta. Ise har aise LAN par lagao jahan sirf hosts hain: traffic bachta hai aur us LAN par koi rogue router OSPF join nahi kar paata. `passive-interface default` har interface ko passive bana deta hai; phir `no passive-interface GigabitEthernet0/0` se routers ki taraf wale interfaces wapas chalu karo.",
            },
            {
              en: "**`default-information originate`**: R4 has a static default route to the ISP. This command makes R4 advertise 0.0.0.0/0 into OSPF, so the other routers learn it. R4 must have a default route in its own routing table, or nothing is advertised (unless you add the `always` keyword).",
              hi: "**`default-information originate`**: R4 par ISP ki taraf static default route hai. Is command se R4 OSPF mein 0.0.0.0/0 advertise karta hai, aur baaki routers use seekh lete hain. R4 ki apni routing table mein default route hona zaroori hai, warna kuch advertise nahi hota (jab tak `always` keyword na lagao).",
            },
            {
              en: "**`auto-cost reference-bandwidth`**: raises the reference from 100 Mbps so faster links get lower costs. The value is in Mbps. Set the same value on **every** router, or they calculate inconsistent costs.",
              hi: "**`auto-cost reference-bandwidth`**: reference ko 100 Mbps se badhata hai taaki fast links ki cost kam aaye. Value Mbps mein hoti hai. **Har** router par same value set karo, warna sab alag alag costs calculate karenge.",
            },
            {
              en: "**`ip ospf cost`**: sets an interface's cost by hand (1 to 65535) and overrides the bandwidth calculation for that interface only.",
              hi: "**`ip ospf cost`**: interface ki cost haath se set karta hai (1 se 65535), aur sirf us interface ke liye bandwidth wala calculation override karta hai.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "R4: default route and reference bandwidth", hi: "R4: default route aur reference bandwidth" },
          lines: [
            { prompt: "R4(config)#", cmd: "ip route 0.0.0.0 0.0.0.0 203.0.113.1", comment: { en: "Default route to the ISP", hi: "ISP ki taraf default route" } },
            { prompt: "R4(config)#", cmd: "router ospf 1" },
            { prompt: "R4(config-router)#", cmd: "default-information originate" },
            { prompt: "R4(config-router)#", cmd: "auto-cost reference-bandwidth 10000" },
            { out: "% OSPF: Reference bandwidth is changed." },
            { out: "        Please ensure reference bandwidth is consistent across all routers.", comment: { en: "IOS reminds you to repeat it everywhere", hi: "IOS yaad dilata hai ki har jagah lagao" } },
          ],
        },
        {
          type: "table",
          caption: { en: "Interface costs with a 10000 Mbps reference", hi: "10000 Mbps reference par interface costs" },
          columns: [{ en: "Interface", hi: "Interface" }, { en: "Cost at 100 Mbps reference", hi: "100 Mbps reference par cost" }, { en: "Cost at 10000 Mbps reference", hi: "10000 Mbps reference par cost" }],
          rows: [
            ["10 Mbps", "10", "1000"],
            ["100 Mbps", "1", "100"],
            ["1 Gbps", "1", "10"],
            ["10 Gbps", "1", "1"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Three ways to change cost", hi: "Cost badalne ke teen tareeke" },
          text: {
            en: "`ip ospf cost` sets the value directly. `auto-cost reference-bandwidth` changes the formula on the whole router. The interface `bandwidth` command (in kbps) also changes the calculated cost, but other features use that value too and it does not change the real speed, so prefer the first two.",
            hi: "`ip ospf cost` value seedha set karta hai. `auto-cost reference-bandwidth` poore router ka formula badalta hai. Interface ka `bandwidth` command (kbps mein) bhi calculated cost badal deta hai, lekin us value ko doosre features bhi use karte hain aur asli speed nahi badalti, isliye pehle do tareeke behtar hain.",
          },
        },
      ],
    },
    {
      id: "network-types",
      heading: { en: "Network types: broadcast and point-to-point", hi: "Network types: broadcast aur point-to-point" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The OSPF **network type** of an interface decides whether a DR is elected and how neighbours are found. The CCNA needs two:",
            hi: "Interface ka OSPF **network type** decide karta hai ki DR elect hoga ya nahi, aur neighbours kaise milenge. CCNA ke liye do chahiye:",
          },
        },
        {
          type: "table",
          columns: ["", "Broadcast", "Point-to-point"],
          rows: [
            [{ en: "Default on", hi: "Default kahan" }, "Ethernet", { en: "Serial (HDLC, PPP)", hi: "Serial (HDLC, PPP)" }],
            [{ en: "DR/BDR election", hi: "DR/BDR election" }, { en: "Yes", hi: "Haan" }, { en: "No", hi: "Nahi" }],
            [{ en: "Hello / dead", hi: "Hello / dead" }, "10 s / 40 s", "10 s / 40 s"],
            [{ en: "Neighbour state shown", hi: "Neighbour state kaisa dikhta hai" }, "FULL/DR, FULL/BDR, FULL/DROTHER, 2WAY/DROTHER", "FULL/  -"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Many Ethernet links connect exactly two routers, like the /30 links in lesson 3.6. Electing a DR there is pointless and adds the 40-second wait before the adjacency starts. `ip ospf network point-to-point` on both ends removes the election.",
            hi: "Bahut se Ethernet links sirf do routers ko jodte hain, jaise lesson 3.6 ke /30 links. Wahan DR elect karna bekaar hai, aur adjacency shuru hone se pehle 40 second ka wait bhi jud jaata hai. Dono ends par `ip ospf network point-to-point` lagao, election hat jaata hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Set both ends the same", hi: "Dono ends same rakho" },
          text: {
            en: "Hellos do not check the network type, so a broadcast end and a point-to-point end can still reach FULL. But they describe the link differently in their LSAs, and routes across that link do not appear correctly. Always configure both ends alike.",
            hi: "Hellos network type check nahi karte, isliye ek broadcast end aur ek point-to-point end phir bhi FULL tak pahunch sakte hain. Lekin dono apne LSAs mein link ko alag tarah describe karte hain, aur us link ke paar ke routes sahi se nahi aate. Dono ends hamesha ek jaise configure karo.",
          },
        },
      ],
    },
    {
      id: "dr-bdr",
      heading: { en: "DR and BDR election", hi: "DR aur BDR election" },
      blocks: [
        {
          type: "p",
          text: {
            en: "On a shared segment, if every router went FULL with every other one, n routers would need n(n-1)/2 adjacencies: 6 for our four routers, 45 for ten. Each one floods the same LSAs again. So OSPF elects a **DR (Designated Router)** and a **BDR (Backup DR)** per segment. The other routers, **DROTHERs**, go FULL only with the DR and BDR and stay **2-WAY** with each other. That is 2n-3 adjacencies: 5 for our four routers, and 17 instead of 45 for ten.",
            hi: "Shared segment par agar har router har doosre router se FULL ho, toh n routers ko n(n-1)/2 adjacencies chahiye: hamare chaar routers ke liye 6, das ke liye 45. Har adjacency par same LSAs dobara flood hote. Isliye OSPF har segment par ek **DR (Designated Router)** aur ek **BDR (Backup DR)** elect karta hai. Baaki routers, yaani **DROTHERs**, sirf DR aur BDR se FULL hote hain aur aapas mein **2-WAY** rehte hain. Yaani 2n-3 adjacencies: hamare chaar routers ke liye 5, aur das routers ke liye 45 ki jagah sirf 17.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "The highest interface **priority** wins. The default is 1, the range 0 to 255, and **priority 0 means never DR or BDR**. Set it with `ip ospf priority` on the interface.", hi: "Sabse badi interface **priority** jeetti hai. Default 1 hai, range 0 se 255, aur **priority 0 ka matlab kabhi DR ya BDR nahi**. Ise interface par `ip ospf priority` se set karte hain." },
            { en: "On a tie, the highest **router ID** wins. The runner-up becomes BDR.", hi: "Tie ho, toh sabse bada **router ID** jeetta hai. Doosre number wala BDR banta hai." },
            { en: "The election is **not preemptive**. A router that appears later with a higher priority does not take over; it waits until the DR or BDR fails or OSPF is reset.", hi: "Election **preemptive nahi** hai. Baad mein aaya router, chahe uski priority zyada ho, takeover nahi karta; woh tab tak wait karta hai jab tak DR ya BDR fail na ho ya OSPF reset na ho." },
            { en: "When the DR fails, the BDR becomes DR at once and a new BDR is elected.", hi: "DR fail ho, toh BDR turant DR ban jaata hai aur naya BDR elect hota hai." },
          ],
        },
        {
          type: "p",
          text: {
            en: "In our segment R2 has `ip ospf priority 0`. When all four start together, R1, R3 and R4 tie at priority 1, so R4 (4.4.4.4) becomes DR and R3 (3.3.3.3) BDR. When a DROTHER has a new LSA, it sends the LSU to **224.0.0.6** (all DR routers), which only the DR and BDR listen on. The DR then floods it to **224.0.0.5** (all OSPF routers).",
            hi: "Hamare segment mein R2 par `ip ospf priority 0` hai. Jab chaaron ek saath start hote hain, toh R1, R3 aur R4 ki priority 1 par tie hai, isliye R4 (4.4.4.4) DR banta hai aur R3 (3.3.3.3) BDR. Jab kisi DROTHER ke paas naya LSA hota hai, woh LSU **224.0.0.6** (all DR routers) par bhejta hai, jise sirf DR aur BDR sunte hain. Phir DR use **224.0.0.5** (all OSPF routers) par flood karta hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Keeping R2 out of the election", hi: "R2 ko election se bahar rakhna" },
          lines: [
            { prompt: "R2(config)#", cmd: "interface GigabitEthernet0/0" },
            { prompt: "R2(config-if)#", cmd: "ip ospf priority 0", comment: { en: "R2 can never be DR or BDR on this segment", hi: "Is segment par R2 kabhi DR ya BDR nahi banega" } },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Boot order decides labs", hi: "Lab mein boot order decide karta hai" },
          text: {
            en: "The first router to come up on a segment waits 40 seconds for others; if it hears nobody, it makes itself DR. Because there is no preemption, the router that booted first often stays DR even with a lower RID. Exam questions that say \"all routers start at the same time\" want you to apply priority, then RID.",
            hi: "Segment par jo router sabse pehle up hota hai, woh doosron ke liye 40 second wait karta hai; koi na mile toh khud DR ban jaata hai. Preemption nahi hai, isliye jo router pehle boot hua woh chhota RID hone par bhi aksar DR bana rehta hai. Exam mein \"saare routers ek saath start hue\" likha ho, toh pehle priority, phir RID lagao.",
          },
        },
      ],
    },
    {
      id: "verify",
      heading: { en: "Verifying OSPF", hi: "OSPF verify karna" },
      blocks: [
        {
          type: "cli",
          title: { en: "R1's neighbours (before R4 fails in the animation)", hi: "R1 ke neighbours (animation mein R4 fail hone se pehle)" },
          lines: [
            { prompt: "R1#", cmd: "show ip ospf neighbor" },
            { out: "Neighbor ID     Pri   State           Dead Time   Address         Interface" },
            { out: "2.2.2.2           0   2WAY/DROTHER    00:00:34    10.0.0.2        GigabitEthernet0/0", comment: { en: "Two DROTHERs: 2WAY is correct", hi: "Do DROTHERs: 2WAY hi sahi hai" } },
            { out: "3.3.3.3           1   FULL/BDR        00:00:37    10.0.0.3        GigabitEthernet0/0" },
            { out: "4.4.4.4           1   FULL/DR         00:00:39    10.0.0.4        GigabitEthernet0/0" },
          ],
        },
        {
          type: "cli",
          title: { en: "Interface view: role, cost, DR and timers", hi: "Interface view: role, cost, DR aur timers" },
          lines: [
            { prompt: "R1#", cmd: "show ip ospf interface brief" },
            { out: "Interface    PID   Area            IP Address/Mask    Cost  State Nbrs F/C" },
            { out: "Gi0/0        1     0               10.0.0.1/24        1     DROTH 2/3", comment: { en: "FULL with 2 of its 3 neighbours", hi: "3 mein se 2 neighbours ke saath FULL" } },
            { prompt: "R1#", cmd: "show ip ospf interface GigabitEthernet0/0" },
            { out: "  Internet Address 10.0.0.1/24, Area 0, Attached via Network Statement" },
            { out: "  Process ID 1, Router ID 1.1.1.1, Network Type BROADCAST, Cost: 1" },
            { out: "  Transmit Delay is 1 sec, State DROTHER, Priority 1" },
            { out: "  Designated Router (ID) 4.4.4.4, Interface address 10.0.0.4" },
            { out: "  Backup Designated router (ID) 3.3.3.3, Interface address 10.0.0.3" },
            { out: "  Timer intervals configured, Hello 10, Dead 40, Wait 40, Retransmit 5" },
          ],
          note: {
            en: "Both outputs are shortened. On R2, which used `ip ospf 1 area 0`, the Internet Address line ends \"Attached via Interface Enable\" instead.",
            hi: "Dono outputs chhote kiye gaye hain. R2 par, jahan `ip ospf 1 area 0` use hua, Internet Address wali line ke end mein \"Attached via Interface Enable\" aata hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Process settings and learned routes", hi: "Process settings aur seekhe gaye routes" },
          lines: [
            { prompt: "R1#", cmd: "show ip protocols" },
            { out: "Routing Protocol is \"ospf 1\"" },
            { out: "  Router ID 1.1.1.1" },
            { out: "  Routing for Networks:" },
            { out: "    10.0.0.0 0.0.0.255 area 0" },
            { out: "    10.1.1.0 0.0.0.255 area 0" },
            { out: "  Passive Interface(s):" },
            { out: "    GigabitEthernet0/1" },
            { out: "  Distance: (default is 110)" },
            { prompt: "R1#", cmd: "show ip route ospf" },
            { out: "O*E2  0.0.0.0/0 [110/1] via 10.0.0.4, 00:03:41, GigabitEthernet0/0", comment: { en: "R4's default-information originate", hi: "R4 ka default-information originate" } },
            { out: "      10.0.0.0/8 is variably subnetted, 6 subnets, 2 masks" },
            { out: "O        10.2.2.0/24 [110/2] via 10.0.0.2, 00:03:52, GigabitEthernet0/0", comment: { en: "1 (R1 Gi0/0) + 1 (R2 Gi0/1)", hi: "R1 Gi0/0 ka 1 + R2 Gi0/1 ka 1" } },
            { out: "O        10.3.3.0/24 [110/2] via 10.0.0.3, 00:03:52, GigabitEthernet0/0" },
          ],
          note: {
            en: "Costs here use the default reference. After you set 10000 Mbps on every router, each Gigabit interface costs 10 and these routes show [110/20].",
            hi: "Yahan costs default reference se hain. Har router par 10000 Mbps set karne ke baad har Gigabit interface ki cost 10 hogi aur yeh routes [110/20] dikhayenge.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Process ID", def: { en: "The number in `router ospf <id>`; local to the router and does not need to match neighbours.", hi: "`router ospf <id>` wala number; router ka local hota hai aur neighbours se match hona zaroori nahi." } },
    { term: "Router ID", def: { en: "The router's OSPF name: set by `router-id`, else highest up loopback IP, else highest up physical IP.", hi: "Router ka OSPF naam: `router-id` se, warna sabse bada up loopback IP, warna sabse bada up physical IP." } },
    { term: "Passive interface", def: { en: "An OSPF interface that advertises its subnet but sends no Hellos, so no neighbours form on it.", hi: "Aisa OSPF interface jo apna subnet advertise karta hai lekin Hellos nahi bhejta, isliye us par neighbours nahi bante." } },
    { term: "Network type", def: { en: "Interface setting that decides DR/BDR election: broadcast (Ethernet default) elects, point-to-point does not.", hi: "Interface setting jo DR/BDR election decide karti hai: broadcast (Ethernet default) mein election hota hai, point-to-point mein nahi." } },
    { term: "DR", def: { en: "Designated Router: the router every other router on a segment goes FULL with; it floods updates to 224.0.0.5.", hi: "Designated Router: segment ka har doosra router iske saath FULL hota hai; yeh updates 224.0.0.5 par flood karta hai." } },
    { term: "BDR", def: { en: "Backup Designated Router: also FULL with everyone, and takes over at once if the DR fails.", hi: "Backup Designated Router: yeh bhi sabke saath FULL hota hai, aur DR fail ho toh turant takeover karta hai." } },
    { term: "DROTHER", def: { en: "A router on a broadcast segment that is neither DR nor BDR; 2-WAY with other DROTHERs.", hi: "Broadcast segment ka woh router jo na DR hai na BDR; doosre DROTHERs ke saath 2-WAY rehta hai." } },
    { term: "OSPF priority", def: { en: "Per-interface value 0-255 (default 1) used first in the DR/BDR election; 0 means never DR or BDR.", hi: "Interface ki value 0-255 (default 1), DR/BDR election mein sabse pehle dekhi jaati hai; 0 ka matlab kabhi DR ya BDR nahi." } },
  ],
  commands: [
    { cmd: "router ospf 1", mode: "Global configuration", does: { en: "Start OSPF process 1 and enter router configuration mode", hi: "OSPF process 1 start karke router configuration mode mein le jaata hai" } },
    { cmd: "router-id 1.1.1.1", mode: "Router configuration", does: { en: "Set the router ID by hand", hi: "Router ID haath se set karta hai" } },
    { cmd: "network 10.0.0.0 0.0.0.255 area 0", mode: "Router configuration", does: { en: "Enable OSPF in area 0 on interfaces whose IP is in this wildcard range", hi: "Jin interfaces ka IP is wildcard range mein hai, un par area 0 mein OSPF enable karta hai" } },
    { cmd: "ip ospf 1 area 0", mode: "Interface configuration", does: { en: "Enable OSPF process 1 in area 0 on this interface", hi: "Is interface par area 0 mein OSPF process 1 enable karta hai" } },
    { cmd: "passive-interface GigabitEthernet0/1", mode: "Router configuration", does: { en: "Advertise the interface's subnet but send no Hellos out of it", hi: "Interface ka subnet advertise karta hai lekin us se Hellos nahi bhejta" } },
    { cmd: "passive-interface default", mode: "Router configuration", does: { en: "Make every interface passive; undo per interface with `no passive-interface`", hi: "Har interface ko passive bana deta hai; `no passive-interface` se ek ek wapas chalu karo" } },
    { cmd: "ip route 0.0.0.0 0.0.0.0 203.0.113.1", mode: "Global configuration", does: { en: "Static default route towards the ISP", hi: "ISP ki taraf static default route" } },
    { cmd: "default-information originate", mode: "Router configuration", does: { en: "Advertise this router's default route into OSPF", hi: "Is router ka default route OSPF mein advertise karta hai" } },
    { cmd: "auto-cost reference-bandwidth 10000", mode: "Router configuration", does: { en: "Set the reference bandwidth in Mbps; use the same value on every router", hi: "Reference bandwidth Mbps mein set karta hai; har router par same value rakho" } },
    { cmd: "ip ospf cost 50", mode: "Interface configuration", does: { en: "Set this interface's OSPF cost directly", hi: "Is interface ki OSPF cost seedha set karta hai" } },
    { cmd: "ip ospf priority 0", mode: "Interface configuration", does: { en: "Set DR/BDR election priority; 0 means never DR or BDR", hi: "DR/BDR election priority set karta hai; 0 ka matlab kabhi DR ya BDR nahi" } },
    { cmd: "ip ospf network point-to-point", mode: "Interface configuration", does: { en: "Use the point-to-point network type: no DR/BDR election", hi: "Point-to-point network type use karta hai: DR/BDR election nahi hota" } },
    { cmd: "clear ip ospf process", mode: "Privileged EXEC", does: { en: "Restart OSPF so a new router ID or election takes effect (drops adjacencies)", hi: "OSPF restart karta hai taaki naya router ID ya election lage (adjacencies toot jaati hain)" } },
    { cmd: "show ip ospf neighbor", mode: "Privileged EXEC", does: { en: "List neighbours with priority, state/role, dead time and interface", hi: "Neighbours ko priority, state/role, dead time aur interface ke saath dikhata hai" } },
    { cmd: "show ip ospf interface brief", mode: "Privileged EXEC", does: { en: "One line per OSPF interface: area, cost, role and full/total neighbours", hi: "Har OSPF interface ki ek line: area, cost, role aur full/total neighbours" } },
    { cmd: "show ip ospf interface GigabitEthernet0/0", mode: "Privileged EXEC", does: { en: "Detail for one interface: network type, priority, DR, BDR and timers", hi: "Ek interface ki detail: network type, priority, DR, BDR aur timers" } },
    { cmd: "show ip protocols", mode: "Privileged EXEC", does: { en: "Router ID, network statements, passive interfaces and AD of the OSPF process", hi: "OSPF process ka router ID, network statements, passive interfaces aur AD" } },
    { cmd: "show ip route ospf", mode: "Privileged EXEC", does: { en: "Show only OSPF-learned routes", hi: "Sirf OSPF se seekhe routes dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Expecting `router-id` to apply at once on a running process. IOS keeps the old RID until you run `clear ip ospf process` or reload.",
      hi: "Yeh expect karna ki chalte process par `router-id` turant lag jaayega. IOS purana RID tab tak rakhta hai jab tak tum `clear ip ospf process` ya reload na karo.",
    },
    {
      en: "Thinking `network 10.0.0.0 0.0.0.255 area 0` advertises 10.0.0.0/24 on its own. It only enables OSPF on matching interfaces; an interface whose IP matches no statement is not in OSPF at all.",
      hi: "Yeh sochna ki `network 10.0.0.0 0.0.0.255 area 0` apne aap 10.0.0.0/24 advertise kar deta hai. Yeh sirf matching interfaces par OSPF enable karta hai; jis interface ka IP kisi statement se match nahi hota, woh OSPF mein hai hi nahi.",
    },
    {
      en: "Making the interface towards another router passive. The subnet is still advertised, but no Hellos go out, so that adjacency disappears.",
      hi: "Doosre router ki taraf wale interface ko passive bana dena. Subnet advertise hota rehta hai, lekin Hellos nahi jaate, isliye woh adjacency gayab ho jaati hai.",
    },
    {
      en: "Expecting a new router with priority 255 to become DR as soon as it joins. The election is not preemptive; it stays DROTHER until the DR or BDR goes away.",
      hi: "Yeh expect karna ki priority 255 wala naya router join karte hi DR ban jaayega. Election preemptive nahi hai; woh tab tak DROTHER rehta hai jab tak DR ya BDR chala na jaaye.",
    },
    {
      en: "Changing `auto-cost reference-bandwidth` on only one router. Each router then calculates with a different formula and paths become lopsided.",
      hi: "`auto-cost reference-bandwidth` sirf ek router par badalna. Tab har router alag formula se calculate karta hai aur paths ulte-seedhe ho jaate hain.",
    },
    {
      en: "Using `default-information originate` on a router with no default route. Without the route (or the `always` keyword), nothing is advertised.",
      hi: "Bina default route wale router par `default-information originate` lagana. Route na ho (aur `always` keyword na ho), toh kuch advertise nahi hota.",
    },
  ],
  recap: [
    { en: "`router ospf <pid>` (local), then `network <ip> <wildcard> area 0` or `ip ospf <pid> area 0` on the interface. Matching interfaces send Hellos and their subnets are advertised.", hi: "`router ospf <pid>` (local), phir `network <ip> <wildcard> area 0` ya interface par `ip ospf <pid> area 0`. Matching interfaces Hellos bhejte hain aur unke subnets advertise hote hain." },
    { en: "RID order: `router-id`, highest up loopback, highest up physical. A change needs `clear ip ospf process`.", hi: "RID ka order: `router-id`, sabse bada up loopback, sabse bada up physical. Change ke liye `clear ip ospf process` chahiye." },
    { en: "Passive interfaces advertise without Hellos; `default-information originate` shares a default route; set the reference bandwidth the same everywhere.", hi: "Passive interfaces bina Hellos ke advertise karte hain; `default-information originate` default route share karta hai; reference bandwidth har jagah same rakho." },
    { en: "Broadcast (Ethernet) elects DR/BDR; point-to-point (serial) does not. Match both ends.", hi: "Broadcast (Ethernet) par DR/BDR elect hota hai; point-to-point (serial) par nahi. Dono ends match karo." },
    { en: "Election: highest priority (default 1, 0 = never), then highest RID. Not preemptive. BDR replaces a failed DR.", hi: "Election: sabse badi priority (default 1, 0 = kabhi nahi), phir sabse bada RID. Preemptive nahi. Fail hue DR ki jagah BDR aata hai." },
    { en: "DROTHERs: FULL with DR and BDR, 2-WAY with each other. DROTHERs send updates to 224.0.0.6; the DR floods to 224.0.0.5.", hi: "DROTHERs: DR aur BDR se FULL, aapas mein 2-WAY. DROTHERs updates 224.0.0.6 par bhejte hain; DR unhe 224.0.0.5 par flood karta hai." },
  ],
  quiz: [
    {
      q: {
        en: "A router has no `router-id` command. Its interfaces, all up/up, are Lo0 10.255.255.1, Lo1 172.16.0.1, Gi0/0 192.168.1.1 and Gi0/1 203.0.113.2. What is its OSPF router ID?",
        hi: "Ek router par `router-id` command nahi hai. Uske interfaces, sab up/up, hain: Lo0 10.255.255.1, Lo1 172.16.0.1, Gi0/0 192.168.1.1 aur Gi0/1 203.0.113.2. Uska OSPF router ID kya hoga?",
      },
      options: [
        { en: "10.255.255.1", hi: "10.255.255.1" },
        { en: "172.16.0.1", hi: "172.16.0.1" },
        { en: "192.168.1.1", hi: "192.168.1.1" },
        { en: "203.0.113.2", hi: "203.0.113.2" },
      ],
      answer: 1,
      explain: {
        en: "With no manual RID, loopbacks come before physical interfaces, and the highest loopback address wins: 172.16.0.1. 203.0.113.2 is the highest address overall, but it is on a physical interface, which is only used when no loopback is up.",
        hi: "Manual RID nahi hai, toh loopbacks physical interfaces se pehle aate hain, aur sabse bada loopback address jeetta hai: 172.16.0.1. 203.0.113.2 sabse bada address hai, lekin woh physical interface par hai, jo tabhi use hota hai jab koi loopback up na ho.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "Four routers on one Ethernet segment start at the same time. R1: priority 1, RID 1.1.1.1. R2: priority 0, RID 9.9.9.9. R3: priority 10, RID 3.3.3.3. R4: priority 1, RID 4.4.4.4. Which routers become DR and BDR?",
        hi: "Ek Ethernet segment par chaar routers ek saath start hote hain. R1: priority 1, RID 1.1.1.1. R2: priority 0, RID 9.9.9.9. R3: priority 10, RID 3.3.3.3. R4: priority 1, RID 4.4.4.4. DR aur BDR kaun banenge?",
      },
      options: [
        { en: "DR R2, BDR R4", hi: "DR R2, BDR R4" },
        { en: "DR R4, BDR R3", hi: "DR R4, BDR R3" },
        { en: "DR R3, BDR R1", hi: "DR R3, BDR R1" },
        { en: "DR R3, BDR R4", hi: "DR R3, BDR R4" },
      ],
      answer: 3,
      explain: {
        en: "Priority is checked first: R3 (10) is DR. R2 has priority 0, so its high RID does not matter; it can never be DR or BDR. R1 and R4 tie at priority 1, so the higher RID, R4, becomes BDR.",
        hi: "Pehle priority dekhi jaati hai: R3 (10) DR banta hai. R2 ki priority 0 hai, toh uska bada RID kaam nahi aata; woh kabhi DR ya BDR nahi ban sakta. R1 aur R4 priority 1 par tie hain, toh bada RID yaani R4 BDR banta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "On R1, `show ip ospf neighbor` shows `2.2.2.2  0  2WAY/DROTHER  00:00:34  10.0.0.2  GigabitEthernet0/0`. R1 is itself a DROTHER on that segment. What does this mean?",
        hi: "R1 par `show ip ospf neighbor` mein `2.2.2.2  0  2WAY/DROTHER  00:00:34  10.0.0.2  GigabitEthernet0/0` dikhta hai. R1 khud us segment par DROTHER hai. Iska matlab kya hai?",
      },
      options: [
        { en: "This is normal: two DROTHERs stay 2-WAY and go FULL only with the DR and BDR", hi: "Yeh normal hai: do DROTHERs 2-WAY rehte hain aur sirf DR aur BDR se FULL hote hain" },
        { en: "There is an MTU mismatch between R1 and R2", hi: "R1 aur R2 ke beech MTU mismatch hai" },
        { en: "R2's Hello and dead timers do not match R1's", hi: "R2 ke Hello aur dead timers R1 se match nahi karte" },
        { en: "R2 has made Gi0/0 a passive interface", hi: "R2 ne Gi0/0 ko passive interface bana diya hai" },
      ],
      answer: 0,
      explain: {
        en: "DROTHERs never exchange databases with each other, so 2WAY/DROTHER is their final state. An MTU mismatch would show EXSTART or EXCHANGE. Mismatched timers or a passive interface would stop Hellos from being accepted or sent, so R2 would not be listed at all.",
        hi: "DROTHERs aapas mein database exchange nahi karte, isliye 2WAY/DROTHER hi unki final state hai. MTU mismatch hota toh EXSTART ya EXCHANGE dikhta. Timers mismatch ya passive interface hota toh Hellos accept ya send hi nahi hote, aur R2 list mein dikhta hi nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A segment already has a DR and a BDR. An engineer connects a new router, R5, with `ip ospf priority 255`. What happens?",
        hi: "Ek segment par DR aur BDR pehle se hain. Engineer ek naya router R5 jodta hai jis par `ip ospf priority 255` hai. Kya hoga?",
      },
      options: [
        { en: "R5 becomes DR immediately and the old DR becomes BDR", hi: "R5 turant DR ban jaata hai aur purana DR BDR ban jaata hai" },
        { en: "R5 becomes BDR and the old BDR becomes a DROTHER", hi: "R5 BDR ban jaata hai aur purana BDR DROTHER ban jaata hai" },
        { en: "R5 becomes a DROTHER, because the election is not preemptive", hi: "R5 DROTHER banta hai, kyunki election preemptive nahi hai" },
        { en: "R5 cannot form any adjacency until its priority matches the others", hi: "Jab tak R5 ki priority baaki sabse match na ho, woh koi adjacency nahi bana sakta" },
      ],
      answer: 2,
      explain: {
        en: "Once elected, the DR and BDR keep their roles until they fail or OSPF is reset. R5 becomes a DROTHER and goes FULL with the DR and BDR. If the DR later fails, the BDR becomes DR and R5 wins the new BDR election. Priority does not need to match between neighbours.",
        hi: "Ek baar elect hone ke baad DR aur BDR apne roles tab tak rakhte hain jab tak fail na hon ya OSPF reset na ho. R5 DROTHER banta hai aur DR aur BDR se FULL hota hai. Baad mein DR fail ho, toh BDR DR banega aur naye BDR election mein R5 jeetega. Neighbours ke beech priority match hona zaroori nahi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "What does `passive-interface GigabitEthernet0/1` do under `router ospf 1` on R1, where Gi0/1 is 10.1.1.1/24?",
        hi: "R1 par `router ospf 1` ke andar `passive-interface GigabitEthernet0/1` kya karta hai, jahan Gi0/1 ka address 10.1.1.1/24 hai?",
      },
      options: [
        { en: "R1 stops advertising 10.1.1.0/24 but still sends Hellos on Gi0/1", hi: "R1, 10.1.1.0/24 advertise karna band karta hai lekin Gi0/1 par Hellos bhejta rehta hai" },
        { en: "R1 removes Gi0/1 from OSPF completely", hi: "R1, Gi0/1 ko OSPF se poori tarah hata deta hai" },
        { en: "R1 sends Hellos on Gi0/1 but ignores any replies", hi: "R1, Gi0/1 par Hellos bhejta hai lekin replies ignore karta hai" },
        { en: "R1 stops sending Hellos on Gi0/1 but still advertises 10.1.1.0/24", hi: "R1, Gi0/1 par Hellos bhejna band karta hai lekin 10.1.1.0/24 advertise karta rehta hai" },
      ],
      answer: 3,
      explain: {
        en: "A passive interface stays in OSPF, so its subnet is still in R1's LSA, but no Hellos are sent and no neighbour can form on it. That is exactly what you want on a LAN with only PCs.",
        hi: "Passive interface OSPF mein rehta hai, isliye uska subnet R1 ke LSA mein rehta hai, lekin Hellos nahi jaate aur us par koi neighbour nahi ban sakta. Sirf PCs wale LAN par yahi chahiye.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Every router is configured with `auto-cost reference-bandwidth 10000`. What is the OSPF cost of a GigabitEthernet interface?",
        hi: "Har router par `auto-cost reference-bandwidth 10000` configure hai. GigabitEthernet interface ki OSPF cost kya hogi?",
      },
      options: [
        { en: "1", hi: "1" },
        { en: "10", hi: "10" },
        { en: "100", hi: "100" },
        { en: "1000", hi: "1000" },
      ],
      answer: 1,
      explain: {
        en: "The reference is in Mbps: 10000 ÷ 1000 = 10. A 10 Gbps link now costs 1 and a 100 Mbps link 100, so OSPF can finally tell them apart.",
        hi: "Reference Mbps mein hai: 10000 ÷ 1000 = 10. Ab 10 Gbps link ki cost 1 hai aur 100 Mbps link ki 100, toh OSPF aakhirkar dono mein fark kar paata hai.",
      },
      kind: "calc",
    },
  ],
  videos: [
    {
      id: "3ew26ujkiDI",
      title: "Free CCNA | OSPF Part 3 | Day 28",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Network types, the DR/BDR election with priorities, and the neighbour requirements.", hi: "Network types, priorities ke saath DR/BDR election, aur neighbour requirements." },
    },
    {
      id: "LeLRWjfylcs",
      title: "Free CCNA | Configuring OSPF (1) | Day 26 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "A Packet Tracer lab: network statements, passive interfaces, the default route and the show commands.", hi: "Packet Tracer lab: network statements, passive interfaces, default route aur show commands." },
    },
    {
      id: "-pBbN0hwzjU",
      title: "59. Free CCNA (NEW) | OSPF - Single Area OSPF Configuration - Part 1",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Single-area OSPF configuration step by step, in Hindi.", hi: "Single-area OSPF configuration step by step, Hindi mein." },
    },
    {
      id: "3co01FHKPVU",
      title: "66. Free CCNA (NEW) | OSPF - DR & BDR Selection Process in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "How the DR and BDR are chosen: priority, then router ID.", hi: "DR aur BDR kaise chune jaate hain: pehle priority, phir router ID." },
    },
  ],
  lab: {
    title: { en: "Build the segment and break the DR", hi: "Segment banao aur DR ko todo" },
    steps: [
      { en: "In Packet Tracer connect the Gi0/0 of R1, R2, R3 and R4 to one switch (10.0.0.1 to 10.0.0.4, /24). Give R1, R2 and R3 a LAN on Gi0/1 (10.1.1.1/24, 10.2.2.1/24, 10.3.3.1/24).", hi: "Packet Tracer mein R1, R2, R3 aur R4 ke Gi0/0 ko ek switch se jodo (10.0.0.1 se 10.0.0.4, /24). R1, R2 aur R3 ko Gi0/1 par ek LAN do (10.1.1.1/24, 10.2.2.1/24, 10.3.3.1/24)." },
      { en: "Configure OSPF on all four with `router-id`, `network` statements (or `ip ospf 1 area 0`) and `passive-interface` on the LANs. Put `ip ospf priority 0` on R2 Gi0/0.", hi: "Chaaron par `router-id`, `network` statements (ya `ip ospf 1 area 0`) aur LANs par `passive-interface` ke saath OSPF configure karo. R2 ke Gi0/0 par `ip ospf priority 0` lagao." },
      { en: "The DR depends on boot order, so restart all four together: save each config with `copy running-config startup-config`, then click Power Cycle Devices. After about a minute check `show ip ospf neighbor` on R1. Expect R4 FULL/DR, R3 FULL/BDR and R2 2WAY/DROTHER.", hi: "DR boot order par depend karta hai, isliye chaaron ko ek saath restart karo: har router par `copy running-config startup-config` se config save karo, phir Power Cycle Devices click karo. Lagbhag ek minute baad R1 par `show ip ospf neighbor` dekho. R4 FULL/DR, R3 FULL/BDR aur R2 2WAY/DROTHER hona chahiye." },
      { en: "Shut R4's Gi0/0. Within 40 seconds (the dead interval), confirm on R1 that R3 is DR and R1 itself is BDR (`show ip ospf interface brief`).", hi: "R4 ka Gi0/0 shut karo. 40 second (dead interval) ke andar R1 par confirm karo ki R3 DR hai aur R1 khud BDR hai (`show ip ospf interface brief`)." },
      { en: "Bring R4 back with `no shutdown`. It stays DROTHER. Then run `clear ip ospf process` on R3 and on R1 and watch R4 become DR again.", hi: "`no shutdown` se R4 ko wapas lao. Woh DROTHER hi rahega. Phir R3 aur R1 par `clear ip ospf process` chalao aur dekho R4 phir se DR ban jaata hai." },
      { en: "Add a fifth router as the ISP on R4's Gi0/1 (ISP 203.0.113.1/30, R4 203.0.113.2/30). On R4 add `ip route 0.0.0.0 0.0.0.0 203.0.113.1` and `default-information originate`. Check for `O*E2 0.0.0.0/0` on R1.", hi: "R4 ke Gi0/1 par ISP ke roop mein ek paanchwa router jodo (ISP 203.0.113.1/30, R4 203.0.113.2/30). R4 par `ip route 0.0.0.0 0.0.0.0 203.0.113.1` aur `default-information originate` daalo. R1 par `O*E2 0.0.0.0/0` dhoondho." },
    ],
  },
};

export default lesson;
