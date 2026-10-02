import type { TopologyScene } from "../types.ts";

// HQ: two lightweight APs in local mode on access ports (VLAN 10), WLC1 on a LAG trunk
// (management VLAN 99, client VLAN 20), SRV1 in VLAN 30. CSW1 is the Layer 3 core and the
// gateway for every HQ VLAN. Branch: AP3 in FlexConnect mode on a trunk, local VLAN 20.
// Colours: purple = CAPWAP control, orange = association request, green = association
// response, blue = client data (inside the tunnel or switched locally).

const scene: TopologyScene = {
  kind: "topology",
  id: "wireless-architectures",
  title: { en: "Local mode tunnels to the WLC, FlexConnect switches locally", hi: "Local mode WLC tak tunnel karta hai, FlexConnect locally switch karta hai" },
  height: 460,
  nodes: [
    { id: "laptop", kind: "laptop", x: 55, y: 80, label: "Laptop1", sub: "10.1.20.25" },
    { id: "ap1", kind: "ap", x: 170, y: 80, label: "AP1", sub: "10.1.10.11", sub2: "local mode" },
    { id: "ap2", kind: "ap", x: 430, y: 80, label: "AP2", sub: "10.1.10.12", sub2: "local mode" },
    { id: "csw1", kind: "l3switch", x: 300, y: 240, label: "CSW1", sub: "HQ core (L3)" },
    { id: "wlc1", kind: "wlc", x: 110, y: 350, label: "WLC1", sub: "mgmt 10.1.99.10" },
    { id: "srv1", kind: "server", x: 440, y: 350, label: "SRV1", sub: "10.1.30.10" },
    { id: "wan", kind: "cloud", x: 560, y: 240, label: "WAN" },
    { id: "bsw1", kind: "l3switch", x: 700, y: 240, label: "BR-SW1", sub: "branch (L3)" },
    { id: "ap3", kind: "ap", x: 570, y: 80, label: "AP3", sub: "10.2.10.11", sub2: "FlexConnect" },
    { id: "phone", kind: "phone", x: 720, y: 80, label: "Phone2", sub: "10.2.20.30" },
    { id: "prn1", kind: "printer", x: 560, y: 385, label: "PRN1", sub: "10.2.20.50" },
  ],
  links: [
    { id: "l-lap", a: "laptop", b: "ap1", style: "wireless" },
    { id: "l-ap1", a: "ap1", b: "csw1", bPort: "Gi1/0/1", label: "access" },
    { id: "l-ap2", a: "ap2", b: "csw1", bPort: "Gi1/0/2", label: "access" },
    { id: "l-wlc", a: "csw1", b: "wlc1", aPort: "Po1", style: "bundle", label: "LAG trunk" },
    { id: "l-srv", a: "csw1", b: "srv1", label: "VLAN 30" },
    { id: "l-wan1", a: "csw1", b: "wan" },
    { id: "l-wan2", a: "wan", b: "bsw1" },
    { id: "l-ap3", a: "ap3", b: "bsw1", bPort: "Gi1/0/1", style: "trunk", label: "trunk" },
    { id: "l-ph", a: "phone", b: "ap3", style: "wireless" },
    { id: "l-prn", a: "bsw1", b: "prn1", label: "VLAN 20" },
  ],
  steps: [
    {
      title: { en: "AP1 and AP2 join WLC1 over CAPWAP", hi: "AP1 aur AP2 CAPWAP se WLC1 join karte hain" },
      text: {
        en: "AP1 and AP2 are lightweight APs on access ports in VLAN 10. They hold no WLAN settings of their own. Each sends a CAPWAP join request to WLC1's management address, 10.1.99.10, and CSW1 routes these UDP packets from VLAN 10 to VLAN 99 like any other traffic.",
        hi: "AP1 aur AP2 lightweight APs hain, VLAN 10 ke access ports par. Inke paas apni koi WLAN settings nahi hain. Dono WLC1 ke management address 10.1.99.10 ko CAPWAP join request bhejte hain, aur CSW1 in UDP packets ko baaki traffic ki tarah VLAN 10 se VLAN 99 mein route kar deta hai.",
      },
      focus: ["ap1", "ap2", "wlc1"],
      packets: [
        { path: ["ap1", "csw1", "wlc1"], label: "CAPWAP Join", tone: "purple" },
        { path: ["ap2", "csw1", "wlc1"], label: "CAPWAP Join", tone: "purple" },
      ],
      tables: [
        {
          node: "wlc1",
          title: "WLC1 joined APs",
          columns: ["AP", "IP address", "Mode"],
          rows: [
            ["AP1", "10.1.10.11", "Local"],
            ["AP2", "10.1.10.12", "Local"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Control tunnel: WLC1 pushes the settings", hi: "Control tunnel: WLC1 settings push karta hai" },
      text: {
        en: "Over the CAPWAP control tunnel (UDP 5246, always encrypted with DTLS) WLC1 sends each AP the WLAN CORP, mapped to VLAN 20, plus a channel and a transmit power. It gives the neighbours different 5 GHz channels, 36 and 44, so they do not interfere. Both APs start sending beacons for CORP.",
        hi: "CAPWAP control tunnel (UDP 5246, hamesha DTLS se encrypted) par WLC1 har AP ko WLAN CORP bhejta hai, jo VLAN 20 se mapped hai, saath mein ek channel aur transmit power. Dono padosi APs ko alag 5 GHz channels milte hain, 36 aur 44, taaki interference na ho. Dono APs CORP ke beacons bhejna shuru kar dete hain.",
      },
      packets: [
        { path: ["wlc1", "csw1", "ap1"], label: "WLAN CORP", tone: "purple" },
        { path: ["wlc1", "csw1", "ap2"], label: "WLAN CORP", tone: "purple" },
      ],
      badges: [
        { node: "ap1", text: "CORP ch 36", tone: "purple" },
        { node: "ap2", text: "CORP ch 44", tone: "purple" },
      ],
      tables: [
        {
          node: "wlc1",
          title: "WLC1 WLANs",
          columns: ["WLAN", "Interface", "VLAN"],
          rows: [["CORP", "corp-vlan20", "20"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "Laptop1 associates, and WLC1 decides", hi: "Laptop1 associate karta hai, faisla WLC1 leta hai" },
      text: {
        en: "Laptop1 asks AP1 to join CORP. AP1 passes the request up the tunnel, because in split-MAC the WLC handles association and client authentication. WLC1 accepts the laptop and ties it to VLAN 20, where it later gets 10.1.20.25 by DHCP.",
        hi: "Laptop1 AP1 se CORP join karne ki request karta hai. AP1 yeh request tunnel se upar bhej deta hai, kyunki split-MAC mein association aur client authentication WLC sambhalta hai. WLC1 laptop ko accept karta hai aur use VLAN 20 se jod deta hai, jahan baad mein DHCP se use 10.1.20.25 milta hai.",
      },
      focus: ["laptop", "wlc1"],
      packets: [
        { path: ["laptop", "ap1", "csw1", "wlc1"], label: "Assoc Request", tone: "orange" },
        { path: ["wlc1", "csw1", "ap1", "laptop"], label: "Assoc Response", tone: "green", delay: 3 },
      ],
    },
    {
      title: { en: "Client data rides the data tunnel", hi: "Client data, data tunnel mein jaata hai" },
      text: {
        en: "Laptop1 sends a packet to SRV1, 10.1.30.10. AP1 does not put the frame on its switch port as it is. It wraps the whole 802.11 frame in CAPWAP and sends it to 10.1.99.10 on UDP 5247. CSW1 forwards it using only the outer header: a packet from AP1 to WLC1.",
        hi: "Laptop1 SRV1 (10.1.30.10) ko packet bhejta hai. AP1 frame ko waise ka waisa switch port par nahi daalta. Woh poore 802.11 frame ko CAPWAP mein wrap karke UDP 5247 par 10.1.99.10 ko bhejta hai. CSW1 sirf bahar wala header dekh kar forward karta hai: AP1 se WLC1 ka ek packet.",
      },
      focus: ["ap1"],
      packets: [
        { path: ["laptop", "ap1"], label: "802.11 frame", tone: "blue" },
        { path: ["ap1", "csw1", "wlc1"], label: "CAPWAP data", tone: "blue", delay: 1 },
      ],
      links: [
        { id: "l-ap1", state: "active", note: "CAPWAP UDP 5247" },
        { id: "l-wlc", state: "active" },
      ],
    },
    {
      title: { en: "WLC1 bridges the frame onto VLAN 20", hi: "WLC1 frame ko VLAN 20 par bridge karta hai" },
      text: {
        en: "WLC1 removes the CAPWAP header, turns the 802.11 frame into an Ethernet frame and sends it out of its VLAN 20 dynamic interface, tagged 20 on the LAG trunk. CSW1 is the VLAN 20 gateway, 10.1.20.1, so it routes the packet to SRV1. The data crossed the CSW1-WLC1 link twice: once inside the tunnel, once as normal traffic.",
        hi: "WLC1 CAPWAP header hata deta hai, 802.11 frame ko Ethernet frame bana deta hai aur apne VLAN 20 dynamic interface se bhejta hai, LAG trunk par tag 20 ke saath. CSW1 VLAN 20 ka gateway (10.1.20.1) hai, isliye woh packet ko SRV1 tak route karta hai. Data ne CSW1-WLC1 link do baar cross kiya: ek baar tunnel ke andar, ek baar normal traffic ban kar.",
      },
      focus: ["wlc1", "srv1"],
      packets: [
        { path: ["wlc1", "csw1"], label: "VLAN 20 frame", tone: "blue" },
        { path: ["csw1", "srv1"], label: "to 10.1.30.10", tone: "blue", delay: 1 },
      ],
      links: [
        { id: "l-ap1", state: "normal" },
        { id: "l-wlc", state: "active", note: "tag 20" },
        { id: "l-srv", state: "active" },
      ],
    },
    {
      title: { en: "WLC1 switches AP2 to monitor mode", hi: "WLC1 AP2 ko monitor mode mein daalta hai" },
      text: {
        en: "AP modes are set per AP on the WLC. The admin changes AP2 to monitor mode, and WLC1 sends the change over CAPWAP. AP2 reboots, stops beaconing CORP and serves no clients. Its radio now only listens on all channels and reports rogue APs and intrusion events to WLC1.",
        hi: "AP mode har AP ke liye WLC par set hota hai. Admin AP2 ko monitor mode mein badalta hai, aur WLC1 yeh change CAPWAP se bhejta hai. AP2 reboot hota hai, CORP ke beacons band kar deta hai aur koi client serve nahi karta. Ab uska radio sirf saare channels par sunta hai aur rogue APs aur intrusion events WLC1 ko report karta hai.",
      },
      focus: ["ap2"],
      packets: [{ path: ["wlc1", "csw1", "ap2"], label: "Mode: monitor", tone: "purple" }],
      links: [
        { id: "l-wlc", state: "normal" },
        { id: "l-srv", state: "normal" },
      ],
      badges: [{ node: "ap2", text: "monitor", tone: "gray" }],
      tables: [
        {
          node: "wlc1",
          title: "WLC1 joined APs",
          columns: ["AP", "IP address", "Mode"],
          rows: [
            ["AP1", "10.1.10.11", "Local"],
            ["AP2", "10.1.10.12", "Monitor"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "Branch AP3 joins across the WAN", hi: "Branch ka AP3 WAN ke paar se join karta hai" },
      text: {
        en: "AP3 at the branch is also a lightweight AP, set to FlexConnect mode. Its CAPWAP join crosses the WAN to the same WLC1, so the branch needs no controller of its own. AP3 sits on a trunk port: native VLAN 10 carries its own traffic, VLAN 20 is for clients.",
        hi: "Branch ka AP3 bhi lightweight AP hai, lekin FlexConnect mode mein. Uski CAPWAP join request WAN cross karke usi WLC1 tak jaati hai, isliye branch ko apna alag controller nahi chahiye. AP3 trunk port par hai: native VLAN 10 mein uska apna traffic, aur VLAN 20 clients ke liye.",
      },
      focus: ["ap3", "wlc1"],
      packets: [{ path: ["ap3", "bsw1", "wan", "csw1", "wlc1"], label: "CAPWAP Join", tone: "purple" }],
      tables: [
        {
          node: "wlc1",
          title: "WLC1 joined APs",
          columns: ["AP", "IP address", "Mode"],
          rows: [
            ["AP1", "10.1.10.11", "Local"],
            ["AP2", "10.1.10.12", "Monitor"],
            ["AP3", "10.2.10.11", "FlexConnect"],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "FlexConnect switches the data locally", hi: "FlexConnect data ko locally switch karta hai" },
      text: {
        en: "Phone2 (10.2.20.30) prints to PRN1 (10.2.20.50). CORP has local switching on for AP3, so AP3 turns the frame into Ethernet itself and puts it on VLAN 20, tagged on its trunk. The print job never crosses the WAN; only CAPWAP control traffic goes to WLC1.",
        hi: "Phone2 (10.2.20.30) PRN1 (10.2.20.50) par print bhejta hai. AP3 ke liye CORP par local switching on hai, isliye AP3 khud frame ko Ethernet bana kar VLAN 20 par daal deta hai, trunk par tag ke saath. Print job kabhi WAN cross nahi karta; WLC1 tak sirf CAPWAP control traffic jaata hai.",
      },
      focus: ["ap3", "prn1"],
      packets: [
        { path: ["phone", "ap3"], label: "802.11 frame", tone: "blue" },
        { path: ["ap3", "bsw1", "prn1"], label: "VLAN 20 frame", tone: "blue", delay: 1 },
      ],
      badges: [{ node: "ap3", text: "local switching", tone: "teal" }],
      tables: [
        {
          node: "ap3",
          title: "AP3 FlexConnect WLANs",
          columns: ["WLAN", "VLAN", "Switching"],
          rows: [["CORP", "20", "Local"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "The WAN fails; the branch keeps working", hi: "WAN fail hua; branch chalti rehti hai" },
      text: {
        en: "The WAN link fails and AP3 loses its CAPWAP tunnel. It moves to standalone mode and keeps serving CORP, so Phone2 can still print. A local-mode AP in the same place would drop its clients and start searching for a controller.",
        hi: "WAN link fail hota hai aur AP3 ka CAPWAP tunnel toot jaata hai. AP3 standalone mode mein chala jaata hai aur CORP serve karta rehta hai, isliye Phone2 abhi bhi print kar sakta hai. Isi jagah local-mode AP hota toh apne clients drop kar deta aur controller dhoondhne lagta.",
      },
      focus: ["ap3", "phone", "prn1"],
      links: [{ id: "l-wan2", state: "down", note: "WAN down" }],
      packets: [
        { path: ["phone", "ap3"], label: "802.11 frame", tone: "blue" },
        { path: ["ap3", "bsw1", "prn1"], label: "VLAN 20 frame", tone: "blue", delay: 1 },
      ],
      badges: [{ node: "ap3", text: "standalone", tone: "orange" }],
    },
  ],
};

export default scene;
