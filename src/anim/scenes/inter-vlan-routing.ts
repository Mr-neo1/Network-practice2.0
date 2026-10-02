import type { TopologyScene } from "../types.ts";

// Router-on-a-stick: PC-A (VLAN 10) pings PC-B (VLAN 20) through R1's subinterfaces.
// Colours: orange = broadcast, blue = VLAN 10 traffic, purple = VLAN 20 traffic, gray = native VLAN 99 (untagged).
// Addresses match src/content/lessons/inter-vlan-routing.ts.

const scene: TopologyScene = {
  kind: "topology",
  id: "inter-vlan-routing",
  title: { en: "Router-on-a-stick: one ping, two trips across the trunk", hi: "Router-on-a-stick: ek ping, trunk par do chakkar" },
  height: 400,
  nodes: [
    { id: "r1", kind: "router", x: 120, y: 200, label: "R1", sub: "Gi0/0 MAC", sub2: "0011.2233.4401" },
    { id: "sw1", kind: "switch", x: 400, y: 200, label: "SW1", sub: "mgmt 192.168.99.2" },
    { id: "pca", kind: "pc", x: 670, y: 95, label: "PC-A", sub: "192.168.10.10/24", sub2: "0050.56aa.0010" },
    { id: "pcb", kind: "pc", x: 670, y: 305, label: "PC-B", sub: "192.168.20.20/24", sub2: "0050.56aa.0020" },
  ],
  links: [
    { id: "l-trunk", a: "r1", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/1", style: "trunk", label: "802.1Q trunk" },
    { id: "l-a", a: "pca", b: "sw1", bPort: "Fa0/1", label: "VLAN 10" },
    { id: "l-b", a: "pcb", b: "sw1", bPort: "Fa0/2", label: "VLAN 20" },
  ],
  steps: [
    {
      title: { en: "Two VLANs, two subnets, one router port", hi: "Do VLANs, do subnets, ek router port" },
      text: {
        en: "PC-A in VLAN 10 wants to ping PC-B at 192.168.20.20. That is outside 192.168.10.0/24, so PC-A must hand the packet to its gateway, 192.168.10.1. That address lives on R1's subinterface Gi0/0.10, at the far end of SW1's trunk.",
        hi: "VLAN 10 wala PC-A, 192.168.20.20 par PC-B ko ping karna chahta hai. Yeh 192.168.10.0/24 ke bahar hai, isliye PC-A ko packet apne gateway 192.168.10.1 ko dena hoga. Yeh address R1 ke subinterface Gi0/0.10 par hai, SW1 ke trunk ke doosre end par.",
      },
      focus: ["pca", "r1"],
      tables: [
        {
          node: "r1",
          title: "R1 subinterfaces",
          columns: ["Subinterface", "VLAN", "IP address"],
          rows: [
            ["Gi0/0.10", "10", "192.168.10.1/24"],
            ["Gi0/0.20", "20", "192.168.20.1/24"],
            ["Gi0/0.99", "99 (native)", "192.168.99.1/24"],
          ],
        },
      ],
    },
    {
      title: { en: "ARP for the gateway stays in VLAN 10", hi: "Gateway ka ARP VLAN 10 mein hi rehta hai" },
      text: {
        en: "PC-A broadcasts an ARP request for 192.168.10.1. SW1 floods it only to VLAN 10 ports: up the trunk tagged 10, never out Fa0/2 to PC-B. Gi0/0.10 answers with Gi0/0's MAC, 0011.2233.4401, because every subinterface shares that one MAC.",
        hi: "PC-A 192.168.10.1 ke liye ARP request broadcast karta hai. SW1 ise sirf VLAN 10 ke ports par flood karta hai: trunk par tag 10 ke saath upar, lekin Fa0/2 se PC-B tak kabhi nahi. Gi0/0.10 Gi0/0 ka MAC 0011.2233.4401 bhej kar jawab deta hai, kyunki saare subinterfaces yahi ek MAC share karte hain.",
      },
      packets: [
        { path: ["pca", "sw1"], label: "ARP Request", tone: "orange" },
        { path: ["sw1", "r1"], label: "ARP tag 10", tone: "orange", delay: 1 },
        { path: ["r1", "sw1", "pca"], label: "ARP Reply", tone: "blue", delay: 2 },
      ],
      badges: [{ node: "pcb", text: "not in VLAN 10", tone: "gray" }],
      tables: [{ node: "pca", title: "PC-A ARP cache", columns: ["IP address", "MAC address"], rows: [["192.168.10.1", "0011.2233.4401"]], hl: [0] }],
    },
    {
      title: { en: "The ping leaves PC-A untagged", hi: "Ping PC-A se bina tag ke nikalta hai" },
      text: {
        en: "PC-A sends the echo request to destination MAC 0011.2233.4401, destination IP 192.168.20.20. Access ports never carry tags, so this is a plain Ethernet frame. SW1 knows it belongs to VLAN 10 only because Fa0/1 is a VLAN 10 access port.",
        hi: "PC-A echo request ko destination MAC 0011.2233.4401 aur destination IP 192.168.20.20 ke saath bhejta hai. Access ports par kabhi tag nahi hota, isliye yeh simple Ethernet frame hai. SW1 ko pata hai ki yeh VLAN 10 ka hai sirf isliye kyunki Fa0/1 VLAN 10 ka access port hai.",
      },
      packets: [{ path: ["pca", "sw1"], label: "Ping (no tag)", tone: "blue" }],
      badges: [{ node: "pcb", text: "" }],
      tables: [
        { node: "pca", title: "PC-A ARP cache", columns: ["IP address", "MAC address"], rows: [] },
        {
          node: "sw1",
          title: "Frame on this link",
          columns: ["Field", "Value"],
          rows: [
            ["802.1Q tag", "none"],
            ["Source MAC", "0050.56aa.0010 (PC-A)"],
            ["Destination MAC", "0011.2233.4401 (R1)"],
            ["IP", "192.168.10.10 → 192.168.20.20"],
            ["TTL", "128"],
          ],
        },
      ],
    },
    {
      title: { en: "SW1 tags it 10 and sends it up the trunk", hi: "SW1 tag 10 lagakar trunk par upar bhejta hai" },
      text: {
        en: "SW1 finds 0011.2233.4401 in VLAN 10 on Gi0/1, the trunk. Frames leave a trunk tagged, so SW1 inserts an 802.1Q tag with VLAN ID 10. The MAC addresses and IP addresses are unchanged.",
        hi: "SW1 ko 0011.2233.4401 VLAN 10 mein Gi0/1 par milta hai, jo trunk hai. Trunk se frames tag ke saath nikalte hain, isliye SW1 VLAN ID 10 wala 802.1Q tag jod deta hai. MAC addresses aur IP addresses waise hi rehte hain.",
      },
      packets: [{ path: ["sw1", "r1"], label: "Ping tag 10", tone: "blue" }],
      links: [{ id: "l-trunk", state: "active" }],
      tables: [
        {
          node: "sw1",
          title: "Frame on this link",
          columns: ["Field", "Value"],
          rows: [
            ["802.1Q tag", "VLAN 10"],
            ["Source MAC", "0050.56aa.0010 (PC-A)"],
            ["Destination MAC", "0011.2233.4401 (R1)"],
            ["IP", "192.168.10.10 → 192.168.20.20"],
            ["TTL", "128"],
          ],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "R1 routes from Gi0/0.10 to Gi0/0.20", hi: "R1 Gi0/0.10 se Gi0/0.20 par route karta hai" },
      text: {
        en: "Tag 10 matches encapsulation dot1Q 10, so the packet arrived on Gi0/0.10. R1 strips the Ethernet header, finds 192.168.20.20 in the connected network 192.168.20.0/24 out Gi0/0.20, and lowers the TTL from 128 to 127. PC-B's MAC comes from R1's ARP table, learned by an ARP out Gi0/0.20.",
        hi: "Tag 10 encapsulation dot1Q 10 se match hota hai, isliye packet Gi0/0.10 par aaya maana jaata hai. R1 Ethernet header hata deta hai, 192.168.20.20 ko Gi0/0.20 wale connected network 192.168.20.0/24 mein paata hai, aur TTL 128 se 127 kar deta hai. PC-B ka MAC R1 ki ARP table se aata hai, jo Gi0/0.20 par ARP karke seekha gaya tha.",
      },
      focus: ["r1"],
      badges: [{ node: "r1", text: "routing", tone: "teal" }],
      tables: [
        {
          node: "r1",
          title: "R1 routing table (connected)",
          columns: ["Code", "Network", "Interface"],
          rows: [
            ["C", "192.168.10.0/24", "Gi0/0.10"],
            ["C", "192.168.20.0/24", "Gi0/0.20"],
            ["C", "192.168.99.0/24", "Gi0/0.99"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "Back down the same trunk, tagged 20", hi: "Usi trunk se wapas neeche, tag 20 ke saath" },
      text: {
        en: "R1 builds a new frame for Gi0/0.20: source MAC its own 0011.2233.4401, destination MAC PC-B's 0050.56aa.0020, and an 802.1Q tag of 20. It leaves on the same cable it arrived on. That U-turn is why this design is called router-on-a-stick.",
        hi: "R1 Gi0/0.20 ke liye naya frame banata hai: source MAC uska apna 0011.2233.4401, destination MAC PC-B ka 0050.56aa.0020, aur 802.1Q tag 20. Frame usi cable se nikalta hai jisse aaya tha. Isi U-turn ki wajah se is design ko router-on-a-stick kehte hain.",
      },
      packets: [{ path: ["r1", "sw1"], label: "Ping tag 20", tone: "purple" }],
      badges: [{ node: "r1", text: "" }],
      links: [{ id: "l-trunk", state: "active", note: "up tag 10, down tag 20" }],
      tables: [
        {
          node: "sw1",
          title: "Frame on this link",
          columns: ["Field", "Value"],
          rows: [
            ["802.1Q tag", "VLAN 20"],
            ["Source MAC", "0011.2233.4401 (R1)"],
            ["Destination MAC", "0050.56aa.0020 (PC-B)"],
            ["IP", "192.168.10.10 → 192.168.20.20"],
            ["TTL", "127"],
          ],
          hl: [0, 1, 2, 4],
        },
      ],
    },
    {
      title: { en: "SW1 removes the tag and delivers to PC-B", hi: "SW1 tag hata kar PC-B ko deliver karta hai" },
      text: {
        en: "SW1 reads tag 20, finds 0050.56aa.0020 on Fa0/2 in VLAN 20, removes the tag and sends a plain frame out Fa0/2. PC-B receives an echo request from 192.168.10.10 inside a frame from R1's MAC. The IP addresses never changed on the way.",
        hi: "SW1 tag 20 padhta hai, 0050.56aa.0020 ko VLAN 20 mein Fa0/2 par paata hai, tag hata deta hai aur simple frame Fa0/2 se bhejta hai. PC-B ko 192.168.10.10 ka echo request milta hai, lekin frame R1 ke MAC se aaya hota hai. Raaste mein IP addresses kabhi nahi badle.",
      },
      packets: [{ path: ["sw1", "pcb"], label: "Ping (no tag)", tone: "purple" }],
      links: [{ id: "l-trunk", state: "normal" }],
      tables: [
        {
          node: "sw1",
          title: "Frame on this link",
          columns: ["Field", "Value"],
          rows: [
            ["802.1Q tag", "none"],
            ["Source MAC", "0011.2233.4401 (R1)"],
            ["Destination MAC", "0050.56aa.0020 (PC-B)"],
            ["IP", "192.168.10.10 → 192.168.20.20"],
            ["TTL", "127"],
          ],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "The reply makes the same U-turn", hi: "Reply bhi wahi U-turn leta hai" },
      text: {
        en: "PC-B sends its echo reply to its own gateway, 192.168.20.1, using R1's MAC. It crosses the trunk twice again: up tagged 20, routed from Gi0/0.20 to Gi0/0.10, down tagged 10. Every packet between the VLANs uses the trunk twice, which is the main limit of this design.",
        hi: "PC-B apna echo reply apne gateway 192.168.20.1 ko, R1 ke MAC par bhejta hai. Yeh phir se trunk ko do baar cross karta hai: upar tag 20, phir Gi0/0.20 se Gi0/0.10 par route, aur neeche tag 10. VLANs ke beech har packet trunk ko do baar use karta hai, aur yahi is design ki sabse badi limit hai.",
      },
      packets: [
        { path: ["pcb", "sw1"], label: "Reply (no tag)", tone: "purple" },
        { path: ["sw1", "r1"], label: "Reply tag 20", tone: "purple", delay: 1 },
        { path: ["r1", "sw1"], label: "Reply tag 10", tone: "blue", delay: 2 },
        { path: ["sw1", "pca"], label: "Reply (no tag)", tone: "blue", delay: 3 },
      ],
      links: [{ id: "l-trunk", state: "active", note: "every packet crosses twice" }],
      tables: [{ node: "sw1", title: "Frame on this link", columns: ["Field", "Value"], rows: [] }],
    },
    {
      title: { en: "Native VLAN 99 crosses untagged", hi: "Native VLAN 99 bina tag ke jaata hai" },
      text: {
        en: "Now SW1 pings its own gateway, 192.168.99.1, from its management address 192.168.99.2. VLAN 99 is the trunk's native VLAN, so the frames cross with no tag in both directions. R1 accepts them on Gi0/0.99 only because that subinterface has encapsulation dot1Q 99 native; without native, they would never reach it.",
        hi: "Ab SW1 apne management address 192.168.99.2 se apne gateway 192.168.99.1 ko ping karta hai. VLAN 99 trunk ka native VLAN hai, isliye frames dono taraf bina tag ke jaate hain. R1 inhe Gi0/0.99 par sirf isliye accept karta hai kyunki us subinterface par encapsulation dot1Q 99 native hai; native ke bina yeh us tak kabhi nahi pahunchte.",
      },
      focus: ["sw1", "r1"],
      packets: [
        { path: ["sw1", "r1"], label: "Ping (no tag)", tone: "gray" },
        { path: ["r1", "sw1"], label: "Reply (no tag)", tone: "gray", delay: 1 },
      ],
      links: [{ id: "l-trunk", state: "active", note: "VLAN 99 untagged" }],
      tables: [
        {
          node: "r1",
          title: "R1 subinterfaces",
          columns: ["Subinterface", "VLAN", "IP address"],
          rows: [
            ["Gi0/0.10", "10", "192.168.10.1/24"],
            ["Gi0/0.20", "20", "192.168.20.1/24"],
            ["Gi0/0.99", "99 (native)", "192.168.99.1/24"],
          ],
          hl: [2],
        },
      ],
    },
  ],
};

export default scene;
