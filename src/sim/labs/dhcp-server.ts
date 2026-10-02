import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "dhcp-server",
  title: { en: "Make the router a DHCP server", hi: "Router ko DHCP server banao" },
  level: "beginner",
  kind: "build",
  minutes: 20,
  lessons: ["dhcp"],
  scenario: {
    en: "A small office has outgrown typing IP addresses by hand. R1 is the gateway for 192.168.10.0/24 and should hand out addresses itself. Keep 192.168.10.1 to 192.168.10.20 for the router, servers and printers (the DNS server already uses 192.168.10.5). The two PCs are already set to get an address automatically.",
    hi: "Chhote office mein ab haath se IP addresses type karna mushkil ho gaya hai. R1 192.168.10.0/24 ka gateway hai aur ab addresses khud baantega. 192.168.10.1 se 192.168.10.20 tak router, servers aur printers ke liye rakho (DNS server pehle se 192.168.10.5 use kar raha hai). Dono PCs pehle se automatic address lene par set hain.",
  },
  devices: [
    { id: "r1", kind: "router", hostname: "R1", x: 400, y: 70, note: "192.168.10.1", config: ["interface g0/0", "ip address 192.168.10.1 255.255.255.0", "no shutdown"] },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 400, y: 205 },
    { id: "pc1", kind: "pc", hostname: "PC-1", x: 160, y: 351, host: { dhcp: true }, note: "DHCP" },
    { id: "pc2", kind: "pc", hostname: "PC-2", x: 400, y: 351, host: { dhcp: true }, note: "DHCP" },
    { id: "srv", kind: "server", hostname: "DNS-Server", x: 640, y: 351, host: { ip: "192.168.10.5", prefix: 24, gateway: "192.168.10.1", services: ["dns"] }, note: "192.168.10.5" },
  ],
  links: [
    ["r1", "GigabitEthernet0/0", "sw1", "GigabitEthernet0/1"],
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/2"],
    ["srv", "FastEthernet0", "sw1", "FastEthernet0/3"],
  ],
  height: 421,
  tasks: [
    {
      text: { en: "On R1, exclude 192.168.10.1 to 192.168.10.20 from DHCP.", hi: "R1 par 192.168.10.1 se 192.168.10.20 tak ke addresses DHCP se exclude karo." },
      hint: {
        en: "`ip dhcp excluded-address 192.168.10.1 192.168.10.20` in global config. Do this before the PCs ask, so they never get a reserved address.",
        hi: "Global config mein `ip dhcp excluded-address 192.168.10.1 192.168.10.20` do. Yeh PCs ke request karne se pehle karo, taaki unhe kabhi reserved address na mile.",
      },
      check: { t: "config", dev: "r1", has: "^ip dhcp excluded-address 192\\.168\\.10\\.1 192\\.168\\.10\\.20$" },
    },
    {
      text: {
        en: "Create a pool named LAN10 for 192.168.10.0/24 with default gateway 192.168.10.1 and DNS server 192.168.10.5.",
        hi: "LAN10 naam ka pool banao, 192.168.10.0/24 ke liye, jisme default gateway 192.168.10.1 aur DNS server 192.168.10.5 ho.",
      },
      hint: {
        en: "`ip dhcp pool LAN10`, then `network 192.168.10.0 255.255.255.0`, `default-router 192.168.10.1`, `dns-server 192.168.10.5`.",
        hi: "`ip dhcp pool LAN10` mein jao, phir `network 192.168.10.0 255.255.255.0`, `default-router 192.168.10.1` aur `dns-server 192.168.10.5` do.",
      },
      check: [
        { t: "config", dev: "r1", section: "ip dhcp pool LAN10", has: "^ network 192\\.168\\.10\\.0 255\\.255\\.255\\.0$" },
        { t: "config", dev: "r1", section: "ip dhcp pool LAN10", has: "^ default-router 192\\.168\\.10\\.1$" },
        { t: "config", dev: "r1", section: "ip dhcp pool LAN10", has: "^ dns-server 192\\.168\\.10\\.5$" },
      ],
    },
    {
      text: { en: "Get both PCs an address from R1.", hi: "Dono PCs ko R1 se address dilwao." },
      hint: {
        en: "On each PC run `ipconfig /renew`, then `ipconfig /all` to see the address, gateway and DNS. On R1, `show ip dhcp binding` lists the leases.",
        hi: "Har PC par `ipconfig /renew` chalao, phir `ipconfig /all` se address, gateway aur DNS dekho. R1 par `show ip dhcp binding` saari leases dikhata hai.",
      },
      check: [
        { t: "dhcp", host: "pc1" },
        { t: "dhcp", host: "pc2" },
      ],
    },
    {
      text: { en: "Prove the leases work: both PCs can ping the gateway, and PC-1 can ping the DNS server.", hi: "Prove karo ki leases sahi hain: dono PCs gateway ko ping kar sakein, aur PC-1 DNS server ko." },
      hint: {
        en: "`ping 192.168.10.1` from each PC and `ping 192.168.10.5` from PC-1. If the gateway is wrong, check `default-router` in the pool and renew again.",
        hi: "Har PC se `ping 192.168.10.1` aur PC-1 se `ping 192.168.10.5` chalao. Gateway galat aaye toh pool mein `default-router` check karo aur dobara renew karo.",
      },
      check: [
        { t: "ping", from: "pc1", to: "192.168.10.1" },
        { t: "ping", from: "pc2", to: "192.168.10.1" },
        { t: "ping", from: "pc1", to: "192.168.10.5" },
      ],
    },
  ],
  solution: {
    r1: [
      "ip dhcp excluded-address 192.168.10.1 192.168.10.20",
      "ip dhcp pool LAN10", "network 192.168.10.0 255.255.255.0", "default-router 192.168.10.1", "dns-server 192.168.10.5",
    ],
    pc1: ["ipconfig /renew", "ipconfig /all", "ping 192.168.10.1", "ping 192.168.10.5"],
    pc2: ["ipconfig /renew", "ping 192.168.10.1"],
  },
  debrief: {
    en: "A DHCP pool needs at least a `network`; without `default-router` the PCs get an address but can't leave their subnet. Excluded addresses are global on the router, not per pool. The client's steps are Discover, Offer, Request, Acknowledge (DORA), and `show ip dhcp binding` shows who got what.",
    hi: "DHCP pool mein kam se kam `network` zaroori hai; `default-router` ke bina PCs ko address toh milta hai lekin woh apne subnet se bahar nahi ja sakte. Excluded addresses router par global hote hain, har pool ke liye alag nahi. Client ke steps hain Discover, Offer, Request, Acknowledge (DORA), aur `show ip dhcp binding` batata hai kis ko kaunsa address mila.",
  },
};

export default lab;
