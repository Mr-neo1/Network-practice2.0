import type { TopologyScene } from "../types.ts";

const pcSettings = (ip: string, gw: string, dns: string, hl?: number[]) => ({
  node: "pca",
  title: "PC-A IP settings",
  columns: ["Setting", "Value"],
  rows: [
    ["IP address", ip],
    ["Default gateway", gw],
    ["DNS server", dns],
  ],
  hl,
});

const trustNotes = [
  { id: "l-r1", state: "normal" as const, note: "trusted" },
  { id: "l-pca", state: "normal" as const, note: "untrusted" },
  { id: "l-rog", state: "normal" as const, note: "untrusted" },
];

const scene: TopologyScene = {
  kind: "topology",
  id: "dhcp-snooping",
  title: { en: "DHCP snooping: a rogue Offer is dropped, the real one gets through", hi: "DHCP snooping: rogue Offer drop hota hai, asli wala pahunchta hai" },
  height: 420,
  nodes: [
    { id: "r1", kind: "router", x: 400, y: 80, label: "R1", sub: "DHCP server", sub2: "192.168.10.1" },
    { id: "sw1", kind: "switch", x: 400, y: 215, label: "SW1" },
    { id: "pca", kind: "pc", x: 180, y: 335, label: "PC-A", sub: "DHCP client", sub2: "0050.56aa.0011" },
    { id: "rogue", kind: "attacker", x: 620, y: 335, label: "Rogue DHCP", sub: "192.168.10.66", sub2: "0050.56aa.0066" },
  ],
  links: [
    { id: "l-r1", a: "r1", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/1" },
    { id: "l-pca", a: "pca", b: "sw1", bPort: "Gi0/2" },
    { id: "l-rog", a: "rogue", b: "sw1", bPort: "Gi0/3" },
  ],
  steps: [
    {
      title: { en: "VLAN 10, no snooping yet", hi: "VLAN 10, abhi snooping nahi" },
      text: {
        en: "R1 is the real DHCP server for 192.168.10.0/24 and hands out gateway 192.168.10.1 and DNS 8.8.8.8. An attacker's laptop on Gi0/3 also runs a DHCP server. PC-A has just booted and has no address.",
        hi: "R1 192.168.10.0/24 ka asli DHCP server hai aur gateway 192.168.10.1 aur DNS 8.8.8.8 deta hai. Gi0/3 par attacker ka laptop bhi DHCP server chala raha hai. PC-A abhi boot hua hai aur uske paas koi address nahi.",
      },
      focus: ["pca", "rogue"],
      tables: [pcSettings("(none)", "(none)", "(none)")],
    },
    {
      title: { en: "PC-A's Discover is flooded", hi: "PC-A ka Discover flood hota hai" },
      text: {
        en: "PC-A broadcasts a DHCP Discover from 0.0.0.0 to 255.255.255.255. SW1 floods it out of every other port in VLAN 10, so both R1 and the rogue server hear it.",
        hi: "PC-A 0.0.0.0 se 255.255.255.255 par DHCP Discover broadcast karta hai. SW1 use VLAN 10 ke baaki har port se flood karta hai, toh R1 aur rogue server dono sun lete hain.",
      },
      packets: [
        { path: ["pca", "sw1"], label: "DHCP Discover", tone: "orange" },
        { path: ["sw1", "r1"], label: "DHCP Discover", tone: "orange", delay: 1 },
        { path: ["sw1", "rogue"], label: "DHCP Discover", tone: "orange", delay: 1 },
      ],
    },
    {
      title: { en: "The rogue answers first and wins", hi: "Rogue pehle jawab deta hai aur jeet jaata hai" },
      text: {
        en: "The rogue's Offer reaches PC-A first, with gateway and DNS 192.168.10.66; R1's Offer arrives later and is ignored. PC-A broadcasts a Request for the rogue's Offer and the rogue confirms with an Ack. From now on every packet PC-A sends off the subnet goes to the attacker.",
        hi: "Rogue ka Offer PC-A tak pehle pahunchta hai, jisme gateway aur DNS 192.168.10.66 hai; R1 ka Offer baad mein aata hai aur ignore ho jaata hai. PC-A rogue ke Offer ke liye Request broadcast karta hai aur rogue Ack se confirm kar deta hai. Ab PC-A ka subnet se bahar jaane wala har packet attacker ke paas jaayega.",
      },
      packets: [
        { path: ["rogue", "sw1", "pca"], label: "Offer GW .66", tone: "red" },
        { path: ["r1", "sw1", "pca"], label: "Offer GW .1", tone: "green", delay: 1 },
        { path: ["pca", "sw1", "rogue"], label: "DHCP Request", tone: "orange", delay: 3 },
        { path: ["sw1", "r1"], label: "DHCP Request", tone: "orange", delay: 4 },
        { path: ["rogue", "sw1", "pca"], label: "Ack GW .66", tone: "red", delay: 5 },
      ],
      badges: [{ node: "pca", text: "gateway = attacker", tone: "red" }],
      tables: [pcSettings("192.168.10.150", "192.168.10.66", "192.168.10.66", [0, 1, 2])],
    },
    {
      title: { en: "Turn on DHCP snooping", hi: "DHCP snooping on karo" },
      text: {
        en: "The admin enters `ip dhcp snooping`, `ip dhcp snooping vlan 10`, `no ip dhcp snooping information option` (R1 is an IOS DHCP server with no relay in between), `ip dhcp snooping trust` on Gi0/1, and `ip dhcp snooping limit rate 10` on Gi0/2 and Gi0/3. Gi0/1 towards R1 is now trusted; every other port in VLAN 10 is untrusted. PC-A releases its address and starts again.",
        hi: "Admin `ip dhcp snooping`, `ip dhcp snooping vlan 10`, `no ip dhcp snooping information option` (R1 IOS DHCP server hai aur beech mein koi relay nahi), Gi0/1 par `ip dhcp snooping trust`, aur Gi0/2 aur Gi0/3 par `ip dhcp snooping limit rate 10` daalta hai. R1 ki taraf wala Gi0/1 ab trusted hai; VLAN 10 ka baaki har port untrusted. PC-A apna address release karke phir se shuru karta hai.",
      },
      reset: true,
      focus: ["sw1"],
      links: trustNotes,
      badges: [{ node: "sw1", text: "snooping VLAN 10", tone: "teal" }],
      tables: [
        pcSettings("(none)", "(none)", "(none)"),
        { node: "sw1", title: "SW1 snooping bindings", columns: ["MAC address", "IP address", "Lease (s)", "Port"], rows: [["(empty)", "", "", ""]] },
      ],
    },
    {
      title: { en: "Client Discover: checked, sent to trusted only", hi: "Client Discover: check, phir sirf trusted par" },
      text: {
        en: "The Discover enters on untrusted Gi0/2. It is a client message, its source MAC matches the client MAC inside it, and it is under the rate limit, so it passes. This time SW1 sends it only out trusted Gi0/1, towards R1. The rogue on Gi0/3 never hears it.",
        hi: "Discover untrusted Gi0/2 par aata hai. Yeh client message hai, iska source MAC andar wale client MAC se match karta hai, aur rate limit ke andar hai, toh yeh pass ho jaata hai. Is baar SW1 ise sirf trusted Gi0/1 se, R1 ki taraf, bhejta hai. Gi0/3 wale rogue tak yeh pahunchta hi nahi.",
      },
      packets: [{ path: ["pca", "sw1", "r1"], label: "DHCP Discover", tone: "orange" }],
    },
    {
      title: { en: "Rogue Offer on an untrusted port: dropped", hi: "Untrusted port par rogue Offer: drop" },
      text: {
        en: "An attack tool can send Offers without hearing a Discover, so the rogue sends one anyway. An Offer is a server message and it arrived on untrusted Gi0/3, so SW1 drops it. PC-A never sees it.",
        hi: "Attack tool bina Discover sune bhi Offer bhej sakta hai, toh rogue phir bhi ek Offer bhej deta hai. Offer server message hai aur woh untrusted Gi0/3 par aaya, isliye SW1 use drop kar deta hai. PC-A tak woh kabhi nahi pahunchta.",
      },
      packets: [{ path: ["rogue", "sw1"], label: "Offer GW .66", tone: "red", drop: true }],
      badges: [{ node: "rogue", text: "Offer dropped", tone: "red" }],
    },
    {
      title: { en: "R1's Offer arrives on the trusted port", hi: "R1 ka Offer trusted port par aata hai" },
      text: {
        en: "R1's Offer enters SW1 on trusted Gi0/1, so it is forwarded without checks. It is now the only Offer PC-A receives: 192.168.10.11 with gateway 192.168.10.1.",
        hi: "R1 ka Offer trusted Gi0/1 par SW1 mein aata hai, isliye bina check ke forward hota hai. Ab PC-A ko yahi ek Offer milta hai: 192.168.10.11, gateway 192.168.10.1 ke saath.",
      },
      packets: [{ path: ["r1", "sw1", "pca"], label: "Offer GW .1", tone: "green" }],
    },
    {
      title: { en: "Request, Ack, and a new binding", hi: "Request, Ack, aur ek nayi binding" },
      text: {
        en: "PC-A broadcasts its Request for R1's Offer, SW1 again sends it only towards trusted Gi0/1, and R1 confirms with an Ack through trusted Gi0/1. As the Ack passes, SW1 records the binding: 0050.56aa.0011 has 192.168.10.11 for 86400 seconds on Gi0/2 in VLAN 10. PC-A now has the real gateway and DNS.",
        hi: "PC-A R1 ke Offer ke liye Request broadcast karta hai, SW1 use phir sirf trusted Gi0/1 ki taraf bhejta hai, aur R1 Ack bhej kar confirm karta hai. Ack guzarte hi SW1 binding record karta hai: 0050.56aa.0011 ke paas 192.168.10.11 hai, 86400 seconds ke liye, Gi0/2 par, VLAN 10 mein. PC-A ke paas ab asli gateway aur DNS hai.",
      },
      packets: [
        { path: ["pca", "sw1", "r1"], label: "DHCP Request", tone: "orange" },
        { path: ["r1", "sw1", "pca"], label: "DHCP Ack", tone: "green", delay: 2 },
      ],
      badges: [{ node: "rogue", text: "" }],
      tables: [
        pcSettings("192.168.10.11", "192.168.10.1", "8.8.8.8", [0, 1, 2]),
        { node: "sw1", title: "SW1 snooping bindings", columns: ["MAC address", "IP address", "Lease (s)", "Port"], rows: [["0050.56aa.0011", "192.168.10.11", "86400", "Gi0/2"]], hl: [0] },
      ],
    },
    {
      title: { en: "The attacker switches to starvation", hi: "Attacker starvation par aa jaata hai" },
      text: {
        en: "Blocked as a server, the attacker tries to empty R1's pool instead. Its tool fires hundreds of Discovers per second, each with a fake client MAC. Gi0/3 has `ip dhcp snooping limit rate 10`, so SW1 counts more than 10 DHCP packets in one second.",
        hi: "Server ki tarah block hone ke baad attacker R1 ka pool khaali karne ki koshish karta hai. Uska tool har second sainkdon Discovers bhejta hai, har ek mein fake client MAC. Gi0/3 par `ip dhcp snooping limit rate 10` hai, toh SW1 ek second mein 10 se zyada DHCP packets ginta hai.",
      },
      packets: [
        { path: ["rogue", "sw1"], label: "Discover (fake)", tone: "red" },
        { path: ["rogue", "sw1"], label: "Discover (fake)", tone: "red", delay: 0.35 },
        { path: ["rogue", "sw1"], label: "Discover (fake)", tone: "red", delay: 0.7 },
      ],
      badges: [{ node: "sw1", text: "over 10 pps on Gi0/3", tone: "red" }],
    },
    {
      title: { en: "Gi0/3 is err-disabled", hi: "Gi0/3 err-disabled ho gaya" },
      text: {
        en: "Exceeding the rate limit err-disables Gi0/3 (cause dhcp-rate-limit). The attacker is off the network, R1's pool keeps its addresses, and PC-A's binding is still in the table, ready for DAI in the next lesson.",
        hi: "Rate limit cross hote hi Gi0/3 err-disable ho jaata hai (cause dhcp-rate-limit). Attacker network se bahar hai, R1 ke pool ke addresses bache rehte hain, aur PC-A ki binding table mein abhi bhi hai, agle lesson ke DAI ke liye ready.",
      },
      links: [{ id: "l-rog", state: "down", note: "err-disabled" }],
      badges: [{ node: "sw1", text: "snooping VLAN 10", tone: "teal" }],
    },
  ],
};

export default scene;
