import type { TopologyScene } from "../types.ts";

// Same branch as the mega-lab lesson.
// Colours: orange = broadcast/DHCP discovery, blue = data, green = reply/allowed,
// red = denied, purple = control plane (BPDU, OSPF), teal = management (NTP, syslog, SSH).

const scene: TopologyScene = {
  kind: "topology",
  id: "mega-lab",
  title: { en: "Building the branch, one feature at a time", hi: "Branch banana, ek-ek feature karke" },
  height: 520,
  nodes: [
    { id: "isp", kind: "router", x: 400, y: 70, label: "ISP", sub: "203.0.113.1" },
    { id: "web", kind: "server", x: 640, y: 70, label: "WEB", sub: "198.51.100.10" },
    { id: "r1", kind: "router", x: 400, y: 190, label: "R1", sub: "Gi0/0 203.0.113.2", sub2: "Gi0/1 10.0.0.1" },
    { id: "dsw1", kind: "l3switch", x: 400, y: 330, label: "DSW1", sub: "Gi1/0/24 10.0.0.2", sub2: "SVIs 10.1.x.1" },
    { id: "srv1", kind: "server", x: 650, y: 330, label: "SRV1", sub: "10.1.99.50", sub2: "syslog, VLAN 99" },
    { id: "pc1", kind: "pc", x: 80, y: 460, label: "PC1", sub: "VLAN 10, DHCP" },
    { id: "asw1", kind: "switch", x: 240, y: 460, label: "ASW1", sub: "10.1.99.11" },
    { id: "asw2", kind: "switch", x: 560, y: 460, label: "ASW2", sub: "10.1.99.12" },
    { id: "ph1", kind: "ipphone", x: 720, y: 460, label: "PH1", sub: "VLAN 20, DHCP" },
  ],
  links: [
    { id: "l-web", a: "isp", b: "web", label: "Internet" },
    { id: "l-wan", a: "r1", b: "isp", aPort: "Gi0/0", label: "203.0.113.0/30" },
    { id: "l-up", a: "dsw1", b: "r1", aPort: "Gi1/0/24", bPort: "Gi0/1", label: "10.0.0.0/30" },
    { id: "l-srv", a: "dsw1", b: "srv1", aPort: "Gi1/0/10" },
    { id: "l-t1", a: "asw1", b: "dsw1", aPort: "Gi0/1", bPort: "Gi1/0/1", style: "trunk" },
    { id: "l-t2", a: "asw2", b: "dsw1", aPort: "Gi0/1", bPort: "Gi1/0/2", style: "trunk" },
    { id: "l-pc", a: "pc1", b: "asw1", bPort: "Fa0/1" },
    { id: "l-ph", a: "ph1", b: "asw2", bPort: "Fa0/1" },
  ],
  steps: [
    {
      title: { en: "1. VLANs and access ports", hi: "1. VLANs aur access ports" },
      text: {
        en: "All three switches now have VLANs 10, 20, 99 and 999, and Fa0/1 on each access switch is in VLAN 10 with voice VLAN 20. PC1 sends a DHCP Discover, but the uplinks are not trunks yet, so it stops at ASW1.",
        hi: "Teeno switches par ab VLANs 10, 20, 99 aur 999 hain, aur har access switch ka Fa0/1 VLAN 10 mein hai, voice VLAN 20 ke saath. PC1 DHCP Discover bhejta hai, lekin uplinks abhi trunk nahi hain, toh woh ASW1 par hi ruk jaata hai.",
      },
      focus: ["asw1", "asw2", "dsw1"],
      packets: [{ path: ["pc1", "asw1"], label: "DHCP Discover", tone: "orange", drop: true }],
      badges: [
        { node: "asw1", text: "VLANs ok", tone: "green" },
        { node: "asw2", text: "VLANs ok", tone: "green" },
        { node: "dsw1", text: "VLANs ok", tone: "green" },
      ],
      links: [
        { id: "l-t1", state: "dim", note: "no trunk yet" },
        { id: "l-t2", state: "dim" },
      ],
      tables: [
        {
          node: "dsw1",
          title: "VLAN plan",
          columns: ["VLAN", "Name", "Subnet", "Gateway"],
          rows: [
            ["10", "USERS", "10.1.10.0/24", "10.1.10.1"],
            ["20", "VOICE", "10.1.20.0/24", "10.1.20.1"],
            ["99", "MGMT", "10.1.99.0/24", "10.1.99.1"],
            ["999", "NATIVE-UNUSED", "-", "-"],
          ],
        },
      ],
    },
    {
      title: { en: "2. Trunks with native VLAN 999", hi: "2. Native VLAN 999 ke saath trunks" },
      text: {
        en: "Both uplinks become 802.1Q trunks allowing 10, 20 and 99, with native VLAN 999 on both ends and DTP off. PC1's frame now crosses to DSW1 tagged VLAN 10, and PH1's voice frame crosses tagged VLAN 20.",
        hi: "Dono uplinks 802.1Q trunks ban jaate hain jo 10, 20 aur 99 allow karte hain, dono ends par native VLAN 999 aur DTP band. PC1 ka frame ab VLAN 10 tag ke saath DSW1 tak jaata hai, aur PH1 ka voice frame VLAN 20 tag ke saath.",
      },
      packets: [
        { path: ["pc1", "asw1", "dsw1"], label: "tag 10", tone: "blue" },
        { path: ["ph1", "asw2", "dsw1"], label: "tag 20", tone: "blue" },
      ],
      badges: [
        { node: "asw1", text: "trunk ok", tone: "green" },
        { node: "asw2", text: "trunk ok", tone: "green" },
      ],
      links: [
        { id: "l-t1", state: "active", note: "10,20,99 native 999" },
        { id: "l-t2", state: "active", note: "10,20,99 native 999" },
      ],
    },
    {
      title: { en: "3. STP: DSW1 is root, edges protected", hi: "3. STP: DSW1 root, edges protected" },
      text: {
        en: "With Rapid PVST+ and root primary, DSW1 wins the election for VLANs 10, 20 and 99 and sends the BPDUs. The user ports use PortFast, so PCs forward at once, and BPDU Guard err-disables any user port that ever receives a BPDU.",
        hi: "Rapid PVST+ aur root primary ke saath DSW1 VLANs 10, 20 aur 99 ka election jeet kar BPDUs bhejta hai. User ports PortFast use karte hain, toh PCs turant forward karte hain, aur BPDU Guard us user port ko err-disable kar deta hai jahan kabhi BPDU aaye.",
      },
      packets: [
        { path: ["dsw1", "asw1"], label: "BPDU", tone: "purple" },
        { path: ["dsw1", "asw2"], label: "BPDU", tone: "purple" },
      ],
      badges: [
        { node: "dsw1", text: "STP root", tone: "purple" },
        { node: "asw1", text: "PortFast+BPDUG", tone: "green" },
        { node: "asw2", text: "PortFast+BPDUG", tone: "green" },
      ],
      links: [
        { id: "l-t1", state: "normal" },
        { id: "l-t2", state: "normal" },
      ],
    },
    {
      title: { en: "4. SVIs and the routed uplink", hi: "4. SVIs aur routed uplink" },
      text: {
        en: "ip routing turns DSW1 into a router: Vlan10, Vlan20 and Vlan99 become the gateways, and Gi1/0/24 becomes a routed port at 10.0.0.2/30. A ping from DSW1 to R1 at 10.0.0.1 proves the uplink works.",
        hi: "ip routing DSW1 ko router bana deta hai: Vlan10, Vlan20 aur Vlan99 gateways ban jaate hain, aur Gi1/0/24 10.0.0.2/30 ke saath routed port ban jaata hai. DSW1 se R1 ke 10.0.0.1 par ping prove karta hai ki uplink chal raha hai.",
      },
      packets: [
        { path: ["dsw1", "r1"], label: "Ping 10.0.0.1", tone: "blue" },
        { path: ["r1", "dsw1"], label: "Echo Reply", tone: "green", delay: 1 },
      ],
      badges: [{ node: "dsw1", text: "SVIs up", tone: "green" }],
      tables: [
        { node: "dsw1", title: "VLAN plan", columns: ["VLAN", "Name", "Subnet", "Gateway"], rows: [] },
        {
          node: "dsw1",
          title: "DSW1 interfaces",
          columns: ["Interface", "IP address", "Status"],
          rows: [
            ["Vlan10", "10.1.10.1/24", "up/up"],
            ["Vlan20", "10.1.20.1/24", "up/up"],
            ["Vlan99", "10.1.99.1/24", "up/up"],
            ["Gi1/0/24", "10.0.0.2/30", "up/up"],
          ],
          hl: [0, 1, 2, 3],
        },
      ],
    },
    {
      title: { en: "5. OSPF and the default route", hi: "5. OSPF aur default route" },
      text: {
        en: "Hellos on the /30 bring DSW1 (2.2.2.2) and R1 (1.1.1.1) to FULL. R1 learns the three VLAN subnets. R1's static default to the ISP is advertised with default-information originate, so DSW1 gets an O*E2 default route.",
        hi: "/30 par Hellos se DSW1 (2.2.2.2) aur R1 (1.1.1.1) FULL ho jaate hain. R1 teeno VLAN subnets seekh leta hai. R1 ka ISP wala static default, default-information originate se advertise hota hai, toh DSW1 ko O*E2 default route milta hai.",
      },
      focus: ["r1", "dsw1"],
      packets: [
        { path: ["dsw1", "r1"], label: "OSPF Hello", tone: "purple" },
        { path: ["r1", "dsw1"], label: "OSPF Hello", tone: "purple" },
      ],
      badges: [
        { node: "dsw1", text: "OSPF FULL", tone: "purple" },
        { node: "r1", text: "OSPF FULL", tone: "purple" },
      ],
      tables: [
        { node: "dsw1", title: "DSW1 interfaces", columns: ["Interface", "IP address", "Status"], rows: [] },
        {
          node: "r1",
          title: "R1 routes",
          columns: ["Code", "Prefix", "Next hop"],
          rows: [
            ["S*", "0.0.0.0/0", "203.0.113.1"],
            ["O", "10.1.10.0/24", "10.0.0.2"],
            ["O", "10.1.20.0/24", "10.0.0.2"],
            ["O", "10.1.99.0/24", "10.0.0.2"],
          ],
          hl: [1, 2, 3],
        },
        { node: "dsw1", title: "DSW1 routes", columns: ["Code", "Prefix", "Next hop"], rows: [["O*E2", "0.0.0.0/0", "10.0.0.1"]], hl: [0] },
      ],
    },
    {
      title: { en: "6. DHCP through the relay", hi: "6. Relay ke through DHCP" },
      text: {
        en: "PC1's Discover is a broadcast and stops at Vlan10. ip helper-address turns it into a unicast to 10.0.0.1 with giaddr 10.1.10.1, so R1 picks pool USERS. The Offer goes back to 10.1.10.1, which R1 can reach thanks to step 5; Request and Ack take the same path, and PC1 gets 10.1.10.11. PH1 gets 10.1.20.11 the same way through Vlan20 and pool VOICE.",
        hi: "PC1 ka Discover broadcast hai aur Vlan10 par ruk jaata hai. ip helper-address use 10.0.0.1 ke liye unicast bana deta hai, giaddr 10.1.10.1 ke saath, toh R1 pool USERS chunta hai. Offer wapas 10.1.10.1 par jaata hai, jo R1 step 5 ki wajah se reach kar sakta hai; Request aur Ack bhi isi raaste jaate hain, aur PC1 ko 10.1.10.11 milta hai. PH1 ko isi tarah Vlan20 aur pool VOICE se 10.1.20.11 milta hai.",
      },
      packets: [
        { path: ["pc1", "asw1", "dsw1"], label: "DHCP Discover", tone: "orange" },
        { path: ["dsw1", "r1"], label: "Relayed Discover", tone: "orange", delay: 2 },
        { path: ["r1", "dsw1", "asw1", "pc1"], label: "Offer / Ack", tone: "green", delay: 3 },
      ],
      badges: [
        { node: "pc1", text: "10.1.10.11", tone: "green" },
        { node: "ph1", text: "10.1.20.11", tone: "green" },
        { node: "r1", text: "DHCP pools", tone: "green" },
      ],
      tables: [
        { node: "r1", title: "R1 routes", columns: ["Code", "Prefix", "Next hop"], rows: [] },
        { node: "dsw1", title: "DSW1 routes", columns: ["Code", "Prefix", "Next hop"], rows: [] },
        {
          node: "r1",
          title: "R1 DHCP leases",
          columns: ["IP address", "Client", "Pool"],
          rows: [
            ["10.1.10.11", "PC1", "USERS"],
            ["10.1.20.11", "PH1", "VOICE"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "7. PAT to the internet", hi: "7. Internet ke liye PAT" },
      text: {
        en: "PC1 pings WEB. The packet leaves PC1 with source 10.1.10.11 for its gateway DSW1, which forwards it to R1 on its O*E2 default route. R1 translates the source to 203.0.113.2 on Gi0/0, records the mapping, and translates the reply back to 10.1.10.11.",
        hi: "PC1, WEB ko ping karta hai. Packet source 10.1.10.11 ke saath apne gateway DSW1 ke paas jaata hai, aur DSW1 use O*E2 default route se R1 ko bhejta hai. R1 Gi0/0 par source ko 203.0.113.2 mein translate karta hai, mapping record karta hai, aur reply ko wapas 10.1.10.11 mein translate karta hai.",
      },
      packets: [
        { path: ["pc1", "asw1", "dsw1", "r1"], label: "src 10.1.10.11", tone: "blue" },
        { path: ["r1", "isp", "web"], label: "src 203.0.113.2", tone: "blue", delay: 3 },
        { path: ["web", "isp", "r1", "dsw1", "asw1", "pc1"], label: "Echo Reply", tone: "green", delay: 5 },
      ],
      badges: [{ node: "r1", text: "PAT", tone: "green" }],
      links: [{ id: "l-wan", state: "active", note: "nat outside" }],
      tables: [
        { node: "r1", title: "R1 DHCP leases", columns: ["IP address", "Client", "Pool"], rows: [] },
        {
          node: "r1",
          title: "R1 NAT translations",
          columns: ["Pro", "Inside local", "Inside global", "Outside"],
          rows: [["icmp", "10.1.10.11:1", "203.0.113.2:1", "198.51.100.10:1"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "8. SSH only from VLAN 99", hi: "8. SSH sirf VLAN 99 se" },
      text: {
        en: "Every device now has SSH, a local user and access-class MGMT-ONLY on its VTY lines. SRV1 (10.1.99.50) opens SSH to ASW1 and gets in. PC1's SSH to 10.1.99.11 is routed by DSW1 down the trunk in VLAN 99, reaches ASW1, and is refused by the ACL.",
        hi: "Har device par ab SSH, local user aur VTY lines par access-class MGMT-ONLY hai. SRV1 (10.1.99.50) ASW1 par SSH kholta hai aur andar pahunch jaata hai. PC1 ka 10.1.99.11 wala SSH DSW1 route karke VLAN 99 mein trunk se neeche bhejta hai, ASW1 tak pahunchta hai, aur ACL use refuse kar deti hai.",
      },
      links: [{ id: "l-wan", state: "normal" }],
      packets: [
        { path: ["srv1", "dsw1", "asw1"], label: "SSH 10.1.99.50", tone: "teal" },
        { path: ["pc1", "asw1", "dsw1", "asw1"], label: "SSH 10.1.10.11", tone: "red", drop: true, delay: 2 },
      ],
      badges: [
        { node: "asw1", text: "SSH: VLAN 99 only", tone: "teal" },
        { node: "pc1", text: "refused", tone: "red" },
      ],
    },
    {
      title: { en: "9. NTP and syslog", hi: "9. NTP aur syslog" },
      text: {
        en: "Time flows down a chain: R1 syncs to the ISP, DSW1 to R1, the access switches to DSW1. logging host sends every device's messages to SRV1 on UDP 514, and because the clocks agree, the msec timestamps put events from the whole branch in the right order on one screen.",
        hi: "Time ek chain mein neeche aata hai: R1 ISP se sync hota hai, DSW1 R1 se, access switches DSW1 se. logging host har device ke messages UDP 514 par SRV1 bhejta hai, aur clocks match hain, isliye msec timestamps poore branch ke events ko ek hi screen par sahi order mein dikhate hain.",
      },
      packets: [
        { path: ["r1", "isp"], label: "NTP", tone: "teal" },
        { path: ["dsw1", "r1"], label: "NTP", tone: "teal", delay: 1 },
        { path: ["asw2", "dsw1"], label: "NTP", tone: "teal", delay: 2 },
        { path: ["asw1", "dsw1", "srv1"], label: "Syslog", tone: "teal", delay: 3 },
        { path: ["r1", "dsw1", "srv1"], label: "Syslog", tone: "teal", delay: 3 },
      ],
      badges: [
        { node: "pc1", text: "" },
        { node: "srv1", text: "logs arriving", tone: "teal" },
        { node: "r1", text: "NTP stratum 3", tone: "teal" },
        { node: "asw2", text: "NTP synced", tone: "teal" },
      ],
      tables: [
        {
          node: "srv1",
          title: "SRV1 syslog",
          columns: ["From", "Message"],
          rows: [
            ["10.1.99.11", "%SYS-5-CONFIG_I: Configured from console by console"],
            ["10.0.0.1", "%SYS-5-CONFIG_I: Configured from console by console"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "10. End to end: ping and a web page", hi: "10. End to end: ping aur web page" },
      text: {
        en: "PC1's final test starts with a ping to SRV1, routed by DSW1 from VLAN 10 to VLAN 99. Then the browser fetches http://198.51.100.10: R1 PAT-translates the TCP request to port 80 and adds a tcp entry (the ICMP entry from step 7 has timed out by now), and the page comes back. Every feature from steps 1-9 was needed for these two results.",
        hi: "PC1 ka aakhri test SRV1 ke ping se shuru hota hai, jise DSW1 VLAN 10 se VLAN 99 mein route karta hai. Phir browser http://198.51.100.10 laata hai: R1 port 80 ki TCP request ko PAT se translate karke table mein tcp entry jodta hai (step 7 wali ICMP entry ab tak time out ho chuki hai), aur page wapas aata hai. In do results ke liye steps 1-9 ka har feature zaroori tha.",
      },
      packets: [
        { path: ["pc1", "asw1", "dsw1", "srv1"], label: "Ping 10.1.99.50", tone: "blue" },
        { path: ["srv1", "dsw1", "asw1", "pc1"], label: "Echo Reply", tone: "green", delay: 3 },
        { path: ["pc1", "asw1", "dsw1", "r1", "isp", "web"], label: "HTTP GET :80", tone: "blue", delay: 1 },
        { path: ["web", "isp", "r1", "dsw1", "asw1", "pc1"], label: "200 OK", tone: "green", delay: 6 },
      ],
      badges: [
        { node: "pc1", text: "ping + web ok", tone: "green" },
        { node: "web", text: "page served", tone: "green" },
      ],
      tables: [
        { node: "srv1", title: "SRV1 syslog", columns: ["From", "Message"], rows: [] },
        {
          node: "r1",
          title: "R1 NAT translations",
          columns: ["Pro", "Inside local", "Inside global", "Outside"],
          rows: [["tcp", "10.1.10.11:49731", "203.0.113.2:49731", "198.51.100.10:80"]],
          hl: [0],
        },
      ],
    },
  ],
};

export default scene;
