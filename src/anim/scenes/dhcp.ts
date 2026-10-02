import type { SequenceScene } from "../types.ts";

// Colours: orange = client broadcast, blue = unicast (relayed or renewal),
// green = server reply, red = lost / unanswered.
// Addressing matches the lesson: PC1 0050.56aa.0011 on 192.168.10.0/24,
// R1 Gi0/0 192.168.10.1 with ip helper-address 10.0.12.2, R2 = DHCP server 10.0.12.2.

const scene: SequenceScene = {
  kind: "sequence",
  id: "dhcp",
  title: { en: "DORA through a DHCP relay agent", hi: "DHCP relay agent ke through DORA" },
  actors: [
    { id: "pc", label: "PC1", kind: "pc", sub: "0050.56aa.0011" },
    { id: "r1", label: "R1 (relay)", kind: "router", sub: "Gi0/0 192.168.10.1" },
    { id: "r2", label: "R2 (DHCP server)", kind: "router", sub: "10.0.12.2" },
  ],
  steps: [
    {
      title: { en: "Discover: a broadcast from 0.0.0.0", hi: "Discover: 0.0.0.0 se broadcast" },
      text: {
        en: "PC1 boots with no IP address. It sends a DHCP Discover from 0.0.0.0, UDP port 68, to 255.255.255.255, UDP port 67. R1 receives it on Gi0/0, but routers do not forward broadcasts and R1 has no helper address yet, so the Discover stops here.",
        hi: "PC1 boot hota hai aur uske paas koi IP address nahi hai. Woh DHCP Discover bhejta hai, 0.0.0.0 UDP port 68 se 255.255.255.255 UDP port 67 par. R1 ise Gi0/0 par receive karta hai, lekin routers broadcast forward nahi karte aur R1 par abhi helper address nahi hai, isliye Discover yahin ruk jaata hai.",
      },
      messages: [{ from: "pc", to: "r1", label: "DHCP Discover", detail: "0.0.0.0:68 → 255.255.255.255:67", tone: "orange" }],
      note: { actor: "r1", text: "Not forwarded" },
    },
    {
      title: { en: "ip helper-address: R1 relays it", hi: "ip helper-address: R1 relay karta hai" },
      text: {
        en: "Now Gi0/0 has `ip helper-address 10.0.12.2`. PC1 got no answer, so it sends the Discover again. R1 writes its Gi0/0 address, 192.168.10.1, into the giaddr field and forwards the message as a unicast to 10.0.12.2, UDP 67 to 67. To every router on the way it is an ordinary routed packet.",
        hi: "Ab Gi0/0 par `ip helper-address 10.0.12.2` laga hai. PC1 ko jawab nahi mila, toh woh Discover dobara bhejta hai. R1 apna Gi0/0 address, 192.168.10.1, giaddr field mein likhta hai aur message ko unicast bana kar 10.0.12.2 par bhejta hai, UDP 67 se 67. Raaste ke har router ke liye yeh ek normal routed packet hai.",
      },
      messages: [
        { from: "pc", to: "r1", label: "DHCP Discover (retry)", detail: "broadcast · UDP 68 → 67", tone: "orange" },
        { from: "r1", to: "r2", label: "Discover (relayed)", detail: "giaddr 192.168.10.1 · unicast", tone: "blue" },
      ],
    },
    {
      title: { en: "R2 picks the pool that matches giaddr", hi: "R2 giaddr se matching pool chunta hai" },
      text: {
        en: "giaddr 192.168.10.1 falls inside pool LAN10, 192.168.10.0/24, so R2 offers from that pool. Addresses .1 to .10 are excluded, so the first free one is 192.168.10.11. R2 sends the Offer back to the relay at the giaddr address, UDP port 67.",
        hi: "giaddr 192.168.10.1 pool LAN10 (192.168.10.0/24) ke andar aata hai, isliye R2 isi pool se offer karta hai. .1 se .10 tak ke addresses excluded hain, toh pehla free address 192.168.10.11 hai. R2 Offer ko relay ke giaddr address par, UDP port 67 par, wapas bhejta hai.",
      },
      messages: [{ from: "r2", to: "r1", label: "DHCP Offer", detail: "to 192.168.10.1:67 · offers .11", tone: "green", dashed: true }],
      note: { actor: "r2", text: "Pool LAN10 → .11" },
    },
    {
      title: { en: "R1 delivers the Offer to PC1", hi: "R1 Offer ko PC1 tak pahunchata hai" },
      text: {
        en: "R1 sends the Offer out of Gi0/0 to PC1's UDP port 68. It carries the address 192.168.10.11 (the yiaddr field), mask 255.255.255.0, gateway 192.168.10.1, DNS server 8.8.8.8, a 1-day lease and R2's address as the server identifier. PC1 does not use the address yet; it is only an offer.",
        hi: "R1 Offer ko Gi0/0 se PC1 ke UDP port 68 par bhejta hai. Isme address 192.168.10.11 (yiaddr field), mask 255.255.255.0, gateway 192.168.10.1, DNS server 8.8.8.8, 1 din ki lease aur server identifier ke roop mein R2 ka address hota hai. PC1 abhi address use nahi karta; yeh sirf ek offer hai.",
      },
      messages: [{ from: "r1", to: "pc", label: "DHCP Offer", detail: "yiaddr 192.168.10.11 · UDP 67 → 68", tone: "green", dashed: true }],
    },
    {
      title: { en: "Request: still a broadcast", hi: "Request: ab bhi broadcast" },
      text: {
        en: "PC1 accepts with a DHCP Request, still from 0.0.0.0 to 255.255.255.255. It cannot use 192.168.10.11 until a server confirms it, and any other server that made an offer must hear that it was not chosen. The Request names server 10.0.12.2 and asks for .11. R1 relays it exactly like the Discover.",
        hi: "PC1 DHCP Request bhej kar offer accept karta hai, ab bhi 0.0.0.0 se 255.255.255.255 par. Server confirm kare usse pehle woh 192.168.10.11 use nahi kar sakta, aur jis bhi doosre server ne offer diya tha use pata chalna chahiye ki woh choose nahi hua. Request mein server 10.0.12.2 ka naam hota hai aur .11 maanga jaata hai. R1 ise bilkul Discover ki tarah relay karta hai.",
      },
      messages: [
        { from: "pc", to: "r1", label: "DHCP Request", detail: "0.0.0.0 → 255.255.255.255 · wants .11", tone: "orange" },
        { from: "r1", to: "r2", label: "Request (relayed)", detail: "giaddr 192.168.10.1 · unicast", tone: "blue" },
      ],
    },
    {
      title: { en: "Ack: the lease starts", hi: "Ack: lease shuru" },
      text: {
        en: "R2 stores the binding (192.168.10.11 for client ID 0100.5056.aa00.11, expiring in 1 day) and sends a DHCP Ack, which R1 delivers to PC1. Only now does PC1 configure 192.168.10.11/24 with gateway 192.168.10.1 and DNS 8.8.8.8.",
        hi: "R2 binding store karta hai (client ID 0100.5056.aa00.11 ke liye 192.168.10.11, 1 din mein expire) aur DHCP Ack bhejta hai, jise R1 PC1 tak pahunchata hai. Ab jaakar PC1 192.168.10.11/24, gateway 192.168.10.1 aur DNS 8.8.8.8 configure karta hai.",
      },
      messages: [
        { from: "r2", to: "r1", label: "DHCP Ack", detail: "to 192.168.10.1:67 · lease 1 day", tone: "green", dashed: true },
        { from: "r1", to: "pc", label: "DHCP Ack", detail: "IP, mask, gateway, DNS, lease", tone: "green", dashed: true },
      ],
      note: { actor: "pc", text: "192.168.10.11/24" },
    },
    {
      title: { en: "T1 at 50%: renew straight with R2", hi: "T1 par (50%): seedha R2 se renew" },
      text: {
        en: "After 12 hours (T1, half of the 1-day lease) PC1 renews. It now has an address and knows the server, so this Request is a normal unicast from 192.168.10.11 to 10.0.12.2. R1 just routes it; no relay is involved. R2's Ack starts a fresh 1-day lease.",
        hi: "12 ghante baad (T1, 1 din ki lease ka aadha) PC1 renew karta hai. Ab uske paas address hai aur server bhi pata hai, isliye yeh Request 192.168.10.11 se 10.0.12.2 par normal unicast hai. R1 ise bas route karta hai; relay ka koi role nahi. R2 ka Ack nayi 1 din ki lease shuru kar deta hai.",
      },
      messages: [
        { from: "pc", to: "r2", label: "DHCP Request (renew)", detail: "T1 12 h · 192.168.10.11 → 10.0.12.2", tone: "blue" },
        { from: "r2", to: "pc", label: "DHCP Ack", detail: "lease reset to 1 day", tone: "green", dashed: true },
      ],
      note: { actor: "pc", text: "Lease renewed" },
    },
    {
      title: { en: "T2 at 87.5%: rebind with any server", hi: "T2 par (87.5%): kisi bhi server se rebind" },
      text: {
        en: "Now suppose R2 goes down. At the next T1, 12 hours after the last renewal, PC1's unicast Request gets no answer, and it keeps retrying. At T2, 21 hours after the last renewal (87.5%), PC1 broadcasts a Request that any DHCP server may answer. R1 relays it, but R2 is the only server it knows, so again nothing comes back. If nothing answers by 24 hours after the last renewal, the lease expires and PC1 must drop the address and start over with a Discover.",
        hi: "Ab maan lo R2 down ho gaya. Agle T1 par, yaani last renewal ke 12 ghante baad, PC1 ki unicast Request ka koi jawab nahi aata, aur woh retry karta rehta hai. T2 par, yaani last renewal ke 21 ghante baad (87.5%), PC1 broadcast Request bhejta hai jiska jawab koi bhi DHCP server de sakta hai. R1 ise relay karta hai, lekin use sirf R2 pata hai, isliye phir se koi jawab nahi aata. Last renewal ke 24 ghante tak koi jawab nahi aaya, toh lease expire ho jaati hai aur PC1 ko address chhod kar Discover se dobara shuru karna padta hai.",
      },
      messages: [
        { from: "pc", to: "r2", label: "Request (renew)", detail: "T1 12 h · unicast · no answer", tone: "red", drop: true },
        { from: "pc", to: "r1", label: "Request (rebind)", detail: "T2 21 h · broadcast", tone: "orange" },
        { from: "r1", to: "r2", label: "Rebind (relayed)", detail: "R2 down · no answer", tone: "red", drop: true },
      ],
      note: { actor: "pc", text: "24 h: back to Discover" },
    },
  ],
};

export default scene;
