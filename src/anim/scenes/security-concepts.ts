import type { TopologyScene } from "../types.ts";

// One small company, four attacks, each followed by its mitigation.
// Colours: blue = legitimate traffic, red = attack traffic, gray = SYN-ACKs
// sent to spoofed sources that never answer. Addresses match the lesson text.

const scene: TopologyScene = {
  kind: "topology",
  id: "security-concepts",
  title: { en: "Four attacks on one small company, and what stops each", hi: "Ek chhoti company par chaar attacks, aur har ek ko kya rokta hai" },
  height: 510,
  nodes: [
    { id: "bots", kind: "attacker", x: 100, y: 80, label: "Attackers", sub: "bots worldwide" },
    { id: "dns", kind: "server", x: 100, y: 300, label: "Open DNS", sub: "198.51.100.53" },
    { id: "inet", kind: "internet", x: 270, y: 190, label: "Internet" },
    { id: "fw1", kind: "firewall", x: 450, y: 190, label: "FW1", sub: "gw 10.10.10.1", sub2: "0011.2233.0001" },
    { id: "web", kind: "server", x: 650, y: 80, label: "Web portal", sub: "203.0.113.10" },
    { id: "sw1", kind: "switch", x: 600, y: 320, label: "SW1" },
    { id: "pc1", kind: "pc", x: 450, y: 420, label: "PC1", sub: "10.10.10.21", sub2: "0050.56aa.0021" },
    { id: "rogue", kind: "attacker", x: 740, y: 420, label: "Rogue PC", sub: "10.10.10.66", sub2: "0050.56bb.0066" },
  ],
  links: [
    { id: "l-bots", a: "bots", b: "inet" },
    { id: "l-dns", a: "dns", b: "inet" },
    { id: "l-out", a: "inet", b: "fw1", bPort: "outside" },
    { id: "l-dmz", a: "fw1", b: "web", aPort: "dmz" },
    { id: "l-in", a: "fw1", b: "sw1", bPort: "Gi0/1", label: "inside" },
    { id: "l-pc1", a: "pc1", b: "sw1", bPort: "Gi0/2" },
    { id: "l-rogue", a: "rogue", b: "sw1", bPort: "Gi0/3" },
  ],
  steps: [
    {
      title: { en: "What this network must protect", hi: "Is network ko kya protect karna hai" },
      text: {
        en: "PC1 browses out through FW1, and customers reach the web portal at 203.0.113.10. The portal must stay reachable (availability), PC1's logins must stay private (confidentiality) and nothing may be altered on the way (integrity).",
        hi: "PC1 FW1 se hokar bahar browse karta hai, aur customers 203.0.113.10 wale web portal tak aate hain. Portal reachable rehna chahiye (availability), PC1 ke logins private rehne chahiye (confidentiality) aur raaste mein kuch badalna nahi chahiye (integrity).",
      },
      packets: [
        { path: ["pc1", "sw1", "fw1", "inet"], label: "HTTPS out", tone: "blue" },
        { path: ["inet", "fw1", "web"], label: "Customer HTTPS", tone: "blue", delay: 1 },
      ],
    },
    {
      title: { en: "DDoS: a TCP SYN flood from a botnet", hi: "DDoS: botnet se TCP SYN flood" },
      text: {
        en: "Thousands of bots send SYNs to port 443 with random spoofed source IPs. For each one the portal sends a SYN-ACK to an address that never asked, and holds a half-open entry waiting for an ACK that never comes. The table fills, and real customers are refused.",
        hi: "Hazaaron bots port 443 par random spoofed source IPs ke saath SYNs bhejte hain. Har ek ke liye portal aise address par SYN-ACK bhejta hai jisne kuch maanga hi nahi, aur ek half-open entry rakhta hai us ACK ke liye jo kabhi nahi aayega. Table bhar jaati hai, aur asli customers refuse ho jaate hain.",
      },
      focus: ["bots", "web"],
      packets: [
        { path: ["bots", "inet", "fw1", "web"], label: "SYN", tone: "red" },
        { path: ["bots", "inet", "fw1", "web"], label: "SYN", tone: "red", delay: 1 },
        { path: ["bots", "inet", "fw1", "web"], label: "SYN", tone: "red", delay: 2 },
        { path: ["web", "fw1", "inet"], label: "SYN-ACK", tone: "gray", delay: 3 },
      ],
      badges: [{ node: "web", text: "backlog full", tone: "red" }],
      tables: [
        {
          node: "web",
          title: "Portal half-open connections",
          columns: ["Source (spoofed)", "State"],
          rows: [
            ["192.0.2.17:40112", "SYN-RECEIVED"],
            ["198.51.100.201:5133", "SYN-RECEIVED"],
            ["192.0.2.240:61007", "SYN-RECEIVED"],
            ["(thousands more)", "SYN-RECEIVED"],
          ],
          hl: [0, 1, 2, 3],
        },
      ],
    },
    {
      title: { en: "Mitigation: FW1 limits half-open connections", hi: "Mitigation: FW1 half-open connections limit karta hai" },
      text: {
        en: "FW1 now intercepts SYNs for the portal: it sends the SYN-ACK itself, caps the number of half-open connections, and passes on only clients that complete the handshake. Spoofed sources never send the final ACK, so their SYNs never reach the portal and customers get through again. A flood big enough to fill the internet link itself must be filtered upstream by the ISP.",
        hi: "Ab FW1 portal ke liye aane wale SYNs ko beech mein hi pakad leta hai: SYN-ACK khud bhejta hai, half-open connections ki limit lagata hai, aur sirf unhi clients ko aage bhejta hai jo handshake poora karein. Spoofed sources final ACK kabhi nahi bhejte, isliye unke SYNs portal tak pahunchte hi nahi aur customers phir se pahunch jaate hain. Itna bada flood jo internet link hi bhar de, use ISP ko upstream filter karna padta hai.",
      },
      packets: [
        { path: ["bots", "inet", "fw1"], label: "SYN", tone: "red", drop: true },
        { path: ["bots", "inet", "fw1"], label: "SYN", tone: "red", delay: 1, drop: true },
        { path: ["fw1", "inet"], label: "SYN-ACK (FW1)", tone: "gray", delay: 2 },
        { path: ["inet", "fw1", "web"], label: "Customer HTTPS", tone: "blue", delay: 2 },
      ],
      badges: [
        { node: "fw1", text: "SYN limit", tone: "green" },
        { node: "web", text: "" },
      ],
      tables: [{ node: "web", title: "Portal half-open connections", columns: ["Source (spoofed)", "State"], rows: [] }],
    },
    {
      title: { en: "Spoofing: a fake inside source address", hi: "Spoofing: fake inside source address" },
      text: {
        en: "An attacker sends a packet with source 10.10.10.21, hoping FW1 treats it as PC1. A packet arriving on the outside interface can never genuinely carry an inside address, so an inbound ACL on outside drops every private source address.",
        hi: "Attacker source 10.10.10.21 wala packet bhejta hai, is umeed mein ki FW1 use PC1 samjhe. Outside interface par aane wale packet mein asli inside address kabhi nahi ho sakta, isliye outside par laga inbound ACL har private source address ko drop kar deta hai.",
      },
      reset: true,
      focus: ["fw1"],
      packets: [{ path: ["bots", "inet", "fw1"], label: "src 10.10.10.21", tone: "red", drop: true }],
      badges: [{ node: "fw1", text: "ACL drop", tone: "green" }],
    },
    {
      title: { en: "Reflection and amplification", hi: "Reflection aur amplification" },
      text: {
        en: "The bots send DNS queries of about 60 bytes to the open resolver with source 203.0.113.10. The resolver answers the source, so its replies of about 3,000 bytes land on the portal: reflected, and amplified about fifty times. A flood like this must be filtered upstream, and nobody should run a resolver that answers anyone on the internet.",
        hi: "Bots open resolver ko lagbhag 60 bytes ki DNS queries bhejte hain, source 203.0.113.10 ke saath. Resolver source ko jawab deta hai, isliye uske lagbhag 3,000 bytes ke replies portal par girte hain: reflected, aur lagbhag pachaas guna amplified. Aisa flood upstream hi filter karna padta hai, aur kisi ko aisa resolver nahi chalana chahiye jo internet par kisi ko bhi jawab de.",
      },
      reset: true,
      focus: ["dns", "web"],
      packets: [
        { path: ["bots", "inet", "dns"], label: "60 B, src .10", tone: "red" },
        { path: ["dns", "inet", "fw1", "web"], label: "3000 B reply", tone: "red", delay: 2 },
        { path: ["dns", "inet", "fw1", "web"], label: "3000 B reply", tone: "red", delay: 3 },
      ],
      badges: [
        { node: "dns", text: "reflector", tone: "orange" },
        { node: "web", text: "flooded", tone: "red" },
      ],
    },
    {
      title: { en: "ARP spoofing poisons both caches", hi: "ARP spoofing dono caches ko poison karta hai" },
      text: {
        en: "Inside the LAN, the rogue PC sends unrequested ARP replies: to PC1, \"10.10.10.1 is at 0050.56bb.0066\", and to FW1, \"10.10.10.21 is at 0050.56bb.0066\". ARP has no authentication, so both overwrite their entries with the attacker's MAC.",
        hi: "LAN ke andar rogue PC bina maange ARP replies bhejta hai: PC1 ko \"10.10.10.1 is at 0050.56bb.0066\", aur FW1 ko \"10.10.10.21 is at 0050.56bb.0066\". ARP mein authentication nahi hai, isliye dono apni entries attacker ke MAC se overwrite kar dete hain.",
      },
      reset: true,
      focus: ["rogue"],
      packets: [
        { path: ["rogue", "sw1", "pc1"], label: "ARP: I am .1", tone: "red" },
        { path: ["rogue", "sw1", "fw1"], label: "ARP: I am .21", tone: "red", delay: 1 },
      ],
      tables: [
        { node: "pc1", title: "PC1 ARP cache", columns: ["IP address", "MAC address"], rows: [["10.10.10.1", "0050.56bb.0066"]], hl: [0] },
        { node: "fw1", title: "FW1 ARP cache", columns: ["IP address", "MAC address"], rows: [["10.10.10.21", "0050.56bb.0066"]], hl: [0] },
      ],
    },
    {
      title: { en: "The man in the middle reads everything", hi: "Man in the middle sab kuch padhta hai" },
      text: {
        en: "PC1 opens a Telnet session to FW1 at 10.10.10.1 to manage it. Its poisoned cache addresses the frame to 0050.56bb.0066, so SW1 sends it out Gi0/3. Telnet is clear text: the rogue PC reads the admin password, could change the data, then forwards the frame to FW1's real MAC. Nothing looks broken, yet confidentiality and integrity are both lost.",
        hi: "PC1 FW1 ko manage karne ke liye 10.10.10.1 par Telnet session kholta hai. Poisoned cache ki wajah se frame 0050.56bb.0066 par addressed hai, isliye SW1 use Gi0/3 se bahar bhejta hai. Telnet clear text hai: rogue PC admin password padh leta hai, data badal bhi sakta hai, phir frame ko FW1 ke asli MAC par forward kar deta hai. Kuch toota hua nahi lagta, lekin confidentiality aur integrity dono chali gayi.",
      },
      packets: [{ path: ["pc1", "sw1", "rogue", "sw1", "fw1"], label: "Telnet: admin pw", tone: "blue" }],
      badges: [{ node: "rogue", text: "reads + edits", tone: "red" }],
    },
    {
      title: { en: "Mitigation: Dynamic ARP Inspection on SW1", hi: "Mitigation: SW1 par Dynamic ARP Inspection" },
      text: {
        en: "With DAI, SW1 checks every ARP message on untrusted ports against what DHCP gave out. Gi0/3 was leased 10.10.10.66, not 10.10.10.1, so the forged reply is dropped. PC1 keeps the real gateway MAC and its traffic goes straight to FW1. Using SSH instead of Telnet (lesson 4.7) would also have kept the password unreadable.",
        hi: "DAI ke saath SW1 untrusted ports par har ARP message ko DHCP ke diye records se check karta hai. Gi0/3 ko 10.10.10.66 mila tha, 10.10.10.1 nahi, isliye forged reply drop ho jaata hai. PC1 ke paas asli gateway MAC rehta hai aur uska traffic seedha FW1 jaata hai. Telnet ki jagah SSH (lesson 4.7) use karte toh password waise bhi padha nahi ja sakta tha.",
      },
      reset: true,
      focus: ["sw1"],
      packets: [
        { path: ["rogue", "sw1"], label: "ARP: I am .1", tone: "red", drop: true },
        { path: ["pc1", "sw1", "fw1"], label: "Telnet: admin pw", tone: "blue", delay: 1 },
      ],
      badges: [{ node: "sw1", text: "DAI", tone: "green" }],
      tables: [{ node: "pc1", title: "PC1 ARP cache", columns: ["IP address", "MAC address"], rows: [["10.10.10.1", "0011.2233.0001"]], hl: [0] }],
    },
    {
      title: { en: "Phishing goes through the person", hi: "Phishing insaan ke through jaata hai" },
      text: {
        en: "An email that looks like it is from IT says \"Your mailbox is full, sign in here\". FW1 lets it in, because it is ordinary mail. The user clicks, types a username and password into the attacker's fake page, and the credentials leave as normal HTTPS.",
        hi: "IT ki taraf se aaya lagne wala email kehta hai \"Your mailbox is full, sign in here\". FW1 use andar aane deta hai, kyunki yeh normal mail hai. User click karta hai, attacker ke fake page par username aur password type karta hai, aur credentials normal HTTPS bankar bahar chale jaate hain.",
      },
      reset: true,
      focus: ["pc1"],
      packets: [
        { path: ["bots", "inet", "fw1", "sw1", "pc1"], label: "Phish email", tone: "red" },
        { path: ["pc1", "sw1", "fw1", "inet", "bots"], label: "user + password", tone: "red", delay: 4 },
      ],
      badges: [{ node: "pc1", text: "clicked", tone: "red" }],
    },
    {
      title: { en: "Mitigation: awareness, training and MFA", hi: "Mitigation: awareness, training aur MFA" },
      text: {
        en: "The attacker tries the stolen password on the portal, but the portal also asks for a code from the user's phone app, so the login fails. A user who has been through awareness tests and training reports the next phish instead of clicking it.",
        hi: "Attacker chori ka password portal par try karta hai, lekin portal user ke phone app ka code bhi maangta hai, isliye login fail ho jaata hai. Jo user awareness tests aur training se guzar chuka hai, woh agla phish click karne ki jagah report kar deta hai.",
      },
      focus: ["web", "pc1"],
      packets: [{ path: ["bots", "inet", "fw1", "web"], label: "stolen pw login", tone: "red", drop: true }],
      badges: [
        { node: "web", text: "MFA: no code", tone: "green" },
        { node: "pc1", text: "reports phish", tone: "green" },
      ],
    },
  ],
};

export default scene;
