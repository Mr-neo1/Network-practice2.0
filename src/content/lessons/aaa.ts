import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "aaa",
  intro: {
    en: "A company with 300 switches and routers cannot manage a local username on every box. When an engineer joins, leaves or changes role, every device would need editing, and nobody could say who ran which command last Tuesday. AAA moves those decisions to one central server: it checks who you are, decides what you may do, and records what you did. RADIUS and TACACS+ are the two protocols devices use to talk to that server.",
    hi: "Jis company mein 300 switches aur routers hain, wahan har box par local username manage karna possible nahi. Koi engineer join kare, chhod de ya role badle, toh har device edit karna padega, aur koi bata nahi payega ki pichhle Tuesday kisne kaunsi command chalayi. AAA yeh saare decisions ek central server par le jaata hai: woh check karta hai tum kaun ho, decide karta hai tum kya kar sakte ho, aur record karta hai tumne kya kiya. Devices us server se baat karne ke liye do protocols use karte hain: RADIUS aur TACACS+.",
  },
  outcomes: [
    { en: "Explain authentication, authorization and accounting with a concrete example of each", hi: "Authentication, authorization aur accounting ko har ek ke concrete example ke saath samjha sako" },
    { en: "Compare RADIUS and TACACS+: transport, ports, encryption, how they split the three A's, and typical use", hi: "RADIUS aur TACACS+ compare kar sako: transport, ports, encryption, teeno A ko kaise split karte hain, aur typical use" },
    { en: "Name the three 802.1X roles and which protocol runs between each pair", hi: "802.1X ke teen roles bata sako aur har pair ke beech kaunsa protocol chalta hai" },
    { en: "Configure an IOS device to log in through TACACS+ with a local fallback", hi: "IOS device ko TACACS+ se login karne ke liye configure kar sako, local fallback ke saath" },
    { en: "Predict what happens when the AAA server rejects a login, is unreachable, or denies a command", hi: "Predict kar sako ki kya hoga jab AAA server login reject kare, reachable na ho, ya koi command deny kare" },
  ],
  sections: [
    {
      id: "why-aaa",
      heading: { en: "Why central AAA", hi: "Central AAA kyun" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 5.2 you secured a device with `enable secret` and local users created with `username ... secret`. That works for a lab. In a real network it breaks down: each device has its own copy of every account, passwords drift apart, and a former employee's account may survive on the one switch somebody forgot.",
            hi: "Lesson 5.2 mein tumne device ko `enable secret` aur `username ... secret` se bane local users ke saath secure kiya tha. Lab ke liye yeh theek hai. Real network mein yeh toot jaata hai: har device par har account ki apni copy hoti hai, passwords alag-alag ho jaate hain, aur kisi purane employee ka account us ek switch par bacha reh jaata hai jise sab bhool gaye.",
          },
        },
        {
          type: "p",
          text: {
            en: "With AAA, the switch or router becomes an **AAA client** (Cisco documents also call it a NAS, network access server). It asks a central **AAA server** every time someone logs in or runs a command. In Cisco networks that server is usually **Cisco ISE** (Identity Services Engine), which can check passwords against Active Directory and speaks both RADIUS and TACACS+. Older networks used Cisco ACS.",
            hi: "AAA ke saath switch ya router ek **AAA client** ban jaata hai (Cisco documents ise NAS, yaani network access server, bhi bolte hain). Jab bhi koi login kare ya command chalaye, woh ek central **AAA server** se poochta hai. Cisco networks mein yeh server aam taur par **Cisco ISE** (Identity Services Engine) hota hai, jo passwords ko Active Directory se check kar sakta hai aur RADIUS aur TACACS+ dono bolta hai. Purane networks mein Cisco ACS hota tha.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of an office building", hi: "Ek office building socho" },
          text: {
            en: "At the gate, security checks your ID card: that is authentication. Your card opens floors 2 and 3 but not the server room: that is authorization. Every swipe is written to a log that HR can read later: that is accounting. One security desk manages all of it, instead of a separate lock and key list on every door.",
            hi: "Gate par security tumhara ID card check karti hai: yeh authentication hai. Tumhara card floor 2 aur 3 kholta hai, server room nahi: yeh authorization hai. Har swipe ek log mein likha jaata hai jo HR baad mein padh sakta hai: yeh accounting hai. Yeh sab ek hi security desk manage karti hai, har darwaze par alag lock aur alag key list nahi hoti.",
          },
        },
      ],
    },
    {
      id: "three-as",
      heading: { en: "The three A's", hi: "Teen A" },
      blocks: [
        {
          type: "table",
          caption: { en: "Engineer neha logs in to SW1 (10.1.1.2) over SSH", hi: "Engineer neha SSH se SW1 (10.1.1.2) par login karti hai" },
          columns: ["", { en: "Question it answers", hi: "Kaunsa sawaal" }, { en: "Example", hi: "Example" }],
          rows: [
            [
              "Authentication",
              { en: "Who are you?", hi: "Tum kaun ho?" },
              { en: "neha's username and password are checked; the login succeeds or fails", hi: "neha ka username aur password check hota hai; login pass ya fail" },
            ],
            [
              "Authorization",
              { en: "What are you allowed to do?", hi: "Tumhe kya karne ki permission hai?" },
              { en: "neha gets a CLI at privilege 15; `show` commands are allowed, `reload` is not", hi: "neha ko privilege 15 par CLI milti hai; `show` commands allowed hain, `reload` nahi" },
            ],
            [
              "Accounting",
              { en: "What did you do, and when?", hi: "Tumne kya kiya, aur kab?" },
              { en: "A record: neha, from 10.1.10.25, ran `show running-config` at 10:42, logged out at 10:56", hi: "Ek record: neha ne 10.1.10.25 se 10:42 par `show running-config` chalaya, 10:56 par logout kiya" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Order matters. Authorization only makes sense once the device knows who you are, and accounting records what an authenticated, authorized user actually did. Accounting is also what you hand an auditor, or read after an outage to find out which change caused it.",
            hi: "Order zaroori hai. Authorization tabhi matlab rakhta hai jab device ko pata ho ki tum kaun ho, aur accounting record karta hai ki authenticated aur authorized user ne asal mein kya kiya. Auditor ko bhi accounting hi dikhaya jaata hai, aur outage ke baad yahi padh kar pata chalta hai ki kaunsa change problem laaya.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam wording", hi: "Exam wording" },
          text: {
            en: "Expect a definition matched to a word. Verifying identity = authentication. Granting or limiting access to resources or commands = authorization. Recording usage, commands, time and data = accounting.",
            hi: "Exam mein definition ko word se match karna padega. Identity verify karna = authentication. Resources ya commands ka access dena ya limit karna = authorization. Usage, commands, time aur data record karna = accounting.",
          },
        },
      ],
    },
    {
      id: "tacacs-plus",
      heading: { en: "TACACS+: built for device administration", hi: "TACACS+: device administration ke liye bana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**TACACS+** was developed by Cisco and later published as RFC 8907. It runs over **TCP port 49**, **encrypts the whole body** of every message (only the small header stays readable), and treats authentication, authorization and accounting as **separate exchanges**. That separation is what makes **per-command authorization** possible: the device can ask the server about every single command an admin types.",
            hi: "**TACACS+** Cisco ne banaya tha aur baad mein RFC 8907 ke roop mein publish hua. Yeh **TCP port 49** par chalta hai, har message ki **poori body encrypt** karta hai (sirf chhota sa header readable rehta hai), aur authentication, authorization aur accounting ko **alag-alag exchanges** maanta hai. Isi separation ki wajah se **per-command authorization** possible hai: device admin ki type ki hui har ek command ke baare mein server se pooch sakta hai.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "neha opens SSH from 10.1.10.25 to SW1 and enters her username and password.",
              hi: "neha 10.1.10.25 se SW1 par SSH kholti hai aur apna username aur password daalti hai.",
            },
            {
              en: "**Authentication**: SW1 sends them to ISE (10.2.2.100) over TCP 49. ISE checks them against Active Directory and replies PASS.",
              hi: "**Authentication**: SW1 inhe TCP 49 par ISE (10.2.2.100) ko bhejta hai. ISE inhe Active Directory se check karta hai aur PASS reply karta hai.",
            },
            {
              en: "**Authorization (exec)**: SW1 asks whether neha may start a CLI session and at which privilege level. ISE replies PASS with `priv-lvl=15`, because neha is in the NOC-Engineers group.",
              hi: "**Authorization (exec)**: SW1 poochta hai ki neha CLI session start kar sakti hai ya nahi, aur kis privilege level par. ISE `priv-lvl=15` ke saath PASS reply karta hai, kyunki neha NOC-Engineers group mein hai.",
            },
            {
              en: "**Authorization (command)**: before running `show running-config`, SW1 asks ISE. PASS, so it runs. Before running `reload`, SW1 asks again. FAIL, so neha sees `Command authorization failed.`",
              hi: "**Authorization (command)**: `show running-config` chalane se pehle SW1 ISE se poochta hai. PASS, toh command chal jaati hai. `reload` se pehle phir poochta hai. FAIL, toh neha ko `Command authorization failed.` dikhta hai.",
            },
            {
              en: "**Accounting**: SW1 sends ISE a record for each command that ran, and start and stop records for the session. ISE keeps them as an audit trail.",
              hi: "**Accounting**: jo bhi command chali, uska record SW1 ISE ko bhejta hai, aur session ke start aur stop records bhi. ISE inhe audit trail ki tarah rakhta hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Why per-command authorization matters", hi: "Per-command authorization kyun zaroori hai" },
          text: {
            en: "Privilege levels on the device are coarse and must be set up on every box. With TACACS+ you write one policy on ISE, such as \"helpdesk may run show commands and shut or no shut access ports, nothing else\", and every device enforces it.",
            hi: "Device par privilege levels kaafi rough hote hain aur har box par alag set karne padte hain. TACACS+ ke saath tum ISE par ek policy likhte ho, jaise \"helpdesk sirf show commands aur access ports par shut ya no shut chala sakta hai, aur kuch nahi\", aur har device use enforce karta hai.",
          },
        },
      ],
    },
    {
      id: "radius-and-8021x",
      heading: { en: "RADIUS and 802.1X: built for network access", hi: "RADIUS aur 802.1X: network access ke liye bana" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**RADIUS** is an open IETF standard, so every vendor supports it. It runs over **UDP 1812** for authentication and authorization and **UDP 1813** for accounting. It **hides only the password** attribute; the username, the switch port and every other attribute cross the network in clear text. And it **combines authentication and authorization**: one Access-Accept message says \"yes, this user is valid\" and carries the authorization settings, such as which VLAN to use, in the same reply.",
            hi: "**RADIUS** ek open IETF standard hai, isliye har vendor ise support karta hai. Authentication aur authorization ke liye yeh **UDP 1812** par aur accounting ke liye **UDP 1813** par chalta hai. Yeh **sirf password** attribute chhupata hai; username, switch port aur baaki saare attributes network par clear text mein jaate hain. Aur yeh **authentication aur authorization ko combine** karta hai: ek hi Access-Accept message bolta hai \"haan, yeh user valid hai\" aur usi reply mein authorization settings bhi le aata hai, jaise kaunsa VLAN use karna hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Because it is fast, standard and carries per-user settings well, RADIUS is the protocol for **users getting onto the network**: wired and wireless 802.1X, and VPN logins. TACACS+ is for **admins managing devices**. That is the split you should remember.",
            hi: "Fast hai, standard hai aur per-user settings achhe se le jaata hai, isliye RADIUS **users ke network par aane** ka protocol hai: wired aur wireless 802.1X, aur VPN logins. TACACS+ **admins ke devices manage karne** ke liye hai. Yahi split yaad rakhna hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The three 802.1X roles (staff PC on SW1 Gi1/0/5)", hi: "802.1X ke teen roles (staff PC SW1 ke Gi1/0/5 par)" },
          columns: [{ en: "Role", hi: "Role" }, { en: "Device", hi: "Device" }, { en: "What it does", hi: "Kya karta hai" }],
          rows: [
            [
              "Supplicant",
              { en: "The staff PC", hi: "Staff PC" },
              { en: "Sends the user's identity and credentials to the switch in EAPOL frames (EAP over LAN)", hi: "User ki identity aur credentials switch ko EAPOL frames (EAP over LAN) mein bhejta hai" },
            ],
            [
              "Authenticator",
              { en: "SW1 (or a wireless AP or WLC)", hi: "SW1 (ya wireless AP ya WLC)" },
              { en: "Keeps the port blocked, relays the EAP messages to the server inside RADIUS, and opens the port when told to", hi: "Port block rakhta hai, EAP messages ko RADIUS ke andar server tak relay karta hai, aur bolne par port khol deta hai" },
            ],
            [
              "Authentication server",
              { en: "ISE", hi: "ISE" },
              { en: "Checks the credentials and answers with Access-Accept or Access-Reject", hi: "Credentials check karta hai aur Access-Accept ya Access-Reject se jawab deta hai" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The switch does not decide", hi: "Switch decide nahi karta" },
          text: {
            en: "In 802.1X the authenticator never checks the password itself. It only relays. Until the server sends Access-Accept, the port carries no user traffic, not even DHCP: only EAPOL frames (plus a few control protocols such as CDP and STP) get through. 802.1X comes back in lesson 5.10 as WPA2-Enterprise.",
            hi: "802.1X mein authenticator khud password kabhi check nahi karta. Woh sirf relay karta hai. Jab tak server Access-Accept na bheje, port par koi user traffic nahi chalta, DHCP bhi nahi: sirf EAPOL frames (aur CDP, STP jaise kuch control protocols) pass hote hain. 802.1X lesson 5.10 mein WPA2-Enterprise ke roop mein phir aayega.",
          },
        },
      ],
    },
    {
      id: "compare",
      heading: { en: "RADIUS vs TACACS+ side by side", hi: "RADIUS vs TACACS+ aamne-saamne" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Feature", hi: "Feature" }, "TACACS+", "RADIUS"],
          rows: [
            [{ en: "Origin", hi: "Origin" }, { en: "Cisco (now RFC 8907)", hi: "Cisco (ab RFC 8907)" }, { en: "Open IETF standard", hi: "Open IETF standard" }],
            [{ en: "Transport and ports", hi: "Transport aur ports" }, "TCP 49", { en: "UDP 1812 (authentication), UDP 1813 (accounting)", hi: "UDP 1812 (authentication), UDP 1813 (accounting)" }],
            [{ en: "Encryption", hi: "Encryption" }, { en: "Whole message body", hi: "Poori message body" }, { en: "Password attribute only", hi: "Sirf password attribute" }],
            [{ en: "The three A's", hi: "Teen A" }, { en: "Fully separate", hi: "Poori tarah alag" }, { en: "Authentication and authorization combined; accounting separate", hi: "Authentication aur authorization combined; accounting alag" }],
            [{ en: "Command authorization", hi: "Command authorization" }, { en: "Yes, per command", hi: "Haan, har command par" }, { en: "No", hi: "Nahi" }],
            [{ en: "Main use", hi: "Main use" }, { en: "Device administration (admins on the CLI)", hi: "Device administration (CLI par admins)" }, { en: "Network access (802.1X, Wi-Fi, VPN users)", hi: "Network access (802.1X, Wi-Fi, VPN users)" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Memory hooks", hi: "Yaad rakhne ka tareeka" },
          text: {
            en: "TACACS+ has a plus: more encryption (whole body), more separation (three A's apart), more control (per command), and the reliable transport (TCP). RADIUS is the open one on UDP that users meet when they join the network.",
            hi: "TACACS+ ke paas plus hai: zyada encryption (poori body), zyada separation (teeno A alag), zyada control (har command par), aur reliable transport (TCP). RADIUS woh open wala hai jo UDP par chalta hai aur users ko network join karte waqt milta hai.",
          },
        },
      ],
    },
    {
      id: "configure",
      heading: { en: "Configuring AAA on IOS", hi: "IOS par AAA configure karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Everything starts with `aaa new-model`. From that moment, the old `login` and `password` settings under the lines stop being used; **method lists** decide how logins work. A method list is an ordered list of sources to try, such as \"TACACS+ servers first, then the local username database\". The list named `default` applies to every line that has no other list.",
            hi: "Sab kuch `aaa new-model` se shuru hota hai. Us moment se lines ke neeche wali purani `login` aur `password` settings use hona band ho jaati hain; ab **method lists** decide karti hain ki login kaise hoga. Method list sources ki ordered list hoti hai, jaise \"pehle TACACS+ servers, phir local username database\". `default` naam wali list har us line par lagti hai jis par koi doosri list nahi hai.",
          },
        },
        {
          type: "cli",
          title: { en: "SW1: TACACS+ for admins, with a local fallback", hi: "SW1: admins ke liye TACACS+, local fallback ke saath" },
          lines: [
            { prompt: "SW1(config)#", cmd: "username backup privilege 15 secret L0cal-Only-99", comment: { en: "Create the fallback account first", hi: "Fallback account sabse pehle banao" } },
            { prompt: "SW1(config)#", cmd: "aaa new-model" },
            { prompt: "SW1(config)#", cmd: "tacacs server TAC1" },
            { prompt: "SW1(config-server-tacacs)#", cmd: "address ipv4 10.2.2.100" },
            { prompt: "SW1(config-server-tacacs)#", cmd: "key T4c-Key-99", comment: { en: "Shared secret; the same key is set for SW1 on ISE", hi: "Shared secret; ISE par SW1 ke liye yahi key set hoti hai" } },
            { prompt: "SW1(config-server-tacacs)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "aaa authentication login default group tacacs+ local" },
            { prompt: "SW1(config)#", cmd: "aaa authorization exec default group tacacs+ local", comment: { en: "Server decides if a CLI starts, and at which level", hi: "Server decide karta hai CLI start hogi ya nahi, aur kis level par" } },
            { prompt: "SW1(config)#", cmd: "aaa authorization commands 15 default group tacacs+ local", comment: { en: "Ask the server before every level-15 command", hi: "Har level-15 command se pehle server se poocho" } },
            { prompt: "SW1(config)#", cmd: "aaa accounting exec default start-stop group tacacs+" },
            { prompt: "SW1(config)#", cmd: "aaa accounting commands 15 default stop-only group tacacs+" },
          ],
          note: {
            en: "`group tacacs+ local` means: try the TACACS+ servers; only if none of them answers, use the local database.",
            hi: "`group tacacs+ local` ka matlab: TACACS+ servers try karo; sirf tab jab unme se koi jawab na de, local database use karo.",
          },
        },
        {
          type: "cli",
          title: { en: "What neha sees", hi: "neha ko kya dikhta hai" },
          lines: [
            { prompt: "SW1#", cmd: "show running-config" },
            { out: "Building configuration..." },
            { prompt: "SW1#", cmd: "reload" },
            { out: "Command authorization failed.", comment: { en: "ISE answered FAIL for this command", hi: "Is command ke liye ISE ne FAIL jawab diya" } },
          ],
        },
        {
          type: "cli",
          title: { en: "RADIUS server definition (used for 802.1X users on SW1)", hi: "RADIUS server definition (SW1 par 802.1X users ke liye)" },
          lines: [
            { prompt: "SW1(config)#", cmd: "radius server RAD1" },
            { prompt: "SW1(config-radius-server)#", cmd: "address ipv4 10.2.2.100 auth-port 1812 acct-port 1813" },
            { prompt: "SW1(config-radius-server)#", cmd: "key R4d-Key-99" },
          ],
          note: {
            en: "Write the ports explicitly. Many IOS versions default to the older RADIUS ports 1645 and 1646, and a server listening only on 1812/1813 would never answer. The rest of the 802.1X switch configuration is beyond the CCNA.",
            hi: "Ports explicitly likho. Kai IOS versions by default purane RADIUS ports 1645 aur 1646 use karte hain, aur jo server sirf 1812/1813 par sun raha hai woh kabhi jawab nahi dega. 802.1X ka baaki switch configuration CCNA ke bahar hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Fallback happens only when the server is silent", hi: "Fallback sirf tab jab server chup ho" },
          text: {
            en: "If ISE answers and rejects neha's password, the login fails. IOS does not then try `local`. The local account is used only when no TACACS+ server responds at all, for example when the link to 10.2.2.100 is down.",
            hi: "Agar ISE jawab deta hai aur neha ka password reject karta hai, toh login fail. IOS phir `local` try nahi karta. Local account sirf tab use hota hai jab koi bhi TACACS+ server respond hi na kare, jaise jab 10.2.2.100 tak ka link down ho.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Authentication", def: { en: "Verifying who a user or device is, usually with a password, certificate or token.", hi: "User ya device kaun hai, yeh verify karna, aam taur par password, certificate ya token se." } },
    { term: "Authorization", def: { en: "Deciding what an authenticated user may do: privilege level, commands, VLAN, network access.", hi: "Authenticated user kya kar sakta hai, yeh decide karna: privilege level, commands, VLAN, network access." } },
    { term: "Accounting", def: { en: "Recording what a user did and when: login times, commands, session length, data used.", hi: "User ne kya kiya aur kab, yeh record karna: login time, commands, session length, data use." } },
    { term: "TACACS+", def: { en: "Cisco-developed AAA protocol on TCP 49 that encrypts the whole body and authorizes each command; used for device administration.", hi: "Cisco ka banaya AAA protocol jo TCP 49 par chalta hai, poori body encrypt karta hai aur har command authorize karta hai; device administration ke liye use hota hai." } },
    { term: "RADIUS", def: { en: "Open AAA protocol on UDP 1812/1813 that hides only the password and combines authentication with authorization; used for network access.", hi: "Open AAA protocol jo UDP 1812/1813 par chalta hai, sirf password chhupata hai aur authentication ko authorization ke saath combine karta hai; network access ke liye use hota hai." } },
    { term: "Cisco ISE", def: { en: "Cisco Identity Services Engine, the AAA and policy server that answers RADIUS and TACACS+ requests.", hi: "Cisco Identity Services Engine, woh AAA aur policy server jo RADIUS aur TACACS+ requests ka jawab deta hai." } },
    { term: "802.1X", def: { en: "Port-based access control: a supplicant, an authenticator (switch or AP) and an authentication server (RADIUS).", hi: "Port-based access control: ek supplicant, ek authenticator (switch ya AP) aur ek authentication server (RADIUS)." } },
    { term: "Method list", def: { en: "An ordered list of sources IOS tries for AAA, such as `group tacacs+ local`.", hi: "Sources ki ordered list jo IOS AAA ke liye try karta hai, jaise `group tacacs+ local`." } },
  ],
  commands: [
    { cmd: "username backup privilege 15 secret L0cal-Only-99", mode: "Global config", does: { en: "Create the local fallback account before turning on AAA", hi: "AAA on karne se pehle local fallback account banao" } },
    { cmd: "aaa new-model", mode: "Global config", does: { en: "Turn on AAA; method lists replace line passwords", hi: "AAA on karo; line passwords ki jagah method lists kaam karti hain" } },
    { cmd: "tacacs server TAC1", mode: "Global config", does: { en: "Define a TACACS+ server and enter its sub-mode", hi: "TACACS+ server define karo aur uske sub-mode mein jao" } },
    { cmd: "address ipv4 10.2.2.100", mode: "TACACS+ / RADIUS server config", does: { en: "Set the server's IP address", hi: "Server ka IP address set karo" } },
    { cmd: "key T4c-Key-99", mode: "TACACS+ / RADIUS server config", does: { en: "Set the shared secret; it must match the server. TACACS+ uses it to encrypt the body, RADIUS to hide the password", hi: "Shared secret set karo; server par bhi yahi hona chahiye. TACACS+ isse body encrypt karta hai, RADIUS isse password chhupata hai" } },
    { cmd: "radius server RAD1", mode: "Global config", does: { en: "Define a RADIUS server and enter its sub-mode", hi: "RADIUS server define karo aur uske sub-mode mein jao" } },
    { cmd: "address ipv4 10.2.2.100 auth-port 1812 acct-port 1813", mode: "RADIUS server config", does: { en: "Set the RADIUS server address and the standard UDP ports", hi: "RADIUS server ka address aur standard UDP ports set karo" } },
    { cmd: "aaa authentication login default group tacacs+ local", mode: "Global config", does: { en: "Check logins with TACACS+, using local users only if no server answers", hi: "Logins TACACS+ se check karo, local users sirf tab jab koi server jawab na de" } },
    { cmd: "aaa authorization exec default group tacacs+ local", mode: "Global config", does: { en: "Let the server decide whether a CLI session starts and at which privilege level", hi: "Server decide kare ki CLI session start hoga ya nahi aur kis privilege level par" } },
    { cmd: "aaa authorization commands 15 default group tacacs+ local", mode: "Global config", does: { en: "Ask the server before running each privilege-15 command", hi: "Har privilege-15 command chalane se pehle server se poocho" } },
    { cmd: "aaa accounting exec default start-stop group tacacs+", mode: "Global config", does: { en: "Send a start record when a CLI session begins and a stop record when it ends", hi: "CLI session shuru hone par start record aur khatam hone par stop record bhejo" } },
    { cmd: "aaa accounting commands 15 default stop-only group tacacs+", mode: "Global config", does: { en: "Send a record of every privilege-15 command to the server", hi: "Har privilege-15 command ka record server ko bhejo" } },
  ],
  mistakes: [
    {
      en: "Swapping the ports. TACACS+ is TCP 49. RADIUS is UDP 1812 (authentication) and 1813 (accounting).",
      hi: "Ports ulte kar dena. TACACS+ TCP 49 hai. RADIUS UDP 1812 (authentication) aur 1813 (accounting) hai.",
    },
    {
      en: "Saying RADIUS encrypts the whole packet. It hides only the password; TACACS+ is the one that encrypts the whole body.",
      hi: "Yeh bolna ki RADIUS poora packet encrypt karta hai. Woh sirf password chhupata hai; poori body TACACS+ encrypt karta hai.",
    },
    {
      en: "Mixing up authentication and authorization. Logging in is authentication; being refused `reload` after a successful login is authorization.",
      hi: "Authentication aur authorization mix karna. Login karna authentication hai; successful login ke baad `reload` refuse hona authorization hai.",
    },
    {
      en: "Expecting `local` to rescue a rejected password. The local database is tried only when the server does not answer.",
      hi: "Yeh expect karna ki password reject hone par `local` bacha lega. Local database sirf tab try hota hai jab server jawab hi na de.",
    },
    {
      en: "Typing `aaa new-model` and a server-only method list with no local user, then losing the link to the server. Create a local privilege-15 user and add `local` as a fallback before you apply AAA.",
      hi: "`aaa new-model` aur sirf server wali method list daal dena bina kisi local user ke, aur phir server tak link kho dena. AAA apply karne se pehle ek local privilege-15 user banao aur `local` ko fallback mein daalo.",
    },
    {
      en: "Thinking the 802.1X authenticator (the switch) checks the password. It only relays EAP to the RADIUS server and opens the port on Access-Accept.",
      hi: "Yeh sochna ki 802.1X authenticator (switch) password check karta hai. Woh sirf EAP ko RADIUS server tak relay karta hai aur Access-Accept par port kholta hai.",
    },
  ],
  recap: [
    { en: "Authentication = who you are. Authorization = what you may do. Accounting = what you did.", hi: "Authentication = tum kaun ho. Authorization = tum kya kar sakte ho. Accounting = tumne kya kiya." },
    { en: "TACACS+: Cisco, TCP 49, whole body encrypted, three A's separate, per-command authorization, device admin.", hi: "TACACS+: Cisco ka hai, TCP 49 par chalta hai, poori body encrypt karta hai, teeno A alag rakhta hai aur har command authorize kar sakta hai; device admin ke liye." },
    { en: "RADIUS: open standard, UDP 1812/1813, password only encrypted, authN and authZ combined, network access (802.1X, VPN).", hi: "RADIUS: open standard, UDP 1812/1813, sirf password encrypted, authN aur authZ combined, network access (802.1X, VPN)." },
    { en: "802.1X: supplicant (PC) - EAPOL - authenticator (switch/AP) - RADIUS - authentication server (ISE).", hi: "802.1X mein supplicant (PC) EAPOL se authenticator (switch/AP) tak baat karta hai, aur authenticator RADIUS se authentication server (ISE) tak." },
    { en: "`aaa new-model`, define the server, then `aaa authentication login default group tacacs+ local`; local is used only if no server answers.", hi: "`aaa new-model`, server define karo, phir `aaa authentication login default group tacacs+ local`; local sirf tab jab koi server jawab na de." },
  ],
  quiz: [
    {
      q: {
        en: "An engineer logs in to a router successfully, but when she types `reload` the router refuses. Which AAA function stopped her?",
        hi: "Ek engineer router par successfully login karti hai, lekin `reload` type karne par router mana kar deta hai. Kis AAA function ne use roka?",
      },
      options: [
        { en: "Authentication", hi: "Authentication" },
        { en: "Authorization", hi: "Authorization" },
        { en: "Accounting", hi: "Accounting" },
        { en: "Auditing", hi: "Auditing" },
      ],
      answer: 1,
      explain: {
        en: "Her identity was already verified when the login succeeded, so authentication is done. Deciding which commands she may run is authorization. Accounting would only record what she did.",
        hi: "Login successful hote hi uski identity verify ho chuki thi, toh authentication ho gaya. Woh kaunsi commands chala sakti hai, yeh decide karna authorization hai. Accounting sirf record karta ki usne kya kiya.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "You need central control of admin logins to 300 Cisco devices, with the whole AAA message encrypted and each CLI command approved or denied by the server. Which protocol fits?",
        hi: "Tumhe 300 Cisco devices par admin logins ka central control chahiye, poora AAA message encrypted ho, aur har CLI command server approve ya deny kare. Kaunsa protocol fit hai?",
      },
      options: [
        { en: "RADIUS, because it is an open standard", hi: "RADIUS, kyunki yeh open standard hai" },
        { en: "802.1X, because it controls ports", hi: "802.1X, kyunki yeh ports control karta hai" },
        { en: "SNMPv3, because it supports encryption", hi: "SNMPv3, kyunki yeh encryption support karta hai" },
        { en: "TACACS+", hi: "TACACS+" },
      ],
      answer: 3,
      explain: {
        en: "TACACS+ encrypts the whole body and separates authorization, so the device can ask about every command. RADIUS hides only the password and has no per-command authorization. 802.1X controls network access for users, not CLI commands.",
        hi: "TACACS+ poori body encrypt karta hai aur authorization alag rakhta hai, isliye device har command ke baare mein pooch sakta hai. RADIUS sirf password chhupata hai aur usme per-command authorization nahi hai. 802.1X users ka network access control karta hai, CLI commands nahi.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which ports does RADIUS use for authentication and accounting?", hi: "RADIUS authentication aur accounting ke liye kaunse ports use karta hai?" },
      options: [
        { en: "UDP 1812 and UDP 1813", hi: "UDP 1812 aur UDP 1813" },
        { en: "TCP 49 for both", hi: "Dono ke liye TCP 49" },
        { en: "TCP 1812 and TCP 1813", hi: "TCP 1812 aur TCP 1813" },
        { en: "UDP 161 and UDP 162", hi: "UDP 161 aur UDP 162" },
      ],
      answer: 0,
      explain: {
        en: "RADIUS runs over UDP: 1812 for authentication and authorization, 1813 for accounting. TCP 49 is TACACS+, and UDP 161/162 are SNMP.",
        hi: "RADIUS UDP par chalta hai: authentication aur authorization ke liye 1812, accounting ke liye 1813. TCP 49 TACACS+ hai, aur UDP 161/162 SNMP hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A laptop is plugged into switch port Gi1/0/5, which uses 802.1X with Cisco ISE. Which role does the switch play?",
        hi: "Ek laptop switch port Gi1/0/5 mein lagaya gaya hai, jahan Cisco ISE ke saath 802.1X chal raha hai. Switch ka role kya hai?",
      },
      options: [
        { en: "Supplicant", hi: "Supplicant" },
        { en: "Authentication server", hi: "Authentication server" },
        { en: "Authenticator", hi: "Authenticator" },
        { en: "Accounting server", hi: "Accounting server" },
      ],
      answer: 2,
      explain: {
        en: "The laptop is the supplicant and ISE is the authentication server. The switch in the middle is the authenticator: it relays EAP from the laptop to ISE inside RADIUS and opens the port only after Access-Accept.",
        hi: "Laptop supplicant hai aur ISE authentication server. Beech ka switch authenticator hai: woh laptop ka EAP RADIUS ke andar ISE tak relay karta hai aur Access-Accept ke baad hi port kholta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "SW1 has `aaa authentication login default group tacacs+ local` and a local user `backup`. The only TACACS+ server, 10.2.2.100, is unreachable because its link is down. What happens when someone logs in over SSH?",
        hi: "SW1 par `aaa authentication login default group tacacs+ local` hai aur ek local user `backup` hai. Akela TACACS+ server, 10.2.2.100, link down hone ki wajah se unreachable hai. Koi SSH se login kare toh kya hoga?",
      },
      options: [
        { en: "After the server times out, SW1 checks the login against its local username database", hi: "Server time out hone ke baad SW1 login ko apne local username database se check karta hai" },
        { en: "Every login is refused until the server returns", hi: "Server wapas aane tak har login refuse hoga" },
        { en: "Any username is accepted because no server can check it", hi: "Koi bhi username accept ho jaayega kyunki check karne wala server nahi hai" },
        { en: "SW1 falls back to the `line vty` password", hi: "SW1 `line vty` password par fall back karta hai" },
      ],
      answer: 0,
      explain: {
        en: "`local` is the second method, and IOS moves to the next method when the current one gives no answer. So `backup` can log in with its local secret. If the server had answered and rejected the password, IOS would not try `local`. Line passwords are not used at all once `aaa new-model` is on.",
        hi: "`local` doosra method hai, aur jab current method koi jawab na de toh IOS agle method par jaata hai. Toh `backup` apne local secret se login kar sakta hai. Agar server ne jawab dekar password reject kiya hota, toh IOS `local` try nahi karta. `aaa new-model` on hone ke baad line passwords bilkul use nahi hote.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "After a successful TACACS+ login, an admin types `reload` and SW1 prints `Command authorization failed.` Which configured line (method list shown as ...) made SW1 ask the server about `reload`?",
        hi: "TACACS+ se successful login ke baad ek admin `reload` type karta hai aur SW1 `Command authorization failed.` print karta hai. Kaunsi configured line (method list ... se dikhayi hai) ki wajah se SW1 ne `reload` ke baare mein server se poocha?",
      },
      options: [
        { en: "`aaa authentication login default ...`", hi: "`aaa authentication login default ...`" },
        { en: "`aaa accounting commands 15 default ...`", hi: "`aaa accounting commands 15 default ...`" },
        { en: "`aaa authorization commands 15 default ...`", hi: "`aaa authorization commands 15 default ...`" },
        { en: "`aaa authorization exec default ...`", hi: "`aaa authorization exec default ...`" },
      ],
      answer: 2,
      explain: {
        en: "`aaa authorization commands 15` sends every privilege-15 command to the server before it runs, and the server said no to `reload`. Exec authorization only decides whether a CLI session starts. Accounting records commands but never blocks them.",
        hi: "`aaa authorization commands 15` har privilege-15 command ko chalne se pehle server ko bhejta hai, aur server ne `reload` ko mana kar diya. Exec authorization sirf decide karta hai ki CLI session start hoga ya nahi. Accounting commands record karta hai, unhe kabhi block nahi karta.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "VvFuieyTTSw",
      title: "Free CCNA | Security Fundamentals | Day 48",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The AAA part near the end covers the three A's and RADIUS vs TACACS+ for the exam.", hi: "End ke paas wala AAA part teeno A aur exam ke liye RADIUS vs TACACS+ cover karta hai." },
    },
    {
      id: "LXd2uP1qKDE",
      title: "AAA framework: TACACS+ vs RADIUS",
      channel: "Sunny Classroom",
      lang: "en",
      note: { en: "A short, clear comparison of the two protocols.", hi: "Dono protocols ka chhota aur clear comparison." },
    },
    {
      id: "irxh-vIf9Z4",
      title: "206. CCNP Encore + Enarsi | CCNP Security - How to Configure AAA Server",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walkthrough of setting up AAA with a server; goes a little beyond the CCNA.", hi: "Server ke saath AAA setup ka Hindi walkthrough; CCNA se thoda aage jaata hai." },
    },
    {
      id: "nKeNWnUB7oA",
      title: "Managing AAA Authentication With Tacacs+ Radius Server Security |Latest CCNA Course In Hindi",
      channel: "Shesh Chauhan IT Trainer",
      lang: "hi",
      note: { en: "Hindi lab with TACACS+ and RADIUS login on Cisco devices.", hi: "Cisco devices par TACACS+ aur RADIUS login ka Hindi lab." },
    },
  ],
  lab: {
    title: { en: "Central login with TACACS+ in Packet Tracer", hi: "Packet Tracer mein TACACS+ se central login" },
    steps: [
      { en: "Build a switch SW1 (VLAN 1 SVI 10.1.1.2/24, `ip default-gateway 10.1.1.1`), an admin PC and a Server (10.2.2.100) on another subnet behind router R1. Make sure the PC and SW1 can ping the server.", hi: "Ek switch SW1 (VLAN 1 SVI 10.1.1.2/24, `ip default-gateway 10.1.1.1`), ek admin PC aur router R1 ke peeche doosre subnet par ek Server (10.2.2.100) banao. Check karo ki PC aur SW1 server ko ping kar sakein." },
      { en: "On the Server, open Services > AAA, turn the service on, add SW1 as a client with server type TACACS+ and key T4c-Key-99, and create user neha.", hi: "Server par Services > AAA kholo, service on karo, SW1 ko client add karo server type TACACS+ aur key T4c-Key-99 ke saath, aur user neha banao." },
      { en: "On SW1, create `username backup privilege 15 secret L0cal-Only-99`, then enter `aaa new-model`, the `tacacs server TAC1` block and `aaa authentication login default group tacacs+ local`. Enable SSH as in lesson 4.7. If your Packet Tracer version rejects `tacacs server TAC1`, use the legacy one-line form `tacacs-server host 10.2.2.100 key T4c-Key-99`.", hi: "SW1 par `username backup privilege 15 secret L0cal-Only-99` banao, phir `aaa new-model`, `tacacs server TAC1` block aur `aaa authentication login default group tacacs+ local` daalo. SSH lesson 4.7 ki tarah enable karo. Agar tumhara Packet Tracer version `tacacs server TAC1` accept na kare, toh purana one-line form use karo: `tacacs-server host 10.2.2.100 key T4c-Key-99`." },
      { en: "From the PC, SSH to 10.1.1.2 as neha; it works. Now try to log in as `backup`. The server answers and rejects it (it has no user backup), so you are not let in, even though `backup` exists locally.", hi: "PC se 10.1.1.2 par neha ban kar SSH karo; kaam karega. Ab `backup` se login try karo. Server jawab deta hai aur reject kar deta hai (uske paas backup naam ka user nahi hai), isliye entry nahi milti, bhale hi `backup` local mein bana hai." },
      { en: "Shut the router interface towards the server and log in again as `backup`. It works only now, after the server times out.", hi: "Server ki taraf wala router interface shut karo aur `backup` se dobara login karo. Ab jaakar, server time out hone ke baad, yeh kaam karega." },
    ],
  },
};

export default lesson;
