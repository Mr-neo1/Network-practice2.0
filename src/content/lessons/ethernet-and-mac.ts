import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "ethernet-and-mac",
  intro: {
    en: "An IP packet cannot cross a cable on its own. On a wired LAN it rides inside an Ethernet frame, and the frame is delivered by MAC address, not by IP address. Every switch decision, every ARP exchange and every CRC error you will troubleshoot comes down to the handful of fields in this frame.",
    hi: "IP packet akele cable par travel nahi kar sakta. Wired LAN par woh Ethernet frame ke andar jaata hai, aur frame MAC address se deliver hota hai, IP address se nahi. Switch ka har decision, har ARP exchange aur har CRC error jo tum troubleshoot karoge, sab isi frame ke kuch fields par tika hai.",
  },
  outcomes: [
    { en: "Name the fields of an Ethernet frame in order, with their sizes", hi: "Ethernet frame ke fields order mein, unke size ke saath, bata sako" },
    { en: "Work out frame size limits and padding from the 46-1500 byte payload rule", hi: "46-1500 byte payload rule se frame ka size aur padding calculate kar sako" },
    { en: "Explain how the FCS detects damaged frames and what happens to them", hi: "Samjha sako ki FCS kharab frames kaise pakadta hai aur unka kya hota hai" },
    { en: "Split a MAC address into its OUI and device part, in any of the three common formats", hi: "Kisi bhi MAC address ko OUI aur device part mein tod sako, teeno common formats mein" },
    { en: "Tell unicast, broadcast and multicast MAC addresses apart from the first byte", hi: "Pehle byte se unicast, broadcast aur multicast MAC address pehchaan sako" },
  ],
  sections: [
    {
      id: "where-ethernet-fits",
      heading: { en: "Where Ethernet fits", hi: "Ethernet kahan fit hota hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In the encapsulation lesson you saw the link layer wrap a packet in a header and a trailer. On wired LANs that link layer is **Ethernet**, defined by the IEEE 802.3 family of standards. Ethernet covers two layers: the cables and signals at Layer 1, and the **frame** format and **MAC addresses** at Layer 2.",
            hi: "Encapsulation lesson mein tumne dekha ki link layer packet ko header aur trailer mein wrap karti hai. Wired LAN par yeh link layer **Ethernet** hai, jo IEEE 802.3 family ke standards mein defined hai. Ethernet do layers cover karta hai: Layer 1 par cables aur signals, aur Layer 2 par **frame** ka format aur **MAC addresses**.",
          },
        },
        {
          type: "p",
          text: {
            en: "A frame only travels across one LAN. The IPv4 address in the packet names the final destination and normally stays the same end to end (NAT, a later topic, is the exception). The MAC addresses in the frame name the sender and receiver on this LAN only, and every router along the way builds a new frame for the next hop.",
            hi: "Frame sirf ek LAN ke andar travel karta hai. Packet ka IPv4 address final destination batata hai aur normally shuru se end tak same rehta hai (NAT, jo aage aayega, iska exception hai). Frame ke MAC addresses sirf is LAN ke sender aur receiver batate hain, aur raaste ka har router agle hop ke liye naya frame banata hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "One MAC per interface, not per device", hi: "MAC har interface ka hota hai, device ka nahi" },
          text: {
            en: "Your laptop has one MAC for its wired port and another for Wi-Fi. A router has a separate MAC on each Ethernet interface. Wi-Fi uses its own frame format (802.11), but the same 48-bit MAC addresses.",
            hi: "Tumhare laptop ke wired port ka ek MAC hai aur Wi-Fi ka alag. Router ke har Ethernet interface ka alag MAC hota hai. Wi-Fi ka frame format alag hai (802.11), lekin MAC address wahi 48-bit wale hote hain.",
          },
        },
      ],
    },
    {
      id: "frame-fields",
      heading: { en: "The fields of an Ethernet frame", hi: "Ethernet frame ke fields" },
      blocks: [
        {
          type: "p",
          text: {
            en: "This is the **Ethernet II** frame, the format that carries almost all IPv4 and IPv6 traffic, in the order the bits leave the NIC.",
            hi: "Yeh **Ethernet II** frame hai, jo lagbhag saara IPv4 aur IPv6 traffic carry karta hai. Fields usi order mein hain jis order mein bits NIC se nikalti hain.",
          },
        },
        {
          type: "table",
          caption: { en: "Ethernet II frame, first field to last", hi: "Ethernet II frame, pehle field se aakhri tak" },
          columns: ["Field", "Size", { en: "What it does", hi: "Kya karta hai" }],
          rows: [
            ["Preamble", "7 bytes", { en: "Alternating 1s and 0s (10101010) so the receiver can sync its clock to the signal", hi: "1 aur 0 baari-baari (10101010), taaki receiver apni clock signal ke saath sync kar le" }],
            ["SFD (Start Frame Delimiter)", "1 byte", { en: "`10101011`: the final two 1s say \"the destination MAC starts next\"", hi: "`10101011`: aakhri do 1 batate hain ki \"ab destination MAC shuru hoga\"" }],
            ["Destination MAC", "6 bytes", { en: "The NIC the frame is for, or a broadcast or multicast group", hi: "Jis NIC ke liye frame hai, ya koi broadcast ya multicast group" }],
            ["Source MAC", "6 bytes", { en: "The sender's own MAC. Always a unicast address", hi: "Sender ka apna MAC. Hamesha unicast address" }],
            ["Type (EtherType)", "2 bytes", { en: "Which protocol is in the payload: `0x0800` IPv4, `0x0806` ARP, `0x86DD` IPv6", hi: "Payload mein kaunsa protocol hai: `0x0800` IPv4, `0x0806` ARP, `0x86DD` IPv6" }],
            ["Payload", "46-1500 bytes", { en: "The packet, padded up to 46 bytes if it is shorter", hi: "Packet, aur agar 46 bytes se chhota ho toh padding ke saath 46 tak" }],
            ["FCS (Frame Check Sequence)", "4 bytes", { en: "A CRC-32 value the receiver uses to detect damaged frames", hi: "CRC-32 value jisse receiver kharab frame pakadta hai" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "The destination comes first on purpose. After just 6 bytes, a NIC knows whether to keep reading, and a switch knows where the frame should go.",
            hi: "Destination jaan-boojh kar sabse pehle rakha gaya hai. Sirf 6 bytes padhne ke baad NIC jaan jaata hai ki aage padhna hai ya nahi, aur switch jaan jaata hai ki frame kahan bhejna hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Memorise 7-1-6-6-2-payload-4", hi: "7-1-6-6-2-payload-4 yaad karo" },
          text: {
            en: "Header (destination + source + type) = 14 bytes. Trailer (FCS) = 4 bytes. Together 18 bytes of overhead. The preamble and SFD are sent on the wire but are **not** counted as part of the frame.",
            hi: "Header (destination + source + type) = 14 bytes. Trailer (FCS) = 4 bytes. Dono milakar 18 bytes ka overhead. Preamble aur SFD wire par jaate hain, lekin frame ka hissa **nahi** gine jaate.",
          },
        },
      ],
    },
    {
      id: "type-and-size",
      heading: { en: "The Type field and frame size limits", hi: "Type field aur frame size ki limits" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The 2 bytes after the source MAC do double duty. A value of 1536 (`0x0600`) or more is an **EtherType** that names the payload protocol; that is Ethernet II. A value of 1500 or less is the payload **length**, used by the original IEEE 802.3 format, which adds a small LLC header to identify the protocol. IP uses Ethernet II. You will meet the 802.3 style again in STP and CDP frames.",
            hi: "Source MAC ke baad wale 2 bytes do kaam karte hain. Value 1536 (`0x0600`) ya usse zyada ho toh yeh **EtherType** hai jo payload ka protocol batata hai; yahi Ethernet II hai. Value 1500 ya usse kam ho toh yeh payload ki **length** hai, jo original IEEE 802.3 format use karta hai, aur protocol batane ke liye ek chhota LLC header jodta hai. IP Ethernet II use karta hai. 802.3 style tumhe STP aur CDP frames mein dobara milega.",
          },
        },
        {
          type: "table",
          caption: { en: "EtherType values you will see in the CCNA", hi: "CCNA mein dikhne wali EtherType values" },
          columns: ["EtherType", { en: "What follows the header", hi: "Header ke baad kya aata hai" }],
          rows: [
            ["0x0800", { en: "An IPv4 packet", hi: "IPv4 packet" }],
            ["0x0806", { en: "An ARP message", hi: "ARP message" }],
            ["0x86DD", { en: "An IPv6 packet", hi: "IPv6 packet" }],
            ["0x8100", { en: "An 802.1Q VLAN tag (trunking lesson)", hi: "802.1Q VLAN tag (trunking lesson mein)" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "The payload must be at least 46 and at most 1500 bytes, so a frame is **64 to 1518 bytes**. The 1500-byte limit is the **MTU** (maximum transmission unit): the largest packet an Ethernet interface carries in one frame. If the packet is shorter than 46 bytes, the sender adds padding. The receiver ignores the padding because the IP header, or the fixed ARP format, says how long the real data is.",
            hi: "Payload kam se kam 46 aur zyada se zyada 1500 bytes ka hona chahiye, isliye frame **64 se 1518 bytes** ka hota hai. 1500 bytes ki limit ko **MTU** (maximum transmission unit) kehte hain: sabse bada packet jo Ethernet interface ek frame mein le ja sakta hai. Packet 46 bytes se chhota ho toh sender padding jod deta hai. Receiver padding ko ignore karta hai, kyunki IP header (ya ARP ka fixed format) batata hai ki asli data kitna lamba hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Working out the frame size", hi: "Frame size nikaalna" },
          columns: [{ en: "Payload", hi: "Payload" }, "Padding", { en: "Frame (14 + payload + pad + 4)", hi: "Frame ka size (14 + payload + pad + 4)" }],
          rows: [
            [{ en: "ARP message, 28 bytes", hi: "ARP message, 28 bytes" }, "18", "64"],
            [{ en: "Small IPv4 packet, 40 bytes", hi: "Chhota IPv4 packet, 40 bytes" }, "6", "64"],
            [{ en: "IPv4 packet, 500 bytes", hi: "IPv4 packet, 500 bytes" }, "0", "518"],
            [{ en: "Full-size packet, 1500 bytes", hi: "Full-size packet, 1500 bytes" }, "0", "1518"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Why a 64-byte minimum? Early Ethernet shared one cable in half duplex. A sender had to still be transmitting when news of a collision came back from the far end of the cable, or it would never know its frame was damaged. 64 bytes (512 bits) was long enough to guarantee that. Full-duplex links have no collisions, but the minimum stayed.",
            hi: "64 bytes ka minimum kyun? Purana Ethernet half duplex mein ek hi cable share karta tha. Cable ke doosre end se collision ki khabar wapas aane tak sender ka transmit karte rehna zaroori tha, warna use kabhi pata hi nahi chalta ki uska frame kharab ho gaya. 64 bytes (512 bits) itna lamba tha ki yeh guarantee ho jaaye. Full-duplex links par collision hota hi nahi, lekin minimum wahi reh gaya.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Runt**: a frame shorter than 64 bytes, often a fragment left by a collision.",
              hi: "**Runt**: 64 bytes se chhota frame, aksar collision ke baad bacha hua tukda.",
            },
            {
              en: "**Giant**: a frame longer than the maximum (1518 bytes, or 1522 with the 4-byte VLAN tag you will meet in the trunking lesson).",
              hi: "**Giant**: maximum se bada frame (1518 bytes, ya 1522 jab 4-byte ka VLAN tag ho, jo trunking lesson mein aayega).",
            },
            {
              en: "Interfaces count both and discard them. The interface troubleshooting lesson shows how to read these counters.",
              hi: "Interfaces dono ko count karke discard kar dete hain. Interface troubleshooting lesson mein yeh counters padhna seekhoge.",
            },
          ],
        },
      ],
    },
    {
      id: "fcs",
      heading: { en: "How the FCS catches damaged frames", hi: "FCS kharab frames kaise pakadta hai" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "The sender runs a **CRC-32** calculation over the destination MAC, source MAC, type and payload, and writes the 4-byte result into the FCS.",
              hi: "Sender destination MAC, source MAC, type aur payload par **CRC-32** calculation chalata hai, aur 4-byte result FCS mein likh deta hai.",
            },
            {
              en: "The bits cross the cable. Electrical noise or a damaged cable or connector can flip some of them. A duplex mismatch also shows up as CRC errors, because frames get cut off part way through.",
              hi: "Bits cable par jaati hain. Electrical noise ya kharab cable ya connector se kuch bits palat sakti hain. Duplex mismatch se bhi CRC errors aate hain, kyunki frames beech mein hi kat jaate hain.",
            },
            {
              en: "The receiver runs the same calculation on the bits it actually received.",
              hi: "Receiver jo bits usse asal mein mili hain, un par wahi calculation chalata hai.",
            },
            {
              en: "Same result as the FCS: the frame is intact and is processed. Different result: the frame is discarded and the interface's CRC error counter goes up.",
              hi: "Result FCS jaisa hi aaya: frame sahi hai aur process hota hai. Result alag aaya: frame discard ho jaata hai aur interface ka CRC error counter badh jaata hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Ethernet detects errors, it does not repair them", hi: "Ethernet error pakadta hai, theek nahi karta" },
          text: {
            en: "A frame that fails the FCS check is silently dropped. Ethernet never fixes it and never asks for it again. If the data mattered, a higher layer such as TCP notices the gap and resends it; a UDP application simply loses it.",
            hi: "FCS check mein fail hua frame chupchaap drop ho jaata hai. Ethernet na use theek karta hai, na dobara maangta hai. Agar data zaroori tha, toh TCP jaisi upar ki layer gap notice karke dobara bhejti hai; UDP application ka woh data bas kho jaata hai.",
          },
        },
      ],
    },
    {
      id: "mac-structure",
      heading: { en: "Inside a MAC address", hi: "MAC address ke andar" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A MAC address is **48 bits** (6 bytes). Nobody reads 48 ones and zeros, so it is written as **12 hex digits**, each worth 4 bits, as you practised in the binary and hex lesson. That allows 2^48, about 281 trillion, addresses.",
            hi: "MAC address **48 bits** (6 bytes) ka hota hai. 48 ones aur zeros koi nahi padhta, isliye ise **12 hex digits** mein likhte hain, har digit 4 bits ka, jaise binary aur hex lesson mein practice kiya tha. Isse 2^48, yaani lagbhag 281 trillion, addresses ban sakte hain.",
          },
        },
        {
          type: "table",
          caption: { en: "The two halves of 0050.56aa.0002", hi: "0050.56aa.0002 ke do hisse" },
          columns: [{ en: "Part", hi: "Hissa" }, "Bits", { en: "Who assigns it", hi: "Kaun assign karta hai" }, { en: "Example", hi: "Example" }],
          rows: [
            ["OUI (Organizationally Unique Identifier)", { en: "First 24", hi: "Pehle 24" }, { en: "The IEEE, to a manufacturer", hi: "IEEE, kisi manufacturer ko" }, { en: "`00-50-56` (VMware)", hi: "`00-50-56` (VMware)" }],
            [{ en: "Device part", hi: "Device part" }, { en: "Last 24", hi: "Aakhri 24" }, { en: "The manufacturer, unique per NIC", hi: "Manufacturer, har NIC ke liye unique" }, "`AA-00-02`"],
          ],
        },
        {
          type: "p",
          text: {
            en: "The manufacturer stores the address in the NIC, so it is called the **burned-in address (BIA)**. Virtual machines get their MAC from the hypervisor instead: VMware uses its own OUIs, which is why many VMware VMs show addresses like `0050.56xx.xxxx`. A MAC says who made the NIC, not where it is. It has no network part a router could use, which is why MAC addresses only work inside one LAN and IP addresses are needed between networks.",
            hi: "Manufacturer yeh address NIC mein store karta hai, isliye ise **burned-in address (BIA)** kehte hain. Virtual machines ko MAC hypervisor deta hai: VMware apne OUIs use karta hai, isliye kai VMware VMs mein `0050.56xx.xxxx` jaise addresses dikhte hain. MAC batata hai ki NIC kisne banaya, yeh nahi ki device kahan hai. Isme koi network part nahi hota jo router use kar sake, isliye MAC address sirf ek LAN ke andar kaam karte hain aur networks ke beech IP address chahiye.",
          },
        },
        {
          type: "table",
          caption: { en: "One address, three spellings", hi: "Ek address, teen tarah se likha hua" },
          columns: [{ en: "Written by", hi: "Kaun aise likhta hai" }, "Format", { en: "Example", hi: "Example" }],
          rows: [
            ["Cisco IOS", { en: "Three groups of 4 hex digits, dots", hi: "4 hex digits ke teen groups, dots ke saath" }, "`0050.56aa.0002`"],
            ["Linux, macOS", { en: "Six pairs, colons", hi: "Chhe pairs, colons ke saath" }, "`00:50:56:aa:00:02`"],
            ["Windows", { en: "Six pairs, hyphens", hi: "Chhe pairs, hyphens ke saath" }, "`00-50-56-AA-00-02`"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Same 48 bits, different spelling", hi: "Wahi 48 bits, sirf likhne ka tarika alag" },
          text: {
            en: "All three rows above are the same address, and case does not matter: `0050.56AA.0002` = `0050.56aa.0002`. When you compare a MAC from a PC with one in a switch table, convert both to one format first. Beyond the CCNA: the bit next to the I/G bit is the U/L bit, set to 1 in locally assigned addresses such as the random private MACs phones use on Wi-Fi.",
            hi: "Upar ki teeno rows ek hi address hain, aur capital ya small letters se fark nahi padta: `0050.56AA.0002` = `0050.56aa.0002`. PC ka MAC switch table wale MAC se compare karna ho toh pehle dono ko ek format mein le aao. CCNA se aage ki baat: I/G bit ke bagal wala bit U/L bit hai, jo locally assigned addresses mein 1 hota hai, jaise phones Wi-Fi par jo random private MAC use karte hain.",
          },
        },
      ],
    },
    {
      id: "unicast-broadcast-multicast",
      heading: { en: "Unicast, broadcast and multicast MACs", hi: "Unicast, broadcast aur multicast MAC" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The destination MAC decides who accepts a frame. A NIC keeps frames sent to its own MAC, to the broadcast address and to multicast groups it has joined. It silently discards everything else.",
            hi: "Destination MAC decide karta hai ki frame kaun accept karega. NIC woh frames rakhta hai jo uske apne MAC, broadcast address, ya uske join kiye multicast groups par aaye hon. Baaki sab chupchaap discard kar deta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Three kinds of destination MAC", hi: "Destination MAC ke teen types" },
          columns: [{ en: "Kind", hi: "Type" }, { en: "How to spot it", hi: "Kaise pehchaano" }, { en: "Example", hi: "Example" }, { en: "Who accepts it", hi: "Kaun accept karta hai" }],
          rows: [
            ["Unicast", { en: "I/G bit 0: second hex digit is even", hi: "I/G bit 0: second hex digit even hai" }, "`0050.56aa.0002`", { en: "One NIC", hi: "Sirf ek NIC" }],
            ["Broadcast", { en: "All 48 bits are 1", hi: "Saare 48 bits 1 hain" }, "`FFFF.FFFF.FFFF`", { en: "Every device in the LAN (VLAN)", hi: "LAN (VLAN) ka har device" }],
            ["Multicast", { en: "I/G bit 1, but not all ones", hi: "I/G bit 1, lekin saare bits 1 nahi" }, "`0100.5E00.0005`", { en: "NICs that joined that group", hi: "Woh NICs jinhone woh group join kiya hai" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "The **I/G bit** (individual/group) is the lowest bit of the first byte. 0 means individual (unicast); 1 means group (multicast or broadcast). Ethernet sends each byte lowest bit first, so the I/G bit is the very first address bit on the wire.",
            hi: "**I/G bit** (individual/group) pehle byte ka sabse lowest bit hai. 0 matlab individual (unicast); 1 matlab group (multicast ya broadcast). Ethernet har byte ka lowest bit pehle bhejta hai, isliye wire par address ka sabse pehla bit I/G bit hi hota hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "`0100.5Exx.xxxx`: IPv4 multicast. The last 23 bits come from the IPv4 group address, so OSPF's `224.0.0.5` becomes `0100.5E00.0005`.",
              hi: "`0100.5Exx.xxxx`: IPv4 multicast. Aakhri 23 bits IPv4 group address se aate hain, isliye OSPF ka `224.0.0.5` ban jaata hai `0100.5E00.0005`.",
            },
            {
              en: "`3333.xxxx.xxxx`: IPv6 multicast, which replaces broadcast in IPv6.",
              hi: "`3333.xxxx.xxxx`: IPv6 multicast, jo IPv6 mein broadcast ki jagah leta hai.",
            },
            {
              en: "`0180.C200.0000`: Spanning Tree BPDUs. `0100.0CCC.CCCC`: Cisco CDP. Both come later in the course.",
              hi: "`0180.C200.0000`: Spanning Tree BPDUs. `0100.0CCC.CCCC`: Cisco CDP. Dono course mein aage aayenge.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Quick test for a group address", hi: "Group address ka quick test" },
          text: {
            en: "Look at the second hex digit. Odd (1, 3, 5, 7, 9, B, D, F) means the I/G bit is 1: multicast or broadcast. Even means unicast. A **source** MAC is always unicast; `FFFF.FFFF.FFFF` only ever appears as a destination.",
            hi: "Second hex digit dekho. Odd (1, 3, 5, 7, 9, B, D, F) matlab I/G bit 1 hai: multicast ya broadcast. Even matlab unicast. **Source** MAC hamesha unicast hota hai; `FFFF.FFFF.FFFF` sirf destination mein hi aata hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Switches handle the three kinds differently. A known unicast goes out of one port. A broadcast is flooded out of every port in the VLAN. Multicast is flooded too, unless the switch runs IGMP snooping (beyond the CCNA). The Ethernet switching lesson shows how a switch learns which port leads to which unicast MAC.",
            hi: "Switch teeno types ko alag tarah se handle karta hai. Known unicast sirf ek port se jaata hai. Broadcast VLAN ke har port se flood hota hai. Multicast bhi flood hota hai, jab tak switch IGMP snooping na chala raha ho (CCNA se aage ka topic). Ethernet switching lesson mein dekhoge ki switch kaise seekhta hai ki kaunsa unicast MAC kis port par hai.",
          },
        },
      ],
    },
    {
      id: "on-real-devices",
      heading: { en: "Finding MACs and frame errors on real devices", hi: "Real devices par MAC aur frame errors dhoondhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "You will learn to reach the Cisco prompt in the next lesson. For now, practise reading the output: the MAC address, the MTU, and the counters for runts, giants and CRC errors.",
            hi: "Cisco prompt tak pahunchna agle lesson mein seekhoge. Abhi sirf output padhne ki practice karo: MAC address, MTU, aur runts, giants aur CRC errors ke counters.",
          },
        },
        {
          type: "cli",
          title: { en: "A router interface (shortened)", hi: "Router ka ek interface (chhota kiya hua)" },
          lines: [
            { prompt: "R1#", cmd: "show interfaces gigabitethernet0/0" },
            { out: "GigabitEthernet0/0 is up, line protocol is up" },
            { out: "  Hardware is CN Gigabit Ethernet, address is 0011.2233.4401 (bia 0011.2233.4401)", comment: { en: "Current MAC, then the burned-in address (bia)", hi: "Current MAC, phir burned-in address (bia)" } },
            { out: "  Internet address is 10.1.1.1/24" },
            { out: "  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,", comment: { en: "Largest payload per frame", hi: "Ek frame mein sabse bada payload" } },
            { out: "  Encapsulation ARPA, loopback not set", comment: { en: "ARPA means Ethernet II framing", hi: "ARPA ka matlab Ethernet II framing" } },
            { out: "     Received 312 broadcasts (0 IP multicasts)" },
            { out: "     0 runts, 0 giants, 0 throttles" },
            { out: "     27 input errors, 27 CRC, 0 frame, 0 overrun, 0 ignored", comment: { en: "27 frames failed the FCS check: suspect the cable", hi: "27 frames FCS check mein fail hue: cable par shak karo" } },
          ],
          note: {
            en: "The two addresses on the Hardware line usually match. The first one can be changed in software; the bia is fixed in the hardware.",
            hi: "Hardware line ke dono addresses aam taur par same hote hain. Pehla address software se badla ja sakta hai; bia hardware mein fixed hota hai.",
          },
        },
        {
          type: "cli",
          title: { en: "The same idea on a PC", hi: "PC par yahi cheez" },
          lines: [
            { prompt: "C:\\>", cmd: "ipconfig /all" },
            { out: "   Physical Address. . . . . . . . . : 00-50-56-AA-00-01", comment: { en: "Windows: hyphens, capitals", hi: "Windows: hyphens, capital letters" } },
            { prompt: "$", cmd: "ip link show eth0" },
            { out: "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP" },
            { out: "    link/ether 00:50:56:aa:00:01 brd ff:ff:ff:ff:ff:ff", comment: { en: "Linux: your MAC, then the broadcast address", hi: "Linux: tumhara MAC, phir broadcast address" } },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Ethernet frame", def: { en: "The Layer 2 unit Ethernet sends: a 14-byte header, a 46-1500 byte payload and a 4-byte FCS.", hi: "Layer 2 ki unit jo Ethernet bhejta hai: 14-byte header, 46-1500 byte payload aur 4-byte FCS." } },
    { term: "MAC address", def: { en: "A 48-bit address, written as 12 hex digits, that identifies one network interface on a LAN.", hi: "48-bit address, 12 hex digits mein likha hua, jo LAN par ek network interface ko identify karta hai." } },
    { term: "OUI", def: { en: "The first 24 bits of a MAC address, assigned by the IEEE to a manufacturer.", hi: "MAC address ke pehle 24 bits, jo IEEE kisi manufacturer ko assign karta hai." } },
    { term: "EtherType", def: { en: "The 2-byte value after the source MAC that names the payload protocol, such as 0x0800 for IPv4.", hi: "Source MAC ke baad ki 2-byte value jo payload ka protocol batati hai, jaise IPv4 ke liye 0x0800." } },
    { term: "FCS", def: { en: "Frame Check Sequence: a 4-byte CRC-32 at the end of the frame that lets the receiver detect damage.", hi: "Frame Check Sequence: frame ke end mein 4-byte ka CRC-32, jisse receiver damage pakad leta hai." } },
    { term: "I/G bit", def: { en: "The lowest bit of a MAC's first byte: 0 for unicast, 1 for multicast or broadcast.", hi: "MAC ke pehle byte ka lowest bit: unicast ke liye 0, multicast ya broadcast ke liye 1." } },
    { term: "Broadcast MAC", def: { en: "FFFF.FFFF.FFFF, all 48 bits set. Every device in the VLAN accepts it.", hi: "FFFF.FFFF.FFFF, saare 48 bits 1. VLAN ka har device ise accept karta hai." } },
    { term: "MTU", def: { en: "Maximum transmission unit: the largest packet one frame can carry, 1500 bytes on standard Ethernet.", hi: "Maximum transmission unit: sabse bada packet jo ek frame le ja sakta hai, standard Ethernet par 1500 bytes." } },
  ],
  commands: [
    { cmd: "show interfaces gigabitethernet0/0", mode: "Cisco user or privileged EXEC", does: { en: "Show the interface MAC, MTU and error counters such as runts, giants and CRC", hi: "Interface ka MAC, MTU aur runts, giants, CRC jaise error counters dikhata hai" } },
    { cmd: "ipconfig /all", mode: "Windows command prompt", does: { en: "Show each adapter's Physical Address (MAC)", hi: "Har adapter ka Physical Address (MAC) dikhata hai" } },
    { cmd: "ip link show", mode: "Linux terminal", does: { en: "Show each interface's MAC (link/ether) and MTU", hi: "Har interface ka MAC (link/ether) aur MTU dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Counting the preamble and SFD in the frame size. The 64-1518 byte range runs from the destination MAC to the end of the FCS.",
      hi: "Preamble aur SFD ko frame size mein ginna. 64-1518 byte ki range destination MAC se FCS ke end tak hoti hai.",
    },
    {
      en: "Mixing up 1500 and 1518. 1500 is the MTU, the largest payload. 1518 is the largest frame, including the 14-byte header and 4-byte FCS.",
      hi: "1500 aur 1518 mein confuse hona. 1500 MTU hai, yaani sabse bada payload. 1518 sabse bada frame hai, 14-byte header aur 4-byte FCS ke saath.",
    },
    {
      en: "Thinking the FCS repairs errors or triggers a resend. Ethernet only detects the damage and drops the frame; TCP, if in use, resends the data.",
      hi: "Yeh sochna ki FCS error theek karta hai ya resend karwata hai. Ethernet sirf damage pakad kar frame drop karta hai; TCP ho toh woh data dobara bhejta hai.",
    },
    {
      en: "Thinking a MAC address tells you where a device is. The OUI only names the manufacturer. MAC addressing is flat, which is why it works only inside one LAN.",
      hi: "Yeh sochna ki MAC address batata hai device kahan hai. OUI sirf manufacturer batata hai. MAC addressing flat hai, isliye yeh sirf ek LAN ke andar kaam karti hai.",
    },
    {
      en: "Putting a broadcast or multicast address in the source field. The source MAC is always the sender's own unicast address.",
      hi: "Source field mein broadcast ya multicast address maan lena. Source MAC hamesha sender ka apna unicast address hota hai.",
    },
    {
      en: "Treating `0050.56aa.0002` and `00-50-56-AA-00-02` as two different addresses. They are the same 48 bits in Cisco and Windows notation.",
      hi: "`0050.56aa.0002` aur `00-50-56-AA-00-02` ko do alag addresses samajhna. Dono wahi 48 bits hain, bas Cisco aur Windows notation mein.",
    },
  ],
  recap: [
    { en: "Ethernet II: preamble 7, SFD 1, then destination 6, source 6, type 2, payload 46-1500, FCS 4.", hi: "Ethernet II: preamble 7, SFD 1, phir destination 6, source 6, type 2, payload 46-1500, FCS 4." },
    { en: "Frames are 64-1518 bytes, not counting preamble and SFD. Short payloads are padded to 46. The MTU is 1500.", hi: "Frame 64-1518 bytes ka hota hai, preamble aur SFD ko chhod kar. Chhota payload 46 tak pad hota hai. MTU 1500 hai." },
    { en: "EtherType 0x0800 = IPv4, 0x0806 = ARP, 0x86DD = IPv6.", hi: "EtherType batata hai payload mein kya hai: 0x0800 = IPv4, 0x0806 = ARP, 0x86DD = IPv6." },
    { en: "The FCS (CRC-32) detects damage; bad frames are dropped, not repaired, and the CRC counter goes up.", hi: "FCS (CRC-32) damage pakadta hai; kharab frames drop hote hain, repair nahi, aur CRC counter badhta hai." },
    { en: "A MAC is 48 bits: 24-bit OUI from the IEEE plus 24 bits set by the manufacturer. Cisco writes it as 0050.56aa.0002.", hi: "MAC 48 bits ka hai: IEEE ka 24-bit OUI plus manufacturer ke 24 bits. Cisco ise 0050.56aa.0002 likhta hai." },
    { en: "I/G bit 0 = unicast, 1 = group. FFFF.FFFF.FFFF is broadcast; 0100.5E is IPv4 multicast; source MACs are always unicast.", hi: "I/G bit 0 = unicast, 1 = group. FFFF.FFFF.FFFF broadcast hai; 0100.5E IPv4 multicast hai; source MAC hamesha unicast hota hai." },
  ],
  quiz: [
    {
      q: {
        en: "A host sends a 28-byte ARP message inside an Ethernet frame. How many bytes of padding does it add?",
        hi: "Ek host 28-byte ka ARP message Ethernet frame mein bhejta hai. Woh kitne bytes ki padding jodta hai?",
      },
      options: [
        { en: "0", hi: "0" },
        { en: "18", hi: "18" },
        { en: "36", hi: "36" },
        { en: "46", hi: "46" },
      ],
      answer: 1,
      explain: {
        en: "The payload must be at least 46 bytes, so 46 − 28 = 18 bytes of padding. The frame is then 14 + 46 + 4 = 64 bytes. 36 is what you get if you wrongly subtract 28 from the 64-byte frame size instead of from the 46-byte payload minimum.",
        hi: "Payload kam se kam 46 bytes ka hona chahiye, toh 46 − 28 = 18 bytes padding. Tab frame 14 + 46 + 4 = 64 bytes ka banta hai. 36 tab aata hai jab galti se 28 ko 46-byte payload minimum ki jagah 64-byte frame size se ghata dete ho.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "PC-B receives a frame, recalculates the CRC and gets a different value from the FCS. What does PC-B's NIC do?",
        hi: "PC-B ko ek frame milta hai, woh CRC dobara calculate karta hai aur value FCS se alag aati hai. PC-B ka NIC kya karta hai?",
      },
      options: [
        { en: "Discards the frame", hi: "Frame discard kar deta hai" },
        { en: "Uses the FCS to correct the damaged bits", hi: "FCS se kharab bits theek kar deta hai" },
        { en: "Asks the sender to transmit the frame again", hi: "Sender se frame dobara bhejne ko kehta hai" },
        { en: "Passes the payload up and lets IP decide", hi: "Payload upar bhej deta hai aur IP ko decide karne deta hai" },
      ],
      answer: 0,
      explain: {
        en: "The FCS can only detect damage, not locate or fix it, and Ethernet has no resend mechanism. The frame is dropped and the CRC counter increases. If TCP is carrying the data, TCP notices the missing bytes later and resends them.",
        hi: "FCS sirf damage pakad sakta hai, use dhoondh ya theek nahi kar sakta, aur Ethernet mein resend ka koi system nahi hai. Frame drop hota hai aur CRC counter badhta hai. Agar data TCP le ja raha hai, toh TCP baad mein missing bytes notice karke dobara bhejta hai.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which of these is an IPv4 multicast MAC address?", hi: "Inme se kaunsa IPv4 multicast MAC address hai?" },
      options: [
        { en: "0050.56aa.0001", hi: "0050.56aa.0001" },
        { en: "FFFF.FFFF.FFFF", hi: "FFFF.FFFF.FFFF" },
        { en: "0200.5e00.0005", hi: "0200.5e00.0005" },
        { en: "0100.5e00.0005", hi: "0100.5e00.0005" },
      ],
      answer: 3,
      explain: {
        en: "IPv4 multicast MACs start with 0100.5E, and the first byte 01 has its I/G bit set. FFFF.FFFF.FFFF is the broadcast address. 0200.5e00.0005 looks similar, but its first byte 02 is even, so the I/G bit is 0 and it is unicast.",
        hi: "IPv4 multicast MAC 0100.5E se shuru hote hain, aur pehle byte 01 ka I/G bit 1 hai. FFFF.FFFF.FFFF broadcast address hai. 0200.5e00.0005 milta-julta dikhta hai, lekin iska pehla byte 02 even hai, toh I/G bit 0 hai aur yeh unicast hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "`show interfaces` on a router shows `address is 0011.2233.4401 (bia 0011.2233.4401)`. Which part is the OUI?",
        hi: "Router par `show interfaces` mein `address is 0011.2233.4401 (bia 0011.2233.4401)` dikhta hai. Isme OUI kaunsa hissa hai?",
      },
      options: [
        { en: "The last 4 hex digits: 44-01", hi: "Aakhri 4 hex digits: 44-01" },
        { en: "The last 6 hex digits: 33-44-01", hi: "Aakhri 6 hex digits: 33-44-01" },
        { en: "The first 6 hex digits: 00-11-22", hi: "Pehle 6 hex digits: 00-11-22" },
        { en: "The first 8 hex digits: 00-11-22-33", hi: "Pehle 8 hex digits: 00-11-22-33" },
      ],
      answer: 2,
      explain: {
        en: "The OUI is the first 24 bits. Each hex digit is 4 bits, so that is the first 6 hex digits: 00-11-22. The dots in Cisco's format split the address every 4 digits, so they do not mark the OUI boundary. 00-11-22-33 is 8 hex digits (32 bits), and 33-44-01 is the device part the manufacturer assigns.",
        hi: "OUI pehle 24 bits hain. Har hex digit 4 bits ka hai, toh yeh pehle 6 hex digits hue: 00-11-22. Cisco format ke dots har 4 digits par address ko todte hain, isliye woh OUI ki boundary nahi dikhate. 00-11-22-33 mein 8 hex digits (32 bits) hain, aur 33-44-01 woh device part hai jo manufacturer assign karta hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A frame's Type field contains 0x86DD. What does the payload carry?",
        hi: "Ek frame ke Type field mein 0x86DD hai. Payload mein kya hai?",
      },
      options: [
        { en: "An IPv4 packet", hi: "IPv4 packet" },
        { en: "An IPv6 packet", hi: "IPv6 packet" },
        { en: "An ARP message", hi: "ARP message" },
        { en: "An 802.1Q VLAN tag", hi: "802.1Q VLAN tag" },
      ],
      answer: 1,
      explain: {
        en: "0x86DD is the EtherType for IPv6. IPv4 is 0x0800, ARP is 0x0806 and an 802.1Q tag is 0x8100. The receiver uses this value to decide which protocol gets the payload.",
        hi: "0x86DD IPv6 ka EtherType hai. IPv4 0x0800 hai, ARP 0x0806 aur 802.1Q tag 0x8100. Receiver isi value se decide karta hai ki payload kis protocol ko dena hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Not counting the preamble and SFD, what is the largest standard Ethernet frame without a VLAN tag?",
        hi: "Preamble aur SFD ko chhod kar, bina VLAN tag ke sabse bada standard Ethernet frame kitne bytes ka hota hai?",
      },
      options: [
        { en: "1500 bytes", hi: "1500 bytes" },
        { en: "1526 bytes", hi: "1526 bytes" },
        { en: "64 bytes", hi: "64 bytes" },
        { en: "1518 bytes", hi: "1518 bytes" },
      ],
      answer: 3,
      explain: {
        en: "14-byte header + 1500-byte payload + 4-byte FCS = 1518 bytes. 1500 is only the payload (the MTU), and 1526 wrongly adds the 8 bytes of preamble and SFD.",
        hi: "14-byte header + 1500-byte payload + 4-byte FCS = 1518 bytes. 1500 sirf payload (MTU) hai, aur 1526 mein galti se preamble aur SFD ke 8 bytes jod diye gaye hain.",
      },
      kind: "calc",
    },
  ],
  videos: [
    {
      id: "u2n762WG0Vo",
      title: "Free CCNA | Ethernet LAN Switching (Part 1) | Day 5",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Walks through the Ethernet header and trailer fields and MAC address structure, then starts on switching, which is the next lesson here.",
        hi: "Ethernet header aur trailer ke fields aur MAC address ka structure samjhata hai, phir switching shuru karta hai, jo yahan agla lesson hai.",
      },
    },
    {
      id: "aGxcoIXX-rk",
      title: "82. Free CCNA (NEW) | Working of Switches - Frame Structure",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "A Hindi explanation of the Ethernet frame structure, field by field.", hi: "Ethernet frame structure ka Hindi explanation, har field ke saath." },
    },
    {
      id: "uGeawDYFDug",
      title: "4. MAC Address Explained | CCNA 200-301 (Hindi) Course",
      channel: "NetworkPath",
      lang: "hi",
      note: { en: "A short Hindi video on what a MAC address is and how it is structured.", hi: "MAC address kya hai aur uska structure kaisa hai, is par chhota Hindi video." },
    },
  ],
  lab: {
    title: { en: "Look inside real frames in Packet Tracer", hi: "Packet Tracer mein asli frames ke andar dekho" },
    steps: [
      {
        en: "Place a 2960 switch and two PCs. Connect them with copper straight-through cables and give the PCs 10.1.1.10/24 and 10.1.1.20/24.",
        hi: "Ek 2960 switch aur do PCs rakho. Unhe copper straight-through cables se jodo aur PCs ko 10.1.1.10/24 aur 10.1.1.20/24 do.",
      },
      {
        en: "On each PC open Desktop > Command Prompt and run `ipconfig /all`. Write down the physical address, split it into OUI and device part, and rewrite it in the other two formats.",
        hi: "Har PC par Desktop > Command Prompt kholo aur `ipconfig /all` chalao. Physical address note karo, use OUI aur device part mein todo, aur baaki do formats mein bhi likho.",
      },
      {
        en: "Switch to Simulation mode, set the event filter to ARP and ICMP only, and ping 10.1.1.20 from the first PC.",
        hi: "Simulation mode mein jao, event filter sirf ARP aur ICMP par set karo, aur pehle PC se 10.1.1.20 ping karo.",
      },
      {
        en: "Click the first ARP event and open its PDU details. Find the Ethernet destination `FFFF.FFFF.FFFF` and the ARP type value, `0x0806`.",
        hi: "Pehle ARP event par click karke uski PDU details kholo. Ethernet destination `FFFF.FFFF.FFFF` aur ARP ki type value `0x0806` dhoondho.",
      },
      {
        en: "Open an ICMP event and compare: the destination is now the other PC's MAC and the type is `0x0800` (IPv4).",
        hi: "Ab ek ICMP event kholo aur compare karo: destination ab doosre PC ka MAC hai aur type `0x0800` (IPv4) hai.",
      },
      {
        en: "Optional, on your own computer: capture with Wireshark and look for destinations starting with `01:00:5e` or `33:33`. Wireshark usually does not show the preamble, SFD or FCS, because the NIC removes them before the operating system sees the frame.",
        hi: "Optional, apne computer par: Wireshark se capture karo aur `01:00:5e` ya `33:33` se shuru hone wale destinations dhoondho. Wireshark aam taur par preamble, SFD ya FCS nahi dikhata, kyunki operating system tak frame pahunchne se pehle NIC unhe hata deta hai.",
      },
    ],
  },
};

export default lesson;
