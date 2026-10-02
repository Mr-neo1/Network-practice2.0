import type { TopologyScene } from "../types.ts";

// The lesson 2.6 triangle, now running Rapid PVST+ in VLAN 10.
// SW1: spanning-tree vlan 10 root primary (24576 + 10), SW2: root secondary (28672 + 10), SW3: default (32768 + 10).
// Access ports Fa0/1 and Fa0/2 have spanning-tree portfast and spanning-tree bpduguard enable.
// Colours: purple = BPDU, blue = unicast data.
// SW2 and SW3 carry no badges because their diagonal port labels sit where a badge would go;
// roles are shown with link notes and the "Port roles" table.

const scene: TopologyScene = {
  kind: "topology",
  id: "rapid-pvst",
  title: { en: "Rapid PVST+: an alternate port takes over, then BPDU Guard stops a rogue switch", hi: "Rapid PVST+: alternate port turant takeover karta hai, phir BPDU Guard rogue switch ko rokta hai" },
  height: 400,
  nodes: [
    { id: "sw1", kind: "switch", x: 400, y: 90, label: "SW1", sub: "prio 24586", sub2: "0019.aa00.0001" },
    { id: "sw2", kind: "switch", x: 220, y: 270, label: "SW2", sub: "prio 28682", sub2: "0019.aa00.0002" },
    { id: "sw3", kind: "switch", x: 580, y: 270, label: "SW3", sub: "prio 32778", sub2: "0019.aa00.0003" },
    { id: "pca", kind: "pc", x: 80, y: 270, label: "PC-A", sub: "10.1.10.10" },
    { id: "pcb", kind: "pc", x: 720, y: 270, label: "PC-B", sub: "10.1.10.20" },
    { id: "desk", kind: "switch", x: 710, y: 115, label: "Desk SW", sub: "user's own switch" },
  ],
  links: [
    { id: "l12", a: "sw1", b: "sw2", aPort: "Gi0/1", bPort: "Gi0/1" },
    { id: "l13", a: "sw1", b: "sw3", aPort: "Gi0/2", bPort: "Gi0/1" },
    { id: "l23", a: "sw2", b: "sw3", aPort: "Gi0/2", bPort: "Gi0/2" },
    { id: "la", a: "pca", b: "sw2", bPort: "Fa0/1" },
    { id: "lb", a: "pcb", b: "sw3", bPort: "Fa0/1" },
    { id: "ld", a: "desk", b: "sw3", bPort: "Fa0/2" },
  ],
  steps: [
    {
      title: { en: "Rapid PVST+ has converged for VLAN 10", hi: "VLAN 10 ke liye Rapid PVST+ converge ho chuka hai" },
      text: {
        en: "SW1 is root with priority 24586, set by root primary. Each switch's Gi0/1 is its root port, and SW2 wins the designated role on the SW2-SW3 link because its bridge ID is lower. SW3 Gi0/2 is an alternate port: discarding, but it already knows a second path to the root.",
        hi: "SW1 root hai, priority 24586 ke saath, jo root primary ne set ki. Har switch ka Gi0/1 uska root port hai, aur SW2-SW3 link par designated role SW2 jeetta hai kyunki uska bridge ID kam hai. SW3 Gi0/2 alternate port hai: discarding hai, lekin use root tak ka doosra path pehle se pata hai.",
      },
      focus: ["sw1", "sw3"],
      badges: [{ node: "sw1", text: "ROOT", tone: "purple" }],
      links: [
        { id: "l23", state: "blocked", note: "SW3 Gi0/2 = Alternate" },
        { id: "ld", state: "dim", note: "not plugged in" },
      ],
      tables: [
        {
          node: "sw2",
          title: "Port roles (VLAN 10)",
          columns: ["Port", "Role", "State"],
          rows: [
            ["SW1 Gi0/1", "Designated", "Forwarding"],
            ["SW1 Gi0/2", "Designated", "Forwarding"],
            ["SW2 Gi0/1", "Root", "Forwarding"],
            ["SW2 Gi0/2", "Designated", "Forwarding"],
            ["SW3 Gi0/1", "Root", "Forwarding"],
            ["SW3 Gi0/2", "Alternate", "Discarding"],
          ],
        },
      ],
    },
    {
      title: { en: "Every switch sends its own BPDUs", hi: "Har switch apne BPDUs khud bhejta hai" },
      text: {
        en: "In RSTP each switch generates its own BPDUs every 2 seconds on its designated ports, instead of only relaying the root's. SW3's alternate port keeps hearing SW2 say \"root SW1, my cost 4\", so SW3 knows a backup path costing 8 is ready. Three missed hellos (6 s) and a neighbour is treated as gone, instead of waiting 20 s for Max Age.",
        hi: "RSTP mein har switch apne designated ports par har 2 second mein apne BPDUs khud banata hai, sirf root ke BPDUs aage nahi bhejta. SW3 ka alternate port SW2 ko baar baar kehte sunta hai \"root SW1, meri cost 4\", isliye SW3 ko pata hai ki cost 8 wala backup path ready hai. Lagataar teen hellos (6 s) miss hue toh neighbour ko gaya hua maan liya jaata hai, Max Age ke 20 s ka wait nahi hota.",
      },
      packets: [
        { path: ["sw1", "sw2"], label: "BPDU cost 0", tone: "purple" },
        { path: ["sw1", "sw3"], label: "BPDU cost 0", tone: "purple" },
        { path: ["sw2", "sw3"], label: "BPDU cost 4", tone: "purple" },
      ],
    },
    {
      title: { en: "Root port fails; the alternate takes over", hi: "Root port fail; alternate turant takeover" },
      text: {
        en: "The SW1-SW3 link fails. SW3 loses Gi0/1 and at once makes its alternate port Gi0/2 the new root port, which goes straight to forwarding. There is no listening and no learning, because an alternate port was chosen precisely so that it can take over safely.",
        hi: "SW1-SW3 link fail hota hai. SW3 ka Gi0/1 chala jaata hai aur woh turant apne alternate port Gi0/2 ko naya root port bana deta hai, jo seedha forwarding mein chala jaata hai. Na listening, na learning, kyunki alternate port chuna hi isliye gaya tha ki woh safely takeover kar sake.",
      },
      focus: ["sw3"],
      links: [
        { id: "l13", state: "down", note: "failed" },
        { id: "l23", state: "normal", note: "SW3 Gi0/2 = Root" },
      ],
      tables: [
        {
          node: "sw2",
          title: "Port roles (VLAN 10)",
          columns: ["Port", "Role", "State"],
          rows: [
            ["SW1 Gi0/1", "Designated", "Forwarding"],
            ["SW1 Gi0/2", "link down", "-"],
            ["SW2 Gi0/1", "Root", "Forwarding"],
            ["SW2 Gi0/2", "Designated", "Forwarding"],
            ["SW3 Gi0/1", "link down", "-"],
            ["SW3 Gi0/2", "Root", "Forwarding"],
          ],
          hl: [1, 4, 5],
        },
      ],
    },
    {
      title: { en: "Topology change: flush and re-learn", hi: "Topology change: flush karo aur dobara seekho" },
      text: {
        en: "A non-edge port has started forwarding, so SW3 sends BPDUs with the Topology Change flag set and SW2 passes the news on to SW1. Each switch flushes MAC addresses learned on its non-edge ports but keeps those on edge ports, such as PC-B's on SW3 Fa0/1. PC-A's frames now go SW2 to SW3, within about a second of the failure.",
        hi: "Ek non-edge port forwarding mein aaya hai, isliye SW3 Topology Change flag wale BPDUs bhejta hai aur SW2 yeh khabar SW1 tak pahuncha deta hai. Har switch apne non-edge ports par seekhe gaye MAC addresses flush karta hai, lekin edge ports wale rakhta hai, jaise SW3 Fa0/1 par PC-B ka. Ab PC-A ke frames SW2 se seedha SW3 jaate hain, failure ke lagbhag ek second ke andar.",
      },
      packets: [
        { path: ["sw3", "sw2", "sw1"], label: "BPDU TC", tone: "purple" },
        { path: ["pca", "sw2", "sw3", "pcb"], label: "Data", tone: "blue", delay: 2 },
      ],
    },
    {
      title: { en: "Link repaired: SW1 sends a Proposal", hi: "Link theek hua: SW1 Proposal bhejta hai" },
      text: {
        en: "The SW1-SW3 link comes back. SW1 Gi0/2 comes up as a designated port but starts in discarding, and sends a BPDU with the Proposal flag set: \"I want to forward on this link.\" SW3 sees that it offers a cheaper path to the root, cost 4 instead of 8, so Gi0/1 should be its root port again.",
        hi: "SW1-SW3 link wapas aata hai. SW1 Gi0/2 designated port ke roop mein up hota hai lekin discarding se shuru karta hai, aur Proposal flag wala BPDU bhejta hai: \"Main is link par forward karna chahta hoon.\" SW3 dekhta hai ki isse root tak ka path sasta hai, 8 ki jagah cost 4, isliye Gi0/1 ko phir se uska root port banna chahiye.",
      },
      focus: ["sw1", "sw3"],
      links: [{ id: "l13", state: "blocked", note: "handshake" }],
      packets: [{ path: ["sw1", "sw3"], label: "Proposal", tone: "purple" }],
      tables: [
        {
          node: "sw2",
          title: "Port roles (VLAN 10)",
          columns: ["Port", "Role", "State"],
          rows: [
            ["SW1 Gi0/1", "Designated", "Forwarding"],
            ["SW1 Gi0/2", "Designated", "Discarding"],
            ["SW2 Gi0/1", "Root", "Forwarding"],
            ["SW2 Gi0/2", "Designated", "Forwarding"],
            ["SW3 Gi0/1", "link up", "Discarding"],
            ["SW3 Gi0/2", "Root", "Forwarding"],
          ],
          hl: [1, 4],
        },
      ],
    },
    {
      title: { en: "SW3 syncs, agrees, and the link forwards", hi: "SW3 sync karta hai, agree karta hai, link forward" },
      text: {
        en: "Gi0/2 now holds only the second-best path, so it goes back to alternate and discards. Before agreeing, SW3 also syncs (every non-edge port except the new root port must be discarding, so no loop can form; edge ports such as Fa0/1 are left alone), then sends an Agreement, and SW1 Gi0/2 and SW3 Gi0/1 forward at once, with no timers involved.",
        hi: "Ab Gi0/2 ke paas sirf second-best path hai, isliye woh wapas alternate ban kar discard karta hai. Agree karne se pehle SW3 sync bhi karta hai (naye root port ke alawa har non-edge port discarding mein hona chahiye taaki loop na bane; Fa0/1 jaise edge ports ko chheda nahi jaata), phir Agreement bhejta hai, aur SW1 Gi0/2 aur SW3 Gi0/1 turant forward karne lagte hain, koi timer nahi.",
      },
      links: [
        { id: "l13", state: "normal", note: "SW3 Gi0/1 = Root" },
        { id: "l23", state: "blocked", note: "SW3 Gi0/2 = Alternate" },
      ],
      packets: [{ path: ["sw3", "sw1"], label: "Agreement", tone: "purple" }],
      tables: [
        {
          node: "sw2",
          title: "Port roles (VLAN 10)",
          columns: ["Port", "Role", "State"],
          rows: [
            ["SW1 Gi0/1", "Designated", "Forwarding"],
            ["SW1 Gi0/2", "Designated", "Forwarding"],
            ["SW2 Gi0/1", "Root", "Forwarding"],
            ["SW2 Gi0/2", "Designated", "Forwarding"],
            ["SW3 Gi0/1", "Root", "Forwarding"],
            ["SW3 Gi0/2", "Alternate", "Discarding"],
          ],
          hl: [1, 4, 5],
        },
      ],
    },
    {
      title: { en: "A user plugs a switch into Fa0/2", hi: "User Fa0/2 mein ek switch laga deta hai" },
      text: {
        en: "Fa0/2, like every access port here, is a PortFast edge port with BPDU Guard, so it went to forwarding the moment the link came up. The desk switch runs STP too and sends a BPDU. Without protection, that BPDU would turn Fa0/2 into a normal STP port, and a desk switch with a lower bridge ID would even become root for VLAN 10.",
        hi: "Fa0/2, yahan ke har access port ki tarah, PortFast edge port hai jisme BPDU Guard on hai, isliye link aate hi woh forwarding mein chala gaya. Desk switch bhi STP chalata hai aur ek BPDU bhejta hai. Bina protection ke yeh BPDU Fa0/2 ko normal STP port bana deta, aur agar desk switch ka bridge ID kam hota toh woh VLAN 10 ka root bhi ban jaata.",
      },
      focus: ["desk", "sw3"],
      links: [{ id: "ld", state: "normal" }],
      packets: [{ path: ["desk", "sw3"], label: "BPDU", tone: "purple" }],
    },
    {
      title: { en: "BPDU Guard err-disables Fa0/2", hi: "BPDU Guard Fa0/2 ko err-disable karta hai" },
      text: {
        en: "BPDU Guard reacts to any BPDU at all: SW3 logs %SPANTREE-2-BLOCK_BPDUGUARD and puts Fa0/2 in the err-disabled state. It stays down until someone removes the desk switch and enters shutdown then no shutdown, or errdisable recovery brings it back. PC-B and the rest of VLAN 10 never notice.",
        hi: "BPDU Guard kisi bhi BPDU par react karta hai: SW3 %SPANTREE-2-BLOCK_BPDUGUARD log karta hai aur Fa0/2 ko err-disabled state mein daal deta hai. Port tab tak down rehta hai jab tak koi desk switch hata kar shutdown aur phir no shutdown na kare, ya errdisable recovery use wapas na laaye. PC-B aur baaki VLAN 10 ko pata bhi nahi chalta.",
      },
      links: [{ id: "ld", state: "down", note: "err-disabled" }],
      packets: [{ path: ["pcb", "sw3", "sw1", "sw2", "pca"], label: "Data", tone: "blue" }],
      badges: [{ node: "pcb", text: "unaffected", tone: "green" }],
      tables: [
        {
          node: "sw3",
          title: "SW3 err-disabled ports",
          columns: ["Port", "Status", "Reason"],
          rows: [["Fa0/2", "err-disabled", "bpduguard"]],
          hl: [0],
        },
      ],
    },
  ],
};

export default scene;
