import type { TopologyScene } from "../types.ts";

// Colours: purple = session messages, orange = BGP Updates, blue = data out,
// green = replies, red = rejected Update.
const pathCols = ["", "AS_PATH", "From"];

const scene: TopologyScene = {
  kind: "topology",
  id: "bgp-basics",
  title: { en: "A dual-homed company: sessions, Updates, best path and prepending", hi: "Dual-homed company: sessions, Updates, best path aur prepending" },
  height: 460,
  nodes: [
    { id: "web", kind: "server", x: 80, y: 230, label: "Web server", sub: "203.0.113.10" },
    { id: "r1", kind: "router", x: 240, y: 230, label: "R1", sub: "AS 65001", sub2: "203.0.113.0/24" },
    { id: "ispa", kind: "router", x: 430, y: 100, label: "ISP-A", sub: "AS 64500" },
    { id: "ispb", kind: "router", x: 430, y: 360, label: "ISP-B", sub: "AS 64510" },
    { id: "rem", kind: "router", x: 600, y: 230, label: "Remote", sub: "AS 64496", sub2: "192.0.2.0/24" },
    { id: "client", kind: "pc", x: 730, y: 230, label: "Client", sub: "192.0.2.10" },
  ],
  links: [
    { id: "l-web", a: "web", b: "r1", bPort: "Gi0/2" },
    { id: "l-a", a: "r1", b: "ispa", aPort: "Gi0/0", label: "198.51.100.0/30" },
    { id: "l-b", a: "r1", b: "ispb", aPort: "Gi0/1", label: "198.51.100.4/30" },
    { id: "l-ar", a: "ispa", b: "rem" },
    { id: "l-br", a: "ispb", b: "rem" },
    { id: "l-cl", a: "rem", b: "client" },
  ],
  steps: [
    {
      title: { en: "One company, two ISPs", hi: "Ek company, do ISPs" },
      text: {
        en: "R1 is the edge router of AS 65001, which owns 203.0.113.0/24 and hosts a web server at 203.0.113.10. It connects to ISP-A (AS 64500) over 1 Gbps and to ISP-B (AS 64510) over a cheaper 200 Mbps link. AS 64496, with a client at 192.0.2.10, stands in for the rest of the internet.",
        hi: "R1 AS 65001 ka edge router hai, jo 203.0.113.0/24 ka owner hai aur 203.0.113.10 par web server chalata hai. Yeh ISP-A (AS 64500) se 1 Gbps par aur ISP-B (AS 64510) se saste 200 Mbps link par juda hai. AS 64496, jisme client 192.0.2.10 hai, baaki internet ki jagah khada hai.",
      },
      focus: ["r1", "ispa", "ispb"],
    },
    {
      title: { en: "eBGP sessions come up on TCP 179", hi: "TCP 179 par eBGP sessions up hote hain" },
      text: {
        en: "R1 opens TCP connections to port 179 on 198.51.100.1 and 198.51.100.5. Each side sends an Open with its ASN, hold time and router ID and checks the ASN against its `remote-as`. Each side then accepts the other's Open by sending a Keepalive, and both sessions reach Established. The ISPs' sessions to AS 64496 are already up.",
        hi: "R1 198.51.100.1 aur 198.51.100.5 ke port 179 par TCP connections kholta hai. Dono taraf Open bhejte hain jisme ASN, hold time aur router ID hota hai, aur ASN ko apne `remote-as` se match karte hain. Phir dono taraf Keepalive bhej kar doosre ka Open accept karte hain, aur dono sessions Established ho jaate hain. ISPs ke AS 64496 wale sessions pehle se up hain.",
      },
      packets: [
        { path: ["r1", "ispa"], label: "Open", tone: "purple" },
        { path: ["ispa", "r1"], label: "Open", tone: "purple", delay: 1 },
        { path: ["r1", "ispa"], label: "Keepalive", tone: "purple", delay: 2 },
        { path: ["ispa", "r1"], label: "Keepalive", tone: "purple", delay: 3 },
        { path: ["r1", "ispb"], label: "Open", tone: "purple" },
        { path: ["ispb", "r1"], label: "Open", tone: "purple", delay: 1 },
        { path: ["r1", "ispb"], label: "Keepalive", tone: "purple", delay: 2 },
        { path: ["ispb", "r1"], label: "Keepalive", tone: "purple", delay: 3 },
      ],
      badges: [
        { node: "ispa", text: "Established", tone: "green" },
        { node: "ispb", text: "Established", tone: "green" },
      ],
    },
    {
      title: { en: "R1 advertises 203.0.113.0/24", hi: "R1 203.0.113.0/24 advertise karta hai" },
      text: {
        en: "R1 sends an Update for 203.0.113.0/24 to both ISPs. Leaving over eBGP, it puts its own AS in the path, so AS_PATH is 65001, and sets NEXT_HOP to its address on that link. Each ISP stores the path in its BGP table.",
        hi: "R1 dono ISPs ko 203.0.113.0/24 ka Update bhejta hai. eBGP par bahar jaate waqt woh apna AS path mein daalta hai, toh AS_PATH 65001 hai, aur NEXT_HOP us link par apna address set karta hai. Dono ISPs yeh path apni BGP table mein rakh lete hain.",
      },
      packets: [
        { path: ["r1", "ispa"], label: "203.0.113.0/24", tone: "orange" },
        { path: ["r1", "ispb"], label: "203.0.113.0/24", tone: "orange" },
      ],
      tables: [
        { node: "ispa", title: "ISP-A: 203.0.113.0/24", columns: pathCols, rows: [[">", "65001", "R1"]], hl: [0] },
        { node: "ispb", title: "ISP-B: 203.0.113.0/24", columns: pathCols, rows: [[">", "65001", "R1"]], hl: [0] },
      ],
    },
    {
      title: { en: "Each ISP adds its AS and passes it on", hi: "Har ISP apna AS jod kar aage bhejta hai" },
      text: {
        en: "ISP-A sends the route to AS 64496 as 64500 65001, and ISP-B as 64510 65001. Both paths are two ASes long, so a later tie-breaker, such as the older path or the lower router ID, decides, and here AS 64496 picks ISP-B. From now on, traffic from the internet to 203.0.113.0/24 enters through ISP-B.",
        hi: "ISP-A yeh route AS 64496 ko 64500 65001 ke roop mein bhejta hai, aur ISP-B 64510 65001 ke roop mein. Dono paths do AS lambe hain, isliye aage ka koi tie-breaker decide karta hai, jaise purana path ya kam router ID, aur yahan AS 64496 ISP-B chunta hai. Ab internet se 203.0.113.0/24 ka traffic ISP-B se andar aayega.",
      },
      packets: [
        { path: ["ispa", "rem"], label: "64500 65001", tone: "orange" },
        { path: ["ispb", "rem"], label: "64510 65001", tone: "orange" },
      ],
      tables: [
        {
          node: "rem",
          title: "Remote: 203.0.113.0/24",
          columns: pathCols,
          rows: [
            ["", "64500 65001", "ISP-A"],
            [">", "64510 65001", "ISP-B"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "R1 learns 192.0.2.0/24 twice", hi: "R1 ko 192.0.2.0/24 do baar milta hai" },
      text: {
        en: "Both ISPs send R1 the remote prefix with a two-AS path. R1's inbound route-map on the ISP-A session sets LOCAL_PREF 200; the ISP-B path keeps the default 100. LOCAL_PREF is compared before AS_PATH, so R1 installs the ISP-A path as `B 192.0.2.0/24 [20/0] via 198.51.100.1`.",
        hi: "Dono ISPs R1 ko remote prefix do AS lambe path ke saath bhejte hain. ISP-A session par R1 ka inbound route-map LOCAL_PREF 200 set karta hai; ISP-B wala path default 100 par rehta hai. LOCAL_PREF AS_PATH se pehle compare hota hai, isliye R1 ISP-A wala path `B 192.0.2.0/24 [20/0] via 198.51.100.1` ke roop mein install karta hai.",
      },
      packets: [
        { path: ["ispa", "r1"], label: "64500 64496", tone: "orange" },
        { path: ["ispb", "r1"], label: "64510 64496", tone: "orange" },
      ],
      tables: [
        { node: "ispa", title: "ISP-A: 203.0.113.0/24", columns: pathCols, rows: [] },
        {
          node: "r1",
          title: "R1: 192.0.2.0/24",
          columns: ["", "AS_PATH", "LocPrf"],
          rows: [
            [">", "64500 64496", "200"],
            ["", "64510 64496", "100"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Out via ISP-A, back via ISP-B", hi: "Bahar ISP-A se, wapas ISP-B se" },
      text: {
        en: "The web server sends to 192.0.2.10 and R1 forwards it to ISP-A, as LOCAL_PREF decided. The reply follows AS 64496's own choice and comes back through ISP-B. LOCAL_PREF controls only traffic leaving AS 65001, so the routing is asymmetric and the 200 Mbps link carries every inbound packet.",
        hi: "Web server 192.0.2.10 ko bhejta hai aur R1 use ISP-A ko forward karta hai, jaisa LOCAL_PREF ne decide kiya. Reply AS 64496 ke apne choice se ISP-B ke through wapas aata hai. LOCAL_PREF sirf AS 65001 se bahar jaane wala traffic control karta hai, isliye routing asymmetric hai aur saara inbound traffic 200 Mbps link par aa raha hai.",
      },
      packets: [
        { path: ["web", "r1", "ispa", "rem", "client"], label: "To 192.0.2.10", tone: "blue" },
        { path: ["client", "rem", "ispb", "r1", "web"], label: "Reply", tone: "green", delay: 4 },
      ],
      links: [
        { id: "l-a", state: "active", note: "outbound" },
        { id: "l-b", state: "active", note: "inbound" },
      ],
    },
    {
      title: { en: "R1 prepends its AS towards ISP-B", hi: "R1 ISP-B ki taraf apna AS prepend karta hai" },
      text: {
        en: "An outbound route-map on the ISP-B session adds 65001 three extra times, so ISP-B now receives 65001 65001 65001 65001 and passes on 64510 plus those four. AS 64496 compares two ASes via ISP-A with five via ISP-B and switches its best path to ISP-A.",
        hi: "ISP-B session par outbound route-map 65001 teen extra baar jodta hai, toh ISP-B ko ab 65001 65001 65001 65001 milta hai aur woh aage 64510 plus yeh chaar bhejta hai. AS 64496 ISP-A wale do AS ko ISP-B wale paanch AS se compare karta hai aur apna best path ISP-A par shift kar deta hai.",
      },
      packets: [
        { path: ["r1", "ispb"], label: "65001 x4", tone: "orange" },
        { path: ["ispb", "rem"], label: "64510 65001 x4", tone: "orange", delay: 1 },
      ],
      links: [
        { id: "l-a", state: "normal" },
        { id: "l-b", state: "normal" },
      ],
      tables: [
        { node: "ispb", title: "ISP-B: 203.0.113.0/24", columns: pathCols, rows: [[">", "65001 65001 65001 65001", "R1"]], hl: [0] },
        {
          node: "rem",
          title: "Remote: 203.0.113.0/24",
          columns: pathCols,
          rows: [
            [">", "64500 65001", "ISP-A"],
            ["", "64510 65001 65001 65001 65001", "ISP-B"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Inbound traffic now uses ISP-A", hi: "Ab inbound traffic ISP-A se aata hai" },
      text: {
        en: "The same request and reply now both cross the 1 Gbps link to ISP-A. The ISP-B link carries no traffic, but its session stays Established, ready to take over if ISP-A fails.",
        hi: "Wahi request aur reply ab dono ISP-A ke 1 Gbps link se jaate hain. ISP-B link par traffic nahi hai, lekin uska session Established rehta hai, taaki ISP-A fail ho toh woh sambhal le.",
      },
      packets: [
        { path: ["web", "r1", "ispa", "rem", "client"], label: "To 192.0.2.10", tone: "blue" },
        { path: ["client", "rem", "ispa", "r1", "web"], label: "Reply", tone: "green", delay: 4 },
      ],
      links: [
        { id: "l-a", state: "active", note: "both directions" },
        { id: "l-b", state: "dim", note: "backup" },
      ],
    },
    {
      title: { en: "A side effect at ISP-B", hi: "ISP-B par ek side effect" },
      text: {
        en: "AS 64496 now advertises its best path to ISP-B: 64496 64500 65001, three ASes long. With default settings ISP-B prefers it to its own four-AS direct path and stops offering that direct path, so AS 64496 is left with only the path through ISP-A. A real ISP would keep its customer route by giving it a higher LOCAL_PREF.",
        hi: "AS 64496 ab apna best path ISP-B ko advertise karta hai: 64496 64500 65001, teen AS lamba. Default settings mein ISP-B ise apne chaar AS wale direct path se behtar maanta hai aur woh direct path aage offer karna band kar deta hai, isliye AS 64496 ke paas sirf ISP-A wala path bachta hai. Real ISP apne customer route ko zyada LOCAL_PREF dekar wahi rakhta.",
      },
      packets: [
        { path: ["rem", "ispb"], label: "64496 64500 65001", tone: "orange" },
      ],
      tables: [
        {
          node: "ispb",
          title: "ISP-B: 203.0.113.0/24",
          columns: pathCols,
          rows: [
            ["", "65001 65001 65001 65001", "R1"],
            [">", "64496 64500 65001", "Remote"],
          ],
          hl: [1],
        },
        { node: "rem", title: "Remote: 203.0.113.0/24", columns: pathCols, rows: [[">", "64500 65001", "ISP-A"]] },
      ],
    },
    {
      title: { en: "Loop prevention: R1 rejects its own AS", hi: "Loop prevention: R1 apna hi AS reject karta hai" },
      text: {
        en: "ISP-B advertises its new best path to R1 with its own AS in front: 64510 64496 64500 65001. R1 finds 65001 in the AS_PATH, so this route has already passed through AS 65001, and R1 drops the Update. The session stays up; this check is what stops routing loops between ASes.",
        hi: "ISP-B apna naya best path R1 ko advertise karta hai, aage apna AS jod kar: 64510 64496 64500 65001. R1 ko AS_PATH mein 65001 dikhta hai, yaani yeh route AS 65001 se pehle hi guzar chuka hai, isliye R1 Update drop kar deta hai. Session up rehta hai; yahi check ASes ke beech routing loops rokta hai.",
      },
      focus: ["r1"],
      packets: [{ path: ["ispb", "r1"], label: "Path has 65001", tone: "red", drop: true }],
      badges: [{ node: "r1", text: "loop: dropped", tone: "red" }],
    },
  ],
};

export default scene;
