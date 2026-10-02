import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "cables-and-interfaces",
  intro: {
    en: "Every frame from lesson 0.5 ends up as bits on a physical medium, and the medium sets hard limits: copper stops at 100 m, the wrong pinout can leave you with no link at all, and mismatched fiber optics never bring a link up. Many real outages turn out to be Layer 1 problems: a bad cable, a run that is too long, or the wrong transceiver. This lesson gives you the facts to choose the right cable, read an interface, and spot these faults.",
    hi: "Lesson 0.5 ka har frame aakhir mein kisi physical medium par bits ban kar jaata hai, aur medium ki apni hard limits hain: copper 100 m par ruk jaata hai, galat pinout se link aa hi nahi sakta, aur mismatched fiber optics se link kabhi up nahi hota. Kai asli outages aakhir mein Layer 1 problem nikalte hain: kharab cable, zaroorat se lamba run, ya galat transceiver. Is lesson ke baad tum sahi cable chun paoge, interface padh paoge, aur aise faults pakad paoge.",
  },
  outcomes: [
    { en: "Compare copper UTP, multimode fiber and single-mode fiber by reach, speed, cost and use", hi: "Copper UTP, multimode fiber aur single-mode fiber ko reach, speed, cost aur use ke hisaab se compare kar sako" },
    { en: "Choose a straight-through or crossover cable from the pinouts, and explain what Auto-MDIX changes", hi: "Pinouts dekh kar straight-through ya crossover cable chun sako, aur samjha sako ki Auto-MDIX kya badalta hai" },
    { en: "Decode Ethernet standard names such as 1000BASE-T, 1000BASE-SX and 10GBASE-LR", hi: "1000BASE-T, 1000BASE-SX aur 10GBASE-LR jaise Ethernet standard names decode kar sako" },
    { en: "Explain shared media versus point-to-point links, and half versus full duplex", hi: "Shared media vs point-to-point links, aur half vs full duplex samjha sako" },
    { en: "Read interface names and the Type column of `show interfaces status` on a Cisco switch", hi: "Cisco switch par interface names aur `show interfaces status` ka Type column padh sako" },
  ],
  sections: [
    {
      id: "layer-1",
      heading: { en: "Layer 1: what a link is made of", hi: "Layer 1: link kis cheez se bana hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A link is a medium plus an interface at each end. The interface turns bits into signals and back. There are three media: **copper** carries electrical signals, **fiber** carries light, and **wireless** carries radio waves (lesson 1.14). You choose between them on distance, speed, cost and how much electrical noise is around.",
            hi: "Link matlab ek medium aur dono ends par ek-ek interface. Interface bits ko signals mein aur wapas bits mein badalta hai. Medium teen hain: **copper** electrical signals le jaata hai, **fiber** light, aur **wireless** radio waves (lesson 1.14). Inme se chunna distance, speed, cost aur aas-paas ke electrical noise par depend karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The wired media at a glance", hi: "Wired media ek nazar mein" },
          columns: [{ en: "Medium", hi: "Medium" }, { en: "Signal", hi: "Signal" }, { en: "Typical reach", hi: "Typical reach" }, { en: "Where you see it", hi: "Kahan dikhta hai" }],
          rows: [
            [{ en: "Copper UTP", hi: "Copper UTP" }, { en: "Electrical", hi: "Electrical" }, "100 m", { en: "Desks, phones, access points", hi: "Desks, phones, access points" }],
            [{ en: "Multimode fiber", hi: "Multimode fiber" }, { en: "Light, usually 850 nm", hi: "Light, aam taur par 850 nm" }, { en: "Hundreds of metres", hi: "Kuch sau metre" }, { en: "Inside buildings, data centre racks", hi: "Buildings ke andar, data centre racks" }],
            [{ en: "Single-mode fiber", hi: "Single-mode fiber" }, { en: "Laser, 1310 or 1550 nm", hi: "Laser, 1310 ya 1550 nm" }, { en: "Kilometres", hi: "Kilometres" }, { en: "Between buildings, campuses and cities", hi: "Buildings, campuses aur shehron ke beech" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "CCNA topic 1.3", hi: "CCNA topic 1.3" },
          text: {
            en: "The exam asks you to compare single-mode fiber, multimode fiber and copper, and Ethernet shared media with point-to-point connections. Everything in this lesson maps to that topic.",
            hi: "Exam poochta hai ki single-mode fiber, multimode fiber aur copper ko compare karo, aur Ethernet shared media ko point-to-point connections se. Is lesson ki har cheez isi topic se judi hai.",
          },
        },
      ],
    },
    {
      id: "copper-utp",
      heading: { en: "Copper: UTP cable and its limits", hi: "Copper: UTP cable aur uski limits" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Almost every desk, phone and access point connects over **UTP (unshielded twisted pair)**: eight copper wires in four twisted pairs, ending in an **RJ-45** connector. The twist cancels electrical noise from outside (EMI) and from the neighbouring pairs (crosstalk). There is no metal shield, which keeps the cable cheap and flexible.",
            hi: "Lagbhag har desk, phone aur access point **UTP (unshielded twisted pair)** se judta hai: chaar twisted pairs mein aath copper wires, jo **RJ-45** connector par khatam hote hain. Twist bahar ke electrical noise (EMI) aur padosi pairs ke noise (crosstalk) ko cancel karta hai. Isme metal shield nahi hota, isliye cable sasta aur flexible rehta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Copper Ethernet has a hard limit of **100 metres** per link, from the switch port to the device, patch cords included. Past that the signal fades (attenuation) and errors climb. For a longer run, put a switch in between or use fiber.",
            hi: "Copper Ethernet ki hard limit hai **100 metre** per link, switch port se device tak, patch cords milakar. Usse aage signal kamzor ho jaata hai (attenuation) aur errors badh jaate hain. Lamba run chahiye toh beech mein switch lagao ya fiber use karo.",
          },
        },
        {
          type: "table",
          caption: { en: "UTP categories you will meet", hi: "UTP categories jo tumhe milengi" },
          columns: [{ en: "Category", hi: "Category" }, { en: "Rated to", hi: "Rated to" }, { en: "Ethernet it supports", hi: "Kaunsa Ethernet chalta hai" }],
          rows: [
            ["Cat5e", "100 MHz", { en: "1000BASE-T at 100 m", hi: "1000BASE-T, 100 m tak" }],
            ["Cat6", "250 MHz", { en: "1000BASE-T at 100 m; 10GBASE-T only up to 55 m", hi: "1000BASE-T 100 m tak; 10GBASE-T sirf 55 m tak" }],
            ["Cat6a", "500 MHz", { en: "10GBASE-T at 100 m", hi: "10GBASE-T, 100 m tak" }],
          ],
        },
        {
          type: "table",
          caption: { en: "Copper Ethernet standards (all up to 100 m on the right category)", hi: "Copper Ethernet standards (sahi category par sab 100 m tak)" },
          columns: ["Standard", { en: "Common name", hi: "Common naam" }, "IEEE", "Speed", { en: "Pairs used", hi: "Kitne pairs" }],
          rows: [
            ["10BASE-T", "Ethernet", "802.3i", "10 Mbps", "2"],
            ["100BASE-TX", "Fast Ethernet", "802.3u", "100 Mbps", "2"],
            ["1000BASE-T", "Gigabit Ethernet", "802.3ab", "1 Gbps", "4"],
            ["10GBASE-T", "10 Gigabit Ethernet", "802.3an", "10 Gbps", "4"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Reading the names", hi: "Names kaise padhein" },
          text: {
            en: "In `1000BASE-T`, 1000 is the speed in Mbps, BASE means baseband signalling, and T means twisted pair. For fiber, **S** means short-wavelength light for multimode fiber and **L** means long-wavelength light, normally on single-mode fiber: `1000BASE-SX`, `10GBASE-LR`.",
            hi: "`1000BASE-T` mein 1000 speed hai Mbps mein, BASE ka matlab baseband signalling, aur T ka matlab twisted pair. Fiber mein **S** ka matlab multimode fiber ke liye short-wavelength light, aur **L** ka matlab long-wavelength light, jo normally single-mode fiber par chalti hai: `1000BASE-SX`, `10GBASE-LR`.",
          },
        },
      ],
    },
    {
      id: "straight-vs-crossover",
      heading: { en: "Straight-through, crossover and Auto-MDIX", hi: "Straight-through, crossover aur Auto-MDIX" },
      blocks: [
        {
          type: "p",
          text: {
            en: "10BASE-T and 100BASE-TX use only two pairs: pins 1-2 and pins 3-6. Which pair a device transmits on depends on the type of device.",
            hi: "10BASE-T aur 100BASE-TX sirf do pairs use karte hain: pins 1-2 aur pins 3-6. Device kis pair par transmit karega, yeh device ke type par depend karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Who transmits on which pins (10/100 Mbps)", hi: "Kaun kis pin par transmit karta hai (10/100 Mbps)" },
          columns: [{ en: "Device", hi: "Device" }, { en: "Transmits on", hi: "Transmit karta hai" }, { en: "Receives on", hi: "Receive karta hai" }],
          rows: [
            [{ en: "PCs, routers, servers, access points, printers (MDI)", hi: "PCs, routers, servers, access points aur printers (MDI)" }, "1, 2", "3, 6"],
            [{ en: "Switches and hubs (MDI-X)", hi: "Switches aur hubs (MDI-X)" }, "3, 6", "1, 2"],
          ],
        },
        {
          type: "p",
          text: {
            en: "The cable has to connect each side's transmit pair to the other side's receive pair. A **straight-through** cable wires pin 1 to 1, 2 to 2, 3 to 3 and 6 to 6, which works between unlike devices. A **crossover** cable swaps the pairs (1 to 3, 2 to 6), which works between like devices.",
            hi: "Cable ko ek side ka transmit pair doosri side ke receive pair se jodna hai. **Straight-through** cable pin 1 ko 1 se, 2 ko 2 se, 3 ko 3 se aur 6 ko 6 se jodta hai, jo unlike devices ke beech kaam karta hai. **Crossover** cable pairs ko swap karta hai (1 se 3, 2 se 6), jo like devices ke beech kaam karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Which cable, without Auto-MDIX", hi: "Kaunsa cable, Auto-MDIX ke bina" },
          columns: [{ en: "Connection", hi: "Connection" }, { en: "Cable", hi: "Cable" }],
          rows: [
            [{ en: "PC to switch", hi: "PC se switch" }, "Straight-through"],
            [{ en: "Router to switch", hi: "Router se switch" }, "Straight-through"],
            [{ en: "Switch to switch", hi: "Switch se switch" }, "Crossover"],
            [{ en: "PC to router", hi: "PC se router" }, "Crossover"],
            [{ en: "Router to router, PC to PC", hi: "Router se router, PC se PC" }, "Crossover"],
          ],
        },
        {
          type: "p",
          text: {
            en: "**1000BASE-T** uses all four pairs (1-2, 3-6, 4-5 and 7-8), and every pair carries signals in both directions at once. A gigabit crossover therefore also swaps 4-5 with 7-8.",
            hi: "**1000BASE-T** chaaron pairs (1-2, 3-6, 4-5 aur 7-8) use karta hai, aur har pair ek saath dono directions mein signal le jaata hai. Isliye gigabit crossover 4-5 ko 7-8 se bhi swap karta hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Auto-MDIX", hi: "Auto-MDIX" },
          text: {
            en: "A port with **Auto-MDIX** detects the wrong cable and swaps its own transmit and receive pairs, so either cable works. Modern Cisco switches enable it by default (interface command `mdix auto`); on some older models it only works when speed and duplex are left on auto. The exam still asks which cable the pinouts require, so learn the table above.",
            hi: "**Auto-MDIX** wala port galat cable pehchaan kar apne transmit aur receive pairs khud swap kar leta hai, toh koi bhi cable chal jaata hai. Modern Cisco switches par yeh by default on hai (interface command `mdix auto`); kuch purane models par yeh tabhi kaam karta hai jab speed aur duplex auto par hon. Exam phir bhi poochta hai ki pinouts ke hisaab se kaunsa cable chahiye, isliye upar wali table yaad karo.",
          },
        },
      ],
    },
    {
      id: "fiber",
      heading: { en: "Fiber: multimode, single-mode and SFPs", hi: "Fiber: multimode, single-mode aur SFPs" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Fiber carries light instead of electricity. A glass **core** carries the light, and the **cladding** around it reflects the light back in, so it stays trapped as it travels. Light is not affected by electrical noise and loses little strength over distance, so fiber is used wherever 100 m is not enough or the area is electrically noisy. A normal fiber link uses two strands, one for each direction.",
            hi: "Fiber bijli ki jagah light le jaata hai. Glass ka **core** light le jaata hai, aur uske chaaron taraf ki **cladding** light ko wapas andar reflect karti hai, toh light andar hi band rehti hai. Light par electrical noise ka asar nahi hota aur lambi distance par bhi woh zyada kamzor nahi hoti, isliye jahan 100 m kaafi nahi ya electrical noise zyada ho, wahan fiber use hota hai. Normal fiber link do strands use karta hai, har direction ke liye ek.",
          },
        },
        {
          type: "table",
          caption: { en: "Multimode versus single-mode", hi: "Multimode vs single-mode" },
          columns: [{ en: "Feature", hi: "Feature" }, { en: "Multimode (MMF)", hi: "Multimode (MMF)" }, { en: "Single-mode (SMF)", hi: "Single-mode (SMF)" }],
          rows: [
            [{ en: "Core diameter", hi: "Core diameter" }, "50 or 62.5 µm", { en: "About 9 µm", hi: "Lagbhag 9 µm" }],
            [{ en: "Light source", hi: "Light source" }, { en: "LEDs or low-cost lasers (VCSELs), usually 850 nm", hi: "LEDs ya low-cost lasers (VCSELs), aam taur par 850 nm" }, { en: "Lasers, 1310 or 1550 nm", hi: "Lasers, 1310 ya 1550 nm" }],
            [{ en: "Why the name", hi: "Naam kyun" }, { en: "Light takes many paths (modes) down the wide core, which smears the signal over distance", hi: "Chaude core mein light kai raaston (modes) se jaati hai, jisse distance par signal phail jaata hai" }, { en: "The core is so thin that light takes one path, so the signal stays sharp", hi: "Core itna patla hai ki light ek hi raaste se jaati hai, isliye signal saaf rehta hai" }],
            [{ en: "Typical reach", hi: "Typical reach" }, { en: "Hundreds of metres", hi: "Kuch sau metre" }, { en: "Kilometres", hi: "Kilometres" }],
            [{ en: "Cost", hi: "Cost" }, { en: "Cheaper transceivers", hi: "Saste transceivers" }, { en: "More expensive transceivers", hi: "Mehenge transceivers" }],
            [{ en: "How to spot it", hi: "Kaise pehchaano" }, { en: "Aqua jacket (OM3/OM4); orange on older OM1/OM2", hi: "Aqua jacket (OM3/OM4); purane OM1/OM2 par orange" }, { en: "Yellow jacket (OS1/OS2)", hi: "Yellow jacket (OS1/OS2)" }],
          ],
        },
        {
          type: "table",
          caption: { en: "Fiber Ethernet standards", hi: "Fiber Ethernet standards" },
          columns: ["Standard", "Fiber", { en: "Wavelength", hi: "Wavelength" }, { en: "Max distance", hi: "Max distance" }],
          rows: [
            ["1000BASE-SX", "Multimode", "850 nm", { en: "About 550 m", hi: "Lagbhag 550 m" }],
            ["1000BASE-LX", { en: "Single-mode (multimode to 550 m)", hi: "Single-mode (multimode par 550 m tak)" }, "1310 nm", { en: "5 km in the standard; many optics reach 10 km", hi: "Standard mein 5 km; kai optics 10 km tak" }],
            ["10GBASE-SR", "Multimode", "850 nm", { en: "300 m on OM3, 400 m on OM4", hi: "OM3 par 300 m, OM4 par 400 m" }],
            ["10GBASE-LR", "Single-mode", "1310 nm", "10 km"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Switches and routers connect to fiber through **transceivers**: small hot-swappable modules that slide into a port. An **SFP** runs at 1 Gbps and an **SFP+** at 10 Gbps. You pick the module to suit the link (SX for a short multimode run, LX or LR for a long single-mode run, even a copper 1000BASE-T SFP), and both ends must use the same standard. Most fiber SFPs take an **LC** connector, a small push-in plug that holds both strands.",
            hi: "Switches aur routers fiber se **transceivers** ke through judte hain: chhote hot-swappable modules jo port mein slide ho jaate hain. **SFP** 1 Gbps par chalta hai aur **SFP+** 10 Gbps par. Module link ke hisaab se chuna jaata hai (chhote multimode run ke liye SX, lambe single-mode run ke liye LX ya LR, yahan tak ki copper 1000BASE-T SFP bhi), aur dono ends par same standard hona zaroori hai. Zyadatar fiber SFPs mein **LC** connector lagta hai, ek chhota push-in plug jo dono strands pakadta hai.",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Distance**: copper stops at 100 m; fiber goes from hundreds of metres (MMF) to tens of kilometres (SMF).", hi: "**Distance**: copper 100 m par ruk jaata hai; fiber kuch sau metre (MMF) se lekar das-das kilometre (SMF) tak jaata hai." },
            { en: "**Noise**: copper picks up EMI near motors and power cables; fiber is immune to it.", hi: "**Noise**: copper motors aur power cables ke paas EMI pakad leta hai; fiber par iska koi asar nahi." },
            { en: "**Cost**: copper ports are built into every switch and PC; fiber needs transceivers at both ends.", hi: "**Cost**: copper ports har switch aur PC mein built-in hote hain; fiber ko dono ends par transceivers chahiye." },
            { en: "**Power**: only copper can carry PoE to a phone or access point.", hi: "**Power**: phone ya access point ko PoE sirf copper de sakta hai." },
          ],
        },
      ],
    },
    {
      id: "shared-vs-point-to-point",
      heading: { en: "Shared media and point-to-point links", hi: "Shared media aur point-to-point links" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Early Ethernet ran every device off one shared coaxial cable. Hubs kept the same idea with UTP: a hub is a Layer 1 device that repeats every bit it receives out of all its other ports. Either way, all the devices share one medium, and if two transmit at once their signals **collide**.",
            hi: "Shuru ka Ethernet har device ko ek hi shared coaxial cable se jodta tha. Hubs ne UTP ke saath wahi idea rakha: hub ek Layer 1 device hai jo har aane wali bit ko baaki saare ports se repeat kar deta hai. Dono tarah se saare devices ek hi medium share karte hain, aur agar do ek saath transmit karein toh unke signals **collide** karte hain.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Shared media**: one medium, many devices. Only one can send at a time, which is **half duplex**. Ethernet on shared media uses **CSMA/CD**: listen before sending, detect a collision, wait a random time, send again. Wi-Fi is shared media too and uses CSMA/CA (lesson 1.14).",
              hi: "**Shared media**: ek medium, kai devices. Ek time par sirf ek bhej sakta hai, yahi **half duplex** hai. Shared media par Ethernet **CSMA/CD** use karta hai: bhejne se pehle suno, collision detect karo, random time wait karo, dobara bhejo. Wi-Fi bhi shared media hai aur CSMA/CA use karta hai (lesson 1.14).",
            },
            {
              en: "**Point-to-point**: exactly two devices on the link, such as a PC and its switch port, or two switches. Nobody else shares the medium, and the two directions are kept apart (separate pairs at 10/100 Mbps, echo cancellation at 1000BASE-T, separate strands on fiber), so both sides can send at the same time (**full duplex**) and collisions cannot happen.",
              hi: "**Point-to-point**: link par sirf do devices, jaise ek PC aur uska switch port, ya do switches. Medium koi aur share nahi karta, aur dono directions alag rakhi jaati hain (10/100 Mbps par alag pairs, 1000BASE-T par echo cancellation, fiber par alag strands), isliye dono side ek saath bhej sakte hain (**full duplex**) aur collision ho hi nahi sakta.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Hubs are history, but not on the exam", hi: "Hubs purane ho gaye, exam mein nahi" },
          text: {
            en: "You will rarely see a hub in a real network, because switched Ethernet is point-to-point and full duplex. The exam still expects you to know that a hub is Layer 1, that its ports share one half-duplex medium, and why CSMA/CD exists. Duplex mismatches and collision counters come in lesson 1.11.",
            hi: "Asli network mein hub shayad hi dikhega, kyunki switched Ethernet point-to-point aur full duplex hai. Phir bhi exam expect karta hai ki tumhe pata ho: hub Layer 1 device hai, uske ports ek half-duplex medium share karte hain, aur CSMA/CD kyun bana. Duplex mismatch aur collision counters lesson 1.11 mein aayenge.",
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
            en: "**PoE** sends DC power down the same UTP cable as the data, so IP phones, access points and cameras need no power socket nearby. The switch is the **PSE** (power sourcing equipment) and the phone or AP is the **PD** (powered device). The switch never pushes power blindly:",
            hi: "**PoE** data wale usi UTP cable par DC power bhi bhejta hai, isliye IP phones, access points aur cameras ko paas mein power socket nahi chahiye. Switch **PSE** (power sourcing equipment) hai aur phone ya AP **PD** (powered device). Switch kabhi bina check kiye power nahi bhejta:",
          },
        },
        {
          type: "steps",
          items: [
            { en: "**Detect**: the switch applies a small voltage and checks for the signature a PoE device presents. A normal PC does not have it, so it gets no power.", hi: "**Detect**: switch ek chhota voltage lagata hai aur check karta hai ki PoE device wala signature hai ya nahi. Normal PC mein yeh nahi hota, isliye use power nahi milti." },
            { en: "**Classify**: the device reports its power class, which tells the switch how much it needs.", hi: "**Classify**: device apni power class batata hai, jisse switch ko pata chalta hai ki use kitni power chahiye." },
            { en: "**Power**: the switch supplies power and takes it out of its total PoE budget.", hi: "**Power**: switch power deta hai aur use apne total PoE budget se ghata deta hai." },
          ],
        },
        {
          type: "table",
          caption: { en: "PoE standards (power at the switch port)", hi: "PoE standards (switch port par power)" },
          columns: ["IEEE", { en: "Name", hi: "Naam" }, { en: "Max per port", hi: "Max per port" }],
          rows: [
            ["802.3af", "PoE", "15.4 W"],
            ["802.3at", "PoE+", "30 W"],
            ["802.3bt", "PoE++ (Type 3 / Type 4)", "60 W / 90 W"],
          ],
        },
      ],
    },
    {
      id: "cisco-interfaces",
      heading: { en: "Interfaces on a Cisco switch", hi: "Cisco switch par interfaces" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Cisco names an Ethernet interface after the fastest speed it supports: **FastEthernet** (`Fa`, 100 Mbps), **GigabitEthernet** (`Gi`, 1 Gbps) and **TenGigabitEthernet** (`Te`, 10 Gbps). The numbers after the name show where the port sits.",
            hi: "Cisco Ethernet interface ka naam uski sabse zyada supported speed par rakhta hai: **FastEthernet** (`Fa`, 100 Mbps), **GigabitEthernet** (`Gi`, 1 Gbps) aur **TenGigabitEthernet** (`Te`, 10 Gbps). Naam ke baad ke numbers batate hain ki port kahan hai.",
          },
        },
        {
          type: "list",
          items: [
            { en: "`Gi0/1`: module 0, port 1. Older fixed switches such as the 2960 and ISR G2 routers.", hi: "`Gi0/1`: module 0, port 1. Yeh 2960 jaise purane fixed switches aur ISR G2 routers par milta hai." },
            { en: "`Gi1/0/1`: switch 1 in a stack, module 0, port 1. Stackable switches such as the Catalyst 9200 and 9300.", hi: "`Gi1/0/1`: stack ka switch 1, module 0, port 1. Yeh Catalyst 9200 aur 9300 jaise stackable switches par milta hai." },
            { en: "`Gi0/0/0`: slot 0, subslot 0, port 0. ISR 4000 series routers.", hi: "`Gi0/0/0`: slot 0, subslot 0, port 0. Yeh ISR 4000 series routers par milta hai." },
          ],
        },
        {
          type: "p",
          text: {
            en: "`show interfaces status` lists every port with its speed, duplex and, in the Type column, the physical media. You will learn the CLI itself in lesson 0.8; for now just read the output. This is SW1 from the animation.",
            hi: "`show interfaces status` har port ki speed, duplex aur Type column mein physical media dikhata hai. CLI tum lesson 0.8 mein seekhoge; abhi sirf output padhna seekho. Yeh animation wala SW1 hai.",
          },
        },
        {
          type: "cli",
          title: { en: "SW1: ports and their media", hi: "SW1: ports aur unka media" },
          lines: [
            { prompt: "SW1#", cmd: "show interfaces status" },
            { out: "Port      Name               Status       Vlan       Duplex  Speed Type" },
            { out: "Gi1/0/1   PC-A               connected    1          a-full a-1000 10/100/1000BaseTX", comment: { en: "\"a-\" means the value was auto-negotiated", hi: "\"a-\" ka matlab value auto-negotiate hui" } },
            { out: "Gi1/0/2   AP1                connected    1          a-full a-1000 10/100/1000BaseTX" },
            { out: "Gi1/0/3                      notconnect   1            auto   auto 10/100/1000BaseTX", comment: { en: "Nothing plugged in", hi: "Kuch laga nahi hai" } },
            { out: "Gi1/0/24  SW2                connected    1          a-full a-1000 10/100/1000BaseTX" },
            { out: "Gi1/1/1   Uplink to CORE     connected    1            full   1000 1000BaseSX SFP", comment: { en: "A 1000BASE-SX SFP: gigabit over multimode fiber", hi: "1000BASE-SX SFP: multimode fiber par gigabit" } },
          ],
          note: {
            en: "Copper ports show 10/100/1000BaseTX. An SFP slot shows the module that is plugged in, so the Type column tells you the fiber type without walking to the rack.",
            hi: "Copper ports 10/100/1000BaseTX dikhate hain. SFP slot mein jo module laga hai wahi dikhta hai, isliye rack tak jaaye bina Type column se fiber type pata chal jaata hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "The name is the top speed, not the current speed", hi: "Naam top speed hai, current speed nahi" },
          text: {
            en: "A GigabitEthernet port connected to a 100 Mbps printer runs at 100 Mbps and is still called GigabitEthernet. Read the Speed column to see what the link is really doing.",
            hi: "100 Mbps printer se juda GigabitEthernet port 100 Mbps par chalta hai, phir bhi uska naam GigabitEthernet hi rehta hai. Link asal mein kya kar raha hai, woh Speed column mein dekho.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "UTP", def: { en: "Unshielded twisted pair: eight copper wires in four twisted pairs, with RJ-45 connectors and a 100 m limit for Ethernet.", hi: "Unshielded twisted pair: chaar twisted pairs mein aath copper wires, RJ-45 connectors ke saath, Ethernet ke liye 100 m limit." } },
    { term: "Straight-through cable", def: { en: "UTP wired pin 1 to 1, 2 to 2 and so on; connects unlike devices such as a PC and a switch.", hi: "UTP jisme pin 1 se 1, 2 se 2 aur aise hi jude hote hain; PC aur switch jaise unlike devices ko jodta hai." } },
    { term: "Crossover cable", def: { en: "UTP that swaps the transmit and receive pairs (1 to 3, 2 to 6); connects like devices such as two switches.", hi: "UTP jo transmit aur receive pairs swap karta hai (1 se 3, 2 se 6); do switches jaise like devices ko jodta hai." } },
    { term: "Auto-MDIX", def: { en: "A port feature that detects the cable type and swaps its own pairs, so either cable works.", hi: "Port ka feature jo cable type pehchaan kar apne pairs khud swap kar leta hai, taaki koi bhi cable chal jaaye." } },
    { term: "Multimode fiber (MMF)", def: { en: "Fiber with a 50 or 62.5 µm core, driven by LEDs or low-cost lasers (usually 850 nm), reaching hundreds of metres.", hi: "50 ya 62.5 µm core wala fiber, LEDs ya low-cost lasers (aam taur par 850 nm) se chalta hai, kuch sau metre tak jaata hai." } },
    { term: "Single-mode fiber (SMF)", def: { en: "Fiber with a core of about 9 µm, driven by 1310 or 1550 nm lasers, reaching kilometres.", hi: "Lagbhag 9 µm core wala fiber, 1310 ya 1550 nm lasers se chalta hai, kilometres tak jaata hai." } },
    { term: "SFP / SFP+", def: { en: "Hot-swappable transceiver modules for 1 Gbps (SFP) and 10 Gbps (SFP+) that set a port's media type.", hi: "1 Gbps (SFP) aur 10 Gbps (SFP+) ke hot-swappable transceiver modules jo port ka media type decide karte hain." } },
    { term: "PoE", def: { en: "Power over Ethernet: a switch supplies DC power to a device over the same UTP cable that carries its data.", hi: "Power over Ethernet: switch usi UTP cable par device ko DC power deta hai jis par uska data jaata hai." } },
  ],
  commands: [
    { cmd: "show interfaces status", mode: "Privileged EXEC", does: { en: "List every port with its status, VLAN, duplex, speed and media type", hi: "Har port ka status, VLAN, duplex, speed aur media type dikhata hai" } },
    { cmd: "mdix auto", mode: "Interface configuration", does: { en: "Turn Auto-MDIX on for a port (on by default on modern Catalyst switches)", hi: "Port par Auto-MDIX on karta hai (modern Catalyst switches par by default on)" } },
    { cmd: "show power inline", mode: "Privileged EXEC", does: { en: "Show the PoE budget and how much power each port is supplying", hi: "PoE budget aur har port kitni power de raha hai, yeh dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Using a straight-through cable from a PC to a router. PCs and routers both transmit on pins 1 and 2, so without Auto-MDIX they need a crossover.",
      hi: "PC se router tak straight-through cable lagana. PC aur router dono pins 1 aur 2 par transmit karte hain, isliye Auto-MDIX ke bina crossover chahiye.",
    },
    {
      en: "Assuming any UTP runs 10 Gbps for 100 m. 10GBASE-T needs Cat6a for 100 m; Cat6 manages only 55 m, and Cat5e is not rated for it.",
      hi: "Yeh maan lena ki koi bhi UTP 100 m tak 10 Gbps chala dega. 10GBASE-T ko 100 m ke liye Cat6a chahiye; Cat6 sirf 55 m tak chalta hai, aur Cat5e iske liye rated hi nahi hai.",
    },
    {
      en: "Thinking multimode goes farther because \"multi\" sounds bigger. Multimode has the wide core and the short reach (hundreds of metres); single-mode has the 9 µm core and reaches kilometres.",
      hi: "Yeh sochna ki multimode zyada door jaata hai kyunki \"multi\" bada lagta hai. Multimode ka core chauda hai aur reach kam (kuch sau metre); single-mode ka core 9 µm hai aur reach kilometres mein.",
    },
    {
      en: "Putting an SX optic at one end and an LX optic at the other. The wavelength and fiber type must match at both ends, or the link never comes up.",
      hi: "Ek end par SX optic aur doosre par LX optic lagana. Dono ends par wavelength aur fiber type match hone chahiye, warna link kabhi up nahi hoga.",
    },
    {
      en: "Reading the interface name as the current speed. A GigabitEthernet port may be running at 100 Mbps; check the Speed column.",
      hi: "Interface ke naam ko current speed samajhna. GigabitEthernet port 100 Mbps par bhi chal sakta hai; Speed column check karo.",
    },
    {
      en: "Calling a hub a switch. A hub repeats bits to every port (Layer 1, shared, half duplex); a switch gives every port its own point-to-point link (Layer 2, full duplex).",
      hi: "Hub ko switch bolna. Hub har port par bits repeat karta hai (Layer 1, shared, half duplex); switch har port ko apna point-to-point link deta hai (Layer 2, full duplex).",
    },
  ],
  recap: [
    { en: "UTP: four twisted pairs, RJ-45, 100 m per link. Cat5e for 1 Gbps; Cat6a for 10 Gbps at 100 m.", hi: "UTP: chaar twisted pairs, RJ-45, har link 100 m. 1 Gbps ke liye Cat5e; 100 m par 10 Gbps ke liye Cat6a." },
    { en: "At 10/100 Mbps, PCs, routers and APs transmit on pins 1-2 and switches on 3-6. Unlike devices: straight-through. Like devices: crossover. Auto-MDIX makes either cable work.", hi: "10/100 Mbps par PCs, routers aur APs pins 1-2 par transmit karte hain aur switches 3-6 par. Unlike devices: straight-through. Like devices: crossover. Auto-MDIX se koi bhi cable chal jaata hai." },
    { en: "1000BASE-T uses all four pairs, each in both directions at once.", hi: "1000BASE-T chaaron pairs use karta hai, har pair ek saath dono directions mein." },
    { en: "MMF: 50/62.5 µm core, 850 nm, hundreds of metres (SX about 550 m, SR 300-400 m). SMF: 9 µm core, 1310/1550 nm lasers, kilometres (LX 5 km, LR 10 km).", hi: "MMF ka core 50/62.5 µm hai, light 850 nm, aur reach kuch sau metre (SX lagbhag 550 m, SR 300-400 m). SMF ka core 9 µm hai, 1310/1550 nm lasers, aur reach kilometres mein (LX 5 km, LR 10 km)." },
    { en: "SFP = 1 Gbps, SFP+ = 10 Gbps. Both ends of a fiber link need matching optics.", hi: "SFP = 1 Gbps, SFP+ = 10 Gbps. Fiber link ke dono ends par matching optics chahiye." },
    { en: "Shared media (hub, coax, Wi-Fi): half duplex, collisions. Point-to-point (switch port): full duplex, no collisions. PoE: 15.4 W (af), 30 W (at), up to 90 W (bt).", hi: "Shared media (hub, coax, Wi-Fi): half duplex, collisions. Point-to-point (switch port): full duplex, koi collision nahi. PoE: 15.4 W (af), 30 W (at), 90 W tak (bt)." },
  ],
  quiz: [
    {
      q: {
        en: "A PC's NIC must connect directly to a router's FastEthernet port, and neither side supports Auto-MDIX. Which cable do you need?",
        hi: "PC ka NIC seedha router ke FastEthernet port se jodna hai, aur dono mein se kisi mein Auto-MDIX nahi hai. Kaunsa cable chahiye?",
      },
      options: [
        { en: "Straight-through UTP", hi: "Straight-through UTP" },
        { en: "Crossover UTP", hi: "Crossover UTP" },
        { en: "Rollover (console) cable", hi: "Rollover (console) cable" },
        { en: "Multimode fiber", hi: "Multimode fiber" },
      ],
      answer: 1,
      explain: {
        en: "PC NICs and routers both transmit on pins 1 and 2, so a crossover is needed to put each transmit pair on the other side's receive pair. Straight-through is for unlike devices such as PC to switch. A rollover cable goes to a console port and does not carry Ethernet.",
        hi: "PC NIC aur router dono pins 1 aur 2 par transmit karte hain, isliye crossover chahiye taaki har transmit pair doosri side ke receive pair par pahunche. Straight-through PC se switch jaise unlike devices ke liye hai. Rollover cable console port ke liye hota hai, woh Ethernet nahi le jaata.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Four PCs are connected to a hub. PC1 and PC3 start transmitting at the same instant. What happens?",
        hi: "Chaar PCs ek hub se jude hain. PC1 aur PC3 ek hi pal mein transmit karna shuru karte hain. Kya hoga?",
      },
      options: [
        { en: "The hub buffers one frame and sends it after the other", hi: "Hub ek frame buffer karke doosre ke baad bhejta hai" },
        { en: "The hub forwards each frame only out of its destination port", hi: "Hub har frame sirf uske destination port se forward karta hai" },
        { en: "Both frames get through because hub ports run full duplex", hi: "Dono frames nikal jaate hain kyunki hub ports full duplex chalte hain" },
        { en: "The signals collide; both PCs wait a random time and resend", hi: "Signals collide karte hain; dono PCs random time wait karke dobara bhejte hain" },
      ],
      answer: 3,
      explain: {
        en: "A hub is a Layer 1 repeater with no buffers and no MAC table, so all its ports share one half-duplex medium. Simultaneous transmissions collide, and CSMA/CD makes each sender back off for a random time. A switch would forward both frames without a collision.",
        hi: "Hub ek Layer 1 repeater hai, na buffer na MAC table, isliye uske saare ports ek half-duplex medium share karte hain. Ek saath transmission collide karte hain, aur CSMA/CD har sender ko random time ke liye rok deta hai. Switch dono frames bina collision ke forward kar deta.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Two buildings 3 km apart need a 1 Gbps Ethernet link. Which option can do it?", hi: "3 km door do buildings ko 1 Gbps Ethernet link chahiye. Kaunsa option kaam karega?" },
      options: [
        { en: "1000BASE-LX over single-mode fiber", hi: "Single-mode fiber par 1000BASE-LX" },
        { en: "1000BASE-SX over multimode fiber", hi: "Multimode fiber par 1000BASE-SX" },
        { en: "1000BASE-T over Cat6a UTP", hi: "Cat6a UTP par 1000BASE-T" },
        { en: "10GBASE-SR over multimode fiber", hi: "Multimode fiber par 10GBASE-SR" },
      ],
      answer: 0,
      explain: {
        en: "1000BASE-LX over single-mode fiber reaches 5 km in the standard, and many optics reach 10 km. SX tops out around 550 m, SR at 300-400 m, and any UTP at 100 m.",
        hi: "Single-mode fiber par 1000BASE-LX standard mein 5 km tak jaata hai, aur kai optics 10 km tak. SX lagbhag 550 m par ruk jaata hai, SR 300-400 m par, aur koi bhi UTP 100 m par.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which statement about multimode fiber, compared with single-mode fiber, is true?", hi: "Single-mode fiber ke comparison mein multimode fiber ke baare mein kaunsa statement sahi hai?" },
      options: [
        { en: "It has a smaller core and reaches farther", hi: "Iska core chhota hai aur yeh zyada door jaata hai" },
        { en: "It can carry PoE to access points", hi: "Yeh access points ko PoE de sakta hai" },
        { en: "It has a larger core and a shorter maximum distance", hi: "Iska core bada hai aur maximum distance kam" },
        { en: "It is affected by electromagnetic interference", hi: "Is par electromagnetic interference ka asar hota hai" },
      ],
      answer: 2,
      explain: {
        en: "Multimode's 50 or 62.5 µm core lets light take many paths, and those paths spread the signal out over distance, so it reaches hundreds of metres rather than kilometres. No fiber carries PoE, and both kinds of fiber are immune to EMI.",
        hi: "Multimode ka 50 ya 62.5 µm core light ko kai raaston se jaane deta hai, aur yeh raaste distance par signal ko phaila dete hain, isliye yeh kilometres nahi, kuch sau metre tak jaata hai. Koi fiber PoE nahi le jaata, aur dono tarah ke fiber par EMI ka asar nahi hota.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "`show interfaces status` on SW1 shows `Gi1/1/1  Uplink to CORE  connected  1  full  1000 1000BaseSX SFP`. What do you know about this link?",
        hi: "SW1 par `show interfaces status` mein `Gi1/1/1  Uplink to CORE  connected  1  full  1000 1000BaseSX SFP` dikhta hai. Is link ke baare mein kya pata chalta hai?",
      },
      options: [
        { en: "It is copper UTP running at 1 Gbps", hi: "Yeh 1 Gbps par chalta copper UTP hai" },
        { en: "It uses single-mode fiber and can reach 10 km", hi: "Yeh single-mode fiber use karta hai aur 10 km tak jaa sakta hai" },
        { en: "It runs at 10 Gbps through an SFP+ module", hi: "Yeh SFP+ module se 10 Gbps par chalta hai" },
        { en: "It runs at 1 Gbps over multimode fiber through an SFP module", hi: "Yeh SFP module se multimode fiber par 1 Gbps chalta hai" },
      ],
      answer: 3,
      explain: {
        en: "The Type column names the installed transceiver: a 1000BASE-SX SFP, which means 1 Gbps over multimode fiber at 850 nm, and the Speed column confirms 1000 Mbps. Copper ports show 10/100/1000BaseTX instead.",
        hi: "Type column laga hua transceiver batata hai: 1000BASE-SX SFP, yaani 850 nm par multimode fiber par 1 Gbps, aur Speed column 1000 Mbps confirm karta hai. Copper ports ki jagah 10/100/1000BaseTX dikhta.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A new 10GBASE-T link has to run 80 m through the building. What is the lowest cable category that supports it?",
        hi: "Ek naya 10GBASE-T link building mein 80 m chalana hai. Sabse neeche wali kaunsi cable category ise support karti hai?",
      },
      options: [
        { en: "Cat6a", hi: "Cat6a" },
        { en: "Cat5e", hi: "Cat5e" },
        { en: "Cat6", hi: "Cat6" },
        { en: "Cat3", hi: "Cat3" },
      ],
      answer: 0,
      explain: {
        en: "10GBASE-T needs Cat6a for runs up to 100 m. Cat6 supports it only up to 55 m, and Cat5e and Cat3 are not rated for 10 Gbps.",
        hi: "100 m tak ke runs ke liye 10GBASE-T ko Cat6a chahiye. Cat6 ise sirf 55 m tak support karta hai, aur Cat5e aur Cat3 10 Gbps ke liye rated nahi hain.",
      },
      kind: "calc",
    },
  ],
  videos: [
    {
      id: "ieTH5lVhNaY",
      title: "Free CCNA | Interfaces and Cables | Day 2",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Ethernet standards, UTP pinouts, straight-through vs crossover and fiber types: the same ground as this lesson.", hi: "Ethernet standards, UTP pinouts, straight-through vs crossover aur fiber types: isi lesson wala content." },
    },
    {
      id: "E3DEJ7odWq0",
      title: "fiber optic cables (what you NEED to know) // FREE CCNA // EP 13",
      channel: "NetworkChuck",
      lang: "en",
      note: { en: "A beginner-friendly look at fiber optic cabling.", hi: "Fiber optic cabling ka beginner-friendly overview." },
    },
    {
      id: "pJVY1MkP2Xc",
      title: "11. Copper Cabling in Networking Explained",
      channel: "NetworkPath",
      lang: "hi",
      note: { en: "Copper cabling explained in Hindi.", hi: "Copper cabling Hindi mein samjhaya gaya hai." },
    },
    {
      id: "0CgAj81A4uo",
      title: "12. Fiber Optic Cabling Explained",
      channel: "NetworkPath",
      lang: "hi",
      note: { en: "Fiber optic cabling explained in Hindi.", hi: "Fiber optic cabling Hindi mein samjhaya gaya hai." },
    },
  ],
  lab: {
    title: { en: "Cables, pinouts and PoE in Packet Tracer", hi: "Packet Tracer mein cables, pinouts aur PoE" },
    steps: [
      {
        en: "Place a 2960 switch, two PCs and a 2911 router. Connect PC0 to the switch with Copper Straight-Through and wait for both link lights to turn green.",
        hi: "Ek 2960 switch, do PCs aur ek 2911 router lagao. PC0 ko switch se Copper Straight-Through se jodo aur dono link lights green hone ka wait karo.",
      },
      {
        en: "Router interfaces are shut down by default, so first open the router's Config tab, select GigabitEthernet0/0 and tick Port Status On. Then connect PC1 directly to Gi0/0 with Copper Straight-Through and note the link lights. Replace it with Copper Cross-Over and compare. If both work, Auto-MDIX is doing its job; if the straight cable stays red, you have seen why crossovers exist.",
        hi: "Router ke interfaces by default shut down hote hain, isliye pehle router ka Config tab kholo, GigabitEthernet0/0 select karo aur Port Status On tick karo. Phir PC1 ko seedha Gi0/0 se Copper Straight-Through se jodo aur link lights dekho. Phir use Copper Cross-Over se badlo aur compare karo. Dono chal gaye toh Auto-MDIX apna kaam kar raha hai; straight cable red raha toh samajh gaye ki crossover kyun bana.",
      },
      {
        en: "Add a second 2960 and join the two switches with Copper Straight-Through. In the switch's CLI tab type `enable`, then `show interfaces status`, and read the Status, Speed and Type columns. If the port you used shows connected, Auto-MDIX fixed the cable for you; notconnect means it did not.",
        hi: "Ek aur 2960 lagao aur dono switches ko Copper Straight-Through se jodo. Switch ke CLI tab mein `enable` type karo, phir `show interfaces status`, aur Status, Speed aur Type columns padho. Jo port use kiya woh connected dikhe toh Auto-MDIX ne cable sambhal liya; notconnect ka matlab nahi sambhala.",
      },
      {
        en: "Place two Switch-PT devices, power them off, add a fiber module such as PT-SWITCH-NM-1FGE to each, power them on and connect them with the Fiber cable.",
        hi: "Do Switch-PT devices lagao, unhe power off karo, har ek mein PT-SWITCH-NM-1FGE jaisa fiber module daalo, power on karo aur Fiber cable se jodo.",
      },
      {
        en: "Connect an IP Phone (7960) to a 3560-24PS switch with no power adapter. It boots because the switch supplies PoE; try the same on a 2960 and see the difference.",
        hi: "Ek IP Phone (7960) ko bina power adapter ke 3560-24PS switch se jodo. Yeh boot ho jaata hai kyunki switch PoE deta hai; yahi 2960 par try karo aur farak dekho.",
      },
    ],
  },
};

export default lesson;
