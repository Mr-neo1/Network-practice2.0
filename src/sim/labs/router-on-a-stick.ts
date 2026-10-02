import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "router-on-a-stick",
  title: { en: "Router-on-a-stick: routing between VLANs over one trunk", hi: "Router-on-a-stick: ek trunk par VLANs ke beech routing" },
  level: "intermediate",
  kind: "build",
  minutes: 25,
  lessons: ["inter-vlan-routing"],
  scenario: {
    en: "Sales (VLAN 10, 192.168.10.0/24) and HR (VLAN 20, 192.168.20.0/24) share one switch, and the office has a single router with one free port. Payroll files live on an HR PC that Sales needs to reach. Separate the VLANs on the switch, run a trunk to R1, and let R1 route between them with one subinterface per VLAN. The PCs already use .1 as their gateway.",
    hi: "Sales (VLAN 10, 192.168.10.0/24) aur HR (VLAN 20, 192.168.20.0/24) ek hi switch share karte hain, aur office mein sirf ek router hai jiska ek port free hai. Payroll files ek HR PC par hain jahan Sales ko pahunchna hai. Switch par VLANs alag karo, R1 tak trunk chalao, aur R1 ko har VLAN ke liye ek subinterface se unke beech route karne do. PCs pehle se .1 ko gateway maante hain.",
  },
  devices: [
    { id: "r1", kind: "router", hostname: "R1", x: 400, y: 70, note: "Gi0/0.10 | Gi0/0.20" },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 400, y: 218 },
    { id: "pc1", kind: "pc", hostname: "Sales-PC", x: 210, y: 354, host: { ip: "192.168.10.10", prefix: 24, gateway: "192.168.10.1" }, note: "VLAN 10 .10.10" },
    { id: "pc2", kind: "pc", hostname: "HR-PC", x: 590, y: 354, host: { ip: "192.168.20.10", prefix: 24, gateway: "192.168.20.1" }, note: "VLAN 20 .20.10" },
  ],
  height: 424,
  links: [
    ["r1", "GigabitEthernet0/0", "sw1", "GigabitEthernet0/1"],
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/2"],
  ],
  tasks: [
    {
      text: {
        en: "On SW1, create VLAN 10 named SALES and VLAN 20 named HR. Put Fa0/1 in VLAN 10 and Fa0/2 in VLAN 20 as access ports.",
        hi: "SW1 par VLAN 10 (naam SALES) aur VLAN 20 (naam HR) banao. Fa0/1 ko VLAN 10 aur Fa0/2 ko VLAN 20 mein access port ki tarah daalo.",
      },
      hint: {
        en: "`vlan 10`, `name SALES`, `vlan 20`, `name HR`; then `interface f0/1`, `switchport mode access`, `switchport access vlan 10`, and the same for f0/2.",
        hi: "`vlan 10`, `name SALES`, `vlan 20`, `name HR` karo; phir `interface f0/1` mein `switchport mode access` aur `switchport access vlan 10`, aur f0/2 par bhi yahi VLAN 20 ke saath.",
      },
      check: [
        { t: "vlan", dev: "sw1", id: 10, name: "SALES" },
        { t: "vlan", dev: "sw1", id: 20, name: "HR" },
        { t: "access", dev: "sw1", iface: "FastEthernet0/1", vlan: 10 },
        { t: "access", dev: "sw1", iface: "FastEthernet0/2", vlan: 20 },
      ],
    },
    {
      text: { en: "Make SW1's Gi0/1, the link to R1, a static 802.1Q trunk.", hi: "SW1 ka Gi0/1, jo R1 se juda hai, use static 802.1Q trunk banao." },
      hint: {
        en: "`interface g0/1`, `switchport mode trunk`. A router doesn't speak DTP, so the switch side must be forced to trunk.",
        hi: "`interface g0/1` mein `switchport mode trunk` do. Router DTP nahi bolta, isliye switch side ko zabardasti trunk banana padta hai.",
      },
      check: { t: "config", dev: "sw1", section: "interface GigabitEthernet0/1", has: "switchport mode trunk" },
    },
    {
      text: {
        en: "On R1, enable Gi0/0 and create subinterfaces Gi0/0.10 (VLAN 10, 192.168.10.1/24) and Gi0/0.20 (VLAN 20, 192.168.20.1/24).",
        hi: "R1 par Gi0/0 enable karo aur subinterfaces banao: Gi0/0.10 (VLAN 10, 192.168.10.1/24) aur Gi0/0.20 (VLAN 20, 192.168.20.1/24).",
      },
      hint: {
        en: "`interface g0/0`, `no shutdown`; `interface g0/0.10`, `encapsulation dot1Q 10`, `ip address 192.168.10.1 255.255.255.0`; the same for .20. The encapsulation must come before the address.",
        hi: "`interface g0/0` mein `no shutdown`; phir `interface g0/0.10` mein `encapsulation dot1Q 10` aur `ip address 192.168.10.1 255.255.255.0`; .20 ke liye bhi yahi. Address se pehle encapsulation dena zaroori hai.",
      },
      check: [
        { t: "up", dev: "r1", iface: "GigabitEthernet0/0.10" },
        { t: "up", dev: "r1", iface: "GigabitEthernet0/0.20" },
        { t: "route", dev: "r1", prefix: "192.168.10.0/24", code: "C" },
        { t: "route", dev: "r1", prefix: "192.168.20.0/24", code: "C" },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/0.10", has: "encapsulation dot1Q 10$" },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/0.20", has: "encapsulation dot1Q 20$" },
      ],
    },
    {
      text: { en: "Prove it: the trunk is up, and Sales-PC and HR-PC can ping each other.", hi: "Prove karo: trunk up hai, aur Sales-PC aur HR-PC ek doosre ko ping kar sakte hain." },
      hint: {
        en: "`show interfaces trunk` on SW1, then from Sales-PC `ping 192.168.20.10`. `tracert` should show 192.168.10.1 as the first hop.",
        hi: "SW1 par `show interfaces trunk` dekho, phir Sales-PC se `ping 192.168.20.10` chalao. `tracert` mein pehla hop 192.168.10.1 dikhna chahiye.",
      },
      check: [
        { t: "trunk", dev: "sw1", iface: "GigabitEthernet0/1" },
        { t: "ping", from: "pc1", to: "192.168.20.10" },
        { t: "ping", from: "pc2", to: "192.168.10.10" },
      ],
    },
  ],
  solution: {
    sw1: [
      "vlan 10", "name SALES", "vlan 20", "name HR", "exit",
      "interface f0/1", "switchport mode access", "switchport access vlan 10",
      "interface f0/2", "switchport mode access", "switchport access vlan 20",
      "interface g0/1", "switchport mode trunk",
    ],
    r1: [
      "interface g0/0", "no shutdown",
      "interface g0/0.10", "encapsulation dot1Q 10", "ip address 192.168.10.1 255.255.255.0",
      "interface g0/0.20", "encapsulation dot1Q 20", "ip address 192.168.20.1 255.255.255.0",
    ],
  },
  debrief: {
    en: "One physical port, one subinterface per VLAN: `encapsulation dot1Q <vlan>` ties each subinterface to a tag, and its address becomes that VLAN's gateway. The subinterfaces follow the physical port, so `no shutdown` goes on Gi0/0 itself. All inter-VLAN traffic crosses that one link twice, which is why bigger sites move to a Layer 3 switch.",
    hi: "Ek physical port, har VLAN ke liye ek subinterface: `encapsulation dot1Q <vlan>` har subinterface ko ek tag se jodta hai, aur uska address us VLAN ka gateway ban jaata hai. Subinterfaces physical port ke saath chalte hain, isliye `no shutdown` Gi0/0 par hi dena hota hai. Saara inter-VLAN traffic usi ek link ko do baar cross karta hai, isliye bade sites Layer 3 switch par chale jaate hain.",
  },
};

export default lab;
