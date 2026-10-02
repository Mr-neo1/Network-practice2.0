import type { TopologyScene } from "../types.ts";

// Packet colours: blue = data on copper, teal = light on fiber, orange = PoE power,
// green = link recovered, red = failure or collision.
const scene: TopologyScene = {
  kind: "topology",
  id: "cables-and-interfaces",
  title: { en: "Copper, fiber, PoE and a hub in one small campus", hi: "Ek chhote campus mein copper, fiber, PoE aur ek hub" },
  height: 480,
  nodes: [
    { id: "pca", kind: "pc", x: 90, y: 90, label: "PC-A", sub: "NIC (MDI)" },
    { id: "sw1", kind: "switch", x: 320, y: 90, label: "SW1", sub: "access switch" },
    { id: "core", kind: "l3switch", x: 540, y: 90, label: "CORE", sub: "Building B" },
    { id: "site2", kind: "switch", x: 710, y: 90, label: "SITE2", sub: "8 km away" },
    { id: "ap1", kind: "ap", x: 90, y: 255, label: "AP1", sub: "on the ceiling" },
    { id: "sw2", kind: "switch", x: 320, y: 255, label: "SW2", sub: "same closet" },
    { id: "hub", kind: "hub", x: 540, y: 290, label: "HUB", sub: "legacy, shared" },
    { id: "pcx", kind: "pc", x: 420, y: 410, label: "PC-X" },
    { id: "pcy", kind: "pc", x: 670, y: 410, label: "PC-Y" },
  ],
  links: [
    { id: "l-pc", a: "pca", b: "sw1", bPort: "Gi1/0/1", style: "copper", label: "straight-through" },
    { id: "l-ap", a: "ap1", b: "sw1", bPort: "Gi1/0/2", style: "copper", label: "PoE+" },
    { id: "l-sw", a: "sw1", b: "sw2", aPort: "Gi1/0/24", bPort: "Gi1/0/24", style: "copper", label: "straight cable" },
    { id: "l-mmf", a: "sw1", b: "core", aPort: "Gi1/1/1", bPort: "Gi1/0/10", style: "fiber", label: "MMF, 400 m" },
    { id: "l-smf", a: "core", b: "site2", aPort: "Te1/1/1", bPort: "Te1/1/1", style: "fiber", label: "SMF, 8 km" },
    { id: "l-hub", a: "sw2", b: "hub", aPort: "Gi1/0/5", style: "copper", label: "half duplex" },
    { id: "l-x", a: "hub", b: "pcx", style: "copper" },
    { id: "l-y", a: "hub", b: "pcy", style: "copper" },
  ],
  steps: [
    {
      title: { en: "PC to switch: straight-through lines up", hi: "PC se switch: straight-through sahi baithta hai" },
      text: {
        en: "At 10 or 100 Mbps only two pairs carry data. PC-A transmits on pins 1 and 2, and SW1 listens on 1 and 2, so a straight-through cable joins them pin for pin. SW1 answers on pins 3 and 6, which PC-A listens on.",
        hi: "10 ya 100 Mbps par sirf do pairs data le jaate hain. PC-A pins 1 aur 2 par transmit karta hai, aur SW1 1 aur 2 par sunta hai, isliye straight-through cable pin se pin jod deta hai. SW1 pins 3 aur 6 par jawab deta hai, jin par PC-A sunta hai.",
      },
      focus: ["pca", "sw1"],
      links: [{ id: "l-pc", state: "active", note: "100BASE-TX" }],
      packets: [
        { path: ["pca", "sw1"], label: "Tx on 1,2", tone: "blue" },
        { path: ["sw1", "pca"], label: "Tx on 3,6", tone: "blue", delay: 1 },
      ],
      tables: [
        {
          node: "sw1",
          title: "Straight-through at 100 Mbps",
          columns: ["Pins", "PC-A (MDI)", "SW1 (MDI-X)"],
          rows: [
            ["1, 2", "Transmit", "Receive"],
            ["3, 6", "Receive", "Transmit"],
          ],
        },
      ],
    },
    {
      title: { en: "Gigabit uses all four pairs, both ways", hi: "Gigabit chaaron pairs use karta hai, dono taraf" },
      text: {
        en: "PC-A and SW1 negotiate 1 Gbps on the same cable. 1000BASE-T uses all four pairs, and every pair carries signals in both directions at the same time. That is why gigabit needs all eight wires and Cat5e or better.",
        hi: "PC-A aur SW1 usi cable par 1 Gbps negotiate karte hain. 1000BASE-T chaaron pairs use karta hai, aur har pair ek saath dono directions mein signal le jaata hai. Isiliye gigabit ko aathon wires aur Cat5e ya usse behtar cable chahiye.",
      },
      focus: ["pca", "sw1"],
      links: [{ id: "l-pc", state: "active", note: "1000BASE-T" }],
      packets: [
        { path: ["pca", "sw1"], label: "1000BASE-T", tone: "blue" },
        { path: ["sw1", "pca"], label: "1000BASE-T", tone: "blue" },
      ],
      tables: [
        { node: "sw1", title: "Straight-through at 100 Mbps", columns: ["Pins", "PC-A (MDI)", "SW1 (MDI-X)"], rows: [] },
        {
          node: "sw1",
          title: "1000BASE-T on the same cable",
          columns: ["Pair", "Pins", "Direction"],
          rows: [
            ["1", "1, 2", "both ways"],
            ["2", "3, 6", "both ways"],
            ["3", "4, 5", "both ways"],
            ["4", "7, 8", "both ways"],
          ],
          hl: [2, 3],
        },
      ],
    },
    {
      title: { en: "Switch to switch, straight cable: no link", hi: "Switch se switch, straight cable: link nahi" },
      text: {
        en: "Someone joins SW1 and SW2 with a straight-through cable. Both switches transmit on pins 3 and 6 and listen on 1 and 2 (link negotiation starts on these two pairs even at gigabit), so each transmit pair lands on the other switch's transmit pair. Nothing is received, so the ports show notconnect; without Auto-MDIX they would stay that way.",
        hi: "Kisi ne SW1 aur SW2 ko straight-through cable se jod diya. Dono switches pins 3 aur 6 par transmit karte hain aur 1 aur 2 par sunte hain (gigabit par bhi link negotiation inhi do pairs par shuru hoti hai), toh ek ka transmit pair doosre ke transmit pair par hi pahunchta hai. Kuch receive nahi hota, isliye ports notconnect dikhate hain; Auto-MDIX na ho toh aise hi rehte.",
      },
      focus: ["sw1", "sw2"],
      links: [
        { id: "l-pc", state: "normal" },
        { id: "l-sw", state: "down", note: "no link" },
      ],
      packets: [{ path: ["sw1", "sw2"], label: "Tx meets Tx", tone: "red", drop: true }],
      badges: [
        { node: "sw1", text: "notconnect", tone: "red" },
        { node: "sw2", text: "notconnect", tone: "red" },
      ],
      tables: [
        { node: "sw1", title: "1000BASE-T on the same cable", columns: ["Pair", "Pins", "Direction"], rows: [] },
        {
          node: "sw2",
          title: "Straight cable, like devices",
          columns: ["Pins", "SW1 (MDI-X)", "SW2 (MDI-X)"],
          rows: [
            ["1, 2", "Receive", "Receive"],
            ["3, 6", "Transmit", "Transmit"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Auto-MDIX swaps the pairs", hi: "Auto-MDIX pairs swap kar deta hai" },
      text: {
        en: "Auto-MDIX, on by default on modern Cisco switches, notices there is no link and swaps the port's transmit and receive pairs. SW2's port now behaves like MDI and transmits on 1 and 2, the link comes up on both sides, and frames flow. Without Auto-MDIX, like devices need a crossover cable.",
        hi: "Auto-MDIX, jo modern Cisco switches par by default on hota hai, dekhta hai ki link nahi aaya aur port ke transmit aur receive pairs swap kar deta hai. Ab SW2 ka port MDI ki tarah 1 aur 2 par transmit karta hai, dono taraf link up ho jaata hai aur frames chalne lagte hain. Auto-MDIX ke bina like devices ko crossover cable chahiye.",
      },
      focus: ["sw2"],
      links: [{ id: "l-sw", state: "active", note: "Auto-MDIX" }],
      packets: [
        { path: ["sw1", "sw2"], label: "frames flow", tone: "green" },
        { path: ["sw2", "sw1"], label: "frames flow", tone: "green", delay: 1 },
      ],
      badges: [
        { node: "sw1", text: "connected", tone: "green" },
        { node: "sw2", text: "pairs swapped", tone: "green" },
      ],
      tables: [
        {
          node: "sw2",
          title: "Straight cable, like devices",
          columns: ["Pins", "SW1 (MDI-X)", "SW2 (now MDI)"],
          rows: [
            ["1, 2", "Receive", "Transmit"],
            ["3, 6", "Transmit", "Receive"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Multimode fiber to Building B", hi: "Building B tak multimode fiber" },
      text: {
        en: "Building B is 400 m away, far beyond copper's 100 m. SW1's uplink Gi1/1/1 holds a 1000BASE-SX SFP that sends 850 nm light into multimode fiber with a 50 µm core. The link uses two strands, one for each direction.",
        hi: "Building B 400 m door hai, copper ke 100 m se kaafi aage. SW1 ke uplink Gi1/1/1 mein 1000BASE-SX SFP laga hai jo 50 µm core wale multimode fiber mein 850 nm light bhejta hai. Link do strands use karta hai, har direction ke liye ek.",
      },
      focus: ["sw1", "core"],
      links: [
        { id: "l-sw", state: "normal" },
        { id: "l-mmf", state: "active", note: "1000BASE-SX" },
      ],
      packets: [
        { path: ["sw1", "core"], label: "850 nm light", tone: "teal" },
        { path: ["core", "sw1"], label: "850 nm light", tone: "teal", delay: 1 },
      ],
      badges: [
        { node: "sw2", text: "" },
        { node: "sw1", text: "SX SFP", tone: "teal" },
      ],
      tables: [
        { node: "sw2", title: "Straight cable, like devices", columns: ["Pins", "SW1 (MDI-X)", "SW2 (MDI-X)"], rows: [] },
        {
          node: "sw1",
          title: "Uplink Gi1/1/1",
          columns: ["Item", "Value"],
          rows: [
            ["Transceiver", "1000BASE-SX SFP"],
            ["Fiber", "Multimode, 50 µm core"],
            ["Light", "850 nm"],
            ["Max reach", "about 550 m"],
          ],
        },
      ],
    },
    {
      title: { en: "Single-mode fiber to Site 2", hi: "Site 2 tak single-mode fiber" },
      text: {
        en: "SITE2 is 8 km away, which only single-mode fiber can reach. A 10GBASE-LR SFP+ at each end sends a 1310 nm laser down a 9 µm core, rated for 10 km. Both ends must use the same standard: an SR optic cannot talk to an LR optic.",
        hi: "SITE2 8 km door hai, jahan tak sirf single-mode fiber pahunch sakta hai. Dono ends par 10GBASE-LR SFP+ laga hai jo 9 µm core mein 1310 nm laser bhejta hai, 10 km tak rated. Dono ends par same standard hona zaroori hai: SR optic LR optic se baat nahi kar sakta.",
      },
      focus: ["core", "site2"],
      links: [
        { id: "l-mmf", state: "normal" },
        { id: "l-smf", state: "active", note: "10GBASE-LR" },
      ],
      packets: [
        { path: ["core", "site2"], label: "1310 nm laser", tone: "teal" },
        { path: ["site2", "core"], label: "1310 nm laser", tone: "teal", delay: 1 },
      ],
      badges: [
        { node: "sw1", text: "" },
        { node: "core", text: "LR SFP+", tone: "teal" },
        { node: "site2", text: "LR SFP+", tone: "teal" },
      ],
      tables: [
        { node: "sw1", title: "Uplink Gi1/1/1", columns: ["Item", "Value"], rows: [] },
        {
          node: "core",
          title: "Link to SITE2, Te1/1/1",
          columns: ["Item", "Value"],
          rows: [
            ["Transceiver", "10GBASE-LR SFP+"],
            ["Fiber", "Single-mode, 9 µm core"],
            ["Light", "1310 nm laser"],
            ["Max reach", "10 km"],
          ],
        },
      ],
    },
    {
      title: { en: "PoE: power over the data cable", hi: "PoE: data cable par hi power" },
      text: {
        en: "AP1 is on the ceiling with no power socket nearby. SW1 first detects that a PoE device is attached, learns how much power it needs, and only then sends DC power down the same UTP cable that carries its data. PoE+ (802.3at) gives up to 30 W per port.",
        hi: "AP1 ceiling par laga hai aur paas mein koi power socket nahi. SW1 pehle detect karta hai ki PoE device laga hai, phir pata karta hai ki use kitni power chahiye, aur uske baad hi usi UTP cable par DC power bhejta hai jis par data jaata hai. PoE+ (802.3at) har port par 30 W tak deta hai.",
      },
      focus: ["sw1", "ap1"],
      links: [
        { id: "l-smf", state: "normal" },
        { id: "l-ap", state: "active", note: "802.3at" },
      ],
      packets: [
        { path: ["sw1", "ap1"], label: "DC power", tone: "orange" },
        { path: ["ap1", "sw1"], label: "data", tone: "blue", delay: 1 },
      ],
      badges: [
        { node: "core", text: "" },
        { node: "site2", text: "" },
        { node: "ap1", text: "powered", tone: "green" },
      ],
      tables: [
        { node: "core", title: "Link to SITE2, Te1/1/1", columns: ["Item", "Value"], rows: [] },
        {
          node: "ap1",
          title: "PoE on Gi1/0/2",
          columns: ["Stage", "What SW1 does"],
          rows: [
            ["Detect", "Checks for a PoE signature"],
            ["Classify", "Learns the power class"],
            ["Power", "Supplies DC power"],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "Shared media: a hub repeats every bit", hi: "Shared media: hub har bit repeat karta hai" },
      text: {
        en: "A hub is a Layer 1 device: it repeats every bit it receives out of all its other ports. PC-X sends a frame for PC-Y, and SW2 gets a copy too. PC-X, PC-Y and SW2's port Gi1/0/5 share one medium, so only one of them can send at a time: half duplex.",
        hi: "Hub Layer 1 device hai: jo bhi bit aata hai, use baaki saare ports se repeat kar deta hai. PC-X PC-Y ke liye frame bhejta hai, aur SW2 ko bhi copy mil jaati hai. PC-X, PC-Y aur SW2 ka port Gi1/0/5 ek hi medium share karte hain, isliye ek time par sirf ek bhej sakta hai: half duplex.",
      },
      focus: ["hub", "pcx"],
      links: [
        { id: "l-ap", state: "normal" },
        { id: "l-x", state: "active" },
        { id: "l-y", state: "active" },
        { id: "l-hub", state: "active" },
      ],
      packets: [
        { path: ["pcx", "hub"], label: "to PC-Y", tone: "blue" },
        { path: ["hub", "pcy"], label: "copy", tone: "blue", delay: 1 },
        { path: ["hub", "sw2"], label: "copy", tone: "blue", delay: 1 },
      ],
      badges: [
        { node: "ap1", text: "" },
        { node: "hub", text: "repeats bits", tone: "gray" },
      ],
      tables: [{ node: "ap1", title: "PoE on Gi1/0/2", columns: ["Stage", "What SW1 does"], rows: [] }],
    },
    {
      title: { en: "Two senders on shared media collide", hi: "Shared media par do senders takra jaate hain" },
      text: {
        en: "PC-X and PC-Y start sending at the same moment. Their signals collide on the shared medium and both frames are ruined. Each PC detects the collision, waits a random time and sends again: this is CSMA/CD.",
        hi: "PC-X aur PC-Y ek hi pal mein bhejna shuru karte hain. Shared medium par unke signals takra jaate hain aur dono frames kharab ho jaate hain. Har PC collision detect karta hai, random time wait karta hai aur dobara bhejta hai: yahi CSMA/CD hai.",
      },
      focus: ["pcx", "pcy", "hub"],
      packets: [
        { path: ["pcx", "hub"], label: "frame", tone: "red", drop: true },
        { path: ["pcy", "hub"], label: "frame", tone: "red", drop: true },
      ],
      badges: [
        { node: "hub", text: "collision", tone: "red" },
        { node: "pcx", text: "random wait", tone: "gray" },
        { node: "pcy", text: "random wait", tone: "gray" },
      ],
    },
    {
      title: { en: "Point-to-point: full duplex, no collisions", hi: "Point-to-point: full duplex, koi collision nahi" },
      text: {
        en: "Every switch port is its own point-to-point link with exactly two devices on it. PC-A and SW1 send in both directions at the same moment with no collision: full duplex. Modern Ethernet is built from links like this, over the media summarised below.",
        hi: "Har switch port apna alag point-to-point link hai jis par sirf do devices hote hain. PC-A aur SW1 ek hi pal mein dono directions mein bhejte hain aur koi collision nahi hota: full duplex. Aaj ka Ethernet aise hi links se bana hai, neeche diye media par.",
      },
      focus: ["pca", "sw1"],
      links: [
        { id: "l-x", state: "normal" },
        { id: "l-y", state: "normal" },
        { id: "l-hub", state: "normal" },
        { id: "l-pc", state: "active", note: "full duplex" },
      ],
      packets: [
        { path: ["pca", "sw1"], label: "frame", tone: "blue" },
        { path: ["sw1", "pca"], label: "frame", tone: "blue" },
      ],
      badges: [
        { node: "hub", text: "" },
        { node: "pcx", text: "" },
        { node: "pcy", text: "" },
        { node: "sw1", text: "no collisions", tone: "green" },
      ],
      tables: [
        {
          node: "sw1",
          title: "Links in this network",
          columns: ["Link", "Medium", "Standard", "Max reach"],
          rows: [
            ["PC-A to SW1", "Cat6 UTP", "1000BASE-T", "100 m"],
            ["AP1 to SW1", "Cat6 UTP + PoE+", "1000BASE-T", "100 m"],
            ["SW1 to CORE", "Multimode fiber", "1000BASE-SX", "about 550 m"],
            ["CORE to SITE2", "Single-mode fiber", "10GBASE-LR", "10 km"],
          ],
        },
      ],
    },
  ],
};

export default scene;
