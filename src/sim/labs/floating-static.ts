import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "floating-static",
  title: { en: "Backup link with a floating static route", hi: "Floating static route ke saath backup link" },
  level: "intermediate",
  kind: "build",
  minutes: 20,
  lessons: ["static-routing", "forwarding-decisions"],
  scenario: {
    en: "The branch router BR1 has two links to HQ: a fast primary on Gi0/0 and a cheaper backup on Gi0/1. Management wants all traffic on the primary, and if the primary dies the branch should carry on over the backup without anyone typing a command. HQ is already set up to send replies back over either link. Configure BR1, then pull the plug on the primary to prove it works.",
    hi: "Branch router BR1 ke HQ tak do links hain: Gi0/0 par fast primary aur Gi0/1 par sasta backup. Management chahta hai ki saara traffic primary par chale, aur agar primary down ho jaaye toh branch bina kisi ke command type kiye backup par chalti rahe. HQ pehle se dono links par replies wapas bhejne ke liye set hai. BR1 configure karo, phir primary ka plug kheench kar prove karo ki yeh kaam karta hai.",
  },
  devices: [
    { id: "br1", kind: "router", hostname: "BR1", x: 250, y: 120, note: "Branch", config: [
      "interface g0/0", "description PRIMARY to HQ", "ip address 10.0.1.1 255.255.255.252", "no shutdown",
      "interface g0/1", "description BACKUP to HQ", "ip address 10.0.2.1 255.255.255.252", "no shutdown",
      "interface g0/2", "ip address 192.168.10.1 255.255.255.0", "no shutdown",
    ] },
    { id: "hq", kind: "router", hostname: "HQ", x: 550, y: 120, note: "HQ (managed)", locked: true, config: [
      "interface g0/0", "ip address 10.0.1.2 255.255.255.252", "no shutdown",
      "interface g0/1", "ip address 10.0.2.2 255.255.255.252", "no shutdown",
      "interface g0/2", "ip address 172.16.1.1 255.255.255.0", "no shutdown",
      "ip route 192.168.10.0 255.255.255.0 10.0.1.1",
      "ip route 192.168.10.0 255.255.255.0 10.0.2.1 200",
    ] },
    { id: "pc1", kind: "pc", hostname: "Branch-PC", x: 250, y: 270, host: { ip: "192.168.10.10", prefix: 24, gateway: "192.168.10.1" }, note: "192.168.10.10" },
    { id: "srv", kind: "server", hostname: "HQ-Server", x: 550, y: 270, host: { ip: "172.16.1.10", prefix: 24, gateway: "172.16.1.1", services: ["http"] }, note: "172.16.1.10" },
  ],
  links: [
    ["br1", "GigabitEthernet0/0", "hq", "GigabitEthernet0/0"],
    ["br1", "GigabitEthernet0/1", "hq", "GigabitEthernet0/1"],
    ["pc1", "FastEthernet0", "br1", "GigabitEthernet0/2"],
    ["srv", "FastEthernet0", "hq", "GigabitEthernet0/2"],
  ],
  tasks: [
    {
      text: { en: "On BR1, add a default route through the primary link, next hop 10.0.1.2.", hi: "BR1 par primary link ke through default route daalo, next hop 10.0.1.2." },
      hint: {
        en: "`ip route 0.0.0.0 0.0.0.0 10.0.1.2`. It shows up as S* in `show ip route` and becomes the gateway of last resort.",
        hi: "`ip route 0.0.0.0 0.0.0.0 10.0.1.2` chalao. Yeh `show ip route` mein S* ban kar dikhega aur gateway of last resort ban jaayega.",
      },
      check: [
        { t: "config", dev: "br1", has: "^ip route 0\\.0\\.0\\.0 0\\.0\\.0\\.0 10\\.0\\.1\\.2$" },
        { t: "route", dev: "br1", prefix: "0.0.0.0/0", code: "S*" },
      ],
    },
    {
      text: {
        en: "Add a floating default route through the backup link (next hop 10.0.2.2) with administrative distance 200, so it stays out of the table while the primary works.",
        hi: "Backup link ke through ek floating default route daalo (next hop 10.0.2.2), administrative distance 200 ke saath, taaki jab tak primary chal raha hai yeh table se bahar rahe.",
      },
      hint: {
        en: "`ip route 0.0.0.0 0.0.0.0 10.0.2.2 200`. The number at the end is the AD. `show ip route` still shows only the primary; `show running-config` shows both.",
        hi: "`ip route 0.0.0.0 0.0.0.0 10.0.2.2 200` do. Aakhri number AD hai. `show ip route` mein abhi bhi sirf primary dikhega; `show running-config` mein dono dikhenge.",
      },
      check: { t: "config", dev: "br1", has: "^ip route 0\\.0\\.0\\.0 0\\.0\\.0\\.0 10\\.0\\.2\\.2 200$" },
    },
    {
      text: { en: "Check the normal path: Branch-PC can open the web page on HQ-Server.", hi: "Normal path check karo: Branch-PC HQ-Server ka web page khol sake." },
      hint: {
        en: "On Branch-PC run `ping 172.16.1.10` and `curl http://172.16.1.10`. `tracert 172.16.1.10` shows the packet going through BR1 and then HQ's primary address 10.0.1.2.",
        hi: "Branch-PC par `ping 172.16.1.10` aur `curl http://172.16.1.10` chalao. `tracert 172.16.1.10` se dekho ki packet BR1 ke baad HQ ke primary address 10.0.1.2 se jaata hai.",
      },
      check: [
        { t: "ping", from: "pc1", to: "172.16.1.10" },
        { t: "tcp", from: "pc1", to: "172.16.1.10", port: 80 },
      ],
    },
    {
      text: {
        en: "Simulate a failure: shut down BR1's primary interface Gi0/0. The floating route must take over and Branch-PC must still reach HQ-Server.",
        hi: "Failure simulate karo: BR1 ka primary interface Gi0/0 shutdown karo. Floating route ko jagah leni chahiye aur Branch-PC ko phir bhi HQ-Server tak pahunchna chahiye.",
      },
      hint: {
        en: "`interface g0/0` then `shutdown`. Now `show ip route` shows S* via 10.0.2.2. Ping again from Branch-PC.",
        hi: "`interface g0/0` mein jao, phir `shutdown` do. Ab `show ip route` mein S* 10.0.2.2 ke via dikhega. Branch-PC se dobara ping karo.",
      },
      check: [
        { t: "config", dev: "br1", section: "interface GigabitEthernet0/0", has: "^ shutdown$" },
        { t: "route", dev: "br1", prefix: "0.0.0.0/0", code: "S*" },
        { t: "ping", from: "pc1", to: "172.16.1.10" },
      ],
    },
  ],
  solution: {
    br1: ["ip route 0.0.0.0 0.0.0.0 10.0.1.2", "ip route 0.0.0.0 0.0.0.0 10.0.2.2 200", "interface g0/0", "shutdown"],
  },
  debrief: {
    en: "A floating static route is a normal static route with an administrative distance higher than the route it backs up. It waits outside the routing table and only goes in when the better route disappears, here because the primary interface went down. Remember to `no shutdown` the primary after the test. A static route only notices failures that take its interface or next hop away; a fault further along the primary path would not trigger the backup.",
    hi: "Floating static route ek normal static route hai jiska administrative distance us route se zyada hota hai jiska woh backup hai. Woh routing table ke bahar wait karta hai aur tabhi andar aata hai jab behtar route gayab ho jaata hai, yahan isliye kyunki primary interface down ho gaya. Test ke baad primary par `no shutdown` karna yaad rakho. Static route sirf woh failures pakadta hai jo uska interface ya next hop hata dein; primary path par aage koi fault ho toh backup trigger nahi hoga.",
  },
};

export default lab;
