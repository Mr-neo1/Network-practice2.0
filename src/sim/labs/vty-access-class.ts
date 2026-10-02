import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "vty-access-class",
  title: { en: "Only the admin subnet may SSH to the router", hi: "Router par SSH sirf admin subnet se" },
  level: "intermediate",
  kind: "build",
  minutes: 25,
  lessons: ["acl-standard", "ssh"],
  scenario: {
    en: "An audit found that anyone on the user LAN could try to log in to HQ-R1. The new rule: the router is managed over SSH only, and only from the admin subnet 192.168.99.0/24. Users on 192.168.10.0/24 must still use HQ-R1 as their gateway as normal; they just can't open a management session.",
    hi: "Audit mein pata chala ki user LAN ka koi bhi HQ-R1 par login try kar sakta tha. Naya rule: router sirf SSH se manage hoga, aur sirf admin subnet 192.168.99.0/24 se. 192.168.10.0/24 ke users HQ-R1 ko gateway ki tarah normal use karte rahenge; bas woh management session nahi khol payenge.",
  },
  height: 300,
  devices: [
    { id: "admin", kind: "pc", hostname: "Admin-PC", x: 120, y: 150, host: { ip: "192.168.99.10", prefix: 24, gateway: "192.168.99.1" }, note: "192.168.99.10" },
    {
      id: "r1", kind: "router", hostname: "HQ-R1", x: 400, y: 150, note: "Gi0/1 .99.1  Gi0/0 .10.1",
      config: [
        "interface g0/1", "ip address 192.168.99.1 255.255.255.0", "no shutdown",
        "interface g0/0", "ip address 192.168.10.1 255.255.255.0", "no shutdown",
      ],
    },
    { id: "user", kind: "pc", hostname: "User-PC", x: 680, y: 150, host: { ip: "192.168.10.20", prefix: 24, gateway: "192.168.10.1" }, note: "192.168.10.20" },
  ],
  links: [
    ["admin", "FastEthernet0", "r1", "GigabitEthernet0/1"],
    ["user", "FastEthernet0", "r1", "GigabitEthernet0/0"],
  ],
  tasks: [
    {
      text: {
        en: "Prepare SSH on HQ-R1: domain name hq.lab, local user netadmin with privilege 15 and a secret, 2048-bit RSA keys, and SSH version 2.",
        hi: "HQ-R1 par SSH taiyaar karo: domain name hq.lab, local user netadmin privilege 15 aur secret ke saath, 2048-bit RSA keys, aur SSH version 2.",
      },
      hint: {
        en: "`ip domain-name hq.lab`, `username netadmin privilege 15 secret <password>`, `crypto key generate rsa modulus 2048`, `ip ssh version 2`.",
        hi: "Global config mein `ip domain-name hq.lab`, `username netadmin privilege 15 secret <password>`, `crypto key generate rsa modulus 2048` aur `ip ssh version 2` chalao.",
      },
      check: [
        { t: "config", dev: "r1", has: "^ip domain-name hq\\.lab$" },
        { t: "config", dev: "r1", has: "^username netadmin privilege 15 secret" },
        { t: "config", dev: "r1", has: "^ip ssh version 2$" },
      ],
    },
    {
      text: {
        en: "On the VTY lines, log in with the local user database and accept SSH only. Admin-PC should now be able to SSH to 192.168.99.1.",
        hi: "VTY lines par local user database se login karwao aur sirf SSH accept karo. Ab Admin-PC 192.168.99.1 par SSH kar paana chahiye.",
      },
      hint: {
        en: "`line vty 0 4`, `login local`, `transport input ssh`. Test from Admin-PC with `ssh -l netadmin 192.168.99.1`, then `exit`.",
        hi: "`line vty 0 4` mein `login local` aur `transport input ssh` do. Admin-PC se `ssh -l netadmin 192.168.99.1` se test karo, phir `exit`.",
      },
      check: [
        { t: "config", dev: "r1", section: "line vty 0 4", has: "^ login local$" },
        { t: "config", dev: "r1", section: "line vty 0 4", has: "^ transport input ssh$" },
        { t: "tcp", from: "admin", to: "192.168.99.1", port: 22 },
      ],
    },
    {
      text: {
        en: "Right now User-PC can open SSH too. Create the standard named ACL VTY-ADMINS that permits only 192.168.99.0/24.",
        hi: "Abhi User-PC bhi SSH khol sakta hai. Standard named ACL VTY-ADMINS banao jo sirf 192.168.99.0/24 ko permit kare.",
      },
      hint: {
        en: "`ip access-list standard VTY-ADMINS`, then `permit 192.168.99.0 0.0.0.255`. The implicit deny at the end blocks everyone else.",
        hi: "`ip access-list standard VTY-ADMINS` mein jao, phir `permit 192.168.99.0 0.0.0.255` do. End wala implicit deny baaki sabko block kar dega.",
      },
      check: { t: "config", dev: "r1", section: "ip access-list standard VTY-ADMINS", has: "^ permit 192\\.168\\.99\\.0 0\\.0\\.0\\.255$" },
    },
    {
      text: {
        en: "Apply VTY-ADMINS to the VTY lines with access-class. Prove it: Admin-PC's SSH works, User-PC's SSH is refused, and User-PC can still ping its gateway 192.168.10.1.",
        hi: "VTY-ADMINS ko access-class se VTY lines par lagao. Prove karo: Admin-PC ka SSH chale, User-PC ka SSH refuse ho, aur User-PC ab bhi apne gateway 192.168.10.1 ko ping kar sake.",
      },
      hint: {
        en: "`line vty 0 4` then `access-class VTY-ADMINS in`. On User-PC: `ssh -l netadmin 192.168.10.1` (refused) and `ping 192.168.10.1` (works). access-class filters only sessions to the router itself, not traffic passing through.",
        hi: "`line vty 0 4` mein `access-class VTY-ADMINS in` do. User-PC par `ssh -l netadmin 192.168.10.1` (refuse hona chahiye) aur `ping 192.168.10.1` (chalna chahiye). access-class sirf router ke apne sessions filter karta hai, router se guzarne wala traffic nahi.",
      },
      check: [
        { t: "config", dev: "r1", section: "line vty 0 4", has: "^ access-class VTY-ADMINS in$" },
        { t: "tcp", from: "admin", to: "192.168.99.1", port: 22 },
        { t: "tcp", from: "user", to: "192.168.10.1", port: 22, ok: false },
        { t: "tcp", from: "user", to: "192.168.99.1", port: 22, ok: false },
        { t: "ping", from: "user", to: "192.168.10.1" },
      ],
    },
  ],
  solution: {
    r1: [
      "ip domain-name hq.lab",
      "username netadmin privilege 15 secret Adm1n!Pass",
      "crypto key generate rsa modulus 2048",
      "ip ssh version 2",
      "line vty 0 4",
      "login local",
      "transport input ssh",
      "exit",
      "ip access-list standard VTY-ADMINS",
      "permit 192.168.99.0 0.0.0.255",
      "exit",
      "line vty 0 4",
      "access-class VTY-ADMINS in",
    ],
    user: ["ping 192.168.10.1"],
  },
  debrief: {
    en: "`access-class` applies an ACL to the VTY lines, so it decides who may open a Telnet or SSH session to the router and nothing else. It works no matter which router interface the session arrives on, which is why it is safer than trying to guard every interface with `ip access-group`.",
    hi: "`access-class` ACL ko VTY lines par lagata hai, isliye woh sirf yeh decide karta hai ki router par Telnet ya SSH session kaun khol sakta hai, aur kuch nahi. Session router ke kisi bhi interface par aaye, yeh kaam karta hai, isliye har interface ko `ip access-group` se guard karne se yeh zyada safe hai.",
  },
};

export default lab;
