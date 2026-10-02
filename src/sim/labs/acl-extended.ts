import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "acl-extended",
  title: { en: "Extended ACL: web yes, ping no", hi: "Extended ACL: web haan, ping nahi" },
  level: "advanced",
  kind: "build",
  minutes: 30,
  lessons: ["acl-extended"],
  scenario: {
    en: "Security has sent a change request: \"Users on 192.168.10.0/24 may browse the web server 192.168.20.10 (HTTP, TCP 80) but must not ping it. Everything else, including the file server 192.168.20.20, stays open.\" Write a named extended ACL and stop the unwanted traffic as close to the users as possible, so it never crosses the WAN link.",
    hi: "Security ne change request bheji hai: \"192.168.10.0/24 ke users web server 192.168.20.10 ko browse kar sakte hain (HTTP, TCP 80), lekin use ping nahi kar sakte. Baaki sab, file server 192.168.20.20 bhi, khula rehna chahiye.\" Ek named extended ACL likho aur unwanted traffic ko users ke jitna paas ho sake utna paas roko, taaki woh WAN link cross hi na kare.",
  },
  devices: [
    { id: "pc1", kind: "pc", hostname: "User-1", x: 80, y: 100, host: { ip: "192.168.10.10", prefix: 24, gateway: "192.168.10.1" }, note: "192.168.10.10" },
    { id: "pc2", kind: "pc", hostname: "User-2", x: 80, y: 270, host: { ip: "192.168.10.11", prefix: 24, gateway: "192.168.10.1" }, note: "192.168.10.11" },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 210, y: 185 },
    {
      id: "r1", kind: "router", hostname: "R1", x: 345, y: 185, note: "Users",
      config: [
        "interface g0/1", "ip address 192.168.10.1 255.255.255.0", "no shutdown",
        "interface g0/0", "ip address 10.0.12.1 255.255.255.252", "no shutdown",
        "ip route 0.0.0.0 0.0.0.0 10.0.12.2",
      ],
    },
    {
      id: "r2", kind: "router", hostname: "R2", x: 475, y: 185, note: "Data centre",
      config: [
        "interface g0/0", "ip address 10.0.12.2 255.255.255.252", "no shutdown",
        "interface g0/1", "ip address 192.168.20.1 255.255.255.0", "no shutdown",
        "ip route 192.168.10.0 255.255.255.0 10.0.12.1",
      ],
    },
    { id: "sw2", kind: "switch", hostname: "SW2", x: 600, y: 185 },
    { id: "web", kind: "server", hostname: "Web-Server", x: 720, y: 100, host: { ip: "192.168.20.10", prefix: 24, gateway: "192.168.20.1", services: ["http"] }, note: "192.168.20.10" },
    { id: "files", kind: "server", hostname: "File-Server", x: 720, y: 270, host: { ip: "192.168.20.20", prefix: 24, gateway: "192.168.20.1", services: ["ftp"] }, note: "192.168.20.20" },
  ],
  links: [
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/2"],
    ["sw1", "GigabitEthernet0/1", "r1", "GigabitEthernet0/1"],
    ["r1", "GigabitEthernet0/0", "r2", "GigabitEthernet0/0"],
    ["r2", "GigabitEthernet0/1", "sw2", "GigabitEthernet0/1"],
    ["web", "FastEthernet0", "sw2", "FastEthernet0/1"],
    ["files", "FastEthernet0", "sw2", "FastEthernet0/2"],
  ],
  tasks: [
    {
      text: {
        en: "On R1, create the named extended ACL USERS-IN: permit TCP 80 from 192.168.10.0/24 to host 192.168.20.10, deny ICMP from the same users to that host, and permit all other IP traffic.",
        hi: "R1 par named extended ACL USERS-IN banao: 192.168.10.0/24 se host 192.168.20.10 tak TCP 80 permit karo, unhi users se us host tak ICMP deny karo, aur baaki saara IP traffic permit karo.",
      },
      hint: {
        en: "`ip access-list extended USERS-IN`, then `permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 80`, `deny icmp 192.168.10.0 0.0.0.255 host 192.168.20.10`, `permit ip any any`.",
        hi: "`ip access-list extended USERS-IN` mein jao, phir `permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 80`, `deny icmp 192.168.10.0 0.0.0.255 host 192.168.20.10` aur `permit ip any any` do.",
      },
      check: [
        { t: "config", dev: "r1", section: "ip access-list extended USERS-IN", has: "^ permit tcp 192\\.168\\.10\\.0 0\\.0\\.0\\.255 host 192\\.168\\.20\\.10 eq (www|80)$" },
        { t: "config", dev: "r1", section: "ip access-list extended USERS-IN", has: "^ deny icmp (any|192\\.168\\.10\\.0 0\\.0\\.0\\.255) host 192\\.168\\.20\\.10" },
        { t: "config", dev: "r1", section: "ip access-list extended USERS-IN", has: "^ permit ip any any$" },
      ],
    },
    {
      text: {
        en: "An extended ACL can name the exact destination, so place it near the source: apply USERS-IN inbound on R1's Gi0/1, the users' LAN interface.",
        hi: "Extended ACL exact destination bata sakta hai, isliye use source ke paas lagao: USERS-IN ko R1 ke Gi0/1 par, jo users ka LAN interface hai, inbound apply karo.",
      },
      hint: {
        en: "`interface g0/1` then `ip access-group USERS-IN in`.",
        hi: "`interface g0/1` mein jaakar `ip access-group USERS-IN in` do.",
      },
      check: { t: "config", dev: "r1", section: "interface GigabitEthernet0/1", has: "^ ip access-group USERS-IN in$" },
    },
    {
      text: {
        en: "Prove the policy from User-1: the web page loads, a ping to the web server fails, and a ping to File-Server 192.168.20.20 still works.",
        hi: "User-1 se policy prove karo: web page khule, web server ka ping fail ho, aur File-Server 192.168.20.20 ka ping ab bhi chale.",
      },
      hint: {
        en: "On User-1: `curl http://192.168.20.10`, `ping 192.168.20.10`, `ping 192.168.20.20`. On R1, `show access-lists` shows which line each packet hit.",
        hi: "User-1 par `curl http://192.168.20.10`, `ping 192.168.20.10` aur `ping 192.168.20.20` chalao. R1 par `show access-lists` batata hai kaunsi line par kitne packets match hue.",
      },
      check: [
        { t: "tcp", from: "pc1", to: "192.168.20.10", port: 80 },
        { t: "ping", from: "pc1", to: "192.168.20.10", ok: false },
        { t: "ping", from: "pc1", to: "192.168.20.20" },
      ],
    },
    {
      text: {
        en: "The server team now reports that Web-Server can't ping the users any more: the users' echo replies hit your deny line. Change only that line so it blocks echo requests from the users and lets replies through. Users still must not ping the web server.",
        hi: "Ab server team bol rahi hai ki Web-Server users ko ping nahi kar pa raha: users ke echo replies tumhari deny line se takra rahe hain. Sirf woh line badlo taaki woh users ke echo requests block kare aur replies ko jaane de. Users ab bhi web server ko ping nahi kar paane chahiye.",
      },
      hint: {
        en: "`do show access-lists` shows the sequence numbers. Inside `ip access-list extended USERS-IN`: `no 20`, then `20 deny icmp 192.168.10.0 0.0.0.255 host 192.168.20.10 echo`. Test with `ping 192.168.10.10` on Web-Server.",
        hi: "`do show access-lists` se sequence numbers dekho. `ip access-list extended USERS-IN` ke andar `no 20` do, phir `20 deny icmp 192.168.10.0 0.0.0.255 host 192.168.20.10 echo`. Web-Server par `ping 192.168.10.10` se test karo.",
      },
      check: [
        { t: "ping", from: "web", to: "192.168.10.10" },
        { t: "ping", from: "pc1", to: "192.168.20.10", ok: false },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/1", has: "^ ip access-group USERS-IN in$" },
      ],
    },
  ],
  solution: {
    r1: [
      "ip access-list extended USERS-IN",
      "permit tcp 192.168.10.0 0.0.0.255 host 192.168.20.10 eq 80",
      "deny icmp 192.168.10.0 0.0.0.255 host 192.168.20.10",
      "permit ip any any",
      "exit",
      "interface g0/1",
      "ip access-group USERS-IN in",
      "exit",
      "ip access-list extended USERS-IN",
      "no 20",
      "20 deny icmp 192.168.10.0 0.0.0.255 host 192.168.20.10 echo",
    ],
    pc1: ["curl http://192.168.20.10", "ping 192.168.20.10", "ping 192.168.20.20"],
    web: ["ping 192.168.10.10"],
  },
  debrief: {
    en: "Extended ACLs match protocol, source, destination and port, so they can sit right next to the source and drop traffic before it uses the WAN. ACLs are not stateful: replies are packets too, and a broad `deny icmp` also kills echo replies. Naming the ICMP type (`echo`) and editing by sequence number fixes it without rewriting the list.",
    hi: "Extended ACLs protocol, source, destination aur port match karte hain, isliye woh source ke bilkul paas baith kar traffic ko WAN use karne se pehle hi drop kar sakte hain. ACLs stateful nahi hote: replies bhi packets hi hain, aur ek broad `deny icmp` echo replies ko bhi rok deta hai. ICMP type (`echo`) likhne aur sequence number se edit karne par yeh poori list dobara likhe bina theek ho jaata hai.",
  },
};

export default lab;
