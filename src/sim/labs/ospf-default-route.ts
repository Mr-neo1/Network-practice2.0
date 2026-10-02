import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "ospf-default-route",
  title: { en: "Send the internet default route through OSPF", hi: "Internet ka default route OSPF se bhejo" },
  level: "intermediate",
  kind: "build",
  minutes: 25,
  lessons: ["ospf-config", "static-routing"],
  scenario: {
    en: "The new EDGE router connects the office to the ISP over 203.0.113.0/30. CORE already runs OSPF for the user LAN, but EDGE doesn't, and nothing inside knows how to reach the internet. Bring EDGE into OSPF, give it a static default route to the ISP, and have OSPF hand that default to CORE so users can reach 8.8.8.8. The ISP router is not yours to touch; it already routes your inside networks back to EDGE.",
    hi: "Naya EDGE router office ko 203.0.113.0/30 par ISP se jodta hai. CORE user LAN ke liye pehle se OSPF chala raha hai, lekin EDGE nahi, aur andar kisi ko nahi pata ki internet tak kaise pahunchna hai. EDGE ko OSPF mein laao, use ISP ki taraf static default route do, aur OSPF se woh default CORE tak bhejo taaki users 8.8.8.8 tak pahunch sakein. ISP router tumhara nahi hai, use mat chhedo; woh pehle se tumhare andar ke networks ko wapas EDGE ki taraf route karta hai.",
  },
  devices: [
    { id: "core", kind: "router", hostname: "CORE", x: 150, y: 110, note: "Inside", config: [
      "interface g0/0", "ip address 10.0.12.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 192.168.20.1 255.255.255.0", "no shutdown",
      "router ospf 1", "router-id 2.2.2.2", "network 10.0.12.0 0.0.0.3 area 0", "network 192.168.20.0 0.0.0.255 area 0", "passive-interface g0/1",
    ] },
    { id: "edge", kind: "router", hostname: "EDGE", x: 400, y: 110, note: "Internet edge", config: [
      "interface g0/0", "description Link to ISP", "ip address 203.0.113.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 10.0.12.1 255.255.255.252", "no shutdown",
    ] },
    { id: "isp", kind: "router", hostname: "ISP", x: 650, y: 110, note: "8.8.8.8 (lo0)", locked: true, config: [
      "interface g0/0", "ip address 203.0.113.1 255.255.255.252", "no shutdown",
      "interface lo0", "ip address 8.8.8.8 255.255.255.255",
      "ip route 192.168.20.0 255.255.255.0 203.0.113.2",
      "ip route 10.0.12.0 255.255.255.252 203.0.113.2",
    ] },
    { id: "pc1", kind: "pc", hostname: "User-PC", x: 150, y: 270, host: { ip: "192.168.20.10", prefix: 24, gateway: "192.168.20.1" }, note: "192.168.20.10" },
  ],
  links: [
    ["core", "GigabitEthernet0/0", "edge", "GigabitEthernet0/1"],
    ["edge", "GigabitEthernet0/0", "isp", "GigabitEthernet0/0"],
    ["pc1", "FastEthernet0", "core", "GigabitEthernet0/1"],
  ],
  tasks: [
    {
      text: {
        en: "Start OSPF process 1 on EDGE with router ID 1.1.1.1 and advertise only the inside link 10.0.12.0/30 in area 0. EDGE must become FULL with CORE.",
        hi: "EDGE par OSPF process 1 start karo, router ID 1.1.1.1 ke saath, aur area 0 mein sirf andar wala link 10.0.12.0/30 advertise karo. EDGE ko CORE ke saath FULL hona chahiye.",
      },
      hint: {
        en: "`router ospf 1`, `router-id 1.1.1.1`, `network 10.0.12.0 0.0.0.3 area 0`. Leave the ISP link out of OSPF. Check `show ip ospf neighbor`.",
        hi: "`router ospf 1`, `router-id 1.1.1.1`, `network 10.0.12.0 0.0.0.3 area 0` do. ISP wale link ko OSPF se bahar rakho. `show ip ospf neighbor` se check karo.",
      },
      check: [
        { t: "config", dev: "edge", section: "router ospf 1", has: "router-id 1\\.1\\.1\\.1$" },
        { t: "config", dev: "edge", section: "router ospf 1", has: "network 203\\.0\\.113\\.", not: true },
        { t: "ospf", dev: "edge", neighbors: 1 },
        { t: "route", dev: "edge", prefix: "192.168.20.0/24", code: "O" },
      ],
    },
    {
      text: { en: "On EDGE, add a static default route to the ISP (next hop 203.0.113.1). EDGE itself must be able to ping 8.8.8.8.", hi: "EDGE par ISP ki taraf static default route daalo (next hop 203.0.113.1). EDGE khud 8.8.8.8 ko ping kar sake." },
      hint: {
        en: "`ip route 0.0.0.0 0.0.0.0 203.0.113.1`, then `do ping 8.8.8.8`.",
        hi: "`ip route 0.0.0.0 0.0.0.0 203.0.113.1` do, phir `do ping 8.8.8.8` chala kar dekho.",
      },
      check: [
        { t: "route", dev: "edge", prefix: "0.0.0.0/0", code: "S*" },
        { t: "ping", from: "edge", to: "8.8.8.8" },
      ],
    },
    {
      text: { en: "Have EDGE advertise its default route into OSPF. CORE must learn it as an O*E2 route.", hi: "EDGE se uska default route OSPF mein advertise karwao. CORE ko yeh O*E2 route ki tarah seekhna chahiye." },
      hint: {
        en: "`default-information originate` under `router ospf 1` on EDGE. It only works while EDGE has a default route itself. On CORE, `show ip route` shows O*E2 and a gateway of last resort.",
        hi: "EDGE par `router ospf 1` ke andar `default-information originate` do. Yeh tabhi kaam karta hai jab EDGE ke paas khud default route ho. CORE par `show ip route` mein O*E2 aur gateway of last resort dikhega.",
      },
      check: [
        { t: "config", dev: "edge", section: "router ospf 1", has: "default-information originate" },
        { t: "route", dev: "core", prefix: "0.0.0.0/0", code: "O*E2" },
      ],
    },
    {
      text: { en: "Prove it: User-PC can ping the internet address 8.8.8.8.", hi: "Prove karo: User-PC internet address 8.8.8.8 ko ping kar sake." },
      hint: {
        en: "From User-PC run `ping 8.8.8.8`. `tracert 8.8.8.8` should go CORE, EDGE, ISP.",
        hi: "User-PC se `ping 8.8.8.8` chalao. `tracert 8.8.8.8` mein path CORE, EDGE, ISP hona chahiye.",
      },
      check: { t: "ping", from: "pc1", to: "8.8.8.8" },
    },
  ],
  solution: {
    edge: ["router ospf 1", "router-id 1.1.1.1", "network 10.0.12.0 0.0.0.3 area 0", "exit", "ip route 0.0.0.0 0.0.0.0 203.0.113.1", "router ospf 1", "default-information originate"],
  },
  debrief: {
    en: "The edge router keeps one static default to the ISP, and `default-information originate` shares it with every OSPF router as an external type 2 route (O*E2). Without `always`, the default is only advertised while the edge router has one, so if the static route goes the inside routers stop sending traffic to a dead exit. Don't run OSPF towards the ISP.",
    hi: "Edge router ISP ki taraf ek static default rakhta hai, aur `default-information originate` use har OSPF router ke saath external type 2 route (O*E2) ki tarah share karta hai. `always` ke bina default tabhi advertise hota hai jab edge router ke paas khud default ho, isliye static route hat jaaye toh andar ke routers band exit ki taraf traffic bhejna rok dete hain. ISP ki taraf OSPF mat chalao.",
  },
};

export default lab;
