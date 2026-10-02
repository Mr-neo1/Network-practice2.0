import type { TopologyScene } from "../types.ts";

// Same HQ network as lesson 2.8 (wireless-architectures): CSW1 is the Layer 3 core and the
// gateway for every VLAN, WLC1 sits on a static LAG trunk (VLANs 20 and 99), AP1 is a
// local-mode lightweight AP on an access port in VLAN 10, SRV1 is the DHCP server in VLAN 30.
// The admin builds WLAN CORP (WPA2-PSK, VLAN 20) in the WLC GUI, then Phone1 joins and gets
// 10.1.20.31 by DHCP, relayed by WLC1 from its dynamic interface 10.1.20.10.
// Colours: blue = admin GUI (HTTPS), purple = CAPWAP control, orange = client requests and
// beacons, green = replies.

const scene: TopologyScene = {
  kind: "topology",
  id: "wlc-config",
  title: { en: "Build a WLAN on the WLC, then watch a phone join it", hi: "WLC par WLAN banao, phir phone ko join hote dekho" },
  height: 420,
  nodes: [
    { id: "admin", kind: "pc", x: 120, y: 90, label: "Admin PC", sub: "10.1.99.50" },
    { id: "ap1", kind: "ap", x: 560, y: 90, label: "AP1", sub: "10.1.10.11", sub2: "local mode" },
    { id: "phone", kind: "phone", x: 715, y: 90, label: "Phone1", sub: "a4:c3:f0:11:22:33" },
    { id: "csw1", kind: "l3switch", x: 400, y: 215, label: "CSW1", sub: "L3 core, gateways" },
    { id: "wlc1", kind: "wlc", x: 120, y: 320, label: "WLC1", sub: "mgmt 10.1.99.10" },
    { id: "srv1", kind: "server", x: 660, y: 320, label: "SRV1", sub: "10.1.30.10", sub2: "DHCP server" },
  ],
  links: [
    { id: "l-adm", a: "admin", b: "csw1", bPort: "Gi1/0/10", label: "VLAN 99" },
    { id: "l-ap1", a: "ap1", b: "csw1", bPort: "Gi1/0/1", label: "VLAN 10" },
    { id: "l-ph", a: "phone", b: "ap1", style: "wireless" },
    { id: "l-wlc", a: "csw1", b: "wlc1", aPort: "Po1", style: "bundle", label: "trunk 20,99" },
    { id: "l-srv", a: "csw1", b: "srv1", label: "VLAN 30" },
  ],
  steps: [
    {
      title: { en: "Log in to the WLC GUI", hi: "WLC GUI mein login karo" },
      text: {
        en: "The admin opens https://10.1.99.10, WLC1's management interface, and logs in. AP1 already joined WLC1 over CAPWAP, but WLC1 has no WLAN yet, so AP1 has no SSID to broadcast.",
        hi: "Admin https://10.1.99.10 kholta hai, jo WLC1 ka management interface hai, aur login karta hai. AP1 pehle hi CAPWAP se WLC1 join kar chuka hai, lekin WLC1 par abhi koi WLAN nahi hai, isliye AP1 ke paas broadcast karne ke liye koi SSID nahi.",
      },
      focus: ["admin", "wlc1"],
      packets: [
        { path: ["admin", "csw1", "wlc1"], label: "HTTPS login", tone: "blue" },
        { path: ["wlc1", "csw1", "admin"], label: "GUI page", tone: "blue", delay: 2 },
      ],
      badges: [{ node: "ap1", text: "no WLAN", tone: "gray" }],
      tables: [
        {
          node: "wlc1",
          title: "WLC1 interfaces",
          columns: ["Interface", "VLAN", "IP address", "DHCP server"],
          rows: [["management", "99", "10.1.99.10", "-"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "Create dynamic interface corp-vlan20", hi: "Dynamic interface corp-vlan20 banao" },
      text: {
        en: "CONTROLLER > Interfaces > New: name corp-vlan20, VLAN 20, IP 10.1.20.10/24, gateway 10.1.20.1 (CSW1), primary DHCP server 10.1.30.10. WLC1 now has an interface of its own in VLAN 20, whose frames are tagged 20 on the LAG trunk.",
        hi: "CONTROLLER > Interfaces > New: naam corp-vlan20, VLAN 20, IP 10.1.20.10/24, gateway 10.1.20.1 (CSW1), primary DHCP server 10.1.30.10. Ab VLAN 20 mein bhi WLC1 ka apna interface hai, jiske frames LAG trunk par tag 20 ke saath jaate hain.",
      },
      focus: ["wlc1"],
      packets: [{ path: ["admin", "csw1", "wlc1"], label: "Apply", tone: "blue" }],
      links: [{ id: "l-wlc", state: "active", note: "VLAN 20 now used" }],
      tables: [
        {
          node: "wlc1",
          title: "WLC1 interfaces",
          columns: ["Interface", "VLAN", "IP address", "DHCP server"],
          rows: [
            ["management", "99", "10.1.99.10", "-"],
            ["corp-vlan20", "20", "10.1.20.10", "10.1.30.10"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "Create WLAN CORP and map it to VLAN 20", hi: "WLAN CORP banao aur VLAN 20 se map karo" },
      text: {
        en: "WLANs > Create New: profile name CORP, SSID CORP, WLAN ID 1. On the General tab the interface is changed from management to corp-vlan20, so CORP's clients will land in VLAN 20. The WLAN is still disabled.",
        hi: "WLANs > Create New: profile name CORP, SSID CORP, WLAN ID 1. General tab par interface ko management se badal kar corp-vlan20 kiya, taaki CORP ke clients VLAN 20 mein jaayein. WLAN abhi bhi disabled hai.",
      },
      focus: ["wlc1"],
      packets: [{ path: ["admin", "csw1", "wlc1"], label: "Apply", tone: "blue" }],
      links: [{ id: "l-wlc", state: "normal" }],
      tables: [
        {
          node: "wlc1",
          title: "WLAN CORP",
          columns: ["Setting", "Value"],
          rows: [
            ["ID / Profile / SSID", "1 / CORP / CORP"],
            ["Interface", "corp-vlan20"],
            ["Status", "Disabled"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Security tab: WPA2 with AES and a PSK", hi: "Security tab: WPA2, AES aur PSK" },
      text: {
        en: "A new WLAN defaults to WPA2, AES and 802.1X. For a shared key the admin unticks 802.1X, ticks PSK, chooses ASCII and types the passphrase (8 to 63 characters).",
        hi: "Naya WLAN by default WPA2, AES aur 802.1X ke saath aata hai. Shared key ke liye admin 802.1X untick karta hai, PSK tick karta hai, ASCII chunta hai aur passphrase type karta hai (8 se 63 characters).",
      },
      focus: ["wlc1"],
      packets: [{ path: ["admin", "csw1", "wlc1"], label: "Apply", tone: "blue" }],
      tables: [
        {
          node: "wlc1",
          title: "WLAN CORP",
          columns: ["Setting", "Value"],
          rows: [
            ["ID / Profile / SSID", "1 / CORP / CORP"],
            ["Interface", "corp-vlan20"],
            ["Security", "WPA2 + AES + PSK"],
            ["Status", "Disabled"],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "QoS and Advanced tabs", hi: "QoS aur Advanced tabs" },
      text: {
        en: "CORP carries normal data, so the QoS profile stays at Silver (best effort), the default. A WLAN for Wi-Fi voice handsets would use Platinum. On the Advanced tab the admin ticks DHCP Addr. Assignment Required, so clients must get their address by DHCP.",
        hi: "CORP par normal data chalta hai, isliye QoS profile default Silver (best effort) hi rehta hai. Wi-Fi voice handsets wale WLAN ke liye Platinum lagta. Advanced tab par admin DHCP Addr. Assignment Required tick karta hai, taaki clients ko address DHCP se hi lena pade.",
      },
      focus: ["wlc1"],
      packets: [{ path: ["admin", "csw1", "wlc1"], label: "Apply", tone: "blue" }],
      tables: [
        {
          node: "wlc1",
          title: "WLAN CORP",
          columns: ["Setting", "Value"],
          rows: [
            ["ID / Profile / SSID", "1 / CORP / CORP"],
            ["Interface", "corp-vlan20"],
            ["Security", "WPA2 + AES + PSK"],
            ["QoS", "Silver (default)"],
            ["Advanced", "DHCP addr. required"],
            ["Status", "Disabled"],
          ],
          hl: [3, 4],
        },
      ],
    },
    {
      title: { en: "Enable the WLAN; AP1 starts beaconing", hi: "WLAN enable karo; AP1 beacons shuru karta hai" },
      text: {
        en: "The admin ticks Status: Enabled and clicks Apply. WLC1 pushes CORP to AP1 over the CAPWAP control tunnel (UDP 5246), and AP1 starts sending beacons for CORP. Phone1 now sees CORP in its Wi-Fi list.",
        hi: "Admin Status: Enabled tick karke Apply dabata hai. WLC1 CORP ko CAPWAP control tunnel (UDP 5246) se AP1 tak push karta hai, aur AP1 CORP ke beacons bhejna shuru kar deta hai. Ab Phone1 ki Wi-Fi list mein CORP dikhta hai.",
      },
      focus: ["wlc1", "ap1"],
      packets: [
        { path: ["admin", "csw1", "wlc1"], label: "Enable", tone: "blue" },
        { path: ["wlc1", "csw1", "ap1"], label: "WLAN CORP", tone: "purple", delay: 2 },
        { path: ["ap1", "phone"], label: "Beacon CORP", tone: "orange", delay: 4 },
      ],
      badges: [{ node: "ap1", text: "CORP", tone: "purple" }],
      tables: [
        {
          node: "wlc1",
          title: "WLAN CORP",
          columns: ["Setting", "Value"],
          rows: [
            ["ID / Profile / SSID", "1 / CORP / CORP"],
            ["Interface", "corp-vlan20"],
            ["Security", "WPA2 + AES + PSK"],
            ["QoS", "Silver (default)"],
            ["Advanced", "DHCP addr. required"],
            ["Status", "Enabled"],
          ],
          hl: [5],
        },
      ],
    },
    {
      title: { en: "Phone1 associates and proves the key", hi: "Phone1 associate karta hai aur key prove karta hai" },
      text: {
        en: "Phone1's association request goes from AP1 to WLC1 inside CAPWAP, because in local mode the WLC decides. WLC1 accepts it, then the WPA2 4-way handshake proves both sides hold the same PSK. WLC1 puts Phone1 in VLAN 20 and holds it in DHCP_REQD: only DHCP may pass until it has an address.",
        hi: "Phone1 ki association request AP1 se CAPWAP ke andar WLC1 tak jaati hai, kyunki local mode mein faisla WLC leta hai. WLC1 accept karta hai, phir WPA2 4-way handshake se prove hota hai ki dono ke paas same PSK hai. WLC1 Phone1 ko VLAN 20 mein daalta hai aur DHCP_REQD state mein rakhta hai: address milne tak sirf DHCP pass ho sakta hai.",
      },
      focus: ["phone", "wlc1"],
      packets: [
        { path: ["phone", "ap1", "csw1", "wlc1"], label: "Assoc Request", tone: "orange" },
        { path: ["wlc1", "csw1", "ap1", "phone"], label: "Assoc Response", tone: "green", delay: 3 },
      ],
      badges: [{ node: "phone", text: "WPA2 OK", tone: "green" }],
      tables: [
        {
          node: "wlc1",
          title: "WLC1 clients",
          columns: ["Client MAC", "IP address", "VLAN", "State"],
          rows: [["a4:c3:f0:11:22:33", "-", "20", "DHCP_REQD"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "DHCP Discover: WLC1 relays it", hi: "DHCP Discover: WLC1 use relay karta hai" },
      text: {
        en: "Phone1 broadcasts a DHCP Discover. AP1 tunnels it to WLC1. With DHCP proxy on (the AireOS default), WLC1 does not flood it onto VLAN 20; it relays it as unicast from 10.1.20.10 to SRV1 at 10.1.30.10. The relay address 10.1.20.10 tells SRV1 to pick from its 10.1.20.0/24 pool.",
        hi: "Phone1 DHCP Discover broadcast karta hai. AP1 use WLC1 tak tunnel karta hai. DHCP proxy on hai (AireOS ka default), isliye WLC1 ise VLAN 20 par flood nahi karta; 10.1.20.10 se SRV1 (10.1.30.10) ko unicast mein relay kar deta hai. Relay address 10.1.20.10 dekh kar SRV1 samajh jaata hai ki 10.1.20.0/24 pool se address dena hai.",
      },
      focus: ["wlc1", "srv1"],
      badges: [{ node: "phone", text: "" }],
      packets: [
        { path: ["phone", "ap1", "csw1", "wlc1"], label: "DHCP Discover", tone: "orange" },
        { path: ["wlc1", "csw1", "srv1"], label: "Relayed Discover", tone: "orange", delay: 3 },
      ],
      links: [{ id: "l-wlc", state: "active", note: "in VLAN 99, out VLAN 20" }],
    },
    {
      title: { en: "DHCP Offer comes back the same way", hi: "DHCP Offer usi raaste wapas aata hai" },
      text: {
        en: "SRV1 offers 10.1.20.31 with gateway 10.1.20.1 and sends the Offer to the relay, 10.1.20.10. WLC1 forwards it to Phone1 through AP1's CAPWAP tunnel. Phone1 sees the DHCP server as WLC1's virtual interface, 192.0.2.1, not SRV1.",
        hi: "SRV1 10.1.20.31 offer karta hai, gateway 10.1.20.1 ke saath, aur Offer relay address 10.1.20.10 par bhejta hai. WLC1 ise AP1 ke CAPWAP tunnel se Phone1 tak forward karta hai. Phone1 ko DHCP server SRV1 nahi, WLC1 ka virtual interface 192.0.2.1 dikhta hai.",
      },
      focus: ["srv1", "phone"],
      packets: [{ path: ["srv1", "csw1", "wlc1", "csw1", "ap1", "phone"], label: "DHCP Offer", tone: "green" }],
    },
    {
      title: { en: "Request and ACK: Phone1 is in VLAN 20", hi: "Request aur ACK: Phone1 VLAN 20 mein hai" },
      text: {
        en: "Phone1 requests 10.1.20.31 and SRV1 acknowledges it, both through WLC1 again. WLC1 learns the address and moves Phone1 to RUN, so its traffic now flows normally, bridged by WLC1 onto VLAN 20.",
        hi: "Phone1 10.1.20.31 request karta hai aur SRV1 ACK deta hai, dono phir WLC1 se hokar. WLC1 address seekh leta hai aur Phone1 ko RUN state mein daal deta hai, ab uska traffic normal chalta hai, WLC1 use VLAN 20 par bridge karta hai.",
      },
      focus: ["phone", "wlc1"],
      packets: [
        { path: ["phone", "ap1", "csw1", "wlc1", "csw1", "srv1"], label: "DHCP Request", tone: "orange" },
        { path: ["srv1", "csw1", "wlc1", "csw1", "ap1", "phone"], label: "DHCP ACK", tone: "green", delay: 5 },
      ],
      links: [{ id: "l-wlc", state: "normal" }],
      badges: [{ node: "phone", text: "10.1.20.31", tone: "green" }],
      tables: [
        {
          node: "wlc1",
          title: "WLC1 clients",
          columns: ["Client MAC", "IP address", "VLAN", "State"],
          rows: [["a4:c3:f0:11:22:33", "10.1.20.31", "20", "RUN"]],
          hl: [0],
        },
      ],
    },
  ],
};

export default scene;
