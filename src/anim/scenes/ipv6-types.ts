import type { TopologyScene } from "../types.ts";

// PC-A boots on 2001:db8:1:1::/64 and configures itself with SLAAC, then resolves R1 with NS/NA.
// PC-A MAC 0050.56aa.0001 -> EUI-64 interface ID 250:56ff:feaa:1 -> solicited-node ff02::1:ffaa:1
// R1 Gi0/0 MAC 0011.2233.4401 -> link-local fe80::211:22ff:fe33:4401; 2001:db8:1:1::1 -> ff02::1:ff00:1
// Colours: orange = solicitations (NS, RS), green = advertisements (RA, NA), blue = data (ping).

const scene: TopologyScene = {
  kind: "topology",
  id: "ipv6-types",
  title: { en: "A host wakes up: link-local, DAD, RS/RA, SLAAC, then NS/NA", hi: "Host jaagta hai: link-local, DAD, RS/RA, SLAAC, phir NS/NA" },
  height: 400,
  nodes: [
    { id: "pca", kind: "pc", x: 130, y: 110, label: "PC-A", sub: "0050.56aa.0001" },
    { id: "pcb", kind: "pc", x: 130, y: 300, label: "PC-B", sub: "0050.56aa.0002" },
    { id: "sw1", kind: "switch", x: 400, y: 205, label: "SW1" },
    { id: "r1", kind: "router", x: 670, y: 205, label: "R1", sub: "2001:db8:1:1::1/64", sub2: "0011.2233.4401" },
  ],
  links: [
    { id: "l-a", a: "pca", b: "sw1", bPort: "Gi0/1" },
    { id: "l-b", a: "pcb", b: "sw1", bPort: "Gi0/2" },
    { id: "l-r", a: "r1", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/3" },
  ],
  steps: [
    {
      title: { en: "PC-A builds its link-local address", hi: "PC-A apna link-local address banata hai" },
      text: {
        en: "PC-A has just booted and has no IPv6 address. It builds one on its own: fe80:: plus an EUI-64 interface ID made from its MAC 0050.56aa.0001, giving fe80::250:56ff:feaa:1. The address stays tentative until PC-A checks that nobody else uses it.",
        hi: "PC-A abhi boot hua hai aur uske paas koi IPv6 address nahi. Woh khud ek bana leta hai: fe80:: + MAC 0050.56aa.0001 se bana EUI-64 interface ID, yaani fe80::250:56ff:feaa:1. Jab tak PC-A check nahi kar leta ki yeh kisi aur ke paas nahi hai, address tentative rehta hai.",
      },
      focus: ["pca"],
      badges: [{ node: "pca", text: "tentative", tone: "orange" }],
      tables: [
        { node: "pca", title: "PC-A IPv6", columns: ["Address", "Type", "State"], rows: [["fe80::250:56ff:feaa:1", "link-local", "tentative"]], hl: [0] },
      ],
    },
    {
      title: { en: "DAD: is anyone already using it?", hi: "DAD: kya koi pehle se use kar raha hai?" },
      text: {
        en: "PC-A sends a Neighbor Solicitation for its own new address. The source is :: because it has no usable address yet, and the destination is the solicited-node group ff02::1:ffaa:1. SW1 floods it, nobody answers within about a second, so the address is unique and goes into use.",
        hi: "PC-A apne hi naye address ke liye Neighbor Solicitation bhejta hai. Source :: hai kyunki abhi koi usable address nahi, aur destination solicited-node group ff02::1:ffaa:1 hai. SW1 ise flood karta hai, lagbhag ek second tak koi jawab nahi aata, toh address unique hai aur use mein aa jaata hai.",
      },
      packets: [
        { path: ["pca", "sw1"], label: "NS (DAD)", tone: "orange" },
        { path: ["sw1", "pcb"], label: "NS (DAD)", tone: "orange", delay: 1, drop: true },
        { path: ["sw1", "r1"], label: "NS (DAD)", tone: "orange", delay: 1, drop: true },
      ],
      badges: [{ node: "pca", text: "" }],
      tables: [
        { node: "pca", title: "PC-A IPv6", columns: ["Address", "Type", "State"], rows: [["fe80::250:56ff:feaa:1", "link-local", "in use"]], hl: [0] },
      ],
    },
    {
      title: { en: "RS: any routers on this link?", hi: "RS: is link par koi router hai?" },
      text: {
        en: "Now PC-A wants a global address and a default gateway. It sends a Router Solicitation from fe80::250:56ff:feaa:1 to ff02::2, the all-routers group. SW1 floods the frame; PC-B is not a router, so it ignores it. The RS carries PC-A's MAC, so R1 notes it.",
        hi: "Ab PC-A ko global address aur default gateway chahiye. Woh fe80::250:56ff:feaa:1 se ff02::2, yaani all-routers group, ko Router Solicitation bhejta hai. SW1 frame flood karta hai; PC-B router nahi hai, toh use ignore kar deta hai. RS mein PC-A ka MAC bhi hota hai, toh R1 use note kar leta hai.",
      },
      focus: ["pca", "r1"],
      packets: [
        { path: ["pca", "sw1"], label: "RS → ff02::2", tone: "orange" },
        { path: ["sw1", "r1"], label: "RS → ff02::2", tone: "orange", delay: 1 },
        { path: ["sw1", "pcb"], label: "RS → ff02::2", tone: "orange", delay: 1, drop: true },
      ],
      tables: [
        { node: "r1", title: "R1 neighbor cache", columns: ["IPv6 address", "MAC address"], rows: [["fe80::250:56ff:feaa:1", "0050.56aa.0001"]], hl: [0] },
      ],
    },
    {
      title: { en: "RA: R1 advertises the prefix", hi: "RA: R1 prefix advertise karta hai" },
      text: {
        en: "R1 replies with a Router Advertisement from its link-local fe80::211:22ff:fe33:4401 to ff02::1, so every host on the link hears it. It carries the prefix 2001:db8:1:1::/64 with the flag that says 'build your own address', plus R1's MAC. PC-A makes the RA's source address its default gateway.",
        hi: "R1 apne link-local fe80::211:22ff:fe33:4401 se ff02::1 ko Router Advertisement bhejta hai, isliye link ka har host ise sunta hai. Ismein prefix 2001:db8:1:1::/64 hai, 'apna address khud banao' wala flag hai, aur R1 ka MAC bhi. PC-A RA ke source address ko apna default gateway bana leta hai.",
      },
      focus: ["r1"],
      packets: [
        { path: ["r1", "sw1"], label: "RA → ff02::1", tone: "green" },
        { path: ["sw1", "pca"], label: "RA → ff02::1", tone: "green", delay: 1 },
        { path: ["sw1", "pcb"], label: "RA → ff02::1", tone: "green", delay: 1 },
      ],
      tables: [
        {
          node: "pca",
          title: "PC-A IPv6",
          columns: ["Address", "Type", "State"],
          rows: [
            ["fe80::250:56ff:feaa:1", "link-local", "in use"],
            ["fe80::211:22ff:fe33:4401", "default gateway", "from RA"],
          ],
          hl: [1],
        },
        { node: "pca", title: "PC-A neighbor cache", columns: ["IPv6 address", "MAC address"], rows: [["fe80::211:22ff:fe33:4401", "0011.2233.4401"]], hl: [0] },
      ],
    },
    {
      title: { en: "SLAAC: PC-A builds a global address", hi: "SLAAC: PC-A global address banata hai" },
      text: {
        en: "PC-A puts the /64 prefix from the RA in front of the same EUI-64 interface ID: 2001:db8:1:1 + 250:56ff:feaa:1 = 2001:db8:1:1:250:56ff:feaa:1. No server handed this out; PC-A built it. Like every new address, it starts as tentative.",
        hi: "PC-A RA wala /64 prefix usi EUI-64 interface ID ke aage laga deta hai: 2001:db8:1:1 + 250:56ff:feaa:1 = 2001:db8:1:1:250:56ff:feaa:1. Kisi server ne yeh nahi diya; PC-A ne khud banaya. Har naye address ki tarah yeh bhi tentative se shuru hota hai.",
      },
      focus: ["pca"],
      badges: [{ node: "pca", text: "tentative", tone: "orange" }],
      tables: [
        {
          node: "pca",
          title: "PC-A IPv6",
          columns: ["Address", "Type", "State"],
          rows: [
            ["fe80::250:56ff:feaa:1", "link-local", "in use"],
            ["fe80::211:22ff:fe33:4401", "default gateway", "from RA"],
            ["2001:db8:1:1:250:56ff:feaa:1", "global (SLAAC)", "tentative"],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "DAD again for the global address", hi: "Global address ke liye phir DAD" },
      text: {
        en: "DAD runs again, this time for 2001:db8:1:1:250:56ff:feaa:1. The NS goes to the same group, ff02::1:ffaa:1, because both addresses end in the same 24 bits (aa:0001). No answer, so the global address goes into use.",
        hi: "DAD phir chalta hai, is baar 2001:db8:1:1:250:56ff:feaa:1 ke liye. NS usi group ff02::1:ffaa:1 ko jaata hai, kyunki dono addresses ke aakhri 24 bits (aa:0001) same hain. Koi jawab nahi aata, toh global address use mein aa jaata hai.",
      },
      packets: [
        { path: ["pca", "sw1"], label: "NS (DAD)", tone: "orange" },
        { path: ["sw1", "pcb"], label: "NS (DAD)", tone: "orange", delay: 1, drop: true },
        { path: ["sw1", "r1"], label: "NS (DAD)", tone: "orange", delay: 1, drop: true },
      ],
      badges: [{ node: "pca", text: "" }],
      tables: [
        {
          node: "pca",
          title: "PC-A IPv6",
          columns: ["Address", "Type", "State"],
          rows: [
            ["fe80::250:56ff:feaa:1", "link-local", "in use"],
            ["fe80::211:22ff:fe33:4401", "default gateway", "from RA"],
            ["2001:db8:1:1:250:56ff:feaa:1", "global (SLAAC)", "in use"],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "NS: find the MAC for 2001:db8:1:1::1", hi: "NS: 2001:db8:1:1::1 ka MAC dhoondho" },
      text: {
        en: "PC-A pings R1 at 2001:db8:1:1::1, which is in its own /64, but it has no MAC for that address yet. It sends an NS to R1's solicited-node group ff02::1:ff00:1, in a frame to MAC 3333.ff00.0001. R1 has joined that group; PC-B has not, so PC-B's network card discards the frame.",
        hi: "PC-A R1 ko 2001:db8:1:1::1 par ping karna chahta hai, jo uske apne /64 mein hai, lekin is address ka MAC abhi pata nahi. Woh R1 ke solicited-node group ff02::1:ff00:1 ko NS bhejta hai, jo frame MAC 3333.ff00.0001 par jaata hai. R1 ne yeh group join kiya hai, PC-B ne nahi, isliye PC-B ka network card frame discard kar deta hai.",
      },
      focus: ["pca", "r1"],
      packets: [
        { path: ["pca", "sw1"], label: "NS (resolve)", tone: "orange" },
        { path: ["sw1", "r1"], label: "NS (resolve)", tone: "orange", delay: 1 },
        { path: ["sw1", "pcb"], label: "NS (resolve)", tone: "orange", delay: 1, drop: true },
      ],
    },
    {
      title: { en: "NA: R1 replies with its MAC", hi: "NA: R1 apna MAC bhejta hai" },
      text: {
        en: "R1 answers with a Neighbor Advertisement sent straight to PC-A: 2001:db8:1:1::1 is at 0011.2233.4401. R1 also adds PC-A's global address to its neighbor cache, with the MAC that was in the NS. NS and NA together do the job ARP does in IPv4.",
        hi: "R1 seedha PC-A ko Neighbor Advertisement bhejta hai: 2001:db8:1:1::1 is at 0011.2233.4401. R1 bhi PC-A ka global address apne neighbor cache mein daal leta hai, us MAC ke saath jo NS mein tha. NS aur NA milkar wahi kaam karte hain jo IPv4 mein ARP karta hai.",
      },
      packets: [{ path: ["r1", "sw1", "pca"], label: "NA (R1's MAC)", tone: "green" }],
      tables: [
        {
          node: "pca",
          title: "PC-A neighbor cache",
          columns: ["IPv6 address", "MAC address"],
          rows: [
            ["fe80::211:22ff:fe33:4401", "0011.2233.4401"],
            ["2001:db8:1:1::1", "0011.2233.4401"],
          ],
          hl: [1],
        },
        {
          node: "r1",
          title: "R1 neighbor cache",
          columns: ["IPv6 address", "MAC address"],
          rows: [
            ["fe80::250:56ff:feaa:1", "0050.56aa.0001"],
            ["2001:db8:1:1:250:56ff:feaa:1", "0050.56aa.0001"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "Now the ping is plain unicast", hi: "Ab ping seedha unicast hai" },
      text: {
        en: "The ICMPv6 Echo Request goes to 2001:db8:1:1::1 inside a frame addressed to 0011.2233.4401. SW1 already knows which port each MAC is on, so PC-B never sees this frame. The Echo Reply comes back the same way.",
        hi: "ICMPv6 Echo Request 2001:db8:1:1::1 ko jaata hai, ek frame mein jiska destination MAC 0011.2233.4401 hai. SW1 ko pehle se pata hai kaunsa MAC kis port par hai, isliye PC-B ko yeh frame dikhta hi nahi. Echo Reply bhi isi raaste wapas aata hai.",
      },
      packets: [
        { path: ["pca", "sw1", "r1"], label: "Echo Request", tone: "blue" },
        { path: ["r1", "sw1", "pca"], label: "Echo Reply", tone: "blue", delay: 2 },
      ],
    },
  ],
};

export default scene;
