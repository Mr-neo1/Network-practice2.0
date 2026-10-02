import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "port-security",
  intro: {
    en: "A switch learns and forwards for any MAC address that shows up on any port. That means anyone who reaches a wall jack in a meeting room can plug in a laptop and land straight in your VLAN, and one attacker can flood the MAC address table with fake addresses. Port security lets the access switch decide how many MAC addresses, and which ones, may use a port, and what to do when something else appears.",
    hi: "Switch kisi bhi port par aane wale kisi bhi MAC address ko seekh leta hai aur uske liye forward karta hai. Matlab meeting room ke wall jack tak jo bhi pahunch gaya, woh laptop lagakar seedha tumhare VLAN mein aa jaata hai, aur ek attacker fake addresses bhej kar MAC address table bhar sakta hai. Port security se access switch decide karta hai ki ek port ko kitne MAC addresses, aur kaunse, use kar sakte hain, aur kuch aur dikhe toh kya karna hai.",
  },
  outcomes: [
    { en: "Explain which problems port security solves: unknown devices on a port and MAC flooding", hi: "Samjha sako ki port security kaunsi problems solve karti hai: port par anjaan devices aur MAC flooding" },
    { en: "Enable port security on an access port and set the maximum number of MAC addresses", hi: "Access port par port security enable kar sako aur maximum MAC addresses set kar sako" },
    { en: "Choose between static, dynamic and sticky secure MAC addresses", hi: "Static, dynamic aur sticky secure MAC addresses mein se sahi choose kar sako" },
    { en: "Predict what the protect, restrict and shutdown violation modes do", hi: "Predict kar sako ki protect, restrict aur shutdown violation modes kya karte hain" },
    { en: "Recover an err-disabled port by hand or with errdisable recovery", hi: "err-disabled port ko haath se ya errdisable recovery se wapas la sako" },
    { en: "Read `show port-security interface` and `show port-security address`", hi: "`show port-security interface` aur `show port-security address` padh sako" },
  ],
  sections: [
    {
      id: "why-lock-a-port",
      heading: { en: "Why lock a switch port?", hi: "Switch port ko lock kyun karein?" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 1.1 you saw that a switch learns every source MAC it receives and never asks whether that device belongs there. On an access port in an open office that leaves three gaps:",
            hi: "Lesson 1.1 mein dekha tha ki switch har aane wale source MAC ko seekh leta hai aur kabhi nahi poochta ki yeh device yahan hona bhi chahiye ya nahi. Open office ke access port par isse teen gaps bante hain:",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Unknown devices**: a visitor or an attacker unplugs a desk PC and plugs in their own laptop. The switch puts it in the PC's VLAN.",
              hi: "**Anjaan devices**: koi visitor ya attacker desk PC ka cable nikaal kar apna laptop laga deta hai. Switch use PC wale VLAN mein daal deta hai.",
            },
            {
              en: "**Extra devices**: someone adds a small unmanaged switch under the desk, and now five devices share one port meant for one PC.",
              hi: "**Extra devices**: koi desk ke neeche chhota unmanaged switch laga deta hai, aur ab ek PC ke liye bana port paanch devices share kar rahe hain.",
            },
            {
              en: "**MAC flooding**: a tool sends thousands of frames per second, each with a fake source MAC. The MAC address table fills up, the switch floods frames for unknown destinations, and the attacker receives traffic meant for others.",
              hi: "**MAC flooding**: ek tool har second hazaaron frames bhejta hai, har ek ka source MAC fake. MAC address table bhar jaati hai, switch unknown destinations wale frames flood karne lagta hai, aur attacker ko doosron ka traffic milne lagta hai.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "Port security counts the source MAC addresses seen on a port. The addresses it allows are called **secure MAC addresses**. When a frame arrives from a new MAC and the port already holds its **maximum** number of secure addresses, that is a **violation**, and the switch reacts in the way you choose.",
            hi: "Port security ek port par dikhe source MAC addresses ko count karti hai. Jin addresses ko woh allow karti hai unhe **secure MAC addresses** kehte hain. Jab kisi naye MAC se frame aaye aur port par pehle se **maximum** secure addresses ho chuke hon, toh woh **violation** hai, aur switch waisa react karta hai jaisa tumne set kiya.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "A guest list at a door with room for one name. The first person through writes their name on it. Anyone else who tries to enter with a different name is stopped, and you decide whether the guard turns them away quietly, turns them away and writes it down, or locks the door for everyone.",
            hi: "Darwaaze par ek guest list hai jisme sirf ek naam ki jagah hai. Pehla aadmi andar jaate hue apna naam likh deta hai. Ab koi doosra naam lekar aaye toh rok diya jaata hai, aur tum decide karte ho ki guard use chupchaap lauta de, lauta kar register mein likh le, ya sabke liye darwaaza hi band kar de.",
          },
        },
      ],
    },
    {
      id: "enable-port-security",
      heading: { en: "Turning port security on", hi: "Port security on karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Port security is off on every port by default. It only works on a port whose mode is set statically, `switchport mode access` or `switchport mode trunk`. A port left in the default dynamic (DTP) mode rejects the command, because its role could change at any time.",
            hi: "By default har port par port security off hoti hai. Yeh sirf us port par chalti hai jiska mode statically set ho, `switchport mode access` ya `switchport mode trunk`. Default dynamic (DTP) mode wala port command reject kar deta hai, kyunki uska role kabhi bhi badal sakta hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Enable port security on PC-A's port", hi: "PC-A ke port par port security enable karo" },
          lines: [
            { prompt: "SW1(config)#", cmd: "interface gigabitethernet0/1" },
            { prompt: "SW1(config-if)#", cmd: "switchport port-security" },
            { out: "Command rejected: GigabitEthernet0/1 is a dynamic port.", comment: { en: "The port is still in a DTP dynamic mode", hi: "Port abhi bhi DTP dynamic mode mein hai" } },
            { prompt: "SW1(config-if)#", cmd: "switchport mode access" },
            { prompt: "SW1(config-if)#", cmd: "switchport access vlan 10" },
            { prompt: "SW1(config-if)#", cmd: "switchport port-security", comment: { en: "Now accepted: max 1 MAC, violation shutdown", hi: "Ab accept hua: max 1 MAC, violation shutdown" } },
            { prompt: "SW1(config-if)#", cmd: "switchport port-security maximum 2", comment: { en: "Optional: allow up to 2 MACs", hi: "Optional: 2 MACs tak allow karo" } },
          ],
        },
        {
          type: "table",
          caption: { en: "Port security defaults", hi: "Port security ke defaults" },
          columns: ["Setting", "Default"],
          rows: [
            [{ en: "Port security", hi: "Port security" }, { en: "Disabled on every port", hi: "Har port par disabled" }],
            [{ en: "Maximum secure MACs", hi: "Maximum secure MACs" }, "1"],
            [{ en: "Violation mode", hi: "Violation mode" }, "shutdown"],
            [{ en: "Sticky learning", hi: "Sticky learning" }, { en: "Off (addresses are learned as dynamic)", hi: "Off (addresses dynamic ki tarah seekhe jaate hain)" }],
            [{ en: "Aging time", hi: "Aging time" }, { en: "0 (secure addresses never age out)", hi: "0 (secure addresses kabhi age out nahi hote)" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The sub-commands alone do nothing", hi: "Sirf sub-commands se kuch nahi hota" },
          text: {
            en: "You can type `switchport port-security maximum 2` or `switchport port-security violation restrict` and IOS stores them, but nothing is enforced until the plain `switchport port-security` command is also on the interface.",
            hi: "`switchport port-security maximum 2` ya `switchport port-security violation restrict` type karoge toh IOS unhe store kar leta hai, lekin jab tak interface par plain `switchport port-security` command bhi nahi hai, kuch enforce nahi hota.",
          },
        },
      ],
    },
    {
      id: "secure-mac-types",
      heading: { en: "Static, dynamic and sticky secure addresses", hi: "Static, dynamic aur sticky secure addresses" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A secure MAC address can get onto a port in three ways. The difference is where it is stored, and so whether it survives the port going down or the switch reloading.",
            hi: "Secure MAC address port par teen tarah se aa sakta hai. Farak yeh hai ki woh kahan store hota hai, aur isliye port down hone ya switch reload hone ke baad bachta hai ya nahi.",
          },
        },
        {
          type: "table",
          columns: ["Type", { en: "How it gets there", hi: "Kaise aata hai" }, { en: "Kept after a reload?", hi: "Reload ke baad rehta hai?" }],
          rows: [
            [
              "Static",
              { en: "You type it: `switchport port-security mac-address 0050.56aa.0011`", hi: "Tum khud type karte ho: `switchport port-security mac-address 0050.56aa.0011`" },
              { en: "Yes, it is in the running config (save it to startup)", hi: "Haan, running config mein hai (startup mein save karo)" },
            ],
            [
              "Dynamic",
              { en: "Learned from the first frames, the default", hi: "Pehle frames se seekha jaata hai, yahi default hai" },
              { en: "No. Kept only in the MAC table; lost when the port goes down", hi: "Nahi. Sirf MAC table mein rehta hai; port down hote hi chala jaata hai" },
            ],
            [
              "Sticky",
              { en: "Learned from traffic, then written into the running config", hi: "Traffic se seekha jaata hai, phir running config mein likh diya jaata hai" },
              { en: "Yes, after `copy running-config startup-config`", hi: "Haan, `copy running-config startup-config` ke baad" },
            ],
          ],
        },
        {
          type: "cli",
          title: { en: "Sticky learning writes the MAC into the config", hi: "Sticky learning MAC ko config mein likh deti hai" },
          lines: [
            { prompt: "SW1(config-if)#", cmd: "switchport port-security mac-address sticky" },
            { prompt: "SW1(config-if)#", cmd: "end" },
            { prompt: "SW1#", cmd: "show running-config interface gigabitethernet0/1" },
            { out: "interface GigabitEthernet0/1" },
            { out: " switchport access vlan 10" },
            { out: " switchport mode access" },
            { out: " switchport port-security" },
            { out: " switchport port-security mac-address sticky" },
            { out: " switchport port-security mac-address sticky 0050.56aa.0011", comment: { en: "Added by the switch when PC-A sent its first frame", hi: "PC-A ke pehle frame par switch ne khud add kiya" } },
          ],
          note: {
            en: "Sticky gives you the convenience of dynamic learning with the permanence of static entries, which is why it is the usual choice for user ports.",
            hi: "Sticky mein dynamic learning jaisa aaram bhi hai aur static entry jaisi permanence bhi, isliye user ports par aam taur par yahi choose kiya jaata hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "You can mix types. With `maximum 3` and one static address, the other two slots are filled by learning (dynamic or sticky). A secure MAC that belongs to one secure port also causes a violation if it appears on another secure port in the same VLAN.",
            hi: "Types mix bhi kar sakte ho. `maximum 3` aur ek static address ho, toh baaki do slots learning se bharte hain (dynamic ya sticky). Ek secure port ka secure MAC agar same VLAN ke kisi doosre secure port par dikhe, toh woh bhi violation hai.",
          },
        },
      ],
    },
    {
      id: "violation-modes",
      heading: { en: "Violation modes: protect, restrict, shutdown", hi: "Violation modes: protect, restrict, shutdown" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The violation mode decides what happens when a frame arrives from a MAC that is not allowed. Set it with `switchport port-security violation {protect | restrict | shutdown}`. In all three modes, frames from the MAC that broke the rule are never forwarded.",
            hi: "Violation mode decide karta hai ki allowed na hone wale MAC se frame aaye toh kya hoga. Ise `switchport port-security violation {protect | restrict | shutdown}` se set karte hain. Teeno modes mein rule todne wale MAC ke frames kabhi forward nahi hote.",
          },
        },
        {
          type: "table",
          caption: { en: "What each mode does on a violation", hi: "Violation par har mode kya karta hai" },
          columns: ["Mode", { en: "Port", hi: "Port" }, { en: "Syslog / SNMP trap", hi: "Syslog / SNMP trap" }, { en: "Violation counter", hi: "Violation counter" }],
          rows: [
            ["protect", { en: "Stays up; known MACs keep working", hi: "Up rehta hai; known MACs chalte rehte hain" }, { en: "No", hi: "Nahi" }, { en: "Not incremented", hi: "Nahi badhta" }],
            ["restrict", { en: "Stays up; known MACs keep working", hi: "Up rehta hai; known MACs chalte rehte hain" }, { en: "Yes", hi: "Haan" }, { en: "Incremented for every violating frame", hi: "Har violating frame par badhta hai" }],
            [
              { en: "shutdown (default)", hi: "shutdown (default)" },
              { en: "err-disabled: link down, all traffic stops, including the legitimate PC", hi: "err-disabled: link down, saara traffic band, legitimate PC ka bhi" },
              { en: "Yes", hi: "Haan" },
              { en: "Incremented by 1, then the port stops receiving", hi: "1 badhta hai, phir port kuch receive hi nahi karta" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Protect drops silently. Restrict drops, logs and counts. Shutdown err-disables the whole port and is the default. In `show port-security interface` a port that is working shows `Port Status : Secure-up`; a port shut by a violation shows `Secure-shutdown`.",
            hi: "Protect chupchaap drop karta hai. Restrict drop karta hai, log karta hai aur count karta hai. Shutdown poora port err-disable kar deta hai aur yahi default hai. `show port-security interface` mein chalta hua port `Port Status : Secure-up` dikhata hai; violation se band port `Secure-shutdown` dikhata hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Choosing a mode", hi: "Mode kaise choose karein" },
          text: {
            en: "Shutdown is the strongest signal: the port goes dark and someone has to look at it. Restrict suits ports where cutting off the real user is worse than the risk, because you still get logs and a counter. Protect leaves no trace, so it is rarely the right choice.",
            hi: "Shutdown sabse strong signal hai: port band ho jaata hai aur kisi ko aakar dekhna padta hai. Restrict un ports ke liye theek hai jahan asli user ko kaat dena risk se zyada nuksaan wala hai, kyunki logs aur counter phir bhi milte hain. Protect koi nishaan nahi chhodta, isliye woh shayad hi kabhi sahi choice hota hai.",
          },
        },
      ],
    },
    {
      id: "err-disabled-recovery",
      heading: { en: "Recovering an err-disabled port", hi: "err-disabled port ko wapas lana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In shutdown mode the first violating frame puts the port into the **err-disabled** state (lesson 1.11). The LED goes off and the console shows messages like these:",
            hi: "Shutdown mode mein pehla violating frame hi port ko **err-disabled** state mein daal deta hai (lesson 1.11). LED off ho jaati hai aur console par aise messages aate hain:",
          },
        },
        {
          type: "cli",
          lines: [
            { out: "%PM-4-ERR_DISABLE: psecure-violation error detected on Gi0/1, putting Gi0/1 in err-disable state" },
            { out: "%PORT_SECURITY-2-PSECURE_VIOLATION: Security violation occurred, caused by MAC address 0050.56aa.0066 on port GigabitEthernet0/1." },
            { out: "%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down" },
            { out: "%LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down" },
          ],
        },
        {
          type: "steps",
          items: [
            {
              en: "Find and remove the cause: unplug the unknown device, or raise the maximum if the extra device is legitimate.",
              hi: "Pehle wajah dhoondho aur hatao: anjaan device nikaalo, ya agar extra device legitimate hai toh maximum badhao.",
            },
            {
              en: "Manual recovery: on the interface enter `shutdown`, then `no shutdown`.",
              hi: "Manual recovery: interface par `shutdown` aur phir `no shutdown` daalo.",
            },
            {
              en: "Automatic recovery: in global config enter `errdisable recovery cause psecure-violation`. The switch re-enables the port after the recovery interval, 300 seconds by default (`errdisable recovery interval <seconds>` changes it).",
              hi: "Automatic recovery: global config mein `errdisable recovery cause psecure-violation` daalo. Recovery interval ke baad switch khud port enable kar deta hai, by default 300 seconds (`errdisable recovery interval <seconds>` se badal sakte ho).",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "Automatic recovery after 180 seconds (output shortened)", hi: "180 seconds baad automatic recovery (output chhota kiya hua)" },
          lines: [
            { prompt: "SW1(config)#", cmd: "errdisable recovery cause psecure-violation" },
            { prompt: "SW1(config)#", cmd: "errdisable recovery interval 180" },
            { prompt: "SW1(config)#", cmd: "end" },
            { prompt: "SW1#", cmd: "show errdisable recovery" },
            { out: "ErrDisable Reason            Timer Status" },
            { out: "-----------------            --------------" },
            { out: "psecure-violation            Enabled" },
            { out: "Timer interval: 180 seconds" },
            { out: "Interfaces that will be enabled at the next timeout:" },
            { out: "Interface       Errdisable reason       Time left(sec)" },
            { out: "---------       -----------------       --------------" },
            { out: "Gi0/1           psecure-violation          142" },
          ],
          note: {
            en: "Errdisable recovery is off for every cause by default. If the unknown device is still plugged in when the timer fires, its next frame err-disables the port again.",
            hi: "By default har cause ke liye errdisable recovery off hoti hai. Timer khatam hone par anjaan device abhi bhi laga hai, toh uska agla frame port ko phir se err-disable kar dega.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Aging** removes secure addresses after a time, so a port can accept a new device without an admin. `switchport port-security aging time 60` sets 60 minutes; `aging type absolute` (the default) removes the address after that time no matter what, and `aging type inactivity` removes it only after 60 minutes with no traffic from it. The default time is 0, meaning no aging. Sticky addresses never age out; remove them by hand.",
            hi: "**Aging** secure addresses ko kuch time baad hata deti hai, taaki port bina admin ke naya device accept kar sake. `switchport port-security aging time 60` se 60 minute set hote hain; `aging type absolute` (default) us time ke baad address hata deta hai chahe kuch bhi ho, aur `aging type inactivity` tabhi hatata hai jab 60 minute tak us MAC se koi traffic na aaye. Default time 0 hai, yaani koi aging nahi. Sticky addresses kabhi age out nahi hote; unhe haath se hatana padta hai.",
          },
        },
      ],
    },
    {
      id: "verify",
      heading: { en: "Verifying port security", hi: "Port security verify karna" },
      blocks: [
        {
          type: "cli",
          title: { en: "One port in detail, after a violation in shutdown mode", hi: "Ek port detail mein, shutdown mode mein violation ke baad" },
          lines: [
            { prompt: "SW1#", cmd: "show port-security interface gigabitethernet0/1" },
            { out: "Port Security              : Enabled" },
            { out: "Port Status                : Secure-shutdown", comment: { en: "err-disabled by a violation", hi: "Violation ki wajah se err-disabled" } },
            { out: "Violation Mode             : Shutdown" },
            { out: "Aging Time                 : 0 mins" },
            { out: "Aging Type                 : Absolute" },
            { out: "SecureStatic Address Aging : Disabled" },
            { out: "Maximum MAC Addresses      : 1" },
            { out: "Total MAC Addresses        : 1" },
            { out: "Configured MAC Addresses   : 0" },
            { out: "Sticky MAC Addresses       : 1" },
            { out: "Last Source Address:Vlan   : 0050.56aa.0066:10", comment: { en: "The MAC that caused the violation, and its VLAN", hi: "Jis MAC ne violation kiya, aur uska VLAN" } },
            { out: "Security Violation Count   : 1" },
          ],
        },
        {
          type: "cli",
          title: { en: "Every secure MAC on the switch", hi: "Switch ke saare secure MACs" },
          lines: [
            { prompt: "SW1#", cmd: "show port-security address" },
            { out: "               Secure Mac Address Table" },
            { out: "-----------------------------------------------------------------------------" },
            { out: "Vlan    Mac Address       Type                          Ports   Remaining Age" },
            { out: "                                                                   (mins)" },
            { out: "----    -----------       ----                          -----   -------------" },
            { out: "  10    0050.56aa.0011    SecureSticky                  Gi0/1        -" },
          ],
          note: {
            en: "`show port-security` with no keyword gives a one-line summary per secure port: maximum, current count, violation count and action.",
            hi: "Bina keyword ke `show port-security` har secure port ki ek line ki summary deta hai: maximum, current count, violation count aur action.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Port security", def: { en: "A switch feature that limits which and how many source MAC addresses may use a port.", hi: "Switch ka feature jo limit karta hai ki ek port ko kaunse aur kitne source MAC addresses use kar sakte hain." } },
    { term: "Secure MAC address", def: { en: "A MAC address that port security allows on a port: static, dynamic or sticky.", hi: "Woh MAC address jise port security ek port par allow karti hai: static, dynamic ya sticky." } },
    { term: "Sticky MAC", def: { en: "A secure MAC learned from traffic and then written into the running config.", hi: "Traffic se seekha gaya secure MAC jo phir running config mein likh diya jaata hai." } },
    { term: "Violation", def: { en: "A frame from a MAC that would exceed the maximum, or a secure MAC seen on another secure port in the same VLAN.", hi: "Aise MAC se frame jo maximum cross kar de, ya ek secure MAC jo same VLAN ke doosre secure port par dikhe." } },
    { term: "err-disabled", def: { en: "A state where the switch has shut a port itself after detecting a problem.", hi: "Woh state jisme switch ne problem pakad kar port ko khud band kar diya ho." } },
    { term: "Errdisable recovery", def: { en: "A timer that re-enables err-disabled ports for chosen causes; off by default, 300 s interval.", hi: "Timer jo chune hue causes ke liye err-disabled ports ko wapas enable karta hai; default off, interval 300 s." } },
    { term: "MAC flooding", def: { en: "An attack that fills the MAC address table with fake source MACs so the switch floods traffic.", hi: "Attack jisme fake source MACs se MAC address table bhar di jaati hai taaki switch traffic flood kare." } },
  ],
  commands: [
    { cmd: "switchport mode access", mode: "Interface config", does: { en: "Make the port a static access port (required before port security)", hi: "Port ko static access port banata hai (port security se pehle zaroori)" } },
    { cmd: "switchport port-security", mode: "Interface config", does: { en: "Enable port security on the port", hi: "Port par port security enable karta hai" } },
    { cmd: "switchport port-security maximum <n>", mode: "Interface config", does: { en: "Set how many secure MACs the port allows (default 1)", hi: "Port kitne secure MACs allow kare, yeh set karta hai (default 1)" } },
    { cmd: "switchport port-security mac-address <mac>", mode: "Interface config", does: { en: "Add a static secure MAC", hi: "Static secure MAC add karta hai" } },
    { cmd: "switchport port-security mac-address sticky", mode: "Interface config", does: { en: "Learn MACs as sticky and save them in the running config", hi: "MACs ko sticky ki tarah seekhta hai aur running config mein save karta hai" } },
    { cmd: "switchport port-security violation {protect | restrict | shutdown}", mode: "Interface config", does: { en: "Choose the violation mode (default shutdown)", hi: "Violation mode choose karta hai (default shutdown)" } },
    { cmd: "switchport port-security aging time <minutes>", mode: "Interface config", does: { en: "Age out dynamic secure MACs after this time", hi: "Itne time baad dynamic secure MACs ko age out karta hai" } },
    { cmd: "errdisable recovery cause psecure-violation", mode: "Global config", does: { en: "Re-enable ports err-disabled by port security automatically", hi: "Port security se err-disabled ports ko automatically wapas enable karta hai" } },
    { cmd: "errdisable recovery interval <seconds>", mode: "Global config", does: { en: "Set the recovery timer (default 300 s)", hi: "Recovery timer set karta hai (default 300 s)" } },
    { cmd: "show port-security interface <if>", mode: "Privileged EXEC", does: { en: "Show status, mode, counts and the last violating MAC for one port", hi: "Ek port ka status, mode, counts aur last violating MAC dikhata hai" } },
    { cmd: "show port-security address", mode: "Privileged EXEC", does: { en: "List all secure MACs with type and port", hi: "Saare secure MACs type aur port ke saath dikhata hai" } },
    { cmd: "show port-security", mode: "Privileged EXEC", does: { en: "One-line summary per secure port", hi: "Har secure port ki ek line summary" } },
  ],
  mistakes: [
    {
      en: "Entering `switchport port-security` on a port still in a dynamic DTP mode. IOS rejects it; set `switchport mode access` (or `trunk`) first.",
      hi: "Dynamic DTP mode wale port par `switchport port-security` daalna. IOS reject kar deta hai; pehle `switchport mode access` (ya `trunk`) set karo.",
    },
    {
      en: "Configuring `maximum` and `violation` but never the plain `switchport port-security` command. The settings sit in the config and nothing is enforced.",
      hi: "`maximum` aur `violation` configure kar dena lekin plain `switchport port-security` command bhool jaana. Settings config mein padi rehti hain aur kuch enforce nahi hota.",
    },
    {
      en: "Saying protect mode logs the violation. Protect drops silently; restrict is the mode that drops, logs and increments the counter.",
      hi: "Bolna ki protect mode violation log karta hai. Protect chupchaap drop karta hai; drop, log aur counter badhana restrict mode karta hai.",
    },
    {
      en: "Expecting sticky MACs to survive a reload without saving. They are in the running config only until you copy it to startup.",
      hi: "Expect karna ki sticky MACs bina save kiye reload ke baad bhi rahenge. Woh tab tak sirf running config mein hain jab tak startup mein copy na karo.",
    },
    {
      en: "Typing only `no shutdown` on an err-disabled port, or bouncing it while the unknown device is still connected. Use `shutdown` then `no shutdown`, after removing the cause.",
      hi: "err-disabled port par sirf `no shutdown` daalna, ya anjaan device lage rehte hue port bounce karna. Wajah hatao, phir `shutdown` aur `no shutdown` karo.",
    },
    {
      en: "Assuming err-disabled ports come back by themselves. Errdisable recovery is off by default; once you enable a cause, the default interval is 300 seconds.",
      hi: "Maan lena ki err-disabled ports khud wapas aa jaate hain. Errdisable recovery by default off hai; cause enable karne ke baad default interval 300 seconds hai.",
    },
  ],
  recap: [
    { en: "Port security limits the source MACs on a port; the port must be static access or trunk.", hi: "Port security port par source MACs limit karti hai; port static access ya trunk hona chahiye." },
    { en: "Defaults once enabled: maximum 1, violation shutdown, dynamic learning, no aging.", hi: "Enable karne ke baad defaults: maximum 1, violation shutdown, dynamic learning, koi aging nahi." },
    { en: "Sticky MACs are learned automatically and written to the running config; save to keep them.", hi: "Sticky MACs automatically seekhe jaate hain aur running config mein likhe jaate hain; rakhne ke liye save karo." },
    { en: "Protect = drop silently. Restrict = drop, log, count. Shutdown = err-disable the port.", hi: "Protect sirf chupchaap drop karta hai. Restrict drop, log aur count karta hai. Shutdown poora port err-disable kar deta hai." },
    { en: "Recover with `shutdown` / `no shutdown`, or `errdisable recovery cause psecure-violation` (300 s default).", hi: "`shutdown` / `no shutdown` se recover karo, ya `errdisable recovery cause psecure-violation` se (default 300 s)." },
    { en: "`show port-security interface` shows Secure-up or Secure-shutdown, counts and the last source MAC.", hi: "`show port-security interface` Secure-up ya Secure-shutdown, counts aur last source MAC dikhata hai." },
  ],
  quiz: [
    {
      q: { en: "You enter only `switchport mode access` and `switchport port-security` on Gi0/5. What happens when a second device starts sending frames on that port?", hi: "Gi0/5 par tumne sirf `switchport mode access` aur `switchport port-security` daala hai. Us port par doosra device frames bhejna shuru kare toh kya hoga?" },
      options: [
        { en: "Its frames are dropped silently and the port stays up", hi: "Uske frames chupchaap drop honge aur port up rahega" },
        { en: "Its frames are dropped, a syslog message is sent and the port stays up", hi: "Uske frames drop honge, syslog message jaayega aur port up rahega" },
        { en: "The port goes err-disabled", hi: "Port err-disabled ho jaayega" },
        { en: "Nothing, because the default maximum is 2", hi: "Kuch nahi, kyunki default maximum 2 hai" },
      ],
      answer: 2,
      explain: {
        en: "The defaults are maximum 1 and violation mode shutdown. The first device uses the one slot, so the second device's first frame is a violation and the port is err-disabled.",
        hi: "Defaults hain maximum 1 aur violation mode shutdown. Pehla device ek slot le leta hai, isliye doosre device ka pehla frame hi violation hai aur port err-disabled ho jaata hai.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which violation mode drops frames from the unknown MAC, sends a syslog message and increments the violation counter, but leaves the port up?", hi: "Kaunsa violation mode unknown MAC ke frames drop karta hai, syslog message bhejta hai aur violation counter badhata hai, lekin port up rakhta hai?" },
      options: [
        { en: "restrict", hi: "restrict" },
        { en: "protect", hi: "protect" },
        { en: "shutdown", hi: "shutdown" },
        { en: "shutdown vlan", hi: "shutdown vlan" },
      ],
      answer: 0,
      explain: {
        en: "Restrict drops, logs and counts. Protect also keeps the port up but logs nothing and does not count. Shutdown err-disables the port.",
        hi: "Restrict drop karta hai, log karta hai aur count karta hai. Protect bhi port up rakhta hai lekin na log karta hai na count. Shutdown port err-disable kar deta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "`show port-security interface gi0/1` shows `Port Status : Secure-shutdown`, `Security Violation Count : 1` and `Last Source Address:Vlan : 0050.56aa.0066:10`. What is true?",
        hi: "`show port-security interface gi0/1` mein `Port Status : Secure-shutdown`, `Security Violation Count : 1` aur `Last Source Address:Vlan : 0050.56aa.0066:10` dikhta hai. Kya sahi hai?",
      },
      options: [
        { en: "The port is up and is dropping only 0050.56aa.0066", hi: "Port up hai aur sirf 0050.56aa.0066 ko drop kar raha hai" },
        { en: "0050.56aa.0066 is now a sticky secure address on Gi0/1", hi: "0050.56aa.0066 ab Gi0/1 par sticky secure address hai" },
        { en: "The administrator shut the port with the `shutdown` command", hi: "Administrator ne `shutdown` command se port band kiya hai" },
        { en: "A frame from 0050.56aa.0066 in VLAN 10 caused a violation and the port is err-disabled", hi: "VLAN 10 mein 0050.56aa.0066 ke frame ne violation kiya aur port err-disabled hai" },
      ],
      answer: 3,
      explain: {
        en: "Secure-shutdown means port security err-disabled the port. The last source address field names the MAC and VLAN of the frame that triggered it. That MAC was rejected, so it is not a secure address.",
        hi: "Secure-shutdown ka matlab port security ne port err-disable kiya hai. Last source address field us frame ka MAC aur VLAN batata hai jisne violation trigger kiya. Woh MAC reject hua tha, isliye woh secure address nahi hai.",
      },
      kind: "cli",
    },
    {
      q: { en: "Which command makes the switch learn MAC addresses automatically and add them to the running configuration?", hi: "Kaunsa command switch ko MAC addresses automatically seekhne aur running configuration mein add karne deta hai?" },
      options: [
        { en: "switchport port-security maximum 1", hi: "switchport port-security maximum 1" },
        { en: "switchport port-security mac-address sticky", hi: "switchport port-security mac-address sticky" },
        { en: "switchport port-security mac-address 0050.56aa.0011", hi: "switchport port-security mac-address 0050.56aa.0011" },
        { en: "switchport port-security aging type inactivity", hi: "switchport port-security aging type inactivity" },
      ],
      answer: 1,
      explain: {
        en: "Sticky learning turns learned addresses into `switchport port-security mac-address sticky <mac>` lines in the running config. Typing a MAC by hand makes a static entry, which is not learned.",
        hi: "Sticky learning seekhe gaye addresses ko running config mein `switchport port-security mac-address sticky <mac>` lines bana deti hai. MAC haath se type karna static entry banata hai, jo seekhi nahi jaati.",
      },
      kind: "cli",
    },
    {
      q: { en: "You configure `errdisable recovery cause psecure-violation` and nothing else. A port is err-disabled by port security. When does the switch try to re-enable it?", hi: "Tumne sirf `errdisable recovery cause psecure-violation` configure kiya. Port security ne ek port err-disable kar diya. Switch use kab wapas enable karne ki koshish karega?" },
      options: [
        { en: "Immediately", hi: "Turant" },
        { en: "After 30 seconds", hi: "30 seconds baad" },
        { en: "After 300 seconds", hi: "300 seconds baad" },
        { en: "Never, until someone enters shutdown and no shutdown", hi: "Kabhi nahi, jab tak koi shutdown aur no shutdown na kare" },
      ],
      answer: 2,
      explain: {
        en: "Once a cause is enabled for errdisable recovery, the default interval is 300 seconds. Without the recovery command it would stay err-disabled until manual recovery.",
        hi: "Errdisable recovery ke liye cause enable hone ke baad default interval 300 seconds hai. Recovery command na ho toh port manual recovery tak err-disabled hi rehta.",
      },
      kind: "concept",
    },
    {
      q: { en: "`switchport port-security` on Gi0/7 returns `Command rejected: GigabitEthernet0/7 is a dynamic port.` What fixes it?", hi: "Gi0/7 par `switchport port-security` daalne par `Command rejected: GigabitEthernet0/7 is a dynamic port.` aata hai. Isse kya fix hoga?" },
      options: [
        { en: "`switchport port-security maximum 1`", hi: "`switchport port-security maximum 1`" },
        { en: "`switchport mode access`", hi: "`switchport mode access`" },
        { en: "`no shutdown`", hi: "`no shutdown`" },
        { en: "`switchport mode dynamic desirable`", hi: "`switchport mode dynamic desirable`" },
      ],
      answer: 1,
      explain: {
        en: "Port security needs a port whose mode is fixed. `switchport mode access` sets it statically, and then `switchport port-security` is accepted. Dynamic desirable is still a DTP dynamic mode.",
        hi: "Port security ko aisa port chahiye jiska mode fixed ho. `switchport mode access` use statically set karta hai, phir `switchport port-security` accept ho jaata hai. Dynamic desirable abhi bhi DTP dynamic mode hi hai.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "sHN3jOJIido",
      title: "Free CCNA | Port Security | Day 49",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The full topic: secure MACs, violation modes, err-disabled recovery and sticky learning.", hi: "Poora topic: secure MACs, violation modes, err-disabled recovery aur sticky learning." },
    },
    {
      id: "zZwhrxKeGj8",
      title: "Free CCNA | Port Security | Day 49 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Packet Tracer lab to practise the commands from this lesson.", hi: "Is lesson ke commands practise karne ke liye Packet Tracer lab." },
    },
    {
      id: "IbSt7wNTQK4",
      title: "135. Free CCNA (NEW) | Network Security - Switch Port Security | CCNA 200-301 Full Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Port security theory and configuration in Hindi.", hi: "Port security ki theory aur configuration Hindi mein." },
    },
    {
      id: "o0BlwEsr9LQ",
      title: "Port Security Explained in Hindi | Cisco Switch Port Security | CCNA 200-301 Full Tutorial",
      channel: "JagvinderThind",
      lang: "hi",
      note: { en: "A short Hindi explanation of port security, good for quick revision.", hi: "Port security ka chhota Hindi explanation, jaldi revision ke liye accha." },
    },
  ],
  lab: {
    title: { en: "Trigger and recover a port security violation", hi: "Port security violation trigger karo aur recover karo" },
    steps: [
      { en: "In Packet Tracer connect PC-A (192.168.10.11/24) to SW1 Gi0/1 in VLAN 10 and a server (192.168.10.50/24) to Gi0/2.", hi: "Packet Tracer mein PC-A (192.168.10.11/24) ko SW1 Gi0/1 par VLAN 10 mein aur ek server (192.168.10.50/24) ko Gi0/2 par lagao." },
      { en: "On Gi0/1 configure `switchport mode access`, `switchport port-security` and `switchport port-security mac-address sticky`. Ping the server from PC-A, then check `show port-security address` and the running config.", hi: "Gi0/1 par `switchport mode access`, `switchport port-security` aur `switchport port-security mac-address sticky` configure karo. PC-A se server ping karo, phir `show port-security address` aur running config check karo." },
      { en: "Replace PC-A with another PC (same IP, different MAC) and ping. Watch the port go err-disabled and read `show port-security interface gi0/1`.", hi: "PC-A ki jagah doosra PC lagao (same IP, alag MAC) aur ping karo. Port ko err-disabled hote dekho aur `show port-security interface gi0/1` padho." },
      { en: "Put PC-A back and recover the port with `shutdown` and `no shutdown`.", hi: "PC-A wapas lagao aur `shutdown` aur `no shutdown` se port recover karo." },
      { en: "Change to `switchport port-security violation restrict`, repeat the swap, and compare the violation counter and port status.", hi: "`switchport port-security violation restrict` par badlo, swap dobara karo, aur violation counter aur port status compare karo." },
    ],
  },
};

export default lesson;
