import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "troubleshooting-method",
  intro: {
    en: "Most outages are not hard because the fault is clever. They are hard because people guess: they reboot a switch, change a VLAN, undo it, and an hour later nobody knows what state the network is in. A method turns a vague complaint into a short list of checks, each of which rules out part of the network. Engineers who work this way fix faults faster and can prove what the cause was.",
    hi: "Zyada outages isliye mushkil nahi hote ki fault bahut clever hai. Mushkil isliye hote hain kyunki log guess karte hain: switch reboot kiya, VLAN badla, phir undo kiya, aur ek ghante baad kisi ko pata nahi network kis state mein hai. Ek method vague complaint ko checks ki chhoti list mein badal deta hai, aur har check network ka ek hissa rule out kar deta hai. Is tarah kaam karne wale engineers fault jaldi fix karte hain aur prove bhi kar sakte hain ki cause kya tha.",
  },
  outcomes: [
    { en: "Turn a user complaint into a precise problem statement with scope and timing", hi: "User ki complaint ko scope aur timing ke saath ek precise problem statement mein badal sako" },
    { en: "Choose between top-down, bottom-up, divide and conquer, follow-the-path, compare and swap approaches", hi: "Top-down, bottom-up, divide and conquer, follow-the-path, compare aur swap approaches mein se sahi choose kar sako" },
    { en: "Pick the right IOS show command for each layer and know what a healthy result looks like", hi: "Har layer ke liye sahi IOS show command choose kar sako aur jaan sako ki healthy result kaisa dikhta hai" },
    { en: "Test one hypothesis at a time, fix it with a rollback plan, and verify that nothing else broke", hi: "Ek time par ek hypothesis test kar sako, rollback plan ke saath fix kar sako, aur verify kar sako ki kuch aur nahi toota" },
    { en: "Write a ticket note that records symptom, root cause, fix and evidence", hi: "Aisa ticket note likh sako jisme symptom, root cause, fix aur evidence ho" },
  ],
  sections: [
    {
      id: "why-a-method",
      heading: { en: "Why a method beats guessing", hi: "Guess karne se method behtar kyun hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A network path has many parts: the host's IP settings, the cable, the access port, the trunk, the gateway, the routing table, ACLs, the server. A guess tests one part and tells you little if it is wrong. A good check tells you that **everything up to a point works**, so you never have to look there again.",
            hi: "Ek network path ke bahut saare parts hote hain: host ki IP settings, cable, access port, trunk, gateway, routing table, ACLs, server. Guess ek part test karta hai, aur galat nikla toh kuch khaas nahi batata. Achha check batata hai ki **ek point tak sab kuch kaam kar raha hai**, toh wahan dobara dekhne ki zaroorat hi nahi.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "**Define the problem**: who is affected, what fails, since when, and what still works.", hi: "**Problem define karo**: kaun affected hai, kya fail ho raha hai, kab se, aur kya abhi bhi kaam kar raha hai." },
            { en: "**Gather facts**: recent changes, logs, and quick tests from the user's side.", hi: "**Facts gather karo**: recent changes, logs, aur user ki side se quick tests." },
            { en: "**Choose an approach** that fits the facts (top-down, bottom-up, divide and conquer, follow the path, compare, swap).", hi: "Facts ke hisaab se **approach choose karo** (top-down, bottom-up, divide and conquer, follow the path, compare, swap)." },
            { en: "**Form a hypothesis and test it**, one at a time. A test either supports it or rules it out.", hi: "**Hypothesis banao aur test karo**, ek time par ek. Test ya toh use support karega ya rule out." },
            { en: "**Fix** with the smallest change that addresses the cause, and know how you would undo it.", hi: "Sabse chhote change se **fix karo** jo cause ko address kare, aur pata ho ki undo kaise karoge." },
            { en: "**Verify** from the user's side, and check that what worked before still works.", hi: "User ki side se **verify karo**, aur check karo ki jo pehle kaam kar raha tha woh ab bhi kar raha hai." },
            { en: "**Document** the symptom, root cause, fix and evidence in the ticket.", hi: "Ticket mein symptom, root cause, fix aur evidence **document karo**." },
          ],
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of a doctor", hi: "Doctor ki tarah socho" },
          text: {
            en: "A good doctor does not prescribe five medicines at once. They ask where it hurts and since when, run the test that splits the likely causes, treat one cause, and check you got better. Five changes at once might fix the network, but you will never know which one did, or which one broke something else.",
            hi: "Achha doctor ek saath paanch dawaiyan nahi likhta. Woh poochta hai dard kahan hai aur kab se, phir woh test karta hai jo possible causes ko alag kare, ek cause ka ilaaj karta hai, aur check karta hai ki tum theek hue ya nahi. Ek saath paanch changes shayad network fix kar dein, lekin tumhe kabhi pata nahi chalega kis change ne fix kiya, ya kisne kuch aur tod diya.",
          },
        },
      ],
    },
    {
      id: "define-the-problem",
      heading: { en: "Define the problem precisely", hi: "Problem ko precisely define karo" },
      blocks: [
        {
          type: "p",
          text: {
            en: "\"The network is slow\" is not a problem statement. Before touching any device, turn the complaint into something you can test. These questions do most of the work:",
            hi: "\"Network slow hai\" problem statement nahi hai. Kisi device ko touch karne se pehle complaint ko aisi cheez mein badlo jo test ho sake. Yeh sawaal zyada tar kaam kar dete hain:",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Who**: one user, one VLAN, one floor, one site, or everyone?", hi: "**Kaun**: ek user, ek VLAN, ek floor, ek site, ya sab log?" },
            { en: "**What**: which application or address fails, and how (timeout, error message, slow)?", hi: "**Kya**: kaunsi application ya address fail ho raha hai, aur kaise (timeout, error message, slow)?" },
            { en: "**When**: since when, all the time or on and off?", hi: "**Kab**: kab se, hamesha ya beech beech mein?" },
            { en: "**What changed**: config changes, new devices, moves, maintenance windows. The change log is often the fastest clue.", hi: "**Kya badla**: config changes, naye devices, moves, maintenance windows. Change log aksar sabse fast clue hota hai." },
            { en: "**What still works**: a similar user, VLAN or server that is fine. It gives you a working baseline to compare against.", hi: "**Kya abhi bhi kaam karta hai**: koi similar user, VLAN ya server jo theek hai. Isse ek working baseline mil jaati hai jisse compare kar sako." },
          ],
        },
        {
          type: "table",
          caption: { en: "From complaint to problem statement", hi: "Complaint se problem statement tak" },
          columns: ["", "Vague", "Precise"],
          rows: [
            [
              { en: "Ticket text", hi: "Ticket text" },
              { en: "\"Accounts can't get to the file server.\"", hi: "\"Accounts wale file server tak nahi pahunch pa rahe.\"" },
              { en: "\"Since Monday 09:00, all users in VLAN 20 (10.1.20.0/24) cannot open \\\\FS1 (10.1.100.10) or ping it. VLAN 10 users can. VLAN 20 was created on Friday.\"", hi: "\"Monday 09:00 se VLAN 20 (10.1.20.0/24) ke saare users \\\\FS1 (10.1.100.10) open ya ping nahi kar pa rahe. VLAN 10 users kar pa rahe hain. VLAN 20 Friday ko bana tha.\"" },
            ],
            [
              { en: "What it rules out", hi: "Kya rule out hota hai" },
              { en: "Nothing", hi: "Kuch nahi" },
              { en: "FS1 itself, its cable and DSW1's routing in general, because VLAN 10 reaches FS1 through them", hi: "FS1 khud, uski cable aur DSW1 ki general routing, kyunki VLAN 10 inhi se FS1 tak pahunchta hai" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Scope tells you where to start", hi: "Scope batata hai kahan se shuru karna hai" },
          text: {
            en: "One user broken, neighbours fine: start at that user's PC, cable and access port, because everything they share with the neighbours is proven. A whole VLAN broken: look at what only that VLAN uses (its SVI, its entry on trunks, ACLs that mention its subnet). Everyone broken: look at the shared core, the gateway or the internet edge.",
            hi: "Ek user broken, padosi theek: us user ke PC, cable aur access port se shuru karo, kyunki jo kuch woh padosiyon ke saath share karta hai woh proven hai. Poora VLAN broken: woh cheezein dekho jo sirf woh VLAN use karta hai (uska SVI, trunks par uski entry, ACLs jo uske subnet ka naam lete hain). Sab broken: shared core, gateway ya internet edge dekho.",
          },
        },
      ],
    },
    {
      id: "approaches",
      heading: { en: "Choosing an approach", hi: "Approach choose karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Each approach is a way of ordering your checks so that every result removes a big piece of the search. Pick the one that matches what you already know.",
            hi: "Har approach checks ko order karne ka ek tareeka hai, taaki har result search ka bada hissa hata de. Jo tumhe pehle se pata hai, uske hisaab se approach pick karo.",
          },
        },
        {
          type: "table",
          caption: { en: "Six approaches and when each one fits", hi: "Chhe approaches aur kab kaunsa fit hota hai" },
          columns: ["Approach", "How it works", "Use it when"],
          rows: [
            [
              "Top-down",
              { en: "Start at the application (does the browser show an error?) and move down the layers.", hi: "Application se shuru karo (browser error dikha raha hai?) aur layers mein neeche jao." },
              { en: "One application fails while others work, so lower layers are probably fine.", hi: "Ek application fail ho rahi hai aur baaki chal rahi hain, toh lower layers shayad theek hain." },
            ],
            [
              "Bottom-up",
              { en: "Start at the cable and port lights, then data link, then IP, and move up.", hi: "Cable aur port lights se shuru karo, phir data link, phir IP, aur upar jao." },
              { en: "Nothing works at all from a device, or you suspect physical damage.", hi: "Device se kuch bhi kaam nahi kar raha, ya physical damage ka shak hai." },
            ],
            [
              "Divide and conquer",
              { en: "Start in the middle, usually with a ping. If it works, look up the stack; if not, look down.", hi: "Beech se shuru karo, aam taur par ping se. Kaam kare toh stack mein upar dekho; na kare toh neeche." },
              { en: "Most of the time. One ping to the gateway splits the problem in half.", hi: "Zyada tar time. Gateway ka ek ping problem ko aadha kar deta hai." },
            ],
            [
              "Follow the path",
              { en: "Trace the packet hop by hop from source to destination, checking each device it crosses.", hi: "Packet ko source se destination tak hop by hop trace karo, aur har device check karo jisse woh guzarta hai." },
              { en: "Reachability problems between two known endpoints.", hi: "Do known endpoints ke beech reachability problems." },
            ],
            [
              "Compare (spot the difference)",
              { en: "Put a working config or device next to the broken one and look for what differs.", hi: "Working config ya device ko broken wale ke saath rakho aur fark dhoondho." },
              { en: "A similar VLAN, port or site works. Very fast when you have a baseline.", hi: "Similar VLAN, port ya site kaam kar raha hai. Baseline ho toh bahut fast." },
            ],
            [
              "Swap components",
              { en: "Replace a suspect cable, SFP, port or device with a known-good one.", hi: "Suspect cable, SFP, port ya device ko known-good wale se replace karo." },
              { en: "You suspect hardware and a spare is at hand. It proves the part, not the reason.", hi: "Hardware ka shak hai aur spare paas mein hai. Isse part prove hota hai, reason nahi." },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "The CCNA 200-301 v1.1 blueprint does not ask you to name these approaches, but its lab-style questions are exactly this work: read show output, find the one thing that differs from a working setup, and pick the fix. Practising the method makes those questions much faster.",
            hi: "CCNA 200-301 v1.1 blueprint mein in approaches ke naam nahi poochhe jaate, lekin uske lab-style questions bilkul yahi kaam hain: show output padho, woh ek cheez dhoondho jo working setup se alag hai, aur fix pick karo. Method practise karoge toh woh questions bahut jaldi solve honge.",
          },
        },
      ],
    },
    {
      id: "commands-per-layer",
      heading: { en: "Useful commands, layer by layer", hi: "Har layer ke kaam ke commands" },
      blocks: [
        {
          type: "table",
          caption: { en: "What each command answers, and what healthy looks like", hi: "Har command kya batata hai, aur healthy kaisa dikhta hai" },
          columns: ["Layer", "Question", "Command", "Healthy result"],
          rows: [
            [
              "1",
              { en: "Is the port up, at the right speed and duplex?", hi: "Port up hai, sahi speed aur duplex par?" },
              "show interfaces status",
              { en: "`connected`, `a-full`, expected VLAN", hi: "`connected`, `a-full`, expected VLAN" },
            ],
            [
              "1",
              { en: "Is the link taking physical errors?", hi: "Link par physical errors aa rahe hain?" },
              "show interfaces Gi1/0/5",
              { en: "`up, line protocol is up`; CRC and input errors not rising", hi: "`up, line protocol is up`; CRC aur input errors nahi badh rahe" },
            ],
            [
              "2",
              { en: "Is the port in the right VLAN, and does the VLAN exist?", hi: "Port sahi VLAN mein hai, aur VLAN exist karta hai?" },
              "show vlan brief",
              { en: "VLAN `active`, port listed under it", hi: "VLAN `active`, port uske neeche listed" },
            ],
            [
              "2",
              { en: "Does the trunk carry the VLAN?", hi: "Trunk VLAN carry kar raha hai?" },
              "show interfaces trunk",
              { en: "VLAN in all three lists, the last being forwarding and not pruned", hi: "VLAN teeno lists mein, aakhri wali forwarding aur not pruned" },
            ],
            [
              "3",
              { en: "Is the gateway interface (SVI) up with the right IP?", hi: "Gateway interface (SVI) sahi IP ke saath up hai?" },
              "show ip interface brief",
              { en: "`up` / `up`, correct address", hi: "`up` / `up`, sahi address" },
            ],
            [
              "3",
              { en: "Is there a route to the destination?", hi: "Destination ka route hai?" },
              "show ip route",
              { en: "A `C`, `S`, `O` (or default) route that covers it", hi: "Ek `C`, `S`, `O` (ya default) route jo use cover kare" },
            ],
            [
              "3",
              { en: "Did the gateway resolve the next hop or host MAC?", hi: "Gateway ne next hop ya host ka MAC resolve kiya?" },
              "show ip arp",
              { en: "An entry with a MAC, not `Incomplete`", hi: "MAC ke saath entry, `Incomplete` nahi" },
            ],
            [
              "3-4",
              { en: "Is something filtering the traffic?", hi: "Kya koi cheez traffic filter kar rahi hai?" },
              "show access-lists",
              { en: "Expected lines matching; no rising deny counters for your traffic", hi: "Expected lines match ho rahi hain; tumhare traffic ke liye deny counters nahi badh rahe" },
            ],
            [
              "3",
              { en: "Where along the path does it stop?", hi: "Path mein kahan ruk raha hai?" },
              "ping, traceroute",
              { en: "`!!!!!` and every hop answering", hi: "`!!!!!` aur har hop jawab de raha hai" },
            ],
          ],
        },
        {
          type: "cli",
          title: { en: "A trunk carrying VLANs 10, 20 and 99", hi: "VLANs 10, 20 aur 99 carry karta hua trunk" },
          lines: [
            { prompt: "SW1#", cmd: "show interfaces trunk" },
            { out: "Port        Mode             Encapsulation  Status        Native vlan" },
            { out: "Gi1/0/24    on               802.1q         trunking      1" },
            { out: "Port        Vlans allowed on trunk" },
            { out: "Gi1/0/24    10,20,99", comment: { en: "Allowed by configuration", hi: "Configuration se allowed" } },
            { out: "Port        Vlans allowed and active in management domain" },
            { out: "Gi1/0/24    10,20,99", comment: { en: "Allowed, and the VLAN exists and is active on this switch", hi: "Allowed hai, aur VLAN is switch par exist karta hai aur active hai" } },
            { out: "Port        Vlans in spanning tree forwarding state and not pruned" },
            { out: "Gi1/0/24    10,20,99", comment: { en: "Actually forwarding. A VLAN missing only here is blocked by STP or pruned", hi: "Sach mein forward ho raha hai. Agar VLAN sirf yahan missing hai toh STP ne block kiya hai ya prune hua hai" } },
          ],
          note: {
            en: "Read the three lists in order. A VLAN that drops out between the first and second list does not exist on this switch (or is shut down).",
            hi: "Teeno lists order mein padho. Agar koi VLAN pehli aur doosri list ke beech gayab ho jaata hai, toh woh is switch par bana hi nahi hai (ya shutdown hai).",
          },
        },
      ],
    },
    {
      id: "real-ticket",
      heading: { en: "A real ticket: VLAN 20 cannot reach the file server", hi: "Ek real ticket: VLAN 20 file server tak nahi pahunch raha" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The setup: PC1 (10.1.20.25/24, VLAN 20) and PC2 (10.1.10.25/24, VLAN 10) connect to access switch SW1. SW1's trunk Gi1/0/24 goes to DSW1, a Layer 3 switch with SVIs `Vlan10` 10.1.10.1, `Vlan20` 10.1.20.1 and `Vlan100` 10.1.100.1. File server FS1 is 10.1.100.10 in VLAN 100. The scope (all of VLAN 20, VLAN 10 fine) and the change log (VLAN 20 added on Friday) point at something that only VLAN 20 uses, so you follow PC1's path.",
            hi: "Setup yeh hai: PC1 (10.1.20.25/24, VLAN 20) aur PC2 (10.1.10.25/24, VLAN 10) access switch SW1 se jude hain. SW1 ka trunk Gi1/0/24 DSW1 tak jaata hai, jo ek Layer 3 switch hai jisme SVIs hain: `Vlan10` 10.1.10.1, `Vlan20` 10.1.20.1 aur `Vlan100` 10.1.100.1. File server FS1 10.1.100.10 hai, VLAN 100 mein. Scope (poora VLAN 20, VLAN 10 theek) aur change log (VLAN 20 Friday ko add hua) dono kisi aisi cheez ki taraf point karte hain jo sirf VLAN 20 use karta hai, isliye tum PC1 ka path follow karte ho.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**PC1's settings**: `ipconfig` shows 10.1.20.25, mask 255.255.255.0, gateway 10.1.20.1. Correct.",
              hi: "**PC1 ki settings**: `ipconfig` dikhata hai 10.1.20.25, mask 255.255.255.0, gateway 10.1.20.1. Sahi hai.",
            },
            {
              en: "**Ping the gateway** 10.1.20.1: it replies. That one test proves the cable, the access port VLAN, the trunk and the `Vlan20` SVI. No need to log in to SW1.",
              hi: "**Gateway ko ping karo** 10.1.20.1: reply aata hai. Is ek test se cable, access port ka VLAN, trunk aur `Vlan20` SVI sab prove ho gaye. SW1 par login karne ki zaroorat hi nahi.",
            },
            {
              en: "**Traceroute** to 10.1.100.10: hop 1 (10.1.20.1) answers, hop 2 times out. Traffic reaches DSW1 and goes no further. (Some devices answer an ACL drop with an ICMP \"administratively prohibited\" unreachable from 10.1.20.1 instead of staying silent, which points at a filter even more directly.)",
              hi: "10.1.100.10 tak **traceroute**: hop 1 (10.1.20.1) jawab deta hai, hop 2 time out. Traffic DSW1 tak pahunchta hai aur aage nahi jaata. (Kuch devices ACL drop par chup nahi rehte, balki 10.1.20.1 se ICMP \"administratively prohibited\" unreachable bhej dete hain. Woh toh seedha filter ki taraf ishara hai.)",
            },
            {
              en: "**Routing on DSW1**: `show ip route` has `C 10.1.100.0/24` on `Vlan100`, and `show ip arp` has FS1's MAC. Routing and ARP are fine, which VLAN 10 already suggested.",
              hi: "**DSW1 par routing**: `show ip route` mein `Vlan100` par `C 10.1.100.0/24` hai, aur `show ip arp` mein FS1 ka MAC hai. Routing aur ARP theek hain, VLAN 10 ne yeh pehle hi hint kar diya tha.",
            },
            {
              en: "**Hypothesis: a filter.** `show ip interface vlan 100` shows an outbound ACL called SERVERS. `show access-lists SERVERS` permits only 10.1.10.0/24, and the deny line's counter rises each time PC1 tries.",
              hi: "**Hypothesis: koi filter.** `show ip interface vlan 100` mein SERVERS naam ki outbound ACL dikhti hai. `show access-lists SERVERS` sirf 10.1.10.0/24 ko permit karti hai, aur jab bhi PC1 try karta hai, deny line ka counter badh jaata hai.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "The evidence on DSW1", hi: "DSW1 par evidence" },
          lines: [
            { prompt: "DSW1#", cmd: "show ip interface vlan 100 | include access list" },
            { out: "  Outgoing access list is SERVERS", comment: { en: "Filters packets routed out towards VLAN 100", hi: "VLAN 100 ki taraf route hone wale packets filter karti hai" } },
            { out: "  Inbound  access list is not set" },
            { prompt: "DSW1#", cmd: "show access-lists SERVERS" },
            { out: "Extended IP access list SERVERS" },
            { out: "    10 permit tcp 10.1.10.0 0.0.0.255 host 10.1.100.10 eq 445 (1843 matches)" },
            { out: "    20 permit icmp 10.1.10.0 0.0.0.255 host 10.1.100.10 (52 matches)" },
            { out: "    30 deny ip any any (311 matches)", comment: { en: "VLAN 20 traffic lands here", hi: "VLAN 20 ka traffic yahan aakar girta hai" } },
          ],
          note: {
            en: "Port 445 is SMB, the Windows file-sharing protocol. When VLAN 20 was added, nobody updated this ACL, so its traffic fell through to line 30. Without the explicit deny you would still be blocked by the implicit deny, but you would see no counter.",
            hi: "Port 445 SMB hai, Windows file sharing ka protocol. VLAN 20 add karte waqt kisi ne yeh ACL update nahi ki, isliye uska traffic line 30 tak gir gaya. Explicit deny na hota tab bhi implicit deny block karta, bas tumhe koi counter nahi dikhta.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "If the gateway ping had failed", hi: "Agar gateway ping fail hota" },
          text: {
            en: "Then the fault is between PC1 and DSW1, and the classic cause for a new VLAN is the trunk. `show interfaces trunk` on SW1 would show `10,99` instead of `10,20,99` under \"Vlans allowed on trunk\". The fix is `switchport trunk allowed vlan add 20` on Gi1/0/24 (and check the DSW1 end of the trunk too). Same ticket, different branch of the method.",
            hi: "Tab fault PC1 aur DSW1 ke beech hota, aur naye VLAN ke liye classic cause trunk hota hai. SW1 par `show interfaces trunk` mein \"Vlans allowed on trunk\" ke neeche `10,20,99` ki jagah `10,99` dikhta. Fix hai Gi1/0/24 par `switchport trunk allowed vlan add 20` (aur trunk ka DSW1 wala end bhi check karo). Ticket wahi, method ki branch alag.",
          },
        },
      ],
    },
    {
      id: "fix-and-verify",
      heading: { en: "Fix one thing, then verify", hi: "Ek cheez fix karo, phir verify karo" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The hypothesis is confirmed by evidence, so make the smallest change that fixes it. With a named ACL you can insert lines by sequence number without retyping the list. Before you press Enter, write down the rollback: `no 15` and `no 25` under the same ACL.",
            hi: "Hypothesis evidence se confirm ho gayi, toh sabse chhota change karo jo ise fix kare. Named ACL mein sequence number se lines insert kar sakte ho, poori list dobara type kiye bina. Enter dabane se pehle rollback likh lo: usi ACL ke andar `no 15` aur `no 25`.",
          },
        },
        {
          type: "cli",
          title: { en: "Insert two lines for VLAN 20", hi: "VLAN 20 ke liye do lines insert karo" },
          lines: [
            { prompt: "DSW1(config)#", cmd: "ip access-list extended SERVERS" },
            { prompt: "DSW1(config-ext-nacl)#", cmd: "15 permit tcp 10.1.20.0 0.0.0.255 host 10.1.100.10 eq 445" },
            { prompt: "DSW1(config-ext-nacl)#", cmd: "25 permit icmp 10.1.20.0 0.0.0.255 host 10.1.100.10" },
            { prompt: "DSW1(config-ext-nacl)#", cmd: "end" },
            { prompt: "DSW1#", cmd: "show access-lists SERVERS" },
            { out: "Extended IP access list SERVERS" },
            { out: "    10 permit tcp 10.1.10.0 0.0.0.255 host 10.1.100.10 eq 445 (1843 matches)" },
            { out: "    15 permit tcp 10.1.20.0 0.0.0.255 host 10.1.100.10 eq 445 (9 matches)", comment: { en: "After PC1 retries, its SMB traffic matches here", hi: "PC1 ke dobara try karne par uska SMB traffic yahan match hota hai" } },
            { out: "    20 permit icmp 10.1.10.0 0.0.0.255 host 10.1.100.10 (52 matches)" },
            { out: "    25 permit icmp 10.1.20.0 0.0.0.255 host 10.1.100.10 (4 matches)" },
            { out: "    30 deny ip any any (311 matches)", comment: { en: "Counter stopped rising", hi: "Counter ab nahi badh raha" } },
          ],
        },
        {
          type: "list",
          items: [
            { en: "**Verify from the user's side**: PC1 opens \\\\FS1 and pings 10.1.100.10. A green show command is not proof the user is happy.", hi: "**User ki side se verify karo**: PC1 \\\\FS1 open karta hai aur 10.1.100.10 ping karta hai. Show command achha dikhe, iska matlab yeh nahi ki user khush hai." },
            { en: "**Check for regressions**: PC2 in VLAN 10 still reaches FS1. A fix that breaks something else is a new ticket.", hi: "**Regression check karo**: VLAN 10 ka PC2 abhi bhi FS1 tak pahunchta hai. Jo fix kuch aur tod de, woh ek naya ticket hai." },
            { en: "**Save** with `copy running-config startup-config` once you are sure, so the fix survives a reload.", hi: "Sure hone ke baad `copy running-config startup-config` se **save karo**, taaki reload ke baad bhi fix bana rahe." },
            { en: "**Change one thing at a time.** If the first hypothesis is wrong, roll it back before testing the next one, or you will stack unknown changes.", hi: "**Ek time par ek cheez badlo.** Pehli hypothesis galat nikle toh agli test karne se pehle use roll back karo, warna unknown changes jama hote jaayenge." },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The trunk trap", hi: "Trunk wala trap" },
          text: {
            en: "`switchport trunk allowed vlan 20` replaces the allowed list with just VLAN 20 and cuts every other VLAN on that trunk. To add one VLAN, always use `switchport trunk allowed vlan add 20`.",
            hi: "`switchport trunk allowed vlan 20` allowed list ko sirf VLAN 20 se replace kar deta hai aur us trunk ke baaki saare VLANs kaat deta hai. Ek VLAN add karna ho toh hamesha `switchport trunk allowed vlan add 20` use karo.",
          },
        },
      ],
    },
    {
      id: "document",
      heading: { en: "Document so the next person is faster", hi: "Document karo taaki agla engineer jaldi kare" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A ticket closed with \"fixed\" teaches nobody anything. A good note lets a colleague understand the fault in one minute and spot the same pattern next time.",
            hi: "\"Fixed\" likh kar close kiya ticket kisi ko kuch nahi sikhata. Achha note ek colleague ko ek minute mein fault samjha deta hai aur agli baar same pattern pakadne mein madad karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Ticket note for this fault", hi: "Is fault ka ticket note" },
          columns: ["Field", "Entry"],
          rows: [
            [{ en: "Symptom", hi: "Symptom" }, { en: "VLAN 20 users cannot open \\\\FS1 or ping 10.1.100.10; VLAN 10 fine", hi: "VLAN 20 users \\\\FS1 open ya 10.1.100.10 ping nahi kar pa rahe; VLAN 10 theek" }],
            [{ en: "Root cause", hi: "Root cause" }, { en: "ACL SERVERS (out on Vlan100, DSW1) permitted only 10.1.10.0/24; not updated when VLAN 20 was added", hi: "ACL SERVERS (DSW1 ke Vlan100 par out) sirf 10.1.10.0/24 permit karti thi; VLAN 20 add hone par update nahi hui" }],
            [{ en: "Fix", hi: "Fix" }, { en: "Added lines 15 and 25 for 10.1.20.0/24; saved config. Rollback: `no 15`, `no 25`", hi: "10.1.20.0/24 ke liye lines 15 aur 25 add ki; config save kiya. Rollback: `no 15`, `no 25`" }],
            [{ en: "Evidence", hi: "Evidence" }, { en: "Deny counter on line 30 rising before; lines 15 and 25 matching after; PC1 and PC2 tested", hi: "Pehle line 30 ka deny counter badh raha tha; baad mein lines 15 aur 25 match ho rahi hain; PC1 aur PC2 dono test kiye" }],
            [{ en: "Prevention", hi: "Prevention" }, { en: "Add \"update server ACLs\" to the new-VLAN checklist", hi: "New-VLAN checklist mein \"server ACLs update karo\" add karo" }],
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Problem statement", def: { en: "A precise description of who is affected, what fails, since when, and what still works.", hi: "Precise description ki kaun affected hai, kya fail ho raha hai, kab se, aur kya abhi bhi kaam kar raha hai." } },
    { term: "Scope", def: { en: "How far a fault reaches: one host, one VLAN, one site or everyone. It tells you where to start.", hi: "Fault kitni door tak pahuncha hai: ek host, ek VLAN, ek site ya sab. Isse pata chalta hai kahan se shuru karna hai." } },
    { term: "Baseline", def: { en: "A known-good state or similar working device you compare the broken one against.", hi: "Known-good state ya similar working device jisse broken wale ko compare karte ho." } },
    { term: "Hypothesis", def: { en: "A specific, testable guess about the cause, such as \"an ACL on DSW1 drops VLAN 20 traffic\".", hi: "Cause ke baare mein specific aur testable guess, jaise \"DSW1 par ek ACL VLAN 20 ka traffic drop kar rahi hai\"." } },
    { term: "Divide and conquer", def: { en: "Start with a test in the middle of the stack or path, usually a ping, and continue in the half that failed.", hi: "Stack ya path ke beech se test shuru karo, aam taur par ping, aur jo half fail hua usme aage badho." } },
    { term: "Follow the path", def: { en: "Check each device a packet crosses, hop by hop, from source to destination.", hi: "Packet jin devices se guzarta hai unhe source se destination tak hop by hop check karna." } },
    { term: "Root cause", def: { en: "The underlying reason for the fault, not just the symptom you saw.", hi: "Fault ki asli wajah, sirf woh symptom nahi jo dikha." } },
    { term: "Rollback plan", def: { en: "The exact commands that undo a change, written down before you make it.", hi: "Woh exact commands jo change ko undo karte hain, change karne se pehle likhe hue." } },
  ],
  commands: [
    { cmd: "show interfaces status", mode: "Cisco privileged EXEC", does: { en: "Port state, VLAN, duplex and speed for every switch port", hi: "Har switch port ka state, VLAN, duplex aur speed" } },
    { cmd: "show interfaces Gi1/0/5", mode: "Cisco privileged EXEC", does: { en: "Detailed state and error counters (CRC, input errors, collisions) for one interface", hi: "Ek interface ka detailed state aur error counters (CRC, input errors, collisions)" } },
    { cmd: "show vlan brief", mode: "Cisco privileged EXEC", does: { en: "Which VLANs exist and which access ports are in each", hi: "Kaunse VLANs exist karte hain aur har VLAN mein kaunse access ports hain" } },
    { cmd: "show interfaces trunk", mode: "Cisco privileged EXEC", does: { en: "Trunk ports and the VLANs allowed, active and forwarding on them", hi: "Trunk ports aur un par allowed, active aur forwarding VLANs" } },
    { cmd: "show ip interface brief", mode: "Cisco privileged EXEC", does: { en: "IP address and up/down state of every interface and SVI", hi: "Har interface aur SVI ka IP address aur up/down state" } },
    { cmd: "show ip route", mode: "Cisco privileged EXEC", does: { en: "The routing table", hi: "Routing table" } },
    { cmd: "show ip arp", mode: "Cisco privileged EXEC", does: { en: "IP-to-MAC entries the router or L3 switch has resolved", hi: "Router ya L3 switch ne jo IP-to-MAC entries resolve ki hain" } },
    { cmd: "show ip interface vlan 100", mode: "Cisco privileged EXEC", does: { en: "Detailed interface state, including which ACLs are applied in and out", hi: "Detailed interface state, saath mein kaunsi ACLs in aur out applied hain" } },
    { cmd: "show access-lists", mode: "Cisco privileged EXEC", does: { en: "Every ACL with its lines and match counters", hi: "Har ACL uski lines aur match counters ke saath" } },
    { cmd: "ip access-list extended SERVERS", mode: "Cisco global config", does: { en: "Enter the named extended ACL to add or remove numbered lines", hi: "Named extended ACL mein jaao taaki numbered lines add ya remove kar sako" } },
    { cmd: "switchport trunk allowed vlan add 20", mode: "Cisco interface config", does: { en: "Add VLAN 20 to a trunk without removing the others", hi: "Baaki VLANs hataye bina trunk mein VLAN 20 add karta hai" } },
    { cmd: "ping / traceroute", mode: "Cisco privileged EXEC", does: { en: "Test reachability and find the last hop that answers", hi: "Reachability test karta hai aur aakhri jawab dene wala hop dhoondhta hai" } },
    { cmd: "ipconfig /all, tracert -d", mode: "Windows command prompt", does: { en: "Check the host's IP settings and trace the path without DNS lookups", hi: "Host ki IP settings check karta hai aur bina DNS lookup ke path trace karta hai" } },
  ],
  mistakes: [
    {
      en: "Changing several things at once. If the fault goes away you do not know which change fixed it, and the others stay in the network as hidden risk.",
      hi: "Ek saath kai cheezein badalna. Fault chala gaya toh pata nahi chalega kis change ne fix kiya, aur baaki changes network mein chhupe risk ki tarah reh jaate hain.",
    },
    {
      en: "Skipping the problem statement and logging in to the first device you think of. Ask who, what, when, what changed and what still works first.",
      hi: "Problem statement chhod kar jo device pehle dimaag mein aaye us par login kar lena. Pehle poocho: kaun, kya, kab, kya badla aur kya abhi bhi kaam kar raha hai.",
    },
    {
      en: "Rechecking parts a test has already proven. If PC1 can ping its gateway, the access port and trunk carry VLAN 20; move on.",
      hi: "Un parts ko dobara check karna jo test se already prove ho chuke hain. PC1 apna gateway ping kar sakta hai toh access port aur trunk VLAN 20 carry kar rahe hain; aage badho.",
    },
    {
      en: "Typing `switchport trunk allowed vlan 20` to add a VLAN. It replaces the list; use `allowed vlan add 20`.",
      hi: "VLAN add karne ke liye `switchport trunk allowed vlan 20` type karna. Yeh list replace kar deta hai; `allowed vlan add 20` use karo.",
    },
    {
      en: "Closing the ticket after a show command looks right. Verify from the user's side and check that working users still work.",
      hi: "Show command sahi dikhte hi ticket close kar dena. User ki side se verify karo aur check karo ki jo users kaam kar rahe the woh ab bhi kar rahe hain.",
    },
    {
      en: "Forgetting the implicit deny. An ACL that lists only VLAN 10 blocks every other subnet, even with no deny line written.",
      hi: "Implicit deny bhool jaana. Jo ACL sirf VLAN 10 list karti hai woh baaki har subnet ko block karti hai, chahe koi deny line likhi ho ya nahi.",
    },
  ],
  recap: [
    { en: "Define, gather, choose an approach, test one hypothesis, fix, verify, document.", hi: "Order yaad rakho: define, gather, approach choose karo, ek time par ek hypothesis test karo, fix, verify, document." },
    { en: "Scope and \"what changed\" usually point at the fault faster than any command.", hi: "Scope aur \"kya badla\" aksar kisi bhi command se jaldi fault ki taraf point karte hain." },
    { en: "A ping to the gateway splits the problem: success proves the host, access port and trunk.", hi: "Gateway ka ping problem ko do hisson mein baant deta hai: success se host, access port aur trunk prove ho jaate hain." },
    { en: "Per-layer checks: interfaces status, vlan brief, interfaces trunk, ip interface brief, ip route, ip arp, access-lists.", hi: "Har layer ke checks: interfaces status, vlan brief, interfaces trunk, ip interface brief, ip route, ip arp, access-lists." },
    { en: "Rising deny counters in `show access-lists` are evidence that an ACL drops your traffic.", hi: "`show access-lists` mein badhte deny counters evidence hain ki ACL tumhara traffic drop kar rahi hai." },
    { en: "Record symptom, root cause, fix, evidence and prevention in the ticket.", hi: "Ticket mein symptom, root cause, fix, evidence aur prevention record karo." },
  ],
  quiz: [
    {
      q: {
        en: "PC1 (10.1.20.25/24) can ping its gateway 10.1.20.1 but not the server 10.1.100.10. Which cause can you now rule out?",
        hi: "PC1 (10.1.20.25/24) apna gateway 10.1.20.1 ping kar sakta hai lekin server 10.1.100.10 nahi. Ab kaunsa cause rule out kar sakte ho?",
      },
      options: [
        { en: "An ACL on the gateway filtering traffic to the server VLAN", hi: "Gateway par ek ACL jo server VLAN ka traffic filter kar rahi hai" },
        { en: "VLAN 20 missing from the trunk between the access switch and the gateway", hi: "Access switch aur gateway ke beech trunk par VLAN 20 ka missing hona" },
        { en: "A wrong default gateway configured on the server", hi: "Server par galat default gateway configured hona" },
        { en: "The server's switch port being in the wrong VLAN", hi: "Server ka switch port galat VLAN mein hona" },
      ],
      answer: 1,
      explain: {
        en: "The ping to 10.1.20.1 had to cross the access port and the trunk in VLAN 20 to reach the SVI, so the trunk carries VLAN 20. The other three are all beyond the gateway and are still possible.",
        hi: "10.1.20.1 tak ping pahunchne ke liye use VLAN 20 mein access port aur trunk cross karna pada, toh trunk VLAN 20 carry kar raha hai. Baaki teeno gateway ke aage hain aur abhi bhi possible hain.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Users on the 3rd-floor switch lost access after a change, but the identical 2nd-floor switch works. Which approach is likely to find the fault fastest?",
        hi: "Ek change ke baad 3rd floor ke switch ke users ka access chala gaya, lekin bilkul same 2nd floor wala switch kaam kar raha hai. Kaunsa approach sabse jaldi fault dhoondhega?",
      },
      options: [
        { en: "Bottom-up, starting with every cable on the 3rd floor", hi: "Bottom-up, 3rd floor ki har cable se shuru karke" },
        { en: "Swap the 3rd-floor switch for a spare", hi: "3rd floor ka switch spare se swap karna" },
        { en: "Top-down, starting with the users' applications", hi: "Top-down, users ki applications se shuru karke" },
        { en: "Compare the two switches' configurations and look for differences", hi: "Dono switches ki configurations compare karna aur differences dhoondhna" },
      ],
      answer: 3,
      explain: {
        en: "You have a working baseline (the 2nd floor) and a recent change, so comparing configs points straight at what differs. Swapping hardware would not help, because a config change caused it, and the replacement would need the same config anyway.",
        hi: "Tumhare paas working baseline (2nd floor) aur ek recent change dono hain, toh configs compare karne se seedha fark dikh jaayega. Hardware swap se kuch nahi hoga, kyunki problem config change se aayi, aur naye switch ko bhi wahi config chahiye hogi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`show access-lists SERVERS` shows: `10 permit tcp 10.1.10.0 0.0.0.255 host 10.1.100.10 eq 445 (1843 matches)` and `30 deny ip any any (311 matches)`. The deny counter rises each time 10.1.20.25 tries to open the share. What is happening?",
        hi: "`show access-lists SERVERS` dikhata hai: `10 permit tcp 10.1.10.0 0.0.0.255 host 10.1.100.10 eq 445 (1843 matches)` aur `30 deny ip any any (311 matches)`. Jab bhi 10.1.20.25 share open karne ki koshish karta hai, deny counter badhta hai. Kya ho raha hai?",
      },
      options: [
        { en: "10.1.20.25's traffic matches no permit line and is dropped by line 30", hi: "10.1.20.25 ka traffic kisi permit line se match nahi hota aur line 30 use drop kar deti hai" },
        { en: "Line 10 permits 10.1.20.25 because port 445 is allowed", hi: "Line 10 10.1.20.25 ko permit karti hai kyunki port 445 allowed hai" },
        { en: "The ACL is not applied anywhere, so the counters are only a test", hi: "ACL kahin apply nahi hai, toh counters sirf test hain" },
        { en: "The server is rejecting the connection and the switch is counting the resets", hi: "Server connection reject kar raha hai aur switch resets count kar raha hai" },
      ],
      answer: 0,
      explain: {
        en: "Line 10 only matches sources in 10.1.10.0/24. 10.1.20.25 falls through to line 30 and is denied, which is why that counter rises with each attempt. Counters only increase on an ACL that is applied and matching traffic.",
        hi: "Line 10 sirf 10.1.10.0/24 ke sources ko match karti hai. 10.1.20.25 neeche line 30 tak girta hai aur deny ho jaata hai, isliye har attempt par wahi counter badhta hai. Counters sirf tab badhte hain jab ACL applied ho aur traffic match kar rahi ho.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "On SW1, `show interfaces trunk` lists `10,99` under \"Vlans allowed on trunk\" for Gi1/0/24, and VLAN 20 users cannot reach their gateway. Which command fixes it without affecting other VLANs?",
        hi: "SW1 par `show interfaces trunk` Gi1/0/24 ke liye \"Vlans allowed on trunk\" ke neeche `10,99` dikhata hai, aur VLAN 20 users apne gateway tak nahi pahunch pa rahe. Kaunsa command baaki VLANs ko affect kiye bina ise fix karega?",
      },
      options: [
        { en: "`switchport trunk allowed vlan 20`", hi: "`switchport trunk allowed vlan 20`" },
        { en: "`switchport access vlan 20`", hi: "`switchport access vlan 20`" },
        { en: "`switchport trunk allowed vlan add 20`", hi: "`switchport trunk allowed vlan add 20`" },
        { en: "`switchport trunk native vlan 20`", hi: "`switchport trunk native vlan 20`" },
      ],
      answer: 2,
      explain: {
        en: "`add` appends VLAN 20 to the existing list, giving 10,20,99. Without `add`, the list becomes only 20 and VLANs 10 and 99 are cut. The access and native VLAN commands do not change which VLANs the trunk allows.",
        hi: "`add` existing list mein VLAN 20 jod deta hai, toh list 10,20,99 ho jaati hai. `add` ke bina list sirf 20 reh jaati hai aur VLANs 10 aur 99 kat jaate hain. Access aur native VLAN commands yeh nahi badalte ki trunk kaunse VLANs allow karta hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "You added the missing ACL lines and `show access-lists` now shows matches on them. What should you do before closing the ticket?",
        hi: "Tumne missing ACL lines add kar di aur `show access-lists` ab un par matches dikha raha hai. Ticket close karne se pehle kya karna chahiye?",
      },
      options: [
        { en: "Nothing more; the counters prove it works", hi: "Kuch nahi; counters prove karte hain ki kaam ho gaya" },
        { en: "Reload DSW1 to make sure the change is active", hi: "DSW1 reload karo taaki change active ho jaaye" },
        { en: "Remove the explicit deny line so this cannot happen again", hi: "Explicit deny line hata do taaki yeh dobara na ho" },
        { en: "Confirm from PC1 that the share opens, confirm VLAN 10 still works, save the config and record the root cause", hi: "PC1 se confirm karo ki share khulta hai, confirm karo ki VLAN 10 ab bhi kaam karta hai, config save karo aur root cause record karo" },
      ],
      answer: 3,
      explain: {
        en: "Verification means the user's task works and nothing that worked before broke. Then save and document. Removing the explicit deny changes nothing, because the implicit deny still blocks unlisted traffic; it only hides the counter.",
        hi: "Verification ka matlab hai user ka kaam ho raha hai aur jo pehle chal raha tha woh toota nahi. Phir save aur document karo. Explicit deny hatane se kuch nahi badalta, kyunki implicit deny unlisted traffic ko phir bhi block karega; bas counter chhup jaayega.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Only one user in VLAN 20 cannot reach anything, while the other 40 users in VLAN 20 work normally. Where should you start?",
        hi: "VLAN 20 mein sirf ek user kahin nahi pahunch pa raha, jabki VLAN 20 ke baaki 40 users normal kaam kar rahe hain. Kahan se shuru karna chahiye?",
      },
      options: [
        { en: "The ACLs on the distribution switch", hi: "Distribution switch ki ACLs" },
        { en: "That user's PC, cable and access port", hi: "Us user ka PC, cable aur access port" },
        { en: "The trunk between the access and distribution switches", hi: "Access aur distribution switches ke beech ka trunk" },
        { en: "The routing table on the gateway", hi: "Gateway ki routing table" },
      ],
      answer: 1,
      explain: {
        en: "The other 40 users share the trunk, the gateway, its routes and its ACLs, and they work, so those are proven. What is unique to the broken user is their PC, cable and access port, so start there, usually bottom-up.",
        hi: "Baaki 40 users trunk, gateway, uske routes aur ACLs share karte hain aur unka sab chal raha hai, toh yeh sab proven hai. Broken user ke liye unique sirf uska PC, cable aur access port hai, isliye wahin se shuru karo, aam taur par bottom-up.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "dovuPm3dGhc",
      title: "Network Troubleshooting Methodology - CompTIA Network+ N10-009 - 5.1",
      channel: "Professor Messer",
      lang: "en",
      note: { en: "A clear 8-minute walk through the steps of a troubleshooting methodology, from identifying the problem to documenting it.", hi: "8 minute mein troubleshooting methodology ke steps, problem identify karne se lekar document karne tak, clearly samjhaata hai." },
    },
    {
      id: "Z401oSRbNuM",
      title: "FREE CCNA Lab 021: Review Troubleshooting Lab 1",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "A Packet Tracer lab where you hunt faults in VLANs, trunks, port security and router-on-a-stick. Good practice for the method.", hi: "Packet Tracer lab jisme VLANs, trunks, port security aur router-on-a-stick mein faults dhoondhne hain. Method practise karne ke liye achha hai." },
    },
    {
      id: "7KM1U2OmJu4",
      title: "1. Troubleshooting Mastery Course | Introduction to Network Troubleshooting - Part 1",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi introduction to network troubleshooting, with the kind of problems seen in production networks.", hi: "Network troubleshooting ka Hindi introduction, production networks mein aane wali problems ke saath." },
    },
    {
      id: "LQycokZzruU",
      title: "9  Tshoot Mastery Course Cisco | iOS Verification Commands",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi revision of the IOS show commands used while troubleshooting.", hi: "Troubleshooting mein use hone wale IOS show commands ka Hindi revision." },
    },
  ],
  lab: {
    title: { en: "Break it, then fix it with the method", hi: "Pehle todo, phir method se fix karo" },
    steps: [
      { en: "In Packet Tracer, build PC1 (VLAN 20, 10.1.20.25/24) and PC2 (VLAN 10, 10.1.10.25/24) on a 2960 (SW1), trunked to a 3560 (DSW1) with `ip routing` and SVIs 10.1.10.1, 10.1.20.1 and 10.1.100.1. Put a server at 10.1.100.10 in VLAN 100.", hi: "Packet Tracer mein ek 2960 (SW1) par PC1 (VLAN 20, 10.1.20.25/24) aur PC2 (VLAN 10, 10.1.10.25/24) banao, jo ek 3560 (DSW1) se trunk hai jisme `ip routing` aur SVIs 10.1.10.1, 10.1.20.1 aur 10.1.100.1 hain. VLAN 100 mein 10.1.100.10 par ek server rakho." },
      { en: "Confirm both PCs can ping the server. Save this as your baseline.", hi: "Confirm karo ki dono PCs server ko ping kar sakte hain. Ise apni baseline ki tarah save karo." },
      { en: "Ask a friend to introduce one fault: an ACL on `Vlan100` out, a VLAN removed from the trunk, or a wrong gateway on a PC. Or do it yourself and wait a day.", hi: "Kisi dost se ek fault daalne ko kaho: `Vlan100` par out ACL, trunk se ek VLAN hatana, ya PC par galat gateway. Ya khud karo aur ek din baad dekho." },
      { en: "Write a one-line problem statement, then ping the gateway first and decide which half of the network to look at.", hi: "Ek line ka problem statement likho, phir sabse pehle gateway ping karo aur decide karo ki network ka kaunsa half dekhna hai." },
      { en: "Find the cause using the per-layer commands, fix it with one change, verify from both PCs, and write the ticket note.", hi: "Har layer ke commands se cause dhoondho, ek change se fix karo, dono PCs se verify karo, aur ticket note likho." },
    ],
  },
};

export default lesson;
