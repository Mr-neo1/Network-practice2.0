import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "etherchannel-lacp",
  title: { en: "EtherChannel with LACP: two links, one trunk", hi: "LACP ke saath EtherChannel: do links, ek trunk" },
  level: "intermediate",
  kind: "build",
  minutes: 20,
  lessons: ["etherchannel"],
  scenario: {
    en: "Two switches in the lab are joined by two parallel cables, Gi0/1 to Gi0/1 and Gi0/2 to Gi0/2, but spanning tree would block one of them and the engineers in VLAN 10 still can't reach each other across the switches. Bundle both cables into Port-channel 1 with LACP (SW1 starts the negotiation, SW2 only answers) and carry VLAN 10 over it as a trunk.",
    hi: "Lab ke do switches do parallel cables se jude hain, Gi0/1 se Gi0/1 aur Gi0/2 se Gi0/2, lekin spanning tree inmein se ek ko block kar dega, aur VLAN 10 ke engineers abhi bhi switches ke paar ek doosre tak nahi pahunch pa rahe. Dono cables ko LACP se Port-channel 1 mein bundle karo (SW1 negotiation shuru kare, SW2 sirf jawab de) aur uske upar VLAN 10 ko trunk ki tarah le jao.",
  },
  devices: [
    { id: "sw1", kind: "switch", hostname: "SW1", x: 240, y: 120, config: ["vlan 10", "name ENG", "interface f0/1", "switchport mode access", "switchport access vlan 10"] },
    { id: "sw2", kind: "switch", hostname: "SW2", x: 560, y: 120, config: ["vlan 10", "name ENG", "interface f0/1", "switchport mode access", "switchport access vlan 10"] },
    { id: "pc1", kind: "pc", hostname: "Eng-1", x: 240, y: 270, host: { ip: "192.168.10.11", prefix: 24 }, note: "VLAN 10 .11" },
    { id: "pc2", kind: "pc", hostname: "Eng-2", x: 560, y: 270, host: { ip: "192.168.10.12", prefix: 24 }, note: "VLAN 10 .12" },
  ],
  links: [
    ["sw1", "GigabitEthernet0/1", "sw2", "GigabitEthernet0/1"],
    ["sw1", "GigabitEthernet0/2", "sw2", "GigabitEthernet0/2"],
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw2", "FastEthernet0/1"],
  ],
  tasks: [
    {
      text: { en: "On SW1, put Gi0/1 and Gi0/2 in channel group 1 with LACP in active mode.", hi: "SW1 par Gi0/1 aur Gi0/2 ko channel group 1 mein daalo, LACP active mode ke saath." },
      hint: {
        en: "`interface range g0/1 - 2`, then `channel-group 1 mode active`. Port-channel1 is created for you.",
        hi: "`interface range g0/1 - 2` mein jao, phir `channel-group 1 mode active` do. Port-channel1 apne aap ban jaata hai.",
      },
      check: [
        { t: "config", dev: "sw1", section: "interface GigabitEthernet0/1", has: "channel-group 1 mode active" },
        { t: "config", dev: "sw1", section: "interface GigabitEthernet0/2", has: "channel-group 1 mode active" },
      ],
    },
    {
      text: {
        en: "On SW2, put the same two ports in channel group 1 with LACP in passive mode. The bundle must form on both switches.",
        hi: "SW2 par wahi do ports channel group 1 mein daalo, LACP passive mode ke saath. Bundle dono switches par banna chahiye.",
      },
      hint: {
        en: "`interface range g0/1 - 2`, `channel-group 1 mode passive`. Check `show etherchannel summary`: the ports should show (P) for bundled.",
        hi: "`interface range g0/1 - 2` mein `channel-group 1 mode passive` do. Phir `show etherchannel summary` dekho: ports ke saath (P) dikhna chahiye, matlab bundled.",
      },
      check: [
        { t: "config", dev: "sw2", section: "interface GigabitEthernet0/1", has: "channel-group 1 mode passive" },
        { t: "channel", dev: "sw1", group: 1 },
        { t: "channel", dev: "sw2", group: 1 },
      ],
    },
    {
      text: { en: "Make Port-channel 1 a static trunk on both switches.", hi: "Dono switches par Port-channel 1 ko static trunk banao." },
      hint: {
        en: "`interface port-channel 1`, `switchport mode trunk`. Configure the port-channel, not the member ports; IOS copies the setting down to them. Verify with `show interfaces trunk`.",
        hi: "`interface port-channel 1` mein `switchport mode trunk` do. Member ports ko nahi, port-channel ko configure karo; IOS setting ko members tak khud copy kar deta hai. `show interfaces trunk` se verify karo.",
      },
      check: [
        { t: "trunk", dev: "sw1", iface: "Port-channel1" },
        { t: "trunk", dev: "sw2", iface: "Port-channel1" },
      ],
    },
    {
      text: { en: "Prove it: Eng-1 can ping Eng-2 across the bundle.", hi: "Prove karo: Eng-1 bundle ke paar Eng-2 ko ping kar sake." },
      hint: {
        en: "From Eng-1 run `ping 192.168.10.12`. If it fails, check that VLAN 10 is listed under Po1 in `show interfaces trunk`.",
        hi: "Eng-1 se `ping 192.168.10.12` chalao. Fail ho toh `show interfaces trunk` mein dekho ki Po1 ke neeche VLAN 10 dikh raha hai ya nahi.",
      },
      check: { t: "ping", from: "pc1", to: "192.168.10.12" },
    },
  ],
  solution: {
    sw1: [
      "interface range g0/1 - 2", "channel-group 1 mode active", "exit",
      "interface port-channel 1", "switchport mode trunk",
    ],
    sw2: [
      "interface range g0/1 - 2", "channel-group 1 mode passive", "exit",
      "interface port-channel 1", "switchport mode trunk",
    ],
  },
  debrief: {
    en: "LACP needs at least one side in active mode: active-active and active-passive form a bundle, passive-passive never does. Once the ports are bundled, spanning tree sees one logical link, so both cables carry traffic. Configure trunking on the Port-channel interface so every member stays identical.",
    hi: "LACP mein kam se kam ek side active mode mein honi chahiye: active-active aur active-passive bundle banate hain, passive-passive kabhi nahi. Ports bundle hone ke baad spanning tree ko ek hi logical link dikhta hai, isliye dono cables traffic le jaate hain. Trunking Port-channel interface par configure karo taaki har member ek jaisa rahe.",
  },
};

export default lab;
