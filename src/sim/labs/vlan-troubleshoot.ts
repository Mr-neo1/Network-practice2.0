import type { CliLab } from "../lab.ts";

const vlans = ["vlan 10", "name SALES", "vlan 20", "name HR", "vlan 99", "name NATIVE", "exit"];

const lab: CliLab = {
  id: "vlan-troubleshoot",
  title: { en: "Troubleshoot: HR can't reach HR across floors", hi: "Troubleshoot: HR ek floor se doosre floor ke HR tak nahi pahunch raha" },
  level: "intermediate",
  kind: "troubleshoot",
  minutes: 30,
  lessons: ["vlans", "trunking", "troubleshooting-method"],
  scenario: {
    en: "A ticket from HR after the weekend office move: \"HR-2 and HR-3 on floor 2 can't open anything on HR-1 downstairs. HR-3 can't even reach HR-2 at the next desk.\" Sales on both floors say everything works. Company standard: Sales is VLAN 10, HR is VLAN 20, and every trunk uses native VLAN 99 and allows only VLANs 10, 20 and 99. Look before you change anything.",
    hi: "Weekend ke office move ke baad HR ka ticket: \"Floor 2 par HR-2 aur HR-3 neeche wale HR-1 par kuch bhi nahi khol pa rahe. HR-3 toh bagal wali desk ke HR-2 tak bhi nahi pahunch pa raha.\" Dono floors ke Sales wale kehte hain sab theek chal raha hai. Company standard: Sales VLAN 10 hai, HR VLAN 20 hai, aur har trunk ka native VLAN 99 hota hai aur usme sirf VLAN 10, 20 aur 99 allowed hote hain. Kuch bhi badalne se pehle dekho.",
  },
  devices: [
    { id: "sw1", kind: "switch", hostname: "SW1", x: 160, y: 110, note: "Floor 1", config: [
      ...vlans,
      "interface f0/1", "switchport mode access", "switchport access vlan 10",
      "interface f0/2", "switchport mode access", "switchport access vlan 20",
      "interface g0/1", "switchport mode trunk", "switchport trunk native vlan 99", "switchport trunk allowed vlan 10,99", "switchport nonegotiate",
    ] },
    { id: "sw2", kind: "switch", hostname: "SW2", x: 560, y: 110, note: "Floor 2", config: [
      ...vlans,
      "interface f0/1", "switchport mode access", "switchport access vlan 10",
      "interface f0/2", "switchport mode access", "switchport access vlan 20",
      "interface f0/3", "switchport mode access", "switchport access vlan 10",
      "interface g0/1", "switchport mode trunk", "switchport trunk allowed vlan 10,20,99", "switchport nonegotiate",
    ] },
    { id: "pc1", kind: "pc", hostname: "Sales-1", x: 90, y: 270, host: { ip: "192.168.10.11", prefix: 24 }, note: "192.168.10.11" },
    { id: "pc2", kind: "pc", hostname: "HR-1", x: 230, y: 270, host: { ip: "192.168.20.11", prefix: 24 }, note: "192.168.20.11" },
    { id: "pc3", kind: "pc", hostname: "Sales-2", x: 420, y: 270, host: { ip: "192.168.10.12", prefix: 24 }, note: "192.168.10.12" },
    { id: "pc4", kind: "pc", hostname: "HR-2", x: 560, y: 270, host: { ip: "192.168.20.12", prefix: 24 }, note: "192.168.20.12" },
    { id: "pc5", kind: "pc", hostname: "HR-3", x: 700, y: 270, host: { ip: "192.168.20.13", prefix: 24 }, note: "192.168.20.13" },
  ],
  links: [
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/2"],
    ["sw1", "GigabitEthernet0/1", "sw2", "GigabitEthernet0/1"],
    ["pc3", "FastEthernet0", "sw2", "FastEthernet0/1"],
    ["pc4", "FastEthernet0", "sw2", "FastEthernet0/2"],
    ["pc5", "FastEthernet0", "sw2", "FastEthernet0/3"],
  ],
  tasks: [
    {
      text: { en: "HR-2 on floor 2 must be able to ping HR-1 on floor 1.", hi: "Floor 2 ka HR-2, floor 1 ke HR-1 ko ping kar sake." },
      hint: {
        en: "Run `show interfaces trunk` on both switches and compare the \"Vlans allowed on trunk\" lines. A VLAN must be allowed on both ends. `switchport trunk allowed vlan add <id>` adds one without retyping the list.",
        hi: "Dono switches par `show interfaces trunk` chalao aur \"Vlans allowed on trunk\" wali lines compare karo. VLAN dono ends par allowed hona chahiye. `switchport trunk allowed vlan add <id>` se poori list dobara type kiye bina ek VLAN jod sakte ho.",
      },
      check: { t: "ping", from: "pc4", to: "192.168.20.11" },
    },
    {
      text: { en: "HR-3 must be in the HR VLAN and reach both HR-2 and HR-1.", hi: "HR-3 ko HR VLAN mein hona chahiye aur HR-2 aur HR-1 dono tak pahunchna chahiye." },
      hint: {
        en: "`show vlan brief` on SW2 lists which ports sit in which VLAN. Fix the port with `interface f0/3` and `switchport access vlan 20`.",
        hi: "SW2 par `show vlan brief` dikhata hai kaunsa port kis VLAN mein hai. Galat port ko `interface f0/3` aur `switchport access vlan 20` se theek karo.",
      },
      check: [
        { t: "access", dev: "sw2", iface: "FastEthernet0/3", vlan: 20 },
        { t: "ping", from: "pc5", to: "192.168.20.12" },
        { t: "ping", from: "pc5", to: "192.168.20.11" },
      ],
    },
    {
      text: {
        en: "Bring the uplink in line with the standard: native VLAN 99 and only VLANs 10, 20 and 99 allowed, on both ends.",
        hi: "Uplink ko standard ke hisaab se set karo: dono ends par native VLAN 99 aur sirf VLAN 10, 20 aur 99 allowed.",
      },
      hint: {
        en: "Compare the Native vlan column of `show interfaces trunk` on SW1 and SW2. A native VLAN mismatch silently joins two different VLANs together. Fix it with `switchport trunk native vlan 99`.",
        hi: "SW1 aur SW2 par `show interfaces trunk` ka Native vlan column compare karo. Native VLAN mismatch chupchaap do alag VLANs ko jod deta hai. `switchport trunk native vlan 99` se theek karo.",
      },
      check: [
        { t: "trunk", dev: "sw1", iface: "GigabitEthernet0/1", native: 99, allowed: [10, 20, 99] },
        { t: "trunk", dev: "sw2", iface: "GigabitEthernet0/1", native: 99, allowed: [10, 20, 99] },
      ],
    },
    {
      text: { en: "Make sure you didn't break Sales: Sales-2 can still ping Sales-1.", hi: "Confirm karo ki Sales nahi toota: Sales-2 abhi bhi Sales-1 ko ping kar sake." },
      hint: { en: "From Sales-2 run `ping 192.168.10.11`.", hi: "Sales-2 se `ping 192.168.10.11` chalao aur reply aana chahiye." },
      check: { t: "ping", from: "pc3", to: "192.168.10.11" },
    },
  ],
  solution: {
    sw1: ["interface g0/1", "switchport trunk allowed vlan add 20"],
    sw2: ["interface g0/1", "switchport trunk native vlan 99", "interface f0/3", "switchport access vlan 20"],
  },
  debrief: {
    en: "Three faults: VLAN 20 missing from SW1's allowed list, a native VLAN mismatch (99 on SW1, 1 on SW2), and HR-3's port left in VLAN 10. `show interfaces trunk` and `show vlan brief` on both switches find all three in a minute. Always compare both ends of a trunk.",
    hi: "Teen faults the: SW1 ki allowed list mein VLAN 20 nahi tha, native VLAN mismatch tha (SW1 par 99, SW2 par 1), aur HR-3 ka port VLAN 10 mein reh gaya tha. Dono switches par `show interfaces trunk` aur `show vlan brief` ek minute mein teeno dikha dete hain. Trunk ke dono ends hamesha compare karo.",
  },
};

export default lab;
