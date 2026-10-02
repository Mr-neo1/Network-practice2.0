import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "ssh-hardening",
  title: { en: "Lock down management: SSH only", hi: "Management lock karo: sirf SSH" },
  level: "beginner",
  kind: "build",
  minutes: 20,
  lessons: ["ssh", "device-passwords", "device-management"],
  scenario: {
    en: "A new branch router is on the network with factory defaults. The admin PC must manage it over SSH with a personal login, Telnet must not work, and nobody reading the config should see a password in clear text.",
    hi: "Ek naya branch router factory defaults ke saath network par hai. Admin PC ko ise personal login ke saath SSH se manage karna hai, Telnet kaam nahi karna chahiye, aur config padhne wale ko koi password clear text mein nahi dikhna chahiye.",
  },
  devices: [
    { id: "r1", kind: "router", hostname: "Router", x: 520, y: 140, note: "192.168.1.1", config: ["interface g0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown"] },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 300, y: 140 },
    { id: "pc1", kind: "pc", hostname: "Admin-PC", x: 120, y: 140, host: { ip: "192.168.1.50", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.50" },
  ],
  links: [
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["r1", "GigabitEthernet0/0", "sw1", "GigabitEthernet0/1"],
  ],
  height: 300,
  tasks: [
    {
      text: { en: "Name the router BR1 and set the domain name branch.lab.", hi: "Router ka naam BR1 rakho aur domain name branch.lab set karo." },
      hint: { en: "`hostname BR1` and `ip domain-name branch.lab`. Both are needed before RSA keys can be made.", hi: "`hostname BR1` aur `ip domain-name branch.lab`. RSA keys banane se pehle dono zaroori hain." },
      check: [
        { t: "config", dev: "r1", has: "^hostname BR1$" },
        { t: "config", dev: "r1", has: "^ip domain-name branch\\.lab$" },
      ],
    },
    {
      text: { en: "Protect privileged mode with an enable secret, and encrypt any plain-text passwords in the config.", hi: "Privileged mode ko enable secret se protect karo, aur config ke plain-text passwords encrypt karo." },
      hint: { en: "`enable secret <password>` and `service password-encryption`.", hi: "`enable secret <password>` aur `service password-encryption`." },
      check: [
        { t: "config", dev: "r1", has: "^enable secret 9 " },
        { t: "config", dev: "r1", has: "^service password-encryption$" },
      ],
    },
    {
      text: { en: "Create the local user netadmin with privilege 15, generate 2048-bit RSA keys and use SSH version 2.", hi: "Local user netadmin privilege 15 ke saath banao, 2048-bit RSA keys generate karo aur SSH version 2 use karo." },
      hint: { en: "`username netadmin privilege 15 secret <password>`, `crypto key generate rsa modulus 2048`, `ip ssh version 2`.", hi: "Global config mein `username netadmin privilege 15 secret <password>`, phir `crypto key generate rsa modulus 2048` aur `ip ssh version 2` chalao." },
      check: [
        { t: "config", dev: "r1", has: "^username netadmin privilege 15 secret" },
        { t: "config", dev: "r1", has: "^ip ssh version 2$" },
      ],
    },
    {
      text: { en: "On the VTY lines, use the local user database and allow SSH only.", hi: "VTY lines par local user database use karo aur sirf SSH allow karo." },
      hint: { en: "`line vty 0 4`, `login local`, `transport input ssh`.", hi: "`line vty 0 4` mein jao, phir `login local` aur `transport input ssh` do." },
      check: [
        { t: "config", dev: "r1", section: "line vty 0 4", has: "login local" },
        { t: "config", dev: "r1", section: "line vty 0 4", has: "transport input ssh$" },
      ],
    },
    {
      text: { en: "Prove it: Admin-PC can open SSH to 192.168.1.1, and Telnet is refused.", hi: "Prove karo: Admin-PC 192.168.1.1 par SSH khol sake, aur Telnet refuse ho." },
      hint: { en: "On Admin-PC: `ssh -l netadmin 192.168.1.1`, then `exit`. `telnet 192.168.1.1` should fail.", hi: "Admin-PC par: `ssh -l netadmin 192.168.1.1`, phir `exit`. `telnet 192.168.1.1` fail hona chahiye." },
      check: [
        { t: "tcp", from: "pc1", to: "192.168.1.1", port: 22 },
        { t: "tcp", from: "pc1", to: "192.168.1.1", port: 23, ok: false },
      ],
    },
  ],
  solution: {
    r1: [
      "hostname BR1",
      "ip domain-name branch.lab",
      "enable secret Br4nch!Secret",
      "service password-encryption",
      "username netadmin privilege 15 secret N3tAdmin!",
      "crypto key generate rsa modulus 2048",
      "ip ssh version 2",
      "line vty 0 4",
      "login local",
      "transport input ssh",
    ],
  },
  debrief: {
    en: "SSH needs four things: a hostname that isn't the default, a domain name, RSA keys, and VTY lines that accept SSH with a way to log in. `transport input ssh` is what actually shuts Telnet out.",
    hi: "SSH ke liye chaar cheezein chahiye: default ke alawa hostname, domain name, RSA keys, aur VTY lines jo SSH accept karein aur login ka tarika ho. Telnet ko asal mein `transport input ssh` hi bahar rakhta hai.",
  },
};

export default lab;
