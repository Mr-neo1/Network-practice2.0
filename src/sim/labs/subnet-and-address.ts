import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "subnet-and-address",
  title: { en: "Plan with VLSM, then address and route", hi: "VLSM se plan karo, phir address aur route karo" },
  level: "intermediate",
  kind: "build",
  minutes: 35,
  lessons: ["subnetting", "vlsm"],
  scenario: {
    en: "A new branch gets one block, 192.168.50.0/24, and needs: Sales with 60 hosts, Support with 25 hosts, a Lab with 10 hosts, and a point-to-point link between R1 and R2. Plan it with VLSM: biggest subnet first, each one starting right where the last ended, from 192.168.50.0. Routers take the first usable address of each LAN and the PCs take the last usable. On the link, R1 takes the first usable and R2 the second. The routers and PCs are factory fresh.",
    hi: "Nayi branch ko ek block mila hai, 192.168.50.0/24, aur zaroorat hai: Sales ke 60 hosts, Support ke 25 hosts, Lab ke 10 hosts, aur R1 aur R2 ke beech ek point-to-point link. VLSM se plan karo: sabse bada subnet pehle, aur har subnet wahin se shuru jahan pichhla khatam hua, 192.168.50.0 se. Har LAN ka pehla usable address router lega aur aakhri usable PC lega. Link par pehla usable R1 lega aur doosra R2. Routers aur PCs bilkul factory fresh hain.",
  },
  devices: [
    { id: "r1", kind: "router", hostname: "R1", x: 270, y: 110, note: "Sales + Support" },
    { id: "r2", kind: "router", hostname: "R2", x: 580, y: 110, note: "Lab" },
    { id: "pca", kind: "pc", hostname: "Sales-PC", x: 120, y: 270, note: "Sales (60 hosts)" },
    { id: "pcb", kind: "pc", hostname: "Support-PC", x: 320, y: 270, note: "Support (25 hosts)" },
    { id: "pcc", kind: "pc", hostname: "Lab-PC", x: 580, y: 270, note: "Lab (10 hosts)" },
  ],
  links: [
    ["pca", "FastEthernet0", "r1", "GigabitEthernet0/0"],
    ["pcb", "FastEthernet0", "r1", "GigabitEthernet0/1"],
    ["r1", "GigabitEthernet0/2", "r2", "GigabitEthernet0/1"],
    ["pcc", "FastEthernet0", "r2", "GigabitEthernet0/0"],
  ],
  tasks: [
    {
      text: {
        en: "Address R1 and bring the interfaces up: Gi0/0 is Sales, Gi0/1 is Support, Gi0/2 is the link to R2. Use the first usable address of each subnet.",
        hi: "R1 par address lagao aur interfaces up karo: Gi0/0 Sales hai, Gi0/1 Support hai, Gi0/2 R2 wala link hai. Har subnet ka pehla usable address use karo.",
      },
      hint: {
        en: "60 hosts need a /26 (62 usable): 192.168.50.0/26. 25 hosts need a /27: 192.168.50.64/27. 10 hosts need a /28: 192.168.50.96/28. The link is a /30: 192.168.50.112/30. So R1 gets `ip address 192.168.50.1 255.255.255.192`, `192.168.50.65 255.255.255.224` and `192.168.50.113 255.255.255.252`, each followed by `no shutdown`.",
        hi: "60 hosts ke liye /26 chahiye (62 usable): 192.168.50.0/26. 25 hosts ke liye /27: 192.168.50.64/27. 10 hosts ke liye /28: 192.168.50.96/28. Link ek /30 hai: 192.168.50.112/30. Isliye R1 ko `ip address 192.168.50.1 255.255.255.192`, `192.168.50.65 255.255.255.224` aur `192.168.50.113 255.255.255.252` milenge, har ek ke baad `no shutdown`.",
      },
      check: [
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/0", has: "ip address 192\\.168\\.50\\.1 255\\.255\\.255\\.192$" },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/1", has: "ip address 192\\.168\\.50\\.65 255\\.255\\.255\\.224$" },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/2", has: "ip address 192\\.168\\.50\\.113 255\\.255\\.255\\.252$" },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/0", has: "^ shutdown$", not: true },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/1", has: "^ shutdown$", not: true },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/2", has: "^ shutdown$", not: true },
      ],
    },
    {
      text: {
        en: "Address R2 and bring its interfaces up: Gi0/0 is the Lab (first usable), Gi0/1 is the link to R1 (second usable). R1 must be able to ping R2 across the link.",
        hi: "R2 par address lagao aur uske interfaces up karo: Gi0/0 Lab hai (pehla usable), Gi0/1 R1 wala link hai (doosra usable). R1 link ke paar R2 ko ping kar sake.",
      },
      hint: {
        en: "Gi0/0: `ip address 192.168.50.97 255.255.255.240`. Gi0/1: `ip address 192.168.50.114 255.255.255.252`. Don't forget `no shutdown`, then `ping 192.168.50.114` from R1.",
        hi: "Gi0/0 par `ip address 192.168.50.97 255.255.255.240`, Gi0/1 par `ip address 192.168.50.114 255.255.255.252`. `no shutdown` mat bhoolna, phir R1 se `ping 192.168.50.114` karo.",
      },
      check: [
        { t: "config", dev: "r2", section: "interface GigabitEthernet0/0", has: "ip address 192\\.168\\.50\\.97 255\\.255\\.255\\.240$" },
        { t: "config", dev: "r2", section: "interface GigabitEthernet0/1", has: "ip address 192\\.168\\.50\\.114 255\\.255\\.255\\.252$" },
        { t: "ping", from: "r1", to: "192.168.50.114" },
      ],
    },
    {
      text: {
        en: "Give each PC the last usable address of its LAN, the right mask, and its router as the default gateway.",
        hi: "Har PC ko uske LAN ka aakhri usable address, sahi mask, aur uska router default gateway ki tarah do.",
      },
      hint: {
        en: "The last usable is one below the broadcast. Sales-PC: `ipconfig 192.168.50.62 255.255.255.192 192.168.50.1`. Support-PC: `ipconfig 192.168.50.94 255.255.255.224 192.168.50.65`. Lab-PC: `ipconfig 192.168.50.110 255.255.255.240 192.168.50.97`.",
        hi: "Aakhri usable broadcast se ek kam hota hai. Sales-PC par `ipconfig 192.168.50.62 255.255.255.192 192.168.50.1`, Support-PC par `ipconfig 192.168.50.94 255.255.255.224 192.168.50.65`, aur Lab-PC par `ipconfig 192.168.50.110 255.255.255.240 192.168.50.97` do.",
      },
      check: [
        { t: "ping", from: "r1", to: "192.168.50.62" },
        { t: "ping", from: "r1", to: "192.168.50.94" },
        { t: "ping", from: "r2", to: "192.168.50.110" },
      ],
    },
    {
      text: {
        en: "Add static routes: R1 needs one route to the Lab subnet, and R2 needs one route to each of the Sales and Support subnets, all across the link.",
        hi: "Static routes daalo: R1 ko Lab subnet ka ek route chahiye, aur R2 ko Sales aur Support dono subnets ka ek ek route, sab link ke paar.",
      },
      hint: {
        en: "R1: `ip route 192.168.50.96 255.255.255.240 192.168.50.114`. R2: `ip route 192.168.50.0 255.255.255.192 192.168.50.113` and `ip route 192.168.50.64 255.255.255.224 192.168.50.113`.",
        hi: "R1 par `ip route 192.168.50.96 255.255.255.240 192.168.50.114` do. R2 par `ip route 192.168.50.0 255.255.255.192 192.168.50.113` aur `ip route 192.168.50.64 255.255.255.224 192.168.50.113` do.",
      },
      check: [
        { t: "route", dev: "r1", prefix: "192.168.50.96/28", code: "S" },
        { t: "route", dev: "r2", prefix: "192.168.50.0/26", code: "S" },
        { t: "route", dev: "r2", prefix: "192.168.50.64/27", code: "S" },
      ],
    },
    {
      text: { en: "Prove it: Sales-PC and Support-PC can both ping Lab-PC, and Sales-PC can ping Support-PC.", hi: "Prove karo: Sales-PC aur Support-PC dono Lab-PC ko ping kar sakein, aur Sales-PC Support-PC ko ping kar sake." },
      hint: {
        en: "From Sales-PC: `ping 192.168.50.110` and `ping 192.168.50.94`. From Support-PC: `ping 192.168.50.110`. A wrong mask or gateway on a PC shows up here.",
        hi: "Sales-PC se `ping 192.168.50.110` aur `ping 192.168.50.94` chalao. Support-PC se `ping 192.168.50.110`. PC par mask ya gateway galat hai toh yahin pata chalega.",
      },
      check: [
        { t: "ping", from: "pca", to: "192.168.50.110" },
        { t: "ping", from: "pcb", to: "192.168.50.110" },
        { t: "ping", from: "pca", to: "192.168.50.94" },
      ],
    },
  ],
  solution: {
    r1: [
      "interface g0/0", "ip address 192.168.50.1 255.255.255.192", "no shutdown",
      "interface g0/1", "ip address 192.168.50.65 255.255.255.224", "no shutdown",
      "interface g0/2", "ip address 192.168.50.113 255.255.255.252", "no shutdown",
      "exit",
      "ip route 192.168.50.96 255.255.255.240 192.168.50.114",
    ],
    r2: [
      "interface g0/0", "ip address 192.168.50.97 255.255.255.240", "no shutdown",
      "interface g0/1", "ip address 192.168.50.114 255.255.255.252", "no shutdown",
      "exit",
      "ip route 192.168.50.0 255.255.255.192 192.168.50.113",
      "ip route 192.168.50.64 255.255.255.224 192.168.50.113",
    ],
    pca: ["ipconfig 192.168.50.62 255.255.255.192 192.168.50.1"],
    pcb: ["ipconfig 192.168.50.94 255.255.255.224 192.168.50.65"],
    pcc: ["ipconfig 192.168.50.110 255.255.255.240 192.168.50.97"],
  },
  debrief: {
    en: "VLSM in order: /26 at .0 (hosts .1-.62), /27 at .64 (.65-.94), /28 at .96 (.97-.110), /30 at .112 (.113-.114). Allocating the biggest subnet first keeps every block on its natural boundary and leaves .116-.255 free for growth. Every subnet's mask must match on the router, the PC and the static routes, or traffic breaks in confusing ways.",
    hi: "VLSM order mein: .0 par /26 (hosts .1-.62), .64 par /27 (.65-.94), .96 par /28 (.97-.110), .112 par /30 (.113-.114). Sabse bada subnet pehle dene se har block apni natural boundary par rehta hai aur .116-.255 growth ke liye free bachta hai. Har subnet ka mask router, PC aur static routes teeno par match hona chahiye, warna traffic ajeeb tareeke se fail hota hai.",
  },
};

export default lab;
