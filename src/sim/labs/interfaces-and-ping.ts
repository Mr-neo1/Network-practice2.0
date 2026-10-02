import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "interfaces-and-ping",
  title: { en: "Bring up a router and ping between two LANs", hi: "Router ko up karo aur do LANs ke beech ping karo" },
  level: "beginner",
  kind: "build",
  minutes: 20,
  lessons: ["ipv4-addressing", "routing-basics"],
  scenario: {
    en: "A small office has two rooms, each with its own switch and one PC, and a router cabled to both switches. Nothing has an address yet and the router ports are still shut down. Room A uses 192.168.1.0/24 and Room B uses 192.168.2.0/24, with the router as .1 in each. Get the two PCs talking to each other.",
    hi: "Ek chhote office mein do rooms hain, har room ka apna switch aur ek PC, aur ek router dono switches se cable se juda hai. Abhi kisi ke paas address nahi hai aur router ke ports abhi bhi shut down hain. Room A 192.168.1.0/24 use karta hai aur Room B 192.168.2.0/24, dono mein router .1 hai. Dono PCs ko aapas mein baat karwao.",
  },
  devices: [
    { id: "r1", kind: "router", hostname: "R1", x: 400, y: 70, note: "Gi0/0 .1.1 | Gi0/1 .2.1" },
    { id: "sw1", kind: "switch", hostname: "SW-A", x: 220, y: 205, note: "Room A" },
    { id: "sw2", kind: "switch", hostname: "SW-B", x: 580, y: 205, note: "Room B" },
    { id: "pc1", kind: "pc", hostname: "PC1", x: 220, y: 354, note: "192.168.1.10" },
    { id: "pc2", kind: "pc", hostname: "PC2", x: 580, y: 354, note: "192.168.2.10" },
  ],
  height: 424,
  links: [
    ["r1", "GigabitEthernet0/0", "sw1", "GigabitEthernet0/1"],
    ["r1", "GigabitEthernet0/1", "sw2", "GigabitEthernet0/1"],
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw2", "FastEthernet0/1"],
  ],
  tasks: [
    {
      text: { en: "Give R1's Gi0/0 the address 192.168.1.1/24 and bring it up.", hi: "R1 ke Gi0/0 ko 192.168.1.1/24 address do aur use up karo." },
      hint: {
        en: "`interface g0/0`, `ip address 192.168.1.1 255.255.255.0`, `no shutdown`. Router ports start shut down.",
        hi: "`interface g0/0` mein jao, phir `ip address 192.168.1.1 255.255.255.0` aur `no shutdown`. Router ke ports shuru mein shut down hote hain.",
      },
      check: [
        { t: "up", dev: "r1", iface: "GigabitEthernet0/0" },
        { t: "route", dev: "r1", prefix: "192.168.1.0/24", code: "C" },
      ],
    },
    {
      text: { en: "Give R1's Gi0/1 the address 192.168.2.1/24 and bring it up.", hi: "R1 ke Gi0/1 ko 192.168.2.1/24 address do aur use bhi up karo." },
      hint: {
        en: "Same steps on `interface g0/1`. Then `show ip interface brief` should show both ports up/up.",
        hi: "`interface g0/1` par wahi steps karo. Phir `show ip interface brief` mein dono ports up/up dikhne chahiye.",
      },
      check: [
        { t: "up", dev: "r1", iface: "GigabitEthernet0/1" },
        { t: "route", dev: "r1", prefix: "192.168.2.0/24", code: "C" },
      ],
    },
    {
      text: {
        en: "Set PC1 to 192.168.1.10/24 and PC2 to 192.168.2.10/24, each with the router as its default gateway. Each PC must be able to ping its gateway.",
        hi: "PC1 ko 192.168.1.10/24 aur PC2 ko 192.168.2.10/24 do, aur dono ka default gateway router ho. Har PC apne gateway ko ping kar sake.",
      },
      hint: {
        en: "On PC1: `ipconfig 192.168.1.10 255.255.255.0 192.168.1.1`, then `ping 192.168.1.1`. Do the same on PC2 with its own subnet.",
        hi: "PC1 par: `ipconfig 192.168.1.10 255.255.255.0 192.168.1.1`, phir `ping 192.168.1.1`. PC2 par bhi yahi karo, lekin uske apne subnet ke saath.",
      },
      check: [
        { t: "ping", from: "pc1", to: "192.168.1.1" },
        { t: "ping", from: "pc2", to: "192.168.2.1" },
      ],
    },
    {
      text: { en: "Prove it: PC1 can ping PC2.", hi: "Prove karo: PC1 se PC2 ping ho." },
      hint: {
        en: "From PC1 run `ping 192.168.2.10`. If it fails, `tracert 192.168.2.10` and `ipconfig` on both PCs show which side is missing.",
        hi: "PC1 se `ping 192.168.2.10` chalao. Fail ho toh `tracert 192.168.2.10` aur dono PCs par `ipconfig` dekho, pata chalega kis taraf kya missing hai.",
      },
      check: [
        { t: "ping", from: "pc1", to: "192.168.2.10" },
        { t: "ping", from: "pc2", to: "192.168.1.10" },
      ],
    },
  ],
  solution: {
    r1: [
      "interface g0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown",
      "interface g0/1", "ip address 192.168.2.1 255.255.255.0", "no shutdown",
    ],
    pc1: ["ipconfig 192.168.1.10 255.255.255.0 192.168.1.1"],
    pc2: ["ipconfig 192.168.2.10 255.255.255.0 192.168.2.1"],
  },
  debrief: {
    en: "A router interface needs an address and `no shutdown`; once it is up, its subnet appears in the routing table as connected (C). A PC needs three things to leave its own subnet: an address, the right mask, and a default gateway in the same subnet.",
    hi: "Router interface ko address aur `no shutdown` dono chahiye; up hote hi uska subnet routing table mein connected (C) ban kar aa jaata hai. PC ko apne subnet se bahar jaane ke liye teen cheezein chahiye: address, sahi mask, aur usi subnet mein default gateway.",
  },
};

export default lab;
