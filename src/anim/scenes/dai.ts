import type { TopologyScene } from "../types.ts";

const pcaCache = (mac: string, hl?: number[]) => ({
  node: "pca",
  title: "PC-A ARP cache",
  columns: ["IP address", "MAC address"],
  rows: [["192.168.10.1", mac]],
  hl,
});

const r1Cache = (mac: string, hl?: number[]) => ({
  node: "r1",
  title: "R1 ARP cache",
  columns: ["IP address", "MAC address"],
  rows: [["192.168.10.11", mac]],
  hl,
});

const daiCheck = (mac: string, ip: string, bound: string, result: string) => ({
  node: "sw1",
  title: "DAI check",
  columns: ["Field", "In the ARP", "Binding table"],
  rows: [
    ["Sender MAC", mac, mac],
    ["Sender IP", ip, bound],
    ["Result", result, ""],
  ],
  hl: [1, 2],
});

const scene: TopologyScene = {
  kind: "topology",
  id: "dai",
  title: { en: "ARP poisoning, then the same forged ARP stopped by DAI", hi: "ARP poisoning, phir wahi forged ARP DAI se ruka hua" },
  height: 420,
  nodes: [
    { id: "r1", kind: "router", x: 400, y: 80, label: "R1", sub: "192.168.10.1", sub2: "0011.2233.4401" },
    { id: "sw1", kind: "switch", x: 400, y: 215, label: "SW1" },
    { id: "pca", kind: "pc", x: 180, y: 335, label: "PC-A", sub: "192.168.10.11", sub2: "0050.56aa.0011" },
    { id: "atk", kind: "attacker", x: 620, y: 335, label: "Attacker", sub: "192.168.10.66", sub2: "0050.56aa.0066" },
  ],
  links: [
    { id: "l-r1", a: "r1", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/1" },
    { id: "l-pca", a: "pca", b: "sw1", bPort: "Gi0/2" },
    { id: "l-atk", a: "atk", b: "sw1", bPort: "Gi0/3" },
  ],
  steps: [
    {
      title: { en: "Normal: PC-A knows the real gateway MAC", hi: "Normal: PC-A ko asli gateway MAC pata hai" },
      text: {
        en: "PC-A's cache maps its gateway 192.168.10.1 to R1's MAC 0011.2233.4401, and R1 maps 192.168.10.11 to PC-A. A ping to 8.8.8.8 goes PC-A, SW1, R1. DAI is not enabled yet.",
        hi: "PC-A ki cache mein gateway 192.168.10.1 R1 ke MAC 0011.2233.4401 se mapped hai, aur R1 ke paas 192.168.10.11 PC-A se mapped hai. 8.8.8.8 ka ping PC-A, SW1, R1 hokar jaata hai. DAI abhi enable nahi hai.",
      },
      packets: [{ path: ["pca", "sw1", "r1"], label: "Ping 8.8.8.8", tone: "blue" }],
      tables: [pcaCache("0011.2233.4401"), r1Cache("0050.56aa.0011")],
    },
    {
      title: { en: "Forged ARP reply to PC-A", hi: "PC-A ko forged ARP reply" },
      text: {
        en: "The attacker sends PC-A an unrequested ARP reply: \"192.168.10.1 is at 0050.56aa.0066\". SW1 just forwards it by destination MAC. PC-A has no way to check it, so it overwrites its gateway entry.",
        hi: "Attacker PC-A ko bina maange ARP reply bhejta hai: \"192.168.10.1 is at 0050.56aa.0066\". SW1 use bas destination MAC dekh kar forward kar deta hai. PC-A ke paas ise check karne ka koi tareeka nahi, toh woh apni gateway entry overwrite kar deta hai.",
      },
      packets: [{ path: ["atk", "sw1", "pca"], label: "ARP: .1 is me", tone: "red" }],
      badges: [{ node: "pca", text: "poisoned", tone: "red" }],
      tables: [pcaCache("0050.56aa.0066", [0])],
    },
    {
      title: { en: "Forged ARP reply to R1", hi: "R1 ko forged ARP reply" },
      text: {
        en: "Then it tells R1 \"192.168.10.11 is at 0050.56aa.0066\". R1 overwrites its entry for PC-A. Both directions of the conversation now point at the attacker's MAC.",
        hi: "Phir woh R1 ko bolta hai \"192.168.10.11 is at 0050.56aa.0066\". R1 PC-A wali entry overwrite kar deta hai. Ab conversation ki dono directions attacker ke MAC ki taraf point karti hain.",
      },
      packets: [{ path: ["atk", "sw1", "r1"], label: "ARP: .11 is me", tone: "red" }],
      badges: [{ node: "r1", text: "poisoned", tone: "red" }],
      tables: [r1Cache("0050.56aa.0066", [0])],
    },
    {
      title: { en: "Traffic now flows through the attacker", hi: "Ab traffic attacker se hokar jaata hai" },
      text: {
        en: "PC-A's ping to 8.8.8.8 is framed to 0050.56aa.0066, so SW1 sends it to Gi0/3. The attacker reads it and passes it on to R1, and the reply takes the same detour back. PC-A sees a working network and has no idea.",
        hi: "PC-A ka 8.8.8.8 wala ping 0050.56aa.0066 ke liye frame hota hai, toh SW1 use Gi0/3 par bhejta hai. Attacker use padhta hai aur R1 ko aage bhej deta hai, aur reply bhi wapas isi ghumaav se aata hai. PC-A ko network chalta hua dikhta hai aur use kuch pata nahi.",
      },
      focus: ["atk"],
      packets: [
        { path: ["pca", "sw1", "atk", "sw1", "r1"], label: "Ping 8.8.8.8", tone: "blue" },
        { path: ["r1", "sw1", "atk", "sw1", "pca"], label: "Echo reply", tone: "blue", delay: 4 },
      ],
      badges: [{ node: "atk", text: "man-in-the-middle", tone: "red" }],
    },
    {
      title: { en: "Turn on DAI for VLAN 10", hi: "VLAN 10 ke liye DAI on karo" },
      text: {
        en: "Start again with clean caches. DHCP snooping already runs on VLAN 10, so SW1 has bindings for PC-A on Gi0/2 and for the attacker (which also got an address by DHCP) on Gi0/3. The admin adds `ip arp inspection vlan 10` and trusts Gi0/1, because R1's static IP has no binding.",
        hi: "Saaf caches ke saath phir se shuru karo. VLAN 10 par DHCP snooping pehle se chal raha hai, toh SW1 ke paas Gi0/2 par PC-A ki aur Gi0/3 par attacker ki binding hai (attacker ne bhi DHCP se address liya tha). Admin `ip arp inspection vlan 10` daalta hai aur Gi0/1 ko trust karta hai, kyunki R1 ke static IP ki koi binding nahi.",
      },
      reset: true,
      focus: ["sw1"],
      links: [
        { id: "l-r1", state: "normal", note: "trusted" },
        { id: "l-pca", state: "normal", note: "untrusted" },
        { id: "l-atk", state: "normal", note: "untrusted" },
      ],
      badges: [{ node: "sw1", text: "DAI VLAN 10", tone: "teal" }],
      tables: [
        {
          node: "sw1",
          title: "SW1 snooping bindings",
          columns: ["MAC address", "IP address", "Port"],
          rows: [
            ["0050.56aa.0011", "192.168.10.11", "Gi0/2"],
            ["0050.56aa.0066", "192.168.10.66", "Gi0/3"],
          ],
        },
        pcaCache("0011.2233.4401"),
        r1Cache("0050.56aa.0011"),
      ],
    },
    {
      title: { en: "The forged reply fails the check", hi: "Forged reply check mein fail hota hai" },
      text: {
        en: "The same forged reply arrives on untrusted Gi0/3. SW1 compares its sender fields with the binding table: 0050.56aa.0066 is bound to 192.168.10.66, not 192.168.10.1. No match, so SW1 drops it and logs %SW_DAI-4-DHCP_SNOOPING_DENY. PC-A's cache stays correct.",
        hi: "Wahi forged reply untrusted Gi0/3 par aata hai. SW1 uske sender fields ko binding table se compare karta hai: 0050.56aa.0066 ki binding 192.168.10.66 ke saath hai, 192.168.10.1 ke saath nahi. Match nahi hua, toh SW1 use drop karta hai aur %SW_DAI-4-DHCP_SNOOPING_DENY log karta hai. PC-A ki cache sahi rehti hai.",
      },
      packets: [{ path: ["atk", "sw1"], label: "ARP: .1 is me", tone: "red", drop: true }],
      badges: [{ node: "sw1", text: "drop + log", tone: "red" }],
      tables: [daiCheck("0050.56aa.0066", "192.168.10.1", "192.168.10.66", "no match: DROP")],
    },
    {
      title: { en: "Real ARP passes; trusted port is not checked", hi: "Asli ARP pass hota hai; trusted port check nahi hota" },
      text: {
        en: "Later PC-A's cache entry for the gateway times out, so it broadcasts an ARP request for 192.168.10.1. Its sender fields 0050.56aa.0011 / 192.168.10.11 match the Gi0/2 binding, so SW1 floods it. R1's reply comes in on trusted Gi0/1 and is forwarded without inspection.",
        hi: "Kuch der baad PC-A ki gateway wali cache entry time out ho jaati hai, toh woh 192.168.10.1 ke liye ARP request broadcast karta hai. Uske sender fields 0050.56aa.0011 / 192.168.10.11 Gi0/2 ki binding se match karte hain, toh SW1 use flood kar deta hai. R1 ka reply trusted Gi0/1 par aata hai aur bina inspection ke forward hota hai.",
      },
      packets: [
        { path: ["pca", "sw1"], label: "ARP Request", tone: "orange" },
        { path: ["sw1", "r1"], label: "ARP Request", tone: "orange", delay: 1 },
        { path: ["sw1", "atk"], label: "ARP Request", tone: "orange", delay: 1 },
        { path: ["r1", "sw1", "pca"], label: "ARP Reply", tone: "green", delay: 2 },
      ],
      badges: [{ node: "sw1", text: "valid: forward", tone: "green" }],
      tables: [daiCheck("0050.56aa.0011", "192.168.10.11", "192.168.10.11", "match: FORWARD")],
    },
    {
      title: { en: "An ARP flood hits the 15 pps limit", hi: "ARP flood 15 pps limit se takraata hai" },
      text: {
        en: "The attacker switches to blasting ARP messages. Untrusted ports allow 15 ARP packets per second by default, and Gi0/3 goes far over that.",
        hi: "Attacker ab ARP messages ki bauchhaar karta hai. Untrusted ports by default 15 ARP packets per second allow karte hain, aur Gi0/3 usse kahin zyada bhej raha hai.",
      },
      packets: [
        { path: ["atk", "sw1"], label: "ARP", tone: "red", drop: true },
        { path: ["atk", "sw1"], label: "ARP", tone: "red", drop: true, delay: 0.35 },
        { path: ["atk", "sw1"], label: "ARP", tone: "red", drop: true, delay: 0.7 },
      ],
      badges: [{ node: "sw1", text: "over 15 pps on Gi0/3", tone: "red" }],
    },
    {
      title: { en: "Gi0/3 is err-disabled", hi: "Gi0/3 err-disabled ho gaya" },
      text: {
        en: "SW1 err-disables Gi0/3 (cause arp-inspection). The attacker is off the network until an admin bounces the port or `errdisable recovery cause arp-inspection` brings it back. PC-A and R1 keep their correct ARP entries.",
        hi: "SW1 Gi0/3 ko err-disable kar deta hai (cause arp-inspection). Jab tak admin port bounce na kare ya `errdisable recovery cause arp-inspection` use wapas na laaye, attacker network se bahar hai. PC-A aur R1 ki ARP entries sahi rehti hain.",
      },
      links: [{ id: "l-atk", state: "down", note: "err-disabled" }],
      badges: [{ node: "sw1", text: "DAI VLAN 10", tone: "teal" }],
    },
  ],
};

export default scene;
