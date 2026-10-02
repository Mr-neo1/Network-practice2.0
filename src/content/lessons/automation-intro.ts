import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "automation-intro",
  intro: {
    en: "In every lab so far you have changed devices one at a time: SSH in, type commands, save, move to the next box. That is fine for five switches. With 400 switches the same change takes days, and every session is another chance for a typo that nobody notices until something breaks. Network automation lets software make one tested change everywhere, check the result and record who did what, so engineers spend their time on design and troubleshooting instead of repetitive typing.",
    hi: "Ab tak har lab mein tumne devices ek-ek karke change kiye hain: SSH karo, commands type karo, save karo, agle box par jao. Paanch switches ke liye yeh theek hai. 400 switches par wahi change kai din leta hai, aur har session mein ek typo ka chance hai jo tab tak kisi ko nahi dikhta jab tak kuch toot na jaaye. Network automation se software ek tested change har jagah karta hai, result check karta hai aur record rakhta hai ki kisne kya kiya. Isse engineers ka time repetitive typing ki jagah design aur troubleshooting par lagta hai.",
  },
  outcomes: [
    { en: "Explain what manual CLI changes cost: time, typos, inconsistency and configuration drift", hi: "Samjha sako ki manual CLI changes ki keemat kya hai: time, typos, inconsistency aur configuration drift" },
    { en: "List what automation gives: speed, consistency, scale, validation, an audit trail and fewer outages", hi: "Bata sako ki automation kya deta hai: speed, consistency, scale, validation, audit trail aur kam outages" },
    { en: "Classify any device function into the data, control or management plane", hi: "Kisi bhi device function ko data, control ya management plane mein classify kar sako" },
    { en: "Compare script-based automation with controller-based automation", hi: "Script-based automation ko controller-based automation se compare kar sako" },
    { en: "Describe a safe automated change: template, pre-check, push, post-check, log", hi: "Ek safe automated change describe kar sako: template, pre-check, push, post-check, log" },
  ],
  sections: [
    {
      id: "the-manual-way",
      heading: { en: "What a manual change really costs", hi: "Manual change ki asli keemat" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Take a simple, real task. The company is retiring its old NTP server `10.0.0.10` and every switch must now use `10.0.0.20`. On each switch an engineer does this:",
            hi: "Ek simple, real task lo. Company apna purana NTP server `10.0.0.10` hata rahi hai, aur ab har switch ko `10.0.0.20` use karna hai. Har switch par engineer yeh karta hai:",
          },
        },
        {
          type: "cli",
          title: { en: "The same five lines, typed on every switch", hi: "Wahi paanch lines, har switch par type ki hui" },
          lines: [
            { prompt: "SW1#", cmd: "configure terminal" },
            { prompt: "SW1(config)#", cmd: "no ntp server 10.0.0.10" },
            { prompt: "SW1(config)#", cmd: "ntp server 10.0.0.20" },
            { prompt: "SW1(config)#", cmd: "end" },
            { prompt: "SW1#", cmd: "write memory" },
            { out: "Building configuration...\n[OK]" },
          ],
          note: {
            en: "About five minutes per switch once you count logging in, checking and saving. For 400 switches that is more than 30 hours of typing the same thing.",
            hi: "Login, check aur save milakar har switch par lagbhag paanch minute. 400 switches ke liye yeh 30 ghante se zyada ki same typing hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Time**: the work grows linearly with the number of devices. Urgent changes, such as closing a security hole, wait for someone to get through the list.",
              hi: "**Time**: kaam devices ki ginti ke saath seedha badhta hai. Urgent changes, jaise security hole band karna, tab tak rukte hain jab tak koi poori list khatam na kar le.",
            },
            {
              en: "**Typos**: `ntp server 10.0.0.200` is valid syntax, so IOS accepts it without a word. The switch simply never syncs.",
              hi: "**Typos**: `ntp server 10.0.0.200` valid syntax hai, isliye IOS bina kuch bole accept kar leta hai. Switch bas kabhi sync nahi hota.",
            },
            {
              en: "**Inconsistency**: two engineers do the same job slightly differently, one adds `prefer`, one forgets to save.",
              hi: "**Inconsistency**: do engineers same kaam thoda alag tareeke se karte hain, ek `prefer` laga deta hai, doosra save karna bhool jaata hai.",
            },
            {
              en: "**Configuration drift**: over months, devices that should be identical slowly stop matching the standard because of one-off fixes, skipped devices and typos.",
              hi: "**Configuration drift**: mahino mein jo devices identical hone chahiye the, woh one-off fixes, chhoote hue devices aur typos ki wajah se dheere-dheere standard se alag ho jaate hain.",
            },
            {
              en: "**No record**: weeks later nobody can say exactly what was changed, on which device, or by whom.",
              hi: "**No record**: kuch hafton baad koi nahi bata sakta ki exactly kya badla, kis device par, aur kisne badla.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Silent failures are the worst kind", hi: "Silent failures sabse bure hote hain" },
          text: {
            en: "A switch pointed at the wrong NTP server keeps forwarding traffic perfectly. Its clock just drifts, so its syslog timestamps stop lining up with the others (lesson 4.6). You find out weeks later, in the middle of an outage, when you need those timestamps most.",
            hi: "Galat NTP server wala switch traffic bilkul theek forward karta rehta hai. Bas uska clock drift hota hai, toh uske syslog timestamps baaki devices se match nahi karte (lesson 4.6). Pata hafton baad chalta hai, outage ke beech mein, jab un timestamps ki sabse zyada zaroorat hoti hai.",
          },
        },
      ],
    },
    {
      id: "what-automation-gives",
      heading: { en: "What automation gives you", hi: "Automation tumhe kya deta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Network automation** means software, not a person at a keyboard, applies and checks changes. The engineer still decides what the change is. The software does the repetitive part the same way every time.",
            hi: "**Network automation** ka matlab hai changes ko keyboard par baitha insaan nahi, software apply aur check karta hai. Change kya hoga, yeh engineer hi decide karta hai. Repetitive kaam software har baar same tareeke se karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Manual problems and the automated answer", hi: "Manual problems aur unka automated jawab" },
          columns: ["Manual CLI", "With automation"],
          rows: [
            [
              { en: "Hours or days for 400 devices", hi: "400 devices ke liye ghante ya din" },
              { en: "Minutes, devices handled in parallel", hi: "Minutes, devices parallel mein handle hote hain" },
            ],
            [
              { en: "Each engineer types it their own way", hi: "Har engineer apne tareeke se type karta hai" },
              { en: "One template, identical result everywhere", hi: "Ek template, har jagah identical result" },
            ],
            [
              { en: "Typos found when something breaks", hi: "Typos tab milte hain jab kuch toot jaaye" },
              { en: "Input validated before anything is pushed", hi: "Push se pehle hi input validate hota hai" },
            ],
            [
              { en: "Drift builds up unnoticed", hi: "Drift chupchaap badhta rehta hai" },
              { en: "Running configs compared to the standard on a schedule", hi: "Running configs schedule par standard se compare hote hain" },
            ],
            [
              { en: "No reliable record of who changed what", hi: "Kisne kya badla, iska reliable record nahi" },
              { en: "Every run logged; templates kept in version control", hi: "Har run log hota hai; templates version control mein rehte hain" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Fewer human errors means **fewer outages**, because most outages start with a change. And because the work is cheap to repeat, you can afford to check every device every day instead of trusting that nothing moved.",
            hi: "Kam human errors matlab **kam outages**, kyunki zyada tar outages kisi change se hi shuru hote hain. Aur kyunki kaam repeat karna sasta hai, tum har device ko roz check kar sakte ho, yeh maan lene ki jagah ki kuch nahi badla.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Automation also spreads mistakes faster", hi: "Automation galti bhi tezi se failata hai" },
          text: {
            en: "A wrong value in a template reaches 400 switches in two minutes. That is why real automation always validates input, tests on a few devices first, and checks the result before calling the job done.",
            hi: "Template mein ek galat value do minute mein 400 switches tak pahunch jaati hai. Isliye real automation hamesha input validate karta hai, pehle kuch devices par test karta hai, aur job ko done bolne se pehle result check karta hai.",
          },
        },
      ],
    },
    {
      id: "three-planes",
      heading: { en: "The data, control and management planes", hi: "Data, control aur management planes" },
      blocks: [
        {
          type: "p",
          text: {
            en: "To understand what automation and SDN (next lesson) change, split everything a router or switch does into three logical **planes**. The question to ask is: is this work moving user traffic, deciding how to move it, or letting people manage the box?",
            hi: "Automation aur SDN (agla lesson) kya badalte hain, yeh samajhne ke liye router ya switch ke saare kaam ko teen logical **planes** mein baanto. Sawaal yeh poochho: yeh kaam user traffic ko move kar raha hai, use move karne ka tareeka decide kar raha hai, ya logon ko box manage karne de raha hai?",
          },
        },
        {
          type: "table",
          caption: { en: "Three planes, with examples you already know", hi: "Teen planes, un examples ke saath jo tum jaante ho" },
          columns: ["Plane", "Job", "Examples"],
          rows: [
            [
              { en: "Data (forwarding)", hi: "Data (forwarding)" },
              { en: "Moves user frames and packets through the device", hi: "User frames aur packets ko device ke through aage bhejta hai" },
              { en: "Switch forwards a frame using its MAC table; router looks up the route, rewrites the MACs and lowers the TTL; ACL permit/deny on transit traffic; NAT translation", hi: "Switch MAC table se frame forward karta hai; router route dekhta hai, MACs badalta hai aur TTL kam karta hai; transit traffic par ACL permit/deny; NAT translation" },
            ],
            [
              { en: "Control", hi: "Control" },
              { en: "Builds the tables the data plane uses", hi: "Woh tables banata hai jo data plane use karta hai" },
              { en: "OSPF building the routing table, STP choosing which ports block, ARP filling the ARP table", hi: "OSPF routing table banata hai, STP decide karta hai kaunse ports block honge, ARP, ARP table bharta hai" },
            ],
            [
              { en: "Management", hi: "Management" },
              { en: "Lets people and tools configure and monitor the device", hi: "Logon aur tools ko device configure aur monitor karne deta hai" },
              { en: "SSH and Telnet sessions, SNMP polling, syslog messages, NTP", hi: "SSH aur Telnet sessions, SNMP polling, syslog messages, NTP" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Follow one packet through R1. OSPF Hellos and LSAs (control plane) built the routing table earlier. When a user's packet arrives, the data plane looks up the destination, rewrites the Ethernet header and sends it out, millions of times a second, usually in hardware. Meanwhile you are logged in over SSH (management plane) reading `show ip route`. The control plane decides, the data plane does, and the management plane lets you watch and change both.",
            hi: "Ek packet ko R1 ke through follow karo. OSPF Hellos aur LSAs (control plane) ne pehle hi routing table bana di. Jab user ka packet aata hai, data plane destination dekhta hai, Ethernet header naya likhta hai aur packet bahar bhej deta hai, ek second mein laakhon baar, aam taur par hardware mein. Isi beech tum SSH (management plane) se login hokar `show ip route` padh rahe ho. Control plane decide karta hai, data plane kaam karta hai, aur management plane se tum dono ko dekhte aur badalte ho.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Expect a function and a choice of planes. Forwarding, MAC rewrite, TTL decrement, ACL and NAT on passing traffic: **data**. Routing protocols, STP, ARP: **control**. SSH, SNMP, syslog, NTP, a web GUI: **management**. Control and management traffic is addressed to the device itself; data plane traffic passes through it.",
            hi: "Exam mein ek function diya hoga aur plane choose karna hoga. Forwarding, MAC rewrite, TTL decrement, guzarte traffic par ACL aur NAT: **data**. Routing protocols, STP, ARP: **control**. SSH, SNMP, syslog, NTP, web GUI: **management**. Control aur management traffic device ke liye hi address hota hai; data plane traffic device ke through guzar jaata hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Automation works through the **management plane**: it logs in with SSH or talks to an API, reads state and pushes configuration. SDN goes further and moves much of the **control plane** into a central controller, which is the next lesson.",
            hi: "Automation **management plane** ke through kaam karta hai: SSH se login karta hai ya API se baat karta hai, state padhta hai aur configuration push karta hai. SDN ek kadam aage jaata hai aur **control plane** ka bada hissa ek central controller mein le jaata hai. Yeh agla lesson hai.",
          },
        },
      ],
    },
    {
      id: "script-vs-controller",
      heading: { en: "Two ways to automate: scripts and controllers", hi: "Automate karne ke do tareeke: scripts aur controllers" },
      blocks: [
        {
          type: "table",
          columns: ["", { en: "Script-based", hi: "Script-based" }, { en: "Controller-based", hi: "Controller-based" }],
          rows: [
            [
              { en: "What it is", hi: "Kya hai" },
              { en: "Your own Python script or Ansible playbook that logs in to each device", hi: "Tumhari apni Python script ya Ansible playbook jo har device par login karti hai" },
              { en: "A central platform that owns the devices, such as Catalyst Center or Catalyst SD-WAN Manager", hi: "Ek central platform jo devices ko own karta hai, jaise Catalyst Center ya Catalyst SD-WAN Manager" },
            ],
            [
              { en: "How you work", hi: "Kaam kaise karte ho" },
              { en: "You write the steps: connect, send these commands, check this output", hi: "Steps tum likhte ho: connect karo, yeh commands bhejo, yeh output check karo" },
              { en: "You describe the result you want; the controller works out the device config", hi: "Tum batate ho kya result chahiye; device config controller khud nikalta hai" },
            ],
            [
              { en: "Talks to devices with", hi: "Devices se baat kis se" },
              { en: "SSH, or device APIs such as NETCONF and RESTCONF", hi: "SSH, ya device APIs jaise NETCONF aur RESTCONF" },
              { en: "Southbound APIs, and offers a northbound REST API to you", hi: "Southbound APIs, aur tumhe northbound REST API deta hai" },
            ],
            [
              { en: "Good for", hi: "Kis ke liye accha" },
              { en: "Targeted jobs, mixed vendors, low cost, full control", hi: "Targeted jobs, mixed vendors, kam cost, poora control" },
              { en: "Large networks, ongoing monitoring, policy across many devices", hi: "Bade networks, lagatar monitoring, bahut saare devices par policy" },
            ],
            [
              { en: "Watch out for", hi: "Kis cheez ka dhyan" },
              { en: "You maintain the code and its error handling", hi: "Code aur uski error handling tumhe maintain karni hai" },
              { en: "Licensing, vendor support for each device, the controller itself must be highly available", hi: "Licensing, har device ka vendor support, aur controller khud highly available hona chahiye" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "They are not rivals. Many teams use a controller for the campus and scripts for everything the controller does not cover. You will meet the pieces later in this module: REST APIs (lesson 6.4), JSON (lesson 6.5) and Ansible and Terraform (lesson 6.6), plus a hands-on Python lesson in module 7.",
            hi: "Yeh dono dushman nahi hain. Kai teams campus ke liye controller use karti hain aur jo controller cover nahi karta uske liye scripts. Is module mein aage yeh pieces milenge: REST APIs (lesson 6.4), JSON (lesson 6.5), aur Ansible aur Terraform (lesson 6.6), aur module 7 mein ek hands-on Python lesson.",
          },
        },
      ],
    },
    {
      id: "a-safe-change",
      heading: { en: "Anatomy of a safe automated change", hi: "Ek safe automated change kaise hota hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Whatever tool you use, a good automated change follows the same shape. Here is the NTP change done properly.",
            hi: "Tool koi bhi ho, accha automated change same pattern follow karta hai. Yeh raha wahi NTP change, sahi tareeke se.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Template**: the change is written once, with the values as variables. Nobody types an address on a device.",
              hi: "**Template**: change ek hi baar likha jaata hai, values variables ke roop mein. Device par koi address type nahi karta.",
            },
            {
              en: "**Validate input**: the tool checks that `new_ntp` is a valid address in the approved server list before anything runs. A value like `10.0.0.200` is rejected here.",
              hi: "**Validate input**: kuch bhi chalne se pehle tool check karta hai ki `new_ntp` approved server list ka valid address hai. `10.0.0.200` jaisi value yahin reject ho jaati hai.",
            },
            {
              en: "**Pre-check**: read each device's current NTP config. This shows the drift: which switches still have the old server, and which have something unexpected.",
              hi: "**Pre-check**: har device ka current NTP config padho. Isse drift dikhta hai: kaunse switches par abhi bhi purana server hai, aur kis par kuch unexpected.",
            },
            {
              en: "**Push**: render the template for each switch and apply it to a few devices first, then to the rest in parallel batches. A switch that already matches gets nothing removed, and re-adding a line it already has changes nothing.",
              hi: "**Push**: har switch ke liye template render karo aur pehle kuch devices par lagao, phir baaki par parallel batches mein. Jo switch pehle se standard par hai, uska kuch remove nahi hota, aur jo line pehle se hai use dobara add karne se kuch nahi badalta.",
            },
            {
              en: "**Post-check**: confirm each switch actually syncs to `10.0.0.20`. A change is only done when the network shows the result.",
              hi: "**Post-check**: confirm karo ki har switch sach mein `10.0.0.20` se sync ho raha hai. Change tabhi done hai jab network result dikhaye.",
            },
            {
              en: "**Log**: record who ran it, when, on which devices, with which result. Store the template in version control so every edit is tracked.",
              hi: "**Log**: record karo kisne chalaya, kab, kin devices par, aur kya result aaya. Template ko version control mein rakho taaki har edit track ho.",
            },
          ],
        },
        {
          type: "code",
          lang: "text",
          title: { en: "The template: one source of truth for every switch", hi: "Template: har switch ke liye ek hi source of truth" },
          code: "! ntp.j2  (Jinja2 template, rendered once per switch)\n{% if old_ntp and old_ntp != new_ntp %}\nno ntp server {{ old_ntp }}\n{% endif %}\nntp server {{ new_ntp }}\n\n! variables for this run\nold_ntp = the server the pre-check found on that switch\nnew_ntp = 10.0.0.20",
        },
        {
          type: "cli",
          title: { en: "What the post-check looks for on each switch", hi: "Post-check har switch par kya dhoondhta hai" },
          lines: [
            { prompt: "SW3#", cmd: "show running-config | include ntp server" },
            { out: "ntp server 10.0.0.20" },
            { prompt: "SW3#", cmd: "show ntp associations" },
            { out: "\n  address         ref clock       st   when   poll reach  delay  offset   disp\n*~10.0.0.20       .GPS.            1     45     64   377  1.204  -0.312  0.876\n * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured" },
            { comment: { en: "`*` means this server is the one the clock is synced to (sys.peer)", hi: "`*` ka matlab clock isi server se synced hai (sys.peer)" } },
          ],
          note: {
            en: "A script reads exactly these lines. If any switch lacks the `*` next to 10.0.0.20, the job reports it as failed instead of claiming success.",
            hi: "Script yahi lines padhti hai. Agar kisi switch par 10.0.0.20 ke saamne `*` nahi hai, toh job use failed report karta hai, success ka daawa nahi karta.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Network automation", def: { en: "Using software to apply, check and record network changes instead of typing them device by device.", hi: "Network changes ko device-by-device type karne ki jagah software se apply, check aur record karna." } },
    { term: "Configuration drift", def: { en: "The gradual difference between how devices are actually configured and the intended standard.", hi: "Devices ka actual configuration aur intended standard ke beech dheere-dheere badhta fark." } },
    { term: "Data plane", def: { en: "The part of a device that forwards user frames and packets; also called the forwarding plane.", hi: "Device ka woh hissa jo user frames aur packets forward karta hai; ise forwarding plane bhi kehte hain." } },
    { term: "Control plane", def: { en: "The functions that build the tables used for forwarding, such as OSPF, STP and ARP.", hi: "Woh functions jo forwarding ke liye tables banate hain, jaise OSPF, STP aur ARP." } },
    { term: "Management plane", def: { en: "The functions used to configure and monitor a device, such as SSH, SNMP, syslog and NTP.", hi: "Device ko configure aur monitor karne wale functions, jaise SSH, SNMP, syslog aur NTP." } },
    { term: "Template", def: { en: "A configuration written once with variables, rendered into the exact config for each device.", hi: "Variables ke saath ek baar likha gaya configuration, jo har device ke exact config mein render hota hai." } },
    { term: "Controller-based automation", def: { en: "Automation where a central platform manages the devices and you describe the outcome you want.", hi: "Aisa automation jisme central platform devices manage karta hai aur tum sirf batate ho kya outcome chahiye." } },
  ],
  commands: [
    { cmd: "ntp server 10.0.0.20", mode: "Cisco global config", does: { en: "Add an NTP server for the device to sync with", hi: "Device ke sync ke liye NTP server add karta hai" } },
    { cmd: "no ntp server 10.0.0.10", mode: "Cisco global config", does: { en: "Remove the old NTP server", hi: "Purana NTP server hata deta hai" } },
    { cmd: "write memory", mode: "Cisco privileged EXEC", does: { en: "Save the running config to startup config", hi: "Running config ko startup config mein save karta hai" } },
    { cmd: "show running-config | include ntp server", mode: "Cisco privileged EXEC", does: { en: "Show only the NTP server lines of the running config", hi: "Running config ki sirf NTP server lines dikhata hai" } },
    { cmd: "show ntp associations", mode: "Cisco privileged EXEC", does: { en: "Show configured NTP servers and which one the clock is synced to", hi: "Configured NTP servers dikhata hai aur clock kis se synced hai" } },
  ],
  mistakes: [
    {
      en: "Thinking IOS will catch a wrong address. It only checks syntax; `ntp server 10.0.0.200` is accepted. Validation of values is your job, or your tool's.",
      hi: "Yeh sochna ki IOS galat address pakad lega. Woh sirf syntax check karta hai; `ntp server 10.0.0.200` accept ho jaata hai. Values validate karna tumhara kaam hai, ya tumhare tool ka.",
    },
    {
      en: "Putting ARP or STP in the data plane because they deal with frames. They build tables, so they are control plane; the data plane uses those tables.",
      hi: "ARP ya STP ko data plane mein daalna kyunki woh frames se deal karte hain. Woh tables banate hain, isliye control plane hain; data plane un tables ko use karta hai.",
    },
    {
      en: "Putting SSH or SNMP in the control plane. They are how people and tools manage the box: management plane.",
      hi: "SSH ya SNMP ko control plane mein daalna. Inse log aur tools box manage karte hain: management plane.",
    },
    {
      en: "Believing automation replaces understanding. A script that pushes a wrong design pushes it everywhere at once; you still have to know what correct looks like.",
      hi: "Yeh maanna ki automation samajh ki jagah le leta hai. Galat design push karne wali script use ek saath har jagah push karti hai; sahi kya hai, yeh tumhe phir bhi pata hona chahiye.",
    },
    {
      en: "Calling a change done when the push succeeded. Done means the post-check shows the intended state on every device.",
      hi: "Push successful hote hi change ko done bolna. Done tab hai jab post-check har device par intended state dikhaye.",
    },
  ],
  recap: [
    { en: "Manual CLI changes cost time and cause typos, inconsistency and configuration drift.", hi: "Manual CLI changes time lete hain aur typos, inconsistency aur configuration drift laate hain." },
    { en: "Automation gives speed, consistency, scale, validation, an audit trail and fewer outages, but spreads mistakes fast if you skip checks.", hi: "Automation speed, consistency, scale, validation, audit trail aur kam outages deta hai, lekin checks skip karo toh galti bhi tezi se failata hai." },
    { en: "Data plane forwards traffic; control plane (OSPF, STP, ARP) builds the tables; management plane (SSH, SNMP, syslog, NTP) runs the box.", hi: "Data plane traffic forward karta hai; control plane (OSPF, STP, ARP) tables banata hai; management plane (SSH, SNMP, syslog, NTP) box chalata hai." },
    { en: "Script-based: you write the steps. Controller-based: you state the outcome and the controller configures the devices.", hi: "Script-based: steps tum likhte ho. Controller-based: tum outcome batate ho aur controller devices configure karta hai." },
    { en: "Safe change: template, validate, pre-check, push, post-check, log.", hi: "Safe change ka order yaad rakho: template, validate, pre-check, push, post-check, aur phir log." },
  ],
  quiz: [
    {
      q: { en: "Which plane does OSPF belong to?", hi: "OSPF kis plane ka hissa hai?" },
      options: [
        { en: "Data plane", hi: "Data plane" },
        { en: "Management plane", hi: "Management plane" },
        { en: "Control plane", hi: "Control plane" },
        { en: "Application plane", hi: "Application plane" },
      ],
      answer: 2,
      explain: {
        en: "OSPF exchanges routing information and builds the routing table that the data plane later uses to forward packets. Building forwarding tables is the control plane's job. There is no \"application plane\" in this model.",
        hi: "OSPF routing information exchange karke routing table banata hai, jise baad mein data plane packets forward karne ke liye use karta hai. Forwarding tables banana control plane ka kaam hai. Is model mein \"application plane\" jaisa kuch nahi hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Two years ago all 60 branch switches had the same configuration. Today an audit finds 14 different NTP setups, some old ACLs on a few switches and two switches with an unsaved fix. What is this called?",
        hi: "Do saal pehle saare 60 branch switches ka configuration same tha. Aaj audit mein 14 alag NTP setups, kuch switches par purane ACLs aur do switches par unsaved fix mila. Ise kya kehte hain?",
      },
      options: [
        { en: "Configuration drift", hi: "Configuration drift" },
        { en: "Intent-based networking", hi: "Intent-based networking" },
        { en: "Control plane failure", hi: "Control plane failure" },
        { en: "Template rendering", hi: "Template rendering" },
      ],
      answer: 0,
      explain: {
        en: "Devices that should match a standard slowly diverging through one-off manual changes is configuration drift. Automation fights it by comparing running configs with the standard on a schedule.",
        hi: "Jo devices ek standard se match hone chahiye, unka one-off manual changes se dheere-dheere alag ho jaana configuration drift hai. Automation running configs ko schedule par standard se compare karke isse ladta hai.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which of these is a management plane function?", hi: "Inme se kaunsa management plane function hai?" },
      options: [
        { en: "STP blocking a redundant port", hi: "STP ka redundant port block karna" },
        { en: "A router decrementing the TTL of a forwarded packet", hi: "Router ka forward hone wale packet ka TTL kam karna" },
        { en: "ARP resolving the gateway's MAC address", hi: "ARP ka gateway ka MAC address resolve karna" },
        { en: "An NMS polling interface counters with SNMP", hi: "NMS ka SNMP se interface counters poll karna" },
      ],
      answer: 3,
      explain: {
        en: "SNMP polling is how a tool monitors the device, so it is management plane. STP and ARP build state used for forwarding (control plane), and changing the TTL of a passing packet is forwarding work (data plane).",
        hi: "SNMP polling se tool device ko monitor karta hai, isliye yeh management plane hai. STP aur ARP forwarding ke liye state banate hain (control plane), aur guzarte packet ka TTL badalna forwarding ka kaam hai (data plane).",
      },
      kind: "concept",
    },
    {
      q: {
        en: "SW2 receives a frame on Gi0/3, finds the destination MAC in its MAC address table and sends it out of Gi0/7. Which plane did that?",
        hi: "SW2 ko Gi0/3 par ek frame milta hai, woh destination MAC apni MAC address table mein dhoondhta hai aur frame Gi0/7 se bahar bhejta hai. Yeh kis plane ne kiya?",
      },
      options: [
        { en: "Control plane", hi: "Control plane" },
        { en: "Data plane", hi: "Data plane" },
        { en: "Management plane", hi: "Management plane" },
        { en: "No plane: it happens in the cable", hi: "Koi plane nahi: yeh cable mein hota hai" },
      ],
      answer: 1,
      explain: {
        en: "Looking up a table and forwarding a user's frame out of the right port is data plane work, done for every frame that passes through. Protocols that build tables, such as STP, ARP and OSPF, are control plane; SSH and SNMP are management plane.",
        hi: "Table dekh kar user ka frame sahi port se forward karna data plane ka kaam hai, aur yeh guzarne wale har frame ke liye hota hai. Tables banane wale protocols, jaise STP, ARP aur OSPF, control plane hain; SSH aur SNMP management plane hain.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "After an NTP change, `show running-config | include ntp server` on SW3 shows `ntp server 10.0.0.200`, and `show ntp associations` shows no line marked with `*`. The standard is 10.0.0.20. What happened?",
        hi: "NTP change ke baad SW3 par `show running-config | include ntp server` mein `ntp server 10.0.0.200` dikhta hai, aur `show ntp associations` mein koi line `*` se marked nahi hai. Standard 10.0.0.20 hai. Kya hua?",
      },
      options: [
        { en: "IOS rejected the command, so the old server is still in use", hi: "IOS ne command reject kar diya, isliye purana server hi use ho raha hai" },
        { en: "The switch is synced, but to a different stratum", hi: "Switch synced hai, bas doosre stratum se" },
        { en: "A typo was accepted as valid syntax, and the switch cannot sync to a server that does not exist", hi: "Typo valid syntax maan kar accept ho gaya, aur switch aise server se sync nahi kar sakta jo exist hi nahi karta" },
        { en: "NTP needs `write memory` before it starts syncing", hi: "Sync shuru karne se pehle NTP ko `write memory` chahiye" },
      ],
      answer: 2,
      explain: {
        en: "10.0.0.200 is a valid IPv4 address, so IOS accepted it. No `*` means no server is selected as sys.peer, so the clock is not synced. Saving the config has nothing to do with syncing. A validated template would have stopped this value before the push.",
        hi: "10.0.0.200 ek valid IPv4 address hai, isliye IOS ne accept kar liya. `*` nahi hai matlab koi server sys.peer select nahi hua, yaani clock synced nahi hai. Config save karne ka sync se koi lena-dena nahi. Validated template is value ko push se pehle hi rok deta.",
      },
      kind: "cli",
    },
    {
      q: { en: "Which statement describes controller-based automation rather than script-based automation?", hi: "Kaunsa statement script-based nahi, balki controller-based automation ko describe karta hai?" },
      options: [
        { en: "You describe the outcome you want and a central platform works out and applies each device's configuration", hi: "Tum batate ho kya outcome chahiye aur central platform har device ka configuration nikal kar apply karta hai" },
        { en: "You write a Python script that SSHes to each switch and sends a list of commands", hi: "Tum ek Python script likhte ho jo har switch par SSH karke commands ki list bhejti hai" },
        { en: "An engineer pastes the same commands into each device's console", hi: "Engineer har device ke console mein same commands paste karta hai" },
        { en: "Each device runs its own control plane and no central system is involved", hi: "Har device apna control plane chalata hai aur koi central system involved nahi hai" },
      ],
      answer: 0,
      explain: {
        en: "With a controller you state the result and the controller translates it into device config and pushes it. A script that logs in and sends commands is script-based; pasting by hand is not automation; the last option describes a traditional network.",
        hi: "Controller ke saath tum result batate ho aur controller use device config mein badal kar push karta hai. Login karke commands bhejne wali script script-based hai; haath se paste karna automation hai hi nahi; aakhri option traditional network ka description hai.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "4tsBgMCPVuc",
      title: "Intro to Network Automation | CCNA 200-301 Day 59 (part 1)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Why automate, and the data, control and management planes with exam-style examples.", hi: "Automate kyun karein, aur data, control aur management planes, exam-style examples ke saath." },
    },
    {
      id: "zHaDscXDATw",
      title: "139. Free CCNA (NEW) | Introduction to Network Automation | CCNA 200-301 Complete Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi introduction to network automation and its benefits.", hi: "Network automation aur uske fayde ka Hindi introduction." },
    },
    {
      id: "Sdpn80qeNxE",
      title: "143. Free CCNA (NEW) | How Automation Impacts Network Management | CCNA 200-301 Full Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "How automation changes day-to-day network management, in Hindi.", hi: "Automation roz ke network management ko kaise badalta hai, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Feel the cost of manual work, then find the planes", hi: "Manual kaam ki keemat mehsoos karo, phir planes dhoondho" },
    steps: [
      { en: "In Packet Tracer build four switches (SW1-SW4, management IPs 10.10.0.11-14/24 on VLAN 1, with `ip default-gateway` pointing at the router) and a server at 10.0.0.20 with the NTP service on, behind that router. If your switch model lacks the `ntp` commands, use four routers instead.", hi: "Packet Tracer mein chaar switches (SW1-SW4, VLAN 1 par management IPs 10.10.0.11-14/24, aur `ip default-gateway` router ki taraf) banao, aur us router ke peeche 10.0.0.20 par server rakho jisme NTP service on ho. Agar tumhare switch model mein `ntp` commands nahi hain, toh chaar routers use karo." },
      { en: "Time yourself configuring `ntp server 10.0.0.20` and saving on all four by hand. Multiply by 100 to estimate a 400-switch network.", hi: "Chaaron par haath se `ntp server 10.0.0.20` configure aur save karte hue time note karo. 400-switch network ka estimate lagane ke liye 100 se multiply karo." },
      { en: "On SW3 deliberately type `ntp server 10.0.0.200`. Note that IOS accepts it, then run `show ntp associations` on SW1 and SW3 and compare.", hi: "SW3 par jaan boojh kar `ntp server 10.0.0.200` type karo. Dekho ki IOS accept kar leta hai, phir SW1 aur SW3 par `show ntp associations` chala kar compare karo." },
      { en: "Run `show running-config | include ntp server` on every switch. This is a one-line manual drift check; write down which switch is wrong.", hi: "Har switch par `show running-config | include ntp server` chalao. Yeh ek line ka manual drift check hai; note karo kaunsa switch galat hai." },
      { en: "In Simulation mode, list one packet you see from each plane: an STP BPDU (control), a ping between PCs passing through a switch (data), and an SSH or NTP packet to a switch (management).", hi: "Simulation mode mein har plane ka ek packet list karo: STP BPDU (control), switch ke through jaata PCs ke beech ka ping (data), aur switch tak jaata SSH ya NTP packet (management)." },
    ],
  },
};

export default lesson;
