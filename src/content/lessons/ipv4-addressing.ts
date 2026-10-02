import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "ipv4-addressing",
  intro: {
    en: "Every device that speaks IPv4 needs an address, and every forwarding decision starts by splitting that address into two parts: which network, and which host on it. In the ARP lesson PC-A had to decide whether a destination was local or remote; this lesson shows exactly how that split is made. Once you can read it, you can find the network and broadcast addresses, count the hosts, and configure a router interface correctly.",
    hi: "IPv4 use karne wale har device ko ek address chahiye, aur har forwarding decision us address ko do hisson mein todne se shuru hota hai: kaunsa network, aur us network par kaunsa host. ARP lesson mein PC-A ko decide karna tha ki destination local hai ya remote; yeh lesson dikhata hai ki woh split exactly kaise hota hai. Ek baar yeh padhna aa gaya, toh network aur broadcast address nikal loge, hosts gin loge, aur router interface sahi se configure kar loge.",
  },
  outcomes: [
    { en: "Convert an IPv4 address between dotted decimal and binary", hi: "IPv4 address ko dotted decimal aur binary ke beech convert kar sako" },
    { en: "Split an address into network and host portions using a prefix length or a dotted mask", hi: "Prefix length ya dotted mask se address ko network aur host portion mein baant sako" },
    { en: "Name the class of an address from its first octet and give its default mask", hi: "First octet dekh kar address ki class aur uska default mask bata sako" },
    { en: "Work out the network address, broadcast address and usable host count for /8, /16 and /24 networks", hi: "/8, /16 aur /24 networks ka network address, broadcast address aur usable host count nikal sako" },
    { en: "Configure and verify an IPv4 address on a Cisco router interface", hi: "Cisco router interface par IPv4 address configure aur verify kar sako" },
    { en: "Explain what the TTL, protocol, source and destination fields of the IPv4 header do", hi: "IPv4 header ke TTL, protocol, source aur destination fields ka kaam samjha sako" },
  ],
  sections: [
    {
      id: "what-an-ipv4-address-is",
      heading: { en: "32 bits written as four numbers", hi: "32 bits, chaar numbers mein likhe hue" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An IPv4 address is a 32-bit number. Nobody wants to read 32 ones and zeros, so we cut it into four 8-bit pieces called **octets**, write each octet in decimal and put dots between them. That is **dotted decimal**: `192.168.1.10`.",
            hi: "IPv4 address ek 32-bit number hai. 32 ones aur zeros padhna kisi ke bas ki baat nahi, isliye ise chaar 8-bit hisson mein kaat dete hain jinhe **octets** kehte hain. Har octet ko decimal mein likhte hain aur beech mein dots lagate hain. Isi ko **dotted decimal** kehte hain: `192.168.1.10`.",
          },
        },
        {
          type: "p",
          text: {
            en: "Eight bits run from 00000000 to 11111111, so each octet is 0 to 255. An address such as `192.168.1.300` cannot exist. Convert each octet on its own with the place values from the binary lesson: 128 64 32 16 8 4 2 1.",
            hi: "Aath bits 00000000 se 11111111 tak jaate hain, isliye har octet 0 se 255 ke beech hota hai. `192.168.1.300` jaisa address ho hi nahi sakta. Binary lesson wali place values se har octet ko alag-alag convert karo: 128 64 32 16 8 4 2 1.",
          },
        },
        {
          type: "table",
          caption: { en: "192.168.1.10 in binary", hi: "192.168.1.10 binary mein" },
          columns: [
            { en: "Octet", hi: "Octet" },
            { en: "Decimal", hi: "Decimal" },
            { en: "Binary", hi: "Binary" },
            { en: "Place values that are 1", hi: "Kaunsi place values 1 hain" },
          ],
          rows: [
            ["1st", "192", "11000000", "128 + 64"],
            ["2nd", "168", "10101000", "128 + 32 + 8"],
            ["3rd", "1", "00000001", "1"],
            ["4th", "10", "00001010", "8 + 2"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Why 4.3 billion is not enough", hi: "4.3 billion kaafi kyun nahi" },
          text: {
            en: "32 bits give 2^32 = 4,294,967,296 addresses. That looked huge when IPv4 was defined in 1981 and is far too few for today's phones, laptops and servers. Private addresses with NAT (next lesson) and IPv6 (lesson 1.8) are the answers.",
            hi: "32 bits se 2^32 = 4,294,967,296 addresses bante hain. 1981 mein jab IPv4 bana, yeh bahut zyada lagta tha; aaj ke phones, laptops aur servers ke liye yeh bahut kam hai. Iska jawab hai private addresses ke saath NAT (agla lesson) aur IPv6 (lesson 1.8).",
          },
        },
      ],
    },
    {
      id: "network-and-host",
      heading: { en: "Network portion, host portion, and the mask", hi: "Network portion, host portion, aur mask" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every IPv4 address has two parts. The **network portion** (the left-hand bits) is the same for every device on one network. The **host portion** (the right-hand bits) is different for each device on that network. Routers choose a path using the network portion; the host portion only matters once the packet reaches the destination network.",
            hi: "Har IPv4 address ke do hisse hote hain. **Network portion** (left side ke bits) ek network ke har device ke liye same hota hai. **Host portion** (right side ke bits) us network ke har device ke liye alag hota hai. Router path chunne ke liye network portion dekhta hai; host portion tab matter karta hai jab packet destination network tak pahunch jaata hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "The address alone does not tell you where the split falls. You need the **prefix length**, written after a slash: `192.168.1.10/24` means the first 24 bits are network and the last 8 are host. The same information written as 32 bits is the **subnet mask**: 24 ones then 8 zeros, which is `255.255.255.0`.",
            hi: "Sirf address dekh kar pata nahi chalta ki split kahan hai. Iske liye **prefix length** chahiye, jo slash ke baad likhte hain: `192.168.1.10/24` ka matlab pehle 24 bits network hain aur aakhri 8 host. Yahi baat 32 bits mein likho toh woh **subnet mask** hai: 24 ones phir 8 zeros, yaani `255.255.255.0`.",
          },
        },
        {
          type: "table",
          caption: { en: "Prefix length and mask are two ways to write the same split", hi: "Prefix length aur mask, ek hi split ko likhne ke do tareeke" },
          columns: [
            { en: "Prefix", hi: "Prefix" },
            { en: "Dotted mask", hi: "Dotted mask" },
            { en: "Mask in binary", hi: "Mask binary mein" },
            { en: "Network / host bits", hi: "Network / host bits" },
          ],
          rows: [
            ["/8", "255.0.0.0", "11111111.00000000.00000000.00000000", "8 / 24"],
            ["/16", "255.255.0.0", "11111111.11111111.00000000.00000000", "16 / 16"],
            ["/24", "255.255.255.0", "11111111.11111111.11111111.00000000", "24 / 8"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Two devices are on the same network when their network bits are identical. PC-A is `192.168.1.10/24`. The router at `192.168.1.1` matches in all 24 network bits, so PC-A reaches it directly (after ARP). `192.168.2.10` differs in the third octet, so it is on another network and PC-A sends the packet to its default gateway. Hosts make this check with a bitwise AND of address and mask, which keeps the network bits and zeroes the host bits.",
            hi: "Do devices same network par tab hote hain jab unke network bits bilkul same hon. PC-A `192.168.1.10/24` hai. `192.168.1.1` wala router saare 24 network bits mein match karta hai, toh PC-A use seedha reach karta hai (ARP ke baad). `192.168.2.10` third octet mein alag hai, yaani doosra network, isliye PC-A packet apne default gateway ko bhejta hai. Host yeh check address aur mask ke bitwise AND se karta hai, jo network bits rakh leta hai aur host bits ko zero kar deta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Masks are ones, then zeros", hi: "Mask mein pehle ones, phir zeros" },
          text: {
            en: "A mask is always a continuous run of 1s followed by a run of 0s, so `255.0.255.0` is not a valid mask. A mask can also end inside an octet, such as /26 = `255.255.255.192`. The subnetting lesson (1.5) handles those; here we stay with /8, /16 and /24, where the split falls on a dot.",
            hi: "Mask hamesha lagatar 1s aur uske baad lagatar 0s hota hai, isliye `255.0.255.0` valid mask nahi hai. Mask kisi octet ke beech mein bhi khatam ho sakta hai, jaise /26 = `255.255.255.192`. Woh subnetting lesson (1.5) mein aayega; yahan hum /8, /16 aur /24 par rukte hain, jahan split theek dot par padta hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Mask, netmask, subnet mask and prefix length all describe the same split. Questions and answers use both forms, so convert /8, /16 and /24 to masks and back without thinking.",
            hi: "Mask, netmask, subnet mask aur prefix length, sab ek hi split batate hain. Questions aur options dono forms use karte hain, isliye /8, /16 aur /24 ko mask mein aur wapas bina soche convert karna aana chahiye.",
          },
        },
      ],
    },
    {
      id: "address-classes",
      heading: { en: "Address classes, and why they are history", hi: "Address classes, aur yeh history kyun hain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In the original 1981 design the split was not configured at all. It was fixed by the first few bits of the address, called its **class**. Subnet masks (1985) let an organisation divide its own class network, but on the internet the class still set the boundary until 1993. You can still read the class from the first octet:",
            hi: "1981 ke original design mein split configure hi nahi hota tha. Address ke shuru ke kuch bits se woh fixed ho jaata tha, jise address ki **class** kehte hain. 1985 mein subnet masks aaye, jinse organisation apne class network ko andar baant sakti thi, lekin internet par 1993 tak boundary class hi decide karti thi. Aaj bhi first octet dekh kar class padh sakte ho:",
          },
        },
        {
          type: "table",
          caption: { en: "The five classes", hi: "Paanch classes" },
          columns: [
            { en: "Class", hi: "Class" },
            { en: "First octet", hi: "First octet" },
            { en: "Leading bits", hi: "Shuru ke bits" },
            { en: "Default mask", hi: "Default mask" },
            { en: "Usable hosts per network", hi: "Har network mein usable hosts" },
          ],
          rows: [
            ["A", "1–126", "0", "/8 (255.0.0.0)", "16,777,214"],
            ["B", "128–191", "10", "/16 (255.255.0.0)", "65,534"],
            ["C", "192–223", "110", "/24 (255.255.255.0)", "254"],
            ["D", "224–239", "1110", { en: "None (multicast)", hi: "Koi nahi (multicast)" }, { en: "Not for hosts", hi: "Hosts ke liye nahi" }],
            ["E", "240–255", "1111", { en: "None (reserved)", hi: "Koi nahi (reserved)" }, { en: "Not for hosts", hi: "Hosts ke liye nahi" }],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**Why class A stops at 126:** a leading 0 covers 0–127, but `0.0.0.0/8` means \"this network\" and `127.0.0.0/8` is reserved for loopback, so neither is used as a class A network.",
              hi: "**Class A 126 par kyun rukti hai:** leading 0 se 0–127 tak aata hai, lekin `0.0.0.0/8` ka matlab \"this network\" hai aur `127.0.0.0/8` loopback ke liye reserved hai, isliye dono ko class A network ki tarah use nahi kiya jaata.",
            },
            {
              en: "**Class D** is multicast: one sender, a group of receivers. OSPF, for example, sends its hellos to `224.0.0.5`. A multicast address is never configured as an interface address.",
              hi: "**Class D** multicast hai: ek sender, receivers ka ek group. Jaise OSPF apne hellos `224.0.0.5` par bhejta hai. Multicast address ko kabhi interface address ki tarah configure nahi karte.",
            },
            {
              en: "**Class E** is reserved for experiments. `255.255.255.255` sits in this range but has its own meaning, covered in the next lesson.",
              hi: "**Class E** experiments ke liye reserved hai. `255.255.255.255` isi range mein aata hai lekin uska apna alag matlab hai, jo agle lesson mein aayega.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "Classes wasted addresses badly. A company with 300 hosts was too big for a class C (254 hosts), so it got a class B and left more than 65,000 addresses unused. In 1993 **CIDR** (Classless Inter-Domain Routing) removed the fixed boundaries: the prefix length, not the first octet, now decides the split. `10.1.1.0/24` is a perfectly normal network even though 10 is a \"class A\" number.",
            hi: "Classes mein addresses bahut waste hote the. 300 hosts wali company class C (254 hosts) mein fit nahi hoti thi, toh use class B mil jaati thi aur 65,000 se zyada addresses bekaar pade rehte the. 1993 mein **CIDR** (Classless Inter-Domain Routing) ne yeh fixed boundaries hata di: ab split prefix length decide karti hai, first octet nahi. `10.1.1.0/24` bilkul normal network hai, bhale hi 10 \"class A\" ka number ho.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Still on the exam", hi: "Exam mein ab bhi aata hai" },
          text: {
            en: "Know the class ranges, the default masks and the words classful and classless. In a real network, always use the prefix you are given. Packet Tracer and the Windows network settings fill in the class default mask when you type an address; check it, because it is often not the mask you designed.",
            hi: "Class ranges, default masks aur classful/classless ka matlab yaad rakho. Real network mein hamesha wahi prefix use karo jo diya gaya hai. Packet Tracer aur Windows network settings address type karte hi class ka default mask bhar dete hain; use check karo, kyunki aksar woh tumhara design kiya hua mask nahi hota.",
          },
        },
      ],
    },
    {
      id: "network-broadcast-hosts",
      heading: { en: "Network address, broadcast address and host count", hi: "Network address, broadcast address aur host count" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Two addresses in every network are reserved, and you find both by setting the host bits:",
            hi: "Har network mein do addresses reserved hote hain, aur dono host bits set karke milte hain:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Network address**: all host bits 0. It names the network itself and is what a routing table shows. Example: `192.168.1.0/24`.",
              hi: "**Network address**: saare host bits 0. Yeh network ka naam hai, aur routing table mein yahi dikhta hai. Example: `192.168.1.0/24`.",
            },
            {
              en: "**Broadcast address**: all host bits 1. A packet sent here goes to every host on that network. Example: `192.168.1.255`.",
              hi: "**Broadcast address**: saare host bits 1. Is par bheja gaya packet us network ke har host tak jaata hai. Example: `192.168.1.255`.",
            },
            {
              en: "**Usable range**: everything in between, from network + 1 to broadcast − 1. Example: `192.168.1.1` to `192.168.1.254`.",
              hi: "**Usable range**: dono ke beech ka sab kuch, network + 1 se broadcast − 1 tak. Example: `192.168.1.1` se `192.168.1.254`.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "With h host bits there are 2^h addresses. Take away the network and broadcast addresses and you get **usable hosts = 2^h − 2**. For a /8, /16 or /24 you find the network by keeping the network octets and setting the host octets to 0. For `172.16.40.7/16` that gives network `172.16.0.0` and broadcast `172.16.255.255`.",
            hi: "h host bits hon toh 2^h addresses bante hain. Network aur broadcast address minus karo toh **usable hosts = 2^h − 2**. /8, /16 ya /24 mein network nikalne ke liye network octets waise hi rakho aur host octets 0 kar do. `172.16.40.7/16` ka network `172.16.0.0` aur broadcast `172.16.255.255` hoga.",
          },
        },
        {
          type: "table",
          caption: { en: "Three networks worked out", hi: "Teen networks solve karke" },
          columns: [
            { en: "Network", hi: "Network" },
            { en: "Broadcast", hi: "Broadcast" },
            { en: "First usable", hi: "First usable" },
            { en: "Last usable", hi: "Last usable" },
            { en: "Usable hosts", hi: "Usable hosts" },
          ],
          rows: [
            ["10.0.0.0/8", "10.255.255.255", "10.0.0.1", "10.255.255.254", "2^24 − 2 = 16,777,214"],
            ["172.16.0.0/16", "172.16.255.255", "172.16.0.1", "172.16.255.254", "2^16 − 2 = 65,534"],
            ["192.168.1.0/24", "192.168.1.255", "192.168.1.1", "192.168.1.254", "2^8 − 2 = 254"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Reserved means reserved", hi: "Reserved matlab reserved" },
          text: {
            en: "Neither the network nor the broadcast address can go on a host or an interface; IOS rejects `ip address 192.168.1.0 255.255.255.0` and `ip address 192.168.1.255 255.255.255.0`. Two exceptions come later: a /31 on a point-to-point link uses both of its addresses, and a /32 names exactly one host.",
            hi: "Network aur broadcast address, dono mein se koi bhi host ya interface par nahi lagta; IOS `ip address 192.168.1.0 255.255.255.0` aur `ip address 192.168.1.255 255.255.255.0` reject kar deta hai. Do exceptions baad mein aayenge: point-to-point link par /31 apne dono addresses use karta hai, aur /32 sirf ek host ko represent karta hai.",
          },
        },
      ],
    },
    {
      id: "configure-on-cisco",
      heading: { en: "Putting an address on a Cisco interface", hi: "Cisco interface par address lagana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A router needs one address in every network it connects to, and that address is what hosts on the network use as their default gateway. You set it in interface configuration mode with the address and a dotted mask. Router interfaces start **administratively down**, so finish with `no shutdown`. Switch ports are the opposite: enabled by default.",
            hi: "Router ko har us network mein ek address chahiye jisse woh juda hai, aur wahi address us network ke hosts ka default gateway banta hai. Ise interface configuration mode mein address aur dotted mask ke saath set karte hain. Router interfaces shuru mein **administratively down** hote hain, isliye end mein `no shutdown` zaroor karo. Switch ports ulta hain: by default enabled.",
          },
        },
        {
          type: "cli",
          title: { en: "Configure Gi0/0 as the gateway for 192.168.1.0/24", hi: "Gi0/0 ko 192.168.1.0/24 ka gateway banao" },
          lines: [
            { prompt: "R1>", cmd: "enable" },
            { prompt: "R1#", cmd: "configure terminal" },
            { prompt: "R1(config)#", cmd: "interface gigabitethernet0/0" },
            {
              prompt: "R1(config-if)#",
              cmd: "ip address 192.168.1.1 255.255.255.0",
              comment: { en: "Address, then the dotted mask. IOS does not take /24 here.", hi: "Pehle address, phir dotted mask. IOS yahan /24 nahi leta." },
            },
            { prompt: "R1(config-if)#", cmd: "no shutdown" },
            { out: "%LINK-3-UPDOWN: Interface GigabitEthernet0/0, changed state to up" },
            { out: "%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0, changed state to up" },
            { prompt: "R1(config-if)#", cmd: "end" },
          ],
        },
        {
          type: "cli",
          title: { en: "Verify", hi: "Verify karo" },
          lines: [
            { prompt: "R1#", cmd: "show ip interface brief" },
            { out: "Interface                  IP-Address      OK? Method Status                Protocol" },
            {
              out: "GigabitEthernet0/0         192.168.1.1     YES manual up                    up",
              comment: { en: "Configured by hand, enabled, and working", hi: "Haath se configure kiya, enabled hai, aur chal raha hai" },
            },
            {
              out: "GigabitEthernet0/1         unassigned      YES unset  administratively down down",
              comment: { en: "Never configured and still shut down", hi: "Kabhi configure nahi hua, aur abhi bhi shut down hai" },
            },
            { prompt: "R1#", cmd: "show ip interface gigabitethernet0/0 | include Internet" },
            {
              out: "  Internet address is 192.168.1.1/24",
              comment: { en: "The brief view hides the mask; this line shows it as a prefix", hi: "Brief view mask nahi dikhata; yeh line use prefix ke roop mein dikhati hai" },
            },
          ],
          note: {
            en: "Status is about Layer 1 and whether the interface is enabled; Protocol is about Layer 2. You want up/up. `administratively down` always means the interface is shut down in the configuration, not a cable fault.",
            hi: "Status Layer 1 aur interface enabled hai ya nahi, yeh batata hai; Protocol Layer 2 ke baare mein hai. Tumhe up/up chahiye. `administratively down` ka matlab hamesha yahi hai ki configuration mein interface shut down hai, cable ki galti nahi.",
          },
        },
      ],
    },
    {
      id: "ipv4-header",
      heading: { en: "The IPv4 header fields that matter", hi: "IPv4 header ke kaam ke fields" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The addresses you configure travel in the IPv4 header, which IP puts in front of the data it carries, such as a TCP segment (you met it in the encapsulation lesson). Without options the header is 20 bytes. For the CCNA, know these fields:",
            hi: "Jo addresses tum configure karte ho, woh IPv4 header mein travel karte hain, jise IP apne data ke aage lagata hai, jaise TCP segment ke aage (encapsulation lesson mein dekha tha). Options ke bina header 20 bytes ka hota hai. CCNA ke liye yeh fields pata hone chahiye:",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Field", hi: "Field" },
            { en: "Size", hi: "Size" },
            { en: "What it does", hi: "Kya karta hai" },
          ],
          rows: [
            ["Version", "4 bits", { en: "4 for IPv4 (6 for IPv6).", hi: "IPv4 ke liye 4 (IPv6 ke liye 6)." }],
            [
              "Time to Live (TTL)",
              "8 bits",
              {
                en: "Each router subtracts 1. At 0 the router drops the packet and sends ICMP Time Exceeded to the source, so a routing loop cannot carry a packet forever. Common starting values: Windows 128, Linux 64, Cisco IOS 255.",
                hi: "Har router isme se 1 ghatata hai. 0 hone par router packet drop karta hai aur source ko ICMP Time Exceeded bhejta hai, taaki routing loop mein packet hamesha ghoomta na rahe. Aam starting values: Windows 128, Linux 64, Cisco IOS 255.",
              },
            ],
            [
              "Protocol",
              "8 bits",
              { en: "What is inside the packet: 1 = ICMP, 6 = TCP, 17 = UDP, 89 = OSPF.", hi: "Packet ke andar kya hai: 1 = ICMP, 6 = TCP, 17 = UDP, 89 = OSPF." },
            ],
            ["Source address", "32 bits", { en: "The sender's IPv4 address.", hi: "Sender ka IPv4 address." }],
            [
              "Destination address",
              "32 bits",
              { en: "The final destination. Every router reads it to choose the next hop.", hi: "Final destination. Har router ise padh kar next hop chunta hai." },
            ],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "What changes at each hop", hi: "Har hop par kya badalta hai" },
          text: {
            en: "A router lowers the TTL and recalculates the header checksum, but the source and destination IP addresses stay the same end to end (unless NAT rewrites them). The Ethernet header is different: it is rebuilt with new MAC addresses on every hop, as the ARP lesson showed.",
            hi: "Router TTL kam karta hai aur header checksum dobara calculate karta hai, lekin source aur destination IP addresses shuru se aakhir tak same rehte hain (jab tak NAT unhe na badle). Ethernet header alag hai: woh har hop par naye MAC addresses ke saath dobara banta hai, jaise ARP lesson mein dekha.",
          },
        },
        {
          type: "p",
          text: {
            en: "Other fields, such as DSCP for QoS and the fragmentation fields, come up in later lessons.",
            hi: "Baaki fields, jaise QoS ke liye DSCP aur fragmentation wale fields, aage ke lessons mein aayenge.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Octet", def: { en: "One 8-bit part of an IPv4 address, written as a decimal number from 0 to 255.", hi: "IPv4 address ka ek 8-bit hissa, jo 0 se 255 tak ke decimal number mein likha jaata hai." } },
    { term: "Network portion", def: { en: "The left-hand bits of an address, shared by every device on the same network; the remaining bits are the host portion.", hi: "Address ke left side ke bits, jo same network ke har device mein common hote hain; baaki bits host portion hain." } },
    { term: "Prefix length", def: { en: "The number of network bits, written after a slash, such as /24.", hi: "Network bits ki ginti, jo slash ke baad likhi jaati hai, jaise /24." } },
    { term: "Subnet mask", def: { en: "The same split written as 32 bits: ones for network bits, zeros for host bits, such as 255.255.255.0.", hi: "Wahi split 32 bits mein: network bits ke liye ones, host bits ke liye zeros, jaise 255.255.255.0." } },
    { term: "Network address", def: { en: "The first address of a network, with all host bits 0. It names the network and cannot be given to a host.", hi: "Network ka pehla address, jisme saare host bits 0 hote hain. Yeh network ka naam hai aur kisi host ko nahi diya ja sakta." } },
    { term: "Broadcast address", def: { en: "The last address of a network, with all host bits 1. A packet sent to it reaches every host on that network.", hi: "Network ka aakhri address, jisme saare host bits 1 hote hain. Is par bheja gaya packet us network ke har host tak pahunchta hai." } },
    { term: "CIDR", def: { en: "Classless Inter-Domain Routing (1993): the prefix length, not the address class, decides the network and host split.", hi: "Classless Inter-Domain Routing (1993): network aur host ka split prefix length decide karti hai, address ki class nahi." } },
    { term: "TTL", def: { en: "Time to Live, an 8-bit header field that each router lowers by 1; the packet is dropped when it reaches 0.", hi: "Time to Live, header ka 8-bit field jise har router 1 se kam karta hai; 0 hote hi packet drop ho jaata hai." } },
  ],
  commands: [
    { cmd: "interface gigabitethernet0/0", mode: "Cisco global config", does: { en: "Enter interface configuration mode for Gi0/0", hi: "Gi0/0 ke interface configuration mode mein jaata hai" } },
    { cmd: "ip address 192.168.1.1 255.255.255.0", mode: "Cisco interface config", does: { en: "Give the interface an IPv4 address and dotted mask", hi: "Interface ko IPv4 address aur dotted mask deta hai" } },
    { cmd: "no shutdown", mode: "Cisco interface config", does: { en: "Enable the interface (router interfaces are shut down by default)", hi: "Interface enable karta hai (router interfaces by default shut down hote hain)" } },
    { cmd: "show ip interface brief", mode: "Cisco privileged EXEC", does: { en: "List every interface with its IP address, status and protocol", hi: "Har interface ka IP address, status aur protocol list karta hai" } },
    { cmd: "show ip interface gigabitethernet0/0", mode: "Cisco privileged EXEC", does: { en: "Show full IP details for one interface, including the prefix length", hi: "Ek interface ki poori IP details dikhata hai, prefix length ke saath" } },
  ],
  mistakes: [
    {
      en: "Counting usable hosts as 2^h. A /24 has 256 addresses but only 2^8 − 2 = 254 usable, because the network and broadcast addresses are reserved.",
      hi: "Usable hosts ko 2^h ginna. /24 mein 256 addresses hain lekin usable sirf 2^8 − 2 = 254, kyunki network aur broadcast address reserved hain.",
    },
    {
      en: "Giving a host the network or broadcast address, such as 192.168.1.0 or 192.168.1.255 in a /24. Only .1 to .254 are usable.",
      hi: "Host ko network ya broadcast address de dena, jaise /24 mein 192.168.1.0 ya 192.168.1.255. Usable sirf .1 se .254 tak hain.",
    },
    {
      en: "Forgetting `no shutdown` on a router interface. The address is configured, but `show ip interface brief` shows `administratively down` and nothing passes.",
      hi: "Router interface par `no shutdown` bhool jaana. Address configure ho gaya, lekin `show ip interface brief` mein `administratively down` dikhta hai aur kuch bhi pass nahi hota.",
    },
    {
      en: "Deciding the mask from the class. 10.1.1.10 with mask 255.255.255.0 is in 10.1.1.0/24, not 10.0.0.0/8. When a prefix is given, the class does not matter.",
      hi: "Class dekh kar mask decide karna. 10.1.1.10 mask 255.255.255.0 ke saath 10.1.1.0/24 mein hai, 10.0.0.0/8 mein nahi. Prefix diya hai toh class matter nahi karti.",
    },
    {
      en: "Putting 127 in class A's usable range. 127.0.0.0/8 is loopback, so class A networks are 1–126 and class B starts at 128.",
      hi: "127 ko class A ki usable range mein ginna. 127.0.0.0/8 loopback hai, isliye class A networks 1–126 hain aur class B 128 se shuru hoti hai.",
    },
    {
      en: "Typing `/24` in the IOS `ip address` command. It takes a dotted mask: `ip address 192.168.1.1 255.255.255.0`.",
      hi: "IOS ke `ip address` command mein `/24` type karna. Yeh dotted mask leta hai: `ip address 192.168.1.1 255.255.255.0`.",
    },
  ],
  recap: [
    { en: "IPv4 is 32 bits in four octets, each 0–255, written in dotted decimal.", hi: "IPv4 32 bits ka hai, chaar octets mein, har octet 0–255, dotted decimal mein likha jaata hai." },
    { en: "The prefix length or mask marks the network bits: /8 = 255.0.0.0, /16 = 255.255.0.0, /24 = 255.255.255.0.", hi: "Prefix length ya mask network bits mark karta hai: /8 = 255.0.0.0, /16 = 255.255.0.0, /24 = 255.255.255.0." },
    { en: "Classes by first octet: A 1–126 (/8), B 128–191 (/16), C 192–223 (/24), D 224–239 multicast, E 240–255 reserved. Since CIDR the prefix decides, not the class.", hi: "First octet se classes: A 1–126 (/8), B 128–191 (/16), C 192–223 (/24), D 224–239 multicast, E 240–255 reserved. CIDR ke baad prefix decide karta hai, class nahi." },
    { en: "Network address = host bits all 0, broadcast = host bits all 1, usable hosts = 2^h − 2.", hi: "Network address mein saare host bits 0 hote hain, broadcast mein saare 1, aur usable hosts = 2^h − 2." },
    { en: "On a router: `ip address <address> <mask>` then `no shutdown`; check with `show ip interface brief` for up/up.", hi: "Router par: `ip address <address> <mask>` phir `no shutdown`; `show ip interface brief` mein up/up check karo." },
    { en: "TTL drops by 1 per router and the packet dies at 0; Protocol says what is inside (1 ICMP, 6 TCP, 17 UDP).", hi: "TTL har router par 1 kam hota hai aur 0 par packet khatam; Protocol batata hai andar kya hai (1 ICMP, 6 TCP, 17 UDP)." },
  ],
  quiz: [
    {
      q: {
        en: "What is the broadcast address of the network that host 172.16.40.7/16 belongs to?",
        hi: "Host 172.16.40.7/16 jis network mein hai, uska broadcast address kya hai?",
      },
      options: [
        { en: "172.16.40.255", hi: "172.16.40.255" },
        { en: "172.255.255.255", hi: "172.255.255.255" },
        { en: "172.16.255.255", hi: "172.16.255.255" },
        { en: "255.255.255.255", hi: "255.255.255.255" },
      ],
      answer: 2,
      explain: {
        en: "/16 makes the first two octets (172.16) the network and the last two the host. Setting every host bit to 1 gives 172.16.255.255. 172.16.40.255 would only be right with a /24.",
        hi: "/16 mein pehle do octets (172.16) network hain aur aakhri do host. Saare host bits 1 karo toh 172.16.255.255 milta hai. 172.16.40.255 sirf /24 hone par sahi hota.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "An address has 191 as its first octet. Which class is it, and what is that class's default mask?",
        hi: "Ek address ka first octet 191 hai. Yeh kaunsi class hai, aur us class ka default mask kya hai?",
      },
      options: [
        { en: "Class A, 255.0.0.0", hi: "Class A, 255.0.0.0" },
        { en: "Class B, 255.255.0.0", hi: "Class B, 255.255.0.0" },
        { en: "Class C, 255.255.255.0", hi: "Class C, 255.255.255.0" },
        { en: "Class D, no default mask", hi: "Class D, koi default mask nahi" },
      ],
      answer: 1,
      explain: {
        en: "Class B covers first octets 128–191 (leading bits 10) with a default /16. 191 is the last class B value; class C starts at 192.",
        hi: "Class B mein first octet 128–191 hota hai (leading bits 10), default /16. 191 class B ki aakhri value hai; class C 192 se shuru hoti hai.",
      },
      kind: "concept",
    },
    {
      q: { en: "How many usable host addresses does the network 10.0.0.0/8 have?", hi: "Network 10.0.0.0/8 mein kitne usable host addresses hain?" },
      options: [
        { en: "16,777,214", hi: "16,777,214" },
        { en: "16,777,216", hi: "16,777,216" },
        { en: "65,534", hi: "65,534" },
        { en: "254", hi: "254" },
      ],
      answer: 0,
      explain: {
        en: "A /8 leaves 24 host bits. 2^24 = 16,777,216 addresses, minus the network and broadcast addresses, is 16,777,214. The option 16,777,216 forgets the − 2.",
        hi: "/8 ke baad 24 host bits bachte hain. 2^24 = 16,777,216 addresses, network aur broadcast minus karo toh 16,777,214. 16,777,216 wala option − 2 bhool gaya.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "On R1, `show ip interface brief` shows `GigabitEthernet0/1  192.168.2.1  YES manual administratively down down`. What do you need to do?",
        hi: "R1 par `show ip interface brief` mein `GigabitEthernet0/1  192.168.2.1  YES manual administratively down down` dikhta hai. Kya karna padega?",
      },
      options: [
        { en: "Replace the cable on Gi0/1", hi: "Gi0/1 ki cable badlo" },
        { en: "Enter the address again with a /24 prefix", hi: "Address ko /24 prefix ke saath dobara daalo" },
        { en: "Configure a default gateway on R1", hi: "R1 par default gateway configure karo" },
        { en: "Enter `no shutdown` on Gi0/1", hi: "Gi0/1 par `no shutdown` karo" },
      ],
      answer: 3,
      explain: {
        en: "`administratively down` means the interface is disabled in the configuration. The address is already there (method manual), so `no shutdown` is all that is missing. A cable fault shows plain `down`, not administratively down.",
        hi: "`administratively down` ka matlab configuration mein interface disabled hai. Address pehle se laga hai (method manual), bas `no shutdown` baaki hai. Cable ki problem mein sirf `down` dikhta hai, administratively down nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "Host A is 10.1.1.10 and host B is 10.1.2.10. Both use mask 255.255.255.0. Can they reach each other without a router?",
        hi: "Host A 10.1.1.10 hai aur host B 10.1.2.10. Dono ka mask 255.255.255.0 hai. Kya yeh bina router ke ek doosre tak pahunch sakte hain?",
      },
      options: [
        { en: "Yes, both are class A addresses in network 10.0.0.0", hi: "Haan, dono class A addresses hain, network 10.0.0.0 mein" },
        { en: "Yes, because their first two octets match", hi: "Haan, kyunki pehle do octets match karte hain" },
        { en: "No, they are in different networks: 10.1.1.0/24 and 10.1.2.0/24", hi: "Nahi, yeh alag networks mein hain: 10.1.1.0/24 aur 10.1.2.0/24" },
        { en: "No, 10.x addresses cannot be used on a LAN", hi: "Nahi, 10.x addresses LAN par use nahi ho sakte" },
      ],
      answer: 2,
      explain: {
        en: "The mask is /24, so the first three octets are the network. 10.1.1 and 10.1.2 differ, so these are two networks and traffic between them needs a router. The class A default /8 does not apply once a mask is given.",
        hi: "Mask /24 hai, toh pehle teen octets network hain. 10.1.1 aur 10.1.2 alag hain, yaani do networks, aur inke beech traffic ke liye router chahiye. Mask diya ho toh class A ka default /8 lagu nahi hota.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A router receives a packet with TTL 1 that it must forward out of another interface. What happens?",
        hi: "Router ko TTL 1 wala packet milta hai jise doosre interface se forward karna hai. Kya hoga?",
      },
      options: [
        { en: "It drops the packet and sends ICMP Time Exceeded to the source", hi: "Packet drop karta hai aur source ko ICMP Time Exceeded bhejta hai" },
        { en: "It forwards the packet with TTL 0", hi: "Packet ko TTL 0 ke saath forward karta hai" },
        { en: "It resets the TTL to 255 and forwards it", hi: "TTL ko 255 par reset karke forward karta hai" },
        { en: "It forwards the packet and lets the next router decide", hi: "Packet forward karta hai aur agle router ko decide karne deta hai" },
      ],
      answer: 0,
      explain: {
        en: "Decrementing 1 gives 0, and a packet with TTL 0 is never forwarded. The router discards it and reports back with ICMP Time Exceeded. This stops looping packets, and traceroute uses exactly this behaviour to discover each hop.",
        hi: "1 mein se 1 ghatao toh 0, aur TTL 0 wala packet kabhi forward nahi hota. Router use discard karta hai aur ICMP Time Exceeded se source ko batata hai. Isse loop wale packets rukte hain, aur traceroute isi behaviour se har hop dhoondhta hai.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "3ROdsfEUuhs",
      title: "Free CCNA | IPv4 Addressing (Part 1) | Day 7",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Binary, address classes, prefix lengths, and network and broadcast addresses.", hi: "Binary, address classes, prefix lengths, aur network aur broadcast addresses." },
    },
    {
      id: "FiAatRd84XI",
      title: "Free CCNA | IPv4 Addressing (Part 2) | Day 8",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Host counts per class, first and last usable addresses, and configuring IP addresses on a Cisco router.", hi: "Har class ke host counts, first aur last usable address, aur Cisco router par IP address configure karna." },
    },
    {
      id: "XgDzHkc8Cbs",
      title: "11. Free CCNA (NEW) | IP Addressing in Hindi - IP Address Classes",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Classes A to E and their ranges, explained in Hindi.", hi: "Class A se E tak aur unki ranges, Hindi mein." },
    },
    {
      id: "l2EiGY2j8Nw",
      title: "12. Free CCNA (NEW) | IP Addressing - Network, Host & Broadcast IDs",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Finding the network, host and broadcast parts of an address, in Hindi.", hi: "Address ke network, host aur broadcast parts kaise nikalte hain, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Address two LANs on one router", hi: "Ek router par do LANs ko address karo" },
    steps: [
      {
        en: "In Packet Tracer, add a 2911 router, two switches and two PCs. Connect PC1 through SW1 to R1 Gi0/0, and PC2 through SW2 to R1 Gi0/1.",
        hi: "Packet Tracer mein ek 2911 router, do switches aur do PCs lo. PC1 ko SW1 ke through R1 Gi0/0 se jodo, aur PC2 ko SW2 ke through R1 Gi0/1 se.",
      },
      {
        en: "On R1 run `show ip interface brief` first. Both interfaces should show `unassigned` and `administratively down`.",
        hi: "R1 par pehle `show ip interface brief` chalao. Dono interfaces `unassigned` aur `administratively down` dikhne chahiye.",
      },
      {
        en: "Configure Gi0/0 as 192.168.1.1 255.255.255.0 and Gi0/1 as 192.168.2.1 255.255.255.0, each followed by `no shutdown`. Run the show command again and look for up/up.",
        hi: "Gi0/0 par 192.168.1.1 255.255.255.0 aur Gi0/1 par 192.168.2.1 255.255.255.0 configure karo, dono ke baad `no shutdown`. Show command dobara chalao aur up/up dekho.",
      },
      {
        en: "Give PC1 192.168.1.10/24 with gateway 192.168.1.1, and PC2 192.168.2.10/24 with gateway 192.168.2.1. Ping PC2 from PC1.",
        hi: "PC1 ko 192.168.1.10/24 aur gateway 192.168.1.1 do, PC2 ko 192.168.2.10/24 aur gateway 192.168.2.1. PC1 se PC2 ko ping karo.",
      },
      {
        en: "On Gi0/0 try `ip address 192.168.1.255 255.255.255.0` and read the error. Explain why IOS refuses it.",
        hi: "Gi0/0 par `ip address 192.168.1.255 255.255.255.0` try karo aur error padho. Samjhao ki IOS ise kyun mana karta hai.",
      },
      {
        en: "For both LANs, write down the network address, broadcast address, usable range and host count, then check them against the animation.",
        hi: "Dono LANs ke liye network address, broadcast address, usable range aur host count likho, phir animation se match karo.",
      },
    ],
  },
};

export default lesson;
