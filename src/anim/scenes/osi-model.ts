import type { LayersScene } from "../types.ts";

const scene: LayersScene = {
  kind: "layers",
  id: "osi-model",
  title: { en: "One web request through the seven OSI layers", hi: "Ek web request saat OSI layers se hokar" },
  stack: ["7 Application", "6 Presentation", "5 Session", "4 Transport", "3 Network", "2 Data Link", "1 Physical"],
  steps: [
    {
      title: { en: "Layer 7: ask for the page", hi: "Layer 7: page maango" },
      text: {
        en: "PC-A (192.168.10.25) opens https://www.example.com, already resolved to 203.0.113.10. The browser uses HTTP, a Layer 7 protocol, to build the request GET /.",
        hi: "PC-A (192.168.10.25) https://www.example.com kholta hai, jo pehle hi 203.0.113.10 mein resolve ho chuka hai. Browser HTTP, yaani ek Layer 7 protocol, use karke request GET / banata hai.",
      },
      stackActive: "7 Application",
      focus: ["data"],
      rows: [{ label: "Data", blocks: [{ id: "data", label: "HTTP GET request", sub: "GET / Host: www.example.com", tone: "gray", w: 4 }] }],
    },
    {
      title: { en: "Layer 6: format and encrypt", hi: "Layer 6: format aur encrypt" },
      text: {
        en: "The request is text in an agreed format (UTF-8). Because this is HTTPS it is also encrypted with TLS, which is usually taught at Layer 6. Anyone capturing it from now on sees only scrambled bytes.",
        hi: "Request ek agreed format (UTF-8) mein text hai. Yeh HTTPS hai, isliye TLS se encrypt bhi hoti hai, jise aam taur par Layer 6 par padhaya jaata hai. Ab koi ise capture kare toh use sirf scrambled bytes dikhenge.",
      },
      stackActive: "6 Presentation",
      focus: ["data"],
      rows: [{ label: "Data", blocks: [{ id: "data", label: "Encrypted request", sub: "TLS: unreadable in transit", tone: "purple", w: 4 }] }],
    },
    {
      title: { en: "Layer 5: manage the dialogue", hi: "Layer 5: dialogue sambhalo" },
      text: {
        en: "The session layer opens, keeps and later closes the dialogue between PC-A's browser and the web server. In TCP/IP the application does this job itself, so no new header appears here.",
        hi: "Session layer PC-A ke browser aur web server ke beech dialogue kholti hai, chalu rakhti hai aur baad mein band karti hai. TCP/IP mein yeh kaam application khud karti hai, isliye yahan koi naya header nahi judta.",
      },
      stackActive: "5 Session",
      focus: ["data"],
      rows: [{ label: "Data", blocks: [{ id: "data", label: "Encrypted request", sub: "session: PC-A ↔ web server", tone: "purple", w: 4 }] }],
    },
    {
      title: { en: "Layer 4: add ports → segment", hi: "Layer 4: ports jodo → segment" },
      text: {
        en: "TCP adds a header with source port 50112, picked by PC-A, and destination port 443 for HTTPS. The port tells the server which application gets the data. Header plus data is now a segment.",
        hi: "TCP ek header jodta hai jisme source port 50112 (PC-A ne chuna) aur destination port 443 (HTTPS) hai. Port server ko batata hai ki data kis application ko dena hai. Header plus data ab segment hai.",
      },
      stackActive: "4 Transport",
      focus: ["tcp"],
      rows: [
        {
          label: "Segment",
          blocks: [
            { id: "tcp", label: "TCP header", sub: "port 50112 → 443", tone: "green", w: 1.6 },
            { id: "data", label: "Encrypted request", sub: "TLS: unreadable in transit", tone: "purple", w: 4 },
          ],
        },
      ],
    },
    {
      title: { en: "Layer 3: add IP addresses → packet", hi: "Layer 3: IP addresses jodo → packet" },
      text: {
        en: "IP adds source 192.168.10.25 and destination 203.0.113.10. The destination is on another network, so routers will read it to choose the path. Segment plus IP header is now a packet.",
        hi: "IP source 192.168.10.25 aur destination 203.0.113.10 jodta hai. Destination doosre network par hai, isliye routers ise padh kar rasta chunenge. Segment plus IP header ab packet hai.",
      },
      stackActive: "3 Network",
      focus: ["ip"],
      rows: [
        {
          label: "Packet",
          blocks: [
            { id: "ip", label: "IP header", sub: "192.168.10.25 → 203.0.113.10", tone: "blue", w: 2.2 },
            { id: "tcp", label: "TCP header", sub: "port 50112 → 443", tone: "green", w: 1.6 },
            { id: "data", label: "Encrypted request", sub: "TLS: unreadable in transit", tone: "purple", w: 4 },
          ],
        },
      ],
    },
    {
      title: { en: "Layer 2: add MACs and FCS → frame", hi: "Layer 2: MACs aur FCS jodo → frame" },
      text: {
        en: "Ethernet adds a header from PC-A's MAC 0050.56aa.0001 to 0011.2233.4401, the MAC of the default gateway R1, because R1 is the next device on this link. The FCS trailer lets the receiver detect damaged frames.",
        hi: "Ethernet header jodta hai: PC-A ke MAC 0050.56aa.0001 se 0011.2233.4401 tak, jo default gateway R1 ka MAC hai, kyunki is link par agla device R1 hai. FCS trailer se receiver kharab frames pakad leta hai.",
      },
      stackActive: "2 Data Link",
      focus: ["eth", "fcs"],
      rows: [
        {
          label: "Frame",
          blocks: [
            { id: "eth", label: "Ethernet header", sub: "to 0011.2233.4401 (R1)", tone: "orange", w: 2.2 },
            { id: "ip", label: "IP header", sub: "192.168.10.25 → 203.0.113.10", tone: "blue", w: 2.2 },
            { id: "tcp", label: "TCP header", sub: "port 50112 → 443", tone: "green", w: 1.6 },
            { id: "data", label: "Encrypted request", sub: "TLS: unreadable in transit", tone: "purple", w: 4 },
            { id: "fcs", label: "FCS", sub: "error check", tone: "orange", w: 0.9 },
          ],
        },
      ],
    },
    {
      title: { en: "Layer 1: send the bits", hi: "Layer 1: bits bhejo" },
      text: {
        en: "PC-A's NIC turns the frame into signals: voltage on copper, light on fiber or radio waves on Wi-Fi. Layer 1 reads no header at all; it only moves bits.",
        hi: "PC-A ka NIC frame ko signals mein badalta hai: copper par voltage, fiber par light ya Wi-Fi par radio waves. Layer 1 koi header nahi padhti; woh sirf bits le jaati hai.",
      },
      stackActive: "1 Physical",
      focus: ["bits"],
      rows: [
        {
          label: "Frame",
          blocks: [
            { id: "eth", label: "Ethernet header", sub: "to 0011.2233.4401 (R1)", tone: "orange", w: 2.2 },
            { id: "ip", label: "IP header", sub: "192.168.10.25 → 203.0.113.10", tone: "blue", w: 2.2 },
            { id: "tcp", label: "TCP header", sub: "port 50112 → 443", tone: "green", w: 1.6 },
            { id: "data", label: "Encrypted request", sub: "TLS: unreadable in transit", tone: "purple", w: 4 },
            { id: "fcs", label: "FCS", sub: "error check", tone: "orange", w: 0.9 },
          ],
        },
        { label: "Bits", blocks: [{ id: "bits", label: "0101 1100 0011 …", sub: "voltage, light or radio", tone: "gray", w: 10.9 }] },
      ],
    },
    {
      title: { en: "R1 reads up to Layer 3 only", hi: "R1 sirf Layer 3 tak padhta hai" },
      text: {
        en: "R1 removes the Ethernet header and reads the destination IP 203.0.113.10 to choose the next hop, then builds a new frame for the next link. It never opens the TCP header or the data. A switch goes one layer less deep: it reads only the Ethernet header.",
        hi: "R1 Ethernet header hatata hai aur next hop chunne ke liye destination IP 203.0.113.10 padhta hai, phir agle link ke liye naya frame banata hai. TCP header ya data ko woh kabhi nahi kholta. Switch ek layer kam jaata hai: woh sirf Ethernet header padhta hai.",
      },
      stackActive: "3 Network",
      focus: ["ip"],
      rows: [
        {
          label: "At R1",
          blocks: [
            { id: "eth", label: "Ethernet header", sub: "removed, new one built", tone: "orange", w: 2.2 },
            { id: "ip", label: "IP header", sub: "read: dst 203.0.113.10", tone: "blue", w: 2.2 },
            { id: "tcp", label: "TCP header", sub: "not opened", tone: "gray", w: 1.6 },
            { id: "data", label: "Encrypted request", sub: "not opened", tone: "gray", w: 4 },
            { id: "fcs", label: "FCS", sub: "checked, rebuilt", tone: "orange", w: 0.9 },
          ],
        },
      ],
    },
    {
      title: { en: "The server unwraps bottom-up", hi: "Server neeche se upar kholta hai" },
      text: {
        en: "At 203.0.113.10 each layer reads and removes the header its peer added: Layer 2 checks the FCS of the frame R1 built, Layer 3 sees its own IP, and Layer 4 hands the data to the web server on port 443. Layer 6 decrypts it, so Layer 7 receives exactly the GET / that PC-A sent.",
        hi: "203.0.113.10 par har layer woh header padh kar hatati hai jo uski peer layer ne joda tha: Layer 2 R1 ke banaye frame ka FCS check karti hai, Layer 3 apna IP dekhti hai, aur Layer 4 port 443 par data web server ko deti hai. Layer 6 use decrypt karti hai, isliye Layer 7 ko wahi GET / milta hai jo PC-A ne bheja tha.",
      },
      stackActive: "7 Application",
      focus: ["data"],
      rows: [
        {
          label: "At server",
          blocks: [
            { id: "eth", label: "Ethernet header", sub: "L2: from R1, removed", tone: "gray", w: 2.2 },
            { id: "ip", label: "IP header", sub: "L3: dst is me, removed", tone: "gray", w: 2.2 },
            { id: "tcp", label: "TCP header", sub: "L4: port 443, removed", tone: "gray", w: 1.6 },
            { id: "data", label: "HTTP GET request", sub: "L6 decrypted: GET /", tone: "green", w: 4 },
            { id: "fcs", label: "FCS", sub: "L2: checked", tone: "gray", w: 0.9 },
          ],
        },
      ],
    },
    {
      title: { en: "Troubleshooting: check bottom-up", hi: "Troubleshooting: neeche se upar check karo" },
      text: {
        en: "Later PC-A cannot open the site. The link light is on, the switch has learned PC-A's MAC, and both 192.168.10.1 and 8.8.8.8 answer pings, so Layers 1-3 work. Only the name www.example.com fails to resolve: a DNS problem at Layer 7.",
        hi: "Baad mein PC-A site nahi khol pata. Link light on hai, switch ne PC-A ka MAC seekh liya hai, aur 192.168.10.1 aur 8.8.8.8 dono ping ka reply dete hain, yaani Layers 1-3 theek hain. Sirf name www.example.com resolve nahi hota: yeh Layer 7 par DNS ki problem hai.",
      },
      stackActive: "7 Application",
      focus: ["l7"],
      rows: [
        {
          label: "Checks",
          blocks: [
            { id: "l1", label: "L1 link light", sub: "on", tone: "green" },
            { id: "l2", label: "L2 MAC learned", sub: "on the switch port", tone: "green" },
            { id: "l3a", label: "L3 ping gateway", sub: "192.168.10.1 replies", tone: "green" },
            { id: "l3b", label: "L3 ping 8.8.8.8", sub: "replies", tone: "green" },
            { id: "l7", label: "L7 DNS lookup", sub: "www.example.com fails", tone: "red" },
          ],
        },
      ],
    },
  ],
};

export default scene;
