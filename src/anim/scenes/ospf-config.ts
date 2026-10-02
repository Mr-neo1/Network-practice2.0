import type { TopologyScene } from "../types.ts";

// Four routers on one Ethernet segment, 10.0.0.0/24, all Gi0/0 in area 0, network type broadcast.
// Router IDs 1.1.1.1 to 4.4.4.4 (set with router-id). R2 has `ip ospf priority 0`; the others keep the default 1.
// Matches src/content/lessons/ospf-config.ts.
// Colours: purple = Hello (224.0.0.5), orange = database exchange and LSUs, red = failure.
// Badges: green = DR, blue = BDR, gray = DROTHER.

const NBR_COLS = ["Neighbor ID", "Pri", "State", "Dead Time"];
const ELECT_COLS = ["Router", "Priority", "Router ID", "Role"];

const scene: TopologyScene = {
  kind: "topology",
  id: "ospf-config",
  title: { en: "DR/BDR election on one Ethernet segment, and what happens when the DR fails", hi: "Ek Ethernet segment par DR/BDR election, aur DR fail hone par kya hota hai" },
  height: 420,
  nodes: [
    { id: "r1", kind: "router", x: 140, y: 90, label: "R1", sub: "RID 1.1.1.1", sub2: "10.0.0.1 pri 1" },
    { id: "r2", kind: "router", x: 660, y: 90, label: "R2", sub: "RID 2.2.2.2", sub2: "10.0.0.2 pri 0" },
    { id: "sw1", kind: "switch", x: 400, y: 200, label: "SW1", sub: "10.0.0.0/24" },
    { id: "r3", kind: "router", x: 140, y: 310, label: "R3", sub: "RID 3.3.3.3", sub2: "10.0.0.3 pri 1" },
    { id: "r4", kind: "router", x: 660, y: 310, label: "R4", sub: "RID 4.4.4.4", sub2: "10.0.0.4 pri 1" },
  ],
  links: [
    { id: "l1", a: "r1", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/1" },
    { id: "l2", a: "r2", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/2" },
    { id: "l3", a: "r3", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/3" },
    { id: "l4", a: "r4", b: "sw1", aPort: "Gi0/0", bPort: "Gi0/4" },
  ],
  steps: [
    {
      title: { en: "Four routers share one Ethernet segment", hi: "Chaar routers ek Ethernet segment par" },
      text: {
        en: "Each router's Gi0/0 is in 10.0.0.0/24 and in area 0. Ethernet uses the broadcast network type, so these routers will elect a DR and a BDR. Under each router you can see its router ID and its interface priority: R2 was set to priority 0, the others keep the default of 1.",
        hi: "Har router ka Gi0/0, 10.0.0.0/24 mein aur area 0 mein hai. Ethernet par broadcast network type hota hai, isliye yeh routers ek DR aur ek BDR elect karenge. Har router ke neeche uska router ID aur interface priority likhi hai: R2 par priority 0 set ki gayi hai, baaki default 1 par hain.",
      },
      focus: ["r1", "r2", "r3", "r4"],
      tables: [{ node: "r1", title: "R1: show ip ospf neighbor", columns: NBR_COLS, rows: [["(none yet)", "", "", ""]] }],
    },
    {
      title: { en: "Hellos to 224.0.0.5: everyone reaches 2-WAY", hi: "224.0.0.5 par Hellos: sab 2-WAY tak" },
      text: {
        en: "R1 sends a Hello to 224.0.0.5 and SW1 delivers it to R2, R3 and R4. Every router does the same every 10 seconds. Each one finds its own RID in the others' Hellos, so R1 lists all three neighbours as 2-WAY. No DR is known yet: the routers wait 40 seconds, the wait timer, to hear everyone before they elect.",
        hi: "R1, 224.0.0.5 par Hello bhejta hai aur SW1 use R2, R3 aur R4 tak pahuncha deta hai. Har router har 10 second mein yahi karta hai. Sabko doosron ke Hellos mein apna RID dikhta hai, isliye R1 teeno neighbours ko 2-WAY mein dikhata hai. Abhi koi DR nahi hai: routers 40 second (wait timer) tak sabko sunte hain, phir election karte hain.",
      },
      packets: [
        { path: ["r1", "sw1"], label: "Hello 224.0.0.5", tone: "purple" },
        { path: ["sw1", "r2"], label: "Hello 224.0.0.5", tone: "purple", delay: 1 },
        { path: ["sw1", "r3"], label: "Hello 224.0.0.5", tone: "purple", delay: 1 },
        { path: ["sw1", "r4"], label: "Hello 224.0.0.5", tone: "purple", delay: 1 },
      ],
      tables: [
        {
          node: "r1",
          title: "R1: show ip ospf neighbor",
          columns: NBR_COLS,
          rows: [
            ["2.2.2.2", "0", "2WAY", "00:00:37"],
            ["3.3.3.3", "1", "2WAY", "00:00:39"],
            ["4.4.4.4", "1", "2WAY", "00:00:35"],
          ],
          hl: [0, 1, 2],
        },
      ],
    },
    {
      title: { en: "Election: priority first, then router ID", hi: "Election: pehle priority, phir router ID" },
      text: {
        en: "R2 has priority 0, so it can never be DR or BDR. R1, R3 and R4 tie at priority 1, so the highest router ID wins: R4 (4.4.4.4) becomes DR and R3 (3.3.3.3) becomes BDR. R1 and R2 are DROTHERs. Every router works this out from the same Hellos, so they all agree, and from now on R4's Hellos (shown here) and everyone else's carry DR 10.0.0.4 and BDR 10.0.0.3.",
        hi: "R2 ki priority 0 hai, toh woh kabhi DR ya BDR nahi ban sakta. R1, R3 aur R4 ki priority 1 par tie hai, toh sabse bada router ID jeetta hai: R4 (4.4.4.4) DR banta hai aur R3 (3.3.3.3) BDR. R1 aur R2 DROTHERs hain. Har router same Hellos se yahi calculate karta hai, isliye sab agree karte hain, aur ab se R4 ke Hellos (jo yahan dikh rahe hain) aur baaki sabke Hellos mein DR 10.0.0.4 aur BDR 10.0.0.3 likha hota hai.",
      },
      packets: [
        { path: ["r4", "sw1"], label: "Hello DR=R4", tone: "purple" },
        { path: ["sw1", "r1"], label: "Hello DR=R4", tone: "purple", delay: 1 },
        { path: ["sw1", "r2"], label: "Hello DR=R4", tone: "purple", delay: 1 },
        { path: ["sw1", "r3"], label: "Hello DR=R4", tone: "purple", delay: 1 },
      ],
      badges: [
        { node: "r4", text: "DR", tone: "green" },
        { node: "r3", text: "BDR", tone: "blue" },
        { node: "r1", text: "DROTHER", tone: "gray" },
        { node: "r2", text: "DROTHER", tone: "gray" },
      ],
      tables: [
        {
          node: "sw1",
          title: "Election on 10.0.0.0/24",
          columns: ELECT_COLS,
          rows: [
            ["R4", "1", "4.4.4.4", "DR"],
            ["R3", "1", "3.3.3.3", "BDR"],
            ["R1", "1", "1.1.1.1", "DROTHER"],
            ["R2", "0", "2.2.2.2", "DROTHER (never DR)"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "DROTHERs go FULL with the DR and BDR only", hi: "DROTHERs sirf DR aur BDR se FULL" },
      text: {
        en: "The DR and BDR, R4 and R3, go FULL with each other. R1 exchanges DBDs, LSRs and LSUs with R4 and with R3 and reaches FULL with both. R2 does the same. R1 and R2 never exchange databases with each other and stay 2-WAY, which is correct. That makes 5 adjacencies instead of the 6 a full mesh of four routers would need.",
        hi: "DR aur BDR, yaani R4 aur R3, aapas mein FULL hote hain. R1, R4 aur R3 dono ke saath DBDs, LSRs aur LSUs exchange karta hai aur dono se FULL ho jaata hai. R2 bhi yahi karta hai. R1 aur R2 aapas mein database exchange nahi karte aur 2-WAY par hi rehte hain, aur yahi sahi hai. Isse 5 adjacencies banti hain, jabki chaar routers ke full mesh mein 6 chahiye hoti.",
      },
      packets: [
        { path: ["r3", "sw1", "r4"], label: "DB exchange", tone: "orange" },
        { path: ["r1", "sw1", "r4"], label: "DB exchange", tone: "orange" },
        { path: ["r1", "sw1", "r3"], label: "DB exchange", tone: "orange" },
        { path: ["r2", "sw1", "r4"], label: "DB exchange", tone: "orange", delay: 1 },
        { path: ["r2", "sw1", "r3"], label: "DB exchange", tone: "orange", delay: 1 },
      ],
      tables: [
        {
          node: "r1",
          title: "R1: show ip ospf neighbor",
          columns: NBR_COLS,
          rows: [
            ["2.2.2.2", "0", "2WAY/DROTHER", "00:00:34"],
            ["3.3.3.3", "1", "FULL/BDR", "00:00:37"],
            ["4.4.4.4", "1", "FULL/DR", "00:00:39"],
          ],
          hl: [1, 2],
        },
      ],
    },
    {
      title: { en: "Updates go to the DR, the DR floods them", hi: "Updates DR ko, DR unhe flood karta hai" },
      text: {
        en: "R1's LAN on Gi0/1, 10.1.1.0/24, comes up. R1 puts its new Router LSA in an LSU and sends it to 224.0.0.6, the address only the DR and BDR listen on. SW1 delivers the frame to every port, and R2 discards it. The DR, R4, then floods the LSU to 224.0.0.5 so every router gets it. The BDR heard the first copy too, so it is ready to take over.",
        hi: "R1 ka Gi0/1 wala LAN, 10.1.1.0/24, up hua. R1 apna naya Router LSA ek LSU mein daal kar 224.0.0.6 par bhejta hai, jis address ko sirf DR aur BDR sunte hain. SW1 frame ko har port par deliver karta hai, aur R2 use discard kar deta hai. Phir DR, yaani R4, LSU ko 224.0.0.5 par flood karta hai taaki har router ko mil jaaye. BDR ne pehli copy bhi suni thi, isliye woh takeover ke liye ready hai.",
      },
      focus: ["r1", "r4"],
      packets: [
        { path: ["r1", "sw1"], label: "LSU 224.0.0.6", tone: "orange" },
        { path: ["sw1", "r4"], label: "LSU 224.0.0.6", tone: "orange", delay: 1 },
        { path: ["sw1", "r3"], label: "LSU 224.0.0.6", tone: "orange", delay: 1 },
        { path: ["sw1", "r2"], label: "LSU 224.0.0.6", tone: "orange", delay: 1, drop: true },
        { path: ["r4", "sw1"], label: "LSU 224.0.0.5", tone: "orange", delay: 2 },
        { path: ["sw1", "r1"], label: "LSU 224.0.0.5", tone: "orange", delay: 3 },
        { path: ["sw1", "r2"], label: "LSU 224.0.0.5", tone: "orange", delay: 3 },
        { path: ["sw1", "r3"], label: "LSU 224.0.0.5", tone: "orange", delay: 3 },
      ],
    },
    {
      title: { en: "The DR fails", hi: "DR fail ho gaya" },
      text: {
        en: "R4 loses power and its Hellos stop. R1, R2 and R3 are still connected to SW1, and their own ports stay up, so nothing tells them at once. They notice only when R4's dead timer runs out, 40 seconds after its last Hello. Meanwhile R3's Hellos keep arriving as normal.",
        hi: "R4 ki power chali gayi aur uske Hellos band ho gaye. R1, R2 aur R3 abhi bhi SW1 se jude hain aur unke apne ports up hain, isliye unhe turant kuch pata nahi chalta. Unhe tab pata chalta hai jab R4 ka dead timer khatam hota hai, uske last Hello ke 40 second baad. Is beech R3 ke Hellos normal aate rehte hain.",
      },
      links: [{ id: "l4", state: "down" }],
      packets: [
        { path: ["r3", "sw1"], label: "Hello", tone: "purple" },
        { path: ["sw1", "r1"], label: "Hello", tone: "purple", delay: 1 },
        { path: ["sw1", "r2"], label: "Hello", tone: "purple", delay: 1 },
      ],
      badges: [{ node: "r4", text: "failed", tone: "red" }],
      tables: [
        {
          node: "r1",
          title: "R1: show ip ospf neighbor",
          columns: NBR_COLS,
          rows: [
            ["2.2.2.2", "0", "2WAY/DROTHER", "00:00:33"],
            ["3.3.3.3", "1", "FULL/BDR", "00:00:38"],
            ["4.4.4.4", "1", "FULL/DR", "00:00:00"],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "BDR becomes DR; a new BDR is elected", hi: "BDR DR ban gaya; naya BDR elect hua" },
      text: {
        en: "R4 is declared down. R3, the BDR, takes over as DR straight away; there is no new DR election and no new database exchange with R3. Only the BDR role is re-elected: R2 has priority 0, so R1 becomes BDR. R1 and R2 were only 2-WAY, so they now exchange databases and go FULL.",
        hi: "R4 down declare ho gaya. BDR yaani R3 turant DR ban jaata hai; naya DR election nahi hota aur R3 ke saath dobara database exchange bhi nahi. Sirf BDR ka election dobara hota hai: R2 ki priority 0 hai, isliye R1 BDR banta hai. R1 aur R2 abhi tak sirf 2-WAY the, isliye ab woh database exchange karke FULL ho jaate hain.",
      },
      packets: [{ path: ["r2", "sw1", "r1"], label: "DB exchange", tone: "orange" }],
      badges: [
        { node: "r3", text: "DR", tone: "green" },
        { node: "r1", text: "BDR", tone: "blue" },
      ],
      tables: [
        {
          node: "sw1",
          title: "Election on 10.0.0.0/24",
          columns: ELECT_COLS,
          rows: [
            ["R3", "1", "3.3.3.3", "DR (was BDR)"],
            ["R1", "1", "1.1.1.1", "BDR"],
            ["R2", "0", "2.2.2.2", "DROTHER (never DR)"],
            ["R4", "1", "4.4.4.4", "down"],
          ],
          hl: [0, 1],
        },
        {
          node: "r1",
          title: "R1: show ip ospf neighbor",
          columns: NBR_COLS,
          rows: [
            ["2.2.2.2", "0", "FULL/DROTHER", "00:00:36"],
            ["3.3.3.3", "1", "FULL/DR", "00:00:38"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "R4 returns: no preemption", hi: "R4 wapas aaya: preemption nahi" },
      text: {
        en: "R4 boots again. It still has the highest router ID, but a DR and a BDR already exist, and OSPF never replaces them just because a better router appears. R4 becomes a DROTHER: FULL with R3 (DR) and R1 (BDR), and 2-WAY with R2. To make R4 the DR again, you would reset OSPF on R3 and R1 with `clear ip ospf process`.",
        hi: "R4 phir se boot hota hai. Router ID abhi bhi sabse bada hai, lekin DR aur BDR pehle se maujood hain, aur OSPF sirf behtar router aane par unhe nahi hatata. R4 DROTHER banta hai: R3 (DR) aur R1 (BDR) ke saath FULL, aur R2 ke saath 2-WAY. R4 ko phir se DR banana ho, toh R3 aur R1 par `clear ip ospf process` se OSPF reset karna padega.",
      },
      links: [{ id: "l4", state: "normal" }],
      packets: [
        { path: ["r4", "sw1"], label: "Hello", tone: "purple" },
        { path: ["sw1", "r1"], label: "Hello", tone: "purple", delay: 1 },
        { path: ["sw1", "r2"], label: "Hello", tone: "purple", delay: 1 },
        { path: ["sw1", "r3"], label: "Hello", tone: "purple", delay: 1 },
        { path: ["r4", "sw1", "r3"], label: "DB exchange", tone: "orange", delay: 2 },
        { path: ["r4", "sw1", "r1"], label: "DB exchange", tone: "orange", delay: 2 },
      ],
      badges: [{ node: "r4", text: "DROTHER", tone: "gray" }],
      tables: [
        {
          node: "sw1",
          title: "Election on 10.0.0.0/24",
          columns: ELECT_COLS,
          rows: [
            ["R3", "1", "3.3.3.3", "DR"],
            ["R1", "1", "1.1.1.1", "BDR"],
            ["R2", "0", "2.2.2.2", "DROTHER (never DR)"],
            ["R4", "1", "4.4.4.4", "DROTHER"],
          ],
          hl: [3],
        },
        {
          node: "r1",
          title: "R1: show ip ospf neighbor",
          columns: NBR_COLS,
          rows: [
            ["2.2.2.2", "0", "FULL/DROTHER", "00:00:35"],
            ["3.3.3.3", "1", "FULL/DR", "00:00:37"],
            ["4.4.4.4", "1", "FULL/DROTHER", "00:00:39"],
          ],
          hl: [2],
        },
      ],
    },
  ],
};

export default scene;
