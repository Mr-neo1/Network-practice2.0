import type { LayersScene } from "../types.ts";

// One address, 2001:0db8:0000:00a0:0000:0000:0000:0100, shortened rule by rule,
// expanded back, then split into prefix and interface ID.
// Tones: gray = hextet as written, green = shortened by rule 1, purple = all-zero hextets / ::,
// red = invalid, blue = network prefix, teal = subnet ID, orange = interface ID.

const scene: LayersScene = {
  kind: "layers",
  id: "ipv6-basics",
  title: { en: "Shortening an IPv6 address, then reading its prefix", hi: "IPv6 address ko shorten karna, phir uska prefix padhna" },
  stack: ["Full address", "Rule 1", "Rule 2", "Expand", "Prefix"],
  steps: [
    {
      title: { en: "128 bits written as 8 hextets", hi: "128 bits, 8 hextets mein likhe hue" },
      text: {
        en: "An IPv6 address is 128 bits. In hex that is 32 digits, written as 8 hextets of 4 digits with colons between them. This one is 2001:0db8:0000:00a0:0000:0000:0000:0100.",
        hi: "IPv6 address 128 bits ka hota hai. Hex mein yeh 32 digits bante hain, jo 4-4 digits ke 8 hextets mein likhe jaate hain, beech mein colons. Yeh address hai 2001:0db8:0000:00a0:0000:0000:0000:0100.",
      },
      stackActive: "Full address",
      rows: [
        {
          label: "Full",
          blocks: [
            { id: "h1", label: "2001", sub: "hextet 1", tone: "gray" },
            { id: "h2", label: "0db8", sub: "hextet 2", tone: "gray" },
            { id: "h3", label: "0000", sub: "hextet 3", tone: "gray" },
            { id: "h4", label: "00a0", sub: "hextet 4", tone: "gray" },
            { id: "h5", label: "0000", sub: "hextet 5", tone: "gray" },
            { id: "h6", label: "0000", sub: "hextet 6", tone: "gray" },
            { id: "h7", label: "0000", sub: "hextet 7", tone: "gray" },
            { id: "h8", label: "0100", sub: "hextet 8", tone: "gray" },
          ],
        },
      ],
    },
    {
      title: { en: "One hextet is 16 bits", hi: "Ek hextet 16 bits ka hai" },
      text: {
        en: "Zoom into hextet 4, 00a0. Each hex digit is exactly 4 bits, so 0, 0, a, 0 become 0000 0000 1010 0000: 16 bits. 8 hextets × 16 bits = 128 bits.",
        hi: "Hextet 4, yaani 00a0, ko zoom karke dekho. Har hex digit exactly 4 bits ka hai, toh 0, 0, a, 0 ban jaate hain 0000 0000 1010 0000: 16 bits. 8 hextets × 16 bits = 128 bits.",
      },
      stackActive: "Full address",
      focus: ["h4"],
      rows: [
        {
          label: "Full",
          blocks: [
            { id: "h1", label: "2001", sub: "hextet 1", tone: "gray" },
            { id: "h2", label: "0db8", sub: "hextet 2", tone: "gray" },
            { id: "h3", label: "0000", sub: "hextet 3", tone: "gray" },
            { id: "h4", label: "00a0", sub: "hextet 4", tone: "gray" },
            { id: "h5", label: "0000", sub: "hextet 5", tone: "gray" },
            { id: "h6", label: "0000", sub: "hextet 6", tone: "gray" },
            { id: "h7", label: "0000", sub: "hextet 7", tone: "gray" },
            { id: "h8", label: "0100", sub: "hextet 8", tone: "gray" },
          ],
        },
        {
          label: "Hextet 4 in bits",
          blocks: [
            { id: "b1", label: "0000", sub: "hex 0", tone: "teal" },
            { id: "b2", label: "0000", sub: "hex 0", tone: "teal" },
            { id: "b3", label: "1010", sub: "hex a", tone: "teal" },
            { id: "b4", label: "0000", sub: "hex 0", tone: "teal" },
          ],
        },
      ],
    },
    {
      title: { en: "Rule 1: drop leading zeros", hi: "Rule 1: leading zeros hatao" },
      text: {
        en: "In every hextet, delete the zeros at the front: 0db8 becomes db8, 00a0 becomes a0 and 0100 becomes 100. Zeros at the end stay, because they carry value: a0 is not a, and 100 is not 1.",
        hi: "Har hextet ke aage wale zeros hata do: 0db8 ban gaya db8, 00a0 ban gaya a0 aur 0100 ban gaya 100. Peeche ke zeros rehte hain, kyunki unki value hai: a0 ko a nahi likh sakte, aur 100 ko 1 nahi.",
      },
      stackActive: "Rule 1",
      focus: ["h2", "h4", "h8"],
      rows: [
        {
          label: "Rule 1",
          blocks: [
            { id: "h1", label: "2001", sub: "no change", tone: "gray" },
            { id: "h2", label: "db8", sub: "was 0db8", tone: "green" },
            { id: "h3", label: "0000", sub: "hextet 3", tone: "gray" },
            { id: "h4", label: "a0", sub: "was 00a0", tone: "green" },
            { id: "h5", label: "0000", sub: "hextet 5", tone: "gray" },
            { id: "h6", label: "0000", sub: "hextet 6", tone: "gray" },
            { id: "h7", label: "0000", sub: "hextet 7", tone: "gray" },
            { id: "h8", label: "100", sub: "was 0100", tone: "green" },
          ],
        },
      ],
    },
    {
      title: { en: "An all-zero hextet becomes 0", hi: "All-zero hextet 0 ban jaata hai" },
      text: {
        en: "Rule 1 works on 0000 too: drop the leading zeros and a single 0 is left. The address now reads 2001:db8:0:a0:0:0:0:100, still 8 hextets.",
        hi: "Rule 1 0000 par bhi lagta hai: leading zeros hatao toh ek 0 bachta hai. Ab address hai 2001:db8:0:a0:0:0:0:100, abhi bhi 8 hextets.",
      },
      stackActive: "Rule 1",
      focus: ["h3", "h5", "h6", "h7"],
      rows: [
        {
          label: "Rule 1",
          blocks: [
            { id: "h1", label: "2001", sub: "hextet 1", tone: "gray" },
            { id: "h2", label: "db8", sub: "hextet 2", tone: "green" },
            { id: "h3", label: "0", sub: "was 0000", tone: "purple" },
            { id: "h4", label: "a0", sub: "hextet 4", tone: "green" },
            { id: "h5", label: "0", sub: "was 0000", tone: "purple" },
            { id: "h6", label: "0", sub: "was 0000", tone: "purple" },
            { id: "h7", label: "0", sub: "was 0000", tone: "purple" },
            { id: "h8", label: "100", sub: "hextet 8", tone: "green" },
          ],
        },
      ],
    },
    {
      title: { en: "Find the longest run of zeros", hi: "Zeros ka sabse lamba run dhoondho" },
      text: {
        en: "Rule 2 lets you replace one run of consecutive all-zero hextets with ::. There are two runs here: hextet 3 on its own, and hextets 5 to 7. Pick the longest run.",
        hi: "Rule 2 kehta hai ki lagataar all-zero hextets ke ek run ko :: se replace kar sakte ho. Yahan do runs hain: hextet 3 akela, aur hextets 5 se 7. Sabse lamba run chuno.",
      },
      stackActive: "Rule 2",
      focus: ["h5", "h6", "h7"],
      rows: [
        {
          label: "Runs",
          blocks: [
            { id: "h1", label: "2001", sub: "hextet 1", tone: "gray" },
            { id: "h2", label: "db8", sub: "hextet 2", tone: "green" },
            { id: "h3", label: "0", sub: "run of 1", tone: "purple" },
            { id: "h4", label: "a0", sub: "hextet 4", tone: "green" },
            { id: "h5", label: "0", sub: "run of 3", tone: "purple" },
            { id: "h6", label: "0", sub: "run of 3", tone: "purple" },
            { id: "h7", label: "0", sub: "run of 3", tone: "purple" },
            { id: "h8", label: "100", sub: "hextet 8", tone: "green" },
          ],
        },
      ],
    },
    {
      title: { en: "Rule 2: the run becomes ::", hi: "Rule 2: run :: ban jaata hai" },
      text: {
        en: "Hextets 5 to 7 collapse into ::. Hextet 3 stays as 0, because :: may appear only once. The shortest form is 2001:db8:0:a0::100.",
        hi: "Hextets 5 se 7 milkar :: ban jaate hain. Hextet 3 0 hi rehta hai, kyunki :: sirf ek baar aa sakta hai. Shortest form hai 2001:db8:0:a0::100.",
      },
      stackActive: "Rule 2",
      focus: ["dc", "res"],
      rows: [
        {
          label: "Rule 2",
          blocks: [
            { id: "h1", label: "2001", sub: "hextet 1", tone: "gray" },
            { id: "h2", label: "db8", sub: "hextet 2", tone: "green" },
            { id: "h3", label: "0", sub: "stays 0", tone: "purple" },
            { id: "h4", label: "a0", sub: "hextet 4", tone: "green" },
            { id: "dc", label: "::", sub: "= 3 × 0000", tone: "purple", w: 1.6 },
            { id: "h8", label: "100", sub: "hextet 8", tone: "green" },
          ],
        },
        { label: "Short form", blocks: [{ id: "res", label: "2001:db8:0:a0::100", sub: "shortest valid form", tone: "green", w: 6 }] },
      ],
    },
    {
      title: { en: "Why :: is allowed only once", hi: ":: sirf ek baar kyun" },
      text: {
        en: "Write :: twice, as in 2001:db8::a0::100, and 4 zero hextets are missing with no way to tell how they split: 1 + 3, 2 + 2 or 3 + 1. Those are three different addresses, so a double :: is invalid.",
        hi: "Agar :: do baar likho, jaise 2001:db8::a0::100, toh 4 zero hextets gayab hain aur pata hi nahi chalega ki woh kaise bante: 1 + 3, 2 + 2 ya 3 + 1. Yeh teen alag addresses hain, isliye double :: invalid hai.",
      },
      stackActive: "Rule 2",
      focus: ["bad"],
      rows: [
        { label: "Valid", blocks: [{ id: "res", label: "2001:db8:0:a0::100", sub: "one ::", tone: "green", w: 6 }] },
        { label: "Invalid", blocks: [{ id: "bad", label: "2001:db8::a0::100", sub: "two :: = ambiguous", tone: "red", w: 6 }] },
        {
          label: "Could mean",
          blocks: [
            { id: "o1", label: "1 + 3", sub: "2001:db8:0:a0:0:0:0:100", tone: "gray", w: 2 },
            { id: "o2", label: "2 + 2", sub: "2001:db8:0:0:a0:0:0:100", tone: "gray", w: 2 },
            { id: "o3", label: "3 + 1", sub: "2001:db8:0:0:0:a0:0:100", tone: "gray", w: 2 },
          ],
        },
      ],
    },
    {
      title: { en: "Expanding back to the full form", hi: "Wapas full form mein expand karna" },
      text: {
        en: "To expand, count the hextets you can see: 5. So :: stands for 8 − 5 = 3 hextets of 0000. Pad every hextet back to 4 digits with leading zeros, and the full address is back.",
        hi: "Expand karne ke liye dikhne wale hextets gino: 5. Toh :: 8 − 5 = 3 hextets ki jagah hai, sab 0000. Har hextet ko aage zeros lagakar 4 digits ka karo, aur full address wapas mil gaya.",
      },
      stackActive: "Expand",
      focus: ["f5", "f6", "f7"],
      rows: [
        {
          label: "Short",
          blocks: [
            { id: "s1", label: "2001", sub: "1", tone: "gray" },
            { id: "s2", label: "db8", sub: "2", tone: "gray" },
            { id: "s3", label: "0", sub: "3", tone: "gray" },
            { id: "s4", label: "a0", sub: "4", tone: "gray" },
            { id: "sdc", label: "::", sub: "8 − 5 = 3 hextets", tone: "purple", w: 1.6 },
            { id: "s8", label: "100", sub: "5", tone: "gray" },
          ],
        },
        {
          label: "Full",
          blocks: [
            { id: "f1", label: "2001", sub: "as is", tone: "gray" },
            { id: "f2", label: "0db8", sub: "padded", tone: "green" },
            { id: "f3", label: "0000", sub: "padded", tone: "green" },
            { id: "f4", label: "00a0", sub: "padded", tone: "green" },
            { id: "f5", label: "0000", sub: "from ::", tone: "purple" },
            { id: "f6", label: "0000", sub: "from ::", tone: "purple" },
            { id: "f7", label: "0000", sub: "from ::", tone: "purple" },
            { id: "f8", label: "0100", sub: "padded", tone: "green" },
          ],
        },
      ],
    },
    {
      title: { en: "/64: prefix and interface ID", hi: "/64: prefix aur interface ID" },
      text: {
        en: "With /64, hextets 1 to 4 (the first 64 bits) are the network prefix and hextets 5 to 8 are the interface ID. Every host on this LAN shares 2001:db8:0:a0::/64; the interface ID 0000:0000:0000:0100 names this one host.",
        hi: "/64 mein hextets 1 se 4 (pehle 64 bits) network prefix hain aur hextets 5 se 8 interface ID. Is LAN ke saare hosts 2001:db8:0:a0::/64 share karte hain; interface ID 0000:0000:0000:0100 is ek host ki pehchaan hai.",
      },
      stackActive: "Prefix",
      focus: ["net", "iid"],
      rows: [
        {
          label: "Address /64",
          blocks: [
            { id: "f1", label: "2001", sub: "prefix", tone: "blue" },
            { id: "f2", label: "0db8", sub: "prefix", tone: "blue" },
            { id: "f3", label: "0000", sub: "prefix", tone: "blue" },
            { id: "f4", label: "00a0", sub: "prefix", tone: "blue" },
            { id: "f5", label: "0000", sub: "interface ID", tone: "orange" },
            { id: "f6", label: "0000", sub: "interface ID", tone: "orange" },
            { id: "f7", label: "0000", sub: "interface ID", tone: "orange" },
            { id: "f8", label: "0100", sub: "interface ID", tone: "orange" },
          ],
        },
        {
          label: "Meaning",
          blocks: [
            { id: "net", label: "2001:db8:0:a0::/64", sub: "network prefix: 64 bits", tone: "blue", w: 4 },
            { id: "iid", label: "0000:0000:0000:0100", sub: "interface ID: 64 bits", tone: "orange", w: 4 },
          ],
        },
      ],
    },
    {
      title: { en: "Zoom out: /48 site and subnet ID", hi: "Zoom out: /48 site aur subnet ID" },
      text: {
        en: "The ISP gave this site 2001:db8::/48, the first 3 hextets. Hextet 4 is the subnet ID the site chooses for each LAN, a0 here. 16 bits of subnet ID allow 65,536 separate /64 LANs.",
        hi: "ISP ne is site ko 2001:db8::/48 diya, yaani pehle 3 hextets. Hextet 4 subnet ID hai jo site har LAN ke liye khud chunti hai, yahan a0. 16 bits ke subnet ID se 65,536 alag /64 LANs ban sakte hain.",
      },
      stackActive: "Prefix",
      focus: ["site", "subid"],
      rows: [
        {
          label: "Address /64",
          blocks: [
            { id: "f1", label: "2001", sub: "site /48", tone: "blue" },
            { id: "f2", label: "0db8", sub: "site /48", tone: "blue" },
            { id: "f3", label: "0000", sub: "site /48", tone: "blue" },
            { id: "f4", label: "00a0", sub: "subnet ID", tone: "teal" },
            { id: "f5", label: "0000", sub: "interface ID", tone: "orange" },
            { id: "f6", label: "0000", sub: "interface ID", tone: "orange" },
            { id: "f7", label: "0000", sub: "interface ID", tone: "orange" },
            { id: "f8", label: "0100", sub: "interface ID", tone: "orange" },
          ],
        },
        {
          label: "Meaning",
          blocks: [
            { id: "site", label: "2001:db8::/48", sub: "global routing prefix", tone: "blue", w: 3 },
            { id: "subid", label: "a0", sub: "16-bit subnet ID", tone: "teal", w: 1 },
            { id: "iid", label: "0000:0000:0000:0100", sub: "interface ID: 64 bits", tone: "orange", w: 4 },
          ],
        },
      ],
    },
  ],
};

export default scene;
