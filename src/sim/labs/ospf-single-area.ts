import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "ospf-single-area",
  title: { en: "Single-area OSPF on a triangle of routers", hi: "Teen routers ke triangle par single-area OSPF" },
  level: "intermediate",
  kind: "build",
  minutes: 30,
  lessons: ["ospf-config", "ospf-basics"],
  scenario: {
    en: "Three routers are cabled in a triangle so that any one link can fail without cutting a site off. Static routes would need constant editing, so the team has chosen OSPF in area 0. All interfaces are addressed and up. Turn on OSPF with clear router IDs, advertise every link and both LANs with exact wildcards, and keep hellos off the user LANs.",
    hi: "Teen routers triangle mein cable kiye gaye hain taaki koi bhi ek link fail ho toh koi site cut na ho. Static routes ko baar baar edit karna padta, isliye team ne area 0 mein OSPF choose kiya hai. Saare interfaces par address hai aur woh up hain. Saaf router IDs ke saath OSPF chalu karo, har link aur dono LANs ko exact wildcards ke saath advertise karo, aur user LANs par hellos mat bhejo.",
  },
  height: 439,
  devices: [
    { id: "r2", kind: "router", hostname: "R2", x: 400, y: 70, note: "Core", config: [
      "interface g0/0", "ip address 10.0.12.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 10.0.23.1 255.255.255.252", "no shutdown",
    ] },
    { id: "r1", kind: "router", hostname: "R1", x: 180, y: 205, note: "Site A", config: [
      "interface g0/0", "ip address 10.0.12.1 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 10.0.13.1 255.255.255.252", "no shutdown",
      "interface g0/2", "ip address 192.168.1.1 255.255.255.0", "no shutdown",
    ] },
    { id: "r3", kind: "router", hostname: "R3", x: 620, y: 205, note: "Site B", config: [
      "interface g0/0", "ip address 10.0.23.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 10.0.13.2 255.255.255.252", "no shutdown",
      "interface g0/2", "ip address 192.168.3.1 255.255.255.0", "no shutdown",
    ] },
    { id: "pc1", kind: "pc", hostname: "PC-A", x: 180, y: 369, host: { ip: "192.168.1.10", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.10" },
    { id: "pc2", kind: "pc", hostname: "PC-B", x: 620, y: 369, host: { ip: "192.168.3.10", prefix: 24, gateway: "192.168.3.1" }, note: "192.168.3.10" },
  ],
  links: [
    ["r1", "GigabitEthernet0/0", "r2", "GigabitEthernet0/0"],
    ["r2", "GigabitEthernet0/1", "r3", "GigabitEthernet0/0"],
    ["r1", "GigabitEthernet0/1", "r3", "GigabitEthernet0/1"],
    ["pc1", "FastEthernet0", "r1", "GigabitEthernet0/2"],
    ["pc2", "FastEthernet0", "r3", "GigabitEthernet0/2"],
  ],
  tasks: [
    {
      text: { en: "Start OSPF process 1 on all three routers and set the router IDs to 1.1.1.1 (R1), 2.2.2.2 (R2) and 3.3.3.3 (R3).", hi: "Teeno routers par OSPF process 1 start karo aur router IDs set karo: 1.1.1.1 (R1), 2.2.2.2 (R2) aur 3.3.3.3 (R3)." },
      hint: {
        en: "`router ospf 1` then `router-id 1.1.1.1` (and the same idea on R2 and R3). Set the ID before adding networks so it never has to change.",
        hi: "`router ospf 1` phir `router-id 1.1.1.1` (R2 aur R3 par bhi yahi tareeka). ID networks add karne se pehle set karo taaki baad mein badalni na pade.",
      },
      check: [
        { t: "config", dev: "r1", section: "router ospf 1", has: "router-id 1\\.1\\.1\\.1$" },
        { t: "config", dev: "r2", section: "router ospf 1", has: "router-id 2\\.2\\.2\\.2$" },
        { t: "config", dev: "r3", section: "router ospf 1", has: "router-id 3\\.3\\.3\\.3$" },
      ],
    },
    {
      text: {
        en: "Advertise the three /30 links in area 0 using the network address and wildcard 0.0.0.3. Every router must end up with two FULL neighbours.",
        hi: "Teeno /30 links ko area 0 mein advertise karo, network address aur wildcard 0.0.0.3 use karke. Har router ke do FULL neighbours hone chahiye.",
      },
      hint: {
        en: "On R1: `network 10.0.12.0 0.0.0.3 area 0` and `network 10.0.13.0 0.0.0.3 area 0`; do the same for each router's own links. Check with `show ip ospf neighbor`.",
        hi: "R1 par `network 10.0.12.0 0.0.0.3 area 0` aur `network 10.0.13.0 0.0.0.3 area 0` do; har router par uske apne links ke liye yahi karo. `show ip ospf neighbor` se check karo.",
      },
      check: [
        { t: "config", dev: "r1", section: "router ospf 1", has: "network 10\\.0\\.12\\.0 0\\.0\\.0\\.3 area 0" },
        { t: "config", dev: "r1", section: "router ospf 1", has: "network 10\\.0\\.13\\.0 0\\.0\\.0\\.3 area 0" },
        { t: "config", dev: "r2", section: "router ospf 1", has: "network 10\\.0\\.12\\.0 0\\.0\\.0\\.3 area 0" },
        { t: "config", dev: "r2", section: "router ospf 1", has: "network 10\\.0\\.23\\.0 0\\.0\\.0\\.3 area 0" },
        { t: "config", dev: "r3", section: "router ospf 1", has: "network 10\\.0\\.23\\.0 0\\.0\\.0\\.3 area 0" },
        { t: "config", dev: "r3", section: "router ospf 1", has: "network 10\\.0\\.13\\.0 0\\.0\\.0\\.3 area 0" },
        { t: "ospf", dev: "r1", neighbors: 2 },
        { t: "ospf", dev: "r2", neighbors: 2 },
        { t: "ospf", dev: "r3", neighbors: 2 },
      ],
    },
    {
      text: { en: "Advertise the LANs 192.168.1.0/24 (R1) and 192.168.3.0/24 (R3) with wildcard 0.0.0.255, so every router learns both.", hi: "LANs 192.168.1.0/24 (R1) aur 192.168.3.0/24 (R3) ko wildcard 0.0.0.255 ke saath advertise karo, taaki har router dono seekh le." },
      hint: {
        en: "R1: `network 192.168.1.0 0.0.0.255 area 0`. R3: `network 192.168.3.0 0.0.0.255 area 0`. Look for O routes in `show ip route ospf` on R2.",
        hi: "R1 par `network 192.168.1.0 0.0.0.255 area 0`, R3 par `network 192.168.3.0 0.0.0.255 area 0`. Phir R2 par `show ip route ospf` mein O routes dhoondho.",
      },
      check: [
        { t: "route", dev: "r2", prefix: "192.168.1.0/24", code: "O" },
        { t: "route", dev: "r2", prefix: "192.168.3.0/24", code: "O" },
        { t: "route", dev: "r1", prefix: "192.168.3.0/24", code: "O" },
        { t: "route", dev: "r3", prefix: "192.168.1.0/24", code: "O" },
      ],
    },
    {
      text: { en: "Make the LAN interface (Gi0/2) passive on R1 and R3. The LANs must stay advertised.", hi: "R1 aur R3 par LAN interface (Gi0/2) ko passive banao. LANs advertise hote rehne chahiye." },
      hint: {
        en: "`passive-interface g0/2` under `router ospf 1`. `show ip protocols` lists the passive interfaces.",
        hi: "`router ospf 1` ke andar `passive-interface g0/2` do. `show ip protocols` passive interfaces ki list dikhata hai.",
      },
      check: [
        { t: "config", dev: "r1", section: "router ospf 1", has: "passive-interface GigabitEthernet0/2" },
        { t: "config", dev: "r3", section: "router ospf 1", has: "passive-interface GigabitEthernet0/2" },
        { t: "route", dev: "r1", prefix: "192.168.3.0/24", code: "O" },
      ],
    },
    {
      text: { en: "Prove it: PC-A can ping PC-B.", hi: "Prove karo: PC-A se PC-B ping ho." },
      hint: {
        en: "From PC-A run `ping 192.168.3.10`. `tracert 192.168.3.10` shows OSPF picked the direct R1-R3 link, the lowest-cost path.",
        hi: "PC-A se `ping 192.168.3.10` chalao. `tracert 192.168.3.10` dikhayega ki OSPF ne seedha R1-R3 link choose kiya, kyunki uski cost sabse kam hai.",
      },
      check: { t: "ping", from: "pc1", to: "192.168.3.10" },
    },
  ],
  solution: {
    r1: ["router ospf 1", "router-id 1.1.1.1", "network 10.0.12.0 0.0.0.3 area 0", "network 10.0.13.0 0.0.0.3 area 0", "network 192.168.1.0 0.0.0.255 area 0", "passive-interface g0/2"],
    r2: ["router ospf 1", "router-id 2.2.2.2", "network 10.0.12.0 0.0.0.3 area 0", "network 10.0.23.0 0.0.0.3 area 0"],
    r3: ["router ospf 1", "router-id 3.3.3.3", "network 10.0.23.0 0.0.0.3 area 0", "network 10.0.13.0 0.0.0.3 area 0", "network 192.168.3.0 0.0.0.255 area 0", "passive-interface g0/2"],
  },
  debrief: {
    en: "A `network` statement doesn't advertise a prefix directly: it picks the interfaces whose addresses match the wildcard and runs OSPF on them. A wildcard is the inverse of the mask (/30 is 0.0.0.3, /24 is 0.0.0.255). Passive interfaces keep the subnet in OSPF but stop hellos, so no stranger on the LAN can form a neighbourship.",
    hi: "`network` statement prefix ko seedha advertise nahi karta: woh un interfaces ko chunta hai jinke address wildcard se match karte hain aur un par OSPF chalata hai. Wildcard mask ka ulta hota hai (/30 matlab 0.0.0.3, /24 matlab 0.0.0.255). Passive interface subnet ko OSPF mein rakhta hai lekin hellos band kar deta hai, isliye LAN par koi anjaan device neighbourship nahi bana sakta.",
  },
};

export default lab;
