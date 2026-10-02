import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "binary-and-hex",
  intro: {
    en: "Every address a network device uses is really a string of bits. An IPv4 address is 32 bits, a MAC address is 48 and an IPv6 address is 128. People write them in decimal or hexadecimal because long rows of 1s and 0s are hard to read, but subnet masks, subnetting and ACLs all work on the bits underneath. Once you can move between binary, decimal and hex quickly, the rest of the CCNA maths becomes routine.",
    hi: "Network device jo bhi address use karta hai, woh asal mein bits ki ek line hai. IPv4 address 32 bits ka hota hai, MAC address 48 ka aur IPv6 address 128 ka. Log inhe decimal ya hexadecimal mein likhte hain kyunki 1 aur 0 ki lambi line padhna mushkil hai, lekin subnet masks, subnetting aur ACLs sab andar ke bits par hi kaam karte hain. Ek baar binary, decimal aur hex ke beech jaldi convert karna aa gaya, toh CCNA ka baaki maths routine ban jaata hai.",
  },
  outcomes: [
    { en: "Convert any number from 0 to 255 between decimal and 8-bit binary", hi: "0 se 255 tak kisi bhi number ko decimal aur 8-bit binary ke beech convert kar sako" },
    { en: "Write a full IPv4 address as 32 bits and explain why no octet can go above 255", hi: "Poore IPv4 address ko 32 bits mein likh sako aur samjha sako ki koi octet 255 se upar kyun nahi ja sakta" },
    { en: "Convert a byte to two hex digits and back (1010 1000 = A8 = 168)", hi: "Ek byte ko do hex digits mein aur wapas convert kar sako (1010 1000 = A8 = 168)" },
    { en: "Read a MAC address in Cisco, Windows and Linux formats and recognise it as the same address", hi: "MAC address ko Cisco, Windows aur Linux format mein padh sako aur pehchaan sako ki teeno same address hain" },
    { en: "Use powers of two to say how many values a group of bits can hold", hi: "Powers of two se bata sako ki kitne bits mein kitni values aa sakti hain" },
  ],
  sections: [
    {
      id: "why-bits",
      heading: { en: "Why networking needs binary and hex", hi: "Networking ko binary aur hex kyun chahiye" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A computer stores and sends everything as **bits**, and each bit is either 0 or 1. Eight bits make a **byte**, which networking people usually call an **octet**. Addresses are fixed-length groups of bits, written in a friendlier form for humans.",
            hi: "Computer sab kuch **bits** mein store aur send karta hai, aur har bit ya toh 0 hota hai ya 1. Aath bits milkar ek **byte** banate hain, jise networking wale aam taur par **octet** bolte hain. Addresses bas bits ke fixed-length groups hain, jinhe insaano ke liye aasaan form mein likha jaata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The three addresses you will meet most", hi: "Teen addresses jo sabse zyada milenge" },
          columns: ["Address", "Bits", { en: "Written in", hi: "Kisme likhte hain" }, "Example"],
          rows: [
            ["IPv4", "32", { en: "Decimal, 4 octets with dots", hi: "Decimal, dots ke saath 4 octets" }, "192.168.10.1"],
            ["MAC", "48", { en: "Hex, 12 digits", hi: "Hex, 12 digits" }, "0050.56aa.0001"],
            ["IPv6", "128", { en: "Hex, 32 digits (often shortened)", hi: "Hex, 32 digits (aksar short karke)" }, "2001:db8::1"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Decimal is for people. Binary is what devices actually compare: when a router checks whether an address belongs to a subnet, it compares bits. Hex sits in between, because it is a compact way to write binary. You need all three.",
            hi: "Decimal insaano ke liye hai. Devices asal mein binary compare karte hain: jab router check karta hai ki koi address kisi subnet ka hai ya nahi, toh woh bits compare karta hai. Hex dono ke beech mein hai, kyunki yeh binary ko chhota karke likhne ka tarika hai. Tumhe teeno aane chahiye.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "No calculator in the exam", hi: "Exam mein calculator nahi milta" },
          text: {
            en: "The CCNA exam does not allow a calculator. You get an erasable note board and a marker, so conversions have to be quick on paper. The methods on this page are the ones that hold up under time pressure.",
            hi: "CCNA exam mein calculator allowed nahi hai. Tumhe ek erasable note board aur marker milta hai, isliye conversions paper par jaldi karne aane chahiye. Is page ke methods time pressure mein bhi kaam karte hain.",
          },
        },
      ],
    },
    {
      id: "place-values",
      heading: { en: "Place values: how binary counts", hi: "Place values: binary kaise ginta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In decimal each position is worth ten times the one to its right: 1, 10, 100. The number 255 means 2 hundreds + 5 tens + 5 ones. Binary works the same way with base 2: each position is worth **double** the one to its right. One octet has eight positions, so its place values run from 128 down to 1.",
            hi: "Decimal mein har position apne right wali position se das guna hoti hai: 1, 10, 100. Number 255 ka matlab hai 2 hundreds + 5 tens + 5 ones. Binary bhi aise hi kaam karta hai, bas base 2 hai: har position apne right wali se **double** hoti hai. Ek octet mein aath positions hain, isliye uski place values 128 se 1 tak jaati hain.",
          },
        },
        {
          type: "table",
          caption: { en: "The eight place values of every octet", hi: "Har octet ki aath place values" },
          columns: ["Place value", "128", "64", "32", "16", "8", "4", "2", "1", "Total"],
          rows: [
            ["Power of 2", "2⁷", "2⁶", "2⁵", "2⁴", "2³", "2²", "2¹", "2⁰", "–"],
            [{ en: "All 0s", hi: "Saare 0" }, "0", "0", "0", "0", "0", "0", "0", "0", "0"],
            [{ en: "All 1s", hi: "Saare 1" }, "1", "1", "1", "1", "1", "1", "1", "1", "255"],
            [{ en: "Example", hi: "Example" }, "1", "1", "0", "0", "0", "0", "0", "0", "192"],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Why an octet stops at 255", hi: "Octet 255 par kyun rukta hai" },
          text: {
            en: "With all eight bits set to 1 you get 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = **255**. There is no ninth bit to go higher, so each octet of an IPv4 address runs from 0 to 255: 256 possible values. An address like `192.168.1.300` is simply invalid.",
            hi: "Aathon bits 1 kar do toh 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = **255** milta hai. Isse upar jaane ke liye nauvaan bit hai hi nahi, isliye IPv4 address ka har octet 0 se 255 tak hi jaata hai: kul 256 values. `192.168.1.300` jaisa address seedha invalid hai.",
          },
        },
      ],
    },
    {
      id: "decimal-to-binary",
      heading: { en: "Decimal to binary: subtract from the left", hi: "Decimal se binary: left se subtract karo" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Walk the place values from 128 down to 1. If what is left of your number is at least the place value, write 1 and subtract; otherwise write 0. Take **168**:",
            hi: "Place values par 128 se 1 tak chalo. Agar bacha hua number place value ke barabar ya usse bada hai, toh 1 likho aur subtract karo; warna 0 likho. **168** lo:",
          },
        },
        {
          type: "steps",
          items: [
            { en: "128: 168 is at least 128, so write **1**. 168 − 128 = 40 left.", hi: "128: 168, 128 se bada hai, toh **1** likho. 168 − 128 = 40 bache." },
            { en: "64: 40 is less than 64, so write **0**.", hi: "64: 40, 64 se chhota hai, toh **0** likho." },
            { en: "32: 40 is at least 32, so write **1**. 40 − 32 = 8 left.", hi: "32: 40, 32 se bada hai, toh **1** likho. 40 − 32 = 8 bache." },
            { en: "16: 8 is less than 16, so write **0**.", hi: "16: 8, 16 se chhota hai, toh **0** likho." },
            { en: "8: 8 is at least 8, so write **1**. 8 − 8 = 0 left.", hi: "8: bacha hua 8, place value 8 ke barabar hai, toh **1** likho. 8 − 8 = 0 bacha." },
            {
              en: "4, 2, 1: nothing is left, so write **0 0 0**. Result: 168 = `10101000`, usually written `1010 1000` so it is easier to read.",
              hi: "4, 2, 1: kuch bacha hi nahi, toh **0 0 0** likho. Result: 168 = `10101000`, jise padhne mein aasaani ke liye `1010 1000` likhte hain.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Worked examples you will see again and again", hi: "Worked examples jo baar baar dikhenge" },
          columns: ["Decimal", "Binary", { en: "Place values used", hi: "Kaunsi place values lagi" }],
          rows: [
            ["192", "1100 0000", "128 + 64"],
            ["168", "1010 1000", "128 + 32 + 8"],
            ["16", "0001 0000", "16"],
            ["10", "0000 1010", "8 + 2"],
            ["1", "0000 0001", "1"],
            ["255", "1111 1111", { en: "all eight", hi: "aathon" }],
            ["0", "0000 0000", { en: "none", hi: "koi nahi" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "A whole IPv4 address is just four octets, each converted on its own. `192.168.10.1` becomes:",
            hi: "Poora IPv4 address bas chaar octets hain, aur har octet alag se convert hota hai. `192.168.10.1` aisa banta hai:",
          },
        },
        {
          type: "code",
          lang: "text",
          title: { en: "192.168.10.1 as 32 bits", hi: "192.168.10.1, 32 bits mein" },
          code: "Decimal   192       168       10        1\nBinary    11000000  10101000  00001010  00000001",
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Keep all eight bits", hi: "Aathon bits likho" },
          text: {
            en: "Inside an address, 10 is `00001010`, not `1010`. If you drop the leading zeros, the 32 bits no longer line up, and every subnetting answer built on them will be wrong.",
            hi: "Address ke andar 10 ko `00001010` likho, `1010` nahi. Leading zeros hata doge toh 32 bits line up nahi honge, aur unpar bana har subnetting answer galat aayega.",
          },
        },
      ],
    },
    {
      id: "binary-to-decimal",
      heading: { en: "Binary to decimal: add the 1s", hi: "Binary se decimal: 1s ko jodo" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Going back is easier. Write the place values over the bits and add the ones that sit above a 1. For `0110 0100`: 64 + 32 + 4 = **100**. For `1110 0000`: 128 + 64 + 32 = **224**.",
            hi: "Wapas jaana aur aasaan hai. Bits ke upar place values likho aur jin values ke neeche 1 hai, unhe jodo. `0110 0100` ke liye: 64 + 32 + 4 = **100**. `1110 0000` ke liye: 128 + 64 + 32 = **224**.",
          },
        },
        {
          type: "p",
          text: {
            en: "One pattern is worth memorising now: octets whose 1s are all packed together on the left. Together with 0, they are the only values a subnet mask octet can take, and you will use them constantly from lesson 1.3 on.",
            hi: "Ek pattern abhi yaad kar lo: aise octets jinke saare 1 left side par ek saath hain. 0 ke alawa, subnet mask ke octet mein sirf yahi values aa sakti hain, aur lesson 1.3 se yeh baar baar kaam aayengi.",
          },
        },
        {
          type: "table",
          caption: { en: "1s filled in from the left: the mask values", hi: "Left se bhare hue 1s: mask values" },
          columns: ["Binary", "Decimal", { en: "How to get it", hi: "Kaise nikla" }],
          rows: [
            ["1000 0000", "128", "128"],
            ["1100 0000", "192", "128 + 64"],
            ["1110 0000", "224", "192 + 32"],
            ["1111 0000", "240", "224 + 16"],
            ["1111 1000", "248", "240 + 8"],
            ["1111 1100", "252", "248 + 4"],
            ["1111 1110", "254", "252 + 2"],
            ["1111 1111", "255", "254 + 1"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Three shortcuts", hi: "Teen shortcuts" },
          text: {
            en: "Any number of 128 or more has a 1 in the leftmost bit. Any odd number has a 1 in the rightmost bit. And 255 minus a number flips every bit: 255 − 192 = 63 = `0011 1111`, the exact opposite of `1100 0000`.",
            hi: "128 ya usse bade har number ka leftmost bit 1 hota hai. Har odd number ka rightmost bit 1 hota hai. Aur 255 mein se koi number ghatao toh saare bits ulat jaate hain: 255 − 192 = 63 = `0011 1111`, jo `1100 0000` ka bilkul ulta hai.",
          },
        },
      ],
    },
    {
      id: "hexadecimal",
      heading: { en: "Hexadecimal: four bits per digit", hi: "Hexadecimal: har digit mein chaar bits" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Hexadecimal (hex) is base 16. It needs sixteen digits, so after 0-9 it borrows letters: **A = 10, B = 11, C = 12, D = 13, E = 14, F = 15**. Networking uses hex because one hex digit is exactly four bits, called a **nibble**, so a byte is always exactly two hex digits. Long binary values shrink to a quarter of their length without any hard maths.",
            hi: "Hexadecimal (hex) base 16 hai. Isme solah digits chahiye, isliye 0-9 ke baad letters use hote hain: **A = 10, B = 11, C = 12, D = 13, E = 14, F = 15**. Networking mein hex isliye use hota hai kyunki ek hex digit theek chaar bits ka hota hai, jise **nibble** kehte hain, toh ek byte hamesha do hex digits ka hota hai. Lambi binary values bina mushkil maths ke chauthai length ki ho jaati hain.",
          },
        },
        {
          type: "table",
          caption: { en: "All sixteen nibbles", hi: "Saare solah nibbles" },
          columns: ["Hex", "Binary", "Decimal"],
          rows: [
            ["0", "0000", "0"],
            ["1", "0001", "1"],
            ["2", "0010", "2"],
            ["3", "0011", "3"],
            ["4", "0100", "4"],
            ["5", "0101", "5"],
            ["6", "0110", "6"],
            ["7", "0111", "7"],
            ["8", "1000", "8"],
            ["9", "1001", "9"],
            ["A", "1010", "10"],
            ["B", "1011", "11"],
            ["C", "1100", "12"],
            ["D", "1101", "13"],
            ["E", "1110", "14"],
            ["F", "1111", "15"],
          ],
        },
        {
          type: "steps",
          items: [
            { en: "Split the byte into two nibbles: `1010 1000` becomes `1010` and `1000`.", hi: "Byte ko do nibbles mein todo: `1010 1000` ke do hisse `1010` aur `1000` ban jaate hain." },
            {
              en: "Convert each nibble with the place values 8 4 2 1: `1010` = 8 + 2 = 10 = **A**, and `1000` = 8 = **8**.",
              hi: "Har nibble ko 8 4 2 1 place values se convert karo: `1010` = 8 + 2 = 10 = **A**, aur `1000` = 8 = **8**.",
            },
            {
              en: "Write the two digits side by side: `1010 1000` = **A8**. Check it: A × 16 + 8 = 160 + 8 = 168, the same number as before.",
              hi: "Dono digits saath likho: `1010 1000` = **A8**. Check karo: A × 16 + 8 = 160 + 8 = 168, wahi number jo pehle tha.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "Hex to decimal is the reverse: first digit × 16, plus the second digit. `C0` = 12 × 16 + 0 = 192. `FF` = 15 × 16 + 15 = 255. `0A` = 10. Hex to binary is even quicker: replace each digit with its nibble, so `C0` = `1100 0000`.",
            hi: "Hex se decimal ulta process hai: pehla digit × 16, plus doosra digit. `C0` = 12 × 16 + 0 = 192. `FF` = 15 × 16 + 15 = 255. `0A` = 10. Hex se binary aur bhi jaldi hota hai: har digit ki jagah uska nibble likh do, toh `C0` = `1100 0000`.",
          },
        },
        {
          type: "code",
          lang: "text",
          title: { en: "One address, three ways", hi: "Ek address, teen tarah se" },
          code: "Decimal   192       168       10        1\nBinary    11000000  10101000  00001010  00000001\nHex       C0        A8        0A        01",
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Is 10 ten or sixteen?", hi: "10 das hai ya solah?" },
          text: {
            en: "`10` in hex is sixteen, not ten. To avoid confusion, documents often write hex with a `0x` prefix: `0x10` = 16, `0xA8` = 168. You will see this in Ethernet headers, such as EtherType `0x0800` for IPv4 and `0x0806` for ARP.",
            hi: "Hex mein `10` ka matlab solah hai, das nahi. Confusion se bachne ke liye documents mein hex ke aage aksar `0x` lagate hain: `0x10` = 16, `0xA8` = 168. Ethernet headers mein yeh dikhega, jaise IPv4 ke liye EtherType `0x0800` aur ARP ke liye `0x0806`.",
          },
        },
      ],
    },
    {
      id: "mac-in-hex",
      heading: { en: "Reading MAC addresses in hex", hi: "MAC addresses ko hex mein padhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A MAC address is 48 bits. At 4 bits per hex digit that is **12 hex digits**, or 6 bytes. Different systems group those digits differently, but the address is the same. Upper or lower case makes no difference either.",
            hi: "MAC address 48 bits ka hota hai. 4 bits per hex digit ke hisaab se yeh **12 hex digits** hue, yaani 6 bytes. Alag systems in digits ko alag tarah se group karte hain, lekin address wahi rehta hai. Capital ya small letters se bhi koi fark nahi padta.",
          },
        },
        {
          type: "table",
          caption: { en: "One MAC address, three spellings", hi: "Ek MAC address, teen tarah se likha hua" },
          columns: [{ en: "Where you see it", hi: "Kahan dikhta hai" }, "Grouping", "Example"],
          rows: [
            ["Cisco IOS", { en: "3 groups of 4, dots", hi: "4-4 ke 3 groups, dots" }, "0050.56aa.0001"],
            ["Windows", { en: "6 pairs, hyphens", hi: "6 pairs, hyphens" }, "00-50-56-AA-00-01"],
            ["Linux / macOS", { en: "6 pairs, colons", hi: "6 pairs, colons" }, "00:50:56:aa:00:01"],
          ],
        },
        {
          type: "cli",
          title: { en: "A MAC in hex and an IPv4 address in decimal, on a PC and a router", hi: "PC aur router par hex mein MAC aur decimal mein IPv4 address" },
          lines: [
            { prompt: "C:\\>", cmd: "ipconfig /all" },
            { out: "   Physical Address. . . . . . . . . : 00-50-56-AA-00-01", comment: { en: "Windows: pairs with hyphens, capital letters", hi: "Windows: hyphens ke saath pairs, capital letters" } },
            { out: "   IPv4 Address. . . . . . . . . . . : 192.168.10.25(Preferred)", comment: { en: "The IPv4 address is shown in decimal", hi: "IPv4 address decimal mein dikhta hai" } },
            { prompt: "R1#", cmd: "show interfaces GigabitEthernet0/0 | include address is" },
            {
              out: "  Hardware is CN Gigabit Ethernet, address is 0011.2233.4401 (bia 0011.2233.4401)",
              comment: { en: "Cisco: three groups of four; bia = burned-in address", hi: "Cisco: chaar-chaar ke teen groups; bia = burned-in address" },
            },
            { out: "  Internet address is 192.168.10.1/24" },
          ],
          note: {
            en: "You will learn the Cisco CLI in lesson 0.8. For now, just find the hex MAC and the decimal IPv4 address in each output. The \"Hardware is\" text differs between router models.",
            hi: "Cisco CLI tum lesson 0.8 mein seekhoge. Abhi bas har output mein hex MAC aur decimal IPv4 address dhoondho. \"Hardware is\" wala text router model ke hisaab se alag hota hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "To read one byte, convert its two hex digits. In `0050.56aa.0001` the byte `aa` is `1010 1010` in binary, which is 170 in decimal. The broadcast MAC `FFFF.FFFF.FFFF` is all 48 bits set to 1. Lesson 0.7 explains what the first half of a MAC address (the vendor's OUI) means.",
            hi: "Ek byte padhne ke liye uske do hex digits convert karo. `0050.56aa.0001` mein byte `aa` binary mein `1010 1010` hai, yaani decimal mein 170. Broadcast MAC `FFFF.FFFF.FFFF` mein saare 48 bits 1 hote hain. MAC address ke pehle half (vendor ka OUI) ka matlab lesson 0.7 mein samjhaya gaya hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "IPv6 is hex too", hi: "IPv6 bhi hex hai" },
          text: {
            en: "An IPv6 address is 128 bits, written as 32 hex digits in eight groups of four, such as `2001:0db8:0000:0000:0000:0000:0000:0001`. It is usually shortened to `2001:db8::1`. The shortening rules come in lesson 1.8; the hex skill you need is the one on this page.",
            hi: "IPv6 address 128 bits ka hota hai, jo 32 hex digits mein, chaar-chaar ke aath groups mein likha jaata hai, jaise `2001:0db8:0000:0000:0000:0000:0000:0001`. Ise aam taur par short karke `2001:db8::1` likhte hain. Shortening ke rules lesson 1.8 mein aayenge; hex ki jo skill chahiye woh isi page par hai.",
          },
        },
      ],
    },
    {
      id: "powers-of-two",
      heading: { en: "Powers of two: how many values fit in n bits", hi: "Powers of two: n bits mein kitni values" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Each extra bit doubles the number of patterns. One bit gives 2 values (0, 1), two bits give 4 (00, 01, 10, 11), three bits give 8. In general **n bits give 2ⁿ values**, from 0 up to 2ⁿ − 1. That is why 8 bits give 256 values but the largest value is 255.",
            hi: "Har extra bit patterns ki ginti double kar deta hai. Ek bit se 2 values (0, 1), do bits se 4 (00, 01, 10, 11), teen bits se 8. Seedha rule: **n bits se 2ⁿ values** milti hain, 0 se lekar 2ⁿ − 1 tak. Isiliye 8 bits se 256 values milti hain, par sabse badi value 255 hoti hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Learn this table by heart", hi: "Yeh table zabaani yaad karo" },
          columns: ["n", "2ⁿ", { en: "Where you will use it", hi: "Kahan kaam aayega" }],
          rows: [
            ["1", "2", { en: "A single on/off flag", hi: "Ek on/off flag" }],
            ["2", "4", { en: "Subnets from 2 borrowed bits", hi: "2 borrowed bits se subnets" }],
            ["3", "8", { en: "Subnets from 3 borrowed bits", hi: "3 borrowed bits se subnets" }],
            ["4", "16", { en: "Values of one hex digit", hi: "Ek hex digit ki values" }],
            ["5", "32", { en: "Addresses in a /27 subnet", hi: "/27 subnet ke addresses" }],
            ["6", "64", { en: "Addresses in a /26 subnet", hi: "/26 subnet ke addresses" }],
            ["7", "128", { en: "Place value of an octet's leftmost bit", hi: "Octet ke leftmost bit ki place value" }],
            ["8", "256", { en: "Values in one octet (0-255)", hi: "Ek octet ki values (0-255)" }],
            ["9", "512", { en: "Addresses in a /23", hi: "/23 ke addresses" }],
            ["10", "1024", { en: "Addresses in a /22", hi: "/22 ke addresses" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Some rows mention subnets such as /27. You will meet them properly in lessons 1.3 and 1.5. For now, notice that every number is double the one above it, so you can rebuild the table in seconds on the note board.",
            hi: "Kuch rows mein /27 jaise subnets ka zikr hai. Inse theek se mulaqat lesson 1.3 aur 1.5 mein hogi. Abhi bas dhyan do ki har number apne upar wale ka double hai, toh note board par yeh table kuch seconds mein dobara bana sakte ho.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Where this shows up", hi: "Yeh kahan kaam aata hai" },
          text: {
            en: "Subnetting questions come down to this table. \"How many subnets?\" is 2 to the power of the borrowed bits. \"How many hosts?\" is 2 to the power of the host bits, minus 2. You will practise both in lesson 1.5.",
            hi: "Subnetting ke questions asal mein isi table par tike hain. \"Kitne subnets?\" = 2 ki power borrowed bits. \"Kitne hosts?\" = 2 ki power host bits, minus 2. Dono ki practice lesson 1.5 mein karoge.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Bit", def: { en: "The smallest unit of data: a single 0 or 1.", hi: "Data ki sabse chhoti unit: ek akela 0 ya 1." } },
    { term: "Octet", def: { en: "A group of 8 bits (a byte). An IPv4 address has four octets.", hi: "8 bits ka group (ek byte). IPv4 address mein chaar octets hote hain." } },
    { term: "Place value", def: { en: "What a digit is worth because of its position. In an octet: 128, 64, 32, 16, 8, 4, 2, 1.", hi: "Kisi digit ki woh value jo uski position se aati hai. Octet mein: 128, 64, 32, 16, 8, 4, 2, 1." } },
    { term: "Dotted decimal", def: { en: "The usual way to write IPv4: four octets in decimal separated by dots, like 192.168.10.1.", hi: "IPv4 likhne ka normal tarika: chaar octets decimal mein, dots se alag, jaise 192.168.10.1." } },
    { term: "Hexadecimal", def: { en: "Base 16, using digits 0-9 and A-F. One hex digit represents 4 bits.", hi: "Base 16, jisme digits 0-9 aur A-F hote hain. Ek hex digit 4 bits ko represent karta hai." } },
    { term: "Nibble", def: { en: "Half a byte: 4 bits, which is exactly one hex digit.", hi: "Aadha byte: 4 bits, jo theek ek hex digit ke barabar hai." } },
    { term: "Power of two", def: { en: "2 multiplied by itself n times (2ⁿ). It is the number of different values n bits can hold.", hi: "2 ko n baar khud se multiply karna (2ⁿ). Yahi n bits mein aane wali alag values ki ginti hai." } },
  ],
  commands: [
    { cmd: "ipconfig /all", mode: "Windows command prompt", does: { en: "Show the PC's MAC (Physical Address) in hex and its IPv4 settings in decimal", hi: "PC ka MAC (Physical Address) hex mein aur IPv4 settings decimal mein dikhata hai" } },
    { cmd: "ip addr", mode: "Linux terminal", does: { en: "Show each interface's MAC (link/ether) and IPv4 address (inet)", hi: "Har interface ka MAC (link/ether) aur IPv4 address (inet) dikhata hai" } },
    { cmd: "show interfaces GigabitEthernet0/0", mode: "Cisco user or privileged EXEC", does: { en: "Show an interface's details, including its MAC address in Cisco dotted hex", hi: "Interface ki details dikhata hai, uska MAC address bhi Cisco dotted hex mein" } },
  ],
  mistakes: [
    {
      en: "Dropping leading zeros inside an address. In an octet, 10 is `00001010`, not `1010`; every octet is exactly 8 bits.",
      hi: "Address ke andar leading zeros hata dena. Octet mein 10 ko `00001010` likhte hain, `1010` nahi; har octet theek 8 bits ka hota hai.",
    },
    {
      en: "Writing the place values from the wrong end. The leftmost bit of an octet is worth 128 and the rightmost is worth 1.",
      hi: "Place values ulti taraf se likhna. Octet ka leftmost bit 128 ka hota hai aur rightmost 1 ka.",
    },
    {
      en: "Reading hex `10` as ten. In hex it is sixteen, which is why documents write it as `0x10`.",
      hi: "Hex `10` ko das padhna. Hex mein yeh solah hai, isiliye documents ise `0x10` likhte hain.",
    },
    {
      en: "Confusing the number of values with the largest value. 8 bits give 256 values, but the largest is 255 because counting starts at 0.",
      hi: "Values ki ginti aur sabse badi value ko mix karna. 8 bits se 256 values milti hain, lekin sabse badi 255 hai kyunki ginti 0 se shuru hoti hai.",
    },
    {
      en: "Thinking `0050.56aa.0001` and `00-50-56-AA-00-01` are different MAC addresses. Only the grouping and the letter case differ.",
      hi: "Yeh sochna ki `0050.56aa.0001` aur `00-50-56-AA-00-01` alag MAC addresses hain. Sirf grouping aur letters ka case alag hai.",
    },
    {
      en: "Converting a hex byte as one big number. Work nibble by nibble: split `A8` into `A` and `8`, turn each into 4 bits, then join them: `1010 1000`.",
      hi: "Hex byte ko ek bade number ki tarah convert karna. Nibble by nibble chalo: `A8` ko `A` aur `8` mein todo, dono ko 4-4 bits mein badlo, phir jodo: `1010 1000`.",
    },
  ],
  recap: [
    { en: "Octet place values: 128 64 32 16 8 4 2 1. All 1s = 255, so no octet can go higher.", hi: "Octet ki place values: 128 64 32 16 8 4 2 1. Saare 1 = 255, isliye koi octet isse upar nahi jaata." },
    { en: "Decimal to binary: subtract place values from the left. Binary to decimal: add the place values above each 1.", hi: "Decimal se binary: left se place values subtract karo. Binary se decimal: har 1 ke upar wali place values jodo." },
    { en: "An IPv4 address is 32 bits in 4 octets; always write all 8 bits of each octet.", hi: "IPv4 address 4 octets mein 32 bits ka hai; har octet ke aathon bits hamesha likho." },
    { en: "Hex digits are 0-9 and A-F. One hex digit = 4 bits, so one byte = 2 hex digits (1010 1000 = A8 = 168).", hi: "Hex digits 0-9 aur A-F hain. Ek hex digit = 4 bits, toh ek byte = 2 hex digits (1010 1000 = A8 = 168)." },
    { en: "A MAC is 48 bits = 12 hex digits; 0050.56aa.0001, 00-50-56-AA-00-01 and 00:50:56:aa:00:01 are the same address.", hi: "MAC 48 bits = 12 hex digits ka hota hai; 0050.56aa.0001, 00-50-56-AA-00-01 aur 00:50:56:aa:00:01 ek hi address hain." },
    { en: "n bits hold 2ⁿ values: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024.", hi: "n bits mein 2ⁿ values aati hain: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024." },
  ],
  quiz: [
    {
      q: { en: "What is 172 in 8-bit binary?", hi: "172 ko 8-bit binary mein kya likhenge?" },
      options: [
        { en: "1010 1100", hi: "1010 1100" },
        { en: "1011 0100", hi: "1011 0100" },
        { en: "1100 1010", hi: "1100 1010" },
        { en: "1010 1010", hi: "1010 1010" },
      ],
      answer: 0,
      explain: {
        en: "172 − 128 = 44, 44 − 32 = 12, 12 − 8 = 4, 4 − 4 = 0. The 1s sit under 128, 32, 8 and 4: `1010 1100`. `1010 1010` is 170, the value of the MAC byte `aa`.",
        hi: "172 − 128 = 44, 44 − 32 = 12, 12 − 8 = 4, 4 − 4 = 0. 1s 128, 32, 8 aur 4 ke neeche aate hain: `1010 1100`. `1010 1010` toh 170 hai, jo MAC byte `aa` ki value hai.",
      },
      kind: "calc",
    },
    {
      q: { en: "What is `1110 0000` in decimal?", hi: "`1110 0000` decimal mein kitna hai?" },
      options: [
        { en: "192", hi: "192" },
        { en: "240", hi: "240" },
        { en: "224", hi: "224" },
        { en: "112", hi: "112" },
      ],
      answer: 2,
      explain: {
        en: "128 + 64 + 32 = 224. 192 has only two leading 1s and 240 has four. 112 is `0111 0000`, the same three 1s shifted one place to the right.",
        hi: "128 + 64 + 32 = 224. 192 mein sirf do leading 1s hote hain aur 240 mein chaar. 112 `0111 0000` hai, yaani wahi teen 1s ek jagah right khiske hue.",
      },
      kind: "calc",
    },
    {
      q: { en: "Why can no octet of an IPv4 address be higher than 255?", hi: "IPv4 address ka koi bhi octet 255 se bada kyun nahi ho sakta?" },
      options: [
        { en: "Routers are configured to reject higher values", hi: "Routers badi values reject karne ke liye configure hote hain" },
        { en: "An octet has 8 bits, and all 8 bits set to 1 equal 255", hi: "Octet mein 8 bits hote hain, aur saare 8 bits 1 hon toh 255 banta hai" },
        { en: "Values above 255 are reserved for multicast", hi: "255 se upar ki values multicast ke liye reserved hain" },
        { en: "The subnet mask limits each octet to 255", hi: "Subnet mask har octet ko 255 tak limit karta hai" },
      ],
      answer: 1,
      explain: {
        en: "It is a limit of the bits, not a rule someone chose. Eight bits can hold 2⁸ = 256 patterns, numbered 0 to 255. There is no ninth bit to make 256.",
        hi: "Yeh bits ki limit hai, kisi ka banaya rule nahi. Aath bits mein 2⁸ = 256 patterns aa sakte hain, jinke number 0 se 255 tak hain. 256 banane ke liye nauvaan bit hai hi nahi.",
      },
      kind: "concept",
    },
    {
      q: { en: "What is decimal 200 in hexadecimal?", hi: "Decimal 200 ko hexadecimal mein kya likhenge?" },
      options: [
        { en: "8C", hi: "8C" },
        { en: "20", hi: "20" },
        { en: "D0", hi: "D0" },
        { en: "C8", hi: "C8" },
      ],
      answer: 3,
      explain: {
        en: "200 = `1100 1000`. The nibbles are `1100` = 12 = C and `1000` = 8, so 200 = C8. Check: 12 × 16 + 8 = 200. D0 would be 13 × 16 = 208.",
        hi: "200 = `1100 1000`. Nibbles hain `1100` = 12 = C aur `1000` = 8, toh 200 = C8. Check: 12 × 16 + 8 = 200. D0 hota toh 13 × 16 = 208 aata.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "A Cisco switch shows the MAC address `0050.56aa.0001`. Which value in Windows `ipconfig /all` is the same address?",
        hi: "Cisco switch MAC address `0050.56aa.0001` dikhata hai. Windows `ipconfig /all` mein kaunsi value yahi address hai?",
      },
      options: [
        { en: "00-05-65-AA-00-01", hi: "00-05-65-AA-00-01" },
        { en: "00-50-56-AA-00-10", hi: "00-50-56-AA-00-10" },
        { en: "00-50-56-AA-00-01", hi: "00-50-56-AA-00-01" },
        { en: "50-56-AA-00-01-00", hi: "50-56-AA-00-01-00" },
      ],
      answer: 2,
      explain: {
        en: "Keep the 12 hex digits in order and regroup them in pairs: 00 50 56 aa 00 01. Windows uses hyphens and capital letters, but the digits and their order never change.",
        hi: "12 hex digits ko usi order mein rakho aur pairs mein group karo: 00 50 56 aa 00 01. Windows hyphens aur capital letters use karta hai, lekin digits aur unka order kabhi nahi badalta.",
      },
      kind: "scenario",
    },
    {
      q: { en: "How many different values can a 5-bit field hold?", hi: "5-bit field mein kitni alag values aa sakti hain?" },
      options: [
        { en: "25", hi: "25" },
        { en: "32", hi: "32" },
        { en: "31", hi: "31" },
        { en: "10", hi: "10" },
      ],
      answer: 1,
      explain: {
        en: "n bits hold 2ⁿ values, so 5 bits hold 2⁵ = 32 values: 00000 to 11111, or 0 to 31. 31 is the largest value, not the number of values.",
        hi: "n bits mein 2ⁿ values aati hain, toh 5 bits mein 2⁵ = 32 values: 00000 se 11111 tak, yaani 0 se 31. 31 sabse badi value hai, values ki ginti nahi.",
      },
      kind: "calc",
    },
  ],
  videos: [
    {
      id: "RrJXLdv1i74",
      title: "Binary - The SIMPLEST explanation of Counting and Converting Binary numbers",
      channel: "Practical Networking",
      lang: "en",
      note: {
        en: "Builds binary up from decimal, then shows fast conversions both ways. The same method as this page.",
        hi: "Decimal se shuru karke binary samjhata hai, phir dono taraf fast conversion dikhata hai. Is page wala hi method hai.",
      },
    },
    {
      id: "bqF0zoGTaY0",
      title: "Hexadecimal to Decimal made EASY!",
      channel: "David Bombal",
      lang: "en",
      note: {
        en: "Hex to decimal conversions worked step by step, from his free CCNA course.",
        hi: "Hex se decimal conversions step by step, unke free CCNA course se.",
      },
    },
    {
      id: "5M4ivtA-Uno",
      title: "28. Decimal to Binary Conversion Made Easy | Unique Explanation in Hindi",
      channel: "NetworkPath",
      lang: "hi",
      note: {
        en: "Explains why binary counts the way it does, then converts decimal to binary.",
        hi: "Pehle samjhata hai ki binary aise kyun ginta hai, phir decimal se binary convert karta hai.",
      },
    },
    {
      id: "UGlHEVXsvtc",
      title: "How to Convert Binary to Hexadecimal and / or Hexadecimal to Binary | IPV6 in Hindi",
      channel: "JagvinderThind",
      lang: "hi",
      note: {
        en: "Binary to hex and back, nibble by nibble, with the IPv6 use case.",
        hi: "Binary se hex aur wapas, nibble by nibble, IPv6 ke use case ke saath.",
      },
    },
  ],
  lab: {
    title: { en: "Conversion drills on your own PC", hi: "Apne PC par conversion practice" },
    steps: [
      {
        en: "On paper, convert 172, 16, 254 and 99 to binary with the subtraction method. Then check each one in Windows Calculator's Programmer mode, which shows HEX, DEC, OCT and BIN together.",
        hi: "Paper par 172, 16, 254 aur 99 ko subtraction method se binary mein convert karo. Phir har ek ko Windows Calculator ke Programmer mode mein check karo, jo HEX, DEC, OCT aur BIN ek saath dikhata hai.",
      },
      {
        en: "Run `ipconfig /all` on Windows or `ip addr` on Linux. Write your IPv4 address as 32 bits, octet by octet, keeping all eight bits of each octet.",
        hi: "Windows par `ipconfig /all` ya Linux par `ip addr` chalao. Apna IPv4 address octet by octet 32 bits mein likho, har octet ke aathon bits ke saath.",
      },
      {
        en: "Find your MAC address in the same output and rewrite it in the other two formats: Cisco dotted and Linux colons.",
        hi: "Usi output mein apna MAC address dhoondho aur use baaki do formats mein likho: Cisco dotted aur Linux colons.",
      },
      {
        en: "Take the last byte of your MAC, convert it to binary and to decimal by hand, and check the result in the calculator.",
        hi: "Apne MAC ka last byte lo, use haath se binary aur decimal mein convert karo, aur result calculator mein check karo.",
      },
      {
        en: "In Packet Tracer, add a 2911 router, open its CLI tab, answer `no` to the setup dialog and run `show interfaces GigabitEthernet0/0`. Find the `address is` line and rewrite that MAC in Windows format.",
        hi: "Packet Tracer mein ek 2911 router lagao, uska CLI tab kholo, setup dialog ko `no` bolo aur `show interfaces GigabitEthernet0/0` chalao. `address is` wali line dhoondho aur us MAC ko Windows format mein likho.",
      },
    ],
  },
};

export default lesson;
