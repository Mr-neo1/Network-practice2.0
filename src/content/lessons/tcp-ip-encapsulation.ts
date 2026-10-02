import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "tcp-ip-encapsulation",
  intro: {
    en: "The OSI model gives you seven layers to think with, but the protocols your PC actually runs (IP, TCP, UDP, HTTP, DNS) belong to the TCP/IP suite. Every message you send leaves your PC wrapped in several headers, one per layer, and some of those headers are rewritten at every router while others never change. Knowing which is which lets you read a packet capture, and it is the base for switching, routing and NAT later in the course.",
    hi: "OSI model tumhe sochne ke liye saat layers deta hai, lekin tumhara PC jo protocols asal mein chalata hai (IP, TCP, UDP, HTTP, DNS) woh TCP/IP suite ke hain. Tum jo bhi message bhejte ho, woh PC se kai headers mein wrap hokar nikalta hai, har layer ka ek header. Inme se kuch headers har router par dobara likhe jaate hain aur kuch kabhi nahi badalte. Kaunsa kaunsa hai, yeh samajh gaye toh packet capture padh paoge, aur aage switching, routing aur NAT sab isi base par khade hain.",
  },
  outcomes: [
    { en: "Name the layers of the TCP/IP model and map each one to the OSI layers", hi: "TCP/IP model ki layers ke naam bata sako aur har ek ko OSI layers se map kar sako" },
    { en: "Use the right PDU name at each layer: data, segment, packet, frame, bits", hi: "Har layer par sahi PDU naam use kar sako: data, segment, packet, frame, bits" },
    { en: "Describe encapsulation on the sender and decapsulation on the receiver, header by header", hi: "Sender par encapsulation aur receiver par decapsulation ko header by header samjha sako" },
    { en: "Tell same-layer interaction apart from adjacent-layer interaction", hi: "Same-layer interaction aur adjacent-layer interaction mein farak bata sako" },
    { en: "Predict which fields change at each router (MACs, TTL, FCS) and which stay the same end to end (IPs, ports)", hi: "Predict kar sako ki har router par kaunse fields badalte hain (MACs, TTL, FCS) aur kaunse end to end same rehte hain (IPs, ports)" },
  ],
  sections: [
    {
      id: "tcp-ip-model",
      heading: { en: "TCP/IP: the model the internet runs on", hi: "TCP/IP: woh model jis par internet chalta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "OSI (lesson 0.4) is a reference model: a shared vocabulary for talking about networks. The protocols that carry real traffic come from the **TCP/IP suite**, defined in RFCs published by the IETF. The TCP/IP model describes how those protocols stack on top of each other.",
            hi: "OSI (lesson 0.4) ek reference model hai: networks ke baare mein baat karne ki common language. Asli traffic le jaane wale protocols **TCP/IP suite** se aate hain, jo IETF ke RFCs mein defined hain. TCP/IP model batata hai ki yeh protocols ek ke upar ek kaise baithte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "The original model in RFC 1122 has four layers: Application, Transport, Internet and Link. Many CCNA books, including the official Cisco Press guide, use a five-layer version that splits Link into **Data Link** and **Physical** and calls Internet the **Network** layer. Other courses keep four layers and call the bottom one Network Access. All of them describe the same protocols; this course uses the five-layer names.",
            hi: "RFC 1122 wale original model mein chaar layers hain: Application, Transport, Internet aur Link. Kai CCNA books, official Cisco Press guide bhi, five-layer version use karti hain jisme Link ko **Data Link** aur **Physical** mein baant diya jaata hai aur Internet ko **Network** layer kaha jaata hai. Kuch courses chaar layers hi rakhte hain aur sabse neeche wali ko Network Access kehte hain. Sab ek hi protocols ki baat kar rahe hain; yeh course five-layer naam use karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "TCP/IP layers mapped to OSI", hi: "TCP/IP layers ka OSI se mapping" },
          columns: ["TCP/IP (5 layers)", "Original TCP/IP (4 layers)", "OSI layers", "Example protocols"],
          rows: [
            ["Application", "Application", "7 Application, 6 Presentation, 5 Session", "HTTP, HTTPS, DNS, DHCP, SSH"],
            ["Transport", "Transport", "4 Transport", "TCP, UDP"],
            ["Network", "Internet", "3 Network", "IPv4, IPv6, ICMP"],
            ["Data Link", "Link (Network Access)", "2 Data Link", "Ethernet, Wi-Fi (802.11)"],
            ["Physical", "Link (Network Access)", "1 Physical", { en: "Copper, fiber, radio", hi: "Copper, fiber, radio" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Layer numbers come from OSI", hi: "Layer numbers OSI se aate hain" },
          text: {
            en: "Engineers name protocols from TCP/IP but number layers with OSI. A switch is a **Layer 2** device, a router is **Layer 3**, TCP and UDP are **Layer 4**. Exam questions use these OSI numbers even when the topic is TCP/IP.",
            hi: "Engineers protocols ke naam TCP/IP se lete hain lekin layers ke number OSI se. Switch **Layer 2** device hai, router **Layer 3**, TCP aur UDP **Layer 4**. Topic TCP/IP ho tab bhi exam questions yahi OSI numbers use karte hain.",
          },
        },
      ],
    },
    {
      id: "pdus",
      heading: { en: "PDUs: what the data is called at each layer", hi: "PDUs: har layer par data ko kya kehte hain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "At each layer the unit of data has its own name, its **protocol data unit (PDU)**. The names are precise on purpose. \"The switch dropped the frame\" and \"the router forwarded the packet\" each tell you which layer the speaker means.",
            hi: "Har layer par data ki unit ka apna naam hota hai, jise **protocol data unit (PDU)** kehte hain. Yeh naam jaan-boojh kar precise hain. \"Switch ne frame drop kiya\" aur \"router ne packet forward kiya\", dono se pata chal jaata hai ki bolne wala kis layer ki baat kar raha hai.",
          },
        },
        {
          type: "table",
          caption: { en: "PDU names, top to bottom", hi: "PDU naam, upar se neeche" },
          columns: ["Layer", "PDU", { en: "What was added", hi: "Kya joda gaya" }, { en: "Addresses in that header", hi: "Us header mein addresses" }],
          rows: [
            ["Application (L5-7)", "Data", { en: "The application's own message, such as an HTTP request", hi: "Application ka apna message, jaise HTTP request" }, { en: "None from the network (a URL is application data)", hi: "Network wala koi nahi (URL application data hai)" }],
            ["Transport (L4)", { en: "Segment (TCP), datagram (UDP)", hi: "Segment (TCP), datagram (UDP)" }, { en: "TCP or UDP header", hi: "TCP ya UDP header" }, { en: "Source and destination port", hi: "Source aur destination port" }],
            ["Network (L3)", "Packet", { en: "IP header", hi: "IP header" }, { en: "Source and destination IP address", hi: "Source aur destination IP address" }],
            ["Data Link (L2)", "Frame", { en: "Header and a trailer (FCS)", hi: "Header aur ek trailer (FCS)" }, { en: "Source and destination MAC address", hi: "Source aur destination MAC address" }],
            ["Physical (L1)", "Bits", { en: "Nothing; the frame becomes signals", hi: "Kuch nahi; frame signals ban jaata hai" }, { en: "None", hi: "Koi nahi" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Remember the order", hi: "Order yaad rakho" },
          text: {
            en: "Top to bottom: Data, Segment, Packet, Frame, Bits. Many learners remember it as \"Do Some People Fear Birthdays?\"",
            hi: "Upar se neeche: Data, Segment, Packet, Frame, Bits. Bahut log ise \"Do Some People Fear Birthdays?\" se yaad rakhte hain.",
          },
        },
      ],
    },
    {
      id: "encapsulation",
      heading: { en: "Encapsulation: wrapping on the way down", hi: "Encapsulation: neeche jaate hue wrap karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Here is the example the animation plays. PC-A (10.1.1.10/24) opens `http://10.2.2.20`. The web server SRV1 is in a different subnet, so the traffic has to go through router R1, PC-A's default gateway at 10.1.1.1. Each layer adds its header in front of what it received from the layer above.",
            hi: "Yeh wahi example hai jo animation mein chalta hai. PC-A (10.1.1.10/24) `http://10.2.2.20` kholta hai. Web server SRV1 doosre subnet mein hai, isliye traffic ko router R1 se hokar jaana padega, jo PC-A ka default gateway 10.1.1.1 hai. Har layer upar wali layer se jo mila, uske aage apna header laga deti hai.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Application**: the browser writes an HTTP request, `GET /`. This is the data.",
              hi: "**Application**: browser ek HTTP request likhta hai, `GET /`. Yahi data hai.",
            },
            {
              en: "**Transport**: TCP adds a header with source port 51514 (a temporary port PC-A's operating system picked), destination port 80 (HTTP) and sequence numbers. The result is a **segment**.",
              hi: "**Transport**: TCP header jodta hai jisme source port 51514 (PC-A ke operating system ka chuna hua temporary port), destination port 80 (HTTP) aur sequence numbers hote hain. Result ek **segment** hai.",
            },
            {
              en: "**Network**: IP adds a header with source 10.1.1.10, destination 10.2.2.20, a TTL of 128 and Protocol 6, which means \"a TCP segment is inside\". The result is a **packet**.",
              hi: "**Network**: IP header jodta hai jisme source 10.1.1.10, destination 10.2.2.20, TTL 128 aur Protocol 6 hota hai, jiska matlab hai \"andar TCP segment hai\". Result ek **packet** hai.",
            },
            {
              en: "**Data Link**: Ethernet adds a header with destination MAC `0011.2233.4401` (R1's Gi0/0), source MAC `0050.56aa.0001` (PC-A) and Type `0x0800` (\"IPv4 inside\"), plus a trailer called the **FCS**. The result is a **frame**.",
              hi: "**Data Link**: Ethernet header jodta hai jisme destination MAC `0011.2233.4401` (R1 ka Gi0/0), source MAC `0050.56aa.0001` (PC-A) aur Type `0x0800` (\"andar IPv4 hai\") hota hai, aur end mein **FCS** naam ka trailer. Result ek **frame** hai.",
            },
            {
              en: "**Physical**: the network card sends the frame as bits: electrical signals on copper, light on fiber, radio waves on Wi-Fi.",
              hi: "**Physical**: network card frame ko bits ki tarah bhejta hai: copper par electrical signals, fiber par light, Wi-Fi par radio waves.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The destination MAC is the next hop, not the server", hi: "Destination MAC agla hop hai, server nahi" },
          text: {
            en: "SRV1 is in another subnet, so PC-A addresses the frame to R1's MAC, while the IP header still says 10.2.2.20. Lesson 1.2 (ARP) shows how PC-A learns R1's MAC in the first place.",
            hi: "SRV1 doosre subnet mein hai, isliye PC-A frame ko R1 ke MAC par bhejta hai, jabki IP header mein ab bhi 10.2.2.20 hi likha hai. PC-A ko R1 ka MAC pehli baar kaise milta hai, yeh lesson 1.2 (ARP) mein dekhoge.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Only Layer 2 adds a trailer", hi: "Trailer sirf Layer 2 lagata hai" },
          text: {
            en: "Every layer adds a header in front. Only the data link layer also adds a **trailer** at the end: the FCS (Frame Check Sequence), a checksum the receiver uses to detect frames damaged on the way.",
            hi: "Har layer aage header lagati hai. Sirf data link layer end mein **trailer** bhi lagati hai: FCS (Frame Check Sequence), ek checksum jisse receiver raaste mein kharab hue frames pakad leta hai.",
          },
        },
        {
          type: "code",
          lang: "text",
          title: { en: "The same frame in Wireshark (shortened, outermost header first)", hi: "Wahi frame Wireshark mein (chhota kiya hua, sabse bahar wala header pehle)" },
          code: [
            "Frame 42: 421 bytes on wire (3368 bits), 421 bytes captured (3368 bits)",
            "Ethernet II, Src: 00:50:56:aa:00:01, Dst: 00:11:22:33:44:01",
            "    Type: IPv4 (0x0800)",
            "Internet Protocol Version 4, Src: 10.1.1.10, Dst: 10.2.2.20",
            "    Time to Live: 128",
            "    Protocol: TCP (6)",
            "Transmission Control Protocol, Src Port: 51514, Dst Port: 80, Seq: 1, Ack: 1, Len: 367",
            "Hypertext Transfer Protocol",
            "    GET / HTTP/1.1\\r\\n",
          ].join("\n"),
        },
      ],
    },
    {
      id: "decapsulation",
      heading: { en: "Decapsulation: unwrapping on the way up", hi: "Decapsulation: upar jaate hue kholna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The receiver reverses the process. Each layer checks its own header, removes it and passes what is left to the layer above: frame, then packet, then segment, then data.",
            hi: "Receiver yahi process ulta chalata hai. Har layer apna header check karti hai, use hatati hai aur jo bacha woh upar wali layer ko de deti hai: pehle frame, phir packet, phir segment, phir data.",
          },
        },
        {
          type: "p",
          text: {
            en: "Before any unwrapping, the network card checks two things. The destination MAC must be its own (or broadcast, or a multicast group it has joined), and the FCS must be correct. A frame that fails the FCS check is dropped silently. If it was carrying TCP, the sender notices the missing data and sends it again; with UDP, recovery is up to the application.",
            hi: "Kholne se pehle network card do cheezein check karta hai. Destination MAC uska apna ho (ya broadcast, ya koi multicast group jo usne join kiya hai), aur FCS sahi ho. FCS check fail hua toh frame chupchaap drop ho jaata hai. Usme TCP tha toh sender notice karega ki data missing hai aur dobara bhej dega; UDP mein recovery application ki zimmedari hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "How does each layer know which protocol above should get the payload? Every header carries a field that names the next one up.",
            hi: "Har layer ko kaise pata ki payload upar kis protocol ko dena hai? Har header mein ek field hota hai jo agle upar wale ka naam batata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The \"what is inside\" field in each header", hi: "Har header ka \"andar kya hai\" field" },
          columns: ["Header", "Field", { en: "Value here", hi: "Yahan value" }, { en: "Meaning", hi: "Matlab" }],
          rows: [
            ["Ethernet", "Type (EtherType)", "0x0800", { en: "Payload is IPv4 (0x86DD would be IPv6, 0x0806 ARP)", hi: "Payload IPv4 hai (0x86DD hota toh IPv6, 0x0806 hota toh ARP)" }],
            ["IPv4", "Protocol", "6", { en: "Payload is TCP (17 would be UDP, 1 ICMP)", hi: "Payload TCP hai (17 hota toh UDP, 1 hota toh ICMP)" }],
            ["TCP", { en: "Destination port", hi: "Destination port" }, "80", { en: "Give the data to the web server process", hi: "Data web server process ko do" }],
          ],
        },
      ],
    },
    {
      id: "interactions",
      heading: { en: "Same-layer and adjacent-layer interaction", hi: "Same-layer aur adjacent-layer interaction" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Two kinds of conversation happen during every transfer. CCNA books use these two terms, so learn to match each one to an example.",
            hi: "Har transfer mein do tarah ki baat-cheet hoti hai. CCNA books yahi do terms use karti hain, isliye har ek ko example se match karna seekho.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Same-layer interaction** (between devices): a layer on one device talks to the same layer on another device, and its header is how it talks. TCP on SRV1 reads the sequence numbers TCP on PC-A wrote and acknowledges them. R1's IP layer reads the IP header PC-A built to decide where the packet goes.",
              hi: "**Same-layer interaction** (devices ke beech): ek device ki layer doosre device ki usi layer se baat karti hai, aur uska header hi baat karne ka tareeka hai. SRV1 ka TCP woh sequence numbers padhta hai jo PC-A ke TCP ne likhe, aur unhe acknowledge karta hai. R1 ki IP layer PC-A ka banaya IP header padh kar decide karti hai ki packet kahan jaayega.",
            },
            {
              en: "**Adjacent-layer interaction** (inside one device): a layer asks the layer below for a service and delivers results to the layer above. On PC-A, TCP hands its segment to IP to deliver, and IP asks Ethernet to carry the packet to the next hop.",
              hi: "**Adjacent-layer interaction** (ek hi device ke andar): ek layer neeche wali layer se service maangti hai aur result upar wali layer ko deti hai. PC-A par TCP apna segment IP ko deliver karne ke liye deta hai, aur IP Ethernet se kehta hai ki packet agle hop tak le jao.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Quick test", hi: "Jaldi pehchaan" },
          text: {
            en: "Two devices, same layer, through a header: same-layer. One device, neighbouring layers, handing data up or down: adjacent-layer.",
            hi: "Do devices, same layer, header ke through: same-layer. Ek device, padosi layers, data upar ya neeche dena: adjacent-layer.",
          },
        },
      ],
    },
    {
      id: "hop-by-hop",
      heading: { en: "What changes at each router, and what never does", hi: "Har router par kya badalta hai, aur kya kabhi nahi" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A MAC address only means something on its own link, so a frame lives for exactly one hop. R1 removes the Ethernet header and trailer, reads the IP header, lowers the TTL by 1 (so it also recalculates the IPv4 header checksum) and wraps the same packet in a new frame for the next link. The packet inside travels end to end.",
            hi: "MAC address ka matlab sirf apne link par hota hai, isliye frame sirf ek hop tak zinda rehta hai. R1 Ethernet header aur trailer hatata hai, IP header padhta hai, TTL 1 kam karta hai (isliye IPv4 header checksum bhi dobara calculate karta hai) aur usi packet ko agle link ke liye naye frame mein wrap kar deta hai. Andar wala packet end to end travel karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The same request on both links", hi: "Wahi request dono links par" },
          columns: ["Field", "PC-A → R1 (link 1)", "R1 → SRV1 (link 2)", { en: "Changed?", hi: "Badla?" }],
          rows: [
            ["Destination MAC", "0011.2233.4401 (R1 Gi0/0)", "0050.56bb.0020 (SRV1)", { en: "Yes", hi: "Haan" }],
            ["Source MAC", "0050.56aa.0001 (PC-A)", "0011.2233.4402 (R1 Gi0/1)", { en: "Yes", hi: "Haan" }],
            ["Source IP", "10.1.1.10", "10.1.1.10", { en: "No", hi: "Nahi" }],
            ["Destination IP", "10.2.2.20", "10.2.2.20", { en: "No", hi: "Nahi" }],
            ["TTL", "128", "127", { en: "Yes, minus 1 per router", hi: "Haan, har router par 1 kam" }],
            ["TCP ports", "51514 → 80", "51514 → 80", { en: "No", hi: "Nahi" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Switches do not rewrite; NAT does", hi: "Switch kuch nahi badalta; NAT badalta hai" },
          text: {
            en: "A switch forwards a frame without changing its MAC addresses or its IP header, so it is not a hop in this sense. The exception on the IP side is NAT: a router doing NAT (lesson 4.3) rewrites IP addresses, and with PAT the ports too. Without NAT, addresses and ports stay the same end to end.",
            hi: "Switch frame ko uske MAC addresses ya IP header badle bina forward karta hai, isliye is sense mein woh hop nahi hai. IP side par exception NAT hai: NAT karne wala router (lesson 4.3) IP addresses badalta hai, aur PAT ho toh ports bhi. NAT nahi hai toh addresses aur ports end to end same rehte hain.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "A courier parcel carries the full delivery address the whole way; that is the IP header. Each truck only gets a label for its next depot; that is the Ethernet header. At every depot the old truck label comes off and a new one goes on, but nobody touches the address on the parcel.",
            hi: "Courier parcel par poora delivery address shuru se aakhir tak likha rehta hai; woh IP header hai. Har truck ko sirf agle depot ka label milta hai; woh Ethernet header hai. Har depot par purana truck label hata kar naya lagaya jaata hai, lekin parcel ke address ko koi haath nahi lagata.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "PDU", def: { en: "Protocol data unit: the name for the unit of data at one layer (data, segment, packet, frame, bits).", hi: "Protocol data unit: ek layer par data ki unit ka naam (data, segment, packet, frame, bits)." } },
    { term: "Encapsulation", def: { en: "Adding a layer's header (and at Layer 2 also a trailer) around the data handed down from the layer above.", hi: "Upar wali layer se aaye data ke aas-paas apni layer ka header (aur Layer 2 par trailer bhi) lagana." } },
    { term: "Decapsulation", def: { en: "Reading and removing each header in turn as data moves up the stack on the receiver.", hi: "Receiver par data upar jaate hue har header ko baari-baari padhna aur hatana." } },
    { term: "Segment", def: { en: "A TCP header plus data: the Layer 4 PDU. With UDP it is usually called a datagram.", hi: "TCP header plus data: Layer 4 ka PDU. UDP ke saath ise aam taur par datagram kehte hain." } },
    { term: "Packet", def: { en: "An IP header plus a segment: the Layer 3 PDU that routers forward.", hi: "IP header plus segment: Layer 3 ka PDU jise routers forward karte hain." } },
    { term: "Frame", def: { en: "A Layer 2 header and trailer around a packet. It is rebuilt at every router, so it lives for one link.", hi: "Packet ke aas-paas Layer 2 ka header aur trailer. Har router par naya banta hai, isliye sirf ek link tak rehta hai." } },
    { term: "Same-layer interaction", def: { en: "The same layer on two devices communicating through the header that layer adds.", hi: "Do devices par ek hi layer ka us header ke through baat karna jo woh layer lagati hai." } },
    { term: "Adjacent-layer interaction", def: { en: "Neighbouring layers on one device handing data to each other and providing services.", hi: "Ek hi device ki padosi layers ka ek doosre ko data dena aur service provide karna." } },
  ],
  mistakes: [
    {
      en: "Calling everything a \"packet\". A TCP unit is a segment (L4), an IP unit is a packet (L3), an Ethernet unit is a frame (L2). Exam answers depend on the exact word.",
      hi: "Har cheez ko \"packet\" bolna. TCP ki unit segment (L4) hai, IP ki packet (L3), Ethernet ki frame (L2). Exam mein answer isi exact word par tikta hai.",
    },
    {
      en: "Thinking a router changes the destination IP to the next router's address. The destination IP stays 10.2.2.20 the whole way; only the frame's MAC addresses change (NAT is the one exception).",
      hi: "Yeh sochna ki router destination IP ko agle router ke address mein badal deta hai. Destination IP poore raaste 10.2.2.20 hi rehta hai; sirf frame ke MAC addresses badalte hain (NAT akela exception hai).",
    },
    {
      en: "Putting the server's MAC in the first frame when the server is in another subnet. The first frame goes to the default gateway's MAC.",
      hi: "Server doosre subnet mein ho tab bhi pehle frame mein server ka MAC daalna. Pehla frame default gateway ke MAC par jaata hai.",
    },
    {
      en: "Saying every layer adds a trailer. Only the data link layer adds one, the FCS.",
      hi: "Yeh bolna ki har layer trailer lagati hai. Trailer sirf data link layer lagati hai, yaani FCS.",
    },
    {
      en: "Mapping the TCP/IP application layer to OSI Layer 7 only. It covers OSI Layers 5, 6 and 7.",
      hi: "TCP/IP application layer ko sirf OSI Layer 7 se map karna. Yeh OSI Layer 5, 6 aur 7 teeno ko cover karti hai.",
    },
    {
      en: "Mixing up the two interactions. Same-layer is between devices through a header; adjacent-layer is inside one device between neighbouring layers.",
      hi: "Dono interactions ko mix karna. Same-layer devices ke beech header ke through hota hai; adjacent-layer ek device ke andar padosi layers ke beech.",
    },
  ],
  recap: [
    { en: "TCP/IP layers: Application (OSI 5-7), Transport (4), Network or Internet (3), Data Link (2), Physical (1). The original model merges the bottom two into Link.", hi: "TCP/IP layers: Application (OSI 5-7), Transport (4), Network ya Internet (3), Data Link (2), Physical (1). Original model neeche wali do ko Link mein mila deta hai." },
    { en: "PDUs top to bottom: data, segment (UDP: datagram), packet, frame, bits.", hi: "PDUs upar se neeche: data, segment (UDP mein datagram), packet, frame, bits." },
    { en: "Going down, each layer adds a header; Layer 2 also adds the FCS trailer. Going up, each layer removes its header, guided by EtherType, IP Protocol and port number.", hi: "Neeche jaate hue har layer header lagati hai; Layer 2 FCS trailer bhi. Upar jaate hue har layer apna header hatati hai, EtherType, IP Protocol aur port number ki madad se." },
    { en: "Same-layer interaction: same layer, two devices, via the header. Adjacent-layer: neighbouring layers inside one device.", hi: "Same-layer interaction: same layer, do devices, header ke through. Adjacent-layer: ek device ke andar padosi layers." },
    { en: "At every router: new source and destination MAC, TTL minus 1 (and a new IPv4 header checksum), new FCS. IP addresses and ports stay the same unless NAT is used.", hi: "Har router par: naya source aur destination MAC, TTL 1 kam (aur naya IPv4 header checksum), naya FCS. IP addresses aur ports same rehte hain, jab tak NAT na ho." },
  ],
  quiz: [
    {
      q: { en: "What is the PDU called at the transport layer when TCP is used?", hi: "TCP use ho raha ho toh transport layer par PDU ko kya kehte hain?" },
      options: [
        { en: "Frame", hi: "Frame" },
        { en: "Packet", hi: "Packet" },
        { en: "Segment", hi: "Segment" },
        { en: "Bits", hi: "Bits" },
      ],
      answer: 2,
      explain: {
        en: "A TCP header plus data is a segment. An IP header around the segment makes a packet (Layer 3), and a Layer 2 header and trailer around the packet make a frame.",
        hi: "TCP header plus data segment hai. Segment ke aas-paas IP header lagao toh packet (Layer 3) banta hai, aur packet ke aas-paas Layer 2 header aur trailer lagao toh frame.",
      },
      kind: "concept",
    },
    {
      q: { en: "Which OSI layers does the application layer of the TCP/IP model cover?", hi: "TCP/IP model ki application layer kaunsi OSI layers ko cover karti hai?" },
      options: [
        { en: "Layer 7 only", hi: "Sirf Layer 7" },
        { en: "Layers 5, 6 and 7", hi: "Layer 5, 6 aur 7" },
        { en: "Layers 4 to 7", hi: "Layer 4 se 7" },
        { en: "Layers 6 and 7", hi: "Layer 6 aur 7" },
      ],
      answer: 1,
      explain: {
        en: "TCP/IP has no separate session or presentation layer; applications handle those jobs themselves. So its application layer maps to OSI 5, 6 and 7. Layer 4 is the TCP/IP transport layer.",
        hi: "TCP/IP mein alag session ya presentation layer nahi hai; yeh kaam applications khud karti hain. Isliye uski application layer OSI 5, 6 aur 7 se map hoti hai. Layer 4 TCP/IP ki transport layer hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "PC-A (10.1.1.10) sends to SRV1 (10.2.2.20) through router R1, with no NAT. On the link between R1 and SRV1, what are the frame's source MAC and the packet's source IP?",
        hi: "PC-A (10.1.1.10) router R1 ke through SRV1 (10.2.2.20) ko bhejta hai, koi NAT nahi hai. R1 aur SRV1 ke beech wale link par frame ka source MAC aur packet ka source IP kya hoga?",
      },
      options: [
        { en: "Source MAC: R1's Gi0/1; source IP: 10.1.1.10", hi: "Source MAC: R1 ka Gi0/1; source IP: 10.1.1.10" },
        { en: "Source MAC: PC-A's; source IP: 10.1.1.10", hi: "Source MAC: PC-A ka; source IP: 10.1.1.10" },
        { en: "Source MAC: R1's Gi0/1; source IP: 10.2.2.1", hi: "Source MAC: R1 ka Gi0/1; source IP: 10.2.2.1" },
        { en: "Source MAC: PC-A's; source IP: 10.2.2.1", hi: "Source MAC: PC-A ka; source IP: 10.2.2.1" },
      ],
      answer: 0,
      explain: {
        en: "R1 builds a new frame for link 2, so the source MAC is its own Gi0/1. The IP header is the one PC-A built, so the source IP is still 10.1.1.10. R1's own address 10.2.2.1 never appears in the packet.",
        hi: "R1 link 2 ke liye naya frame banata hai, isliye source MAC uska apna Gi0/1 hai. IP header wahi hai jo PC-A ne banaya tha, toh source IP ab bhi 10.1.1.10 hai. R1 ka apna address 10.2.2.1 packet mein kahin nahi aata.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "SRV1 has accepted a frame: the destination MAC is its own and the FCS is correct. Which field tells it to hand the payload to IPv4?",
        hi: "SRV1 ne frame accept kar liya: destination MAC uska apna hai aur FCS sahi hai. Kaunsa field use batata hai ki payload IPv4 ko dena hai?",
      },
      options: [
        { en: "The IP Protocol field, value 6", hi: "IP Protocol field, value 6" },
        { en: "The TCP destination port, value 80", hi: "TCP destination port, value 80" },
        { en: "The FCS", hi: "FCS" },
        { en: "The Ethernet Type field, value 0x0800", hi: "Ethernet Type field, value 0x0800" },
      ],
      answer: 3,
      explain: {
        en: "EtherType 0x0800 means IPv4. Protocol 6 is read one layer later and means TCP; port 80 is read at Layer 4. The FCS only says whether the frame arrived undamaged.",
        hi: "EtherType 0x0800 ka matlab IPv4 hai. Protocol 6 ek layer baad padha jaata hai aur uska matlab TCP hai; port 80 Layer 4 par padha jaata hai. FCS sirf batata hai ki frame sahi-salamat pahuncha ya nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "TCP on SRV1 reads the sequence number that TCP on PC-A wrote into the segment header, and acknowledges it. What is this an example of?",
        hi: "SRV1 ka TCP woh sequence number padhta hai jo PC-A ke TCP ne segment header mein likha tha, aur use acknowledge karta hai. Yeh kiska example hai?",
      },
      options: [
        { en: "Same-layer interaction", hi: "Same-layer interaction" },
        { en: "Adjacent-layer interaction", hi: "Adjacent-layer interaction" },
        { en: "Encapsulation at the physical layer", hi: "Physical layer par encapsulation" },
        { en: "A hop-by-hop header rewrite", hi: "Hop-by-hop header rewrite" },
      ],
      answer: 0,
      explain: {
        en: "The same layer (TCP) on two devices communicates through the header it adds. Adjacent-layer interaction is between neighbouring layers on one device, such as TCP handing a segment to IP.",
        hi: "Do devices par ek hi layer (TCP) apne lagaye header ke through baat kar rahi hai. Adjacent-layer interaction ek device ki padosi layers ke beech hota hai, jaise TCP ka segment IP ko dena.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "PC-A sends a packet with TTL 128. On the way to the server it passes through a switch, router R1, another switch and router R2. What TTL does the server see?",
        hi: "PC-A TTL 128 ke saath packet bhejta hai. Server tak jaate hue woh ek switch, router R1, ek aur switch aur router R2 se guzarta hai. Server ko kaunsa TTL dikhega?",
      },
      options: [
        { en: "128", hi: "128" },
        { en: "126", hi: "126" },
        { en: "124", hi: "124" },
        { en: "127", hi: "127" },
      ],
      answer: 1,
      explain: {
        en: "Only routers lower the TTL, by 1 each: 128 − 2 = 126. Switches forward frames at Layer 2 and never touch the IP header.",
        hi: "TTL sirf routers kam karte hain, har ek 1: 128 − 2 = 126. Switches Layer 2 par frame forward karte hain aur IP header ko chhoote bhi nahi.",
      },
      kind: "calc",
    },
  ],
  videos: [
    {
      id: "yM-XNq9ADlI",
      title: "How the TCP/IP Model Actually Works | CCNA Day 3",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The TCP/IP layers and how data moves down and back up them, from the CCNA v1.1 course.", hi: "TCP/IP layers aur data unme neeche-upar kaise jaata hai, CCNA v1.1 course se." },
    },
    {
      id: "3kfO61Mensg",
      title: "REAL LIFE example!! (TCP/IP and OSI layers) // FREE CCNA // EP 4",
      channel: "NetworkChuck",
      lang: "en",
      note: { en: "A lighter, real-world walk through the layers if you want a second explanation.", hi: "Layers ka halka, real-world walkthrough, agar doosra explanation chahiye." },
    },
    {
      id: "KHvJhb-ENhU",
      title: "3. Free CCNA (NEW) | OSI Model in Hindi - Upper Layers & Encapsulation",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of the upper layers and how encapsulation adds headers.", hi: "Upper layers aur encapsulation mein headers kaise judte hain, Hindi mein." },
    },
    {
      id: "89dwTC62UDE",
      title: "7. TCP/IP Networking model",
      channel: "NetworkPath",
      lang: "hi",
      note: { en: "The TCP/IP model layer by layer, in Hindi.", hi: "TCP/IP model layer by layer, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Watch the headers change in Packet Tracer", hi: "Packet Tracer mein headers badalte hue dekho" },
    steps: [
      {
        en: "Build PC-A, a switch, router R1 and a server SRV1 in a line. Give PC-A 10.1.1.10/24 with gateway 10.1.1.1, and SRV1 10.2.2.20/24 with gateway 10.2.2.1.",
        hi: "PC-A, ek switch, router R1 aur server SRV1 ko ek line mein banao. PC-A ko 10.1.1.10/24 aur gateway 10.1.1.1 do, aur SRV1 ko 10.2.2.20/24 aur gateway 10.2.2.1.",
      },
      {
        en: "On R1's Config tab, give Gi0/0 10.1.1.1/24 and Gi0/1 10.2.2.1/24 and set Port Status to On for both. (Lesson 0.8 shows the same thing in the CLI.)",
        hi: "R1 ke Config tab mein Gi0/0 ko 10.1.1.1/24 aur Gi0/1 ko 10.2.2.1/24 do, aur dono ka Port Status On karo. (Lesson 0.8 mein yahi kaam CLI se karoge.)",
      },
      {
        en: "Switch to Simulation mode, edit the filters to show only HTTP, then open `http://10.2.2.20` in PC-A's Web Browser.",
        hi: "Simulation mode mein jao, filters edit karke sirf HTTP rakho, phir PC-A ke Web Browser mein `http://10.2.2.20` kholo.",
      },
      {
        en: "Click the HTTP envelope at PC-A and open Outbound PDU Details. Find the Ethernet II, IP and TCP headers and match each to a layer from this lesson.",
        hi: "PC-A par HTTP envelope par click karo aur Outbound PDU Details kholo. Ethernet II, IP aur TCP headers dhoondho aur har ek ko is lesson ki layer se match karo.",
      },
      {
        en: "Step forward to R1 and compare Inbound PDU Details with Outbound PDU Details. Which MAC addresses changed, what happened to the TTL, and what stayed the same?",
        hi: "Aage badh kar R1 par jao aur Inbound PDU Details ko Outbound PDU Details se compare karo. Kaunse MAC addresses badle, TTL ka kya hua, aur kya same raha?",
      },
      {
        en: "At SRV1, open the OSI Model tab and read the In Layers list from Layer 1 upwards: that is decapsulation.",
        hi: "SRV1 par OSI Model tab kholo aur In Layers list ko Layer 1 se upar ki taraf padho: yahi decapsulation hai.",
      },
    ],
  },
};

export default lesson;
