import type { LayersScene } from "../types.ts";

// One HTTP request from PC-A (10.1.1.10) to SRV1 (10.2.2.20) through router R1.
// PC-A  0050.56aa.0001 | R1 Gi0/0 10.1.1.1 0011.2233.4401 | R1 Gi0/1 10.2.2.1 0011.2233.4402 | SRV1 0050.56bb.0020
const scene: LayersScene = {
  kind: "layers",
  id: "tcp-ip-encapsulation",
  title: { en: "One web request: wrapped, rewrapped at the router, unwrapped", hi: "Ek web request: wrap, router par naya wrap, phir unwrap" },
  stack: ["Application", "Transport", "Network", "Data Link", "Physical"],
  steps: [
    {
      title: { en: "PC-A's browser creates data", hi: "PC-A ka browser data banata hai" },
      text: {
        en: "PC-A opens http://10.2.2.20 and the browser writes an HTTP request, `GET /`. So far this is only application data, with no ports and no network headers. The `Host:` line is just text inside the request; no device forwards on it.",
        hi: "PC-A http://10.2.2.20 kholta hai aur browser ek HTTP request likhta hai, `GET /`. Abhi yeh sirf application data hai: na ports, na koi network header. `Host:` line request ke andar ka text bhar hai; koi device us par forwarding nahi karta.",
      },
      stackActive: "Application",
      rows: [{ label: "Data", blocks: [{ id: "data", label: "HTTP GET /", sub: "Host: 10.2.2.20", tone: "gray", w: 1.3 }] }],
    },
    {
      title: { en: "Transport adds a TCP header: segment", hi: "Transport TCP header jodta hai: segment" },
      text: {
        en: "TCP puts its header in front: source port 51514 (a temporary port PC-A picked) and destination port 80 (HTTP), plus sequence numbers. Header + data is a **segment**.",
        hi: "TCP apna header aage lagata hai: source port 51514 (PC-A ka chuna hua temporary port) aur destination port 80 (HTTP), saath mein sequence numbers. Header + data ko **segment** kehte hain.",
      },
      stackActive: "Transport",
      focus: ["tcp"],
      rows: [
        {
          label: "Segment",
          blocks: [
            { id: "tcp", label: "TCP header", sub: "51514 → 80", tone: "green", w: 1.4 },
            { id: "data", label: "HTTP GET /", sub: "Host: 10.2.2.20", tone: "gray", w: 1.3 },
          ],
        },
      ],
    },
    {
      title: { en: "Network adds an IP header: packet", hi: "Network IP header jodta hai: packet" },
      text: {
        en: "IP adds source 10.1.1.10, destination 10.2.2.20, a TTL of 128 and Protocol 6, which says a TCP segment is inside. Segment + IP header is a **packet**. These two addresses name the real endpoints.",
        hi: "IP source 10.1.1.10, destination 10.2.2.20, TTL 128 aur Protocol 6 jodta hai; Protocol 6 batata hai ki andar TCP segment hai. Segment + IP header ko **packet** kehte hain. Yeh do addresses asli endpoints ke hain.",
      },
      stackActive: "Network",
      focus: ["ip"],
      rows: [
        {
          label: "Packet",
          blocks: [
            { id: "ip", label: "IP header · TTL 128", sub: "10.1.1.10 → 10.2.2.20", tone: "blue", w: 2 },
            { id: "tcp", label: "TCP header", sub: "51514 → 80", tone: "green", w: 1.4 },
            { id: "data", label: "HTTP GET /", sub: "Host: 10.2.2.20", tone: "gray", w: 1.3 },
          ],
        },
      ],
    },
    {
      title: { en: "Data Link adds header and trailer: frame", hi: "Data Link header aur trailer jodta hai: frame" },
      text: {
        en: "10.2.2.20 is outside PC-A's subnet 10.1.1.0/24, so the frame goes to the default gateway: destination MAC 0011.2233.4401 is R1's Gi0/0. Type 0x0800 says IPv4 is inside, and the FCS trailer lets the receiver detect damaged bits. This is a **frame**.",
        hi: "10.2.2.20 PC-A ke subnet 10.1.1.0/24 ke bahar hai, isliye frame default gateway ko jaata hai: destination MAC 0011.2233.4401 R1 ka Gi0/0 hai. Type 0x0800 batata hai ki andar IPv4 hai, aur FCS trailer se receiver kharab bits pakad leta hai. Yeh **frame** hai.",
      },
      stackActive: "Data Link",
      focus: ["dmac", "smac", "type", "fcs"],
      rows: [
        {
          label: "Frame",
          blocks: [
            { id: "dmac", label: "Dst MAC (R1)", sub: "0011.2233.4401", tone: "orange", w: 1.8 },
            { id: "smac", label: "Src MAC (PC-A)", sub: "0050.56aa.0001", tone: "orange", w: 1.8 },
            { id: "type", label: "Type", sub: "0x0800", tone: "orange", w: 1 },
            { id: "ip", label: "IP header · TTL 128", sub: "10.1.1.10 → 10.2.2.20", tone: "blue", w: 2 },
            { id: "tcp", label: "TCP header", sub: "51514 → 80", tone: "green", w: 1.4 },
            { id: "data", label: "HTTP GET /", sub: "Host: 10.2.2.20", tone: "gray", w: 1.3 },
            { id: "fcs", label: "FCS", sub: "CRC", tone: "orange", w: 0.9 },
          ],
        },
      ],
    },
    {
      title: { en: "Physical sends the frame as bits", hi: "Physical frame ko bits bana kar bhejta hai" },
      text: {
        en: "PC-A's network card turns the frame into signals: voltage on copper, light on fiber, radio on Wi-Fi. The cable only carries bits; it knows nothing about headers.",
        hi: "PC-A ka network card frame ko signals mein badal deta hai: copper par voltage, fiber par light, Wi-Fi par radio. Cable sirf bits le jaata hai; use headers ka kuch pata nahi.",
      },
      stackActive: "Physical",
      rows: [
        {
          label: "Frame",
          blocks: [
            { id: "dmac", label: "Dst MAC (R1)", sub: "0011.2233.4401", tone: "orange", w: 1.8 },
            { id: "smac", label: "Src MAC (PC-A)", sub: "0050.56aa.0001", tone: "orange", w: 1.8 },
            { id: "type", label: "Type", sub: "0x0800", tone: "orange", w: 1 },
            { id: "ip", label: "IP header · TTL 128", sub: "10.1.1.10 → 10.2.2.20", tone: "blue", w: 2 },
            { id: "tcp", label: "TCP header", sub: "51514 → 80", tone: "green", w: 1.4 },
            { id: "data", label: "HTTP GET /", sub: "Host: 10.2.2.20", tone: "gray", w: 1.3 },
            { id: "fcs", label: "FCS", sub: "CRC", tone: "orange", w: 0.9 },
          ],
        },
        { label: "Bits", blocks: [{ id: "bits", label: "0100 1011 1101 0010 …", sub: "on the wire to R1", tone: "gray", w: 10.2 }] },
      ],
    },
    {
      title: { en: "R1 unwraps only up to Layer 3", hi: "R1 sirf Layer 3 tak kholta hai" },
      text: {
        en: "R1 sees its own MAC as the destination and a good FCS, so it accepts the frame and strips the Ethernet header and trailer. It reads the destination IP, 10.2.2.20, and its routing table shows 10.2.2.0/24 connected on Gi0/1. A router never needs the TCP header or the data.",
        hi: "R1 dekhta hai ki destination MAC uska apna hai aur FCS sahi hai, toh frame accept karke Ethernet header aur trailer hata deta hai. Phir destination IP 10.2.2.20 padhta hai, aur routing table batata hai ki 10.2.2.0/24 Gi0/1 par connected hai. Router ko TCP header ya data ki zaroorat hi nahi.",
      },
      stackActive: "Network",
      focus: ["ip"],
      rows: [
        {
          label: "Packet at R1",
          blocks: [
            { id: "ip", label: "IP header · TTL 128", sub: "dst 10.2.2.20 → Gi0/1", tone: "blue", w: 2 },
            { id: "tcp", label: "TCP header", sub: "not read by R1", tone: "green", w: 1.4 },
            { id: "data", label: "HTTP GET /", sub: "not read by R1", tone: "gray", w: 1.3 },
          ],
        },
      ],
    },
    {
      title: { en: "R1 builds a brand-new frame", hi: "R1 bilkul naya frame banata hai" },
      text: {
        en: "R1 lowers the TTL to 127 and wraps the same packet in a new frame for the next link: source MAC 0011.2233.4402 (its Gi0/1), destination MAC 0050.56bb.0020 (SRV1, from R1's ARP cache). The FCS is recalculated because the frame is new.",
        hi: "R1 TTL ko 127 kar deta hai aur usi packet ko agle link ke liye naye frame mein wrap karta hai: source MAC 0011.2233.4402 (uska Gi0/1), destination MAC 0050.56bb.0020 (SRV1, R1 ke ARP cache se). Frame naya hai, isliye FCS dobara calculate hota hai.",
      },
      stackActive: "Data Link",
      focus: ["dmac2", "smac2", "ip", "fcs2"],
      rows: [
        {
          label: "Frame on link 2",
          blocks: [
            { id: "dmac2", label: "Dst MAC (SRV1)", sub: "0050.56bb.0020", tone: "orange", w: 1.8 },
            { id: "smac2", label: "Src MAC (R1)", sub: "0011.2233.4402", tone: "orange", w: 1.8 },
            { id: "type", label: "Type", sub: "0x0800", tone: "orange", w: 1 },
            { id: "ip", label: "IP header · TTL 127", sub: "10.1.1.10 → 10.2.2.20", tone: "blue", w: 2 },
            { id: "tcp", label: "TCP header", sub: "51514 → 80", tone: "green", w: 1.4 },
            { id: "data", label: "HTTP GET /", sub: "Host: 10.2.2.20", tone: "gray", w: 1.3 },
            { id: "fcs2", label: "FCS", sub: "new CRC", tone: "orange", w: 0.9 },
          ],
        },
      ],
    },
    {
      title: { en: "What changed at the hop, what did not", hi: "Hop par kya badla, kya nahi" },
      text: {
        en: "Both MAC addresses changed because a MAC address only means something on its own link; the TTL dropped by 1 (so the IP header checksum was recalculated) and the FCS is new. The IP addresses, the ports and the data are exactly what PC-A sent. Only a router doing NAT (lesson 4.3) would rewrite them.",
        hi: "Dono MAC addresses badle kyunki MAC address ka matlab sirf apne link par hota hai; TTL 1 kam hua (isliye IP header checksum dobara calculate hua) aur FCS naya hai. IP addresses, ports aur data bilkul wahi hain jo PC-A ne bheje the. Inhe sirf NAT karne wala router (lesson 4.3) badalta hai.",
      },
      focus: ["dmac2", "smac2", "ttl", "fcs2"],
      rows: [
        {
          label: "New every hop",
          blocks: [
            { id: "dmac2", label: "Dst MAC", sub: "R1 Gi0/0 → SRV1", tone: "orange" },
            { id: "smac2", label: "Src MAC", sub: "PC-A → R1 Gi0/1", tone: "orange" },
            { id: "ttl", label: "TTL", sub: "128 → 127", tone: "blue" },
            { id: "fcs2", label: "FCS", sub: "recalculated", tone: "orange" },
          ],
        },
        {
          label: "Same end to end",
          blocks: [
            { id: "ip", label: "IP addresses", sub: "10.1.1.10 → 10.2.2.20", tone: "blue" },
            { id: "tcp", label: "TCP ports", sub: "51514 → 80", tone: "green" },
            { id: "data", label: "HTTP GET /", sub: "untouched", tone: "gray" },
          ],
        },
      ],
    },
    {
      title: { en: "SRV1 unwraps using each header's pointer", hi: "SRV1 har header ke pointer se kholta hai" },
      text: {
        en: "SRV1 sees its own MAC and a good FCS, so it accepts the frame. Each header names the next layer up: Type 0x0800 hands the payload to IPv4, IP Protocol 6 hands it to TCP, and destination port 80 hands the data to the web server. Each layer removes its header as it passes the rest up.",
        hi: "SRV1 ko apna MAC aur sahi FCS dikhta hai, toh woh frame accept kar leta hai. Har header agli upar wali layer ka naam batata hai: Type 0x0800 payload IPv4 ko deta hai, IP Protocol 6 TCP ko, aur destination port 80 data web server ko. Har layer apna header hata kar baaki upar bhej deti hai.",
      },
      stackActive: "Data Link",
      focus: ["type", "ip", "tcp"],
      rows: [
        {
          label: "Frame at SRV1",
          blocks: [
            { id: "dmac2", label: "Dst MAC", sub: "mine: accept", tone: "orange", w: 1.6 },
            { id: "smac2", label: "Src MAC", sub: "R1 Gi0/1", tone: "orange", w: 1.6 },
            { id: "type", label: "Type", sub: "0x0800 → IPv4", tone: "orange", w: 1.5 },
            { id: "ip", label: "IP header", sub: "Protocol 6 → TCP", tone: "blue", w: 1.8 },
            { id: "tcp", label: "TCP header", sub: "port 80 → web server", tone: "green", w: 1.8 },
            { id: "data", label: "HTTP GET /", tone: "gray", w: 1.1 },
            { id: "fcs2", label: "FCS", sub: "OK", tone: "orange", w: 0.8 },
          ],
        },
      ],
    },
    {
      title: { en: "The web server gets exactly what was sent", hi: "Web server ko wahi milta hai jo bheja gaya tha" },
      text: {
        en: "The web server receives `GET /` exactly as PC-A's browser wrote it. TCP on SRV1 read the header TCP on PC-A wrote, and IP read what PC-A's IP wrote: that is same-layer interaction. Passing data up and down inside one device is adjacent-layer interaction.",
        hi: "Web server ko `GET /` bilkul waisa hi milta hai jaisa PC-A ke browser ne likha tha. SRV1 ke TCP ne woh header padha jo PC-A ke TCP ne likha tha, aur IP ne woh jo PC-A ke IP ne likha: yeh same-layer interaction hai. Ek hi device ke andar data ko upar-neeche dena adjacent-layer interaction hai.",
      },
      stackActive: "Application",
      focus: ["data"],
      rows: [{ label: "Data", blocks: [{ id: "data", label: "HTTP GET /", sub: "delivered to port 80", tone: "gray", w: 1.3 }] }],
    },
  ],
};

export default scene;
