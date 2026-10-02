import type { CliLab } from "../lab.ts";

const trunk = (ifname: string) => [`interface ${ifname}`, "switchport mode trunk", "switchport nonegotiate"];

const lab: CliLab = {
  id: "stp-root-control",
  title: { en: "Take control of the STP root bridge", hi: "STP root bridge ko apne control mein lo" },
  level: "intermediate",
  kind: "build",
  minutes: 25,
  lessons: ["stp", "rapid-pvst"],
  scenario: {
    en: "Three switches form a triangle: the distribution switch DSW1 and two access switches. Nobody ever set a bridge priority, so the root bridge is simply whichever switch has the lowest MAC address, and right now that is not DSW1. The network lead wants a predictable design: DSW1 as root for VLAN 1 and VLAN 10, ASW1 as the backup root, Rapid PVST+ everywhere, and user ports that come up at once but shut themselves if someone plugs in a switch.",
    hi: "Teen switches ek triangle banate hain: distribution switch DSW1 aur do access switches. Kisi ne kabhi bridge priority set nahi ki, isliye root bridge woh switch hai jiska MAC address sabse chhota hai, aur abhi woh DSW1 nahi hai. Network lead ko predictable design chahiye: VLAN 1 aur VLAN 10 ke liye DSW1 root ho, ASW1 backup root ho, har jagah Rapid PVST+ chale, aur user ports turant up hon lekin koi switch lagaye toh khud band ho jaayein.",
  },
  devices: [
    { id: "dsw1", kind: "l3switch", hostname: "DSW1", x: 400, y: 70, note: "Distribution", config: [
      "vlan 10", "name STAFF", "exit",
      "interface g1/0/1", "switchport trunk encapsulation dot1q", "switchport mode trunk", "switchport nonegotiate",
      "interface g1/0/2", "switchport trunk encapsulation dot1q", "switchport mode trunk", "switchport nonegotiate",
    ] },
    { id: "asw1", kind: "switch", hostname: "ASW1", x: 220, y: 216, note: "Access", config: [
      "vlan 10", "name STAFF", "exit",
      ...trunk("g0/1"), ...trunk("g0/2"),
      "interface f0/1", "switchport mode access", "switchport access vlan 10",
    ] },
    { id: "asw2", kind: "switch", hostname: "ASW2", x: 580, y: 216, note: "Access", config: [
      "vlan 10", "name STAFF", "exit",
      ...trunk("g0/1"), ...trunk("g0/2"),
      "interface f0/1", "switchport mode access", "switchport access vlan 10",
    ] },
    { id: "pc1", kind: "pc", hostname: "Staff-1", x: 100, y: 351, host: { ip: "192.168.10.11", prefix: 24 }, note: "192.168.10.11" },
    { id: "pc2", kind: "pc", hostname: "Staff-2", x: 700, y: 351, host: { ip: "192.168.10.12", prefix: 24 }, note: "192.168.10.12" },
  ],
  links: [
    ["dsw1", "GigabitEthernet1/0/1", "asw1", "GigabitEthernet0/1"],
    ["dsw1", "GigabitEthernet1/0/2", "asw2", "GigabitEthernet0/1"],
    ["asw1", "GigabitEthernet0/2", "asw2", "GigabitEthernet0/2"],
    ["pc1", "FastEthernet0", "asw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "asw2", "FastEthernet0/1"],
  ],
  height: 421,
  tasks: [
    {
      text: {
        en: "First find out which switch is root for VLAN 1 and VLAN 10 today, and which port is blocking. Then run Rapid PVST+ on all three switches.",
        hi: "Pehle pata karo ki aaj VLAN 1 aur VLAN 10 ka root kaunsa switch hai, aur kaunsa port block ho raha hai. Phir teeno switches par Rapid PVST+ chalao.",
      },
      hint: {
        en: "`show spanning-tree vlan 10` shows the Root ID and each port's role (Root, Desg, Altn). Then `spanning-tree mode rapid-pvst` in global config on DSW1, ASW1 and ASW2.",
        hi: "`show spanning-tree vlan 10` mein Root ID aur har port ka role (Root, Desg, Altn) dikhta hai. Phir DSW1, ASW1 aur ASW2 teeno par global config mein `spanning-tree mode rapid-pvst` do.",
      },
      check: [
        { t: "config", dev: "dsw1", has: "^spanning-tree mode rapid-pvst$" },
        { t: "config", dev: "asw1", has: "^spanning-tree mode rapid-pvst$" },
        { t: "config", dev: "asw2", has: "^spanning-tree mode rapid-pvst$" },
      ],
    },
    {
      text: { en: "Make DSW1 the root bridge for VLAN 1 and VLAN 10.", hi: "DSW1 ko VLAN 1 aur VLAN 10 ka root bridge banao." },
      hint: {
        en: "On DSW1: `spanning-tree vlan 1,10 root primary`. Check with `show spanning-tree vlan 1`: it should say \"This bridge is the root\".",
        hi: "DSW1 par `spanning-tree vlan 1,10 root primary` do. `show spanning-tree vlan 1` se check karo: wahan \"This bridge is the root\" likha aana chahiye.",
      },
      check: [
        { t: "stpRoot", vlan: 1, dev: "dsw1" },
        { t: "stpRoot", vlan: 10, dev: "dsw1" },
      ],
    },
    {
      text: { en: "Make ASW1 the backup root for VLAN 1 and VLAN 10, so it takes over if DSW1 fails.", hi: "ASW1 ko VLAN 1 aur VLAN 10 ka backup root banao, taaki DSW1 fail ho toh woh sambhal le." },
      hint: {
        en: "On ASW1: `spanning-tree vlan 1,10 root secondary`. That sets priority 28672, between DSW1 (24576) and the default 32768.",
        hi: "ASW1 par `spanning-tree vlan 1,10 root secondary` do. Isse priority 28672 ho jaati hai, jo DSW1 (24576) aur default 32768 ke beech mein hai.",
      },
      check: [
        { t: "config", dev: "asw1", has: "^spanning-tree vlan 1 priority 28672$" },
        { t: "config", dev: "asw1", has: "^spanning-tree vlan 10 priority 28672$" },
        { t: "stpRoot", vlan: 10, dev: "dsw1" },
      ],
    },
    {
      text: {
        en: "On the user port Fa0/1 of both access switches, turn on PortFast and BPDU Guard. The uplinks must stay as they are, and Staff-1 must still reach Staff-2.",
        hi: "Dono access switches ke user port Fa0/1 par PortFast aur BPDU Guard on karo. Uplinks jaise hain waise hi rehne chahiye, aur Staff-1 se Staff-2 abhi bhi ping hona chahiye.",
      },
      hint: {
        en: "`interface f0/1`, `spanning-tree portfast`, `spanning-tree bpduguard enable`. Never put BPDU Guard on a link to another switch: it would be err-disabled at once. Test with `ping 192.168.10.12` from Staff-1.",
        hi: "`interface f0/1` mein jao, phir `spanning-tree portfast` aur `spanning-tree bpduguard enable`. Doosre switch wale link par BPDU Guard kabhi mat lagao, woh turant err-disabled ho jaayega. Staff-1 se `ping 192.168.10.12` karke test karo.",
      },
      check: [
        { t: "config", dev: "asw1", section: "interface FastEthernet0/1", has: "^ spanning-tree portfast$" },
        { t: "config", dev: "asw1", section: "interface FastEthernet0/1", has: "^ spanning-tree bpduguard enable$" },
        { t: "config", dev: "asw2", section: "interface FastEthernet0/1", has: "^ spanning-tree portfast$" },
        { t: "config", dev: "asw2", section: "interface FastEthernet0/1", has: "^ spanning-tree bpduguard enable$" },
        { t: "up", dev: "dsw1", iface: "GigabitEthernet1/0/1" },
        { t: "up", dev: "dsw1", iface: "GigabitEthernet1/0/2" },
        { t: "up", dev: "asw1", iface: "GigabitEthernet0/2" },
        { t: "ping", from: "pc1", to: "192.168.10.12" },
      ],
    },
  ],
  solution: {
    dsw1: ["spanning-tree mode rapid-pvst", "spanning-tree vlan 1,10 root primary"],
    asw1: ["spanning-tree mode rapid-pvst", "spanning-tree vlan 1,10 root secondary", "interface f0/1", "spanning-tree portfast", "spanning-tree bpduguard enable"],
    asw2: ["spanning-tree mode rapid-pvst", "interface f0/1", "spanning-tree portfast", "spanning-tree bpduguard enable"],
  },
  debrief: {
    en: "Lowest bridge ID wins the root election: priority first (plus the VLAN number), then the lowest MAC. Left alone, an old or random switch can become root, so always set it: `root primary` on the core or distribution switch, `root secondary` on its backup. PortFast is only for edge ports; BPDU Guard err-disables a PortFast port that hears a BPDU, and `shutdown` then `no shutdown` brings it back.",
    hi: "Root election mein sabse chhota bridge ID jeetta hai: pehle priority (plus VLAN number), phir sabse chhota MAC. Chhod doge toh koi purana ya random switch root ban sakta hai, isliye hamesha khud set karo: core ya distribution switch par `root primary`, aur uske backup par `root secondary`. PortFast sirf edge ports ke liye hai; BPDU Guard aise port ko err-disable kar deta hai jis par BPDU aaye, aur `shutdown` phir `no shutdown` se woh wapas aata hai.",
  },
};

export default lab;
