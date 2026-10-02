import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "ipv6-basics",
  intro: {
    en: "IPv4 has about 4.3 billion addresses, and the central pool of unused blocks ran out in 2011. Private addresses and NAT stretched what was left, at a price: NAT routers must track every connection, and hosts inside cannot be reached directly. IPv6 ends the shortage with 128-bit addresses. Before you can configure or troubleshoot it, you have to read, shorten and expand those long addresses without mistakes.",
    hi: "IPv4 mein lagbhag 4.3 billion addresses hain, aur unused blocks ka central pool 2011 mein hi khatam ho gaya tha. Private addresses aur NAT se kaam chalaya gaya, lekin iski keemat hai: NAT router ko har connection track karna padta hai, aur andar ke hosts tak bahar se seedha pahunch nahi sakte. IPv6 128-bit addresses se yeh kami khatam karta hai. Configure ya troubleshoot karne se pehle tumhe yeh lambe addresses padhna, chhota karna aur wapas expand karna bina galti ke aana chahiye.",
  },
  outcomes: [
    { en: "Explain why IPv6 was needed and why it does not need NAT", hi: "Samjha sako ki IPv6 ki zaroorat kyun padi aur ismein NAT kyun nahi chahiye" },
    { en: "Shorten a full IPv6 address to its shortest valid form with the two rules", hi: "Do rules se full IPv6 address ko uske sabse chhote valid form mein likh sako" },
    { en: "Expand a shortened address back to all 32 hex digits", hi: "Shortened address ko wapas poore 32 hex digits mein expand kar sako" },
    { en: "Spot invalid addresses, such as one with two ::", hi: "Invalid addresses pakad sako, jaise jismein do baar :: ho" },
    { en: "Find the network prefix of an address for /64, /56 or /48", hi: "/64, /56 ya /48 ke liye kisi address ka network prefix nikaal sako" },
    { en: "Configure and verify IPv6 addresses on a Cisco router", hi: "Cisco router par IPv6 addresses configure aur verify kar sako" },
  ],
  sections: [
    {
      id: "why-ipv6",
      heading: { en: "Why IPv6 exists", hi: "IPv6 kyun aaya" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An IPv4 address is 32 bits, so there are 2³² = 4,294,967,296 of them, about 4.3 billion. That sounded like plenty in 1981. Today there are phones, laptops, cameras, cars and millions of cloud servers. IANA handed out its last free IPv4 blocks in February 2011, and APNIC, the registry for India and the rest of Asia-Pacific, reached its final block two months later.",
            hi: "IPv4 address 32 bits ka hota hai, toh total 2³² = 4,294,967,296 addresses hain, yaani lagbhag 4.3 billion. 1981 mein yeh bahut lagta tha. Aaj phones, laptops, cameras, cars aur laakhon cloud servers hain. IANA ne apne aakhri free IPv4 blocks February 2011 mein de diye, aur APNIC, jo India aur baaki Asia-Pacific ki registry hai, do mahine baad apne last block tak pahunch gaya.",
          },
        },
        {
          type: "p",
          text: {
            en: "The internet kept going on workarounds. Private ranges (lesson 1.4) let a whole office use internal addresses, and NAT (lesson 4.3) lets them all share one public address. It works, but the NAT router has to track every connection, and nothing on the internet can start a connection to a host inside without extra configuration. Many ISPs now add a second layer of NAT of their own.",
            hi: "Internet workarounds par chalta raha. Private ranges (lesson 1.4) se poora office internal addresses use karta hai, aur NAT (lesson 4.3) un sabko ek public address share karne deta hai. Kaam chalta hai, lekin NAT router ko har connection track karna padta hai, aur internet ka koi device andar ke host se bina extra configuration ke khud connection shuru nahi kar sakta. Kai ISPs ab apni taraf se NAT ki ek aur layer laga dete hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "IPv6 uses **128-bit** addresses: 2¹²⁸ is about 3.4 × 10³⁸. That is enough for every device to get its own globally unique address, so NAT is not needed to save addresses. You still put a firewall at the edge to decide what may come in. Security comes from the firewall, not from NAT.",
            hi: "IPv6 mein **128-bit** addresses hain: 2¹²⁸ lagbhag 3.4 × 10³⁸ hota hai. Itne addresses hain ki har device ko apna globally unique address mil sakta hai, isliye addresses bachane ke liye NAT ki zaroorat nahi. Edge par firewall phir bhi lagate ho, jo decide karta hai ki andar kya aa sakta hai. Security firewall se aati hai, NAT se nahi.",
          },
        },
        {
          type: "table",
          caption: { en: "IPv4 and IPv6 side by side", hi: "IPv4 aur IPv6 aamne-saamne" },
          columns: [{ en: "Feature", hi: "Feature" }, "IPv4", "IPv6"],
          rows: [
            [{ en: "Address size", hi: "Address size" }, "32 bits", "128 bits"],
            [
              { en: "Written as", hi: "Kaise likhte hain" },
              { en: "4 decimal octets: 192.168.1.10", hi: "4 decimal octets: 192.168.1.10" },
              { en: "8 hex hextets: 2001:db8:1:1::10", hi: "8 hex hextets: 2001:db8:1:1::10" },
            ],
            [{ en: "Network part", hi: "Network part" }, { en: "Subnet mask or /prefix", hi: "Subnet mask ya /prefix" }, { en: "/prefix length only", hi: "Sirf /prefix length" }],
            [{ en: "Broadcast", hi: "Broadcast" }, { en: "Yes", hi: "Haan" }, { en: "None; multicast instead", hi: "Nahi hota; uski jagah multicast" }],
            [{ en: "Finding a neighbour's MAC", hi: "Neighbour ka MAC dhoondhna" }, "ARP", { en: "NDP (next lesson)", hi: "NDP (agla lesson)" }],
            [{ en: "Header", hi: "Header" }, { en: "20-60 bytes, has a checksum", hi: "20-60 bytes, checksum hota hai" }, { en: "Fixed 40 bytes, no checksum", hi: "Fixed 40 bytes, checksum nahi" }],
            [{ en: "Hop counter", hi: "Hop counter" }, "TTL", "Hop Limit"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "IPv4 and IPv6 run side by side", hi: "IPv4 aur IPv6 saath-saath chalte hain" },
          text: {
            en: "IPv6 is a separate protocol, not an upgrade of IPv4: an IPv4-only host cannot talk to an IPv6-only host directly. Most networks run **dual stack**, where every interface has both an IPv4 and an IPv6 address, and hosts prefer IPv6 when the destination has it. Large mobile networks, including in India, already run IPv6 at scale.",
            hi: "IPv6 ek alag protocol hai, IPv4 ka upgrade nahi: IPv4-only host IPv6-only host se seedha baat nahi kar sakta. Zyaadatar networks **dual stack** chalate hain, jismein har interface par IPv4 aur IPv6 dono addresses hote hain, aur destination ke paas IPv6 ho toh host IPv6 ko prefer karta hai. India samet bade mobile networks already bade scale par IPv6 chala rahe hain.",
          },
        },
      ],
    },
    {
      id: "writing-addresses",
      heading: { en: "128 bits, written in hex", hi: "128 bits, hex mein likhe hue" },
      blocks: [
        {
          type: "p",
          text: {
            en: "128 ones and zeros are impossible to read, so IPv6 addresses are written in hexadecimal (lesson 0.3). One hex digit is exactly 4 bits, so 128 bits are 32 hex digits. They are grouped into **8 hextets** of 4 digits (16 bits each), separated by colons.",
            hi: "128 ones aur zeros padhna namumkin hai, isliye IPv6 addresses hexadecimal mein likhte hain (lesson 0.3). Ek hex digit exactly 4 bits ka hota hai, toh 128 bits = 32 hex digits. Inhe 4-4 digits ke **8 hextets** mein group karte hain (har hextet 16 bits), beech mein colon lagta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Here is the address used in the animation, written out in full: `2001:0db8:0000:00a0:0000:0000:0000:0100`. Count them: 8 hextets, 32 digits. Take hextet 4, `00a0`, and write each digit as 4 bits:",
            hi: "Animation wala address, poora likha hua: `2001:0db8:0000:00a0:0000:0000:0000:0100`. Gino: 8 hextets, 32 digits. Hextet 4, yaani `00a0`, lo aur har digit ko 4 bits mein likho:",
          },
        },
        {
          type: "table",
          caption: { en: "Hextet 4 (00a0) is 16 bits", hi: "Hextet 4 (00a0) 16 bits ka hai" },
          columns: [{ en: "Hex digit", hi: "Hex digit" }, "0", "0", "a", "0"],
          rows: [["Bits", "0000", "0000", "1010", "0000"]],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Upper or lower case", hi: "Upper ya lower case" },
          text: {
            en: "The letters a-f can be written in either case: `2001:DB8::1` and `2001:db8::1` are the same address. RFC 5952 recommends lowercase when you write addresses, while Cisco IOS shows them in uppercase.",
            hi: "a-f letters kisi bhi case mein likh sakte ho: `2001:DB8::1` aur `2001:db8::1` same address hain. RFC 5952 likhte waqt lowercase recommend karta hai, jabki Cisco IOS output mein uppercase dikhata hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "The documentation prefix", hi: "Documentation prefix" },
          text: {
            en: "`2001:db8::/32` is reserved for examples and documentation, like `192.0.2.0/24` in IPv4. It is never routed on the internet, so books, exam questions and this course use it.",
            hi: "`2001:db8::/32` examples aur documentation ke liye reserved hai, jaise IPv4 mein `192.0.2.0/24`. Yeh internet par kabhi route nahi hota, isliye books, exam questions aur yeh course isi ko use karte hain.",
          },
        },
      ],
    },
    {
      id: "shortening",
      heading: { en: "Shortening: two rules", hi: "Shortening: do rules" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "**Rule 1: remove the leading zeros in every hextet.** `0db8` becomes `db8`, `00a0` becomes `a0`, `0100` becomes `100`, and `0000` becomes `0`. Only zeros at the front go. Zeros at the end carry value: `00a0` shortens to `a0`, never `a`.",
              hi: "**Rule 1: har hextet ke aage wale zeros hata do.** `0db8` ban jaata hai `db8`, `00a0` ban jaata hai `a0`, `0100` ban jaata hai `100`, aur `0000` ban jaata hai `0`. Sirf aage ke zeros hatte hain. Peeche ke zeros ki value hoti hai: `00a0` ka short form `a0` hai, `a` kabhi nahi.",
            },
            {
              en: "**Rule 2: replace one run of two or more all-zero hextets with `::`.** Choose the longest run. If two runs are equally long, compress the first one. `::` may appear only once in an address. These are the RFC 5952 rules for the recommended form. Using `::` for a single zero hextet is still a valid address, but not the recommended way to write it.",
              hi: "**Rule 2: do ya zyada lagataar all-zero hextets ke ek run ko `::` se replace karo.** Sabse lamba run chuno. Agar do runs barabar lambe hain, toh pehle wale ko compress karo. Ek address mein `::` sirf ek baar aa sakta hai. Yeh recommended form ke RFC 5952 wale rules hain. Akele zero hextet ke liye `::` lagao toh address phir bhi valid hai, bas recommended tarika nahi hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "The example, one rule at a time", hi: "Example, ek-ek rule karke" },
          columns: [{ en: "Step", hi: "Step" }, "Address"],
          rows: [
            [{ en: "Full form", hi: "Full form" }, "2001:0db8:0000:00a0:0000:0000:0000:0100"],
            [{ en: "After rule 1", hi: "Rule 1 ke baad" }, "2001:db8:0:a0:0:0:0:100"],
            [{ en: "After rule 2", hi: "Rule 2 ke baad" }, "2001:db8:0:a0::100"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Hextet 3 is also all zeros, but it is a run of one. The run of three (hextets 5 to 7) is longer, so it gets the `::` and hextet 3 stays as `0`.",
            hi: "Hextet 3 bhi all zeros hai, lekin woh sirf ek ka run hai. Teen ka run (hextets 5 se 7) lamba hai, isliye `::` use milta hai aur hextet 3 `0` hi rehta hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Why :: only once", hi: ":: sirf ek baar kyun" },
          text: {
            en: "Try `2001:db8::a0::100`. Four hextets are missing, and nobody can tell how they split between the two gaps: 1 + 3, 2 + 2 or 3 + 1. Those are three different addresses, so an address with two `::` is invalid, and IOS rejects it.",
            hi: "`2001:db8::a0::100` try karo. Chaar hextets gayab hain, aur koi nahi bata sakta ki woh dono gaps mein kaise bante: 1 + 3, 2 + 2 ya 3 + 1. Yeh teen alag addresses hain, isliye do `::` wala address invalid hai, aur IOS use reject kar deta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "More examples", hi: "Aur examples" },
          columns: [{ en: "Full form", hi: "Full form" }, { en: "Recommended short form", hi: "Recommended short form" }, { en: "Why", hi: "Kyun" }],
          rows: [
            ["fe80:0000:0000:0000:0211:22ff:fe33:4401", "fe80::211:22ff:fe33:4401", { en: "One run of three zero hextets", hi: "Teen zero hextets ka ek run" }],
            ["2001:0db8:0001:0001:0000:0000:0000:0001", "2001:db8:1:1::1", { en: "Leading zeros go; the run of three becomes ::", hi: "Leading zeros hate; teen ka run :: bana" }],
            ["2001:0db8:0000:0000:0001:0000:0000:0001", "2001:db8::1:0:0:1", { en: "Two runs of two tie, so the first is compressed", hi: "Do-do ke do runs barabar hain, toh pehla compress hota hai" }],
            ["2001:0db8:aaaa:0000:bbbb:cccc:dddd:eeee", "2001:db8:aaaa:0:bbbb:cccc:dddd:eeee", { en: "A single zero hextet is written 0. `2001:db8:aaaa::bbbb:cccc:dddd:eeee` is also valid, but not the recommended form", hi: "Akela zero hextet 0 likhte hain. `2001:db8:aaaa::bbbb:cccc:dddd:eeee` bhi valid hai, lekin recommended form nahi" }],
            ["0000:0000:0000:0000:0000:0000:0000:0001", "::1", { en: "The loopback address", hi: "Loopback address" }],
            ["0000:0000:0000:0000:0000:0000:0000:0000", "::", { en: "The unspecified address", hi: "Unspecified address" }],
          ],
        },
      ],
    },
    {
      id: "expanding",
      heading: { en: "Expanding back to the full form", hi: "Wapas full form mein expand karna" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "Count the hextets you can see. In `2001:db8:0:a0::100` there are 5: `2001`, `db8`, `0`, `a0`, `100`.",
              hi: "Jo hextets dikh rahe hain unhe gino. `2001:db8:0:a0::100` mein 5 hain: `2001`, `db8`, `0`, `a0`, `100`.",
            },
            {
              en: "The `::` stands for the missing ones: 8 − 5 = 3 hextets of `0000`.",
              hi: "`::` gayab hextets ki jagah hai: 8 − 5 = 3 hextets, sab `0000`.",
            },
            {
              en: "Pad every hextet with zeros on the left until it has 4 digits: `db8` → `0db8`, `a0` → `00a0`, `100` → `0100`.",
              hi: "Har hextet ke left mein zeros lagao jab tak 4 digits na ho jaayein: `db8` → `0db8`, `a0` → `00a0`, `100` → `0100`.",
            },
            {
              en: "Result: `2001:0db8:0000:00a0:0000:0000:0000:0100`. Check that you have exactly 8 hextets of 4 digits.",
              hi: "Result: `2001:0db8:0000:00a0:0000:0000:0000:0100`. Check karo ki exactly 8 hextets hain, har ek 4 digits ka.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "One more: `fe80::1` shows 2 hextets, so `::` hides 6. The full form is `fe80:0000:0000:0000:0000:0000:0000:0001`.",
            hi: "Ek aur: `fe80::1` mein 2 hextets dikhte hain, toh `::` 6 hextets chhupata hai. Full form hai `fe80:0000:0000:0000:0000:0000:0000:0001`.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "How the exam tests this", hi: "Exam ise kaise test karta hai" },
          text: {
            en: "Expect questions such as 'which is a valid short form of this address?' or 'which of these is invalid?'. Check three things: at most one `::`, no hextet longer than 4 digits, and exactly 8 hextets once expanded. Watch for trailing zeros that were wrongly removed.",
            hi: "Aise questions expect karo: 'is address ka valid short form kaunsa hai?' ya 'inmein se invalid kaunsa hai?'. Teen cheezein check karo: `::` zyada se zyada ek baar, koi hextet 4 digits se lamba nahi, aur expand karne par exactly 8 hextets. Galti se hataye gaye trailing zeros par nazar rakho.",
          },
        },
      ],
    },
    {
      id: "prefixes",
      heading: { en: "Prefix length: /64 for a LAN, /48 for a site", hi: "Prefix length: LAN ke liye /64, site ke liye /48" },
      blocks: [
        {
          type: "p",
          text: {
            en: "IPv6 has no dotted subnet masks. The network part is always written as a prefix length: `/64` means the first 64 bits are the **prefix** (the network) and the remaining bits are the **interface ID** (the host part).",
            hi: "IPv6 mein dotted subnet masks nahi hote. Network part hamesha prefix length se likhte hain: `/64` ka matlab pehle 64 bits **prefix** hain (network), aur baaki bits **interface ID** hain (host part).",
          },
        },
        {
          type: "p",
          text: {
            en: "A LAN is almost always a **/64**: hextets 1 to 4 are the prefix and hextets 5 to 8 are the interface ID. That gives 2⁶⁴ (about 1.8 × 10¹⁹) addresses per LAN, so in IPv6 you never count hosts, you count subnets. The size is not arbitrary: SLAAC and EUI-64, which you meet in the next lesson, need a 64-bit interface ID.",
            hi: "LAN lagbhag hamesha **/64** hota hai: hextets 1 se 4 prefix hain aur hextets 5 se 8 interface ID. Isse har LAN mein 2⁶⁴ (lagbhag 1.8 × 10¹⁹) addresses milte hain, isliye IPv6 mein hosts nahi ginte, subnets ginte ho. Yeh size random nahi hai: SLAAC aur EUI-64, jo agle lesson mein aayenge, ko 64-bit interface ID chahiye.",
          },
        },
        {
          type: "table",
          caption: { en: "Common prefix lengths", hi: "Common prefix lengths" },
          columns: ["Prefix", { en: "Typically given to", hi: "Aam taur par kisko" }, { en: "Contains", hi: "Ismein kitne" }],
          rows: [
            ["/32", { en: "An ISP, by its regional registry", hi: "ISP ko, regional registry se" }, "65,536 /48s"],
            ["/48", { en: "A business site, by its ISP", hi: "Business site ko, ISP se" }, "65,536 /64 LANs"],
            ["/56", { en: "A home or small site, by many ISPs", hi: "Ghar ya chhoti site ko, kai ISPs se" }, "256 /64 LANs"],
            ["/64", { en: "One LAN or VLAN", hi: "Ek LAN ya VLAN" }, "2⁶⁴ addresses"],
            ["/128", { en: "A single address, e.g. a loopback", hi: "Ek single address, jaise loopback" }, "1 address"],
          ],
        },
        {
          type: "p",
          text: {
            en: "With a /48 from the ISP, a global address splits into three parts: the 48-bit **global routing prefix** (hextets 1-3), a 16-bit **subnet ID** you choose for each LAN (hextet 4), and the 64-bit interface ID. In `2001:db8:0:a0::100/64`, the site is `2001:db8::/48`, the subnet ID is `a0`, and the LAN is `2001:db8:0:a0::/64`.",
            hi: "ISP se /48 mila ho toh global address teen parts mein bant jaata hai: 48-bit **global routing prefix** (hextets 1-3), 16-bit **subnet ID** jo tum har LAN ke liye chunte ho (hextet 4), aur 64-bit interface ID. `2001:db8:0:a0::100/64` mein site `2001:db8::/48` hai, subnet ID `a0` hai, aur LAN `2001:db8:0:a0::/64` hai.",
          },
        },
        {
          type: "p",
          text: { en: "To find the prefix of any address:", hi: "Kisi bhi address ka prefix aise nikaalo:" },
        },
        {
          type: "steps",
          items: [
            { en: "Expand the address to its full form first, so no zero is hidden.", hi: "Pehle address ko full form mein expand karo, taaki koi zero chhupa na rahe." },
            {
              en: "Divide the prefix length by 4 to get the number of hex digits to keep: /64 → 16 digits, /56 → 14, /48 → 12.",
              hi: "Prefix length ko 4 se divide karo, isse pata chalta hai kitne hex digits rakhne hain: /64 → 16 digits, /56 → 14, /48 → 12.",
            },
            { en: "Keep those digits, set every digit after them to 0, then shorten.", hi: "Utne digits rakho, uske baad ke saare digits 0 kar do, phir shorten karo." },
          ],
        },
        {
          type: "table",
          caption: { en: "Worked examples", hi: "Solved examples" },
          columns: ["Address", { en: "Keep", hi: "Rakho" }, "Prefix"],
          rows: [
            ["2001:db8:1:1::1/64", "16 digits: 2001 0db8 0001 0001", "2001:db8:1:1::/64"],
            ["2001:db8:1:1234::1/56", "14 digits: 2001 0db8 0001 12", "2001:db8:1:1200::/56"],
            ["2001:db8:1:1234::1/48", "12 digits: 2001 0db8 0001", "2001:db8:1::/48"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Expand before you count", hi: "Ginne se pehle expand karo" },
          text: {
            en: "Take `2001:db8:1:34::1/56`. In full form hextet 4 is `0034`, so the 14 digits you keep end in `00`, and the prefix is `2001:db8:1::/56`. If you count on the short form, you wrongly keep the `34`.",
            hi: "`2001:db8:1:34::1/56` lo. Full form mein hextet 4 `0034` hai, toh jo 14 digits rakhte ho unke aakhir mein `00` aata hai, aur prefix `2001:db8:1::/56` hai. Short form par ginoge toh galti se `34` rakh loge.",
          },
        },
      ],
    },
    {
      id: "configure",
      heading: { en: "Configuring IPv6 on a Cisco router", hi: "Cisco router par IPv6 configure karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A Cisco router routes IPv4 out of the box, but not IPv6. The global command `ipv6 unicast-routing` turns IPv6 forwarding on. Without it the router can still have IPv6 addresses and answer pings to them, but it will not forward IPv6 packets between interfaces or send Router Advertisements (next lesson).",
            hi: "Cisco router by default IPv4 route karta hai, lekin IPv6 nahi. Global command `ipv6 unicast-routing` IPv6 forwarding on karta hai. Iske bina router ke interfaces par IPv6 addresses ho sakte hain aur woh unke pings ka jawab bhi dega, lekin IPv6 packets ek interface se doosre par forward nahi karega, aur Router Advertisements (agla lesson) nahi bhejega.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: two LANs, one /64 each", hi: "R1: do LANs, har ek ka /64" },
          lines: [
            { prompt: "R1(config)#", cmd: "ipv6 unicast-routing", comment: { en: "Off by default; without it R1 does not route IPv6", hi: "Default mein off; iske bina R1 IPv6 route nahi karta" } },
            { prompt: "R1(config)#", cmd: "interface gigabitethernet0/0" },
            { prompt: "R1(config-if)#", cmd: "ipv6 address 2001:db8:1:1::1/64", comment: { en: "Address and prefix length together; there is no mask", hi: "Address aur prefix length ek saath; mask nahi hota" } },
            { prompt: "R1(config-if)#", cmd: "no shutdown" },
            { prompt: "R1(config-if)#", cmd: "interface gigabitethernet0/1" },
            { prompt: "R1(config-if)#", cmd: "ipv6 address 2001:db8:1:2::1/64" },
            { prompt: "R1(config-if)#", cmd: "no shutdown" },
            { prompt: "R1(config-if)#", cmd: "end" },
          ],
        },
        {
          type: "cli",
          title: { en: "Verify", hi: "Verify karo" },
          lines: [
            { prompt: "R1#", cmd: "show ipv6 interface brief" },
            { out: "GigabitEthernet0/0     [up/up]" },
            { out: "    FE80::211:22FF:FE33:4401", comment: { en: "Link-local address, created automatically (next lesson)", hi: "Link-local address, apne aap bana (agla lesson)" } },
            { out: "    2001:DB8:1:1::1", comment: { en: "The address you configured, shown short and in uppercase", hi: "Jo address tumne configure kiya, short aur uppercase mein" } },
            { out: "GigabitEthernet0/1     [up/up]" },
            { out: "    FE80::211:22FF:FE33:4402" },
            { out: "    2001:DB8:1:2::1" },
            { out: "GigabitEthernet0/2     [administratively down/down]" },
            { out: "    unassigned" },
          ],
          note: {
            en: "`show ipv6 interface gigabitethernet0/0` gives the detail, including the line `2001:DB8:1:1::1, subnet is 2001:DB8:1:1::/64`: IOS works out the prefix for you.",
            hi: "`show ipv6 interface gigabitethernet0/0` poori detail dikhata hai, jismein line `2001:DB8:1:1::1, subnet is 2001:DB8:1:1::/64` bhi hai: IOS prefix khud nikaal deta hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "A second ipv6 address adds, it does not replace", hi: "Doosra ipv6 address add hota hai, replace nahi" },
          text: {
            en: "In IPv4, a new `ip address` command replaces the old address. In IPv6, a second `ipv6 address` command adds another address and the interface keeps both. If you typed `2001:db8:1:11::1/64` by mistake, remove it with `no ipv6 address 2001:db8:1:11::1/64`.",
            hi: "IPv4 mein naya `ip address` command purana address replace kar deta hai. IPv6 mein doosra `ipv6 address` command ek aur address add karta hai, aur interface par dono rehte hain. Galti se `2001:db8:1:11::1/64` type ho gaya ho toh use `no ipv6 address 2001:db8:1:11::1/64` se hatao.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Type it any valid way", hi: "Kisi bhi valid tarike se type karo" },
          text: {
            en: "IOS accepts the address in full or short form, in upper or lower case, and always displays the shortest form in uppercase. `ipv6 address 2001:0DB8:0001:0001::0001/64` gives the same result as the command above.",
            hi: "IOS address ko full ya short form mein, upper ya lower case mein accept karta hai, aur hamesha shortest form uppercase mein dikhata hai. `ipv6 address 2001:0DB8:0001:0001::0001/64` se bhi wahi result aata hai jo upar wale command se.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "IPv6", def: { en: "Internet Protocol version 6, with 128-bit addresses written in hex.", hi: "Internet Protocol version 6, jiske 128-bit addresses hex mein likhe jaate hain." } },
    { term: "Hextet", def: { en: "One group of 4 hex digits (16 bits) in an IPv6 address; an address has 8.", hi: "IPv6 address mein 4 hex digits (16 bits) ka ek group; ek address mein 8 hote hain." } },
    { term: ":: (double colon)", def: { en: "Stands for one run of consecutive all-zero hextets; allowed only once per address.", hi: "Lagataar all-zero hextets ke ek run ki jagah aata hai; ek address mein sirf ek baar." } },
    { term: "Prefix length", def: { en: "The /n that says how many leading bits are the network part.", hi: "Woh /n jo batata hai ki shuru ke kitne bits network part hain." } },
    { term: "Interface ID", def: { en: "The host part of an IPv6 address, normally the last 64 bits.", hi: "IPv6 address ka host part, aam taur par aakhri 64 bits." } },
    { term: "Global routing prefix", def: { en: "The part of the address assigned by the ISP, often a /48 for a site.", hi: "Address ka woh part jo ISP assign karta hai, site ke liye aksar /48." } },
    { term: "Subnet ID", def: { en: "The bits between the global routing prefix and the interface ID that number each LAN; 16 bits with a /48.", hi: "Global routing prefix aur interface ID ke beech ke bits jo har LAN ko number dete hain; /48 ke saath 16 bits." } },
    { term: "Dual stack", def: { en: "Running IPv4 and IPv6 on the same interfaces at the same time.", hi: "Same interfaces par ek hi time par IPv4 aur IPv6 dono chalana." } },
  ],
  commands: [
    { cmd: "ipv6 unicast-routing", mode: "Cisco global config", does: { en: "Turn on IPv6 routing (off by default)", hi: "IPv6 routing on karta hai (default mein off)" } },
    { cmd: "ipv6 address 2001:db8:1:1::1/64", mode: "Cisco interface config", does: { en: "Give the interface an IPv6 address and prefix length", hi: "Interface ko IPv6 address aur prefix length deta hai" } },
    { cmd: "no ipv6 address 2001:db8:1:11::1/64", mode: "Cisco interface config", does: { en: "Remove one specific IPv6 address", hi: "Ek specific IPv6 address hatata hai" } },
    { cmd: "show ipv6 interface brief", mode: "Cisco privileged EXEC", does: { en: "List interfaces with their status and IPv6 addresses", hi: "Interfaces ka status aur IPv6 addresses dikhata hai" } },
    { cmd: "show ipv6 interface gigabitethernet0/0", mode: "Cisco privileged EXEC", does: { en: "Show the full IPv6 detail of one interface, including its prefix", hi: "Ek interface ki poori IPv6 detail, prefix samet, dikhata hai" } },
    { cmd: "ping 2001:db8:1:2::10", mode: "Cisco privileged EXEC", does: { en: "Test reachability to an IPv6 address", hi: "IPv6 address tak reachability test karta hai" } },
  ],
  mistakes: [
    {
      en: "Removing trailing zeros. `00a0` shortens to `a0`, not `a`; only leading zeros may go.",
      hi: "Trailing zeros hata dena. `00a0` ka short form `a0` hai, `a` nahi; sirf leading zeros hat sakte hain.",
    },
    {
      en: "Using `::` twice, as in `2001:db8::a0::100`. The address becomes ambiguous and is invalid.",
      hi: "`::` do baar use karna, jaise `2001:db8::a0::100`. Address ambiguous ho jaata hai aur invalid hai.",
    },
    {
      en: "Putting `::` on a shorter run when asked for the shortest form. Compress the longest run of zero hextets, or the first one if two runs tie.",
      hi: "Shortest form poocha ho aur `::` chhote run par laga dena. Sabse lambe zero run ko compress karo, ya do runs barabar hon toh pehle wale ko.",
    },
    {
      en: "Finding a prefix from the short form. Expand first: in `2001:db8:1:34::1/56`, hextet 4 is really `0034`, so the /56 prefix is `2001:db8:1::/56`.",
      hi: "Short form se prefix nikaalna. Pehle expand karo: `2001:db8:1:34::1/56` mein hextet 4 asal mein `0034` hai, isliye /56 prefix `2001:db8:1::/56` hai.",
    },
    {
      en: "Forgetting `ipv6 unicast-routing`. The interfaces get their addresses and answer pings, but the router does not forward IPv6 between LANs.",
      hi: "`ipv6 unicast-routing` bhool jaana. Interfaces ko addresses mil jaate hain aur woh ping ka jawab bhi dete hain, lekin router LANs ke beech IPv6 forward nahi karta.",
    },
    {
      en: "Expecting a second `ipv6 address` command to replace the first. IPv6 adds it; remove the old one with `no ipv6 address`.",
      hi: "Yeh expect karna ki doosra `ipv6 address` command pehle wale ko replace karega. IPv6 use add karta hai; purana wala `no ipv6 address` se hatao.",
    },
  ],
  recap: [
    {
      en: "IPv6 addresses are 128 bits: 32 hex digits in 8 hextets of 16 bits. There are enough of them that NAT is not needed.",
      hi: "IPv6 address 128 bits ka hai: 32 hex digits, 16-16 bits ke 8 hextets mein. Itne addresses hain ki NAT ki zaroorat nahi.",
    },
    {
      en: "Rule 1: drop the leading zeros in each hextet, never trailing ones. Rule 2: one `::` for the longest run of all-zero hextets, the first if tied.",
      hi: "Rule 1: har hextet ke leading zeros hatao, trailing kabhi nahi. Rule 2: sabse lambe all-zero run ke liye ek `::`, barabar hon toh pehla.",
    },
    {
      en: "To expand, count the visible hextets; `::` fills the gap up to 8. Pad each hextet to 4 digits.",
      hi: "Expand karne ke liye dikhne wale hextets gino; `::` baaki jagah 8 tak bharta hai. Har hextet ko 4 digits tak pad karo.",
    },
    {
      en: "LANs are /64: 64-bit prefix + 64-bit interface ID. A /48 site has a 16-bit subnet ID, so 65,536 LANs.",
      hi: "LANs /64 hote hain: 64-bit prefix + 64-bit interface ID. /48 site mein 16-bit subnet ID hota hai, yaani 65,536 LANs.",
    },
    {
      en: "Prefix: from the full form keep prefix length ÷ 4 hex digits, and zero the rest.",
      hi: "Prefix: full form mein se prefix length ÷ 4 hex digits rakho, aur baaki zero kar do.",
    },
    {
      en: "Cisco: `ipv6 unicast-routing`, then `ipv6 address 2001:db8:1:1::1/64` on each interface; check with `show ipv6 interface brief`.",
      hi: "Cisco: `ipv6 unicast-routing`, phir har interface par `ipv6 address 2001:db8:1:1::1/64`; `show ipv6 interface brief` se check karo.",
    },
  ],
  quiz: [
    {
      q: {
        en: "What is the shortest valid form of `2001:0db8:0000:0000:0000:0bc0:0000:0001`?",
        hi: "`2001:0db8:0000:0000:0000:0bc0:0000:0001` ka shortest valid form kya hai?",
      },
      options: [
        { en: "2001:db8::bc0::1", hi: "2001:db8::bc0::1" },
        { en: "2001:db8:0:0:0:bc0::1", hi: "2001:db8:0:0:0:bc0::1" },
        { en: "2001:db8::bc0:0:1", hi: "2001:db8::bc0:0:1" },
        { en: "2001:db8::bc:0:1", hi: "2001:db8::bc:0:1" },
      ],
      answer: 2,
      explain: {
        en: "Rule 1 gives `2001:db8:0:0:0:bc0:0:1`. The longest zero run is hextets 3-5, so it becomes `::`, and the single zero in hextet 7 stays `0`. Two `::` is invalid, compressing the single zero is valid but longer, and `bc` drops a trailing zero that carries value.",
        hi: "Rule 1 se `2001:db8:0:0:0:bc0:0:1` milta hai. Sabse lamba zero run hextets 3-5 hai, woh `::` banta hai, aur hextet 7 ka akela zero `0` hi rehta hai. Do `::` invalid hai, akele zero ko compress karna valid hai par lamba hai, aur `bc` mein ek trailing zero hata diya jiski value thi.",
      },
      kind: "calc",
    },
    {
      q: { en: "Which is the full form of `2001:db8:a::12`?", hi: "`2001:db8:a::12` ka full form kaunsa hai?" },
      options: [
        { en: "2001:0db8:000a:0000:0000:0000:0000:0012", hi: "2001:0db8:000a:0000:0000:0000:0000:0012" },
        { en: "2001:0db8:a000:0000:0000:0000:0000:1200", hi: "2001:0db8:a000:0000:0000:0000:0000:1200" },
        { en: "2001:0db8:000a:0000:0000:0000:0012:0000", hi: "2001:0db8:000a:0000:0000:0000:0012:0000" },
        { en: "2001:0db8:000a:0000:0000:0000:0000:0000:0012", hi: "2001:0db8:000a:0000:0000:0000:0000:0000:0012" },
      ],
      answer: 0,
      explain: {
        en: "Four hextets are visible, so `::` stands for 8 − 4 = 4 zero hextets, all placed where the `::` was. Zeros go on the left of each hextet: `a` → `000a`, `12` → `0012`. The last option has 9 hextets.",
        hi: "Chaar hextets dikh rahe hain, toh `::` 8 − 4 = 4 zero hextets ki jagah hai, aur woh wahin aate hain jahan `::` tha. Zeros har hextet ke left mein lagte hain: `a` → `000a`, `12` → `0012`. Aakhri option mein 9 hextets hain.",
      },
      kind: "calc",
    },
    {
      q: { en: "A host has the address `2001:db8:ab:5c::1/56`. What is its prefix?", hi: "Ek host ka address `2001:db8:ab:5c::1/56` hai. Iska prefix kya hai?" },
      options: [
        { en: "2001:db8:ab:5c::/56", hi: "2001:db8:ab:5c::/56" },
        { en: "2001:db8:ab:5000::/56", hi: "2001:db8:ab:5000::/56" },
        { en: "2001:db8::/56", hi: "2001:db8::/56" },
        { en: "2001:db8:ab::/56", hi: "2001:db8:ab::/56" },
      ],
      answer: 3,
      explain: {
        en: "Expand first: hextet 3 is `00ab` and hextet 4 is `005c`. /56 ÷ 4 = 14 hex digits to keep: `2001 0db8 00ab 00`. Everything after that becomes zero, so the prefix is `2001:db8:ab::/56`. Counting on the short form makes you keep the `5c` by mistake.",
        hi: "Pehle expand karo: hextet 3 `00ab` hai aur hextet 4 `005c`. /56 ÷ 4 = 14 hex digits rakhne hain: `2001 0db8 00ab 00`. Uske baad sab zero, toh prefix `2001:db8:ab::/56` hai. Short form par ginoge toh galti se `5c` rakh loge.",
      },
      kind: "calc",
    },
    {
      q: { en: "Why does IPv6 not need NAT to save addresses?", hi: "IPv6 ko addresses bachane ke liye NAT ki zaroorat kyun nahi?" },
      options: [
        { en: "IPv6 routers translate addresses automatically", hi: "IPv6 routers addresses apne aap translate kar dete hain" },
        { en: "There are enough addresses for every device to have a globally unique one", hi: "Itne addresses hain ki har device ko globally unique address mil sakta hai" },
        { en: "IPv6 hides host addresses inside an encrypted header", hi: "IPv6 host addresses ko encrypted header mein chhupa deta hai" },
        { en: "IPv6 hosts use their MAC addresses on the internet instead", hi: "IPv6 hosts internet par MAC addresses use karte hain" },
      ],
      answer: 1,
      explain: {
        en: "With 2¹²⁸ addresses, every LAN gets its own /64 of globally unique addresses, so there is nothing to conserve. Deciding what may come in is the firewall's job, with or without NAT.",
        hi: "2¹²⁸ addresses ke saath har LAN ko globally unique addresses ka apna /64 milta hai, toh bachane ko kuch nahi. Andar kya aa sakta hai, yeh decide karna firewall ka kaam hai, NAT ho ya na ho.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1 has `ipv6 address 2001:db8:1:1::1/64` on G0/0 and `ipv6 address 2001:db8:1:2::1/64` on G0/1, both up/up. The hosts are set manually with correct addresses and gateways. Each host can ping its own R1 interface, but not the host on the other LAN. What is missing?",
        hi: "R1 ke G0/0 par `ipv6 address 2001:db8:1:1::1/64` aur G0/1 par `ipv6 address 2001:db8:1:2::1/64` hai, dono up/up. Hosts manually sahi addresses aur gateways ke saath set hain. Har host apne R1 interface ko ping kar leta hai, lekin doosre LAN ke host ko nahi. Kya missing hai?",
      },
      options: [
        { en: "`ipv6 enable` on both interfaces", hi: "Dono interfaces par `ipv6 enable`" },
        { en: "`ip routing` in global config", hi: "Global config mein `ip routing`" },
        { en: "A /48 prefix length on both interfaces", hi: "Dono interfaces par /48 prefix length" },
        { en: "`ipv6 unicast-routing` in global config", hi: "Global config mein `ipv6 unicast-routing`" },
      ],
      answer: 3,
      explain: {
        en: "IOS routes IPv6 only after `ipv6 unicast-routing`. Without it the addresses still belong to the router, so pings to R1 succeed, but R1 will not forward packets from one LAN to the other. `ipv6 enable` is not needed once an address is configured, and `ip routing` is for IPv4.",
        hi: "IOS IPv6 tabhi route karta hai jab `ipv6 unicast-routing` ho. Iske bina addresses router ke hi rehte hain, isliye R1 ko ping ho jaata hai, lekin R1 ek LAN se doosre LAN par packets forward nahi karega. Address configure ho toh `ipv6 enable` ki zaroorat nahi, aur `ip routing` IPv4 ke liye hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "You configured only `ipv6 address 2001:db8:1:1::1/64` on G0/0, yet `show ipv6 interface brief` also lists `FE80::211:22FF:FE33:4401` under it. Where did that address come from?",
        hi: "Tumne G0/0 par sirf `ipv6 address 2001:db8:1:1::1/64` configure kiya, phir bhi `show ipv6 interface brief` mein uske neeche `FE80::211:22FF:FE33:4401` bhi dikhta hai. Yeh address kahan se aaya?",
      },
      options: [
        { en: "A DHCPv6 server assigned it", hi: "DHCPv6 server ne assign kiya" },
        { en: "IOS created it automatically when IPv6 was enabled on the interface", hi: "Interface par IPv6 enable hote hi IOS ne apne aap banaya" },
        { en: "It is left over from a previous configuration", hi: "Yeh pichhli configuration se bacha hua hai" },
        { en: "A neighbouring router advertised it", hi: "Neighbour router ne advertise kiya" },
      ],
      answer: 1,
      explain: {
        en: "Every IPv6-enabled interface gets a link-local address starting with `FE80`. IOS builds it by itself, here from the interface's MAC address. The next lesson shows how, and what link-local addresses are for.",
        hi: "Har IPv6-enabled interface ko `FE80` se shuru hone wala link-local address milta hai. IOS use khud banata hai, yahan interface ke MAC address se. Agla lesson dikhayega kaise, aur link-local addresses kis kaam aate hain.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "ZNuXyOXae5U",
      title: "Free CCNA | IPv6 Part 1 | Day 31",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Start at 'Why IPv6?' (11:20) for abbreviation, expanding, finding the prefix and configuration. The part before it is a hex review.",
        hi: "'Why IPv6?' (11:20) se dekho: abbreviation, expanding, prefix nikaalna aur configuration. Usse pehle ka hissa hex review hai.",
      },
    },
    {
      id: "BdsIahtrWIA",
      title: "Free CCNA | Configuring IPv6 (Part 1) | Day 31 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "A short Packet Tracer lab to practise the configuration part of this lesson.", hi: "Is lesson ke configuration part ki practice ke liye chhota Packet Tracer lab." },
    },
    {
      id: "rT_UX93bmEc",
      title: "103. Free CCNA (NEW) | IPv6 in Hindi - Introduction to IPv6",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "An introduction to IPv6 and why it was needed, in Hindi.", hi: "IPv6 ka introduction aur iski zaroorat kyun padi, Hindi mein." },
    },
    {
      id: "_EsH3FarVgc",
      title: "104. Free CCNA (NEW) | IPv6 in Hindi - How to Compress IPv6",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "The shortening rules worked through with examples.", hi: "Shortening rules examples ke saath solve kiye gaye hain." },
    },
  ],
  lab: {
    title: { en: "Two IPv6 LANs in Packet Tracer", hi: "Packet Tracer mein do IPv6 LANs" },
    steps: [
      {
        en: "Build R1 with G0/0 and G0/1, each connected to its own switch with one PC.",
        hi: "R1 banao jiske G0/0 aur G0/1 dono alag-alag switch se jude hon, har switch par ek PC.",
      },
      {
        en: "On R1 enter `ipv6 unicast-routing`, give G0/0 `2001:db8:1:1::1/64` and G0/1 `2001:db8:1:2::1/64`, and `no shutdown` both.",
        hi: "R1 par `ipv6 unicast-routing` do, G0/0 ko `2001:db8:1:1::1/64` aur G0/1 ko `2001:db8:1:2::1/64` do, aur dono par `no shutdown` karo.",
      },
      {
        en: "On each PC open Desktop > IP Configuration and choose IPv6 Static. PC1: `2001:db8:1:1::10/64`, gateway `2001:db8:1:1::1`. PC2: `2001:db8:1:2::10/64`, gateway `2001:db8:1:2::1`.",
        hi: "Har PC par Desktop > IP Configuration kholo aur IPv6 Static chuno. PC1: `2001:db8:1:1::10/64`, gateway `2001:db8:1:1::1`. PC2: `2001:db8:1:2::10/64`, gateway `2001:db8:1:2::1`.",
      },
      {
        en: "Run `show ipv6 interface brief` on R1. Write one FE80 address out in full form, then shorten it again.",
        hi: "R1 par `show ipv6 interface brief` chalao. Ek FE80 address ko full form mein likho, phir wapas shorten karo.",
      },
      {
        en: "Ping PC2 from PC1. Then enter `no ipv6 unicast-routing` on R1 and ping again: it fails. Put the command back.",
        hi: "PC1 se PC2 ko ping karo. Phir R1 par `no ipv6 unicast-routing` karo aur dobara ping karo: fail hoga. Command wapas daal do.",
      },
    ],
  },
};

export default lesson;
