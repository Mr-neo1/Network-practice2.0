import type { TopologyScene } from "../types.ts";

const scene: TopologyScene = {
  kind: "topology",
  id: "arp",
  title: { en: "ARP on one LAN: request, reply, then the real traffic", hi: "Ek LAN par ARP: request, reply, phir asli traffic" },
  height: 400,
  nodes: [
    { id: "pca", kind: "pc", x: 130, y: 95, label: "PC-A", sub: "10.1.1.10/24", sub2: "0050.56aa.0001" },
    { id: "pcb", kind: "pc", x: 670, y: 95, label: "PC-B", sub: "10.1.1.20/24", sub2: "0050.56aa.0002" },
    { id: "sw1", kind: "switch", x: 400, y: 200, label: "SW1" },
    { id: "pcc", kind: "pc", x: 130, y: 305, label: "PC-C", sub: "10.1.1.30/24", sub2: "0050.56aa.0003" },
    { id: "r1", kind: "router", x: 670, y: 305, label: "R1", sub: "10.1.1.1 (gateway)", sub2: "0011.2233.4401" },
  ],
  links: [
    { id: "l-a", a: "pca", b: "sw1", bPort: "Gi0/1" },
    { id: "l-b", a: "pcb", b: "sw1", bPort: "Gi0/2" },
    { id: "l-c", a: "pcc", b: "sw1", bPort: "Gi0/3" },
    { id: "l-r", a: "r1", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/4" },
  ],
  steps: [
    {
      title: { en: "PC-A wants to ping 10.1.1.20", hi: "PC-A ko 10.1.1.20 ping karna hai" },
      text: {
        en: "PC-A compares 10.1.1.20 with its own subnet, 10.1.1.0/24. Same subnet, so it can deliver the frame directly. It needs PC-B's MAC address, and its ARP cache is empty.",
        hi: "PC-A dekhta hai ki 10.1.1.20 uske apne subnet 10.1.1.0/24 mein hai. Same subnet hai, toh frame seedha deliver ho sakta hai. Bas PC-B ka MAC address chahiye, aur ARP cache abhi khaali hai.",
      },
      focus: ["pca", "pcb"],
      tables: [{ node: "pca", title: "PC-A ARP cache", columns: ["IP address", "MAC address"], rows: [["(empty)", ""]] }],
    },
    {
      title: { en: "ARP Request goes out as a broadcast", hi: "ARP Request broadcast bankar nikalta hai" },
      text: {
        en: "PC-A sends \"Who has 10.1.1.20? Tell 10.1.1.10\" to the broadcast MAC FFFF.FFFF.FFFF. SW1 learns PC-A's MAC on Gi0/1 from the source address, like it does for every frame.",
        hi: "PC-A \"Who has 10.1.1.20? Tell 10.1.1.10\" bhejta hai, destination MAC FFFF.FFFF.FFFF (broadcast). SW1 source MAC dekh kar seekh leta hai ki PC-A Gi0/1 par hai, jaise har frame ke saath karta hai.",
      },
      packets: [{ path: ["pca", "sw1"], label: "ARP Request", tone: "orange" }],
      tables: [{ node: "sw1", title: "SW1 MAC table", columns: ["MAC", "Port"], rows: [["0050.56aa.0001", "Gi0/1"]], hl: [0] }],
    },
    {
      title: { en: "The switch floods the broadcast", hi: "Switch broadcast ko flood karta hai" },
      text: {
        en: "A broadcast goes out of every port in the VLAN except the one it came in on. PC-B, PC-C and R1 all receive the same question.",
        hi: "Broadcast VLAN ke har port se bahar jaata hai, sirf us port ko chhod kar jahan se aaya. PC-B, PC-C aur R1, teeno ko same sawaal milta hai.",
      },
      packets: [
        { path: ["sw1", "pcb"], label: "ARP Request", tone: "orange" },
        { path: ["sw1", "pcc"], label: "ARP Request", tone: "orange" },
        { path: ["sw1", "r1"], label: "ARP Request", tone: "orange" },
      ],
    },
    {
      title: { en: "Only the owner of 10.1.1.20 answers", hi: "Sirf 10.1.1.20 ka owner jawab deta hai" },
      text: {
        en: "PC-C and R1 see the target IP is not theirs and discard the request. PC-B sees its own IP. Before replying, it saves PC-A's IP and MAC from the request, because a reply is coming anyway.",
        hi: "PC-C aur R1 dekhte hain ki target IP unka nahi hai, toh request discard kar dete hain. PC-B ko apna IP dikhta hai. Reply bhejne se pehle woh request se PC-A ka IP aur MAC save kar leta hai, kyunki ab baat toh honi hi hai.",
      },
      focus: ["pcb"],
      badges: [
        { node: "pcc", text: "not me", tone: "gray" },
        { node: "r1", text: "not me", tone: "gray" },
        { node: "pcb", text: "that's me", tone: "green" },
      ],
      tables: [{ node: "pcb", title: "PC-B ARP cache", columns: ["IP address", "MAC address"], rows: [["10.1.1.10", "0050.56aa.0001"]], hl: [0] }],
    },
    {
      title: { en: "ARP Reply comes back as unicast", hi: "ARP Reply unicast mein wapas aata hai" },
      text: {
        en: "PC-B replies \"10.1.1.20 is at 0050.56aa.0002\" straight to PC-A's MAC. SW1 learns PC-B on Gi0/2 and forwards the reply out of Gi0/1 only.",
        hi: "PC-B seedha PC-A ke MAC par reply karta hai: \"10.1.1.20 is at 0050.56aa.0002\". SW1 seekh leta hai ki PC-B Gi0/2 par hai, aur reply sirf Gi0/1 se forward karta hai.",
      },
      badges: [
        { node: "pcc", text: "" },
        { node: "r1", text: "" },
        { node: "pcb", text: "" },
      ],
      packets: [{ path: ["pcb", "sw1", "pca"], label: "ARP Reply", tone: "green" }],
      tables: [
        { node: "sw1", title: "SW1 MAC table", columns: ["MAC", "Port"], rows: [["0050.56aa.0001", "Gi0/1"], ["0050.56aa.0002", "Gi0/2"]], hl: [1] },
      ],
    },
    {
      title: { en: "PC-A caches the answer", hi: "PC-A jawab cache kar leta hai" },
      text: {
        en: "PC-A stores 10.1.1.20 → 0050.56aa.0002. While the entry lives, it will not ask again; it builds frames straight from the cache.",
        hi: "PC-A 10.1.1.20 → 0050.56aa.0002 store kar leta hai. Jab tak entry zinda hai, woh dobara nahi poochega; frames seedha cache se banenge.",
      },
      focus: ["pca"],
      tables: [{ node: "pca", title: "PC-A ARP cache", columns: ["IP address", "MAC address"], rows: [["10.1.1.20", "0050.56aa.0002"]], hl: [0] }],
    },
    {
      title: { en: "Now the ping is a normal unicast frame", hi: "Ab ping ek normal unicast frame hai" },
      text: {
        en: "The ICMP echo request is sent with destination MAC 0050.56aa.0002. SW1 already knows that MAC is on Gi0/2, so nobody else sees this frame.",
        hi: "ICMP echo request destination MAC 0050.56aa.0002 ke saath jaata hai. SW1 ko pata hai ki yeh MAC Gi0/2 par hai, isliye yeh frame kisi aur ko nahi dikhta.",
      },
      packets: [
        { path: ["pca", "sw1", "pcb"], label: "ICMP Echo", tone: "blue" },
        { path: ["pcb", "sw1", "pca"], label: "Echo Reply", tone: "blue", delay: 2 },
      ],
    },
    {
      title: { en: "Different subnet? ARP for the gateway", hi: "Doosra subnet? Gateway ke liye ARP" },
      text: {
        en: "Next PC-A pings 8.8.8.8. That is outside 10.1.1.0/24, so PC-A never ARPs for 8.8.8.8. It ARPs for its default gateway, 10.1.1.1.",
        hi: "Ab PC-A 8.8.8.8 ko ping karta hai. Yeh 10.1.1.0/24 ke bahar hai, isliye PC-A kabhi 8.8.8.8 ke liye ARP nahi karega. Woh apne default gateway 10.1.1.1 ke liye ARP karta hai.",
      },
      focus: ["pca", "r1"],
      packets: [
        { path: ["pca", "sw1"], label: "ARP 10.1.1.1?", tone: "orange" },
        { path: ["sw1", "pcb"], label: "ARP 10.1.1.1?", tone: "orange", delay: 1 },
        { path: ["sw1", "pcc"], label: "ARP 10.1.1.1?", tone: "orange", delay: 1 },
        { path: ["sw1", "r1"], label: "ARP 10.1.1.1?", tone: "orange", delay: 1 },
      ],
    },
    {
      title: { en: "R1 replies; the packet leaves via the gateway", hi: "R1 reply karta hai; packet gateway se nikalta hai" },
      text: {
        en: "R1 answers with its Gi0/0 MAC. PC-A then sends the ping with destination IP 8.8.8.8 but destination MAC 0011.2233.4401. The IP says where it is going; the MAC only says who the next hop is.",
        hi: "R1 apne Gi0/0 ka MAC bhejta hai. Phir PC-A ping bhejta hai jisme destination IP 8.8.8.8 hai, lekin destination MAC 0011.2233.4401. IP batata hai final destination kya hai; MAC sirf batata hai agla hop kaun hai.",
      },
      packets: [
        { path: ["r1", "sw1", "pca"], label: "ARP Reply", tone: "green" },
        { path: ["pca", "sw1", "r1"], label: "Ping 8.8.8.8", tone: "blue", delay: 2 },
      ],
      tables: [
        { node: "pca", title: "PC-A ARP cache", columns: ["IP address", "MAC address"], rows: [["10.1.1.20", "0050.56aa.0002"], ["10.1.1.1", "0011.2233.4401"]], hl: [1] },
        { node: "sw1", title: "SW1 MAC table", columns: ["MAC", "Port"], rows: [["0050.56aa.0001", "Gi0/1"], ["0050.56aa.0002", "Gi0/2"], ["0011.2233.4401", "Gi0/4"]], hl: [2] },
      ],
    },
  ],
};

export default scene;
