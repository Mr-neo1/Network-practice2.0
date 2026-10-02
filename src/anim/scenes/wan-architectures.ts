import type { TopologyScene } from "../types.ts";

const routeColumns = ["Destination", "Via"];

const scene: TopologyScene = {
  kind: "topology",
  id: "wan-architectures",
  title: { en: "A branch on MPLS, with an internet VPN as backup", hi: "MPLS par branch, backup mein internet VPN" },
  height: 460,
  nodes: [
    { id: "br1", kind: "router", x: 90, y: 100, label: "Branch1", sub: "10.1.0.0/16", sub2: "203.0.113.10" },
    { id: "pe1", kind: "router", x: 250, y: 100, label: "PE1", sub: "provider edge" },
    { id: "p1", kind: "router", x: 400, y: 100, label: "P1", sub: "provider core" },
    { id: "pe2", kind: "router", x: 550, y: 100, label: "PE2", sub: "provider edge" },
    { id: "hq", kind: "router", x: 710, y: 215, label: "HQ", sub: "10.0.0.0/16", sub2: "198.51.100.1" },
    { id: "srv", kind: "server", x: 710, y: 345, label: "App server", sub: "10.0.1.10" },
    { id: "br2", kind: "router", x: 90, y: 330, label: "Branch2", sub: "10.2.0.0/16", sub2: "203.0.113.20" },
    { id: "inet", kind: "internet", x: 400, y: 330, label: "Internet" },
  ],
  links: [
    { id: "l-b1-pe1", a: "br1", b: "pe1" },
    { id: "l-b2-pe1", a: "br2", b: "pe1" },
    { id: "l-pe1-p1", a: "pe1", b: "p1", style: "fiber" },
    { id: "l-p1-pe2", a: "p1", b: "pe2", style: "fiber" },
    { id: "l-pe2-hq", a: "pe2", b: "hq" },
    { id: "l-hq-srv", a: "hq", b: "srv" },
    { id: "l-b1-inet", a: "br1", b: "inet" },
    { id: "l-b2-inet", a: "br2", b: "inet" },
    { id: "l-hq-inet", a: "hq", b: "inet" },
  ],
  steps: [
    {
      title: { en: "Three sites, two ways to connect", hi: "Teen sites, connect karne ke do raaste" },
      text: {
        en: "HQ and two branches. Each site router has two WAN connections: a private MPLS service from a provider (the top row) and an ordinary internet connection (bottom). MPLS is the primary path; the internet is the backup.",
        hi: "HQ aur do branches. Har site router ke do WAN connections hain: provider ki private MPLS service (upar wali row) aur ek normal internet connection (neeche). MPLS primary path hai; internet backup hai.",
      },
      focus: ["br1", "br2", "hq"],
    },
    {
      title: { en: "CE, PE and P routers", hi: "CE, PE aur P routers" },
      text: {
        en: "Branch1, Branch2 and HQ are the customer's CE (customer edge) routers. PE1 and PE2 are the provider's PE (provider edge) routers that CEs plug into. P1 is a P (provider core) router: it links only to other provider routers, never to a customer.",
        hi: "Branch1, Branch2 aur HQ customer ke CE (customer edge) routers hain. PE1 aur PE2 provider ke PE (provider edge) routers hain jinme CEs lagte hain. P1 ek P (provider core) router hai: yeh sirf doosre provider routers se judta hai, kisi customer se kabhi nahi.",
      },
      focus: ["pe1", "p1", "pe2"],
      badges: [
        { node: "br1", text: "CE", tone: "gray" },
        { node: "br2", text: "CE", tone: "gray" },
        { node: "hq", text: "CE", tone: "gray" },
      ],
    },
    {
      title: { en: "Layer 3 VPN: CEs swap routes with PEs", hi: "Layer 3 VPN: CEs aur PEs routes share karte hain" },
      text: {
        en: "Each CE advertises its subnets to its PE with a routing protocol such as OSPF or BGP, and the provider carries them between its PEs, kept apart from every other customer. Branch1 learns HQ's 10.0.0.0/16 and Branch2's 10.2.0.0/16, both via PE1. HQ learns both branch subnets via PE2.",
        hi: "Har CE apne subnets apne PE ko OSPF ya BGP jaise routing protocol se advertise karta hai, aur provider inhe apne PEs ke beech le jaata hai, baaki customers se alag rakh kar. Branch1 ko HQ ka 10.0.0.0/16 aur Branch2 ka 10.2.0.0/16 milta hai, dono PE1 ke through. HQ ko dono branches ke subnets PE2 ke through milte hain.",
      },
      packets: [
        { path: ["br1", "pe1"], label: "10.1.0.0/16", tone: "purple" },
        { path: ["br2", "pe1"], label: "10.2.0.0/16", tone: "purple" },
        { path: ["hq", "pe2"], label: "10.0.0.0/16", tone: "purple" },
        { path: ["pe1", "br1"], label: "10.2.0.0/16", tone: "purple", delay: 1 },
        { path: ["pe2", "p1", "pe1", "br1"], label: "10.0.0.0/16", tone: "purple", delay: 1 },
        { path: ["pe1", "p1", "pe2", "hq"], label: "10.1.0.0/16", tone: "purple", delay: 1 },
      ],
      tables: [
        {
          node: "br1",
          title: "Branch1 routes",
          columns: routeColumns,
          rows: [
            ["10.0.0.0/16", "PE1 (MPLS)"],
            ["10.2.0.0/16", "PE1 (MPLS)"],
          ],
          hl: [0, 1],
        },
        {
          node: "hq",
          title: "HQ routes",
          columns: routeColumns,
          rows: [
            ["10.1.0.0/16", "PE2 (MPLS)"],
            ["10.2.0.0/16", "PE2 (MPLS)"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Inside the provider: labels, not IP", hi: "Provider ke andar: labels, IP nahi" },
      text: {
        en: "A Branch1 user opens the app on 10.0.1.10. Branch1 sends a normal IP packet to PE1. PE1 adds MPLS labels in front of it, P1 forwards by label alone without reading the customer's IP addresses, and by the time the packet leaves PE2 the labels are gone.",
        hi: "Branch1 ka ek user 10.0.1.10 par app kholta hai. Branch1 PE1 ko normal IP packet bhejta hai. PE1 uske aage MPLS labels lagata hai, P1 customer ke IP addresses padhe bina sirf label dekh kar forward karta hai, aur PE2 se nikalte waqt tak labels hat chuke hote hain.",
      },
      packets: [
        { path: ["br1", "pe1"], label: "To 10.0.1.10", tone: "blue" },
        { path: ["pe1", "p1", "pe2"], label: "Label + IP", tone: "teal", delay: 1 },
        { path: ["pe2", "hq", "srv"], label: "To 10.0.1.10", tone: "blue", delay: 3 },
      ],
    },
    {
      title: { en: "Any-to-any: branch to branch", hi: "Any-to-any: branch se branch" },
      text: {
        en: "Branch1 to a host in Branch2 goes through the provider only and never touches HQ. An MPLS Layer 3 VPN gives any-to-any reachability, like a full mesh, while each site pays for just one link into the provider.",
        hi: "Branch1 se Branch2 ke kisi host tak traffic sirf provider ke through jaata hai, HQ ko chhoota bhi nahi. MPLS Layer 3 VPN full mesh jaisi any-to-any reachability deta hai, jabki har site sirf provider tak ek link ka paisa deti hai.",
      },
      packets: [{ path: ["br1", "pe1", "br2"], label: "To 10.2.1.20", tone: "blue" }],
    },
    {
      title: { en: "The MPLS link fails", hi: "MPLS link fail hota hai" },
      text: {
        en: "The Branch1–PE1 link goes down, and every route Branch1 learned from PE1 goes with it. Its backup route kept in reserve, 10.0.0.0/16 through the VPN tunnel to HQ, is installed instead: a floating static route (lesson 3.4). The provider withdraws 10.1.0.0/16, so HQ installs its mirror-image backup route to Branch1 through the tunnel.",
        hi: "Branch1–PE1 link down ho jaata hai, aur PE1 se seekhe saare routes uske saath chale jaate hain. Reserve mein rakha backup route, 10.0.0.0/16 VPN tunnel ke through HQ tak, ab install ho jaata hai: yeh floating static route hai (lesson 3.4). Provider 10.1.0.0/16 withdraw kar deta hai, toh HQ bhi Branch1 ke liye tunnel wala ulta backup route install karta hai.",
      },
      links: [{ id: "l-b1-pe1", state: "down", note: "down" }],
      badges: [{ node: "br1", text: "MPLS down", tone: "red" }],
      tables: [
        { node: "br1", title: "Branch1 routes", columns: routeColumns, rows: [["10.0.0.0/16", "Tunnel0 (backup)"]], hl: [0] },
        {
          node: "hq",
          title: "HQ routes",
          columns: routeColumns,
          rows: [
            ["10.1.0.0/16", "Tunnel0 (backup)"],
            ["10.2.0.0/16", "PE2 (MPLS)"],
          ],
          hl: [0],
        },
      ],
    },
    {
      title: { en: "Backup path: IPsec over the internet", hi: "Backup path: internet par IPsec" },
      text: {
        en: "Branch1 encrypts the packet and wraps it in a new IP header from 203.0.113.10 to HQ's 198.51.100.1, so the internet sees only those two public addresses. HQ decrypts it for 10.0.1.10, and the server's reply follows HQ's backup route into the tunnel. The tunnel reaches HQ only, so Branch2 is out of reach for now.",
        hi: "Branch1 packet ko encrypt karke ek naye IP header mein wrap karta hai, 203.0.113.10 se HQ ke 198.51.100.1 tak, toh internet ko sirf yeh do public addresses dikhte hain. HQ use decrypt karke 10.0.1.10 ko deta hai, aur server ka reply HQ ke backup route se tunnel mein wapas jaata hai. Tunnel sirf HQ tak hai, isliye abhi Branch2 tak nahi pahunch sakte.",
      },
      links: [
        { id: "l-b1-inet", state: "active", note: "IPsec tunnel" },
        { id: "l-hq-inet", state: "active", note: "IPsec tunnel" },
      ],
      packets: [
        { path: ["br1", "inet", "hq"], label: "Encrypted (ESP)", tone: "green" },
        { path: ["hq", "srv"], label: "To 10.0.1.10", tone: "blue", delay: 2 },
        { path: ["srv", "hq"], label: "Reply", tone: "blue", delay: 3 },
        { path: ["hq", "inet", "br1"], label: "Encrypted reply", tone: "green", delay: 4 },
      ],
    },
    {
      title: { en: "MPLS returns, traffic moves back", hi: "MPLS wapas, traffic bhi wapas" },
      text: {
        en: "The link comes back up. Branch1 relearns its routes from PE1 and HQ relearns 10.1.0.0/16 from PE2; because these beat the floating static routes, both tunnel routes leave the tables. Traffic returns to MPLS, and no PC had to change anything.",
        hi: "Link wapas up ho jaata hai. Branch1 PE1 se apne routes dobara seekhta hai aur HQ PE2 se 10.1.0.0/16 dobara seekhta hai; kyunki yeh floating static routes se behtar hain, dono tunnel wale routes tables se hat jaate hain. Traffic wapas MPLS par, aur kisi PC ko kuch change nahi karna pada.",
      },
      links: [
        { id: "l-b1-pe1", state: "normal" },
        { id: "l-b1-inet", state: "normal" },
        { id: "l-hq-inet", state: "normal" },
      ],
      badges: [{ node: "br1", text: "CE", tone: "gray" }],
      packets: [
        { path: ["pe1", "br1"], label: "10.0.0.0/16", tone: "purple" },
        { path: ["br1", "pe1"], label: "To 10.0.1.10", tone: "blue", delay: 1 },
        { path: ["pe1", "p1", "pe2"], label: "Label + IP", tone: "teal", delay: 2 },
        { path: ["pe2", "hq", "srv"], label: "To 10.0.1.10", tone: "blue", delay: 4 },
      ],
      tables: [
        {
          node: "br1",
          title: "Branch1 routes",
          columns: routeColumns,
          rows: [
            ["10.0.0.0/16", "PE1 (MPLS)"],
            ["10.2.0.0/16", "PE1 (MPLS)"],
          ],
          hl: [0, 1],
        },
        {
          node: "hq",
          title: "HQ routes",
          columns: routeColumns,
          rows: [
            ["10.1.0.0/16", "PE2 (MPLS)"],
            ["10.2.0.0/16", "PE2 (MPLS)"],
          ],
          hl: [0],
        },
      ],
    },
  ],
};

export default scene;
