import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "l3-switch-routing",
  title: { en: "Layer 3 switch: SVIs, ip routing and a routed uplink", hi: "Layer 3 switch: SVIs, ip routing aur ek routed uplink" },
  level: "intermediate",
  kind: "build",
  minutes: 30,
  lessons: ["inter-vlan-routing", "lan-architectures"],
  scenario: {
    en: "The router-on-a-stick link is saturated, so a 3650 now sits at the core. Engineering (VLAN 10, 192.168.10.0/24) and Finance (VLAN 20, 192.168.20.0/24) plug straight into it, and it should route between them itself. Its uplink Gi1/0/24 goes to R1 as a routed point-to-point link (10.0.0.0/30, the switch is .1, R1 is .2). Behind R1 sits the file server 172.16.1.10. R1's interfaces are done, but it knows nothing about the user VLANs yet.",
    hi: "Router-on-a-stick wala link full ho gaya hai, isliye ab core par ek 3650 lagaya gaya hai. Engineering (VLAN 10, 192.168.10.0/24) aur Finance (VLAN 20, 192.168.20.0/24) seedha isi mein lagte hain, aur yahi unke beech route karega. Iska uplink Gi1/0/24 R1 tak routed point-to-point link hai (10.0.0.0/30, switch .1 hai, R1 .2). R1 ke peeche file server 172.16.1.10 hai. R1 ke interfaces ready hain, lekin use user VLANs ke baare mein abhi kuch nahi pata.",
  },
  devices: [
    { id: "pc1", kind: "pc", hostname: "Eng-PC", x: 120, y: 270, host: { ip: "192.168.10.10", prefix: 24, gateway: "192.168.10.1" }, note: "VLAN 10 .10.10" },
    { id: "pc2", kind: "pc", hostname: "Fin-PC", x: 360, y: 270, host: { ip: "192.168.20.10", prefix: 24, gateway: "192.168.20.1" }, note: "VLAN 20 .20.10" },
    { id: "dsw1", kind: "l3switch", hostname: "CORE1", x: 240, y: 110, note: "3650" },
    { id: "r1", kind: "router", hostname: "R1", x: 480, y: 110, note: "10.0.0.2", config: [
      "interface g0/0", "ip address 10.0.0.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 172.16.1.1 255.255.255.0", "no shutdown",
    ] },
    { id: "srv", kind: "server", hostname: "File-Server", x: 690, y: 110, host: { ip: "172.16.1.10", prefix: 24, gateway: "172.16.1.1", services: ["http"] }, note: "172.16.1.10" },
  ],
  links: [
    ["pc1", "FastEthernet0", "dsw1", "GigabitEthernet1/0/1"],
    ["pc2", "FastEthernet0", "dsw1", "GigabitEthernet1/0/2"],
    ["dsw1", "GigabitEthernet1/0/24", "r1", "GigabitEthernet0/0"],
    ["r1", "GigabitEthernet0/1", "srv", "FastEthernet0"],
  ],
  height: 340,
  tasks: [
    {
      text: {
        en: "On CORE1, create VLAN 10 named ENG and VLAN 20 named FIN. Make Gi1/0/1 an access port in VLAN 10 and Gi1/0/2 an access port in VLAN 20.",
        hi: "CORE1 par VLAN 10 (naam ENG) aur VLAN 20 (naam FIN) banao. Gi1/0/1 ko VLAN 10 ka aur Gi1/0/2 ko VLAN 20 ka access port banao.",
      },
      hint: {
        en: "`vlan 10`, `name ENG`, `vlan 20`, `name FIN`; `interface g1/0/1`, `switchport mode access`, `switchport access vlan 10`; same for g1/0/2.",
        hi: "`vlan 10`, `name ENG`, `vlan 20`, `name FIN` karo; phir `interface g1/0/1` mein `switchport mode access` aur `switchport access vlan 10`; g1/0/2 par bhi yahi VLAN 20 ke saath.",
      },
      check: [
        { t: "vlan", dev: "dsw1", id: 10, name: "ENG" },
        { t: "vlan", dev: "dsw1", id: 20, name: "FIN" },
        { t: "access", dev: "dsw1", iface: "GigabitEthernet1/0/1", vlan: 10 },
        { t: "access", dev: "dsw1", iface: "GigabitEthernet1/0/2", vlan: 20 },
      ],
    },
    {
      text: {
        en: "Give CORE1 the gateway addresses 192.168.10.1/24 on VLAN 10 and 192.168.20.1/24 on VLAN 20, and turn on routing. Eng-PC must reach Fin-PC.",
        hi: "CORE1 ko gateway addresses do: VLAN 10 par 192.168.10.1/24 aur VLAN 20 par 192.168.20.1/24, aur routing on karo. Eng-PC se Fin-PC tak pahunch honi chahiye.",
      },
      hint: {
        en: "`interface vlan 10`, `ip address 192.168.10.1 255.255.255.0`, `no shutdown`; same for VLAN 20; then `ip routing` in global config. Without it the SVIs are just management addresses.",
        hi: "`interface vlan 10` mein `ip address 192.168.10.1 255.255.255.0` aur `no shutdown`; VLAN 20 ke liye bhi yahi; phir global config mein `ip routing`. Iske bina SVIs sirf management addresses hain, route nahi karte.",
      },
      check: [
        { t: "up", dev: "dsw1", iface: "Vlan10" },
        { t: "up", dev: "dsw1", iface: "Vlan20" },
        { t: "config", dev: "dsw1", has: "^ip routing$" },
        { t: "ping", from: "pc1", to: "192.168.20.10" },
      ],
    },
    {
      text: {
        en: "Turn Gi1/0/24 into a routed port with the address 10.0.0.1/30. CORE1 must be able to ping R1 at 10.0.0.2.",
        hi: "Gi1/0/24 ko routed port banao aur use 10.0.0.1/30 address do. CORE1 se R1 (10.0.0.2) ping hona chahiye.",
      },
      hint: {
        en: "`interface g1/0/24`, `no switchport`, `ip address 10.0.0.1 255.255.255.252`. Then `ping 10.0.0.2` from privileged mode.",
        hi: "`interface g1/0/24` mein `no switchport` do, phir `ip address 10.0.0.1 255.255.255.252`. Uske baad privileged mode se `ping 10.0.0.2` karo.",
      },
      check: [
        { t: "config", dev: "dsw1", section: "interface GigabitEthernet1/0/24", has: "^ no switchport$" },
        { t: "route", dev: "dsw1", prefix: "10.0.0.0/30", code: "C" },
        { t: "ping", from: "dsw1", to: "10.0.0.2" },
      ],
    },
    {
      text: { en: "Give CORE1 a default route pointing at R1.", hi: "CORE1 ko R1 ki taraf point karta hua ek default route do." },
      hint: {
        en: "`ip route 0.0.0.0 0.0.0.0 10.0.0.2`. Check `show ip route` for the S* line.",
        hi: "`ip route 0.0.0.0 0.0.0.0 10.0.0.2` do. `show ip route` mein S* wali line dekho.",
      },
      check: { t: "route", dev: "dsw1", prefix: "0.0.0.0/0", code: "S*" },
    },
    {
      text: {
        en: "R1 must know the way back: add static routes on R1 for 192.168.10.0/24 and 192.168.20.0/24 via CORE1.",
        hi: "R1 ko wapas aane ka raasta pata hona chahiye: R1 par 192.168.10.0/24 aur 192.168.20.0/24 ke liye CORE1 ke through static routes do.",
      },
      hint: {
        en: "On R1: `ip route 192.168.10.0 255.255.255.0 10.0.0.1` and `ip route 192.168.20.0 255.255.255.0 10.0.0.1`.",
        hi: "R1 par: `ip route 192.168.10.0 255.255.255.0 10.0.0.1` aur `ip route 192.168.20.0 255.255.255.0 10.0.0.1` do. Next hop CORE1 ka routed port hai.",
      },
      check: [
        { t: "route", dev: "r1", prefix: "192.168.10.0/24", code: "S" },
        { t: "route", dev: "r1", prefix: "192.168.20.0/24", code: "S" },
      ],
    },
    {
      text: { en: "Prove it: both PCs can ping the file server and open its web page.", hi: "Prove karo: dono PCs file server ko ping kar sakein aur uska web page khol sakein." },
      hint: {
        en: "From Eng-PC: `ping 172.16.1.10` and `curl http://172.16.1.10`. If the ping fails, `tracert` shows whether it dies on the way out or on the way back.",
        hi: "Eng-PC se `ping 172.16.1.10` aur `curl http://172.16.1.10` chalao. Ping fail ho toh `tracert` batayega packet jaate waqt mar raha hai ya wapas aate waqt.",
      },
      check: [
        { t: "ping", from: "pc1", to: "172.16.1.10" },
        { t: "ping", from: "pc2", to: "172.16.1.10" },
        { t: "tcp", from: "pc1", to: "172.16.1.10", port: 80 },
      ],
    },
  ],
  solution: {
    dsw1: [
      "vlan 10", "name ENG", "vlan 20", "name FIN", "exit",
      "interface g1/0/1", "switchport mode access", "switchport access vlan 10",
      "interface g1/0/2", "switchport mode access", "switchport access vlan 20",
      "interface vlan 10", "ip address 192.168.10.1 255.255.255.0", "no shutdown",
      "interface vlan 20", "ip address 192.168.20.1 255.255.255.0", "no shutdown",
      "exit",
      "ip routing",
      "interface g1/0/24", "no switchport", "ip address 10.0.0.1 255.255.255.252", "exit",
      "ip route 0.0.0.0 0.0.0.0 10.0.0.2",
    ],
    r1: [
      "ip route 192.168.10.0 255.255.255.0 10.0.0.1",
      "ip route 192.168.20.0 255.255.255.0 10.0.0.1",
    ],
  },
  debrief: {
    en: "A Layer 3 switch routes between its SVIs only after `ip routing`. `no switchport` turns a port into a router-style interface that belongs to no VLAN, which is the clean way to uplink to a router. Routing is always two-way: the default route gets packets out, and the statics on R1 bring the replies home.",
    hi: "Layer 3 switch apne SVIs ke beech tabhi route karta hai jab `ip routing` on ho. `no switchport` port ko router jaisa interface bana deta hai jo kisi VLAN mein nahi hota, aur router tak uplink ka yahi saaf tarika hai. Routing hamesha do-tarfa hoti hai: default route packets ko bahar le jaata hai, aur R1 ke static routes replies ko wapas laate hain.",
  },
};

export default lab;
