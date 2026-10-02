import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "sd-wan-sd-access",
  intro: {
    en: "In lesson 1.13 a branch had an MPLS circuit and an internet VPN, and each router chose a path from routing metrics alone. It could not see that the internet path was dropping 4% of packets and ruining every phone call. Cisco Catalyst SD-WAN puts controllers in charge of the WAN: tunnels across any transport, one policy for every site, and path choice based on measured loss, latency and jitter. SD-Access does the same for the campus, replacing per-switch VLANs and IP-based ACLs with a fabric and identity-based groups.",
    hi: "Lesson 1.13 mein branch ke paas ek MPLS circuit aur ek internet VPN tha, aur har router sirf routing metrics dekh kar path chunta tha. Use dikhta hi nahi tha ki internet path 4% packets drop kar raha hai aur har phone call kharab ho rahi hai. Cisco Catalyst SD-WAN WAN ka control controllers ko de deta hai: kisi bhi transport par tunnels, har site ke liye ek policy, aur path ka choice measured loss, latency aur jitter ke basis par. SD-Access yahi kaam campus ke liye karta hai: har switch par VLANs aur IP-based ACLs ki jagah ek fabric aur identity-based groups.",
  },
  outcomes: [
    { en: "Name the four Catalyst SD-WAN components, their old names, and the job of each", hi: "Catalyst SD-WAN ke chaar components, unke purane naam aur har ek ka kaam bata sako" },
    { en: "Explain how a WAN Edge is onboarded with zero-touch provisioning and how IPsec overlay tunnels form across MPLS and internet", hi: "Samjha sako ki zero-touch provisioning se WAN Edge kaise onboard hota hai aur MPLS aur internet par IPsec overlay tunnels kaise bante hain" },
    { en: "Predict which transport application-aware routing picks from SLA measurements of loss, latency and jitter", hi: "SLA measurements (loss, latency, jitter) dekh kar predict kar sako ki application-aware routing kaunsa transport chunega" },
    { en: "Describe the SD-Access fabric: IS-IS underlay, VXLAN data plane, LISP control plane and the edge, border and control plane node roles", hi: "SD-Access fabric describe kar sako: IS-IS underlay, VXLAN data plane, LISP control plane aur edge, border aur control plane node roles" },
    { en: "Explain how scalable group tags let policy follow a user instead of an IP address", hi: "Samjha sako ki scalable group tags se policy IP address ki jagah user ke saath kaise chalti hai" },
    { en: "List what changes in an engineer's daily work, and which skills still matter", hi: "Engineer ke daily kaam mein kya badalta hai aur kaunsi skills ab bhi zaroori hain, yeh list kar sako" },
  ],
  sections: [
    {
      id: "why-sd-wan",
      heading: { en: "What is wrong with the traditional WAN", hi: "Traditional WAN mein problem kya hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Take a company with 200 branches. Each branch router has an MPLS circuit and an internet line with an IPsec VPN (lesson 5.9) as backup. Every router is configured by hand: crypto maps or tunnels, routing, QoS, ACLs. Three problems follow.",
            hi: "Ek company socho jiske 200 branches hain. Har branch router ke paas ek MPLS circuit hai aur ek internet line jis par backup ke liye IPsec VPN hai (lesson 5.9). Har router haath se configure hota hai: crypto maps ya tunnels, routing, QoS, ACLs. Isse teen problems aati hain.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**The router cannot see path quality.** OSPF or BGP picks a path by cost or attributes. If the internet path is up but losing 4% of packets, routing still uses it, and calls break up.",
              hi: "**Router ko path ki quality nahi dikhti.** OSPF ya BGP cost ya attributes dekh kar path chunte hain. Internet path up hai lekin 4% packets kho raha hai, toh bhi routing usi ko use karti rahegi, aur calls toot-toot kar aayengi.",
            },
            {
              en: "**Change is slow and risky.** A new policy, such as \"send video calls over the internet, keep payment traffic on MPLS\", means editing 200 configs and hoping all of them match.",
              hi: "**Change slow aur risky hai.** Nayi policy, jaise \"video calls internet se bhejo, payment traffic MPLS par rakho\", ka matlab hai 200 configs edit karna aur umeed karna ki sab match karein.",
            },
            {
              en: "**Expensive circuits sit idle.** The backup internet line, often faster than the MPLS circuit, carries traffic only when MPLS fails.",
              hi: "**Mehnge circuits khaali pade rehte hain.** Backup internet line, jo aksar MPLS circuit se tez hoti hai, traffic tabhi le jaati hai jab MPLS fail ho.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "**SD-WAN** (software-defined WAN) answers all three. The edge routers build encrypted tunnels over whatever transports exist, central controllers distribute routes and policy, and each router measures every tunnel continuously and steers each application to a path that meets its needs. It applies the controller ideas from lesson 6.2 to the WAN.",
            hi: "**SD-WAN** (software-defined WAN) teeno ka jawab hai. Edge routers jo bhi transports available hain un par encrypted tunnels banate hain, central controllers routes aur policy distribute karte hain, aur har router har tunnel ko lagataar measure karke har application ko aise path par bhejta hai jo uski zaroorat poori kare. Yeh lesson 6.2 ke controller wale ideas ko WAN par lagata hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Where this sits in the exam", hi: "Exam mein yeh kahan aata hai" },
          text: {
            en: "CCNA 200-301 tests the general ideas: controller-based networking, underlay, overlay and fabric (topics 6.2 and 6.3). The component names and mechanisms in this lesson are ENCOR 350-401 depth. They help you answer CCNA questions with confidence, and they are what you will meet at work.",
            hi: "CCNA 200-301 general ideas test karta hai: controller-based networking, underlay, overlay aur fabric (topics 6.2 aur 6.3). Is lesson ke component names aur mechanisms ENCOR 350-401 level ke hain. Inse CCNA questions confidence se solve hote hain, aur job par yahi milega.",
          },
        },
      ],
    },
    {
      id: "sd-wan-components",
      heading: { en: "Catalyst SD-WAN: four components", hi: "Catalyst SD-WAN: chaar components" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Cisco bought Viptela in 2017, and its product is now **Cisco Catalyst SD-WAN**. In 2023 Cisco renamed the components. Older documents, job adverts and many engineers still use the v-names, so learn both.",
            hi: "Cisco ne 2017 mein Viptela khareeda, aur uska product ab **Cisco Catalyst SD-WAN** hai. 2023 mein Cisco ne components ke naam badal diye. Purane documents, job ads aur bahut saare engineers ab bhi v-names use karte hain, isliye dono yaad rakho.",
          },
        },
        {
          type: "table",
          caption: { en: "Who does what", hi: "Kaun kya karta hai" },
          columns: [{ en: "Component", hi: "Component" }, { en: "Old name", hi: "Purana naam" }, { en: "Plane", hi: "Plane" }, { en: "Job", hi: "Kaam" }],
          rows: [
            [
              "SD-WAN Manager",
              "vManage",
              { en: "Management", hi: "Management" },
              { en: "GUI and REST API. Holds device configuration and policy, pushes config to edges, upgrades software, shows health and tunnel statistics.", hi: "GUI aur REST API. Device configuration aur policy rakhta hai, edges ko config push karta hai, software upgrade karta hai, health aur tunnel statistics dikhata hai." },
            ],
            [
              "SD-WAN Controller",
              "vSmart",
              { en: "Control", hi: "Control" },
              { en: "Runs OMP with every edge. Receives each site's routes, TLOCs and keys, applies policy and sends the result to the other edges. Carries no user data.", hi: "Har edge ke saath OMP chalata hai. Har site ke routes, TLOCs aur keys leta hai, policy apply karta hai aur result baaki edges ko bhejta hai. User data nahi le jaata." },
            ],
            [
              "SD-WAN Validator",
              "vBond",
              { en: "Orchestration", hi: "Orchestration" },
              { en: "First point of contact. Authenticates new edges, tells them where the Controllers and Managers are, and helps edges behind NAT find their public addresses. Needs a public IP.", hi: "Pehla contact point. Naye edges ko authenticate karta hai, unhe batata hai ki Controllers aur Managers kahan hain, aur NAT ke peeche wale edges ko unka public address pata karne mein help karta hai. Iske liye public IP chahiye." },
            ],
            [
              "WAN Edge",
              "vEdge / cEdge",
              { en: "Data", hi: "Data" },
              { en: "The router at each site (for example a Catalyst 8000 running IOS XE). Builds the IPsec tunnels, measures them with BFD and forwards user traffic.", hi: "Har site ka router (jaise IOS XE chalane wala Catalyst 8000). IPsec tunnels banata hai, BFD se unhe measure karta hai aur user traffic forward karta hai." },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "The three controllers usually run as virtual machines, either hosted by Cisco in the cloud or in your own data centre, and you deploy more than one of each for redundancy. The edges talk to them over **DTLS** (or TLS) connections, encrypted and authenticated with certificates.",
            hi: "Teeno controllers aam taur par virtual machines ke roop mein chalte hain, ya toh Cisco ke cloud mein hosted ya tumhare apne data centre mein, aur redundancy ke liye har ek ke ek se zyada deploy kiye jaate hain. Edges unse **DTLS** (ya TLS) connections par baat karte hain, jo certificates se encrypted aur authenticated hote hain.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The Controller is not in the data path", hi: "Controller data path mein nahi hai" },
          text: {
            en: "A common wrong picture is all branch traffic flowing through the Controller. It never does. The Controller only exchanges control information. Data goes edge to edge through IPsec tunnels. If every controller became unreachable, existing tunnels would keep forwarding with the last routes and keys for a configurable grace period.",
            hi: "Aam galat picture yeh hai ki branch ka saara traffic Controller se hokar jaata hai. Aisa kabhi nahi hota. Controller sirf control information exchange karta hai. Data edge se edge IPsec tunnels mein jaata hai. Agar saare controllers unreachable ho jaayein, toh bhi existing tunnels last routes aur keys ke saath ek configurable grace period tak forward karte rehte hain.",
          },
        },
      ],
    },
    {
      id: "overlay",
      heading: { en: "Building the overlay: ZTP, OMP, TLOCs and tunnels", hi: "Overlay banana: ZTP, OMP, TLOCs aur tunnels" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Follow the animation. The company has BR1 (site 101, `10.1.0.0/16`), BR2 (site 102, `10.2.0.0/16`) and a data centre (site 200, `10.0.0.0/16`). Each WAN Edge has a **system IP**, a router ID for the overlay: `10.255.0.1`, `10.255.0.2` and `10.255.0.10`.",
            hi: "Animation ke saath chalo. Company ke paas BR1 (site 101, `10.1.0.0/16`), BR2 (site 102, `10.2.0.0/16`) aur ek data centre (site 200, `10.0.0.0/16`) hai. Har WAN Edge ka ek **system IP** hota hai, jo overlay ke liye router ID jaisa hai: `10.255.0.1`, `10.255.0.2` aur `10.255.0.10`.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Zero-touch provisioning (ZTP).** BR2-Edge is shipped to the branch with no configuration. Someone plugs in power and the internet cable. The router gets an address by DHCP, contacts Cisco's Plug and Play cloud, and learns which Validator belongs to its organisation.",
              hi: "**Zero-touch provisioning (ZTP).** BR2-Edge branch par bina configuration ke bheja jaata hai. Koi power aur internet cable laga deta hai. Router DHCP se address leta hai, Cisco ke Plug and Play cloud se contact karta hai, aur seekhta hai ki uski organisation ka Validator kaunsa hai.",
            },
            {
              en: "**Authentication.** The edge opens a DTLS connection to the Validator. The Validator checks the serial number and certificate against the list of authorised devices, then gives the edge the addresses of the Controllers and Managers.",
              hi: "**Authentication.** Edge Validator se DTLS connection kholta hai. Validator serial number aur certificate ko authorised devices ki list se match karta hai, phir edge ko Controllers aur Managers ke addresses deta hai.",
            },
            {
              en: "**Configuration.** The edge connects to SD-WAN Manager, which pushes the configuration an engineer prepared centrally for that serial number: system IP, site ID, transport interfaces, LAN.",
              hi: "**Configuration.** Edge SD-WAN Manager se connect karta hai, aur Manager woh configuration push karta hai jo engineer ne us serial number ke liye centrally ready kiya tha: system IP, site ID, transport interfaces, LAN.",
            },
            {
              en: "**OMP.** The edge forms a DTLS connection to the Controller and runs **OMP (Overlay Management Protocol)** over it. It advertises its LAN prefixes, its **TLOCs** and its IPsec keys.",
              hi: "**OMP.** Edge Controller ke saath DTLS connection banata hai aur uske upar **OMP (Overlay Management Protocol)** chalata hai. Woh apne LAN prefixes, apne **TLOCs** aur apni IPsec keys advertise karta hai.",
            },
            {
              en: "**Tunnels.** The Controller reflects routes, TLOCs and keys to the other edges. Each edge builds IPsec tunnels directly to the remote TLOCs and starts **BFD** in each tunnel to check it is alive and to measure it.",
              hi: "**Tunnels.** Controller routes, TLOCs aur keys baaki edges ko reflect karta hai. Har edge remote TLOCs tak seedha IPsec tunnels banata hai aur har tunnel mein **BFD** start karta hai, taaki pata chale tunnel zinda hai aur use measure kiya ja sake.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "A **TLOC (transport locator)** is one tunnel endpoint: system IP + **colour** + encapsulation. The colour is a label for the transport, such as `mpls`, `biz-internet` or `lte`. BR1 has two TLOCs: (10.255.0.1, mpls, IPsec) and (10.255.0.1, biz-internet, IPsec). An OMP route says \"`10.1.0.0/16` is reachable through these TLOCs\", much like a BGP route carries a next hop (lesson 7.4).",
            hi: "**TLOC (transport locator)** ek tunnel endpoint hai: system IP + **colour** + encapsulation. Colour transport ka label hai, jaise `mpls`, `biz-internet` ya `lte`. BR1 ke do TLOCs hain: (10.255.0.1, mpls, IPsec) aur (10.255.0.1, biz-internet, IPsec). OMP route kehta hai \"`10.1.0.0/16` in TLOCs se reachable hai\", bilkul waise jaise BGP route ke saath next hop aata hai (lesson 7.4).",
          },
        },
        {
          type: "p",
          text: {
            en: "By default each TLOC tries to build a tunnel to every remote TLOC, whatever its colour. Here the MPLS network cannot reach the internet, so only same-colour tunnels come up (designs often enforce this with the `restrict` option on a colour). With three sites and two colours, BR1 therefore has four tunnels: to the DC over MPLS and over internet, and to BR2 over MPLS and over internet. By default every site tunnels to every other site (full mesh). A control policy can turn that into hub-and-spoke, so branches only tunnel to the data centre. The edges do not run IKE with each other; the Controller distributes the keys.",
            hi: "By default har TLOC har remote TLOC tak tunnel banane ki koshish karta hai, colour chahe jo ho. Yahan MPLS network internet tak nahi pahunch sakta, isliye sirf same-colour tunnels up hote hain (designs aksar colour par `restrict` option se yahi enforce karte hain). Isliye teen sites aur do colours ke saath BR1 ke paas chaar tunnels hain: DC tak MPLS aur internet par, aur BR2 tak MPLS aur internet par. By default har site har doosri site tak tunnel banati hai (full mesh). Control policy ise hub-and-spoke bana sakti hai, jisme branches sirf data centre tak tunnel banati hain. Edges aapas mein IKE nahi chalate; keys Controller distribute karta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Underlay and overlay again", hi: "Phir se underlay aur overlay" },
          text: {
            en: "The MPLS and internet circuits are the **underlay**: they only need to carry IPsec packets between the TLOC addresses. The IPsec tunnels and the OMP routes inside them are the **overlay**. When a branch user complains, check both: an overlay problem is often an underlay problem, such as an ISP dropping packets or a wrong MTU.",
            hi: "MPLS aur internet circuits **underlay** hain: unka kaam sirf TLOC addresses ke beech IPsec packets le jaana hai. IPsec tunnels aur unke andar ke OMP routes **overlay** hain. Branch user complain kare toh dono check karo: overlay ki problem aksar underlay ki problem hoti hai, jaise ISP packets drop kar raha ho ya MTU galat ho.",
          },
        },
      ],
    },
    {
      id: "policy-and-aar",
      heading: { en: "Central policy and application-aware routing", hi: "Central policy aur application-aware routing" },
      blocks: [
        {
          type: "p",
          text: {
            en: "You write policy once in SD-WAN Manager. The Manager hands it to the Controller, and the Controller sends it to the edges over OMP. Three kinds matter here:",
            hi: "Policy tum SD-WAN Manager mein ek baar likhte ho. Manager use Controller ko deta hai, aur Controller use OMP se edges tak bhejta hai. Yahan teen types zaroori hain:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Control policy**: changes which routes and TLOCs the Controller advertises to whom. Used to build hub-and-spoke or to keep two departments' sites from seeing each other.",
              hi: "**Control policy**: badalti hai ki Controller kaunse routes aur TLOCs kisko advertise kare. Hub-and-spoke banane ya do departments ki sites ko ek doosre se alag rakhne ke liye use hoti hai.",
            },
            {
              en: "**Data policy**: acts on packets at the edge, for example drop a traffic type or send it out locally to the internet.",
              hi: "**Data policy**: edge par packets par kaam karti hai, jaise kisi traffic type ko drop karna ya use locally internet par bhej dena.",
            },
            {
              en: "**Application-aware routing (AAR)**: picks a tunnel for each application based on live measurements of that tunnel.",
              hi: "**Application-aware routing (AAR)**: har application ke liye tunnel chunti hai, us tunnel ke live measurements ke basis par.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "AAR works like this. BFD packets run through every tunnel, by default once a second, and each edge calculates **loss, latency and jitter** per tunnel. It averages them over a poll interval (10 minutes by default, often tuned shorter), so with default timers AAR reacts in minutes, not milliseconds. You define an **SLA class** with limits, and a policy that matches traffic (by DSCP, by source or destination prefix and port, or by application name recognised with DPI) and maps it to that class. A tunnel is eligible only while it stays within every limit.",
            hi: "AAR aise kaam karta hai. BFD packets har tunnel mein chalte hain, by default har second ek, aur har edge har tunnel ka **loss, latency aur jitter** calculate karta hai. Inka average ek poll interval par nikaala jaata hai (default 10 minutes, aksar isse chhota tune kiya jaata hai), isliye default timers ke saath AAR minutes mein react karta hai, milliseconds mein nahi. Tum limits ke saath ek **SLA class** define karte ho, aur ek policy jo traffic ko match kare (DSCP se, source ya destination prefix aur port se, ya DPI se pehchane gaye application name se) aur use us class se map kare. Tunnel tabhi eligible hai jab tak woh har limit ke andar rahe.",
          },
        },
        {
          type: "table",
          caption: { en: "The animation's voice policy at BR1, tunnels to the DC", hi: "Animation ki voice policy BR1 par, DC tak ke tunnels" },
          columns: [{ en: "Tunnel", hi: "Tunnel" }, { en: "Loss", hi: "Loss" }, { en: "Latency", hi: "Latency" }, { en: "Jitter", hi: "Jitter" }, { en: "Meets voice SLA (1%, 150 ms, 30 ms)?", hi: "Voice SLA (1%, 150 ms, 30 ms) meet karta hai?" }],
          rows: [
            ["mpls", "0%", "33 ms", "2 ms", { en: "Yes", hi: "Haan" }],
            ["biz-internet (before)", "0.1%", "28 ms", "4 ms", { en: "Yes, and it is the preferred colour, so voice uses it", hi: "Haan, aur yahi preferred colour hai, isliye voice isi par jaati hai" }],
            ["biz-internet (after)", "4%", "45 ms", "18 ms", { en: "No: loss is over 1%, so voice moves to mpls", hi: "Nahi: loss 1% se zyada hai, isliye voice mpls par shift hoti hai" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Notice what did not happen: no routing protocol changed, and the internet tunnel stayed up. Ordinary routing would keep using it. AAR moved only the traffic whose SLA was broken. Traffic that matches no AAR rule is not pinned to any colour: by default it is load-shared across all tunnels that are up. If no tunnel meets the SLA, the edge by default keeps forwarding over the available tunnels; the policy can name a backup colour instead, or drop the traffic with the strict option.",
            hi: "Dhyan do kya nahi hua: koi routing protocol nahi badla, aur internet tunnel up hi raha. Normal routing usi ko use karti rehti. AAR ne sirf woh traffic shift kiya jiski SLA toot gayi thi. Jo traffic kisi AAR rule se match nahi hota, woh kisi colour se bandha nahi hota: by default woh saare up tunnels par load-share hota hai. Agar koi bhi tunnel SLA meet na kare, toh by default edge available tunnels par forward karta rehta hai; policy iski jagah ek backup colour bata sakti hai, ya strict option se traffic drop karwa sakti hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Verifying on an IOS XE WAN Edge", hi: "IOS XE WAN Edge par verify karna" },
          lines: [
            { prompt: "BR1-Edge#", cmd: "show sdwan control connections", comment: { en: "DTLS connections to the Validator, Controllers and Managers, and their state", hi: "Validator, Controllers aur Managers ke saath DTLS connections aur unki state" } },
            { prompt: "BR1-Edge#", cmd: "show sdwan omp routes", comment: { en: "Prefixes learned from the Controller and the TLOCs behind each one", hi: "Controller se seekhe prefixes aur har ek ke peeche ke TLOCs" } },
            { prompt: "BR1-Edge#", cmd: "show sdwan bfd sessions", comment: { en: "One BFD session per tunnel: remote system IP, local and remote colour, up or down", hi: "Har tunnel ka ek BFD session: remote system IP, local aur remote colour, up ya down" } },
            { prompt: "BR1-Edge#", cmd: "show sdwan app-route stats", comment: { en: "Loss, latency and jitter measured on each tunnel", hi: "Har tunnel par measure hua loss, latency aur jitter" } },
          ],
          note: {
            en: "In practice you will read most of this in SD-WAN Manager's monitoring pages, but the CLI is still there when the GUI cannot reach a device.",
            hi: "Practice mein zyadatar yeh SD-WAN Manager ke monitoring pages mein padhoge, lekin jab GUI device tak na pahunche tab CLI kaam aata hai.",
          },
        },
      ],
    },
    {
      id: "sd-access",
      heading: { en: "SD-Access: a fabric for the campus", hi: "SD-Access: campus ke liye fabric" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Campus networks have their own pain. A user's policy is tied to a VLAN and an IP subnet, so when they move floors their address changes and the ACLs written for their old subnet no longer apply. Large VLANs that span buildings bring back the STP problems from lesson 2.6. **Cisco SD-Access** replaces this with a routed fabric managed by **Catalyst Center** (formerly DNA Center), with **ISE** deciding who each user or device is.",
            hi: "Campus networks ka apna dard hai. User ki policy ek VLAN aur IP subnet se bandhi hoti hai, toh jab woh floor badalta hai uska address badal jaata hai aur purane subnet ke liye likhe ACLs ab apply nahi hote. Buildings ke aar-paar faile bade VLANs lesson 2.6 wali STP problems wapas le aate hain. **Cisco SD-Access** iski jagah ek routed fabric deta hai jise **Catalyst Center** (pehle DNA Center) manage karta hai, aur **ISE** decide karta hai ki har user ya device kaun hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The parts of the SD-Access fabric", hi: "SD-Access fabric ke parts" },
          columns: [{ en: "Part", hi: "Part" }, { en: "Protocol", hi: "Protocol" }, { en: "What it does", hi: "Kya karta hai" }],
          rows: [
            [{ en: "Underlay", hi: "Underlay" }, "IS-IS", { en: "Routed links between all fabric switches, no STP. Only provides reachability between switch loopbacks. Catalyst Center can build it automatically (LAN automation), and then it always uses IS-IS; a hand-built underlay may use another IGP such as OSPF.", hi: "Saare fabric switches ke beech routed links, STP nahi. Sirf switch loopbacks ke beech reachability deta hai. Catalyst Center ise automatically bana sakta hai (LAN automation), aur tab yeh hamesha IS-IS use karta hai; haath se bane underlay mein OSPF jaisa koi aur IGP bhi chal sakta hai." }],
            [{ en: "Overlay data plane", hi: "Overlay data plane" }, "VXLAN", { en: "Edge switches wrap user frames in VXLAN between their loopbacks (lesson 6.2). The VXLAN header also carries the user's group tag.", hi: "Edge switches user frames ko apne loopbacks ke beech VXLAN mein wrap karte hain (lesson 6.2). VXLAN header user ka group tag bhi le jaata hai." }],
            [{ en: "Overlay control plane", hi: "Overlay control plane" }, "LISP", { en: "A database of which endpoint is behind which edge switch. Edges register their endpoints and look up others on demand.", hi: "Ek database ki kaunsa endpoint kis edge switch ke peeche hai. Edges apne endpoints register karte hain aur doosron ko zaroorat padne par lookup karte hain." }],
            [{ en: "Policy plane", hi: "Policy plane" }, { en: "SGT (Cisco TrustSec)", hi: "SGT (Cisco TrustSec)" }, { en: "Every user and device gets a scalable group tag; rules are written between groups, not IP addresses.", hi: "Har user aur device ko ek scalable group tag milta hai; rules groups ke beech likhe jaate hain, IP addresses ke beech nahi." }],
          ],
        },
        {
          type: "table",
          caption: { en: "Fabric roles", hi: "Fabric roles" },
          columns: [{ en: "Role", hi: "Role" }, { en: "What it does", hi: "Kya karta hai" }],
          rows: [
            [{ en: "Fabric edge node", hi: "Fabric edge node" }, { en: "Access switch where users and APs connect. Registers each endpoint with the control plane node, encapsulates and decapsulates VXLAN, applies group policy. It is also the default gateway, with the same gateway address on every edge.", hi: "Access switch jahan users aur APs connect hote hain. Har endpoint ko control plane node ke paas register karta hai, VXLAN encapsulate aur decapsulate karta hai, group policy apply karta hai. Yahi default gateway bhi hai, har edge par same gateway address ke saath." }],
            [{ en: "Control plane node", hi: "Control plane node" }, { en: "The LISP map server and resolver: the database of endpoint (EID) to edge loopback (RLOC). Often combined with the border.", hi: "LISP map server aur resolver: endpoint (EID) se edge loopback (RLOC) ka database. Aksar border ke saath combine hota hai." }],
            [{ en: "Fabric border node", hi: "Fabric border node" }, { en: "Connects the fabric to everything outside it: the data centre, the WAN (often SD-WAN), the internet. Translates between fabric and normal routing.", hi: "Fabric ko bahar ki har cheez se jodta hai: data centre, WAN (aksar SD-WAN), internet. Fabric aur normal routing ke beech translate karta hai." }],
            [{ en: "Intermediate node", hi: "Intermediate node" }, { en: "Underlay-only switch, such as a distribution switch. Routes VXLAN packets by their outer IP header and knows nothing about users.", hi: "Sirf underlay switch, jaise distribution switch. VXLAN packets ko outer IP header se route karta hai aur users ke baare mein kuch nahi jaanta." }],
          ],
        },
        {
          type: "steps",
          items: [
            {
              en: "A contractor's laptop connects to edge switch Edge-1 and authenticates with 802.1X. ISE puts it in group **Contractors** (SGT 20) and virtual network CAMPUS.",
              hi: "Ek contractor ka laptop edge switch Edge-1 se connect hota hai aur 802.1X se authenticate karta hai. ISE use group **Contractors** (SGT 20) aur virtual network CAMPUS mein daalta hai.",
            },
            {
              en: "Edge-1 registers the laptop's address with the control plane node: \"`10.60.1.25` is behind `10.255.1.1`\" (Edge-1's loopback).",
              hi: "Edge-1 laptop ka address control plane node ke paas register karta hai: \"`10.60.1.25` `10.255.1.1` ke peeche hai\" (Edge-1 ka loopback).",
            },
            {
              en: "When the laptop sends to a server behind Edge-2, Edge-1 asks the control plane node where it is, then sends a VXLAN packet to Edge-2's loopback with SGT 20 in the header.",
              hi: "Jab laptop Edge-2 ke peeche wale server ko bhejta hai, Edge-1 control plane node se poochta hai ki server kahan hai, phir Edge-2 ke loopback par VXLAN packet bhejta hai jiske header mein SGT 20 hota hai.",
            },
            {
              en: "Edge-2 reads SGT 20, checks the group policy (Contractors to Finance servers: deny) and drops the packet. If the laptop moves to another floor tomorrow, it gets the same group and the same policy.",
              hi: "Edge-2 SGT 20 padhta hai, group policy check karta hai (Contractors se Finance servers: deny) aur packet drop kar deta hai. Kal laptop doosre floor par chala jaaye, toh bhi use wahi group aur wahi policy milegi.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Two kinds of segmentation", hi: "Do tarah ka segmentation" },
          text: {
            en: "**Virtual networks** (VNs) are VRFs: macro-segmentation, fully separate routing tables, so Guest can never reach Corporate. **SGTs** are micro-segmentation inside one VN: Contractors and Employees share a VN but get different rules.",
            hi: "**Virtual networks** (VNs) VRFs hain: macro-segmentation, bilkul alag routing tables, toh Guest kabhi Corporate tak nahi pahunch sakta. **SGTs** ek VN ke andar micro-segmentation hain: Contractors aur Employees ek hi VN share karte hain lekin unke rules alag hote hain.",
          },
        },
      ],
    },
    {
      id: "what-changes",
      heading: { en: "What changes for the engineer", hi: "Engineer ke liye kya badalta hai" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Task", hi: "Task" }, { en: "Traditional", hi: "Traditional" }, { en: "With SD-WAN / SD-Access", hi: "SD-WAN / SD-Access ke saath" }],
          rows: [
            [{ en: "New branch", hi: "Nayi branch" }, { en: "Engineer travels or talks someone through console config", hi: "Engineer jaata hai ya kisi ko phone par console config karwata hai" }, { en: "Router shipped, plugged in, configured by ZTP", hi: "Router bheja, plug kiya, ZTP se configure" }],
            [{ en: "New traffic policy", hi: "Nayi traffic policy" }, { en: "Edit every router's PBR, QoS and ACLs", hi: "Har router ka PBR, QoS aur ACLs edit karo" }, { en: "Change one policy in the controller", hi: "Controller mein ek policy badlo" }],
            [{ en: "Bad internet path", hi: "Kharab internet path" }, { en: "Users complain, engineer reroutes by hand", hi: "Users complain karte hain, engineer haath se reroute karta hai" }, { en: "AAR moves affected apps automatically, within minutes (faster if the timers are tuned)", hi: "AAR affected apps ko apne aap minutes mein shift kar deta hai (timers tune karo toh aur jaldi)" }],
            [{ en: "User changes floor", hi: "User floor badalta hai" }, { en: "New VLAN, new IP, ACLs edited", hi: "Naya VLAN, naya IP, ACLs edit" }, { en: "Same group tag, same policy everywhere", hi: "Wahi group tag, har jagah wahi policy" }],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**Less box-by-box CLI, more design.** Your job shifts to templates, policies, group design and checking that intent matches reality.",
              hi: "**Box-by-box CLI kam, design zyada.** Tumhara kaam templates, policies, group design aur yeh check karne par aa jaata hai ki intent aur reality match karte hain.",
            },
            {
              en: "**The fundamentals matter more, not less.** Tunnels need a working underlay: IP routing, BGP to the ISPs, NAT, MTU, IPsec. When the GUI shows a red tunnel, you troubleshoot with what you learned in modules 2 to 5.",
              hi: "**Fundamentals ki importance kam nahi, zyada hoti hai.** Tunnels ko working underlay chahiye: IP routing, ISPs ke saath BGP, NAT, MTU, IPsec. Jab GUI mein tunnel red dikhe, tab troubleshoot modules 2 se 5 wali knowledge se hi karoge.",
            },
            {
              en: "**APIs become normal.** SD-WAN Manager and Catalyst Center both have REST APIs (lesson 6.4), so reports and changes can be scripted.",
              hi: "**APIs normal ho jaati hain.** SD-WAN Manager aur Catalyst Center dono ke paas REST APIs hain (lesson 6.4), isliye reports aur changes script kiye ja sakte hain.",
            },
            {
              en: "**The controllers are critical systems.** Back them up, run them redundantly, watch their certificates and keep their software current. A bad policy pushed from the centre reaches every site at once.",
              hi: "**Controllers critical systems hain.** Unka backup lo, redundant chalao, unke certificates par nazar rakho aur software updated rakho. Centre se push hui galat policy ek saath har site tak pahunchti hai.",
            },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "WAN Edge", def: { en: "The SD-WAN router at a site that builds IPsec tunnels, measures them and forwards user traffic.", hi: "Site par SD-WAN router jo IPsec tunnels banata hai, unhe measure karta hai aur user traffic forward karta hai." } },
    { term: "OMP", def: { en: "Overlay Management Protocol. Runs between WAN Edges and Controllers to carry routes, TLOCs, keys and policy.", hi: "Overlay Management Protocol. WAN Edges aur Controllers ke beech chalta hai aur routes, TLOCs, keys aur policy le jaata hai." } },
    { term: "TLOC", def: { en: "Transport locator: a tunnel endpoint identified by system IP, colour and encapsulation.", hi: "Transport locator: tunnel endpoint jo system IP, colour aur encapsulation se pehchaana jaata hai." } },
    { term: "Colour", def: { en: "A label for a transport, such as mpls, biz-internet or lte, used in tunnel building and policy.", hi: "Transport ka label, jaise mpls, biz-internet ya lte, jo tunnel banane aur policy mein use hota hai." } },
    { term: "Application-aware routing", def: { en: "Choosing a tunnel per application from live loss, latency and jitter measured against an SLA class.", hi: "SLA class ke against live loss, latency aur jitter measure karke har application ke liye tunnel chunna." } },
    { term: "Zero-touch provisioning", def: { en: "Onboarding a factory-new router that finds its controllers and downloads its configuration without local setup.", hi: "Factory-new router ka onboarding jisme woh bina local setup ke apne controllers dhoondh kar apna configuration download karta hai." } },
    { term: "LISP", def: { en: "The SD-Access control plane: a database mapping each endpoint to the edge switch it sits behind.", hi: "SD-Access ka control plane: database jo har endpoint ko us edge switch se map karta hai jiske peeche woh hai." } },
    { term: "SGT", def: { en: "Scalable group tag: a number given to a user or device by identity, carried in VXLAN and used for group-based policy.", hi: "Scalable group tag: identity ke basis par user ya device ko diya gaya number, jo VXLAN mein jaata hai aur group-based policy ke liye use hota hai." } },
  ],
  commands: [
    { cmd: "show sdwan control connections", mode: "IOS XE WAN Edge privileged EXEC", does: { en: "List DTLS/TLS connections to Validator, Controllers and Managers", hi: "Validator, Controllers aur Managers ke saath DTLS/TLS connections dikhata hai" } },
    { cmd: "show sdwan omp routes", mode: "IOS XE WAN Edge privileged EXEC", does: { en: "Show prefixes learned over OMP and their TLOCs", hi: "OMP se seekhe prefixes aur unke TLOCs dikhata hai" } },
    { cmd: "show sdwan bfd sessions", mode: "IOS XE WAN Edge privileged EXEC", does: { en: "Show one BFD session per tunnel and its state", hi: "Har tunnel ka BFD session aur uski state dikhata hai" } },
    { cmd: "show sdwan app-route stats", mode: "IOS XE WAN Edge privileged EXEC", does: { en: "Show loss, latency and jitter measured per tunnel", hi: "Har tunnel par measure hua loss, latency aur jitter dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Thinking user traffic flows through the SD-WAN Controller. The Controller handles only control information; data goes edge to edge through IPsec tunnels.",
      hi: "Yeh sochna ki user traffic SD-WAN Controller se hokar jaata hai. Controller sirf control information handle karta hai; data edge se edge IPsec tunnels mein jaata hai.",
    },
    {
      en: "Mixing up the components. Validator (vBond) authenticates and points the way, Controller (vSmart) runs OMP and policy, Manager (vManage) is the GUI and configuration.",
      hi: "Components mix karna. Validator (vBond) authenticate karta hai aur raasta batata hai, Controller (vSmart) OMP aur policy chalata hai, Manager (vManage) GUI aur configuration hai.",
    },
    {
      en: "Assuming AAR fails over only when a link goes down. It moves traffic when a tunnel that is still up breaks the SLA for that application.",
      hi: "Yeh maan lena ki AAR sirf link down hone par fail over karta hai. Woh tab bhi traffic shift karta hai jab tunnel up ho lekin us application ki SLA tod raha ho.",
    },
    {
      en: "Swapping the SD-Access protocols. LISP is the control plane (where is the endpoint), VXLAN is the data plane (carry the frame), IS-IS is the underlay.",
      hi: "SD-Access ke protocols ulat dena. LISP control plane hai (endpoint kahan hai), VXLAN data plane hai (frame le jaana), IS-IS underlay hai.",
    },
    {
      en: "Believing SD-WAN and SD-Access remove the need for routing knowledge. The overlay depends on the underlay, and red tunnels are fixed with routing, NAT, MTU and IPsec skills.",
      hi: "Yeh maanna ki SD-WAN aur SD-Access ke baad routing knowledge ki zaroorat nahi. Overlay underlay par depend karta hai, aur red tunnels routing, NAT, MTU aur IPsec skills se hi theek hote hain.",
    },
  ],
  recap: [
    { en: "Catalyst SD-WAN: Manager (vManage) = management, Controller (vSmart) = control with OMP, Validator (vBond) = orchestration and onboarding, WAN Edge = data plane.", hi: "Catalyst SD-WAN: Manager (vManage) = management, Controller (vSmart) = OMP ke saath control, Validator (vBond) = orchestration aur onboarding, WAN Edge = data plane." },
    { en: "Edges advertise prefixes, TLOCs (system IP + colour + encapsulation) and keys to the Controller, then build IPsec tunnels directly to each other over every transport.", hi: "Edges prefixes, TLOCs (system IP + colour + encapsulation) aur keys Controller ko advertise karte hain, phir har transport par seedha aapas mein IPsec tunnels banate hain." },
    { en: "BFD measures loss, latency and jitter on every tunnel; application-aware routing moves an application off any tunnel that breaks its SLA class.", hi: "BFD har tunnel par loss, latency aur jitter measure karta hai; application-aware routing kisi application ko us tunnel se hata deta hai jo uski SLA class tod de." },
    { en: "ZTP: new router, DHCP, Plug and Play cloud, Validator, Manager pushes configuration.", hi: "ZTP: naya router, DHCP, Plug and Play cloud, Validator, phir Manager configuration push karta hai." },
    { en: "SD-Access: IS-IS underlay, VXLAN data plane, LISP control plane, SGTs for policy; roles are edge, border, control plane and intermediate nodes; Catalyst Center manages it, ISE assigns identity.", hi: "SD-Access: IS-IS underlay, VXLAN data plane, LISP control plane, policy ke liye SGTs; roles hain edge, border, control plane aur intermediate nodes; Catalyst Center manage karta hai, ISE identity deta hai." },
    { en: "Virtual networks (VRFs) give macro-segmentation; SGTs give micro-segmentation inside a VN.", hi: "Virtual networks (VRFs) macro-segmentation dete hain; SGTs ek VN ke andar micro-segmentation dete hain." },
  ],
  quiz: [
    {
      q: {
        en: "A factory-new WAN Edge is powered on at a branch. Which component first authenticates it and tells it where the Controllers and Managers are?",
        hi: "Branch par ek factory-new WAN Edge power on hota hai. Kaunsa component sabse pehle use authenticate karta hai aur batata hai ki Controllers aur Managers kahan hain?",
      },
      options: [
        { en: "SD-WAN Manager (vManage)", hi: "SD-WAN Manager (vManage)" },
        { en: "SD-WAN Controller (vSmart)", hi: "SD-WAN Controller (vSmart)" },
        { en: "SD-WAN Validator (vBond)", hi: "SD-WAN Validator (vBond)" },
        { en: "The nearest WAN Edge at the data centre", hi: "Data centre ka sabse nazdeek WAN Edge" },
      ],
      answer: 2,
      explain: {
        en: "The Validator is the orchestration plane and the first point of contact. It checks the device against the authorised list and hands out the Controller and Manager addresses. The Manager pushes configuration only after that, and the Controller runs OMP.",
        hi: "Validator orchestration plane hai aur pehla contact point. Woh device ko authorised list se check karta hai aur Controller aur Manager ke addresses deta hai. Manager configuration uske baad push karta hai, aur Controller OMP chalata hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Voice SLA: loss 1%, latency 150 ms, jitter 30 ms; preferred colour biz-internet. BR1's tunnels to the DC measure mpls 0% / 60 ms / 3 ms and biz-internet 0.5% / 160 ms / 10 ms. Where does BR1 send voice?",
        hi: "Voice SLA: loss 1%, latency 150 ms, jitter 30 ms; preferred colour biz-internet. BR1 ke DC wale tunnels ka measurement: mpls 0% / 60 ms / 3 ms aur biz-internet 0.5% / 160 ms / 10 ms. BR1 voice kahan bhejega?",
      },
      options: [
        { en: "Over mpls, because biz-internet's latency breaks the SLA", hi: "mpls par, kyunki biz-internet ki latency SLA todti hai" },
        { en: "Over biz-internet, because it is the preferred colour", hi: "biz-internet par, kyunki woh preferred colour hai" },
        { en: "It drops the voice, because the preferred colour fails", hi: "Voice drop karega, kyunki preferred colour fail hai" },
        { en: "Load-balanced across both, because loss is under 1% on both", hi: "Dono par load-balance, kyunki dono par loss 1% se kam hai" },
      ],
      answer: 0,
      explain: {
        en: "A tunnel must meet every limit. biz-internet's loss is fine but 160 ms is over 150 ms, so it is not eligible. The preference only chooses among tunnels that meet the SLA, and mpls is the only one left.",
        hi: "Tunnel ko har limit meet karni hogi. biz-internet ka loss theek hai lekin 160 ms 150 ms se zyada hai, isliye woh eligible nahi. Preference sirf SLA meet karne wale tunnels mein se chunti hai, aur sirf mpls bacha hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Which statement about the SD-WAN Controller (formerly vSmart) is correct?",
        hi: "SD-WAN Controller (pehle vSmart) ke baare mein kaunsa statement sahi hai?",
      },
      options: [
        { en: "It forwards traffic between branches that cannot reach each other directly", hi: "Woh un branches ke beech traffic forward karta hai jo seedha ek doosre tak nahi pahunch sakti" },
        { en: "It is the GUI where engineers build device templates", hi: "Yeh woh GUI hai jahan engineers device templates banate hain" },
        { en: "It needs a public IP so new edges behind NAT can find it first", hi: "Use public IP chahiye taaki NAT ke peeche ke naye edges pehle use dhoondh sakein" },
        { en: "It receives routes, TLOCs and keys over OMP, applies policy and sends them to the other edges", hi: "Woh OMP se routes, TLOCs aur keys leta hai, policy apply karta hai aur unhe baaki edges ko bhejta hai" },
      ],
      answer: 3,
      explain: {
        en: "The Controller is the control plane: an OMP route reflector with policy. It carries no user data, so it never forwards traffic between branches. The GUI with templates is the Manager, and the first contact that needs a public IP is the Validator.",
        hi: "Controller control plane hai: policy ke saath OMP route reflector. Woh user data nahi le jaata, isliye branches ke beech traffic kabhi forward nahi karta. Templates wala GUI Manager hai, aur public IP wala pehla contact Validator hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "In SD-Access, which protocol lets an edge switch find out which other edge switch an endpoint is connected to?",
        hi: "SD-Access mein kaunsa protocol edge switch ko batata hai ki koi endpoint kis doosre edge switch se connected hai?",
      },
      options: [
        { en: "VXLAN", hi: "VXLAN" },
        { en: "LISP", hi: "LISP" },
        { en: "IS-IS", hi: "IS-IS" },
        { en: "OMP", hi: "OMP" },
      ],
      answer: 1,
      explain: {
        en: "LISP is the fabric control plane: edges register their endpoints with the control plane node and query it for others. VXLAN only carries the frames, IS-IS routes the underlay loopbacks, and OMP belongs to SD-WAN.",
        hi: "LISP fabric ka control plane hai: edges apne endpoints control plane node ke paas register karte hain aur doosron ke liye use query karte hain. VXLAN sirf frames le jaata hai, IS-IS underlay loopbacks route karta hai, aur OMP SD-WAN ka hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "In an SD-Access campus, a contractor moves from building A to building B and gets a different IP address. What keeps the same access rules applied to them?",
        hi: "SD-Access campus mein ek contractor building A se building B jaata hai aur use naya IP address milta hai. Kya cheez unpar same access rules lagaye rakhti hai?",
      },
      options: [
        { en: "ACLs on every switch that list the contractor's old and new IP addresses", hi: "Har switch par ACLs jinme contractor ke purane aur naye IP addresses hain" },
        { en: "The same VLAN number configured in both buildings", hi: "Dono buildings mein configure kiya gaya same VLAN number" },
        { en: "A scalable group tag assigned from their identity and carried in the VXLAN header", hi: "Identity se assign kiya gaya scalable group tag jo VXLAN header mein jaata hai" },
        { en: "The control plane node copying their MAC address table entry", hi: "Control plane node ka unki MAC address table entry copy karna" },
      ],
      answer: 2,
      explain: {
        en: "ISE assigns the group (SGT) from who the user is, wherever they connect, and policy is written between groups. The IP address can change without touching any rule.",
        hi: "ISE group (SGT) user ki identity se assign karta hai, chahe woh kahin bhi connect ho, aur policy groups ke beech likhi hoti hai. IP address badal sakta hai bina kisi rule ko chhuye.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "BR1 and BR2 both have an mpls and a biz-internet TLOC, and the default full-mesh topology is in use. How does a packet from BR1's LAN reach BR2's LAN?",
        hi: "BR1 aur BR2 dono ke paas mpls aur biz-internet TLOC hai, aur default full-mesh topology use ho rahi hai. BR1 ke LAN se packet BR2 ke LAN tak kaise pahunchta hai?",
      },
      options: [
        { en: "BR1 sends it to the Controller, which forwards it to BR2", hi: "BR1 use Controller ko bhejta hai, aur Controller BR2 ko forward karta hai" },
        { en: "Through an IPsec tunnel that BR1 built directly to one of BR2's TLOCs", hi: "Ek IPsec tunnel se jo BR1 ne seedha BR2 ke kisi TLOC tak banaya hai" },
        { en: "Through the Manager, which applies policy to each packet", hi: "Manager ke through, jo har packet par policy apply karta hai" },
        { en: "Unencrypted over MPLS, because MPLS is a private network", hi: "MPLS par bina encryption ke, kyunki MPLS private network hai" },
      ],
      answer: 1,
      explain: {
        en: "Edges build IPsec tunnels straight to remote TLOCs using keys the Controller distributed. Controllers never carry data. SD-WAN encrypts over MPLS too, because MPLS separates customers but does not encrypt (lesson 1.13).",
        hi: "Edges Controller ki di hui keys se remote TLOCs tak seedha IPsec tunnels banate hain. Controllers kabhi data nahi le jaate. SD-WAN MPLS par bhi encrypt karta hai, kyunki MPLS customers ko alag toh rakhta hai par encrypt nahi karta (lesson 1.13).",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "dE7VUuXJs0k",
      title: "SDN, SD-WAN, & SD-Access Simplified... Seriously!",
      channel: "Kevin Wallace Training, LLC",
      lang: "en",
      note: { en: "Covers both halves of this lesson: the SD-WAN components and the SD-Access fabric, with diagrams.", hi: "Is lesson ke dono hisse cover karta hai: SD-WAN components aur SD-Access fabric, diagrams ke saath." },
    },
    {
      id: "isMnWZqAh0k",
      title: "What is SD-WAN? say GOODBYE to MPLS, DMVPN, iWAN... w/ SDN, Cisco and Viptela",
      channel: "NetworkChuck",
      lang: "en",
      note: { en: "A lighter introduction to why SD-WAN replaced hand-built WANs and how the Viptela components fit together.", hi: "Halka introduction ki SD-WAN ne haath se bane WANs ki jagah kyun li aur Viptela ke components kaise fit hote hain." },
    },
    {
      id: "w1CVeIb8jQM",
      title: "174. CCNP Encore + Enarsi | SDWAN - Components of SDWAN",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walkthrough of the SD-WAN components (vManage, vSmart, vBond, edge routers) and the job of each. It uses the older v-names.", hi: "SD-WAN components (vManage, vSmart, vBond, edge routers) aur har ek ke kaam ka Hindi walkthrough. Isme purane v-names use hue hain." },
    },
    {
      id: "HpNx08Ufk3c",
      title: "145. Free CCNA (NEW) | SDA Fabric, Underlay, Overlay & VXLAN",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walkthrough of the SD-Access fabric, underlay, overlay and VXLAN.", hi: "SD-Access fabric, underlay, overlay aur VXLAN ka Hindi walkthrough." },
    },
  ],
  lab: {
    title: { en: "Explore a real SD-WAN fabric in Cisco DevNet Sandbox", hi: "Cisco DevNet Sandbox mein asli SD-WAN fabric explore karo" },
    steps: [
      { en: "Packet Tracer cannot run SD-WAN. Create a free Cisco DevNet account and open or reserve a Catalyst SD-WAN sandbox.", hi: "Packet Tracer SD-WAN nahi chala sakta. Free Cisco DevNet account banao aur ek Catalyst SD-WAN sandbox open ya reserve karo." },
      { en: "Log in to SD-WAN Manager. On the dashboard, find how many Validators, Controllers and WAN Edges there are and how many control connections are up.", hi: "SD-WAN Manager mein login karo. Dashboard par dhoondho ki kitne Validators, Controllers aur WAN Edges hain aur kitne control connections up hain." },
      { en: "Open one WAN Edge in the monitoring pages. Write down its system IP, site ID and the colour of each TLOC.", hi: "Monitoring pages mein ek WAN Edge kholo. Uska system IP, site ID aur har TLOC ka colour note karo." },
      { en: "Look at its tunnels (BFD sessions): how many are up, and does the number match remote sites multiplied by colours? If it is higher, some cross-colour tunnels formed; if lower, a colour is restricted or a policy limits the topology. Note the loss, latency and jitter of each.", hi: "Uske tunnels (BFD sessions) dekho: kitne up hain, aur kya yeh number remote sites aur colours ke guna se match karta hai? Zyada hai toh kuch cross-colour tunnels bane hain; kam hai toh koi colour restricted hai ya policy topology limit kar rahi hai. Har tunnel ka loss, latency aur jitter note karo." },
      { en: "Find the configured policies and any SLA classes. For each class, say which of the tunnels you noted would qualify.", hi: "Configured policies aur SLA classes dhoondho. Har class ke liye batao ki tumhare note kiye tunnels mein se kaun qualify karega." },
      { en: "If the sandbox gives CLI access to an edge, run `show sdwan control connections` and `show sdwan bfd sessions` and match them to what the GUI showed.", hi: "Agar sandbox edge ka CLI access deta hai, toh `show sdwan control connections` aur `show sdwan bfd sessions` chalao aur unhe GUI ke data se match karo." },
    ],
  },
};

export default lesson;
