import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "tcp-udp",
  intro: {
    en: "IP gets a packet to the right host, but a host runs many programs at once: a browser, a video call, a software update. The transport layer uses port numbers to hand each piece of data to the right program, and it decides how carefully to deliver it. TCP makes sure every byte arrives, in order; UDP sends and moves on. Knowing which one an application uses, and on which port, is what lets you read firewall rules, write ACLs and troubleshoot.",
    hi: "IP packet ko sahi host tak pahuncha deta hai, lekin ek host par ek saath kai programs chalte hain: browser, video call, software update. Transport layer port numbers ki madad se data ko sahi program tak pahunchati hai, aur decide karti hai ki delivery kitni carefully karni hai. TCP ensure karta hai ki har byte pahunche, aur sahi order mein; UDP bas bhej kar aage badh jaata hai. Kaunsi application kaunsa protocol aur kaunsa port use karti hai, yeh pata ho tabhi tum firewall rules padh paoge, ACLs likh paoge aur troubleshoot kar paoge.",
  },
  outcomes: [
    { en: "Explain how port numbers and sockets let one host hold many conversations at once", hi: "Samjha sako ki port numbers aur sockets se ek host ek saath kai conversations kaise chalata hai" },
    { en: "Compare TCP and UDP: connection setup, reliability, ordering, flow control and header size", hi: "TCP aur UDP compare kar sako: connection setup, reliability, ordering, flow control aur header size" },
    { en: "Walk through the three-way handshake and the four-way close with real sequence and acknowledgment numbers", hi: "Three-way handshake aur four-way close ko asli sequence aur acknowledgment numbers ke saath step by step bata sako" },
    { en: "Calculate the acknowledgment number a receiver sends, and explain windowing and retransmission", hi: "Receiver ka acknowledgment number calculate kar sako, aur windowing aur retransmission samjha sako" },
    { en: "Recall the common port numbers and whether each runs over TCP, UDP or both", hi: "Common port numbers yaad rakh sako, aur yeh bhi ki har ek TCP, UDP ya dono par chalta hai" },
  ],
  sections: [
    {
      id: "ports-and-sockets",
      heading: { en: "Ports: getting data to the right program", hi: "Ports: data ko sahi program tak pahunchana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In the encapsulation lesson you saw the transport layer add a header with a **source port** and a **destination port**. A port is a 16-bit number (0-65535) that identifies a program, or one of its conversations, on a host. The IP address gets the packet to 10.1.1.10; the port gets the data to the right program on it.",
            hi: "Encapsulation lesson mein tumne dekha tha ki transport layer ek header jodti hai jisme **source port** aur **destination port** hote hain. Port ek 16-bit number hai (0-65535) jo host par kisi program, ya uski kisi conversation, ko pehchanta hai. IP address packet ko 10.1.1.10 tak laata hai; port data ko us host par sahi program tak.",
          },
        },
        {
          type: "p",
          text: {
            en: "A server listens on a fixed, well-known port so clients know where to find it: a web server on 80 (HTTP) or 443 (HTTPS). The client picks a random high source port for each new connection. The reply swaps the two: it comes from port 80 and goes to the client's random port, which is how the operating system knows which conversation it belongs to.",
            hi: "Server ek fixed, well-known port par listen karta hai taaki clients ko pata ho kahan jaana hai: web server 80 (HTTP) ya 443 (HTTPS) par. Client har nayi connection ke liye ek random high source port chunta hai. Reply mein dono ulat jaate hain: reply port 80 se aata hai aur client ke random port par jaata hai, isi se operating system ko pata chalta hai ki reply kis conversation ka hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "An **IP address plus a port** is called a **socket**, for example `10.1.1.10:51514`. A TCP connection is identified by both sockets plus the protocol, so thousands of connections can share port 80 on one server without mixing, because every client socket is different. Running many conversations over one address this way is called **session multiplexing**.",
            hi: "**IP address plus port** ko **socket** kehte hain, jaise `10.1.1.10:51514`. Ek TCP connection dono sockets aur protocol se pehchana jaata hai, isliye ek server ke port 80 par hazaaron connections bina mix hue chal sakte hain, kyunki har client socket alag hota hai. Ek address par is tarah kai conversations chalane ko **session multiplexing** kehte hain.",
          },
        },
        {
          type: "cli",
          title: { en: "See your own sockets on Windows", hi: "Windows par apne sockets khud dekho" },
          lines: [
            { prompt: "C:\\>", cmd: "netstat -an" },
            { out: "  Proto  Local Address          Foreign Address        State" },
            { out: "  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING", comment: { en: "A local service waiting for connections on port 135", hi: "Port 135 par connections ka wait karti local service" } },
            { out: "  TCP    10.1.1.10:51514        203.0.113.5:80         ESTABLISHED", comment: { en: "Client socket on the left, server socket on the right", hi: "Left mein client socket, right mein server socket" } },
            { out: "  TCP    10.1.1.10:51515        203.0.113.5:80         ESTABLISHED", comment: { en: "A second connection to the same server; only the source port differs", hi: "Usi server se doosra connection; sirf source port alag hai" } },
            { out: "  UDP    0.0.0.0:5353           *:*", comment: { en: "UDP has no State: there is no connection to track", hi: "UDP ka State nahi hota: track karne ke liye koi connection hi nahi" } },
          ],
          note: {
            en: "On Linux, `ss -tuna` shows the same thing: TCP and UDP sockets, in every state, with numeric ports.",
            hi: "Linux par `ss -tuna` yahi dikhata hai: TCP aur UDP sockets, har state mein, numeric ports ke saath.",
          },
        },
        {
          type: "table",
          caption: { en: "Port number ranges defined by IANA", hi: "IANA ki port number ranges" },
          columns: ["Range", { en: "Name", hi: "Naam" }, { en: "Used for", hi: "Kiske liye" }],
          rows: [
            ["0-1023", { en: "Well-known (system) ports", hi: "Well-known (system) ports" }, { en: "Standard server services: 22 SSH, 80 HTTP, 443 HTTPS", hi: "Standard server services, jaise 22 SSH, 80 HTTP, 443 HTTPS" }],
            ["1024-49151", { en: "Registered ports", hi: "Registered ports" }, { en: "Assigned to specific applications, e.g. 3389 for RDP", hi: "Specific applications ko assigned, jaise RDP ke liye 3389" }],
            ["49152-65535", { en: "Dynamic (private, ephemeral) ports", hi: "Dynamic (private, ephemeral) ports" }, { en: "Temporary source ports picked by clients", hi: "Clients ke chune hue temporary source ports" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Real operating systems vary", hi: "Asli operating systems mein farak hota hai" },
          text: {
            en: "Windows picks client ports from 49152-65535 by default, but Linux usually uses 32768-60999. For the exam, learn the IANA ranges above.",
            hi: "Windows by default client ports 49152-65535 se chunta hai, lekin Linux aam taur par 32768-60999 use karta hai. Exam ke liye upar wali IANA ranges yaad karo.",
          },
        },
      ],
    },
    {
      id: "tcp-features",
      heading: { en: "What TCP promises, and how it keeps the promise", hi: "TCP kya promise karta hai, aur use kaise nibhata hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "TCP (Transmission Control Protocol) is **connection-oriented** and **reliable**. Before any data moves, the two hosts agree to talk. After that, TCP makes sure every byte arrives, arrives once, and reaches the application in the right order, even when IP drops or reorders packets on the way.",
            hi: "TCP (Transmission Control Protocol) **connection-oriented** aur **reliable** hai. Data jaane se pehle dono hosts baat karne ke liye agree karte hain. Uske baad TCP ensure karta hai ki har byte pahunche, sirf ek baar pahunche, aur application ko sahi order mein mile, chahe IP raaste mein packets drop kare ya unka order badal de.",
          },
        },
        {
          type: "table",
          caption: { en: "TCP features and the header fields behind them", hi: "TCP features aur unke peeche ke header fields" },
          columns: [{ en: "Feature", hi: "Feature" }, { en: "What it means", hi: "Matlab kya hai" }, { en: "Header field", hi: "Header field" }],
          rows: [
            ["Connection-oriented", { en: "A three-way handshake before data, a controlled close after", hi: "Data se pehle three-way handshake, baad mein controlled close" }, "Flags: SYN, ACK, FIN, RST"],
            ["Sequencing", { en: "Every byte is numbered, so the receiver can reorder segments and drop duplicates", hi: "Har byte ka number hota hai, isliye receiver segments ko sahi order mein laga sakta hai aur duplicates hata sakta hai" }, "Sequence number"],
            ["Acknowledgment and retransmission", { en: "The receiver confirms what arrived; anything unconfirmed is sent again", hi: "Receiver confirm karta hai kya pahuncha; jo confirm nahi hua woh dobara bheja jaata hai" }, "Acknowledgment number"],
            ["Flow control (windowing)", { en: "The receiver limits how much the sender may send before waiting", hi: "Receiver limit lagata hai ki sender ruk kar wait karne se pehle kitna bhej sakta hai" }, "Window size"],
            ["Error detection", { en: "A damaged segment fails the checksum, is discarded, and is later resent", hi: "Kharab segment checksum mein fail hota hai, discard hota hai, aur baad mein dobara bheja jaata hai" }, "Checksum"],
          ],
        },
        {
          type: "p",
          text: {
            en: "All of this costs space. The TCP header is **20 bytes** minimum, and up to 60 bytes with options. Besides the two ports, its fields include a 32-bit sequence number, a 32-bit acknowledgment number, the flags, the window size and a checksum.",
            hi: "Yeh sab space leta hai. TCP header kam se kam **20 bytes** ka hota hai, aur options ke saath 60 bytes tak. Dono ports ke alawa iske fields mein 32-bit sequence number, 32-bit acknowledgment number, flags, window size aur checksum bhi hote hain.",
          },
        },
      ],
    },
    {
      id: "handshake-and-close",
      heading: { en: "Opening and closing a connection", hi: "Connection kholna aur band karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "This is the connection from the animation: the laptop 10.1.1.10 connects to the web server 203.0.113.5 on port 80. The starting numbers are kept small so you can follow the maths.",
            hi: "Yeh animation wala connection hai: laptop 10.1.1.10, web server 203.0.113.5 ke port 80 se connect karta hai. Starting numbers chhote rakhe hain taaki tum calculation follow kar sako.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**SYN**: the laptop sends a segment from port 51514 to port 80 with the SYN flag set and its initial sequence number, seq=1000.",
              hi: "**SYN**: laptop port 51514 se port 80 par SYN flag wala segment bhejta hai, apne initial sequence number seq=1000 ke saath.",
            },
            {
              en: "**SYN-ACK**: the server replies with both flags set, its own initial sequence number seq=5000, and ack=1001. A SYN counts as one byte, so the next byte the server expects is 1001.",
              hi: "**SYN-ACK**: server dono flags set karke reply karta hai, apne initial sequence number seq=5000 aur ack=1001 ke saath. SYN ek byte gina jaata hai, isliye server ko agla byte 1001 chahiye.",
            },
            {
              en: "**ACK**: the laptop sends seq=1001, ack=5001. Both sides are now ESTABLISHED and data can flow in both directions.",
              hi: "**ACK**: laptop seq=1001, ack=5001 bhejta hai. Ab dono side ESTABLISHED hain aur data dono directions mein ja sakta hai.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "Closing works one direction at a time. The side that has finished sends **FIN**. The other side acknowledges it, sends any data it still has, then sends its own FIN, which is acknowledged in turn. Four segments: the **four-way close**. The middle ACK and FIN sometimes travel together in one segment. **RST** is different: it aborts the connection at once, with no polite exchange.",
            hi: "Close ek-ek direction karke hota hai. Jis side ka kaam ho gaya woh **FIN** bhejti hai. Doosri side use acknowledge karti hai, jo data bacha hai woh bhejti hai, phir apna FIN bhejti hai, jise bhi acknowledge kiya jaata hai. Chaar segments: yahi **four-way close** hai. Beech wala ACK aur FIN kabhi kabhi ek hi segment mein saath chale jaate hain. **RST** alag hai: yeh connection ko turant tod deta hai, bina kisi formal exchange ke.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Know the flag order", hi: "Flags ka order yaad rakho" },
          text: {
            en: "Open: SYN, SYN-ACK, ACK. Close: FIN, ACK, FIN, ACK. A host with nothing listening on the port answers a SYN with **RST**, which is how a port scanner tells a closed port from an open one.",
            hi: "Open: SYN, SYN-ACK, ACK. Close: FIN, ACK, FIN, ACK. Agar us port par koi listen nahi kar raha, toh host SYN ka jawab **RST** se deta hai; isi se port scanner closed aur open port ka farak pehchaanta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Reading a capture", hi: "Capture padhte waqt" },
          text: {
            en: "Real initial sequence numbers are random 32-bit values. Wireshark shows **relative** numbers by default, so the SYN appears as seq=0 and the first data byte as seq=1.",
            hi: "Asli initial sequence numbers random 32-bit values hote hain. Wireshark by default **relative** numbers dikhata hai, isliye SYN seq=0 dikhta hai aur pehla data byte seq=1.",
          },
        },
      ],
    },
    {
      id: "sequencing-and-windowing",
      heading: { en: "Sequence numbers, ACKs and windowing", hi: "Sequence numbers, ACKs aur windowing" },
      blocks: [
        {
          type: "p",
          text: {
            en: "TCP numbers **bytes**, not segments. If a segment starts at seq=1001 and carries 1000 bytes, it holds bytes 1001 to 2000, and the next segment starts at 2001. The acknowledgment number is the **next byte the receiver expects**, so ack=3001 means \"I have everything up to 3000\". This is called forward acknowledgment.",
            hi: "TCP **bytes** ko number karta hai, segments ko nahi. Agar segment seq=1001 se shuru hota hai aur 1000 bytes le jaata hai, toh usme bytes 1001 se 2000 hain, aur agla segment 2001 se shuru hoga. Acknowledgment number woh **agla byte hai jo receiver ko chahiye**, toh ack=3001 ka matlab \"3000 tak sab mil gaya\". Ise forward acknowledgment kehte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "When TCP sends a segment it starts a retransmission timer. If no ACK covering that segment arrives before the timer expires, TCP sends the same bytes again with the same sequence number. The receiver uses the sequence numbers to put segments back in order and to throw away duplicates.",
            hi: "Segment bhejte hi TCP ek retransmission timer start karta hai. Timer expire hone tak us segment ko cover karne wala ACK nahi aaya, toh TCP wahi bytes wahi sequence number ke saath dobara bhejta hai. Receiver sequence numbers se segments ko sahi order mein lagata hai aur duplicates phenk deta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Waiting for an ACK after every segment would be slow. Instead, the receiver advertises a **window size** in every segment it sends: how many bytes the sender may have in flight, unacknowledged, before it must stop and wait. With a 2000-byte window and 1000-byte segments, the laptop sends two segments back to back, and one ACK of 3001 confirms both. As ACKs arrive, the window **slides** forward.",
            hi: "Har segment ke baad ACK ka wait karna slow hoga. Isliye receiver apne har segment mein ek **window size** advertise karta hai: sender bina acknowledgment ke kitne bytes bhej sakta hai, uske baad use rukna padega. 2000-byte window aur 1000-byte segments ke saath laptop do segments ek ke baad ek bhejta hai, aur ek hi ACK 3001 dono ko confirm kar deta hai. Jaise jaise ACKs aate hain, window aage **slide** hota hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The 3000 bytes from the animation", hi: "Animation wale 3000 bytes" },
          columns: ["Segment", "seq", { en: "Bytes it carries", hi: "Kaunse bytes" }, { en: "ACK that confirms it", hi: "Kaunsa ACK confirm karta hai" }],
          rows: [
            ["Data 1", "1001", "1001-2000", "3001"],
            ["Data 2", "2001", "2001-3000", "3001"],
            [{ en: "Data 3 (lost, then resent)", hi: "Data 3 (khoya, phir dobara bheja)" }, "3001", "3001-4000", "4001"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "The receiver sets the pace", hi: "Speed receiver decide karta hai" },
          text: {
            en: "Flow control puts the receiver in charge. If its application reads slowly and the buffer fills, it advertises a smaller window, even 0, and the sender pauses. TCP also has congestion control, which slows a sender down when the network itself drops segments; that goes beyond the CCNA.",
            hi: "Flow control mein control receiver ke haath mein hota hai. Agar uski application dheere padh rahi hai aur buffer bhar raha hai, toh woh chhota window advertise karta hai, 0 tak bhi, aur sender ruk jaata hai. TCP mein congestion control bhi hota hai, jo network ke segments drop karne par sender ko dheema karta hai; woh CCNA se aage ka topic hai.",
          },
        },
      ],
    },
    {
      id: "udp",
      heading: { en: "UDP: send it and move on", hi: "UDP: bhejo aur aage badho" },
      blocks: [
        {
          type: "p",
          text: {
            en: "UDP (User Datagram Protocol) is **connectionless**. There is no handshake, no sequence numbers, no acknowledgments, no retransmission and no flow control. Its header is only **8 bytes**: source port, destination port, length and checksum. The checksum lets the receiver discard a damaged datagram, but nobody asks for it again.",
            hi: "UDP (User Datagram Protocol) **connectionless** hai. Na handshake, na sequence numbers, na acknowledgments, na retransmission, na flow control. Iska header sirf **8 bytes** ka hai: source port, destination port, length aur checksum. Checksum se receiver kharab datagram discard kar deta hai, lekin use dobara koi nahi maangta.",
          },
        },
        {
          type: "p",
          text: {
            en: "That sounds worse than TCP, but it is exactly what some applications want. If reliability matters, the application adds it itself: in the animation the DNS client simply asked again, and in TFTP every block must be acknowledged before the next one is sent. If reliability does not matter, nothing is wasted on it.",
            hi: "Sunne mein yeh TCP se kamzor lagta hai, lekin kuch applications ko yahi chahiye. Agar reliability zaroori hai, toh application khud handle karti hai: animation mein DNS client ne bas dobara pooch liya, aur TFTP mein har block ka ACK aane ke baad hi agla block jaata hai. Agar reliability zaroori nahi, toh us par kuch waste nahi hota.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Real-time voice and video**: a sound sample that arrives late is useless. A tiny gap is better than a pause while TCP resends.",
              hi: "**Real-time voice aur video**: der se pahuncha sound sample kisi kaam ka nahi. TCP ke resend ke liye rukne se chhota sa gap behtar hai.",
            },
            {
              en: "**Short question and answer**: DNS, DHCP, NTP and SNMP exchange one or two small messages. A handshake would take longer than the job itself.",
              hi: "**Chhota sawaal-jawab**: DNS, DHCP, NTP aur SNMP ek-do chhote messages hi exchange karte hain. Handshake mein kaam se zyada time lag jaayega.",
            },
            {
              en: "**Broadcast and multicast**: TCP only works between two hosts. A DHCP client has no IP address yet and must broadcast, so DHCP has to use UDP.",
              hi: "**Broadcast aur multicast**: TCP sirf do hosts ke beech kaam karta hai. DHCP client ke paas abhi IP address hi nahi hota aur use broadcast karna padta hai, isliye DHCP ko UDP hi use karna padta hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "TCP and UDP side by side", hi: "TCP aur UDP aamne saamne" },
          columns: [{ en: "Feature", hi: "Feature" }, "TCP", "UDP"],
          rows: [
            ["Connection", { en: "Connection-oriented: three-way handshake", hi: "Connection-oriented: three-way handshake" }, { en: "Connectionless: no setup", hi: "Connectionless: koi setup nahi" }],
            [{ en: "Reliable delivery", hi: "Reliable delivery" }, { en: "Yes: ACKs and retransmission", hi: "Haan: ACKs aur retransmission" }, { en: "No: lost data stays lost", hi: "Nahi: khoya data khoya hi rehta hai" }],
            ["Ordering", { en: "Sequence numbers restore order", hi: "Sequence numbers se order wapas aata hai" }, { en: "None", hi: "Nahi" }],
            ["Flow control", "Window size", { en: "None", hi: "Nahi" }],
            ["Error detection", "Checksum", { en: "Checksum (optional in IPv4)", hi: "Checksum (IPv4 mein optional)" }],
            ["Header size", { en: "20 bytes (up to 60)", hi: "20 bytes (60 tak)" }, "8 bytes"],
            [{ en: "Unit of data", hi: "Data ki unit" }, "Segment", "Datagram"],
            [{ en: "Typical uses", hi: "Typical uses" }, "HTTP, HTTPS, SSH, FTP, SMTP", "DNS, DHCP, TFTP, NTP, SNMP, Syslog, voice"],
          ],
        },
      ],
    },
    {
      id: "common-ports",
      heading: { en: "Port numbers you must know", hi: "Yeh port numbers yaad hone chahiye" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The exam expects you to know these ports and their transport by heart. Most of these protocols get their own lesson later; for now, learn the numbers.",
            hi: "Exam expect karta hai ki yeh ports aur unka transport tumhe zubaani yaad ho. Inme se zyada tar protocols ka apna lesson aage aayega; abhi sirf numbers yaad karo.",
          },
        },
        {
          type: "table",
          caption: { en: "Common ports for the CCNA", hi: "CCNA ke liye common ports" },
          columns: ["Port", "Protocol", "Transport", { en: "What it does", hi: "Kya karta hai" }],
          rows: [
            ["20, 21", "FTP", "TCP", { en: "File transfer: 21 for control, 20 for data (active mode)", hi: "File transfer: 21 control ke liye, 20 data ke liye (active mode)" }],
            ["22", "SSH", "TCP", { en: "Encrypted remote login (also SCP and SFTP)", hi: "Encrypted remote login (SCP aur SFTP bhi)" }],
            ["23", "Telnet", "TCP", { en: "Unencrypted remote login", hi: "Bina encryption ka remote login" }],
            ["25", "SMTP", "TCP", { en: "Sending email between mail servers", hi: "Mail servers ke beech email bhejna" }],
            ["53", "DNS", "UDP, TCP", { en: "Name lookups over UDP; TCP for zone transfers and large answers", hi: "Name lookups UDP par; zone transfers aur bade answers TCP par" }],
            ["67, 68", "DHCP", "UDP", { en: "Address assignment: server 67, client 68", hi: "Address dena: server 67, client 68" }],
            ["69", "TFTP", "UDP", { en: "Simple file transfer, such as IOS images and configs", hi: "Simple file transfer, jaise IOS images aur configs" }],
            ["80", "HTTP", "TCP", { en: "Web pages, unencrypted", hi: "Web pages, bina encryption" }],
            ["110", "POP3", "TCP", { en: "Downloading email from a mailbox", hi: "Mailbox se email download karna" }],
            ["123", "NTP", "UDP", { en: "Clock synchronisation", hi: "Clocks ko sync karna" }],
            ["161, 162", "SNMP", "UDP", { en: "Monitoring: agents listen on 161, traps go to 162", hi: "Monitoring: agents 161 par sunte hain, traps 162 par jaate hain" }],
            ["443", "HTTPS", "TCP", { en: "Web pages over TLS", hi: "TLS ke saath web pages" }],
            ["514", "Syslog", "UDP", { en: "Sending log messages to a server", hi: "Log messages server ko bhejna" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "A quick way to remember", hi: "Yaad rakhne ka aasaan tareeka" },
          text: {
            en: "The UDP group is DHCP, TFTP, NTP, SNMP, Syslog, and DNS queries. Everything else in the table (FTP, SSH, Telnet, SMTP, HTTP, POP3, HTTPS) uses TCP. DNS is the classic trap because it uses both.",
            hi: "UDP group hai DHCP, TFTP, NTP, SNMP, Syslog, aur DNS queries. Table ki baaki har cheez (FTP, SSH, Telnet, SMTP, HTTP, POP3, HTTPS) TCP use karti hai. DNS classic trap hai kyunki woh dono use karta hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "HTTP/3 is the exception", hi: "HTTP/3 exception hai" },
          text: {
            en: "Newer web traffic can use **HTTP/3**, which runs over QUIC on **UDP 443** and builds its own reliability on top. For the CCNA, HTTPS is TCP 443.",
            hi: "Naya web traffic **HTTP/3** bhi use kar sakta hai, jo **UDP 443** par QUIC ke upar chalta hai aur reliability khud banata hai. CCNA ke liye HTTPS matlab TCP 443.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Port number", def: { en: "A 16-bit number (0-65535) in the TCP or UDP header that identifies a program or conversation on a host.", hi: "TCP ya UDP header ka 16-bit number (0-65535) jo host par kisi program ya conversation ko pehchanta hai." } },
    { term: "Socket", def: { en: "An IP address plus a port, such as 10.1.1.10:51514. Two sockets and the protocol identify one connection.", hi: "IP address plus port, jaise 10.1.1.10:51514. Do sockets aur protocol milkar ek connection ko pehchante hain." } },
    { term: "Ephemeral port", def: { en: "A temporary source port a client picks for one connection; the IANA dynamic range is 49152-65535.", hi: "Temporary source port jo client ek connection ke liye chunta hai; IANA ki dynamic range 49152-65535 hai." } },
    { term: "Three-way handshake", def: { en: "SYN, SYN-ACK, ACK: how TCP opens a connection and agrees on starting sequence numbers.", hi: "SYN, SYN-ACK, ACK: isi se TCP connection kholta hai aur starting sequence numbers par agree karta hai." } },
    { term: "Sequence number", def: { en: "The number of the first byte in a TCP segment; it lets the receiver reorder data and drop duplicates.", hi: "TCP segment ke pehle byte ka number; isse receiver data ko order mein laga sakta hai aur duplicates hata sakta hai." } },
    { term: "Acknowledgment number", def: { en: "The next byte the receiver expects; everything before it has arrived.", hi: "Woh agla byte jo receiver ko chahiye; usse pehle ka sab pahunch chuka hai." } },
    { term: "Window size", def: { en: "How many bytes the receiver will accept before the sender must wait for an ACK.", hi: "Receiver kitne bytes accept karega, uske baad sender ko ACK ka wait karna padega." } },
    { term: "Datagram", def: { en: "The unit of data at the UDP layer; the TCP equivalent is a segment.", hi: "UDP layer par data ki unit; TCP mein ise segment kehte hain." } },
  ],
  commands: [
    { cmd: "netstat -an", mode: "Windows / macOS terminal", does: { en: "List TCP and UDP sockets with numeric addresses, ports and TCP state", hi: "TCP aur UDP sockets numeric addresses, ports aur TCP state ke saath dikhata hai" } },
    { cmd: "ss -tuna", mode: "Linux terminal", does: { en: "List TCP and UDP sockets in all states, numeric", hi: "Saari states ke TCP aur UDP sockets numeric form mein dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Thinking the client uses the well-known port as its source port. The server listens on 80 or 443; the client's source port is a random high port, and replies go back to it.",
      hi: "Yeh sochna ki client source port bhi well-known port hi rakhta hai. Server 80 ya 443 par listen karta hai; client ka source port random high port hota hai, aur replies usi par wapas aate hain.",
    },
    {
      en: "Calling the ACK number the last byte received. It is the next byte expected: after bytes 1001-2000 arrive, the ACK is 2001.",
      hi: "ACK number ko aakhri received byte bolna. Yeh agla expected byte hai: bytes 1001-2000 aane ke baad ACK 2001 hota hai.",
    },
    {
      en: "Saying UDP has no error checking. UDP has a checksum and drops damaged datagrams; what it lacks is recovery, because nothing is resent.",
      hi: "Yeh kehna ki UDP mein error checking nahi hoti. UDP mein checksum hota hai aur woh kharab datagrams drop karta hai; kami recovery ki hai, kyunki kuch dobara nahi bheja jaata.",
    },
    {
      en: "Putting TFTP under TCP because it transfers files. TFTP uses UDP 69 and handles acknowledgments itself, block by block; FTP is the one on TCP 20 and 21.",
      hi: "File transfer karta hai isliye TFTP ko TCP mein daal dena. TFTP UDP 69 use karta hai aur acknowledgments khud handle karta hai, block by block; TCP 20 aur 21 wala FTP hai.",
    },
    {
      en: "Saying DNS uses only UDP. Normal queries use UDP 53, but zone transfers and large responses use TCP 53.",
      hi: "Yeh kehna ki DNS sirf UDP use karta hai. Normal queries UDP 53 par jaati hain, lekin zone transfers aur bade responses TCP 53 par.",
    },
    {
      en: "Mixing up the handshake order, or naming RST as the normal close. Open is SYN, SYN-ACK, ACK; a normal close uses FIN; RST aborts.",
      hi: "Handshake ka order ulta-pulta karna, ya RST ko normal close bolna. Open hota hai SYN, SYN-ACK, ACK; normal close FIN se hota hai; RST connection abort karta hai.",
    },
  ],
  recap: [
    { en: "Ports deliver data to the right program; a socket is IP + port. Ranges: 0-1023 well-known, 1024-49151 registered, 49152-65535 dynamic.", hi: "Ports data ko sahi program tak pahunchate hain; socket = IP + port. Ranges: 0-1023 well-known, 1024-49151 registered, 49152-65535 dynamic." },
    { en: "TCP is connection-oriented, sequenced, acknowledged, retransmitted and flow-controlled, with a header of at least 20 bytes.", hi: "TCP connection-oriented hai, aur sequencing, acknowledgments, retransmission aur flow control karta hai; header kam se kam 20 bytes." },
    { en: "UDP is connectionless, with no ACKs or retransmission and an 8-byte header. It suits real-time media, short queries and broadcasts.", hi: "UDP connectionless hai, na ACKs na retransmission, aur header sirf 8 bytes. Real-time media, chhoti queries aur broadcasts ke liye sahi hai." },
    { en: "Open with SYN, SYN-ACK, ACK; close with FIN, ACK, FIN, ACK. The ACK number is the next byte expected.", hi: "Kholna: SYN, SYN-ACK, ACK; band karna: FIN, ACK, FIN, ACK. ACK number agla expected byte hota hai." },
    { en: "The window is how many bytes may be sent before waiting for an ACK, and the receiver sets it.", hi: "Window batata hai ki ACK ka wait kiye bina kitne bytes bheje ja sakte hain, aur ise receiver set karta hai." },
    { en: "UDP: DNS 53 (also TCP), DHCP 67/68, TFTP 69, NTP 123, SNMP 161/162, Syslog 514. TCP: FTP 20/21, SSH 22, Telnet 23, SMTP 25, HTTP 80, POP3 110, HTTPS 443.", hi: "UDP wale: DNS 53 (TCP par bhi), DHCP 67/68, TFTP 69, NTP 123, SNMP 161/162, Syslog 514. TCP wale: FTP 20/21, SSH 22, Telnet 23, SMTP 25, HTTP 80, POP3 110, HTTPS 443." },
  ],
  quiz: [
    {
      q: {
        en: "A client sends a SYN to TCP port 80 on a server where a web service is running. What does the server send back?",
        hi: "Client ek server ke TCP port 80 par SYN bhejta hai, aur us server par web service chal rahi hai. Server wapas kya bhejega?",
      },
      options: [
        { en: "An ACK only", hi: "Sirf ACK" },
        { en: "A SYN-ACK", hi: "SYN-ACK" },
        { en: "A FIN", hi: "FIN" },
        { en: "An RST", hi: "RST" },
      ],
      answer: 1,
      explain: {
        en: "The second step of the three-way handshake is a SYN-ACK: the server acknowledges the client's SYN and sends its own. If nothing were listening on port 80, the server would answer with an RST instead.",
        hi: "Three-way handshake ka doosra step SYN-ACK hai: server client ka SYN acknowledge karta hai aur apna SYN bhejta hai. Agar port 80 par koi listen na kar raha hota, toh server RST se jawab deta.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A host receives a TCP segment with sequence number 4001 that carries 500 bytes of data. Everything before it has already arrived. What acknowledgment number does the host send?",
        hi: "Host ko ek TCP segment milta hai jiska sequence number 4001 hai aur usme 500 bytes data hai. Usse pehle ka sab pahunch chuka hai. Host kaunsa acknowledgment number bhejega?",
      },
      options: [
        { en: "4001", hi: "4001" },
        { en: "4002", hi: "4002" },
        { en: "4500", hi: "4500" },
        { en: "4501", hi: "4501" },
      ],
      answer: 3,
      explain: {
        en: "The segment holds bytes 4001 to 4500. The ACK names the next byte expected, 4501. 4500 is the last byte received, which is the common wrong answer.",
        hi: "Segment mein bytes 4001 se 4500 tak hain. ACK agla expected byte batata hai, yaani 4501. 4500 aakhri received byte hai, aur yahi sabse common galat jawab hai.",
      },
      kind: "calc",
    },
    {
      q: { en: "Which group of protocols all use UDP by default?", hi: "Kis group ke saare protocols by default UDP use karte hain?" },
      options: [
        { en: "SSH, Telnet, SMTP", hi: "SSH, Telnet, SMTP" },
        { en: "FTP, HTTP, POP3", hi: "FTP, HTTP, POP3" },
        { en: "TFTP, SNMP, Syslog", hi: "TFTP, SNMP, Syslog" },
        { en: "HTTPS, SSH, FTP", hi: "HTTPS, SSH, FTP" },
      ],
      answer: 2,
      explain: {
        en: "TFTP (69), SNMP (161/162) and Syslog (514) all run over UDP. Every protocol in the other three groups uses TCP.",
        hi: "TFTP (69), SNMP (161/162) aur Syslog (514) teeno UDP par chalte hain. Baaki teen groups ke saare protocols TCP use karte hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "On the laptop, `netstat -an` shows `TCP 10.1.1.10:51514 203.0.113.5:80 ESTABLISHED`. What are the source and destination ports of segments the server sends to the laptop in this connection?",
        hi: "Laptop par `netstat -an` dikhata hai `TCP 10.1.1.10:51514 203.0.113.5:80 ESTABLISHED`. Is connection mein server jo segments laptop ko bhejta hai, unke source aur destination ports kya honge?",
      },
      options: [
        { en: "Source 80, destination 51514", hi: "Source 80, destination 51514" },
        { en: "Source 51514, destination 80", hi: "Source 51514, destination 80" },
        { en: "Source 80, destination 80", hi: "Source 80, destination 80" },
        { en: "Source a new random port, destination 51514", hi: "Source koi naya random port, destination 51514" },
      ],
      answer: 0,
      explain: {
        en: "Traffic from the server swaps the ports: it leaves the server's socket 203.0.113.5:80 and goes to the laptop's socket 10.1.1.10:51514. That is how the laptop matches it to this connection and not to 51515 or any other.",
        hi: "Server ki taraf se aane wale traffic mein ports ulat jaate hain: woh server ke socket 203.0.113.5:80 se nikalta hai aur laptop ke socket 10.1.1.10:51514 par jaata hai. Isi se laptop use isi connection se match karta hai, 51515 ya kisi aur se nahi.",
      },
      kind: "cli",
    },
    {
      q: { en: "Which statement about the UDP header is correct?", hi: "UDP header ke baare mein kaunsa statement sahi hai?" },
      options: [
        { en: "It is 20 bytes and includes sequence numbers", hi: "Yeh 20 bytes ka hai aur isme sequence numbers hote hain" },
        { en: "It is 8 bytes: source port, destination port, length and checksum", hi: "Yeh 8 bytes ka hai: source port, destination port, length aur checksum" },
        { en: "It includes a window size for flow control", hi: "Isme flow control ke liye window size hota hai" },
        { en: "It has no checksum field", hi: "Isme checksum field nahi hota" },
      ],
      answer: 1,
      explain: {
        en: "UDP carries only what it needs to reach a port and detect damage: two ports, a length and a checksum, 8 bytes in total. Sequence numbers and the window size belong to TCP's 20-byte header.",
        hi: "UDP sirf utna rakhta hai jitna port tak pahunchne aur damage pakadne ke liye chahiye: do ports, length aur checksum, total 8 bytes. Sequence numbers aur window size TCP ke 20-byte header mein hote hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A receiver advertises a window of 2000 bytes, and the sender uses 1000-byte segments. What can the sender do?",
        hi: "Receiver 2000 bytes ka window advertise karta hai, aur sender 1000-byte segments use karta hai. Sender kya kar sakta hai?",
      },
      options: [
        { en: "Send one segment, then wait for its ACK", hi: "Ek segment bheje, phir uske ACK ka wait kare" },
        { en: "Send 2000 segments before waiting", hi: "Wait karne se pehle 2000 segments bheje" },
        { en: "Send two segments back to back, then wait for an ACK", hi: "Do segments ek ke baad ek bheje, phir ACK ka wait kare" },
        { en: "Send as many segments as it likes, because the window is only a suggestion", hi: "Jitne chahe utne segments bheje, kyunki window sirf ek suggestion hai" },
      ],
      answer: 2,
      explain: {
        en: "The window counts bytes, not segments. 2000 bytes allows two 1000-byte segments in flight without an acknowledgment; then the sender must wait until an ACK opens the window again.",
        hi: "Window bytes ginta hai, segments nahi. 2000 bytes ka matlab do 1000-byte segments bina acknowledgment ke bheje ja sakte hain; phir sender ko tab tak rukna padega jab tak ACK window ko dobara na khole.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "LIEACBqlntY",
      title: "Free CCNA | TCP & UDP | Day 30",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "The full lecture: ports, the TCP header, the handshake and close, sequencing, flow control and the important port numbers.",
        hi: "Poora lecture: ports, TCP header, handshake aur close, sequencing, flow control aur zaroori port numbers.",
      },
    },
    {
      id: "pJKFahkqMU8",
      title: "Free CCNA | Wireshark Demo (TCP/UDP) | Day 30 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "An 11-minute Wireshark demo of the TCP and UDP ideas from the lecture.",
        hi: "Lecture ke TCP aur UDP concepts ka 11 minute ka Wireshark demo.",
      },
    },
    {
      id: "-8LSzXKAp4M",
      title: "6. Free CCNA (NEW) | TCP/IP Model in Hindi - Transport Layer",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "A Hindi walkthrough of the transport layer and its two protocols.",
        hi: "Transport layer aur uske do protocols ka Hindi walkthrough.",
      },
    },
    {
      id: "aksCL2VnKXU",
      title: "22. TCP Connection & 3-Way Handshake",
      channel: "NetworkPath",
      lang: "hi",
      note: {
        en: "The handshake and the four-step close, with a live Wireshark capture.",
        hi: "Handshake aur four-step close, live Wireshark capture ke saath.",
      },
    },
  ],
  lab: {
    title: { en: "Watch UDP and TCP in Packet Tracer", hi: "Packet Tracer mein UDP aur TCP chalte hue dekho" },
    steps: [
      {
        en: "Connect a PC (10.1.1.10/24) and a Server-PT (10.1.1.100/24) to one switch. On the server, turn on HTTP and DNS, and add an A record: www.example.com → 10.1.1.100. Set the PC's DNS server to 10.1.1.100.",
        hi: "Ek switch se ek PC (10.1.1.10/24) aur ek Server-PT (10.1.1.100/24) jodo. Server par HTTP aur DNS on karo, aur ek A record add karo: www.example.com → 10.1.1.100. PC ka DNS server 10.1.1.100 set karo.",
      },
      {
        en: "Switch to Simulation mode and set the event filter to DNS, TCP and HTTP only.",
        hi: "Simulation mode mein jao aur event filter sirf DNS, TCP aur HTTP par set karo.",
      },
      {
        en: "Open the PC's Web Browser and go to www.example.com. Step through the events: first the DNS query and reply, then the three TCP segments of the handshake.",
        hi: "PC ka Web Browser kholo aur www.example.com par jao. Events step by step dekho: pehle DNS query aur reply, phir handshake ke teen TCP segments.",
      },
      {
        en: "Click the DNS query and open Outbound PDU Details. Note the transport (UDP), the source port the PC chose and destination port 53.",
        hi: "DNS query par click karo aur Outbound PDU Details kholo. Transport (UDP), PC ka chuna hua source port aur destination port 53 note karo.",
      },
      {
        en: "Click the first TCP segment. Find the SYN flag and the sequence number, then check that the server's reply swaps the source and destination ports.",
        hi: "Pehle TCP segment par click karo. SYN flag aur sequence number dhoondho, phir check karo ki server ke reply mein source aur destination ports ulat gaye hain.",
      },
      {
        en: "On a real computer with a browser open, run `netstat -an` and find your ESTABLISHED connections to port 443.",
        hi: "Real computer par browser khula rakh kar `netstat -an` chalao aur port 443 wale apne ESTABLISHED connections dhoondho.",
      },
    ],
  },
};

export default lesson;
