import type { TopologyScene } from "../types.ts";

// Colours: blue = PC1's ping to SRV1, green = SRV1's reply, orange = ICMP unreachable.
// The R1 tables show only C and S routes; the L (local /32) routes are left out to save space.

const rtCols = ["Code", "Network", "AD", "Next hop / interface"];
const cfgCols = ["Configured static route", "AD", "In routing table?"];
const rtTitle = "R1 routing table (C and S routes)";
const cfgTitle = "R1 static routes in running-config";

const cLan = ["C", "192.168.1.0/24", "0", "Gi0/0"];
const c12 = ["C", "10.0.12.0/30", "0", "Gi0/1"];
const c13 = ["C", "10.0.13.0/30", "0", "Gi0/2"];
const sPrimary = ["S", "192.168.2.0/24", "1", "via 10.0.12.2"];
const sBackup = ["S", "192.168.2.0/24", "200", "via 10.0.13.2"];

const cfgPrimary = "192.168.2.0/24 via 10.0.12.2";
const cfgBackup = "192.168.2.0/24 via 10.0.13.2";

const scene: TopologyScene = {
  kind: "topology",
  id: "static-routing",
  title: { en: "A static route, a recursive lookup and a floating backup", hi: "Static route, recursive lookup aur floating backup" },
  height: 420,
  nodes: [
    { id: "pc1", kind: "pc", x: 80, y: 205, label: "PC1", sub: "192.168.1.10/24" },
    { id: "r1", kind: "router", x: 270, y: 205, label: "R1", sub: "Gi0/1 10.0.12.1", sub2: "Gi0/2 10.0.13.1" },
    { id: "r2", kind: "router", x: 520, y: 95, label: "R2 (HQ)", sub: "Gi0/1 10.0.12.2", sub2: "Gi0/2 10.0.23.1" },
    { id: "r3", kind: "router", x: 520, y: 315, label: "R3", sub: "Gi0/1 10.0.13.2", sub2: "Gi0/2 10.0.23.2" },
    { id: "srv", kind: "server", x: 700, y: 95, label: "SRV1", sub: "192.168.2.10/24" },
  ],
  links: [
    { id: "l-lan1", a: "pc1", b: "r1", bPort: "Gi0/0", label: "192.168.1.0/24" },
    { id: "l12", a: "r1", b: "r2", aPort: "Gi0/1", bPort: "Gi0/1", label: "10.0.12.0/30" },
    { id: "l13", a: "r1", b: "r3", aPort: "Gi0/2", bPort: "Gi0/1", label: "10.0.13.0/30" },
    { id: "l23", a: "r2", b: "r3", aPort: "Gi0/2", bPort: "Gi0/2", label: "10.0.23.0/30" },
    { id: "l-lan2", a: "r2", b: "srv", aPort: "Gi0/0", label: "192.168.2.0/24" },
  ],
  steps: [
    {
      title: { en: "R1 knows only its connected networks", hi: "R1 sirf apne connected networks jaanta hai" },
      text: {
        en: "PC1 pings SRV1 at 192.168.2.10. R1's table holds only its three connected networks, so nothing matches 192.168.2.10 and there is no default route. R1 drops the packet and sends ICMP Destination Unreachable back to PC1. (R2 and R3 already have their routes; this scene follows R1.)",
        hi: "PC1, SRV1 (192.168.2.10) ko ping karta hai. R1 ki table mein sirf uske teen connected networks hain, toh 192.168.2.10 kisi se match nahi karta aur default route bhi nahi hai. R1 packet drop karta hai aur PC1 ko ICMP Destination Unreachable bhejta hai. (R2 aur R3 par routes pehle se lage hain; yeh scene sirf R1 ko follow karta hai.)",
      },
      focus: ["r1"],
      packets: [
        { path: ["pc1", "r1"], label: "Ping 2.10", tone: "blue", drop: true },
        { path: ["r1", "pc1"], label: "Unreachable", tone: "orange", delay: 1 },
      ],
      badges: [{ node: "r1", text: "no route", tone: "red" }],
      tables: [{ node: "r1", title: rtTitle, columns: rtCols, rows: [cLan, c12, c13] }],
    },
    {
      title: { en: "Add the primary static route", hi: "Primary static route add karo" },
      text: {
        en: "On R1: ip route 192.168.2.0 255.255.255.0 10.0.12.2. It means \"to reach 192.168.2.0/24, hand the packet to 10.0.12.2\", which is R2. 10.0.12.2 is inside the connected network on Gi0/1, so the next hop is reachable and the route enters the table with AD 1.",
        hi: "R1 par: ip route 192.168.2.0 255.255.255.0 10.0.12.2. Matlab \"192.168.2.0/24 tak pahunchna hai toh packet 10.0.12.2 ko do\", yaani R2 ko. 10.0.12.2 Gi0/1 wale connected network ke andar hai, isliye next hop reachable hai aur route AD 1 ke saath table mein aa jaata hai.",
      },
      focus: ["r1", "r2"],
      badges: [{ node: "r1", text: "" }],
      tables: [
        { node: "r1", title: rtTitle, columns: rtCols, rows: [cLan, c12, c13, sPrimary], hl: [3] },
        { node: "r1", title: cfgTitle, columns: cfgCols, rows: [[cfgPrimary, "1", "yes"]], hl: [0] },
      ],
    },
    {
      title: { en: "Two lookups, then out of Gi0/1", hi: "Do lookups, phir Gi0/1 se bahar" },
      text: {
        en: "PC1 pings again. R1 matches 192.168.2.10 to S 192.168.2.0/24 via 10.0.12.2. That route names a next hop but no interface, so R1 does a second, recursive lookup: 10.0.12.2 matches C 10.0.12.0/30 on Gi0/1. The ping goes R1 → R2 → SRV1, and the reply comes back the same way.",
        hi: "PC1 dobara ping karta hai. R1 192.168.2.10 ko S 192.168.2.0/24 via 10.0.12.2 se match karta hai. Is route mein next hop hai par interface nahi, isliye R1 doosra, recursive lookup karta hai: 10.0.12.2 Gi0/1 wale C 10.0.12.0/30 se match hota hai. Ping R1 → R2 → SRV1 jaata hai, aur reply usi raaste wapas aata hai.",
      },
      focus: ["r1"],
      packets: [
        { path: ["pc1", "r1", "r2", "srv"], label: "Ping 2.10", tone: "blue" },
        { path: ["srv", "r2", "r1", "pc1"], label: "Reply", tone: "green", delay: 3 },
      ],
      links: [{ id: "l12", state: "active" }],
      tables: [
        { node: "r1", title: cfgTitle, columns: cfgCols, rows: [] },
        {
          node: "r1",
          title: "R1 lookups for 192.168.2.10",
          columns: ["Lookup", "Address", "Matching route"],
          rows: [
            ["1", "192.168.2.10", "S 192.168.2.0/24 via 10.0.12.2"],
            ["2 (recursive)", "10.0.12.2", "C 10.0.12.0/30, Gi0/1"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Add a floating static route", hi: "Floating static route add karo" },
      text: {
        en: "For a backup path through R3: ip route 192.168.2.0 255.255.255.0 10.0.13.2 200. Same prefix, but AD 200 loses to the primary's AD 1, so it waits in the running-config and does not enter the routing table. It only floats up when the better route disappears.",
        hi: "R3 ke through backup path ke liye: ip route 192.168.2.0 255.255.255.0 10.0.13.2 200. Prefix same hai, lekin AD 200 primary ke AD 1 se haar jaata hai, isliye yeh running-config mein wait karta hai aur routing table mein nahi aata. Yeh tabhi upar 'float' karta hai jab behtar route gayab ho.",
      },
      focus: ["r1", "r3"],
      links: [{ id: "l12", state: "normal" }],
      tables: [
        { node: "r1", title: "R1 lookups for 192.168.2.10", columns: ["Lookup", "Address", "Matching route"], rows: [] },
        {
          node: "r1",
          title: cfgTitle,
          columns: cfgCols,
          rows: [
            [cfgPrimary, "1", "yes"],
            [cfgBackup, "200", "no, AD 1 wins"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "The primary link fails", hi: "Primary link fail ho jaata hai" },
      text: {
        en: "The cable between R1 and R2 is cut, so Gi0/1 goes down and C 10.0.12.0/30 leaves the table. Now 10.0.12.2 matches no route, the recursive lookup fails, and R1 withdraws the primary static route. The floating route via 10.0.13.2 is the best one left, so R1 installs it with AD 200.",
        hi: "R1 aur R2 ke beech ka cable kat jaata hai, isliye Gi0/1 down hota hai aur C 10.0.12.0/30 table se nikal jaata hai. Ab 10.0.12.2 kisi route se match nahi karta, recursive lookup fail hota hai, aur R1 primary static route hata deta hai. Bacha hua sabse achha route floating wala via 10.0.13.2 hai, isliye R1 use AD 200 ke saath install kar deta hai.",
      },
      focus: ["r1"],
      links: [{ id: "l12", state: "down", note: "cable cut" }],
      badges: [{ node: "r1", text: "Gi0/1 down", tone: "red" }],
      tables: [
        { node: "r1", title: rtTitle, columns: rtCols, rows: [cLan, c13, sBackup], hl: [2] },
        {
          node: "r1",
          title: cfgTitle,
          columns: cfgCols,
          rows: [
            [cfgPrimary, "1", "no, next hop lost"],
            [cfgBackup, "200", "yes"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Traffic takes the backup path", hi: "Traffic backup path se jaata hai" },
      text: {
        en: "PC1's ping now leaves R1 out of Gi0/2 to R3, and R3 forwards it to R2 with its own route to 192.168.2.0/24. R2 lost its Gi0/1 too, so its own floating route to 192.168.1.0/24 via R3 carries the reply back. A backup only works when both directions have one.",
        hi: "Ab PC1 ka ping R1 se Gi0/2 ke through R3 ko jaata hai, aur R3 apne 192.168.2.0/24 wale route se use R2 ko forward karta hai. R2 ka Gi0/1 bhi down hai, isliye uska apna floating route (192.168.1.0/24 via R3) reply ko wapas laata hai. Backup tabhi kaam karta hai jab dono directions mein ho.",
      },
      packets: [
        { path: ["pc1", "r1", "r3", "r2", "srv"], label: "Ping 2.10", tone: "blue" },
        { path: ["srv", "r2", "r3", "r1", "pc1"], label: "Reply", tone: "green", delay: 4 },
      ],
      links: [
        { id: "l13", state: "active" },
        { id: "l23", state: "active" },
      ],
      badges: [{ node: "r2", text: "floating too", tone: "purple" }],
      tables: [{ node: "r1", title: cfgTitle, columns: cfgCols, rows: [] }],
    },
    {
      title: { en: "The link returns, the backup sinks again", hi: "Link wapas, backup phir neeche" },
      text: {
        en: "The cable is repaired and Gi0/1 comes back up. C 10.0.12.0/30 returns, 10.0.12.2 is reachable again, and the AD 1 route is reinstalled. It beats AD 200, so the floating route leaves the table but stays in the configuration for the next failure. Traffic is back on the direct link with no command typed.",
        hi: "Cable theek ho jaata hai aur Gi0/1 wapas up hota hai. C 10.0.12.0/30 laut aata hai, 10.0.12.2 phir reachable hai, aur AD 1 wala route dobara install hota hai. Yeh AD 200 ko harata hai, isliye floating route table se nikal jaata hai lekin agle failure ke liye configuration mein rehta hai. Bina koi command type kiye traffic wapas direct link par hai.",
      },
      packets: [
        { path: ["pc1", "r1", "r2", "srv"], label: "Ping 2.10", tone: "blue" },
        { path: ["srv", "r2", "r1", "pc1"], label: "Reply", tone: "green", delay: 3 },
      ],
      links: [
        { id: "l12", state: "active" },
        { id: "l13", state: "normal" },
        { id: "l23", state: "normal" },
      ],
      badges: [
        { node: "r1", text: "" },
        { node: "r2", text: "" },
      ],
      tables: [
        { node: "r1", title: rtTitle, columns: rtCols, rows: [cLan, c12, c13, sPrimary], hl: [1, 3] },
        {
          node: "r1",
          title: cfgTitle,
          columns: cfgCols,
          rows: [
            [cfgPrimary, "1", "yes"],
            [cfgBackup, "200", "no, AD 1 wins"],
          ],
          hl: [0, 1],
        },
      ],
    },
  ],
};

export default scene;
