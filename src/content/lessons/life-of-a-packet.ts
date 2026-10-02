import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "life-of-a-packet",
  intro: {
    en: "You know how a switch forwards a frame, how ARP finds a MAC, and how a router picks a route. A real ping uses all of them at once, and many routing questions on the exam come down to one skill: saying exactly what the headers look like on each link. Following a single ping from PC1 to PC2 across two routers, header by header, builds that skill.",
    hi: "Switch frame kaise forward karta hai, ARP MAC kaise dhoondhta hai, aur router route kaise chunta hai, yeh sab tum jaante ho. Ek asli ping in sabko ek saath use karta hai, aur exam ke kaafi routing questions ek hi skill par aate hain: har link par headers exactly kaise dikhte hain, yeh bata paana. PC1 se PC2 tak do routers ke paar ek ping ko header by header follow karna yahi skill banata hai.",
  },
  outcomes: [
    { en: "State which addresses change at each hop (MACs, TTL, checksum) and which never change (source and destination IP)", hi: "Bata sako ki har hop par kya badalta hai (MACs, TTL, checksum) aur kya kabhi nahi badalta (source aur destination IP)" },
    { en: "Predict the source and destination MAC of a packet on any link of a routed path", hi: "Routed path ke kisi bhi link par packet ka source aur destination MAC predict kar sako" },
    { en: "Predict who ARPs for which IP address: host for its gateway, router for its next hop or for the final host", hi: "Predict kar sako ki kaun kis IP ke liye ARP karega: host gateway ke liye, router next hop ke liye ya final host ke liye" },
    { en: "Work out the TTL at each hop and count routers from the TTL in a ping reply", hi: "Har hop par TTL nikaal sako aur ping reply ke TTL se routers gin sako" },
    { en: "Explain why a ping can fail on the return path even when the request arrives", hi: "Samjha sako ki request pahunchne ke baad bhi ping return path par kyun fail ho sakta hai" },
  ],
  sections: [
    {
      id: "the-network",
      heading: { en: "The network and the question", hi: "Network aur sawaal" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Each piece is already familiar: a switch forwards frames by MAC (lesson 1.1), ARP finds the MAC for an IPv4 address (1.2), the IPv4 header carries a TTL (1.3), and a router forwards by its routing table (3.1) using the longest match (3.2). Here they all run on one ping. PC1 pings PC2, which sits on a different LAN two routers away.",
            hi: "Har piece tum pehle dekh chuke ho: switch MAC dekh kar frames forward karta hai (lesson 1.1), ARP IPv4 address ka MAC dhoondhta hai (1.2), IPv4 header mein TTL hota hai (1.3), aur router routing table (3.1) se longest match (3.2) use karke forward karta hai. Yahan yeh sab ek hi ping par chalte hain. PC1, PC2 ko ping karta hai, jo do routers door ek alag LAN par hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Addresses used in this lesson and its animation", hi: "Is lesson aur animation mein use hone wale addresses" },
          columns: ["Device", "Interface", "IPv4 address", "MAC address"],
          rows: [
            ["PC1", "NIC", "192.168.1.10/24, gateway 192.168.1.1", "0050.56aa.0001"],
            ["R1", "Gi0/0", "192.168.1.1/24", "0011.1111.0000"],
            ["R1", "Gi0/1", "192.168.12.1/30", "0011.1111.0001"],
            ["R2", "Gi0/1", "192.168.12.2/30", "0022.2222.0001"],
            ["R2", "Gi0/0", "192.168.2.1/24", "0022.2222.0000"],
            ["PC2", "NIC", "192.168.2.10/24, gateway 192.168.2.1", "0050.56aa.0002"],
          ],
        },
        {
          type: "p",
          text: {
            en: "SW1 connects PC1 to R1, and SW2 connects PC2 to R2. R1 has the route `S 192.168.2.0/24 via 192.168.12.2` and R2 has `S 192.168.1.0/24 via 192.168.12.1`. Whether a route was typed by hand or learned by OSPF makes no difference to forwarding; you configure these two yourself in the next lesson. Every ARP table starts empty.",
            hi: "SW1, PC1 ko R1 se jodta hai, aur SW2, PC2 ko R2 se. R1 ke paas route `S 192.168.2.0/24 via 192.168.12.2` hai aur R2 ke paas `S 192.168.1.0/24 via 192.168.12.1`. Route haath se likha gaya ho ya OSPF se seekha gaya ho, forwarding par koi farak nahi padta; yeh dono routes tum agle lesson mein khud configure karoge. Shuru mein har ARP table khaali hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Easy-to-read MACs", hi: "Aasaan MACs" },
          text: {
            en: "The router MACs are simplified so you can tell them apart at a glance: R1's interfaces are `0011.1111.xxxx` and R2's are `0022.2222.xxxx`. Real burned-in MACs look random, but the logic is identical.",
            hi: "Router MACs ko simple rakha gaya hai taaki ek nazar mein pehchaan sako: R1 ke interfaces `0011.1111.xxxx` hain aur R2 ke `0022.2222.xxxx`. Asli burned-in MACs random dikhte hain, lekin logic bilkul same hai.",
          },
        },
      ],
    },
    {
      id: "two-addresses",
      heading: { en: "Two addresses, two jobs", hi: "Do addresses, do kaam" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A packet on an Ethernet link carries two pairs of addresses, and they answer different questions. The IP addresses in the IPv4 header say where the packet started and where it must finally arrive. The MAC addresses in the Ethernet header say who sent this frame and who must receive it on this one link. A router sits between links, so it keeps the packet and replaces the frame.",
            hi: "Ethernet link par packet ke saath addresses ke do pair hote hain, aur dono alag sawaalon ka jawab dete hain. IPv4 header ke IP addresses batate hain ki packet kahan se shuru hua aur aakhir mein kahan pahunchna hai. Ethernet header ke MAC addresses batate hain ki is ek link par frame kisne bheja aur kisko lena hai. Router do links ke beech baitha hai, isliye woh packet rakhta hai aur frame badal deta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "What a router changes when it forwards a packet (no NAT)", hi: "Packet forward karte waqt router kya badalta hai (NAT ke bina)" },
          columns: [
            { en: "Field", hi: "Field" },
            { en: "Changes at each router?", hi: "Har router par badalta hai?" },
            { en: "Why", hi: "Kyun" },
          ],
          rows: [
            [
              { en: "Source and destination IP", hi: "Source aur destination IP" },
              { en: "No", hi: "Nahi" },
              { en: "They name the two ends of the conversation", hi: "Yeh conversation ke dono ends ka naam hain" },
            ],
            [
              { en: "Source and destination MAC", hi: "Source aur destination MAC" },
              { en: "Yes, a new frame on every link", hi: "Haan, har link par naya frame" },
              { en: "A MAC address only means something on its own link", hi: "MAC address ka matlab sirf apne link par hota hai" },
            ],
            [
              { en: "TTL", hi: "TTL" },
              { en: "Yes, lowered by 1", hi: "Haan, 1 kam hota hai" },
              { en: "Stops a packet looping forever", hi: "Packet ko hamesha loop karne se rokta hai" },
            ],
            [
              { en: "IPv4 header checksum", hi: "IPv4 header checksum" },
              { en: "Yes, recalculated", hi: "Haan, dobara calculate hota hai" },
              { en: "The TTL changed, so the checksum must change too", hi: "TTL badla, toh checksum bhi badalna padega" },
            ],
            [
              { en: "Ethernet FCS (trailer)", hi: "Ethernet FCS (trailer)" },
              { en: "Yes, new trailer", hi: "Haan, naya trailer" },
              { en: "It protects the new frame", hi: "Yeh naye frame ko protect karta hai" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "IP addresses are end to end; MAC addresses are hop by hop. On a routed path without NAT, the source and destination IP never change. NAT (lesson 4.3) rewrites IP addresses on purpose; ordinary routing never does.",
            hi: "IP addresses end to end hote hain; MAC addresses hop by hop. NAT ke bina routed path par source aur destination IP kabhi nahi badalte. NAT (lesson 4.3) jaan-boojh kar IP addresses badalta hai; normal routing kabhi nahi badalti.",
          },
        },
      ],
    },
    {
      id: "hop-by-hop",
      heading: { en: "The echo request, hop by hop", hi: "Echo request, hop by hop" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "PC1 compares 192.168.2.10 with its own network, 192.168.1.0/24. It is remote, so the packet must go to the default gateway, 192.168.1.1.",
              hi: "PC1 192.168.2.10 ko apne network 192.168.1.0/24 se compare karta hai. Yeh remote hai, isliye packet default gateway 192.168.1.1 ko jaana chahiye.",
            },
            {
              en: "PC1 ARPs for **192.168.1.1**, not for 192.168.2.10. R1 answers with `0011.1111.0000` and also adds PC1 to its own ARP table from the request.",
              hi: "PC1 **192.168.1.1** ke liye ARP karta hai, 192.168.2.10 ke liye nahi. R1 `0011.1111.0000` se jawab deta hai aur request se PC1 ko apni ARP table mein bhi add kar leta hai.",
            },
            {
              en: "**Link 1.** PC1 sends a frame `0050.56aa.0001 → 0011.1111.0000` carrying the packet `192.168.1.10 → 192.168.2.10`, TTL 128 (Windows starts at 128). SW1 forwards it by MAC and changes nothing.",
              hi: "**Link 1.** PC1 frame `0050.56aa.0001 → 0011.1111.0000` bhejta hai, jiske andar packet `192.168.1.10 → 192.168.2.10` hai, TTL 128 (Windows 128 se shuru karta hai). SW1 ise MAC ke hisaab se forward karta hai aur kuch nahi badalta.",
            },
            {
              en: "R1 sees its own MAC as the destination, checks the FCS and removes the Ethernet header. It matches 192.168.2.10 to `192.168.2.0/24 via 192.168.12.2`, then finds that 192.168.12.2 is on the connected network `192.168.12.0/30` out of Gi0/1. This second lookup is called a **recursive lookup**. R1 lowers the TTL to 127 and recalculates the header checksum.",
              hi: "R1 destination mein apna MAC dekhta hai, FCS check karta hai aur Ethernet header hata deta hai. 192.168.2.10 ko `192.168.2.0/24 via 192.168.12.2` se match karta hai, phir dekhta hai ki 192.168.12.2 Gi0/1 wale connected network `192.168.12.0/30` par hai. Is doosre lookup ko **recursive lookup** kehte hain. R1 TTL 127 kar deta hai aur header checksum dobara calculate karta hai.",
            },
            {
              en: "R1 ARPs out of Gi0/1 for **192.168.12.2**, the next hop. R2 answers with `0022.2222.0001`.",
              hi: "R1 Gi0/1 se next hop **192.168.12.2** ke liye ARP karta hai. R2 `0022.2222.0001` se jawab deta hai.",
            },
            {
              en: "**Link 2.** R1 sends a new frame `0011.1111.0001 → 0022.2222.0001`. The packet inside is the same, now with TTL 127.",
              hi: "**Link 2.** R1 naya frame `0011.1111.0001 → 0022.2222.0001` bhejta hai. Andar packet wahi hai, bas ab TTL 127 hai.",
            },
            {
              en: "R2 removes the frame and matches the connected route `192.168.2.0/24` on Gi0/0. Connected means the destination host itself is the next hop. R2 lowers the TTL to 126 and ARPs for **192.168.2.10**.",
              hi: "R2 frame hatata hai aur Gi0/0 wale connected route `192.168.2.0/24` se match karta hai. Connected ka matlab destination host khud next hop hai. R2 TTL 126 karta hai aur **192.168.2.10** ke liye ARP karta hai.",
            },
            {
              en: "**Link 3.** R2 sends `0022.2222.0000 → 0050.56aa.0002`, SW2 delivers it, and PC2 receives `192.168.1.10 → 192.168.2.10` with TTL 126.",
              hi: "**Link 3.** R2 `0022.2222.0000 → 0050.56aa.0002` bhejta hai, SW2 use deliver karta hai, aur PC2 ko `192.168.1.10 → 192.168.2.10` TTL 126 ke saath milta hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "The echo request on each link", hi: "Har link par echo request" },
          columns: ["Link", "Source MAC", "Destination MAC", "Source IP → destination IP", "TTL"],
          rows: [
            ["PC1 → R1 (via SW1)", "0050.56aa.0001", "0011.1111.0000", "192.168.1.10 → 192.168.2.10", "128"],
            ["R1 → R2", "0011.1111.0001", "0022.2222.0001", "192.168.1.10 → 192.168.2.10", "127"],
            ["R2 → PC2 (via SW2)", "0022.2222.0000", "0050.56aa.0002", "192.168.1.10 → 192.168.2.10", "126"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Why the first ping often times out", hi: "Pehla ping aksar time out kyun hota hai" },
          text: {
            en: "The animation shows the logical order: ARP first, then the frame. A Cisco router usually drops the packet that triggered an ARP instead of holding it until the reply comes back. So in a lab with empty ARP tables, the first one or two pings from PC1 can time out, and later echoes find every entry ready. It is the same effect as the `.!!!!` from the ARP lesson, not a routing fault.",
            hi: "Animation logical order dikhata hai: pehle ARP, phir frame. Cisco router aam taur par us packet ko drop kar deta hai jisne ARP trigger kiya, reply aane tak use hold nahi karta. Isliye khaali ARP tables wale lab mein PC1 ke pehle ek-do pings time out ho sakte hain, aur baad ke echoes ko har entry ready milti hai. Yeh wahi effect hai jo ARP lesson mein `.!!!!` mein dekha tha, koi routing fault nahi.",
          },
        },
      ],
    },
    {
      id: "inside-the-router",
      heading: { en: "What each router did, as a checklist", hi: "Har router ne kya kiya, checklist mein" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Lesson 3.1 listed the router's forwarding process. R1 and R2 each ran it once for the request. Use this checklist whenever an exam question asks what a router does with a packet:",
            hi: "Lesson 3.1 mein router ka forwarding process dekha tha. R1 aur R2 dono ne request ke liye ise ek-ek baar chalaya. Jab bhi exam poochhe ki router packet ke saath kya karta hai, yeh checklist use karo:",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Accept the frame** only if the destination MAC is the router's interface MAC (or a broadcast or multicast it listens to) and the FCS is correct.",
              hi: "**Frame accept karo** sirf tab jab destination MAC router ke interface ka MAC ho (ya koi broadcast ya multicast jise woh sunta hai) aur FCS sahi ho.",
            },
            {
              en: "**Remove the Ethernet header and trailer.** Only the IP packet moves on.",
              hi: "**Ethernet header aur trailer hatao.** Aage sirf IP packet jaata hai.",
            },
            {
              en: "**Look up the destination IP** with the longest match. No match and no default route: drop the packet and send ICMP Destination Unreachable to the source.",
              hi: "**Destination IP ka lookup karo**, longest match se. Koi match nahi aur default route bhi nahi: packet drop karo aur source ko ICMP Destination Unreachable bhejo.",
            },
            {
              en: "**Lower the TTL by 1** and recalculate the header checksum. If the TTL reaches 0, drop the packet and send ICMP Time Exceeded to the source.",
              hi: "**TTL 1 kam karo** aur header checksum dobara calculate karo. TTL 0 ho jaaye, toh packet drop karo aur source ko ICMP Time Exceeded bhejo.",
            },
            {
              en: "**Find the next hop's MAC.** Route via a next-hop IP: that router's MAC. Connected route: the destination host's MAC. Check the ARP table first and ARP only on a miss.",
              hi: "**Next hop ka MAC nikaalo.** Route mein next-hop IP hai: us router ka MAC. Connected route hai: destination host ka MAC. Pehle ARP table dekho, entry na mile tabhi ARP karo.",
            },
            {
              en: "**Build a new frame** with the exit interface's MAC as source, the next hop's MAC as destination and a new FCS, and send it.",
              hi: "**Naya frame banao**: source mein exit interface ka MAC, destination mein next hop ka MAC, naya FCS, aur bhej do.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "R1's routing table: the route used for 192.168.2.10", hi: "R1 ki routing table: 192.168.2.10 ke liye use hua route" },
          lines: [
            { prompt: "R1#", cmd: "show ip route" },
            { comment: { en: "Code legend omitted", hi: "Code legend hata diya" } },
            { out: "Gateway of last resort is not set" },
            { out: "      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks" },
            { out: "C        192.168.1.0/24 is directly connected, GigabitEthernet0/0" },
            { out: "L        192.168.1.1/32 is directly connected, GigabitEthernet0/0" },
            { out: "S     192.168.2.0/24 [1/0] via 192.168.12.2", comment: { en: "Longest match for 192.168.2.10: go to 192.168.12.2", hi: "192.168.2.10 ka longest match: 192.168.12.2 ko bhejo" } },
            { out: "      192.168.12.0/24 is variably subnetted, 2 subnets, 2 masks" },
            { out: "C        192.168.12.0/30 is directly connected, GigabitEthernet0/1", comment: { en: "Recursive lookup: 192.168.12.2 is reached out of Gi0/1", hi: "Recursive lookup: 192.168.12.2 tak Gi0/1 se pahunchte hain" } },
            { out: "L        192.168.12.1/32 is directly connected, GigabitEthernet0/1" },
          ],
        },
        {
          type: "cli",
          title: { en: "R1's ARP table after the ping", hi: "Ping ke baad R1 ki ARP table" },
          lines: [
            { prompt: "R1#", cmd: "show ip arp" },
            { out: "Protocol  Address          Age (min)  Hardware Addr   Type   Interface" },
            { out: "Internet  192.168.1.1             -   0011.1111.0000  ARPA   GigabitEthernet0/0" },
            { out: "Internet  192.168.1.10            0   0050.56aa.0001  ARPA   GigabitEthernet0/0", comment: { en: "PC1, learned from its ARP request", hi: "PC1, uski ARP request se seekha" } },
            { out: "Internet  192.168.12.1            -   0011.1111.0001  ARPA   GigabitEthernet0/1" },
            { out: "Internet  192.168.12.2            0   0022.2222.0001  ARPA   GigabitEthernet0/1", comment: { en: "R2, the next hop", hi: "R2, yaani next hop" } },
          ],
          note: {
            en: "There is no entry for 192.168.2.10. R1 only ever needs MACs of devices on its own links, and PC2 is not on any of them.",
            hi: "192.168.2.10 ki koi entry nahi hai. R1 ko sirf apne links par baithe devices ke MAC chahiye hote hain, aur PC2 unmein se kisi par nahi hai.",
          },
        },
      ],
    },
    {
      id: "the-reply",
      heading: { en: "The reply is a separate journey", hi: "Reply ki journey alag hoti hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "PC2 answers with a brand-new packet: source 192.168.2.10, destination 192.168.1.10, and a fresh TTL of 128. PC2 makes its own decision (192.168.1.10 is remote, so send to 192.168.2.1), and every router on the way back does its own lookup. The reply needs no ARP at all: PC2 learned R2's MAC from R2's ARP request, R2 learned R1's Gi0/1 MAC the same way, and R1 learned PC1's MAC when PC1 asked for the gateway.",
            hi: "PC2 bilkul naye packet se jawab deta hai: source 192.168.2.10, destination 192.168.1.10, aur naya TTL 128. PC2 apna decision khud leta hai (192.168.1.10 remote hai, toh 192.168.2.1 ko bhejo), aur wapas aate waqt har router apna lookup khud karta hai. Reply ko koi ARP nahi chahiye: PC2 ne R2 ka MAC R2 ki ARP request se seekha, R2 ne R1 ke Gi0/1 ka MAC isi tarah seekha, aur R1 ne PC1 ka MAC tab seekha jab PC1 ne gateway ke liye poocha tha.",
          },
        },
        {
          type: "p",
          text: {
            en: "Because the reply is routed on its own, R2 needs a route to 192.168.1.0/24. Without it the request arrives, PC2 replies, and R2 drops the reply. R2 does send an ICMP Destination Unreachable, but to the reply's source, PC2, so PC1 only sees `Request timed out`.",
            hi: "Reply alag se route hota hai, isliye R2 ke paas 192.168.1.0/24 ka route hona chahiye. Route na ho toh request pahunch jaati hai, PC2 reply karta hai, aur R2 reply drop kar deta hai. R2 ICMP Destination Unreachable bhejta toh hai, lekin reply ke source yaani PC2 ko, isliye PC1 ko sirf `Request timed out` dikhta hai.",
          },
        },
        {
          type: "cli",
          title: { en: "On PC1: the TTL tells you how many routers the reply crossed", hi: "PC1 par: TTL batata hai ki reply kitne routers se guzra" },
          lines: [
            { prompt: "C:\\>", cmd: "ping 192.168.2.10" },
            { out: "Pinging 192.168.2.10 with 32 bytes of data:" },
            { out: "Reply from 192.168.2.10: bytes=32 time=1ms TTL=126", comment: { en: "PC2 started at 128; R2 and R1 each took 1", hi: "PC2 ne 128 se shuru kiya; R2 aur R1 ne ek-ek kam kiya" } },
            { out: "Reply from 192.168.2.10: bytes=32 time=1ms TTL=126" },
            { prompt: "C:\\>", cmd: "tracert -d 192.168.2.10" },
            { out: "Tracing route to 192.168.2.10 over a maximum of 30 hops" },
            { out: "  1    <1 ms    <1 ms    <1 ms  192.168.1.1", comment: { en: "TTL 1 expired at R1", hi: "TTL 1, R1 par expire hua" } },
            { out: "  2     1 ms     1 ms     1 ms  192.168.12.2", comment: { en: "TTL 2 expired at R2", hi: "TTL 2, R2 par expire hua" } },
            { out: "  3     1 ms     1 ms     1 ms  192.168.2.10" },
            { out: "Trace complete." },
          ],
          note: {
            en: "tracert sends echoes with TTL 1, 2, 3 and so on. Each router that drops one for TTL answers with ICMP Time Exceeded, which reveals its address. `-d` skips the name lookups.",
            hi: "tracert TTL 1, 2, 3 waghera ke saath echoes bhejta hai. Jo router TTL ki wajah se echo drop karta hai, woh ICMP Time Exceeded se jawab deta hai, aur isse uska address pata chal jaata hai. `-d` name lookups skip karta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Reading a TTL", hi: "TTL padhna" },
          text: {
            en: "Common starting TTLs are 128 (Windows), 64 (Linux and macOS) and 255 (Cisco IOS). Subtract the TTL you see from the nearest starting value above it: TTL=126 from a Windows host and TTL=62 from a Linux server both mean two routers.",
            hi: "Common starting TTL hain 128 (Windows), 64 (Linux aur macOS) aur 255 (Cisco IOS). Jo TTL dikhe, use apne se upar wali sabse nazdeek starting value se ghatao: Windows host se TTL=126 aur Linux server se TTL=62, dono ka matlab do routers.",
          },
        },
      ],
    },
    {
      id: "misconceptions",
      heading: { en: "Misconceptions that cost marks", hi: "Galatfehmiyan jo marks katwa deti hain" },
      blocks: [
        {
          type: "table",
          columns: [
            { en: "Wrong idea", hi: "Galat soch" },
            { en: "What actually happens", hi: "Asal mein kya hota hai" },
          ],
          rows: [
            [
              { en: "PC1 ARPs for PC2's MAC.", hi: "PC1, PC2 ke MAC ke liye ARP karta hai." },
              { en: "PC1 ARPs only for its gateway. PC2's MAC never appears on LAN1.", hi: "PC1 sirf apne gateway ke liye ARP karta hai. PC2 ka MAC LAN1 par kabhi nahi dikhta." },
            ],
            [
              { en: "R1 writes the next hop's IP into the packet.", hi: "R1 next hop ka IP packet mein likh deta hai." },
              { en: "The next-hop IP is only used to find a MAC with ARP. The destination IP stays 192.168.2.10.", hi: "Next-hop IP sirf ARP se MAC dhoondhne ke kaam aata hai. Destination IP 192.168.2.10 hi rehta hai." },
            ],
            [
              { en: "Switches lower the TTL or rewrite MACs.", hi: "Switches TTL kam karte hain ya MACs badalte hain." },
              { en: "A Layer 2 switch forwards the frame unchanged. Only routers lower the TTL and build new frames.", hi: "Layer 2 switch frame ko bina badle forward karta hai. TTL kam karna aur naya frame banana sirf routers karte hain." },
            ],
            [
              { en: "R1 learns PC2's MAC address.", hi: "R1, PC2 ka MAC address seekh leta hai." },
              { en: "Routers ARP only on their own links. PC2's MAC is only in R2's ARP table and SW2's MAC table.", hi: "Routers sirf apne links par ARP karte hain. PC2 ka MAC sirf R2 ki ARP table aur SW2 ki MAC table mein hai." },
            ],
            [
              { en: "If the request gets there, the reply will too.", hi: "Request pahunch gayi, toh reply bhi pahunch jaayega." },
              { en: "The reply is routed separately and needs a route on every router on the way back.", hi: "Reply alag se route hota hai aur wapas ke raaste ke har router par route chahiye." },
            ],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Serial links have no MACs", hi: "Serial links par MAC nahi hote" },
          text: {
            en: "If R1 and R2 were joined by a serial link running HDLC or PPP, there would be no MAC addresses and no ARP on that link. The router puts the same IP packet into an HDLC or PPP frame instead. The IP rules do not change: addresses stay the same and the TTL drops by 1 per router.",
            hi: "Agar R1 aur R2 HDLC ya PPP wale serial link se jude hote, toh us link par na MAC addresses hote, na ARP. Router wahi IP packet HDLC ya PPP frame mein daal deta. IP ke rules nahi badalte: addresses same rehte hain aur TTL har router par 1 kam hota hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Hop", def: { en: "One step of a routed path. Each router a packet passes through is one hop.", hi: "Routed path ka ek step. Packet jis bhi router se guzarta hai, woh ek hop hai." } },
    { term: "Next hop", def: { en: "The IP address of the next router on the path, taken from the routing table. Its MAC becomes the frame's destination MAC.", hi: "Path par agle router ka IP address, jo routing table se milta hai. Uska MAC frame ka destination MAC banta hai." } },
    { term: "Recursive lookup", def: { en: "A second routing table lookup to find which interface leads to a route's next-hop address.", hi: "Doosra routing table lookup, yeh pata karne ke liye ki route ke next-hop address tak kaunsa interface le jaata hai." } },
    { term: "TTL (Time to Live)", def: { en: "IPv4 header field that each router lowers by 1; the packet is dropped at 0. IPv6 calls it Hop Limit.", hi: "IPv4 header ka field jise har router 1 kam karta hai; 0 par packet drop ho jaata hai. IPv6 mein ise Hop Limit kehte hain." } },
    { term: "De-encapsulation / re-encapsulation", def: { en: "Removing the incoming frame to reach the packet, then wrapping the packet in a new frame for the next link.", hi: "Aane wala frame hata kar packet tak pahunchna, phir agle link ke liye packet ko naye frame mein wrap karna." } },
    { term: "ICMP Time Exceeded", def: { en: "The message a router sends to the source when it drops a packet because its TTL ran out. Traceroute relies on it.", hi: "Woh message jo router source ko bhejta hai jab TTL khatam hone ki wajah se packet drop karta hai. Traceroute isi par chalta hai." } },
    { term: "Return path", def: { en: "The route the reply takes back to the sender. It is looked up separately, router by router.", hi: "Woh raasta jisse reply sender tak wapas aata hai. Iska lookup alag se, har router par hota hai." } },
  ],
  commands: [
    { cmd: "ping 192.168.2.10", mode: "Windows command prompt", does: { en: "Send ICMP echoes and show the TTL of each reply", hi: "ICMP echoes bhejta hai aur har reply ka TTL dikhata hai" } },
    { cmd: "tracert -d 192.168.2.10", mode: "Windows command prompt", does: { en: "List the routers on the path using expiring TTLs, without name lookups", hi: "Expire hote TTLs se path ke routers ki list deta hai, bina name lookup ke" } },
    { cmd: "arp -a", mode: "Windows command prompt", does: { en: "Show the PC's ARP cache: only the gateway for remote destinations", hi: "PC ka ARP cache dikhata hai: remote destinations ke liye sirf gateway" } },
    { cmd: "show ip route", mode: "Cisco privileged EXEC", does: { en: "Show the routing table the router uses for each lookup", hi: "Woh routing table dikhata hai jisse router har lookup karta hai" } },
    { cmd: "show ip arp", mode: "Cisco privileged EXEC", does: { en: "Show the router's ARP table: MACs of devices on its own links", hi: "Router ki ARP table dikhata hai: apne links par baithe devices ke MACs" } },
    { cmd: "clear arp-cache", mode: "Cisco privileged EXEC", does: { en: "Empty the dynamic ARP entries so you can watch ARP happen again", hi: "Dynamic ARP entries khaali karta hai taaki ARP dobara hote dekh sako" } },
  ],
  mistakes: [
    {
      en: "Putting the next-hop router's IP in the packet's destination field. The destination IP stays 192.168.2.10 on every link; the next hop only decides the destination MAC.",
      hi: "Next-hop router ka IP packet ke destination field mein daal dena. Destination IP har link par 192.168.2.10 hi rehta hai; next hop sirf destination MAC decide karta hai.",
    },
    {
      en: "Expecting a router's ARP table to list remote hosts. R1 only holds MACs of devices on its own links, so 192.168.2.10 never appears there.",
      hi: "Yeh expect karna ki router ki ARP table mein remote hosts honge. R1 sirf apne links ke devices ke MAC rakhta hai, isliye 192.168.2.10 wahan kabhi nahi aata.",
    },
    {
      en: "Troubleshooting only the forward path. A ping needs a route to the destination on every router going out, and a route back to the source on every router coming back.",
      hi: "Sirf jaane wala path troubleshoot karna. Ping ke liye jaate waqt har router par destination ka route chahiye, aur wapas aate waqt har router par source ka route.",
    },
    {
      en: "Counting a switch as a hop. A Layer 2 switch does not lower the TTL or change the MACs; the frame on LAN1 is identical whether PC1 connects to R1 directly or through SW1.",
      hi: "Switch ko hop gin lena. Layer 2 switch na TTL kam karta hai na MACs badalta hai; PC1 seedha R1 se juda ho ya SW1 ke through, LAN1 par frame bilkul same rehta hai.",
    },
    {
      en: "Reading the first lost ping in a fresh lab as a routing fault. Routers drop the packet that triggers an ARP; judge the result by the later pings.",
      hi: "Naye lab mein pehle lost ping ko routing fault samajhna. Router us packet ko drop karte hain jo ARP trigger karta hai; result baad ke pings se judge karo.",
    },
  ],
  recap: [
    { en: "IP addresses are end to end; the Ethernet frame, and so both MACs, is rebuilt on every link.", hi: "IP addresses end to end hote hain; Ethernet frame, aur isliye dono MACs, har link par naye bante hain." },
    { en: "A host ARPs for its gateway when the destination is remote. A router ARPs for the next hop, or for the host itself when the network is connected.", hi: "Destination remote ho toh host gateway ke liye ARP karta hai. Router next hop ke liye ARP karta hai, ya network connected ho toh seedha host ke liye." },
    { en: "Each router: accept frame, strip it, longest-match lookup, TTL minus 1 and new checksum, ARP if needed, new frame out.", hi: "Har router: frame accept, frame hatao, longest-match lookup, TTL minus 1 aur naya checksum, zaroorat ho toh ARP, naya frame bahar." },
    { en: "Switches change nothing in the frame or packet; only routers lower the TTL.", hi: "Switches frame ya packet mein kuch nahi badalte; TTL sirf routers kam karte hain." },
    { en: "The reply is a new packet with a fresh TTL and needs its own routes back; TTL=126 from a Windows host means two routers.", hi: "Reply ek naya packet hai jiska TTL naya hota hai aur use wapas ke apne routes chahiye; Windows host se TTL=126 matlab do routers." },
  ],
  quiz: [
    {
      q: {
        en: "PC1 (192.168.1.10) pings PC2 (192.168.2.10). While the echo request crosses the link between R1 and R2, what are its destination MAC and destination IP?",
        hi: "PC1 (192.168.1.10) PC2 (192.168.2.10) ko ping karta hai. Jab echo request R1 aur R2 ke beech wala link cross karti hai, tab uska destination MAC aur destination IP kya hota hai?",
      },
      options: [
        { en: "R2's Gi0/1 MAC and 192.168.2.10", hi: "R2 ke Gi0/1 ka MAC aur 192.168.2.10" },
        { en: "PC2's MAC and 192.168.2.10", hi: "PC2 ka MAC aur 192.168.2.10" },
        { en: "R2's Gi0/1 MAC and 192.168.12.2", hi: "R2 ke Gi0/1 ka MAC aur 192.168.12.2" },
        { en: "PC2's MAC and 192.168.12.2", hi: "PC2 ka MAC aur 192.168.12.2" },
      ],
      answer: 0,
      explain: {
        en: "The destination MAC always points at the next device on this link, which is R2's Gi0/1. The destination IP names the final host and never changes, so it is still 192.168.2.10. 192.168.12.2 is only used by R1 to find R2's MAC.",
        hi: "Destination MAC hamesha is link ke agle device ko point karta hai, jo R2 ka Gi0/1 hai. Destination IP final host ka naam hai aur kabhi nahi badalta, isliye ab bhi 192.168.2.10 hai. 192.168.12.2 ka use R1 sirf R2 ka MAC dhoondhne ke liye karta hai.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which fields does R1 change when it forwards the echo request from Gi0/0 to Gi0/1?", hi: "Echo request ko Gi0/0 se Gi0/1 par forward karte waqt R1 kaunse fields badalta hai?" },
      options: [
        { en: "The source and destination IP addresses", hi: "Source aur destination IP addresses" },
        { en: "Only the destination MAC address", hi: "Sirf destination MAC address" },
        { en: "Nothing; a router forwards the frame exactly as it arrived", hi: "Kuch nahi; router frame ko bilkul waise hi forward karta hai jaise aaya tha" },
        { en: "Both MAC addresses, the TTL and the IP header checksum", hi: "Dono MAC addresses, TTL aur IP header checksum" },
      ],
      answer: 3,
      explain: {
        en: "R1 builds a new frame, so the source MAC (its Gi0/1) and destination MAC (R2) are both new. It lowers the TTL and so must recalculate the header checksum. The IP addresses stay as PC1 wrote them.",
        hi: "R1 naya frame banata hai, isliye source MAC (uska Gi0/1) aur destination MAC (R2) dono naye hain. TTL kam karta hai, isliye header checksum bhi dobara calculate karna padta hai. IP addresses waise hi rehte hain jaise PC1 ne likhe the.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "In another network, a Windows PC pings a Windows server (starting TTL 128) and sees `Reply from 10.9.9.9: bytes=32 time=3ms TTL=125`. How many routers did the reply pass through?",
        hi: "Ek doosre network mein Windows PC ek Windows server (starting TTL 128) ko ping karta hai aur use `Reply from 10.9.9.9: bytes=32 time=3ms TTL=125` dikhta hai. Reply kitne routers se guzra?",
      },
      options: [
        { en: "1", hi: "1" },
        { en: "2", hi: "2" },
        { en: "3", hi: "3" },
        { en: "125", hi: "125" },
      ],
      answer: 2,
      explain: {
        en: "The server sent the reply with TTL 128 and each router lowered it by 1: 128 − 125 = 3 routers. The TTL counts down, so 125 is what is left, not a hop count.",
        hi: "Server ne reply TTL 128 ke saath bheja aur har router ne 1 kam kiya: 128 − 125 = 3 routers. TTL neeche ki taraf ginta hai, isliye 125 bacha hua TTL hai, hop count nahi.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "After a successful ping from PC1 to PC2, which address will NOT appear in R1's `show ip arp` output?",
        hi: "PC1 se PC2 tak successful ping ke baad, R1 ke `show ip arp` output mein kaunsa address NAHI dikhega?",
      },
      options: [
        { en: "192.168.1.10", hi: "192.168.1.10" },
        { en: "192.168.2.10", hi: "192.168.2.10" },
        { en: "192.168.12.2", hi: "192.168.12.2" },
        { en: "192.168.12.1", hi: "192.168.12.1" },
      ],
      answer: 1,
      explain: {
        en: "R1 ARPs only on its own links: for PC1 on Gi0/0 and for R2 (192.168.12.2) on Gi0/1. PC2 is two links away, so its MAC is never needed by R1. 192.168.12.1 is R1's own Gi0/1 address, which is listed with age `-`.",
        hi: "R1 sirf apne links par ARP karta hai: Gi0/0 par PC1 ke liye aur Gi0/1 par R2 (192.168.12.2) ke liye. PC2 do links door hai, isliye R1 ko uska MAC kabhi nahi chahiye. 192.168.12.1 R1 ke apne Gi0/1 ka address hai, jo age `-` ke saath list hota hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "PC2 receives PC1's echo requests and sends its replies to R2's MAC, yet PC1 reports `Request timed out`. What is the most likely cause?",
        hi: "PC2 ko PC1 ki echo requests milti hain aur woh apne replies R2 ke MAC par bhejta hai, phir bhi PC1 `Request timed out` dikhata hai. Sabse likely cause kya hai?",
      },
      options: [
        { en: "R1 has no route to 192.168.2.0/24", hi: "R1 ke paas 192.168.2.0/24 ka route nahi hai" },
        { en: "PC1 has the wrong default gateway", hi: "PC1 ka default gateway galat hai" },
        { en: "SW2 has not learned PC1's MAC address", hi: "SW2 ne PC1 ka MAC address nahi seekha" },
        { en: "R2 has no route to 192.168.1.0/24", hi: "R2 ke paas 192.168.1.0/24 ka route nahi hai" },
      ],
      answer: 3,
      explain: {
        en: "The requests reach PC2, so PC1's gateway and R1's route both work. The reply leaves PC2 correctly, so the first router on the way back, R2, must be missing the route to 192.168.1.0/24. SW2 never needs PC1's MAC, because PC1's MAC is never used on LAN2.",
        hi: "Requests PC2 tak pahunch rahi hain, isliye PC1 ka gateway aur R1 ka route dono theek hain. Reply PC2 se sahi nikal raha hai, toh wapas ke raaste ka pehla router, R2, 192.168.1.0/24 ka route miss kar raha hai. SW2 ko PC1 ke MAC ki kabhi zaroorat nahi, kyunki PC1 ka MAC LAN2 par use hi nahi hota.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Why does R1 ARP for 192.168.12.2, while R2 ARPs for 192.168.2.10 itself?",
        hi: "R1, 192.168.12.2 ke liye ARP kyun karta hai, jabki R2 seedha 192.168.2.10 ke liye ARP karta hai?",
      },
      options: [
        { en: "R2 is the last router, so it floods the packet to find the host", hi: "R2 aakhri router hai, isliye host dhoondhne ke liye packet flood karta hai" },
        { en: "R1's route points to a next-hop router; R2's route is directly connected, so the host is the next hop", hi: "R1 ka route next-hop router ki taraf point karta hai; R2 ka route directly connected hai, isliye host hi next hop hai" },
        { en: "Routers cannot ARP for hosts on a /30 network", hi: "Routers /30 network par hosts ke liye ARP nahi kar sakte" },
        { en: "PC2 asked R2 for its MAC first", hi: "PC2 ne pehle R2 se uska MAC poocha tha" },
      ],
      answer: 1,
      explain: {
        en: "A route with a next-hop IP means \"hand the packet to that router\", so R1 needs R2's MAC. A connected route means the destination is on the attached LAN, so R2 needs PC2's own MAC. Routers never flood packets to find a host.",
        hi: "Next-hop IP wale route ka matlab hai \"packet us router ko do\", isliye R1 ko R2 ka MAC chahiye. Connected route ka matlab destination router ke jude hue LAN par hai, isliye R2 ko PC2 ka apna MAC chahiye. Router host dhoondhne ke liye kabhi packets flood nahi karte.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "4YrYV2io3as",
      title: "Free CCNA | The Life of a Packet | Day 12",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The same idea step by step: ARP, MAC rewrites and routing lookups at every hop.", hi: "Yahi idea step by step: har hop par ARP, MAC rewrite aur routing lookup." },
    },
    {
      id: "bfsEqDeHbpI",
      title: "Free CCNA | Life of a Packet | Day 12 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "A Packet Tracer lab that follows one packet through several routers.", hi: "Packet Tracer lab jo ek packet ko kai routers ke through follow karta hai." },
    },
    {
      id: "ey4yJLFziUk",
      title: "Routing Fundamentals - IP Data Operations",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "A short Hindi overview of what happens to a packet at each hop.", hi: "Har hop par packet ke saath kya hota hai, iska chhota Hindi overview." },
    },
    {
      id: "5kCGv9mfuDQ",
      title: "Packet Flow in Hindi | How ARP Works in Hindi | How Ping Works in Hindi",
      channel: "Cisco Network Learning",
      lang: "hi",
      note: { en: "A longer Hindi walk-through of ARP and ping across routers.", hi: "Routers ke paar ARP aur ping ka lamba Hindi walk-through." },
    },
  ],
  lab: {
    title: { en: "Follow one ping in Packet Tracer", hi: "Packet Tracer mein ek ping follow karo" },
    steps: [
      {
        en: "Build PC1–SW1–R1–R2–SW2–PC2 with two 2911 routers and the addresses from the table in this lesson. Run `no shutdown` on every router interface you use.",
        hi: "Do 2911 routers ke saath PC1–SW1–R1–R2–SW2–PC2 banao aur is lesson ki table wale addresses lagao. Jo bhi router interface use karo, us par `no shutdown` chalao.",
      },
      {
        en: "Add the two routes in global configuration mode: on R1 `ip route 192.168.2.0 255.255.255.0 192.168.12.2`, on R2 `ip route 192.168.1.0 255.255.255.0 192.168.12.1`. The next lesson explains the command.",
        hi: "Global configuration mode mein dono routes add karo: R1 par `ip route 192.168.2.0 255.255.255.0 192.168.12.2`, R2 par `ip route 192.168.1.0 255.255.255.0 192.168.12.1`. Command agle lesson mein samjhaya gaya hai.",
      },
      {
        en: "Switch to Simulation mode, filter events to ARP and ICMP, and ping 192.168.2.10 from PC1. Click the ICMP packet on each link and compare the Ethernet and IP headers in the PDU details with this lesson's table.",
        hi: "Simulation mode mein jao, events ko ARP aur ICMP par filter karo, aur PC1 se 192.168.2.10 ping karo. Har link par ICMP packet par click karo aur PDU details ke Ethernet aur IP headers ko is lesson ki table se compare karo.",
      },
      {
        en: "Run `show ip arp` on R1 and R2 and `arp -a` on PC1. Confirm that R1 has no entry for 192.168.2.10 and PC1 has only its gateway.",
        hi: "R1 aur R2 par `show ip arp` aur PC1 par `arp -a` chalao. Confirm karo ki R1 mein 192.168.2.10 ki entry nahi hai aur PC1 mein sirf gateway hai.",
      },
      {
        en: "Run `tracert 192.168.2.10` on PC1. Then remove R2's route with `no ip route 192.168.1.0 255.255.255.0 192.168.12.1`, ping again in Simulation mode, and watch the reply die at R2.",
        hi: "PC1 par `tracert 192.168.2.10` chalao. Phir R2 ka route `no ip route 192.168.1.0 255.255.255.0 192.168.12.1` se hatao, Simulation mode mein dobara ping karo, aur dekho reply R2 par kaise khatam hota hai.",
      },
    ],
  },
};

export default lesson;
