import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "trunking",
  intro: {
    en: "Sales has users on two floors, each floor has its own switch, and both switches have VLAN 10 and VLAN 20. With access ports only, you would need one cable between the switches for every VLAN: 20 VLANs, 20 cables. A trunk carries all of them over one link by adding a small tag to each frame that says which VLAN it belongs to. Most links between switches in a campus are trunks, so you need to build one, read it and recognise its classic faults.",
    hi: "Sales ke users do floors par hain, har floor ka apna switch hai, aur dono switches par VLAN 10 aur VLAN 20 hain. Sirf access ports se kaam chalana ho toh har VLAN ke liye switches ke beech alag cable chahiye: 20 VLANs, 20 cables. Trunk ek hi link par saare VLANs le jaata hai, har frame par ek chhota tag lagakar jo batata hai ki frame kis VLAN ka hai. Campus mein switches ke beech zyadatar links trunks hi hote hain, isliye trunk banana, padhna aur uske classic faults pehchanna aana chahiye.",
  },
  outcomes: [
    { en: "Explain why trunks exist and how the 802.1Q tag keeps VLANs apart on one link", hi: "Samjha sako ki trunks kyun hote hain aur 802.1Q tag ek link par VLANs ko alag kaise rakhta hai" },
    { en: "Name the four fields of the 4-byte 802.1Q tag and say where the tag sits in the frame", hi: "4-byte 802.1Q tag ke chaar fields bata sako, aur yeh bhi ki tag frame mein kahan baithta hai" },
    { en: "Configure a trunk with a native VLAN and an allowed VLAN list, and verify it with `show interfaces trunk`", hi: "Native VLAN aur allowed VLAN list ke saath trunk configure kar sako, aur `show interfaces trunk` se verify kar sako" },
    { en: "Recognise a native VLAN mismatch from its symptoms", hi: "Symptoms dekh kar native VLAN mismatch pehchaan sako" },
    { en: "Predict the result of any pair of DTP modes, and explain why to turn DTP off", hi: "DTP modes ke kisi bhi pair ka result predict kar sako, aur samjha sako ki DTP band kyun karna chahiye" },
    { en: "Explain the VTP modes and why a higher revision number is dangerous", hi: "VTP modes samjha sako, aur yeh bhi ki zyada revision number khatarnaak kyun hai" },
  ],
  sections: [
    {
      id: "why-trunks",
      heading: { en: "One link, many VLANs", hi: "Ek link, kai VLANs" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In the previous lesson every VLAN lived on one switch. Real networks spread a VLAN across many switches: SW1 on floor 1 and SW2 on floor 2 both have Sales users in VLAN 10 and HR users in VLAN 20. The link between the switches has to carry both VLANs and still keep them apart.",
            hi: "Pichle lesson mein har VLAN ek hi switch par tha. Asli networks mein ek VLAN kai switches par faila hota hai: floor 1 ke SW1 aur floor 2 ke SW2, dono par VLAN 10 mein Sales users aur VLAN 20 mein HR users hain. Switches ke beech ke link ko dono VLANs carry karne hain, aur phir bhi unhe alag rakhna hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "A **trunk port** carries frames for many VLANs over one link. Before a frame leaves on a trunk, the switch adds a **tag** holding the frame's VLAN ID. The switch at the other end reads the tag, removes it, and forwards the frame only to ports in that VLAN. End hosts never see the tag.",
            hi: "**Trunk port** ek hi link par kai VLANs ke frames carry karta hai. Trunk se frame nikalne se pehle switch us par ek **tag** lagata hai jisme frame ka VLAN ID hota hai. Doosri taraf ka switch tag padhta hai, use hata deta hai, aur frame ko sirf us VLAN ke ports par forward karta hai. End hosts ko tag kabhi dikhta hi nahi.",
          },
        },
        {
          type: "table",
          caption: { en: "Access port vs trunk port", hi: "Access port vs trunk port" },
          columns: [{ en: "Feature", hi: "Feature" }, "Access port", "Trunk port"],
          rows: [
            [
              { en: "VLANs carried", hi: "Kitne VLANs" },
              { en: "One data VLAN (plus a voice VLAN)", hi: "Ek data VLAN (saath mein voice VLAN ho sakta hai)" },
              { en: "Many; all VLANs 1-4094 by default", hi: "Kai; by default saare VLANs 1-4094" },
            ],
            [
              { en: "Frames on the cable", hi: "Cable par frames" },
              { en: "Untagged", hi: "Untagged" },
              { en: "Tagged with 802.1Q, except the native VLAN", hi: "802.1Q tag ke saath, native VLAN ko chhod kar" },
            ],
            [
              { en: "Connects to", hi: "Kisse judta hai" },
              { en: "PCs, printers, phones", hi: "PCs, printers, phones" },
              { en: "Other switches, a router (lesson 2.3), or a server whose VMs are in several VLANs", hi: "Doosre switches, router (lesson 2.3), ya aisa server jiske VMs kai VLANs mein hain" },
            ],
            [{ en: "Key command", hi: "Main command" }, "`switchport mode access`", "`switchport mode trunk`"],
          ],
        },
      ],
    },
    {
      id: "dot1q-tag",
      heading: { en: "The 802.1Q tag", hi: "802.1Q tag" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**IEEE 802.1Q** (often written dot1q) is the standard trunk encapsulation. The switch inserts 4 bytes into the Ethernet frame, between the source MAC address and the Type field. Everything else in the frame stays as it was.",
            hi: "**IEEE 802.1Q** (aksar dot1q likhte hain) standard trunk encapsulation hai. Switch Ethernet frame mein source MAC address aur Type field ke beech 4 bytes insert karta hai. Frame ka baaki sab waisa hi rehta hai.",
          },
        },
        {
          type: "code",
          lang: "text",
          title: { en: "Where the tag goes (field sizes in bytes, tag fields in bits)", hi: "Tag kahan lagta hai (fields ka size bytes mein, tag ke fields bits mein)" },
          code: "Untagged frame: | Dest MAC 6 | Src MAC 6 | Type 2 | Data | FCS 4 |\nTagged frame:   | Dest MAC 6 | Src MAC 6 | 802.1Q tag 4 | Type 2 | Data | FCS 4 |\n\n802.1Q tag:     | TPID 16 (0x8100) | PCP 3 | DEI 1 | VID 12 |",
        },
        {
          type: "table",
          caption: { en: "The four fields inside the tag", hi: "Tag ke andar ke chaar fields" },
          columns: [{ en: "Field", hi: "Field" }, { en: "Size", hi: "Size" }, { en: "What it holds", hi: "Isme kya hota hai" }],
          rows: [
            [
              "TPID",
              "16 bits",
              {
                en: "Tag Protocol Identifier, always `0x8100`. It sits where the Type field normally is, so the receiver knows at once that a tag follows.",
                hi: "Tag Protocol Identifier, hamesha `0x8100`. Yeh wahan baithta hai jahan normally Type field hota hai, isliye receiver ko turant pata chal jaata hai ki tag aage hai.",
              },
            ],
            [
              "PCP",
              "3 bits",
              {
                en: "Priority Code Point: a priority from 0 to 7, also called CoS. QoS uses it; IP phones mark voice with 5.",
                hi: "Priority Code Point: 0 se 7 tak priority, ise CoS bhi kehte hain. QoS ise use karta hai; IP phones voice ko 5 mark karte hain.",
              },
            ],
            [
              "DEI",
              "1 bit",
              {
                en: "Drop Eligible Indicator: marks frames that may be dropped first when a link is congested. It used to be called CFI.",
                hi: "Drop Eligible Indicator: congestion ke time kaunse frames pehle drop ho sakte hain, yeh mark karta hai. Pehle ise CFI kehte the.",
              },
            ],
            [
              "VID",
              "12 bits",
              {
                en: "VLAN ID, 0 to 4095. 0 and 4095 are reserved, which is why the highest usable VLAN is 4094.",
                hi: "VLAN ID, 0 se 4095. 0 aur 4095 reserved hain, isliye sabse bada usable VLAN 4094 hai.",
              },
            ],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "The tag adds 4 bytes, so the largest standard tagged frame is 1522 bytes instead of 1518.",
              hi: "Tag 4 bytes jodta hai, isliye sabse bada standard tagged frame 1518 ki jagah 1522 bytes ka hota hai.",
            },
            {
              en: "The frame has changed, so the switch recalculates the FCS every time it adds or removes a tag.",
              hi: "Frame badal gaya, isliye switch jab bhi tag lagata ya hatata hai, FCS dobara calculate karta hai.",
            },
            {
              en: "PCs never see tags. The switch removes the tag before it sends a frame out of an access port.",
              hi: "PCs ko tag kabhi nahi dikhta. Access port se frame bhejne se pehle switch tag hata deta hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "ISL: the old Cisco way", hi: "ISL: Cisco ka purana tareeka" },
          text: {
            en: "Before 802.1Q, Cisco used its own trunk protocol, **ISL** (Inter-Switch Link). ISL wraps the whole frame in a new 26-byte header and a 4-byte trailer instead of inserting a tag, and it has no native VLAN. It is obsolete, and most current switches support only 802.1Q. On older models that support both, such as the Catalyst 3560, you must pick one with `switchport trunk encapsulation dot1q` before `switchport mode trunk` is accepted.",
            hi: "802.1Q se pehle Cisco apna trunk protocol use karta tha, **ISL** (Inter-Switch Link). ISL tag insert karne ki jagah poore frame ko ek naye 26-byte header aur 4-byte trailer mein wrap karta hai, aur usme native VLAN hota hi nahi. Yeh obsolete hai, aur aaj ke zyadatar switches sirf 802.1Q support karte hain. Purane models jo dono support karte hain, jaise Catalyst 3560, un par `switchport mode trunk` tabhi accept hota hai jab pehle `switchport trunk encapsulation dot1q` se encapsulation choose karo.",
          },
        },
      ],
    },
    {
      id: "native-vlan",
      heading: { en: "The native VLAN", hi: "Native VLAN" },
      blocks: [
        {
          type: "p",
          text: {
            en: "802.1Q has one exception to tagging. Frames in the trunk's **native VLAN** are sent without a tag, and any untagged frame that arrives on the trunk is placed in the native VLAN. The default native VLAN is VLAN 1. The rule exists for backward compatibility, from the days when a device that did not understand tags might share the link.",
            hi: "802.1Q mein tagging ka ek exception hai. Trunk ke **native VLAN** ke frames bina tag ke bheje jaate hain, aur trunk par aaya koi bhi untagged frame native VLAN mein daala jaata hai. Default native VLAN, VLAN 1 hai. Yeh rule backward compatibility ke liye hai, us zamane se jab link par aisa device bhi ho sakta tha jo tags samajhta hi nahi tha.",
          },
        },
        {
          type: "p",
          text: {
            en: "Nothing in an untagged frame says which VLAN it came from. Each switch simply assumes it belongs to its own native VLAN. The native VLAN is set separately on each end of the trunk, so **both ends must match**. Here is what happens when they don't:",
            hi: "Untagged frame mein kahin nahi likha hota ki woh kis VLAN se aaya. Har switch bas maan leta hai ki woh uske apne native VLAN ka hai. Native VLAN trunk ke dono ends par alag-alag set hota hai, isliye **dono ends match hone chahiye**. Match na hon toh yeh hota hai:",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "SW1's end of the trunk has native VLAN 99, but SW2's end was set to 20 by mistake.",
              hi: "Trunk ke SW1 wale end par native VLAN 99 hai, lekin SW2 wale end par galti se 20 set ho gaya.",
            },
            {
              en: "PC4, in VLAN 20 on SW2, sends a broadcast. VLAN 20 is SW2's native VLAN, so SW2 sends the frame across the trunk untagged.",
              hi: "SW2 par VLAN 20 mein baitha PC4 ek broadcast bhejta hai. SW2 ke liye VLAN 20 native VLAN hai, isliye SW2 frame ko trunk par bina tag ke bhejta hai.",
            },
            {
              en: "SW1 receives an untagged frame and places it in its native VLAN, 99. The frame has jumped from VLAN 20 into VLAN 99, and PC2, in VLAN 20 on SW1, never receives it.",
              hi: "SW1 ko untagged frame milta hai aur woh use apne native VLAN 99 mein daal deta hai. Frame VLAN 20 se VLAN 99 mein kood gaya, aur SW1 par VLAN 20 wale PC2 ko yeh kabhi nahi milta.",
            },
            {
              en: "The reverse happens too: anything SW1 sends in VLAN 99 leaves untagged and lands in VLAN 20 on SW2.",
              hi: "Ulta bhi hota hai: SW1 jo kuch VLAN 99 mein bhejta hai, woh untagged nikalta hai aur SW2 par VLAN 20 mein pahunch jaata hai.",
            },
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**CDP notices.** CDP messages carry each side's native VLAN, so both switches keep logging `%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (99), with SW2 GigabitEthernet0/1 (20).`",
              hi: "**CDP pakad leta hai.** CDP messages mein dono sides ka native VLAN hota hai, isliye dono switches baar baar log karte hain: `%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on GigabitEthernet0/1 (99), with SW2 GigabitEthernet0/1 (20).`",
            },
            {
              en: "**Traffic leaks and breaks.** Frames move between the two native VLANs, and hosts in those VLANs lose connectivity across the link.",
              hi: "**Traffic leak hota hai aur tootta hai.** Frames dono native VLANs ke beech chale jaate hain, aur un VLANs ke hosts ki link ke paar connectivity toot jaati hai.",
            },
            {
              en: "**Spanning tree may block it.** On Cisco switches running PVST+, STP usually detects the mismatch too and blocks the trunk for the two VLANs involved (lesson 2.6).",
              hi: "**Spanning tree block kar sakta hai.** PVST+ chalane wale Cisco switches par STP bhi aam taur par mismatch pakad leta hai aur un do VLANs ke liye trunk block kar deta hai (lesson 2.6).",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Best practice for the native VLAN", hi: "Native VLAN ki best practice" },
          text: {
            en: "Use the same unused VLAN as the native VLAN on both ends, for example VLAN 99 with no hosts in it. Then nothing important ever travels untagged, and a VLAN-hopping attack called double tagging, which only works when the attacker is in the native VLAN, has nothing to work with.",
            hi: "Dono ends par native VLAN ke liye ek hi unused VLAN rakho, jaise VLAN 99 jisme koi host nahi. Tab koi important traffic kabhi untagged nahi jaata, aur double tagging naam ka VLAN-hopping attack, jo sirf tab chalta hai jab attacker native VLAN mein ho, kuch nahi kar paata.",
          },
        },
      ],
    },
    {
      id: "configure-trunk",
      heading: { en: "Configuring and verifying a trunk", hi: "Trunk configure aur verify karna" },
      blocks: [
        {
          type: "cli",
          title: { en: "SW1 Gi0/1 (repeat the same on SW2 Gi0/1)", hi: "SW1 Gi0/1 (SW2 Gi0/1 par bhi yahi karo)" },
          lines: [
            { prompt: "SW1(config)#", cmd: "vlan 99" },
            { prompt: "SW1(config-vlan)#", cmd: "name NATIVE" },
            { prompt: "SW1(config-vlan)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "interface gigabitEthernet0/1" },
            { prompt: "SW1(config-if)#", cmd: "switchport mode trunk", comment: { en: "Always a trunk, whatever the other end says", hi: "Hamesha trunk, doosra end kuch bhi kahe" } },
            { prompt: "SW1(config-if)#", cmd: "switchport trunk native vlan 99", comment: { en: "Must match the other end", hi: "Doosre end se match hona chahiye" } },
            { prompt: "SW1(config-if)#", cmd: "switchport trunk allowed vlan 10,20,99", comment: { en: "Replaces the default list (all VLANs)", hi: "Default list (saare VLANs) ko replace karta hai" } },
            { prompt: "SW1(config-if)#", cmd: "switchport nonegotiate", comment: { en: "Stop sending DTP frames", hi: "DTP frames bhejna band" } },
          ],
          note: {
            en: "On a switch that supports both ISL and 802.1Q, IOS rejects `switchport mode trunk` with `Command rejected: An interface whose trunk encapsulation is \"Auto\" can not be configured to \"trunk\" mode.` Enter `switchport trunk encapsulation dot1q` first.",
            hi: "Jo switch ISL aur 802.1Q dono support karta hai, us par IOS `switchport mode trunk` ko reject karta hai: `Command rejected: An interface whose trunk encapsulation is \"Auto\" can not be configured to \"trunk\" mode.` Pehle `switchport trunk encapsulation dot1q` daalo.",
          },
        },
        {
          type: "p",
          text: {
            en: "By default a trunk carries every VLAN, 1 to 4094. Limiting it to the VLANs the far switch needs cuts unnecessary flooding and limits the damage when something goes wrong. The allowed list command has several forms:",
            hi: "By default trunk har VLAN carry karta hai, 1 se 4094. Use sirf un VLANs tak limit karo jo doosre switch ko chahiye; isse bekaar ki flooding kam hoti hai aur kuch galat hone par nuksaan bhi kam hota hai. Allowed list command ke kai forms hain:",
          },
        },
        {
          type: "list",
          items: [
            { en: "`switchport trunk allowed vlan 10,20,99` replaces the whole list.", hi: "`switchport trunk allowed vlan 10,20,99` poori list replace kar deta hai." },
            { en: "`switchport trunk allowed vlan add 30` adds VLAN 30 to the list.", hi: "`switchport trunk allowed vlan add 30` list mein VLAN 30 jodta hai." },
            { en: "`switchport trunk allowed vlan remove 20` removes VLAN 20 from the list.", hi: "`switchport trunk allowed vlan remove 20` list se VLAN 20 hatata hai." },
            { en: "`switchport trunk allowed vlan all`, `none` and `except 30` do what their names say.", hi: "`switchport trunk allowed vlan all`, `none` aur `except 30` wahi karte hain jo unke naam se lagta hai." },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Forgetting add", hi: "add bhool jaana" },
          text: {
            en: "On a working trunk, `switchport trunk allowed vlan 30` does not add VLAN 30. It replaces 10,20,99 with just 30, and VLANs 10 and 20 stop crossing the link the moment you press Enter. Use `add`.",
            hi: "Chalte hue trunk par `switchport trunk allowed vlan 30` VLAN 30 add nahi karta. Woh 10,20,99 ko hata kar sirf 30 rakh deta hai, aur Enter dabate hi VLAN 10 aur 20 link par jaana band kar dete hain. `add` use karo.",
          },
        },
        {
          type: "cli",
          title: { en: "Verify the trunk", hi: "Trunk verify karo" },
          lines: [
            { prompt: "SW1#", cmd: "show interfaces trunk" },
            { out: "Port        Mode             Encapsulation  Status        Native vlan" },
            {
              out: "Gi0/1       on               802.1q         trunking      99",
              comment: { en: "Mode `on` = `switchport mode trunk`. A negotiated trunk shows `desirable` or `auto`.", hi: "Mode `on` = `switchport mode trunk`. Negotiate hua trunk `desirable` ya `auto` dikhata hai." },
            },
            { out: "\nPort        Vlans allowed on trunk" },
            { out: "Gi0/1       10,20,99", comment: { en: "The configured allowed list", hi: "Configure ki hui allowed list" } },
            { out: "\nPort        Vlans allowed and active in management domain" },
            { out: "Gi0/1       10,20,99", comment: { en: "Allowed, and the VLAN exists on this switch", hi: "Allowed hai, aur VLAN is switch par exist karta hai" } },
            { out: "\nPort        Vlans in spanning tree forwarding state and not pruned" },
            { out: "Gi0/1       10,20,99", comment: { en: "Allowed, existing and not blocked by STP: these VLANs really cross the link", hi: "Allowed, existing aur STP ne block nahi kiya: yahi VLANs asal mein link par jaate hain" } },
          ],
          note: {
            en: "Trunk ports do not appear in `show vlan brief`; use `show interfaces trunk`. For one port in detail, `show interfaces gi0/1 switchport` shows `Administrative Mode: trunk`, `Operational Mode: trunk`, and `Negotiation of Trunking: Off` once `nonegotiate` is set.",
            hi: "Trunk ports `show vlan brief` mein nahi dikhte; `show interfaces trunk` use karo. Ek port ki detail ke liye `show interfaces gi0/1 switchport` chalao: `Administrative Mode: trunk`, `Operational Mode: trunk`, aur `nonegotiate` lagane ke baad `Negotiation of Trunking: Off` dikhta hai.",
          },
        },
      ],
    },
    {
      id: "dtp",
      heading: { en: "DTP: negotiated trunks, and why to switch them off", hi: "DTP: negotiate hone wale trunks, aur unhe band kyun karein" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The **Dynamic Trunking Protocol (DTP)** is a Cisco protocol that lets two connected switch ports agree whether their link becomes a trunk. What a port does depends on its `switchport mode`:",
            hi: "**Dynamic Trunking Protocol (DTP)** Cisco ka protocol hai jisse do connected switch ports aapas mein tay karte hain ki unka link trunk banega ya nahi. Port kya karega, yeh uske `switchport mode` par depend karta hai:",
          },
        },
        {
          type: "list",
          items: [
            { en: "`access`: never becomes a trunk.", hi: "`access`: kabhi trunk nahi banta." },
            {
              en: "`trunk`: always a trunk. Unless you add `nonegotiate`, it also sends DTP frames inviting the neighbour to trunk.",
              hi: "`trunk`: hamesha trunk. Jab tak `nonegotiate` na lagao, yeh neighbour ko trunk ke liye invite karne wale DTP frames bhi bhejta hai.",
            },
            {
              en: "`dynamic desirable`: actively asks the neighbour to trunk. The link becomes a trunk if the neighbour is trunk, dynamic desirable or dynamic auto.",
              hi: "`dynamic desirable`: khud neighbour se trunk ke liye poochta hai. Neighbour trunk, dynamic desirable ya dynamic auto ho toh link trunk ban jaata hai.",
            },
            {
              en: "`dynamic auto`: never asks, but agrees if the neighbour asks (trunk or dynamic desirable). This is the default on most current Catalyst switches.",
              hi: "`dynamic auto`: khud kabhi nahi poochta, lekin neighbour pooche (trunk ya dynamic desirable) toh maan jaata hai. Aaj ke zyadatar Catalyst switches par yahi default hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "What the link becomes for each pair of modes", hi: "Har mode pair par link kya banta hai" },
          columns: ["SW1 / SW2", "access", "trunk", "dynamic desirable", "dynamic auto"],
          rows: [
            ["access", "Access", { en: "Mismatch (avoid)", hi: "Mismatch (mat karo)" }, "Access", "Access"],
            ["trunk", { en: "Mismatch (avoid)", hi: "Mismatch (mat karo)" }, "Trunk", "Trunk", "Trunk"],
            ["dynamic desirable", "Access", "Trunk", "Trunk", "Trunk"],
            ["dynamic auto", "Access", "Trunk", "Trunk", "Access"],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "auto + auto = access", hi: "auto + auto = access" },
          text: {
            en: "Two switches left at the default, dynamic auto, never form a trunk: both wait for the other to ask. At least one side must be trunk or dynamic desirable.",
            hi: "Default dynamic auto par chhode gaye do switches kabhi trunk nahi banate: dono intezaar karte hain ki doosra pooche. Kam se kam ek side trunk ya dynamic desirable honi chahiye.",
          },
        },
        {
          type: "p",
          text: {
            en: "DTP is convenient but risky. A port left in a dynamic mode can be negotiated into a trunk by an attacker's device, which can then send frames into any VLAN; this attack is called switch spoofing. Negotiation can also change a link's role without anyone noticing. Best practice is to hard-code every port: `switchport mode access` on host ports, and `switchport mode trunk` plus `switchport nonegotiate` on links between switches.",
            hi: "DTP aasaan toh hai par risky hai. Dynamic mode mein chhoda gaya port attacker ke device se negotiate hokar trunk ban sakta hai, aur phir woh device kisi bhi VLAN mein frames bhej sakta hai; is attack ko switch spoofing kehte hain. Negotiation kisi ke notice kiye bina link ka role bhi badal sakta hai. Best practice yeh hai ki har port hard-code karo: host ports par `switchport mode access`, aur switches ke beech ke links par `switchport mode trunk` ke saath `switchport nonegotiate`.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "nonegotiate needs a fixed partner", hi: "nonegotiate ko fixed partner chahiye" },
          text: {
            en: "With `nonegotiate`, a port sends no DTP frames. If the other end is dynamic auto or dynamic desirable, it never hears an invitation and stays an access port. Set both ends to `switchport mode trunk`.",
            hi: "`nonegotiate` ke saath port koi DTP frame nahi bhejta. Agar doosra end dynamic auto ya dynamic desirable hai, toh use kabhi invitation nahi milta aur woh access port hi reh jaata hai. Dono ends par `switchport mode trunk` lagao.",
          },
        },
      ],
    },
    {
      id: "vtp",
      heading: { en: "VTP: sharing the VLAN list, and its risk", hi: "VTP: VLAN list share karna, aur uska risk" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Trunks carry VLAN traffic, but each switch still needs the VLANs to exist in its own database. The **VLAN Trunking Protocol (VTP)**, another Cisco protocol, copies the VLAN database (IDs and names) from one switch to the others in the same **VTP domain**, over trunks. It does not assign ports to VLANs; you still do that on each switch.",
            hi: "Trunks VLAN traffic le jaate hain, lekin har switch ke apne database mein VLANs exist karne chahiye. **VLAN Trunking Protocol (VTP)**, Cisco ka ek aur protocol, VLAN database (IDs aur names) ko ek switch se usi **VTP domain** ke baaki switches tak trunks ke through copy karta hai. Yeh ports ko VLANs mein assign nahi karta; woh kaam har switch par tumhe hi karna hai.",
          },
        },
        {
          type: "table",
          caption: { en: "VTP modes", hi: "VTP modes" },
          columns: [
            { en: "Mode", hi: "Mode" },
            { en: "Create or change VLANs?", hi: "VLAN create ya change kar sakta hai?" },
            { en: "Syncs to advertisements?", hi: "Advertisements se sync hota hai?" },
            { en: "Passes advertisements on?", hi: "Advertisements aage bhejta hai?" },
          ],
          rows: [
            [{ en: "Server (default)", hi: "Server (default)" }, { en: "Yes", hi: "Haan" }, { en: "Yes", hi: "Haan" }, { en: "Yes", hi: "Haan" }],
            [{ en: "Client", hi: "Client" }, { en: "No", hi: "Nahi" }, { en: "Yes", hi: "Haan" }, { en: "Yes", hi: "Haan" }],
            [{ en: "Transparent", hi: "Transparent" }, { en: "Yes, local only", hi: "Haan, sirf local" }, { en: "No", hi: "Nahi" }, { en: "Yes", hi: "Haan" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Every change on a server raises the domain's **configuration revision number** by one, and advertisements carry that number. A switch accepts any advertisement from its domain with a higher revision than its own and replaces its whole VLAN database with it. That creates the classic VTP outage: a used switch with revision 50 is plugged into production (revision 12) with the same domain name. Its VLAN list wins, VLANs missing from it are deleted on every switch, and every access port in those VLANs goes inactive. Even a VTP client can do this.",
            hi: "Server par har change domain ka **configuration revision number** ek se badha deta hai, aur advertisements yeh number saath le jaate hain. Switch apne domain ka koi bhi advertisement accept kar leta hai jiska revision uske apne revision se zyada ho, aur apna poora VLAN database usse replace kar deta hai. Isi se classic VTP outage hota hai: revision 50 wala ek purana switch same domain name ke saath production (revision 12) mein laga diya. Uski VLAN list jeet jaati hai, jo VLANs usme nahi hain woh har switch se delete ho jaate hain, aur un VLANs ke saare access ports inactive ho jaate hain. VTP client bhi yeh kar sakta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Reset the revision first", hi: "Pehle revision reset karo" },
          text: {
            en: "Before connecting a used switch, reset its revision to 0: change it to transparent mode and back, or change its domain name and back.",
            hi: "Purana switch connect karne se pehle uska revision 0 kar do: use transparent mode mein daal kar wapas lao, ya domain name badal kar wapas rakho.",
          },
        },
        {
          type: "p",
          text: {
            en: "VTP version 3 closes most of these holes: only the **primary server** can change the VLAN database, and it can carry extended-range VLANs. By default a Catalyst switch is a VTP server running version 1 with no domain name. Many networks avoid the risk altogether by running every switch in transparent mode and creating VLANs on each switch.",
            hi: "VTP version 3 in zyadatar problems ko fix karta hai: sirf **primary server** VLAN database badal sakta hai, aur yeh extended-range VLANs bhi carry kar sakta hai. By default Catalyst switch VTP server hota hai, version 1 chalata hai, aur koi domain name nahi hota. Kai networks yeh risk poori tarah se hi avoid karte hain: har switch transparent mode mein, aur VLANs har switch par alag se banaye jaate hain.",
          },
        },
        {
          type: "cli",
          title: { en: "Take SW1 out of VTP synchronisation", hi: "SW1 ko VTP sync se bahar nikalo" },
          lines: [
            { prompt: "SW1(config)#", cmd: "vtp domain CAMPUS" },
            { out: "Changing VTP domain name from NULL to CAMPUS" },
            { prompt: "SW1(config)#", cmd: "vtp mode transparent" },
            { prompt: "SW1(config)#", cmd: "end" },
            { prompt: "SW1#", cmd: "show vtp status | include version running|Operating Mode|Revision" },
            { out: "VTP version running             : 1" },
            { out: "VTP Operating Mode                : Transparent" },
            { out: "Configuration Revision            : 0", comment: { en: "A transparent switch always shows revision 0", hi: "Transparent switch hamesha revision 0 dikhata hai" } },
          ],
          note: {
            en: "This is IOS 15 output. Older releases, and Packet Tracer, show the same information in a slightly different layout.",
            hi: "Yeh IOS 15 ka output hai. Purane releases aur Packet Tracer yahi information thode alag layout mein dikhate hain.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Trunk port", def: { en: "A switch port that carries frames for many VLANs over one link, marking each frame's VLAN with an 802.1Q tag.", hi: "Switch port jo ek link par kai VLANs ke frames le jaata hai, har frame ka VLAN 802.1Q tag se mark karke." } },
    { term: "802.1Q", def: { en: "The IEEE standard trunk encapsulation: a 4-byte tag inserted between the source MAC and the Type field.", hi: "IEEE ka standard trunk encapsulation: source MAC aur Type field ke beech insert hone wala 4-byte tag." } },
    { term: "TPID 0x8100", def: { en: "The first 16 bits of the 802.1Q tag, which tell the receiver that the frame is tagged.", hi: "802.1Q tag ke pehle 16 bits, jo receiver ko batate hain ki frame tagged hai." } },
    { term: "Native VLAN", def: { en: "The one VLAN whose frames cross a trunk untagged. VLAN 1 by default, and it must match on both ends.", hi: "Woh ek VLAN jiske frames trunk par bina tag ke jaate hain. By default VLAN 1, aur dono ends par match hona chahiye." } },
    { term: "Allowed VLAN list", def: { en: "The VLANs a trunk is permitted to carry. All VLANs by default.", hi: "Woh VLANs jinhe trunk carry kar sakta hai. By default saare VLANs." } },
    { term: "DTP", def: { en: "Dynamic Trunking Protocol. A Cisco protocol that negotiates whether a link becomes a trunk.", hi: "Dynamic Trunking Protocol. Cisco protocol jo negotiate karta hai ki link trunk banega ya nahi." } },
    { term: "VTP", def: { en: "VLAN Trunking Protocol. A Cisco protocol that copies VLAN IDs and names from a server to the other switches in a domain.", hi: "VLAN Trunking Protocol. Cisco protocol jo VLAN IDs aur names server se domain ke baaki switches tak copy karta hai." } },
    { term: "Configuration revision", def: { en: "VTP's version counter for the VLAN database. The highest revision in a domain overwrites the others.", hi: "VLAN database ka VTP version counter. Domain mein sabse zyada revision baaki sab ko overwrite kar deta hai." } },
  ],
  commands: [
    { cmd: "switchport trunk encapsulation dot1q", mode: "Interface configuration", does: { en: "Choose 802.1Q on switches that also support ISL; needed before `switchport mode trunk` there", hi: "ISL bhi support karne wale switches par 802.1Q choose karo; wahan `switchport mode trunk` se pehle zaroori" } },
    { cmd: "switchport mode trunk", mode: "Interface configuration", does: { en: "Make the port a permanent trunk", hi: "Port ko permanent trunk banao" } },
    { cmd: "switchport trunk native vlan 99", mode: "Interface configuration", does: { en: "Set the native (untagged) VLAN; it must match the other end", hi: "Native (untagged) VLAN set karo; doosre end se match hona chahiye" } },
    { cmd: "switchport trunk allowed vlan 10,20,99", mode: "Interface configuration", does: { en: "Replace the list of VLANs the trunk carries", hi: "Trunk jin VLANs ko carry karta hai, unki list replace karo" } },
    { cmd: "switchport trunk allowed vlan add 30", mode: "Interface configuration", does: { en: "Add one VLAN to the allowed list", hi: "Allowed list mein ek VLAN jodo" } },
    { cmd: "switchport trunk allowed vlan remove 20", mode: "Interface configuration", does: { en: "Remove one VLAN from the allowed list", hi: "Allowed list se ek VLAN hatao" } },
    { cmd: "switchport nonegotiate", mode: "Interface configuration", does: { en: "Stop the port sending DTP frames", hi: "Port ka DTP frames bhejna band karo" } },
    { cmd: "switchport mode dynamic desirable", mode: "Interface configuration", does: { en: "Actively ask the neighbour to form a trunk", hi: "Neighbour se khud trunk banane ko kaho" } },
    { cmd: "switchport mode dynamic auto", mode: "Interface configuration", does: { en: "Form a trunk only if the neighbour asks (the usual default)", hi: "Trunk tabhi banao jab neighbour pooche (aam default)" } },
    { cmd: "show interfaces trunk", mode: "Privileged EXEC", does: { en: "List trunks with mode, encapsulation, native VLAN and VLAN lists", hi: "Trunks ko mode, encapsulation, native VLAN aur VLAN lists ke saath dikhao" } },
    { cmd: "show interfaces gi0/1 switchport", mode: "Privileged EXEC", does: { en: "Show one port's configured and operational mode", hi: "Ek port ka configured aur operational mode dikhao" } },
    { cmd: "vtp domain CAMPUS", mode: "Global configuration", does: { en: "Set the VTP domain name", hi: "VTP domain name set karo" } },
    { cmd: "vtp mode transparent", mode: "Global configuration", does: { en: "Stop syncing VLANs from VTP; keep VLANs local", hi: "VTP se VLAN sync band karo; VLANs local rakho" } },
    { cmd: "show vtp status", mode: "Privileged EXEC", does: { en: "Show VTP version, domain, mode and revision number", hi: "VTP version, domain, mode aur revision number dikhao" } },
  ],
  mistakes: [
    {
      en: "Changing the native VLAN on one end of a trunk only. Both ends must use the same native VLAN, or untagged frames land in the wrong VLAN and CDP logs `NATIVE_VLAN_MISMATCH`.",
      hi: "Trunk ke sirf ek end par native VLAN badalna. Dono ends par same native VLAN hona chahiye, warna untagged frames galat VLAN mein pahunchte hain aur CDP `NATIVE_VLAN_MISMATCH` log karta hai.",
    },
    {
      en: "Typing `switchport trunk allowed vlan 30` to add a VLAN. That replaces the list; use `switchport trunk allowed vlan add 30`.",
      hi: "VLAN add karne ke liye `switchport trunk allowed vlan 30` type karna. Yeh list replace kar deta hai; `switchport trunk allowed vlan add 30` use karo.",
    },
    {
      en: "Leaving both ends at dynamic auto and expecting a trunk. auto + auto = access; at least one end must be trunk or dynamic desirable.",
      hi: "Dono ends dynamic auto par chhod kar trunk ki ummeed karna. auto + auto = access; kam se kam ek end trunk ya dynamic desirable hona chahiye.",
    },
    {
      en: "Looking for trunk ports in `show vlan brief`. Trunks are never listed there; use `show interfaces trunk`.",
      hi: "`show vlan brief` mein trunk ports dhoondhna. Trunks wahan kabhi list nahi hote; `show interfaces trunk` use karo.",
    },
    {
      en: "Adding `switchport nonegotiate` on one end while the other end is still dynamic. The dynamic side never hears DTP and stays an access port.",
      hi: "Ek end par `switchport nonegotiate` lagana jabki doosra end abhi bhi dynamic hai. Dynamic side ko DTP sunai hi nahi deta aur woh access port reh jaati hai.",
    },
    {
      en: "Connecting a used switch without checking its VTP revision. If it has the same domain and a higher revision, it can overwrite every switch's VLAN database.",
      hi: "Purana switch uska VTP revision check kiye bina connect kar dena. Same domain aur zyada revision hua toh woh har switch ka VLAN database overwrite kar sakta hai.",
    },
  ],
  recap: [
    { en: "A trunk carries many VLANs on one link. 802.1Q inserts a 4-byte tag after the source MAC: TPID 0x8100, PCP, DEI and a 12-bit VLAN ID.", hi: "Trunk ek link par kai VLANs carry karta hai. 802.1Q source MAC ke baad 4-byte tag lagata hai: TPID 0x8100, PCP, DEI aur 12-bit VLAN ID." },
    { en: "Native VLAN frames cross untagged. The default is VLAN 1; both ends must match; best practice is an unused VLAN.", hi: "Native VLAN ke frames bina tag ke jaate hain. Default VLAN 1 hai; dono ends match hone chahiye; best practice ek unused VLAN hai." },
    { en: "Configure with `switchport mode trunk`, `switchport trunk native vlan`, `switchport trunk allowed vlan` (use `add`) and `switchport nonegotiate`; verify with `show interfaces trunk`.", hi: "`switchport mode trunk`, `switchport trunk native vlan`, `switchport trunk allowed vlan` (`add` ke saath) aur `switchport nonegotiate` se configure karo; `show interfaces trunk` se verify karo." },
    { en: "DTP: desirable asks, auto waits, auto + auto = access. Hard-code ports and disable DTP.", hi: "DTP: desirable poochta hai, auto intezaar karta hai, auto + auto = access. Ports hard-code karo aur DTP band karo." },
    { en: "VTP modes are server, client and transparent. A higher revision overwrites the domain's VLANs; VTPv3 adds a primary server.", hi: "VTP modes server, client aur transparent hain. Zyada revision domain ke VLANs overwrite kar deta hai; VTPv3 primary server laata hai." },
    { en: "ISL is Cisco's obsolete trunk protocol; current switches use 802.1Q.", hi: "ISL Cisco ka obsolete trunk protocol hai; aaj ke switches 802.1Q use karte hain." },
  ],
  quiz: [
    {
      q: { en: "Where does a switch insert the 802.1Q tag in an Ethernet frame?", hi: "Switch Ethernet frame mein 802.1Q tag kahan insert karta hai?" },
      options: [
        { en: "Before the destination MAC address", hi: "Destination MAC address se pehle" },
        { en: "Between the source MAC address and the Type field", hi: "Source MAC address aur Type field ke beech" },
        { en: "Between the payload and the FCS", hi: "Payload aur FCS ke beech" },
        { en: "Inside the IP header", hi: "IP header ke andar" },
      ],
      answer: 1,
      explain: {
        en: "The 4-byte tag goes right after the source MAC, where the Type field would normally start. Its first field, TPID 0x8100, tells the receiver a tag follows. It is a Layer 2 change, so the IP header is untouched.",
        hi: "4-byte tag source MAC ke theek baad lagta hai, jahan normally Type field shuru hota. Uska pehla field, TPID 0x8100, receiver ko batata hai ki tag aage hai. Yeh Layer 2 ka change hai, isliye IP header ko koi haath nahi lagata.",
      },
      kind: "concept",
    },
    {
      q: { en: "Which frames cross an 802.1Q trunk without a tag?", hi: "802.1Q trunk par kaunse frames bina tag ke jaate hain?" },
      options: [
        { en: "Broadcast frames in every VLAN", hi: "Har VLAN ke broadcast frames" },
        { en: "All VLAN 1 frames, whatever the native VLAN is", hi: "VLAN 1 ke saare frames, native VLAN kuch bhi ho" },
        { en: "Voice VLAN frames", hi: "Voice VLAN ke frames" },
        { en: "Frames in the trunk's native VLAN", hi: "Trunk ke native VLAN ke frames" },
      ],
      answer: 3,
      explain: {
        en: "Only the native VLAN is sent untagged. VLAN 1 is untagged only while it is the native VLAN, which it is by default. Broadcasts and voice frames are tagged with their VLAN like any other frame.",
        hi: "Sirf native VLAN bina tag ke jaata hai. VLAN 1 tabhi untagged jaata hai jab woh native VLAN ho, jo by default hota hai. Broadcasts aur voice frames baaki frames ki tarah apne VLAN ke tag ke saath jaate hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "SW1's end of a trunk has native VLAN 99. SW2's end was left at native VLAN 1. SW1 sends a frame in VLAN 99 across the trunk. What does SW2 do with it?",
        hi: "Trunk ke SW1 wale end par native VLAN 99 hai. SW2 wala end native VLAN 1 par hi chhoda gaya. SW1 trunk par VLAN 99 ka ek frame bhejta hai. SW2 uske saath kya karta hai?",
      },
      options: [
        { en: "Places it in VLAN 1, because SW2 treats every untagged frame as its own native VLAN", hi: "Use VLAN 1 mein daalta hai, kyunki SW2 har untagged frame ko apne native VLAN ka maanta hai" },
        { en: "Drops it, because trunks accept only tagged frames", hi: "Drop kar deta hai, kyunki trunks sirf tagged frames lete hain" },
        { en: "Places it in VLAN 99, because the tag says 99", hi: "Use VLAN 99 mein daalta hai, kyunki tag 99 bolta hai" },
        { en: "Sends it back to SW1", hi: "Use wapas SW1 ko bhej deta hai" },
      ],
      answer: 0,
      explain: {
        en: "VLAN 99 is SW1's native VLAN, so the frame leaves untagged. There is no tag saying 99, and SW2 puts every untagged frame into its own native VLAN, 1. That is the native VLAN mismatch, and CDP will log it.",
        hi: "VLAN 99 SW1 ka native VLAN hai, isliye frame bina tag ke nikalta hai. 99 batane wala koi tag hai hi nahi, aur SW2 har untagged frame ko apne native VLAN 1 mein daalta hai. Yahi native VLAN mismatch hai, aur CDP ise log karega.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Right after an engineer \"added VLAN 30\" to trunk Gi0/1, users in VLANs 10 and 20 lost connectivity across it. In `show interfaces trunk`, the Vlans allowed on trunk line for Gi0/1 now shows only `30`. What happened?",
        hi: "Engineer ne trunk Gi0/1 par \"VLAN 30 add kiya\" aur turant VLAN 10 aur 20 ke users ki connectivity us link ke paar toot gayi. `show interfaces trunk` mein Gi0/1 ki Vlans allowed on trunk line ab sirf `30` dikhati hai. Kya hua?",
      },
      options: [
        { en: "The native VLAN is still VLAN 1", hi: "Native VLAN abhi bhi VLAN 1 hai" },
        { en: "The trunk switched to ISL encapsulation", hi: "Trunk ISL encapsulation par chala gaya" },
        { en: "The engineer entered `switchport trunk allowed vlan 30` instead of `switchport trunk allowed vlan add 30`", hi: "Engineer ne `switchport trunk allowed vlan add 30` ki jagah `switchport trunk allowed vlan 30` daal diya" },
        { en: "DTP renegotiated the port into access mode", hi: "DTP ne port ko dobara negotiate karke access mode mein daal diya" },
      ],
      answer: 2,
      explain: {
        en: "Without `add`, the command replaces the allowed list, so only VLAN 30 crosses the trunk. If DTP had turned the port into an access port, it would not appear in `show interfaces trunk` at all. The native VLAN does not decide which VLANs are allowed.",
        hi: "`add` ke bina command allowed list ko replace kar deta hai, isliye trunk par sirf VLAN 30 jaata hai. Agar DTP ne port ko access bana diya hota, toh woh `show interfaces trunk` mein dikhta hi nahi. Native VLAN yeh decide nahi karta ki kaunse VLANs allowed hain.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "SW1 Gi0/1 and SW2 Gi0/1 are connected, and both are left at the default mode, dynamic auto. What does the link become?",
        hi: "SW1 Gi0/1 aur SW2 Gi0/1 connected hain, aur dono default mode dynamic auto par hain. Link kya banega?",
      },
      options: [
        { en: "A trunk, because both ports run DTP", hi: "Trunk, kyunki dono ports DTP chalate hain" },
        { en: "An access link, because neither side asks to trunk", hi: "Access link, kyunki koi bhi side trunk ke liye nahi poochti" },
        { en: "A trunk that carries VLAN 1 only", hi: "Trunk jo sirf VLAN 1 carry karta hai" },
        { en: "Err-disabled until someone configures it", hi: "Err-disabled, jab tak koi configure na kare" },
      ],
      answer: 1,
      explain: {
        en: "Dynamic auto only answers requests; it never makes one. With auto on both sides nobody asks, so both ports operate as access ports. Making either side trunk or dynamic desirable would form a trunk.",
        hi: "Dynamic auto sirf request ka jawab deta hai; khud kabhi request nahi karta. Dono taraf auto ho toh koi nahi poochta, isliye dono ports access ports ki tarah chalte hain. Kisi ek side ko trunk ya dynamic desirable karo toh trunk ban jayega.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A used switch, set as a VTP client in domain CAMPUS with configuration revision 40, is connected by a trunk to the production network (domain CAMPUS, revision 12). What is the risk?",
        hi: "Ek purana switch, jo domain CAMPUS mein VTP client hai aur jiska configuration revision 40 hai, trunk se production network (domain CAMPUS, revision 12) se connect kiya jaata hai. Risk kya hai?",
      },
      options: [
        { en: "None, because a client can never change the VLAN database", hi: "Koi nahi, kyunki client kabhi VLAN database nahi badal sakta" },
        { en: "The new switch ignores the domain because it is a client", hi: "Naya switch client hai, isliye domain ko ignore karta hai" },
        { en: "DTP blocks the trunk until the revisions match", hi: "DTP trunk ko tab tak block karta hai jab tak revisions match na hon" },
        { en: "Its VLAN database has the higher revision and can replace the VLANs on every switch in the domain", hi: "Uske VLAN database ka revision zyada hai, aur woh domain ke har switch ke VLANs replace kar sakta hai" },
      ],
      answer: 3,
      explain: {
        en: "Switches in a VTP domain accept the highest revision they hear, whether a server or a client sent it. A client cannot edit VLANs by command, but a stale database with a higher revision still wins. Reset the revision to 0 before connecting a used switch. DTP has nothing to do with VTP revisions.",
        hi: "VTP domain ke switches sabse zyada revision wala advertisement accept karte hain, chahe woh server ne bheja ho ya client ne. Client command se VLANs edit nahi kar sakta, lekin zyada revision wala purana database phir bhi jeet jaata hai. Purana switch connect karne se pehle revision 0 karo. DTP ka VTP revision se koi lena-dena nahi hai.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "Jl9OOzNaBDU",
      title: "Free CCNA | VLANs (Part 2) | Day 17",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Trunks, the 802.1Q tag and the native VLAN. The second half moves on to router-on-a-stick, which is lesson 2.3.",
        hi: "Trunks, 802.1Q tag aur native VLAN. Video ka doosra hissa router-on-a-stick par hai, jo lesson 2.3 mein aayega.",
      },
    },
    {
      id: "JtQV_0Sjszg",
      title: "Free CCNA | DTP/VTP | Day 19",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "DTP modes and their results, and VTP modes and revision numbers.", hi: "DTP modes aur unke results, aur VTP modes aur revision numbers." },
    },
    {
      id: "xzEW1_8PtEQ",
      title: "89. Free CCNA (NEW) | VLAN in Hindi - Encapsulation and DTP",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Trunk encapsulation (802.1Q and ISL) and DTP, in Hindi.", hi: "Trunk encapsulation (802.1Q aur ISL) aur DTP, Hindi mein." },
    },
    {
      id: "DZN7F_Kc_Ww",
      title: "90. Free CCNA (NEW) | VLAN in Hindi - What is Native VLAN",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "The native VLAN and what goes untagged on a trunk, in Hindi.", hi: "Native VLAN aur trunk par kya untagged jaata hai, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Build and break a trunk in Packet Tracer", hi: "Packet Tracer mein trunk banao aur todo" },
    steps: [
      {
        en: "Connect two 2960 switches with Gi0/1 to Gi0/1. On SW1 put PC1 (10.1.10.11/24) on Fa0/1 in VLAN 10 and PC2 (10.1.20.12/24) on Fa0/2 in VLAN 20. On SW2 put PC3 (10.1.10.13) on Fa0/1 in VLAN 10 and PC4 (10.1.20.14) on Fa0/2 in VLAN 20. Create VLANs 10, 20 and 99 on both switches.",
        hi: "Do 2960 switches ko Gi0/1 se Gi0/1 jodo. SW1 par PC1 (10.1.10.11/24) ko Fa0/1 par VLAN 10 mein aur PC2 (10.1.20.12/24) ko Fa0/2 par VLAN 20 mein lagao. SW2 par PC3 (10.1.10.13) ko Fa0/1 par VLAN 10 mein aur PC4 (10.1.20.14) ko Fa0/2 par VLAN 20 mein lagao. Dono switches par VLAN 10, 20 aur 99 banao.",
      },
      {
        en: "Before touching Gi0/1, run `show interfaces gi0/1 switchport` on SW1. Note the Administrative Mode (dynamic auto) and Operational Mode. Ping PC3 from PC1: it fails, because auto + auto gives an access link in VLAN 1.",
        hi: "Gi0/1 ko chhune se pehle SW1 par `show interfaces gi0/1 switchport` chalao. Administrative Mode (dynamic auto) aur Operational Mode note karo. PC1 se PC3 ko ping karo: fail hoga, kyunki auto + auto se VLAN 1 ka access link banta hai.",
      },
      {
        en: "On both switches configure Gi0/1 with `switchport mode trunk`, `switchport trunk native vlan 99`, `switchport trunk allowed vlan 10,20,99` and `switchport nonegotiate`. Check with `show interfaces trunk`, then ping PC1 to PC3 and PC2 to PC4.",
        hi: "Dono switches par Gi0/1 par `switchport mode trunk`, `switchport trunk native vlan 99`, `switchport trunk allowed vlan 10,20,99` aur `switchport nonegotiate` configure karo. `show interfaces trunk` se check karo, phir PC1 se PC3 aur PC2 se PC4 ko ping karo.",
      },
      {
        en: "In Simulation mode, ping PC3 from PC1 and open the frame on the trunk link. Find the 802.1Q header and its VLAN ID of 10 in the PDU details.",
        hi: "Simulation mode mein PC1 se PC3 ko ping karo aur trunk link par frame kholo. PDU details mein 802.1Q header aur uska VLAN ID 10 dhoondho.",
      },
      {
        en: "Set `switchport trunk native vlan 20` on SW2 only and wait for the `%CDP-4-NATIVE_VLAN_MISMATCH` message on the console. Put it back to 99.",
        hi: "Sirf SW2 par `switchport trunk native vlan 20` lagao aur console par `%CDP-4-NATIVE_VLAN_MISMATCH` message ka intezaar karo. Phir wapas 99 kar do.",
      },
      {
        en: "On SW1, under Gi0/1, type `switchport trunk allowed vlan 20` (no `add`) and watch PC1 to PC3 fail. Fix it with `switchport trunk allowed vlan 10,20,99`.",
        hi: "SW1 ke Gi0/1 par `switchport trunk allowed vlan 20` (bina `add` ke) type karo aur dekho PC1 se PC3 fail hota hai. `switchport trunk allowed vlan 10,20,99` se theek karo.",
      },
    ],
  },
};

export default lesson;
