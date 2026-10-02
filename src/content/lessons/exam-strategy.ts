import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "exam-strategy",
  intro: {
    en: "Knowing the material is most of passing the CCNA, but not all of it. People who know the topics well still fail because they run out of time, misread \"choose two\", or lose ten minutes in a simulation they could have verified in one. This lesson covers how the 200-301 exam works, a final four-week plan, and a routine for the day itself, so the exam measures what you know and not how you handle pressure.",
    hi: "CCNA pass karne ka zyada hissa material aana hai, lekin poora nahi. Bahut se log jinhe topics achhe se aate hain, phir bhi fail hote hain kyunki time khatam ho jaata hai, \"choose two\" galat padh lete hain, ya simulation mein das minute gawa dete hain jo ek minute mein verify ho sakta tha. Is lesson mein 200-301 exam kaise kaam karta hai, aakhri chaar hafton ka plan, aur exam ke din ka routine hai, taaki exam tumhara knowledge naape, pressure handle karne ka tareeka nahi.",
  },
  outcomes: [
    { en: "Describe the exam format: duration, question types, delivery options and the no-going-back rule", hi: "Exam format samjhana: duration, question types, delivery options aur wapas na jaa paane wala rule" },
    { en: "Use the six domain weights to decide where your remaining study hours go", hi: "Six domain weights se decide karna ki bache hue study hours kahan lagane hain" },
    { en: "Follow a four-week final plan with daily subnetting, labs, flashcards and timed practice exams", hi: "Daily subnetting, labs, flashcards aur timed practice exams ke saath chaar hafte ka final plan follow karna" },
    { en: "Budget time during the exam with checkpoints and a fixed routine for each question type", hi: "Exam ke dauran checkpoints aur har question type ke fixed routine se time budget karna" },
    { en: "Handle simulation questions: read the whole task, configure, verify with show commands, save", hi: "Simulation questions handle karna: poora task padho, configure karo, show commands se verify karo, save karo" },
  ],
  sections: [
    {
      id: "the-exam",
      heading: { en: "The exam in numbers", hi: "Exam numbers mein" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Item", hi: "Item" }, { en: "What to expect", hi: "Kya expect karo" }],
          rows: [
            [{ en: "Exam", hi: "Exam" }, { en: "200-301 CCNA, exam topics v1.1. One exam gives the certification.", hi: "200-301 CCNA, exam topics v1.1. Ek hi exam se certification milta hai." }],
            [{ en: "Time", hi: "Time" }, { en: "120 minutes", hi: "120 minutes" }],
            [{ en: "Questions", hi: "Questions" }, { en: "Not published by Cisco; candidates usually report roughly 100-120", hi: "Cisco publish nahi karta; candidates aam taur par lagbhag 100-120 batate hain" }],
            [{ en: "Passing score", hi: "Passing score" }, { en: "Not published. Scores are scaled; ignore exact pass marks quoted online", hi: "Publish nahi hota. Scores scaled hote hain; online bataye exact pass marks ko ignore karo" }],
            [{ en: "Navigation", hi: "Navigation" }, { en: "No going back: once you move on, you cannot return to a question", hi: "Wapas nahi jaa sakte: aage badh gaye toh pichle question par lautna mumkin nahi" }],
            [{ en: "Where", hi: "Kahan" }, { en: "Pearson VUE test centre, or online proctored (OnVUE) from home", hi: "Pearson VUE test centre, ya ghar se online proctored (OnVUE)" }],
            [{ en: "Price", hi: "Price" }, { en: "About US$300 plus local tax; check the price for your country when you book", hi: "Lagbhag US$300 plus local tax; book karte waqt apne desh ka price check karo" }],
            [{ en: "Validity", hi: "Validity" }, { en: "3 years. Recertify by passing a qualifying exam or earning 30 Continuing Education (CE) credits", hi: "3 saal. Qualifying exam pass karke ya 30 Continuing Education (CE) credits kama kar recertify karo" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "There is no calculator. You get an erasable note board at a test centre or an on-screen whiteboard online, which is why subnetting speed matters. If you fail, Cisco's retake policy makes you wait five calendar days before the next attempt. Policies and prices change, so confirm them on Cisco's certification pages when you book.",
            hi: "Calculator nahi milta. Test centre par erasable note board milta hai, online mein on-screen whiteboard, isiliye subnetting ki speed matter karti hai. Fail ho gaye toh Cisco ki retake policy ke hisaab se agle attempt se pehle paanch calendar din rukna padta hai. Policies aur prices badalte rehte hain, isliye book karte waqt Cisco ke certification pages par confirm kar lo.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "No going back changes how you answer", hi: "Wapas na jaa paana answer karne ka tareeka badal deta hai" },
          text: {
            en: "You cannot flag a question and return later. Every question gets your best answer before you click Next. A blank answer is always wrong; an educated guess after eliminating two options is right about half the time.",
            hi: "Question flag karke baad mein wapas nahi aa sakte. Next dabane se pehle har question ko apna best answer do. Khaali answer hamesha galat hai; do options eliminate karke lagaya gaya guess lagbhag aadhi baar sahi hota hai.",
          },
        },
      ],
    },
    {
      id: "question-types",
      heading: { en: "Question types and how to handle each", hi: "Question types aur har ek ko kaise handle karein" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Type", hi: "Type" }, { en: "What it looks like", hi: "Kaisa dikhta hai" }, { en: "How to handle it", hi: "Kaise handle karein" }],
          rows: [
            [{ en: "Multiple choice, single answer", hi: "Multiple choice, single answer" }, { en: "One correct option", hi: "Ek sahi option" }, { en: "Read the last line first to see what is asked, then eliminate", hi: "Pehle aakhri line padho ki poocha kya hai, phir eliminate karo" }],
            [{ en: "Multiple choice, multiple answer", hi: "Multiple choice, multiple answer" }, { en: "\"Choose two\" or \"Choose three\"", hi: "\"Choose two\" ya \"Choose three\"" }, { en: "Count your selections against the number asked before clicking Next", hi: "Next se pehle apne selections ko maange gaye number se milao" }],
            [{ en: "Drag and drop", hi: "Drag and drop" }, { en: "Match terms to definitions, or put steps in order", hi: "Terms ko definitions se match karo, ya steps ko order mein lagao" }, { en: "Place the items you are sure of first; the rest narrow down", hi: "Jo items pakke pata hain unhe pehle lagao; baaki ke options apne aap kam ho jaate hain" }],
            [{ en: "Simulation (lab)", hi: "Simulation (lab)" }, { en: "A simulated topology; you configure devices to meet a list of tasks", hi: "Simulated topology; tasks ki list poori karne ke liye devices configure karo" }, { en: "Read every task first, configure, verify with show, save", hi: "Pehle har task padho, configure karo, show se verify karo, save karo" }],
            [{ en: "Simlet", hi: "Simlet" }, { en: "A simulated network you can only inspect, with several questions about it", hi: "Simulated network jise sirf inspect kar sakte ho, us par kai questions" }, { en: "Read all the questions first, then run the show commands that answer them", hi: "Pehle saare questions padho, phir woh show commands chalao jo unka jawab dein" }],
            [{ en: "Testlet", hi: "Testlet" }, { en: "One scenario with several multiple-choice questions", hi: "Ek scenario, uske saath kai multiple-choice questions" }, { en: "All questions share the scenario; answer each before leaving the item", hi: "Saare questions ek hi scenario par hain; item chhodne se pehle har ek ka jawab do" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Watch Cisco's exam tutorial", hi: "Cisco ka exam tutorial dekho" },
          text: {
            en: "Cisco publishes a short exam tutorial that shows each question format and how the interface works. Watch it before exam day so the screen holds no surprises.",
            hi: "Cisco ek chhota exam tutorial publish karta hai jo har question format aur interface kaise chalta hai dikhata hai. Exam se pehle dekh lo taaki screen par koi surprise na ho.",
          },
        },
      ],
    },
    {
      id: "domain-weights",
      heading: { en: "Domain weights: where the marks are", hi: "Domain weights: marks kahan hain" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Domain", hi: "Domain" }, { en: "Weight", hi: "Weight" }, { en: "Course module", hi: "Course module" }],
          rows: [
            ["1.0 Network Fundamentals", "20%", "Modules 0-1: addressing, subnetting, IPv6, cabling, TCP/UDP"],
            ["2.0 Network Access", "20%", "Module 2: VLANs, trunks, STP, EtherChannel, wireless"],
            ["3.0 IP Connectivity", "25%", "Module 3: routing table, static routes, OSPF, FHRP"],
            ["4.0 IP Services", "10%", "Module 4: DHCP, DNS, NAT, NTP, SNMP, syslog, SSH, QoS"],
            ["5.0 Security Fundamentals", "15%", "Module 5: ACLs, port security, DHCP snooping, DAI, AAA, VPN"],
            ["6.0 Automation and Programmability", "10%", "Module 6: SDN, REST, JSON, Ansible/Terraform, AI"],
          ],
        },
        {
          type: "p",
          text: {
            en: "IP Connectivity, Network Fundamentals and Network Access together are 65% of the exam. They are also where the configuration and simulation questions mostly come from. Subnetting does not have its own domain, but it appears inside questions from almost every domain: an ACL wildcard, an OSPF network statement, a DHCP pool, a route lookup.",
            hi: "IP Connectivity, Network Fundamentals aur Network Access milkar exam ka 65% hain. Configuration aur simulation questions bhi zyada tar inhi se aate hain. Subnetting ka apna domain nahi hai, lekin lagbhag har domain ke questions mein chhupa hota hai: ACL wildcard, OSPF network statement, DHCP pool, route lookup.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Weights guide time, not skipping", hi: "Weights time decide karte hain, skip karna nahi" },
          text: {
            en: "A 10% domain is still around ten questions. Spend more hours on the 20-25% domains, but do not skip Automation or IP Services; they are usually the quickest marks to earn.",
            hi: "10% wala domain bhi lagbhag das questions hai. 20-25% wale domains par zyada ghante lagao, lekin Automation ya IP Services skip mat karo; aam taur par sabse jaldi marks wahin se milte hain.",
          },
        },
      ],
    },
    {
      id: "four-week-plan",
      heading: { en: "The final four weeks", hi: "Aakhri chaar hafte" },
      blocks: [
        {
          type: "p",
          text: {
            en: "This plan assumes you have worked through the course once. It does not teach new topics; it finds your weak spots and fixes them. Every day, whatever the week, do three small things: 15 minutes of subnetting without a calculator, 20 minutes of flashcards, and at least one Packet Tracer lab.",
            hi: "Yeh plan maanta hai ki tum course ek baar poora kar chuke ho. Yeh naye topics nahi sikhata; tumhare weak spots dhoondh kar unhe theek karta hai. Har din, hafta koi bhi ho, teen chhoti cheezein karo: bina calculator 15 minute subnetting, 20 minute flashcards, aur kam se kam ek Packet Tracer lab.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Week", hi: "Hafta" }, { en: "Focus", hi: "Focus" }, { en: "Labs", hi: "Labs" }, { en: "End-of-week check", hi: "Hafte ke end ka check" }],
          rows: [
            ["1", { en: "IP Connectivity and Network Fundamentals: reading routing tables, longest match, AD, OSPF, IPv4/IPv6 addressing", hi: "IP Connectivity aur Network Fundamentals: routing tables padhna, longest match, AD, OSPF, IPv4/IPv6 addressing" }, { en: "Static routes, single-area OSPF, IPv6 static routes", hi: "Static routes, single-area OSPF aur IPv6 static routes ke labs" }, { en: "Subnet any /24-/30 question in under 60 seconds", hi: "/24-/30 ka koi bhi subnet question 60 second se kam mein" }],
            ["2", { en: "Network Access: VLANs, trunks, STP and RSTP, EtherChannel, wireless architectures and WLC", hi: "Network Access: VLANs, trunks, STP aur RSTP, EtherChannel, wireless architectures aur WLC" }, { en: "VLAN/trunk/STP root, EtherChannel with LACP, router-on-a-stick", hi: "VLAN/trunk/STP root, LACP ke saath EtherChannel, router-on-a-stick" }, { en: "Predict STP root and port roles on paper, then check in the lab", hi: "STP root aur port roles paper par predict karo, phir lab mein check karo" }],
            ["3", { en: "IP Services, Security, Automation: NAT, DHCP, NTP, SNMP, syslog, QoS, ACLs, port security, DHCP snooping, DAI, REST, JSON", hi: "IP Services, Security aur Automation: NAT, DHCP, NTP, SNMP, syslog, QoS, ACLs, port security, DHCP snooping, DAI, REST aur JSON" }, { en: "PAT, standard and extended ACLs, port security, DHCP snooping", hi: "PAT, standard aur extended ACLs, port security, DHCP snooping" }, { en: "First full practice exam, timed at 120 minutes", hi: "Pehla full practice exam, 120 minute ke time ke saath" }],
            ["4", { en: "Your error log: every topic you got wrong in practice exams", hi: "Tumhara error log: practice exams mein jo bhi topic galat hua" }, { en: "The capstone branch build, from memory", hi: "Capstone branch build, yaad se" }, { en: "Two more timed practice exams; light review only in the last two days", hi: "Do aur timed practice exams; aakhri do din sirf halka review" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Keep an error log", hi: "Error log rakho" },
          text: {
            en: "For every practice question you miss, write one line: the topic, why you got it wrong (did not know, misread, ran out of time), and the fact you were missing. By week 4 this log is your revision list, and it is far shorter than the whole course.",
            hi: "Har practice question jo galat ho, uski ek line likho: topic, galat kyun hua (aata nahi tha, galat padha, time khatam), aur kaunsa fact missing tha. Week 4 tak yahi log tumhari revision list hai, aur yeh poore course se bahut chhota hai.",
          },
        },
      ],
    },
    {
      id: "in-the-exam",
      heading: { en: "Inside the exam: time and routine", hi: "Exam ke andar: time aur routine" },
      blocks: [
        {
          type: "p",
          text: {
            en: "With 120 minutes and roughly 100-120 items, you have about a minute per item, and simulations take several minutes each. Since you cannot go back, the only time control you have is your pace. Use four checkpoints, and check the clock only at them.",
            hi: "120 minute aur lagbhag 100-120 items ka matlab hai har item ke liye kareeb ek minute, aur har simulation kai minute leta hai. Wapas nahi jaa sakte, toh time par tumhara ek hi control hai: apni speed. Chaar checkpoints rakho, aur clock sirf unhi par dekho.",
          },
        },
        {
          type: "table",
          caption: { en: "Pace checkpoints", hi: "Pace checkpoints" },
          columns: [{ en: "Time used", hi: "Time used" }, { en: "Items done (at least)", hi: "Items done (kam se kam)" }, { en: "If you are behind", hi: "Agar peeche ho" }],
          rows: [
            ["30 min", { en: "A quarter", hi: "Ek chauthai" }, { en: "Stop rereading questions you already understood", hi: "Jo question samajh aa gaya use dobara padhna band karo" }],
            ["60 min", { en: "Half", hi: "Aadhe" }, { en: "Give stubborn multiple-choice items 90 seconds, then guess", hi: "Atke hue multiple-choice items ko 90 second do, phir guess" }],
            ["90 min", { en: "Three quarters", hi: "Teen chauthai" }, { en: "In a sim, finish required tasks before polishing", hi: "Sim mein pehle required tasks poore karo, polish baad mein" }],
            ["110 min", { en: "All, or nearly", hi: "Saare, ya lagbhag" }, { en: "Answer everything left; never leave a blank", hi: "Jo bacha hai sab answer karo; kuch khaali mat chhodo" }],
          ],
        },
        {
          type: "steps",
          items: [
            { en: "**Multiple choice**: read the question's last sentence first, then the scenario. Eliminate the options that are clearly wrong, choose, and check the number of answers asked for.", hi: "**Multiple choice**: pehle question ka aakhri sentence padho, phir scenario. Jo options saaf galat hain unhe eliminate karo, chuno, aur check karo kitne answers maange hain." },
            { en: "**Exhibits**: read the output the question points to (one interface, one route) instead of every line.", hi: "**Exhibits**: woh output padho jiski taraf question point kar raha hai (ek interface, ek route), har line nahi." },
            { en: "**Simulations**: read every task before typing. Note the device names and addresses on the note board. Configure one task at a time and verify it with a show command (`show ip interface brief`, `show vlan brief`, `show ip ospf neighbor`, `show ip route`). Change nothing you were not asked to change, and save the configuration if the simulator allows it.", hi: "**Simulations**: type karne se pehle har task padho. Device names aur addresses note board par likh lo. Ek-ek task configure karo aur show command se verify karo (`show ip interface brief`, `show vlan brief`, `show ip ospf neighbor`, `show ip route`). Jo badalne ko nahi kaha woh mat chhedo, aur simulator allow kare toh configuration save karo." },
            { en: "**When stuck**: eliminate, pick the best remaining option, and move on. A question that eats five minutes costs you four other questions.", hi: "**Jab atak jao**: eliminate karo, bacha hua best option chuno, aur aage badho. Paanch minute khane wala question chaar doosre questions ki keemat leta hai." },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Simulators are not full IOS", hi: "Simulator poora IOS nahi hai" },
          text: {
            en: "Some commands or shortcuts may not be supported in the exam simulator. If one is rejected, type the full command or use another way to get the same information, and do not waste time fighting it.",
            hi: "Exam simulator mein kuch commands ya shortcuts support nahi hote. Koi reject ho toh poora command type karo ya wahi information kisi aur tareeke se nikalo, usse ladne mein time waste mat karo.",
          },
        },
      ],
    },
    {
      id: "day-before-and-day-of",
      heading: { en: "The day before and the day itself", hi: "Ek din pehle aur exam ka din" },
      blocks: [
        {
          type: "list",
          items: [
            { en: "**Day before**: no new topics. Read your error log once and do a short flashcard session. Confirm the time, the address or the OnVUE link, and that your ID matches the name on your booking exactly.", hi: "**Ek din pehle**: koi naya topic nahi. Error log ek baar padho aur chhota flashcard session karo. Time, address ya OnVUE link confirm karo, aur check karo ki ID ka naam booking ke naam se bilkul match karta hai." },
            { en: "**Online exam**: run Pearson's system test on the exact computer and network you will use, clear the desk and the room, and close every other application. Do not use a work laptop with a VPN or strict security software.", hi: "**Online exam**: Pearson ka system test usi computer aur network par chalao jo use karoge, desk aur room khaali karo, aur baaki saari applications band karo. VPN ya strict security software wala office laptop use mat karo." },
            { en: "**Sleep** a full night. A tired brain subnets slowly and misreads \"NOT\".", hi: "**Neend** poori lo. Thaka hua dimaag dheere subnet karta hai aur \"NOT\" galat padhta hai." },
            { en: "**On the day**: eat beforehand, reach the test centre at least 15 minutes early (or start online check-in early, since OnVUE check-in opens 30 minutes before), and carry your ID.", hi: "**Exam ke din**: pehle kuch kha lo, test centre kam se kam 15 minute pehle pahuncho (ya online check-in jaldi shuru karo, OnVUE check-in 30 minute pehle khulta hai), aur ID saath rakho." },
            { en: "**First minute of the exam**: write a quick subnetting table (block sizes 128 64 32 16 8 4) on the note board if that helps you, then start.", hi: "**Exam ka pehla minute**: agar madad milti hai toh note board par jaldi se subnetting table (block sizes 128 64 32 16 8 4) likh lo, phir shuru karo." },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "If it does not go your way", hi: "Agar is baar nahi hua" },
          text: {
            en: "The score report shows how you did in each domain. Copy it into your error log, rework the weakest two domains for two to three weeks, and book again. Many good engineers passed on the second attempt.",
            hi: "Score report har domain mein tumhara performance dikhata hai. Use apne error log mein utaar lo, sabse kamzor do domains par do-teen hafte kaam karo, aur dobara book karo. Kaafi achhe engineers ne doosre attempt mein pass kiya hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Exam topics v1.1", def: { en: "Cisco's official list of what the 200-301 exam can test, grouped into six weighted domains.", hi: "Cisco ki official list ki 200-301 exam kya test kar sakta hai, six weighted domains mein grouped." } },
    { term: "Domain weight", def: { en: "The share of the exam a domain carries, for example 25% for IP Connectivity.", hi: "Exam mein kisi domain ka hissa, jaise IP Connectivity ka 25%." } },
    { term: "Simulation", def: { en: "A question with a simulated network where you configure devices to complete tasks.", hi: "Simulated network wala question jisme tasks poore karne ke liye devices configure karne hote hain." } },
    { term: "Simlet", def: { en: "A simulated network you inspect with show commands to answer several questions; you do not change it.", hi: "Simulated network jise show commands se inspect karke kai questions ke jawab dete ho; use badalte nahi." } },
    { term: "Testlet", def: { en: "One scenario followed by several multiple-choice questions about it.", hi: "Ek scenario jiske baad us par kai multiple-choice questions hote hain." } },
    { term: "OnVUE", def: { en: "Pearson VUE's online proctored delivery: you take the exam at home while a proctor watches through your webcam.", hi: "Pearson VUE ki online proctored delivery: exam ghar se dete ho aur proctor webcam se dekhta hai." } },
    { term: "CE credits", def: { en: "Continuing Education credits from approved training; 30 of them renew the CCNA instead of retaking an exam.", hi: "Approved training se milne wale Continuing Education credits; inke 30 credits exam dobara diye bina CCNA renew kar dete hain." } },
  ],
  mistakes: [
    {
      en: "Skipping a hard question to come back later. There is no coming back; answer every question before clicking Next.",
      hi: "Mushkil question ko baad ke liye chhod dena. Wapas aana hota hi nahi; Next dabane se pehle har question ka answer do.",
    },
    {
      en: "Selecting one answer on a \"Choose two\" question. Count the selections every time.",
      hi: "\"Choose two\" question par ek hi answer select karna. Har baar selections gino.",
    },
    {
      en: "Finishing a simulation without verifying. A typo in one address can fail the whole task; one show command catches it.",
      hi: "Simulation bina verify kiye khatam karna. Ek address ka typo poora task fail kar sakta hai; ek show command use pakad leta hai.",
    },
    {
      en: "Studying only the topics you like. The weights say IP Connectivity, Network Fundamentals and Network Access are 65% of the exam.",
      hi: "Sirf pasand ke topics padhna. Weights batate hain ki IP Connectivity, Network Fundamentals aur Network Access exam ka 65% hain.",
    },
    {
      en: "Memorising question dumps. They are against Cisco's exam agreement, can cost you the certification, and leave you unable to do the job.",
      hi: "Question dumps ratna. Yeh Cisco ke exam agreement ke khilaf hai, certification chheena ja sakta hai, aur job ka kaam phir bhi nahi aata.",
    },
    {
      en: "Cramming new topics the night before. Use the last two days for your error log, flashcards and sleep.",
      hi: "Exam se pehli raat naye topics ratna. Aakhri do din error log, flashcards aur neend ke liye rakho.",
    },
  ],
  recap: [
    { en: "200-301: 120 minutes, about 100-120 items (unpublished), no going back, scaled score, about US$300, valid 3 years.", hi: "200-301: 120 minute, lagbhag 100-120 items (publish nahi), wapas nahi jaa sakte, scaled score, lagbhag US$300, 3 saal valid." },
    { en: "Weights: Fundamentals 20, Access 20, IP Connectivity 25, IP Services 10, Security 15, Automation 10.", hi: "Weights yaad rakho: Fundamentals 20, Access 20, IP Connectivity 25, IP Services 10, Security 15 aur Automation 10." },
    { en: "Daily: 15 minutes subnetting without a calculator, flashcards, one lab. Weekly: a focus block and a check.", hi: "Roz: bina calculator 15 minute subnetting, flashcards, ek lab. Har hafte: ek focus block aur ek check." },
    { en: "Pace checkpoints at 30, 60, 90 and 110 minutes; answer everything; never leave a blank.", hi: "30, 60, 90 aur 110 minute par pace checkpoints; sab answer karo; kuch khaali mat chhodo." },
    { en: "Simulations: read all tasks, configure, verify with show commands, save.", hi: "Simulations: saare tasks padho, configure karo, show commands se verify karo, save karo." },
  ],
  quiz: [
    {
      q: { en: "Which CCNA 200-301 domain carries the largest weight?", hi: "CCNA 200-301 ke kaunse domain ka weight sabse zyada hai?" },
      options: [
        { en: "Network Fundamentals", hi: "Network Fundamentals" },
        { en: "Security Fundamentals", hi: "Security Fundamentals" },
        { en: "IP Connectivity", hi: "IP Connectivity" },
        { en: "Network Access", hi: "Network Access" },
      ],
      answer: 2,
      explain: {
        en: "IP Connectivity is 25%. Network Fundamentals and Network Access are 20% each, Security Fundamentals 15%, and IP Services and Automation 10% each.",
        hi: "IP Connectivity 25% hai. Network Fundamentals aur Network Access 20-20%, Security Fundamentals 15%, aur IP Services aur Automation 10-10%.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "On question 37 you are unsure between two options and would like to come back to it after finishing the rest. What should you do?",
        hi: "Question 37 par tum do options ke beech confused ho aur baaki khatam karke wapas aana chahte ho. Kya karna chahiye?",
      },
      options: [
        { en: "Choose the better of the two now; you cannot return to earlier questions", hi: "Abhi dono mein se behtar wala chuno; pichle questions par wapas nahi jaa sakte" },
        { en: "Flag it and use the review screen at the end", hi: "Flag karo aur end mein review screen use karo" },
        { en: "Leave it blank so it does not count against you", hi: "Khaali chhod do taaki tumhare khilaf count na ho" },
        { en: "Ask the proctor to reopen it later", hi: "Proctor se baad mein dobara kholne ko kaho" },
      ],
      answer: 0,
      explain: {
        en: "The CCNA does not let you go back, so there is no review screen to return to. A blank is simply wrong, while a choice between two plausible options is right about half the time.",
        hi: "CCNA wapas jaane nahi deta, toh lautne ke liye koi review screen nahi hai. Khaali answer seedha galat hai, jabki do sahi lagne wale options mein se chunna lagbhag aadhi baar sahi hota hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Your exam has 104 items. At the 60-minute mark you have finished 38. What does that tell you?",
        hi: "Tumhare exam mein 104 items hain. 60 minute par tumne 38 khatam kiye hain. Isse kya pata chalta hai?",
      },
      options: [
        { en: "You are ahead and can slow down", hi: "Tum aage ho aur dheere chal sakte ho" },
        { en: "You are exactly on pace", hi: "Tum bilkul sahi pace par ho" },
        { en: "Nothing; pace only matters in the last 10 minutes", hi: "Kuch nahi; pace sirf aakhri 10 minute mein matter karta hai" },
        { en: "You are behind: half the time is gone but only about a third of the items, so speed up", hi: "Tum peeche ho: aadha time gaya lekin sirf lagbhag ek tihai items hue, toh speed badhao" },
      ],
      answer: 3,
      explain: {
        en: "At 60 of 120 minutes you should have done at least half, 52 items. 38 is about 37%, so 66 items remain for 60 minutes. Stop over-checking easy items and cap stuck multiple-choice items at about 90 seconds.",
        hi: "120 mein se 60 minute par kam se kam aadhe, yaani 52 items hone chahiye. 38 lagbhag 37% hai, toh 60 minute mein 66 items bache hain. Aasaan items ko baar baar check karna band karo aur atke multiple-choice items ko lagbhag 90 second tak hi do.",
      },
      kind: "calc",
    },
    {
      q: { en: "How long is the CCNA valid, and how can you renew it?", hi: "CCNA kitne time valid hai, aur use renew kaise kar sakte ho?" },
      options: [
        { en: "Lifetime; no renewal is needed", hi: "Lifetime; renew ki zaroorat nahi" },
        { en: "3 years; pass a qualifying exam or earn 30 CE credits", hi: "3 saal; qualifying exam pass karo ya 30 CE credits kamao" },
        { en: "2 years; only by retaking 200-301", hi: "2 saal; sirf 200-301 dobara dekar" },
        { en: "5 years; by paying a renewal fee", hi: "5 saal; renewal fee bhar kar" },
      ],
      answer: 1,
      explain: {
        en: "Cisco certifications at this level last three years. You recertify with a qualifying exam or with 30 Continuing Education credits from approved training.",
        hi: "Is level ke Cisco certifications teen saal chalte hain. Recertify qualifying exam se ya approved training ke 30 Continuing Education credits se hota hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "In a simulation you have configured OSPF on two routers as asked. What is the best next step?",
        hi: "Simulation mein tumne poochhe gaye hisaab se do routers par OSPF configure kar diya. Sabse achha agla step kya hai?",
      },
      options: [
        { en: "Click Next straight away to save time", hi: "Time bachane ke liye seedha Next dabao" },
        { en: "Check `show ip ospf neighbor` and `show ip route`, fix anything missing, then save if allowed", hi: "`show ip ospf neighbor` aur `show ip route` check karo, jo missing hai theek karo, phir allow ho toh save karo" },
        { en: "Reload both routers to apply the change", hi: "Change apply karne ke liye dono routers reload karo" },
        { en: "Also configure EIGRP as a backup in case OSPF is wrong", hi: "OSPF galat ho toh backup ke liye EIGRP bhi configure kar do" },
      ],
      answer: 1,
      explain: {
        en: "Verification takes a minute and catches typos such as a wrong wildcard or area. Reloading wastes time and may lose unsaved work. Adding configuration you were not asked for can break the task.",
        hi: "Verification mein ek minute lagta hai aur galat wildcard ya area jaise typos pakad leta hai. Reload time barbaad karta hai aur unsaved kaam mita sakta hai. Jo nahi maanga woh configuration jodne se task toot sakta hai.",
      },
      kind: "scenario",
    },
    {
      q: { en: "What is the best use of the day before the exam?", hi: "Exam se ek din pehle ka sabse achha use kya hai?" },
      options: [
        { en: "Review your error log and flashcards lightly, confirm ID and booking details, and sleep well", hi: "Error log aur flashcards halke se dekho, ID aur booking details confirm karo, aur achhi neend lo" },
        { en: "Learn the topics you skipped, such as QoS, in one long session", hi: "Jo topics chhode the, jaise QoS, ek lambe session mein seekh lo" },
        { en: "Take three full practice exams back to back", hi: "Teen full practice exams lagataar do" },
        { en: "Memorise a question dump", hi: "Question dump ratt lo" },
      ],
      answer: 0,
      explain: {
        en: "One day is too short to learn a topic well, and exhaustion costs more marks than it gains. Dumps break Cisco's exam agreement. A light review, sorted logistics and sleep give you the most marks on the day.",
        hi: "Ek din mein koi topic theek se seekhna mushkil hai, aur thak kar exam dene se jitne marks milte hain usse zyada kat jaate hain. Dumps Cisco ke exam agreement ko todte hain. Halka review, logistics set aur poori neend exam ke din sabse zyada marks dilaate hain.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "4swmb5hUs_c",
      title: "My CCNA 200-301 exam experience: What's my score??",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Jeremy's own 200-301 attempt: question styles, time pressure and what surprised him. Recorded for the first version of 200-301; the format is the same.", hi: "Jeremy ka apna 200-301 attempt: question styles, time pressure aur kya surprising laga. 200-301 ke pehle version ke time record hua; format wahi hai." },
    },
    {
      id: "NbT_mdc3uko",
      title: "My CCNA 200-301 exam experience: Tips & Tricks",
      channel: "David Bombal",
      lang: "en",
      note: { en: "Practical tips from another instructor's attempt, including simulations and pacing.", hi: "Ek aur instructor ke attempt se practical tips, simulations aur pacing ke saath." },
    },
    {
      id: "PuhXTH58F2I",
      title: "How to crack CCNA Certification exam",
      channel: "Networkers Guru",
      lang: "hi",
      note: { en: "Hindi overview of the exam pattern, duration, validity and booking.", hi: "Exam pattern, duration, validity aur booking ka Hindi overview." },
    },
    {
      id: "AvCBuWaeGzY",
      title: "How to Apply for CCNA Exam in Hindi | How to Book CCNA Online Exam | How to Give CCNA Exam Online",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Step-by-step booking with Pearson VUE and what the online exam setup needs.", hi: "Pearson VUE par step-by-step booking aur online exam setup ke liye kya chahiye." },
    },
  ],
  lab: {
    title: { en: "Run a timed rehearsal", hi: "Timed rehearsal karo" },
    steps: [
      { en: "Set a timer for 15 minutes and subnet ten random addresses and prefixes (network, broadcast, first and last host). Record your time; repeat daily until it drops below a minute each.", hi: "15 minute ka timer lagao aur das random addresses aur prefixes subnet karo (network, broadcast, first aur last host). Time note karo; roz repeat karo jab tak har ek ek minute se kam na ho." },
      { en: "Rebuild the capstone branch from the previous lesson in Packet Tracer without notes, with a 45-minute limit, then run the verification checklist.", hi: "Pichle lesson ka capstone branch Packet Tracer mein bina notes ke, 45 minute ki limit ke saath dobara banao, phir verification checklist chalao." },
      { en: "Take a full practice exam in one sitting: 120 minutes, no going back, no calculator, phone in another room.", hi: "Ek baar mein full practice exam do: 120 minute, wapas jaana nahi, calculator nahi, phone doosre kamre mein." },
      { en: "Write every miss into your error log with its reason, and turn the three most common topics into next week's focus.", hi: "Har galti ko uski wajah ke saath error log mein likho, aur teen sabse common topics ko agle hafte ka focus banao." },
    ],
  },
};

export default lesson;
