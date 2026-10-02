import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "wireless-fundamentals",
  intro: {
    en: "A wired PC has its own cable and its own switch port. A wireless client shares the air with every other device on its channel, and anyone nearby can pick up its frames. To design or troubleshoot Wi-Fi you need to know how radio signals behave, which bands and channels to use, and how a client joins an AP and moves between APs without dropping off.",
    hi: "Wired PC ke paas apni cable aur apna switch port hota hai. Wireless client ko apne channel ke har device ke saath hawa share karni padti hai, aur aas-paas koi bhi uske frames pakad sakta hai. Wi-Fi design ya troubleshoot karne ke liye tumhe pata hona chahiye ki radio signal kaise behave karta hai, kaunse bands aur channels use karne hain, aur client AP se kaise judta hai aur bina connection toote ek AP se doosre AP par kaise jaata hai.",
  },
  outcomes: [
    {
      en: "Describe amplitude, frequency and wavelength, and how absorption, reflection, refraction, diffraction and scattering change a signal",
      hi: "Amplitude, frequency aur wavelength samjha sako, aur absorption, reflection, refraction, diffraction aur scattering signal ko kaise badalte hain yeh bata sako",
    },
    {
      en: "Choose non-overlapping 2.4 GHz channels and explain why the 5 and 6 GHz bands have more room",
      hi: "2.4 GHz mein non-overlapping channels chun sako aur samjha sako ki 5 aur 6 GHz bands mein zyada jagah kyun hai",
    },
    { en: "Match the 802.11 standards to their Wi-Fi names and bands", hi: "802.11 standards ko unke Wi-Fi naam aur bands se match kar sako" },
    {
      en: "Explain SSID, BSSID, BSS, ESS, IBSS and the distribution system, and what changes when a client roams",
      hi: "SSID, BSSID, BSS, ESS, IBSS aur distribution system samjha sako, aur bata sako ki client ke roam karne par kya badalta hai",
    },
    { en: "Explain why Wi-Fi uses CSMA/CA instead of CSMA/CD", hi: "Samjha sako ki Wi-Fi CSMA/CD ki jagah CSMA/CA kyun use karta hai" },
  ],
  sections: [
    {
      id: "why-wireless-is-different",
      heading: { en: "Why wireless needs its own rules", hi: "Wireless ke apne rules kyun hain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Wireless LANs (WLANs) are defined by the IEEE **802.11** standards. The **Wi-Fi Alliance** is the industry group that tests products against those standards, certifies that they work together, and owns names such as Wi-Fi 6. A radio link behaves very differently from a switch port:",
            hi: "Wireless LANs (WLANs) IEEE ke **802.11** standards se define hote hain. **Wi-Fi Alliance** industry ka group hai jo products ko in standards ke against test karta hai, certify karta hai ki woh aapas mein kaam karenge, aur Wi-Fi 6 jaise naam isi ke hain. Radio link switch port se bahut alag behave karta hai:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Shared medium.** Every device on a channel shares the same air, like hosts on an old hub. Only one can transmit at a time, so Wi-Fi is **half duplex**.",
              hi: "**Shared medium.** Ek channel ke saare devices same hawa share karte hain, bilkul purane hub ke hosts ki tarah. Ek time par sirf ek transmit kar sakta hai, isliye Wi-Fi **half duplex** hai.",
            },
            {
              en: "**Anyone can listen.** Radio passes through walls and out of the building, and any device in range can capture the frames. That is why authentication and encryption are mandatory on real WLANs.",
              hi: "**Koi bhi sun sakta hai.** Radio deewaron ke paar aur building ke bahar tak jaata hai, aur range mein koi bhi device frames capture kar sakta hai. Isiliye asli WLANs par authentication aur encryption zaroori hain.",
            },
            {
              en: "**The signal keeps changing.** Distance, walls, people and other radios weaken or distort it, so the speed a client gets varies from minute to minute.",
              hi: "**Signal badalta rehta hai.** Distance, deewarein, log aur doosre radios use kamzor ya kharab karte hain, isliye client ki speed minute-minute par badalti rehti hai.",
            },
            {
              en: "**Radio is regulated.** Each country's regulator decides which frequencies, channels and power levels are allowed, so an AP must be set to the country it is installed in.",
              hi: "**Radio regulated hai.** Har desh ka regulator decide karta hai ki kaunsi frequencies, channels aur power levels allowed hain, isliye AP ko usi desh ke hisaab se set karna padta hai jahan woh laga hai.",
            },
          ],
        },
      ],
    },
    {
      id: "rf-basics",
      heading: { en: "Radio frequency basics", hi: "Radio frequency (RF) basics" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Wi-Fi sends data as electromagnetic waves. Four properties describe a wave:",
            hi: "Wi-Fi data ko electromagnetic waves ke roop mein bhejta hai. Ek wave ko chaar properties se describe karte hain:",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Property", hi: "Property" },
            { en: "What it means", hi: "Matlab kya hai" },
            { en: "Wi-Fi example", hi: "Wi-Fi example" },
          ],
          rows: [
            [
              "Amplitude",
              { en: "The strength (height) of the wave. It falls as the signal travels.", hi: "Wave ki strength (height). Signal jitna aage jaata hai, yeh utni girti hai." },
              { en: "Signal strength in dBm drops as you walk away from the AP", hi: "AP se door jaate hi dBm mein signal strength girti hai" },
            ],
            [
              "Frequency",
              { en: "How many cycles the wave completes per second, in hertz (Hz).", hi: "Wave ek second mein kitne cycles poore karti hai, hertz (Hz) mein." },
              { en: "2.4 GHz = 2.4 billion cycles per second", hi: "2.4 GHz = ek second mein 2.4 billion cycles" },
            ],
            [
              "Period",
              { en: "The time one cycle takes: 1 ÷ frequency.", hi: "Ek cycle mein lagne wala time: 1 ÷ frequency." },
              { en: "About 0.42 nanoseconds at 2.4 GHz", hi: "2.4 GHz par lagbhag 0.42 nanoseconds" },
            ],
            [
              "Wavelength",
              { en: "The distance the wave travels in one cycle. Higher frequency, shorter wavelength.", hi: "Ek cycle mein wave jitni doori tay karti hai. Frequency zyada, wavelength chhoti." },
              { en: "About 12.5 cm at 2.4 GHz, about 6 cm at 5 GHz", hi: "2.4 GHz par lagbhag 12.5 cm, 5 GHz par lagbhag 6 cm" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Received signal strength is shown in **dBm**, a negative number where closer to zero is stronger. `-30 dBm` is excellent, `-67 dBm` is a common minimum for voice and video, and near `-90 dBm` the signal is hard to tell apart from background noise. A change of 3 dB doubles or halves the power. The gap between signal and noise is the **signal-to-noise ratio (SNR)**; the bigger it is, the faster and more reliable the link.",
            hi: "Received signal strength **dBm** mein dikhti hai, jo negative number hota hai, aur zero ke jitna paas utna strong. `-30 dBm` excellent hai, voice aur video ke liye `-67 dBm` ek common minimum hai, aur `-90 dBm` ke aas-paas signal background noise se alag pehchaanna mushkil hota hai. 3 dB ka change power ko double ya half kar deta hai. Signal aur noise ke beech ka gap **signal-to-noise ratio (SNR)** hai; yeh jitna bada, link utna fast aur reliable.",
          },
        },
        {
          type: "p",
          text: {
            en: "On its way from the AP to the client, the signal meets walls, people and furniture. Five behaviours explain most coverage problems:",
            hi: "AP se client tak jaate hue signal ko deewarein, log aur furniture milte hain. Coverage ki zyadatar problems in paanch behaviours se samajh aati hain:",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Behaviour", hi: "Behaviour" },
            { en: "What happens", hi: "Kya hota hai" },
            { en: "Typical cause", hi: "Aam wajah" },
          ],
          rows: [
            [
              "Absorption",
              { en: "The material soaks up energy and turns it into heat, so the signal is weaker on the far side.", hi: "Material energy soak karke heat bana deta hai, isliye doosri taraf signal kamzor hota hai." },
              { en: "Walls, water, human bodies", hi: "Deewarein, paani, insaan ke shareer" },
            ],
            [
              "Reflection",
              { en: "The signal bounces off a surface and travels on in a new direction.", hi: "Signal kisi surface se takra kar nayi direction mein chala jaata hai." },
              { en: "Metal: lift doors, filing cabinets, racks", hi: "Metal: lift ke darwaaze, filing cabinets, racks" },
            ],
            [
              "Refraction",
              { en: "The signal bends and changes speed as it enters a material of different density.", hi: "Alag density wale material mein ghuste hi signal mud jaata hai aur uski speed badal jaati hai." },
              { en: "Glass, water", hi: "Glass, paani" },
            ],
            [
              "Diffraction",
              { en: "The signal bends around an obstacle, leaving a weak-signal shadow behind it.", hi: "Signal kisi rukawat ke around mud jaata hai, aur uske peeche weak signal ki shadow ban jaati hai." },
              { en: "Pillars, large machines", hi: "Pillars, badi machines" },
            ],
            [
              "Scattering",
              { en: "The signal hits many small or uneven objects and spreads in many directions.", hi: "Signal bahut saari chhoti ya ubad-khabad cheezon se takra kar kai directions mein bikhar jaata hai." },
              { en: "Dust, smog, uneven surfaces", hi: "Dhool, smog, ubad-khabad surfaces" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "**Interference** is another signal on the same or an overlapping frequency. Two APs on the same channel that can hear each other cause **co-channel interference**: they have to share airtime. APs on overlapping channels cause **adjacent-channel interference**, which is worse, because each one hears the other only as noise and cannot wait its turn. The 2.4 GHz band also carries non-Wi-Fi signals from microwave ovens, Bluetooth and cordless phones.",
            hi: "**Interference** matlab same ya overlapping frequency par koi doosra signal. Same channel par do APs jo ek doosre ko sun sakte hain, **co-channel interference** karte hain: unhe airtime share karna padta hai. Overlapping channels wale APs **adjacent-channel interference** karte hain, jo zyada kharab hai, kyunki dono ek doosre ko sirf noise ki tarah sunte hain aur apni baari ka wait nahi kar paate. 2.4 GHz band mein microwave ovens, Bluetooth aur cordless phones ke non-Wi-Fi signals bhi hote hain.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Range vs frequency", hi: "Range vs frequency" },
          text: {
            en: "Higher frequencies lose more strength through walls and over distance. So 2.4 GHz reaches farther than 5 GHz, and 6 GHz has the shortest range of the three. In return, the higher bands have far more channels and less interference.",
            hi: "Higher frequencies deewaron ke paar aur distance par zyada strength khoti hain. Isliye 2.4 GHz, 5 GHz se door tak pahunchta hai, aur teeno mein 6 GHz ki range sabse kam hai. Badle mein higher bands mein bahut zyada channels aur kam interference milta hai.",
          },
        },
      ],
    },
    {
      id: "bands-and-channels",
      heading: { en: "Bands and channels: 2.4, 5 and 6 GHz", hi: "Bands aur channels: 2.4, 5 aur 6 GHz" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **band** is a range of frequencies; a **channel** is a slice of it that one AP and its clients use. In the **2.4 GHz** band (2.400-2.4835 GHz), channel centres are only 5 MHz apart, but each channel is about 22 MHz wide. So neighbouring channels overlap heavily.",
            hi: "**Band** frequencies ki ek range hai; **channel** us range ka ek hissa hai jise ek AP aur uske clients use karte hain. **2.4 GHz** band (2.400-2.4835 GHz) mein channel centres sirf 5 MHz door hain, lekin har channel lagbhag 22 MHz chauda hai. Isliye paas-paas ke channels bahut zyada overlap karte hain.",
          },
        },
        {
          type: "table",
          caption: { en: "Centres 5 MHz apart, channels about 22 MHz wide", hi: "Centres 5 MHz door, channels lagbhag 22 MHz chaude" },
          columns: [
            { en: "Channel", hi: "Channel" },
            { en: "Centre", hi: "Centre" },
            { en: "Occupies", hi: "Kitni jagah leta hai" },
            { en: "Overlaps channels", hi: "In channels se overlap" },
          ],
          rows: [
            ["1", "2412 MHz", "2401-2423 MHz", "2-5"],
            ["3", "2422 MHz", "2411-2433 MHz", "1-2, 4-7"],
            ["6", "2437 MHz", "2426-2448 MHz", "2-5, 7-10"],
            ["11", "2462 MHz", "2451-2473 MHz", { en: "7-10 (and 12-13 where allowed)", hi: "7-10 (aur jahan allowed ho, 12-13)" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Channels 1, 6 and 11 are 25 MHz apart, so they do not overlap. The US allows channels 1-11; many other regions, including Europe and India, also allow 12 and 13, but 1, 6 and 11 remain the standard plan. Place APs so that neighbouring cells always use different channels, repeating 1, 6, 11 in a honeycomb pattern.",
            hi: "Channels 1, 6 aur 11 ek doosre se 25 MHz door hain, isliye overlap nahi karte. US mein channels 1-11 allowed hain; Europe aur India jaise kai regions mein 12 aur 13 bhi allowed hain, lekin standard plan 1, 6 aur 11 hi rehta hai. APs aise lagao ki padosi cells hamesha alag channels use karein, 1, 6, 11 ko honeycomb pattern mein repeat karte hue.",
          },
        },
        {
          type: "p",
          text: {
            en: "The **5 GHz** band is much wider. Its channels are 20 MHz wide and numbered in steps of 4 (36, 40, 44, 48, 52 and up to 165), and they do not overlap, giving more than 20 non-overlapping channels in the US (the exact set depends on the country). Channels can be bonded into 40, 80 or 160 MHz channels for more speed, at the cost of fewer separate channels.",
            hi: "**5 GHz** band kaafi chauda hai. Iske channels 20 MHz chaude hain aur 4 ke steps mein number hote hain (36, 40, 44, 48, 52 se 165 tak), aur yeh overlap nahi karte, isliye US mein 20 se zyada non-overlapping channels milte hain (exact set desh par depend karta hai). Zyada speed ke liye channels ko 40, 80 ya 160 MHz mein bond kar sakte ho, lekin phir alag channels kam bachte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "The **6 GHz** band (5.925-7.125 GHz) opened with **Wi-Fi 6E** and is also used by **Wi-Fi 7**. In the US it adds 1200 MHz: 59 non-overlapping 20 MHz channels, or seven 160 MHz channels. Only newer devices can use it, its range is the shortest of the three bands, and how much of it is allowed varies by country.",
            hi: "**6 GHz** band (5.925-7.125 GHz) **Wi-Fi 6E** ke saath khula aur **Wi-Fi 7** bhi ise use karta hai. US mein yeh 1200 MHz jodta hai: 59 non-overlapping 20 MHz channels, ya saat 160 MHz channels. Ise sirf naye devices use kar sakte hain, teeno bands mein iski range sabse kam hai, aur kitna hissa allowed hai yeh desh ke hisaab se badalta hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Non-overlapping 2.4 GHz channels: **1, 6 and 11**. At 20 MHz, 5 GHz and 6 GHz channels do not overlap at all, which makes channel planning much easier there.",
            hi: "2.4 GHz ke non-overlapping channels: **1, 6 aur 11**. 20 MHz par 5 GHz aur 6 GHz ke channels bilkul overlap nahi karte, isliye wahan channel planning kaafi aasaan hai.",
          },
        },
      ],
    },
    {
      id: "standards",
      heading: { en: "802.11 standards and Wi-Fi generations", hi: "802.11 standards aur Wi-Fi generations" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Each 802.11 amendment added speed, a band, or both. The exam expects you to match a standard to its Wi-Fi name and its bands.",
            hi: "Har 802.11 amendment ne speed, band, ya dono add kiye. Exam expect karta hai ki tum standard ko uske Wi-Fi naam aur bands se match kar sako.",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Standard", hi: "Standard" },
            { en: "Wi-Fi name", hi: "Wi-Fi naam" },
            { en: "Bands", hi: "Bands" },
            { en: "Max data rate (theoretical)", hi: "Max data rate (theoretical)" },
          ],
          rows: [
            ["802.11", "-", "2.4 GHz", "2 Mbps"],
            ["802.11b", "-", "2.4 GHz", "11 Mbps"],
            ["802.11a", "-", "5 GHz", "54 Mbps"],
            ["802.11g", "-", "2.4 GHz", "54 Mbps"],
            ["802.11n", "Wi-Fi 4", "2.4 / 5 GHz", "600 Mbps"],
            ["802.11ac", "Wi-Fi 5", "5 GHz", "6.93 Gbps"],
            ["802.11ax", "Wi-Fi 6 / 6E", { en: "2.4 / 5 GHz (6E adds 6 GHz)", hi: "2.4 / 5 GHz (6E mein 6 GHz bhi)" }, "9.6 Gbps"],
            ["802.11be", "Wi-Fi 7", "2.4 / 5 / 6 GHz", { en: "about 46 Gbps", hi: "lagbhag 46 Gbps" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Nobody gets the maximum", hi: "Maximum kisi ko nahi milta" },
          text: {
            en: "The maximum rates assume the widest channels and the most antennas (spatial streams) the standard allows. A real client shares its channel, waits its turn and carries protocol overhead, so it gets far less.",
            hi: "Maximum rates tab milte hain jab standard ke sabse chaude channels aur sabse zyada antennas (spatial streams) use hon. Asli client channel share karta hai, apni baari ka wait karta hai aur protocol overhead bhi hota hai, isliye use kaafi kam speed milti hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "The numbered names start at Wi-Fi 4; 802.11a, b and g never got official numbers. Newer standards stay backward compatible within a band, so an 802.11ax AP can still serve an older 802.11n laptop.",
            hi: "Numbered naam Wi-Fi 4 se shuru hote hain; 802.11a, b aur g ko kabhi official number nahi mila. Naye standards apne band mein backward compatible rehte hain, isliye 802.11ax AP purane 802.11n laptop ko bhi serve kar sakta hai.",
          },
        },
      ],
    },
    {
      id: "service-sets",
      heading: { en: "SSID, BSS, ESS and roaming", hi: "SSID, BSS, ESS aur roaming" },
      blocks: [
        {
          type: "p",
          text: {
            en: "802.11 groups devices into **service sets**. The names sound alike, so learn them against one example: SSID `Office` on AP1, AP2 and AP3, all cabled to SW1 in VLAN 20, as in the animation.",
            hi: "802.11 devices ko **service sets** mein group karta hai. Naam milte-julte lagte hain, isliye inhe ek hi example se seekho: SSID `Office` AP1, AP2 aur AP3 par, teeno VLAN 20 mein SW1 se cable se jude, jaise animation mein hai.",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Term", hi: "Term" },
            { en: "What it is", hi: "Kya hai" },
            { en: "In the example", hi: "Example mein" },
          ],
          rows: [
            [
              "SSID",
              { en: "The network name users see. Up to 32 characters, and not unique: many cafés use the same name.", hi: "Network ka naam jo users ko dikhta hai. 32 characters tak, aur unique nahi: kai cafés same naam use karte hain." },
              "Office",
            ],
            [
              "BSS",
              { en: "One AP and the clients associated with it. Clients talk only through the AP, even to each other.", hi: "Ek AP aur usse associated clients. Clients sirf AP ke through baat karte hain, aapas mein bhi." },
              { en: "AP1 with the phone and laptop", hi: "AP1, phone aur laptop ke saath" },
            ],
            [
              "BSSID",
              { en: "The MAC address that identifies one BSS, based on the AP radio's MAC. Each SSID on each radio gets its own BSSID.", hi: "Woh MAC address jo ek BSS ko identify karta hai, AP radio ke MAC par based. Har radio par har SSID ka apna BSSID hota hai." },
              "00a2.ee00.0101",
            ],
            [
              "BSA",
              { en: "The area a BSS covers, also called a cell.", hi: "Jitna area ek BSS cover karta hai, ise cell bhi kehte hain." },
              { en: "The floor around AP1", hi: "AP1 ke aas-paas ka floor" },
            ],
            [
              "DS",
              { en: "The distribution system: the wired network the APs connect to. Each SSID is mapped to a VLAN on it.", hi: "Distribution system: woh wired network jisse APs jude hain. Har SSID us par ek VLAN se mapped hota hai." },
              "SW1, VLAN 20",
            ],
            [
              "ESS",
              { en: "Two or more BSSs with the same SSID, joined by a DS, so clients can roam between them.", hi: "Same SSID wale do ya zyada BSS, DS se jude hue, taaki clients unke beech roam kar sakein." },
              "AP1 + AP2 + AP3, SSID Office",
            ],
            [
              "IBSS",
              { en: "Ad hoc: clients connect directly, with no AP. Small and temporary.", hi: "Ad hoc: clients bina AP ke seedha connect hote hain. Chhota aur temporary." },
              { en: "Two laptops sharing a file", hi: "Do laptops file share karte hue" },
            ],
            [
              "MBSS",
              { en: "Mesh: APs relay traffic to each other over radio; only the root APs are cabled.", hi: "Mesh: APs radio par ek doosre ka traffic aage badhate hain; sirf root APs cable se jude hote hain." },
              { en: "Outdoor campus coverage", hi: "Outdoor campus ka coverage" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "**Roaming** is a client moving from one BSS to another inside the same ESS. The client decides when: as its current AP fades, it sends a **reassociation request** to a stronger AP with the same SSID. Neighbouring cells should overlap by roughly 10-15 percent so the client never crosses a dead spot. If the SSID maps to the same VLAN on every AP, the client keeps its IP address, so most applications carry on as before.",
            hi: "**Roaming** matlab client ka same ESS ke andar ek BSS se doosre BSS mein jaana. Kab jaana hai, yeh client decide karta hai: jab current AP ka signal girta hai, woh same SSID wale strong AP ko **reassociation request** bhejta hai. Padosi cells lagbhag 10-15 percent overlap hone chahiye taaki client ko raaste mein koi dead spot na mile. Agar har AP par SSID same VLAN se mapped hai, toh client ka IP address wahi rehta hai, aur zyadatar applications pehle ki tarah chalti rehti hain.",
          },
        },
        {
          type: "cli",
          title: { en: "Which AP am I on? (Windows)", hi: "Main kis AP par hoon? (Windows)" },
          lines: [
            { prompt: "C:\\>", cmd: "netsh wlan show interfaces" },
            { out: "    SSID                   : Office" },
            {
              out: "    BSSID                  : 00:a2:ee:00:01:01",
              comment: { en: "The AP radio you are associated with; it changes when you roam", hi: "Jis AP radio se tum associated ho; roam karne par yeh badalta hai" },
            },
            {
              out: "    Network type           : Infrastructure",
              comment: { en: "Infrastructure means a BSS with an AP", hi: "Infrastructure ka matlab AP wala BSS" },
            },
            { out: "    Radio type             : 802.11ax" },
            { out: "    Authentication         : WPA2-Personal" },
            { out: "    Channel                : 1" },
            { out: "    Signal                 : 86%" },
          ],
          note: {
            en: "Windows writes MAC addresses with colons. Newer Windows 11 builds label the field `AP BSSID` and add a `Band` line. On Linux, `nmcli dev wifi list` shows the SSID, BSSID, channel and signal of every AP in range; on macOS, hold Option and click the Wi-Fi icon.",
            hi: "Windows MAC addresses ko colons ke saath likhta hai. Naye Windows 11 builds mein yeh field `AP BSSID` naam se dikhta hai aur ek `Band` line bhi aati hai. Linux par `nmcli dev wifi list` range ke har AP ka SSID, BSSID, channel aur signal dikhata hai; macOS par Option daba kar Wi-Fi icon par click karo.",
          },
        },
      ],
    },
    {
      id: "csma-ca",
      heading: { en: "Taking turns: CSMA/CA", hi: "Baari baari: CSMA/CA" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Half-duplex Ethernet on hubs used **CSMA/CD**: transmit, detect a collision on the wire, back off and retry. A radio cannot do that, because while it transmits its own signal drowns out everything else, and a collision happens at the receiver, not at the sender. So 802.11 uses **CSMA/CA (collision avoidance)**:",
            hi: "Hubs par half-duplex Ethernet **CSMA/CD** use karta tha: transmit karo, wire par collision detect karo, back off karo aur dobara bhejo. Radio aisa nahi kar sakta, kyunki transmit karte waqt uska apna signal baaki sab kuch dabaa deta hai, aur collision sender par nahi, receiver par hota hai. Isliye 802.11 **CSMA/CA (collision avoidance)** use karta hai:",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Listen.** The station checks that nobody is transmitting on the channel (carrier sense).",
              hi: "**Suno.** Station check karta hai ki channel par koi transmit toh nahi kar raha (carrier sense).",
            },
            {
              en: "**Wait a random backoff.** When a busy channel goes quiet, the station counts down a random number of time slots before sending, so two stations that were both waiting do not start together.",
              hi: "**Random backoff wait karo.** Busy channel free hote hi station bhejne se pehle random number of time slots ka countdown karta hai, taaki do waiting stations ek saath shuru na karein.",
            },
            {
              en: "**Transmit** when the countdown reaches zero. If another station starts first, it pauses its countdown until the channel is free again.",
              hi: "Countdown zero hote hi **transmit karo**. Agar koi doosra station pehle shuru kar de, toh woh apna countdown rok deta hai jab tak channel phir free na ho.",
            },
            {
              en: "**Wait for an ACK.** The receiver acknowledges every unicast frame. No ACK means the frame is assumed lost, and it is sent again.",
              hi: "**ACK ka wait karo.** Receiver har unicast frame ka acknowledgement bhejta hai. ACK nahi aaya matlab frame kho gaya maana jaata hai, aur woh dobara bheja jaata hai.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "A station can also reserve the channel first with **RTS/CTS** (Request to Send, Clear to Send). This helps when two clients cannot hear each other but both reach the AP, the **hidden node** problem: the AP's CTS tells both of them who has the channel.",
            hi: "Station pehle **RTS/CTS** (Request to Send, Clear to Send) se channel reserve bhi kar sakta hai. Yeh tab kaam aata hai jab do clients ek doosre ko sun nahi paate lekin dono AP tak pahunchte hain, yaani **hidden node** problem: AP ka CTS dono ko bata deta hai ki channel abhi kiske paas hai.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "A conference call on one line. Before speaking you listen for silence, then pause a random moment so you do not start at the same time as someone else. The listener says \"got it\" after each point; if you hear nothing, you repeat yourself.",
            hi: "Ek hi line par conference call socho. Bolne se pehle tum silence ka wait karte ho, phir ek random pal rukte ho taaki kisi aur ke saath ek hi time par shuru na karo. Sunne wala har point ke baad \"mil gaya\" bolta hai; kuch sunai na de toh tum apni baat dobara bolte ho.",
          },
        },
      ],
    },
    {
      id: "encryption-preview",
      heading: { en: "Encryption: a preview", hi: "Encryption: ek jhalak" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Because anyone in range can receive the frames, a WLAN needs **authentication** (who may join) and **encryption** (so captured frames are unreadable). You will study this properly in lesson 5.10; for now, know the names and which ones are safe:",
            hi: "Range mein koi bhi frames receive kar sakta hai, isliye WLAN ko **authentication** (kaun join kar sakta hai) aur **encryption** (taaki capture kiye gaye frames padhe na ja sakein) dono chahiye. Yeh detail mein lesson 5.10 mein padhoge; abhi bas naam aur kaunse safe hain yeh jaan lo:",
          },
        },
        {
          type: "list",
          items: [
            { en: "**WEP**: the original method. Broken; never use it.", hi: "**WEP**: original method. Toot chuka hai; kabhi use mat karo." },
            { en: "**WPA**: a stopgap using TKIP. Obsolete.", hi: "**WPA**: TKIP wala temporary fix. Ab obsolete hai." },
            { en: "**WPA2**: AES-based encryption (CCMP). Still very common.", hi: "**WPA2**: AES-based encryption (CCMP). Abhi bhi bahut common hai." },
            {
              en: "**WPA3**: the current standard, with stronger protection for passphrase networks (SAE). The 6 GHz band does not allow WPA2: secured networks there must use WPA3 (open guest networks use Enhanced Open instead).",
              hi: "**WPA3**: current standard, passphrase wale networks ke liye stronger protection (SAE) ke saath. 6 GHz band mein WPA2 allowed nahi hai: wahan secured networks ko WPA3 hi use karna padta hai (open guest networks ki jagah Enhanced Open use hota hai).",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Personal vs Enterprise", hi: "Personal vs Enterprise" },
          text: {
            en: "**Personal** mode uses one shared passphrase (PSK) for everyone, fine for a home or small office. **Enterprise** mode gives each user their own login through 802.1X and a RADIUS server, so one leaver does not force a new password on everyone.",
            hi: "**Personal** mode mein sab ke liye ek shared passphrase (PSK) hota hai, jo ghar ya chhote office ke liye theek hai. **Enterprise** mode mein 802.1X aur RADIUS server ke through har user ka apna login hota hai, taaki ek employee ke jaane par sabka password na badalna pade.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "SSID", def: { en: "Service Set Identifier: the network name a WLAN advertises, up to 32 characters.", hi: "Service Set Identifier: WLAN jo network naam advertise karta hai, 32 characters tak." } },
    { term: "BSSID", def: { en: "The MAC address that identifies one BSS, based on the AP radio's MAC.", hi: "Woh MAC address jo ek BSS ko identify karta hai, AP radio ke MAC par based." } },
    { term: "BSS", def: { en: "Basic Service Set: one AP and the clients associated with it.", hi: "Basic Service Set: ek AP aur usse associated clients." } },
    { term: "ESS", def: { en: "Extended Service Set: several BSSs sharing one SSID, joined by a wired distribution system.", hi: "Extended Service Set: ek SSID share karne wale kai BSS, jo wired distribution system se jude hain." } },
    { term: "IBSS", def: { en: "Independent BSS, or ad hoc network: clients talk directly with no AP.", hi: "Independent BSS, yaani ad hoc network: clients bina AP ke seedha baat karte hain." } },
    { term: "Distribution system (DS)", def: { en: "The wired network that APs bridge wireless traffic onto.", hi: "Woh wired network jis par APs wireless traffic ko bridge karte hain." } },
    { term: "CSMA/CA", def: { en: "Carrier Sense Multiple Access with Collision Avoidance: listen, random backoff, transmit, wait for an ACK.", hi: "Carrier Sense Multiple Access with Collision Avoidance: suno, random backoff, transmit karo, ACK ka wait karo." } },
    { term: "dBm", def: { en: "Power relative to 1 milliwatt; Wi-Fi signal readings are negative, and closer to zero is stronger.", hi: "1 milliwatt ke relative power; Wi-Fi signal readings negative hoti hain, aur zero ke jitna paas utna strong." } },
  ],
  commands: [
    { cmd: "netsh wlan show interfaces", mode: "Windows command prompt", does: { en: "Show the SSID, BSSID, channel and signal of the current Wi-Fi connection", hi: "Current Wi-Fi connection ka SSID, BSSID, channel aur signal dikhata hai" } },
    { cmd: "netsh wlan show networks mode=bssid", mode: "Windows command prompt", does: { en: "List every nearby SSID with its BSSIDs, channels and signal", hi: "Aas-paas ke har SSID ko uske BSSIDs, channels aur signal ke saath list karta hai" } },
    { cmd: "nmcli dev wifi list", mode: "Linux terminal", does: { en: "List nearby APs with SSID, BSSID, channel and signal", hi: "Aas-paas ke APs ko SSID, BSSID, channel aur signal ke saath list karta hai" } },
  ],
  mistakes: [
    {
      en: "Choosing 2.4 GHz channels such as 1, 3 and 5 because the numbers differ. Channels must be 25 MHz (five channel numbers) apart to avoid overlap: use 1, 6 and 11.",
      hi: "2.4 GHz mein 1, 3 aur 5 jaise channels chunna sirf isliye ki numbers alag hain. Overlap se bachne ke liye channels 25 MHz (paanch channel numbers) door hone chahiye: 1, 6 aur 11 use karo.",
    },
    {
      en: "Thinking the SSID identifies one AP. The SSID names the network; the BSSID identifies a specific AP radio. In an ESS, every AP shares the SSID and each has its own BSSID.",
      hi: "Yeh sochna ki SSID ek AP ko identify karta hai. SSID network ka naam hai; BSSID ek specific AP radio ko identify karta hai. ESS mein saare APs same SSID share karte hain aur har ek ka apna BSSID hota hai.",
    },
    {
      en: "Saying the AP decides when a client roams. The client decides, based on the signal it measures.",
      hi: "Yeh bolna ki client kab roam karega yeh AP decide karta hai. Client khud decide karta hai, jo signal woh measure karta hai uske basis par.",
    },
    {
      en: "Mixing up CSMA/CA and CSMA/CD. Wi-Fi avoids collisions (CA) because it cannot detect them; half-duplex wired Ethernet detects them (CD).",
      hi: "CSMA/CA aur CSMA/CD ko mix karna. Wi-Fi collisions avoid karta hai (CA) kyunki woh unhe detect nahi kar sakta; half-duplex wired Ethernet unhe detect karta hai (CD).",
    },
    {
      en: "Assuming 5 GHz always beats 2.4 GHz. 5 GHz has more channels and less interference, but shorter range and weaker wall penetration.",
      hi: "Yeh maan lena ki 5 GHz hamesha 2.4 GHz se better hai. 5 GHz mein zyada channels aur kam interference hai, lekin range kam hai aur deewaron ke paar kamzor jaata hai.",
    },
    {
      en: "Confusing 802.11ac and 802.11ax. ac is Wi-Fi 5 and uses 5 GHz only; ax is Wi-Fi 6 on 2.4 and 5 GHz, and Wi-Fi 6E adds 6 GHz.",
      hi: "802.11ac aur 802.11ax mein confuse hona. ac Wi-Fi 5 hai aur sirf 5 GHz use karta hai; ax Wi-Fi 6 hai jo 2.4 aur 5 GHz par chalta hai, aur Wi-Fi 6E mein 6 GHz bhi judta hai.",
    },
  ],
  recap: [
    { en: "Wi-Fi is a shared, half-duplex medium: stations use CSMA/CA, and every unicast frame is ACKed.", hi: "Wi-Fi shared, half-duplex medium hai: stations CSMA/CA use karte hain, aur har unicast frame ka ACK aata hai." },
    {
      en: "Amplitude is strength, frequency is cycles per second, and wavelength shrinks as frequency rises. Absorption, reflection, refraction, diffraction and scattering change the signal on its way.",
      hi: "Amplitude strength hai, frequency ek second ke cycles, aur frequency badhne par wavelength chhoti hoti hai. Absorption, reflection, refraction, diffraction aur scattering raaste mein signal ko badalte hain.",
    },
    { en: "2.4 GHz: use channels 1, 6 and 11. 5 and 6 GHz: many non-overlapping channels, shorter range.", hi: "2.4 GHz: channels 1, 6 aur 11 use karo. 5 aur 6 GHz: bahut saare non-overlapping channels, lekin range kam." },
    { en: "n = Wi-Fi 4 (2.4/5), ac = Wi-Fi 5 (5), ax = Wi-Fi 6 (2.4/5) and 6E (adds 6), be = Wi-Fi 7 (2.4/5/6).", hi: "n = Wi-Fi 4 (2.4/5), ac = Wi-Fi 5 (5), ax = Wi-Fi 6 (2.4/5) aur 6E (6 bhi), be = Wi-Fi 7 (2.4/5/6)." },
    {
      en: "SSID = network name, BSSID = AP radio MAC, BSS = one AP's cell, ESS = several BSSs with one SSID over a DS, IBSS = ad hoc.",
      hi: "SSID = network ka naam, BSSID = AP radio ka MAC, BSS = ek AP ka cell, ESS = DS se jude ek SSID wale kai BSS, IBSS = ad hoc.",
    },
    { en: "Roaming = reassociating to a new BSSID in the same ESS; the same VLAN means the same IP address.", hi: "Roaming = same ESS mein naye BSSID se reassociate karna; same VLAN matlab same IP address." },
  ],
  quiz: [
    {
      q: {
        en: "You are placing three 2.4 GHz APs whose cells overlap. Which channel set avoids overlapping channels?",
        hi: "Tum teen 2.4 GHz APs laga rahe ho jinke cells overlap karte hain. Kaunse channels ka set overlapping channels se bachata hai?",
      },
      options: [
        { en: "1, 3 and 5", hi: "1, 3 aur 5" },
        { en: "1, 6 and 11", hi: "1, 6 aur 11" },
        { en: "1, 4 and 7", hi: "1, 4 aur 7" },
        { en: "2, 5 and 8", hi: "2, 5 aur 8" },
      ],
      answer: 1,
      explain: {
        en: "2.4 GHz channel centres are 5 MHz apart and each channel is about 22 MHz wide, so channels need to be five numbers (25 MHz) apart. Only 1, 6 and 11 manage that; the other sets are 10-15 MHz apart and overlap.",
        hi: "2.4 GHz channel centres 5 MHz door hote hain aur har channel lagbhag 22 MHz chauda hai, isliye channels ko paanch number (25 MHz) door hona chahiye. Aisa sirf 1, 6 aur 11 mein hai; baaki sets 10-15 MHz door hain aur overlap karte hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Which standard is branded Wi-Fi 5 and operates only in the 5 GHz band?",
        hi: "Kaunsa standard Wi-Fi 5 kehlata hai aur sirf 5 GHz band mein chalta hai?",
      },
      options: [
        { en: "802.11n", hi: "802.11n" },
        { en: "802.11ax", hi: "802.11ax" },
        { en: "802.11a", hi: "802.11a" },
        { en: "802.11ac", hi: "802.11ac" },
      ],
      answer: 3,
      explain: {
        en: "802.11ac is Wi-Fi 5 and is 5 GHz only. 802.11a is also 5 GHz only, but it has no Wi-Fi number. 802.11n (Wi-Fi 4) and 802.11ax (Wi-Fi 6) both work in 2.4 and 5 GHz.",
        hi: "802.11ac Wi-Fi 5 hai aur sirf 5 GHz par chalta hai. 802.11a bhi sirf 5 GHz hai, lekin uska koi Wi-Fi number nahi hai. 802.11n (Wi-Fi 4) aur 802.11ax (Wi-Fi 6) dono 2.4 aur 5 GHz mein kaam karte hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A user runs `netsh wlan show interfaces` at her desk, walks to a meeting room on another floor of the same office, and runs it again. The SSID is still `Office`. Which field shows that her laptop has roamed to a different AP?",
        hi: "Ek user apni desk par `netsh wlan show interfaces` chalati hai, phir same office ke doosre floor ke meeting room mein jaakar dobara chalati hai. SSID abhi bhi `Office` hai. Kaunsa field dikhata hai ki uska laptop doosre AP par roam kar gaya?",
      },
      options: [
        { en: "BSSID", hi: "BSSID" },
        { en: "SSID", hi: "SSID" },
        { en: "Network type", hi: "Network type" },
        { en: "Authentication", hi: "Authentication" },
      ],
      answer: 0,
      explain: {
        en: "The BSSID is the MAC of the AP radio the laptop is associated with, so it changes on every roam. The SSID, network type (Infrastructure) and authentication stay the same across the whole ESS.",
        hi: "BSSID us AP radio ka MAC hai jisse laptop associated hai, isliye har roam par yeh badalta hai. SSID, network type (Infrastructure) aur authentication poore ESS mein same rehte hain.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "Two laptops in a training room connect directly to each other over Wi-Fi to copy a file. There is no AP. What kind of service set is this?",
        hi: "Training room mein do laptops file copy karne ke liye Wi-Fi par seedha ek doosre se connect hote hain. Koi AP nahi hai. Yeh kaunsa service set hai?",
      },
      options: [
        { en: "BSS", hi: "BSS" },
        { en: "ESS", hi: "ESS" },
        { en: "IBSS", hi: "IBSS" },
        { en: "MBSS", hi: "MBSS" },
      ],
      answer: 2,
      explain: {
        en: "An IBSS (ad hoc network) has no AP; clients talk to each other directly. A BSS and an ESS are built around APs, and an MBSS is a mesh of APs.",
        hi: "IBSS (ad hoc network) mein koi AP nahi hota; clients seedha aapas mein baat karte hain. BSS aur ESS APs ke around bante hain, aur MBSS APs ka mesh hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Why does 802.11 use CSMA/CA instead of CSMA/CD?",
        hi: "802.11 CSMA/CD ki jagah CSMA/CA kyun use karta hai?",
      },
      options: [
        { en: "Wi-Fi is full duplex, so collisions cannot happen", hi: "Wi-Fi full duplex hai, isliye collisions ho hi nahi sakte" },
        { en: "CSMA/CA removes the need for acknowledgements", hi: "CSMA/CA se acknowledgements ki zaroorat khatam ho jaati hai" },
        { en: "CSMA/CD works only on fiber links", hi: "CSMA/CD sirf fiber links par kaam karta hai" },
        { en: "A radio cannot reliably detect a collision while it transmits, so it tries to avoid them and relies on ACKs", hi: "Transmit karte waqt radio collision reliably detect nahi kar sakta, isliye woh collisions avoid karta hai aur ACKs par bharosa karta hai" },
      ],
      answer: 3,
      explain: {
        en: "A transmitting radio's own signal drowns out other signals, and collisions happen at the receiver. So stations listen, wait a random backoff and treat a missing ACK as a lost frame. Wi-Fi is half duplex, and CSMA/CA depends on ACKs rather than removing them.",
        hi: "Transmit karte radio ka apna signal baaki signals ko dabaa deta hai, aur collision receiver par hota hai. Isliye stations sunte hain, random backoff wait karte hain, aur ACK na aaye toh frame ko lost maante hain. Wi-Fi half duplex hai, aur CSMA/CA ACKs hatata nahi, balki unhi par depend karta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An AP covers an empty conference hall well, but when the hall fills with 300 people the signal at the back drops sharply. Which RF behaviour mainly explains this?",
        hi: "Ek AP khaali conference hall ko achhe se cover karta hai, lekin jab hall mein 300 log bhar jaate hain toh peeche signal bahut gir jaata hai. Yeh mainly kaunse RF behaviour ki wajah se hai?",
      },
      options: [
        { en: "Reflection", hi: "Reflection" },
        { en: "Absorption", hi: "Absorption" },
        { en: "Refraction", hi: "Refraction" },
        { en: "Scattering", hi: "Scattering" },
      ],
      answer: 1,
      explain: {
        en: "Human bodies are mostly water, and water absorbs Wi-Fi energy and turns it into heat. Three hundred people absorb a lot of signal. Reflection is bouncing off surfaces such as metal, which people are not.",
        hi: "Insaan ka shareer zyadatar paani hai, aur paani Wi-Fi energy absorb karke heat bana deta hai. Teen sau log bahut saara signal absorb kar lete hain. Reflection metal jaisi surfaces se takra kar lautna hai, aur log metal nahi hain.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "zuYiktLqNYQ",
      title: "Free CCNA | Wireless Fundamentals | Day 55",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Covers RF properties and behaviours, bands and channels, 802.11 standards and service sets, matching this lesson closely.",
        hi: "RF properties aur behaviours, bands aur channels, 802.11 standards aur service sets cover karta hai, bilkul is lesson ki tarah.",
      },
    },
    {
      id: "Kh2-_og_JpY",
      title: "115. Free CCNA (NEW) | Wireless Networking - Wireless Channels & Bands",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "A Hindi walkthrough of the 2.4 and 5 GHz bands and why channels 1, 6 and 11 are used.",
        hi: "2.4 aur 5 GHz bands ka Hindi walkthrough, aur channels 1, 6 aur 11 kyun use hote hain.",
      },
    },
    {
      id: "Y1GXv17NFbk",
      title: "114. Free CCNA (NEW) | Wireless Networking - Wireless Topologies",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "Explains BSS, ESS and IBSS in Hindi.",
        hi: "BSS, ESS aur IBSS ko Hindi mein samjhata hai.",
      },
    },
  ],
  lab: {
    title: { en: "Survey the Wi-Fi around you", hi: "Apne aas-paas ka Wi-Fi survey karo" },
    steps: [
      {
        en: "On a Windows laptop run `netsh wlan show interfaces` and note the SSID, BSSID, radio type, channel and signal. On Linux use `nmcli dev wifi list`; on macOS hold Option and click the Wi-Fi icon. If Windows asks for location permission, turn on Location services first.",
        hi: "Windows laptop par `netsh wlan show interfaces` chalao aur SSID, BSSID, radio type, channel aur signal note karo. Linux par `nmcli dev wifi list` use karo; macOS par Option daba kar Wi-Fi icon par click karo. Agar Windows location permission maange, toh pehle Location services on karo.",
      },
      {
        en: "Run `netsh wlan show networks mode=bssid` to list every AP in range. Which SSIDs appear with more than one BSSID? Those are ESSs, or APs with more than one radio.",
        hi: "Range ke har AP ko list karne ke liye `netsh wlan show networks mode=bssid` chalao. Kaunse SSIDs ek se zyada BSSID ke saath dikhte hain? Woh ESS hain, ya aise APs jinme ek se zyada radio hain.",
      },
      {
        en: "Look at the 2.4 GHz entries. Are they all on 1, 6 or 11? An AP on an in-between channel such as 3 or 9 overlaps its neighbours on 1, 6 or 11 and causes adjacent-channel interference.",
        hi: "2.4 GHz wali entries dekho. Kya sab 1, 6 ya 11 par hain? 3 ya 9 jaise beech ke channel par laga AP, 1, 6 ya 11 wale padosiyon se overlap karta hai aur adjacent-channel interference paida karta hai.",
      },
      {
        en: "Walk to another room or floor and run `netsh wlan show interfaces` again. If the BSSID changed but the SSID did not, you roamed inside an ESS. Run `ipconfig` and check whether your IP address stayed the same.",
        hi: "Doosre room ya floor par jaakar `netsh wlan show interfaces` dobara chalao. BSSID badla lekin SSID nahi, toh tum ESS ke andar roam kar gaye. `ipconfig` chalao aur check karo ki IP address same raha ya nahi.",
      },
      {
        en: "Put a thick wall or a closed metal cabinet between you and the AP and compare the Signal value. You are seeing absorption and reflection at work.",
        hi: "Apne aur AP ke beech ek moti deewar ya band metal cabinet rakho aur Signal value compare karo. Yahi absorption aur reflection ka asar hai.",
      },
    ],
  },
};

export default lesson;
