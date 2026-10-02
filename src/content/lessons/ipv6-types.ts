import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "ipv6-types",
  intro: {
    en: "An IPv6 interface does not have just one address. It has a link-local address it built itself, usually one or more global addresses, and it listens to several multicast groups. Each type has its own range and its own job, and you need to recognise them on sight. You will also see how a host gets a working address and gateway with no DHCP server at all, using Neighbor Discovery, the protocol that replaces ARP.",
    hi: "IPv6 interface ka sirf ek address nahi hota. Uske paas ek link-local address hota hai jo usne khud banaya, aam taur par ek ya zyada global addresses, aur woh kai multicast groups ko sunta hai. Har type ki apni range aur apna kaam hai, aur tumhe inhe dekhte hi pehchaanna aana chahiye. Tum yeh bhi dekhoge ki host bina kisi DHCP server ke working address aur gateway kaise pa leta hai, Neighbor Discovery ki madad se, jo ARP ki jagah leta hai.",
  },
  outcomes: [
    {
      en: "Identify global unicast, unique local, link-local and multicast addresses from their first hex digits",
      hi: "Pehle hex digits dekh kar global unicast, unique local, link-local aur multicast addresses pehchaan sako",
    },
    { en: "Explain anycast and the special addresses :: and ::1", hi: "Anycast aur special addresses :: aur ::1 samjha sako" },
    { en: "Build a modified EUI-64 interface ID from a MAC address", hi: "MAC address se modified EUI-64 interface ID bana sako" },
    {
      en: "Describe RS, RA, NS and NA, work out a solicited-node address, and explain DAD",
      hi: "RS, RA, NS aur NA describe kar sako, solicited-node address nikaal sako, aur DAD samjha sako",
    },
    { en: "Compare SLAAC, stateless DHCPv6 and stateful DHCPv6", hi: "SLAAC, stateless DHCPv6 aur stateful DHCPv6 ko compare kar sako" },
    {
      en: "Configure EUI-64 and link-local addresses on a Cisco router and read `show ipv6 interface`",
      hi: "Cisco router par EUI-64 aur link-local addresses configure kar sako aur `show ipv6 interface` padh sako",
    },
  ],
  sections: [
    {
      id: "unicast-types",
      heading: { en: "Three kinds of unicast address", hi: "Unicast address ke teen type" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A unicast address identifies one interface. IPv6 has three kinds you must know, and a working interface usually has at least two of them at the same time: a link-local address for talking on its own link, and a global or unique local address for talking beyond it.",
            hi: "Unicast address ek interface ko identify karta hai. IPv6 mein iske teen type hain jo tumhe pata hone chahiye, aur ek working interface par aam taur par ek saath kam se kam do hote hain: apne link par baat karne ke liye link-local address, aur link ke bahar baat karne ke liye global ya unique local address.",
          },
        },
        {
          type: "table",
          caption: { en: "Unicast address types", hi: "Unicast address types" },
          columns: ["Type", "Range", { en: "Looks like", hi: "Kaisa dikhta hai" }, { en: "Reaches", hi: "Kahan tak jaata hai" }],
          rows: [
            [
              "Global unicast (GUA)",
              "2000::/3",
              { en: "Starts with 2 or 3: 2001:db8:1:1::1", hi: "2 ya 3 se shuru: 2001:db8:1:1::1" },
              { en: "Anywhere, including the internet", hi: "Kahin bhi, internet samet" },
            ],
            [
              "Unique local (ULA)",
              "fc00::/7",
              { en: "Starts with fd: fd12:3456:789a:1::1", hi: "fd se shuru: fd12:3456:789a:1::1" },
              { en: "Inside your organisation only", hi: "Sirf tumhari organisation ke andar" },
            ],
            [
              "Link-local (LLA)",
              "fe80::/10",
              { en: "Starts with fe80: fe80::211:22ff:fe33:4401", hi: "fe80 se shuru: fe80::211:22ff:fe33:4401" },
              { en: "Only the local link; never routed", hi: "Sirf local link; kabhi route nahi hota" },
            ],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**Global unicast** addresses are the IPv6 version of public IPv4 addresses. IANA currently hands them out from `2000::/3`, so the first hex digit is 2 or 3. With a /48 from the ISP, the address is a 48-bit global routing prefix + 16-bit subnet ID + 64-bit interface ID (lesson 1.8).",
              hi: "**Global unicast** addresses public IPv4 addresses ka IPv6 version hain. IANA abhi inhe `2000::/3` se deta hai, isliye pehla hex digit 2 ya 3 hota hai. ISP se /48 mila ho toh address = 48-bit global routing prefix + 16-bit subnet ID + 64-bit interface ID (lesson 1.8).",
            },
            {
              en: "**Unique local** addresses work like RFC 1918 private addresses: used inside an organisation and not routed on the internet. The range is `fc00::/7`, but the 8th bit (the L bit) is set to 1 for locally assigned addresses and the `fc` half was never defined for use, so in practice they all start with `fd`. After `fd` comes a 40-bit **random** global ID, so two companies that later merge are unlikely to clash.",
              hi: "**Unique local** addresses RFC 1918 private addresses jaise kaam karte hain: organisation ke andar use hote hain aur internet par route nahi hote. Range `fc00::/7` hai, lekin locally assigned addresses mein 8th bit (L bit) 1 hota hai aur `fc` wala half kabhi use ke liye define hi nahi hua, isliye practice mein sab `fd` se shuru hote hain. `fd` ke baad 40-bit **random** global ID aata hai, taaki baad mein do companies merge hon toh addresses clash hone ke chances kam rahein.",
            },
            {
              en: "**Link-local** addresses (`fe80::/10`) are created automatically on every interface where IPv6 is enabled. The range is a /10, but in practice the first 64 bits are always `fe80:0000:0000:0000`, so they start with `fe80::`. They are valid only on that one link: a router never forwards a packet with a link-local source or destination. NDP uses them, routers send RAs from them, routing protocols form neighbourships with them, and routes use them as the **next hop**.",
              hi: "**Link-local** addresses (`fe80::/10`) har us interface par apne aap bante hain jahan IPv6 enabled hai. Range /10 hai, lekin practice mein pehle 64 bits hamesha `fe80:0000:0000:0000` hote hain, isliye yeh `fe80::` se shuru hote hain. Yeh sirf usi ek link par valid hain: router link-local source ya destination wala packet kabhi forward nahi karta. NDP inhe use karta hai, routers RAs inhi se bhejte hain, routing protocols inhi se neighbourship banate hain, aur routes inhe **next hop** ki tarah use karte hain.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Two special addresses", hi: "Do special addresses" },
          columns: ["Address", { en: "Name", hi: "Naam" }, { en: "Used for", hi: "Kis kaam aata hai" }],
          rows: [
            [
              "::",
              "Unspecified",
              {
                en: "The source of a packet sent before the host has an address, for example during DAD",
                hi: "Us packet ka source jo host address milne se pehle bhejta hai, jaise DAD ke time",
              },
            ],
            ["::1", "Loopback", { en: "The host itself, like 127.0.0.1 in IPv4", hi: "Host khud, jaise IPv4 mein 127.0.0.1" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "The same link-local on every interface", hi: "Har interface par same link-local" },
          text: {
            en: "A link-local address only has to be unique on its own link, so a router may use the same one, such as `fe80::1`, on every interface. That is why IOS asks you for the output interface when you ping a link-local address.",
            hi: "Link-local address ko sirf apne link par unique hona zaroori hai, isliye router har interface par same address, jaise `fe80::1`, use kar sakta hai. Isiliye link-local address ko ping karte waqt IOS tumse output interface poochta hai.",
          },
        },
      ],
    },
    {
      id: "multicast-anycast",
      heading: { en: "Multicast and anycast, and no broadcast", hi: "Multicast aur anycast, aur broadcast nahi" },
      blocks: [
        {
          type: "p",
          text: {
            en: "IPv6 has no broadcast at all. A message meant for 'everyone' or 'all routers' goes to a **multicast** group in `ff00::/8`, and only devices that joined the group process it. The fourth hex digit is the **scope**: `ff02::` groups never leave the local link.",
            hi: "IPv6 mein broadcast hota hi nahi. 'Sabke liye' ya 'saare routers ke liye' wala message `ff00::/8` ke kisi **multicast** group ko jaata hai, aur sirf woh devices use process karte hain jinhone group join kiya hai. Chautha hex digit **scope** batata hai: `ff02::` groups kabhi local link se bahar nahi jaate.",
          },
        },
        {
          type: "table",
          caption: { en: "Multicast addresses to know", hi: "Yeh multicast addresses yaad rakho" },
          columns: ["Address", { en: "Who listens", hi: "Kaun sunta hai" }, { en: "Used for", hi: "Kis liye" }],
          rows: [
            ["ff02::1", { en: "Every IPv6 device on the link", hi: "Link ka har IPv6 device" }, { en: "RAs from routers; the closest thing to a broadcast", hi: "Routers ke RAs; broadcast ke sabse kareeb" }],
            ["ff02::2", { en: "Every router on the link", hi: "Link ka har router" }, { en: "RSs from hosts looking for a router", hi: "Router dhoondhne wale hosts ke RS" }],
            ["ff02::1:2", { en: "DHCPv6 servers and relay agents", hi: "DHCPv6 servers aur relay agents" }, { en: "DHCPv6 clients looking for a server", hi: "Server dhoondhne wale DHCPv6 clients" }],
            [
              "ff02::1:ffXX:XXXX",
              { en: "Devices with an address ending in XX:XXXX", hi: "Jin devices ka address XX:XXXX par khatam hota hai" },
              { en: "NS messages (the solicited-node group)", hi: "NS messages (solicited-node group)" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Routing protocols have link-local groups too, the IPv6 versions of the IPv4 groups you will meet later: OSPFv3 uses `ff02::5` (all OSPF routers) and `ff02::6` (DR and BDR), and EIGRP for IPv6 uses `ff02::a`.",
            hi: "Routing protocols ke bhi link-local groups hote hain, jo un IPv4 groups ke IPv6 version hain jo aage milenge: OSPFv3 `ff02::5` (saare OSPF routers) aur `ff02::6` (DR aur BDR) use karta hai, aur EIGRP for IPv6 `ff02::a` use karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Multicast scopes", hi: "Multicast scopes" },
          columns: ["Prefix", "Scope", { en: "Stays within", hi: "Kahan tak rehta hai" }],
          rows: [
            ["ff01::", "Interface-local", { en: "The device itself", hi: "Device ke andar hi" }],
            ["ff02::", "Link-local", { en: "The local link", hi: "Local link tak" }],
            ["ff05::", "Site-local", { en: "One site", hi: "Ek site tak" }],
            ["ff08::", "Organization-local", { en: "The whole organisation", hi: "Poori organisation tak" }],
            ["ff0e::", "Global", { en: "The internet", hi: "Internet tak" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "The **solicited-node** group is how IPv6 avoids ARP's broadcast. Take the last 24 bits (6 hex digits) of a unicast address and put them after `ff02::1:ff`. For `2001:db8:1:1::1` the last 6 digits are `00:0001`, so the group is `ff02::1:ff00:1`. For `fe80::211:22ff:fe33:4401` it is `ff02::1:ff33:4401`. A device joins one of these groups for each unicast address it has; addresses that end the same way share one group.",
            hi: "**Solicited-node** group se IPv6 ARP ke broadcast se bachta hai. Unicast address ke aakhri 24 bits (6 hex digits) lo aur `ff02::1:ff` ke baad laga do. `2001:db8:1:1::1` ke aakhri 6 digits `00:0001` hain, toh group `ff02::1:ff00:1` hai. `fe80::211:22ff:fe33:4401` ke liye yeh `ff02::1:ff33:4401` hai. Device apne har unicast address ke liye aisa ek group join karta hai; jin addresses ka aakhri hissa same hai, woh ek hi group share karte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Anycast** is one unicast address configured on several devices. Routers deliver each packet to the nearest one, by routing metric. There is no special range: you take a normal unicast address and mark it, for example `ipv6 address 2001:db8:1:1::99/128 anycast`. It suits services such as DNS, where any of several servers can answer.",
            hi: "**Anycast** matlab ek hi unicast address kai devices par configure karna. Routers har packet ko routing metric ke hisaab se sabse nazdeeki device tak pahunchate hain. Iski koi alag range nahi hai: normal unicast address lo aur use mark karo, jaise `ipv6 address 2001:db8:1:1::99/128 anycast`. Yeh DNS jaisi services ke liye sahi hai, jahan kai servers mein se koi bhi jawab de sakta hai.",
          },
        },
      ],
    },
    {
      id: "eui-64",
      heading: { en: "Modified EUI-64: an interface ID from a MAC", hi: "Modified EUI-64: MAC se interface ID" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An interface ID is 64 bits, but a MAC address is only 48. **Modified EUI-64** stretches the MAC to 64 bits, so a device can build a unique interface ID with no configuration. Here it is for R1's G0/0, MAC `0011.2233.4401`:",
            hi: "Interface ID 64 bits ka hota hai, lekin MAC address sirf 48 bits ka. **Modified EUI-64** MAC ko 64 bits tak badha deta hai, taaki device bina kisi configuration ke unique interface ID bana sake. R1 ke G0/0 (MAC `0011.2233.4401`) ke liye dekho:",
          },
        },
        {
          type: "steps",
          items: [
            { en: "Split the MAC into two 24-bit halves: `001122` and `334401`.", hi: "MAC ko 24-24 bits ke do halves mein todo: `001122` aur `334401`." },
            { en: "Insert `FFFE` in the middle: `0011:22FF:FE33:4401`. That is 64 bits.", hi: "Beech mein `FFFE` daalo: `0011:22FF:FE33:4401`. Ab 64 bits ho gaye." },
            {
              en: "Flip the 7th bit of the first byte (the U/L bit). `00` is `0000 0000`; flipping bit 7 gives `0000 0010` = `02`. The interface ID is `0211:22FF:FE33:4401`.",
              hi: "Pehle byte ka 7th bit (U/L bit) flip karo. `00` = `0000 0000`; bit 7 flip karne par `0000 0010` = `02`. Interface ID ban gaya `0211:22FF:FE33:4401`.",
            },
            {
              en: "Put a prefix in front. R1's link-local on G0/0 is `FE80::211:22FF:FE33:4401`, exactly what `show ipv6 interface brief` showed in the last lesson.",
              hi: "Aage prefix lagao. G0/0 par R1 ka link-local `FE80::211:22FF:FE33:4401` hai, bilkul wahi jo pichhle lesson mein `show ipv6 interface brief` ne dikhaya tha.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Second example: PC-A in the animation", hi: "Doosra example: animation wala PC-A" },
          columns: [{ en: "Step", hi: "Step" }, "Result"],
          rows: [
            ["MAC", "0050.56aa.0001"],
            [{ en: "Split and insert FFFE", hi: "Todo aur FFFE daalo" }, "0050:56ff:feaa:0001"],
            [{ en: "Flip bit 7: 00 → 02", hi: "Bit 7 flip: 00 → 02" }, "0250:56ff:feaa:0001"],
            ["Link-local", "fe80::250:56ff:feaa:1"],
            [{ en: "With prefix 2001:db8:1:1::/64", hi: "Prefix 2001:db8:1:1::/64 ke saath" }, "2001:db8:1:1:250:56ff:feaa:1"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Shortcut for the flip", hi: "Flip ka shortcut" },
          text: {
            en: "Bit 7 is the '2' bit of the second hex digit, so only that digit changes: 0↔2, 1↔3, 4↔6, 5↔7, 8↔a, 9↔b, c↔e, d↔f. So `1c` becomes `1e`, and `02` becomes `00`.",
            hi: "Bit 7 doosre hex digit ka '2' wala bit hai, isliye sirf wahi digit badalta hai: 0↔2, 1↔3, 4↔6, 5↔7, 8↔a, 9↔b, c↔e, d↔f. Yaani `1c` ban jaata hai `1e`, aur `02` ban jaata hai `00`.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Not every host uses EUI-64", hi: "Har host EUI-64 use nahi karta" },
          text: {
            en: "An EUI-64 address carries the MAC, so a laptop could be tracked from network to network. Windows, macOS, iOS and Android therefore build their SLAAC addresses from random interface IDs by default. Cisco routers use EUI-64 for their link-local addresses, and the exam expects you to do the EUI-64 math.",
            hi: "EUI-64 address mein MAC chhupa hota hai, toh laptop ko ek network se doosre network tak track kiya ja sakta hai. Isliye Windows, macOS, iOS aur Android by default random interface IDs se SLAAC addresses banate hain. Cisco routers apne link-local addresses ke liye EUI-64 use karte hain, aur exam tumse EUI-64 ka calculation expect karta hai.",
          },
        },
        {
          type: "cli",
          title: { en: "EUI-64 and a manual link-local on IOS", hi: "IOS par EUI-64 aur manual link-local" },
          lines: [
            { prompt: "R1(config)#", cmd: "interface gigabitethernet0/2" },
            {
              prompt: "R1(config-if)#",
              cmd: "ipv6 address 2001:db8:1:3::/64 eui-64",
              comment: { en: "Give only the prefix; IOS adds the EUI-64 interface ID", hi: "Sirf prefix do; EUI-64 interface ID IOS khud jodta hai" },
            },
            {
              prompt: "R1(config-if)#",
              cmd: "ipv6 address fe80::1 link-local",
              comment: { en: "Replaces the automatic link-local with an easy one", hi: "Automatic link-local ki jagah aasaan address" },
            },
            { prompt: "R1(config-if)#", cmd: "no shutdown" },
            { prompt: "R1(config-if)#", cmd: "end" },
            { prompt: "R1#", cmd: "show ipv6 interface brief" },
            { out: "GigabitEthernet0/2     [up/up]", comment: { en: "Other interfaces left out", hi: "Baaki interfaces hata diye" } },
            { out: "    FE80::1" },
            { out: "    2001:DB8:1:3:211:22FF:FE33:4403", comment: { en: "Prefix + EUI-64 from MAC 0011.2233.4403", hi: "Prefix + MAC 0011.2233.4403 se EUI-64" } },
          ],
          note: {
            en: "An interface has only one link-local address, so the manual one replaces the automatic one. `ipv6 enable` turns IPv6 on with just a link-local address and no global address.",
            hi: "Interface par ek hi link-local address hota hai, isliye manual wala automatic wale ki jagah le leta hai. `ipv6 enable` IPv6 ko sirf link-local address ke saath on karta hai, bina global address ke.",
          },
        },
      ],
    },
    {
      id: "ndp",
      heading: { en: "NDP: the protocol that replaces ARP", hi: "NDP: woh protocol jo ARP ki jagah leta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Neighbor Discovery Protocol (NDP)** does ARP's job and more. It uses ICMPv6 messages, all sent on the local link. Four of them matter for the CCNA:",
            hi: "**Neighbor Discovery Protocol (NDP)** ARP ka kaam bhi karta hai aur usse zyada bhi. Yeh ICMPv6 messages use karta hai, jo sab local link par hi jaate hain. CCNA ke liye inmein se chaar zaroori hain:",
          },
        },
        {
          type: "table",
          caption: { en: "The four NDP messages", hi: "NDP ke chaar messages" },
          columns: ["Message", { en: "ICMPv6 type", hi: "ICMPv6 type" }, { en: "From → to", hi: "Kisse → kisko" }, { en: "Meaning", hi: "Matlab" }],
          rows: [
            [
              "Router Solicitation (RS)",
              "133",
              "Host → ff02::2",
              { en: "Any routers here? Send me your details.", hi: "Koi router hai? Apni details bhejo." },
            ],
            [
              "Router Advertisement (RA)",
              "134",
              "Router → ff02::1",
              {
                en: "Here is the prefix, and I can be your default gateway. Also sent on its own, every 200 seconds by default on IOS.",
                hi: "Yeh raha prefix, aur main tumhara default gateway ban sakta hoon. IOS par by default har 200 seconds par apne aap bhi jaata hai.",
              },
            ],
            [
              "Neighbor Solicitation (NS)",
              "135",
              { en: "Any → the target's solicited-node group", hi: "Koi bhi → target ka solicited-node group" },
              { en: "What is your MAC? (like an ARP request)", hi: "Tumhara MAC kya hai? (ARP request jaisa)" },
            ],
            [
              "Neighbor Advertisement (NA)",
              "136",
              { en: "Target → the asker (unicast); to ff02::1 when it answers a DAD check", hi: "Target → poochne wala (unicast); DAD ka jawab ho toh ff02::1 ko" },
              { en: "This is my MAC. (like an ARP reply)", hi: "Yeh raha mera MAC. (ARP reply jaisa)" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "The big difference from ARP is where the question goes. An ARP request is a broadcast that every host must read. An NS goes to the target's solicited-node group, in a frame whose destination MAC is `3333` plus the last 32 bits of the group (`ff02::1:ff00:1` → `3333.ff00.0001`). Network cards that have not joined that group discard the frame, so the other hosts are not disturbed.",
            hi: "ARP se sabse bada fark yeh hai ki sawaal kahan jaata hai. ARP request broadcast hai jise har host ko padhna padta hai. NS target ke solicited-node group ko jaata hai, ek aise frame mein jiska destination MAC `3333` + group ke aakhri 32 bits hota hai (`ff02::1:ff00:1` → `3333.ff00.0001`). Jin network cards ne woh group join nahi kiya, woh frame discard kar dete hain, isliye baaki hosts disturb nahi hote.",
          },
        },
        {
          type: "cli",
          title: { en: "The IPv6 neighbor table on R1", hi: "R1 ki IPv6 neighbor table" },
          lines: [
            { prompt: "R1#", cmd: "show ipv6 neighbors" },
            { out: "IPv6 Address                              Age Link-layer Addr State Interface" },
            { out: "FE80::250:56FF:FEAA:1                       0 0050.56aa.0001  REACH Gi0/0" },
            {
              out: "2001:DB8:1:1:250:56FF:FEAA:1                0 0050.56aa.0001  REACH Gi0/0",
              comment: { en: "Two IPv6 addresses, one MAC: both belong to PC-A", hi: "Do IPv6 addresses, ek MAC: dono PC-A ke hain" },
            },
          ],
          note: {
            en: "On Windows use `netsh interface ipv6 show neighbors`; on Linux, `ip -6 neigh`.",
            hi: "Windows par `netsh interface ipv6 show neighbors` chalao; Linux par `ip -6 neigh`.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Duplicate Address Detection (DAD)** uses the same NS message. Before a host uses any new unicast address, including its link-local, it checks that nobody else already has it:",
            hi: "**Duplicate Address Detection (DAD)** bhi yahi NS message use karta hai. Koi bhi naya unicast address, link-local samet, use karne se pehle host check karta hai ki woh pehle se kisi aur ke paas toh nahi:",
          },
        },
        {
          type: "steps",
          items: [
            { en: "The new address is marked **tentative**; the host cannot use it yet.", hi: "Naya address **tentative** mark hota hai; host abhi ise use nahi kar sakta." },
            {
              en: "The host sends an NS with source `::`, destination the solicited-node group of the new address, and the new address as the target.",
              hi: "Host ek NS bhejta hai: source `::`, destination naye address ka solicited-node group, aur target khud naya address.",
            },
            {
              en: "If another device already owns the address, it answers with an NA. The asker has no address yet, so this NA goes to `ff02::1`. The host must not use the address.",
              hi: "Agar address pehle se kisi aur device ka hai, toh woh NA se jawab deta hai. Poochne wale ke paas abhi koi address nahi, isliye yeh NA `ff02::1` ko jaata hai. Host woh address use nahi karega.",
            },
            {
              en: "If nothing comes back (about 1 second by default), the address is unique and goes into use.",
              hi: "Agar kuch wapas nahi aata (default mein lagbhag 1 second), toh address unique hai aur use mein aa jaata hai.",
            },
          ],
        },
      ],
    },
    {
      id: "slaac-dhcpv6",
      heading: { en: "SLAAC, stateless DHCPv6 and stateful DHCPv6", hi: "SLAAC, stateless DHCPv6 aur stateful DHCPv6" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**SLAAC** (Stateless Address Autoconfiguration) lets a host configure itself from an RA. The host takes the /64 prefix from the RA, adds its own interface ID (EUI-64 or random), runs DAD, and uses the RA's source address, the router's link-local, as its default gateway. No server hands out addresses and nobody keeps a list, which is why it is called stateless.",
            hi: "**SLAAC** (Stateless Address Autoconfiguration) se host RA ki madad se khud ko configure kar leta hai. Host RA se /64 prefix leta hai, apna interface ID (EUI-64 ya random) jodta hai, DAD chalata hai, aur RA ka source address, yaani router ka link-local, apna default gateway bana leta hai. Koi server address nahi baantta aur koi list nahi rakhta, isliye ise stateless kehte hain.",
          },
        },
        {
          type: "p",
          text: {
            en: "Two flags in the RA tell hosts whether a DHCPv6 server is involved: **M** (managed: get the address from DHCPv6) and **O** (other: get only extra settings, such as DNS servers, from DHCPv6).",
            hi: "RA ke do flags hosts ko batate hain ki DHCPv6 server ka role hai ya nahi: **M** (managed: address DHCPv6 se lo) aur **O** (other: sirf extra settings, jaise DNS servers, DHCPv6 se lo).",
          },
        },
        {
          type: "table",
          caption: { en: "Three ways a host gets its settings", hi: "Host ko settings milne ke teen tarike" },
          columns: ["Method", { en: "Address from", hi: "Address kahan se" }, { en: "DNS server from", hi: "DNS server kahan se" }, { en: "Default gateway from", hi: "Default gateway kahan se" }],
          rows: [
            [
              "SLAAC only (M=0, O=0)",
              { en: "Built by the host from the RA prefix", hi: "RA prefix se host khud banata hai" },
              { en: "The RA's DNS option, where supported", hi: "RA ka DNS option, jahan support ho" },
              "RA",
            ],
            [
              "Stateless DHCPv6 (M=0, O=1)",
              { en: "Built by the host from the RA prefix", hi: "RA prefix se host khud banata hai" },
              { en: "DHCPv6 server", hi: "DHCPv6 server" },
              "RA",
            ],
            [
              "Stateful DHCPv6 (M=1)",
              { en: "Assigned and tracked by a DHCPv6 server", hi: "DHCPv6 server assign aur track karta hai" },
              { en: "DHCPv6 server", hi: "DHCPv6 server" },
              "RA",
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "DHCPv6 does not give a default gateway", hi: "DHCPv6 default gateway nahi deta" },
          text: {
            en: "Unlike DHCPv4, DHCPv6 has no default-gateway option. Even with stateful DHCPv6, the host learns its gateway from the router's RA. If RAs are missing, hosts have no gateway.",
            hi: "DHCPv4 se alag, DHCPv6 mein default-gateway option hota hi nahi. Stateful DHCPv6 ho tab bhi host gateway router ke RA se seekhta hai. RAs nahi aaye toh hosts ke paas gateway nahi hoga.",
          },
        },
        {
          type: "p",
          text: {
            en: "DHCPv6 clients use UDP port 546 and servers UDP port 547. A client finds servers by sending to `ff02::1:2`; if the server is in another subnet, a relay on the router forwards the request to it (lesson 4.1).",
            hi: "DHCPv6 clients UDP port 546 aur servers UDP port 547 use karte hain. Client `ff02::1:2` par bhej kar servers dhoondhta hai; server doosre subnet mein ho toh router par relay request ko wahan tak forward karta hai (lesson 4.1).",
          },
        },
        {
          type: "cli",
          title: { en: "Related IOS commands", hi: "Related IOS commands" },
          lines: [
            { prompt: "R1(config-if)#", cmd: "ipv6 nd managed-config-flag", comment: { en: "Set M=1 in this interface's RAs", hi: "Is interface ke RAs mein M=1" } },
            { prompt: "R1(config-if)#", cmd: "ipv6 nd other-config-flag", comment: { en: "Set O=1 in this interface's RAs", hi: "Is interface ke RAs mein O=1" } },
            { prompt: "R2(config-if)#", cmd: "ipv6 address autoconfig", comment: { en: "R2 becomes a SLAAC client on this interface", hi: "R2 is interface par SLAAC client ban jaata hai" } },
            { prompt: "R3(config-if)#", cmd: "ipv6 address dhcp", comment: { en: "R3 becomes a DHCPv6 client on this interface", hi: "R3 is interface par DHCPv6 client ban jaata hai" } },
          ],
        },
      ],
    },
    {
      id: "verify",
      heading: { en: "Reading show ipv6 interface", hi: "show ipv6 interface padhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "One command shows almost everything from this lesson for a single interface: the link-local address, the global addresses with their prefixes, the multicast groups joined, and the NDP settings.",
            hi: "Ek hi command is lesson ki lagbhag har cheez ek interface ke liye dikha deta hai: link-local address, global addresses unke prefixes ke saath, joined multicast groups, aur NDP settings.",
          },
        },
        {
          type: "cli",
          title: { en: "R1 G0/0 in detail (shortened)", hi: "R1 G0/0 detail mein (chhota kiya hua)" },
          lines: [
            { prompt: "R1#", cmd: "show ipv6 interface gigabitethernet0/0" },
            { out: "GigabitEthernet0/0 is up, line protocol is up" },
            {
              out: "  IPv6 is enabled, link-local address is FE80::211:22FF:FE33:4401",
              comment: { en: "EUI-64 from MAC 0011.2233.4401", hi: "MAC 0011.2233.4401 se EUI-64" },
            },
            { out: "  No Virtual link-local address(es):" },
            { out: "  Global unicast address(es):" },
            { out: "    2001:DB8:1:1::1, subnet is 2001:DB8:1:1::/64" },
            { out: "  Joined group address(es):" },
            { out: "    FF02::1", comment: { en: "All nodes", hi: "All nodes" } },
            { out: "    FF02::2", comment: { en: "All routers: joined because ipv6 unicast-routing is on", hi: "All routers: kyunki ipv6 unicast-routing on hai" } },
            { out: "    FF02::1:FF00:1", comment: { en: "Solicited-node group for 2001:DB8:1:1::1", hi: "2001:DB8:1:1::1 ka solicited-node group" } },
            { out: "    FF02::1:FF33:4401", comment: { en: "Solicited-node group for the link-local", hi: "Link-local ka solicited-node group" } },
            { out: "  MTU is 1500 bytes" },
            { out: "  ND DAD is enabled, number of DAD attempts: 1" },
            { out: "  ND router advertisements are sent every 200 seconds" },
            { out: "  Hosts use stateless autoconfig for addresses.", comment: { en: "M flag is 0: hosts use SLAAC", hi: "M flag 0 hai: hosts SLAAC use karte hain" } },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "Global unicast address (GUA)", def: { en: "A public, internet-routable IPv6 address from 2000::/3.", hi: "Public IPv6 address jo internet par route hota hai, 2000::/3 range se." } },
    { term: "Unique local address (ULA)", def: { en: "A private IPv6 address from fc00::/7; in practice it starts with fd.", hi: "fc00::/7 range ka private IPv6 address; practice mein yeh fd se shuru hota hai." } },
    { term: "Link-local address", def: { en: "An fe80:: address every IPv6 interface creates for itself; valid only on its own link.", hi: "fe80:: wala address jo har IPv6 interface khud banata hai; sirf apne link par valid hai." } },
    {
      term: "Solicited-node multicast",
      def: { en: "ff02::1:ff plus the last 24 bits of a unicast address; NS messages for that address are sent here.", hi: "ff02::1:ff + unicast address ke aakhri 24 bits; us address ke liye NS messages yahin bheje jaate hain." },
    },
    { term: "Modified EUI-64", def: { en: "A 64-bit interface ID made from a MAC: split it, insert FFFE, flip the 7th bit.", hi: "MAC se bana 64-bit interface ID: MAC ko todo, FFFE daalo, 7th bit flip karo." } },
    { term: "NDP", def: { en: "Neighbor Discovery Protocol: ICMPv6 messages (RS, RA, NS, NA) that find routers and neighbours' MACs.", hi: "Neighbor Discovery Protocol: ICMPv6 messages (RS, RA, NS, NA) jo routers aur neighbours ke MAC dhoondhte hain." } },
    { term: "SLAAC", def: { en: "Stateless Address Autoconfiguration: a host builds its own address from the prefix in an RA.", hi: "Stateless Address Autoconfiguration: host RA ke prefix se apna address khud banata hai." } },
    { term: "DAD", def: { en: "Duplicate Address Detection: an NS for your own new address; silence means it is unique.", hi: "Duplicate Address Detection: apne naye address ke liye NS; koi jawab na aaye toh address unique hai." } },
  ],
  commands: [
    { cmd: "ipv6 address 2001:db8:1:3::/64 eui-64", mode: "Cisco interface config", does: { en: "Build the address from the prefix plus an EUI-64 interface ID", hi: "Prefix + EUI-64 interface ID se address banata hai" } },
    { cmd: "ipv6 address fe80::1 link-local", mode: "Cisco interface config", does: { en: "Set the link-local address by hand", hi: "Link-local address manually set karta hai" } },
    { cmd: "ipv6 enable", mode: "Cisco interface config", does: { en: "Enable IPv6 with only a link-local address", hi: "Sirf link-local address ke saath IPv6 enable karta hai" } },
    { cmd: "ipv6 address 2001:db8:1:1::99/128 anycast", mode: "Cisco interface config", does: { en: "Configure an anycast address", hi: "Anycast address configure karta hai" } },
    { cmd: "ipv6 address autoconfig", mode: "Cisco interface config", does: { en: "Get an address by SLAAC", hi: "SLAAC se address leta hai" } },
    { cmd: "ipv6 address dhcp", mode: "Cisco interface config", does: { en: "Get an address from a DHCPv6 server", hi: "DHCPv6 server se address leta hai" } },
    { cmd: "ipv6 nd managed-config-flag", mode: "Cisco interface config", does: { en: "Set the M flag in RAs (stateful DHCPv6)", hi: "RAs mein M flag set karta hai (stateful DHCPv6)" } },
    { cmd: "ipv6 nd other-config-flag", mode: "Cisco interface config", does: { en: "Set the O flag in RAs (stateless DHCPv6)", hi: "RAs mein O flag set karta hai (stateless DHCPv6)" } },
    {
      cmd: "show ipv6 interface gigabitethernet0/0",
      mode: "Cisco privileged EXEC",
      does: { en: "Show link-local and global addresses, joined groups and NDP settings", hi: "Link-local aur global addresses, joined groups aur NDP settings dikhata hai" },
    },
    { cmd: "show ipv6 neighbors", mode: "Cisco privileged EXEC", does: { en: "Show the IPv6 neighbor table (IPv6 address to MAC)", hi: "IPv6 neighbor table dikhata hai (IPv6 address se MAC)" } },
    { cmd: "netsh interface ipv6 show neighbors", mode: "Windows terminal", does: { en: "Show the Windows IPv6 neighbor cache", hi: "Windows ka IPv6 neighbor cache dikhata hai" } },
    { cmd: "ip -6 neigh", mode: "Linux terminal", does: { en: "Show the Linux IPv6 neighbor table", hi: "Linux ki IPv6 neighbor table dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Flipping the wrong bit in EUI-64. It is the 7th bit from the left of the first byte, so `00` becomes `02`, not `01` or `80`.",
      hi: "EUI-64 mein galat bit flip karna. Pehle byte ka left se 7th bit flip hota hai, isliye `00` ban jaata hai `02`, `01` ya `80` nahi.",
    },
    {
      en: "Thinking link-local addresses are routed. Routers never forward packets with a link-local source or destination to another link.",
      hi: "Yeh sochna ki link-local addresses route hote hain. Routers link-local source ya destination wale packets kabhi doosre link par forward nahi karte.",
    },
    {
      en: "Mixing up the ULA range and real ULAs. If the exam asks for the range, the answer is `fc00::/7`; but the 8th bit is set to 1, so the addresses you actually see start with `fd`.",
      hi: "ULA range aur asli ULAs ko mix karna. Exam range pooche toh jawab `fc00::/7` hai; lekin 8th bit 1 set hota hai, isliye jo addresses asal mein dikhte hain woh `fd` se shuru hote hain.",
    },
    {
      en: "Mixing up the RS and RA destinations. RS goes to `ff02::2` (all routers); RA goes to `ff02::1` (all nodes).",
      hi: "RS aur RA ke destinations mix karna. RS `ff02::2` (all routers) ko jaata hai; RA `ff02::1` (all nodes) ko.",
    },
    {
      en: "Expecting DHCPv6 to hand out the default gateway. The gateway always comes from the RA.",
      hi: "Yeh expect karna ki DHCPv6 default gateway dega. Gateway hamesha RA se aata hai.",
    },
    {
      en: "Calling an NS a broadcast. IPv6 has no broadcast; an NS goes to the solicited-node multicast group.",
      hi: "NS ko broadcast bolna. IPv6 mein broadcast nahi hota; NS solicited-node multicast group ko jaata hai.",
    },
  ],
  recap: [
    {
      en: "GUA `2000::/3`, ULA `fc00::/7` (really `fd`), link-local `fe80::/10`, multicast `ff00::/8`. Anycast is one unicast address shared by several devices.",
      hi: "GUA `2000::/3`, ULA `fc00::/7` (asal mein `fd`), link-local `fe80::/10`, multicast `ff00::/8`. Anycast ek unicast address hai jo kai devices share karte hain.",
    },
    {
      en: "Every IPv6 interface has a link-local address. It never leaves the link and is used by NDP and as the next hop.",
      hi: "Har IPv6 interface ka ek link-local address hota hai. Yeh kabhi link se bahar nahi jaata, aur NDP isko use karta hai aur yeh next hop bhi banta hai.",
    },
    {
      en: "EUI-64: split the MAC, insert `FFFE`, flip the 7th bit. `0011.2233.4401` → `0211:22ff:fe33:4401`.",
      hi: "EUI-64: MAC todo, `FFFE` daalo, 7th bit flip karo. `0011.2233.4401` → `0211:22ff:fe33:4401`.",
    },
    {
      en: "NDP: RS → `ff02::2`, RA → `ff02::1`, NS → solicited-node `ff02::1:ff` + last 24 bits, NA → unicast. DAD is an NS for your own new address.",
      hi: "NDP: RS → `ff02::2`, RA → `ff02::1`, NS → solicited-node `ff02::1:ff` + aakhri 24 bits, NA → unicast. DAD apne naye address ke liye bheja gaya NS hai.",
    },
    {
      en: "SLAAC: prefix from the RA + the host's own interface ID. Stateless DHCPv6 adds DNS; stateful DHCPv6 assigns the address. The gateway always comes from the RA.",
      hi: "SLAAC: RA se prefix + host ka apna interface ID. Stateless DHCPv6 DNS deta hai; stateful DHCPv6 address assign karta hai. Gateway hamesha RA se aata hai.",
    },
  ],
  quiz: [
    {
      q: { en: "What is the modified EUI-64 interface ID for MAC `1c6a.7a12.3456`?", hi: "MAC `1c6a.7a12.3456` ka modified EUI-64 interface ID kya hai?" },
      options: [
        { en: "1c6a:7aff:fe12:3456", hi: "1c6a:7aff:fe12:3456" },
        { en: "1e6a:7aff:fe12:3456", hi: "1e6a:7aff:fe12:3456" },
        { en: "1e6a:7afe:ff12:3456", hi: "1e6a:7afe:ff12:3456" },
        { en: "9c6a:7aff:fe12:3456", hi: "9c6a:7aff:fe12:3456" },
      ],
      answer: 1,
      explain: {
        en: "Split into `1c6a7a` and `123456` and insert `fffe` to get `1c6a:7aff:fe12:3456`. Then flip the 7th bit: `1c` = `0001 1100` becomes `0001 1110` = `1e`. The first option skips the flip, the third inserts `feff` instead of `fffe`, and the last flips the first bit instead of the 7th.",
        hi: "`1c6a7a` aur `123456` mein todo aur `fffe` daalo, toh `1c6a:7aff:fe12:3456` milta hai. Phir 7th bit flip karo: `1c` = `0001 1100` ban jaata hai `0001 1110` = `1e`. Pehle option mein flip hi nahi hua, teesre mein `fffe` ki jagah `feff` laga hai, aur aakhri mein 7th ki jagah pehla bit flip hua hai.",
      },
      kind: "calc",
    },
    {
      q: { en: "Which of these is a unique local address?", hi: "Inmein se unique local address kaunsa hai?" },
      options: [
        { en: "2001:db8:5::10", hi: "2001:db8:5::10" },
        { en: "fe80::5", hi: "fe80::5" },
        { en: "fd00:ab:cd:1::10", hi: "fd00:ab:cd:1::10" },
        { en: "ff02::1:ff00:10", hi: "ff02::1:ff00:10" },
      ],
      answer: 2,
      explain: {
        en: "Unique local addresses come from `fc00::/7` and in practice start with `fd`. `2001:db8:5::10` is global unicast (2000::/3), `fe80::5` is link-local, and `ff02::1:ff00:10` is a solicited-node multicast group.",
        hi: "Unique local addresses `fc00::/7` se aate hain aur practice mein `fd` se shuru hote hain. `2001:db8:5::10` global unicast (2000::/3) hai, `fe80::5` link-local hai, aur `ff02::1:ff00:10` solicited-node multicast group hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Which solicited-node multicast group does a host join for its address `2001:db8:1:1::a:1b2c`?",
        hi: "Address `2001:db8:1:1::a:1b2c` ke liye host kaunsa solicited-node multicast group join karta hai?",
      },
      options: [
        { en: "ff02::1:ff0a:1b2c", hi: "ff02::1:ff0a:1b2c" },
        { en: "ff02::1:ff00:1b2c", hi: "ff02::1:ff00:1b2c" },
        { en: "ff02::2:ff0a:1b2c", hi: "ff02::2:ff0a:1b2c" },
        { en: "ff05::1:ff0a:1b2c", hi: "ff05::1:ff0a:1b2c" },
      ],
      answer: 0,
      explain: {
        en: "Expanded, the address ends in `...:000a:1b2c`. The last 24 bits are the last 6 hex digits, `0a1b2c`, placed after `ff02::1:ff`: `ff02::1:ff0a:1b2c`. Taking only 16 bits gives the wrong group, and solicited-node groups always use link-local scope `ff02`.",
        hi: "Expand karne par address `...:000a:1b2c` par khatam hota hai. Aakhri 24 bits yaani aakhri 6 hex digits `0a1b2c` hain, jo `ff02::1:ff` ke baad lagte hain: `ff02::1:ff0a:1b2c`. Sirf 16 bits lene se galat group banta hai, aur solicited-node groups hamesha link-local scope `ff02` use karte hain.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "Hosts on a LAN get their addresses from a stateful DHCPv6 server. Where do they learn their default gateway?",
        hi: "Ek LAN ke hosts ko addresses stateful DHCPv6 server se milte hain. Unhe default gateway kahan se pata chalta hai?",
      },
      options: [
        { en: "From a gateway option in the DHCPv6 reply", hi: "DHCPv6 reply ke gateway option se" },
        { en: "From the DNS server", hi: "DNS server se" },
        { en: "From EUI-64, using the router's MAC", hi: "Router ke MAC se EUI-64 karke" },
        { en: "From the source address of the router's RA", hi: "Router ke RA ke source address se" },
      ],
      answer: 3,
      explain: {
        en: "DHCPv6 has no default-gateway option. Hosts always take the gateway from Router Advertisements: the RA's source, the router's link-local address, becomes the default gateway.",
        hi: "DHCPv6 mein default-gateway option hota hi nahi. Hosts gateway hamesha Router Advertisements se lete hain: RA ka source, yaani router ka link-local address, default gateway ban jaata hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A host sends an NS with source `::`, destination `ff02::1:ffaa:1` and target `fe80::250:56ff:feaa:1`, which is its own new address. What is it doing?",
        hi: "Ek host NS bhejta hai jiska source `::`, destination `ff02::1:ffaa:1` aur target `fe80::250:56ff:feaa:1` hai, jo uska apna naya address hai. Woh kya kar raha hai?",
      },
      options: [
        { en: "Asking the router for a prefix", hi: "Router se prefix maang raha hai" },
        { en: "Duplicate Address Detection", hi: "Duplicate Address Detection" },
        { en: "Resolving the router's MAC address", hi: "Router ka MAC address resolve kar raha hai" },
        { en: "Joining the all-routers group", hi: "All-routers group join kar raha hai" },
      ],
      answer: 1,
      explain: {
        en: "An NS whose target is the sender's own tentative address, sent from `::`, is DAD. If any device answers with an NA, the address is already taken. Asking for a prefix would be an RS to `ff02::2`.",
        hi: "Aisa NS jiska target sender ka apna tentative address ho aur source `::` ho, woh DAD hai. Koi device NA se jawab de toh address pehle se kisi ka hai. Prefix maangna hota toh `ff02::2` ko RS jaata.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`show ipv6 interface g0/0` on R1 lists the joined groups `FF02::1`, `FF02::2`, `FF02::1:FF00:1` and `FF02::1:FF33:4401`. Why is `FF02::2` in the list?",
        hi: "R1 par `show ipv6 interface g0/0` mein joined groups `FF02::1`, `FF02::2`, `FF02::1:FF00:1` aur `FF02::1:FF33:4401` dikhte hain. `FF02::2` list mein kyun hai?",
      },
      options: [
        { en: "`ipv6 unicast-routing` is enabled, so R1 acts as a router", hi: "`ipv6 unicast-routing` enabled hai, isliye R1 router ki tarah kaam karta hai" },
        { en: "G0/0 has two IPv6 addresses", hi: "G0/0 par do IPv6 addresses hain" },
        { en: "R1 is a DHCPv6 server", hi: "R1 DHCPv6 server hai" },
        { en: "Every interface with a link-local address joins it", hi: "Link-local address wala har interface ise join karta hai" },
      ],
      answer: 0,
      explain: {
        en: "`FF02::2` is the all-routers group, and IOS joins it only when `ipv6 unicast-routing` is on. The two `FF02::1:FF..` entries are the solicited-node groups for the global and link-local addresses, and `FF02::1` is joined by every IPv6 device.",
        hi: "`FF02::2` all-routers group hai, aur IOS ise tabhi join karta hai jab `ipv6 unicast-routing` on ho. Dono `FF02::1:FF..` entries global aur link-local addresses ke solicited-node groups hain, aur `FF02::1` har IPv6 device join karta hai.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "BrTMMOXFhDU",
      title: "Free CCNA | IPv6 Part 2 | Day 32",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "EUI-64 with practice, then global unicast, unique local, link-local, multicast scopes and anycast.",
        hi: "EUI-64 practice ke saath, phir global unicast, unique local, link-local, multicast scopes aur anycast.",
      },
    },
    {
      id: "rwkHfsWQwy8",
      title: "Free CCNA | IPv6 Part 3 | Day 33",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Watch 9:25 to 22:30: solicited-node multicast, NS/NA, RS/RA, SLAAC and DAD. The rest is IPv6 static routing (lesson 3.4).",
        hi: "9:25 se 22:30 tak dekho: solicited-node multicast, NS/NA, RS/RA, SLAAC aur DAD. Baaki hissa IPv6 static routing hai (lesson 3.4).",
      },
    },
    {
      id: "8ag2tMEXwRU",
      title: "106. Free CCNA (NEW) | IPv6 in Hindi - Types of IPv6 Address",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "The IPv6 address types explained in Hindi.", hi: "IPv6 address types Hindi mein samjhaye gaye hain." },
    },
  ],
  lab: {
    title: { en: "Watch SLAAC and NDP in Packet Tracer", hi: "Packet Tracer mein SLAAC aur NDP dekho" },
    steps: [
      {
        en: "Connect R1 G0/0 to a switch with two PCs. On R1 enter `ipv6 unicast-routing`, then on G0/0 `ipv6 address 2001:db8:1:1::1/64` and `no shutdown`.",
        hi: "R1 ke G0/0 ko do PCs wale switch se jodo. R1 par `ipv6 unicast-routing` do, phir G0/0 par `ipv6 address 2001:db8:1:1::1/64` aur `no shutdown`.",
      },
      {
        en: "On PC1 set IPv6 to Automatic. Note its address and gateway, then check its MAC and work out whether the interface ID is EUI-64.",
        hi: "PC1 par IPv6 ko Automatic karo. Uska address aur gateway note karo, phir MAC dekh kar check karo ki interface ID EUI-64 hai ya nahi.",
      },
      {
        en: "Run `show ipv6 interface g0/0` on R1. Find the link-local address and the joined groups, and work out which group belongs to `2001:db8:1:1::1`.",
        hi: "R1 par `show ipv6 interface g0/0` chalao. Link-local address aur joined groups dhoondho, aur nikaalo ki kaunsa group `2001:db8:1:1::1` ka hai.",
      },
      {
        en: "In Simulation mode, filter on ICMPv6 and ping `2001:db8:1:1::1` from PC1. Open the NS and check its destination address, then find the NA.",
        hi: "Simulation mode mein ICMPv6 ka filter lagao aur PC1 se `2001:db8:1:1::1` ping karo. NS kholo aur uska destination address check karo, phir NA dhoondho.",
      },
      {
        en: "Run `show ipv6 neighbors` on R1 and match each entry to PC1's MAC.",
        hi: "R1 par `show ipv6 neighbors` chalao aur har entry ko PC1 ke MAC se match karo.",
      },
      {
        en: "Set `ipv6 address fe80::1 link-local` on R1 G0/0, then switch PC1 to Static and back to Automatic. Its default gateway should now be `FE80::1`.",
        hi: "R1 G0/0 par `ipv6 address fe80::1 link-local` set karo, phir PC1 ko Static aur wapas Automatic karo. Ab uska default gateway `FE80::1` hona chahiye.",
      },
    ],
  },
};

export default lesson;
