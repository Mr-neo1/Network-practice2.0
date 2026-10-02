import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "ospf-neighbors-fix",
  title: { en: "Troubleshoot: OSPF neighbours that won't come up", hi: "Troubleshoot: OSPF neighbours jo up nahi ho rahe" },
  level: "intermediate",
  kind: "troubleshoot",
  minutes: 30,
  lessons: ["ospf-basics", "ospf-config", "troubleshooting-method"],
  scenario: {
    en: "A ticket says: \"Branch users on 192.168.1.0/24 can't reach the data centre LAN 192.168.3.0/24.\" Three routers run single-area OSPF in area 0. Someone changed things last night. Find every fault, fix it, and prove the two LANs can talk. Use show commands before you change anything.",
    hi: "Ticket kehta hai: \"192.168.1.0/24 ke branch users data centre LAN 192.168.3.0/24 tak nahi pahunch pa rahe.\" Teen routers area 0 mein single-area OSPF chala rahe hain. Kal raat kisi ne kuch badla hai. Har fault dhoondho, theek karo, aur prove karo ki dono LANs baat kar sakte hain. Kuch bhi badalne se pehle show commands chalao.",
  },
  devices: [
    { id: "r1", kind: "router", hostname: "R1", x: 170, y: 110, note: "Branch", config: [
      "interface g0/0", "ip address 10.0.12.1 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 192.168.1.1 255.255.255.0", "no shutdown",
      "interface lo0", "ip address 1.1.1.1 255.255.255.255",
      "router ospf 1", "router-id 1.1.1.1", "network 10.0.12.0 0.0.0.3 area 0",
    ] },
    { id: "r2", kind: "router", hostname: "R2", x: 400, y: 110, note: "Core", config: [
      "interface g0/0", "ip address 10.0.12.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 10.0.23.1 255.255.255.252", "no shutdown",
      "router ospf 1", "router-id 2.2.2.2", "network 10.0.12.0 0.0.0.3 area 0", "network 10.0.23.0 0.0.0.3 area 1",
    ] },
    { id: "r3", kind: "router", hostname: "R3", x: 630, y: 110, note: "Data centre", config: [
      "interface g0/0", "ip address 10.0.23.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 192.168.3.1 255.255.255.0", "no shutdown",
      "router ospf 1", "router-id 3.3.3.3", "network 10.0.23.0 0.0.0.3 area 0", "network 192.168.3.0 0.0.0.255 area 0", "passive-interface g0/0", "passive-interface g0/1",
    ] },
    { id: "pc1", kind: "pc", hostname: "Branch-PC", x: 170, y: 270, host: { ip: "192.168.1.10", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.10" },
    { id: "srv", kind: "server", hostname: "DC-Server", x: 630, y: 270, host: { ip: "192.168.3.10", prefix: 24, gateway: "192.168.3.1", services: ["http"] }, note: "192.168.3.10" },
  ],
  links: [
    ["r1", "GigabitEthernet0/0", "r2", "GigabitEthernet0/0"],
    ["r2", "GigabitEthernet0/1", "r3", "GigabitEthernet0/0"],
    ["pc1", "FastEthernet0", "r1", "GigabitEthernet0/1"],
    ["srv", "FastEthernet0", "r3", "GigabitEthernet0/1"],
  ],
  tasks: [
    {
      text: { en: "R2 must have two OSPF neighbours in the FULL state.", hi: "R2 ke do OSPF neighbours FULL state mein hone chahiye." },
      hint: {
        en: "Compare `show ip ospf interface brief` on R2 and R3: is the link in the same area on both? Is R3 even sending hellos on Gi0/0?",
        hi: "R2 aur R3 par `show ip ospf interface brief` compare karo: kya link dono taraf same area mein hai? Kya R3 Gi0/0 par hellos bhej bhi raha hai?",
      },
      check: { t: "ospf", dev: "r2", neighbors: 2 },
    },
    {
      text: { en: "R3 must learn the branch LAN 192.168.1.0/24 through OSPF.", hi: "R3 ko branch LAN 192.168.1.0/24 OSPF se seekhna chahiye." },
      hint: { en: "A network is only advertised if a `network` statement (or `ip ospf` on the interface) covers it. Check `show ip protocols` on R1.", hi: "Network tabhi advertise hota hai jab koi `network` statement (ya interface par `ip ospf`) use cover kare. R1 par `show ip protocols` dekho." },
      check: { t: "route", dev: "r3", prefix: "192.168.1.0/24", code: "O" },
    },
    {
      text: { en: "Don't send OSPF hellos to the branch users: make R1's LAN interface passive.", hi: "Branch users ki taraf OSPF hellos mat bhejo: R1 ka LAN interface passive banao." },
      hint: { en: "`passive-interface g0/1` under `router ospf 1`. The LAN is still advertised; only hellos stop.", hi: "`router ospf 1` ke andar `passive-interface g0/1`. LAN advertise hota rahega; sirf hellos band honge." },
      check: { t: "config", dev: "r1", section: "router ospf 1", has: "passive-interface GigabitEthernet0/1" },
    },
    {
      text: { en: "Prove it: the branch PC can ping the data centre server.", hi: "Prove karo: branch PC data centre server ko ping kar sake." },
      hint: { en: "From Branch-PC run `ping 192.168.3.10`. If it fails, `tracert` shows where it stops.", hi: "Branch-PC se `ping 192.168.3.10` chalao. Fail ho toh `tracert` dikhayega packet kahan rukta hai." },
      check: { t: "ping", from: "pc1", to: "192.168.3.10" },
    },
  ],
  solution: {
    r2: ["router ospf 1", "no network 10.0.23.0 0.0.0.3 area 1", "network 10.0.23.0 0.0.0.3 area 0"],
    r3: ["router ospf 1", "no passive-interface g0/0"],
    r1: ["router ospf 1", "network 192.168.1.0 0.0.0.255 area 0", "passive-interface g0/1"],
  },
  debrief: {
    en: "Three faults: an area mismatch on the R2-R3 link, a passive interface where a neighbour was needed, and a LAN nobody advertised. Neighbours need matching area, subnet and timers, and an interface that actually sends hellos.",
    hi: "Teen faults the: R2-R3 link par area mismatch, jahan neighbour chahiye tha wahan passive interface, aur ek LAN jise kisi ne advertise nahi kiya. Neighbours ke liye area, subnet aur timers match hone chahiye, aur interface ko sach mein hellos bhejne chahiye.",
  },
};

export default lab;
