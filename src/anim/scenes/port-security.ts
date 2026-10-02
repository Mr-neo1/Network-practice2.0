import type { TopologyScene } from "../types.ts";

const psecTable = (mode: string, status: string, hl?: number[]) => ({
  node: "sw1",
  title: "Gi0/1 port security",
  columns: ["Setting", "Value"],
  rows: [
    ["Maximum MACs", "1"],
    ["Violation mode", mode],
    ["Port status", status],
  ],
  hl,
});

const stickyRow = ["10", "0050.56aa.0011", "SecureSticky"];

const scene: TopologyScene = {
  kind: "topology",
  id: "port-security",
  title: { en: "Port security: sticky learning, a violation, and the three modes", hi: "Port security: sticky learning, violation, aur teeno modes" },
  height: 440,
  nodes: [
    { id: "sw1", kind: "switch", x: 400, y: 95, label: "SW1" },
    { id: "srv", kind: "server", x: 660, y: 95, label: "Server", sub: "192.168.10.50" },
    { id: "desk", kind: "switch", x: 400, y: 225, label: "Desk SW", sub: "unmanaged" },
    { id: "pca", kind: "pc", x: 230, y: 350, label: "PC-A", sub: "192.168.10.11", sub2: "0050.56aa.0011" },
    { id: "atk", kind: "attacker", x: 570, y: 350, label: "Laptop", sub: "192.168.10.66", sub2: "0050.56aa.0066" },
  ],
  links: [
    { id: "l-srv", a: "sw1", b: "srv", aPort: "Gi0/2" },
    { id: "l-desk", a: "sw1", b: "desk", aPort: "Gi0/1", label: "VLAN 10" },
    { id: "l-pca", a: "desk", b: "pca" },
    { id: "l-atk", a: "desk", b: "atk" },
  ],
  steps: [
    {
      title: { en: "Gi0/1 allows one MAC, learned as sticky", hi: "Gi0/1 ek MAC allow karta hai, sticky learning se" },
      text: {
        en: "Gi0/1 is an access port in VLAN 10 with `switchport port-security` and `mac-address sticky`. The defaults apply: maximum 1 MAC, violation mode shutdown. A small unmanaged switch sits under the desk, and the laptop is not plugged in yet.",
        hi: "Gi0/1 VLAN 10 ka access port hai jispar `switchport port-security` aur `mac-address sticky` laga hai. Defaults lagte hain: maximum 1 MAC, violation mode shutdown. Desk ke neeche ek chhota unmanaged switch hai, aur laptop abhi laga nahi hai.",
      },
      focus: ["sw1"],
      links: [{ id: "l-atk", state: "dim", note: "not plugged in" }],
      tables: [
        psecTable("Shutdown", "Secure-up"),
        { node: "sw1", title: "SW1 secure MACs", columns: ["VLAN", "MAC address", "Type"], rows: [["-", "(none yet)", "-"]] },
      ],
    },
    {
      title: { en: "PC-A's first frame claims the only slot", hi: "PC-A ka pehla frame akela slot le leta hai" },
      text: {
        en: "PC-A sends a frame to the server. It enters SW1 on Gi0/1 with source MAC 0050.56aa.0011, so SW1 learns it as a SecureSticky address and writes `switchport port-security mac-address sticky 0050.56aa.0011` into the running config. The frame is forwarded normally.",
        hi: "PC-A server ko frame bhejta hai. Woh Gi0/1 par source MAC 0050.56aa.0011 ke saath SW1 mein aata hai, toh SW1 use SecureSticky address ki tarah seekh leta hai aur running config mein `switchport port-security mac-address sticky 0050.56aa.0011` likh deta hai. Frame normal tarah forward hota hai.",
      },
      packets: [{ path: ["pca", "desk", "sw1", "srv"], label: "src MAC ..0011", tone: "blue" }],
      badges: [{ node: "sw1", text: "1 of 1 MACs", tone: "blue" }],
      tables: [{ node: "sw1", title: "SW1 secure MACs", columns: ["VLAN", "MAC address", "Type"], rows: [stickyRow], hl: [0] }],
    },
    {
      title: { en: "A laptop plugs into the desk switch", hi: "Desk switch mein laptop lagta hai" },
      text: {
        en: "Someone plugs a laptop into the spare port of the desk switch and it starts talking. Its frame carries source MAC 0050.56aa.0066 and reaches SW1 on the same port, Gi0/1. The port already holds its maximum of 1 secure MAC, so this frame is a violation and is not forwarded.",
        hi: "Koi desk switch ke khaali port mein laptop laga deta hai aur woh bolna shuru karta hai. Uske frame ka source MAC 0050.56aa.0066 hai aur woh usi port Gi0/1 par SW1 tak pahunchta hai. Port par pehle se maximum 1 secure MAC hai, isliye yeh frame violation hai aur forward nahi hota.",
      },
      links: [{ id: "l-atk", state: "normal" }],
      packets: [{ path: ["atk", "desk", "sw1"], label: "src MAC ..0066", tone: "red", drop: true }],
      badges: [{ node: "sw1", text: "VIOLATION", tone: "red" }],
    },
    {
      title: { en: "Shutdown mode: Gi0/1 is err-disabled", hi: "Shutdown mode: Gi0/1 err-disabled ho gaya" },
      text: {
        en: "In shutdown mode the first violation err-disables the whole port. The link goes down, the port status becomes Secure-shutdown, and SW1 logs %PORT_SECURITY-2-PSECURE_VIOLATION naming 0050.56aa.0066. PC-A is cut off too: its next frame goes no further than the desk switch, because Gi0/1 no longer passes any traffic.",
        hi: "Shutdown mode mein pehla violation hi poore port ko err-disable kar deta hai. Link down ho jaata hai, port status Secure-shutdown ho jaata hai, aur SW1 0050.56aa.0066 ke naam ke saath %PORT_SECURITY-2-PSECURE_VIOLATION log karta hai. PC-A bhi kat jaata hai: uska agla frame desk switch se aage nahi jaata, kyunki Gi0/1 ab koi traffic pass nahi karta.",
      },
      links: [{ id: "l-desk", state: "down", note: "err-disabled" }],
      packets: [{ path: ["pca", "desk"], label: "src MAC ..0011", tone: "blue", drop: true }],
      badges: [
        { node: "sw1", text: "Gi0/1 err-disabled", tone: "red" },
        { node: "pca", text: "cut off", tone: "orange" },
      ],
      tables: [psecTable("Shutdown", "Secure-shutdown", [2])],
    },
    {
      title: { en: "Remove the cause, then bounce the port", hi: "Wajah hatao, phir port bounce karo" },
      text: {
        en: "The admin unplugs the laptop and enters `shutdown` then `no shutdown` on Gi0/1 (if `errdisable recovery cause psecure-violation` is configured, SW1 does this itself after 300 seconds). The port is Secure-up again, and the sticky entry for PC-A is still there because it lives in the running config.",
        hi: "Admin laptop nikaal deta hai aur Gi0/1 par `shutdown` phir `no shutdown` daalta hai (agar `errdisable recovery cause psecure-violation` configured hai, toh SW1 300 seconds baad yeh khud kar deta hai). Port phir se Secure-up hai, aur PC-A ki sticky entry abhi bhi hai kyunki woh running config mein hai.",
      },
      links: [
        { id: "l-desk", state: "normal" },
        { id: "l-atk", state: "dim", note: "unplugged" },
      ],
      packets: [{ path: ["pca", "desk", "sw1", "srv"], label: "src MAC ..0011", tone: "blue" }],
      badges: [
        { node: "sw1", text: "1 of 1 MACs", tone: "blue" },
        { node: "pca", text: "" },
      ],
      tables: [psecTable("Shutdown", "Secure-up", [2])],
    },
    {
      title: { en: "Same attack in restrict mode", hi: "Wahi attack restrict mode mein" },
      text: {
        en: "Now Gi0/1 has `switchport port-security violation restrict`. The laptop is plugged in again and sends a frame from 0050.56aa.0066. SW1 drops it, sends a syslog message and an SNMP trap, and adds 1 to the violation counter. The port stays up.",
        hi: "Ab Gi0/1 par `switchport port-security violation restrict` hai. Laptop phir se laga hai aur 0050.56aa.0066 se frame bhejta hai. SW1 use drop karta hai, syslog message aur SNMP trap bhejta hai, aur violation counter mein 1 jod deta hai. Port up rehta hai.",
      },
      reset: true,
      packets: [{ path: ["atk", "desk", "sw1"], label: "src MAC ..0066", tone: "red", drop: true }],
      badges: [{ node: "sw1", text: "violations: 1", tone: "orange" }],
      tables: [
        psecTable("Restrict", "Secure-up", [1]),
        { node: "sw1", title: "SW1 secure MACs", columns: ["VLAN", "MAC address", "Type"], rows: [stickyRow] },
      ],
    },
    {
      title: { en: "PC-A keeps working; the laptop never does", hi: "PC-A chalta rehta hai; laptop kabhi nahi" },
      text: {
        en: "PC-A's frames come from its sticky MAC, so SW1 forwards them and the server replies. Every frame the laptop sends is dropped and counted again. Restrict blocks the intruder without punishing the real user.",
        hi: "PC-A ke frames uske sticky MAC se aate hain, isliye SW1 unhe forward karta hai aur server reply karta hai. Laptop ka har frame drop hota hai aur phir se count hota hai. Restrict asli user ko saza diye bina intruder ko rok deta hai.",
      },
      packets: [
        { path: ["pca", "desk", "sw1", "srv"], label: "src MAC ..0011", tone: "blue" },
        { path: ["srv", "sw1", "desk", "pca"], label: "reply", tone: "green", delay: 3 },
        { path: ["atk", "desk", "sw1"], label: "src MAC ..0066", tone: "red", drop: true, delay: 0.5 },
      ],
      badges: [{ node: "sw1", text: "violations: 2", tone: "orange" }],
    },
    {
      title: { en: "Protect mode: dropped without a trace", hi: "Protect mode: bina nishaan ke drop" },
      text: {
        en: "With `violation protect` the laptop's frames are still dropped and PC-A still works, but SW1 sends no syslog message and the violation counter does not move. Nobody finds out the laptop was there, which is why protect is rarely chosen.",
        hi: "`violation protect` ke saath laptop ke frames ab bhi drop hote hain aur PC-A ab bhi chalta hai, lekin SW1 koi syslog message nahi bhejta aur violation counter nahi badhta. Kisi ko pata hi nahi chalta ki laptop laga tha, isliye protect shayad hi choose hota hai.",
      },
      packets: [{ path: ["atk", "desk", "sw1"], label: "src MAC ..0066", tone: "red", drop: true }],
      badges: [{ node: "sw1", text: "no log, no count", tone: "gray" }],
      tables: [psecTable("Protect", "Secure-up", [1])],
    },
  ],
};

export default scene;
