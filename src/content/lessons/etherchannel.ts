import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "etherchannel",
  intro: {
    en: "One 1 Gbps link between an access switch and its distribution switch soon becomes the bottleneck for everyone on that switch. Adding three more cables looks like the fix, but spanning tree sees four parallel links as a loop and blocks three of them. EtherChannel bundles the cables into one logical link, so all of them forward, traffic is spread across them, and losing one cable costs bandwidth instead of connectivity.",
    hi: "Access switch aur distribution switch ke beech ek 1 Gbps link jaldi hi us switch ke saare users ke liye bottleneck ban jaata hai. Teen aur cables laga do, yeh fix lagta hai, lekin spanning tree chaar parallel links ko loop maanta hai aur teen ko block kar deta hai. EtherChannel in cables ko ek logical link mein bundle kar deta hai, toh saare forward karte hain, traffic unpar bant jaata hai, aur ek cable girne par sirf bandwidth kam hoti hai, connectivity nahi jaati.",
  },
  outcomes: [
    { en: "Explain why parallel links without EtherChannel add no usable bandwidth", hi: "Samjha sako ki EtherChannel ke bina parallel links se usable bandwidth kyun nahi badhti" },
    { en: "Choose LACP, PAgP or static mode, and predict which mode pairs form a channel", hi: "LACP, PAgP ya static mode choose kar sako, aur predict kar sako ki kaunse mode pairs channel banayenge" },
    { en: "List the settings that must match on every member port", hi: "Woh settings bata sako jo har member port par match honi chahiye" },
    { en: "Configure a Layer 2 and a Layer 3 EtherChannel and read `show etherchannel summary`", hi: "Layer 2 aur Layer 3 EtherChannel configure kar sako aur `show etherchannel summary` padh sako" },
    { en: "Explain why load balancing is per flow and how the hash method changes the spread", hi: "Samjha sako ki load balancing per flow kyun hota hai aur hash method se traffic ka batwara kaise badalta hai" },
  ],
  sections: [
    {
      id: "why-bundle",
      heading: { en: "The problem: parallel links and spanning tree", hi: "Problem: parallel links aur spanning tree" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Take SW1, an access switch with 40 users, connected to SW2, the distribution switch, by one 1 Gbps cable on Gi0/1. When everyone backs up files at 6 pm, that uplink is full. The obvious fix is to connect Gi0/2, Gi0/3 and Gi0/4 as well, for 4 Gbps in total.",
            hi: "Maan lo SW1 ek access switch hai jisme 40 users hain, aur woh distribution switch SW2 se Gi0/1 par ek 1 Gbps cable se juda hai. Shaam 6 baje jab sab files backup karte hain, yeh uplink full ho jaata hai. Seedha fix lagta hai: Gi0/2, Gi0/3 aur Gi0/4 bhi jod do, total 4 Gbps.",
          },
        },
        {
          type: "p",
          text: {
            en: "It does not work. Four cables between the same two switches are four Layer 2 paths, which is a loop. A loop is dangerous because an Ethernet frame has no TTL: a broadcast sent into a loop circles forever and multiplies (a broadcast storm). Switches therefore run **Spanning Tree Protocol** (STP), which finds loops and blocks ports to break them. You study STP in detail in the next lessons (2.6 and 2.7); for now you only need its effect here: it keeps one link forwarding and blocks the other three. You paid for 4 Gbps and can use 1 Gbps. And when the forwarding link fails, STP has to bring a blocked port to forwarding, which takes about 30 seconds with classic STP.",
            hi: "Yeh kaam nahi karta. Same do switches ke beech chaar cables matlab chaar Layer 2 paths, yaani loop. Loop khatarnaak hai kyunki Ethernet frame mein TTL nahi hota: loop mein gaya broadcast hamesha ghoomta rehta hai aur badhta jaata hai (broadcast storm). Isliye switches **Spanning Tree Protocol** (STP) chalate hain, jo loops dhoondh kar ports block karke unhe tod deta hai. STP detail mein agle lessons (2.6 aur 2.7) mein padhoge; abhi bas yahan uska effect samjho: woh ek link forwarding rakhta hai aur baaki teen block kar deta hai. Paise 4 Gbps ke diye, use sirf 1 Gbps kar paoge. Upar se jab forwarding link fail hota hai, STP ko ek blocked port forwarding mein laana padta hai, jisme classic STP ko lagbhag 30 second lagte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "**EtherChannel** solves both problems. It groups the physical ports into one logical interface, a **port-channel**. STP, trunking and the MAC address table all see one link, Po1, so nothing is blocked and all four cables carry traffic. If one cable fails, the others keep Po1 up and STP never notices.",
            hi: "**EtherChannel** dono problems solve karta hai. Yeh physical ports ko ek logical interface mein group kar deta hai, jise **port-channel** kehte hain. STP, trunking aur MAC address table, sab ko ek hi link dikhta hai, Po1, isliye kuch block nahi hota aur chaaron cables traffic le jaate hain. Ek cable fail ho toh baaki Po1 ko up rakhte hain aur STP ko pata bhi nahi chalta.",
          },
        },
        {
          type: "table",
          caption: { en: "Four 1 Gbps cables between SW1 and SW2", hi: "SW1 aur SW2 ke beech chaar 1 Gbps cables" },
          columns: [
            { en: "Question", hi: "Sawaal" },
            { en: "Without EtherChannel", hi: "EtherChannel ke bina" },
            { en: "With EtherChannel", hi: "EtherChannel ke saath" },
          ],
          rows: [
            [{ en: "What STP sees", hi: "STP ko kya dikhta hai" }, { en: "4 links, a loop", hi: "4 links, yaani loop" }, { en: "1 link, Po1", hi: "1 link, Po1" }],
            [{ en: "Cables forwarding", hi: "Forwarding cables" }, "1 of 4", "4 of 4"],
            [{ en: "Usable capacity", hi: "Usable capacity" }, "1 Gbps", { en: "4 Gbps, shared by flows", hi: "4 Gbps, flows mein bant kar" }],
            [
              { en: "One cable fails", hi: "Ek cable fail" },
              { en: "Traffic stops until STP unblocks another port", hi: "Jab tak STP doosra port unblock na kare, traffic ruka rehta hai" },
              { en: "Its flows move to the other members; Po1 stays up", hi: "Uske flows baaki members par chale jaate hain; Po1 up rehta hai" },
            ],
          ],
        },
      ],
    },
    {
      id: "names-and-limits",
      heading: { en: "EtherChannel, port-channel, LAG", hi: "EtherChannel, port-channel, LAG" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**EtherChannel** is Cisco's name for the technology. The general term is **link aggregation**, and one bundle is a **LAG** (link aggregation group). Servers do the same with their NICs and call it NIC teaming or bonding.",
              hi: "**EtherChannel** is technology ka Cisco wala naam hai. General term **link aggregation** hai, aur ek bundle ko **LAG** (link aggregation group) kehte hain. Servers apne NICs ke saath yahi karte hain, wahan ise NIC teaming ya bonding bolte hain.",
            },
            {
              en: "The **port-channel** is the logical interface IOS creates for the bundle, for example `interface port-channel 1`, shown as `Po1`. The physical ports inside it are its **member ports**.",
              hi: "**Port-channel** woh logical interface hai jo IOS bundle ke liye banata hai, jaise `interface port-channel 1`, jo `Po1` dikhta hai. Iske andar ke physical ports uske **member ports** kehlaate hain.",
            },
            {
              en: "A bundle can have up to **8 active members**. With LACP you can configure up to 16 ports: 8 are active and the rest wait in hot-standby (flag `H`) to replace a member that fails.",
              hi: "Ek bundle mein maximum **8 active members** ho sakte hain. LACP ke saath 16 ports tak configure kar sakte ho: 8 active rehte hain aur baaki hot-standby (flag `H`) mein wait karte hain, taaki koi member fail ho toh uski jagah le sakein.",
            },
            {
              en: "Po1's bandwidth is the sum of its members: four 1 Gbps ports make a 4 Gbps port-channel. All members must lead to the same switch at the other end (or one logical switch, such as a switch stack).",
              hi: "Po1 ki bandwidth uske members ka total hoti hai: chaar 1 Gbps ports se 4 Gbps ka port-channel banta hai. Saare members doosri taraf same switch par hi jaane chahiye (ya ek logical switch par, jaise switch stack).",
            },
          ],
        },
      ],
    },
    {
      id: "lacp-pagp-static",
      heading: { en: "Three ways to form the bundle: LACP, PAgP, static", hi: "Bundle banane ke teen tareeke: LACP, PAgP, static" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The two switches must agree which ports belong together. A negotiation protocol checks that the far end really is one switch with matching port settings before any traffic is sent over the bundle. That protects you from cabling and configuration mistakes.",
            hi: "Dono switches ko agree karna padta hai ki kaunse ports saath hain. Negotiation protocol bundle par traffic bhejne se pehle check karta hai ki doosri taraf sach mein ek hi switch hai aur uske ports ki settings match karti hain. Isse cabling aur configuration ki galtiyon se bachaav hota hai.",
          },
        },
        {
          type: "table",
          caption: { en: "EtherChannel protocols and their modes", hi: "EtherChannel protocols aur unke modes" },
          columns: ["Protocol", "Standard", "Modes", { en: "Notes", hi: "Notes" }],
          rows: [
            ["LACP", { en: "IEEE 802.3ad (now 802.1AX)", hi: "IEEE 802.3ad (ab 802.1AX)" }, "active, passive", { en: "Works between any vendors. Use it by default.", hi: "Kisi bhi vendor ke beech chalta hai. Default choice yahi rakho." }],
            ["PAgP", { en: "Cisco proprietary", hi: "Cisco proprietary" }, "desirable, auto", { en: "Only between Cisco devices.", hi: "Sirf Cisco devices ke beech." }],
            [{ en: "Static", hi: "Static" }, { en: "None", hi: "Koi nahi" }, "on", { en: "No negotiation at all.", hi: "Koi negotiation nahi hota." }],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**active** (LACP) and **desirable** (PAgP) start the negotiation by sending messages to the other end.",
              hi: "**active** (LACP) aur **desirable** (PAgP) doosri taraf messages bhej kar negotiation shuru karte hain.",
            },
            {
              en: "**passive** (LACP) and **auto** (PAgP) never start, but they answer when the other end starts.",
              hi: "**passive** (LACP) aur **auto** (PAgP) kabhi shuru nahi karte, lekin doosri taraf se shuru ho toh jawab dete hain.",
            },
            {
              en: "**on** forces the ports into the bundle and sends no LACP or PAgP messages.",
              hi: "**on** ports ko zabardasti bundle mein daal deta hai aur koi LACP ya PAgP message nahi bhejta.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Does a channel form? SW1 mode + SW2 mode", hi: "Channel banega? SW1 mode + SW2 mode" },
          columns: ["SW1", "SW2", { en: "Result", hi: "Result" }],
          rows: [
            ["active", "active", { en: "Yes (LACP)", hi: "Haan (LACP)" }],
            ["active", "passive", { en: "Yes (LACP)", hi: "Haan (LACP)" }],
            ["passive", "passive", { en: "No: both wait", hi: "Nahi: dono wait karte hain" }],
            ["desirable", "desirable", { en: "Yes (PAgP)", hi: "Haan (PAgP)" }],
            ["desirable", "auto", { en: "Yes (PAgP)", hi: "Haan (PAgP)" }],
            ["auto", "auto", { en: "No: both wait", hi: "Nahi: dono wait karte hain" }],
            ["on", "on", { en: "Yes (static)", hi: "Haan (static)" }],
            ["on", "active or desirable", { en: "No: on never negotiates", hi: "Nahi: on kabhi negotiate nahi karta" }],
            ["active", "desirable", { en: "No: LACP and PAgP do not talk", hi: "Nahi: LACP aur PAgP aapas mein baat nahi karte" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Learn the pattern, not the table", hi: "Table mat ratto, pattern samjho" },
          text: {
            en: "At least one side must start (active or desirable), both sides must use the same protocol, and on pairs only with on. passive + passive and auto + auto never form a channel.",
            hi: "Kam se kam ek side ko shuru karna hoga (active ya desirable), dono sides ek hi protocol use karein, aur on sirf on ke saath chalta hai. passive + passive aur auto + auto se kabhi channel nahi banta.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Why static on is risky", hi: "Static on risky kyun hai" },
          text: {
            en: "With `on`, a switch bundles its ports without asking the other end anything. If the other end is configured differently, or the cables land on two different switches, the mistake goes undetected and can cause dropped traffic or a Layer 2 loop. LACP catches these mistakes, so it is the safer default.",
            hi: "`on` ke saath switch doosri taraf se kuch pooche bina apne ports bundle kar leta hai. Agar doosri taraf alag configuration hai, ya cables do alag switches par ja rahe hain, toh galti pakdi nahi jaati aur traffic drop ho sakta hai ya Layer 2 loop ban sakta hai. LACP aisi galtiyan pakad leta hai, isliye default ke liye wahi safe hai.",
          },
        },
      ],
    },
    {
      id: "member-rules",
      heading: { en: "What must match on every member port", hi: "Har member port par kya match hona chahiye" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Any frame may be sent on any member, so the members must be interchangeable. IOS compares each port with the others in the group. A port that does not match is left out of the bundle, typically flagged `(s)` suspended.",
            hi: "Koi bhi frame kisi bhi member par ja sakta hai, isliye saare members ek jaise hone chahiye. IOS group ke har port ko baaki ports se compare karta hai. Jo port match nahi karta, woh bundle se bahar rehta hai, aam taur par `(s)` suspended flag ke saath.",
          },
        },
        {
          type: "list",
          items: [
            { en: "The same **speed** and **duplex** (for example, all 1000 Mbps full duplex).", hi: "Same **speed** aur **duplex** (jaise saare 1000 Mbps full duplex)." },
            { en: "The same **switchport mode**: all access ports or all trunks.", hi: "Same **switchport mode**: ya toh saare access ports, ya saare trunks." },
            { en: "Access members: the same **access VLAN**.", hi: "Access members: same **access VLAN**." },
            {
              en: "Trunk members: the same **native VLAN** and the same **allowed VLAN list** (and the same trunk encapsulation on switches that still support ISL).",
              hi: "Trunk members: same **native VLAN** aur same **allowed VLAN list** (aur jin switches par ISL bhi hai, wahan same trunk encapsulation).",
            },
            {
              en: "All **Layer 2** (switchports) or all **Layer 3** (`no switchport`), never a mix.",
              hi: "Ya saare **Layer 2** (switchports), ya saare **Layer 3** (`no switchport`); mix kabhi nahi.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Change the port-channel, not the members", hi: "Members nahi, port-channel badlo" },
          text: {
            en: "Configure the members together with `interface range`. After the bundle exists, make changes such as the allowed VLAN list on `interface port-channel 1`; IOS applies them to every member, which keeps them identical. The channel-group number is local: SW1 can call the bundle Po1 while SW2 calls it Po5.",
            hi: "Members ko `interface range` se ek saath configure karo. Bundle banne ke baad changes, jaise allowed VLAN list, `interface port-channel 1` par karo; IOS unhe har member par laga deta hai, toh sab ek jaise rehte hain. Channel-group number local hota hai: SW1 bundle ko Po1 bol sakta hai aur SW2 usi ko Po5.",
          },
        },
      ],
    },
    {
      id: "load-balancing",
      heading: { en: "Load balancing is per flow, not per packet", hi: "Load balancing per flow hota hai, per packet nahi" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A switch does not send frame 1 on Gi0/1, frame 2 on Gi0/2 and so on; frames of one conversation could then arrive out of order. Instead it runs a **hash** on chosen address fields of each frame, and the result picks one member. Frames with the same fields always give the same result, so one flow always uses one member.",
            hi: "Switch aisa nahi karta ki frame 1 Gi0/1 par, frame 2 Gi0/2 par, aur aage aise hi; tab ek conversation ke frames ulte-seedhe order mein pahunch sakte hain. Iske bajaye woh har frame ke kuch address fields par **hash** chalata hai, aur result ek member chunta hai. Same fields ka result hamesha same hota hai, isliye ek flow hamesha ek hi member use karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Methods for `port-channel load-balance`", hi: "`port-channel load-balance` ke methods" },
          columns: [{ en: "Method", hi: "Method" }, { en: "Fields hashed", hi: "Kin fields ka hash" }],
          rows: [
            ["src-mac", { en: "Source MAC", hi: "Source MAC" }],
            ["dst-mac", { en: "Destination MAC", hi: "Destination MAC" }],
            ["src-dst-mac", { en: "Source and destination MAC", hi: "Source aur destination MAC" }],
            ["src-ip", { en: "Source IP", hi: "Source IP" }],
            ["dst-ip", { en: "Destination IP", hi: "Destination IP" }],
            ["src-dst-ip", { en: "Source and destination IP", hi: "Source aur destination IP" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "The default depends on the platform; a Catalyst 2960 uses `src-mac`. Change it in global configuration with `port-channel load-balance src-dst-ip` and check it with `show etherchannel load-balance`. Each switch hashes only the frames it sends, so the two directions of one conversation may use different members.",
            hi: "Default platform par depend karta hai; Catalyst 2960 `src-mac` use karta hai. Global configuration mein `port-channel load-balance src-dst-ip` se badlo aur `show etherchannel load-balance` se check karo. Har switch sirf apne bheje hue frames ka hash karta hai, isliye ek hi conversation ki dono directions alag members use kar sakti hain.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of a toll plaza", hi: "Toll plaza socho" },
          text: {
            en: "Four booths, and each car is sent to a booth by the last digit of its number plate. Four times as many cars get through, but one car still uses one booth. And if most cars share the same digit, one queue gets long while the others stay empty.",
            hi: "Chaar booths hain, aur har car ko number plate ke last digit se booth milta hai. Chaar guna zyada cars nikal jaati hain, lekin ek car phir bhi ek hi booth use karti hai. Aur agar zyadatar cars ka digit same hai, toh ek line lambi ho jaati hai aur baaki khaali padi rehti hain.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "One big transfer never gets 4 Gbps", hi: "Ek badi transfer ko kabhi 4 Gbps nahi milega" },
          text: {
            en: "Every frame of a single file copy between two hosts hashes to the same member, so that copy is limited to one member's speed. The spread is also poor when there is little variety: if most traffic goes to one router, `dst-mac` gives the same answer for almost every frame and loads one member while the rest idle.",
            hi: "Do hosts ke beech ek file copy ka har frame same member par hash hota hai, isliye woh copy ek member ki speed tak hi limited hai. Jab variety kam ho tab bhi batwara kharab hota hai: agar zyadatar traffic ek hi router ko jaa raha hai, toh `dst-mac` lagbhag har frame ke liye same jawab deta hai, ek member full aur baaki khaali.",
          },
        },
      ],
    },
    {
      id: "configure-verify",
      heading: { en: "Configure and verify a Layer 2 EtherChannel", hi: "Layer 2 EtherChannel configure aur verify karna" },
      blocks: [
        {
          type: "cli",
          title: { en: "SW1: LACP active on Gi0/1-4, then make Po1 a trunk", hi: "SW1: Gi0/1-4 par LACP active, phir Po1 ko trunk banao" },
          lines: [
            { prompt: "SW1(config)#", cmd: "interface range gigabitethernet0/1 - 4" },
            { prompt: "SW1(config-if-range)#", cmd: "channel-group 1 mode active", comment: { en: "Join group 1 and start LACP", hi: "Group 1 join karo aur LACP shuru karo" } },
            { out: "Creating a port-channel interface Port-channel 1" },
            { prompt: "SW1(config-if-range)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "interface port-channel 1" },
            { prompt: "SW1(config-if)#", cmd: "switchport mode trunk", comment: { en: "Applied to all four members too", hi: "Chaaron members par bhi lag jaata hai" } },
          ],
          note: {
            en: "On SW2 use the same commands with `mode passive` (or `active`). On switches that also support ISL, add `switchport trunk encapsulation dot1q` before `switchport mode trunk`.",
            hi: "SW2 par yahi commands `mode passive` (ya `active`) ke saath chalao. Jin switches par ISL bhi support hota hai, wahan `switchport mode trunk` se pehle `switchport trunk encapsulation dot1q` lagao.",
          },
        },
        {
          type: "cli",
          title: { en: "Verify the bundle", hi: "Bundle verify karo" },
          lines: [
            { prompt: "SW1#", cmd: "show etherchannel summary" },
            { out: "Flags:  D - down        P - bundled in port-channel" },
            { out: "        I - stand-alone s - suspended" },
            { out: "        H - Hot-standby (LACP only)" },
            { out: "        R - Layer3      S - Layer2" },
            { out: "        U - in use      f - failed to allocate aggregator" },
            { out: "Number of channel-groups in use: 1" },
            { out: "Number of aggregators:           1" },
            { out: " " },
            { out: "Group  Port-channel  Protocol    Ports" },
            { out: "------+-------------+-----------+-----------------------------------------------" },
            { out: "1      Po1(SU)         LACP      Gi0/1(P)    Gi0/2(P)    Gi0/3(P)", comment: { en: "SU: Layer 2, in use", hi: "SU: Layer 2 aur in use" } },
            { out: "                                 Gi0/4(P)", comment: { en: "P: bundled member", hi: "P: member bundle mein hai" } },
          ],
          note: {
            en: "`Po1(SD)` would mean the Layer 2 port-channel is down, usually because no member is bundled. Check the member flags to see why.",
            hi: "`Po1(SD)` ka matlab hota Layer 2 port-channel down hai, aam taur par kyunki koi member bundle nahi hua. Wajah jaanne ke liye member flags dekho.",
          },
        },
        {
          type: "table",
          caption: { en: "Flags you must recognise", hi: "Yeh flags pehchanna zaroori hai" },
          columns: [{ en: "Flag", hi: "Flag" }, { en: "Meaning", hi: "Matlab" }],
          rows: [
            ["P", { en: "Member bundled in the port-channel and working", hi: "Member port-channel mein bundled hai aur kaam kar raha hai" }],
            ["D", { en: "Down (cable unplugged or port shut down)", hi: "Down (cable nikla hua ya port shutdown)" }],
            ["s", { en: "Suspended: its settings do not match the others", hi: "Suspended: iski settings baaki se match nahi karti" }],
            ["I", { en: "Stand-alone: not bundled, working as a separate port", hi: "Stand-alone: bundle mein nahi, alag port ki tarah kaam kar raha hai" }],
            ["SU / SD", { en: "Layer 2 port-channel, up (in use) / down", hi: "Layer 2 port-channel: up (in use) ya down" }],
            ["RU", { en: "Layer 3 port-channel, in use", hi: "Layer 3 port-channel, in use" }],
          ],
        },
      ],
    },
    {
      id: "layer3-etherchannel",
      heading: { en: "Layer 3 EtherChannel", hi: "Layer 3 EtherChannel" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Between two Layer 3 switches you often want a routed link instead of a trunk, for example a point-to-point link running OSPF. Then the port-channel itself is a routed interface with an IP address. Use `no switchport` on the port-channel and on every member, and put the IP address on the port-channel only.",
            hi: "Do Layer 3 switches ke beech aksar trunk ki jagah routed link chahiye hota hai, jaise OSPF chalane wala point-to-point link. Tab port-channel khud ek routed interface hota hai jiska IP address hota hai. Port-channel aur har member par `no switchport` lagao, aur IP address sirf port-channel par do.",
          },
        },
        {
          type: "cli",
          title: { en: "DSW1: routed Po2 towards DSW2", hi: "DSW1: DSW2 ki taraf routed Po2" },
          lines: [
            { prompt: "DSW1(config)#", cmd: "interface port-channel 2" },
            { prompt: "DSW1(config-if)#", cmd: "no switchport" },
            { prompt: "DSW1(config-if)#", cmd: "ip address 10.0.12.1 255.255.255.252" },
            { prompt: "DSW1(config-if)#", cmd: "exit" },
            { prompt: "DSW1(config)#", cmd: "interface range gigabitethernet1/0/23 - 24" },
            { prompt: "DSW1(config-if-range)#", cmd: "no switchport", comment: { en: "Members must be routed ports too", hi: "Members bhi routed ports hone chahiye" } },
            { prompt: "DSW1(config-if-range)#", cmd: "channel-group 2 mode active" },
            { prompt: "DSW1(config-if-range)#", cmd: "end" },
            { prompt: "DSW1#", cmd: "show etherchannel summary | begin Group" },
            { out: "Group  Port-channel  Protocol    Ports" },
            { out: "------+-------------+-----------+-----------------------------------------------" },
            { out: "2      Po2(RU)         LACP      Gi1/0/23(P) Gi1/0/24(P)", comment: { en: "R = Layer 3, U = in use", hi: "R matlab Layer 3, U matlab in use" } },
          ],
          note: {
            en: "DSW2 gets the mirror configuration with 10.0.12.2/30. To OSPF and the routing table, Po2 is one interface.",
            hi: "DSW2 par ulti taraf ki same configuration hogi, 10.0.12.2/30 ke saath. OSPF aur routing table ke liye Po2 ek hi interface hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "EtherChannel", def: { en: "Cisco's name for bundling parallel Ethernet links into one logical link.", hi: "Parallel Ethernet links ko ek logical link mein bundle karne ka Cisco wala naam." } },
    { term: "Port-channel", def: { en: "The logical interface (Po1, Po2) that represents the bundle in IOS.", hi: "Woh logical interface (Po1, Po2) jo IOS mein bundle ko represent karta hai." } },
    { term: "Member port", def: { en: "A physical port that is part of a port-channel.", hi: "Woh physical port jo kisi port-channel ka hissa hai." } },
    { term: "LACP", def: { en: "Link Aggregation Control Protocol, the IEEE 802.3ad negotiation protocol, with active and passive modes.", hi: "Link Aggregation Control Protocol, IEEE 802.3ad ka negotiation protocol, jisme active aur passive modes hain." } },
    { term: "PAgP", def: { en: "Port Aggregation Protocol, Cisco's own negotiation protocol, with desirable and auto modes.", hi: "Port Aggregation Protocol, Cisco ka apna negotiation protocol, jisme desirable aur auto modes hain." } },
    { term: "Static EtherChannel", def: { en: "A bundle built with mode on at both ends, with no negotiation.", hi: "Dono ends par mode on se bana bundle, bina kisi negotiation ke." } },
    { term: "Load-balancing hash", def: { en: "The calculation on address fields that picks which member carries a frame.", hi: "Address fields par hone wali calculation jo decide karti hai ki frame kaunsa member le jaayega." } },
    { term: "Layer 3 EtherChannel", def: { en: "A routed port-channel with an IP address, built from no switchport members.", hi: "IP address wala routed port-channel, jo no switchport members se banta hai." } },
  ],
  commands: [
    { cmd: "interface range gigabitethernet0/1 - 4", mode: "Global config", does: { en: "Configure several ports at once", hi: "Kai ports ek saath configure karo" } },
    { cmd: "channel-group 1 mode active | passive", mode: "Interface config", does: { en: "Add the port to group 1 using LACP", hi: "Port ko LACP ke saath group 1 mein daalo" } },
    { cmd: "channel-group 1 mode desirable | auto", mode: "Interface config", does: { en: "Add the port to group 1 using PAgP", hi: "Port ko PAgP ke saath group 1 mein daalo" } },
    { cmd: "channel-group 1 mode on", mode: "Interface config", does: { en: "Add the port to group 1 with no negotiation", hi: "Port ko bina negotiation ke group 1 mein daalo" } },
    { cmd: "interface port-channel 1", mode: "Global config", does: { en: "Configure the logical bundle interface", hi: "Logical bundle interface configure karo" } },
    { cmd: "no switchport", mode: "Interface config (Layer 3 switch)", does: { en: "Make the port a routed port for a Layer 3 EtherChannel", hi: "Layer 3 EtherChannel ke liye port ko routed port banao" } },
    { cmd: "port-channel load-balance src-dst-ip", mode: "Global config", does: { en: "Choose the fields hashed to pick a member", hi: "Member chunne ke liye kin fields ka hash ho, yeh set karo" } },
    { cmd: "show etherchannel summary", mode: "Privileged EXEC", does: { en: "List port-channels, protocols and member flags", hi: "Port-channels, protocols aur member flags dikhata hai" } },
    { cmd: "show etherchannel load-balance", mode: "Privileged EXEC", does: { en: "Show the load-balancing method in use", hi: "Kaunsa load-balancing method chal raha hai, dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Setting passive on both ends, or auto on both ends. Neither side starts, so no channel forms. At least one end must be active (LACP) or desirable (PAgP).",
      hi: "Dono ends par passive, ya dono par auto lagana. Koi side shuru nahi karti, isliye channel nahi banta. Kam se kam ek end active (LACP) ya desirable (PAgP) hona chahiye.",
    },
    {
      en: "Mixing protocols, such as active on SW1 and desirable on SW2. LACP and PAgP do not interoperate; use the same protocol at both ends.",
      hi: "Protocols mix karna, jaise SW1 par active aur SW2 par desirable. LACP aur PAgP ek doosre ke saath kaam nahi karte; dono ends par same protocol use karo.",
    },
    {
      en: "Pairing on with active or desirable. on sends no negotiation messages, so it only works with on at the other end.",
      hi: "on ko active ya desirable ke saath pair karna. on koi negotiation message nahi bhejta, isliye woh sirf doosri taraf on ke saath hi chalta hai.",
    },
    {
      en: "Expecting one large transfer to use the whole bundle. Load balancing is per flow, so one flow is limited to one member.",
      hi: "Yeh expect karna ki ek badi transfer poora bundle use karegi. Load balancing per flow hota hai, isliye ek flow ek member tak limited hai.",
    },
    {
      en: "Changing one member by hand, for example a different allowed VLAN list. That port is suspended `(s)`. Make changes on the port-channel interface instead.",
      hi: "Ek member ko alag se badalna, jaise alag allowed VLAN list. Woh port suspended `(s)` ho jaata hai. Changes port-channel interface par karo.",
    },
    {
      en: "Putting the IP address on a member of a Layer 3 EtherChannel. The IP goes on the port-channel, and every member needs `no switchport`.",
      hi: "Layer 3 EtherChannel ke member par IP address daalna. IP port-channel par jaata hai, aur har member par `no switchport` chahiye.",
    },
  ],
  recap: [
    { en: "Without EtherChannel, STP blocks all but one parallel link. With it, STP sees one port-channel and every member forwards.", hi: "EtherChannel ke bina STP ek ko chhod kar saare parallel links block karta hai. EtherChannel ke saath STP ko ek port-channel dikhta hai aur har member forward karta hai." },
    { en: "LACP (IEEE 802.3ad): active/passive. PAgP (Cisco): desirable/auto. Static: on, only with on.", hi: "LACP (IEEE 802.3ad): active/passive. PAgP (Cisco): desirable/auto. Static: on, sirf on ke saath." },
    { en: "A channel forms when at least one side starts and both use the same protocol; passive + passive and auto + auto fail.", hi: "Channel tab banta hai jab kam se kam ek side shuru kare aur dono same protocol use karein; passive + passive aur auto + auto fail hote hain." },
    { en: "Members must match speed, duplex, switchport mode, access VLAN or trunk native and allowed VLANs, and Layer 2 vs Layer 3.", hi: "Members mein speed, duplex, switchport mode, access VLAN ya trunk ke native aur allowed VLANs, aur Layer 2 vs Layer 3 match hona chahiye." },
    { en: "Load balancing hashes each frame (src-mac, src-dst-ip, ...) so one flow always uses one member.", hi: "Load balancing har frame ka hash karta hai (src-mac, src-dst-ip, ...), isliye ek flow hamesha ek hi member use karta hai." },
    { en: "`show etherchannel summary`: Po1(SU) is a working Layer 2 bundle, RU is Layer 3; members show P bundled, D down, s suspended.", hi: "`show etherchannel summary`: Po1(SU) matlab chalta hua Layer 2 bundle, RU matlab Layer 3; members par P bundled, D down, s suspended." },
  ],
  quiz: [
    {
      q: {
        en: "SW1 and SW2 are connected by four 1 Gbps links with no EtherChannel configured, and STP is running. How much bandwidth can SW1 use to send frames to SW2?",
        hi: "SW1 aur SW2 chaar 1 Gbps links se jude hain, koi EtherChannel configure nahi hai, aur STP chal raha hai. SW1 frames bhejne ke liye SW2 tak kitni bandwidth use kar sakta hai?",
      },
      options: [
        { en: "4 Gbps, spread over all four links", hi: "4 Gbps, chaaron links par bant kar" },
        { en: "1 Gbps, because STP blocks three of the links", hi: "1 Gbps, kyunki STP teen links block kar deta hai" },
        { en: "2 Gbps, because STP blocks half of the links", hi: "2 Gbps, kyunki STP aadhe links block karta hai" },
        { en: "None, because the loop shuts all four links down", hi: "Kuch nahi, kyunki loop chaaron links ko band kar deta hai" },
      ],
      answer: 1,
      explain: {
        en: "STP sees four parallel paths between the same two switches as a loop and leaves exactly one forwarding. EtherChannel is what turns them into one logical link that STP does not block.",
        hi: "STP same do switches ke beech chaar parallel paths ko loop maanta hai aur sirf ek ko forwarding chhodta hai. Inhe ek logical link banana, jise STP block na kare, yahi EtherChannel ka kaam hai.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which pair of modes will NOT form an EtherChannel?", hi: "Kaunse mode pair se EtherChannel NAHI banega?" },
      options: [
        { en: "active / passive", hi: "active / passive" },
        { en: "desirable / auto", hi: "desirable / auto" },
        { en: "passive / passive", hi: "passive / passive" },
        { en: "on / on", hi: "on / on" },
      ],
      answer: 2,
      explain: {
        en: "passive ports answer LACP but never start it, so two passive ends wait for each other forever. active/passive and desirable/auto work because one side starts; on/on works because neither side negotiates.",
        hi: "passive ports LACP ka jawab dete hain par kabhi shuru nahi karte, isliye do passive ends ek doosre ka wait karte reh jaate hain. active/passive aur desirable/auto chalte hain kyunki ek side shuru karti hai; on/on chalta hai kyunki koi side negotiate hi nahi karti.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "`show etherchannel summary` on SW1 shows `1  Po1(SU)  LACP  Gi0/1(P) Gi0/2(P) Gi0/3(s) Gi0/4(P)`. What is the most likely reason for the flag on Gi0/3?",
        hi: "SW1 par `show etherchannel summary` mein `1  Po1(SU)  LACP  Gi0/1(P) Gi0/2(P) Gi0/3(s) Gi0/4(P)` dikhta hai. Gi0/3 ke flag ki sabse likely wajah kya hai?",
      },
      options: [
        { en: "The cable on Gi0/3 is unplugged", hi: "Gi0/3 ka cable nikla hua hai" },
        { en: "Gi0/3 is waiting in LACP hot-standby", hi: "Gi0/3 LACP hot-standby mein wait kar raha hai" },
        { en: "Po1 has become a Layer 3 port-channel", hi: "Po1 Layer 3 port-channel ban gaya hai" },
        { en: "Gi0/3's settings, such as its allowed VLAN list, differ from the other members", hi: "Gi0/3 ki settings, jaise allowed VLAN list, baaki members se alag hain" },
      ],
      answer: 3,
      explain: {
        en: "(s) means suspended: the port does not match the rest of the group, so IOS keeps it out of the bundle. An unplugged cable shows (D), hot-standby shows (H), and a Layer 3 channel would show R instead of S.",
        hi: "(s) ka matlab suspended: port baaki group se match nahi karta, isliye IOS use bundle se bahar rakhta hai. Cable nikla ho toh (D) dikhta, hot-standby par (H), aur Layer 3 channel mein S ki jagah R hota.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A server copies a 50 GB backup to one storage array across Po1, which has four 1 Gbps members and uses src-dst-ip load balancing. What is the most that single copy can reach?",
        hi: "Ek server 50 GB ka backup ek storage array par Po1 ke through copy karta hai. Po1 mein chaar 1 Gbps members hain aur src-dst-ip load balancing hai. Yeh ek copy maximum kitni speed tak ja sakti hai?",
      },
      options: [
        { en: "About 1 Gbps", hi: "Lagbhag 1 Gbps" },
        { en: "About 2 Gbps", hi: "Lagbhag 2 Gbps" },
        { en: "About 4 Gbps", hi: "Lagbhag 4 Gbps" },
        { en: "It depends on how many VLANs the trunk carries", hi: "Yeh trunk par kitne VLANs hain, us par depend karta hai" },
      ],
      answer: 0,
      explain: {
        en: "Every frame of the copy has the same source and destination IP, so every frame hashes to the same member. One flow is limited to one member's 1 Gbps; the other members serve other flows.",
        hi: "Copy ke har frame ka source aur destination IP same hai, isliye har frame same member par hash hota hai. Ek flow ek member ke 1 Gbps tak limited hai; baaki members doosre flows ke kaam aate hain.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "You are building a Layer 3 EtherChannel between two multilayer switches. Where does the IP address go?",
        hi: "Tum do multilayer switches ke beech Layer 3 EtherChannel bana rahe ho. IP address kahan jaayega?",
      },
      options: [
        { en: "On each member port, one address per cable", hi: "Har member port par, har cable ka ek address" },
        { en: "On the lowest-numbered member only", hi: "Sirf sabse chhote number wale member par" },
        { en: "On the port-channel interface, with no switchport on it and on the members", hi: "Port-channel interface par; port-channel aur members dono par no switchport" },
        { en: "On an SVI in the VLAN the members belong to", hi: "Us VLAN ke SVI par jisme members hain" },
      ],
      answer: 2,
      explain: {
        en: "In a Layer 3 EtherChannel the port-channel is the routed interface, so it holds the one IP address. Members are routed ports too (no switchport) but carry no address. An SVI is the Layer 2 approach, not a routed port-channel.",
        hi: "Layer 3 EtherChannel mein port-channel hi routed interface hai, isliye ek IP address usi par hota hai. Members bhi routed ports (no switchport) hote hain par unpar koi address nahi hota. SVI Layer 2 wala tareeka hai, routed port-channel nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "Po1 between SW1 and SW2 has four active members. The cable on Gi0/2 is cut. What happens?",
        hi: "SW1 aur SW2 ke beech Po1 mein chaar active members hain. Gi0/2 ka cable kat jaata hai. Kya hoga?",
      },
      options: [
        { en: "STP blocks Po1 and recalculates the tree", hi: "STP Po1 ko block karke tree dobara calculate karta hai" },
        { en: "Po1 stays up, and flows that used Gi0/2 move to the remaining members", hi: "Po1 up rehta hai, aur jo flows Gi0/2 use kar rahe the woh baaki members par chale jaate hain" },
        { en: "Po1 goes down until the cable is replaced", hi: "Cable badalne tak Po1 down ho jaata hai" },
        { en: "Every flow stops until LACP renegotiates all members", hi: "Jab tak LACP saare members dobara negotiate na kare, har flow ruk jaata hai" },
      ],
      answer: 1,
      explain: {
        en: "The switches remove the failed member and re-hash its flows onto the members still up. Po1 stays up with less bandwidth, so STP sees no topology change. Po1 goes down only when every member is down.",
        hi: "Switches fail hue member ko hata dete hain aur uske flows ko bache hue members par dobara hash karte hain. Po1 kam bandwidth ke saath up rehta hai, isliye STP ko koi topology change nahi dikhta. Po1 tabhi down hota hai jab saare members down hon.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "xuo69Joy_Nc",
      title: "Free CCNA | EtherChannel | Day 23",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "The full lecture: why STP blocks parallel links, PAgP, LACP, static mode, load balancing and Layer 3 EtherChannel.",
        hi: "Poora lecture: STP parallel links kyun block karta hai, PAgP, LACP, static mode, load balancing aur Layer 3 EtherChannel.",
      },
    },
    {
      id: "8gKF2fMMjA8",
      title: "Free CCNA | Configuring EtherChannel | Day 23 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The matching Packet Tracer lab, with show etherchannel summary after each step.", hi: "Iska Packet Tracer lab, har step ke baad show etherchannel summary ke saath." },
    },
    {
      id: "o2MJ1OqiNTc",
      title: "93. Free CCNA (NEW) | Ether Channel in Hindi - LACP in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "EtherChannel, port-channel, LACP and PAgP explained in Hindi.", hi: "EtherChannel, port-channel, LACP aur PAgP ka Hindi mein explanation." },
    },
    {
      id: "bNo9CHSJErI",
      title: "What is EtherChannel in Hindi",
      channel: "PyNet Labs",
      lang: "hi",
      note: { en: "A shorter Hindi version: the protocols, then a quick lab from 06:04.", hi: "Chhota Hindi version: pehle protocols, phir 06:04 se ek quick lab." },
    },
  ],
  lab: {
    title: { en: "Bundle four links in Packet Tracer", hi: "Packet Tracer mein chaar links bundle karo" },
    steps: [
      {
        en: "Place two 2960 switches and connect Fa0/1-Fa0/4 on SW1 to Fa0/1-Fa0/4 on SW2 with four copper cables. Wait until all link lights turn green or amber.",
        hi: "Do 2960 switches rakho aur SW1 ke Fa0/1-Fa0/4 ko SW2 ke Fa0/1-Fa0/4 se chaar copper cables se jodo. Saari link lights green ya amber hone tak ruko.",
      },
      {
        en: "Run `show spanning-tree` on both switches. On one of them, three of the four ports show `BLK`: STP has blocked them.",
        hi: "Dono switches par `show spanning-tree` chalao. Ek switch par chaar mein se teen ports `BLK` dikhayenge: STP ne unhe block kar diya hai.",
      },
      {
        en: "On SW1 enter `interface range fa0/1 - 4` and `channel-group 1 mode active`. On SW2 do the same with `mode passive`.",
        hi: "SW1 par `interface range fa0/1 - 4` aur `channel-group 1 mode active` do. SW2 par yahi `mode passive` ke saath karo.",
      },
      {
        en: "Run `show etherchannel summary` on both switches and find `Po1(SU)` with four `(P)` members. Run `show spanning-tree` again: only Po1 is listed now.",
        hi: "Dono switches par `show etherchannel summary` chalao aur `Po1(SU)` ke saath chaar `(P)` members dhoondho. `show spanning-tree` dobara chalao: ab sirf Po1 dikhega.",
      },
      {
        en: "Make Po1 a trunk on both switches with `interface port-channel 1` and `switchport mode trunk`, then check `show interfaces trunk`.",
        hi: "Dono switches par `interface port-channel 1` aur `switchport mode trunk` se Po1 ko trunk banao, phir `show interfaces trunk` check karo.",
      },
      {
        en: "Shut down Fa0/3 on SW1 and find the `(D)` flag while Po1 stays `(SU)`, then `no shutdown` it again. Finally set SW1's four ports to `channel-group 1 mode passive` too: no member reaches `(P)`, Po1 goes down `(SD)`, and STP blocks three ports again.",
        hi: "SW1 par Fa0/3 shutdown karo aur `(D)` flag dhoondho, jabki Po1 `(SU)` hi rehta hai, phir use wapas `no shutdown` karo. Aakhir mein SW1 ke chaaron ports ko bhi `channel-group 1 mode passive` kar do: koi member `(P)` tak nahi pahunchta, Po1 down `(SD)` ho jaata hai, aur STP phir se teen ports block kar deta hai.",
      },
    ],
  },
};

export default lesson;
