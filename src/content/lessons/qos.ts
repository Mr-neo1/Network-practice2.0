import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "qos",
  intro: {
    en: "A branch LAN runs at 1 Gbps, but its WAN circuit to head office is contracted at 100 Mbps. When a backup job, a video meeting and twenty phone calls all leave at once, packets pile up in the router's output queue. A file transfer does not mind waiting 200 ms; a phone call becomes unusable. QoS lets you decide which traffic waits, which is dropped and which goes first.",
    hi: "Branch ka LAN 1 Gbps par chalta hai, lekin head office tak ka WAN circuit sirf 100 Mbps ka contract hai. Jab backup job, video meeting aur bees phone calls ek saath nikalte hain, toh packets router ki output queue mein jama ho jaate hain. File transfer ko 200 ms wait karne se fark nahi padta; phone call bekaar ho jaati hai. QoS se tum decide karte ho ki kaunsa traffic wait karega, kaunsa drop hoga aur kaunsa sabse pehle jaayega.",
  },
  outcomes: [
    { en: "Explain how bandwidth, delay, jitter and loss affect voice, video and data, and quote the voice targets", hi: "Samjha sako ki bandwidth, delay, jitter aur loss voice, video aur data par kya asar daalte hain, aur voice ke targets bata sako" },
    { en: "Describe classification and marking with CoS, IP Precedence and DSCP, and decode values such as EF, AF41 and CS3", hi: "CoS, IP Precedence aur DSCP ke saath classification aur marking describe kar sako, aur EF, AF41, CS3 jaisi values decode kar sako" },
    { en: "Decide where the trust boundary sits and what happens to markings from an untrusted PC", hi: "Decide kar sako ki trust boundary kahan hai, aur untrusted PC ki markings ka kya hota hai" },
    { en: "Compare FIFO, CBWFQ and LLQ, and explain why voice goes in a policed priority queue", hi: "FIFO, CBWFQ aur LLQ compare kar sako, aur samjha sako ki voice policed priority queue mein kyun jaati hai" },
    { en: "Explain tail drop, TCP global synchronisation and how WRED avoids it", hi: "Tail drop, TCP global synchronisation aur WRED use kaise rokta hai, yeh samjha sako" },
    { en: "Choose between policing and shaping for a given link", hi: "Kisi link ke liye policing aur shaping mein se sahi choose kar sako" },
  ],
  sections: [
    {
      id: "why-qos",
      heading: { en: "Why QoS: congestion at the WAN edge", hi: "QoS kyun: WAN edge par congestion" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An interface can send only at its own speed. When packets arrive faster than that, they wait in the interface's **output queue**. This is **congestion**, and the usual place for it is the WAN edge: many 1 Gbps LAN ports feed one router interface whose traffic is limited to 100 Mbps by the provider contract. While the link is idle, every packet leaves at once and queuing has nothing to sort. Marking still happens on every packet, but it pays off only once a queue forms, because that is when the router has to choose who waits.",
            hi: "Koi bhi interface sirf apni speed par hi bhej sakta hai. Jab packets usse tez aate hain, toh woh interface ki **output queue** mein wait karte hain. Isi ko **congestion** kehte hain, aur yeh aam taur par WAN edge par hota hai: kai 1 Gbps LAN ports ek router interface ko feed karte hain, jiska traffic provider contract ki wajah se 100 Mbps tak limited hai. Link khaali ho toh har packet turant nikal jaata hai aur queuing ke paas sort karne ko kuch nahi hota. Marking toh har packet par hoti hai, lekin uska fayda tabhi milta hai jab queue banti hai, kyunki tabhi router ko decide karna padta hai ki kaun wait karega.",
          },
        },
        {
          type: "p",
          text: {
            en: "Four characteristics describe how well a network treats a flow:",
            hi: "Chaar cheezein batati hain ki network kisi flow ko kitna achhe se treat kar raha hai:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Bandwidth**: how many bits per second the link can carry. QoS cannot add bandwidth; it can guarantee a class a share of it during congestion.",
              hi: "**Bandwidth**: link kitne bits per second carry kar sakta hai. QoS bandwidth badha nahi sakta; woh congestion ke time kisi class ko uska share guarantee kar sakta hai.",
            },
            {
              en: "**Delay (latency)**: the one-way time from sender to receiver. Propagation and serialisation delay are fixed by the link; **queuing delay** is the part QoS controls.",
              hi: "**Delay (latency)**: sender se receiver tak one-way time. Propagation aur serialisation delay link se fix hote hain; **queuing delay** woh hissa hai jo QoS control karta hai.",
            },
            {
              en: "**Jitter**: the variation in delay between packets of the same flow. A phone sends a packet every 20 ms; if they arrive 5 ms, then 60 ms, then 15 ms apart, the call sounds choppy.",
              hi: "**Jitter**: same flow ke packets ke delay mein variation. Phone har 20 ms mein ek packet bhejta hai; agar woh 5 ms, phir 60 ms, phir 15 ms ke gap par pahunchein, toh call tooti-tooti sunai deti hai.",
            },
            {
              en: "**Loss**: the percentage of packets that never arrive, usually because a full queue dropped them. TCP retransmits; real-time voice cannot.",
              hi: "**Loss**: kitne percent packets pahunche hi nahi, aam taur par isliye ki full queue ne unhe drop kar diya. TCP retransmit kar leta hai; real-time voice nahi kar sakti.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Recommended targets for interactive voice", hi: "Interactive voice ke recommended targets" },
          columns: [{ en: "Characteristic", hi: "Characteristic" }, { en: "Target", hi: "Target" }],
          rows: [
            [{ en: "One-way delay", hi: "One-way delay" }, "≤ 150 ms"],
            ["Jitter", "≤ 30 ms"],
            [{ en: "Loss", hi: "Loss" }, "≤ 1%"],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Memorise 150 ms, 30 ms and 1% for voice. CCNA 4.7 asks you to explain the per-hop behaviour (PHB) tools: classification, marking, queuing, congestion avoidance, policing and shaping. Each router applies them independently to its own interfaces; this model is called **DiffServ**.",
            hi: "Voice ke liye 150 ms, 30 ms aur 1% yaad kar lo. CCNA 4.7 mein per-hop behaviour (PHB) tools samjhane hote hain: classification, marking, queuing, congestion avoidance, policing aur shaping. Har router inhe apne interfaces par alag se apply karta hai; is model ko **DiffServ** kehte hain.",
          },
        },
      ],
    },
    {
      id: "classify-and-mark",
      heading: { en: "Classification and marking", hi: "Classification aur marking" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Before a router can treat voice differently, it must recognise it. **Classification** sorts packets into classes. You can match on header fields with an **ACL** (for example, UDP from the voice VLAN 10.1.100.0/24; ACLs come in module 5), use **NBAR** (Network Based Application Recognition), which looks deeper into the packet to recognise applications, or match a marking that is already there.",
            hi: "Router voice ke saath alag bartav kare, usse pehle use voice pehchanni padegi. **Classification** packets ko classes mein baantta hai. Header fields ko **ACL** se match kar sakte ho (jaise voice VLAN 10.1.100.0/24 se aane wala UDP; ACLs module 5 mein aayenge), **NBAR** (Network Based Application Recognition) use kar sakte ho jo packet ke andar tak dekh kar application pehchanta hai, ya pehle se lagi marking match kar sakte ho.",
          },
        },
        {
          type: "p",
          text: {
            en: "Deep inspection on every router is expensive, so you classify once, near the source, and **mark** the result in a header field. Every later device just reads the mark. There are three fields to know:",
            hi: "Har router par deep inspection mehenga padta hai, isliye source ke paas ek baar classify karo aur result ko header field mein **mark** kar do. Aage ke saare devices bas mark padhte hain. Teen fields jaanne zaroori hain:",
          },
        },
        {
          type: "table",
          caption: { en: "Where markings live", hi: "Markings kahan rehti hain" },
          columns: [{ en: "Field", hi: "Field" }, { en: "Header", hi: "Header" }, { en: "Bits / values", hi: "Bits / values" }, { en: "Survives a router?", hi: "Router ke paar jaata hai?" }],
          rows: [
            ["CoS (PCP)", { en: "802.1Q tag (Layer 2)", hi: "802.1Q tag (Layer 2)" }, "3 bits, 0-7", { en: "No, the frame is rebuilt", hi: "Nahi, frame dobara banta hai" }],
            ["IP Precedence", { en: "IPv4 ToS byte (Layer 3)", hi: "IPv4 ToS byte (Layer 3)" }, "3 bits, 0-7", { en: "Yes", hi: "Haan" }],
            ["DSCP", { en: "IPv4 ToS / IPv6 Traffic Class", hi: "IPv4 ToS / IPv6 Traffic Class" }, "6 bits, 0-63", { en: "Yes", hi: "Haan" }],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**CoS** (Class of Service) is the 3-bit **PCP** (Priority Code Point) field in the 802.1Q tag, next to the 12-bit VLAN ID. It is also called **802.1p** priority. It exists only on tagged frames: on trunks and in a voice VLAN, not on an untagged access port or in the native VLAN. A Cisco IP phone marks its voice CoS 5, as you saw with the voice VLAN in lesson 2.1.",
              hi: "**CoS** (Class of Service) 802.1Q tag ka 3-bit **PCP** (Priority Code Point) field hai, jo 12-bit VLAN ID ke bagal mein hota hai. Ise **802.1p** priority bhi kehte hain. Yeh sirf tagged frames par hota hai: trunks par aur voice VLAN mein, untagged access port ya native VLAN mein nahi. Cisco IP phone apni voice ko CoS 5 mark karta hai, jaisa tumne lesson 2.1 mein voice VLAN ke saath dekha.",
            },
            {
              en: "**IP Precedence** is the old use of the first 3 bits of the IPv4 ToS byte. It has been replaced by DSCP but you still see it in older configs.",
              hi: "**IP Precedence** IPv4 ToS byte ke pehle 3 bits ka purana use hai. Ab iski jagah DSCP aa gaya hai, lekin purane configs mein abhi bhi dikhta hai.",
            },
            {
              en: "**DSCP** (Differentiated Services Code Point) uses the first 6 bits of the same byte, now called the DS field. The last 2 bits are ECN. Because DSCP sits in the IP header, it travels end to end across every router, which makes it the marking that matters on the WAN.",
              hi: "**DSCP** (Differentiated Services Code Point) usi byte ke pehle 6 bits use karta hai, jise ab DS field kehte hain. Aakhri 2 bits ECN ke hain. DSCP IP header mein hai, isliye woh har router ke paar end to end jaata hai, aur WAN par yahi marking kaam aati hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "CoS is lost at the first router", hi: "Pehle router par CoS kho jaata hai" },
          text: {
            en: "A router strips the Ethernet header and builds a new frame for the next link, so the 802.1Q tag and its CoS value are gone. That is why the WAN relies on DSCP. A Cisco IP phone sets both CoS 5 and DSCP EF. Where a device sets only CoS, the access switch can translate CoS to DSCP with its CoS-to-DSCP map, so the mark survives the router.",
            hi: "Router Ethernet header hata kar agle link ke liye naya frame banata hai, isliye 802.1Q tag aur uski CoS value chali jaati hai. Isi wajah se WAN par DSCP par hi bharosa kiya jaata hai. Cisco IP phone CoS 5 aur DSCP EF dono set karta hai. Jahan device sirf CoS set karta hai, wahan access switch apne CoS-to-DSCP map se CoS ko DSCP mein translate kar sakta hai, taaki mark router ke paar bhi bachi rahe.",
          },
        },
      ],
    },
    {
      id: "dscp-values",
      heading: { en: "Reading DSCP values: DF, EF, AF and CS", hi: "DSCP values padhna: DF, EF, AF aur CS" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Six bits give 64 values, but a few standard names cover almost everything you will meet:",
            hi: "Chhe bits se 64 values banti hain, lekin kuch standard naam lagbhag sab kuch cover kar lete hain:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**DF (Default Forwarding)** = DSCP 0: best effort. Anything not marked otherwise.",
              hi: "**DF (Default Forwarding)** = DSCP 0: best effort. Jo bhi alag se mark nahi hua, woh yahi hai.",
            },
            {
              en: "**EF (Expedited Forwarding)** = DSCP 46 (binary `101110`): low delay, low jitter, low loss. Used for voice.",
              hi: "**EF (Expedited Forwarding)** = DSCP 46 (binary `101110`): kam delay, kam jitter, kam loss. Voice ke liye use hota hai.",
            },
            {
              en: "**AF (Assured Forwarding)** = AFxy, where x is the class (1-4) and y is the **drop precedence** (1-3). Within a class, AFx3 is dropped before AFx2, and AFx2 before AFx1. The decimal value is **8x + 2y**.",
              hi: "**AF (Assured Forwarding)** = AFxy, jahan x class hai (1-4) aur y **drop precedence** hai (1-3). Ek class ke andar AFx3 pehle drop hota hai, phir AFx2, phir AFx1. Decimal value **8x + 2y** hoti hai.",
            },
            {
              en: "**CS (Class Selector)** = CS0-CS7, value 8 × n. These keep the first 3 bits equal to the old IP Precedence, so CS5 (40) means the same as IP Precedence 5 to an old device.",
              hi: "**CS (Class Selector)** = CS0-CS7, value 8 × n. Inke pehle 3 bits purane IP Precedence ke barabar rehte hain, isliye purane device ke liye CS5 (40) ka matlab wahi hai jo IP Precedence 5 ka.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "AF values: class across, drop precedence down (higher drop precedence is dropped first)", hi: "AF values: class left se right, drop precedence upar se neeche (zyada drop precedence pehle drop hota hai)" },
          columns: [{ en: "Drop precedence", hi: "Drop precedence" }, "Class 1", "Class 2", "Class 3", "Class 4"],
          rows: [
            [{ en: "Low (1)", hi: "Low (1)" }, "AF11 = 10", "AF21 = 18", "AF31 = 26", "AF41 = 34"],
            [{ en: "Medium (2)", hi: "Medium (2)" }, "AF12 = 12", "AF22 = 20", "AF32 = 28", "AF42 = 36"],
            [{ en: "High (3)", hi: "High (3)" }, "AF13 = 14", "AF23 = 22", "AF33 = 30", "AF43 = 38"],
          ],
        },
        {
          type: "table",
          caption: { en: "Common markings (Cisco and RFC 4594 recommendations)", hi: "Common markings (Cisco aur RFC 4594 recommendations)" },
          columns: [{ en: "Traffic", hi: "Traffic" }, "DSCP", { en: "Decimal", hi: "Decimal" }],
          rows: [
            [{ en: "Voice (the audio itself)", hi: "Voice (asli audio)" }, "EF", "46"],
            [{ en: "Interactive video", hi: "Interactive video" }, "AF41", "34"],
            [{ en: "Streaming video", hi: "Streaming video" }, "AF31", "26"],
            [{ en: "Call signalling (SIP, SCCP)", hi: "Call signalling (SIP, SCCP)" }, "CS3", "24"],
            [{ en: "Network control (routing protocols)", hi: "Network control (routing protocols)" }, "CS6", "48"],
            [{ en: "Best effort", hi: "Best effort" }, "DF", "0"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Decode AF without the table", hi: "Bina table ke AF decode karo" },
          text: {
            en: "AF32: class 3, drop precedence 2, so 8 × 3 + 2 × 2 = 28. In binary the class is the first 3 bits and the drop precedence the next 2: `011 10 0` = 28. Going the other way, DSCP 18 = 8 × 2 + 2 × 1, which is AF21.",
            hi: "AF32: class 3, drop precedence 2, toh 8 × 3 + 2 × 2 = 28. Binary mein class pehle 3 bits hai aur drop precedence agle 2: `011 10 0` = 28. Ulta chalo toh DSCP 18 = 8 × 2 + 2 × 1, yaani AF21.",
          },
        },
      ],
    },
    {
      id: "trust-boundary",
      heading: { en: "The trust boundary", hi: "Trust boundary" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Any host can write DSCP 46 into its own packets. If the network believed every PC, a user could put a large download into the voice queue. The **trust boundary** is the point where the network starts believing markings. Outside it, markings are ignored or overwritten; inside it, devices only read them and queue accordingly.",
            hi: "Koi bhi host apne packets mein DSCP 46 likh sakta hai. Agar network har PC ki baat maan le, toh user apna bada download voice queue mein daal dega. **Trust boundary** woh point hai jahan se network markings par bharosa karna shuru karta hai. Uske bahar markings ignore ya overwrite hoti hain; uske andar devices sirf unhe padhte hain aur usi hisaab se queue karte hain.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "The access switch port is the normal trust boundary. Ports with PCs are untrusted: the switch re-marks their traffic, usually to DSCP 0, or classifies it with an ACL or NBAR and marks it itself.",
              hi: "Normal trust boundary access switch ka port hota hai. PCs wale ports untrusted hote hain: switch unka traffic re-mark karta hai, aam taur par DSCP 0, ya ACL/NBAR se classify karke khud mark karta hai.",
            },
            {
              en: "When a Cisco IP phone is detected (through CDP), the switch can trust the phone's markings. The trust boundary is then **extended to the phone**.",
              hi: "Jab switch CDP se Cisco IP phone detect karta hai, toh woh phone ki markings trust kar sakta hai. Tab trust boundary **phone tak extend** ho jaati hai.",
            },
            {
              en: "The phone marks its own voice EF (CoS 5) and, by default, re-marks frames from the PC plugged into its PC port to CoS 0. So the PC still cannot promote itself.",
              hi: "Phone apni voice ko EF (CoS 5) mark karta hai aur by default apne PC port par lage PC ke frames ko CoS 0 kar deta hai. Isliye PC phir bhi khud ko promote nahi kar sakta.",
            },
            {
              en: "Distribution and core switches and the WAN routers trust the DSCP they receive and only queue on it.",
              hi: "Distribution aur core switches, aur WAN routers, jo DSCP milta hai use trust karte hain aur bas uske hisaab se queue karte hain.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Classify and mark as close to the source as possible, at the trust boundary. Do not trust markings from user PCs.",
            hi: "Classify aur mark jitna ho sake source ke paas karo, yaani trust boundary par. User PCs ki markings par trust mat karo.",
          },
        },
      ],
    },
    {
      id: "queuing",
      heading: { en: "Queuing: FIFO, CBWFQ and LLQ", hi: "Queuing: FIFO, CBWFQ aur LLQ" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Marking alone changes nothing. The router acts on marks when it **queues**: it places packets into several output queues by class, and a **scheduler** decides which queue sends next.",
            hi: "Sirf marking se kuch nahi badalta. Router marks par tab action leta hai jab woh **queue** karta hai: packets ko class ke hisaab se alag output queues mein daalta hai, aur ek **scheduler** decide karta hai ki agla packet kaunsi queue se jaayega.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Method", hi: "Method" }, { en: "How it works", hi: "Kaise kaam karta hai" }, { en: "Problem for voice", hi: "Voice ke liye problem" }],
          rows: [
            [
              "FIFO",
              { en: "One queue; first in, first out", hi: "Ek queue; jo pehle aaya, woh pehle gaya" },
              { en: "Voice waits behind every data packet", hi: "Voice har data packet ke peeche wait karti hai" },
            ],
            [
              "CBWFQ",
              { en: "One queue per class; each class is guaranteed a minimum share of bandwidth during congestion, served in weighted round robin", hi: "Har class ki apni queue; congestion mein har class ko minimum bandwidth share guarantee, weighted round robin se serve hoti hai" },
              { en: "Voice gets its bandwidth but still waits for its turn, so delay and jitter vary", hi: "Voice ko bandwidth milti hai lekin apni baari ka wait karti hai, isliye delay aur jitter badalte rehte hain" },
            ],
            [
              "LLQ",
              { en: "CBWFQ plus one **strict priority queue** that is always emptied first", hi: "CBWFQ plus ek **strict priority queue** jo hamesha sabse pehle khaali hoti hai" },
              { en: "None, as long as voice stays within the priority queue's rate", hi: "Koi nahi, jab tak voice priority queue ke rate ke andar rahe" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "A strict priority queue could starve every other class if it were allowed to grow. So LLQ **polices** the priority queue to its configured rate during congestion: voice up to that rate goes first, and anything above it is dropped. Size the priority class for the calls you expect, and use call admission control in the voice system so extra calls are refused instead of ruining every call.",
            hi: "Agar strict priority queue ko badhne diya jaaye, toh woh baaki saari classes ko starve kar degi. Isliye LLQ congestion ke time priority queue ko uske configured rate par **police** karta hai: us rate tak voice sabse pehle jaati hai, aur usse upar ka traffic drop hota hai. Priority class ko utni calls ke hisaab se size karo jitni expected hain, aur voice system mein call admission control use karo taaki extra calls reject ho jaayein, saari calls kharab na hon.",
          },
        },
        {
          type: "cli",
          title: { en: "LLQ on R1 with the MQC (beyond the exam: recognise it, no need to memorise)", hi: "MQC ke saath R1 par LLQ (exam se aage: pehchaan lo, ratna zaroori nahi)" },
          lines: [
            { prompt: "R1(config)#", cmd: "class-map match-any VOICE" },
            { prompt: "R1(config-cmap)#", cmd: "match dscp ef", comment: { en: "Classify on the mark set at the trust boundary", hi: "Trust boundary par lagi mark par classify karo" } },
            { prompt: "R1(config-cmap)#", cmd: "exit" },
            { prompt: "R1(config)#", cmd: "class-map match-any VIDEO" },
            { prompt: "R1(config-cmap)#", cmd: "match dscp af41" },
            { prompt: "R1(config-cmap)#", cmd: "exit" },
            { prompt: "R1(config)#", cmd: "policy-map WAN-QUEUING" },
            { prompt: "R1(config-pmap)#", cmd: "class VOICE" },
            { prompt: "R1(config-pmap-c)#", cmd: "priority percent 20", comment: { en: "LLQ: strict priority, policed to 20% during congestion", hi: "LLQ: strict priority, congestion mein 20% par policed" } },
            { prompt: "R1(config-pmap-c)#", cmd: "class VIDEO" },
            { prompt: "R1(config-pmap-c)#", cmd: "bandwidth percent 30", comment: { en: "CBWFQ: at least 30% during congestion", hi: "CBWFQ: congestion mein kam se kam 30%" } },
            { prompt: "R1(config-pmap-c)#", cmd: "class class-default" },
            { prompt: "R1(config-pmap-c)#", cmd: "bandwidth percent 25" },
            { prompt: "R1(config-pmap-c)#", cmd: "random-detect dscp-based", comment: { en: "WRED for the TCP traffic in class-default", hi: "class-default ke TCP traffic ke liye WRED" } },
          ],
          note: {
            en: "A class-map says what to match, a policy-map says what to do with each class, and `service-policy` attaches the policy to an interface (shown in the shaping example below). Queuing applies to outbound traffic.",
            hi: "Class-map batata hai kya match karna hai, policy-map batata hai har class ke saath kya karna hai, aur `service-policy` policy ko interface par lagata hai (neeche shaping example mein dikhega). Queuing outbound traffic par lagti hai.",
          },
        },
      ],
    },
    {
      id: "congestion-avoidance",
      heading: { en: "Congestion avoidance: tail drop, global synchronisation and WRED", hi: "Congestion avoidance: tail drop, global synchronisation aur WRED" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A queue has a finite size. When it is full, every new packet is dropped: this is **tail drop**. On a busy link the full queue drops packets from dozens of TCP sessions at the same moment.",
            hi: "Queue ka size limited hota hai. Full hone par har naya packet drop hota hai: isse **tail drop** kehte hain. Busy link par full queue ek hi pal mein dozens TCP sessions ke packets drop kar deti hai.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "Every affected TCP sender sees loss and cuts its window at the same time.",
              hi: "Har affected TCP sender ko loss dikhta hai aur sab ek saath apni window kam kar dete hain.",
            },
            {
              en: "The link is suddenly underused, so all of them grow their windows again together.",
              hi: "Link achanak khaali sa ho jaata hai, isliye sab phir ek saath window badhate hain.",
            },
            {
              en: "The queue fills again, tail drop hits all of them again, and the cycle repeats. This is **TCP global synchronisation**: the link swings between congested and half-empty.",
              hi: "Queue phir bhar jaati hai, tail drop phir sab par padta hai, aur cycle repeat hoti hai. Yahi **TCP global synchronisation** hai: link congested aur aadha khaali ke beech jhoolta rehta hai.",
            },
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**RED (Random Early Detection)** drops a few packets at random once the average queue depth passes a minimum threshold, before the queue is full. Only some TCP sessions slow down, at different times, so the link stays busy. Above the maximum threshold, every new packet is dropped, as with tail drop.",
              hi: "**RED (Random Early Detection)** average queue depth minimum threshold paar karte hi, queue full hone se pehle, kuch packets random drop karta hai. Sirf kuch TCP sessions alag-alag time par slow hote hain, isliye link busy rehta hai. Maximum threshold ke upar har naya packet drop hota hai, bilkul tail drop jaisa.",
            },
            {
              en: "**WRED (Weighted RED)** uses different thresholds per marking. With DSCP-based WRED, AF13 is dropped earlier than AF12, and AF12 earlier than AF11. This is what the AF drop precedence is for.",
              hi: "**WRED (Weighted RED)** har marking ke liye alag thresholds use karta hai. DSCP-based WRED mein AF13 pehle drop hota hai AF12 se, aur AF12 pehle AF11 se. AF drop precedence isi kaam ke liye hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "WRED helps TCP, not voice", hi: "WRED TCP ki madad karta hai, voice ki nahi" },
          text: {
            en: "RED works because TCP slows down when it loses a packet. Voice runs over UDP and does not slow down, so dropping it early only damages the call. Voice belongs in the priority queue, not in a WRED class.",
            hi: "RED isliye kaam karta hai kyunki packet loss par TCP slow ho jaata hai. Voice UDP par chalti hai aur slow nahi hoti, isliye use pehle drop karna sirf call kharab karta hai. Voice ki jagah priority queue hai, WRED class nahi.",
          },
        },
      ],
    },
    {
      id: "policing-shaping",
      heading: { en: "Policing and shaping", hi: "Policing aur shaping" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Both tools limit traffic to a rate, usually the **CIR** (Committed Information Rate) in the contract. The branch in this lesson has a 1 Gbps physical link to the provider but a 100 Mbps CIR. They differ in what they do with traffic above the rate.",
            hi: "Dono tools traffic ko ek rate tak limit karte hain, aam taur par contract ka **CIR** (Committed Information Rate). Is lesson ki branch ka provider tak physical link 1 Gbps ka hai, lekin CIR 100 Mbps hai. Fark yeh hai ki rate se upar wale traffic ke saath dono kya karte hain.",
          },
        },
        {
          type: "table",
          columns: ["", { en: "Policing", hi: "Policing" }, { en: "Shaping", hi: "Shaping" }],
          rows: [
            [{ en: "Excess traffic", hi: "Excess traffic" }, { en: "Dropped, or re-marked to a lower class", hi: "Drop, ya lower class mein re-mark" }, { en: "Buffered and sent later", hi: "Buffer hota hai aur baad mein jaata hai" }],
            [{ en: "Added delay", hi: "Extra delay" }, { en: "None (no buffer)", hi: "Nahi (koi buffer nahi)" }, { en: "Yes, packets wait in the shaping queue", hi: "Haan, packets shaping queue mein wait karte hain" }],
            [{ en: "Direction", hi: "Direction" }, { en: "Inbound or outbound", hi: "Inbound ya outbound" }, { en: "Outbound only", hi: "Sirf outbound" }],
            [{ en: "Typical use", hi: "Typical use" }, { en: "Provider enforcing the CIR on traffic from a customer; capping the LLQ priority queue", hi: "Provider customer ke traffic par CIR enforce karta hai; LLQ priority queue ko cap karna" }, { en: "Customer router sending at the CIR so the provider's policer has nothing to drop", hi: "Customer router CIR par bhejta hai taaki provider ke policer ke paas drop karne ko kuch na bache" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Without shaping, R1 sends bursts at 1 Gbps line rate and the provider's policer drops whatever exceeds 100 Mbps, voice included, because a policer enforcing the contract rate looks only at the rate, not at your markings. With R1 shaping to 100 Mbps, the excess waits in R1's own queues instead. Now R1's LLQ decides what waits, so voice still goes first.",
            hi: "Shaping ke bina R1 1 Gbps line rate par bursts bhejta hai aur provider ka policer 100 Mbps se upar jo bhi hai drop kar deta hai, voice bhi, kyunki contract rate enforce karne wala policer sirf rate dekhta hai, tumhari markings nahi. Jab R1 100 Mbps par shape karta hai, toh excess traffic R1 ki apni queues mein wait karta hai. Ab R1 ka LLQ decide karta hai kaun wait karega, isliye voice phir bhi pehle jaati hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Shape to the CIR and queue inside the shaper (beyond the exam)", hi: "CIR par shape karo aur shaper ke andar queue karo (exam se aage)" },
          lines: [
            { prompt: "R1(config)#", cmd: "policy-map WAN-SHAPER" },
            { prompt: "R1(config-pmap)#", cmd: "class class-default" },
            { prompt: "R1(config-pmap-c)#", cmd: "shape average 100000000", comment: { en: "Rate in bits per second: 100 Mbps", hi: "Rate bits per second mein: 100 Mbps" } },
            { prompt: "R1(config-pmap-c)#", cmd: "service-policy WAN-QUEUING", comment: { en: "The LLQ policy now works inside the 100 Mbps", hi: "LLQ policy ab 100 Mbps ke andar kaam karti hai" } },
            { prompt: "R1(config-pmap-c)#", cmd: "exit" },
            { prompt: "R1(config-pmap)#", cmd: "exit" },
            { prompt: "R1(config)#", cmd: "interface GigabitEthernet0/0/0" },
            { prompt: "R1(config-if)#", cmd: "service-policy output WAN-SHAPER" },
          ],
          note: {
            en: "On the provider side, a policer such as `police 100000000 conform-action transmit exceed-action drop` is applied inbound on the interface facing R1. `show policy-map interface GigabitEthernet0/0/0` shows per-class counters, queue depths and drops.",
            hi: "Provider side par `police 100000000 conform-action transmit exceed-action drop` jaisa policer R1 ki taraf wale interface par inbound lagta hai. `show policy-map interface GigabitEthernet0/0/0` har class ke counters, queue depth aur drops dikhata hai.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "A policer is a speed camera: anything too fast gets a fine (dropped or re-marked) on the spot, and nobody is slowed down. A shaper is a traffic signal at a highway on-ramp: cars wait at the light and enter one by one at a steady rate, so nobody is fined, but everybody waits a little.",
            hi: "Policer speed camera jaisa hai: jo bhi zyada tez hai, use wahin fine (drop ya re-mark) milta hai, aur kisi ko roka nahi jaata. Shaper highway on-ramp ka signal jaisa hai: gaadiyan light par rukti hain aur ek-ek karke steady rate par andar jaati hain, kisi ko fine nahi lagta, lekin sabko thoda wait karna padta hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Jitter", def: { en: "Variation in one-way delay between packets of the same flow; voice should stay at or below 30 ms.", hi: "Same flow ke packets ke one-way delay ka variation; voice ke liye 30 ms ya usse kam hona chahiye." } },
    { term: "DSCP", def: { en: "The 6-bit marking in the IP header (values 0-63) that routers use to choose a per-hop behaviour; EF 46 is voice.", hi: "IP header ki 6-bit marking (values 0-63) jisse routers per-hop behaviour choose karte hain; EF 46 voice ke liye hai." } },
    { term: "CoS (PCP)", def: { en: "The 3-bit priority field in the 802.1Q tag; it exists only on tagged frames and is lost at a router.", hi: "802.1Q tag ka 3-bit priority field; yeh sirf tagged frames par hota hai aur router par kho jaata hai." } },
    { term: "Trust boundary", def: { en: "The point in the network from which incoming markings are believed instead of being re-marked.", hi: "Network ka woh point jahan se aane wali markings ko re-mark karne ki jagah trust kiya jaata hai." } },
    { term: "LLQ", def: { en: "Low Latency Queuing: CBWFQ plus a strict priority queue, policed to its rate, for voice.", hi: "Low Latency Queuing: CBWFQ plus ek strict priority queue jo apne rate par policed hoti hai, voice ke liye." } },
    { term: "WRED", def: { en: "Weighted Random Early Detection: drops some TCP packets early, more for higher drop precedence, to avoid tail drop and global synchronisation.", hi: "Weighted Random Early Detection: kuch TCP packets pehle hi drop karta hai, zyada drop precedence wale pehle, taaki tail drop aur global synchronisation na ho." } },
    { term: "Policing", def: { en: "Enforcing a rate by dropping or re-marking traffic above it, without buffering.", hi: "Rate se upar ke traffic ko drop ya re-mark karke rate enforce karna, bina buffer ke." } },
    { term: "Shaping", def: { en: "Enforcing a rate on outbound traffic by buffering the excess and sending it later, which adds delay.", hi: "Outbound traffic par rate enforce karna, excess ko buffer karke baad mein bhej kar, jisse delay badhta hai." } },
  ],
  commands: [
    { cmd: "class-map match-any VOICE", mode: "Global configuration", does: { en: "Create a class map that matches if any of its match statements is true", hi: "Class map banao jo match ho jaaye agar uska koi bhi match statement true ho" } },
    { cmd: "match dscp ef", mode: "Class-map configuration", does: { en: "Classify packets already marked DSCP EF (46)", hi: "Pehle se DSCP EF (46) marked packets ko classify karo" } },
    { cmd: "policy-map WAN-QUEUING", mode: "Global configuration", does: { en: "Create a policy that says what to do with each class", hi: "Policy banao jo batati hai har class ke saath kya karna hai" } },
    { cmd: "class VOICE", mode: "Policy-map configuration", does: { en: "Enter the actions for one class inside the policy", hi: "Policy ke andar ek class ke actions mein jao" } },
    { cmd: "priority percent 20", mode: "Policy-map class configuration", does: { en: "Make this class the LLQ strict priority queue, policed to 20% during congestion", hi: "Is class ko LLQ strict priority queue banao, congestion mein 20% par policed" } },
    { cmd: "bandwidth percent 30", mode: "Policy-map class configuration", does: { en: "Guarantee this class at least 30% of the bandwidth during congestion (CBWFQ)", hi: "Congestion mein is class ko kam se kam 30% bandwidth guarantee karo (CBWFQ)" } },
    { cmd: "random-detect dscp-based", mode: "Policy-map class configuration", does: { en: "Enable WRED with drop thresholds per DSCP value", hi: "Har DSCP value ke drop thresholds ke saath WRED enable karo" } },
    { cmd: "shape average 100000000", mode: "Policy-map class configuration", does: { en: "Shape outbound traffic to 100 Mbps (value in bits per second)", hi: "Outbound traffic ko 100 Mbps par shape karo (value bits per second mein)" } },
    { cmd: "service-policy WAN-QUEUING", mode: "Policy-map class configuration", does: { en: "Nest a child queuing policy inside a shaping class", hi: "Shaping class ke andar child queuing policy nest karo" } },
    { cmd: "service-policy output WAN-SHAPER", mode: "Interface configuration", does: { en: "Apply a policy to traffic leaving the interface", hi: "Interface se bahar jaane wale traffic par policy lagao" } },
    { cmd: "police 100000000 conform-action transmit exceed-action drop", mode: "Policy-map class configuration", does: { en: "Police to 100 Mbps: send traffic within the rate, drop the excess", hi: "100 Mbps par police karo: rate ke andar wala traffic bhejo, excess drop karo" } },
    { cmd: "show policy-map interface GigabitEthernet0/0/0", mode: "Privileged EXEC", does: { en: "Show per-class matches, queue depth and drops for the policy on an interface", hi: "Interface ki policy ke har class ke matches, queue depth aur drops dikhao" } },
  ],
  mistakes: [
    {
      en: "Thinking QoS adds bandwidth. It only decides who waits and who is dropped when a queue forms. If the link is never congested, queuing changes nothing; if it is always congested, you need more bandwidth.",
      hi: "Yeh sochna ki QoS bandwidth badhata hai. Woh sirf decide karta hai ki queue banne par kaun wait karega aur kaun drop hoga. Link kabhi congested nahi hota toh queuing se kuch nahi badalta; hamesha congested rehta hai toh bandwidth badhani padegi.",
    },
    {
      en: "Mixing up CoS and DSCP. CoS is 3 bits in the 802.1Q tag and disappears at the first router; DSCP is 6 bits in the IP header and travels end to end.",
      hi: "CoS aur DSCP ko mix karna. CoS 802.1Q tag ke 3 bits hain aur pehle router par gayab ho jaata hai; DSCP IP header ke 6 bits hain aur end to end jaata hai.",
    },
    {
      en: "Reading AF13 as better than AF11. The second digit is drop precedence: AF13 is dropped first. And a high AF class is not a priority queue: AF41 only gets a CBWFQ share. Strict priority goes only to the class you put in the LLQ priority queue, normally EF voice.",
      hi: "AF13 ko AF11 se behtar samajhna. Doosra digit drop precedence hai: AF13 pehle drop hota hai. Aur bada AF class priority queue nahi hai: AF41 ko sirf CBWFQ share milta hai. Strict priority sirf us class ko milti hai jise tum LLQ priority queue mein daalte ho, normally EF voice.",
    },
    {
      en: "Saying shaping drops excess traffic. Policing drops or re-marks; shaping buffers and delays. Shaping works only outbound; policing works in either direction.",
      hi: "Yeh kehna ki shaping excess traffic drop karti hai. Policing drop ya re-mark karti hai; shaping buffer karke delay karti hai. Shaping sirf outbound kaam karti hai; policing dono directions mein.",
    },
    {
      en: "Putting voice in a CBWFQ `bandwidth` class. It gets its share but still waits its turn, so jitter grows. Voice needs the LLQ `priority` queue.",
      hi: "Voice ko CBWFQ `bandwidth` class mein daalna. Use share toh milta hai lekin apni baari ka wait karti hai, isliye jitter badhta hai. Voice ko LLQ `priority` queue chahiye.",
    },
    {
      en: "Trusting markings from user PCs. Any application can set DSCP 46; the trust boundary should re-mark untrusted ports.",
      hi: "User PCs ki markings trust karna. Koi bhi application DSCP 46 set kar sakti hai; trust boundary par untrusted ports ko re-mark karna chahiye.",
    },
  ],
  recap: [
    { en: "Queuing matters only during congestion; QoS cannot add bandwidth. Voice targets: one-way delay ≤ 150 ms, jitter ≤ 30 ms, loss ≤ 1%.", hi: "Queuing sirf congestion ke time kaam aati hai; QoS bandwidth nahi badha sakta. Voice targets: one-way delay ≤ 150 ms, jitter ≤ 30 ms, loss ≤ 1%." },
    { en: "Classify with ACLs or NBAR, then mark: CoS (3 bits, 802.1Q tag, lost at routers) or DSCP (6 bits, IP header, end to end).", hi: "ACL ya NBAR se classify karo, phir mark karo: CoS (3 bits, 802.1Q tag, router par kho jaata hai) ya DSCP (6 bits, IP header, end to end)." },
    { en: "DSCP: DF 0, EF 46 voice, AFxy = 8x + 2y (higher y dropped first), CSn = 8n. AF41 = 34, CS3 = 24, CS6 = 48.", hi: "DSCP: DF 0, EF 46 voice, AFxy = 8x + 2y (bada y pehle drop), CSn = 8n. AF41 = 34, CS3 = 24, CS6 = 48." },
    { en: "Mark at the trust boundary (access switch, extended to a Cisco IP phone); never trust user PCs.", hi: "Trust boundary par mark karo (access switch, Cisco IP phone tak extend); user PCs par kabhi trust mat karo." },
    { en: "FIFO: one queue. CBWFQ: guaranteed share per class. LLQ: CBWFQ plus a policed strict priority queue for voice.", hi: "FIFO: ek queue. CBWFQ: har class ka guaranteed share. LLQ: CBWFQ plus voice ke liye policed strict priority queue." },
    { en: "Tail drop causes TCP global synchronisation; WRED drops early by drop precedence. Policing drops/re-marks with no delay; shaping buffers outbound and adds delay.", hi: "Tail drop se TCP global synchronisation hota hai; WRED drop precedence ke hisaab se pehle drop karta hai. Policing bina delay drop/re-mark karti hai; shaping outbound buffer karti hai aur delay badhati hai." },
  ],
  quiz: [
    {
      q: {
        en: "A user's PC on an access port sets DSCP 46 on all of its file-transfer traffic. The port is outside the trust boundary. What should the access switch do?",
        hi: "Access port par laga ek user ka PC apne saare file-transfer traffic par DSCP 46 set karta hai. Port trust boundary ke bahar hai. Access switch ko kya karna chahiye?",
      },
      options: [
        { en: "Forward the marking unchanged so the WAN router can decide", hi: "Marking ko waise hi forward karo taaki WAN router decide kare" },
        { en: "Change the marking to CoS 5 so it matches the voice VLAN", hi: "Marking ko CoS 5 kar do taaki voice VLAN se match ho" },
        { en: "Re-mark the traffic, typically to DSCP 0, or classify it and mark it itself", hi: "Traffic ko re-mark karo, aam taur par DSCP 0, ya khud classify karke mark karo" },
        { en: "Drop every packet that carries DSCP 46", hi: "DSCP 46 wala har packet drop kar do" },
      ],
      answer: 2,
      explain: {
        en: "Markings from an untrusted port are not believed. The switch overwrites them (often to 0) or applies its own classification. Forwarding them unchanged would let the download take the voice priority queue, because routers inside the boundary trust whatever DSCP they receive.",
        hi: "Untrusted port ki markings par bharosa nahi kiya jaata. Switch unhe overwrite karta hai (aksar 0) ya apni classification lagata hai. Waise hi forward karne se download voice priority queue le lega, kyunki boundary ke andar ke routers jo DSCP milta hai use trust karte hain.",
      },
      kind: "scenario",
    },
    {
      q: { en: "What is the decimal DSCP value of AF31?", hi: "AF31 ki decimal DSCP value kya hai?" },
      options: [
        { en: "26", hi: "26" },
        { en: "30", hi: "30" },
        { en: "24", hi: "24" },
        { en: "34", hi: "34" },
      ],
      answer: 0,
      explain: {
        en: "AFxy = 8x + 2y, so AF31 = 8 × 3 + 2 × 1 = 26. 30 is AF33, 24 is CS3 and 34 is AF41.",
        hi: "AFxy = 8x + 2y, toh AF31 = 8 × 3 + 2 × 1 = 26. 30 AF33 hai, 24 CS3 hai aur 34 AF41 hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "Voice calls across a congested WAN link sound choppy. Voice is in a CBWFQ class with `bandwidth percent 20`, and the class never runs out of bandwidth. What change fixes the jitter?",
        hi: "Congested WAN link ke paar voice calls tooti-tooti sunai deti hain. Voice ek CBWFQ class mein hai jisme `bandwidth percent 20` hai, aur class ki bandwidth kabhi kam nahi padti. Jitter kaunsa change theek karega?",
      },
      options: [
        { en: "Raise the voice class to `bandwidth percent 40`", hi: "Voice class ko `bandwidth percent 40` kar do" },
        { en: "Enable WRED on the voice class", hi: "Voice class par WRED enable karo" },
        { en: "Replace queuing with a single FIFO queue", hi: "Queuing hata kar ek FIFO queue rakho" },
        { en: "Make voice the LLQ strict priority queue with `priority`", hi: "`priority` se voice ko LLQ strict priority queue banao" },
      ],
      answer: 3,
      explain: {
        en: "CBWFQ guarantees a share but voice still waits for the scheduler to reach its queue, so delay varies. LLQ sends priority packets before any other queue. More bandwidth does not remove that wait, WRED would drop voice, and FIFO puts voice behind every data packet.",
        hi: "CBWFQ share guarantee karta hai lekin voice ko scheduler ke apni queue tak aane ka wait karna padta hai, isliye delay badalta rehta hai. LLQ priority packets ko kisi bhi doosri queue se pehle bhejta hai. Zyada bandwidth woh wait khatam nahi karti, WRED voice drop karega, aur FIFO voice ko har data packet ke peeche daal deta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Many TCP sessions on a WAN link repeatedly slow down and speed up at the same moment, leaving the link half-used between peaks. What causes this, and what avoids it?",
        hi: "WAN link par kai TCP sessions baar-baar ek hi pal mein slow aur fast hote hain, aur peaks ke beech link aadha khaali rehta hai. Iski wajah kya hai, aur kya isse bachata hai?",
      },
      options: [
        { en: "Jitter, avoided by LLQ", hi: "Jitter, LLQ se bachav" },
        { en: "Tail drop causing global synchronisation, avoided by WRED", hi: "Tail drop se global synchronisation, WRED se bachav" },
        { en: "Policing, avoided by re-marking", hi: "Policing, re-marking se bachav" },
        { en: "CoS loss at the router, avoided by DSCP", hi: "Router par CoS ka kho jaana, DSCP se bachav" },
      ],
      answer: 1,
      explain: {
        en: "When a full queue tail-drops packets from all sessions at once, they all back off and recover together. WRED drops a few packets early and at random, so sessions slow down at different times and the link stays busy.",
        hi: "Jab full queue ek saath saare sessions ke packets tail-drop karti hai, toh sab ek saath back off karte hain aur ek saath recover karte hain. WRED kuch packets pehle aur random drop karta hai, isliye sessions alag-alag time par slow hote hain aur link busy rehta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1 has a 1 Gbps link to the provider but a 100 Mbps CIR. The provider drops everything above 100 Mbps, including voice. What should you configure outbound on R1?",
        hi: "R1 ka provider tak 1 Gbps link hai, lekin CIR 100 Mbps hai. Provider 100 Mbps se upar sab drop kar deta hai, voice bhi. R1 par outbound kya configure karna chahiye?",
      },
      options: [
        { en: "A policer at 100 Mbps, so the excess is dropped on R1 instead", hi: "100 Mbps ka policer, taaki excess R1 par hi drop ho" },
        { en: "Trust CoS on the WAN interface", hi: "WAN interface par CoS trust karo" },
        { en: "A shaper at 100 Mbps with the LLQ policy inside it", hi: "100 Mbps ka shaper jiske andar LLQ policy ho" },
        { en: "Nothing, because QoS cannot help when the provider drops traffic", hi: "Kuch nahi, kyunki provider traffic drop kare toh QoS kuch nahi kar sakta" },
      ],
      answer: 2,
      explain: {
        en: "Shaping buffers the excess on R1 and sends at 100 Mbps, so the provider's policer has nothing to drop. Because R1 is now the congestion point, its LLQ decides who waits and voice goes first. A policer on R1 would still drop packets, just one hop earlier.",
        hi: "Shaping excess ko R1 par buffer karke 100 Mbps par bhejti hai, isliye provider ke policer ke paas drop karne ko kuch nahi bachta. Ab R1 hi congestion point hai, toh uska LLQ decide karta hai kaun wait karega aur voice pehle jaati hai. R1 par policer phir bhi packets drop karta, bas ek hop pehle.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A policy-map on R1's congested WAN interface has `class VOICE` with `priority percent 20` under a 100 Mbps shaper. During congestion, phones send 30 Mbps of EF traffic. What happens?",
        hi: "R1 ke congested WAN interface ki policy-map mein 100 Mbps shaper ke neeche `class VOICE` ke saath `priority percent 20` hai. Congestion ke time phones 30 Mbps EF traffic bhejte hain. Kya hota hai?",
      },
      options: [
        { en: "All 30 Mbps is sent first, and the other classes get what is left", hi: "Poora 30 Mbps pehle jaata hai, aur baaki classes ko jo bacha woh milta hai" },
        { en: "Up to 20 Mbps is sent with strict priority; the excess is dropped", hi: "20 Mbps tak strict priority se jaata hai; excess drop hota hai" },
        { en: "Up to 20 Mbps is sent; the excess is buffered and sent later", hi: "20 Mbps tak jaata hai; excess buffer hokar baad mein jaata hai" },
        { en: "The excess voice is moved to class-default and sent with WRED", hi: "Excess voice class-default mein chali jaati hai aur WRED ke saath jaati hai" },
      ],
      answer: 1,
      explain: {
        en: "The LLQ priority queue is policed to its configured rate during congestion: 20% of 100 Mbps is 20 Mbps. Traffic above that is dropped, not buffered, so the priority queue cannot starve the other classes. This is why call admission control matters.",
        hi: "Congestion ke time LLQ priority queue apne configured rate par policed hoti hai: 100 Mbps ka 20% yaani 20 Mbps. Usse upar ka traffic drop hota hai, buffer nahi, isliye priority queue baaki classes ko starve nahi kar sakti. Isi wajah se call admission control zaroori hai.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "H6FKJMiiL6E",
      title: "Free CCNA | QoS (Part 1) | Day 46",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "IP phones, voice VLANs and PoE, then bandwidth, delay, jitter, loss, queuing and tail drop versus WRED.", hi: "IP phones, voice VLANs aur PoE, phir bandwidth, delay, jitter, loss, queuing aur tail drop vs WRED." },
    },
    {
      id: "4vurfhVjcMM",
      title: "Free CCNA | QoS (Part 2) | Day 47",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Classification, PCP and DSCP marking, trust boundaries, CBWFQ and LLQ, and policing versus shaping.", hi: "Classification, PCP aur DSCP marking, trust boundaries, CBWFQ aur LLQ, aur policing vs shaping." },
    },
    {
      id: "hLzjDAcyelk",
      title: "78. Free CCNA (NEW) | QoS - Quality of Service in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "An 11-minute Hindi overview of why QoS is needed and its main tools.", hi: "QoS kyun chahiye aur uske main tools ka 11 minute ka Hindi overview." },
    },
    {
      id: "C046rBFBeeM",
      title: "170. CCNA 200-301 Full Course in Hindi 2024 | QoS - Quality of Service",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "The channel's newer 22-minute QoS video, which the older video's description points to. Watch it for a fuller walkthrough.", hi: "Channel ka naya 22 minute ka QoS video; purane video ki description bhi isi ko point karti hai. Poora walkthrough chahiye toh yeh dekho." },
    },
  ],
  lab: {
    title: { en: "Build a WAN-edge QoS policy", hi: "WAN-edge QoS policy banao" },
    steps: [
      {
        en: "On paper first: write the DSCP decimal value for EF, AF41, AF32, AF13, CS3 and CS6, then check against the tables in this lesson.",
        hi: "Pehle paper par: EF, AF41, AF32, AF13, CS3 aur CS6 ki DSCP decimal value likho, phir is lesson ki tables se check karo.",
      },
      {
        en: "Build PC, IP phone and switch SW1 behind router R1, with R1 Gi0/0/0 towards a second router acting as the provider. Use the voice VLAN from lesson 2.1.",
        hi: "Router R1 ke peeche PC, IP phone aur switch SW1 lagao, aur R1 ka Gi0/0/0 doosre router ki taraf jo provider bane. Lesson 2.1 wala voice VLAN use karo.",
      },
      {
        en: "On R1 create the VOICE and VIDEO class-maps and the WAN-QUEUING policy-map from this lesson. If your simulator rejects a command, use a router image in Cisco Modeling Labs, GNS3 or real gear.",
        hi: "R1 par is lesson ke VOICE aur VIDEO class-maps aur WAN-QUEUING policy-map banao. Agar tumhara simulator koi command reject kare, toh Cisco Modeling Labs, GNS3 ya real gear ka router image use karo.",
      },
      {
        en: "Create WAN-SHAPER with `shape average 100000000` and the nested `service-policy WAN-QUEUING`, then apply it with `service-policy output WAN-SHAPER` on Gi0/0/0.",
        hi: "`shape average 100000000` aur nested `service-policy WAN-QUEUING` ke saath WAN-SHAPER banao, phir Gi0/0/0 par `service-policy output WAN-SHAPER` se apply karo.",
      },
      {
        en: "Generate traffic and run `show policy-map interface GigabitEthernet0/0/0`. Find which class each packet matched and where drops are counted.",
        hi: "Traffic generate karo aur `show policy-map interface GigabitEthernet0/0/0` chalao. Dekho har packet kis class mein match hua aur drops kahan count ho rahe hain.",
      },
    ],
  },
};

export default lesson;
