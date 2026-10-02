import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "dhcp-snooping",
  intro: {
    en: "DHCP has no authentication: a client accepts the first Offer it hears. Anyone who connects a DHCP server to an access port, on purpose or by accident, can hand out addresses and name themselves as the default gateway or DNS server. DHCP snooping lets the access switch tell server ports from user ports, drop server messages that come from user ports, and record which client got which address. Dynamic ARP Inspection, the next lesson, is built on that record.",
    hi: "DHCP mein koi authentication nahi hai: client jo pehla Offer sunta hai wahi accept kar leta hai. Koi bhi access port par DHCP server laga de, jaan boojh kar ya galti se, toh woh addresses baant sakta hai aur khud ko default gateway ya DNS server bana sakta hai. DHCP snooping se access switch server ports aur user ports mein farak karta hai, user ports se aane wale server messages drop karta hai, aur record rakhta hai ki kis client ko kaunsa address mila. Agla lesson, Dynamic ARP Inspection, isi record par bana hai.",
  },
  outcomes: [
    { en: "Explain the rogue DHCP server and DHCP starvation attacks", hi: "Rogue DHCP server aur DHCP starvation attacks samjha sako" },
    { en: "Sort DHCP messages into client and server messages and predict what snooping does with each on trusted and untrusted ports", hi: "DHCP messages ko client aur server messages mein baant sako aur predict kar sako ki trusted aur untrusted ports par snooping har ek ke saath kya karta hai" },
    { en: "Configure DHCP snooping globally and per VLAN, trust the uplink, and set a rate limit", hi: "DHCP snooping globally aur per VLAN configure kar sako, uplink ko trust kar sako, aur rate limit set kar sako" },
    { en: "Read the DHCP snooping binding table and say which features depend on it", hi: "DHCP snooping binding table padh sako aur bata sako kaunse features us par depend karte hain" },
    { en: "Fix the option 82 problem that stops a router DHCP server from answering", hi: "Option 82 wali problem fix kar sako jisse router DHCP server jawab dena band kar deta hai" },
  ],
  sections: [
    {
      id: "attacks-on-dhcp",
      heading: { en: "Two attacks on DHCP", hi: "DHCP par do attacks" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Recall DORA from lesson 4.1: the client broadcasts a **Discover**, servers answer with an **Offer**, the client broadcasts a **Request** for one Offer, and that server confirms with an **Ack**. The client takes the first Offer that arrives and trusts every option in it: IP address, mask, default gateway, DNS server.",
            hi: "Lesson 4.1 ka DORA yaad karo: client **Discover** broadcast karta hai, servers **Offer** se jawab dete hain, client ek Offer ke liye **Request** broadcast karta hai, aur woh server **Ack** se confirm karta hai. Client jo Offer pehle pahunche wahi le leta hai aur uske har option par bharosa karta hai: IP address, mask, default gateway, DNS server.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Rogue DHCP server (DHCP spoofing)**: an attacker runs a DHCP server on a laptop in VLAN 10. If its Offer arrives first, the victim gets `192.168.10.66` (the attacker) as its default gateway or DNS server. Every packet leaving the subnet, or every name lookup, now goes through the attacker: a man-in-the-middle.",
              hi: "**Rogue DHCP server (DHCP spoofing)**: attacker VLAN 10 mein laptop par DHCP server chalata hai. Agar uska Offer pehle pahunch gaya, toh victim ko default gateway ya DNS server `192.168.10.66` (attacker) milta hai. Ab subnet se bahar jaane wala har packet, ya har name lookup, attacker se hokar jaata hai: man-in-the-middle.",
            },
            {
              en: "**Accidental rogue server**: someone plugs a home Wi-Fi router into the office LAN through one of its LAN ports. Its built-in DHCP server starts handing out `192.168.0.x` addresses and half the floor loses the network. This is far more common than a real attack.",
              hi: "**Galti se rogue server**: koi ghar ka Wi-Fi router office LAN mein uske LAN port se laga deta hai. Uska built-in DHCP server `192.168.0.x` addresses baantne lagta hai aur aadhe floor ka network chala jaata hai. Yeh asli attack se kahin zyada common hai.",
            },
            {
              en: "**DHCP starvation**: a tool sends thousands of Discovers, each with a different fake client MAC. The real server leases out its whole pool to clients that do not exist, so real clients get nothing (a DoS). Attackers often follow it with a rogue server, which is now the only one with addresses left.",
              hi: "**DHCP starvation**: ek tool hazaaron Discovers bhejta hai, har ek mein alag fake client MAC. Asli server apna poora pool aise clients ko lease kar deta hai jo exist hi nahi karte, toh asli clients ko kuch nahi milta (DoS). Attackers aksar iske baad rogue server chalate hain, jo ab akela server hai jiske paas addresses bache hain.",
            },
          ],
        },
      ],
    },
    {
      id: "trusted-and-untrusted",
      heading: { en: "Trusted and untrusted ports", hi: "Trusted aur untrusted ports" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Once DHCP snooping is on for a VLAN, **every port in that VLAN is untrusted** by default. You mark as **trusted** only the ports that lead towards the real DHCP server: the port to the server or router itself, or the uplink trunk to the distribution switch that leads there. User ports stay untrusted.",
            hi: "Kisi VLAN par DHCP snooping on hote hi **us VLAN ka har port by default untrusted** ho jaata hai. **Trusted** sirf un ports ko banate ho jo asli DHCP server ki taraf jaate hain: server ya router wala port khud, ya distribution switch ki taraf wala uplink trunk jo wahan tak le jaata hai. User ports untrusted hi rehte hain.",
          },
        },
        {
          type: "table",
          caption: { en: "What snooping does with each message on an untrusted port", hi: "Untrusted port par snooping har message ke saath kya karta hai" },
          columns: [{ en: "Message", hi: "Message" }, { en: "Sent by", hi: "Kaun bhejta hai" }, { en: "On an untrusted port", hi: "Untrusted port par" }],
          rows: [
            ["DHCPOFFER, DHCPACK, DHCPNAK", { en: "Server", hi: "Server" }, { en: "Always dropped", hi: "Hamesha drop" }],
            ["DHCPDISCOVER, DHCPREQUEST", { en: "Client", hi: "Client" }, { en: "Checked, then forwarded out trusted ports only", hi: "Check hota hai, phir sirf trusted ports se forward" }],
            ["DHCPRELEASE, DHCPDECLINE", { en: "Client", hi: "Client" }, { en: "Dropped if the binding for that IP is on a different port", hi: "Drop agar us IP ki binding kisi doosre port par hai" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "The checks on client messages: by default the frame's source MAC must match the client hardware address (`chaddr`) inside the DHCP message, and a packet that already carries relay information (option 82, or a non-zero `giaddr`) is dropped, because a user port should never deliver relayed DHCP. A client message that passes is sent only out **trusted** ports, towards the real server, not flooded to other user ports. On a trusted port nothing is checked; every DHCP message is forwarded.",
            hi: "Client messages par checks: by default frame ka source MAC DHCP message ke andar wale client hardware address (`chaddr`) se match hona chahiye, aur jis packet mein pehle se relay information ho (option 82, ya non-zero `giaddr`) woh drop hota hai, kyunki user port se relayed DHCP kabhi aana hi nahi chahiye. Check pass karne wala client message sirf **trusted** ports se, yaani asli server ki taraf, bheja jaata hai; baaki user ports par flood nahi hota. Trusted port par kuch check nahi hota; har DHCP message forward hota hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Snooping does not stop clients on untrusted ports from getting addresses. It stops **server** messages (Offer, Ack, NAK) from entering on untrusted ports. So a rogue server on a user port never receives the clients' Discovers, and any Offer it sends anyway is dropped.",
            hi: "Snooping untrusted ports wale clients ko address lene se nahi rokta. Woh **server** messages (Offer, Ack, NAK) ko untrusted ports se andar aane se rokta hai. Toh user port par baithe rogue server tak clients ke Discovers pahunchte hi nahi, aur woh phir bhi Offer bheje toh drop ho jaata hai.",
          },
        },
      ],
    },
    {
      id: "binding-table",
      heading: { en: "The binding table", hi: "Binding table" },
      blocks: [
        {
          type: "p",
          text: {
            en: "When a server's Ack passes from a trusted port to a client on an untrusted port, the switch records a **binding**: client MAC, leased IP, lease time, VLAN and interface. The entry is removed when the lease expires or the client sends a valid Release.",
            hi: "Jab server ka Ack trusted port se untrusted port wale client tak jaata hai, switch ek **binding** record karta hai: client MAC, leased IP, lease time, VLAN aur interface. Lease expire hone par ya client ke valid Release bhejne par entry hat jaati hai.",
          },
        },
        {
          type: "cli",
          lines: [
            { prompt: "SW1#", cmd: "show ip dhcp snooping binding" },
            { out: "MacAddress          IpAddress        Lease(sec)  Type           VLAN  Interface" },
            { out: "------------------  ---------------  ----------  -------------  ----  --------------------" },
            { out: "00:50:56:AA:00:11   192.168.10.11    86353       dhcp-snooping   10    GigabitEthernet0/2", comment: { en: "PC-A: MAC 0050.56aa.0011, printed with colons here", hi: "PC-A: MAC 0050.56aa.0011, yahan colons ke saath print hota hai" } },
            { out: "Total number of bindings: 1" },
          ],
          note: {
            en: "The lease counts down from 86400 seconds, the default 1-day lease of a Cisco IOS DHCP pool.",
            hi: "Lease 86400 seconds se neeche ginta hai, jo Cisco IOS DHCP pool ka default 1 din ka lease hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "The table is the switch's list of who legitimately owns which IP on which port. **Dynamic ARP Inspection** (lesson 5.8) uses it to reject forged ARP messages, and **IP Source Guard** (beyond the CCNA) uses it to drop IP packets with a spoofed source address.",
            hi: "Yeh table switch ki list hai ki kaunsa IP kis port par asal mein kiska hai. **Dynamic ARP Inspection** (lesson 5.8) ise forged ARP messages reject karne ke liye use karta hai, aur **IP Source Guard** (CCNA se aage) ise spoofed source address wale IP packets drop karne ke liye use karta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Bindings live in RAM", hi: "Bindings RAM mein rehti hain" },
          text: {
            en: "The binding table is lost when the switch reloads, and clients are not re-checked until they renew. On production switches it is often saved to flash with `ip dhcp snooping database`, which is beyond the CCNA.",
            hi: "Switch reload hone par binding table chali jaati hai, aur clients tab tak dobara check nahi hote jab tak renew na karein. Production switches par ise aksar `ip dhcp snooping database` se flash mein save karte hain, jo CCNA se aage hai.",
          },
        },
      ],
    },
    {
      id: "configure",
      heading: { en: "Configuring DHCP snooping", hi: "DHCP snooping configure karna" },
      blocks: [
        {
          type: "steps",
          items: [
            { en: "Enable it globally with `ip dhcp snooping`.", hi: "`ip dhcp snooping` se globally enable karo." },
            { en: "Enable it for each VLAN with `ip dhcp snooping vlan 10`. Without this step snooping does nothing.", hi: "Har VLAN ke liye `ip dhcp snooping vlan 10` se enable karo. Iske bina snooping kuch nahi karta." },
            { en: "Trust the port towards the real server with `ip dhcp snooping trust`.", hi: "Asli server ki taraf wale port ko `ip dhcp snooping trust` se trust karo." },
            { en: "Optionally rate-limit DHCP on user ports and turn off option 82 insertion if there is no relay agent (next section).", hi: "Optional: user ports par DHCP rate-limit karo, aur relay agent na ho toh option 82 insertion band karo (agla section)." },
          ],
        },
        {
          type: "cli",
          title: { en: "SW1: R1 (the DHCP server) on Gi0/1, users on Gi0/2 and Gi0/3", hi: "SW1: R1 (DHCP server) Gi0/1 par, users Gi0/2 aur Gi0/3 par" },
          lines: [
            { prompt: "SW1(config)#", cmd: "ip dhcp snooping" },
            { prompt: "SW1(config)#", cmd: "ip dhcp snooping vlan 10" },
            { prompt: "SW1(config)#", cmd: "no ip dhcp snooping information option", comment: { en: "R1 is the server itself, no relay in between", hi: "R1 khud server hai, beech mein koi relay nahi" } },
            { prompt: "SW1(config)#", cmd: "interface gigabitethernet0/1" },
            { prompt: "SW1(config-if)#", cmd: "ip dhcp snooping trust" },
            { prompt: "SW1(config-if)#", cmd: "interface range gigabitethernet0/2 - 3" },
            { prompt: "SW1(config-if-range)#", cmd: "ip dhcp snooping limit rate 10", comment: { en: "Max 10 DHCP packets per second per port", hi: "Har port par max 10 DHCP packets per second" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Forget the trust and everyone loses DHCP", hi: "Trust bhool gaye toh sabka DHCP band" },
          text: {
            en: "If you enable snooping on VLAN 10 but forget `ip dhcp snooping trust` on the uplink, the real server's Offers arrive on an untrusted port and are dropped. Every client ends up with a 169.254.x.x address.",
            hi: "VLAN 10 par snooping enable kiya lekin uplink par `ip dhcp snooping trust` bhool gaye, toh asli server ke Offers untrusted port par aate hain aur drop ho jaate hain. Har client ke paas 169.254.x.x address aa jaata hai.",
          },
        },
      ],
    },
    {
      id: "option-82",
      heading: { en: "Option 82: the default that can break DHCP", hi: "Option 82: woh default jo DHCP tod sakta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "With snooping on, a Cisco switch by default inserts **option 82** (relay agent information) into client requests. It records which switch and which port the request came in on, which servers and relays can use for policy. The switch is not a relay, though, so it leaves `giaddr` at 0.0.0.0.",
            hi: "Snooping on hone par Cisco switch by default client requests mein **option 82** (relay agent information) daal deta hai. Isme likha hota hai ki request kis switch ke kis port se aayi, jise servers aur relays policy ke liye use kar sakte hain. Lekin switch relay nahi hai, isliye `giaddr` ko 0.0.0.0 hi chhod deta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "A Cisco IOS router acting as DHCP server sees option 82 with a zero `giaddr`, treats the packet as inconsistent and drops it. Clients get no address even though snooping and trust are configured correctly. Two fixes:",
            hi: "DHCP server bana Cisco IOS router option 82 ke saath zero `giaddr` dekhta hai, packet ko inconsistent maan kar drop kar deta hai. Snooping aur trust sahi configure hone ke baad bhi clients ko address nahi milta. Do fixes hain:",
          },
        },
        {
          type: "list",
          items: [
            { en: "On the switch: `no ip dhcp snooping information option` stops the insertion. This is the usual CCNA answer.", hi: "Switch par: `no ip dhcp snooping information option` insertion band kar deta hai. CCNA mein aam taur par yahi answer hai." },
            { en: "On the router's client-facing interface: `ip dhcp relay information trusted` tells it to accept such packets.", hi: "Router ke client wale interface par: `ip dhcp relay information trusted` use aise packets accept karne ko bolta hai." },
          ],
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
            en: "A normal client sends a handful of DHCP messages when it boots. A starvation tool sends thousands. `ip dhcp snooping limit rate 10` on an untrusted port err-disables the port if more than 10 DHCP packets per second arrive. There is no limit by default. Recover the port like any err-disabled port: `shutdown` and `no shutdown`, or `errdisable recovery cause dhcp-rate-limit`.",
            hi: "Normal client boot hote waqt gine-chune DHCP messages bhejta hai. Starvation tool hazaaron bhejta hai. Untrusted port par `ip dhcp snooping limit rate 10` lagao, toh ek second mein 10 se zyada DHCP packets aane par port err-disable ho jaata hai. By default koi limit nahi hai. Port ko kisi bhi err-disabled port ki tarah recover karo: `shutdown` aur `no shutdown`, ya `errdisable recovery cause dhcp-rate-limit`.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Starvation needs more than one check", hi: "Starvation ke liye ek check kaafi nahi" },
          text: {
            en: "The source MAC versus `chaddr` check catches a tool that fakes only the MAC inside the DHCP message. A tool that also fakes the Ethernet source MAC passes that check, so combine the rate limit with port security (lesson 5.6), which caps the MACs per port.",
            hi: "Source MAC vs `chaddr` check us tool ko pakad leta hai jo sirf DHCP message ke andar wala MAC fake karta hai. Jo tool Ethernet source MAC bhi fake kare, woh yeh check paar kar leta hai, isliye rate limit ko port security (lesson 5.6) ke saath milao, jo har port par MACs ki limit lagati hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Snooping status (shortened)", hi: "Snooping status (chhota kiya hua)" },
          lines: [
            { prompt: "SW1#", cmd: "show ip dhcp snooping" },
            { out: "Switch DHCP snooping is enabled" },
            { out: "DHCP snooping is configured on following VLANs:" },
            { out: "10" },
            { out: "DHCP snooping is operational on following VLANs:" },
            { out: "10" },
            { out: "Insertion of option 82 is disabled" },
            { out: "Verification of hwaddr field is enabled", comment: { en: "The source MAC vs chaddr check", hi: "Source MAC vs chaddr wala check" } },
            { out: "Interface                  Trusted    Allow option    Rate limit (pps)" },
            { out: "-----------------------    -------    ------------    ----------------" },
            { out: "GigabitEthernet0/1         yes        yes             unlimited" },
            { out: "GigabitEthernet0/2         no         no              10" },
            { out: "GigabitEthernet0/3         no         no              10" },
          ],
          note: {
            en: "Gi0/1 is trusted with no rate limit. The user ports are untrusted and err-disable above 10 DHCP packets per second.",
            hi: "Gi0/1 trusted hai aur uspar koi rate limit nahi. User ports untrusted hain aur 10 DHCP packets per second se upar err-disable ho jaate hain.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "DHCP snooping", def: { en: "A switch feature that filters DHCP messages per port and records client leases in a binding table.", hi: "Switch feature jo har port par DHCP messages filter karta hai aur client leases ko binding table mein record karta hai." } },
    { term: "Rogue DHCP server", def: { en: "An unauthorised DHCP server that hands out addresses, often naming itself as gateway or DNS.", hi: "Bina permission ka DHCP server jo addresses baantta hai, aksar khud ko gateway ya DNS bata kar." } },
    { term: "DHCP starvation", def: { en: "An attack that leases out a server's whole pool using fake client MACs.", hi: "Attack jisme fake client MACs se server ka poora pool lease kar liya jaata hai." } },
    { term: "Trusted port", def: { en: "A port where all DHCP messages, including server messages, are forwarded without checks.", hi: "Woh port jahan server messages samet saare DHCP messages bina check ke forward hote hain." } },
    { term: "Untrusted port", def: { en: "The default for every port in a snooped VLAN: server messages are dropped and client messages are checked.", hi: "Snooped VLAN ke har port ka default: server messages drop hote hain aur client messages check hote hain." } },
    { term: "Binding table", def: { en: "The snooping record of client MAC, IP, lease, VLAN and interface, used by DAI and IP Source Guard.", hi: "Snooping ka record: client MAC, IP, lease, VLAN aur interface, jise DAI aur IP Source Guard use karte hain." } },
    { term: "Option 82", def: { en: "DHCP relay agent information that a snooping switch inserts by default to identify the switch and port.", hi: "DHCP relay agent information jo snooping switch by default daalta hai taaki switch aur port pehchaane ja sakein." } },
  ],
  commands: [
    { cmd: "ip dhcp snooping", mode: "Global config", does: { en: "Enable DHCP snooping on the switch", hi: "Switch par DHCP snooping enable karta hai" } },
    { cmd: "ip dhcp snooping vlan <vlan-list>", mode: "Global config", does: { en: "Enable snooping for these VLANs (required)", hi: "In VLANs ke liye snooping enable karta hai (zaroori)" } },
    { cmd: "ip dhcp snooping trust", mode: "Interface config", does: { en: "Make the port trusted (towards the real server)", hi: "Port ko trusted banata hai (asli server ki taraf)" } },
    { cmd: "ip dhcp snooping limit rate <pps>", mode: "Interface config", does: { en: "Err-disable the port above this many DHCP packets per second", hi: "Itne DHCP packets per second se zyada aane par port err-disable karta hai" } },
    { cmd: "no ip dhcp snooping information option", mode: "Global config", does: { en: "Stop inserting option 82 into client requests", hi: "Client requests mein option 82 daalna band karta hai" } },
    { cmd: "errdisable recovery cause dhcp-rate-limit", mode: "Global config", does: { en: "Auto-recover ports err-disabled by the DHCP rate limit", hi: "DHCP rate limit se err-disabled ports ko auto-recover karta hai" } },
    { cmd: "show ip dhcp snooping", mode: "Privileged EXEC", does: { en: "Show VLANs, option 82 setting, trusted ports and rate limits", hi: "VLANs, option 82 setting, trusted ports aur rate limits dikhata hai" } },
    { cmd: "show ip dhcp snooping binding", mode: "Privileged EXEC", does: { en: "Show the binding table", hi: "Binding table dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Enabling `ip dhcp snooping` globally but not `ip dhcp snooping vlan 10`. Snooping is then not active in any VLAN.",
      hi: "`ip dhcp snooping` globally enable karna lekin `ip dhcp snooping vlan 10` nahi. Tab snooping kisi VLAN mein active nahi hota.",
    },
    {
      en: "Forgetting `ip dhcp snooping trust` on the uplink. The real server's Offers and Acks are dropped and clients fall back to 169.254.x.x.",
      hi: "Uplink par `ip dhcp snooping trust` bhool jaana. Asli server ke Offers aur Acks drop ho jaate hain aur clients 169.254.x.x par aa jaate hain.",
    },
    {
      en: "Trusting user ports \"to be safe\". A trusted port forwards everything, so a rogue server there works again.",
      hi: "\"Safe rehne ke liye\" user ports ko trust kar dena. Trusted port sab kuch forward karta hai, toh wahan rogue server phir se kaam karne lagta hai.",
    },
    {
      en: "Thinking snooping blocks Discovers or Requests on untrusted ports. It checks client messages and forwards them towards trusted ports; it drops server messages.",
      hi: "Sochna ki snooping untrusted ports par Discovers ya Requests block karta hai. Woh client messages check karke trusted ports ki taraf forward karta hai; server messages drop karta hai.",
    },
    {
      en: "Leaving option 82 insertion on when the switch talks directly to a Cisco IOS router DHCP server. Use `no ip dhcp snooping information option`.",
      hi: "Switch jab seedha Cisco IOS router DHCP server se baat kar raha ho tab bhi option 82 insertion on chhod dena. `no ip dhcp snooping information option` use karo.",
    },
  ],
  recap: [
    { en: "Rogue servers and starvation exist because DHCP has no authentication and clients take the first Offer.", hi: "Rogue servers aur starvation isliye hain kyunki DHCP mein authentication nahi hai aur client pehla Offer le leta hai." },
    { en: "All ports are untrusted once snooping is on; trust only the ports towards the real server.", hi: "Snooping on hote hi saare ports untrusted; sirf asli server ki taraf wale ports trust karo." },
    { en: "Untrusted ports: Offer, Ack and NAK dropped; Discover and Request checked, then sent out trusted ports.", hi: "Untrusted ports par: Offer, Ack aur NAK drop; Discover aur Request check hokar trusted ports se aage jaate hain." },
    { en: "The binding table holds MAC, IP, lease, VLAN and interface; DAI depends on it.", hi: "Binding table mein MAC, IP, lease, VLAN aur interface hote hain; DAI is par depend karta hai." },
    { en: "Config: `ip dhcp snooping`, `ip dhcp snooping vlan 10`, `ip dhcp snooping trust` on the uplink.", hi: "Config: `ip dhcp snooping`, `ip dhcp snooping vlan 10`, uplink par `ip dhcp snooping trust`." },
    { en: "`limit rate` err-disables a flooding port; `no ip dhcp snooping information option` fixes the option 82 drop.", hi: "`limit rate` flood karne wale port ko err-disable karta hai; `no ip dhcp snooping information option` option 82 wala drop fix karta hai." },
  ],
  quiz: [
    {
      q: {
        en: "You enable `ip dhcp snooping` and `ip dhcp snooping vlan 10` on SW1. Now no PC in VLAN 10 gets an address. The DHCP server is reached through Gi0/1. What is the most likely fix?",
        hi: "Tumne SW1 par `ip dhcp snooping` aur `ip dhcp snooping vlan 10` enable kiya. Ab VLAN 10 ke kisi PC ko address nahi milta. DHCP server Gi0/1 ke through milta hai. Sabse likely fix kya hai?",
      },
      options: [
        { en: "`ip dhcp snooping limit rate 100` on the PC ports", hi: "PC ports par `ip dhcp snooping limit rate 100`" },
        { en: "`ip helper-address` on Gi0/1", hi: "Gi0/1 par `ip helper-address`" },
        { en: "`switchport mode access` on Gi0/1", hi: "Gi0/1 par `switchport mode access`" },
        { en: "`ip dhcp snooping trust` on Gi0/1", hi: "Gi0/1 par `ip dhcp snooping trust`" },
      ],
      answer: 3,
      explain: {
        en: "All ports start untrusted, so the server's Offers arriving on Gi0/1 are dropped. Trusting Gi0/1 lets them through. A helper address belongs on a router interface, not a Layer 2 switch port.",
        hi: "Saare ports untrusted se shuru hote hain, isliye Gi0/1 par aane wale server ke Offers drop ho rahe hain. Gi0/1 ko trust karne se woh pass ho jaayenge. Helper address router interface par lagta hai, Layer 2 switch port par nahi.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which DHCP message is always dropped when it arrives on an untrusted port?", hi: "Untrusted port par aane wala kaunsa DHCP message hamesha drop hota hai?" },
      options: [
        { en: "DHCPDISCOVER", hi: "DHCPDISCOVER" },
        { en: "DHCPOFFER", hi: "DHCPOFFER" },
        { en: "DHCPREQUEST", hi: "DHCPREQUEST" },
        { en: "DHCPRELEASE", hi: "DHCPRELEASE" },
      ],
      answer: 1,
      explain: {
        en: "Offer is a server message, and server messages (Offer, Ack, NAK) are never accepted on untrusted ports. Discover and Request are client messages that are checked and forwarded towards trusted ports. A Release is dropped only if it fails the binding check.",
        hi: "Offer server message hai, aur server messages (Offer, Ack, NAK) untrusted ports par kabhi accept nahi hote. Discover aur Request client messages hain jo check hokar trusted ports ki taraf forward hote hain. Release sirf tab drop hota hai jab binding check fail ho.",
      },
      kind: "concept",
    },
    {
      q: { en: "Which information does a DHCP snooping binding entry contain?", hi: "DHCP snooping binding entry mein kaunsi information hoti hai?" },
      options: [
        { en: "Client MAC, leased IP, lease time, VLAN and switch interface", hi: "Client MAC, leased IP, lease time, VLAN aur switch interface" },
        { en: "Server IP, pool name, default gateway and DNS server", hi: "Server IP, pool name, default gateway aur DNS server" },
        { en: "Client hostname, IP address and ARP age", hi: "Client hostname, IP address aur ARP age" },
        { en: "Only the client MAC and the switch interface", hi: "Sirf client MAC aur switch interface" },
      ],
      answer: 0,
      explain: {
        en: "`show ip dhcp snooping binding` lists MacAddress, IpAddress, Lease(sec), Type, VLAN and Interface. The IP-to-MAC-to-port mapping is what DAI later checks ARP against.",
        hi: "`show ip dhcp snooping binding` MacAddress, IpAddress, Lease(sec), Type, VLAN aur Interface dikhata hai. Yahi IP-MAC-port mapping baad mein DAI ARP check karne ke liye use karta hai.",
      },
      kind: "cli",
    },
    {
      q: { en: "An attacker's tool sends thousands of DHCP Discovers per second, each with a different client MAC, until the server's pool is empty. What is this attack called?", hi: "Attacker ka tool har second hazaaron DHCP Discovers bhejta hai, har ek mein alag client MAC, jab tak server ka pool khaali na ho jaaye. Is attack ko kya kehte hain?" },
      options: [
        { en: "DHCP spoofing", hi: "DHCP spoofing" },
        { en: "ARP poisoning", hi: "ARP poisoning" },
        { en: "DHCP starvation", hi: "DHCP starvation" },
        { en: "MAC flooding", hi: "MAC flooding" },
      ],
      answer: 2,
      explain: {
        en: "Exhausting the pool with fake clients is DHCP starvation. DHCP spoofing means running a rogue server. MAC flooding targets the switch's MAC table, not the DHCP pool.",
        hi: "Fake clients se pool khatam karna DHCP starvation hai. DHCP spoofing ka matlab rogue server chalana hai. MAC flooding switch ki MAC table ko target karta hai, DHCP pool ko nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "SW1 runs DHCP snooping on VLAN 10 with Gi0/1 trusted. Gi0/1 connects straight to R1, which is the DHCP server; there is no relay. Clients still get no address and R1 shows no leases. What should you change?",
        hi: "SW1 VLAN 10 par DHCP snooping chala raha hai aur Gi0/1 trusted hai. Gi0/1 seedha R1 se juda hai, jo DHCP server hai; beech mein koi relay nahi. Clients ko ab bhi address nahi milta aur R1 par koi lease nahi dikhti. Kya badalna chahiye?",
      },
      options: [
        { en: "Add `ip dhcp snooping trust` on the client ports", hi: "Client ports par `ip dhcp snooping trust` lagao" },
        { en: "Enter `no ip dhcp snooping information option` on SW1", hi: "SW1 par `no ip dhcp snooping information option` daalo" },
        { en: "Remove `ip dhcp snooping vlan 10`", hi: "`ip dhcp snooping vlan 10` hata do" },
        { en: "Set `ip dhcp snooping limit rate 1` on Gi0/1", hi: "Gi0/1 par `ip dhcp snooping limit rate 1` set karo" },
      ],
      answer: 1,
      explain: {
        en: "SW1 inserts option 82 but leaves giaddr at 0.0.0.0, and R1 drops such requests as inconsistent. Turning off the insertion fixes it while keeping the protection. Trusting client ports would remove the protection.",
        hi: "SW1 option 82 daalta hai lekin giaddr 0.0.0.0 rehta hai, aur R1 aisi requests ko inconsistent maan kar drop karta hai. Insertion band karne se problem fix hoti hai aur protection bhi bani rehti hai. Client ports ko trust karna protection hi hata dega.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Gi0/3 has `ip dhcp snooping limit rate 10`. A device on Gi0/3 sends 400 Discovers in one second. What happens?", hi: "Gi0/3 par `ip dhcp snooping limit rate 10` hai. Gi0/3 wala device ek second mein 400 Discovers bhejta hai. Kya hoga?" },
      options: [
        { en: "The first 10 are forwarded and the rest are dropped; the port stays up", hi: "Pehle 10 forward honge aur baaki drop; port up rahega" },
        { en: "All 400 are forwarded because Discovers are client messages", hi: "Saare 400 forward honge kyunki Discovers client messages hain" },
        { en: "Gi0/3 is err-disabled", hi: "Gi0/3 err-disabled ho jaayega" },
        { en: "Gi0/3 becomes a trusted port", hi: "Gi0/3 trusted port ban jaayega" },
      ],
      answer: 2,
      explain: {
        en: "Exceeding the DHCP snooping rate limit err-disables the port (cause dhcp-rate-limit). It stays down until `shutdown` / `no shutdown` or errdisable recovery.",
        hi: "DHCP snooping rate limit cross karne par port err-disable ho jaata hai (cause dhcp-rate-limit). Woh `shutdown` / `no shutdown` ya errdisable recovery tak down hi rehta hai.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "qYYeg2kz1yE",
      title: "Free CCNA | DHCP Snooping | Day 50",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Rogue servers, starvation, trusted ports, the binding table and option 82.", hi: "Rogue servers, starvation, trusted ports, binding table aur option 82." },
    },
    {
      id: "YMom_e545H4",
      title: "Free CCNA | DHCP Snooping | Day 50 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Packet Tracer lab for the configuration in this lesson.", hi: "Is lesson ki configuration ke liye Packet Tracer lab." },
    },
    {
      id: "p330aJS6RL0",
      title: "137. Free CCNA (NEW) | Network Security - DHCP Snooping | CCNA 200-301 Complete Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "DHCP snooping theory and configuration in Hindi.", hi: "DHCP snooping ki theory aur configuration Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Stop a rogue DHCP server", hi: "Rogue DHCP server ko roko" },
    steps: [
      { en: "In Packet Tracer connect R1 (192.168.10.1/24, DHCP pool for 192.168.10.0/24) to SW1 Gi0/1, a PC to Gi0/2, and a server with its DHCP service on (pool 192.168.10.150 onwards, gateway 192.168.10.66) to Gi0/3. All in VLAN 10.", hi: "Packet Tracer mein R1 (192.168.10.1/24, 192.168.10.0/24 ka DHCP pool) ko SW1 Gi0/1 par, ek PC ko Gi0/2 par, aur DHCP service on wala ek server (pool 192.168.10.150 se, gateway 192.168.10.66) Gi0/3 par lagao. Sab VLAN 10 mein." },
      { en: "Renew the PC's address a few times. Note which server answers and which gateway the PC receives.", hi: "PC ka address kuch baar renew karo. Dekho kaunsa server jawab deta hai aur PC ko kaunsa gateway milta hai." },
      { en: "On SW1 configure `ip dhcp snooping`, `ip dhcp snooping vlan 10` and `ip dhcp snooping trust` on Gi0/1. Renew again.", hi: "SW1 par `ip dhcp snooping`, `ip dhcp snooping vlan 10` aur Gi0/1 par `ip dhcp snooping trust` configure karo. Dobara renew karo." },
      { en: "If the PC gets no address, add `no ip dhcp snooping information option` and renew.", hi: "PC ko address nahi mila toh `no ip dhcp snooping information option` add karo aur renew karo." },
      { en: "Check `show ip dhcp snooping binding` and confirm the PC's MAC, IP, VLAN and Gi0/2 are listed.", hi: "`show ip dhcp snooping binding` check karo aur confirm karo ki PC ka MAC, IP, VLAN aur Gi0/2 list mein hai." },
    ],
  },
};

export default lesson;
