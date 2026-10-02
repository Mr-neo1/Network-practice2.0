import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "wireless-architectures",
  intro: {
    en: "One access point in a flat is easy: you configure it once and forget it. A hospital or a campus has hundreds of APs that must share channels, hand clients from one AP to the next and enforce one security policy. How those APs are managed, and where client traffic enters the wired network, is the wireless architecture, and it decides how you cable each AP and what keeps working when a WAN link fails.",
    hi: "Flat mein ek access point sambhalna aasaan hai: ek baar configure karo aur bhool jao. Hospital ya campus mein sau se zyada APs hote hain jinhe channels share karne hain, clients ko ek AP se doosre AP ko handover karna hai aur ek hi security policy follow karni hai. Yeh APs kaise manage hote hain aur client ka traffic wired network mein kahan enter karta hai, isi ko wireless architecture kehte hain, aur isi se decide hota hai ki har AP ko kaise cable karna hai aur WAN link fail hone par kya chalta rahega.",
  },
  outcomes: [
    { en: "Compare autonomous, lightweight and cloud-managed APs, and say where each one's configuration lives", hi: "Autonomous, lightweight aur cloud-managed APs compare kar sako, aur bata sako ki har ek ki configuration kahan rehti hai" },
    { en: "Explain split-MAC and the two CAPWAP tunnels, with their UDP ports and encryption", hi: "Split-MAC aur dono CAPWAP tunnels samjha sako, unke UDP ports aur encryption ke saath" },
    { en: "Trace a client's traffic through a local-mode AP and through a FlexConnect AP", hi: "Local-mode AP aur FlexConnect AP, dono mein client ka traffic trace kar sako" },
    { en: "Match each AP mode (local, FlexConnect, monitor, rogue detector, sniffer, SE-Connect, bridge) to its job", hi: "Har AP mode (local, FlexConnect, monitor, rogue detector, sniffer, SE-Connect, bridge) ko uske kaam se match kar sako" },
    { en: "Name the WLC deployment models and the typical scale of each", hi: "WLC deployment models aur har ek ka typical scale bata sako" },
    { en: "Choose an access port, a trunk or a LAG for APs and WLCs, and tell WLC ports from WLC interfaces", hi: "APs aur WLCs ke liye access port, trunk ya LAG choose kar sako, aur WLC ports aur WLC interfaces ka farak bata sako" },
  ],
  sections: [
    {
      id: "autonomous-aps",
      heading: { en: "Autonomous APs: every AP on its own", hi: "Autonomous APs: har AP apne dum par" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An **autonomous AP** is self-contained. It stores its own configuration (SSIDs, security, channel, transmit power), which you set through its own CLI or web page. When a client sends a frame, the AP converts it from 802.11 to Ethernet and puts it straight onto the wired network, in the VLAN mapped to that SSID. Your home Wi-Fi router works this way.",
            hi: "**Autonomous AP** apne aap mein poora hota hai. Uski configuration (SSIDs, security, channel, transmit power) usi ke andar rehti hai, jo tum uske apne CLI ya web page se set karte ho. Client frame bhejta hai toh AP use 802.11 se Ethernet mein badal kar seedha wired network par daal deta hai, us SSID se mapped VLAN mein. Ghar ka Wi-Fi router bhi isi tarah kaam karta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Each SSID maps to a VLAN on the AP itself, so the AP's switch port is a **trunk** carrying every client VLAN plus a management VLAN for the AP. Every AP needs every client VLAN, so those VLANs have to stretch across the whole campus to reach all the APs.",
            hi: "Har SSID AP ke andar hi kisi VLAN se map hota hai, isliye AP ka switch port **trunk** hota hai jisme saare client VLANs aur AP ka management VLAN chalte hain. Har AP ko har client VLAN chahiye, isliye yeh VLANs poore campus mein failane padte hain taaki saare APs tak pahunch sakein.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**No central configuration**: 200 APs are 200 separate configs. Changing one Wi-Fi key means 200 logins.",
              hi: "**Central configuration nahi**: 200 APs matlab 200 alag configs. Ek Wi-Fi key badalni ho toh 200 baar login karo.",
            },
            {
              en: "**No shared view of the air**: each AP picks its channel and power alone, so neighbours can clash on the same channel.",
              hi: "**Air ka shared view nahi**: har AP apna channel aur power akele chunta hai, isliye padosi APs same channel par takra sakte hain.",
            },
            {
              en: "**Large Layer 2 domains**: stretching client VLANs to every AP makes big broadcast domains and more spanning tree to manage.",
              hi: "**Bade Layer 2 domains**: client VLANs ko har AP tak failane se broadcast domains bade ho jaate hain aur spanning tree ka kaam badh jaata hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Where autonomous APs still fit", hi: "Autonomous APs abhi bhi kahan theek hain" },
          text: {
            en: "A home or a small office with two or three APs does fine with autonomous APs. Cisco's autonomous APs can also act as a repeater, a workgroup bridge or an outdoor bridge between buildings.",
            hi: "Ghar ya do-teen APs wala chhota office autonomous APs se aaram se chal jaata hai. Cisco ke autonomous APs repeater, workgroup bridge ya do buildings ke beech outdoor bridge ka kaam bhi kar sakte hain.",
          },
        },
      ],
    },
    {
      id: "split-mac-capwap",
      heading: { en: "Lightweight APs, the WLC and split-MAC", hi: "Lightweight APs, WLC aur split-MAC" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **lightweight AP** keeps only the jobs that must happen in real time, right next to the radio. Everything that needs a view of the whole network moves to a **wireless LAN controller (WLC)**. Cisco calls this division **split-MAC**, because the work of the 802.11 MAC layer is split between the two boxes.",
            hi: "**Lightweight AP** sirf woh kaam rakhta hai jo real time mein, radio ke bilkul paas hone chahiye. Jis kaam ke liye poore network ka view chahiye, woh **wireless LAN controller (WLC)** ke paas chala jaata hai. Cisco is batwaare ko **split-MAC** kehta hai, kyunki 802.11 MAC layer ka kaam do boxes mein baant diya jaata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Who does what in split-MAC", hi: "Split-MAC mein kaun kya karta hai" },
          columns: [{ en: "Lightweight AP (real time)", hi: "Lightweight AP (real time)" }, { en: "WLC (management)", hi: "WLC (management)" }],
          rows: [
            [
              { en: "Sends and receives 802.11 frames over the air", hi: "Air par 802.11 frames bhejta aur receive karta hai" },
              { en: "RF management: channel and power for every AP", hi: "RF management: har AP ka channel aur power" },
            ],
            [
              { en: "Sends beacons and answers probe requests", hi: "Beacons bhejta hai aur probe requests ka jawab deta hai" },
              { en: "Client authentication and association", hi: "Client authentication aur association" },
            ],
            [
              { en: "Encrypts and decrypts 802.11 data frames", hi: "802.11 data frames encrypt aur decrypt karta hai" },
              { en: "Roaming: tracks clients as they move between APs", hi: "Roaming: APs ke beech ghoomte clients ko track karta hai" },
            ],
            [
              { en: "Buffers frames and sends 802.11 acknowledgements", hi: "Frames buffer karta hai aur 802.11 acknowledgements bhejta hai" },
              { en: "Security and QoS policy for each WLAN", hi: "Har WLAN ki security aur QoS policy" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "The AP and the WLC talk over **CAPWAP** (Control And Provisioning of Wireless Access Points), which builds two tunnels between the AP's IP address and the WLC's management IP address:",
            hi: "AP aur WLC **CAPWAP** (Control And Provisioning of Wireless Access Points) se baat karte hain. CAPWAP AP ke IP address aur WLC ke management IP address ke beech do tunnels banata hai:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Control tunnel, UDP 5246**: the AP joins the WLC, downloads its configuration (and new firmware if needed) and reports its status. This tunnel is **always encrypted** with DTLS.",
              hi: "**Control tunnel, UDP 5246**: AP isi se WLC join karta hai, apni configuration (aur zaroorat ho toh naya firmware) download karta hai aur apna status report karta hai. Yeh tunnel **hamesha DTLS se encrypted** hota hai.",
            },
            {
              en: "**Data tunnel, UDP 5247**: carries client frames between the AP and the WLC. It is **not encrypted by default**; DTLS data encryption is an option you can turn on.",
              hi: "**Data tunnel, UDP 5247**: AP aur WLC ke beech clients ke frames le jaata hai. Yeh **by default encrypted nahi** hota; DTLS data encryption ek option hai jo on kiya ja sakta hai.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "CAPWAP is ordinary UDP inside IP, so the AP and the WLC do not need to share a VLAN or even a building. In the animation, AP1 is in VLAN 10 (10.1.10.11) and WLC1's management interface is in VLAN 99 (10.1.99.10); CSW1 simply routes the packets between them. Central control gives you:",
            hi: "CAPWAP bas IP ke andar normal UDP hai, isliye AP aur WLC ka same VLAN, ya same building mein hona bhi zaroori nahi. Animation mein AP1 VLAN 10 (10.1.10.11) mein hai aur WLC1 ka management interface VLAN 99 (10.1.99.10) mein; CSW1 bas dono ke beech packets route karta hai. Central control se yeh milta hai:",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Scale**: one WLC configures hundreds or thousands of APs from one place.", hi: "**Scale**: ek WLC ek hi jagah se sau ya hazaar APs configure karta hai." },
            {
              en: "**RRM (Radio Resource Management)**: the WLC picks channels and power for every AP, and if an AP dies it raises its neighbours' power to cover the hole.",
              hi: "**RRM (Radio Resource Management)**: WLC har AP ka channel aur power decide karta hai, aur koi AP band ho jaaye toh uske padosiyon ki power badha kar gap cover karta hai.",
            },
            { en: "**Fast roaming**: the WLC already knows every client, so moving to the next AP is quick.", hi: "**Fast roaming**: WLC har client ko pehle se jaanta hai, isliye agle AP par shift hona jaldi hota hai." },
            { en: "**One policy**: security, QoS and client load balancing are set once on the WLC.", hi: "**Ek policy**: security, QoS aur client load balancing WLC par ek hi baar set hote hain." },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "How a new AP finds its WLC", hi: "Naya AP apna WLC kaise dhoondhta hai" },
          text: {
            en: "A new AP looks for a controller by broadcasting on its own subnet, by reading DHCP option 43 from its DHCP server, or by resolving the DNS name `CISCO-CAPWAP-CONTROLLER` in its local domain. After it has joined once, it remembers that WLC.",
            hi: "Naya AP controller dhoondhne ke liye apne subnet par broadcast karta hai, DHCP server se mila DHCP option 43 padhta hai, ya apne local domain mein DNS naam `CISCO-CAPWAP-CONTROLLER` resolve karta hai. Ek baar join ho gaya, toh woh WLC use yaad rehta hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Learn the ports as a pair: **5246 control** (always encrypted), **5247 data** (encryption optional). Both are UDP. CAPWAP is an open standard (RFC 5415) that replaced Cisco's older LWAPP.",
            hi: "Ports ko jodi mein yaad karo: **5246 control** (hamesha encrypted), **5247 data** (encryption optional). Dono UDP hain. CAPWAP ek open standard (RFC 5415) hai jisne Cisco ke purane LWAPP ki jagah li.",
          },
        },
      ],
    },
    {
      id: "local-vs-flexconnect",
      heading: { en: "Where client traffic goes: local mode and FlexConnect", hi: "Client traffic kahan jaata hai: local mode aur FlexConnect" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In **local mode**, the default, the AP sends every client frame to the WLC inside the data tunnel. The WLC turns it into an Ethernet frame and bridges it onto the VLAN mapped to that WLAN. So the WLC, not the AP, is where wireless traffic enters the wired network. Follow Laptop1 in the animation:",
            hi: "**Local mode** mein, jo default hai, AP har client frame ko data tunnel ke andar WLC ko bhejta hai. WLC use Ethernet frame bana kar us WLAN se mapped VLAN par bridge karta hai. Matlab wireless traffic wired network mein AP par nahi, WLC par enter karta hai. Animation mein Laptop1 ko follow karo:",
          },
        },
        {
          type: "steps",
          items: [
            { en: "Laptop1 (10.1.20.25) on AP1 sends a packet to SRV1 (10.1.30.10).", hi: "AP1 se juda Laptop1 (10.1.20.25) SRV1 (10.1.30.10) ko packet bhejta hai." },
            {
              en: "AP1 wraps the 802.11 frame in CAPWAP: source 10.1.10.11, destination 10.1.99.10 (WLC1), UDP 5247.",
              hi: "AP1 802.11 frame ko CAPWAP mein wrap karta hai: source 10.1.10.11, destination 10.1.99.10 (WLC1), UDP 5247.",
            },
            {
              en: "CSW1 routes that packet from VLAN 10 to VLAN 99 using only the outer header, and sends it down the LAG trunk to WLC1.",
              hi: "CSW1 sirf bahar wala header dekh kar packet ko VLAN 10 se VLAN 99 mein route karta hai aur LAG trunk se WLC1 ko bhej deta hai.",
            },
            {
              en: "WLC1 removes CAPWAP, rebuilds the frame as Ethernet and sends it out of its VLAN 20 dynamic interface, tagged 20 on the trunk.",
              hi: "WLC1 CAPWAP hata kar frame ko Ethernet mein dobara banata hai aur apne VLAN 20 dynamic interface se bhejta hai, trunk par tag 20 ke saath.",
            },
            {
              en: "CSW1, the VLAN 20 gateway (10.1.20.1), routes the packet to SRV1 in VLAN 30.",
              hi: "CSW1, jo VLAN 20 ka gateway (10.1.20.1) hai, packet ko VLAN 30 mein SRV1 tak route karta hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Everything goes through the WLC", hi: "Sab kuch WLC se hokar jaata hai" },
          text: {
            en: "In local mode even two clients on the same AP talk through the WLC and back. On a campus that is fine. At a branch with the WLC at headquarters, every print job would cross the WAN twice. FlexConnect exists to fix that.",
            hi: "Local mode mein same AP par jude do clients bhi WLC tak jaakar wapas aakar hi baat karte hain. Campus mein yeh theek hai. Lekin agar branch ka WLC headquarters mein hai, toh har print job do baar WAN cross karega. FlexConnect isi problem ko solve karta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "A **FlexConnect** AP, usually at a branch, keeps its CAPWAP control tunnel to a central WLC, but for WLANs with **local switching** turned on it converts client frames to Ethernet itself and puts them on a local VLAN. The branch saves WAN bandwidth. If the WAN fails, the AP moves to **standalone** mode and keeps serving its locally switched WLANs.",
            hi: "**FlexConnect** AP, jo aam taur par branch mein hota hai, central WLC tak apna CAPWAP control tunnel rakhta hai. Lekin jin WLANs par **local switching** on hai, unke client frames ko woh khud Ethernet bana kar local VLAN par daal deta hai. Isse branch ki WAN bandwidth bachti hai. WAN fail ho jaaye toh AP **standalone** mode mein chala jaata hai aur locally switched WLANs serve karta rehta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Local mode vs FlexConnect with local switching", hi: "Local mode vs FlexConnect (local switching ke saath)" },
          columns: ["", { en: "Local mode", hi: "Local mode" }, { en: "FlexConnect", hi: "FlexConnect" }],
          rows: [
            [
              { en: "Client data goes to", hi: "Client data kahan jaata hai" },
              { en: "The WLC, inside the CAPWAP data tunnel", hi: "WLC tak, CAPWAP data tunnel ke andar" },
              { en: "A local VLAN, straight from the AP", hi: "Seedha AP se local VLAN par" },
            ],
            [
              { en: "Control traffic", hi: "Control traffic" },
              { en: "CAPWAP to the WLC", hi: "CAPWAP se WLC tak" },
              { en: "CAPWAP to the WLC", hi: "CAPWAP se WLC tak" },
            ],
            [
              { en: "Switch port", hi: "Switch port" },
              { en: "Access port in the AP VLAN", hi: "AP VLAN ka access port" },
              { en: "Trunk: AP VLAN native, plus client VLANs", hi: "Trunk: AP VLAN native, saath mein client VLANs" },
            ],
            [
              { en: "If the WLC is unreachable", hi: "WLC tak pahunch na ho toh" },
              { en: "Drops its clients and looks for another WLC", hi: "Clients drop karta hai aur doosra WLC dhoondhta hai" },
              { en: "Standalone: locally switched WLANs keep working", hi: "Standalone: locally switched WLANs chalte rehte hain" },
            ],
            [
              { en: "Typical place", hi: "Aam taur par kahan" },
              { en: "Campus or headquarters", hi: "Campus ya headquarters" },
              { en: "Branch office across a WAN", hi: "WAN ke paar branch office" },
            ],
          ],
        },
      ],
    },
    {
      id: "ap-modes",
      heading: { en: "AP modes", hi: "AP modes" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every lightweight AP runs in one mode, set per AP on the WLC. Changing the mode usually reboots the AP, so plan it outside busy hours. Only some modes serve clients; the others turn the AP into a sensor or a wireless link.",
            hi: "Har lightweight AP ek mode mein chalta hai, jo WLC par har AP ke liye alag set hota hai. Mode badalne par aksar AP reboot hota hai, isliye yeh kaam busy time mein mat karo. Sirf kuch modes clients ko serve karte hain; baaki AP ko sensor ya wireless link bana dete hain.",
          },
        },
        {
          type: "table",
          caption: { en: "Lightweight AP modes", hi: "Lightweight AP ke modes" },
          columns: ["Mode", { en: "What the AP does", hi: "AP kya karta hai" }, { en: "Serves clients?", hi: "Clients serve karta hai?" }],
          rows: [
            [
              "Local",
              {
                en: "The default. Offers its WLANs on one channel and tunnels client data to the WLC. Between transmissions it briefly scans other channels for noise, interference and rogue devices.",
                hi: "Default mode. Ek channel par apne WLANs offer karta hai aur client data WLC tak tunnel karta hai. Transmissions ke beech thodi der doosre channels scan karta hai: noise, interference aur rogue devices ke liye.",
              },
              { en: "Yes", hi: "Haan" },
            ],
            [
              "FlexConnect",
              {
                en: "Like local mode, but can switch client traffic onto local VLANs and keeps working if its tunnel to the WLC goes down.",
                hi: "Local mode jaisa, lekin client traffic local VLANs par switch kar sakta hai aur WLC tak tunnel toot jaaye tab bhi kaam karta rehta hai.",
              },
              { en: "Yes", hi: "Haan" },
            ],
            [
              "Monitor",
              {
                en: "Transmits nothing. Its radio listens on all channels as a dedicated sensor: rogue APs, intrusion (IDS) events and client location.",
                hi: "Kuch transmit nahi karta. Radio dedicated sensor ban kar saare channels par sunta hai: rogue APs, intrusion (IDS) events aur client location.",
              },
              { en: "No", hi: "Nahi" },
            ],
            [
              "Rogue detector",
              {
                en: "Radio turned off. Listens to ARP on the wired network and compares the MAC addresses it sees with the list of suspected rogues sent by the WLC.",
                hi: "Radio band. Wired network par ARP sunta hai aur jo MAC addresses dikhte hain unhe WLC ki bheji suspected rogues ki list se match karta hai.",
              },
              { en: "No", hi: "Nahi" },
            ],
            [
              "Sniffer",
              {
                en: "Captures 802.11 frames on a channel and forwards them to a PC running an analyser such as Wireshark.",
                hi: "Ek channel ke 802.11 frames capture karke Wireshark jaise analyser chalane wale PC ko forward karta hai.",
              },
              { en: "No", hi: "Nahi" },
            ],
            [
              "SE-Connect",
              {
                en: "Spectrum analysis on all channels, sent to a tool such as Cisco Spectrum Expert, to find non-Wi-Fi interference like microwave ovens.",
                hi: "Saare channels ka spectrum analysis karke Cisco Spectrum Expert jaise tool ko bhejta hai, taaki microwave oven jaisa non-Wi-Fi interference pakda ja sake.",
              },
              { en: "No", hi: "Nahi" },
            ],
            [
              "Bridge / mesh",
              {
                en: "Links two sites wirelessly (point-to-point or point-to-multipoint), or forms a mesh of APs where running cable is hard.",
                hi: "Do sites ko wireless se jodta hai (point-to-point ya point-to-multipoint), ya jahan cable daalna mushkil ho wahan APs ka mesh banata hai.",
              },
              { en: "Can, besides the link", hi: "Kar sakta hai, link ke saath" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Pairs people mix up", hi: "Jin pairs mein log confuse hote hain" },
          text: {
            en: "Monitor (radio listens, wireless side) vs rogue detector (radio off, wired side). Sniffer (captures frames for Wireshark) vs SE-Connect (raw RF spectrum for a spectrum analyser). Local (data to the WLC) vs FlexConnect (data can stay local).",
            hi: "Monitor (radio sunta hai, wireless side) vs rogue detector (radio off, wired side). Sniffer (Wireshark ke liye frames capture) vs SE-Connect (spectrum analyser ke liye raw RF spectrum). Local (data WLC tak) vs FlexConnect (data local reh sakta hai).",
          },
        },
      ],
    },
    {
      id: "deployment-models",
      heading: { en: "Where the controller lives: deployment models", hi: "Controller kahan rehta hai: deployment models" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A WLC can be a box of its own, software on a server, or a feature built into a switch or an AP. The CCNA uses four names for these, and adds cloud-managed APs as a separate option.",
            hi: "WLC ek alag box ho sakta hai, server par chalne wala software, ya switch ya AP ke andar built-in feature. CCNA inke liye chaar naam use karta hai, aur cloud-managed APs ko alag option ki tarah rakhta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "WLC deployment models (AP counts from Cisco's CCNA material)", hi: "WLC deployment models (AP counts Cisco ke CCNA material se)" },
          columns: [{ en: "Model", hi: "Model" }, { en: "Where the WLC runs", hi: "WLC kahan chalta hai" }, { en: "Up to about", hi: "Lagbhag kitne APs" }, { en: "Fits", hi: "Kiske liye" }],
          rows: [
            [
              { en: "Unified (centralized)", hi: "Unified (centralized)" },
              { en: "A hardware appliance in a central place, such as the data center", hi: "Central jagah, jaise data center, mein ek hardware appliance" },
              "6000 APs",
              { en: "Large campus", hi: "Bada campus" },
            ],
            [
              { en: "Cloud-based", hi: "Cloud-based" },
              { en: "A virtual machine on a server, usually in the company's private cloud", hi: "Server par ek virtual machine, aam taur par company ke private cloud mein" },
              "3000 APs",
              { en: "Large, virtualised data centers", hi: "Bade, virtualised data centers" },
            ],
            [
              { en: "Embedded", hi: "Embedded" },
              { en: "Inside a switch", hi: "Switch ke andar" },
              "200 APs",
              { en: "Small campus or branch", hi: "Chhota campus ya branch" },
            ],
            [
              { en: "Mobility Express", hi: "Mobility Express" },
              { en: "Inside one of the APs; the other APs join it", hi: "Ek AP ke andar; baaki APs usi ko join karte hain" },
              "100 APs",
              { en: "Small branch", hi: "Chhoti branch" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "**Cloud-managed** APs, such as Cisco Meraki, have no WLC on site. Each AP connects over the internet to the Meraki dashboard, which holds the configuration, monitoring and RF decisions. Only management traffic goes to the cloud. Client data is switched locally onto the LAN, much like an autonomous AP, so a Meraki AP with several VLANs sits on a trunk.",
            hi: "**Cloud-managed** APs, jaise Cisco Meraki, ke liye site par koi WLC nahi hota. Har AP internet ke through Meraki dashboard se judta hai, jahan configuration, monitoring aur RF decisions rehte hain. Cloud tak sirf management traffic jaata hai. Client data locally LAN par switch hota hai, bilkul autonomous AP ki tarah, isliye kai VLANs wala Meraki AP trunk par lagta hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Cloud-based WLC is not cloud-managed", hi: "Cloud-based WLC aur cloud-managed alag hain" },
          text: {
            en: "A cloud-based WLC is still a controller running CAPWAP, with client data tunnelled to it; it just runs as a VM. With Meraki there is no CAPWAP to a controller and no client data goes to the cloud.",
            hi: "Cloud-based WLC phir bhi ek controller hai jo CAPWAP chalata hai, aur client data usi tak tunnel hota hai; bas woh VM ki tarah chalta hai. Meraki mein kisi controller tak CAPWAP nahi hota aur client data cloud tak nahi jaata.",
          },
        },
        {
          type: "p",
          text: {
            en: "Real limits depend on the model and software version. On current Cisco gear the same ideas appear as Catalyst 9800 appliances, the 9800-CL virtual controller, and embedded wireless controllers on Catalyst switches and APs.",
            hi: "Asli limits model aur software version par depend karti hain. Cisco ke current gear mein yahi ideas Catalyst 9800 appliances, 9800-CL virtual controller, aur Catalyst switches aur APs par embedded wireless controllers ke roop mein milte hain.",
          },
        },
      ],
    },
    {
      id: "physical-connections",
      heading: { en: "Cabling it up: access ports, trunks and LAG", hi: "Cabling: access ports, trunks aur LAG" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The rule is simple: a switch port carries the VLANs that actually appear on it. A local-mode AP only sends its own CAPWAP packets, so it needs one VLAN. Anything that bridges client traffic itself needs a trunk.",
            hi: "Rule simple hai: switch port par wahi VLANs chahiye jo us par sach mein aate hain. Local-mode AP sirf apne CAPWAP packets bhejta hai, isliye use ek hi VLAN chahiye. Jo device client traffic khud bridge karta hai, use trunk chahiye.",
          },
        },
        {
          type: "table",
          caption: { en: "What each wireless device plugs into", hi: "Kaunsa wireless device kis port mein lagta hai" },
          columns: [{ en: "Device", hi: "Device" }, { en: "Switch port", hi: "Switch port" }, { en: "Why", hi: "Kyun" }],
          rows: [
            [
              { en: "Autonomous AP", hi: "Autonomous AP" },
              "Trunk",
              { en: "It bridges each SSID to its own VLAN, plus a management VLAN", hi: "Har SSID ko uske VLAN par bridge karta hai, saath mein management VLAN" },
            ],
            [
              { en: "Lightweight AP, local mode", hi: "Lightweight AP, local mode" },
              { en: "Access (usually PoE)", hi: "Access (aam taur par PoE)" },
              { en: "All client traffic is inside CAPWAP, in the AP's own VLAN", hi: "Saara client traffic CAPWAP ke andar hai, AP ke apne VLAN mein" },
            ],
            [
              { en: "Lightweight AP, FlexConnect", hi: "Lightweight AP, FlexConnect" },
              "Trunk",
              { en: "Native VLAN for the AP itself, tagged VLANs for locally switched clients", hi: "AP ke liye native VLAN, locally switched clients ke liye tagged VLANs" },
            ],
            [
              { en: "Cloud-managed AP (Meraki)", hi: "Cloud-managed AP (Meraki)" },
              { en: "Trunk if its SSIDs use several VLANs", hi: "Trunk, agar SSIDs kai VLANs use karein" },
              { en: "It switches client data locally", hi: "Client data locally switch karta hai" },
            ],
            [
              "WLC",
              { en: "Trunk, often a LAG", hi: "Trunk, aksar LAG" },
              { en: "Management VLAN plus every client VLAN it bridges to", hi: "Management VLAN aur har woh client VLAN jahan woh bridge karta hai" },
            ],
          ],
        },
        {
          type: "cli",
          title: { en: "CSW1: a local-mode AP and the LAG to WLC1", hi: "CSW1: local-mode AP aur WLC1 tak LAG" },
          lines: [
            { prompt: "CSW1(config)#", cmd: "interface GigabitEthernet1/0/1" },
            { prompt: "CSW1(config-if)#", cmd: "description AP1 (lightweight, local mode)" },
            { prompt: "CSW1(config-if)#", cmd: "switchport mode access" },
            { prompt: "CSW1(config-if)#", cmd: "switchport access vlan 10", comment: { en: "Only the AP VLAN", hi: "Sirf AP VLAN" } },
            { prompt: "CSW1(config-if)#", cmd: "spanning-tree portfast" },
            { prompt: "CSW1(config-if)#", cmd: "exit" },
            { prompt: "CSW1(config)#", cmd: "interface range GigabitEthernet1/0/23 - 24" },
            { prompt: "CSW1(config-if-range)#", cmd: "channel-group 1 mode on", comment: { en: "Static LAG: no LACP or PAgP", hi: "Static LAG: LACP ya PAgP nahi" } },
            { out: "Creating a port-channel interface Port-channel 1" },
            { prompt: "CSW1(config-if-range)#", cmd: "exit" },
            { prompt: "CSW1(config)#", cmd: "interface Port-channel1" },
            { prompt: "CSW1(config-if)#", cmd: "switchport mode trunk" },
            { prompt: "CSW1(config-if)#", cmd: "switchport trunk allowed vlan 20,99", comment: { en: "Client VLAN 20, management VLAN 99", hi: "Client VLAN 20, management VLAN 99" } },
          ],
          note: {
            en: "VLAN 10 does not need to be on the WLC trunk: CSW1 routes the CAPWAP packets from VLAN 10 to the WLC's management address in VLAN 99.",
            hi: "WLC trunk par VLAN 10 ki zaroorat nahi: CSW1 CAPWAP packets ko VLAN 10 se VLAN 99 mein WLC ke management address tak route kar deta hai.",
          },
        },
        {
          type: "cli",
          title: { en: "BR-SW1: the FlexConnect AP's trunk", hi: "BR-SW1: FlexConnect AP ka trunk" },
          lines: [
            { prompt: "BR-SW1(config)#", cmd: "interface GigabitEthernet1/0/1" },
            { prompt: "BR-SW1(config-if)#", cmd: "description AP3 (FlexConnect)" },
            { prompt: "BR-SW1(config-if)#", cmd: "switchport mode trunk" },
            { prompt: "BR-SW1(config-if)#", cmd: "switchport trunk native vlan 10", comment: { en: "AP3's own address is untagged in VLAN 10", hi: "AP3 ka apna address VLAN 10 mein untagged hai" } },
            { prompt: "BR-SW1(config-if)#", cmd: "switchport trunk allowed vlan 10,20" },
          ],
        },
        {
          type: "cli",
          title: { en: "Checking the LAG to WLC1", hi: "WLC1 tak LAG check karna" },
          lines: [
            { prompt: "CSW1#", cmd: "show etherchannel summary" },
            { out: "Group  Port-channel  Protocol    Ports" },
            { out: "------+-------------+-----------+-----------------------------------------------" },
            { out: "1      Po1(SU)          -        Gi1/0/23(P) Gi1/0/24(P)", comment: { en: "Protocol \"-\" means static (mode on); P = bundled", hi: "Protocol \"-\" ka matlab static (mode on); P = bundled" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "WLC LAG is static", hi: "WLC ka LAG static hota hai" },
          text: {
            en: "Cisco AireOS WLCs, the kind shown in CCNA material, support LAG only as a static EtherChannel. When LAG is on, all the distribution system ports join one bundle. The switch side must use `channel-group 1 mode on`; LACP or PAgP modes will not form a channel with it.",
            hi: "Cisco AireOS WLCs, jo CCNA material mein dikhte hain, LAG sirf static EtherChannel ki tarah support karte hain. LAG on karte hi saare distribution system ports ek bundle mein aa jaate hain. Switch side par `channel-group 1 mode on` hi lagana hoga; LACP ya PAgP modes is ke saath channel nahi banayenge.",
          },
        },
        {
          type: "table",
          caption: { en: "WLC ports are physical sockets", hi: "WLC ports physical sockets hain" },
          columns: [{ en: "Port", hi: "Port" }, { en: "Used for", hi: "Kis kaam ke liye" }],
          rows: [
            [
              { en: "Service port", hi: "Service port" },
              { en: "Out-of-band management and recovery. Carries one VLAN only, so it goes to an access port.", hi: "Out-of-band management aur recovery. Sirf ek VLAN le jaata hai, isliye access port par lagta hai." },
            ],
            [
              { en: "Distribution system port", hi: "Distribution system port" },
              { en: "The normal data ports to the wired network. Usually trunks, and they can be bundled with LAG.", hi: "Wired network tak normal data ports. Aam taur par trunks, aur LAG se bundle ho sakte hain." },
            ],
            [
              { en: "Console port", hi: "Console port" },
              { en: "CLI access with a console cable, as on a switch", hi: "Console cable se CLI access, switch ki tarah" },
            ],
            [
              { en: "Redundancy port", hi: "Redundancy port" },
              { en: "Connects to a second WLC for high availability", hi: "High availability ke liye doosre WLC se judta hai" },
            ],
          ],
        },
        {
          type: "table",
          caption: { en: "WLC interfaces are logical, each with an IP address and VLAN", hi: "WLC interfaces logical hain, har ek ka IP address aur VLAN hota hai" },
          columns: [{ en: "Interface", hi: "Interface" }, { en: "Used for", hi: "Kis kaam ke liye" }],
          rows: [
            [
              "Management",
              { en: "CAPWAP tunnels end here. Also GUI, SSH, RADIUS, NTP and syslog. WLC1's is 10.1.99.10 in VLAN 99.", hi: "CAPWAP tunnels yahin khatam hote hain. GUI, SSH, RADIUS, NTP aur syslog bhi. WLC1 ka 10.1.99.10 hai, VLAN 99 mein." },
            ],
            [
              "Dynamic",
              { en: "One per client VLAN. Each WLAN maps to one; CORP maps to corp-vlan20 (lesson 2.9).", hi: "Har client VLAN ke liye ek. Har WLAN kisi ek se map hota hai; CORP corp-vlan20 se mapped hai (lesson 2.9)." },
            ],
            [
              "Virtual",
              { en: "Used towards wireless clients, for example as the DHCP server address they see and for web authentication. Give it an address used nowhere else, such as 192.0.2.1.", hi: "Wireless clients ki taraf use hota hai, jaise clients ko dikhne wala DHCP server address aur web authentication. Ise aisa address do jo kahin aur use na ho, jaise 192.0.2.1." },
            ],
            [
              { en: "Service port", hi: "Service port" },
              { en: "The IP address on the service port for out-of-band management", hi: "Out-of-band management ke liye service port ka IP address" },
            ],
            [
              { en: "Redundancy management", hi: "Redundancy management" },
              { en: "Manages the standby WLC of a high-availability pair", hi: "High-availability pair ke standby WLC ko manage karta hai" },
            ],
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Autonomous AP", def: { en: "An AP that is configured on its own and bridges client traffic straight onto the wired network.", hi: "Aisa AP jo akele configure hota hai aur client traffic seedha wired network par bridge karta hai." } },
    { term: "Lightweight AP", def: { en: "An AP that takes its configuration from a WLC and splits the 802.11 work with it.", hi: "Aisa AP jo apni configuration WLC se leta hai aur 802.11 ka kaam uske saath baant leta hai." } },
    { term: "WLC", def: { en: "Wireless LAN controller: manages lightweight APs, RF, client authentication, roaming and WLAN policy.", hi: "Wireless LAN controller: lightweight APs, RF, client authentication, roaming aur WLAN policy manage karta hai." } },
    { term: "Split-MAC", def: { en: "The division of 802.11 MAC work: real-time tasks on the AP, management tasks on the WLC.", hi: "802.11 MAC kaam ka batwara: real-time kaam AP par, management kaam WLC par." } },
    { term: "CAPWAP", def: { en: "The AP-to-WLC protocol: a control tunnel on UDP 5246 (always encrypted) and a data tunnel on UDP 5247.", hi: "AP aur WLC ke beech ka protocol: UDP 5246 par control tunnel (hamesha encrypted) aur UDP 5247 par data tunnel." } },
    { term: "FlexConnect", def: { en: "An AP mode for branches that can switch client data locally and keep working when the WLC is unreachable.", hi: "Branches ke liye AP mode jo client data locally switch kar sakta hai aur WLC tak pahunch na ho tab bhi chalta rehta hai." } },
    { term: "Dynamic interface", def: { en: "A WLC interface in a client VLAN; mapping a WLAN to it decides which VLAN that WLAN's clients use.", hi: "Client VLAN mein WLC ka interface; WLAN ko isse map karne se decide hota hai ki us WLAN ke clients kaunsa VLAN use karenge." } },
    { term: "LAG", def: { en: "Link aggregation on a WLC: its distribution system ports bundled into one static EtherChannel.", hi: "WLC par link aggregation: uske distribution system ports ek static EtherChannel mein bundle hote hain." } },
  ],
  commands: [
    { cmd: "switchport mode access / switchport access vlan 10", mode: "Interface config (CSW1(config-if)#)", does: { en: "Put a local-mode lightweight AP's port in the AP VLAN", hi: "Local-mode lightweight AP ke port ko AP VLAN mein daalta hai" } },
    { cmd: "spanning-tree portfast", mode: "Interface config", does: { en: "Bring the AP's access port up without waiting for spanning tree", hi: "AP ka access port spanning tree ka wait kiye bina up karta hai" } },
    { cmd: "switchport trunk native vlan 10", mode: "Interface config", does: { en: "Carry the FlexConnect AP's own traffic untagged in VLAN 10", hi: "FlexConnect AP ka apna traffic VLAN 10 mein untagged le jaata hai" } },
    { cmd: "switchport trunk allowed vlan 20,99", mode: "Interface config", does: { en: "Limit the WLC trunk to the client and management VLANs", hi: "WLC trunk ko client aur management VLANs tak limit karta hai" } },
    { cmd: "channel-group 1 mode on", mode: "Interface range config (CSW1(config-if-range)#)", does: { en: "Bundle the WLC-facing ports into a static EtherChannel", hi: "WLC ki taraf ke ports ko static EtherChannel mein bundle karta hai" } },
    { cmd: "show etherchannel summary", mode: "Privileged EXEC", does: { en: "Check that the LAG to the WLC is up and bundled", hi: "Check karta hai ki WLC tak LAG up aur bundled hai" } },
    { cmd: "show power inline", mode: "Privileged EXEC", does: { en: "See how much PoE each AP is drawing", hi: "Dekho har AP kitna PoE le raha hai" } },
  ],
  mistakes: [
    {
      en: "Putting a local-mode lightweight AP on a trunk because it has several SSIDs. The SSIDs' VLANs live at the WLC; the AP needs only its own VLAN on an access port. Trunks are for autonomous, FlexConnect and Meraki APs.",
      hi: "Kai SSIDs hain isliye local-mode lightweight AP ko trunk par lagana. SSIDs ke VLANs WLC par hote hain; AP ko access port par sirf apna VLAN chahiye. Trunk autonomous, FlexConnect aur Meraki APs ke liye hota hai.",
    },
    {
      en: "Swapping the CAPWAP ports or their encryption. Control is UDP 5246 and always encrypted; data is UDP 5247 and encrypted only if you enable it.",
      hi: "CAPWAP ports ya unka encryption ulta yaad rakhna. Control UDP 5246 hai aur hamesha encrypted; data UDP 5247 hai aur sirf enable karne par encrypted.",
    },
    {
      en: "Treating a cloud-based WLC and Meraki cloud management as the same thing. The first is a WLC in a VM with tunnelled data; with Meraki, data stays local and only management goes to the cloud.",
      hi: "Cloud-based WLC aur Meraki cloud management ko ek hi cheez samajhna. Pehla VM mein chalne wala WLC hai jahan data tunnel hota hai; Meraki mein data local rehta hai aur sirf management cloud tak jaata hai.",
    },
    {
      en: "Setting LACP or PAgP on the switch ports facing an AireOS WLC. Its LAG is static, so the switch needs `channel-group` mode `on`.",
      hi: "AireOS WLC ki taraf ke switch ports par LACP ya PAgP lagana. Uska LAG static hai, isliye switch par `channel-group` mode `on` chahiye.",
    },
    {
      en: "Thinking a FlexConnect AP sends nothing to the WLC. Its control traffic still uses CAPWAP to the WLC; only client data can stay local.",
      hi: "Yeh sochna ki FlexConnect AP WLC ko kuch nahi bhejta. Uska control traffic ab bhi CAPWAP se WLC tak jaata hai; sirf client data local reh sakta hai.",
    },
    {
      en: "Mixing up WLC ports and interfaces. Ports are physical (service, distribution system, console, redundancy); interfaces are logical with an IP and a VLAN (management, dynamic, virtual, service port, redundancy management).",
      hi: "WLC ports aur interfaces ko mix karna. Ports physical hain (service, distribution system, console, redundancy); interfaces logical hain jinka IP aur VLAN hota hai (management, dynamic, virtual, service port, redundancy management).",
    },
  ],
  recap: [
    { en: "Autonomous APs: configured one by one, data bridged locally, trunk to each AP. Lightweight APs: split-MAC with a WLC.", hi: "Autonomous APs: ek-ek karke configure, data locally bridge, har AP tak trunk. Lightweight APs: WLC ke saath split-MAC." },
    { en: "CAPWAP: control on UDP 5246 (always DTLS-encrypted), data on UDP 5247 (encryption optional), ending at the WLC's management interface.", hi: "CAPWAP: control UDP 5246 par (hamesha DTLS encrypted), data UDP 5247 par (encryption optional), dono WLC ke management interface par khatam." },
    { en: "Local mode: client data enters the wired network at the WLC. FlexConnect: data switched locally at the branch; standalone if the WAN fails.", hi: "Local mode: client data wired network mein WLC par enter karta hai. FlexConnect: branch mein data locally switch; WAN fail ho toh standalone." },
    { en: "AP modes: local, FlexConnect, monitor, rogue detector, sniffer, SE-Connect, bridge/mesh. Only local, FlexConnect and mesh serve clients.", hi: "AP modes: local, FlexConnect, monitor, rogue detector, sniffer, SE-Connect, bridge/mesh. Clients sirf local, FlexConnect aur mesh serve karte hain." },
    { en: "Deployments: unified appliance (~6000 APs), cloud-based VM (~3000), embedded in a switch (~200), Mobility Express in an AP (~100). Meraki: cloud-managed, data local.", hi: "Deployments: unified appliance (~6000 APs), cloud-based VM (~3000), switch mein embedded (~200), AP mein Mobility Express (~100). Meraki: cloud-managed, data local." },
    { en: "Cabling: local-mode AP on an access port; autonomous, FlexConnect and Meraki APs on trunks; WLC on a trunk with a static LAG.", hi: "Cabling: local-mode AP access port par; autonomous, FlexConnect aur Meraki APs trunk par; WLC trunk par, static LAG ke saath." },
  ],
  quiz: [
    {
      q: {
        en: "In Cisco's split-MAC architecture, which job belongs to the WLC rather than the lightweight AP?",
        hi: "Cisco ke split-MAC architecture mein kaunsa kaam lightweight AP ka nahi, balki WLC ka hai?",
      },
      options: [
        { en: "Sending beacons and probe responses", hi: "Beacons aur probe responses bhejna" },
        { en: "Encrypting and decrypting 802.11 data frames", hi: "802.11 data frames encrypt aur decrypt karna" },
        { en: "Client authentication and roaming management", hi: "Client authentication aur roaming management" },
        { en: "Transmitting and receiving frames over the air", hi: "Air par frames transmit aur receive karna" },
      ],
      answer: 2,
      explain: {
        en: "Anything that needs a network-wide view (authentication, association, roaming, RF management, policy) sits on the WLC. Beacons, encryption and the radio itself are real-time jobs, so they stay on the AP.",
        hi: "Jis kaam ke liye poore network ka view chahiye (authentication, association, roaming, RF management, policy) woh WLC par hota hai. Beacons, encryption aur radio khud real-time kaam hain, isliye AP par rehte hain.",
      },
      kind: "concept",
    },
    {
      q: { en: "Which statement about CAPWAP is correct?", hi: "CAPWAP ke baare mein kaunsa statement sahi hai?" },
      options: [
        { en: "Control uses UDP 5246 and is always encrypted; data uses UDP 5247 and is not encrypted by default", hi: "Control UDP 5246 use karta hai aur hamesha encrypted hai; data UDP 5247 use karta hai aur by default encrypted nahi" },
        { en: "Control uses UDP 5247 and data uses UDP 5246; both are always encrypted", hi: "Control UDP 5247 aur data UDP 5246 use karta hai; dono hamesha encrypted" },
        { en: "Both tunnels use TCP 5246 so that lost frames are resent", hi: "Dono tunnels TCP 5246 use karte hain taaki lost frames dobara bheje ja sakein" },
        { en: "Data uses UDP 5247 and is always encrypted; control is sent in clear text", hi: "Data UDP 5247 use karta hai aur hamesha encrypted hai; control clear text mein jaata hai" },
      ],
      answer: 0,
      explain: {
        en: "CAPWAP runs over UDP: 5246 for control, always protected with DTLS, and 5247 for data, where DTLS encryption is optional. The control tunnel carries configuration, so it is the one that must be protected.",
        hi: "CAPWAP UDP par chalta hai: control ke liye 5246, jo hamesha DTLS se protected hai, aur data ke liye 5247, jahan DTLS encryption optional hai. Configuration control tunnel mein jaati hai, isliye use protect karna zaroori hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Laptop1 is associated with AP1, a lightweight AP in local mode. It sends a packet to SRV1, which is connected to the same core switch as the WLC. Where is Laptop1's frame first placed on the wired network as a normal Ethernet frame?",
        hi: "Laptop1 AP1 se associated hai, jo local mode mein lightweight AP hai. Woh SRV1 ko packet bhejta hai, jo usi core switch se juda hai jisse WLC juda hai. Laptop1 ka frame wired network par normal Ethernet frame ban kar sabse pehle kahan aata hai?",
      },
      options: [
        { en: "At AP1's switch port, in the AP VLAN", hi: "AP1 ke switch port par, AP VLAN mein" },
        { en: "At the WLC, out of the dynamic interface for the WLAN's VLAN", hi: "WLC par, WLAN ke VLAN wale dynamic interface se" },
        { en: "At the core switch, which removes the CAPWAP header", hi: "Core switch par, jo CAPWAP header hata deta hai" },
        { en: "At SRV1, which decapsulates CAPWAP itself", hi: "SRV1 par, jo khud CAPWAP decapsulate karta hai" },
      ],
      answer: 1,
      explain: {
        en: "In local mode AP1 tunnels the frame to the WLC inside CAPWAP. The switch forwards the tunnel packet by its outer header and never unwraps it. Only the WLC removes CAPWAP and bridges the frame onto the WLAN's VLAN.",
        hi: "Local mode mein AP1 frame ko CAPWAP ke andar WLC tak tunnel karta hai. Switch tunnel packet ko bahar wale header se forward karta hai, kabhi kholta nahi. Sirf WLC CAPWAP hatata hai aur frame ko WLAN ke VLAN par bridge karta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A retail chain has one WLC at headquarters. Each shop has two APs and a slow WAN link. Card terminals in the shop must keep working on Wi-Fi even if the WAN goes down. Which AP mode should the shop APs use?",
        hi: "Ek retail chain ka ek WLC headquarters mein hai. Har shop mein do APs aur ek slow WAN link hai. Shop ke card terminals WAN down hone par bhi Wi-Fi par chalte rehne chahiye. Shop ke APs kaunsa mode use karein?",
      },
      options: [
        { en: "Local", hi: "Local" },
        { en: "Monitor", hi: "Monitor" },
        { en: "Bridge", hi: "Bridge" },
        { en: "FlexConnect", hi: "FlexConnect" },
      ],
      answer: 3,
      explain: {
        en: "FlexConnect switches client traffic locally, so it does not load the slow WAN, and in standalone mode it keeps serving locally switched WLANs when the WAN fails. A local-mode AP would drop its clients once it lost the WLC.",
        hi: "FlexConnect client traffic locally switch karta hai, isliye slow WAN par load nahi padta, aur WAN fail hone par standalone mode mein locally switched WLANs serve karta rehta hai. Local-mode AP WLC khote hi apne clients drop kar deta.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Which AP mode turns the radio off, listens to ARP on the wired network, and compares the MAC addresses it sees with a list of suspected rogues from the WLC?",
        hi: "Kaunsa AP mode radio band kar deta hai, wired network par ARP sunta hai, aur dikhne wale MAC addresses ko WLC ki suspected rogues wali list se match karta hai?",
      },
      options: [
        { en: "Monitor", hi: "Monitor" },
        { en: "Sniffer", hi: "Sniffer" },
        { en: "Rogue detector", hi: "Rogue detector" },
        { en: "SE-Connect", hi: "SE-Connect" },
      ],
      answer: 2,
      explain: {
        en: "Rogue detector mode works on the wired side with the radio off. Monitor mode is the tempting wrong answer: it also hunts rogues, but by listening over the air with its radio.",
        hi: "Rogue detector mode radio off karke wired side par kaam karta hai. Monitor mode galat hone ke bawajood sahi lagta hai: woh bhi rogues dhoondhta hai, lekin radio se air par sun kar.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "You are cabling a lightweight AP in local mode and an AireOS WLC with two distribution system ports to the same switch. Which switch configuration is correct?",
        hi: "Tum local mode wala lightweight AP aur do distribution system ports wala AireOS WLC ek hi switch se jod rahe ho. Switch ka kaunsa configuration sahi hai?",
      },
      options: [
        { en: "AP on a trunk; WLC ports as two separate access ports", hi: "AP trunk par; WLC ke ports do alag access ports" },
        { en: "AP on an access port; WLC ports in a static EtherChannel (mode on) configured as a trunk", hi: "AP access port par; WLC ke ports static EtherChannel (mode on) mein, trunk ki tarah configured" },
        { en: "AP on an access port; WLC ports in an LACP EtherChannel (mode active)", hi: "AP access port par; WLC ke ports LACP EtherChannel (mode active) mein" },
        { en: "AP on a trunk; WLC ports in a PAgP EtherChannel (mode desirable)", hi: "AP trunk par; WLC ke ports PAgP EtherChannel (mode desirable) mein" },
      ],
      answer: 1,
      explain: {
        en: "A local-mode AP only needs its own VLAN, because client traffic is inside CAPWAP. The WLC bridges several VLANs, so it needs a trunk, and an AireOS WLC's LAG is static, so the switch uses mode on rather than LACP or PAgP.",
        hi: "Local-mode AP ko sirf apna VLAN chahiye, kyunki client traffic CAPWAP ke andar hai. WLC kai VLANs par bridge karta hai, isliye use trunk chahiye, aur AireOS WLC ka LAG static hai, isliye switch par LACP ya PAgP nahi, mode on lagta hai.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "uX1h0F6wpBY",
      title: "Free CCNA | Wireless Architectures | Day 56",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Autonomous, lightweight and cloud-based APs, split-MAC, CAPWAP, WLC deployments and AP modes, in the order of this lesson.",
        hi: "Autonomous, lightweight aur cloud-based APs, split-MAC, CAPWAP, WLC deployments aur AP modes, isi lesson ke order mein.",
      },
    },
    {
      id: "lwjUhrjs01s",
      title: "116. Free CCNA (NEW) | Wireless Networking - Wireless Architectures",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of autonomous, lightweight and cloud architectures with CAPWAP.", hi: "Autonomous, lightweight aur cloud architectures ka CAPWAP ke saath Hindi explanation." },
    },
    {
      id: "nUe80M09vkA",
      title: "118. Free CCNA (NEW) | Wireless Networking - AP Working Modes",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "A short Hindi video on the AP modes: local, FlexConnect, monitor, sniffer and the rest.", hi: "AP modes par chhota Hindi video: local, FlexConnect, monitor, sniffer aur baaki." },
    },
  ],
  lab: {
    title: { en: "Join lightweight APs to a WLC in Packet Tracer", hi: "Packet Tracer mein lightweight APs ko WLC se join karao" },
    steps: [
      {
        en: "Cable a 3650 multilayer switch (add its power supply), a WLC-2504, two lightweight APs such as the 3702i, and a server for DHCP. Plan VLAN 10 for APs, 20 for clients, 30 for the server and 99 for management.",
        hi: "Ek 3650 multilayer switch (uska power supply add karo), ek WLC-2504, do lightweight APs jaise 3702i, aur DHCP ke liye ek server cable karo. Plan: APs ke liye VLAN 10, clients ke liye 20, server ke liye 30 aur management ke liye 99.",
      },
      {
        en: "Make the AP ports access ports in VLAN 10 with PortFast and the WLC port a trunk for VLANs 20 and 99. Enable `ip routing` and add SVIs 10.1.10.1, 10.1.20.1, 10.1.30.1 and 10.1.99.1.",
        hi: "AP ports ko PortFast ke saath VLAN 10 ke access ports banao aur WLC port ko VLAN 20 aur 99 ka trunk. `ip routing` enable karo aur SVIs 10.1.10.1, 10.1.20.1, 10.1.30.1 aur 10.1.99.1 banao.",
      },
      {
        en: "On the server (10.1.30.10) create a DHCP pool for VLAN 10 and fill its WLC Address field with 10.1.99.10, Packet Tracer's version of option 43. Add `ip helper-address 10.1.30.10` on the VLAN 10 SVI.",
        hi: "Server (10.1.30.10) par VLAN 10 ke liye DHCP pool banao aur uske WLC Address field mein 10.1.99.10 daalo; yeh Packet Tracer mein option 43 ka roop hai. VLAN 10 SVI par `ip helper-address 10.1.30.10` lagao.",
      },
      {
        en: "Give the WLC management interface 10.1.99.10/24 with gateway 10.1.99.1. Wait for the APs to join, then open the WLC GUI from a PC and find both APs under WIRELESS.",
        hi: "WLC ke management interface ko 10.1.99.10/24 aur gateway 10.1.99.1 do. APs ke join hone ka wait karo, phir kisi PC se WLC GUI kholo aur WIRELESS ke andar dono APs dhoondho.",
      },
      {
        en: "In Simulation mode, follow an AP's CAPWAP packets and check the destination IP and UDP port. Then run `show interfaces trunk` on the switch and confirm VLANs 20 and 99 are on the WLC trunk while VLAN 10 is not.",
        hi: "Simulation mode mein kisi AP ke CAPWAP packets follow karo aur destination IP aur UDP port check karo. Phir switch par `show interfaces trunk` chalao aur confirm karo ki WLC trunk par VLAN 20 aur 99 hain, VLAN 10 nahi.",
      },
    ],
  },
};

export default lesson;
