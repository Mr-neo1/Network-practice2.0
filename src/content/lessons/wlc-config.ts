import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "wlc-config",
  intro: {
    en: "In lesson 2.8, AP1 joined WLC1 over CAPWAP, but a joined AP with no WLAN broadcasts nothing. A WLAN on the controller is the bundle a client actually connects to: an SSID, the security that protects it, the VLAN its clients land in and how its traffic is prioritised. You build it once in the WLC GUI and every AP serves it. The CCNA expects you to read these GUI pages and know what each setting does.",
    hi: "Lesson 2.8 mein AP1 ne CAPWAP se WLC1 join kiya tha, lekin joined AP bina WLAN ke kuch broadcast nahi karta. Controller par WLAN woh bundle hai jisse client asal mein connect hota hai: ek SSID, use protect karne wali security, woh VLAN jismein clients jaate hain, aur uske traffic ki priority. Ise WLC GUI mein ek baar banate ho aur har AP use serve karta hai. CCNA expect karta hai ki tum yeh GUI pages padh sako aur jaano ki har setting kya karti hai.",
  },
  outcomes: [
    { en: "Create a dynamic interface for a client VLAN with its IP address, gateway and DHCP server", hi: "Client VLAN ke liye dynamic interface banao, uske IP address, gateway aur DHCP server ke saath" },
    { en: "Create a WLAN and explain the difference between its profile name, SSID and WLAN ID", hi: "WLAN banao aur uske profile name, SSID aur WLAN ID ka farak samjha sako" },
    { en: "Configure WPA2 with AES and a pre-shared key on the Security tab", hi: "Security tab par WPA2, AES aur pre-shared key configure kar sako" },
    { en: "Choose the right QoS profile: Platinum, Gold, Silver or Bronze", hi: "Sahi QoS profile chun sako: Platinum, Gold, Silver ya Bronze" },
    { en: "Read common Advanced tab settings and enable the WLAN", hi: "Advanced tab ki common settings padh sako aur WLAN enable kar sako" },
    { en: "Trace a client from association to a DHCP address in the WLAN's VLAN", hi: "Client ko association se lekar WLAN ke VLAN mein DHCP address milne tak trace kar sako" },
  ],
  sections: [
    {
      id: "the-plan",
      heading: { en: "The plan and the wired side", hi: "Plan aur wired side" },
      blocks: [
        {
          type: "p",
          text: {
            en: "We continue with the HQ network from lesson 2.8. Staff phones and laptops should join an SSID called **CORP**, protected with a shared passphrase, and land in **VLAN 20** (10.1.20.0/24). CSW1 routes for every VLAN, and SRV1 hands out addresses by DHCP.",
            hi: "Lesson 2.8 wala HQ network hi aage le chalte hain. Staff ke phones aur laptops ko **CORP** naam ke SSID se judna hai, jo shared passphrase se protected ho, aur unhe **VLAN 20** (10.1.20.0/24) mein jaana hai. CSW1 har VLAN ke liye routing karta hai, aur SRV1 DHCP se addresses deta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Addresses used in this lesson and its animation", hi: "Is lesson aur animation mein use hone wale addresses" },
          columns: [{ en: "Device or interface", hi: "Device ya interface" }, "VLAN", { en: "Address", hi: "Address" }],
          rows: [
            [{ en: "WLC1 management interface", hi: "WLC1 management interface" }, "99", "10.1.99.10/24"],
            [{ en: "WLC1 dynamic interface corp-vlan20 (you create it)", hi: "WLC1 dynamic interface corp-vlan20 (tum banaoge)" }, "20", "10.1.20.10/24"],
            [{ en: "WLC1 virtual interface", hi: "WLC1 virtual interface" }, "-", "192.0.2.1"],
            [{ en: "CSW1 SVI, gateway for wireless clients", hi: "CSW1 SVI, wireless clients ka gateway" }, "20", "10.1.20.1/24"],
            [{ en: "AP1 (local mode)", hi: "AP1 (local mode)" }, "10", "10.1.10.11"],
            [{ en: "SRV1, DHCP server", hi: "SRV1, DHCP server" }, "30", "10.1.30.10"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Before touching the WLC, make sure the wired network can carry VLAN 20 to it. The WLC will send VLAN 20 frames tagged on its LAG trunk, so VLAN 20 must exist on CSW1, be allowed on Po1, and have a gateway SVI. If you built the lesson 2.8 setup, these lines are already there and typing them again does no harm; the point is to check, not assume.",
            hi: "WLC ko chhoone se pehle confirm karo ki wired network VLAN 20 ko WLC tak le ja sakta hai. WLC VLAN 20 ke frames apne LAG trunk par tag karke bhejega, isliye CSW1 par VLAN 20 hona chahiye, Po1 par allowed hona chahiye, aur uska gateway SVI hona chahiye. Agar tumne lesson 2.8 wala setup banaya hai, toh yeh lines pehle se hain aur dobara type karne se kuch nahi bigadta; asli baat hai check karna, maan kar nahi chalna.",
          },
        },
        {
          type: "cli",
          title: { en: "CSW1: VLAN 20, its gateway and the WLC trunk", hi: "CSW1: VLAN 20, uska gateway aur WLC trunk" },
          lines: [
            { prompt: "CSW1(config)#", cmd: "vlan 20" },
            { prompt: "CSW1(config-vlan)#", cmd: "name CORP-WIFI" },
            { prompt: "CSW1(config-vlan)#", cmd: "exit" },
            { prompt: "CSW1(config)#", cmd: "interface vlan 20" },
            { prompt: "CSW1(config-if)#", cmd: "ip address 10.1.20.1 255.255.255.0", comment: { en: "Default gateway for every CORP client", hi: "Har CORP client ka default gateway" } },
            { prompt: "CSW1(config-if)#", cmd: "exit" },
            { prompt: "CSW1(config)#", cmd: "interface Port-channel1" },
            { prompt: "CSW1(config-if)#", cmd: "switchport trunk allowed vlan add 20", comment: { en: "`add` keeps VLAN 99 on the trunk", hi: "`add` se VLAN 99 trunk par bana rehta hai" } },
            { prompt: "CSW1(config-if)#", cmd: "end" },
            { prompt: "CSW1#", cmd: "show interfaces trunk" },
            { out: "Port        Mode             Encapsulation  Status        Native vlan" },
            { out: "Po1         on               802.1q         trunking      1" },
            { out: "Port        Vlans allowed on trunk" },
            { out: "Po1         20,99", comment: { en: "Client VLAN 20 and management VLAN 99", hi: "Client VLAN 20 aur management VLAN 99" } },
            { out: " " },
            { out: "Port        Vlans in spanning tree forwarding state and not pruned" },
            { out: "Po1         20,99", comment: { en: "Both VLANs are also forwarding", hi: "Dono VLANs forwarding bhi kar rahe hain" } },
          ],
          note: {
            en: "Without the `add` keyword, `switchport trunk allowed vlan 20` would replace the list and cut off VLAN 99, and with it the WLC's management interface and every CAPWAP tunnel.",
            hi: "`add` keyword ke bina `switchport trunk allowed vlan 20` poori list replace kar deta, VLAN 99 kat jaata, aur uske saath WLC ka management interface aur saare CAPWAP tunnels bhi.",
          },
        },
        {
          type: "p",
          text: {
            en: "Now log in to the WLC by browsing to its management address, `https://10.1.99.10`. On a Cisco AireOS WLC (the 2504, 3504 and 5520 models used in most CCNA material), click **Advanced** at the top right if you land on the summary dashboard. The menu bar then shows MONITOR, WLANs, CONTROLLER, WIRELESS, SECURITY, MANAGEMENT, COMMANDS and HELP. You will work through it in this order:",
            hi: "Ab browser mein WLC ka management address `https://10.1.99.10` khol kar login karo. Cisco AireOS WLC (2504, 3504 aur 5520 models, jo zyada tar CCNA material mein dikhte hain) par agar summary dashboard khule, toh top right mein **Advanced** click karo. Phir menu bar mein MONITOR, WLANs, CONTROLLER, WIRELESS, SECURITY, MANAGEMENT, COMMANDS aur HELP dikhte hain. Kaam is order mein hoga:",
          },
        },
        {
          type: "steps",
          items: [
            { en: "**CONTROLLER > Interfaces**: create the dynamic interface for VLAN 20.", hi: "**CONTROLLER > Interfaces**: VLAN 20 ke liye dynamic interface banao." },
            { en: "**WLANs > Create New**: create the WLAN and map it to that interface.", hi: "**WLANs > Create New**: WLAN banao aur use us interface se map karo." },
            { en: "**Security tab**: set WPA2, AES and the pre-shared key.", hi: "**Security tab**: WPA2, AES aur pre-shared key set karo." },
            { en: "**QoS tab** and **Advanced tab**: pick the QoS profile and the extra options.", hi: "**QoS tab** aur **Advanced tab**: QoS profile aur extra options chuno." },
            { en: "**General tab**: enable the WLAN, apply, and save the configuration.", hi: "**General tab**: WLAN enable karo, apply karo, aur configuration save karo." },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Newer controllers look different", hi: "Naye controllers alag dikhte hain" },
          text: {
            en: "Catalyst 9800 controllers run IOS XE and split the same settings into a WLAN profile, a policy profile and a policy tag. The ideas in this lesson (SSID, VLAN, security, QoS) are identical; only the screens differ. CCNA questions show the AireOS GUI.",
            hi: "Catalyst 9800 controllers IOS XE chalate hain aur yahi settings WLAN profile, policy profile aur policy tag mein baant dete hain. Is lesson ke ideas (SSID, VLAN, security, QoS) bilkul same hain; sirf screens alag hain. CCNA ke questions AireOS GUI dikhate hain.",
          },
        },
      ],
    },
    {
      id: "dynamic-interface",
      heading: { en: "Step 1: a dynamic interface for VLAN 20", hi: "Step 1: VLAN 20 ke liye dynamic interface" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A WLAN does not hold a VLAN number directly. It points at a WLC **interface**, and the interface holds the VLAN. A **dynamic interface** is the WLC's own address in a client VLAN: it is how the WLC puts client frames onto VLAN 20 and how it relays their DHCP requests. Create one per client VLAN.",
            hi: "WLAN ke andar seedha VLAN number nahi hota. WLAN ek WLC **interface** ko point karta hai, aur interface ke paas VLAN hota hai. **Dynamic interface** client VLAN mein WLC ka apna address hai: isi se WLC client frames ko VLAN 20 par daalta hai aur unki DHCP requests relay karta hai. Har client VLAN ke liye ek dynamic interface banao.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "Go to **CONTROLLER > Interfaces** and click **New...**.", hi: "**CONTROLLER > Interfaces** par jao aur **New...** click karo." },
            { en: "Enter Interface Name `corp-vlan20` and VLAN Id `20`, then click **Apply**. The edit page for the new interface opens.", hi: "Interface Name `corp-vlan20` aur VLAN Id `20` daalo, phir **Apply** click karo. Naye interface ka edit page khulta hai." },
            { en: "Fill in the IP address, netmask and gateway, and the primary DHCP server, as in the table below.", hi: "Neeche wali table ki tarah IP address, netmask, gateway aur primary DHCP server bharo." },
            { en: "WLC1 uses LAG, so there is no physical port to pick; without LAG you would choose the port number here. Click **Apply**.", hi: "WLC1 LAG use karta hai, isliye koi physical port chunna nahi padta; LAG na ho toh yahan port number chunte. **Apply** click karo." },
          ],
        },
        {
          type: "table",
          caption: { en: "CONTROLLER > Interfaces > Edit: corp-vlan20", hi: "CONTROLLER > Interfaces > Edit: corp-vlan20" },
          columns: [{ en: "Field", hi: "Field" }, { en: "Value", hi: "Value" }, { en: "Why", hi: "Kyun" }],
          rows: [
            ["VLAN Identifier", "20", { en: "Frames from this interface leave tagged 20 on the trunk", hi: "Is interface ke frames trunk par tag 20 ke saath nikalte hain" }],
            ["IP Address / Netmask", "10.1.20.10 / 255.255.255.0", { en: "The WLC's own address in VLAN 20; keep it out of the DHCP pool", hi: "VLAN 20 mein WLC ka apna address; ise DHCP pool se bahar rakho" }],
            ["Gateway", "10.1.20.1", { en: "CSW1's SVI, used to reach SRV1 in another subnet", hi: "CSW1 ka SVI, doosre subnet ke SRV1 tak pahunchne ke liye" }],
            ["Primary DHCP Server", "10.1.30.10", { en: "Where the WLC relays this VLAN's DHCP requests", hi: "Is VLAN ki DHCP requests WLC yahan relay karta hai" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Why the WLC needs a DHCP server address", hi: "WLC ko DHCP server ka address kyun chahiye" },
          text: {
            en: "AireOS has **DHCP proxy** on by default. The WLC does not flood a client's DHCP Discover onto VLAN 20; it relays it as unicast from 10.1.20.10 to 10.1.30.10, much like `ip helper-address` on a router. Clients see the WLC's virtual interface (192.0.2.1) as their DHCP server. You will meet relays properly in the DHCP lesson (4.1).",
            hi: "AireOS mein **DHCP proxy** by default on hota hai. WLC client ka DHCP Discover VLAN 20 par flood nahi karta; use 10.1.20.10 se 10.1.30.10 ko unicast mein relay karta hai, bilkul router par `ip helper-address` ki tarah. Clients ko apna DHCP server WLC ka virtual interface (192.0.2.1) dikhta hai. Relay ko detail mein DHCP lesson (4.1) mein padhoge.",
          },
        },
      ],
    },
    {
      id: "create-wlan",
      heading: { en: "Step 2: create the WLAN and map it to the interface", hi: "Step 2: WLAN banao aur interface se map karo" },
      blocks: [
        {
          type: "steps",
          items: [
            { en: "Go to **WLANs**, choose **Create New** in the drop-down and click **Go**.", hi: "**WLANs** par jao, drop-down mein **Create New** chuno aur **Go** click karo." },
            { en: "Type: `WLAN`. Profile Name: `CORP`. SSID: `CORP`. ID: `1`. Click **Apply**.", hi: "Type: `WLAN`. Profile Name: `CORP`. SSID: `CORP`. ID: `1`. **Apply** click karo." },
            { en: "The edit page opens with five tabs: **General, Security, QoS, Policy-Mapping, Advanced**.", hi: "Edit page paanch tabs ke saath khulta hai: **General, Security, QoS, Policy-Mapping, Advanced**." },
            { en: "On the **General** tab, change Interface/Interface Group from `management` to `corp-vlan20`. Leave Status unticked for now and click **Apply**.", hi: "**General** tab par Interface/Interface Group ko `management` se badal kar `corp-vlan20` karo. Status abhi untick hi rehne do aur **Apply** click karo." },
          ],
        },
        {
          type: "table",
          caption: { en: "Three names for one WLAN", hi: "Ek WLAN ke teen naam" },
          columns: [{ en: "Field", hi: "Field" }, { en: "Who sees it", hi: "Kise dikhta hai" }, { en: "What it is", hi: "Kya hai" }],
          rows: [
            ["Profile Name", { en: "Admins, inside the WLC", hi: "Admins, WLC ke andar" }, { en: "The WLC's label for this WLAN; it can differ from the SSID", hi: "Is WLAN ke liye WLC ka label; SSID se alag ho sakta hai" }],
            ["SSID", { en: "Clients, in their Wi-Fi list", hi: "Clients, apni Wi-Fi list mein" }, { en: "The network name the APs advertise in beacons", hi: "Woh network naam jo APs beacons mein advertise karte hain" }],
            ["WLAN ID", { en: "Admins, inside the WLC", hi: "Admins, WLC ke andar" }, { en: "A number that identifies the WLAN on the controller", hi: "Controller par WLAN ko pehchaanne wala number" }],
          ],
        },
        {
          type: "table",
          caption: { en: "General tab settings worth knowing", hi: "General tab ki jaanne layak settings" },
          columns: [{ en: "Setting", hi: "Setting" }, { en: "Default", hi: "Default" }, { en: "What it does", hi: "Kya karti hai" }],
          rows: [
            ["Status", { en: "Not enabled", hi: "Enabled nahi" }, { en: "Tick Enabled before any AP broadcasts the WLAN", hi: "Enabled tick karo, tabhi koi AP WLAN broadcast karega" }],
            ["Security Policies", "[WPA2][Auth(802.1X)]", { en: "Read-only summary of the Security tab", hi: "Security tab ka read-only summary" }],
            ["Radio Policy", "All", { en: "Which bands offer the WLAN (2.4 GHz, 5 GHz or both)", hi: "Kaunse bands par WLAN milega (2.4 GHz, 5 GHz ya dono)" }],
            ["Interface/Interface Group(G)", "management", { en: "The VLAN the WLAN's clients are placed in", hi: "WLAN ke clients kis VLAN mein daale jaayenge" }],
            ["Broadcast SSID", { en: "Ticked", hi: "Ticked" }, { en: "Untick to hide the SSID from beacons (not real security)", hi: "Beacons se SSID chhupane ke liye untick karo (asli security nahi hai)" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The default interface is management", hi: "Default interface management hota hai" },
          text: {
            en: "If you forget to change the interface, CORP's clients land in VLAN 99 with the WLC and the switches' management addresses. They either get no address or, worse, get one in your management subnet.",
            hi: "Interface badalna bhool gaye toh CORP ke clients VLAN 99 mein pahunch jaayenge, jahan WLC aur switches ke management addresses hain. Ya toh unhe address hi nahi milega, ya usse bhi bura, tumhare management subnet ka address mil jaayega.",
          },
        },
        {
          type: "p",
          text: {
            en: "On AireOS, only WLANs with IDs 1 to 16 are added to the default AP group automatically, so in a simple network keep the ID in that range or the APs will not offer the WLAN.",
            hi: "AireOS par sirf 1 se 16 tak ki ID wale WLANs apne aap default AP group mein add hote hain, isliye simple network mein ID isi range mein rakho, warna APs woh WLAN offer nahi karenge.",
          },
        },
      ],
    },
    {
      id: "security-tab",
      heading: { en: "Step 3: the Security tab, WPA2-PSK", hi: "Step 3: Security tab, WPA2-PSK" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A new WLAN already uses WPA2 with AES, but its key management is **802.1X**, which needs a RADIUS server and a username per user (WPA2-Enterprise). For a shared passphrase (WPA2-Personal) you switch key management to **PSK**. Lesson 5.10 explains how the 4-way handshake uses that key; here you only configure it.",
            hi: "Naya WLAN pehle se WPA2 aur AES use karta hai, lekin uska key management **802.1X** hota hai, jiske liye RADIUS server aur har user ka username chahiye (WPA2-Enterprise). Shared passphrase (WPA2-Personal) ke liye key management ko **PSK** par switch karte hain. 4-way handshake is key ko kaise use karta hai, woh lesson 5.10 mein hai; yahan sirf configure karna hai.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "Open the **Security** tab, then the **Layer 2** sub-tab.", hi: "**Security** tab kholo, phir **Layer 2** sub-tab." },
            { en: "Layer 2 Security: `WPA+WPA2`. Under WPA+WPA2 Parameters, tick **WPA2 Policy** and **AES**; leave WPA Policy and TKIP unticked.", hi: "Layer 2 Security: `WPA+WPA2`. WPA+WPA2 Parameters mein **WPA2 Policy** aur **AES** tick karo; WPA Policy aur TKIP untick rehne do." },
            { en: "Under Authentication Key Management, untick **802.1X** and tick **PSK**.", hi: "Authentication Key Management mein **802.1X** untick karo aur **PSK** tick karo." },
            { en: "PSK Format: `ASCII`, then type the passphrase. ASCII keys are 8 to 63 characters; the HEX format takes exactly 64 hex digits.", hi: "PSK Format: `ASCII`, phir passphrase type karo. ASCII key 8 se 63 characters ki hoti hai; HEX format mein theek 64 hex digits lagte hain." },
            { en: "Leave the **Layer 3** sub-tab at None (that is for web-portal logins on guest WLANs) and click **Apply**.", hi: "**Layer 3** sub-tab ko None hi rehne do (woh guest WLANs ke web-portal login ke liye hai) aur **Apply** click karo." },
          ],
        },
        {
          type: "table",
          caption: { en: "Security > Layer 2 for WLAN CORP", hi: "WLAN CORP ka Security > Layer 2" },
          columns: [{ en: "Field", hi: "Field" }, { en: "New WLAN default", hi: "Naye WLAN ka default" }, { en: "CORP", hi: "CORP" }],
          rows: [
            ["Layer 2 Security", "WPA+WPA2", "WPA+WPA2"],
            ["WPA2 Policy / Encryption", "WPA2, AES", "WPA2, AES"],
            ["Authentication Key Management", "802.1X", "PSK"],
            ["PSK Format", "-", { en: "ASCII, 8-63 characters", hi: "ASCII, 8-63 characters" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Version differences", hi: "Version ke hisaab se farak" },
          text: {
            en: "AireOS 8.10 renames the Layer 2 Security option to `WPA2+WPA3` and lists the AES cipher as `CCMP128(AES)`. The choices mean the same thing: WPA2 policy, AES (CCMP) encryption, PSK key management.",
            hi: "AireOS 8.10 mein Layer 2 Security option ka naam `WPA2+WPA3` ho jaata hai aur AES cipher `CCMP128(AES)` ke naam se dikhta hai. Matlab same hai: WPA2 policy, AES (CCMP) encryption, PSK key management.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam topic 5.10", hi: "Exam topic 5.10" },
          text: {
            en: "Configuring WPA2-PSK in the GUI means three choices on Security > Layer 2: WPA2 Policy, AES encryption, and PSK (not 802.1X) with the key. If a screenshot still shows 802.1X ticked, the WLAN is WPA2-Enterprise and needs a RADIUS server.",
            hi: "GUI mein WPA2-PSK configure karne ka matlab Security > Layer 2 par teen choices: WPA2 Policy, AES encryption, aur key ke saath PSK (802.1X nahi). Agar screenshot mein 802.1X abhi bhi ticked hai, toh WLAN WPA2-Enterprise hai aur use RADIUS server chahiye.",
          },
        },
      ],
    },
    {
      id: "qos-profiles",
      heading: { en: "Step 4: the QoS tab", hi: "Step 4: QoS tab" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Air time is shared, so a voice call and a large download on the same AP compete. Each WLAN gets a **QoS profile** that sets the highest priority its traffic can receive, over the air and in the CAPWAP packets on the wire. Cisco names the four profiles after metals:",
            hi: "Air time sab mein share hota hai, isliye same AP par voice call aur bada download aapas mein compete karte hain. Har WLAN ko ek **QoS profile** milta hai jo decide karta hai ki uske traffic ko zyada se zyada kitni priority mil sakti hai, air par bhi aur wire par CAPWAP packets mein bhi. Cisco ne chaaron profiles ke naam metals par rakhe hain:",
          },
        },
        {
          type: "table",
          caption: { en: "QoS tab > Quality of Service (QoS)", hi: "QoS tab > Quality of Service (QoS) ka drop-down" },
          columns: [{ en: "Profile", hi: "Profile" }, { en: "Traffic type", hi: "Traffic type" }, { en: "Use it for", hi: "Kiske liye" }],
          rows: [
            ["Platinum", "Voice", { en: "A WLAN for Wi-Fi IP phones and voice handsets", hi: "Wi-Fi IP phones aur voice handsets wala WLAN" }],
            ["Gold", "Video", { en: "Video conferencing or video streaming devices", hi: "Video conferencing ya video streaming devices" }],
            ["Silver", { en: "Best effort (the default)", hi: "Best effort (default)" }, { en: "Normal staff data, like CORP", hi: "Normal staff data, jaise CORP" }],
            ["Bronze", "Background", { en: "Guest or bulk traffic that should yield to everything else", hi: "Guest ya bulk traffic jo baaki sabko pehle jaane de" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "CORP carries ordinary data, so it stays at **Silver**. Leave **WMM Policy** at Allowed, its default: WMM (Wi-Fi Multimedia) is the 802.11 mechanism that actually gives voice and video frames earlier access to the air. How markings and queues work end to end is covered in the QoS lesson (4.9).",
            hi: "CORP par ordinary data chalta hai, isliye woh **Silver** par hi rehta hai. **WMM Policy** ko uske default Allowed par rehne do: WMM (Wi-Fi Multimedia) 802.11 ka woh mechanism hai jo voice aur video frames ko air par pehle mauka deta hai. Markings aur queues end to end kaise kaam karte hain, woh QoS lesson (4.9) mein hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Memorise the order", hi: "Order yaad karo" },
          text: {
            en: "Platinum = voice, Gold = video, Silver = best effort (default), Bronze = background. A common trap offers Gold for voice; Gold is video.",
            hi: "Platinum = voice, Gold = video, Silver = best effort (default), Bronze = background. Common trap mein voice ke liye Gold diya hota hai; Gold video ke liye hai.",
          },
        },
      ],
    },
    {
      id: "advanced-and-enable",
      heading: { en: "Step 5: the Advanced tab, then enable and save", hi: "Step 5: Advanced tab, phir enable aur save" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The Advanced tab is long. For the CCNA, know what these settings do when you see them on a screenshot:",
            hi: "Advanced tab lamba hai. CCNA ke liye itna jaano ki screenshot mein yeh settings dikhein toh kya karti hain:",
          },
        },
        {
          type: "table",
          caption: { en: "Selected Advanced tab settings", hi: "Advanced tab ki chuni hui settings" },
          columns: [{ en: "Setting", hi: "Setting" }, { en: "What it does", hi: "Kya karti hai" }],
          rows: [
            ["Enable Session Timeout", { en: "How long a client stays connected before it must re-authenticate, in seconds (for example 1800 = 30 minutes)", hi: "Client kitni der connected rahe, phir use dobara authenticate karna pade, seconds mein (jaise 1800 = 30 minute)" }],
            ["Allow AAA Override", { en: "Lets a RADIUS server assign a VLAN or QoS per user, overriding the WLAN's settings", hi: "RADIUS server ko har user ke liye VLAN ya QoS dene deta hai, WLAN ki settings ko override karke" }],
            ["DHCP Addr. Assignment Required", { en: "Clients must get their address by DHCP; a client with a static IP cannot pass traffic", hi: "Clients ko address DHCP se hi lena hoga; static IP wala client traffic pass nahi kar sakta" }],
            ["Client Exclusion", { en: "Temporarily blocks a client after repeated failed authentications", hi: "Baar baar authentication fail hone par client ko kuch der ke liye block karta hai" }],
            ["Maximum Allowed Clients", { en: "Caps the clients on this WLAN; 0 means no limit", hi: "Is WLAN par clients ki limit; 0 ka matlab koi limit nahi" }],
            ["FlexConnect Local Switching", { en: "For FlexConnect APs: switch this WLAN's data at the branch instead of tunnelling it to the WLC (lesson 2.8)", hi: "FlexConnect APs ke liye: is WLAN ka data WLC tak tunnel karne ki jagah branch mein hi switch karo (lesson 2.8)" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "For CORP, tick **DHCP Addr. Assignment Required**: every client then appears with a known address leased from SRV1. Now return to the **General** tab, tick **Status: Enabled** and click **Apply**. Finally click **Save Configuration** at the top of the page, because AireOS applies changes at once but only keeps them across a reboot after a save.",
            hi: "CORP ke liye **DHCP Addr. Assignment Required** tick karo: ab har client SRV1 se lease kiye gaye known address ke saath dikhega. Ab **General** tab par wapas jao, **Status: Enabled** tick karo aur **Apply** click karo. Aakhir mein page ke upar **Save Configuration** click karo, kyunki AireOS changes turant laga deta hai lekin reboot ke baad wahi bachte hain jo save kiye gaye.",
          },
        },
        {
          type: "p",
          text: {
            en: "Here is what happens when Phone1 joins, as shown in the animation:",
            hi: "Phone1 join karta hai toh yeh hota hai, jaisa animation mein dikhta hai:",
          },
        },
        {
          type: "steps",
          items: [
            { en: "WLC1 pushes CORP to AP1 over the CAPWAP control tunnel (UDP 5246), and AP1 starts sending beacons with SSID CORP.", hi: "WLC1 CAPWAP control tunnel (UDP 5246) se CORP ko AP1 tak push karta hai, aur AP1 SSID CORP wale beacons bhejna shuru karta hai." },
            { en: "Phone1 associates. AP1 tunnels the request to WLC1, which accepts it; the 4-way handshake then proves Phone1 knows the PSK.", hi: "Phone1 associate karta hai. AP1 request WLC1 tak tunnel karta hai, WLC1 accept karta hai; phir 4-way handshake prove karta hai ki Phone1 ko PSK pata hai." },
            { en: "WLC1 maps Phone1 to corp-vlan20 (VLAN 20) and holds it in the DHCP_REQD state, allowing only DHCP.", hi: "WLC1 Phone1 ko corp-vlan20 (VLAN 20) se map karta hai aur DHCP_REQD state mein rakhta hai, sirf DHCP allowed." },
            { en: "Phone1's DHCP Discover reaches WLC1 through the tunnel. WLC1 relays it from 10.1.20.10 to SRV1, which picks from its 10.1.20.0/24 pool.", hi: "Phone1 ka DHCP Discover tunnel se WLC1 tak pahunchta hai. WLC1 use 10.1.20.10 se SRV1 ko relay karta hai, aur SRV1 apne 10.1.20.0/24 pool se address chunta hai." },
            { en: "Offer, Request and ACK complete. Phone1 has 10.1.20.31 with gateway 10.1.20.1, and WLC1 moves it to the RUN state.", hi: "Offer, Request aur ACK complete hote hain. Phone1 ko 10.1.20.31 milta hai, gateway 10.1.20.1, aur WLC1 use RUN state mein daal deta hai." },
          ],
        },
        {
          type: "table",
          caption: {
            en: "Verify in MONITOR > Clients, then click the client's MAC address (selected fields; the WLC writes MACs with colons)",
            hi: "MONITOR > Clients mein client ke MAC address par click karke verify karo (kuch chuni hui fields; WLC MAC colons ke saath likhta hai)",
          },
          columns: [{ en: "Field", hi: "Field" }, { en: "Value for Phone1", hi: "Phone1 ki value" }],
          rows: [
            ["MAC Address", "a4:c3:f0:11:22:33"],
            ["IPv4 Address", "10.1.20.31"],
            ["VLAN ID", "20"],
            ["Policy Manager State", "RUN"],
            ["AP Name", "AP1"],
            ["WLAN Profile / WLAN SSID", "CORP / CORP"],
          ],
        },
        {
          type: "p",
          text: {
            en: "If the client shows a 10.1.99.x address or VLAN 99, the WLAN is still mapped to the management interface. If it is stuck in DHCP_REQD, check the DHCP server address on corp-vlan20, the pool on SRV1, and that VLAN 20 is allowed on the trunk.",
            hi: "Client ka address 10.1.99.x ya VLAN 99 dikhe, toh WLAN abhi bhi management interface se mapped hai. DHCP_REQD mein atka ho, toh corp-vlan20 par DHCP server address, SRV1 ka pool, aur trunk par VLAN 20 allowed hai ya nahi, yeh check karo.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "WLAN (on a WLC)", def: { en: "A controller object that combines an SSID, its security, its VLAN mapping, QoS and other policy.", hi: "Controller ka ek object jo SSID, uski security, VLAN mapping, QoS aur baaki policy ko ek saath jodta hai." } },
    { term: "Profile name", def: { en: "The WLC's internal name for a WLAN; it does not have to match the SSID.", hi: "WLAN ka WLC ke andar ka naam; SSID se match hona zaroori nahi." } },
    { term: "WLAN ID", def: { en: "The number that identifies a WLAN on the controller; IDs 1 to 16 join the default AP group automatically.", hi: "Controller par WLAN ko pehchaanne wala number; 1 se 16 tak ki IDs apne aap default AP group mein jaati hain." } },
    { term: "Dynamic interface", def: { en: "A WLC interface with an IP address in a client VLAN; the WLAN mapped to it puts its clients in that VLAN.", hi: "Client VLAN mein IP address wala WLC interface; jo WLAN isse mapped ho, uske clients isi VLAN mein jaate hain." } },
    { term: "PSK", def: { en: "Pre-shared key: one passphrase shared by all users, as in WPA2-Personal.", hi: "Pre-shared key: ek passphrase jo sab users share karte hain, jaise WPA2-Personal mein." } },
    { term: "QoS profile", def: { en: "The per-WLAN priority level: Platinum (voice), Gold (video), Silver (best effort) or Bronze (background).", hi: "Har WLAN ka priority level: Platinum (voice), Gold (video), Silver (best effort) ya Bronze (background)." } },
    { term: "DHCP proxy", def: { en: "The WLC relaying client DHCP messages to the server set on the interface, on by default in AireOS.", hi: "WLC ka client DHCP messages ko interface par set server tak relay karna, AireOS mein by default on." } },
  ],
  commands: [
    { cmd: "vlan 20 / name CORP-WIFI", mode: "Global config (CSW1(config)#)", does: { en: "Create the client VLAN the WLC will use", hi: "Woh client VLAN banata hai jo WLC use karega" } },
    { cmd: "interface vlan 20 / ip address 10.1.20.1 255.255.255.0", mode: "Global config, then interface config", does: { en: "Give wireless clients their default gateway on CSW1", hi: "CSW1 par wireless clients ka default gateway banata hai" } },
    { cmd: "switchport trunk allowed vlan add 20", mode: "Interface config (CSW1(config-if)#)", does: { en: "Add VLAN 20 to the WLC trunk without removing VLAN 99", hi: "VLAN 99 hataye bina WLC trunk par VLAN 20 add karta hai" } },
    { cmd: "show interfaces trunk", mode: "Privileged EXEC", does: { en: "Confirm VLANs 20 and 99 are allowed and forwarding on Po1", hi: "Confirm karta hai ki Po1 par VLAN 20 aur 99 allowed aur forwarding hain" } },
  ],
  mistakes: [
    {
      en: "Leaving the WLAN on the default `management` interface. Clients then land in the management VLAN. Map the WLAN to the dynamic interface of its client VLAN.",
      hi: "WLAN ko default `management` interface par hi chhod dena. Phir clients management VLAN mein pahunch jaate hain. WLAN ko uske client VLAN wale dynamic interface se map karo.",
    },
    {
      en: "Forgetting to tick Status: Enabled. The WLAN is fully configured but no AP broadcasts it.",
      hi: "Status: Enabled tick karna bhool jaana. WLAN poora configured hai, lekin koi AP use broadcast nahi karta.",
    },
    {
      en: "Ticking PSK but leaving 802.1X ticked as well, or not ticking PSK at all. For WPA2-Personal, key management is PSK only.",
      hi: "PSK tick kar dena lekin 802.1X bhi ticked chhod dena, ya PSK tick hi na karna. WPA2-Personal ke liye key management sirf PSK hota hai.",
    },
    {
      en: "Mixing up the QoS profiles. Platinum is voice and Gold is video; Silver (best effort) is the default.",
      hi: "QoS profiles mix karna. Platinum voice hai aur Gold video; Silver (best effort) default hai.",
    },
    {
      en: "Creating the dynamic interface but not allowing its VLAN on the switch trunk, or overwriting the allowed list without `add`. Clients associate and then never get an address.",
      hi: "Dynamic interface bana dena lekin switch trunk par uska VLAN allow na karna, ya `add` ke bina allowed list overwrite kar dena. Clients associate ho jaate hain lekin address kabhi nahi milta.",
    },
    {
      en: "Clicking Apply and assuming the change is permanent. Click Save Configuration, or the WLAN disappears after a reboot.",
      hi: "Apply click karke maan lena ki change permanent hai. Save Configuration click karo, warna reboot ke baad WLAN gayab ho jaayega.",
    },
  ],
  recap: [
    { en: "Order: dynamic interface (VLAN, IP, gateway, DHCP server), then WLAN (profile, SSID, ID), then map the WLAN to the interface.", hi: "Order: dynamic interface (VLAN, IP, gateway, DHCP server), phir WLAN (profile, SSID, ID), phir WLAN ko interface se map karo." },
    { en: "The interface chosen on the General tab decides the clients' VLAN; the default is management.", hi: "General tab par chuna gaya interface clients ka VLAN decide karta hai; default management hai." },
    { en: "WPA2-PSK: Security > Layer 2, WPA2 Policy, AES, untick 802.1X, tick PSK, enter an 8-63 character ASCII key.", hi: "WPA2-PSK: Security > Layer 2, WPA2 Policy, AES, 802.1X untick, PSK tick, 8-63 character ki ASCII key daalo." },
    { en: "QoS: Platinum voice, Gold video, Silver best effort (default), Bronze background.", hi: "QoS yaad rakho: Platinum voice ke liye, Gold video ke liye, Silver best effort (default), aur Bronze background ke liye." },
    { en: "Advanced tab: session timeout, AAA override, DHCP Addr. Assignment Required, FlexConnect local switching.", hi: "Advanced tab mein milte hain: session timeout, AAA override, DHCP Addr. Assignment Required aur FlexConnect local switching." },
    { en: "Enable the WLAN, Apply, then Save Configuration. Verify the client's IP, VLAN and RUN state under MONITOR > Clients.", hi: "WLAN enable karo, Apply karo, phir Save Configuration. MONITOR > Clients mein client ka IP, VLAN aur RUN state verify karo." },
  ],
  quiz: [
    {
      q: {
        en: "On a Cisco WLC, which setting decides which VLAN the clients of a WLAN are placed in?",
        hi: "Cisco WLC par kaunsi setting decide karti hai ki WLAN ke clients kis VLAN mein daale jaayenge?",
      },
      options: [
        { en: "The WLAN ID", hi: "WLAN ID" },
        { en: "The QoS profile", hi: "QoS profile" },
        { en: "The interface selected on the WLAN's General tab", hi: "WLAN ke General tab par chuna gaya interface" },
        { en: "The SSID", hi: "SSID" },
      ],
      answer: 2,
      explain: {
        en: "A WLAN is mapped to a WLC interface, and the interface carries the VLAN ID. The WLAN ID and SSID are only names and numbers; the QoS profile sets priority, not the VLAN.",
        hi: "WLAN ek WLC interface se map hota hai, aur VLAN ID interface ke paas hoti hai. WLAN ID aur SSID sirf naam aur number hain; QoS profile priority set karta hai, VLAN nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "You create WLAN CORP with WPA2-PSK and enable it. Clients connect, but they receive addresses in 10.1.99.0/24, the management subnet, instead of 10.1.20.0/24. What is the most likely cause?",
        hi: "Tum WPA2-PSK ke saath WLAN CORP banate ho aur enable karte ho. Clients connect ho jaate hain, lekin unhe 10.1.20.0/24 ki jagah 10.1.99.0/24, yaani management subnet ke addresses milte hain. Sabse likely cause kya hai?",
      },
      options: [
        { en: "The WLAN is still mapped to the management interface", hi: "WLAN abhi bhi management interface se mapped hai" },
        { en: "The QoS profile is Silver instead of Platinum", hi: "QoS profile Platinum ki jagah Silver hai" },
        { en: "Broadcast SSID is ticked", hi: "Broadcast SSID ticked hai" },
        { en: "The PSK is in ASCII format instead of HEX", hi: "PSK HEX ki jagah ASCII format mein hai" },
      ],
      answer: 0,
      explain: {
        en: "A new WLAN uses the management interface by default, so its clients land in the management VLAN and get an address from that subnet. Change the interface to corp-vlan20. The other settings do not affect which VLAN or subnet a client uses.",
        hi: "Naya WLAN by default management interface use karta hai, isliye uske clients management VLAN mein jaate hain aur usi subnet ka address paate hain. Interface ko corp-vlan20 karo. Baaki settings client ke VLAN ya subnet par asar nahi daalti.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A hospital creates a WLAN for its Wi-Fi voice handsets. Which QoS profile should it use?",
        hi: "Ek hospital apne Wi-Fi voice handsets ke liye WLAN banata hai. Use kaunsa QoS profile use karna chahiye?",
      },
      options: [
        { en: "Gold", hi: "Gold" },
        { en: "Silver", hi: "Silver" },
        { en: "Bronze", hi: "Bronze" },
        { en: "Platinum", hi: "Platinum" },
      ],
      answer: 3,
      explain: {
        en: "Platinum is the voice profile. Gold is the tempting wrong answer, but it is for video. Silver is best effort (the default) and Bronze is background.",
        hi: "Platinum voice profile hai. Gold sahi lagta hai, lekin woh video ke liye hai. Silver best effort (default) hai aur Bronze background.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A new WLAN's Security > Layer 2 tab shows WPA2 Policy and AES ticked, and 802.1X ticked under Authentication Key Management. You need WPA2-Personal with a shared passphrase. What do you change?",
        hi: "Naye WLAN ke Security > Layer 2 tab par WPA2 Policy aur AES ticked hain, aur Authentication Key Management mein 802.1X ticked hai. Tumhe shared passphrase wala WPA2-Personal chahiye. Kya badloge?",
      },
      options: [
        { en: "Change Layer 2 Security to None and set a password on the Layer 3 tab", hi: "Layer 2 Security ko None karo aur Layer 3 tab par password lagao" },
        { en: "Untick 802.1X, tick PSK, and enter an ASCII passphrase of 8 to 63 characters", hi: "802.1X untick karo, PSK tick karo, aur 8 se 63 characters ka ASCII passphrase daalo" },
        { en: "Tick TKIP as well as AES so older clients can use the passphrase", hi: "AES ke saath TKIP bhi tick karo taaki purane clients passphrase use kar sakein" },
        { en: "Keep 802.1X and type the passphrase in the RADIUS server field", hi: "802.1X rehne do aur passphrase RADIUS server field mein type karo" },
      ],
      answer: 1,
      explain: {
        en: "WPA2 and AES are already correct. Personal mode differs only in key management: PSK instead of 802.1X, plus the key itself. Layer 3 security is for web portals, and TKIP is a weaker legacy cipher you do not need.",
        hi: "WPA2 aur AES pehle se sahi hain. Personal mode sirf key management mein alag hai: 802.1X ki jagah PSK, aur saath mein key. Layer 3 security web portals ke liye hai, aur TKIP ek kamzor purana cipher hai jiski zaroorat nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "You finish configuring WLAN CORP and click Apply on every tab. AP1 is joined to the WLC, but no phone can see CORP in its Wi-Fi list. What did you most likely miss?",
        hi: "Tum WLAN CORP configure karke har tab par Apply click kar dete ho. AP1 WLC se joined hai, lekin kisi phone ki Wi-Fi list mein CORP nahi dikhta. Sabse likely kya chhoot gaya?",
      },
      options: [
        { en: "Setting the QoS profile to Gold", hi: "QoS profile ko Gold karna" },
        { en: "Ticking Status: Enabled on the General tab", hi: "General tab par Status: Enabled tick karna" },
        { en: "Ticking DHCP Addr. Assignment Required", hi: "DHCP Addr. Assignment Required tick karna" },
        { en: "Setting a session timeout", hi: "Session timeout set karna" },
      ],
      answer: 1,
      explain: {
        en: "A WLAN is created disabled, and APs only advertise enabled WLANs. QoS, DHCP and session timeout settings change how a WLAN behaves once clients join, not whether it is broadcast.",
        hi: "WLAN disabled state mein banta hai, aur APs sirf enabled WLANs advertise karte hain. QoS, DHCP aur session timeout settings clients ke join karne ke baad ka behaviour badalti hain, broadcast hona ya na hona nahi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "WLAN CORP has DHCP Addr. Assignment Required ticked. A laptop with a static address of 10.1.20.200/24 and the correct PSK joins CORP. What happens?",
        hi: "WLAN CORP par DHCP Addr. Assignment Required ticked hai. Static address 10.1.20.200/24 aur sahi PSK wala ek laptop CORP join karta hai. Kya hota hai?",
      },
      options: [
        { en: "It works normally because its address is in the right subnet", hi: "Normal kaam karta hai kyunki address sahi subnet ka hai" },
        { en: "The WLC changes its address to the next free DHCP address", hi: "WLC uska address agle free DHCP address mein badal deta hai" },
        { en: "It associates but cannot pass traffic until it obtains an address by DHCP", hi: "Associate ho jaata hai, lekin DHCP se address lene tak traffic pass nahi kar sakta" },
        { en: "The association is rejected before the 4-way handshake", hi: "4-way handshake se pehle hi association reject ho jaata hai" },
      ],
      answer: 2,
      explain: {
        en: "The setting does not block association. The WLC keeps the client in the DHCP_REQD state and only lets DHCP through, so a static-IP client never reaches RUN. The WLC cannot rewrite an address configured on the client.",
        hi: "Yeh setting association block nahi karti. WLC client ko DHCP_REQD state mein rakhta hai aur sirf DHCP pass hone deta hai, isliye static-IP wala client kabhi RUN tak nahi pahunchta. Client par configured address WLC badal nahi sakta.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "r9o6GFI87go",
      title: "Free CCNA | Wireless Configuration | Day 58",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Builds dynamic interfaces and WLANs on an AireOS WLC, with WPA2-PSK, QoS profiles and the Advanced tab.",
        hi: "AireOS WLC par dynamic interfaces aur WLANs banata hai, WPA2-PSK, QoS profiles aur Advanced tab ke saath.",
      },
    },
    {
      id: "cmoJ4mG_j24",
      title: "119. Free CCNA (NEW) | Wireless Networking - WLC Configuration",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walkthrough of the WLC GUI: interfaces, WLAN creation and security settings.", hi: "WLC GUI ka Hindi walkthrough: interfaces, WLAN banana aur security settings." },
    },
    {
      id: "gCYWXSCqXg8",
      title: "121. Free CCNA (NEW) | Wireless Networking - WLC Configuration Lab",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "A Hindi lab that puts the same steps together end to end.", hi: "Hindi lab jo yahi steps shuru se aakhir tak ek saath karta hai." },
    },
  ],
  lab: {
    title: { en: "Build WLAN CORP in Packet Tracer", hi: "Packet Tracer mein WLAN CORP banao" },
    steps: [
      {
        en: "Start from your lesson 2.8 lab (CSW1, WLC-2504, lightweight APs, server). On CSW1 create VLAN 20, the SVI 10.1.20.1/24, and run `show interfaces trunk` to confirm VLAN 20 is allowed to the WLC.",
        hi: "Apne lesson 2.8 wale lab (CSW1, WLC-2504, lightweight APs, server) se shuru karo. CSW1 par VLAN 20 aur SVI 10.1.20.1/24 banao, aur `show interfaces trunk` chala kar confirm karo ki WLC tak VLAN 20 allowed hai.",
      },
      {
        en: "On the server (10.1.30.10) add a DHCP pool for 10.1.20.0/24 with default gateway 10.1.20.1, starting at 10.1.20.31 so it never hands out .1 or .10.",
        hi: "Server (10.1.30.10) par 10.1.20.0/24 ka DHCP pool banao, default gateway 10.1.20.1, aur start 10.1.20.31 se rakho taaki .1 ya .10 kabhi na baante.",
      },
      {
        en: "In the WLC GUI create dynamic interface corp-vlan20: VLAN 20, 10.1.20.10/24, gateway 10.1.20.1, primary DHCP server 10.1.30.10.",
        hi: "WLC GUI mein dynamic interface corp-vlan20 banao: VLAN 20, 10.1.20.10/24, gateway 10.1.20.1, primary DHCP server 10.1.30.10.",
      },
      {
        en: "Create WLAN ID 1, profile and SSID CORP, mapped to corp-vlan20, with WPA2 + AES + PSK. Enable it, Apply, and Save Configuration.",
        hi: "WLAN ID 1 banao, profile aur SSID CORP, corp-vlan20 se mapped, WPA2 + AES + PSK ke saath. Enable karo, Apply karo, aur Save Configuration karo.",
      },
      {
        en: "Add a smartphone, join CORP with the passphrase and check it gets a 10.1.20.x address. If it gets none, add `ip helper-address 10.1.30.10` on CSW1's VLAN 20 SVI, since Packet Tracer does not model every WLC DHCP feature.",
        hi: "Ek smartphone add karo, passphrase ke saath CORP join karo aur check karo ki 10.1.20.x address mila. Na mile toh CSW1 ke VLAN 20 SVI par `ip helper-address 10.1.30.10` lagao, kyunki Packet Tracer WLC ka har DHCP feature model nahi karta.",
      },
      {
        en: "Break it on purpose: map CORP back to the management interface, reconnect the phone and note its new address and VLAN. Then fix it.",
        hi: "Jaan boojh kar todo: CORP ko wapas management interface se map karo, phone reconnect karo aur uska naya address aur VLAN note karo. Phir theek karo.",
      },
    ],
  },
};

export default lesson;
