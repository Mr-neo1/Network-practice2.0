import type { TopologyScene } from "../types.ts";

// CDP and LLDP around SW1: advertisements arrive, neighbour tables fill in, and an untrusted port is silenced.
// Colours: purple = CDP, teal = LLDP.
// Names, ports and platforms match src/content/lessons/cdp-lldp.ts.

const scene: TopologyScene = {
  kind: "topology",
  id: "cdp-lldp",
  title: { en: "CDP and LLDP: who is on the other end of each cable", hi: "CDP aur LLDP: har cable ke doosre end par kaun hai" },
  height: 420,
  nodes: [
    { id: "r1", kind: "router", x: 150, y: 85, label: "R1", sub: "10.1.1.1", sub2: "CISCO2911" },
    { id: "sw1", kind: "switch", x: 400, y: 200, label: "SW1", sub: "10.1.1.11", sub2: "WS-C2960-24PC-L" },
    { id: "sw2", kind: "switch", x: 660, y: 200, label: "SW2", sub: "10.1.1.12", sub2: "WS-C2960-24TT-L" },
    { id: "phone", kind: "ipphone", x: 150, y: 320, label: "Phone", sub: "SEP001B54AA0005" },
    { id: "vis", kind: "attacker", x: 560, y: 350, label: "Visitor", sub: "Wireshark" },
  ],
  links: [
    { id: "l-r1", a: "r1", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/1" },
    { id: "l-sw2", a: "sw1", b: "sw2", aPort: "Gi0/2", bPort: "Gi0/1" },
    { id: "l-ph", a: "phone", b: "sw1", aPort: "Port 1", bPort: "Fa0/5" },
    { id: "l-vis", a: "vis", b: "sw1", bPort: "Fa0/10", label: "lobby port" },
  ],
  steps: [
    {
      title: { en: "R1 announces itself with CDP", hi: "R1 CDP se khud ko announce karta hai" },
      text: {
        en: "CDP is on by default, so with no configuration R1 sends an advertisement out Gi0/0 every 60 seconds to the multicast MAC 0100.0CCC.CCCC. It carries R1's name, IP 10.1.1.1, platform, capabilities and the port it left from. SW1 keeps it for the 180-second holdtime.",
        hi: "CDP by default on hai, isliye bina kisi configuration ke R1 har 60 seconds mein Gi0/0 se multicast MAC 0100.0CCC.CCCC par advertisement bhejta hai. Isme R1 ka naam, IP 10.1.1.1, platform, capabilities aur jis port se nikla woh port hota hai. SW1 ise 180 seconds ke holdtime tak rakhta hai.",
      },
      focus: ["r1", "sw1"],
      packets: [{ path: ["r1", "sw1"], label: "CDP", tone: "purple" }],
      tables: [
        {
          node: "sw1",
          title: "SW1: show cdp neighbors",
          columns: ["Device ID", "Local Intrfce", "Platform", "Port ID"],
          rows: [["R1", "Gig 0/1", "CISCO2911", "Gig 0/0"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "SW2 and the phone do the same", hi: "SW2 aur phone bhi yahi karte hain" },
      text: {
        en: "SW2 and the IP phone send their own advertisements, and SW1 now has three neighbours. Read each row carefully: Local Intrfce is SW1's own port, and Port ID is the neighbour's port at the far end of the cable.",
        hi: "SW2 aur IP phone apne-apne advertisements bhejte hain, aur ab SW1 ke teen neighbours hain. Har row dhyan se padho: Local Intrfce SW1 ka apna port hai, aur Port ID cable ke doosre end par neighbour ka port hai.",
      },
      packets: [
        { path: ["sw2", "sw1"], label: "CDP", tone: "purple" },
        { path: ["phone", "sw1"], label: "CDP", tone: "purple" },
      ],
      tables: [
        {
          node: "sw1",
          title: "SW1: show cdp neighbors",
          columns: ["Device ID", "Local Intrfce", "Platform", "Port ID"],
          rows: [
            ["R1", "Gig 0/1", "CISCO2911", "Gig 0/0"],
            ["SW2", "Gig 0/2", "WS-C2960-", "Gig 0/1"],
            ["SEP001B54AA0005", "Fas 0/5", "IP Phone", "Port 1"],
          ],
          hl: [1, 2],
        },
      ],
    },
    {
      title: { en: "SW1 advertises out every port", hi: "SW1 har port se advertise karta hai" },
      text: {
        en: "SW1 sends its own advertisement out every up interface with CDP enabled, lobby port Fa0/10 included. R1 learns about SW1 and nothing else: SW1 never relays R1's advertisement to SW2, so each device sees only its directly connected neighbours.",
        hi: "SW1 apna advertisement har us up interface se bhejta hai jahan CDP enabled hai, lobby wala port Fa0/10 bhi. R1 ko sirf SW1 ke baare mein pata chalta hai: SW1 R1 ka advertisement SW2 ko kabhi aage nahi bhejta, isliye har device ko sirf apne directly connected neighbours dikhte hain.",
      },
      focus: ["sw1"],
      packets: [
        { path: ["sw1", "r1"], label: "CDP", tone: "purple" },
        { path: ["sw1", "sw2"], label: "CDP", tone: "purple" },
        { path: ["sw1", "phone"], label: "CDP", tone: "purple" },
        { path: ["sw1", "vis"], label: "CDP", tone: "purple" },
      ],
      tables: [
        {
          node: "r1",
          title: "R1: show cdp neighbors",
          columns: ["Device ID", "Local Intrfce", "Platform", "Port ID"],
          rows: [["SW1", "Gig 0/0", "WS-C2960-", "Gig 0/1"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "What the phone and the visitor learn", hi: "Phone aur visitor ko kya pata chalta hai" },
      text: {
        en: "The phone reads SW1's advertisement to learn which voice VLAN to use for calls. The visitor's Wireshark captures the same frame: SW1's name, management IP, exact model and IOS version. For an attacker, that is a free shortlist of what to target.",
        hi: "Phone SW1 ke advertisement se seekhta hai ki calls ke liye kaunsa voice VLAN use karna hai. Visitor ka Wireshark wahi frame capture kar leta hai: SW1 ka naam, management IP, exact model aur IOS version. Attacker ke liye yeh free mein mili list hai ki kise target karna hai.",
      },
      focus: ["phone", "vis"],
      badges: [
        { node: "phone", text: "voice VLAN", tone: "green" },
        { node: "vis", text: "captured", tone: "red" },
      ],
      tables: [
        {
          node: "vis",
          title: "Visitor's capture of SW1",
          columns: ["Field", "Value"],
          rows: [
            ["Device ID", "SW1"],
            ["IP address", "10.1.1.11"],
            ["Platform", "cisco WS-C2960-24PC-L"],
            ["Software", "IOS 15.0(2)SE11"],
          ],
          hl: [0, 1, 2, 3],
        },
      ],
    },
    {
      title: { en: "LLDP: off until you enable it", hi: "LLDP: enable karne tak off" },
      text: {
        en: "LLDP is the IEEE 802.1AB standard, and on Cisco IOS it starts disabled. After lldp run on R1, SW1 and SW2, each sends LLDP frames every 30 seconds to 0180.C200.000E with a 120-second holdtime. SW1 lists R1 and SW2 in a separate LLDP table, and CDP keeps running alongside.",
        hi: "LLDP IEEE 802.1AB standard hai, aur Cisco IOS par yeh disabled state mein shuru hota hai. R1, SW1 aur SW2 par lldp run ke baad har device har 30 seconds mein 0180.C200.000E par LLDP frames bhejta hai, 120 seconds ke holdtime ke saath. SW1 R1 aur SW2 ko ek alag LLDP table mein list karta hai, aur CDP saath-saath chalta rehta hai.",
      },
      packets: [
        { path: ["r1", "sw1"], label: "LLDP", tone: "teal" },
        { path: ["sw2", "sw1"], label: "LLDP", tone: "teal" },
        { path: ["sw1", "r1"], label: "LLDP", tone: "teal", delay: 1 },
        { path: ["sw1", "sw2"], label: "LLDP", tone: "teal", delay: 1 },
        { path: ["sw1", "phone"], label: "LLDP", tone: "teal", delay: 1 },
        { path: ["sw1", "vis"], label: "LLDP", tone: "teal", delay: 1 },
      ],
      badges: [{ node: "phone", text: "" }],
      tables: [
        { node: "r1", title: "R1: show cdp neighbors", columns: ["Device ID", "Local Intrfce", "Platform", "Port ID"], rows: [] },
        {
          node: "sw1",
          title: "SW1: show lldp neighbors",
          columns: ["Device ID", "Local Intf", "Capability", "Port ID"],
          rows: [
            ["R1", "Gi0/1", "R", "Gi0/0"],
            ["SW2", "Gi0/2", "B", "Gi0/1"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Silence the lobby port", hi: "Lobby port ko chup karao" },
      text: {
        en: "On Fa0/10, no cdp enable and no lldp transmit stop SW1 advertising on that port only. At the next interval SW1 still advertises to R1, SW2 and the phone, but nothing goes to the lobby. CDP stays on for the phone's port, because the phone needs it for its voice VLAN.",
        hi: "Fa0/10 par no cdp enable aur no lldp transmit sirf us port par SW1 ki advertising band kar dete hain. Agle interval par SW1 R1, SW2 aur phone ko advertise karta rehta hai, lekin lobby tak kuch nahi jaata. Phone wale port par CDP on hi rehta hai, kyunki phone ko voice VLAN ke liye iski zaroorat hai.",
      },
      focus: ["sw1", "vis"],
      packets: [
        { path: ["sw1", "r1"], label: "CDP", tone: "purple" },
        { path: ["sw1", "sw2"], label: "CDP", tone: "purple" },
        { path: ["sw1", "phone"], label: "CDP", tone: "purple" },
      ],
      links: [{ id: "l-vis", state: "dim", note: "CDP/LLDP off" }],
      badges: [{ node: "vis", text: "nothing new", tone: "gray" }],
    },
  ],
};

export default scene;
