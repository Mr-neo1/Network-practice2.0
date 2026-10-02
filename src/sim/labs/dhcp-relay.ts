import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "dhcp-relay",
  title: { en: "DHCP relay to a central server", hi: "Central server tak DHCP relay" },
  level: "intermediate",
  kind: "build",
  minutes: 30,
  lessons: ["dhcp"],
  scenario: {
    en: "Sales (192.168.10.0/24) and HR (192.168.20.0/24) both hang off R1. The company wants all addresses handed out from one place: R2, one hop away at 10.0.0.2. DHCP Discover messages are broadcasts and stop at R1, so R1 must relay them. Build the pools on R2, give R2 a way back to both LANs, and turn R1 into a relay agent.",
    hi: "Sales (192.168.10.0/24) aur HR (192.168.20.0/24) dono R1 se jude hain. Company chahti hai ki saare addresses ek hi jagah se baante jaayein: R2, jo ek hop door 10.0.0.2 par hai. DHCP Discover broadcast hota hai aur R1 par ruk jaata hai, isliye R1 ko use relay karna padega. R2 par pools banao, R2 ko dono LANs tak wapas pahunchne ka rasta do, aur R1 ko relay agent banao.",
  },
  devices: [
    { id: "r2", kind: "router", hostname: "R2", x: 400, y: 70, note: "DHCP server 10.0.0.2", config: ["interface g0/0", "ip address 10.0.0.2 255.255.255.252", "no shutdown"] },
    { id: "r1", kind: "router", hostname: "R1", x: 400, y: 205, config: [
      "interface g0/0", "ip address 192.168.10.1 255.255.255.0", "no shutdown",
      "interface g0/1", "ip address 192.168.20.1 255.255.255.0", "no shutdown",
      "interface g0/2", "ip address 10.0.0.1 255.255.255.252", "no shutdown",
    ] },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 170, y: 205, note: "Sales" },
    { id: "sw2", kind: "switch", hostname: "SW2", x: 630, y: 205, note: "HR" },
    { id: "pc1", kind: "pc", hostname: "Sales-PC", x: 170, y: 362, host: { dhcp: true }, note: "DHCP" },
    { id: "pc2", kind: "pc", hostname: "HR-PC", x: 630, y: 362, host: { dhcp: true }, note: "DHCP" },
  ],
  links: [
    ["r1", "GigabitEthernet0/2", "r2", "GigabitEthernet0/0"],
    ["r1", "GigabitEthernet0/0", "sw1", "GigabitEthernet0/1"],
    ["r1", "GigabitEthernet0/1", "sw2", "GigabitEthernet0/1"],
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw2", "FastEthernet0/1"],
  ],
  height: 432,
  tasks: [
    {
      text: {
        en: "On R2, exclude the first ten addresses of each LAN: 192.168.10.1 to .10 and 192.168.20.1 to .10.",
        hi: "R2 par har LAN ke pehle das addresses exclude karo: 192.168.10.1 se .10 tak aur 192.168.20.1 se .10 tak.",
      },
      hint: {
        en: "`ip dhcp excluded-address 192.168.10.1 192.168.10.10` and the same for 192.168.20.x.",
        hi: "`ip dhcp excluded-address 192.168.10.1 192.168.10.10` do, aur 192.168.20.x ke liye bhi yahi karo.",
      },
      check: [
        { t: "config", dev: "r2", has: "^ip dhcp excluded-address 192\\.168\\.10\\.1 192\\.168\\.10\\.10$" },
        { t: "config", dev: "r2", has: "^ip dhcp excluded-address 192\\.168\\.20\\.1 192\\.168\\.20\\.10$" },
      ],
    },
    {
      text: {
        en: "On R2, create pool SALES for 192.168.10.0/24 (gateway 192.168.10.1) and pool HR for 192.168.20.0/24 (gateway 192.168.20.1). Both use DNS server 8.8.8.8.",
        hi: "R2 par SALES pool banao 192.168.10.0/24 ke liye (gateway 192.168.10.1) aur HR pool 192.168.20.0/24 ke liye (gateway 192.168.20.1). Dono mein DNS server 8.8.8.8 ho.",
      },
      hint: {
        en: "`ip dhcp pool SALES`, `network 192.168.10.0 255.255.255.0`, `default-router 192.168.10.1`, `dns-server 8.8.8.8`; then the same for HR. The gateway is R1's address on that LAN, not R2.",
        hi: "`ip dhcp pool SALES`, `network 192.168.10.0 255.255.255.0`, `default-router 192.168.10.1`, `dns-server 8.8.8.8`; phir HR ke liye bhi same. Dhyan do, gateway us LAN par R1 ka address hai, R2 ka nahi.",
      },
      check: [
        { t: "config", dev: "r2", section: "ip dhcp pool SALES", has: "^ network 192\\.168\\.10\\.0 255\\.255\\.255\\.0$" },
        { t: "config", dev: "r2", section: "ip dhcp pool SALES", has: "^ default-router 192\\.168\\.10\\.1$" },
        { t: "config", dev: "r2", section: "ip dhcp pool SALES", has: "^ dns-server 8\\.8\\.8\\.8$" },
        { t: "config", dev: "r2", section: "ip dhcp pool HR", has: "^ network 192\\.168\\.20\\.0 255\\.255\\.255\\.0$" },
        { t: "config", dev: "r2", section: "ip dhcp pool HR", has: "^ default-router 192\\.168\\.20\\.1$" },
        { t: "config", dev: "r2", section: "ip dhcp pool HR", has: "^ dns-server 8\\.8\\.8\\.8$" },
      ],
    },
    {
      text: { en: "Give R2 static routes to both LANs through R1 (10.0.0.1), so its DHCP replies can find their way back.", hi: "R2 ko R1 (10.0.0.1) ke through dono LANs ke static routes do, taaki uske DHCP replies wapas pahunch sakein." },
      hint: {
        en: "`ip route 192.168.10.0 255.255.255.0 10.0.0.1` and `ip route 192.168.20.0 255.255.255.0 10.0.0.1`. Check `show ip route static`.",
        hi: "`ip route 192.168.10.0 255.255.255.0 10.0.0.1` aur `ip route 192.168.20.0 255.255.255.0 10.0.0.1` do. Phir `show ip route static` se check karo.",
      },
      check: [
        { t: "route", dev: "r2", prefix: "192.168.10.0/24", code: "S" },
        { t: "route", dev: "r2", prefix: "192.168.20.0/24", code: "S" },
      ],
    },
    {
      text: { en: "Make R1 relay DHCP from both LAN interfaces to 10.0.0.2.", hi: "R1 ko dono LAN interfaces se DHCP 10.0.0.2 tak relay karne do." },
      hint: {
        en: "`ip helper-address 10.0.0.2` on Gi0/0 and on Gi0/1: the interfaces where the broadcasts arrive, not the one facing R2.",
        hi: "Gi0/0 aur Gi0/1 dono par `ip helper-address 10.0.0.2` do: yeh woh interfaces hain jahan broadcasts aate hain, R2 wala interface nahi.",
      },
      check: [
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/0", has: "^ ip helper-address 10\\.0\\.0\\.2$" },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/1", has: "^ ip helper-address 10\\.0\\.0\\.2$" },
      ],
    },
    {
      text: {
        en: "Both PCs renew and get a lease, and each can ping the DHCP server at 10.0.0.2.",
        hi: "Dono PCs renew karke lease lein, aur dono 10.0.0.2 par DHCP server ko ping kar sakein.",
      },
      hint: {
        en: "On each PC: `ipconfig /renew`, then `ping 10.0.0.2`. Sales-PC should get 192.168.10.11; try pinging HR-PC's address too. `show ip dhcp binding` on R2 lists both leases.",
        hi: "Har PC par `ipconfig /renew`, phir `ping 10.0.0.2` chalao. Sales-PC ko 192.168.10.11 milna chahiye; HR-PC ka address bhi ping karke dekho. R2 par `show ip dhcp binding` dono leases dikhata hai.",
      },
      check: [
        { t: "dhcp", host: "pc1" },
        { t: "dhcp", host: "pc2" },
        { t: "ping", from: "pc1", to: "10.0.0.2" },
        { t: "ping", from: "pc2", to: "10.0.0.2" },
      ],
    },
  ],
  solution: {
    r2: [
      "ip dhcp excluded-address 192.168.10.1 192.168.10.10",
      "ip dhcp excluded-address 192.168.20.1 192.168.20.10",
      "ip dhcp pool SALES", "network 192.168.10.0 255.255.255.0", "default-router 192.168.10.1", "dns-server 8.8.8.8",
      "ip dhcp pool HR", "network 192.168.20.0 255.255.255.0", "default-router 192.168.20.1", "dns-server 8.8.8.8",
      "exit",
      "ip route 192.168.10.0 255.255.255.0 10.0.0.1",
      "ip route 192.168.20.0 255.255.255.0 10.0.0.1",
    ],
    r1: ["interface g0/0", "ip helper-address 10.0.0.2", "interface g0/1", "ip helper-address 10.0.0.2"],
    pc1: ["ipconfig /renew", "ping 10.0.0.2"],
    pc2: ["ipconfig /renew", "ping 10.0.0.2", "ping 192.168.10.11"],
  },
  debrief: {
    en: "Routers don't forward broadcasts, so a DHCP server on another subnet never hears a client unless the gateway relays it. `ip helper-address` goes on the interface facing the clients; the relay fills in its own address there (giaddr), and the server uses it to pick the right pool. The server also needs a route back to that subnet.",
    hi: "Routers broadcasts forward nahi karte, isliye doosre subnet ka DHCP server client ko tab tak nahi sunta jab tak gateway relay na kare. `ip helper-address` clients wale interface par lagta hai; relay wahan apna address (giaddr) bharta hai, aur server usi se sahi pool chunta hai. Server ko us subnet tak wapas ka route bhi chahiye.",
  },
};

export default lab;
