import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "fhrp",
  intro: {
    en: "Every host has exactly one default gateway. If that router fails, every host on the subnet loses access to everything outside it, even when a second router is sitting on the same LAN. A First Hop Redundancy Protocol (FHRP) lets two or more routers share one virtual gateway address, so when one router dies another takes over and the hosts never need to change anything.",
    hi: "Har host ka sirf ek default gateway hota hai. Woh router fail hua, toh subnet ka har host bahar ki har cheez se cut ho jaata hai, chahe same LAN par doosra router baitha ho. First Hop Redundancy Protocol (FHRP) do ya zyada routers ko ek virtual gateway address share karne deta hai, taaki ek router gire toh doosra takeover kar le aur hosts ko kuch bhi badalna na pade.",
  },
  outcomes: [
    { en: "Explain why a single default gateway is a single point of failure that hosts cannot fix themselves", hi: "Samjha sako ki single default gateway single point of failure kyun hai, aur hosts ise khud kyun fix nahi kar sakte" },
    { en: "Describe how a virtual IP and virtual MAC let a standby router take over without any change on the hosts", hi: "Describe kar sako ki virtual IP aur virtual MAC ki madad se standby router hosts par bina kuch badle kaise takeover karta hai" },
    { en: "Explain what the gratuitous ARP after a failover updates, and what it does not", hi: "Samjha sako ki failover ke baad gratuitous ARP kya update karta hai, aur kya nahi" },
    { en: "Configure HSRP with priority and preemption, and verify it with `show standby`", hi: "Priority aur preemption ke saath HSRP configure kar sako, aur `show standby` se verify kar sako" },
    { en: "Compare HSRP, VRRP and GLBP and work out the virtual MAC for a group number", hi: "HSRP, VRRP aur GLBP compare kar sako, aur group number se virtual MAC nikaal sako" },
  ],
  sections: [
    {
      id: "single-point-of-failure",
      heading: { en: "One gateway, one point of failure", hi: "Ek gateway, ek point of failure" },
      blocks: [
        {
          type: "p",
          text: {
            en: "PC1 (10.1.1.10) and PC2 (10.1.1.20) sit on 10.1.1.0/24. Two routers connect that LAN to the internet: R1 at 10.1.1.1 and R2 at 10.1.1.2. The PCs can only have one default gateway each, so they all point at R1. When R1 fails, the PCs keep sending frames to R1's MAC address. Nothing reaches R2, even though R2 is healthy and has its own internet link.",
            hi: "PC1 (10.1.1.10) aur PC2 (10.1.1.20) 10.1.1.0/24 par hain. Do routers is LAN ko internet se jodte hain: R1 10.1.1.1 par aur R2 10.1.1.2 par. PCs ka sirf ek default gateway ho sakta hai, isliye sab R1 ki taraf point karte hain. R1 fail hua toh PCs R1 ke MAC address par hi frames bhejte rehte hain. R2 tak kuch nahi pahunchta, chahe R2 bilkul theek ho aur uska apna internet link bhi ho.",
          },
        },
        {
          type: "p",
          text: {
            en: "Hosts do not run routing protocols, and nobody wants to change the gateway on hundreds of PCs during an outage. The fix has to happen on the routers: they present **one virtual gateway** that does not belong to any single router. That is what an FHRP does.",
            hi: "Hosts routing protocols nahi chalate, aur outage ke time sau PCs par gateway badalna koi nahi chahta. Fix routers par hi hona chahiye: routers **ek virtual gateway** dikhate hain jo kisi ek router ka nahi hota. FHRP yahi karta hai.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "A company helpline number stays the same whoever is on duty. When one person's shift ends, calls ring at the next person's desk. Callers never learn a new number.",
            hi: "Company ka helpline number same rehta hai, chahe duty par koi bhi ho. Ek bande ki shift khatam hui toh calls agle bande ki desk par bajne lagti hain. Call karne walon ko naya number yaad nahi karna padta.",
          },
        },
      ],
    },
    {
      id: "how-it-works",
      heading: { en: "Virtual IP, virtual MAC and a takeover", hi: "Virtual IP, virtual MAC aur takeover" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "R1 and R2 join the same FHRP group and share a **virtual IP**, 10.1.1.254. It is in the LAN subnet but not configured on any interface. Every PC uses 10.1.1.254 as its default gateway.",
              hi: "R1 aur R2 same FHRP group join karte hain aur ek **virtual IP**, 10.1.1.254, share karte hain. Yeh LAN subnet mein hai lekin kisi interface par configured nahi hai. Har PC 10.1.1.254 ko default gateway ki tarah use karta hai.",
            },
            {
              en: "The group also has a **virtual MAC**. For HSRP group 1 it is `0000.0c07.ac01`. The **Active** router answers ARP requests for 10.1.1.254 with this virtual MAC, so each PC caches 10.1.1.254 → 0000.0c07.ac01.",
              hi: "Group ka ek **virtual MAC** bhi hota hai. HSRP group 1 ke liye yeh `0000.0c07.ac01` hai. **Active** router 10.1.1.254 ki ARP requests ka jawab isi virtual MAC se deta hai, isliye har PC 10.1.1.254 → 0000.0c07.ac01 cache kar leta hai.",
            },
            {
              en: "The Active router forwards everything sent to the virtual MAC. The **Standby** router forwards nothing; it sends its own Hellos and keeps listening for the Active router's.",
              hi: "Virtual MAC par aane wala sab kuch Active router forward karta hai. **Standby** router kuch forward nahi karta; woh apne Hellos bhejta hai aur Active router ke Hellos sunta rehta hai.",
            },
            {
              en: "If the Hellos stop for the **hold time**, the Standby router becomes Active and takes over the same virtual IP and virtual MAC.",
              hi: "Agar **hold time** tak Hellos nahi aaye, toh Standby router Active ban jaata hai aur wahi virtual IP aur virtual MAC le leta hai.",
            },
            {
              en: "The new Active router sends a **gratuitous ARP** from the virtual MAC. Switches see that MAC arrive on a different port and update their MAC address tables.",
              hi: "Naya Active router virtual MAC se ek **gratuitous ARP** bhejta hai. Switches dekhte hain ki yeh MAC ab doosre port par aa raha hai, aur apni MAC address tables update kar lete hain.",
            },
            {
              en: "The PCs change nothing. Their gateway IP and their ARP entry are still correct, and their frames now reach the new Active router.",
              hi: "PCs kuch nahi badalte. Unka gateway IP aur ARP entry dono abhi bhi sahi hain, aur unke frames ab naye Active router tak pahunchte hain.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "What changes after a failover", hi: "Failover ke baad kya badalta hai" },
          text: {
            en: "The hosts' ARP caches do **not** change: the virtual MAC moves with the Active role. What changes is the switches' MAC address tables, and the gratuitous ARP is what updates them.",
            hi: "Hosts ke ARP caches **nahi** badalte: virtual MAC Active role ke saath move ho jaata hai. Badalti hain switches ki MAC address tables, aur unhe gratuitous ARP hi update karta hai.",
          },
        },
      ],
    },
    {
      id: "hsrp",
      heading: { en: "HSRP: Cisco's Active/Standby protocol", hi: "HSRP: Cisco ka Active/Standby protocol" },
      blocks: [
        {
          type: "list",
          items: [
            { en: "**Hot Standby Router Protocol** is Cisco proprietary. One **Active** router forwards traffic and one **Standby** router is ready to take over. Any other routers in the group wait in the Listen state.", hi: "**Hot Standby Router Protocol** Cisco proprietary hai. Ek **Active** router traffic forward karta hai aur ek **Standby** router takeover ke liye ready rehta hai. Group ke baaki routers Listen state mein wait karte hain." },
            { en: "**Priority** ranges from 0 to 255 and defaults to **100**. The highest priority becomes Active. On a tie, the router with the highest interface IP address wins.", hi: "**Priority** 0 se 255 tak hoti hai, default **100**. Sabse zyada priority wala Active banta hai. Tie hone par jiska interface IP address sabse bada ho, woh jeet jaata hai." },
            { en: "**Preemption is off by default.** A higher-priority router that comes online later does not take over from a working Active router unless you configure `standby 1 preempt` on it.", hi: "**Preemption by default off hai.** Baad mein online aane wala higher-priority router chal rahe Active router se role nahi cheenta, jab tak us par `standby 1 preempt` configure na ho." },
            { en: "**Timers**: Hello every **3 seconds**, hold time **10 seconds**. Hellos use UDP port 1985.", hi: "**Timers**: Hello har **3 second**, hold time **10 second**. Hellos UDP port 1985 use karte hain." },
            { en: "**Load sharing**: one group has only one Active router, so the Standby router's links sit idle. To use both routers, run two groups, for example R1 Active for VLAN 10's group and R2 Active for VLAN 20's group.", hi: "**Load sharing**: ek group mein sirf ek Active router hota hai, isliye Standby router ke links khaali baithe rehte hain. Dono routers use karne ho toh do groups chalao, jaise VLAN 10 ke group mein R1 Active aur VLAN 20 ke group mein R2 Active." },
          ],
        },
        {
          type: "table",
          caption: { en: "HSRP version 1 (the IOS default) vs version 2", hi: "HSRP version 1 (IOS default) vs version 2" },
          columns: ["", "HSRPv1", "HSRPv2"],
          rows: [
            ["Multicast", "224.0.0.2", "224.0.0.102"],
            [{ en: "Virtual MAC", hi: "Virtual MAC" }, { en: "0000.0c07.acXX (XX = group in hex)", hi: "0000.0c07.acXX (XX = group, hex mein)" }, { en: "0000.0c9f.fXXX (XXX = group in hex)", hi: "0000.0c9f.fXXX (XXX = group, hex mein)" }],
            [{ en: "Group numbers", hi: "Group numbers" }, "0-255", "0-4095"],
            ["IPv6", { en: "No", hi: "Nahi" }, { en: "Yes", hi: "Haan" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Working out the virtual MAC", hi: "Virtual MAC nikaalna" },
          text: {
            en: "Convert the group number to hex. Group 10 is `0a`, so HSRPv1 group 10 uses `0000.0c07.ac0a` and HSRPv2 group 10 uses `0000.0c9f.f00a`. `0000.0c07.ac10` would be group 16. To move an interface to version 2, enter `standby version 2` on it; both routers must run the same version.",
            hi: "Group number ko hex mein badlo. Group 10 ka hex `0a` hai, isliye HSRPv1 group 10 `0000.0c07.ac0a` use karta hai aur HSRPv2 group 10 `0000.0c9f.f00a`. `0000.0c07.ac10` group 16 hoga. Interface ko version 2 par le jaana ho toh us par `standby version 2` daalo; dono routers ka version same hona chahiye.",
          },
        },
      ],
    },
    {
      id: "hsrp-config",
      heading: { en: "Configuring and verifying HSRP", hi: "HSRP configure aur verify karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "HSRP is configured on each router's LAN interface, under the interface that already has its real IP address. The group number and virtual IP must match on both routers. Here R1 gets priority 110 and preemption, so it is Active whenever it is up.",
            hi: "HSRP har router ke LAN interface par configure hota hai, usi interface ke andar jis par pehle se real IP address hai. Group number aur virtual IP dono routers par match hone chahiye. Yahan R1 ko priority 110 aur preemption milta hai, taaki jab bhi woh up ho, Active wahi rahe.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Describe, not configure", hi: "Describe karna hai, configure nahi" },
          text: {
            en: "Exam topic 3.5 asks you to **describe** the purpose, functions and concepts of FHRPs: virtual IP and MAC, roles, priority, preemption, failover and the differences between HSRP, VRRP and GLBP. The configuration below is a small step beyond that, but reading `show standby` is the quickest way to make those concepts stick.",
            hi: "Exam topic 3.5 mein FHRPs ka purpose, functions aur concepts **describe** karna aana chahiye: virtual IP aur MAC, roles, priority, preemption, failover, aur HSRP, VRRP aur GLBP mein fark. Neeche wala configuration usse thoda aage hai, lekin `show standby` padhna in concepts ko pakka karne ka sabse seedha tareeka hai.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: higher priority, preempt on", hi: "R1: zyada priority, preempt on" },
          lines: [
            { prompt: "R1(config)#", cmd: "interface GigabitEthernet0/0" },
            { prompt: "R1(config-if)#", cmd: "ip address 10.1.1.1 255.255.255.0" },
            { prompt: "R1(config-if)#", cmd: "standby 1 ip 10.1.1.254", comment: { en: "Group 1, virtual IP", hi: "Group 1, virtual IP" } },
            { prompt: "R1(config-if)#", cmd: "standby 1 priority 110", comment: { en: "Higher than the default 100", hi: "Default 100 se zyada" } },
            { prompt: "R1(config-if)#", cmd: "standby 1 preempt", comment: { en: "Take the Active role back after recovering", hi: "Wapas aane par Active role phir se le lo" } },
            { out: "%HSRP-5-STATECHANGE: GigabitEthernet0/0 Grp 1 state Standby -> Active" },
          ],
        },
        {
          type: "cli",
          title: { en: "R2: defaults", hi: "R2: defaults" },
          lines: [
            { prompt: "R2(config)#", cmd: "interface GigabitEthernet0/0" },
            { prompt: "R2(config-if)#", cmd: "ip address 10.1.1.2 255.255.255.0" },
            { prompt: "R2(config-if)#", cmd: "standby 1 ip 10.1.1.254", comment: { en: "Same group, same virtual IP; priority stays 100", hi: "Same group, same virtual IP; priority 100 hi rehti hai" } },
          ],
        },
        {
          type: "cli",
          title: { en: "Verifying on R1", hi: "R1 par verify karna" },
          lines: [
            { prompt: "R1#", cmd: "show standby" },
            { out: "GigabitEthernet0/0 - Group 1" },
            { out: "  State is Active" },
            { out: "    2 state changes, last state change 00:03:12" },
            { out: "  Virtual IP address is 10.1.1.254" },
            { out: "  Active virtual MAC address is 0000.0c07.ac01", comment: { en: "v1 MAC for group 1", hi: "Group 1 ka v1 MAC" } },
            { out: "    Local virtual MAC address is 0000.0c07.ac01 (v1 default)" },
            { out: "  Hello time 3 sec, hold time 10 sec" },
            { out: "    Next hello sent in 1.456 secs" },
            { out: "  Preemption enabled" },
            { out: "  Active router is local" },
            { out: "  Standby router is 10.1.1.2, priority 100 (expires in 9.312 sec)" },
            { out: "  Priority 110 (configured 110)" },
            { out: "  Group name is \"hsrp-Gi0/0-1\" (default)" },
          ],
        },
        {
          type: "cli",
          title: { en: "One line per group", hi: "Har group ki ek line" },
          lines: [
            { prompt: "R1#", cmd: "show standby brief" },
            { out: "                     P indicates configured to preempt." },
            { out: "                     |" },
            { out: "Interface   Grp  Pri P State   Active          Standby         Virtual IP" },
            { out: "Gi0/0       1    110 P Active  local           10.1.1.2        10.1.1.254" },
            { prompt: "R2#", cmd: "show standby brief" },
            { out: "Interface   Grp  Pri P State   Active          Standby         Virtual IP" },
            { out: "Gi0/0       1    100   Standby 10.1.1.1        local           10.1.1.254", comment: { en: "No P: R2 is not set to preempt", hi: "P nahi hai: R2 par preempt set nahi hai" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Point the hosts at the virtual IP", hi: "Hosts ko virtual IP par point karo" },
          text: {
            en: "The PCs' default gateway, and the `default-router` in a DHCP pool, must be 10.1.1.254. A host that uses 10.1.1.1 bypasses HSRP completely and loses its gateway when R1 fails.",
            hi: "PCs ka default gateway, aur DHCP pool ka `default-router`, 10.1.1.254 hona chahiye. Jo host 10.1.1.1 use karta hai, woh HSRP ko poori tarah bypass kar deta hai, aur R1 fail hone par uska gateway chala jaata hai.",
          },
        },
      ],
    },
    {
      id: "vrrp-glbp",
      heading: { en: "VRRP and GLBP", hi: "VRRP aur GLBP" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**VRRP (Virtual Router Redundancy Protocol)** is the open standard version of the same idea, so it works between different vendors. Its roles are **Master** and **Backup**, the Master sends advertisements to 224.0.0.18 every second, and **preemption is on by default**. VRRP even lets the virtual IP be a real interface address of one router.",
            hi: "**VRRP (Virtual Router Redundancy Protocol)** isi idea ka open standard version hai, isliye alag-alag vendors ke beech bhi chalta hai. Iske roles **Master** aur **Backup** hain, Master har second 224.0.0.18 par advertisements bhejta hai, aur **preemption by default on hai**. VRRP mein virtual IP kisi router ka real interface address bhi ho sakta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "**GLBP (Gateway Load Balancing Protocol)** is Cisco's answer to idle standby routers. One router is the **AVG (Active Virtual Gateway)**. It answers ARP requests for the virtual IP, but hands different hosts different virtual MACs, each belonging to an **AVF (Active Virtual Forwarder)**. Up to four routers forward traffic at the same time, all within one group.",
            hi: "**GLBP (Gateway Load Balancing Protocol)** idle standby routers ki problem ka Cisco wala jawab hai. Ek router **AVG (Active Virtual Gateway)** hota hai. Woh virtual IP ki ARP requests ka jawab deta hai, lekin alag hosts ko alag virtual MAC deta hai, aur har MAC ek **AVF (Active Virtual Forwarder)** ka hota hai. Ek hi group mein chaar tak routers ek saath traffic forward karte hain.",
          },
        },
        {
          type: "table",
          caption: { en: "The three FHRPs side by side", hi: "Teeno FHRPs aamne-saamne" },
          columns: ["", "HSRP", "VRRP", "GLBP"],
          rows: [
            [{ en: "Standard", hi: "Standard" }, "Cisco", { en: "Open (IETF)", hi: "Open (IETF)" }, "Cisco"],
            [{ en: "Roles", hi: "Roles" }, "Active / Standby", "Master / Backup", "AVG / AVF"],
            [{ en: "Virtual MAC", hi: "Virtual MAC" }, { en: "0000.0c07.acXX (v1), 0000.0c9f.fXXX (v2)", hi: "0000.0c07.acXX (v1), 0000.0c9f.fXXX (v2)" }, "0000.5e00.01XX", "0007.b400.XXYY"],
            ["Multicast", { en: "224.0.0.2 (v1), 224.0.0.102 (v2)", hi: "224.0.0.2 (v1), 224.0.0.102 (v2)" }, "224.0.0.18", "224.0.0.102"],
            [{ en: "Preemption by default", hi: "Default preemption" }, { en: "Off", hi: "Off" }, { en: "On", hi: "On" }, { en: "Off for the AVG, on for AVFs", hi: "AVG ke liye off, AVFs ke liye on" }],
            [{ en: "Load balancing", hi: "Load balancing" }, { en: "Only with several groups", hi: "Sirf kai groups se" }, { en: "Only with several groups", hi: "Sirf kai groups se" }, { en: "Built in, within one group", hi: "Built in, ek hi group mein" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Line it up with spanning tree", hi: "Spanning tree ke saath line up karo" },
          text: {
            en: "In a campus, the two distribution multilayer switches are usually the HSRP pair. Make the switch that is HSRP Active for a VLAN also the STP root bridge for that VLAN. Then frames from the access switches reach the gateway on the shortest Layer 2 path instead of crossing the link between the distribution switches.",
            hi: "Campus mein aam taur par do distribution multilayer switches hi HSRP pair hote hain. Jo switch kisi VLAN ke liye HSRP Active hai, use usi VLAN ka STP root bridge bhi banao. Tab access switches ke frames gateway tak shortest Layer 2 path se pahunchte hain, distribution switches ke beech wala link cross kiye bina.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "FHRP", def: { en: "First Hop Redundancy Protocol: lets several routers act as one virtual default gateway (HSRP, VRRP, GLBP).", hi: "First Hop Redundancy Protocol: kai routers ko ek virtual default gateway ki tarah kaam karne deta hai (HSRP, VRRP, GLBP)." } },
    { term: "Virtual IP", def: { en: "The gateway address shared by the group, configured on hosts but owned by whichever router is Active.", hi: "Group ka shared gateway address, jo hosts par configure hota hai lekin jo bhi router Active ho, wahi use own karta hai." } },
    { term: "Virtual MAC", def: { en: "The MAC address the Active router uses for the virtual IP; it moves to the new Active router on failover.", hi: "Woh MAC address jo Active router virtual IP ke liye use karta hai; failover par yeh naye Active router ke paas chala jaata hai." } },
    { term: "Active / Standby", def: { en: "HSRP roles: the Active router forwards traffic for the virtual IP; the Standby router takes over if the Active fails.", hi: "HSRP roles: Active router virtual IP ka traffic forward karta hai; Active fail ho toh Standby router takeover karta hai." } },
    { term: "Priority", def: { en: "A value from 0 to 255 (default 100) that decides which router becomes Active; highest wins.", hi: "0 se 255 tak ki value (default 100) jo decide karti hai ki kaunsa router Active banega; sabse zyada wala jeetta hai." } },
    { term: "Preemption", def: { en: "Lets a higher-priority router take the Active role from a working lower-priority router. Off by default in HSRP, on in VRRP.", hi: "Higher-priority router ko chal rahe lower-priority router se Active role lene deta hai. HSRP mein by default off, VRRP mein on." } },
    { term: "Gratuitous ARP", def: { en: "An unrequested ARP sent by the new Active router so switches learn the virtual MAC's new port.", hi: "Naye Active router ka bina maange bheja gaya ARP, taaki switches virtual MAC ka naya port seekh lein." } },
    { term: "AVG / AVF", def: { en: "GLBP roles: the AVG hands out virtual MACs in ARP replies; each AVF forwards traffic sent to its virtual MAC.", hi: "GLBP roles: AVG ARP replies mein virtual MACs baantta hai; har AVF apne virtual MAC par aaya traffic forward karta hai." } },
  ],
  commands: [
    { cmd: "standby 1 ip 10.1.1.254", mode: "Interface configuration", does: { en: "Join HSRP group 1 with virtual IP 10.1.1.254", hi: "Virtual IP 10.1.1.254 ke saath HSRP group 1 join karta hai" } },
    { cmd: "standby 1 priority 110", mode: "Interface configuration", does: { en: "Set this router's priority in group 1 (default 100)", hi: "Group 1 mein is router ki priority set karta hai (default 100)" } },
    { cmd: "standby 1 preempt", mode: "Interface configuration", does: { en: "Let this router take the Active role when its priority is highest", hi: "Priority sabse zyada ho toh is router ko Active role lene deta hai" } },
    { cmd: "standby version 2", mode: "Interface configuration", does: { en: "Switch the interface to HSRPv2 (224.0.0.102, groups 0-4095)", hi: "Interface ko HSRPv2 par le jaata hai (224.0.0.102, groups 0-4095)" } },
    { cmd: "show standby", mode: "Privileged EXEC", does: { en: "Show full HSRP details: state, virtual IP and MAC, timers, peer routers", hi: "Poori HSRP details dikhata hai: state, virtual IP aur MAC, timers, peer routers" } },
    { cmd: "show standby brief", mode: "Privileged EXEC", does: { en: "One line per group: priority, preempt, state, Active and Standby routers, virtual IP", hi: "Har group ki ek line: priority, preempt, state, Active aur Standby routers, virtual IP" } },
  ],
  mistakes: [
    {
      en: "Setting the hosts' gateway to a real router address such as 10.1.1.1. The hosts must use the virtual IP, 10.1.1.254, or there is no redundancy at all.",
      hi: "Hosts ka gateway kisi real router address, jaise 10.1.1.1, par set karna. Hosts ko virtual IP 10.1.1.254 use karna chahiye, warna redundancy hai hi nahi.",
    },
    {
      en: "Expecting the higher-priority router to take the Active role back after it recovers. In HSRP it only does that with `standby 1 preempt`; in VRRP preemption is already on.",
      hi: "Yeh expect karna ki higher-priority router wapas aakar Active role le lega. HSRP mein yeh sirf `standby 1 preempt` ke saath hota hai; VRRP mein preemption pehle se on hota hai.",
    },
    {
      en: "Mixing up the role names. HSRP is Active/Standby, VRRP is Master/Backup, GLBP is AVG/AVF.",
      hi: "Role names mix karna. HSRP mein Active/Standby, VRRP mein Master/Backup, GLBP mein AVG/AVF.",
    },
    {
      en: "Thinking two HSRP routers in one group share the traffic. Only the Active router forwards; for load sharing use several groups, or GLBP.",
      hi: "Yeh sochna ki ek group ke do HSRP routers traffic share karte hain. Sirf Active router forward karta hai; load sharing ke liye kai groups use karo, ya GLBP.",
    },
    {
      en: "Believing the hosts learn a new MAC after a failover. The virtual MAC stays the same; the gratuitous ARP updates the switches' MAC tables, not the hosts' gateway entry.",
      hi: "Yeh maan lena ki failover ke baad hosts naya MAC seekhte hain. Virtual MAC same rehta hai; gratuitous ARP switches ki MAC tables update karta hai, hosts ki gateway entry nahi.",
    },
    {
      en: "Using different group numbers or HSRP versions on the two routers. They never hear each other, so both become Active for the same virtual IP.",
      hi: "Dono routers par alag group numbers ya alag HSRP versions use karna. Woh ek doosre ko kabhi sunte hi nahi, isliye same virtual IP ke liye dono Active ban jaate hain.",
    },
  ],
  recap: [
    { en: "One default gateway is a single point of failure; an FHRP gives hosts a virtual IP and virtual MAC that survive a router failure.", hi: "Ek default gateway single point of failure hai; FHRP hosts ko aisa virtual IP aur virtual MAC deta hai jo router failure ke baad bhi chalta rahe." },
    { en: "HSRP: Cisco, Active/Standby, priority 100 by default (highest wins), preempt off, Hello 3 s, hold 10 s; v1 uses 224.0.0.2 and 0000.0c07.acXX, v2 uses 224.0.0.102 and 0000.0c9f.fXXX.", hi: "HSRP: Cisco, Active/Standby, default priority 100 (sabse zyada jeetta hai), preempt off, Hello 3 s, hold 10 s; v1 224.0.0.2 aur 0000.0c07.acXX use karta hai, v2 224.0.0.102 aur 0000.0c9f.fXXX." },
    { en: "VRRP: open standard, Master/Backup, 224.0.0.18, 0000.5e00.01XX, preempt on by default.", hi: "VRRP open standard hai: roles Master/Backup hote hain, advertisements 224.0.0.18 par jaate hain, virtual MAC 0000.5e00.01XX hota hai, aur preempt by default on rehta hai." },
    { en: "GLBP: Cisco, AVG plus up to four AVFs, load-balances inside one group, 0007.b400.XXYY.", hi: "GLBP: Cisco, AVG aur chaar tak AVFs, ek hi group ke andar load-balance karta hai, 0007.b400.XXYY." },
    { en: "On failover the new Active router sends a gratuitous ARP; switches update their MAC tables and hosts change nothing.", hi: "Failover par naya Active router gratuitous ARP bhejta hai; switches apni MAC tables update karte hain aur hosts kuch nahi badalte." },
    { en: "Configure with `standby 1 ip`, `standby 1 priority`, `standby 1 preempt`; verify with `show standby` and `show standby brief`.", hi: "Configure karo `standby 1 ip`, `standby 1 priority`, `standby 1 preempt` se; verify karo `show standby` aur `show standby brief` se." },
  ],
  quiz: [
    {
      q: { en: "Which FHRP is an open standard, calls its roles Master and Backup, and has preemption enabled by default?", hi: "Kaunsa FHRP open standard hai, apne roles ko Master aur Backup kehta hai, aur jisme preemption by default on hai?" },
      options: [
        { en: "HSRPv1", hi: "HSRPv1" },
        { en: "GLBP", hi: "GLBP" },
        { en: "VRRP", hi: "VRRP" },
        { en: "HSRPv2", hi: "HSRPv2" },
      ],
      answer: 2,
      explain: {
        en: "VRRP is the IETF standard with Master and Backup roles and preemption on by default. HSRP (both versions) and GLBP are Cisco protocols, and HSRP has preemption off by default.",
        hi: "VRRP IETF standard hai, jisme Master aur Backup roles hain aur preemption by default on hai. HSRP (dono versions) aur GLBP Cisco protocols hain, aur HSRP mein preemption by default off hai.",
      },
      kind: "concept",
    },
    {
      q: { en: "Which virtual MAC address does HSRP version 1 use for group 10?", hi: "HSRP version 1 group 10 ke liye kaunsa virtual MAC address use karta hai?" },
      options: [
        { en: "0000.0c07.ac10", hi: "0000.0c07.ac10" },
        { en: "0000.0c07.ac0a", hi: "0000.0c07.ac0a" },
        { en: "0000.5e00.010a", hi: "0000.5e00.010a" },
        { en: "0000.0c9f.f00a", hi: "0000.0c9f.f00a" },
      ],
      answer: 1,
      explain: {
        en: "HSRPv1 uses 0000.0c07.acXX with the group number in hex, and 10 is 0x0a. 0000.0c07.ac10 is group 16, 0000.5e00.010a is VRRP group 10, and 0000.0c9f.f00a is HSRPv2 group 10.",
        hi: "HSRPv1 0000.0c07.acXX use karta hai jisme group number hex mein hota hai, aur 10 ka hex 0x0a hai. 0000.0c07.ac10 group 16 hai, 0000.5e00.010a VRRP group 10 hai, aur 0000.0c9f.f00a HSRPv2 group 10.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "R1 (priority 110) and R2 (priority 100) run HSRP group 1 with no preempt command. R1 is Active, then reloads, and R2 becomes Active. What happens when R1 is back up?",
        hi: "R1 (priority 110) aur R2 (priority 100) HSRP group 1 chalate hain, koi preempt command nahi hai. R1 Active hai, phir reload hota hai, aur R2 Active ban jaata hai. R1 wapas up hone par kya hoga?",
      },
      options: [
        { en: "R1 becomes Active again because its priority is higher", hi: "R1 phir se Active banega kyunki uski priority zyada hai" },
        { en: "Both routers become Active and share the traffic", hi: "Dono routers Active ban jaayenge aur traffic share karenge" },
        { en: "R1 becomes Active once R2's hold time expires", hi: "R2 ka hold time khatam hote hi R1 Active banega" },
        { en: "R2 stays Active and R1 becomes Standby", hi: "R2 Active hi rahega aur R1 Standby banega" },
      ],
      answer: 3,
      explain: {
        en: "HSRP preemption is off by default, so a returning router with a higher priority does not take over from a working Active router. R1 would only take over with `standby 1 preempt`, or if R2 failed.",
        hi: "HSRP mein preemption by default off hai, isliye wapas aaya higher-priority router chal rahe Active router se role nahi leta. R1 tabhi takeover karega jab `standby 1 preempt` configured ho, ya R2 fail ho jaaye.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`show standby brief` on R2 shows `Gi0/0  1  100    Standby 10.1.1.1  local  10.1.1.254`. Which statement is true?",
        hi: "R2 par `show standby brief` yeh dikhata hai: `Gi0/0  1  100    Standby 10.1.1.1  local  10.1.1.254`. Kaunsa statement sahi hai?",
      },
      options: [
        { en: "10.1.1.1 is Active, and R2 takes over if it stops hearing Hellos from 10.1.1.1 for the hold time", hi: "10.1.1.1 Active hai, aur hold time tak 10.1.1.1 ke Hellos na aaye toh R2 takeover karega" },
        { en: "R2 is forwarding the traffic sent to 10.1.1.254", hi: "10.1.1.254 par aane wala traffic R2 forward kar raha hai" },
        { en: "R2 is configured to preempt", hi: "R2 par preempt configured hai" },
        { en: "The group's virtual IP address is 10.1.1.1", hi: "Group ka virtual IP address 10.1.1.1 hai" },
      ],
      answer: 0,
      explain: {
        en: "The Active column shows 10.1.1.1 and the Standby column shows `local`, so R2 is the Standby router and forwards nothing for the group. There is no `P`, so R2 is not set to preempt. The virtual IP is the last column, 10.1.1.254.",
        hi: "Active column mein 10.1.1.1 hai aur Standby column mein `local`, yaani R2 Standby router hai aur group ke liye kuch forward nahi karta. `P` nahi hai, isliye R2 par preempt set nahi hai. Virtual IP aakhri column mein hai, 10.1.1.254.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "PC1's ARP cache holds 10.1.1.254 → 0000.0c07.ac01. The Active router fails and the Standby router takes over. What is PC1's ARP entry for 10.1.1.254 after the failover?",
        hi: "PC1 ke ARP cache mein 10.1.1.254 → 0000.0c07.ac01 hai. Active router fail hota hai aur Standby router takeover kar leta hai. Failover ke baad PC1 ki 10.1.1.254 wali ARP entry kya hai?",
      },
      options: [
        { en: "It is deleted, and PC1 must ARP again", hi: "Delete ho jaati hai, aur PC1 ko phir se ARP karna padega" },
        { en: "It changes to the new Active router's burned-in MAC", hi: "Naye Active router ke burned-in MAC mein badal jaati hai" },
        { en: "It is still 0000.0c07.ac01", hi: "Abhi bhi 0000.0c07.ac01 hai" },
        { en: "It changes to 0000.0c07.ac02", hi: "0000.0c07.ac02 mein badal jaati hai" },
      ],
      answer: 2,
      explain: {
        en: "The virtual MAC belongs to the group, not to a router, so it moves with the Active role. The new Active router's gratuitous ARP carries the same MAC; it updates the switches' MAC tables, while PC1's entry was already correct.",
        hi: "Virtual MAC group ka hota hai, kisi router ka nahi, isliye yeh Active role ke saath move hota hai. Naye Active router ke gratuitous ARP mein same MAC hota hai; woh switches ki MAC tables update karta hai, PC1 ki entry toh pehle se sahi thi.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which FHRP lets several routers forward traffic for the same virtual IP at the same time, within a single group?", hi: "Kaunsa FHRP ek hi group ke andar kai routers ko same virtual IP ka traffic ek saath forward karne deta hai?" },
      options: [
        { en: "GLBP", hi: "GLBP" },
        { en: "HSRPv1", hi: "HSRPv1" },
        { en: "VRRP", hi: "VRRP" },
        { en: "HSRPv2", hi: "HSRPv2" },
      ],
      answer: 0,
      explain: {
        en: "In GLBP the AVG replies to ARP with different virtual MACs, each owned by an AVF, so up to four routers forward at once. HSRP and VRRP have one forwarding router per group and need several groups to share load.",
        hi: "GLBP mein AVG ARP ka reply alag-alag virtual MACs se deta hai, aur har MAC ek AVF ka hota hai, isliye chaar tak routers ek saath forward karte hain. HSRP aur VRRP mein har group ka ek hi forwarding router hota hai, load share karne ke liye kai groups chahiye.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "43WnpwQMolo",
      title: "Free CCNA | First Hop Redundancy Protocols | Day 29",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The problem FHRPs solve, then HSRP, VRRP and GLBP compared, including virtual MACs and gratuitous ARP.", hi: "FHRP kaunsi problem solve karta hai, phir HSRP, VRRP aur GLBP ka comparison, virtual MACs aur gratuitous ARP ke saath." },
    },
    {
      id: "uho5Z2nFhb8",
      title: "Free CCNA | Configuring HSRP | Day 29 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "A Packet Tracer lab that configures and verifies HSRP.", hi: "Packet Tracer lab jisme HSRP configure aur verify hota hai." },
    },
    {
      id: "HqMDhSDWawQ",
      title: "71. Free CCNA (NEW) | IP Services - FHRP: HSRP, VRRP, GLBP",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "HSRP, VRRP and GLBP explained in Hindi.", hi: "HSRP, VRRP aur GLBP Hindi mein." },
    },
    {
      id: "jZE8_kfxveM",
      title: "146. CCNP Encore + Enarsi | HA - HSRP - Hot Standby Router Protocol",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "A CCNP-level look at HSRP states, timers and preemption, for when you want more depth.", hi: "HSRP states, timers aur preemption ka CCNP-level explanation, jab zyada depth chahiye." },
    },
  ],
  lab: {
    title: { en: "Fail the gateway and keep pinging", hi: "Gateway fail karo aur ping chalta rakho" },
    steps: [
      { en: "In Packet Tracer, connect two 2911 routers (R1 Gi0/0 10.1.1.1/24, R2 Gi0/0 10.1.1.2/24) to a 2960 switch on Gi0/1 and Gi0/2. Add PC1 (10.1.1.10) and PC2 (10.1.1.20) with default gateway 10.1.1.254.", hi: "Packet Tracer mein do 2911 routers (R1 Gi0/0 10.1.1.1/24, R2 Gi0/0 10.1.1.2/24) ko 2960 switch ke Gi0/1 aur Gi0/2 se jodo. PC1 (10.1.1.10) aur PC2 (10.1.1.20) add karo, default gateway 10.1.1.254." },
      { en: "Configure `standby 1 ip 10.1.1.254` on both routers, and `standby 1 priority 110` and `standby 1 preempt` on R1. Run `show standby brief` on both.", hi: "Dono routers par `standby 1 ip 10.1.1.254` configure karo, aur R1 par `standby 1 priority 110` aur `standby 1 preempt`. Dono par `show standby brief` chalao." },
      { en: "From PC1, ping 10.1.1.254 and then run `arp -a`. Note the MAC for 10.1.1.254: it should be 0000.0c07.ac01, not R1's own MAC.", hi: "PC1 se 10.1.1.254 ping karo aur phir `arp -a` chalao. 10.1.1.254 ka MAC note karo: yeh 0000.0c07.ac01 hona chahiye, R1 ka apna MAC nahi." },
      { en: "Start `ping -t 10.1.1.254` on PC1, then shut down R1's Gi0/0. Count the lost replies before R2 answers, and check `show standby brief` on R2.", hi: "PC1 par `ping -t 10.1.1.254` start karo, phir R1 ka Gi0/0 shutdown karo. R2 ke jawab dene se pehle kitne replies lost hue, gino, aur R2 par `show standby brief` check karo." },
      { en: "Bring R1's Gi0/0 back with `no shutdown` and watch R1 preempt. Run `arp -a` on PC1 again: the entry for 10.1.1.254 never changed.", hi: "`no shutdown` se R1 ka Gi0/0 wapas lao aur R1 ko preempt karte dekho. PC1 par phir se `arp -a` chalao: 10.1.1.254 ki entry kabhi badli hi nahi." },
      { en: "Remove `standby 1 preempt` from R1 and repeat the failure. This time R2 keeps the Active role after R1 returns.", hi: "R1 se `standby 1 preempt` hatao aur failure dobara karo. Is baar R1 wapas aane ke baad bhi R2 Active role rakhta hai." },
    ],
  },
};

export default lesson;
