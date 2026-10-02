import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "inter-vlan-routing",
  intro: {
    en: "VLANs split a switch into separate broadcast domains, and each VLAN gets its own IPv4 subnet. That separation is the point, but the people in VLAN 10 still need the printer in VLAN 20 and the servers in VLAN 30. A switch never moves a frame from one VLAN to another, so something has to route between them. The CCNA expects you to build it two ways: a router on a trunk, and a Layer 3 switch.",
    hi: "VLANs ek switch ko alag-alag broadcast domains mein baant dete hain, aur har VLAN ka apna IPv4 subnet hota hai. Yeh separation hi maksad hai, lekin VLAN 10 ke logon ko phir bhi VLAN 20 ka printer aur VLAN 30 ke servers chahiye. Switch kabhi bhi frame ko ek VLAN se doosre VLAN mein nahi bhejta, isliye beech mein kisi ko routing karni padegi. CCNA ise do tareeke se banana expect karta hai: trunk par ek router, aur Layer 3 switch.",
  },
  outcomes: [
    { en: "Explain why hosts in different VLANs need a router or Layer 3 switch to talk", hi: "Samjha sako ki alag VLANs ke hosts ko baat karne ke liye router ya Layer 3 switch kyun chahiye" },
    { en: "Configure router-on-a-stick with 802.1Q subinterfaces and a trunk on the switch", hi: "802.1Q subinterfaces aur switch par trunk ke saath router-on-a-stick configure kar sako" },
    { en: "Trace a packet between VLANs and predict its tag and MAC addresses on every link", hi: "VLANs ke beech ek packet trace kar sako aur har link par uska tag aur MAC addresses predict kar sako" },
    { en: "Handle the native VLAN on a router subinterface", hi: "Router subinterface par native VLAN sahi se handle kar sako" },
    { en: "Configure SVIs and routed ports on a Layer 3 switch, and fix an SVI that stays down", hi: "Layer 3 switch par SVIs aur routed ports configure kar sako, aur down pade SVI ko theek kar sako" },
    { en: "Choose between router-on-a-stick and a Layer 3 switch for a given network", hi: "Kisi network ke liye router-on-a-stick aur Layer 3 switch mein se sahi option chun sako" },
  ],
  sections: [
    {
      id: "why-routing",
      heading: { en: "Why VLANs need a router", hi: "VLANs ko router kyun chahiye" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 2.1 each VLAN became its own broadcast domain, and in practice each VLAN also gets its own subnet. A switch forwards a frame only to ports in the same VLAN, so on its own it can never carry traffic from VLAN 10 to VLAN 20. That is not a fault to work around; it is exactly what you asked the VLANs to do.",
            hi: "Lesson 2.1 mein har VLAN apna alag broadcast domain bana, aur practice mein har VLAN ko apna alag subnet bhi milta hai. Switch frame ko sirf same VLAN ke ports par forward karta hai, isliye akela switch VLAN 10 ka traffic VLAN 20 tak kabhi nahi le jaa sakta. Yeh koi fault nahi hai jiska jugaad dhoondhna ho; VLANs se tumne yahi toh maanga tha.",
          },
        },
        {
          type: "p",
          text: {
            en: "You already know what a host does when the destination is in another subnet (lesson 1.2): it sends the frame to its **default gateway**. So every VLAN needs a gateway address on a device that can route. Inter-VLAN routing means giving each VLAN that gateway.",
            hi: "Tumhe pata hai ki destination doosre subnet mein ho toh host kya karta hai (lesson 1.2): frame apne **default gateway** ko bhejta hai. Toh har VLAN ko kisi aise device par gateway address chahiye jo routing kar sake. Inter-VLAN routing ka matlab bas itna hai: har VLAN ko uska gateway dena.",
          },
        },
        {
          type: "table",
          caption: { en: "The addressing used in this lesson and its animation", hi: "Is lesson aur animation ki addressing" },
          columns: ["VLAN", "Subnet", "Gateway", { en: "Example host", hi: "Example host" }],
          rows: [
            ["10", "192.168.10.0/24", "192.168.10.1", "PC-A 192.168.10.10"],
            ["20", "192.168.20.0/24", "192.168.20.1", "PC-B 192.168.20.20"],
            ["99 (native)", "192.168.99.0/24", "192.168.99.1", "SW1 192.168.99.2"],
          ],
        },
        {
          type: "p",
          text: {
            en: "There are three ways to give the VLANs a gateway:",
            hi: "VLANs ko gateway dene ke teen tareeke hain:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**One router interface per VLAN.** Each router port plugs into an access port in one VLAN. It is easy to understand, but 10 VLANs need 10 router ports and 10 cables, so you will rarely see it now.",
              hi: "**Har VLAN ke liye ek router interface.** Router ka har port kisi ek VLAN ke access port mein lagta hai. Samajhna aasaan hai, lekin 10 VLANs ke liye 10 router ports aur 10 cables chahiye, isliye aajkal yeh kam hi dikhta hai.",
            },
            {
              en: "**Router-on-a-stick (ROAS).** One router interface connects to a switch trunk and uses one subinterface per VLAN.",
              hi: "**Router-on-a-stick (ROAS).** Router ka ek hi interface switch ke trunk se judta hai, aur har VLAN ke liye ek subinterface use karta hai.",
            },
            {
              en: "**Layer 3 switch.** The switch routes between VLANs itself, using one virtual interface (SVI) per VLAN.",
              hi: "**Layer 3 switch.** Switch khud VLANs ke beech routing karta hai, har VLAN ke liye ek virtual interface (SVI) use karke.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Exam topic 2.1 includes inter-VLAN connectivity. Expect a ROAS or SVI configuration with one line missing or wrong, and a question asking why two VLANs cannot reach each other.",
            hi: "Exam topic 2.1 mein inter-VLAN connectivity aata hai. Aisa question expect karo jisme ROAS ya SVI configuration di ho, ek line missing ya galat ho, aur poocha jaaye ki do VLANs aapas mein baat kyun nahi kar pa rahe.",
          },
        },
      ],
    },
    {
      id: "router-on-a-stick",
      heading: { en: "Router-on-a-stick: one cable, many subinterfaces", hi: "Router-on-a-stick: ek cable, kai subinterfaces" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **subinterface** is a logical interface inside a physical one, named with a dot and a number, such as `Gi0/0.10`. Each subinterface gets its own IP address and is tied to one VLAN with `encapsulation dot1Q <vlan-id>`. To R1, Gi0/0.10 and Gi0/0.20 are two separate connected networks, even though they share one cable and one MAC address.",
            hi: "**Subinterface** ek physical interface ke andar bana logical interface hai, jiska naam dot aur number se likhte hain, jaise `Gi0/0.10`. Har subinterface ka apna IP address hota hai, aur `encapsulation dot1Q <vlan-id>` use ek VLAN se jodta hai. R1 ke liye Gi0/0.10 aur Gi0/0.20 do alag connected networks hain, bhale hi dono ek hi cable aur ek hi MAC address share karte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "The switch port facing the router must be a **trunk**, so frames from every VLAN reach R1 with their 802.1Q tag (lesson 2.2). The tag is how R1 decides which subinterface a frame belongs to. On SW1, PC-A's port Fa0/1 is an access port in VLAN 10 and PC-B's port Fa0/2 is in VLAN 20, as in lesson 2.1.",
            hi: "Router ki taraf wala switch port **trunk** hona chahiye, taaki har VLAN ke frames apne 802.1Q tag ke saath R1 tak pahunchein (lesson 2.2). Isi tag se R1 decide karta hai ki frame kis subinterface ka hai. SW1 par PC-A ka port Fa0/1 VLAN 10 ka access port hai aur PC-B ka port Fa0/2 VLAN 20 mein hai, bilkul lesson 2.1 ki tarah.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: one subinterface per VLAN", hi: "R1: har VLAN ke liye ek subinterface" },
          lines: [
            { prompt: "R1(config)#", cmd: "interface g0/0" },
            {
              prompt: "R1(config-if)#",
              cmd: "no shutdown",
              comment: { en: "Router interfaces start shut down; the subinterfaces follow this physical interface", hi: "Router interfaces shutdown state mein shuru hote hain; subinterfaces isi physical interface ko follow karte hain" },
            },
            { prompt: "R1(config-if)#", cmd: "interface g0/0.10" },
            { prompt: "R1(config-subif)#", cmd: "encapsulation dot1Q 10", comment: { en: "Frames tagged with VLAN 10 belong to this subinterface", hi: "VLAN 10 tag wale frames is subinterface ke hain" } },
            { prompt: "R1(config-subif)#", cmd: "ip address 192.168.10.1 255.255.255.0", comment: { en: "The default gateway for VLAN 10 hosts", hi: "VLAN 10 ke hosts ka default gateway" } },
            { prompt: "R1(config-subif)#", cmd: "interface g0/0.20" },
            { prompt: "R1(config-subif)#", cmd: "encapsulation dot1Q 20" },
            { prompt: "R1(config-subif)#", cmd: "ip address 192.168.20.1 255.255.255.0" },
          ],
        },
        {
          type: "cli",
          title: { en: "SW1: the trunk to R1", hi: "SW1: R1 ki taraf trunk" },
          lines: [
            { prompt: "SW1(config)#", cmd: "interface g0/1" },
            { prompt: "SW1(config-if)#", cmd: "switchport mode trunk", comment: { en: "A router does not negotiate DTP, so set trunk mode statically", hi: "Router DTP negotiate nahi karta, isliye trunk mode static set karo" } },
          ],
          note: {
            en: "On switches that also support ISL, such as the Catalyst 3560, enter `switchport trunk encapsulation dot1q` first or the switch refuses trunk mode. A Catalyst 2960 supports only 802.1Q and has no such command.",
            hi: "Jo switches ISL bhi support karte hain, jaise Catalyst 3560, un par pehle `switchport trunk encapsulation dot1q` dena padta hai, warna switch trunk mode accept nahi karta. Catalyst 2960 sirf 802.1Q support karta hai, us par yeh command hota hi nahi.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Encapsulation first, then the IP address", hi: "Pehle encapsulation, phir IP address" },
          text: {
            en: "On a new subinterface, IOS refuses an IP address until the VLAN is set: `% Configuring IP routing on a LAN subinterface is only allowed if that subinterface is already configured as part of an IEEE 802.10, IEEE 802.1Q, or ISL vLAN.` Enter `encapsulation dot1Q` first.",
            hi: "Naye subinterface par jab tak VLAN set nahi hota, IOS IP address accept nahi karta: `% Configuring IP routing on a LAN subinterface is only allowed if that subinterface is already configured as part of an IEEE 802.10, IEEE 802.1Q, or ISL vLAN.` Isliye pehle `encapsulation dot1Q` do.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "The subinterface number is only a name", hi: "Subinterface number sirf ek naam hai" },
          text: {
            en: "`Gi0/0.10` would carry VLAN 30 if you typed `encapsulation dot1Q 30` under it. Only the encapsulation command decides the VLAN. Matching the number to the VLAN ID is a convention that stops you confusing yourself.",
            hi: "Agar `Gi0/0.10` ke andar `encapsulation dot1Q 30` likh do, toh woh VLAN 30 carry karega. VLAN sirf encapsulation command decide karta hai. Number ko VLAN ID se match rakhna bas ek convention hai, taaki tum khud confuse na ho.",
          },
        },
      ],
    },
    {
      id: "hairpin-path",
      heading: { en: "One ping, two trips across the trunk", hi: "Ek ping, trunk par do chakkar" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Follow PC-A (192.168.10.10) pinging PC-B (192.168.20.20). The animation shows the same steps.",
            hi: "PC-A (192.168.10.10) se PC-B (192.168.20.20) ko ping follow karo. Animation mein yahi steps dikhte hain.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "PC-B is outside 192.168.10.0/24, so PC-A ARPs for its gateway, 192.168.10.1. The ARP broadcast floods through VLAN 10 only: up the trunk tagged 10, never out Fa0/2 to PC-B. Gi0/0.10 replies with Gi0/0's MAC, `0011.2233.4401`.",
              hi: "PC-B 192.168.10.0/24 ke bahar hai, isliye PC-A apne gateway 192.168.10.1 ke liye ARP karta hai. ARP broadcast sirf VLAN 10 mein flood hota hai: trunk par tag 10 ke saath upar jaata hai, Fa0/2 se PC-B tak kabhi nahi. Gi0/0.10 Gi0/0 ka MAC `0011.2233.4401` bhej kar reply karta hai.",
            },
            {
              en: "PC-A sends the echo request in an **untagged** frame to destination MAC `0011.2233.4401`. Access ports never carry tags; SW1 knows the frame is in VLAN 10 because Fa0/1 is a VLAN 10 access port.",
              hi: "PC-A echo request ko **untagged** frame mein destination MAC `0011.2233.4401` par bhejta hai. Access ports par kabhi tag nahi hota; SW1 ko pata hai ki frame VLAN 10 ka hai kyunki Fa0/1 VLAN 10 ka access port hai.",
            },
            {
              en: "SW1 finds `0011.2233.4401` on Gi0/1 in VLAN 10 and sends the frame up the trunk with an 802.1Q tag of **10**.",
              hi: "SW1 ko `0011.2233.4401` VLAN 10 mein Gi0/1 par milta hai, aur woh frame ko 802.1Q tag **10** ke saath trunk par upar bhejta hai.",
            },
            {
              en: "R1 matches tag 10 to Gi0/0.10, removes the Ethernet header and looks up 192.168.20.20. It matches the connected network 192.168.20.0/24 on Gi0/0.20. The TTL drops by 1, here from 128 to 127.",
              hi: "R1 tag 10 ko Gi0/0.10 se match karta hai, Ethernet header hata deta hai aur 192.168.20.20 lookup karta hai. Yeh Gi0/0.20 wale connected network 192.168.20.0/24 se match hota hai. TTL 1 kam hota hai, yahan 128 se 127.",
            },
            {
              en: "R1 builds a new frame: source MAC its own `0011.2233.4401`, destination MAC PC-B's `0050.56aa.0020` (learned by ARP on Gi0/0.20), tag **20**. It goes back down the same cable it came up.",
              hi: "R1 naya frame banata hai: source MAC uska apna `0011.2233.4401`, destination MAC PC-B ka `0050.56aa.0020` (Gi0/0.20 par ARP se seekha hua), aur tag **20**. Frame usi cable se neeche jaata hai jisse upar aaya tha.",
            },
            {
              en: "SW1 reads tag 20, removes it and forwards the frame out Fa0/2 to PC-B. The echo reply makes the same U-turn in reverse: up tagged 20, down tagged 10.",
              hi: "SW1 tag 20 padhta hai, use hata deta hai aur frame Fa0/2 se PC-B ko forward karta hai. Echo reply ulti direction mein wahi U-turn leta hai: upar tag 20, neeche tag 10.",
            },
          ],
        },
        {
          type: "table",
          caption: {
            en: "The echo request on each link. The IP addresses stay 192.168.10.10 → 192.168.20.20 the whole way.",
            hi: "Har link par echo request. IP addresses poore raaste 192.168.10.10 → 192.168.20.20 hi rehte hain.",
          },
          columns: ["Link", "802.1Q tag", "Source MAC", "Destination MAC"],
          rows: [
            ["PC-A → SW1 (Fa0/1)", { en: "none", hi: "koi nahi" }, "0050.56aa.0010 (PC-A)", "0011.2233.4401 (R1)"],
            ["SW1 → R1 (trunk)", "10", "0050.56aa.0010 (PC-A)", "0011.2233.4401 (R1)"],
            ["R1 → SW1 (trunk)", "20", "0011.2233.4401 (R1)", "0050.56aa.0020 (PC-B)"],
            ["SW1 → PC-B (Fa0/2)", { en: "none", hi: "koi nahi" }, "0011.2233.4401 (R1)", "0050.56aa.0020 (PC-B)"],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Every packet between two VLANs crosses a ROAS trunk twice. On the way up it carries the source VLAN's tag, on the way down the destination VLAN's tag. R1 rewrites the MAC addresses; the source and destination IP addresses never change.",
            hi: "Do VLANs ke beech har packet ROAS trunk ko do baar cross karta hai. Upar jaate waqt source VLAN ka tag hota hai, neeche aate waqt destination VLAN ka. MAC addresses R1 rewrite karta hai; source aur destination IP addresses kabhi nahi badalte.",
          },
        },
      ],
    },
    {
      id: "native-vlan",
      heading: { en: "The native VLAN on a router", hi: "Router par native VLAN" },
      blocks: [
        {
          type: "p",
          text: {
            en: "From lesson 2.2, frames in the trunk's **native VLAN** cross it untagged. A subinterface with plain `encapsulation dot1Q 99` expects tagged frames, so untagged frames would never reach it. You have to tell R1 which VLAN the untagged frames belong to.",
            hi: "Lesson 2.2 se yaad karo: trunk ke **native VLAN** ke frames bina tag ke jaate hain. Simple `encapsulation dot1Q 99` wala subinterface tagged frames expect karta hai, isliye untagged frames us tak kabhi nahi pahunchenge. R1 ko batana padta hai ki untagged frames kis VLAN ke hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "In this lesson VLAN 99 is the native VLAN and holds SW1's management address, 192.168.99.2. R1 can get an address in VLAN 99 in either of two ways:",
            hi: "Is lesson mein VLAN 99 native VLAN hai aur isme SW1 ka management address 192.168.99.2 hai. R1 ko VLAN 99 mein address do mein se kisi bhi tareeke se mil sakta hai:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**A subinterface with the `native` keyword**: `encapsulation dot1Q 99 native`. R1 sends that subinterface's frames untagged and accepts untagged frames on it.",
              hi: "**`native` keyword wala subinterface**: `encapsulation dot1Q 99 native`. R1 is subinterface ke frames bina tag ke bhejta hai aur untagged frames isi par accept karta hai.",
            },
            {
              en: "**The IP address on the physical interface** (`interface g0/0`). Untagged frames that match no subinterface are handled by the physical interface itself.",
              hi: "**Physical interface par IP address** (`interface g0/0`). Jo untagged frames kisi subinterface se match nahi hote, unhe physical interface khud handle karta hai.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "Both ends agree on native VLAN 99", hi: "Dono ends native VLAN 99 par agree karte hain" },
          lines: [
            { prompt: "SW1(config)#", cmd: "interface g0/1" },
            { prompt: "SW1(config-if)#", cmd: "switchport trunk native vlan 99" },
            { prompt: "R1(config)#", cmd: "interface g0/0.99" },
            { prompt: "R1(config-subif)#", cmd: "encapsulation dot1Q 99 native", comment: { en: "Untagged frames on Gi0/0 belong to VLAN 99", hi: "Gi0/0 par aane wale untagged frames VLAN 99 ke hain" } },
            { prompt: "R1(config-subif)#", cmd: "ip address 192.168.99.1 255.255.255.0" },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Leave out native and VLAN 99 breaks", hi: "native bhoole toh VLAN 99 toot jaata hai" },
          text: {
            en: "If R1 has `encapsulation dot1Q 99` without `native`, it tags its VLAN 99 frames while SW1 sends VLAN 99 untagged. SW1's untagged frames never reach Gi0/0.99, so SW1 cannot ping 192.168.99.1.",
            hi: "Agar R1 par `native` ke bina `encapsulation dot1Q 99` hai, toh R1 VLAN 99 ke frames par tag lagata hai jabki SW1 VLAN 99 ko bina tag ke bhejta hai. SW1 ke untagged frames Gi0/0.99 tak kabhi nahi pahunchte, isliye SW1 192.168.99.1 ko ping nahi kar paata.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "In production", hi: "Production mein" },
          text: {
            en: "Lesson 2.2's advice still holds: make the native VLAN an unused VLAN and carry management in a tagged VLAN. Then R1 needs no native subinterface at all. VLAN 99 is native here only so you can see the command.",
            hi: "Lesson 2.2 ki salah abhi bhi lagu hai: native VLAN ko kisi unused VLAN par rakho aur management ko tagged VLAN mein chalao. Tab R1 ko native subinterface ki zaroorat hi nahi padti. Yahan VLAN 99 ko native sirf isliye rakha hai taaki tum command dekh sako.",
          },
        },
      ],
    },
    {
      id: "layer3-switch",
      heading: { en: "Layer 3 switch: SVIs and routed ports", hi: "Layer 3 switch: SVIs aur routed ports" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **Layer 3 switch** (also called a multilayer switch) is a switch that can also route, in hardware. Instead of sending traffic up a trunk to a router and back, it routes between VLANs internally. Each VLAN gets a **switch virtual interface (SVI)**: a virtual interface named `interface vlan 10` that holds the VLAN's gateway address.",
            hi: "**Layer 3 switch** (jise multilayer switch bhi kehte hain) aisa switch hai jo hardware mein routing bhi kar sakta hai. Traffic ko trunk se router tak bhej kar wapas laane ki jagah, yeh VLANs ke beech routing andar hi kar leta hai. Har VLAN ko ek **switch virtual interface (SVI)** milta hai: `interface vlan 10` naam ka virtual interface, jisme us VLAN ka gateway address hota hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Here one Layer 3 switch, DSW1, replaces both R1 and SW1. VLANs 10 and 20 already exist on it and its access ports are assigned, as in lesson 2.1.",
            hi: "Yahan ek Layer 3 switch, DSW1, R1 aur SW1 dono ki jagah le leta hai. Is par VLANs 10 aur 20 pehle se bane hain aur access ports assign ho chuke hain, jaise lesson 2.1 mein kiya tha.",
          },
        },
        {
          type: "cli",
          title: { en: "DSW1: routing between VLANs with SVIs", hi: "DSW1: SVIs se VLANs ke beech routing" },
          lines: [
            { prompt: "DSW1(config)#", cmd: "ip routing", comment: { en: "Turns on IPv4 routing; without it the switch does not route between SVIs", hi: "IPv4 routing on karta hai; iske bina switch SVIs ke beech route nahi karta" } },
            { prompt: "DSW1(config)#", cmd: "interface vlan 10" },
            { prompt: "DSW1(config-if)#", cmd: "ip address 192.168.10.1 255.255.255.0" },
            { prompt: "DSW1(config-if)#", cmd: "no shutdown", comment: { en: "A new SVI starts administratively down", hi: "Naya SVI administratively down state mein shuru hota hai" } },
            { prompt: "DSW1(config-if)#", cmd: "interface vlan 20" },
            { prompt: "DSW1(config-if)#", cmd: "ip address 192.168.20.1 255.255.255.0" },
            { prompt: "DSW1(config-if)#", cmd: "no shutdown" },
          ],
          note: {
            en: "`ip routing` is off by default on many Catalyst switches, while some newer platforms turn it on by default. If `show ip route` answers `Default gateway is not set` instead of listing routes, routing is off.",
            hi: "Kai Catalyst switches par `ip routing` by default off hota hai, jabki kuch naye platforms par by default on hota hai. Agar `show ip route` routes dikhane ki jagah `Default gateway is not set` bole, toh samjho routing off hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "An SVI only comes up/up when all of these are true:",
            hi: "SVI tabhi up/up hota hai jab yeh saari conditions poori hon:",
          },
        },
        {
          type: "list",
          items: [
            { en: "The VLAN exists on the switch. Creating `interface vlan 30` does not create VLAN 30.", hi: "VLAN switch par exist karta ho. `interface vlan 30` banane se VLAN 30 nahi banta." },
            { en: "At least one port in the VLAN is up and forwarding: an access port in that VLAN, or a trunk that allows it.", hi: "VLAN ka kam se kam ek port up aur forwarding ho: us VLAN ka access port, ya aisa trunk jo use allow karta ho." },
            { en: "The VLAN itself is not shut down (`shutdown` under `vlan 30`).", hi: "VLAN khud shut down na ho (`vlan 30` ke andar `shutdown`)." },
            { en: "The SVI is not shut down; it needs `no shutdown`.", hi: "SVI shut down na ho; use `no shutdown` chahiye." },
          ],
        },
        {
          type: "p",
          text: {
            en: "A switch port can also become a **routed port** with `no switchport`. It then behaves like a router interface: it belongs to no VLAN and takes an IP address directly. Use it for point-to-point links to a router, a firewall or another Layer 3 switch.",
            hi: "Switch port ko `no switchport` se **routed port** bhi bana sakte ho. Tab woh router interface jaisa behave karta hai: kisi VLAN ka nahi hota aur IP address seedha usi par lagta hai. Router, firewall ya doosre Layer 3 switch ke saath point-to-point links ke liye iska use karo.",
          },
        },
        {
          type: "cli",
          title: { en: "DSW1: a routed uplink to R1", hi: "DSW1: R1 ki taraf routed uplink" },
          lines: [
            { prompt: "DSW1(config)#", cmd: "interface g1/0/24" },
            { prompt: "DSW1(config-if)#", cmd: "no switchport", comment: { en: "The Layer 2 switchport becomes a Layer 3 routed port", hi: "Layer 2 switchport ab Layer 3 routed port ban gaya" } },
            { prompt: "DSW1(config-if)#", cmd: "ip address 10.0.0.2 255.255.255.252" },
            { prompt: "DSW1(config-if)#", cmd: "exit" },
            { prompt: "DSW1(config)#", cmd: "ip route 0.0.0.0 0.0.0.0 10.0.0.1", comment: { en: "Default route towards R1; static routes are lesson 3.4", hi: "R1 ki taraf default route; static routes lesson 3.4 mein hain" } },
          ],
        },
      ],
    },
    {
      id: "verify-and-choose",
      heading: { en: "Verify, then choose a design", hi: "Verify karo, phir design chuno" },
      blocks: [
        {
          type: "p",
          text: {
            en: "On R1, first check that the physical interface and every subinterface are up/up, then that each subinterface produced a connected route.",
            hi: "R1 par pehle check karo ki physical interface aur har subinterface up/up hai, phir yeh ki har subinterface ne connected route banaya hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Verifying router-on-a-stick", hi: "Router-on-a-stick verify karna" },
          lines: [
            { prompt: "R1#", cmd: "show ip interface brief" },
            { out: "Interface              IP-Address      OK? Method Status                Protocol" },
            {
              out: "GigabitEthernet0/0     unassigned      YES unset  up                    up",
              comment: { en: "The physical interface needs no IP address of its own", hi: "Physical interface ko apna IP address nahi chahiye" },
            },
            { out: "GigabitEthernet0/0.10  192.168.10.1    YES manual up                    up" },
            { out: "GigabitEthernet0/0.20  192.168.20.1    YES manual up                    up" },
            { out: "GigabitEthernet0/0.99  192.168.99.1    YES manual up                    up" },
            { prompt: "R1#", cmd: "show ip route" },
            { comment: { en: "Codes legend and the VLAN 99 routes left out", hi: "Codes legend aur VLAN 99 ke routes yahan nahi dikhaye" } },
            { out: "      192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks" },
            {
              out: "C        192.168.10.0/24 is directly connected, GigabitEthernet0/0.10",
              comment: { en: "C: the whole VLAN 10 subnet is reachable out Gi0/0.10", hi: "C: poora VLAN 10 subnet Gi0/0.10 se reachable hai" },
            },
            {
              out: "L        192.168.10.1/32 is directly connected, GigabitEthernet0/0.10",
              comment: { en: "L: R1's own address on that subinterface (lesson 3.1)", hi: "L: us subinterface par R1 ka apna address (lesson 3.1)" },
            },
            { out: "      192.168.20.0/24 is variably subnetted, 2 subnets, 2 masks" },
            { out: "C        192.168.20.0/24 is directly connected, GigabitEthernet0/0.20" },
            { out: "L        192.168.20.1/32 is directly connected, GigabitEthernet0/0.20" },
          ],
          note: {
            en: "On R1, `show vlans` lists each 802.1Q VLAN with the subinterface that carries it, a quick way to spot a wrong `encapsulation` number. On SW1, `show interfaces trunk` should list Gi0/1 as trunking, with VLANs 10, 20 and 99 allowed and forwarding. On a Layer 3 switch, `show ip interface brief` lists `Vlan10` and `Vlan20` where R1 lists subinterfaces.",
            hi: "R1 par `show vlans` har 802.1Q VLAN aur use carry karne wala subinterface dikhata hai; galat `encapsulation` number pakadne ka yeh jaldi wala tareeka hai. SW1 par `show interfaces trunk` mein Gi0/1 trunking dikhna chahiye, aur VLANs 10, 20 aur 99 allowed aur forwarding hone chahiye. Layer 3 switch par `show ip interface brief` mein wahan `Vlan10` aur `Vlan20` dikhte hain jahan R1 subinterfaces dikhata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Router-on-a-stick or Layer 3 switch?", hi: "Router-on-a-stick ya Layer 3 switch?" },
          columns: ["", "Router-on-a-stick", { en: "Layer 3 switch (SVIs)", hi: "Layer 3 switch (SVIs)" }],
          rows: [
            ["Hardware", { en: "A router plus a Layer 2 switch", hi: "Ek router aur ek Layer 2 switch" }, { en: "One multilayer switch", hi: "Ek multilayer switch" }],
            [
              { en: "Where routing happens", hi: "Routing kahan hoti hai" },
              { en: "In the router, after a trip up the trunk", hi: "Router mein, trunk se upar jaane ke baad" },
              { en: "Inside the switch, in hardware", hi: "Switch ke andar, hardware mein" },
            ],
            [
              { en: "Trunk crossings per inter-VLAN packet", hi: "Har inter-VLAN packet kitni baar trunk cross karta hai" },
              { en: "Two: up and back down", hi: "Do baar: upar aur wapas neeche" },
              { en: "None; there is no U-turn", hi: "Ek baar bhi nahi; koi U-turn nahi" },
            ],
            [
              { en: "Strong point", hi: "Strong point" },
              { en: "Cheap: reuses a router you already have and works with any Layer 2 switch that can trunk", hi: "Sasta: jo router pehle se hai wahi use hota hai, aur trunk support karne wala koi bhi Layer 2 switch chal jaata hai" },
              { en: "Fast: routes at hardware speed with no shared bottleneck link", hi: "Fast: hardware speed par routing, beech mein koi shared bottleneck link nahi" },
            ],
            [
              { en: "Weak point", hi: "Kamzor point" },
              { en: "All inter-VLAN traffic shares one link's bandwidth, and that link and router port are a single point of failure", hi: "Saara inter-VLAN traffic ek hi link ki bandwidth share karta hai, aur woh link aur router port single point of failure hain" },
              { en: "Costs more than a Layer 2 switch", hi: "Layer 2 switch se mehenga" },
            ],
            [
              { en: "Typical place", hi: "Aam taur par kahan" },
              { en: "Small branches, labs, little inter-VLAN traffic", hi: "Chhoti branches, labs, jahan inter-VLAN traffic kam ho" },
              { en: "Campus distribution and core, most enterprise LANs", hi: "Campus distribution aur core, zyaadatar enterprise LANs" },
            ],
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Inter-VLAN routing", def: { en: "Routing packets between VLANs, which are separate subnets, with a router or a Layer 3 switch.", hi: "VLANs ke beech packets route karna, jo alag subnets hain, router ya Layer 3 switch se." } },
    { term: "Router-on-a-stick (ROAS)", def: { en: "One router interface on an 802.1Q trunk, with one subinterface acting as the gateway for each VLAN.", hi: "802.1Q trunk par router ka ek interface, jisme har VLAN ke liye ek subinterface gateway ka kaam karta hai." } },
    { term: "Subinterface", def: { en: "A logical interface inside a physical one, such as Gi0/0.10, with its own IP address and VLAN.", hi: "Physical interface ke andar ek logical interface, jaise Gi0/0.10, jiska apna IP address aur VLAN hota hai." } },
    { term: "encapsulation dot1Q", def: { en: "The subinterface command that ties it to one VLAN ID; add `native` for the untagged native VLAN.", hi: "Subinterface ka command jo use ek VLAN ID se jodta hai; untagged native VLAN ke liye `native` jodo." } },
    { term: "SVI", def: { en: "Switch virtual interface. A virtual Layer 3 interface for a VLAN (`interface vlan 10`), used as that VLAN's gateway.", hi: "Switch virtual interface. Kisi VLAN ka virtual Layer 3 interface (`interface vlan 10`), jo us VLAN ka gateway banta hai." } },
    { term: "Layer 3 switch", def: { en: "A switch that can also route between its SVIs and routed ports in hardware. Also called a multilayer switch.", hi: "Aisa switch jo apne SVIs aur routed ports ke beech hardware mein routing bhi kar sakta hai. Ise multilayer switch bhi kehte hain." } },
    { term: "Routed port", def: { en: "A Layer 3 switch port turned into a router-style interface with `no switchport`; it belongs to no VLAN.", hi: "Layer 3 switch ka port jo `no switchport` se router jaisa interface ban jaata hai; yeh kisi VLAN ka nahi hota." } },
    { term: "Native VLAN", def: { en: "The VLAN whose frames cross an 802.1Q trunk without a tag.", hi: "Woh VLAN jiske frames 802.1Q trunk par bina tag ke jaate hain." } },
  ],
  commands: [
    { cmd: "interface g0/0.10", mode: "Global configuration", does: { en: "Create or enter subinterface Gi0/0.10", hi: "Subinterface Gi0/0.10 banao ya usme jao" } },
    { cmd: "encapsulation dot1Q 10", mode: "Subinterface configuration", does: { en: "Tie the subinterface to VLAN 10 (tagged frames)", hi: "Subinterface ko VLAN 10 (tagged frames) se jodo" } },
    { cmd: "encapsulation dot1Q 99 native", mode: "Subinterface configuration", does: { en: "Tie the subinterface to native VLAN 99 (untagged frames)", hi: "Subinterface ko native VLAN 99 (untagged frames) se jodo" } },
    { cmd: "ip address 192.168.10.1 255.255.255.0", mode: "Subinterface or interface configuration", does: { en: "Set the VLAN's gateway address", hi: "VLAN ka gateway address set karo" } },
    { cmd: "switchport mode trunk", mode: "Interface configuration (switch)", does: { en: "Make the switch port facing the router a static trunk", hi: "Router ki taraf wale switch port ko static trunk banao" } },
    { cmd: "switchport trunk native vlan 99", mode: "Interface configuration (switch)", does: { en: "Set the trunk's native VLAN; it must match the router", hi: "Trunk ka native VLAN set karo; yeh router se match hona chahiye" } },
    { cmd: "ip routing", mode: "Global configuration (Layer 3 switch)", does: { en: "Enable IPv4 routing between SVIs and routed ports", hi: "SVIs aur routed ports ke beech IPv4 routing enable karo" } },
    { cmd: "interface vlan 10", mode: "Global configuration", does: { en: "Create or enter the SVI for VLAN 10", hi: "VLAN 10 ka SVI banao ya usme jao" } },
    { cmd: "no shutdown", mode: "Interface configuration", does: { en: "Enable the router's physical interface or a new SVI", hi: "Router ka physical interface ya naya SVI enable karo" } },
    { cmd: "no switchport", mode: "Interface configuration (Layer 3 switch)", does: { en: "Turn a switch port into a routed port", hi: "Switch port ko routed port banao" } },
    { cmd: "show ip interface brief", mode: "Privileged EXEC", does: { en: "Check that subinterfaces or SVIs are up/up with the right addresses", hi: "Check karo ki subinterfaces ya SVIs sahi addresses ke saath up/up hain" } },
    { cmd: "show ip route", mode: "Privileged EXEC", does: { en: "Confirm there is a connected route for every VLAN", hi: "Confirm karo ki har VLAN ka connected route hai" } },
    { cmd: "show vlans", mode: "Privileged EXEC (router)", does: { en: "List each 802.1Q VLAN on the router and the subinterface that carries it", hi: "Router par har 802.1Q VLAN aur use carry karne wala subinterface list karo" } },
    { cmd: "show interfaces trunk", mode: "Privileged EXEC (switch)", does: { en: "Check that the port to the router is trunking and allows the routed VLANs", hi: "Check karo ki router wala port trunking kar raha hai aur routed VLANs allowed hain" } },
  ],
  mistakes: [
    {
      en: "Leaving R1's physical interface shut down. The subinterfaces follow Gi0/0, so none of them come up until you run `no shutdown` on Gi0/0 itself.",
      hi: "R1 ka physical interface shutdown chhod dena. Subinterfaces Gi0/0 ko follow karte hain, isliye jab tak Gi0/0 par `no shutdown` nahi karoge, koi subinterface up nahi hoga.",
    },
    {
      en: "Typing `ip address` before `encapsulation dot1Q` on a new subinterface. IOS rejects the address; set the encapsulation first.",
      hi: "Naye subinterface par `encapsulation dot1Q` se pehle `ip address` type karna. IOS address reject kar deta hai; pehle encapsulation set karo.",
    },
    {
      en: "Leaving the switch port to the router in access or dynamic auto mode. A router does not negotiate DTP, so configure `switchport mode trunk`, and check that the trunk allows every routed VLAN.",
      hi: "Router wale switch port ko access ya dynamic auto mode mein chhod dena. Router DTP negotiate nahi karta, isliye `switchport mode trunk` configure karo, aur check karo ki trunk har routed VLAN ko allow karta hai.",
    },
    {
      en: "Assuming the subinterface number sets the VLAN. Only `encapsulation dot1Q` does: `Gi0/0.10` with `encapsulation dot1Q 20` routes VLAN 20.",
      hi: "Yeh maan lena ki subinterface number VLAN decide karta hai. Yeh kaam sirf `encapsulation dot1Q` karta hai: `encapsulation dot1Q 20` wala `Gi0/0.10` VLAN 20 route karega.",
    },
    {
      en: "Forgetting `ip routing` on a Layer 3 switch. The SVIs come up and hosts can ping their own gateway, but nothing is routed between VLANs.",
      hi: "Layer 3 switch par `ip routing` bhool jaana. SVIs up ho jaate hain aur hosts apna gateway ping kar lete hain, lekin VLANs ke beech kuch route nahi hota.",
    },
    {
      en: "Expecting an SVI to come up just because you created it. The VLAN must exist, at least one port in it must be up, and the SVI needs `no shutdown`.",
      hi: "Yeh expect karna ki SVI banate hi up ho jaayega. VLAN exist karna chahiye, usme kam se kam ek port up hona chahiye, aur SVI par `no shutdown` chahiye.",
    },
  ],
  recap: [
    { en: "Each VLAN is its own subnet; traffic between VLANs needs a router or Layer 3 switch as the hosts' default gateway.", hi: "Har VLAN ek alag subnet hai; VLANs ke beech traffic ke liye router ya Layer 3 switch ko hosts ka default gateway banna padta hai." },
    { en: "Router-on-a-stick: one trunk, one subinterface per VLAN, `encapsulation dot1Q <vlan>` before the IP address, and `no shutdown` on the physical interface.", hi: "Router-on-a-stick: ek trunk, har VLAN ka ek subinterface, IP address se pehle `encapsulation dot1Q <vlan>`, aur physical interface par `no shutdown`." },
    { en: "An inter-VLAN packet crosses the ROAS trunk twice: up with the source VLAN's tag, down with the destination VLAN's tag. IPs stay the same; MACs are rewritten.", hi: "Inter-VLAN packet ROAS trunk ko do baar cross karta hai: upar source VLAN ke tag ke saath, neeche destination VLAN ke tag ke saath. IPs same rehte hain; MACs rewrite hote hain." },
    { en: "Native VLAN on a router: `encapsulation dot1Q 99 native` on a subinterface, or the IP address on the physical interface.", hi: "Router par native VLAN: subinterface par `encapsulation dot1Q 99 native`, ya IP address physical interface par." },
    { en: "Layer 3 switch: `ip routing`, then `interface vlan <id>` with an IP address and `no shutdown`; `no switchport` makes a routed port.", hi: "Layer 3 switch: `ip routing`, phir `interface vlan <id>` par IP address aur `no shutdown`; `no switchport` se routed port banta hai." },
    { en: "An SVI is up/up only if its VLAN exists and has an active port, and neither the VLAN nor the SVI is shut down.", hi: "SVI tabhi up/up hota hai jab uska VLAN exist kare aur usme active port ho, aur na VLAN shut down ho na SVI." },
  ],
  quiz: [
    {
      q: {
        en: "PC-A in VLAN 10 and PC-B in VLAN 20 are on the same Layer 2 switch. Why can PC-A not reach PC-B without a router or Layer 3 switch?",
        hi: "VLAN 10 ka PC-A aur VLAN 20 ka PC-B same Layer 2 switch par hain. Router ya Layer 3 switch ke bina PC-A, PC-B tak kyun nahi pahunch sakta?",
      },
      options: [
        { en: "The switch forwards frames only within a VLAN, and PC-B is in another subnet", hi: "Switch frames sirf ek VLAN ke andar forward karta hai, aur PC-B doosre subnet mein hai" },
        { en: "VLAN 10 and VLAN 20 frames use different EtherTypes", hi: "VLAN 10 aur VLAN 20 ke frames alag EtherTypes use karte hain" },
        { en: "The switch blocks ICMP between VLANs by default", hi: "Switch by default VLANs ke beech ICMP block karta hai" },
        { en: "Access ports cannot send frames to a trunk", hi: "Access ports trunk ko frames nahi bhej sakte" },
      ],
      answer: 0,
      explain: {
        en: "Each VLAN is a separate broadcast domain and subnet. PC-A sends off-subnet traffic to its default gateway, and a Layer 2 switch has no gateway to offer, so something must route. Nothing about EtherType or ICMP filtering is involved.",
        hi: "Har VLAN alag broadcast domain aur subnet hai. PC-A subnet ke bahar ka traffic apne default gateway ko bhejta hai, aur Layer 2 switch ke paas dene ko koi gateway nahi hai, isliye kisi ko routing karni padegi. EtherType ya ICMP filtering ka isse koi lena-dena nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Which sequence correctly makes a new subinterface the VLAN 20 gateway on a router-on-a-stick?",
        hi: "Router-on-a-stick par naye subinterface ko VLAN 20 ka gateway banane ka sahi sequence kaunsa hai?",
      },
      options: [
        { en: "`interface g0/0.20`, `ip address 192.168.20.1 255.255.255.0`, `encapsulation dot1Q 20`", hi: "Pehle `interface g0/0.20`, phir `ip address 192.168.20.1 255.255.255.0`, phir `encapsulation dot1Q 20`" },
        { en: "`interface g0/0.20`, `encapsulation dot1Q 20`, `ip address 192.168.20.1 255.255.255.0`", hi: "Pehle `interface g0/0.20`, phir `encapsulation dot1Q 20`, phir `ip address 192.168.20.1 255.255.255.0`" },
        { en: "`interface g0/0`, `switchport mode trunk`, `ip address 192.168.20.1 255.255.255.0`", hi: "Pehle `interface g0/0`, phir `switchport mode trunk`, phir `ip address 192.168.20.1 255.255.255.0`" },
        { en: "`interface vlan 20`, `encapsulation dot1Q 20`, `ip address 192.168.20.1 255.255.255.0`", hi: "Pehle `interface vlan 20`, phir `encapsulation dot1Q 20`, phir `ip address 192.168.20.1 255.255.255.0`" },
      ],
      answer: 1,
      explain: {
        en: "The subinterface must be tied to a VLAN before IOS accepts an IP address on it, so the encapsulation comes first. `switchport` commands are for switches, and `interface vlan` creates an SVI, which never takes an encapsulation command.",
        hi: "IOS subinterface par IP address tabhi leta hai jab woh kisi VLAN se juda ho, isliye encapsulation pehle aata hai. `switchport` commands switches ke liye hain, aur `interface vlan` SVI banata hai, jis par encapsulation command lagta hi nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "With router-on-a-stick, PC-A (VLAN 10) pings PC-B (VLAN 20). How does the echo request cross the trunk between SW1 and R1?",
        hi: "Router-on-a-stick mein PC-A (VLAN 10), PC-B (VLAN 20) ko ping karta hai. Echo request SW1 aur R1 ke beech trunk ko kaise cross karta hai?",
      },
      options: [
        { en: "Once, tagged 10", hi: "Ek baar, tag 10 ke saath" },
        { en: "Once, untagged", hi: "Ek baar, bina tag ke" },
        { en: "Twice: up to R1 tagged 20, back down tagged 10", hi: "Do baar: R1 tak tag 20, wapas neeche tag 10" },
        { en: "Twice: up to R1 tagged 10, back down tagged 20", hi: "Do baar: R1 tak tag 10, wapas neeche tag 20" },
      ],
      answer: 3,
      explain: {
        en: "The request enters SW1 in VLAN 10, so it goes up tagged 10. R1 routes it to Gi0/0.20 and sends it back down the same link tagged 20. The reply does the reverse.",
        hi: "Request SW1 mein VLAN 10 se aati hai, isliye upar tag 10 ke saath jaati hai. R1 use Gi0/0.20 par route karke usi link se tag 20 ke saath neeche bhejta hai. Reply iska ulta karta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A Layer 3 switch has SVIs Vlan10 (192.168.10.1/24) and Vlan20 (192.168.20.1/24), both up/up. Hosts can ping their own gateway but not hosts in the other VLAN, and `show ip route` shows `Default gateway is not set`. What is missing?",
        hi: "Ek Layer 3 switch par SVIs Vlan10 (192.168.10.1/24) aur Vlan20 (192.168.20.1/24) hain, dono up/up. Hosts apna gateway ping kar lete hain lekin doosre VLAN ke hosts ko nahi, aur `show ip route` mein `Default gateway is not set` aata hai. Kya missing hai?",
      },
      options: [
        { en: "`no shutdown` on the SVIs", hi: "SVIs par `no shutdown`" },
        { en: "`switchport mode trunk` on the access ports", hi: "Access ports par `switchport mode trunk`" },
        { en: "`ip routing` in global configuration", hi: "Global configuration mein `ip routing`" },
        { en: "`encapsulation dot1Q` under each SVI", hi: "Har SVI ke andar `encapsulation dot1Q`" },
      ],
      answer: 2,
      explain: {
        en: "`Default gateway is not set` is how IOS answers `show ip route` when IP routing is disabled. The SVIs are already up/up, so `no shutdown` is not the issue, and SVIs never use `encapsulation dot1Q`.",
        hi: "Jab IP routing disabled ho, tab IOS `show ip route` ka jawab `Default gateway is not set` se deta hai. SVIs pehle se up/up hain, isliye `no shutdown` problem nahi hai, aur SVIs par `encapsulation dot1Q` kabhi use nahi hota.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "`show ip interface brief` on a Layer 3 switch shows `Vlan30  192.168.30.1  YES manual up  down`. VLAN 30 exists. What is the most likely cause?",
        hi: "Layer 3 switch par `show ip interface brief` mein `Vlan30  192.168.30.1  YES manual up  down` dikhta hai. VLAN 30 exist karta hai. Sabse likely cause kya hai?",
      },
      options: [
        { en: "The SVI still needs `no shutdown`", hi: "SVI ko abhi `no shutdown` chahiye" },
        { en: "No port in VLAN 30 is up: no active access port and no trunk carrying VLAN 30", hi: "VLAN 30 ka koi port up nahi hai: na koi active access port, na VLAN 30 carry karne wala trunk" },
        { en: "`ip routing` is not configured", hi: "`ip routing` configure nahi hai" },
        { en: "The subnet mask is wrong", hi: "Subnet mask galat hai" },
      ],
      answer: 1,
      explain: {
        en: "A shut SVI shows `administratively down  down`, so `no shutdown` is already done. Status up with protocol down means the line protocol is waiting for an up port in VLAN 30 to keep the SVI alive. `ip routing` and the mask do not change an SVI's status.",
        hi: "Shut kiya hua SVI `administratively down  down` dikhata hai, matlab `no shutdown` toh ho chuka hai. Status up aur protocol down ka matlab hai ki line protocol VLAN 30 mein kisi up port ka wait kar raha hai jo SVI ko zinda rakhe. `ip routing` aur mask SVI ka status nahi badalte.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "The trunk between SW1 and R1 uses native VLAN 99. Which R1 configuration lets hosts in VLAN 99 use 192.168.99.1 as their gateway?",
        hi: "SW1 aur R1 ke beech trunk ka native VLAN 99 hai. R1 par kaunsi configuration VLAN 99 ke hosts ko 192.168.99.1 gateway ke roop mein use karne degi?",
      },
      options: [
        { en: "`interface g0/0.99`, `encapsulation dot1Q 99 native`, `ip address 192.168.99.1 255.255.255.0`", hi: "`interface g0/0.99` mein `encapsulation dot1Q 99 native` aur `ip address 192.168.99.1 255.255.255.0`" },
        { en: "`interface g0/0.99`, `encapsulation dot1Q 1`, `ip address 192.168.99.1 255.255.255.0`", hi: "`interface g0/0.99` mein `encapsulation dot1Q 1` aur `ip address 192.168.99.1 255.255.255.0`" },
        { en: "`interface g0/0`, `switchport trunk native vlan 99`", hi: "`interface g0/0` mein `switchport trunk native vlan 99`" },
        { en: "Nothing; a router routes native VLAN frames automatically", hi: "Kuch nahi; router native VLAN frames apne aap route karta hai" },
      ],
      answer: 0,
      explain: {
        en: "Native VLAN frames arrive untagged, and `native` tells R1 that untagged frames belong to this subinterface. Putting the address on the physical interface would also work. `switchport` is not a router command, and VLAN 1 is the wrong VLAN.",
        hi: "Native VLAN ke frames bina tag ke aate hain, aur `native` R1 ko batata hai ki untagged frames is subinterface ke hain. Address ko physical interface par lagana bhi chalega. `switchport` router ka command nahi hai, aur VLAN 1 galat VLAN hai.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "Jl9OOzNaBDU",
      title: "Free CCNA | VLANs (Part 2) | Day 17",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Router-on-a-stick starts at 27:00, after the trunking part you covered in lesson 2.2.",
        hi: "Router-on-a-stick 27:00 se shuru hota hai, trunking wale part ke baad jo tum lesson 2.2 mein padh chuke ho.",
      },
    },
    {
      id: "OkPB028l2eE",
      title: "Free CCNA | VLANs (Part 3) | Day 18",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "The native VLAN on a router, then Layer 3 switches, SVIs and the rules for an SVI to be up/up.",
        hi: "Router par native VLAN, phir Layer 3 switches, SVIs aur SVI ke up/up hone ke rules.",
      },
    },
    {
      id: "SRREnklHwvM",
      title: "94. Free CCNA (NEW) | Inter VLAN in Hindi - Router On A Stick",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "Router-on-a-stick explained and configured in Hindi.",
        hi: "Router-on-a-stick ka Hindi mein explanation aur configuration.",
      },
    },
    {
      id: "zfxMqD8G5OY",
      title: "39. Inter VLAN Routing | CCNA 200-301 (Hindi)",
      channel: "NetworkPath",
      lang: "hi",
      note: {
        en: "A second Hindi walkthrough of inter-VLAN routing.",
        hi: "Inter-VLAN routing ka ek aur Hindi walkthrough.",
      },
    },
  ],
  lab: {
    title: { en: "Build router-on-a-stick, then replace it with SVIs", hi: "Router-on-a-stick banao, phir use SVIs se replace karo" },
    steps: [
      {
        en: "In Packet Tracer, connect a 2911 router's Gi0/0 to a 2960 switch's Gi0/1. Put PC-A (192.168.10.10/24, gateway 192.168.10.1) on Fa0/1 and PC-B (192.168.20.20/24, gateway 192.168.20.1) on Fa0/2.",
        hi: "Packet Tracer mein 2911 router ka Gi0/0, 2960 switch ke Gi0/1 se jodo. PC-A (192.168.10.10/24, gateway 192.168.10.1) ko Fa0/1 par aur PC-B (192.168.20.20/24, gateway 192.168.20.1) ko Fa0/2 par lagao.",
      },
      {
        en: "On SW1 create VLANs 10 and 20, make Fa0/1 an access port in VLAN 10 and Fa0/2 an access port in VLAN 20, and set Gi0/1 to `switchport mode trunk`.",
        hi: "SW1 par VLANs 10 aur 20 banao, Fa0/1 ko VLAN 10 ka aur Fa0/2 ko VLAN 20 ka access port banao, aur Gi0/1 par `switchport mode trunk` set karo.",
      },
      {
        en: "On R1 run `no shutdown` on Gi0/0, then build Gi0/0.10 and Gi0/0.20 with `encapsulation dot1Q` and the gateway addresses. Check `show ip interface brief` and `show ip route`.",
        hi: "R1 par Gi0/0 par `no shutdown` karo, phir `encapsulation dot1Q` aur gateway addresses ke saath Gi0/0.10 aur Gi0/0.20 banao. `show ip interface brief` aur `show ip route` check karo.",
      },
      {
        en: "Ping PC-B from PC-A in Simulation mode. Open the frame each time it crosses the trunk and find the 802.1Q tag: 10 on the way up, 20 on the way down.",
        hi: "Simulation mode mein PC-A se PC-B ko ping karo. Frame jab bhi trunk cross kare, use kholo aur 802.1Q tag dhoondho: upar jaate waqt 10, neeche aate waqt 20.",
      },
      {
        en: "Try the order trap: create Gi0/0.30 and enter `ip address` before `encapsulation dot1Q 30`. Read the error, then fix the order.",
        hi: "Order wala trap try karo: Gi0/0.30 banao aur `encapsulation dot1Q 30` se pehle `ip address` do. Error padho, phir order theek karo.",
      },
      {
        en: "Replace R1 and SW1 with a 3560 multilayer switch: `ip routing`, VLANs 10 and 20, and SVIs with `no shutdown`. Ping again, then remove `ip routing` with `no ip routing` and watch the ping fail.",
        hi: "R1 aur SW1 ki jagah 3560 multilayer switch lagao: `ip routing`, VLANs 10 aur 20, aur `no shutdown` ke saath SVIs. Dobara ping karo, phir `no ip routing` se routing hatao aur ping fail hote dekho.",
      },
    ],
  },
};

export default lesson;
