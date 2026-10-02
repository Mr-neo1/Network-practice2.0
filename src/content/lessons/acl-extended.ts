import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "acl-extended",
  intro: {
    en: "A standard ACL can only say \"this source yes, that source no\". Real policies are more specific: users may open the intranet site over HTTPS and query the DNS server, but must not ping or SSH to the servers, and only the admin PC may manage them. Extended ACLs match the protocol, source, destination and port numbers, so one list can express exactly that, and because they are so precise you can drop unwanted traffic the moment it enters the network.",
    hi: "Standard ACL sirf itna bol sakti hai: \"yeh source haan, woh source nahi\". Asli policies zyada specific hoti hain: users intranet site HTTPS par khol sakte hain aur DNS server se query kar sakte hain, lekin servers ko ping ya SSH nahi kar sakte, aur unhe manage sirf admin PC kar sakta hai. Extended ACL protocol, source, destination aur port numbers match karti hai, toh ek hi list mein yeh sab exactly likh sakte ho, aur itni precise hone ki wajah se unwanted traffic network mein ghuste hi drop kar sakte ho.",
  },
  outcomes: [
    { en: "Write extended ACEs that match protocol, source, destination and TCP or UDP ports", hi: "Protocol, source, destination aur TCP ya UDP ports match karne wali extended ACEs likh sako" },
    { en: "Use the operators eq, neq, gt, lt and range, and common port keywords", hi: "eq, neq, gt, lt aur range operators aur common port keywords use kar sako" },
    { en: "Order entries so specific rules come before general ones, and end with the right final permit", hi: "Entries ko aise order kar sako ki specific rules general se pehle aayein, aur end mein sahi final permit ho" },
    { en: "Place an extended ACL close to the source and choose in or out correctly", hi: "Extended ACL ko source ke paas lagao aur in ya out sahi chuno" },
    { en: "Verify with show ip access-lists and fix the common mistakes", hi: "show ip access-lists se verify karo aur common mistakes fix kar sako" },
  ],
  sections: [
    {
      id: "why-extended",
      heading: { en: "What an extended ACL can see", hi: "Extended ACL kya kya dekh sakti hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Everything from the standard ACL lesson still applies: top-down processing, first match wins, wildcard masks, `host` and `any`, sequence numbers, and an implicit deny at the end. What changes is how much of the packet an entry can look at.",
            hi: "Standard ACL lesson ki saari baatein yahan bhi lagti hain: top-down processing, first match jeetta hai, wildcard masks, `host` aur `any`, sequence numbers, aur end mein implicit deny. Badalta yeh hai ki ek entry packet ka kitna hissa dekh sakti hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Fields an extended ACE can match", hi: "Extended ACE kaunse fields match kar sakti hai" },
          columns: [{ en: "Field", hi: "Field" }, { en: "Where it comes from", hi: "Kahan se aata hai" }, { en: "Example", hi: "Example" }],
          rows: [
            [{ en: "Protocol", hi: "Protocol" }, { en: "IPv4 header, Protocol field", hi: "IPv4 header ka Protocol field" }, "tcp, udp, icmp, ip"],
            [{ en: "Source address", hi: "Source address" }, { en: "IPv4 header", hi: "IPv4 header" }, "192.168.10.0 0.0.0.255"],
            [{ en: "Destination address", hi: "Destination address" }, { en: "IPv4 header", hi: "IPv4 header" }, "host 10.1.1.100"],
            [{ en: "Source port", hi: "Source port" }, { en: "TCP or UDP header", hi: "TCP ya UDP header" }, { en: "rarely used", hi: "kam use hota hai" }],
            [{ en: "Destination port", hi: "Destination port" }, { en: "TCP or UDP header", hi: "TCP ya UDP header" }, "eq 443"],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "Numbered extended ACLs use **100-199** and **2000-2699**. Named ones are created with `ip access-list extended NAME` and edited at the `R1(config-ext-nacl)#` prompt.",
              hi: "Numbered extended ACLs **100-199** aur **2000-2699** use karti hain. Named ACL `ip access-list extended NAME` se banti hai aur `R1(config-ext-nacl)#` prompt par edit hoti hai.",
            },
            {
              en: "The implicit last line of an extended ACL is `deny ip any any`: every IPv4 packet that no entry matched is dropped.",
              hi: "Extended ACL ki implicit last line `deny ip any any` hoti hai: jis IPv4 packet ko kisi entry ne match nahi kiya, woh drop.",
            },
          ],
        },
      ],
    },
    {
      id: "syntax",
      heading: { en: "Reading and writing an extended entry", hi: "Extended entry padhna aur likhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The order of the parts is fixed: action, protocol, source, optional source port, destination, optional destination port.",
            hi: "Parts ka order fixed hai: action, protocol, source, optional source port, destination, optional destination port.",
          },
        },
        {
          type: "table",
          caption: { en: "One entry, part by part: permit tcp 192.168.10.0 0.0.0.255 host 10.1.1.100 eq 443", hi: "Ek entry, hissa-hissa karke: permit tcp 192.168.10.0 0.0.0.255 host 10.1.1.100 eq 443" },
          columns: [{ en: "Part", hi: "Part" }, { en: "Value", hi: "Value" }, { en: "Meaning", hi: "Matlab" }],
          rows: [
            [{ en: "Action", hi: "Action" }, "permit", { en: "Forward the packet if everything else matches", hi: "Baaki sab match ho toh packet forward karo" }],
            [{ en: "Protocol", hi: "Protocol" }, "tcp", { en: "Only TCP segments", hi: "Sirf TCP segments" }],
            [{ en: "Source", hi: "Source" }, "192.168.10.0 0.0.0.255", { en: "Any host in 192.168.10.0/24", hi: "192.168.10.0/24 ka koi bhi host" }],
            [{ en: "Destination", hi: "Destination" }, "host 10.1.1.100", { en: "Only WEB1", hi: "Sirf WEB1" }],
            [{ en: "Destination port", hi: "Destination port" }, "eq 443", { en: "Port 443 (HTTPS) on WEB1", hi: "WEB1 par port 443 (HTTPS)" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Where you write the port decides which port it is", hi: "Port kahan likha hai, usi se decide hota hai kaunsa port hai" },
          text: {
            en: "A port written **after the source** matches the source port; **after the destination** it matches the destination port. `permit tcp 192.168.10.0 0.0.0.255 eq 443 host 10.1.1.100` looks almost the same but matches packets sent **from** port 443, which a browser never uses.",
            hi: "**Source ke baad** likha port source port match karta hai; **destination ke baad** likha port destination port. `permit tcp 192.168.10.0 0.0.0.255 eq 443 host 10.1.1.100` dikhne mein lagbhag same hai, lekin yeh port 443 **se** bheje gaye packets match karta hai, jo browser kabhi use nahi karta.",
          },
        },
        {
          type: "table",
          caption: { en: "Protocols and port operators", hi: "Protocols aur port operators" },
          columns: [{ en: "Keyword", hi: "Keyword" }, { en: "Matches", hi: "Kya match karta hai" }],
          rows: [
            ["ip", { en: "Every IPv4 packet, whatever it carries. No ports allowed.", hi: "Har IPv4 packet, andar kuch bhi ho. Ports nahi de sakte." }],
            ["tcp / udp", { en: "TCP or UDP only. The only protocols that take port operators.", hi: "Sirf TCP ya UDP. Port operators sirf inhi ke saath chalte hain." }],
            ["icmp", { en: "ICMP; you can add a type such as `echo` (ping request)", hi: "ICMP; saath mein type de sakte ho jaise `echo` (ping request)" }],
            ["eq 23 / neq 23", { en: "Port equal to 23 / any port except 23", hi: "Port 23 ke barabar / 23 ke alawa koi bhi port" }],
            ["gt 1023 / lt 1024", { en: "Port greater than 1023 / less than 1024", hi: "Port 1023 se bada / 1024 se chhota" }],
            ["range 20 21", { en: "Ports 20 to 21 inclusive", hi: "Port 20 se 21 tak, dono shaamil" }],
          ],
        },
        {
          type: "table",
          caption: { en: "Port keywords IOS accepts (and shows in its output)", hi: "Port keywords jo IOS accept karta hai (aur output mein dikhata hai)" },
          columns: [{ en: "Keyword", hi: "Keyword" }, { en: "Port", hi: "Port" }, { en: "Protocol", hi: "Protocol" }],
          rows: [
            ["ftp", "21", "TCP"],
            ["telnet", "23", "TCP"],
            ["smtp", "25", "TCP"],
            ["domain", "53", "UDP and TCP"],
            ["www", "80", "TCP"],
            ["bootps / tftp / snmp", "67 / 69 / 161", "UDP"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Numbers always work", hi: "Numbers hamesha chalte hain" },
          text: {
            en: "Type `eq 22` for SSH and `eq 443` for HTTPS; on most IOS versions they have no keyword. If you type a number that has a keyword, such as `eq 80`, IOS stores and shows it as `eq www`.",
            hi: "SSH ke liye `eq 22` aur HTTPS ke liye `eq 443` likho; zyadatar IOS versions mein inka keyword nahi hota. Agar tum aisa number likhte ho jiska keyword hai, jaise `eq 80`, toh IOS use `eq www` ke roop mein store karta aur dikhata hai.",
          },
        },
      ],
    },
    {
      id: "build-the-policy",
      heading: { en: "Building a policy: order matters", hi: "Policy banana: order zaroori hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The example network: users in `192.168.10.0/24` sit behind R1 Gi0/0. ADMIN is `192.168.10.5`. R1 reaches the internet on Gi0/2 and R2 over a WAN link on Gi0/1; behind R2 is the server LAN `10.1.1.0/24` with WEB1 `10.1.1.100` and DNS1 `10.1.1.53`. Policy: users get HTTPS to WEB1 and DNS to DNS1, only ADMIN gets SSH to the servers, nothing else from users reaches the server LAN, and internet access stays open.",
            hi: "Example network: users `192.168.10.0/24` mein R1 ke Gi0/0 ke peeche hain. ADMIN `192.168.10.5` hai. R1 Gi0/2 se internet tak aur Gi0/1 wale WAN link se R2 tak pahunchta hai; R2 ke peeche server LAN `10.1.1.0/24` hai jisme WEB1 `10.1.1.100` aur DNS1 `10.1.1.53` hain. Policy: users ko WEB1 par HTTPS aur DNS1 par DNS milega, servers par SSH sirf ADMIN ko, users ka baaki koi traffic server LAN tak nahi jaayega, aur internet access khula rahega.",
          },
        },
        {
          type: "cli",
          title: { en: "Named extended ACL USERS-IN on R1", hi: "R1 par named extended ACL USERS-IN" },
          lines: [
            { prompt: "R1(config)#", cmd: "ip access-list extended USERS-IN" },
            { prompt: "R1(config-ext-nacl)#", cmd: "remark Users: HTTPS to WEB1, DNS to DNS1, SSH only from ADMIN", comment: { en: "Notes for the next engineer; visible only in the running config", hi: "Agle engineer ke liye note; sirf running config mein dikhta hai" } },
            { prompt: "R1(config-ext-nacl)#", cmd: "permit tcp 192.168.10.0 0.0.0.255 host 10.1.1.100 eq 443", comment: { en: "Becomes line 10", hi: "Line 10 banti hai" } },
            { prompt: "R1(config-ext-nacl)#", cmd: "permit udp 192.168.10.0 0.0.0.255 host 10.1.1.53 eq domain", comment: { en: "20: DNS queries", hi: "20: DNS queries" } },
            { prompt: "R1(config-ext-nacl)#", cmd: "permit tcp host 192.168.10.5 10.1.1.0 0.0.0.255 eq 22", comment: { en: "30: the exception, above the general deny", hi: "30: exception, general deny ke upar" } },
            { prompt: "R1(config-ext-nacl)#", cmd: "deny ip 192.168.10.0 0.0.0.255 10.1.1.0 0.0.0.255", comment: { en: "40: everything else from users to servers", hi: "40: users se servers ka baaki sab" } },
            { prompt: "R1(config-ext-nacl)#", cmd: "permit ip any any", comment: { en: "50: keep the internet working", hi: "50: internet chalta rahe" } },
            { prompt: "R1(config-ext-nacl)#", cmd: "interface GigabitEthernet0/0" },
            { prompt: "R1(config-if)#", cmd: "ip access-group USERS-IN in", comment: { en: "Inbound on the users' interface", hi: "Users wale interface par inbound" } },
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**Specific before general.** Line 30 permits one host; line 40 denies the subnet it belongs to. Swap them and ADMIN's SSH hits the deny first.",
              hi: "**Specific pehle, general baad mein.** Line 30 ek host ko permit karti hai; line 40 us host ke poore subnet ko deny karti hai. Dono ko ulta karo toh ADMIN ka SSH pehle deny se takrayega.",
            },
            {
              en: "**Ping and SSH from users are blocked by line 40**, not by lines of their own. One broad deny after the permits covers everything you did not allow.",
              hi: "**Users ka ping aur SSH line 40 se block hota hai**, unki apni koi alag line nahi hai. Permits ke baad ek broad deny woh sab cover kar leta hai jo tumne allow nahi kiya.",
            },
            {
              en: "**The final `permit ip any any`** decides whether the ACL is a block list or an allow list. Without it, users lose the internet too, because the implicit deny catches it.",
              hi: "**Last wali `permit ip any any`** decide karti hai ki ACL block list hai ya allow list. Iske bina users ka internet bhi chala jaayega, kyunki implicit deny use pakad lega.",
            },
          ],
        },
      ],
    },
    {
      id: "common-tasks",
      heading: { en: "Three everyday tasks", hi: "Teen roz ke kaam" },
      blocks: [
        {
          type: "table",
          caption: { en: "Apply each ACL inbound on the interface where that traffic enters the router, close to its source", hi: "Har ACL us interface par inbound lagao jahan se woh traffic router mein aata hai, yaani source ke paas" },
          columns: [{ en: "Task", hi: "Task" }, { en: "Entries, in order", hi: "Entries, order mein" }],
          rows: [
            [
              { en: "Block Telnet from 192.168.20.0/24 to anywhere", hi: "192.168.20.0/24 se kahin bhi Telnet block karo" },
              "access-list 110 deny tcp 192.168.20.0 0.0.0.255 any eq telnet / access-list 110 permit ip any any",
            ],
            [
              { en: "Allow web to 10.1.1.100 but block ping to it", hi: "10.1.1.100 par web allow, lekin us par ping block" },
              "deny icmp any host 10.1.1.100 echo / permit ip any any",
            ],
            [
              { en: "Users may use only the internal DNS server", hi: "Users sirf internal DNS server use kar sakein" },
              "permit udp 192.168.10.0 0.0.0.255 host 10.1.1.53 eq domain / deny udp 192.168.10.0 0.0.0.255 any eq domain / permit ip any any",
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Notice the pattern: the permits and denies you care about, then a final line that decides what happens to everything else. The second task needs no web permit, because the final `permit ip any any` already lets web through; you add explicit permits only for traffic that would otherwise hit a deny. `deny icmp ... echo` blocks only ping requests, so other ICMP messages, such as unreachables, still pass.",
            hi: "Pattern dekho: pehle woh permits aur denies jinki tumhe parwah hai, phir ek last line jo decide karti hai ki baaki sab ka kya hoga. Doosre task mein web ke liye alag permit nahi chahiye, kyunki last wali `permit ip any any` web ko already jaane deti hai; explicit permit sirf us traffic ke liye likhte ho jo warna kisi deny se takra jaata. `deny icmp ... echo` sirf ping requests block karta hai, toh baaki ICMP messages, jaise unreachables, phir bhi pass hote hain.",
          },
        },
      ],
    },
    {
      id: "placement-and-direction",
      heading: { en: "Close to the source, and in or out", hi: "Source ke paas, aur in ya out" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An extended ACL names the destination, so placing it near the source does not block the source from other places. That makes the best spot **as close to the source as possible**: a denied packet is dropped before it crosses the WAN link, loads R2 or reaches the server LAN.",
            hi: "Extended ACL destination ka naam leti hai, toh use source ke paas lagane se source baaki jagahon se block nahi hota. Isliye best jagah **source ke jitna paas ho sake** hai: deny hone wala packet WAN link cross karne, R2 par load daalne ya server LAN tak pahunchne se pehle hi drop ho jaata hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Direction is always from the router's point of view. User packets **arrive** on R1 Gi0/0, so USERS-IN goes on Gi0/0 **in**. The same entries applied **out** on Gi0/0 would see only packets going **to** the users, whose source is never 192.168.10.0/24.",
            hi: "Direction hamesha router ke point of view se hoti hai. User packets R1 ke Gi0/0 par **aate** hain, isliye USERS-IN Gi0/0 par **in** lagegi. Wahi entries Gi0/0 par **out** lagao toh woh sirf users **ki taraf jaane wale** packets dekhengi, jinka source kabhi 192.168.10.0/24 nahi hota.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "ACLs do not remember connections", hi: "ACL connections yaad nahi rakhti" },
          text: {
            en: "An ACL judges each packet alone. USERS-IN works without extra lines because WEB1's replies enter R1 on Gi0/1 and leave on Gi0/0 outbound, where nothing is applied. If you also filter the return direction, you must permit the replies yourself. Stateful firewalls track sessions and do this for you.",
            hi: "ACL har packet ko akele judge karti hai. USERS-IN bina extra lines ke isliye chalti hai kyunki WEB1 ke replies R1 par Gi0/1 se aate hain aur Gi0/0 se outbound nikalte hain, jahan kuch apply nahi hai. Agar return direction bhi filter karoge, toh replies tumhe khud permit karne padenge. Stateful firewalls sessions track karke yeh kaam khud karte hain.",
          },
        },
      ],
    },
    {
      id: "verify-and-troubleshoot",
      heading: { en: "Verify and troubleshoot", hi: "Verify aur troubleshoot" },
      blocks: [
        {
          type: "cli",
          title: { en: "Counters after some user traffic", hi: "Kuch user traffic ke baad counters" },
          lines: [
            { prompt: "R1#", cmd: "show ip access-lists USERS-IN" },
            { out: "Extended IP access list USERS-IN" },
            { out: "    10 permit tcp 192.168.10.0 0.0.0.255 host 10.1.1.100 eq 443 (112 matches)" },
            { out: "    20 permit udp 192.168.10.0 0.0.0.255 host 10.1.1.53 eq domain (24 matches)" },
            { out: "    30 permit tcp host 192.168.10.5 10.1.1.0 0.0.0.255 eq 22 (36 matches)" },
            { out: "    40 deny ip 192.168.10.0 0.0.0.255 10.1.1.0 0.0.0.255 (9 matches)", comment: { en: "Blocked pings and SSH from users", hi: "Users ke block hue pings aur SSH" } },
            { out: "    50 permit ip any any (481 matches)" },
            { prompt: "R1#", cmd: "show ip interface GigabitEthernet0/0 | include access list" },
            { out: "  Outgoing access list is not set" },
            { out: "  Inbound  access list is USERS-IN" },
          ],
          note: {
            en: "Counters count packets, not connections, and the remark does not appear here. `show ip access-lists` lists only IPv4 ACLs; `show access-lists` lists all of them. Depending on the IOS version, `show ip interface` may print extra \"Common access list\" lines.",
            hi: "Counters packets count karte hain, connections nahi, aur remark yahan nahi dikhta. `show ip access-lists` sirf IPv4 ACLs dikhata hai; `show access-lists` saari. IOS version ke hisaab se `show ip interface` mein extra \"Common access list\" lines bhi aa sakti hain.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "Something that should pass is blocked? Find which line's counter rises when you test. If none rises, the packet is reaching the implicit deny.",
              hi: "Jo pass hona chahiye woh block ho raha hai? Test karte waqt dekho kis line ka counter badhta hai. Koi nahi badha, toh packet implicit deny tak pahunch raha hai.",
            },
            {
              en: "Read the failing entry left to right against the packet: protocol, source, source port, destination, destination port. Swapped source and destination are a common cause.",
              hi: "Fail hone wali entry ko packet ke saath left se right padho: protocol, source, source port, destination, destination port. Source aur destination ka ulta hona common wajah hai.",
            },
            {
              en: "Check the interface and direction with `show ip interface`, then fix single lines with sequence numbers, as in the standard ACL lesson.",
              hi: "`show ip interface` se interface aur direction check karo, phir standard ACL lesson ki tarah sequence numbers se single lines fix karo.",
            },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Extended ACL", def: { en: "An IPv4 ACL that matches protocol, source, destination and ports; numbered 100-199 and 2000-2699.", hi: "IPv4 ACL jo protocol, source, destination aur ports match karti hai; numbers 100-199 aur 2000-2699." } },
    { term: "Port operator", def: { en: "eq, neq, gt, lt or range: how an ACE compares a TCP or UDP port.", hi: "eq, neq, gt, lt ya range: ACE TCP ya UDP port ko kaise compare karti hai." } },
    { term: "ip (protocol keyword)", def: { en: "Matches every IPv4 packet regardless of what it carries; cannot take ports.", hi: "Har IPv4 packet match karta hai, andar kuch bhi ho; ports nahi le sakta." } },
    { term: "remark", def: { en: "A comment line inside an ACL, kept in the running config and ignored when matching.", hi: "ACL ke andar comment line, running config mein rehti hai aur matching mein ignore hoti hai." } },
    { term: "permit ip any any", def: { en: "A final entry that lets through everything not matched earlier, overriding the implicit deny.", hi: "Last entry jo pehle match na hua sab kuch jaane deti hai, implicit deny ko override karke." } },
    { term: "Stateless filtering", def: { en: "Judging each packet on its own fields, with no memory of the connection it belongs to.", hi: "Har packet ko uske apne fields se judge karna, us connection ki koi memory ke bina." } },
  ],
  commands: [
    { cmd: "ip access-list extended USERS-IN", mode: "Global configuration", does: { en: "Create or edit a named extended ACL", hi: "Named extended ACL banata ya edit karta hai" } },
    { cmd: "remark TEXT", mode: "Extended ACL configuration", does: { en: "Add a comment line to the ACL", hi: "ACL mein comment line add karta hai" } },
    { cmd: "permit tcp 192.168.10.0 0.0.0.255 host 10.1.1.100 eq 443", mode: "Extended ACL configuration", does: { en: "Permit HTTPS from the user subnet to WEB1", hi: "User subnet se WEB1 tak HTTPS permit karta hai" } },
    { cmd: "deny icmp any host 10.1.1.100 echo", mode: "Extended ACL configuration", does: { en: "Deny ping requests to one host", hi: "Ek host ki taraf ping requests deny karta hai" } },
    { cmd: "access-list 110 deny tcp 192.168.20.0 0.0.0.255 any eq telnet", mode: "Global configuration", does: { en: "Add an entry to numbered extended ACL 110", hi: "Numbered extended ACL 110 mein entry add karta hai" } },
    { cmd: "ip access-group USERS-IN in", mode: "Interface configuration", does: { en: "Apply the ACL to packets arriving on this interface", hi: "Is interface par aane wale packets par ACL lagata hai" } },
    { cmd: "show ip access-lists", mode: "Privileged EXEC", does: { en: "Show IPv4 ACLs with sequence numbers and match counters", hi: "IPv4 ACLs ko sequence numbers aur match counters ke saath dikhata hai" } },
    { cmd: "show ip interface GigabitEthernet0/0", mode: "Privileged EXEC", does: { en: "Show which ACL is applied in and out", hi: "Dikhata hai kaunsi ACL in aur out lagi hai" } },
  ],
  mistakes: [
    {
      en: "Applying the ACL in the wrong direction. Think from the router: traffic from the users **enters** the user-facing interface, so an ACL that matches user sources goes there **in**.",
      hi: "ACL ko galat direction mein lagana. Router ki nazar se socho: users ka traffic user wale interface par **andar aata** hai, toh user sources match karne wali ACL wahan **in** lagti hai.",
    },
    {
      en: "Swapping source and destination. `permit tcp host 10.1.1.100 192.168.10.0 0.0.0.255 eq 443` matches packets from the server to the users, not the users' requests.",
      hi: "Source aur destination ulta likhna. `permit tcp host 10.1.1.100 192.168.10.0 0.0.0.255 eq 443` server se users ki taraf ke packets match karta hai, users ki requests nahi.",
    },
    {
      en: "Writing the port after the source when you meant the destination port. The client's source port is random; the service port is the destination.",
      hi: "Destination port likhna tha lekin port source ke baad likh dena. Client ka source port random hota hai; service ka port destination hota hai.",
    },
    {
      en: "Forgetting `permit ip any any` at the end of an ACL meant to block a few things. The implicit deny then blocks everything else as well.",
      hi: "Kuch cheezein block karne wali ACL ke end mein `permit ip any any` bhool jaana. Tab implicit deny baaki sab bhi block kar deta hai.",
    },
    {
      en: "Putting a broad deny above a narrow permit. `deny ip 192.168.10.0 0.0.0.255 10.1.1.0 0.0.0.255` above ADMIN's SSH permit blocks ADMIN too.",
      hi: "Broad deny ko narrow permit ke upar rakhna. `deny ip 192.168.10.0 0.0.0.255 10.1.1.0 0.0.0.255` agar ADMIN ke SSH permit ke upar hai toh ADMIN bhi block.",
    },
    {
      en: "Putting an inbound ACL on a router-to-router link without permitting the routing protocol. The implicit deny drops OSPF Hellos and the adjacency goes down.",
      hi: "Router-to-router link par inbound ACL lagana aur routing protocol permit na karna. Implicit deny OSPF Hellos drop kar deta hai aur adjacency down ho jaati hai.",
    },
  ],
  recap: [
    { en: "Extended ACLs match protocol, source, destination and ports: numbered 100-199 and 2000-2699, or named with `ip access-list extended`.", hi: "Extended ACL protocol, source, destination aur ports match karti hai: numbers 100-199 aur 2000-2699, ya `ip access-list extended` se named." },
    { en: "Order: action, protocol, source [port], destination [port]. Ports need tcp or udp; operators are eq, neq, gt, lt, range.", hi: "Order: action, protocol, source [port], destination [port]. Ports ke liye tcp ya udp chahiye; operators eq, neq, gt, lt, range hain." },
    { en: "Put specific entries before general ones, and end with `permit ip any any` unless you really want everything else denied.", hi: "Specific entries general se pehle rakho, aur end mein `permit ip any any` daalo, jab tak tum sach mein baaki sab deny nahi karna chahte." },
    { en: "Place extended ACLs close to the source, usually inbound on the interface facing that source.", hi: "Extended ACL source ke paas lagao, aam taur par us source ki taraf wale interface par inbound." },
    { en: "ACLs are stateless; replies must be allowed in whatever direction you filter.", hi: "ACL stateless hoti hai; jis direction mein filter karo, wahan replies allow karne padte hain." },
    { en: "`show ip access-lists` shows per-line counters; `show ip interface` shows where and in which direction an ACL is applied.", hi: "`show ip access-lists` har line ke counters dikhata hai; `show ip interface` dikhata hai ACL kahan aur kis direction mein lagi hai." },
  ],
  quiz: [
    {
      q: {
        en: "In extended ACL mode you type `permit` followed by one of these. Which one permits HTTPS (TCP 443) from any host to the server 10.1.1.100?",
        hi: "Extended ACL mode mein tum `permit` ke baad inmein se ek likhte ho. Kaunsa kisi bhi host se server 10.1.1.100 tak HTTPS (TCP 443) permit karega?",
      },
      options: [
        { en: "tcp any eq 443 host 10.1.1.100", hi: "tcp any eq 443 host 10.1.1.100" },
        { en: "tcp any host 10.1.1.100 eq 443", hi: "tcp any host 10.1.1.100 eq 443" },
        { en: "ip any host 10.1.1.100 eq 443", hi: "ip any host 10.1.1.100 eq 443" },
        { en: "tcp host 10.1.1.100 any eq 443", hi: "tcp host 10.1.1.100 any eq 443" },
      ],
      answer: 1,
      explain: {
        en: "443 is the server's port, so it goes after the destination. The first option matches source port 443, which a browser never uses. The `ip` keyword cannot take ports, and the last option has source and destination swapped: it matches packets from the server.",
        hi: "443 server ka port hai, isliye destination ke baad aata hai. Pehla option source port 443 match karta hai, jo browser kabhi use nahi karta. `ip` keyword ke saath ports nahi chalte, aur aakhri option mein source aur destination ulte hain: woh server se aane wale packets match karta hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "Why should an extended ACL be placed close to the source of the traffic it filters?",
        hi: "Extended ACL ko jis traffic ko filter karti hai uske source ke paas kyun lagana chahiye?",
      },
      options: [
        { en: "Extended ACLs can only be applied inbound", hi: "Extended ACLs sirf inbound apply ho sakti hain" },
        { en: "Extended ACLs cannot match destination addresses", hi: "Extended ACLs destination address match nahi kar sakti" },
        { en: "Routers near the destination do not support extended ACLs", hi: "Destination ke paas wale routers extended ACLs support nahi karte" },
        { en: "Denied packets are dropped before they use bandwidth, and the destination match keeps other traffic unaffected", hi: "Deny hone wale packets bandwidth use karne se pehle drop ho jaate hain, aur destination match baaki traffic ko affect nahi hone deta" },
      ],
      answer: 3,
      explain: {
        en: "Because an extended ACL names the destination, it can sit near the source without blocking that source from everywhere else, and unwanted packets never cross the rest of the network. Extended ACLs work in both directions on any router.",
        hi: "Extended ACL destination ka naam leti hai, isliye source ke paas lagne par bhi woh source ko baaki jagahon se block nahi karti, aur unwanted packets baaki network cross hi nahi karte. Extended ACLs kisi bhi router par dono directions mein kaam karti hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "ACL 120 has a single entry, `deny icmp any host 10.1.1.100 echo`, and is applied in on the users' interface. A user opens https://10.1.1.100. What happens?",
        hi: "ACL 120 mein ek hi entry hai, `deny icmp any host 10.1.1.100 echo`, aur yeh users ke interface par in lagi hai. Ek user https://10.1.1.100 kholta hai. Kya hoga?",
      },
      options: [
        { en: "The traffic is dropped by the implicit deny", hi: "Traffic implicit deny se drop hoga" },
        { en: "It is permitted, because the ACL only mentions ICMP", hi: "Permit hoga, kyunki ACL sirf ICMP ki baat karti hai" },
        { en: "It is permitted, but the server's replies are dropped", hi: "Permit hoga, lekin server ke replies drop honge" },
        { en: "It is dropped by the ICMP entry, because it names host 10.1.1.100", hi: "ICMP entry se drop hoga, kyunki usme host 10.1.1.100 likha hai" },
      ],
      answer: 0,
      explain: {
        en: "The HTTPS packet is TCP, so the ICMP entry does not match. Nothing else does, and the implicit `deny ip any any` drops it. The fix is a final `permit ip any any`.",
        hi: "HTTPS packet TCP hai, toh ICMP entry match nahi karti. Aur koi entry hai nahi, toh implicit `deny ip any any` use drop kar deta hai. Fix: end mein `permit ip any any`.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "An ACL reads: 10 `deny ip 192.168.10.0 0.0.0.255 10.1.1.0 0.0.0.255`, 20 `permit tcp host 192.168.10.5 10.1.1.0 0.0.0.255 eq 22`, 30 `permit ip any any`. What happens when 192.168.10.5 opens SSH to 10.1.1.100?",
        hi: "Ek ACL mein hai: 10 `deny ip 192.168.10.0 0.0.0.255 10.1.1.0 0.0.0.255`, 20 `permit tcp host 192.168.10.5 10.1.1.0 0.0.0.255 eq 22`, 30 `permit ip any any`. Jab 192.168.10.5, 10.1.1.100 par SSH kholta hai toh kya hota hai?",
      },
      options: [
        { en: "Permitted by line 20, the more specific entry", hi: "Line 20 se permit, kyunki woh zyada specific hai" },
        { en: "Permitted by line 30", hi: "Line 30 se permit" },
        { en: "Denied by line 10", hi: "Line 10 se deny" },
        { en: "Denied by the implicit deny", hi: "Implicit deny se deny" },
      ],
      answer: 2,
      explain: {
        en: "192.168.10.5 is inside 192.168.10.0/24 and 10.1.1.100 is inside 10.1.1.0/24, and `ip` matches TCP too. Line 10 is the first match, so the packet is denied and line 20 is never read. Move the host permit above the subnet deny.",
        hi: "192.168.10.5, 192.168.10.0/24 ke andar hai aur 10.1.1.100, 10.1.1.0/24 ke andar, aur `ip` TCP ko bhi match karta hai. Line 10 pehla match hai, toh packet deny ho jaata hai aur line 20 padhi hi nahi jaati. Host permit ko subnet deny ke upar le jao.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "R1 has USERS-IN from this lesson inbound on Gi0/0. PC1 (192.168.10.10) runs `ping 10.1.1.53`, which sends four echo requests. Which counter in `show ip access-lists` changes?",
        hi: "R1 par is lesson wali USERS-IN Gi0/0 par inbound lagi hai. PC1 (192.168.10.10) `ping 10.1.1.53` chalata hai, jo chaar echo requests bhejta hai. `show ip access-lists` mein kaunsa counter badlega?",
      },
      options: [
        { en: "Line 20 (permit udp ... eq domain) goes up by 4", hi: "Line 20 (permit udp ... eq domain) 4 se badhega" },
        { en: "Line 40 (deny ip ... 10.1.1.0 0.0.0.255) goes up by 4", hi: "Line 40 (deny ip ... 10.1.1.0 0.0.0.255) 4 se badhega" },
        { en: "Line 50 (permit ip any any) goes up by 4", hi: "Line 50 (permit ip any any) 4 se badhega" },
        { en: "None; the implicit deny drops them", hi: "Koi nahi; implicit deny unhe drop karta hai" },
      ],
      answer: 1,
      explain: {
        en: "ICMP does not match line 20 (UDP) or lines 10 and 30 (TCP). Line 40 matches any IP packet from the user subnet to 10.1.1.0/24, so each echo request is denied there and counted: 4 matches. Line 50 is never reached.",
        hi: "ICMP line 20 (UDP) ya lines 10 aur 30 (TCP) se match nahi karta. Line 40 user subnet se 10.1.1.0/24 tak ka koi bhi IP packet match karti hai, toh har echo request wahin deny aur count hoti hai: 4 matches. Line 50 tak baat pahunchti hi nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "An engineer applies USERS-IN with `ip access-group USERS-IN out` on Gi0/0, the interface facing the users, instead of in. What is the effect?",
        hi: "Ek engineer USERS-IN ko users wale interface Gi0/0 par in ki jagah `ip access-group USERS-IN out` se laga deta hai. Iska kya effect hoga?",
      },
      options: [
        { en: "The same as applying it inbound", hi: "Wahi jo inbound lagane par hota" },
        { en: "Users lose all access because of the implicit deny", hi: "Implicit deny ki wajah se users ka saara access chala jaata hai" },
        { en: "IOS rejects the command; extended ACLs must be inbound", hi: "IOS command reject kar deta hai; extended ACLs inbound hi honi chahiye" },
        { en: "Nothing is filtered: packets leaving Gi0/0 never have a user source, so only line 50 matches", hi: "Kuch filter nahi hota: Gi0/0 se nikalne wale packets ka source kabhi user nahi hota, toh sirf line 50 match karti hai" },
      ],
      answer: 3,
      explain: {
        en: "Outbound on Gi0/0 the ACL sees packets going to the users, sourced from servers or the internet. Lines 10 to 40 all require a 192.168.10.0/24 source and never match, and `permit ip any any` passes everything. The policy is silently not enforced.",
        hi: "Gi0/0 par outbound, ACL users ki taraf jaane wale packets dekhti hai, jinka source servers ya internet hai. Lines 10 se 40 sab ko 192.168.10.0/24 source chahiye, toh woh kabhi match nahi karti, aur `permit ip any any` sab pass kar deti hai. Policy chupchaap enforce hi nahi hoti.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "dUttKY_CNXE",
      title: "Free CCNA | Extended ACLs | Day 35",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Extended ACL syntax, ports and placement, with worked examples.", hi: "Extended ACL syntax, ports aur placement, worked examples ke saath." },
    },
    {
      id: "1cuMzWBrEYs",
      title: "Free CCNA | Extended ACLs | Day 35 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Packet Tracer lab: write, apply and test extended ACLs.", hi: "Packet Tracer lab: extended ACLs likhna, apply karna aur test karna." },
    },
    {
      id: "wn25TQYd1X0",
      title: "131. Free CCNA (NEW) | Network Security - Extended ACL",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walkthrough of extended ACL syntax and configuration.", hi: "Extended ACL syntax aur configuration ka Hindi walkthrough." },
    },
  ],
  lab: {
    title: { en: "Filter user traffic with an extended ACL", hi: "Extended ACL se user traffic filter karo" },
    steps: [
      { en: "Build users 192.168.10.0/24 (PC1 .10 and ADMIN .5) on R1 Gi0/0, a link from R1 to R2, and a server LAN 10.1.1.0/24 on R2 with a web server (.100, HTTPS on) and a DNS server (.53). Make sure everything pings first.", hi: "R1 Gi0/0 par users 192.168.10.0/24 (PC1 .10 aur ADMIN .5) banao, R1 se R2 tak ek link, aur R2 par server LAN 10.1.1.0/24 jisme web server (.100, HTTPS on) aur DNS server (.53) ho. Pehle confirm karo ki sab ping ho raha hai." },
      { en: "On R1 create `ip access-list extended USERS-IN` with the five entries from this lesson and a remark, and apply it in on Gi0/0.", hi: "R1 par is lesson ki paanch entries aur ek remark ke saath `ip access-list extended USERS-IN` banao, aur Gi0/0 par in apply karo." },
      { en: "From PC1: open https://10.1.1.100, resolve a name through 10.1.1.53, ping 10.1.1.100 and try SSH to it. Predict each result, then compare with `show ip access-lists`.", hi: "PC1 se: https://10.1.1.100 kholo, 10.1.1.53 se ek naam resolve karo, 10.1.1.100 ping karo aur us par SSH try karo. Har result pehle predict karo, phir `show ip access-lists` se compare karo." },
      { en: "Enable SSH on R2, then from ADMIN SSH to 10.1.1.1, R2's address on the server LAN. Confirm line 30 counts it, and that the same attempt from PC1 is counted by line 40.", hi: "R2 par SSH enable karo, phir ADMIN se 10.1.1.1 par SSH karo, jo server LAN par R2 ka address hai. Confirm karo ki line 30 use count karti hai, aur PC1 se wahi koshish line 40 count karti hai." },
      { en: "Use `ip access-list extended USERS-IN` and `no 50` to remove the final permit. What breaks? Put it back.", hi: "`ip access-list extended USERS-IN` aur `no 50` se last permit hatao. Kya toota? Wapas daal do." },
      { en: "Move the ACL to Gi0/0 out and repeat the tests. Explain why nothing is blocked now.", hi: "ACL ko Gi0/0 out par shift karo aur tests dobara karo. Samjhao ki ab kuch block kyun nahi ho raha." },
    ],
  },
};

export default lesson;
