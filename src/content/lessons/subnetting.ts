import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "subnetting",
  intro: {
    en: "A single /24 gives you 254 host addresses in one broadcast domain. Real networks split their address space into many smaller subnets: one per VLAN, one per site, one per router link. Subnetting is how you cut a block into those pieces, and how you read any address and mask to know exactly which subnet it belongs to. The CCNA expects you to do this in your head, quickly, and later topics such as routing tables, OSPF and ACLs assume you can.",
    hi: "Ek /24 se tumhe ek hi broadcast domain mein 254 host addresses milte hain. Real networks apna address space kai chhote subnets mein baantte hain: har VLAN ke liye ek, har site ke liye ek, har router link ke liye ek. Subnetting se tum ek block ko in pieces mein kaatte ho, aur kisi bhi address aur mask ko dekh kar exactly bata sakte ho ki woh kis subnet ka hai. CCNA expect karta hai ki tum yeh dimaag mein, jaldi kar lo, aur aage ke topics jaise routing tables, OSPF aur ACLs maan kar chalte hain ki tumhe yeh aata hai.",
  },
  outcomes: [
    {
      en: "Find the network address, broadcast address and usable host range for any IPv4 address and prefix",
      hi: "Kisi bhi IPv4 address aur prefix ka network address, broadcast address aur usable host range nikal sako",
    },
    {
      en: "Convert between prefix length and dotted-decimal mask, and give the block size for each",
      hi: "Prefix length aur dotted-decimal mask ke beech convert kar sako, aur har ek ka block size bata sako",
    },
    {
      en: "Calculate usable hosts per subnet (2^h − 2) and the number of subnets (2^s)",
      hi: "Har subnet ke usable hosts (2^h − 2) aur kitne subnets bante hain (2^s), yeh calculate kar sako",
    },
    {
      en: "Pick the longest prefix that still fits a required number of hosts",
      hi: "Diye gaye hosts ke liye sabse lamba prefix chun sako jo phir bhi fit ho",
    },
    {
      en: "Explain where /31 and /32 prefixes are used",
      hi: "Samjha sako ki /31 aur /32 prefixes kahan use hote hain",
    },
  ],
  sections: [
    {
      id: "why-subnet",
      heading: { en: "Why split a network into subnets", hi: "Network ko subnets mein kyun baantein" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Picture a company that owns 192.168.10.0/24. Put all 254 possible hosts in one subnet and every ARP request, and every other broadcast, reaches all of them. You also cannot give the sales VLAN, the servers and the link between two routers their own address ranges, and you need separate ranges to route between them and to write security rules for each.",
            hi: "Socho ek company ke paas 192.168.10.0/24 hai. Saare 254 possible hosts ek hi subnet mein daal do, toh har ARP request, aur baaki har broadcast, un sab tak pahunchega. Upar se sales VLAN, servers aur do routers ke beech ke link ko alag address range bhi nahi de paoge, jabki inke beech routing karne aur har ek ke liye security rules likhne ke liye alag ranges chahiye.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Subnetting** solves this by **borrowing host bits** and turning them into network bits. The prefix gets longer, each subnet gets smaller, and you get more of them. Borrow 3 bits from a /24 and you get /27 subnets: 2³ = 8 of them, each with 32 addresses.",
            hi: "**Subnetting** yeh problem solve karta hai: kuch **host bits borrow** karke unhe network bits bana deta hai. Prefix lamba ho jaata hai, har subnet chhota ho jaata hai, aur subnets zyada ho jaate hain. /24 se 3 bits borrow karo toh /27 subnets milte hain: 2³ = 8 subnets, har ek mein 32 addresses.",
          },
        },
        {
          type: "table",
          caption: { en: "192.168.10.0/24 cut into eight /27 subnets", hi: "192.168.10.0/24 ko aath /27 subnets mein kaata gaya" },
          columns: ["Subnet", "Network", "Usable hosts", "Broadcast"],
          rows: [
            ["1", "192.168.10.0", ".1 – .30", "192.168.10.31"],
            ["2", "192.168.10.32", ".33 – .62", "192.168.10.63"],
            ["3", "192.168.10.64", ".65 – .94", "192.168.10.95"],
            ["4", "192.168.10.96", ".97 – .126", "192.168.10.127"],
            ["5", "192.168.10.128", ".129 – .158", "192.168.10.159"],
            ["6", "192.168.10.160", ".161 – .190", "192.168.10.191"],
            ["7", "192.168.10.192", ".193 – .222", "192.168.10.223"],
            ["8", "192.168.10.224", ".225 – .254", "192.168.10.255"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Spot the pattern", hi: "Pattern pakdo" },
          text: {
            en: "Look down the Network column: 0, 32, 64, 96… Every network address is a multiple of 32, and every broadcast is one less than the next network. That pattern is the whole trick of this lesson.",
            hi: "Network column neeche tak dekho: 0, 32, 64, 96… Har network address 32 ka multiple hai, aur har broadcast agle network se ek kam hai. Is lesson ki poori trick yahi pattern hai.",
          },
        },
      ],
    },
    {
      id: "masks-and-block-sizes",
      heading: { en: "Masks, block sizes and host counts", hi: "Masks, block sizes aur host counts" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The ones in a mask always fill from the left, so a mask octet can only take nine values: 0, 128, 192, 224, 240, 248, 252, 254 and 255. The first octet of the mask that is not 255 is the **interesting octet**. Its **block size** is 256 minus the mask value there, which is also the place value of the last network bit.",
            hi: "Mask mein ones hamesha left se bharte hain, isliye mask ka ek octet sirf nau values le sakta hai: 0, 128, 192, 224, 240, 248, 252, 254 aur 255. Mask ka pehla octet jo 255 nahi hai, woh **interesting octet** hai. Uska **block size** = 256 minus wahan ki mask value, aur yahi last network bit ki place value bhi hoti hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Prefixes that end in the fourth octet", hi: "Woh prefixes jo fourth octet mein khatam hote hain" },
          columns: ["Prefix", "Mask", "Host bits", "Block size", "Usable hosts"],
          rows: [
            ["/24", "255.255.255.0", "8", "256", "254"],
            ["/25", "255.255.255.128", "7", "128", "126"],
            ["/26", "255.255.255.192", "6", "64", "62"],
            ["/27", "255.255.255.224", "5", "32", "30"],
            ["/28", "255.255.255.240", "4", "16", "14"],
            ["/29", "255.255.255.248", "3", "8", "6"],
            ["/30", "255.255.255.252", "2", "4", "2"],
          ],
        },
        {
          type: "table",
          caption: {
            en: "Prefixes that end in the third octet (the block size counts in the third octet)",
            hi: "Woh prefixes jo third octet mein khatam hote hain (block size third octet mein ginte hain)",
          },
          columns: ["Prefix", "Mask", "Host bits", "Block size", "Usable hosts"],
          rows: [
            ["/16", "255.255.0.0", "16", "256", "65,534"],
            ["/17", "255.255.128.0", "15", "128", "32,766"],
            ["/18", "255.255.192.0", "14", "64", "16,382"],
            ["/19", "255.255.224.0", "13", "32", "8,190"],
            ["/20", "255.255.240.0", "12", "16", "4,094"],
            ["/21", "255.255.248.0", "11", "8", "2,046"],
            ["/22", "255.255.252.0", "10", "4", "1,022"],
            ["/23", "255.255.254.0", "9", "2", "510"],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Memory shortcut", hi: "Yaad rakhne ki trick" },
          text: {
            en: "/20 and /28 both have block size 16, /19 and /27 both have 32, and so on. Prefixes 8 apart share a block size, one octet to the left. Learn the fourth-octet table and you get the third-octet table for free.",
            hi: "/20 aur /28 dono ka block size 16 hai, /19 aur /27 dono ka 32, aur aise hi aage. Jo prefixes 8 ke fark par hain unka block size same hota hai, bas ek octet left mein. Fourth octet wali table yaad kar lo, third octet wali free mein mil jaayegi.",
          },
        },
      ],
    },
    {
      id: "the-method",
      heading: { en: "The method, on a fourth-octet example", hi: "Method, ek fourth-octet example par" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Use the same six steps for every question. Here they are on 192.168.10.77/27, the first example in the animation.",
            hi: "Har question par yahi six steps lagao. Yahan animation ka pehla example lete hain: 192.168.10.77/27.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Mask and interesting octet.** /27 = 255.255.255.224. The first three octets are 255, so the fourth octet is the interesting one.",
              hi: "**Mask aur interesting octet.** /27 = 255.255.255.224. Pehle teen octets 255 hain, toh fourth octet interesting hai.",
            },
            {
              en: "**Block size.** 256 − 224 = 32. The networks in this octet are 0, 32, 64, 96, 128, 160, 192 and 224.",
              hi: "**Block size.** 256 − 224 = 32. Is octet mein networks 0, 32, 64, 96, 128, 160, 192 aur 224 hain.",
            },
            {
              en: "**Network address.** Take the highest multiple of 32 that is not above 77: 64. Octets to the left are copied, so the network is `192.168.10.64`.",
              hi: "**Network address.** 32 ka woh sabse bada multiple lo jo 77 se upar na ho: 64. Left ke octets waise hi copy hote hain, toh network `192.168.10.64` hai.",
            },
            {
              en: "**Broadcast address.** The next network minus one: 96 − 1 = 95, so `192.168.10.95`.",
              hi: "**Broadcast address.** Agle network se ek kam: 96 − 1 = 95, toh broadcast `192.168.10.95` hai.",
            },
            {
              en: "**Usable range.** Network + 1 to broadcast − 1: `192.168.10.65` to `192.168.10.94`.",
              hi: "**Usable range.** Network + 1 se broadcast − 1 tak: `192.168.10.65` se `192.168.10.94`.",
            },
            {
              en: "**Host count.** 32 − 27 = 5 host bits, so 2⁵ − 2 = 30 usable addresses. The two you subtract are the network and broadcast addresses.",
              hi: "**Host count.** 32 − 27 = 5 host bits, toh 2⁵ − 2 = 30 usable addresses. Jo 2 minus kiye, woh network aur broadcast address hain.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "Why do multiples work? In a network address every host bit is 0. What is left in the interesting octet is made only of network bits, and the smallest of them is worth the block size, so the value must be a multiple of it. The animation shows this bit by bit.",
            hi: "Multiples wali trick kaam kyun karti hai? Network address mein har host bit 0 hota hai. Interesting octet mein sirf network bits bachte hain, aur unme sabse chhota bit block size ke barabar hota hai, isliye value uska multiple hi hogi. Animation mein yeh bit by bit dikhaya gaya hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Octets to the right of the interesting octet", hi: "Interesting octet ke right wale octets" },
          text: {
            en: "Any octet to the right of the interesting octet is all host bits. It is 0 in the network address and 255 in the broadcast address. In a fourth-octet problem there is nothing to the right, which is why the next example matters.",
            hi: "Interesting octet ke right mein jo bhi octet hai, woh poora host bits hai. Network address mein woh 0 hota hai aur broadcast address mein 255. Fourth-octet problem mein right mein kuch hota hi nahi, isliye agla example zaroori hai.",
          },
        },
      ],
    },
    {
      id: "third-octet",
      heading: { en: "When the mask ends in the third octet", hi: "Jab mask third octet mein khatam ho" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Many learners are comfortable with /27 and freeze at /20. The method does not change; only the interesting octet moves. Try 172.16.45.200/20.",
            hi: "Bahut learners /27 mein comfortable rehte hain aur /20 dekh kar atak jaate hain. Method nahi badalta; sirf interesting octet shift hota hai. 172.16.45.200/20 try karo.",
          },
        },
        {
          type: "table",
          caption: { en: "172.16.45.200/20, step by step", hi: "172.16.45.200/20, step by step" },
          columns: [
            { en: "Step", hi: "Step" },
            { en: "Working", hi: "Kaise nikala" },
            { en: "Result", hi: "Result" },
          ],
          rows: [
            [
              { en: "Mask", hi: "Mask" },
              { en: "20 = 8 + 8 + 4: two octets of 255, then four ones in the third octet", hi: "20 = 8 + 8 + 4: do octets 255 ke, phir third octet mein chaar ones" },
              "255.255.240.0",
            ],
            [
              { en: "Interesting octet", hi: "Interesting octet" },
              { en: "The first mask octet that is not 255", hi: "Mask ka pehla octet jo 255 nahi hai" },
              { en: "3rd (address value 45)", hi: "3rd (address mein value 45)" },
            ],
            [{ en: "Block size", hi: "Block size" }, "256 − 240", "16"],
            [
              { en: "Network", hi: "Network" },
              { en: "Multiples of 16: 0, 16, 32, 48. 45 falls in the 32 block. 4th octet = 0", hi: "16 ke multiples: 0, 16, 32, 48. 45, 32 wale block mein aata hai. 4th octet = 0" },
              "172.16.32.0",
            ],
            [
              { en: "Broadcast", hi: "Broadcast" },
              { en: "Next network 48, minus 1 = 47. 4th octet = 255", hi: "Agla network 48, minus 1 = 47. 4th octet = 255" },
              "172.16.47.255",
            ],
            [
              { en: "Usable range", hi: "Usable range" },
              { en: "Network + 1 to broadcast − 1", hi: "Network + 1 se broadcast − 1 tak" },
              "172.16.32.1 – 172.16.47.254",
            ],
            [{ en: "Usable hosts", hi: "Usable hosts" }, "32 − 20 = 12 host bits", "2¹² − 2 = 4,094"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: ".0 and .255 can be normal hosts", hi: ".0 aur .255 bhi normal host ho sakte hain" },
          text: {
            en: "This subnet runs from 172.16.32.0 to 172.16.47.255, so 172.16.40.0 and 172.16.33.255 are ordinary usable addresses. Only the very first address (all host bits 0) and the very last (all host bits 1) are reserved. The exam likes to test this.",
            hi: "Yeh subnet 172.16.32.0 se 172.16.47.255 tak hai, toh 172.16.40.0 aur 172.16.33.255 bilkul normal usable addresses hain. Sirf sabse pehla address (saare host bits 0) aur sabse aakhri (saare host bits 1) reserved hain. Exam yeh cheez test karna pasand karta hai.",
          },
        },
        {
          type: "table",
          caption: {
            en: "Practice: cover every column except the address, solve, then check",
            hi: "Practice: address ke alawa saare columns dhak do, solve karo, phir check karo",
          },
          columns: ["Address", "Block size", "Network", "Broadcast", "Usable hosts"],
          rows: [
            ["10.1.1.130/25", "128 (4th octet)", "10.1.1.128", "10.1.1.255", "126"],
            ["192.168.5.39/29", "8 (4th octet)", "192.168.5.32", "192.168.5.39", "6"],
            ["172.20.99.14/22", "4 (3rd octet)", "172.20.96.0", "172.20.99.255", "1,022"],
            ["10.44.200.1/13", "8 (2nd octet)", "10.40.0.0", "10.47.255.255", "524,286"],
          ],
        },
        {
          type: "p",
          text: {
            en: "The second row is a trap: 192.168.5.39 is the broadcast address of its /29, so you cannot give it to a host. The last row shows the method works in the second octet too. /13 is 255.248.0.0, block size 8, and 44 falls in 40–47.",
            hi: "Doosri row ek trap hai: 192.168.5.39 apne /29 ka broadcast address hai, isliye yeh kisi host ko nahi de sakte. Aakhri row dikhati hai ki method second octet mein bhi chalta hai. /13 = 255.248.0.0, block size 8, aur 44, 40–47 mein aata hai.",
          },
        },
      ],
    },
    {
      id: "subnets-and-hosts",
      heading: { en: "How many subnets, how many hosts", hi: "Kitne subnets, kitne hosts" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Two formulas answer almost every sizing question. **s** is the number of bits you borrowed from the original network, and **h** is the number of host bits left.",
            hi: "Lagbhag har sizing question do formulas se solve hota hai. **s** matlab original network se kitne bits borrow kiye, aur **h** matlab kitne host bits bache.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "Number of subnets = `2^s`. Borrowing 3 bits from 192.168.10.0/24 gives 2³ = 8 subnets of /27.",
              hi: "Subnets ki ginti = `2^s`. 192.168.10.0/24 se 3 bits borrow karo toh 2³ = 8 subnets milte hain, har ek /27.",
            },
            {
              en: "Usable hosts per subnet = `2^h − 2`. A /27 has 5 host bits: 2⁵ − 2 = 30.",
              hi: "Har subnet mein usable hosts = `2^h − 2`. /27 mein 5 host bits hain: 2⁵ − 2 = 30.",
            },
            {
              en: "To fit N hosts, find the smallest h where 2^h − 2 ≥ N. The prefix is 32 − h.",
              hi: "N hosts fit karne ke liye sabse chhota h dhoondho jahan 2^h − 2 ≥ N ho. Prefix = 32 − h.",
            },
            {
              en: "To get N subnets, find the smallest s where 2^s ≥ N, then add s to the original prefix.",
              hi: "N subnets chahiye toh sabse chhota s dhoondho jahan 2^s ≥ N ho, phir s ko original prefix mein jod do.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Choosing a prefix for a host requirement", hi: "Host requirement ke hisaab se prefix chunna" },
          columns: ["Hosts needed", "Host bits (h)", "Prefix", "Usable hosts"],
          rows: [
            ["2", "2", "/30", "2"],
            ["10", "4", "/28", "14"],
            ["30", "5", "/27", "30"],
            ["31", "6", "/26", "62"],
            ["100", "7", "/25", "126"],
            ["500", "9", "/23", "510"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Worked example: from 172.16.0.0/16 you need at least 6 subnets. 2² = 4 is too few and 2³ = 8 is enough, so borrow 3 bits: /19. Each /19 keeps 13 host bits, so 8,190 usable hosts, and the subnets go up by 32 in the third octet: 172.16.0.0, 172.16.32.0, 172.16.64.0 and so on.",
            hi: "Worked example: 172.16.0.0/16 se kam se kam 6 subnets chahiye. 2² = 4 kam hai aur 2³ = 8 kaafi hai, toh 3 bits borrow karo: /19. Har /19 mein 13 host bits bachte hain, yaani 8,190 usable hosts, aur subnets third octet mein 32-32 se badhte hain: 172.16.0.0, 172.16.32.0, 172.16.64.0 waghera.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Subnet zero is allowed", hi: "Subnet zero allowed hai" },
          text: {
            en: "Some older books count subnets as 2^s − 2, because the first and last subnets were once avoided. Cisco IOS has allowed them by default since IOS 12.0 (`ip subnet-zero`), and the CCNA counts 2^s.",
            hi: "Kuch purani books subnets ko 2^s − 2 ginti hain, kyunki pehle first aur last subnet avoid kiye jaate the. Cisco IOS 12.0 se yeh by default allowed hain (`ip subnet-zero`), aur CCNA 2^s hi count karta hai.",
          },
        },
      ],
    },
    {
      id: "exam-speed",
      heading: { en: "Speed and checking on exam day", hi: "Exam day par speed aur checking" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "There is no calculator in the CCNA exam. At a test centre you get an erasable note board (online, an on-screen whiteboard). Write down 128 64 32 16 8 4 2 1 and the mask values 128 192 224 240 248 252 254 255 before you start.",
              hi: "CCNA exam mein calculator nahi milta. Test centre par ek erasable note board milta hai (online exam mein on-screen whiteboard). Shuru karne se pehle 128 64 32 16 8 4 2 1 aur mask values 128 192 224 240 248 252 254 255 likh lo.",
            },
            {
              en: "Solve only the interesting octet. Octets to the left are copied; octets to the right are 0 in the network and 255 in the broadcast.",
              hi: "Sirf interesting octet solve karo. Left ke octets copy hote hain; right ke octets network mein 0 aur broadcast mein 255.",
            },
            {
              en: "Find the network value by dividing: 77 ÷ 32 = 2 remainder 13, so the network value is 2 × 32 = 64.",
              hi: "Network value divide karke nikalo: 77 ÷ 32 = 2, remainder 13, toh network value 2 × 32 = 64.",
            },
            {
              en: "Check your answer: the network must be a multiple of the block size, and the broadcast must be one less than the next network.",
              hi: "Answer check karo: network block size ka multiple hona chahiye, aur broadcast agle network se ek kam hona chahiye.",
            },
            {
              en: "To test whether two hosts share a subnet, work out the network address of each with the mask. Same network, same subnet.",
              hi: "Do hosts same subnet mein hain ya nahi, yeh dekhne ke liye mask se dono ka network address nikalo. Network same hai toh subnet same hai.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "Let the router check your work", hi: "Router se apna answer check karwao" },
          lines: [
            { prompt: "R1(config)#", cmd: "interface GigabitEthernet0/0" },
            { prompt: "R1(config-if)#", cmd: "ip address 192.168.10.65 255.255.255.224" },
            { prompt: "R1(config-if)#", cmd: "no shutdown" },
            { prompt: "R1(config-if)#", cmd: "end" },
            { prompt: "R1#", cmd: "show ip route connected" },
            { out: "      192.168.10.0/24 is variably subnetted, 2 subnets, 2 masks" },
            {
              out: "C        192.168.10.64/27 is directly connected, GigabitEthernet0/0",
              comment: { en: "The router worked out the network from the address and mask", hi: "Router ne address aur mask se network khud nikala" },
            },
            {
              out: "L        192.168.10.65/32 is directly connected, GigabitEthernet0/0",
              comment: { en: "Its own address, as a /32 host route", hi: "Router ka apna address, /32 host route ke roop mein" },
            },
          ],
          note: {
            en: "The C route appears only when the interface is up/up, so the port must be cabled to something. You will read routing tables properly in module 3; for now, just compare the C line with your answer.",
            hi: "C route tabhi dikhta hai jab interface up/up ho, isliye port kisi device se cable se juda hona chahiye. Routing tables module 3 mein theek se padhoge; abhi sirf C wali line ko apne answer se match karo.",
          },
        },
      ],
    },
    {
      id: "slash-31-and-32",
      heading: { en: "/30, /31 and /32: the smallest subnets", hi: "/30, /31 aur /32: sabse chhote subnets" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A link between two routers needs exactly two addresses. The classic choice is a /30: four addresses, two usable. Half the block goes on a network and a broadcast address that a two-device link has little use for.",
            hi: "Do routers ke beech ke link ko exactly do addresses chahiye. Classic choice /30 hai: chaar addresses, do usable. Aadha block network aur broadcast address mein chala jaata hai, jinki do devices wale link par khaas zaroorat nahi hoti.",
          },
        },
        {
          type: "p",
          text: {
            en: "A **/31** (RFC 3021) gives a point-to-point link just two addresses, with no network or broadcast address, and both are usable, one per router. Cisco IOS supports it on point-to-point links, and large networks use it to save space. A **/32** is a single address. You see it on loopback interfaces, for example an address used as a router ID, and as **host routes** in the routing table, like the `L` route above.",
            hi: "**/31** (RFC 3021) point-to-point link ko sirf do addresses deta hai, bina network ya broadcast address ke, aur dono usable hote hain, ek-ek router ke liye. Cisco IOS point-to-point links par ise support karta hai, aur bade networks address bachane ke liye ise use karte hain. **/32** sirf ek address hai. Yeh loopback interfaces par dikhta hai, jaise router ID ke liye use hone wala address, aur routing table mein **host routes** ke roop mein, jaise upar wala `L` route.",
          },
        },
        {
          type: "table",
          columns: ["Prefix", "Addresses", "Usable", { en: "Typical use", hi: "Aam use" }],
          rows: [
            ["/30", "4", "2", { en: "Router-to-router link (classic)", hi: "Router-to-router link (classic tareeka)" }],
            ["/31", "2", "2", { en: "Point-to-point link, no network or broadcast address", hi: "Point-to-point link, network ya broadcast address nahi" }],
            ["/32", "1", "1", { en: "Loopback address, host route", hi: "Loopback address, host route" }],
          ],
        },
        {
          type: "cli",
          title: { en: "A /32 on a loopback interface", hi: "Loopback interface par /32" },
          lines: [
            { prompt: "R1(config)#", cmd: "interface Loopback0" },
            {
              prompt: "R1(config-if)#",
              cmd: "ip address 10.255.0.1 255.255.255.255",
              comment: { en: "One address, no network or broadcast needed", hi: "Sirf ek address, network ya broadcast ki zaroorat nahi" },
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "The 2^h − 2 rule and its exception", hi: "2^h − 2 rule aur uska exception" },
          text: {
            en: "The 2^h − 2 rule gives /30 for two hosts, the classic answer for router links. /31 is a deliberate exception that only works on point-to-point links, where there is only one other device to talk to.",
            hi: "2^h − 2 rule do hosts ke liye /30 deta hai, router links ka classic answer. /31 jaan-boojh kar banaya gaya exception hai jo sirf point-to-point links par chalta hai, jahan baat karne ke liye sirf ek hi doosra device hota hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Subnet", def: { en: "A smaller network carved from a larger block by making the prefix longer.", hi: "Bade block se prefix lamba karke kaata gaya chhota network." } },
    { term: "Prefix length", def: { en: "The number of network bits, written /n. /27 means 27 network bits and 5 host bits.", hi: "Network bits ki ginti, /n likhte hain. /27 ka matlab 27 network bits aur 5 host bits." } },
    { term: "Interesting octet", def: { en: "The first mask octet that is not 255; all the subnet maths happens there.", hi: "Mask ka pehla octet jo 255 nahi hai; subnetting ka saara hisaab wahi hota hai." } },
    { term: "Block size", def: { en: "256 minus the mask value in the interesting octet. Every network address is a multiple of it.", hi: "Interesting octet mein 256 minus mask value. Har network address iska multiple hota hai." } },
    { term: "Network address", def: { en: "The first address of a subnet, with all host bits 0. It names the subnet and is not given to a host.", hi: "Subnet ka pehla address, saare host bits 0. Yeh subnet ka naam hai aur kisi host ko nahi diya jaata." } },
    { term: "Broadcast address", def: { en: "The last address of a subnet, with all host bits 1. A packet sent to it reaches every host in the subnet.", hi: "Subnet ka aakhri address, saare host bits 1. Is par bheja gaya packet subnet ke har host tak pahunchta hai." } },
    { term: "Borrowed bits", def: { en: "Host bits turned into network bits to create subnets; s borrowed bits give 2^s subnets.", hi: "Woh host bits jo subnets banane ke liye network bits bana diye gaye; s borrowed bits se 2^s subnets bante hain." } },
    { term: "Host route", def: { en: "A /32 route that matches exactly one address.", hi: "/32 route jo sirf ek address se match karta hai." } },
  ],
  commands: [
    { cmd: "interface GigabitEthernet0/0", mode: "Cisco global configuration", does: { en: "Enter interface configuration mode for Gi0/0", hi: "Gi0/0 ke interface configuration mode mein jaata hai" } },
    { cmd: "ip address 192.168.10.65 255.255.255.224", mode: "Cisco interface configuration", does: { en: "Give the interface an address and mask; the router derives the subnet from them", hi: "Interface ko address aur mask deta hai; router inse subnet khud nikalta hai" } },
    { cmd: "no shutdown", mode: "Cisco interface configuration", does: { en: "Enable the interface so its connected route can appear", hi: "Interface enable karta hai taaki uska connected route dikhe" } },
    { cmd: "show ip route connected", mode: "Cisco privileged EXEC", does: { en: "Show connected (C) and local (L) routes, a quick check of a subnet calculation", hi: "Connected (C) aur local (L) routes dikhata hai, subnet calculation check karne ka aasaan tareeka" } },
    { cmd: "interface Loopback0", mode: "Cisco global configuration", does: { en: "Create or enter a loopback interface, often given a /32", hi: "Loopback interface banata hai ya usme jaata hai, aksar ise /32 diya jaata hai" } },
  ],
  mistakes: [
    {
      en: "Forgetting to subtract 2. A /27 has 32 addresses but only 30 usable hosts, because the network and broadcast addresses cannot be assigned (/31 and /32 are the exceptions).",
      hi: "2 minus karna bhool jaana. /27 mein 32 addresses hain lekin sirf 30 usable hosts, kyunki network aur broadcast address assign nahi ho sakte (sirf /31 aur /32 iske exception hain).",
    },
    {
      en: "Working the block size from the prefix number (256 − 27). Use the mask value: 256 − 224 = 32.",
      hi: "Block size prefix number se nikalna (256 − 27). Mask value use karo: 256 − 224 = 32.",
    },
    {
      en: "Doing the maths in the fourth octet when the mask ends in the third. For /20 the block size 16 applies to the third octet, so 172.16.45.200/20 is in 172.16.32.0/20, not in 172.16.45.192.",
      hi: "Mask third octet mein khatam ho aur hisaab fourth octet mein karna. /20 mein block size 16 third octet par lagta hai, isliye 172.16.45.200/20 ka network 172.16.32.0/20 hai, 172.16.45.192 nahi.",
    },
    {
      en: "Assuming an address ending in .0 or .255 can never be a host. In 172.16.32.0/20, both 172.16.40.0 and 172.16.33.255 are valid host addresses.",
      hi: "Yeh maan lena ki .0 ya .255 par khatam hone wala address kabhi host nahi ho sakta. 172.16.32.0/20 mein 172.16.40.0 aur 172.16.33.255 dono valid host addresses hain.",
    },
    {
      en: "Giving the next network address as the broadcast. The broadcast is one less: for 192.168.10.64/27 it is .95, not .96.",
      hi: "Agle network address ko broadcast bata dena. Broadcast usse ek kam hota hai: 192.168.10.64/27 ka broadcast .95 hai, .96 nahi.",
    },
    {
      en: "Counting subnets as 2^s − 2. Subnet zero and the last subnet are usable, so borrowing 3 bits gives 8 subnets, not 6.",
      hi: "Subnets ko 2^s − 2 ginna. Subnet zero aur last subnet dono usable hain, isliye 3 bits borrow karne se 8 subnets milte hain, 6 nahi.",
    },
  ],
  recap: [
    {
      en: "Block size = 256 − the mask value in the interesting octet; network addresses are multiples of it.",
      hi: "Block size = 256 − interesting octet ki mask value; network addresses iske multiples hote hain.",
    },
    {
      en: "Network: host bits all 0. Broadcast: host bits all 1, which is the next network minus one.",
      hi: "Network mein saare host bits 0 hote hain. Broadcast mein saare host bits 1, jo agle network se ek kam hai.",
    },
    {
      en: "Octets left of the interesting octet are copied; octets to the right are 0 in the network and 255 in the broadcast.",
      hi: "Interesting octet ke left wale octets copy hote hain; right wale network mein 0 aur broadcast mein 255.",
    },
    {
      en: "Usable hosts = 2^h − 2; subnets = 2^s. Fit N hosts with the smallest h where 2^h − 2 ≥ N.",
      hi: "Usable hosts = 2^h − 2; subnets = 2^s. N hosts ke liye sabse chhota h lo jahan 2^h − 2 ≥ N ho.",
    },
    {
      en: "Mask values 128 192 224 240 248 252 254 255 match block sizes 128 64 32 16 8 4 2 1; prefixes 8 apart share a block size.",
      hi: "Mask values 128 192 224 240 248 252 254 255 ke block sizes 128 64 32 16 8 4 2 1 hain; 8 ke fark wale prefixes ka block size same hota hai.",
    },
    {
      en: "/30 is the classic router link (2 hosts), /31 is a point-to-point link with no network or broadcast, /32 is a single host.",
      hi: "/30 classic router link hai (2 hosts), /31 point-to-point link bina network ya broadcast ke, /32 sirf ek host.",
    },
  ],
  quiz: [
    {
      q: {
        en: "What is the network address of the subnet that contains host 10.10.10.190/26?",
        hi: "Host 10.10.10.190/26 jis subnet mein hai, uska network address kya hai?",
      },
      options: [
        { en: "10.10.10.128", hi: "10.10.10.128" },
        { en: "10.10.10.160", hi: "10.10.10.160" },
        { en: "10.10.10.192", hi: "10.10.10.192" },
        { en: "10.10.10.64", hi: "10.10.10.64" },
      ],
      answer: 0,
      explain: {
        en: "/26 is 255.255.255.192, block size 64, so the networks are .0, .64, .128 and .192. 190 lies between 128 and 191, so the network is 10.10.10.128. 10.10.10.192 is the next subnet, not this one.",
        hi: "/26 = 255.255.255.192, block size 64, toh networks .0, .64, .128 aur .192 hain. 190, 128 aur 191 ke beech hai, isliye network 10.10.10.128 hai. 10.10.10.192 agla subnet hai, yeh wala nahi.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "What is the broadcast address of the subnet that contains 172.16.77.9/21?",
        hi: "172.16.77.9/21 jis subnet mein hai, uska broadcast address kya hai?",
      },
      options: [
        { en: "172.16.72.255", hi: "172.16.72.255" },
        { en: "172.16.77.255", hi: "172.16.77.255" },
        { en: "172.16.79.254", hi: "172.16.79.254" },
        { en: "172.16.79.255", hi: "172.16.79.255" },
      ],
      answer: 3,
      explain: {
        en: "/21 is 255.255.248.0, so the interesting octet is the third, with block size 8. 77 falls in 72–79. The broadcast is the end of that block with the fourth octet at 255: 172.16.79.255. 172.16.79.254 is the last usable host, not the broadcast.",
        hi: "/21 = 255.255.248.0, toh interesting octet third hai, block size 8. 77, 72–79 mein aata hai. Broadcast us block ka end hai aur fourth octet 255: 172.16.79.255. 172.16.79.254 last usable host hai, broadcast nahi.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "A new VLAN must hold 30 hosts and you want to waste as few addresses as possible. Which prefix do you use?",
        hi: "Ek naye VLAN mein 30 hosts hone chahiye aur tum kam se kam addresses waste karna chahte ho. Kaunsa prefix use karoge?",
      },
      options: [
        { en: "/26", hi: "/26" },
        { en: "/27", hi: "/27" },
        { en: "/28", hi: "/28" },
        { en: "/25", hi: "/25" },
      ],
      answer: 1,
      explain: {
        en: "/27 has 5 host bits: 2⁵ − 2 = 30, exactly enough. /28 gives only 14. /26 and /25 would work but waste addresses. If the VLAN needed 31 hosts, /27 would be too small and /26 would be the answer.",
        hi: "/27 mein 5 host bits hain: 2⁵ − 2 = 30, bilkul kaafi. /28 sirf 14 deta hai. /26 aur /25 chal jaayenge lekin addresses waste honge. Agar VLAN ko 31 hosts chahiye hote, toh /27 chhota padta aur answer /26 hota.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Which of these addresses can be assigned to a host in subnet 172.16.32.0/20?",
        hi: "Inme se kaunsa address subnet 172.16.32.0/20 mein kisi host ko diya ja sakta hai?",
      },
      options: [
        { en: "172.16.32.0", hi: "172.16.32.0" },
        { en: "172.16.47.255", hi: "172.16.47.255" },
        { en: "172.16.40.0", hi: "172.16.40.0" },
        { en: "172.16.48.1", hi: "172.16.48.1" },
      ],
      answer: 2,
      explain: {
        en: "172.16.32.0/20 runs from 172.16.32.0 to 172.16.47.255. The first is the network address and the last is the broadcast, so neither can be used. 172.16.48.1 is in the next subnet. 172.16.40.0 ends in .0 but sits in the middle of the range, so it is a normal host address.",
        hi: "172.16.32.0/20, 172.16.32.0 se 172.16.47.255 tak hai. Pehla network address hai aur aakhri broadcast, toh dono use nahi ho sakte. 172.16.48.1 agle subnet mein hai. 172.16.40.0 .0 par khatam hota hai, lekin range ke beech mein hai, isliye normal host address hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "You subnet 192.168.50.0/24 by borrowing 3 host bits. How many subnets do you get, and how many usable hosts does each one have?",
        hi: "Tum 192.168.50.0/24 ko 3 host bits borrow karke subnet karte ho. Kitne subnets milenge, aur har ek mein kitne usable hosts?",
      },
      options: [
        { en: "6 subnets, 30 hosts each", hi: "6 subnets, har ek mein 30 hosts" },
        { en: "8 subnets, 32 hosts each", hi: "8 subnets, har ek mein 32 hosts" },
        { en: "8 subnets, 30 hosts each", hi: "8 subnets, har ek mein 30 hosts" },
        { en: "3 subnets, 62 hosts each", hi: "3 subnets, har ek mein 62 hosts" },
      ],
      answer: 2,
      explain: {
        en: "Borrowing 3 bits gives 2³ = 8 subnets, each a /27. 5 host bits remain: 2⁵ = 32 addresses, minus the network and broadcast, leaves 30 usable. The 6-subnet answer comes from old books that avoided subnet zero.",
        hi: "3 bits borrow karne se 2³ = 8 subnets milte hain, har ek /27. 5 host bits bachte hain: 2⁵ = 32 addresses, network aur broadcast minus karo toh 30 usable. 6 subnets wala answer purani books se aata hai jo subnet zero avoid karti thi.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "R1 has `ip address 10.20.30.45 255.255.255.240` on Gi0/1, and the interface is up/up. Which connected route does `show ip route` list for it?",
        hi: "R1 ke Gi0/1 par `ip address 10.20.30.45 255.255.255.240` hai, aur interface up/up hai. `show ip route` iske liye kaunsa connected route dikhayega?",
      },
      options: [
        { en: "C 10.20.30.45/28", hi: "C 10.20.30.45/28" },
        { en: "C 10.20.30.32/28", hi: "C 10.20.30.32/28" },
        { en: "C 10.20.30.0/28", hi: "C 10.20.30.0/28" },
        { en: "C 10.20.30.48/28", hi: "C 10.20.30.48/28" },
      ],
      answer: 1,
      explain: {
        en: "255.255.255.240 is /28, block size 16: networks at .0, .16, .32, .48. 45 falls in .32–.47, so the C route is 10.20.30.32/28. The router also adds L 10.20.30.45/32 for its own address; a C route always shows the network address, never the host.",
        hi: "255.255.255.240 = /28, block size 16: networks .0, .16, .32, .48 par. 45, .32–.47 mein aata hai, toh C route 10.20.30.32/28 hai. Router apne address ke liye L 10.20.30.45/32 bhi add karta hai; C route hamesha network address dikhata hai, host nahi.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "bQ8sdpGQu8c",
      title: "Free CCNA | Subnetting (Part 1) | Day 13",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Subnetting /24 (Class C) networks into smaller subnets, with CIDR notation.",
        hi: "/24 (Class C) networks ko chhote subnets mein baantna, CIDR notation ke saath.",
      },
    },
    {
      id: "IGhd-0di0Qo",
      title: "Free CCNA | Subnetting (Part 2) | Day 14",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Subnetting Class B networks, where the work moves into the third octet.",
        hi: "Class B networks ki subnetting, jahan hisaab third octet mein chala jaata hai.",
      },
    },
    {
      id: "aXbwGrNqltk",
      title: "21. Free CCNA (NEW) | Subnetting in Hindi - IP Range & Block Size",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "Block size and IP range in Hindi: the same shortcut this lesson uses.",
        hi: "Block size aur IP range Hindi mein: wahi shortcut jo is lesson mein use hua hai.",
      },
    },
    {
      id: "vrvG89aBGbE",
      title: "23. Free CCNA (NEW) | Subnetting in Hindi - Subnetting of Class B",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "Class B subnetting in Hindi, for third-octet practice.",
        hi: "Class B subnetting Hindi mein, third-octet practice ke liye.",
      },
    },
  ],
  lab: {
    title: { en: "Check your subnetting against a router", hi: "Apni subnetting router se check karo" },
    steps: [
      {
        en: "In Packet Tracer place a router (a 2911 works), a switch and two PCs. Cable R1 Gi0/0 and both PCs to the switch.",
        hi: "Packet Tracer mein ek router (2911 chalega), ek switch aur do PCs rakho. R1 ka Gi0/0 aur dono PCs switch se cable karo.",
      },
      {
        en: "Before touching the CLI, solve 192.168.10.65/27 on paper: network, broadcast, first and last usable, host count.",
        hi: "CLI chhune se pehle 192.168.10.65/27 paper par solve karo: network, broadcast, first aur last usable, host count.",
      },
      {
        en: "On R1 configure `interface GigabitEthernet0/0`, `ip address 192.168.10.65 255.255.255.224` and `no shutdown`. Run `show ip route connected` and compare the C line with your answer.",
        hi: "R1 par `interface GigabitEthernet0/0`, `ip address 192.168.10.65 255.255.255.224` aur `no shutdown` configure karo. `show ip route connected` chalao aur C wali line ko apne answer se match karo.",
      },
      {
        en: "Give PC1 192.168.10.94 with mask 255.255.255.224 and gateway 192.168.10.65, then ping the gateway.",
        hi: "PC1 ko 192.168.10.94, mask 255.255.255.224 aur gateway 192.168.10.65 do, phir gateway ko ping karo.",
      },
      {
        en: "Decide which of 192.168.10.64, .80, .95 and .96 could be PC2's address in the same subnet. Configure the one that works and ping PC1.",
        hi: "Socho ki 192.168.10.64, .80, .95 aur .96 mein se kaunsa PC2 ka address same subnet mein ho sakta hai. Jo sahi hai woh configure karo aur PC1 ko ping karo.",
      },
      {
        en: "Cable Gi0/1 to a second switch and configure `ip address 172.16.45.200 255.255.240.0` and `no shutdown` on it. Predict the new C route, then check it with `show ip route connected`.",
        hi: "Gi0/1 ko doosre switch se cable karo aur us par `ip address 172.16.45.200 255.255.240.0` aur `no shutdown` configure karo. Naya C route pehle predict karo, phir `show ip route connected` se check karo.",
      },
    ],
  },
};

export default lesson;
