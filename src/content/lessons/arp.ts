import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "arp",
  intro: {
    en: "An IP address tells you which host a packet is for. But on a LAN, data actually travels inside Ethernet frames, and a frame needs a destination MAC address. Your PC knows the IP (you typed it, or DNS gave it) but not the MAC. ARP fills that gap, and it runs before almost every conversation on an IPv4 network.",
    hi: "IP address batata hai ki packet kis host ke liye hai. Lekin LAN par data asal mein Ethernet frame ke andar travel karta hai, aur frame ko destination MAC address chahiye. PC ko IP pata hota hai (tumne type kiya, ya DNS ne diya), par MAC nahi. Yahi gap ARP bharta hai, aur IPv4 network par lagbhag har conversation se pehle yeh chalta hai.",
  },
  outcomes: [
    { en: "Explain why a host needs ARP before it can send an IPv4 packet on Ethernet", hi: "Samjha sako ki Ethernet par IPv4 packet bhejne se pehle host ko ARP kyun chahiye" },
    { en: "Describe the ARP request (broadcast) and ARP reply (unicast)", hi: "ARP request (broadcast) aur ARP reply (unicast) ko describe kar sako" },
    { en: "Predict whether a host will ARP for the destination or for its default gateway", hi: "Predict kar sako ki host destination ke liye ARP karega ya default gateway ke liye" },
    { en: "Read an ARP table on a PC and on a Cisco router", hi: "PC aur Cisco router dono par ARP table padh sako" },
    { en: "Recognise gratuitous ARP and why ARP can be abused", hi: "Gratuitous ARP pehchaan sako aur samjho ki ARP ka misuse kaise ho sakta hai" },
  ],
  sections: [
    {
      id: "the-problem",
      heading: { en: "The problem ARP solves", hi: "ARP kaunsi problem solve karta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every frame on an Ethernet LAN carries two MAC addresses: source and destination. The switch uses the **destination MAC** to decide which port to send the frame out of. So before PC-A can send anything to 10.1.1.20, it has to fill in that destination MAC field.",
            hi: "Ethernet LAN par har frame mein do MAC address hote hain: source aur destination. Switch **destination MAC** dekh kar decide karta hai ki frame kis port se bhejna hai. Toh PC-A 10.1.1.20 ko kuch bhi bheje, usse pehle use destination MAC field bharna padega.",
          },
        },
        {
          type: "p",
          text: {
            en: "**ARP (Address Resolution Protocol)** asks the local network: \"Who has this IP address? Send me your MAC.\" It only works inside one broadcast domain (one VLAN or subnet), because routers do not forward broadcasts.",
            hi: "**ARP (Address Resolution Protocol)** local network se poochta hai: \"Yeh IP address kiska hai? Apna MAC bhejo.\" Yeh sirf ek broadcast domain (ek VLAN ya subnet) ke andar kaam karta hai, kyunki routers broadcasts forward nahi karte.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "You have a parcel for \"Flat 20\" but the delivery van only understands the owner's name. You shout in the corridor, \"Who lives in Flat 20?\" Only the person in Flat 20 answers, and they answer you directly. Next time you remember the name and skip the shouting.",
            hi: "Tumhare paas \"Flat 20\" ka parcel hai, lekin delivery wala sirf owner ka naam samajhta hai. Tum corridor mein awaaz lagate ho, \"Flat 20 mein kaun rehta hai?\" Sirf Flat 20 wala jawab deta hai, aur seedha tumhe deta hai. Agli baar tumhe naam yaad hai, awaaz lagane ki zaroorat nahi.",
          },
        },
      ],
    },
    {
      id: "request-and-reply",
      heading: { en: "Request and reply, step by step", hi: "Request aur reply, step by step" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "PC-A checks its **ARP cache** for 10.1.1.20. If an entry exists, it uses it and nothing else happens.",
              hi: "PC-A apne **ARP cache** mein 10.1.1.20 dhoondhta hai. Entry mil gayi toh wahi use hoti hai, aur kuch extra nahi hota.",
            },
            {
              en: "No entry, so PC-A sends an **ARP Request**. The Ethernet destination is the broadcast address `FFFF.FFFF.FFFF`, so every device in the VLAN receives it.",
              hi: "Entry nahi hai, toh PC-A **ARP Request** bhejta hai. Ethernet destination broadcast address `FFFF.FFFF.FFFF` hota hai, isliye VLAN ka har device ise receive karta hai.",
            },
            {
              en: "The switch floods the broadcast out of every port in that VLAN except the one it arrived on. It also learns PC-A's MAC from the source field.",
              hi: "Switch broadcast ko us VLAN ke har port se flood karta hai, sirf incoming port chhod kar. Saath hi source field se PC-A ka MAC seekh leta hai.",
            },
            {
              en: "Every host checks the **target IP**. Hosts that do not own 10.1.1.20 silently drop the request.",
              hi: "Har host **target IP** check karta hai. Jiska 10.1.1.20 nahi hai, woh chupchaap request drop kar deta hai.",
            },
            {
              en: "PC-B owns 10.1.1.20. It adds PC-A to its own cache and sends an **ARP Reply** directly (unicast) to PC-A's MAC.",
              hi: "10.1.1.20 PC-B ka hai. Woh PC-A ko apne cache mein add karta hai aur PC-A ke MAC par seedha (unicast) **ARP Reply** bhejta hai.",
            },
            {
              en: "PC-A stores 10.1.1.20 → PC-B's MAC and finally sends the real packet.",
              hi: "PC-A 10.1.1.20 → PC-B ka MAC store karta hai aur ab jaakar asli packet bhejta hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "What is inside the two ARP messages", hi: "Dono ARP messages ke andar kya hota hai" },
          columns: ["Field", "ARP Request", "ARP Reply"],
          rows: [
            ["Ethernet destination", "FFFF.FFFF.FFFF (broadcast)", "0050.56aa.0001 (PC-A)"],
            ["EtherType", "0x0806", "0x0806"],
            ["Operation", "1 (request)", "2 (reply)"],
            ["Sender MAC / IP", "0050.56aa.0001 / 10.1.1.10", "0050.56aa.0002 / 10.1.1.20"],
            ["Target MAC / IP", "0000.0000.0000 / 10.1.1.20", "0050.56aa.0001 / 10.1.1.10"],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "ARP Request = broadcast. ARP Reply = unicast. ARP messages sit directly inside the Ethernet frame (EtherType 0x0806); they are not inside an IP packet.",
            hi: "ARP Request = broadcast. ARP Reply = unicast. ARP message seedha Ethernet frame ke andar hota hai (EtherType 0x0806); yeh IP packet ke andar nahi hota.",
          },
        },
      ],
    },
    {
      id: "local-or-remote",
      heading: { en: "Local or remote: who do you ARP for?", hi: "Local ya remote: ARP kiske liye karein?" },
      blocks: [
        {
          type: "p",
          text: {
            en: "This is the single most tested ARP idea. Before sending, a host compares the destination IP with its own address and mask. If the destination is in the **same subnet**, it ARPs for the destination itself. If it is in a **different subnet**, it ARPs for its **default gateway** and hands the packet to the router.",
            hi: "ARP ka sabse zyada poocha jaane wala concept yahi hai. Bhejne se pehle host destination IP ko apne address aur mask se compare karta hai. Destination **same subnet** mein hai toh seedha destination ke liye ARP karta hai. **Doosre subnet** mein hai toh apne **default gateway** ke liye ARP karta hai aur packet router ko de deta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "PC-A is 10.1.1.10/24 with gateway 10.1.1.1", hi: "PC-A ka IP 10.1.1.10/24 hai, gateway 10.1.1.1" },
          columns: ["Destination", "Same subnet?", "PC-A ARPs for", "Destination MAC in the frame"],
          rows: [
            ["10.1.1.20", "Yes", "10.1.1.20", "PC-B's MAC"],
            ["10.1.2.20", "No", "10.1.1.1", "R1's MAC"],
            ["8.8.8.8", "No", "10.1.1.1", "R1's MAC"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The IP header does not change", hi: "IP header nahi badalta" },
          text: {
            en: "When PC-A sends to 8.8.8.8, the packet's destination IP is still 8.8.8.8. Only the frame's destination MAC points at the router. The IP address names the final destination; the MAC address names the next hop.",
            hi: "Jab PC-A 8.8.8.8 ko bhejta hai, packet ka destination IP 8.8.8.8 hi rehta hai. Sirf frame ka destination MAC router ki taraf point karta hai. IP address final destination batata hai; MAC address sirf agla hop batata hai.",
          },
        },
      ],
    },
    {
      id: "reading-arp-tables",
      heading: { en: "Reading ARP tables", hi: "ARP table padhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "On a Windows PC run `arp -a`. On Linux use `ip neigh`. On a Cisco router or Layer 3 switch use `show ip arp`.",
            hi: "Windows PC par `arp -a` chalao. Linux par `ip neigh`. Cisco router ya Layer 3 switch par `show ip arp`.",
          },
        },
        {
          type: "cli",
          title: { en: "Cisco router ARP table", hi: "Cisco router ki ARP table" },
          lines: [
            { prompt: "R1#", cmd: "show ip arp" },
            { out: "Protocol  Address          Age (min)  Hardware Addr   Type   Interface" },
            { out: "Internet  10.1.1.1                -   0011.2233.4401  ARPA   GigabitEthernet0/0", comment: { en: "Age \"-\" means this is R1's own interface address", hi: "Age \"-\" ka matlab yeh R1 ka apna interface address hai" } },
            { out: "Internet  10.1.1.10               3   0050.56aa.0001  ARPA   GigabitEthernet0/0", comment: { en: "Learned 3 minutes ago", hi: "3 minute pehle seekha gaya" } },
          ],
          note: {
            en: "Cisco IOS keeps ARP entries for 4 hours by default. PCs keep them for much less time, so a PC re-ARPs far more often than a router.",
            hi: "Cisco IOS by default ARP entries 4 ghante tak rakhta hai. PCs inhe kaafi kam time rakhte hain, isliye PC router se zyada baar ARP karta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "You will often see the first ping in a Cisco lab fail: `.!!!!` gives an 80 percent success rate. The first echo timed out while the router was still resolving ARP. That is normal, not a fault.",
            hi: "Cisco lab mein aksar pehla ping fail hota dikhega: `.!!!!` yaani 80 percent success rate. Pehla echo tab time out hua jab router abhi ARP resolve kar raha tha. Yeh normal hai, koi fault nahi.",
          },
        },
      ],
    },
    {
      id: "gratuitous-and-risks",
      heading: { en: "Gratuitous ARP, proxy ARP and ARP attacks", hi: "Gratuitous ARP, proxy ARP aur ARP attacks" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**Gratuitous ARP**: a host announces its own IP and MAC without being asked, usually as a broadcast reply. Used when an interface comes up or when a backup router takes over a virtual IP (you will see this in HSRP).",
              hi: "**Gratuitous ARP**: host bina pooche apna IP aur MAC announce karta hai, aam taur par broadcast reply ke roop mein. Jab interface up hota hai ya backup router virtual IP le leta hai (HSRP mein dekhoge), tab use hota hai.",
            },
            {
              en: "**Proxy ARP**: a router answers an ARP request on behalf of a host in another subnet. It hides misconfigured masks and is usually better left off in designed networks.",
              hi: "**Proxy ARP**: router doosre subnet ke host ki taraf se ARP request ka jawab deta hai. Isse galat masks chhup jaate hain, isliye designed networks mein ise aam taur par off rakhna behtar hai.",
            },
            {
              en: "**ARP spoofing (poisoning)**: ARP has no authentication, so an attacker can send fake replies claiming to be the gateway. Traffic then flows through the attacker. Dynamic ARP Inspection (lesson 5.8) stops this.",
              hi: "**ARP spoofing (poisoning)**: ARP mein koi authentication nahi hai, toh attacker fake reply bhej kar khud ko gateway bata sakta hai. Phir traffic attacker se hokar jaata hai. Dynamic ARP Inspection (lesson 5.8) isse rokta hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "ARP is IPv4 only", hi: "ARP sirf IPv4 ke liye hai" },
          text: {
            en: "IPv6 does not use ARP. It uses Neighbor Discovery (NDP) with Neighbor Solicitation and Neighbor Advertisement messages, sent to multicast addresses instead of broadcast.",
            hi: "IPv6 ARP use nahi karta. Woh Neighbor Discovery (NDP) use karta hai, jisme Neighbor Solicitation aur Neighbor Advertisement messages hote hain, aur yeh broadcast ki jagah multicast addresses par jaate hain.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "ARP", def: { en: "Address Resolution Protocol. Finds the MAC address that belongs to an IPv4 address on the local network.", hi: "Address Resolution Protocol. Local network par kisi IPv4 address ka MAC address dhoondhta hai." } },
    { term: "ARP cache", def: { en: "The table of IP-to-MAC mappings a device has learned. Entries expire after a timeout.", hi: "IP-to-MAC mappings ki table jo device ne seekhi hai. Timeout ke baad entries expire ho jaati hain." } },
    { term: "Broadcast MAC", def: { en: "FFFF.FFFF.FFFF. A frame sent here reaches every device in the VLAN.", hi: "FFFF.FFFF.FFFF. Is par bheja gaya frame VLAN ke har device tak pahunchta hai." } },
    { term: "Default gateway", def: { en: "The router address a host sends packets to when the destination is in another subnet.", hi: "Router ka woh address jahan host packet bhejta hai jab destination doosre subnet mein ho." } },
    { term: "Gratuitous ARP", def: { en: "An unrequested ARP announcement of a device's own IP and MAC.", hi: "Bina maange bheja gaya ARP announcement jisme device apna IP aur MAC batata hai." } },
    { term: "Proxy ARP", def: { en: "A router replying to ARP for an address that is actually in another subnet.", hi: "Router ka aise address ke liye ARP reply dena jo asal mein doosre subnet mein hai." } },
    { term: "EtherType 0x0806", def: { en: "The value in the Ethernet header that says the payload is an ARP message.", hi: "Ethernet header ki woh value jo batati hai ki payload ARP message hai." } },
  ],
  commands: [
    { cmd: "show ip arp", mode: "Cisco privileged EXEC", does: { en: "Show the router's ARP table", hi: "Router ki ARP table dikhata hai" } },
    { cmd: "clear arp-cache", mode: "Cisco privileged EXEC", does: { en: "Flush dynamic ARP entries so they are learned again", hi: "Dynamic ARP entries clear karta hai taaki dobara seekhi jaayein" } },
    { cmd: "show mac address-table", mode: "Cisco privileged EXEC", does: { en: "See which MACs the switch learned from the ARP exchange", hi: "Dekho ARP exchange se switch ne kaunse MAC seekhe" } },
    { cmd: "arp -a", mode: "Windows / macOS terminal", does: { en: "Show the host's ARP cache", hi: "Host ka ARP cache dikhata hai" } },
    { cmd: "ip neigh", mode: "Linux terminal", does: { en: "Show the Linux neighbor (ARP) table", hi: "Linux ki neighbor (ARP) table dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Thinking a host ARPs for a remote IP such as 8.8.8.8. It never does; for any off-subnet destination it ARPs for the default gateway.",
      hi: "Yeh sochna ki host 8.8.8.8 jaise remote IP ke liye ARP karta hai. Kabhi nahi; subnet ke bahar ki destination ke liye woh default gateway ke liye ARP karta hai.",
    },
    {
      en: "Saying the ARP reply is a broadcast. The request is a broadcast; the reply is normally unicast back to the sender.",
      hi: "ARP reply ko broadcast bolna. Request broadcast hoti hai; reply aam taur par sender ko unicast hota hai.",
    },
    {
      en: "Expecting a router to forward an ARP request to another subnet. ARP stays inside its broadcast domain.",
      hi: "Yeh expect karna ki router ARP request ko doosre subnet mein forward karega. ARP apne broadcast domain ke andar hi rehta hai.",
    },
    {
      en: "Mixing up ARP and DNS. DNS turns a name into an IP address; ARP turns an IP address into a MAC address.",
      hi: "ARP aur DNS ko mix karna. DNS naam ko IP address mein badalta hai; ARP IP address ko MAC address mein.",
    },
    {
      en: "Treating the lost first ping in a lab (`.!!!!`) as a problem. It is the ARP delay.",
      hi: "Lab mein pehle ping ke lost hone (`.!!!!`) ko problem samajhna. Yeh sirf ARP ka delay hai.",
    },
  ],
  recap: [
    { en: "Ethernet frames need a destination MAC; ARP finds it from an IPv4 address.", hi: "Ethernet frame ko destination MAC chahiye; ARP use IPv4 address se dhoondhta hai." },
    { en: "ARP Request is broadcast to FFFF.FFFF.FFFF; ARP Reply is unicast.", hi: "ARP Request FFFF.FFFF.FFFF par broadcast hoti hai; ARP Reply unicast hota hai." },
    { en: "Same subnet: ARP for the destination. Different subnet: ARP for the default gateway.", hi: "Same subnet: destination ke liye ARP. Doosra subnet: default gateway ke liye ARP." },
    { en: "Results are cached; `show ip arp` and `arp -a` show the cache.", hi: "Results cache hote hain; `show ip arp` aur `arp -a` cache dikhate hain." },
    { en: "ARP has no authentication, which is why DAI exists. IPv6 uses NDP instead of ARP.", hi: "ARP mein authentication nahi hai, isliye DAI bana. IPv6 ARP ki jagah NDP use karta hai." },
  ],
  quiz: [
    {
      q: {
        en: "PC1 is 192.168.10.50/24 with gateway 192.168.10.1. It pings 192.168.20.10 and its ARP cache is empty. Which IP address does PC1 put in the target field of its ARP request?",
        hi: "PC1 ka IP 192.168.10.50/24 hai aur gateway 192.168.10.1. Woh 192.168.20.10 ko ping karta hai aur ARP cache khaali hai. PC1 apni ARP request ke target field mein kaunsa IP daalega?",
      },
      options: [
        { en: "192.168.20.10", hi: "192.168.20.10" },
        { en: "192.168.10.1", hi: "192.168.10.1" },
        { en: "192.168.10.255", hi: "192.168.10.255" },
        { en: "255.255.255.255", hi: "255.255.255.255" },
      ],
      answer: 1,
      explain: {
        en: "192.168.20.10 is outside 192.168.10.0/24, so PC1 must send the frame to its gateway. It ARPs for 192.168.10.1.",
        hi: "192.168.20.10, 192.168.10.0/24 ke bahar hai, isliye PC1 ko frame gateway ko bhejna hoga. Woh 192.168.10.1 ke liye ARP karega.",
      },
      kind: "scenario",
    },
    {
      q: { en: "What destination MAC address does an ARP request use?", hi: "ARP request kaunsa destination MAC address use karti hai?" },
      options: [
        { en: "The default gateway's MAC", hi: "Default gateway ka MAC" },
        { en: "0000.0000.0000", hi: "0000.0000.0000" },
        { en: "FFFF.FFFF.FFFF", hi: "FFFF.FFFF.FFFF" },
        { en: "0100.5E00.0001", hi: "0100.5E00.0001" },
      ],
      answer: 2,
      explain: {
        en: "The sender does not know the target's MAC yet, so the request is a broadcast to FFFF.FFFF.FFFF. The all-zeros value appears inside the ARP message as the unknown target MAC, not as the frame destination.",
        hi: "Sender ko abhi target ka MAC pata nahi, isliye request FFFF.FFFF.FFFF par broadcast hoti hai. All-zeros value ARP message ke andar unknown target MAC ke roop mein hoti hai, frame destination ke roop mein nahi.",
      },
      kind: "concept",
    },
    {
      q: { en: "How is an ARP reply normally delivered?", hi: "ARP reply aam taur par kaise deliver hota hai?" },
      options: [
        { en: "Unicast to the host that asked", hi: "Poochne wale host ko unicast" },
        { en: "Broadcast to the whole VLAN", hi: "Poore VLAN ko broadcast" },
        { en: "Multicast to all routers", hi: "Saare routers ko multicast" },
        { en: "Inside a UDP datagram to port 67", hi: "Port 67 par UDP datagram ke andar" },
      ],
      answer: 0,
      explain: {
        en: "The replying host learned the requester's MAC from the request, so it answers directly with a unicast frame.",
        hi: "Reply karne wale host ne request se hi poochne wale ka MAC seekh liya, isliye woh seedha unicast frame se jawab deta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A router shows `Internet 10.1.1.1  -  0011.2233.4401  ARPA  GigabitEthernet0/0` in `show ip arp`. What does the \"-\" in the Age column mean?",
        hi: "Router ke `show ip arp` mein `Internet 10.1.1.1  -  0011.2233.4401  ARPA  GigabitEthernet0/0` dikhta hai. Age column mein \"-\" ka kya matlab hai?",
      },
      options: [
        { en: "The entry is incomplete", hi: "Entry incomplete hai" },
        { en: "The entry is about to expire", hi: "Entry expire hone wali hai" },
        { en: "It was learned from a gratuitous ARP", hi: "Yeh gratuitous ARP se seekhi gayi" },
        { en: "It is the router's own interface address", hi: "Yeh router ka apna interface address hai" },
      ],
      answer: 3,
      explain: {
        en: "Entries for the router's own interfaces never age out, so IOS shows a dash instead of minutes.",
        hi: "Router ke apne interfaces ki entries kabhi age out nahi hoti, isliye IOS minutes ki jagah dash dikhata hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "Host A pings host B on the same VLAN for the first time. How many hosts on the VLAN receive A's ARP request?",
        hi: "Host A same VLAN par host B ko pehli baar ping karta hai. VLAN ke kitne hosts ko A ki ARP request milti hai?",
      },
      options: [
        { en: "Only host B", hi: "Sirf host B" },
        { en: "Every host in the VLAN", hi: "VLAN ka har host" },
        { en: "Only the default gateway", hi: "Sirf default gateway" },
        { en: "Every host in every VLAN on the switch", hi: "Switch ke har VLAN ka har host" },
      ],
      answer: 1,
      explain: {
        en: "A broadcast is flooded to every port in the same VLAN. Other VLANs are separate broadcast domains and never see it.",
        hi: "Broadcast same VLAN ke har port par flood hota hai. Doosre VLANs alag broadcast domain hain, unhe yeh kabhi nahi dikhta.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Which statement about sending a packet from 10.1.1.10 to 8.8.8.8 through gateway 10.1.1.1 is correct?",
        hi: "10.1.1.10 se gateway 10.1.1.1 ke through 8.8.8.8 ko packet bhejne ke baare mein kaunsa statement sahi hai?",
      },
      options: [
        { en: "Destination IP 10.1.1.1, destination MAC of 8.8.8.8", hi: "Destination IP 10.1.1.1, destination MAC 8.8.8.8 ka" },
        { en: "Destination IP 8.8.8.8, destination MAC of 8.8.8.8", hi: "Destination IP 8.8.8.8, destination MAC 8.8.8.8 ka" },
        { en: "Destination IP 8.8.8.8, destination MAC of the gateway", hi: "Destination IP 8.8.8.8, destination MAC gateway ka" },
        { en: "Destination IP 10.1.1.1, destination MAC of the gateway", hi: "Destination IP 10.1.1.1, destination MAC gateway ka" },
      ],
      answer: 2,
      explain: {
        en: "The IP header always carries the final destination. The Ethernet header carries the next hop, which here is the gateway.",
        hi: "IP header hamesha final destination rakhta hai. Ethernet header next hop rakhta hai, jo yahan gateway hai.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "5q1pqdmdPjo",
      title: "Free CCNA | Ethernet LAN Switching (Part 2) | Day 6",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Covers ARP and ping together with switching, with packet captures.", hi: "ARP aur ping ko switching ke saath cover karta hai, packet captures ke saath." },
    },
    {
      id: "KBdegBiZ7Ts",
      title: "Routing Fundamentals - What is ARP | How ARP Works",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "A Hindi walkthrough of the request and reply.", hi: "Request aur reply ka Hindi walkthrough." },
    },
  ],
  lab: {
    title: { en: "Watch ARP happen in Packet Tracer", hi: "Packet Tracer mein ARP hote hue dekho" },
    steps: [
      { en: "Build one switch with three PCs (10.1.1.10, .20, .30 /24) and a router on 10.1.1.1.", hi: "Ek switch ke saath teen PCs (10.1.1.10, .20, .30 /24) aur 10.1.1.1 par ek router banao." },
      { en: "Switch to Simulation mode and filter events to ARP and ICMP only.", hi: "Simulation mode mein jao aur events ko sirf ARP aur ICMP par filter karo." },
      { en: "Ping 10.1.1.20 from PC-A and step through: find the broadcast, the flood and the unicast reply.", hi: "PC-A se 10.1.1.20 ping karo aur step by step dekho: broadcast, flood aur unicast reply dhoondho." },
      { en: "Run `arp -a` on PC-A, then ping 8.8.8.8 and run it again. Which new entry appeared?", hi: "PC-A par `arp -a` chalao, phir 8.8.8.8 ping karke dobara chalao. Kaunsi nayi entry aayi?" },
      { en: "On the router run `show ip arp`, then `clear arp-cache`, and ping again to see the first `.` return.", hi: "Router par `show ip arp` chalao, phir `clear arp-cache`, aur dobara ping karke pehla `.` wapas aate dekho." },
    ],
  },
};

export default lesson;
