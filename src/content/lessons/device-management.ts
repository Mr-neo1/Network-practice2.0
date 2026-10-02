import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "device-management",
  intro: {
    en: "Every router and switch has to be configured, checked and fixed, usually from a desk far from the rack. How you reach it matters: one method needs no network at all, one sends your password across the network in plain text, and some let a single server decide who may log in to hundreds of devices. The CCNA expects you to know each method, its port and its risks.",
    hi: "Har router aur switch ko configure, check aur fix karna padta hai, aksar rack se kaafi door baithe desk se. Tum device tak kaise pahunchte ho, yeh matter karta hai: ek method ko network ki zaroorat hi nahi, ek tumhara password network par plain text mein bhejta hai, aur kuch mein ek hi server decide karta hai ki sainkdon devices par kaun login kar sakta hai. CCNA expect karta hai ki tum har method, uska port aur uske risks jaano.",
  },
  outcomes: [
    { en: "Compare out-of-band (console) and in-band (Telnet, SSH, HTTP, HTTPS) management", hi: "Out-of-band (console) aur in-band (Telnet, SSH, HTTP, HTTPS) management compare kar sako" },
    { en: "Explain why Telnet (TCP 23) is unsafe and SSH (TCP 22) replaces it", hi: "Samjha sako ki Telnet (TCP 23) unsafe kyun hai aur SSH (TCP 22) uski jagah kyun leta hai" },
    { en: "Give a Layer 2 switch a management IP with an SVI and `ip default-gateway`", hi: "Layer 2 switch ko SVI aur `ip default-gateway` se management IP de sako" },
    { en: "Describe how TACACS+ and RADIUS centralise logins, and how they differ", hi: "Describe kar sako ki TACACS+ aur RADIUS logins ko central kaise karte hain, aur dono mein kya fark hai" },
    { en: "Describe cloud-managed devices and what they send to the cloud", hi: "Cloud-managed devices describe kar sako aur batao ki woh cloud ko kya bhejte hain" },
  ],
  sections: [
    {
      id: "out-of-band-and-in-band",
      heading: { en: "Two ways in: out-of-band and in-band", hi: "Andar aane ke do raaste: out-of-band aur in-band" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**In-band** management travels over the same network the users use: you SSH to an IP address on the device. It is convenient, but if the network is broken, or the device has no IP address yet, you cannot get in. **Out-of-band** (OOB) management uses a separate path that does not depend on the production network, so it still works when that network is down.",
            hi: "**In-band** management usi network par chalta hai jo users use karte hain: tum device ke kisi IP address par SSH karte ho. Yeh convenient hai, lekin network toota ho, ya device ka abhi IP address hi na ho, toh tum andar nahi ja sakte. **Out-of-band** (OOB) management ek alag raasta use karta hai jo production network par depend nahi karta, isliye woh network down hone par bhi kaam karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The management access methods in the exam topics", hi: "Exam topics mein diye management access methods" },
          columns: [{ en: "Method", hi: "Method" }, { en: "Path", hi: "Raasta" }, { en: "Port", hi: "Port" }, { en: "Encrypted?", hi: "Encrypted?" }],
          rows: [
            ["Console", { en: "Out-of-band, serial cable", hi: "Out-of-band, serial cable" }, { en: "Console port", hi: "Console port" }, { en: "No, but it is a local cable", hi: "Nahi, lekin yeh local cable hai" }],
            ["Telnet", "In-band", "TCP 23", { en: "No", hi: "Nahi" }],
            ["SSH", "In-band", "TCP 22", { en: "Yes", hi: "Haan" }],
            ["HTTP", "In-band", "TCP 80", { en: "No", hi: "Nahi" }],
            ["HTTPS", "In-band", "TCP 443", { en: "Yes (TLS)", hi: "Haan (TLS)" }],
            [
              { en: "Cloud dashboard", hi: "Cloud dashboard" },
              { en: "Browser to vendor cloud; device keeps its own outbound tunnel to the cloud", hi: "Browser se vendor cloud tak; device cloud tak apna outbound tunnel rakhta hai" },
              { en: "TCP 443 (browser)", hi: "TCP 443 (browser)" },
              { en: "Yes", hi: "Haan" },
            ],
          ],
        },
      ],
    },
    {
      id: "console",
      heading: { en: "Console: the way in when nothing else works", hi: "Console: jab kuch aur kaam na kare" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every Cisco router and switch has a **console port**: an RJ-45 port used with a rollover cable and a serial or USB adapter, and on newer models also a USB mini-B or USB-C port. You open a terminal program such as PuTTY or Tera Term with the default settings **9600 baud, 8 data bits, no parity, 1 stop bit, no flow control** (9600 8N1).",
            hi: "Har Cisco router aur switch mein ek **console port** hota hai: RJ-45 port jo rollover cable aur serial ya USB adapter ke saath use hota hai, aur naye models mein USB mini-B ya USB-C port bhi. Tum PuTTY ya Tera Term jaisa terminal program default settings ke saath kholte ho: **9600 baud, 8 data bits, no parity, 1 stop bit, no flow control** (9600 8N1).",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "It works with no IP address and no working network, so it is how you configure a new device and how you recover one that is unreachable.",
              hi: "Yeh bina IP address aur bina chalte network ke kaam karta hai, isliye naya device configure karna ho ya unreachable device ko recover karna ho, console hi use hota hai.",
            },
            {
              en: "It needs physical access. For remote sites, a **console server** (terminal server) is cabled to the console ports of many devices and reached over its own separate connection, which gives remote out-of-band access.",
              hi: "Iske liye physical access chahiye. Remote sites ke liye ek **console server** (terminal server) kai devices ke console ports se cable se juda hota hai, aur us tak apne alag connection se pahuncha jaata hai; isse remote out-of-band access mil jaata hai.",
            },
            {
              en: "Many devices also have a dedicated **management Ethernet port**, for example `GigabitEthernet0/0` on a Catalyst 9300, kept in its own VRF so it can join a separate out-of-band management network.",
              hi: "Kai devices mein ek dedicated **management Ethernet port** bhi hota hai, jaise Catalyst 9300 par `GigabitEthernet0/0`, jo apne alag VRF mein rehta hai taaki woh alag out-of-band management network se jud sake.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Physical access is access", hi: "Physical access matlab poora access" },
          text: {
            en: "Anyone who can reach the console port can plug in and try to log in, or use password recovery. Protect the console line with a login (lesson 5.2) and keep devices in a locked room or rack.",
            hi: "Jo bhi console port tak pahunch sakta hai, woh cable laga kar login try kar sakta hai, ya password recovery kar sakta hai. Console line ko login se protect karo (lesson 5.2) aur devices ko locked room ya rack mein rakho.",
          },
        },
      ],
    },
    {
      id: "telnet-vs-ssh",
      heading: { en: "Remote CLI: Telnet vs SSH", hi: "Remote CLI: Telnet vs SSH" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Remote CLI sessions land on the device's **VTY lines** (virtual terminal lines), usually `line vty 0 4` (5 sessions at once) or `line vty 0 15` (16 sessions). The VTY configuration decides which protocols are accepted and how users log in.",
            hi: "Remote CLI sessions device ki **VTY lines** (virtual terminal lines) par aate hain, aam taur par `line vty 0 4` (ek saath 5 sessions) ya `line vty 0 15` (16 sessions). VTY configuration decide karta hai ki kaunse protocols accept honge aur users login kaise karenge.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Telnet** (TCP port 23) sends every character in **clear text**, including the username and password. Anyone who can capture the packets can read them. In the animation, an attacker at `10.1.1.66` has poisoned the admin's ARP cache, so the admin's Telnet session to R1 (`10.1.1.1`) passes through her laptop and she reads the password. **SSH** (Secure Shell, TCP port 22) gives you the same CLI but encrypts the whole session after a key exchange. Use SSH version 2 and turn Telnet off.",
            hi: "**Telnet** (TCP port 23) har character **clear text** mein bhejta hai, username aur password bhi. Jo bhi packets capture kar sake, woh inhe padh sakta hai. Animation mein `10.1.1.66` wali attacker ne admin ka ARP cache poison kar diya hai, isliye admin ka R1 (`10.1.1.1`) wala Telnet session uske laptop se hokar jaata hai aur woh password padh leti hai. **SSH** (Secure Shell, TCP port 22) wahi CLI deta hai, lekin key exchange ke baad poora session encrypt karta hai. SSH version 2 use karo aur Telnet band karo.",
          },
        },
        {
          type: "cli",
          title: { en: "VTY lines that accept SSH only", hi: "Sirf SSH accept karne wali VTY lines" },
          lines: [
            { prompt: "R1(config)#", cmd: "username admin secret Str0ng-Pa55", comment: { en: "A local account to log in with", hi: "Login ke liye ek local account" } },
            { prompt: "R1(config)#", cmd: "line vty 0 4" },
            { prompt: "R1(config-line)#", cmd: "login local", comment: { en: "Check the local username database", hi: "Local username database check karo" } },
            { prompt: "R1(config-line)#", cmd: "transport input ssh", comment: { en: "Refuse Telnet, accept SSH", hi: "Telnet refuse, SSH accept" } },
          ],
          note: {
            en: "SSH also needs a hostname, a domain name and an RSA key pair before it works. Lesson 4.7 walks through every step.",
            hi: "SSH chalne se pehle hostname, domain name aur RSA key pair bhi chahiye. Lesson 4.7 mein har step detail mein hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Telnet = TCP 23, clear text. SSH = TCP 22, encrypted. Both arrive on the VTY lines, and `transport input` decides which is allowed.",
            hi: "Telnet = TCP 23, clear text. SSH = TCP 22, encrypted. Dono VTY lines par aate hain, aur `transport input` decide karta hai ki kaunsa allowed hai.",
          },
        },
      ],
    },
    {
      id: "switch-management-ip",
      heading: { en: "Giving a Layer 2 switch a management IP", hi: "Layer 2 switch ko management IP dena" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A router has IP addresses on its interfaces, so you can SSH to any of them. A Layer 2 switch has no routed interfaces. To manage it in-band, you give it an IP address on an **SVI** (switch virtual interface) in a management VLAN, like the SVIs from inter-VLAN routing (lesson 2.3). Use a dedicated VLAN such as VLAN 99 instead of VLAN 1.",
            hi: "Router ke interfaces par IP addresses hote hain, isliye tum unme se kisi par bhi SSH kar sakte ho. Layer 2 switch mein koi routed interface nahi hota. Use in-band manage karne ke liye management VLAN mein ek **SVI** (switch virtual interface) par IP address dete ho, bilkul inter-VLAN routing (lesson 2.3) wale SVIs ki tarah. VLAN 1 ki jagah VLAN 99 jaisa alag VLAN use karo.",
          },
        },
        {
          type: "p",
          text: {
            en: "The switch also needs to know where to send replies to admins in other subnets. It does not route, so it uses **`ip default-gateway`**, the same idea as a PC's default gateway.",
            hi: "Switch ko yeh bhi pata hona chahiye ki doosre subnets ke admins ko reply kahan bheje. Woh routing nahi karta, isliye **`ip default-gateway`** use karta hai, bilkul PC ke default gateway wala idea.",
          },
        },
        {
          type: "cli",
          title: { en: "SW1 management in VLAN 99", hi: "VLAN 99 mein SW1 ka management" },
          lines: [
            { prompt: "SW1(config)#", cmd: "vlan 99" },
            { prompt: "SW1(config-vlan)#", cmd: "name MGMT" },
            { prompt: "SW1(config-vlan)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "interface vlan 99" },
            { prompt: "SW1(config-if)#", cmd: "ip address 10.1.99.2 255.255.255.0" },
            { prompt: "SW1(config-if)#", cmd: "no shutdown" },
            { prompt: "SW1(config-if)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "ip default-gateway 10.1.99.1", comment: { en: "R1's address in VLAN 99", hi: "VLAN 99 mein R1 ka address" } },
          ],
          note: {
            en: "The SVI comes up only when VLAN 99 exists and at least one port carrying VLAN 99, an access port or a trunk, is up and forwarding.",
            hi: "SVI tabhi up hota hai jab VLAN 99 exist kare aur VLAN 99 carry karne wala kam se kam ek port, access ya trunk, up aur forwarding ho.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Forget the gateway, lose remote access", hi: "Gateway bhoole, toh remote access gaya" },
          text: {
            en: "Without `ip default-gateway`, you can reach SW1 from inside 10.1.99.0/24 but not from any other subnet: the requests arrive, but SW1 does not know where to send the replies. On a Layer 3 switch with `ip routing` enabled, `ip default-gateway` is ignored; it uses its routing table, for example a default route.",
            hi: "`ip default-gateway` ke bina tum SW1 tak 10.1.99.0/24 ke andar se pahunch jaoge, lekin kisi doosre subnet se nahi: requests aati hain, lekin SW1 ko pata nahi ki replies kahan bheje. `ip routing` enabled wale Layer 3 switch par `ip default-gateway` ignore hota hai; woh apni routing table use karta hai, jaise default route.",
          },
        },
      ],
    },
    {
      id: "web-gui",
      heading: { en: "Web GUI: HTTP and HTTPS", hi: "Web GUI: HTTP aur HTTPS" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Many devices also offer a web interface: wireless LAN controllers (lesson 2.9), firewalls and small-business switches. **HTTP** (TCP 80) is clear text, like Telnet. **HTTPS** (TCP 443) carries the same pages inside TLS encryption, as SSH does for the CLI.",
            hi: "Kai devices web interface bhi dete hain: wireless LAN controllers (lesson 2.9), firewalls aur small-business switches. **HTTP** (TCP 80) Telnet ki tarah clear text hai. **HTTPS** (TCP 443) wahi pages TLS encryption ke andar le jaata hai, jaise SSH CLI ke liye karta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "On Cisco IOS, `ip http server` turns on the HTTP server and `ip http secure-server` turns on HTTPS. Hardening guides remove plain HTTP with `no ip http server` and keep HTTPS only if someone actually uses the GUI.",
            hi: "Cisco IOS par `ip http server` HTTP server on karta hai aur `ip http secure-server` HTTPS on karta hai. Hardening guides `no ip http server` se plain HTTP hata dete hain, aur HTTPS tabhi rakhte hain jab koi sach mein GUI use karta ho.",
          },
        },
      ],
    },
    {
      id: "central-login",
      heading: { en: "Central login: TACACS+ and RADIUS", hi: "Central login: TACACS+ aur RADIUS" },
      blocks: [
        {
          type: "p",
          text: {
            en: "With 200 switches and routers, local accounts do not scale. When an engineer leaves, someone must delete that username on every device, and there is no single record of who logged in where. Instead, each device asks a central **AAA server**, such as Cisco ISE, to check every login. AAA gets its own lesson (5.3); this is what you need now.",
            hi: "200 switches aur routers ho toh local accounts se kaam nahi chalta. Koi engineer company chhode toh uska username har device se delete karna padta hai, aur kaun kahan login hua, iska koi ek record nahi hota. Iske bajaye har device ek central **AAA server**, jaise Cisco ISE, se har login check karwata hai. AAA ka poora lesson aage hai (5.3); abhi itna samajh lo.",
          },
        },
        {
          type: "table",
          caption: { en: "TACACS+ and RADIUS side by side", hi: "TACACS+ aur RADIUS aamne-saamne" },
          columns: [{ en: "Feature", hi: "Feature" }, "TACACS+", "RADIUS"],
          rows: [
            [{ en: "Origin", hi: "Origin" }, { en: "Cisco (published as RFC 8907)", hi: "Cisco (RFC 8907 ke roop mein published)" }, { en: "Open IETF standard", hi: "Open IETF standard" }],
            [{ en: "Transport", hi: "Transport" }, "TCP 49", { en: "UDP 1812 (auth), 1813 (accounting)", hi: "UDP 1812 (auth), 1813 (accounting)" }],
            [{ en: "Encryption", hi: "Encryption" }, { en: "Whole message body", hi: "Poori message body" }, { en: "Password only", hi: "Sirf password" }],
            [{ en: "AAA functions", hi: "AAA functions" }, { en: "Separate; can authorize each command", hi: "Alag-alag; har command authorize kar sakta hai" }, { en: "Authentication and authorization combined", hi: "Authentication aur authorization ek saath" }],
            [{ en: "Typical use", hi: "Typical use" }, { en: "Admin logins to network devices", hi: "Network devices par admin logins" }, { en: "User network access: Wi-Fi, 802.1X, VPN", hi: "Users ka network access: Wi-Fi, 802.1X, VPN" }],
          ],
        },
        {
          type: "cli",
          title: { en: "Preview: TACACS+ first, local accounts as a fallback", hi: "Preview: pehle TACACS+, fallback mein local accounts" },
          lines: [
            { prompt: "R1(config)#", cmd: "aaa new-model", comment: { en: "Turn on AAA", hi: "AAA on karo" } },
            { prompt: "R1(config)#", cmd: "tacacs server TAC1" },
            { prompt: "R1(config-server-tacacs)#", cmd: "address ipv4 10.2.2.100" },
            { prompt: "R1(config-server-tacacs)#", cmd: "key T4c-Key-99", comment: { en: "Shared key, same on the server", hi: "Shared key, server par bhi yahi" } },
            { prompt: "R1(config-server-tacacs)#", cmd: "exit" },
            { prompt: "R1(config)#", cmd: "aaa authentication login default group tacacs+ local" },
          ],
          note: {
            en: "The last line says: check logins with the TACACS+ servers; use the local username database only if no TACACS+ server answers.",
            hi: "Last line ka matlab: logins TACACS+ servers se check karo; local username database sirf tab use karo jab koi TACACS+ server jawab na de.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Fallback only when the server is silent", hi: "Fallback sirf tab jab server chup ho" },
          text: {
            en: "`local` is tried only if the TACACS+ server cannot be reached. If the server answers and rejects the password, the login fails; IOS does not then try the local account.",
            hi: "`local` sirf tab try hota hai jab TACACS+ server reach na ho. Agar server jawab deta hai aur password reject karta hai, toh login fail; IOS phir local account try nahi karta.",
          },
        },
      ],
    },
    {
      id: "cloud-managed",
      heading: { en: "Cloud-managed devices", hi: "Cloud-managed devices" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Cloud-managed devices, such as Cisco Meraki switches, access points and firewalls, are configured from a web dashboard that the vendor hosts. Each device opens an encrypted connection out to the cloud when it starts, downloads its configuration and sends back status and statistics. You manage every site from one browser over HTTPS, without a VPN to each site.",
            hi: "Cloud-managed devices, jaise Cisco Meraki switches, access points aur firewalls, ek web dashboard se configure hote hain jo vendor host karta hai. Har device start hote hi cloud ki taraf ek encrypted connection kholta hai, apni configuration download karta hai aur status aur statistics wapas bhejta hai. Tum ek hi browser se HTTPS par har site manage karte ho, har site tak VPN banaye bina.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Zero-touch deployment**: a device shipped to a branch is plugged in, reaches the internet and pulls its configuration from the dashboard. Nobody at the branch needs a console cable.",
              hi: "**Zero-touch deployment**: branch par bheja gaya device plug in hota hai, internet tak pahunchta hai aur dashboard se apni configuration le leta hai. Branch par kisi ko console cable ki zaroorat nahi.",
            },
            {
              en: "Only **management traffic** goes to the cloud. User traffic is still switched and routed locally.",
              hi: "Cloud ko sirf **management traffic** jaata hai. Users ka traffic ab bhi local hi switch aur route hota hai.",
            },
            {
              en: "The trade-offs: you depend on the vendor's cloud and a subscription licence, and you get less low-level CLI control. If a device loses internet access, it keeps forwarding with its last configuration, but you cannot change it until it reconnects.",
              hi: "Trade-offs: tum vendor ke cloud aur subscription licence par depend ho, aur low-level CLI control kam milta hai. Device ka internet chala jaaye toh woh last configuration se forwarding karta rehta hai, lekin reconnect hone tak tum use badal nahi sakte.",
            },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Out-of-band management", def: { en: "Management over a path separate from the production network, such as the console port or a dedicated management network.", hi: "Production network se alag raaste se management, jaise console port ya dedicated management network." } },
    { term: "In-band management", def: { en: "Management traffic that shares the network used by user traffic, such as SSH to a device's IP address.", hi: "Aisa management traffic jo users wale network ko hi share karta hai, jaise device ke IP par SSH." } },
    { term: "VTY lines", def: { en: "The virtual terminal lines where remote Telnet and SSH sessions arrive.", hi: "Virtual terminal lines jahan remote Telnet aur SSH sessions aate hain." } },
    { term: "Telnet", def: { en: "A remote CLI protocol on TCP port 23 that sends everything, passwords included, in clear text.", hi: "TCP port 23 par chalne wala remote CLI protocol jo sab kuch, password bhi, clear text mein bhejta hai." } },
    { term: "SSH", def: { en: "Secure Shell, a remote CLI protocol on TCP port 22 that encrypts the whole session.", hi: "Secure Shell, TCP port 22 par chalne wala remote CLI protocol jo poora session encrypt karta hai." } },
    { term: "Management SVI", def: { en: "A VLAN interface that gives a Layer 2 switch an IP address for management.", hi: "VLAN interface jo Layer 2 switch ko management ke liye IP address deta hai." } },
    { term: "TACACS+", def: { en: "A Cisco-developed AAA protocol on TCP 49 that encrypts the whole message and suits device admin logins.", hi: "Cisco ka banaya AAA protocol jo TCP 49 par chalta hai, poora message encrypt karta hai aur device admin logins ke liye sahi hai." } },
    { term: "RADIUS", def: { en: "An open AAA protocol on UDP 1812/1813 that encrypts only the password and is used mainly for user network access.", hi: "Open AAA protocol jo UDP 1812/1813 par chalta hai, sirf password encrypt karta hai aur zyadatar users ke network access ke liye use hota hai." } },
  ],
  commands: [
    { cmd: "line vty 0 4", mode: "Global config", does: { en: "Enter the VTY lines used by Telnet and SSH sessions", hi: "Telnet aur SSH sessions wali VTY lines mein jao" } },
    { cmd: "login local", mode: "Line config", does: { en: "Check logins against the local username database", hi: "Logins ko local username database se check karo" } },
    { cmd: "transport input ssh", mode: "Line config", does: { en: "Accept only SSH on these lines", hi: "In lines par sirf SSH accept karo" } },
    { cmd: "interface vlan 99", mode: "Global config", does: { en: "Create or enter the management SVI", hi: "Management SVI banao ya usme jao" } },
    { cmd: "ip default-gateway 10.1.99.1", mode: "Global config (Layer 2 switch)", does: { en: "Tell the switch where to send traffic for other subnets", hi: "Switch ko batao ki doosre subnets ka traffic kahan bheje" } },
    { cmd: "ip http secure-server", mode: "Global config", does: { en: "Turn on the HTTPS web server", hi: "HTTPS web server on karo" } },
    { cmd: "no ip http server", mode: "Global config", does: { en: "Turn off the plain HTTP web server", hi: "Plain HTTP web server band karo" } },
    { cmd: "aaa new-model", mode: "Global config", does: { en: "Enable AAA so logins can use TACACS+ or RADIUS", hi: "AAA enable karo taaki logins TACACS+ ya RADIUS use kar sakein" } },
    { cmd: "show users", mode: "Privileged EXEC", does: { en: "See who is logged in on the console and VTY lines", hi: "Dekho console aur VTY lines par kaun logged in hai" } },
  ],
  mistakes: [
    {
      en: "Assuming Telnet is safe inside the company network. Anyone who can capture the traffic on the path, for example after ARP spoofing, reads the password. Use SSH and `transport input ssh`.",
      hi: "Yeh maan lena ki company network ke andar Telnet safe hai. Raaste mein traffic capture karne wala koi bhi, jaise ARP spoofing ke baad, password padh leta hai. SSH aur `transport input ssh` use karo.",
    },
    {
      en: "Forgetting `ip default-gateway` on a Layer 2 switch. The switch then answers only admins in its own management subnet.",
      hi: "Layer 2 switch par `ip default-gateway` bhool jaana. Tab switch sirf apne management subnet ke admins ko hi jawab deta hai.",
    },
    {
      en: "Configuring the management SVI but never creating VLAN 99, or having no active port in it. The SVI's line protocol stays down and nothing can reach it.",
      hi: "Management SVI configure kar dena lekin VLAN 99 banana hi bhool jaana, ya usme koi active port na hona. SVI ka line protocol down rehta hai aur koi us tak nahi pahunch paata.",
    },
    {
      en: "Thinking `local` in `aaa authentication login default group tacacs+ local` is used when the server rejects a password. It is used only when no server answers.",
      hi: "Yeh sochna ki `aaa authentication login default group tacacs+ local` mein `local` tab use hota hai jab server password reject kare. Woh sirf tab use hota hai jab koi server jawab hi na de.",
    },
    {
      en: "Mixing up the ports. Telnet TCP 23, SSH TCP 22, HTTP TCP 80, HTTPS TCP 443, TACACS+ TCP 49, RADIUS UDP 1812 and 1813.",
      hi: "Ports mix kar dena. Telnet TCP 23, SSH TCP 22, HTTP TCP 80, HTTPS TCP 443, TACACS+ TCP 49, RADIUS UDP 1812 aur 1813.",
    },
    {
      en: "Believing the console needs an IP address. It is a direct serial connection, which is exactly why it works when the network or the IP configuration is broken.",
      hi: "Yeh maanna ki console ko IP address chahiye. Yeh direct serial connection hai, aur isi wajah se network ya IP configuration toota ho tab bhi kaam karta hai.",
    },
  ],
  recap: [
    { en: "Console is out-of-band: no IP needed, 9600 8N1, physical access or a console server.", hi: "Console out-of-band hai: IP nahi chahiye, 9600 8N1, physical access ya console server." },
    { en: "Telnet is TCP 23 in clear text; SSH is TCP 22 and encrypted. `transport input ssh` on the VTY lines allows SSH only.", hi: "Telnet TCP 23 par clear text hai; SSH TCP 22 par encrypted. VTY lines par `transport input ssh` sirf SSH allow karta hai." },
    { en: "HTTP is TCP 80 in clear text; HTTPS is TCP 443 with TLS.", hi: "HTTP TCP 80 par clear text hai; HTTPS TCP 443 par TLS ke saath." },
    { en: "A Layer 2 switch is managed through an SVI in a management VLAN plus `ip default-gateway`.", hi: "Layer 2 switch ko management VLAN ke SVI aur `ip default-gateway` se manage karte hain." },
    { en: "TACACS+: TCP 49, whole body encrypted, device admin. RADIUS: UDP 1812/1813, password only, user network access.", hi: "TACACS+: TCP 49, poori body encrypted, device admin. RADIUS: UDP 1812/1813, sirf password, users ka network access." },
    { en: "Cloud-managed devices connect out to the vendor cloud for their configuration; user traffic stays local.", hi: "Cloud-managed devices configuration ke liye khud vendor cloud se connect karte hain; users ka traffic local hi rehta hai." },
  ],
  quiz: [
    {
      q: {
        en: "A new router has no configuration at all. Which method can you use to configure it?",
        hi: "Ek naye router par koi configuration nahi hai. Use configure karne ke liye kaunsa method use kar sakte ho?",
      },
      options: [
        { en: "SSH to its default IP address", hi: "Uske default IP address par SSH" },
        { en: "Telnet to its default IP address", hi: "Uske default IP address par Telnet" },
        { en: "A console cable and a terminal program", hi: "Console cable aur ek terminal program" },
        { en: "HTTPS to its web GUI", hi: "Uske web GUI par HTTPS" },
      ],
      answer: 2,
      explain: {
        en: "With no configuration, the router has no IP address and no VTY login set up, so every in-band method fails. The console is a direct serial connection and needs neither.",
        hi: "Configuration nahi hai toh router ka na IP address hai na VTY login set hai, isliye har in-band method fail hoga. Console direct serial connection hai, use in dono mein se kuch nahi chahiye.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An attacker captures the packets of an admin's session to R1 and reads the login password in them. Which protocol was the admin most likely using?",
        hi: "Ek attacker admin ke R1 wale session ke packets capture karta hai aur unme login password padh leta hai. Admin sabse likely kaunsa protocol use kar raha tha?",
      },
      options: [
        { en: "Telnet on TCP 23", hi: "TCP 23 par Telnet" },
        { en: "SSH on TCP 22", hi: "TCP 22 par SSH" },
        { en: "HTTPS on TCP 443", hi: "TCP 443 par HTTPS" },
        { en: "SSH version 2 with RSA keys", hi: "RSA keys ke saath SSH version 2" },
      ],
      answer: 0,
      explain: {
        en: "Telnet sends every character, including the password, in clear text. SSH and HTTPS encrypt the session, so a capture shows only scrambled bytes.",
        hi: "Telnet har character, password bhi, clear text mein bhejta hai. SSH aur HTTPS session encrypt karte hain, isliye capture mein sirf scrambled bytes dikhte hain.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "SW1 is a Layer 2 switch with `interface vlan 99` set to 10.1.99.2/24. Admins in 10.1.99.0/24 can SSH to it, but admins in 10.5.5.0/24 cannot, although R1 routes between the two subnets. What is missing on SW1?",
        hi: "SW1 ek Layer 2 switch hai jiska `interface vlan 99` 10.1.99.2/24 par set hai. 10.1.99.0/24 ke admins us par SSH kar lete hain, lekin 10.5.5.0/24 ke admins nahi kar paate, jabki R1 dono subnets ke beech routing karta hai. SW1 par kya missing hai?",
      },
      options: [
        { en: "`ip routing`", hi: "`ip routing`" },
        { en: "`transport input ssh` on the VTY lines", hi: "VTY lines par `transport input ssh`" },
        { en: "A second SVI in VLAN 1", hi: "VLAN 1 mein doosra SVI" },
        { en: "`ip default-gateway 10.1.99.1`", hi: "`ip default-gateway 10.1.99.1`" },
      ],
      answer: 3,
      explain: {
        en: "The requests from 10.5.5.0/24 reach SW1, but SW1 has no gateway for its replies to another subnet. SSH already works locally, so the VTY lines are fine, and a Layer 2 switch should not route.",
        hi: "10.5.5.0/24 ki requests SW1 tak pahunchti hain, lekin doosre subnet ko reply bhejne ke liye SW1 ke paas koi gateway nahi hai. SSH local se chal raha hai, toh VTY lines theek hain, aur Layer 2 switch ko routing nahi karni chahiye.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Which configuration makes R1 accept SSH sessions and refuse Telnet sessions?",
        hi: "Kaunsi configuration R1 ko SSH sessions accept aur Telnet sessions refuse karwati hai?",
      },
      options: [
        { en: "`line console 0` then `transport input ssh`", hi: "`line console 0` phir `transport input ssh`" },
        { en: "`line vty 0 4` then `transport input ssh`", hi: "`line vty 0 4` phir `transport input ssh`" },
        { en: "`line vty 0 4` then `transport input all`", hi: "`line vty 0 4` phir `transport input all`" },
        { en: "`ip ssh version 2` on its own", hi: "Sirf `ip ssh version 2`" },
      ],
      answer: 1,
      explain: {
        en: "Telnet and SSH sessions arrive on the VTY lines, not the console line, and `transport input ssh` allows SSH only. `all` would allow Telnet too, and `ip ssh version 2` sets the SSH version without blocking Telnet.",
        hi: "Telnet aur SSH sessions VTY lines par aate hain, console line par nahi, aur `transport input ssh` sirf SSH allow karta hai. `all` Telnet bhi allow kar dega, aur `ip ssh version 2` sirf SSH version set karta hai, Telnet block nahi karta.",
      },
      kind: "cli",
    },
    {
      q: { en: "Which statement correctly compares TACACS+ and RADIUS?", hi: "Kaunsa statement TACACS+ aur RADIUS ko sahi compare karta hai?" },
      options: [
        { en: "TACACS+ uses UDP 1812 and encrypts only the password", hi: "TACACS+ UDP 1812 use karta hai aur sirf password encrypt karta hai" },
        { en: "RADIUS uses TCP 49 and was developed by Cisco", hi: "RADIUS TCP 49 use karta hai aur Cisco ne banaya tha" },
        { en: "TACACS+ uses TCP 49 and encrypts the whole message body", hi: "TACACS+ TCP 49 use karta hai aur poori message body encrypt karta hai" },
        { en: "RADIUS keeps authentication, authorization and accounting fully separate", hi: "RADIUS authentication, authorization aur accounting ko poori tarah alag rakhta hai" },
      ],
      answer: 2,
      explain: {
        en: "TACACS+ runs on TCP 49, encrypts the whole body and separates the three A's. RADIUS is the open standard on UDP 1812/1813, encrypts only the password and combines authentication with authorization.",
        hi: "TACACS+ TCP 49 par chalta hai, poori body encrypt karta hai aur teeno A alag rakhta hai. RADIUS UDP 1812/1813 par open standard hai, sirf password encrypt karta hai aur authentication ke saath authorization combine karta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A company runs Meraki switches at 40 branches, managed from the Meraki dashboard. Which statement is true?",
        hi: "Ek company 40 branches par Meraki switches chalati hai, jo Meraki dashboard se manage hote hain. Kaunsa statement sahi hai?",
      },
      options: [
        { en: "All user traffic is sent through the Meraki cloud to be switched", hi: "Saara user traffic switch hone ke liye Meraki cloud se hokar jaata hai" },
        { en: "Each switch connects out to the cloud for its configuration, and user traffic stays local", hi: "Har switch configuration ke liye khud cloud se connect karta hai, aur user traffic local rehta hai" },
        { en: "An engineer must console into each switch to apply changes", hi: "Changes lagane ke liye engineer ko har switch par console karna padta hai" },
        { en: "The cloud must open an inbound VPN to each switch before it can be managed", hi: "Manage karne se pehle cloud ko har switch tak inbound VPN kholna padta hai" },
      ],
      answer: 1,
      explain: {
        en: "Cloud-managed devices open an outbound encrypted connection to the vendor cloud, which pushes configuration and collects status. Only management traffic goes to the cloud; user traffic is switched and routed at the branch.",
        hi: "Cloud-managed devices vendor cloud ki taraf outbound encrypted connection kholte hain, jisse cloud configuration push karta hai aur status collect karta hai. Cloud ko sirf management traffic jaata hai; users ka traffic branch par hi switch aur route hota hai.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "AvgYqI2qSD4",
      title: "Free CCNA | SSH | Day 42",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Console port security, a management IP on a Layer 2 switch, then Telnet and SSH on the VTY lines.",
        hi: "Console port security, Layer 2 switch par management IP, phir VTY lines par Telnet aur SSH.",
      },
    },
    {
      id: "8DhsHJerJ9M",
      title: "2.8 Describe AP and WLC management connections Telnet, SSH, HTTP, HTTPS, console, TACACS+, Radius)",
      channel: "NetworkBruh",
      lang: "en",
      note: {
        en: "A short tour of each access method in this exam topic, including HTTP, HTTPS, TACACS+ and RADIUS.",
        hi: "Is exam topic ke har access method ka chhota tour, HTTP, HTTPS, TACACS+ aur RADIUS ke saath.",
      },
    },
    {
      id: "jmKx5ppuuxY",
      title: "183. CCNA 200-301 Full Course in Hindi 2024 | Telnet & SSH Configuration in Switches",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walkthrough of remote access to a switch with Telnet and SSH.", hi: "Switch par Telnet aur SSH se remote access ka Hindi walkthrough." },
    },
    {
      id: "hNKC_mmtUr0",
      title: "21. Understand & Configure Telnet and SSH",
      channel: "NetworkPath",
      lang: "hi",
      note: { en: "Telnet vs SSH in Hindi, VTY lines and `transport input`, with a full lab.", hi: "Telnet vs SSH Hindi mein, VTY lines aur `transport input`, poore lab ke saath." },
    },
  ],
  lab: {
    title: { en: "Reach a router and a switch four ways in Packet Tracer", hi: "Packet Tracer mein router aur switch tak chaar tareekon se pahuncho" },
    steps: [
      {
        en: "Build PC0 (10.1.99.50/24, gateway 10.1.99.1), a 2960 switch SW1 and a router R1, with PC0 and R1 Gi0/0 cabled to SW1. On SW1 create `vlan 99` and make both of those ports access ports in VLAN 99. Connect PC0's RS-232 port to R1's console port with a console cable.",
        hi: "PC0 (10.1.99.50/24, gateway 10.1.99.1), ek 2960 switch SW1 aur ek router R1 banao, aur PC0 aur R1 ke Gi0/0 ko SW1 se cable karo. SW1 par `vlan 99` banao aur in dono ports ko VLAN 99 ke access ports banao. PC0 ke RS-232 port ko console cable se R1 ke console port se jodo.",
      },
      {
        en: "On PC0 open Desktop > Terminal (9600 8N1). Give R1's Gi0/0 the address 10.1.99.1/24 with `no shutdown`, create `username admin secret ...`, and under `line vty 0 4` set `login local` and `transport input telnet ssh`.",
        hi: "PC0 par Desktop > Terminal (9600 8N1) kholo. R1 ke Gi0/0 ko `no shutdown` ke saath 10.1.99.1/24 do, `username admin secret ...` banao, aur `line vty 0 4` ke andar `login local` aur `transport input telnet ssh` set karo.",
      },
      {
        en: "From PC0's Command Prompt run `telnet 10.1.99.1` and log in. In Simulation mode, filter on Telnet and step through the login packets going to TCP port 23.",
        hi: "PC0 ke Command Prompt se `telnet 10.1.99.1` chalao aur login karo. Simulation mode mein Telnet par filter lagao aur TCP port 23 ki taraf jaate login packets step by step dekho.",
      },
      {
        en: "Enable SSH on R1 (lesson 4.7 explains each command): `hostname R1`, `ip domain-name lab.local`, `crypto key generate rsa` with 1024 bits or more, and `ip ssh version 2`. Change the VTY lines to `transport input ssh`, connect with `ssh -l admin 10.1.99.1`, and confirm Telnet is now refused.",
        hi: "R1 par SSH enable karo (lesson 4.7 har command samjhata hai): `hostname R1`, `ip domain-name lab.local`, 1024 ya zyada bits ke saath `crypto key generate rsa`, aur `ip ssh version 2`. VTY lines ko `transport input ssh` karo, `ssh -l admin 10.1.99.1` se connect karo, aur confirm karo ki Telnet ab refuse hota hai.",
      },
      {
        en: "On SW1 create `interface vlan 99` with 10.1.99.2/24 and `no shutdown`, but no default gateway yet. Give R1 Gi0/1 the address 10.5.5.1/24, connect PC1 (10.5.5.10/24, gateway 10.5.5.1) to it, and ping 10.1.99.2 from PC1: it fails. (If it succeeds, R1 is answering SW1's ARP requests by proxy ARP; enter `no ip proxy-arp` on R1 Gi0/0 and try again.) Add `ip default-gateway 10.1.99.1` on SW1 and ping again.",
        hi: "SW1 par `interface vlan 99` 10.1.99.2/24 aur `no shutdown` ke saath banao, lekin abhi default gateway mat do. R1 ke Gi0/1 ko 10.5.5.1/24 do, us par PC1 (10.5.5.10/24, gateway 10.5.5.1) jodo, aur PC1 se 10.1.99.2 ping karo: fail hoga. (Agar success ho jaaye, toh R1 proxy ARP se SW1 ki ARP requests ka jawab de raha hai; R1 Gi0/0 par `no ip proxy-arp` lagao aur dobara try karo.) SW1 par `ip default-gateway 10.1.99.1` lagao aur dobara ping karo.",
      },
      {
        en: "While an SSH session from PC0 is open, run `show users` on R1 and find the VTY line in use and the address it came from.",
        hi: "PC0 se SSH session khula ho tab R1 par `show users` chalao aur dhoondho ki kaunsi VTY line use ho rahi hai aur session kis address se aaya.",
      },
    ],
  },
};

export default lesson;
