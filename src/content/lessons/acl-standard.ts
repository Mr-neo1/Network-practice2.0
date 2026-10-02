import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "acl-standard",
  intro: {
    en: "A router forwards every packet it has a route for. It does not ask whether the sender should be allowed to reach that network. An access control list (ACL) adds that check: a list of permit and deny rules the router applies to packets on an interface. Standard ACLs are the simplest kind. They look only at the source IP address, and you will use them for basic filtering, for locking down who can log in to a device, and, as you saw in the NAT lesson, to pick which addresses get translated.",
    hi: "Router har woh packet forward kar deta hai jiska route uske paas hai. Woh yeh nahi poochta ki sender ko us network tak pahunchne ki permission hai ya nahi. Access control list (ACL) yahi check add karti hai: permit aur deny rules ki ek list jo router kisi interface par packets ke upar lagata hai. Standard ACL sabse simple type hai. Yeh sirf source IP address dekhti hai, aur tum ise basic filtering ke liye, device par login kaun kar sakta hai yeh lock karne ke liye, aur NAT lesson mein dekha tha waise, kaunse addresses translate honge yeh chunne ke liye use karoge.",
  },
  outcomes: [
    { en: "Explain top-down processing, first match and the implicit deny at the end of every ACL", hi: "Top-down processing, first match aur har ACL ke end mein implicit deny samjha sako" },
    { en: "Convert a prefix length to a wildcard mask and use the host and any keywords", hi: "Prefix length ko wildcard mask mein convert kar sako aur host aur any keywords use kar sako" },
    { en: "Configure numbered and named standard ACLs and apply them with ip access-group", hi: "Numbered aur named standard ACLs configure karke unhe ip access-group se apply kar sako" },
    { en: "Choose where to place a standard ACL and in which direction", hi: "Decide kar sako ki standard ACL kahan aur kis direction mein lagani hai" },
    { en: "Read show access-lists counters and edit an ACL with sequence numbers", hi: "show access-lists ke counters padh sako aur sequence numbers se ACL edit kar sako" },
    { en: "Restrict Telnet and SSH access to a device with access-class", hi: "access-class se device ka Telnet aur SSH access restrict kar sako" },
  ],
  sections: [
    {
      id: "what-acls-do",
      heading: { en: "What an ACL is and what it does", hi: "ACL kya hai aur kya karti hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An ACL is an ordered list of rules. Each rule is an **access control entry (ACE)** that says **permit** or **deny** plus what to match. On its own an ACL does nothing. It starts filtering only when you apply it to an interface in one direction: **in** (packets arriving on that interface) or **out** (packets leaving it).",
            hi: "ACL rules ki ek ordered list hai. Har rule ek **access control entry (ACE)** hota hai jo **permit** ya **deny** bolta hai aur saath mein batata hai kya match karna hai. Akeli ACL kuch nahi karti. Filtering tabhi shuru hoti hai jab tum use kisi interface par ek direction mein apply karte ho: **in** (us interface par aane wale packets) ya **out** (us interface se nikalne wale packets).",
          },
        },
        {
          type: "p",
          text: {
            en: "Filtering is the main job, but IOS also uses ACLs to **identify** traffic for other features. NAT uses one to choose which inside addresses get translated, and the `access-class` command uses one to decide who may open a Telnet or SSH session to the device. In those cases \"deny\" means \"not selected\", not \"dropped\".",
            hi: "Main kaam filtering hai, lekin IOS ACLs ko doosre features ke liye traffic **identify** karne mein bhi use karta hai. NAT ek ACL se decide karta hai ki kaunse inside addresses translate honge, aur `access-class` command ek ACL se decide karta hai ki device par Telnet ya SSH session kaun khol sakta hai. Wahan \"deny\" ka matlab \"select nahi hua\" hai, \"drop\" nahi.",
          },
        },
        {
          type: "table",
          caption: { en: "The two IPv4 ACL types on the CCNA", hi: "CCNA ke do IPv4 ACL types" },
          columns: ["", { en: "Standard", hi: "Standard" }, { en: "Extended", hi: "Extended" }],
          rows: [
            [{ en: "Matches", hi: "Kya match karti hai" }, { en: "Source IP only", hi: "Sirf source IP" }, { en: "Protocol, source, destination, ports", hi: "Protocol, source, destination, ports" }],
            [{ en: "Numbers", hi: "Numbers" }, "1-99, 1300-1999", "100-199, 2000-2699"],
            [{ en: "Named form", hi: "Named form" }, "ip access-list standard NAME", "ip access-list extended NAME"],
            [{ en: "Place it", hi: "Kahan lagao" }, { en: "Close to the destination", hi: "Destination ke paas" }, { en: "Close to the source", hi: "Source ke paas" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "This lesson covers standard ACLs. Extended ACLs, which can say \"web yes, ping no\", are the next lesson.",
            hi: "Is lesson mein standard ACLs hain. Extended ACLs, jo \"web haan, ping nahi\" bol sakti hain, agle lesson mein hain.",
          },
        },
      ],
    },
    {
      id: "how-matching-works",
      heading: { en: "Top-down, first match, implicit deny", hi: "Top-down, first match, implicit deny" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every packet is checked against the ACL the same way, and the order of the lines decides the result.",
            hi: "Har packet ACL ke against ek hi tarike se check hota hai, aur lines ka order hi result decide karta hai.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "The router compares the packet with the **first** ACE, then the second, and so on, top to bottom.",
              hi: "Router packet ko **pehli** ACE se compare karta hai, phir doosri se, aur aise hi upar se neeche.",
            },
            {
              en: "At the **first match** it applies that ACE's action, permit or deny, and stops. Later lines are never checked for this packet.",
              hi: "**Pehla match** milte hi us ACE ka action, permit ya deny, lag jaata hai aur checking ruk jaati hai. Is packet ke liye baad wali lines kabhi check nahi hoti.",
            },
            {
              en: "If no ACE matches, the packet hits the **implicit deny** that ends every ACL and is dropped. You never type this line and `show access-lists` does not display it.",
              hi: "Agar koi ACE match nahi hui, toh packet har ACL ke end mein baithe **implicit deny** se takrata hai aur drop ho jaata hai. Yeh line tum kabhi type nahi karte aur `show access-lists` ise dikhata bhi nahi.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Same two lines, different order, different result for 192.168.1.20", hi: "Wahi do lines, alag order, 192.168.1.20 ke liye alag result" },
          columns: [{ en: "Order", hi: "Order" }, { en: "ACL lines", hi: "ACL lines" }, { en: "Packet from 192.168.1.20", hi: "192.168.1.20 se packet" }],
          rows: [
            [{ en: "Correct", hi: "Sahi" }, "deny host 192.168.1.20 / permit 192.168.1.0 0.0.0.255", { en: "Denied by line 1", hi: "Line 1 se deny" }],
            [{ en: "Wrong", hi: "Galat" }, "permit 192.168.1.0 0.0.0.255 / deny host 192.168.1.20", { en: "Permitted by line 1; the deny never runs", hi: "Line 1 se permit; deny kabhi chalta hi nahi" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Put specific entries (single hosts) above general ones (whole subnets). An ACL that contains only deny lines blocks everything, because whatever the denies miss is caught by the implicit deny.",
            hi: "Specific entries (single hosts) ko general entries (poore subnets) ke upar rakho. Jis ACL mein sirf deny lines hain woh sab kuch block kar deti hai, kyunki jo deny lines se bach gaya woh implicit deny mein pakda jaata hai.",
          },
        },
      ],
    },
    {
      id: "wildcard-masks",
      heading: { en: "Wildcard masks, host and any", hi: "Wildcard masks, host aur any" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An ACE matches a range of addresses with an address plus a **wildcard mask**. You met wildcards in the OSPF `network` command and in the NAT lesson's `access-list 1`. A wildcard bit of **0 means \"this bit must match\"** and **1 means \"ignore this bit\"**. For a whole subnet the wildcard is the subnet mask inverted: subtract each octet from 255.",
            hi: "ACE ek address aur **wildcard mask** se addresses ki range match karti hai. Wildcard tum OSPF ke `network` command aur NAT lesson ki `access-list 1` mein dekh chuke ho. Wildcard ka **0 bit matlab \"yeh bit match hona chahiye\"** aur **1 matlab \"is bit ko ignore karo\"**. Poore subnet ke liye wildcard subnet mask ka ulta hota hai: har octet ko 255 mein se ghata do.",
          },
        },
        {
          type: "table",
          caption: { en: "Subnet mask to wildcard (255.255.255.255 minus the mask)", hi: "Subnet mask se wildcard (255.255.255.255 minus mask)" },
          columns: ["Prefix", { en: "Subnet mask", hi: "Subnet mask" }, "Wildcard", { en: "Written in an ACE", hi: "ACE mein kaise likhte hain" }],
          rows: [
            ["/32", "255.255.255.255", "0.0.0.0", "host 192.168.1.20"],
            ["/30", "255.255.255.252", "0.0.0.3", "10.0.12.0 0.0.0.3"],
            ["/26", "255.255.255.192", "0.0.0.63", "192.168.1.64 0.0.0.63"],
            ["/24", "255.255.255.0", "0.0.0.255", "192.168.1.0 0.0.0.255"],
            ["/16", "255.255.0.0", "0.0.255.255", "172.16.0.0 0.0.255.255"],
            ["/0", "0.0.0.0", "255.255.255.255", "any"],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "`host 192.168.1.20` is shorthand for `192.168.1.20 0.0.0.0`: every bit must match, so exactly one address.",
              hi: "`host 192.168.1.20`, `192.168.1.20 0.0.0.0` ka short form hai: har bit match honi chahiye, yaani sirf ek address.",
            },
            {
              en: "`any` is shorthand for `0.0.0.0 255.255.255.255`: every bit is ignored, so every address.",
              hi: "`any`, `0.0.0.0 255.255.255.255` ka short form hai: har bit ignore, yaani har address.",
            },
            {
              en: "In a standard ACL, an address typed with no wildcard is treated as a host: `access-list 1 permit 192.168.1.10` matches only 192.168.1.10.",
              hi: "Standard ACL mein bina wildcard ke likha address host maana jaata hai: `access-list 1 permit 192.168.1.10` sirf 192.168.1.10 ko match karta hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Check a match quickly", hi: "Match jaldi check karo" },
          text: {
            en: "Does 192.168.1.77 match `192.168.1.64 0.0.0.63`? The wildcard covers 64 addresses starting at .64, so the range is 192.168.1.64 to 192.168.1.127. Yes, .77 matches. 192.168.1.130 does not.",
            hi: "Kya 192.168.1.77, `192.168.1.64 0.0.0.63` se match karta hai? Wildcard .64 se shuru hone wale 64 addresses cover karta hai, toh range 192.168.1.64 se 192.168.1.127 hai. Haan, .77 match karta hai. 192.168.1.130 nahi karta.",
          },
        },
      ],
    },
    {
      id: "configure-and-apply",
      heading: { en: "Configure and apply a standard ACL", hi: "Standard ACL configure aur apply karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The running example: R1 has LAN A `192.168.1.0/24` on Gi0/0, LAN B `192.168.2.0/24` on Gi0/1 and the server LAN `10.1.1.0/24` on Gi0/2, with SRV1 at `10.1.1.100`. Policy: only LAN A may reach the server LAN, except PC2 (`192.168.1.20`).",
            hi: "Running example: R1 par Gi0/0 par LAN A `192.168.1.0/24` hai, Gi0/1 par LAN B `192.168.2.0/24`, aur Gi0/2 par server LAN `10.1.1.0/24`, jisme SRV1 `10.1.1.100` par hai. Policy: server LAN tak sirf LAN A pahunch sakta hai, lekin PC2 (`192.168.1.20`) nahi.",
          },
        },
        {
          type: "cli",
          title: { en: "Numbered standard ACL 1", hi: "Numbered standard ACL 1" },
          lines: [
            { prompt: "R1(config)#", cmd: "access-list 1 remark Only LAN A to servers, not PC2", comment: { en: "Optional note, shown only in the running config", hi: "Optional note, sirf running config mein dikhta hai" } },
            { prompt: "R1(config)#", cmd: "access-list 1 deny host 192.168.1.20", comment: { en: "Specific host first", hi: "Specific host pehle" } },
            { prompt: "R1(config)#", cmd: "access-list 1 permit 192.168.1.0 0.0.0.255", comment: { en: "Then the rest of LAN A", hi: "Phir baaki LAN A" } },
            { prompt: "R1(config)#", cmd: "interface GigabitEthernet0/2" },
            { prompt: "R1(config-if)#", cmd: "ip access-group 1 out", comment: { en: "Filter packets leaving toward the server LAN", hi: "Server LAN ki taraf nikalne wale packets filter karo" } },
          ],
        },
        {
          type: "cli",
          title: { en: "The same policy as a named ACL", hi: "Wahi policy named ACL ke roop mein" },
          lines: [
            { prompt: "R1(config)#", cmd: "ip access-list standard TO-SERVERS" },
            { prompt: "R1(config-std-nacl)#", cmd: "deny host 192.168.1.20", comment: { en: "Gets sequence number 10", hi: "Sequence number 10 milta hai" } },
            { prompt: "R1(config-std-nacl)#", cmd: "permit 192.168.1.0 0.0.0.255", comment: { en: "Gets sequence number 20", hi: "Sequence number 20 milta hai" } },
            { prompt: "R1(config-std-nacl)#", cmd: "interface GigabitEthernet0/2" },
            { prompt: "R1(config-if)#", cmd: "ip access-group TO-SERVERS out" },
          ],
          note: {
            en: "A name says what the ACL is for, which a number cannot. Both kinds behave the same once applied.",
            hi: "Naam batata hai ki ACL kis kaam ki hai, jo number nahi bata sakta. Apply hone ke baad dono same behave karti hain.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**In** is checked as the packet arrives, before the routing decision. **Out** is checked after the router has picked the exit interface, just before the packet leaves.",
              hi: "**In** tab check hota hai jab packet aata hai, routing decision se pehle. **Out** tab check hota hai jab router exit interface chun chuka hai, packet nikalne se theek pehle.",
            },
            {
              en: "One ACL per interface, **per direction, per protocol** (IPv4 and IPv6). Gi0/2 can have one IPv4 ACL in and one out. Applying a second `ip access-group` in the same direction replaces the first.",
              hi: "Har interface par, **har direction aur har protocol** (IPv4 aur IPv6) ke liye ek ACL. Gi0/2 par ek IPv4 ACL in aur ek out ho sakti hai. Same direction mein doosra `ip access-group` lagaya toh pehla replace ho jaata hai.",
            },
          ],
        },
      ],
    },
    {
      id: "placement",
      heading: { en: "Where to place a standard ACL", hi: "Standard ACL kahan lagayein" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A standard ACL cannot see the destination. If you deny 192.168.2.0/24, you deny it **everywhere** that ACL is applied. So place a standard ACL **as close to the destination as possible**, where only traffic heading to the protected network passes through it.",
            hi: "Standard ACL destination dekh hi nahi sakti. Tumne 192.168.2.0/24 deny kiya, toh jahan bhi woh ACL lagi hai wahan woh **har jagah ke liye** deny ho gaya. Isliye standard ACL ko **destination ke jitna paas ho sake** lagao, jahan se sirf protected network ki taraf jaane wala traffic guzarta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "ACL 1 in two places", hi: "ACL 1 do jagah par" },
          columns: [{ en: "Applied as", hi: "Kaise apply ki" }, { en: "LAN B to server", hi: "LAN B se server" }, { en: "LAN B to LAN A", hi: "LAN B se LAN A" }],
          rows: [
            ["Gi0/2 out (near destination)", { en: "Denied", hi: "Deny" }, { en: "Allowed, never checked", hi: "Allowed, check hi nahi hota" }],
            ["Gi0/1 in (near source)", { en: "Denied", hi: "Deny" }, { en: "Denied as well, by the implicit deny", hi: "Yeh bhi deny, implicit deny se" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Outbound ACLs see transit traffic only", hi: "Outbound ACL sirf transit traffic dekhti hai" },
          text: {
            en: "An outbound ACL on Gi0/2 does not filter packets that R1 itself creates, such as a ping you run from R1. Test an ACL from a host behind the router, not from the router.",
            hi: "Gi0/2 par lagi outbound ACL un packets ko filter nahi karti jo R1 khud banata hai, jaise R1 se chalaya gaya ping. ACL ko router se nahi, router ke peeche wale host se test karo.",
          },
        },
      ],
    },
    {
      id: "verify-and-edit",
      heading: { en: "Verify, count and edit", hi: "Verify, count aur edit" },
      blocks: [
        {
          type: "cli",
          title: { en: "Counters and where the ACL is applied", hi: "Counters aur ACL kahan lagi hai" },
          lines: [
            { prompt: "R1#", cmd: "show access-lists" },
            { out: "Standard IP access list 1" },
            { out: "    10 deny   192.168.1.20 (4 matches)", comment: { en: "PC2's four pings were dropped here", hi: "PC2 ke chaar pings yahan drop hue" } },
            { out: "    20 permit 192.168.1.0, wildcard bits 0.0.0.255 (8 matches)" },
            { prompt: "R1#", cmd: "show ip interface GigabitEthernet0/2" },
            { out: "GigabitEthernet0/2 is up, line protocol is up" },
            { out: "  Internet address is 10.1.1.1/24" },
            { out: "  Outgoing access list is 1", comment: { en: "Shortened output; check the direction here", hi: "Output chhota kiya hai; direction yahan check karo" } },
            { out: "  Inbound  access list is not set" },
          ],
          note: {
            en: "Packets dropped by the implicit deny are not counted. To count them, add an explicit last line such as `deny any` and watch its counter. `clear access-list counters` resets the numbers.",
            hi: "Implicit deny se drop hue packets count nahi hote. Unhe count karna hai toh end mein explicit line jaise `deny any` daalo aur uska counter dekho. `clear access-list counters` numbers reset kar deta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Every entry has a **sequence number**, 10, 20, 30 by default. Inside ACL configuration mode you can insert a line between two others or delete one line. This works for named ACLs and also for numbered ones opened with `ip access-list standard 1`.",
            hi: "Har entry ka ek **sequence number** hota hai, default mein 10, 20, 30. ACL configuration mode ke andar tum do lines ke beech nayi line daal sakte ho ya ek line delete kar sakte ho. Yeh named ACLs ke liye kaam karta hai, aur numbered ACLs ke liye bhi agar unhe `ip access-list standard 1` se kholo.",
          },
        },
        {
          type: "cli",
          title: { en: "Insert and remove single lines", hi: "Single lines insert aur remove karna" },
          lines: [
            { prompt: "R1(config)#", cmd: "ip access-list standard 1" },
            { prompt: "R1(config-std-nacl)#", cmd: "15 deny host 192.168.1.30", comment: { en: "Lands between 10 and 20", hi: "10 aur 20 ke beech aata hai" } },
            { prompt: "R1(config-std-nacl)#", cmd: "no 10", comment: { en: "Removes only line 10", hi: "Sirf line 10 hatata hai" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The no access-list trap", hi: "no access-list ka trap" },
          text: {
            en: "In global configuration, `no access-list 1 deny host 192.168.1.20` does not remove one line. It deletes **the whole of ACL 1**. Edit single lines with sequence numbers instead.",
            hi: "Global configuration mein `no access-list 1 deny host 192.168.1.20` ek line nahi hatata. Yeh **poori ACL 1** delete kar deta hai. Single lines sequence numbers se edit karo.",
          },
        },
      ],
    },
    {
      id: "vty-access-class",
      heading: { en: "Protecting the VTY lines with access-class", hi: "access-class se VTY lines protect karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In the SSH lesson you saw `access-class` on the VTY lines. Now you know what it uses: an ACL, normally a standard one, listing the sources allowed to open a Telnet or SSH session **to the device itself**. It works for every interface address at once, so you do not need an ACL on each interface.",
            hi: "SSH lesson mein tumne VTY lines par `access-class` dekha tha. Ab pata hai ki woh kya use karta hai: ek ACL, aam taur par standard, jo batati hai ki **device par khud** Telnet ya SSH session kaun se sources khol sakte hain. Yeh device ke har interface address par ek saath kaam karta hai, toh har interface par ACL lagane ki zaroorat nahi.",
          },
        },
        {
          type: "cli",
          title: { en: "Only the admin PC may log in to R1", hi: "R1 par sirf admin PC login kar sakta hai" },
          lines: [
            { prompt: "R1(config)#", cmd: "access-list 10 permit host 192.168.1.10" },
            { prompt: "R1(config)#", cmd: "line vty 0 4" },
            { prompt: "R1(config-line)#", cmd: "access-class 10 in", comment: { en: "access-class on lines, not access-group", hi: "Lines par access-class, access-group nahi" } },
          ],
          note: {
            en: "Apply it to every VTY line the device has. Many switches have `line vty 0 15`; a line you skip is a way in.",
            hi: "Device ki har VTY line par lagao. Kai switches par `line vty 0 15` hota hai; jo line chhoot gayi woh andar aane ka raasta hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "ACL", def: { en: "Access control list: an ordered list of permit and deny entries used to filter or identify packets.", hi: "Access control list: permit aur deny entries ki ordered list jo packets filter ya identify karne ke liye use hoti hai." } },
    { term: "ACE", def: { en: "Access control entry: one line of an ACL, with an action and a match condition.", hi: "Access control entry: ACL ki ek line, jisme ek action aur ek match condition hoti hai." } },
    { term: "Implicit deny", def: { en: "The invisible last rule of every ACL that drops anything no entry matched.", hi: "Har ACL ka invisible last rule jo woh sab drop karta hai jise kisi entry ne match nahi kiya." } },
    { term: "Wildcard mask", def: { en: "A 32-bit mask where 0 means the bit must match and 1 means the bit is ignored.", hi: "32-bit mask jisme 0 ka matlab bit match honi chahiye aur 1 ka matlab bit ignore hogi." } },
    { term: "Standard ACL", def: { en: "An IPv4 ACL that matches only the source address; numbered 1-99 and 1300-1999.", hi: "IPv4 ACL jo sirf source address match karti hai; numbers 1-99 aur 1300-1999." } },
    { term: "Named ACL", def: { en: "An ACL identified by a name and configured in its own mode, with editable sequence numbers.", hi: "Naam se pehchaani jaane wali ACL jo apne mode mein configure hoti hai, editable sequence numbers ke saath." } },
    { term: "Sequence number", def: { en: "The number in front of each ACE that sets its order and lets you insert or delete single lines.", hi: "Har ACE ke aage ka number jo uska order set karta hai aur single lines insert ya delete karne deta hai." } },
  ],
  commands: [
    { cmd: "access-list 1 permit 192.168.1.0 0.0.0.255", mode: "Global configuration", does: { en: "Add an entry to numbered standard ACL 1", hi: "Numbered standard ACL 1 mein entry add karta hai" } },
    { cmd: "access-list 1 remark TEXT", mode: "Global configuration", does: { en: "Add a comment line to ACL 1", hi: "ACL 1 mein comment line add karta hai" } },
    { cmd: "ip access-list standard TO-SERVERS", mode: "Global configuration", does: { en: "Create or edit a named standard ACL (also works with a number)", hi: "Named standard ACL banata ya edit karta hai (number ke saath bhi chalta hai)" } },
    { cmd: "15 deny host 192.168.1.30", mode: "Standard ACL configuration", does: { en: "Insert an entry with sequence number 15", hi: "Sequence number 15 ke saath entry insert karta hai" } },
    { cmd: "no 10", mode: "Standard ACL configuration", does: { en: "Delete only the entry with sequence number 10", hi: "Sirf sequence number 10 wali entry delete karta hai" } },
    { cmd: "ip access-group 1 out", mode: "Interface configuration", does: { en: "Apply ACL 1 to packets leaving this interface", hi: "Is interface se nikalne wale packets par ACL 1 lagata hai" } },
    { cmd: "access-class 10 in", mode: "Line configuration", does: { en: "Allow Telnet/SSH sessions to the device only from sources ACL 10 permits", hi: "Device par Telnet/SSH session sirf un sources se allow karta hai jinhe ACL 10 permit karti hai" } },
    { cmd: "show access-lists", mode: "Privileged EXEC", does: { en: "Show every ACL with sequence numbers and match counters", hi: "Har ACL ko sequence numbers aur match counters ke saath dikhata hai" } },
    { cmd: "show ip interface GigabitEthernet0/2", mode: "Privileged EXEC", does: { en: "Show which ACLs are applied in and out on the interface", hi: "Interface par in aur out kaunsi ACLs lagi hain, dikhata hai" } },
    { cmd: "clear access-list counters", mode: "Privileged EXEC", does: { en: "Reset the match counters to zero", hi: "Match counters ko zero kar deta hai" } },
  ],
  mistakes: [
    {
      en: "Putting a subnet entry above a host entry. `permit 192.168.1.0 0.0.0.255` above `deny host 192.168.1.20` permits .20, because the first match wins. Specific lines go first.",
      hi: "Subnet entry ko host entry ke upar rakhna. `permit 192.168.1.0 0.0.0.255` agar `deny host 192.168.1.20` ke upar hai toh .20 permit ho jaata hai, kyunki first match jeetta hai. Specific lines pehle aati hain.",
    },
    {
      en: "Writing an ACL with only deny lines and expecting everything else to pass. The implicit deny blocks the rest; add `permit any` at the end if that is what you want.",
      hi: "Sirf deny lines wali ACL likh kar sochna ki baaki sab pass hoga. Baaki sab implicit deny block kar deta hai; agar yahi chahiye toh end mein `permit any` daalo.",
    },
    {
      en: "Using a subnet mask where a wildcard is needed. `192.168.1.0 255.255.255.0` in an ACE matches addresses ending in .0 from any network, not the /24. The /24 is `192.168.1.0 0.0.0.255`.",
      hi: "Wildcard ki jagah subnet mask likh dena. ACE mein `192.168.1.0 255.255.255.0` kisi bhi network ke .0 par khatam hone wale addresses match karta hai, /24 nahi. /24 ke liye `192.168.1.0 0.0.0.255` likho.",
    },
    {
      en: "Placing a standard ACL near the source. It then blocks that source from every destination, not just the one you meant to protect.",
      hi: "Standard ACL ko source ke paas lagana. Tab woh us source ko har destination ke liye block kar deti hai, sirf us ek ke liye nahi jise protect karna tha.",
    },
    {
      en: "Typing `no access-list 1 deny host 192.168.1.20` to remove one line. It deletes all of ACL 1. Use `ip access-list standard 1` and `no 10`.",
      hi: "Ek line hatane ke liye `no access-list 1 deny host 192.168.1.20` type karna. Isse poori ACL 1 delete ho jaati hai. `ip access-list standard 1` aur `no 10` use karo.",
    },
    {
      en: "Using `ip access-group` under `line vty`. On VTY lines the command is `access-class`.",
      hi: "`line vty` ke neeche `ip access-group` use karna. VTY lines par command `access-class` hai.",
    },
  ],
  recap: [
    { en: "ACLs are checked top-down; the first matching entry decides; anything unmatched hits the implicit deny.", hi: "ACL upar se neeche check hoti hai; pehli matching entry decide karti hai; jo match nahi hua woh implicit deny se takrata hai." },
    { en: "Wildcard 0 = must match, 1 = ignore. Wildcard = 255.255.255.255 minus the subnet mask. host = 0.0.0.0, any = 255.255.255.255.", hi: "Wildcard mein 0 ka matlab match zaroori hai, 1 ka matlab ignore. Wildcard = 255.255.255.255 minus subnet mask. host yaani 0.0.0.0, any yaani 255.255.255.255." },
    { en: "Standard ACLs match source only: numbered 1-99 and 1300-1999, or named with `ip access-list standard`.", hi: "Standard ACL sirf source match karti hai: numbers 1-99 aur 1300-1999, ya `ip access-list standard` se named." },
    { en: "Apply with `ip access-group N in|out`: one ACL per interface, per direction, per protocol. Place standard ACLs close to the destination.", hi: "`ip access-group N in|out` se apply karo: har interface, har direction, har protocol par ek ACL. Standard ACL destination ke paas lagao." },
    { en: "`show access-lists` shows match counters; the implicit deny is not counted. Edit with sequence numbers.", hi: "`show access-lists` match counters dikhata hai; implicit deny count nahi hota. Sequence numbers se edit karo." },
    { en: "`access-class N in` under `line vty` limits who can Telnet or SSH to the device.", hi: "`line vty` ke neeche `access-class N in` limit karta hai ki device par Telnet ya SSH kaun kar sakta hai." },
  ],
  quiz: [
    {
      q: {
        en: "You need an ACE that matches every address in 172.16.8.32/27. Which wildcard mask goes with 172.16.8.32?",
        hi: "Tumhe aisi ACE chahiye jo 172.16.8.32/27 ke har address ko match kare. 172.16.8.32 ke saath kaunsa wildcard mask aayega?",
      },
      options: [
        { en: "255.255.255.224", hi: "255.255.255.224" },
        { en: "0.0.0.63", hi: "0.0.0.63" },
        { en: "0.0.0.31", hi: "0.0.0.31" },
        { en: "0.0.0.32", hi: "0.0.0.32" },
      ],
      answer: 2,
      explain: {
        en: "A /27 mask is 255.255.255.224. 255 minus 224 is 31, so the wildcard is 0.0.0.31, covering .32 to .63. 255.255.255.224 is the subnet mask, which an ACE would misread, and 0.0.0.63 would cover a /26.",
        hi: "/27 ka mask 255.255.255.224 hai. 255 minus 224 = 31, toh wildcard 0.0.0.31 hai, jo .32 se .63 tak cover karta hai. 255.255.255.224 subnet mask hai, jise ACE galat samjhegi, aur 0.0.0.63 ek /26 cover karega.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "ACL 5 has one line, `access-list 5 permit 10.1.1.0 0.0.0.255`, and is applied out on the server interface. What happens to a packet from 10.1.2.5 heading to the server?",
        hi: "ACL 5 mein ek hi line hai, `access-list 5 permit 10.1.1.0 0.0.0.255`, aur yeh server interface par out lagi hai. 10.1.2.5 se server ki taraf jaane wale packet ka kya hoga?",
      },
      options: [
        { en: "It is dropped by the implicit deny", hi: "Implicit deny se drop hoga" },
        { en: "It is permitted, because no line denies it", hi: "Permit hoga, kyunki koi line use deny nahi karti" },
        { en: "It is permitted, because the third octet is ignored", hi: "Permit hoga, kyunki third octet ignore hota hai" },
        { en: "The router sends it out another interface", hi: "Router use kisi doosre interface se bhej dega" },
      ],
      answer: 0,
      explain: {
        en: "The wildcard 0.0.0.255 requires the first three octets to be 10.1.1, so 10.1.2.5 does not match. With no matching line, the implicit deny drops it. An ACL never \"permits by default\".",
        hi: "Wildcard 0.0.0.255 ke hisaab se pehle teen octets 10.1.1 hone chahiye, toh 10.1.2.5 match nahi karta. Koi line match nahi hui, toh implicit deny use drop kar deta hai. ACL kabhi \"by default permit\" nahi karti.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A named ACL has `10 permit 192.168.1.0 0.0.0.255` and then `20 deny host 192.168.1.20`. What happens to traffic from 192.168.1.20?",
        hi: "Ek named ACL mein `10 permit 192.168.1.0 0.0.0.255` aur uske baad `20 deny host 192.168.1.20` hai. 192.168.1.20 ke traffic ka kya hoga?",
      },
      options: [
        { en: "Denied, because the more specific line always wins", hi: "Deny, kyunki zyada specific line hamesha jeetti hai" },
        { en: "Denied by the implicit deny", hi: "Implicit deny se deny" },
        { en: "Permitted for the first packet, denied after that", hi: "Pehla packet permit, uske baad deny" },
        { en: "Permitted by line 10; line 20 is never reached", hi: "Line 10 se permit; line 20 tak pahunchta hi nahi" },
      ],
      answer: 3,
      explain: {
        en: "IOS does not look for the most specific match. It stops at the first match, and 192.168.1.20 is inside 192.168.1.0/24. Fix it by inserting `5 deny host 192.168.1.20` above line 10.",
        hi: "IOS sabse specific match nahi dhoondhta. Woh pehle match par ruk jaata hai, aur 192.168.1.20, 192.168.1.0/24 ke andar hai. Fix: line 10 ke upar `5 deny host 192.168.1.20` insert karo.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1 connects LAN A (Gi0/0), LAN B (Gi0/1) and the server LAN (Gi0/2). LAN B must not reach the server LAN but must still reach LAN A. Where do you apply a standard ACL that denies 192.168.2.0/24 and permits any?",
        hi: "R1 se LAN A (Gi0/0), LAN B (Gi0/1) aur server LAN (Gi0/2) jude hain. LAN B ko server LAN tak nahi pahunchna chahiye lekin LAN A tak pahunchna chahiye. 192.168.2.0/24 deny aur any permit karne wali standard ACL kahan lagaoge?",
      },
      options: [
        { en: "Gi0/1 in", hi: "Gi0/1 in" },
        { en: "Gi0/2 out", hi: "Gi0/2 out" },
        { en: "Gi0/0 out", hi: "Gi0/0 out" },
        { en: "Gi0/2 in", hi: "Gi0/2 in" },
      ],
      answer: 1,
      explain: {
        en: "Close to the destination: out on Gi0/2, so only traffic leaving toward the servers is checked. On Gi0/1 in it would also cut LAN B off from LAN A. Gi0/0 out filters traffic to LAN A, and Gi0/2 in sees packets coming from the servers.",
        hi: "Destination ke paas: Gi0/2 par out, taaki sirf servers ki taraf nikalne wala traffic check ho. Gi0/1 in par lagao toh LAN B, LAN A se bhi kat jaayega. Gi0/0 out LAN A ki taraf ka traffic filter karta hai, aur Gi0/2 in servers se aane wale packets dekhta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`show access-lists` shows `10 deny 192.168.1.20 (4 matches)` and `20 permit 192.168.1.0, wildcard bits 0.0.0.255 (8 matches)`. Host 192.168.2.10 then sends 5 packets that this ACL drops. What does the output show next time?",
        hi: "`show access-lists` mein `10 deny 192.168.1.20 (4 matches)` aur `20 permit 192.168.1.0, wildcard bits 0.0.0.255 (8 matches)` dikhta hai. Phir host 192.168.2.10 paanch packets bhejta hai jo yeh ACL drop kar deti hai. Agli baar output mein kya dikhega?",
      },
      options: [
        { en: "Line 10 shows 9 matches", hi: "Line 10 par 9 matches" },
        { en: "Line 20 shows 13 matches", hi: "Line 20 par 13 matches" },
        { en: "Both counters unchanged; the implicit deny is not counted", hi: "Dono counters same; implicit deny count nahi hota" },
        { en: "A new line `30 deny any (5 matches)` appears", hi: "Nayi line `30 deny any (5 matches)` dikhegi" },
      ],
      answer: 2,
      explain: {
        en: "192.168.2.10 matches neither line, so the invisible implicit deny drops it, and that rule has no counter. To see these drops, configure an explicit `deny any` as the last line.",
        hi: "192.168.2.10 kisi line se match nahi karta, toh invisible implicit deny use drop karta hai, aur us rule ka koi counter nahi hota. Yeh drops dekhne hain toh last line ke roop mein explicit `deny any` configure karo.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "You want only 192.168.1.10 to be able to SSH to R1, whichever R1 address it connects to. ACL 10 permits host 192.168.1.10. What completes the job?",
        hi: "Tum chahte ho ki R1 par sirf 192.168.1.10 SSH kar sake, chahe woh R1 ke kisi bhi address par connect kare. ACL 10 host 192.168.1.10 ko permit karti hai. Kaam poora kaise hoga?",
      },
      options: [
        { en: "`ip access-group 10 in` on every R1 interface", hi: "R1 ke har interface par `ip access-group 10 in`" },
        { en: "`access-class 10 in` under `line vty 0 4`", hi: "`line vty 0 4` ke neeche `access-class 10 in`" },
        { en: "`ip access-group 10 in` under `line vty 0 4`", hi: "`line vty 0 4` ke neeche `ip access-group 10 in`" },
        { en: "`access-class 10 out` under `line console 0`", hi: "`line console 0` ke neeche `access-class 10 out`" },
      ],
      answer: 1,
      explain: {
        en: "`access-class` on the VTY lines filters sessions to the device itself, on every interface address at once. Interface ACLs with ACL 10 would also drop all other traffic from other hosts through R1, and `ip access-group` is not a line command.",
        hi: "VTY lines par `access-class` device par aane wale sessions filter karta hai, har interface address par ek saath. ACL 10 ko interfaces par lagaoge toh doosre hosts ka R1 se guzarne wala baaki traffic bhi drop hoga, aur `ip access-group` line command hai hi nahi.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "z023_eRUtSo",
      title: "Free CCNA | Standard ACLs | Day 34",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "ACL logic, wildcards, numbered and named standard ACLs, and placement.", hi: "ACL logic, wildcards, numbered aur named standard ACLs, aur placement." },
    },
    {
      id: "sJ8PXmiAkvs",
      title: "Free CCNA | Standard ACLs | Day 34 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Packet Tracer lab to configure and test standard ACLs.", hi: "Standard ACLs configure aur test karne ka Packet Tracer lab." },
    },
    {
      id: "6inV3arqFNg",
      title: "129. Free CCNA (NEW) | Network Security - Standard ACL - 1",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of standard ACL basics and wildcard masks.", hi: "Standard ACL basics aur wildcard masks ka Hindi explanation." },
    },
    {
      id: "-Hxv2GobgQY",
      title: "130. Free CCNA (NEW) | Network Security - Standard ACL - 2",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Part 2: configuring and applying standard ACLs.", hi: "Part 2: standard ACLs configure aur apply karna." },
    },
  ],
  lab: {
    title: { en: "Protect a server LAN with a standard ACL", hi: "Standard ACL se server LAN protect karo" },
    steps: [
      { en: "In Packet Tracer, give one router three LANs: 192.168.1.0/24 (two PCs, .10 and .20, via a switch), 192.168.2.0/24 (one PC, .10) and 10.1.1.0/24 (a server at .100). Confirm every PC can ping the server.", hi: "Packet Tracer mein ek router ko teen LANs do: 192.168.1.0/24 (switch ke through do PCs, .10 aur .20), 192.168.2.0/24 (ek PC, .10) aur 10.1.1.0/24 (.100 par server). Confirm karo ki har PC server ko ping kar sakta hai." },
      { en: "Create `ip access-list standard TO-SERVERS` with `deny host 192.168.1.20` and `permit 192.168.1.0 0.0.0.255`, and apply it out on the server-facing interface.", hi: "`ip access-list standard TO-SERVERS` banao, usme `deny host 192.168.1.20` aur `permit 192.168.1.0 0.0.0.255` daalo, aur server wale interface par out apply karo." },
      { en: "Ping the server from all three PCs. Predict each result first, then run `show access-lists` and match each counter to a ping.", hi: "Teeno PCs se server ko ping karo. Pehle har result predict karo, phir `show access-lists` chala kar har counter ko ek ping se match karo." },
      { en: "Ping 192.168.1.10 from 192.168.2.10. It should still work; explain why.", hi: "192.168.2.10 se 192.168.1.10 ping karo. Yeh ab bhi chalna chahiye; samjhao kyun." },
      { en: "Move the ACL to the LAN B interface inbound and repeat step 4. Then put it back and add `30 deny any` as the last line to count the drops.", hi: "ACL ko LAN B interface par inbound shift karo aur step 4 dobara karo. Phir wapas lagao aur drops count karne ke liye last line ke roop mein `30 deny any` add karo." },
      { en: "Create `access-list 10 permit host 192.168.1.10`, apply `access-class 10 in` on the VTY lines, and try Telnet or SSH to the router from two different PCs.", hi: "`access-list 10 permit host 192.168.1.10` banao, VTY lines par `access-class 10 in` lagao, aur do alag PCs se router par Telnet ya SSH try karo." },
    ],
  },
};

export default lesson;
