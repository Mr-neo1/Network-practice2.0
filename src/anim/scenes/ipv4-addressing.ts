import type { BitsScene } from "../types.ts";

const scene: BitsScene = {
  kind: "bits",
  id: "ipv4-addressing",
  title: { en: "Reading 192.168.1.10/24 bit by bit, then classes and CIDR", hi: "192.168.1.10/24 ko bit by bit padhna, phir classes aur CIDR" },
  steps: [
    {
      title: { en: "Four octets, 32 bits", hi: "Chaar octets, 32 bits" },
      text: {
        en: "PC-A's address 192.168.1.10 is really 32 bits. Each dot-separated number is one 8-bit octet: 192 = 128 + 64, 168 = 128 + 32 + 8, 1 = 1, and 10 = 8 + 2.",
        hi: "PC-A ka address 192.168.1.10 asal mein 32 bits hai. Dots ke beech ka har number ek 8-bit octet hai: 192 = 128 + 64, 168 = 128 + 32 + 8, 1 = 1, aur 10 = 8 + 2.",
      },
      placeValues: true,
      rows: [{ label: "PC-A", ip: "192.168.1.10" }],
    },
    {
      title: { en: "/24: the mask marks the network bits", hi: "/24: mask network bits ko mark karta hai" },
      text: {
        en: "The prefix /24 says the first 24 bits are the network portion (blue) and the last 8 are the host portion (orange). Written as a mask, that is 24 ones and 8 zeros: 255.255.255.0.",
        hi: "Prefix /24 batata hai ki pehle 24 bits network portion hain (blue) aur aakhri 8 host portion (orange). Mask ki shakal mein yeh 24 ones aur 8 zeros hai: 255.255.255.0.",
      },
      prefix: 24,
      rows: [
        { label: "PC-A", ip: "192.168.1.10" },
        { label: "Mask /24", ip: "255.255.255.0" },
      ],
      results: [
        { label: "Mask", value: "255.255.255.0" },
        { label: "Network bits", value: "24" },
        { label: "Host bits", value: "8" },
      ],
    },
    {
      title: { en: "Same network bits, same network", hi: "Same network bits, same network" },
      text: {
        en: "Compare the highlighted third octet. R1's 192.168.1.1 matches PC-A in all 24 network bits, so PC-A reaches it directly. 192.168.2.10 differs (00000010 vs 00000001), so it is another network and PC-A must use its default gateway.",
        hi: "Highlighted third octet ko compare karo. R1 ka 192.168.1.1 saare 24 network bits mein PC-A se match karta hai, toh PC-A use seedha reach karta hai. 192.168.2.10 alag hai (00000010 vs 00000001), yaani doosra network, isliye PC-A ko default gateway use karna padega.",
      },
      prefix: 24,
      mark: [16, 23],
      rows: [
        { label: "PC-A", ip: "192.168.1.10" },
        { label: "R1 Gi0/0", ip: "192.168.1.1", note: "same network" },
        { label: "Other host", ip: "192.168.2.10", note: "different network" },
      ],
      results: [
        { label: "192.168.1.1", value: "local: deliver directly" },
        { label: "192.168.2.10", value: "remote: send to gateway" },
      ],
    },
    {
      title: { en: "Network address: host bits all 0", hi: "Network address: saare host bits 0" },
      text: {
        en: "Keep the 24 network bits and set all 8 host bits to 0. The result, 192.168.1.0, names the network itself. It is what a routing table shows, and no host can use it.",
        hi: "24 network bits waise hi rakho aur saare 8 host bits 0 kar do. Result 192.168.1.0 network ka naam hai. Routing table mein yahi dikhta hai, aur koi host ise use nahi kar sakta.",
      },
      prefix: 24,
      mark: [24, 31],
      rows: [
        { label: "PC-A", ip: "192.168.1.10" },
        { label: "Network", ip: "192.168.1.0", note: "host bits = 00000000" },
      ],
      results: [{ label: "Network", value: "192.168.1.0/24" }],
    },
    {
      title: { en: "Broadcast address: host bits all 1", hi: "Broadcast address: saare host bits 1" },
      text: {
        en: "Now set all 8 host bits to 1: 11111111 = 255. A packet sent to 192.168.1.255 goes to every host on 192.168.1.0/24, so this address is reserved too.",
        hi: "Ab saare 8 host bits 1 kar do: 11111111 = 255. 192.168.1.255 par bheja gaya packet 192.168.1.0/24 ke har host tak jaata hai, isliye yeh address bhi reserved hai.",
      },
      prefix: 24,
      mark: [24, 31],
      rows: [
        { label: "Network", ip: "192.168.1.0", note: "host bits = 00000000" },
        { label: "Broadcast", ip: "192.168.1.255", note: "host bits = 11111111" },
      ],
      results: [
        { label: "Network", value: "192.168.1.0/24" },
        { label: "Broadcast", value: "192.168.1.255" },
      ],
    },
    {
      title: { en: "Usable hosts: 2^8 − 2 = 254", hi: "Kitne usable hosts: 2^8 − 2 = 254" },
      text: {
        en: "Everything between the two reserved addresses can go on a host or router interface: .1 to .254. Eight host bits give 2^8 = 256 addresses, minus network and broadcast, so 254 usable.",
        hi: "Dono reserved addresses ke beech ka sab kuch host ya router interface par lag sakta hai: .1 se .254 tak. Aath host bits se 2^8 = 256 addresses bante hain, network aur broadcast minus karo, toh 254 usable.",
      },
      prefix: 24,
      rows: [
        { label: "First host", ip: "192.168.1.1" },
        { label: "Last host", ip: "192.168.1.254" },
      ],
      results: [
        { label: "Network", value: "192.168.1.0/24" },
        { label: "Hosts", value: "192.168.1.1 – .254" },
        { label: "Broadcast", value: "192.168.1.255" },
        { label: "Usable", value: "254" },
      ],
    },
    {
      title: { en: "The leading bits give the class", hi: "Shuru ke bits se class pata chalti hai" },
      text: {
        en: "Look only at the highlighted first four bits. A leading 0 is class A, 10 is class B, 110 is class C and 1110 is class D (multicast). That is why each class owns a fixed range of first-octet values.",
        hi: "Sirf highlighted pehle chaar bits dekho. Shuru mein 0 hai toh class A, 10 hai toh class B, 110 toh class C, aur 1110 toh class D (multicast). Isi wajah se har class ki first octet range fixed hai.",
      },
      mark: [0, 3],
      rows: [
        { label: "Class A", ip: "10.1.1.1", note: "0..." },
        { label: "Class B", ip: "172.16.5.1", note: "10.." },
        { label: "Class C", ip: "192.168.1.10", note: "110." },
        { label: "Class D", ip: "224.0.0.5", note: "1110" },
      ],
      results: [
        { label: "A", value: "1–126, default /8" },
        { label: "B", value: "128–191, default /16" },
        { label: "C", value: "192–223, default /24" },
        { label: "D / E", value: "224–239 multicast, 240+ reserved" },
      ],
    },
    {
      title: { en: "Class B default: /16", hi: "Class B ka default: /16" },
      text: {
        en: "172.16.5.1 with its class default /16 has 16 host bits. The network is 172.16.0.0, the broadcast is 172.16.255.255, and 2^16 − 2 = 65,534 hosts fit. A shorter prefix means more host bits.",
        hi: "172.16.5.1 apne class default /16 ke saath 16 host bits rakhta hai. Network 172.16.0.0 hai, broadcast 172.16.255.255, aur 2^16 − 2 = 65,534 hosts aa sakte hain. Prefix chhota, toh host bits zyada.",
      },
      prefix: 16,
      mark: [16, 31],
      rows: [
        { label: "Host", ip: "172.16.5.1" },
        { label: "Network", ip: "172.16.0.0", note: "host bits all 0" },
        { label: "Broadcast", ip: "172.16.255.255", note: "host bits all 1" },
      ],
      results: [
        { label: "Network", value: "172.16.0.0/16" },
        { label: "Broadcast", value: "172.16.255.255" },
        { label: "Usable", value: "65,534" },
      ],
    },
    {
      title: { en: "Classless: the prefix wins", hi: "Classless: prefix hi decide karta hai" },
      text: {
        en: "10.1.1.1 is a class A number, but here it is configured with /24. The highlighted 16 bits would be host bits under the class default /8; the /24 makes them network bits. Since CIDR (1993) the prefix, not the class, sets the split: 10.1.1.0/24 with 254 hosts.",
        hi: "10.1.1.1 class A ka number hai, lekin yahan ise /24 ke saath configure kiya gaya hai. Class default /8 mein yeh highlighted 16 bits host bits hote; /24 inhe network bits bana deta hai. CIDR (1993) ke baad split prefix decide karta hai, class nahi: 10.1.1.0/24, 254 hosts ke saath.",
      },
      prefix: 24,
      mark: [8, 23],
      rows: [
        { label: "Host", ip: "10.1.1.1" },
        { label: "Mask /24", ip: "255.255.255.0" },
        { label: "Network", ip: "10.1.1.0", note: "not 10.0.0.0" },
      ],
      results: [
        { label: "Network", value: "10.1.1.0/24" },
        { label: "Broadcast", value: "10.1.1.255" },
        { label: "Usable", value: "254" },
      ],
    },
  ],
};

export default scene;
