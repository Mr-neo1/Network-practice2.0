import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "acl-standard",
  title: { en: "Standard ACL: keep one host away from the HR server", hi: "Standard ACL: ek host ko HR server se door rakho" },
  level: "intermediate",
  kind: "build",
  minutes: 20,
  lessons: ["acl-standard"],
  scenario: {
    en: "HR has raised a request: \"The intern's PC (192.168.10.11) must not reach the HR server 192.168.20.10. Staff-PC must still reach it, and the intern still needs the printer on 192.168.30.10.\" Routing already works everywhere. Use a standard ACL, and put it where it blocks only what HR asked for.",
    hi: "HR ne request daali hai: \"Intern ka PC (192.168.10.11) HR server 192.168.20.10 tak nahi pahunchna chahiye. Staff-PC ko phir bhi pahunchna chahiye, aur intern ko 192.168.30.10 wala printer abhi bhi chahiye.\" Routing har jagah pehle se kaam kar rahi hai. Standard ACL use karo, aur use aisi jagah lagao jahan woh sirf wahi block kare jo HR ne maanga hai.",
  },
  devices: [
    { id: "pc1", kind: "pc", hostname: "Staff-PC", x: 90, y: 100, host: { ip: "192.168.10.10", prefix: 24, gateway: "192.168.10.1" }, note: "192.168.10.10" },
    { id: "pc2", kind: "pc", hostname: "Intern-PC", x: 90, y: 270, host: { ip: "192.168.10.11", prefix: 24, gateway: "192.168.10.1" }, note: "192.168.10.11" },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 230, y: 185 },
    {
      id: "r1", kind: "router", hostname: "R1", x: 380, y: 185, note: "Users",
      config: [
        "interface g0/1", "ip address 192.168.10.1 255.255.255.0", "no shutdown",
        "interface g0/0", "ip address 10.0.12.1 255.255.255.252", "no shutdown",
        "ip route 0.0.0.0 0.0.0.0 10.0.12.2",
      ],
    },
    {
      id: "r2", kind: "router", hostname: "R2", x: 540, y: 185, note: "Servers",
      config: [
        "interface g0/0", "ip address 10.0.12.2 255.255.255.252", "no shutdown",
        "interface g0/1", "ip address 192.168.20.1 255.255.255.0", "no shutdown",
        "interface g0/2", "ip address 192.168.30.1 255.255.255.0", "no shutdown",
        "ip route 192.168.10.0 255.255.255.0 10.0.12.1",
      ],
    },
    { id: "srv", kind: "server", hostname: "HR-Server", x: 700, y: 100, host: { ip: "192.168.20.10", prefix: 24, gateway: "192.168.20.1", services: ["http"] }, note: "192.168.20.10" },
    { id: "prn", kind: "server", hostname: "Printer", x: 700, y: 270, host: { ip: "192.168.30.10", prefix: 24, gateway: "192.168.30.1" }, note: "192.168.30.10" },
  ],
  links: [
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/2"],
    ["sw1", "GigabitEthernet0/1", "r1", "GigabitEthernet0/1"],
    ["r1", "GigabitEthernet0/0", "r2", "GigabitEthernet0/0"],
    ["r2", "GigabitEthernet0/1", "srv", "FastEthernet0"],
    ["r2", "GigabitEthernet0/2", "prn", "FastEthernet0"],
  ],
  tasks: [
    {
      text: {
        en: "On R2, create standard ACL 10: deny the host 192.168.10.11, then permit everything else (without that permit, the implicit deny would block everyone).",
        hi: "R2 par standard ACL 10 banao: host 192.168.10.11 ko deny karo, phir baaki sab permit karo (yeh permit nahi diya toh implicit deny sabko block kar dega).",
      },
      hint: {
        en: "`access-list 10 deny host 192.168.10.11` and `access-list 10 permit any`. Order matters: the deny must come first.",
        hi: "`access-list 10 deny host 192.168.10.11` aur `access-list 10 permit any` do. Order zaroori hai: deny pehle aana chahiye.",
      },
      check: [
        { t: "config", dev: "r2", has: "^access-list 10 deny (host )?192\\.168\\.10\\.11$" },
        { t: "config", dev: "r2", has: "^access-list 10 permit any$" },
      ],
    },
    {
      text: {
        en: "A standard ACL only looks at the source, so place it close to the destination: apply ACL 10 outbound on R2's Gi0/1, the interface facing HR-Server.",
        hi: "Standard ACL sirf source dekhta hai, isliye use destination ke paas lagao: ACL 10 ko R2 ke Gi0/1 par outbound apply karo, jo interface HR-Server ki taraf hai.",
      },
      hint: {
        en: "`interface g0/1` then `ip access-group 10 out`. `do show access-lists` shows the ACL and its match counters.",
        hi: "`interface g0/1` mein jaakar `ip access-group 10 out` do. `do show access-lists` se ACL aur uske matches dekho.",
      },
      check: { t: "config", dev: "r2", section: "interface GigabitEthernet0/1", has: "^ ip access-group 10 out$" },
    },
    {
      text: {
        en: "Prove it: Intern-PC can't ping HR-Server, but Staff-PC can, and Intern-PC still reaches the printer 192.168.30.10 and R2's link address 10.0.12.2.",
        hi: "Prove karo: Intern-PC HR-Server ko ping nahi kar sakta, lekin Staff-PC kar sakta hai, aur Intern-PC ab bhi printer 192.168.30.10 aur R2 ke link address 10.0.12.2 tak pahunchta hai.",
      },
      hint: {
        en: "From Intern-PC: `ping 192.168.20.10` (should fail), `ping 192.168.30.10` and `ping 10.0.12.2` (should work). From Staff-PC: `ping 192.168.20.10`. If the printer fails too, the ACL is on the wrong interface.",
        hi: "Intern-PC se `ping 192.168.20.10` (fail hona chahiye), `ping 192.168.30.10` aur `ping 10.0.12.2` (chalna chahiye). Staff-PC se `ping 192.168.20.10`. Printer bhi fail ho toh ACL galat interface par laga hai.",
      },
      check: [
        { t: "ping", from: "pc2", to: "192.168.20.10", ok: false },
        { t: "ping", from: "pc1", to: "192.168.20.10" },
        { t: "ping", from: "pc2", to: "192.168.30.10" },
        { t: "ping", from: "pc2", to: "10.0.12.2" },
      ],
    },
  ],
  solution: {
    r2: [
      "access-list 10 deny host 192.168.10.11",
      "access-list 10 permit any",
      "interface g0/1",
      "ip access-group 10 out",
    ],
    pc2: ["ping 192.168.20.10", "ping 192.168.30.10"],
    pc1: ["ping 192.168.20.10"],
  },
  debrief: {
    en: "A standard ACL matches only the source address. Put it near the source and it blocks that host from everything behind the router; put it near the destination and it blocks only the path you meant. Every ACL ends with an invisible `deny any`, so a 'block one host' ACL always needs a `permit any` after the deny.",
    hi: "Standard ACL sirf source address match karta hai. Use source ke paas lagaoge toh woh host router ke peeche sab cheezon se block ho jayega; destination ke paas lagaoge toh sirf wahi path block hoga jo tum chahte the. Har ACL ke end mein ek invisible `deny any` hota hai, isliye 'ek host block karo' wale ACL mein deny ke baad `permit any` hamesha chahiye.",
  },
};

export default lab;
