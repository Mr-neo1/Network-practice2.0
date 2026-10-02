import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "internet-down-troubleshoot",
  title: { en: "Troubleshoot: the office internet is down", hi: "Troubleshoot: office ka internet band hai" },
  level: "advanced",
  kind: "troubleshoot",
  minutes: 40,
  lessons: ["troubleshooting-method", "nat", "static-routing"],
  scenario: {
    en: "Ticket #4471, priority high: \"Nobody in the office can reach the internet since this morning. Websites time out, but the PCs can still reach each other and the router.\" A contractor did a router replacement last night. The ISP's handover sheet says: your address 203.0.113.2/29, our gateway 203.0.113.1, test host 8.8.8.8, and their status page is the web server at 198.51.100.10. The office LAN is 192.168.1.0/24. Work bottom-up or follow the path, but prove each step before you move on. There may be more than one fault.",
    hi: "Ticket #4471, priority high: \"Subah se office mein kisi ka bhi internet nahi chal raha. Websites time out ho rahi hain, lekin PCs abhi bhi ek dusre tak aur router tak pahunch rahe hain.\" Kal raat ek contractor ne router replace kiya tha. ISP ki handover sheet kehti hai: tumhara address 203.0.113.2/29, hamara gateway 203.0.113.1, test host 8.8.8.8, aur unka status page web server 198.51.100.10 par hai. Office LAN 192.168.1.0/24 hai. Bottom-up chalo ya packet ka path follow karo, lekin aage badhne se pehle har step prove karo. Fault ek se zyada ho sakte hain.",
  },
  devices: [
    { id: "pc1", kind: "pc", hostname: "Office-PC1", x: 90, y: 270, host: { ip: "192.168.1.10", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.10" },
    { id: "pc2", kind: "pc", hostname: "Office-PC2", x: 300, y: 270, host: { ip: "192.168.1.11", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.11" },
    { id: "sw1", kind: "switch", hostname: "OFFICE-SW", x: 190, y: 120 },
    { id: "r1", kind: "router", hostname: "EDGE-R1", x: 400, y: 120, note: "LAN .1, WAN .2/29", config: [
      "interface g0/0", "description Link to ISP", "ip address 203.0.113.2 255.255.255.248", "ip nat outside", "no shutdown",
      "interface g0/1", "description Office LAN", "ip address 192.168.1.1 255.255.255.0", "no shutdown",
      "exit",
      "access-list 1 permit 192.168.10.0 0.0.0.255",
      "ip nat inside source list 1 interface g0/0 overload",
      "ip route 0.0.0.0 0.0.0.0 203.0.113.6",
    ] },
    { id: "isp", kind: "router", hostname: "ISP", x: 600, y: 120, note: "203.0.113.1, Lo0 8.8.8.8", locked: true, config: [
      "interface g0/0", "ip address 203.0.113.1 255.255.255.248", "no shutdown",
      "interface g0/1", "ip address 198.51.100.1 255.255.255.0", "no shutdown",
      "interface lo0", "ip address 8.8.8.8 255.255.255.255",
    ] },
    { id: "web", kind: "server", hostname: "ISP-Web", x: 600, y: 270, host: { ip: "198.51.100.10", prefix: 24, gateway: "198.51.100.1", services: ["http"] }, note: "198.51.100.10" },
  ],
  links: [
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/2"],
    ["sw1", "GigabitEthernet0/1", "r1", "GigabitEthernet0/1"],
    ["r1", "GigabitEthernet0/0", "isp", "GigabitEthernet0/0"],
    ["isp", "GigabitEthernet0/1", "web", "FastEthernet0"],
  ],
  tasks: [
    {
      text: {
        en: "First make the router itself reach the internet: EDGE-R1 must be able to ping 8.8.8.8.",
        hi: "Pehle router ko khud internet tak pahunchao: EDGE-R1 se 8.8.8.8 ping hona chahiye.",
      },
      hint: {
        en: "Check the gateway of last resort in `show ip route` and compare it with the handover sheet. A ping to the ISP gateway itself tells you whether the link is fine.",
        hi: "`show ip route` mein gateway of last resort dekho aur handover sheet se compare karo. ISP gateway ko seedha ping karke pata chalega ki link theek hai ya nahi.",
      },
      check: { t: "ping", from: "r1", to: "8.8.8.8" },
    },
    {
      text: {
        en: "Both office PCs must reach 8.8.8.8 and open the ISP status page at 198.51.100.10.",
        hi: "Dono office PCs 8.8.8.8 tak pahunch sakein aur ISP ka status page 198.51.100.10 khol sakein.",
      },
      hint: {
        en: "The ISP can't route private addresses back, so every office packet must be translated. After a test from a PC, `show ip nat translations` should not be empty. If it is, check which interfaces are inside and outside, and whether the NAT ACL really matches the office LAN (`show access-lists` hit counts help).",
        hi: "ISP private addresses ko wapas route nahi kar sakta, isliye office ka har packet translate hona chahiye. PC se test karne ke baad `show ip nat translations` khaali nahi hona chahiye. Khaali ho toh dekho kaunse interfaces inside aur outside hain, aur kya NAT ACL sach mein office LAN match karta hai (`show access-lists` ke hit counts madad karte hain).",
      },
      check: [
        { t: "ping", from: "pc1", to: "8.8.8.8" },
        { t: "ping", from: "pc2", to: "8.8.8.8" },
        { t: "tcp", from: "pc1", to: "198.51.100.10", port: 80 },
        { t: "tcp", from: "pc2", to: "198.51.100.10", port: 80 },
      ],
    },
    {
      text: {
        en: "Leave no junk behind: the wrong default route and the wrong ACL entry must be gone from the running config, not just overridden.",
        hi: "Koi kachra mat chhodo: galat default route aur galat ACL entry running config se hata do, sirf unke upar naya mat daalo.",
      },
      hint: {
        en: "Use the `no` form of the exact line you want to remove. For a numbered ACL, either remove the whole list and rebuild it, or edit it by sequence number under `ip access-list standard 1`.",
        hi: "Jo line hatani hai uska exact `no` form use karo. Numbered ACL ke liye ya toh poori list hata kar dobara banao, ya `ip access-list standard 1` ke andar sequence number se edit karo.",
      },
      check: [
        { t: "config", dev: "r1", has: "^ip route 0\\.0\\.0\\.0 0\\.0\\.0\\.0 203\\.0\\.113\\.6$", not: true },
        { t: "config", dev: "r1", has: "192\\.168\\.10\\.0", not: true },
        { t: "ping", from: "pc1", to: "8.8.8.8" },
      ],
    },
    {
      text: { en: "Save the fixed configuration so the outage doesn't come back after a reload.", hi: "Fixed configuration save karo taaki reload ke baad outage wapas na aaye." },
      hint: {
        en: "Copy the running config to the startup config on EDGE-R1, then compare the two to be sure.",
        hi: "EDGE-R1 par running config ko startup config mein copy karo, phir pakka karne ke liye dono compare karo.",
      },
      check: { t: "saved", dev: "r1" },
    },
  ],
  solution: {
    r1: [
      "no ip route 0.0.0.0 0.0.0.0 203.0.113.6",
      "ip route 0.0.0.0 0.0.0.0 203.0.113.1",
      "interface g0/1", "ip nat inside", "exit",
      "ip access-list standard 1", "no 10", "permit 192.168.1.0 0.0.0.255", "exit",
      "end", "copy running-config startup-config",
    ],
  },
  debrief: {
    en: "Three faults stacked on top of each other: a default route to an address nobody owns, a LAN interface that was never marked `ip nat inside`, and a NAT ACL written for an old subnet. Fixing one at a time changed nothing visible for the users, which is why you test each layer separately: the router's own ping proved routing, and an empty NAT table pointed at NAT. When a PAT setup fails, check the three pieces together: inside/outside on the interfaces, the ACL, and the `ip nat inside source` line.",
    hi: "Teen faults ek ke upar ek the: aise address ki taraf default route jo kisi ka nahi hai, ek LAN interface jis par kabhi `ip nat inside` laga hi nahi, aur ek NAT ACL jo purane subnet ke liye likha gaya tha. Ek ek karke fix karne par users ke liye kuch bhi nahi badla, isliye har layer alag se test karte hain: router ke apne ping ne routing prove ki, aur khaali NAT table ne NAT ki taraf ishara kiya. Jab PAT kaam na kare, teeno pieces saath mein check karo: interfaces par inside/outside, ACL, aur `ip nat inside source` line.",
  },
};

export default lab;
