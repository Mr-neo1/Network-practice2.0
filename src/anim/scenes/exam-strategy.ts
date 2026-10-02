import type { LayersScene, LayerRow } from "../types.ts";

// Domain blocks are split into two rows that each total 50%, so block widths stay
// proportional to the real weights across both rows (25/15/10 and 20/20/10).

const domainsA: LayerRow = {
  label: "50% of marks",
  blocks: [
    { id: "ipc", label: "IP Connectivity 25%", sub: "routing, OSPF, FHRP", tone: "blue", w: 25 },
    { id: "sec", label: "Security 15%", sub: "ACLs, L2 security, AAA", tone: "red", w: 15 },
    { id: "auto", label: "Automation 10%", sub: "SDN, REST, JSON", tone: "purple", w: 10 },
  ],
};

const domainsB: LayerRow = {
  label: "50% of marks",
  blocks: [
    { id: "fund", label: "Fundamentals 20%", sub: "addressing, IPv6, cabling", tone: "blue", w: 20 },
    { id: "acc", label: "Network Access 20%", sub: "VLANs, STP, wireless", tone: "blue", w: 20 },
    { id: "svc", label: "IP Services 10%", sub: "NAT, DHCP, NTP", tone: "teal", w: 10 },
  ],
};

const week1: LayerRow = {
  label: "Week 1",
  blocks: [
    { id: "d1", label: "Daily drills", sub: "subnet 15m, cards 20m", tone: "gray", w: 1.2 },
    { id: "w1a", label: "IP Connectivity", sub: "route lookup, AD, OSPF", tone: "blue", w: 2 },
    { id: "w1b", label: "Fundamentals", sub: "IPv4/IPv6, subnets", tone: "blue", w: 1.6 },
    { id: "w1c", label: "Check", sub: "subnet in < 60 s", tone: "green", w: 1.2 },
  ],
};

const week2: LayerRow = {
  label: "Week 2",
  blocks: [
    { id: "d2", label: "Daily drills", sub: "subnet 15m, cards 20m", tone: "gray", w: 1.2 },
    { id: "w2a", label: "Network Access", sub: "VLANs, STP, EtherChannel", tone: "blue", w: 2.6 },
    { id: "w2b", label: "Wireless", sub: "APs, WLC", tone: "blue", w: 1 },
    { id: "w2c", label: "Check", sub: "predict STP root", tone: "green", w: 1.2 },
  ],
};

const week3: LayerRow = {
  label: "Week 3",
  blocks: [
    { id: "d3", label: "Daily drills", sub: "subnet 15m, cards 20m", tone: "gray", w: 1.2 },
    { id: "w3a", label: "IP Services", sub: "NAT, DHCP, NTP, QoS", tone: "teal", w: 1.2 },
    { id: "w3b", label: "Security", sub: "ACLs, snooping, DAI", tone: "red", w: 1.2 },
    { id: "w3c", label: "Automation", sub: "REST, JSON, SDN", tone: "purple", w: 1.2 },
    { id: "w3d", label: "Practice exam 1", sub: "timed, 120 min", tone: "green", w: 1.2 },
  ],
};

const week4: LayerRow = {
  label: "Week 4",
  blocks: [
    { id: "d4", label: "Daily drills", sub: "subnet 15m, cards 20m", tone: "gray", w: 1.2 },
    { id: "w4a", label: "Error log", sub: "fix every miss", tone: "orange", w: 1.6 },
    { id: "w4b", label: "Capstone rebuild", sub: "from memory", tone: "blue", w: 1.6 },
    { id: "w4c", label: "Exams 2 and 3", sub: "timed, then review", tone: "green", w: 1.6 },
  ],
};

