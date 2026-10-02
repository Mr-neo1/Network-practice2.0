import type { TopologyScene } from "../types.ts";

// SW1 and SW2 joined by four 1 Gbps cables, Gi0/1-Gi0/4 on both sides (drawn as one bundle line;
// the member tables show each cable). All hosts are in VLAN 10, 10.1.10.0/24.
// Colours: gray = STP BPDU, purple = LACPDU, blue = PC-A's flow, teal = PC-B's flow, pink = PC-C's flow.

const scene: TopologyScene = {
  kind: "topology",
  id: "etherchannel",
  title: { en: "Four cables become one port-channel", hi: "Chaar cables ek port-channel ban jaate hain" },
  height: 420,
  nodes: [
    { id: "pca", kind: "pc", x: 90, y: 90, label: "PC-A", sub: "10.1.10.11" },
    { id: "pcb", kind: "pc", x: 90, y: 210, label: "PC-B", sub: "10.1.10.12" },
    { id: "pcc", kind: "pc", x: 90, y: 330, label: "PC-C", sub: "10.1.10.13" },
    { id: "sw1", kind: "switch", x: 280, y: 210, label: "SW1", sub: "Gi0/1-4 to SW2" },
    { id: "sw2", kind: "switch", x: 520, y: 210, label: "SW2", sub: "Gi0/1-4 to SW1" },
    { id: "srv1", kind: "server", x: 710, y: 130, label: "SRV1", sub: "10.1.10.101" },
    { id: "srv2", kind: "server", x: 710, y: 290, label: "SRV2", sub: "10.1.10.102" },
  ],
  links: [
    { id: "l-a", a: "pca", b: "sw1", bPort: "Gi0/5" },
    { id: "l-b", a: "pcb", b: "sw1", bPort: "Gi0/6" },
    { id: "l-c", a: "pcc", b: "sw1", bPort: "Gi0/7" },
    { id: "l-po", a: "sw1", b: "sw2", style: "bundle", label: "4 x 1 Gbps" },
    { id: "l-s1", a: "sw2", b: "srv1", aPort: "Gi0/5" },
    { id: "l-s2", a: "sw2", b: "srv2", aPort: "Gi0/6" },
  ],
  steps: [
    {
      title: { en: "Four cables, and STP sees a loop", hi: "Chaar cables, aur STP ko loop dikhta hai" },
      text: {
        en: "SW1 and SW2 are joined by four 1 Gbps cables, Gi0/1 to Gi0/4 on each side. Without EtherChannel, STP treats them as four separate paths between the same two switches, which is a loop. STP breaks it: SW2 keeps Gi0/1 forwarding and blocks Gi0/2-4 (SW1 is the root bridge here; lessons 2.6-2.7 explain how STP picks which ports block).",
        hi: "SW1 aur SW2 chaar 1 Gbps cables se jude hain, dono taraf Gi0/1 se Gi0/4. EtherChannel ke bina STP inhe same do switches ke beech chaar alag paths maanta hai, yaani loop. STP use todta hai: SW2 Gi0/1 ko forwarding rakhta hai aur Gi0/2-4 ko block kar deta hai (yahan SW1 root bridge hai; STP kaunse ports block karta hai, yeh lessons 2.6-2.7 mein aayega).",
      },
      focus: ["sw1", "sw2"],
      packets: [{ path: ["sw1", "sw2"], label: "BPDUs", tone: "gray" }],
      links: [{ id: "l-po", state: "normal", note: "1 of 4 forwarding" }],
      tables: [
        {
          node: "sw2",
          title: "SW2 STP ports to SW1",
          columns: ["Port", "STP state"],
          rows: [
            ["Gi0/1", "Forwarding"],
            ["Gi0/2", "Blocking"],
            ["Gi0/3", "Blocking"],
            ["Gi0/4", "Blocking"],
          ],
          hl: [1, 2, 3],
        },
      ],
    },
    {
      title: { en: "Every flow squeezes through Gi0/1", hi: "Har flow Gi0/1 se hi nikalta hai" },
      text: {
        en: "PC-A, PC-B and PC-C all send to the servers, and every frame crosses on Gi0/1, the only forwarding cable. The three flows share 1 Gbps while 3 Gbps of cable sits idle. If Gi0/1 fails, STP must bring a blocked port to forwarding, which takes about 30 seconds with classic STP.",
        hi: "PC-A, PC-B aur PC-C teeno servers ko data bhejte hain, aur har frame Gi0/1 se hi jaata hai, kyunki forwarding cable sirf wahi hai. Teeno flows 1 Gbps share karte hain aur 3 Gbps ka cable khaali pada rehta hai. Gi0/1 fail hua toh STP ko ek blocked port forwarding mein laana padega, jisme classic STP ko lagbhag 30 second lagte hain.",
      },
      packets: [
        { path: ["pca", "sw1", "sw2", "srv1"], label: "PC-A→SRV1", tone: "blue" },
        { path: ["pcb", "sw1", "sw2", "srv2"], label: "PC-B→SRV2", tone: "teal", delay: 0.4 },
        { path: ["pcc", "sw1", "sw2", "srv1"], label: "PC-C→SRV1", tone: "pink", delay: 0.8 },
      ],
      links: [{ id: "l-po", state: "normal", note: "all on Gi0/1" }],
    },
    {
      title: { en: "LACP: SW1 active, SW2 passive", hi: "LACP: SW1 active, SW2 passive" },
      text: {
        en: "The admin puts Gi0/1-4 into channel-group 1 on both switches: `mode active` on SW1, `mode passive` on SW2. An active port starts LACP; a passive port only answers. SW1 sends an LACPDU on each of the four cables, carrying its system ID, key and port number.",
        hi: "Admin dono switches par Gi0/1-4 ko channel-group 1 mein daalta hai: SW1 par `mode active`, SW2 par `mode passive`. Active port LACP shuru karta hai; passive port sirf jawab deta hai. SW1 chaaron cables par ek-ek LACPDU bhejta hai, jisme uska system ID, key aur port number hota hai.",
      },
      focus: ["sw1"],
      badges: [
        { node: "sw1", text: "LACP active", tone: "purple" },
        { node: "sw2", text: "LACP passive", tone: "purple" },
      ],
      packets: [{ path: ["sw1", "sw2"], label: "LACPDU x4", tone: "purple" }],
      links: [{ id: "l-po", state: "normal", note: "negotiating" }],
    },
    {
      title: { en: "SW2 answers and the settings match", hi: "SW2 jawab deta hai, settings match hoti hain" },
      text: {
        en: "SW2's passive ports answer with their own LACPDUs. Each switch now sees the same partner on all four ports, and the ports match on speed, duplex and switchport settings, so all four are bundled. SW1 flags them (P).",
        hi: "SW2 ke passive ports apne LACPDUs se jawab dete hain. Ab dono switches ko chaaron ports par same partner dikhta hai, aur ports ki speed, duplex aur switchport settings match karti hain, isliye chaaron bundle ho jaate hain. SW1 unhe (P) flag deta hai.",
      },
      focus: ["sw2"],
      packets: [{ path: ["sw2", "sw1"], label: "LACPDU x4", tone: "purple" }],
      tables: [
        {
          node: "sw1",
          title: "SW1 Po1 members",
          columns: ["Port", "Flag"],
          rows: [
            ["Gi0/1", "P (bundled)"],
            ["Gi0/2", "P (bundled)"],
            ["Gi0/3", "P (bundled)"],
            ["Gi0/4", "P (bundled)"],
          ],
          hl: [0, 1, 2, 3],
        },
      ],
    },
    {
      title: { en: "Po1 is up: STP sees one link", hi: "Po1 up hai: STP ko ek hi link dikhta hai" },
      text: {
        en: "The four ports now act as one interface, Port-channel1. STP runs on Po1 as a single port, so there is no loop and nothing to block: all four cables forward. `show etherchannel summary` would show Po1(SU), meaning Layer 2 and in use.",
        hi: "Chaaron ports ab ek interface ki tarah kaam karte hain, Port-channel1. STP Po1 ko ek hi port maan kar chalta hai, toh na loop hai na kuch block karna hai: chaaron cables forward karte hain. `show etherchannel summary` mein Po1(SU) dikhega, matlab Layer 2 aur in use.",
      },
      badges: [
        { node: "sw1", text: "Po1 (SU)", tone: "green" },
        { node: "sw2", text: "Po1 (SU)", tone: "green" },
      ],
      packets: [{ path: ["sw1", "sw2"], label: "BPDU on Po1", tone: "gray" }],
      links: [{ id: "l-po", state: "normal", note: "Po1 = 4 Gbps" }],
      tables: [{ node: "sw2", title: "SW2 STP ports to SW1", columns: ["Port", "STP state"], rows: [["Po1 (Gi0/1-4)", "Forwarding"]], hl: [0] }],
    },
    {
      title: { en: "Each flow is hashed to one member", hi: "Har flow hash hokar ek member par jaata hai" },
      text: {
        en: "The admin has set SW1 to `src-dst-ip` load balancing (a 2960 defaults to `src-mac`): it hashes each frame's source and destination IP to pick a member. In this example PC-A→SRV1 lands on Gi0/1, PC-B→SRV2 on Gi0/2 and PC-C→SRV1 on Gi0/3, while Gi0/4 happens to get nothing. The same address pair always gives the same member, so frames of a flow stay in order.",
        hi: "Admin ne SW1 par `src-dst-ip` load balancing set kiya hai (2960 ka default `src-mac` hai): har frame ke source aur destination IP ka hash nikaal kar member chunta hai. Is example mein PC-A→SRV1 Gi0/1 par, PC-B→SRV2 Gi0/2 par aur PC-C→SRV1 Gi0/3 par jaata hai, aur Gi0/4 ke hisse kuch nahi aaya. Same address pair hamesha same member deta hai, isliye ek flow ke frames order mein pahunchte hain.",
      },
      packets: [
        { path: ["pca", "sw1", "sw2", "srv1"], label: "A→SRV1 on Gi0/1", tone: "blue" },
        { path: ["pcb", "sw1", "sw2", "srv2"], label: "B→SRV2 on Gi0/2", tone: "teal", delay: 0.4 },
        { path: ["pcc", "sw1", "sw2", "srv1"], label: "C→SRV1 on Gi0/3", tone: "pink", delay: 0.8 },
      ],
      tables: [
        {
          node: "sw1",
          title: "SW1 Po1 members",
          columns: ["Port", "Flag", "Flow sent"],
          rows: [
            ["Gi0/1", "P", "PC-A→SRV1"],
            ["Gi0/2", "P", "PC-B→SRV2"],
            ["Gi0/3", "P", "PC-C→SRV1"],
            ["Gi0/4", "P", "-"],
          ],
          hl: [0, 1, 2],
        },
      ],
    },
    {
      title: { en: "One flow never beats one cable", hi: "Ek flow ek cable se tez nahi ho sakta" },
      text: {
        en: "PC-A starts a large file copy to SRV1. Every frame of it has the same source and destination IP, so every frame hashes to Gi0/1. This single flow tops out at 1 Gbps even though Po1 is 4 Gbps: EtherChannel adds capacity for many flows, not speed for one.",
        hi: "PC-A SRV1 par ek badi file copy shuru karta hai. Uske har frame ka source aur destination IP same hai, isliye har frame Gi0/1 par hi hash hota hai. Po1 4 Gbps ka hai, phir bhi yeh ek flow 1 Gbps se upar nahi jaayega: EtherChannel bahut saare flows ke liye capacity badhata hai, ek flow ki speed nahi.",
      },
      focus: ["pca", "srv1"],
      packets: [
        { path: ["pca", "sw1", "sw2", "srv1"], label: "A→SRV1 on Gi0/1", tone: "blue" },
        { path: ["pca", "sw1", "sw2", "srv1"], label: "A→SRV1 on Gi0/1", tone: "blue", delay: 0.6 },
        { path: ["pca", "sw1", "sw2", "srv1"], label: "A→SRV1 on Gi0/1", tone: "blue", delay: 1.2 },
      ],
    },
    {
      title: { en: "Gi0/3 fails and Po1 stays up", hi: "Gi0/3 fail hota hai, Po1 up rehta hai" },
      text: {
        en: "The Gi0/3 cable is cut. Both switches remove it from Po1 and SW1 re-hashes its flows onto the members still up; here PC-C→SRV1 moves to Gi0/4. Po1 stays up at 3 Gbps, STP sees no change, and PC-C's session carries on; at most the few frames that were on the cut cable are lost and resent by TCP. Po1 goes down only when every member is down.",
        hi: "Gi0/3 ka cable kat jaata hai. Dono switches use Po1 se hata dete hain aur SW1 uske flows ko bache hue members par dobara hash karta hai; yahan PC-C→SRV1 Gi0/4 par chala jaata hai. Po1 3 Gbps par up rehta hai, STP ko koi change nahi dikhta, aur PC-C ka session chalta rehta hai; zyada se zyada cut cable par chal rahe kuch frames lost hote hain, jinhe TCP dobara bhej deta hai. Po1 tabhi down hota hai jab saare members down hon.",
      },
      packets: [{ path: ["pcc", "sw1", "sw2", "srv1"], label: "C→SRV1 on Gi0/4", tone: "pink" }],
      links: [{ id: "l-po", state: "normal", note: "Gi0/3 down: 3 Gbps" }],
      tables: [
        {
          node: "sw1",
          title: "SW1 Po1 members",
          columns: ["Port", "Flag", "Flow sent"],
          rows: [
            ["Gi0/1", "P", "PC-A→SRV1"],
            ["Gi0/2", "P", "PC-B→SRV2"],
            ["Gi0/3", "D (down)", "-"],
            ["Gi0/4", "P", "PC-C→SRV1"],
          ],
          hl: [2, 3],
        },
      ],
    },
  ],
};

export default scene;
