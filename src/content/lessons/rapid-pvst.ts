import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "rapid-pvst",
  intro: {
    en: "Classic STP keeps a network loop-free, but it takes 30 to 50 seconds to recover from a failure, and every PC that boots waits 30 seconds before it can send a frame. Rapid PVST+ keeps the same root bridge and cost rules you already know, adds pre-computed backup ports and a quick handshake between neighbours, and usually recovers in about a second. On top of it sits the STP toolkit: PortFast for host ports, and BPDU Guard, BPDU Filter, Root Guard and Loop Guard to stop users and faulty links from breaking the tree.",
    hi: "Classic STP network ko loop-free rakhta hai, lekin failure se recover hone mein 30 se 50 second leta hai, aur boot hone wala har PC frame bhejne se pehle 30 second wait karta hai. Rapid PVST+ wahi root bridge aur cost rules rakhta hai jo tum pehle se jaante ho, saath mein pehle se calculate kiye hue backup ports aur neighbours ke beech ek quick handshake jodta hai, aur aam taur par lagbhag ek second mein recover kar leta hai. Iske upar STP toolkit hai: host ports ke liye PortFast, aur BPDU Guard, BPDU Filter, Root Guard aur Loop Guard, taaki users ya kharab links tree ko na tod sakein.",
  },
  outcomes: [
    { en: "Compare 802.1D, PVST+, RSTP and Rapid PVST+ and say which one `show spanning-tree` is running", hi: "802.1D, PVST+, RSTP aur Rapid PVST+ compare kar sako aur bata sako ki `show spanning-tree` kaunsa chala raha hai" },
    { en: "Name the RSTP port roles (root, designated, alternate, backup) and states (discarding, learning, forwarding)", hi: "RSTP ke port roles (root, designated, alternate, backup) aur states (discarding, learning, forwarding) bata sako" },
    { en: "Explain how an alternate port and the proposal/agreement handshake make convergence fast", hi: "Samjha sako ki alternate port aur proposal/agreement handshake convergence ko fast kaise banate hain" },
    { en: "Configure Rapid PVST+ with a different root per VLAN using `root primary`, `root secondary` and `priority`", hi: "`root primary`, `root secondary` aur `priority` se har VLAN ka alag root rakh kar Rapid PVST+ configure kar sako" },
    { en: "Choose and configure PortFast, BPDU Guard, BPDU Filter, Root Guard and Loop Guard for the right ports", hi: "Sahi ports ke liye PortFast, BPDU Guard, BPDU Filter, Root Guard aur Loop Guard chun kar configure kar sako" },
  ],
  sections: [
    {
      id: "why-rapid",
      heading: { en: "Why classic STP is not enough", hi: "Classic STP kaafi kyun nahi hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 2.6 the SW1-SW3 link failed and SW3 spent 15 seconds listening and 15 seconds learning before PC-B could talk again. If SW3 had only stopped hearing BPDUs, it would have waited another 20 seconds of Max Age first. Those timers exist because an 802.1D switch cannot ask its neighbour whether forwarding is safe, so it waits long enough for the whole network to catch up. Voice calls drop and applications time out long before 50 seconds pass.",
            hi: "Lesson 2.6 mein SW1-SW3 link fail hua aur PC-B ke dobara baat kar paane se pehle SW3 ne 15 second listening aur 15 second learning mein bitaye. Agar SW3 ko bas BPDUs milna band hote, toh woh pehle Max Age ke 20 second aur wait karta. Yeh timers isliye hain kyunki 802.1D switch apne neighbour se pooch nahi sakta ki forward karna safe hai ya nahi, isliye woh itna wait karta hai ki poora network update ho jaaye. 50 second hone se bahut pehle voice calls kat jaati hain aur applications time out ho jaati hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "There is a second limit. IEEE 802.1D builds **one** tree for all VLANs, so the same port blocks for every VLAN and that link carries nothing. Cisco's answers, and the IEEE ones, are these:",
            hi: "Ek doosri limit bhi hai. IEEE 802.1D saare VLANs ke liye **ek hi** tree banata hai, isliye har VLAN ke liye wahi port block hota hai aur us link par kuch bhi nahi chalta. Cisco aur IEEE ne iske yeh solutions diye:",
          },
        },
        {
          type: "table",
          caption: { en: "The STP versions you will meet", hi: "STP ke versions jo tumhe milenge" },
          columns: ["Version", { en: "Defined by", hi: "Kisne banaya" }, { en: "Trees", hi: "Trees" }, { en: "Recovery after a failure", hi: "Failure ke baad recovery" }],
          rows: [
            ["STP (802.1D)", "IEEE", { en: "One for all VLANs", hi: "Saare VLANs ka ek" }, "30-50 s"],
            ["PVST+", "Cisco", { en: "One 802.1D tree per VLAN", hi: "Har VLAN ka ek 802.1D tree" }, "30-50 s"],
            ["RSTP (802.1w)", "IEEE", { en: "One for all VLANs", hi: "Saare VLANs ka ek" }, { en: "About 1 s, at most ~6 s", hi: "Lagbhag 1 s, zyada se zyada ~6 s" }],
            ["Rapid PVST+", "Cisco", { en: "One RSTP tree per VLAN", hi: "Har VLAN ka ek RSTP tree" }, { en: "About 1 s, at most ~6 s", hi: "Lagbhag 1 s, zyada se zyada ~6 s" }],
            ["MST (802.1s)", "IEEE", { en: "One RSTP tree per group of VLANs", hi: "VLANs ke har group ka ek RSTP tree" }, { en: "Same as RSTP", hi: "RSTP jaisa" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "What the exam calls it", hi: "Exam ise kya kehta hai" },
          text: {
            en: "CCNA topic 2.5 is \"Rapid PVST+\". Know that it is Cisco's per-VLAN version of RSTP (802.1w), and that `show spanning-tree` prints `protocol rstp` for it and `protocol ieee` for classic PVST+. MST is beyond the CCNA. The default mode depends on platform and IOS version (a Catalyst 2960 runs PVST+), so check it rather than assume.",
            hi: "CCNA topic 2.5 ka naam \"Rapid PVST+\" hai. Yaad rakho ki yeh RSTP (802.1w) ka Cisco wala per-VLAN version hai, aur iske liye `show spanning-tree` `protocol rstp` print karta hai, jabki classic PVST+ ke liye `protocol ieee`. MST CCNA se aage ka topic hai. Default mode platform aur IOS version par depend karta hai (Catalyst 2960 PVST+ chalata hai), isliye assume mat karo, check karo.",
          },
        },
      ],
    },
    {
      id: "roles-and-states",
      heading: { en: "RSTP port roles and states", hi: "RSTP port roles aur states" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The election does not change. The lowest bridge ID is still root, root ports and designated ports are chosen with the same costs (1 Gbps = 4) and tie-breakers. What changes is the name for every port that is not root or designated. RSTP splits it into two roles, so the switch already knows what that port could do in a failure.",
            hi: "Election nahi badalta. Sabse kam bridge ID ab bhi root hai, aur root ports aur designated ports wahi costs (1 Gbps = 4) aur tie-breakers se chune jaate hain. Badalta hai un ports ka naam jo na root hain na designated. RSTP unhe do roles mein baant deta hai, taaki switch ko pehle se pata ho ki failure mein woh port kya kar sakta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "RSTP port roles", hi: "RSTP port roles" },
          columns: ["Role", { en: "What it is", hi: "Kya hai" }, { en: "In show output", hi: "Show output mein" }],
          rows: [
            ["Root", { en: "Best path to the root bridge; one per non-root switch", hi: "Root bridge tak best path; har non-root switch par ek" }, "Root"],
            ["Designated", { en: "The forwarding port on each link; every port on the root", hi: "Har link par forwarding port; root ke saare ports" }, "Desg"],
            ["Alternate", { en: "Discarding; receives a usable path to the root from **another switch**. Becomes root port at once if the root port fails", hi: "Discarding; **doosre switch** se root tak ka usable path receive karta hai. Root port fail ho toh turant root port ban jaata hai" }, "Altn"],
            ["Backup", { en: "Discarding; a second port of the **same switch** on a shared segment (a hub) where this switch is already designated", hi: "Discarding; **isi switch** ka doosra port us shared segment (hub) par jahan yeh switch pehle se designated hai" }, "Back"],
            ["Disabled", { en: "Shut down or no link; takes no part in STP", hi: "Shutdown hai ya link nahi hai; STP mein hissa nahi leta" }, "-"],
          ],
        },
        {
          type: "p",
          text: {
            en: "RSTP also merges the three 802.1D states that do not forward and do not learn into one, **discarding**:",
            hi: "RSTP 802.1D ke un teen states ko, jo na forward karte hain na MAC seekhte hain, ek state mein mila deta hai: **discarding**.",
          },
        },
        {
          type: "table",
          caption: { en: "802.1D states and their RSTP equivalents", hi: "802.1D states aur unke RSTP equivalents" },
          columns: ["802.1D", "RSTP", { en: "Forwards data", hi: "Data forward" }, { en: "Learns MACs", hi: "MAC seekhta" }],
          rows: [
            ["Disabled", "Discarding", "No", "No"],
            ["Blocking", "Discarding", "No", "No"],
            ["Listening", "Discarding", "No", "No"],
            ["Learning", "Learning", "No", "Yes"],
            ["Forwarding", "Forwarding", "Yes", "Yes"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "IOS still prints BLK", hi: "IOS ab bhi BLK print karta hai" },
          text: {
            en: "In Rapid PVST+ mode the `Sts` column of `show spanning-tree` still shows `BLK` for a discarding port, next to `LRN` and `FWD`. Read `Altn BLK` as \"alternate, discarding\".",
            hi: "Rapid PVST+ mode mein bhi `show spanning-tree` ka `Sts` column discarding port ke liye `BLK` hi dikhata hai, `LRN` aur `FWD` ke saath. `Altn BLK` ko \"alternate, discarding\" padho.",
          },
        },
      ],
    },
    {
      id: "fast-convergence",
      heading: { en: "How RSTP converges in about a second", hi: "RSTP lagbhag ek second mein converge kaise karta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "RSTP sorts every link into a **link type**, because the fast tricks only work when exactly two switches share a link:",
            hi: "RSTP har link ko ek **link type** mein daalta hai, kyunki fast tricks sirf tab kaam karti hain jab link par theek do switches hon:",
          },
        },
        {
          type: "table",
          caption: { en: "RSTP link types", hi: "RSTP link types" },
          columns: ["Link type", { en: "How IOS decides", hi: "IOS kaise decide karta hai" }, { en: "Behaviour", hi: "Behaviour" }, "Type column"],
          rows: [
            ["Edge", { en: "You configure PortFast", hi: "Tum PortFast configure karte ho" }, { en: "Forwards at once; no TC when it comes up", hi: "Turant forward; up hone par TC nahi" }, "P2p Edge"],
            ["Point-to-point", { en: "Full duplex", hi: "Full duplex" }, { en: "Proposal/agreement, converges in milliseconds", hi: "Proposal/agreement, milliseconds mein converge" }, "P2p"],
            ["Shared", { en: "Half duplex (a hub)", hi: "Half duplex (hub)" }, { en: "No handshake; falls back to 802.1D-style timers", hi: "Handshake nahi; 802.1D jaise timers par wapas" }, "Shr"],
          ],
        },
        {
          type: "p",
          text: {
            en: "With that in place, four changes make recovery fast. The animation shows each one on the lesson 2.6 triangle, now running Rapid PVST+ in VLAN 10:",
            hi: "Iske baad chaar changes recovery ko fast banate hain. Animation inhe lesson 2.6 wale triangle par dikhata hai, jo ab VLAN 10 mein Rapid PVST+ chala raha hai:",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Every switch sends its own BPDUs** every 2 seconds on its designated ports, instead of only relaying the root's. If a port misses three in a row (6 s), the neighbour is considered gone. No 20-second Max Age wait.",
              hi: "**Har switch apne BPDUs khud bhejta hai**, har 2 second mein apne designated ports par, sirf root ke BPDUs aage nahi badhata. Agar kisi port par lagataar teen BPDUs (6 s) miss ho jaayein, toh neighbour ko gaya hua maana jaata hai. Max Age ke 20 second ka wait nahi.",
            },
            {
              en: "**The alternate port takes over immediately.** When SW3's root port Gi0/1 goes down, SW3 makes its alternate port Gi0/2 the new root port and moves it straight to forwarding, with no listening or learning.",
              hi: "**Alternate port turant takeover karta hai.** Jab SW3 ka root port Gi0/1 down hota hai, SW3 apne alternate port Gi0/2 ko naya root port bana kar seedha forwarding mein daal deta hai, na listening na learning.",
            },
            {
              en: "**Proposal and agreement replace the timers.** When a point-to-point link comes up, the designated end starts discarding and sends a BPDU with the Proposal flag. The other switch **syncs** (puts its other non-edge ports into discarding so no loop can form), then replies with an Agreement, and both ends forward at once.",
              hi: "**Timers ki jagah proposal aur agreement.** Jab point-to-point link up hota hai, designated end discarding se shuru karta hai aur Proposal flag wala BPDU bhejta hai. Doosra switch **sync** karta hai (apne baaki non-edge ports discarding mein daal deta hai taaki loop na bane), phir Agreement bhejta hai, aur dono ends turant forward karne lagte hain.",
            },
            {
              en: "**Topology changes flush tables at once.** Only a non-edge port moving to forwarding counts as a change. That switch sends BPDUs with the TC flag, and every switch that receives one flushes the MAC addresses on its other non-edge ports straight away and passes the TC on, instead of waiting 15 seconds.",
              hi: "**Topology change par tables turant flush.** Sirf non-edge port ka forwarding mein jaana hi change maana jaata hai. Woh switch TC flag wale BPDUs bhejta hai, aur jis bhi switch ko yeh milta hai woh apne baaki non-edge ports ke MAC addresses turant flush karta hai aur TC aage bhej deta hai, 15 second wait nahi karta.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "It still talks to old switches", hi: "Purane switches se bhi baat karta hai" },
          text: {
            en: "If a port receives an 802.1D BPDU, RSTP runs 802.1D rules on that port only, timers included. One old switch in the path brings back the slow recovery on its links.",
            hi: "Agar kisi port par 802.1D BPDU aaye, toh RSTP sirf us port par 802.1D rules chalata hai, timers ke saath. Path mein ek bhi purana switch ho toh uske links par slow recovery wapas aa jaati hai.",
          },
        },
      ],
    },
    {
      id: "per-vlan",
      heading: { en: "One tree per VLAN: sharing the load", hi: "Har VLAN ka ek tree: load share karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Because Rapid PVST+ runs a separate tree in each VLAN, you can make a different switch root in each one. Then a link that blocks for VLAN 10 forwards for VLAN 20, and both uplinks of an access switch carry traffic. In the triangle, make SW1 root for VLAN 10 and SW2 root for VLAN 20:",
            hi: "Rapid PVST+ har VLAN mein alag tree chalata hai, isliye tum har VLAN mein alag switch ko root bana sakte ho. Tab jo link VLAN 10 ke liye block hai, woh VLAN 20 ke liye forward karta hai, aur access switch ke dono uplinks traffic carry karte hain. Triangle mein SW1 ko VLAN 10 ka root aur SW2 ko VLAN 20 ka root banao:",
          },
        },
        {
          type: "cli",
          title: { en: "Mode and roots, on SW1 and SW2 (set the mode on SW3 too)", hi: "Mode aur roots, SW1 aur SW2 par (SW3 par bhi mode set karo)" },
          lines: [
            { prompt: "SW1(config)#", cmd: "spanning-tree mode rapid-pvst" },
            { prompt: "SW1(config)#", cmd: "spanning-tree vlan 10 root primary", comment: { en: "Priority 24576, shown as 24586 in VLAN 10", hi: "Priority 24576, VLAN 10 mein 24586 dikhegi" } },
            { prompt: "SW1(config)#", cmd: "spanning-tree vlan 20 root secondary", comment: { en: "Priority 28672: takes over if SW2 fails", hi: "Priority 28672: SW2 fail ho toh yeh sambhalega" } },
            { prompt: "SW2(config)#", cmd: "spanning-tree mode rapid-pvst" },
            { prompt: "SW2(config)#", cmd: "spanning-tree vlan 20 root primary" },
            { prompt: "SW2(config)#", cmd: "spanning-tree vlan 10 root secondary" },
          ],
        },
        {
          type: "table",
          caption: { en: "SW3's uplinks with SW3 left at the default priority", hi: "SW3 ke uplinks, SW3 default priority par" },
          columns: ["VLAN", "Root", "SW3 Gi0/1 (to SW1)", "SW3 Gi0/2 (to SW2)"],
          rows: [
            ["10", "SW1", "Root FWD", { en: "Altn BLK (SW2 wins the link)", hi: "Altn BLK (link SW2 jeetta hai)" }],
            ["20", "SW2", { en: "Altn BLK (SW1 wins the link)", hi: "Altn BLK (link SW1 jeetta hai)" }, "Root FWD"],
          ],
        },
        {
          type: "p",
          text: {
            en: "`root primary` is a macro, not a permanent setting. It sets the priority to 24576, or, if 24576 would not beat the current root, to 4096 below the current root's priority. `root secondary` sets 28672. The running-config stores the resulting number, for example `spanning-tree vlan 10 priority 24576`, and nothing is recalculated later. To pick the value yourself, set it directly; it must be a multiple of 4096 from 0 to 61440:",
            hi: "`root primary` ek macro hai, permanent setting nahi. Yeh priority 24576 set karta hai, ya agar 24576 se current root nahi haarta, toh current root ki priority se 4096 kam. `root secondary` 28672 set karta hai. Running-config mein result wala number save hota hai, jaise `spanning-tree vlan 10 priority 24576`, aur baad mein kuch dobara calculate nahi hota. Value khud chunni ho toh seedha set karo; woh 0 se 61440 tak 4096 ka multiple honi chahiye:",
          },
        },
        {
          type: "cli",
          lines: [
            { prompt: "SW1(config)#", cmd: "spanning-tree vlan 10 priority 5000" },
            { out: "% Bridge Priority must be in increments of 4096." },
            { out: "% Allowed values are:" },
            { out: "  0     4096  8192  12288 16384 20480 24576 28672" },
            { out: "  32768 36864 40960 45056 49152 53248 57344 61440" },
            { prompt: "SW1(config)#", cmd: "spanning-tree vlan 10 priority 4096", comment: { en: "Accepted: BID priority becomes 4106 in VLAN 10", hi: "Accept hua: VLAN 10 mein BID priority 4106 ho jaati hai" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Secondary is not a guarantee", hi: "Secondary guarantee nahi hai" },
          text: {
            en: "`root secondary` only works because other switches sit at 32768. If someone later adds a switch with priority 28672 and a lower MAC, it beats your secondary. Root Guard, below, is how you stop a root appearing where it should not.",
            hi: "`root secondary` sirf isliye kaam karta hai kyunki baaki switches 32768 par hain. Agar baad mein koi 28672 priority aur kam MAC wala switch jod de, toh woh tumhare secondary ko hara dega. Galat jagah root aane se kaise rokna hai, woh neeche Root Guard mein hai.",
          },
        },
      ],
    },
    {
      id: "verify",
      heading: { en: "Reading show spanning-tree in Rapid PVST+", hi: "Rapid PVST+ mein show spanning-tree padhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "This is SW3 in VLAN 10, the starting point of the animation. SW3 is a Catalyst 2960, so Fa0/1 is port 1 and Gi0/1 and Gi0/2 are ports 25 and 26.",
            hi: "Yeh VLAN 10 mein SW3 hai, animation ka starting point. SW3 Catalyst 2960 hai, isliye Fa0/1 port 1 hai aur Gi0/1 aur Gi0/2 ports 25 aur 26 hain.",
          },
        },
        {
          type: "cli",
          title: { en: "SW3, VLAN 10", hi: "SW3, VLAN 10" },
          lines: [
            { prompt: "SW3#", cmd: "show spanning-tree vlan 10" },
            { out: "VLAN0010" },
            { out: "  Spanning tree enabled protocol rstp", comment: { en: "rstp = Rapid PVST+ (ieee would mean classic PVST+)", hi: "rstp = Rapid PVST+ (ieee ka matlab classic PVST+)" } },
            { out: "  Root ID    Priority    24586", comment: { en: "SW1: 24576 from root primary, plus VLAN 10", hi: "SW1: root primary se 24576, plus VLAN 10" } },
            { out: "             Address     0019.aa00.0001" },
            { out: "             Cost        4" },
            { out: "             Port        25 (GigabitEthernet0/1)" },
            { out: "             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec" },
            { out: "  Bridge ID  Priority    32778  (priority 32768 sys-id-ext 10)" },
            { out: "             Address     0019.aa00.0003" },
            { out: "Interface           Role Sts Cost      Prio.Nbr Type" },
            { out: "------------------- ---- --- --------- -------- ----------" },
            { out: "Fa0/1               Desg FWD 19        128.1    P2p Edge", comment: { en: "PC-B's port: PortFast makes it an edge port", hi: "PC-B ka port: PortFast ne ise edge port banaya" } },
            { out: "Gi0/1               Root FWD 4         128.25   P2p" },
            { out: "Gi0/2               Altn BLK 4         128.26   P2p", comment: { en: "Alternate, discarding: the ready backup path through SW2", hi: "Alternate, discarding: SW2 ke through ready backup path" } },
          ],
          note: {
            en: "Output shortened. `show spanning-tree summary` starts with `Switch is in rapid-pvst mode` and lists the VLANs this switch is root for, plus whether the PortFast, BPDU Guard, BPDU Filter and Loop Guard defaults are on.",
            hi: "Output chhota kiya gaya hai. `show spanning-tree summary` `Switch is in rapid-pvst mode` se shuru hota hai aur batata hai ki yeh switch kin VLANs ka root hai, aur PortFast, BPDU Guard, BPDU Filter aur Loop Guard ke defaults on hain ya nahi.",
          },
        },
      ],
    },
    {
      id: "portfast-bpdu",
      heading: { en: "PortFast, BPDU Guard and BPDU Filter", hi: "PortFast, BPDU Guard aur BPDU Filter" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A PC, printer or server port can never create a loop, so it does not need to wait. **PortFast** makes the port an **edge port**: it goes to forwarding the moment the link comes up, and it does not trigger a topology change (no MAC flush across the network) when it goes up or down. It still sends BPDUs, and if one arrives the port stops being an edge port and runs STP normally.",
            hi: "PC, printer ya server wala port kabhi loop nahi bana sakta, isliye use wait karne ki zaroorat nahi. **PortFast** port ko **edge port** bana deta hai: link aate hi woh forwarding mein chala jaata hai, aur up ya down hone par topology change trigger nahi karta (poore network mein MAC flush nahi hota). BPDUs woh phir bhi bhejta hai, aur agar ek BPDU aa jaaye toh port edge port nahi rehta aur normal STP chalata hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "That fallback is too slow to trust: a user who plugs in a switch, or cables two wall ports together, gets a forwarding port before STP notices anything. **BPDU Guard** closes the gap. If any BPDU arrives, the port is **err-disabled** (shut down by the switch). It stays down until an engineer enters `shutdown` then `no shutdown`, or until `errdisable recovery` brings it back (default interval 300 s).",
            hi: "Is fallback par bharosa nahi kar sakte, woh bahut slow hai: koi user switch laga de, ya do wall ports ko aapas mein cable kar de, toh STP ke kuch notice karne se pehle port forwarding mein hota hai. **BPDU Guard** yeh gap band karta hai. Koi bhi BPDU aaya toh port **err-disabled** ho jaata hai (switch khud use band kar deta hai). Woh tab tak down rehta hai jab tak engineer `shutdown` aur phir `no shutdown` na kare, ya `errdisable recovery` use wapas na laaye (default interval 300 s).",
          },
        },
        {
          type: "cli",
          title: { en: "Every user port on SW3", hi: "SW3 ke saare user ports" },
          lines: [
            { prompt: "SW3(config)#", cmd: "interface range fastethernet0/1 - 24" },
            { prompt: "SW3(config-if-range)#", cmd: "spanning-tree portfast" },
            { out: "%Warning: portfast should only be enabled on ports connected to a single" },
            { out: " host. Connecting hubs, concentrators, switches, bridges, etc... to this" },
            { out: " interface  when portfast is enabled, can cause temporary bridging loops." },
            { prompt: "SW3(config-if-range)#", cmd: "spanning-tree bpduguard enable" },
            { comment: { en: "Later, a user plugs a switch into Fa0/2:", hi: "Baad mein ek user Fa0/2 mein switch laga deta hai:" } },
            { out: "%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port Fa0/2 with BPDU Guard enabled. Disabling port." },
            { out: "%PM-4-ERR_DISABLE: bpduguard error detected on Fa0/2, putting Fa0/2 in err-disable state" },
          ],
          note: {
            en: "Warning text shortened. PortFast only takes effect on access ports; use `spanning-tree portfast trunk` for a trunk to a server or hypervisor.",
            hi: "Warning text chhota kiya gaya hai. PortFast sirf access ports par effect karta hai; server ya hypervisor ki taraf trunk ke liye `spanning-tree portfast trunk` use karo.",
          },
        },
        {
          type: "cli",
          title: { en: "Finding and fixing the port", hi: "Port dhoondhna aur theek karna" },
          lines: [
            { prompt: "SW3#", cmd: "show interfaces status err-disabled" },
            { out: "Port      Name               Status       Reason               Err-disabled Vlans" },
            { out: "Fa0/2                        err-disabled bpduguard" },
            { comment: { en: "Remove the rogue switch first, then:", hi: "Pehle rogue switch hatao, phir:" } },
            { prompt: "SW3(config)#", cmd: "interface fastethernet0/2" },
            { prompt: "SW3(config-if)#", cmd: "shutdown" },
            { prompt: "SW3(config-if)#", cmd: "no shutdown" },
          ],
        },
        {
          type: "p",
          text: {
            en: "**BPDU Filter** stops a port sending BPDUs. How it behaves depends on where you configure it:",
            hi: "**BPDU Filter** port ko BPDUs bhejne se rokta hai. Yeh kaise behave karta hai, yeh is par depend karta hai ki tum ise kahan configure karte ho:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Global**, `spanning-tree portfast bpdufilter default`: applies to PortFast ports. They stop sending BPDUs, but if one arrives the port loses PortFast and BPDU Filter and runs STP normally. Reasonably safe.",
              hi: "**Global**, `spanning-tree portfast bpdufilter default`: PortFast ports par lagta hai. Woh BPDUs bhejna band kar dete hain, lekin agar ek BPDU aa jaaye toh port PortFast aur BPDU Filter kho deta hai aur normal STP chalata hai. Kaafi had tak safe.",
            },
            {
              en: "**Interface**, `spanning-tree bpdufilter enable`: the port neither sends nor processes BPDUs, which turns STP off on that port. A loop through it will never be detected. Use it only where you deliberately want no STP exchange, such as a link to another organisation's network.",
              hi: "**Interface**, `spanning-tree bpdufilter enable`: port na BPDUs bhejta hai na process karta hai, yaani us port par STP off ho jaata hai. Uske through bana loop kabhi detect nahi hoga. Ise sirf wahan use karo jahan tum jaan-boojh kar STP exchange nahi chahte, jaise kisi doosri organisation ke network ki taraf link.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Turn it on once, globally", hi: "Ek baar, globally on karo" },
          text: {
            en: "`spanning-tree portfast default` enables PortFast on every access port, and `spanning-tree portfast bpduguard default` enables BPDU Guard on every PortFast port. Newer IOS XE releases write these as `spanning-tree portfast edge default` and `spanning-tree portfast edge bpduguard default`.",
            hi: "`spanning-tree portfast default` har access port par PortFast on karta hai, aur `spanning-tree portfast bpduguard default` har PortFast port par BPDU Guard on karta hai. Naye IOS XE releases inhe `spanning-tree portfast edge default` aur `spanning-tree portfast edge bpduguard default` likhte hain.",
          },
        },
      ],
    },
    {
      id: "root-loop-guard",
      heading: { en: "Root Guard and Loop Guard", hi: "Root Guard aur Loop Guard" },
      blocks: [
        {
          type: "p",
          text: {
            en: "BPDU Guard is for ports where no switch should ever be. Two more guards protect ports where switches are expected, but where certain BPDUs, or missing BPDUs, mean trouble.",
            hi: "BPDU Guard un ports ke liye hai jahan kabhi koi switch hona hi nahi chahiye. Do aur guards un ports ko protect karte hain jahan switches expected hain, lekin kuch khaas BPDUs, ya BPDUs ka na aana, problem ka sign hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The STP toolkit side by side", hi: "STP toolkit ek saath" },
          columns: [{ en: "Feature", hi: "Feature" }, { en: "Put it on", hi: "Kahan lagao" }, { en: "Trigger", hi: "Trigger" }, { en: "Action and recovery", hi: "Action aur recovery" }],
          rows: [
            ["BPDU Guard", { en: "PortFast ports to hosts", hi: "Hosts wale PortFast ports" }, { en: "Any BPDU", hi: "Koi bhi BPDU" }, { en: "Err-disabled; manual or errdisable recovery", hi: "Err-disabled; manual ya errdisable recovery" }],
            ["Root Guard", { en: "Designated ports facing switches that must never be root (distribution ports to access switches)", hi: "Designated ports jo aise switches ki taraf hain jo kabhi root nahi bane chahiye (distribution se access switches wale ports)" }, { en: "A superior BPDU (better root)", hi: "Superior BPDU (behtar root)" }, { en: "Root-inconsistent (blocked) in that VLAN; recovers by itself when superior BPDUs stop", hi: "Us VLAN mein root-inconsistent (blocked); superior BPDUs band hote hi khud recover" }],
            ["Loop Guard", { en: "Root and alternate ports on non-root switches", hi: "Non-root switches ke root aur alternate ports" }, { en: "BPDUs stop arriving", hi: "BPDUs aana band" }, { en: "Loop-inconsistent (blocked) instead of forwarding; recovers when BPDUs return", hi: "Forwarding ki jagah loop-inconsistent (blocked); BPDUs wapas aate hi recover" }],
            ["BPDU Filter", { en: "Rarely; see above", hi: "Kabhi kabhi; upar dekho" }, "-", { en: "Stops sending BPDUs", hi: "BPDUs bhejna band" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "**Root Guard** example: a distribution switch's Gi1/0/5 faces an access switch. That access switch may run STP and send BPDUs, but if it ever advertises a better root (someone set its priority to 0), the distribution switch logs `%SPANTREE-2-ROOTGUARD_BLOCK` and blocks Gi1/0/5 for that VLAN instead of moving the root to the edge of the network.",
            hi: "**Root Guard** example: distribution switch ka Gi1/0/5 ek access switch ki taraf hai. Woh access switch STP chala sakta hai aur BPDUs bhej sakta hai, lekin agar woh kabhi behtar root advertise kare (kisi ne uski priority 0 kar di), toh distribution switch `%SPANTREE-2-ROOTGUARD_BLOCK` log karta hai aur root ko network ke edge par shift hone dene ki jagah us VLAN ke liye Gi1/0/5 block kar deta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Loop Guard** example: SW3's alternate port Gi0/2 stays discarding only because SW2 keeps sending BPDUs. If a fibre strand fails so that SW2's BPDUs no longer reach SW3 but SW3's frames still reach SW2 (a unidirectional link), SW3 would age out the information, make Gi0/2 designated and forward: a loop. With Loop Guard, Gi0/2 goes loop-inconsistent instead.",
            hi: "**Loop Guard** example: SW3 ka alternate port Gi0/2 sirf isliye discarding hai kyunki SW2 lagataar BPDUs bhej raha hai. Agar ek fibre strand aise fail ho ki SW2 ke BPDUs SW3 tak na pahunchein lekin SW3 ke frames SW2 tak pahunchte rahein (unidirectional link), toh SW3 information age out karke Gi0/2 ko designated bana dega aur forward karega: loop. Loop Guard ke saath Gi0/2 iski jagah loop-inconsistent ho jaata hai.",
          },
        },
        {
          type: "cli",
          lines: [
            { prompt: "DSW1(config)#", cmd: "interface gigabitethernet1/0/5" },
            { prompt: "DSW1(config-if)#", cmd: "spanning-tree guard root" },
            { prompt: "SW3(config)#", cmd: "interface gigabitethernet0/2" },
            { prompt: "SW3(config-if)#", cmd: "spanning-tree guard loop", comment: { en: "Or globally: spanning-tree loopguard default", hi: "Ya globally: spanning-tree loopguard default" } },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Telling the guards apart", hi: "Guards mein fark kaise karein" },
          text: {
            en: "BPDU Guard: any BPDU, err-disable, manual fix. Root Guard: superior BPDU, blocks, fixes itself. Loop Guard: missing BPDUs, blocks, fixes itself. BPDU Filter: no BPDUs sent, and on an interface, none processed either.",
            hi: "BPDU Guard: koi bhi BPDU, err-disable, manual fix. Root Guard: superior BPDU, block, khud theek. Loop Guard: BPDUs gayab, block, khud theek. BPDU Filter: BPDUs nahi bhejta, aur interface par lagao toh receive bhi process nahi karta.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "RSTP (802.1w)", def: { en: "Rapid Spanning Tree: same election as 802.1D, but with alternate ports, a proposal/agreement handshake and faster failure detection.", hi: "Rapid Spanning Tree: election 802.1D jaisa, lekin alternate ports, proposal/agreement handshake aur tez failure detection ke saath." } },
    { term: "Rapid PVST+", def: { en: "Cisco's version of RSTP that runs a separate tree in every VLAN.", hi: "RSTP ka Cisco version jo har VLAN mein alag tree chalata hai." } },
    { term: "Alternate port", def: { en: "A discarding port that receives a usable path to the root from another switch and becomes root port at once if the root port fails.", hi: "Discarding port jise doosre switch se root tak ka usable path milta hai, aur root port fail hone par turant root port ban jaata hai." } },
    { term: "Backup port", def: { en: "A discarding port on the same shared segment as a designated port of the same switch.", hi: "Discarding port jo usi switch ke designated port wale shared segment par hai." } },
    { term: "Edge port", def: { en: "A port configured with PortFast that forwards immediately and causes no topology change.", hi: "PortFast wala port jo turant forward karta hai aur topology change nahi karta." } },
    { term: "Proposal/agreement", def: { en: "The RSTP handshake on a point-to-point link that lets a designated port forward without waiting for timers.", hi: "Point-to-point link par RSTP handshake jisse designated port timers ka wait kiye bina forward karta hai." } },
    { term: "BPDU Guard", def: { en: "Err-disables a port as soon as it receives any BPDU.", hi: "Koi bhi BPDU aate hi port ko err-disable kar deta hai." } },
    { term: "Root Guard", def: { en: "Blocks a port that receives a superior BPDU, so the root bridge cannot move behind it.", hi: "Superior BPDU aane par port block karta hai, taaki root bridge uske peeche shift na ho sake." } },
  ],
  commands: [
    { cmd: "spanning-tree mode rapid-pvst", mode: "Cisco global config", does: { en: "Run Rapid PVST+ instead of PVST+", hi: "PVST+ ki jagah Rapid PVST+ chalata hai" } },
    { cmd: "spanning-tree vlan 10 root primary", mode: "Cisco global config", does: { en: "Set priority 24576 (or 4096 below the current root) so this switch becomes root for VLAN 10", hi: "Priority 24576 (ya current root se 4096 kam) set karta hai taaki yeh switch VLAN 10 ka root bane" } },
    { cmd: "spanning-tree vlan 20 root secondary", mode: "Cisco global config", does: { en: "Set priority 28672 so this switch is next in line for VLAN 20", hi: "Priority 28672 set karta hai taaki VLAN 20 mein yeh switch agla root bane" } },
    { cmd: "spanning-tree vlan 10 priority 4096", mode: "Cisco global config", does: { en: "Set the VLAN 10 priority directly (multiples of 4096, 0-61440)", hi: "VLAN 10 ki priority seedha set karta hai (4096 ke multiples, 0-61440)" } },
    { cmd: "spanning-tree portfast", mode: "Cisco interface config", does: { en: "Make an access port an edge port that forwards immediately", hi: "Access port ko edge port banata hai jo turant forward karta hai" } },
    { cmd: "spanning-tree portfast default", mode: "Cisco global config", does: { en: "Enable PortFast on every access port", hi: "Har access port par PortFast on karta hai" } },
    { cmd: "spanning-tree bpduguard enable", mode: "Cisco interface config", does: { en: "Err-disable the port if a BPDU arrives", hi: "BPDU aaye toh port err-disable karta hai" } },
    { cmd: "spanning-tree portfast bpduguard default", mode: "Cisco global config", does: { en: "Enable BPDU Guard on every PortFast port", hi: "Har PortFast port par BPDU Guard on karta hai" } },
    { cmd: "spanning-tree bpdufilter enable", mode: "Cisco interface config", does: { en: "Stop sending and processing BPDUs on the port (STP off there)", hi: "Port par BPDUs bhejna aur process karna band (wahan STP off)" } },
    { cmd: "spanning-tree guard root", mode: "Cisco interface config", does: { en: "Block the port if a superior BPDU arrives", hi: "Superior BPDU aaye toh port block karta hai" } },
    { cmd: "spanning-tree guard loop", mode: "Cisco interface config", does: { en: "Block the port instead of forwarding if BPDUs stop arriving", hi: "BPDUs aana band ho toh forward karne ki jagah port block karta hai" } },
    { cmd: "errdisable recovery cause bpduguard", mode: "Cisco global config", does: { en: "Bring BPDU Guard err-disabled ports back automatically after the recovery interval", hi: "BPDU Guard se err-disabled ports ko recovery interval ke baad khud wapas laata hai" } },
    { cmd: "show spanning-tree vlan 10", mode: "Cisco privileged EXEC", does: { en: "Show the root, this bridge and every port's role, state, cost and link type in VLAN 10", hi: "VLAN 10 mein root, yeh bridge aur har port ka role, state, cost aur link type dikhata hai" } },
    { cmd: "show spanning-tree summary", mode: "Cisco privileged EXEC", does: { en: "Show the STP mode, the VLANs this switch is root for, and the global toolkit defaults", hi: "STP mode, yeh switch kin VLANs ka root hai, aur global toolkit defaults dikhata hai" } },
    { cmd: "show interfaces status err-disabled", mode: "Cisco privileged EXEC", does: { en: "List err-disabled ports and the reason", hi: "Err-disabled ports aur unka reason dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Thinking PortFast turns STP off on a port. It only skips the wait; the port still sends BPDUs and drops back to normal STP if one arrives. BPDU Filter on an interface is what really turns STP off.",
      hi: "Yeh sochna ki PortFast port par STP off kar deta hai. Woh sirf wait skip karta hai; port BPDUs bhejta rehta hai aur BPDU aaye toh normal STP par wapas aa jaata hai. Port par asal mein STP off karne wala interface-level BPDU Filter hai.",
    },
    {
      en: "Mixing up alternate and backup. Alternate: path to the root through another switch. Backup: a second port of the same switch on the same shared segment, which you will rarely see without hubs.",
      hi: "Alternate aur backup mein confuse hona. Alternate: doosre switch ke through root tak path. Backup: isi switch ka doosra port usi shared segment par, jo hubs ke bina shayad hi dikhe.",
    },
    {
      en: "Configuring a priority such as 5000 or 24586. IOS accepts only multiples of 4096; 24586 is what `show` displays after adding VLAN 10.",
      hi: "5000 ya 24586 jaisi priority configure karna. IOS sirf 4096 ke multiples accept karta hai; 24586 woh hai jo `show` VLAN 10 jodne ke baad dikhata hai.",
    },
    {
      en: "Expecting an err-disabled port to come back once the rogue switch is unplugged. It stays down until `shutdown`/`no shutdown` or `errdisable recovery`. Root Guard and Loop Guard are the ones that recover by themselves.",
      hi: "Yeh expect karna ki rogue switch nikalte hi err-disabled port wapas aa jaayega. Woh `shutdown`/`no shutdown` ya `errdisable recovery` tak down rehta hai. Khud recover hone wale Root Guard aur Loop Guard hain.",
    },
    {
      en: "Putting BPDU Filter and BPDU Guard on the same interface. The filter wins: no BPDU is ever processed, so the guard never fires.",
      hi: "Ek hi interface par BPDU Filter aur BPDU Guard dono lagana. Filter jeetta hai: koi BPDU process hi nahi hota, isliye guard kabhi trigger nahi hota.",
    },
    {
      en: "Putting Root Guard on a root port or Loop Guard on a port to a host. Root Guard goes on designated ports facing downstream switches; Loop Guard goes on root and alternate ports.",
      hi: "Root port par Root Guard ya host wale port par Loop Guard lagana. Root Guard downstream switches ki taraf ke designated ports par lagta hai; Loop Guard root aur alternate ports par.",
    },
  ],
  recap: [
    { en: "Rapid PVST+ = Cisco's per-VLAN RSTP (802.1w). `show spanning-tree` says `protocol rstp`. Same root election, costs and priorities as 802.1D.", hi: "Rapid PVST+ = Cisco ka per-VLAN RSTP (802.1w). `show spanning-tree` `protocol rstp` dikhata hai. Root election, costs aur priorities 802.1D jaise." },
    { en: "Roles: root, designated, alternate (backup path via another switch), backup (same switch, shared segment). States: discarding, learning, forwarding.", hi: "Roles: root, designated, alternate (doosre switch se backup path), backup (same switch, shared segment). States: discarding, learning, forwarding." },
    { en: "Fast because: alternate ports take over at once, proposal/agreement on point-to-point links, 3 missed hellos (6 s) instead of 20 s Max Age, immediate MAC flush on topology change.", hi: "Fast kyun: alternate ports turant takeover, point-to-point links par proposal/agreement, 20 s Max Age ki jagah 3 missed hellos (6 s), topology change par turant MAC flush." },
    { en: "Load sharing: `spanning-tree vlan X root primary` (24576) on one switch and `root secondary` (28672) on another, swapped for the other VLAN. Priorities are multiples of 4096.", hi: "Load sharing: ek switch par `spanning-tree vlan X root primary` (24576) aur doosre par `root secondary` (28672), doosre VLAN ke liye ulta. Priorities 4096 ke multiples hain." },
    { en: "PortFast = edge port, forwards at once. BPDU Guard = any BPDU, err-disable. BPDU Filter = stop BPDUs (dangerous per interface).", hi: "PortFast = edge port, turant forward. BPDU Guard = koi bhi BPDU, err-disable. BPDU Filter = BPDUs band (interface par khatarnak)." },
    { en: "Root Guard = superior BPDU blocks the port; Loop Guard = missing BPDUs block the port. Both recover by themselves.", hi: "Root Guard = superior BPDU aaye toh port block; Loop Guard = BPDUs gayab toh port block. Dono khud recover hote hain." },
  ],
  quiz: [
    {
      q: {
        en: "In Rapid PVST+, which port role is discarding, receives a usable path to the root bridge from a different switch, and becomes the root port immediately if the current root port fails?",
        hi: "Rapid PVST+ mein kaunsa port role discarding hota hai, doosre switch se root bridge tak ka usable path receive karta hai, aur current root port fail hone par turant root port ban jaata hai?",
      },
      options: [
        { en: "Backup", hi: "Backup" },
        { en: "Alternate", hi: "Alternate" },
        { en: "Designated", hi: "Designated" },
        { en: "Edge", hi: "Edge" },
      ],
      answer: 1,
      explain: {
        en: "An alternate port is the pre-computed second path to the root through another switch. A backup port also discards, but it backs up a designated port of the same switch on a shared segment, so it offers no new path to the root. Edge is a link type, not a role.",
        hi: "Alternate port doosre switch ke through root tak ka pehle se calculate kiya hua doosra path hai. Backup port bhi discarding hota hai, lekin woh shared segment par isi switch ke designated port ka backup hai, isliye root tak koi naya path nahi deta. Edge ek link type hai, role nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "You enter `spanning-tree vlan 20 priority 8192` on SW2. What priority does `show spanning-tree vlan 20` show in SW2's Bridge ID section?",
        hi: "Tum SW2 par `spanning-tree vlan 20 priority 8192` daalte ho. `show spanning-tree vlan 20` SW2 ke Bridge ID section mein kaunsi priority dikhayega?",
      },
      options: [
        { en: "8192", hi: "8192" },
        { en: "32788", hi: "32788" },
        { en: "8212", hi: "8212" },
        { en: "28692", hi: "28692" },
      ],
      answer: 2,
      explain: {
        en: "The displayed priority is the configured value plus the extended system ID (the VLAN): 8192 + 20 = 8212. IOS shows it as `Priority 8212 (priority 8192 sys-id-ext 20)`. 32788 would be the default, and 28692 is what `root secondary` would give in VLAN 20.",
        hi: "Dikhne wali priority configured value plus extended system ID (VLAN) hoti hai: 8192 + 20 = 8212. IOS ise `Priority 8212 (priority 8192 sys-id-ext 20)` dikhata hai. 32788 default hota, aur 28692 woh hai jo VLAN 20 mein `root secondary` deta.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "Fa0/7 on an access switch has `spanning-tree portfast` and `spanning-tree bpduguard enable`. A user connects a small switch that sends BPDUs. What happens?",
        hi: "Ek access switch ke Fa0/7 par `spanning-tree portfast` aur `spanning-tree bpduguard enable` hai. User ek chhota switch laga deta hai jo BPDUs bhejta hai. Kya hoga?",
      },
      options: [
        { en: "Fa0/7 is err-disabled and stays down until `shutdown`/`no shutdown` or errdisable recovery", hi: "Fa0/7 err-disabled ho jaata hai aur `shutdown`/`no shutdown` ya errdisable recovery tak down rehta hai" },
        { en: "Fa0/7 loses PortFast and takes part in STP normally", hi: "Fa0/7 PortFast kho deta hai aur normal STP mein hissa leta hai" },
        { en: "Fa0/7 ignores the BPDUs and keeps forwarding", hi: "Fa0/7 BPDUs ignore karke forward karta rehta hai" },
        { en: "Fa0/7 goes root-inconsistent and recovers by itself when the BPDUs stop", hi: "Fa0/7 root-inconsistent ho jaata hai aur BPDUs band hote hi khud recover karta hai" },
      ],
      answer: 0,
      explain: {
        en: "BPDU Guard reacts to any BPDU by err-disabling the port, and that needs a manual bounce or errdisable recovery. Losing PortFast and running STP is what happens without BPDU Guard. Blocking and self-recovery is Root Guard's behaviour, and only for superior BPDUs.",
        hi: "BPDU Guard kisi bhi BPDU par port ko err-disable kar deta hai, aur use manual bounce ya errdisable recovery chahiye. PortFast kho kar STP chalana BPDU Guard ke bina hota hai. Block karke khud recover hona Root Guard ka behaviour hai, aur woh bhi sirf superior BPDUs par.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Distribution switch DSW1 has `spanning-tree guard root` on Gi1/0/5, which faces an access switch. Someone sets the access switch's VLAN 10 priority to 0. What does DSW1 do?",
        hi: "Distribution switch DSW1 ke Gi1/0/5 par `spanning-tree guard root` hai, jo ek access switch ki taraf hai. Koi access switch ki VLAN 10 priority 0 kar deta hai. DSW1 kya karega?",
      },
      options: [
        { en: "Err-disables Gi1/0/5 for every VLAN", hi: "Gi1/0/5 ko har VLAN ke liye err-disable karega" },
        { en: "Accepts the access switch as the new root for VLAN 10", hi: "Access switch ko VLAN 10 ka naya root maan lega" },
        { en: "Stops sending BPDUs on Gi1/0/5 but keeps forwarding", hi: "Gi1/0/5 par BPDUs bhejna band karega lekin forward karta rahega" },
        { en: "Blocks Gi1/0/5 in VLAN 10 as root-inconsistent, and unblocks it by itself when the superior BPDUs stop", hi: "Gi1/0/5 ko VLAN 10 mein root-inconsistent bana kar block karega, aur superior BPDUs band hote hi khud unblock karega" },
      ],
      answer: 3,
      explain: {
        en: "A priority-0 BPDU is superior, so Root Guard blocks the port in that VLAN only and logs ROOTGUARD_BLOCK. It does not err-disable, and it recovers on its own once the access switch stops claiming to be root. Without Root Guard the root would move to the access switch.",
        hi: "Priority 0 wala BPDU superior hai, isliye Root Guard sirf us VLAN mein port block karta hai aur ROOTGUARD_BLOCK log karta hai. Woh err-disable nahi karta, aur jaise hi access switch root hone ka claim band karta hai, khud recover ho jaata hai. Root Guard ke bina root access switch par shift ho jaata.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`show spanning-tree vlan 10` on SW3 says `protocol rstp` and shows `Gi0/2  Altn BLK 4  128.26  P2p`. Which statement is correct?",
        hi: "SW3 par `show spanning-tree vlan 10` `protocol rstp` dikhata hai aur `Gi0/2  Altn BLK 4  128.26  P2p` dikhata hai. Kaunsa statement sahi hai?",
      },
      options: [
        { en: "Gi0/2 is discarding but holds a second path to the root, and will forward at once if the root port fails", hi: "Gi0/2 discarding hai lekin root tak ka doosra path jaanta hai, aur root port fail hone par turant forward karega" },
        { en: "Gi0/2 has been err-disabled by BPDU Guard", hi: "Gi0/2 ko BPDU Guard ne err-disable kar diya hai" },
        { en: "Gi0/2 is a backup port connected to a hub", hi: "Gi0/2 ek hub se juda backup port hai" },
        { en: "If the root port fails, Gi0/2 will spend 30 s in listening and learning", hi: "Root port fail hua toh Gi0/2 30 s listening aur learning mein bitayega" },
      ],
      answer: 0,
      explain: {
        en: "`Altn` is the alternate role and `BLK` is how IOS shows discarding. In RSTP the alternate port becomes root port and forwards immediately. A backup port would show `Back` and link type `Shr`, and an err-disabled port is not listed as a spanning-tree port at all. The 30 s wait belongs to classic 802.1D.",
        hi: "`Altn` alternate role hai aur `BLK` woh tareeka hai jisse IOS discarding dikhata hai. RSTP mein alternate port turant root port ban kar forward karta hai. Backup port `Back` aur link type `Shr` dikhata, aur err-disabled port spanning-tree port ki list mein aata hi nahi. 30 s ka wait classic 802.1D ka hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "You want SW1 to be root for VLAN 10 and SW2 to be root for VLAN 20, each acting as backup root for the other VLAN. Which configuration does this?",
        hi: "Tum chahte ho ki SW1 VLAN 10 ka root ho aur SW2 VLAN 20 ka, aur dono doosre VLAN ke backup root hon. Kaunsi configuration yeh karegi?",
      },
      options: [
        { en: "SW1: `vlan 10,20 root primary`; SW2: `vlan 10,20 root secondary`", hi: "SW1 par `vlan 10,20 root primary`, aur SW2 par `vlan 10,20 root secondary`" },
        { en: "SW1: `vlan 10 root secondary`, `vlan 20 root primary`; SW2: `vlan 10 root primary`, `vlan 20 root secondary`", hi: "SW1 par `vlan 10 root secondary` aur `vlan 20 root primary`; SW2 par `vlan 10 root primary` aur `vlan 20 root secondary`" },
        { en: "SW1: `vlan 10 root primary`, `vlan 20 root secondary`; SW2: `vlan 20 root primary`, `vlan 10 root secondary`", hi: "SW1 par `vlan 10 root primary` aur `vlan 20 root secondary`; SW2 par `vlan 20 root primary` aur `vlan 10 root secondary`" },
        { en: "SW1: `vlan 10 priority 24586`; SW2: `vlan 20 priority 24596`", hi: "SW1 par `vlan 10 priority 24586`, aur SW2 par `vlan 20 priority 24596`" },
      ],
      answer: 2,
      explain: {
        en: "Each switch is primary for its own VLAN and secondary for the other, so each VLAN has a root and a planned successor, and the two trees block different uplinks. The first option makes SW1 root for both VLANs. The second swaps the roles. The last is rejected because priorities must be multiples of 4096; 24586 is a displayed value, not a configurable one. (Every command starts with `spanning-tree`.)",
        hi: "Har switch apne VLAN ka primary aur doosre ka secondary hai, isliye har VLAN ka ek root aur ek planned successor hai, aur dono trees alag alag uplinks block karte hain. Pehla option SW1 ko dono VLANs ka root bana deta hai. Doosra roles ulta kar deta hai. Aakhri reject hoga kyunki priority 4096 ka multiple honi chahiye; 24586 dikhne wali value hai, configure karne wali nahi. (Har command `spanning-tree` se shuru hota hai.)",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "EpazNsLlPps",
      title: "Free CCNA | Rapid Spanning Tree Protocol | Day 22",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "STP versions, RSTP port roles and states, link types, and how RSTP converges faster than 802.1D.", hi: "STP versions, RSTP port roles aur states, link types, aur RSTP 802.1D se fast kaise converge karta hai." },
    },
    {
      id: "jfC_AeJnuhY",
      title: "BPDU Guard & BPDU Filter (STP Toolkit) | CCNA 200-301 Day 21 (part 2)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "BPDU Guard and BPDU Filter, with the global and interface versions configured. The same series has separate parts on PortFast, Root Guard and Loop Guard.", hi: "BPDU Guard aur BPDU Filter, global aur interface dono versions configure karke. Isi series mein PortFast, Root Guard aur Loop Guard ke alag parts hain." },
    },
    {
      id: "CQNwZXSKN9E",
      title: "102. Free CCNA (NEW) | STP in Hindi - RSTP and MSTP",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "RSTP roles, states and fast convergence in Hindi; the MSTP part goes beyond the CCNA.", hi: "RSTP roles, states aur fast convergence Hindi mein; MSTP wala part CCNA se aage hai." },
    },
    {
      id: "41xydin25-w",
      title: "203. Securing Rapid PVST+: Root, Loop, and BPDU Guard",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "A short Hindi overview of Root Guard, Loop Guard and BPDU Guard.", hi: "Root Guard, Loop Guard aur BPDU Guard ka chhota Hindi overview." },
    },
  ],
  lab: {
    title: { en: "Rapid PVST+, load sharing and BPDU Guard in Packet Tracer", hi: "Packet Tracer mein Rapid PVST+, load sharing aur BPDU Guard" },
    steps: [
      {
        en: "Rebuild the lesson 2.6 triangle of three 2960s. Create VLANs 10 and 20 on all three, make every uplink a trunk, and put PC-A (10.1.10.10/24) on SW2 Fa0/1 and PC-B (10.1.10.20/24) on SW3 Fa0/1, both in VLAN 10.",
        hi: "Lesson 2.6 wala teen 2960 ka triangle dobara banao. Teeno par VLAN 10 aur 20 banao, har uplink ko trunk banao, aur PC-A (10.1.10.10/24) ko SW2 Fa0/1 par aur PC-B (10.1.10.20/24) ko SW3 Fa0/1 par lagao, dono VLAN 10 mein.",
      },
      {
        en: "Enter `spanning-tree mode rapid-pvst` on all three switches and confirm with `show spanning-tree summary` and `protocol rstp` in `show spanning-tree`.",
        hi: "Teeno switches par `spanning-tree mode rapid-pvst` daalo aur `show spanning-tree summary` aur `show spanning-tree` mein `protocol rstp` se confirm karo.",
      },
      {
        en: "On SW1 enter `spanning-tree vlan 10 root primary` and `spanning-tree vlan 20 root secondary`; on SW2 do the opposite. On SW3, compare `show spanning-tree vlan 10` and `vlan 20`: which uplink is `Altn BLK` in each?",
        hi: "SW1 par `spanning-tree vlan 10 root primary` aur `spanning-tree vlan 20 root secondary` daalo; SW2 par ulta. SW3 par `show spanning-tree vlan 10` aur `vlan 20` compare karo: har ek mein kaunsa uplink `Altn BLK` hai?",
      },
      {
        en: "On SW2 and SW3 use `interface range fastethernet0/1 - 24` with `spanning-tree portfast` and `spanning-tree bpduguard enable`. Check that Fa0/1 now shows `P2p Edge`.",
        hi: "SW2 aur SW3 par `interface range fastethernet0/1 - 24` ke saath `spanning-tree portfast` aur `spanning-tree bpduguard enable` lagao. Check karo ki Fa0/1 ab `P2p Edge` dikhata hai.",
      },
      {
        en: "Run `ping -t 10.1.10.20` on PC-A, then `shutdown` SW3 Gi0/1. Count the lost replies and compare with the 30 seconds from lesson 2.6. (Packet Tracer timing is approximate.)",
        hi: "PC-A par `ping -t 10.1.10.20` chalao, phir SW3 Gi0/1 par `shutdown` karo. Kitne replies gaye, gino aur lesson 2.6 ke 30 second se compare karo. (Packet Tracer ki timing approximate hoti hai.)",
      },
      {
        en: "Cable a fourth switch to SW3 Fa0/2. Watch the port go err-disabled, find it with `show interfaces status err-disabled`, remove the switch, and bring the port back with `shutdown` and `no shutdown`.",
        hi: "Ek chautha switch SW3 Fa0/2 se cable karo. Port ko err-disabled hote dekho, `show interfaces status err-disabled` se dhoondho, switch hatao, aur `shutdown` aur `no shutdown` se port wapas lao.",
      },
    ],
  },
};

export default lesson;
