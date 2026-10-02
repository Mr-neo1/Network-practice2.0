import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "vlans",
  intro: {
    en: "Out of the box, every port on a switch is in the same broadcast domain. That is fine for ten PCs, but on a floor of 200 devices every ARP and DHCP broadcast reaches everyone, and the HR payroll PC is one frame away from a visitor's laptop. VLANs split one physical switch into several separate LANs, each with its own broadcast domain and usually its own subnet. Nearly every switch port you configure at work is assigned to a VLAN.",
    hi: "Naye switch ke saare ports ek hi broadcast domain mein hote hain. Das PCs ke liye yeh theek hai, lekin 200 devices wale floor par har ARP aur DHCP broadcast sabke paas pahunchta hai, aur HR ka payroll PC kisi visitor ke laptop se bas ek frame door hota hai. VLANs ek physical switch ko kai alag LANs mein baant dete hain, har ek ka apna broadcast domain aur aam taur par apna subnet. Kaam par tum jo bhi switch port configure karoge, lagbhag har ek kisi VLAN mein assign hoga.",
  },
  outcomes: [
    { en: "Explain what a VLAN is and why networks use them", hi: "Samjha sako ki VLAN kya hai aur networks inhe kyun use karte hain" },
    { en: "Recall the normal and extended VLAN ranges and the VLANs you cannot delete", hi: "Normal aur extended VLAN ranges bata sako, aur woh VLANs bhi jo delete nahi ho sakte" },
    { en: "Create and name VLANs and assign access ports to them", hi: "VLANs create aur name kar sako, aur access ports unme assign kar sako" },
    { en: "Configure a data VLAN and a voice VLAN on one port for an IP phone with a PC behind it", hi: "Ek hi port par data VLAN aur voice VLAN configure kar sako, jahan IP phone ke peeche PC laga ho" },
    { en: "Read `show vlan brief` and `show interfaces switchport` to find a port's VLAN", hi: "`show vlan brief` aur `show interfaces switchport` padh kar kisi port ka VLAN pata kar sako" },
    { en: "Predict which hosts receive a broadcast, and explain why two VLANs need a router to talk", hi: "Predict kar sako ki broadcast kin hosts tak jayega, aur samjha sako ki do VLANs ko baat karne ke liye router kyun chahiye" },
  ],
  sections: [
    {
      id: "why-vlans",
      heading: { en: "The problem: one big broadcast domain", hi: "Problem: ek bada broadcast domain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In the switching lesson you saw that a switch floods a broadcast out of every port except the one it came in on. So all the ports of a switch, and of every switch connected to it, form one **broadcast domain**. Every ARP request and every DHCP Discover reaches every device, and each device has to stop and read it.",
            hi: "Switching lesson mein dekha tha ki switch broadcast ko har port se flood karta hai, sirf incoming port chhod kar. Matlab switch ke saare ports, aur usse jude har switch ke ports, milkar ek **broadcast domain** bante hain. Har ARP request aur har DHCP Discover har device tak pahunchta hai, aur har device ko ruk kar use padhna padta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "A **VLAN (virtual LAN)** is a group of switch ports that the switch treats as a separate LAN. A broadcast that arrives on a VLAN 10 port is flooded only to the other VLAN 10 ports. Inside the switch, a frame is never forwarded from one VLAN into another. One physical switch now behaves like several separate switches.",
            hi: "**VLAN (virtual LAN)** switch ports ka ek group hai jise switch ek alag LAN ki tarah treat karta hai. VLAN 10 ke port par aaya broadcast sirf VLAN 10 ke baaki ports par flood hota hai. Switch ke andar koi frame ek VLAN se doosre VLAN mein kabhi forward nahi hota. Ek physical switch ab kai alag switches ki tarah kaam karta hai.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "Picture an open-plan office where you put up soundproof partitions. The building, power and cabling stay the same, but a shout in the Sales room is heard only in Sales. To talk to HR you have to go through a door, and in a network that door is a router.",
            hi: "Ek open-plan office socho jisme tumne soundproof partitions laga diye. Building, power aur cabling wahi hai, lekin Sales room mein koi zor se bole toh sirf Sales wale sunte hain. HR se baat karni hai toh ek door se hokar jaana padega, aur network mein woh door router hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Smaller broadcast domains.** Fewer devices receive each broadcast, and a broadcast storm or a faulty network card hurts one VLAN instead of the whole site.",
              hi: "**Chhote broadcast domains.** Har broadcast kam devices tak pahunchta hai, aur broadcast storm ya kharab network card poori site ki jagah sirf ek VLAN ko nuksaan pahunchata hai.",
            },
            {
              en: "**Security.** Hosts in different VLANs cannot exchange frames directly. Their traffic must pass through a router or Layer 3 switch, where ACLs (lessons 5.4 and 5.5) can filter it.",
              hi: "**Security.** Alag VLANs ke hosts seedha frames exchange nahi kar sakte. Unka traffic router ya Layer 3 switch se hokar hi jaata hai, jahan ACLs (lesson 5.4 aur 5.5) use filter kar sakte hain.",
            },
            {
              en: "**Grouping by role, not by desk.** HR users on floor 1 and floor 3 can share one VLAN, because trunks (next lesson) carry VLANs between switches.",
              hi: "**Desk ke hisaab se nahi, role ke hisaab se grouping.** Floor 1 aur floor 3 ke HR users ek hi VLAN mein ho sakte hain, kyunki trunks (agla lesson) VLANs ko switches ke beech le jaate hain.",
            },
            {
              en: "**Separate traffic types.** IP phones, cameras and device management get their own VLANs, so QoS and security rules can treat them differently.",
              hi: "**Traffic types alag rakhna.** IP phones, cameras aur device management ko apne VLANs milte hain, taaki QoS aur security rules unhe alag tarah se treat kar sakein.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Counting domains", hi: "Domains ginna" },
          text: {
            en: "VLANs split broadcast domains; switch ports split collision domains. One switch with hosts in VLANs 10, 20 and 30 has three broadcast domains, even though it is one box.",
            hi: "VLANs broadcast domains ko baantte hain; switch ports collision domains ko. Ek switch jisme hosts VLAN 10, 20 aur 30 mein hain, usme teen broadcast domains hain, bhale hi box ek hi hai.",
          },
        },
      ],
    },
    {
      id: "vlan-ids",
      heading: { en: "VLAN numbers and the default VLAN", hi: "VLAN numbers aur default VLAN" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A VLAN is identified by a number, the **VLAN ID**. It is 12 bits long, so the values run from 0 to 4095. IDs 0 and 4095 are reserved, which leaves 1 to 4094 for use. Cisco splits them into a normal range and an extended range.",
            hi: "VLAN ki pehchaan ek number se hoti hai, jise **VLAN ID** kehte hain. Yeh 12 bits ka hota hai, isliye values 0 se 4095 tak jaati hain. 0 aur 4095 reserved hain, toh use ke liye 1 se 4094 bachte hain. Cisco inhe normal range aur extended range mein baantta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "VLAN ID ranges on a Catalyst switch", hi: "Catalyst switch par VLAN ID ranges" },
          columns: [{ en: "VLAN IDs", hi: "VLAN IDs" }, { en: "Range", hi: "Range" }, { en: "What to know", hi: "Kya yaad rakhna hai" }],
          rows: [
            ["1", { en: "Normal", hi: "Normal" }, { en: "The default VLAN. Every port starts in it. It cannot be deleted or renamed.", hi: "Default VLAN. Har port isi mein shuru hota hai. Ise delete ya rename nahi kar sakte." }],
            ["2-1001", { en: "Normal", hi: "Normal" }, { en: "Create, name and delete these freely. Most user VLANs live here.", hi: "Inhe aaram se create, name aur delete karo. Zyadatar user VLANs yahin hote hain." }],
            ["1002-1005", { en: "Normal", hi: "Normal" }, { en: "Created automatically for old Token Ring and FDDI networks. They cannot be deleted and are not used today.", hi: "Purane Token Ring aur FDDI networks ke liye automatically bante hain. Delete nahi hote aur aaj use nahi hote." }],
            ["1006-4094", { en: "Extended", hi: "Extended" }, { en: "Usable on current switches. VTP versions 1 and 2 cannot advertise them, so on many switches running those versions you must enter `vtp mode transparent` before IOS lets you create them (next lesson).", hi: "Aaj ke switches par use kar sakte ho. VTP version 1 aur 2 inhe advertise nahi kar sakte, isliye un versions wale kai switches par inhe banane se pehle `vtp mode transparent` daalna padta hai, warna IOS create hi nahi karne deta (agla lesson)." }],
            ["0, 4095", { en: "Reserved", hi: "Reserved" }, { en: "Never assigned to traffic.", hi: "Kabhi traffic ko assign nahi hote." }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Keep users out of VLAN 1", hi: "Users ko VLAN 1 se bahar rakho" },
          text: {
            en: "VLAN 1 is also the default native VLAN on trunks, and switches send control traffic such as CDP, VTP and DTP in it. Best practice is to put users in other VLANs, and to move unused ports into an unused VLAN and shut them down.",
            hi: "VLAN 1 trunks par default native VLAN bhi hai, aur switches CDP, VTP aur DTP jaisa control traffic isi mein bhejte hain. Best practice yeh hai ki users ko doosre VLANs mein rakho, aur unused ports ko ek unused VLAN mein daal kar shut down kar do.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Where VLANs are saved", hi: "VLANs kahan save hote hain" },
          text: {
            en: "In the default VTP mode (server), a Catalyst switch keeps normal-range VLANs in a file called `vlan.dat` in flash, not in the startup-config. So `erase startup-config` and a reload leave your VLANs in place. To wipe a lab switch completely, also run `delete flash:vlan.dat`.",
            hi: "Default VTP mode (server) mein Catalyst switch normal-range VLANs ko flash ki `vlan.dat` file mein rakhta hai, startup-config mein nahi. Isliye `erase startup-config` aur reload ke baad bhi tumhare VLANs wahi rehte hain. Lab switch ko poori tarah saaf karna hai toh `delete flash:vlan.dat` bhi chalao.",
          },
        },
      ],
    },
    {
      id: "access-ports",
      heading: { en: "Creating VLANs and access ports", hi: "VLAN banana aur access ports" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An **access port** belongs to one data VLAN and connects an end device: a PC, printer, server or camera. Frames on an access port are ordinary untagged Ethernet frames. The PC has no idea it is in a VLAN; the switch decides the VLAN from the port the frame arrives on.",
            hi: "**Access port** ek data VLAN ka hota hai aur end device ko connect karta hai: PC, printer, server ya camera. Access port par frames normal untagged Ethernet frames hote hain. PC ko pata hi nahi hota ki woh kisi VLAN mein hai; switch yeh us port se decide karta hai jis par frame aaya.",
          },
        },
        {
          type: "cli",
          title: { en: "SW1: create VLANs 10 and 20, then assign ports", hi: "SW1: VLAN 10 aur 20 banao, phir ports assign karo" },
          lines: [
            { prompt: "SW1(config)#", cmd: "vlan 10", comment: { en: "Creates VLAN 10 and enters VLAN configuration mode", hi: "VLAN 10 banata hai aur VLAN configuration mode mein le jaata hai" } },
            { prompt: "SW1(config-vlan)#", cmd: "name SALES" },
            { prompt: "SW1(config-vlan)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "vlan 20" },
            { prompt: "SW1(config-vlan)#", cmd: "name HR" },
            { prompt: "SW1(config-vlan)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "interface range fastEthernet0/1 - 2", comment: { en: "Configure Fa0/1 and Fa0/2 together", hi: "Fa0/1 aur Fa0/2 ek saath configure karo" } },
            { prompt: "SW1(config-if-range)#", cmd: "switchport mode access", comment: { en: "Fix the mode so the port can never become a trunk", hi: "Mode fix karo taaki port kabhi trunk na ban sake" } },
            { prompt: "SW1(config-if-range)#", cmd: "switchport access vlan 10" },
            { prompt: "SW1(config-if-range)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "interface range fastEthernet0/3 - 4" },
            { prompt: "SW1(config-if-range)#", cmd: "switchport mode access" },
            { prompt: "SW1(config-if-range)#", cmd: "switchport access vlan 20" },
          ],
          note: {
            en: "A VLAN you do not name gets a default name such as `VLAN0010`. If you assign a port to a VLAN that does not exist yet, IOS creates it for you and says so: `% Access VLAN does not exist. Creating vlan 30`.",
            hi: "Jis VLAN ko naam nahi doge, use `VLAN0010` jaisa default naam mil jaata hai. Agar port ko aise VLAN mein assign karo jo abhi exist nahi karta, toh IOS use khud bana deta hai aur batata bhi hai: `% Access VLAN does not exist. Creating vlan 30`.",
          },
        },
        {
          type: "p",
          text: {
            en: "Why `switchport mode access`? On most Catalyst switches the default mode is **dynamic auto**, which lets the port turn into a trunk if the device on the other end asks for one with DTP (next lesson). Setting the mode by hand removes that possibility.",
            hi: "`switchport mode access` kyun? Zyadatar Catalyst switches par default mode **dynamic auto** hota hai, jisme agar doosre end ka device DTP se trunk maange toh port trunk ban sakta hai (agla lesson). Mode haath se set karne par yeh possibility khatam ho jaati hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Deleting a VLAN strands its ports", hi: "VLAN delete kiya toh ports atak jaate hain" },
          text: {
            en: "`no vlan 20` deletes the VLAN, but Fa0/3 and Fa0/4 stay assigned to VLAN 20. They do not fall back to VLAN 1. They become inactive, stop forwarding, and disappear from `show vlan brief`. Move the ports first, or create VLAN 20 again to bring them back.",
            hi: "`no vlan 20` VLAN ko delete kar deta hai, lekin Fa0/3 aur Fa0/4 VLAN 20 mein hi assigned rehte hain. Woh VLAN 1 mein wapas nahi jaate. Woh inactive ho jaate hain, forwarding band kar dete hain, aur `show vlan brief` se gayab ho jaate hain. Pehle ports ko move karo, ya VLAN 20 dobara banao taaki woh wapas aa jaayein.",
          },
        },
      ],
    },
    {
      id: "voice-vlan",
      heading: { en: "An IP phone and a PC on one port", hi: "Ek port par IP phone aur PC" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Most desks have one network cable. A Cisco IP phone has a small 3-port switch inside it: one port goes to the wall (the access switch), one goes to the PC, and one internal port serves the phone itself. The phone usually takes its power from the switch port as well (PoE, lesson 0.6).",
            hi: "Zyadatar desks par ek hi network cable hoti hai. Cisco IP phone ke andar ek chhota 3-port switch hota hai: ek port wall ki taraf (access switch tak), ek PC ke liye, aur ek internal port phone ke liye. Phone aksar apni power bhi switch port se hi leta hai (PoE, lesson 0.6).",
          },
        },
        {
          type: "p",
          text: {
            en: "You want voice in its own VLAN, so it gets its own subnet and QoS can give it priority (lesson 4.9), while the PC stays in the normal data VLAN. So the switch port carries two VLANs: the **data VLAN** (the access VLAN) untagged, and the **voice VLAN** with an 802.1Q tag on every frame.",
            hi: "Voice ko apna alag VLAN chahiye, taaki uska apna subnet ho aur QoS use priority de sake (lesson 4.9), jabki PC normal data VLAN mein hi rahe. Isliye switch port do VLANs carry karta hai: **data VLAN** (access VLAN) bina tag ke, aur **voice VLAN** jiske har frame par 802.1Q tag hota hai.",
          },
        },
        {
          type: "cli",
          title: { en: "SW1: PC5 in VLAN 10, the phone in voice VLAN 100", hi: "SW1: PC5 VLAN 10 mein, phone voice VLAN 100 mein" },
          lines: [
            { prompt: "SW1(config)#", cmd: "vlan 100" },
            { prompt: "SW1(config-vlan)#", cmd: "name VOICE" },
            { prompt: "SW1(config-vlan)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "interface fastEthernet0/5" },
            { prompt: "SW1(config-if)#", cmd: "switchport mode access" },
            { prompt: "SW1(config-if)#", cmd: "switchport access vlan 10", comment: { en: "Data VLAN: the PC's untagged frames", hi: "Data VLAN: PC ke untagged frames" } },
            { prompt: "SW1(config-if)#", cmd: "switchport voice vlan 100", comment: { en: "Voice VLAN: the phone's tagged frames", hi: "Voice VLAN: phone ke tagged frames" } },
          ],
        },
        {
          type: "steps",
          items: [
            {
              en: "SW1 tells the phone \"your voice VLAN is 100\" in a CDP message. Phones from other vendors learn it with LLDP-MED.",
              hi: "SW1 phone ko CDP message mein batata hai ki \"tumhara voice VLAN 100 hai\". Doosre vendors ke phones yeh LLDP-MED se seekhte hain.",
            },
            {
              en: "The phone sends its own frames with an 802.1Q tag carrying VLAN ID 100 and a priority (CoS) value; the voice itself is marked CoS 5.",
              hi: "Phone apne frames 802.1Q tag ke saath bhejta hai, jisme VLAN ID 100 aur ek priority (CoS) value hoti hai; voice khud CoS 5 se mark hoti hai.",
            },
            {
              en: "PC5's frames pass through the phone's built-in switch untagged.",
              hi: "PC5 ke frames phone ke built-in switch se bina tag ke guzarte hain.",
            },
            {
              en: "SW1 puts frames tagged 100 into VLAN 100, and untagged frames into the access VLAN, 10.",
              hi: "SW1 tag 100 wale frames ko VLAN 100 mein daalta hai, aur untagged frames ko access VLAN 10 mein.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "What crosses Fa0/5", hi: "Fa0/5 par kya aata-jaata hai" },
          columns: [{ en: "Traffic", hi: "Traffic" }, { en: "Sent by", hi: "Kaun bhejta hai" }, { en: "On the cable", hi: "Cable par" }, { en: "VLAN on SW1", hi: "SW1 par VLAN" }],
          rows: [
            [{ en: "Voice and call setup", hi: "Voice aur call setup" }, "IP phone", { en: "802.1Q tag, VLAN 100 (voice marked CoS 5)", hi: "802.1Q tag, VLAN 100 (voice CoS 5 se marked)" }, "100 VOICE"],
            [{ en: "Web, email, files", hi: "Web, email, files" }, "PC5", { en: "Untagged", hi: "Untagged" }, "10 SALES"],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Still an access port", hi: "Phir bhi access port hai" },
          text: {
            en: "A port with a voice VLAN is still an access port, not a trunk. `show interfaces switchport` shows `Operational Mode: static access`, and the port does not appear in `show interfaces trunk`. Cisco calls it a multi-VLAN access port.",
            hi: "Voice VLAN wala port bhi access port hi hai, trunk nahi. `show interfaces switchport` mein `Operational Mode: static access` dikhta hai, aur yeh port `show interfaces trunk` mein nahi aata. Cisco ise multi-VLAN access port kehta hai.",
          },
        },
      ],
    },
    {
      id: "verify",
      heading: { en: "Checking your work", hi: "Apna kaam check karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "`show vlan brief` lists every VLAN with its name, status and access ports. Run it after every VLAN change.",
            hi: "`show vlan brief` har VLAN ko uske naam, status aur access ports ke saath dikhata hai. Har VLAN change ke baad ise chalao.",
          },
        },
        {
          type: "cli",
          title: { en: "SW1 after the configuration above", hi: "Upar wali configuration ke baad SW1" },
          lines: [
            { prompt: "SW1#", cmd: "show vlan brief" },
            { out: "VLAN Name                             Status    Ports" },
            { out: "---- -------------------------------- --------- -------------------------------" },
            { out: "1    default                          active    Fa0/6, Fa0/7, Fa0/8, Fa0/9", comment: { en: "Ports you have not touched stay in VLAN 1 (list shortened)", hi: "Jin ports ko chhua nahi, woh VLAN 1 mein hi rehte hain (list chhoti ki gayi hai)" } },
            { out: "10   SALES                            active    Fa0/1, Fa0/2, Fa0/5" },
            { out: "20   HR                               active    Fa0/3, Fa0/4" },
            { out: "100  VOICE                            active    Fa0/5", comment: { en: "Fa0/5 is listed twice: data VLAN 10 and voice VLAN 100", hi: "Fa0/5 do baar dikhta hai: data VLAN 10 aur voice VLAN 100" } },
            { out: "1002 fddi-default                     act/unsup" },
            { out: "1003 token-ring-default               act/unsup" },
            { out: "1004 fddinet-default                  act/unsup" },
            { out: "1005 trnet-default                    act/unsup", comment: { en: "The four legacy VLANs are always listed", hi: "Chaaron legacy VLANs hamesha list mein rehte hain" } },
          ],
          note: {
            en: "Trunk ports (next lesson) never appear in `show vlan brief`. If a port is missing from the list, it is probably a trunk, or its VLAN was deleted.",
            hi: "Trunk ports (agla lesson) `show vlan brief` mein kabhi nahi dikhte. Koi port list se gayab hai toh shayad woh trunk hai, ya uska VLAN delete ho chuka hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "`show interfaces switchport` shows one port in detail: the mode you configured, the mode it is actually running in, and its VLANs.",
            hi: "`show interfaces switchport` ek port ko detail mein dikhata hai: tumne kaunsa mode configure kiya, port asal mein kis mode mein chal raha hai, aur uske VLANs.",
          },
        },
        {
          type: "cli",
          lines: [
            { prompt: "SW1#", cmd: "show interfaces fastEthernet0/5 switchport" },
            { out: "Name: Fa0/5" },
            { out: "Switchport: Enabled" },
            { out: "Administrative Mode: static access", comment: { en: "What you configured", hi: "Jo tumne configure kiya" } },
            { out: "Operational Mode: static access", comment: { en: "What the port is doing now", hi: "Port abhi kya kar raha hai" } },
            { out: "Administrative Trunking Encapsulation: dot1q" },
            { out: "Operational Trunking Encapsulation: native" },
            { out: "Negotiation of Trunking: Off", comment: { en: "Mode is fixed, so DTP does not negotiate", hi: "Mode fixed hai, isliye DTP negotiate nahi karta" } },
            { out: "Access Mode VLAN: 10 (SALES)" },
            { out: "Trunking Native Mode VLAN: 1 (default)" },
            { out: "Administrative Native VLAN tagging: enabled" },
            { out: "Voice VLAN: 100 (VOICE)" },
          ],
          note: {
            en: "If the access VLAN has been deleted, this line reads `Access Mode VLAN: 20 (Inactive)`.",
            hi: "Agar access VLAN delete ho chuka ho, toh yeh line `Access Mode VLAN: 20 (Inactive)` dikhati hai.",
          },
        },
      ],
    },
    {
      id: "between-vlans",
      heading: { en: "Each VLAN is its own subnet", hi: "Har VLAN ka apna subnet" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Because a VLAN is a separate broadcast domain, it gets its own IP subnet, and a host's IP settings must match the VLAN of the port it is plugged into. This is the plan used in this lesson and its animation.",
            hi: "VLAN ek alag broadcast domain hai, isliye use apna IP subnet milta hai, aur host ki IP settings us port ke VLAN se match honi chahiye jisme woh laga hai. Is lesson aur animation mein yeh plan use hua hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Addressing plan", hi: "Addressing plan" },
          columns: ["VLAN", { en: "Name", hi: "Naam" }, "Subnet", { en: "Gateway (added in lesson 2.3)", hi: "Gateway (lesson 2.3 mein lagega)" }],
          rows: [
            ["10", "SALES", "10.1.10.0/24", "10.1.10.1"],
            ["20", "HR", "10.1.20.0/24", "10.1.20.1"],
            ["100", "VOICE", "10.1.100.0/24", "10.1.100.1"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Now PC1 (10.1.10.11) pings PC3 (10.1.20.13). PC3 is in another subnet, so PC1 ARPs for its default gateway, 10.1.10.1. That ARP broadcast is flooded only inside VLAN 10. No router is attached to VLAN 10 yet, so nothing answers and the ping fails. Moving packets between VLANs is routing; lesson 2.3 adds a router or Layer 3 switch as the gateway for each VLAN.",
            hi: "Ab PC1 (10.1.10.11), PC3 (10.1.20.13) ko ping karta hai. PC3 doosre subnet mein hai, isliye PC1 apne default gateway 10.1.10.1 ke liye ARP karta hai. Woh ARP broadcast sirf VLAN 10 ke andar flood hota hai. VLAN 10 mein abhi koi router nahi hai, toh koi jawab nahi aata aur ping fail ho jaata hai. VLANs ke beech packets le jaana routing hai; lesson 2.3 mein har VLAN ke gateway ke liye router ya Layer 3 switch lagayenge.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "VLAN 10 on SW1 and VLAN 10 on SW2 act as one VLAN only when a trunk joins the switches (next lesson).",
              hi: "SW1 ka VLAN 10 aur SW2 ka VLAN 10 tabhi ek VLAN ki tarah kaam karte hain jab dono switches ke beech trunk ho (agla lesson).",
            },
            {
              en: "The MAC address table stores a VLAN in every entry, and the switch only forwards between ports of the same VLAN. `show mac address-table vlan 10` lists only the MACs learned in VLAN 10.",
              hi: "MAC address table ki har entry mein VLAN bhi store hota hai, aur switch sirf same VLAN ke ports ke beech forward karta hai. `show mac address-table vlan 10` sirf VLAN 10 mein seekhe gaye MACs dikhata hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The port decides the VLAN, not the IP", hi: "VLAN port decide karta hai, IP nahi" },
          text: {
            en: "If PC1 is moved to Fa0/3 but keeps 10.1.10.11, it is now in VLAN 20 with the HR hosts. Its ARP for 10.1.10.1 goes only to VLAN 20, the gateway is never found, and the PC is cut off. Either put the port back in VLAN 10 or give the PC an HR address.",
            hi: "Agar PC1 ko Fa0/3 par shift karo lekin 10.1.10.11 hi rehne do, toh ab woh HR hosts ke saath VLAN 20 mein hai. 10.1.10.1 ke liye uska ARP sirf VLAN 20 mein jaata hai, gateway kabhi nahi milta, aur PC kat jaata hai. Ya toh port ko wapas VLAN 10 mein daalo, ya PC ko HR ka address do.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "VLAN", def: { en: "A group of switch ports that forms its own broadcast domain, as if it were a separate switch.", hi: "Switch ports ka group jo apna alag broadcast domain banata hai, jaise woh ek alag switch ho." } },
    { term: "Broadcast domain", def: { en: "The set of devices that receive each other's broadcasts. One VLAN is one broadcast domain.", hi: "Devices ka woh set jo ek doosre ke broadcasts receive karte hain. Ek VLAN ek broadcast domain hai." } },
    { term: "VLAN ID", def: { en: "The 12-bit number that identifies a VLAN; usable values are 1 to 4094.", hi: "12-bit number jisse VLAN pehchana jaata hai; use hone wali values 1 se 4094 hain." } },
    { term: "Access port", def: { en: "A switch port in one data VLAN that sends and receives untagged frames, used for end devices.", hi: "Ek data VLAN wala switch port jo untagged frames bhejta aur leta hai, end devices ke liye use hota hai." } },
    { term: "Default VLAN", def: { en: "VLAN 1. Every port starts in it, and it cannot be deleted or renamed.", hi: "VLAN 1. Har port isi mein shuru hota hai, aur ise delete ya rename nahi kar sakte." } },
    { term: "Voice VLAN", def: { en: "A second VLAN on an access port that an IP phone uses for tagged voice frames, while the PC behind it uses the data VLAN.", hi: "Access port par doosra VLAN jo IP phone tagged voice frames ke liye use karta hai, jabki uske peeche laga PC data VLAN use karta hai." } },
    { term: "Extended range", def: { en: "VLAN IDs 1006 to 4094. The normal range is 1 to 1005.", hi: "VLAN IDs 1006 se 4094 tak. Normal range 1 se 1005 hai." } },
    { term: "vlan.dat", def: { en: "The file in flash where a Catalyst switch stores its VLAN database by default.", hi: "Flash ki woh file jisme Catalyst switch by default apna VLAN database rakhta hai." } },
  ],
  commands: [
    { cmd: "vlan 10", mode: "Global configuration", does: { en: "Create VLAN 10 (if new) and enter VLAN configuration mode", hi: "VLAN 10 banao (agar naya hai) aur VLAN configuration mode mein jao" } },
    { cmd: "name SALES", mode: "VLAN configuration", does: { en: "Give the VLAN a name (up to 32 characters)", hi: "VLAN ko naam do (32 characters tak)" } },
    { cmd: "no vlan 20", mode: "Global configuration", does: { en: "Delete VLAN 20; its ports stay assigned to it and go inactive", hi: "VLAN 20 delete karo; uske ports usi mein assigned reh kar inactive ho jaate hain" } },
    { cmd: "interface range fastEthernet0/1 - 2", mode: "Global configuration", does: { en: "Configure several interfaces at once", hi: "Kai interfaces ek saath configure karo" } },
    { cmd: "switchport mode access", mode: "Interface configuration", does: { en: "Make the port a permanent access port that never trunks", hi: "Port ko permanent access port banao jo kabhi trunk nahi banega" } },
    { cmd: "switchport access vlan 10", mode: "Interface configuration", does: { en: "Put the access port in data VLAN 10", hi: "Access port ko data VLAN 10 mein daalo" } },
    { cmd: "switchport voice vlan 100", mode: "Interface configuration", does: { en: "Add voice VLAN 100 for an IP phone on the port", hi: "Port par IP phone ke liye voice VLAN 100 add karo" } },
    { cmd: "show vlan brief", mode: "Privileged EXEC", does: { en: "List VLANs, their status and their access ports", hi: "VLANs, unka status aur unke access ports list karo" } },
    { cmd: "show interfaces fastEthernet0/5 switchport", mode: "Privileged EXEC", does: { en: "Show a port's mode, access VLAN and voice VLAN", hi: "Port ka mode, access VLAN aur voice VLAN dikhao" } },
    { cmd: "show mac address-table vlan 10", mode: "Privileged EXEC", does: { en: "Show only the MAC addresses learned in VLAN 10", hi: "Sirf VLAN 10 mein seekhe gaye MAC addresses dikhao" } },
    { cmd: "delete flash:vlan.dat", mode: "Privileged EXEC", does: { en: "Delete the VLAN database file when wiping a lab switch", hi: "Lab switch saaf karte waqt VLAN database file delete karo" } },
  ],
  mistakes: [
    {
      en: "Deleting a VLAN and expecting its ports to return to VLAN 1. They stay assigned to the missing VLAN and are inactive until you reassign them or create the VLAN again.",
      hi: "VLAN delete karke yeh expect karna ki uske ports VLAN 1 mein wapas chale jayenge. Woh gayab VLAN mein hi assigned rehte hain aur inactive rehte hain, jab tak unhe reassign na karo ya VLAN dobara na banao.",
    },
    {
      en: "Leaving host ports in their default dynamic mode. Always add `switchport mode access`, so the port cannot be negotiated into a trunk.",
      hi: "Host ports ko unke default dynamic mode mein chhod dena. Hamesha `switchport mode access` lagao, taaki port negotiate hokar trunk na ban sake.",
    },
    {
      en: "Thinking a PC's IP address puts it in a VLAN. The switch port's configuration decides the VLAN; the PC's IP settings must then match that VLAN's subnet.",
      hi: "Yeh sochna ki PC ka IP address use kisi VLAN mein daalta hai. VLAN switch port ki configuration decide karti hai; phir PC ki IP settings us VLAN ke subnet se match honi chahiye.",
    },
    {
      en: "Expecting hosts in two VLANs on the same switch to ping each other. Traffic between VLANs always needs a router or a Layer 3 switch.",
      hi: "Yeh expect karna ki same switch par do VLANs ke hosts ek doosre ko ping kar lenge. VLANs ke beech traffic ke liye hamesha router ya Layer 3 switch chahiye.",
    },
    {
      en: "Calling a port with a voice VLAN a trunk. It is an access port: the PC's frames are untagged in the data VLAN and only the phone's frames are tagged.",
      hi: "Voice VLAN wale port ko trunk kehna. Yeh access port hai: PC ke frames data VLAN mein untagged hote hain aur sirf phone ke frames tagged hote hain.",
    },
    {
      en: "Assuming `erase startup-config` removes the VLANs. They live in `vlan.dat`, so delete that file too when you want a clean switch.",
      hi: "Yeh maan lena ki `erase startup-config` VLANs hata deta hai. VLANs `vlan.dat` mein rehte hain, isliye saaf switch chahiye toh woh file bhi delete karo.",
    },
  ],
  recap: [
    { en: "A VLAN is one broadcast domain, and each VLAN normally has its own IP subnet.", hi: "Ek VLAN ek broadcast domain hai, aur har VLAN ka aam taur par apna IP subnet hota hai." },
    { en: "Normal range 1-1005, extended range 1006-4094. VLAN 1 and VLANs 1002-1005 cannot be deleted.", hi: "Normal range 1-1005, extended range 1006-4094. VLAN 1 aur VLAN 1002-1005 delete nahi ho sakte." },
    { en: "Access port: `switchport mode access` and `switchport access vlan 10`. Its frames are untagged.", hi: "Access port: `switchport mode access` aur `switchport access vlan 10`. Iske frames untagged hote hain." },
    { en: "`switchport voice vlan 100` adds a voice VLAN: the phone learns it through CDP and tags voice frames; the PC stays untagged in the data VLAN.", hi: "`switchport voice vlan 100` voice VLAN add karta hai: phone ise CDP se seekhta hai aur voice frames tag karta hai; PC data VLAN mein untagged rehta hai." },
    { en: "Verify with `show vlan brief` (trunks are not listed) and `show interfaces switchport`.", hi: "`show vlan brief` (trunks list nahi hote) aur `show interfaces switchport` se verify karo." },
    { en: "Different VLANs need a router or Layer 3 switch to talk; the same VLAN on two switches needs a trunk.", hi: "Alag VLANs ko baat karne ke liye router ya Layer 3 switch chahiye; do switches par same VLAN ke liye trunk chahiye." },
  ],
  quiz: [
    {
      q: {
        en: "A 48-port switch has hosts in VLANs 10, 20, 30 and 40, and no router is connected. How many broadcast domains do those hosts form?",
        hi: "Ek 48-port switch par hosts VLAN 10, 20, 30 aur 40 mein hain, aur koi router connected nahi hai. Yeh hosts kitne broadcast domains banate hain?",
      },
      options: [
        { en: "1", hi: "1" },
        { en: "4", hi: "4" },
        { en: "48", hi: "48" },
        { en: "52", hi: "52" },
      ],
      answer: 1,
      explain: {
        en: "Each VLAN is one broadcast domain, so four VLANs give four. 48 is the number of collision domains (one per port), a different count. 1 would be true only if every port were in the same VLAN.",
        hi: "Har VLAN ek broadcast domain hai, isliye chaar VLANs matlab chaar. 48 collision domains ki ginti hai (har port ka ek), jo alag cheez hai. 1 tabhi sahi hota jab saare ports ek hi VLAN mein hote.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "PC1 on Fa0/1 (VLAN 10) sends an ARP request. Fa0/2 is in VLAN 10, Fa0/3 and Fa0/4 are in VLAN 20, and Fa0/5 is in VLAN 1. Out of which ports does the switch send the broadcast?",
        hi: "Fa0/1 (VLAN 10) par laga PC1 ek ARP request bhejta hai. Fa0/2 VLAN 10 mein hai, Fa0/3 aur Fa0/4 VLAN 20 mein, aur Fa0/5 VLAN 1 mein. Switch broadcast ko kin ports se bahar bhejega?",
      },
      options: [
        { en: "Fa0/2, Fa0/3, Fa0/4 and Fa0/5", hi: "Fa0/2, Fa0/3, Fa0/4 aur Fa0/5" },
        { en: "Fa0/2 and Fa0/5, because VLAN 1 receives every broadcast", hi: "Fa0/2 aur Fa0/5, kyunki VLAN 1 ko har broadcast milta hai" },
        { en: "Fa0/1 and Fa0/2", hi: "Fa0/1 aur Fa0/2" },
        { en: "Fa0/2 only", hi: "Sirf Fa0/2" },
      ],
      answer: 3,
      explain: {
        en: "A broadcast is flooded only to ports in the same VLAN, never back out the incoming port. The only other VLAN 10 port is Fa0/2. VLAN 1 is not special here; it is just another broadcast domain.",
        hi: "Broadcast sirf same VLAN ke ports par flood hota hai, aur incoming port se wapas kabhi nahi jaata. VLAN 10 ka doosra port sirf Fa0/2 hai. Yahan VLAN 1 mein kuch khaas nahi hai; woh bas ek aur broadcast domain hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "An engineer runs `no vlan 20`. Now `show vlan brief` does not list Fa0/3 or Fa0/4 anywhere. What has happened to those two ports?",
        hi: "Engineer ne `no vlan 20` chalaya. Ab `show vlan brief` mein Fa0/3 aur Fa0/4 kahin nahi dikhte. In do ports ka kya hua?",
      },
      options: [
        { en: "They are still assigned to VLAN 20, which no longer exists, so they are inactive and forward nothing", hi: "Woh ab bhi VLAN 20 mein assigned hain, jo exist nahi karta, isliye woh inactive hain aur kuch forward nahi karte" },
        { en: "They moved to VLAN 1 and are forwarding normally", hi: "Woh VLAN 1 mein chale gaye aur normal forward kar rahe hain" },
        { en: "They became trunk ports", hi: "Woh trunk ports ban gaye" },
        { en: "IOS shut them down with the shutdown command", hi: "IOS ne unhe shutdown command se band kar diya" },
      ],
      answer: 0,
      explain: {
        en: "Ports keep their access VLAN setting when the VLAN is deleted. `show interfaces fa0/3 switchport` shows `Access Mode VLAN: 20 (Inactive)`. They come back when you create VLAN 20 again or assign them to another VLAN. They are not administratively shut down.",
        hi: "VLAN delete hone par bhi ports apni access VLAN setting rakhte hain. `show interfaces fa0/3 switchport` mein `Access Mode VLAN: 20 (Inactive)` dikhta hai. VLAN 20 dobara banao ya unhe doosre VLAN mein assign karo, tab woh wapas chalenge. Woh administratively shut down nahi hote.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A Cisco IP phone on Fa0/7 has a PC plugged into it. Voice must use VLAN 50 and the PC must use VLAN 10. Which configuration is correct?",
        hi: "Fa0/7 par ek Cisco IP phone laga hai, aur uske peeche ek PC plugged hai. Voice ko VLAN 50 aur PC ko VLAN 10 use karna hai. Kaunsi configuration sahi hai?",
      },
      options: [
        { en: "`switchport mode trunk` and `switchport trunk allowed vlan 10,50`", hi: "`switchport mode trunk` aur `switchport trunk allowed vlan 10,50`" },
        { en: "`switchport mode access`, `switchport access vlan 50` and `switchport voice vlan 10`", hi: "`switchport mode access`, `switchport access vlan 50` aur `switchport voice vlan 10`" },
        { en: "`switchport mode access`, `switchport access vlan 10` and `switchport voice vlan 50`", hi: "`switchport mode access`, `switchport access vlan 10` aur `switchport voice vlan 50`" },
        { en: "`switchport mode access` and `switchport access vlan 10,50`", hi: "`switchport mode access` aur `switchport access vlan 10,50`" },
      ],
      answer: 2,
      explain: {
        en: "The access VLAN carries the PC's untagged frames, and the voice VLAN is the one the phone learns through CDP and tags. The second option swaps them. An access port has exactly one access VLAN, so `10,50` is invalid. A trunk would put the PC's untagged frames in the native VLAN, not VLAN 10.",
        hi: "Access VLAN mein PC ke untagged frames jaate hain, aur voice VLAN woh hai jo phone CDP se seekh kar tag karta hai. Doosre option mein dono ulte hain. Access port ka sirf ek access VLAN hota hai, isliye `10,50` invalid hai. Trunk lagaya toh PC ke untagged frames native VLAN mein jayenge, VLAN 10 mein nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A user moves PC1 (10.1.10.11/24, gateway 10.1.10.1) from a VLAN 10 port to a VLAN 20 port on the same switch and changes nothing else. What happens?",
        hi: "User PC1 (10.1.10.11/24, gateway 10.1.10.1) ko same switch par VLAN 10 ke port se VLAN 20 ke port par shift karta hai aur kuch aur nahi badalta. Kya hoga?",
      },
      options: [
        { en: "PC1 is now in VLAN 20; its ARP for 10.1.10.1 stays in VLAN 20, so it cannot reach its gateway or the VLAN 10 hosts", hi: "PC1 ab VLAN 20 mein hai; 10.1.10.1 ke liye uska ARP VLAN 20 mein hi rehta hai, isliye woh na gateway tak pahunchta hai na VLAN 10 ke hosts tak" },
        { en: "The switch sees the 10.1.10.x address and moves the port to VLAN 10", hi: "Switch 10.1.10.x address dekh kar port ko VLAN 10 mein daal deta hai" },
        { en: "PC1 keeps working, because VLANs only affect broadcasts", hi: "PC1 chalta rehta hai, kyunki VLANs sirf broadcasts par asar daalte hain" },
        { en: "PC1 can reach VLAN 10 hosts but not its gateway", hi: "PC1 VLAN 10 ke hosts tak pahunchta hai lekin gateway tak nahi" },
      ],
      answer: 0,
      explain: {
        en: "The port's configuration decides the VLAN, and a Layer 2 switch never reads IP addresses. PC1's ARP broadcasts are flooded only in VLAN 20, where neither its gateway nor any VLAN 10 host can hear them.",
        hi: "VLAN port ki configuration decide karti hai, aur Layer 2 switch kabhi IP address nahi padhta. PC1 ke ARP broadcasts sirf VLAN 20 mein flood hote hain, jahan na uska gateway hai na VLAN 10 ka koi host.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which statement about VLAN numbers on a Catalyst switch is true?", hi: "Catalyst switch par VLAN numbers ke baare mein kaunsa statement sahi hai?" },
      options: [
        { en: "VLAN 1 can be deleted once no ports use it", hi: "Jab koi port use na kare, tab VLAN 1 delete ho sakta hai" },
        { en: "VLANs 1002-1005 are free for user traffic", hi: "VLAN 1002-1005 user traffic ke liye free hain" },
        { en: "The normal range is 1-4094", hi: "Normal range 1-4094 hai" },
        { en: "VLANs 1006-4094 are the extended range", hi: "VLAN 1006-4094 extended range hai" },
      ],
      answer: 3,
      explain: {
        en: "The normal range is 1-1005 and the extended range is 1006-4094. VLAN 1 and VLANs 1002-1005 are permanent defaults that cannot be deleted, and 1002-1005 are reserved for legacy Token Ring and FDDI.",
        hi: "Normal range 1-1005 hai aur extended range 1006-4094. VLAN 1 aur VLAN 1002-1005 permanent defaults hain jo delete nahi hote, aur 1002-1005 purane Token Ring aur FDDI ke liye reserved hain.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "cjFzOnm6u1g",
      title: "Free CCNA | VLANs (Part 1) | Day 16",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "What VLANs are, why they split broadcast domains, and access port configuration.", hi: "VLAN kya hai, broadcast domain kaise baantta hai, aur access port configuration." },
    },
    {
      id: "kGX76QNIjsE",
      title: "Free CCNA | Voice VLANs | Day 46 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "A hands-on lab that configures a voice VLAN for an IP phone with a PC behind it.", hi: "Hands-on lab jisme IP phone aur uske peeche PC ke liye voice VLAN configure hota hai." },
    },
    {
      id: "EZ-W8sqchug",
      title: "84. Free CCNA (NEW) | VLAN in Hindi - What is VLAN in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "The VLAN concept and why networks use it, in Hindi.", hi: "VLAN ka concept aur networks ise kyun use karte hain, Hindi mein." },
    },
    {
      id: "_Z0iwSNIseA",
      title: "85. Free CCNA (NEW) | VLAN in Hindi - How to Configure VLAN",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Creating VLANs and assigning access ports on a Cisco switch, in Hindi.", hi: "Cisco switch par VLAN banana aur access ports assign karna, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Split one switch into VLANs in Packet Tracer", hi: "Packet Tracer mein ek switch ko VLANs mein baanto" },
    steps: [
      {
        en: "Connect four PCs to a 2960 switch on Fa0/1-4 and give them all addresses in 10.1.1.0/24 for now (10.1.1.11 to .14). Ping between all of them: everything works, because every port is in VLAN 1.",
        hi: "Ek 2960 switch ke Fa0/1-4 par chaar PCs lagao aur abhi sabko 10.1.1.0/24 ke addresses do (10.1.1.11 se .14). Sab ek doosre ko ping karo: sab chalega, kyunki har port VLAN 1 mein hai.",
      },
      {
        en: "Create VLAN 10 (SALES) and VLAN 20 (HR). Put Fa0/1-2 in VLAN 10 and Fa0/3-4 in VLAN 20 with `switchport mode access` and `switchport access vlan`. Check with `show vlan brief`.",
        hi: "VLAN 10 (SALES) aur VLAN 20 (HR) banao. `switchport mode access` aur `switchport access vlan` se Fa0/1-2 ko VLAN 10 mein aur Fa0/3-4 ko VLAN 20 mein daalo. `show vlan brief` se check karo.",
      },
      {
        en: "Ping again. PC1 to PC2 works, but PC1 to PC3 fails even though they share a subnet. In Simulation mode, watch PC1's ARP broadcast reach only PC2.",
        hi: "Dobara ping karo. PC1 se PC2 chalega, lekin PC1 se PC3 fail hoga, bhale hi dono same subnet mein hain. Simulation mode mein dekho ki PC1 ka ARP broadcast sirf PC2 tak pahunchta hai.",
      },
      {
        en: "Add an IP Phone (7960, with its power adapter) on Fa0/5 and a PC behind it. Create VLAN 100 (VOICE), configure Fa0/5 with `switchport mode access`, `switchport access vlan 10` and `switchport voice vlan 100`, then run `show interfaces fa0/5 switchport` and find the Voice VLAN line.",
        hi: "Fa0/5 par ek IP Phone (7960, power adapter ke saath) aur uske peeche ek PC lagao. VLAN 100 (VOICE) banao, aur Fa0/5 par `switchport mode access`, `switchport access vlan 10` aur `switchport voice vlan 100` configure karo, phir `show interfaces fa0/5 switchport` chala kar Voice VLAN wali line dhoondho.",
      },
      {
        en: "Run `no vlan 20` and look at `show vlan brief`: Fa0/3 and Fa0/4 are gone. Create VLAN 20 again and watch them return.",
        hi: "`no vlan 20` chalao aur `show vlan brief` dekho: Fa0/3 aur Fa0/4 gayab hain. VLAN 20 dobara banao aur dekho woh wapas aa jaate hain.",
      },
    ],
  },
};

export default lesson;
