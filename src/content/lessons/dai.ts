import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "dai",
  intro: {
    en: "ARP believes whatever it hears (lesson 1.2). One forged ARP message telling a PC that the gateway's IP now lives at the attacker's MAC is enough to send all of that PC's off-subnet traffic through the attacker. Dynamic ARP Inspection (DAI) makes the access switch check every ARP message from user ports against the DHCP snooping binding table and drop the ones that lie.",
    hi: "ARP jo sunta hai us par bharosa kar leta hai (lesson 1.2). Ek forged ARP message jo PC ko bole ki gateway ka IP ab attacker ke MAC par hai, itna kaafi hai ki us PC ka subnet se bahar jaane wala saara traffic attacker se hokar jaaye. Dynamic ARP Inspection (DAI) access switch se user ports ke har ARP message ko DHCP snooping binding table se check karwata hai aur jhooth bolne wale messages drop karwata hai.",
  },
  outcomes: [
    { en: "Explain how ARP poisoning puts an attacker in the middle of a conversation", hi: "Samjha sako ki ARP poisoning attacker ko conversation ke beech mein kaise le aata hai" },
    { en: "Describe how DAI checks ARP on untrusted ports against the DHCP snooping binding table", hi: "Describe kar sako ki DAI untrusted ports par ARP ko DHCP snooping binding table se kaise check karta hai" },
    { en: "Configure DAI for a VLAN, trust the right ports, and use ARP ACLs for hosts with static IPs", hi: "VLAN ke liye DAI configure kar sako, sahi ports trust kar sako, aur static IP wale hosts ke liye ARP ACLs use kar sako" },
    { en: "Use the optional src-mac, dst-mac and ip validation checks correctly", hi: "Optional src-mac, dst-mac aur ip validation checks sahi tarah use kar sako" },
    { en: "Predict the effect of the DAI rate limit and read `show ip arp inspection`", hi: "DAI rate limit ka effect predict kar sako aur `show ip arp inspection` padh sako" },
  ],
  sections: [
    {
      id: "arp-poisoning",
      heading: { en: "How ARP poisoning works", hi: "ARP poisoning kaise hota hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "ARP has no authentication, and hosts accept ARP replies they never asked for, including gratuitous ARPs. They simply overwrite the cache entry. An attacker on the same VLAN uses that to rewrite two caches:",
            hi: "ARP mein koi authentication nahi hai, aur hosts woh ARP replies bhi accept kar lete hain jo unhone kabhi maange hi nahi, gratuitous ARPs bhi. Woh bas cache entry overwrite kar dete hain. Same VLAN ka attacker isi ka fayda utha kar do caches badal deta hai:",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "PC-A (192.168.10.11) has the correct entry for its gateway: `192.168.10.1 → 0011.2233.4401` (R1).",
              hi: "PC-A (192.168.10.11) ke paas gateway ki sahi entry hai: `192.168.10.1 → 0011.2233.4401` (R1).",
            },
            {
              en: "The attacker (192.168.10.66, MAC `0050.56aa.0066`) sends PC-A an ARP reply saying \"192.168.10.1 is at 0050.56aa.0066\". A gratuitous ARP claiming 192.168.10.1 works the same way.",
              hi: "Attacker (192.168.10.66, MAC `0050.56aa.0066`) PC-A ko ARP reply bhejta hai: \"192.168.10.1 is at 0050.56aa.0066\". 192.168.10.1 claim karne wala gratuitous ARP bhi isi tarah kaam karta hai.",
            },
            {
              en: "It also tells R1 \"192.168.10.11 is at 0050.56aa.0066\", so return traffic comes to the attacker too.",
              hi: "Woh R1 ko bhi bolta hai \"192.168.10.11 is at 0050.56aa.0066\", taaki wapas aane wala traffic bhi attacker ke paas aaye.",
            },
            {
              en: "PC-A now builds frames for the internet with the attacker's MAC. The switch delivers them correctly, by MAC, to the attacker, who reads or changes them and forwards them to R1 so nothing looks broken.",
              hi: "Ab PC-A internet ke liye frames attacker ke MAC ke saath banata hai. Switch unhe MAC ke hisaab se sahi-sahi attacker tak pahuncha deta hai, jo unhe padhta ya badalta hai aur R1 ko forward kar deta hai taaki kuch toota hua na lage.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "PC-A's ARP cache before and after", hi: "PC-A ki ARP cache pehle aur baad mein" },
          columns: [{ en: "IP address", hi: "IP address" }, { en: "Before", hi: "Pehle" }, { en: "After poisoning", hi: "Poisoning ke baad" }],
          rows: [["192.168.10.1", "0011.2233.4401 (R1)", "0050.56aa.0066 (attacker)"]],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The switch is not fooled, the hosts are", hi: "Switch dhokha nahi khaata, hosts khaate hain" },
          text: {
            en: "The switch forwards every frame exactly as its MAC table says. Port security does not help either, because the attacker uses one real MAC. The fix has to look inside the ARP message and ask whether the sender really owns that IP.",
            hi: "Switch har frame bilkul MAC table ke hisaab se forward karta hai. Port security bhi madad nahi karti, kyunki attacker ek hi asli MAC use karta hai. Fix ko ARP message ke andar dekhna padega aur poochna padega ki sender sach mein us IP ka maalik hai ya nahi.",
          },
        },
      ],
    },
    {
      id: "what-dai-checks",
      heading: { en: "What DAI checks", hi: "DAI kya check karta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "DAI is enabled per VLAN. On every **untrusted** port in that VLAN, the switch intercepts all ARP requests and replies and compares the **sender MAC** and **sender IP** inside the ARP message with the DHCP snooping binding table (lesson 5.7). A matching binding means the ARP is valid and is forwarded. No match means it is dropped and logged.",
            hi: "DAI per VLAN enable hota hai. Us VLAN ke har **untrusted** port par switch saari ARP requests aur replies ko rok kar ARP message ke andar ke **sender MAC** aur **sender IP** ko DHCP snooping binding table (lesson 5.7) se compare karta hai. Matching binding mili toh ARP valid hai aur forward hota hai. Match nahi mila toh drop aur log hota hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The attacker's forged reply, checked on Gi0/3", hi: "Attacker ka forged reply, Gi0/3 par check" },
          columns: [{ en: "Field", hi: "Field" }, { en: "In the ARP message", hi: "ARP message mein" }, { en: "Binding table says", hi: "Binding table kehti hai" }],
          rows: [
            ["Sender MAC", "0050.56aa.0066", { en: "0050.56aa.0066 holds 192.168.10.66", hi: "0050.56aa.0066 ke paas 192.168.10.66 hai" }],
            ["Sender IP", "192.168.10.1", { en: "No binding gives 192.168.10.1 to this MAC", hi: "Kisi binding mein 192.168.10.1 is MAC ka nahi hai" }],
            [{ en: "Result", hi: "Result" }, { en: "Mismatch", hi: "Mismatch" }, { en: "Dropped and logged", hi: "Drop aur log" }],
          ],
        },
        {
          type: "cli",
          title: { en: "The log message for that drop", hi: "Us drop ka log message" },
          lines: [
            { out: "%SW_DAI-4-DHCP_SNOOPING_DENY: 1 Invalid ARPs (Res) on Gi0/3, vlan 10.([0050.56aa.0066/192.168.10.1/0050.56aa.0011/192.168.10.11/10:15:02 UTC Mon Mar 1 1993])" },
          ],
          note: {
            en: "Inside the brackets: sender MAC / sender IP / target MAC / target IP / time. (Res) means it was an ARP reply; (Req) would be a request.",
            hi: "Brackets ke andar: sender MAC / sender IP / target MAC / target IP / time. (Res) ka matlab ARP reply tha; (Req) hota toh request.",
          },
        },
        {
          type: "p",
          text: {
            en: "Hosts with static IPs (servers, printers) never used DHCP, so they have no binding, and DAI would drop their ARPs. For them you write an **ARP ACL** that permits the exact IP and MAC pair and apply it to the VLAN. DAI checks ARP ACLs first, then the binding table.",
            hi: "Static IP wale hosts (servers, printers) ne kabhi DHCP use hi nahi kiya, isliye unki koi binding nahi hai, aur DAI unke ARPs drop kar dega. Unke liye ek **ARP ACL** likhte ho jo exact IP aur MAC pair ko permit kare, aur use VLAN par apply karte ho. DAI pehle ARP ACLs check karta hai, phir binding table.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "DAI depends on DHCP snooping: enable snooping on the same VLAN so the binding table exists. Only untrusted ports are inspected; trusted ports are not checked at all.",
            hi: "DAI DHCP snooping par depend karta hai: same VLAN par snooping enable karo taaki binding table bane. Sirf untrusted ports inspect hote hain; trusted ports par koi check nahi hota.",
          },
        },
      ],
    },
    {
      id: "which-ports-to-trust",
      heading: { en: "Which ports to trust", hi: "Kaunse ports trust karein" },
      blocks: [
        {
          type: "p",
          text: {
            en: "After `ip arp inspection vlan 10`, every port in VLAN 10 is untrusted. Decide port by port:",
            hi: "`ip arp inspection vlan 10` ke baad VLAN 10 ka har port untrusted hota hai. Har port ke liye socho:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**User access ports**: untrusted. This is where attackers sit.",
              hi: "**User access ports**: untrusted. Attackers yahin baithte hain.",
            },
            {
              en: "**Port to the gateway router**: trust it, or permit the router with an ARP ACL. R1's address is static, so it has no binding; on an untrusted port R1's ARP replies are dropped and the whole VLAN loses its gateway.",
              hi: "**Gateway router wala port**: ise trust karo, ya ARP ACL se router ko permit karo. R1 ka address static hai, toh uski koi binding nahi; untrusted port par R1 ke ARP replies drop honge aur poora VLAN gateway kho dega.",
            },
            {
              en: "**Trunks to other switches**: trust them when the other switch runs DAI too. Hosts on that switch have their bindings over there, so this switch would wrongly drop their ARPs.",
              hi: "**Doosre switches ke trunks**: jab doosra switch bhi DAI chala raha ho toh inhe trust karo. Us switch ke hosts ki bindings wahin hain, toh yeh switch unke ARPs galti se drop kar dega.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Do not trust a user port to make a problem go away", hi: "Problem hataane ke liye user port trust mat karo" },
          text: {
            en: "If a printer's ARPs are being dropped, the right fix is an ARP ACL for its IP and MAC. Trusting its port turns off inspection for anything plugged into that port later.",
            hi: "Agar printer ke ARPs drop ho rahe hain, toh sahi fix uske IP aur MAC ke liye ARP ACL hai. Uska port trust karne se baad mein us port par jo bhi lagega, uski inspection band ho jaayegi.",
          },
        },
      ],
    },
    {
      id: "configure",
      heading: { en: "Configuring DAI", hi: "DAI configure karna" },
      blocks: [
        {
          type: "cli",
          title: { en: "SW1: R1 on Gi0/1, users on Gi0/2 and Gi0/3", hi: "SW1: R1 Gi0/1 par, users Gi0/2 aur Gi0/3 par" },
          lines: [
            { prompt: "SW1(config)#", cmd: "ip dhcp snooping", comment: { en: "From lesson 5.7: builds the binding table", hi: "Lesson 5.7 se: binding table banata hai" } },
            { prompt: "SW1(config)#", cmd: "ip dhcp snooping vlan 10" },
            { prompt: "SW1(config)#", cmd: "ip arp inspection vlan 10" },
            { prompt: "SW1(config)#", cmd: "interface gigabitethernet0/1" },
            { prompt: "SW1(config-if)#", cmd: "ip dhcp snooping trust" },
            { prompt: "SW1(config-if)#", cmd: "ip arp inspection trust", comment: { en: "R1 has a static IP and no binding", hi: "R1 ka IP static hai aur koi binding nahi" } },
            { prompt: "SW1(config-if)#", cmd: "exit" },
          ],
        },
        {
          type: "cli",
          title: { en: "A printer with a static IP", hi: "Static IP wala printer" },
          lines: [
            { prompt: "SW1(config)#", cmd: "arp access-list STATIC-HOSTS" },
            { prompt: "SW1(config-arp-nacl)#", cmd: "permit ip host 192.168.10.20 mac host 0050.56aa.0020" },
            { prompt: "SW1(config-arp-nacl)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "ip arp inspection filter STATIC-HOSTS vlan 10" },
          ],
          note: {
            en: "`permit ip host <ip> mac host <mac>` allows ARPs whose sender IP and sender MAC are exactly that pair.",
            hi: "`permit ip host <ip> mac host <mac>` un ARPs ko allow karta hai jinka sender IP aur sender MAC bilkul yahi pair ho.",
          },
        },
      ],
    },
    {
      id: "optional-validation",
      heading: { en: "Optional extra checks", hi: "Optional extra checks" },
      blocks: [
        {
          type: "p",
          text: {
            en: "By default DAI checks only the IP-to-MAC binding. `ip arp inspection validate` adds checks that catch ARP messages whose Ethernet header and ARP body disagree, or that carry impossible addresses.",
            hi: "By default DAI sirf IP-to-MAC binding check karta hai. `ip arp inspection validate` aur checks jodta hai jo aise ARP messages pakadte hain jinka Ethernet header aur ARP body match nahi karte, ya jinme impossible addresses hain.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Keyword", hi: "Keyword" }, { en: "What it compares", hi: "Kya compare karta hai" }, { en: "Applies to", hi: "Kis par lagta hai" }],
          rows: [
            ["src-mac", { en: "Ethernet source MAC vs ARP sender MAC", hi: "Ethernet source MAC ko ARP sender MAC se milata hai" }, { en: "Requests and replies", hi: "Requests aur replies" }],
            ["dst-mac", { en: "Ethernet destination MAC vs ARP target MAC", hi: "Ethernet destination MAC ko ARP target MAC se milata hai" }, { en: "Replies", hi: "Replies" }],
            ["ip", { en: "Drops invalid IPs such as 0.0.0.0, 255.255.255.255 and multicast", hi: "0.0.0.0, 255.255.255.255 aur multicast jaise invalid IPs drop karta hai" }, { en: "Sender IP always, target IP in replies", hi: "Sender IP hamesha, target IP replies mein" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "One line, all keywords", hi: "Ek line, saare keywords" },
          text: {
            en: "Each `ip arp inspection validate` command replaces the previous one. Enter `ip arp inspection validate src-mac dst-mac ip` on one line; typing `validate src-mac` and then `validate ip` leaves only the ip check active.",
            hi: "Har `ip arp inspection validate` command pichhle wale ko replace kar deta hai. `ip arp inspection validate src-mac dst-mac ip` ek hi line mein daalo; pehle `validate src-mac` aur phir `validate ip` type karoge toh sirf ip check active bachega.",
          },
        },
      ],
    },
    {
      id: "rate-limit-and-verify",
      heading: { en: "Rate limiting and verification", hi: "Rate limiting aur verification" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Inspecting ARP costs CPU, so DAI limits ARP on untrusted ports to **15 packets per second** by default; trusted ports have no limit. A port that exceeds the limit is err-disabled. Change it with `ip arp inspection limit rate 25` on the interface, and recover ports with `shutdown` / `no shutdown` or `errdisable recovery cause arp-inspection`.",
            hi: "ARP inspect karne mein CPU lagta hai, isliye DAI by default untrusted ports par ARP ko **15 packets per second** tak limit karta hai; trusted ports par koi limit nahi. Limit cross karne wala port err-disable ho jaata hai. Interface par `ip arp inspection limit rate 25` se ise badlo, aur ports ko `shutdown` / `no shutdown` ya `errdisable recovery cause arp-inspection` se recover karo.",
          },
        },
        {
          type: "cli",
          title: { en: "Trust state and rate limit per port", hi: "Har port ki trust state aur rate limit" },
          lines: [
            { prompt: "SW1#", cmd: "show ip arp inspection interfaces" },
            { out: " Interface        Trust State     Rate (pps)    Burst Interval" },
            { out: " ---------------  -----------     ----------    --------------" },
            { out: " Gi0/1            Trusted               None               N/A" },
            { out: " Gi0/2            Untrusted               15                 1" },
            { out: " Gi0/3            Untrusted               15                 1" },
          ],
        },
        {
          type: "cli",
          title: { en: "Validation settings and per-VLAN counters (shortened)", hi: "Validation settings aur per-VLAN counters (chhota kiya hua)" },
          lines: [
            { prompt: "SW1#", cmd: "show ip arp inspection" },
            { out: "Source Mac Validation      : Enabled" },
            { out: "Destination Mac Validation : Enabled" },
            { out: "IP Address Validation      : Enabled" },
            { out: " Vlan     Configuration    Operation   ACL Match          Static ACL" },
            { out: " ----     -------------    ---------   ---------          ----------" },
            { out: "   10     Enabled          Active      STATIC-HOSTS       No" },
            { out: " Vlan      Forwarded        Dropped     DHCP Drops      ACL Drops" },
            { out: " ----      ---------        -------     ----------      ---------" },
            { out: "   10             42              5              5              0", comment: { en: "5 ARPs failed the binding check", hi: "5 ARPs binding check mein fail hue" } },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "ARP poisoning", def: { en: "Sending forged ARP messages so a host maps an IP, usually the gateway's, to the attacker's MAC.", hi: "Forged ARP messages bhejna taaki host kisi IP ko, aam taur par gateway ke, attacker ke MAC se map kar le." } },
    { term: "Man-in-the-middle (MITM)", def: { en: "An attack where traffic between two hosts passes through the attacker without either noticing.", hi: "Attack jisme do hosts ke beech ka traffic attacker se hokar jaata hai aur dono ko pata nahi chalta." } },
    { term: "Dynamic ARP Inspection (DAI)", def: { en: "A switch feature that checks ARP messages on untrusted ports against known IP-to-MAC bindings.", hi: "Switch feature jo untrusted ports par ARP messages ko known IP-to-MAC bindings se check karta hai." } },
    { term: "Untrusted port (DAI)", def: { en: "A port whose ARP messages are inspected and rate-limited; the default once DAI is on.", hi: "Woh port jiske ARP messages inspect aur rate-limit hote hain; DAI on hone par yahi default hai." } },
    { term: "ARP ACL", def: { en: "A list of permitted IP and MAC pairs used by DAI for hosts with static addresses.", hi: "Permitted IP aur MAC pairs ki list jo DAI static addresses wale hosts ke liye use karta hai." } },
    { term: "Gratuitous ARP", def: { en: "An ARP that announces the sender's own IP and MAC without a request; easy to forge.", hi: "Bina request ke sender ka apna IP aur MAC announce karne wala ARP; ise forge karna aasaan hai." } },
  ],
  commands: [
    { cmd: "ip arp inspection vlan <vlan-list>", mode: "Global config", does: { en: "Enable DAI on these VLANs", hi: "In VLANs par DAI enable karta hai" } },
    { cmd: "ip arp inspection trust", mode: "Interface config", does: { en: "Make the port trusted: ARP is not inspected", hi: "Port ko trusted banata hai: ARP inspect nahi hota" } },
    { cmd: "ip arp inspection validate src-mac dst-mac ip", mode: "Global config", does: { en: "Add the optional checks (all on one line)", hi: "Optional checks jodta hai (sab ek line mein)" } },
    { cmd: "ip arp inspection limit rate <pps>", mode: "Interface config", does: { en: "Change the ARP rate limit (default 15 pps on untrusted ports)", hi: "ARP rate limit badalta hai (untrusted ports par default 15 pps)" } },
    { cmd: "arp access-list <name>", mode: "Global config", does: { en: "Create an ARP ACL for static hosts", hi: "Static hosts ke liye ARP ACL banata hai" } },
    { cmd: "permit ip host <ip> mac host <mac>", mode: "ARP ACL config", does: { en: "Permit one IP and MAC pair", hi: "Ek IP aur MAC pair permit karta hai" } },
    { cmd: "ip arp inspection filter <acl> vlan <vlan>", mode: "Global config", does: { en: "Apply an ARP ACL to a VLAN", hi: "ARP ACL ko VLAN par apply karta hai" } },
    { cmd: "errdisable recovery cause arp-inspection", mode: "Global config", does: { en: "Auto-recover ports err-disabled by the DAI rate limit", hi: "DAI rate limit se err-disabled ports ko auto-recover karta hai" } },
    { cmd: "show ip arp inspection", mode: "Privileged EXEC", does: { en: "Show validation settings and per-VLAN forwarded/dropped counters", hi: "Validation settings aur per-VLAN forwarded/dropped counters dikhata hai" } },
    { cmd: "show ip arp inspection interfaces", mode: "Privileged EXEC", does: { en: "Show trust state and rate limit per port", hi: "Har port ki trust state aur rate limit dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Enabling DAI without DHCP snooping on that VLAN. There is no binding table, so every ARP from an untrusted port is dropped.",
      hi: "Us VLAN par DHCP snooping ke bina DAI enable karna. Binding table hi nahi hai, toh untrusted port ka har ARP drop hota hai.",
    },
    {
      en: "Leaving the port to the gateway router untrusted with no ARP ACL. R1's static IP has no binding, so its ARPs are dropped and hosts lose their gateway.",
      hi: "Gateway router wale port ko bina ARP ACL ke untrusted chhod dena. R1 ke static IP ki koi binding nahi, toh uske ARPs drop hote hain aur hosts gateway kho dete hain.",
    },
    {
      en: "Typing `ip arp inspection validate` several times with one keyword each. Only the last one stays; put all keywords on one line.",
      hi: "`ip arp inspection validate` ko alag-alag keyword ke saath kai baar type karna. Sirf aakhri wala bachta hai; saare keywords ek line mein daalo.",
    },
    {
      en: "Thinking DAI inspects trusted ports or checks IP packets. It inspects only ARP, and only on untrusted ports.",
      hi: "Sochna ki DAI trusted ports bhi inspect karta hai ya IP packets check karta hai. Woh sirf ARP inspect karta hai, aur sirf untrusted ports par.",
    },
    {
      en: "Forgetting the 15 pps default limit. A port with many hosts behind it (for example a small switch) can exceed it and be err-disabled; raise the rate or trust the port if it is an inter-switch link.",
      hi: "15 pps default limit bhool jaana. Jis port ke peeche bahut hosts hon (jaise chhota switch) woh limit cross karke err-disable ho sakta hai; rate badhao, ya agar inter-switch link hai toh port trust karo.",
    },
  ],
  recap: [
    { en: "ARP poisoning: a forged ARP maps the gateway IP to the attacker's MAC, giving a man-in-the-middle.", hi: "ARP poisoning: forged ARP gateway IP ko attacker ke MAC se map kar deta hai, aur man-in-the-middle ban jaata hai." },
    { en: "DAI inspects ARP on untrusted ports: sender IP and MAC must match the DHCP snooping binding table or an ARP ACL.", hi: "DAI untrusted ports par ARP inspect karta hai: sender IP aur MAC DHCP snooping binding table ya ARP ACL se match hone chahiye." },
    { en: "Invalid ARPs are dropped and logged (%SW_DAI-4-DHCP_SNOOPING_DENY); trusted ports are not checked.", hi: "Invalid ARPs drop aur log hote hain (%SW_DAI-4-DHCP_SNOOPING_DENY); trusted ports check nahi hote." },
    { en: "Trust uplinks and the gateway port; keep user ports untrusted; use ARP ACLs for static hosts.", hi: "Uplinks aur gateway port trust karo; user ports untrusted rakho; static hosts ke liye ARP ACLs use karo." },
    { en: "Optional checks: `validate src-mac dst-mac ip`, all on one line.", hi: "Optional checks: `validate src-mac dst-mac ip`, sab ek line mein." },
    { en: "Untrusted ports default to 15 ARP pps; exceeding it err-disables the port.", hi: "Untrusted ports ka default 15 ARP pps hai; isse zyada hone par port err-disable hota hai." },
  ],
  quiz: [
    {
      q: { en: "On an untrusted port, what does DAI compare an ARP message's sender IP and sender MAC with?", hi: "Untrusted port par DAI ARP message ke sender IP aur sender MAC ko kis cheez se compare karta hai?" },
      options: [
        { en: "The switch's MAC address table", hi: "Switch ki MAC address table" },
        { en: "The switch's own ARP cache", hi: "Switch ki apni ARP cache" },
        { en: "The DHCP snooping binding table, and any ARP ACLs", hi: "DHCP snooping binding table, aur koi ARP ACLs" },
        { en: "The port security sticky MAC list", hi: "Port security ki sticky MAC list" },
      ],
      answer: 2,
      explain: {
        en: "DAI uses the IP-to-MAC bindings that DHCP snooping recorded, plus ARP ACLs for static hosts. The MAC address table maps MACs to ports but knows nothing about IPs.",
        hi: "DAI woh IP-to-MAC bindings use karta hai jo DHCP snooping ne record ki, aur static hosts ke liye ARP ACLs. MAC address table MACs ko ports se map karti hai lekin IPs ke baare mein kuch nahi jaanti.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "After enabling DHCP snooping and `ip arp inspection vlan 10`, DHCP clients in VLAN 10 can ping each other but nobody can reach the gateway R1 (static IP 192.168.10.1) on Gi0/1. What fixes it?",
        hi: "DHCP snooping aur `ip arp inspection vlan 10` enable karne ke baad VLAN 10 ke DHCP clients ek doosre ko ping kar paate hain, lekin Gi0/1 par gateway R1 (static IP 192.168.10.1) tak koi nahi pahunchta. Kya fix karega?",
      },
      options: [
        { en: "`ip arp inspection trust` on Gi0/1", hi: "Gi0/1 par `ip arp inspection trust`" },
        { en: "`ip arp inspection validate ip`", hi: "`ip arp inspection validate ip`" },
        { en: "`ip arp inspection limit rate 100` on Gi0/1", hi: "Gi0/1 par `ip arp inspection limit rate 100`" },
        { en: "`switchport port-security` on Gi0/1", hi: "Gi0/1 par `switchport port-security`" },
      ],
      answer: 0,
      explain: {
        en: "R1 has no binding because its address is static, so its ARP messages on untrusted Gi0/1 fail inspection. Trusting the uplink (or permitting R1 in an ARP ACL) fixes it. The extra validation would only drop more.",
        hi: "R1 ki koi binding nahi kyunki uska address static hai, isliye untrusted Gi0/1 par uske ARP messages inspection fail karte hain. Uplink trust karna (ya ARP ACL mein R1 ko permit karna) fix hai. Extra validation se toh aur zyada drop hoga.",
      },
      kind: "scenario",
    },
    {
      q: { en: "What is the default DAI rate limit on an untrusted port, and what happens when it is exceeded?", hi: "Untrusted port par default DAI rate limit kya hai, aur cross hone par kya hota hai?" },
      options: [
        { en: "100 pps; extra ARPs are dropped", hi: "100 pps; extra ARPs drop hote hain" },
        { en: "15 pps; extra ARPs are queued", hi: "15 pps; extra ARPs queue hote hain" },
        { en: "No limit by default", hi: "By default koi limit nahi" },
        { en: "15 pps; the port is err-disabled", hi: "15 pps; port err-disable ho jaata hai" },
      ],
      answer: 3,
      explain: {
        en: "Untrusted ports allow 15 ARP packets per second by default, and a port that goes over is err-disabled. Trusted ports have no limit. Unlike DHCP snooping, DAI has a rate limit on by default.",
        hi: "Untrusted ports by default 15 ARP packets per second allow karte hain, aur zyada aane par port err-disable hota hai. Trusted ports par koi limit nahi. DHCP snooping se ulta, DAI mein rate limit by default on hota hai.",
      },
      kind: "concept",
    },
    {
      q: { en: "An engineer enters `ip arp inspection validate src-mac`, then `ip arp inspection validate dst-mac`, then `ip arp inspection validate ip`. Which checks are active?", hi: "Engineer pehle `ip arp inspection validate src-mac`, phir `ip arp inspection validate dst-mac`, phir `ip arp inspection validate ip` daalta hai. Kaunse checks active hain?" },
      options: [
        { en: "src-mac, dst-mac and ip", hi: "src-mac, dst-mac aur ip" },
        { en: "Only ip", hi: "Sirf ip" },
        { en: "Only src-mac", hi: "Sirf src-mac" },
        { en: "None, until DAI is re-enabled", hi: "Koi nahi, jab tak DAI dobara enable na ho" },
      ],
      answer: 1,
      explain: {
        en: "Each `validate` command overwrites the previous one, so only the last (ip) remains. To get all three, enter `ip arp inspection validate src-mac dst-mac ip`.",
        hi: "Har `validate` command pichhle ko overwrite karta hai, isliye sirf aakhri (ip) bachta hai. Teeno chahiye toh `ip arp inspection validate src-mac dst-mac ip` daalo.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "SW1 logs `%SW_DAI-4-DHCP_SNOOPING_DENY: 1 Invalid ARPs (Res) on Gi0/3, vlan 10.([0050.56aa.0066/192.168.10.1/0050.56aa.0011/192.168.10.11/...])`. What happened?",
        hi: "SW1 log karta hai `%SW_DAI-4-DHCP_SNOOPING_DENY: 1 Invalid ARPs (Res) on Gi0/3, vlan 10.([0050.56aa.0066/192.168.10.1/0050.56aa.0011/192.168.10.11/...])`. Kya hua?",
      },
      options: [
        { en: "The gateway on Gi0/3 changed its MAC address", hi: "Gi0/3 par gateway ne apna MAC address badla" },
        { en: "192.168.10.11 sent a request that was rate-limited", hi: "192.168.10.11 ki request rate-limit hui" },
        { en: "The device on Gi0/3 sent a reply claiming 192.168.10.1 to 192.168.10.11, and DAI dropped it", hi: "Gi0/3 wale device ne 192.168.10.11 ko 192.168.10.1 claim karta reply bheja, aur DAI ne drop kar diya" },
        { en: "Gi0/3 is err-disabled", hi: "Gi0/3 err-disabled hai" },
      ],
      answer: 2,
      explain: {
        en: "The bracket reads sender MAC / sender IP / target MAC / target IP. 0050.56aa.0066 on Gi0/3 claimed to be 192.168.10.1 in a reply (Res) to PC-A. No binding matched, so DAI denied it. A rate-limit event would err-disable the port with a different message.",
        hi: "Bracket ka order hai sender MAC / sender IP / target MAC / target IP. Gi0/3 par 0050.56aa.0066 ne PC-A ko reply (Res) mein khud ko 192.168.10.1 bataya. Koi binding match nahi hui, isliye DAI ne deny kiya. Rate-limit event alag message ke saath port err-disable karta.",
      },
      kind: "cli",
    },
    {
      q: { en: "A file server with static IP 192.168.10.20 sits on an untrusted access port in a DAI-protected VLAN, and its ARPs are being dropped. What is the best fix?", hi: "Static IP 192.168.10.20 wala file server DAI-protected VLAN ke untrusted access port par hai, aur uske ARPs drop ho rahe hain. Sabse accha fix kya hai?" },
      options: [
        { en: "Trust the server's port", hi: "Server ka port trust karo" },
        { en: "Disable DAI on the VLAN", hi: "VLAN par DAI disable karo" },
        { en: "Add `ip dhcp snooping trust` on the server's port", hi: "Server ke port par `ip dhcp snooping trust` lagao" },
        { en: "Permit its IP and MAC in an ARP ACL and apply it with `ip arp inspection filter`", hi: "Uska IP aur MAC ARP ACL mein permit karo aur `ip arp inspection filter` se apply karo" },
      ],
      answer: 3,
      explain: {
        en: "A static host has no DHCP binding, so DAI needs an ARP ACL that permits exactly that IP and MAC pair. Trusting the port would also work, but it disables inspection for whatever is plugged in there later.",
        hi: "Static host ki DHCP binding nahi hoti, isliye DAI ko ek ARP ACL chahiye jo exactly woh IP aur MAC pair permit kare. Port trust karna bhi chalega, lekin baad mein wahan jo bhi lagega uski inspection band ho jaayegi.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "HwbTKaIvL6s",
      title: "Free CCNA | Dynamic ARP Inspection | Day 51",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "ARP poisoning, how DAI uses the binding table, ARP ACLs, validation and rate limits.", hi: "ARP poisoning, DAI binding table kaise use karta hai, ARP ACLs, validation aur rate limits." },
    },
    {
      id: "oLF2mbmYMAk",
      title: "Free CCNA | Dynamic ARP Inspection | Day 51 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Packet Tracer lab to practise DAI configuration.", hi: "DAI configuration practise karne ke liye Packet Tracer lab." },
    },
    {
      id: "j9AQOWVFwgY",
      title: "138. Free CCNA (NEW) | Network Security - Dynamic ARP Inspection | CCNA 200-301 Full Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "DAI theory and configuration in Hindi.", hi: "DAI ki theory aur configuration Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Protect VLAN 10 with DAI", hi: "VLAN 10 ko DAI se protect karo" },
    steps: [
      { en: "Start from the DHCP snooping lab: R1 (192.168.10.1, DHCP server) on SW1 Gi0/1, PCs on Gi0/2 and Gi0/3, snooping on VLAN 10 with Gi0/1 trusted. Confirm both PCs appear in `show ip dhcp snooping binding`.", hi: "DHCP snooping lab se shuru karo: R1 (192.168.10.1, DHCP server) SW1 Gi0/1 par, PCs Gi0/2 aur Gi0/3 par, VLAN 10 par snooping aur Gi0/1 trusted. Confirm karo ki dono PCs `show ip dhcp snooping binding` mein dikh rahe hain." },
      { en: "Enter `ip arp inspection vlan 10` only. Ping 192.168.10.1 from a PC after clearing its ARP cache (`arp -d`). It fails: why?", hi: "Sirf `ip arp inspection vlan 10` daalo. PC ki ARP cache clear karke (`arp -d`) 192.168.10.1 ping karo. Fail hoga: kyun?" },
      { en: "Add `ip arp inspection trust` on Gi0/1 and ping again. Check `show ip arp inspection interfaces`.", hi: "Gi0/1 par `ip arp inspection trust` lagao aur dobara ping karo. `show ip arp inspection interfaces` check karo." },
      { en: "Give the Gi0/3 PC a static IP of 192.168.10.50 and ping from it. Watch the drop counters in `show ip arp inspection`.", hi: "Gi0/3 wale PC ko static IP 192.168.10.50 do aur usse ping karo. `show ip arp inspection` mein drop counters dekho." },
      { en: "Write an ARP ACL permitting 192.168.10.50 with that PC's MAC, apply it with `ip arp inspection filter`, and confirm the ping now works. If your Packet Tracer version does not accept `arp access-list`, do this step on real gear or Cisco CML.", hi: "Us PC ke MAC ke saath 192.168.10.50 permit karne wala ARP ACL likho, `ip arp inspection filter` se apply karo, aur confirm karo ki ab ping chalta hai. Agar tumhara Packet Tracer version `arp access-list` accept nahi karta, toh yeh step real gear ya Cisco CML par karo." },
    ],
  },
};

export default lesson;
