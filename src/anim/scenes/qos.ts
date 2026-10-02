import type { TopologyScene } from "../types.ts";

// Colours: green = voice (EF), purple = video (AF41), blue = best-effort data (DF), red = a marking the switch will not trust.

const scene: TopologyScene = {
  kind: "topology",
  id: "qos",
  title: { en: "QoS at a branch: mark at the trust boundary, shape and queue at the WAN edge", hi: "Branch par QoS: trust boundary par marking, WAN edge par shaping aur queuing" },
  height: 420,
  nodes: [
    { id: "phone", kind: "ipphone", x: 90, y: 70, label: "Phone1", sub: "10.1.100.11", sub2: "voice VLAN 100" },
    { id: "vid", kind: "laptop", x: 90, y: 200, label: "Video1", sub: "10.1.20.31", sub2: "video VLAN 20" },
    { id: "pc", kind: "pc", x: 90, y: 330, label: "PC1", sub: "10.1.10.21", sub2: "data VLAN 10" },
    { id: "sw1", kind: "switch", x: 250, y: 200, label: "SW1" },
    { id: "r1", kind: "router", x: 420, y: 200, label: "R1", sub: "branch WAN edge" },
    { id: "pe", kind: "router", x: 590, y: 200, label: "ISP-PE", sub: "CIR 100 Mbps" },
    { id: "hq", kind: "cloud", x: 720, y: 200, label: "HQ", sub: "10.2.0.0/16" },
  ],
  links: [
    { id: "l-ph", a: "phone", b: "sw1", bPort: "Gi1/0/1" },
    { id: "l-vid", a: "vid", b: "sw1", bPort: "Gi1/0/2" },
    { id: "l-pc", a: "pc", b: "sw1", bPort: "Gi1/0/3" },
    { id: "l-up", a: "sw1", b: "r1", aPort: "Gi1/0/24", bPort: "Gi0/0/1", style: "trunk", label: "VLAN 10,20,100" },
    { id: "l-wan", a: "r1", b: "pe", aPort: "Gi0/0/0", label: "1 Gbps port" },
    { id: "l-hq", a: "pe", b: "hq", style: "fiber" },
  ],
  steps: [
    {
      title: { en: "Three flows share one 100 Mbps contract", hi: "Teen flows, ek 100 Mbps contract" },
      text: {
        en: "Phone1 is on a call, Video1 is in a meeting and PC1 is running a TCP backup to HQ. The LAN links run at 1 Gbps, and so does R1's Gi0/0/0, but the provider contract (CIR) is only 100 Mbps. Together the three flows offer more than 100 Mbps.",
        hi: "Phone1 call par hai, Video1 meeting mein hai aur PC1 HQ ko TCP backup bhej raha hai. LAN links 1 Gbps ke hain, R1 ka Gi0/0/0 bhi 1 Gbps ka hai, lekin provider contract (CIR) sirf 100 Mbps ka hai. Teeno flows milkar 100 Mbps se zyada bhejte hain.",
      },
      packets: [
        { path: ["phone", "sw1", "r1"], label: "Voice", tone: "green" },
        { path: ["vid", "sw1", "r1"], label: "Video", tone: "purple" },
        { path: ["pc", "sw1", "r1"], label: "Backup TCP", tone: "blue" },
      ],
      focus: ["r1", "pe"],
    },
    {
      title: { en: "No QoS: the ISP's policer drops the excess", hi: "QoS nahi: ISP ka policer excess drop karta hai" },
      text: {
        en: "R1's port is 1 Gbps, so no queue forms on R1 and it sends bursts at line rate. ISP-PE polices inbound at 100 Mbps: packets within the rate pass, and packets arriving while the rate is exceeded are dropped at once, with no buffering. The policer looks only at the rate, so voice is lost as easily as backup data.",
        hi: "R1 ka port 1 Gbps ka hai, isliye R1 par queue nahi banti aur woh line rate par bursts bhejta hai. ISP-PE inbound par 100 Mbps ka policing karta hai: rate ke andar wale packets pass hote hain, aur rate exceed hone ke time aane wale packets turant drop hote hain, koi buffering nahi. Policer sirf rate dekhta hai, isliye voice bhi utni hi aasani se drop hoti hai jitna backup data.",
      },
      packets: [
        { path: ["r1", "pe", "hq"], label: "Backup TCP", tone: "blue" },
        { path: ["r1", "pe"], label: "Voice", tone: "green", delay: 0.5, drop: true },
        { path: ["r1", "pe"], label: "Backup TCP", tone: "blue", delay: 1, drop: true },
      ],
      links: [{ id: "l-wan", state: "active", note: "bursts at 1 Gbps" }],
      badges: [{ node: "pe", text: "police: drop excess", tone: "red" }],
    },
    {
      title: { en: "SW1 trusts the phone's marking", hi: "SW1 phone ki marking trust karta hai" },
      text: {
        en: "Now QoS is configured. SW1 has detected a Cisco IP phone on Gi1/0/1 through CDP, so it trusts the phone: the trust boundary is extended to Phone1. The phone tags its voice in VLAN 100 with CoS 5 and sets DSCP EF (46) in the IP header. CoS will be gone after R1 rebuilds the frame; the DSCP travels all the way to HQ.",
        hi: "Ab QoS configure ho gaya hai. SW1 ne CDP se Gi1/0/1 par Cisco IP phone detect kiya hai, isliye woh phone ko trust karta hai: trust boundary Phone1 tak extend ho gayi. Phone VLAN 100 mein apni voice ko CoS 5 se tag karta hai aur IP header mein DSCP EF (46) set karta hai. R1 jab frame dobara banayega tab CoS chala jaayega; DSCP HQ tak jaata hai.",
      },
      reset: true,
      packets: [
        { path: ["phone", "sw1"], label: "CoS 5 / EF", tone: "green" },
        { path: ["sw1", "r1"], label: "Voice EF", tone: "green", delay: 1 },
      ],
      focus: ["phone", "sw1"],
      badges: [
        { node: "sw1", text: "trust boundary", tone: "teal" },
        { node: "phone", text: "trusted", tone: "green" },
        { node: "pe", text: "polices 100M", tone: "gray" },
      ],
      tables: [
        {
          node: "sw1",
          title: "SW1 marking",
          columns: ["Port", "Traffic", "Trust", "Sent as"],
          rows: [["Gi1/0/1", "Phone1 voice", "trusted", "EF (46)"]],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "Untrusted ports: SW1 sets the marking", hi: "Untrusted ports: marking SW1 khud set karta hai" },
      text: {
        en: "PC1's backup software marks its packets DSCP 46, hoping for the voice queue. Gi1/0/3 is untrusted, so SW1 re-marks them to DSCP 0 (DF). Video1's port is untrusted too, so SW1 classifies its traffic with NBAR and marks it AF41 (34) itself.",
        hi: "PC1 ka backup software apne packets ko DSCP 46 mark karta hai, is umeed mein ki voice queue mil jaaye. Gi1/0/3 untrusted hai, isliye SW1 unhe DSCP 0 (DF) par re-mark kar deta hai. Video1 ka port bhi untrusted hai, toh SW1 NBAR se uska traffic classify karta hai aur khud AF41 (34) mark karta hai.",
      },
      packets: [
        { path: ["pc", "sw1"], label: "DSCP 46", tone: "red" },
        { path: ["sw1", "r1"], label: "Backup DF", tone: "blue", delay: 1 },
        { path: ["vid", "sw1"], label: "Video", tone: "purple" },
        { path: ["sw1", "r1"], label: "Video AF41", tone: "purple", delay: 1.5 },
      ],
      focus: ["pc", "vid", "sw1"],
      badges: [{ node: "pc", text: "re-marked to 0", tone: "red" }],
      tables: [
        {
          node: "sw1",
          title: "SW1 marking",
          columns: ["Port", "Traffic", "Trust", "Sent as"],
          rows: [
            ["Gi1/0/1", "Phone1 voice", "trusted", "EF (46)"],
            ["Gi1/0/2", "Video1 (NBAR)", "untrusted", "AF41 (34)"],
            ["Gi1/0/3", "PC1 (sent 46)", "untrusted", "DF (0)"],
          ],
          hl: [1, 2],
        },
      ],
    },
    {
      title: { en: "R1 shapes to 100 Mbps: wait, don't drop", hi: "R1 100 Mbps par shape karta hai: drop nahi, wait" },
      text: {
        en: "R1 now shapes Gi0/0/0 to 100 Mbps. Excess traffic waits in R1's buffer and leaves at the contracted rate, so ISP-PE's policer has nothing to drop. But the shaper holds a single FIFO queue, so the voice packet leaves last, behind two backup packets and the video packet: ISP-PE drops nothing, but voice gets more delay and jitter.",
        hi: "Ab R1 Gi0/0/0 ko 100 Mbps par shape karta hai. Excess traffic R1 ke buffer mein wait karta hai aur contract wale rate par nikalta hai, isliye ISP-PE ke policer ke paas drop karne ko kuch nahi bachta. Lekin shaper ke andar ek hi FIFO queue hai, toh voice packet sabse aakhir mein nikalta hai, do backup packets aur video packet ke peeche: ISP-PE kuch drop nahi karta, lekin voice ka delay aur jitter badh jaata hai.",
      },
      packets: [
        { path: ["r1", "pe", "hq"], label: "Backup DF", tone: "blue" },
        { path: ["r1", "pe", "hq"], label: "Backup DF", tone: "blue", delay: 1 },
        { path: ["r1", "pe", "hq"], label: "Video AF41", tone: "purple", delay: 2 },
        { path: ["r1", "pe", "hq"], label: "Voice EF", tone: "green", delay: 3 },
      ],
      focus: ["r1"],
      links: [{ id: "l-wan", state: "active", note: "shaped to 100 Mbps" }],
      badges: [
        { node: "pc", text: "" },
        { node: "phone", text: "" },
        { node: "r1", text: "shape 100M, FIFO", tone: "orange" },
        { node: "pe", text: "policer: 0 drops", tone: "green" },
      ],
      tables: [
        {
          node: "r1",
          title: "Gi0/0/0 FIFO send order",
          columns: ["Order", "Packet", "DSCP"],
          rows: [
            ["1", "Backup", "DF (0)"],
            ["2", "Backup", "DF (0)"],
            ["3", "Video", "AF41 (34)"],
            ["4", "Voice", "EF (46)"],
          ],
          hl: [3],
        },
      ],
    },
    {
      title: { en: "LLQ inside the shaper: voice goes first", hi: "Shaper ke andar LLQ: voice sabse pehle" },
      text: {
        en: "The shaper now holds the LLQ policy. EF goes into the strict priority queue, which is always emptied first but policed to 20% of the shaped rate (20 Mbps). AF41 gets a CBWFQ guarantee of at least 30%, and class-default at least 25%. The voice packet now leaves ahead of video and backup.",
        hi: "Ab shaper ke andar LLQ policy hai. EF strict priority queue mein jaata hai, jo hamesha sabse pehle khaali hoti hai lekin shaped rate ke 20% (20 Mbps) par policed hai. AF41 ko CBWFQ se kam se kam 30% ki guarantee milti hai, aur class-default ko kam se kam 25%. Ab voice packet video aur backup se pehle nikalta hai.",
      },
      packets: [
        { path: ["r1", "pe", "hq"], label: "Voice EF", tone: "green" },
        { path: ["r1", "pe", "hq"], label: "Video AF41", tone: "purple", delay: 1 },
        { path: ["r1", "pe", "hq"], label: "Backup DF", tone: "blue", delay: 2 },
      ],
      focus: ["r1"],
      badges: [{ node: "r1", text: "shape 100M + LLQ", tone: "green" }],
      tables: [
        { node: "r1", title: "Gi0/0/0 FIFO send order", columns: ["Order", "Packet", "DSCP"], rows: [] },
        {
          node: "r1",
          title: "Gi0/0/0 queues (inside shaper)",
          columns: ["Queue", "Match", "Scheduling"],
          rows: [
            ["VOICE (priority)", "EF", "always first, max 20%"],
            ["VIDEO (CBWFQ)", "AF41", "min 30%"],
            ["class-default", "everything else", "min 25%, WRED"],
          ],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "WRED drops a backup packet early", hi: "WRED ek backup packet pehle hi drop karta hai" },
      text: {
        en: "More backup sessions start and class-default's average depth passes the WRED minimum threshold. WRED drops one backup packet at random, before the queue is full. Only that TCP session slows down, so the sessions do not all back off together. Voice in the priority queue is untouched.",
        hi: "Aur backup sessions shuru hote hain aur class-default ki average depth WRED ka minimum threshold paar kar jaati hai. WRED queue full hone se pehle ek backup packet random drop karta hai. Sirf woh TCP session slow hota hai, isliye saare sessions ek saath back off nahi karte. Priority queue mein voice ko kuch nahi hota.",
      },
      packets: [
        { path: ["pc", "sw1", "r1"], label: "Backup DF", tone: "blue", drop: true },
        { path: ["phone", "sw1", "r1", "pe", "hq"], label: "Voice EF", tone: "green", delay: 0.5 },
      ],
      focus: ["r1"],
      badges: [{ node: "r1", text: "WRED early drop", tone: "orange" }],
      tables: [
        {
          node: "r1",
          title: "Gi0/0/0 queues (inside shaper)",
          columns: ["Queue", "Match", "Scheduling"],
          rows: [
            ["VOICE (priority)", "EF", "always first, max 20%"],
            ["VIDEO (CBWFQ)", "AF41", "min 30%"],
            ["class-default", "everything else", "min 25%, WRED dropping"],
          ],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "End to end: voice within its targets", hi: "End to end: voice apne targets ke andar" },
      text: {
        en: "All three flows reach HQ. Nothing is dropped by the ISP's policer, the backup gives way under congestion, and voice keeps low delay and jitter because it was marked at the trust boundary and queued first at the one place where congestion happens. The values in the table are an example measurement.",
        hi: "Teeno flows HQ tak pahunchte hain. ISP ka policer kuch drop nahi karta, congestion mein backup peeche rehta hai, aur voice ka delay aur jitter kam rehta hai kyunki use trust boundary par mark kiya gaya aur ussi ek jagah pehle queue kiya gaya jahan congestion hota hai. Table ki values ek example measurement hain.",
      },
      packets: [
        { path: ["phone", "sw1", "r1", "pe", "hq"], label: "Voice EF", tone: "green" },
        { path: ["vid", "sw1", "r1", "pe", "hq"], label: "Video AF41", tone: "purple", delay: 0.5 },
        { path: ["pc", "sw1", "r1", "pe", "hq"], label: "Backup DF", tone: "blue", delay: 1 },
      ],
      focus: ["hq"],
      badges: [
        { node: "r1", text: "shape 100M + LLQ", tone: "green" },
        { node: "hq", text: "voice OK", tone: "green" },
      ],
      tables: [
        {
          node: "hq",
          title: "Voice at HQ (example)",
          columns: ["Metric", "Measured", "Target"],
          rows: [
            ["One-way delay", "40 ms", "<= 150 ms"],
            ["Jitter", "3 ms", "<= 30 ms"],
            ["Loss", "0%", "<= 1%"],
          ],
        },
      ],
    },
  ],
};

export default scene;
