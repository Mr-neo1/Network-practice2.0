import type { TopologyScene } from "../types.ts";

// Colours: purple = control connections (DTLS, OMP, NETCONF), blue = user data (voice),
// teal = BFD probes, gray = bulk data.
const tunnelCols = ["Remote", "Color", "State"];
const slaCols = ["Color", "Loss / Lat / Jit", "Voice SLA", "Bulk SLA"];

const scene: TopologyScene = {
  kind: "topology",
  id: "sd-wan-sd-access",
  title: { en: "Catalyst SD-WAN: controllers, overlay tunnels and application-aware routing", hi: "Catalyst SD-WAN: controllers, overlay tunnels aur application-aware routing" },
  height: 480,
  nodes: [
    { id: "validator", kind: "controller", x: 250, y: 65, label: "Validator", sub: "ex-vBond" },
    { id: "controller", kind: "controller", x: 400, y: 65, label: "Controller", sub: "ex-vSmart" },
    { id: "manager", kind: "controller", x: 550, y: 65, label: "SD-WAN Mgr", sub: "ex-vManage" },
    { id: "inet", kind: "internet", x: 400, y: 215, label: "Internet" },
    { id: "mpls", kind: "cloud", x: 400, y: 385, label: "MPLS" },
    { id: "phone", kind: "ipphone", x: 75, y: 215, label: "IP phone", sub: "10.1.10.20" },
    { id: "br1", kind: "router", x: 200, y: 215, label: "BR1-Edge", sub: "site 101", sub2: "10.1.0.0/16" },
    { id: "br2", kind: "router", x: 200, y: 385, label: "BR2-Edge", sub: "site 102", sub2: "10.2.0.0/16" },
    { id: "dc", kind: "router", x: 600, y: 300, label: "DC-Edge", sub: "site 200", sub2: "10.0.0.0/16" },
    { id: "server", kind: "server", x: 725, y: 300, label: "Call server", sub: "10.0.20.10" },
  ],
  links: [
    { id: "l-ph", a: "phone", b: "br1" },
    { id: "l-b1i", a: "br1", b: "inet", aPort: "Gi0/0/0", label: "biz-internet" },
    { id: "l-b1m", a: "br1", b: "mpls", aPort: "Gi0/0/1" },
    { id: "l-b2i", a: "br2", b: "inet", aPort: "Gi0/0/0" },
    { id: "l-b2m", a: "br2", b: "mpls", aPort: "Gi0/0/1", label: "mpls" },
    { id: "l-dci", a: "dc", b: "inet", aPort: "Gi0/0/0" },
    { id: "l-dcm", a: "dc", b: "mpls", aPort: "Gi0/0/1" },
    { id: "l-srv", a: "dc", b: "server" },
    { id: "l-vi", a: "validator", b: "inet" },
    { id: "l-ci", a: "controller", b: "inet" },
    { id: "l-mi", a: "manager", b: "inet" },
  ],
  steps: [
    {
      title: { en: "Three sites, two transports", hi: "Teen sites, do transports" },
      text: {
        en: "BR1, BR2 and the data centre each have a WAN Edge router with two circuits: MPLS (colour `mpls`) and a business internet line (colour `biz-internet`). The three controllers at the top are reachable over the internet. No overlay tunnels exist yet.",
        hi: "BR1, BR2 aur data centre, teeno ke paas ek WAN Edge router hai jisme do circuits hain: MPLS (colour `mpls`) aur business internet line (colour `biz-internet`). Upar ke teen controllers internet se reachable hain. Abhi koi overlay tunnel nahi bana hai.",
      },
      focus: ["br1", "br2", "dc"],
    },
    {
      title: { en: "Zero-touch: BR2 finds the Validator", hi: "Zero-touch: BR2 Validator dhoondhta hai" },
      text: {
        en: "BR2-Edge arrived with no configuration. It gets an address by DHCP on its internet port, learns the Validator's address from Cisco's Plug and Play cloud, and opens a DTLS connection to it. The Validator checks its serial number and certificate against the authorised device list and replies with the Controller and Manager addresses.",
        hi: "BR2-Edge bina kisi configuration ke aaya hai. Woh internet port par DHCP se address leta hai, Cisco ke Plug and Play cloud se Validator ka address seekhta hai, aur usse DTLS connection kholta hai. Validator uska serial number aur certificate authorised device list se match karta hai, aur reply mein Controller aur Manager ke addresses deta hai.",
      },
      focus: ["br2", "validator"],
      packets: [
        { path: ["br2", "inet", "validator"], label: "DTLS: auth", tone: "purple" },
        { path: ["validator", "inet", "br2"], label: "Ctrl + Mgr list", tone: "purple", delay: 2 },
      ],
      badges: [{ node: "br2", text: "authenticated", tone: "green" }],
    },
    {
      title: { en: "The Manager pushes BR2's configuration", hi: "Manager BR2 ka configuration push karta hai" },
      text: {
        en: "BR2 connects to SD-WAN Manager, which recognises its serial number and pushes the configuration prepared for it: system IP `10.255.0.2`, site ID 102, both transport interfaces and the LAN. Nobody typed anything at the branch.",
        hi: "BR2 SD-WAN Manager se connect karta hai. Manager uska serial number pehchaan kar uske liye ready rakha configuration push karta hai: system IP `10.255.0.2`, site ID 102, dono transport interfaces aur LAN. Branch par kisi ne kuch type nahi kiya.",
      },
      focus: ["br2", "manager"],
      packets: [
        { path: ["br2", "inet", "manager"], label: "DTLS: hello", tone: "purple" },
        { path: ["manager", "inet", "br2"], label: "Config", tone: "purple", delay: 2 },
      ],
      badges: [{ node: "br2", text: "configured", tone: "green" }],
    },
    {
      title: { en: "Every edge reports to the Controller", hi: "Har edge Controller ko report karta hai" },
      text: {
        en: "Each WAN Edge holds a DTLS connection to the Controller and runs OMP over it. In OMP updates it advertises its LAN prefixes, its TLOCs (system IP + colour + encapsulation, one per transport) and its IPsec keys. The Controller now knows every site and every way to reach it.",
        hi: "Har WAN Edge Controller ke saath DTLS connection rakhta hai aur uske upar OMP chalata hai. OMP updates mein woh apne LAN prefixes, apne TLOCs (system IP + colour + encapsulation, har transport ka ek) aur apni IPsec keys advertise karta hai. Ab Controller ko har site aur use reach karne ke saare raaste pata hain.",
      },
      focus: ["controller"],
      badges: [{ node: "br2", text: "" }],
      packets: [
        { path: ["br1", "inet", "controller"], label: "OMP update", tone: "purple" },
        { path: ["br2", "inet", "controller"], label: "OMP update", tone: "purple" },
        { path: ["dc", "inet", "controller"], label: "OMP update", tone: "purple" },
      ],
      tables: [
        {
          node: "controller",
          title: "Controller OMP routes",
          columns: ["Prefix", "Site", "TLOC colors"],
          rows: [
            ["10.1.0.0/16", "101", "mpls, biz-internet"],
            ["10.2.0.0/16", "102", "mpls, biz-internet"],
            ["10.0.0.0/16", "200", "mpls, biz-internet"],
          ],
          hl: [0, 1, 2],
        },
      ],
    },
    {
      title: { en: "Routes reflected, IPsec tunnels come up", hi: "Routes reflect hote hain, IPsec tunnels up" },
      text: {
        en: "The Controller sends each edge the other sites' prefixes, TLOCs and keys. Each edge then builds IPsec tunnels straight to the remote TLOCs, MPLS to MPLS and internet to internet (MPLS cannot reach the internet here), and runs BFD inside each one. User data never passes through a controller.",
        hi: "Controller har edge ko baaki sites ke prefixes, TLOCs aur keys bhejta hai. Phir har edge remote TLOCs tak seedha IPsec tunnels banata hai, MPLS se MPLS aur internet se internet (yahan MPLS internet tak nahi pahunch sakta), aur har tunnel ke andar BFD chalata hai. User data kabhi controller se hokar nahi jaata.",
      },
      packets: [
        { path: ["controller", "inet", "br1"], label: "OMP routes", tone: "purple" },
        { path: ["controller", "inet", "br2"], label: "OMP routes", tone: "purple" },
        { path: ["controller", "inet", "dc"], label: "OMP routes", tone: "purple" },
      ],
      links: [
        { id: "l-b1i", state: "active" },
        { id: "l-b1m", state: "active" },
        { id: "l-b2i", state: "active" },
        { id: "l-b2m", state: "active" },
        { id: "l-dci", state: "active" },
        { id: "l-dcm", state: "active" },
      ],
      tables: [
        {
          node: "br1",
          title: "BR1 IPsec tunnels",
          columns: tunnelCols,
          rows: [
            ["DC 10.255.0.10", "mpls", "up"],
            ["DC 10.255.0.10", "biz-internet", "up"],
            ["BR2 10.255.0.2", "mpls", "up"],
            ["BR2 10.255.0.2", "biz-internet", "up"],
          ],
          hl: [0, 1, 2, 3],
        },
      ],
    },
    {
      title: { en: "One policy, written once, reaches every edge", hi: "Ek policy, ek baar likhi, har edge tak pahunchi" },
      text: {
        en: "In SD-WAN Manager the admin defines a voice SLA class (loss 1%, latency 150 ms, jitter 30 ms) and an application-aware routing policy: voice (DSCP 46) prefers `biz-internet`, because BR1's MPLS circuit is only 20 Mbps. A second rule gives all other traffic a loose bulk class (loss 10%), also preferring `biz-internet`. The Manager hands the policy to the Controller, which sends it to the edges over OMP.",
        hi: "SD-WAN Manager mein admin ek voice SLA class define karta hai (loss 1%, latency 150 ms, jitter 30 ms) aur ek application-aware routing policy: voice (DSCP 46) `biz-internet` prefer kare, kyunki BR1 ka MPLS circuit sirf 20 Mbps ka hai. Doosra rule baaki saare traffic ko ek dheeli bulk class (loss 10%) deta hai, woh bhi `biz-internet` prefer karti hai. Manager policy Controller ko deta hai, aur Controller use OMP se edges tak bhejta hai.",
      },
      focus: ["manager", "controller"],
      packets: [
        { path: ["manager", "inet", "controller"], label: "AAR policy", tone: "purple" },
        { path: ["controller", "inet", "br1"], label: "AAR policy", tone: "purple", delay: 2 },
        { path: ["controller", "inet", "br2"], label: "AAR policy", tone: "purple", delay: 2 },
        { path: ["controller", "inet", "dc"], label: "AAR policy", tone: "purple", delay: 2 },
      ],
      tables: [
        { node: "br1", title: "BR1 IPsec tunnels", columns: tunnelCols, rows: [] },
        {
          node: "manager",
          title: "SLA class: voice",
          columns: ["Metric", "Must stay within"],
          rows: [
            ["Loss", "1%"],
            ["Latency", "150 ms"],
            ["Jitter", "30 ms"],
            ["Preferred color", "biz-internet"],
          ],
          hl: [0, 1, 2, 3],
        },
      ],
    },
    {
      title: { en: "A call runs over the internet tunnel", hi: "Call internet tunnel par chalti hai" },
      text: {
        en: "The phone at 10.1.10.20 calls the call server at 10.0.20.10. Both tunnels to the DC meet the voice SLA, so BR1 uses the preferred colour: the voice packets ride the `biz-internet` IPsec tunnel to DC-Edge. BFD keeps measuring both tunnels every second.",
        hi: "10.1.10.20 wala phone 10.0.20.10 par call server ko call karta hai. DC tak ke dono tunnels voice SLA meet karte hain, isliye BR1 preferred colour use karta hai: voice packets `biz-internet` IPsec tunnel se DC-Edge tak jaate hain. BFD dono tunnels ko har second measure karta rehta hai.",
      },
      focus: ["phone", "server"],
      packets: [
        { path: ["phone", "br1", "inet", "dc", "server"], label: "RTP voice", tone: "blue" },
        { path: ["server", "dc", "inet", "br1", "phone"], label: "RTP voice", tone: "blue", delay: 1 },
      ],
      tables: [
        { node: "manager", title: "SLA class: voice", columns: ["Metric", "Must stay within"], rows: [] },
        {
          node: "br1",
          title: "BR1 → DC tunnel health",
          columns: slaCols,
          rows: [
            ["mpls", "0% / 33 ms / 2 ms", "met", "met"],
            ["biz-internet", "0.1% / 28 ms / 4 ms", "met", "met"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "Internet loss climbs past the SLA", hi: "Internet loss SLA ke paar chala jaata hai" },
      text: {
        en: "The ISP's network starts dropping packets. BFD probes inside the `biz-internet` tunnel show 4% loss and 18 ms jitter. Jitter is still fine, but 4% is above the 1% limit, so that tunnel no longer meets the voice SLA. It still meets the loose bulk class (10%), and the MPLS tunnel meets both.",
        hi: "ISP ka network packets drop karne lagta hai. `biz-internet` tunnel ke andar BFD probes 4% loss aur 18 ms jitter dikhate hain. Jitter abhi bhi theek hai, lekin 4% loss 1% limit se zyada hai, isliye yeh tunnel ab voice SLA meet nahi karta. Dheeli bulk class (10%) yeh ab bhi meet karta hai, aur MPLS tunnel dono meet karta hai.",
      },
      focus: ["br1"],
      packets: [
        { path: ["br1", "inet", "dc"], label: "BFD probe", tone: "teal" },
        { path: ["dc", "inet", "br1"], label: "BFD probe", tone: "teal", delay: 2 },
      ],
      links: [{ id: "l-b1i", state: "active", note: "loss 4%" }],
      badges: [{ node: "br1", text: "SLA miss", tone: "red" }],
      tables: [
        {
          node: "br1",
          title: "BR1 → DC tunnel health",
          columns: slaCols,
          rows: [
            ["mpls", "0% / 33 ms / 2 ms", "met", "met"],
            ["biz-internet", "4% / 45 ms / 18 ms", "violated", "met"],
          ],
          hl: [1],
        },
      ],
    },
    {
      title: { en: "Voice moves to MPLS; bulk data stays", hi: "Voice MPLS par shift; bulk data wahin" },
      text: {
        en: "BR1 moves new voice packets to the MPLS tunnel, the only path that meets the SLA. DC-Edge measures the same tunnel, sees the same loss and moves the return voice too. Bulk traffic's loose class allows 10% loss, so 4% still meets it and bulk stays on the internet, keeping the small MPLS circuit free for voice. No routing protocol reconverged and no one logged in.",
        hi: "BR1 naye voice packets MPLS tunnel par bhej deta hai, kyunki sirf wahi path SLA meet karta hai. DC-Edge bhi same tunnel measure karta hai, same loss dekhta hai aur return voice bhi shift kar deta hai. Bulk traffic ki dheeli class 10% loss tak allow karti hai, toh 4% par bhi woh meet hoti hai aur bulk internet par hi rehta hai, jisse chhota MPLS circuit voice ke liye khaali rehta hai. Koi routing protocol reconverge nahi hua aur kisi ne login nahi kiya.",
      },
      focus: ["br1", "dc"],
      packets: [
        { path: ["phone", "br1", "mpls", "dc", "server"], label: "RTP voice", tone: "blue" },
        { path: ["server", "dc", "mpls", "br1", "phone"], label: "RTP voice", tone: "blue", delay: 1 },
        { path: ["br1", "inet", "dc"], label: "Bulk data", tone: "gray" },
      ],
      links: [{ id: "l-b1m", state: "active", note: "voice" }],
      badges: [{ node: "br1", text: "voice → mpls", tone: "green" }],
      tables: [
        {
          node: "br1",
          title: "BR1 app-route decision",
          columns: ["Traffic", "Path to DC"],
          rows: [
            ["Voice (DSCP 46)", "mpls"],
            ["Bulk (all other)", "biz-internet"],
          ],
          hl: [0],
        },
      ],
    },
  ],
};

export default scene;
