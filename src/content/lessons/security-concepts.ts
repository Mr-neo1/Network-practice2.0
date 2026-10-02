import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "security-concepts",
  intro: {
    en: "Everything you have built so far, from switching and ARP to routing and NAT, was designed to work, not to resist someone who wants it to fail. Attackers use exactly those mechanisms: a TCP handshake becomes a flood, an ARP reply becomes a trap, a friendly email becomes a stolen password. Before you can configure defences, you need the vocabulary and a clear picture of what each common attack actually does on the wire.",
    hi: "Ab tak jo kuch tumne seekha, switching aur ARP se lekar routing aur NAT tak, sab kaam karne ke liye bana tha, kisi aise insaan ko rokne ke liye nahi jo use todna chahta hai. Attackers yahi mechanisms use karte hain: TCP handshake flood ban jaata hai, ARP reply jaal ban jaata hai, ek friendly email chori ka password ban jaata hai. Defences configure karne se pehle tumhe vocabulary chahiye, aur saaf picture ki har common attack wire par asal mein karta kya hai.",
  },
  outcomes: [
    { en: "Explain confidentiality, integrity and availability with a network example of each", hi: "Confidentiality, integrity aur availability ko har ek ke network example ke saath samjha sako" },
    { en: "Tell a vulnerability, an exploit, a threat and a mitigation apart", hi: "Vulnerability, exploit, threat aur mitigation mein fark bata sako" },
    { en: "Describe how a TCP SYN flood, spoofing, reflection and amplification, and ARP man-in-the-middle attacks work", hi: "Describe kar sako ki TCP SYN flood, spoofing, reflection aur amplification, aur ARP man-in-the-middle attacks kaise kaam karte hain" },
    { en: "Classify malware, social engineering and password attacks by name", hi: "Malware, social engineering aur password attacks ko naam se classify kar sako" },
    { en: "Name the security program elements the CCNA expects: user awareness, user training and physical access control", hi: "CCNA jo security program elements expect karta hai unke naam bata sako: user awareness, user training aur physical access control" },
  ],
  sections: [
    {
      id: "cia-triad",
      heading: { en: "What you are protecting: the CIA triad", hi: "Tum kya protect kar rahe ho: CIA triad" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Security people describe every goal and every attack with three words. When you read about an attack, ask which of the three it breaks. That tells you what the attacker gains and which defence fits.",
            hi: "Security wale har goal aur har attack ko teen words se describe karte hain. Jab bhi kisi attack ke baare mein padho, poocho ki yeh teeno mein se kise todta hai. Isse pata chalta hai ki attacker ko kya milta hai aur kaunsa defence fit hoga.",
          },
        },
        {
          type: "table",
          caption: { en: "The CIA triad, using the company network in the animation", hi: "CIA triad, animation wale company network ke saath" },
          columns: ["", { en: "Means", hi: "Matlab" }, { en: "Broken when", hi: "Kab tootta hai" }],
          rows: [
            [
              "**Confidentiality**",
              { en: "Only authorised people can read the data", hi: "Data sirf authorised log padh sakein" },
              { en: "An attacker on the LAN reads the password PC1 sends to FW1 in a Telnet session", hi: "LAN par baitha attacker woh password padh le jo PC1 Telnet session mein FW1 ko bhejta hai" },
            ],
            [
              "**Integrity**",
              { en: "Data is not changed by unauthorised people, in transit or at rest", hi: "Data ko unauthorised log na badal sakein, na raaste mein na stored" },
              { en: "A man in the middle changes the bank account number in a payment", hi: "Man in the middle payment mein bank account number badal de" },
            ],
            [
              "**Availability**",
              { en: "The service works when legitimate users need it", hi: "Jab genuine users ko chahiye, service chalti rahe" },
              { en: "A flood of SYNs stops customers reaching 203.0.113.10", hi: "SYNs ka flood customers ko 203.0.113.10 tak pahunchne na de" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Encryption is not the whole answer", hi: "Encryption poora jawab nahi hai" },
          text: {
            en: "Encryption protects confidentiality, and with integrity checks it also protects integrity. It does nothing for availability: an encrypted service can still be flooded off the internet.",
            hi: "Encryption confidentiality protect karta hai, aur integrity checks ke saath integrity bhi. Availability ke liye yeh kuch nahi karta: encrypted service ko bhi flood karke internet se gayab kiya ja sakta hai.",
          },
        },
      ],
    },
    {
      id: "security-terms",
      heading: { en: "Vulnerability, exploit, threat, mitigation", hi: "Vulnerability, exploit, threat, mitigation" },
      blocks: [
        {
          type: "p",
          text: {
            en: "These four words are easy to mix up, and the exam uses them precisely. Follow one example through all four: the company web server at 203.0.113.10 runs an old software version with a known bug.",
            hi: "Yeh chaar words aasani se mix ho jaate hain, aur exam inhe bilkul exact meaning mein use karta hai. Ek hi example chaaron mein follow karo: company ka web server 203.0.113.10 ek purana software version chala raha hai jisme ek known bug hai.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Term", hi: "Term" }, { en: "Definition", hi: "Definition" }, { en: "In the example", hi: "Example mein" }],
          rows: [
            [
              "**Vulnerability**",
              { en: "Any weakness that could compromise confidentiality, integrity or availability", hi: "Koi bhi weakness jo confidentiality, integrity ya availability ko compromise kar sake" },
              { en: "The unpatched bug in the web server software", hi: "Web server software ka unpatched bug" },
            ],
            [
              "**Exploit**",
              { en: "Something that can be used to take advantage of a vulnerability", hi: "Koi cheez jisse vulnerability ka fayda uthaya ja sake" },
              { en: "A published script that sends a crafted request to trigger the bug", hi: "Ek published script jo bug trigger karne ke liye khaas request bhejti hai" },
            ],
            [
              "**Threat**",
              { en: "The potential for a vulnerability to be exploited; the person doing it is a threat actor", hi: "Vulnerability exploit hone ki possibility; jo insaan yeh karta hai woh threat actor hai" },
              { en: "An attacker scanning the internet and running that script against 203.0.113.10", hi: "Ek attacker jo internet scan karke woh script 203.0.113.10 par chalata hai" },
            ],
            [
              "**Mitigation**",
              { en: "Anything that protects against a threat", hi: "Koi bhi cheez jo threat se bachaye" },
              { en: "Patching the server, or an IPS that blocks the crafted request", hi: "Server patch karna, ya ek IPS jo woh khaas request block kare" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "A vulnerability exists even if nobody attacks it. An exploit is the tool or technique. A threat needs both: a vulnerability and someone or something that could exploit it. You cannot remove every threat actor, so mitigation works on the vulnerability (patch it) or the path (filter it).",
            hi: "Vulnerability tab bhi exist karti hai jab koi attack na kare. Exploit tool ya technique hai. Threat ko dono chahiye: ek vulnerability aur koi jo use exploit kar sake. Har threat actor ko tum hata nahi sakte, isliye mitigation ya toh vulnerability par kaam karta hai (patch karo) ya raaste par (filter karo).",
          },
        },
      ],
    },
    {
      id: "dos-spoofing-reflection",
      heading: { en: "Floods, spoofing and reflection", hi: "Floods, spoofing aur reflection" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **denial-of-service (DoS)** attack targets availability: it uses up a resource so legitimate users cannot be served. When the traffic comes from many machines at once, usually a **botnet** of infected computers, it is a **distributed DoS (DDoS)**. Blocking one source address does nothing, because there are thousands.",
            hi: "**Denial-of-service (DoS)** attack availability ko target karta hai: koi resource khatam kar deta hai taaki genuine users ko service na mile. Jab traffic ek saath bahut saari machines se aaye, aam taur par infected computers ka **botnet**, toh yeh **distributed DoS (DDoS)** hai. Ek source address block karne se kuch nahi hota, kyunki aise hazaaron hain.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**TCP SYN flood.** You know the three-way handshake from lesson 1.7. Each bot sends a SYN to 203.0.113.10 port 443, usually with a fake source IP.",
              hi: "**TCP SYN flood.** Three-way handshake tum lesson 1.7 se jaante ho. Har bot 203.0.113.10 ke port 443 par SYN bhejta hai, aam taur par fake source IP ke saath.",
            },
            {
              en: "The server replies with a SYN-ACK and keeps a half-open connection in memory, waiting for the final ACK.",
              hi: "Server SYN-ACK bhejta hai aur ek half-open connection memory mein rakhta hai, final ACK ka wait karte hue.",
            },
            {
              en: "The ACK never comes: the SYN-ACK went to a spoofed address that never asked. The half-open entry sits there until it times out.",
              hi: "ACK kabhi nahi aata: SYN-ACK ek spoofed address par gaya jisne kuch maanga hi nahi tha. Half-open entry timeout tak wahin padi rehti hai.",
            },
            {
              en: "New SYNs arrive faster than old entries time out. The table fills, and real customers' SYNs are dropped. Availability is gone, although no data was stolen.",
              hi: "Purani entries timeout hone se pehle hi naye SYNs aate rehte hain. Table bhar jaati hai, aur asli customers ke SYNs drop ho jaate hain. Availability khatam, jabki koi data chori nahi hua.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "**Spoofing** means faking an address so a packet looks like it came from somewhere else: a fake source IP, a fake source MAC, or both. It is rarely the goal on its own; it hides the attacker and makes other attacks work. Example: in **DHCP exhaustion**, an attacker sends thousands of DHCP Discovers, each with a different spoofed MAC, until the server's pool is empty (DHCP snooping stops it, lesson 5.7).",
            hi: "**Spoofing** ka matlab hai address fake karna taaki packet kahin aur se aaya lage: fake source IP, fake source MAC, ya dono. Yeh aksar khud mein goal nahi hota; yeh attacker ko chhupata hai aur doosre attacks ko kaam karne deta hai. Example: **DHCP exhaustion** mein attacker hazaaron DHCP Discovers bhejta hai, har ek alag spoofed MAC ke saath, jab tak server ka pool khaali na ho jaaye (DHCP snooping ise rokta hai, lesson 5.7).",
          },
        },
        {
          type: "p",
          text: {
            en: "**Reflection** turns spoofing into a weapon. The attacker sends requests to a third-party server, with the **victim's IP as the source**. The server answers the source, so the replies hit the victim. It becomes **amplification** when each reply is much bigger than the request: a DNS query of about 60 bytes to an open resolver can return a reply of 3,000 bytes or more, so the attacker's bandwidth is multiplied about fifty times.",
            hi: "**Reflection** spoofing ko hathiyar bana deta hai. Attacker kisi third-party server ko requests bhejta hai, **victim ka IP source** bana kar. Server source ko jawab deta hai, toh replies victim par girte hain. Jab har reply request se kaafi bada ho, toh yeh **amplification** ban jaata hai: open resolver ko lagbhag 60 bytes ki DNS query 3,000 bytes ya usse bada reply la sakti hai, yaani attacker ki bandwidth lagbhag pachaas guna ho jaati hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The same idea, three different tricks", hi: "Ek hi idea, teen alag tricks" },
          columns: [{ en: "Attack", hi: "Attack" }, { en: "What is faked or abused", hi: "Kya fake ya misuse hota hai" }, { en: "Typical mitigation", hi: "Typical mitigation" }],
          rows: [
            [
              "TCP SYN flood",
              { en: "The half-open connection table on the server", hi: "Server ki half-open connection table" },
              { en: "Firewall limits half-open connections or uses SYN cookies; upstream DDoS filtering for large floods", hi: "Firewall half-open connections limit karta hai ya SYN cookies use karta hai; bade floods ke liye upstream DDoS filtering" },
            ],
            [
              { en: "Spoofed source IP", hi: "Spoofed source IP" },
              { en: "The source field of the IP header", hi: "IP header ka source field" },
              { en: "Inbound ACL on the internet edge drops packets with inside or private source addresses", hi: "Internet edge par inbound ACL jo inside ya private source address wale packets drop kare" },
            ],
            [
              { en: "Reflection and amplification", hi: "Reflection aur amplification" },
              { en: "Open servers (DNS, NTP) that answer anyone", hi: "Open servers (DNS, NTP) jo kisi ko bhi jawab dete hain" },
              { en: "Filtering by the ISP or a DDoS service; do not run open resolvers yourself", hi: "ISP ya DDoS service ki filtering; khud open resolver mat chalao" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Your own firewall cannot fix a full pipe", hi: "Bhara hua pipe tumhara firewall nahi khol sakta" },
          text: {
            en: "If a DDoS sends 10 Gbps at a company with a 1 Gbps internet link, the link is full before traffic even reaches FW1. Large floods must be filtered upstream, by the ISP or a scrubbing service.",
            hi: "Agar DDoS 1 Gbps internet link wali company par 10 Gbps bheje, toh traffic FW1 tak pahunchne se pehle hi link bhar jaata hai. Bade floods ko upstream filter karna padta hai, ISP ya scrubbing service ke paas.",
          },
        },
      ],
    },
    {
      id: "mitm-recon-malware",
      heading: { en: "Man in the middle, reconnaissance and malware", hi: "Man in the middle, reconnaissance aur malware" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In a **man-in-the-middle (MITM)** attack, the attacker places itself between two devices so their traffic flows through it. It can read the traffic (confidentiality) and change it (integrity). On a LAN the classic method is **ARP spoofing**, which works because ARP has no authentication (lesson 1.2).",
            hi: "**Man-in-the-middle (MITM)** attack mein attacker khud ko do devices ke beech mein rakh leta hai taaki unka traffic usse hokar jaaye. Woh traffic padh sakta hai (confidentiality) aur badal bhi sakta hai (integrity). LAN par iska classic tarika **ARP spoofing** hai, jo isliye chalta hai kyunki ARP mein koi authentication nahi hai (lesson 1.2).",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "The rogue PC at 10.10.10.66 sends ARP replies to PC1 saying \"10.10.10.1 is at 0050.56bb.0066\". PC1 overwrites the gateway's real MAC, 0011.2233.0001, in its cache.",
              hi: "10.10.10.66 wala rogue PC, PC1 ko ARP replies bhejta hai: \"10.10.10.1 is at 0050.56bb.0066\". PC1 apne cache mein gateway ka asli MAC, 0011.2233.0001, overwrite kar deta hai.",
            },
            {
              en: "It does the same to FW1 for PC1's address, so both directions now go to the rogue PC.",
              hi: "Yahi kaam woh FW1 ke saath PC1 ke address ke liye karta hai, toh dono directions ka traffic ab rogue PC par aata hai.",
            },
            {
              en: "The rogue PC forwards everything on, so nothing looks broken. Clear-text protocols such as Telnet and HTTP are fully exposed. Encrypted ones such as SSH and HTTPS still hide their content, but the attacker sees who talks to whom and can drop the traffic. **Dynamic ARP Inspection** on the switch stops the poisoning itself (lesson 5.8).",
              hi: "Rogue PC sab kuch aage forward karta rehta hai, isliye kuch toota hua nahi lagta. Telnet aur HTTP jaise clear-text protocols poori tarah khul jaate hain. SSH aur HTTPS jaise encrypted protocols ka content phir bhi chhupa rehta hai, lekin attacker dekh sakta hai ki kaun kisse baat kar raha hai, aur traffic drop bhi kar sakta hai. Switch par **Dynamic ARP Inspection** poisoning ko hi rok deta hai (lesson 5.8).",
            },
            {
              en: "A second LAN method is a **rogue DHCP server**: it answers Discovers faster than the real server and hands out its own address as the default gateway, so clients send their off-subnet traffic through it. **DHCP snooping** stops it (lesson 5.7).",
              hi: "LAN par doosra tarika hai **rogue DHCP server**: woh asli server se pehle Discovers ka jawab deta hai aur default gateway ke roop mein apna address de deta hai, toh clients apna doosre subnet wala traffic usi se hokar bhejte hain. **DHCP snooping** ise rokta hai (lesson 5.7).",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "**Reconnaissance** is information gathering before an attack. It uses public sources such as `nslookup` and `whois` records, the company website and staff profiles, and active scans that find which hosts are up and which ports are open. It is not an attack by itself, but it tells the attacker where to aim.",
            hi: "**Reconnaissance** attack se pehle information ikattha karna hai. Isme public sources use hote hain jaise `nslookup` aur `whois` records, company website aur staff profiles, aur active scans jo dhoondhte hain ki kaunse hosts up hain aur kaunse ports open. Yeh khud attack nahi hai, lekin attacker ko batata hai ki nishana kahan lagana hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Malware: malicious software, by how it spreads or what it does", hi: "Malware: malicious software, kaise failta hai ya kya karta hai uske hisaab se" },
          columns: [{ en: "Type", hi: "Type" }, { en: "How it works", hi: "Kaise kaam karta hai" }],
          rows: [
            ["**Virus**", { en: "Infects other software or files. Spreads when a user runs or shares the infected file.", hi: "Doosre software ya files ko infect karta hai. Tab failta hai jab user infected file chalata ya share karta hai." }],
            ["**Worm**", { en: "Standalone program that spreads by itself across the network, often through a vulnerability. No user action needed, so it can fill links with traffic quickly.", hi: "Standalone program jo network par khud fail jaata hai, aksar kisi vulnerability ke through. User action ki zaroorat nahi, isliye links ko jaldi traffic se bhar sakta hai." }],
            ["**Trojan horse**", { en: "Disguised as legitimate software. The user installs it willingly, and it runs its hidden code.", hi: "Legitimate software ka bhes. User khud use install karta hai, aur woh apna chhupa code chalata hai." }],
            ["**Ransomware**", { en: "Encrypts the victim's files and demands payment for the key. It arrives through any of the methods above or a phishing email.", hi: "Victim ki files encrypt karke key ke badle paise maangta hai. Upar ke kisi bhi tarike se ya phishing email se aata hai." }],
          ],
        },
      ],
    },
    {
      id: "people-and-passwords",
      heading: { en: "Social engineering and password attacks", hi: "Social engineering aur password attacks" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Social engineering** attacks the people, not the devices. A firewall allows the phishing email because it looks like normal mail, and it allows the stolen password because it looks like a normal login. Learn the names; the exam asks for them.",
            hi: "**Social engineering** devices ko nahi, logon ko target karta hai. Firewall phishing email ko allow karta hai kyunki woh normal mail jaisa dikhta hai, aur chori ke password ko bhi kyunki woh normal login jaisa dikhta hai. Naam yaad karo; exam inhe poochta hai.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Attack", hi: "Attack" }, { en: "What it looks like", hi: "Kaisa dikhta hai" }],
          rows: [
            ["**Phishing**", { en: "Mass emails that look legitimate (\"Your mailbox is full, sign in here\") and lead to a fake login page", hi: "Legitimate dikhne wale mass emails (\"Your mailbox is full, sign in here\") jo fake login page par le jaate hain" }],
            ["**Spear phishing**", { en: "Phishing aimed at one group, such as the finance team, using details from reconnaissance", hi: "Ek group par nishana, jaise finance team, reconnaissance ki details use karke" }],
            ["**Whaling**", { en: "Spear phishing aimed at senior executives such as the CEO or CFO", hi: "Senior executives, jaise CEO ya CFO, par nishana lagaya gaya spear phishing" }],
            ["**Vishing**", { en: "Voice phishing: a phone call pretending to be IT support or the bank", hi: "Voice phishing: IT support ya bank bankar phone call" }],
            ["**Smishing**", { en: "SMS phishing: a text message with a malicious link", hi: "SMS phishing: malicious link wala text message" }],
            ["**Watering hole**", { en: "The attacker compromises a website the target group visits often, and waits for them to come", hi: "Attacker woh website compromise karta hai jahan target group aksar jaata hai, aur unke aane ka wait karta hai" }],
            ["**Tailgating**", { en: "Following an authorised person through a secured door without using a badge", hi: "Badge use kiye bina kisi authorised insaan ke peeche secured door se andar ghus jaana" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "**Password attacks** guess until something works. **Guessing** tries likely values such as `admin` or the company name. A **dictionary attack** runs through a list of common words and leaked passwords. A **brute-force attack** tries every possible combination. Length beats everything here: eight lowercase letters give 26^8, about 2 × 10^11 combinations; twelve give 26^12, about 9.5 × 10^16, which is 26^4, about 457,000 times more work.",
            hi: "**Password attacks** tab tak guess karte hain jab tak kuch chal na jaaye. **Guessing** `admin` ya company ke naam jaisi likely values try karta hai. **Dictionary attack** common words aur leaked passwords ki list chalata hai. **Brute-force attack** har possible combination try karta hai. Yahan length sabse badi cheez hai: aath lowercase letters se 26^8, lagbhag 2 × 10^11 combinations bante hain; baarah se 26^12, lagbhag 9.5 × 10^16, yaani 26^4, lagbhag 457,000 guna zyada kaam.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Match the channel to the name: email = phishing, targeted email = spear phishing, executives = whaling, voice = vishing, SMS = smishing, a trusted website = watering hole, a door = tailgating.",
            hi: "Channel se naam match karo: email = phishing, targeted email = spear phishing, executives = whaling, voice = vishing, SMS = smishing, bharose wali website = watering hole, darwaza = tailgating.",
          },
        },
      ],
    },
    {
      id: "security-program",
      heading: { en: "The security program: people and doors", hi: "Security program: log aur darwaze" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **security program** is the company-wide plan that keeps all of this under control. Technical controls are one part. The CCNA names three other elements, because the best ACL in the world does not stop an employee typing a password into a fake page.",
            hi: "**Security program** company-wide plan hai jo yeh sab control mein rakhta hai. Technical controls uska ek hissa hain. CCNA teen aur elements ka naam leta hai, kyunki duniya ka sabse achha ACL bhi kisi employee ko fake page par password type karne se nahi rokta.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**User awareness**: keeping security in front of every employee, for example posters, short reminders and fake phishing emails that the security team sends to its own staff. Anyone who clicks sees a short page explaining what they missed.",
              hi: "**User awareness**: har employee ke saamne security ko bana ke rakhna, jaise posters, chhote reminders aur fake phishing emails jo security team apne hi staff ko bhejti hai. Jo click kare use ek chhota page dikhta hai jo batata hai ki usne kya miss kiya.",
            },
            {
              en: "**User training**: formal, scheduled sessions, for example a yearly course on handling customer data or how to report an incident. More structured than awareness.",
              hi: "**User training**: formal, scheduled sessions, jaise customer data handle karne ya incident report karne par saal mein ek baar ka course. Awareness se zyada structured.",
            },
            {
              en: "**Physical access control**: locks, badge readers and cameras that keep unauthorised people away from devices. An **access control vestibule** (older name: **mantrap**) is a small room with two doors where only one can be open at a time, which defeats tailgating.",
              hi: "**Physical access control**: locks, badge readers aur cameras jo unauthorised logon ko devices se door rakhte hain. **Access control vestibule** (purana naam: **mantrap**) ek chhota room hai jisme do darwaze hote hain aur ek waqt mein sirf ek khul sakta hai; isse tailgating fail ho jaati hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Where each attack in this lesson is handled in the course", hi: "Is lesson ka har attack course mein kahan handle hota hai" },
          columns: [{ en: "Attack", hi: "Attack" }, { en: "Mainly breaks", hi: "Mainly kya todta hai" }, { en: "Mitigation", hi: "Mitigation" }],
          rows: [
            ["SYN flood / DDoS", "Availability", { en: "Firewall connection limits, upstream filtering", hi: "Firewall connection limits, upstream filtering" }],
            ["DHCP exhaustion", "Availability", { en: "DHCP snooping rate limits (lesson 5.7)", hi: "DHCP snooping rate limits (lesson 5.7)" }],
            [{ en: "Spoofed source IP", hi: "Spoofed source IP" }, { en: "Enables other attacks", hi: "Doosre attacks ko enable karta hai" }, { en: "ACLs at the edge (lessons 5.4, 5.5)", hi: "Edge par ACLs (lessons 5.4, 5.5)" }],
            ["ARP spoofing (MITM)", "Confidentiality, integrity", { en: "Dynamic ARP Inspection (lesson 5.8), encryption", hi: "Dynamic ARP Inspection (lesson 5.8), encryption" }],
            [{ en: "Phishing, password attacks", hi: "Phishing, password attacks" }, "Confidentiality", { en: "Awareness, training, strong passwords, MFA (lesson 5.2)", hi: "Awareness, training, strong passwords aur MFA (lesson 5.2)" }],
            ["Tailgating", { en: "All three", hi: "Teeno" }, { en: "Access control vestibule, training", hi: "Access control vestibule, training" }],
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "CIA triad", def: { en: "Confidentiality, integrity and availability: the three properties security protects.", hi: "Confidentiality, integrity aur availability: woh teen properties jo security protect karti hai." } },
    { term: "Vulnerability", def: { en: "A weakness that could be used to compromise confidentiality, integrity or availability.", hi: "Aisi weakness jisse confidentiality, integrity ya availability compromise ho sake." } },
    { term: "Exploit", def: { en: "A tool or technique that takes advantage of a vulnerability.", hi: "Tool ya technique jo kisi vulnerability ka fayda uthaye." } },
    { term: "Threat", def: { en: "The potential for a vulnerability to be exploited by a threat actor.", hi: "Yeh possibility ki koi threat actor kisi vulnerability ko exploit kar le." } },
    { term: "DDoS", def: { en: "A denial-of-service attack launched from many machines at once, usually a botnet.", hi: "Ek saath bahut saari machines, aam taur par botnet, se kiya gaya denial-of-service attack." } },
    { term: "Amplification", def: { en: "A reflection attack where each reply is much larger than the request that caused it.", hi: "Aisa reflection attack jisme har reply apni request se kaafi bada hota hai." } },
    { term: "Social engineering", def: { en: "Manipulating people into giving access or information, for example phishing or tailgating.", hi: "Logon ko manipulate karke access ya information nikalwana, jaise phishing ya tailgating." } },
    { term: "Access control vestibule", def: { en: "A two-door entry where only one door opens at a time; also called a mantrap.", hi: "Do darwaze wali entry jisme ek waqt mein sirf ek darwaza khulta hai; ise mantrap bhi kehte hain." } },
  ],
  mistakes: [
    {
      en: "Calling an unpatched bug a threat. The bug is the vulnerability; the threat is the possibility that someone exploits it.",
      hi: "Unpatched bug ko threat bolna. Bug vulnerability hai; threat yeh possibility hai ki koi use exploit kar de.",
    },
    {
      en: "Thinking a DoS attack steals data. A DoS attacks availability only; nothing is read or changed.",
      hi: "Yeh sochna ki DoS attack data chori karta hai. DoS sirf availability par attack karta hai; kuch padha ya badla nahi jaata.",
    },
    {
      en: "Mixing up reflection and amplification. Reflection is about where the replies go (to the spoofed victim); amplification is about how big they are compared to the requests.",
      hi: "Reflection aur amplification ko mix karna. Reflection yeh hai ki replies kahan jaate hain (spoofed victim par); amplification yeh hai ki woh requests ke comparison mein kitne bade hain.",
    },
    {
      en: "Saying a virus spreads by itself. A worm spreads on its own across the network; a virus needs a user to run or share the infected file.",
      hi: "Yeh bolna ki virus khud failta hai. Worm network par khud failta hai; virus ko chahiye ki user infected file chalaye ya share kare.",
    },
    {
      en: "Confusing spear phishing and whaling. Both are targeted; whaling specifically targets senior executives.",
      hi: "Spear phishing aur whaling ko confuse karna. Dono targeted hain; whaling khaas taur par senior executives ko target karta hai.",
    },
    {
      en: "Treating user awareness and user training as the same element. Awareness is ongoing reminders and tests; training is formal, scheduled instruction.",
      hi: "User awareness aur user training ko ek hi element maan lena. Awareness lagatar reminders aur tests hain; training formal, scheduled instruction hai.",
    },
  ],
  recap: [
    { en: "CIA: confidentiality (who can read), integrity (who can change), availability (does it work).", hi: "CIA: confidentiality (kaun padh sakta hai), integrity (kaun badal sakta hai), availability (chal raha hai ya nahi)." },
    { en: "Vulnerability = weakness, exploit = the tool, threat = the potential use, mitigation = the defence.", hi: "Vulnerability = weakness, exploit = tool, threat = use hone ki possibility, mitigation = defence." },
    { en: "SYN flood fills the half-open table; reflection sends replies to a spoofed victim; amplification makes them bigger.", hi: "SYN flood half-open table bhar deta hai; reflection replies ko spoofed victim par bhejta hai; amplification unhe bada kar deta hai." },
    { en: "ARP spoofing creates a man in the middle on a LAN; DAI stops it.", hi: "ARP spoofing LAN par man in the middle banata hai; DAI ise rokta hai." },
    { en: "Virus needs a user, worm spreads alone, trojan pretends to be legitimate, ransomware encrypts for money.", hi: "Virus ko user chahiye, worm khud failta hai, trojan legitimate hone ka natak karta hai, ransomware paise ke liye encrypt karta hai." },
    { en: "Security program elements: user awareness, user training, physical access control (badges, access control vestibules).", hi: "Security program ke elements hain user awareness, user training aur physical access control (badges, access control vestibules)." },
  ],
  quiz: [
    {
      q: {
        en: "An attacker who has poisoned the ARP caches on a LAN changes the destination account number in payment requests as they pass through. Which part of the CIA triad is broken most directly?",
        hi: "LAN par ARP caches poison karne wala attacker raaste se guzarti payment requests mein destination account number badal deta hai. CIA triad ka kaunsa hissa sabse seedha tootta hai?",
      },
      options: [
        { en: "Availability", hi: "Availability" },
        { en: "Confidentiality", hi: "Confidentiality" },
        { en: "Integrity", hi: "Integrity" },
        { en: "Authentication", hi: "Authentication" },
      ],
      answer: 2,
      explain: {
        en: "Changing data in transit breaks integrity. The attacker can probably read the data too, but the action described is modification. Authentication is not part of the CIA triad.",
        hi: "Raaste mein data badalna integrity todta hai. Attacker shayad data padh bhi sakta hai, lekin yahan bataya gaya kaam modification hai. Authentication CIA triad ka hissa hi nahi hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "The company web server runs a software version with a known flaw that has not been patched. Nobody has attacked it yet. What is the flaw?",
        hi: "Company ka web server ek aisa software version chala raha hai jisme known flaw hai aur patch nahi hua. Abhi tak kisi ne attack nahi kiya. Yeh flaw kya hai?",
      },
      options: [
        { en: "A vulnerability", hi: "Vulnerability" },
        { en: "An exploit", hi: "Exploit" },
        { en: "A mitigation", hi: "Mitigation" },
        { en: "A reconnaissance attack", hi: "Reconnaissance attack" },
      ],
      answer: 0,
      explain: {
        en: "A weakness is a vulnerability whether or not anyone uses it. The exploit would be the script or technique that takes advantage of it, and patching would be the mitigation.",
        hi: "Weakness vulnerability hi hai, chahe koi use kare ya na kare. Exploit woh script ya technique hoti jo iska fayda uthaye, aur patch karna mitigation hota.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "During a TCP SYN flood with spoofed source addresses, what runs out on the target server?",
        hi: "Spoofed source addresses wale TCP SYN flood mein target server par kya khatam ho jaata hai?",
      },
      options: [
        { en: "Its ARP cache, because every SYN needs a new ARP entry", hi: "Uska ARP cache, kyunki har SYN ko nayi ARP entry chahiye" },
        { en: "Its routing table, because every source adds a route", hi: "Uski routing table, kyunki har source ek route jodta hai" },
        { en: "Its pool of usable source ports for outgoing connections", hi: "Outgoing connections ke liye usable source ports ka pool" },
        { en: "Its capacity to hold half-open connections waiting for the final ACK", hi: "Final ACK ka wait karti half-open connections rakhne ki capacity" },
      ],
      answer: 3,
      explain: {
        en: "Each SYN makes the server send a SYN-ACK and keep state for a half-open connection. The final ACK never comes because the sources are fake, so the backlog fills and real clients are refused. ARP is only used for the next hop, and routes are not created by incoming packets.",
        hi: "Har SYN par server SYN-ACK bhejta hai aur ek half-open connection ki state rakhta hai. Sources fake hain isliye final ACK kabhi nahi aata, backlog bhar jaata hai aur asli clients refuse ho jaate hain. ARP sirf next hop ke liye use hota hai, aur incoming packets se routes nahi bante.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "Bots send small DNS queries to thousands of open resolvers, each with source IP 203.0.113.10. The web server at 203.0.113.10 receives a flood of large DNS replies it never asked for. What is this attack?",
        hi: "Bots hazaaron open resolvers ko chhoti DNS queries bhejte hain, har ek ka source IP 203.0.113.10. 203.0.113.10 wale web server par bade DNS replies ka flood aata hai jo usne kabhi maange hi nahi. Yeh kaunsa attack hai?",
      },
      options: [
        { en: "DNS reconnaissance", hi: "DNS reconnaissance" },
        { en: "A reflection and amplification attack", hi: "Reflection aur amplification attack" },
        { en: "A man-in-the-middle attack", hi: "Man-in-the-middle attack" },
        { en: "A watering hole attack", hi: "Watering hole attack" },
      ],
      answer: 1,
      explain: {
        en: "The spoofed source makes the resolvers reflect their replies onto the victim, and the replies are much larger than the queries, which is amplification. Nothing sits in the path between two parties, so it is not MITM.",
        hi: "Spoofed source ki wajah se resolvers apne replies victim par reflect karte hain, aur replies queries se kaafi bade hain, yahi amplification hai. Do parties ke raaste mein koi baitha nahi hai, isliye yeh MITM nahi hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Malware spreads from PC to PC across a network by exploiting a vulnerability, without any user opening a file. What type of malware is it?",
        hi: "Ek malware kisi vulnerability ko exploit karke network par PC se PC tak failta hai, bina kisi user ke file khole. Yeh kaunsa malware hai?",
      },
      options: [
        { en: "Virus", hi: "Virus" },
        { en: "Trojan horse", hi: "Trojan horse" },
        { en: "Worm", hi: "Worm" },
        { en: "Phishing", hi: "Phishing" },
      ],
      answer: 2,
      explain: {
        en: "Spreading by itself, with no user action, is what defines a worm. A virus needs the user to run or share an infected file, and a trojan needs the user to install it. Phishing is social engineering, not malware.",
        hi: "Bina user action ke khud failna hi worm ki pehchaan hai. Virus ko chahiye ki user infected file chalaye ya share kare, aur trojan ko chahiye ki user use install kare. Phishing social engineering hai, malware nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A visitor walks into the server room right behind an employee who used her badge. What is this called, and which physical control is designed to stop it?",
        hi: "Ek visitor server room mein ek employee ke theek peeche ghus jaata hai jisne apna badge use kiya tha. Ise kya kehte hain, aur ise rokne ke liye kaunsa physical control bana hai?",
      },
      options: [
        { en: "Vishing; a badge reader on the door", hi: "Vishing; darwaze par badge reader" },
        { en: "Whaling; security cameras", hi: "Whaling; security cameras" },
        { en: "Spoofing; a stronger door lock", hi: "Spoofing; zyada strong door lock" },
        { en: "Tailgating; an access control vestibule", hi: "Tailgating; access control vestibule" },
      ],
      answer: 3,
      explain: {
        en: "Following someone through a secured door is tailgating. A badge reader alone did not stop it, because the door was already open. An access control vestibule lets only one door open at a time, so each person must badge in separately.",
        hi: "Kisi ke peeche secured door se ghus jaana tailgating hai. Sirf badge reader ne nahi roka, kyunki darwaza pehle se khula tha. Access control vestibule mein ek waqt mein ek hi darwaza khulta hai, isliye har insaan ko alag se badge karna padta hai.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "VvFuieyTTSw",
      title: "Free CCNA | Security Fundamentals | Day 48",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Covers this whole lesson: the CIA triad, every attack type and the security program elements. Watch up to 23:25 and from 27:19; the part in between (MFA, certificates, AAA) belongs to lessons 5.2 and 5.3.",
        hi: "Poora lesson cover karta hai: CIA triad, har attack type aur security program elements. 23:25 tak aur 27:19 se aage dekho; beech ka hissa (MFA, certificates, AAA) lessons 5.2 aur 5.3 ka hai.",
      },
    },
    {
      id: "Ac2HXOPcZDs",
      title: "124. Free CCNA (NEW) | Network Security - Common Security Terms",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Threat, vulnerability, exploit and mitigation explained in Hindi.", hi: "Threat, vulnerability, exploit aur mitigation Hindi mein samjhaya gaya hai." },
    },
    {
      id: "uJmMwL1m7B8",
      title: "125. Free CCNA (NEW) | Network Security - DoS and DDoS Attacks",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "DoS, DDoS and how floods take a service down, in Hindi.", hi: "DoS, DDoS aur flood se service kaise down hoti hai, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "See a SYN flood and an ARP spoof in Packet Tracer", hi: "Packet Tracer mein SYN flood aur ARP spoof dekho" },
    steps: [
      {
        en: "Build the animation's network: a router as the gateway on 10.10.10.1/24, a switch, PC1 on 10.10.10.21 and a second PC on 10.10.10.66, plus a server on another router interface.",
        hi: "Animation wala network banao: 10.10.10.1/24 par gateway ke roop mein ek router, ek switch, 10.10.10.21 par PC1 aur 10.10.10.66 par doosra PC, aur router ke doosre interface par ek server.",
      },
      {
        en: "In Simulation mode, open a web page from PC1 to the server. Click the TCP events and note the SYN, SYN-ACK and ACK. A SYN flood is the first message repeated thousands of times without the third.",
        hi: "Simulation mode mein PC1 se server ka web page kholo. TCP events par click karke SYN, SYN-ACK aur ACK note karo. SYN flood yahi pehla message hai jo hazaaron baar repeat hota hai, teesre ke bina.",
      },
      {
        en: "On PC1 run `arp -a` and write down the MAC address shown for 10.10.10.1. Compare it with `show interfaces` on the router. In an ARP spoofing attack, this entry would show the attacker's MAC instead.",
        hi: "PC1 par `arp -a` chalao aur 10.10.10.1 ke saamne dikhne wala MAC likh lo. Router par `show interfaces` se compare karo. ARP spoofing attack mein yahi entry attacker ka MAC dikhati.",
      },
      {
        en: "For each attack in the last table of this lesson, write which CIA property it breaks and which later lesson will configure the defence.",
        hi: "Is lesson ki last table ke har attack ke liye likho ki woh kaunsi CIA property todta hai aur kaunse aage ke lesson mein uska defence configure hoga.",
      },
      {
        en: "Optional, real gear only: on your own lab network, capture traffic with Wireshark and filter on `arp` to see every ARP reply. Never run attack tools on networks you do not own.",
        hi: "Optional, sirf real gear par: apne lab network par Wireshark se traffic capture karo aur `arp` par filter karke har ARP reply dekho. Jo network tumhara nahi hai, us par kabhi attack tools mat chalao.",
      },
    ],
  },
};

export default lesson;
