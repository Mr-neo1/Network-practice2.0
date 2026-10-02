import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "syslog",
  intro: {
    en: "Routers and switches constantly report what happens to them: a link goes down, an OSPF neighbour comes up, someone changes the configuration. These reports are syslog messages. Knowing how to read them, filter them by severity and collect them on a central server is how you find out what broke at 3 a.m. and why.",
    hi: "Routers aur switches lagaataar report karte rehte hain ki unke saath kya ho raha hai: link down hua, OSPF neighbour up aaya, kisi ne configuration badli. Yeh reports syslog messages hain. Inhe padhna, severity se filter karna aur central server par collect karna aana chahiye, tabhi pata chalega ki raat 3 baje kya toota aur kyun.",
  },
  outcomes: [
    { en: "Read every field of a Cisco syslog message, including facility, severity and mnemonic", hi: "Cisco syslog message ka har field padh sako, facility, severity aur mnemonic ke saath" },
    { en: "List the eight severity levels in order, with their numbers and IOS keywords", hi: "Aath severity levels order mein bata sako, unke numbers aur IOS keywords ke saath" },
    { en: "Predict which messages a destination shows for a given logging level", hi: "Predict kar sako ki kisi logging level par destination kaunse messages dikhayega" },
    { en: "Configure console, VTY, buffer and syslog server logging on IOS", hi: "IOS par console, VTY, buffer aur syslog server logging configure kar sako" },
    { en: "Verify logging with show logging and fix common surprises such as missing VTY messages", hi: "show logging se logging verify kar sako aur VTY messages na dikhne jaise common surprises fix kar sako" },
  ],
  sections: [
    {
      id: "why-syslog",
      heading: { en: "Why logs, and why a central server", hi: "Logs kyun, aur central server kyun" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every Cisco device generates log messages for events: interface changes, routing neighbour changes, configuration changes, security events, hardware warnings. By default they are printed on the console. That is fine when you are sitting at the console, but useless for 200 devices nobody is watching.",
            hi: "Har Cisco device events ke liye log messages banata hai: interface changes, routing neighbour changes, configuration changes, security events, hardware warnings. By default yeh console par print hote hain. Jab tum khud console par baithe ho tab theek hai, lekin 200 devices jinhe koi dekh nahi raha, unke liye bekaar.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Syslog** is a standard protocol for sending these messages over the network to a **syslog server**, which stores them, lets you search them, and keeps them after the device reboots. In this lesson the server is `10.1.1.50`, the same box that runs the SNMP manager from the previous lesson.",
            hi: "**Syslog** ek standard protocol hai jo in messages ko network par **syslog server** tak bhejta hai, jo unhe store karta hai, search karne deta hai, aur device reboot hone ke baad bhi sambhal kar rakhta hai. Is lesson mein server `10.1.1.50` hai, wahi box jis par pichhle lesson ka SNMP manager chalta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Logs need the right time", hi: "Logs ko sahi time chahiye" },
          text: {
            en: "A message saying a link went down is only useful if you know when. With all devices synced by NTP (lesson 4.4), you can line up events from R1, SW1 and the firewall to the millisecond and see which failure came first.",
            hi: "Link down hone wala message tabhi kaam ka hai jab pata ho ki kab hua. Saare devices NTP (lesson 4.4) se synced hon, toh R1, SW1 aur firewall ke events ko millisecond tak line up karke dekh sakte ho ki pehle kaunsa failure hua.",
          },
        },
      ],
    },
    {
      id: "message-format",
      heading: { en: "Reading a syslog message", hi: "Syslog message padhna" },
      blocks: [
        {
          type: "cli",
          title: { en: "One message from R1", hi: "R1 ka ek message" },
          lines: [{ out: "000040: Oct  1 09:21:13.502: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down" }],
        },
        {
          type: "table",
          columns: [{ en: "Part", hi: "Hissa" }, { en: "In the example", hi: "Example mein" }, { en: "Meaning", hi: "Matlab" }],
          rows: [
            [{ en: "Sequence number", hi: "Sequence number" }, "000040", { en: "Message counter; shown only with `service sequence-numbers`", hi: "Message counter; sirf `service sequence-numbers` ke saath dikhta hai" }],
            [{ en: "Timestamp", hi: "Timestamp" }, "Oct  1 09:21:13.502", { en: "When it happened; format set by `service timestamps`", hi: "Kab hua; format `service timestamps` se set hota hai" }],
            [{ en: "Facility", hi: "Facility" }, "LINK", { en: "The part of the system that generated it", hi: "System ka woh hissa jisne message banaya" }],
            [{ en: "Severity", hi: "Severity" }, "3", { en: "How serious it is, 0 (worst) to 7", hi: "Kitna serious hai, 0 (sabse bura) se 7 tak" }],
            [{ en: "Mnemonic", hi: "Mnemonic" }, "UPDOWN", { en: "Short code for the type of event", hi: "Event type ka short code" }],
            [{ en: "Description", hi: "Description" }, "Interface GigabitEthernet0/1, changed state to down", { en: "Human-readable detail", hi: "Insaan ke padhne layak detail" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "The pattern to memorise is `%FACILITY-SEVERITY-MNEMONIC: description`. Other examples: `%LINEPROTO-5-UPDOWN` (line protocol state), `%SYS-5-CONFIG_I` (someone left config mode), `%OSPF-5-ADJCHG` (an OSPF neighbour changed state). Note that a cable failure and a `shutdown` produce different LINK messages: a failure logs `%LINK-3-UPDOWN ... changed state to down`, while `shutdown` logs `%LINK-5-CHANGED ... changed state to administratively down` at severity 5.",
            hi: "Yaad rakhne wala pattern hai `%FACILITY-SEVERITY-MNEMONIC: description`. Aur examples: `%LINEPROTO-5-UPDOWN` (line protocol ki state), `%SYS-5-CONFIG_I` (kisi ne config mode chhoda), `%OSPF-5-ADJCHG` (OSPF neighbour ki state badli). Dhyan do, cable fail hone par aur `shutdown` karne par alag LINK messages aate hain: failure par `%LINK-3-UPDOWN ... changed state to down`, jabki `shutdown` par `%LINK-5-CHANGED ... changed state to administratively down`, severity 5 ke saath.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Asterisk before the time**, as in `*Mar  1 00:41:07.123`: the clock is not authoritative, typically because it is not synced to NTP. Treat that time with suspicion.",
              hi: "**Time se pehle asterisk**, jaise `*Mar  1 00:41:07.123`: clock authoritative nahi hai, aam taur par isliye kyunki NTP se synced nahi hai. Aise time par bharosa mat karo.",
            },
            {
              en: "**Two meanings of facility**: in the Cisco message it names the source (LINK, SYS, OSPF). When a message is sent to a server it is also tagged with a syslog facility code, `local7` by default on IOS, which the server can use to sort messages from different device types.",
              hi: "**Facility ke do matlab**: Cisco message mein yeh source batata hai (LINK, SYS, OSPF). Jab message server ko jaata hai, toh uspar ek syslog facility code bhi lagta hai, IOS par default `local7`, jisse server alag-alag device types ke messages sort kar sakta hai.",
            },
          ],
        },
      ],
    },
    {
      id: "severity-levels",
      heading: { en: "The eight severity levels", hi: "Aath severity levels" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Level", hi: "Level" }, { en: "Name", hi: "Naam" }, { en: "IOS keyword", hi: "IOS keyword" }, { en: "Example", hi: "Example" }],
          rows: [
            ["0", "Emergency", "emergencies", { en: "System is unusable", hi: "System use karne layak nahi" }],
            ["1", "Alert", "alerts", { en: "Immediate action needed", hi: "Turant action chahiye" }],
            ["2", "Critical", "critical", "%SPANTREE-2-BLOCK_BPDUGUARD"],
            ["3", "Error", "errors", "%LINK-3-UPDOWN"],
            ["4", "Warning", "warnings", "%CDP-4-NATIVE_VLAN_MISMATCH"],
            ["5", "Notice", "notifications", "%LINEPROTO-5-UPDOWN, %SYS-5-CONFIG_I"],
            ["6", "Informational", "informational", "%SYS-6-LOGGINGHOST_STARTSTOP"],
            ["7", "Debugging", "debugging", { en: "Output of `debug` commands", hi: "`debug` commands ka output" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Memory aid", hi: "Yaad rakhne ka tareeka" },
          text: {
            en: "**E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**ce cream **D**aily: Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debugging, from 0 to 7.",
            hi: "**E**very **A**wesome **C**isco **E**ngineer **W**ill **N**eed **I**ce cream **D**aily: Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debugging, 0 se 7 tak.",
          },
        },
        {
          type: "p",
          text: {
            en: "The lower the number, the more serious the message. When you set a logging level, the device sends that level **and every more severe level**. `logging console warnings` (or `logging console 4`) shows levels 0, 1, 2, 3 and 4, and hides 5, 6 and 7.",
            hi: "Number jitna chhota, message utna serious. Jab tum logging level set karte ho, device woh level **aur usse zyada severe saare levels** bhejta hai. `logging console warnings` (ya `logging console 4`) levels 0, 1, 2, 3 aur 4 dikhata hai, aur 5, 6, 7 chhupa deta hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Know all eight levels in order with their numbers. A typical question: \"`logging trap 5` is configured. Which levels reach the server?\" Answer: 0 through 5. You can type the number or the keyword; IOS stores the keyword.",
            hi: "Aathon levels order mein unke numbers ke saath yaad hone chahiye. Typical sawaal: \"`logging trap 5` configured hai. Server tak kaunse levels pahunchenge?\" Jawab: 0 se 5 tak. Number type karo ya keyword; IOS keyword store karta hai.",
          },
        },
      ],
    },
    {
      id: "destinations",
      heading: { en: "Where messages go", hi: "Messages kahan jaate hain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Each message can go to four places at once, and each destination has its own level. A message appears at a destination only if its severity is at or below that destination's level number.",
            hi: "Har message ek saath chaar jagah ja sakta hai, aur har destination ka apna level hota hai. Message kisi destination par tabhi dikhta hai jab uski severity us destination ke level number ke barabar ya usse kam ho.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Destination", hi: "Destination" }, { en: "Level command", hi: "Level command" }, { en: "What to know", hi: "Kya jaanna zaroori hai" }],
          rows: [
            [{ en: "Console line", hi: "Console line" }, "logging console <level>", { en: "On by default at debugging; you see messages only while connected to the console port", hi: "By default on hai, debugging par; messages tabhi dikhte hain jab console port se connected ho" }],
            [{ en: "VTY lines (Telnet/SSH)", hi: "VTY lines (Telnet/SSH)" }, "logging monitor <level>", { en: "Not shown until you type `terminal monitor` in that session; it is not saved and must be repeated after each login", hi: "Jab tak us session mein `terminal monitor` type na karo, nahi dikhte; yeh save nahi hota, har login ke baad dobara karna padta hai" }],
            [{ en: "Buffer (RAM)", hi: "Buffer (RAM)" }, "logging buffered [size] <level>", { en: "Read with `show logging`; lost on reload", hi: "`show logging` se padho; reload par saaf ho jaata hai" }],
            [{ en: "Syslog server", hi: "Syslog server" }, "logging trap <level>", { en: "Set the address with `logging host <ip>`; sent on UDP 514; default level informational", hi: "Address `logging host <ip>` se set karo; UDP 514 par jaata hai; default level informational" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "\"trap\" here is not SNMP", hi: "Yahan \"trap\" ka SNMP se lena-dena nahi" },
          text: {
            en: "`logging trap` sets the severity level for the syslog server. It has nothing to do with SNMP Traps from the previous lesson, even though the word is the same.",
            hi: "`logging trap` syslog server ke liye severity level set karta hai. Pichhle lesson ke SNMP Traps se iska koi lena-dena nahi, bhale hi word same hai.",
          },
        },
      ],
    },
    {
      id: "configure",
      heading: { en: "Configuring logging on IOS", hi: "IOS par logging configure karna" },
      blocks: [
        {
          type: "cli",
          title: { en: "A typical logging setup on R1", hi: "R1 par typical logging setup" },
          lines: [
            { prompt: "R1(config)#", cmd: "service timestamps log datetime msec", comment: { en: "Date and time to the millisecond on every message", hi: "Har message par date aur millisecond tak time" } },
            { prompt: "R1(config)#", cmd: "service sequence-numbers", comment: { en: "Number every message", hi: "Har message ko number do" } },
            { prompt: "R1(config)#", cmd: "logging console warnings", comment: { en: "Console: levels 0-4 only", hi: "Console: sirf levels 0-4" } },
            { prompt: "R1(config)#", cmd: "logging buffered 16384 informational", comment: { en: "16 KB buffer, levels 0-6", hi: "16 KB buffer, levels 0-6" } },
            { prompt: "R1(config)#", cmd: "logging host 10.1.1.50", comment: { en: "Syslog server, UDP 514", hi: "Syslog server, UDP 514" } },
            { prompt: "R1(config)#", cmd: "logging trap informational", comment: { en: "Server: levels 0-6", hi: "Server: levels 0-6" } },
            { prompt: "R1(config)#", cmd: "line console 0" },
            { prompt: "R1(config-line)#", cmd: "logging synchronous", comment: { en: "Messages no longer break up what you are typing", hi: "Messages ab tumhari typing ke beech mein nahi ghuste" } },
            { prompt: "R1(config-line)#", cmd: "line vty 0 15" },
            { prompt: "R1(config-line)#", cmd: "logging synchronous" },
          ],
          note: {
            en: "Many IOS images already include `service timestamps log datetime msec` in their default configuration; check with `show running-config | include timestamps`. The older form `logging 10.1.1.50` does the same as `logging host 10.1.1.50`.",
            hi: "Bahut si IOS images ki default configuration mein `service timestamps log datetime msec` pehle se hota hai; `show running-config | include timestamps` se check karo. Purana form `logging 10.1.1.50` bhi wahi karta hai jo `logging host 10.1.1.50`.",
          },
        },
        {
          type: "p",
          text: {
            en: "Without `logging synchronous`, a message can land in the middle of a command you are typing, leaving the line jumbled. With it, IOS prints the message and then reprints your prompt and the partial command so you can carry on.",
            hi: "`logging synchronous` ke bina message tumhari type ho rahi command ke beech mein aa sakta hai, aur line gadbad ho jaati hai. Iske saath IOS pehle message print karta hai, phir tumhara prompt aur aadhi command dobara print karta hai, taaki tum aage type kar sako.",
          },
        },
        {
          type: "cli",
          title: { en: "Seeing logs over SSH", hi: "SSH par logs dekhna" },
          lines: [
            { prompt: "R1#", cmd: "terminal monitor", comment: { en: "This VTY session now shows log messages", hi: "Ab is VTY session mein log messages dikhenge" } },
            { prompt: "R1#", cmd: "terminal no monitor", comment: { en: "Turn it off again", hi: "Wapas band karo" } },
          ],
        },
      ],
    },
    {
      id: "verify",
      heading: { en: "Checking it: show logging", hi: "Check karna: show logging" },
      blocks: [
        {
          type: "cli",
          title: { en: "Destinations and levels (shortened)", hi: "Destinations aur levels (chhota kiya hua)" },
          lines: [
            { prompt: "R1#", cmd: "show logging" },
            { out: "    Console logging: level warnings, 39 messages logged, xml disabled," },
            { out: "    Monitor logging: level debugging, 0 messages logged, xml disabled," },
            { out: "    Buffer logging:  level informational, 3 messages logged, xml disabled," },
            { out: "    Trap logging: level informational, 41 message lines logged", comment: { en: "\"Trap logging\" means the syslog server", hi: "\"Trap logging\" ka matlab syslog server" } },
            { out: "        Logging to 10.1.1.50  (udp port 514, audit disabled," },
            { out: "              link up)," },
            { out: "              4 message lines logged," },
            { out: "Log Buffer (16384 bytes):" },
            { out: "000039: Oct  1 09:19:02.774: %SYS-5-CONFIG_I: Configured from console by console" },
            { out: "000040: Oct  1 09:21:13.502: %LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down" },
            { out: "000041: Oct  1 09:21:14.502: %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to down" },
          ],
          note: {
            en: "The buffer is cleared on reload and is limited in size, so older messages are overwritten. That is why production networks always send logs to a server too.",
            hi: "Reload par buffer saaf ho jaata hai aur uska size limited hai, isliye purane messages overwrite ho jaate hain. Isiliye production networks hamesha logs server par bhi bhejte hain.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Syslog and SNMP side by side", hi: "Syslog aur SNMP saath-saath" },
          text: {
            en: "Both feed a monitoring system. **Syslog** pushes text messages about events to a server on UDP 514. **SNMP** lets a manager poll structured values from the MIB on UDP 161 and receive Traps or Informs on UDP 162.",
            hi: "Dono monitoring system ko data dete hain. **Syslog** events ke text messages server ko UDP 514 par push karta hai. **SNMP** manager ko MIB se structured values UDP 161 par poll karne deta hai aur UDP 162 par Traps ya Informs receive karne deta hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Syslog", def: { en: "A standard protocol for sending log messages to a central server, on UDP 514.", hi: "Log messages ko central server tak bhejne ka standard protocol, UDP 514 par." } },
    { term: "Severity level", def: { en: "A number from 0 (emergency) to 7 (debugging) that says how serious a message is.", hi: "0 (emergency) se 7 (debugging) tak ka number jo batata hai message kitna serious hai." } },
    { term: "Facility", def: { en: "In a Cisco message, the part of the system that generated it, such as LINK or OSPF.", hi: "Cisco message mein system ka woh hissa jisne message banaya, jaise LINK ya OSPF." } },
    { term: "Mnemonic", def: { en: "The short code after the severity that names the event, such as UPDOWN or ADJCHG.", hi: "Severity ke baad ka short code jo event ka naam batata hai, jaise UPDOWN ya ADJCHG." } },
    { term: "Logging buffer", def: { en: "An area of RAM where the device keeps recent messages, read with show logging.", hi: "RAM ka woh hissa jahan device recent messages rakhta hai, show logging se padhte hain." } },
    { term: "terminal monitor", def: { en: "The command that makes a Telnet or SSH session display log messages.", hi: "Woh command jisse Telnet ya SSH session mein log messages dikhne lagte hain." } },
    { term: "logging synchronous", def: { en: "A line setting that reprints your partial command after a log message interrupts it.", hi: "Line setting jo log message ke beech mein aane ke baad tumhari aadhi command dobara print karti hai." } },
  ],
  commands: [
    { cmd: "logging console <level>", mode: "Global configuration", does: { en: "Set the console level: that severity and every more severe one are shown", hi: "Console ka level set karta hai: woh severity aur usse zyada severe saari dikhti hain" } },
    { cmd: "logging monitor <level>", mode: "Global configuration", does: { en: "Set the level for VTY (Telnet/SSH) sessions", hi: "VTY (Telnet/SSH) sessions ka level set karta hai" } },
    { cmd: "logging buffered [size] <level>", mode: "Global configuration", does: { en: "Keep messages in a RAM buffer of this size, at this level", hi: "Messages ko is size ke RAM buffer mein, is level par rakhta hai" } },
    { cmd: "logging host <ip>", mode: "Global configuration", does: { en: "Send messages to a syslog server on UDP 514", hi: "Messages ko UDP 514 par syslog server ko bhejta hai" } },
    { cmd: "logging trap <level>", mode: "Global configuration", does: { en: "Set the level sent to syslog servers (default informational)", hi: "Syslog servers ko jaane wala level set karta hai (default informational)" } },
    { cmd: "service timestamps log datetime msec", mode: "Global configuration", does: { en: "Add date and time with milliseconds to log messages", hi: "Log messages mein milliseconds ke saath date aur time jodta hai" } },
    { cmd: "service sequence-numbers", mode: "Global configuration", does: { en: "Add a sequence number to every message", hi: "Har message mein sequence number jodta hai" } },
    { cmd: "logging synchronous", mode: "Line configuration", does: { en: "Stop log messages from breaking up typed commands", hi: "Log messages ko type ho rahi commands ke beech ghusne se rokta hai" } },
    { cmd: "terminal monitor", mode: "Privileged EXEC", does: { en: "Show log messages in the current Telnet or SSH session", hi: "Current Telnet ya SSH session mein log messages dikhata hai" } },
    { cmd: "show logging", mode: "Privileged EXEC", does: { en: "Show logging settings per destination and the buffer contents", hi: "Har destination ki logging settings aur buffer ka content dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Reading the levels backwards. 0 is the most severe (emergency) and 7 the least (debugging); `logging trap 4` sends 0-4, not 4-7.",
      hi: "Levels ulte padhna. 0 sabse severe (emergency) hai aur 7 sabse kam (debugging); `logging trap 4` 0-4 bhejta hai, 4-7 nahi.",
    },
    {
      en: "Logging in over SSH and wondering why no messages appear. VTY sessions need `terminal monitor`, typed again in every new session.",
      hi: "SSH se login karke sochna ki messages kyun nahi aa rahe. VTY sessions ko `terminal monitor` chahiye, aur har naye session mein dobara type karna padta hai.",
    },
    {
      en: "Confusing `logging trap` with SNMP Traps. `logging trap` only sets the syslog server level.",
      hi: "`logging trap` ko SNMP Traps samajh lena. `logging trap` sirf syslog server ka level set karta hai.",
    },
    {
      en: "Relying on the buffer alone. It is cleared on reload, so the messages explaining a crash are gone exactly when you need them; send logs to a server as well.",
      hi: "Sirf buffer par bharosa karna. Reload par yeh saaf ho jaata hai, toh crash samjhane wale messages theek usi waqt gayab hote hain jab unki zaroorat hai; logs server par bhi bhejo.",
    },
    {
      en: "Mixing up Notice and Informational. Notice is 5 (IOS keyword `notifications`), Informational is 6.",
      hi: "Notice aur Informational mix karna. Notice 5 hai (IOS keyword `notifications`), Informational 6.",
    },
    {
      en: "Trusting timestamps on unsynced devices. An asterisk before the time means the clock is not authoritative; set up NTP.",
      hi: "Unsynced devices ke timestamps par bharosa karna. Time se pehle asterisk ka matlab clock authoritative nahi hai; NTP setup karo.",
    },
  ],
  recap: [
    { en: "Format: `seq: timestamp: %FACILITY-SEVERITY-MNEMONIC: description`, e.g. `%LINK-3-UPDOWN`.", hi: "Format hota hai `seq: timestamp: %FACILITY-SEVERITY-MNEMONIC: description`, jaise `%LINK-3-UPDOWN`." },
    { en: "Levels 0-7: Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debugging (Every Awesome Cisco Engineer Will Need Ice cream Daily).", hi: "Levels 0 se 7 tak: Emergency, Alert, Critical, Error, Warning, Notice, Informational, Debugging. Yaad rakhne ke liye: Every Awesome Cisco Engineer Will Need Ice cream Daily." },
    { en: "A level includes itself and everything more severe: level 4 means 0-4.", hi: "Level mein woh khud aur usse zyada severe sab aate hain: level 4 matlab 0-4." },
    { en: "Destinations: console, VTY (`terminal monitor`), buffer (`show logging`), server (`logging host`, UDP 514, `logging trap`, default informational).", hi: "Chaar destinations hain: console, VTY (`terminal monitor` ke saath), buffer (`show logging` se padho) aur server (`logging host`, UDP 514, level `logging trap` se, default informational)." },
    { en: "`service timestamps log datetime msec`, `service sequence-numbers` and `logging synchronous` make logs readable and usable.", hi: "`service timestamps log datetime msec`, `service sequence-numbers` aur `logging synchronous` logs ko readable aur kaam ka banate hain." },
  ],
  quiz: [
    {
      q: {
        en: "What is the severity of `%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up`?",
        hi: "`%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1, changed state to up` ki severity kya hai?",
      },
      options: [
        { en: "Warning", hi: "Warning" },
        { en: "Notice", hi: "Notice" },
        { en: "Error", hi: "Error" },
        { en: "Informational", hi: "Informational" },
      ],
      answer: 1,
      explain: {
        en: "The number after the facility is the severity: 5 is Notice (IOS keyword notifications). Warning is 4, Error is 3, Informational is 6.",
        hi: "Facility ke baad wala number severity hai: 5 matlab Notice (IOS keyword notifications). Warning 4 hai, Error 3, Informational 6.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1 has `logging trap warnings`. Which severity levels are sent to the syslog server?",
        hi: "R1 par `logging trap warnings` hai. Syslog server ko kaunse severity levels bheje jaate hain?",
      },
      options: [
        { en: "Only level 4", hi: "Sirf level 4" },
        { en: "Levels 4 through 7", hi: "Levels 4 se 7 tak" },
        { en: "Levels 0 through 3", hi: "Levels 0 se 3 tak" },
        { en: "Levels 0 through 4", hi: "Levels 0 se 4 tak" },
      ],
      answer: 3,
      explain: {
        en: "Warnings is level 4, and a configured level includes every more severe level. So 0, 1, 2, 3 and 4 are sent; 5, 6 and 7 are not.",
        hi: "Warnings level 4 hai, aur configured level mein usse zyada severe saare levels shaamil hote hain. Toh 0, 1, 2, 3 aur 4 jaate hain; 5, 6 aur 7 nahi.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "Which transport and port does a Cisco router use by default to send messages to `logging host 10.1.1.50`?",
        hi: "`logging host 10.1.1.50` ko messages bhejne ke liye Cisco router by default kaunsa transport aur port use karta hai?",
      },
      options: [
        { en: "UDP 514", hi: "UDP 514" },
        { en: "TCP 514", hi: "TCP 514" },
        { en: "UDP 162", hi: "UDP 162" },
        { en: "UDP 161", hi: "UDP 161" },
      ],
      answer: 0,
      explain: {
        en: "Syslog uses UDP 514 by default. UDP 161 and 162 belong to SNMP (agent and manager).",
        hi: "Syslog by default UDP 514 use karta hai. UDP 161 aur 162 SNMP ke hain (agent aur manager).",
      },
      kind: "concept",
    },
    {
      q: {
        en: "You SSH into SW1 and shut an interface, but no log message appears in your session, although the console shows it. What do you need?",
        hi: "Tum SW1 par SSH karke ek interface shut karte ho, lekin tumhare session mein koi log message nahi dikhta, jabki console par dikh raha hai. Kya chahiye?",
      },
      options: [
        { en: "`logging synchronous` under the VTY lines", hi: "VTY lines ke neeche `logging synchronous`" },
        { en: "`logging console debugging`", hi: "`logging console debugging`" },
        { en: "`terminal monitor` in your session", hi: "Apne session mein `terminal monitor`" },
        { en: "`service timestamps log datetime msec`", hi: "`service timestamps log datetime msec`" },
      ],
      answer: 2,
      explain: {
        en: "Log messages are sent to VTY sessions only after `terminal monitor` is entered in that session. `logging synchronous` only tidies the output, and `logging console` affects the console line, not SSH.",
        hi: "VTY sessions mein log messages tabhi aate hain jab us session mein `terminal monitor` diya ho. `logging synchronous` sirf output saaf rakhta hai, aur `logging console` console line ko affect karta hai, SSH ko nahi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "R1 has `logging console 3`. A cable is unplugged and R1 generates `%LINK-3-UPDOWN` and `%LINEPROTO-5-UPDOWN`. What appears on the console?",
        hi: "R1 par `logging console 3` hai. Cable nikalne par R1 `%LINK-3-UPDOWN` aur `%LINEPROTO-5-UPDOWN` banata hai. Console par kya dikhega?",
      },
      options: [
        { en: "Only %LINK-3-UPDOWN", hi: "Sirf %LINK-3-UPDOWN" },
        { en: "Only %LINEPROTO-5-UPDOWN", hi: "Sirf %LINEPROTO-5-UPDOWN" },
        { en: "Both messages", hi: "Dono messages" },
        { en: "Neither message", hi: "Koi bhi message nahi" },
      ],
      answer: 0,
      explain: {
        en: "Level 3 shows severities 0 to 3. The LINK message is severity 3, so it appears; the LINEPROTO message is severity 5, so the console filters it out. It still goes to any destination set to level 5 or higher.",
        hi: "Level 3 severities 0 se 3 tak dikhata hai. LINK message severity 3 hai, toh dikhega; LINEPROTO message severity 5 hai, toh console use filter kar dega. Phir bhi woh har us destination par jaayega jiska level 5 ya usse upar set hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "A log line on SW2 reads `*Mar  1 00:41:07.123: %SYS-5-CONFIG_I: Configured from console by console`. What does the asterisk tell you?",
        hi: "SW2 par ek log line hai `*Mar  1 00:41:07.123: %SYS-5-CONFIG_I: Configured from console by console`. Asterisk kya batata hai?",
      },
      options: [
        { en: "The message was repeated several times", hi: "Message kai baar repeat hua" },
        { en: "The clock is not authoritative, for example not synced with NTP", hi: "Clock authoritative nahi hai, jaise NTP se synced nahi" },
        { en: "The message is critical and needs action", hi: "Message critical hai aur action chahiye" },
        { en: "The message came from another device", hi: "Message kisi doosre device se aaya" },
      ],
      answer: 1,
      explain: {
        en: "An asterisk before the timestamp means the device does not trust its own time, usually because NTP is not configured or not yet synced. The severity is in the message itself: 5 here.",
        hi: "Timestamp se pehle asterisk ka matlab hai device ko apne time par bharosa nahi, aam taur par isliye kyunki NTP configured nahi hai ya abhi synced nahi hua. Severity message ke andar hi hai: yahan 5.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "RaQPSKQ4J5A",
      title: "Free CCNA | Syslog | Day 41",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Message format, severity levels, logging destinations and configuration.", hi: "Message format, severity levels, logging destinations aur configuration." },
    },
    {
      id: "-R_CYM6Wm-Y",
      title: "Free CCNA | Syslog | Day 41 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Packet Tracer lab: configure logging levels and a syslog server.", hi: "Packet Tracer lab: logging levels aur syslog server configure karo." },
    },
    {
      id: "qYYxbe3MMyE",
      title: "77. Free CCNA (NEW) | SysLog Server - System Logging in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Syslog explained in Hindi, including severity levels and the server.", hi: "Syslog ka Hindi explanation, severity levels aur server ke saath." },
    },
    {
      id: "J9Y55X_fnhY",
      title: "What is SYSLOG in Hindi || CCNA 200-301 Full Course in Hindi @PyNetLabs",
      channel: "PyNet Labs",
      lang: "hi",
      note: { en: "A second Hindi walkthrough of syslog concepts.", hi: "Syslog concepts ka ek aur Hindi walkthrough." },
    },
  ],
  lab: {
    title: { en: "Collect R1's logs on a syslog server in Packet Tracer", hi: "Packet Tracer mein R1 ke logs syslog server par collect karo" },
    steps: [
      { en: "Build R1, a switch, and a server at 10.1.1.50/24. On the server, open Services > SYSLOG and make sure it is on.", hi: "R1, ek switch, aur 10.1.1.50/24 par ek server banao. Server par Services > SYSLOG kholo aur check karo ki on hai." },
      { en: "On R1 configure `service timestamps log datetime msec`, `service sequence-numbers`, `logging host 10.1.1.50` and `logging trap informational` (if your version rejects `logging host`, use `logging 10.1.1.50`).", hi: "R1 par `service timestamps log datetime msec`, `service sequence-numbers`, `logging host 10.1.1.50` aur `logging trap informational` configure karo (agar tumhara version `logging host` reject kare, toh `logging 10.1.1.50` use karo)." },
      { en: "Shut and re-enable an interface. In the server's SYSLOG table, find `%LINK-5-CHANGED` (administratively down), then `%LINK-3-UPDOWN` (up) and the two `%LINEPROTO-5-UPDOWN` messages.", hi: "Ek interface shut karke wapas enable karo. Server ki SYSLOG table mein `%LINK-5-CHANGED` (administratively down), phir `%LINK-3-UPDOWN` (up) aur dono `%LINEPROTO-5-UPDOWN` messages dhoondho." },
      { en: "Set `logging console warnings`, repeat the shut and no shut, and note which messages still appear on the console and why (only the severity 3 message should).", hi: "`logging console warnings` set karo, shut aur no shut dobara karo, aur note karo ki console par ab kaunse messages dikhte hain aur kyun (sirf severity 3 wala dikhna chahiye)." },
      { en: "Run `show logging` and match each destination's level to what you observed.", hi: "`show logging` chalao aur har destination ka level jo tumne dekha usse match karo." },
    ],
  },
};

export default lesson;
