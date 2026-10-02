import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "dhcp",
  intro: {
    en: "Every host needs an IP address, mask, default gateway and DNS server before it can talk (lesson 1.10). Typing those by hand on hundreds of laptops, phones and IP phones is slow, and one typo or one duplicate address breaks a user. DHCP hands the settings out automatically from a pool and takes them back when they are no longer used. In most networks the DHCP server sits in another subnet, so you also need to know how a router relays DHCP across it.",
    hi: "Har host ko baat karne se pehle IP address, mask, default gateway aur DNS server chahiye (lesson 1.10). Saikdon laptops, phones aur IP phones par yeh haath se type karna slow hai, aur ek typo ya ek duplicate address se user ka kaam ruk jaata hai. DHCP yeh settings ek pool se automatically deta hai aur jab use nahi ho rahi hon toh wapas le leta hai. Zyada tar networks mein DHCP server kisi doosre subnet mein hota hai, isliye yeh bhi samajhna zaroori hai ki router DHCP ko us subnet tak relay kaise karta hai.",
  },
  outcomes: [
    { en: "Describe the four DORA messages with their source and destination addresses and UDP ports", hi: "Chaaron DORA messages ko unke source aur destination addresses aur UDP ports ke saath describe kar sako" },
    { en: "Predict what a client does at T1 (50%), T2 (87.5%) and when the lease expires", hi: "Predict kar sako ki client T1 (50%), T2 (87.5%) aur lease expire hone par kya karta hai" },
    { en: "Configure a Cisco router as a DHCP server with excluded addresses and a pool", hi: "Cisco router ko excluded addresses aur pool ke saath DHCP server configure kar sako" },
    { en: "Configure a relay agent with `ip helper-address` and explain what giaddr does", hi: "`ip helper-address` se relay agent configure kar sako aur samjha sako ki giaddr kya karta hai" },
    { en: "Configure a router interface as a DHCP client and read `show ip dhcp binding` and `show ip dhcp pool`", hi: "Router interface ko DHCP client bana sako aur `show ip dhcp binding` aur `show ip dhcp pool` padh sako" },
  ],
  sections: [
    {
      id: "why-dhcp",
      heading: { en: "What DHCP gives a host", hi: "DHCP host ko kya deta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**DHCP (Dynamic Host Configuration Protocol)** lets a host ask the network for its IPv4 settings when it connects. A server keeps a **pool** of addresses for each subnet and **leases** one address to each client for a fixed time. When a laptop leaves the office for good, its lease runs out and the address goes back into the pool.",
            hi: "**DHCP (Dynamic Host Configuration Protocol)** se host network se connect hote hi apni IPv4 settings maang sakta hai. Server har subnet ke liye addresses ka ek **pool** rakhta hai aur har client ko ek address fixed time ke liye **lease** par deta hai. Laptop hamesha ke liye office chhod de, toh uski lease khatam ho jaati hai aur address wapas pool mein aa jaata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "What PC1 receives from the server in this lesson", hi: "Is lesson mein PC1 ko server se kya milta hai" },
          columns: [{ en: "Setting", hi: "Setting" }, { en: "Where it travels", hi: "Kahan aata hai" }, { en: "Value for PC1", hi: "PC1 ke liye value" }],
          rows: [
            [{ en: "IP address", hi: "IP address" }, { en: "yiaddr field (\"your IP address\")", hi: "yiaddr field (\"your IP address\")" }, "192.168.10.11"],
            [{ en: "Subnet mask", hi: "Subnet mask" }, { en: "Option 1", hi: "Option 1" }, "255.255.255.0"],
            [{ en: "Default gateway", hi: "Default gateway" }, { en: "Option 3 (router)", hi: "Option 3 (router)" }, "192.168.10.1"],
            [{ en: "DNS server", hi: "DNS server" }, { en: "Option 6", hi: "Option 6" }, "8.8.8.8"],
            [{ en: "Lease time", hi: "Lease time" }, { en: "Option 51", hi: "Option 51" }, { en: "1 day (86400 seconds)", hi: "1 din (86400 seconds)" }],
            [{ en: "Server identifier", hi: "Server identifier" }, { en: "Option 54", hi: "Option 54" }, "10.0.12.2"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Not everything should use DHCP. Routers, switches, servers and network printers need addresses that never change, because other devices point at them. Give those static addresses and **exclude** them from the pool so the server never hands them out.",
            hi: "Har cheez DHCP par nahi honi chahiye. Routers, switches, servers aur network printers ke addresses kabhi badalne nahi chahiye, kyunki doosre devices unhi ko point karte hain. Unhe static address do aur pool se **exclude** kar do, taaki server unhe kabhi kisi aur ko na de.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "DHCP runs over UDP", hi: "DHCP UDP par chalta hai" },
          text: {
            en: "Server port 67, client port 68. It has to be UDP: a client without an address can only broadcast, and TCP cannot broadcast (lesson 1.7). If no server answers, Windows falls back to an APIPA address in 169.254.0.0/16, which you met in lesson 1.10.",
            hi: "Server port 67, client port 68. UDP hi hona chahiye: bina address wala client sirf broadcast kar sakta hai, aur TCP broadcast nahi kar sakta (lesson 1.7). Koi server jawab na de, toh Windows 169.254.0.0/16 ka APIPA address le leta hai, jo tumne lesson 1.10 mein dekha tha.",
          },
        },
      ],
    },
    {
      id: "dora",
      heading: { en: "DORA: Discover, Offer, Request, Ack", hi: "DORA: Discover, Offer, Request, Ack" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "**Discover** (client). \"Is there a DHCP server?\" The client has no address, so it sends from `0.0.0.0` to `255.255.255.255`, inside a frame to `FFFF.FFFF.FFFF`. Its MAC goes in the chaddr field so the server knows who is asking.",
              hi: "**Discover** (client). \"Koi DHCP server hai?\" Client ke paas address nahi hai, isliye woh `0.0.0.0` se `255.255.255.255` par bhejta hai, `FFFF.FFFF.FFFF` wale frame ke andar. Uska MAC chaddr field mein jaata hai taaki server ko pata chale ki kaun pooch raha hai.",
            },
            {
              en: "**Offer** (server). The server picks a free address from the matching pool and offers it with the mask, gateway, DNS server and lease time.",
              hi: "**Offer** (server). Server matching pool se ek free address chunta hai aur use mask, gateway, DNS server aur lease time ke saath offer karta hai.",
            },
            {
              en: "**Request** (client). The client accepts one offer. It still broadcasts from `0.0.0.0`, because it may not use the address yet and because every server that made an offer must learn which one was chosen. The Request carries the chosen server's identifier and the requested address.",
              hi: "**Request** (client). Client ek offer accept karta hai. Ab bhi `0.0.0.0` se broadcast karta hai, kyunki address abhi use nahi kar sakta aur jis jis server ne offer diya tha unhe pata chalna chahiye ki kaunsa choose hua. Request mein chosen server ka identifier aur maanga gaya address hota hai.",
            },
            {
              en: "**Ack** (server). The server records the lease and confirms it. Only after the Ack does the client configure the address.",
              hi: "**Ack** (server). Server lease record karta hai aur confirm karta hai. Ack ke baad hi client address configure karta hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "The four messages on the client's LAN", hi: "Client ke LAN par chaaron messages" },
          columns: [{ en: "Message", hi: "Message" }, { en: "Source", hi: "Source" }, { en: "Destination", hi: "Destination" }, { en: "Delivery", hi: "Delivery" }],
          rows: [
            ["Discover", "0.0.0.0:68", "255.255.255.255:67", { en: "Broadcast", hi: "Broadcast" }],
            ["Offer", { en: "Server (or relay) :67", hi: "Server (ya relay) :67" }, { en: "Port 68", hi: "Port 68" }, { en: "Broadcast or unicast, set by the client's broadcast flag", hi: "Broadcast ya unicast, client ke broadcast flag se decide hota hai" }],
            ["Request", "0.0.0.0:68", "255.255.255.255:67", { en: "Broadcast", hi: "Broadcast" }],
            ["Ack", { en: "Server (or relay) :67", hi: "Server (ya relay) :67" }, { en: "Port 68", hi: "Port 68" }, { en: "Broadcast or unicast, like the Offer", hi: "Broadcast ya unicast, Offer ki tarah" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "In the initial DORA, Discover and Request are always broadcasts from the client. Offer and Ack can be broadcast or unicast. Order: Discover, Offer, Request, Ack. Client UDP 68, server UDP 67.",
            hi: "Pehli DORA mein Discover aur Request client ki taraf se hamesha broadcast hote hain. Offer aur Ack broadcast ya unicast dono ho sakte hain. Order: Discover, Offer, Request, Ack. Client UDP 68, server UDP 67.",
          },
        },
      ],
    },
    {
      id: "lease-timers",
      heading: { en: "Leases, renewal and rebinding", hi: "Lease, renewal aur rebinding" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A lease is a loan, not a gift. The client does not wait until it expires; it starts renewing at half time. Two timers decide when, and both are counted from the moment the lease was granted.",
            hi: "Lease ek udhaar hai, gift nahi. Client expire hone tak wait nahi karta; aadha time hote hi renew karna shuru kar deta hai. Kab karna hai yeh do timers decide karte hain, aur dono lease milne ke time se gine jaate hain.",
          },
        },
        {
          type: "table",
          caption: { en: "PC1 with a 1-day lease from R2", hi: "R2 se 1 din ki lease ke saath PC1" },
          columns: [{ en: "Time", hi: "Time" }, { en: "Timer", hi: "Timer" }, { en: "What PC1 does", hi: "PC1 kya karta hai" }],
          rows: [
            ["0 h", "Ack", { en: "Starts using 192.168.10.11", hi: "192.168.10.11 use karna shuru karta hai" }],
            ["12 h", "T1 (50%)", { en: "Unicast Request to the server that granted the lease, 10.0.12.2. An Ack resets the lease to a full day.", hi: "Jis server ne lease di thi, yaani 10.0.12.2, use unicast Request. Ack aaya toh lease phir se poore 1 din ki." }],
            ["21 h", "T2 (87.5%)", { en: "Broadcast Request that any DHCP server may answer (rebinding)", hi: "Broadcast Request jiska jawab koi bhi DHCP server de sakta hai (rebinding)" }],
            ["24 h", { en: "Expiry", hi: "Expiry" }, { en: "Stops using the address and starts again with Discover", hi: "Address use karna band karta hai aur Discover se dobara shuru karta hai" }],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**DHCP Release**: the client gives the address back early, as a unicast to the server. `ipconfig /release` on Windows sends one.",
              hi: "**DHCP Release**: client address pehle hi wapas kar deta hai, server ko unicast bhej kar. Windows par `ipconfig /release` yahi bhejta hai.",
            },
            {
              en: "**DHCP Decline**: after the Ack, the client checks (usually with ARP) that no other host already uses the address. If one does, it sends a Decline to refuse the address and starts again.",
              hi: "**DHCP Decline**: Ack ke baad client check karta hai (aam taur par ARP se) ki address koi aur host pehle se use toh nahi kar raha. Agar kar raha hai, toh client Decline bhej kar address mana kar deta hai aur dobara shuru karta hai.",
            },
            {
              en: "**DHCP NAK**: the server refuses a Request, for example when a laptop moves to another subnet and asks to keep its old address. The client then starts over with a Discover.",
              hi: "**DHCP NAK**: server Request mana kar deta hai, jaise jab laptop doosre subnet mein chala jaaye aur purana address maange. Phir client Discover se dobara shuru karta hai.",
            },
          ],
        },
      ],
    },
    {
      id: "ios-server",
      heading: { en: "A Cisco router as the DHCP server", hi: "Cisco router ko DHCP server banana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Large networks usually run DHCP on a Windows or Linux server, but any Cisco IOS router can serve small sites and labs. In this lesson R2 (10.0.12.2) serves the 192.168.10.0/24 LAN behind R1. The order matters: exclude the static addresses first, then build the pool.",
            hi: "Bade networks mein DHCP aam taur par Windows ya Linux server par chalta hai, lekin chhoti sites aur labs ke liye koi bhi Cisco IOS router DHCP server ban sakta hai. Is lesson mein R2 (10.0.12.2) R1 ke peeche wale 192.168.10.0/24 LAN ko serve karta hai. Order zaroori hai: pehle static addresses exclude karo, phir pool banao.",
          },
        },
        {
          type: "cli",
          title: { en: "R2: pool LAN10", hi: "R2: pool LAN10" },
          lines: [
            { prompt: "R2(config)#", cmd: "ip dhcp excluded-address 192.168.10.1 192.168.10.10", comment: { en: "Never lease .1 to .10 (gateway, servers, printers)", hi: ".1 se .10 kabhi lease mat karo (gateway, servers, printers)" } },
            { prompt: "R2(config)#", cmd: "ip dhcp pool LAN10", comment: { en: "Pool name is local to R2", hi: "Pool ka naam sirf R2 ke liye hai" } },
            { prompt: "R2(dhcp-config)#", cmd: "network 192.168.10.0 255.255.255.0", comment: { en: "Subnet mask or /24, never a wildcard", hi: "Subnet mask ya /24, wildcard kabhi nahi" } },
            { prompt: "R2(dhcp-config)#", cmd: "default-router 192.168.10.1", comment: { en: "Option 3: R1's LAN interface", hi: "Option 3: R1 ka LAN interface" } },
            { prompt: "R2(dhcp-config)#", cmd: "dns-server 8.8.8.8", comment: { en: "Option 6", hi: "Option 6" } },
            { prompt: "R2(dhcp-config)#", cmd: "domain-name example.com", comment: { en: "Option 15, optional", hi: "Option 15, optional" } },
            { prompt: "R2(dhcp-config)#", cmd: "lease 1", comment: { en: "Days [hours] [minutes]; 1 day is also the default", hi: "Days [hours] [minutes]; default bhi 1 din hai" } },
            { prompt: "R2(dhcp-config)#", cmd: "exit" },
            { prompt: "R2(config)#", cmd: "ip route 192.168.10.0 255.255.255.0 10.0.12.1", comment: { en: "R2 must be able to reach giaddr 192.168.10.1", hi: "R2 ko giaddr 192.168.10.1 tak pahunchna aana chahiye" } },
          ],
          note: {
            en: "`lease 0 8` would mean 8 hours, and `lease infinite` never expires. Before offering an address, IOS pings it; if something answers, the address is logged as a conflict (`show ip dhcp conflict`) and skipped.",
            hi: "`lease 0 8` ka matlab 8 ghante, aur `lease infinite` kabhi expire nahi hoti. Address offer karne se pehle IOS use ping karta hai; agar koi jawab de, toh address conflict mein log hota hai (`show ip dhcp conflict`) aur skip ho jaata hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The server needs a route back", hi: "Server ko wapas ka route chahiye" },
          text: {
            en: "R2 sends its Offer and Ack to the giaddr, 192.168.10.1. If R2 has no route to 192.168.10.0/24, the replies are dropped and clients end up with APIPA addresses, even though the pool and the relay are both correct.",
            hi: "R2 apna Offer aur Ack giaddr, yaani 192.168.10.1, par bhejta hai. Agar R2 ke paas 192.168.10.0/24 ka route nahi hai, toh replies drop ho jaate hain aur clients ko APIPA address mil jaata hai, chahe pool aur relay dono sahi hon.",
          },
        },
      ],
    },
    {
      id: "relay",
      heading: { en: "DHCP relay: getting across a router", hi: "DHCP relay: router ke paar jaana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Discover and Request are broadcasts, and routers do not forward broadcasts. Without help, every subnet would need its own DHCP server. A **relay agent** fixes this: the router interface that faces the clients picks up DHCP broadcasts and forwards them as unicasts to a server you name with `ip helper-address`.",
            hi: "Discover aur Request broadcast hote hain, aur routers broadcast forward nahi karte. Bina madad ke har subnet ko apna DHCP server chahiye hota. **Relay agent** isko solve karta hai: clients ki taraf wala router interface DHCP broadcasts pakadta hai aur unhe unicast bana kar us server ko bhejta hai jiska address tum `ip helper-address` mein dete ho.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "R1 receives PC1's Discover on Gi0/0, the interface with the helper address.",
              hi: "R1 ko PC1 ka Discover Gi0/0 par milta hai, jis interface par helper address laga hai.",
            },
            {
              en: "R1 writes its Gi0/0 address, `192.168.10.1`, into the **giaddr** (gateway IP address) field and sends the message as a unicast to `10.0.12.2`, UDP 67.",
              hi: "R1 apna Gi0/0 address, `192.168.10.1`, **giaddr** (gateway IP address) field mein likhta hai aur message ko unicast bana kar `10.0.12.2` par, UDP 67 par, bhejta hai.",
            },
            {
              en: "R2 uses the giaddr to choose the pool: 192.168.10.1 is inside pool LAN10's 192.168.10.0/24, so the client gets an address from that subnet.",
              hi: "R2 giaddr dekh kar pool chunta hai: 192.168.10.1 pool LAN10 ke 192.168.10.0/24 ke andar hai, isliye client ko isi subnet ka address milta hai.",
            },
            {
              en: "R2 sends the Offer and Ack to the giaddr. R1 receives them and delivers them to PC1 on Gi0/0.",
              hi: "R2 Offer aur Ack giaddr par bhejta hai. R1 unhe receive karke Gi0/0 par PC1 tak pahunchata hai.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "R1: relay on the client-facing interface", hi: "R1: client ki taraf wale interface par relay" },
          lines: [
            { prompt: "R1(config)#", cmd: "interface g0/0", comment: { en: "Gi0/0 faces PC1's LAN, 192.168.10.0/24", hi: "Gi0/0 PC1 ke LAN (192.168.10.0/24) ki taraf hai" } },
            { prompt: "R1(config-if)#", cmd: "ip helper-address 10.0.12.2" },
            { prompt: "R1(config-if)#", cmd: "end" },
            { prompt: "R1#", cmd: "show ip interface g0/0 | include Helper" },
            { out: "  Helper address is 10.0.12.2" },
          ],
          note: {
            en: "You can configure more than one helper address on an interface; R1 then sends a copy to each server. By default `ip helper-address` also relays a few other UDP broadcasts, such as TFTP (69), DNS (53) and NetBIOS (137, 138), not only DHCP.",
            hi: "Ek interface par ek se zyada helper address bhi de sakte ho; tab R1 har server ko ek copy bhejta hai. By default `ip helper-address` sirf DHCP nahi, kuch aur UDP broadcasts bhi relay karta hai, jaise TFTP (69), DNS (53) aur NetBIOS (137, 138).",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Where the helper address goes", hi: "Helper address kahan lagta hai" },
          text: {
            en: "`ip helper-address` goes on the interface where the client broadcasts arrive, the one facing the clients. Putting it on the interface towards the server does nothing for these clients. On a Layer 3 switch that interface is the VLAN's SVI, for example `interface vlan 10`.",
            hi: "`ip helper-address` us interface par lagta hai jahan client ke broadcasts aate hain, yaani clients ki taraf wala interface. Server ki taraf wale interface par lagane se in clients ka kuch nahi hoga. Layer 3 switch par yeh interface VLAN ka SVI hota hai, jaise `interface vlan 10`.",
          },
        },
      ],
    },
    {
      id: "router-client",
      heading: { en: "A router as a DHCP client", hi: "Router ko DHCP client banana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Many ISPs hand the customer's router its public address by DHCP. On IOS you use `ip address dhcp` on the Internet-facing interface instead of a fixed address. Here R1's Gi0/2 connects to the ISP.",
            hi: "Kai ISPs customer ke router ko public address DHCP se dete hain. IOS par Internet ki taraf wale interface par fixed address ki jagah `ip address dhcp` use karte ho. Yahan R1 ka Gi0/2 ISP se juda hai.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: Gi0/2 learns its address from the ISP", hi: "R1: Gi0/2 apna address ISP se seekhta hai" },
          lines: [
            { prompt: "R1(config)#", cmd: "interface g0/2" },
            { prompt: "R1(config-if)#", cmd: "ip address dhcp" },
            { prompt: "R1(config-if)#", cmd: "no shutdown" },
            { out: "%DHCP-6-ADDRESS_ASSIGN: Interface GigabitEthernet0/2 assigned DHCP address 203.0.113.25, mask 255.255.255.0, hostname R1" },
            { prompt: "R1(config-if)#", cmd: "end" },
            { prompt: "R1#", cmd: "show ip interface brief | include 0/2" },
            { out: "GigabitEthernet0/2     203.0.113.25    YES DHCP   up                    up", comment: { en: "Method DHCP instead of manual", hi: "Method manual ki jagah DHCP" } },
          ],
          note: {
            en: "IOS also turns the gateway it received into a default route with administrative distance 254, shown as `S* 0.0.0.0/0 [254/0] via 203.0.113.1`.",
            hi: "IOS mile hue gateway ko administrative distance 254 wale default route mein bhi badal deta hai, jo `S* 0.0.0.0/0 [254/0] via 203.0.113.1` jaisa dikhta hai.",
          },
        },
      ],
    },
    {
      id: "verify",
      heading: { en: "Verifying the server", hi: "Server verify karna" },
      blocks: [
        {
          type: "cli",
          title: { en: "R2: who has which address", hi: "R2: kis client ke paas kaunsa address hai" },
          lines: [
            { prompt: "R2#", cmd: "show ip dhcp binding" },
            { out: "Bindings from all pools not associated with VRF:" },
            { out: "IP address          Client-ID/              Lease expiration        Type" },
            { out: "                    Hardware address/" },
            { out: "                    User name" },
            { out: "192.168.10.11       0100.5056.aa00.11       Oct 02 2026 09:30 AM    Automatic", comment: { en: "Client ID = 01 (Ethernet) + PC1's MAC 0050.56aa.0011", hi: "Client ID = 01 (Ethernet) + PC1 ka MAC 0050.56aa.0011" } },
          ],
        },
        {
          type: "cli",
          title: { en: "R2: how full the pool is", hi: "R2: pool kitna bhara hai" },
          lines: [
            { prompt: "R2#", cmd: "show ip dhcp pool" },
            { out: "Pool LAN10 :" },
            { out: " Total addresses                : 254" },
            { out: " Leased addresses               : 1" },
            { out: " Current index        IP address range                    Leased addresses" },
            { out: " 192.168.10.12        192.168.10.1     - 192.168.10.254    1", comment: { en: "Current index: the next address R2 will try to offer", hi: "Current index: agla address jo R2 offer karne ki koshish karega" } },
          ],
          note: {
            en: "Output shortened. Total addresses counts the whole range, including the excluded .1 to .10.",
            hi: "Output chhota kiya gaya hai. Total addresses poori range ginta hai, excluded .1 se .10 ko bhi.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Troubleshooting order", hi: "Troubleshooting ka order" },
          text: {
            en: "Client has 169.254.x.x? Work along the path: does the client's VLAN reach R1, does R1's client-facing interface have the right helper address, can R2 route back to the giaddr, does a pool cover that subnet and does it still have free addresses? DHCP snooping (lesson 5.7) can also block offers on untrusted ports.",
            hi: "Client ke paas 169.254.x.x hai? Path ke saath chalo: kya client ka VLAN R1 tak pahunchta hai, kya R1 ke client wale interface par sahi helper address hai, kya R2 giaddr tak route kar sakta hai, kya us subnet ka pool hai aur usme free addresses bache hain? DHCP snooping (lesson 5.7) bhi untrusted ports par offers block kar sakta hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "DORA", def: { en: "Discover, Offer, Request, Ack: the four messages that give a client its first lease.", hi: "Discover, Offer, Request, Ack: woh chaar messages jinse client ko pehli lease milti hai." } },
    { term: "Lease", def: { en: "The time a client may use an address before it must renew it.", hi: "Woh time jitni der client address use kar sakta hai, uske baad renew karna padta hai." } },
    { term: "T1 / T2", def: { en: "Renewal at 50% of the lease (unicast to the same server) and rebinding at 87.5% (broadcast to any server).", hi: "Lease ke 50% par renewal (usi server ko unicast) aur 87.5% par rebinding (kisi bhi server ko broadcast)." } },
    { term: "Relay agent", def: { en: "A router interface that forwards client DHCP broadcasts as unicasts to a server in another subnet.", hi: "Router ka woh interface jo client ke DHCP broadcasts ko unicast bana kar doosre subnet ke server tak bhejta hai." } },
    { term: "giaddr", def: { en: "Gateway IP address field. The relay writes its client-facing address here so the server picks the right pool and knows where to reply.", hi: "Gateway IP address field. Relay isme apna client wala address likhta hai taaki server sahi pool chune aur jaane ki reply kahan bhejna hai." } },
    { term: "Excluded address", def: { en: "An address inside a pool's subnet that the server will never lease, kept for static devices.", hi: "Pool ke subnet ka woh address jo server kabhi lease nahi karega, static devices ke liye rakha jaata hai." } },
    { term: "APIPA", def: { en: "A 169.254.0.0/16 address a host gives itself when no DHCP server answers.", hi: "169.254.0.0/16 ka address jo host khud le leta hai jab koi DHCP server jawab nahi deta." } },
  ],
  commands: [
    { cmd: "ip dhcp excluded-address <first> [last]", mode: "Global config", does: { en: "Keep an address or range out of every pool", hi: "Ek address ya range ko har pool se bahar rakhta hai" } },
    { cmd: "ip dhcp pool <name>", mode: "Global config", does: { en: "Create a pool and enter DHCP pool config mode", hi: "Pool banata hai aur DHCP pool config mode mein le jaata hai" } },
    { cmd: "network <address> <mask>", mode: "DHCP pool config", does: { en: "The subnet this pool hands addresses from", hi: "Woh subnet jisse yeh pool addresses deta hai" } },
    { cmd: "default-router <ip>", mode: "DHCP pool config", does: { en: "Default gateway given to clients (option 3)", hi: "Clients ko diya jaane wala default gateway (option 3)" } },
    { cmd: "dns-server <ip> [ip ...]", mode: "DHCP pool config", does: { en: "DNS servers given to clients (option 6)", hi: "Clients ko diye jaane wale DNS servers (option 6)" } },
    { cmd: "domain-name <name>", mode: "DHCP pool config", does: { en: "Domain name given to clients (option 15)", hi: "Clients ko diya jaane wala domain name (option 15)" } },
    { cmd: "lease {<days> [hours] [minutes] | infinite}", mode: "DHCP pool config", does: { en: "Lease length; default 1 day", hi: "Lease ki length; default 1 din" } },
    { cmd: "ip helper-address <server-ip>", mode: "Interface config", does: { en: "Relay DHCP broadcasts arriving on this interface to the server", hi: "Is interface par aane wale DHCP broadcasts ko server tak relay karta hai" } },
    { cmd: "ip address dhcp", mode: "Interface config", does: { en: "Make the interface a DHCP client", hi: "Interface ko DHCP client bana deta hai" } },
    { cmd: "show ip dhcp binding", mode: "Privileged EXEC", does: { en: "List leased addresses and their clients", hi: "Lease kiye gaye addresses aur unke clients dikhata hai" } },
    { cmd: "show ip dhcp pool", mode: "Privileged EXEC", does: { en: "Show pool size, leased count and next address", hi: "Pool ka size, leased count aur agla address dikhata hai" } },
    { cmd: "show ip dhcp conflict", mode: "Privileged EXEC", does: { en: "Show addresses found already in use", hi: "Pehle se use mein mile addresses dikhata hai" } },
    { cmd: "show ip interface <intf>", mode: "Privileged EXEC", does: { en: "Shows the helper address among other settings", hi: "Baaki settings ke saath helper address bhi dikhata hai" } },
    { cmd: "ipconfig /release, ipconfig /renew", mode: "Windows terminal", does: { en: "Give the lease back, then run DORA again", hi: "Lease wapas karo, phir DORA dobara chalao" } },
  ],
  mistakes: [
    {
      en: "Putting `ip helper-address` on the interface that faces the DHCP server. It belongs on the interface (or SVI) where the clients' broadcasts arrive.",
      hi: "`ip helper-address` DHCP server ki taraf wale interface par lagana. Yeh us interface (ya SVI) par lagta hai jahan clients ke broadcasts aate hain.",
    },
    {
      en: "Saying the Request is unicast because the client already knows the server. In the initial DORA it is a broadcast; only renewals at T1 are unicast.",
      hi: "Yeh kehna ki Request unicast hai kyunki client ko server pata hai. Pehli DORA mein yeh broadcast hota hai; sirf T1 wale renewals unicast hote hain.",
    },
    {
      en: "Thinking a client renews only when its lease runs out. It tries at T1 (50%) and again at T2 (87.5%).",
      hi: "Yeh sochna ki client lease khatam hone par hi renew karta hai. Woh T1 (50%) par try karta hai aur phir T2 (87.5%) par.",
    },
    {
      en: "Forgetting to exclude static addresses such as the gateway, servers and printers. IOS pings before offering, but a device that is switched off can have its address given away.",
      hi: "Gateway, servers aur printers jaise static addresses ko exclude karna bhool jaana. IOS offer se pehle ping karta hai, lekin jo device band pada hai uska address kisi aur ko mil sakta hai.",
    },
    {
      en: "Typing a wildcard mask in the pool: `network 192.168.10.0 0.0.0.255` is wrong. The DHCP `network` command takes a subnet mask or a prefix length.",
      hi: "Pool mein wildcard mask likhna: `network 192.168.10.0 0.0.0.255` galat hai. DHCP ka `network` command subnet mask ya prefix length leta hai.",
    },
    {
      en: "Forgetting that the server replies to the giaddr. With no route back to the client subnet, DORA fails even though relay and pool look right.",
      hi: "Bhool jaana ki server giaddr par reply karta hai. Client subnet tak wapas route nahi hai, toh relay aur pool sahi dikhne par bhi DORA fail hoga.",
    },
  ],
  recap: [
    { en: "DORA: Discover and Request are client broadcasts from 0.0.0.0:68 to 255.255.255.255:67; Offer and Ack come from the server on port 67.", hi: "DORA: Discover aur Request client ke broadcasts hain, 0.0.0.0:68 se 255.255.255.255:67 par; Offer aur Ack server se port 67 se aate hain." },
    { en: "The client gets IP address, mask, gateway, DNS server and lease time; it uses the address only after the Ack.", hi: "Client ko IP address, mask, gateway, DNS server aur lease time milta hai; address woh Ack ke baad hi use karta hai." },
    { en: "T1 = 50%: unicast renew to the same server. T2 = 87.5%: broadcast rebind. Expiry: drop the address and Discover again.", hi: "T1 = 50%: usi server ko unicast renew. T2 = 87.5%: broadcast rebind. Expiry: address chhodo aur dobara Discover." },
    { en: "IOS server: `ip dhcp excluded-address`, then `ip dhcp pool` with `network`, `default-router`, `dns-server`, `lease` (default 1 day).", hi: "IOS server: pehle `ip dhcp excluded-address`, phir `ip dhcp pool` ke andar `network`, `default-router`, `dns-server`, `lease` (default 1 din)." },
    { en: "Relay: `ip helper-address` on the client-facing interface; the relay fills giaddr, the server picks the pool by giaddr and replies to it.", hi: "Relay: client ki taraf wale interface par `ip helper-address`; relay giaddr bharta hai, server giaddr se pool chunta hai aur usi par reply karta hai." },
    { en: "`ip address dhcp` makes a router interface a client; verify with `show ip dhcp binding` and `show ip dhcp pool` on the server.", hi: "`ip address dhcp` router interface ko client banata hai; server par `show ip dhcp binding` aur `show ip dhcp pool` se verify karo." },
  ],
  quiz: [
    {
      q: { en: "A PC with no IP address sends a DHCP Discover. Which source and destination IP addresses does the packet carry?", hi: "Bina IP address wala PC DHCP Discover bhejta hai. Packet mein source aur destination IP kya hote hain?" },
      options: [
        { en: "Source 169.254.1.1, destination 255.255.255.255", hi: "Source 169.254.1.1, destination 255.255.255.255" },
        { en: "Source 0.0.0.0, destination the default gateway", hi: "Source 0.0.0.0, destination default gateway" },
        { en: "Source 0.0.0.0, destination 255.255.255.255", hi: "Source 0.0.0.0, destination 255.255.255.255" },
        { en: "Source 255.255.255.255, destination 0.0.0.0", hi: "Source 255.255.255.255, destination 0.0.0.0" },
      ],
      answer: 2,
      explain: {
        en: "The client has no address yet, so the source is 0.0.0.0, and it does not know any server, so it broadcasts to 255.255.255.255. APIPA only comes later, if no server answers, and a client without DHCP settings does not know a gateway either.",
        hi: "Client ke paas abhi address nahi hai, isliye source 0.0.0.0 hai, aur use koi server pata nahi, isliye woh 255.255.255.255 par broadcast karta hai. APIPA baad mein aata hai, jab koi server jawab na de, aur bina DHCP settings ke client ko gateway bhi pata nahi hota.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "PCs in VLAN 20 (192.168.20.0/24) are getting 169.254.x.x addresses. Their gateway is R1 Gi0/1, 192.168.20.1. The DHCP server is 10.0.12.2, reached through R1 Gi0/0. Where should `ip helper-address 10.0.12.2` be configured?",
        hi: "VLAN 20 (192.168.20.0/24) ke PCs ko 169.254.x.x addresses mil rahe hain. Unka gateway R1 Gi0/1, 192.168.20.1 hai. DHCP server 10.0.12.2 hai, jo R1 Gi0/0 ke through milta hai. `ip helper-address 10.0.12.2` kahan configure karna chahiye?",
      },
      options: [
        { en: "On R1 Gi0/1, the interface facing the PCs", hi: "R1 Gi0/1 par, jo PCs ki taraf hai" },
        { en: "On R1 Gi0/0, the interface facing the server", hi: "R1 Gi0/0 par, jo server ki taraf hai" },
        { en: "In global configuration mode on R1", hi: "R1 par global configuration mode mein" },
        { en: "On the DHCP server's own interface", hi: "DHCP server ke apne interface par" },
      ],
      answer: 0,
      explain: {
        en: "The relay must hear the broadcasts, and they only arrive on Gi0/1. That interface also supplies giaddr 192.168.20.1, which tells the server to use its 192.168.20.0/24 pool. `ip helper-address` is an interface command, not a global one.",
        hi: "Relay ko broadcasts sunne chahiye, aur woh sirf Gi0/1 par aate hain. Wahi interface giaddr 192.168.20.1 bhi deta hai, jisse server ko pata chalta hai ki 192.168.20.0/24 wala pool use karna hai. `ip helper-address` interface command hai, global nahi.",
      },
      kind: "scenario",
    },
    {
      q: { en: "A client receives an 8-day lease. When does it first try to renew, and when does it start broadcasting to any server?", hi: "Client ko 8 din ki lease milti hai. Woh pehli baar renew kab try karta hai, aur kisi bhi server ko broadcast kab shuru karta hai?" },
      options: [
        { en: "After 8 days, then immediately", hi: "8 din baad, phir turant" },
        { en: "After 2 days, then after 4 days", hi: "2 din baad, phir 4 din baad" },
        { en: "After 4 days, then after 6 days", hi: "4 din baad, phir 6 din baad" },
        { en: "After 4 days, then after 7 days", hi: "4 din baad, phir 7 din baad" },
      ],
      answer: 3,
      explain: {
        en: "T1 is 50% of 8 days = 4 days, a unicast renewal to the same server. T2 is 87.5% of 8 days = 7 days, when the client broadcasts to rebind with any server.",
        hi: "T1 8 din ka 50% = 4 din hai, usi server ko unicast renewal. T2 8 din ka 87.5% = 7 din hai, jab client kisi bhi server se rebind karne ke liye broadcast karta hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "`show ip dhcp binding` shows `192.168.10.11   0100.5056.aa00.11   Oct 02 2026 09:30 AM   Automatic`. What is the client's MAC address?",
        hi: "`show ip dhcp binding` mein `192.168.10.11   0100.5056.aa00.11   Oct 02 2026 09:30 AM   Automatic` dikhta hai. Client ka MAC address kya hai?",
      },
      options: [
        { en: "0100.5056.aa00", hi: "0100.5056.aa00" },
        { en: "0050.56aa.0011", hi: "0050.56aa.0011" },
        { en: "0100.5e56.aa11", hi: "0100.5e56.aa11" },
        { en: "The MAC is not shown, only an IP", hi: "MAC nahi dikhta, sirf IP" },
      ],
      answer: 1,
      explain: {
        en: "The client ID is the hardware type 01 (Ethernet) followed by the MAC. Drop the leading 01 and regroup: 00 50 56 aa 00 11 = 0050.56aa.0011.",
        hi: "Client ID mein pehle hardware type 01 (Ethernet) hota hai, phir MAC. Shuru ka 01 hatao aur dobara group karo: 00 50 56 aa 00 11 = 0050.56aa.0011.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1 Gi0/0 has `ip helper-address 10.0.12.2`, and R2 (10.0.12.2) has a correct pool for 192.168.10.0/24. A capture on R2 shows the relayed Discovers arriving and R2 sending Offers, but clients still get APIPA addresses. What is the most likely cause?",
        hi: "R1 Gi0/0 par `ip helper-address 10.0.12.2` hai, aur R2 (10.0.12.2) par 192.168.10.0/24 ka sahi pool hai. R2 par capture mein relayed Discovers aate dikhte hain aur R2 Offers bhejta hai, phir bhi clients ko APIPA address milta hai. Sabse likely cause kya hai?",
      },
      options: [
        { en: "The helper address belongs on R2's interface", hi: "Helper address R2 ke interface par hona chahiye" },
        { en: "The clients are sending Discovers with TCP", hi: "Clients Discover TCP par bhej rahe hain" },
        { en: "R2 has no route back to 192.168.10.0/24", hi: "R2 ke paas 192.168.10.0/24 ka wapas route nahi hai" },
        { en: "The pool has no excluded addresses", hi: "Pool mein koi excluded address nahi hai" },
      ],
      answer: 2,
      explain: {
        en: "R2 sends its Offers to the giaddr, 192.168.10.1. Without a route to 192.168.10.0/24 they never reach R1. The relay is clearly working because the Discovers arrive, and missing exclusions would not stop leases.",
        hi: "R2 apne Offers giaddr, yaani 192.168.10.1, par bhejta hai. 192.168.10.0/24 ka route nahi hai toh woh R1 tak kabhi nahi pahunchte. Relay toh chal raha hai kyunki Discovers aa rahe hain, aur exclusions na hone se leases nahi rukti.",
      },
      kind: "scenario",
    },
    {
      q: { en: "In the initial DORA exchange, why is the DHCP Request sent as a broadcast even though the client already knows the server from the Offer?", hi: "Pehli DORA mein DHCP Request broadcast kyun hota hai, jabki client ko Offer se server pata chal chuka hai?" },
      options: [
        { en: "Because DHCP uses TCP, which needs a broadcast to start", hi: "Kyunki DHCP TCP use karta hai, jise shuru karne ke liye broadcast chahiye" },
        { en: "Because the server's address is not included in the Offer", hi: "Kyunki Offer mein server ka address nahi hota" },
        { en: "Because the relay agent only forwards unicasts", hi: "Kyunki relay agent sirf unicasts forward karta hai" },
        { en: "Because the client cannot use the offered address yet, and every server that made an offer must learn which one was accepted", hi: "Kyunki client abhi offered address use nahi kar sakta, aur jis jis server ne offer diya unhe pata chalna chahiye ki kaunsa accept hua" },
      ],
      answer: 3,
      explain: {
        en: "Until the Ack the client has no usable source address, and the broadcast lets servers whose offers were not chosen release those addresses. The Offer does include the server identifier (option 54), and DHCP runs over UDP.",
        hi: "Ack aane tak client ke paas use karne layak source address nahi hota, aur broadcast se un servers ko pata chalta hai jinka offer choose nahi hua, taaki woh woh addresses free kar dein. Offer mein server identifier (option 54) hota hai, aur DHCP UDP par chalta hai.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "hzkleGAC2_Y",
      title: "Free CCNA | DHCP | Day 39",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "DORA with packet captures, DHCP relay and the IOS server and client commands.", hi: "Packet captures ke saath DORA, DHCP relay aur IOS server aur client commands." },
    },
    {
      id: "cgMsoIQB9Wk",
      title: "Free CCNA | DHCP | Day 39 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The matching Packet Tracer lab: practise the DHCP server, relay and client commands.", hi: "Iska Packet Tracer lab: DHCP server, relay aur client commands practice karo." },
    },
    {
      id: "I4X1GuZB870",
      title: "70. Free CCNA (NEW) | IP Services - DHCP & DHCP Relay in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "DORA and DHCP relay explained in Hindi.", hi: "DORA aur DHCP relay Hindi mein samjhaya gaya hai." },
    },
  ],
  lab: {
    title: { en: "DHCP server and relay in Packet Tracer", hi: "Packet Tracer mein DHCP server aur relay" },
    steps: [
      {
        en: "Build PC1 - switch - R1 Gi0/0 (192.168.10.1/24), and R1 Gi0/1 (10.0.12.1/30) - R2 Gi0/0 (10.0.12.2/30). Set PC1 to DHCP: it gets a 169.254.x.x address.",
        hi: "PC1 - switch - R1 Gi0/0 (192.168.10.1/24), aur R1 Gi0/1 (10.0.12.1/30) - R2 Gi0/0 (10.0.12.2/30) banao. PC1 ko DHCP par set karo: use 169.254.x.x address milega.",
      },
      {
        en: "On R2 configure `ip dhcp excluded-address 192.168.10.1 192.168.10.10`, pool LAN10 as in the lesson, and `ip route 192.168.10.0 255.255.255.0 10.0.12.1`.",
        hi: "R2 par `ip dhcp excluded-address 192.168.10.1 192.168.10.10`, lesson jaisa pool LAN10, aur `ip route 192.168.10.0 255.255.255.0 10.0.12.1` configure karo.",
      },
      {
        en: "Switch to Simulation mode with the DHCP filter and run `ipconfig /renew` on PC1. The Discover stops at R1. Why?",
        hi: "DHCP filter ke saath Simulation mode mein jao aur PC1 par `ipconfig /renew` chalao. Discover R1 par ruk jaata hai. Kyun?",
      },
      {
        en: "Add `ip helper-address 10.0.12.2` on R1 Gi0/0 and renew again. Open the relayed Discover and find the giaddr value.",
        hi: "R1 Gi0/0 par `ip helper-address 10.0.12.2` lagao aur dobara renew karo. Relayed Discover kholo aur giaddr ki value dhoondho.",
      },
      {
        en: "Confirm PC1 has 192.168.10.11 with `ipconfig /all`, then run `show ip dhcp binding` and `show ip dhcp pool` on R2.",
        hi: "`ipconfig /all` se confirm karo ki PC1 ke paas 192.168.10.11 hai, phir R2 par `show ip dhcp binding` aur `show ip dhcp pool` chalao.",
      },
    ],
  },
};

export default lesson;
