import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "routing-troubleshoot",
  title: { en: "Troubleshoot: users can't reach the file server", hi: "Troubleshoot: users file server tak nahi pahunch pa rahe" },
  level: "intermediate",
  kind: "troubleshoot",
  minutes: 30,
  lessons: ["static-routing", "troubleshooting-method", "life-of-a-packet"],
  scenario: {
    en: "A ticket from the users floor says: \"Nobody can open the intranet page on 192.168.30.10 since this morning's change window. Pings time out.\" Both users say the same thing, and both can ping their own gateway 192.168.10.1. The server sits two routers past R1, and everything uses static routes. Follow the packet hop by hop, find every fault, and fix it.",
    hi: "Users floor se ticket aaya hai: \"Aaj subah ke change window ke baad se koi bhi 192.168.30.10 par intranet page nahi khol pa raha. Pings time out ho rahe hain.\" Dono users yahi keh rahe hain, aur dono apna gateway 192.168.10.1 ping kar paate hain. Server R1 ke baad do routers door hai, aur sab kuch static routes par chalta hai. Packet ko hop by hop follow karo, har fault dhoondho aur theek karo.",
  },
  devices: [
    { id: "sw1", kind: "switch", hostname: "SW1", x: 140, y: 110, note: "Users floor" },
    { id: "r1", kind: "router", hostname: "R1", x: 300, y: 110, note: "Users gateway", config: [
      "interface g0/0", "ip address 10.0.12.1 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 192.168.10.1 255.255.255.0", "no shutdown",
      "ip route 0.0.0.0 0.0.0.0 10.0.12.2",
    ] },
    { id: "r2", kind: "router", hostname: "R2", x: 460, y: 110, note: "Core", config: [
      "interface g0/0", "ip address 10.0.12.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 10.0.23.1 255.255.255.252", "no shutdown",
      "ip route 192.168.10.0 255.255.255.0 10.0.12.1",
      "ip route 192.168.30.0 255.255.255.0 10.0.12.1",
    ] },
    { id: "r3", kind: "router", hostname: "R3", x: 630, y: 110, note: "Server room", config: [
      "interface g0/0", "ip address 10.0.23.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 192.168.30.1 255.255.255.0", "no shutdown",
    ] },
    { id: "pc1", kind: "pc", hostname: "User-1", x: 70, y: 270, host: { ip: "192.168.10.11", prefix: 24, gateway: "192.168.10.1" }, note: "192.168.10.11" },
    { id: "pc2", kind: "pc", hostname: "User-2", x: 220, y: 270, host: { ip: "192.168.10.12", prefix: 24, gateway: "192.168.10.254" }, note: "192.168.10.12" },
    { id: "srv", kind: "server", hostname: "Intranet", x: 630, y: 270, host: { ip: "192.168.30.10", prefix: 24, gateway: "192.168.30.1", services: ["http"] }, note: "192.168.30.10" },
  ],
  links: [
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/2"],
    ["sw1", "GigabitEthernet0/1", "r1", "GigabitEthernet0/1"],
    ["r1", "GigabitEthernet0/0", "r2", "GigabitEthernet0/0"],
    ["r2", "GigabitEthernet0/1", "r3", "GigabitEthernet0/0"],
    ["srv", "FastEthernet0", "r3", "GigabitEthernet0/1"],
  ],
  tasks: [
    {
      text: { en: "R2 must forward traffic for the server LAN 192.168.30.0/24 towards R3. Prove it with a ping from R2 to the server.", hi: "R2 ko server LAN 192.168.30.0/24 ka traffic R3 ki taraf forward karna chahiye. R2 se server ko ping karke prove karo." },
      hint: {
        en: "Run `traceroute 192.168.30.10` on R1 and watch where the packet goes after R2. Then read `show ip route static` on R2: does the next hop point forward or back? Remove the bad route with `no ip route ...` and add the right one.",
        hi: "R1 par `traceroute 192.168.30.10` chalao aur dekho R2 ke baad packet kahan jaata hai. Phir R2 par `show ip route static` padho: next hop aage ki taraf hai ya peeche ki taraf? Galat route `no ip route ...` se hatao aur sahi wala daalo.",
      },
      check: [
        { t: "config", dev: "r2", has: "^ip route 192\\.168\\.30\\.0 255\\.255\\.255\\.0 10\\.0\\.12\\.1$", not: true },
        { t: "ping", from: "r2", to: "192.168.30.10" },
      ],
    },
    {
      text: { en: "The server's replies must find their way back to the users LAN. User-1 must be able to ping the server.", hi: "Server ke replies ko users LAN tak wapas ka raasta milna chahiye. User-1 server ko ping kar sake." },
      hint: {
        en: "A ping needs a route in both directions. Check `show ip route` on R3: does it know 192.168.10.0/24? Add `ip route` towards R2 (10.0.23.1).",
        hi: "Ping ko dono directions mein route chahiye. R3 par `show ip route` dekho: kya use 192.168.10.0/24 pata hai? R2 (10.0.23.1) ki taraf `ip route` daalo.",
      },
      check: { t: "ping", from: "pc1", to: "192.168.30.10" },
    },
    {
      text: { en: "User-2 still can't reach the server, even though User-1 can. Fix User-2.", hi: "User-1 pahunch pa raha hai, lekin User-2 abhi bhi server tak nahi pahunch pa raha. User-2 ko theek karo." },
      hint: {
        en: "Same LAN, same routers, different result: the problem is on the PC. Compare `ipconfig` on both users, then set it with `ipconfig <ip> <mask> <gateway>`.",
        hi: "Same LAN, same routers, phir bhi alag result: matlab problem PC par hai. Dono users par `ipconfig` compare karo, phir `ipconfig <ip> <mask> <gateway>` se sahi settings do.",
      },
      check: { t: "ping", from: "pc2", to: "192.168.30.10" },
    },
    {
      text: { en: "Close the ticket: both users can open the intranet page.", hi: "Ticket close karo: dono users intranet page khol sakein." },
      hint: {
        en: "On each user run `curl http://192.168.30.10`. You should get HTTP 200 OK.",
        hi: "Har user par `curl http://192.168.30.10` chalao. Jawab mein HTTP 200 OK aana chahiye.",
      },
      check: [
        { t: "tcp", from: "pc1", to: "192.168.30.10", port: 80 },
        { t: "tcp", from: "pc2", to: "192.168.30.10", port: 80 },
      ],
    },
  ],
  solution: {
    r2: ["no ip route 192.168.30.0 255.255.255.0 10.0.12.1", "ip route 192.168.30.0 255.255.255.0 10.0.23.2"],
    r3: ["ip route 192.168.10.0 255.255.255.0 10.0.23.1"],
    pc2: ["ipconfig 192.168.10.12 255.255.255.0 192.168.10.1"],
  },
  debrief: {
    en: "Three faults: R2 sent server traffic back to R1 (a routing loop until the TTL ran out), R3 had no route back to the users, and User-2 had the wrong default gateway. Work hop by hop with traceroute and `show ip route`, and always check the return path: one-way routes look fine in the table and still fail every ping.",
    hi: "Teen faults the: R2 server ka traffic wapas R1 ko bhej raha tha (TTL khatam hone tak routing loop), R3 ke paas users tak wapas ka route nahi tha, aur User-2 ka default gateway galat tha. Traceroute aur `show ip route` ke saath hop by hop kaam karo, aur return path hamesha check karo: one-way routes table mein theek dikhte hain phir bhi har ping fail karte hain.",
  },
};

export default lab;
