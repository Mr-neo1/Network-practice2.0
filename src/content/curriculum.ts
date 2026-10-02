// The course outline: modules and lessons in recommended order.
// Lesson bodies live in src/content/lessons/<slug>.ts and scenes in src/anim/scenes/<scene>.ts.
// Exam references follow the Cisco CCNA 200-301 v1.1 exam topics.

import type { LessonMeta, ModuleMeta } from "./types.ts";

export const modules: ModuleMeta[] = [
  {
    id: "m0",
    num: 0,
    level: "zero",
    title: { en: "Start from zero", hi: "Zero se shuru karo" },
    blurb: {
      en: "No background needed. What a network is, the devices in it, binary, the OSI and TCP/IP models, cables, Ethernet and your first Cisco commands.",
      hi: "Koi background nahi chahiye. Network kya hota hai, usme kaunse devices hote hain, binary, OSI aur TCP/IP model, cables, Ethernet aur tumhare pehle Cisco commands.",
    },
    lessons: [
      {
        slug: "what-is-a-network",
        title: { en: "What a network actually is", hi: "Network asal mein kya hota hai" },
        summary: {
          en: "Hosts, links, LANs, WANs and the internet, using the network you already have at home.",
          hi: "Hosts, links, LAN, WAN aur internet, tumhare ghar ke network ke example se.",
        },
        minutes: 15,
        scene: "what-is-a-network",
      },
      {
        slug: "network-devices",
        title: { en: "Network devices: what each box does", hi: "Network devices: kaunsa box kya karta hai" },
        summary: {
          en: "Routers, switches, firewalls, access points, controllers, endpoints and servers, and where each one sits.",
          hi: "Router, switch, firewall, access point, controller, endpoints aur servers, aur har ek network mein kahan baithta hai.",
        },
        minutes: 20,
        scene: "network-devices",
        exam: "1.1",
      },
      {
        slug: "binary-and-hex",
        title: { en: "Binary and hex for networking", hi: "Networking ke liye binary aur hex" },
        summary: {
          en: "Count in base 2 and base 16 so IP addresses, masks and MAC addresses stop looking like magic.",
          hi: "Base 2 aur base 16 mein counting seekho, taaki IP address, mask aur MAC address magic na lagein.",
        },
        minutes: 25,
        scene: "binary-and-hex",
      },
      {
        slug: "osi-model",
        title: { en: "The OSI model", hi: "OSI model" },
        summary: {
          en: "Seven layers, what each one is responsible for, and how engineers use them to troubleshoot.",
          hi: "Saat layers, har layer ki zimmedari kya hai, aur engineers inhe troubleshooting mein kaise use karte hain.",
        },
        minutes: 20,
        scene: "osi-model",
      },
      {
        slug: "tcp-ip-encapsulation",
        title: { en: "TCP/IP model and encapsulation", hi: "TCP/IP model aur encapsulation" },
        summary: {
          en: "How data becomes a segment, a packet, a frame and finally bits, and how the receiver unwraps it.",
          hi: "Data kaise segment, packet, frame aur phir bits banta hai, aur receiver use kaise kholta hai.",
        },
        minutes: 20,
        scene: "tcp-ip-encapsulation",
      },
      {
        slug: "cables-and-interfaces",
        title: { en: "Cables, connectors and interfaces", hi: "Cables, connectors aur interfaces" },
        summary: {
          en: "UTP categories, straight-through vs crossover, single-mode vs multimode fiber, and Ethernet standards.",
          hi: "UTP categories, straight-through vs crossover, single-mode vs multimode fiber, aur Ethernet standards.",
        },
        minutes: 22,
        scene: "cables-and-interfaces",
        exam: "1.3",
      },
      {
        slug: "ethernet-and-mac",
        title: { en: "Ethernet frames and MAC addresses", hi: "Ethernet frames aur MAC addresses" },
        summary: {
          en: "The fields of an Ethernet frame, the structure of a MAC address, and unicast, broadcast and multicast.",
          hi: "Ethernet frame ke fields, MAC address ka structure, aur unicast, broadcast aur multicast.",
        },
        minutes: 18,
        scene: "ethernet-and-mac",
      },
      {
        slug: "cisco-cli-basics",
        title: { en: "Cisco IOS command line basics", hi: "Cisco IOS command line basics" },
        summary: {
          en: "User, privileged and configuration modes, show commands, running vs startup config, and saving your work.",
          hi: "User, privileged aur configuration modes, show commands, running vs startup config, aur apna kaam save karna.",
        },
        minutes: 25,
        scene: "cisco-cli-basics",
      },
    ],
  },
  {
    id: "m1",
    num: 1,
    level: "ccna",
    title: { en: "Network fundamentals", hi: "Network fundamentals" },
    blurb: {
      en: "Switching, ARP, IPv4 and subnetting, TCP and UDP, IPv6, wireless basics, architectures and virtualization.",
      hi: "Switching, ARP, IPv4 aur subnetting, TCP aur UDP, IPv6, wireless basics, architectures aur virtualization.",
    },
    domain: "CCNA 1.0 · 20% of the exam",
    lessons: [
      {
        slug: "ethernet-switching",
        title: { en: "How switches learn and forward", hi: "Switch kaise seekhta aur forward karta hai" },
        summary: {
          en: "MAC learning, flooding unknown frames, forwarding known ones, and aging out old entries.",
          hi: "MAC learning, unknown frames ko flood karna, known frames ko forward karna, aur purani entries ka age out hona.",
        },
        minutes: 22,
        scene: "ethernet-switching",
        exam: "1.13",
      },
      {
        slug: "arp",
        title: { en: "ARP: finding the MAC address", hi: "ARP: MAC address dhoondhna" },
        summary: {
          en: "How a host turns a known IPv4 address into the MAC address it needs for the next frame.",
          hi: "Host ek known IPv4 address ko us MAC address mein kaise badalta hai jo usse agle frame ke liye chahiye.",
        },
        minutes: 20,
        scene: "arp",
        exam: "1.13",
      },
      {
        slug: "ipv4-addressing",
        title: { en: "IPv4 addresses and masks", hi: "IPv4 addresses aur masks" },
        summary: {
          en: "Network and host portions, prefix length, classes, and the network and broadcast addresses.",
          hi: "Network aur host portion, prefix length, classes, aur network aur broadcast address.",
        },
        minutes: 25,
        scene: "ipv4-addressing",
        exam: "1.6",
      },
      {
        slug: "private-ipv4",
        title: { en: "Private and public IPv4", hi: "Private aur public IPv4" },
        summary: {
          en: "RFC 1918 ranges, why private addresses exist, and what special addresses you must recognise.",
          hi: "RFC 1918 ranges, private addresses kyun bane, aur kaunse special addresses pehchanna zaroori hai.",
        },
        minutes: 15,
        scene: "private-ipv4",
        exam: "1.7",
      },
      {
        slug: "subnetting",
        title: { en: "Subnetting, step by step", hi: "Subnetting, step by step" },
        summary: {
          en: "A repeatable method to find the network, broadcast, host range and host count for any address.",
          hi: "Ek repeatable method jisse kisi bhi address ka network, broadcast, host range aur host count nikal sako.",
        },
        minutes: 35,
        scene: "subnetting",
        exam: "1.6",
      },
      {
        slug: "vlsm",
        title: { en: "VLSM: sizing subnets to fit", hi: "VLSM: zaroorat ke hisaab se subnet size" },
        summary: {
          en: "Carve one block into different-sized subnets without overlaps, largest first.",
          hi: "Ek block ko alag-alag size ke subnets mein kaatna, bina overlap ke, sabse bade se shuru karke.",
        },
        minutes: 30,
        scene: "vlsm",
        exam: "1.6",
      },
      {
        slug: "tcp-udp",
        title: { en: "TCP vs UDP and port numbers", hi: "TCP vs UDP aur port numbers" },
        summary: {
          en: "Reliable vs fast delivery, the three-way handshake, windowing, and the well-known ports you must know.",
          hi: "Reliable vs fast delivery, three-way handshake, windowing, aur zaroori well-known ports.",
        },
        minutes: 25,
        scene: "tcp-udp",
        exam: "1.5",
      },
      {
        slug: "ipv6-basics",
        title: { en: "IPv6 addresses and shortening", hi: "IPv6 addresses aur shortening" },
        summary: {
          en: "Why IPv6 exists, how a 128-bit address is written, the two shortening rules, and prefixes.",
          hi: "IPv6 kyun aaya, 128-bit address kaise likhte hain, shortening ke do rules, aur prefixes.",
        },
        minutes: 22,
        scene: "ipv6-basics",
        exam: "1.8",
      },
      {
        slug: "ipv6-types",
        title: { en: "IPv6 address types, EUI-64 and SLAAC", hi: "IPv6 address types, EUI-64 aur SLAAC" },
        summary: {
          en: "Global unicast, unique local, link-local, multicast and anycast, plus how hosts configure themselves.",
          hi: "Global unicast, unique local, link-local, multicast aur anycast, aur hosts khud ko kaise configure karte hain.",
        },
        minutes: 28,
        scene: "ipv6-types",
        exam: "1.9",
      },
      {
        slug: "client-ip-settings",
        title: { en: "Checking IP settings on Windows, macOS and Linux", hi: "Windows, macOS aur Linux par IP settings check karna" },
        summary: {
          en: "Read the address, mask, gateway and DNS server on any client, and spot what is wrong.",
          hi: "Kisi bhi client par address, mask, gateway aur DNS server padhna, aur galti pakadna.",
        },
        minutes: 15,
        scene: "client-ip-settings",
        exam: "1.10",
      },
      {
        slug: "interface-issues",
        title: { en: "Interface and cable problems", hi: "Interface aur cable problems" },
        summary: {
          en: "Speed and duplex mismatches, collisions, CRC errors and runts, read from show interfaces.",
          hi: "Speed aur duplex mismatch, collisions, CRC errors aur runts, show interfaces se padhna.",
        },
        minutes: 20,
        scene: "interface-issues",
        exam: "1.4",
      },
      {
        slug: "lan-architectures",
        title: { en: "LAN architectures", hi: "LAN architectures" },
        summary: {
          en: "Two-tier and three-tier campus designs, spine-leaf data centers, and small office networks.",
          hi: "Two-tier aur three-tier campus design, spine-leaf data center, aur small office networks.",
        },
        minutes: 20,
        scene: "lan-architectures",
        exam: "1.2",
      },
      {
        slug: "wan-architectures",
        title: { en: "WAN architectures", hi: "WAN architectures" },
        summary: {
          en: "Leased lines, MPLS, Metro Ethernet, internet VPNs and how branches reach headquarters.",
          hi: "Leased lines, MPLS, Metro Ethernet, internet VPN, aur branches headquarters tak kaise pahunchti hain.",
        },
        minutes: 20,
        scene: "wan-architectures",
        exam: "1.2",
      },
      {
        slug: "wireless-fundamentals",
        title: { en: "Wireless fundamentals", hi: "Wireless fundamentals" },
        summary: {
          en: "RF basics, 2.4, 5 and 6 GHz bands, non-overlapping channels, SSIDs, BSS and ESS.",
          hi: "RF basics, 2.4, 5 aur 6 GHz bands, non-overlapping channels, SSID, BSS aur ESS.",
        },
        minutes: 25,
        scene: "wireless-fundamentals",
        exam: "1.11",
      },
      {
        slug: "virtualization-cloud",
        title: { en: "Virtualization, containers, VRFs and cloud", hi: "Virtualization, containers, VRF aur cloud" },
        summary: {
          en: "Hypervisors, VMs vs containers, VRFs that split one router into many, and cloud service models.",
          hi: "Hypervisors, VM vs containers, VRF jo ek router ko kai hisson mein baant deta hai, aur cloud service models.",
        },
        minutes: 25,
        scene: "virtualization-cloud",
        exam: "1.12",
      },
    ],
  },
  {
    id: "m2",
    num: 2,
    level: "ccna",
    title: { en: "Network access", hi: "Network access" },
    blurb: {
      en: "VLANs, trunks, inter-VLAN routing, CDP/LLDP, EtherChannel, spanning tree, wireless architectures and device management.",
      hi: "VLANs, trunks, inter-VLAN routing, CDP/LLDP, EtherChannel, spanning tree, wireless architectures aur device management.",
    },
    domain: "CCNA 2.0 · 20% of the exam",
    lessons: [
      {
        slug: "vlans",
        title: { en: "VLANs and access ports", hi: "VLANs aur access ports" },
        summary: {
          en: "Split one switch into separate broadcast domains, and add a voice VLAN for IP phones.",
          hi: "Ek switch ko alag broadcast domains mein baantna, aur IP phones ke liye voice VLAN lagana.",
        },
        minutes: 25,
        scene: "vlans",
        exam: "2.1",
      },
      {
        slug: "trunking",
        title: { en: "Trunks, 802.1Q and the native VLAN", hi: "Trunks, 802.1Q aur native VLAN" },
        summary: {
          en: "Carry many VLANs over one link with tags, and understand the native VLAN, DTP and VTP.",
          hi: "Tags ke saath ek hi link par kai VLANs le jaana, aur native VLAN, DTP aur VTP samajhna.",
        },
        minutes: 25,
        scene: "trunking",
        exam: "2.2",
      },
      {
        slug: "inter-vlan-routing",
        title: { en: "Inter-VLAN routing", hi: "Inter-VLAN routing" },
        summary: {
          en: "Router-on-a-stick with subinterfaces, and SVIs on a Layer 3 switch.",
          hi: "Subinterfaces ke saath router-on-a-stick, aur Layer 3 switch par SVIs.",
        },
        minutes: 25,
        scene: "inter-vlan-routing",
        exam: "2.1",
      },
      {
        slug: "cdp-lldp",
        title: { en: "CDP and LLDP", hi: "CDP aur LLDP" },
        summary: {
          en: "Discover directly connected neighbours, their platform, interfaces and addresses.",
          hi: "Directly connected neighbours, unka platform, interfaces aur addresses discover karna.",
        },
        minutes: 15,
        scene: "cdp-lldp",
        exam: "2.3",
      },
      {
        slug: "etherchannel",
        title: { en: "EtherChannel", hi: "EtherChannel" },
        summary: {
          en: "Bundle parallel links into one logical link with LACP, PAgP or static mode, and load-balance across it.",
          hi: "Parallel links ko LACP, PAgP ya static mode se ek logical link banana, aur us par load-balance karna.",
        },
        minutes: 22,
        scene: "etherchannel",
        exam: "2.4",
      },
      {
        slug: "stp",
        title: { en: "Spanning Tree: stopping loops", hi: "Spanning Tree: loops rokna" },
        summary: {
          en: "Why Layer 2 loops melt a network, and how STP elects a root bridge and blocks redundant ports.",
          hi: "Layer 2 loop network ko kaise gira deta hai, aur STP root bridge chunkar redundant ports kaise block karta hai.",
        },
        minutes: 30,
        scene: "stp",
        exam: "2.5",
      },
      {
        slug: "rapid-pvst",
        title: { en: "Rapid PVST+ and the STP toolkit", hi: "Rapid PVST+ aur STP toolkit" },
        summary: {
          en: "Port roles and states, fast convergence, PortFast, BPDU Guard, Root Guard and Loop Guard.",
          hi: "Port roles aur states, fast convergence, PortFast, BPDU Guard, Root Guard aur Loop Guard.",
        },
        minutes: 28,
        scene: "rapid-pvst",
        exam: "2.5",
      },
      {
        slug: "wireless-architectures",
        title: { en: "Wireless architectures and AP modes", hi: "Wireless architectures aur AP modes" },
        summary: {
          en: "Autonomous, lightweight (CAPWAP) and cloud-managed APs, AP modes, and how WLAN parts connect.",
          hi: "Autonomous, lightweight (CAPWAP) aur cloud-managed APs, AP modes, aur WLAN ke parts kaise connect hote hain.",
        },
        minutes: 25,
        scene: "wireless-architectures",
        exam: "2.6",
      },
      {
        slug: "wlc-config",
        title: { en: "Configuring a WLAN on a WLC", hi: "WLC par WLAN configure karna" },
        summary: {
          en: "Create a WLAN, map it to a VLAN, set WPA2-PSK security and a QoS profile in the controller GUI.",
          hi: "Controller GUI mein WLAN banana, use VLAN se map karna, WPA2-PSK security aur QoS profile set karna.",
        },
        minutes: 20,
        scene: "wlc-config",
        exam: "2.9",
      },
      {
        slug: "device-management",
        title: { en: "Device management access", hi: "Device management access" },
        summary: {
          en: "Console, Telnet, SSH, HTTP/HTTPS, and central login with RADIUS or TACACS+.",
          hi: "Console, Telnet, SSH, HTTP/HTTPS, aur RADIUS ya TACACS+ se central login.",
        },
        minutes: 18,
        scene: "device-management",
        exam: "2.8",
      },
    ],
  },
  {
    id: "m3",
    num: 3,
    level: "ccna",
    title: { en: "IP connectivity", hi: "IP connectivity" },
    blurb: {
      en: "The routing table, how routers choose a path, static routes, OSPF and first hop redundancy. The biggest exam domain.",
      hi: "Routing table, router path kaise chunta hai, static routes, OSPF aur first hop redundancy. Exam ka sabse bada domain.",
    },
    domain: "CCNA 3.0 · 25% of the exam",
    lessons: [
      {
        slug: "routing-basics",
        title: { en: "How routers route", hi: "Router routing kaise karta hai" },
        summary: {
          en: "Connected and local routes, and every field of a routing table entry.",
          hi: "Connected aur local routes, aur routing table entry ka har field.",
        },
        minutes: 25,
        scene: "routing-basics",
        exam: "3.1",
      },
      {
        slug: "forwarding-decisions",
        title: { en: "Longest match, AD and metric", hi: "Longest match, AD aur metric" },
        summary: {
          en: "The exact order a router uses to pick one route when several could match.",
          hi: "Jab kai routes match karein, tab router ek route chunne ke liye kaunsa exact order follow karta hai.",
        },
        minutes: 22,
        scene: "forwarding-decisions",
        exam: "3.2",
      },
      {
        slug: "life-of-a-packet",
        title: { en: "The life of a packet", hi: "Ek packet ki poori journey" },
        summary: {
          en: "Follow one ping across two routers: ARP, MAC rewrites, TTL, and what never changes.",
          hi: "Ek ping ko do routers ke paar follow karo: ARP, MAC rewrite, TTL, aur kya kabhi nahi badalta.",
        },
        minutes: 25,
        scene: "life-of-a-packet",
        exam: "3.2",
      },
      {
        slug: "static-routing",
        title: { en: "Static and default routes", hi: "Static aur default routes" },
        summary: {
          en: "Network, host, default and floating static routes for IPv4 and IPv6.",
          hi: "IPv4 aur IPv6 ke liye network, host, default aur floating static routes.",
        },
        minutes: 28,
        scene: "static-routing",
        exam: "3.3",
      },
      {
        slug: "dynamic-routing",
        title: { en: "Dynamic routing protocols", hi: "Dynamic routing protocols" },
        summary: {
          en: "IGP vs EGP, distance vector vs link state, metrics, and where RIP and EIGRP fit.",
          hi: "IGP vs EGP, distance vector vs link state, metrics, aur RIP aur EIGRP kahan fit hote hain.",
        },
        minutes: 22,
        scene: "dynamic-routing",
        exam: "3.2",
      },
      {
        slug: "ospf-basics",
        title: { en: "OSPF: neighbours, LSAs and SPF", hi: "OSPF: neighbours, LSAs aur SPF" },
        summary: {
          en: "Hello packets, neighbour states, the link-state database, and cost-based shortest paths.",
          hi: "Hello packets, neighbour states, link-state database, aur cost ke basis par shortest path.",
        },
        minutes: 30,
        scene: "ospf-basics",
        exam: "3.4",
      },
      {
        slug: "ospf-config",
        title: { en: "OSPF: router ID, DR/BDR and configuration", hi: "OSPF: router ID, DR/BDR aur configuration" },
        summary: {
          en: "Configure single-area OSPFv2, control the router ID, and understand DR/BDR election and network types.",
          hi: "Single-area OSPFv2 configure karna, router ID control karna, aur DR/BDR election aur network types samajhna.",
        },
        minutes: 32,
        scene: "ospf-config",
        exam: "3.4",
      },
      {
        slug: "fhrp",
        title: { en: "First hop redundancy: HSRP, VRRP, GLBP", hi: "First hop redundancy: HSRP, VRRP, GLBP" },
        summary: {
          en: "A virtual gateway that survives a router failure, and how active/standby routers take over.",
          hi: "Ek virtual gateway jo router fail hone par bhi chalta rahe, aur active/standby router kaise takeover karte hain.",
        },
        minutes: 22,
        scene: "fhrp",
        exam: "3.5",
      },
    ],
  },
  {
    id: "m4",
    num: 4,
    level: "ccna",
    title: { en: "IP services", hi: "IP services" },
    blurb: {
      en: "DHCP, DNS, NAT, NTP, SNMP, syslog, SSH, FTP/TFTP and QoS: the services every network runs.",
      hi: "DHCP, DNS, NAT, NTP, SNMP, syslog, SSH, FTP/TFTP aur QoS: woh services jo har network mein chalti hain.",
    },
    domain: "CCNA 4.0 · 10% of the exam",
    lessons: [
      {
        slug: "dhcp",
        title: { en: "DHCP and DHCP relay", hi: "DHCP aur DHCP relay" },
        summary: {
          en: "Discover, Offer, Request, Ack, and how a relay agent helps clients reach a server in another subnet.",
          hi: "Discover, Offer, Request, Ack, aur relay agent kaise client ko doosre subnet ke server tak pahunchata hai.",
        },
        minutes: 25,
        scene: "dhcp",
        exam: "4.3, 4.6",
      },
      {
        slug: "dns",
        title: { en: "DNS: names to addresses", hi: "DNS: naam se address tak" },
        summary: {
          en: "Resolvers, root, TLD and authoritative servers, record types, and DNS on Cisco devices.",
          hi: "Resolver, root, TLD aur authoritative servers, record types, aur Cisco devices par DNS.",
        },
        minutes: 22,
        scene: "dns",
        exam: "4.3",
      },
      {
        slug: "nat",
        title: { en: "NAT: static, dynamic and PAT", hi: "NAT: static, dynamic aur PAT" },
        summary: {
          en: "Inside local, inside global and friends, and how PAT lets a whole office share one public IP.",
          hi: "Inside local, inside global waghera, aur PAT kaise poore office ko ek public IP share karne deta hai.",
        },
        minutes: 30,
        scene: "nat",
        exam: "4.1",
      },
      {
        slug: "ntp",
        title: { en: "NTP: keeping time", hi: "NTP: sahi time rakhna" },
        summary: {
          en: "Why logs need correct time, stratum levels, and NTP client and server configuration.",
          hi: "Logs ko sahi time kyun chahiye, stratum levels, aur NTP client aur server configuration.",
        },
        minutes: 15,
        scene: "ntp",
        exam: "4.2",
      },
      {
        slug: "snmp",
        title: { en: "SNMP", hi: "SNMP" },
        summary: {
          en: "Managers, agents, the MIB, Get/Set/Trap/Inform messages and SNMP versions.",
          hi: "Managers, agents, MIB, Get/Set/Trap/Inform messages aur SNMP versions.",
        },
        minutes: 18,
        scene: "snmp",
        exam: "4.4",
      },
      {
        slug: "syslog",
        title: { en: "Syslog", hi: "Syslog" },
        summary: {
          en: "Message format, the eight severity levels, facilities, and sending logs to a server.",
          hi: "Message format, aath severity levels, facilities, aur logs ko server par bhejna.",
        },
        minutes: 18,
        scene: "syslog",
        exam: "4.5",
      },
      {
        slug: "ssh",
        title: { en: "Remote access with SSH", hi: "SSH se remote access" },
        summary: {
          en: "Why Telnet is unsafe, and the exact steps to enable SSHv2 on a Cisco device.",
          hi: "Telnet unsafe kyun hai, aur Cisco device par SSHv2 enable karne ke exact steps.",
        },
        minutes: 18,
        scene: "ssh",
        exam: "4.8",
      },
      {
        slug: "ftp-tftp",
        title: { en: "FTP and TFTP", hi: "FTP aur TFTP" },
        summary: {
          en: "Moving IOS images and config backups, and how the two protocols differ.",
          hi: "IOS images aur config backups move karna, aur dono protocols mein fark.",
        },
        minutes: 15,
        scene: "ftp-tftp",
        exam: "4.9",
      },
      {
        slug: "qos",
        title: { en: "QoS: treating traffic differently", hi: "QoS: har traffic ke saath alag bartav" },
        summary: {
          en: "Classification, marking with DSCP, queuing, congestion avoidance, policing and shaping.",
          hi: "Classification, DSCP se marking, queuing, congestion avoidance, policing aur shaping.",
        },
        minutes: 28,
        scene: "qos",
        exam: "4.7",
      },
    ],
  },
  {
    id: "m5",
    num: 5,
    level: "ccna",
    title: { en: "Security fundamentals", hi: "Security fundamentals" },
    blurb: {
      en: "Threats and defences, device passwords, AAA, ACLs, Layer 2 security, VPNs and wireless security.",
      hi: "Threats aur defences, device passwords, AAA, ACLs, Layer 2 security, VPN aur wireless security.",
    },
    domain: "CCNA 5.0 · 15% of the exam",
    lessons: [
      {
        slug: "security-concepts",
        title: { en: "Threats, vulnerabilities and exploits", hi: "Threats, vulnerabilities aur exploits" },
        summary: {
          en: "Common attacks (DoS, spoofing, MITM, phishing), and security program basics like training and physical access.",
          hi: "Common attacks (DoS, spoofing, MITM, phishing), aur training aur physical access jaise security program basics.",
        },
        minutes: 25,
        scene: "security-concepts",
        exam: "5.1, 5.2",
      },
      {
        slug: "device-passwords",
        title: { en: "Securing device access", hi: "Device access secure karna" },
        summary: {
          en: "enable secret, line passwords, local users, password policy, MFA, certificates and biometrics.",
          hi: "enable secret, line passwords, local users, password policy, MFA, certificates aur biometrics.",
        },
        minutes: 22,
        scene: "device-passwords",
        exam: "5.3, 5.4",
      },
      {
        slug: "aaa",
        title: { en: "AAA with RADIUS and TACACS+", hi: "RADIUS aur TACACS+ ke saath AAA" },
        summary: {
          en: "Authentication, authorization and accounting, and how RADIUS and TACACS+ compare.",
          hi: "Authentication, authorization aur accounting, aur RADIUS aur TACACS+ ka comparison.",
        },
        minutes: 18,
        scene: "aaa",
        exam: "5.8",
      },
      {
        slug: "acl-standard",
        title: { en: "Standard ACLs", hi: "Standard ACLs" },
        summary: {
          en: "Wildcard masks, top-down matching, the implicit deny, and where to apply a standard ACL.",
          hi: "Wildcard masks, top-down matching, implicit deny, aur standard ACL kahan lagana hai.",
        },
        minutes: 28,
        scene: "acl-standard",
        exam: "5.6",
      },
      {
        slug: "acl-extended",
        title: { en: "Extended ACLs", hi: "Extended ACLs" },
        summary: {
          en: "Match on protocol, source, destination and port, and place the ACL close to the source.",
          hi: "Protocol, source, destination aur port par match karna, aur ACL ko source ke paas lagana.",
        },
        minutes: 28,
        scene: "acl-extended",
        exam: "5.6",
      },
      {
        slug: "port-security",
        title: { en: "Port security", hi: "Port security" },
        summary: {
          en: "Limit which MAC addresses can use a switch port, and what happens on a violation.",
          hi: "Switch port ko kaunse MAC addresses use kar sakte hain ye limit karna, aur violation par kya hota hai.",
        },
        minutes: 20,
        scene: "port-security",
        exam: "5.7",
      },
      {
        slug: "dhcp-snooping",
        title: { en: "DHCP snooping", hi: "DHCP snooping" },
        summary: {
          en: "Trusted and untrusted ports, stopping rogue DHCP servers, and the binding table.",
          hi: "Trusted aur untrusted ports, rogue DHCP servers ko rokna, aur binding table.",
        },
        minutes: 20,
        scene: "dhcp-snooping",
        exam: "5.7",
      },
      {
        slug: "dai",
        title: { en: "Dynamic ARP Inspection", hi: "Dynamic ARP Inspection" },
        summary: {
          en: "How ARP poisoning works and how DAI checks ARP against the DHCP snooping table.",
          hi: "ARP poisoning kaise hota hai aur DAI ARP ko DHCP snooping table se kaise check karta hai.",
        },
        minutes: 20,
        scene: "dai",
        exam: "5.7",
      },
      {
        slug: "vpn",
        title: { en: "IPsec VPNs", hi: "IPsec VPNs" },
        summary: {
          en: "Site-to-site and remote-access VPNs, what IPsec protects, and GRE over IPsec.",
          hi: "Site-to-site aur remote-access VPN, IPsec kya protect karta hai, aur GRE over IPsec.",
        },
        minutes: 25,
        scene: "vpn",
        exam: "5.5",
      },
      {
        slug: "wireless-security",
        title: { en: "Wireless security: WPA2 and WPA3", hi: "Wireless security: WPA2 aur WPA3" },
        summary: {
          en: "Open, WEP, WPA, WPA2 and WPA3, Personal vs Enterprise, and the 4-way handshake.",
          hi: "Open, WEP, WPA, WPA2 aur WPA3, Personal vs Enterprise, aur 4-way handshake.",
        },
        minutes: 25,
        scene: "wireless-security",
        exam: "5.9, 5.10",
      },
    ],
  },
  {
    id: "m6",
    num: 6,
    level: "ccna",
    title: { en: "Automation and programmability", hi: "Automation aur programmability" },
    blurb: {
      en: "Why networks are automated, SDN and controllers, AI in operations, REST APIs, JSON, Ansible and Terraform.",
      hi: "Networks automate kyun hote hain, SDN aur controllers, operations mein AI, REST APIs, JSON, Ansible aur Terraform.",
    },
    domain: "CCNA 6.0 · 10% of the exam",
    lessons: [
      {
        slug: "automation-intro",
        title: { en: "Why automate the network", hi: "Network automate kyun karein" },
        summary: {
          en: "The cost of manual changes, and the data, control and management planes.",
          hi: "Manual changes ki keemat, aur data, control aur management planes.",
        },
        minutes: 18,
        scene: "automation-intro",
        exam: "6.1",
      },
      {
        slug: "sdn",
        title: { en: "Controller-based networking and SDN", hi: "Controller-based networking aur SDN" },
        summary: {
          en: "Northbound and southbound APIs, overlay, underlay and fabric, and Cisco DNA Center / Catalyst Center.",
          hi: "Northbound aur southbound APIs, overlay, underlay aur fabric, aur Cisco DNA Center / Catalyst Center.",
        },
        minutes: 25,
        scene: "sdn",
        exam: "6.2, 6.3",
      },
      {
        slug: "ai-ml-netops",
        title: { en: "AI and machine learning in network operations", hi: "Network operations mein AI aur machine learning" },
        summary: {
          en: "Predictive vs generative AI, what ML does with telemetry, and where humans stay in the loop.",
          hi: "Predictive vs generative AI, ML telemetry ke saath kya karta hai, aur insaan kahan zaroori rehta hai.",
        },
        minutes: 18,
        scene: "ai-ml-netops",
        exam: "6.4",
      },
      {
        slug: "rest-apis",
        title: { en: "REST APIs", hi: "REST APIs" },
        summary: {
          en: "CRUD, HTTP verbs, status codes, authentication types and data encoding.",
          hi: "CRUD, HTTP verbs, status codes, authentication types aur data encoding.",
        },
        minutes: 25,
        scene: "rest-apis",
        exam: "6.5",
      },
      {
        slug: "json-data",
        title: { en: "JSON, XML and YAML", hi: "JSON, XML aur YAML" },
        summary: {
          en: "Read JSON objects, arrays and data types, and compare them with XML and YAML.",
          hi: "JSON objects, arrays aur data types padhna, aur unhe XML aur YAML se compare karna.",
        },
        minutes: 20,
        scene: "json-data",
        exam: "6.7",
      },
      {
        slug: "ansible-terraform",
        title: { en: "Configuration management: Ansible and Terraform", hi: "Configuration management: Ansible aur Terraform" },
        summary: {
          en: "Agentless push with Ansible playbooks, declarative state with Terraform, and when to use which.",
          hi: "Ansible playbooks se agentless push, Terraform se declarative state, aur kab kaunsa use karein.",
        },
        minutes: 22,
        scene: "ansible-terraform",
        exam: "6.6",
      },
    ],
  },
  {
    id: "m7",
    num: 7,
    level: "expert",
    title: { en: "Beyond the CCNA", hi: "CCNA ke aage" },
    blurb: {
      en: "The skills that separate someone who passed from someone who can run a network: troubleshooting, deeper routing, design and real automation.",
      hi: "Woh skills jo sirf exam pass karne wale aur network sach mein chalane wale mein fark banati hain: troubleshooting, deeper routing, design aur real automation.",
    },
    lessons: [
      {
        slug: "troubleshooting-method",
        title: { en: "A troubleshooting method that works", hi: "Troubleshooting ka ek method jo kaam karta hai" },
        summary: {
          en: "Top-down, bottom-up, divide and conquer and follow-the-path, applied to a real ticket.",
          hi: "Top-down, bottom-up, divide and conquer aur follow-the-path, ek real ticket par apply karke.",
        },
        minutes: 25,
        scene: "troubleshooting-method",
      },
      {
        slug: "ospf-multi-area",
        title: { en: "Multi-area OSPF and LSA types", hi: "Multi-area OSPF aur LSA types" },
        summary: {
          en: "Why large OSPF networks use areas, ABRs and ASBRs, LSA types 1-5 and summarisation.",
          hi: "Bade OSPF networks areas kyun use karte hain, ABR aur ASBR, LSA types 1-5 aur summarisation.",
        },
        minutes: 30,
        scene: "ospf-multi-area",
      },
      {
        slug: "eigrp",
        title: { en: "EIGRP in depth", hi: "EIGRP in depth" },
        summary: {
          en: "The composite metric, successors, feasible successors and the feasibility condition.",
          hi: "Composite metric, successors, feasible successors aur feasibility condition.",
        },
        minutes: 28,
        scene: "eigrp",
      },
      {
        slug: "bgp-basics",
        title: { en: "BGP fundamentals", hi: "BGP fundamentals" },
        summary: {
          en: "Autonomous systems, eBGP vs iBGP, path attributes, and how the internet routes between companies.",
          hi: "Autonomous systems, eBGP vs iBGP, path attributes, aur internet companies ke beech routing kaise karta hai.",
        },
        minutes: 30,
        scene: "bgp-basics",
      },
      {
        slug: "network-design",
        title: { en: "Designing a campus network", hi: "Campus network design karna" },
        summary: {
          en: "Turn requirements into a design: hierarchy, redundancy, failure domains, IP plan and VLAN plan.",
          hi: "Requirements ko design mein badalna: hierarchy, redundancy, failure domains, IP plan aur VLAN plan.",
        },
        minutes: 30,
        scene: "network-design",
      },
      {
        slug: "sd-wan-sd-access",
        title: { en: "SD-WAN and SD-Access", hi: "SD-WAN aur SD-Access" },
        summary: {
          en: "How controllers run the WAN and campus fabric, and what changes for the engineer.",
          hi: "Controllers WAN aur campus fabric kaise chalate hain, aur engineer ke liye kya badalta hai.",
        },
        minutes: 25,
        scene: "sd-wan-sd-access",
      },
      {
        slug: "python-netmiko",
        title: { en: "Python for network engineers", hi: "Network engineers ke liye Python" },
        summary: {
          en: "Connect to devices with Netmiko, run show commands, parse output and push safe changes.",
          hi: "Netmiko se devices se connect karna, show commands chalana, output parse karna aur safe changes push karna.",
        },
        minutes: 30,
        scene: "python-netmiko",
      },
      {
        slug: "mega-lab",
        title: { en: "Capstone: build a branch network", hi: "Capstone: ek branch network banao" },
        summary: {
          en: "VLANs, trunks, STP, OSPF, DHCP, NAT, ACLs and SSH together in one build, with a verification plan.",
          hi: "VLANs, trunks, STP, OSPF, DHCP, NAT, ACLs aur SSH ek saath ek build mein, verification plan ke saath.",
        },
        minutes: 60,
        scene: "mega-lab",
      },
      {
        slug: "exam-strategy",
        title: { en: "CCNA exam strategy and final review", hi: "CCNA exam strategy aur final review" },
        summary: {
          en: "How the exam is structured, a final four-week plan, and how to handle simulation questions.",
          hi: "Exam ka structure, aakhri chaar hafton ka plan, aur simulation questions kaise handle karein.",
        },
        minutes: 20,
        scene: "exam-strategy",
      },
    ],
  },
];

export const allLessons: (LessonMeta & { moduleId: string; moduleNum: number; index: number })[] = modules.flatMap((m) =>
  m.lessons.map((lesson, i) => ({ ...lesson, moduleId: m.id, moduleNum: m.num, index: i })),
);

export function lessonMeta(slug: string) {
  return allLessons.find((l) => l.slug === slug);
}

export function moduleOf(slug: string) {
  return modules.find((m) => m.lessons.some((l) => l.slug === slug));
}

/** Lesson number as shown to learners, e.g. "3.4". */
export function lessonNumber(slug: string) {
  const meta = lessonMeta(slug);
  return meta ? `${meta.moduleNum}.${meta.index + 1}` : "";
}

export function neighbours(slug: string) {
  const i = allLessons.findIndex((l) => l.slug === slug);
  return { prev: i > 0 ? allLessons[i - 1] : undefined, next: i >= 0 && i < allLessons.length - 1 ? allLessons[i + 1] : undefined };
}
