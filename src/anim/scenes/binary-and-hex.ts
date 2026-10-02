import type { BitsScene } from "../types.ts";

const scene: BitsScene = {
  kind: "bits",
  id: "binary-and-hex",
  title: { en: "Decimal, binary and hex, one octet at a time", hi: "Decimal, binary aur hex, ek ek octet karke" },
  steps: [
    {
      title: { en: "Eight bits, eight place values", hi: "Aath bits, aath place values" },
      text: {
        en: "Each bit in an octet has a place value that doubles from right to left: 1, 2, 4 and so on up to 128. All zeros is 0. All ones is 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255, the largest number one octet can hold.",
        hi: "Octet ke har bit ki ek place value hai, jo right se left double hoti jaati hai: 1, 2, 4 aur aise hi 128 tak. Saare zeros = 0. Saare ones = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255, jo ek octet ka sabse bada number hai.",
      },
      placeValues: true,
      rows: [
        { label: "All 0s", bits: "0000 0000", note: "= 0" },
        { label: "All 1s", bits: "1111 1111", note: "= 255" },
      ],
      results: [
        { label: "Smallest", value: "0" },
        { label: "Largest", value: "255" },
        { label: "Values", value: "256" },
      ],
    },
    {
      title: { en: "192 = 128 + 64", hi: "192 = 128 + 64" },
      text: {
        en: "Start at 128: 192 is at least 128, so that bit is 1 and 64 is left. 64 fills the next place exactly, so that bit is 1 too and nothing is left. The other six bits are 0.",
        hi: "128 se shuru karo: 192, 128 se bada hai, toh yeh bit 1 aur 64 bache. 64 agli place ke barabar hai, toh woh bit bhi 1 aur kuch nahi bacha. Baaki chhe bits 0 hain.",
      },
      placeValues: true,
      mark: [0, 1],
      rows: [{ label: "192", bits: "1100 0000", note: "128 + 64" }],
      results: [{ label: "192", value: "1100 0000" }],
    },
    {
      title: { en: "168: subtract as you go", hi: "168: chalte chalte subtract karo" },
      text: {
        en: "168 − 128 = 40, so the 128 bit is 1. 40 is less than 64, so 0. 40 − 32 = 8, so 1. 8 is less than 16, so 0. 8 − 8 = 0, so the 8 bit is 1 and the last three bits are 0.",
        hi: "168 − 128 = 40, toh 128 wala bit 1. 40, 64 se chhota hai, toh 0. 40 − 32 = 8, toh 1. 8, 16 se chhota hai, toh 0. 8 − 8 = 0, toh 8 wala bit 1 aur aakhri teen bits 0.",
      },
      placeValues: true,
      rows: [{ label: "168", bits: "1010 1000", note: "128 + 32 + 8" }],
      results: [
        { label: "192", value: "1100 0000" },
        { label: "168", value: "1010 1000" },
      ],
    },
    {
      title: { en: "Small numbers still use 8 bits", hi: "Chhote numbers bhi 8 bits lete hain" },
      text: {
        en: "10 is 8 + 2, so only the 8 and 2 bits are 1. Inside an address you still write all eight bits: 00001010, not 1010. The highlighted leading zeros keep every octet exactly eight bits wide, and 1 is 00000001 for the same reason.",
        hi: "10 = 8 + 2, toh sirf 8 aur 2 wale bits 1 hain. Address ke andar phir bhi aathon bits likhte hain: 00001010, sirf 1010 nahi. Highlight kiye hue leading zeros hi har octet ko poore aath bits ka rakhte hain, isiliye 1 bhi 00000001 likha jaata hai.",
      },
      placeValues: true,
      mark: [0, 3],
      rows: [
        { label: "10", bits: "0000 1010", note: "8 + 2" },
        { label: "1", bits: "0000 0001", note: "1" },
      ],
      results: [
        { label: "10", value: "0000 1010" },
        { label: "1", value: "0000 0001" },
      ],
    },
    {
      title: { en: "A full address is four octets", hi: "Poora address chaar octets hai" },
      text: {
        en: "Convert each octet on its own and keep the dots. 192.168.10.1 is 11000000.10101000.00001010.00000001: 32 bits. Every IPv4 address, mask and subnet you meet later is this same 32-bit pattern.",
        hi: "Har octet ko alag se convert karo aur dots waise hi rakho. 192.168.10.1 = 11000000.10101000.00001010.00000001, yaani 32 bits. Aage jo bhi IPv4 address, mask ya subnet milega, sab isi 32-bit pattern ke hain.",
      },
      placeValues: true,
      rows: [{ label: "192.168.10.1", ip: "192.168.10.1" }],
      results: [
        { label: "Octets", value: "192 | 168 | 10 | 1" },
        { label: "Size", value: "4 × 8 = 32 bits" },
      ],
    },
    {
      title: { en: "Binary to decimal: add the 1s", hi: "Binary se decimal: 1s ko jodo" },
      text: {
        en: "Going back, add the place values that sit above a 1. The first byte has 1s under 64, 32 and 4, so it is 100. The second has 1s under 128, 64 and 32, so it is 224.",
        hi: "Wapas jaate waqt un place values ko jodo jinke neeche 1 hai. Pehle byte mein 1s 64, 32 aur 4 ke neeche hain, toh yeh 100 hai. Doosre mein 1s 128, 64 aur 32 ke neeche hain, toh yeh 224 hai.",
      },
      placeValues: true,
      rows: [
        { label: "Byte 1", bits: "0110 0100", note: "64 + 32 + 4" },
        { label: "Byte 2", bits: "1110 0000", note: "128 + 64 + 32" },
      ],
      results: [
        { label: "Byte 1", value: "100" },
        { label: "Byte 2", value: "224" },
      ],
    },
    {
      title: { en: "1s from the left: the mask values", hi: "Left se 1s: mask values" },
      text: {
        en: "Fill an octet with 1s from the left and the totals are 128, 192, 224, 240, then 248, 252, 254 and 255. Apart from 0, these are the only values a subnet mask octet can take, so learn them now.",
        hi: "Octet ko left se 1s se bharte jao toh totals aate hain 128, 192, 224, 240, phir 248, 252, 254 aur 255. 0 ke alawa subnet mask ka octet sirf yahi values le sakta hai, isliye inhe abhi yaad kar lo.",
      },
      rows: [
        { label: "1 one", bits: "1000 0000", note: "128" },
        { label: "2 ones", bits: "1100 0000", note: "192" },
        { label: "3 ones", bits: "1110 0000", note: "224" },
        { label: "4 ones", bits: "1111 0000", note: "240" },
      ],
      results: [
        { label: "1-4 ones", value: "128, 192, 224, 240" },
        { label: "5-8 ones", value: "248, 252, 254, 255" },
      ],
    },
    {
      title: { en: "Hex: split the byte into nibbles", hi: "Hex: byte ko nibbles mein todo" },
      text: {
        en: "One hex digit stands for exactly four bits, called a nibble. Take 168 = 1010 1000. The left nibble 1010 is 8 + 2 = 10, and hex writes 10 as the single digit A.",
        hi: "Ek hex digit theek chaar bits ke barabar hota hai, jise nibble kehte hain. 168 = 1010 1000 lo. Left nibble 1010 = 8 + 2 = 10, aur hex mein 10 ko ek hi digit A likhte hain.",
      },
      mark: [0, 3],
      rows: [{ label: "168", bits: "1010 1000" }],
      results: [{ label: "1010", value: "A (10)" }],
    },
    {
      title: { en: "Right nibble, then join: A8", hi: "Right nibble, phir jodo: A8" },
      text: {
        en: "The right nibble 1000 is 8, which is also 8 in hex. Write the two digits side by side: 1010 1000 = A8. Check it: A × 16 + 8 = 160 + 8 = 168.",
        hi: "Right nibble 1000 = 8, jo hex mein bhi 8 hi hai. Dono digits saath likho: 1010 1000 = A8. Check karo: A × 16 + 8 = 160 + 8 = 168.",
      },
      mark: [4, 7],
      rows: [{ label: "168", bits: "1010 1000" }],
      results: [
        { label: "1010", value: "A (10)" },
        { label: "1000", value: "8" },
        { label: "Hex", value: "A8" },
        { label: "Check", value: "10 × 16 + 8 = 168" },
      ],
    },
    {
      title: { en: "Reading one byte of a MAC address", hi: "MAC address ka ek byte padhna" },
      text: {
        en: "The MAC address 0050.56aa.0001 is 12 hex digits, so 48 bits. Its byte aa is 1010 1010, which is 170. FF is 1111 1111, so the broadcast MAC FFFF.FFFF.FFFF is all 48 bits set to 1.",
        hi: "MAC address 0050.56aa.0001 mein 12 hex digits hain, yaani 48 bits. Iska byte aa = 1010 1010, yaani 170. FF = 1111 1111, isliye broadcast MAC FFFF.FFFF.FFFF mein saare 48 bits 1 hote hain.",
      },
      rows: [
        { label: "aa", bits: "1010 1010", note: "= 170" },
        { label: "FF", bits: "1111 1111", note: "= 255" },
      ],
      results: [
        { label: "MAC", value: "0050.56aa.0001" },
        { label: "Length", value: "12 hex digits = 48 bits" },
        { label: "aa", value: "170" },
        { label: "FF", value: "255" },
      ],
    },
  ],
};

export default scene;
