import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "ethernet-switching",
  intro: {
    en: "A switch has to send each frame out of the right port, but nobody tells it where the devices are. It works that out by watching the frames that arrive, builds a MAC address table from them, and uses that table to decide what to do with every frame. Once you know the rules, you can predict where any frame goes, read `show mac address-table`, and explain why a modern LAN has no collisions.",
    hi: "Switch ko har frame sahi port se bhejna hota hai, lekin koi use nahi batata ki kaunsa device kahan hai. Woh aane wale frames dekh kar khud yeh pata karta hai, unse MAC address table banata hai, aur har frame ka faisla usi table se karta hai. Rules samajh gaye toh tum predict kar paoge ki koi bhi frame kahan jayega, `show mac address-table` padh paoge, aur samjha paoge ki aaj ke LAN mein collisions kyun nahi hote.",
  },
  outcomes: [
    { en: "Explain how a switch learns MAC addresses from the source field of incoming frames", hi: "Samjha sako ki switch aane wale frames ke source field se MAC addresses kaise seekhta hai" },
    { en: "Predict whether a switch will forward, flood or filter a given frame", hi: "Predict kar sako ki switch kisi frame ko forward karega, flood karega ya filter karega" },
    { en: "Explain MAC aging and what happens to traffic when an entry ages out", hi: "MAC aging samjha sako, aur yeh bhi ki entry age out hone par traffic ka kya hota hai" },
    { en: "Read `show mac address-table` and find the port a device is on", hi: "`show mac address-table` padh sako aur pata kar sako ki device kis port par hai" },
    { en: "Count collision domains and broadcast domains in a small network", hi: "Chhote network mein collision domains aur broadcast domains gin sako" },
  ],
  sections: [
    {
      id: "hubs-vs-switches",
      heading: { en: "Why switches replaced hubs", hi: "Switches ne hubs ki jagah kyun le li" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Before switches, small LANs used hubs. A hub is a Layer 1 device: whatever bits arrive on one port, it repeats out of every other port. It never reads an address. Every device on a hub hears every frame, and only one device can transmit at a time. If two transmit together, the signals **collide**, both frames are ruined, and both senders wait a random time and try again. This listen, detect and retry method is **CSMA/CD**, and all the devices on one hub share a single **collision domain**.",
            hi: "Switches se pehle chhote LANs mein hubs use hote the. Hub ek Layer 1 device hai: ek port par jo bits aati hain, unhe woh baaki har port se repeat kar deta hai. Woh kabhi koi address nahi padhta. Hub par har device har frame sunta hai, aur ek time par sirf ek device transmit kar sakta hai. Do devices saath mein bhejein toh signals **collide** ho jaate hain, dono frames kharab ho jaate hain, aur dono senders random time wait karke dobara try karte hain. Sunna, collision pakadna aur retry karna, is tareeke ko **CSMA/CD** kehte hain, aur ek hub ke saare devices ek hi **collision domain** share karte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "A switch is a Layer 2 device. It reads the destination MAC address of each frame and sends the frame only out of the port where that device is. Each switch port is its own collision domain. With one device on a port, the link can run **full duplex**: both ends send and receive at the same time, collisions cannot happen, and CSMA/CD is not used.",
            hi: "Switch ek Layer 2 device hai. Woh har frame ka destination MAC address padhta hai aur frame sirf us port se bhejta hai jahan woh device hai. Switch ka har port apna alag collision domain hai. Port par ek hi device ho toh link **full duplex** chal sakta hai: dono ends ek saath send aur receive karte hain, collision ho hi nahi sakta, aur CSMA/CD ki zaroorat nahi padti.",
          },
        },
        {
          type: "table",
          caption: { en: "Hub vs switch", hi: "Hub vs switch" },
          columns: [{ en: "Feature", hi: "Feature" }, "Hub", "Switch"],
          rows: [
            [{ en: "OSI layer", hi: "OSI layer" }, "1 (bits)", "2 (frames)"],
            [{ en: "Reads MAC addresses", hi: "MAC address padhta hai" }, { en: "No", hi: "Nahi" }, { en: "Yes", hi: "Haan" }],
            [
              { en: "Where a frame goes", hi: "Frame kahan jaata hai" },
              { en: "Out of every other port", hi: "Baaki har port se" },
              { en: "Only to the destination's port, once it is known", hi: "Sirf destination ke port par, jab woh known ho" },
            ],
            [{ en: "Duplex", hi: "Duplex" }, { en: "Half only", hi: "Sirf half" }, { en: "Full (half only if the other end needs it)", hi: "Full (half sirf tab jab doosre end ko chahiye)" }],
            [{ en: "Collision domains", hi: "Collision domains" }, { en: "One for the whole hub", hi: "Poore hub ka ek" }, { en: "One per port", hi: "Har port ka ek" }],
            [{ en: "Broadcast domains", hi: "Broadcast domains" }, { en: "One", hi: "Ek" }, { en: "One per VLAN (all ports are in VLAN 1 by default)", hi: "Har VLAN ka ek (by default saare ports VLAN 1 mein)" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Hubs today", hi: "Aaj ke hubs" },
          text: {
            en: "You will not find hubs in a network built today. They still matter for the exam because they explain collision domains, and the animation uses one because it is the easiest way to see a switch filter a frame.",
            hi: "Aaj bane kisi network mein tumhe hub nahi milega. Exam ke liye yeh ab bhi zaroori hain kyunki inse collision domain samajh aata hai, aur animation mein ek hub isliye hai kyunki switch ko frame filter karte dekhne ka yeh sabse aasaan tareeka hai.",
          },
        },
      ],
    },
    {
      id: "mac-learning",
      heading: { en: "Learning: the source address", hi: "Learning: source address se" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A new switch knows nothing about where devices are. It builds its **MAC address table** (also called the CAM table) by watching traffic. Every time a frame arrives, the switch reads the frame's **source** MAC address and records it together with the port the frame came in on and that port's VLAN. That is the only way it learns.",
            hi: "Naye switch ko kuch nahi pata ki kaunsa device kahan hai. Woh traffic dekh dekh kar apni **MAC address table** (ise CAM table bhi kehte hain) banata hai. Jab bhi koi frame aata hai, switch uska **source** MAC address padhta hai aur use us port aur us port ke VLAN ke saath note kar leta hai jis par frame aaya. Seekhne ka sirf yahi ek tareeka hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "Entries learned this way have Type **DYNAMIC**. Entries added by an administrator, or kept by the switch for its own use, are **STATIC**.",
              hi: "Is tarah seekhi gayi entries ka Type **DYNAMIC** hota hai. Admin ki daali hui entries, ya switch ki apne kaam ke liye rakhi entries, **STATIC** hoti hain.",
            },
            {
              en: "The destination address is never learned. The switch uses it only to decide where the frame goes.",
              hi: "Destination address kabhi seekha nahi jaata. Switch usse sirf yeh decide karta hai ki frame kahan jayega.",
            },
            {
              en: "If a MAC address shows up on a different port (a laptop moved to another desk), the switch moves the entry to the new port.",
              hi: "Agar koi MAC address kisi doosre port par dikhe (laptop doosri desk par shift hua), toh switch entry ko naye port par shift kar deta hai.",
            },
            {
              en: "One port can hold many MAC addresses. That happens when another switch, or a hub, sits behind it.",
              hi: "Ek port par kai MAC addresses ho sakte hain. Aisa tab hota hai jab us port ke peeche koi doosra switch ya hub ho.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "A silent device is never learned", hi: "Jo device chup hai, woh seekha nahi jaata" },
          text: {
            en: "A switch learns a device only when that device sends a frame. If a printer has sent nothing since the switch booted, it has no entry, and frames sent to it are flooded.",
            hi: "Switch kisi device ko tabhi seekhta hai jab woh device frame bhejta hai. Agar printer ne switch boot hone ke baad kuch nahi bheja, toh uski entry nahi hogi, aur uske liye aane wale frames flood honge.",
          },
        },
      ],
    },
    {
      id: "forward-flood-filter",
      heading: { en: "Forward, flood or filter", hi: "Forward, flood ya filter" },
      blocks: [
        {
          type: "p",
          text: {
            en: "After learning the source, the switch looks up the frame's **destination** MAC in the table. The result decides what happens to the frame.",
            hi: "Source seekhne ke baad switch frame ka **destination** MAC table mein dhoondhta hai. Jo result aata hai, usi se decide hota hai ki frame ka kya hoga.",
          },
        },
        {
          type: "table",
          caption: { en: "The switch's decision for each kind of destination", hi: "Har tarah ke destination ke liye switch ka faisla" },
          columns: [{ en: "Destination MAC", hi: "Destination MAC" }, { en: "Action", hi: "Action" }, { en: "Who receives the frame", hi: "Frame kisko milta hai" }],
          rows: [
            [
              { en: "Known unicast, on another port", hi: "Known unicast, doosre port par" },
              "**Forward**",
              { en: "Only the port in the table entry", hi: "Sirf woh port jo table entry mein hai" },
            ],
            [
              { en: "Known unicast, on the port the frame came in on", hi: "Known unicast, usi port par jahan se frame aaya" },
              "**Filter**",
              { en: "Nobody: the switch drops it", hi: "Kisi ko nahi: switch drop kar deta hai" },
            ],
            [
              { en: "Unknown unicast (not in the table)", hi: "Unknown unicast (table mein nahi)" },
              "**Flood**",
              { en: "Every port in the VLAN except the incoming one", hi: "VLAN ka har port, incoming port chhod kar" },
            ],
            [
              { en: "Broadcast `FFFF.FFFF.FFFF`", hi: "Broadcast `FFFF.FFFF.FFFF`" },
              "**Flood**",
              { en: "Every port in the VLAN except the incoming one", hi: "VLAN ka har port, incoming port chhod kar" },
            ],
            [
              { en: "Multicast", hi: "Multicast" },
              "**Flood**",
              {
                en: "Same as broadcast, unless a feature such as IGMP snooping limits it (beyond the CCNA)",
                hi: "Broadcast jaisa hi, jab tak IGMP snooping jaisa feature ise limit na kare (CCNA se aage ka topic)",
              },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Filtering needs a port with more than one device behind it. In the animation, PC-C and PC-D share a hub on Fa0/3. When PC-C sends to PC-D, the hub repeats the frame to SW1 too. SW1 finds `0050.56aa.0004` on Fa0/3, the port the frame arrived on, and drops it: PC-D already has it.",
            hi: "Filtering ke liye aisa port chahiye jiske peeche ek se zyada devices hon. Animation mein PC-C aur PC-D ek hub share karte hain jo Fa0/3 par laga hai. Jab PC-C, PC-D ko frame bhejta hai, hub woh frame SW1 ko bhi repeat kar deta hai. SW1 ko `0050.56aa.0004` Fa0/3 par milta hai, yaani usi port par jahan se frame aaya, toh woh frame drop kar deta hai: PC-D ke paas frame pehle hi pahunch chuka hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Flooding means every port **in the same VLAN** except the port the frame came in on. A switch never sends a frame back out of its incoming port, and never floods it into other VLANs.",
            hi: "Flooding ka matlab hai **same VLAN** ka har port, sirf us port ko chhod kar jahan se frame aaya. Switch kabhi frame ko incoming port se wapas nahi bhejta, aur doosre VLANs mein kabhi flood nahi karta.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Why loops are dangerous", hi: "Loops khatarnak kyun hain" },
          text: {
            en: "If switches are cabled in a loop, a broadcast is flooded round it again and again, because an Ethernet frame has no TTL to make it expire. Spanning Tree (lesson 2.6) blocks redundant links to stop this.",
            hi: "Agar switches loop mein cable kiye gaye hon, toh broadcast us loop mein baar baar flood hota rehta hai, kyunki Ethernet frame mein koi TTL nahi hota jo use khatam kare. Spanning Tree (lesson 2.6) redundant links block karke yeh rokta hai.",
          },
        },
      ],
    },
    {
      id: "mac-aging",
      heading: { en: "MAC aging: forgetting on purpose", hi: "MAC aging: jaan-boojh kar bhoolna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Dynamic entries do not stay forever. Each one has a timer, and on Cisco Catalyst switches the default **aging time is 300 seconds** (5 minutes). Every frame that arrives from that source MAC resets its timer. If no frame from that MAC arrives for 300 seconds, the switch deletes the entry. Frames sent to that MAC are then flooded until the device sends again and is learned again.",
            hi: "Dynamic entries hamesha nahi rehti. Har entry ka ek timer hota hai, aur Cisco Catalyst switches par default **aging time 300 seconds** (5 minute) hai. Us source MAC se aane wala har frame timer reset kar deta hai. 300 seconds tak us MAC se koi frame nahi aaya, toh switch entry delete kar deta hai. Uske baad us MAC ke liye aane wale frames flood hote hain, jab tak device dobara kuch bhej kar phir se seekha na jaaye.",
          },
        },
        {
          type: "p",
          text: {
            en: "Why forget at all? Devices are unplugged, moved and replaced, and the table has a fixed size (about 8,000 entries on a Catalyst 2960, more on bigger models). Aging clears out stale entries so the table stays accurate and has room for devices that are active.",
            hi: "Bhoolna hi kyun? Devices unplug hote hain, shift hote hain, replace hote hain, aur table ka size fixed hota hai (Catalyst 2960 par lagbhag 8,000 entries, bade models par zyada). Aging purani entries hata deti hai, taaki table sahi rahe aur active devices ke liye jagah bani rahe.",
          },
        },
        {
          type: "cli",
          title: { en: "Checking and changing the aging time", hi: "Aging time check karna aur badalna" },
          lines: [
            { prompt: "SW1#", cmd: "show mac address-table aging-time" },
            { out: "Global Aging Time:  300" },
            { prompt: "SW1#", cmd: "configure terminal" },
            { prompt: "SW1(config)#", cmd: "mac address-table aging-time 600", comment: { en: "Seconds. Rarely needed; the default suits most networks", hi: "Seconds mein. Kam hi zaroorat padti hai; default zyada tar networks ke liye theek hai" } },
            { prompt: "SW1(config)#", cmd: "end" },
            { prompt: "SW1#", cmd: "clear mac address-table dynamic", comment: { en: "Deletes every dynamic entry now. Handy in labs", hi: "Saari dynamic entries abhi delete karta hai. Labs mein kaam ka hai" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "MAC flooding attack", hi: "MAC flooding attack" },
          text: {
            en: "When the table is full, new MACs cannot be learned, so frames to them are flooded. An attacker can send thousands of frames with fake source MACs to fill the table and then receive traffic meant for others. Port security (lesson 5.6) limits how many MACs a port may learn.",
            hi: "Table full ho jaaye toh naye MACs seekhe nahi ja sakte, isliye unke liye frames flood hote hain. Attacker fake source MACs wale hazaaron frames bhej kar table bhar sakta hai, aur phir doosron ka traffic receive kar sakta hai. Port security (lesson 5.6) limit karti hai ki ek port kitne MACs seekh sakta hai.",
          },
        },
      ],
    },
    {
      id: "reading-the-table",
      heading: { en: "Reading show mac address-table", hi: "show mac address-table padhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "This is SW1 from the animation after all four PCs have sent a frame. The `dynamic` keyword hides the static entries the switch keeps for itself, so you see only the hosts it learned.",
            hi: "Yeh animation wala SW1 hai, jab chaaron PCs ek-ek frame bhej chuke hain. `dynamic` keyword switch ki apni static entries chhupa deta hai, taaki sirf seekhe hue hosts dikhein.",
          },
        },
        {
          type: "cli",
          title: { en: "SW1 MAC address table", hi: "SW1 ki MAC address table" },
          lines: [
            { prompt: "SW1#", cmd: "show mac address-table dynamic" },
            { out: "          Mac Address Table" },
            { out: "-------------------------------------------" },
            { out: "Vlan    Mac Address       Type        Ports" },
            { out: "----    -----------       --------    -----" },
            { out: "   1    0050.56aa.0001    DYNAMIC     Fa0/1" },
            { out: "   1    0050.56aa.0002    DYNAMIC     Fa0/2" },
            { out: "   1    0050.56aa.0003    DYNAMIC     Fa0/3", comment: { en: "Two MACs on one port: more than one device is behind it (here, the hub)", hi: "Ek port par do MAC: uske peeche ek se zyada devices hain (yahan hub)" } },
            { out: "   1    0050.56aa.0004    DYNAMIC     Fa0/3" },
            { out: "Total Mac Addresses for this criterion: 4" },
          ],
          note: {
            en: "Without `dynamic`, the output also lists entries such as `0100.0ccc.cccc` with Type STATIC and Port CPU. The switch uses those for its own protocols; skip them when you are looking for hosts.",
            hi: "`dynamic` ke bina output mein `0100.0ccc.cccc` jaisi entries bhi aati hain, jinka Type STATIC aur Port CPU hota hai. Switch inhe apne protocols ke liye use karta hai; hosts dhoondhte waqt inhe chhod do.",
          },
        },
        {
          type: "p",
          text: {
            en: "To look up one device, filter by address or by port: `show mac address-table address 0050.56aa.0003` shows where that MAC is, and `show mac address-table interface fa0/3` shows every MAC learned on that port.",
            hi: "Ek device dhoondhna ho toh address ya port se filter karo: `show mac address-table address 0050.56aa.0003` batata hai woh MAC kahan hai, aur `show mac address-table interface fa0/3` us port par seekhe gaye saare MACs dikhata hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Tracing a device across switches", hi: "Kai switches mein device trace karna" },
          text: {
            en: "In a real network, an uplink to another switch shows many MACs, while an access port shows one (two when a PC is plugged in behind an IP phone). To find where a device is plugged in, look up its MAC, follow the uplink to the next switch, and repeat until you reach a port with only that MAC.",
            hi: "Real network mein doosre switch ki taraf wale uplink par bahut saare MACs dikhte hain, jabki access port par ek (do, agar PC ek IP phone ke peeche laga ho). Device kahan plugged hai yeh dhoondhna ho toh uska MAC dekho, uplink pakad kar agle switch par jao, aur tab tak repeat karo jab tak aisa port na mil jaaye jis par sirf wahi MAC ho.",
          },
        },
      ],
    },
    {
      id: "collision-and-broadcast-domains",
      heading: { en: "Collision domains and broadcast domains", hi: "Collision domain aur broadcast domain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **collision domain** is the group of devices whose transmissions can collide with each other. Every switch port and every router port is a separate collision domain; a hub and everything attached to it is one. A **broadcast domain** is the group of devices that receive each other's broadcasts. A switch floods broadcasts, so all its ports in one VLAN form one broadcast domain. Routers do not forward broadcasts, so each router interface is a separate broadcast domain, and VLANs (lesson 2.1) split a switch into several.",
            hi: "**Collision domain** devices ka woh group hai jinke transmissions aapas mein collide ho sakte hain. Har switch port aur har router port alag collision domain hai; hub aur usse jude saare devices milkar ek hote hain. **Broadcast domain** devices ka woh group hai jo ek doosre ke broadcasts receive karte hain. Switch broadcasts flood karta hai, isliye ek VLAN mein uske saare ports ek broadcast domain bante hain. Routers broadcasts forward nahi karte, isliye router ka har interface alag broadcast domain hai, aur VLANs (lesson 2.1) ek switch ko kai broadcast domains mein baant dete hain.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "SW1 Fa0/1 to PC-A: one collision domain.", hi: "SW1 Fa0/1 se PC-A: ek collision domain." },
            { en: "SW1 Fa0/2 to PC-B: a second collision domain.", hi: "SW1 Fa0/2 se PC-B: doosra collision domain." },
            {
              en: "SW1 Fa0/3 to the hub, PC-C and PC-D: a third, shared by all of them because the hub repeats everything.",
              hi: "SW1 Fa0/3 se hub, PC-C aur PC-D: teesra, jo in sab mein shared hai kyunki hub sab kuch repeat karta hai.",
            },
            {
              en: "Total for the animation's network: **3 collision domains and 1 broadcast domain** (one VLAN, no router).",
              hi: "Animation wale network ka total: **3 collision domains aur 1 broadcast domain** (ek VLAN, koi router nahi).",
            },
            {
              en: "Replace the hub with a second switch and you get 5 collision domains: the three SW1 links plus the two PC links on the new switch. Still 1 broadcast domain.",
              hi: "Hub ki jagah doosra switch laga do toh 5 collision domains ho jaate hain: SW1 ke teen links aur naye switch par do PC links. Broadcast domain ab bhi 1 hi hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Switches split collision domains; routers and VLANs split broadcast domains. On a switched, full-duplex LAN there are no collisions at all, so collisions on a switch port mean it is running half duplex. Lesson 1.11 shows how to find the cause.",
            hi: "Switches collision domains ko baantte hain; routers aur VLANs broadcast domains ko. Switched, full-duplex LAN mein collisions hote hi nahi, isliye agar switch port par collisions dikhein toh matlab port half duplex par chal raha hai. Lesson 1.11 mein dekhoge ki iski wajah kaise dhoondhte hain.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "MAC address table", def: { en: "The switch's list of MAC address, VLAN and port. Also called the CAM table.", hi: "Switch ki list jisme MAC address, VLAN aur port hota hai. Ise CAM table bhi kehte hain." } },
    { term: "MAC learning", def: { en: "Recording the source MAC of each incoming frame against the port it arrived on.", hi: "Har aane wale frame ka source MAC us port ke saath note karna jis par frame aaya." } },
    { term: "Unknown unicast", def: { en: "A unicast frame whose destination MAC is not in the switch's table. The switch floods it.", hi: "Aisa unicast frame jiska destination MAC switch ki table mein nahi hai. Switch use flood karta hai." } },
    { term: "Flooding", def: { en: "Sending a frame out of every port in its VLAN except the port it arrived on.", hi: "Frame ko uske VLAN ke har port se bhejna, sirf us port ko chhod kar jahan se woh aaya." } },
    { term: "Filtering", def: { en: "Dropping a frame because its destination is on the same port it arrived on.", hi: "Frame ko drop karna kyunki uska destination usi port par hai jahan se woh aaya." } },
    { term: "MAC aging", def: { en: "Deleting a dynamic entry when no frame from that MAC has arrived for the aging time, 300 seconds by default.", hi: "Dynamic entry ko delete karna jab aging time (default 300 seconds) tak us MAC se koi frame nahi aaya." } },
    { term: "Collision domain", def: { en: "A group of devices whose transmissions can collide. Each switch port is its own.", hi: "Devices ka group jinke transmissions collide ho sakte hain. Har switch port ka apna alag hota hai." } },
    { term: "Broadcast domain", def: { en: "A group of devices that all receive each other's broadcasts. Routers and VLANs divide them.", hi: "Devices ka group jo ek doosre ke saare broadcasts receive karte hain. Routers aur VLANs inhe baantte hain." } },
  ],
  commands: [
    { cmd: "show mac address-table", mode: "Cisco privileged EXEC", does: { en: "Show every entry in the MAC address table, static and dynamic", hi: "MAC address table ki saari entries dikhata hai, static aur dynamic dono" } },
    { cmd: "show mac address-table dynamic", mode: "Cisco privileged EXEC", does: { en: "Show only the learned (dynamic) entries", hi: "Sirf seekhi hui (dynamic) entries dikhata hai" } },
    { cmd: "show mac address-table address <mac>", mode: "Cisco privileged EXEC", does: { en: "Find the VLAN and port for one MAC address", hi: "Ek MAC address ka VLAN aur port dhoondhta hai" } },
    { cmd: "show mac address-table interface <interface>", mode: "Cisco privileged EXEC", does: { en: "List the MACs learned on one port", hi: "Ek port par seekhe gaye MACs dikhata hai" } },
    { cmd: "show mac address-table aging-time", mode: "Cisco privileged EXEC", does: { en: "Show the aging time (300 seconds by default)", hi: "Aging time dikhata hai (default 300 seconds)" } },
    { cmd: "mac address-table aging-time <seconds>", mode: "Cisco global config", does: { en: "Change the aging time", hi: "Aging time badalta hai" } },
    { cmd: "clear mac address-table dynamic", mode: "Cisco privileged EXEC", does: { en: "Delete all dynamic entries so the switch learns again", hi: "Saari dynamic entries delete karta hai taaki switch phir se seekhe" } },
  ],
  mistakes: [
    {
      en: "Thinking a switch learns from the destination MAC. It learns only from the source MAC and the incoming port; the destination is used to decide where the frame goes.",
      hi: "Yeh sochna ki switch destination MAC se seekhta hai. Woh sirf source MAC aur incoming port se seekhta hai; destination se sirf decide hota hai ki frame kahan jayega.",
    },
    {
      en: "Saying a switch drops a frame whose destination it does not know. It floods it; only a destination on the incoming port causes a drop (filtering).",
      hi: "Yeh bolna ki jiska destination pata nahi, switch woh frame drop kar deta hai. Woh use flood karta hai; drop (filtering) sirf tab hota hai jab destination incoming port par hi ho.",
    },
    {
      en: "Including the incoming port, or other VLANs, when flooding. A flood goes out of every port in the same VLAN except the one the frame arrived on.",
      hi: "Flooding mein incoming port ya doosre VLANs ko bhi gin lena. Flood same VLAN ke har port se jaata hai, sirf us port ko chhod kar jahan se frame aaya.",
    },
    {
      en: "Saying switches split broadcast domains. A switch splits collision domains; routers and VLANs split broadcast domains.",
      hi: "Yeh kehna ki switch broadcast domains baantta hai. Switch collision domains baantta hai; broadcast domains routers aur VLANs baantte hain.",
    },
    {
      en: "Mixing up timers. MAC entries age out after 300 seconds by default; the 4-hour timer you will see in the next lesson belongs to a router's ARP cache.",
      hi: "Timers mix kar dena. MAC entries by default 300 seconds mein age out hoti hain; 4 ghante wala timer, jo agle lesson mein dekhoge, router ke ARP cache ka hai.",
    },
    {
      en: "Counting each PC on a hub as its own collision domain. A hub and everything on it share one collision domain.",
      hi: "Hub par lage har PC ko alag collision domain ginna. Hub aur uske saare devices ek hi collision domain share karte hain.",
    },
  ],
  recap: [
    { en: "A switch learns the source MAC and incoming port (and VLAN) of every frame it receives.", hi: "Switch har aane wale frame ka source MAC aur incoming port (aur VLAN) seekhta hai." },
    {
      en: "Known unicast: forward out one port. Unknown unicast and broadcast: flood in the VLAN, never out the incoming port. Destination on the incoming port: filter.",
      hi: "Known unicast: ek port se forward. Unknown unicast aur broadcast: VLAN mein flood, incoming port se kabhi nahi. Destination incoming port par hi ho: filter.",
    },
    { en: "Dynamic entries age out after 300 seconds without a frame from that MAC; every frame resets the timer.", hi: "Us MAC se 300 seconds tak koi frame na aaye toh dynamic entry age out ho jaati hai; har frame timer reset karta hai." },
    { en: "`show mac address-table dynamic` lists learned MACs; many MACs on one port means a switch or hub is behind it.", hi: "`show mac address-table dynamic` seekhe hue MACs dikhata hai; ek port par bahut MACs matlab uske peeche switch ya hub hai." },
    { en: "Each switch port is its own collision domain; one VLAN is one broadcast domain; routers split broadcast domains.", hi: "Har switch port apna collision domain hai; ek VLAN ek broadcast domain hai; routers broadcast domains baantte hain." },
    { en: "Full-duplex switch ports have no collisions. Hubs force half duplex and CSMA/CD.", hi: "Full-duplex switch ports par collisions nahi hote. Hubs half duplex aur CSMA/CD par chalne ko majboor karte hain." },
  ],
  quiz: [
    {
      q: {
        en: "SW1's MAC table holds only `0050.56aa.0001` on Fa0/1. A frame arrives on Fa0/1 with source `0050.56aa.0001` and destination `0050.56aa.0002`. What does SW1 do?",
        hi: "SW1 ki MAC table mein sirf `0050.56aa.0001` Fa0/1 par hai. Fa0/1 par ek frame aata hai, source `0050.56aa.0001` aur destination `0050.56aa.0002`. SW1 kya karega?",
      },
      options: [
        { en: "Drops the frame because the destination is unknown", hi: "Frame drop karega kyunki destination unknown hai" },
        { en: "Floods it out every port in the VLAN except Fa0/1", hi: "Use VLAN ke har port se flood karega, Fa0/1 chhod kar" },
        { en: "Floods it out every port, including Fa0/1", hi: "Use har port se flood karega, Fa0/1 samet" },
        { en: "Sends an ARP request to find `0050.56aa.0002`", hi: "`0050.56aa.0002` dhoondhne ke liye ARP request bhejega" },
      ],
      answer: 1,
      explain: {
        en: "The destination is an unknown unicast, so SW1 floods it out every port in the same VLAN except the port it came in on. A switch does not drop a frame just because the destination is unknown, and it does not use ARP: ARP is how hosts find a MAC from an IP address.",
        hi: "Destination unknown unicast hai, isliye SW1 use same VLAN ke har port se flood karta hai, sirf incoming port chhod kar. Destination unknown hone se switch frame drop nahi karta, aur ARP bhi use nahi karta: ARP se hosts IP address ka MAC dhoondhte hain.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "SW1's table has `0050.56aa.0001` on Fa0/1. A frame from `0050.56aa.0003` arrives on Fa0/3, addressed to `0050.56aa.0001`. What does SW1 do?",
        hi: "SW1 ki table mein `0050.56aa.0001` Fa0/1 par hai. `0050.56aa.0003` se ek frame Fa0/3 par aata hai, jiska destination `0050.56aa.0001` hai. SW1 kya karega?",
      },
      options: [
        { en: "Learns `0050.56aa.0001` on Fa0/3 and floods the frame", hi: "`0050.56aa.0001` ko Fa0/3 par seekhega aur frame flood karega" },
        { en: "Learns `0050.56aa.0003` on Fa0/1 and forwards the frame out Fa0/1", hi: "`0050.56aa.0003` ko Fa0/1 par seekhega aur frame Fa0/1 se forward karega" },
        { en: "Learns nothing, because the destination is known, and forwards out Fa0/1", hi: "Kuch nahi seekhega kyunki destination known hai, aur Fa0/1 se forward karega" },
        { en: "Learns `0050.56aa.0003` on Fa0/3 and forwards the frame out Fa0/1 only", hi: "`0050.56aa.0003` ko Fa0/3 par seekhega aur frame sirf Fa0/1 se forward karega" },
      ],
      answer: 3,
      explain: {
        en: "Learning always uses the source MAC and the incoming port, so SW1 adds `0050.56aa.0003` on Fa0/3. The lookup then uses the destination, which is known on Fa0/1, so the frame is forwarded out that one port. Learning happens on every frame, whether or not the destination is known.",
        hi: "Learning hamesha source MAC aur incoming port se hoti hai, toh SW1 `0050.56aa.0003` ko Fa0/3 par add karta hai. Phir lookup destination se hota hai, jo Fa0/1 par known hai, isliye frame sirf usi port se forward hota hai. Learning har frame par hoti hai, destination known ho ya na ho.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`show mac address-table dynamic` on SW3 lists six different MAC addresses on Gi0/1 and one MAC on each of Fa0/2 to Fa0/5. What is the most likely explanation for Gi0/1?",
        hi: "SW3 par `show mac address-table dynamic` mein Gi0/1 par chhe alag MAC addresses hain, aur Fa0/2 se Fa0/5 tak har port par ek MAC. Gi0/1 ki sabse likely wajah kya hai?",
      },
      options: [
        { en: "Gi0/1 connects to another switch with several hosts behind it", hi: "Gi0/1 ek doosre switch se juda hai jiske peeche kai hosts hain" },
        { en: "Six PCs are plugged directly into Gi0/1", hi: "Chhe PCs seedha Gi0/1 mein plugged hain" },
        { en: "SW3 learned them from the destination field of frames it sent out Gi0/1", hi: "SW3 ne yeh Gi0/1 se bheje gaye frames ke destination field se seekhe" },
        { en: "They are the switch's own CPU entries", hi: "Yeh switch ki apni CPU entries hain" },
      ],
      answer: 0,
      explain: {
        en: "Many dynamic MACs on one port means several devices sit behind it, which on an uplink is almost always another switch. One port takes one cable, learning uses the source of frames arriving on a port, and the switch's own entries show Type STATIC and Port CPU.",
        hi: "Ek port par bahut saare dynamic MACs matlab uske peeche kai devices hain, aur uplink par yeh lagbhag hamesha doosra switch hota hai. Ek port par ek hi cable lagti hai, learning port par aane wale frames ke source se hoti hai, aur switch ki apni entries ka Type STATIC aur Port CPU hota hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "SW1 has PCs on Fa0/1, Fa0/2 and Fa0/3. A hub on Fa0/4 connects two more PCs. There is one VLAN and no router. How many collision domains and broadcast domains are there?",
        hi: "SW1 par Fa0/1, Fa0/2 aur Fa0/3 par PCs hain. Fa0/4 par ek hub hai jisse do aur PCs jude hain. Ek hi VLAN hai aur koi router nahi. Kitne collision domains aur broadcast domains hain?",
      },
      options: [
        { en: "6 collision domains, 1 broadcast domain", hi: "6 collision domains, 1 broadcast domain" },
        { en: "4 collision domains, 4 broadcast domains", hi: "4 collision domains, 4 broadcast domains" },
        { en: "4 collision domains, 1 broadcast domain", hi: "4 collision domains, 1 broadcast domain" },
        { en: "1 collision domain, 1 broadcast domain", hi: "1 collision domain, 1 broadcast domain" },
      ],
      answer: 2,
      explain: {
        en: "Each switch port is its own collision domain: Fa0/1, Fa0/2, Fa0/3 and Fa0/4. The hub and its two PCs share the Fa0/4 domain, so the total is 4, not 6. With no router and one VLAN, everything is in one broadcast domain.",
        hi: "Har switch port apna collision domain hai: Fa0/1, Fa0/2, Fa0/3 aur Fa0/4. Hub aur uske do PCs Fa0/4 wala domain share karte hain, isliye total 4 hai, 6 nahi. Router nahi hai aur VLAN ek hai, toh sab kuch ek hi broadcast domain mein hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "A printer on Fa0/8 has sent no frames for 6 minutes, and the switch uses the default aging time. A PC now sends a frame to the printer's MAC. What happens?",
        hi: "Fa0/8 par laga printer 6 minute se koi frame nahi bhej raha, aur switch default aging time use karta hai. Ab ek PC printer ke MAC par frame bhejta hai. Kya hoga?",
      },
      options: [
        { en: "The entry has aged out, so the switch floods the frame", hi: "Entry age out ho chuki hai, isliye switch frame flood karega" },
        { en: "The switch forwards it out Fa0/8, because entries never expire", hi: "Switch use Fa0/8 se forward karega, kyunki entries kabhi expire nahi hoti" },
        { en: "The switch drops the frame until the printer sends again", hi: "Printer dobara kuch bheje tab tak switch frame drop karega" },
        { en: "The switch asks the printer to refresh its entry, then forwards the frame", hi: "Switch printer se entry refresh karwayega, phir frame forward karega" },
      ],
      answer: 0,
      explain: {
        en: "The default aging time is 300 seconds (5 minutes). After 6 minutes of silence the entry is gone, so the frame is an unknown unicast and is flooded. The printer still receives it, and its next frame puts it back in the table. A switch never queries hosts to refresh entries.",
        hi: "Default aging time 300 seconds (5 minute) hai. 6 minute ki khamoshi ke baad entry hat chuki hai, isliye frame unknown unicast hai aur flood hota hai. Printer ko frame phir bhi mil jaata hai, aur uska agla frame use wapas table mein daal deta hai. Switch entries refresh karne ke liye hosts se kabhi kuch nahi poochta.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "PC-C and PC-D share a hub on SW1 Fa0/3, and SW1 has learned both MACs on Fa0/3. PC-C sends a frame to PC-D. What does SW1 do with the copy the hub repeats to it?",
        hi: "PC-C aur PC-D, SW1 ke Fa0/3 par lage ek hub ko share karte hain, aur SW1 ne dono MACs Fa0/3 par seekh liye hain. PC-C, PC-D ko frame bhejta hai. Hub jo copy SW1 ko repeat karta hai, SW1 uska kya karega?",
      },
      options: [
        { en: "Sends it back out Fa0/3 so that PC-D receives it", hi: "Use Fa0/3 se wapas bhejega taaki PC-D ko mile" },
        { en: "Floods it out every port except Fa0/3", hi: "Use Fa0/3 chhod kar har port se flood karega" },
        { en: "Forwards it to the default gateway", hi: "Use default gateway ko forward karega" },
        { en: "Drops it, because the destination is on the port it came in on", hi: "Drop karega, kyunki destination usi port par hai jahan se frame aaya" },
      ],
      answer: 3,
      explain: {
        en: "This is filtering. PC-D already received the frame from the hub, and a switch never sends a frame back out of its incoming port. The default gateway plays no part: a switch forwards on MAC addresses, and gateways matter only to hosts sending to other subnets.",
        hi: "Yahi filtering hai. PC-D ko frame hub se pehle hi mil chuka hai, aur switch kabhi frame ko incoming port se wapas nahi bhejta. Default gateway ka yahan koi role nahi: switch MAC addresses par forward karta hai, aur gateway sirf un hosts ke liye matter karta hai jo doosre subnet ko bhej rahe hon.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "u2n762WG0Vo",
      title: "Free CCNA | Ethernet LAN Switching (Part 1) | Day 5",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "The Ethernet frame, then MAC learning, flooding and forwarding with a worked multi-switch example.",
        hi: "Ethernet frame, phir MAC learning, flooding aur forwarding, kai switches wale worked example ke saath.",
      },
    },
    {
      id: "Ig0dSaOQDI8",
      title: "Free CCNA | Analyzing Ethernet Switching | Day 6 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "A short Packet Tracer lab: watch switches learn and forward frames, and read their MAC tables.", hi: "Chhota Packet Tracer lab: switches ko frames seekhte aur forward karte dekho, aur unki MAC tables padho." },
    },
    {
      id: "8mWCfMVQ22k",
      title: "80. Free CCNA (NEW) | Working of Switches - Address Learning",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "How a switch builds its MAC table from source addresses, in Hindi.", hi: "Switch source addresses se apni MAC table kaise banata hai, Hindi mein." },
    },
    {
      id: "qzmD-UNifwM",
      title: "81. Free CCNA (NEW) | Working of Switches - Frame Forwarding",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "The follow-up: forwarding, flooding and filtering decisions, in Hindi.", hi: "Agla part: forwarding, flooding aur filtering ke faisle, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Watch SW1 fill its MAC table in Packet Tracer", hi: "Packet Tracer mein SW1 ki MAC table bharte dekho" },
    steps: [
      {
        en: "Add a 2960 switch (SW1). Connect PC-A to Fa0/1 and PC-B to Fa0/2, then connect a hub (Hub-PT) to Fa0/3 with PC-C and PC-D on it. Give the PCs 10.1.1.10, .20, .30 and .40 /24.",
        hi: "Ek 2960 switch (SW1) lagao. PC-A ko Fa0/1 aur PC-B ko Fa0/2 se jodo, phir Fa0/3 par ek hub (Hub-PT) lagao jisme PC-C aur PC-D jude hon. PCs ko 10.1.1.10, .20, .30 aur .40 /24 do.",
      },
      {
        en: "On SW1 run `show mac address-table`. No host MACs should appear yet, because the PCs have not sent anything.",
        hi: "SW1 par `show mac address-table` chalao. Abhi koi host MAC nahi dikhna chahiye, kyunki PCs ne kuch bheja hi nahi.",
      },
      {
        en: "Ping PC-C from PC-A, then run `show mac address-table` again. Which MACs were learned, and on which ports?",
        hi: "PC-A se PC-C ko ping karo, phir dobara `show mac address-table` chalao. Kaunse MACs seekhe gaye, aur kis port par?",
      },
      {
        en: "Switch to Simulation mode and ping PC-D from PC-C. Follow the copy the hub sends to SW1 and see what SW1 does with it.",
        hi: "Simulation mode mein jao aur PC-C se PC-D ko ping karo. Hub jo copy SW1 ko bhejta hai, use follow karo aur dekho SW1 uska kya karta hai.",
      },
      {
        en: "Run `clear mac address-table dynamic` on SW1 and right away ping PC-C from PC-A in Simulation mode. PC-A still has PC-C's MAC cached, so find the unknown unicast that SW1 floods.",
        hi: "SW1 par `clear mac address-table dynamic` chalao aur turant Simulation mode mein PC-A se PC-C ko ping karo. PC-A ke paas PC-C ka MAC abhi cached hai, toh woh unknown unicast dhoondho jo SW1 flood karta hai.",
      },
    ],
  },
};

export default lesson;
