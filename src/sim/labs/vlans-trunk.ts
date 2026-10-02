import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "vlans-trunk",
  title: { en: "VLANs across two switches with an 802.1Q trunk", hi: "Do switches par VLANs, 802.1Q trunk ke saath" },
  level: "beginner",
  kind: "build",
  minutes: 25,
  lessons: ["vlans", "trunking"],
  scenario: {
    en: "Sales and HR sit on both floors. Each floor has its own switch, joined by one uplink. Put Sales in VLAN 10 and HR in VLAN 20 on both switches, and carry both VLANs over the uplink as a trunk with an unused native VLAN, so each department can reach its own people upstairs and nobody else.",
    hi: "Sales aur HR dono floors par baithe hain. Har floor ka apna switch hai, aur dono ek uplink se jude hain. Dono switches par Sales ko VLAN 10 aur HR ko VLAN 20 mein daalo, aur uplink ko trunk banao jiska native VLAN unused ho, taaki har department sirf apne logon tak pahunch sake, kisi aur tak nahi.",
  },
  devices: [
    { id: "sw1", kind: "switch", hostname: "SW1", x: 250, y: 110, note: "Floor 1" },
    { id: "sw2", kind: "switch", hostname: "SW2", x: 550, y: 110, note: "Floor 2" },
    { id: "pc1", kind: "pc", hostname: "Sales-1", x: 120, y: 270, host: { ip: "192.168.10.11", prefix: 24 }, note: "192.168.10.11" },
    { id: "pc2", kind: "pc", hostname: "HR-1", x: 330, y: 270, host: { ip: "192.168.20.11", prefix: 24 }, note: "192.168.20.11" },
    { id: "pc3", kind: "pc", hostname: "Sales-2", x: 470, y: 270, host: { ip: "192.168.10.12", prefix: 24 }, note: "192.168.10.12" },
    { id: "pc4", kind: "pc", hostname: "HR-2", x: 680, y: 270, host: { ip: "192.168.20.12", prefix: 24 }, note: "192.168.20.12" },
  ],
  links: [
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/2"],
    ["sw1", "GigabitEthernet0/1", "sw2", "GigabitEthernet0/1"],
    ["pc3", "FastEthernet0", "sw2", "FastEthernet0/1"],
    ["pc4", "FastEthernet0", "sw2", "FastEthernet0/2"],
  ],
  tasks: [
    {
      text: { en: "On both switches create VLAN 10 named SALES, VLAN 20 named HR and VLAN 99 named NATIVE.", hi: "Dono switches par VLAN 10 (naam SALES), VLAN 20 (naam HR) aur VLAN 99 (naam NATIVE) banao." },
      hint: { en: "`vlan 10` then `name SALES`, and the same for 20 and 99. Check with `show vlan brief`.", hi: "`vlan 10` phir `name SALES`, aur 20 aur 99 ke liye bhi yahi. `show vlan brief` se check karo." },
      check: [
        { t: "vlan", dev: "sw1", id: 10, name: "SALES" },
        { t: "vlan", dev: "sw1", id: 20, name: "HR" },
        { t: "vlan", dev: "sw1", id: 99, name: "NATIVE" },
        { t: "vlan", dev: "sw2", id: 10, name: "SALES" },
        { t: "vlan", dev: "sw2", id: 20, name: "HR" },
        { t: "vlan", dev: "sw2", id: 99, name: "NATIVE" },
      ],
    },
    {
      text: { en: "Make Fa0/1 an access port in VLAN 10 and Fa0/2 an access port in VLAN 20, on both switches.", hi: "Dono switches par Fa0/1 ko VLAN 10 ka access port aur Fa0/2 ko VLAN 20 ka access port banao." },
      hint: { en: "`interface f0/1`, `switchport mode access`, `switchport access vlan 10`.", hi: "Pehle `interface f0/1`, phir `switchport mode access` aur `switchport access vlan 10`. Fa0/2 ke liye VLAN 20 use karo." },
      check: [
        { t: "access", dev: "sw1", iface: "FastEthernet0/1", vlan: 10 },
        { t: "access", dev: "sw1", iface: "FastEthernet0/2", vlan: 20 },
        { t: "access", dev: "sw2", iface: "FastEthernet0/1", vlan: 10 },
        { t: "access", dev: "sw2", iface: "FastEthernet0/2", vlan: 20 },
      ],
    },
    {
      text: {
        en: "Make Gi0/1 a static trunk on both switches: native VLAN 99, only VLANs 10, 20 and 99 allowed, DTP turned off.",
        hi: "Dono switches par Gi0/1 ko static trunk banao: native VLAN 99, sirf VLAN 10, 20 aur 99 allowed, aur DTP band.",
      },
      hint: {
        en: "`switchport mode trunk`, `switchport trunk native vlan 99`, `switchport trunk allowed vlan 10,20,99`, `switchport nonegotiate`. Verify with `show interfaces trunk`.",
        hi: "`switchport mode trunk`, `switchport trunk native vlan 99`, `switchport trunk allowed vlan 10,20,99`, `switchport nonegotiate`. `show interfaces trunk` se verify karo.",
      },
      check: [
        { t: "trunk", dev: "sw1", iface: "GigabitEthernet0/1", native: 99, allowed: [10, 20, 99] },
        { t: "trunk", dev: "sw2", iface: "GigabitEthernet0/1", native: 99, allowed: [10, 20, 99] },
        { t: "config", dev: "sw1", section: "interface GigabitEthernet0/1", has: "switchport nonegotiate" },
        { t: "config", dev: "sw2", section: "interface GigabitEthernet0/1", has: "switchport nonegotiate" },
      ],
    },
    {
      text: { en: "Prove it: Sales-1 can ping Sales-2, and HR-1 can ping HR-2.", hi: "Prove karo: Sales-1 se Sales-2 ping ho, aur HR-1 se HR-2." },
      hint: { en: "Open Sales-1 and run `ping 192.168.10.12`. If it fails, check both ends of the trunk with `show interfaces trunk`.", hi: "Sales-1 kholo aur `ping 192.168.10.12` chalao. Fail ho toh trunk ke dono ends `show interfaces trunk` se check karo." },
      check: [
        { t: "ping", from: "pc1", to: "192.168.10.12" },
        { t: "ping", from: "pc2", to: "192.168.20.12" },
      ],
    },
    {
      text: { en: "Save the configuration on both switches.", hi: "Dono switches ki configuration save karo." },
      hint: { en: "`copy running-config startup-config` in privileged EXEC (or `do copy running-config startup-config` from config mode).", hi: "Privileged EXEC mein `copy running-config startup-config` (config mode se ho toh `do copy running-config startup-config`)." },
      check: [
        { t: "saved", dev: "sw1" },
        { t: "saved", dev: "sw2" },
      ],
    },
  ],
  solution: {
    sw1: [
      "vlan 10", "name SALES", "vlan 20", "name HR", "vlan 99", "name NATIVE", "exit",
      "interface f0/1", "switchport mode access", "switchport access vlan 10",
      "interface f0/2", "switchport mode access", "switchport access vlan 20",
      "interface g0/1", "switchport mode trunk", "switchport trunk native vlan 99", "switchport trunk allowed vlan 10,20,99", "switchport nonegotiate",
      "end", "copy running-config startup-config",
    ],
    sw2: [
      "vlan 10", "name SALES", "vlan 20", "name HR", "vlan 99", "name NATIVE", "exit",
      "interface f0/1", "switchport mode access", "switchport access vlan 10",
      "interface f0/2", "switchport mode access", "switchport access vlan 20",
      "interface g0/1", "switchport mode trunk", "switchport trunk native vlan 99", "switchport trunk allowed vlan 10,20,99", "switchport nonegotiate",
      "end", "copy running-config startup-config",
    ],
  },
  debrief: {
    en: "Both ends of a trunk must agree on the native VLAN and allow the same VLANs, or traffic quietly disappears. Turning DTP off with a static trunk means the link never changes mode on its own.",
    hi: "Trunk ke dono ends ka native VLAN same hona chahiye aur allowed VLANs bhi same, warna traffic chupchaap gayab ho jaata hai. Static trunk ke saath DTP band karne ka matlab hai link apne aap mode kabhi nahi badlega.",
  },
};

export default lab;
