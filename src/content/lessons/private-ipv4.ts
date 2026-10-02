import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "private-ipv4",
  intro: {
    en: "IPv4 has about 4.3 billion addresses, far fewer than the devices now online. Private ranges let every home and company reuse the same addresses inside, while the router at the edge translates to a public address. You also need to recognise a handful of special addresses, such as 127.0.0.1 and 169.254.x.x, because each one tells you what a device is doing or what has gone wrong.",
    hi: "IPv4 mein lagbhag 4.3 billion addresses hain, jo aaj online devices se kaafi kam hain. Private ranges ki wajah se har ghar aur company andar same addresses reuse kar sakti hai, aur edge par router unhe public address mein translate karta hai. Saath hi kuch special addresses pehchanna zaroori hai, jaise 127.0.0.1 aur 169.254.x.x, kyunki har ek batata hai ki device kya kar raha hai ya kya gadbad hui hai.",
  },
  outcomes: [
    { en: "List the three RFC 1918 ranges with their prefixes and first and last addresses", hi: "RFC 1918 ki teeno ranges unke prefix aur first/last address ke saath bata sako" },
    { en: "Classify any IPv4 address as private, public or special-purpose", hi: "Kisi bhi IPv4 address ko private, public ya special-purpose mein classify kar sako" },
    { en: "Explain why private addresses are not routed on the internet and why NAT is needed at the edge", hi: "Samjha sako ki private addresses internet par route kyun nahi hote aur edge par NAT kyun chahiye" },
    { en: "Recognise loopback, link-local (APIPA), 0.0.0.0 and 255.255.255.255, and say what each means when you see it", hi: "Loopback, link-local (APIPA), 0.0.0.0 aur 255.255.255.255 pehchaan sako, aur bata sako ki dikhne par inka kya matlab hai" },
    { en: "Recognise the shared (CGNAT) and documentation ranges you meet in real networks and in this course", hi: "Shared (CGNAT) aur documentation ranges pehchaan sako jo real networks aur is course mein milti hain" },
  ],
  sections: [
    {
      id: "why-private",
      heading: { en: "Why private addresses exist", hi: "Private addresses kyun bane" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The last lesson showed that 32 bits give 4,294,967,296 addresses. Take away multicast, class E and the other reserved ranges and about 3.7 billion are left for public use, in a world with more mobile connections than people. IANA handed its last free blocks to the regional registries in 2011, and APNIC, which serves India and the rest of Asia-Pacific, reached its final block the same year.",
            hi: "Pichhle lesson mein dekha ki 32 bits se 4,294,967,296 addresses bante hain. Multicast, class E aur baaki reserved ranges hata do toh public use ke liye lagbhag 3.7 billion bachte hain, aur duniya mein mobile connections logon se bhi zyada hain. IANA ne apne aakhri free blocks 2011 mein regional registries ko de diye, aur APNIC, jo India aur baaki Asia-Pacific ko serve karta hai, usi saal apne final block tak pahunch gaya.",
          },
        },
        {
          type: "p",
          text: {
            en: "There were two answers. The long-term one is IPv6 (lesson 1.8). The one that kept IPv4 alive is **private addressing** (RFC 1918, 1996) combined with **NAT**: an organisation uses private addresses inside, and only the router at its edge needs a public one.",
            hi: "Iske do jawab the. Long-term jawab IPv6 hai (lesson 1.8). Jisne IPv4 ko zinda rakha, woh hai **private addressing** (RFC 1918, 1996) aur uske saath **NAT**: organisation andar private addresses use karti hai, aur sirf edge wale router ko public address chahiye hota hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Public vs private", hi: "Public vs private" },
          columns: [
            { en: "Question", hi: "Sawaal" },
            { en: "Public address", hi: "Public address" },
            { en: "Private address", hi: "Private address" },
          ],
          rows: [
            [
              { en: "Who gives it out?", hi: "Kaun deta hai?" },
              { en: "IANA → regional registry (APNIC for India) → your ISP", hi: "IANA → regional registry (India ke liye APNIC) → tumhara ISP" },
              { en: "You choose it yourself; no permission needed", hi: "Tum khud chunte ho; kisi permission ki zaroorat nahi" },
            ],
            [
              { en: "Unique?", hi: "Unique hai?" },
              { en: "Yes, worldwide", hi: "Haan, poori duniya mein" },
              { en: "Only inside your own network", hi: "Sirf tumhare apne network ke andar" },
            ],
            [
              { en: "Routed on the internet?", hi: "Internet par route hota hai?" },
              { en: "Yes", hi: "Haan" },
              { en: "No: internet routers carry no routes for it, and ISPs filter it", hi: "Nahi: internet routers ke paas iska route nahi hota, aur ISPs ise filter karte hain" },
            ],
            [
              { en: "Typical place", hi: "Aam taur par kahan" },
              { en: "Router WAN interfaces, public web servers", hi: "Router ke WAN interfaces, public web servers" },
              { en: "PCs, phones, printers and servers inside homes and companies", hi: "Ghar aur company ke andar ke PCs, phones, printers aur servers" },
            ],
          ],
        },
      ],
    },
    {
      id: "rfc1918-ranges",
      heading: { en: "The three RFC 1918 ranges", hi: "RFC 1918 ki teen ranges" },
      blocks: [
        {
          type: "table",
          caption: { en: "Memorise these three", hi: "Yeh teeno yaad karo" },
          columns: [
            { en: "Prefix", hi: "Prefix" },
            { en: "Range", hi: "Range" },
            { en: "Addresses", hi: "Addresses" },
            { en: "In old class terms", hi: "Purani class ke hisaab se" },
            { en: "Where you see it", hi: "Kahan dikhta hai" },
          ],
          rows: [
            [
              "10.0.0.0/8",
              "10.0.0.0 – 10.255.255.255",
              "16,777,216",
              { en: "One class A network", hi: "Ek class A network" },
              { en: "Large companies, data centres", hi: "Badi companies, data centres" },
            ],
            [
              "172.16.0.0/12",
              "172.16.0.0 – 172.31.255.255",
              "1,048,576",
              { en: "16 class B networks", hi: "16 class B networks" },
              { en: "Company networks, cloud and container defaults", hi: "Company networks, cloud aur container ke defaults" },
            ],
            [
              "192.168.0.0/16",
              "192.168.0.0 – 192.168.255.255",
              "65,536",
              { en: "256 class C networks", hi: "256 class C networks" },
              { en: "Home and small-office routers", hi: "Ghar aur chhote office ke routers" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Why /12 for the middle range? The first 12 bits are fixed: all of 172 (`10101100`) and the first four bits of the second octet (`0001`). The last four bits of that octet are free, so it runs from `00010000` = 16 to `00011111` = 31. That makes 172.16.x.x to 172.31.x.x private, and 172.32.0.0 is already public.",
            hi: "Beech wali range /12 kyun hai? Pehle 12 bits fixed hain: poora 172 (`10101100`) aur second octet ke pehle chaar bits (`0001`). Us octet ke aakhri chaar bits free hain, isliye woh `00010000` = 16 se `00011111` = 31 tak jaata hai. Matlab 172.16.x.x se 172.31.x.x private hain, aur 172.32.0.0 se public shuru ho jaata hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The edges are the trap", hi: "Trap edges par hai" },
          text: {
            en: "172.15.1.1 and 172.32.1.1 are public. So are 192.169.1.1 and 11.1.1.1. Only 10.x.x.x, 172.16.x.x to 172.31.x.x, and 192.168.x.x are private.",
            hi: "172.15.1.1 aur 172.32.1.1 public hain. 192.169.1.1 aur 11.1.1.1 bhi public hain. Private sirf 10.x.x.x, 172.16.x.x se 172.31.x.x, aur 192.168.x.x hain.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Know all three ranges with their prefixes. A typical question lists four addresses and asks which one is private, with the wrong options sitting just outside a range.",
            hi: "Teeno ranges prefix ke saath yaad rakho. Aam question mein chaar addresses hote hain aur poocha jaata hai kaunsa private hai, aur galat options kisi range ke theek bahar hote hain.",
          },
        },
      ],
    },
    {
      id: "private-stays-inside",
      heading: { en: "Private inside, public outside: NAT", hi: "Andar private, bahar public: NAT" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Millions of networks use 192.168.1.0/24 at the same time, so an internet router cannot know which one a packet for 192.168.1.10 belongs to. Private ranges are therefore never advertised on the internet, and ISPs filter packets that carry them. A host with a private address can still reach the web because its router translates the address at the edge. That is **NAT (Network Address Translation)**, and the animation follows it step by step:",
            hi: "Laakhon networks ek saath 192.168.1.0/24 use karte hain, toh internet router ko pata hi nahi chal sakta ki 192.168.1.10 wala packet kis network ka hai. Isliye private ranges internet par kabhi advertise nahi hoti, aur ISPs aise packets filter karte hain. Private address wala host phir bhi web tak pahunchta hai kyunki uska router edge par address translate kar deta hai. Isi ko **NAT (Network Address Translation)** kehte hain, aur animation ise step by step dikhata hai:",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "Laptop-A (192.168.1.10) sends a packet to 198.51.100.80. The destination is not local, so the packet goes to the default gateway, Home-A.",
              hi: "Laptop-A (192.168.1.10) 198.51.100.80 ko packet bhejta hai. Destination local nahi hai, isliye packet default gateway, yaani Home-A ke paas jaata hai.",
            },
            {
              en: "Home-A replaces the source 192.168.1.10 with its public address 203.0.113.10 and writes the pair into its NAT table.",
              hi: "Home-A source 192.168.1.10 ko apne public address 203.0.113.10 se badal deta hai aur yeh jodi apni NAT table mein likh leta hai.",
            },
            {
              en: "The server replies to 203.0.113.10, which every internet router can reach.",
              hi: "Server 203.0.113.10 ko reply karta hai, jise har internet router reach kar sakta hai.",
            },
            {
              en: "Home-A finds 203.0.113.10 in its NAT table, changes the destination back to 192.168.1.10 and delivers the reply on the LAN.",
              hi: "Home-A apni NAT table mein 203.0.113.10 dhoondhta hai, destination wapas 192.168.1.10 karta hai aur reply LAN par deliver kar deta hai.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "PC-B in another home can have the very same 192.168.1.10. Its router translates to a different public address, 203.0.113.20, so nothing clashes on the internet.",
            hi: "Doosre ghar ka PC-B bhi bilkul yahi 192.168.1.10 rakh sakta hai. Uska router ise ek alag public address, 203.0.113.20, mein translate karta hai, isliye internet par koi clash nahi hota.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Preview: PAT", hi: "Preview: PAT" },
          text: {
            en: "A home router has one public address for every device in the house, so it also tracks port numbers to tell the conversations apart. That form of NAT is called **PAT** (NAT overload). Lesson 4.3 covers static NAT, dynamic NAT and PAT with Cisco configuration.",
            hi: "Ghar ke router ke paas saare devices ke liye ek hi public address hota hai, isliye woh conversations ko alag pehchanne ke liye port numbers bhi track karta hai. NAT ke is form ko **PAT** (NAT overload) kehte hain. Lesson 4.3 mein static NAT, dynamic NAT aur PAT, Cisco configuration ke saath, cover honge.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Overlap bites when networks join", hi: "Networks judte hi overlap problem banta hai" },
          text: {
            en: "Reusing a private range is only safe while the networks never route to each other. When two companies merge, or you build a VPN from a home on 192.168.1.0/24 into an office that also uses 192.168.1.0/24, the routers can no longer tell the two apart. Choosing a less common block, such as a random /24 inside 10.0.0.0/8, avoids most of this.",
            hi: "Private range reuse karna tab tak safe hai jab tak networks ek doosre ko route nahi karte. Jab do companies merge hoti hain, ya tum 192.168.1.0/24 wale ghar se aise office tak VPN banate ho jo khud 192.168.1.0/24 use karta hai, toh routers dono ko alag pehchaan nahi paate. Kam common block chunoge, jaise 10.0.0.0/8 ke andar koi random /24, toh yeh problem zyadatar nahi aati.",
          },
        },
      ],
    },
    {
      id: "special-addresses",
      heading: { en: "Special addresses you must recognise", hi: "Special addresses jo pehchanne zaroori hain" },
      blocks: [
        {
          type: "table",
          columns: [
            { en: "Address", hi: "Address" },
            { en: "Name", hi: "Naam" },
            { en: "What it tells you", hi: "Yeh kya batata hai" },
          ],
          rows: [
            [
              "127.0.0.0/8 (usually 127.0.0.1)",
              "Loopback",
              {
                en: "Traffic never leaves the host. A successful `ping 127.0.0.1` proves only that the host's own TCP/IP stack works.",
                hi: "Traffic host se bahar nikalta hi nahi. `ping 127.0.0.1` successful hai toh sirf itna pakka hai ki host ka apna TCP/IP stack chal raha hai.",
              },
            ],
            [
              "169.254.0.0/16",
              "Link-local (APIPA)",
              {
                en: "The host asked for DHCP, got no answer and gave itself an address. It works only on the local link, so it points to a DHCP problem.",
                hi: "Host ne DHCP se address maanga, jawab nahi mila, toh usne khud ko address de diya. Yeh sirf local link par kaam karta hai, isliye yeh DHCP problem ki taraf ishaara hai.",
              },
            ],
            [
              "0.0.0.0",
              { en: "Unspecified", hi: "Unspecified" },
              {
                en: "\"No address yet\" or \"any\". A DHCP client uses it as its source before it has an address, and 0.0.0.0/0 in a routing table matches every destination (the default route).",
                hi: "\"Abhi koi address nahi\" ya \"koi bhi\". DHCP client address milne se pehle ise source ki tarah use karta hai, aur routing table mein 0.0.0.0/0 har destination se match karta hai (default route).",
              },
            ],
            [
              "255.255.255.255",
              "Limited broadcast",
              {
                en: "Every host on the local network. Routers never forward it. A DHCP client sends its first message here.",
                hi: "Local network ka har host. Router ise kabhi forward nahi karte. DHCP client apna pehla message yahin bhejta hai.",
              },
            ],
            [
              "224.0.0.0/4",
              { en: "Multicast (class D)", hi: "Multicast (class D)" },
              {
                en: "A group destination, never a host's own address. OSPF, for example, uses 224.0.0.5 and 224.0.0.6.",
                hi: "Ek group destination, kabhi kisi host ka apna address nahi. Jaise OSPF 224.0.0.5 aur 224.0.0.6 use karta hai.",
              },
            ],
            [
              "100.64.0.0/10",
              { en: "Shared address space (CGNAT)", hi: "Shared address space (CGNAT)" },
              {
                en: "Beyond the CCNA. If your home router's outside address is between 100.64.0.0 and 100.127.255.255, your ISP is doing a second NAT (carrier-grade NAT) inside its own network.",
                hi: "CCNA se aage ki baat. Agar tumhare home router ka outside address 100.64.0.0 aur 100.127.255.255 ke beech hai, toh tumhara ISP apne network ke andar ek aur NAT (carrier-grade NAT) kar raha hai.",
              },
            ],
            [
              "192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24",
              { en: "Documentation (TEST-NET)", hi: "Documentation (TEST-NET)" },
              {
                en: "Reserved for examples in books and manuals and never used on real networks. This course uses them for public addresses.",
                hi: "Books aur manuals ke examples ke liye reserved, real networks par kabhi use nahi hote. Yeh course public addresses ke liye inhi ko use karta hai.",
              },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Do not confuse the two broadcasts. `255.255.255.255` is the **limited broadcast**: it stays on the local network whatever the addressing. `192.168.1.255` is the **directed broadcast** of 192.168.1.0/24 from the last lesson: all host bits 1 in one specific network.",
            hi: "Dono broadcasts ko mix mat karna. `255.255.255.255` **limited broadcast** hai: addressing kuch bhi ho, yeh local network par hi rehta hai. `192.168.1.255` pichhle lesson wala 192.168.1.0/24 ka **directed broadcast** hai: ek khaas network mein saare host bits 1.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Troubleshooting clue", hi: "Troubleshooting clue" },
          text: {
            en: "A 169.254.x.x address in a troubleshooting question almost always means the host could not reach a DHCP server. Look at DHCP, or the path to it, before you look at routing.",
            hi: "Troubleshooting question mein 169.254.x.x address dikhe, toh lagbhag hamesha matlab hai ki host DHCP server tak nahi pahunch paaya. Routing dekhne se pehle DHCP, ya us tak ka path, check karo.",
          },
        },
      ],
    },
    {
      id: "classify-at-a-glance",
      heading: { en: "Classify it at a glance", hi: "Ek nazar mein classify karo" },
      blocks: [
        {
          type: "p",
          text: {
            en: "On a real host the address type is often the first clue. Here is a Windows PC that never heard back from DHCP:",
            hi: "Real host par address ka type aksar pehla clue hota hai. Yeh ek Windows PC hai jise DHCP se kabhi jawab nahi mila:",
          },
        },
        {
          type: "cli",
          title: { en: "APIPA on Windows", hi: "Windows par APIPA" },
          lines: [
            { prompt: "C:\\>", cmd: "ipconfig" },
            { out: "Ethernet adapter Ethernet:" },
            {
              out: "   Autoconfiguration IPv4 Address. . : 169.254.37.112",
              comment: { en: "169.254.x.x: DHCP did not answer", hi: "169.254.x.x: DHCP ne jawab nahi diya" },
            },
            { out: "   Subnet Mask . . . . . . . . . . . : 255.255.0.0" },
            {
              out: "   Default Gateway . . . . . . . . . :",
              comment: { en: "No gateway either, so nothing can leave the LAN", hi: "Gateway bhi nahi hai, toh kuch bhi LAN se bahar nahi ja sakta" },
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Practice: cover the right-hand columns and classify each address", hi: "Practice: right side ke columns dhak kar har address classify karo" },
          columns: [
            { en: "Address", hi: "Address" },
            { en: "Type", hi: "Type" },
            { en: "Why", hi: "Kyun" },
          ],
          rows: [
            ["10.200.1.1", { en: "Private", hi: "Private" }, { en: "Inside 10.0.0.0/8", hi: "10.0.0.0/8 ke andar" }],
            ["172.20.5.5", { en: "Private", hi: "Private" }, { en: "Second octet is 16–31", hi: "Second octet 16–31 ke beech" }],
            ["172.32.1.1", { en: "Public", hi: "Public" }, { en: "One past 172.31", hi: "172.31 ke theek baad" }],
            ["192.168.100.1", { en: "Private", hi: "Private" }, { en: "Inside 192.168.0.0/16", hi: "192.168.0.0/16 ke andar" }],
            ["192.169.1.1", { en: "Public", hi: "Public" }, { en: "Not 192.168", hi: "192.168 nahi hai" }],
            ["169.254.10.20", { en: "Link-local (APIPA)", hi: "Link-local (APIPA)" }, { en: "DHCP did not answer", hi: "DHCP ne jawab nahi diya" }],
            ["127.0.0.53", { en: "Loopback", hi: "Loopback" }, { en: "Anything in 127.0.0.0/8", hi: "127.0.0.0/8 mein kuch bhi" }],
            ["100.64.1.1", { en: "Shared (CGNAT)", hi: "Shared (CGNAT)" }, { en: "Inside 100.64.0.0/10", hi: "100.64.0.0/10 ke andar" }],
            ["8.8.8.8", { en: "Public", hi: "Public" }, { en: "Google's public DNS server", hi: "Google ka public DNS server" }],
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Public address", def: { en: "A globally unique IPv4 address, assigned through IANA, a regional registry and an ISP, and routable on the internet.", hi: "Poori duniya mein unique IPv4 address, jo IANA, regional registry aur ISP ke through milta hai, aur internet par route hota hai." } },
    { term: "Private address", def: { en: "An address from the RFC 1918 ranges that anyone may use inside their own network; it is not routed on the internet.", hi: "RFC 1918 ranges ka address jise koi bhi apne network ke andar use kar sakta hai; yeh internet par route nahi hota." } },
    { term: "RFC 1918", def: { en: "The standard that reserves 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16 for private use.", hi: "Woh standard jo 10.0.0.0/8, 172.16.0.0/12 aur 192.168.0.0/16 ko private use ke liye reserve karta hai." } },
    { term: "NAT", def: { en: "Network Address Translation: a router rewrites addresses in the IP header, typically private to public on the way out and back again for the reply.", hi: "Network Address Translation: router IP header ke addresses badalta hai, aam taur par bahar jaate waqt private se public aur reply par wapas." } },
    { term: "Loopback", def: { en: "127.0.0.0/8. Traffic sent to it stays inside the host, which makes it a test of the local TCP/IP stack.", hi: "127.0.0.0/8. Is par bheja gaya traffic host ke andar hi rehta hai, isliye yeh local TCP/IP stack ka test hai." } },
    { term: "APIPA", def: { en: "Automatic Private IP Addressing: a host that gets no DHCP reply gives itself a 169.254.x.x link-local address.", hi: "Automatic Private IP Addressing: jis host ko DHCP reply nahi milta, woh khud ko 169.254.x.x link-local address de deta hai." } },
    { term: "Limited broadcast", def: { en: "255.255.255.255: every host on the local network. Routers never forward it.", hi: "255.255.255.255: local network ka har host. Router ise kabhi forward nahi karte." } },
    { term: "CGNAT", def: { en: "Carrier-grade NAT: an ISP gives customers addresses from 100.64.0.0/10 and translates them to public addresses in its own network.", hi: "Carrier-grade NAT: ISP customers ko 100.64.0.0/10 se addresses deta hai aur apne network mein unhe public addresses mein translate karta hai." } },
  ],
  commands: [
    { cmd: "ipconfig", mode: "Windows command prompt", does: { en: "Show the host's IPv4 address, mask and default gateway", hi: "Host ka IPv4 address, mask aur default gateway dikhata hai" } },
    { cmd: "ip addr", mode: "Linux terminal", does: { en: "Show the host's addresses on every interface", hi: "Har interface par host ke addresses dikhata hai" } },
    { cmd: "ifconfig", mode: "macOS terminal", does: { en: "Show the host's addresses on every interface", hi: "Har interface par host ke addresses dikhata hai" } },
    { cmd: "ping 127.0.0.1", mode: "Windows / macOS / Linux terminal", does: { en: "Test the host's own TCP/IP stack through loopback", hi: "Loopback ke through host ka apna TCP/IP stack test karta hai" } },
  ],
  mistakes: [
    {
      en: "Treating all of 172.x.x.x as private. Only 172.16.0.0 to 172.31.255.255 is; 172.15.1.1 and 172.32.1.1 are public.",
      hi: "Poore 172.x.x.x ko private maan lena. Sirf 172.16.0.0 se 172.31.255.255 private hai; 172.15.1.1 aur 172.32.1.1 public hain.",
    },
    {
      en: "Thinking a private address is a security feature. It only means the address is not routed on the internet; filtering traffic is the job of firewalls and ACLs.",
      hi: "Private address ko security feature samajhna. Iska matlab sirf itna hai ki address internet par route nahi hota; traffic filter karna firewalls aur ACLs ka kaam hai.",
    },
    {
      en: "Troubleshooting routing when a host shows 169.254.x.x. That address means DHCP never answered, so check the DHCP server and the path to it first.",
      hi: "Host par 169.254.x.x dikhe aur tum routing troubleshoot karne lago. Is address ka matlab hai DHCP ne kabhi jawab nahi diya, toh pehle DHCP server aur us tak ka path check karo.",
    },
    {
      en: "Reading a successful `ping 127.0.0.1` as proof that the network works. Loopback traffic never leaves the host, so it tests only the local TCP/IP stack.",
      hi: "`ping 127.0.0.1` successful hone ko network sahi hone ka saboot maan lena. Loopback traffic host se bahar jaata hi nahi, isliye yeh sirf local TCP/IP stack test karta hai.",
    },
    {
      en: "Mixing up 255.255.255.255 with a directed broadcast such as 192.168.1.255. The first always stays on the local network; the second means all hosts of one specific network.",
      hi: "255.255.255.255 ko 192.168.1.255 jaise directed broadcast se mix karna. Pehla hamesha local network par rehta hai; doosre ka matlab hai ek khaas network ke saare hosts.",
    },
    {
      en: "Assuming two sites that both use 192.168.1.0/24 will work once you join them with a VPN. Overlapping ranges break routing between them; renumber one side or translate with NAT.",
      hi: "Yeh maan lena ki dono sites 192.168.1.0/24 use karti hain phir bhi VPN se jodne par sab chalega. Overlapping ranges ke beech routing toot jaati hai; ek side ko renumber karo ya NAT se translate karo.",
    },
  ],
  recap: [
    { en: "RFC 1918 private ranges: 10.0.0.0/8, 172.16.0.0/12 (172.16 to 172.31) and 192.168.0.0/16.", hi: "RFC 1918 private ranges: 10.0.0.0/8, 172.16.0.0/12 (172.16 se 172.31 tak) aur 192.168.0.0/16." },
    { en: "Private addresses are reused everywhere, are never routed on the internet, and need NAT at the edge to get online.", hi: "Private addresses har jagah reuse hote hain, internet par kabhi route nahi hote, aur online jaane ke liye edge par NAT chahiye." },
    { en: "NAT swaps the private source for the router's public address and reverses it for the reply; home routers use PAT.", hi: "NAT private source ko router ke public address se badalta hai aur reply par ulta karta hai; home routers PAT use karte hain." },
    { en: "127.0.0.0/8 is loopback; 169.254.0.0/16 (APIPA) means the host got no DHCP answer.", hi: "127.0.0.0/8 loopback hai; 169.254.0.0/16 (APIPA) ka matlab host ko DHCP se jawab nahi mila." },
    { en: "0.0.0.0 means no address yet (or any, as 0.0.0.0/0); 255.255.255.255 is the limited broadcast that routers never forward.", hi: "0.0.0.0 ka matlab abhi koi address nahi (ya 0.0.0.0/0 mein koi bhi); 255.255.255.255 limited broadcast hai jise router kabhi forward nahi karte." },
    { en: "100.64.0.0/10 is CGNAT shared space; 192.0.2.0/24, 198.51.100.0/24 and 203.0.113.0/24 are for documentation only.", hi: "100.64.0.0/10 CGNAT ka shared space hai; 192.0.2.0/24, 198.51.100.0/24 aur 203.0.113.0/24 sirf documentation ke liye hain." },
  ],
  quiz: [
    {
      q: { en: "Which of these addresses is private?", hi: "Inme se kaunsa address private hai?" },
      options: [
        { en: "172.32.10.5", hi: "172.32.10.5" },
        { en: "192.169.1.1", hi: "192.169.1.1" },
        { en: "172.20.10.5", hi: "172.20.10.5" },
        { en: "11.0.0.1", hi: "11.0.0.1" },
      ],
      answer: 2,
      explain: {
        en: "172.16.0.0/12 runs from 172.16.0.0 to 172.31.255.255, so 172.20.10.5 is private. 172.32.10.5 is just past that range, 192.169.1.1 is not 192.168, and 11.0.0.1 is outside 10.0.0.0/8.",
        hi: "172.16.0.0/12 172.16.0.0 se 172.31.255.255 tak hai, isliye 172.20.10.5 private hai. 172.32.10.5 range ke theek bahar hai, 192.169.1.1 192.168 nahi hai, aur 11.0.0.1 10.0.0.0/8 ke bahar hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A Windows PC shows `Autoconfiguration IPv4 Address 169.254.23.7` with mask 255.255.0.0 and no default gateway. What is the most likely cause?",
        hi: "Ek Windows PC par `Autoconfiguration IPv4 Address 169.254.23.7`, mask 255.255.0.0 aur koi default gateway nahi dikhta. Sabse likely wajah kya hai?",
      },
      options: [
        { en: "The PC got no answer from a DHCP server", hi: "PC ko DHCP server se koi jawab nahi mila" },
        { en: "Someone typed the wrong static address", hi: "Kisi ne galat static address type kar diya" },
        { en: "The ISP is using carrier-grade NAT", hi: "ISP carrier-grade NAT use kar raha hai" },
        { en: "The DNS server is down", hi: "DNS server down hai" },
      ],
      answer: 0,
      explain: {
        en: "Windows gives itself a 169.254.x.x address (APIPA) when it asks for DHCP and nobody replies, and it labels it Autoconfiguration. CGNAT uses 100.64.0.0/10 on the router's outside, and DNS plays no part in getting an address.",
        hi: "Windows DHCP se address maangta hai aur koi reply nahi karta, tab woh khud ko 169.254.x.x (APIPA) de deta hai aur use Autoconfiguration label karta hai. CGNAT router ke outside par 100.64.0.0/10 use karta hai, aur address milne mein DNS ka koi role nahi hai.",
      },
      kind: "cli",
    },
    {
      q: { en: "Why can a packet addressed to 10.1.1.5 not be routed across the internet?", hi: "10.1.1.5 par addressed packet internet ke across route kyun nahi ho sakta?" },
      options: [
        { en: "Because 10.x is a class A address", hi: "Kyunki 10.x class A address hai" },
        { en: "Because its TTL is too low", hi: "Kyunki uska TTL bahut kam hai" },
        { en: "Because ISPs encrypt private addresses", hi: "Kyunki ISPs private addresses ko encrypt karte hain" },
        { en: "Because internet routers carry no routes for RFC 1918 ranges", hi: "Kyunki internet routers ke paas RFC 1918 ranges ke routes nahi hote" },
      ],
      answer: 3,
      explain: {
        en: "Thousands of networks use 10.1.1.5 at the same moment, so it cannot identify one host. Internet routers therefore carry no routes for private ranges, and ISPs filter them. Being class A has nothing to do with it; plenty of public addresses are class A.",
        hi: "Hazaaron networks ek hi waqt mein 10.1.1.5 use karte hain, toh yeh kisi ek host ko identify nahi kar sakta. Isliye internet routers ke paas private ranges ke routes nahi hote, aur ISPs inhe filter karte hain. Class A hone se iska koi lena-dena nahi; bahut saare public addresses bhi class A hain.",
      },
      kind: "concept",
    },
    {
      q: { en: "A user's `ping 127.0.0.1` succeeds. What does that prove?", hi: "User ka `ping 127.0.0.1` successful hai. Isse kya pakka hota hai?" },
      options: [
        { en: "The cable to the switch is connected", hi: "Switch tak cable connected hai" },
        { en: "The host's own TCP/IP stack is working", hi: "Host ka apna TCP/IP stack kaam kar raha hai" },
        { en: "The default gateway is reachable", hi: "Default gateway reachable hai" },
        { en: "DNS name resolution works", hi: "DNS name resolution kaam kar raha hai" },
      ],
      answer: 1,
      explain: {
        en: "Loopback traffic never leaves the host, so a reply proves only that the local TCP/IP software works. The same ping succeeds with the cable unplugged, so it says nothing about the switch, gateway or DNS.",
        hi: "Loopback traffic host se bahar nahi jaata, isliye reply sirf itna pakka karta hai ki local TCP/IP software chal raha hai. Cable nikaal do tab bhi yeh ping successful hoga, toh switch, gateway ya DNS ke baare mein yeh kuch nahi batata.",
      },
      kind: "concept",
    },
    {
      q: { en: "What is the last address of the private range 172.16.0.0/12?", hi: "Private range 172.16.0.0/12 ka aakhri address kya hai?" },
      options: [
        { en: "172.16.255.255", hi: "172.16.255.255" },
        { en: "172.32.255.255", hi: "172.32.255.255" },
        { en: "172.31.255.255", hi: "172.31.255.255" },
        { en: "172.255.255.255", hi: "172.255.255.255" },
      ],
      answer: 2,
      explain: {
        en: "/12 fixes all of 172 plus the first four bits of the second octet (0001). The last four bits of that octet can be 0000 to 1111, so the second octet runs from 16 to 31, and the last address is 172.31.255.255. 172.16.255.255 would be the end of a /16.",
        hi: "/12 poore 172 aur second octet ke pehle chaar bits (0001) ko fix karta hai. Us octet ke aakhri chaar bits 0000 se 1111 tak ho sakte hain, isliye second octet 16 se 31 tak jaata hai, aur aakhri address 172.31.255.255 hai. 172.16.255.255 toh /16 ka end hota.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "A laptop with no IP address yet sends its first DHCP message. Which source and destination IP addresses does that packet carry?",
        hi: "Ek laptop jiske paas abhi koi IP address nahi hai, apna pehla DHCP message bhejta hai. Us packet mein source aur destination IP kya honge?",
      },
      options: [
        { en: "Source 0.0.0.0, destination 255.255.255.255", hi: "Source 0.0.0.0, destination 255.255.255.255" },
        { en: "Source 169.254.1.1, destination 255.255.255.255", hi: "Source 169.254.1.1, destination 255.255.255.255" },
        { en: "Source 0.0.0.0, destination 192.168.1.255", hi: "Source 0.0.0.0, destination 192.168.1.255" },
        { en: "Source 127.0.0.1, destination 0.0.0.0", hi: "Source 127.0.0.1, destination 0.0.0.0" },
      ],
      answer: 0,
      explain: {
        en: "With no address yet, the client uses 0.0.0.0 as its source. It does not know which network it is on either, so it sends to the limited broadcast 255.255.255.255, which stays on the local network. The DHCP lesson (4.1) follows the rest of the exchange.",
        hi: "Abhi address nahi hai, toh client source mein 0.0.0.0 use karta hai. Use yeh bhi nahi pata ki woh kis network par hai, isliye woh limited broadcast 255.255.255.255 par bhejta hai, jo local network par hi rehta hai. Baaki exchange DHCP lesson (4.1) mein dekhoge.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "2TZCfTgopeg",
      title: "Free CCNA | NAT (Part 1) | Day 44",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Watch the first part, on the RFC 1918 private ranges and why they exist. The rest is NAT, which lesson 4.3 covers.",
        hi: "Pehla hissa dekho, jisme RFC 1918 private ranges aur unki zaroorat samjhayi gayi hai. Baaki NAT hai, jo lesson 4.3 mein aayega.",
      },
    },
    {
      id: "8bhvn9tQk8o",
      title: "we’re out of IP Addresses….but this saved us (Private IP Addresses)",
      channel: "NetworkChuck",
      lang: "en",
      note: { en: "A beginner-friendly look at why private addresses and NAT were needed.", hi: "Beginners ke liye: private addresses aur NAT ki zaroorat kyun padi." },
    },
    {
      id: "3wZvJfTmytI",
      title: "16. Free CCNA (NEW) | IP Addressing in Hindi - Private IP Addresses",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "The private ranges and public vs private addressing, in Hindi.", hi: "Private ranges aur public vs private addressing, Hindi mein." },
    },
    {
      id: "qD1V4Rupvhk",
      title: "14. Free CCNA (NEW) | IP Addressing in Hindi - Reserved IP Address",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "The reserved and special-purpose addresses, in Hindi.", hi: "Reserved aur special-purpose addresses, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Find private, public and special addresses on your own network", hi: "Apne network par private, public aur special addresses dhoondho" },
    steps: [
      {
        en: "On your own computer run `ipconfig` (Windows), `ip addr` (Linux) or `ifconfig` (macOS). Note your IPv4 address and default gateway. Which RFC 1918 range is the address in?",
        hi: "Apne computer par `ipconfig` (Windows), `ip addr` (Linux) ya `ifconfig` (macOS) chalao. Apna IPv4 address aur default gateway note karo. Address kaunsi RFC 1918 range mein hai?",
      },
      {
        en: "Open a \"what is my IP\" page in a browser. The address it shows is the public address your traffic is translated to, not the private one from step 1.",
        hi: "Browser mein koi \"what is my IP\" page kholo. Jo address dikhta hai woh public address hai jisme tumhara traffic translate hota hai, step 1 wala private address nahi.",
      },
      {
        en: "If you can log in to your home router, find its WAN (internet) address. If it is in 100.64.0.0/10, your ISP uses carrier-grade NAT; if it is private, another router sits in front of yours.",
        hi: "Agar home router mein login kar sakte ho, toh uska WAN (internet) address dhoondho. Agar woh 100.64.0.0/10 mein hai toh ISP carrier-grade NAT use karta hai; agar private hai toh tumhare router ke aage ek aur router baitha hai.",
      },
      {
        en: "Run `ping 127.0.0.1`, then turn off Wi-Fi (or unplug the cable) and run it again. It still succeeds, because loopback traffic never leaves the host.",
        hi: "`ping 127.0.0.1` chalao, phir Wi-Fi band karo (ya cable nikaalo) aur dobara chalao. Ab bhi successful hoga, kyunki loopback traffic host se bahar jaata hi nahi.",
      },
      {
        en: "In Packet Tracer, set a PC to DHCP on a LAN with no DHCP server. Watch it fall back to a 169.254.x.x address, and check it with `ipconfig` in the PC's Command Prompt.",
        hi: "Packet Tracer mein ek PC ko aise LAN par DHCP par set karo jahan koi DHCP server nahi hai. Dekho kaise woh 169.254.x.x address le leta hai, aur PC ke Command Prompt mein `ipconfig` se check karo.",
      },
      {
        en: "Cover the right-hand columns of the practice table in this lesson and classify all nine addresses from memory.",
        hi: "Is lesson ki practice table ke right side ke columns dhak do aur saare nau addresses yaad se classify karo.",
      },
    ],
  },
};

export default lesson;
