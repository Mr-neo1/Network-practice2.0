import type { BitsScene } from "../types.ts";

const scene: BitsScene = {
  kind: "bits",
  id: "subnetting",
  title: { en: "Subnetting bit by bit: a /27, then a /20", hi: "Subnetting bit by bit: pehle /27, phir /20" },
  steps: [
    {
      title: { en: "Write the address in binary", hi: "Address ko binary mein likho" },
      text: {
        en: "Every IPv4 address is 32 bits in four octets. With /27 the first three octets are all network bits, so the work happens in the fourth: 77 = 64 + 8 + 4 + 1 = 01001101.",
        hi: "Har IPv4 address 32 bits ka hota hai, chaar octets mein. /27 mein pehle teen octets poore network bits hain, toh saara kaam fourth octet mein hai: 77 = 64 + 8 + 4 + 1 = 01001101.",
      },
      placeValues: true,
      rows: [{ label: "Address", ip: "192.168.10.77" }],
    },
    {
      title: { en: "/27 means 27 network bits", hi: "/27 ka matlab 27 network bits" },
      text: {
        en: "The first 27 bits are the network part (blue); the last 5 are the host part (orange). The mask is 27 ones followed by 5 zeros: 255.255.255.224.",
        hi: "Pehle 27 bits network part hain (blue); aakhri 5 host part (orange). Mask mein 27 ones aur uske baad 5 zeros hote hain: 255.255.255.224.",
      },
      prefix: 27,
      rows: [
        { label: "Address", ip: "192.168.10.77" },
        { label: "Mask /27", ip: "255.255.255.224" },
      ],
      results: [{ label: "Mask", value: "255.255.255.224" }],
    },
    {
      title: { en: "Block size from the last network bit", hi: "Last network bit se block size" },
      text: {
        en: "The last network bit sits in the 32 place value of the fourth octet, the interesting octet. So subnets go up in blocks of 32: .0, .32, .64, .96 and so on. Block size = 256 − 224 = 32.",
        hi: "Last network bit fourth octet ki 32 wali place value par hai, yahi interesting octet hai. Isliye subnets 32 ke blocks mein badhte hain: .0, .32, .64, .96 waghera. Block size = 256 − 224 = 32.",
      },
      prefix: 27,
      mark: [26, 26],
      placeValues: true,
      rows: [
        { label: "Address", ip: "192.168.10.77" },
        { label: "Mask /27", ip: "255.255.255.224" },
      ],
      results: [
        { label: "Mask", value: "255.255.255.224" },
        { label: "Block size", value: "32" },
      ],
    },
    {
      title: { en: "Network address: host bits all 0", hi: "Network address: saare host bits 0" },
      text: {
        en: "Keep the network bits, set every host bit to 0. The three network bits of 77 are 010, worth 64, so 77 falls in the block that starts at 64 and the network is 192.168.10.64.",
        hi: "Network bits waise hi rakho, har host bit 0 kar do. 77 ke teen network bits 010 hain, jinki value 64 hai, isliye 77 us block mein aata hai jo 64 se shuru hota hai, aur network 192.168.10.64 hai.",
      },
      prefix: 27,
      mark: [27, 31],
      rows: [
        { label: "Address", ip: "192.168.10.77" },
        { label: "Network", ip: "192.168.10.64", note: "host bits = 00000" },
      ],
      results: [
        { label: "Block size", value: "32" },
        { label: "Network", value: "192.168.10.64/27" },
      ],
    },
    {
      title: { en: "Broadcast address: host bits all 1", hi: "Broadcast address: saare host bits 1" },
      text: {
        en: "Set every host bit to 1 and you get the last address of the block: 64 + 32 − 1 = 95. That is 192.168.10.95, one less than the next network, .96.",
        hi: "Har host bit 1 kar do toh block ka last address milta hai: 64 + 32 − 1 = 95. Yaani 192.168.10.95, jo agle network .96 se ek kam hai.",
      },
      prefix: 27,
      mark: [27, 31],
      rows: [
        { label: "Network", ip: "192.168.10.64", note: "host bits = 00000" },
        { label: "Broadcast", ip: "192.168.10.95", note: "host bits = 11111" },
      ],
      results: [
        { label: "Network", value: "192.168.10.64/27" },
        { label: "Broadcast", value: "192.168.10.95" },
      ],
    },
    {
      title: { en: "Usable hosts: everything in between", hi: "Usable hosts: beech ka sab kuch" },
      text: {
        en: "First usable is network + 1, last usable is broadcast − 1. With 5 host bits there are 2⁵ − 2 = 30 usable addresses.",
        hi: "First usable = network + 1, last usable = broadcast − 1. 5 host bits se 2⁵ − 2 = 30 usable addresses milte hain.",
      },
      prefix: 27,
      rows: [
        { label: "First host", ip: "192.168.10.65" },
        { label: "Last host", ip: "192.168.10.94" },
      ],
      results: [
        { label: "Network", value: "192.168.10.64/27" },
        { label: "Hosts", value: "192.168.10.65 – .94" },
        { label: "Broadcast", value: "192.168.10.95" },
        { label: "Usable", value: "30" },
      ],
    },
    {
      title: { en: "Same method, third octet: /20", hi: "Same method, third octet: /20" },
      text: {
        en: "Now 172.16.45.200/20. The mask 255.255.240.0 stops inside the third octet, so that is the interesting octet. Its last network bit is the 16 place value: block size 256 − 240 = 16, and 45 = 00101101.",
        hi: "Ab 172.16.45.200/20 lo. Mask 255.255.240.0 third octet ke andar khatam hota hai, toh interesting octet third hai. Wahan last network bit 16 wali place value par hai: block size 256 − 240 = 16, aur 45 = 00101101.",
      },
      prefix: 20,
      mark: [19, 19],
      placeValues: true,
      rows: [
        { label: "Address", ip: "172.16.45.200" },
        { label: "Mask /20", ip: "255.255.240.0" },
      ],
      results: [
        { label: "Mask", value: "255.255.240.0" },
        { label: "Interesting octet", value: "3rd" },
        { label: "Block size", value: "16 (in the 3rd octet)" },
      ],
    },
    {
      title: { en: "The fourth octet is all host bits", hi: "Fourth octet poora host bits hai" },
      text: {
        en: "The four network bits of 45 are 0010, worth 32, so 45 falls in the block 32–47. Host bits all 0 give the network 172.16.32.0; all 1 give the broadcast 172.16.47.255. The whole fourth octet is host bits, so it becomes 0 in one and 255 in the other.",
        hi: "45 ke chaar network bits 0010 hain, jinki value 32 hai, isliye 45, 32–47 wale block mein aata hai. Host bits sab 0 karo toh network 172.16.32.0; sab 1 karo toh broadcast 172.16.47.255. Poora fourth octet host bits hai, isliye ek mein 0 aur doosre mein 255 ban jaata hai.",
      },
      prefix: 20,
      mark: [20, 31],
      rows: [
        { label: "Address", ip: "172.16.45.200" },
        { label: "Network", ip: "172.16.32.0", note: "host bits all 0" },
        { label: "Broadcast", ip: "172.16.47.255", note: "host bits all 1" },
      ],
      results: [
        { label: "Network", value: "172.16.32.0/20" },
        { label: "Broadcast", value: "172.16.47.255" },
      ],
    },
    {
      title: { en: "Usable range and host count for /20", hi: "/20 ki usable range aur host count" },
      text: {
        en: "Usable hosts run from 172.16.32.1 to 172.16.47.254. There are 12 host bits, so 2¹² − 2 = 4094 usable addresses. An address like 172.16.40.0 is a normal host here: only the all-0 and all-1 host patterns are reserved.",
        hi: "Usable hosts 172.16.32.1 se 172.16.47.254 tak hain. 12 host bits hain, toh 2¹² − 2 = 4094 usable addresses. Yahan 172.16.40.0 jaisa address bhi normal host hai: sirf all-0 aur all-1 host patterns reserved hote hain.",
      },
      prefix: 20,
      rows: [
        { label: "First host", ip: "172.16.32.1" },
        { label: "Last host", ip: "172.16.47.254" },
        { label: "Also a host", ip: "172.16.40.0", note: "host bits not all 0" },
      ],
      results: [
        { label: "Network", value: "172.16.32.0/20" },
        { label: "Hosts", value: "172.16.32.1 – 172.16.47.254" },
        { label: "Broadcast", value: "172.16.47.255" },
        { label: "Usable", value: "4094" },
      ],
    },
  ],
};

export default scene;
