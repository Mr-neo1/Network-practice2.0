import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "cdp-lldp",
  intro: {
    en: "You take over a network with no diagram and a rack full of cables. Before you change anything you need to know what is plugged into each port: which device, which model, which of its ports, and what address you can manage it on. CDP and LLDP answer that from the CLI, because every device tells its directly connected neighbours who it is. The same messages carry the voice VLAN to IP phones and expose native VLAN and duplex mismatches, so they are also an attacker's free map of your network.",
    hi: "Socho tumhe ek network handover hua hai, koi diagram nahi hai aur rack cables se bhara hai. Kuch bhi change karne se pehle tumhe pata hona chahiye ki har port mein kya laga hai: kaunsa device, kaunsa model, uska kaunsa port, aur kis address par use manage kar sakte ho. CDP aur LLDP yeh sab CLI se bata dete hain, kyunki har device apne directly connected neighbours ko batata hai ki woh kaun hai. Yahi messages IP phones ko voice VLAN batate hain aur native VLAN aur duplex mismatch pakadte hain, isliye yeh attacker ke liye bhi tumhare network ka free map ban jaate hain.",
  },
  outcomes: [
    { en: "Explain what CDP and LLDP advertise, how often, and how long a neighbour entry lasts", hi: "Samjha sako ki CDP aur LLDP kya advertise karte hain, kitni der mein, aur neighbour entry kitni der tak rehti hai" },
    { en: "Read `show cdp neighbors` and `show cdp neighbors detail` and draw the topology from them", hi: "`show cdp neighbors` aur `show cdp neighbors detail` padh kar topology draw kar sako" },
    { en: "Enable, disable and tune CDP globally and per interface", hi: "CDP ko globally aur per interface enable, disable aur tune kar sako" },
    { en: "Turn on LLDP on Cisco IOS and control transmit and receive per interface", hi: "Cisco IOS par LLDP on kar sako aur per interface transmit aur receive control kar sako" },
    { en: "Compare CDP and LLDP and decide where each should be switched off for security", hi: "CDP aur LLDP compare kar sako aur decide kar sako ki security ke liye kahan inhe band karna hai" },
  ],
  sections: [
    {
      id: "why-discovery",
      heading: { en: "Why devices introduce themselves", hi: "Devices apna introduction kyun dete hain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A MAC address table tells you that some MAC lives on Gi0/2. It does not tell you that the MAC belongs to a Catalyst 2960 called SW2, connected on its own Gi0/1, managed at 10.1.1.12. A **neighbour discovery protocol** fills that gap: each device periodically sends a small advertisement out of every enabled interface, and the device on the other end of the cable stores it in a neighbour table.",
            hi: "MAC address table sirf itna batati hai ki koi MAC Gi0/2 par hai. Woh yeh nahi batati ki yeh MAC SW2 naam ke Catalyst 2960 ka hai, jo apne Gi0/1 se juda hai aur 10.1.1.12 par manage hota hai. Yeh gap **neighbour discovery protocol** bharta hai: har device thodi-thodi der mein apne har enabled interface se ek chhota advertisement bhejta hai, aur cable ke doosre end wala device use apni neighbour table mein store kar leta hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Layer 2 only.** The advertisements are Ethernet frames sent to a multicast MAC. They work before any IP address is configured, so they help even when IP is broken.",
              hi: "**Sirf Layer 2.** Advertisements Ethernet frames hain jo multicast MAC par jaate hain. Yeh koi IP address configure hone se pehle bhi kaam karte hain, isliye IP toota ho tab bhi madad karte hain.",
            },
            {
              en: "**Directly connected only.** A Cisco device reads the advertisement and does not forward it. R1 learns about SW1, but never about SW2 behind it. (A hub or unmanaged switch in the middle does pass the frames on, so one port can then show several neighbours.)",
              hi: "**Sirf directly connected.** Cisco device advertisement padhta hai aur use aage forward nahi karta. R1 ko SW1 ke baare mein pata chalta hai, lekin uske peeche wale SW2 ke baare mein kabhi nahi. (Beech mein hub ya unmanaged switch ho toh woh frames aage bhej deta hai, aur tab ek hi port par kai neighbours dikh sakte hain.)",
            },
            {
              en: "**One-way announcements.** Nobody asks and nobody replies. Each side announces itself on a timer and keeps what it hears until a holdtime runs out.",
              hi: "**Ek-tarfa announcement.** Na koi poochta hai, na koi reply karta hai. Har side timer par khud ko announce karti hai aur jo sunti hai use holdtime khatam hone tak rakhti hai.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "You have already met CDP twice: in lesson 2.1 the switch told the IP phone its voice VLAN through CDP, and in lesson 2.2 CDP logged `%CDP-4-NATIVE_VLAN_MISMATCH`. This lesson shows the protocol behind those messages. **CDP** (Cisco Discovery Protocol) is Cisco's own; **LLDP** (Link Layer Discovery Protocol) is the IEEE standard that every vendor can speak.",
            hi: "CDP se tum do baar mil chuke ho: lesson 2.1 mein switch ne IP phone ko CDP se voice VLAN bataya tha, aur lesson 2.2 mein CDP ne `%CDP-4-NATIVE_VLAN_MISMATCH` log kiya tha. Is lesson mein un messages ke peeche ka protocol dekhoge. **CDP** (Cisco Discovery Protocol) Cisco ka apna hai; **LLDP** (Link Layer Discovery Protocol) IEEE standard hai jo har vendor bol sakta hai.",
          },
        },
      ],
    },
    {
      id: "how-cdp-works",
      heading: { en: "How CDP works and what it carries", hi: "CDP kaise kaam karta hai aur kya le jaata hai" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "CDP is **on by default** on Cisco routers and switches, globally and on almost every interface. You do nothing to start it.",
              hi: "Cisco routers aur switches par CDP **by default on** hota hai, globally bhi aur lagbhag har interface par bhi. Ise start karne ke liye kuch nahi karna padta.",
            },
            {
              en: "Every **60 seconds**, each device sends a CDP advertisement out of every up interface with CDP enabled, to the multicast MAC `0100.0CCC.CCCC`.",
              hi: "Har **60 seconds** mein har device apne har up interface se, jahan CDP enabled hai, multicast MAC `0100.0CCC.CCCC` par CDP advertisement bhejta hai.",
            },
            {
              en: "The advertisement includes a **holdtime** of **180 seconds**. The receiver stores the neighbour and counts the holdtime down.",
              hi: "Advertisement mein **180 seconds** ka **holdtime** hota hai. Receiver neighbour ko store karta hai aur holdtime ko neeche count karta hai.",
            },
            {
              en: "Each new advertisement resets the countdown to 180. If three advertisements in a row are missed, the holdtime reaches 0 and the neighbour is removed.",
              hi: "Har naya advertisement countdown ko phir se 180 par le aata hai. Agar lagaatar teen advertisements miss ho gaye, toh holdtime 0 ho jaata hai aur neighbour hata diya jaata hai.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "Current IOS sends **CDP version 2**, which added fields such as native VLAN, VTP domain and duplex to version 1. Each piece of information travels as a **TLV** (type, length, value), so a receiver can skip fields it does not understand.",
            hi: "Aaj ka IOS **CDP version 2** bhejta hai, jisne version 1 mein native VLAN, VTP domain aur duplex jaise fields jode. Har information ek **TLV** (type, length, value) ke roop mein jaati hai, isliye receiver jo field nahi samajhta use skip kar sakta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "What SW1 learns about SW2 from one CDP advertisement", hi: "Ek CDP advertisement se SW1 ko SW2 ke baare mein kya pata chalta hai" },
          columns: [{ en: "Field", hi: "Field" }, { en: "Value from SW2", hi: "SW2 se aayi value" }, { en: "Why you care", hi: "Kaam kya aata hai" }],
          rows: [
            ["Device ID", "SW2", { en: "The hostname, so you know who is there", hi: "Hostname, taaki pata chale wahan kaun hai" }],
            ["IP address", "10.1.1.12", { en: "Where to SSH to next", hi: "Aage SSH kahan karna hai" }],
            ["Platform", "cisco WS-C2960-24TT-L", { en: "Exact model, for spares and support", hi: "Exact model, spares aur support ke liye" }],
            ["Port ID", "GigabitEthernet0/1", { en: "The far-end port of this cable", hi: "Is cable ka doosre end wala port" }],
            ["Capabilities", "Switch IGMP", { en: "Router, switch, phone or host", hi: "Router hai, switch, phone ya host" }],
            ["Version", "15.0(2)SE11", { en: "IOS version, for bugs and upgrades", hi: "IOS version, bugs aur upgrades ke liye" }],
            ["Native VLAN", "1", { en: "Catches native VLAN mismatches", hi: "Native VLAN mismatch pakadta hai" }],
            ["VTP domain, duplex", "'' , full", { en: "Catches VTP and duplex mismatches", hi: "VTP aur duplex mismatch pakadta hai" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Know the CDP numbers: on by default, Cisco proprietary, advertisements every 60 seconds, holdtime 180 seconds, CDPv2 by default. It runs at Layer 2, so neighbours appear even when no IP address is configured.",
            hi: "CDP ke numbers yaad rakho: by default on, Cisco proprietary, har 60 seconds mein advertisement, holdtime 180 seconds, by default CDPv2. Yeh Layer 2 par chalta hai, isliye koi IP address configure na ho tab bhi neighbours dikhte hain.",
          },
        },
      ],
    },
    {
      id: "reading-cdp",
      heading: { en: "Reading the CDP neighbour table", hi: "CDP neighbour table padhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "SW1 connects to R1 on Gi0/1, to SW2 on Gi0/2 and to an IP phone on Fa0/5. The animation shows these advertisements arriving. `show cdp neighbors` gives one line per neighbour:",
            hi: "SW1, Gi0/1 par R1 se, Gi0/2 par SW2 se aur Fa0/5 par ek IP phone se juda hai. Animation mein yahi advertisements aate dikhte hain. `show cdp neighbors` har neighbour ki ek line deta hai:",
          },
        },
        {
          type: "cli",
          title: { en: "SW1's CDP neighbours", hi: "SW1 ke CDP neighbours" },
          lines: [
            { prompt: "SW1#", cmd: "show cdp neighbors" },
            { out: "Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge" },
            { out: "                  S - Switch, H - Host, I - IGMP, r - Repeater, P - Phone," },
            { out: "                  D - Remote, C - CVTA, M - Two-port Mac Relay" },
            { out: "Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID" },
            {
              out: "R1               Gig 0/1           163            R B S I  CISCO2911 Gig 0/0",
              comment: { en: "SW1's Gi0/1 connects to R1's Gi0/0; the last update arrived 17 s ago (180 - 163)", hi: "SW1 ka Gi0/1, R1 ke Gi0/0 se juda hai; aakhri update 17 s pehle aaya tha (180 - 163)" },
            },
            { out: "SW2              Gig 0/2           141             S I     WS-C2960- Gig 0/1" },
            {
              out: "SEP001B54AA0005  Fas 0/5           150            H P M    IP Phone  Port 1",
              comment: { en: "Cisco phones use SEP plus their MAC as the Device ID", hi: "Cisco phones Device ID mein SEP ke baad apna MAC lagate hain" },
            },
            { out: "Total cdp entries displayed : 3" },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Local Intrfce is yours, Port ID is theirs", hi: "Local Intrfce tumhara, Port ID unka" },
          text: {
            en: "In the R1 line, `Gig 0/1` is SW1's own port and `Gig 0/0` is R1's port at the other end of the same cable. The exam tests this with \"which interface on R1 connects to SW1?\" The answer is in the Port ID column.",
            hi: "R1 wali line mein `Gig 0/1` SW1 ka apna port hai aur `Gig 0/0` usi cable ke doosre end par R1 ka port hai. Exam ise aise poochta hai: \"R1 ka kaunsa interface SW1 se juda hai?\" Jawab Port ID column mein hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "The summary leaves out the IP address and software version. Use `show cdp neighbors detail` for every neighbour, or `show cdp entry SW2` for one:",
            hi: "Summary mein IP address aur software version nahi aate. Har neighbour ke liye `show cdp neighbors detail` chalao, ya sirf ek ke liye `show cdp entry SW2`:",
          },
        },
        {
          type: "cli",
          title: { en: "One entry from show cdp neighbors detail", hi: "show cdp neighbors detail ki ek entry" },
          lines: [
            { prompt: "SW1#", cmd: "show cdp neighbors detail" },
            { out: "-------------------------" },
            { out: "Device ID: SW2" },
            { out: "Entry address(es):" },
            { out: "  IP address: 10.1.1.12", comment: { en: "The management address you can SSH to", hi: "Management address jahan SSH kar sakte ho" } },
            { out: "Platform: cisco WS-C2960-24TT-L,  Capabilities: Switch IGMP" },
            { out: "Interface: GigabitEthernet0/2,  Port ID (outgoing port): GigabitEthernet0/1" },
            { out: "Holdtime : 141 sec" },
            { out: "Version :" },
            { out: "Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 15.0(2)SE11" },
            { out: "advertisement version: 2" },
            { out: "VTP Management Domain: ''" },
            { out: "Native VLAN: 1", comment: { en: "This is how CDP spots a native VLAN mismatch", hi: "Isi se CDP native VLAN mismatch pakadta hai" } },
            { out: "Duplex: full" },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Mapping a network you inherited", hi: "Handover mein mila network map karna" },
          text: {
            en: "Start on any device, run `show cdp neighbors detail`, SSH to each neighbour's IP address and repeat. Write down each Local Intrfce and Port ID pair as you go and you have a physical diagram, cable by cable.",
            hi: "Kisi bhi device se shuru karo, `show cdp neighbors detail` chalao, har neighbour ke IP address par SSH karo aur yahi dohraao. Saath-saath har Local Intrfce aur Port ID ka pair likhte jao, aur cable-by-cable physical diagram tayyar ho jaayega.",
          },
        },
      ],
    },
    {
      id: "cdp-config",
      heading: { en: "Turning CDP on, off and tuning it", hi: "CDP on, off aur tune karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "CDP has two on/off controls: a global one for the whole device, and one on each interface. The interface setting only matters while CDP is running globally.",
            hi: "CDP ke do on/off controls hain: ek global, jo poore device ke liye hai, aur ek har interface par. Interface wali setting tabhi matter karti hai jab CDP globally chal raha ho.",
          },
        },
        {
          type: "cli",
          title: { en: "Checking and controlling CDP", hi: "CDP check aur control karna" },
          lines: [
            { prompt: "SW1#", cmd: "show cdp" },
            { out: "Global CDP information:" },
            { out: "        Sending CDP packets every 60 seconds" },
            { out: "        Sending a holdtime value of 180 seconds" },
            { out: "        Sending CDPv2 advertisements is  enabled" },
            { prompt: "SW1#", cmd: "configure terminal" },
            { prompt: "SW1(config)#", cmd: "interface fa0/10" },
            { prompt: "SW1(config-if)#", cmd: "no cdp enable", comment: { en: "Stop CDP on this port only; every other port keeps it", hi: "Sirf is port par CDP band; baaki ports par chalta rahega" } },
            { prompt: "SW1(config-if)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "cdp timer 30", comment: { en: "Optional: advertise every 30 s instead of 60 s", hi: "Optional: 60 s ki jagah har 30 s mein advertise karo" } },
            { prompt: "SW1(config)#", cmd: "cdp holdtime 120", comment: { en: "Optional: keep the holdtime at a few times the timer", hi: "Optional: holdtime ko timer ka kuch guna rakho" } },
          ],
          note: {
            en: "`no cdp run` in global configuration stops CDP on every interface at once, and `cdp run` turns it back on. `cdp enable` re-enables one interface. `show cdp interface` lists the interfaces where CDP is running.",
            hi: "Global configuration mein `no cdp run` ek saath har interface par CDP band kar deta hai, aur `cdp run` use wapas on karta hai. `cdp enable` ek interface par dobara on karta hai. `show cdp interface` un interfaces ki list deta hai jahan CDP chal raha hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Global versus interface commands", hi: "Global aur interface commands ka farak" },
          text: {
            en: "`cdp run` and `no cdp run` are global. `cdp enable` and `no cdp enable` are interface commands. Mixing them up is a classic exam distractor: there is no `no cdp run` under an interface.",
            hi: "`cdp run` aur `no cdp run` global commands hain. `cdp enable` aur `no cdp enable` interface commands hain. Inhe mix karna exam ka purana distractor hai: interface ke andar `no cdp run` hota hi nahi.",
          },
        },
      ],
    },
    {
      id: "lldp",
      heading: { en: "LLDP: the open standard", hi: "LLDP: open standard" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A Cisco switch connected to another vendor's switch, server or phone cannot rely on CDP. **LLDP**, defined in **IEEE 802.1AB**, does the same job in a vendor-neutral way. It sends to the multicast MAC `0180.C200.000E` and carries the same kind of TLVs: system name, port ID, system description, capabilities and management address.",
            hi: "Jab Cisco switch kisi doosre vendor ke switch, server ya phone se juda ho, tab CDP par bharosa nahi kar sakte. **IEEE 802.1AB** mein defined **LLDP** yahi kaam vendor-neutral tareeke se karta hai. Yeh multicast MAC `0180.C200.000E` par bhejta hai aur usi type ke TLVs le jaata hai: system name, port ID, system description, capabilities aur management address.",
          },
        },
        {
          type: "table",
          caption: { en: "CDP and LLDP side by side", hi: "CDP aur LLDP aamne-saamne" },
          columns: ["", "CDP", "LLDP"],
          rows: [
            [{ en: "Standard", hi: "Standard" }, { en: "Cisco proprietary", hi: "Cisco proprietary" }, "IEEE 802.1AB"],
            [{ en: "Default on Cisco IOS", hi: "Cisco IOS par default" }, { en: "Enabled", hi: "Enabled" }, { en: "Disabled", hi: "Disabled" }],
            [{ en: "Advertisement timer", hi: "Advertisement timer" }, "60 s", "30 s"],
            [{ en: "Holdtime", hi: "Holdtime" }, "180 s", "120 s"],
            [{ en: "Extra timer", hi: "Extra timer" }, { en: "None", hi: "Koi nahi" }, { en: "Reinitialisation delay 2 s", hi: "Reinitialisation delay 2 s" }],
            [{ en: "Turn on globally", hi: "Globally on karna" }, "cdp run", "lldp run"],
            [{ en: "Per interface", hi: "Per interface" }, "cdp enable", "lldp transmit / lldp receive"],
          ],
        },
        {
          type: "cli",
          title: { en: "Turning on LLDP on SW1", hi: "SW1 par LLDP on karna" },
          lines: [
            { prompt: "SW1(config)#", cmd: "lldp run", comment: { en: "LLDP starts on every interface, sending and receiving", hi: "LLDP har interface par shuru ho jaata hai, bhejna bhi aur receive bhi" } },
            { prompt: "SW1(config)#", cmd: "interface fa0/10" },
            { prompt: "SW1(config-if)#", cmd: "no lldp transmit", comment: { en: "Stop sending LLDP out of this port", hi: "Is port se LLDP bhejna band" } },
            { prompt: "SW1(config-if)#", cmd: "no lldp receive", comment: { en: "Ignore LLDP that arrives on this port", hi: "Is port par aane wala LLDP ignore karo" } },
            { prompt: "SW1(config-if)#", cmd: "end" },
            { prompt: "SW1#", cmd: "show lldp neighbors" },
            { out: "Capability codes:" },
            { out: "    (R) Router, (B) Bridge, (T) Telephone, (C) DOCSIS Cable Device" },
            { out: "    (W) WLAN Access Point, (P) Repeater, (S) Station, (O) Other" },
            { out: "Device ID           Local Intf     Hold-time  Capability      Port ID" },
            { out: "R1                  Gi0/1          91         R               Gi0/0" },
            { out: "SW2                 Gi0/2          105        B               Gi0/1" },
            { out: "Total entries displayed: 2" },
          ],
          note: {
            en: "LLDP has separate transmit and receive controls per interface, where CDP has one `cdp enable`. R1 and SW2 appear only because `lldp run` was also entered on them; LLDP needs both ends. `show lldp` shows the timers, and `lldp timer`, `lldp holdtime` and `lldp reinit` change them.",
            hi: "LLDP mein har interface par transmit aur receive ke alag controls hain, jabki CDP mein ek hi `cdp enable` hai. R1 aur SW2 sirf isliye dikh rahe hain kyunki un par bhi `lldp run` diya gaya; LLDP ke liye dono ends chahiye. `show lldp` timers dikhata hai, aur `lldp timer`, `lldp holdtime` aur `lldp reinit` unhe badalte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "The **reinitialisation delay** is how long an interface waits after LLDP is enabled on it before LLDP starts, 2 seconds by default. CDP and LLDP run independently, so a device can run both at once. An extension called **LLDP-MED** carries voice VLAN and power details to non-Cisco IP phones, the job CDP does for Cisco phones.",
            hi: "**Reinitialisation delay** woh time hai jo interface par LLDP enable hone ke baad LLDP shuru hone se pehle wait hota hai, by default 2 seconds. CDP aur LLDP ek doosre se independent chalte hain, isliye ek device dono saath chala sakta hai. **LLDP-MED** naam ka extension non-Cisco IP phones ko voice VLAN aur power ki details deta hai, wahi kaam jo CDP Cisco phones ke liye karta hai.",
          },
        },
      ],
    },
    {
      id: "security",
      heading: { en: "Where to switch them off", hi: "Inhe kahan band karna hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "CDP and LLDP have no authentication and no encryption. Anyone who plugs a laptop into a port with CDP enabled and opens Wireshark sees the switch's hostname, management IP, exact model and IOS version within 60 seconds. That tells an attacker which known vulnerabilities to try and which address to attack.",
            hi: "CDP aur LLDP mein na authentication hai, na encryption. Koi bhi CDP enabled port mein laptop laga kar Wireshark kholega, toh 60 seconds ke andar switch ka hostname, management IP, exact model aur IOS version dekh lega. Isse attacker ko pata chal jaata hai ki kaunsi known vulnerabilities try karni hain aur kis address par attack karna hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Turn them off** on ports facing anything you do not control: the router interface towards the ISP, guest and lobby ports, and user access ports where no phone is connected. Use `no cdp enable` and `no lldp transmit` on those interfaces, plus `no lldp receive` so the port also ignores fake advertisements.",
              hi: "**Inhe band karo** un ports par jo kisi aisi cheez ki taraf hain jo tumhare control mein nahi: ISP ki taraf wala router interface, guest aur lobby ports, aur user access ports jahan koi phone nahi laga. Un interfaces par `no cdp enable` aur `no lldp transmit` use karo, saath mein `no lldp receive` bhi, taaki port fake advertisements ko bhi ignore kare.",
            },
            {
              en: "**Keep them on** for links between your own network devices, where they help troubleshooting, and on ports with IP phones, which need CDP or LLDP-MED to learn the voice VLAN.",
              hi: "**Inhe on rakho** apne network devices ke beech ke links par, jahan troubleshooting mein madad milti hai, aur IP phone wale ports par, jinhe voice VLAN seekhne ke liye CDP ya LLDP-MED chahiye.",
            },
            {
              en: "Use `no cdp run` only when nothing on the device needs CDP. Disabling it globally on an access switch silently breaks Cisco phones' voice VLAN discovery.",
              hi: "`no cdp run` tabhi use karo jab device par kisi ko CDP ki zaroorat na ho. Access switch par ise globally band kiya toh Cisco phones ka voice VLAN discovery chupchaap toot jaata hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Exam topic 2.3 asks you to configure and verify Layer 2 discovery protocols. Expect to read neighbour output, to choose between global and interface commands, and to know that LLDP must be enabled with `lldp run` on Cisco IOS.",
            hi: "Exam topic 2.3 mein Layer 2 discovery protocols configure aur verify karna aata hai. Neighbour output padhna, global aur interface commands mein sahi chunna, aur yeh jaanna ki Cisco IOS par LLDP `lldp run` se enable karna padta hai, yeh sab expect karo.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "CDP", def: { en: "Cisco Discovery Protocol. Cisco's Layer 2 protocol for advertising a device's identity to directly connected neighbours; on by default.", hi: "Cisco Discovery Protocol. Cisco ka Layer 2 protocol jo device ki pehchaan directly connected neighbours ko advertise karta hai; by default on." } },
    { term: "LLDP", def: { en: "Link Layer Discovery Protocol, IEEE 802.1AB. The vendor-neutral equivalent of CDP; off by default on Cisco IOS.", hi: "Link Layer Discovery Protocol, IEEE 802.1AB. CDP ka vendor-neutral roop; Cisco IOS par by default off." } },
    { term: "Holdtime", def: { en: "How long a receiver keeps a neighbour entry without a new advertisement: 180 s for CDP, 120 s for LLDP.", hi: "Naya advertisement na aaye toh receiver neighbour entry kitni der rakhta hai: CDP ke liye 180 s, LLDP ke liye 120 s." } },
    { term: "Advertisement timer", def: { en: "How often a device sends its advertisement: 60 s for CDP, 30 s for LLDP.", hi: "Device kitni der mein apna advertisement bhejta hai: CDP ke liye 60 s, LLDP ke liye 30 s." } },
    { term: "Device ID", def: { en: "The neighbour's name in the table, normally its hostname; a Cisco phone uses SEP followed by its MAC.", hi: "Table mein neighbour ka naam, aam taur par hostname; Cisco phone SEP ke baad apna MAC use karta hai." } },
    { term: "Port ID", def: { en: "The neighbour's own interface at the far end of the cable.", hi: "Cable ke doosre end par neighbour ka apna interface." } },
    { term: "TLV", def: { en: "Type, length, value. The format in which CDP and LLDP carry each piece of information.", hi: "Type, length, value. Woh format jisme CDP aur LLDP har information le jaate hain." } },
    { term: "LLDP-MED", def: { en: "An LLDP extension for endpoints such as IP phones, carrying voice VLAN and power details.", hi: "IP phones jaise endpoints ke liye LLDP ka extension, jo voice VLAN aur power details le jaata hai." } },
  ],
  commands: [
    { cmd: "show cdp", mode: "Privileged EXEC", does: { en: "Show whether CDP is running and its global timers", hi: "Dikhata hai ki CDP chal raha hai ya nahi, aur uske global timers" } },
    { cmd: "show cdp neighbors", mode: "Privileged EXEC", does: { en: "One line per neighbour: Device ID, local port, platform, remote port", hi: "Har neighbour ki ek line: Device ID, local port, platform, remote port" } },
    { cmd: "show cdp neighbors detail", mode: "Privileged EXEC", does: { en: "Full details for every neighbour, including IP address and IOS version", hi: "Har neighbour ki poori details, IP address aur IOS version samet" } },
    { cmd: "show cdp entry SW2", mode: "Privileged EXEC", does: { en: "Full details for one named neighbour", hi: "Ek naam wale neighbour ki poori details" } },
    { cmd: "show cdp interface", mode: "Privileged EXEC", does: { en: "List the interfaces running CDP and their timers", hi: "CDP chalane wale interfaces aur unke timers ki list" } },
    { cmd: "cdp run / no cdp run", mode: "Global configuration", does: { en: "Turn CDP on or off for the whole device", hi: "Poore device ke liye CDP on ya off karo" } },
    { cmd: "cdp enable / no cdp enable", mode: "Interface configuration", does: { en: "Turn CDP on or off on one interface", hi: "Ek interface par CDP on ya off karo" } },
    { cmd: "cdp timer 30 / cdp holdtime 120", mode: "Global configuration", does: { en: "Change how often CDP advertises and how long neighbours are kept", hi: "CDP kitni der mein advertise kare aur neighbours kitni der rakhe, yeh badlo" } },
    { cmd: "lldp run / no lldp run", mode: "Global configuration", does: { en: "Turn LLDP on or off for the whole device", hi: "Poore device ke liye LLDP on ya off karo" } },
    { cmd: "lldp transmit / lldp receive", mode: "Interface configuration", does: { en: "Control sending and receiving LLDP on one interface; prefix with no to stop", hi: "Ek interface par LLDP bhejna aur receive karna control karo; band karne ke liye aage no lagao" } },
    { cmd: "lldp timer 30 / lldp holdtime 120 / lldp reinit 2", mode: "Global configuration", does: { en: "Change the LLDP timers (values shown are the defaults)", hi: "LLDP timers badlo (dikhayi gayi values defaults hain)" } },
    { cmd: "show lldp", mode: "Privileged EXEC", does: { en: "Show whether LLDP is active and its timers", hi: "Dikhata hai ki LLDP active hai ya nahi, aur uske timers" } },
    { cmd: "show lldp neighbors", mode: "Privileged EXEC", does: { en: "One line per LLDP neighbour; add detail for the full information", hi: "Har LLDP neighbour ki ek line; poori information ke liye detail jodo" } },
  ],
  mistakes: [
    {
      en: "Reading the Local Intrfce column as the neighbour's port. Local Intrfce is your own interface; Port ID is the neighbour's interface.",
      hi: "Local Intrfce column ko neighbour ka port samajh lena. Local Intrfce tumhara apna interface hai; Port ID neighbour ka interface hai.",
    },
    {
      en: "Assuming LLDP works out of the box on Cisco. It is disabled by default on IOS; enter `lldp run` on both ends.",
      hi: "Yeh maan lena ki Cisco par LLDP apne aap chalta hai. IOS par yeh by default disabled hai; dono ends par `lldp run` do.",
    },
    {
      en: "Expecting `show cdp neighbors` to list devices two hops away. Cisco devices never forward CDP or LLDP frames, so you only see the far end of each of your own cables.",
      hi: "`show cdp neighbors` se do hop door ke devices dikhne ki ummeed karna. Cisco devices CDP ya LLDP frames kabhi forward nahi karte, isliye tumhe sirf apni har cable ka doosra end dikhta hai.",
    },
    {
      en: "Mixing up the timer and the holdtime. CDP advertises every 60 s and keeps a silent neighbour for 180 s; LLDP uses 30 s and 120 s.",
      hi: "Timer aur holdtime ko mix karna. CDP har 60 s mein advertise karta hai aur chup neighbour ko 180 s rakhta hai; LLDP 30 s aur 120 s use karta hai.",
    },
    {
      en: "Using `no cdp run` to secure one port. It disables CDP everywhere, including the IP phone ports that need it; use `no cdp enable` on the untrusted interface instead.",
      hi: "Ek port secure karne ke liye `no cdp run` use karna. Yeh har jagah CDP band kar deta hai, un IP phone ports par bhi jinhe iski zaroorat hai; iski jagah untrusted interface par `no cdp enable` use karo.",
    },
    {
      en: "Thinking a neighbour without an IP address will not appear. CDP and LLDP run at Layer 2; the entry still appears, just without an entry address.",
      hi: "Yeh sochna ki bina IP address wala neighbour nahi dikhega. CDP aur LLDP Layer 2 par chalte hain; entry phir bhi dikhti hai, bas entry address ke bina.",
    },
  ],
  recap: [
    { en: "CDP and LLDP are Layer 2, one-way advertisements to directly connected neighbours; nobody forwards them.", hi: "CDP aur LLDP Layer 2 par directly connected neighbours ko ek-tarfa advertisements hain; inhe koi aage forward nahi karta." },
    { en: "CDP: Cisco, on by default, every 60 s, holdtime 180 s, CDPv2, multicast `0100.0CCC.CCCC`.", hi: "CDP: Cisco ka, by default on, har 60 s, holdtime 180 s, CDPv2, multicast `0100.0CCC.CCCC`." },
    { en: "LLDP: IEEE 802.1AB, off by default on IOS, every 30 s, holdtime 120 s, reinit delay 2 s, multicast `0180.C200.000E`.", hi: "LLDP: IEEE 802.1AB, IOS par by default off, har 30 s, holdtime 120 s, reinit delay 2 s, multicast `0180.C200.000E`." },
    { en: "In `show cdp neighbors`, Local Intrfce is your port and Port ID is theirs; `detail` adds IP address and IOS version.", hi: "`show cdp neighbors` mein Local Intrfce tumhara port hai aur Port ID unka; `detail` IP address aur IOS version jodta hai." },
    { en: "Global: `cdp run`, `lldp run`. Interface: `cdp enable`, `lldp transmit`, `lldp receive`.", hi: "Poore device ke liye `cdp run` aur `lldp run`; ek interface ke liye `cdp enable`, `lldp transmit` aur `lldp receive`." },
    { en: "Turn them off on untrusted edge ports, keep them on infrastructure links and IP phone ports.", hi: "Untrusted edge ports par inhe band karo, infrastructure links aur IP phone ports par on rakho." },
  ],
  quiz: [
    {
      q: { en: "Which pair shows the default Cisco IOS timers for CDP and LLDP?", hi: "Kaunsa pair CDP aur LLDP ke default Cisco IOS timers dikhata hai?" },
      options: [
        { en: "CDP every 30 s with 120 s holdtime; LLDP every 60 s with 180 s holdtime", hi: "CDP har 30 s, holdtime 120 s; LLDP har 60 s, holdtime 180 s" },
        { en: "Both every 60 s with 180 s holdtime", hi: "Dono har 60 s, holdtime 180 s" },
        { en: "CDP every 60 s with 180 s holdtime; LLDP every 30 s with 120 s holdtime", hi: "CDP har 60 s, holdtime 180 s; LLDP har 30 s, holdtime 120 s" },
        { en: "CDP every 90 s with 270 s holdtime; LLDP every 30 s with 90 s holdtime", hi: "CDP har 90 s, holdtime 270 s; LLDP har 30 s, holdtime 90 s" },
      ],
      answer: 2,
      explain: {
        en: "CDP advertises every 60 seconds with a 180-second holdtime. LLDP is faster: every 30 seconds with a 120-second holdtime. The first option swaps the two protocols, a common trap.",
        hi: "CDP har 60 seconds mein advertise karta hai, 180 seconds ke holdtime ke saath. LLDP tez hai: har 30 seconds, 120 seconds holdtime. Pehla option dono protocols ko ulta kar deta hai, jo common trap hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "SW1 shows `R1  Gig 0/1  163  R B S I  CISCO2911  Gig 0/0` in `show cdp neighbors`. Which interface on R1 connects to SW1?",
        hi: "SW1 ke `show cdp neighbors` mein `R1  Gig 0/1  163  R B S I  CISCO2911  Gig 0/0` dikhta hai. R1 ka kaunsa interface SW1 se juda hai?",
      },
      options: [
        { en: "GigabitEthernet0/0", hi: "GigabitEthernet0/0 wala interface" },
        { en: "GigabitEthernet0/1", hi: "GigabitEthernet0/1 wala interface" },
        { en: "Both, as an EtherChannel", hi: "Dono, EtherChannel ke roop mein" },
        { en: "It cannot be known without show cdp neighbors detail", hi: "show cdp neighbors detail ke bina pata nahi chal sakta" },
      ],
      answer: 0,
      explain: {
        en: "Port ID is the neighbour's interface, so R1 uses Gi0/0. Gig 0/1 under Local Intrfce is SW1's own port. The summary already gives both ends of the cable; `detail` is needed only for things like the IP address and IOS version.",
        hi: "Port ID neighbour ka interface hota hai, isliye R1 Gi0/0 use kar raha hai. Local Intrfce wala Gig 0/1 SW1 ka apna port hai. Summary mein hi cable ke dono ends mil jaate hain; `detail` sirf IP address aur IOS version jaisi cheezon ke liye chahiye.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "SW1 last received a CDP advertisement from R1 at 09:59:50. After that no more advertisements arrive from R1, but SW1's Gi0/1 stays up. With default timers, when does SW1 remove R1 from its CDP table?",
        hi: "SW1 ko R1 ka aakhri CDP advertisement 09:59:50 par mila. Uske baad R1 se koi advertisement nahi aata, lekin SW1 ka Gi0/1 up rehta hai. Default timers ke saath SW1, R1 ko apni CDP table se kab hatayega?",
      },
      options: [
        { en: "10:00:50", hi: "10:00:50 par" },
        { en: "10:02:50", hi: "10:02:50 par" },
        { en: "10:01:50", hi: "10:01:50 par" },
        { en: "Never, until someone runs a clear command", hi: "Kabhi nahi, jab tak koi clear command na chalaye" },
      ],
      answer: 1,
      explain: {
        en: "The 180-second holdtime counts down from the last advertisement received: 09:59:50 plus 3 minutes is 10:02:50. 10:00:50 would be one 60-second timer, which only says when the next advertisement was due. Entries age out on their own; no clear command is needed.",
        hi: "180 seconds ka holdtime aakhri mile advertisement se countdown karta hai: 09:59:50 plus 3 minute = 10:02:50. 10:00:50 sirf ek 60 seconds ka timer hai, jo batata hai ki agla advertisement kab aana tha. Entries apne aap age out hoti hain; koi clear command nahi chahiye.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "SW1's Fa0/10 is a lobby port. You want SW1 to stop sending CDP on that port while every other port keeps CDP. What do you configure?",
        hi: "SW1 ka Fa0/10 lobby port hai. Tum chahte ho ki SW1 is port par CDP bhejna band kare, lekin baaki har port par CDP chalta rahe. Kya configure karoge?",
      },
      options: [
        { en: "`no cdp run` in global configuration", hi: "Global configuration mein `no cdp run`" },
        { en: "`no cdp run` under interface Fa0/10", hi: "Interface Fa0/10 ke andar `no cdp run`" },
        { en: "`no lldp transmit` under interface Fa0/10", hi: "Interface Fa0/10 ke andar `no lldp transmit`" },
        { en: "`no cdp enable` under interface Fa0/10", hi: "Interface Fa0/10 ke andar `no cdp enable`" },
      ],
      answer: 3,
      explain: {
        en: "`no cdp enable` is the interface command that stops CDP on one port. `no cdp run` is global and would stop CDP everywhere, including phone ports; it is not an interface command. `no lldp transmit` affects LLDP, not CDP.",
        hi: "`no cdp enable` interface command hai jo ek port par CDP band karta hai. `no cdp run` global hai aur har jagah CDP band kar deta, phone ports par bhi; yeh interface command nahi hai. `no lldp transmit` LLDP par asar karta hai, CDP par nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A Cisco switch connects to another vendor's switch that runs LLDP. On the Cisco switch, `show lldp` returns `% LLDP is not enabled`. What fixes it?",
        hi: "Ek Cisco switch doosre vendor ke switch se juda hai jo LLDP chala raha hai. Cisco switch par `show lldp` ka jawab `% LLDP is not enabled` aata hai. Kya fix karega?",
      },
      options: [
        { en: "`lldp run` in global configuration", hi: "Global configuration mein `lldp run`" },
        { en: "`cdp run` in global configuration", hi: "Global configuration mein `cdp run`" },
        { en: "`lldp transmit` on the interface, with nothing else", hi: "Sirf interface par `lldp transmit`, aur kuch nahi" },
        { en: "Nothing; LLDP starts after the first holdtime expires", hi: "Kuch nahi; pehla holdtime khatam hone ke baad LLDP shuru ho jaata hai" },
      ],
      answer: 0,
      explain: {
        en: "LLDP is disabled globally by default on Cisco IOS, and `lldp run` turns it on. Interface `lldp transmit` and `lldp receive` are already on by default but do nothing while LLDP is off globally. CDP would not help, because the other vendor's switch does not speak it.",
        hi: "Cisco IOS par LLDP by default globally disabled hota hai, aur `lldp run` use on karta hai. Interface ke `lldp transmit` aur `lldp receive` by default on hi hote hain, lekin jab tak LLDP globally off hai, kuch nahi karte. CDP se kaam nahi banega, kyunki doosre vendor ka switch CDP nahi bolta.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "R1 connects to SW1, and SW1 connects to SW2. All three run CDP with defaults. Why does `show cdp neighbors` on R1 list only SW1?",
        hi: "R1, SW1 se juda hai, aur SW1, SW2 se. Teeno par default CDP chal raha hai. R1 par `show cdp neighbors` sirf SW1 ko kyun dikhata hai?",
      },
      options: [
        { en: "SW2 has a different VTP domain", hi: "SW2 ka VTP domain alag hai" },
        { en: "R1 has no IP address in SW2's subnet", hi: "R1 ka SW2 ke subnet mein koi IP address nahi hai" },
        { en: "CDP only shows directly connected neighbours, and SW1 does not forward SW2's advertisements", hi: "CDP sirf directly connected neighbours dikhata hai, aur SW1, SW2 ke advertisements forward nahi karta" },
        { en: "Routers only list switches that are CDP root", hi: "Routers sirf un switches ko list karte hain jo CDP root hain" },
      ],
      answer: 2,
      explain: {
        en: "A Cisco device consumes CDP frames and never relays them, so each device sees only the far end of its own cables. IP addressing and the VTP domain do not matter, because CDP is Layer 2 and does not depend on either. There is no CDP root.",
        hi: "Cisco device CDP frames khud consume karta hai aur kabhi relay nahi karta, isliye har device ko sirf apni cables ka doosra end dikhta hai. IP addressing aur VTP domain se fark nahi padta, kyunki CDP Layer 2 hai aur dono par depend nahi karta. CDP root jaisi koi cheez nahi hoti.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "_hnMZBzXRRk",
      title: "Free CCNA | CDP & LLDP | Day 36",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "CDP and LLDP theory, timers, show commands and configuration, matching this lesson.",
        hi: "CDP aur LLDP ki theory, timers, show commands aur configuration, bilkul is lesson jaisa.",
      },
    },
    {
      id: "4s8qqL7R9W8",
      title: "Free CCNA | CDP & LLDP | Day 36 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "A Packet Tracer lab: map a network using only CDP and LLDP output.",
        hi: "Packet Tracer lab: sirf CDP aur LLDP output se network map karna.",
      },
    },
    {
      id: "6TWrcp9d5uA",
      title: "91. Free CCNA (NEW) | Link Layer Protocols - CDP and LLDP",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "CDP and LLDP explained in Hindi, with the commands.",
        hi: "CDP aur LLDP Hindi mein, commands ke saath.",
      },
    },
  ],
  lab: {
    title: { en: "Map a network with CDP and LLDP", hi: "CDP aur LLDP se network map karo" },
    steps: [
      {
        en: "In Packet Tracer, connect a 2911 router's Gi0/0 to a 2960 switch's Gi0/1, a second 2960's Gi0/1 to the first switch's Gi0/2, and an IP phone to Fa0/5. The 2960 gives no PoE in Packet Tracer, so drag the power adapter onto the phone. Name the devices R1, SW1, SW2. Configure no IP addresses yet.",
        hi: "Packet Tracer mein 2911 router ka Gi0/0, 2960 switch ke Gi0/1 se jodo, doosre 2960 ka Gi0/1 pehle switch ke Gi0/2 se, aur ek IP phone Fa0/5 par lagao. Packet Tracer mein 2960 PoE nahi deta, isliye phone par power adapter drag karo. Devices ke naam R1, SW1, SW2 rakho. Abhi koi IP address configure mat karo.",
      },
      {
        en: "Bring up R1's Gi0/0 with `no shutdown`, wait a minute, and run `show cdp neighbors` on SW1. All three neighbours appear even though no IP address exists. Draw the cables from the Local Intrfce and Port ID columns.",
        hi: "R1 ka Gi0/0 `no shutdown` se up karo, ek minute ruko, aur SW1 par `show cdp neighbors` chalao. Koi IP address na hone par bhi teeno neighbours dikhenge. Local Intrfce aur Port ID columns se cables draw karo.",
      },
      {
        en: "Give R1 Gi0/0 the address 10.1.1.1/24 and run `show cdp neighbors detail` on SW1. Find R1's entry address, platform and IOS version.",
        hi: "R1 ke Gi0/0 par 10.1.1.1/24 address lagao aur SW1 par `show cdp neighbors detail` chalao. R1 ka entry address, platform aur IOS version dhoondho.",
      },
      {
        en: "Run `show cdp neighbors` on R1. Confirm SW2 is not listed, because CDP only reaches direct neighbours.",
        hi: "R1 par `show cdp neighbors` chalao. Confirm karo ki SW2 list mein nahi hai, kyunki CDP sirf direct neighbours tak pahunchta hai.",
      },
      {
        en: "Enter `lldp run` on all three devices, wait 30 seconds and compare `show lldp neighbors` on SW1 with the CDP output.",
        hi: "Teeno devices par `lldp run` do, 30 seconds ruko aur SW1 par `show lldp neighbors` ko CDP output se compare karo.",
      },
      {
        en: "Run `show cdp neighbors` on SW1 a few times, 10 seconds apart. Watch Holdtme count down and jump back near 180 each time a new advertisement arrives. Then enter `no cdp enable` on SW1 Gi0/2 and check that `show cdp interface` no longer lists it.",
        hi: "SW1 par `show cdp neighbors` 10-10 seconds ke gap par kuch baar chalao. Holdtme ko neeche girte aur har naye advertisement par wapas 180 ke paas jaate dekho. Phir SW1 ke Gi0/2 par `no cdp enable` do aur check karo ki `show cdp interface` mein woh ab list nahi hota.",
      },
    ],
  },
};

export default lesson;
