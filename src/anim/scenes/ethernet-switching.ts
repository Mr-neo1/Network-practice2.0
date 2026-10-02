import type { TopologyScene } from "../types.ts";

// Colours: blue = unicast data, green = reply, orange = broadcast.
const scene: TopologyScene = {
  kind: "topology",
  id: "ethernet-switching",
  title: { en: "How SW1 learns, forwards, floods, filters and forgets", hi: "SW1 kaise seekhta, forward, flood, filter karta aur bhoolta hai" },
  height: 400,
  nodes: [
    { id: "pca", kind: "pc", x: 110, y: 95, label: "PC-A", sub: "0050.56aa.0001" },
    { id: "pcb", kind: "pc", x: 110, y: 305, label: "PC-B", sub: "0050.56aa.0002" },
    { id: "sw1", kind: "switch", x: 330, y: 200, label: "SW1" },
    { id: "hub", kind: "hub", x: 530, y: 200, label: "Hub" },
    { id: "pcc", kind: "pc", x: 690, y: 95, label: "PC-C", sub: "0050.56aa.0003" },
    { id: "pcd", kind: "pc", x: 690, y: 305, label: "PC-D", sub: "0050.56aa.0004" },
  ],
  links: [
    { id: "l-a", a: "pca", b: "sw1", bPort: "Fa0/1" },
    { id: "l-b", a: "pcb", b: "sw1", bPort: "Fa0/2" },
    { id: "l-h", a: "sw1", b: "hub", aPort: "Fa0/3", label: "half duplex" },
    { id: "l-c", a: "hub", b: "pcc" },
    { id: "l-d", a: "hub", b: "pcd" },
  ],
  steps: [
    {
      title: { en: "SW1 starts with an empty MAC table", hi: "SW1 ki MAC table khaali hai" },
      text: {
        en: "SW1 has just booted, so its MAC address table is empty and it does not know which PC is on which port. The hub on Fa0/3 has no table at all: it repeats every bit it receives out of all its other ports.",
        hi: "SW1 abhi boot hua hai, isliye uski MAC address table khaali hai aur use nahi pata ki kaunsa PC kis port par hai. Fa0/3 wale hub ke paas toh table hoti hi nahi: jo bits aati hain, unhe woh baaki saare ports se repeat kar deta hai.",
      },
      focus: ["sw1"],
      tables: [{ node: "sw1", title: "SW1 MAC table", columns: ["VLAN", "MAC address", "Type", "Port"], rows: [["", "(empty)", "", ""]] }],
    },
    {
      title: { en: "PC-A sends to PC-C: learn the source", hi: "PC-A, PC-C ko bhejta hai: source seekho" },
      text: {
        en: "PC-A sends a frame with source 0050.56aa.0001 and destination 0050.56aa.0003. It arrives on Fa0/1, so SW1 records 0050.56aa.0001 on Fa0/1 in VLAN 1. A switch learns only from source addresses.",
        hi: "PC-A ek frame bhejta hai: source 0050.56aa.0001, destination 0050.56aa.0003. Frame Fa0/1 par aata hai, toh SW1 note karta hai ki 0050.56aa.0001 VLAN 1 mein Fa0/1 par hai. Switch sirf source address se seekhta hai.",
      },
      packets: [{ path: ["pca", "sw1"], label: "A → C", tone: "blue" }],
      tables: [{ node: "sw1", title: "SW1 MAC table", columns: ["VLAN", "MAC address", "Type", "Port"], rows: [["1", "0050.56aa.0001", "DYNAMIC", "Fa0/1"]], hl: [0] }],
    },
    {
      title: { en: "Unknown destination, so SW1 floods", hi: "Destination unknown hai, toh SW1 flood karta hai" },
      text: {
        en: "0050.56aa.0003 is not in the table, so SW1 floods the frame out every other port in VLAN 1 (Fa0/2 and Fa0/3), never back out Fa0/1. The hub repeats its copy to PC-C and PC-D. PC-C keeps the frame; PC-B and PC-D see a destination MAC that is not theirs and discard it.",
        hi: "0050.56aa.0003 table mein nahi hai, isliye SW1 frame ko VLAN 1 ke baaki har port se flood karta hai (Fa0/2 aur Fa0/3), Fa0/1 se wapas kabhi nahi. Hub apni copy PC-C aur PC-D dono ko repeat karta hai. PC-C frame rakh leta hai; PC-B aur PC-D dekhte hain ki destination MAC unka nahi hai, toh use discard kar dete hain.",
      },
      packets: [
        { path: ["sw1", "pcb"], label: "A → C", tone: "blue" },
        { path: ["sw1", "hub", "pcc"], label: "A → C", tone: "blue" },
        { path: ["sw1", "hub", "pcd"], label: "A → C", tone: "blue" },
      ],
      badges: [
        { node: "pcb", text: "not mine", tone: "gray" },
        { node: "pcd", text: "not mine", tone: "gray" },
        { node: "pcc", text: "mine", tone: "green" },
      ],
    },
    {
      title: { en: "PC-C replies: learn Fa0/3, forward to Fa0/1", hi: "PC-C ka reply: Fa0/3 seekho, Fa0/1 par forward" },
      text: {
        en: "PC-C replies to 0050.56aa.0001. The hub repeats the frame to PC-D and to SW1, and SW1 learns 0050.56aa.0003 on Fa0/3. The destination is already known on Fa0/1, so SW1 forwards the frame out that one port and PC-B never sees it.",
        hi: "PC-C, 0050.56aa.0001 ko reply karta hai. Hub frame ko PC-D aur SW1 dono ko repeat karta hai, aur SW1 seekh leta hai ki 0050.56aa.0003 Fa0/3 par hai. Destination pehle se Fa0/1 par known hai, isliye SW1 frame sirf usi ek port se forward karta hai aur PC-B ko yeh dikhta hi nahi.",
      },
      badges: [
        { node: "pcb", text: "" },
        { node: "pcc", text: "" },
        { node: "pcd", text: "" },
      ],
      packets: [
        { path: ["pcc", "hub", "sw1", "pca"], label: "C → A", tone: "green" },
        { path: ["hub", "pcd"], label: "C → A", tone: "green", delay: 1 },
      ],
      tables: [
        {
          node: "sw1",
          title: "SW1 MAC table",
          columns: ["VLAN", "MAC address", "Type", "Port"],
          rows: [
            ["1", "0050.56aa.0001", "DYNAMIC", "Fa0/1"],
            ["1", "0050.56aa.0003", "DYNAMIC", "Fa0/3"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "A broadcast is always flooded", hi: "Broadcast hamesha flood hota hai" },
      text: {
        en: "PC-D sends a broadcast to FFFF.FFFF.FFFF. SW1 learns 0050.56aa.0004 on Fa0/3, so that port now holds two MAC addresses. The broadcast address is never in the table, so SW1 floods the frame out Fa0/1 and Fa0/2.",
        hi: "PC-D, FFFF.FFFF.FFFF par broadcast bhejta hai. SW1 seekhta hai ki 0050.56aa.0004 Fa0/3 par hai, toh ab us ek port par do MAC addresses hain. Broadcast address kabhi table mein nahi hota, isliye SW1 frame ko Fa0/1 aur Fa0/2 se flood kar deta hai.",
      },
      focus: ["pcd", "sw1"],
      packets: [
        { path: ["pcd", "hub", "sw1"], label: "Broadcast", tone: "orange" },
        { path: ["hub", "pcc"], label: "Broadcast", tone: "orange", delay: 1 },
        { path: ["sw1", "pca"], label: "Broadcast", tone: "orange", delay: 2 },
        { path: ["sw1", "pcb"], label: "Broadcast", tone: "orange", delay: 2 },
      ],
      tables: [
        {
          node: "sw1",
          title: "SW1 MAC table",
          columns: ["VLAN", "MAC address", "Type", "Port"],
          rows: [
            ["1", "0050.56aa.0001", "DYNAMIC", "Fa0/1"],
            ["1", "0050.56aa.0003", "DYNAMIC", "Fa0/3"],
            ["1", "0050.56aa.0004", "DYNAMIC", "Fa0/3"],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "Destination on the incoming port: filter", hi: "Destination incoming port par hi hai: filter" },
      text: {
        en: "PC-C sends a frame to PC-D, and the hub repeats it to both PC-D and SW1. SW1 finds 0050.56aa.0004 on Fa0/3, the same port the frame arrived on. PC-D already has the frame, so SW1 filters (drops) its copy instead of sending it back.",
        hi: "PC-C, PC-D ko frame bhejta hai, aur hub use PC-D aur SW1 dono ko repeat karta hai. SW1 dekhta hai ki 0050.56aa.0004 Fa0/3 par hai, yaani usi port par jahan se frame aaya. PC-D ko frame mil chuka hai, isliye SW1 apni copy wapas bhejne ki jagah filter (drop) kar deta hai.",
      },
      focus: ["sw1"],
      packets: [
        { path: ["pcc", "hub", "pcd"], label: "C → D", tone: "blue" },
        { path: ["pcc", "hub", "sw1"], label: "C → D", tone: "blue", drop: true },
      ],
      badges: [{ node: "sw1", text: "filtered", tone: "red" }],
    },
    {
      title: { en: "PC-B sends for the first time", hi: "PC-B pehli baar kuch bhejta hai" },
      text: {
        en: "SW1 had no entry for PC-B because PC-B had not sent anything yet. Its frame to PC-A teaches SW1 that 0050.56aa.0002 is on Fa0/2. 0050.56aa.0001 is known on Fa0/1, so the frame goes out Fa0/1 only.",
        hi: "SW1 ke paas PC-B ki entry nahi thi, kyunki PC-B ne ab tak kuch bheja hi nahi tha. PC-A ko bheja gaya uska frame SW1 ko sikhata hai ki 0050.56aa.0002 Fa0/2 par hai. 0050.56aa.0001 Fa0/1 par known hai, isliye frame sirf Fa0/1 se jaata hai.",
      },
      badges: [{ node: "sw1", text: "" }],
      packets: [{ path: ["pcb", "sw1", "pca"], label: "B → A", tone: "blue" }],
      tables: [
        {
          node: "sw1",
          title: "SW1 MAC table",
          columns: ["VLAN", "MAC address", "Type", "Port"],
          rows: [
            ["1", "0050.56aa.0001", "DYNAMIC", "Fa0/1"],
            ["1", "0050.56aa.0003", "DYNAMIC", "Fa0/3"],
            ["1", "0050.56aa.0004", "DYNAMIC", "Fa0/3"],
            ["1", "0050.56aa.0002", "DYNAMIC", "Fa0/2"],
          ],
          hl: [3],
        },
      ],
    },
    {
      title: { en: "PC-D goes quiet: its entry ages out", hi: "PC-D chup hai: uski entry age out" },
      text: {
        en: "PC-A, PC-B and PC-C keep sending, and each frame resets the 300-second timer on its own entry. PC-D sends nothing for 300 seconds, so SW1 deletes 0050.56aa.0004 from the table.",
        hi: "PC-A, PC-B aur PC-C frames bhejte rehte hain, aur har frame apni entry ka 300-second timer reset kar deta hai. PC-D 300 seconds tak kuch nahi bhejta, isliye SW1 table se 0050.56aa.0004 delete kar deta hai.",
      },
      focus: ["pcd", "sw1"],
      badges: [{ node: "pcd", text: "silent 300 s", tone: "gray" }],
      tables: [
        {
          node: "sw1",
          title: "SW1 MAC table",
          columns: ["VLAN", "MAC address", "Type", "Port"],
          rows: [
            ["1", "0050.56aa.0001", "DYNAMIC", "Fa0/1"],
            ["1", "0050.56aa.0003", "DYNAMIC", "Fa0/3"],
            ["1", "0050.56aa.0002", "DYNAMIC", "Fa0/2"],
          ],
        },
      ],
    },
    {
      title: { en: "Aged out means flooded again", hi: "Age out hua, matlab phir se flood" },
      text: {
        en: "PC-A now sends a frame to 0050.56aa.0004. SW1 no longer knows where that MAC is, so it floods the frame out Fa0/2 and Fa0/3 again. PC-D still gets its copy through the hub, and SW1 will learn PC-D's port again the next time PC-D sends a frame.",
        hi: "Ab PC-A, 0050.56aa.0004 ko frame bhejta hai. SW1 ko ab pata nahi ki yeh MAC kahan hai, isliye woh frame ko phir se Fa0/2 aur Fa0/3 se flood karta hai. PC-D ko hub ke through apni copy mil jaati hai, aur jab PC-D agla frame bhejega, tab SW1 uska port dobara seekh lega.",
      },
      badges: [{ node: "pcd", text: "mine", tone: "green" }],
      packets: [
        { path: ["pca", "sw1"], label: "A → D", tone: "blue" },
        { path: ["sw1", "pcb"], label: "A → D", tone: "blue", delay: 1 },
        { path: ["sw1", "hub", "pcc"], label: "A → D", tone: "blue", delay: 1 },
        { path: ["sw1", "hub", "pcd"], label: "A → D", tone: "blue", delay: 1 },
      ],
    },
  ],
};

export default scene;
