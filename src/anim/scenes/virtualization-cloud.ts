import type { LayersScene } from "../types.ts";

// Server virtualization -> type 2 -> virtual switch -> containers -> VRFs -> cloud service models.
// Host ESXi1: VM1 web 10.10.10.11 (VLAN 10), VM2 database 10.10.20.12 (VLAN 20), VM3 mail 10.10.10.13 (VLAN 10),
// uplinked to SW1 Gi1/0/10 (802.1Q trunk). R1: Gi0/0 in VRF CUST-A, Gi0/1 in VRF CUST-B, both 192.168.1.1/24.
// Tones: green = apps, blue = guest OS, purple = hypervisor / virtual switch, orange = host OS, gray = hardware,
// teal = containers, pink = container engine. VRF: blue = CUST-A, green = CUST-B, red = rejected.
// Cloud step: blue = you manage, gray = provider manages.

const you = (id: string, label: string, w?: number) => ({ id, label, sub: "you", tone: "blue" as const, w });
const them = (id: string, label: string, w?: number) => ({ id, label, sub: "provider", tone: "gray" as const, w });

const scene: LayersScene = {
  kind: "layers",
  id: "virtualization-cloud",
  title: { en: "From one server per app to VMs, containers, VRFs and cloud", hi: "Har app ke liye ek server se VMs, containers, VRFs aur cloud tak" },
  steps: [
    {
      title: { en: "Before: one app per physical server", hi: "Pehle: har app ke liye ek physical server" },
      text: {
        en: "Two applications that must be kept apart used to mean two physical servers, each with its own OS. Each box needs rack space, power, cooling and cabling, yet its CPU and memory sit mostly unused.",
        hi: "Do applications jinhe alag rakhna zaroori ho, pehle unka matlab tha do physical servers, har ek ka apna OS. Har box ko rack space, power, cooling aur cabling chahiye, lekin zyadatar time uska CPU aur memory khaali pade rehte hain.",
      },
      rows: [
        {
          label: "App",
          blocks: [
            { id: "app-web", label: "Web app", tone: "green" },
            { id: "app-db", label: "Database", tone: "green" },
          ],
        },
        {
          label: "OS",
          blocks: [
            { id: "os-web", label: "Linux", sub: "owns the whole server", tone: "blue" },
            { id: "os-db", label: "Windows Server", sub: "owns the whole server", tone: "blue" },
          ],
        },
        {
          label: "Hardware",
          blocks: [
            { id: "hw1", label: "Server 1", sub: "CPU mostly idle", tone: "gray" },
            { id: "hw2", label: "Server 2", sub: "CPU mostly idle", tone: "gray" },
          ],
        },
      ],
    },
    {
      title: { en: "A type 1 hypervisor shares one server", hi: "Type 1 hypervisor ek server share karta hai" },
      text: {
        en: "The hypervisor runs directly on the hardware (bare metal) and divides the CPU, memory, disk and network among virtual machines. Each VM has its own guest OS and cannot see the others, so three isolated servers now share one box, and a fourth VM takes minutes to create instead of weeks to buy.",
        hi: "Hypervisor seedha hardware par (bare metal) chalta hai aur CPU, memory, disk aur network ko virtual machines mein baant deta hai. Har VM ka apna guest OS hai aur woh doosre VMs ko dekh nahi sakta, isliye teen isolated servers ab ek hi box share karte hain, aur chautha VM kharidne mein hafte nahi, banane mein minute lagte hain.",
      },
      focus: ["hv1"],
      rows: [
        {
          label: "App",
          blocks: [
            { id: "app-web", label: "Web app", tone: "green" },
            { id: "app-db", label: "Database", tone: "green" },
            { id: "app-mail", label: "Mail", tone: "green" },
          ],
        },
        {
          label: "Guest OS",
          blocks: [
            { id: "os-web", label: "Linux", sub: "VM1", tone: "blue" },
            { id: "os-db", label: "Windows Server", sub: "VM2", tone: "blue" },
            { id: "os-mail", label: "Linux", sub: "VM3", tone: "blue" },
          ],
        },
        { label: "Hypervisor", blocks: [{ id: "hv1", label: "Type 1 hypervisor", sub: "ESXi, Hyper-V or KVM", tone: "purple" }] },
        { label: "Hardware", blocks: [{ id: "hw1", label: "Server hardware", sub: "CPU · RAM · disk · NIC", tone: "gray" }] },
      ],
    },
    {
      title: { en: "A type 2 hypervisor runs on top of an OS", hi: "Type 2 hypervisor ek OS ke upar chalta hai" },
      text: {
        en: "On a laptop, a type 2 hypervisor such as Oracle VirtualBox or VMware Workstation runs as an ordinary application on the host OS. The extra host OS layer costs some performance, so type 2 is used for labs and testing, while data centers run type 1.",
        hi: "Laptop par Oracle VirtualBox ya VMware Workstation jaisa type 2 hypervisor host OS par ek normal application ki tarah chalta hai. Beech mein host OS ki extra layer thodi performance kha jaati hai, isliye type 2 labs aur testing ke liye use hota hai, jabki data centers type 1 chalate hain.",
      },
      focus: ["hv2", "host-win"],
      rows: [
        { label: "App", blocks: [{ id: "app-lab", label: "Lab tools", sub: "e.g. Wireshark, Python", tone: "green" }] },
        { label: "Guest OS", blocks: [{ id: "os-guest", label: "Ubuntu Linux", sub: "guest VM", tone: "blue" }] },
        { label: "Hypervisor", blocks: [{ id: "hv2", label: "Type 2 hypervisor", sub: "VirtualBox, Workstation", tone: "purple" }] },
        { label: "Host OS", blocks: [{ id: "host-win", label: "Windows 11", sub: "host OS, runs your apps too", tone: "orange" }] },
        { label: "Hardware", blocks: [{ id: "hw-laptop", label: "Your laptop", tone: "gray" }] },
      ],
    },
    {
      title: { en: "VMs connect through a virtual switch", hi: "VMs virtual switch se connect hote hain" },
      text: {
        en: "Each VM's virtual NIC plugs into a virtual switch inside the hypervisor. VM1 and VM3 are both in VLAN 10, so frames between them are switched inside the server and never reach SW1. VM2's traffic leaves through the physical NIC tagged VLAN 20, which is why SW1's port to the server is a trunk.",
        hi: "Har VM ka virtual NIC hypervisor ke andar ek virtual switch mein laga hota hai. VM1 aur VM3 dono VLAN 10 mein hain, isliye unke beech ke frames server ke andar hi switch ho jaate hain aur SW1 tak kabhi nahi pahunchte. VM2 ka traffic VLAN 20 ke tag ke saath physical NIC se bahar jaata hai, isiliye SW1 ka server wala port trunk hota hai.",
      },
      focus: ["vm1", "vm3", "vsw"],
      rows: [
        {
          label: "VMs",
          blocks: [
            { id: "vm1", label: "VM1 · web", sub: "VLAN 10 · 10.10.10.11", tone: "green" },
            { id: "vm2", label: "VM2 · database", sub: "VLAN 20 · 10.10.20.12", tone: "orange" },
            { id: "vm3", label: "VM3 · mail", sub: "VLAN 10 · 10.10.10.13", tone: "green" },
          ],
        },
        { label: "Virtual switch", blocks: [{ id: "vsw", label: "Virtual switch", sub: "switches frames, tags VLANs", tone: "purple" }] },
        { label: "Physical NIC", blocks: [{ id: "pnic", label: "Server NIC", sub: "uplink to SW1 Gi1/0/10", tone: "gray" }] },
        { label: "Physical switch", blocks: [{ id: "sw1", label: "SW1 Gi1/0/10", sub: "802.1Q trunk: VLAN 10, 20", tone: "blue" }] },
      ],
    },
    {
      title: { en: "Containers share one kernel", hi: "Containers ek hi kernel share karte hain" },
      text: {
        en: "A container packages one app with its libraries but no OS kernel of its own. All containers use the host's single Linux kernel through a container engine such as Docker. With no guest OS to boot, a container is megabytes instead of gigabytes and starts in seconds, so one server runs many more containers than VMs.",
        hi: "Container ek app ko uski libraries ke saath pack karta hai, lekin uska apna OS kernel nahi hota. Saare containers Docker jaise container engine ke through host ka ek hi Linux kernel use karte hain. Boot karne ke liye koi guest OS nahi, isliye container gigabytes ki jagah megabytes ka hota hai aur seconds mein start hota hai, toh ek server par VMs se kahin zyada containers chalte hain.",
      },
      focus: ["engine", "host-linux"],
      rows: [
        {
          label: "Containers",
          blocks: [
            { id: "c-web", label: "web", sub: "app + libraries", tone: "teal" },
            { id: "c-web2", label: "web (copy 2)", sub: "app + libraries", tone: "teal" },
            { id: "c-api", label: "api", sub: "app + libraries", tone: "teal" },
            { id: "c-cache", label: "cache", sub: "app + libraries", tone: "teal" },
          ],
        },
        { label: "Engine", blocks: [{ id: "engine", label: "Container engine", sub: "e.g. Docker Engine", tone: "pink" }] },
        { label: "Host OS", blocks: [{ id: "host-linux", label: "Linux host OS", sub: "one kernel, shared by all", tone: "orange" }] },
        { label: "Hardware", blocks: [{ id: "hw1", label: "Server hardware", sub: "CPU · RAM · disk · NIC", tone: "gray" }] },
      ],
    },
    {
      title: { en: "VM vs container: what each one carries", hi: "VM vs container: kaun kya saath le jaata hai" },
      text: {
        en: "A VM carries a full guest OS: strong isolation and any OS you like, at the cost of gigabytes and a boot time of minutes. A container carries only the app and its libraries, so it is small and fast, but every container depends on the one shared kernel. Orchestrators such as Kubernetes start, scale and restart containers across many hosts.",
        hi: "VM apne saath poora guest OS le jaata hai: strong isolation aur koi bhi OS, lekin gigabytes ka size aur minutes ka boot time. Container sirf app aur uski libraries le jaata hai, isliye chhota aur fast hai, lekin har container usi ek shared kernel par depend karta hai. Kubernetes jaise orchestrators kai hosts par containers ko start, scale aur restart karte hain.",
      },
      focus: ["vmx-os", "ctx-kern"],
      rows: [
        {
          label: "VM",
          blocks: [
            { id: "vmx-app", label: "App", tone: "green" },
            { id: "vmx-lib", label: "Libraries", tone: "green" },
            { id: "vmx-os", label: "Guest OS + kernel", sub: "GBs, boots in minutes", tone: "blue", w: 1.6 },
          ],
        },
        {
          label: "Container",
          blocks: [
            { id: "ctx-app", label: "App", tone: "teal" },
            { id: "ctx-lib", label: "Libraries", tone: "teal" },
            { id: "ctx-kern", label: "No OS of its own", sub: "uses the host kernel", tone: "gray", w: 1.6 },
          ],
        },
      ],
    },
    {
      title: { en: "One routing table: overlapping subnets clash", hi: "Ek routing table: overlapping subnets takraate hain" },
      text: {
        en: "R1 connects two customers, and both use 192.168.1.0/24. With a single routing table, IOS rejects the second address with `% 192.168.1.0 overlaps with GigabitEthernet0/0`, because one table cannot send the same subnet out of two interfaces. Even without an overlap, the two customers could reach each other through R1.",
        hi: "R1 do customers ko connect karta hai, aur dono 192.168.1.0/24 use karte hain. Ek hi routing table ho toh IOS doosra address `% 192.168.1.0 overlaps with GigabitEthernet0/0` bol kar reject kar deta hai, kyunki ek table same subnet ko do interfaces se nahi bhej sakti. Aur overlap na bhi ho, tab bhi dono customers R1 ke through ek doosre tak pahunch sakte.",
      },
      focus: ["if-b"],
      rows: [
        {
          label: "Interfaces",
          blocks: [
            { id: "if-a", label: "Gi0/0 · Customer A", sub: "192.168.1.1/24 accepted", tone: "blue" },
            { id: "if-b", label: "Gi0/1 · Customer B", sub: "192.168.1.1/24 rejected", tone: "red" },
          ],
        },
        { label: "Routing table", blocks: [{ id: "rt-g", label: "Global table", sub: "C 192.168.1.0/24 Gi0/0", tone: "gray" }] },
        { label: "Router", blocks: [{ id: "r1", label: "R1", sub: "one physical router", tone: "gray" }] },
      ],
    },
    {
      title: { en: "VRFs: one router, two routing tables", hi: "VRFs: ek router, do routing tables" },
      text: {
        en: "Now Gi0/0 belongs to VRF CUST-A and Gi0/1 to VRF CUST-B. Each VRF has its own routing table, so the same subnet fits in both and IOS accepts the address. A packet arriving on Gi0/1 is looked up only in the CUST-B table, so customer B can never reach customer A.",
        hi: "Ab Gi0/0 VRF CUST-A mein hai aur Gi0/1 VRF CUST-B mein. Har VRF ki apni routing table hai, isliye same subnet dono mein fit ho jaata hai aur IOS address accept kar leta hai. Gi0/1 par aane wala packet sirf CUST-B table mein lookup hota hai, isliye customer B kabhi customer A tak nahi pahunch sakta.",
      },
      focus: ["rt-a", "rt-b"],
      rows: [
        {
          label: "VRF CUST-A",
          blocks: [
            { id: "if-a", label: "Gi0/0", sub: "192.168.1.1/24", tone: "blue" },
            { id: "rt-a", label: "CUST-A table", sub: "C 192.168.1.0/24 Gi0/0", tone: "blue", w: 1.6 },
          ],
        },
        {
          label: "VRF CUST-B",
          blocks: [
            { id: "if-b", label: "Gi0/1", sub: "192.168.1.1/24", tone: "green" },
            { id: "rt-b", label: "CUST-B table", sub: "C 192.168.1.0/24 Gi0/1", tone: "green", w: 1.6 },
          ],
        },
        { label: "Router", blocks: [{ id: "r1", label: "R1", sub: "one physical router", tone: "gray" }] },
      ],
    },
    {
      title: { en: "Cloud: who manages each layer", hi: "Cloud: kaunsi layer kaun manage karta hai" },
      text: {
        en: "Cloud providers sell the same stack as a service. Blue is what you manage and gray is what the provider manages: on-premises you run everything, with IaaS you rent VMs and manage the OS upward, with PaaS you bring only your app and data, and with SaaS you use the provider's application and look after only your own data and users.",
        hi: "Cloud providers yahi stack service ke roop mein bechte hain. Blue woh hai jo tum manage karte ho, gray woh jo provider manage karta hai: on-premises mein sab kuch tum chalate ho, IaaS mein VMs rent karte ho aur OS se upar sab tum manage karte ho, PaaS mein sirf apna app aur data laate ho, aur SaaS mein provider ki application use karte ho aur sirf apna data aur users sambhalte ho.",
      },
      rows: [
        {
          label: "On-premises",
          blocks: [you("op-data", "Data"), you("op-app", "Apps"), you("op-rt", "Runtime"), you("op-os", "OS"), you("op-virt", "Virtualization", 1.5), you("op-hw", "Hardware & network", 1.5)],
        },
        {
          label: "IaaS",
          blocks: [you("ia-data", "Data"), you("ia-app", "Apps"), you("ia-rt", "Runtime"), you("ia-os", "OS"), them("ia-virt", "Virtualization", 1.5), them("ia-hw", "Hardware & network", 1.5)],
        },
        {
          label: "PaaS",
          blocks: [you("pa-data", "Data"), you("pa-app", "Apps"), them("pa-rt", "Runtime"), them("pa-os", "OS"), them("pa-virt", "Virtualization", 1.5), them("pa-hw", "Hardware & network", 1.5)],
        },
        {
          label: "SaaS",
          blocks: [you("sa-data", "Data"), them("sa-app", "Apps"), them("sa-rt", "Runtime"), them("sa-os", "OS"), them("sa-virt", "Virtualization", 1.5), them("sa-hw", "Hardware & network", 1.5)],
        },
      ],
    },
  ],
};

export default scene;
