import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "network-design",
  intro: {
    en: "Up to now you have configured networks someone else drew. Design is the step before: you take requirements such as \"300 people, three floors, phones and Wi-Fi, must survive a switch failure\" and decide which boxes go where, how they connect, and which VLANs and subnets they carry. A good design makes the network easy to run and easy to troubleshoot; a poor one turns every failure into an outage.",
    hi: "Ab tak tumne aise networks configure kiye jo kisi aur ne draw kiye the. Design usse pehle ka step hai: tum requirements lete ho, jaise \"300 log, teen floors, phones aur Wi-Fi, ek switch fail ho toh bhi chalna chahiye\", aur decide karte ho ki kaunsa box kahan jaayega, kaise connect hoga, aur kaunse VLANs aur subnets carry karega. Achha design network ko chalana aur troubleshoot karna aasaan banata hai; bura design har failure ko outage bana deta hai.",
  },
  outcomes: [
    { en: "Turn user counts, growth, uptime and budget into concrete design decisions", hi: "User count, growth, uptime aur budget ko concrete design decisions mein badal sako" },
    { en: "Choose a two-tier campus with an access stack per floor and a distribution pair", hi: "Har floor par access stack aur ek distribution pair ke saath two-tier campus choose kar sako" },
    { en: "Build redundancy with dual uplinks, EtherChannel, HSRP and an STP root aligned with the active gateway", hi: "Dual uplinks, EtherChannel, HSRP aur active gateway ke saath aligned STP root se redundancy bana sako" },
    { en: "Write a VLAN plan and a VLSM IP plan from 10.20.0.0/16", hi: "VLAN plan aur 10.20.0.0/16 se VLSM IP plan likh sako" },
    { en: "Name the failure domains in a design and plan failover tests that prove it works", hi: "Design ke failure domains bata sako aur aise failover tests plan kar sako jo prove karein ki design kaam karta hai" },
  ],
  sections: [
    {
      id: "requirements",
      heading: { en: "Start with requirements, not boxes", hi: "Boxes se nahi, requirements se shuru karo" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The brief: a company moves into a building with three office floors and a small server room. About 100 people sit on each floor. Every desk has a PC and an IP phone, and staff use Wi-Fi on laptops and phones. Before you pick a single switch, write the requirements down with numbers, because each number drives a decision.",
            hi: "Brief yeh hai: ek company aisi building mein shift ho rahi hai jisme teen office floors aur ek chhota server room hai. Har floor par lagbhag 100 log baithte hain. Har desk par ek PC aur ek IP phone hai, aur staff laptops aur phones par Wi-Fi use karta hai. Ek bhi switch choose karne se pehle requirements numbers ke saath likho, kyunki har number ek decision drive karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Requirements and what each one means for the design", hi: "Requirements aur design ke liye har ek ka matlab" },
          columns: ["Requirement", "Value", "Design consequence"],
          rows: [
            [
              { en: "Users", hi: "Users" },
              { en: "300 today, about 100 per floor", hi: "Aaj 300, har floor par lagbhag 100" },
              { en: "One access switch stack per floor (three 48-port PoE switches = 144 ports)", hi: "Har floor par ek access switch stack (teen 48-port PoE switches = 144 ports)" },
            ],
            [
              { en: "Devices", hi: "Devices" },
              { en: "PC + IP phone per desk; about 1.2 Wi-Fi devices per person (360 today)", hi: "Har desk par PC + IP phone; har insaan ke lagbhag 1.2 Wi-Fi devices (aaj 360)" },
              { en: "Separate voice VLANs, PoE for phones and APs, a wireless subnet for about 470 clients after growth", hi: "Alag voice VLANs, phones aur APs ke liye PoE, growth ke baad lagbhag 470 clients ke liye wireless subnet" },
            ],
            [
              { en: "Growth", hi: "Growth" },
              { en: "+30% in five years", hi: "Paanch saal mein +30%" },
              { en: "Size subnets and ports for about 130 users per floor; keep address space in reserve", hi: "Har floor par lagbhag 130 users ke hisaab se subnets aur ports rakho; address space reserve mein rakho" },
            ],
            [
              { en: "Uptime", hi: "Uptime" },
              { en: "No single switch or uplink failure may stop a floor", hi: "Kisi ek switch ya uplink ke fail hone se koi floor nahi rukna chahiye" },
              { en: "Dual uplinks, a distribution pair, FHRP, dual power supplies on a UPS", hi: "Dual uplinks, distribution pair, FHRP, UPS par dual power supplies" },
            ],
            [
              { en: "Budget", hi: "Budget" },
              { en: "Two distribution switches, one firewall, one ISP link", hi: "Do distribution switches, ek firewall, ek ISP link" },
              { en: "Firewall and ISP are single points of failure: written down as accepted risks", hi: "Firewall aur ISP single points of failure hain: accepted risks ke roop mein likhe jaate hain" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Ask what \"down\" costs", hi: "Poocho \"down\" hone ki keemat kya hai" },
          text: {
            en: "Uptime targets decide how much redundancy is worth paying for. If the office can live with a lost internet link for four hours while the ISP fixes it, one ISP link is a fair choice. If a call centre loses money every minute, a second ISP and a firewall pair belong in the budget. Get the answer from the business, not from your own preference.",
            hi: "Uptime target decide karta hai ki kitni redundancy ke liye paisa dena worth hai. Agar office ISP ke fix karne tak chaar ghante internet ke bina chala sakta hai, toh ek ISP link theek choice hai. Agar call centre har minute paisa kho raha hai, toh doosra ISP aur firewall pair budget mein hone chahiye. Yeh jawab business se lo, apni pasand se nahi.",
          },
        },
      ],
    },
    {
      id: "hierarchy",
      heading: { en: "Choosing the hierarchy", hi: "Hierarchy choose karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "From lesson 1.12 you know the tiers. One building with four access blocks (three floors and the server room) does not need a separate core, so this is a **two-tier, collapsed-core** design: a pair of Layer 3 distribution switches, DS1 and DS2, does the distribution and core jobs and connects to the internet edge.",
            hi: "Lesson 1.12 se tumhe tiers pata hain. Ek building jisme chaar access blocks hain (teen floors aur server room), use alag core ki zaroorat nahi, isliye yeh **two-tier, collapsed-core** design hai: do Layer 3 distribution switches, DS1 aur DS2, distribution aur core dono ka kaam karte hain aur internet edge se connect hote hain.",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Access, one stack per floor** (F1-ACC, F2-ACC, F3-ACC): user, phone and AP ports with PoE, PortFast and BPDU Guard. A stack is managed as one switch, so each floor has one device to configure.", hi: "**Access, har floor par ek stack** (F1-ACC, F2-ACC, F3-ACC): PoE, PortFast aur BPDU Guard ke saath user, phone aur AP ports. Stack ek switch ki tarah manage hota hai, toh har floor par configure karne ke liye ek hi device hai." },
            { en: "**Server room** (SRV-SW): its own access block, so a fault on a user floor does not touch the servers.", hi: "**Server room** (SRV-SW): iska apna access block hai, taaki user floor ka fault servers ko na chhue." },
            { en: "**Distribution pair** (DS1, DS2): SVIs and HSRP gateways for every VLAN, STP root, routing to the edge.", hi: "**Distribution pair** (DS1, DS2): har VLAN ke SVIs aur HSRP gateways, STP root, edge tak routing." },
            { en: "**Internet edge** (FW1): the firewall does PAT and filtering between the campus and the ISP.", hi: "**Internet edge** (FW1): firewall campus aur ISP ke beech PAT aur filtering karta hai." },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Keep VLANs on one floor", hi: "VLANs ko ek floor tak rakho" },
          text: {
            en: "Give each floor its own user and voice VLANs instead of one big \"users\" VLAN across the building. On each floor's uplinks, allow only that floor's VLANs plus management with `switchport trunk allowed vlan`, so other floors' broadcasts never reach it. A loop, broadcast storm or bad NIC on floor 2 then stays inside floor 2's VLANs. This is the single cheapest way to make failures smaller.",
            hi: "Poori building mein ek bada \"users\" VLAN rakhne ki jagah har floor ko apne user aur voice VLANs do. Har floor ke uplinks par `switchport trunk allowed vlan` se sirf usi floor ke VLANs aur management allow karo, taaki doosre floors ke broadcasts wahan pahunche hi nahi. Tab floor 2 par loop, broadcast storm ya kharab NIC sirf floor 2 ke VLANs ke andar rehta hai. Failures ko chhota karne ka yeh sabse sasta tareeka hai.",
          },
        },
      ],
    },
    {
      id: "redundancy",
      heading: { en: "Redundancy without loops", hi: "Loops ke bina redundancy" },
      blocks: [
        {
          type: "steps",
          items: [
            { en: "**Dual uplinks.** Each access stack has two 10G uplinks from different stack members: one to DS1, one to DS2. Losing a member, an optic or a distribution switch leaves the other path.", hi: "**Dual uplinks.** Har access stack ke do 10G uplinks hain, alag stack members se: ek DS1 ko, ek DS2 ko. Ek member, optic ya distribution switch gaya toh doosra path bacha rehta hai." },
            { en: "**EtherChannel between DS1 and DS2.** Two 10G links bundled with LACP into Po1, a trunk carrying all VLANs. One cable failing does not change STP, and HSRP Hellos always have a path.", hi: "**DS1 aur DS2 ke beech EtherChannel.** Do 10G links LACP se Po1 mein bundle, jo saare VLANs carry karne wala trunk hai. Ek cable fail ho toh STP nahi badalta, aur HSRP Hellos ko hamesha path milta hai." },
            { en: "**HSRP for the gateway.** Each VLAN gets a virtual IP `.1`; DS1 is `.2`, DS2 is `.3`. DS1 has priority 110 with preempt, so it is Active; DS2 stays at 100 and is Standby.", hi: "**Gateway ke liye HSRP.** Har VLAN ko virtual IP `.1` milta hai; DS1 `.2` hai, DS2 `.3`. DS1 ki priority 110 hai preempt ke saath, isliye woh Active hai; DS2 100 par Standby rehta hai." },
            { en: "**Rapid PVST+ with the root on DS1.** `root primary` on DS1, `root secondary` on DS2, for the same VLANs where DS1 is HSRP Active. Each access stack's uplink to DS2 becomes an alternate (discarding) port that takes over in about a second.", hi: "**Rapid PVST+ aur root DS1 par.** DS1 par `root primary`, DS2 par `root secondary`, unhi VLANs ke liye jahan DS1 HSRP Active hai. Har access stack ka DS2 wala uplink alternate (discarding) port ban jaata hai, jo lagbhag ek second mein take over karta hai." },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Align the STP root with the HSRP Active gateway", hi: "STP root ko HSRP Active gateway ke saath align karo" },
          text: {
            en: "If DS2 were the STP root while DS1 is HSRP Active, F2-ACC would block its uplink to DS1. Every frame to the gateway would go up to DS2, across Po1 to DS1, and back. It works, but it doubles the load on Po1 and adds a hop for no reason. Same switch for both, per VLAN.",
            hi: "Agar DS2 STP root hota aur DS1 HSRP Active, toh F2-ACC apna DS1 wala uplink block kar deta. Gateway ka har frame pehle DS2 jaata, phir Po1 se DS1, aur wapas. Kaam toh karega, lekin Po1 par load double ho jaata hai aur bina wajah ek hop badh jaata hai. Har VLAN ke liye dono roles ek hi switch par rakho.",
          },
        },
        {
          type: "cli",
          title: { en: "DS1: root and Active for floor 2's user VLAN", hi: "DS1: floor 2 ke user VLAN ke liye root aur Active" },
          lines: [
            { prompt: "DS1(config)#", cmd: "spanning-tree mode rapid-pvst" },
            { prompt: "DS1(config)#", cmd: "spanning-tree vlan 10,11,20,21,30,31,50,60,99 root primary" },
            { prompt: "DS1(config)#", cmd: "interface vlan 20" },
            { prompt: "DS1(config-if)#", cmd: "ip address 10.20.20.2 255.255.255.0" },
            { prompt: "DS1(config-if)#", cmd: "standby 20 ip 10.20.20.1" },
            { prompt: "DS1(config-if)#", cmd: "standby 20 priority 110" },
            { prompt: "DS1(config-if)#", cmd: "standby 20 preempt delay minimum 60", comment: { en: "After a reboot, wait 60 s before taking Active back", hi: "Reboot ke baad Active wapas lene se pehle 60 s wait karo" } },
            { prompt: "DS1(config-if)#", cmd: "ip helper-address 10.20.60.20", comment: { en: "DHCP server in the server VLAN", hi: "Server VLAN mein DHCP server" } },
          ],
          note: {
            en: "DS2 gets `root secondary`, address `.3` and `standby 20 ip 10.20.20.1` with the default priority 100. Using the VLAN number as the HSRP group number keeps the config readable.",
            hi: "DS2 par `root secondary`, address `.3` aur default priority 100 ke saath `standby 20 ip 10.20.20.1`. HSRP group number ko VLAN number ke barabar rakhne se config padhna aasaan rehta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "The blocked uplink is the price of a Layer 2 access design: half the uplink capacity waits idle. A CCNA-level way to use both is to split the roles per VLAN: DS1 root and Active for the user VLANs, DS2 root and Active for the voice VLANs. Each VLAN stays aligned, and each floor's two uplinks both carry traffic. This lesson keeps every VLAN on DS1 to make the failover easier to follow. Two designs remove the blocked link entirely: making DS1 and DS2 one logical switch (StackWise Virtual or VSS) so each access stack bundles both uplinks into one EtherChannel, or routed access, where the uplinks are Layer 3 links. Both go beyond the CCNA; the design here is the one you can build and verify with CCNA skills.",
            hi: "Blocked uplink Layer 2 access design ki keemat hai: uplink capacity ka aadha hissa idle baitha rehta hai. Dono uplinks use karne ka CCNA-level tareeka hai roles ko per VLAN baant dena: user VLANs ke liye DS1 root aur Active, voice VLANs ke liye DS2 root aur Active. Har VLAN aligned rehta hai, aur har floor ke dono uplinks par traffic chalta hai. Is lesson mein saare VLANs DS1 par hain, taaki failover follow karna aasaan rahe. Blocked link ko poori tarah hatane wale do designs hain: DS1 aur DS2 ko ek logical switch banana (StackWise Virtual ya VSS), taaki har access stack dono uplinks ko ek EtherChannel mein bundle kar sake, ya routed access, jisme uplinks Layer 3 links hote hain. Dono CCNA ke aage hain; yahan wala design woh hai jo tum CCNA skills se bana aur verify kar sakte ho.",
          },
        },
      ],
    },
    {
      id: "failure-domains",
      heading: { en: "Failure domains", hi: "Failure domains" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **failure domain** is the part of the network affected when one component fails. Good design does not prevent failures; it makes each one small and predictable. Walk through every component and write down who it hurts.",
            hi: "**Failure domain** network ka woh hissa hai jo ek component fail hone par affect hota hai. Achha design failures ko rokta nahi; har failure ko chhota aur predictable banata hai. Har component ko dekho aur likho ki woh kisko nuksaan pahunchata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "What fails, who notices, and why", hi: "Kya fail hota hai, kisko pata chalta hai, aur kyun" },
          columns: ["Failure", "Who is affected", "Why it stays small"],
          rows: [
            [
              { en: "One access stack member", hi: "Ek access stack member" },
              { en: "Only the desks patched into that member", hi: "Sirf woh desks jo us member mein patched hain" },
              { en: "The stack keeps running; uplinks are on different members", hi: "Stack chalta rehta hai; uplinks alag members par hain" },
            ],
            [
              { en: "Floor 2's uplink to DS1", hi: "Floor 2 ka DS1 wala uplink" },
              { en: "Floor 2, for about a second", hi: "Floor 2, lagbhag ek second ke liye" },
              { en: "The RSTP alternate port to DS2 takes over", hi: "DS2 ki taraf wala RSTP alternate port take over karta hai" },
            ],
            [
              { en: "DS1 (power loss)", hi: "DS1 (power gayi)" },
              { en: "Everyone, for about 10 s with default HSRP timers", hi: "Sab log, default HSRP timers ke saath lagbhag 10 s" },
              { en: "DS2 becomes STP root and HSRP Active", hi: "DS2 STP root aur HSRP Active ban jaata hai" },
            ],
            [
              { en: "Loop or broadcast storm on floor 2", hi: "Floor 2 par loop ya broadcast storm" },
              { en: "Floor 2's VLANs", hi: "Floor 2 ke VLANs" },
              { en: "VLANs are local to the floor; BPDU Guard shuts the looped port", hi: "VLANs floor tak local hain; BPDU Guard loop wala port band kar deta hai" },
            ],
            [
              { en: "FW1 or the ISP link", hi: "FW1 ya ISP link" },
              { en: "Internet for everyone; internal traffic still works", hi: "Sabka internet; internal traffic chalta rehta hai" },
              { en: "It does not stay small: an accepted risk, written down", hi: "Yeh chhota nahi rehta: accepted risk, likha hua" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Shorter HSRP timers, shorter outage", hi: "Chhote HSRP timers, chhota outage" },
          text: {
            en: "Default HSRP timers are a 3 s hello and a 10 s hold, so a dead DS1 costs about 10 s. `standby 20 timers 1 3` cuts that to about 3 s. Change it on both switches, and test it.",
            hi: "Default HSRP timers 3 s hello aur 10 s hold hain, isliye DS1 marne par lagbhag 10 s jaate hain. `standby 20 timers 1 3` ise lagbhag 3 s kar deta hai. Dono switches par change karo, aur test karo.",
          },
        },
      ],
    },
    {
      id: "vlan-and-ip-plan",
      heading: { en: "VLAN plan and IP plan", hi: "VLAN plan aur IP plan" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Use a pattern people can remember: the VLAN number matches the third octet, in user and voice VLANs the tens digit is the floor, and `.1` is always the gateway. Size each subnet with VLSM (lesson 1.6) from the requirements, not by habit.",
            hi: "Aisa pattern use karo jo log yaad rakh sakein: VLAN number third octet se match karta hai, user aur voice VLANs mein tens digit floor hai, aur `.1` hamesha gateway hai. Har subnet ka size requirements se VLSM (lesson 1.6) ke through decide karo, aadat se nahi.",
          },
        },
        {
          type: "table",
          caption: { en: "VLAN and IP plan from 10.20.0.0/16", hi: "10.20.0.0/16 se VLAN aur IP plan" },
          columns: ["VLAN", "Use", "Subnet", "Usable", "Sizing"],
          rows: [
            ["10, 20, 30", { en: "Users, floors 1-3", hi: "Users, floors 1-3" }, "10.20.10.0/24, .20.0/24, .30.0/24", "254 each", { en: "130 PCs per floor with growth", hi: "Growth ke saath har floor par 130 PCs" }],
            ["11, 21, 31", { en: "Voice, floors 1-3", hi: "Voice, floors 1-3" }, "10.20.11.0/24, .21.0/24, .31.0/24", "254 each", { en: "130 phones per floor; a /25 (126) is too tight", hi: "Har floor par 130 phones; /25 (126) bahut tight hai" }],
            ["50", { en: "Wireless clients", hi: "Wireless clients" }, "10.20.50.0/23", "510", { en: "360 devices today, about 470 with growth", hi: "Aaj 360 devices, growth ke saath lagbhag 470" }],
            ["60", { en: "Servers", hi: "Servers" }, "10.20.60.0/26", "62", { en: "About 40 servers", hi: "Lagbhag 40 servers" }],
            ["99", { en: "Management (switches, APs, WLC)", hi: "Management (switches, APs, WLC)" }, "10.20.99.0/26", "62", { en: "About 40 devices", hi: "Lagbhag 40 devices" }],
            ["-", { en: "Routed links FW1-DS1, FW1-DS2", hi: "Routed links FW1-DS1, FW1-DS2" }, "10.20.255.0/30, 10.20.255.4/30", "2 each", { en: "Point-to-point", hi: "Point-to-point" }],
            ["999", { en: "Native VLAN on trunks, unused", hi: "Trunks par native VLAN, unused" }, { en: "none", hi: "none" }, "-", { en: "Nothing should be sent untagged", hi: "Kuch bhi untagged nahi jaana chahiye" }],
          ],
        },
        {
          type: "list",
          items: [
            { en: "**Gateways**: `.1` is the HSRP virtual IP, `.2` is DS1, `.3` is DS2 in every VLAN. DHCP clients get `.1` as their default gateway.", hi: "**Gateways**: har VLAN mein `.1` HSRP virtual IP hai, `.2` DS1, `.3` DS2. DHCP clients ko default gateway `.1` milta hai." },
            { en: "**DHCP**: one server at 10.20.60.20; each user, voice and wireless SVI, and the management SVI (the APs get their addresses by DHCP), has `ip helper-address 10.20.60.20`.", hi: "**DHCP**: ek server 10.20.60.20 par; har user, voice aur wireless SVI par, aur management SVI par bhi (APs ko address DHCP se milta hai), `ip helper-address 10.20.60.20` hai." },
            { en: "**Wireless**: APs in local mode tunnel client traffic to the WLC in CAPWAP, and the WLC (in the server room) places it in VLAN 50. So VLAN 50 is needed only where the WLC connects, not on every floor.", hi: "**Wireless**: local mode ke APs client traffic ko CAPWAP mein WLC tak tunnel karte hain, aur WLC (server room mein) use VLAN 50 mein daalta hai. Isliye VLAN 50 sirf wahan chahiye jahan WLC connected hai, har floor par nahi." },
            { en: "**Reserve**: 10.20.100.0 to 10.20.254.255 stays free for a fourth floor or a second building, using the same pattern.", hi: "**Reserve**: 10.20.100.0 se 10.20.254.255 tak free rehta hai, chauthe floor ya doosri building ke liye, isi pattern ke saath." },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "A /23 network address must have an even third octet: 10.20.50.0/23 is valid (it covers .50.0 to .51.255), 10.20.51.0/23 is not. The exam tests this alignment rule in VLSM questions.",
            hi: "/23 network address ka third octet even hona chahiye: 10.20.50.0/23 valid hai (yeh .50.0 se .51.255 tak cover karta hai), 10.20.51.0/23 valid nahi. Exam VLSM questions mein yeh alignment rule test karta hai.",
          },
        },
      ],
    },
    {
      id: "internet-edge",
      heading: { en: "The internet edge", hi: "Internet edge" },
      blocks: [
        {
          type: "p",
          text: {
            en: "FW1 sits between the campus and the ISP. Its outside interface is 203.0.113.2/30 towards the ISP at 203.0.113.1, and it does PAT for every inside subnet. On the inside it has two routed /30 links, one to DS1 and one to DS2, so losing one distribution switch does not cut the internet.",
            hi: "FW1 campus aur ISP ke beech baitha hai. Uska outside interface 203.0.113.2/30 hai, ISP 203.0.113.1 ki taraf, aur woh har inside subnet ke liye PAT karta hai. Inside par uske do routed /30 links hain, ek DS1 ko aur ek DS2 ko, isliye ek distribution switch jaane se internet nahi katta.",
          },
        },
        {
          type: "list",
          items: [
            { en: "Run **OSPF** between FW1, DS1 and DS2. FW1 advertises a default route; DS1 and DS2 advertise the campus subnets. If a link or a distribution switch dies, OSPF moves traffic to the other one without anyone touching a static route.", hi: "FW1, DS1 aur DS2 ke beech **OSPF** chalao. FW1 default route advertise karta hai; DS1 aur DS2 campus subnets advertise karte hain. Link ya distribution switch mar jaaye toh OSPF traffic ko doosre par shift kar deta hai, bina kisi static route ko touch kiye." },
            { en: "DS1 and DS2 also need an OSPF adjacency with each other, over one SVI on Po1 (for example VLAN 99), with the user-facing SVIs set as `passive-interface`. Then if only the FW1-DS1 link fails, DS1 is still the HSRP Active gateway and reaches FW1 through DS2.", hi: "DS1 aur DS2 ke beech bhi OSPF adjacency chahiye, Po1 par ek SVI ke through (jaise VLAN 99), aur user wale SVIs `passive-interface` hon. Tab agar sirf FW1-DS1 link fail ho, toh DS1 HSRP Active gateway bana rehta hai aur DS2 ke through FW1 tak pahunchta hai." },
            { en: "The firewall policy allows inside to outside and blocks unsolicited outside to inside. Servers that must be reached from the internet belong in a DMZ, a separate firewall interface, not in VLAN 60.", hi: "Firewall policy inside se outside allow karti hai aur outside se aane wale unsolicited traffic ko block karti hai. Jin servers tak internet se pahunchna zaroori hai, woh DMZ mein hone chahiye, jo firewall ka alag interface hai, VLAN 60 mein nahi." },
            { en: "One firewall and one ISP link are single points of failure. Write them down as accepted risks with their impact and the cost to fix: a firewall pair in active/standby and a second ISP.", hi: "Ek firewall aur ek ISP link single points of failure hain. Inhe accepted risks ki tarah likho, impact aur fix karne ki cost ke saath: active/standby firewall pair aur doosra ISP." },
          ],
        },
      ],
    },
    {
      id: "document-and-validate",
      heading: { en: "Document it and prove it works", hi: "Document karo aur prove karo ki kaam karta hai" },
      blocks: [
        {
          type: "list",
          items: [
            { en: "**Physical diagram**: every device, port and cable ID, uplinks and Po1 members.", hi: "**Physical diagram**: har device, port aur cable ID likho, saath mein uplinks aur Po1 ke members bhi." },
            { en: "**Logical diagram**: subnets, SVIs, HSRP virtual IPs, OSPF links, the firewall zones.", hi: "**Logical diagram**: isme subnets, SVIs, HSRP virtual IPs, OSPF links aur firewall zones dikhne chahiye." },
            { en: "**VLAN and IP plan** (the table above), plus a naming standard such as F2-ACC.", hi: "**VLAN aur IP plan** (upar wali table), saath mein naming standard jaise F2-ACC." },
            { en: "**Role table**: per VLAN, which switch is STP root and HSRP Active.", hi: "**Role table**: har VLAN ke liye, kaunsa switch STP root aur HSRP Active hai." },
            { en: "**Standard configs** for an access port, an uplink and an SVI, so every floor is built the same way.", hi: "Access port, uplink aur SVI ke **standard configs**, taaki har floor same tarah se bane." },
            { en: "**Accepted risks** and **test results**, with dates.", hi: "**Accepted risks** aur **test results**, dates ke saath." },
          ],
        },
        {
          type: "table",
          caption: { en: "Failover test plan (run a continuous ping from each floor to FS1 and to an internet address during each test)", hi: "Failover test plan (har test ke dauraan har floor se FS1 aur ek internet address tak continuous ping chalao)" },
          columns: ["Test", "Pass if"],
          rows: [
            [{ en: "Unplug F2-ACC's uplink to DS1", hi: "F2-ACC ka DS1 wala uplink nikalo" }, { en: "Floor 2 loses about a second; DS1 stays Active, reached through DS2 and Po1", hi: "Floor 2 ka lagbhag ek second jaata hai; DS1 Active rehta hai, DS2 aur Po1 ke through" }],
            [{ en: "Unplug one Po1 member", hi: "Po1 ka ek member nikalo" }, { en: "Po1 stays up at 10G; no STP or HSRP change", hi: "Po1 10G par up rehta hai; STP ya HSRP mein koi change nahi" }],
            [{ en: "Power off DS1", hi: "DS1 ki power band karo" }, { en: "About 10 s of loss, then DS2 is root and Active; internet works via FW1-DS2", hi: "Lagbhag 10 s loss, phir DS2 root aur Active; internet FW1-DS2 se chalta hai" }],
            [{ en: "Power DS1 back on", hi: "DS1 ki power wapas on karo" }, { en: "DS1 is STP root again at once, but takes HSRP Active back only after the 60 s preempt delay", hi: "DS1 turant phir se STP root ban jaata hai, lekin HSRP Active 60 s preempt delay ke baad hi wapas leta hai" }],
            [{ en: "Unplug FW1's outside link", hi: "FW1 ka outside link nikalo" }, { en: "Internet down, internal traffic fine (accepted risk confirmed)", hi: "Internet down, internal traffic theek (accepted risk confirm)" }],
          ],
        },
        {
          type: "cli",
          title: { en: "After powering off DS1: DS2 has taken over", hi: "DS1 ki power band karne ke baad: DS2 ne take over kar liya" },
          lines: [
            { prompt: "DS2#", cmd: "show standby brief" },
            { out: "                     P indicates configured to preempt." },
            { out: "                     |" },
            { out: "Interface   Grp  Pri P State   Active          Standby         Virtual IP" },
            { out: "Vl20        20   100   Active  local           unknown         10.20.20.1", comment: { en: "DS2 is now the gateway; no standby left", hi: "DS2 ab gateway hai; koi standby nahi bacha" } },
            { prompt: "DS2#", cmd: "show spanning-tree vlan 20 | include root" },
            { out: "             This bridge is the root", comment: { en: "DS2 became root for VLAN 20 too", hi: "DS2 VLAN 20 ka root bhi ban gaya" } },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Requirement", def: { en: "A measurable need, such as user count, growth or uptime, that a design decision must satisfy.", hi: "Ek measurable zaroorat, jaise user count, growth ya uptime, jise design decision ko poora karna hai." } },
    { term: "Collapsed core", def: { en: "A two-tier design where the distribution pair also does the core's job.", hi: "Two-tier design jisme distribution pair hi core ka kaam bhi karta hai." } },
    { term: "Failure domain", def: { en: "The part of the network affected when one component fails.", hi: "Network ka woh hissa jo ek component fail hone par affect hota hai." } },
    { term: "Single point of failure", def: { en: "A component whose failure alone stops a service, because nothing backs it up.", hi: "Aisa component jiske akele fail hone se service ruk jaati hai, kyunki uska koi backup nahi." } },
    { term: "STP and FHRP alignment", def: { en: "Making the same switch both STP root and HSRP Active for a VLAN, so traffic reaches the gateway in one hop.", hi: "Ek VLAN ke liye same switch ko STP root aur HSRP Active dono banana, taaki traffic ek hop mein gateway tak pahunche." } },
    { term: "Accepted risk", def: { en: "A known weakness the business agrees to live with, written down with its impact and cost to fix.", hi: "Ek known weakness jiske saath business rehne ko taiyaar hai, impact aur fix ki cost ke saath likhi hui." } },
    { term: "Failover test", def: { en: "Deliberately failing a component to measure how the network recovers.", hi: "Jaan boojh kar component fail karke measure karna ki network kaise recover hota hai." } },
  ],
  commands: [
    { cmd: "spanning-tree mode rapid-pvst", mode: "Cisco global config", does: { en: "Run Rapid PVST+ so alternate ports take over in about a second", hi: "Rapid PVST+ chalata hai taaki alternate ports lagbhag ek second mein take over karein" } },
    { cmd: "spanning-tree vlan 10,11,20,21,30,31,50,60,99 root primary", mode: "Cisco global config", does: { en: "Make this switch the STP root for those VLANs (root secondary on the peer)", hi: "Is switch ko un VLANs ka STP root banata hai (peer par root secondary)" } },
    { cmd: "standby 20 ip 10.20.20.1", mode: "Cisco interface config (SVI)", does: { en: "Join HSRP group 20 with virtual IP 10.20.20.1", hi: "Virtual IP 10.20.20.1 ke saath HSRP group 20 join karta hai" } },
    { cmd: "standby 20 priority 110", mode: "Cisco interface config (SVI)", does: { en: "Raise priority so this switch becomes Active", hi: "Priority badhata hai taaki yeh switch Active bane" } },
    { cmd: "standby 20 preempt delay minimum 60", mode: "Cisco interface config (SVI)", does: { en: "Take Active back after a reboot, but only after 60 seconds", hi: "Reboot ke baad Active wapas leta hai, lekin sirf 60 second baad" } },
    { cmd: "standby 20 timers 1 3", mode: "Cisco interface config (SVI)", does: { en: "Hello every 1 s, hold 3 s, for faster failover", hi: "Har 1 s hello, 3 s hold, taaki failover jaldi ho" } },
    { cmd: "channel-group 1 mode active", mode: "Cisco interface config", does: { en: "Add the port to Po1 using LACP", hi: "LACP use karke port ko Po1 mein add karta hai" } },
    { cmd: "spanning-tree portfast / spanning-tree bpduguard enable", mode: "Cisco interface config (access port)", does: { en: "Fast start for end devices, and shut the port if a BPDU arrives", hi: "End devices ke liye fast start, aur BPDU aaye toh port band" } },
    { cmd: "show standby brief", mode: "Cisco privileged EXEC", does: { en: "HSRP state, priority and virtual IP per group", hi: "Har group ka HSRP state, priority aur virtual IP" } },
    { cmd: "show spanning-tree vlan 20", mode: "Cisco privileged EXEC", does: { en: "Root bridge and port roles for VLAN 20", hi: "VLAN 20 ka root bridge aur port roles" } },
    { cmd: "show etherchannel summary", mode: "Cisco privileged EXEC", does: { en: "Po1 status and its member ports", hi: "Po1 ka status aur uske member ports" } },
  ],
  mistakes: [
    {
      en: "Picking hardware before writing requirements. Without user counts, growth and uptime targets you cannot defend any choice.",
      hi: "Requirements likhne se pehle hardware choose kar lena. User count, growth aur uptime targets ke bina tum koi bhi choice defend nahi kar sakte.",
    },
    {
      en: "Leaving the STP root to the election. The switch with the lowest MAC may become root, often an old access switch, and traffic takes strange paths. Set root primary and secondary on the distribution pair.",
      hi: "STP root ko election par chhod dena. Sabse kam MAC wala switch root ban sakta hai, aksar koi purana access switch, aur traffic ajeeb raaste leta hai. Distribution pair par root primary aur secondary set karo.",
    },
    {
      en: "Making DS1 the HSRP Active gateway but DS2 the STP root. Traffic crosses Po1 for every packet; keep both roles on the same switch per VLAN.",
      hi: "DS1 ko HSRP Active gateway aur DS2 ko STP root bana dena. Har packet Po1 cross karta hai; har VLAN ke liye dono roles same switch par rakho.",
    },
    {
      en: "Stretching one user VLAN across every floor. One loop or storm then hits the whole building; keep VLANs local to a floor.",
      hi: "Ek user VLAN ko har floor tak stretch karna. Tab ek loop ya storm poori building ko hit karta hai; VLANs ko ek floor tak local rakho.",
    },
    {
      en: "Sizing subnets for today. A /25 for 100 phones is full after 26 more; size for growth and keep reserve space.",
      hi: "Subnets ka size sirf aaj ke hisaab se rakhna. 100 phones ke liye /25, 26 aur phones ke baad full ho jaata hai; growth ke hisaab se size rakho aur reserve space chhodo.",
    },
    {
      en: "Calling the design redundant without testing it. Until you have pulled the power on DS1 and watched the pings, it is a theory.",
      hi: "Bina test kiye design ko redundant bolna. Jab tak tumne DS1 ki power kheench kar pings nahi dekhe, tab tak yeh sirf theory hai.",
    },
  ],
  recap: [
    { en: "Requirements first: users, devices, growth, uptime, budget. Each one drives a decision.", hi: "Pehle requirements: users, devices, growth, uptime, budget. Har ek ek decision drive karta hai." },
    { en: "One building: two-tier collapsed core, an access stack per floor, a server block, a distribution pair.", hi: "Ek building: two-tier collapsed core, har floor par access stack, ek server block, ek distribution pair." },
    { en: "Dual uplinks, Po1 between DS1 and DS2, HSRP `.1` / `.2` / `.3`, STP root on the HSRP Active switch.", hi: "Dual uplinks, DS1 aur DS2 ke beech Po1, HSRP `.1` / `.2` / `.3`, STP root HSRP Active switch par." },
    { en: "VLANs local to a floor keep failure domains small; write down what is still a single point of failure.", hi: "Floor tak local VLANs failure domains ko chhota rakhte hain; jo abhi bhi single point of failure hai use likh do." },
    { en: "VLSM from 10.20.0.0/16: /24 users and voice, /23 wireless, /26 servers and management, /30 routed links.", hi: "10.20.0.0/16 se VLSM: users aur voice ke liye /24, wireless /23, servers aur management /26, routed links /30." },
    { en: "Prove it: failover tests with a continuous ping, results recorded in the design document.", hi: "Prove karo: continuous ping ke saath failover tests, results design document mein record." },
  ],
  quiz: [
    {
      q: {
        en: "The wireless VLAN must hold about 470 client devices, including growth. Which is the smallest subnet (the longest prefix) that fits?",
        hi: "Wireless VLAN mein growth mila kar lagbhag 470 client devices aane chahiye. Sabse chhota subnet (yaani sabse lamba prefix) kaunsa hai jo fit ho?",
      },
      options: [
        { en: "/24", hi: "/24" },
        { en: "/23", hi: "/23" },
        { en: "/22", hi: "/22" },
        { en: "/25", hi: "/25" },
      ],
      answer: 1,
      explain: {
        en: "A /25 (126) and a /24 (254 usable) are too few. A /23 has 9 host bits: 2^9 - 2 = 510 usable, enough for 470. A /22 (1022) also fits but wastes space.",
        hi: "/25 (126) aur /24 (254 usable) kam hain. /23 mein 9 host bits hain: 2^9 - 2 = 510 usable, 470 ke liye kaafi. /22 (1022) bhi fit hota hai lekin space waste karta hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "DS1 is HSRP Active for VLAN 20, but DS2 is the STP root for VLAN 20. What happens to a frame from a floor 2 PC to its gateway?",
        hi: "VLAN 20 ke liye DS1 HSRP Active hai, lekin VLAN 20 ka STP root DS2 hai. Floor 2 ke PC se gateway jaane wale frame ka kya hota hai?",
      },
      options: [
        { en: "It is dropped, because the gateway is behind a blocked port", hi: "Drop ho jaata hai, kyunki gateway blocked port ke peeche hai" },
        { en: "DS2 answers as the gateway because it is the root", hi: "DS2 gateway ki tarah jawab deta hai kyunki woh root hai" },
        { en: "HSRP moves Active to DS2 automatically", hi: "HSRP Active ko automatically DS2 par le jaata hai" },
        { en: "It goes up to DS2 and across Po1 to DS1, adding a hop and loading Po1", hi: "Woh pehle DS2 jaata hai aur Po1 se DS1 tak, ek hop badhta hai aur Po1 par load aata hai" },
      ],
      answer: 3,
      explain: {
        en: "With DS2 as root, F2-ACC blocks its uplink to DS1, so frames reach DS1 only through DS2 and Po1. It still works, which is why the mistake goes unnoticed; aligning root and Active removes the extra hop. HSRP does not react to STP.",
        hi: "DS2 root hai toh F2-ACC apna DS1 wala uplink block kar deta hai, aur frames DS1 tak sirf DS2 aur Po1 ke through pahunchte hain. Phir bhi kaam karta hai, isliye yeh galti pakdi nahi jaati; root aur Active align karne se extra hop hat jaata hai. HSRP STP par react nahi karta.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "DS1 loses power. HSRP uses default timers and the access layer runs Rapid PVST+. About how long are floor users without a working gateway?",
        hi: "DS1 ki power chali jaati hai. HSRP default timers use karta hai aur access layer Rapid PVST+ chala rahi hai. Floor users kitni der tak bina working gateway ke rehte hain, lagbhag?",
      },
      options: [
        { en: "About 1 second", hi: "Lagbhag 1 second" },
        { en: "About 50 seconds", hi: "Lagbhag 50 second" },
        { en: "About 10 seconds", hi: "Lagbhag 10 second" },
        { en: "Until DS1 is repaired", hi: "Jab tak DS1 repair na ho" },
      ],
      answer: 2,
      explain: {
        en: "RSTP moves each access stack to its DS2 uplink in about a second, but DS2 only becomes HSRP Active when its 10 s hold timer expires. The 50 s figure belongs to classic 802.1D STP, not RSTP.",
        hi: "RSTP har access stack ko lagbhag ek second mein DS2 wale uplink par le aata hai, lekin DS2 HSRP Active tabhi banta hai jab uska 10 s hold timer expire ho. 50 s wala figure classic 802.1D STP ka hai, RSTP ka nahi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Why does the design give each floor its own user and voice VLANs instead of one building-wide user VLAN?",
        hi: "Design har floor ko apne user aur voice VLANs kyun deta hai, poori building ke liye ek user VLAN kyun nahi?",
      },
      options: [
        { en: "A loop or broadcast storm on one floor stays inside that floor's VLANs", hi: "Ek floor ka loop ya broadcast storm usi floor ke VLANs ke andar rehta hai" },
        { en: "HSRP supports only one VLAN per access switch", hi: "HSRP har access switch par sirf ek VLAN support karta hai" },
        { en: "A trunk can carry only two VLANs", hi: "Trunk sirf do VLANs carry kar sakta hai" },
        { en: "It removes the need for STP", hi: "Isse STP ki zaroorat khatam ho jaati hai" },
      ],
      answer: 0,
      explain: {
        en: "Each VLAN is a broadcast domain, so a problem in floor 2's VLANs cannot flood floors 1 and 3. That is a smaller failure domain. STP is still needed because each access stack has two uplinks.",
        hi: "Har VLAN ek broadcast domain hai, isliye floor 2 ke VLANs ki problem floors 1 aur 3 ko flood nahi kar sakti. Yahi chhota failure domain hai. STP phir bhi chahiye, kyunki har access stack ke do uplinks hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Which of these is a valid /23 network address for the wireless VLAN?",
        hi: "Wireless VLAN ke liye inme se kaunsa valid /23 network address hai?",
      },
      options: [
        { en: "10.20.49.0/23", hi: "10.20.49.0/23" },
        { en: "10.20.51.0/23", hi: "10.20.51.0/23" },
        { en: "10.20.50.128/23", hi: "10.20.50.128/23" },
        { en: "10.20.50.0/23", hi: "10.20.50.0/23" },
      ],
      answer: 3,
      explain: {
        en: "A /23 block is 2 in the third octet, so the network must start at an even third octet with a fourth octet of 0. 10.20.50.0/23 covers 10.20.50.0 to 10.20.51.255. The others have host bits set.",
        hi: "/23 ka block third octet mein 2 hai, isliye network even third octet aur fourth octet 0 par shuru hona chahiye. 10.20.50.0/23, 10.20.50.0 se 10.20.51.255 tak cover karta hai. Baaki sab mein host bits set hain.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "The budget allows only one firewall and one ISP link. What should the design document say about them?",
        hi: "Budget mein sirf ek firewall aur ek ISP link aa sakta hai. Design document mein inke baare mein kya likhna chahiye?",
      },
      options: [
        { en: "Nothing, because the internal network is redundant", hi: "Kuch nahi, kyunki internal network redundant hai" },
        { en: "That they are single points of failure, accepted by the business, with the impact and cost to fix", hi: "Ki yeh single points of failure hain, business ne accept kiye hain, impact aur fix ki cost ke saath" },
        { en: "That HSRP on DS1 and DS2 protects the internet link", hi: "Ki DS1 aur DS2 par HSRP internet link ko protect karta hai" },
        { en: "That STP will reroute around a firewall failure", hi: "Ki STP firewall failure ke around reroute kar dega" },
      ],
      answer: 1,
      explain: {
        en: "HSRP and STP protect the campus, not the edge. A failure of FW1 or the ISP link stops internet access for everyone, so the risk must be written down and agreed, with what it would cost to remove it.",
        hi: "HSRP aur STP campus ko protect karte hain, edge ko nahi. FW1 ya ISP link fail hone par sabka internet ruk jaata hai, isliye yeh risk likhna aur agree karwana zaroori hai, saath mein ise hatane ki cost bhi.",
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
      note: { en: "Revises two-tier, three-tier, spine-leaf and SOHO designs, the building blocks this lesson puts together.", hi: "Two-tier, three-tier, spine-leaf aur SOHO designs revise karta hai, jinhe yeh lesson jodta hai." },
    },
    {
      id: "wwwAXlE4OtU",
      title: "DO NOT design your network like this!! // FREE CCNA // EP 6",
      channel: "NetworkChuck",
      lang: "en",
      note: { en: "Starts from a badly designed network and fixes it with tiers. A light, practical view of why hierarchy matters.", hi: "Ek bure design wale network se shuru karke use tiers se fix karta hai. Hierarchy kyun zaroori hai, iska halka aur practical view." },
    },
    {
      id: "N_V0Y8CSOiM",
      title: "How to Design a Scalable and Secure Office Network | Designing a Scalable Office Network",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walk-through of designing an office network that can grow, close to this lesson's case.", hi: "Grow kar sakne wale office network ko design karne ka Hindi walk-through, is lesson ke case ke kaafi kareeb." },
    },
    {
      id: "M6ssv5-GhZQ",
      title: "155. CCNP Encore + Enarsi | Network Design - Network Design Principles",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi introduction to design principles such as hierarchy, modularity and resiliency (CCNP level).", hi: "Hierarchy, modularity aur resiliency jaise design principles ka Hindi introduction (CCNP level)." },
    },
  ],
  lab: {
    title: { en: "Build the distribution pair and fail it", hi: "Distribution pair banao aur use fail karo" },
    steps: [
      { en: "In Packet Tracer, add two 3650 or 3560 switches (DS1, DS2) joined by a two-link LACP EtherChannel trunk, and two 2960 access switches each uplinked to both.", hi: "Packet Tracer mein do 3650 ya 3560 switches (DS1, DS2) lo jo do-link LACP EtherChannel trunk se jude hon, aur do 2960 access switches jinka uplink dono se ho." },
      { en: "Create VLANs 10 and 20 on one access switch each. On DS1 and DS2 add SVIs `.2` and `.3`, HSRP virtual IP `.1`, priority 110 with preempt on DS1.", hi: "Ek access switch par VLAN 10 aur doosre par VLAN 20 banao. DS1 aur DS2 par SVIs `.2` aur `.3`, HSRP virtual IP `.1`, aur DS1 par preempt ke saath priority 110 lagao." },
      { en: "Set Rapid PVST+ and make DS1 `root primary` and DS2 `root secondary`. Check with `show spanning-tree vlan 10` that each access switch's DS2 uplink is Altn.", hi: "Rapid PVST+ set karo, DS1 ko `root primary` aur DS2 ko `root secondary` banao. `show spanning-tree vlan 10` se check karo ki har access switch ka DS2 wala uplink Altn hai." },
      { en: "Start `ping -t` from a PC in VLAN 10 to a PC in VLAN 20, then power off DS1. Count the lost replies and compare with the 10 s hold time.", hi: "VLAN 10 ke PC se VLAN 20 ke PC tak `ping -t` chalao, phir DS1 ki power band karo. Lost replies gino aur 10 s hold time se compare karo." },
      { en: "Power DS1 back on and confirm with `show standby brief` that it becomes Active again. Write the results in a one-page test report.", hi: "DS1 ki power wapas on karo aur `show standby brief` se confirm karo ki woh phir Active ban gaya. Results ek page ki test report mein likho." },
    ],
  },
};

export default lesson;
