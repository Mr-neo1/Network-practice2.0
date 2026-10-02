import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "stp",
  intro: {
    en: "Engineers cable switches in triangles and squares so that one broken link does not cut anyone off. The same spare links form a loop, and at Layer 2 a loop can stop a whole network within seconds. Spanning Tree Protocol (STP) keeps the spare links but blocks just enough ports to leave one loop-free path, then unblocks one when a link fails. It runs on every Cisco switch by default, and the exam expects you to predict every choice it makes.",
    hi: "Engineers switches ko triangle aur square mein cable karte hain, taaki ek link toote toh koi cut off na ho. Lekin yahi spare links ek loop bana dete hain, aur Layer 2 par loop poore network ko kuch hi second mein rok sakta hai. Spanning Tree Protocol (STP) spare links rakhta hai, par itne ports block kar deta hai ki sirf ek loop-free path bache, aur link fail hone par ek port wapas khol deta hai. Yeh har Cisco switch par by default chalta hai, aur exam expect karta hai ki tum iska har decision predict kar sako.",
  },
  outcomes: [
    { en: "Explain why a Layer 2 loop causes broadcast storms, MAC table flapping and duplicate frames", hi: "Samjha sako ki Layer 2 loop se broadcast storm, MAC table flapping aur duplicate frames kyun hote hain" },
    { en: "Work out a switch's bridge ID and predict which switch becomes the root bridge", hi: "Switch ka bridge ID nikaal sako aur predict kar sako ki root bridge kaun banega" },
    { en: "Pick the root port on each switch and the designated port on each link using costs and tie-breakers", hi: "Cost aur tie-breakers se har switch ka root port aur har link ka designated port chun sako" },
    { en: "Describe the five 802.1D port states and the hello, max age and forward delay timers", hi: "802.1D ke paanch port states aur hello, max age aur forward delay timers describe kar sako" },
    { en: "Estimate how long classic STP takes to recover after a link fails", hi: "Andaza laga sako ki link fail hone ke baad classic STP ko recover hone mein kitna time lagta hai" },
    { en: "Read the root, bridge and port sections of `show spanning-tree`", hi: "`show spanning-tree` ke root, bridge aur port sections padh sako" },
  ],
  sections: [
    {
      id: "why-loops",
      heading: { en: "Why a loop melts a switched network", hi: "Loop switched network ko kyun gira deta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "From lesson 1.1 you know two switch rules: flood broadcasts and unknown unicasts out of every other port in the VLAN, and learn the source MAC of every frame. Both rules turn harmful the moment switches are cabled in a loop.",
            hi: "Lesson 1.1 se tumhe switch ke do rules pata hain: broadcast aur unknown unicast ko VLAN ke baaki har port se flood karo, aur har frame ka source MAC seekho. Jaise hi switches loop mein cable hote hain, yahi dono rules nuksaan karne lagte hain.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Broadcast storm.** A broadcast is flooded round the loop and never dies. An IPv4 packet has a TTL that each router lowers by 1, but an Ethernet header has no such field, so nothing ever removes the frame. Every new ARP or DHCP broadcast adds more copies until the links are full.",
              hi: "**Broadcast storm.** Broadcast loop mein ghoomta rehta hai aur kabhi khatam nahi hota. IPv4 packet mein TTL hota hai jise har router 1 kam karta hai, lekin Ethernet header mein aisa koi field nahi hai, isliye frame ko koi hatata hi nahi. Har naya ARP ya DHCP broadcast aur copies jodta hai, jab tak links poore bhar na jaayein.",
            },
            {
              en: "**MAC table instability.** The looping copies keep arriving with the same source MAC on different ports, so the switch keeps moving that MAC from port to port (it \"flaps\"). Unicast frames for that host are sent the wrong way.",
              hi: "**MAC table instability.** Looping copies same source MAC ke saath alag alag ports par aati rehti hain, isliye switch us MAC ko ek port se doosre port par shift karta rehta hai (use \"flap\" kehte hain). Us host ke liye unicast frames galat taraf chale jaate hain.",
            },
            {
              en: "**Duplicate frames.** Hosts receive the same frame several times, which confuses applications and wastes their CPU.",
              hi: "**Duplicate frames.** Hosts ko same frame kai baar milta hai, jisse applications confuse hoti hain aur unka CPU bekaar kharch hota hai.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "What SW2 logs while PC-A's MAC flaps", hi: "PC-A ka MAC flap hote waqt SW2 kya log karta hai" },
          lines: [
            { out: "%SW_MATM-4-MACFLAP_NOTIF: Host 0050.56aa.0001 in vlan 1 is flapping" },
            { out: "between port Gi0/1 and port Gi0/2", comment: { en: "PC-A is really on Fa0/1; loop copies keep dragging its MAC to the uplinks", hi: "PC-A asal mein Fa0/1 par hai; loop ki copies uska MAC uplinks par kheechti rehti hain" } },
          ],
          note: {
            en: "Real IOS prints this as one line; it is wrapped here. If you see it on several uplinks at once, suspect a loop.",
            hi: "Asli IOS ise ek hi line mein print karta hai; yahan wrap kiya gaya hai. Agar yeh kai uplinks par ek saath dikhe, toh loop ka shak karo.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Ethernet has no TTL, so a Layer 2 loop cannot fix itself. The three symptoms to name are broadcast storms, MAC address table instability and duplicate frames. STP prevents the loop instead of surviving it.",
            hi: "Ethernet mein TTL nahi hota, isliye Layer 2 loop khud theek nahi ho sakta. Teen symptoms yaad rakho: broadcast storms, MAC address table instability aur duplicate frames. STP loop ko jhelta nahi, use banne hi nahi deta.",
          },
        },
      ],
    },
    {
      id: "bpdus-and-bridge-id",
      heading: { en: "BPDUs and the bridge ID", hi: "BPDUs aur bridge ID" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Switches running STP (IEEE 802.1D) talk to each other with **Bridge Protocol Data Units (BPDUs)**. IEEE STP sends them to the multicast MAC `0180.C200.0000` (Cisco's per-VLAN version also uses `0100.0CCC.CCCD`), and once the network has settled the root sends one every 2 seconds, the **hello time**. A BPDU answers four questions:",
            hi: "STP (IEEE 802.1D) chalane wale switches aapas mein **Bridge Protocol Data Units (BPDUs)** se baat karte hain. IEEE STP inhe multicast MAC `0180.C200.0000` par bhejta hai (Cisco ka per-VLAN version `0100.0CCC.CCCD` bhi use karta hai), aur network settle hone ke baad root har 2 second mein ek BPDU bhejta hai, jise **hello time** kehte hain. BPDU chaar sawaalon ka jawab deta hai:",
          },
        },
        {
          type: "table",
          caption: { en: "The BPDU SW2 sends to SW3 once the triangle has converged", hi: "Triangle converge hone ke baad SW2 jo BPDU SW3 ko bhejta hai" },
          columns: ["Field", { en: "Question it answers", hi: "Kis sawaal ka jawab" }, "Value"],
          rows: [
            ["Root bridge ID", { en: "Who is the root?", hi: "Root kaun hai?" }, "32769 / 0019.aa00.0001"],
            ["Root path cost", { en: "What does it cost me to reach the root?", hi: "Mujhe root tak pahunchne mein kitni cost lagti hai?" }, "4"],
            ["Sender bridge ID", { en: "Who am I?", hi: "Main kaun hoon?" }, "32769 / 0019.aa00.0002"],
            ["Sender port ID", { en: "Which of my ports sent this?", hi: "Maine yeh kis port se bheja?" }, "128.26 (Gi0/2)"],
          ],
        },
        {
          type: "p",
          text: {
            en: "The **bridge ID (BID)** is 8 bytes: a 2-byte priority field and the switch's 6-byte MAC address. Cisco splits the priority field. The top 4 bits are the priority you configure, and the low 12 bits are the **extended system ID**, which holds the VLAN number. That is why a configured priority must be a multiple of 4096, and why the priority you see is the configured value plus the VLAN.",
            hi: "**Bridge ID (BID)** 8 bytes ka hota hai: 2-byte priority field aur switch ka 6-byte MAC address. Cisco priority field ko do hisson mein baantta hai. Upar ke 4 bits woh priority hai jo tum configure karte ho, aur neeche ke 12 bits **extended system ID** hai, jisme VLAN number hota hai. Isiliye configured priority 4096 ka multiple honi chahiye, aur jo priority dikhti hai woh configured value plus VLAN hoti hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Priority shown = configured priority + VLAN ID", hi: "Dikhne wali priority = configured priority + VLAN ID" },
          columns: ["VLAN", { en: "Configured priority", hi: "Configured priority" }, { en: "Priority in the BID", hi: "BID mein priority" }],
          rows: [
            ["1", "32768 (default)", "32769"],
            ["10", "32768 (default)", "32778"],
            ["20", "4096", "4116"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "IOS shows both numbers", hi: "IOS dono numbers dikhata hai" },
          text: {
            en: "`show spanning-tree` prints the bridge priority as `Priority 32769 (priority 32768 sys-id-ext 1)`: the total, then the two parts.",
            hi: "`show spanning-tree` bridge priority ko `Priority 32769 (priority 32768 sys-id-ext 1)` ki tarah print karta hai: pehle total, phir dono hisse.",
          },
        },
      ],
    },
    {
      id: "root-bridge",
      heading: { en: "Electing the root bridge", hi: "Root bridge ka election" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Everything in STP is measured from one switch, the **root bridge**. The switch with the **lowest bridge ID** wins. The priority is compared first; only when priorities tie does the lower MAC address decide.",
            hi: "STP mein sab kuch ek switch se naapa jaata hai, jise **root bridge** kehte hain. Jiska **bridge ID sabse kam** hai, woh jeetta hai. Pehle priority compare hoti hai; sirf jab priorities barabar hon, tab kam MAC address decide karta hai.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "Each switch boots believing it is the root and sends BPDUs naming itself as root.",
              hi: "Har switch boot hote hi maanta hai ki root wahi hai aur khud ko root bata kar BPDUs bhejta hai.",
            },
            {
              en: "A switch that receives a BPDU naming a lower root BID than the one it knows accepts that switch as root and stops advertising itself.",
              hi: "Jis switch ko aisa BPDU milta hai jisme uske jaane hue root se kam root BID ho, woh us switch ko root maan leta hai aur khud ko advertise karna band kar deta hai.",
            },
            {
              en: "Within a few seconds every switch agrees on the same root. From then on only the root originates BPDUs; the others relay them out of their designated ports with their own root path cost and bridge ID filled in.",
              hi: "Kuch hi second mein saare switches ek hi root par agree kar lete hain. Uske baad sirf root BPDUs originate karta hai; baaki switches unhe apne designated ports se aage bhejte hain, apni root path cost aur bridge ID bhar kar.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "The triangle from the animation, all at default priority", hi: "Animation wala triangle, sab default priority par" },
          columns: ["Switch", "Priority", "MAC", { en: "Result", hi: "Result" }],
          rows: [
            ["SW1", "32769", "0019.aa00.0001", { en: "Root: priorities tie, lowest MAC", hi: "Root: priorities barabar, sabse kam MAC" }],
            ["SW2", "32769", "0019.aa00.0002", { en: "Not root", hi: "Root nahi" }],
            ["SW3", "32769", "0019.aa00.0003", { en: "Not root", hi: "Root nahi" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Do not let the defaults choose", hi: "Defaults ko decide mat karne do" },
          text: {
            en: "Left at defaults, the root is simply the switch with the lowest MAC, often the oldest box in the building and maybe a small access switch in a closet. Choose the root on purpose, normally a core or distribution switch, by lowering its priority. If SW3 had priority 4096 (BID 4097) it would win despite having the highest MAC. The commands for this are in lesson 2.7.",
            hi: "Defaults par chhodoge toh root bas woh switch banega jiska MAC sabse kam hai, jo aksar building ka sabse purana box hota hai, shayad closet mein pada koi chhota access switch. Root soch samajh kar chuno, aam taur par core ya distribution switch, uski priority kam karke. Agar SW3 ki priority 4096 hoti (BID 4097), toh sabse bada MAC hone ke bawajood woh jeet jaata. Iske commands lesson 2.7 mein hain.",
          },
        },
      ],
    },
    {
      id: "port-roles",
      heading: { en: "Root ports, designated ports and the blocked port", hi: "Root ports, designated ports aur blocked port" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Once the root is known, STP measures distance to it as **root path cost**, the sum of port costs along the path. Each switch adds the cost of the port on which it **receives** the root's BPDU. The 802.1D costs depend on link speed:",
            hi: "Root pata chalne ke baad STP uski doori **root path cost** se naapta hai, yaani path ke ports ki costs ka total. Har switch us port ki cost jodta hai jis par use root ka BPDU **receive** hota hai. 802.1D costs link speed par depend karti hain:",
          },
        },
        {
          type: "table",
          caption: { en: "802.1D port costs (the values the exam uses)", hi: "802.1D port costs (jo values exam use karta hai)" },
          columns: ["Speed", "Cost"],
          rows: [
            ["10 Mbps", "100"],
            ["100 Mbps", "19"],
            ["1 Gbps", "4"],
            ["10 Gbps", "2"],
          ],
        },
        {
          type: "p",
          text: {
            en: "In the triangle, SW2 receives SW1's BPDU on Gi0/1 carrying cost 0 and adds 4, so its root path cost is 4. While the roles are still being worked out, the root's information also reaches SW2 through SW3: it arrives on Gi0/2 carrying 4, SW2 adds 4 more, and that path costs 8. Then each port gets one role:",
            hi: "Triangle mein SW2 ko SW1 ka BPDU Gi0/1 par cost 0 ke saath milta hai, woh 4 jodta hai, toh uski root path cost 4 hai. Jab tak roles decide ho rahe hain, root ki information SW3 ke through bhi SW2 tak aati hai: Gi0/2 par cost 4 ke saath aati hai, SW2 4 aur jodta hai, aur yeh path 8 ka padta hai. Phir har port ko ek role milta hai:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Root port (RP)**: one on every non-root switch, the port with the best path to the root. Tie-breakers, in order: lowest root path cost, then lowest **neighbour** bridge ID, then lowest **neighbour** port ID. The root bridge has no root port.",
              hi: "**Root port (RP)**: har non-root switch par ek, jis port se root tak sabse accha path hai. Tie-breakers is order mein: sabse kam root path cost, phir sabse kam **neighbour** bridge ID, phir sabse kam **neighbour** port ID. Root bridge ka koi root port nahi hota.",
            },
            {
              en: "**Designated port (DP)**: one on every link (segment), the port that forwards onto that link, chosen from the switch with the lowest root path cost. Ties go to the lower bridge ID, then the lower port ID. Every port on the root bridge is designated.",
              hi: "**Designated port (DP)**: har link (segment) par ek, woh port jo us link par forward karta hai, us switch ka jiski root path cost sabse kam ho. Tie hua toh kam bridge ID, phir kam port ID jeetta hai. Root bridge ka har port designated hota hai.",
            },
            {
              en: "**Non-designated port**: any port left with neither role. It goes to **blocking**, and that is what breaks the loop.",
              hi: "**Non-designated port**: jis port ko dono mein se koi role nahi mila. Woh **blocking** mein chala jaata hai, aur isi se loop toot jaata hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "The result in the triangle", hi: "Triangle mein result" },
          columns: ["Port", "Role", { en: "Why", hi: "Kyun" }],
          rows: [
            ["SW1 Gi0/1, Gi0/2", "Designated", { en: "Every port on the root is designated", hi: "Root ka har port designated hota hai" }],
            ["SW2 Gi0/1", "Root", { en: "Cost 4 direct, against 8 through SW3", hi: "Seedha cost 4, SW3 ke through 8" }],
            ["SW3 Gi0/1", "Root", { en: "Same sum as SW2", hi: "SW2 jaisa hi hisaab" }],
            ["SW2 Gi0/2", "Designated", { en: "Both ends cost 4; SW2 has the lower bridge ID", hi: "Dono ends ki cost 4; SW2 ka bridge ID kam hai" }],
            ["SW3 Gi0/2", { en: "Non-designated (blocking)", hi: "Non-designated (blocking)" }, { en: "Lost the designated tie-break", hi: "Designated tie-break haar gaya" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "The neighbour's port ID, not yours", hi: "Neighbour ka port ID, tumhara nahi" },
          text: {
            en: "A port ID is the port priority (default 128) plus the port number, written like `128.25`. The third root port tie-breaker compares the port ID inside the BPDUs you receive, which belongs to the **neighbour's** port. It only comes into play when two parallel links run to the same switch.",
            hi: "Port ID port priority (default 128) plus port number hota hai, `128.25` jaisa likha jaata hai. Root port ka teesra tie-breaker received BPDUs ke andar ka port ID compare karta hai, jo **neighbour ke** port ka hota hai. Yeh tabhi kaam aata hai jab ek hi switch tak do parallel links hon.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Newer switches, bigger numbers", hi: "Naye switches, bade numbers" },
          text: {
            en: "Some switches use a newer \"long\" cost method with much bigger values, for example 20000 for 1 Gbps, so that faster links can be told apart. That is beyond the CCNA; exam questions use the table above.",
            hi: "Kuch switches naya \"long\" cost method use karte hain jisme values kaafi badi hoti hain, jaise 1 Gbps ke liye 20000, taaki tez links mein fark kiya ja sake. Yeh CCNA se aage ka topic hai; exam questions upar wali table use karte hain.",
          },
        },
      ],
    },
    {
      id: "states-and-timers",
      heading: { en: "Port states and timers", hi: "Port states aur timers" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A port cannot jump from blocking to forwarding, because the other switches might not have caught up yet and a brief loop could form. 802.1D walks the port through two waiting states first.",
            hi: "Port blocking se seedha forwarding mein nahi ja sakta, kyunki ho sakta hai baaki switches abhi update na hue hon aur thodi der ke liye loop ban jaaye. Isliye 802.1D port ko pehle do waiting states se guzaarta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "802.1D port states", hi: "802.1D port states" },
          columns: ["State", { en: "Forwards data", hi: "Data forward" }, { en: "Learns MACs", hi: "MAC seekhta" }, "BPDUs", { en: "How long", hi: "Kitni der" }],
          rows: [
            ["Blocking", "No", "No", { en: "Receives only", hi: "Sirf receive" }, { en: "Stable, until needed", hi: "Stable, zaroorat tak" }],
            ["Listening", "No", "No", { en: "Sends and receives", hi: "Bhejta aur receive karta" }, "15 s"],
            ["Learning", "No", "Yes", { en: "Sends and receives", hi: "Bhejta aur receive karta" }, "15 s"],
            ["Forwarding", "Yes", "Yes", { en: "Sends and receives", hi: "Bhejta aur receive karta" }, { en: "Stable", hi: "Stable" }],
            ["Disabled", "No", "No", { en: "None", hi: "Kuch nahi" }, { en: "Port shut down or no link", hi: "Port shutdown ya link nahi" }],
          ],
        },
        {
          type: "table",
          caption: { en: "802.1D timers (defaults)", hi: "802.1D timers (defaults)" },
          columns: ["Timer", "Default", { en: "What it controls", hi: "Kya control karta hai" }],
          rows: [
            ["Hello", "2 s", { en: "How often the root sends a BPDU", hi: "Root kitni baar BPDU bhejta hai" }],
            ["Max Age", "20 s", { en: "How long a switch keeps a port's BPDU information without a fresh BPDU before it acts (10 hellos)", hi: "Naya BPDU na aaye toh switch port ki BPDU information kitni der rakhta hai, uske baad action leta hai (10 hellos)" }],
            ["Forward Delay", "15 s", { en: "Time spent in listening, and again in learning", hi: "Listening mein bitaya time, aur utna hi learning mein" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "The root sets the clock", hi: "Clock root set karta hai" },
          text: {
            en: "Timers travel inside the root's BPDUs, so every switch uses the root's values, whatever is configured locally.",
            hi: "Timers root ke BPDUs ke andar travel karte hain, isliye har switch root ki values use karta hai, chahe local par kuch bhi configure ho.",
          },
        },
      ],
    },
    {
      id: "convergence",
      heading: { en: "When a link fails: 30 to 50 seconds", hi: "Jab link fail ho: 30 se 50 second" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Direct failure (about 30 s).** In the animation the SW1-SW3 link breaks. SW3 sees its root port go down at once, and it already holds SW2's BPDU on its blocked port Gi0/2 (root SW1, cost 4). Gi0/2 becomes the new root port, but it still has to spend 15 s listening and 15 s learning before it forwards.",
            hi: "**Direct failure (lagbhag 30 s).** Animation mein SW1-SW3 link toot jaata hai. SW3 ko apna root port down hote hi turant pata chal jaata hai, aur uske blocked port Gi0/2 par SW2 ka BPDU pehle se hai (root SW1, cost 4). Gi0/2 naya root port ban jaata hai, lekin forward karne se pehle use 15 s listening aur 15 s learning mein bitane padte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Indirect failure (about 50 s).** Now suppose SW1-SW2 fails instead. SW2 loses its root port and knows no other path, so it announces itself as root on Gi0/2. SW3's blocked port hears this worse BPDU but ignores it until the good information it stored from SW2 expires after **Max Age, 20 s**. Only then does SW3 make Gi0/2 designated, tell SW2 about the real root, and move Gi0/2 through listening and learning: 20 + 15 + 15 = 50 s.",
            hi: "**Indirect failure (lagbhag 50 s).** Ab maan lo SW1-SW2 fail hota hai. SW2 ka root port chala jaata hai aur use koi doosra path pata nahi, isliye woh Gi0/2 par khud ko root announce karta hai. SW3 ka blocked port yeh kharab BPDU sunta hai par use ignore karta hai, jab tak SW2 se store ki hui acchi information **Max Age, 20 s** ke baad expire na ho jaaye. Tab jaakar SW3 Gi0/2 ko designated banata hai, SW2 ko asli root ke baare mein batata hai, aur Gi0/2 ko listening aur learning se guzaarta hai: 20 + 15 + 15 = 50 s.",
          },
        },
        {
          type: "p",
          text: {
            en: "After any change, the switch that saw it sends a **Topology Change Notification (TCN)** toward the root, and the root tells every switch to age out MAC entries after 15 seconds instead of 300, so hosts are re-learned on their new paths.",
            hi: "Koi bhi change hone par, jis switch ne change dekha woh root ki taraf **Topology Change Notification (TCN)** bhejta hai, aur root har switch ko kehta hai ki MAC entries ko 300 ki jagah 15 second mein age out karo, taaki hosts naye paths par dobara seekhe jaayein.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "PCs wait too", hi: "PCs ko bhi wait karna padta hai" },
          text: {
            en: "A PC plugged into an access port waits about 30 seconds (listening plus learning) before it can send anything, long enough for a DHCP request to time out. PortFast fixes this, and Rapid PVST+ cuts failure recovery to about a second. Both are in lesson 2.7.",
            hi: "Access port mein laga PC kuch bhi bhejne se pehle lagbhag 30 second (listening plus learning) wait karta hai, itna ki DHCP request time out ho sakti hai. PortFast isse fix karta hai, aur Rapid PVST+ failure recovery ko lagbhag ek second tak le aata hai. Dono lesson 2.7 mein hain.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Numbers to remember", hi: "Yaad rakhne wale numbers" },
          text: {
            en: "Hello 2 s, Max Age 20 s, Forward Delay 15 s. Blocking to forwarding: 30 s when the switch knows at once (listening + learning), up to 50 s when it must wait for Max Age first.",
            hi: "Hello 2 s, Max Age 20 s, Forward Delay 15 s. Blocking se forwarding: 30 s jab switch ko turant pata chal jaaye (listening + learning), aur 50 s tak jab use pehle Max Age ka wait karna pade.",
          },
        },
      ],
    },
    {
      id: "show-spanning-tree",
      heading: { en: "Reading show spanning-tree", hi: "show spanning-tree padhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Here is SW3 from the animation after it converged. The switches are Catalyst 2960s, so Fa0/1 is port 1 and the two uplinks Gi0/1 and Gi0/2 are ports 25 and 26.",
            hi: "Yeh animation wala SW3 hai, converge hone ke baad. Switches Catalyst 2960 hain, isliye Fa0/1 port 1 hai aur dono uplinks Gi0/1 aur Gi0/2 ports 25 aur 26 hain.",
          },
        },
        {
          type: "cli",
          title: { en: "SW3, a non-root switch", hi: "SW3, ek non-root switch" },
          lines: [
            { prompt: "SW3#", cmd: "show spanning-tree vlan 1" },
            { out: "VLAN0001" },
            { out: "  Spanning tree enabled protocol ieee", comment: { en: "ieee = classic 802.1D, run per VLAN (PVST+)", hi: "ieee = classic 802.1D, har VLAN ke liye alag (PVST+)" } },
            { out: "  Root ID    Priority    32769", comment: { en: "Root ID describes the root bridge, not this switch", hi: "Root ID root bridge ke baare mein hai, is switch ke nahi" } },
            { out: "             Address     0019.aa00.0001" },
            { out: "             Cost        4", comment: { en: "SW3's root path cost", hi: "SW3 ki root path cost" } },
            { out: "             Port        25 (GigabitEthernet0/1)", comment: { en: "SW3's root port", hi: "SW3 ka root port" } },
            { out: "             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec" },
            { out: "  Bridge ID  Priority    32769  (priority 32768 sys-id-ext 1)", comment: { en: "SW3's own bridge ID", hi: "SW3 ka apna bridge ID" } },
            { out: "             Address     0019.aa00.0003" },
            { out: "             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec" },
            { out: "             Aging Time  300 sec" },
            { out: "Interface           Role Sts Cost      Prio.Nbr Type" },
            { out: "------------------- ---- --- --------- -------- ----" },
            { out: "Fa0/1               Desg FWD 19        128.1    P2p", comment: { en: "Port to PC-B: designated, 100 Mbps so cost 19", hi: "PC-B wala port: designated, 100 Mbps hai isliye cost 19" } },
            { out: "Gi0/1               Root FWD 4         128.25   P2p" },
            { out: "Gi0/2               Altn BLK 4         128.26   P2p", comment: { en: "The blocked port. BLK = blocking", hi: "Blocked port. BLK = blocking" } },
          ],
          note: {
            en: "IOS labels the non-designated port `Altn` (alternate) even in classic mode, borrowing a name from Rapid STP. On SW1 the Root ID section says `This bridge is the root` instead of Cost and Port, and every port is `Desg FWD`.",
            hi: "IOS non-designated port ko classic mode mein bhi `Altn` (alternate) likhta hai, yeh naam Rapid STP se liya gaya hai. SW1 par Root ID section mein Cost aur Port ki jagah `This bridge is the root` likha hota hai, aur har port `Desg FWD` hota hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "To move the root on purpose, lower a switch's priority in that VLAN. Lesson 2.7 covers this properly, along with `root primary` and `root secondary`.",
            hi: "Root ko jaan-boojh kar shift karna ho toh us VLAN mein switch ki priority kam karo. Lesson 2.7 isse poori tarah cover karta hai, `root primary` aur `root secondary` ke saath.",
          },
        },
        {
          type: "cli",
          lines: [
            { prompt: "SW3(config)#", cmd: "spanning-tree vlan 1 priority 4096", comment: { en: "SW3's BID becomes 4097 and it takes over as root", hi: "SW3 ka BID 4097 ho jaata hai aur woh root ban jaata hai" } },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "STP (802.1D)", def: { en: "A protocol that blocks redundant switch ports so there is exactly one active path between any two points in a VLAN.", hi: "Ek protocol jo redundant switch ports block karta hai taaki VLAN mein kinhi do points ke beech sirf ek active path ho." } },
    { term: "BPDU", def: { en: "Bridge Protocol Data Unit: the frame switches exchange to elect a root and share path costs.", hi: "Bridge Protocol Data Unit: woh frame jise switches root chunne aur path costs share karne ke liye exchange karte hain." } },
    { term: "Bridge ID", def: { en: "Priority (multiple of 4096) plus VLAN ID plus MAC address; the lowest one becomes root.", hi: "Priority (4096 ka multiple) plus VLAN ID plus MAC address; jiska sabse kam ho woh root banta hai." } },
    { term: "Root bridge", def: { en: "The switch with the lowest bridge ID; all paths are measured from it and all its ports are designated.", hi: "Sabse kam bridge ID wala switch; saare paths isi se naape jaate hain aur iske saare ports designated hote hain." } },
    { term: "Root port", def: { en: "The one port on a non-root switch with the lowest-cost path to the root.", hi: "Non-root switch ka woh ek port jisse root tak sabse kam cost ka path ho." } },
    { term: "Designated port", def: { en: "The one forwarding port on each link, on the switch closest to the root.", hi: "Har link par woh ek forwarding port, us switch ka jo root ke sabse paas ho." } },
    { term: "Root path cost", def: { en: "The sum of the port costs from a switch to the root, added at each receiving port.", hi: "Switch se root tak ke port costs ka total, jo har receiving port par joda jaata hai." } },
    { term: "Broadcast storm", def: { en: "Broadcasts looping endlessly through a Layer 2 loop until links and devices are overwhelmed.", hi: "Layer 2 loop mein broadcasts ka lagataar ghoomna, jab tak links aur devices overload na ho jaayein." } },
  ],
  commands: [
    { cmd: "show spanning-tree", mode: "Cisco privileged EXEC", does: { en: "Show the root, this switch's bridge ID, and every port's role, state and cost for each VLAN", hi: "Har VLAN ke liye root, is switch ka bridge ID, aur har port ka role, state aur cost dikhata hai" } },
    { cmd: "show spanning-tree vlan 1", mode: "Cisco privileged EXEC", does: { en: "The same, for one VLAN only", hi: "Yahi, sirf ek VLAN ke liye" } },
    { cmd: "spanning-tree vlan 1 priority 4096", mode: "Cisco global config", does: { en: "Lower this switch's priority in VLAN 1 so it wins the root election", hi: "VLAN 1 mein is switch ki priority kam karta hai taaki woh root election jeete" } },
  ],
  mistakes: [
    {
      en: "Expecting the highest priority or MAC to win. The lowest bridge ID wins, and the priority is compared before the MAC.",
      hi: "Yeh expect karna ki sabse zyada priority ya MAC jeetega. Sabse kam bridge ID jeetta hai, aur MAC se pehle priority compare hoti hai.",
    },
    {
      en: "Forgetting the extended system ID. A default switch shows priority 32769 in VLAN 1 and 32778 in VLAN 10, not 32768.",
      hi: "Extended system ID bhool jaana. Default switch VLAN 1 mein priority 32769 aur VLAN 10 mein 32778 dikhata hai, 32768 nahi.",
    },
    {
      en: "Looking for a root port on the root bridge. The root has none; every one of its ports is designated.",
      hi: "Root bridge par root port dhoondhna. Root ka koi root port nahi hota; uska har port designated hota hai.",
    },
    {
      en: "Using your own port ID as the last root port tie-breaker. It is the neighbour's port ID, the one carried in the BPDU you receive.",
      hi: "Root port ke aakhri tie-breaker mein apna port ID use karna. Yeh neighbour ka port ID hai, jo received BPDU mein aata hai.",
    },
    {
      en: "Adding the cost of the port a BPDU leaves from. Each switch adds the cost of the port where the BPDU arrives.",
      hi: "Us port ki cost jodna jahan se BPDU nikalta hai. Har switch us port ki cost jodta hai jahan BPDU aata hai.",
    },
    {
      en: "Thinking STP shuts a link down. Only one end blocks; the link stays up, the blocked port still receives BPDUs, and the other end is a forwarding designated port.",
      hi: "Yeh sochna ki STP link ko shut down kar deta hai. Sirf ek end block hota hai; link up rehta hai, blocked port BPDUs receive karta rehta hai, aur doosra end forwarding designated port hota hai.",
    },
  ],
  recap: [
    { en: "Ethernet has no TTL, so a Layer 2 loop causes broadcast storms, MAC flapping and duplicate frames; STP blocks ports to prevent it.", hi: "Ethernet mein TTL nahi hai, isliye Layer 2 loop se broadcast storm, MAC flapping aur duplicate frames hote hain; STP ports block karke ise rokta hai." },
    { en: "Bridge ID = priority (multiple of 4096) + VLAN + MAC. Default priority 32768. Lowest bridge ID is root.", hi: "Bridge ID = priority (4096 ka multiple) + VLAN + MAC. Default priority 32768. Sabse kam bridge ID root hai." },
    { en: "Root port: lowest root path cost, then lowest neighbour bridge ID, then lowest neighbour port ID. Costs: 10M 100, 100M 19, 1G 4, 10G 2.", hi: "Root port: sabse kam root path cost, phir sabse kam neighbour bridge ID, phir sabse kam neighbour port ID. Costs: 10M 100, 100M 19, 1G 4, 10G 2." },
    { en: "One designated port per link; all root bridge ports are designated; every other port blocks.", hi: "Har link par ek designated port; root bridge ke saare ports designated; baaki har port block." },
    { en: "States: blocking, listening (15 s), learning (15 s), forwarding, disabled. Timers: hello 2 s, max age 20 s, forward delay 15 s.", hi: "Paanch states hain: blocking, listening (15 s), learning (15 s), forwarding aur disabled. Timers hain hello 2 s, max age 20 s aur forward delay 15 s." },
    { en: "Recovery takes about 30 s after a direct failure and about 50 s after an indirect one.", hi: "Direct failure ke baad recovery mein lagbhag 30 s lagte hain, indirect ke baad lagbhag 50 s." },
  ],
  quiz: [
    {
      q: {
        en: "SW5 has the default STP priority. What bridge priority does `show spanning-tree vlan 30` show for SW5?",
        hi: "SW5 ki STP priority default hai. `show spanning-tree vlan 30` SW5 ke liye kaunsi bridge priority dikhayega?",
      },
      options: [
        { en: "32768", hi: "32768" },
        { en: "32798", hi: "32798" },
        { en: "30", hi: "30" },
        { en: "4126", hi: "4126" },
      ],
      answer: 1,
      explain: {
        en: "The default priority 32768 is added to the extended system ID, which is the VLAN number: 32768 + 30 = 32798. 4126 would be a configured priority of 4096 in VLAN 30.",
        hi: "Default priority 32768 mein extended system ID, yaani VLAN number, juda hota hai: 32768 + 30 = 32798. 4126 tab hota jab VLAN 30 mein priority 4096 configure ki gayi hoti.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "Four switches in VLAN 1: SW1 32769 / 0019.aa00.0005, SW2 28673 / 0019.aa00.0009, SW3 32769 / 0019.aa00.0001, SW4 28673 / 0019.aa00.0007. Which becomes the root bridge?",
        hi: "VLAN 1 mein chaar switches: SW1 32769 / 0019.aa00.0005, SW2 28673 / 0019.aa00.0009, SW3 32769 / 0019.aa00.0001, SW4 28673 / 0019.aa00.0007. Root bridge kaun banega?",
      },
      options: [
        { en: "SW3", hi: "SW3" },
        { en: "SW2", hi: "SW2" },
        { en: "SW1", hi: "SW1" },
        { en: "SW4", hi: "SW4" },
      ],
      answer: 3,
      explain: {
        en: "Priority is compared first, so only SW2 and SW4 (28673) are in the running. They tie, so the lower MAC wins: 0019.aa00.0007 beats 0019.aa00.0009. SW3's MAC is the lowest, but MACs only matter between switches with equal priority.",
        hi: "Pehle priority compare hoti hai, isliye sirf SW2 aur SW4 (28673) race mein hain. Dono barabar hain, toh kam MAC jeetta hai: 0019.aa00.0007, 0019.aa00.0009 se kam hai. SW3 ka MAC sabse kam hai, lekin MAC sirf barabar priority wale switches ke beech matter karta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "SW4's only path to the root is a 100 Mbps link to SW2, and SW2 connects to the root with a 1 Gbps link. What is SW4's root path cost?",
        hi: "SW4 ka root tak sirf ek path hai: SW2 tak 100 Mbps link, aur SW2 root se 1 Gbps link se juda hai. SW4 ki root path cost kya hai?",
      },
      options: [
        { en: "23", hi: "23" },
        { en: "19", hi: "19" },
        { en: "8", hi: "8" },
        { en: "104", hi: "104" },
      ],
      answer: 0,
      explain: {
        en: "SW2 receives the root's BPDU on its 1 Gbps port and adds 4. SW4 receives SW2's BPDU carrying 4 on its 100 Mbps port and adds 19: 4 + 19 = 23.",
        hi: "SW2 root ka BPDU apne 1 Gbps port par receive karta hai aur 4 jodta hai. SW4 ko SW2 ka BPDU cost 4 ke saath apne 100 Mbps port par milta hai aur woh 19 jodta hai: 4 + 19 = 23.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "SW2 has two 1 Gbps links to the root bridge SW1: SW2 Gi0/1 connects to SW1 Gi0/2, and SW2 Gi0/2 connects to SW1 Gi0/1. Port priorities are default. Which port becomes SW2's root port?",
        hi: "SW2 ke root bridge SW1 tak do 1 Gbps links hain: SW2 Gi0/1, SW1 Gi0/2 se juda hai, aur SW2 Gi0/2, SW1 Gi0/1 se. Port priorities default hain. SW2 ka root port kaunsa banega?",
      },
      options: [
        { en: "Gi0/1, because SW2's own port ID is lower", hi: "Gi0/1, kyunki SW2 ka apna port ID kam hai" },
        { en: "Both, working as one bundle", hi: "Dono, ek bundle ki tarah" },
        { en: "Gi0/2, because it connects to SW1's lower port ID", hi: "Gi0/2, kyunki yeh SW1 ke kam port ID se juda hai" },
        { en: "Neither; both ports block", hi: "Koi nahi; dono ports block" },
      ],
      answer: 2,
      explain: {
        en: "Both paths cost 4 and both neighbours are SW1, so the next tie-breaker is the neighbour's port ID carried in the BPDU. SW1 Gi0/1 has the lower port ID, so the SW2 port facing it, Gi0/2, becomes the root port and Gi0/1 blocks. Bundling both links would need EtherChannel.",
        hi: "Dono paths ki cost 4 hai aur dono taraf neighbour SW1 hi hai, isliye agla tie-breaker BPDU mein aane wala neighbour ka port ID hai. SW1 Gi0/1 ka port ID kam hai, isliye SW2 ka jo port uski taraf hai, yaani Gi0/2, root port banta hai aur Gi0/1 block hota hai. Dono links ko bundle karne ke liye EtherChannel chahiye.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A switch running classic 802.1D stops hearing the root's BPDUs on its blocked port because a link elsewhere failed; none of its own links went down. With default timers, roughly how long until that port forwards?",
        hi: "Classic 802.1D chalane wale switch ke blocked port par root ke BPDUs aana band ho jaate hain kyunki kahin aur ek link fail hua; uska apna koi link down nahi hua. Default timers ke saath, woh port lagbhag kitni der mein forward karega?",
      },
      options: [
        { en: "2 seconds", hi: "2 second" },
        { en: "15 seconds", hi: "15 second" },
        { en: "30 seconds", hi: "30 second" },
        { en: "50 seconds", hi: "50 second" },
      ],
      answer: 3,
      explain: {
        en: "This is an indirect failure. The switch first waits Max Age (20 s) for the stored BPDU information to expire, then spends 15 s listening and 15 s learning: 50 s. 30 s is the direct case, where the switch sees its own root port go down.",
        hi: "Yeh indirect failure hai. Switch pehle Max Age (20 s) wait karta hai taaki stored BPDU information expire ho, phir 15 s listening aur 15 s learning: 50 s. 30 s direct case hai, jahan switch apna root port down hote dekhta hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "`show spanning-tree vlan 1` on SW3 shows `Root ID Priority 24577`, `Address 0019.aa00.0002`, `Cost 8`, `Port 26 (GigabitEthernet0/2)`. What does this tell you?",
        hi: "SW3 par `show spanning-tree vlan 1` dikhata hai `Root ID Priority 24577`, `Address 0019.aa00.0002`, `Cost 8`, `Port 26 (GigabitEthernet0/2)`. Isse kya pata chalta hai?",
      },
      options: [
        { en: "SW3 is the root bridge for VLAN 1", hi: "SW3 VLAN 1 ka root bridge hai" },
        { en: "The root is 0019.aa00.0002 with priority 24576, and SW3 reaches it through Gi0/2 at a total cost of 8", hi: "Root 0019.aa00.0002 hai jiski priority 24576 hai, aur SW3 us tak Gi0/2 se total cost 8 par pahunchta hai" },
        { en: "Gi0/2 is SW3's designated port and its own port cost is 8", hi: "Gi0/2 SW3 ka designated port hai aur uski apni port cost 8 hai" },
        { en: "Someone configured priority 24577 on the root", hi: "Kisi ne root par priority 24577 configure ki hai" },
      ],
      answer: 1,
      explain: {
        en: "The Root ID section describes the root bridge. Cost is SW3's total root path cost and Port is SW3's root port. 24577 is 24576 + VLAN 1; a configured priority must be a multiple of 4096. If SW3 were root, the output would say `This bridge is the root`.",
        hi: "Root ID section root bridge ke baare mein hai. Cost SW3 ki total root path cost hai aur Port SW3 ka root port. 24577 = 24576 + VLAN 1; configured priority 4096 ka multiple hi ho sakti hai. Agar SW3 root hota, toh output mein `This bridge is the root` likha hota.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "j-bK-EFt9cY",
      title: "Free CCNA | Spanning Tree Protocol (Part 1) | Day 20",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Loops, broadcast storms, BPDUs, and the root bridge and port role election.", hi: "Loops, broadcast storms, BPDUs, aur root bridge aur port roles ka election." },
    },
    {
      id: "nWpldCc8msY",
      title: "Free CCNA | Spanning Tree Protocol (Part 2) | Day 21",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Port states, timers and what is inside a BPDU.", hi: "Port states, timers aur BPDU ke andar kya hota hai." },
    },
    {
      id: "GkR-DQ8Jf2o",
      title: "96. Free CCNA (NEW) | STP in Hindi - Spanning Tree Protocol",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Why switching loops happen and what STP does about them, in Hindi.", hi: "Switching loops kyun bante hain aur STP unke saath kya karta hai, Hindi mein." },
    },
    {
      id: "yw8gKuqUF9k",
      title: "97. Free CCNA (NEW) | STP in Hindi - Root Bridge Election Proces",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "The root bridge election worked through step by step, in Hindi.", hi: "Root bridge election step by step, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Find the root and the blocked port in Packet Tracer", hi: "Packet Tracer mein root aur blocked port dhoondho" },
    steps: [
      {
        en: "Place three 2960 switches. Cable SW1 Gi0/1 to SW2 Gi0/1, SW1 Gi0/2 to SW3 Gi0/1, and SW2 Gi0/2 to SW3 Gi0/2. Put PC-A (10.1.1.10/24) on SW2 Fa0/1 and PC-B (10.1.1.20/24) on SW3 Fa0/1.",
        hi: "Teen 2960 switches lagao. SW1 Gi0/1 ko SW2 Gi0/1 se, SW1 Gi0/2 ko SW3 Gi0/1 se, aur SW2 Gi0/2 ko SW3 Gi0/2 se cable karo. PC-A (10.1.1.10/24) ko SW2 Fa0/1 par aur PC-B (10.1.1.20/24) ko SW3 Fa0/1 par lagao.",
      },
      {
        en: "Wait about 30 seconds. One uplink light stays amber. Run `show spanning-tree` on each switch and find the one that says `This bridge is the root`.",
        hi: "Lagbhag 30 second wait karo. Ek uplink ki light amber rehti hai. Har switch par `show spanning-tree` chalao aur woh switch dhoondho jo `This bridge is the root` kehta hai.",
      },
      {
        en: "Write down each switch's bridge ID. Predict every root port, designated port and the blocked port on paper, then check your answer against the Role and Sts columns.",
        hi: "Har switch ka bridge ID likh lo. Kagaz par har root port, designated port aur blocked port predict karo, phir Role aur Sts columns se apna answer check karo.",
      },
      {
        en: "On the switch with the highest MAC, enter `spanning-tree vlan 1 priority 4096`. Run `show spanning-tree` again: which ports changed role?",
        hi: "Sabse bade MAC wale switch par `spanning-tree vlan 1 priority 4096` daalo. Phir se `show spanning-tree` chalao: kin ports ka role badla?",
      },
      {
        en: "Ping PC-B from PC-A repeatedly, then `shutdown` the root port of the switch that has the blocked port. Count how long the pings fail before the blocked port takes over.",
        hi: "PC-A se PC-B ko baar baar ping karo, phir jis switch par blocked port hai uske root port par `shutdown` karo. Gino ki blocked port ke takeover karne tak pings kitni der fail hote hain.",
      },
    ],
  },
};

export default lesson;
