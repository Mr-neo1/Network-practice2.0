import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "static-routes",
  title: { en: "Static routes across three routers", hi: "Teen routers ke paar static routes" },
  level: "beginner",
  kind: "build",
  minutes: 20,
  lessons: ["static-routing", "routing-basics"],
  scenario: {
    en: "The office LAN 192.168.1.0/24 sits behind R1 and the warehouse LAN 192.168.3.0/24 sits behind R3, with R2 in the middle. Every interface already has its address, but no router knows about any network it isn't directly connected to, so the two PCs can't talk. Add static routes so they can.",
    hi: "Office LAN 192.168.1.0/24 R1 ke peeche hai aur warehouse LAN 192.168.3.0/24 R3 ke peeche, aur beech mein R2 hai. Har interface par address pehle se laga hai, lekin koi bhi router un networks ke baare mein nahi jaanta jo usse directly connected nahi hain, isliye dono PCs baat nahi kar pa rahe. Static routes daalo taaki baat ho sake.",
  },
  devices: [
    { id: "r1", kind: "router", hostname: "R1", x: 150, y: 110, note: "Office", config: [
      "interface g0/0", "ip address 10.0.12.1 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 192.168.1.1 255.255.255.0", "no shutdown",
    ] },
    { id: "r2", kind: "router", hostname: "R2", x: 400, y: 110, note: "Core", config: [
      "interface g0/0", "ip address 10.0.12.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 10.0.23.1 255.255.255.252", "no shutdown",
    ] },
    { id: "r3", kind: "router", hostname: "R3", x: 650, y: 110, note: "Warehouse", config: [
      "interface g0/0", "ip address 10.0.23.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 192.168.3.1 255.255.255.0", "no shutdown",
    ] },
    { id: "pc1", kind: "pc", hostname: "Office-PC", x: 150, y: 270, host: { ip: "192.168.1.10", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.10" },
    { id: "pc2", kind: "pc", hostname: "Warehouse-PC", x: 650, y: 270, host: { ip: "192.168.3.10", prefix: 24, gateway: "192.168.3.1" }, note: "192.168.3.10" },
  ],
  links: [
    ["r1", "GigabitEthernet0/0", "r2", "GigabitEthernet0/0"],
    ["r2", "GigabitEthernet0/1", "r3", "GigabitEthernet0/0"],
    ["pc1", "FastEthernet0", "r1", "GigabitEthernet0/1"],
    ["pc2", "FastEthernet0", "r3", "GigabitEthernet0/1"],
  ],
  tasks: [
    {
      text: { en: "On R1, add a static route to the warehouse LAN 192.168.3.0/24 through R2 (10.0.12.2).", hi: "R1 par warehouse LAN 192.168.3.0/24 ke liye static route daalo, R2 (10.0.12.2) ke through." },
      hint: {
        en: "`ip route 192.168.3.0 255.255.255.0 10.0.12.2`. The next hop must be an address R1 can reach directly. Check with `show ip route static`.",
        hi: "`ip route 192.168.3.0 255.255.255.0 10.0.12.2` chalao. Next hop aisa address hona chahiye jo R1 ko seedha dikhta ho. `show ip route static` se check karo.",
      },
      check: { t: "route", dev: "r1", prefix: "192.168.3.0/24", code: "S" },
    },
    {
      text: { en: "On R3, add a static route back to the office LAN 192.168.1.0/24 through R2 (10.0.23.1).", hi: "R3 par office LAN 192.168.1.0/24 ke liye wapas ka static route daalo, R2 (10.0.23.1) ke through." },
      hint: {
        en: "`ip route 192.168.1.0 255.255.255.0 10.0.23.1`. Replies need a route home just as much as requests need a route out.",
        hi: "`ip route 192.168.1.0 255.255.255.0 10.0.23.1` do. Request ko jaane ke liye route chahiye, toh reply ko bhi wapas aane ke liye utna hi zaroori hai.",
      },
      check: { t: "route", dev: "r3", prefix: "192.168.1.0/24", code: "S" },
    },
    {
      text: { en: "R2 sits in the middle and knows neither LAN. Give it a static route to each one.", hi: "R2 beech mein hai aur dono mein se koi LAN nahi jaanta. Use har LAN ke liye ek static route do." },
      hint: {
        en: "`ip route 192.168.1.0 255.255.255.0 10.0.12.1` and `ip route 192.168.3.0 255.255.255.0 10.0.23.2`. Every router on the path needs its own route.",
        hi: "`ip route 192.168.1.0 255.255.255.0 10.0.12.1` aur `ip route 192.168.3.0 255.255.255.0 10.0.23.2` daalo. Path ke har router ko apna khud ka route chahiye.",
      },
      check: [
        { t: "route", dev: "r2", prefix: "192.168.1.0/24", code: "S" },
        { t: "route", dev: "r2", prefix: "192.168.3.0/24", code: "S" },
      ],
    },
    {
      text: { en: "Prove it: Office-PC and Warehouse-PC can ping each other.", hi: "Prove karo: Office-PC aur Warehouse-PC ek doosre ko ping kar sakein." },
      hint: {
        en: "From Office-PC run `ping 192.168.3.10`, and from Warehouse-PC `ping 192.168.1.10`. If it fails, `tracert` shows the last router that knew the way.",
        hi: "Office-PC se `ping 192.168.3.10` aur Warehouse-PC se `ping 192.168.1.10` chalao. Fail ho toh `tracert` dikhayega ki kaunsa aakhri router raasta jaanta tha.",
      },
      check: [
        { t: "ping", from: "pc1", to: "192.168.3.10" },
        { t: "ping", from: "pc2", to: "192.168.1.10" },
      ],
    },
  ],
  solution: {
    r1: ["ip route 192.168.3.0 255.255.255.0 10.0.12.2"],
    r3: ["ip route 192.168.1.0 255.255.255.0 10.0.23.1"],
    r2: ["ip route 192.168.1.0 255.255.255.0 10.0.12.1", "ip route 192.168.3.0 255.255.255.0 10.0.23.2"],
  },
  debrief: {
    en: "A router only knows its connected networks until you tell it more. Every router along the path needs a route to the destination, and the path back needs routes too: a ping fails just as surely when the reply has nowhere to go.",
    hi: "Router sirf apne connected networks jaanta hai jab tak tum use aur kuch na batao. Path ke har router ko destination ka route chahiye, aur wapas aane wale path ke liye bhi routes chahiye: reply ko jaane ki jagah na mile toh bhi ping utna hi fail hota hai.",
  },
};

export default lab;
