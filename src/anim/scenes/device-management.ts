import type { TopologyScene } from "../types.ts";

// Admin laptop 10.1.1.50, attacker 10.1.1.66 (has ARP-poisoned the admin's cache, so the admin's
// frames for 10.1.1.1 pass through her laptop), R1 Gi0/0 10.1.1.1 / Gi0/1 10.2.2.1,
// TACACS+ server 10.2.2.100. The leaked password is S3cret99.
// Colours: teal = console, orange = clear text, green = encrypted / allowed, purple = TACACS+ query,
// red = attacker attempt or rejection.

const scene: TopologyScene = {
  kind: "topology",
  id: "device-management",
  title: { en: "Console, Telnet, SSH and a TACACS+ login", hi: "Console, Telnet, SSH aur TACACS+ login" },
  height: 420,
  nodes: [
    { id: "admin", kind: "laptop", x: 110, y: 110, label: "Admin", sub: "10.1.1.50" },
    { id: "atk", kind: "attacker", x: 110, y: 320, label: "Attacker", sub: "10.1.1.66" },
    { id: "sw1", kind: "switch", x: 340, y: 215, label: "SW1" },
    { id: "r1", kind: "router", x: 570, y: 110, label: "R1", sub: "Gi0/0 10.1.1.1", sub2: "Gi0/1 10.2.2.1" },
    { id: "tac", kind: "server", x: 720, y: 110, label: "TACACS+", sub: "10.2.2.100" },
  ],
  links: [
    { id: "l-con", a: "admin", b: "r1", style: "serial", label: "console cable" },
    { id: "l-a", a: "admin", b: "sw1", bPort: "Gi0/1" },
    { id: "l-x", a: "atk", b: "sw1", bPort: "Gi0/2" },
    { id: "l-r", a: "r1", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/3" },
    { id: "l-t", a: "r1", b: "tac", aPort: "Gi0/1" },
  ],
  steps: [
    {
      title: { en: "Out-of-band: a console cable", hi: "Out-of-band: console cable" },
      text: {
        en: "R1 is new and has no IP address yet. The admin plugs a console cable into R1's console port and opens a terminal at 9600 baud. This path is out-of-band: it needs no IP, no switch and no working network, only physical access. The admin sets 10.1.1.1 on Gi0/0 and enables the VTY lines for remote logins.",
        hi: "R1 naya hai aur uska abhi koi IP address nahi hai. Admin R1 ke console port mein console cable lagata hai aur 9600 baud par terminal kholta hai. Yeh raasta out-of-band hai: isko na IP chahiye, na switch, na chalta hua network, sirf physical access. Admin Gi0/0 par 10.1.1.1 set karta hai aur remote login ke liye VTY lines enable karta hai.",
      },
      focus: ["admin", "r1"],
      links: [{ id: "l-con", state: "active" }],
      packets: [{ path: ["admin", "r1"], label: "Console 9600", tone: "teal" }],
      badges: [{ node: "r1", text: "IP + VTY set", tone: "teal" }],
    },
    {
      title: { en: "In-band: Telnet to TCP port 23", hi: "In-band: TCP port 23 par Telnet" },
      text: {
        en: "Back at the desk, the admin telnets to 10.1.1.1 across the network, in-band. The attacker has poisoned the admin's ARP cache (lesson 1.2), so 10.1.1.1 now maps to her MAC: the frames reach her laptop first and she forwards them to R1. The session works, so nothing looks wrong.",
        hi: "Desk par wapas aakar admin network ke through, yaani in-band, 10.1.1.1 par Telnet karta hai. Attacker ne admin ka ARP cache poison kar diya hai (lesson 1.2), isliye 10.1.1.1 ab uske MAC se map hai: frames pehle uske laptop par pahunchte hain aur woh unhe aage R1 ko bhej deti hai. Session chal raha hai, isliye kuch galat nahi lagta.",
      },
      links: [{ id: "l-con", state: "dim" }],
      packets: [{ path: ["admin", "sw1", "atk", "sw1", "r1"], label: "Telnet TCP 23", tone: "orange" }],
      badges: [
        { node: "r1", text: "" },
        { node: "atk", text: "in the path", tone: "red" },
      ],
    },
    {
      title: { en: "Telnet shows the password in clear text", hi: "Telnet password saaf text mein dikhata hai" },
      text: {
        en: "Telnet has no encryption. The username and password typed at the login prompt cross the network as plain characters, and the attacker's capture shows admin / S3cret99. She can now log in to R1 herself.",
        hi: "Telnet mein koi encryption nahi hai. Login prompt par type kiya gaya username aur password network par plain characters mein jaata hai, aur attacker ke capture mein admin / S3cret99 saaf dikhta hai. Ab woh khud R1 par login kar sakti hai.",
      },
      focus: ["atk"],
      packets: [
        { path: ["admin", "sw1", "atk", "sw1", "r1"], label: "user: admin", tone: "orange" },
        { path: ["admin", "sw1", "atk", "sw1", "r1"], label: "pass: S3cret99", tone: "orange", delay: 1 },
      ],
      badges: [{ node: "atk", text: "has the password", tone: "red" }],
      tables: [
        {
          node: "atk",
          title: "Attacker's capture",
          columns: ["Port", "What she reads"],
          rows: [
            ["TCP 23", "user: admin"],
            ["TCP 23", "pass: S3cret99"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "SSH: same path, now encrypted", hi: "SSH: wahi raasta, ab encrypted" },
      text: {
        en: "Later the admin hardens R1 with three changes: R1 accepts only SSH, logins are checked by a TACACS+ server, and the admin's password there is new. The admin connects with SSH to TCP port 22. The attacker still gets every frame, but after the key exchange she sees only IP addresses, ports and scrambled bytes.",
        hi: "Baad mein admin R1 ko teen changes se harden karta hai: R1 ab sirf SSH accept karta hai, logins TACACS+ server check karta hai, aur wahan admin ka password naya hai. Admin SSH se TCP port 22 par connect karta hai. Attacker ko ab bhi har frame milta hai, lekin key exchange ke baad use sirf IP addresses, ports aur scrambled bytes dikhte hain.",
      },
      packets: [{ path: ["admin", "sw1", "atk", "sw1", "r1"], label: "SSH TCP 22", tone: "green" }],
      badges: [
        { node: "atk", text: "ciphertext only", tone: "gray" },
        { node: "r1", text: "SSH only", tone: "green" },
      ],
      tables: [
        {
          node: "atk",
          title: "Attacker's capture",
          columns: ["Port", "What she reads"],
          rows: [
            ["TCP 23", "user: admin"],
            ["TCP 23", "pass: S3cret99"],
            ["TCP 22", "4f 9a e1 07 c3 5d ..."],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "R1 asks the TACACS+ server", hi: "R1 TACACS+ server se poochta hai" },
      text: {
        en: "R1 does not decide the login itself. It sends the username and password to the TACACS+ server at 10.2.2.100 over TCP port 49, protected by a shared key. TACACS+ encrypts the whole message body, not only the password.",
        hi: "Login ka faisla R1 khud nahi karta. Woh username aur password TACACS+ server 10.2.2.100 ko TCP port 49 par bhejta hai, shared key se protect karke. TACACS+ poori message body encrypt karta hai, sirf password nahi.",
      },
      focus: ["r1", "tac"],
      packets: [{ path: ["r1", "tac"], label: "TACACS+ TCP 49", tone: "purple" }],
    },
    {
      title: { en: "PASS: the session opens", hi: "PASS: session khul jaata hai" },
      text: {
        en: "The server finds admin in its user database and the password matches, so it answers PASS. R1 opens the SSH session and the admin gets the R1 prompt. The server records who logged in, from which address and when.",
        hi: "Server apne user database mein admin ko dhoondh leta hai aur password match hota hai, isliye woh PASS jawab deta hai. R1 SSH session khol deta hai aur admin ko R1 ka prompt mil jaata hai. Server record kar leta hai ki kaun, kis address se aur kab login hua.",
      },
      packets: [
        { path: ["tac", "r1"], label: "PASS", tone: "green" },
        { path: ["r1", "sw1", "admin"], label: "SSH: R1 prompt", tone: "green", delay: 1 },
      ],
      badges: [{ node: "admin", text: "logged in", tone: "green" }],
      tables: [{ node: "tac", title: "TACACS+ log", columns: ["User", "From", "Result"], rows: [["admin", "10.1.1.50", "PASS"]], hl: [0] }],
    },
    {
      title: { en: "Telnet is now refused", hi: "Telnet ab refuse hota hai" },
      text: {
        en: "The attacker tries the stolen password over Telnet. R1's VTY lines now have `transport input ssh`, so the connection to TCP port 23 is refused before any login prompt appears.",
        hi: "Attacker chura hua password Telnet par try karti hai. R1 ki VTY lines par ab `transport input ssh` hai, isliye TCP port 23 ka connection login prompt aane se pehle hi refuse ho jaata hai.",
      },
      focus: ["atk", "r1"],
      packets: [{ path: ["atk", "sw1", "r1"], label: "Telnet TCP 23", tone: "red", drop: true }],
      badges: [
        { node: "admin", text: "" },
        { node: "atk", text: "refused", tone: "red" },
      ],
    },
    {
      title: { en: "The old password fails, and it is logged", hi: "Purana password fail, aur log bhi hua" },
      text: {
        en: "Next the attacker tries SSH with admin / S3cret99. R1 passes the attempt to the TACACS+ server, which answers FAIL because that password was changed. The failed login from 10.1.1.66 is now in the central log, where the security team can see it.",
        hi: "Ab attacker SSH par admin / S3cret99 try karti hai. R1 yeh attempt TACACS+ server ko bhejta hai, jo FAIL jawab deta hai kyunki woh password badal chuka hai. 10.1.1.66 se hua failed login ab central log mein hai, jahan security team use dekh sakti hai.",
      },
      packets: [
        { path: ["atk", "sw1", "r1"], label: "SSH login", tone: "red" },
        { path: ["r1", "tac"], label: "TACACS+ TCP 49", tone: "purple", delay: 2 },
        { path: ["tac", "r1"], label: "FAIL", tone: "red", delay: 3 },
      ],
      badges: [{ node: "atk", text: "login failed", tone: "red" }],
      tables: [
        {
          node: "tac",
          title: "TACACS+ log",
          columns: ["User", "From", "Result"],
          rows: [
            ["admin", "10.1.1.50", "PASS"],
            ["admin", "10.1.1.66", "FAIL"],
          ],
          hl: [1],
        },
      ],
    },
  ],
};

export default scene;
