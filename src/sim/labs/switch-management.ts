import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "switch-management",
  title: { en: "Manage a switch remotely: SVI, default gateway and SSH", hi: "Switch ko remotely manage karo: SVI, default gateway aur SSH" },
  level: "beginner",
  kind: "build",
  minutes: 25,
  lessons: ["device-management", "ssh"],
  scenario: {
    en: "The IT team sits in 192.168.1.0/24 and wants to stop walking to the wiring closet. The access switch must get a management address in VLAN 99 (192.168.99.0/24), reach the IT subnet through R1, and accept SSH logins only. R1 is already configured: 192.168.1.1 towards IT and 192.168.99.1 towards the switch.",
    hi: "IT team 192.168.1.0/24 mein baithti hai aur ab wiring closet tak chal kar nahi jaana chahti. Access switch ko VLAN 99 (192.168.99.0/24) mein management address chahiye, R1 ke through IT subnet tak pahunchna chahiye, aur sirf SSH logins accept karne chahiye. R1 pehle se configured hai: IT ki taraf 192.168.1.1 aur switch ki taraf 192.168.99.1.",
  },
  devices: [
    { id: "pc1", kind: "pc", hostname: "Admin-PC", x: 130, y: 140, host: { ip: "192.168.1.50", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.50" },
    { id: "r1", kind: "router", hostname: "R1", x: 400, y: 140, note: ".1.1 | .99.1", config: [
      "interface g0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown",
      "interface g0/1", "ip address 192.168.99.1 255.255.255.0", "no shutdown",
    ] },
    { id: "sw1", kind: "switch", hostname: "Switch", x: 670, y: 140, note: "mgmt 192.168.99.2" },
  ],
  links: [
    ["pc1", "FastEthernet0", "r1", "GigabitEthernet0/0"],
    ["r1", "GigabitEthernet0/1", "sw1", "GigabitEthernet0/1"],
  ],
  height: 280,
  tasks: [
    {
      text: {
        en: "On the switch, create VLAN 99 named MGMT and make Gi0/1 (the port to R1) an access port in VLAN 99.",
        hi: "Switch par VLAN 99 banao jiska naam MGMT ho, aur Gi0/1 (R1 wala port) ko VLAN 99 ka access port banao.",
      },
      hint: {
        en: "`vlan 99`, `name MGMT`, then `interface g0/1`, `switchport mode access`, `switchport access vlan 99`.",
        hi: "Pehle `vlan 99` aur `name MGMT`, phir `interface g0/1` mein `switchport mode access` aur `switchport access vlan 99` do.",
      },
      check: [
        { t: "vlan", dev: "sw1", id: 99, name: "MGMT" },
        { t: "access", dev: "sw1", iface: "GigabitEthernet0/1", vlan: 99 },
      ],
    },
    {
      text: {
        en: "Give the switch the management address 192.168.99.2/24 on its VLAN 99 interface. R1 must be able to ping it.",
        hi: "Switch ke VLAN 99 interface par management address 192.168.99.2/24 do. R1 se yeh ping hona chahiye.",
      },
      hint: {
        en: "`interface vlan 99`, `ip address 192.168.99.2 255.255.255.0`, `no shutdown`. The SVI only comes up if VLAN 99 has an up port.",
        hi: "`interface vlan 99` mein `ip address 192.168.99.2 255.255.255.0` aur `no shutdown` do. SVI tabhi up hota hai jab VLAN 99 mein koi port up ho.",
      },
      check: [
        { t: "up", dev: "sw1", iface: "Vlan99" },
        { t: "ping", from: "r1", to: "192.168.99.2" },
      ],
    },
    {
      text: {
        en: "Let the switch answer devices outside its own subnet: point it at R1. Admin-PC must be able to ping the switch.",
        hi: "Switch ko apne subnet ke bahar wale devices ko jawab dene do: use R1 ki taraf point karo. Admin-PC se switch ping hona chahiye.",
      },
      hint: {
        en: "`ip default-gateway 192.168.99.1` in global config. A Layer 2 switch doesn't route, so this is its only way off the subnet.",
        hi: "Global config mein `ip default-gateway 192.168.99.1` do. Layer 2 switch route nahi karta, isliye subnet se bahar jaane ka yahi ek raasta hai.",
      },
      check: [
        { t: "config", dev: "sw1", has: "^ip default-gateway 192\\.168\\.99\\.1$" },
        { t: "ping", from: "pc1", to: "192.168.99.2" },
      ],
    },
    {
      text: {
        en: "Prepare SSH: hostname ACC-SW1, domain name office.lab, local user netadmin with privilege 15, 2048-bit RSA keys, SSH version 2.",
        hi: "SSH ki taiyaari karo: hostname ACC-SW1, domain name office.lab, privilege 15 wala local user netadmin, 2048-bit RSA keys, aur SSH version 2.",
      },
      hint: {
        en: "`hostname ACC-SW1`, `ip domain-name office.lab`, `username netadmin privilege 15 secret <password>`, `crypto key generate rsa modulus 2048`, `ip ssh version 2`.",
        hi: "`hostname ACC-SW1`, `ip domain-name office.lab`, `username netadmin privilege 15 secret <password>`, phir `crypto key generate rsa modulus 2048` aur `ip ssh version 2`. Keys banane se pehle hostname aur domain zaroori hain.",
      },
      check: [
        { t: "config", dev: "sw1", has: "^hostname ACC-SW1$" },
        { t: "config", dev: "sw1", has: "^ip domain-name office\\.lab$" },
        { t: "config", dev: "sw1", has: "^username netadmin privilege 15 secret" },
        { t: "config", dev: "sw1", has: "^ip ssh version 2$" },
      ],
    },
    {
      text: {
        en: "On the VTY lines, use the local user database and allow SSH only. Prove it: Admin-PC can SSH to 192.168.99.2 and Telnet is refused.",
        hi: "VTY lines par local user database use karo aur sirf SSH allow karo. Prove karo: Admin-PC 192.168.99.2 par SSH kar sake aur Telnet refuse ho.",
      },
      hint: {
        en: "`line vty 0 15`, `login local`, `transport input ssh`. Then on Admin-PC: `ssh -l netadmin 192.168.99.2`.",
        hi: "`line vty 0 15` mein `login local` aur `transport input ssh` do. Phir Admin-PC par `ssh -l netadmin 192.168.99.2` chala kar dekho.",
      },
      check: [
        { t: "tcp", from: "pc1", to: "192.168.99.2", port: 22 },
        { t: "tcp", from: "pc1", to: "192.168.99.2", port: 23, ok: false },
        { t: "config", dev: "sw1", section: "line vty 0 4", has: "login local" },
      ],
    },
  ],
  solution: {
    sw1: [
      "vlan 99", "name MGMT", "exit",
      "interface g0/1", "switchport mode access", "switchport access vlan 99", "exit",
      "interface vlan 99", "ip address 192.168.99.2 255.255.255.0", "no shutdown", "exit",
      "ip default-gateway 192.168.99.1",
      "hostname ACC-SW1",
      "ip domain-name office.lab",
      "username netadmin privilege 15 secret Sw1tch!Admin",
      "crypto key generate rsa modulus 2048",
      "ip ssh version 2",
      "line vty 0 15", "login local", "transport input ssh",
    ],
  },
  debrief: {
    en: "A Layer 2 switch is just a host when it comes to management: it needs an address on an SVI that is up, a default gateway to reach other subnets, and SSH set up like any router. Forget `ip default-gateway` and the switch hears the ping but can't send the reply home.",
    hi: "Management ke maamle mein Layer 2 switch ek host jaisa hi hai: use up SVI par address chahiye, doosre subnets tak pahunchne ke liye default gateway, aur kisi bhi router jaisa SSH setup. `ip default-gateway` bhool gaye toh switch ping sun leta hai lekin reply wapas nahi bhej paata.",
  },
};

export default lab;
