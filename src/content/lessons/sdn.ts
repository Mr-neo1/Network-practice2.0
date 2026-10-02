import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "sdn",
  intro: {
    en: "In a traditional network every router and switch is its own island: it runs its own control plane, holds its own configuration and is changed one box at a time. Controller-based networking, often called software-defined networking (SDN), puts a central controller in charge of policy and much of the control plane, and gives you one API to program the whole network. Cisco's campus (Catalyst Center), WAN (Catalyst SD-WAN) and data centre (ACI) products all work this way, and the CCNA expects you to describe the architecture: northbound and southbound interfaces, underlay, overlay and fabric.",
    hi: "Traditional network mein har router aur switch ek alag island hai: apna control plane chalata hai, apna configuration rakhta hai, aur ek-ek box karke change hota hai. Controller-based networking, jise aksar software-defined networking (SDN) kehte hain, ek central controller ko policy aur control plane ke bade hisse ka in-charge bana deta hai, aur poore network ko program karne ke liye ek hi API deta hai. Cisco ke campus (Catalyst Center), WAN (Catalyst SD-WAN) aur data centre (ACI) products sab aise hi kaam karte hain, aur CCNA expect karta hai ki tum architecture describe kar sako: northbound aur southbound interfaces, underlay, overlay aur fabric.",
  },
  outcomes: [
    { en: "Compare a traditional network (distributed control plane, box-by-box management) with a controller-based network", hi: "Traditional network (distributed control plane, box-by-box management) ko controller-based network se compare kar sako" },
    { en: "Draw the SDN architecture: application layer, northbound interface, controller, southbound interface, infrastructure", hi: "SDN architecture ka diagram bana sako aur har layer samjha sako: application layer, northbound interface, controller, southbound interface aur infrastructure" },
    { en: "Name southbound protocols (OpenFlow, OpFlex, NETCONF, RESTCONF, SSH, SNMP) and the usual northbound interface (REST API)", hi: "Southbound protocols (OpenFlow, OpFlex, NETCONF, RESTCONF, SSH, SNMP) aur usual northbound interface (REST API) ke naam bata sako" },
    { en: "Explain underlay, overlay and fabric, and what a VXLAN tunnel adds to a packet", hi: "Underlay, overlay aur fabric samjha sako, aur VXLAN tunnel packet mein kya jodta hai" },
    { en: "Match Cisco controllers to their domains: Catalyst Center, Catalyst SD-WAN Manager and APIC", hi: "Cisco controllers ko unke domain se match kar sako: Catalyst Center, Catalyst SD-WAN Manager aur APIC" },
    { en: "Describe intent-based networking and the benefits and trade-offs of a controller", hi: "Intent-based networking aur controller ke benefits aur trade-offs describe kar sako" },
  ],
  sections: [
    {
      id: "traditional",
      heading: { en: "Traditional networks: every box decides for itself", hi: "Traditional networks: har box khud decide karta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Think back to OSPF (lesson 3.6). R1, R2 and R3 each send Hellos, each build their own LSDB and each run SPF to fill their own routing table. Switches each run their own STP. Nobody is in charge; the network's behaviour emerges from many devices agreeing. That is a **distributed control plane**.",
            hi: "OSPF (lesson 3.6) yaad karo. R1, R2 aur R3 har ek Hellos bhejta hai, har ek apna LSDB banata hai aur apna routing table bharne ke liye SPF chalata hai. Har switch apna STP chalata hai. Koi in-charge nahi hai; network ka behaviour bahut saare devices ke aapas mein agree karne se banta hai. Ise **distributed control plane** kehte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "Management is distributed too. To apply a new security policy to 300 switches, someone logs in to 300 switches, or writes a script that does (lesson 6.1). There is no single place that knows the whole network's intended state.",
            hi: "Management bhi distributed hai. 300 switches par nayi security policy lagani hai, toh koi 300 switches par login karega, ya ek script likhega jo yeh kare (lesson 6.1). Koi ek jagah nahi hai jise poore network ki intended state pata ho.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Strength**: very resilient. There is no central system whose failure stops the network, and the protocols are mature and multi-vendor.",
              hi: "**Strength**: bahut resilient. Koi central system nahi jiske fail hone se network ruk jaaye, aur protocols mature aur multi-vendor hain.",
            },
            {
              en: "**Weakness**: policy is spread across hundreds of configs, changes are slow, and it is hard to prove that every device matches the design.",
              hi: "**Weakness**: policy saikdon configs mein bikhri hoti hai, changes slow hote hain, aur yeh prove karna mushkil hai ki har device design se match karta hai.",
            },
          ],
        },
      ],
    },
    {
      id: "controller-based",
      heading: { en: "Controller-based networking", hi: "Controller-based networking" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In **controller-based networking** a central **controller** holds the policy and the full view of the network, and programs the devices. The devices keep the **data plane**: they still forward every frame and packet themselves, at full speed. What moves to the centre is decision-making and management.",
            hi: "**Controller-based networking** mein ek central **controller** policy aur poore network ka view rakhta hai, aur devices ko program karta hai. **Data plane** devices ke paas hi rehta hai: har frame aur packet woh khud full speed par forward karte hain. Centre mein decision-making aur management jaata hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "How much control moves varies. In the original **OpenFlow** idea the controller computes every forwarding entry and switches only follow instructions. Cisco's products centralise policy and management but leave some control plane work on the devices; in SD-Access, for example, the underlay switches still run IS-IS between themselves. The CCNA phrase to remember is **separation of the control plane and the data plane**.",
            hi: "Kitna control centre mein jaata hai, yeh product par depend karta hai. Original **OpenFlow** idea mein controller har forwarding entry khud calculate karta hai aur switches sirf instructions follow karte hain. Cisco ke products policy aur management centralise karte hain, lekin kuch control plane kaam devices par hi chhod dete hain; jaise SD-Access mein underlay switches aapas mein abhi bhi IS-IS chalate hain. CCNA ke liye phrase yaad rakho: **control plane aur data plane ka separation**.",
          },
        },
        {
          type: "table",
          caption: { en: "Traditional vs controller-based", hi: "Traditional vs controller-based" },
          columns: ["", { en: "Traditional", hi: "Traditional" }, { en: "Controller-based", hi: "Controller-based" }],
          rows: [
            [
              { en: "Control plane", hi: "Control plane" },
              { en: "Distributed: every device runs its own", hi: "Distributed: har device apna chalata hai" },
              { en: "Centralised in the controller, fully or partly", hi: "Controller mein centralised, poora ya kuch hissa" },
            ],
            [
              { en: "Configuration", hi: "Configuration" },
              { en: "Per device, usually CLI", hi: "Har device par alag, aam taur par CLI" },
              { en: "Policy defined once; controller pushes device config", hi: "Policy ek baar define; device config controller push karta hai" },
            ],
            [
              { en: "View of the network", hi: "Network ka view" },
              { en: "Pieced together from many `show` commands", hi: "Bahut saari `show` commands jod kar banta hai" },
              { en: "One inventory, topology and health view", hi: "Ek hi inventory, topology aur health view" },
            ],
            [
              { en: "Programmability", hi: "Programmability" },
              { en: "Screen-scraping CLI output, device by device", hi: "CLI output screen-scrape karna, device by device" },
              { en: "One northbound REST API for the whole network", hi: "Poore network ke liye ek northbound REST API" },
            ],
            [
              { en: "Main risk", hi: "Main risk" },
              { en: "Inconsistency and slow change", hi: "Inconsistency aur slow change" },
              { en: "The controller becomes a critical system", hi: "Controller ek critical system ban jaata hai" },
            ],
          ],
        },
      ],
    },
    {
      id: "sdn-architecture",
      heading: { en: "The SDN architecture, layer by layer", hi: "SDN architecture, layer by layer" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Picture the controller in the middle of a diagram, with applications above it and network devices below. The interfaces are named after that picture: up is **north**, down is **south**.",
            hi: "Ek diagram socho jiske beech mein controller hai, upar applications aur neeche network devices. Interfaces ke naam isi picture se aaye hain: upar **north**, neeche **south**.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Layer", hi: "Layer" }, { en: "What lives there", hi: "Wahan kya hota hai" }, { en: "Example", hi: "Example" }],
          rows: [
            [
              { en: "Application layer", hi: "Application layer" },
              { en: "Programs that tell the controller what the network should do, or read its state", hi: "Programs jo controller ko batate hain network ko kya karna hai, ya uski state padhte hain" },
              { en: "A monitoring dashboard, a ticketing system, your Python script", hi: "Monitoring dashboard, ticketing system, tumhari Python script" },
            ],
            [
              { en: "Northbound interface (NBI)", hi: "Northbound interface (NBI)" },
              { en: "The API the controller offers to applications", hi: "Woh API jo controller applications ko deta hai" },
              { en: "REST API over HTTPS, data in JSON", hi: "HTTPS par REST API, data JSON mein" },
            ],
            [
              { en: "Control layer", hi: "Control layer" },
              { en: "The controller: central view, policy, and the logic that turns policy into device config", hi: "Controller: central view, policy, aur woh logic jo policy ko device config mein badalta hai" },
              { en: "Catalyst Center, APIC, Catalyst SD-WAN Manager", hi: "Catalyst Center, APIC, Catalyst SD-WAN Manager" },
            ],
            [
              { en: "Southbound interface (SBI)", hi: "Southbound interface (SBI)" },
              { en: "How the controller talks to the devices", hi: "Controller devices se kaise baat karta hai" },
              { en: "OpenFlow, OpFlex, NETCONF, RESTCONF, SSH, SNMP", hi: "OpenFlow, OpFlex, NETCONF, RESTCONF, SSH, SNMP" },
            ],
            [
              { en: "Infrastructure layer", hi: "Infrastructure layer" },
              { en: "The routers, switches and APs that forward traffic: the data plane", hi: "Routers, switches aur APs jo traffic forward karte hain: data plane" },
              { en: "Catalyst 9300 access switches, ISR routers", hi: "Catalyst 9300 access switches, ISR routers" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "A northbound call is an ordinary HTTPS request. This is how a script, after first getting an authentication token from the controller, asks Catalyst Center (here at `10.10.0.5`) for its device inventory. You will learn to read these properly in lessons 6.4 and 6.5.",
            hi: "Northbound call ek normal HTTPS request hai. Controller se pehle authentication token lene ke baad, ek script Catalyst Center (yahan `10.10.0.5` par) se device inventory aise maangti hai. Inhe theek se padhna lessons 6.4 aur 6.5 mein seekhoge.",
          },
        },
        {
          type: "code",
          lang: "json",
          title: { en: "GET https://10.10.0.5/dna/intent/api/v1/network-device (response, shortened)", hi: "GET https://10.10.0.5/dna/intent/api/v1/network-device (response, chhota kiya hua)" },
          code: "{\n  \"response\": [\n    {\n      \"hostname\": \"SW1\",\n      \"managementIpAddress\": \"10.10.0.11\",\n      \"platformId\": \"C9300-48P\",\n      \"softwareVersion\": \"17.9.4\",\n      \"reachabilityStatus\": \"Reachable\"\n    }\n  ],\n  \"version\": \"1.0\"\n}",
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "NBI = between applications and the controller, typically a **REST API**. SBI = between the controller and the devices. If an answer puts OpenFlow or NETCONF on the northbound side, or REST between an app and the controller on the southbound side, it is wrong.",
            hi: "NBI = applications aur controller ke beech, aam taur par **REST API**. SBI = controller aur devices ke beech. Agar koi answer OpenFlow ya NETCONF ko northbound side par rakhe, ya app aur controller ke beech REST ko southbound bole, toh woh galat hai.",
          },
        },
      ],
    },
    {
      id: "southbound",
      heading: { en: "Southbound protocols", hi: "Southbound protocols" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "SBI", hi: "SBI" }, { en: "How it works", hi: "Kaise kaam karta hai" }, { en: "Where you meet it", hi: "Kahan milta hai" }],
          rows: [
            [
              "OpenFlow",
              { en: "Open standard from the ONF. The controller writes flow-table entries (match fields, then actions) directly into switches", hi: "ONF ka open standard. Controller switches mein seedha flow-table entries (match fields, phir actions) likhta hai" },
              { en: "Classic SDN with open-source controllers such as OpenDaylight", hi: "Classic SDN, OpenDaylight jaise open-source controllers ke saath" },
            ],
            [
              "OpFlex",
              { en: "Cisco-led. The controller sends policy; each device decides how to implement it", hi: "Cisco-led. Controller policy bhejta hai; har device khud decide karta hai use kaise implement kare" },
              { en: "Cisco ACI: APIC to the leaf switches", hi: "Cisco ACI: APIC se leaf switches tak" },
            ],
            [
              "NETCONF",
              { en: "Reads and writes config as XML structured by YANG models, over SSH on TCP port 830", hi: "YANG models se structured XML ke roop mein config padhta aur likhta hai, SSH par TCP port 830 se" },
              { en: "Controllers, Ansible, Python scripts", hi: "Controllers, Ansible, Python scripts" },
            ],
            [
              "RESTCONF",
              { en: "The same YANG data through a REST-style API over HTTPS, encoded in JSON or XML", hi: "Wahi YANG data REST-style API se, HTTPS par, JSON ya XML mein" },
              { en: "Controllers and scripts", hi: "Controllers aur scripts" },
            ],
            [
              "SSH / SNMP",
              { en: "The controller logs in and sends CLI commands, and polls with SNMP", hi: "Controller login karke CLI commands bhejta hai, aur SNMP se poll karta hai" },
              { en: "Catalyst Center managing ordinary IOS XE devices", hi: "Catalyst Center jab normal IOS XE devices manage karta hai" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "SSH counts as southbound", hi: "SSH bhi southbound hai" },
          text: {
            en: "A controller does not need exotic protocols. Catalyst Center discovers devices and pushes much of its config over plain SSH and SNMP, with NETCONF for some features. That is why existing switches can be brought under a controller without being replaced.",
            hi: "Controller ko koi anokhe protocols nahi chahiye. Catalyst Center devices discover karta hai aur apna bahut saara config simple SSH aur SNMP se push karta hai, kuch features ke liye NETCONF se. Isi wajah se existing switches ko replace kiye bina controller ke under laaya ja sakta hai.",
          },
        },
      ],
    },
    {
      id: "overlay-underlay-fabric",
      heading: { en: "Underlay, overlay and fabric", hi: "Underlay, overlay aur fabric" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Controller-based campus and data-centre designs split the network into two layers that you must keep apart in your head.",
            hi: "Controller-based campus aur data-centre designs network ko do layers mein baant dete hain. Inhe dimaag mein alag-alag rakhna zaroori hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Underlay**: the physical network of switches, routers and cables. Its only job is IP reachability between the fabric devices, usually their loopbacks. In SD-Access it is a routed design, typically running IS-IS.",
              hi: "**Underlay**: switches, routers aur cables ka physical network. Iska ek hi kaam hai fabric devices ke beech IP reachability, aam taur par unke loopbacks tak. SD-Access mein yeh routed design hota hai, aam taur par IS-IS ke saath.",
            },
            {
              en: "**Overlay**: virtual networks built on top of the underlay with **tunnels**. Users and their VLANs, subnets and policies live here. SD-Access and ACI use **VXLAN** tunnels.",
              hi: "**Overlay**: underlay ke upar **tunnels** se bane virtual networks. Users aur unke VLANs, subnets aur policies yahan rehte hain. SD-Access aur ACI **VXLAN** tunnels use karte hain.",
            },
            {
              en: "**Fabric**: the underlay and overlay together, managed as one system by the controller.",
              hi: "**Fabric**: underlay aur overlay dono milkar, jise controller ek system ki tarah manage karta hai.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "Follow one packet. PC-A (`10.50.1.10`) on fabric edge switch Edge-1 sends to PC-B (`10.50.1.20`) on Edge-2. Edge-1 wraps PC-A's whole frame in a VXLAN header, a UDP header (destination port 4789) and a new **outer IP header** from its loopback `10.255.0.1` to Edge-2's loopback `10.255.0.2`. The underlay routes that outer packet like any other and never looks inside. Edge-2 removes the outer headers and delivers the original frame to PC-B.",
            hi: "Ek packet follow karo. Fabric edge switch Edge-1 par PC-A (`10.50.1.10`) Edge-2 par PC-B (`10.50.1.20`) ko bhejta hai. Edge-1 PC-A ke poore frame ko VXLAN header, UDP header (destination port 4789) aur ek naye **outer IP header** mein wrap karta hai, jo uske loopback `10.255.0.1` se Edge-2 ke loopback `10.255.0.2` tak jaata hai. Underlay us outer packet ko baaki packets ki tarah route karta hai aur andar kabhi nahi dekhta. Edge-2 outer headers hata kar original frame PC-B ko de deta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The VXLAN packet as the underlay sees it", hi: "VXLAN packet, jaisa underlay ko dikhta hai" },
          columns: [{ en: "Part", hi: "Part" }, { en: "Contents", hi: "Contents" }, { en: "Read by", hi: "Kaun padhta hai" }],
          rows: [
            [{ en: "Outer Ethernet", hi: "Outer Ethernet" }, { en: "MACs of the current underlay hop", hi: "Current underlay hop ke MACs" }, { en: "Each underlay link", hi: "Har underlay link" }],
            [{ en: "Outer IP", hi: "Outer IP" }, "10.255.0.1 → 10.255.0.2", { en: "Underlay routers", hi: "Underlay routers" }],
            [{ en: "UDP", hi: "UDP" }, { en: "Destination port 4789", hi: "Destination port 4789" }, { en: "Edge-2", hi: "Edge-2" }],
            [{ en: "VXLAN header", hi: "VXLAN header" }, { en: "VNI: which virtual network", hi: "VNI: kaunsa virtual network" }, { en: "Edge-2", hi: "Edge-2" }],
            [{ en: "Inner frame", hi: "Inner frame" }, "PC-A 10.50.1.10 → PC-B 10.50.1.20", { en: "Only PC-B", hi: "Sirf PC-B" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Tunnels add bytes", hi: "Tunnels bytes jodte hain" },
          text: {
            en: "VXLAN adds about 50 bytes to every packet. If the underlay MTU stays at 1500, full-size user packets no longer fit. Fabric designs raise the underlay MTU (SD-Access uses jumbo frames) for exactly this reason.",
            hi: "VXLAN har packet mein lagbhag 50 bytes jodta hai. Agar underlay MTU 1500 hi rahe, toh full-size user packets fit nahi honge. Isi wajah se fabric designs underlay MTU badhate hain (SD-Access jumbo frames use karta hai).",
          },
        },
        {
          type: "p",
          text: {
            en: "Why bother? Because the overlay is now just configuration. The controller can create a new virtual network for IoT devices, or move a user's policy to whichever edge switch they plug into, without touching the underlay at all.",
            hi: "Itna sab kyun? Kyunki ab overlay sirf configuration hai. Controller IoT devices ke liye naya virtual network bana sakta hai, ya user jis bhi edge switch mein plug kare uski policy wahan le ja sakta hai, underlay ko chhuye bina.",
          },
        },
      ],
    },
    {
      id: "cisco-controllers",
      heading: { en: "Cisco's controllers", hi: "Cisco ke controllers" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Controller", hi: "Controller" }, { en: "Domain", hi: "Domain" }, { en: "What it does", hi: "Kya karta hai" }],
          rows: [
            [
              { en: "Catalyst Center (formerly DNA Center)", hi: "Catalyst Center (pehle DNA Center)" },
              { en: "Enterprise campus and branch", hi: "Enterprise campus aur branch" },
              { en: "Inventory, templates, software upgrades, health and assurance; builds the **SD-Access** fabric", hi: "Inventory, templates, software upgrades, health aur assurance; **SD-Access** fabric banata hai" },
            ],
            [
              { en: "Catalyst SD-WAN Manager (formerly vManage)", hi: "Catalyst SD-WAN Manager (pehle vManage)" },
              { en: "WAN between sites", hi: "Sites ke beech WAN" },
              { en: "Central management of SD-WAN routers that build encrypted tunnels over any transport", hi: "SD-WAN routers ka central management, jo kisi bhi transport par encrypted tunnels banate hain" },
            ],
            [
              { en: "APIC (Application Policy Infrastructure Controller)", hi: "APIC (Application Policy Infrastructure Controller)" },
              { en: "Data centre", hi: "Data centre" },
              { en: "Controls a Cisco **ACI** spine-leaf fabric and pushes application policy to the leaves with OpFlex", hi: "Cisco **ACI** spine-leaf fabric ko control karta hai aur OpFlex se leaves tak application policy push karta hai" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "In SD-Access, Catalyst Center is the management layer you click on or call with APIs. Inside the fabric, **edge nodes** connect users, **border nodes** connect the fabric to everything outside it, and a **control plane node** keeps track of which endpoint sits behind which edge, using a protocol called **LISP**. So SD-Access uses LISP for its overlay control plane and VXLAN for its overlay data plane. The node roles go beyond the CCNA; know that they exist.",
            hi: "SD-Access mein Catalyst Center woh management layer hai jis par tum click karte ho ya APIs se call karte ho. Fabric ke andar **edge nodes** users ko connect karte hain, **border nodes** fabric ko bahar ki duniya se jodte hain, aur ek **control plane node** **LISP** naam ke protocol se track rakhta hai ki kaunsa endpoint kis edge ke peeche hai. Yaani SD-Access overlay ke control plane ke liye LISP aur data plane ke liye VXLAN use karta hai. Node roles CCNA se aage ke hain; bas itna jaano ki yeh hote hain.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Old names still appear", hi: "Purane naam abhi bhi dikhte hain" },
          text: {
            en: "Cisco renamed DNA Center to Catalyst Center and vManage to Catalyst SD-WAN Manager. Exam questions, books and job adverts use both names, so recognise both.",
            hi: "Cisco ne DNA Center ka naam Catalyst Center aur vManage ka naam Catalyst SD-WAN Manager kar diya. Exam questions, books aur job ads dono naam use karte hain, isliye dono pehchaano.",
          },
        },
      ],
    },
    {
      id: "intent-and-tradeoffs",
      heading: { en: "Intent-based networking, benefits and trade-offs", hi: "Intent-based networking, benefits aur trade-offs" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Intent-based networking (IBN)** is the idea of telling the network what you want, not how to do it. You state an intent such as \"guest users may reach only the internet\". The controller **translates** it into device configuration, **activates** it by pushing that config everywhere it applies, and **assures** it by continuously checking that the network still behaves that way.",
            hi: "**Intent-based networking (IBN)** ka idea hai network ko batana ki kya chahiye, kaise karna hai yeh nahi. Tum ek intent batate ho, jaise \"guest users sirf internet tak ja sakte hain\". Controller use device configuration mein **translate** karta hai, jahan-jahan lagta hai wahan push karke **activate** karta hai, aur lagatar check karke **assure** karta hai ki network abhi bhi waise hi behave kar raha hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Benefits**: one place to define policy, consistent config, fast provisioning of new sites and users, a single API for automation, and health and assurance data for the whole network.",
              hi: "**Benefits**: policy define karne ki ek jagah, consistent config, nayi sites aur users ki fast provisioning, automation ke liye ek API, aur poore network ka health aur assurance data.",
            },
            {
              en: "**Trade-offs**: licensing cost, devices must be supported models and versions, engineers need new skills, and there is more vendor lock-in.",
              hi: "**Trade-offs**: licensing cost, devices supported models aur versions ke hone chahiye, engineers ko nayi skills chahiye, aur vendor lock-in zyada hota hai.",
            },
            {
              en: "**The controller is critical**: it is deployed as a cluster for redundancy. In Cisco's fabrics, if it fails the devices keep forwarding with the state they already have, but you cannot make changes until it returns.",
              hi: "**Controller critical hai**: redundancy ke liye ise cluster mein deploy kiya jaata hai. Cisco ke fabrics mein agar yeh fail ho jaaye, toh devices apni existing state se forwarding karte rehte hain, lekin jab tak yeh wapas na aaye tum changes nahi kar sakte.",
            },
            {
              en: "**Troubleshooting has two layers**: a user problem in the overlay may be caused by the underlay, so you still need the routing and switching skills from modules 2 and 3.",
              hi: "**Troubleshooting ki do layers hain**: overlay mein user ki problem underlay ki wajah se ho sakti hai, isliye modules 2 aur 3 ki routing aur switching skills ab bhi zaroori hain.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Blueprint 6.2 and 6.3: compare traditional and controller-based networking; describe overlay, underlay and fabric; know separation of control and data planes and northbound vs southbound APIs. Expect matching questions: OpFlex with ACI, REST with northbound, VXLAN with overlay.",
            hi: "Blueprint 6.2 aur 6.3: traditional aur controller-based networking compare karo; overlay, underlay aur fabric describe karo; control aur data planes ka separation aur northbound vs southbound APIs jaano. Matching questions expect karo: OpFlex ke saath ACI, REST ke saath northbound, VXLAN ke saath overlay.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "SDN", def: { en: "Software-defined networking: an architecture where a central controller programs the network and the control plane is separated from the data plane.", hi: "Software-defined networking: aisa architecture jisme central controller network ko program karta hai aur control plane data plane se alag hota hai." } },
    { term: "Controller", def: { en: "The central system that holds network-wide policy and state and configures the devices.", hi: "Woh central system jo poore network ki policy aur state rakhta hai aur devices configure karta hai." } },
    { term: "Northbound interface (NBI)", def: { en: "The API between applications and the controller, usually a REST API.", hi: "Applications aur controller ke beech ki API, aam taur par REST API." } },
    { term: "Southbound interface (SBI)", def: { en: "How the controller communicates with devices, such as OpenFlow, OpFlex, NETCONF, RESTCONF, SSH or SNMP.", hi: "Controller devices se kaise baat karta hai, jaise OpenFlow, OpFlex, NETCONF, RESTCONF, SSH ya SNMP." } },
    { term: "Underlay", def: { en: "The physical network that provides IP reachability between fabric devices.", hi: "Physical network jo fabric devices ke beech IP reachability deta hai." } },
    { term: "Overlay", def: { en: "Virtual networks built on top of the underlay using tunnels such as VXLAN.", hi: "Underlay ke upar VXLAN jaise tunnels se bane virtual networks." } },
    { term: "Fabric", def: { en: "The underlay and overlay together, managed as one system by a controller.", hi: "Underlay aur overlay dono milkar, jise controller ek system ki tarah manage karta hai." } },
    { term: "Intent-based networking", def: { en: "Stating the desired outcome and letting the controller translate, activate and assure it.", hi: "Desired outcome batana aur controller ko use translate, activate aur assure karne dena." } },
  ],
  mistakes: [
    {
      en: "Swapping north and south. Applications and REST APIs are northbound; protocols that reach the devices are southbound.",
      hi: "North aur south ulta kar dena. Applications aur REST APIs northbound hain; devices tak pahunchne wale protocols southbound hain.",
    },
    {
      en: "Thinking the controller forwards user traffic. The devices still forward every packet; the controller programs them.",
      hi: "Yeh sochna ki controller user traffic forward karta hai. Har packet devices hi forward karte hain; controller unhe program karta hai.",
    },
    {
      en: "Mixing up underlay and overlay. The underlay is the physical IP network; the overlay is the virtual network carried inside tunnels across it.",
      hi: "Underlay aur overlay mix karna. Underlay physical IP network hai; overlay woh virtual network hai jo uske upar tunnels ke andar chalta hai.",
    },
    {
      en: "Assuming SDN means OpenFlow. OpenFlow is one southbound option; Cisco's controllers mostly use OpFlex, NETCONF, RESTCONF, SSH and SNMP.",
      hi: "Yeh maan lena ki SDN matlab OpenFlow. OpenFlow sirf ek southbound option hai; Cisco ke controllers zyada tar OpFlex, NETCONF, RESTCONF, SSH aur SNMP use karte hain.",
    },
    {
      en: "Forgetting MTU in a fabric. VXLAN adds about 50 bytes, so an underlay left at 1500 bytes breaks full-size packets.",
      hi: "Fabric mein MTU bhool jaana. VXLAN lagbhag 50 bytes jodta hai, isliye 1500 bytes par chhoda gaya underlay full-size packets tod deta hai.",
    },
  ],
  recap: [
    { en: "Traditional: distributed control plane and box-by-box management. Controller-based: central policy and view, devices keep the data plane.", hi: "Traditional: distributed control plane aur box-by-box management. Controller-based: central policy aur view, data plane devices ke paas." },
    { en: "Stack: applications, NBI (REST API), controller, SBI (OpenFlow, OpFlex, NETCONF, RESTCONF, SSH, SNMP), infrastructure.", hi: "Stack upar se neeche: applications, NBI (REST API), controller, SBI (OpenFlow, OpFlex, NETCONF, RESTCONF, SSH, SNMP), aur sabse neeche infrastructure." },
    { en: "Underlay = physical IP network; overlay = virtual networks in tunnels (VXLAN, UDP 4789); fabric = both, managed together.", hi: "Underlay = physical IP network; overlay = tunnels mein virtual networks (VXLAN, UDP 4789); fabric = dono, ek saath managed." },
    { en: "Catalyst Center (DNA Center) for campus and SD-Access, Catalyst SD-WAN Manager (vManage) for WAN, APIC for ACI in the data centre.", hi: "Campus aur SD-Access ke liye Catalyst Center (DNA Center), WAN ke liye Catalyst SD-WAN Manager (vManage), data centre mein ACI ke liye APIC." },
    { en: "Intent-based networking: translate, activate, assure. The controller is critical, so it runs as a cluster.", hi: "Intent-based networking: translate, activate, assure. Controller critical hai, isliye cluster mein chalta hai." },
  ],
  quiz: [
    {
      q: { en: "A Python script asks the controller for a list of all switches. Which interface does it use?", hi: "Ek Python script controller se saare switches ki list maangti hai. Woh kaunsa interface use karti hai?" },
      options: [
        { en: "The southbound interface", hi: "Southbound interface" },
        { en: "The northbound interface", hi: "Northbound interface" },
        { en: "The data plane", hi: "Data plane" },
        { en: "The underlay", hi: "Underlay" },
      ],
      answer: 1,
      explain: {
        en: "Applications, including your own scripts, sit above the controller and use its northbound interface, usually a REST API returning JSON. The southbound interface is what the controller uses to reach the devices.",
        hi: "Applications, tumhari apni scripts bhi, controller ke upar hoti hain aur uska northbound interface use karti hain, aam taur par JSON return karne wali REST API. Southbound interface woh hai jisse controller devices tak pahunchta hai.",
      },
      kind: "concept",
    },
    {
      q: { en: "Which of these is a southbound interface?", hi: "Inme se kaunsa southbound interface hai?" },
      options: [
        { en: "A REST API call from a ticketing system to Catalyst Center", hi: "Ticketing system se Catalyst Center ko REST API call" },
        { en: "An engineer's browser opening the Catalyst Center GUI", hi: "Engineer ke browser mein Catalyst Center GUI khulna" },
        { en: "OpFlex messages from APIC to the leaf switches", hi: "APIC se leaf switches tak OpFlex messages" },
        { en: "A JSON inventory returned to a monitoring app", hi: "Monitoring app ko return hui JSON inventory" },
      ],
      answer: 2,
      explain: {
        en: "OpFlex carries policy from the ACI controller down to the devices, so it is southbound. The other three are all exchanges between the controller and something above it: northbound or user-facing.",
        hi: "OpFlex ACI controller se neeche devices tak policy le jaata hai, isliye southbound hai. Baaki teeno controller aur uske upar wali cheez ke beech ke exchanges hain: northbound ya user-facing.",
      },
      kind: "concept",
    },
    {
      q: { en: "In an SD-Access fabric, what is the underlay?", hi: "SD-Access fabric mein underlay kya hai?" },
      options: [
        { en: "The VXLAN tunnels that carry user traffic", hi: "VXLAN tunnels jo user traffic le jaate hain" },
        { en: "The virtual networks that separate employees from guests", hi: "Virtual networks jo employees ko guests se alag karte hain" },
        { en: "The REST API that applications use", hi: "Woh REST API jo applications use karti hain" },
        { en: "The physical switches and links that give IP reachability between the fabric nodes' loopbacks", hi: "Physical switches aur links jo fabric nodes ke loopbacks ke beech IP reachability dete hain" },
      ],
      answer: 3,
      explain: {
        en: "The underlay is the physical routed network whose job is to connect the fabric devices' loopbacks. Tunnels and virtual networks are the overlay built on top of it; the REST API is the northbound interface.",
        hi: "Underlay physical routed network hai jiska kaam fabric devices ke loopbacks ko connect karna hai. Tunnels aur virtual networks uske upar bana overlay hain; REST API northbound interface hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Edge-1 (loopback 10.255.0.1) receives a frame from PC-A (10.50.1.10) for PC-B (10.50.1.20) behind Edge-2 (loopback 10.255.0.2). What are the source and destination of the outer IP header on the underlay?",
        hi: "Edge-1 (loopback 10.255.0.1) ko PC-A (10.50.1.10) se PC-B (10.50.1.20) ke liye frame milta hai, jo Edge-2 (loopback 10.255.0.2) ke peeche hai. Underlay par outer IP header ka source aur destination kya hoga?",
      },
      options: [
        { en: "10.255.0.1 → 10.255.0.2", hi: "10.255.0.1 → 10.255.0.2" },
        { en: "10.50.1.10 → 10.50.1.20", hi: "10.50.1.10 → 10.50.1.20" },
        { en: "10.50.1.10 → 10.255.0.2", hi: "10.50.1.10 → 10.255.0.2" },
        { en: "10.255.0.1 → 10.50.1.20", hi: "10.255.0.1 → 10.50.1.20" },
      ],
      answer: 0,
      explain: {
        en: "The outer header runs between the two tunnel endpoints, the edges' loopbacks, because that is all the underlay knows how to reach. The PCs' addresses stay inside, in the inner frame, untouched.",
        hi: "Outer header dono tunnel endpoints, yaani edges ke loopbacks, ke beech hota hai, kyunki underlay sirf unhi tak pahunchna jaanta hai. PCs ke addresses andar inner frame mein rehte hain, bina badle.",
      },
      kind: "scenario",
    },
    {
      q: { en: "In a traditional network running OSPF, where does the control plane run?", hi: "OSPF chalane wale traditional network mein control plane kahan chalta hai?" },
      options: [
        { en: "Only on the OSPF designated router", hi: "Sirf OSPF designated router par" },
        { en: "On a central controller", hi: "Ek central controller par" },
        { en: "On every router, each building its own routing table", hi: "Har router par, har ek apna routing table banata hai" },
        { en: "In the management plane of the NMS", hi: "NMS ke management plane mein" },
      ],
      answer: 2,
      explain: {
        en: "Traditional networks have a distributed control plane: every router exchanges LSAs and runs SPF itself. The DR only reduces flooding on a shared segment; it does not compute routes for others.",
        hi: "Traditional networks mein distributed control plane hota hai: har router khud LSAs exchange karta hai aur SPF chalata hai. DR sirf shared segment par flooding kam karta hai; doosron ke liye routes calculate nahi karta.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A data centre uses a spine-leaf fabric. Policy is defined centrally and pushed to the leaf switches with OpFlex. Which controller is this?",
        hi: "Ek data centre spine-leaf fabric use karta hai. Policy centrally define hoti hai aur OpFlex se leaf switches tak push hoti hai. Yeh kaunsa controller hai?",
      },
      options: [
        { en: "APIC, in Cisco ACI", hi: "APIC, Cisco ACI mein" },
        { en: "Catalyst Center, in SD-Access", hi: "Catalyst Center, SD-Access mein" },
        { en: "Catalyst SD-WAN Manager", hi: "Catalyst SD-WAN Manager" },
        { en: "A wireless LAN controller", hi: "Wireless LAN controller" },
      ],
      answer: 0,
      explain: {
        en: "Spine-leaf, data centre and OpFlex all point to Cisco ACI, whose controller is APIC. Catalyst Center runs the campus SD-Access fabric, SD-WAN Manager runs the WAN, and a WLC manages access points.",
        hi: "Spine-leaf, data centre aur OpFlex, teeno Cisco ACI ki taraf ishara karte hain, jiska controller APIC hai. Catalyst Center campus SD-Access fabric chalata hai, SD-WAN Manager WAN, aur WLC access points manage karta hai.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "7HhWCeXDTpA",
      title: "Free CCNA | Software-Defined Networking | Day 62",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "SDN architecture, NBI and SBI, SD-Access underlay, overlay and fabric, and DNA Center.", hi: "SDN architecture, NBI aur SBI, SD-Access underlay, overlay aur fabric, aur DNA Center." },
    },
    {
      id: "eFujQDPLr6c",
      title: "141. Free CCNA (NEW) | Introduction to NBI, SBI and API | CCNA 200-301 Complete Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Northbound and southbound interfaces explained in Hindi.", hi: "Northbound aur southbound interfaces, Hindi mein." },
    },
    {
      id: "HpNx08Ufk3c",
      title: "145. Free CCNA (NEW) | SDA Fabric, Underlay, Overlay & VXLAN | CCNA 200-301 Complete Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Fabric, underlay, overlay and VXLAN in SD-Access, in Hindi.", hi: "SD-Access mein fabric, underlay, overlay aur VXLAN, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Talk to a controller", hi: "Controller se baat karo" },
    steps: [
      { en: "Packet Tracer includes a Network Controller device. Add it, give it 10.10.0.5/24, and connect it to a small network of two switches and a router that all have SSH enabled.", hi: "Packet Tracer mein Network Controller device hota hai. Use add karo, 10.10.0.5/24 do, aur do switches aur ek router wale chhote network se connect karo jinpar SSH enabled ho." },
      { en: "From a PC's web browser open http://10.10.0.5, create the admin account, then add the devices' SSH credentials and run discovery.", hi: "Ek PC ke web browser se http://10.10.0.5 kholo, admin account banao, phir devices ke SSH credentials add karke discovery chalao." },
      { en: "Open the inventory and topology views. Note which southbound protocol the controller used to learn about the devices.", hi: "Inventory aur topology views kholo. Note karo ki devices ke baare mein jaanne ke liye controller ne kaunsa southbound protocol use kiya." },
      { en: "Open the controller's API documentation page and find the call that lists network devices. That is its northbound interface.", hi: "Controller ka API documentation page kholo aur woh call dhoondho jo network devices list karti hai. Yahi uska northbound interface hai." },
      { en: "Optional, with real gear: Cisco DevNet offers free Catalyst Center sandboxes where you can send `GET /dna/intent/api/v1/network-device` and compare the JSON with this lesson.", hi: "Optional, real gear ke saath: Cisco DevNet free Catalyst Center sandboxes deta hai jahan tum `GET /dna/intent/api/v1/network-device` bhej kar JSON ko is lesson se compare kar sakte ho." },
    ],
  },
};

export default lesson;
