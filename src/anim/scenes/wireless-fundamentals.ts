import type { TopologyScene } from "../types.ts";

// One ESS: SSID "Office" on three autonomous APs, 2.4 GHz channels 1 / 6 / 11, all bridged to SW1 (VLAN 20).
// AP1 BSSID 00a2.ee00.0101 | AP2 00a2.ee00.0201 | AP3 00a2.ee00.0301
// Laptop 10.10.20.15 0050.56aa.0015 | Phone 10.10.20.22 0050.56aa.0022 | Tablet 10.10.20.31
// R1 (gateway) 10.10.20.1 0011.2233.4401 on SW1 Gi1/0/24
// Colours: orange = beacon (broadcast), purple = 802.11 management (auth/assoc), blue = data, green = reply/ACK.

const heard = { node: "laptop", title: "Laptop: networks heard", columns: ["SSID", "BSSID", "Ch", "Signal"] };
const macTable = { node: "sw1", title: "SW1 MAC table", columns: ["MAC", "Port"] };

const scene: TopologyScene = {
  kind: "topology",
  id: "wireless-fundamentals",
  title: { en: "One SSID, three APs on channels 1, 6 and 11, and a client that roams", hi: "Ek SSID, channels 1, 6 aur 11 par teen APs, aur ek roam karta client" },
  height: 420,
  nodes: [
    { id: "sw1", kind: "switch", x: 400, y: 70, label: "SW1", sub: "wired DS · VLAN 20" },
    { id: "r1", kind: "router", x: 640, y: 70, label: "R1", sub: "GW 10.10.20.1", sub2: "0011.2233.4401" },
    { id: "ap1", kind: "ap", x: 160, y: 200, label: "AP1", sub: "SSID Office", sub2: "00a2.ee00.0101" },
    { id: "ap2", kind: "ap", x: 400, y: 200, label: "AP2", sub: "SSID Office", sub2: "00a2.ee00.0201" },
    { id: "ap3", kind: "ap", x: 640, y: 200, label: "AP3", sub: "SSID Office", sub2: "00a2.ee00.0301" },
    { id: "phone", kind: "phone", x: 80, y: 345, label: "Phone", sub: "10.10.20.22" },
    { id: "laptop", kind: "laptop", x: 280, y: 345, label: "Laptop", sub: "10.10.20.15", sub2: "0050.56aa.0015" },
    { id: "tablet", kind: "phone", x: 720, y: 345, label: "Tablet", sub: "10.10.20.31" },
  ],
  links: [
    { id: "l-r1", a: "sw1", b: "r1", aPort: "Gi1/0/24", bPort: "Gi0/0" },
    { id: "l-ap1", a: "ap1", b: "sw1", bPort: "Gi1/0/1" },
    { id: "l-ap2", a: "ap2", b: "sw1", bPort: "Gi1/0/2" },
    { id: "l-ap3", a: "ap3", b: "sw1", bPort: "Gi1/0/3" },
    { id: "w-phone", a: "phone", b: "ap1", style: "wireless", label: "Ch 1" },
    { id: "w-lap1", a: "laptop", b: "ap1", style: "wireless", label: "Ch 1" },
    { id: "w-lap2", a: "laptop", b: "ap2", style: "wireless", label: "Ch 6" },
    { id: "w-tab", a: "tablet", b: "ap3", style: "wireless", label: "Ch 11" },
  ],
  steps: [
    {
      title: { en: "One SSID, three cells, three channels", hi: "Ek SSID, teen cells, teen channels" },
      text: {
        en: "AP1, AP2 and AP3 all broadcast the SSID Office and are cabled to SW1, the wired distribution system (DS). Each AP's cell overlaps its neighbour's, and each uses a different 2.4 GHz channel: 1, 6 and 11. Those three never overlap in frequency, so neighbouring cells do not interfere.",
        hi: "AP1, AP2 aur AP3 teeno SSID Office broadcast karte hain aur cable se SW1 se jude hain, jo wired distribution system (DS) hai. Har AP ka cell padosi ke cell se thoda overlap karta hai, aur har AP alag 2.4 GHz channel use karta hai: 1, 6 aur 11. Yeh teen channels frequency mein kabhi overlap nahi karte, isliye padosi cells ek doosre ko disturb nahi karte.",
      },
      focus: ["ap1", "ap2", "ap3"],
      badges: [
        { node: "ap1", text: "Ch 1", tone: "teal" },
        { node: "ap2", text: "Ch 6", tone: "teal" },
        { node: "ap3", text: "Ch 11", tone: "teal" },
      ],
    },
    {
      title: { en: "Beacons announce the SSID", hi: "Beacons SSID announce karte hain" },
      text: {
        en: "Every AP sends a beacon every 102.4 ms by default, carrying the SSID, its BSSID (the radio's MAC address), supported rates and security type. The laptop sits where AP1's and AP2's cells overlap, so it hears both: the same SSID from two BSSIDs on two channels.",
        hi: "Har AP by default har 102.4 ms mein ek beacon bhejta hai, jisme SSID, uska BSSID (radio ka MAC address), supported rates aur security type hota hai. Laptop wahan hai jahan AP1 aur AP2 ke cells overlap karte hain, isliye use dono sunai dete hain: same SSID, do alag BSSID, do alag channels par.",
      },
      packets: [
        { path: ["ap1", "phone"], label: "Beacon", tone: "orange" },
        { path: ["ap1", "laptop"], label: "Beacon", tone: "orange" },
        { path: ["ap2", "laptop"], label: "Beacon", tone: "orange" },
        { path: ["ap3", "tablet"], label: "Beacon", tone: "orange" },
      ],
      tables: [
        {
          ...heard,
          rows: [
            ["Office", "00a2.ee00.0101", "1", "-52 dBm"],
            ["Office", "00a2.ee00.0201", "6", "-71 dBm"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "The laptop joins AP1, the stronger signal", hi: "Laptop AP1 se judta hai, jiska signal strong hai" },
      text: {
        en: "The laptop picks the strongest BSSID, AP1 at -52 dBm. It exchanges two 802.11 authentication frames with AP1 (open system; the real WPA2 check follows, see lesson 5.10), then an association request and response. The laptop is now part of AP1's BSS.",
        hi: "Laptop sabse strong BSSID chunta hai, yaani -52 dBm wala AP1. Pehle AP1 ke saath do 802.11 authentication frames exchange hote hain (open system; asli WPA2 check iske baad hota hai, lesson 5.10 dekho), phir association request aur response. Ab laptop AP1 ke BSS ka member hai.",
      },
      focus: ["laptop", "ap1"],
      packets: [
        { path: ["laptop", "ap1"], label: "Auth Request", tone: "purple" },
        { path: ["ap1", "laptop"], label: "Auth Response", tone: "purple", delay: 1 },
        { path: ["laptop", "ap1"], label: "Assoc Request", tone: "purple", delay: 2 },
        { path: ["ap1", "laptop"], label: "Assoc Response", tone: "purple", delay: 3 },
      ],
      links: [{ id: "w-lap1", state: "active", note: "associated" }],
      tables: [
        {
          node: "ap1",
          title: "AP1 clients",
          columns: ["Client MAC", "SSID"],
          rows: [
            ["0050.56aa.0022", "Office"],
            ["0050.56aa.0015", "Office"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "Data goes through the AP onto the wire", hi: "Data AP se hokar wire par jaata hai" },
      text: {
        en: "The laptop pings its gateway, R1. AP1 receives the 802.11 frame, rebuilds it as an Ethernet frame with the laptop's MAC still as the source, and bridges it to SW1. SW1 learns 0050.56aa.0015 on Gi1/0/1, exactly as it would for a wired PC.",
        hi: "Laptop apne gateway R1 ko ping karta hai. AP1 802.11 frame receive karke use Ethernet frame mein badalta hai, source MAC laptop ka hi rehta hai, aur use SW1 ki taraf bridge kar deta hai. SW1 seekh leta hai ki 0050.56aa.0015 Gi1/0/1 par hai, bilkul wired PC ki tarah.",
      },
      packets: [
        { path: ["laptop", "ap1", "sw1", "r1"], label: "Ping 10.10.20.1", tone: "blue" },
        { path: ["r1", "sw1", "ap1", "laptop"], label: "Echo Reply", tone: "green", delay: 3 },
      ],
      tables: [
        {
          ...macTable,
          rows: [
            ["0050.56aa.0015", "Gi1/0/1"],
            ["0011.2233.4401", "Gi1/0/24"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "CSMA/CA: taking turns on channel 1", hi: "CSMA/CA: channel 1 par baari baari" },
      text: {
        en: "The phone and the laptop both have a frame to send on channel 1. When the channel goes quiet, each counts down a random backoff; the laptop's ends first, so it transmits, while the phone hears a busy channel and pauses its count. AP1 ACKs each frame, and the phone sends once the air is free again.",
        hi: "Phone aur laptop dono ko channel 1 par ek frame bhejna hai. Channel free hote hi dono ek random backoff ka countdown karte hain; laptop ka pehle khatam hota hai, toh woh bhejta hai, aur phone channel busy sun kar apna countdown rok deta hai. AP1 har frame ka ACK bhejta hai, aur hawa phir free hote hi phone bhejta hai.",
      },
      focus: ["phone", "laptop", "ap1"],
      packets: [
        { path: ["laptop", "ap1"], label: "Data", tone: "blue" },
        { path: ["ap1", "laptop"], label: "ACK", tone: "green", delay: 1 },
        { path: ["phone", "ap1"], label: "Data", tone: "blue", delay: 2 },
        { path: ["ap1", "phone"], label: "ACK", tone: "green", delay: 3 },
      ],
    },
    {
      title: { en: "The user walks toward AP2", hi: "User AP2 ki taraf chalta hai" },
      text: {
        en: "The user carries the laptop down the corridor toward AP2 (the icon stays put; watch the readings). AP1 fades to -74 dBm while AP2 rises to -58 dBm. The client, not the AP, decides when to roam, and the cells overlap by about 10-15 percent so there is no dead spot on the way.",
        hi: "User laptop le kar corridor mein AP2 ki taraf jaata hai (icon wahi rehta hai; readings dekho). AP1 ka signal -74 dBm tak gir jaata hai aur AP2 ka -58 dBm tak badh jaata hai. Roam kab karna hai yeh client decide karta hai, AP nahi, aur cells lagbhag 10-15 percent overlap karte hain taaki raaste mein koi dead spot na aaye.",
      },
      focus: ["laptop"],
      links: [
        { id: "w-lap1", state: "active", note: "-74 dBm" },
        { id: "w-lap2", state: "normal", note: "-58 dBm" },
      ],
      tables: [
        {
          ...heard,
          rows: [
            ["Office", "00a2.ee00.0101", "1", "-74 dBm"],
            ["Office", "00a2.ee00.0201", "6", "-58 dBm"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Reassociation: same SSID, new BSSID", hi: "Reassociation: same SSID, naya BSSID" },
      text: {
        en: "The laptop sends a reassociation request to AP2 on channel 6, and AP2 accepts it. The SSID is still Office and it still maps to VLAN 20, so the laptop keeps 10.10.20.15; only the BSSID (00a2.ee00.0101 to 00a2.ee00.0201) and the channel (1 to 6) changed. Moving between BSSs of one ESS like this is roaming.",
        hi: "Laptop channel 6 par AP2 ko reassociation request bhejta hai, aur AP2 accept kar leta hai. SSID abhi bhi Office hai aur VLAN 20 se hi mapped hai, isliye laptop ka IP 10.10.20.15 hi rehta hai; sirf BSSID (00a2.ee00.0101 se 00a2.ee00.0201) aur channel (1 se 6) badle. Ek ESS ke andar ek BSS se doosre BSS mein jaana hi roaming hai.",
      },
      focus: ["laptop", "ap2"],
      packets: [
        { path: ["laptop", "ap2"], label: "Reassoc Request", tone: "purple" },
        { path: ["ap2", "laptop"], label: "Reassoc Response", tone: "purple", delay: 1 },
      ],
      links: [
        { id: "w-lap1", state: "dim" },
        { id: "w-lap2", state: "active", note: "associated" },
      ],
      badges: [{ node: "laptop", text: "IP unchanged", tone: "green" }],
      tables: [
        { node: "ap1", title: "AP1 clients", columns: ["Client MAC", "SSID"], rows: [["0050.56aa.0022", "Office"]] },
        { node: "ap2", title: "AP2 clients", columns: ["Client MAC", "SSID"], rows: [["0050.56aa.0015", "Office"]], hl: [0] },
      ],
    },
    {
      title: { en: "SW1 relearns the laptop on a new port", hi: "SW1 laptop ko naye port par seekhta hai" },
      text: {
        en: "The laptop's next frame reaches SW1 through AP2 on Gi1/0/2. SW1 sees the source MAC on a new port and moves the entry, so R1's replies now go out Gi1/0/2 to AP2. R1's ARP entry for 10.10.20.15 does not change: same IP, same MAC.",
        hi: "Laptop ka agla frame AP2 ke through Gi1/0/2 par SW1 tak pahunchta hai. SW1 ko source MAC naye port par dikhta hai, toh woh entry move kar deta hai, isliye ab R1 ke replies Gi1/0/2 se AP2 ki taraf jaate hain. R1 ki 10.10.20.15 wali ARP entry nahi badalti: same IP, same MAC.",
      },
      badges: [{ node: "laptop", text: "" }],
      packets: [
        { path: ["laptop", "ap2", "sw1", "r1"], label: "Ping 10.10.20.1", tone: "blue" },
        { path: ["r1", "sw1", "ap2", "laptop"], label: "Echo Reply", tone: "green", delay: 3 },
      ],
      tables: [
        {
          ...macTable,
          rows: [
            ["0050.56aa.0015", "Gi1/0/2"],
            ["0011.2233.4401", "Gi1/0/24"],
          ],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "Different channels can transmit together", hi: "Alag channels ek saath transmit kar sakte hain" },
      text: {
        en: "The phone on AP1, the laptop on AP2 and the tablet on AP3 all send at the same moment. They are on channels 1, 6 and 11, so the three transmissions do not collide; only devices on the same channel take turns. If AP2 used channel 3 instead of 6, it would overlap AP1's channel 1 and both cells would suffer.",
        hi: "AP1 par phone, AP2 par laptop aur AP3 par tablet, teeno ek hi pal mein bhejte hain. Yeh channels 1, 6 aur 11 par hain, isliye teeno transmissions collide nahi karte; baari baari sirf same channel wale devices ko karni padti hai. Agar AP2 channel 6 ki jagah channel 3 use karta, toh woh AP1 ke channel 1 se overlap karta aur dono cells ka performance girta.",
      },
      focus: ["ap1", "ap2", "ap3"],
      packets: [
        { path: ["phone", "ap1"], label: "Data", tone: "blue" },
        { path: ["laptop", "ap2"], label: "Data", tone: "blue" },
        { path: ["tablet", "ap3"], label: "Data", tone: "blue" },
        { path: ["ap1", "phone"], label: "ACK", tone: "green", delay: 1 },
        { path: ["ap2", "laptop"], label: "ACK", tone: "green", delay: 1 },
        { path: ["ap3", "tablet"], label: "ACK", tone: "green", delay: 1 },
      ],
    },
  ],
};

export default scene;
