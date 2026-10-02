import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "what-is-a-network",
  intro: {
    en: "A network is two or more devices connected so they can exchange data. You already run one: your phone, laptop and TV all talk through the small box your internet provider installed. Every CCNA topic, from switching to routing to security, is about how data moves inside a network like this and out of it to the rest of the world.",
    hi: "Network matlab do ya zyada devices jo aapas mein data exchange kar sakein. Tum already ek network chala rahe ho: tumhara phone, laptop aur TV sab us chhote box ke through baat karte hain jo internet provider ne lagaya hai. CCNA ka har topic, chahe switching ho, routing ho ya security, isi baare mein hai ki data aise network ke andar kaise chalta hai aur bahar baaki duniya tak kaise jaata hai.",
  },
  outcomes: [
    { en: "Name the hosts, links and network devices in your own home network", hi: "Apne ghar ke network mein hosts, links aur network devices pehchaan sako" },
    { en: "Explain the client, server and peer-to-peer roles with an example of each", hi: "Client, server aur peer-to-peer roles ko ek-ek example ke saath samjha sako" },
    { en: "Tell a LAN from a WAN, and explain why the internet is a network of networks", hi: "LAN aur WAN ka farak bata sako, aur samjha sako ki internet networks ka network kyun hai" },
    { en: "Predict whether traffic stays inside your LAN or leaves through the router", hi: "Predict kar sako ki traffic LAN ke andar rahega ya router se bahar jaayega" },
    { en: "Tell bandwidth from latency and work out a simple download time", hi: "Bandwidth aur latency ka farak samjho aur simple download time calculate kar sako" },
  ],
  sections: [
    {
      id: "your-home-network",
      heading: { en: "Your home is already a network", hi: "Tumhara ghar already ek network hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Look at what is connected at home. A laptop, a phone and a smart TV join over Wi-Fi. A printer may be plugged in with a cable. All of them connect to one box, usually installed by your **internet service provider (ISP)**, and that box connects your home to the ISP over a fiber or copper line.",
            hi: "Ghar mein dekho kya-kya connected hai. Laptop, phone aur smart TV Wi-Fi se judte hain. Printer shayad cable se laga ho. Yeh sab ek box se connect hote hain, jo aam taur par tumhare **internet service provider (ISP)** ne lagaya hota hai, aur wahi box fiber ya copper line se tumhare ghar ko ISP se jodta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "People call that box a **home router** or **Wi-Fi router**, but inside it does several jobs that are separate devices in an office network:",
            hi: "Log is box ko **home router** ya **Wi-Fi router** kehte hain, lekin iske andar kai kaam hote hain jo office network mein alag-alag devices karte hain:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Wireless access point (AP)**: talks to Wi-Fi devices over radio and connects them to the wired side.",
              hi: "**Wireless access point (AP)**: Wi-Fi devices se radio par baat karta hai aur unhe wired side se jodta hai.",
            },
            {
              en: "**Switch**: the few Ethernet ports (often four, marked LAN) that connect wired devices to each other.",
              hi: "**Switch**: woh kuch Ethernet ports (aksar chaar, jin par LAN likha hota hai) jo wired devices ko aapas mein jodte hain.",
            },
            {
              en: "**Router**: the one part that connects your home network to the ISP, through the port marked WAN or Internet.",
              hi: "**Router**: sirf yahi part tumhare ghar ke network ko ISP se jodta hai, us port ke through jis par WAN ya Internet likha hota hai.",
            },
            {
              en: "Extras: it hands out addresses to your devices (DHCP, lesson 4.1) and blocks traffic from the internet that nobody inside asked for. On fiber plans the box often includes the ONT, which converts the light signal on the fiber into electrical signals.",
              hi: "Extra kaam: yeh tumhare devices ko addresses deta hai (DHCP, lesson 4.1) aur internet se aane wala woh traffic block karta hai jo andar kisi ne maanga hi nahi. Fiber plans mein aksar isi box mein ONT bhi hota hai, jo fiber ke light signal ko electrical signal mein badalta hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "The name the exam uses", hi: "Exam wala naam" },
          text: {
            en: "CCNA calls a network this size **SOHO** (small office/home office). The all-in-one box is typical of SOHO. Bigger networks use a separate device for each job, which is the topic of lesson 0.2.",
            hi: "CCNA is size ke network ko **SOHO** (small office/home office) kehta hai. All-in-one box SOHO ki pehchaan hai. Bade networks mein har kaam ke liye alag device hota hai, aur wahi lesson 0.2 ka topic hai.",
          },
        },
      ],
    },
    {
      id: "hosts-clients-servers",
      heading: { en: "Hosts, clients, servers and peers", hi: "Hosts, clients, servers aur peers" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **host** (also called an endpoint) is a device that sends or receives data for a person or an application: a laptop, phone, TV, printer, camera or server. Traffic starts and ends at hosts. Switches and routers sit in between and move the hosts' traffic.",
            hi: "**Host** (ise endpoint bhi kehte hain) woh device hai jo kisi insaan ya application ke liye data bhejta ya receive karta hai: laptop, phone, TV, printer, camera ya server. Traffic hosts par shuru hota hai aur hosts par hi khatam. Switches aur routers beech mein baithte hain aur hosts ka traffic aage badhaate hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "Every host has an address so others can reach it. In the home network used in this lesson, the laptop is `192.168.1.10`, the phone `192.168.1.11`, the TV `192.168.1.12` and the printer `192.168.1.20`. Lesson 1.3 explains how these addresses are built; for now, treat them like house numbers on one street.",
            hi: "Har host ka ek address hota hai taaki baaki devices use dhoondh sakein. Is lesson ke home network mein laptop `192.168.1.10` hai, phone `192.168.1.11`, TV `192.168.1.12` aur printer `192.168.1.20`. Yeh addresses kaise bante hain, woh lesson 1.3 mein aayega; abhi ke liye inhe ek hi gali ke house numbers samjho.",
          },
        },
        {
          type: "p",
          text: {
            en: "In each conversation, hosts take roles. A **client** asks for something and a **server** provides it.",
            hi: "Har conversation mein hosts ek role lete hain. **Client** kuch maangta hai aur **server** woh cheez deta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Client and server in everyday traffic", hi: "Roz ke traffic mein client aur server" },
          columns: [
            { en: "Conversation", hi: "Conversation" },
            { en: "Client (asks)", hi: "Client (maangta hai)" },
            { en: "Server (provides)", hi: "Server (deta hai)" },
          ],
          rows: [
            [
              { en: "Opening a website", hi: "Website kholna" },
              { en: "Browser on your laptop", hi: "Laptop ka browser" },
              { en: "Web server in a data centre", hi: "Data centre mein web server" },
            ],
            [
              { en: "Printing a page", hi: "Page print karna" },
              { en: "Laptop", hi: "Laptop" },
              { en: "Printer", hi: "Printer" },
            ],
            [
              { en: "Streaming a film", hi: "Film stream karna" },
              { en: "App on the smart TV", hi: "Smart TV ka app" },
              { en: "Streaming service's video servers", hi: "Streaming service ke video servers" },
            ],
            [
              { en: "Checking email", hi: "Email check karna" },
              { en: "Mail app on your phone", hi: "Phone ka mail app" },
              { en: "Mail server", hi: "Mail server" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Client and server are roles, not kinds of hardware. A laptop is a client while browsing and a server while it shares a folder. In a **peer-to-peer** setup each device does both: two laptops copying files from each other's shared folders, or a file-sharing app where every user downloads from others and uploads to them at the same time.",
            hi: "Client aur server roles hain, hardware ki type nahi. Laptop browsing karte waqt client hai aur folder share karte waqt server. **Peer-to-peer** setup mein har device dono kaam karta hai: jaise do laptops jo ek doosre ke shared folders se files copy karte hain, ya file-sharing app jisme har user doosron se download bhi karta hai aur unhe upload bhi, ek hi time par.",
          },
        },
      ],
    },
    {
      id: "links",
      heading: { en: "Links: how devices are connected", hi: "Links: devices kaise jude hote hain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **link** is the connection between two devices. Data crosses a link as signals: electrical, light or radio. Three kinds cover almost every network you will work on.",
            hi: "**Link** do devices ke beech ka connection hai. Link par data signals ki shakal mein jaata hai: electrical, light ya radio. Tum jis bhi network par kaam karoge, lagbhag sab mein yahi teen tarah ke links milenge.",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Link", hi: "Link" },
            { en: "Carries data as", hi: "Data kis form mein jaata hai" },
            { en: "Where you meet it", hi: "Kahan milta hai" },
          ],
          rows: [
            [
              { en: "Copper (Ethernet cable)", hi: "Copper (Ethernet cable)" },
              { en: "Electrical signals", hi: "Electrical signals" },
              { en: "Printer to home router, PCs to office switches", hi: "Printer se home router, PCs se office switches" },
            ],
            [
              { en: "Fiber optic", hi: "Fiber optic" },
              { en: "Pulses of light", hi: "Light ke pulses" },
              { en: "ISP line into your home, links between buildings and inside data centres", hi: "Ghar tak ISP ki line, buildings ke beech aur data centres ke andar ke links" },
            ],
            [
              { en: "Wireless (Wi-Fi)", hi: "Wireless (Wi-Fi)" },
              { en: "Radio waves", hi: "Radio waves" },
              { en: "Phone, laptop and TV to the access point", hi: "Phone, laptop aur TV se access point tak" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "The point where a link attaches to a device is its **interface** (or port). A laptop has a Wi-Fi interface and maybe an Ethernet port; an office switch may have 48 Ethernet ports. Lesson 0.6 covers cables and connectors in detail.",
            hi: "Jahan link device se judta hai, use us device ka **interface** (ya port) kehte hain. Laptop mein ek Wi-Fi interface hota hai aur shayad ek Ethernet port; office switch mein 48 Ethernet ports bhi ho sakte hain. Cables aur connectors ki detail lesson 0.6 mein hai.",
          },
        },
      ],
    },
    {
      id: "lan-wan-internet",
      heading: { en: "LAN, WAN and the internet", hi: "LAN, WAN aur internet" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **LAN (local area network)** connects devices in one place: a home, an office floor, a campus. Whoever owns the place builds and runs it, and it is cheap to extend: add a switch port or another access point.",
            hi: "**LAN (local area network)** ek jagah ke devices ko jodta hai: ghar, office ka ek floor, ya campus. Jiski jagah hai wahi ise banata aur chalata hai, aur ise badhana sasta hai: ek switch port ya ek aur access point laga do.",
          },
        },
        {
          type: "p",
          text: {
            en: "A **WAN (wide area network)** connects networks that are far apart: a branch office in Pune to headquarters in Delhi, or your home to your ISP. The long-distance links usually belong to a service provider, and you pay to use them.",
            hi: "**WAN (wide area network)** door-door ke networks ko jodta hai: jaise Pune ka branch office Delhi ke headquarters se, ya tumhara ghar tumhare ISP se. Lambi doori wale links aam taur par kisi service provider ke hote hain, aur unhe use karne ke paise dene padte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "The **internet** is not one network. It is tens of thousands of separately run networks (ISPs, cloud providers, universities, companies) connected to each other, all following the same rules, the TCP/IP protocols. Your ISP connects your home to its own network, and its network connects to the others.",
            hi: "**Internet** ek single network nahi hai. Yeh hazaaron alag-alag chalne wale networks (ISPs, cloud providers, universities, companies) hain jo aapas mein jude hain, aur sab ek hi rules follow karte hain, yaani TCP/IP protocols. Tumhara ISP tumhare ghar ko apne network se jodta hai, aur uska network baaki networks se.",
          },
        },
        {
          type: "table",
          columns: ["", "LAN", "WAN"],
          rows: [
            [
              { en: "Covers", hi: "Kitna area" },
              { en: "One building or campus", hi: "Ek building ya campus" },
              { en: "Cities, states, countries", hi: "Shehar, states, desh" },
            ],
            [
              { en: "Links owned by", hi: "Links kiske hain" },
              { en: "You", hi: "Tumhare" },
              { en: "Usually a provider; you rent them", hi: "Aam taur par provider ke; tum kiraye par lete ho" },
            ],
            [
              { en: "Examples", hi: "Examples" },
              { en: "Home Wi-Fi, office switches", hi: "Ghar ka Wi-Fi, office ke switches" },
              { en: "Leased line between two offices, your ISP connection", hi: "Do offices ke beech leased line, tumhara ISP connection" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "WAN does not always mean internet", hi: "WAN ka matlab hamesha internet nahi" },
          text: {
            en: "A company can rent a private link between its Delhi and Mumbai offices that never touches the internet. That is still a WAN. Lesson 1.13 covers the WAN options.",
            hi: "Company apne Delhi aur Mumbai offices ke beech ek private link kiraye par le sakti hai jo internet ko chhoota hi nahi. Woh bhi WAN hai. WAN ke options lesson 1.13 mein hain.",
          },
        },
      ],
    },
    {
      id: "local-or-remote",
      heading: { en: "Two trips: printing and opening a website", hi: "Do trips: printing aur website kholna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Before a host sends anything, it asks one question: is the destination in my own network? The answer decides the whole path. Follow the two trips in the animation.",
            hi: "Kuch bhi bhejne se pehle host ek sawaal poochta hai: kya destination mere apne network mein hai? Isi jawab se poora raasta decide hota hai. Animation mein dono trips dekho.",
          },
        },
        {
          type: "p",
          text: { en: "**Trip 1: printing.**", hi: "**Trip 1: printing.**" },
        },
        {
          type: "steps",
          items: [
            {
              en: "The laptop (`192.168.1.10`) sends a print job to the printer (`192.168.1.20`). Both are `192.168.1.x`, the same home network, so the laptop sends directly: over Wi-Fi to the AP, through the switch, down the cable to the printer.",
              hi: "Laptop (`192.168.1.10`) printer (`192.168.1.20`) ko print job bhejta hai. Dono `192.168.1.x` hain, yaani same home network, isliye laptop seedha bhejta hai: Wi-Fi se AP, phir switch, phir cable se printer.",
            },
            {
              en: "The printer answers the same way back. The router part of the box and the ISP line are never used, so printing still works when the internet is down.",
              hi: "Printer usi raaste se jawab deta hai. Box ka router wala part aur ISP line kabhi use hi nahi hote, isliye internet band ho tab bhi printing chalti hai.",
            },
          ],
        },
        {
          type: "p",
          text: { en: "**Trip 2: opening a website.**", hi: "**Trip 2: website kholna.**" },
        },
        {
          type: "steps",
          items: [
            {
              en: "The web server is at `198.51.100.10`, which is not a `192.168.1.x` address. The laptop cannot reach it directly, so it hands the request to its **default gateway**: the router, `192.168.1.1`.",
              hi: "Web server `198.51.100.10` par hai, jo `192.168.1.x` wala address nahi hai. Laptop wahan seedha nahi pahunch sakta, isliye request apne **default gateway** ko deta hai, yaani router `192.168.1.1` ko.",
            },
            {
              en: "The router sends the request out of its WAN port to the ISP. On the way it replaces the laptop's private address with the home's public address, `203.0.113.25` (NAT, lesson 4.3).",
              hi: "Router request ko apne WAN port se ISP ki taraf bhejta hai. Raaste mein woh laptop ka private address hata kar ghar ka public address `203.0.113.25` laga deta hai (NAT, lesson 4.3).",
            },
            {
              en: "The ISP and the networks beyond it pass the request along until it reaches the server. The reply comes back to `203.0.113.25`, and the router hands it to the laptop.",
              hi: "ISP aur uske aage ke networks request ko aage badhaate hain jab tak woh server tak na pahunch jaaye. Reply `203.0.113.25` par wapas aata hai, aur router use laptop ko de deta hai.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "See the path yourself (Windows)", hi: "Raasta khud dekho (Windows)" },
          lines: [
            { prompt: "C:\\>", cmd: "tracert 198.51.100.10" },
            { out: "Tracing route to 198.51.100.10 over a maximum of 30 hops" },
            { out: "  1     2 ms     1 ms     2 ms  192.168.1.1", comment: { en: "Hop 1: your home router, the default gateway", hi: "Hop 1: tumhara home router, yaani default gateway" } },
            { out: "  2     6 ms     5 ms     6 ms  203.0.113.1", comment: { en: "Hop 2: the ISP's first router", hi: "Hop 2: ISP ka pehla router" } },
            { out: "  3    31 ms    30 ms    31 ms  192.0.2.45", comment: { en: "Another network on the way", hi: "Raaste ka ek aur network" } },
            { out: "  4    38 ms    37 ms    38 ms  198.51.100.10", comment: { en: "The web server", hi: "Web server" } },
            { out: "Trace complete." },
          ],
          note: {
            en: "Tracing to the printer would show a single hop, the printer itself, because local traffic never passes through the router.",
            hi: "Printer tak trace karoge toh sirf ek hop dikhega, khud printer, kyunki local traffic router se hokar jaata hi nahi.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "The default gateway is the way out", hi: "Default gateway hi bahar ka raasta hai" },
          text: {
            en: "A host sends everything outside its own network to its default gateway. If the gateway address is wrong or missing, local traffic still works but nothing outside the LAN does. You will meet this pattern again in ARP (lesson 1.2) and in routing (module 3).",
            hi: "Host apne network ke bahar ka sab kuch default gateway ko bhejta hai. Gateway address galat ho ya ho hi nahi, toh local traffic chalta rahega lekin LAN ke bahar kuch nahi jaayega. Yeh pattern tumhe ARP (lesson 1.2) aur routing (module 3) mein phir milega.",
          },
        },
      ],
    },
    {
      id: "bandwidth-and-latency",
      heading: { en: "Bandwidth and latency are different things", hi: "Bandwidth aur latency alag cheezein hain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Bandwidth** is how much data a link can carry per second, measured in bits per second: Mbps (million) or Gbps (billion). A 100 Mbps internet plan means the ISP link carries at most 100 million bits each second.",
            hi: "**Bandwidth** batata hai ki link ek second mein kitna data le ja sakta hai, aur yeh bits per second mein naapa jaata hai: Mbps (million) ya Gbps (billion). 100 Mbps plan ka matlab hai ISP link har second zyada se zyada 100 million bits le ja sakta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Latency** is how long data takes to get from one point to another, measured in milliseconds (ms). It grows with distance and with every device the data passes through. The `ping` command shows the **round-trip time**: there and back.",
            hi: "**Latency** batati hai ki data ko ek jagah se doosri jagah pahunchne mein kitna time lagta hai, aur yeh milliseconds (ms) mein naapi jaati hai. Doori badhne se aur har us device se jisse data guzarta hai, latency badhti hai. `ping` command **round-trip time** dikhata hai: jaana aur wapas aana.",
          },
        },
        {
          type: "cli",
          title: { en: "Local vs internet latency (Windows)", hi: "Local vs internet latency (Windows)" },
          lines: [
            { prompt: "C:\\>", cmd: "ping 192.168.1.20" },
            { out: "Reply from 192.168.1.20: bytes=32 time=3ms TTL=64", comment: { en: "The printer, one hop away: about 3 ms", hi: "Printer, sirf ek hop door: lagbhag 3 ms" } },
            { out: "Reply from 192.168.1.20: bytes=32 time=2ms TTL=64" },
            { prompt: "C:\\>", cmd: "ping 198.51.100.10" },
            { out: "Reply from 198.51.100.10: bytes=32 time=38ms TTL=61", comment: { en: "The web server, several networks away: about 38 ms", hi: "Web server, kai networks door: lagbhag 38 ms" } },
            { out: "Reply from 198.51.100.10: bytes=32 time=37ms TTL=61" },
          ],
          note: {
            en: "`time=` is the round-trip latency. Ignore TTL for now; it is explained with the IPv4 header.",
            hi: "`time=` round-trip latency hai. TTL ko abhi ignore karo; woh IPv4 header ke saath samjhaya jaayega.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Lanes and distance", hi: "Lanes aur doori" },
          text: {
            en: "Bandwidth is the number of lanes on a highway; latency is how long the drive takes. More lanes let more cars travel at once, but they do not make Delhi to Mumbai any shorter.",
            hi: "Bandwidth highway ki lanes ki ginti hai; latency yeh hai ki safar mein kitna time lagta hai. Zyada lanes se ek saath zyada gaadiyan chal sakti hain, lekin Delhi se Mumbai ki doori kam nahi hoti.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Bits and bytes.** Speeds are quoted in bits (small b), file sizes in bytes (capital B), and 1 byte = 8 bits. To download a 500 MB file on a 100 Mbps link: 500 × 8 = 4,000 megabits, and 4,000 ÷ 100 = 40 seconds at best. Real downloads take a little longer because protocols add overhead and other traffic shares the link.",
            hi: "**Bits aur bytes.** Speed bits mein batayi jaati hai (chhota b), file size bytes mein (bada B), aur 1 byte = 8 bits. 100 Mbps link par 500 MB file download karni hai: 500 × 8 = 4,000 megabits, aur 4,000 ÷ 100 = best case mein 40 seconds. Asli download thoda zyada time leta hai, kyunki protocols ka overhead hota hai aur link par doosra traffic bhi chalta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Why distance costs time", hi: "Doori se time kyun lagta hai" },
          text: {
            en: "Light in fiber travels about 200,000 km per second, which is roughly 5 ms for every 1,000 km, one way. No bandwidth upgrade removes that, which is why a game server in India feels faster than one in the USA.",
            hi: "Fiber mein light lagbhag 200,000 km per second chalti hai, yaani har 1,000 km ke liye ek taraf lagbhag 5 ms. Bandwidth kitni bhi badha lo, yeh time nahi hatega, isliye India ka game server USA wale se fast lagta hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Host", def: { en: "A device that sends or receives data for a user or application, such as a laptop, phone, printer or server. Also called an endpoint.", hi: "Woh device jo kisi user ya application ke liye data bhejta ya receive karta hai, jaise laptop, phone, printer ya server. Ise endpoint bhi kehte hain." } },
    { term: "Client and server", def: { en: "Roles in a conversation: the client asks for a service and the server provides it.", hi: "Conversation ke roles: client service maangta hai aur server woh service deta hai." } },
    { term: "Peer-to-peer", def: { en: "An arrangement where each device acts as both client and server for the others.", hi: "Aisa setup jisme har device doosron ke liye client bhi hota hai aur server bhi." } },
    { term: "LAN", def: { en: "Local area network: devices in one location, owned and run by one organisation or household.", hi: "Local area network: ek jagah ke devices, jinhe ek organisation ya ghar khud own aur manage karta hai." } },
    { term: "WAN", def: { en: "Wide area network: links that connect distant sites, usually rented from a service provider.", hi: "Wide area network: door ki sites ko jodne wale links, jo aam taur par service provider se kiraye par liye jaate hain." } },
    { term: "Internet", def: { en: "The worldwide set of independently run networks that are connected to each other and use TCP/IP.", hi: "Duniya bhar ke alag-alag chalne wale networks ka set jo aapas mein jude hain aur TCP/IP use karte hain." } },
    { term: "Bandwidth", def: { en: "How much data a link can carry per second, in bits per second (Mbps, Gbps).", hi: "Link ek second mein kitna data le ja sakta hai, bits per second (Mbps, Gbps) mein." } },
    { term: "Latency", def: { en: "How long data takes to travel from one point to another, in milliseconds.", hi: "Data ko ek point se doosre point tak jaane mein kitna time lagta hai, milliseconds mein." } },
  ],
  commands: [
    { cmd: "ipconfig", mode: "Windows Command Prompt", does: { en: "Show the PC's IP address, mask and default gateway", hi: "PC ka IP address, mask aur default gateway dikhata hai" } },
    { cmd: "ping <address>", mode: "Windows, macOS or Linux terminal", does: { en: "Test whether a host answers, and measure the round-trip time", hi: "Check karta hai ki host jawab deta hai ya nahi, aur round-trip time naapta hai" } },
    { cmd: "tracert <address>", mode: "Windows Command Prompt", does: { en: "List each router on the path to a destination", hi: "Destination tak ke raaste ka har router list karta hai" } },
    { cmd: "traceroute <address>", mode: "macOS / Linux terminal", does: { en: "Same as tracert, on macOS and Linux", hi: "tracert jaisa hi, macOS aur Linux par" } },
  ],
  mistakes: [
    {
      en: "Thinking Wi-Fi and the internet are the same thing. Wi-Fi is only the radio link to your access point; the internet is reached through the router and the ISP. You can have full Wi-Fi bars and no internet.",
      hi: "Yeh sochna ki Wi-Fi aur internet ek hi cheez hain. Wi-Fi sirf access point tak ka radio link hai; internet tak router aur ISP ke through pahunchte hain. Wi-Fi ke poore bars ho sakte hain aur internet phir bhi na ho.",
    },
    {
      en: "Assuming every message goes out to the internet. Traffic between two devices at home, such as printing or copying files, stays in the LAN and never reaches the ISP.",
      hi: "Yeh maan lena ki har message internet par jaata hai. Ghar ke do devices ke beech ka traffic, jaise printing ya file copy, LAN mein hi rehta hai aur ISP tak kabhi nahi jaata.",
    },
    {
      en: "Mixing up bits and bytes. 100 Mbps is 100 megabits per second, about 12.5 megabytes per second, not 100 MB/s.",
      hi: "Bits aur bytes ko mix karna. 100 Mbps matlab 100 megabits per second, jo lagbhag 12.5 megabytes per second hai, 100 MB/s nahi.",
    },
    {
      en: "Expecting a faster plan to fix lag to a distant server. More bandwidth does not shorten the distance; the latency stays about the same.",
      hi: "Yeh expect karna ki faster plan se door ke server ka lag theek ho jaayega. Zyada bandwidth se doori kam nahi hoti; latency lagbhag utni hi rehti hai.",
    },
    {
      en: "Thinking 'server' means a special large computer. Server is a role: any device that answers requests, including a printer or a laptop sharing files.",
      hi: "Yeh sochna ki 'server' matlab koi khaas bada computer. Server ek role hai: koi bhi device jo requests ka jawab de, printer ya files share karta laptop bhi.",
    },
    {
      en: "Calling any long cable a WAN. WAN means links between separate sites, usually from a provider; a 90 m cable inside one building is still part of the LAN.",
      hi: "Har lambi cable ko WAN bol dena. WAN matlab alag-alag sites ke beech ke links, aam taur par provider ke; ek building ke andar ki 90 m cable bhi LAN ka hi hissa hai.",
    },
  ],
  recap: [
    { en: "A network is hosts plus the links and network devices that move data between them.", hi: "Network matlab hosts, aur woh links aur network devices jo unke beech data le jaate hain." },
    { en: "A client asks, a server provides; in peer-to-peer each device does both.", hi: "Client maangta hai, server deta hai; peer-to-peer mein har device dono karta hai." },
    { en: "LAN = one location, you run it. WAN = links between distant sites, usually rented. The internet = many networks joined together.", hi: "LAN = ek jagah, tum chalate ho. WAN = door ki sites ke beech links, aam taur par kiraye par. Internet = bahut saare networks jo aapas mein jude hain." },
    { en: "Traffic for your own network goes directly; everything else goes to the default gateway, the router.", hi: "Apne network ka traffic seedha jaata hai; baaki sab default gateway, yaani router, ko jaata hai." },
    { en: "The home router box is an AP, a switch and a router in one (SOHO).", hi: "Home router box ek saath AP, switch aur router hai (SOHO)." },
    { en: "Bandwidth = how much per second (Mbps). Latency = how long, in ms. Bytes × 8 = bits.", hi: "Bandwidth = ek second mein kitna (Mbps). Latency = kitna time, ms mein. Bytes × 8 = bits." },
  ],
  quiz: [
    {
      q: {
        en: "Two laptops at home share folders with each other. Each one copies files from the other and also serves its own files. What is this arrangement called?",
        hi: "Ghar ke do laptops aapas mein folders share karte hain. Dono ek doosre se files copy bhi karte hain aur apni files serve bhi karte hain. Is setup ko kya kehte hain?",
      },
      options: [
        { en: "Client-server with a dedicated server", hi: "Dedicated server wala client-server" },
        { en: "A WAN connection", hi: "WAN connection" },
        { en: "Peer-to-peer", hi: "Peer-to-peer" },
        { en: "Internet routing", hi: "Internet routing" },
      ],
      answer: 2,
      explain: {
        en: "Each laptop is a client when it copies and a server when it shares, so the two are peers. There is no dedicated server, and both laptops are in the same home, so no WAN is involved.",
        hi: "Har laptop copy karte waqt client hai aur share karte waqt server, isliye dono peers hain. Koi dedicated server nahi hai, aur dono laptops ek hi ghar mein hain, isliye WAN ka sawaal hi nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "The fiber line to your home is cut, but the Wi-Fi is still on. Which of these still works?",
        hi: "Tumhare ghar ki fiber line kat gayi hai, lekin Wi-Fi abhi bhi on hai. Inme se kya abhi bhi chalega?",
      },
      options: [
        { en: "Printing from your laptop to your home printer", hi: "Laptop se ghar ke printer par print karna" },
        { en: "Opening a news website", hi: "News website kholna" },
        { en: "A video call to a friend in another city", hi: "Doosre shehar ke dost ko video call" },
        { en: "Downloading an app update", hi: "App update download karna" },
      ],
      answer: 0,
      explain: {
        en: "The laptop and printer are in the same LAN, so the print job goes AP → switch → printer and never needs the ISP line. The other three all need servers outside your home.",
        hi: "Laptop aur printer same LAN mein hain, isliye print job AP → switch → printer jaata hai aur ISP line ki zaroorat hi nahi padti. Baaki teeno ko ghar ke bahar ke servers chahiye.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which of these is a WAN link?", hi: "Inme se WAN link kaunsa hai?" },
      options: [
        { en: "Wi-Fi between your phone and the home access point", hi: "Phone aur ghar ke access point ke beech ka Wi-Fi" },
        { en: "An Ethernet cable from the printer to the home router", hi: "Printer se home router tak ki Ethernet cable" },
        { en: "A cable between two switches on the same office floor", hi: "Office ke same floor par do switches ke beech ki cable" },
        { en: "A leased line joining a company's Delhi and Mumbai offices", hi: "Company ke Delhi aur Mumbai offices ko jodne wali leased line" },
      ],
      answer: 3,
      explain: {
        en: "A WAN connects distant sites, usually over links rented from a provider. The other three connect devices in one location, so they are LAN links.",
        hi: "WAN door ki sites ko jodta hai, aam taur par provider se kiraye par liye links se. Baaki teeno ek hi jagah ke devices jodte hain, isliye woh LAN links hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Your internet plan is 100 Mbps. In the best case, how long does a 500 MB download take?",
        hi: "Tumhara internet plan 100 Mbps ka hai. Best case mein 500 MB download hone mein kitna time lagega?",
      },
      options: [
        { en: "5 seconds", hi: "5 seconds" },
        { en: "40 seconds", hi: "40 seconds" },
        { en: "50 seconds", hi: "50 seconds" },
        { en: "400 seconds", hi: "400 seconds" },
      ],
      answer: 1,
      explain: {
        en: "Convert bytes to bits first: 500 MB × 8 = 4,000 megabits. Then 4,000 ÷ 100 Mbps = 40 seconds. The tempting 5 seconds comes from forgetting that the speed is in bits and the file size in bytes.",
        hi: "Pehle bytes ko bits mein badlo: 500 MB × 8 = 4,000 megabits. Phir 4,000 ÷ 100 Mbps = 40 seconds. 5 seconds wala jawab tab aata hai jab bhool jaate ho ki speed bits mein hai aur file size bytes mein.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "Your ping to a game server in the USA is about 230 ms. You upgrade your plan from 100 Mbps to 1 Gbps. What happens to the ping?",
        hi: "USA ke game server tak tumhara ping lagbhag 230 ms hai. Tum plan 100 Mbps se 1 Gbps kar dete ho. Ping ka kya hoga?",
      },
      options: [
        { en: "It falls to about 23 ms, ten times lower", hi: "Das guna kam hokar lagbhag 23 ms ho jaayega" },
        { en: "It rises, because a faster link needs more checking", hi: "Badh jaayega, kyunki fast link ko zyada checking chahiye" },
        { en: "It stays about the same, because latency depends mostly on distance and the devices on the path", hi: "Lagbhag utna hi rahega, kyunki latency zyada tar doori aur raaste ke devices par depend karti hai" },
        { en: "It drops below 1 ms, because 1 Gbps plans use fiber", hi: "1 ms se neeche aa jaayega, kyunki 1 Gbps plans fiber use karte hain" },
      ],
      answer: 2,
      explain: {
        en: "More bandwidth lets more data flow per second, but each packet still has to cross the same thousands of kilometres and the same routers. Light in fiber alone needs roughly 5 ms per 1,000 km each way.",
        hi: "Zyada bandwidth se har second zyada data jaata hai, lekin har packet ko phir bhi wahi hazaaron kilometre aur wahi routers paar karne hain. Sirf fiber mein light ko hi har 1,000 km ke liye ek taraf lagbhag 5 ms lagte hain.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Your laptop is 192.168.1.10 and your home router is 192.168.1.1. You open a website hosted at 198.51.100.10. Which device does the laptop hand the request to so it can leave your home?",
        hi: "Tumhara laptop 192.168.1.10 hai aur home router 192.168.1.1. Tum 198.51.100.10 par hosted website kholte ho. Ghar se bahar bhejne ke liye laptop request kis device ko deta hai?",
      },
      options: [
        { en: "The printer at 192.168.1.20", hi: "Printer, 192.168.1.20" },
        { en: "The web server at 198.51.100.10, directly", hi: "Seedha web server, 198.51.100.10" },
        { en: "The ISP's router, skipping the home router", hi: "Home router ko chhod kar ISP ka router" },
        { en: "Its default gateway, 192.168.1.1", hi: "Apna default gateway, 192.168.1.1" },
      ],
      answer: 3,
      explain: {
        en: "198.51.100.10 is outside the laptop's 192.168.1.x network, so the laptop gives the request to its default gateway. Only the router is connected to the ISP; the laptop cannot reach the server or the ISP any other way.",
        hi: "198.51.100.10 laptop ke 192.168.1.x network ke bahar hai, isliye laptop request apne default gateway ko deta hai. ISP se sirf router juda hai; laptop server ya ISP tak kisi aur tarike se nahi pahunch sakta.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "S7MNX_UD7vY",
      title: "FREE CCNA // What is a Network? // Day 0",
      channel: "NetworkChuck",
      lang: "en",
      note: { en: "A lively beginner tour of what a network is, using a home network as the example.", hi: "Beginners ke liye network kya hai, ghar ke network ke example se, mazedaar andaaz mein." },
    },
    {
      id: "2-GdudSfq98",
      title: "1. Free CCNA (NEW) | Introduction to Networking in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi introduction to networking basics, the first video of the course.", hi: "Networking basics ka Hindi introduction, course ka pehla video." },
    },
    {
      id: "6sNHnTsx2R0",
      title: "2. What is a Computer Network | CCNA 200-301 (Hindi) Course",
      channel: "NetworkPath",
      lang: "hi",
      note: { en: "Hindi explanation of what a computer network is and why we build one.", hi: "Computer network kya hai aur kyun banate hain, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Map your own home network", hi: "Apne ghar ka network map karo" },
    steps: [
      {
        en: "On a Windows laptop, open Command Prompt and run `ipconfig`. Under your Wi-Fi adapter, note the **IPv4 Address** and the **Default Gateway**. (On macOS: System Settings, Wi-Fi, Details, TCP/IP.)",
        hi: "Windows laptop par Command Prompt kholo aur `ipconfig` chalao. Wi-Fi adapter ke neeche **IPv4 Address** aur **Default Gateway** note karo. (macOS par: System Settings, Wi-Fi, Details, TCP/IP.)",
      },
      {
        en: "Run `ping` followed by your gateway address, for example `ping 192.168.1.1`. Note the times: this is LAN latency.",
        hi: "`ping` ke baad apna gateway address likh kar chalao, jaise `ping 192.168.1.1`. Times note karo: yeh LAN latency hai.",
      },
      {
        en: "Run `ping 8.8.8.8` (a public DNS server run by Google) and compare the times with the previous step. This trip leaves your home through the router and the ISP.",
        hi: "`ping 8.8.8.8` chalao (Google ka public DNS server) aur times ko pichhle step se compare karo. Yeh trip router aur ISP ke through ghar se bahar jaati hai.",
      },
      {
        en: "Run `tracert 8.8.8.8` (`traceroute 8.8.8.8` on macOS or Linux). Hop 1 should be your gateway; the next hops belong to your ISP. A hop showing `*` just did not answer, which is normal.",
        hi: "`tracert 8.8.8.8` chalao (macOS ya Linux par `traceroute 8.8.8.8`). Hop 1 tumhara gateway hona chahiye; uske baad ke hops ISP ke hain. Kisi hop par `*` dikhe toh usne bas jawab nahi diya, yeh normal hai.",
      },
      {
        en: "Type the gateway address into a browser to open the router's admin page (the login is often on a sticker on the box). Find the list of connected devices and label each one as a client, a server or both. Look only; do not change settings.",
        hi: "Browser mein gateway address type karke router ka admin page kholo (login aksar box ke sticker par hota hai). Connected devices ki list dhoondho aur har device ke aage likho: client, server ya dono. Sirf dekho; koi setting mat badlo.",
      },
    ],
  },
};

export default lesson;
