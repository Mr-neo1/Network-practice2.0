import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "client-ip-settings",
  intro: {
    en: "When a user says \"the network is down\", the first thing to check is the user's own computer. Four settings decide whether it can talk at all: IP address, subnet mask, default gateway and DNS server. Windows, macOS and Linux each show them with different commands and in different formats, and the CCNA expects you to read all three.",
    hi: "Jab user bolta hai \"network down hai\", toh sabse pehle user ka apna computer check karna hota hai. Chaar settings decide karti hain ki woh baat kar bhi paayega ya nahi: IP address, subnet mask, default gateway aur DNS server. Windows, macOS aur Linux teeno inhe alag commands se aur alag format mein dikhate hain, aur CCNA expect karta hai ki tum teeno padh sako.",
  },
  outcomes: [
    { en: "Explain what the IP address, mask, default gateway and DNS server each do for a host", hi: "Samjha sako ki IP address, mask, default gateway aur DNS server host ke liye kya-kya karte hain" },
    { en: "Read IP settings on Windows with ipconfig, ipconfig /all and route print", hi: "Windows par ipconfig, ipconfig /all aur route print se IP settings padh sako" },
    { en: "Read the same settings on macOS (ifconfig, networksetup, netstat -rn, scutil --dns) and Linux (ip addr, ip route, resolvectl)", hi: "Wahi settings macOS (ifconfig, networksetup, netstat -rn, scutil --dns) aur Linux (ip addr, ip route, resolvectl) par padh sako" },
    { en: "Recognise an APIPA address, a gateway outside the subnet, a wrong mask and a missing DNS server from command output", hi: "Command output dekh kar APIPA address, subnet ke bahar gateway, galat mask aur missing DNS server pehchaan sako" },
    { en: "Release and renew a DHCP lease and confirm the result", hi: "DHCP lease release aur renew karke result confirm kar sako" },
  ],
  sections: [
    {
      id: "four-settings",
      heading: { en: "The four settings every host needs", hi: "Har host ko chahiye yeh chaar settings" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Whether a host got its settings from DHCP or someone typed them in, you always check the same four things. Each one has a job, and each one breaks something specific when it is wrong.",
            hi: "Host ko settings DHCP se mili hon ya kisi ne type ki hon, check hamesha yahi chaar cheezein karni hain. Har ek ka apna kaam hai, aur har ek galat hone par koi khaas cheez tootti hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Example host: 192.168.10.25/24, gateway 192.168.10.1", hi: "Example host: 192.168.10.25/24, gateway 192.168.10.1" },
          columns: ["Setting", { en: "What it does", hi: "Kya karta hai" }, { en: "If it is wrong", hi: "Galat ho toh" }],
          rows: [
            ["IP address", { en: "Identifies this host on its subnet: 192.168.10.25", hi: "Subnet par is host ki pehchaan: 192.168.10.25" }, { en: "An address from the wrong subnet: the gateway and neighbours cannot reach it", hi: "Galat subnet ka address: gateway aur neighbours isse baat nahi kar paate" }],
            ["Subnet mask / prefix", { en: "Decides which destinations are local (ARP for them directly) and which are remote (send to the gateway)", hi: "Decide karta hai kaunsi destinations local hain (unke liye seedha ARP) aur kaunsi remote (gateway ko bhejo)" }, { en: "Some destinations become unreachable, depending on which way the mask is wrong", hi: "Mask kis taraf galat hai, uske hisaab se kuch destinations unreachable ho jaati hain" }],
            ["Default gateway", { en: "The router that receives everything not local: 192.168.10.1", hi: "Woh router jise local ke alawa sab kuch bheja jaata hai: 192.168.10.1" }, { en: "The LAN works; nothing beyond it does", hi: "LAN chalta hai; uske bahar kuch nahi" }],
            ["DNS server", { en: "Turns names such as www.example.com into IP addresses", hi: "www.example.com jaise names ko IP addresses mein badalta hai" }, { en: "Ping by IP works; anything by name fails", hi: "IP se ping chalta hai; naam se kuch nahi chalta" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Why the mask matters so much", hi: "Mask itna zaroori kyun hai" },
          text: {
            en: "You met this decision in the ARP lesson: the mask is what makes a host ARP for the destination itself or for its gateway. That is why a wrong mask causes such confusing symptoms.",
            hi: "ARP lesson mein yeh decision dekha tha: mask hi decide karta hai ki host destination ke liye ARP karega ya gateway ke liye. Isliye galat mask ke symptoms itne confusing hote hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "Two more facts help when troubleshooting: the host's **MAC address**, so you can find it in a switch's MAC address table, and, if DHCP is used, **which DHCP server** gave the lease and when it expires.",
            hi: "Troubleshooting mein do aur cheezein kaam aati hain: host ka **MAC address**, taaki switch ki MAC address table mein use dhoondh sako, aur agar DHCP use ho raha hai toh lease **kis DHCP server** ne di aur kab expire hogi.",
          },
        },
      ],
    },
    {
      id: "windows",
      heading: { en: "Windows: ipconfig and route print", hi: "Windows: ipconfig aur route print" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Open Command Prompt or PowerShell. Plain `ipconfig` shows each adapter's IPv4 address, mask and default gateway. It does **not** show the DNS servers or the MAC; for those you need `ipconfig /all`. You will also see a `Link-local IPv6 Address` starting with `fe80::`: as the IPv6 lessons showed, every IPv6-enabled adapter creates one for itself, so it tells you nothing about whether DHCP worked.",
            hi: "Command Prompt ya PowerShell kholo. Simple `ipconfig` har adapter ka IPv4 address, mask aur default gateway dikhata hai. DNS servers aur MAC yeh **nahi** dikhata; unke liye `ipconfig /all` chahiye. `fe80::` se shuru hone wala `Link-local IPv6 Address` bhi dikhega: IPv6 lessons mein dekha tha ki har IPv6-enabled adapter yeh khud bana leta hai, isliye isse pata nahi chalta ki DHCP chala ya nahi.",
          },
        },
        {
          type: "cli",
          title: { en: "ipconfig /all (one adapter, shortened)", hi: "ipconfig /all (ek adapter, chhota kiya hua)" },
          lines: [
            { prompt: "C:\\Users\\student>", cmd: "ipconfig /all" },
            { out: "Ethernet adapter Ethernet:" },
            { out: "   Description . . . . . . . . . . . : Intel(R) Ethernet Connection I219-LM" },
            { out: "   Physical Address. . . . . . . . . : 00-50-56-AA-00-01", comment: { en: "The MAC; Cisco writes the same address as 0050.56aa.0001", hi: "Yeh MAC hai; Cisco isi address ko 0050.56aa.0001 likhta hai" } },
            { out: "   DHCP Enabled. . . . . . . . . . . : Yes", comment: { en: "No would mean a static configuration", hi: "No ka matlab static configuration" } },
            { out: "   IPv4 Address. . . . . . . . . . . : 192.168.10.25(Preferred)" },
            { out: "   Subnet Mask . . . . . . . . . . . : 255.255.255.0" },
            { out: "   Lease Obtained. . . . . . . . . . : Wednesday, September 30, 2026 8:15:02 AM" },
            { out: "   Lease Expires . . . . . . . . . . : Thursday, October 1, 2026 8:15:02 AM", comment: { en: "A 24-hour lease", hi: "24 ghante ki lease" } },
            { out: "   Default Gateway . . . . . . . . . : 192.168.10.1" },
            { out: "   DHCP Server . . . . . . . . . . . : 192.168.10.1", comment: { en: "Here the gateway router is also the DHCP server", hi: "Yahan gateway router hi DHCP server bhi hai" } },
            { out: "   DNS Servers . . . . . . . . . . . : 8.8.8.8" },
            { out: "                                       8.8.4.4", comment: { en: "A second DNS server, tried if the first does not answer", hi: "Doosra DNS server, pehla jawab na de toh try hota hai" } },
          ],
        },
        {
          type: "p",
          text: {
            en: "`ipconfig /release` hands the DHCP lease back to the server and removes the IPv4 address. `ipconfig /renew` asks for a lease again. Use them after you fix a DHCP problem, or to test that DHCP works at all. The DHCP lesson, later in the course, shows the messages exchanged underneath.",
            hi: "`ipconfig /release` DHCP lease server ko wapas kar deta hai aur IPv4 address hata deta hai. `ipconfig /renew` dobara lease maangta hai. DHCP problem fix karne ke baad, ya yeh test karne ke liye ki DHCP chal bhi raha hai, inhe use karo. Andar kaunse messages exchange hote hain, woh aage DHCP lesson mein dekhoge.",
          },
        },
        {
          type: "cli",
          title: { en: "route print: the default route points at the gateway", hi: "route print: default route gateway ki taraf point karta hai" },
          lines: [
            { prompt: "C:\\Users\\student>", cmd: "route print -4" },
            { out: "IPv4 Route Table" },
            { out: "Active Routes:" },
            { out: "Network Destination        Netmask          Gateway       Interface  Metric" },
            { out: "          0.0.0.0          0.0.0.0     192.168.10.1    192.168.10.25     25", comment: { en: "0.0.0.0/0, the default route: anything not matched elsewhere goes to 192.168.10.1", hi: "0.0.0.0/0, yaani default route: jo kahin aur match nahi hota woh 192.168.10.1 ko jaata hai" } },
            { out: "     192.168.10.0    255.255.255.0         On-link     192.168.10.25    281", comment: { en: "The local subnet: On-link means deliver directly, after ARP", hi: "Local subnet: On-link ka matlab seedha deliver karo, ARP ke baad" } },
          ],
          note: {
            en: "Shortened: the real output also starts with an interface list and includes host routes such as 127.0.0.1, 192.168.10.25 and 192.168.10.255. Without `-4`, `route print` adds the IPv6 route table as well.",
            hi: "Output chhota kiya gaya hai: asli output ek interface list se shuru hota hai aur usme 127.0.0.1, 192.168.10.25 aur 192.168.10.255 jaise host routes bhi hote hain. `-4` ke bina `route print` IPv6 route table bhi dikhata hai.",
          },
        },
      ],
    },
    {
      id: "macos",
      heading: { en: "macOS: ifconfig, networksetup, netstat and scutil", hi: "macOS: ifconfig, networksetup, netstat aur scutil" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Open Terminal. On a MacBook, **en0** is usually Wi-Fi; on a desktop Mac with an Ethernet port, en0 is often the wired port. `networksetup -listallhardwareports` shows which name belongs to which port.",
            hi: "Terminal kholo. MacBook par **en0** aam taur par Wi-Fi hota hai; Ethernet port wale desktop Mac par en0 aksar wired port hota hai. Kaunsa naam kis port ka hai, yeh `networksetup -listallhardwareports` batata hai.",
          },
        },
        {
          type: "cli",
          title: { en: "ifconfig en0 (shortened)", hi: "ifconfig en0 (chhota kiya hua)" },
          lines: [
            { prompt: "student@MacBook-Air ~ %", cmd: "ifconfig en0" },
            { out: "en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500" },
            { out: "\tether 00:50:56:aa:00:02", comment: { en: "The MAC address", hi: "MAC address" } },
            { out: "\tinet 192.168.10.26 netmask 0xffffff00 broadcast 192.168.10.255", comment: { en: "The mask in hex: 0xffffff00 = 255.255.255.0 = /24", hi: "Hex mein mask: 0xffffff00 = 255.255.255.0 = /24" } },
            { out: "\tstatus: active" },
          ],
        },
        {
          type: "p",
          text: {
            en: "The mask is the only tricky part. Read `0xffffff00` two hex digits at a time: `ff.ff.ff.00` is 255.255.255.0. In the same way, `0xffffff80` is 255.255.255.128 (/25) and `0xfffffe00` is 255.255.254.0 (/23).",
            hi: "Sirf mask thoda tricky hai. `0xffffff00` ko do-do hex digits mein padho: `ff.ff.ff.00` yaani 255.255.255.0. Isi tarah `0xffffff80` hai 255.255.255.128 (/25) aur `0xfffffe00` hai 255.255.254.0 (/23).",
          },
        },
        {
          type: "cli",
          title: { en: "Gateway and DNS on macOS", hi: "macOS par gateway aur DNS" },
          lines: [
            { prompt: "student@MacBook-Air ~ %", cmd: "networksetup -getinfo Wi-Fi" },
            { out: "DHCP Configuration", comment: { en: "Manual Configuration here would mean static settings", hi: "Yahan Manual Configuration ka matlab static settings" } },
            { out: "IP address: 192.168.10.26" },
            { out: "Subnet mask: 255.255.255.0" },
            { out: "Router: 192.168.10.1", comment: { en: "macOS calls the default gateway Router", hi: "macOS default gateway ko Router kehta hai" } },
            { prompt: "student@MacBook-Air ~ %", cmd: "netstat -rn | grep default" },
            { out: "default            192.168.10.1       UGScg                 en0" },
            { prompt: "student@MacBook-Air ~ %", cmd: "scutil --dns | grep nameserver" },
            { out: "  nameserver[0] : 8.8.8.8" },
            { out: "  nameserver[1] : 8.8.4.4" },
          ],
          note: {
            en: "`ipconfig getpacket en0` prints the DHCP reply, including the DHCP server (server_identifier) and the lease time. To renew the lease, use System Settings > Network > Wi-Fi > Details > TCP/IP > Renew DHCP Lease, or `sudo ipconfig set en0 DHCP`.",
            hi: "`ipconfig getpacket en0` DHCP reply print karta hai, jisme DHCP server (server_identifier) aur lease time bhi hota hai. Lease renew karni ho toh System Settings > Network > Wi-Fi > Details > TCP/IP > Renew DHCP Lease use karo, ya `sudo ipconfig set en0 DHCP`.",
          },
        },
      ],
    },
    {
      id: "linux",
      heading: { en: "Linux: ip addr, ip route and resolvectl", hi: "Linux: ip addr, ip route aur resolvectl" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Modern Linux uses the `ip` command. The older `ifconfig` and `route` come from the net-tools package, which many distributions no longer install. Interface names vary: `eth0`, `ens33`, `enp0s3`, or `wlp2s0` for Wi-Fi.",
            hi: "Modern Linux `ip` command use karta hai. Purane `ifconfig` aur `route` net-tools package se aate hain, jo kai distributions ab install hi nahi karte. Interface ke naam alag ho sakte hain: `eth0`, `ens33`, `enp0s3`, ya Wi-Fi ke liye `wlp2s0`.",
          },
        },
        {
          type: "cli",
          title: { en: "Address and gateway", hi: "Address aur gateway" },
          lines: [
            { prompt: "student@ubuntu:~$", cmd: "ip addr show eth0" },
            { out: "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP" },
            { out: "    link/ether 00:50:56:aa:00:03 brd ff:ff:ff:ff:ff:ff", comment: { en: "The MAC address", hi: "MAC address" } },
            { out: "    inet 192.168.10.27/24 brd 192.168.10.255 scope global dynamic eth0", comment: { en: "Address with prefix; dynamic means it came from DHCP", hi: "Prefix ke saath address; dynamic ka matlab DHCP se aaya" } },
            { out: "       valid_lft 85934sec preferred_lft 85934sec", comment: { en: "Seconds left on the lease", hi: "Lease ke bache hue seconds" } },
            { prompt: "student@ubuntu:~$", cmd: "ip route" },
            { out: "default via 192.168.10.1 dev eth0 proto dhcp src 192.168.10.27 metric 100", comment: { en: "The default gateway, learned from DHCP", hi: "Default gateway, DHCP se seekha gaya" } },
            { out: "192.168.10.0/24 dev eth0 proto kernel scope link src 192.168.10.27 metric 100", comment: { en: "The local subnet, reached directly", hi: "Local subnet, jahan seedha pahunchte hain" } },
          ],
        },
        {
          type: "p",
          text: {
            en: "DNS is where Linux catches people out. On Ubuntu and other distributions that use systemd-resolved, `/etc/resolv.conf` points at `127.0.0.53`, a stub resolver running on the host itself. The real DNS servers sit behind it, and `resolvectl status` shows them. On a system without systemd-resolved, `/etc/resolv.conf` lists the real servers directly.",
            hi: "DNS mein Linux logon ko confuse karta hai. Ubuntu aur doosre systemd-resolved wale distributions par `/etc/resolv.conf` `127.0.0.53` dikhata hai, jo host ke andar hi chalne wala stub resolver hai. Asli DNS servers uske peeche hain, aur unhe `resolvectl status` dikhata hai. Jis system par systemd-resolved nahi hai, wahan `/etc/resolv.conf` mein seedha asli servers likhe hote hain.",
          },
        },
        {
          type: "cli",
          title: { en: "DNS servers on Ubuntu", hi: "Ubuntu par DNS servers" },
          lines: [
            { prompt: "student@ubuntu:~$", cmd: "cat /etc/resolv.conf" },
            { out: "nameserver 127.0.0.53", comment: { en: "The local stub, not the real server", hi: "Local stub, asli server nahi" } },
            { out: "options edns0 trust-ad" },
            { prompt: "student@ubuntu:~$", cmd: "resolvectl status eth0" },
            { out: "Link 2 (eth0)" },
            { out: "Current DNS Server: 8.8.8.8" },
            { out: "       DNS Servers: 8.8.8.8 8.8.4.4", comment: { en: "The servers the stub forwards queries to", hi: "Woh servers jinhe stub queries forward karta hai" } },
          ],
          note: {
            en: "The output of `resolvectl status` is shortened here. `resolvectl dns eth0` prints just the server list on one line.",
            hi: "Yahan `resolvectl status` ka output chhota kiya gaya hai. `resolvectl dns eth0` sirf servers ki list ek line mein dikhata hai.",
          },
        },
      ],
    },
    {
      id: "side-by-side",
      heading: { en: "Same question, three operating systems", hi: "Ek sawaal, teen operating systems" },
      blocks: [
        {
          type: "table",
          caption: { en: "Which command answers which question", hi: "Kaunsa command kis sawaal ka jawab deta hai" },
          columns: [{ en: "You want", hi: "Tumhe chahiye" }, "Windows", "macOS", "Linux"],
          rows: [
            [{ en: "Address and mask", hi: "Address aur mask" }, "ipconfig", "ifconfig en0", "ip addr"],
            ["MAC address", "ipconfig /all", "ifconfig en0 (ether)", "ip addr (link/ether)"],
            ["Default gateway", "ipconfig, route print", "networksetup -getinfo Wi-Fi, netstat -rn", "ip route"],
            ["DNS servers", "ipconfig /all", "scutil --dns", "resolvectl status"],
            [{ en: "DHCP server and lease", hi: "DHCP server aur lease" }, "ipconfig /all", "ipconfig getpacket en0", { en: "ip addr (time left only)", hi: "ip addr (sirf bacha hua time)" }],
            [{ en: "Renew the lease", hi: "Lease renew karna" }, "ipconfig /release, ipconfig /renew", "sudo ipconfig set en0 DHCP", { en: "Depends on the network service, e.g. `sudo networkctl renew eth0`", hi: "Network service par depend karta hai, jaise `sudo networkctl renew eth0`" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "What the exam does with this", hi: "Exam isse kya poochta hai" },
          text: {
            en: "The exam can show output from any of the three systems and ask for the address, mask, gateway or DNS server, or ask what is wrong. Know the field names: Physical Address and Default Gateway (Windows); ether, inet, netmask and Router (macOS); link/ether, inet and default via (Linux).",
            hi: "Exam teeno mein se kisi bhi system ka output dikha kar address, mask, gateway ya DNS server pooch sakta hai, ya yeh ki galat kya hai. Field names yaad rakho: Physical Address aur Default Gateway (Windows); ether, inet, netmask aur Router (macOS); link/ether, inet aur default via (Linux).",
          },
        },
      ],
    },
    {
      id: "spotting-faults",
      heading: { en: "Spotting what is wrong", hi: "Galti kaise pakdein" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Read the four settings, then ask three questions: is the address a proper one for this LAN (not 169.254.x.x), is the gateway inside the host's own subnet, and is there a DNS server? Most client faults show up in one of these.",
            hi: "Chaaron settings padho, phir teen sawaal poocho: kya address is LAN ka sahi address hai (169.254.x.x nahi), kya gateway host ke apne subnet ke andar hai, aur kya DNS server hai? Client ki zyada tar galtiyan inhi mein se kisi ek mein dikh jaati hain.",
          },
        },
        {
          type: "table",
          caption: { en: "Four faults you can see in the output", hi: "Chaar faults jo output mein dikh jaate hain" },
          columns: [{ en: "What you see", hi: "Kya dikhta hai" }, { en: "What it means", hi: "Matlab kya hai" }, { en: "What to do", hi: "Kya karna hai" }],
          rows: [
            [
              { en: "169.254.x.x, mask 255.255.0.0, no gateway", hi: "169.254.x.x, mask 255.255.0.0, gateway nahi" },
              { en: "APIPA: the host asked for DHCP and got no answer. Windows and macOS do this; many Linux hosts simply show no IPv4 address", hi: "APIPA: host ne DHCP maanga aur jawab nahi mila. Windows aur macOS aisa karte hain; kai Linux hosts par bas koi IPv4 address nahi dikhta" },
              { en: "Check the cable, the switch port's VLAN, the DHCP server or relay; then renew", hi: "Cable, switch port ka VLAN, DHCP server ya relay check karo; phir renew karo" },
            ],
            [
              { en: "Gateway not inside the host's subnet", hi: "Gateway host ke subnet ke andar nahi" },
              { en: "Local traffic works; nothing off the subnet does", hi: "Local traffic chalta hai; subnet ke bahar kuch nahi" },
              { en: "Fix the gateway, or the mask if that is the real mistake", hi: "Gateway theek karo, ya mask agar asli galti wahan hai" },
            ],
            [
              { en: "Mask different from the router interface's mask", hi: "Mask router interface ke mask se alag" },
              { en: "The host draws the subnet boundary in the wrong place and sends some traffic the wrong way", hi: "Host subnet ki boundary galat jagah maanta hai aur kuch traffic galat raaste bhejta hai" },
              { en: "Use the same mask as the router interface", hi: "Router interface wala hi mask lagao" },
            ],
            [
              { en: "No DNS server, or a wrong one", hi: "DNS server nahi hai, ya galat hai" },
              { en: "Ping by IP works; names fail", hi: "IP se ping chalta hai; names fail hote hain" },
              { en: "Set a working DNS server", hi: "Chalne wala DNS server set karo" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "**Worked example, gateway outside the subnet.** A host has 172.16.5.70 with mask 255.255.255.192 (/26) and gateway 172.16.5.1. A /26 makes blocks of 64, so the host sits in 172.16.5.64/26, with usable addresses .65 to .126. The gateway .1 belongs to 172.16.5.0/26, a different subnet. The host can reach its neighbours but nothing beyond them.",
            hi: "**Worked example, subnet ke bahar gateway.** Host ka address 172.16.5.70, mask 255.255.255.192 (/26) aur gateway 172.16.5.1 hai. /26 se 64 ke blocks bante hain, toh host 172.16.5.64/26 mein hai, jiske usable addresses .65 se .126 hain. Gateway .1 toh 172.16.5.0/26 ka hai, yaani doosra subnet. Host apne neighbours tak pahunch jaata hai, lekin unke aage kuch nahi.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Worked example, mask too short.** A Linux host is set by hand to 192.168.10.27/16 while the router uses /24. The internet still works, because 8.8.8.8 is clearly outside 192.168.0.0/16. But a server at 192.168.20.50, in another subnet behind the router, now looks local, so the host ARPs for it directly instead of using the gateway. Unless the router answers with proxy ARP (on by default in IOS, and the reason this mistake can hide), nobody replies and the ping fails.",
            hi: "**Worked example, mask bahut chhota.** Ek Linux host ko haath se 192.168.10.27/16 set kiya gaya hai, jabki router /24 use karta hai. Internet phir bhi chalta hai, kyunki 8.8.8.8 saaf taur par 192.168.0.0/16 ke bahar hai. Lekin router ke peeche doosre subnet ka server 192.168.20.50 ab local lagta hai, isliye host gateway use karne ki jagah uske liye seedha ARP karta hai. Jab tak router proxy ARP se jawab na de (IOS mein yeh by default on hai, aur isi wajah se yeh galti chhup sakti hai), koi reply nahi karta aur ping fail hota hai.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "Read the settings. A 169.254.x.x address stops you here: fix DHCP first.",
              hi: "Settings padho. 169.254.x.x address dikhe toh yahin ruko: pehle DHCP theek karo.",
            },
            {
              en: "Check that the gateway is inside the host's subnet, then ping it. This tests the local link and ARP.",
              hi: "Check karo ki gateway host ke subnet ke andar hai, phir use ping karo. Isse local link aur ARP test hote hain.",
            },
            {
              en: "Ping a remote IP address such as 8.8.8.8. This tests the gateway and the routing beyond it.",
              hi: "8.8.8.8 jaise kisi remote IP address ko ping karo. Isse gateway aur uske aage ki routing test hoti hai.",
            },
            {
              en: "Ping a name such as www.example.com. If the previous step worked and this one fails, the problem is DNS.",
              hi: "www.example.com jaise kisi naam ko ping karo. Agar pichla step chala aur yeh fail hua, toh problem DNS mein hai.",
            },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Subnet mask / prefix length", def: { en: "Marks which bits of an address are the network part; 255.255.255.0 and /24 mean the same thing.", hi: "Batata hai address ke kaunse bits network part hain; 255.255.255.0 aur /24 ka matlab ek hi hai." } },
    { term: "Default gateway", def: { en: "The router a host sends traffic to when the destination is outside its own subnet.", hi: "Woh router jise host traffic bhejta hai jab destination uske apne subnet ke bahar ho." } },
    { term: "DNS server", def: { en: "The server a host asks to turn a name into an IP address.", hi: "Woh server jisse host naam ko IP address mein badalwata hai." } },
    { term: "DHCP lease", def: { en: "An address and settings a DHCP server lends a host for a fixed time; the host must renew it before it expires.", hi: "DHCP server ka host ko fixed time ke liye diya gaya address aur settings; expire hone se pehle host ko ise renew karna padta hai." } },
    { term: "APIPA", def: { en: "Automatic Private IP Addressing: a 169.254.0.0/16 address a host gives itself when DHCP gets no answer.", hi: "Automatic Private IP Addressing: 169.254.0.0/16 ka address jo host khud ko deta hai jab DHCP ka jawab nahi aata." } },
    { term: "Physical Address", def: { en: "The Windows name for the MAC address, written like 00-50-56-AA-00-01.", hi: "MAC address ka Windows wala naam, jo 00-50-56-AA-00-01 jaise likha jaata hai." } },
    { term: "Default route", def: { en: "The 0.0.0.0/0 route that points at the default gateway; shown as 0.0.0.0 in route print and as default on macOS and Linux.", hi: "0.0.0.0/0 route jo default gateway ki taraf point karta hai; route print mein 0.0.0.0 aur macOS/Linux mein default dikhta hai." } },
    { term: "Stub resolver", def: { en: "A local DNS forwarder, such as systemd-resolved on 127.0.0.53, that passes queries on to the real DNS servers.", hi: "Local DNS forwarder, jaise 127.0.0.53 par systemd-resolved, jo queries asli DNS servers ko aage bhej deta hai." } },
  ],
  commands: [
    { cmd: "ipconfig", mode: "Windows Command Prompt", does: { en: "Show each adapter's IPv4 address, mask and default gateway", hi: "Har adapter ka IPv4 address, mask aur default gateway dikhata hai" } },
    { cmd: "ipconfig /all", mode: "Windows Command Prompt", does: { en: "Add the MAC, DHCP server, lease times and DNS servers", hi: "MAC, DHCP server, lease times aur DNS servers bhi dikhata hai" } },
    { cmd: "ipconfig /release", mode: "Windows Command Prompt", does: { en: "Give the DHCP lease back and remove the IPv4 address", hi: "DHCP lease wapas karta hai aur IPv4 address hata deta hai" } },
    { cmd: "ipconfig /renew", mode: "Windows Command Prompt", does: { en: "Ask DHCP for a lease again", hi: "DHCP se dobara lease maangta hai" } },
    { cmd: "route print -4", mode: "Windows Command Prompt", does: { en: "Show the IPv4 routing table, including the 0.0.0.0 default route", hi: "IPv4 routing table dikhata hai, 0.0.0.0 default route ke saath" } },
    { cmd: "ifconfig en0", mode: "macOS Terminal", does: { en: "Show the MAC (ether), IPv4 address (inet) and hex netmask", hi: "MAC (ether), IPv4 address (inet) aur hex netmask dikhata hai" } },
    { cmd: "networksetup -getinfo Wi-Fi", mode: "macOS Terminal", does: { en: "Show address, mask, router and whether DHCP is used", hi: "Address, mask, router aur DHCP use ho raha hai ya nahi, dikhata hai" } },
    { cmd: "networksetup -listallhardwareports", mode: "macOS Terminal", does: { en: "Show which interface name (en0, en1) belongs to which port", hi: "Kaunsa interface naam (en0, en1) kis port ka hai, dikhata hai" } },
    { cmd: "netstat -rn", mode: "macOS Terminal", does: { en: "Show the routing table; the default line is the gateway", hi: "Routing table dikhata hai; default line gateway hai" } },
    { cmd: "scutil --dns", mode: "macOS Terminal", does: { en: "Show the DNS resolvers in use", hi: "Use ho rahe DNS resolvers dikhata hai" } },
    { cmd: "ipconfig getpacket en0", mode: "macOS Terminal", does: { en: "Show the DHCP reply: server, lease time and options", hi: "DHCP reply dikhata hai: server, lease time aur options" } },
    { cmd: "sudo ipconfig set en0 DHCP", mode: "macOS Terminal", does: { en: "Set en0 to DHCP and request a new lease", hi: "en0 ko DHCP par set karke nayi lease maangta hai" } },
    { cmd: "ip addr", mode: "Linux terminal", does: { en: "Show the MAC, addresses with prefix, and lease time left", hi: "MAC, prefix ke saath addresses, aur lease ka bacha time dikhata hai" } },
    { cmd: "ip route", mode: "Linux terminal", does: { en: "Show the routing table; default via is the gateway", hi: "Routing table dikhata hai; default via gateway hai" } },
    { cmd: "cat /etc/resolv.conf", mode: "Linux terminal", does: { en: "Show the resolver file; 127.0.0.53 means systemd-resolved is in use", hi: "Resolver file dikhata hai; 127.0.0.53 ka matlab systemd-resolved use ho raha hai" } },
    { cmd: "resolvectl status", mode: "Linux terminal", does: { en: "Show the real DNS servers systemd-resolved is using", hi: "systemd-resolved jo asli DNS servers use kar raha hai, woh dikhata hai" } },
    { cmd: "resolvectl dns eth0", mode: "Linux terminal", does: { en: "Show just the DNS servers of one interface", hi: "Sirf ek interface ke DNS servers dikhata hai" } },
    { cmd: "ping", mode: "Windows / macOS / Linux terminal", does: { en: "Test reachability of an address or a name (use -c 1 on Linux and macOS to send one)", hi: "Kisi address ya naam tak pahunch test karta hai (Linux aur macOS par ek bhejne ke liye -c 1)" } },
  ],
  mistakes: [
    {
      en: "Reading plain `ipconfig` and deciding there is no DNS server. Plain ipconfig never shows the DNS servers (only a DNS suffix); use `ipconfig /all`.",
      hi: "Simple `ipconfig` dekh kar maan lena ki DNS server hai hi nahi. Simple ipconfig DNS servers kabhi nahi dikhata (sirf DNS suffix); `ipconfig /all` use karo.",
    },
    {
      en: "Treating a 169.254.x.x address as a settings problem on the PC. It means DHCP got no answer; look at the path to the DHCP server.",
      hi: "169.254.x.x address ko PC ki settings ki problem samajhna. Iska matlab DHCP ko jawab nahi mila; DHCP server tak ka raasta check karo.",
    },
    {
      en: "Checking that a gateway is set but not that it is inside the host's subnet. Always do the subnet maths on the address and mask.",
      hi: "Sirf yeh check karna ki gateway set hai, yeh nahi ki woh host ke subnet ke andar hai. Address aur mask par hamesha subnet ka calculation karo.",
    },
    {
      en: "Misreading the macOS netmask. `0xffffff00` is 255.255.255.0 written in hex, not a strange mask.",
      hi: "macOS ka netmask galat padhna. `0xffffff00` hex mein likha 255.255.255.0 hai, koi ajeeb mask nahi.",
    },
    {
      en: "Taking `nameserver 127.0.0.53` on Ubuntu as a broken DNS setting. It is the local stub; `resolvectl status` shows the real servers.",
      hi: "Ubuntu par `nameserver 127.0.0.53` ko toota hua DNS setting samajhna. Yeh local stub hai; asli servers `resolvectl status` dikhata hai.",
    },
    {
      en: "Blaming DNS when a ping to an IP address also fails. DNS only affects names; if 8.8.8.8 is unreachable too, check the address, mask and gateway first.",
      hi: "IP address ka ping bhi fail ho raha ho, phir bhi DNS ko blame karna. DNS sirf names ko affect karta hai; agar 8.8.8.8 bhi unreachable hai toh pehle address, mask aur gateway dekho.",
    },
  ],
  recap: [
    { en: "Every host needs an address, a mask, a default gateway and a DNS server; the MAC and the DHCP lease help with troubleshooting.", hi: "Har host ko address, mask, default gateway aur DNS server chahiye; MAC aur DHCP lease troubleshooting mein madad karte hain." },
    { en: "Windows: `ipconfig` for the basics, `ipconfig /all` for MAC, DHCP and DNS, `/release` and `/renew` for the lease, `route print` for the default route.", hi: "Windows: basics ke liye `ipconfig`, MAC, DHCP aur DNS ke liye `ipconfig /all`, lease ke liye `/release` aur `/renew`, default route ke liye `route print`." },
    { en: "macOS: `ifconfig en0` (hex netmask), `networksetup -getinfo Wi-Fi` (Router = gateway), `netstat -rn`, `scutil --dns`.", hi: "macOS: `ifconfig en0` (hex mein netmask), `networksetup -getinfo Wi-Fi` (Router = gateway), `netstat -rn`, `scutil --dns`." },
    { en: "Linux: `ip addr` (dynamic = DHCP), `ip route` (default via = gateway), `resolvectl status` for DNS; 127.0.0.53 is the local stub.", hi: "Linux: `ip addr` (dynamic = DHCP), `ip route` (default via = gateway), DNS ke liye `resolvectl status`; 127.0.0.53 local stub hai." },
    { en: "169.254.x.x means DHCP failed. A gateway outside the subnet means nothing remote works. Ping by IP works but names fail means DNS.", hi: "169.254.x.x ka matlab DHCP fail hua. Gateway subnet ke bahar hai toh remote kuch nahi chalega. IP se ping chale par names fail hon toh DNS ki problem hai." },
  ],
  quiz: [
    {
      q: {
        en: "`ipconfig` on a Windows PC shows `Autoconfiguration IPv4 Address . . : 169.254.37.112`, mask 255.255.0.0 and an empty default gateway. What is the most likely cause?",
        hi: "Windows PC par `ipconfig` dikhata hai `Autoconfiguration IPv4 Address . . : 169.254.37.112`, mask 255.255.0.0 aur default gateway khaali. Sabse likely cause kya hai?",
      },
      options: [
        { en: "The DNS server address is wrong", hi: "DNS server ka address galat hai" },
        { en: "The PC asked for DHCP and no DHCP server answered", hi: "PC ne DHCP maanga aur kisi DHCP server ne jawab nahi diya" },
        { en: "The default gateway address was typed incorrectly", hi: "Default gateway ka address galat type hua" },
        { en: "The subnet mask should be 255.255.255.0", hi: "Subnet mask 255.255.255.0 hona chahiye" },
      ],
      answer: 1,
      explain: {
        en: "A 169.254.0.0/16 address is APIPA: Windows gives itself one only when DHCP gets no reply. The /16 mask and the empty gateway are part of APIPA, not the cause of it.",
        hi: "169.254.0.0/16 address APIPA hai: Windows khud ko yeh tabhi deta hai jab DHCP ka koi reply na aaye. /16 mask aur khaali gateway APIPA ka hissa hain, uska cause nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A host has address 172.16.5.70, mask 255.255.255.192 and default gateway 172.16.5.1. It can ping hosts on its own subnet but no IP address beyond it. What is wrong?",
        hi: "Ek host ka address 172.16.5.70, mask 255.255.255.192 aur default gateway 172.16.5.1 hai. Woh apne subnet ke hosts ko ping kar leta hai, lekin uske bahar kisi IP address ko nahi. Galat kya hai?",
      },
      options: [
        { en: "The gateway 172.16.5.1 is outside the host's subnet, 172.16.5.64/26", hi: "Gateway 172.16.5.1 host ke subnet 172.16.5.64/26 ke bahar hai" },
        { en: "172.16.5.70 is the broadcast address of its subnet", hi: "172.16.5.70 apne subnet ka broadcast address hai" },
        { en: "No DNS server is configured", hi: "Koi DNS server configured nahi hai" },
        { en: "255.255.255.192 is not a valid subnet mask", hi: "255.255.255.192 valid subnet mask nahi hai" },
      ],
      answer: 0,
      explain: {
        en: "A /26 gives blocks of 64: .0-.63, .64-.127, .128-.191, .192-.255. The host is in 172.16.5.64/26 (usable .65-.126), so its gateway must be in that range. 172.16.5.1 belongs to 172.16.5.0/26. DNS cannot be the cause, because pings to IP addresses fail too.",
        hi: "/26 se 64 ke blocks bante hain: .0-.63, .64-.127, .128-.191, .192-.255. Host 172.16.5.64/26 mein hai (usable .65-.126), isliye gateway bhi isi range mein hona chahiye. 172.16.5.1 toh 172.16.5.0/26 ka hai. DNS cause nahi ho sakta, kyunki IP addresses ke ping bhi fail ho rahe hain.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "On a Mac, `ifconfig en0` shows `inet 10.20.30.40 netmask 0xfffffe00 broadcast 10.20.31.255`. What is the prefix length?",
        hi: "Mac par `ifconfig en0` dikhata hai `inet 10.20.30.40 netmask 0xfffffe00 broadcast 10.20.31.255`. Prefix length kya hai?",
      },
      options: [
        { en: "/24", hi: "/24" },
        { en: "/22", hi: "/22" },
        { en: "/25", hi: "/25" },
        { en: "/23", hi: "/23" },
      ],
      answer: 3,
      explain: {
        en: "Split the hex into pairs: ff.ff.fe.00 = 255.255.254.0. 254 is 11111110, so there are 8 + 8 + 7 = 23 network bits. The broadcast agrees: 10.20.30.0/23 runs from 10.20.30.0 to 10.20.31.255.",
        hi: "Hex ko pairs mein todo: ff.ff.fe.00 = 255.255.254.0. 254 yaani 11111110, toh 8 + 8 + 7 = 23 network bits. Broadcast bhi yahi batata hai: 10.20.30.0/23 10.20.30.0 se 10.20.31.255 tak jaata hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A user can ping 8.8.8.8, but `ping www.example.com` fails with \"could not find host\". Which setting do you check first?",
        hi: "User 8.8.8.8 ping kar pa raha hai, lekin `ping www.example.com` \"could not find host\" ke saath fail hota hai. Sabse pehle kaunsi setting check karoge?",
      },
      options: [
        { en: "The default gateway", hi: "Default gateway" },
        { en: "The subnet mask", hi: "Subnet mask" },
        { en: "The DNS server", hi: "DNS server" },
        { en: "The MAC address", hi: "MAC address" },
      ],
      answer: 2,
      explain: {
        en: "Reaching 8.8.8.8 proves the address, mask and gateway work. Only the name lookup failed, and that is the DNS server's job. On Windows check `ipconfig /all`; on Linux, `resolvectl status`.",
        hi: "8.8.8.8 tak pahunchna saabit karta hai ki address, mask aur gateway theek hain. Sirf name lookup fail hua, aur yeh DNS server ka kaam hai. Windows par `ipconfig /all` dekho; Linux par `resolvectl status`.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "On an Ubuntu host, `/etc/resolv.conf` contains `nameserver 127.0.0.53`. What does that tell you?",
        hi: "Ubuntu host par `/etc/resolv.conf` mein `nameserver 127.0.0.53` likha hai. Isse kya pata chalta hai?",
      },
      options: [
        { en: "Queries go to the local systemd-resolved stub; `resolvectl status` shows the real DNS servers", hi: "Queries local systemd-resolved stub ko jaati hain; asli DNS servers `resolvectl status` dikhata hai" },
        { en: "DNS is broken, because 127.0.0.53 is a loopback address", hi: "DNS toota hua hai, kyunki 127.0.0.53 loopback address hai" },
        { en: "127.0.0.53 is the host's default gateway", hi: "127.0.0.53 host ka default gateway hai" },
        { en: "127.0.0.53 is the address of the DHCP server", hi: "127.0.0.53 DHCP server ka address hai" },
      ],
      answer: 0,
      explain: {
        en: "systemd-resolved listens on 127.0.0.53 on the host itself and forwards queries to the servers it learned from DHCP or static settings. Being a loopback address is the point: the stub runs locally.",
        hi: "systemd-resolved host ke andar hi 127.0.0.53 par listen karta hai aur queries un servers ko forward karta hai jo usne DHCP ya static settings se seekhe. Loopback address hona hi toh point hai: stub locally chalta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Which Windows command shows the DHCP server that gave the PC its address and when the lease expires?",
        hi: "Kaunsa Windows command dikhata hai ki PC ko address kis DHCP server ne diya aur lease kab expire hogi?",
      },
      options: [
        { en: "route print", hi: "route print" },
        { en: "ipconfig", hi: "ipconfig" },
        { en: "arp -a", hi: "arp -a" },
        { en: "ipconfig /all", hi: "ipconfig /all" },
      ],
      answer: 3,
      explain: {
        en: "Only `ipconfig /all` shows DHCP Server, Lease Obtained and Lease Expires, along with the MAC and DNS servers. Plain `ipconfig` stops at the address, mask and gateway.",
        hi: "Sirf `ipconfig /all` DHCP Server, Lease Obtained aur Lease Expires dikhata hai, saath mein MAC aur DNS servers bhi. Simple `ipconfig` address, mask aur gateway par hi ruk jaata hai.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "8VALXJjWBUA",
      title: "Free CCNA 200-301 Course 23-06: Windows, Mac and Linux client IP settings",
      channel: "Flackbox",
      lang: "en",
      note: {
        en: "An eight-minute walkthrough of the settings on all three operating systems.",
        hi: "Teeno operating systems par settings ka aath minute ka walkthrough.",
      },
    },
    {
      id: "wKi0E0F6rDk",
      title: "1.10 Verify IP parameters for Client OS Windows, Mac OS, Linux - CCNA",
      channel: "NetworkBruh",
      lang: "en",
      note: {
        en: "A short video on exam topic 1.10: the four IP parameters and how to verify them.",
        hi: "Exam topic 1.10 par chhota video: chaar IP parameters aur unhe verify kaise karein.",
      },
    },
    {
      id: "XXAuFAoUy6M",
      title: "158. CCNA 200-301 Full Course in Hindi 2024 | Host/Client IP Settings on Different Operating Systems",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "A five-minute Hindi overview of client IP settings on different operating systems.",
        hi: "Alag operating systems par client IP settings ka paanch minute ka Hindi overview.",
      },
    },
    {
      id: "mkETBA_-yQI",
      title: "24. IP Configuration & DNS Troubleshooting Explained",
      channel: "NetworkPath",
      lang: "hi",
      note: {
        en: "Hands-on Windows troubleshooting: ipconfig /all, /release, /renew, nslookup and DNS faults.",
        hi: "Windows par hands-on troubleshooting: ipconfig /all, /release, /renew, nslookup aur DNS faults.",
      },
    },
  ],
  lab: {
    title: { en: "Read, break and fix client IP settings", hi: "Client IP settings padho, todo aur theek karo" },
    steps: [
      {
        en: "On your own computer, run the commands for your OS and write down the address, mask or prefix, gateway, DNS servers, MAC and DHCP server.",
        hi: "Apne computer par apne OS ke commands chalao aur address, mask ya prefix, gateway, DNS servers, MAC aur DHCP server note karo.",
      },
      {
        en: "From the address and mask, work out your subnet's network and broadcast addresses, and confirm the gateway is inside that range.",
        hi: "Address aur mask se apne subnet ka network aur broadcast address nikalo, aur confirm karo ki gateway usi range ke andar hai.",
      },
      {
        en: "In Packet Tracer, connect two PCs and a Server-PT to a switch. Give the server 192.168.10.2/24 and turn on its DHCP service with default gateway 192.168.10.1, DNS server 8.8.8.8 and start address 192.168.10.100.",
        hi: "Packet Tracer mein do PCs aur ek Server-PT ko switch se jodo. Server ko 192.168.10.2/24 do aur uski DHCP service on karo: default gateway 192.168.10.1, DNS server 8.8.8.8 aur start address 192.168.10.100.",
      },
      {
        en: "Set both PCs to DHCP, then run `ipconfig /all` in each PC's Command Prompt and match every field to the server's pool.",
        hi: "Dono PCs ko DHCP par set karo, phir har PC ke Command Prompt mein `ipconfig /all` chalao aur har field ko server ke pool se match karo.",
      },
      {
        en: "Turn the server's DHCP service off, run `ipconfig /release` and `ipconfig /renew` on one PC, and watch it fall back to a 169.254.x.x address. Turn DHCP on again and renew.",
        hi: "Server ki DHCP service off karo, ek PC par `ipconfig /release` aur `ipconfig /renew` chalao, aur dekho ki woh 169.254.x.x address par aa jaata hai. DHCP wapas on karke phir renew karo.",
      },
      {
        en: "Set PC1 by hand to 192.168.10.150 with mask 255.255.255.128 and ping PC2 at its DHCP address. Use the mask to explain why the ping fails.",
        hi: "PC1 ko haath se 192.168.10.150 aur mask 255.255.255.128 do, aur PC2 ko uske DHCP address par ping karo. Mask ki madad se samjhao ki ping kyun fail hota hai.",
      },
    ],
  },
};

export default lesson;
