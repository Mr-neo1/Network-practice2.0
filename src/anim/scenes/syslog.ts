import type { TerminalScene } from "../types.ts";

// Matches the syslog lesson: R1's Gi0/1 link, syslog server 10.1.1.50 (UDP 514).
// The clock is synced by NTP, so timestamps carry no leading asterisk.
// Log lines longer than ~80 characters are wrapped the way an 80-column terminal shows them.

const scene: TerminalScene = {
  kind: "terminal",
  id: "syslog",
  title: { en: "Syslog: read the messages, then send them to a server", hi: "Syslog: messages padho, phir unhe server par bhejo" },
  device: "R1 — console",
  steps: [
    {
      title: { en: "A cable is pulled: two messages", hi: "Cable nikli: do messages" },
      text: {
        en: "Someone unplugs the cable on Gi0/1 and two messages appear on the console. %LINK-3-UPDOWN comes from the LINK facility at severity 3 (error): the physical layer is down. A moment later %LINEPROTO-5-UPDOWN, severity 5 (notification), says the line protocol went down too.",
        hi: "Kisi ne Gi0/1 ki cable nikal di aur console par do messages aaye. %LINK-3-UPDOWN LINK facility se hai, severity 3 (error): physical layer down hai. Thodi der baad %LINEPROTO-5-UPDOWN, severity 5 (notification), batata hai ki line protocol bhi down ho gaya.",
      },
      lines: [
        { prompt: "R1#", cmd: "" },
        { out: "%LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to down" },
        { out: "%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1,\nchanged state to down" },
      ],
    },
    {
      title: { en: "Plugged back in: same codes, now up", hi: "Cable wapas lagi: wahi codes, ab up" },
      text: {
        en: "The cable goes back in and the same two message types report up. LINK is still severity 3 even though the news is good: the severity belongs to the message type, not to this event. Notice there is no time on these lines (this R1 has no `service timestamps` configured), so you cannot tell when the outage happened.",
        hi: "Cable wapas lagi aur wahi do message types ab up report karte hain. Khabar achhi hai, phir bhi LINK severity 3 hi hai: severity message type ki hoti hai, is event ki nahi. Dhyan do, in lines par koi time nahi hai (is R1 par `service timestamps` configured nahi hai), toh pata hi nahi chalta outage kab hua.",
      },
      lines: [
        { out: "%LINK-3-UPDOWN: Interface GigabitEthernet0/1, changed state to up" },
        { out: "%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/1,\nchanged state to up" },
      ],
    },
    {
      title: { en: "Add timestamps and sequence numbers", hi: "Timestamps aur sequence numbers jodo" },
      text: {
        en: "`service timestamps log datetime msec` stamps each message with date and time to the millisecond, and `service sequence-numbers` numbers them so a gap shows a missing message. `logging synchronous` on the console line reprints your half-typed command after a message interrupts it.",
        hi: "`service timestamps log datetime msec` har message par date aur millisecond tak time lagata hai, aur `service sequence-numbers` unhe number deta hai, taaki gap dikhe toh pata chale koi message missing hai. Console line par `logging synchronous` message beech mein aane ke baad tumhari aadhi type ki hui command dobara print kar deta hai.",
      },
      lines: [
        { prompt: "R1#", cmd: "configure terminal", out: "Enter configuration commands, one per line.  End with CNTL/Z." },
        { prompt: "R1(config)#", cmd: "service timestamps log datetime msec" },
        { prompt: "R1(config)#", cmd: "service sequence-numbers" },
        { prompt: "R1(config)#", cmd: "line console 0" },
        { prompt: "R1(config-line)#", cmd: "logging synchronous" },
        { prompt: "R1(config-line)#", cmd: "exit" },
      ],
    },
    {
      title: { en: "Send logs to the server", hi: "Logs server par bhejo" },
      text: {
        en: "`logging host 10.1.1.50` sends a copy of each message to the syslog server on UDP 514. `logging trap informational` sends levels 0 to 6, everything except debugging. R1 confirms with message 000038, now with a sequence number and timestamp.",
        hi: "`logging host 10.1.1.50` har message ki copy syslog server ko UDP 514 par bhejta hai. `logging trap informational` levels 0 se 6 bhejta hai, yaani debugging ke alawa sab kuch. R1 message 000038 se confirm karta hai, ab sequence number aur timestamp ke saath.",
      },
      lines: [
        { prompt: "R1(config)#", cmd: "logging host 10.1.1.50" },
        { prompt: "R1(config)#", cmd: "logging trap informational" },
        { out: "000038: Oct  1 09:18:40.006: %SYS-6-LOGGINGHOST_STARTSTOP: Logging to host\n10.1.1.50 port 514 started - CLI initiated" },
      ],
    },
    {
      title: { en: "Buffer at 6, console at 4", hi: "Buffer 6 par, console 4 par" },
      text: {
        en: "`logging buffered 16384 informational` keeps levels 0 to 6 in a 16 KB buffer in RAM. `logging console warnings` limits the console to levels 0 to 4. Then `end`: the %SYS-5-CONFIG_I message (number 000039) is still created, but it is severity 5, so it no longer appears on the console.",
        hi: "`logging buffered 16384 informational` levels 0 se 6 ko RAM ke 16 KB buffer mein rakhta hai. `logging console warnings` console ko levels 0 se 4 tak limit kar deta hai. Phir `end`: %SYS-5-CONFIG_I message (number 000039) ban toh raha hai, lekin severity 5 hai, isliye ab console par nahi dikhta.",
      },
      lines: [
        { prompt: "R1(config)#", cmd: "logging buffered 16384 informational" },
        { prompt: "R1(config)#", cmd: "logging console warnings" },
        { prompt: "R1(config)#", cmd: "end" },
        { prompt: "R1#", cmd: "" },
      ],
    },
    {
      title: { en: "Pull the cable again: one line shows", hi: "Cable phir nikali: sirf ek line dikhi" },
      text: {
        en: "The same failure creates two messages again, 000040 and 000041. Only %LINK-3-UPDOWN reaches the console, because 3 is within 0 to 4. %LINEPROTO-5-UPDOWN is severity 5, so the console filters it out. It was not lost: the buffer and the server both take level 5.",
        hi: "Wahi failure phir do messages banata hai, 000040 aur 000041. Console tak sirf %LINK-3-UPDOWN pahunchta hai, kyunki 3, 0 se 4 ke andar hai. %LINEPROTO-5-UPDOWN severity 5 hai, isliye console use filter kar deta hai. Woh khoya nahi: buffer aur server dono level 5 lete hain.",
      },
      lines: [
        { out: "000040: Oct  1 09:21:13.502: %LINK-3-UPDOWN: Interface GigabitEthernet0/1,\nchanged state to down" },
      ],
    },
    {
      title: { en: "show logging: where messages go", hi: "show logging: messages kahan jaate hain" },
      text: {
        en: "The top of `show logging` lists every destination and its level: console at warnings, monitor (VTY sessions) at the default debugging, buffer at informational, and trap logging, the server, at informational, sending to 10.1.1.50 on UDP 514. The buffer holds 3 messages because resizing it with `logging buffered 16384` started a fresh buffer; the server has received 4, from 000038 on.",
        hi: "`show logging` ka upar wala hissa har destination aur uska level dikhata hai: console warnings par, monitor (VTY sessions) default debugging par, buffer informational par, aur trap logging, yaani server, informational par, jo 10.1.1.50 ko UDP 514 par bhej raha hai. Buffer mein 3 messages hain kyunki `logging buffered 16384` se size badalte hi naya buffer shuru hua; server ko 000038 se ab tak 4 messages mile hain.",
      },
      clear: true,
      lines: [
        { prompt: "R1#", cmd: "show logging" },
        { out: "    Console logging: level warnings, 39 messages logged, xml disabled," },
        { out: "    Monitor logging: level debugging, 0 messages logged, xml disabled," },
        { out: "    Buffer logging:  level informational, 3 messages logged, xml disabled," },
        { out: "    Trap logging: level informational, 41 message lines logged" },
        { out: "        Logging to 10.1.1.50  (udp port 514, audit disabled," },
        { out: "              link up)," },
        { out: "              4 message lines logged," },
      ],
    },
    {
      title: { en: "Read the buffer: nothing missing", hi: "Buffer padho: kuch missing nahi" },
      text: {
        en: "`| begin 000039` starts the output at that line. The buffer holds all three messages, including the two the console hid: 000039 (your config change) and 000041 (line protocol down). The numbers run without a gap, so you know nothing was skipped.",
        hi: "`| begin 000039` output ko usi line se shuru karta hai. Buffer mein teeno messages hain, woh do bhi jo console ne chhupa diye the: 000039 (tumhara config change) aur 000041 (line protocol down). Numbers bina gap ke chal rahe hain, toh pakka hai kuch skip nahi hua.",
      },
      lines: [
        { prompt: "R1#", cmd: "show logging | begin 000039" },
        { out: "000039: Oct  1 09:19:02.774: %SYS-5-CONFIG_I: Configured from console by\nconsole" },
        { out: "000040: Oct  1 09:21:13.502: %LINK-3-UPDOWN: Interface GigabitEthernet0/1,\nchanged state to down" },
        { out: "000041: Oct  1 09:21:14.502: %LINEPROTO-5-UPDOWN: Line protocol on Interface\nGigabitEthernet0/1, changed state to down" },
      ],
    },
  ],
};

export default scene;