const scene: LayersScene = {
  kind: "layers",
  id: "exam-strategy",
  title: { en: "The CCNA exam: weights, a four-week plan, and the clock", hi: "CCNA exam: weights, chaar hafte ka plan, aur clock" },
  stack: ["The exam", "Domains", "4-week plan", "Exam day"],
  steps: [
    {
      title: { en: "The exam in five numbers", hi: "Paanch numbers mein exam" },
      text: {
        en: "One sitting of 120 minutes, roughly 100-120 items (Cisco does not publish the count), no way back to an earlier question, about US$300 plus tax, valid for 3 years. The no-going-back block is the one that changes how you answer.",
        hi: "120 minute ki ek sitting, lagbhag 100-120 items (Cisco count publish nahi karta), pichle question par wapas jaane ka raasta nahi, lagbhag US$300 plus tax, 3 saal valid. No-going-back wala block hi tumhara answer karne ka tareeka badalta hai.",
      },
      stackActive: "The exam",
      focus: ["back"],
      rows: [
        {
          label: "Format",
          blocks: [
            { id: "time", label: "120 minutes", sub: "one sitting", tone: "blue" },
            { id: "items", label: "~100-120 items", sub: "count varies", tone: "blue" },
            { id: "back", label: "No going back", sub: "no review", tone: "red" },
            { id: "price", label: "About US$300", sub: "plus local tax", tone: "gray" },
            { id: "valid", label: "Valid 3 years", sub: "renew by CE", tone: "green" },
          ],
        },
      ],
    },
    {
      title: { en: "Six domains, sized by weight", hi: "Six domains, weight ke hisaab se size" },
      text: {
        en: "Each block's width is its share of the exam. Both rows add up to 50%, so widths compare across rows: IP Connectivity at 25% is the widest block, and the two 10% blocks are the narrowest.",
        hi: "Har block ki width exam mein uska hissa hai. Dono rows ka total 50% hai, isliye rows ke beech bhi widths compare hoti hain: 25% wala IP Connectivity sabse chauda block hai, aur dono 10% wale sabse patle.",
      },
      stackActive: "Domains",
      rows: [domainsA, domainsB],
    },
    {
      title: { en: "65% sits in three domains", hi: "65% teen domains mein hai" },
      text: {
        en: "The highlighted blocks, IP Connectivity, Fundamentals and Network Access, are 25 + 20 + 20 = 65% and supply most simulations. The bar underneath is subnetting: it has no domain of its own but shows up inside ACL, OSPF, DHCP and routing questions everywhere.",
        hi: "Highlight kiye blocks, IP Connectivity, Fundamentals aur Network Access, 25 + 20 + 20 = 65% hain aur zyada tar simulations inhi se aate hain. Neeche wala bar subnetting hai: iska apna domain nahi, lekin ACL, OSPF, DHCP aur routing questions mein har jagah aata hai.",
      },
      stackActive: "Domains",
      focus: ["ipc", "fund", "acc"],
      rows: [domainsA, domainsB, { label: "Hidden in all", blocks: [{ id: "subnet", label: "Subnetting", sub: "wildcards, networks, routes", tone: "orange", w: 50 }] }],
    },
    {
      title: { en: "Six question formats", hi: "Six question formats" },
      text: {
        en: "Most items are multiple choice or drag and drop and take about a minute. The highlighted three take several minutes each: a simulation where you configure, a simlet you only inspect with show commands, and a testlet with several questions on one scenario. Your pace on the quick items has to leave time for them.",
        hi: "Zyada tar items multiple choice ya drag and drop hote hain aur lagbhag ek minute lete hain. Highlight kiye teen mein se har ek kai minute leta hai: simulation jisme configure karte ho, simlet jise sirf show commands se inspect karte ho, aur testlet jisme ek scenario par kai questions. Jaldi wale items par tumhari speed aisi ho ki inke liye time bache.",
      },
      stackActive: "The exam",
      focus: ["sim", "simlet", "testlet"],
      rows: [
        {
          label: "Formats",
          blocks: [
            { id: "mc1", label: "MCQ single", sub: "one answer", tone: "blue" },
            { id: "mc2", label: "MCQ multiple", sub: "choose two/three", tone: "blue" },
            { id: "dnd", label: "Drag and drop", sub: "match or order", tone: "blue" },
            { id: "sim", label: "Simulation", sub: "configure + verify", tone: "orange" },
            { id: "simlet", label: "Simlet", sub: "inspect with show", tone: "orange" },
            { id: "testlet", label: "Testlet", sub: "one scenario, many Qs", tone: "orange" },
          ],
        },
      ],
    },
    {
      title: { en: "Week 1: the biggest domain first", hi: "Week 1: sabse bada domain pehle" },
      text: {
        en: "Week 1 goes to IP Connectivity and Fundamentals, the 25% and 20% blocks. The grey block on the left is the daily drill that repeats every week: 15 minutes of subnetting without a calculator and 20 minutes of flashcards. The week ends with a check: any /24-/30 subnet in under a minute.",
        hi: "Week 1 IP Connectivity aur Fundamentals ko jaata hai, yaani 25% aur 20% wale blocks. Left ka grey block daily drill hai jo har hafte repeat hota hai: bina calculator 15 minute subnetting aur 20 minute flashcards. Hafte ke end mein check: koi bhi /24-/30 subnet ek minute se kam mein.",
      },
      stackActive: "4-week plan",
      focus: ["w1a", "w1b"],
      rows: [week1],
    },
    {
      title: { en: "Week 2: Network Access", hi: "Week 2: Network Access" },
      text: {
        en: "Week 2 adds the second 20% domain: VLANs, trunks, STP and EtherChannel in the lab, plus wireless architectures. The check is to predict the STP root and port roles on paper before confirming them in Packet Tracer.",
        hi: "Week 2 doosra 20% domain jodta hai: lab mein VLANs, trunks, STP aur EtherChannel, saath mein wireless architectures. Check yeh hai ki STP root aur port roles paper par predict karo, phir Packet Tracer mein confirm karo.",
      },
      stackActive: "4-week plan",
      focus: ["w2a", "w2b"],
      rows: [week1, week2],
    },
    {
      title: { en: "Week 3: the 10-15% domains and a first exam", hi: "Week 3: 10-15% wale domains aur pehla exam" },
      text: {
        en: "Week 3 covers IP Services, Security and Automation in one week, because together they are 35% but individually smaller. It ends with the first full practice exam, timed at 120 minutes with no going back, which starts your error log.",
        hi: "Week 3 ek hi hafte mein IP Services, Security aur Automation cover karta hai, kyunki milkar yeh 35% hain lekin alag alag chhote. Iska end pehle full practice exam se hota hai, 120 minute timed aur bina wapas jaaye, jisse tumhara error log shuru hota hai.",
      },
      stackActive: "4-week plan",
      focus: ["w3a", "w3b", "w3c", "w3d"],
      rows: [week1, week2, week3],
    },
    {
      title: { en: "Week 4: fix what the exams found", hi: "Week 4: exams ne jo pakda use theek karo" },
      text: {
        en: "Week 4 has no new topics. The orange block is the error log: every miss from practice exams, reworked in the lab. You rebuild the capstone branch from memory and sit two more timed exams, keeping the last two days light.",
        hi: "Week 4 mein koi naya topic nahi. Orange block error log hai: practice exams ki har galti, lab mein dobara kaam karke. Capstone branch yaad se dobara banate ho aur do aur timed exams dete ho, aakhri do din halke rakhte hue.",
      },
      stackActive: "4-week plan",
      focus: ["w4a", "w4b", "w4c"],
      rows: [week1, week2, week3, week4],
    },
    {
      title: { en: "The day before and the morning of", hi: "Ek din pehle aur exam ki subah" },
      text: {
        en: "The top row is the day before: one pass through the error log, short flashcards, ID and booking checked, Pearson's system test if you test online, and a full night's sleep. The bottom row is exam day: eat, arrive at least 15 minutes early or start OnVUE check-in when it opens, ID in hand.",
        hi: "Upar wali row ek din pehle ki hai: error log ek baar, chhote flashcards, ID aur booking check, online de rahe ho toh Pearson ka system test, aur poori raat ki neend. Neeche wali row exam ka din hai: kuch kha lo, kam se kam 15 minute pehle pahuncho ya OnVUE check-in khulte hi shuru karo, ID haath mein.",
      },
      stackActive: "Exam day",
      rows: [
        {
          label: "Day before",
          blocks: [
            { id: "b1", label: "Error log once", sub: "no new topics", tone: "orange" },
            { id: "b2", label: "Flashcards", sub: "short session", tone: "gray" },
            { id: "b3", label: "ID + booking", sub: "names must match", tone: "blue" },
            { id: "b4", label: "System test", sub: "OnVUE only", tone: "blue" },
            { id: "b5", label: "Sleep", sub: "full night", tone: "green" },
          ],
        },
        {
          label: "Exam day",
          blocks: [
            { id: "e1", label: "Eat first", sub: "120 min is long", tone: "green" },
            { id: "e2", label: "Arrive early", sub: "15+ min, or OnVUE -30", tone: "blue" },
            { id: "e3", label: "Note board", sub: "block sizes 128..4", tone: "orange" },
            { id: "e4", label: "Start", sub: "pace from item 1", tone: "blue" },
          ],
        },
      ],
    },
    {
      title: { en: "Inside the exam: the clock and the sim routine", hi: "Exam ke andar: clock aur sim routine" },
      text: {
        en: "The top row is the 120 minutes in four slices with the minimum progress at the end of each: a quarter of the items by 30 minutes, half by 60, three quarters by 90, everything answered by the end. The bottom row is the routine for every simulation: read all tasks, configure, verify with show commands, save.",
        hi: "Upar wali row 120 minute ke chaar hisse hain, har hisse ke end tak kam se kam kitna hona chahiye: 30 minute tak ek chauthai items, 60 tak aadhe, 90 tak teen chauthai, aur end tak sab answered. Neeche wali row har simulation ka routine hai: saare tasks padho, configure karo, show commands se verify karo, save karo.",
      },
      stackActive: "Exam day",
      focus: ["v3"],
      rows: [
        {
          label: "Minutes",
          blocks: [
            { id: "t1", label: "0-30 min", sub: "1/4 of items done", tone: "blue", w: 30 },
            { id: "t2", label: "30-60 min", sub: "1/2 done", tone: "blue", w: 30 },
            { id: "t3", label: "60-90 min", sub: "3/4 done", tone: "blue", w: 30 },
            { id: "t4", label: "90-120 min", sub: "all answered, no blanks", tone: "green", w: 30 },
          ],
        },
        {
          label: "Each sim",
          blocks: [
            { id: "v1", label: "Read all tasks", sub: "note names, IPs", tone: "orange" },
            { id: "v2", label: "Configure", sub: "one task at a time", tone: "orange" },
            { id: "v3", label: "Verify with show", sub: "catch the typo", tone: "green" },
            { id: "v4", label: "Save", sub: "if allowed", tone: "gray" },
          ],
        },
      ],
    },
  ],
};

export default scene;
