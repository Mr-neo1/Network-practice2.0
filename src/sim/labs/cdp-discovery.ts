import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "cdp-discovery",
  title: { en: "Map an undocumented network with CDP", hi: "CDP se bina documentation wale network ka map banao" },
  level: "beginner",
  kind: "build",
  minutes: 20,
  lessons: ["cdp-lldp"],
  scenario: {
    en: "You've inherited a small office network with no documentation and no interface descriptions. Before anyone changes anything, use CDP to find out which port connects to which device, label the ports so the next engineer doesn't have to guess, and stop CDP leaking device details out of ports where it isn't needed: user desks and the link to the ISP.",
    hi: "Tumhe ek chhota office network mila hai jiska koi documentation nahi hai aur interfaces par koi description bhi nahi. Koi kuch badle usse pehle CDP se pata karo ki kaunsa port kis device se juda hai, ports par label lagao taaki agle engineer ko guess na karna pade, aur jahan zaroorat nahi wahan CDP ko device ki details bahar bhejne se roko: user desks aur ISP wala link.",
  },
  devices: [
    { id: "isp", kind: "router", hostname: "ISP", x: 650, y: 70, locked: true, config: ["interface g0/0", "ip address 203.0.113.1 255.255.255.252", "no shutdown"] },
    { id: "r1", kind: "router", hostname: "R1", x: 400, y: 70, config: [
      "interface g0/0", "ip address 203.0.113.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 192.168.1.1 255.255.255.0", "no shutdown",
    ] },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 400, y: 205 },
    { id: "sw2", kind: "switch", hostname: "SW2", x: 150, y: 205 },
    { id: "sw3", kind: "switch", hostname: "SW3", x: 650, y: 205 },
    { id: "pc1", kind: "pc", hostname: "Desk-1", x: 290, y: 340, host: { ip: "192.168.1.21", prefix: 24, gateway: "192.168.1.1" } },
    { id: "pc2", kind: "pc", hostname: "Desk-2", x: 510, y: 340, host: { ip: "192.168.1.22", prefix: 24, gateway: "192.168.1.1" } },
  ],
  links: [
    ["r1", "GigabitEthernet0/0", "isp", "GigabitEthernet0/0"],
    ["r1", "GigabitEthernet0/1", "sw1", "GigabitEthernet0/2"],
    ["sw1", "FastEthernet0/24", "sw2", "GigabitEthernet0/1"],
    ["sw1", "GigabitEthernet0/1", "sw3", "FastEthernet0/23"],
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/5"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/9"],
  ],
  height: 410,
  tasks: [
    {
      text: {
        en: "On SW1, find the ports that lead to R1, SW2 and SW3, and describe them exactly as \"Uplink to R1\", \"Link to SW2\" and \"Link to SW3\".",
        hi: "SW1 par woh ports dhoondho jo R1, SW2 aur SW3 tak jaate hain, aur unki description bilkul \"Uplink to R1\", \"Link to SW2\" aur \"Link to SW3\" rakho.",
      },
      hint: {
        en: "`show cdp neighbors` on SW1: the Local Intrfce column is SW1's port, Port ID is the neighbour's port. Then e.g. `interface g0/2` and `description Uplink to R1`.",
        hi: "SW1 par `show cdp neighbors` chalao: Local Intrfce column SW1 ka apna port hai, aur Port ID neighbour ka port. Phir jaise `interface g0/2` aur `description Uplink to R1`.",
      },
      check: [
        { t: "config", dev: "sw1", section: "interface GigabitEthernet0/2", has: "^ description Uplink to R1$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/24", has: "^ description Link to SW2$" },
        { t: "config", dev: "sw1", section: "interface GigabitEthernet0/1", has: "^ description Link to SW3$" },
      ],
    },
    {
      text: {
        en: "On R1, describe the port to SW1 as \"Link to SW1\" and the port to the ISP as \"Uplink to ISP\".",
        hi: "R1 par SW1 wale port ki description \"Link to SW1\" aur ISP wale port ki description \"Uplink to ISP\" rakho.",
      },
      hint: {
        en: "Run `show cdp neighbors` on R1 too; the ISP router shows up there. Then use the `description` command, and check your descriptions in `show running-config`.",
        hi: "R1 par bhi `show cdp neighbors` chalao; ISP ka router wahan dikhega. Phir `description` command do, aur `show running-config` mein apni descriptions check karo.",
      },
      check: [
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/1", has: "^ description Link to SW1$" },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/0", has: "^ description Uplink to ISP$" },
      ],
    },
    {
      text: {
        en: "SW1 has two user desks plugged in. Find their ports and turn CDP off on just those two, leaving CDP running on the switch and its uplinks.",
        hi: "SW1 par do user desks lage hain. Unke ports dhoondho aur sirf un dono par CDP band karo; switch par aur uske uplinks par CDP chalta rehna chahiye.",
      },
      hint: {
        en: "PCs don't speak CDP, so compare `show interfaces status` (ports that are connected) with `show cdp neighbors`. The connected ports with no CDP neighbour are the desks. Then `no cdp enable` on each, not `no cdp run`.",
        hi: "PCs CDP nahi bolte, isliye `show interfaces status` (jo ports connected hain) ko `show cdp neighbors` se compare karo. Jo connected ports CDP mein nahi dikhte, wahi desks hain. Phir har ek par `no cdp enable` do, `no cdp run` nahi.",
      },
      check: [
        { t: "config", dev: "sw1", section: "interface FastEthernet0/5", has: "^ no cdp enable$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/9", has: "^ no cdp enable$" },
        { t: "config", dev: "sw1", section: "interface GigabitEthernet0/2", has: "no cdp enable", not: true },
        { t: "config", dev: "sw1", has: "^no cdp run$", not: true },
      ],
    },
    {
      text: { en: "Don't advertise R1 to the ISP: turn CDP off on R1's ISP-facing port only.", hi: "ISP ko R1 ki details mat bhejo: sirf R1 ke ISP wale port par CDP band karo." },
      hint: {
        en: "`interface g0/0` and `no cdp enable` on R1. `show cdp neighbors` on R1 should then list only SW1.",
        hi: "R1 par `interface g0/0` mein jao aur `no cdp enable` do. Uske baad R1 par `show cdp neighbors` mein sirf SW1 dikhna chahiye.",
      },
      check: [
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/0", has: "^ no cdp enable$" },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/1", has: "no cdp enable", not: true },
        { t: "config", dev: "r1", has: "^no cdp run$", not: true },
      ],
    },
  ],
  solution: {
    sw1: [
      "do show cdp neighbors",
      "interface g0/2", "description Uplink to R1",
      "interface f0/24", "description Link to SW2",
      "interface g0/1", "description Link to SW3",
      "interface f0/5", "no cdp enable",
      "interface f0/9", "no cdp enable",
    ],
    r1: ["interface g0/1", "description Link to SW1", "interface g0/0", "description Uplink to ISP", "no cdp enable"],
  },
  debrief: {
    en: "CDP is on by default on Cisco gear and tells any neighbour your hostname, model, IOS version and addresses. It's great for mapping a network you didn't build, but switch it off per port (`no cdp enable`) where users or other companies connect. `no cdp run` turns it off for the whole device. LLDP is the open-standard version and is off by default (`lldp run`).",
    hi: "Cisco devices par CDP default se on hota hai aur kisi bhi neighbour ko tumhara hostname, model, IOS version aur addresses bata deta hai. Jo network tumne nahi banaya uska map banane ke liye yeh bahut kaam ka hai, lekin jahan users ya doosri company jude hon wahan port par (`no cdp enable`) band kar do. `no cdp run` poore device par band kar deta hai. LLDP iska open-standard version hai aur default se off hota hai (`lldp run`).",
  },
};

export default lab;
