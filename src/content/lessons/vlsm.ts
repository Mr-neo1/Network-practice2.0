import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "vlsm",
  intro: {
    en: "Real networks are uneven. One LAN has 100 users, another has 20, and a link between two routers needs exactly 2 addresses. If every subnet must use the same mask, you size them all for the largest LAN and waste most of the block, or you run out of subnets. VLSM (Variable Length Subnet Masking) lets each subnet have its own prefix length, cut from the same block without overlaps.",
    hi: "Real networks barabar nahi hote. Ek LAN mein 100 users hain, doosre mein 20, aur do routers ke beech ke link ko sirf 2 addresses chahiye. Agar har subnet ka mask same rakhna pade, toh sab ko sabse bade LAN ke size ka banana padega aur block ka zyadatar hissa waste hoga, ya subnets hi kam pad jaayenge. VLSM (Variable Length Subnet Masking) har subnet ko apna alag prefix length deta hai, same block se kaat kar, bina overlap ke.",
  },
  outcomes: [
    {
      en: "Explain why one mask for every subnet wastes addresses or runs out of subnets",
      hi: "Samjha sako ki har subnet par ek hi mask lagane se addresses waste kyun hote hain ya subnets kam kyun padte hain",
    },
    {
      en: "Choose the longest prefix that fits each host requirement",
      hi: "Har host requirement ke liye sabse lamba prefix chun sako jo fit ho",
    },
    {
      en: "Build a VLSM plan largest-first, with the exact network, usable range and broadcast of every subnet",
      hi: "Largest-first VLSM plan bana sako, har subnet ke exact network, usable range aur broadcast ke saath",
    },
    {
      en: "Check a plan for overlapping or misaligned subnets",
      hi: "Kisi plan mein overlapping ya misaligned subnets pakad sako",
    },
    {
      en: "Find a valid subnet for a new requirement in the space that is left",
      hi: "Bache hue space mein nayi requirement ke liye valid subnet dhoondh sako",
    },
  ],
  sections: [
    {
      id: "why-vlsm",
      heading: { en: "Why one mask does not fit all", hi: "Ek hi mask sab par fit kyun nahi hota" },
      blocks: [
        {
          type: "p",
          text: {
            en: "This lesson uses one requirement throughout. You have **192.168.1.0/24** and need five subnets: LAN A with 100 hosts, LAN B with 50, LAN C with 20, and two WAN links between routers with 2 hosts each.",
            hi: "Poore lesson mein ek hi requirement use karenge. Tumhare paas **192.168.1.0/24** hai aur paanch subnets chahiye: LAN A mein 100 hosts, LAN B mein 50, LAN C mein 20, aur routers ke beech do WAN links jinme 2-2 hosts.",
          },
        },
        {
          type: "p",
          text: {
            en: "With **fixed-length subnet masking (FLSM)**, which you practised in the last lesson, every subnet of the block uses the same mask. Try each option:",
            hi: "**Fixed-length subnet masking (FLSM)** mein, jo tumne pichle lesson mein practise kiya, block ke har subnet ka mask same hota hai. Har option try karke dekho:",
          },
        },
        {
          type: "table",
          caption: { en: "Every fixed-length option for 192.168.1.0/24 fails", hi: "192.168.1.0/24 ke liye har fixed-length option fail hota hai" },
          columns: [
            { en: "Mask for all", hi: "Sab ka mask" },
            "Subnets",
            { en: "Usable hosts each", hi: "Har ek mein usable hosts" },
            "Result",
          ],
          rows: [
            ["/25", "2", "126", { en: "Every LAN fits, but you need 5 subnets", hi: "Har LAN fit ho jaata hai, lekin 5 subnets chahiye" }],
            ["/26", "4", "62", { en: "LAN A (100) does not fit, and only 4 subnets", hi: "LAN A (100) fit nahi hota, aur sirf 4 subnets" }],
            ["/27", "8", "30", { en: "Enough subnets, but LAN A and LAN B do not fit", hi: "Subnets kaafi hain, lekin LAN A aur LAN B fit nahi hote" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Even when FLSM works, it wastes space: a /25 used for a two-router link leaves 124 of its 126 usable addresses empty. VLSM gives each subnet the size it needs: /25, /26, /27, /30 and /30. All five fit in the /24 with 24 addresses to spare.",
            hi: "Jahan FLSM kaam kar bhi jaaye, wahan space waste hota hai: do routers ke link par /25 lagao toh 126 usable mein se 124 addresses khaali pade rahenge. VLSM har subnet ko utna hi size deta hai jitna chahiye: /25, /26, /27, /30 aur /30. Paancho /24 mein fit ho jaate hain aur 24 addresses bach bhi jaate hain.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "VLSM needs no special command", hi: "VLSM ke liye koi special command nahi" },
          text: {
            en: "VLSM is just different masks on different interfaces. A static route is configured with its own mask, and classless routing protocols such as OSPF, EIGRP and RIPv2 advertise the mask with each route, so both handle VLSM. Only old classful protocols such as RIPv1, which send no mask, could not.",
            hi: "VLSM ka matlab bas alag interfaces par alag masks hai. Static route apne mask ke saath configure hota hai, aur classless routing protocols jaise OSPF, EIGRP aur RIPv2 har route ke saath mask advertise karte hain, isliye dono VLSM aaram se handle karte hain. Sirf purane classful protocols jaise RIPv1, jo mask bhejte hi nahi, ise handle nahi kar paate the.",
          },
        },
      ],
    },
    {
      id: "size-each-subnet",
      heading: { en: "Step 1: size each subnet", hi: "Step 1: har subnet ka size decide karo" },
      blocks: [
        {
          type: "p",
          text: {
            en: "For each requirement, find the smallest number of host bits h where 2^h − 2 is at least the number of hosts. The prefix is 32 − h. Then sort the list from largest to smallest.",
            hi: "Har requirement ke liye sabse chhota h dhoondho jahan 2^h − 2 hosts ki ginti ke barabar ya usse zyada ho. Prefix = 32 − h. Phir list ko sabse bade se sabse chhote tak sort karo.",
          },
        },
        {
          type: "table",
          caption: { en: "Sizing the five subnets, largest first", hi: "Paancho subnets ka size, sabse bada pehle" },
          columns: ["Subnet", { en: "Hosts needed", hi: "Kitne hosts chahiye" }, "Host bits", "Prefix / mask", "Block size", "Usable"],
          rows: [
            ["LAN A", "100", "7", "/25 = 255.255.255.128", "128", "126"],
            ["LAN B", "50", "6", "/26 = 255.255.255.192", "64", "62"],
            ["LAN C", "20", "5", "/27 = 255.255.255.224", "32", "30"],
            ["WAN 1", "2", "2", "/30 = 255.255.255.252", "4", "2"],
            ["WAN 2", "2", "2", "/30 = 255.255.255.252", "4", "2"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Mind the minus 2", hi: "Minus 2 yaad rakho" },
          text: {
            en: "30 hosts fit a /27 exactly, but 31 hosts need a /26. 62 fit a /26, but 63 need a /25. When a requirement sits right next to a power of two, check it twice.",
            hi: "30 hosts /27 mein exactly fit hote hain, lekin 31 hosts ke liye /26 chahiye. 62 /26 mein fit hote hain, lekin 63 ke liye /25. Jab requirement kisi power of two ke bilkul paas ho, do baar check karo.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Real designs and exam questions", hi: "Real design aur exam questions" },
          text: {
            en: "In a real design, count the router's own interface as a host and leave room for growth. In an exam question, size for exactly the number of hosts given. For router-to-router links the classic answer is /30; a /31 (previous lesson) also works on point-to-point links, but this plan uses /30.",
            hi: "Real design mein router ke apne interface ko bhi ek host gino aur growth ke liye jagah chhodo. Exam question mein bilkul utne hi hosts ke liye size karo jitne diye gaye hain. Router-to-router links ka classic answer /30 hai; /31 (pichla lesson) bhi point-to-point links par chalta hai, lekin is plan mein /30 use karenge.",
          },
        },
      ],
    },
    {
      id: "allocate-largest-first",
      heading: { en: "Step 2: allocate largest first", hi: "Step 2: sabse bade se allocate karo" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "Give the largest subnet the start of the block: LAN A = `192.168.1.0/25`, which ends at .127.",
              hi: "Sabse bade subnet ko block ki shuruaat do: LAN A = `192.168.1.0/25`, jo .127 par khatam hota hai.",
            },
            {
              en: "Start the next subnet at the next free address, one after the previous broadcast: LAN B = `192.168.1.128/26`, ending at .191.",
              hi: "Agla subnet next free address se shuru karo, yaani pichle broadcast ke ek baad: LAN B = `192.168.1.128/26`, jo .191 par khatam hota hai.",
            },
            {
              en: "Check that the start address is a multiple of the new block size. 128 is a multiple of 64, so it is valid. When you go largest first, this check always passes.",
              hi: "Check karo ki start address naye block size ka multiple hai. 128, 64 ka multiple hai, toh valid hai. Largest first chaloge toh yeh check hamesha pass hoga.",
            },
            {
              en: "Carry on down the list: LAN C = `192.168.1.192/27` (to .223), WAN 1 = `192.168.1.224/30` (to .227), WAN 2 = `192.168.1.228/30` (to .231).",
              hi: "List mein aage badho: LAN C = `192.168.1.192/27` (.223 tak), WAN 1 = `192.168.1.224/30` (.227 tak), WAN 2 = `192.168.1.228/30` (.231 tak).",
            },
            {
              en: "Write down what is left, 192.168.1.232 to 192.168.1.255, as valid blocks for future subnets.",
              hi: "Jo bacha hai, 192.168.1.232 se 192.168.1.255, use future subnets ke liye valid blocks ke roop mein likh lo.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "The finished VLSM plan for 192.168.1.0/24", hi: "192.168.1.0/24 ka final VLSM plan" },
          columns: ["Subnet", "Network", "Mask", "Usable range", "Broadcast"],
          rows: [
            ["LAN A (100)", "192.168.1.0/25", "255.255.255.128", "192.168.1.1 – 192.168.1.126", "192.168.1.127"],
            ["LAN B (50)", "192.168.1.128/26", "255.255.255.192", "192.168.1.129 – 192.168.1.190", "192.168.1.191"],
            ["LAN C (20)", "192.168.1.192/27", "255.255.255.224", "192.168.1.193 – 192.168.1.222", "192.168.1.223"],
            ["WAN 1 (2)", "192.168.1.224/30", "255.255.255.252", "192.168.1.225 – 192.168.1.226", "192.168.1.227"],
            ["WAN 2 (2)", "192.168.1.228/30", "255.255.255.252", "192.168.1.229 – 192.168.1.230", "192.168.1.231"],
            [{ en: "Free", hi: "Khaali" }, "192.168.1.232/29", "255.255.255.248", { en: "Not assigned yet", hi: "Abhi assign nahi" }, "192.168.1.239"],
            [{ en: "Free", hi: "Khaali" }, "192.168.1.240/28", "255.255.255.240", { en: "Not assigned yet", hi: "Abhi assign nahi" }, "192.168.1.255"],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "What the exam asks", hi: "Exam kya poochta hai" },
          text: {
            en: "Expect questions such as \"which subnet should LAN B use\", \"which mask fits 50 hosts with the least waste\", or \"which address can a host in this subnet use\". All of them come from a table like this one, so practise building it quickly.",
            hi: "Aise questions expect karo: \"LAN B ko kaunsa subnet milna chahiye\", \"50 hosts ke liye kam se kam waste wala mask kaunsa hai\", ya \"is subnet mein host kaunsa address use kar sakta hai\". Sab isi tarah ki table se nikalte hain, isliye ise jaldi banane ki practice karo.",
          },
        },
      ],
    },
    {
      id: "why-order-matters",
      heading: { en: "Why largest first: alignment", hi: "Largest first kyun: alignment" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every subnet's network address must have all its host bits set to 0. So a network address is always a multiple of its block size: a /26 can start only at .0, .64, .128 or .192. A subnet that starts on such a boundary is **aligned**.",
            hi: "Har subnet ke network address mein saare host bits 0 hone chahiye. Isliye network address hamesha apne block size ka multiple hota hai: /26 sirf .0, .64, .128 ya .192 par shuru ho sakta hai. Jo subnet aise boundary par shuru hota hai, use **aligned** kehte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "Block sizes are all powers of two, so the end of a larger block always lands on a multiple of every smaller block size. After a /25 ends at .127, the next address, .128, is a valid start for a /26, a /27, a /30 or anything smaller. Going largest first, you never skip addresses and never create an overlap.",
            hi: "Saare block sizes powers of two hote hain, isliye bada block jahan khatam hota hai, wahan se agla address har chhote block size ka multiple hota hai. /25 .127 par khatam hua, toh agla address .128 /26, /27, /30 ya kisi bhi chhote subnet ke liye valid start hai. Largest first chaloge toh na koi address skip karna padega, na koi overlap banega.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "What goes wrong in the wrong order", hi: "Galat order mein kya bigadta hai" },
          text: {
            en: "Suppose you place LAN C first at 192.168.1.0/27 (.0 to .31). The next free address is .32, but 192.168.1.32 is not a /25 network address: its last 7 bits are 0100000, not all 0. The /25 that contains .32 is 192.168.1.0/25, which overlaps LAN C. The only /25 left is 192.168.1.128/25, and the rest of the plan has to be fitted into gaps.",
            hi: "Maan lo tumne LAN C pehle 192.168.1.0/27 (.0 se .31) par rakh diya. Next free address .32 hai, lekin 192.168.1.32 /25 network address nahi hai: iske last 7 bits 0100000 hain, sab 0 nahi. Jis /25 mein .32 aata hai woh 192.168.1.0/25 hai, jo LAN C se overlap karta hai. Ab sirf 192.168.1.128/25 bacha hai, aur baaki plan ko gaps mein fit karna padega.",
          },
        },
      ],
    },
    {
      id: "spotting-overlaps",
      heading: { en: "Spotting overlaps and misaligned subnets", hi: "Overlaps aur misaligned subnets pakadna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Exam questions often give you a plan and ask which subnet is wrong, or which subnet to use for a new LAN. Two checks catch almost every error:",
            hi: "Exam questions aksar ek plan dete hain aur poochte hain ki kaunsa subnet galat hai, ya naye LAN ke liye kaunsa subnet use karein. Do checks lagbhag har galti pakad lete hain:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Is it aligned?** The network value in the interesting octet must be a multiple of the block size. `192.168.1.232/28` is not a valid subnet, because 232 is not a multiple of 16.",
              hi: "**Kya yeh aligned hai?** Interesting octet mein network value block size ka multiple honi chahiye. `192.168.1.232/28` valid subnet nahi hai, kyunki 232, 16 ka multiple nahi hai.",
            },
            {
              en: "**Does it overlap?** Write each subnet as a range, from network to broadcast. Two subnets overlap if either range contains the other's network address.",
              hi: "**Kya yeh overlap karta hai?** Har subnet ko range ki tarah likho, network se broadcast tak. Agar kisi ek ki range mein doosre ka network address aa jaaye, toh dono overlap karte hain.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Overlap check examples", hi: "Overlap check ke examples" },
          columns: ["Subnet 1", "Subnet 2", "Ranges", { en: "Overlap?", hi: "Overlap?" }],
          rows: [
            ["10.1.1.0/26", "10.1.1.64/27", ".0–.63 and .64–.95", { en: "No", hi: "Nahi" }],
            ["10.1.1.128/25", "10.1.1.192/27", ".128–.255 and .192–.223", { en: "Yes: .192 is inside the /25", hi: "Haan: .192 /25 ke andar hai" }],
            ["10.1.1.96/28", "10.1.1.112/28", ".96–.111 and .112–.127", { en: "No", hi: "Nahi" }],
            ["10.1.1.64/26", "10.1.1.96/30", ".64–.127 and .96–.99", { en: "Yes: .96 is inside the /26", hi: "Haan: .96 /26 ke andar hai" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Filling free space works the same way. With .232 to .255 left in the plan above, a new LAN of 12 hosts needs a /28 (block 16). 192.168.1.232/28 is misaligned, so the answer is 192.168.1.240/28. A LAN of 5 hosts needs a /29 (block 8), and 192.168.1.232/29 fits exactly.",
            hi: "Free space bharna bhi isi tarah hota hai. Upar wale plan mein .232 se .255 bacha hai. 12 hosts wale naye LAN ko /28 (block 16) chahiye. 192.168.1.232/28 misaligned hai, toh answer 192.168.1.240/28 hai. 5 hosts wale LAN ko /29 (block 8) chahiye, aur 192.168.1.232/29 bilkul fit hota hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "IOS catches only some overlaps", hi: "IOS sirf kuch overlaps pakadta hai" },
          text: {
            en: "If you configure an address that overlaps a subnet on another interface of the same router, IOS normally rejects it with a message such as `% 192.168.1.96 overlaps with GigabitEthernet0/0`. It cannot see overlaps between different routers. Those cause confusing faults, such as some hosts being reachable and others not, so check the plan on paper first.",
            hi: "Agar tum aisa address configure karo jo same router ke kisi doosre interface ke subnet se overlap kare, toh IOS aam taur par `% 192.168.1.96 overlaps with GigabitEthernet0/0` jaise message ke saath use reject kar deta hai. Lekin alag-alag routers ke beech ka overlap IOS ko nahi dikhta. Aise overlaps confusing problems dete hain, jaise kuch hosts reachable aur kuch nahi, isliye plan pehle paper par check karo.",
          },
        },
      ],
    },
    {
      id: "configure-and-verify",
      heading: { en: "Putting the plan on a router", hi: "Plan ko router par lagana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In this design R1 connects LAN A on Gi0/0, LAN B on Gi0/1 and WAN 1 to R2 on Gi0/2. Each R1 interface takes the first usable address of its subnet, a common convention, and R2 uses .226 at the other end of WAN 1.",
            hi: "Is design mein R1 ke Gi0/0 par LAN A, Gi0/1 par LAN B, aur Gi0/2 par R2 ki taraf WAN 1 hai. R1 ka har interface apne subnet ka pehla usable address leta hai, jo ek common convention hai, aur WAN 1 ke doosre end par R2 .226 use karta hai.",
          },
        },
        {
          type: "cli",
          title: { en: "R1: three interfaces, three different masks", hi: "R1: teen interfaces, teen alag masks" },
          lines: [
            { prompt: "R1(config)#", cmd: "interface GigabitEthernet0/0" },
            { prompt: "R1(config-if)#", cmd: "ip address 192.168.1.1 255.255.255.128", comment: { en: "LAN A, /25", hi: "LAN A, /25" } },
            { prompt: "R1(config-if)#", cmd: "no shutdown" },
            { prompt: "R1(config-if)#", cmd: "interface GigabitEthernet0/1" },
            { prompt: "R1(config-if)#", cmd: "ip address 192.168.1.129 255.255.255.192", comment: { en: "LAN B, /26", hi: "LAN B, /26" } },
            { prompt: "R1(config-if)#", cmd: "no shutdown" },
            { prompt: "R1(config-if)#", cmd: "interface GigabitEthernet0/2" },
            { prompt: "R1(config-if)#", cmd: "ip address 192.168.1.225 255.255.255.252", comment: { en: "WAN 1 to R2, /30", hi: "R2 ki taraf WAN 1, /30" } },
            { prompt: "R1(config-if)#", cmd: "no shutdown" },
            { prompt: "R1(config-if)#", cmd: "end" },
            { prompt: "R1#", cmd: "show ip route connected" },
            {
              out: "      192.168.1.0/24 is variably subnetted, 6 subnets, 4 masks",
              comment: { en: "Several masks inside one network: that is VLSM", hi: "Ek network ke andar kai masks: yahi VLSM hai" },
            },
            { out: "C        192.168.1.0/25 is directly connected, GigabitEthernet0/0" },
            { out: "L        192.168.1.1/32 is directly connected, GigabitEthernet0/0" },
            { out: "C        192.168.1.128/26 is directly connected, GigabitEthernet0/1" },
            { out: "L        192.168.1.129/32 is directly connected, GigabitEthernet0/1" },
            { out: "C        192.168.1.224/30 is directly connected, GigabitEthernet0/2" },
            { out: "L        192.168.1.225/32 is directly connected, GigabitEthernet0/2" },
          ],
          note: {
            en: "Routes appear only for interfaces that are up/up (`no shutdown` and a working cable; for Gi0/2, R2 at the other end). \"6 subnets, 4 masks\" counts the three C routes and three /32 L routes, using /25, /26, /30 and /32. `show ip interface brief` does not show masks, so use this output or `show running-config interface` to check them.",
            hi: "Routes sirf un interfaces ke dikhte hain jo up/up hain (`no shutdown` aur sahi cable; Gi0/2 ke liye doosri taraf R2). \"6 subnets, 4 masks\" mein teen C routes aur teen /32 L routes gine gaye hain, jo /25, /26, /30 aur /32 use karte hain. `show ip interface brief` masks nahi dikhata, isliye masks check karne ke liye yeh output ya `show running-config interface` use karo.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "VLSM", def: { en: "Variable Length Subnet Masking: using different prefix lengths for subnets of the same address block.", hi: "Variable Length Subnet Masking: same address block ke subnets ke liye alag-alag prefix lengths use karna." } },
    { term: "FLSM", def: { en: "Fixed-length subnet masking: every subnet of a block uses the same mask.", hi: "Fixed-length subnet masking: block ke har subnet ka mask same hota hai." } },
    { term: "Block size", def: { en: "The number of addresses in a subnet, 2^h. A subnet's network address is always a multiple of it.", hi: "Subnet mein addresses ki ginti, 2^h. Subnet ka network address hamesha iska multiple hota hai." } },
    { term: "Aligned subnet", def: { en: "A subnet whose network address is a multiple of its block size, so all its host bits are 0.", hi: "Aisa subnet jiska network address uske block size ka multiple ho, yaani uske saare host bits 0 hon." } },
    { term: "Overlapping subnets", def: { en: "Two subnets whose ranges share addresses; a design error that breaks reachability for the shared part.", hi: "Do subnets jinki ranges mein kuch addresses common hain; yeh design error hai jisse common hisse ki reachability toot jaati hai." } },
    { term: "Classless routing protocol", def: { en: "A routing protocol, such as OSPF, EIGRP or RIPv2, that sends the mask with each route, which VLSM requires.", hi: "Aisa routing protocol, jaise OSPF, EIGRP ya RIPv2, jo har route ke saath mask bhejta hai; VLSM ke liye yeh zaroori hai." } },
    { term: "Variably subnetted", def: { en: "The note in `show ip route` that a network has subnets with more than one mask.", hi: "`show ip route` ka woh note jo batata hai ki ek network ke subnets mein ek se zyada masks hain." } },
  ],
  commands: [
    { cmd: "interface GigabitEthernet0/0", mode: "Cisco global configuration", does: { en: "Enter interface configuration mode for Gi0/0", hi: "Gi0/0 ke interface configuration mode mein jaata hai" } },
    { cmd: "ip address 192.168.1.1 255.255.255.128", mode: "Cisco interface configuration", does: { en: "Assign an address and mask; each interface can use a different mask", hi: "Address aur mask assign karta hai; har interface alag mask use kar sakta hai" } },
    { cmd: "show ip route connected", mode: "Cisco privileged EXEC", does: { en: "List connected and local routes to confirm each subnet and mask", hi: "Connected aur local routes dikhata hai taaki har subnet aur mask confirm ho sake" } },
    { cmd: "show running-config interface GigabitEthernet0/1", mode: "Cisco privileged EXEC", does: { en: "Show the configuration of one interface, including its address and mask", hi: "Ek interface ki configuration dikhata hai, uske address aur mask ke saath" } },
  ],
  mistakes: [
    {
      en: "Allocating in the order the requirements are listed. Sort by size and allocate largest first, or you will create overlaps or awkward gaps.",
      hi: "Requirements jis order mein likhi hain usi order mein allocate karna. Size se sort karo aur largest first allocate karo, warna overlaps ya ajeeb gaps ban jaayenge.",
    },
    {
      en: "Starting a subnet at an address that is not a multiple of its block size, such as 192.168.1.232/28. A network address needs all host bits 0; the valid /28 there is 192.168.1.240/28.",
      hi: "Subnet ko aise address se shuru karna jo uske block size ka multiple nahi hai, jaise 192.168.1.232/28. Network address ke saare host bits 0 hone chahiye; wahan valid /28 192.168.1.240/28 hai.",
    },
    {
      en: "Sizing with 2^h instead of 2^h − 2. 32 addresses give only 30 hosts, so a LAN of 31 hosts needs a /26, not a /27.",
      hi: "2^h − 2 ki jagah 2^h se size karna. 32 addresses mein sirf 30 hosts aate hain, isliye 31 hosts wale LAN ko /26 chahiye, /27 nahi.",
    },
    {
      en: "Starting the next subnet on the previous broadcast address. The next subnet begins one address later: LAN A ends at .127, so LAN B starts at .128.",
      hi: "Agle subnet ko pichle broadcast address se shuru karna. Agla subnet uske ek address baad shuru hota hai: LAN A .127 par khatam hota hai, toh LAN B .128 se shuru hota hai.",
    },
    {
      en: "Giving a router-to-router link a LAN-sized subnet. A /30 provides exactly the two usable addresses the link needs.",
      hi: "Router-to-router link ko LAN jitna bada subnet de dena. /30 exactly do usable addresses deta hai, jitne link ko chahiye.",
    },
    {
      en: "Reading \"variably subnetted\" in the routing table as an error. It only means the router knows subnets of one network with different masks, which is normal with VLSM.",
      hi: "Routing table mein \"variably subnetted\" dekh kar use error samajhna. Iska matlab bas itna hai ki router ek network ke alag-alag masks wale subnets jaanta hai, jo VLSM mein normal hai.",
    },
  ],
  recap: [
    {
      en: "VLSM gives each subnet its own prefix, cut from one block, so nothing has to be sized for the largest LAN.",
      hi: "VLSM har subnet ko apna prefix deta hai, ek hi block se kaat kar, isliye har subnet ko sabse bade LAN jitna banane ki zaroorat nahi.",
    },
    {
      en: "Size each need with the smallest h where 2^h − 2 ≥ hosts; the prefix is 32 − h.",
      hi: "Har zaroorat ke liye sabse chhota h lo jahan 2^h − 2 ≥ hosts ho; prefix = 32 − h.",
    },
    {
      en: "Sort largest to smallest, and start each subnet one address after the previous broadcast.",
      hi: "Sabse bade se sabse chhote tak sort karo, aur har subnet pichle broadcast ke ek address baad shuru karo.",
    },
    {
      en: "A network address is always a multiple of its block size; largest first keeps every start aligned.",
      hi: "Network address hamesha apne block size ka multiple hota hai; largest first chalne se har start aligned rehta hai.",
    },
    {
      en: "Two subnets overlap if one range contains the other's network address; check before you configure.",
      hi: "Agar ek range mein doosre ka network address aa jaaye toh dono subnets overlap karte hain; configure karne se pehle check karo.",
    },
    {
      en: "The worked plan: 192.168.1.0/25, .128/26, .192/27, .224/30 and .228/30, with .232/29 and .240/28 free.",
      hi: "Worked plan yaad rakho: 192.168.1.0/25, .128/26, .192/27, .224/30 aur .228/30, aur .232/29 aur .240/28 khaali.",
    },
  ],
  quiz: [
    {
      q: {
        en: "You are allocating 192.168.50.0/24 largest first. LAN X (120 hosts) already has 192.168.50.0/25. LAN Y needs 55 hosts. Which subnet does LAN Y get?",
        hi: "Tum 192.168.50.0/24 ko largest first allocate kar rahe ho. LAN X (120 hosts) ko 192.168.50.0/25 mil chuka hai. LAN Y ko 55 hosts chahiye. LAN Y ko kaunsa subnet milega?",
      },
      options: [
        { en: "192.168.50.64/26", hi: "192.168.50.64/26" },
        { en: "192.168.50.128/25", hi: "192.168.50.128/25" },
        { en: "192.168.50.128/26", hi: "192.168.50.128/26" },
        { en: "192.168.50.126/26", hi: "192.168.50.126/26" },
      ],
      answer: 2,
      explain: {
        en: "55 hosts need 6 host bits (2⁶ − 2 = 62), so a /26. The next free address after the /25's broadcast (.127) is .128, which is a multiple of 64. 192.168.50.64/26 overlaps LAN X, a /25 wastes 64 addresses, and .126 is not a valid /26 network address.",
        hi: "55 hosts ke liye 6 host bits chahiye (2⁶ − 2 = 62), yaani /26. /25 ke broadcast (.127) ke baad next free address .128 hai, jo 64 ka multiple hai. 192.168.50.64/26 LAN X se overlap karta hai, /25 se 64 addresses waste honge, aur .126 valid /26 network address nahi hai.",
      },
      kind: "calc",
    },
    {
      q: { en: "Why do you allocate the largest subnet first in a VLSM plan?", hi: "VLSM plan mein sabse bada subnet pehle kyun allocate karte ho?" },
      options: [
        { en: "Routers forward traffic for larger subnets first", hi: "Routers bade subnets ka traffic pehle forward karte hain" },
        {
          en: "The end of a larger block always lands on a valid boundary for smaller blocks, so subnets stay aligned without overlaps",
          hi: "Bada block jahan khatam hota hai woh chhote blocks ke liye hamesha valid boundary hoti hai, isliye subnets bina overlap ke aligned rehte hain",
        },
        { en: "OSPF only advertises subnets allocated in size order", hi: "OSPF sirf size order mein allocate kiye gaye subnets advertise karta hai" },
        { en: "Larger subnets are required to use the lowest addresses of the block", hi: "Bade subnets ko block ke sabse chhote addresses hi use karne padte hain" },
      ],
      answer: 1,
      explain: {
        en: "Block sizes are powers of two, so after a larger block ends, the next address is a multiple of every smaller block size. Nothing requires big subnets to sit at low addresses; largest first is simply the order that avoids gaps and overlaps. Routing protocols do not care about allocation order.",
        hi: "Block sizes powers of two hote hain, isliye bada block khatam hone ke baad agla address har chhote block size ka multiple hota hai. Aisa koi rule nahi ki bade subnets low addresses par hi hon; largest first bas woh order hai jisse gaps aur overlaps nahi bante. Routing protocols ko allocation order se koi matlab nahi.",
      },
      kind: "concept",
    },
    {
      q: { en: "Which pair of subnets overlaps?", hi: "Subnets ka kaunsa pair overlap karta hai?" },
      options: [
        { en: "172.16.4.0/26 and 172.16.4.64/26", hi: "172.16.4.0/26 aur 172.16.4.64/26" },
        { en: "172.16.4.192/27 and 172.16.4.224/27", hi: "172.16.4.192/27 aur 172.16.4.224/27" },
        { en: "172.16.4.240/29 and 172.16.4.248/30", hi: "172.16.4.240/29 aur 172.16.4.248/30" },
        { en: "172.16.4.128/26 and 172.16.4.160/28", hi: "172.16.4.128/26 aur 172.16.4.160/28" },
      ],
      answer: 3,
      explain: {
        en: "172.16.4.128/26 runs from .128 to .191, and 172.16.4.160/28 (.160 to .175) sits inside it. In the other pairs the second subnet starts one address after the first one's broadcast, so they are neighbours, not overlaps.",
        hi: "172.16.4.128/26 .128 se .191 tak hai, aur 172.16.4.160/28 (.160 se .175) iske andar aa jaata hai. Baaki pairs mein doosra subnet pehle ke broadcast ke ek address baad shuru hota hai, toh woh padosi hain, overlap nahi.",
      },
      kind: "scenario",
    },
    {
      q: { en: "A WAN link between two routers is given 10.0.0.36/30. Which two addresses can the routers use?", hi: "Do routers ke beech ke WAN link ko 10.0.0.36/30 diya gaya hai. Routers kaunse do addresses use kar sakte hain?" },
      options: [
        { en: "10.0.0.37 and 10.0.0.38", hi: "10.0.0.37 aur 10.0.0.38" },
        { en: "10.0.0.36 and 10.0.0.37", hi: "10.0.0.36 aur 10.0.0.37" },
        { en: "10.0.0.37 and 10.0.0.39", hi: "10.0.0.37 aur 10.0.0.39" },
        { en: "10.0.0.38 and 10.0.0.39", hi: "10.0.0.38 aur 10.0.0.39" },
      ],
      answer: 0,
      explain: {
        en: "A /30 has block size 4, so 10.0.0.36/30 covers .36 to .39. .36 is the network address and .39 the broadcast, leaving .37 and .38 for the two router interfaces.",
        hi: "/30 ka block size 4 hai, toh 10.0.0.36/30 .36 se .39 tak hai. .36 network address hai aur .39 broadcast, toh dono router interfaces ke liye .37 aur .38 bachte hain.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "`show ip route` on R1 includes the line `192.168.1.0/24 is variably subnetted, 6 subnets, 4 masks`. What does it tell you?",
        hi: "R1 ke `show ip route` mein line hai `192.168.1.0/24 is variably subnetted, 6 subnets, 4 masks`. Isse kya pata chalta hai?",
      },
      options: [
        { en: "The subnets overlap and must be fixed", hi: "Subnets overlap kar rahe hain aur theek karne padenge" },
        { en: "R1 is running a classful routing protocol", hi: "R1 classful routing protocol chala raha hai" },
        { en: "R1 knows several subnets of 192.168.1.0/24 that use different prefix lengths", hi: "R1 192.168.1.0/24 ke kai subnets jaanta hai jo alag-alag prefix lengths use karte hain" },
        { en: "R1 has six interfaces in 192.168.1.0/24", hi: "R1 ke 192.168.1.0/24 mein chhe interfaces hain" },
      ],
      answer: 2,
      explain: {
        en: "IOS groups subnets under their classful network and says \"variably subnetted\" when they use more than one mask, which is exactly what VLSM produces. The count includes the /32 local routes, so it is not a count of interfaces, and the line says nothing about overlaps.",
        hi: "IOS subnets ko unke classful network ke neeche group karta hai aur jab ek se zyada masks hon toh \"variably subnetted\" likhta hai, aur VLSM se exactly yahi hota hai. Ginti mein /32 local routes bhi shaamil hain, isliye yeh interfaces ki ginti nahi hai, aur yeh line overlaps ke baare mein kuch nahi batati.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "From 10.10.0.0/24 you have allocated 10.10.0.0/25, 10.10.0.128/26 and 10.10.0.192/28. A new LAN needs 25 hosts. Which subnet should it get?",
        hi: "10.10.0.0/24 mein se tum 10.10.0.0/25, 10.10.0.128/26 aur 10.10.0.192/28 allocate kar chuke ho. Naye LAN ko 25 hosts chahiye. Use kaunsa subnet milna chahiye?",
      },
      options: [
        { en: "10.10.0.208/27", hi: "10.10.0.208/27" },
        { en: "10.10.0.192/27", hi: "10.10.0.192/27" },
        { en: "10.10.0.208/28", hi: "10.10.0.208/28" },
        { en: "10.10.0.224/27", hi: "10.10.0.224/27" },
      ],
      answer: 3,
      explain: {
        en: "25 hosts need a /27 (30 usable, block 32), and a /27 must start at a multiple of 32. 208 is not one, so 10.10.0.208/27 is not a valid network. 10.10.0.192/27 overlaps the existing /28, and a /28 holds only 14 hosts. 10.10.0.224/27 (.224 to .255) is free and aligned.",
        hi: "25 hosts ke liye /27 chahiye (30 usable, block 32), aur /27 ko 32 ke multiple par shuru hona padega. 208 multiple nahi hai, toh 10.10.0.208/27 valid network nahi hai. 10.10.0.192/27 pehle wale /28 se overlap karta hai, aur /28 mein sirf 14 hosts aate hain. 10.10.0.224/27 (.224 se .255) khaali bhi hai aur aligned bhi.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "z-JqCedc9EI",
      title: "Free CCNA | Subnetting (Part 3 - VLSM) | Day 15",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "VLSM explained and worked through step by step, largest subnet first.",
        hi: "VLSM ka explanation, step by step solve kiya hua, sabse bade subnet se shuru karke.",
      },
    },
    {
      id: "Rn_E1Qv8--I",
      title: "Free CCNA | Subnetting (VLSM) | Day 15 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "A Packet Tracer lab to practise a VLSM addressing plan after the lesson.",
        hi: "Lesson ke baad VLSM addressing plan practise karne ke liye Packet Tracer lab.",
      },
    },
    {
      id: "waeCwY1mc0k",
      title: "26. Free CCNA (NEW) | Subnetting in Hindi - VLSM",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "VLSM in Hindi with a worked example.",
        hi: "VLSM Hindi mein, ek worked example ke saath.",
      },
    },
    {
      id: "2w-TTnhqYMU",
      title: "35. VLSM Explained | CCNA 200-301 (Hindi)",
      channel: "NetworkPath",
      lang: "hi",
      note: {
        en: "A short CCNA-focused VLSM walkthrough in Hindi, from NetworkPath's CCNA 200-301 series.",
        hi: "NetworkPath ki CCNA 200-301 series se VLSM ka chhota, CCNA-focused walkthrough, Hindi mein.",
      },
    },
  ],
  lab: {
    title: { en: "Build and verify a VLSM plan in Packet Tracer", hi: "Packet Tracer mein VLSM plan banao aur verify karo" },
    steps: [
      {
        en: "On paper, write the VLSM table for 192.168.1.0/24 with LAN A (100), LAN B (50), LAN C (20) and two WAN links, before you open Packet Tracer.",
        hi: "Packet Tracer kholne se pehle paper par 192.168.1.0/24 ki VLSM table likho: LAN A (100), LAN B (50), LAN C (20) aur do WAN links.",
      },
      {
        en: "Place three 2911 routers. R1 has LAN A on Gi0/0 and LAN B on Gi0/1; R2 has LAN C on Gi0/0; WAN 1 joins R1 Gi0/2 to R2 Gi0/1; WAN 2 joins R2 Gi0/2 to R3 Gi0/0. Put a switch and a PC in each LAN.",
        hi: "Teen 2911 routers rakho. R1 ke Gi0/0 par LAN A aur Gi0/1 par LAN B; R2 ke Gi0/0 par LAN C; WAN 1 R1 Gi0/2 ko R2 Gi0/1 se jodta hai; WAN 2 R2 Gi0/2 ko R3 Gi0/0 se. Har LAN mein ek switch aur ek PC lagao.",
      },
      {
        en: "Configure each router interface with `ip address` and `no shutdown`. LAN interfaces and R1 on WAN 1 use the first usable address; R2 uses .226 on WAN 1 and .229 on WAN 2; R3 uses .230.",
        hi: "Har router interface par `ip address` aur `no shutdown` configure karo. LAN interfaces aur WAN 1 par R1 pehla usable address lete hain; R2 WAN 1 par .226 aur WAN 2 par .229 leta hai; R3 .230 leta hai.",
      },
      {
        en: "Give each PC the last usable address of its LAN (.126, .190 and .222) with the right mask, and its router interface as the gateway. Ping the gateway from each PC.",
        hi: "Har PC ko uske LAN ka last usable address do (.126, .190 aur .222), sahi mask ke saath, aur uske router interface ko gateway banao. Har PC se gateway ko ping karo.",
      },
      {
        en: "Run `show ip route connected` on R1 and R2. Match every C route to your table and find the \"variably subnetted\" line.",
        hi: "R1 aur R2 par `show ip route connected` chalao. Har C route ko apni table se match karo aur \"variably subnetted\" wali line dhoondho.",
      },
      {
        en: "On R1, enter `interface Loopback1` and try `ip address 192.168.1.97 255.255.255.224`. IOS should refuse it, because 192.168.1.96/27 overlaps LAN A on Gi0/0.",
        hi: "R1 par `interface Loopback1` mein jao aur `ip address 192.168.1.97 255.255.255.224` try karo. IOS ise reject karna chahiye, kyunki 192.168.1.96/27 Gi0/0 wale LAN A se overlap karta hai.",
      },
    ],
  },
};

export default lesson;
