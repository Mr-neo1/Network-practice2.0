import type { LayersScene } from "../types.ts";

// Same names and addresses as the lesson: Catalyst Center 10.10.0.5, SW1 10.10.0.11.
// Fabric: Edge-1 Lo0 10.255.0.1, Edge-2 Lo0 10.255.0.2, PC-A 10.50.1.10, PC-B 10.50.1.20.
// Tones: purple = control, blue = data plane, teal = northbound / apps, orange = southbound, green = overlay, gray = underlay.
const scene: LayersScene = {
  kind: "layers",
  id: "sdn",
  title: { en: "From box-by-box control to a controller, then overlay over underlay", hi: "Box-by-box control se controller tak, phir underlay ke upar overlay" },
  stack: ["Application", "Northbound API", "Controller", "Southbound API", "Infrastructure"],
  steps: [
    {
      title: { en: "Traditional: each device decides alone", hi: "Traditional: har device akela decide karta hai" },
      text: {
        en: "R1, R2 and R3 each run their own OSPF, build their own routing table and are configured one by one over SSH. Control is distributed: every box holds a piece of the network's logic.",
        hi: "R1, R2 aur R3 har ek apna OSPF chalata hai, apna routing table banata hai, aur SSH se ek-ek karke configure hota hai. Control distributed hai: har box ke paas network ke logic ka ek tukda hai.",
      },
      rows: [
        {
          label: "R1",
          blocks: [
            { id: "m1", label: "Management", sub: "CLI over SSH", tone: "gray" },
            { id: "c1", label: "Control plane", sub: "own OSPF, own RIB", tone: "purple" },
            { id: "d1", label: "Data plane", sub: "forwards packets", tone: "blue" },
          ],
        },
        {
          label: "R2",
          blocks: [
            { id: "m2", label: "Management", sub: "CLI over SSH", tone: "gray" },
            { id: "c2", label: "Control plane", sub: "own OSPF, own RIB", tone: "purple" },
            { id: "d2", label: "Data plane", sub: "forwards packets", tone: "blue" },
          ],
        },
        {
          label: "R3",
          blocks: [
            { id: "m3", label: "Management", sub: "CLI over SSH", tone: "gray" },
            { id: "c3", label: "Control plane", sub: "own OSPF, own RIB", tone: "purple" },
            { id: "d3", label: "Data plane", sub: "forwards packets", tone: "blue" },
          ],
        },
      ],
      focus: ["c1", "c2", "c3"],
    },
    {
      title: { en: "Controller-based: decisions move to the centre", hi: "Controller-based: decisions centre mein" },
      text: {
        en: "A controller takes over policy, management and, fully or partly, the control plane. The devices keep only what must happen at line rate: the data plane. This is the separation of control and data planes.",
        hi: "Controller policy, management aur poora ya kuch hissa control plane le leta hai. Devices ke paas sirf woh rehta hai jo line rate par hona zaroori hai: data plane. Yahi control aur data planes ka separation hai.",
      },
      stackActive: "Controller",
      rows: [
        { label: "Controller", blocks: [{ id: "ctrl", label: "SDN controller", sub: "central view, policy, logic", tone: "purple" }] },
        {
          label: "Devices",
          blocks: [
            { id: "d1", label: "Data plane", sub: "R1 forwards", tone: "blue" },
            { id: "d2", label: "Data plane", sub: "R2 forwards", tone: "blue" },
            { id: "d3", label: "Data plane", sub: "R3 forwards", tone: "blue" },
          ],
        },
      ],
      focus: ["ctrl"],
    },
    {
      title: { en: "The southbound interface reaches the devices", hi: "Southbound interface devices tak pahunchta hai" },
      text: {
        en: "Below the controller sits the southbound interface: the protocols it uses to program devices. OpenFlow writes flow entries, OpFlex sends policy (ACI), NETCONF and RESTCONF carry YANG data, and SSH and SNMP work with ordinary devices.",
        hi: "Controller ke neeche southbound interface hai: woh protocols jinse woh devices program karta hai. OpenFlow flow entries likhta hai, OpFlex policy bhejta hai (ACI), NETCONF aur RESTCONF YANG data le jaate hain, aur SSH aur SNMP normal devices ke saath kaam karte hain.",
      },
      stackActive: "Southbound API",
      rows: [
        { label: "Controller", blocks: [{ id: "ctrl", label: "SDN controller", sub: "central view, policy, logic", tone: "purple" }] },
        {
          label: "SBI",
          blocks: [
            { id: "of", label: "OpenFlow", sub: "flow entries", tone: "orange" },
            { id: "opf", label: "OpFlex", sub: "policy (ACI)", tone: "orange" },
            { id: "nc", label: "NETCONF", sub: "XML, SSH 830", tone: "orange" },
            { id: "rc", label: "RESTCONF", sub: "HTTPS, JSON/XML", tone: "orange" },
            { id: "ssh", label: "SSH / SNMP", sub: "CLI and polling", tone: "orange" },
          ],
        },
        {
          label: "Devices",
          blocks: [
            { id: "d1", label: "Data plane", sub: "R1 forwards", tone: "blue" },
            { id: "d2", label: "Data plane", sub: "R2 forwards", tone: "blue" },
            { id: "d3", label: "Data plane", sub: "R3 forwards", tone: "blue" },
          ],
        },
      ],
      focus: ["of", "opf", "nc", "rc", "ssh"],
    },
    {
      title: { en: "The northbound interface serves applications", hi: "Northbound interface applications ko serve karta hai" },
      text: {
        en: "Above the controller is the northbound interface, usually a REST API over HTTPS returning JSON. Applications sit on top: a monitoring dashboard, a ticketing system, your own Python script. None of them talk to a device directly.",
        hi: "Controller ke upar northbound interface hai, aam taur par HTTPS par REST API jo JSON return karti hai. Sabse upar applications hain: monitoring dashboard, ticketing system, tumhari apni Python script. Inme se koi bhi device se seedha baat nahi karta.",
      },
      stackActive: "Northbound API",
      rows: [
        {
          label: "Apps",
          blocks: [
            { id: "app1", label: "Monitoring", sub: "health dashboard", tone: "teal" },
            { id: "app2", label: "Ticketing", sub: "opens changes", tone: "teal" },
            { id: "app3", label: "Python script", sub: "your automation", tone: "teal" },
          ],
        },
        { label: "NBI", blocks: [{ id: "nbi", label: "REST API", sub: "HTTPS + JSON", tone: "teal" }] },
        { label: "Controller", blocks: [{ id: "ctrl", label: "SDN controller", sub: "central view, policy, logic", tone: "purple" }] },
        {
          label: "SBI",
          blocks: [
            { id: "of", label: "OpenFlow", sub: "flow entries", tone: "orange" },
            { id: "opf", label: "OpFlex", sub: "policy (ACI)", tone: "orange" },
            { id: "nc", label: "NETCONF", sub: "XML, SSH 830", tone: "orange" },
            { id: "rc", label: "RESTCONF", sub: "HTTPS, JSON/XML", tone: "orange" },
            { id: "ssh", label: "SSH / SNMP", sub: "CLI and polling", tone: "orange" },
          ],
        },
        {
          label: "Devices",
          blocks: [
            { id: "d1", label: "Data plane", sub: "R1 forwards", tone: "blue" },
            { id: "d2", label: "Data plane", sub: "R2 forwards", tone: "blue" },
            { id: "d3", label: "Data plane", sub: "R3 forwards", tone: "blue" },
          ],
        },
      ],
      focus: ["nbi", "app1", "app2", "app3"],
    },
    {
      title: { en: "An app calls the northbound API", hi: "App northbound API call karti hai" },
      text: {
        en: "The script sends `GET https://10.10.0.5/dna/intent/api/v1/network-device` to Catalyst Center. That is a northbound REST call. The controller answers from its own inventory in JSON, for example SW1 at 10.10.0.11, without logging in to any switch.",
        hi: "Script Catalyst Center ko `GET https://10.10.0.5/dna/intent/api/v1/network-device` bhejti hai. Yeh northbound REST call hai. Controller apni inventory se JSON mein jawab deta hai, jaise SW1 10.10.0.11 par, kisi switch par login kiye bina.",
      },
      stackActive: "Northbound API",
      rows: [
        { label: "App", blocks: [{ id: "app3", label: "Python script", sub: "wants the inventory", tone: "teal" }] },
        { label: "NBI", blocks: [{ id: "nbi", label: "GET network-device", sub: "HTTPS to 10.10.0.5", tone: "teal" }] },
        { label: "Controller", blocks: [{ id: "ctrl", label: "Catalyst Center", sub: "replies: SW1 10.10.0.11 ...", tone: "purple" }] },
      ],
      focus: ["app3", "nbi", "ctrl"],
    },
    {
      title: { en: "The controller pushes southbound", hi: "Controller southbound push karta hai" },
      text: {
        en: "Now the engineer enters an intent in Catalyst Center: guests may reach only the internet. The controller translates it into device config and pushes it southbound, NETCONF to SW1 and SSH to SW2, to every switch where guests connect. The switches then enforce it in their data planes.",
        hi: "Ab engineer Catalyst Center mein ek intent daalta hai: guests sirf internet tak ja sakte hain. Controller ise device config mein translate karta hai aur southbound push karta hai, SW1 ko NETCONF se aur SW2 ko SSH se, har us switch par jahan guests connect hote hain. Phir switches ise apne data plane mein enforce karte hain.",
      },
      stackActive: "Southbound API",
      rows: [
        { label: "Intent", blocks: [{ id: "intent", label: "Guest policy", sub: "intent: internet only", tone: "teal" }] },
        { label: "Controller", blocks: [{ id: "ctrl", label: "Catalyst Center", sub: "translates intent to config", tone: "purple" }] },
        {
          label: "SBI",
          blocks: [
            { id: "nc", label: "NETCONF", sub: "to SW1", tone: "orange" },
            { id: "ssh", label: "SSH", sub: "to SW2", tone: "orange" },
          ],
        },
        {
          label: "Devices",
          blocks: [
            { id: "d1", label: "SW1 data plane", sub: "enforces guest policy", tone: "blue" },
            { id: "d2", label: "SW2 data plane", sub: "enforces guest policy", tone: "blue" },
          ],
        },
      ],
      focus: ["intent", "ctrl", "nc", "ssh", "d1", "d2"],
    },
    {
      title: { en: "Underlay: the physical routed network", hi: "Underlay: physical routed network" },
      text: {
        en: "Zoom into the infrastructure of an SD-Access fabric. The underlay is the physical switches and links. Edge-1 (loopback 10.255.0.1) and Edge-2 (10.255.0.2) reach each other's loopbacks through a routed network running IS-IS. That reachability is all the underlay provides.",
        hi: "SD-Access fabric ke infrastructure mein zoom karo. Underlay physical switches aur links hain. Edge-1 (loopback 10.255.0.1) aur Edge-2 (10.255.0.2) ek doosre ke loopbacks tak IS-IS chalane wale routed network se pahunchte hain. Underlay sirf yahi reachability deta hai.",
      },
      stackActive: "Infrastructure",
      rows: [
        {
          label: "Underlay",
          blocks: [
            { id: "e1", label: "Edge-1", sub: "Lo0 10.255.0.1", tone: "gray" },
            { id: "core", label: "Intermediate", sub: "routed links, IS-IS", tone: "gray" },
            { id: "e2", label: "Edge-2", sub: "Lo0 10.255.0.2", tone: "gray" },
          ],
        },
      ],
      focus: ["e1", "core", "e2"],
    },
    {
      title: { en: "Overlay: a VXLAN tunnel across it", hi: "Overlay: uske upar VXLAN tunnel" },
      text: {
        en: "On top, the edges build a VXLAN tunnel between their loopbacks. PC-A (10.50.1.10) on Edge-1 and PC-B (10.50.1.20) on Edge-2 live in the overlay: same virtual network, as if on one switch, though the underlay between them is routed.",
        hi: "Upar, edges apne loopbacks ke beech VXLAN tunnel banate hain. Edge-1 par PC-A (10.50.1.10) aur Edge-2 par PC-B (10.50.1.20) overlay mein rehte hain: same virtual network, jaise ek hi switch par hon, jabki beech ka underlay routed hai.",
      },
      stackActive: "Infrastructure",
      rows: [
        {
          label: "Hosts",
          blocks: [
            { id: "pca", label: "PC-A", sub: "10.50.1.10", tone: "green" },
            { id: "pcb", label: "PC-B", sub: "10.50.1.20", tone: "green" },
          ],
        },
        { label: "Overlay", blocks: [{ id: "vx", label: "VXLAN tunnel", sub: "10.255.0.1 ↔ 10.255.0.2", tone: "green" }] },
        {
          label: "Underlay",
          blocks: [
            { id: "e1", label: "Edge-1", sub: "Lo0 10.255.0.1", tone: "gray" },
            { id: "core", label: "Intermediate", sub: "routed links, IS-IS", tone: "gray" },
            { id: "e2", label: "Edge-2", sub: "Lo0 10.255.0.2", tone: "gray" },
          ],
        },
      ],
      focus: ["vx", "pca", "pcb"],
    },
    {
      title: { en: "What the underlay actually carries", hi: "Underlay asal mein kya le jaata hai" },
      text: {
        en: "Edge-1 wraps PC-A's frame in a VXLAN header (the VNI names the virtual network), UDP port 4789 and an outer IP header 10.255.0.1 to 10.255.0.2. Underlay switches route on the outer header only. Edge-2 strips it and hands the inner frame to PC-B. About 50 extra bytes, so the underlay MTU is raised.",
        hi: "Edge-1 PC-A ke frame ko VXLAN header (VNI virtual network ka naam batata hai), UDP port 4789 aur outer IP header 10.255.0.1 se 10.255.0.2 mein wrap karta hai. Underlay switches sirf outer header par route karte hain. Edge-2 use hata kar inner frame PC-B ko deta hai. Lagbhag 50 extra bytes, isliye underlay MTU badhaya jaata hai.",
      },
      stackActive: "Infrastructure",
      rows: [
        {
          label: "On the wire",
          blocks: [
            { id: "oeth", label: "Outer Ethernet", sub: "per-hop MACs", tone: "gray", w: 1.1 },
            { id: "oip", label: "Outer IP", sub: "10.255.0.1 → .0.2", tone: "gray", w: 1.3 },
            { id: "udp", label: "UDP", sub: "dst 4789", tone: "orange", w: 0.9 },
            { id: "vxh", label: "VXLAN", sub: "VNI", tone: "green", w: 0.9 },
            { id: "inner", label: "Inner frame", sub: "PC-A to PC-B", tone: "green", w: 1.2 },
          ],
        },
        {
          label: "Read by",
          blocks: [
            { id: "r-under", label: "Underlay hops", sub: "outer headers only", tone: "gray", w: 2.4 },
            { id: "r-edge2", label: "Edge-2", sub: "removes outer, UDP, VXLAN", tone: "orange", w: 1.8 },
            { id: "r-pcb", label: "PC-B", sub: "gets the inner frame", tone: "green", w: 1.2 },
          ],
        },
      ],
      focus: ["oip", "vxh", "inner"],
    },
    {
      title: { en: "Fabric = overlay + underlay, one controller", hi: "Fabric = overlay + underlay, ek controller" },
      text: {
        en: "Together the underlay and overlay form the fabric, and Catalyst Center manages both: it can automate the underlay build and create new virtual networks in the overlay without touching cables. The same pattern appears in ACI with APIC, and in SD-WAN with SD-WAN Manager.",
        hi: "Underlay aur overlay milkar fabric banate hain, aur Catalyst Center dono manage karta hai: underlay ka build automate kar sakta hai aur cables chhuye bina overlay mein naye virtual networks bana sakta hai. Yahi pattern ACI mein APIC ke saath, aur SD-WAN mein SD-WAN Manager ke saath dikhta hai.",
      },
      stackActive: "Controller",
      rows: [
        { label: "Controller", blocks: [{ id: "ctrl", label: "Catalyst Center", sub: "manages the whole fabric", tone: "purple" }] },
        {
          label: "Overlay",
          blocks: [
            { id: "vx", label: "VXLAN tunnels", sub: "virtual networks", tone: "green" },
            { id: "vn2", label: "New VN: IoT", sub: "added by the controller", tone: "green" },
          ],
        },
        {
          label: "Underlay",
          blocks: [
            { id: "e1", label: "Edge-1", sub: "Lo0 10.255.0.1", tone: "gray" },
            { id: "core", label: "Intermediate", sub: "routed links, IS-IS", tone: "gray" },
            { id: "e2", label: "Edge-2", sub: "Lo0 10.255.0.2", tone: "gray" },
          ],
        },
      ],
      focus: ["ctrl", "vx", "vn2"],
    },
  ],
};

export default scene;
