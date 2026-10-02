import type { BitsScene } from "../types.ts";

const scene: BitsScene = {
  kind: "bits",
  id: "vlsm",
  title: { en: "VLSM: carving 192.168.1.0/24 largest first", hi: "VLSM: 192.168.1.0/24 ko largest first kaatna" },
  steps: [
    {
      title: { en: "One /24, five different needs", hi: "Ek /24, paanch alag zarooratein" },
      text: {
        en: "The block is 192.168.1.0/24: 256 addresses, 8 host bits. The needs, already sorted largest first, are on the right: three LANs and two router-to-router WAN links. Every subnet will be cut from this one block.",
        hi: "Block 192.168.1.0/24 hai: 256 addresses, 8 host bits. Right side par zarooratein hain, pehle se sabse bade se sort ki hui: teen LANs aur do router-to-router WAN links. Har subnet isi ek block se kaata jaayega.",
      },
      prefix: 24,
      rows: [
        { label: "Block", ip: "192.168.1.0", note: "/24" },
        { label: "Mask /24", ip: "255.255.255.0" },
      ],
      results: [
        { label: "LAN A", value: "100 hosts" },
        { label: "LAN B", value: "50 hosts" },
        { label: "LAN C", value: "20 hosts" },
        { label: "WAN 1, WAN 2", value: "2 hosts each" },
      ],
    },
    {
      title: { en: "LAN A: 100 hosts needs a /25", hi: "LAN A: 100 hosts ke liye /25" },
      text: {
        en: "6 host bits give 2⁶ − 2 = 62, too few. 7 host bits give 2⁷ − 2 = 126, enough, so LAN A is a /25 (255.255.255.128). The orange host bits run from all 0 (.0) to all 1 (.127). LAN A takes the start of the block.",
        hi: "6 host bits se 2⁶ − 2 = 62 milte hain, kam hain. 7 host bits se 2⁷ − 2 = 126, kaafi hain, toh LAN A /25 (255.255.255.128) hai. Orange host bits sab 0 (.0) se sab 1 (.127) tak jaate hain. LAN A block ki shuruaat le leta hai.",
      },
      prefix: 25,
      mark: [25, 31],
      rows: [
        { label: "LAN A net", ip: "192.168.1.0" },
        { label: "Mask /25", ip: "255.255.255.128" },
        { label: "Broadcast", ip: "192.168.1.127" },
      ],
      results: [
        { label: "LAN A /25", value: "192.168.1.0 – .127" },
        { label: "Next free", value: "192.168.1.128" },
      ],
    },
    {
      title: { en: "LAN B: 50 hosts needs a /26", hi: "LAN B: 50 hosts ke liye /26" },
      text: {
        en: "2⁶ − 2 = 62 covers 50, so LAN B is a /26 (block 64). It starts at the next free address, .128. The last 6 bits of 128 are all 0, so .128 is a valid /26 network address. LAN B runs .128 to .191.",
        hi: "2⁶ − 2 = 62, 50 ko cover kar leta hai, toh LAN B /26 (block 64) hai. Yeh next free address .128 se shuru hota hai. 128 ke last 6 bits sab 0 hain, isliye .128 valid /26 network address hai. LAN B .128 se .191 tak hai.",
      },
      prefix: 26,
      mark: [26, 31],
      rows: [
        { label: "LAN B net", ip: "192.168.1.128" },
        { label: "Mask /26", ip: "255.255.255.192" },
        { label: "Broadcast", ip: "192.168.1.191" },
      ],
      results: [
        { label: "LAN A /25", value: "192.168.1.0 – .127" },
        { label: "LAN B /26", value: "192.168.1.128 – .191" },
        { label: "Next free", value: "192.168.1.192" },
      ],
    },
    {
      title: { en: "LAN C: 20 hosts needs a /27", hi: "LAN C: 20 hosts ke liye /27" },
      text: {
        en: "2⁴ − 2 = 14 is too small; 2⁵ − 2 = 30 fits 20. LAN C is a /27 (block 32) starting at .192, whose last 5 bits are 0. It runs .192 to .223.",
        hi: "2⁴ − 2 = 14 chhota pad jaata hai; 2⁵ − 2 = 30 mein 20 fit ho jaate hain. LAN C /27 (block 32) hai, .192 se shuru, jiske last 5 bits 0 hain. Yeh .192 se .223 tak hai.",
      },
      prefix: 27,
      mark: [27, 31],
      rows: [
        { label: "LAN C net", ip: "192.168.1.192" },
        { label: "Mask /27", ip: "255.255.255.224" },
        { label: "Broadcast", ip: "192.168.1.223" },
      ],
      results: [
        { label: "LAN A /25", value: "192.168.1.0 – .127" },
        { label: "LAN B /26", value: "192.168.1.128 – .191" },
        { label: "LAN C /27", value: "192.168.1.192 – .223" },
        { label: "Next free", value: "192.168.1.224" },
      ],
    },
    {
      title: { en: "WAN 1: two routers need a /30", hi: "WAN 1: do routers ke liye /30" },
      text: {
        en: "A point-to-point link has just two router interfaces. 2² − 2 = 2, so it gets a /30 (block 4). WAN 1 is 192.168.1.224/30: .225 and .226 for the routers, .227 as broadcast.",
        hi: "Point-to-point link par sirf do router interfaces hote hain. 2² − 2 = 2, toh ise /30 (block 4) milta hai. WAN 1 192.168.1.224/30 hai: routers ke liye .225 aur .226, aur .227 broadcast.",
      },
      prefix: 30,
      mark: [30, 31],
      rows: [
        { label: "WAN 1 net", ip: "192.168.1.224" },
        { label: "Mask /30", ip: "255.255.255.252" },
        { label: "Broadcast", ip: "192.168.1.227" },
      ],
      results: [
        { label: "LAN A /25", value: "192.168.1.0 – .127" },
        { label: "LAN B /26", value: "192.168.1.128 – .191" },
        { label: "LAN C /27", value: "192.168.1.192 – .223" },
        { label: "WAN 1 /30", value: "192.168.1.224 – .227" },
        { label: "Next free", value: "192.168.1.228" },
      ],
    },
    {
      title: { en: "WAN 2: the next block of 4", hi: "WAN 2: agla 4 ka block" },
      text: {
        en: "WAN 2 takes the next /30: 192.168.1.228, with .229 and .230 usable and .231 as broadcast. 228 is a multiple of 4, so the last 2 bits are 0 and it lines up.",
        hi: "WAN 2 agla /30 leta hai: 192.168.1.228, jisme .229 aur .230 usable hain aur .231 broadcast. 228, 4 ka multiple hai, isliye last 2 bits 0 hain aur yeh boundary par baithta hai.",
      },
      prefix: 30,
      mark: [30, 31],
      rows: [
        { label: "WAN 2 net", ip: "192.168.1.228" },
        { label: "Mask /30", ip: "255.255.255.252" },
        { label: "Broadcast", ip: "192.168.1.231" },
      ],
      results: [
        { label: "LAN A /25", value: "192.168.1.0 – .127" },
        { label: "LAN B /26", value: "192.168.1.128 – .191" },
        { label: "LAN C /27", value: "192.168.1.192 – .223" },
        { label: "WAN 1 /30", value: "192.168.1.224 – .227" },
        { label: "WAN 2 /30", value: "192.168.1.228 – .231" },
        { label: "Next free", value: "192.168.1.232" },
      ],
    },
    {
      title: { en: "What is left: .232 to .255", hi: "Kya bacha: .232 se .255" },
      text: {
        en: "All five needs fit in .0 to .231 with no overlaps. The last 4 bits are marked: .240 ends in 0000, so it can start a /28, but .232 ends in 1000, so the biggest block it can start is a /29. The 24 free addresses are 192.168.1.232/29 plus 192.168.1.240/28.",
        hi: "Paancho zarooratein .0 se .231 mein fit ho gayi, koi overlap nahi. Last 4 bits marked hain: .240 ke last 4 bits 0000 hain, toh woh /28 shuru kar sakta hai, lekin .232 ke 1000 hain, toh woh zyada se zyada /29 shuru kar sakta hai. 24 free addresses = 192.168.1.232/29 aur 192.168.1.240/28.",
      },
      mark: [28, 31],
      rows: [
        { label: "Free /29", ip: "192.168.1.232", note: ".232 – .239" },
        { label: "Free /28", ip: "192.168.1.240", note: ".240 – .255" },
      ],
      results: [
        { label: "LAN A /25", value: "192.168.1.0 – .127" },
        { label: "LAN B /26", value: "192.168.1.128 – .191" },
        { label: "LAN C /27", value: "192.168.1.192 – .223" },
        { label: "WANs /30", value: ".224 – .227, .228 – .231" },
        { label: "Free", value: ".232/29, .240/28" },
      ],
    },
    {
      title: { en: "Why largest first: the wrong order", hi: "Largest first kyun: galat order" },
      text: {
        en: "Suppose LAN C had been placed first at 192.168.1.0/27. The next free address is .32, but under a /25 mask its 7 host bits are 0100000, not all 0, so .32 is not a /25 network. The /25 that contains it is 192.168.1.0/25, which overlaps LAN C.",
        hi: "Maan lo LAN C pehle 192.168.1.0/27 par rakh diya. Next free address .32 hai, lekin /25 mask ke saath iske 7 host bits 0100000 hain, sab 0 nahi, toh .32 /25 network nahi hai. Jis /25 mein yeh aata hai woh 192.168.1.0/25 hai, jo LAN C se overlap karta hai.",
      },
      prefix: 25,
      mark: [25, 31],
      rows: [
        { label: "LAN C first", ip: "192.168.1.0", note: "/27: .0 – .31" },
        { label: "Try LAN A", ip: "192.168.1.32", note: "host bits not 0" },
        { label: "Real /25", ip: "192.168.1.0", note: ".0 – .127 overlap" },
      ],
      results: [
        { label: "192.168.1.32/25", value: "not a network address" },
        { label: "Overlap", value: ".0 – .31 in both" },
        { label: "Largest first", value: "every start is aligned" },
      ],
    },
  ],
};

export default scene;
