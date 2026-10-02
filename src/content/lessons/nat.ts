import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "nat",
  intro: {
    en: "Lesson 1.4 showed why private addresses cannot cross the internet and that the router at the edge translates them. This lesson shows exactly how a Cisco router does it: the four address names NAT uses, static NAT for a server that must be reachable from outside, dynamic NAT from a pool, and PAT, which lets a whole office share one public address. You will configure NAT on almost every internet edge you build, and its terminology is a favourite exam topic.",
    hi: "Lesson 1.4 mein dekha tha ki private addresses internet par kyun nahi chal sakte aur edge wala router unhe translate karta hai. Is lesson mein dekhoge ki Cisco router yeh kaam exactly kaise karta hai: NAT ke chaar address names, static NAT us server ke liye jo bahar se reachable hona chahiye, pool se dynamic NAT, aur PAT, jisse poora office ek hi public address share kar leta hai. Lagbhag har internet edge par tum NAT configure karoge, aur iski terminology exam ka favourite topic hai.",
  },
  outcomes: [
    { en: "Name the inside local, inside global, outside local and outside global address of a packet in a NAT diagram", hi: "NAT diagram mein kisi packet ka inside local, inside global, outside local aur outside global address bata sako" },
    { en: "Configure static NAT so an internal server is reachable on a public address", hi: "Static NAT configure kar sako taaki internal server ek public address par reachable ho" },
    { en: "Configure dynamic NAT with a pool and an access list, and predict what happens when the pool runs out", hi: "Pool aur access list ke saath dynamic NAT configure kar sako, aur predict kar sako ki pool khatam hone par kya hoga" },
    { en: "Configure PAT (overload) and explain how port numbers keep many conversations apart on one address", hi: "PAT (overload) configure kar sako aur samjha sako ki ek hi address par port numbers kaise kai conversations ko alag rakhte hain" },
    { en: "Read `show ip nat translations` and `show ip nat statistics` to find and fix NAT faults", hi: "`show ip nat translations` aur `show ip nat statistics` padh kar NAT ke faults dhoondh aur fix kar sako" },
  ],
  sections: [
    {
      id: "what-nat-does",
      heading: { en: "What NAT changes, and why", hi: "NAT kya badalta hai, aur kyun" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**NAT (Network Address Translation)** rewrites the source or destination IP address in a packet's IP header as the packet crosses a router between an **inside** and an **outside** interface. The router writes every rewrite into a **translation table**, so when the reply comes back it can reverse the change and deliver the packet to the right inside host.",
            hi: "**NAT (Network Address Translation)** packet ke IP header mein source ya destination IP address ko rewrite karta hai, jab packet router ke **inside** aur **outside** interface ke beech cross karta hai. Router har rewrite ko ek **translation table** mein likh leta hai, taaki reply wapas aaye toh change ko ulta karke packet sahi inside host tak pahuncha sake.",
          },
        },
        {
          type: "p",
          text: {
            en: "The main reason NAT exists is IPv4 shortage. An office with 200 PCs on `192.168.1.0/24` cannot get 200 public addresses, and private addresses are dropped on the internet. NAT lets those PCs borrow one or a few public addresses at the edge. The example used throughout this lesson is below; the animation uses the same addresses.",
            hi: "NAT ka main reason IPv4 ki kami hai. `192.168.1.0/24` par 200 PCs wale office ko 200 public addresses nahi mil sakte, aur private addresses internet par drop ho jaate hain. NAT in PCs ko edge par ek ya kuch public addresses udhaar lene deta hai. Poore lesson mein neeche wala example use hoga; animation mein bhi yahi addresses hain.",
          },
        },
        {
          type: "table",
          caption: { en: "The example network", hi: "Example network" },
          columns: [{ en: "Device", hi: "Device" }, { en: "Address", hi: "Address" }, { en: "Role", hi: "Role" }],
          rows: [
            ["PC1, PC2", "192.168.1.10, 192.168.1.11", { en: "Inside hosts that browse the web", hi: "Inside hosts jo web browse karte hain" }],
            ["WebSrv", "192.168.1.100", { en: "Inside server that must be reachable from the internet", hi: "Inside server jo internet se reachable hona chahiye" }],
            ["R1 G0/0", "192.168.1.1", { en: "Inside interface (LAN)", hi: "Inside interface (LAN)" }],
            ["R1 G0/1", "203.0.113.1", { en: "Outside interface (ISP). The ISP also gave the office 203.0.113.10 and 203.0.113.20 to .23", hi: "Outside interface (ISP). ISP ne office ko 203.0.113.10 aur 203.0.113.20 se .23 bhi diye hain" }],
            ["Server-X, Client-Y", "198.51.100.80, 198.51.100.50", { en: "Hosts on the internet", hi: "Internet par hosts" }],
          ],
        },
        {
          type: "table",
          caption: { en: "The three kinds of NAT on the CCNA", hi: "CCNA ke teen tarah ke NAT" },
          columns: [{ en: "Type", hi: "Type" }, { en: "Mapping", hi: "Mapping" }, { en: "Typical use", hi: "Typical use" }],
          rows: [
            [{ en: "Static NAT", hi: "Static NAT" }, { en: "One inside address to one public address, permanently", hi: "Ek inside address se ek public address, hamesha ke liye" }, { en: "Publishing a server, such as WebSrv on 203.0.113.10", hi: "Server publish karna, jaise WebSrv ko 203.0.113.10 par" }],
            [{ en: "Dynamic NAT", hi: "Dynamic NAT" }, { en: "One inside address to one address taken from a pool, while in use", hi: "Ek inside address se pool ka ek address, jab tak use ho raha hai" }, { en: "Rare today; you need as many public addresses as active hosts", hi: "Aaj kal kam; jitne active hosts utne public addresses chahiye" }],
            [{ en: "PAT (NAT overload)", hi: "PAT (NAT overload)" }, { en: "Many inside addresses to one public address, kept apart by port numbers", hi: "Kai inside addresses se ek public address, port numbers se alag rakhe jaate hain" }, { en: "Every office and home internet connection", hi: "Har office aur ghar ka internet connection" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "NAT is not a firewall", hi: "NAT firewall nahi hai" },
          text: {
            en: "PAT happens to block connections that start on the outside, because no translation exists for them. That is a side effect, not a security policy. Filtering traffic is the job of ACLs (lessons 5.4 and 5.5) and firewalls.",
            hi: "PAT bahar se shuru hone wale connections ko block kar deta hai, kyunki unke liye koi translation hota hi nahi. Yeh ek side effect hai, security policy nahi. Traffic filter karna ACLs (lesson 5.4 aur 5.5) aur firewalls ka kaam hai.",
          },
        },
      ],
    },
    {
      id: "four-addresses",
      heading: { en: "Inside local, inside global, outside local, outside global", hi: "Inside local, inside global, outside local aur outside global" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Cisco names every address in a NAT conversation with two words. **Inside** or **outside** says which side of the router the host is on. **Local** or **global** says from where you are looking at the address: local is the address as seen on the inside network, global is the address as seen on the outside network.",
            hi: "Cisco NAT conversation ke har address ko do words se naam deta hai. **Inside** ya **outside** batata hai ki host router ki kis side par hai. **Local** ya **global** batata hai ki address ko kahan se dekh rahe ho: local matlab inside network par jo address dikhta hai, global matlab outside network par jo address dikhta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "PC1 browsing to Server-X through R1 (PAT on 203.0.113.1)", hi: "PC1 R1 ke through Server-X browse kar raha hai (203.0.113.1 par PAT)" },
          columns: [{ en: "Term", hi: "Term" }, { en: "Meaning", hi: "Matlab" }, { en: "In this example", hi: "Is example mein" }],
          rows: [
            [{ en: "Inside local", hi: "Inside local" }, { en: "The inside host's address as seen on the inside: its real, usually private, address", hi: "Inside host ka address jaisa inside par dikhta hai: uska asli, aksar private, address" }, "192.168.1.10"],
            [{ en: "Inside global", hi: "Inside global" }, { en: "The inside host's address as seen from the outside, after translation", hi: "Inside host ka address jaisa bahar se dikhta hai, translation ke baad" }, "203.0.113.1"],
            [{ en: "Outside local", hi: "Outside local" }, { en: "The outside host's address as seen from the inside", hi: "Outside host ka address jaisa inside se dikhta hai" }, "198.51.100.80"],
            [{ en: "Outside global", hi: "Outside global" }, { en: "The outside host's address as seen on the outside: its real address", hi: "Outside host ka address jaisa outside par dikhta hai: uska asli address" }, "198.51.100.80"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Follow one packet and the names stop being abstract. PC1 sends a packet with source `192.168.1.10` (inside local) to `198.51.100.80` (outside local). R1 changes the source to `203.0.113.1` (inside global). On the internet the packet now reads source `203.0.113.1`, destination `198.51.100.80` (outside global). The reply travels the same way in reverse.",
            hi: "Ek packet ko follow karo, toh yeh naam abstract nahi lagenge. PC1 source `192.168.1.10` (inside local) se `198.51.100.80` (outside local) ko packet bhejta hai. R1 source ko `203.0.113.1` (inside global) kar deta hai. Internet par packet mein ab source `203.0.113.1` aur destination `198.51.100.80` (outside global) hai. Reply isi raaste ulta aata hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          text: {
            en: "In CCNA scenarios only the inside address is translated, so outside local and outside global are the same address. They differ only when the router also translates outside addresses, which is beyond the CCNA. Expect questions that show a diagram or `show ip nat translations` output and ask you to pick the inside global or inside local address.",
            hi: "CCNA scenarios mein sirf inside address translate hota hai, isliye outside local aur outside global same address hote hain. Yeh tabhi alag hote hain jab router outside addresses ko bhi translate kare, jo CCNA se aage ki baat hai. Aise questions expect karo jisme diagram ya `show ip nat translations` output dikha kar inside global ya inside local address poocha jaaye.",
          },
        },
      ],
    },
    {
      id: "inside-outside",
      heading: { en: "Step one every time: mark inside and outside", hi: "Har baar pehla step: inside aur outside mark karo" },
      blocks: [
        {
          type: "p",
          text: {
            en: "R1 only translates packets that move between an interface marked `ip nat inside` and one marked `ip nat outside`. Every NAT configuration, static, dynamic or PAT, starts here. A router can have several inside interfaces, for example one per VLAN subinterface.",
            hi: "R1 sirf un packets ko translate karta hai jo `ip nat inside` wale interface aur `ip nat outside` wale interface ke beech move karte hain. Har NAT configuration, chahe static ho, dynamic ho ya PAT, yahin se shuru hoti hai. Router par kai inside interfaces ho sakte hain, jaise har VLAN subinterface ke liye ek.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: mark the interfaces", hi: "R1: interfaces mark karna" },
          lines: [
            { prompt: "R1(config)#", cmd: "interface GigabitEthernet0/0" },
            { prompt: "R1(config-if)#", cmd: "ip nat inside", comment: { en: "LAN side, 192.168.1.1", hi: "LAN side, 192.168.1.1" } },
            { prompt: "R1(config-if)#", cmd: "interface GigabitEthernet0/1" },
            { prompt: "R1(config-if)#", cmd: "ip nat outside", comment: { en: "ISP side, 203.0.113.1", hi: "ISP side, 203.0.113.1" } },
            { prompt: "R1(config-if)#", cmd: "exit" },
          ],
          note: {
            en: "NAT does not replace routing. R1 still needs a route to the internet, usually a default route to the ISP (lesson 3.4).",
            hi: "NAT routing ki jagah nahi leta. R1 ko internet tak route phir bhi chahiye, aam taur par ISP ki taraf default route (lesson 3.4).",
          },
        },
      ],
    },
    {
      id: "static-nat",
      heading: { en: "Static NAT: publish an inside server", hi: "Static NAT: inside server ko publish karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "WebSrv lives on `192.168.1.100`, which nobody on the internet can reach. Static NAT ties it permanently to the public address `203.0.113.10`. Because the mapping always exists, it works in both directions: WebSrv's outgoing packets leave with source `203.0.113.10`, and a client on the internet can start a connection to `203.0.113.10` and R1 forwards it to `192.168.1.100`.",
            hi: "WebSrv `192.168.1.100` par hai, jahan internet se koi nahi pahunch sakta. Static NAT ise permanently public address `203.0.113.10` se jod deta hai. Kyunki mapping hamesha rehti hai, yeh dono directions mein kaam karta hai: WebSrv ke outgoing packets source `203.0.113.10` ke saath nikalte hain, aur internet ka koi client `203.0.113.10` par connection shuru kar sakta hai, jise R1 `192.168.1.100` tak forward kar deta hai.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: static NAT for WebSrv", hi: "R1: WebSrv ke liye static NAT" },
          lines: [
            { prompt: "R1(config)#", cmd: "ip nat inside source static 192.168.1.100 203.0.113.10", comment: { en: "inside local first, then inside global", hi: "pehle inside local, phir inside global" } },
            { prompt: "R1(config)#", cmd: "end" },
            { prompt: "R1#", cmd: "show ip nat translations" },
            { out: "Pro Inside global         Inside local          Outside local         Outside global" },
            { out: "tcp 203.0.113.10:443      192.168.1.100:443     198.51.100.50:51544   198.51.100.50:51544", comment: { en: "Client-Y's HTTPS session to WebSrv", hi: "Client-Y ka WebSrv se HTTPS session" } },
            { out: "--- 203.0.113.10          192.168.1.100         ---                   ---", comment: { en: "The static entry itself, always present", hi: "Static entry khud, hamesha maujood" } },
          ],
          note: {
            en: "The `---` line is the permanent mapping. Each conversation through it also gets its own line with protocol and ports, which disappears when the session ends or times out.",
            hi: "`---` wali line permanent mapping hai. Iske through har conversation ki apni line bhi banti hai, protocol aur ports ke saath, jo session khatam hone ya time out hone par hat jaati hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Only one public address? Use static PAT", hi: "Sirf ek public address? Static PAT use karo" },
          text: {
            en: "If the office has only `203.0.113.1`, you can forward a single port instead of a whole address: `ip nat inside source static tcp 192.168.1.100 443 203.0.113.1 443`. Home routers call this port forwarding. It is good to recognise, but the exam focuses on the one-to-one form.",
            hi: "Agar office ke paas sirf `203.0.113.1` hai, toh poora address dene ki jagah ek port forward kar sakte ho: `ip nat inside source static tcp 192.168.1.100 443 203.0.113.1 443`. Home routers ise port forwarding kehte hain. Pehchaanna achha hai, lekin exam one-to-one wale form par focus karta hai.",
          },
        },
      ],
    },
    {
      id: "dynamic-nat",
      heading: { en: "Dynamic NAT: addresses from a pool", hi: "Dynamic NAT: pool se addresses" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Dynamic NAT is still one-to-one, but the router hands out public addresses from a **pool** on demand instead of you mapping each host by hand. You need two things: an **access list** that says which inside sources may be translated, and the pool of public addresses.",
            hi: "Dynamic NAT bhi one-to-one hi hai, lekin har host ko haath se map karne ki jagah router zaroorat padne par ek **pool** se public addresses deta hai. Do cheezein chahiye: ek **access list** jo batati hai ki kaunse inside sources translate ho sakte hain, aur public addresses ka pool.",
          },
        },
        {
          type: "p",
          text: {
            en: "The access list here is a standard ACL used only to match source addresses. `access-list 1 permit 192.168.1.0 0.0.0.255` matches every address that starts `192.168.1.`. The last part is a **wildcard mask**, the inverse of the subnet mask: `0` bits must match, `1` bits can be anything. ACLs get a full treatment in lesson 5.4.",
            hi: "Yahan access list ek standard ACL hai jo sirf source addresses match karne ke liye use hoti hai. `access-list 1 permit 192.168.1.0 0.0.0.255` har us address ko match karti hai jo `192.168.1.` se shuru hota hai. Aakhri hissa **wildcard mask** hai, subnet mask ka ulta: `0` bits match hone chahiye, `1` bits kuch bhi ho sakte hain. ACLs ko poori tarah lesson 5.4 mein padhoge.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: dynamic NAT with a four-address pool", hi: "R1: chaar address wale pool ke saath dynamic NAT" },
          lines: [
            { prompt: "R1(config)#", cmd: "access-list 1 permit 192.168.1.0 0.0.0.255", comment: { en: "who may be translated", hi: "kaun translate ho sakta hai" } },
            { prompt: "R1(config)#", cmd: "ip nat pool POOL1 203.0.113.20 203.0.113.23 netmask 255.255.255.0", comment: { en: "first address, last address, mask", hi: "pehla address, aakhri address, mask" } },
            { prompt: "R1(config)#", cmd: "ip nat inside source list 1 pool POOL1", comment: { en: "join the ACL to the pool", hi: "ACL ko pool se jodo" } },
          ],
          note: {
            en: "`prefix-length 24` can replace `netmask 255.255.255.0`. The pool name is case-sensitive and must match exactly in both commands.",
            hi: "`netmask 255.255.255.0` ki jagah `prefix-length 24` bhi likh sakte ho. Pool ka naam case-sensitive hai aur dono commands mein exactly same hona chahiye.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "PC1 sends its first packet to the internet. It enters R1 on the inside interface and its source `192.168.1.10` matches ACL 1.", hi: "PC1 internet ki taraf pehla packet bhejta hai. Packet inside interface par R1 mein aata hai aur uska source `192.168.1.10` ACL 1 se match karta hai." },
            { en: "R1 takes the first free pool address, `203.0.113.20`, and writes `192.168.1.10 = 203.0.113.20` into the table.", hi: "R1 pool ka pehla free address, `203.0.113.20`, leta hai aur table mein `192.168.1.10 = 203.0.113.20` likh deta hai." },
            { en: "Every packet from PC1 now leaves as `203.0.113.20`, and replies to `203.0.113.20` go back to PC1.", hi: "Ab PC1 ka har packet `203.0.113.20` bankar nikalta hai, aur `203.0.113.20` ke replies wapas PC1 ko jaate hain." },
            { en: "The entry stays until it has been idle for the timeout (24 hours by default) or you clear it. Only then can another host use that address.", hi: "Entry tab tak rehti hai jab tak timeout (default 24 ghante) tak idle na rahe ya tum use clear na karo. Tabhi koi doosra host woh address use kar sakta hai." },
          ],
        },
        {
          type: "cli",
          title: { en: "Four PCs online, the fifth one fails", hi: "Chaar PCs online, paanchwa fail" },
          lines: [
            { prompt: "R1#", cmd: "show ip nat statistics" },
            { out: "Total active translations: 8 (0 static, 8 dynamic; 4 extended)" },
            { out: "Outside interfaces:\n  GigabitEthernet0/1" },
            { out: "Inside interfaces:\n  GigabitEthernet0/0" },
            { out: "Dynamic mappings:\n-- Inside Source" },
            { out: "[Id: 1] access-list 1 pool POOL1 refcount 8" },
            { out: " pool POOL1: netmask 255.255.255.0\n\tstart 203.0.113.20 end 203.0.113.23" },
            { out: "\ttype generic, total addresses 4, allocated 4 (100%), misses 3", comment: { en: "pool exhausted; 3 attempts found no free address", hi: "pool khatam; 3 baar koi free address nahi mila" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Pool exhaustion", hi: "Pool exhaustion" },
          text: {
            en: "With four pool addresses and no `overload`, only four inside hosts can be translated at once. A fifth host's packets are dropped, not shared onto an existing address, and the pool's `misses` counter rises. That is why dynamic NAT on its own is rare; PAT solves it.",
            hi: "Pool mein chaar addresses hain aur `overload` nahi hai, toh ek time par sirf chaar inside hosts translate ho sakte hain. Paanchwe host ke packets drop hote hain, kisi existing address par share nahi hote, aur pool ka `misses` counter badhta hai. Isiliye akela dynamic NAT kam dikhta hai; PAT is problem ko solve karta hai.",
          },
        },
      ],
    },
    {
      id: "pat",
      heading: { en: "PAT: a whole office on one address", hi: "PAT: poora office ek address par" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**PAT (Port Address Translation)**, which Cisco calls **NAT overload**, translates the source port as well as the source address. Every TCP or UDP conversation already has a source port (lesson 1.7), so R1 can put thousands of conversations on one public address and tell them apart by port. In theory one address gives about 65,000 ports per protocol. ICMP (ping) has no ports, so PAT uses the ICMP query ID in that place; you will see `icmp` lines like `203.0.113.1:1` in the table.",
            hi: "**PAT (Port Address Translation)**, jise Cisco **NAT overload** kehta hai, source address ke saath source port bhi translate karta hai. Har TCP ya UDP conversation ka pehle se ek source port hota hai (lesson 1.7), isliye R1 hazaaron conversations ek hi public address par rakh sakta hai aur unhe port se alag pehchaan sakta hai. Theory mein ek address se har protocol ke liye lagbhag 65,000 ports milte hain. ICMP (ping) mein ports nahi hote, toh PAT uski jagah ICMP query ID use karta hai; table mein `203.0.113.1:1` jaisi `icmp` lines dikhengi.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: PAT on the outside interface", hi: "R1: outside interface par PAT" },
          lines: [
            { prompt: "R1(config)#", cmd: "access-list 1 permit 192.168.1.0 0.0.0.255" },
            { prompt: "R1(config)#", cmd: "ip nat inside source list 1 interface GigabitEthernet0/1 overload", comment: { en: "share G0/1's own address, 203.0.113.1", hi: "G0/1 ka apna address, 203.0.113.1, share karo" } },
          ],
          note: {
            en: "Using `interface` instead of a pool means the router follows whatever address G0/1 has, even if the ISP assigns it by DHCP. You can also overload a pool: `ip nat inside source list 1 pool POOL1 overload`.",
            hi: "Pool ki jagah `interface` use karne ka matlab hai ki router G0/1 par jo bhi address ho use follow karega, chahe ISP use DHCP se de. Pool ko bhi overload kar sakte ho: `ip nat inside source list 1 pool POOL1 overload`.",
          },
        },
        {
          type: "p",
          text: {
            en: "Now PC1 and PC2 both open HTTPS sessions to Server-X, and by coincidence both pick source port `49152`. R1 keeps PC1's port as it is. PC2's port is already taken on `203.0.113.1`, so R1 gives PC2 a different free port, here `1024`. IOS keeps the original port when it is free and picks another when it is not.",
            hi: "Ab PC1 aur PC2 dono Server-X se HTTPS session kholte hain, aur ittefaq se dono source port `49152` chunte hain. R1 PC1 ka port waisa hi rakhta hai. `203.0.113.1` par PC2 wala port pehle se use ho raha hai, isliye R1 PC2 ko doosra free port deta hai, yahan `1024`. IOS original port free ho toh wahi rakhta hai, nahi toh doosra chun leta hai.",
          },
        },
        {
          type: "cli",
          lines: [
            { prompt: "R1#", cmd: "show ip nat translations" },
            { out: "Pro Inside global         Inside local          Outside local         Outside global" },
            { out: "tcp 203.0.113.1:49152     192.168.1.10:49152    198.51.100.80:443     198.51.100.80:443", comment: { en: "PC1, port kept", hi: "PC1, port same raha" } },
            { out: "tcp 203.0.113.1:1024      192.168.1.11:49152    198.51.100.80:443     198.51.100.80:443", comment: { en: "PC2, port changed to 1024", hi: "PC2, port 1024 ho gaya" } },
          ],
        },
        {
          type: "p",
          text: {
            en: "When Server-X replies, both replies have destination `203.0.113.1`. R1 looks up the destination port: `49152` belongs to `192.168.1.10:49152`, `1024` belongs to `192.168.1.11:49152`. R1 rewrites the destination address and port back and forwards each reply to the right PC. A packet that arrives from outside with no matching entry has nowhere inside to go, which is why PAT alone never lets the internet reach WebSrv.",
            hi: "Jab Server-X reply karta hai, dono replies ka destination `203.0.113.1` hota hai. R1 destination port dekhta hai: `49152` `192.168.1.10:49152` ka hai, `1024` `192.168.1.11:49152` ka. R1 destination address aur port wapas rewrite karke har reply sahi PC ko forward karta hai. Bahar se aaya packet jiski koi matching entry nahi hai, uske liye andar koi jagah nahi, isiliye sirf PAT se internet WebSrv tak kabhi nahi pahunch sakta.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          text: {
            en: "The keyword that turns NAT into PAT is `overload`. Without it, `ip nat inside source list 1 interface GigabitEthernet0/1` lets only one inside host use the interface address at a time.",
            hi: "NAT ko PAT banane wala keyword `overload` hai. Iske bina `ip nat inside source list 1 interface GigabitEthernet0/1` ek time par sirf ek inside host ko interface address use karne deta hai.",
          },
        },
      ],
    },
    {
      id: "verify",
      heading: { en: "Verify and troubleshoot", hi: "Verify aur troubleshoot karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "`show ip nat translations` shows the table. `show ip nat statistics` shows which interfaces are inside and outside, how many translations exist, and how each dynamic mapping and pool is doing. Start with statistics when nothing translates at all.",
            hi: "`show ip nat translations` table dikhata hai. `show ip nat statistics` dikhata hai ki kaunse interfaces inside aur outside hain, kitne translations hain, aur har dynamic mapping aur pool ka kya haal hai. Jab kuch bhi translate na ho raha ho, toh statistics se shuru karo.",
          },
        },
        {
          type: "cli",
          title: { en: "R1 running static NAT and PAT", hi: "R1 par static NAT aur PAT chal rahe hain" },
          lines: [
            { prompt: "R1#", cmd: "show ip nat statistics" },
            { out: "Total active translations: 3 (1 static, 2 dynamic; 2 extended)" },
            { out: "Outside interfaces:\n  GigabitEthernet0/1", comment: { en: "check these two lists first", hi: "pehle yeh dono lists check karo" } },
            { out: "Inside interfaces:\n  GigabitEthernet0/0" },
            { out: "Dynamic mappings:\n-- Inside Source" },
            { out: "[Id: 2] access-list 1 interface GigabitEthernet0/1 refcount 2" },
            { prompt: "R1#", cmd: "clear ip nat translation *", comment: { en: "removes all dynamic entries", hi: "saari dynamic entries hata deta hai" } },
          ],
          note: {
            en: "`clear ip nat translation *` removes dynamic entries only; the static mapping stays. Sessions using the cleared entries break, so do it when traffic is low. Clear the translations before you change a pool or mapping too: while entries use them, IOS refuses to delete a pool and asks before deleting a mapping.",
            hi: "`clear ip nat translation *` sirf dynamic entries hatata hai; static mapping rehti hai. Clear hui entries use karne wale sessions toot jaate hain, isliye ise tab karo jab traffic kam ho. Pool ya mapping badalne se pehle bhi translations clear karo: jab tak entries unhe use kar rahi hain, IOS pool delete karne se mana kar deta hai aur mapping delete karne se pehle confirm poochta hai.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "Are the right interfaces listed under Inside and Outside? Missing or swapped marks are the most common fault.", hi: "Kya sahi interfaces Inside aur Outside mein listed hain? Missing ya ulte marks sabse common fault hai." },
            { en: "Does the ACL permit the inside subnet with a wildcard mask (`0.0.0.255`), not a subnet mask?", hi: "Kya ACL inside subnet ko wildcard mask (`0.0.0.255`) ke saath permit karti hai, subnet mask ke saath nahi?" },
            { en: "Does the `ip nat inside source` command name the same ACL number and pool name you created, and does it say `overload` if you meant PAT?", hi: "Kya `ip nat inside source` command mein wahi ACL number aur pool name hai jo tumne banaya, aur PAT chahiye tha toh `overload` likha hai?" },
            { en: "Does R1 have a route to the destination, usually a default route out of the outside interface?", hi: "Kya R1 ke paas destination ka route hai, aam taur par outside interface se default route?" },
            { en: "Generate traffic from the inside, then check `show ip nat translations` for a new entry.", hi: "Inside se traffic generate karo, phir `show ip nat translations` mein nayi entry dekho." },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "NAT", def: { en: "Network Address Translation: a router rewrites IP addresses as packets cross between inside and outside interfaces and reverses the change for replies.", hi: "Network Address Translation: packets inside aur outside interfaces ke beech cross karte waqt router IP addresses rewrite karta hai aur replies ke liye change ulta karta hai." } },
    { term: "Inside local", def: { en: "The inside host's address as seen on the inside network, usually its private address.", hi: "Inside host ka address jaisa inside network par dikhta hai, aksar uska private address." } },
    { term: "Inside global", def: { en: "The inside host's address as seen from the outside after translation, a public address.", hi: "Translation ke baad inside host ka address jaisa bahar se dikhta hai, ek public address." } },
    { term: "Outside local", def: { en: "The outside host's address as seen from the inside; the same as outside global unless outside addresses are translated.", hi: "Outside host ka address jaisa inside se dikhta hai; outside global jaisa hi, jab tak outside addresses translate na hon." } },
    { term: "Outside global", def: { en: "The outside host's real address on the outside network.", hi: "Outside network par outside host ka asli address." } },
    { term: "Static NAT", def: { en: "A permanent one-to-one mapping between an inside local and an inside global address, usable in both directions.", hi: "Inside local aur inside global address ke beech permanent one-to-one mapping, jo dono directions mein kaam karti hai." } },
    { term: "Dynamic NAT", def: { en: "One-to-one translation using addresses taken from a pool on demand and returned when the entry times out.", hi: "One-to-one translation jo zaroorat padne par pool se address leta hai aur entry time out hone par wapas kar deta hai." } },
    { term: "PAT (NAT overload)", def: { en: "Many inside hosts share one public address; the router tells conversations apart by translating source ports.", hi: "Kai inside hosts ek public address share karte hain; router source ports translate karke conversations ko alag pehchaanta hai." } },
  ],
  commands: [
    { cmd: "ip nat inside", mode: "Cisco interface config", does: { en: "Mark the interface as facing the inside network", hi: "Interface ko inside network ki taraf mark karta hai" } },
    { cmd: "ip nat outside", mode: "Cisco interface config", does: { en: "Mark the interface as facing the outside network", hi: "Interface ko outside network ki taraf mark karta hai" } },
    { cmd: "ip nat inside source static 192.168.1.100 203.0.113.10", mode: "Cisco global config", does: { en: "Create a static one-to-one mapping (inside local, inside global)", hi: "Static one-to-one mapping banata hai (inside local, inside global)" } },
    { cmd: "access-list 1 permit 192.168.1.0 0.0.0.255", mode: "Cisco global config", does: { en: "Match the inside sources that may be translated", hi: "Un inside sources ko match karta hai jo translate ho sakte hain" } },
    { cmd: "ip nat pool POOL1 203.0.113.20 203.0.113.23 netmask 255.255.255.0", mode: "Cisco global config", does: { en: "Define a pool of public addresses", hi: "Public addresses ka pool define karta hai" } },
    { cmd: "ip nat inside source list 1 pool POOL1", mode: "Cisco global config", does: { en: "Dynamic NAT: translate ACL 1 sources to pool addresses", hi: "Dynamic NAT: ACL 1 ke sources ko pool addresses mein translate karta hai" } },
    { cmd: "ip nat inside source list 1 interface GigabitEthernet0/1 overload", mode: "Cisco global config", does: { en: "PAT: all ACL 1 sources share the interface's address", hi: "PAT: ACL 1 ke saare sources interface ka address share karte hain" } },
    { cmd: "show ip nat translations", mode: "Cisco privileged EXEC", does: { en: "Show the translation table", hi: "Translation table dikhata hai" } },
    { cmd: "show ip nat statistics", mode: "Cisco privileged EXEC", does: { en: "Show inside/outside interfaces, counters, mappings and pool usage", hi: "Inside/outside interfaces, counters, mappings aur pool usage dikhata hai" } },
    { cmd: "clear ip nat translation *", mode: "Cisco privileged EXEC", does: { en: "Remove all dynamic translations (static mappings stay)", hi: "Saare dynamic translations hatata hai (static mappings rehti hain)" } },
  ],
  mistakes: [
    {
      en: "Forgetting `ip nat inside` / `ip nat outside`, or putting them on the wrong interfaces. Nothing is translated. Check the two interface lists in `show ip nat statistics`.",
      hi: "`ip nat inside` / `ip nat outside` bhool jaana, ya galat interfaces par laga dena. Kuch bhi translate nahi hota. `show ip nat statistics` mein dono interface lists check karo.",
    },
    {
      en: "Writing a subnet mask in the ACL: `access-list 1 permit 192.168.1.0 255.255.255.0` matches only addresses ending in `.0`, so no PC matches. Use the wildcard `0.0.0.255`.",
      hi: "ACL mein subnet mask likh dena: `access-list 1 permit 192.168.1.0 255.255.255.0` sirf `.0` par khatam hone wale addresses match karta hai, toh koi PC match nahi hota. Wildcard `0.0.0.255` use karo.",
    },
    {
      en: "Leaving out `overload`. Without it, an interface or pool gives one address to one host at a time and everyone else fails.",
      hi: "`overload` chhod dena. Iske bina interface ya pool ek time par ek host ko ek address deta hai aur baaki sab fail hote hain.",
    },
    {
      en: "Mixing up inside global and outside local. Inside global is your host's public address; outside local is how the remote host appears from inside.",
      hi: "Inside global aur outside local ko mila dena. Inside global tumhare host ka public address hai; outside local woh hai jaisa remote host inside se dikhta hai.",
    },
    {
      en: "Expecting PAT to let internet users reach an inside server. PAT only creates entries for traffic that starts inside; a server needs static NAT (or static PAT).",
      hi: "Yeh expect karna ki PAT se internet users inside server tak pahunch jaayenge. PAT sirf inside se shuru hone wale traffic ki entries banata hai; server ke liye static NAT (ya static PAT) chahiye.",
    },
    {
      en: "Thinking `clear ip nat translation *` removes static NAT. It removes only dynamic entries; remove a static mapping with `no ip nat inside source static ...`.",
      hi: "Yeh sochna ki `clear ip nat translation *` static NAT hata deta hai. Yeh sirf dynamic entries hatata hai; static mapping `no ip nat inside source static ...` se hatao.",
    },
  ],
  recap: [
    { en: "Inside/outside = which side the host is on; local/global = which side you view the address from. Inside local is the private address, inside global the public one.", hi: "Inside/outside = host kis side par hai; local/global = address kis side se dekh rahe ho. Inside local private address hai, inside global public wala." },
    { en: "Every NAT config needs `ip nat inside` and `ip nat outside` on the right interfaces.", hi: "Har NAT config ko sahi interfaces par `ip nat inside` aur `ip nat outside` chahiye." },
    { en: "Static NAT: `ip nat inside source static <local> <global>`, one-to-one, works inbound too, used to publish servers.", hi: "Static NAT: `ip nat inside source static <local> <global>`, one-to-one, inbound bhi kaam karta hai, servers publish karne ke liye." },
    { en: "Dynamic NAT: ACL + `ip nat pool` + `ip nat inside source list 1 pool NAME`; one host per pool address, extra hosts fail.", hi: "Dynamic NAT: ACL + `ip nat pool` + `ip nat inside source list 1 pool NAME`; har pool address par ek host, extra hosts fail." },
    { en: "PAT: add `overload`; many hosts share one address, kept apart by source port, and replies are matched by destination port.", hi: "PAT: `overload` jodo; kai hosts ek address share karte hain, source port se alag rehte hain, aur replies destination port se match hote hain." },
    { en: "Verify with `show ip nat translations` and `show ip nat statistics`; `clear ip nat translation *` clears dynamic entries only.", hi: "`show ip nat translations` aur `show ip nat statistics` se verify karo; `clear ip nat translation *` sirf dynamic entries clear karta hai." },
  ],
  quiz: [
    {
      q: {
        en: "PC1 (192.168.1.10) browses to Server-X (198.51.100.80). R1 translates PC1 to 203.0.113.1 with PAT. What is the outside local address in this conversation?",
        hi: "PC1 (192.168.1.10) Server-X (198.51.100.80) ko browse karta hai. R1 PAT se PC1 ko 203.0.113.1 mein translate karta hai. Is conversation mein outside local address kya hai?",
      },
      options: [
        { en: "203.0.113.1", hi: "203.0.113.1" },
        { en: "192.168.1.10", hi: "192.168.1.10" },
        { en: "198.51.100.80", hi: "198.51.100.80" },
        { en: "192.168.1.1", hi: "192.168.1.1" },
      ],
      answer: 2,
      explain: {
        en: "Outside local is the outside host's address as seen from the inside. R1 does not translate Server-X, so PC1 sees it as 198.51.100.80, the same as its outside global address. 203.0.113.1 is PC1's inside global address and 192.168.1.10 its inside local address.",
        hi: "Outside local matlab outside host ka address jaisa inside se dikhta hai. R1 Server-X ko translate nahi karta, toh PC1 ko woh 198.51.100.80 hi dikhta hai, jo uske outside global address jaisa hai. 203.0.113.1 PC1 ka inside global address hai aur 192.168.1.10 uska inside local.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1 runs `ip nat inside source list 1 pool POOL1` with a four-address pool and no `overload`. Four PCs already hold translations. A fifth PC permitted by ACL 1 tries to reach the internet. What happens?",
        hi: "R1 par chaar address wale pool ke saath `ip nat inside source list 1 pool POOL1` chal raha hai, `overload` nahi hai. Chaar PCs ke paas pehle se translations hain. ACL 1 se permit ek paanchwa PC internet tak jaana chahta hai. Kya hoga?",
      },
      options: [
        { en: "Its packets are not translated and it cannot reach the internet until a pool address is freed; the pool's misses counter rises", hi: "Uske packets translate nahi hote aur jab tak pool ka koi address free na ho, woh internet tak nahi pahunchta; pool ka misses counter badhta hai" },
        { en: "R1 puts it on one of the four addresses and separates it by port number", hi: "R1 use chaar mein se kisi ek address par daal kar port number se alag kar deta hai" },
        { en: "R1 translates it to the G0/1 interface address instead", hi: "R1 use G0/1 interface ke address mein translate kar deta hai" },
        { en: "R1 deletes the oldest translation to make room for it", hi: "R1 sabse purana translation hata kar uske liye jagah banata hai" },
      ],
      answer: 0,
      explain: {
        en: "Dynamic NAT without `overload` is strictly one-to-one. With all four addresses allocated, the fifth host's translation fails and `show ip nat statistics` counts it as a pool miss. Sharing an address by port is PAT, which needs the `overload` keyword; R1 does not evict active entries.",
        hi: "`overload` ke bina dynamic NAT strictly one-to-one hai. Chaaron addresses allocate ho chuke hain, toh paanchwe host ka translation fail hota hai aur `show ip nat statistics` ise pool miss ki tarah ginta hai. Port se address share karna PAT hai, jiske liye `overload` keyword chahiye; R1 active entries ko nahi hatata.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`show ip nat translations` on R1 includes this line: `tcp 203.0.113.1:1024  192.168.1.11:49152  198.51.100.80:443  198.51.100.80:443`. What is the inside global address and port?",
        hi: "R1 par `show ip nat translations` mein yeh line hai: `tcp 203.0.113.1:1024  192.168.1.11:49152  198.51.100.80:443  198.51.100.80:443`. Inside global address aur port kya hai?",
      },
      options: [
        { en: "192.168.1.11:49152", hi: "192.168.1.11:49152" },
        { en: "198.51.100.80:443", hi: "198.51.100.80:443" },
        { en: "192.168.1.1:1024", hi: "192.168.1.1:1024" },
        { en: "203.0.113.1:1024", hi: "203.0.113.1:1024" },
      ],
      answer: 3,
      explain: {
        en: "The columns are Inside global, Inside local, Outside local, Outside global, in that order. The inside global is 203.0.113.1:1024: PC2's real socket 192.168.1.11:49152 after PAT. The port changed because another host was already using 203.0.113.1:49152.",
        hi: "Columns ka order hai Inside global, Inside local, Outside local, Outside global. Inside global 203.0.113.1:1024 hai: PAT ke baad PC2 ka asli socket 192.168.1.11:49152. Port isliye badla kyunki 203.0.113.1:49152 pehle se kisi aur host ke paas tha.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1's configuration contains `ip nat pool POOL1 203.0.113.20 203.0.113.23 netmask 255.255.255.0` and `ip nat inside source list 1 pool POOL1 overload`. What does R1 do with traffic from hosts permitted by ACL 1?",
        hi: "R1 ki configuration mein `ip nat pool POOL1 203.0.113.20 203.0.113.23 netmask 255.255.255.0` aur `ip nat inside source list 1 pool POOL1 overload` hai. ACL 1 se permit hosts ke traffic ke saath R1 kya karta hai?",
      },
      options: [
        { en: "Maps each host permanently to one pool address (static NAT)", hi: "Har host ko permanently ek pool address se map karta hai (static NAT)" },
        { en: "Lets the hosts share the four pool addresses, told apart by port numbers (PAT)", hi: "Hosts ko chaar pool addresses share karne deta hai, port numbers se alag pehchaan kar (PAT)" },
        { en: "Gives one pool address per host, so at most four hosts at a time (dynamic NAT)", hi: "Har host ko ek pool address deta hai, toh ek time par maximum chaar hosts (dynamic NAT)" },
        { en: "Translates the addresses of outside hosts into the pool range", hi: "Outside hosts ke addresses ko pool range mein translate karta hai" },
      ],
      answer: 1,
      explain: {
        en: "`overload` turns any mapping into PAT, including a pool mapping. The hosts share 203.0.113.20 to .23 and R1 separates conversations by port. Without `overload` the same pool would be dynamic NAT, one host per address. Static NAT uses `ip nat inside source static`, and `ip nat inside source` never translates outside hosts.",
        hi: "`overload` kisi bhi mapping ko PAT bana deta hai, pool wali mapping ko bhi. Hosts 203.0.113.20 se .23 share karte hain aur R1 conversations ko port se alag karta hai. `overload` ke bina yahi pool dynamic NAT hota, har address par ek host. Static NAT `ip nat inside source static` se hota hai, aur `ip nat inside source` kabhi outside hosts ko translate nahi karta.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "PAT is configured on R1 but nothing is translated. `show ip nat statistics` lists Outside interfaces: GigabitEthernet0/0 and Inside interfaces: GigabitEthernet0/1. G0/0 connects to the LAN and G0/1 to the ISP. What fixes it?",
        hi: "R1 par PAT configure hai lekin kuch translate nahi ho raha. `show ip nat statistics` mein Outside interfaces: GigabitEthernet0/0 aur Inside interfaces: GigabitEthernet0/1 hai. G0/0 LAN se juda hai aur G0/1 ISP se. Kya fix karega?",
      },
      options: [
        { en: "Add a static NAT entry for each PC", hi: "Har PC ke liye static NAT entry jodo" },
        { en: "Change ACL 1 to use the mask 255.255.255.0", hi: "ACL 1 mein mask 255.255.255.0 use karo" },
        { en: "Swap the marks: `ip nat inside` on G0/0 and `ip nat outside` on G0/1", hi: "Marks ulto: G0/0 par `ip nat inside` aur G0/1 par `ip nat outside`" },
        { en: "Add `overload` to the `ip nat pool` command", hi: "`ip nat pool` command mein `overload` jodo" },
      ],
      answer: 2,
      explain: {
        en: "Inside and outside are swapped. LAN packets enter on an interface marked outside, so they never match the inside source rule. Mark G0/0 inside and G0/1 outside (remove the old marks). A subnet mask in the ACL would break matching, and `overload` belongs on the `ip nat inside source` command, not the pool.",
        hi: "Inside aur outside ulte lage hain. LAN ke packets outside marked interface par aate hain, toh woh kabhi inside source rule se match nahi hote. G0/0 ko inside aur G0/1 ko outside mark karo (purane marks hatao). ACL mein subnet mask matching tod dega, aur `overload` `ip nat inside source` command par lagta hai, pool par nahi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "R1 already does PAT for 192.168.1.0/24. WebSrv (192.168.1.100) must now be reachable from the internet on 203.0.113.10. What do you add?",
        hi: "R1 pehle se 192.168.1.0/24 ke liye PAT kar raha hai. Ab WebSrv (192.168.1.100) ko internet se 203.0.113.10 par reachable hona hai. Kya jodoge?",
      },
      options: [
        { en: "Nothing; PAT already forwards inbound connections to the right inside host", hi: "Kuch nahi; PAT inbound connections ko pehle se sahi inside host tak forward karta hai" },
        { en: "A line in ACL 1 permitting 192.168.1.100", hi: "ACL 1 mein 192.168.1.100 permit karne wali line" },
        { en: "`ip nat outside` on the switch port where WebSrv connects", hi: "Jis switch port par WebSrv juda hai, us par `ip nat outside`" },
        { en: "Static NAT with `ip nat inside source static 192.168.1.100 203.0.113.10`", hi: "`ip nat inside source static 192.168.1.100 203.0.113.10` se static NAT" },
      ],
      answer: 3,
      explain: {
        en: "A connection that starts on the internet needs a translation that already exists. Static NAT creates a permanent mapping, so R1 knows to send 203.0.113.10 to 192.168.1.100. PAT entries exist only after an inside host starts a conversation, ACL 1 already covers the whole subnet, and NAT is configured on router interfaces, not switch ports.",
        hi: "Internet se shuru hone wale connection ko pehle se maujood translation chahiye. Static NAT permanent mapping banata hai, toh R1 ko pata hota hai ki 203.0.113.10 ko 192.168.1.100 par bhejna hai. PAT entries tabhi banti hain jab inside host conversation shuru kare, ACL 1 pehle se poora subnet cover karti hai, aur NAT router interfaces par configure hota hai, switch ports par nahi.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "2TZCfTgopeg",
      title: "Free CCNA | NAT (Part 1) | Day 44",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Why NAT exists, the four address terms, and static NAT configuration.", hi: "NAT kyun hai, chaar address terms, aur static NAT configuration." },
    },
    {
      id: "kILDNs4KjYE",
      title: "Free CCNA | NAT (part 2) | Day 45",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Dynamic NAT with pools and PAT (overload), with show output.", hi: "Pools ke saath dynamic NAT aur PAT (overload), show output ke saath." },
    },
    {
      id: "6iyBr-idTZc",
      title: "72. Free CCNA (NEW) | NAT - Network Address Translation - Part1",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of NAT concepts and types.", hi: "NAT concepts aur types ka Hindi explanation." },
    },
    {
      id: "xZbU07d3MKI",
      title: "73. Free CCNA (NEW) | NAT - Network Address Translation - Part2",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walkthrough of NAT configuration on a Cisco router.", hi: "Cisco router par NAT configuration ka Hindi walkthrough." },
    },
  ],
  lab: {
    title: { en: "Build static NAT and PAT in Packet Tracer", hi: "Packet Tracer mein static NAT aur PAT banao" },
    steps: [
      {
        en: "Inside: PC1 (192.168.1.10), PC2 (192.168.1.11) and a server (192.168.1.100) on a switch, all with gateway 192.168.1.1 on R1 G0/0. Outside: R1 G0/1 203.0.113.1/24 to an ISP router (203.0.113.2), and a server 198.51.100.80 behind the ISP. Give R1 `ip route 0.0.0.0 0.0.0.0 203.0.113.2`.",
        hi: "Inside: PC1 (192.168.1.10), PC2 (192.168.1.11) aur ek server (192.168.1.100) ek switch par, sabka gateway R1 G0/0 par 192.168.1.1. Outside: R1 G0/1 203.0.113.1/24 se ek ISP router (203.0.113.2), aur ISP ke peeche ek server 198.51.100.80. R1 par `ip route 0.0.0.0 0.0.0.0 203.0.113.2` do.",
      },
      {
        en: "Ping 198.51.100.80 from PC1. It fails: the ISP router has no route back to 192.168.1.0/24, which is exactly the internet's view of private addresses.",
        hi: "PC1 se 198.51.100.80 ping karo. Fail hoga: ISP router ke paas 192.168.1.0/24 ka wapas route nahi hai, internet bhi private addresses ko aise hi dekhta hai.",
      },
      {
        en: "On R1 add `ip nat inside` on G0/0, `ip nat outside` on G0/1, `access-list 1 permit 192.168.1.0 0.0.0.255` and `ip nat inside source list 1 interface g0/1 overload`. Ping again and read `show ip nat translations`.",
        hi: "R1 par G0/0 par `ip nat inside`, G0/1 par `ip nat outside`, `access-list 1 permit 192.168.1.0 0.0.0.255` aur `ip nat inside source list 1 interface g0/1 overload` jodo. Dobara ping karo aur `show ip nat translations` padho.",
      },
      {
        en: "Open the web browser on PC1 and PC2 to 198.51.100.80 at the same time. Find both entries and compare their inside global ports.",
        hi: "PC1 aur PC2 dono par ek saath web browser mein 198.51.100.80 kholo. Dono entries dhoondho aur unke inside global ports compare karo.",
      },
      {
        en: "Add `ip nat inside source static 192.168.1.100 203.0.113.10`. From the outside server, browse to 203.0.113.10 and confirm you reach the inside server.",
        hi: "`ip nat inside source static 192.168.1.100 203.0.113.10` jodo. Outside server se 203.0.113.10 browse karo aur confirm karo ki inside server tak pahunche.",
      },
      {
        en: "Run `show ip nat statistics`, then `clear ip nat translation *`, and check which entry survives.",
        hi: "`show ip nat statistics` chalao, phir `clear ip nat translation *`, aur dekho kaunsi entry bachti hai.",
      },
    ],
  },
};

export default lesson;
