import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "virtualization-cloud",
  intro: {
    en: "A physical server used to run one operating system and one application, and spent most of its time idle. Virtualization lets one server run many isolated systems, containers make each of those lighter, and VRFs apply the same idea to a router's routing table. Cloud providers sell all of this as a service, so a network engineer has to know how these virtual pieces connect to the real network.",
    hi: "Pehle ek physical server par ek operating system aur ek application chalti thi, aur server zyadatar time khaali baitha rehta tha. Virtualization se ek server par kai isolated systems chal sakte hain, containers inme se har ek ko aur halka bana dete hain, aur VRFs yahi idea router ki routing table par lagate hain. Cloud providers yeh sab service ke roop mein bechte hain, isliye network engineer ko pata hona chahiye ki yeh virtual cheezein asli network se kaise judti hain.",
  },
  outcomes: [
    { en: "Compare type 1 and type 2 hypervisors and name examples of each", hi: "Type 1 aur type 2 hypervisors compare kar sako aur dono ke examples bata sako" },
    {
      en: "Explain how virtual machines reach the physical network through a virtual switch and a trunk",
      hi: "Samjha sako ki virtual machines virtual switch aur trunk ke through physical network tak kaise pahunchti hain",
    },
    { en: "Contrast containers with virtual machines: contents, size, start time and isolation", hi: "Containers aur virtual machines ka farq bata sako: andar kya hai, size, start time aur isolation" },
    {
      en: "Explain how VRFs give one router separate routing tables, even with overlapping addresses",
      hi: "Samjha sako ki VRFs ek router ko alag-alag routing tables kaise dete hain, overlapping addresses ke saath bhi",
    },
    {
      en: "Describe the NIST cloud characteristics, the IaaS, PaaS and SaaS models, the deployment models and the ways to connect to a cloud",
      hi: "NIST cloud characteristics, IaaS, PaaS aur SaaS models, deployment models aur cloud se connect hone ke tareeke describe kar sako",
    },
  ],
  sections: [
    {
      id: "why-virtualize",
      heading: { en: "One server, one job: the problem", hi: "Ek server, ek kaam: problem kya thi" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Before virtualization, each application got its own physical server. Sharing one OS between unrelated applications was risky: one crash, one bad update or one conflicting library could take both down. The result was racks of servers each using a small part of their CPU and memory, while every one of them still needed space, power, cooling, cabling and maintenance. A new server meant ordering hardware and waiting.",
            hi: "Virtualization se pehle har application ko apna physical server milta tha. Alag-alag applications ko ek OS par chalana risky tha: ek crash, ek kharab update ya ek conflicting library dono ko gira sakti thi. Nateeja: racks bhar ke servers, har ek apne CPU aur memory ka chhota sa hissa use karta hua, aur phir bhi har ek ko space, power, cooling, cabling aur maintenance chahiye. Naya server matlab hardware order karo aur wait karo.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Server virtualization** adds a software layer called a **hypervisor** (also called a virtual machine monitor, VMM) between the hardware and the operating systems. The hypervisor divides the server's CPU, memory, storage and network among **virtual machines (VMs)**. Each VM runs its own OS and behaves as if it had a whole computer to itself; VMs on the same server cannot see each other's memory or files.",
            hi: "**Server virtualization** hardware aur operating systems ke beech ek software layer jodta hai jise **hypervisor** kehte hain (isse virtual machine monitor, VMM bhi kehte hain). Hypervisor server ke CPU, memory, storage aur network ko **virtual machines (VMs)** mein baant deta hai. Har VM apna OS chalata hai aur aise behave karta hai jaise poora computer usi ka ho; same server ke VMs ek doosre ki memory ya files nahi dekh sakte.",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Better use of hardware**: one server now carries the load of several.", hi: "**Hardware ka better use**: ab ek server kai servers ka load uthata hai." },
            { en: "**Speed**: a new VM takes minutes to create, not weeks to buy and rack.", hi: "**Speed**: naya VM banane mein minute lagte hain, kharidne aur rack karne mein hafte nahi." },
            {
              en: "**Mobility**: a VM is a set of files, so it can be copied, backed up or moved to another server.",
              hi: "**Mobility**: VM files ka ek set hai, isliye use copy, backup ya doosre server par move kiya ja sakta hai.",
            },
            { en: "**Less space, power and cooling** in the data center.", hi: "Data center mein **kam space, power aur cooling**." },
          ],
        },
      ],
    },
    {
      id: "hypervisors",
      heading: { en: "Type 1 and type 2 hypervisors", hi: "Type 1 aur type 2 hypervisors" },
      blocks: [
        {
          type: "table",
          columns: [
            { en: "Feature", hi: "Feature" },
            { en: "Type 1 (bare metal)", hi: "Type 1 (bare metal)" },
            { en: "Type 2 (hosted)", hi: "Type 2 (hosted)" },
          ],
          rows: [
            [
              { en: "Runs on", hi: "Kahan chalta hai" },
              { en: "Directly on the server hardware", hi: "Seedha server hardware par" },
              { en: "As an application on a host OS (Windows, macOS, Linux)", hi: "Host OS (Windows, macOS, Linux) par ek application ki tarah" },
            ],
            [
              { en: "Examples", hi: "Examples" },
              "VMware ESXi, Microsoft Hyper-V, KVM",
              "Oracle VirtualBox, VMware Workstation",
            ],
            [
              { en: "Performance", hi: "Performance" },
              { en: "Best: no host OS in the way", hi: "Sabse achhi: beech mein koi host OS nahi" },
              { en: "Lower: the host OS takes a share", hi: "Kam: host OS bhi apna hissa leta hai" },
            ],
            [
              { en: "Used for", hi: "Kahan use hota hai" },
              { en: "Data centers and clouds", hi: "Data centers aur clouds" },
              { en: "Labs, testing, a second OS on a laptop", hi: "Labs, testing, laptop par doosra OS" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Type 1 = bare metal = native, used in data centers. Type 2 = hosted, runs on top of a normal OS. A VM always has its own guest OS, whichever type runs it.",
            hi: "Type 1 = bare metal = native, data centers mein use hota hai. Type 2 = hosted, normal OS ke upar chalta hai. Hypervisor kisi bhi type ka ho, VM ka apna guest OS hamesha hota hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Try it today", hi: "Aaj hi try karo" },
          text: {
            en: "VirtualBox is free. Install it on your laptop and you are running a type 2 hypervisor; the lab at the end of this lesson shows how its virtual network connects a VM to your LAN.",
            hi: "VirtualBox free hai. Ise laptop par install karo aur tum type 2 hypervisor chala rahe ho; is lesson ke end wala lab dikhata hai ki iska virtual network VM ko tumhare LAN se kaise jodta hai.",
          },
        },
      ],
    },
    {
      id: "virtual-switching",
      heading: { en: "How VMs reach the network: virtual switches", hi: "VMs network tak kaise pahunchte hain: virtual switches" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Each VM has one or more **virtual NICs (vNICs)**, each with its own MAC address. The vNICs plug into a **virtual switch (vSwitch)** that runs inside the hypervisor. The vSwitch is a Layer 2 switch in software: it knows the MAC address of every vNIC plugged into it, forwards frames between VMs, and uses the server's physical NICs as uplinks to the real network.",
            hi: "Har VM mein ek ya zyada **virtual NICs (vNICs)** hote hain, har ek ka apna MAC address. Yeh vNICs hypervisor ke andar chalne wale **virtual switch (vSwitch)** mein lagte hain. vSwitch software mein bana Layer 2 switch hai: use apne har vNIC ka MAC address pata hota hai, VMs ke beech frames forward karta hai, aur server ke physical NICs ko asli network ki taraf uplink ki tarah use karta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Example: host ESXi1 runs VM1 (web, `10.10.10.11`, VLAN 10), VM2 (database, `10.10.20.12`, VLAN 20) and VM3 (mail, `10.10.10.13`, VLAN 10). The vSwitch puts each vNIC in a VLAN (VMware calls these groups port groups) and adds an 802.1Q tag when a frame leaves on the physical NIC. So the port on SW1 facing the server, `Gi1/0/10`, is a **trunk** carrying VLANs 10 and 20. Trunks are covered in lesson 2.2.",
            hi: "Example: host ESXi1 par VM1 (web, `10.10.10.11`, VLAN 10), VM2 (database, `10.10.20.12`, VLAN 20) aur VM3 (mail, `10.10.10.13`, VLAN 10) chalte hain. vSwitch har vNIC ko ek VLAN mein daalta hai (VMware in groups ko port groups kehta hai) aur physical NIC se nikalte frame par 802.1Q tag laga deta hai. Isliye SW1 ka server wala port, `Gi1/0/10`, ek **trunk** hai jo VLAN 10 aur 20 dono le jaata hai. Trunks lesson 2.2 mein aayenge.",
          },
        },
        {
          type: "table",
          caption: { en: "Where does each frame go?", hi: "Har frame kahan jaata hai?" },
          columns: [
            { en: "Traffic", hi: "Traffic" },
            { en: "Path", hi: "Path" },
          ],
          rows: [
            [
              "VM1 → VM3 (same host, same VLAN)",
              { en: "Switched inside the vSwitch. It never reaches SW1.", hi: "vSwitch ke andar hi switch hota hai. SW1 tak kabhi nahi pahunchta." },
            ],
            [
              { en: "VM1 → VM2 (same host, different VLAN)", hi: "VM1 → VM2 (same host, alag VLAN)" },
              {
                en: "Up the trunk to the VLAN 10 default gateway (a router or Layer 3 switch), routed into VLAN 20, then back down the same trunk.",
                hi: "Trunk se upar VLAN 10 ke default gateway (router ya Layer 3 switch) tak, wahan VLAN 20 mein route hota hai, phir usi trunk se wapas neeche.",
              },
            ],
            [
              { en: "VM1 → a PC elsewhere", hi: "VM1 → kahin aur ka PC" },
              { en: "Out of the physical NIC tagged VLAN 10, then through the network like any other host.", hi: "VLAN 10 tag ke saath physical NIC se bahar, phir kisi bhi normal host ki tarah network se." },
            ],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Invisible traffic", hi: "Invisible traffic" },
          text: {
            en: "Frames between VMs on the same host and VLAN never touch the physical switch. ACLs, port security or a packet capture on SW1 will not see them.",
            hi: "Same host aur same VLAN ke VMs ke beech ke frames physical switch ko chhoote bhi nahi. SW1 par ACLs, port security ya packet capture unhe nahi dekh payenge.",
          },
        },
      ],
    },
    {
      id: "containers",
      heading: { en: "Containers: lighter than VMs", hi: "Containers: VMs se halke" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A VM carries a whole OS, often several gigabytes, and boots like a real computer. Many applications do not need that. A **container** packages one application with the libraries and settings it needs, but **no OS kernel of its own**: every container on a host shares the host OS kernel. A **container engine**, such as Docker Engine, starts the containers and keeps them isolated from each other.",
            hi: "VM apne saath poora OS le kar chalta hai, aksar kai gigabytes ka, aur asli computer ki tarah boot hota hai. Bahut saari applications ko itna nahi chahiye. **Container** ek application ko uski zaroori libraries aur settings ke saath pack karta hai, lekin **uska apna OS kernel nahi hota**: host ke saare containers host OS ka kernel share karte hain. **Container engine**, jaise Docker Engine, containers ko start karta hai aur unhe ek doosre se isolated rakhta hai.",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Feature", hi: "Feature" },
            { en: "Virtual machine", hi: "Virtual machine" },
            { en: "Container", hi: "Container" },
          ],
          rows: [
            [
              { en: "Inside", hi: "Andar kya hai" },
              { en: "App, libraries and a full guest OS", hi: "App, libraries aur poora guest OS" },
              { en: "App and its libraries only", hi: "Sirf app aur uski libraries" },
            ],
            [
              { en: "Runs on", hi: "Kis par chalta hai" },
              { en: "A hypervisor", hi: "Hypervisor par" },
              { en: "A container engine on a host OS", hi: "Host OS par container engine ke through" },
            ],
            [
              { en: "Typical size", hi: "Typical size" },
              { en: "Gigabytes", hi: "Gigabytes" },
              { en: "Megabytes", hi: "Megabytes" },
            ],
            [
              { en: "Start time", hi: "Start time" },
              { en: "Minutes, like booting a PC", hi: "Minutes, PC boot karne jaisa" },
              { en: "Seconds or less", hi: "Seconds ya usse bhi kam" },
            ],
            [
              { en: "Isolation", hi: "Isolation" },
              { en: "Strong: each VM has its own kernel", hi: "Strong: har VM ka apna kernel" },
              { en: "Weaker: all share one kernel", hi: "Kamzor: sab ek kernel share karte hain" },
            ],
            [
              { en: "OS choice", hi: "OS choice" },
              { en: "Any OS the hypervisor supports", hi: "Hypervisor jo bhi OS support kare" },
              { en: "Must suit the host kernel (Linux containers need Linux)", hi: "Host kernel ke hisaab se (Linux containers ko Linux chahiye)" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Modern applications are often split into many small services, each in its own container. Nobody runs hundreds of containers by hand, so an **orchestrator** such as **Kubernetes** decides which host runs each container, starts more copies when load rises, and restarts containers that fail. Containers and VMs are not rivals: in the cloud, containers very often run inside VMs.",
            hi: "Aaj ki applications aksar kai chhoti services mein bati hoti hain, har service apne container mein. Sainkdon containers haath se koi nahi chalata, isliye **Kubernetes** jaisa **orchestrator** decide karta hai ki kaunsa container kis host par chalega, load badhne par aur copies start karta hai, aur fail hue containers ko restart karta hai. Containers aur VMs rivals nahi hain: cloud mein containers bahut baar VMs ke andar hi chalte hain.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Why Docker on Windows needs a VM", hi: "Windows par Docker ko VM kyun chahiye" },
          text: {
            en: "Docker Desktop on Windows and macOS runs a small Linux VM in the background, because Linux containers need a Linux kernel to share.",
            hi: "Windows aur macOS par Docker Desktop background mein ek chhota Linux VM chalata hai, kyunki Linux containers ko share karne ke liye Linux kernel chahiye.",
          },
        },
      ],
    },
    {
      id: "vrfs",
      heading: { en: "VRFs: one router, many routing tables", hi: "VRFs: ek router, kai routing tables" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Virtualization is not only for servers. **VRF (Virtual Routing and Forwarding)** splits one router, or Layer 3 switch, into several virtual routers. Each VRF has its own routing table, and each Layer 3 interface belongs to exactly one VRF (interfaces you do not assign stay in the normal, global routing table). A packet that arrives on an interface in VRF CUST-A is looked up only in CUST-A's table and can only leave through CUST-A's interfaces.",
            hi: "Virtualization sirf servers ke liye nahi hai. **VRF (Virtual Routing and Forwarding)** ek router, ya Layer 3 switch, ko kai virtual routers mein baant deta hai. Har VRF ki apni routing table hoti hai, aur har Layer 3 interface exactly ek VRF ka hota hai (jo interfaces kisi VRF mein assign nahi kiye, woh normal global routing table mein rehte hain). VRF CUST-A ke interface par aaya packet sirf CUST-A ki table mein lookup hota hai aur sirf CUST-A ke interfaces se hi bahar ja sakta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Because the tables are separate, the **same subnet can exist in two VRFs**. Service providers use this to connect many customers to one router even when several of them use `192.168.1.0/24`. Enterprises use VRFs to keep, for example, guest and corporate traffic apart on shared routers. VRFs used without MPLS are called **VRF-lite**, which is what you would configure on a single router.",
            hi: "Tables alag hain, isliye **same subnet do VRFs mein exist kar sakta hai**. Service providers isi se ek router par kai customers jodte hain, chahe unme se kai `192.168.1.0/24` use karte hon. Enterprises VRFs se, jaise, guest aur corporate traffic ko shared routers par alag rakhte hain. MPLS ke bina use hone wale VRFs ko **VRF-lite** kehte hain, aur single router par tum yahi configure karoge.",
          },
        },
        {
          type: "cli",
          title: { en: "VRF-lite on R1 (configuration is beyond the CCNA exam)", hi: "R1 par VRF-lite (configuration CCNA exam se aage ka hai)" },
          lines: [
            { prompt: "R1(config)#", cmd: "ip vrf CUST-A" },
            { prompt: "R1(config-vrf)#", cmd: "exit" },
            { prompt: "R1(config)#", cmd: "ip vrf CUST-B" },
            { prompt: "R1(config-vrf)#", cmd: "exit" },
            { prompt: "R1(config)#", cmd: "interface GigabitEthernet0/0" },
            {
              prompt: "R1(config-if)#",
              cmd: "ip vrf forwarding CUST-A",
              comment: { en: "Assign the VRF first: adding it later removes the interface's IP address", hi: "VRF pehle assign karo: baad mein lagane par interface ka IP address hat jaata hai" },
            },
            { prompt: "R1(config-if)#", cmd: "ip address 192.168.1.1 255.255.255.0" },
            { prompt: "R1(config-if)#", cmd: "interface GigabitEthernet0/1" },
            { prompt: "R1(config-if)#", cmd: "ip vrf forwarding CUST-B" },
            {
              prompt: "R1(config-if)#",
              cmd: "ip address 192.168.1.1 255.255.255.0",
              comment: { en: "Same address as Gi0/0, accepted because it is in another VRF", hi: "Gi0/0 wala hi address, accept hota hai kyunki yeh doosre VRF mein hai" },
            },
          ],
          note: {
            en: "Without VRFs, the last command is rejected with `% 192.168.1.0 overlaps with GigabitEthernet0/0`. Newer IOS XE configurations often use `vrf definition` with address families instead; `ip vrf` is the older IPv4-only form.",
            hi: "VRFs ke bina aakhri command `% 192.168.1.0 overlaps with GigabitEthernet0/0` ke saath reject ho jaati hai. Naye IOS XE configurations mein aksar iski jagah address families ke saath `vrf definition` use hota hai; `ip vrf` purana IPv4-only form hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Looking inside a VRF", hi: "VRF ke andar dekhna" },
          lines: [
            { prompt: "R1#", cmd: "show ip vrf" },
            { out: "  Name                             Default RD            Interfaces" },
            { out: "  CUST-A                           <not set>             Gi0/0" },
            { out: "  CUST-B                           <not set>             Gi0/1" },
            { prompt: "R1#", cmd: "show ip route vrf CUST-A" },
            { out: "Routing Table: CUST-A" },
            { out: "      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks" },
            { out: "C        192.168.1.0/24 is directly connected, GigabitEthernet0/0" },
            { out: "L        192.168.1.1/32 is directly connected, GigabitEthernet0/0" },
            {
              prompt: "R1#",
              cmd: "ping vrf CUST-A 192.168.1.10",
              comment: { en: "A plain ping uses the global table, which no longer has this subnet", hi: "Plain ping global table use karta hai, jisme ab yeh subnet hai hi nahi" },
            },
            { out: "Sending 5, 100-byte ICMP Echos to 192.168.1.10, timeout is 2 seconds:" },
            { out: "!!!!!" },
            { out: "Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/2 ms" },
          ],
          note: {
            en: "`show ip route` on its own shows only the global routing table. Add `vrf NAME` to look inside a VRF.",
            hi: "Akela `show ip route` sirf global routing table dikhata hai. VRF ke andar dekhne ke liye `vrf NAME` jodo.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "What the CCNA expects", hi: "CCNA kya expect karta hai" },
          text: {
            en: "Know the concept: separate routing tables on one router, each interface in one VRF, overlapping addresses allowed, and no traffic between VRFs unless you deliberately leak routes. VRF configuration belongs to the CCNP level.",
            hi: "Concept pakka karo: ek router par alag routing tables, har interface ek VRF mein, overlapping addresses allowed, aur VRFs ke beech koi traffic nahi jab tak tum jaan-boojh kar routes leak na karo. VRF configuration CCNP level ki cheez hai.",
          },
        },
      ],
    },
    {
      id: "cloud-basics",
      heading: { en: "Cloud computing: characteristics, services and deployments", hi: "Cloud computing: characteristics, services aur deployments" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Cloud computing is defined by **NIST SP 800-145**, the definition Cisco also uses. A service counts as cloud when it has five characteristics:",
            hi: "Cloud computing ko **NIST SP 800-145** define karta hai, aur Cisco bhi yahi definition use karta hai. Koi service tab cloud kehlati hai jab usme yeh paanch characteristics hon:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**On-demand self-service**: you create a VM or a database yourself through a portal or API, without asking the provider's staff.",
              hi: "**On-demand self-service**: tum khud portal ya API se VM ya database bana lete ho, provider ke staff se pooche bina.",
            },
            {
              en: "**Broad network access**: you reach it over the network from standard devices such as laptops, phones and servers.",
              hi: "**Broad network access**: laptops, phones aur servers jaise standard devices se network ke through ise access karte ho.",
            },
            {
              en: "**Resource pooling**: the provider's hardware serves many customers at once, and you usually do not know or control exactly which server you are on.",
              hi: "**Resource pooling**: provider ka hardware ek saath kai customers ko serve karta hai, aur aam taur par tumhe pata nahi hota ki tum exactly kis server par ho.",
            },
            {
              en: "**Rapid elasticity**: you add or remove capacity quickly, often automatically, so it appears unlimited.",
              hi: "**Rapid elasticity**: capacity jaldi badha ya ghata sakte ho, aksar automatically, isliye yeh unlimited jaisi lagti hai.",
            },
            {
              en: "**Measured service**: usage is metered, so you pay for what you use and can see what you used.",
              hi: "**Measured service**: usage meter hota hai, isliye jitna use karo utna pay karo, aur dekh bhi sakte ho ki kitna use kiya.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Service models", hi: "Service models" },
          columns: [
            { en: "Model", hi: "Model" },
            { en: "You manage", hi: "Tum manage karte ho" },
            { en: "Provider manages", hi: "Provider manage karta hai" },
            { en: "Examples", hi: "Examples" },
          ],
          rows: [
            [
              "IaaS",
              { en: "OS, runtime, apps and data", hi: "OS, runtime, apps aur data" },
              { en: "Hardware, network, virtualization", hi: "Hardware, network, virtualization" },
              "AWS EC2, Azure Virtual Machines, Google Compute Engine",
            ],
            [
              "PaaS",
              { en: "Your apps and data", hi: "Tumhare apps aur data" },
              { en: "Everything below, up to the OS and runtime", hi: "Neeche ka sab kuch, OS aur runtime tak" },
              "Google App Engine, Azure App Service, AWS Elastic Beanstalk",
            ],
            [
              "SaaS",
              { en: "Only your own data, users and settings", hi: "Sirf apna data, users aur settings" },
              { en: "The whole application and everything under it", hi: "Poori application aur uske neeche ka sab kuch" },
              "Microsoft 365, Gmail, Webex, Salesforce",
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "NIST also defines four **deployment models**:",
            hi: "NIST chaar **deployment models** bhi define karta hai:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Public cloud**: owned by a provider and open to anyone who pays, such as AWS, Microsoft Azure and Google Cloud.",
              hi: "**Public cloud**: provider ka hota hai aur pay karne wale kisi ke liye bhi khula hai, jaise AWS, Microsoft Azure aur Google Cloud.",
            },
            {
              en: "**Private cloud**: for one organization only. It can sit in the company's own data center or be run for it by a third party.",
              hi: "**Private cloud**: sirf ek organization ke liye. Yeh company ke apne data center mein ho sakta hai, ya koi third party uske liye chala sakti hai.",
            },
            {
              en: "**Community cloud**: shared by several organizations with common needs, such as agencies that follow the same compliance rules.",
              hi: "**Community cloud**: same zarooraton wale kai organizations mil kar share karte hain, jaise same compliance rules follow karne wali agencies.",
            },
            {
              en: "**Hybrid cloud**: two or more of these connected so data and applications can move between them, for example a private cloud that uses a public cloud at peak times.",
              hi: "**Hybrid cloud**: inme se do ya zyada jude hue, taaki data aur applications unke beech move ho sakein, jaise private cloud jo peak time par public cloud use karta hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "On-premises vs cloud", hi: "On-premises vs cloud" },
          text: {
            en: "On-premises means you own and run the equipment in your own building or data center. Cloud means you consume it as a service. A private cloud can still be on-premises: what makes it cloud is the five characteristics, not the location.",
            hi: "On-premises matlab equipment tumhara hai aur tum hi use apni building ya data center mein chalate ho. Cloud matlab tum use service ki tarah consume karte ho. Private cloud on-premises bhi ho sakta hai: use cloud banati hain woh paanch characteristics, location nahi.",
          },
        },
      ],
    },
    {
      id: "connecting-to-cloud",
      heading: { en: "Connecting to the cloud", hi: "Cloud se connect karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Users and branches still need a path to the cloud provider's data center. The options trade cost against performance and security:",
            hi: "Users aur branches ko cloud provider ke data center tak ek raasta toh chahiye hi. Har option mein ek taraf cost hai, doosri taraf performance aur security:",
          },
        },
        {
          type: "table",
          columns: [
            { en: "Option", hi: "Option" },
            { en: "How it works", hi: "Kaise kaam karta hai" },
            { en: "Trade-off", hi: "Trade-off" },
          ],
          rows: [
            [
              "Internet",
              { en: "Reach the cloud over your normal internet link, protected by HTTPS or other encryption.", hi: "Apne normal internet link se cloud tak jao, HTTPS ya doosre encryption ke saath." },
              { en: "Cheapest and quickest; no guaranteed bandwidth or delay.", hi: "Sabse sasta aur jaldi; bandwidth ya delay ki koi guarantee nahi." },
            ],
            [
              { en: "Site-to-site VPN", hi: "Site-to-site VPN" },
              {
                en: "An IPsec tunnel over the internet between your router or firewall and the provider's VPN gateway (lesson 5.9).",
                hi: "Internet ke upar tumhare router ya firewall aur provider ke VPN gateway ke beech IPsec tunnel (lesson 5.9).",
              },
              { en: "Everything is encrypted; still limited by internet performance.", hi: "Sab kuch encrypted; lekin performance internet jitni hi." },
            ],
            [
              "Private WAN",
              {
                en: "A dedicated connection through a provider, such as an MPLS network or a direct link like AWS Direct Connect or Azure ExpressRoute.",
                hi: "Provider ke through dedicated connection, jaise MPLS network ya AWS Direct Connect ya Azure ExpressRoute jaisa direct link.",
              },
              { en: "Predictable performance and an SLA; costs more and takes longer to set up.", hi: "Predictable performance aur SLA; lekin mehenga aur setup mein zyada time." },
            ],
            [
              { en: "Intercloud exchange", hi: "Intercloud exchange" },
              { en: "A provider that connects to many clouds, so one private connection reaches several of them.", hi: "Aisa provider jo kai clouds se juda hai, isliye ek private connection se kai clouds tak pahunch jaate ho." },
              { en: "Easier to use or switch between several clouds; one more provider to pay.", hi: "Kai clouds use karna ya unke beech switch karna aasaan; lekin ek aur provider ko pay karna." },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Moving servers into a public cloud also moves traffic. Users who reached a server across the LAN now cross the WAN or the internet, so the capacity and reliability of those links matter more than before. WAN options themselves are covered in lesson 1.13.",
            hi: "Servers ko public cloud mein le jaane se traffic bhi shift hota hai. Jo users pehle LAN par server tak pahunchte the, ab WAN ya internet cross karte hain, isliye un links ki capacity aur reliability pehle se zyada matter karti hai. WAN options khud lesson 1.13 mein cover hue hain.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Hypervisor", def: { en: "Software that runs virtual machines and shares the hardware among them. Type 1 runs on bare metal; type 2 runs on a host OS.", hi: "Software jo virtual machines chalata hai aur hardware ko unme baant deta hai. Type 1 bare metal par chalta hai; type 2 host OS par." } },
    { term: "Virtual machine (VM)", def: { en: "A software computer with its own guest OS, virtual CPU, memory, disk and NICs.", hi: "Software mein bana computer jiska apna guest OS, virtual CPU, memory, disk aur NICs hote hain." } },
    { term: "Virtual switch", def: { en: "A software Layer 2 switch inside the hypervisor that connects vNICs to each other and to the physical NICs.", hi: "Hypervisor ke andar software Layer 2 switch jo vNICs ko aapas mein aur physical NICs se jodta hai." } },
    { term: "Container", def: { en: "An application packaged with its libraries that shares the host OS kernel instead of carrying its own OS.", hi: "Libraries ke saath pack ki gayi application jo apna OS le jaane ki jagah host OS ka kernel share karti hai." } },
    { term: "Kubernetes", def: { en: "A container orchestrator: it places, scales and restarts containers across many hosts.", hi: "Container orchestrator: kai hosts par containers ko place, scale aur restart karta hai." } },
    { term: "VRF", def: { en: "Virtual Routing and Forwarding: a separate routing table on a router, with its own set of interfaces.", hi: "Virtual Routing and Forwarding: router par ek alag routing table, apne interfaces ke set ke saath." } },
    { term: "VRF-lite", def: { en: "VRFs used on their own, without MPLS.", hi: "VRFs ka akele use, bina MPLS ke." } },
    { term: "IaaS / PaaS / SaaS", def: { en: "Cloud service models: rented infrastructure, a managed platform for your code, or a finished application.", hi: "Cloud service models: rent par infrastructure, tumhare code ke liye managed platform, ya ek ready application." } },
  ],
  commands: [
    { cmd: "ip vrf NAME", mode: "Cisco global configuration", does: { en: "Create a VRF (older IPv4-only syntax)", hi: "VRF banata hai (purana IPv4-only syntax)" } },
    { cmd: "ip vrf forwarding NAME", mode: "Cisco interface configuration", does: { en: "Put the interface in a VRF; removes its existing IP address", hi: "Interface ko VRF mein daalta hai; uska existing IP address hata deta hai" } },
    { cmd: "show ip vrf", mode: "Cisco privileged EXEC", does: { en: "List the VRFs and their interfaces", hi: "VRFs aur unke interfaces list karta hai" } },
    { cmd: "show ip route vrf NAME", mode: "Cisco privileged EXEC", does: { en: "Show one VRF's routing table", hi: "Ek VRF ki routing table dikhata hai" } },
    { cmd: "ping vrf NAME ADDRESS", mode: "Cisco privileged EXEC", does: { en: "Ping using a VRF's routing table", hi: "VRF ki routing table use karke ping karta hai" } },
  ],
  mistakes: [
    {
      en: "Calling VirtualBox or VMware Workstation a type 1 hypervisor. They run on a host OS, so they are type 2; ESXi, Hyper-V and KVM are type 1.",
      hi: "VirtualBox ya VMware Workstation ko type 1 hypervisor bolna. Yeh host OS par chalte hain, isliye type 2 hain; ESXi, Hyper-V aur KVM type 1 hain.",
    },
    {
      en: "Thinking each container has its own OS. Containers share the host kernel; that is exactly why they are small and fast, and why their isolation is weaker than a VM's.",
      hi: "Yeh sochna ki har container ka apna OS hota hai. Containers host kernel share karte hain; isi wajah se woh chhote aur fast hain, aur isi wajah se unka isolation VM se kamzor hai.",
    },
    {
      en: "Confusing a VRF with a VLAN. A VLAN splits a switch into Layer 2 broadcast domains; a VRF splits a router's Layer 3 routing table. They are often used together.",
      hi: "VRF aur VLAN ko ek samajhna. VLAN switch ko Layer 2 broadcast domains mein baantta hai; VRF router ki Layer 3 routing table ko baantta hai. Dono aksar saath use hote hain.",
    },
    {
      en: "Expecting `show ip route` or a plain `ping` to see VRF routes. Both use the global table; add `vrf NAME`.",
      hi: "Yeh expect karna ki `show ip route` ya plain `ping` VRF routes dekh lenge. Dono global table use karte hain; `vrf NAME` jodna padta hai.",
    },
    {
      en: "Assuming traffic between two VMs always crosses the physical switch. VMs on the same host and VLAN talk through the vSwitch only.",
      hi: "Yeh maan lena ki do VMs ke beech ka traffic hamesha physical switch se jaata hai. Same host aur same VLAN ke VMs sirf vSwitch ke through baat karte hain.",
    },
    {
      en: "Mixing up the service models. If you patch the OS, it is IaaS; if you only deploy your code, it is PaaS; if you just log in and use the application, it is SaaS.",
      hi: "Service models mix karna. OS tum patch karte ho toh IaaS; sirf apna code deploy karte ho toh PaaS; bas login karke application use karte ho toh SaaS.",
    },
  ],
  recap: [
    { en: "A hypervisor shares one server among VMs, each with its own guest OS. Type 1 runs on bare metal, type 2 on a host OS.", hi: "Hypervisor ek server ko VMs mein baant deta hai, har VM ka apna guest OS. Type 1 bare metal par chalta hai, type 2 host OS par." },
    { en: "VMs connect through a virtual switch; the physical switch port facing the host is usually an 802.1Q trunk.", hi: "VMs virtual switch se connect hote hain; host ki taraf wala physical switch port aam taur par 802.1Q trunk hota hai." },
    { en: "Containers share the host kernel: megabytes, start in seconds, weaker isolation. Kubernetes orchestrates them.", hi: "Containers host kernel share karte hain: megabytes, seconds mein start, kamzor isolation. Kubernetes unhe orchestrate karta hai." },
    { en: "A VRF is a separate routing table on one router; overlapping subnets are fine in different VRFs, and VRFs are isolated from each other.", hi: "VRF ek router par alag routing table hai; alag VRFs mein overlapping subnets chal jaate hain, aur VRFs ek doosre se isolated rehte hain." },
    {
      en: "NIST cloud has five characteristics: on-demand self-service, broad network access, resource pooling, rapid elasticity and measured service. Service models are IaaS, PaaS and SaaS; deployment models are public, private, community and hybrid.",
      hi: "NIST cloud ki paanch characteristics hain: on-demand self-service, broad network access, resource pooling, rapid elasticity aur measured service. Service models IaaS, PaaS aur SaaS hain; deployment models public, private, community aur hybrid hain.",
    },
    { en: "Reach a cloud over the internet, a site-to-site VPN, a private WAN or an intercloud exchange.", hi: "Cloud tak internet, site-to-site VPN, private WAN ya intercloud exchange se pahunchte hain." },
  ],
  quiz: [
    {
      q: {
        en: "Which of these hypervisors runs directly on server hardware, with no host operating system underneath?",
        hi: "Inme se kaunsa hypervisor bina kisi host operating system ke seedha server hardware par chalta hai?",
      },
      options: [
        { en: "Oracle VirtualBox", hi: "Oracle VirtualBox" },
        { en: "VMware Workstation", hi: "VMware Workstation" },
        { en: "VMware ESXi", hi: "VMware ESXi" },
        { en: "Docker Engine", hi: "Docker Engine" },
      ],
      answer: 2,
      explain: {
        en: "ESXi is a type 1 (bare-metal) hypervisor. VirtualBox and Workstation are type 2: they run as applications on Windows, macOS or Linux. Docker Engine is a container engine, not a hypervisor.",
        hi: "ESXi type 1 (bare-metal) hypervisor hai. VirtualBox aur Workstation type 2 hain: yeh Windows, macOS ya Linux par application ki tarah chalte hain. Docker Engine container engine hai, hypervisor nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Why can one server run many more containers than VMs?",
        hi: "Ek server par VMs se kahin zyada containers kyun chal sakte hain?",
      },
      options: [
        { en: "Each container includes a smaller, cut-down guest OS", hi: "Har container mein ek chhota, trimmed guest OS hota hai" },
        { en: "Containers share the host OS kernel instead of each carrying a full OS", hi: "Containers apna poora OS le jaane ki jagah host OS ka kernel share karte hain" },
        { en: "Containers run directly on the hardware with no OS at all", hi: "Containers bina kisi OS ke seedha hardware par chalte hain" },
        { en: "Containers do not use any CPU or memory while idle", hi: "Idle hone par containers koi CPU ya memory use nahi karte" },
      ],
      answer: 1,
      explain: {
        en: "A container holds only the app and its libraries and uses the host's kernel through the container engine. With no guest OS per app, each container is megabytes rather than gigabytes. There is still a host OS underneath, so containers do not run on bare hardware.",
        hi: "Container mein sirf app aur uski libraries hoti hain, aur woh container engine ke through host ka kernel use karta hai. Har app ke liye guest OS nahi, isliye container gigabytes ki jagah megabytes ka hota hai. Neeche host OS hota hi hai, isliye containers bare hardware par nahi chalte.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "VM1 (10.10.10.11) and VM3 (10.10.10.13) are both in VLAN 10 on the same ESXi host. VM1 sends a frame to VM3. Which device forwards it?",
        hi: "VM1 (10.10.10.11) aur VM3 (10.10.10.13) dono same ESXi host par VLAN 10 mein hain. VM1 VM3 ko ek frame bhejta hai. Ise kaun forward karta hai?",
      },
      options: [
        { en: "The virtual switch inside the hypervisor", hi: "Hypervisor ke andar ka virtual switch" },
        { en: "The physical switch the host connects to", hi: "Woh physical switch jisse host juda hai" },
        { en: "The default gateway router", hi: "Default gateway router" },
        { en: "The host's physical NIC, which loops it back", hi: "Host ka physical NIC, jo ise loop back karta hai" },
      ],
      answer: 0,
      explain: {
        en: "Same host, same VLAN: the vSwitch knows both vNIC MACs and switches the frame internally. It never leaves the server, so the physical switch does not see it. No router is involved because the two VMs are in the same subnet.",
        hi: "Same host, same VLAN: vSwitch ko dono vNIC MACs pata hain aur woh frame andar hi switch kar deta hai. Frame server se bahar hi nahi jaata, isliye physical switch use dekhta tak nahi. Router ka koi role nahi, kyunki dono VMs same subnet mein hain.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A provider router must connect two customers who both use 192.168.1.0/24, with 192.168.1.1/24 on each customer-facing interface. The customers must never reach each other. What makes this possible?",
        hi: "Ek provider router ko do customers jodne hain jo dono 192.168.1.0/24 use karte hain, aur har customer wale interface par 192.168.1.1/24 hai. Customers ek doosre tak kabhi nahi pahunchne chahiye. Yeh kis cheez se possible hai?",
      },
      options: [
        { en: "A separate VLAN for each customer on the router", hi: "Router par har customer ke liye alag VLAN" },
        { en: "Port security on both interfaces", hi: "Dono interfaces par port security" },
        { en: "Router-on-a-stick subinterfaces", hi: "Router-on-a-stick subinterfaces" },
        { en: "A separate VRF for each customer", hi: "Har customer ke liye alag VRF" },
      ],
      answer: 3,
      explain: {
        en: "Each VRF has its own routing table, so the same subnet can exist in both, and a packet from one customer is looked up only in that customer's table. VLANs and subinterfaces still share one routing table, so IOS would reject the overlapping address. Port security limits MAC addresses and has nothing to do with routing.",
        hi: "Har VRF ki apni routing table hoti hai, isliye same subnet dono mein reh sakta hai, aur ek customer ka packet sirf usi customer ki table mein lookup hota hai. VLANs aur subinterfaces ek hi routing table share karte hain, isliye IOS overlapping address reject kar dega. Port security MAC addresses limit karti hai, routing se iska koi lena-dena nahi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "On R1, `show ip route vrf CUST-A` shows 192.168.1.0/24 as connected, but `ping 192.168.1.10` fails. Which command tests reachability to that host correctly?",
        hi: "R1 par `show ip route vrf CUST-A` mein 192.168.1.0/24 connected dikhta hai, lekin `ping 192.168.1.10` fail hota hai. Us host tak reachability sahi tarah se kaunsi command test karegi?",
      },
      options: [
        { en: "ping 192.168.1.10 repeat 100", hi: "ping 192.168.1.10 repeat 100" },
        { en: "ping CUST-A 192.168.1.10", hi: "ping CUST-A 192.168.1.10" },
        { en: "ping vrf CUST-A 192.168.1.10", hi: "ping vrf CUST-A 192.168.1.10" },
        { en: "show ip route 192.168.1.10", hi: "show ip route 192.168.1.10" },
      ],
      answer: 2,
      explain: {
        en: "A plain ping uses the global routing table, which does not contain CUST-A's subnet. `ping vrf CUST-A` uses the VRF's own table. Repeating the plain ping changes nothing, `ping CUST-A` is not valid syntax, and `show ip route` does not test reachability.",
        hi: "Plain ping global routing table use karta hai, jisme CUST-A ka subnet hai hi nahi. `ping vrf CUST-A` VRF ki apni table use karta hai. Plain ping ko repeat karne se kuch nahi badlega, `ping CUST-A` valid syntax nahi hai, aur `show ip route` reachability test nahi karta.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A company rents virtual machines from a cloud provider, then installs, patches and runs its own Linux OS and applications on them. Which service model is this?",
        hi: "Ek company cloud provider se virtual machines rent karti hai, phir un par apna Linux OS aur applications khud install, patch aur run karti hai. Yeh kaunsa service model hai?",
      },
      options: [
        { en: "IaaS", hi: "IaaS" },
        { en: "PaaS", hi: "PaaS" },
        { en: "SaaS", hi: "SaaS" },
        { en: "Community cloud", hi: "Community cloud" },
      ],
      answer: 0,
      explain: {
        en: "Renting VMs and managing everything from the OS upward is Infrastructure as a Service. With PaaS the provider would manage the OS, and with SaaS the application too. Community cloud is a deployment model, not a service model.",
        hi: "VMs rent karna aur OS se upar sab khud manage karna Infrastructure as a Service hai. PaaS mein OS provider manage karta, aur SaaS mein application bhi. Community cloud deployment model hai, service model nahi.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "_S3greGajJA",
      title: "Free CCNA | Virtualization & Cloud | Day 54 (part 1)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Hypervisors, virtual switches and cloud characteristics, service and deployment models. Part 2 of Day 54 covers containers.",
        hi: "Hypervisors, virtual switches aur cloud characteristics, service aur deployment models. Day 54 ka part 2 containers cover karta hai.",
      },
    },
    {
      id: "Ge4644KUvh4",
      title: "Free CCNA | VRF | Day 54 (part 3)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "VRFs with a live IOS demo of overlapping addresses on one router.",
        hi: "VRFs, ek router par overlapping addresses ke live IOS demo ke saath.",
      },
    },
    {
      id: "1Pmn3tEZTCw",
      title: "Lec-18 : Virtual Machine vs Containers | Cloud Computing",
      channel: "Gate Smashers",
      lang: "hi",
      note: {
        en: "A short Hindi comparison of VMs and containers.",
        hi: "VMs aur containers ka chhota Hindi comparison.",
      },
    },
    {
      id: "pKKW3JLnqZ8",
      title: "175. CCNA 200-301 Full Course in Hindi 2024 | VRF - Virtual Routing & Forwarding",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "VRF concepts in Hindi, from the CCNA course.",
        hi: "CCNA course se VRF concepts, Hindi mein.",
      },
    },
  ],
  lab: {
    title: { en: "Run a VM on your own laptop", hi: "Apne laptop par VM chalao" },
    steps: [
      {
        en: "Install Oracle VirtualBox, a free type 2 hypervisor, and create a VM from an Ubuntu Linux ISO with 2 GB of RAM and one network adapter.",
        hi: "Oracle VirtualBox install karo, jo free type 2 hypervisor hai, aur Ubuntu Linux ISO se 2 GB RAM aur ek network adapter wala VM banao.",
      },
      {
        en: "Before starting it, open the VM's network settings and note the default attachment mode, NAT: the VM hides behind your laptop's own IP address.",
        hi: "Start karne se pehle VM ki network settings kholo aur default attachment mode note karo, NAT: VM tumhare laptop ke apne IP address ke peeche chhupa rehta hai.",
      },
      {
        en: "Start the VM and run `ip addr` in a terminal. With NAT you will usually see `10.0.2.15`, an address that exists only inside VirtualBox.",
        hi: "VM start karo aur terminal mein `ip addr` chalao. NAT mein aam taur par `10.0.2.15` dikhega, jo address sirf VirtualBox ke andar exist karta hai.",
      },
      {
        en: "Shut the VM down, change the adapter to Bridged Adapter, start it again and run `ip addr`. It now gets an address from your home or lab router's DHCP, like any other device on the LAN: VirtualBox is bridging its vNIC onto your network.",
        hi: "VM shut down karo, adapter ko Bridged Adapter par badlo, dobara start karo aur `ip addr` chalao. Ab use tumhare ghar ya lab router ke DHCP se address milta hai, LAN ke kisi bhi device ki tarah: VirtualBox uske vNIC ko tumhare network par bridge kar raha hai.",
      },
      {
        en: "Optional, on a router in Cisco CML, GNS3 or real gear: configure the two VRFs from this lesson with `192.168.1.1/24` on both interfaces, then compare `show ip route` with `show ip route vrf CUST-A`.",
        hi: "Optional, Cisco CML, GNS3 ya real gear ke router par: is lesson ke do VRFs configure karo, dono interfaces par `192.168.1.1/24` ke saath, phir `show ip route` aur `show ip route vrf CUST-A` compare karo.",
      },
    ],
  },
};

export default lesson;
