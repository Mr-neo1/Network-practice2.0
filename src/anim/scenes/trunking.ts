import type { TopologyScene, TopoTable } from "../types.ts";

// Colours: orange = broadcast, green = reply, blue = unicast data, purple = CDP (control), red = misdelivered.
// Badges show each PC's access VLAN: blue = VLAN 10, pink = VLAN 20.
const trunkTable = (sw2Native: string, hl?: number[]): TopoTable => ({
  node: "sw1",
  title: "Trunk Gi0/1 settings",
  columns: ["Switch", "Mode", "Native", "Allowed"],
  rows: [
    ["SW1", "trunk", "99", "10,20,99"],
    ["SW2", "trunk", sw2Native, "10,20,99"],
  ],
  hl,
});

const scene: TopologyScene = {
  kind: "topology",
  id: "trunking",
  title: { en: "One trunk, two VLANs: tagging, the native VLAN and a mismatch", hi: "Ek trunk, do VLANs: tagging, native VLAN aur mismatch" },
  height: 400,
  nodes: [
    { id: "pc1", kind: "pc", x: 110, y: 90, label: "PC1", sub: "10.1.10.11" },
    { id: "pc2", kind: "pc", x: 110, y: 300, label: "PC2", sub: "10.1.20.12" },
    { id: "sw1", kind: "switch", x: 300, y: 195, label: "SW1" },
    { id: "sw2", kind: "switch", x: 500, y: 195, label: "SW2" },
    { id: "pc3", kind: "pc", x: 690, y: 90, label: "PC3", sub: "10.1.10.13" },
    { id: "pc4", kind: "pc", x: 690, y: 300, label: "PC4", sub: "10.1.20.14" },
  ],
  links: [
    { id: "l-1", a: "pc1", b: "sw1", bPort: "Fa0/1" },
    { id: "l-2", a: "pc2", b: "sw1", bPort: "Fa0/2" },
    { id: "l-tr", a: "sw1", b: "sw2", aPort: "Gi0/1", bPort: "Gi0/1", style: "trunk", label: "802.1Q trunk" },
    { id: "l-3", a: "sw2", b: "pc3", aPort: "Fa0/1" },
    { id: "l-4", a: "sw2", b: "pc4", aPort: "Fa0/2" },
  ],
  steps: [
    {
      title: { en: "The same two VLANs on two switches", hi: "Do switches par wahi do VLANs" },
      text: {
        en: "PC1 and PC3 are in VLAN 10 (Sales), PC2 and PC4 in VLAN 20 (HR), but they sit on different switches. One cable joins SW1 and SW2, so Gi0/1 on both ends is an 802.1Q trunk with native VLAN 99 and allowed VLANs 10, 20 and 99.",
        hi: "PC1 aur PC3 VLAN 10 (Sales) mein hain, PC2 aur PC4 VLAN 20 (HR) mein, lekin yeh alag switches par baithe hain. SW1 aur SW2 ke beech ek hi cable hai, isliye dono ends ka Gi0/1 ek 802.1Q trunk hai: native VLAN 99, allowed VLANs 10, 20 aur 99.",
      },
      focus: ["sw1", "sw2"],
      badges: [
        { node: "pc1", text: "VLAN 10", tone: "blue" },
        { node: "pc3", text: "VLAN 10", tone: "blue" },
        { node: "pc2", text: "VLAN 20", tone: "pink" },
        { node: "pc4", text: "VLAN 20", tone: "pink" },
      ],
      tables: [trunkTable("99")],
    },
    {
      title: { en: "PC1 broadcasts in VLAN 10", hi: "PC1 VLAN 10 mein broadcast karta hai" },
      text: {
        en: "PC1 sends an ARP request for 10.1.10.13 to FFFF.FFFF.FFFF. PCs don't tag frames, so it arrives on Fa0/1 untagged. Fa0/1 is a VLAN 10 access port, so SW1 treats the frame as VLAN 10. PC2 on Fa0/2 is in VLAN 20 and gets nothing.",
        hi: "PC1, 10.1.10.13 ke liye FFFF.FFFF.FFFF par ARP request bhejta hai. PCs frames tag nahi karte, isliye frame Fa0/1 par bina tag ke aata hai. Fa0/1 VLAN 10 ka access port hai, toh SW1 frame ko VLAN 10 ka maanta hai. Fa0/2 wala PC2 VLAN 20 mein hai, use kuch nahi milta.",
      },
      focus: ["pc1", "sw1"],
      packets: [{ path: ["pc1", "sw1"], label: "ARP (no tag)", tone: "orange" }],
    },
    {
      title: { en: "SW1 adds an 802.1Q tag", hi: "SW1 802.1Q tag lagata hai" },
      text: {
        en: "VLAN 10 is allowed on the trunk, so SW1 floods the broadcast out Gi0/1 as well. Before sending it, SW1 inserts a 4-byte tag after the source MAC, TPID 0x8100 with VLAN ID 10, and recalculates the FCS.",
        hi: "Trunk par VLAN 10 allowed hai, isliye SW1 broadcast ko Gi0/1 se bhi flood karta hai. Bhejne se pehle SW1 source MAC ke baad 4-byte tag insert karta hai, TPID 0x8100 aur VLAN ID 10, aur FCS dobara calculate karta hai.",
      },
      links: [{ id: "l-tr", state: "active", note: "tag: VLAN 10" }],
      packets: [{ path: ["sw1", "sw2"], label: "ARP tag 10", tone: "orange" }],
    },
    {
      title: { en: "SW2 reads the tag and removes it", hi: "SW2 tag padhta hai aur hata deta hai" },
      text: {
        en: "SW2 reads VLAN ID 10, removes the tag, and floods the frame only to its VLAN 10 access port, Fa0/1. PC3 receives an ordinary untagged frame. PC4 on Fa0/2 is in VLAN 20 and never sees it.",
        hi: "SW2 VLAN ID 10 padhta hai, tag hata deta hai, aur frame ko sirf apne VLAN 10 access port Fa0/1 par flood karta hai. PC3 ko ek normal untagged frame milta hai. Fa0/2 wala PC4 VLAN 20 mein hai, use yeh kabhi nahi dikhta.",
      },
      focus: ["sw2", "pc3"],
      links: [{ id: "l-tr", state: "normal" }],
      packets: [{ path: ["sw2", "pc3"], label: "ARP (no tag)", tone: "orange" }],
    },
    {
      title: { en: "The reply is tagged on the trunk too", hi: "Reply bhi trunk par tagged jaata hai" },
      text: {
        en: "PC3 sends a unicast ARP reply. SW2 learned PC1's MAC in VLAN 10 on Gi0/1 from the broadcast, so it sends the reply over the trunk tagged with VLAN 10. SW1 removes the tag and forwards the reply out Fa0/1 only.",
        hi: "PC3 unicast ARP reply bhejta hai. Broadcast se SW2 seekh chuka hai ki PC1 ka MAC VLAN 10 mein Gi0/1 par hai, isliye woh reply ko VLAN 10 ke tag ke saath trunk par bhejta hai. SW1 tag hata kar reply sirf Fa0/1 se forward karta hai.",
      },
      links: [{ id: "l-tr", state: "active", note: "tag: VLAN 10" }],
      packets: [
        { path: ["pc3", "sw2"], label: "Reply (no tag)", tone: "green" },
        { path: ["sw2", "sw1"], label: "Reply tag 10", tone: "green", delay: 1 },
        { path: ["sw1", "pc1"], label: "Reply (no tag)", tone: "green", delay: 2 },
      ],
    },
    {
      title: { en: "VLAN 20 shares the same cable", hi: "VLAN 20 bhi usi cable par" },
      text: {
        en: "PC2 sends a unicast frame to PC4. It crosses the same trunk, but SW1 tags it with VLAN 20, so SW2 delivers it only to a VLAN 20 port. The tag is what keeps the two VLANs apart on one link.",
        hi: "PC2, PC4 ko ek unicast frame bhejta hai. Frame usi trunk se jaata hai, lekin SW1 us par VLAN 20 ka tag lagata hai, isliye SW2 use sirf VLAN 20 ke port par deliver karta hai. Ek link par do VLANs ko alag tag hi rakhta hai.",
      },
      focus: ["pc2", "pc4"],
      links: [{ id: "l-tr", state: "active", note: "tag: VLAN 20" }],
      packets: [
        { path: ["pc2", "sw1"], label: "Data (no tag)", tone: "blue" },
        { path: ["sw1", "sw2"], label: "Data tag 20", tone: "blue", delay: 1 },
        { path: ["sw2", "pc4"], label: "Data (no tag)", tone: "blue", delay: 2 },
      ],
    },
    {
      title: { en: "Mistake: SW2's native VLAN set to 20", hi: "Galti: SW2 ka native VLAN 20 kar diya" },
      text: {
        en: "Someone enters switchport trunk native vlan 20 on SW2 and leaves SW1 at 99. CDP messages carry each side's native VLAN, so when SW1's CDP arrives saying 99, SW2 logs %CDP-4-NATIVE_VLAN_MISMATCH. SW1 logs the same when SW2's CDP arrives.",
        hi: "Kisi ne SW2 par switchport trunk native vlan 20 daal diya aur SW1 ko 99 par hi chhod diya. CDP messages mein har side ka native VLAN hota hai, isliye jab SW1 ka CDP 99 bolta hua pahunchta hai, SW2 %CDP-4-NATIVE_VLAN_MISMATCH log karta hai. SW2 ka CDP pahunchne par SW1 bhi yahi log karta hai.",
      },
      focus: ["sw1", "sw2"],
      links: [{ id: "l-tr", state: "active", note: "native 99 vs 20" }],
      packets: [{ path: ["sw1", "sw2"], label: "CDP native 99", tone: "purple" }],
      badges: [
        { node: "sw1", text: "native 99", tone: "gray" },
        { node: "sw2", text: "native 20", tone: "red" },
      ],
      tables: [trunkTable("20", [1])],
    },
    {
      title: { en: "PC4's VLAN 20 frame lands in VLAN 99", hi: "PC4 ka VLAN 20 frame VLAN 99 mein pahunchta hai" },
      text: {
        en: "PC4 broadcasts in VLAN 20, which is now SW2's native VLAN, so SW2 sends the frame across the trunk untagged. SW1 puts every untagged frame into its own native VLAN, 99, so the frame leaks into VLAN 99 and PC2 in VLAN 20 never receives it. On real Cisco switches PVST+ usually also blocks the trunk for these two VLANs, so their traffic simply stops.",
        hi: "PC4 VLAN 20 mein broadcast karta hai, jo ab SW2 ka native VLAN hai, isliye SW2 frame ko trunk par bina tag ke bhejta hai. SW1 har untagged frame ko apne native VLAN 99 mein daalta hai, toh frame leak hokar VLAN 99 mein chala jaata hai aur VLAN 20 wale PC2 ko kabhi nahi milta. Asli Cisco switches par PVST+ aam taur par in dono VLANs ke liye trunk block bhi kar deta hai, toh inka traffic seedha ruk jaata hai.",
      },
      focus: ["pc4", "pc2"],
      links: [{ id: "l-tr", state: "active", note: "untagged" }],
      packets: [
        { path: ["pc4", "sw2"], label: "ARP (no tag)", tone: "orange" },
        { path: ["sw2", "sw1"], label: "ARP no tag", tone: "red", delay: 1, drop: true },
      ],
      badges: [{ node: "sw1", text: "into VLAN 99", tone: "red" }],
    },
    {
      title: { en: "Fix the native VLAN, then verify", hi: "Native VLAN theek karo, phir verify karo" },
      text: {
        en: "switchport trunk native vlan 99 on SW2 makes both ends agree again. show interfaces trunk now shows mode on, 802.1q, trunking, native VLAN 99 and allowed VLANs 10,20,99 on both switches. PC4's broadcast is tagged with VLAN 20 again and reaches PC2.",
        hi: "SW2 par switchport trunk native vlan 99 lagate hi dono ends phir se agree karte hain. show interfaces trunk ab dono switches par mode on, 802.1q, trunking, native VLAN 99 aur allowed VLANs 10,20,99 dikhata hai. PC4 ka broadcast phir se VLAN 20 ke tag ke saath jaata hai aur PC2 tak pahunchta hai.",
      },
      links: [{ id: "l-tr", state: "active", note: "tag: VLAN 20" }],
      packets: [
        { path: ["pc4", "sw2"], label: "ARP (no tag)", tone: "orange" },
        { path: ["sw2", "sw1"], label: "ARP tag 20", tone: "orange", delay: 1 },
        { path: ["sw1", "pc2"], label: "ARP (no tag)", tone: "orange", delay: 2 },
      ],
      badges: [
        { node: "sw1", text: "" },
        { node: "sw2", text: "" },
      ],
      tables: [trunkTable("99", [1])],
    },
  ],
};

export default scene;
