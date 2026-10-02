import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "campus-l3",
  title: { en: "Campus core: Layer 3 switch, OSPF and DHCP relay", hi: "Campus core: Layer 3 switch, OSPF aur DHCP relay" },
  level: "advanced",
  kind: "challenge",
  minutes: 60,
  lessons: ["lan-architectures", "inter-vlan-routing", "ospf-config", "dhcp"],
  scenario: {
    en: "The campus is moving off router-on-a-stick. A Catalyst 3650 (DSW1) becomes the distribution switch and default gateway for Engineering (VLAN 10, 10.1.10.0/24) and Sales (VLAN 20, 10.1.20.0/24). The access switch ASW1 hangs off it with one trunk. DSW1 connects to the edge router over a routed point-to-point link, 10.1.0.0/30 (DSW1 is .1, EDGE is .2). The edge router is already addressed; it must become the single DHCP server for the campus and exchange routes with DSW1 over OSPF. The intranet server sits behind EDGE at 10.1.100.10.",
    hi: "Campus router-on-a-stick chhod raha hai. Ek Catalyst 3650 (DSW1) distribution switch banega aur Engineering (VLAN 10, 10.1.10.0/24) aur Sales (VLAN 20, 10.1.20.0/24) ka default gateway bhi. Access switch ASW1 isse ek trunk se juda hai. DSW1 edge router se ek routed point-to-point link par juda hai, 10.1.0.0/30 (DSW1 .1 hai, EDGE .2). Edge router par addresses already lage hain; ise poore campus ka akela DHCP server banna hai aur DSW1 ke saath OSPF se routes exchange karne hain. Intranet server EDGE ke peeche 10.1.100.10 par hai.",
  },
  devices: [
    { id: "edge", kind: "router", hostname: "EDGE", x: 360, y: 70, note: "10.1.0.2", config: [
      "interface g0/0", "description Routed link to DSW1", "ip address 10.1.0.2 255.255.255.252", "no shutdown",
      "interface g0/1", "description Server LAN", "ip address 10.1.100.1 255.255.255.0", "no shutdown",
    ] },
    { id: "srv", kind: "server", hostname: "Intranet", x: 130, y: 70, host: { ip: "10.1.100.10", prefix: 24, gateway: "10.1.100.1", services: ["http"] }, note: "10.1.100.10" },
    { id: "dsw1", kind: "l3switch", hostname: "DSW1", x: 590, y: 70, note: "3650, 10.1.0.1" },
    { id: "asw1", kind: "switch", hostname: "ASW1", x: 590, y: 215 },
    { id: "eng", kind: "pc", hostname: "Eng-1", x: 460, y: 350, host: { dhcp: true }, note: "VLAN 10, DHCP" },
    { id: "sales", kind: "pc", hostname: "Sales-1", x: 720, y: 350, host: { dhcp: true }, note: "VLAN 20, DHCP" },
  ],
  links: [
    ["edge", "GigabitEthernet0/1", "srv", "FastEthernet0"],
    ["edge", "GigabitEthernet0/0", "dsw1", "GigabitEthernet1/1/1"],
    ["dsw1", "GigabitEthernet1/0/1", "asw1", "GigabitEthernet0/1"],
    ["eng", "FastEthernet0", "asw1", "FastEthernet0/1"],
    ["sales", "FastEthernet0", "asw1", "FastEthernet0/2"],
  ],
  height: 420,
  tasks: [
    {
      text: {
        en: "Create VLAN 10 ENG and VLAN 20 SALES on DSW1 and ASW1. On ASW1, Fa0/1 belongs to Engineering and Fa0/2 to Sales.",
        hi: "DSW1 aur ASW1 dono par VLAN 10 ENG aur VLAN 20 SALES banao. ASW1 par Fa0/1 Engineering ka hai aur Fa0/2 Sales ka.",
      },
      hint: {
        en: "A Layer 3 switch still needs the VLANs in its database before an SVI or a trunk can use them. Verify with `show vlan brief` on both.",
        hi: "Layer 3 switch ko bhi VLANs apne database mein chahiye, tabhi SVI ya trunk unhe use kar sakte hain. Dono par `show vlan brief` se verify karo.",
      },
      check: [
        { t: "vlan", dev: "dsw1", id: 10, name: "ENG" },
        { t: "vlan", dev: "dsw1", id: 20, name: "SALES" },
        { t: "vlan", dev: "asw1", id: 10, name: "ENG" },
        { t: "vlan", dev: "asw1", id: 20, name: "SALES" },
        { t: "access", dev: "asw1", iface: "FastEthernet0/1", vlan: 10 },
        { t: "access", dev: "asw1", iface: "FastEthernet0/2", vlan: 20 },
      ],
    },
    {
      text: {
        en: "Make the DSW1-ASW1 link a static trunk that carries only VLANs 10 and 20.",
        hi: "DSW1-ASW1 link ko static trunk banao jo sirf VLAN 10 aur 20 carry kare.",
      },
      hint: {
        en: "Set trunk mode on both ends and prune the allowed list on both. On the 3650, real IOS wants the encapsulation chosen before trunk mode. `show interfaces trunk` on each side.",
        hi: "Dono ends par trunk mode set karo aur dono par allowed list prune karo. 3650 par real IOS trunk mode se pehle encapsulation choose karwata hai. Dono taraf `show interfaces trunk` dekho.",
      },
      check: [
        { t: "trunk", dev: "dsw1", iface: "GigabitEthernet1/0/1", allowed: [10, 20] },
        { t: "trunk", dev: "asw1", iface: "GigabitEthernet0/1", allowed: [10, 20] },
        { t: "config", dev: "dsw1", section: "interface GigabitEthernet1/0/1", has: "switchport mode trunk" },
        { t: "config", dev: "asw1", section: "interface GigabitEthernet0/1", has: "switchport mode trunk" },
      ],
    },
    {
      text: {
        en: "Turn DSW1 into the default gateway for both VLANs: 10.1.10.1/24 and 10.1.20.1/24, with routing between them.",
        hi: "DSW1 ko dono VLANs ka default gateway banao: 10.1.10.1/24 aur 10.1.20.1/24, aur dono ke beech routing chalu karo.",
      },
      hint: {
        en: "One SVI per VLAN. A 3650 doesn't route until you tell it to, so check `show ip route` shows both subnets as connected.",
        hi: "Har VLAN ke liye ek SVI. 3650 tab tak route nahi karta jab tak tum use bolo nahi, isliye check karo ki `show ip route` mein dono subnets connected dikh rahe hain.",
      },
      check: [
        { t: "config", dev: "dsw1", has: "^ip routing$" },
        { t: "route", dev: "dsw1", prefix: "10.1.10.0/24", code: "C" },
        { t: "route", dev: "dsw1", prefix: "10.1.20.0/24", code: "C" },
      ],
    },
    {
      text: {
        en: "Bring up the routed uplink: DSW1 Gi1/1/1 is a Layer 3 port with 10.1.0.1/30, and DSW1 can ping EDGE at 10.1.0.2.",
        hi: "Routed uplink up karo: DSW1 ka Gi1/1/1 Layer 3 port hai jispar 10.1.0.1/30 hai, aur DSW1 se EDGE (10.1.0.2) ping hona chahiye.",
      },
      hint: {
        en: "Switch ports are Layer 2 by default and refuse an IP address. Turn the port into a routed port first.",
        hi: "Switch ports default mein Layer 2 hote hain aur IP address accept nahi karte. Pehle port ko routed port banao.",
      },
      check: [
        { t: "config", dev: "dsw1", section: "interface GigabitEthernet1/1/1", has: "no switchport" },
        { t: "ping", from: "dsw1", to: "10.1.0.2" },
      ],
    },
    {
      text: {
        en: "Run OSPF area 0 between DSW1 and EDGE. EDGE must learn both user subnets, DSW1 must learn the server LAN, and neither device may send hellos towards users or servers.",
        hi: "DSW1 aur EDGE ke beech OSPF area 0 chalao. EDGE ko dono user subnets seekhne chahiye, DSW1 ko server LAN seekhna chahiye, aur koi bhi device users ya servers ki taraf hellos na bheje.",
      },
      hint: {
        en: "Advertise the /30 and the LANs on each side, and make the SVIs on DSW1 and Gi0/1 on EDGE passive. `show ip ospf neighbor` and `show ip route ospf` on both.",
        hi: "Har side par /30 aur LANs advertise karo, aur DSW1 ke SVIs aur EDGE ka Gi0/1 passive karo. Dono par `show ip ospf neighbor` aur `show ip route ospf` dekho.",
      },
      check: [
        { t: "ospf", dev: "dsw1", neighbors: 1 },
        { t: "route", dev: "edge", prefix: "10.1.10.0/24", code: "O" },
        { t: "route", dev: "edge", prefix: "10.1.20.0/24", code: "O" },
        { t: "route", dev: "dsw1", prefix: "10.1.100.0/24", code: "O" },
        { t: "config", dev: "dsw1", has: "^ passive-interface (default|Vlan10)$" },
        { t: "config", dev: "dsw1", has: "^ passive-interface (default|Vlan20)$" },
        { t: "config", dev: "edge", has: "^ passive-interface (default|GigabitEthernet0/1)$" },
      ],
    },
    {
      text: {
        en: "EDGE is the DHCP server for both VLANs (gateway is the SVI address, first ten addresses of each subnet kept out). The clients are two hops away, so DSW1 must pass their requests on. Both PCs must get a lease.",
        hi: "EDGE dono VLANs ka DHCP server hai (gateway SVI ka address hai, har subnet ke pehle das addresses bahar rakho). Clients do hop door hain, isliye DSW1 ko unki requests aage bhejni hongi. Dono PCs ko lease milni chahiye.",
      },
      hint: {
        en: "One pool per subnet on EDGE, plus excluded ranges. DHCP discovers are broadcasts, which a router never forwards, so the SVIs need `ip helper-address` pointing at EDGE. Then `ipconfig /renew` on the PCs and `show ip dhcp binding` on EDGE.",
        hi: "EDGE par har subnet ke liye ek pool, saath mein excluded ranges. DHCP discover broadcast hota hai, aur router broadcast kabhi forward nahi karta, isliye SVIs par EDGE ki taraf `ip helper-address` chahiye. Phir PCs par `ipconfig /renew` aur EDGE par `show ip dhcp binding`.",
      },
      check: [
        { t: "config", dev: "edge", has: "^ip dhcp excluded-address 10\\.1\\.10\\.1 10\\.1\\.10\\.10$" },
        { t: "config", dev: "edge", has: "^ip dhcp excluded-address 10\\.1\\.20\\.1 10\\.1\\.20\\.10$" },
        { t: "config", dev: "dsw1", section: "interface Vlan10", has: "ip helper-address" },
        { t: "config", dev: "dsw1", section: "interface Vlan20", has: "ip helper-address" },
        { t: "dhcp", host: "eng" },
        { t: "dhcp", host: "sales" },
      ],
    },
    {
      text: {
        en: "Prove the design end to end: both PCs can open the intranet site on 10.1.100.10 and ping each other's gateway.",
        hi: "Design ko end to end prove karo: dono PCs 10.1.100.10 par intranet site khol sakein aur ek dusre ka gateway ping kar sakein.",
      },
      hint: {
        en: "On a PC, `ipconfig` shows the lease, `curl http://10.1.100.10` tests the web server and `tracert` shows each hop. If the server can't answer, look at EDGE's routing table first.",
        hi: "PC par `ipconfig` lease dikhata hai, `curl http://10.1.100.10` web server test karta hai aur `tracert` har hop dikhata hai. Server jawab na de toh pehle EDGE ki routing table dekho.",
      },
      check: [
        { t: "tcp", from: "eng", to: "10.1.100.10", port: 80 },
        { t: "tcp", from: "sales", to: "10.1.100.10", port: 80 },
        { t: "ping", from: "eng", to: "10.1.20.1" },
        { t: "ping", from: "sales", to: "10.1.10.1" },
      ],
    },
    {
      text: { en: "Save the configuration on EDGE, DSW1 and ASW1.", hi: "EDGE, DSW1 aur ASW1 ki configuration save karo." },
      hint: {
        en: "Copy the running config to the startup config on all three devices.",
        hi: "Teeno devices par running config ko startup config mein copy karo.",
      },
      check: [
        { t: "saved", dev: "edge" },
        { t: "saved", dev: "dsw1" },
        { t: "saved", dev: "asw1" },
      ],
    },
  ],
  solution: {
    asw1: [
      "vlan 10", "name ENG", "vlan 20", "name SALES", "exit",
      "interface f0/1", "switchport mode access", "switchport access vlan 10",
      "interface f0/2", "switchport mode access", "switchport access vlan 20",
      "interface g0/1", "switchport mode trunk", "switchport trunk allowed vlan 10,20",
      "end", "copy running-config startup-config",
    ],
    edge: [
      "ip dhcp excluded-address 10.1.10.1 10.1.10.10",
      "ip dhcp excluded-address 10.1.20.1 10.1.20.10",
      "ip dhcp pool ENG", "network 10.1.10.0 255.255.255.0", "default-router 10.1.10.1", "exit",
      "ip dhcp pool SALES", "network 10.1.20.0 255.255.255.0", "default-router 10.1.20.1", "exit",
      "router ospf 1", "router-id 2.2.2.2", "network 10.1.0.0 0.0.0.3 area 0", "network 10.1.100.0 0.0.0.255 area 0", "passive-interface g0/1",
      "end", "copy running-config startup-config",
    ],
    dsw1: [
      "vlan 10", "name ENG", "vlan 20", "name SALES", "exit",
      "interface g1/0/1", "switchport trunk encapsulation dot1q", "switchport mode trunk", "switchport trunk allowed vlan 10,20",
      "ip routing",
      "interface vlan 10", "ip address 10.1.10.1 255.255.255.0", "ip helper-address 10.1.0.2", "no shutdown",
      "interface vlan 20", "ip address 10.1.20.1 255.255.255.0", "ip helper-address 10.1.0.2", "no shutdown",
      "interface g1/1/1", "no switchport", "ip address 10.1.0.1 255.255.255.252", "no shutdown",
      "router ospf 1", "router-id 1.1.1.1", "network 10.1.0.0 0.0.0.3 area 0", "network 10.1.10.0 0.0.0.255 area 0", "network 10.1.20.0 0.0.0.255 area 0",
      "passive-interface vlan 10", "passive-interface vlan 20",
      "end", "copy running-config startup-config",
    ],
    eng: ["ipconfig /renew"],
    sales: ["ipconfig /renew"],
  },
  debrief: {
    en: "On a Layer 3 switch the default gateway moves into the switch as SVIs, and `ip routing` is what makes it a router. The uplink to the edge becomes a routed port with `no switchport`, so it carries no VLANs and runs no spanning tree. A central DHCP server only works when every gateway SVI relays with `ip helper-address`, and when the server can route back to the client subnets, which is what OSPF gives you here.",
    hi: "Layer 3 switch par default gateway SVIs ke roop mein switch ke andar aa jaata hai, aur `ip routing` hi use router banata hai. Edge ki taraf ka uplink `no switchport` se routed port ban jaata hai, isliye us par na koi VLAN chalta hai na spanning tree. Central DHCP server tabhi kaam karta hai jab har gateway SVI `ip helper-address` se relay kare, aur jab server ke paas client subnets tak wapas jaane ka route ho, jo yahan OSPF deta hai.",
  },
};

export default lab;
