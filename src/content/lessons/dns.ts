import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "dns",
  intro: {
    en: "People remember names like www.example.com; packets need addresses like 203.0.113.5. DNS turns one into the other, and almost every connection a user opens starts with a DNS lookup. When DNS breaks, users report that \"the internet is down\" even though ping by IP address works fine, so you need to know how a lookup travels and how to test each part of it.",
    hi: "Log www.example.com jaise naam yaad rakhte hain; packets ko 203.0.113.5 jaise address chahiye. DNS ek ko doosre mein badalta hai, aur user ka lagbhag har connection DNS lookup se shuru hota hai. DNS toote toh users bolte hain \"internet down hai\", jabki IP address se ping bilkul chal raha hota hai. Isliye tumhe pata hona chahiye ki lookup kaise travel karta hai aur uske har hisse ko test kaise karte hain.",
  },
  outcomes: [
    { en: "Explain the DNS hierarchy of root, TLD and authoritative servers", hi: "DNS hierarchy samjha sako: root, TLD aur authoritative servers" },
    { en: "Trace a lookup: a recursive query to the resolver, then iterative queries from the resolver", hi: "Lookup trace kar sako: resolver ko recursive query, phir resolver ki iterative queries" },
    { en: "Predict when an answer comes from a cache, using the TTL", hi: "TTL dekh kar predict kar sako ki answer cache se kab aayega" },
    { en: "Identify A, AAAA, CNAME, MX, NS and PTR records and say when DNS uses UDP or TCP port 53", hi: "A, AAAA, CNAME, MX, NS aur PTR records pehchaan sako aur bata sako ki DNS kab UDP aur kab TCP port 53 use karta hai" },
    { en: "Test DNS with nslookup and ipconfig, and configure name resolution on a Cisco router", hi: "nslookup aur ipconfig se DNS test kar sako, aur Cisco router par name resolution configure kar sako" },
  ],
  sections: [
    {
      id: "why-dns",
      heading: { en: "Why names need a directory", hi: "Names ko directory kyun chahiye" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Before DNS, every computer kept a **hosts file**: a plain list of names and addresses. It still exists (`C:\\Windows\\System32\\drivers\\etc\\hosts` on Windows, `/etc/hosts` on Linux and macOS) and is checked before DNS. A single file cannot keep up with billions of names that change every day, so the job was split up.",
            hi: "DNS se pehle har computer ek **hosts file** rakhta tha: names aur addresses ki simple list. Woh aaj bhi hai (Windows par `C:\\Windows\\System32\\drivers\\etc\\hosts`, Linux aur macOS par `/etc/hosts`) aur DNS se pehle check hoti hai. Lekin ek file arabon names ke saath nahi chal sakti jo roz badalte hain, isliye kaam baant diya gaya.",
          },
        },
        {
          type: "p",
          text: {
            en: "**DNS (Domain Name System)** is a distributed database. No server knows every name; each one knows its own part and who to ask for the rest. A full name such as `www.example.com.` is a **fully qualified domain name (FQDN)**. Read it right to left: the root (the final dot, usually not typed), then the top-level domain `com`, then the domain `example`, then the host `www`.",
            hi: "**DNS (Domain Name System)** ek distributed database hai. Kisi ek server ko saare names nahi pata; har server apna hissa jaanta hai aur yeh bhi ki baaki ke liye kisse poochna hai. `www.example.com.` jaisa poora naam **fully qualified domain name (FQDN)** kehlata hai. Ise right se left padho: root (aakhri dot, jo aam taur par type nahi karte), phir top-level domain `com`, phir domain `example`, phir host `www`.",
          },
        },
      ],
    },
    {
      id: "hierarchy",
      heading: { en: "Root, TLD and authoritative servers", hi: "Root, TLD aur authoritative servers" },
      blocks: [
        {
          type: "table",
          caption: { en: "Who knows what for www.example.com", hi: "www.example.com ke liye kisko kya pata hai" },
          columns: [{ en: "Level", hi: "Level" }, { en: "Example", hi: "Example" }, { en: "What it knows", hi: "Use kya pata hai" }],
          rows: [
            [
              { en: "Root", hi: "Root" },
              "a.root-servers.net (198.41.0.4)",
              { en: "The name servers of every TLD. 13 named root servers (a to m), each run as many anycast copies worldwide.", hi: "Har TLD ke name servers. 13 named root servers (a se m), har ek duniya bhar mein anycast copies ke roop mein chalta hai." },
            ],
            [
              { en: "Top-level domain (TLD)", hi: "Top-level domain (TLD)" },
              ".com: a.gtld-servers.net (192.5.6.30)",
              { en: "The name servers of every domain under it. Others: .org, .net, .in, .uk.", hi: "Apne neeche ke har domain ke name servers. Aur bhi hain: .org, .net, .in, .uk." },
            ],
            [
              { en: "Authoritative", hi: "Authoritative" },
              "ns1.example.com (198.51.100.53)",
              { en: "The actual records of example.com, entered by the domain's owner or hosting provider.", hi: "example.com ke asli records, jo domain ke owner ya hosting provider ne daale hain." },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "One more server sits outside the hierarchy and does the legwork: the **recursive resolver**. It is the DNS server your PC is configured with, by DHCP option 6 or by hand. It can be your company's DNS server, your ISP's, or a public one such as 8.8.8.8 or 1.1.1.1. In lesson 4.1, PC1 received 8.8.8.8 from DHCP, so that is its resolver here.",
            hi: "Ek aur server hierarchy ke bahar hai aur asli bhaag-daud wahi karta hai: **recursive resolver**. Yeh woh DNS server hai jo tumhare PC par configured hai, DHCP option 6 se ya haath se. Yeh company ka DNS server ho sakta hai, ISP ka, ya 8.8.8.8 ya 1.1.1.1 jaisa public server. Lesson 4.1 mein PC1 ko DHCP se 8.8.8.8 mila tha, isliye yahan wahi uska resolver hai.",
          },
        },
      ],
    },
    {
      id: "resolution",
      heading: { en: "One lookup, step by step", hi: "Ek lookup, step by step" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "PC1's **stub resolver** (the DNS client inside the operating system) checks the hosts file and its own cache. Nothing found.",
              hi: "PC1 ka **stub resolver** (operating system ke andar ka DNS client) hosts file aur apna cache check karta hai. Kuch nahi mila.",
            },
            {
              en: "PC1 sends a **recursive query** to 8.8.8.8 on UDP 53: \"give me the final answer for www.example.com, type A\".",
              hi: "PC1 8.8.8.8 ko UDP 53 par **recursive query** bhejta hai: \"www.example.com ka final answer do, type A\".",
            },
            {
              en: "The resolver checks its cache. Empty, so it sends an **iterative query** to a root server, which replies with a referral to the .com servers.",
              hi: "Resolver apna cache check karta hai. Khaali hai, toh woh root server ko **iterative query** bhejta hai, jo .com servers ka referral deta hai.",
            },
            {
              en: "The resolver asks a .com server, which refers it to ns1.example.com at 198.51.100.53.",
              hi: "Resolver .com server se poochta hai, jo use 198.51.100.53 wale ns1.example.com ka referral deta hai.",
            },
            {
              en: "The resolver asks ns1.example.com, which answers `www.example.com A 203.0.113.5`, TTL 3600.",
              hi: "Resolver ns1.example.com se poochta hai, jo jawab deta hai `www.example.com A 203.0.113.5`, TTL 3600.",
            },
            {
              en: "The resolver caches the answer and the referrals, and replies to PC1. PC1 caches it too and opens its TCP connection to 203.0.113.5.",
              hi: "Resolver answer aur referrals cache karta hai aur PC1 ko reply karta hai. PC1 bhi cache karta hai aur 203.0.113.5 se TCP connection kholta hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Recursive and iterative queries", hi: "Recursive aur iterative queries" },
          columns: ["", { en: "Recursive", hi: "Recursive" }, { en: "Iterative", hi: "Iterative" }],
          rows: [
            [{ en: "Who sends it", hi: "Kaun bhejta hai" }, { en: "The client (PC1) to its resolver", hi: "Client (PC1) apne resolver ko" }, { en: "The resolver to root, TLD and authoritative servers", hi: "Resolver root, TLD aur authoritative servers ko" }],
            [{ en: "What it asks for", hi: "Kya maangti hai" }, { en: "The final answer, or an error", hi: "Final answer, ya error" }, { en: "The best you know: an answer or a referral", hi: "Jo best pata ho: answer ya referral" }],
            [{ en: "Who does the work", hi: "Kaam kaun karta hai" }, { en: "The resolver", hi: "Resolver" }, { en: "The asker follows each referral itself", hi: "Poochne wala har referral khud follow karta hai" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "The host sends one recursive query and waits. The resolver does the iterative walk from root to TLD to authoritative. The host never talks to root servers itself.",
            hi: "Host ek recursive query bhejta hai aur wait karta hai. Root se TLD se authoritative tak iterative chakkar resolver lagata hai. Host khud kabhi root servers se baat nahi karta.",
          },
        },
      ],
    },
    {
      id: "caching-ttl",
      heading: { en: "Caching and TTL", hi: "Caching aur TTL" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every record carries a **TTL (time to live)** in seconds, set by the zone's owner. Any resolver or host may reuse the record until its TTL counts down to 0, then it must ask again. That is why the second lookup in the animation needed no root, TLD or authoritative queries, and why the AAAA lookup went straight to ns1.example.com.",
            hi: "Har record ke saath seconds mein ek **TTL (time to live)** hota hai, jo zone ka owner set karta hai. Koi bhi resolver ya host record ko tab tak reuse kar sakta hai jab tak TTL ghat kar 0 na ho jaaye, uske baad dobara poochna padta hai. Isi wajah se animation mein doosre lookup ko root, TLD ya authoritative se kuch poochna nahi pada, aur AAAA lookup seedha ns1.example.com gaya.",
          },
        },
        {
          type: "p",
          text: {
            en: "The trade-off: a long TTL means fewer queries and faster answers, but a changed record stays wrong in caches until the old TTL runs out. Before moving a server to a new address, engineers lower the TTL a day ahead.",
            hi: "Trade-off yeh hai: lamba TTL matlab kam queries aur fast answers, lekin record badla toh caches mein purana record purane TTL ke khatam hone tak galat hi rahega. Server ko naye address par shift karne se ek din pehle engineers TTL kam kar dete hain.",
          },
        },
        {
          type: "cli",
          title: { en: "Windows: the client's own cache", hi: "Windows: client ka apna cache" },
          lines: [
            { prompt: "C:\\>", cmd: "ipconfig /displaydns" },
            { out: "    www.example.com" },
            { out: "    ----------------------------------------" },
            { out: "    Record Name . . . . . : www.example.com" },
            { out: "    Record Type . . . . . : 1", comment: { en: "Type 1 = A record", hi: "Type 1 = A record" } },
            { out: "    Time To Live  . . . . : 3412", comment: { en: "Seconds left before PC1 must ask again", hi: "Itne seconds baad PC1 ko dobara poochna padega" } },
            { out: "    Data Length . . . . . : 4" },
            { out: "    Section . . . . . . . : Answer" },
            { out: "    A (Host) Record . . . : 203.0.113.5" },
            { prompt: "C:\\>", cmd: "ipconfig /flushdns" },
            { out: "Successfully flushed the DNS Resolver Cache." },
          ],
          note: {
            en: "`/flushdns` clears only this PC's cache. The resolver keeps its copy until the TTL expires.",
            hi: "`/flushdns` sirf is PC ka cache clear karta hai. Resolver apni copy TTL khatam hone tak rakhta hai.",
          },
        },
      ],
    },
    {
      id: "records",
      heading: { en: "Record types", hi: "Record types" },
      blocks: [
        {
          type: "table",
          caption: { en: "Records in the example.com zone", hi: "example.com zone ke records" },
          columns: [{ en: "Type", hi: "Type" }, { en: "Example", hi: "Example" }, { en: "Purpose", hi: "Kaam" }],
          rows: [
            ["A", "www.example.com → 203.0.113.5", { en: "Name to IPv4 address", hi: "Naam se IPv4 address" }],
            ["AAAA", "www.example.com → 2001:db8:5::5", { en: "Name to IPv6 address", hi: "Naam se IPv6 address" }],
            ["CNAME", "web.example.com → www.example.com", { en: "Alias: points to another name, never directly to an address", hi: "Alias: doosre naam ko point karta hai, seedha address ko kabhi nahi" }],
            ["MX", "example.com → 10 mail.example.com", { en: "Mail server for the domain; lower preference number is tried first", hi: "Domain ka mail server; kam preference number pehle try hota hai" }],
            ["NS", "example.com → ns1.example.com", { en: "The authoritative name servers for a zone", hi: "Zone ke authoritative name servers" }],
            ["PTR", "5.113.0.203.in-addr.arpa → www.example.com", { en: "Reverse lookup: address to name", hi: "Reverse lookup: address se naam" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "A **reverse lookup** turns 203.0.113.5 back into a name. DNS writes the address backwards under the special domain `in-addr.arpa` (5.113.0.203.in-addr.arpa) and asks for its PTR record. Reversing puts the most general part first in the hierarchy, just as `com` comes first for forward names. Log servers and `traceroute` use reverse lookups to show names instead of bare addresses.",
            hi: "**Reverse lookup** 203.0.113.5 ko wapas naam mein badalta hai. DNS address ko ulta likh kar special domain `in-addr.arpa` ke neeche rakhta hai (5.113.0.203.in-addr.arpa) aur uska PTR record maangta hai. Ulta likhne se hierarchy mein sabse general hissa pehle aata hai, jaise forward names mein `com` pehle aata hai. Log servers aur `traceroute` bare addresses ki jagah names dikhane ke liye reverse lookup use karte hain.",
          },
        },
      ],
    },
    {
      id: "ports-and-tools",
      heading: { en: "Port 53, nslookup and the classic symptom", hi: "Port 53, nslookup aur classic symptom" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**UDP 53** carries normal queries and answers: one small question, one small answer, no handshake (lesson 1.7).",
              hi: "**UDP 53** par normal queries aur answers jaate hain: ek chhota sawaal, ek chhota jawab, koi handshake nahi (lesson 1.7).",
            },
            {
              en: "**TCP 53** is used for **zone transfers**, when a secondary server copies the whole zone from the primary, and when an answer is too large for UDP. The server then sets the truncated (TC) flag and the client asks again over TCP.",
              hi: "**TCP 53** **zone transfers** ke liye use hota hai, jab secondary server primary se poora zone copy karta hai, aur tab jab answer UDP ke liye bahut bada ho. Tab server truncated (TC) flag set karta hai aur client TCP par dobara poochta hai.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "nslookup on Windows", hi: "Windows par nslookup" },
          lines: [
            { prompt: "C:\\>", cmd: "nslookup www.example.com" },
            { out: "Server:  dns.google", comment: { en: "Which resolver answered", hi: "Kis resolver ne jawab diya" } },
            { out: "Address:  8.8.8.8" },
            { out: "Non-authoritative answer:", comment: { en: "From a resolver, not the zone's own server. Normal, not an error.", hi: "Resolver se aaya, zone ke apne server se nahi. Normal hai, error nahi." } },
            { out: "Name:    www.example.com" },
            { out: "Address:  203.0.113.5" },
            { prompt: "C:\\>", cmd: "nslookup -type=mx example.com" },
            { out: "example.com     MX preference = 10, mail exchanger = mail.example.com" },
          ],
          note: {
            en: "`nslookup 203.0.113.5` does a reverse (PTR) lookup. `nslookup www.example.com 1.1.1.1` asks a different resolver, which quickly shows whether your usual resolver is the problem.",
            hi: "`nslookup 203.0.113.5` reverse (PTR) lookup karta hai. `nslookup www.example.com 1.1.1.1` doosre resolver se poochta hai, jisse turant pata chal jaata hai ki problem tumhare usual resolver mein hai ya nahi.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Ping by IP works, ping by name fails", hi: "IP se ping chalta hai, naam se fail" },
          text: {
            en: "`ping 203.0.113.5` succeeds but `ping www.example.com` says it could not find the host. Routing, NAT and the link are fine; name resolution is not. Check the DNS server in `ipconfig /all`, then whether that server answers (`nslookup` against it), then whether a firewall or ACL blocks UDP 53.",
            hi: "`ping 203.0.113.5` chal jaata hai lekin `ping www.example.com` bolta hai host nahi mila. Routing, NAT aur link theek hain; name resolution theek nahi. `ipconfig /all` mein DNS server check karo, phir dekho woh server jawab deta hai ya nahi (us par `nslookup`), phir yeh ki koi firewall ya ACL UDP 53 block toh nahi kar raha.",
          },
        },
      ],
    },
    {
      id: "cisco-dns",
      heading: { en: "DNS on a Cisco router", hi: "Cisco router par DNS" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A router uses DNS when you type a name in `ping`, `traceroute`, `telnet` or `ssh`. `ip domain lookup` is on by default, but with no name server configured the router broadcasts its queries to 255.255.255.255. That is why a mistyped command at the `R1#` prompt freezes the console for a while: IOS thinks the unknown word is a host name and tries to resolve it before giving up.",
            hi: "Router DNS tab use karta hai jab tum `ping`, `traceroute`, `telnet` ya `ssh` mein naam type karte ho. `ip domain lookup` by default on hota hai, lekin name server configure nahi hai toh router apni queries 255.255.255.255 par broadcast karta hai. Isi wajah se `R1#` prompt par galat command type karne se console kuch der ruk jaata hai: IOS us unknown word ko host name samajh kar resolve karne ki koshish karta hai, phir haar maanta hai.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: the typo delay, then real DNS settings", hi: "R1: typo wala delay, phir asli DNS settings" },
          lines: [
            { prompt: "R1#", cmd: "comfigure" },
            { out: "Translating \"comfigure\"...domain server (255.255.255.255)", comment: { en: "No name server set, so the query is broadcast", hi: "Name server set nahi, isliye query broadcast hoti hai" } },
            { out: "% Unknown command or computer name, or unable to find computer address" },
            { prompt: "R1#", cmd: "configure terminal" },
            { prompt: "R1(config)#", cmd: "ip name-server 8.8.8.8 1.1.1.1", comment: { en: "Resolvers the router asks, in order", hi: "Router jin resolvers se poochta hai, order mein" } },
            { prompt: "R1(config)#", cmd: "ip domain name example.com", comment: { en: "Appended to names typed without a domain", hi: "Bina domain wale names ke peeche lagaya jaata hai" } },
            { prompt: "R1(config)#", cmd: "ip host R2 10.0.12.2", comment: { en: "Static entry, works with no DNS server at all", hi: "Static entry, bina kisi DNS server ke bhi chalti hai" } },
            { prompt: "R1(config)#", cmd: "end" },
            { prompt: "R1#", cmd: "ping www.example.com" },
            { out: "Translating \"www.example.com\"...domain server (8.8.8.8) [OK]" },
            { out: "Type escape sequence to abort." },
            { out: "Sending 5, 100-byte ICMP Echos to 203.0.113.5, timeout is 2 seconds:" },
            { out: "!!!!!" },
          ],
          note: {
            en: "In labs many people add `no ip domain lookup` to skip the typo delay; the router then cannot resolve any name except its `ip host` entries. Older IOS versions spell these commands `ip domain-lookup` and `ip domain-name`. `show hosts` lists the static and cached names.",
            hi: "Labs mein bahut log typo delay se bachne ke liye `no ip domain lookup` laga dete hain; tab router `ip host` entries ke alawa koi naam resolve nahi kar sakta. Purane IOS versions mein yeh commands `ip domain-lookup` aur `ip domain-name` likhe jaate hain. `show hosts` static aur cached names dikhata hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "`ip dns server` goes one step further and lets the router answer DNS queries from LAN hosts. It replies from its `ip host` entries and its cache, and forwards everything else to its `ip name-server` resolvers. A small branch can then hand out the router's own address, 192.168.10.1, as the DNS server in its DHCP pool. The CCNA only expects you to know this exists.",
            hi: "`ip dns server` ek step aage jaata hai: router LAN hosts ki DNS queries ka jawab dene lagta hai. Woh apni `ip host` entries aur cache se jawab deta hai, aur baaki sab apne `ip name-server` resolvers ko forward karta hai. Tab ek chhoti branch DHCP pool mein DNS server ke roop mein router ka apna address, 192.168.10.1, de sakti hai. CCNA mein bas itna jaanna kaafi hai ki yeh feature hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "DNS", def: { en: "Domain Name System. The distributed database that maps names to addresses and other records.", hi: "Domain Name System. Distributed database jo names ko addresses aur doosre records se map karta hai." } },
    { term: "FQDN", def: { en: "A complete name down from the root, such as www.example.com.", hi: "Root se neeche tak ka poora naam, jaise www.example.com." } },
    { term: "Recursive resolver", def: { en: "The DNS server a host is configured with; it chases referrals and returns the final answer.", hi: "Woh DNS server jo host par configured hai; yeh referrals follow karke final answer laata hai." } },
    { term: "Root server", def: { en: "The top of the hierarchy; it refers resolvers to the right TLD servers.", hi: "Hierarchy ka top; yeh resolvers ko sahi TLD servers ka referral deta hai." } },
    { term: "TLD", def: { en: "Top-level domain such as .com or .in; its servers refer resolvers to each domain's name servers.", hi: "Top-level domain jaise .com ya .in; iske servers har domain ke name servers ka referral dete hain." } },
    { term: "Authoritative server", def: { en: "A server that holds a zone's records and answers for them with the AA flag set.", hi: "Woh server jiske paas zone ke records hain aur jo AA flag ke saath unka jawab deta hai." } },
    { term: "TTL", def: { en: "Time to live: how many seconds a record may be cached before it must be looked up again.", hi: "Time to live: record kitne seconds cache mein reh sakta hai, uske baad dobara lookup karna padta hai." } },
    { term: "PTR record", def: { en: "A reverse record under in-addr.arpa that maps an address back to a name.", hi: "in-addr.arpa ke neeche ka reverse record jo address ko wapas naam se map karta hai." } },
  ],
  commands: [
    { cmd: "nslookup <name> [server]", mode: "Windows / macOS / Linux terminal", does: { en: "Query DNS directly, optionally against a chosen server", hi: "DNS se seedha query karta hai, chaho toh kisi chosen server se" } },
    { cmd: "nslookup -type=mx <domain>", mode: "Windows / macOS / Linux terminal", does: { en: "Ask for a specific record type", hi: "Ek specific record type maangta hai" } },
    { cmd: "ipconfig /displaydns", mode: "Windows terminal", does: { en: "Show the PC's DNS cache with TTLs", hi: "PC ka DNS cache TTL ke saath dikhata hai" } },
    { cmd: "ipconfig /flushdns", mode: "Windows terminal", does: { en: "Clear the PC's DNS cache", hi: "PC ka DNS cache clear karta hai" } },
    { cmd: "ip domain lookup", mode: "Global config", does: { en: "Let the router resolve names with DNS (on by default)", hi: "Router ko DNS se names resolve karne deta hai (default on)" } },
    { cmd: "no ip domain lookup", mode: "Global config", does: { en: "Stop DNS lookups, ending the typo delay", hi: "DNS lookups band karta hai, typo delay khatam" } },
    { cmd: "ip name-server <ip> [ip ...]", mode: "Global config", does: { en: "Set the resolvers the router uses", hi: "Router kaunse resolvers use kare, woh set karta hai" } },
    { cmd: "ip domain name <name>", mode: "Global config", does: { en: "Default domain appended to short names", hi: "Chhote names ke peeche lagne wala default domain" } },
    { cmd: "ip host <name> <ip>", mode: "Global config", does: { en: "Add a static name-to-address entry", hi: "Static name-to-address entry add karta hai" } },
    { cmd: "ip dns server", mode: "Global config", does: { en: "Let the router answer DNS queries from clients", hi: "Router ko clients ki DNS queries ka jawab dene deta hai" } },
    { cmd: "show hosts", mode: "Privileged EXEC", does: { en: "Show static and cached host names", hi: "Static aur cached host names dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Saying DNS uses only UDP. Queries normally use UDP 53, but zone transfers and answers too large for UDP use TCP 53.",
      hi: "Yeh kehna ki DNS sirf UDP use karta hai. Queries aam taur par UDP 53 par jaati hain, lekin zone transfers aur UDP ke liye bahut bade answers TCP 53 par jaate hain.",
    },
    {
      en: "Thinking the PC queries the root and TLD servers itself. The PC sends one recursive query; the resolver does the iterative work.",
      hi: "Yeh sochna ki PC khud root aur TLD servers se poochta hai. PC ek recursive query bhejta hai; iterative kaam resolver karta hai.",
    },
    {
      en: "Expecting a changed record to show up everywhere at once. Caches keep the old answer until its TTL expires; `ipconfig /flushdns` clears only the local PC.",
      hi: "Yeh expect karna ki badla hua record turant har jagah dikhega. Caches purana answer TTL khatam hone tak rakhte hain; `ipconfig /flushdns` sirf local PC ka cache clear karta hai.",
    },
    {
      en: "Reading \"Non-authoritative answer\" in nslookup as a failure. It only means the answer came from a resolver (often from its cache) instead of the zone's own authoritative server.",
      hi: "nslookup mein \"Non-authoritative answer\" ko failure samajhna. Iska bas itna matlab hai ki answer zone ke apne authoritative server se nahi, resolver se aaya (aksar uske cache se).",
    },
    {
      en: "Pointing a CNAME at an IP address. A CNAME always points to another name; the A or AAAA record of that name holds the address.",
      hi: "CNAME ko IP address par point karna. CNAME hamesha doosre naam ko point karta hai; address us naam ke A ya AAAA record mein hota hai.",
    },
    {
      en: "Adding `no ip domain lookup` in a lab and then wondering why `ping www.example.com` fails on the router. Name lookups are now off.",
      hi: "Lab mein `no ip domain lookup` lagana aur phir sochna ki router par `ping www.example.com` fail kyun ho raha hai. Name lookups ab band hain.",
    },
  ],
  recap: [
    { en: "Hierarchy: root → TLD (.com) → authoritative (ns1.example.com). Each level refers you to the next.", hi: "Hierarchy: root → TLD (.com) → authoritative (ns1.example.com). Har level agle level ka referral deta hai." },
    { en: "Host to resolver: one recursive query. Resolver to root, TLD and authoritative: iterative queries.", hi: "Host se resolver: ek recursive query. Resolver se root, TLD aur authoritative: iterative queries." },
    { en: "Answers and referrals are cached for their TTL in seconds. Any answer that comes from a resolver, fresh or cached, is \"non-authoritative\".", hi: "Answers aur referrals apne TTL (seconds) tak cache hote hain. Resolver se aaya har answer, fresh ho ya cached, \"non-authoritative\" hota hai." },
    { en: "A = IPv4, AAAA = IPv6, CNAME = alias, MX = mail server, NS = name server, PTR = reverse.", hi: "A se IPv4 milta hai, AAAA se IPv6, CNAME alias hai, MX mail server batata hai, NS name server, aur PTR reverse lookup ke liye hai." },
    { en: "UDP 53 for queries; TCP 53 for zone transfers and large answers.", hi: "Queries ke liye UDP 53; zone transfers aur bade answers ke liye TCP 53." },
    { en: "Ping by IP works but by name fails: suspect DNS. IOS: `ip name-server`, `ip domain lookup`, `ip host`, `ip dns server`.", hi: "IP se ping chalta hai lekin naam se nahi: DNS par shak karo. IOS: `ip name-server`, `ip domain lookup`, `ip host`, `ip dns server`." },
  ],
  quiz: [
    {
      q: { en: "Which server holds the A record for www.example.com and answers with the AA flag set?", hi: "www.example.com ka A record kis server ke paas hota hai aur kaun AA flag ke saath jawab deta hai?" },
      options: [
        { en: "A root server", hi: "Root server" },
        { en: "A .com TLD server", hi: ".com TLD server" },
        { en: "The authoritative name server for example.com", hi: "example.com ka authoritative name server" },
        { en: "The client's recursive resolver", hi: "Client ka recursive resolver" },
      ],
      answer: 2,
      explain: {
        en: "Root and TLD servers only hand out referrals. The resolver can return the record from its cache, but that answer is non-authoritative. Only the zone's own server, ns1.example.com, answers authoritatively.",
        hi: "Root aur TLD servers sirf referrals dete hain. Resolver cache se record de sakta hai, lekin woh answer non-authoritative hota hai. Authoritative jawab sirf zone ka apna server, ns1.example.com, deta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A user can `ping 203.0.113.5` successfully, but `ping www.example.com` reports that the host could not be found. What is the most likely problem?",
        hi: "User `ping 203.0.113.5` successfully kar sakta hai, lekin `ping www.example.com` bolta hai ki host nahi mila. Sabse likely problem kya hai?",
      },
      options: [
        { en: "The PC's DNS server is wrong or unreachable", hi: "PC ka DNS server galat hai ya reachable nahi hai" },
        { en: "The default gateway is wrong", hi: "Default gateway galat hai" },
        { en: "The PC has an APIPA address", hi: "PC ke paas APIPA address hai" },
        { en: "The web server's ARP entry has expired", hi: "Web server ki ARP entry expire ho gayi hai" },
      ],
      answer: 0,
      explain: {
        en: "Reaching 203.0.113.5 proves the address, gateway and routing all work, so neither a wrong gateway nor an APIPA address fits. Only the name-to-address step fails, which points at DNS.",
        hi: "203.0.113.5 tak pahunchna saabit karta hai ki address, gateway aur routing sab chal rahe hain, isliye galat gateway ya APIPA address fit nahi baithte. Sirf name-to-address wala step fail ho raha hai, jo DNS ki taraf ishaara karta hai.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which statement correctly describes the queries in a normal lookup?", hi: "Normal lookup ki queries ke baare mein kaunsa statement sahi hai?" },
      options: [
        { en: "The PC sends iterative queries to root, TLD and authoritative servers itself", hi: "PC khud root, TLD aur authoritative servers ko iterative queries bhejta hai" },
        { en: "The PC sends a recursive query to its resolver, and the resolver sends iterative queries", hi: "PC apne resolver ko recursive query bhejta hai, aur resolver iterative queries bhejta hai" },
        { en: "The resolver sends a recursive query to the root server, which contacts the TLD for it", hi: "Resolver root server ko recursive query bhejta hai, jo uske liye TLD se baat karta hai" },
        { en: "The PC broadcasts the query and the authoritative server replies directly", hi: "PC query broadcast karta hai aur authoritative server seedha reply karta hai" },
      ],
      answer: 1,
      explain: {
        en: "The host asks once for the final answer (recursive). The resolver then follows referrals from root to TLD to authoritative (iterative). Root servers do not do recursion for anyone, and DNS queries are unicast to the configured server, not broadcast.",
        hi: "Host ek baar final answer maangta hai (recursive). Phir resolver root se TLD se authoritative tak referrals follow karta hai (iterative). Root servers kisi ke liye recursion nahi karte, aur DNS queries configured server ko unicast jaati hain, broadcast nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "`nslookup -type=mx example.com` returns `example.com  MX preference = 10, mail exchanger = mail.example.com`. What does this tell you?",
        hi: "`nslookup -type=mx example.com` yeh deta hai: `example.com  MX preference = 10, mail exchanger = mail.example.com`. Isse kya pata chalta hai?",
      },
      options: [
        { en: "mail.example.com is an alias of example.com", hi: "mail.example.com, example.com ka alias hai" },
        { en: "example.com's web server is mail.example.com", hi: "example.com ka web server mail.example.com hai" },
        { en: "Ten mail servers serve example.com", hi: "example.com ke liye das mail servers hain" },
        { en: "Email for addresses @example.com is delivered to mail.example.com", hi: "@example.com wale addresses ka email mail.example.com par deliver hota hai" },
      ],
      answer: 3,
      explain: {
        en: "An MX record names the mail server for a domain. The 10 is a preference value: with several MX records, the lowest number is tried first. An alias would be a CNAME record.",
        hi: "MX record domain ka mail server batata hai. 10 ek preference value hai: kai MX records hon toh sabse kam number pehle try hota hai. Alias CNAME record hota.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "At 09:00 a resolver caches `www.example.com A 203.0.113.5` with a TTL of 3600. At 09:10 the owner changes the record to 203.0.113.9. Until when, at the latest, can that resolver keep giving out the old address?",
        hi: "09:00 par ek resolver `www.example.com A 203.0.113.5` ko TTL 3600 ke saath cache karta hai. 09:10 par owner record badal kar 203.0.113.9 kar deta hai. Woh resolver zyada se zyada kab tak purana address deta reh sakta hai?",
      },
      options: [
        { en: "Until 09:10, the moment of the change", hi: "09:10 tak, jab change hua" },
        { en: "Until 10:00, when its cached copy expires", hi: "10:00 tak, jab uski cached copy expire hogi" },
        { en: "Until 10:10, one hour after the change", hi: "10:10 tak, change ke ek ghante baad" },
        { en: "Until the resolver is restarted", hi: "Jab tak resolver restart na ho" },
      ],
      answer: 1,
      explain: {
        en: "The TTL counts from when the resolver cached the record, 09:00. 3600 seconds later, at 10:00, the copy expires and the next query fetches 203.0.113.9. The resolver is not told about the change.",
        hi: "TTL tab se ginta hai jab resolver ne record cache kiya, yaani 09:00. 3600 seconds baad, 10:00 par, copy expire hoti hai aur agli query 203.0.113.9 laati hai. Resolver ko change ke baare mein bataya nahi jaata.",
      },
      kind: "calc",
    },
    {
      q: { en: "When does DNS use TCP port 53 instead of UDP port 53?", hi: "DNS UDP port 53 ki jagah TCP port 53 kab use karta hai?" },
      options: [
        { en: "For zone transfers and for answers too large for UDP", hi: "Zone transfers ke liye aur UDP ke liye bahut bade answers ke liye" },
        { en: "For every query sent to a root server", hi: "Root server ko bheji gayi har query ke liye" },
        { en: "Only for reverse (PTR) lookups", hi: "Sirf reverse (PTR) lookups ke liye" },
        { en: "Only when the client has an IPv6 address", hi: "Sirf jab client ke paas IPv6 address ho" },
      ],
      answer: 0,
      explain: {
        en: "A secondary server copies a whole zone over TCP, and a truncated UDP answer (TC flag) makes the client retry over TCP. Ordinary queries, including those to root servers and PTR lookups, use UDP whatever the IP version.",
        hi: "Secondary server poora zone TCP par copy karta hai, aur truncated UDP answer (TC flag) aane par client TCP par dobara try karta hai. Normal queries, root servers wali aur PTR lookups bhi, IP version kuch bhi ho, UDP use karti hain.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "4C6eeQes4cs",
      title: "Free CCNA | DNS | Day 38",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "DNS basics, Wireshark captures of queries, and DNS configuration on Cisco IOS.", hi: "DNS basics, queries ke Wireshark captures, aur Cisco IOS par DNS configuration." },
    },
    {
      id: "7D_FapNrRUM",
      title: "Free CCNA | DNS | Day 38 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The matching Packet Tracer lab: practise the DNS settings on Cisco routers and hosts.", hi: "Iska Packet Tracer lab: Cisco routers aur hosts par DNS settings practice karo." },
    },
    {
      id: "B8Yd4znj29w",
      title: "8. Basics of IP Routing | What is DNS | How DNS Works",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "How a lookup moves through the DNS hierarchy, in Hindi.", hi: "Lookup DNS hierarchy mein kaise chalta hai, Hindi mein." },
    },
    {
      id: "B_ul0VAW_jQ",
      title: "171. CCNA 200-301 Full Course in Hindi 2024 | DNS Server - Domain Name System",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "A longer DNS episode (about 40 minutes) from Network Nuggets' CCNA 200-301 course, in Hindi. Watch it after the short video above.", hi: "Network Nuggets ke CCNA 200-301 course ka DNS par lamba episode (lagbhag 40 minute), Hindi mein. Upar wale chhote video ke baad dekho." },
    },
  ],
  lab: {
    title: { en: "Build and test DNS in Packet Tracer", hi: "Packet Tracer mein DNS banao aur test karo" },
    steps: [
      {
        en: "On the 192.168.10.0/24 LAN add a Server-PT at 192.168.10.5 for DNS and another at 192.168.10.6 for web. Turn on the DNS service on .5 and add `www.example.com` A 192.168.10.6 and a CNAME `web.example.com` → `www.example.com`.",
        hi: "192.168.10.0/24 LAN par ek Server-PT 192.168.10.5 par DNS ke liye aur ek 192.168.10.6 par web ke liye lagao. .5 par DNS service on karo aur `www.example.com` A 192.168.10.6 aur ek CNAME `web.example.com` → `www.example.com` add karo.",
      },
      {
        en: "Set PC1's DNS server to 192.168.10.5, either by hand or with `dns-server 192.168.10.5` in the DHCP pool from lesson 4.1.",
        hi: "PC1 ka DNS server 192.168.10.5 set karo, haath se ya lesson 4.1 wale DHCP pool mein `dns-server 192.168.10.5` daal kar.",
      },
      {
        en: "In Simulation mode, filter on DNS and open www.example.com in PC1's web browser. Open the query and the reply and find UDP port 53.",
        hi: "Simulation mode mein DNS filter lagao aur PC1 ke web browser mein www.example.com kholo. Query aur reply kholo aur UDP port 53 dhoondho.",
      },
      {
        en: "From PC1's command prompt run `nslookup web.example.com` and note how the alias leads to the A record.",
        hi: "PC1 ke command prompt se `nslookup web.example.com` chalao aur dekho alias kaise A record tak le jaata hai.",
      },
      {
        en: "On R1 configure `ip name-server 192.168.10.5` and `ping www.example.com`. Then add `no ip domain lookup` and try again. What changed? (Packet Tracer and older IOS images may need the hyphenated form, `no ip domain-lookup`.)",
        hi: "R1 par `ip name-server 192.168.10.5` configure karo aur `ping www.example.com` karo. Phir `no ip domain lookup` lagao aur dobara try karo. Kya badla? (Packet Tracer aur purane IOS images mein shayad hyphen wala form, `no ip domain-lookup`, chahiye.)",
      },
    ],
  },
};

export default lesson;
