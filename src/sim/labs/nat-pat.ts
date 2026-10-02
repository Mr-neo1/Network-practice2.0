import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "nat-pat",
  title: { en: "Get the office online with PAT (NAT overload)", hi: "PAT (NAT overload) se office ko internet par lao" },
  level: "intermediate",
  kind: "build",
  minutes: 25,
  lessons: ["nat"],
  scenario: {
    en: "The office LAN 192.168.1.0/24 sits behind R1, and the ISP has given you one public address, 203.0.113.2, on the link to its router. Staff complain that nothing outside works. The ISP will never route private addresses back to you, so R1 must send the office out to the internet (the ISP's test address 198.51.100.1) and hide every PC behind its one public address.",
    hi: "Office LAN 192.168.1.0/24 R1 ke peeche hai, aur ISP ne apne router wale link par tumhe sirf ek public address diya hai, 203.0.113.2. Staff ki shikayat hai ki bahar kuch bhi kaam nahi karta. ISP private addresses ka route kabhi wapas nahi dega, isliye R1 ko office ko internet (ISP ka test address 198.51.100.1) tak bhejna hai aur har PC ko apne ek public address ke peeche chhupana hai.",
  },
  devices: [
    { id: "pc1", kind: "pc", hostname: "Office-PC1", x: 110, y: 100, host: { ip: "192.168.1.10", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.10" },
    { id: "pc2", kind: "pc", hostname: "Office-PC2", x: 110, y: 270, host: { ip: "192.168.1.11", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.11" },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 270, y: 185 },
    {
      id: "r1", kind: "router", hostname: "R1", x: 440, y: 185, note: "Gi0/0 203.0.113.2",
      config: [
        "interface g0/1", "ip address 192.168.1.1 255.255.255.0", "no shutdown",
        "interface g0/0", "ip address 203.0.113.2 255.255.255.252", "no shutdown",
      ],
    },
    {
      id: "isp", kind: "router", hostname: "ISP", x: 640, y: 185, note: "Lo0 198.51.100.1", locked: true,
      config: [
        "interface g0/0", "ip address 203.0.113.1 255.255.255.252", "no shutdown",
        "interface lo0", "ip address 198.51.100.1 255.255.255.255",
      ],
    },
  ],
  links: [
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/2"],
    ["sw1", "GigabitEthernet0/1", "r1", "GigabitEthernet0/1"],
    ["r1", "GigabitEthernet0/0", "isp", "GigabitEthernet0/0"],
  ],
  tasks: [
    {
      text: {
        en: "Give R1 a default route to the ISP (next hop 203.0.113.1). R1 itself should now ping 198.51.100.1, while the PCs still can't.",
        hi: "R1 par ISP ki taraf default route do (next hop 203.0.113.1). Ab R1 khud 198.51.100.1 ping kar lega, lekin PCs abhi bhi nahi kar payenge.",
      },
      hint: {
        en: "`ip route 0.0.0.0 0.0.0.0 203.0.113.1`, then `do ping 198.51.100.1`. A PC's ping still fails: the ISP has no route back to 192.168.1.0/24.",
        hi: "`ip route 0.0.0.0 0.0.0.0 203.0.113.1` do, phir `do ping 198.51.100.1` chalao. PC ka ping abhi bhi fail hoga, kyunki ISP ke paas 192.168.1.0/24 ka route wapas nahi hai.",
      },
      check: [
        { t: "route", dev: "r1", prefix: "0.0.0.0/0", code: "S*" },
        { t: "ping", from: "r1", to: "198.51.100.1" },
      ],
    },
    {
      text: {
        en: "Create standard ACL 1 that matches the office LAN 192.168.1.0/24. NAT will use it to decide which inside addresses get translated.",
        hi: "Standard ACL 1 banao jo office LAN 192.168.1.0/24 ko match kare. NAT isi se decide karega ki kaunse inside addresses translate honge.",
      },
      hint: {
        en: "`access-list 1 permit 192.168.1.0 0.0.0.255`. The wildcard is the inverse of the /24 mask.",
        hi: "`access-list 1 permit 192.168.1.0 0.0.0.255` likho. Wildcard /24 mask ka ulta hota hai.",
      },
      check: { t: "config", dev: "r1", has: "^access-list 1 permit 192\\.168\\.1\\.0 0\\.0\\.0\\.255$" },
    },
    {
      text: {
        en: "Tell R1 which side is which: Gi0/1 (the office LAN) is NAT inside and Gi0/0 (towards the ISP) is NAT outside.",
        hi: "R1 ko batao kaunsi side kaunsi hai: Gi0/1 (office LAN) NAT inside hai aur Gi0/0 (ISP ki taraf) NAT outside.",
      },
      hint: {
        en: "`interface g0/1` then `ip nat inside`; `interface g0/0` then `ip nat outside`.",
        hi: "`interface g0/1` mein jaakar `ip nat inside` do, aur `interface g0/0` mein `ip nat outside`.",
      },
      check: [
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/1", has: "^ ip nat inside$" },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/0", has: "^ ip nat outside$" },
      ],
    },
    {
      text: {
        en: "Turn on PAT: translate everything ACL 1 matches to the address of Gi0/0, with overload. Office-PC1 must now ping 198.51.100.1.",
        hi: "PAT on karo: ACL 1 jo bhi match kare use Gi0/0 ke address par overload ke saath translate karo. Ab Office-PC1 se 198.51.100.1 ping hona chahiye.",
      },
      hint: {
        en: "`ip nat inside source list 1 interface g0/0 overload` in global config. Then on Office-PC1: `ping 198.51.100.1`.",
        hi: "Global config mein `ip nat inside source list 1 interface g0/0 overload` do. Phir Office-PC1 par `ping 198.51.100.1` chalao.",
      },
      check: [
        { t: "config", dev: "r1", has: "^ip nat inside source list 1 interface GigabitEthernet0/0 overload$" },
        { t: "ping", from: "pc1", to: "198.51.100.1" },
      ],
    },
    {
      text: {
        en: "Ping 198.51.100.1 from both PCs, then run `show ip nat translations` on R1. Both inside local addresses share the one inside global 203.0.113.2; only the port numbers tell them apart.",
        hi: "Dono PCs se 198.51.100.1 ping karo, phir R1 par `show ip nat translations` chalao. Dono inside local addresses ek hi inside global 203.0.113.2 share karte hain; unhe sirf port numbers alag karte hain.",
      },
      hint: {
        en: "On each PC: `ping 198.51.100.1`. On R1: `show ip nat translations` (from config mode, `do show ip nat translations`).",
        hi: "Har PC par `ping 198.51.100.1` chalao. R1 par `show ip nat translations` dekho (config mode se ho toh `do show ip nat translations`).",
      },
      check: [
        { t: "ping", from: "pc1", to: "198.51.100.1" },
        { t: "ping", from: "pc2", to: "198.51.100.1" },
      ],
    },
  ],
  solution: {
    r1: [
      "ip route 0.0.0.0 0.0.0.0 203.0.113.1",
      "access-list 1 permit 192.168.1.0 0.0.0.255",
      "interface g0/1", "ip nat inside",
      "interface g0/0", "ip nat outside",
      "exit",
      "ip nat inside source list 1 interface g0/0 overload",
    ],
    pc1: ["ping 198.51.100.1"],
    pc2: ["ping 198.51.100.1"],
  },
  debrief: {
    en: "PAT needs four pieces: a route out, an ACL that picks the inside addresses, inside and outside interfaces, and the `overload` rule. The ISP only ever sees 203.0.113.2; R1 keeps a table of inside local address and port to inside global address and port, so it knows which PC each reply belongs to.",
    hi: "PAT ke liye chaar cheezein chahiye: bahar jaane ka route, ek ACL jo inside addresses chune, inside aur outside interfaces, aur `overload` wala rule. ISP ko sirf 203.0.113.2 dikhta hai; R1 inside local address aur port se inside global address aur port ki ek table rakhta hai, isliye use pata hota hai ki har reply kis PC ka hai.",
  },
};

export default lab;
