import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "osi-model",
  intro: {
    en: "Sending one web page across a network involves many separate jobs: turning bits into signals, getting a frame to the next device, finding a path across networks and handing the data to the right program. The OSI model splits those jobs into seven numbered layers. Engineers use the numbers every day, as in \"Layer 2 switch\" or \"that's a Layer 1 problem\", and they troubleshoot in layer order instead of guessing.",
    hi: "Network par ek web page bhejne mein kai alag kaam hote hain: bits ko signals mein badalna, frame ko agle device tak pahunchana, networks ke paar rasta dhoondhna aur data ko sahi program tak dena. OSI model in kaamon ko saat numbered layers mein baant deta hai. Engineers yeh numbers roz use karte hain, jaise \"Layer 2 switch\" ya \"yeh Layer 1 problem hai\", aur andaaza lagane ki jagah layer ke order mein troubleshoot karte hain.",
  },
  outcomes: [
    { en: "Name the seven OSI layers in order, from Layer 7 down to Layer 1", hi: "Saaton OSI layers ko order mein bata sako, Layer 7 se Layer 1 tak" },
    { en: "Describe what each layer is responsible for and give a protocol example for it", hi: "Har layer ki zimmedari bata sako aur uske liye ek protocol example de sako" },
    { en: "Match each layer to its PDU: data, segment, packet, frame, bits", hi: "Har layer ko uske PDU se match kar sako: data, segment, packet, frame, bits" },
    { en: "Place hubs, switches and routers at the layer where they make their decisions", hi: "Hub, switch aur router ko us layer par rakh sako jahan woh apne decisions lete hain" },
    { en: "Troubleshoot bottom-up: link, then IP and gateway, then DNS", hi: "Bottom-up troubleshoot kar sako: pehle link, phir IP aur gateway, phir DNS" },
  ],
  sections: [
    {
      id: "why-layers",
      heading: { en: "Why use a layered model", hi: "Layered model kyun" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Networking is too big to design as one piece. The **OSI (Open Systems Interconnection) reference model**, published by ISO in 1984, splits it into seven layers. Each layer does one job, uses the service of the layer below it, and offers a service to the layer above.",
            hi: "Networking itna bada kaam hai ki ise ek hi piece mein design nahi kar sakte. **OSI (Open Systems Interconnection) reference model**, jo ISO ne 1984 mein publish kiya, ise saat layers mein baant deta hai. Har layer ek kaam karti hai, neeche wali layer ki service use karti hai, aur upar wali layer ko service deti hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "The benefit is independence. Your browser works the same over Wi-Fi, Ethernet or mobile data, because it sits at the top and never deals with signals. A new cable standard does not need a new browser. Vendors can build one layer without rebuilding the others.",
            hi: "Iska fayda hai independence. Tumhara browser Wi-Fi, Ethernet ya mobile data par ek jaisa chalta hai, kyunki woh sabse upar hai aur signals se uska koi lena dena nahi. Naya cable standard aaye toh naya browser nahi chahiye. Vendors ek layer bana sakte hain bina baaki layers ko dobara banaye.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "Sending an office courier: you write the letter, the admin team puts it in an envelope with the full address, the courier company decides the route between cities, and the van driver just drives the road. Nobody does anyone else's job, and the driver never reads your letter.",
            hi: "Office se courier bhejna socho: tum letter likhte ho, admin team use envelope mein daal kar poora address likhti hai, courier company decide karti hai ki shehron ke beech kaunsa route lena hai, aur van driver bas sadak par gaadi chalata hai. Koi kisi aur ka kaam nahi karta, aur driver tumhara letter kabhi nahi padhta.",
          },
        },
      ],
    },
    {
      id: "the-seven-layers",
      heading: { en: "The seven layers at a glance", hi: "Saat layers ek nazar mein" },
      blocks: [
        {
          type: "table",
          caption: { en: "Numbered from the bottom: Layer 1 is Physical", hi: "Numbering neeche se hoti hai: Layer 1 Physical hai" },
          columns: ["#", "Layer", { en: "Job", hi: "Kaam" }, "PDU", "Examples"],
          rows: [
            ["7", "Application", { en: "Network services for applications", hi: "Applications ko network services dena" }, "Data", "HTTP, HTTPS, DNS, DHCP, SSH"],
            ["6", "Presentation", { en: "Data format, encryption, compression", hi: "Data ka format, encryption, compression" }, "Data", "UTF-8, JPEG, TLS"],
            ["5", "Session", { en: "Open, manage and close dialogues", hi: "Dialogue kholna, sambhalna aur band karna" }, "Data", { en: "Session control inside apps", hi: "Apps ke andar session control" }],
            ["4", "Transport", { en: "Deliver to the right application (ports), reliably if needed", hi: "Sahi application tak dena (ports), zaroorat ho toh reliably" }, "Segment / datagram", "TCP, UDP"],
            ["3", "Network", { en: "Logical addressing and routing between networks", hi: "Logical addressing aur networks ke beech routing" }, "Packet", "IPv4, IPv6, ICMP"],
            ["2", "Data Link", { en: "Deliver frames to the next device on the link (MAC)", hi: "Link par agle device tak frame pahunchana (MAC)" }, "Frame", "Ethernet, Wi-Fi (802.11)"],
            ["1", "Physical", { en: "Move bits as signals on the medium", hi: "Bits ko signals bana kar medium par bhejna" }, "Bits", "UTP, fiber, radio, 1000BASE-T"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Memory aids", hi: "Yaad rakhne ka tarika" },
          text: {
            en: "From Layer 7 down: \"All People Seem To Need Data Processing\" (Application, Presentation, Session, Transport, Network, Data Link, Physical). From Layer 1 up: \"Please Do Not Throw Sausage Pizza Away\". Pick one and stick with it.",
            hi: "Layer 7 se neeche: \"All People Seem To Need Data Processing\" (Application, Presentation, Session, Transport, Network, Data Link, Physical). Layer 1 se upar: \"Please Do Not Throw Sausage Pizza Away\". Koi ek chuno aur usi ko pakde raho.",
          },
        },
      ],
    },
    {
      id: "upper-layers",
      heading: { en: "Layers 7, 6 and 5: the application side", hi: "Layers 7, 6 aur 5: application wali side" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Follow one real request. PC-A (`192.168.10.25`) opens `https://www.example.com`, which DNS has already resolved to `203.0.113.10`. The top three layers prepare the data inside PC-A.",
            hi: "Ek real request follow karo. PC-A (`192.168.10.25`) `https://www.example.com` kholta hai, jise DNS pehle hi `203.0.113.10` mein resolve kar chuka hai. Upar ki teen layers PC-A ke andar hi data taiyaar karti hain.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Layer 7, Application**: the protocols that applications use to talk over the network. The browser uses HTTP to ask for `GET /`. Other Layer 7 protocols are DNS, DHCP, SMTP, SSH and FTP.",
              hi: "**Layer 7, Application**: woh protocols jinse applications network par baat karti hain. Browser HTTP use karke `GET /` maangta hai. Doosre Layer 7 protocols hain DNS, DHCP, SMTP, SSH aur FTP.",
            },
            {
              en: "**Layer 6, Presentation**: puts data in a format both ends understand, such as UTF-8 text or JPEG images, and handles encryption and compression. The TLS encryption in HTTPS is usually taught at this layer.",
              hi: "**Layer 6, Presentation**: data ko aise format mein rakhti hai jo dono ends samjhein, jaise UTF-8 text ya JPEG images, aur encryption aur compression sambhalti hai. HTTPS ka TLS encryption aam taur par isi layer par padhaya jaata hai.",
            },
            {
              en: "**Layer 5, Session**: opens, manages and closes the dialogue between the browser and the web server, and keeps separate conversations apart.",
              hi: "**Layer 5, Session**: browser aur web server ke beech dialogue kholti hai, sambhalti hai aur band karti hai, aur alag alag conversations ko alag rakhti hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The browser is not Layer 7", hi: "Browser Layer 7 nahi hai" },
          text: {
            en: "Layer 7 is the protocol (HTTP, DNS), not the program. Chrome and Outlook sit above the model and use Layer 7 protocols. In TCP/IP the jobs of Layers 5 and 6 are done inside the application, which is why the TCP/IP model folds 5, 6 and 7 into one Application layer.",
            hi: "Layer 7 protocol hai (HTTP, DNS), program nahi. Chrome aur Outlook model ke upar baithte hain aur Layer 7 protocols use karte hain. TCP/IP mein Layer 5 aur 6 ka kaam application ke andar hi ho jaata hai, isiliye TCP/IP model 5, 6 aur 7 ko ek hi Application layer mein mila deta hai.",
          },
        },
      ],
    },
    {
      id: "lower-layers",
      heading: { en: "Layers 4 to 1: getting the data there", hi: "Layers 4 se 1: data ko wahan pahunchana" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**Layer 4, Transport**: delivers data to the right application on the right host using **port numbers**. PC-A sends from port 50112 to port 443 (HTTPS). TCP adds reliability (acknowledgements and resending); UDP skips it for speed. PDU: **segment** (TCP) or **datagram** (UDP).",
              hi: "**Layer 4, Transport**: **port numbers** ki madad se data ko sahi host ki sahi application tak pahunchati hai. PC-A port 50112 se port 443 (HTTPS) par bhejta hai. TCP reliability deta hai (acknowledgements aur dobara bhejna); UDP speed ke liye ise chhod deta hai. PDU: **segment** (TCP) ya **datagram** (UDP).",
            },
            {
              en: "**Layer 3, Network**: logical addressing and routing. The IP header carries source `192.168.10.25` and destination `203.0.113.10`, and routers read the destination to pick a path between networks. PDU: **packet**. (On a real internet connection the edge router would also translate the private source address with NAT, covered in lesson 4.3. Here R1 simply routes.)",
              hi: "**Layer 3, Network**: logical addressing aur routing. IP header mein source `192.168.10.25` aur destination `203.0.113.10` hota hai, aur routers destination padh kar networks ke beech rasta chunte hain. PDU: **packet**. (Real internet connection par edge router private source address ko NAT se translate bhi karta, jo lesson 4.3 mein aayega. Yahan R1 sirf routing karta hai.)",
            },
            {
              en: "**Layer 2, Data Link**: delivers a frame to the next device on the same link using **MAC addresses**. PC-A's frame goes from `0050.56aa.0001` to `0011.2233.4401`, the MAC of its default gateway R1, and the FCS trailer lets the receiver detect errors. PDU: **frame**.",
              hi: "**Layer 2, Data Link**: **MAC addresses** use karke frame ko same link ke agle device tak pahunchati hai. PC-A ka frame `0050.56aa.0001` se `0011.2233.4401` par jaata hai, jo uske default gateway R1 ka MAC hai, aur FCS trailer se receiver errors pakad leta hai. PDU: **frame**.",
            },
            {
              en: "**Layer 1, Physical**: turns bits into signals and back: voltage on copper, light on fiber, radio waves for Wi-Fi. Cables, connectors, pinouts and speeds belong here. PDU: **bits**.",
              hi: "**Layer 1, Physical**: bits ko signals mein aur signals ko wapas bits mein badalti hai: copper par voltage, fiber par light, Wi-Fi ke liye radio waves. Cables, connectors, pinouts aur speeds isi layer ki cheezein hain. PDU: **bits**.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Which device works at which layer", hi: "Kaunsa device kis layer par kaam karta hai" },
          columns: ["Device", { en: "Highest layer it reads", hi: "Sabse upar kaunsi layer padhta hai" }, { en: "Decides using", hi: "Kis cheez se decide karta hai" }],
          rows: [
            ["Hub, repeater", "Layer 1", { en: "Nothing: it repeats bits out of every port", hi: "Kuch nahi: bits ko har port se repeat kar deta hai" }],
            ["Switch", "Layer 2", "Destination MAC address"],
            ["Router", "Layer 3", "Destination IP address"],
            [
              "Firewall",
              { en: "Layer 4 (next-generation: up to 7)", hi: "Layer 4 (next-generation: 7 tak)" },
              { en: "IP addresses and ports; a next-generation firewall also identifies applications", hi: "IP addresses aur ports; next-generation firewall applications bhi pehchaanta hai" },
            ],
            ["PC, server", "Layer 7", { en: "Runs the applications, so every layer is used", hi: "Applications chalata hai, isliye har layer use hoti hai" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Switch = Layer 2, decides on MAC addresses. Router = Layer 3, decides on IP addresses. A **Layer 3 switch** is a switch that can also route; you will configure one in lesson 2.3. Because a router builds a new frame for every link, the MAC addresses change at each hop, while the source and destination IP addresses stay the same end to end.",
            hi: "Switch = Layer 2, MAC address se decide karta hai. Router = Layer 3, IP address se decide karta hai. **Layer 3 switch** aisa switch hai jo routing bhi kar sakta hai; lesson 2.3 mein tum ise configure karoge. Router har link ke liye naya frame banata hai, isliye MAC addresses har hop par badal jaate hain, jabki source aur destination IP addresses shuru se end tak wahi rehte hain.",
          },
        },
      ],
    },
    {
      id: "headers-and-pdus",
      heading: { en: "Headers, PDUs and peer layers", hi: "Headers, PDUs aur peer layers" },
      blocks: [
        {
          type: "p",
          text: {
            en: "On the way down, Layers 4, 3 and 2 each add a header in front of what they received, and Layer 2 also adds a trailer, the FCS. On the way up at the receiver, each layer reads and removes the header that its **peer** layer added. So Layer 3 on PC-A effectively talks to Layer 3 on the server through the IP header, even though the bits pass through every layer below.",
            hi: "Neeche jaate waqt Layer 4, 3 aur 2 mein se har layer, upar se jo data mila, uske aage apna header jodti hai, aur Layer 2 end mein ek trailer (FCS) bhi jodti hai. Receiver par upar jaate waqt har layer woh header padh kar hatati hai jo uski **peer** layer ne joda tha. Yaani PC-A ki Layer 3 IP header ke through server ki Layer 3 se baat karti hai, bhale hi bits neeche ki har layer se guzarte hain.",
          },
        },
        {
          type: "table",
          caption: { en: "PDU names you must know", hi: "PDU ke naam jo aane hi chahiye" },
          columns: ["Layer", "PDU", { en: "What it contains", hi: "Isme kya hota hai" }],
          rows: [
            ["7-5", "Data", { en: "The application's data", hi: "Application ka data" }],
            ["4", "Segment (TCP) / datagram (UDP)", "Transport header + data"],
            ["3", "Packet", "IP header + segment"],
            ["2", "Frame", "Ethernet header + packet + FCS trailer"],
            ["1", "Bits", { en: "The frame as signals on the medium", hi: "Wahi frame, signals ban kar medium par" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Wrapping data in headers is called **encapsulation**, and unwrapping it is **decapsulation**. The next lesson follows each header through the TCP/IP model in detail.",
            hi: "Data ko headers mein wrap karna **encapsulation** kehlata hai, aur use kholna **decapsulation**. Agla lesson TCP/IP model mein har header ko detail mein follow karta hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Expect questions that give you a term and ask for the layer: MAC address and frame are Layer 2; IP address and packet are Layer 3; port number and segment are Layer 4.",
            hi: "Aise questions expect karo jo ek term dekar layer poochte hain: MAC address aur frame Layer 2 hain; IP address aur packet Layer 3; port number aur segment Layer 4.",
          },
        },
      ],
    },
    {
      id: "troubleshooting",
      heading: { en: "Troubleshooting with the layers", hi: "Layers ke saath troubleshooting" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A user says \"the internet is down\". Instead of guessing, check one layer at a time. **Bottom-up** troubleshooting starts at Layer 1 and stops at the first layer that fails; every layer below it is then proven good.",
            hi: "User bolta hai \"internet band hai\". Andaaza lagane ki jagah ek ek layer check karo. **Bottom-up** troubleshooting Layer 1 se shuru hoti hai aur jis pehli layer par fail mile wahin rukti hai; usse neeche ki har layer tab tak theek saabit ho chuki hoti hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Bottom-up checks for PC-A", hi: "PC-A ke liye bottom-up checks" },
          columns: ["Layer", "Check", { en: "How", hi: "Kaise" }, { en: "If it fails", hi: "Fail ho toh" }],
          rows: [
            [
              "1",
              { en: "Link light on the NIC and the switch port", hi: "NIC aur switch port par link light" },
              { en: "Look at the port; `ipconfig` shows \"Media disconnected\" when there is no link", hi: "Port dekho; link na ho toh `ipconfig` \"Media disconnected\" dikhata hai" },
              { en: "Cable, switch port or NIC", hi: "Cable, switch port ya NIC" },
            ],
            [
              "2",
              { en: "The switch has learned PC-A's MAC on the right port and VLAN", hi: "Switch ne PC-A ka MAC sahi port aur sahi VLAN mein seekha hai" },
              { en: "`show mac address-table` on the switch (lesson 1.1)", hi: "Switch par `show mac address-table` (lesson 1.1)" },
              { en: "Port shut down or in the wrong VLAN", hi: "Port shut down hai ya galat VLAN mein hai" },
            ],
            [
              "3",
              { en: "Correct IP, mask and gateway; the gateway replies", hi: "Sahi IP, mask aur gateway; gateway reply karta hai" },
              "`ipconfig`, `ping 192.168.10.1`",
              { en: "Wrong settings or a gateway problem", hi: "Galat settings ya gateway ki problem" },
            ],
            [
              "3",
              { en: "A remote network replies", hi: "Remote network reply karta hai" },
              "`ping 8.8.8.8`",
              { en: "Routing or internet link problem", hi: "Routing ya internet link ki problem" },
            ],
            [
              "7",
              { en: "Names resolve to addresses", hi: "Names addresses mein resolve hote hain" },
              "`ping www.example.com`, `nslookup`",
              { en: "DNS problem", hi: "DNS ki problem" },
            ],
          ],
        },
        {
          type: "cli",
          title: { en: "PC-A: the network works, the names don't", hi: "PC-A: network chal raha hai, names nahi" },
          lines: [
            { prompt: "C:\\>", cmd: "ipconfig" },
            { out: "   IPv4 Address. . . . . . . . . . . : 192.168.10.25" },
            { out: "   Subnet Mask . . . . . . . . . . . : 255.255.255.0" },
            { out: "   Default Gateway . . . . . . . . . : 192.168.10.1", comment: { en: "Layer 3 settings are present", hi: "Layer 3 settings maujood hain" } },
            { prompt: "C:\\>", cmd: "ping 192.168.10.1" },
            { out: "Reply from 192.168.10.1: bytes=32 time=1ms TTL=255", comment: { en: "Layers 1-3 work as far as the gateway", hi: "Gateway tak Layers 1-3 kaam kar rahi hain" } },
            { prompt: "C:\\>", cmd: "ping 8.8.8.8" },
            { out: "Reply from 8.8.8.8: bytes=32 time=14ms TTL=117", comment: { en: "Routing to the internet works", hi: "Internet tak routing kaam kar rahi hai" } },
            { prompt: "C:\\>", cmd: "ping www.example.com" },
            {
              out: "Ping request could not find host www.example.com. Please check the name and try again.",
              comment: { en: "The name does not resolve: a DNS (Layer 7) problem", hi: "Name resolve nahi ho raha: DNS (Layer 7) problem" },
            },
          ],
          note: {
            en: "Output shortened: ping normally prints four replies and a summary. Next, check which DNS server the PC uses with `ipconfig /all`, and test it directly with `nslookup www.example.com`.",
            hi: "Output chhota kiya gaya hai: ping normally chaar replies aur ek summary dikhata hai. Ab `ipconfig /all` se dekho ki PC kaunsa DNS server use kar raha hai, aur `nslookup www.example.com` se use seedha test karo.",
          },
        },
        {
          type: "p",
          text: {
            en: "There are other methods. **Top-down** starts at the application, and **divide and conquer** starts in the middle with a ping, then moves up or down depending on the result. Lesson 7.1 compares them on real tickets.",
            hi: "Aur methods bhi hain. **Top-down** application se shuru hota hai, aur **divide and conquer** beech se ek ping ke saath shuru hota hai, phir result ke hisaab se upar ya neeche jaata hai. Lesson 7.1 inhe real tickets par compare karta hai.",
          },
        },
      ],
    },
    {
      id: "osi-vs-tcpip",
      heading: { en: "OSI vs TCP/IP", hi: "OSI vs TCP/IP" },
      blocks: [
        {
          type: "p",
          text: {
            en: "OSI is a **reference model**. The OSI protocols designed alongside it never caught on; the internet runs on the **TCP/IP** protocol suite. What survived from OSI is the vocabulary: layer numbers and PDU names. That is why engineers say \"Layer 3\" when they mean IP, on networks that run no OSI protocols at all.",
            hi: "OSI ek **reference model** hai. Iske saath banaye gaye OSI protocols kabhi chale nahi; internet **TCP/IP** protocol suite par chalta hai. OSI se jo bacha woh hai vocabulary: layer numbers aur PDU names. Isiliye engineers IP ke liye \"Layer 3\" bolte hain, chahe network mein ek bhi OSI protocol na chal raha ho.",
          },
        },
        {
          type: "table",
          caption: { en: "How the two models line up", hi: "Dono models kaise match karte hain" },
          columns: ["OSI", "TCP/IP"],
          rows: [
            ["7 Application, 6 Presentation, 5 Session", "Application"],
            ["4 Transport", "Transport"],
            ["3 Network", "Internet"],
            ["2 Data Link, 1 Physical", { en: "Link (some books show Physical separately)", hi: "Link (kuch books Physical ko alag dikhati hain)" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "What the exam expects", hi: "Exam kya expect karta hai" },
          text: {
            en: "The CCNA 200-301 exam topics do not list the OSI model on its own, but questions assume you know the layer numbers, what each layer does and the PDU names. The next lesson maps TCP/IP in detail.",
            hi: "CCNA 200-301 ke exam topics mein OSI model alag se listed nahi hai, lekin questions maan kar chalte hain ki tumhe layer numbers, har layer ka kaam aur PDU names aate hain. Agla lesson TCP/IP ko detail mein map karta hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "OSI model", def: { en: "A seven-layer reference model from ISO that divides networking into separate jobs.", hi: "ISO ka saat layers wala reference model jo networking ko alag alag kaamon mein baant deta hai." } },
    { term: "PDU", def: { en: "Protocol Data Unit: the name for the data at a given layer, such as segment, packet or frame.", hi: "Protocol Data Unit: kisi layer par data ka naam, jaise segment, packet ya frame." } },
    { term: "Segment", def: { en: "The Layer 4 PDU: a TCP header plus data. With UDP it is called a datagram.", hi: "Layer 4 ka PDU: TCP header plus data. UDP mein ise datagram kehte hain." } },
    { term: "Packet", def: { en: "The Layer 3 PDU: an IP header plus the segment.", hi: "Layer 3 ka PDU: IP header plus segment." } },
    { term: "Frame", def: { en: "The Layer 2 PDU: an Ethernet header, the packet and an FCS trailer.", hi: "Layer 2 ka PDU: Ethernet header, packet aur FCS trailer." } },
    { term: "Encapsulation", def: { en: "Adding a layer's header (and trailer) around the data from the layer above.", hi: "Upar wali layer se aaye data ke aas paas apna header (aur trailer) jodna." } },
    { term: "Peer layer", def: { en: "The same layer on the other device. It reads the header this layer added.", hi: "Doosre device par wahi layer. Woh us header ko padhti hai jo is layer ne joda tha." } },
    { term: "Bottom-up troubleshooting", def: { en: "Checking Layer 1 first and moving up until a layer fails.", hi: "Pehle Layer 1 check karna aur tab tak upar jaana jab tak koi layer fail na ho." } },
  ],
  commands: [
    { cmd: "ipconfig", mode: "Windows command prompt", does: { en: "Show the PC's IPv4 address, mask and default gateway", hi: "PC ka IPv4 address, mask aur default gateway dikhata hai" } },
    { cmd: "ipconfig /all", mode: "Windows command prompt", does: { en: "Also show the MAC address and the DNS servers the PC uses", hi: "MAC address aur PC ke DNS servers bhi dikhata hai" } },
    { cmd: "ping", mode: "Windows command prompt", does: { en: "Test whether an IP address (or a name, after DNS) answers, e.g. `ping 192.168.10.1`", hi: "Test karta hai ki koi IP address (ya DNS ke baad name) reply karta hai ya nahi, jaise `ping 192.168.10.1`" } },
    { cmd: "nslookup www.example.com", mode: "Windows command prompt", does: { en: "Ask the DNS server to resolve a name, to test DNS directly", hi: "DNS server se name resolve karwata hai, taaki DNS seedha test ho" } },
    { cmd: "show mac address-table", mode: "Cisco privileged EXEC", does: { en: "See which MAC addresses the switch has learned on which ports", hi: "Dekho switch ne kaunse MAC addresses kis port par seekhe hain" } },
  ],
  mistakes: [
    {
      en: "Numbering from the top. Layer 1 is Physical at the bottom; Layer 7 is Application at the top.",
      hi: "Upar se numbering karna. Layer 1 Physical hai jo sabse neeche hai; Layer 7 Application hai jo sabse upar hai.",
    },
    {
      en: "Calling a Layer 2 frame a packet. Frame = Layer 2, packet = Layer 3, segment = Layer 4, and the exam uses these words precisely.",
      hi: "Layer 2 frame ko packet bolna. Frame = Layer 2, packet = Layer 3, segment = Layer 4, aur exam in words ko bilkul sahi matlab mein use karta hai.",
    },
    {
      en: "Saying the browser is Layer 7. Layer 7 is the protocol the browser uses, such as HTTP or DNS.",
      hi: "Browser ko Layer 7 bolna. Layer 7 woh protocol hai jo browser use karta hai, jaise HTTP ya DNS.",
    },
    {
      en: "Putting a switch at Layer 3 or a router at Layer 2. A standard switch forwards on MAC addresses (Layer 2); a router forwards on IP addresses (Layer 3).",
      hi: "Switch ko Layer 3 ya router ko Layer 2 par rakhna. Normal switch MAC address par forward karta hai (Layer 2); router IP address par (Layer 3).",
    },
    {
      en: "Calling it an internet outage when `ping 8.8.8.8` works but names fail. Layers 1-3 are fine; the problem is DNS.",
      hi: "`ping 8.8.8.8` chal raha ho aur names fail ho rahe hon, phir bhi use internet outage bolna. Layers 1-3 theek hain; problem DNS mein hai.",
    },
    {
      en: "Thinking the internet runs OSI protocols. It runs TCP/IP; OSI supplies the layer numbers and the vocabulary.",
      hi: "Yeh sochna ki internet OSI protocols par chalta hai. Woh TCP/IP par chalta hai; OSI sirf layer numbers aur vocabulary deta hai.",
    },
  ],
  recap: [
    { en: "Seven layers, 7 to 1: Application, Presentation, Session, Transport, Network, Data Link, Physical.", hi: "Saat layers, 7 se 1: Application, Presentation, Session, Transport, Network, Data Link, Physical." },
    { en: "Addresses by layer: port numbers at Layer 4, IP addresses at Layer 3, MAC addresses at Layer 2.", hi: "Har layer ka address: Layer 4 par port numbers, Layer 3 par IP addresses, Layer 2 par MAC addresses." },
    { en: "PDUs: data (7-5), segment or datagram (4), packet (3), frame (2), bits (1).", hi: "PDUs: data (7-5), segment ya datagram (4), packet (3), frame (2), bits (1)." },
    { en: "A hub works at Layer 1, a switch at Layer 2 and a router at Layer 3.", hi: "Hub Layer 1 par, switch Layer 2 par aur router Layer 3 par kaam karta hai." },
    { en: "Each layer adds a header on the way down, and its peer removes it on the way up.", hi: "Neeche jaate waqt har layer header jodti hai, aur upar jaate waqt uski peer layer use hatati hai." },
    { en: "Troubleshoot bottom-up: link, then IP and gateway, then a remote ping, then DNS.", hi: "Bottom-up troubleshoot karo: pehle link, phir IP aur gateway, phir remote ping, phir DNS." },
  ],
  quiz: [
    {
      q: {
        en: "Which OSI layer uses MAC addresses to deliver frames to the next device on the link?",
        hi: "Kaunsi OSI layer MAC addresses use karke link par agle device tak frames pahunchati hai?",
      },
      options: [
        { en: "Layer 1, Physical", hi: "Layer 1, Physical" },
        { en: "Layer 2, Data Link", hi: "Layer 2, Data Link" },
        { en: "Layer 3, Network", hi: "Layer 3, Network" },
        { en: "Layer 4, Transport", hi: "Layer 4, Transport" },
      ],
      answer: 1,
      explain: {
        en: "Layer 2 builds frames with source and destination MAC addresses and delivers them one link at a time. Layer 3 uses IP addresses end to end, and Layer 1 has no addresses at all.",
        hi: "Layer 2 source aur destination MAC addresses ke saath frames banati hai aur unhe ek ek link par deliver karti hai. Layer 3 end to end IP addresses use karti hai, aur Layer 1 mein koi address hota hi nahi.",
      },
      kind: "concept",
    },
    {
      q: { en: "What is the PDU at Layer 3 called?", hi: "Layer 3 ke PDU ko kya kehte hain?" },
      options: [
        { en: "Frame", hi: "Frame" },
        { en: "Segment", hi: "Segment" },
        { en: "Bits", hi: "Bits" },
        { en: "Packet", hi: "Packet" },
      ],
      answer: 3,
      explain: {
        en: "Layer 3 adds the IP header, and the result is a packet. A frame is Layer 2, a segment is Layer 4 and bits are Layer 1.",
        hi: "Layer 3 IP header jodti hai, aur jo banta hai woh packet hai. Frame Layer 2 hai, segment Layer 4 aur bits Layer 1.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A user can ping 192.168.10.1 and 8.8.8.8, but `ping www.example.com` says it \"could not find host\". Where is the problem?",
        hi: "User 192.168.10.1 aur 8.8.8.8 ko ping kar sakta hai, lekin `ping www.example.com` kehta hai \"could not find host\". Problem kahan hai?",
      },
      options: [
        { en: "Layer 7: name resolution (DNS)", hi: "Layer 7: name resolution (DNS)" },
        { en: "Layer 1: the cable", hi: "Layer 1: cable" },
        { en: "Layer 2: the switch port", hi: "Layer 2: switch port" },
        { en: "Layer 3: the default gateway", hi: "Layer 3: default gateway" },
      ],
      answer: 0,
      explain: {
        en: "Replies from the gateway and from 8.8.8.8 prove that Layers 1-3 work all the way to the internet. Only the name lookup fails, and DNS is a Layer 7 service.",
        hi: "Gateway aur 8.8.8.8 se reply aana saabit karta hai ki internet tak Layers 1-3 kaam kar rahi hain. Sirf name lookup fail ho raha hai, aur DNS Layer 7 service hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Which device makes its forwarding decision by reading the destination IP address?",
        hi: "Kaunsa device destination IP address padh kar forwarding decision leta hai?",
      },
      options: [
        { en: "A hub", hi: "Hub" },
        { en: "A Layer 2 switch", hi: "Layer 2 switch" },
        { en: "A router", hi: "Router" },
        { en: "A repeater", hi: "Repeater" },
      ],
      answer: 2,
      explain: {
        en: "A router works at Layer 3 and forwards on the destination IP address. A Layer 2 switch reads only MAC addresses, and hubs and repeaters read nothing; they just repeat bits.",
        hi: "Router Layer 3 par kaam karta hai aur destination IP address dekh kar forward karta hai. Layer 2 switch sirf MAC addresses padhta hai, aur hub aur repeater kuch nahi padhte; woh bas bits repeat karte hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "On a PC, `ipconfig` shows `Media State . . . . . . . . . . . : Media disconnected`. Which layer do you check first?",
        hi: "PC par `ipconfig` `Media State . . . . . . . . . . . : Media disconnected` dikhata hai. Sabse pehle kaunsi layer check karoge?",
      },
      options: [
        { en: "Layer 3: the IP address and mask", hi: "Layer 3: IP address aur mask" },
        { en: "Layer 1: the cable, switch port and NIC", hi: "Layer 1: cable, switch port aur NIC" },
        { en: "Layer 7: the DNS server", hi: "Layer 7: DNS server" },
        { en: "Layer 4: the port numbers", hi: "Layer 4: port numbers" },
      ],
      answer: 1,
      explain: {
        en: "\"Media disconnected\" means the NIC sees no link at all, so nothing above Layer 1 can work. Check the cable, the switch port and the NIC before anything else.",
        hi: "\"Media disconnected\" ka matlab NIC ko link hi nahi mil raha, toh Layer 1 ke upar kuch kaam nahi kar sakta. Kuch aur dekhne se pehle cable, switch port aur NIC check karo.",
      },
      kind: "cli",
    },
    {
      q: { en: "Which job belongs to the Transport layer?", hi: "Kaunsa kaam Transport layer ka hai?" },
      options: [
        { en: "Choosing the best path between networks", hi: "Networks ke beech best path chunna" },
        { en: "Turning bits into voltage, light or radio waves", hi: "Bits ko voltage, light ya radio waves mein badalna" },
        { en: "Adding source and destination MAC addresses", hi: "Source aur destination MAC addresses jodna" },
        { en: "Delivering data to the right application using port numbers", hi: "Port numbers se data ko sahi application tak pahunchana" },
      ],
      answer: 3,
      explain: {
        en: "Layer 4 uses port numbers, such as 443 for HTTPS, to hand data to the right application, and TCP adds reliability on top. Path selection is Layer 3, MAC addresses are Layer 2 and signals are Layer 1.",
        hi: "Layer 4 port numbers (jaise HTTPS ke liye 443) se data sahi application ko deti hai, aur TCP upar se reliability jodta hai. Path chunna Layer 3 ka kaam hai, MAC addresses Layer 2 ke hain aur signals Layer 1 ke.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "t-ai8JzhHuY",
      title: "Free CCNA | OSI Model & TCP/IP Suite | Day 3",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "The OSI and TCP/IP models side by side, with PDU names and encapsulation. Useful for this lesson and the next.",
        hi: "OSI aur TCP/IP models saath saath, PDU names aur encapsulation ke saath. Is lesson aur agle, dono mein kaam aayega.",
      },
    },
    {
      id: "CRdL1PcherM",
      title: "what is TCP/IP and OSI? // FREE CCNA // EP 3",
      channel: "NetworkChuck",
      lang: "en",
      note: {
        en: "A shorter, beginner-friendly tour of the layers.",
        hi: "Layers ka chhota, beginner-friendly tour.",
      },
    },
    {
      id: "ibrPgRcZnyA",
      title: "2. Free CCNA (NEW) | OSI Model in Hindi - Introduction to OSI Model",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "A Hindi introduction to the seven layers and why the model exists.",
        hi: "Saat layers aur model kyun bana, iska Hindi introduction.",
      },
    },
    {
      id: "Iq4-EmuF39A",
      title: "OSI Model Explained in Hindi | 7 Layers of OSI Model",
      channel: "PyNet Labs",
      lang: "hi",
      note: {
        en: "All seven layers explained in Hindi in about 11 minutes.",
        hi: "Saaton layers ka Hindi explanation, lagbhag 11 minute mein.",
      },
    },
  ],
  lab: {
    title: { en: "See the layers in Packet Tracer", hi: "Packet Tracer mein layers dekho" },
    steps: [
      {
        en: "Build PC-A (192.168.10.25/24, gateway 192.168.10.1), a 2960 switch, a 2911 router R1 (Gi0/0 192.168.10.1/24, Gi0/1 203.0.113.1/24) and a server (203.0.113.10/24, gateway 203.0.113.1). Use each device's Config tab, and on R1 set Port Status to On for both interfaces.",
        hi: "PC-A (192.168.10.25/24, gateway 192.168.10.1), ek 2960 switch, ek 2911 router R1 (Gi0/0 192.168.10.1/24, Gi0/1 203.0.113.1/24) aur ek server (203.0.113.10/24, gateway 203.0.113.1) banao. Har device ka Config tab use karo, aur R1 par dono interfaces ka Port Status On karo.",
      },
      {
        en: "Switch to Simulation mode and edit the event filters so only HTTP is shown. This hides the TCP handshake, so the envelope you follow carries the HTTP request itself.",
        hi: "Simulation mode mein jao aur event filters edit karo taaki sirf HTTP dikhe. Isse TCP handshake chhup jaata hai, aur jo envelope tum follow karoge usme seedha HTTP request hogi.",
      },
      {
        en: "On PC-A open Desktop > Web Browser and browse to 203.0.113.10. Packet Tracer's browser uses plain HTTP here, so there is no TLS step.",
        hi: "PC-A par Desktop > Web Browser kholo aur 203.0.113.10 par browse karo. Packet Tracer ka browser yahan plain HTTP use karta hai, isliye TLS wala step nahi hoga.",
      },
      {
        en: "Click the envelope while it is at the switch and open the OSI Model tab: only Layers 1 and 2 are used. Do the same at R1 (up to Layer 3) and at the server (up to Layer 7). At R1, compare the inbound and outbound Layer 2 addresses: they change, while the IP addresses do not.",
        hi: "Jab envelope switch par ho tab us par click karo aur OSI Model tab kholo: sirf Layer 1 aur 2 use hoti hain. Yahi R1 par karo (Layer 3 tak) aur server par (Layer 7 tak). R1 par in aur out wale Layer 2 addresses compare karo: woh badalte hain, IP addresses nahi badalte.",
      },
      {
        en: "Remove the default gateway on PC-A and browse again. From PC-A's Command Prompt run `ipconfig`, `ping 192.168.10.1` and `ping 203.0.113.10`, and decide which layer broke.",
        hi: "PC-A ka default gateway hata do aur dobara browse karo. PC-A ke Command Prompt se `ipconfig`, `ping 192.168.10.1` aur `ping 203.0.113.10` chalao, aur decide karo ki kaunsi layer toot gayi.",
      },
    ],
  },
};

export default lesson;
