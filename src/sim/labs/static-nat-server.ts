import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "static-nat-server",
  title: { en: "Publish a web server with static NAT", hi: "Static NAT se web server ko internet par publish karo" },
  level: "intermediate",
  kind: "build",
  minutes: 20,
  lessons: ["nat"],
  scenario: {
    en: "Marketing wants the company website, running on Web-Server 192.168.10.10, reachable from the internet. The ISP has routed the public block 198.51.100.16/29 to R1, and 198.51.100.20 is reserved for the website. A customer on Home-PC (192.0.2.10, out past the ISP) must be able to open http://198.51.100.20. The private address must stay hidden.",
    hi: "Marketing chahti hai ki company ki website, jo Web-Server 192.168.10.10 par chal rahi hai, internet se khule. ISP ne public block 198.51.100.16/29 R1 ki taraf route kar diya hai, aur 198.51.100.20 website ke liye reserved hai. Home-PC (192.0.2.10, ISP ke us paar) par baitha customer http://198.51.100.20 khol paana chahiye. Private address chhupa rehna chahiye.",
  },
  height: 300,
  devices: [
    { id: "srv", kind: "server", hostname: "Web-Server", x: 90, y: 150, host: { ip: "192.168.10.10", prefix: 24, gateway: "192.168.10.1", services: ["http"] }, note: "192.168.10.10" },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 240, y: 150 },
    {
      id: "r1", kind: "router", hostname: "R1", x: 390, y: 150, note: "Gi0/0 203.0.113.2",
      config: [
        "interface g0/1", "ip address 192.168.10.1 255.255.255.0", "no shutdown",
        "interface g0/0", "ip address 203.0.113.2 255.255.255.252", "no shutdown",
      ],
    },
    {
      id: "isp", kind: "router", hostname: "ISP", x: 550, y: 150, locked: true,
      config: [
        "interface g0/0", "ip address 203.0.113.1 255.255.255.252", "no shutdown",
        "interface g0/1", "ip address 192.0.2.1 255.255.255.0", "no shutdown",
        "ip route 198.51.100.16 255.255.255.248 203.0.113.2",
      ],
    },
    { id: "home", kind: "pc", hostname: "Home-PC", x: 705, y: 150, host: { ip: "192.0.2.10", prefix: 24, gateway: "192.0.2.1" }, note: "192.0.2.10" },
  ],
  links: [
    ["srv", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["sw1", "GigabitEthernet0/1", "r1", "GigabitEthernet0/1"],
    ["r1", "GigabitEthernet0/0", "isp", "GigabitEthernet0/0"],
    ["isp", "GigabitEthernet0/1", "home", "FastEthernet0"],
  ],
  tasks: [
    {
      text: { en: "Give R1 a default route to the ISP, next hop 203.0.113.1, so replies can leave the building.", hi: "R1 par ISP ki taraf default route do, next hop 203.0.113.1, taaki replies building se bahar ja sakein." },
      hint: { en: "`ip route 0.0.0.0 0.0.0.0 203.0.113.1`. Check with `do show ip route`: look for the S* line.", hi: "`ip route 0.0.0.0 0.0.0.0 203.0.113.1` do. `do show ip route` se check karo, S* wali line dikhni chahiye." },
      check: { t: "route", dev: "r1", prefix: "0.0.0.0/0", code: "S*" },
    },
    {
      text: { en: "Mark R1's interfaces for NAT: Gi0/1 (server LAN) is inside, Gi0/0 (ISP link) is outside.", hi: "R1 ke interfaces NAT ke liye mark karo: Gi0/1 (server LAN) inside hai, Gi0/0 (ISP link) outside." },
      hint: { en: "`interface g0/1`, `ip nat inside`, then `interface g0/0`, `ip nat outside`.", hi: "Pehle `interface g0/1` mein `ip nat inside`, phir `interface g0/0` mein `ip nat outside` do." },
      check: [
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/1", has: "^ ip nat inside$" },
        { t: "config", dev: "r1", section: "interface GigabitEthernet0/0", has: "^ ip nat outside$" },
      ],
    },
    {
      text: { en: "Map Web-Server's private address 192.168.10.10 one-to-one to the public address 198.51.100.20.", hi: "Web-Server ke private address 192.168.10.10 ko public address 198.51.100.20 par one-to-one map karo." },
      hint: { en: "`ip nat inside source static 192.168.10.10 198.51.100.20` in global config. No ACL is needed for a static entry.", hi: "Global config mein `ip nat inside source static 192.168.10.10 198.51.100.20` do. Static entry ke liye koi ACL nahi chahiye." },
      check: { t: "config", dev: "r1", has: "^ip nat inside source static 192\\.168\\.10\\.10 198\\.51\\.100\\.20$" },
    },
    {
      text: {
        en: "Prove it from the internet: Home-PC opens http://198.51.100.20, while the private address 192.168.10.10 stays unreachable from outside.",
        hi: "Internet se prove karo: Home-PC http://198.51.100.20 khol le, lekin bahar se private address 192.168.10.10 tak pahunch na ho.",
      },
      hint: {
        en: "On Home-PC: `curl http://198.51.100.20` should return a page, and `curl http://192.168.10.10` should time out. Then look at `show ip nat translations` on R1.",
        hi: "Home-PC par `curl http://198.51.100.20` se page aana chahiye, aur `curl http://192.168.10.10` time out hona chahiye. Phir R1 par `show ip nat translations` dekho.",
      },
      check: [
        { t: "tcp", from: "home", to: "198.51.100.20", port: 80 },
        { t: "tcp", from: "home", to: "192.168.10.10", port: 80, ok: false },
      ],
    },
    {
      text: { en: "Static NAT works in both directions: Web-Server itself must be able to ping Home-PC, appearing as 198.51.100.20.", hi: "Static NAT dono directions mein kaam karta hai: Web-Server khud Home-PC ko ping kar sake, aur bahar 198.51.100.20 ban kar dikhe." },
      hint: { en: "On Web-Server: `ping 192.0.2.10`. The same static entry translates its source on the way out.", hi: "Web-Server par `ping 192.0.2.10` chalao. Wahi static entry bahar jaate waqt iska source translate kar deti hai." },
      check: { t: "ping", from: "srv", to: "192.0.2.10" },
    },
  ],
  solution: {
    r1: [
      "ip route 0.0.0.0 0.0.0.0 203.0.113.1",
      "interface g0/1", "ip nat inside",
      "interface g0/0", "ip nat outside",
      "exit",
      "ip nat inside source static 192.168.10.10 198.51.100.20",
    ],
    home: ["curl http://198.51.100.20"],
    srv: ["ping 192.0.2.10"],
  },
  debrief: {
    en: "Static NAT is a permanent one-to-one entry, so outside hosts can start connections to the inside server, which PAT alone can't do. The ISP only needs a route for the public address pointing at your router; the private 192.168.10.10 never appears on the internet.",
    hi: "Static NAT ek permanent one-to-one entry hai, isliye outside hosts inside server ki taraf connection shuru kar sakte hain, jo akele PAT se nahi hota. ISP ko bas public address ka ek route chahiye jo tumhare router ki taraf point kare; private 192.168.10.10 internet par kabhi nahi dikhta.",
  },
};

export default lab;
