import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "interface-issues",
  intro: {
    en: "A link can be plugged in, show green lights and still perform badly. Most of these problems come from a few causes: speed and duplex settings that do not match, a damaged or over-long cable, or a port that someone, or the switch itself, has shut down. `show interfaces` tells you which one it is, as long as you know which lines and counters to read.",
    hi: "Link plugged in ho, lights green hon, phir bhi performance kharab ho sakti hai. Zyada tar problems kuch hi wajahon se aati hain: speed aur duplex settings match nahi karti, cable kharab ya zyada lamba hai, ya port ko kisi ne (ya khud switch ne) shut down kar diya hai. `show interfaces` batata hai ki wajah kaunsi hai, bas tumhe pata hona chahiye ki kaunsi lines aur counters padhne hain.",
  },
  outcomes: [
    { en: "Read interface states in `show interfaces` and `show interfaces status`, and know what each one needs", hi: "`show interfaces` aur `show interfaces status` mein interface states padh sako, aur samjho ki har state mein kya karna hai" },
    { en: "Explain speed and duplex auto-negotiation and predict the result when one end is hard-coded", hi: "Speed aur duplex auto-negotiation samjha sako, aur predict kar sako ki ek end hard-coded ho toh kya result aayega" },
    { en: "Recognise a duplex mismatch from the counters on each end of the link", hi: "Link ke dono ends ke counters dekh kar duplex mismatch pehchaan sako" },
    { en: "Explain runts, giants, CRC errors, collisions and late collisions, and what usually causes each", hi: "Runts, giants, CRC errors, collisions aur late collisions samjha sako, aur har ek ki aam wajah bata sako" },
    { en: "Fix speed, duplex and cable problems and confirm the fix with cleared counters", hi: "Speed, duplex aur cable problems fix kar sako, aur cleared counters se fix confirm kar sako" },
  ],
  sections: [
    {
      id: "interface-status",
      heading: { en: "Is the interface up?", hi: "Interface up hai ya nahi?" },
      blocks: [
        {
          type: "p",
          text: {
            en: "`show interfaces` starts with two states. The first is the physical layer: is there a working signal on the cable? The second, **line protocol**, is the data link layer: is Ethernet working over that signal? Cisco switches add a word in brackets, the same word `show interfaces status` prints in its Status column.",
            hi: "`show interfaces` do states se shuru hota hai. Pehla physical layer ka hai: cable par sahi signal hai ya nahi? Doosra, **line protocol**, data link layer ka hai: us signal ke upar Ethernet chal raha hai ya nahi? Cisco switches bracket mein ek word aur jodte hain, wahi word jo `show interfaces status` apne Status column mein dikhata hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The states you will meet on a switch port", hi: "Switch port par milne wali states" },
          columns: ["show interfaces", "Status", { en: "Meaning", hi: "Matlab" }, { en: "What to do", hi: "Kya karna hai" }],
          rows: [
            [
              "up, line protocol is up (connected)",
              "connected",
              { en: "Working at Layer 1 and Layer 2", hi: "Layer 1 aur Layer 2 dono theek" },
              { en: "Nothing, unless the counters show errors", hi: "Kuch nahi, jab tak counters mein errors na hon" },
            ],
            [
              "administratively down, line protocol is down (disabled)",
              "disabled",
              { en: "`shutdown` is configured on the port", hi: "Port par `shutdown` configured hai" },
              { en: "`no shutdown` on the interface", hi: "Interface par `no shutdown`" },
            ],
            [
              "down, line protocol is down (notconnect)",
              "notconnect",
              {
                en: "No link: cable unplugged or broken, far end shut down or powered off, or a speed mismatch",
                hi: "Link nahi hai: cable nikla hua ya toota hua, doosra end shut down ya band, ya speed mismatch",
              },
              { en: "Check the cable, the far end and the speed settings", hi: "Cable, doosra end aur speed settings check karo" },
            ],
            [
              "down, line protocol is down (err-disabled)",
              "err-disabled",
              { en: "The switch shut the port itself after detecting a problem", hi: "Switch ne koi problem pakad kar khud port band kar diya" },
              { en: "Fix the cause, then `shutdown` and `no shutdown`", hi: "Pehle wajah fix karo, phir `shutdown` aur `no shutdown`" },
            ],
          ],
        },
        {
          type: "cli",
          title: { en: "The one-line-per-port view", hi: "Har port ki ek line wala view" },
          lines: [
            { prompt: "SW1#", cmd: "show interfaces status" },
            { out: "Port      Name               Status       Vlan       Duplex  Speed Type" },
            {
              out: "Fa0/1     Link to SW2        connected    1          a-half  a-100 10/100BaseTX",
              comment: { en: "a- means auto-negotiated. Half duplex on a switch uplink is a warning sign", hi: "a- matlab auto-negotiated. Switch uplink par half duplex khatre ka signal hai" },
            },
            { out: "Fa0/2     PC-B               connected    1          a-full  a-100 10/100BaseTX" },
            { out: "Fa0/3                        notconnect   1            auto   auto 10/100BaseTX", comment: { en: "No cable, or no signal from the far end", hi: "Cable nahi, ya doosre end se signal nahi" } },
            { out: "Fa0/4                        disabled     1            auto   auto 10/100BaseTX", comment: { en: "Shut down with `shutdown`", hi: "`shutdown` se band kiya gaya" } },
          ],
          note: {
            en: "`show ip interface brief` shows the same states in its Status and Protocol columns. You may also meet `up, line protocol is down`: the signal is fine but Layer 2 is not. That is mostly seen on serial WAN links, for example with mismatched encapsulation.",
            hi: "`show ip interface brief` bhi yahi states apne Status aur Protocol columns mein dikhata hai. Kabhi `up, line protocol is down` bhi milega: signal theek hai lekin Layer 2 nahi. Yeh zyada tar serial WAN links par dikhta hai, jaise encapsulation mismatch hone par.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "err-disabled is a safety switch", hi: "err-disabled ek safety switch hai" },
          text: {
            en: "The switch err-disables a port to protect the network, for example after a port security violation (lesson 5.6) or when BPDU Guard triggers (lesson 2.7). `show interfaces status err-disabled` lists those ports with the reason. Bounce the port without fixing the cause and it goes straight back to err-disabled.",
            hi: "Switch network ko bachane ke liye port err-disable karta hai, jaise port security violation (lesson 5.6) ke baad ya BPDU Guard trigger hone par (lesson 2.7). `show interfaces status err-disabled` aise ports ko reason ke saath dikhata hai. Wajah fix kiye bina port ko bounce karoge toh woh seedha phir se err-disabled ho jayega.",
          },
        },
      ],
    },
    {
      id: "speed-and-duplex",
      heading: { en: "Speed, duplex and auto-negotiation", hi: "Speed, duplex aur auto-negotiation" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Both ends of an Ethernet link must agree on two things: **speed** (10, 100, 1000 Mb/s and up) and **duplex**. **Full duplex** sends and receives at the same time. **Half duplex** does one at a time and uses CSMA/CD, which only made sense on hubs. Cisco ports default to `speed auto` and `duplex auto`: each end advertises what it supports, and both choose the fastest speed and best duplex they have in common.",
            hi: "Ethernet link ke dono ends ko do cheezon par agree karna padta hai: **speed** (10, 100, 1000 Mb/s aur upar) aur **duplex**. **Full duplex** mein ek saath send aur receive hota hai. **Half duplex** mein ek time par ek hi kaam hota hai aur CSMA/CD use hota hai, jo sirf hubs ke zamaane mein kaam ka tha. Cisco ports by default `speed auto` aur `duplex auto` par hote hain: har end batata hai ki woh kya support karta hai, aur dono common mein sabse tez speed aur best duplex choose kar lete hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "Trouble starts when one end is hard-coded. Setting both speed and duplex on a Cisco port turns auto-negotiation off, so that end stops advertising. The other end, still on auto, gets no answer. It can still **sense the speed** from the signal, but it cannot learn the duplex, so it follows a fixed rule: **half duplex at 10 or 100 Mb/s**, full duplex at 1000 Mb/s and above.",
            hi: "Problem tab shuru hoti hai jab ek end hard-coded ho. Cisco port par speed aur duplex dono set karne se auto-negotiation band ho jaata hai, toh woh end advertise karna band kar deta hai. Doosra end, jo abhi bhi auto par hai, use koi jawab nahi milta. Signal se woh **speed sense** kar leta hai, lekin duplex nahi seekh sakta, isliye ek fixed rule follow karta hai: **10 ya 100 Mb/s par half duplex**, aur 1000 Mb/s ya usse upar full duplex.",
          },
        },
        {
          type: "table",
          caption: { en: "Two 10/100 switch ports: settings and results", hi: "Do 10/100 switch ports: settings aur result" },
          columns: [{ en: "SW1 Fa0/1 (speed / duplex)", hi: "SW1 Fa0/1 (speed / duplex)" }, { en: "SW2 Fa0/1 (speed / duplex)", hi: "SW2 Fa0/1 (speed / duplex)" }, { en: "Result", hi: "Result" }],
          rows: [
            ["auto / auto", "auto / auto", { en: "Both negotiate 100 Mb/s full duplex, the best they share", hi: "Dono 100 Mb/s full duplex negotiate karte hain, jo dono ka best common hai" }],
            [
              "auto / auto",
              "100 / full",
              {
                en: "SW1 senses 100 Mb/s but falls back to half duplex. **Duplex mismatch**: the link is up, but slow and full of errors",
                hi: "SW1 100 Mb/s sense karta hai lekin half duplex par aa jaata hai. **Duplex mismatch**: link up hai, lekin slow aur errors se bhara",
              },
            ],
            ["100 / full", "100 / full", { en: "Works: both ends fixed the same way", hi: "Chalta hai: dono ends ek jaise fixed hain" }],
            [
              "10 / full",
              "100 / full",
              { en: "**Speed mismatch**: no link at all, both ports down/down (`notconnect`)", hi: "**Speed mismatch**: link bilkul nahi, dono ports down/down (`notconnect`)" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "A speed mismatch keeps the link **down**. A duplex mismatch lets the link come **up** and pass traffic, but slowly and with errors. Expect questions that test exactly this difference.",
            hi: "Speed mismatch mein link **down** rehta hai. Duplex mismatch mein link **up** aa jaata hai aur traffic bhi jaata hai, lekin slow aur errors ke saath. Exam mein yahi fark test karne wale sawaal aate hain.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Best practice", hi: "Best practice" },
          text: {
            en: "Leave both ends on `auto`. Hard-code only when a device cannot negotiate, and then hard-code **both** ends to the same speed and duplex.",
            hi: "Dono ends ko `auto` par rehne do. Hard-code sirf tab karo jab koi device negotiate na kar sake, aur tab **dono** ends par same speed aur duplex set karo.",
          },
        },
      ],
    },
    {
      id: "duplex-mismatch",
      heading: { en: "What a duplex mismatch looks like", hi: "Duplex mismatch kaisa dikhta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Take the case from the animation: SW1 on auto and SW2 hard-coded to 100/full. SW1 runs half duplex, so it believes only one side may talk at a time. SW2 runs full duplex, so it sends whenever it has a frame.",
            hi: "Animation wala case lo: SW1 auto par aur SW2 100/full par hard-coded. SW1 half duplex par hai, toh woh maanta hai ki ek time par sirf ek side bol sakti hai. SW2 full duplex par hai, toh jab bhi uske paas frame ho, bhej deta hai.",
          },
        },
        {
          type: "steps",
          items: [
            { en: "SW1 starts sending a frame to SW2.", hi: "SW1, SW2 ko ek frame bhejna shuru karta hai." },
            { en: "Partway through, SW2 starts sending its own frame. In full duplex that is normal.", hi: "Beech mein hi SW2 apna frame bhejna shuru kar deta hai. Full duplex mein yeh normal hai." },
            {
              en: "SW1 is receiving while it transmits, so it decides a collision happened. It stops its frame, sends a jam signal and backs off. If this happens after the first 64 bytes, SW1 counts a **late collision**.",
              hi: "SW1 transmit karte hue receive bhi kar raha hai, toh woh maan leta hai ki collision hua. Woh apna frame rok deta hai, jam signal bhejta hai aur back off karta hai. Agar yeh pehle 64 bytes ke baad hua, toh SW1 ise **late collision** ginta hai.",
            },
            {
              en: "SW2 receives SW1's cut-off frame. Under 64 bytes it is a **runt**; longer, its FCS is wrong and it counts as a **CRC error**.",
              hi: "SW2 ko SW1 ka kata hua frame milta hai. 64 bytes se chhota ho toh **runt**; bada ho toh uska FCS galat hota hai aur woh **CRC error** mein ginta hai.",
            },
            {
              en: "Frames are lost in both directions, TCP resends them, and users see a link that is slow but never quite fails.",
              hi: "Dono directions mein frames lost hote hain, TCP unhe dobara bhejta hai, aur users ko aisa link dikhta hai jo slow hai lekin poori tarah kabhi fail nahi hota.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Which end shows what", hi: "Kaunse end par kya dikhta hai" },
          columns: [{ en: "End", hi: "End" }, "Duplex", { en: "Counters that rise", hi: "Kaunse counters badhte hain" }],
          rows: [
            [{ en: "SW1 (auto)", hi: "SW1 (auto)" }, "Half", { en: "collisions, late collision", hi: "collisions, late collision" }],
            [{ en: "SW2 (hard-coded)", hi: "SW2 (hard-coded)" }, "Full", { en: "runts, CRC, input errors", hi: "runts, CRC, input errors" }],
          ],
        },
        {
          type: "cli",
          title: { en: "SW1, the half-duplex end", hi: "SW1, half-duplex wala end" },
          lines: [
            { prompt: "SW1#", cmd: "show interfaces fa0/1" },
            { out: "FastEthernet0/1 is up, line protocol is up (connected)", comment: { en: "Up/up: a duplex mismatch does not take the link down", hi: "Up/up: duplex mismatch link ko down nahi karta" } },
            { out: "  Half-duplex, 100Mb/s, media type is 10/100BaseTX" },
            { out: "     0 runts, 0 giants, 0 throttles" },
            { out: "     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored" },
            { out: "     1829 output errors, 3462 collisions, 1 interface resets" },
            { out: "     0 babbles, 1829 late collision, 2710 deferred", comment: { en: "Late collisions: the classic half-duplex-side symptom", hi: "Late collisions: half-duplex side ka classic symptom" } },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "CDP spots it for you", hi: "CDP khud bata deta hai" },
          text: {
            en: "CDP (lesson 2.4) compares duplex with the neighbour and logs a message such as `%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on FastEthernet0/1 (not full duplex), with SW2 FastEthernet0/1 (full duplex).` If you see it, check both ends of that link.",
            hi: "CDP (lesson 2.4) neighbour ke saath duplex compare karta hai aur aisa message log karta hai: `%CDP-4-DUPLEX_MISMATCH: duplex mismatch discovered on FastEthernet0/1 (not full duplex), with SW2 FastEthernet0/1 (full duplex).` Yeh dikhe toh us link ke dono ends check karo.",
          },
        },
      ],
    },
    {
      id: "reading-counters",
      heading: { en: "Reading the error counters", hi: "Error counters padhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Further down, `show interfaces` lists counters. These are the ones the CCNA expects you to know. They are totals since the last reboot or `clear counters`, so a large number may be old news: check the `Last clearing of \"show interface\" counters` line, clear them, and see whether they keep rising.",
            hi: "Neeche `show interfaces` counters dikhata hai. CCNA mein yeh counters aane chahiye. Yeh last reboot ya `clear counters` ke baad ke totals hote hain, isliye bada number purani baat bhi ho sakti hai: `Last clearing of \"show interface\" counters` wali line dekho, counters clear karo, aur dekho ki woh abhi bhi badh rahe hain ya nahi.",
          },
        },
        {
          type: "table",
          caption: { en: "Counters in show interfaces", hi: "show interfaces ke counters" },
          columns: ["Counter", { en: "What it counts", hi: "Kya ginta hai" }, { en: "Usual cause", hi: "Aam wajah" }],
          rows: [
            ["runts", { en: "Frames smaller than 64 bytes, the Ethernet minimum", hi: "64 bytes se chhote frames, jo Ethernet ka minimum hai" }, { en: "Collisions, usually from a duplex mismatch; a faulty NIC", hi: "Collisions, aksar duplex mismatch se; kharab NIC" }],
            ["giants", { en: "Frames larger than 1518 bytes, the standard Ethernet maximum", hi: "1518 bytes se bade frames, jo standard Ethernet maximum hai" }, { en: "A faulty NIC, or an MTU setting that does not match", hi: "Kharab NIC, ya MTU setting ka match na hona" }],
            ["CRC", { en: "Frames whose FCS check failed: damaged on the way", hi: "Frames jinka FCS check fail hua: raaste mein kharab ho gaye" }, { en: "Bad cable or connector, interference, duplex mismatch", hi: "Kharab cable ya connector, interference, duplex mismatch" }],
            ["frame", { en: "CRC errors that also end in a partial byte", hi: "Aise CRC errors jo adhoore byte par khatam hote hain" }, { en: "Collisions or faulty hardware", hi: "Collisions ya kharab hardware" }],
            ["input errors", { en: "Total of receive errors, including runts, giants and CRC", hi: "Receive errors ka total, runts, giants aur CRC samet" }, { en: "Read the individual counters", hi: "Alag alag counters padho" }],
            ["output errors", { en: "Frames the port could not send because of an error", hi: "Frames jo port error ki wajah se bhej nahi paaya" }, { en: "Read the individual counters", hi: "Alag alag counters padho" }],
            ["collisions", { en: "Frames resent after a collision", hi: "Collision ke baad dobara bheje gaye frames" }, { en: "Must be 0 on full duplex; anything else means the port runs half duplex", hi: "Full duplex par 0 hona chahiye; kuch bhi aur matlab port half duplex par hai" }],
            ["late collision", { en: "Collisions after the first 64 bytes of a frame were sent", hi: "Frame ke pehle 64 bytes bhejne ke baad hue collisions" }, { en: "Duplex mismatch, or a cable longer than the standard allows", hi: "Duplex mismatch, ya standard se lamba cable" }],
          ],
        },
        {
          type: "cli",
          title: { en: "SW2, the full-duplex end", hi: "SW2, full-duplex wala end" },
          lines: [
            { prompt: "SW2#", cmd: "show interfaces fa0/1" },
            { out: "FastEthernet0/1 is up, line protocol is up (connected)" },
            { out: "  Full-duplex, 100Mb/s, media type is 10/100BaseTX" },
            { out: "  Last clearing of \"show interface\" counters 2d03h", comment: { en: "Totals cover the last 2 days and 3 hours", hi: "Totals pichhle 2 din 3 ghante ke hain" } },
            { out: "     1741 runts, 0 giants, 0 throttles" },
            { out: "     3956 input errors, 2215 CRC, 0 frame, 0 overrun, 0 ignored", comment: { en: "Input errors here are the 1741 runts plus the 2215 CRC errors", hi: "Yahan input errors = 1741 runts aur 2215 CRC errors ka jod" } },
            { out: "     0 output errors, 0 collisions, 0 interface resets" },
          ],
        },
      ],
    },
    {
      id: "cable-problems",
      heading: { en: "Cable and physical faults", hi: "Cable aur physical faults" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**Damaged cable, bad crimp or loose connector**: frames arrive corrupted, so the receiving end counts CRC and input errors. Often only one direction suffers, so check the counters at both ends.",
              hi: "**Kharab cable, galat crimp ya dheela connector**: frames kharab hokar pahunchte hain, isliye receive karne wala end CRC aur input errors ginta hai. Aksar sirf ek direction affect hoti hai, isliye dono ends ke counters check karo.",
            },
            {
              en: "**Cable too long**: UTP is rated for 100 m (lesson 0.6). Beyond that the signal weakens and CRC errors appear, and on a half-duplex link late collisions too.",
              hi: "**Cable zyada lamba**: UTP 100 m ke liye rated hai (lesson 0.6). Usse aage signal kamzor ho jaata hai aur CRC errors aate hain, aur half-duplex link par late collisions bhi.",
            },
            {
              en: "**Interference**: UTP run alongside power cables, motors or fluorescent lights picks up noise, which also shows up as CRC errors. Reroute it, or use fiber.",
              hi: "**Interference**: power cables, motors ya tube lights ke saath chalne wala UTP noise pakad leta hai, jo CRC errors ke roop mein dikhta hai. Cable ka raasta badlo, ya fiber use karo.",
            },
            {
              en: "**Unplugged, cut or wrong cable**: no signal at all, so the port is `notconnect`. Most modern ports have Auto-MDIX and handle straight-through versus crossover by themselves.",
              hi: "**Cable nikla hua, kata hua ya galat**: signal hi nahi, isliye port `notconnect` hai. Zyada tar modern ports mein Auto-MDIX hota hai, jo straight-through aur crossover ka farak khud sambhal leta hai.",
            },
            {
              en: "**Fiber**: a dirty connector causes errors or no link, and mixing single-mode and multimode optics or cable can give errors or no link at all.",
              hi: "**Fiber**: ganda connector errors ya no link deta hai, aur single-mode aur multimode optics ya cable mix karne se errors aa sakte hain ya link aata hi nahi.",
            },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Auto-MDIX needs auto", hi: "Auto-MDIX ko auto chahiye" },
          text: {
            en: "On many Catalyst switches Auto-MDIX works only while speed and duplex are both `auto`. Hard-code them and a straight-through cable between two switches may stop coming up.",
            hi: "Kai Catalyst switches par Auto-MDIX tabhi kaam karta hai jab speed aur duplex dono `auto` hon. Inhe hard-code karoge toh do switches ke beech straight-through cable ka link aana band ho sakta hai.",
          },
        },
      ],
    },
    {
      id: "fix-it-routine",
      heading: { en: "A fix-it routine", hi: "Fix karne ka routine" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "`show interfaces status`: find ports that are `notconnect`, `err-disabled` or `disabled`, or that run `a-half`.",
              hi: "`show interfaces status`: aise ports dhoondho jo `notconnect`, `err-disabled` ya `disabled` hon, ya `a-half` par chal rahe hon.",
            },
            {
              en: "`show interfaces <port>` on **both** ends: compare speed and duplex, and note which error counters are not zero.",
              hi: "**Dono** ends par `show interfaces <port>`: speed aur duplex compare karo, aur note karo ki kaunse error counters zero nahi hain.",
            },
            {
              en: "Run `clear counters <port>`, wait while traffic flows, and look again. Only counters that keep rising are a current problem.",
              hi: "`clear counters <port>` chalao, traffic chalne tak ruko, aur phir dekho. Sirf woh counters current problem hain jo badhte ja rahe hain.",
            },
            {
              en: "Duplex or speed problem: set both ends to `speed auto` and `duplex auto`, or hard-code both to the same values.",
              hi: "Duplex ya speed problem: dono ends ko `speed auto` aur `duplex auto` par set karo, ya dono ko same values par hard-code karo.",
            },
            {
              en: "CRC errors while duplex matches: reseat or replace the cable, check its length and route, or move to another port.",
              hi: "Duplex match hone ke bawajood CRC errors: cable dobara lagao ya badlo, uski length aur raasta check karo, ya doosre port par shift karo.",
            },
            {
              en: "err-disabled: find and fix the cause, then enter `shutdown` and `no shutdown` on the port.",
              hi: "err-disabled: wajah dhoondh kar fix karo, phir port par `shutdown` aur `no shutdown` chalao.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "Fixing the mismatch from the animation", hi: "Animation wala mismatch fix karna" },
          lines: [
            { prompt: "SW2#", cmd: "configure terminal" },
            { prompt: "SW2(config)#", cmd: "interface fa0/1" },
            { prompt: "SW2(config-if)#", cmd: "speed auto", comment: { en: "SW1 is already on auto, so only SW2 changes", hi: "SW1 pehle se auto par hai, isliye sirf SW2 badalta hai" } },
            { prompt: "SW2(config-if)#", cmd: "duplex auto" },
            { prompt: "SW2(config-if)#", cmd: "end" },
            { prompt: "SW1#", cmd: "show interfaces fa0/1 status" },
            { out: "Port      Name               Status       Vlan       Duplex  Speed Type" },
            { out: "Fa0/1     Link to SW2        connected    1          a-full  a-100 10/100BaseTX", comment: { en: "Both ends negotiated: full duplex", hi: "Dono ends ne negotiate kiya: full duplex" } },
            { prompt: "SW1#", cmd: "clear counters fa0/1", comment: { en: "Clear SW2 Fa0/1 too, so both ends start from zero", hi: "SW2 Fa0/1 par bhi clear karo, taaki dono ends zero se shuru hon" } },
            { out: "Clear \"show interface\" counters on this interface [confirm]" },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Auto-negotiation", def: { en: "Both ends of an Ethernet link advertise what they support and agree on speed and duplex.", hi: "Ethernet link ke dono ends batate hain ki woh kya support karte hain, aur speed aur duplex par agree karte hain." } },
    { term: "Half duplex", def: { en: "Sending or receiving, but not both at once; collisions are possible and CSMA/CD handles them.", hi: "Ya send ya receive, dono ek saath nahi; collisions ho sakte hain aur CSMA/CD unhe sambhalta hai." } },
    { term: "Duplex mismatch", def: { en: "One end runs full duplex and the other half; the link is up but loses frames.", hi: "Ek end full duplex par aur doosra half par; link up hai lekin frames lost hote hain." } },
    { term: "Runt", def: { en: "A received frame smaller than the 64-byte Ethernet minimum.", hi: "Receive hua frame jo Ethernet ke 64-byte minimum se chhota hai." } },
    { term: "Giant", def: { en: "A received frame larger than the 1518-byte Ethernet maximum.", hi: "Receive hua frame jo Ethernet ke 1518-byte maximum se bada hai." } },
    { term: "CRC error", def: { en: "A frame whose FCS does not match its contents, so it was damaged in transit.", hi: "Aisa frame jiska FCS uske content se match nahi karta, yaani raaste mein kharab hua." } },
    { term: "Late collision", def: { en: "A collision detected after the first 64 bytes of a frame; usually a duplex mismatch.", hi: "Frame ke pehle 64 bytes ke baad pakda gaya collision; aksar duplex mismatch." } },
    { term: "err-disabled", def: { en: "A port the switch has shut down itself because it detected a problem.", hi: "Aisa port jise switch ne koi problem pakad kar khud band kar diya." } },
  ],
  commands: [
    { cmd: "show interfaces [interface]", mode: "Cisco privileged EXEC", does: { en: "Show state, speed, duplex and error counters", hi: "State, speed, duplex aur error counters dikhata hai" } },
    { cmd: "show interfaces status", mode: "Cisco privileged EXEC", does: { en: "One line per port: status, VLAN, duplex, speed", hi: "Har port ki ek line: status, VLAN, duplex, speed" } },
    { cmd: "show interfaces <interface> status", mode: "Cisco privileged EXEC", does: { en: "The same line for one port", hi: "Wahi line, sirf ek port ke liye" } },
    { cmd: "show interfaces status err-disabled", mode: "Cisco privileged EXEC", does: { en: "List err-disabled ports and the reason", hi: "err-disabled ports aur unka reason dikhata hai" } },
    { cmd: "show running-config interface <interface>", mode: "Cisco privileged EXEC", does: { en: "Show one interface's configuration", hi: "Ek interface ki configuration dikhata hai" } },
    { cmd: "clear counters [interface]", mode: "Cisco privileged EXEC", does: { en: "Reset the interface counters to zero", hi: "Interface counters ko zero par reset karta hai" } },
    { cmd: "speed {10 | 100 | 1000 | auto}", mode: "Cisco interface config", does: { en: "Set or auto-negotiate the port speed", hi: "Port speed set karta hai ya auto-negotiate karwata hai" } },
    { cmd: "duplex {half | full | auto}", mode: "Cisco interface config", does: { en: "Set or auto-negotiate the duplex", hi: "Duplex set karta hai ya auto-negotiate karwata hai" } },
    { cmd: "shutdown / no shutdown", mode: "Cisco interface config", does: { en: "Disable or enable the port; together they recover an err-disabled port", hi: "Port disable ya enable karta hai; dono milkar err-disabled port recover karte hain" } },
  ],
  mistakes: [
    {
      en: "Hard-coding speed and duplex on one end only. The other end, on auto, falls back to half duplex at 10 or 100 Mb/s. Configure both ends the same, or leave both on auto.",
      hi: "Sirf ek end par speed aur duplex hard-code karna. Doosra end, jo auto par hai, 10 ya 100 Mb/s par half duplex par aa jaata hai. Dono ends same configure karo, ya dono ko auto par chhodo.",
    },
    {
      en: "Expecting a duplex mismatch to bring the link down. It stays up/up and just performs badly. Two ends hard-coded to different speeds is what takes the link down.",
      hi: "Yeh expect karna ki duplex mismatch link ko down kar dega. Link up/up rehta hai, bas kharab perform karta hai. Link down tab hota hai jab dono ends alag alag speed par hard-coded hon.",
    },
    {
      en: "Blaming the end that shows half duplex. In the classic case that end is on auto and doing the right thing; the fault is the hard-coded far end.",
      hi: "Half duplex dikhane wale end ko blame karna. Classic case mein woh end auto par hai aur sahi kaam kar raha hai; galti hard-coded doosre end ki hai.",
    },
    {
      en: "Mixing up which end sees what. Late collisions appear on the half-duplex end; runts and CRC errors appear on the full-duplex end.",
      hi: "Kaunse end par kya dikhta hai, yeh mix kar dena. Late collisions half-duplex end par dikhte hain; runts aur CRC errors full-duplex end par.",
    },
    {
      en: "Trusting old counters. They add up since the last reboot or clear, so clear them and check whether errors are still increasing.",
      hi: "Purane counters par bharosa karna. Yeh last reboot ya clear ke baad se jud rahe hain, isliye clear karo aur dekho ki errors abhi bhi badh rahe hain ya nahi.",
    },
    {
      en: "Entering only `no shutdown` on an err-disabled port. It needs `shutdown` then `no shutdown`, and it will err-disable again unless you fix the cause first.",
      hi: "err-disabled port par sirf `no shutdown` daalna. Usko `shutdown` aur phir `no shutdown` chahiye, aur jab tak wajah fix nahi karoge, woh phir se err-disable ho jayega.",
    },
  ],
  recap: [
    { en: "Up/up is working; administratively down means `shutdown`; down/down means no link; err-disabled means the switch shut the port.", hi: "Up/up matlab kaam kar raha hai; administratively down matlab `shutdown`; down/down matlab link nahi; err-disabled matlab switch ne port band kiya." },
    { en: "Cisco ports default to speed and duplex auto. If the far end is hard-coded, the auto end senses the speed but uses half duplex at 10/100 Mb/s.", hi: "Cisco ports by default speed aur duplex auto par hote hain. Doosra end hard-coded ho toh auto end speed sense kar leta hai, lekin 10/100 Mb/s par half duplex use karta hai." },
    { en: "Speed mismatch: link down. Duplex mismatch: link up, slow, with errors.", hi: "Speed mismatch: link down. Duplex mismatch: link up, slow, errors ke saath." },
    { en: "Duplex mismatch: late collisions on the half end, runts and CRC errors on the full end.", hi: "Duplex mismatch: half end par late collisions, full end par runts aur CRC errors." },
    { en: "Runt < 64 bytes, giant > 1518 bytes, CRC = damaged frame, often a cable fault.", hi: "Runt < 64 bytes, giant > 1518 bytes, CRC = kharab frame, aksar cable ki galti." },
    { en: "Clear counters before you judge them, and always compare both ends of the link.", hi: "Counters judge karne se pehle clear karo, aur hamesha link ke dono ends compare karo." },
  ],
  quiz: [
    {
      q: {
        en: "SW1 Fa0/1 uses `speed auto` and `duplex auto`. The port it connects to on SW2 is configured with `speed 100` and `duplex full`. What does SW1 Fa0/1 end up with?",
        hi: "SW1 Fa0/1 par `speed auto` aur `duplex auto` hai. SW2 par jis port se yeh juda hai, us par `speed 100` aur `duplex full` configured hai. SW1 Fa0/1 aakhir mein kis setting par chalega?",
      },
      options: [
        { en: "100 Mb/s, full duplex", hi: "100 Mb/s, full duplex" },
        { en: "100 Mb/s, half duplex", hi: "100 Mb/s, half duplex" },
        { en: "10 Mb/s, half duplex", hi: "10 Mb/s, half duplex" },
        { en: "No link: the port stays down", hi: "Link nahi: port down rahega" },
      ],
      answer: 1,
      explain: {
        en: "SW2 no longer negotiates, so SW1 senses 100 Mb/s from the signal but cannot learn the duplex. At 10 or 100 Mb/s the fallback is half duplex. The link comes up with a duplex mismatch, which is why hard-coding one end only is a mistake.",
        hi: "SW2 ab negotiate nahi karta, toh SW1 signal se 100 Mb/s sense kar leta hai lekin duplex nahi seekh paata. 10 ya 100 Mb/s par fallback half duplex hai. Link duplex mismatch ke saath up aata hai, isiliye sirf ek end hard-code karna galti hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`show interfaces fa0/7` begins with `FastEthernet0/7 is administratively down, line protocol is down (disabled)`. What fixes it?",
        hi: "`show interfaces fa0/7` ki pehli line hai `FastEthernet0/7 is administratively down, line protocol is down (disabled)`. Ise kya fix karega?",
      },
      options: [
        { en: "Replace the cable", hi: "Cable badlo" },
        { en: "Set `duplex auto` on both ends", hi: "Dono ends par `duplex auto` set karo" },
        { en: "Run `clear counters fa0/7`", hi: "`clear counters fa0/7` chalao" },
        { en: "Enter `no shutdown` under `interface fa0/7`", hi: "`interface fa0/7` ke andar `no shutdown` daalo" },
      ],
      answer: 3,
      explain: {
        en: "Administratively down means the port has `shutdown` in its configuration. Nothing is wrong with the cable or duplex; the port is disabled by configuration, and `no shutdown` enables it.",
        hi: "Administratively down ka matlab hai ki port ki configuration mein `shutdown` hai. Cable ya duplex mein koi problem nahi; port configuration se band hai, aur `no shutdown` use enable kar deta hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A link has a duplex mismatch: SW1 runs half duplex and SW2 runs full duplex. Which counters rise on **SW2**?",
        hi: "Ek link par duplex mismatch hai: SW1 half duplex par aur SW2 full duplex par. **SW2** par kaunse counters badhenge?",
      },
      options: [
        { en: "Runts and CRC errors", hi: "Runts aur CRC errors" },
        { en: "Late collisions", hi: "Late collisions" },
        { en: "Giants", hi: "Giants" },
        { en: "None; the full-duplex end sees no errors", hi: "Koi nahi; full-duplex end par errors nahi dikhte" },
      ],
      answer: 0,
      explain: {
        en: "SW1 aborts its frames when SW2 transmits at the same time, so SW2 receives cut-off frames: runts when they are under 64 bytes, CRC errors when they are longer. Late collisions are counted on the half-duplex end, SW1.",
        hi: "Jab SW2 saath mein transmit karta hai, SW1 apne frames beech mein rok deta hai, isliye SW2 ko kate hue frames milte hain: 64 bytes se chhote hon toh runts, bade hon toh CRC errors. Late collisions half-duplex end, yaani SW1 par gine jaate hain.",
      },
      kind: "scenario",
    },
    {
      q: { en: "What does the `late collision` counter record?", hi: "`late collision` counter kya record karta hai?" },
      options: [
        { en: "Frames that arrived with a bad FCS", hi: "Kharab FCS ke saath aaye frames" },
        { en: "Frames shorter than 64 bytes", hi: "64 bytes se chhote frames" },
        { en: "Collisions detected after the first 64 bytes of a frame were sent", hi: "Frame ke pehle 64 bytes bhejne ke baad pakde gaye collisions" },
        { en: "Frames that waited too long in the output queue", hi: "Output queue mein bahut der ruke frames" },
      ],
      answer: 2,
      explain: {
        en: "On a correctly built half-duplex segment, every collision happens within the first 64 bytes. A later one points to a duplex mismatch or a cable longer than the standard allows. A bad FCS is a CRC error, and a frame under 64 bytes is a runt.",
        hi: "Sahi bane half-duplex segment par har collision pehle 64 bytes ke andar hota hai. Usse baad wala collision duplex mismatch ya standard se lambe cable ki taraf ishaara karta hai. Kharab FCS CRC error hai, aur 64 bytes se chhota frame runt hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "SW1 Fa0/1 is set to `speed 10` and `duplex full`. SW2 Fa0/1, on the other end of the cable, is set to `speed 100` and `duplex full`. What do you see?",
        hi: "SW1 Fa0/1 par `speed 10` aur `duplex full` set hai. Cable ke doosre end par SW2 Fa0/1 par `speed 100` aur `duplex full` set hai. Kya dikhega?",
      },
      options: [
        { en: "The link is up/up with late collisions", hi: "Link up/up hai, late collisions ke saath" },
        { en: "The link is up/up at 10 Mb/s", hi: "Link 10 Mb/s par up/up hai" },
        { en: "Both ports go err-disabled", hi: "Dono ports err-disabled ho jaate hain" },
        { en: "Both ports are down/down (notconnect)", hi: "Dono ports down/down (notconnect) hain" },
      ],
      answer: 3,
      explain: {
        en: "Both ends are hard-coded to different speeds and neither negotiates, so no link forms and both show down/down. A speed mismatch takes the link down; a duplex mismatch leaves it up but faulty. Neither is a reason for err-disabled.",
        hi: "Dono ends alag speeds par hard-coded hain aur koi negotiate nahi karta, isliye link banta hi nahi aur dono down/down dikhte hain. Speed mismatch link down karta hai; duplex mismatch link up rakhta hai lekin kharab. Dono mein se koi bhi err-disabled ki wajah nahi hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "An uplink shows `Full-duplex, 1000Mb/s` on both ends and 0 collisions, but the CRC counter on one end keeps rising after `clear counters`. What is the most likely cause?",
        hi: "Ek uplink dono ends par `Full-duplex, 1000Mb/s` dikhata hai aur collisions 0 hain, lekin `clear counters` ke baad bhi ek end ka CRC counter badhta ja raha hai. Sabse likely wajah kya hai?",
      },
      options: [
        { en: "A duplex mismatch", hi: "Duplex mismatch" },
        { en: "A damaged cable or connector, or interference", hi: "Kharab cable ya connector, ya interference" },
        { en: "The port is administratively down", hi: "Port administratively down hai" },
        { en: "The MAC address table is full", hi: "MAC address table full hai" },
      ],
      answer: 1,
      explain: {
        en: "Both ends agree on full duplex, so this is not a mismatch, and a shut-down port would pass no traffic at all. CRC errors that keep rising on a link with matching duplex point to the physical layer: reseat or replace the cable, check its length and route, or try another port.",
        hi: "Dono ends full duplex par agree karte hain, toh yeh mismatch nahi hai, aur shut down port par toh traffic hi nahi jaata. Matching duplex wale link par lagatar badhte CRC errors physical layer ki taraf ishaara karte hain: cable dobara lagao ya badlo, length aur raasta check karo, ya doosra port try karo.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "cCqluocfQe0",
      title: "Free CCNA | Switch Interfaces | Day 9",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Speed, duplex, auto-negotiation, interface status and the error counters in show interfaces.",
        hi: "Speed, duplex, auto-negotiation, interface status aur show interfaces ke error counters.",
      },
    },
    {
      id: "rzDb5DoBKRk",
      title: "Free CCNA | Configuring Interfaces | Day 9 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Packet Tracer practice configuring speed, duplex and interface state.", hi: "Packet Tracer mein speed, duplex aur interface state configure karne ki practice." },
    },
    {
      id: "_HxbynNO3fM",
      title: "25. Speed & Duplex in Networking",
      channel: "NetworkPath",
      lang: "hi",
      note: { en: "A short Hindi explanation of speed, duplex and auto-negotiation.", hi: "Speed, duplex aur auto-negotiation ka chhota Hindi explanation." },
    },
    {
      id: "41TR_A2AKU4",
      title: "193.  Diagnosing & Troubleshooting Interface & Cable Issues",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "A longer Hindi session (about 40 minutes) on interface and cable troubleshooting, including the counters in this lesson.",
        hi: "Interface aur cable troubleshooting par lamba Hindi session (lagbhag 40 minute), is lesson ke counters samet.",
      },
    },
  ],
  lab: {
    title: { en: "Break and fix a link in Packet Tracer", hi: "Packet Tracer mein link todo aur fix karo" },
    steps: [
      {
        en: "Connect SW1 Fa0/1 to SW2 Fa0/1 (two 2960 switches) with a copper cross-over cable, so the link still comes up when you hard-code speed and Auto-MDIX stops working. Run `show interfaces status` on both and confirm `a-full` and `a-100`.",
        hi: "SW1 Fa0/1 ko SW2 Fa0/1 se copper cross-over cable se jodo (do 2960 switches), taaki speed hard-code karne par Auto-MDIX band ho jaaye tab bhi link aata rahe. Dono par `show interfaces status` chalao aur `a-full` aur `a-100` confirm karo.",
      },
      {
        en: "On SW1, enter `shutdown` under Fa0/3. Compare what `show interfaces fa0/3` and `show interfaces status` say, then undo it with `no shutdown`.",
        hi: "SW1 par Fa0/3 ke andar `shutdown` daalo. Dekho `show interfaces fa0/3` aur `show interfaces status` kya dikhate hain, phir `no shutdown` se wapas theek karo.",
      },
      {
        en: "Create a duplex mismatch: on SW2 Fa0/1 set `speed 100` and `duplex half`, on SW1 Fa0/1 set `speed 100` and `duplex full`. Watch the console for a CDP duplex mismatch message.",
        hi: "Duplex mismatch banao: SW2 Fa0/1 par `speed 100` aur `duplex half`, SW1 Fa0/1 par `speed 100` aur `duplex full` set karo. Console par CDP duplex mismatch message ka wait karo.",
      },
      {
        en: "Run `show interfaces fa0/1` on both switches and note the duplex each end reports.",
        hi: "Dono switches par `show interfaces fa0/1` chalao aur note karo ki har end kaunsa duplex report karta hai.",
      },
      {
        en: "Fix it: set `speed auto` and `duplex auto` on both ends, then confirm `a-full` and `a-100` in `show interfaces status`.",
        hi: "Fix karo: dono ends par `speed auto` aur `duplex auto` set karo, phir `show interfaces status` mein `a-full` aur `a-100` confirm karo.",
      },
      {
        en: "Set SW1 Fa0/1 to `speed 10` and SW2 Fa0/1 to `speed 100`, both `duplex full`, and see what happens to the link. Put both back to auto when you finish.",
        hi: "SW1 Fa0/1 ko `speed 10` aur SW2 Fa0/1 ko `speed 100` par set karo, dono `duplex full`, aur dekho link ka kya hota hai. Kaam khatam hone par dono ko wapas auto par kar do.",
      },
    ],
  },
};

export default lesson;
