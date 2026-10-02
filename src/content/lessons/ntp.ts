import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "ntp",
  intro: {
    en: "Every router and switch stamps its log messages with its own clock, and left alone those clocks drift apart by minutes or start in 1993 after a reboot. When an outage spans five devices, you cannot rebuild what happened if their timestamps disagree. NTP (Network Time Protocol) keeps every device's clock within milliseconds of a trusted source, and it is one of the first things you configure on a new network.",
    hi: "Har router aur switch apne log messages par apni clock ka time lagata hai, aur akele chhod do toh yeh clocks minutes ke hisaab se alag ho jaati hain, ya reboot ke baad 1993 se shuru ho jaati hain. Jab outage paanch devices par faila ho aur unke timestamps match na karein, toh tum kabhi pata nahi laga paoge ki asal mein kya hua aur kis order mein hua. NTP (Network Time Protocol) har device ki clock ko ek trusted source se milliseconds ke andar rakhta hai, aur naye network par configure hone wali pehli cheezon mein se ek hai.",
  },
  outcomes: [
    { en: "Explain why logs, certificates, Kerberos and time-based rules all depend on correct time", hi: "Samjha sako ki logs, certificates, Kerberos aur time-based rules sab sahi time par kyun depend karte hain" },
    { en: "Set the clock and time zone by hand and tell the hardware calendar from the software clock", hi: "Clock aur time zone haath se set kar sako aur hardware calendar aur software clock ka fark bata sako" },
    { en: "Work out the stratum of any device in an NTP hierarchy and say what stratum 16 means", hi: "NTP hierarchy mein kisi bhi device ka stratum nikal sako aur bata sako ki stratum 16 ka matlab kya hai" },
    { en: "Configure a Cisco device as an NTP client, an NTP server with `ntp master`, and a symmetric peer", hi: "Cisco device ko NTP client, `ntp master` ke saath NTP server, aur symmetric peer ki tarah configure kar sako" },
    { en: "Verify NTP with `show ntp associations`, `show ntp status` and `show clock detail`", hi: "`show ntp associations`, `show ntp status` aur `show clock detail` se NTP verify kar sako" },
  ],
  sections: [
    {
      id: "why-time",
      heading: { en: "Why the clock matters", hi: "Clock itni zaroori kyun hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A device's clock is not cosmetic. Several things break or become useless when it is wrong:",
            hi: "Device ki clock sirf dikhane ke liye nahi hai. Clock galat ho toh kai cheezein toot jaati hain ya bekaar ho jaati hain:",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Log correlation.** R1 logs an OSPF neighbour going down at 10:20:03 and SW1 logs a link failure at 09:58:10. Were they the same event? You can only tell if both clocks agree. Syslog (lesson 4.6) collects these messages centrally, and the timestamps are what make them useful.", hi: "**Log correlation.** R1 10:20:03 par OSPF neighbour down log karta hai aur SW1 09:58:10 par link failure. Kya yeh ek hi event tha? Yeh tabhi pata chalega jab dono clocks match karein. Syslog (lesson 4.6) yeh messages ek jagah collect karta hai, aur timestamps hi unhe useful banate hain." },
            { en: "**Certificates.** A certificate is valid only between two dates. A device whose clock says 1993 rejects every certificate as not yet valid, so HTTPS management and some VPNs fail.", hi: "**Certificates.** Certificate sirf do dates ke beech valid hota hai. Jis device ki clock 1993 bata rahi hai, woh har certificate ko \"not yet valid\" maan kar reject kar deta hai, toh HTTPS management aur kuch VPNs fail ho jaate hain." },
            { en: "**Kerberos and AAA.** Kerberos rejects tickets when the clocks differ by more than its allowed skew, 5 minutes by default, so logins fail.", hi: "**Kerberos aur AAA.** Kerberos tickets reject kar deta hai jab clocks mein allowed skew se zyada fark ho, default 5 minute, toh logins fail hote hain." },
            { en: "**Time-based rules.** An ACL can be limited to office hours with a time range. With a wrong clock it applies at the wrong hours.", hi: "**Time-based rules.** ACL ko time range se sirf office hours tak limit kiya ja sakta hai. Clock galat ho toh woh galat ghanton mein apply hoti hai." },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          text: {
            en: "CCNA topic 4.2 asks you to configure and verify NTP in client and server mode. Expect questions on stratum numbers, the `ntp server` and `ntp master` commands, and reading `show ntp associations`.",
            hi: "CCNA topic 4.2 mein client aur server mode mein NTP configure aur verify karna aata hai. Stratum numbers, `ntp server` aur `ntp master` commands, aur `show ntp associations` padhne par questions expect karo.",
          },
        },
      ],
    },
    {
      id: "device-clocks",
      heading: { en: "Hardware calendar, software clock and time zone", hi: "Hardware calendar, software clock aur time zone" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A Cisco device can have two clocks. The **hardware calendar** is a battery-backed chip that keeps running while the device is off. The **software clock** (system clock) runs in IOS and is the one used for log timestamps and everything else. At boot, IOS loads the software clock from the calendar. Some platforms, many access switches among them, have no calendar at all, so after a reboot their software clock starts from a default date, often 1 March 1993.",
            hi: "Cisco device mein do clocks ho sakti hain. **Hardware calendar** battery wali chip hai jo device band hone par bhi chalti rehti hai. **Software clock** (system clock) IOS mein chalti hai, aur log timestamps aur baaki sab ke liye yahi use hoti hai. Boot par IOS software clock ko calendar se load karta hai. Kuch platforms par, jinme kai access switches bhi hain, calendar hota hi nahi, toh reboot ke baad unki software clock ek default date se shuru hoti hai, aksar 1 March 1993.",
          },
        },
        {
          type: "cli",
          title: { en: "A switch after a reboot, then set by hand", hi: "Reboot ke baad switch, phir haath se set kiya" },
          lines: [
            { prompt: "SW1#", cmd: "show clock" },
            { out: "*00:02:15.391 UTC Mon Mar 1 1993", comment: { en: "* = the time is not authoritative", hi: "* = time authoritative nahi hai" } },
            { prompt: "SW1#", cmd: "configure terminal" },
            { prompt: "SW1(config)#", cmd: "clock timezone IST 5 30", comment: { en: "name, hours and minutes offset from UTC", hi: "naam, UTC se hours aur minutes ka offset" } },
            { prompt: "SW1(config)#", cmd: "end" },
            { prompt: "SW1#", cmd: "clock set 10:15:00 1 October 2026", comment: { en: "privileged EXEC, not config mode", hi: "privileged EXEC mein, config mode mein nahi" } },
          ],
          note: {
            en: "Set the time zone before `clock set`, because `clock set` takes the time in the current zone. `clock timezone` is a global config command while `clock set` is a privileged EXEC command, a classic exam detail. India has no daylight saving time, so `clock summer-time` is not needed here.",
            hi: "`clock set` se pehle time zone set karo, kyunki `clock set` time ko current zone mein leta hai. `clock timezone` global config command hai jabki `clock set` privileged EXEC command hai, yeh exam ki classic detail hai. India mein daylight saving time nahi hota, toh yahan `clock summer-time` ki zaroorat nahi.",
          },
        },
        {
          type: "table",
          caption: { en: "Moving time between the two clocks", hi: "Dono clocks ke beech time le jaana" },
          columns: [{ en: "Command", hi: "Command" }, { en: "Mode", hi: "Mode" }, { en: "Effect", hi: "Effect" }],
          rows: [
            ["clock set", { en: "Privileged EXEC", hi: "Privileged EXEC" }, { en: "Set the software clock by hand", hi: "Software clock haath se set karta hai" }],
            ["calendar set", { en: "Privileged EXEC", hi: "Privileged EXEC" }, { en: "Set the hardware calendar by hand", hi: "Hardware calendar haath se set karta hai" }],
            ["clock update-calendar", { en: "Privileged EXEC", hi: "Privileged EXEC" }, { en: "Copy the software clock into the calendar", hi: "Software clock ko calendar mein copy karta hai" }],
            ["clock read-calendar", { en: "Privileged EXEC", hi: "Privileged EXEC" }, { en: "Copy the calendar into the software clock", hi: "Calendar ko software clock mein copy karta hai" }],
            ["ntp update-calendar", { en: "Global config", hi: "Global config" }, { en: "Keep updating the calendar from NTP time", hi: "NTP time se calendar ko update karta rehta hai" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Setting clocks by hand does not scale and they drift again within weeks. That is the job NTP takes over.",
            hi: "Clocks ko haath se set karna bade network mein nahi chalta, aur kuch hafton mein woh phir drift kar jaati hain. Yahi kaam NTP sambhalta hai.",
          },
        },
      ],
    },
    {
      id: "stratum",
      heading: { en: "How NTP works: servers, clients and stratum", hi: "NTP kaise kaam karta hai: servers, clients aur stratum" },
      blocks: [
        {
          type: "p",
          text: {
            en: "NTP runs over **UDP port 123**. A client sends a request to a server, the server replies with its timestamps, and the client works out both how far off its own clock is and how long the packet took on the network, so the network delay does not end up in the time. It repeats this every poll interval, starting at 64 seconds on IOS and growing up to 1024 seconds once the clock is stable. A clock that is far off is stepped to the right time in one jump; small errors are corrected gradually. On a LAN this keeps clocks within a few milliseconds.",
            hi: "NTP **UDP port 123** par chalta hai. Client server ko request bhejta hai, server apne timestamps ke saath reply karta hai, aur client nikal leta hai ki uski apni clock kitni aage-peeche hai aur packet ko network par kitna time laga, taaki network delay time mein na jud jaaye. Yeh har poll interval par repeat hota hai, IOS par 64 seconds se shuru, aur clock stable ho jaaye toh 1024 seconds tak badhta hai. Clock bahut aage-peeche ho toh ek jhatke mein sahi time par set ho jaati hai; chhote errors dheere dheere theek hote hain. LAN par isse clocks kuch milliseconds ke andar rehti hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "NTP sources form a hierarchy, and a device's distance from a real reference clock is its **stratum**. Each step down adds one.",
            hi: "NTP sources ek hierarchy banate hain, aur kisi device ki asli reference clock se doori uska **stratum** hai. Har ek step neeche jaane par ek jud jaata hai.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Stratum", hi: "Stratum" }, { en: "What it is", hi: "Yeh kya hai" }, { en: "Example", hi: "Example" }],
          rows: [
            ["0", { en: "A reference clock; not on the network itself", hi: "Reference clock; khud network par nahi hoti" }, { en: "GPS receiver, atomic clock", hi: "GPS receiver, atomic clock" }],
            ["1", { en: "A server directly attached to a stratum 0 clock", hi: "Stratum 0 clock se seedha juda server" }, { en: "NTP-1 with a GPS antenna", hi: "GPS antenna wala NTP-1" }],
            ["2", { en: "Synchronised over the network to a stratum 1 server", hi: "Network par stratum 1 server se synchronised" }, { en: "R1, client of NTP-1", hi: "R1, NTP-1 ka client" }],
            ["3 to 15", { en: "Each further level adds one", hi: "Har agla level ek jodta hai" }, { en: "SW1, client of R1, is stratum 3", hi: "SW1, R1 ka client, stratum 3 hai" }],
            ["16", { en: "Unsynchronised; other devices will not use it as a source", hi: "Unsynchronised; doosre devices ise source nahi banate" }, { en: "A device that has not synced yet", hi: "Aisa device jo abhi sync nahi hua" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          text: {
            en: "Stratum counts hops from a reference clock; it does not measure accuracy directly. A stratum 2 server on your LAN can give better time than a stratum 1 server on another continent, because network delay and jitter matter too.",
            hi: "Stratum reference clock se hops ginta hai; yeh accuracy ko seedha nahi naapta. Tumhare LAN ka stratum 2 server doosre continent ke stratum 1 server se behtar time de sakta hai, kyunki network delay aur jitter bhi matter karte hain.",
          },
        },
      ],
    },
    {
      id: "configure",
      heading: { en: "Configuring NTP: client, server and peer", hi: "NTP configure karna: client, server aur peer" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The network in the animation: NTP-1 (`10.0.0.10`) is a stratum 1 server with a GPS antenna. R1 reaches it on G0/0 (`10.0.0.1`) and serves the switches on G0/1 (`10.1.1.1`). SW1 (`10.1.1.2`) connects to R1, and SW2 (`10.1.1.3`) connects through SW1.",
            hi: "Animation wala network: NTP-1 (`10.0.0.10`) GPS antenna wala stratum 1 server hai. R1 G0/0 (`10.0.0.1`) se usse judta hai aur G0/1 (`10.1.1.1`) par switches ko time deta hai. SW1 (`10.1.1.2`) R1 se juda hai, aur SW2 (`10.1.1.3`) SW1 ke through.",
          },
        },
        {
          type: "cli",
          title: { en: "Client mode: R1 and the switches", hi: "Client mode: R1 aur switches" },
          lines: [
            { prompt: "R1(config)#", cmd: "ntp server 10.0.0.10", comment: { en: "R1 becomes a client of NTP-1", hi: "R1 NTP-1 ka client ban jaata hai" } },
            { prompt: "R1(config)#", cmd: "ntp update-calendar", comment: { en: "also keep the hardware calendar correct", hi: "hardware calendar ko bhi sahi rakho" } },
            { prompt: "SW1(config)#", cmd: "ntp server 10.1.1.1", comment: { en: "the switches use R1", hi: "switches R1 ko use karte hain" } },
            { prompt: "SW2(config)#", cmd: "ntp server 10.1.1.1" },
          ],
          note: {
            en: "Once R1 is synchronised, it also answers NTP requests from other devices. On IOS a synchronised client acts as a server for devices below it with no extra command. Add `prefer` to one of several `ntp server` lines to favour it.",
            hi: "R1 synchronise hone ke baad doosre devices ki NTP requests ka jawab bhi deta hai. IOS par synchronised client bina kisi extra command ke apne neeche wale devices ke liye server ka kaam karta hai. Kai `ntp server` lines hon toh kisi ek ko favour karne ke liye `prefer` jodo.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Server mode with no upstream source.** In a lab, or a site cut off from the internet, there may be no stratum 1 server. `ntp master` tells a router to trust its own clock and serve it. The default stratum is 8; give a number to change it, for example `ntp master 4`. Set that router's clock by hand first, because every client will copy it.",
            hi: "**Bina upstream source ke server mode.** Lab mein, ya internet se kati hui site par, shayad koi stratum 1 server na ho. `ntp master` router ko batata hai ki apni clock par bharosa karo aur use serve karo. Default stratum 8 hai; badalna ho toh number do, jaise `ntp master 4`. Us router ki clock pehle haath se set karo, kyunki har client wahi copy karega.",
          },
        },
        {
          type: "cli",
          title: { en: "Server mode and symmetric peers (separate examples)", hi: "Server mode aur symmetric peers (alag alag examples)" },
          lines: [
            { prompt: "R1(config)#", cmd: "ntp master 4", comment: { en: "R1 serves its own clock as stratum 4", hi: "R1 apni clock stratum 4 ki tarah serve karta hai" } },
            { prompt: "R1(config)#", cmd: "ntp peer 10.0.0.2", comment: { en: "R1 and R2 (10.0.0.2) can sync from each other", hi: "R1 aur R2 (10.0.0.2) ek doosre se sync kar sakte hain" } },
            { prompt: "R1(config)#", cmd: "ntp source Loopback0", comment: { en: "send NTP from the loopback address", hi: "NTP loopback address se bhejo" } },
          ],
          note: {
            en: "With `ntp master`, `show ntp associations` lists 127.127.1.1, which stands for the router's own clock. `ntp peer` (symmetric active mode) is used between two devices at the same level, typically two core routers that each have their own servers: if one loses its source, it can take time from the other.",
            hi: "`ntp master` ke saath `show ntp associations` mein 127.127.1.1 dikhta hai, jiska matlab hai router ki apni clock. `ntp peer` (symmetric active mode) same level ke do devices ke beech use hota hai, aksar do core routers jinke apne apne servers hain: agar ek ka source chala jaaye, toh woh doosre se time le sakta hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          text: {
            en: "`ntp server` makes this device a **client** of the address you give. `ntp master` makes this device a **server** of its own clock. The names feel backwards, and the exam knows it.",
            hi: "`ntp server` is device ko diye gaye address ka **client** banata hai. `ntp master` is device ko apni clock ka **server** banata hai. Naam ulte lagte hain, aur exam ko yeh pata hai.",
          },
        },
      ],
    },
    {
      id: "verify",
      heading: { en: "Verifying NTP", hi: "NTP verify karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Synchronisation is not instant. After you configure `ntp server`, it usually takes several minutes and a few polls before the device trusts the source. Then three commands tell you the state.",
            hi: "Synchronisation turant nahi hota. `ntp server` configure karne ke baad device ko source par bharosa karne mein aam taur par kuch minute aur kuch polls lagte hain. Uske baad teen commands state batate hain.",
          },
        },
        {
          type: "cli",
          title: { en: "R1, synchronised to NTP-1", hi: "R1, NTP-1 se synchronised" },
          lines: [
            { prompt: "R1#", cmd: "show ntp associations" },
            { out: "  address         ref clock       st   when   poll reach  delay  offset   disp" },
            { out: "*~10.0.0.10       .GPS.            1     36     64   377  1.204   0.452  1.312", comment: { en: "* = the source R1 is synced to; st 1", hi: "* = woh source jisse R1 synced hai; st 1" } },
            { out: " * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured" },
            { prompt: "R1#", cmd: "show ntp status" },
            { out: "Clock is synchronized, stratum 2, reference is 10.0.0.10", comment: { en: "R1 is one level below its source", hi: "R1 apne source se ek level neeche hai" } },
            { out: "clock offset is 0.4520 msec, root delay is 1.20 msec" },
            { out: "system poll interval is 64, last update was 36 sec ago." },
          ],
          note: {
            en: "`st` is the source's stratum, not R1's. `ref clock` shows what the source itself syncs to: `.GPS.` for a stratum 1 server, or an IP address for a stratum 2 or lower server. `reach 377` (octal) means the last eight polls all got answers. `offset` and `delay` are in milliseconds.",
            hi: "`st` source ka stratum hai, R1 ka nahi. `ref clock` batata hai ki source khud kisse sync karta hai: stratum 1 server ke liye `.GPS.`, aur stratum 2 ya neeche wale server ke liye ek IP address. `reach 377` (octal) ka matlab aakhri aath polls sabka jawab mila. `offset` aur `delay` milliseconds mein hain.",
          },
        },
        {
          type: "cli",
          title: { en: "SW1, two levels down", hi: "SW1, do level neeche" },
          lines: [
            { prompt: "SW1#", cmd: "show ntp associations" },
            { out: "  address         ref clock       st   when   poll reach  delay  offset   disp" },
            { out: "*~10.1.1.1        10.0.0.10        2     19     64   377  0.811   0.203  1.077", comment: { en: "R1 is stratum 2, so SW1 is stratum 3", hi: "R1 stratum 2 hai, toh SW1 stratum 3 hai" } },
            { out: " * sys.peer, # selected, + candidate, - outlyer, x falseticker, ~ configured" },
            { prompt: "SW1#", cmd: "show clock detail" },
            { out: "10:15:12.204 IST Thu Oct 1 2026\nTime source is NTP", comment: { en: "no * any more: the time is authoritative", hi: "ab * nahi: time authoritative hai" } },
          ],
        },
        {
          type: "p",
          text: {
            en: "If `show ntp status` says `Clock is unsynchronized, stratum 16, no reference clock`, the device has no usable source. Check that the server address is reachable (ping it), that nothing blocks UDP 123, that the server itself is synchronised, and that you have waited long enough. In `show clock`, a leading `*` means the time is not authoritative and a leading `.` means it was set but NTP is currently not synchronised.",
            hi: "Agar `show ntp status` mein `Clock is unsynchronized, stratum 16, no reference clock` aaye, toh device ke paas koi usable source nahi hai. Check karo ki server address reachable hai (ping karo), UDP 123 kahin block nahi ho raha, server khud synchronised hai, aur tumne kaafi der wait kiya hai. `show clock` mein shuru ka `*` matlab time authoritative nahi hai, aur shuru ka `.` matlab time set tha lekin NTP abhi synchronised nahi hai.",
          },
        },
      ],
    },
    {
      id: "authentication",
      heading: { en: "NTP authentication", hi: "NTP authentication" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Without authentication, a client accepts time from anything that answers as its server. An attacker who can fake replies can move clocks, which breaks certificates and hides tracks in the logs. NTP authentication adds a shared key: the client only accepts time from a server whose replies are signed with a trusted key.",
            hi: "Authentication ke bina client kisi se bhi time le leta hai jo uske server ki tarah jawab de. Jo attacker fake replies bhej sake, woh clocks khiska sakta hai, jisse certificates toot jaate hain aur logs mein uske nishaan chhup jaate hain. NTP authentication ek shared key jodta hai: client sirf us server se time leta hai jiske replies trusted key se signed hon.",
          },
        },
        {
          type: "cli",
          title: { en: "R1 as an authenticating client", hi: "R1 authenticate karne wala client" },
          lines: [
            { prompt: "R1(config)#", cmd: "ntp authenticate", comment: { en: "turn authentication on", hi: "authentication on karo" } },
            { prompt: "R1(config)#", cmd: "ntp authentication-key 1 md5 NtpKey123", comment: { en: "key number 1 and its secret", hi: "key number 1 aur uska secret" } },
            { prompt: "R1(config)#", cmd: "ntp trusted-key 1", comment: { en: "key 1 may be used to trust a source", hi: "key 1 se source par trust kiya ja sakta hai" } },
            { prompt: "R1(config)#", cmd: "ntp server 10.0.0.10 key 1", comment: { en: "use key 1 with this server", hi: "is server ke saath key 1 use karo" } },
          ],
          note: {
            en: "The server needs the same key number and secret. For the CCNA, knowing that NTP can be authenticated and recognising these four commands is enough.",
            hi: "Server par bhi same key number aur secret chahiye. CCNA ke liye itna kaafi hai ki NTP authenticate ho sakta hai aur yeh chaar commands pehchaan lo.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "NTP", def: { en: "Network Time Protocol: synchronises device clocks to a reference over UDP port 123.", hi: "Network Time Protocol: UDP port 123 par device clocks ko ek reference se synchronise karta hai." } },
    { term: "Stratum", def: { en: "A device's distance in hops from a reference clock: 0 is the reference, 1 is directly attached, up to 15; 16 means unsynchronised.", hi: "Reference clock se device ki hops mein doori: 0 reference hai, 1 seedha juda hai, 15 tak; 16 ka matlab unsynchronised." } },
    { term: "Reference clock", def: { en: "A stratum 0 time source such as a GPS receiver or atomic clock, attached directly to a stratum 1 server.", hi: "Stratum 0 time source jaise GPS receiver ya atomic clock, jo stratum 1 server se seedha juda hota hai." } },
    { term: "Software clock", def: { en: "The IOS system clock used for log timestamps; it is lost on reload unless a calendar or NTP restores it.", hi: "IOS ki system clock jo log timestamps ke liye use hoti hai; reload par kho jaati hai jab tak calendar ya NTP use wapas na laaye." } },
    { term: "Hardware calendar", def: { en: "A battery-backed clock that keeps time while the device is off; not every platform has one.", hi: "Battery wali clock jo device band hone par bhi time rakhti hai; har platform mein nahi hoti." } },
    { term: "sys.peer", def: { en: "The source a device is currently synchronised to, marked `*` in `show ntp associations`.", hi: "Woh source jisse device abhi synchronised hai, `show ntp associations` mein `*` se marked." } },
    { term: "Symmetric peer", def: { en: "Two NTP devices configured with `ntp peer` that can each synchronise from the other.", hi: "Do NTP devices jo `ntp peer` se configured hain aur ek doosre se synchronise kar sakte hain." } },
  ],
  commands: [
    { cmd: "show clock [detail]", mode: "Cisco privileged EXEC", does: { en: "Show the software clock and, with detail, the time source", hi: "Software clock dikhata hai, aur detail ke saath time source bhi" } },
    { cmd: "clock set 10:15:00 1 October 2026", mode: "Cisco privileged EXEC", does: { en: "Set the software clock by hand", hi: "Software clock haath se set karta hai" } },
    { cmd: "clock timezone IST 5 30", mode: "Cisco global config", does: { en: "Set the time zone name and offset from UTC", hi: "Time zone ka naam aur UTC se offset set karta hai" } },
    { cmd: "clock update-calendar", mode: "Cisco privileged EXEC", does: { en: "Copy the software clock into the hardware calendar", hi: "Software clock ko hardware calendar mein copy karta hai" } },
    { cmd: "ntp server 10.0.0.10 [prefer]", mode: "Cisco global config", does: { en: "Make this device an NTP client of the server", hi: "Is device ko server ka NTP client banata hai" } },
    { cmd: "ntp master [stratum]", mode: "Cisco global config", does: { en: "Serve the device's own clock as an NTP server (default stratum 8)", hi: "Device ki apni clock ko NTP server ki tarah serve karta hai (default stratum 8)" } },
    { cmd: "ntp peer 10.0.0.2", mode: "Cisco global config", does: { en: "Form a symmetric peer relationship", hi: "Symmetric peer relationship banata hai" } },
    { cmd: "ntp update-calendar", mode: "Cisco global config", does: { en: "Keep the hardware calendar updated from NTP", hi: "Hardware calendar ko NTP se update rakhta hai" } },
    { cmd: "ntp source Loopback0", mode: "Cisco global config", does: { en: "Send NTP packets from the loopback address", hi: "NTP packets loopback address se bhejta hai" } },
    { cmd: "ntp authenticate / ntp authentication-key 1 md5 KEY / ntp trusted-key 1", mode: "Cisco global config", does: { en: "Enable NTP authentication and define a trusted key", hi: "NTP authentication enable karta hai aur trusted key define karta hai" } },
    { cmd: "show ntp associations", mode: "Cisco privileged EXEC", does: { en: "List NTP sources with stratum, reach, delay and offset", hi: "NTP sources ko stratum, reach, delay aur offset ke saath dikhata hai" } },
    { cmd: "show ntp status", mode: "Cisco privileged EXEC", does: { en: "Show whether the clock is synchronised, its stratum and reference", hi: "Dikhata hai ki clock synchronised hai ya nahi, uska stratum aur reference" } },
  ],
  mistakes: [
    {
      en: "Mixing up `ntp server` and `ntp master`. `ntp server x.x.x.x` makes the device a client of x.x.x.x; `ntp master` makes it serve its own clock.",
      hi: "`ntp server` aur `ntp master` ko mila dena. `ntp server x.x.x.x` device ko x.x.x.x ka client banata hai; `ntp master` use apni clock serve karne wala banata hai.",
    },
    {
      en: "Reading the `st` column of `show ntp associations` as the local device's stratum. It is the source's stratum; the device itself is one higher.",
      hi: "`show ntp associations` ke `st` column ko local device ka stratum samajhna. Yeh source ka stratum hai; device khud usse ek zyada hai.",
    },
    {
      en: "Thinking a lower stratum is always more accurate. Stratum counts hops, and a nearby stratum 2 server can beat a distant stratum 1.",
      hi: "Yeh sochna ki kam stratum hamesha zyada accurate hota hai. Stratum hops ginta hai, aur paas wala stratum 2 server door wale stratum 1 se behtar ho sakta hai.",
    },
    {
      en: "Typing `clock set` in global config mode. It is a privileged EXEC command, while `clock timezone` is global config.",
      hi: "`clock set` ko global config mode mein type karna. Yeh privileged EXEC command hai, jabki `clock timezone` global config hai.",
    },
    {
      en: "Pointing clients at a server that is itself unsynchronised (stratum 16). The clients will never sync; fix the server's own source first.",
      hi: "Clients ko aise server par point karna jo khud unsynchronised (stratum 16) hai. Clients kabhi sync nahi honge; pehle server ka apna source theek karo.",
    },
    {
      en: "Checking `show ntp status` one minute after configuring and assuming NTP is broken. Synchronisation usually takes several minutes.",
      hi: "Configure karne ke ek minute baad `show ntp status` dekh kar maan lena ki NTP kharab hai. Synchronisation mein aam taur par kuch minute lagte hain.",
    },
  ],
  recap: [
    { en: "Correct time is needed for log correlation, certificates, Kerberos and time-based ACLs.", hi: "Log correlation, certificates, Kerberos aur time-based ACLs ke liye sahi time zaroori hai." },
    { en: "Hardware calendar survives power-off; the software clock is what IOS uses. `clock set` is privileged EXEC, `clock timezone IST 5 30` is global config.", hi: "Hardware calendar power-off ke baad bhi chalta hai; IOS software clock use karta hai. `clock set` privileged EXEC hai, `clock timezone IST 5 30` global config." },
    { en: "NTP uses UDP 123. Stratum 0 is the reference clock, 1 is directly attached, each hop adds one, 15 is the maximum and 16 means unsynchronised.", hi: "NTP UDP 123 use karta hai. Stratum 0 reference clock hai, 1 seedha juda, har hop par ek judta hai, 15 maximum hai aur 16 matlab unsynchronised." },
    { en: "`ntp server` = be a client; `ntp master [stratum]` = serve your own clock (default 8); `ntp peer` = symmetric peers.", hi: "`ntp server` = client bano; `ntp master [stratum]` = apni clock serve karo (default 8); `ntp peer` = symmetric peers." },
    { en: "`show ntp associations`: `*` marks the sys.peer and `st` is the source's stratum. `show ntp status` gives your own stratum.", hi: "`show ntp associations`: `*` sys.peer ko mark karta hai aur `st` source ka stratum hai. `show ntp status` tumhara apna stratum batata hai." },
    { en: "Authentication: `ntp authenticate`, `ntp authentication-key`, `ntp trusted-key`, and `key` on the `ntp server` line.", hi: "Authentication: `ntp authenticate`, `ntp authentication-key`, `ntp trusted-key`, aur `ntp server` line par `key`." },
  ],
  quiz: [
    {
      q: {
        en: "SW1 is an NTP client of R1. R1 is a client of a server that is synchronised to a stratum 1 server. What stratum is SW1?",
        hi: "SW1 R1 ka NTP client hai. R1 ek aise server ka client hai jo stratum 1 server se synchronised hai. SW1 ka stratum kya hai?",
      },
      options: [
        { en: "2", hi: "2" },
        { en: "4", hi: "4" },
        { en: "3", hi: "3" },
        { en: "16", hi: "16" },
      ],
      answer: 1,
      explain: {
        en: "Count down from the stratum 1 server: its client is stratum 2, R1 (a client of that) is stratum 3, and SW1 (a client of R1) is stratum 4. 16 would mean SW1 is not synchronised at all.",
        hi: "Stratum 1 server se neeche gino: uska client stratum 2 hai, R1 (uska client) stratum 3, aur SW1 (R1 ka client) stratum 4. 16 ka matlab hota ki SW1 synchronised hi nahi hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "A lab has no internet access. You want R1 to act as the time source for every other device using its own clock. Which command do you configure on R1?",
        hi: "Lab mein internet nahi hai. Tum chahte ho ki R1 apni clock se baaki sab devices ka time source bane. R1 par kaunsi command configure karoge?",
      },
      options: [
        { en: "ntp server 127.0.0.1", hi: "ntp server 127.0.0.1" },
        { en: "ntp peer 10.0.0.1", hi: "ntp peer 10.0.0.1" },
        { en: "clock set", hi: "clock set" },
        { en: "ntp master", hi: "ntp master" },
      ],
      answer: 3,
      explain: {
        en: "`ntp master` makes the router trust its own clock and serve it, at stratum 8 by default. `ntp server` would make R1 a client, `ntp peer` needs another NTP device, and `clock set` only sets R1's own time without serving it to anyone.",
        hi: "`ntp master` router ko apni clock par bharosa karke use serve karne deta hai, default stratum 8 par. `ntp server` R1 ko client banata, `ntp peer` ke liye doosra NTP device chahiye, aur `clock set` sirf R1 ka apna time set karta hai, kisi ko serve nahi karta.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "`show ntp associations` on SW2 shows `*~10.1.1.1   10.0.0.10   2   19   64   377   0.811   0.203   1.077`. What does it tell you?",
        hi: "SW2 par `show ntp associations` mein `*~10.1.1.1   10.0.0.10   2   19   64   377   0.811   0.203   1.077` dikhta hai. Isse kya pata chalta hai?",
      },
      options: [
        { en: "SW2 is synchronised to 10.1.1.1, a stratum 2 source, so SW2 is stratum 3", hi: "SW2 10.1.1.1 se synchronised hai, jo stratum 2 source hai, toh SW2 stratum 3 hai" },
        { en: "SW2 is stratum 2 and synchronised directly to 10.0.0.10", hi: "SW2 stratum 2 hai aur seedha 10.0.0.10 se synchronised hai" },
        { en: "10.1.1.1 is configured but has never answered", hi: "10.1.1.1 configured hai lekin kabhi jawab nahi diya" },
        { en: "SW2 is 377 milliseconds away from 10.1.1.1", hi: "SW2 10.1.1.1 se 377 milliseconds door hai" },
      ],
      answer: 0,
      explain: {
        en: "`*` marks the sys.peer, the source SW2 is synced to, and `~` means it was configured. `st 2` is the source's stratum, so SW2 is one higher, stratum 3. `ref clock 10.0.0.10` is what 10.1.1.1 itself syncs to. `reach 377` (octal) means the last eight polls succeeded; it is not a delay.",
        hi: "`*` sys.peer ko mark karta hai, yaani woh source jisse SW2 synced hai, aur `~` matlab configured hai. `st 2` source ka stratum hai, toh SW2 usse ek zyada, stratum 3 hai. `ref clock 10.0.0.10` woh hai jisse 10.1.1.1 khud sync karta hai. `reach 377` (octal) matlab aakhri aath polls successful the; yeh delay nahi hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "Right after a reload, `show clock` on a switch shows `*00:02:15.391 UTC Mon Mar 1 1993`. What does the leading `*` mean?",
        hi: "Reload ke turant baad switch par `show clock` mein `*00:02:15.391 UTC Mon Mar 1 1993` dikhta hai. Shuru ke `*` ka matlab kya hai?",
      },
      options: [
        { en: "The clock is synchronised to an NTP server", hi: "Clock NTP server se synchronised hai" },
        { en: "Daylight saving time is active", hi: "Daylight saving time active hai" },
        { en: "The time is not authoritative; nothing has set or synchronised it", hi: "Time authoritative nahi hai; kisi ne use set ya synchronise nahi kiya" },
        { en: "The hardware calendar battery has failed", hi: "Hardware calendar ki battery kharab ho gayi hai" },
      ],
      answer: 2,
      explain: {
        en: "A leading `*` means the time is not authoritative. Here the switch has no calendar, so after the reload its software clock started from a default date and nothing has corrected it. Once NTP synchronises the clock, the `*` disappears. A missing calendar is normal on many switches, not a battery fault.",
        hi: "Shuru ka `*` matlab time authoritative nahi hai. Yahan switch mein calendar nahi hai, toh reload ke baad uski software clock ek default date se shuru hui aur kisi ne use theek nahi kiya. NTP clock synchronise kar de, toh `*` hat jaata hai. Kai switches mein calendar na hona normal hai, battery fault nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "SW1 has `ntp server 10.1.1.1` configured and never synchronises. Ping to 10.1.1.1 works. On R1 (10.1.1.1), `show ntp status` says `Clock is unsynchronized, stratum 16, no reference clock`. What is the real problem?",
        hi: "SW1 par `ntp server 10.1.1.1` configured hai aur woh kabhi synchronise nahi hota. 10.1.1.1 ka ping chalta hai. R1 (10.1.1.1) par `show ntp status` kehta hai `Clock is unsynchronized, stratum 16, no reference clock`. Asli problem kya hai?",
      },
      options: [
        { en: "SW1 needs `ntp master` instead of `ntp server`", hi: "SW1 par `ntp server` ki jagah `ntp master` chahiye" },
        { en: "UDP port 123 must be changed to TCP", hi: "UDP port 123 ko TCP mein badalna hoga" },
        { en: "SW1 needs `ntp update-calendar`", hi: "SW1 par `ntp update-calendar` chahiye" },
        { en: "R1 itself has no synchronised source, so it cannot give SW1 usable time", hi: "R1 ke paas khud koi synchronised source nahi hai, toh woh SW1 ko usable time nahi de sakta" },
      ],
      answer: 3,
      explain: {
        en: "Stratum 16 means R1 is unsynchronised, and clients do not synchronise to a stratum 16 source. Fix R1 first: point it at a working server with `ntp server`, or make it the source with `ntp master`. NTP always uses UDP 123, and `ntp update-calendar` only copies NTP time into the hardware calendar.",
        hi: "Stratum 16 matlab R1 unsynchronised hai, aur clients stratum 16 source se synchronise nahi hote. Pehle R1 theek karo: `ntp server` se use kisi chalte server par point karo, ya `ntp master` se use source banao. NTP hamesha UDP 123 use karta hai, aur `ntp update-calendar` sirf NTP time ko hardware calendar mein copy karta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A firewall between R1 and its NTP server must allow NTP. Which protocol and port do you permit?",
        hi: "R1 aur uske NTP server ke beech ek firewall ko NTP allow karna hai. Kaunsa protocol aur port permit karoge?",
      },
      options: [
        { en: "UDP 123", hi: "UDP 123" },
        { en: "TCP 123", hi: "TCP 123" },
        { en: "UDP 161", hi: "UDP 161" },
        { en: "UDP 514", hi: "UDP 514" },
      ],
      answer: 0,
      explain: {
        en: "NTP uses UDP port 123. TCP is not used for NTP. UDP 161 is SNMP (lesson 4.5) and UDP 514 is syslog (lesson 4.6), two other services you will meet next.",
        hi: "NTP UDP port 123 use karta hai. NTP ke liye TCP use nahi hota. UDP 161 SNMP hai (lesson 4.5) aur UDP 514 syslog hai (lesson 4.6), do aur services jo tum aage padhoge.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "qGJaJx7OfUo",
      title: "Free CCNA | NTP | Day 37",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Clocks, time zones, stratum, and NTP client, server and peer configuration.", hi: "Clocks, time zones, stratum, aur NTP client, server aur peer configuration." },
    },
    {
      id: "wyPNBJyzzWU",
      title: "75. Free CCNA (NEW) | NTP - Network Time Protocol | NTP Server",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of NTP and NTP server configuration.", hi: "NTP aur NTP server configuration ka Hindi explanation." },
    },
  ],
  lab: {
    title: { en: "Build an NTP hierarchy in Packet Tracer", hi: "Packet Tracer mein NTP hierarchy banao" },
    steps: [
      {
        en: "Place a Server as NTP-1 (10.0.0.10/24) and connect it to R1 G0/0 (10.0.0.1/24). Connect R1 G0/1 (10.1.1.1/24) to SW1, and give SW1 the management address 10.1.1.2/24 on VLAN 1. Run `show clock` on R1 and SW1 and note how far apart they are.",
        hi: "NTP-1 ke liye ek Server rakho (10.0.0.10/24) aur use R1 G0/0 (10.0.0.1/24) se jodo. R1 G0/1 (10.1.1.1/24) ko SW1 se jodo, aur SW1 ko VLAN 1 par management address 10.1.1.2/24 do. R1 aur SW1 par `show clock` chalao aur dekho dono kitne alag hain.",
      },
      {
        en: "On the Server, open Services > NTP and make sure the service is on. On real gear or an emulator, use a router with `clock timezone IST 5 30`, `clock set` and `ntp master 1` instead.",
        hi: "Server par Services > NTP kholo aur dekho service on hai. Real gear ya emulator par iski jagah ek router lo jisme `clock timezone IST 5 30`, `clock set` aur `ntp master 1` ho.",
      },
      {
        en: "On R1 configure `ntp server 10.0.0.10`. Wait a few minutes, then check `show ntp associations` for the `*` and `show ntp status` for stratum 2.",
        hi: "R1 par `ntp server 10.0.0.10` configure karo. Kuch minute wait karo, phir `show ntp associations` mein `*` aur `show ntp status` mein stratum 2 dekho.",
      },
      {
        en: "On SW1 configure `ntp server 10.1.1.1` and confirm it reaches stratum 3. Compare `show clock detail` before and after.",
        hi: "SW1 par `ntp server 10.1.1.1` configure karo aur confirm karo ki woh stratum 3 par pahunche. `show clock detail` pehle aur baad mein compare karo.",
      },
      {
        en: "Turn the NTP service off on NTP-1 (or shut R1 G0/0) and watch what `show ntp associations` on R1 and SW1 report over the next minutes.",
        hi: "NTP-1 par NTP service off karo (ya R1 G0/0 shut karo) aur dekho agle kuch minutes mein R1 aur SW1 par `show ntp associations` kya report karta hai.",
      },
    ],
  },
};

export default lesson;
