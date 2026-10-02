import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "snmp",
  intro: {
    en: "A network of 200 routers and switches cannot be watched by logging in to each one and typing show commands. SNMP lets one central server read counters and status from every device, change a few settings, and receive an alert the moment something fails. It is how monitoring tools draw bandwidth graphs and turn a dead link red on the NOC screen.",
    hi: "200 routers aur switches wale network ko har device par login karke show commands chala kar monitor nahi kiya ja sakta. SNMP ek central server ko har device se counters aur status padhne, kuch settings badalne, aur kuch fail hote hi alert receive karne deta hai. Monitoring tools isi se bandwidth graphs banate hain aur NOC screen par dead link ko red karte hain.",
  },
  outcomes: [
    { en: "Describe the roles of the SNMP manager (NMS), the agent and the MIB, and read an OID", hi: "SNMP manager (NMS), agent aur MIB ka role describe kar sako, aur OID padh sako" },
    { en: "Name each SNMP message type, who sends it, and which UDP port it uses", hi: "Har SNMP message type ka naam, use kaun bhejta hai, aur woh kaunsa UDP port use karta hai, bata sako" },
    { en: "Explain why an Inform is more reliable than a Trap", hi: "Samjha sako ki Inform, Trap se zyada reliable kyun hai" },
    { en: "Compare SNMPv1, v2c and v3, including the three v3 security levels", hi: "SNMPv1, v2c aur v3 compare kar sako, v3 ke teen security levels ke saath" },
    { en: "Configure SNMPv2c communities, a trap destination and traps on a Cisco router", hi: "Cisco router par SNMPv2c communities, trap destination aur traps configure kar sako" },
  ],
  sections: [
    {
      id: "why-snmp",
      heading: { en: "Why SNMP exists", hi: "SNMP kyun bana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every device already knows a lot about itself: interface states, traffic counters, CPU load, uptime, its name and location. **SNMP (Simple Network Management Protocol)** is a standard way for a central server to read that information, sometimes change it, and be told when something important happens.",
            hi: "Har device apne baare mein pehle se bahut kuch jaanta hai: interface states, traffic counters, CPU load, uptime, apna naam aur location. **SNMP (Simple Network Management Protocol)** ek standard tareeka hai jisse central server yeh information padh sake, kabhi-kabhi badal sake, aur kuch important hone par use bataya jaaye.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Monitoring**: poll every interface counter every few minutes and draw utilisation graphs.",
              hi: "**Monitoring**: har interface counter ko har kuch minute mein poll karo aur utilisation graphs banao.",
            },
            {
              en: "**Alerting**: a device reports a link failure, a reboot or a high temperature on its own, without waiting to be asked.",
              hi: "**Alerting**: device link failure, reboot ya high temperature khud report karta hai, poochne ka wait nahi karta.",
            },
            {
              en: "**Limited configuration**: change values such as an interface's admin state or the device's location string.",
              hi: "**Limited configuration**: interface ki admin state ya device ki location string jaisi values badalna.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "In this lesson the NMS is a server at `10.1.1.50`. It manages router R1 (`10.1.1.1`) and switch SW1 (`10.1.1.2`). The same server will receive syslog messages in the next lesson.",
            hi: "Is lesson mein NMS ek server hai, `10.1.1.50` par. Yeh router R1 (`10.1.1.1`) aur switch SW1 (`10.1.1.2`) ko manage karta hai. Agle lesson mein yahi server syslog messages bhi receive karega.",
          },
        },
      ],
    },
    {
      id: "manager-agent-mib",
      heading: { en: "Managers, agents and the MIB", hi: "Managers, agents aur MIB" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**SNMP manager**: software on the **NMS (Network Management Station)** that polls devices and receives their notifications. SolarWinds, PRTG, Zabbix and LibreNMS are examples.",
              hi: "**SNMP manager**: **NMS (Network Management Station)** par chalne wala software jo devices ko poll karta hai aur unke notifications receive karta hai. SolarWinds, PRTG, Zabbix aur LibreNMS iske examples hain.",
            },
            {
              en: "**SNMP agent**: software running on each managed device (router, switch, firewall, server, printer). It answers the manager's requests and sends notifications.",
              hi: "**SNMP agent**: har managed device (router, switch, firewall, server, printer) par chalne wala software. Yeh manager ki requests ka jawab deta hai aur notifications bhejta hai.",
            },
            {
              en: "**MIB (Management Information Base)**: the structure of all the variables an agent can report or change. Each variable is identified by an **OID (Object Identifier)**.",
              hi: "**MIB (Management Information Base)**: un saare variables ka structure jo agent report kar sakta hai ya badal sakta hai. Har variable ki pehchaan ek **OID (Object Identifier)** se hoti hai.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "OIDs form a tree, written as numbers separated by dots. `1.3.6.1.2.1.1.5.0` reads as iso(1) . org(3) . dod(6) . internet(1) . mgmt(2) . mib-2(1) . system(1) . sysName(5), and the final `.0` means the single instance of that object. Standard objects live under mib-2; vendors add their own under `1.3.6.1.4.1`, where Cisco's branch is `1.3.6.1.4.1.9`.",
            hi: "OIDs ek tree banate hain, aur dots se alag kiye numbers ki tarah likhe jaate hain. `1.3.6.1.2.1.1.5.0` ko aise padho: iso(1) . org(3) . dod(6) . internet(1) . mgmt(2) . mib-2(1) . system(1) . sysName(5), aur aakhri `.0` ka matlab us object ka ek hi instance. Standard objects mib-2 ke neeche hote hain; vendors apne objects `1.3.6.1.4.1` ke neeche add karte hain, jahan Cisco ki branch `1.3.6.1.4.1.9` hai.",
          },
        },
        {
          type: "table",
          caption: { en: "A few objects the NMS reads from R1", hi: "Kuch objects jo NMS R1 se padhta hai" },
          columns: ["Object", "OID", { en: "Example value", hi: "Example value" }],
          rows: [
            ["sysUpTime.0", "1.3.6.1.2.1.1.3.0", { en: "27648200 hundredths of a second (3 days 04:48:02)", hi: "27648200, 1/100 second ki units mein (3 days 04:48:02)" }],
            ["sysName.0", "1.3.6.1.2.1.1.5.0", "R1"],
            ["sysLocation.0", "1.3.6.1.2.1.1.6.0", "Mumbai DC rack 4"],
            ["ifDescr.2", "1.3.6.1.2.1.2.2.1.2.2", "GigabitEthernet0/1"],
            ["ifOperStatus.2", "1.3.6.1.2.1.2.2.1.8.2", "up(1)"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Interface objects end with the interface's **ifIndex**, a number the device assigns to each interface. On R1, Gi0/1 has ifIndex 2, so its state is `ifOperStatus.2`. Nobody types these numbers by hand; the NMS loads MIB files and shows names.",
            hi: "Interface objects ke end mein interface ka **ifIndex** hota hai, ek number jo device har interface ko deta hai. R1 par Gi0/1 ka ifIndex 2 hai, isliye uski state `ifOperStatus.2` hai. Yeh numbers koi haath se type nahi karta; NMS MIB files load karke names dikhata hai.",
          },
        },
      ],
    },
    {
      id: "messages",
      heading: { en: "Messages: read, write, notify", hi: "Messages: read, write, notify" },
      blocks: [
        {
          type: "table",
          caption: { en: "SNMP message types", hi: "SNMP message types" },
          columns: ["Message", { en: "Sent from → to", hi: "Kaun → kise" }, { en: "Purpose", hi: "Kaam" }, { en: "Since", hi: "Kab se" }],
          rows: [
            ["Get", "Manager → agent", { en: "Read the value of specific OIDs", hi: "Specific OIDs ki value padhna" }, "v1"],
            ["GetNext", "Manager → agent", { en: "Read the next OID in the tree; repeated, it walks a table", hi: "Tree ka agla OID padhna; baar-baar karo toh poori table walk ho jaati hai" }, "v1"],
            ["GetBulk", "Manager → agent", { en: "Read many next OIDs in one request", hi: "Ek hi request mein bahut saare agle OIDs padhna" }, "v2c"],
            ["Set", "Manager → agent", { en: "Change the value of an OID", hi: "Kisi OID ki value badalna" }, "v1"],
            ["Response", { en: "Agent → manager (and manager → agent for an Inform)", hi: "Agent → manager (aur Inform ke liye manager → agent)" }, { en: "Answer to Get, GetNext, GetBulk or Set; acknowledgment of an Inform", hi: "Get, GetNext, GetBulk ya Set ka jawab; Inform ka acknowledgment" }, { en: "v1 (called GetResponse there)", hi: "v1 (wahan naam GetResponse tha)" }],
            ["Trap", "Agent → manager", { en: "Unrequested notification; never acknowledged", hi: "Bina maange notification; kabhi acknowledge nahi hota" }, "v1"],
            ["Inform", "Agent → manager", { en: "Notification that the manager acknowledges; resent if no acknowledgment arrives", hi: "Aisa notification jise manager acknowledge karta hai; acknowledgment na aaye toh dobara bheja jaata hai" }, "v2c"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Group them the way the exam does. **Read**: Get, GetNext, GetBulk. **Write**: Set. **Notification**: Trap, Inform. **Response** answers the others.",
            hi: "Inhe waise group karo jaise exam karta hai. **Read**: Get, GetNext, GetBulk. **Write**: Set. **Notification**: Trap, Inform. **Response** baaki sab ka jawab hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point: Trap vs Inform", hi: "Exam point: Trap vs Inform" },
          text: {
            en: "Both are sent by the agent without being asked. A **Trap** is fire-and-forget: if it is lost, nobody knows. An **Inform** is acknowledged by the manager with a Response, and the agent resends it until it is acknowledged or its retries run out. Informs need SNMPv2c or v3.",
            hi: "Dono agent bina pooche bhejta hai. **Trap** fire-and-forget hai: kho gaya toh kisi ko pata nahi chalta. **Inform** ko manager Response se acknowledge karta hai, aur agent use tab tak dobara bhejta hai jab tak acknowledgment na aa jaaye ya retries khatam na ho jaayein. Informs ke liye SNMPv2c ya v3 chahiye.",
          },
        },
      ],
    },
    {
      id: "ports-and-directions",
      heading: { en: "Two directions, two UDP ports", hi: "Do directions, do UDP ports" },
      blocks: [
        {
          type: "p",
          text: {
            en: "SNMP runs over **UDP**, because each exchange is one small request and one small reply. Which port depends on who is listening:",
            hi: "SNMP **UDP** par chalta hai, kyunki har exchange ek chhoti request aur ek chhota reply hai. Port is baat par depend karta hai ki kaun sun raha hai:",
          },
        },
        {
          type: "table",
          columns: [{ en: "Traffic", hi: "Traffic" }, { en: "Listener", hi: "Kaun sunta hai" }, "Port"],
          rows: [
            [{ en: "Get, GetNext, GetBulk, Set (requests from the manager)", hi: "Get, GetNext, GetBulk, Set (manager ki requests)" }, { en: "Agent on the device", hi: "Device par agent" }, "UDP 161"],
            [{ en: "Trap and Inform (notifications)", hi: "Trap aur Inform (notifications)" }, { en: "Manager on the NMS", hi: "NMS par manager" }, "UDP 162"],
          ],
        },
        {
          type: "p",
          text: {
            en: "Polling and notifications complement each other. Polling every 5 minutes gives steady graphs but can miss a failure for up to 5 minutes. A Trap arrives within a second but can be lost. Real NMS setups use both: poll for counters, and receive Traps or Informs for events.",
            hi: "Polling aur notifications ek doosre ki kami poori karte hain. Har 5 minute ki polling se steady graphs milte hain, lekin failure 5 minute tak miss ho sakta hai. Trap ek second mein aa jaata hai, lekin kho bhi sakta hai. Asli NMS setups dono use karte hain: counters ke liye poll, aur events ke liye Traps ya Informs.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Why not always use Informs?", hi: "Hamesha Informs kyun nahi?" },
          text: {
            en: "An Inform costs more: the device must keep each one in memory until it is acknowledged, and it sends extra packets for retries. For a few critical events that cost is worth it; for a flood of routine notifications, Traps are lighter.",
            hi: "Inform mehnga padta hai: device ko har Inform acknowledgment aane tak memory mein rakhna padta hai, aur retries ke liye extra packets bhejne padte hain. Kuch critical events ke liye yeh cost theek hai; routine notifications ki baadh ke liye Traps halke padte hain.",
          },
        },
      ],
    },
    {
      id: "versions",
      heading: { en: "SNMP versions and security", hi: "SNMP versions aur security" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Version", hi: "Version" }, { en: "How access is controlled", hi: "Access kaise control hota hai" }, { en: "What it added", hi: "Isme naya kya aaya" }],
          rows: [
            ["SNMPv1", { en: "Community string, sent in clear text", hi: "Community string, clear text mein jaati hai" }, { en: "The original: Get, GetNext, Set, Trap", hi: "Original version: Get, GetNext, Set, Trap" }],
            ["SNMPv2c", { en: "Community string, sent in clear text (the c means community)", hi: "Community string, clear text mein (c ka matlab community)" }, { en: "GetBulk, Inform, 64-bit counters", hi: "GetBulk, Inform, 64-bit counters" }],
            ["SNMPv3", { en: "Usernames and groups, with optional authentication and encryption", hi: "Usernames aur groups, optional authentication aur encryption ke saath" }, { en: "Message integrity, authentication, encryption", hi: "Message integrity, authentication, encryption" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "A **community string** works like a shared password. A device usually has a **read-only (RO)** community, which allows Get, GetNext and GetBulk, and sometimes a **read-write (RW)** community, which also allows Set. Because v1 and v2c send it in clear text inside every packet, anyone who can capture traffic between the NMS and the device can read it, and with the RW string they can change the device.",
            hi: "**Community string** ek shared password jaisi hai. Device par aam taur par ek **read-only (RO)** community hoti hai, jo Get, GetNext aur GetBulk allow karti hai, aur kabhi-kabhi ek **read-write (RW)** community, jo Set bhi allow karti hai. v1 aur v2c ise har packet mein clear text mein bhejte hain, isliye NMS aur device ke beech traffic capture karne wala koi bhi ise padh sakta hai, aur RW string mil gayi toh device badal bhi sakta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "SNMPv3 security levels", hi: "SNMPv3 security levels" },
          columns: [{ en: "Level", hi: "Level" }, { en: "Authentication", hi: "Authentication" }, { en: "Encryption", hi: "Encryption" }],
          rows: [
            ["noAuthNoPriv", { en: "Username only, no hash", hi: "Sirf username, koi hash nahi" }, { en: "No", hi: "Nahi" }],
            ["authNoPriv", { en: "Yes, a hash such as SHA proves sender and integrity", hi: "Haan, SHA jaisa hash sender aur integrity prove karta hai" }, { en: "No", hi: "Nahi" }],
            ["authPriv", { en: "Yes", hi: "Haan" }, { en: "Yes, for example AES", hi: "Haan, jaise AES" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Which version to use", hi: "Kaunsa version use karein" },
          text: {
            en: "SNMPv3 with **authPriv** is the recommended choice: each message is authenticated, checked for tampering and encrypted. In the names, **auth** means authentication and **priv** means privacy, which is encryption.",
            hi: "Recommended choice hai SNMPv3 **authPriv** ke saath: har message authenticate hota hai, tampering ke liye check hota hai aur encrypt hota hai. Naamon mein **auth** ka matlab authentication aur **priv** ka matlab privacy, yaani encryption.",
          },
        },
      ],
    },
    {
      id: "configure",
      heading: { en: "Configuring SNMP on IOS", hi: "IOS par SNMP configure karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "For the CCNA you need the SNMPv2c commands. The community names below are examples; never use well-known values such as `public` or `private`, which many devices once shipped with.",
            hi: "CCNA ke liye SNMPv2c commands aane chahiye. Neeche ke community names sirf examples hain; `public` ya `private` jaise well-known values kabhi use mat karo, bahut se devices pehle inhi ke saath aate the.",
          },
        },
        {
          type: "cli",
          title: { en: "SNMPv2c on R1", hi: "R1 par SNMPv2c" },
          lines: [
            { prompt: "R1(config)#", cmd: "snmp-server contact noc@example.com", comment: { en: "Fills sysContact.0", hi: "sysContact.0 bharta hai" } },
            { prompt: "R1(config)#", cmd: "snmp-server location Mumbai DC rack 4", comment: { en: "Fills sysLocation.0", hi: "sysLocation.0 bharta hai" } },
            { prompt: "R1(config)#", cmd: "snmp-server community NOCread99 RO", comment: { en: "Read-only: Get, GetNext, GetBulk", hi: "Read-only: Get, GetNext, GetBulk" } },
            { prompt: "R1(config)#", cmd: "snmp-server community NOCwrite99 RW", comment: { en: "Read-write: also allows Set", hi: "Read-write: Set bhi allow karta hai" } },
            { prompt: "R1(config)#", cmd: "snmp-server host 10.1.1.50 version 2c NOCread99", comment: { en: "Send Traps to the NMS, using this community", hi: "NMS ko Traps bhejo, is community ke saath" } },
            { prompt: "R1(config)#", cmd: "snmp-server enable traps", comment: { en: "Turn on the trap types (with no keywords, all that this IOS supports)", hi: "Trap types on karo (bina keywords ke, woh saare jo yeh IOS support karta hai)" } },
          ],
          note: {
            en: "Add the keyword `informs` to send Informs instead of Traps: `snmp-server host 10.1.1.50 informs version 2c NOCread99`. If you leave out `RO` or `RW`, the community is read-only.",
            hi: "Traps ki jagah Informs bhejne ke liye `informs` keyword add karo: `snmp-server host 10.1.1.50 informs version 2c NOCread99`. `RO` ya `RW` chhod do toh community read-only banti hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Check the notification destination", hi: "Notification destination check karo" },
          lines: [
            { prompt: "R1#", cmd: "show snmp host" },
            { out: "Notification host: 10.1.1.50   udp-port: 162   type: trap", comment: { en: "Traps go to UDP 162 on the NMS", hi: "Traps NMS ke UDP 162 par jaate hain" } },
            { out: "user: NOCread99   security model: v2c" },
          ],
        },
        {
          type: "cli",
          title: { en: "The SNMPv3 equivalent (beyond the CCNA config scope)", hi: "SNMPv3 wala tareeka (CCNA config scope se aage)" },
          lines: [
            { prompt: "R1(config)#", cmd: "snmp-server group NOC-ADMINS v3 priv", comment: { en: "Group requiring authPriv", hi: "Group jisme authPriv zaroori hai" } },
            { prompt: "R1(config)#", cmd: "snmp-server user nms1 NOC-ADMINS v3 auth sha Auth-Pass-2026 priv aes 128 Priv-Pass-2026" },
            { prompt: "R1(config)#", cmd: "snmp-server host 10.1.1.50 version 3 priv nms1" },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Limit who can poll", hi: "Kaun poll kar sakta hai, yeh limit karo" },
          text: {
            en: "A community string alone lets any IP address that knows it query the device. You can add a standard ACL number to the end of `snmp-server community` so only the NMS at 10.1.1.50 is accepted. ACLs come in lesson 5.4.",
            hi: "Sirf community string se toh koi bhi IP address jo use jaanta hai, device ko query kar sakta hai. `snmp-server community` ke end mein standard ACL number laga sakte ho, taaki sirf 10.1.1.50 wala NMS accept ho. ACLs lesson 5.4 mein aayenge.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "NMS", def: { en: "Network Management Station: the server running the SNMP manager software.", hi: "Network Management Station: woh server jis par SNMP manager software chalta hai." } },
    { term: "SNMP agent", def: { en: "Software on a managed device that answers SNMP requests and sends notifications.", hi: "Managed device par chalne wala software jo SNMP requests ka jawab deta hai aur notifications bhejta hai." } },
    { term: "MIB", def: { en: "Management Information Base: the structured set of variables an agent exposes.", hi: "Management Information Base: variables ka structured set jo agent expose karta hai." } },
    { term: "OID", def: { en: "Object Identifier: a dotted number that names one variable in the MIB tree, such as 1.3.6.1.2.1.1.5.0 for sysName.", hi: "Object Identifier: dotted number jo MIB tree mein ek variable ko naam deta hai, jaise sysName ke liye 1.3.6.1.2.1.1.5.0." } },
    { term: "Community string", def: { en: "The shared password of SNMPv1 and v2c, sent in clear text, with read-only or read-write access.", hi: "SNMPv1 aur v2c ka shared password, clear text mein jaata hai, read-only ya read-write access ke saath." } },
    { term: "Trap", def: { en: "An unacknowledged notification sent by an agent to the manager on UDP 162.", hi: "Agent ka manager ko UDP 162 par bheja gaya notification, jiska acknowledgment nahi aata." } },
    { term: "Inform", def: { en: "A notification the manager acknowledges with a Response; the agent resends it until acknowledged.", hi: "Aisa notification jise manager Response se acknowledge karta hai; acknowledge hone tak agent use dobara bhejta hai." } },
    { term: "authPriv", def: { en: "The SNMPv3 security level with both authentication and encryption.", hi: "SNMPv3 ka woh security level jisme authentication aur encryption dono hote hain." } },
  ],
  commands: [
    { cmd: "snmp-server community <string> RO|RW", mode: "Global configuration", does: { en: "Create an SNMPv1/v2c community with read-only or read-write access", hi: "Read-only ya read-write access wali SNMPv1/v2c community banata hai" } },
    { cmd: "snmp-server location <text>", mode: "Global configuration", does: { en: "Set sysLocation", hi: "sysLocation set karta hai" } },
    { cmd: "snmp-server contact <text>", mode: "Global configuration", does: { en: "Set sysContact", hi: "sysContact set karta hai" } },
    { cmd: "snmp-server host <ip> [informs] version 2c <community>", mode: "Global configuration", does: { en: "Send Traps (or Informs) to this NMS", hi: "Is NMS ko Traps (ya Informs) bhejta hai" } },
    { cmd: "snmp-server enable traps", mode: "Global configuration", does: { en: "Enable sending of SNMP notifications", hi: "SNMP notifications bhejna enable karta hai" } },
    { cmd: "snmp-server group <name> v3 priv", mode: "Global configuration", does: { en: "Create an SNMPv3 group that requires authPriv", hi: "Aisa SNMPv3 group banata hai jisme authPriv zaroori ho" } },
    { cmd: "snmp-server user <name> <group> v3 auth sha <pw> priv aes 128 <pw>", mode: "Global configuration", does: { en: "Create an SNMPv3 user with SHA authentication and AES encryption", hi: "SHA authentication aur AES encryption wala SNMPv3 user banata hai" } },
    { cmd: "show snmp host", mode: "Privileged EXEC", does: { en: "List configured notification destinations", hi: "Configured notification destinations dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Swapping the ports. The agent listens on UDP 161 for Get and Set; the manager listens on UDP 162 for Traps and Informs.",
      hi: "Ports ulte kar dena. Agent Get aur Set ke liye UDP 161 par sunta hai; manager Traps aur Informs ke liye UDP 162 par.",
    },
    {
      en: "Thinking a Trap is acknowledged. Only an Inform gets a Response back; a lost Trap is simply lost.",
      hi: "Yeh sochna ki Trap acknowledge hota hai. Sirf Inform ka Response wapas aata hai; khoya hua Trap bas kho jaata hai.",
    },
    {
      en: "Believing community strings are encrypted. In v1 and v2c they cross the network in clear text; only SNMPv3 with authPriv encrypts.",
      hi: "Yeh maan lena ki community strings encrypted hoti hain. v1 aur v2c mein yeh network par clear text mein jaati hain; sirf SNMPv3 authPriv encrypt karta hai.",
    },
    {
      en: "Saying GetBulk or Inform exist in SNMPv1. Both arrived with SNMPv2c.",
      hi: "GetBulk ya Inform ko SNMPv1 ka hissa bolna. Dono SNMPv2c ke saath aaye.",
    },
    {
      en: "Configuring `snmp-server host` but not `snmp-server enable traps`. The router knows where to send notifications, but the notification types are not turned on, so they are not sent.",
      hi: "`snmp-server host` configure karna lekin `snmp-server enable traps` bhool jaana. Router ko pata hai notifications kahan bhejne hain, lekin notification types on nahi hain, isliye woh bheje hi nahi jaate.",
    },
    {
      en: "Giving the monitoring tool the RW community when it only needs to read. Hand out the RO string, and keep RW for the few tools that must use Set.",
      hi: "Monitoring tool ko RW community de dena jabki use sirf padhna hai. RO string do, aur RW sirf un kuch tools ke liye rakho jinhe Set use karna hi hai.",
    },
  ],
  recap: [
    { en: "The manager on the NMS polls agents on devices; the MIB lists what an agent exposes, and each variable has an OID.", hi: "NMS par manager devices ke agents ko poll karta hai; MIB batata hai agent kya expose karta hai, aur har variable ka ek OID hota hai." },
    { en: "Read: Get, GetNext, GetBulk. Write: Set. Notify: Trap (no ack), Inform (acknowledged with a Response).", hi: "Read: Get, GetNext, GetBulk. Write: Set. Notify: Trap (koi ack nahi), Inform (Response se acknowledge hota hai)." },
    { en: "UDP 161 to the agent for polling; UDP 162 to the manager for Traps and Informs.", hi: "Polling ke liye agent ka UDP 161; Traps aur Informs ke liye manager ka UDP 162." },
    { en: "v1 and v2c use clear-text community strings (RO or RW); v2c added GetBulk and Inform.", hi: "v1 aur v2c clear-text community strings (RO ya RW) use karte hain; v2c ne GetBulk aur Inform add kiye." },
    { en: "v3 uses users and three levels: noAuthNoPriv, authNoPriv, authPriv. authPriv is the recommended choice.", hi: "v3 users aur teen levels use karta hai: noAuthNoPriv, authNoPriv, authPriv. Recommended hai authPriv." },
    { en: "IOS: `snmp-server community ... RO`, `snmp-server host ... version 2c ...`, `snmp-server enable traps`.", hi: "IOS par teen commands yaad rakho: `snmp-server community ... RO`, `snmp-server host ... version 2c ...` aur `snmp-server enable traps`." },
  ],
  quiz: [
    {
      q: {
        en: "The NMS at 10.1.1.50 sends a GetRequest to R1. Which destination port does the request use?",
        hi: "10.1.1.50 wala NMS R1 ko GetRequest bhejta hai. Request kaunsa destination port use karti hai?",
      },
      options: [
        { en: "TCP 161", hi: "TCP 161" },
        { en: "UDP 162", hi: "UDP 162" },
        { en: "UDP 161", hi: "UDP 161" },
        { en: "UDP 514", hi: "UDP 514" },
      ],
      answer: 2,
      explain: {
        en: "Polling goes to the agent, which listens on UDP 161. UDP 162 is where the manager listens for Traps and Informs, and UDP 514 is syslog. SNMP does not use TCP for normal operation.",
        hi: "Polling agent ke paas jaati hai, jo UDP 161 par sunta hai. UDP 162 par manager Traps aur Informs ke liye sunta hai, aur UDP 514 syslog ka hai. Normal operation mein SNMP TCP use nahi karta.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A switch must be sure the NMS received its notification that the uplink failed. Which message should it send?",
        hi: "Switch ko pakka karna hai ki uplink fail hone ka notification NMS tak pahuncha. Use kaunsa message bhejna chahiye?",
      },
      options: [
        { en: "Inform", hi: "Inform" },
        { en: "Trap", hi: "Trap" },
        { en: "SetRequest", hi: "SetRequest" },
        { en: "GetNextRequest", hi: "GetNextRequest" },
      ],
      answer: 0,
      explain: {
        en: "An Inform is acknowledged by the manager with a Response, and the agent resends it if no acknowledgment arrives. A Trap is never acknowledged. Set and GetNext are sent by the manager, not the agent.",
        hi: "Inform ko manager Response se acknowledge karta hai, aur acknowledgment na aaye toh agent use dobara bhejta hai. Trap kabhi acknowledge nahi hota. Set aur GetNext manager bhejta hai, agent nahi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Which SNMP version and security level both authenticates and encrypts every message?",
        hi: "Kaunsa SNMP version aur security level har message ko authenticate bhi karta hai aur encrypt bhi?",
      },
      options: [
        { en: "SNMPv2c with an RW community", hi: "SNMPv2c, RW community ke saath" },
        { en: "SNMPv3 noAuthNoPriv", hi: "SNMPv3 noAuthNoPriv" },
        { en: "SNMPv3 authNoPriv", hi: "SNMPv3 authNoPriv" },
        { en: "SNMPv3 authPriv", hi: "SNMPv3 authPriv" },
      ],
      answer: 3,
      explain: {
        en: "authPriv adds both authentication (auth) and encryption (priv). authNoPriv authenticates without encrypting, noAuthNoPriv does neither, and v2c only has a clear-text community string.",
        hi: "authPriv authentication (auth) aur encryption (priv) dono deta hai. authNoPriv authenticate karta hai lekin encrypt nahi, noAuthNoPriv dono mein se kuch nahi, aur v2c mein sirf clear-text community string hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1 has `snmp-server community NOCread99 RO` and `snmp-server community NOCwrite99 RW`. The NMS sends a SetRequest for sysLocation.0 using NOCread99. What happens?",
        hi: "R1 par `snmp-server community NOCread99 RO` aur `snmp-server community NOCwrite99 RW` hai. NMS NOCread99 use karke sysLocation.0 ke liye SetRequest bhejta hai. Kya hoga?",
      },
      options: [
        { en: "The change is applied, because the community exists", hi: "Change apply ho jaata hai, kyunki community exist karti hai" },
        { en: "The change is refused, because NOCread99 allows only reads", hi: "Change refuse hota hai, kyunki NOCread99 sirf read allow karti hai" },
        { en: "R1 sends an Inform to ask the NMS to confirm", hi: "R1 confirm karne ke liye NMS ko Inform bhejta hai" },
        { en: "R1 treats the Set as a Get and returns the current value", hi: "R1 Set ko Get maan kar current value bhej deta hai" },
      ],
      answer: 1,
      explain: {
        en: "A read-only community permits Get, GetNext and GetBulk only. Any Set must use the RW community, NOCwrite99 here.",
        hi: "Read-only community sirf Get, GetNext aur GetBulk allow karti hai. Koi bhi Set RW community se hi hoga, yahan NOCwrite99.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "An NMS using SNMPv2c needs the descriptions of all 48 interfaces on a switch with as few requests as possible. Which message fits best?",
        hi: "SNMPv2c use karne wale NMS ko switch ke saare 48 interfaces ki descriptions kam se kam requests mein chahiye. Kaunsa message sabse sahi hai?",
      },
      options: [
        { en: "GetRequest", hi: "GetRequest" },
        { en: "GetNextRequest", hi: "GetNextRequest" },
        { en: "GetBulkRequest", hi: "GetBulkRequest" },
        { en: "Trap", hi: "Trap" },
      ],
      answer: 2,
      explain: {
        en: "GetBulk returns many consecutive OIDs in one reply. GetNext would also walk the table, but needs one request per value, and a Get needs every exact OID. Traps are sent by agents, not requested.",
        hi: "GetBulk ek hi reply mein bahut saare lagaataar OIDs de deta hai. GetNext se bhi table walk ho jaati, lekin har value ke liye ek request lagti, aur Get mein har exact OID chahiye. Traps agent bhejta hai, unhe maanga nahi jaata.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A security audit captures SNMPv2c traffic between the NMS and R1. What can the auditor see?",
        hi: "Security audit NMS aur R1 ke beech SNMPv2c traffic capture karta hai. Auditor ko kya dikhega?",
      },
      options: [
        { en: "Nothing useful, because v2c encrypts with AES", hi: "Kuch kaam ka nahi, kyunki v2c AES se encrypt karta hai" },
        { en: "The community string in clear text in every message", hi: "Har message mein community string, clear text mein" },
        { en: "Only a SHA hash of the community string", hi: "Sirf community string ka SHA hash" },
        { en: "The community string, but only inside Traps", hi: "Community string, lekin sirf Traps ke andar" },
      ],
      answer: 1,
      explain: {
        en: "SNMPv1 and v2c carry the community string unprotected in every request, response and notification. Hashing and encryption arrive only with SNMPv3, which is why v3 is recommended.",
        hi: "SNMPv1 aur v2c har request, response aur notification mein community string bina protection ke bhejte hain. Hashing aur encryption sirf SNMPv3 ke saath aate hain, isiliye v3 recommended hai.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "HXu0Ifj0oWU",
      title: "Free CCNA | SNMP | Day 40",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Managers, agents, MIB and OIDs, message types and versions, with IOS configuration.", hi: "Managers, agents, MIB aur OIDs, message types aur versions, IOS configuration ke saath." },
    },
    {
      id: "v8WxIytUdS4",
      title: "Free CCNA | SNMP | Day 40 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Packet Tracer lab: configure communities and query a router from a PC.", hi: "Packet Tracer lab: communities configure karo aur PC se router ko query karo." },
    },
    {
      id: "avemtgIPIY8",
      title: "76. Free CCNA (NEW) | SNMP - Simple Network Management Protocol",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "A short Hindi explanation of SNMP components and messages.", hi: "SNMP components aur messages ka chhota Hindi explanation." },
    },
  ],
  lab: {
    title: { en: "Poll a router from a PC in Packet Tracer", hi: "Packet Tracer mein PC se router poll karo" },
    steps: [
      { en: "Build R1 (Gi0/0 10.1.1.1/24), a switch, and a PC at 10.1.1.50/24 that will act as the NMS.", hi: "R1 (Gi0/0 10.1.1.1/24), ek switch, aur 10.1.1.50/24 par ek PC banao jo NMS ka kaam karega." },
      { en: "On R1 configure `snmp-server community NOCread99 RO`, `snmp-server community NOCwrite99 RW` and `snmp-server location Mumbai DC rack 4` (if your Packet Tracer version rejects `snmp-server location`, skip it; the communities are what matter).", hi: "R1 par `snmp-server community NOCread99 RO`, `snmp-server community NOCwrite99 RW` aur `snmp-server location Mumbai DC rack 4` configure karo (agar tumhara Packet Tracer version `snmp-server location` reject kare, toh skip karo; asli kaam communities ka hai)." },
      { en: "On the PC open Desktop > MIB Browser. Under Advanced, enter 10.1.1.1 and the two community strings, then do a Get on sysName and sysLocation.", hi: "PC par Desktop > MIB Browser kholo. Advanced mein 10.1.1.1 aur dono community strings daalo, phir sysName aur sysLocation par Get karo." },
      { en: "Do a Set on sysLocation with a new value, then Get it again to confirm the change.", hi: "sysLocation par nayi value ke saath Set karo, phir dobara Get karke change confirm karo." },
      { en: "Change the read community in the MIB Browser to `public` and Get again. Why is there no answer?", hi: "MIB Browser mein read community ko `public` kar do aur dobara Get karo. Jawab kyun nahi aaya?" },
      { en: "Switch to Simulation mode, filter on SNMP, and confirm the request goes to UDP port 161.", hi: "Simulation mode mein jao, SNMP par filter karo, aur confirm karo ki request UDP port 161 par jaati hai." },
    ],
  },
};

export default lesson;
