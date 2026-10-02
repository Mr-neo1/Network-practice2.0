import type { TopologyScene } from "../types.ts";

// Three Catalyst 2960s in a triangle, VLAN 1, all priorities left at the default 32768 (32769 with VLAN 1).
// Triangle links are 1 Gbps (802.1D cost 4). PCs sit on Fa0/1.
// Colours: orange = broadcast data frame, purple = BPDU, blue = unicast data.
// SW2 and SW3 carry no badges because their diagonal port labels sit where a badge would go;
// their port roles are shown with link notes and the "Port roles" table instead.

const scene: TopologyScene = {
  kind: "topology",
  id: "stp",
  title: { en: "A Layer 2 loop, then STP elects a root, blocks one port and recovers", hi: "Layer 2 loop, phir STP root chunta hai, ek port block karta hai aur recover karta hai" },
  height: 400,
  nodes: [
    { id: "sw1", kind: "switch", x: 400, y: 90, label: "SW1", sub: "prio 32769", sub2: "0019.aa00.0001" },
    { id: "sw2", kind: "switch", x: 220, y: 270, label: "SW2", sub: "prio 32769", sub2: "0019.aa00.0002" },
    { id: "sw3", kind: "switch", x: 580, y: 270, label: "SW3", sub: "prio 32769", sub2: "0019.aa00.0003" },
    { id: "pca", kind: "pc", x: 80, y: 270, label: "PC-A", sub: "0050.56aa.0001" },
    { id: "pcb", kind: "pc", x: 720, y: 270, label: "PC-B", sub: "0050.56aa.0002" },
  ],
  links: [
    { id: "l12", a: "sw1", b: "sw2", aPort: "Gi0/1", bPort: "Gi0/1", label: "cost 4" },
    { id: "l13", a: "sw1", b: "sw3", aPort: "Gi0/2", bPort: "Gi0/1", label: "cost 4" },
    { id: "l23", a: "sw2", b: "sw3", aPort: "Gi0/2", bPort: "Gi0/2", label: "cost 4" },
    { id: "la", a: "pca", b: "sw2", bPort: "Fa0/1" },
    { id: "lb", a: "pcb", b: "sw3", bPort: "Fa0/1" },
  ],
  steps: [
    {
      title: { en: "Three switches, three links, one loop", hi: "Teen switch, teen link, ek loop" },
      text: {
        en: "SW1, SW2 and SW3 are cabled in a triangle so that any one link can fail without cutting a switch off. Every triangle link is 1 Gbps. For now Spanning Tree is off, so every port forwards and nothing stops a frame from going round and round.",
        hi: "SW1, SW2 aur SW3 triangle mein cable kiye gaye hain, taaki koi bhi ek link fail ho toh koi switch cut off na ho. Triangle ka har link 1 Gbps ka hai. Abhi Spanning Tree off hai, isliye har port forward kar raha hai aur frame ko gol gol ghoomne se koi nahi rokta.",
      },
      focus: ["sw1", "sw2", "sw3"],
    },
    {
      title: { en: "One broadcast circles forever", hi: "Ek broadcast hamesha ghoomta rehta hai" },
      text: {
        en: "PC-A sends one ARP request to FFFF.FFFF.FFFF. SW2 floods it to SW1 and SW3, each of them floods it on, and the two copies circle the triangle in opposite directions for ever, because an Ethernet header has no TTL. Every lap drops another duplicate on PC-B and PC-A, and every new broadcast adds two more endless copies: a broadcast storm.",
        hi: "PC-A ek ARP request FFFF.FFFF.FFFF par bhejta hai. SW2 use SW1 aur SW3 ki taraf flood karta hai, dono aage flood kar dete hain, aur do copies opposite directions mein triangle ke chakkar lagati rehti hain, kyunki Ethernet header mein TTL hota hi nahi. Har chakkar par PC-B aur PC-A ko ek aur duplicate milta hai, aur har naya broadcast do aur kabhi na khatam hone wali copies jod deta hai: yahi broadcast storm hai.",
      },
      packets: [
        { path: ["pca", "sw2"], label: "ARP broadcast", tone: "orange" },
        { path: ["sw2", "sw1", "sw3", "sw2", "sw1"], label: "ARP broadcast", tone: "orange", delay: 1 },
        { path: ["sw2", "sw3", "sw1", "sw2", "sw3"], label: "ARP broadcast", tone: "orange", delay: 1 },
        { path: ["sw3", "pcb"], label: "copy 1", tone: "orange", delay: 2 },
        { path: ["sw3", "pcb"], label: "copy 2", tone: "orange", delay: 3 },
        { path: ["sw2", "pca"], label: "own frame", tone: "orange", delay: 4 },
        { path: ["sw3", "pcb"], label: "copy 3", tone: "orange", delay: 5 },
      ],
      links: [
        { id: "l12", state: "active", note: "looping" },
        { id: "l13", state: "active", note: "looping" },
        { id: "l23", state: "active", note: "looping" },
      ],
      badges: [{ node: "pcb", text: "duplicates", tone: "red" }],
    },
    {
      title: { en: "MAC tables flap", hi: "MAC tables flap karti hain" },
      text: {
        en: "Every looping copy still carries PC-A's MAC as its source. As the copies come back into SW2 on Gi0/1 and Gi0/2, SW2 moves 0050.56aa.0001 away from Fa0/1, to Gi0/1, then Gi0/2, again and again, so frames for PC-A are sent into the loop instead of to PC-A. IOS logs this as %SW_MATM-4-MACFLAP_NOTIF.",
        hi: "Har looping copy ka source MAC ab bhi PC-A ka hai. Jab copies SW2 mein Gi0/1 aur Gi0/2 se wapas aati hain, SW2 0050.56aa.0001 ko Fa0/1 se hata kar kabhi Gi0/1 par, kabhi Gi0/2 par likhta rehta hai, isliye PC-A ke liye aane wale frames PC-A ki jagah loop mein chale jaate hain. IOS iske liye %SW_MATM-4-MACFLAP_NOTIF message log karta hai.",
      },
      focus: ["sw2"],
      packets: [
        { path: ["sw1", "sw2"], label: "src PC-A", tone: "orange" },
        { path: ["sw3", "sw2"], label: "src PC-A", tone: "orange", delay: 1 },
      ],
      tables: [
        {
          node: "sw2",
          title: "SW2 MAC table",
          columns: ["MAC address", "Port"],
          rows: [["0050.56aa.0001", "Gi0/1 → Gi0/2 → Gi0/1 ... (should be Fa0/1)"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "STP on: every switch claims to be root", hi: "STP on: har switch khud ko root bolta hai" },
      text: {
        en: "Now STP runs, as it does by default on Cisco switches. Each switch starts by assuming it is the root and sends BPDUs carrying its own bridge ID: priority 32769 (32768 plus VLAN 1) and its MAC. While the switches compare, no port forwards data frames, so the loop cannot start.",
        hi: "Ab STP chal raha hai, jaise Cisco switches par by default chalta hai. Har switch shuru mein maanta hai ki root wahi hai aur apne bridge ID ke saath BPDUs bhejta hai: priority 32769 (32768 plus VLAN 1) aur apna MAC. Jab tak switches compare kar rahe hain, koi port data frame forward nahi karta, isliye loop shuru hi nahi ho paata.",
      },
      reset: true,
      packets: [
        { path: ["sw1", "sw2"], label: "BPDU root SW1", tone: "purple" },
        { path: ["sw1", "sw3"], label: "BPDU root SW1", tone: "purple" },
        { path: ["sw2", "sw1"], label: "BPDU root SW2", tone: "purple" },
        { path: ["sw2", "sw3"], label: "BPDU root SW2", tone: "purple" },
        { path: ["sw3", "sw1"], label: "BPDU root SW3", tone: "purple" },
        { path: ["sw3", "sw2"], label: "BPDU root SW3", tone: "purple" },
      ],
      tables: [
        {
          node: "sw1",
          title: "Bridge IDs (VLAN 1)",
          columns: ["Switch", "Priority", "MAC address"],
          rows: [
            ["SW1", "32769", "0019.aa00.0001"],
            ["SW2", "32769", "0019.aa00.0002"],
            ["SW3", "32769", "0019.aa00.0003"],
          ],
        },
      ],
    },
    {
      title: { en: "Lowest bridge ID wins: SW1 is root", hi: "Sabse kam bridge ID jeetta hai: SW1 root hai" },
      text: {
        en: "The priorities tie, so the lowest MAC decides: 0019.aa00.0001, SW1. SW2 and SW3 stop claiming; SW1 now originates a BPDU every 2 seconds with root path cost 0, and SW2 and SW3 pass it on to each other with their own cost to the root, 4, filled in. Every port on the root bridge becomes a designated port.",
        hi: "Priorities barabar hain, isliye sabse kam MAC decide karta hai: 0019.aa00.0001, yaani SW1. SW2 aur SW3 claim karna band kar dete hain; ab SW1 har 2 second mein root path cost 0 ke saath BPDU bhejta hai, aur SW2 aur SW3 use ek doosre ko aage bhejte hain, apni root tak ki cost 4 bhar kar. Root bridge ka har port designated port ban jaata hai.",
      },
      focus: ["sw1"],
      packets: [
        { path: ["sw1", "sw2"], label: "BPDU cost 0", tone: "purple" },
        { path: ["sw1", "sw3"], label: "BPDU cost 0", tone: "purple" },
        { path: ["sw2", "sw3"], label: "BPDU cost 4", tone: "purple", delay: 1 },
        { path: ["sw3", "sw2"], label: "BPDU cost 4", tone: "purple", delay: 1 },
      ],
      badges: [{ node: "sw1", text: "ROOT", tone: "purple" }],
      tables: [
        {
          node: "sw1",
          title: "Bridge IDs (VLAN 1)",
          columns: ["Switch", "Priority", "MAC address"],
          rows: [
            ["SW1 (root)", "32769", "0019.aa00.0001"],
            ["SW2", "32769", "0019.aa00.0002"],
            ["SW3", "32769", "0019.aa00.0003"],
          ],
          hl: [0],
        },
        {
          node: "sw2",
          title: "Port roles",
          columns: ["Port", "Role", "State"],
          rows: [
            ["SW1 Gi0/1", "Designated", "Listening"],
            ["SW1 Gi0/2", "Designated", "Listening"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Root ports: each switch's best path to SW1", hi: "Root ports: har switch ka SW1 tak best path" },
      text: {
        en: "SW2 can reach SW1 straight through Gi0/1 (cost 4) or round through SW3 via Gi0/2 (4 + 4 = 8). The lowest root path cost wins, so Gi0/1 becomes SW2's root port. SW3 does the same sum and also picks its Gi0/1.",
        hi: "SW2 SW1 tak seedha Gi0/1 se pahunch sakta hai (cost 4), ya ghoom kar SW3 ke through Gi0/2 se (4 + 4 = 8). Sabse kam root path cost jeetti hai, isliye Gi0/1 SW2 ka root port ban jaata hai. SW3 bhi yahi hisaab lagata hai aur apna Gi0/1 chunta hai.",
      },
      focus: ["sw2", "sw3"],
      links: [
        { id: "l12", state: "normal", note: "SW2 Gi0/1 = RP" },
        { id: "l13", state: "normal", note: "SW3 Gi0/1 = RP" },
      ],
      tables: [
        {
          node: "sw2",
          title: "Port roles",
          columns: ["Port", "Role", "State"],
          rows: [
            ["SW1 Gi0/1", "Designated", "Listening"],
            ["SW1 Gi0/2", "Designated", "Listening"],
            ["SW2 Gi0/1", "Root", "Listening"],
            ["SW3 Gi0/1", "Root", "Listening"],
          ],
          hl: [2, 3],
        },
      ],
    },
    {
      title: { en: "One designated port per link; one port blocks", hi: "Har link par ek designated port; ek port block" },
      text: {
        en: "On the SW2-SW3 link both switches advertise the same cost to the root, 4. The tie goes to the lower bridge ID, SW2 (0019.aa00.0002), so SW2 Gi0/2 is the designated port. SW3 Gi0/2 is neither root nor designated, so it becomes non-designated and blocks: the loop is broken.",
        hi: "SW2-SW3 link par dono switches root tak ki same cost 4 advertise karte hain. Tie mein kam bridge ID jeetta hai, yaani SW2 (0019.aa00.0002), isliye SW2 Gi0/2 designated port hai. SW3 Gi0/2 na root hai na designated, isliye woh non-designated ban kar block ho jaata hai: loop toot gaya.",
      },
      focus: ["sw2", "sw3"],
      links: [{ id: "l23", state: "blocked", note: "SW3 Gi0/2 blocks" }],
      tables: [
        {
          node: "sw2",
          title: "Port roles",
          columns: ["Port", "Role", "State"],
          rows: [
            ["SW1 Gi0/1", "Designated", "Listening"],
            ["SW1 Gi0/2", "Designated", "Listening"],
            ["SW2 Gi0/1", "Root", "Listening"],
            ["SW3 Gi0/1", "Root", "Listening"],
            ["SW2 Gi0/2", "Designated", "Listening"],
            ["SW3 Gi0/2", "Non-designated", "Blocking"],
          ],
          hl: [4, 5],
        },
      ],
    },
    {
      title: { en: "30 seconds later: one copy of each frame", hi: "30 second baad: har frame ki sirf ek copy" },
      text: {
        en: "Before forwarding, each port spends 15 seconds in listening and 15 in learning, so data flows about 30 seconds after the ports came up. Now PC-A's broadcast travels SW2, SW1, SW3 to PC-B exactly once, and the copy SW2 sends out Gi0/2 is discarded by SW3's blocking port.",
        hi: "Forward karne se pehle har port 15 second listening mein aur 15 second learning mein bitata hai, isliye ports up hone ke lagbhag 30 second baad data chalta hai. Ab PC-A ka broadcast SW2, SW1, SW3 se hota hua PC-B tak sirf ek baar pahunchta hai, aur jo copy SW2 Gi0/2 se bhejta hai use SW3 ka blocking port discard kar deta hai.",
      },
      packets: [
        { path: ["pca", "sw2"], label: "ARP broadcast", tone: "orange" },
        { path: ["sw2", "sw1", "sw3", "pcb"], label: "ARP broadcast", tone: "orange", delay: 1 },
        { path: ["sw2", "sw3"], label: "ARP broadcast", tone: "orange", delay: 1, drop: true },
      ],
      badges: [{ node: "pcb", text: "one copy", tone: "green" }],
      tables: [
        {
          node: "sw2",
          title: "Port roles",
          columns: ["Port", "Role", "State"],
          rows: [
            ["SW1 Gi0/1", "Designated", "Forwarding"],
            ["SW1 Gi0/2", "Designated", "Forwarding"],
            ["SW2 Gi0/1", "Root", "Forwarding"],
            ["SW3 Gi0/1", "Root", "Forwarding"],
            ["SW2 Gi0/2", "Designated", "Forwarding"],
            ["SW3 Gi0/2", "Non-designated", "Blocking"],
          ],
          hl: [0, 1, 2, 3, 4],
        },
      ],
    },
    {
      title: { en: "SW1-SW3 fails: SW3 loses its root port", hi: "SW1-SW3 fail: SW3 ka root port gaya" },
      text: {
        en: "The SW1-SW3 link goes down and SW3 notices at once. It still holds the BPDU SW2 keeps sending to Gi0/2 (root SW1, cost 4), so Gi0/2 becomes its new root port with cost 4 + 4 = 8. But a blocked port must pass through listening and learning first, so for now PC-B's frames have nowhere to go.",
        hi: "SW1-SW3 link down hota hai aur SW3 ko turant pata chal jaata hai. Uske paas ab bhi woh BPDU hai jo SW2 lagataar Gi0/2 par bhej raha hai (root SW1, cost 4), isliye Gi0/2 cost 4 + 4 = 8 ke saath naya root port ban jaata hai. Lekin blocked port ko pehle listening aur learning se guzarna padta hai, isliye abhi PC-B ke frames ke paas jaane ka koi raasta nahi.",
      },
      focus: ["sw3"],
      links: [
        { id: "l13", state: "down", note: "failed" },
        { id: "l23", state: "blocked", note: "SW3 Gi0/2: listening" },
      ],
      packets: [
        { path: ["sw2", "sw3"], label: "BPDU cost 4", tone: "purple" },
        { path: ["pcb", "sw3"], label: "Data", tone: "blue", drop: true },
      ],
      badges: [{ node: "pcb", text: "cut off", tone: "red" }],
      tables: [
        {
          node: "sw2",
          title: "Port roles",
          columns: ["Port", "Role", "State"],
          rows: [
            ["SW1 Gi0/1", "Designated", "Forwarding"],
            ["SW1 Gi0/2", "none (link down)", "Disabled"],
            ["SW2 Gi0/1", "Root", "Forwarding"],
            ["SW3 Gi0/1", "none (link down)", "Disabled"],
            ["SW2 Gi0/2", "Designated", "Forwarding"],
            ["SW3 Gi0/2", "Root", "Listening"],
          ],
          hl: [1, 3, 5],
        },
      ],
    },
    {
      title: { en: "About 30 seconds later, SW3 forwards again", hi: "Lagbhag 30 second baad SW3 phir forward karta hai" },
      text: {
        en: "After 15 seconds of listening and 15 of learning, SW3 Gi0/2 forwards and PC-B reaches PC-A through SW3 and SW2. Because the topology changed, the switches age out MAC entries after 15 seconds instead of 300. If SW3 had only stopped hearing the root's BPDUs, with no link of its own going down, it would first wait Max Age (20 s): about 50 seconds in all.",
        hi: "15 second listening aur 15 second learning ke baad SW3 Gi0/2 forward karne lagta hai aur PC-B, SW3 aur SW2 ke through PC-A tak pahunch jaata hai. Topology badli hai, isliye switches MAC entries ko 300 ki jagah 15 second mein age out karte hain. Agar SW3 ka apna koi link down na hota aur use bas root ke BPDUs milna band ho jaate, toh woh pehle Max Age (20 s) wait karta: kul milakar lagbhag 50 second.",
      },
      links: [{ id: "l23", state: "normal", note: "SW3 Gi0/2 = RP" }],
      packets: [{ path: ["pcb", "sw3", "sw2", "pca"], label: "Data", tone: "blue" }],
      badges: [{ node: "pcb", text: "back online", tone: "green" }],
      tables: [
        {
          node: "sw2",
          title: "Port roles",
          columns: ["Port", "Role", "State"],
          rows: [
            ["SW1 Gi0/1", "Designated", "Forwarding"],
            ["SW1 Gi0/2", "none (link down)", "Disabled"],
            ["SW2 Gi0/1", "Root", "Forwarding"],
            ["SW3 Gi0/1", "none (link down)", "Disabled"],
            ["SW2 Gi0/2", "Designated", "Forwarding"],
            ["SW3 Gi0/2", "Root", "Forwarding"],
          ],
          hl: [5],
        },
      ],
    },
  ],
};

export default scene;
