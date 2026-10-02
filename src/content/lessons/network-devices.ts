import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "network-devices",
  intro: {
    en: "Open any network diagram and you will see the same few kinds of box. Each one answers a different question about the traffic passing through it: a switch asks which port leads to this MAC address, a router asks which path leads to this IP network, and a firewall asks whether this traffic is allowed at all. Once you know which box makes which decision, you can predict where a packet goes, and where to look when it does not arrive.",
    hi: "Koi bhi network diagram kholo, wahi kuch tarah ke boxes dikhenge. Har box apne through jaane wale traffic ke baare mein alag sawaal poochta hai: switch poochta hai ki yeh MAC address kis port par hai, router poochta hai ki is IP network tak kaunsa raasta jaata hai, aur firewall poochta hai ki yeh traffic allowed bhi hai ya nahi. Kaunsa box kaunsa decision leta hai, yeh samajh gaye toh predict kar paoge ki packet kahan jaayega, aur na pahunche toh kahan dekhna hai.",
  },
  outcomes: [
    { en: "Describe what routers, Layer 2 switches and Layer 3 switches do, and what each one looks at to forward traffic", hi: "Router, Layer 2 switch aur Layer 3 switch kya karte hain, aur traffic forward karne ke liye har ek kya dekhta hai, yeh describe kar sako" },
    { en: "Explain how a stateful firewall, a next-generation firewall and an IPS protect a network", hi: "Samjha sako ki stateful firewall, next-generation firewall aur IPS network ko kaise protect karte hain" },
    { en: "Explain the roles of access points, wireless LAN controllers and Cisco Catalyst Center", hi: "Access points, wireless LAN controllers aur Cisco Catalyst Center ka role samjha sako" },
    { en: "Tell endpoints from servers and say where each sits in a network", hi: "Endpoints aur servers ka farak bata sako aur yeh bhi ki network mein kaun kahan baithta hai" },
    { en: "Explain PoE and check whether a switch's power budget covers its devices", hi: "PoE samjha sako aur check kar sako ki switch ka power budget uske devices ke liye kaafi hai ya nahi" },
  ],
  sections: [
    {
      id: "endpoints-and-servers",
      heading: { en: "Endpoints and servers: where traffic starts and ends", hi: "Endpoints aur servers: traffic kahan shuru aur khatam hota hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "This lesson follows one small office, the one in the animation. Staff use PC1, an IP phone and laptops on Wi-Fi. Their traffic passes through switches, a firewall and a router to reach a file server in the back room and websites on the internet.",
            hi: "Yeh lesson ek chhote office ko follow karta hai, wahi jo animation mein hai. Staff PC1, ek IP phone aur Wi-Fi par laptops use karta hai. Unka traffic switches, ek firewall aur ek router se hokar peeche wale room ke file server tak aur internet ki websites tak pahunchta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Endpoints** are the devices at the edge of the network, the ones people use or that do a job on their own: PCs, laptops, smartphones, IP phones, printers, security cameras and IoT sensors. Traffic starts and ends at endpoints. An endpoint does not forward other devices' traffic; that is the job of the network devices in the rest of this lesson.",
            hi: "**Endpoints** network ke kinaare wale devices hain, jinhe log use karte hain ya jo khud apna kaam karte hain: PCs, laptops, smartphones, IP phones, printers, security cameras aur IoT sensors. Traffic endpoints par shuru aur khatam hota hai. Endpoint doosre devices ka traffic forward nahi karta; woh kaam is lesson ke baaki network devices ka hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Servers** are hosts that provide services to clients: files, websites, email, and the network's own services such as DHCP (hands out addresses) and DNS (turns names into addresses). A server can be a physical machine in a rack, a virtual machine sharing hardware with others (lesson 1.15), or a service running in the cloud.",
            hi: "**Servers** woh hosts hain jo clients ko services dete hain: files, websites, email, aur network ki apni services jaise DHCP (addresses deta hai) aur DNS (naam ko address mein badalta hai). Server rack mein laga physical machine ho sakta hai, doosron ke saath hardware share karne wala virtual machine (lesson 1.15), ya cloud mein chalne wali service.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "CCNA exam topic 1.1", hi: "CCNA exam topic 1.1" },
          text: {
            en: "The blueprint lists: routers, Layer 2 and Layer 3 switches, next-generation firewalls and IPS, access points, controllers (such as a WLC or Catalyst Center), endpoints, servers and PoE. Expect questions that describe what a device does and ask you to name it.",
            hi: "Blueprint mein yeh list hai: routers, Layer 2 aur Layer 3 switches, next-generation firewalls aur IPS, access points, controllers (jaise WLC ya Catalyst Center), endpoints, servers aur PoE. Aise questions expect karo jo device ka kaam batayein aur uska naam poochein.",
          },
        },
      ],
    },
    {
      id: "switches",
      heading: { en: "Switches: moving frames inside a LAN", hi: "Switches: LAN ke andar frames pahunchaana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **Layer 2 switch** connects endpoints in the same LAN. It has many Ethernet ports (24 or 48 is common) and forwards **frames** using the **destination MAC address**: the hardware address built into every network interface, written like `0050.56aa.0011`. It learns which MAC lives on which port by reading the source address of each frame it receives, then sends each frame only out of the port where the destination lives.",
            hi: "**Layer 2 switch** same LAN ke endpoints ko jodta hai. Isme bahut saare Ethernet ports hote hain (24 ya 48 common hain) aur yeh **frames** ko **destination MAC address** dekh kar forward karta hai. MAC address har network interface mein built-in hardware address hai, jo `0050.56aa.0011` jaisa likha jaata hai. Switch har aane wale frame ka source address padh kar seekhta hai ki kaunsa MAC kis port par hai, phir har frame sirf usi port se bhejta hai jahan destination hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Layer 2 and Layer 3 refer to layers of the networking models in lessons 0.4 and 0.5. For now: Layer 2 means MAC addresses and delivery inside one LAN; Layer 3 means IP addresses and delivery between networks.",
            hi: "Layer 2 aur Layer 3 networking models ki layers hain, jo lesson 0.4 aur 0.5 mein aayengi. Abhi ke liye itna samjho: Layer 2 matlab MAC addresses aur ek LAN ke andar delivery; Layer 3 matlab IP addresses aur networks ke beech delivery.",
          },
        },
        {
          type: "p",
          text: {
            en: "A **Layer 3 switch** (also called a multilayer switch) does everything a Layer 2 switch does, and can also route packets between subnets using IP addresses, in hardware at full port speed. In the office, L3-SW1 joins the users' subnet (`10.1.10.0/24`), the phones' subnet (`10.1.20.0/24`) and the servers' subnet (`10.1.30.0/24`), and routes between them.",
            hi: "**Layer 3 switch** (ise multilayer switch bhi kehte hain) Layer 2 switch ka sab kaam karta hai, aur saath mein IP addresses dekh kar subnets ke beech packets route bhi kar sakta hai, hardware mein aur full port speed par. Office mein L3-SW1 users ke subnet (`10.1.10.0/24`), phones ke subnet (`10.1.20.0/24`) aur servers ke subnet (`10.1.30.0/24`) ko jodta hai aur inke beech routing karta hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Hubs are history", hi: "Hubs ab purani baat hain" },
          text: {
            en: "Before switches, LANs used **hubs**. A hub has no address table: it repeats every bit it receives out of every other port, so every device hears everything and only one device can send at a time. You will meet hubs only in old exam questions and old buildings.",
            hi: "Switches se pehle LANs mein **hubs** use hote the. Hub ke paas koi address table nahi hoti: jo bhi bit aata hai, use baaki har port se repeat kar deta hai. Isliye har device sab kuch sunta hai aur ek time par sirf ek device bhej sakta hai. Hubs ab sirf purane exam questions aur purani buildings mein milenge.",
          },
        },
      ],
    },
    {
      id: "routers",
      heading: { en: "Routers: connecting networks", hi: "Routers: networks ko jodna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **router** connects different networks and forwards **packets** between them using the **destination IP address**. For each packet it checks its **routing table**, a list of known networks and where to send traffic for each, and picks the best match. If nothing more specific matches, it uses its **default route**, which usually points to the ISP.",
            hi: "**Router** alag-alag networks ko jodta hai aur **destination IP address** dekh kar unke beech **packets** forward karta hai. Har packet ke liye woh apni **routing table** check karta hai, jo known networks ki list hai aur batati hai ki har network ka traffic kahan bhejna hai, aur best match chunta hai. Koi specific match na mile toh **default route** use karta hai, jo aam taur par ISP ki taraf point karta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "In the office, R1 sits at the edge: one side faces the office, the other faces the ISP. It is the office's way to the internet. Routers also bring WAN interfaces and services a switch usually lacks, such as NAT (lesson 4.3) and VPNs (lesson 5.9).",
            hi: "Office mein R1 edge par baitha hai: ek side office ki taraf hai, doosri ISP ki taraf. Office ka internet tak ka raasta yahi hai. Routers ke paas WAN interfaces aur aisi services bhi hoti hain jo switch mein aam taur par nahi hoti, jaise NAT (lesson 4.3) aur VPNs (lesson 5.9).",
          },
        },
        {
          type: "table",
          caption: { en: "Layer 3 switch or router?", hi: "Layer 3 switch ya router?" },
          columns: [
            "",
            { en: "Layer 3 switch", hi: "Layer 3 switch" },
            { en: "Router", hi: "Router" },
          ],
          rows: [
            [
              { en: "Main job", hi: "Main kaam" },
              { en: "Route between subnets inside a building or campus", hi: "Building ya campus ke andar subnets ke beech routing" },
              { en: "Connect a site to WANs and the internet", hi: "Site ko WAN aur internet se jodna" },
            ],
            [
              { en: "Ports", hi: "Ports" },
              { en: "Many Ethernet ports (24-48)", hi: "Bahut saare Ethernet ports (24-48)" },
              { en: "Fewer ports, with WAN options such as cellular or serial", hi: "Kam ports, lekin WAN options jaise cellular ya serial" },
            ],
            [
              { en: "Services", hi: "Services" },
              { en: "Fast routing; few WAN features", hi: "Fast routing; WAN features kam" },
              { en: "NAT, VPN and other WAN features", hi: "NAT, VPN aur doosre WAN features" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "A router forwards; it does not judge", hi: "Router forward karta hai, judge nahi karta" },
          text: {
            en: "By default a router forwards any packet it has a route for. It does not decide whether the traffic is wanted. Filtering needs an ACL on the router (lessons 5.4 and 5.5) or a firewall.",
            hi: "By default router har woh packet forward kar deta hai jiska route uske paas hai. Traffic chahiye ya nahi, yeh woh decide nahi karta. Filtering ke liye router par ACL (lesson 5.4 aur 5.5) ya firewall chahiye.",
          },
        },
      ],
    },
    {
      id: "firewalls-and-ips",
      heading: { en: "Firewalls and IPS: deciding what is allowed", hi: "Firewalls aur IPS: kya allowed hai, yeh decide karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **firewall** sits between zones of different trust, usually **inside** (the office) and **outside** (the internet), and permits or denies traffic by rules. Modern firewalls are **stateful**: they record each connection that starts inside and automatically allow the replies to it. Traffic from outside that matches no recorded connection and no rule is dropped.",
            hi: "**Firewall** alag-alag trust wale zones ke beech baithta hai, aam taur par **inside** (office) aur **outside** (internet), aur rules ke hisaab se traffic permit ya deny karta hai. Aaj ke firewalls **stateful** hote hain: andar se shuru hua har connection record karte hain aur uske replies ko apne aap allow kar dete hain. Bahar se aaya jo traffic na kisi recorded connection se match kare, na kisi rule se, woh drop ho jaata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "FW1's connection table after PC1 opens a website", hi: "PC1 ke website kholne ke baad FW1 ki connection table" },
          columns: ["Inside", "Outside", "App"],
          rows: [["10.1.10.11:51000", "198.51.100.10:443", "HTTPS"]],
        },
        {
          type: "p",
          text: {
            en: "When the web server replies from `198.51.100.10:443`, FW1 finds this entry and lets the reply in to `10.1.10.11:51000`. When an unknown internet host tries to open a connection to the office, there is no entry, so FW1 drops it. The last three steps of the animation show both cases. (On the way out, FW1 also swaps PC1's private address for its own public outside address, `203.0.113.2`, and swaps it back for the reply, just like the home router in lesson 0.1. That is NAT, lesson 4.3.)",
            hi: "Jab web server `198.51.100.10:443` se reply karta hai, FW1 ko yeh entry milti hai aur woh reply andar `10.1.10.11:51000` tak jaane deta hai. Jab internet ka koi anjaan host office mein connection kholne ki koshish karta hai, koi entry nahi milti, isliye FW1 use drop kar deta hai. Animation ke aakhri teen steps dono cases dikhate hain. (Bahar jaate waqt FW1 PC1 ka private address hata kar apna public outside address `203.0.113.2` laga deta hai, aur reply aane par wapas badal deta hai, bilkul lesson 0.1 ke home router ki tarah. Ise NAT kehte hain, lesson 4.3.)",
          },
        },
        {
          type: "p",
          text: {
            en: "A **next-generation firewall (NGFW)** is a stateful firewall that looks deeper. Beyond addresses and ports, it can identify the **application** (so it can allow Webex but block a file-sharing app even when both use port 443), tie traffic to a **user**, filter **URLs** by category, check files for **malware**, and it includes an **IPS**. Cisco's NGFW line is Cisco Secure Firewall (formerly Firepower).",
            hi: "**Next-generation firewall (NGFW)** ek stateful firewall hai jo aur gehraai se dekhta hai. Addresses aur ports ke alawa yeh **application** pehchaan sakta hai (isliye Webex allow karke file-sharing app block kar sakta hai, chahe dono port 443 use karein), traffic ko kisi **user** se jod sakta hai, **URLs** ko category ke hisaab se filter kar sakta hai, files mein **malware** check kar sakta hai, aur isme **IPS** built-in hota hai. Cisco ki NGFW line ka naam Cisco Secure Firewall hai (pehle Firepower).",
          },
        },
        {
          type: "p",
          text: {
            en: "An **IPS (intrusion prevention system)** compares traffic against **signatures** of known attacks and blocks matches in-line, as the traffic passes through. An **IDS (intrusion detection system)** analyses a copy of the traffic and only raises alerts. A next-generation IPS adds context, such as which applications and operating systems run on your network, to focus on the threats that actually matter to you.",
            hi: "**IPS (intrusion prevention system)** traffic ko known attacks ke **signatures** se compare karta hai aur match hone par use wahin in-line block kar deta hai, jab traffic uske through guzar raha hota hai. **IDS (intrusion detection system)** traffic ki ek copy analyse karta hai aur sirf alert deta hai. Next-generation IPS context bhi jodta hai, jaise tumhare network par kaunsi applications aur operating systems chal rahe hain, taaki un threats par focus kare jo sach mein tumhare liye matter karte hain.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Where versus whether", hi: "Kahan jaana hai vs. jaana hai ya nahi" },
          text: {
            en: "Router: decides **where** a packet goes, by destination IP. Firewall: decides **whether** it may pass, by rules and connection state. NGFW: also decides by application, user and content. IPS: blocks traffic that matches attack signatures.",
            hi: "Router decide karta hai packet **kahan** jaayega, destination IP dekh kar. Firewall decide karta hai packet **jaa sakta hai ya nahi**, rules aur connection state dekh kar. NGFW application, user aur content dekh kar bhi decide karta hai. IPS woh traffic block karta hai jo attack signatures se match kare.",
          },
        },
      ],
    },
    {
      id: "aps-and-controllers",
      heading: { en: "Access points and controllers", hi: "Access points aur controllers" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An **access point (AP)** lets Wi-Fi devices join the wired network. It talks to clients over radio using the 802.11 standards and connects to a switch port with an Ethernet cable, moving frames between the air and the cable. One AP can serve many clients on one or more **SSIDs** (Wi-Fi network names).",
            hi: "**Access point (AP)** Wi-Fi devices ko wired network se jodta hai. Yeh clients se radio par 802.11 standards use karke baat karta hai aur Ethernet cable se switch port se juda hota hai, aur frames ko hawa aur cable ke beech aage-peeche karta hai. Ek AP ek ya zyada **SSIDs** (Wi-Fi network ke naam) par kai clients ko serve kar sakta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "At home one AP works alone. An office with 50 APs cannot be configured one AP at a time, so it uses **lightweight APs** managed by a **wireless LAN controller (WLC)**. Each AP joins the WLC over a CAPWAP tunnel; the WLC pushes the SSIDs, security settings, channels and power levels, and helps clients roam as they walk from one AP to the next. Lesson 2.8 covers AP modes and how client traffic flows.",
            hi: "Ghar mein ek AP akela kaam karta hai. Jis office mein 50 APs hain, wahan ek-ek AP configure karna practical nahi, isliye wahan **lightweight APs** hote hain jinhe **wireless LAN controller (WLC)** manage karta hai. Har AP CAPWAP tunnel se WLC se judta hai; WLC SSIDs, security settings, channels aur power levels push karta hai, aur jab user ek AP se doosre AP ki taraf chalta hai toh roaming mein madad karta hai. AP modes aur client traffic ka flow lesson 2.8 mein hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Cisco Catalyst Center** (formerly DNA Center) is a controller for the whole enterprise network, not only wireless. It configures switches, routers and WLCs from central policies and watches their health, which Cisco calls **assurance**. It is Cisco's controller for campus networks; lesson 6.2 covers controller-based networking.",
            hi: "**Cisco Catalyst Center** (pehle DNA Center) poore enterprise network ka controller hai, sirf wireless ka nahi. Yeh central policies se switches, routers aur WLCs ko configure karta hai aur unki health par nazar rakhta hai, jise Cisco **assurance** kehta hai. Yeh campus networks ke liye Cisco ka controller hai; controller-based networking lesson 6.2 mein hai.",
          },
        },
      ],
    },
    {
      id: "poe",
      heading: { en: "Power over Ethernet (PoE)", hi: "Power over Ethernet (PoE)" },
      blocks: [
        {
          type: "p",
          text: {
            en: "IP phones, APs and cameras often sit where there is no power socket: on a ceiling, on a pole, on a desk far from the wall. **Power over Ethernet** sends electrical power over the same cable that carries the data. The switch is the **PSE** (power sourcing equipment); the phone, AP or camera is the **PD** (powered device).",
            hi: "IP phones, APs aur cameras aksar aisi jagah lagte hain jahan power socket nahi hota: ceiling par, pole par, ya deewar se door kisi desk par. **Power over Ethernet** usi cable se electrical power bhejta hai jisse data jaata hai. Switch **PSE** (power sourcing equipment) hai; phone, AP ya camera **PD** (powered device) hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "The switch does not power a port blindly. It first checks the device for a PoE signature, and only a PD gets power, so plugging a normal PC into a PoE port is safe. The device's power class, or a CDP or LLDP exchange, tells the switch how much power to reserve.",
            hi: "Switch kisi port ko aankh band karke power nahi deta. Pehle woh device mein PoE signature check karta hai, aur power sirf PD ko milti hai, isliye normal PC ko PoE port mein lagana safe hai. Device ki power class, ya CDP ya LLDP exchange, switch ko batata hai ki kitni power reserve karni hai.",
          },
        },
        {
          type: "table",
          caption: { en: "PoE standards (maximum power per port, at the switch)", hi: "PoE standards (har port ki maximum power, switch par)" },
          columns: ["Standard", { en: "Common name", hi: "Common naam" }, { en: "Max per port", hi: "Har port max" }],
          rows: [
            ["802.3af", "PoE", "15.4 W"],
            ["802.3at", "PoE+", "30 W"],
            ["802.3bt Type 3", "PoE++", "60 W"],
            ["802.3bt Type 4", "PoE++", "90 W"],
          ],
        },
        {
          type: "p",
          text: {
            en: "802.3af and 802.3at send power over two of the cable's four wire pairs; 802.3bt uses all four pairs to reach 60 W or 90 W. Cisco's own four-pair versions are called **UPOE** (60 W) and **UPOE+** (90 W). The figures are what the switch sends; the device receives a little less because the cable loses some power as heat.",
            hi: "802.3af aur 802.3at cable ke chaar wire pairs mein se do pairs par power bhejte hain; 802.3bt chaaron pairs use karke 60 W ya 90 W tak jaata hai. Cisco ke apne four-pair versions ko **UPOE** (60 W) aur **UPOE+** (90 W) kehte hain. Yeh numbers switch ki taraf se bheji gayi power hain; device ko thodi kam milti hai, kyunki cable mein kuch power heat ban kar nikal jaati hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Every PoE switch also has a **power budget**: the total watts it can supply across all ports. SW1 has 370 W. It reserves 7 W for Phone1 and 30 W for AP1, so 37 W is used and 333 W is left. Eleven more APs at 30 W each need 330 W, which fits. A twelfth would push the total to 397 W, so SW1 would refuse to power it.",
            hi: "Har PoE switch ka ek **power budget** bhi hota hai: saare ports ko milakar woh total kitne watts de sakta hai. SW1 ka budget 370 W hai. Woh Phone1 ke liye 7 W aur AP1 ke liye 30 W reserve karta hai, yaani 37 W used aur 333 W bache. 30 W wale gyarah aur APs ko 330 W chahiye, jo fit ho jaata hai. Barahwan AP total ko 397 W tak le jaayega, isliye SW1 use power dene se mana kar dega.",
          },
        },
        {
          type: "cli",
          title: { en: "PoE on SW1", hi: "SW1 par PoE" },
          lines: [
            { prompt: "SW1#", cmd: "show power inline" },
            { out: "Module   Available     Used     Remaining" },
            { out: "          (Watts)     (Watts)    (Watts)" },
            { out: "------   ---------   --------   ---------" },
            { out: "1           370.0       37.0       333.0", comment: { en: "The budget: 370 W total, 37 W used", hi: "Budget: total 370 W, 37 W used" } },
            { out: "Interface Admin  Oper       Power   Device              Class Max" },
            { out: "                            (Watts)" },
            { out: "--------- ------ ---------- ------- ------------------- ----- ----" },
            { out: "Gi1/0/1   auto   off        0.0     n/a                 n/a   30.0", comment: { en: "PC1: no PoE signature, so no power", hi: "PC1: PoE signature nahi, isliye power nahi" } },
            { out: "Gi1/0/2   auto   on         7.0     Ieee PD             2     30.0", comment: { en: "Phone1: class 2 device, 7 W", hi: "Phone1 class 2 device hai, use 7 W milte hain" } },
            { out: "Gi1/0/3   auto   on         30.0    Ieee PD             4     30.0", comment: { en: "AP1: class 4 (PoE+) device, 30 W", hi: "AP1 class 4 (PoE+) device hai, use 30 W milte hain" } },
          ],
          note: {
            en: "You will learn the Cisco CLI in lesson 0.8. For now, read the columns: which ports are powered, how much each gets, and how much of the budget is left.",
            hi: "Cisco CLI tum lesson 0.8 mein seekhoge. Abhi sirf columns padho: kaunse ports ko power mil rahi hai, har ek ko kitni, aur budget mein kitna bacha hai.",
          },
        },
      ],
    },
    {
      id: "who-decides-what",
      heading: { en: "Who decides what: the summary", hi: "Kaun kya decide karta hai: summary" },
      blocks: [
        {
          type: "p",
          text: {
            en: "When you look at any topology, ask of each box: what does it look at, and what does it decide? This table is the answer for every device in CCNA topic 1.1.",
            hi: "Koi bhi topology dekho, toh har box se poocho: yeh kya dekhta hai, aur kya decide karta hai? CCNA topic 1.1 ke har device ka jawab is table mein hai.",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Device", hi: "Device" },
            { en: "Looks at", hi: "Kya dekhta hai" },
            { en: "Decides", hi: "Kya decide karta hai" },
          ],
          rows: [
            [
              { en: "Hub (legacy)", hi: "Hub (purana)" },
              { en: "Nothing; it only repeats bits", hi: "Kuch nahi; sirf bits repeat karta hai" },
              { en: "Nothing; sends everything out of every port", hi: "Kuch nahi; sab kuch har port se bhej deta hai" },
            ],
            [
              { en: "Layer 2 switch", hi: "Layer 2 switch" },
              { en: "Destination MAC address", hi: "Destination MAC address" },
              { en: "Which port, inside one LAN", hi: "Kaunsa port, ek LAN ke andar" },
            ],
            [
              { en: "Layer 3 switch", hi: "Layer 3 switch" },
              { en: "Destination MAC; destination IP between subnets", hi: "Destination MAC; subnets ke beech destination IP" },
              { en: "Which port, or which subnet to route to", hi: "Kaunsa port, ya kis subnet mein route karna hai" },
            ],
            [
              { en: "Router", hi: "Router" },
              { en: "Destination IP address", hi: "Destination IP address" },
              { en: "Which next hop, between networks", hi: "Networks ke beech kaunsa next hop" },
            ],
            [
              { en: "Firewall / NGFW", hi: "Firewall / NGFW" },
              { en: "Addresses, ports, connection state; NGFW also app, user, content", hi: "Addresses, ports, connection state; NGFW app, user aur content bhi" },
              { en: "Permit or drop", hi: "Permit ya drop" },
            ],
            [
              { en: "IPS", hi: "IPS" },
              { en: "Packet contents against attack signatures", hi: "Packet ka content, attack signatures ke against" },
              { en: "Pass or block", hi: "Pass ya block" },
            ],
            [
              { en: "Access point", hi: "Access point" },
              { en: "802.11 frames from wireless clients", hi: "Wireless clients ke 802.11 frames" },
              { en: "Moves them between the air and the wired LAN", hi: "Unhe hawa aur wired LAN ke beech le jaata hai" },
            ],
            [
              { en: "WLC / Catalyst Center", hi: "WLC / Catalyst Center" },
              { en: "Policies and the state of the devices it manages", hi: "Policies aur jin devices ko manage karta hai unki state" },
              { en: "How APs (or the whole network) are configured", hi: "APs (ya poora network) kaise configure honge" },
            ],
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Endpoint", def: { en: "A device at the edge where traffic starts or ends, such as a PC, phone, printer or camera.", hi: "Network ke kinaare ka device jahan traffic shuru ya khatam hota hai, jaise PC, phone, printer ya camera." } },
    { term: "Layer 3 switch", def: { en: "A switch that also routes between subnets by IP address, in hardware.", hi: "Aisa switch jo IP address dekh kar subnets ke beech routing bhi karta hai, hardware mein." } },
    { term: "Router", def: { en: "A device that forwards packets between networks based on the destination IP address and its routing table.", hi: "Woh device jo destination IP address aur apni routing table dekh kar networks ke beech packets forward karta hai." } },
    { term: "Stateful firewall", def: { en: "A firewall that tracks connections started inside and allows only their return traffic back in, unless a rule permits more.", hi: "Aisa firewall jo andar se shuru hue connections track karta hai aur sirf unka return traffic andar aane deta hai, jab tak koi rule aur kuch allow na kare." } },
    { term: "NGFW", def: { en: "Next-generation firewall: a stateful firewall that also filters by application, user, URL and content, with a built-in IPS.", hi: "Next-generation firewall: stateful firewall jo application, user, URL aur content ke hisaab se bhi filter karta hai, aur isme IPS built-in hota hai." } },
    { term: "IPS", def: { en: "Intrusion prevention system: sits in the traffic path and blocks traffic that matches known attack signatures.", hi: "Intrusion prevention system: traffic ke raaste mein baithta hai aur known attack signatures se match hone wala traffic block karta hai." } },
    { term: "WLC", def: { en: "Wireless LAN controller: centrally configures and manages lightweight access points.", hi: "Wireless LAN controller: lightweight access points ko ek jagah se configure aur manage karta hai." } },
    { term: "PoE", def: { en: "Power over Ethernet: a switch (PSE) supplies power to a device (PD) over the data cable, within the switch's power budget.", hi: "Power over Ethernet: switch (PSE) data cable se hi device (PD) ko power deta hai, apne power budget ke andar." } },
  ],
  commands: [
    { cmd: "show power inline", mode: "Cisco privileged EXEC", does: { en: "Show the PoE budget and the power given to each port", hi: "PoE budget aur har port ko di gayi power dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Thinking a Layer 2 switch can move traffic between subnets. It forwards frames inside one LAN; between subnets you need a router or a Layer 3 switch.",
      hi: "Yeh sochna ki Layer 2 switch subnets ke beech traffic le ja sakta hai. Woh sirf ek LAN ke andar frames forward karta hai; subnets ke beech router ya Layer 3 switch chahiye.",
    },
    {
      en: "Assuming a router blocks unwanted traffic. It forwards anything it has a route for; filtering needs ACLs or a firewall.",
      hi: "Yeh maan lena ki router unwanted traffic block karta hai. Jiska route hai, woh sab forward karta hai; filtering ke liye ACLs ya firewall chahiye.",
    },
    {
      en: "Confusing IDS and IPS. An IDS analyses a copy of the traffic and alerts; an IPS sits in-line and can drop the attack.",
      hi: "IDS aur IPS ko mix karna. IDS traffic ki copy analyse karke alert deta hai; IPS in-line baithta hai aur attack ko drop kar sakta hai.",
    },
    {
      en: "Treating NGFW as a new name for a stateful firewall. An NGFW adds application awareness, user identity, URL filtering, malware checks and an integrated IPS.",
      hi: "NGFW ko stateful firewall ka naya naam samajhna. NGFW application awareness, user identity, URL filtering, malware checks aur integrated IPS jodta hai.",
    },
    {
      en: "Assuming a PoE switch can give every port full power. The total budget runs out first: a 24-port switch with a 370 W budget cannot give all 24 ports 30 W (720 W).",
      hi: "Yeh maan lena ki PoE switch har port ko full power de sakta hai. Total budget pehle khatam ho jaata hai: 370 W budget wala 24-port switch saare 24 ports ko 30 W (720 W) nahi de sakta.",
    },
    {
      en: "Mixing up the AP and the WLC. The AP carries the clients' radio traffic; the WLC manages the APs (settings, channels, power, roaming).",
      hi: "AP aur WLC ko mix karna. AP clients ka radio traffic sambhalta hai; WLC APs ko manage karta hai (settings, channels, power, roaming).",
    },
  ],
  recap: [
    { en: "Endpoints start and end traffic; servers provide services; network devices move traffic between them.", hi: "Endpoints par traffic shuru aur khatam hota hai; servers services dete hain; network devices beech mein traffic le jaate hain." },
    { en: "Layer 2 switch: destination MAC, inside a LAN. Layer 3 switch: also routes between subnets. Router: destination IP, between networks and out to the WAN.", hi: "Layer 2 switch: destination MAC, LAN ke andar. Layer 3 switch: subnets ke beech routing bhi. Router: destination IP, networks ke beech aur WAN ki taraf." },
    { en: "A stateful firewall allows replies to inside-initiated connections and drops unsolicited inbound traffic. An NGFW adds app, user and content awareness; an IPS blocks known attacks in-line.", hi: "Stateful firewall andar se shuru hue connections ke replies allow karta hai aur bina maange aaya inbound traffic drop karta hai. NGFW app, user aur content awareness jodta hai; IPS known attacks ko in-line block karta hai." },
    { en: "Lightweight APs are managed by a WLC over CAPWAP; Catalyst Center configures and monitors the whole network.", hi: "Lightweight APs ko WLC CAPWAP ke through manage karta hai; Catalyst Center poore network ko configure aur monitor karta hai." },
    { en: "PoE: 15.4 W (802.3af), 30 W (802.3at), 60 W and 90 W (802.3bt), all limited by the switch's total power budget.", hi: "PoE: 15.4 W (802.3af), 30 W (802.3at), 60 W aur 90 W (802.3bt), sab switch ke total power budget se limited." },
  ],
  quiz: [
    {
      q: {
        en: "Which pairing of a device and the information it uses to forward traffic is correct?",
        hi: "Device aur traffic forward karne ke liye woh jo information use karta hai, inme se kaunsi jodi sahi hai?",
      },
      options: [
        { en: "Layer 2 switch: destination IP address", hi: "Layer 2 switch: destination IP address" },
        { en: "Hub: destination MAC address", hi: "Hub: destination MAC address" },
        { en: "Router: destination IP address", hi: "Router: destination IP address" },
        { en: "Access point: routing table", hi: "Access point: routing table" },
      ],
      answer: 2,
      explain: {
        en: "A router looks up the destination IP in its routing table. A Layer 2 switch uses the destination MAC, a hub looks at no address at all, and an AP moves frames between radio and cable without a routing table.",
        hi: "Router destination IP ko apni routing table mein dhoondhta hai. Layer 2 switch destination MAC use karta hai, hub koi address dekhta hi nahi, aur AP bina routing table ke frames ko radio aur cable ke beech le jaata hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An office has users in 10.1.10.0/24 and servers in 10.1.30.0/24 in the same building. It needs 48 Ethernet ports and fast routing between the two subnets. Which device fits best?",
        hi: "Ek office mein users 10.1.10.0/24 mein hain aur servers 10.1.30.0/24 mein, dono same building mein. Use 48 Ethernet ports chahiye aur dono subnets ke beech fast routing. Kaunsa device sabse sahi hai?",
      },
      options: [
        { en: "A Layer 3 switch", hi: "Layer 3 switch" },
        { en: "A Layer 2 switch", hi: "Layer 2 switch" },
        { en: "A hub", hi: "Hub" },
        { en: "A wireless LAN controller", hi: "Wireless LAN controller" },
      ],
      answer: 0,
      explain: {
        en: "A Layer 3 switch has many Ethernet ports and routes between subnets in hardware. A Layer 2 switch cannot route between subnets, a hub cannot even switch, and a WLC manages APs.",
        hi: "Layer 3 switch mein bahut saare Ethernet ports hote hain aur woh hardware mein subnets ke beech routing karta hai. Layer 2 switch subnets ke beech route nahi kar sakta, hub toh switching bhi nahi karta, aur WLC sirf APs manage karta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A host on the internet sends a connection attempt to the office. No inside host has a connection with it, and no rule allows it. What does the stateful firewall FW1 do?",
        hi: "Internet ka ek host office ki taraf connection attempt bhejta hai. Andar ke kisi host ka usse koi connection nahi hai, aur koi rule ise allow nahi karta. Stateful firewall FW1 kya karega?",
      },
      options: [
        { en: "Forwards it, because R1 has a route to the office", hi: "Forward karega, kyunki R1 ke paas office ka route hai" },
        { en: "Forwards it and writes a log entry", hi: "Forward karega aur log entry likhega" },
        { en: "Sends it to the WLC for a decision", hi: "Decision ke liye WLC ko bhejega" },
        { en: "Drops it", hi: "Drop kar dega" },
      ],
      answer: 3,
      explain: {
        en: "A stateful firewall allows inbound traffic only if it matches a connection started inside or a rule permits it. Neither is true, so it drops the packet. R1 having a route only means the packet reached FW1; routing is not permission.",
        hi: "Stateful firewall inbound traffic tabhi allow karta hai jab woh andar se shuru hue connection se match kare ya koi rule use permit kare. Yahan dono nahi hain, isliye packet drop hoga. R1 ke paas route hone ka matlab sirf itna hai ki packet FW1 tak pahuncha; route hona permission nahi hai.",
      },
      kind: "scenario",
    },
    {
      q: { en: "What is the key difference between an IPS and an IDS?", hi: "IPS aur IDS mein main farak kya hai?" },
      options: [
        { en: "An IPS works only on wireless traffic", hi: "IPS sirf wireless traffic par kaam karta hai" },
        { en: "An IPS sits in-line and can block attacks; an IDS analyses a copy of the traffic and alerts", hi: "IPS in-line baithta hai aur attacks block kar sakta hai; IDS traffic ki copy analyse karke alert deta hai" },
        { en: "An IDS blocks by application; an IPS blocks by port number", hi: "IDS application ke hisaab se block karta hai; IPS port number ke hisaab se" },
        { en: "An IDS is built into every Layer 2 switch", hi: "IDS har Layer 2 switch mein built-in hota hai" },
      ],
      answer: 1,
      explain: {
        en: "Prevention needs to be in the path: an IPS sees each packet before it is delivered and can drop it. An IDS watches a copy, so by the time it alerts, the original traffic has already been delivered.",
        hi: "Rokne ke liye raaste mein hona zaroori hai: IPS har packet ko deliver hone se pehle dekhta hai aur drop kar sakta hai. IDS copy dekhta hai, isliye jab tak woh alert deta hai, original traffic deliver ho chuka hota hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A PoE+ switch has a 370 W power budget. It powers 8 APs at 30 W each and 12 IP phones at 7 W each. How much budget is left?",
        hi: "Ek PoE+ switch ka power budget 370 W hai. Woh 8 APs ko 30 W each aur 12 IP phones ko 7 W each power deta hai. Budget mein kitna bacha?",
      },
      options: [
        { en: "324 W", hi: "324 W" },
        { en: "130 W", hi: "130 W" },
        { en: "46 W", hi: "46 W" },
        { en: "Nothing; the switch is over budget", hi: "Kuch nahi; switch budget se bahar hai" },
      ],
      answer: 2,
      explain: {
        en: "APs: 8 × 30 = 240 W. Phones: 12 × 7 = 84 W. Used: 240 + 84 = 324 W. Left: 370 − 324 = 46 W. The option 324 W is the amount used, not the amount left.",
        hi: "APs: 8 × 30 = 240 W. Phones: 12 × 7 = 84 W. Used: 240 + 84 = 324 W. Bacha: 370 − 324 = 46 W. 324 W wala option used power hai, bachi hui nahi.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "What does a wireless LAN controller (WLC) do in a network with lightweight APs?",
        hi: "Lightweight APs wale network mein wireless LAN controller (WLC) kya karta hai?",
      },
      options: [
        { en: "Supplies PoE to the APs", hi: "APs ko PoE deta hai" },
        { en: "Replaces the access switches the APs plug into", hi: "Jin access switches mein APs lagte hain, unki jagah le leta hai" },
        { en: "Gives each wireless client its MAC address", hi: "Har wireless client ko uska MAC address deta hai" },
        { en: "Centrally configures and manages the APs: SSIDs, security, channels and power", hi: "APs ko ek jagah se configure aur manage karta hai: SSIDs, security, channels aur power" },
      ],
      answer: 3,
      explain: {
        en: "Lightweight APs join the WLC and take their settings from it, so one change on the WLC reaches every AP. PoE comes from the switch, and MAC addresses are built into each client's own network interface.",
        hi: "Lightweight APs WLC se judte hain aur apni settings usi se lete hain, isliye WLC par ek change har AP tak pahunch jaata hai. PoE switch se aata hai, aur MAC address har client ke apne network interface mein built-in hota hai.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "H8W9oMNSuwo",
      title: "Free CCNA | Network Devices | Day 1",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Covers routers, switches, firewalls, endpoints and servers for exam topic 1.1.", hi: "Exam topic 1.1 ke routers, switches, firewalls, endpoints aur servers cover karta hai." },
    },
    {
      id: "MLxgmkRzgIQ",
      title: "why Power over Ethernet (PoE) is amazing!! // FREE CCNA // EP 12",
      channel: "NetworkChuck",
      lang: "en",
      note: { en: "A beginner-friendly look at PoE, PSE and PD, and power budgets.", hi: "PoE, PSE aur PD, aur power budgets ko beginner-friendly tarike se dikhata hai." },
    },
    {
      id: "cyLbcdvScvg",
      title: "3. Key Components of a Computer Network | CCNA 200-301 (Hindi) Course",
      channel: "NetworkPath",
      lang: "hi",
      note: { en: "Hindi overview of the main components of a network and what each one does.", hi: "Network ke main components aur har ek ka kaam, Hindi mein overview." },
    },
    {
      id: "QMm0u9PeAlU",
      title: "32. Free CCNA (NEW) | Network Devices in Hindi - What is a Firewall",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of what a firewall does and where it sits.", hi: "Firewall kya karta hai aur kahan lagta hai, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Meet the devices in Packet Tracer", hi: "Packet Tracer mein devices se milo" },
    steps: [
      {
        en: "In Cisco Packet Tracer, place a router (ISR4331), a multilayer switch (3650-24PS), two switches (2960-24TT and 3560-24PS), a PC, an IP phone (7960), a server and an access point. Rename them as in the animation: R1, L3-SW1 (the 3650), SW1 (the 3560-24PS), PC1, Phone1, SRV1 and AP1. The 2960-24TT is a spare switch without PoE.",
        hi: "Cisco Packet Tracer mein ek router (ISR4331), ek multilayer switch (3650-24PS), do switches (2960-24TT aur 3560-24PS), ek PC, ek IP phone (7960), ek server aur ek access point rakho. Naam animation jaise rakho: R1, L3-SW1 (3650), SW1 (3560-24PS), PC1, Phone1, SRV1 aur AP1. 2960-24TT ek extra switch hai jisme PoE nahi hai.",
      },
      {
        en: "The 3650-24PS starts with no power supply. Open its Physical tab, drag the AC power supply module into the empty slot, and watch it boot.",
        hi: "3650-24PS bina power supply ke aata hai. Iska Physical tab kholo, AC power supply module ko khaali slot mein drag karo, aur use boot hote dekho.",
      },
      {
        en: "Connect PC1 to the 2960-24TT with a copper straight-through cable. The link lights turn green; the switch end may stay orange for about 30 seconds while the port comes up.",
        hi: "PC1 ko 2960-24TT se copper straight-through cable se jodo. Link lights green ho jaayengi; switch wala end lagbhag 30 seconds tak orange reh sakta hai jab tak port up hota hai.",
      },
      {
        en: "Connect the IP phone to the 2960-24TT. It stays off, because that switch has no PoE. Move the cable to a port on the 3560-24PS (the P in the model name means PoE) and watch the phone power up with no adapter.",
        hi: "IP phone ko 2960-24TT se jodo. Phone off hi rahega, kyunki us switch mein PoE nahi hai. Cable ko 3560-24PS ke port mein lagao (model name mein P ka matlab PoE hai) aur dekho phone bina adapter ke on ho jaata hai.",
      },
      {
        en: "For each device, write one line: what it looks at (MAC, IP, rules, radio) and what it decides. Check your answers against the summary table in this lesson.",
        hi: "Har device ke liye ek line likho: woh kya dekhta hai (MAC, IP, rules, radio) aur kya decide karta hai. Apne answers is lesson ki summary table se match karo.",
      },
    ],
  },
};

export default lesson;
