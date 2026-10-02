import type { TopologyScene } from "../types.ts";

// Matches the vpn lesson: Branch 10.1.1.0/24 behind R1 (public 203.0.113.10),
// HQ 10.2.2.0/24 behind R2 (public 198.51.100.1), file server 10.2.2.20,
// remote user at home 192.0.2.77, VPN pool address 10.2.200.15.
// Colours: gray = plain packet that cannot be routed, purple = IKE, blue = original
// cleartext packet inside a site, green = encrypted (ESP or TLS), red = attacker,
// orange = remote-access tunnel setup.

const scene: TopologyScene = {
  kind: "topology",
  id: "vpn",
  title: { en: "Site-to-site IPsec, then a remote-access VPN", hi: "Site-to-site IPsec, phir remote-access VPN" },
  height: 470,
  nodes: [
    { id: "pcb", kind: "pc", x: 80, y: 120, label: "PC-B", sub: "10.1.1.10" },
    { id: "r1", kind: "router", x: 240, y: 120, label: "R1 (Branch)", sub: "203.0.113.10", sub2: "inside 10.1.1.1" },
    { id: "inet", kind: "internet", x: 400, y: 250, label: "Internet" },
    { id: "r2", kind: "router", x: 560, y: 120, label: "R2 (HQ)", sub: "198.51.100.1", sub2: "inside 10.2.2.1" },
    { id: "srv", kind: "server", x: 720, y: 120, label: "File server", sub: "10.2.2.20" },
    { id: "atk", kind: "attacker", x: 240, y: 370, label: "Attacker", sub: "on the path" },
    { id: "home", kind: "laptop", x: 560, y: 370, label: "Remote user", sub: "192.0.2.77" },
  ],
  links: [
    { id: "l-b", a: "pcb", b: "r1", bPort: "Gi0/0" },
    { id: "l-r1", a: "r1", b: "inet", aPort: "Gi0/1" },
    { id: "l-r2", a: "r2", b: "inet", aPort: "Gi0/1" },
    { id: "l-s", a: "r2", b: "srv", aPort: "Gi0/0" },
    { id: "l-tun", a: "r1", b: "r2", style: "tunnel", label: "IPsec tunnel (logical)" },
    { id: "l-atk", a: "atk", b: "inet", label: "capturing" },
    { id: "l-home", a: "home", b: "inet", label: "home ISP" },
  ],
  steps: [
    {
      title: { en: "Without a VPN, the packet dies at the ISP", hi: "VPN ke bina packet ISP par drop ho jaata hai" },
      text: {
        en: "PC-B (10.1.1.10) needs the HQ file server at 10.2.2.20. Without a VPN, R1 would send it to the internet as is, and the ISP drops it: private 10.x addresses are not routed on the internet. Even if it were delivered, every network on the path could read it.",
        hi: "PC-B (10.1.1.10) ko HQ ka file server 10.2.2.20 chahiye. VPN ke bina R1 ise waise hi internet par bhej deta, aur ISP ise drop kar deta: private 10.x addresses internet par route nahi hote. Deliver ho bhi jaata, toh raaste ka har network ise padh sakta tha.",
      },
      focus: ["pcb", "srv"],
      links: [{ id: "l-tun", state: "dim", note: "no tunnel yet" }],
      packets: [{ path: ["pcb", "r1", "inet"], label: "to 10.2.2.20", tone: "gray", drop: true }],
    },
    {
      title: { en: "IKE: the routers agree on keys", hi: "IKE: routers keys par agree karte hain" },
      text: {
        en: "The first branch packet for HQ finds no SA at R1, so R1 starts IKE with R2 on UDP 500 (that first packet is usually lost, which is why the first ping often fails). The routers prove who they are with a pre-shared key, agree on AES-256 and SHA-256, and use Diffie-Hellman to create keys without ever sending them. Then they build IPsec SAs for 10.1.1.0/24 to 10.2.2.0/24.",
        hi: "HQ ke liye pehla branch packet aata hai toh R1 par koi SA nahi hota, isliye R1 UDP 500 par R2 ke saath IKE shuru karta hai (woh pehla packet aksar drop ho jaata hai, isiliye pehla ping fail hota hai). Routers pre-shared key se prove karte hain ki woh kaun hain, AES-256 aur SHA-256 par agree karte hain, aur Diffie-Hellman se keys bana lete hain bina unhe kabhi bheje. Phir 10.1.1.0/24 se 10.2.2.0/24 ke liye IPsec SAs banate hain.",
      },
      packets: [
        { path: ["r1", "inet", "r2"], label: "IKE · UDP 500", tone: "purple" },
        { path: ["r2", "inet", "r1"], label: "IKE · UDP 500", tone: "purple", delay: 2 },
      ],
      badges: [
        { node: "r1", text: "SA up", tone: "purple" },
        { node: "r2", text: "SA up", tone: "purple" },
      ],
      tables: [
        { node: "r1", title: "R1 IPsec SA", columns: ["Peer", "Protects", "Cipher / hash"], rows: [["198.51.100.1", "10.1.1.0/24 ↔ 10.2.2.0/24", "AES-256 / SHA-256"]], hl: [0] },
      ],
    },
    {
      title: { en: "PC-B sends an ordinary packet", hi: "PC-B ek normal packet bhejta hai" },
      text: {
        en: "PC-B runs no VPN software. It sends a normal packet, 10.1.1.10 to 10.2.2.20 on TCP 445, to its gateway R1. Source and destination match the protected traffic (ACL 110: 10.1.1.0/24 to 10.2.2.0/24), and the SA is now up, so this packet goes through the tunnel.",
        hi: "PC-B par koi VPN software nahi hai. Woh normal packet bhejta hai, 10.1.1.10 se 10.2.2.20, TCP 445 par, apne gateway R1 ko. Source aur destination protected traffic (ACL 110: 10.1.1.0/24 se 10.2.2.0/24) se match karte hain, aur SA ab up hai, isliye yeh packet tunnel se jaata hai.",
      },
      focus: ["pcb", "r1"],
      links: [{ id: "l-tun", state: "active", note: "IPsec SA up" }],
      packets: [{ path: ["pcb", "r1"], label: "to 10.2.2.20", tone: "blue" }],
    },
    {
      title: { en: "R1 encrypts and adds a new IP header", hi: "R1 encrypt karke naya IP header lagata hai" },
      text: {
        en: "In tunnel mode R1 encrypts the whole original packet with AES, adds an ESP header (SPI and sequence number) in front and an integrity check value (ICV) at the end, and puts a new IP header in front of it all: 203.0.113.10 to 198.51.100.1. The internet can route that, and the private addresses are now hidden inside.",
        hi: "Tunnel mode mein R1 poore original packet ko AES se encrypt karta hai, aage ESP header (SPI aur sequence number) aur end mein integrity check value (ICV) lagata hai, aur sabse aage naya IP header lagata hai: 203.0.113.10 se 198.51.100.1. Internet ise route kar sakta hai, aur private addresses ab andar chhup gaye hain.",
      },
      focus: ["r1"],
      badges: [{ node: "r1", text: "encrypt", tone: "green" }],
      packets: [{ path: ["r1", "inet"], label: "ESP · encrypted", tone: "green" }],
      tables: [
        {
          node: "r1",
          title: "Packet leaving R1",
          columns: ["Part", "Value", "Readable?"],
          rows: [
            ["New IP header", "203.0.113.10 → 198.51.100.1", "yes"],
            ["ESP header", "SPI · seq 1", "yes"],
            ["Original IP header", "10.1.1.10 → 10.2.2.20", "no (AES)"],
            ["TCP 445 + data", "file contents", "no (AES)"],
            ["ESP ICV", "SHA-256 HMAC", "yes (a hash)"],
          ],
          hl: [0, 1, 4],
        },
      ],
    },
    {
      title: { en: "Across the internet: only ciphertext", hi: "Internet ke paar: sirf ciphertext" },
      text: {
        en: "The ESP packet crosses the internet to R2. An attacker capturing on the path gets a copy, but sees only the outer header: two public router addresses and protocol 50 (ESP). The inner addresses, the port and the file contents are random-looking bytes without the key.",
        hi: "ESP packet internet paar karke R2 tak jaata hai. Raaste mein capture kar raha attacker ek copy le leta hai, lekin use sirf outer header dikhta hai: do public router addresses aur protocol 50 (ESP). Andar ke addresses, port aur file contents key ke bina random bytes jaise dikhte hain.",
      },
      badges: [
        { node: "r1", text: "" },
        { node: "atk", text: "can't read", tone: "red" },
      ],
      packets: [
        { path: ["inet", "r2"], label: "ESP · encrypted", tone: "green" },
        { path: ["inet", "atk"], label: "captured copy", tone: "red" },
      ],
      tables: [
        { node: "r1", title: "Packet leaving R1", columns: ["Part", "Value", "Readable?"], rows: [] },
        {
          node: "atk",
          title: "What the attacker sees",
          columns: ["Field", "Value"],
          rows: [
            ["Source IP", "203.0.113.10"],
            ["Destination IP", "198.51.100.1"],
            ["Protocol", "50 (ESP)"],
            ["Payload", "ciphertext"],
          ],
          hl: [3],
        },
      ],
    },
    {
      title: { en: "R2 verifies, decrypts and forwards", hi: "R2 verify, decrypt aur forward karta hai" },
      text: {
        en: "R2 first recalculates the SHA-256 check: it matches, so not one bit was changed. Sequence number 1 is new, so it is not a replay. R2 decrypts with AES, removes the outer header and ESP, and routes the original packet, 10.1.1.10 to 10.2.2.20, to the file server. The server's reply makes the same trip in reverse.",
        hi: "R2 pehle SHA-256 check dobara calculate karta hai: match hota hai, yaani ek bhi bit nahi badla. Sequence number 1 naya hai, toh yeh replay nahi hai. R2 AES se decrypt karta hai, outer header aur ESP hata deta hai, aur original packet, 10.1.1.10 se 10.2.2.20, file server ko route kar deta hai. Server ka reply ulti direction mein yahi safar karta hai.",
      },
      focus: ["r2", "srv"],
      badges: [{ node: "r2", text: "decrypt", tone: "green" }],
      packets: [{ path: ["r2", "srv"], label: "to 10.2.2.20", tone: "blue" }],
      tables: [
        {
          node: "r2",
          title: "R2 checks on arrival",
          columns: ["Check", "Result"],
          rows: [
            ["Integrity (SHA-256)", "matches: not modified"],
            ["Anti-replay seq 1", "new: accept"],
            ["Decrypt (AES-256)", "10.1.1.10 → 10.2.2.20"],
          ],
          hl: [0, 1, 2],
        },
      ],
    },
    {
      title: { en: "A replayed packet is dropped", hi: "Replay kiya gaya packet drop hota hai" },
      text: {
        en: "The attacker cannot read the packet, so he sends his captured copy to R2 again, hoping R2 will act on it twice. R2 has already accepted sequence number 1, so the copy is dropped. Had he changed even one bit, the integrity check would have failed and R2 would drop it for that reason.",
        hi: "Attacker packet padh nahi sakta, toh woh apni captured copy R2 ko dobara bhejta hai, is umeed mein ki R2 use do baar process karega. R2 sequence number 1 pehle hi accept kar chuka hai, isliye copy drop ho jaati hai. Agar woh ek bhi bit badalta, toh integrity check fail hota aur R2 use us wajah se drop kar deta.",
      },
      focus: ["atk", "r2"],
      badges: [
        { node: "atk", text: "" },
        { node: "r2", text: "replay dropped", tone: "red" },
      ],
      packets: [{ path: ["atk", "inet", "r2"], label: "replayed ESP", tone: "red", drop: true }],
      tables: [
        { node: "atk", title: "What the attacker sees", columns: ["Field", "Value"], rows: [] },
        {
          node: "r2",
          title: "R2 checks on arrival",
          columns: ["Check", "Result"],
          rows: [
            ["Integrity (SHA-256)", "matches: not modified"],
            ["Anti-replay seq 1", "new: accept"],
            ["Decrypt (AES-256)", "10.1.1.10 → 10.2.2.20"],
            ["Seq 1 again", "already seen: drop"],
          ],
          hl: [3],
        },
      ],
    },
    {
      title: { en: "Remote access: one laptop builds a tunnel", hi: "Remote access: ek laptop tunnel banata hai" },
      text: {
        en: "A remote user at home (192.0.2.77) starts Cisco Secure Client. It opens a TLS tunnel to R2's public address on TCP 443. R2 checks the user's login, usually against ISE over RADIUS (lesson 5.3), then gives the laptop an inside address from its VPN pool: 10.2.200.15.",
        hi: "Ghar par baitha remote user (192.0.2.77) Cisco Secure Client start karta hai. Yeh R2 ke public address par TCP 443 par TLS tunnel kholta hai. R2 user ka login check karta hai, aam taur par RADIUS se ISE ke through (lesson 5.3), phir laptop ko apne VPN pool se ek inside address deta hai: 10.2.200.15.",
      },
      reset: true,
      focus: ["home", "r2"],
      links: [
        { id: "l-tun", state: "active", note: "IPsec SA up" },
        { id: "l-home", state: "active", note: "TLS tunnel" },
      ],
      packets: [
        { path: ["home", "inet", "r2"], label: "TLS · TCP 443", tone: "orange" },
        { path: ["r2", "inet", "home"], label: "login OK + IP", tone: "orange", delay: 2 },
      ],
      badges: [{ node: "home", text: "VPN 10.2.200.15", tone: "teal" }],
      tables: [
        {
          node: "home",
          title: "Secure Client session",
          columns: ["Item", "Value"],
          rows: [
            ["Tunnel", "TLS to 198.51.100.1:443"],
            ["Login checked by", "ISE (RADIUS)"],
            ["VPN address", "10.2.200.15"],
          ],
          hl: [0, 1, 2],
        },
      ],
    },
    {
      title: { en: "The laptop reaches HQ as an inside host", hi: "Laptop HQ tak inside host ki tarah pahunchta hai" },
      text: {
        en: "The laptop wraps a packet from 10.2.200.15 to 10.2.2.20 inside the encrypted TLS tunnel. R2 decrypts it and routes the inner packet to the file server, which sees an inside address. Site-to-site protected a whole branch with no software on PCs; remote access protects one device and needs a client on it.",
        hi: "Laptop 10.2.200.15 se 10.2.2.20 wale packet ko encrypted TLS tunnel ke andar wrap karta hai. R2 ise decrypt karke andar wala packet file server ko route karta hai, aur server ko ek inside address dikhta hai. Site-to-site ne PCs par bina software ke poori branch protect ki; remote access ek device protect karta hai aur us par client chahiye.",
      },
      packets: [
        { path: ["home", "inet", "r2"], label: "TLS · encrypted", tone: "green" },
        { path: ["r2", "srv"], label: "from 10.2.200.15", tone: "blue", delay: 2 },
      ],
    },
  ],
};

export default scene;
