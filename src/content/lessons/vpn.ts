import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "vpn",
  intro: {
    en: "A branch office and its head office both have cheap internet links, and staff work from home on their own broadband. The internet can carry their traffic, but it is public: private addresses are not routed on it, and any network on the path can read or change what passes. A VPN builds a private, encrypted tunnel across that public network, and IPsec is the standard way routers and firewalls build one.",
    hi: "Branch office aur head office dono ke paas sasta internet link hai, aur staff ghar se apne broadband par kaam karta hai. Internet unka traffic le ja sakta hai, lekin woh public hai: private addresses us par route nahi hote, aur raaste ka koi bhi network traffic padh ya badal sakta hai. VPN us public network ke upar ek private, encrypted tunnel banata hai, aur routers aur firewalls ke liye yeh tunnel banane ka standard tareeka IPsec hai.",
  },
  outcomes: [
    { en: "Explain what problem a VPN solves and why it is needed over the internet", hi: "Samjha sako ki VPN kaunsi problem solve karta hai aur internet par iski zaroorat kyun hai" },
    { en: "Describe how a site-to-site IPsec tunnel encrypts and encapsulates a packet in tunnel mode", hi: "Describe kar sako ki site-to-site IPsec tunnel tunnel mode mein packet ko kaise encrypt aur encapsulate karta hai" },
    { en: "Name what IPsec provides (confidentiality, integrity, authentication, anti-replay) and the algorithms behind each", hi: "IPsec kya deta hai (confidentiality, integrity, authentication, anti-replay) aur har ek ke peeche kaunse algorithms hain, yeh bata sako" },
    { en: "Compare ESP with AH, and site-to-site with remote-access VPNs", hi: "ESP ko AH se, aur site-to-site ko remote-access VPN se compare kar sako" },
    { en: "Explain why GRE over IPsec is used and what DMVPN adds", hi: "Samjha sako ki GRE over IPsec kyun use hota hai aur DMVPN kya add karta hai" },
  ],
  sections: [
    {
      id: "why-vpn",
      heading: { en: "Why a VPN", hi: "VPN kyun" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 1.13 you saw that companies often use the internet instead of, or as a backup to, a private WAN like MPLS. Two problems come with it. First, inside networks use private addresses (10.1.1.0/24 at the branch, 10.2.2.0/24 at HQ), and internet routers drop packets addressed to them. Second, the internet is shared: your packets cross ISPs and exchange points you do not control, where they can be read, changed or replayed.",
            hi: "Lesson 1.13 mein tumne dekha ki companies aksar MPLS jaise private WAN ki jagah, ya uske backup ke liye, internet use karti hain. Iske saath do problems aati hain. Pehli, inside networks private addresses use karte hain (branch par 10.1.1.0/24, HQ par 10.2.2.0/24), aur internet routers aise addresses wale packets drop kar dete hain. Doosri, internet shared hai: tumhare packets aise ISPs aur exchange points se guzarte hain jin par tumhara control nahi, jahan unhe padha, badla ya replay kiya ja sakta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "A **VPN (virtual private network)** fixes both. The device at each end wraps the private packet inside a new packet addressed between public IPs, so the internet can route it, and encrypts it, so nobody in between can read or tamper with it. To the two private networks it looks like a direct private link.",
            hi: "**VPN (virtual private network)** dono fix kar deta hai. Har end ka device private packet ko ek naye packet ke andar wrap karta hai jo public IPs ke beech addressed hota hai, taaki internet use route kar sake, aur use encrypt karta hai, taaki beech mein koi use padh ya badal na sake. Dono private networks ko lagta hai jaise unke beech direct private link hai.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "A locked box in a courier parcel", hi: "Courier parcel mein ek locked box" },
          text: {
            en: "You put a letter in a locked box, and the box in a courier parcel addressed from your branch office to head office. The courier only sees the parcel label. Only head office has the key to the box, and a tamper seal shows if anyone opened it on the way.",
            hi: "Tum letter ko ek locked box mein rakhte ho, aur box ko courier parcel mein jis par branch office se head office ka address hai. Courier ko sirf parcel ka label dikhta hai. Box ki key sirf head office ke paas hai, aur tamper seal batata hai ki raaste mein kisi ne khola ya nahi.",
          },
        },
      ],
    },
    {
      id: "site-to-site",
      heading: { en: "Site-to-site IPsec, step by step", hi: "Site-to-site IPsec, step by step" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The branch router R1 has public address 203.0.113.10 and the HQ router R2 has 198.51.100.1. They build a permanent tunnel between them. The PCs and servers behind them send ordinary packets and need no VPN software at all; the routers (or firewalls) do all the work.",
            hi: "Branch router R1 ka public address 203.0.113.10 hai aur HQ router R2 ka 198.51.100.1. Dono apne beech ek permanent tunnel banate hain. Unke peeche ke PCs aur servers normal packets bhejte hain aur unhe koi VPN software nahi chahiye; saara kaam routers (ya firewalls) karte hain.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "PC-B (10.1.1.10) sends a packet to the file server 10.2.2.20 on TCP 445, to its gateway R1.",
              hi: "PC-B (10.1.1.10) file server 10.2.2.20 ko TCP 445 par packet bhejta hai, apne gateway R1 ko.",
            },
            {
              en: "R1 checks which traffic must be protected, here 10.1.1.0/24 to 10.2.2.0/24 (defined with an ACL). This packet matches.",
              hi: "R1 check karta hai ki kaunsa traffic protect karna hai, yahan 10.1.1.0/24 se 10.2.2.0/24 (ACL se define kiya gaya). Yeh packet match karta hai.",
            },
            {
              en: "R1 encrypts the **entire original packet**, including its IP header, adds an **ESP** header and trailer, and puts a **new IP header** in front: source 203.0.113.10, destination 198.51.100.1, protocol 50.",
              hi: "R1 **poora original packet** encrypt karta hai, uske IP header ke saath, **ESP** header aur trailer lagata hai, aur aage **naya IP header** lagata hai: source 203.0.113.10, destination 198.51.100.1, protocol 50.",
            },
            {
              en: "Internet routers forward it using only the outer header, like any other packet between two public addresses.",
              hi: "Internet routers sirf outer header dekh kar ise forward karte hain, do public addresses ke beech kisi bhi doosre packet ki tarah.",
            },
            {
              en: "R2 checks integrity and the sequence number, decrypts, removes the outer header, and routes the original packet to 10.2.2.20.",
              hi: "R2 integrity aur sequence number check karta hai, decrypt karta hai, outer header hatata hai, aur original packet 10.2.2.20 ko route kar deta hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "The packet between R1 and R2 (tunnel mode)", hi: "R1 aur R2 ke beech ka packet (tunnel mode)" },
          columns: [{ en: "Part", hi: "Part" }, { en: "Contents", hi: "Contents" }, { en: "Encrypted?", hi: "Encrypted?" }],
          rows: [
            [{ en: "New IP header", hi: "Naya IP header" }, "203.0.113.10 → 198.51.100.1, protocol 50", { en: "No", hi: "Nahi" }],
            [{ en: "ESP header", hi: "ESP header" }, { en: "SPI (which SA) and sequence number", hi: "SPI (kaunsa SA) aur sequence number" }, { en: "No", hi: "Nahi" }],
            [{ en: "Original IP header", hi: "Original IP header" }, "10.1.1.10 → 10.2.2.20", { en: "Yes", hi: "Haan" }],
            [{ en: "Original TCP and data", hi: "Original TCP aur data" }, { en: "TCP 445, file contents", hi: "TCP 445, file contents" }, { en: "Yes", hi: "Haan" }],
            [{ en: "ESP trailer and ICV", hi: "ESP trailer aur ICV" }, { en: "Padding, and the integrity check value", hi: "Padding, aur integrity check value" }, { en: "Trailer yes, ICV no", hi: "Trailer haan, ICV nahi" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Tunnel mode and transport mode", hi: "Tunnel mode aur transport mode" },
          text: {
            en: "**Tunnel mode**, shown above, encrypts the whole original packet and adds a new IP header; site-to-site VPNs use it. **Transport mode** keeps the original IP header and protects only the payload. It fits when the packet already runs between the two IPsec peers themselves, for example GRE over IPsec, where the GRE packet goes from one router's public address to the other's.",
            hi: "**Tunnel mode**, jo upar dikhaya, poora original packet encrypt karta hai aur naya IP header lagata hai; site-to-site VPN yahi use karte hain. **Transport mode** original IP header rakhta hai aur sirf payload protect karta hai. Yeh tab fit hota hai jab packet pehle se hi dono IPsec peers ke beech chal raha ho, jaise GRE over IPsec mein, jahan GRE packet ek router ke public address se doosre ke public address tak jaata hai.",
          },
        },
      ],
    },
    {
      id: "what-ipsec-provides",
      heading: { en: "What IPsec provides: ESP vs AH", hi: "IPsec kya deta hai: ESP vs AH" },
      blocks: [
        {
          type: "p",
          text: {
            en: "IPsec is not one protocol but a framework. It lets the two ends choose algorithms, and together they give four protections.",
            hi: "IPsec ek protocol nahi, balki ek framework hai. Dono ends algorithms choose kar sakte hain, aur mil kar chaar protections milti hain.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Protection", hi: "Protection" }, { en: "What it stops", hi: "Kya rokta hai" }, { en: "How", hi: "Kaise" }],
          rows: [
            ["Confidentiality", { en: "Reading the data", hi: "Data padhna" }, { en: "Encryption, normally AES (DES and 3DES are old and weak)", hi: "Encryption, aam taur par AES (DES aur 3DES purane aur kamzor hain)" }],
            ["Integrity", { en: "Changing the data on the way", hi: "Raaste mein data badalna" }, { en: "A keyed hash (HMAC) with SHA-256 or stronger; MD5 and SHA-1 are legacy", hi: "Keyed hash (HMAC), SHA-256 ya usse strong; MD5 aur SHA-1 legacy hain" }],
            ["Authentication", { en: "A fake peer pretending to be HQ", hi: "Fake peer jo HQ hone ka natak kare" }, { en: "Pre-shared keys or digital certificates", hi: "Pre-shared keys ya digital certificates" }],
            ["Anti-replay", { en: "Re-sending a captured packet", hi: "Captured packet dobara bhejna" }, { en: "A sequence number in every ESP packet; duplicates are dropped", hi: "Har ESP packet mein sequence number; duplicate drop hota hai" }],
          ],
        },
        {
          type: "table",
          caption: { en: "The two IPsec security protocols", hi: "IPsec ke do security protocols" },
          columns: ["", "ESP", "AH"],
          rows: [
            [{ en: "Full name", hi: "Full name" }, "Encapsulating Security Payload", "Authentication Header"],
            [{ en: "IP protocol number", hi: "IP protocol number" }, "50", "51"],
            [{ en: "Encryption", hi: "Encryption" }, { en: "Yes", hi: "Haan" }, { en: "No", hi: "Nahi" }],
            [{ en: "Integrity, authentication, anti-replay", hi: "Integrity, authentication, anti-replay" }, { en: "Yes", hi: "Haan" }, { en: "Yes", hi: "Haan" }],
            [{ en: "Works through NAT", hi: "NAT ke through kaam karta hai" }, { en: "Yes (with NAT traversal, UDP 4500)", hi: "Haan (NAT traversal ke saath, UDP 4500)" }, { en: "No, NAT changes the header AH protects", hi: "Nahi, NAT woh header badal deta hai jo AH protect karta hai" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "If a question asks which IPsec protocol encrypts, the answer is ESP. AH only authenticates and checks integrity, and almost nobody deploys it today.",
            hi: "Agar sawaal pooche ki kaunsa IPsec protocol encrypt karta hai, toh jawab ESP hai. AH sirf authenticate aur integrity check karta hai, aur aaj kal lagbhag koi use deploy nahi karta.",
          },
        },
      ],
    },
    {
      id: "ike",
      heading: { en: "IKE: agreeing on keys first", hi: "IKE: pehle keys par agreement" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Before any data is encrypted, R1 and R2 must agree on algorithms and keys. **IKE (Internet Key Exchange)** does this over **UDP 500**. In IKEv1 the framework is called **ISAKMP**, which is why Cisco commands say `crypto isakmp`. IKEv2 is the newer, simpler version.",
            hi: "Koi bhi data encrypt hone se pehle R1 aur R2 ko algorithms aur keys par agree karna padta hai. **IKE (Internet Key Exchange)** yeh kaam **UDP 500** par karta hai. IKEv1 mein framework ka naam **ISAKMP** hai, isiliye Cisco commands mein `crypto isakmp` likha hota hai. IKEv2 naya aur simple version hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Phase 1** builds a secure management channel, the IKE SA. The peers authenticate each other (pre-shared key or certificate), agree on encryption and hash, and use **Diffie-Hellman** to create a shared secret without ever sending it across the internet.",
              hi: "**Phase 1** ek secure management channel banata hai, IKE SA. Peers ek doosre ko authenticate karte hain (pre-shared key ya certificate), encryption aur hash par agree karte hain, aur **Diffie-Hellman** se ek shared secret banate hain bina use kabhi internet par bheje.",
            },
            {
              en: "**Phase 2** runs inside that channel and builds the **IPsec SAs** that protect the data: which traffic (10.1.1.0/24 to 10.2.2.0/24), ESP with which algorithms, and the keys. There is one SA per direction, and keys are refreshed regularly.",
              hi: "**Phase 2** us channel ke andar chalta hai aur **IPsec SAs** banata hai jo data protect karte hain: kaunsa traffic (10.1.1.0/24 se 10.2.2.0/24), kaunse algorithms ke saath ESP, aur keys. Har direction ka ek SA hota hai, aur keys regular refresh hoti hain.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "R1 reference config (crypto map, IKEv1); configuration is beyond the CCNA", hi: "R1 reference config (crypto map, IKEv1); configuration CCNA ke bahar hai" },
          lines: [
            { prompt: "R1(config)#", cmd: "crypto isakmp policy 10" },
            { prompt: "R1(config-isakmp)#", cmd: "encryption aes 256" },
            { prompt: "R1(config-isakmp)#", cmd: "hash sha256" },
            { prompt: "R1(config-isakmp)#", cmd: "authentication pre-share" },
            { prompt: "R1(config-isakmp)#", cmd: "group 14", comment: { en: "Diffie-Hellman group", hi: "Diffie-Hellman group" } },
            { prompt: "R1(config-isakmp)#", cmd: "exit" },
            { prompt: "R1(config)#", cmd: "crypto isakmp key V9n-Key-77 address 198.51.100.1" },
            { prompt: "R1(config)#", cmd: "crypto ipsec transform-set TS esp-aes 256 esp-sha256-hmac" },
            { prompt: "R1(cfg-crypto-trans)#", cmd: "exit", comment: { en: "Tunnel mode is the default; no mode command needed", hi: "Tunnel mode default hai; mode command ki zaroorat nahi" } },
            { prompt: "R1(config)#", cmd: "access-list 110 permit ip 10.1.1.0 0.0.0.255 10.2.2.0 0.0.0.255", comment: { en: "Traffic to protect", hi: "Jo traffic protect karna hai" } },
            { prompt: "R1(config)#", cmd: "crypto map VPN 10 ipsec-isakmp" },
            { out: "% NOTE: This new crypto map will remain disabled until a peer" },
            { out: "        and a valid access list have been configured." },
            { prompt: "R1(config-crypto-map)#", cmd: "set peer 198.51.100.1" },
            { prompt: "R1(config-crypto-map)#", cmd: "set transform-set TS" },
            { prompt: "R1(config-crypto-map)#", cmd: "match address 110" },
            { prompt: "R1(config-crypto-map)#", cmd: "exit" },
            { prompt: "R1(config)#", cmd: "interface gigabitethernet0/1" },
            { prompt: "R1(config-if)#", cmd: "crypto map VPN", comment: { en: "Apply on the internet-facing interface", hi: "Internet wale interface par apply karo" } },
          ],
          note: {
            en: "R2 has the mirror image: peer 203.0.113.10, the same key, and an ACL from 10.2.2.0/24 to 10.1.1.0/24.",
            hi: "R2 par iska mirror hota hai: peer 203.0.113.10, wahi key, aur 10.2.2.0/24 se 10.1.1.0/24 ka ACL.",
          },
        },
        {
          type: "cli",
          title: { en: "Verifying the tunnel", hi: "Tunnel verify karna" },
          lines: [
            { prompt: "R1#", cmd: "show crypto isakmp sa" },
            { out: "IPv4 Crypto ISAKMP SA" },
            { out: "dst             src             state          conn-id status" },
            { out: "198.51.100.1    203.0.113.10    QM_IDLE           1001 ACTIVE", comment: { en: "QM_IDLE: phase 1 is up and ready", hi: "QM_IDLE: phase 1 up hai aur ready hai" } },
            { prompt: "R1#", cmd: "show crypto ipsec sa | include encaps|decaps" },
            { out: "    #pkts encaps: 4, #pkts encrypt: 4, #pkts digest: 4" },
            { out: "    #pkts decaps: 4, #pkts decrypt: 4, #pkts verify: 4", comment: { en: "Counters rise in both directions: the tunnel carries traffic", hi: "Dono directions mein counters badh rahe hain: tunnel traffic le ja raha hai" } },
          ],
        },
      ],
    },
    {
      id: "remote-access",
      heading: { en: "Remote-access VPNs", hi: "Remote-access VPNs" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A site-to-site VPN connects networks. A **remote-access VPN** connects one device, such as a laptop at home or in a hotel. The user runs a VPN client, for example **Cisco Secure Client** (formerly AnyConnect), which builds a tunnel to the company's VPN headend, usually a firewall such as Cisco Secure Firewall, sometimes a router.",
            hi: "Site-to-site VPN networks ko jodta hai. **Remote-access VPN** ek device ko jodta hai, jaise ghar ya hotel mein laptop. User ek VPN client chalata hai, jaise **Cisco Secure Client** (pehle AnyConnect), jo company ke VPN headend tak tunnel banata hai, aam taur par Cisco Secure Firewall jaisa firewall, kabhi kabhi router.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "The client connects to the headend's public address, commonly with **TLS on TCP 443**, the same port as HTTPS, so it passes through almost any hotel or home firewall. IPsec with IKEv2 is also an option.",
              hi: "Client headend ke public address se connect karta hai, aam taur par **TCP 443 par TLS** se, wahi port jo HTTPS ka hai, isliye yeh lagbhag kisi bhi hotel ya home firewall se nikal jaata hai. IKEv2 ke saath IPsec bhi ek option hai.",
            },
            {
              en: "The user logs in. The headend usually checks the login with a RADIUS server such as ISE (lesson 5.3), often with MFA.",
              hi: "User login karta hai. Headend aam taur par login ko ISE jaise RADIUS server se check karta hai (lesson 5.3), aksar MFA ke saath.",
            },
            {
              en: "The headend gives the laptop an inside address from a pool, for example 10.2.200.15. Packets from that address travel inside the encrypted tunnel, and HQ servers see an inside host.",
              hi: "Headend laptop ko pool se ek inside address deta hai, jaise 10.2.200.15. Us address se aane wale packets encrypted tunnel ke andar jaate hain, aur HQ servers ko ek inside host dikhta hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Site-to-site vs remote access", hi: "Site-to-site vs remote access" },
          columns: ["", "Site-to-site", "Remote access"],
          rows: [
            [{ en: "Connects", hi: "Kya jodta hai" }, { en: "Two networks (branch and HQ)", hi: "Do networks (branch aur HQ)" }, { en: "One device to a network", hi: "Ek device ko network se" }],
            [{ en: "Tunnel ends", hi: "Tunnel ke ends" }, { en: "Two routers or firewalls", hi: "Do routers ya firewalls" }, { en: "Client software and a headend", hi: "Client software aur ek headend" }],
            [{ en: "Software on hosts", hi: "Hosts par software" }, { en: "None", hi: "Kuch nahi" }, { en: "VPN client on each device", hi: "Har device par VPN client" }],
            [{ en: "Usually", hi: "Aam taur par" }, { en: "IPsec, always on", hi: "IPsec, hamesha on" }, { en: "TLS (or IPsec), on demand", hi: "TLS (ya IPsec), zaroorat par" }],
          ],
        },
      ],
    },
    {
      id: "gre-dmvpn",
      heading: { en: "GRE over IPsec and DMVPN", hi: "GRE over IPsec aur DMVPN" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A plain IPsec tunnel like the crypto map above carries only unicast IP traffic. OSPF, however, sends its hellos to the multicast address 224.0.0.5, so two sites cannot run OSPF across it. **GRE (Generic Routing Encapsulation, IP protocol 47)** can carry multicast, broadcast and routing protocols, and gives you a tunnel interface you can route over, but it encrypts nothing.",
            hi: "Upar wale crypto map jaisa plain IPsec tunnel sirf unicast IP traffic le jaata hai. Lekin OSPF apne hellos multicast address 224.0.0.5 par bhejta hai, isliye do sites iske upar OSPF nahi chala sakti. **GRE (Generic Routing Encapsulation, IP protocol 47)** multicast, broadcast aur routing protocols le ja sakta hai, aur ek tunnel interface deta hai jis par tum route kar sakte ho, lekin yeh kuch bhi encrypt nahi karta.",
          },
        },
        {
          type: "p",
          text: {
            en: "**GRE over IPsec** combines them: the router first wraps the packet in GRE, then IPsec encrypts the GRE packet. GRE brings the routing protocols, IPsec brings the security.",
            hi: "**GRE over IPsec** dono ko jodta hai: router pehle packet ko GRE mein wrap karta hai, phir IPsec us GRE packet ko encrypt karta hai. GRE routing protocols laata hai, IPsec security laata hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "With 50 branches, a full mesh of separate tunnels would mean 1,225 separate tunnels. **DMVPN (Dynamic Multipoint VPN)**, a Cisco solution, lets you configure only hub-and-spoke: each branch has one tunnel to the hub. When branch A needs to talk to branch B, they discover each other through the hub and build a direct spoke-to-spoke tunnel on demand. It is built from multipoint GRE, NHRP and IPsec; for the CCNA, knowing this idea is enough.",
            hi: "50 branches ho toh har pair ke liye alag tunnel ka full mesh 1,225 alag tunnels ban jaate. **DMVPN (Dynamic Multipoint VPN)**, ek Cisco solution, mein sirf hub-and-spoke configure karna padta hai: har branch ka hub tak ek tunnel. Jab branch A ko branch B se baat karni ho, toh woh hub ke through ek doosre ko dhoondh lete hain aur zaroorat par direct spoke-to-spoke tunnel bana lete hain. Yeh multipoint GRE, NHRP aur IPsec se bana hai; CCNA ke liye itna idea kaafi hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "GRE alone = routing protocols and multicast, no encryption. IPsec alone = encryption, unicast only. Need both? GRE over IPsec. Many sites with simple configuration and direct branch-to-branch tunnels? DMVPN.",
            hi: "Sirf GRE = routing protocols aur multicast, encryption nahi. Sirf IPsec = encryption, sirf unicast. Dono chahiye? GRE over IPsec. Bahut saari sites, simple configuration aur direct branch-to-branch tunnels? DMVPN.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "VPN", def: { en: "A private, usually encrypted, tunnel built across a shared network such as the internet.", hi: "Internet jaise shared network ke upar bana private, aam taur par encrypted, tunnel." } },
    { term: "IPsec", def: { en: "A framework of protocols that gives IP packets confidentiality, integrity, authentication and anti-replay.", hi: "Protocols ka framework jo IP packets ko confidentiality, integrity, authentication aur anti-replay deta hai." } },
    { term: "ESP", def: { en: "Encapsulating Security Payload, IP protocol 50. Encrypts and authenticates; the IPsec protocol used in practice.", hi: "Encapsulating Security Payload, IP protocol 50. Encrypt bhi karta hai aur authenticate bhi; practice mein yahi IPsec protocol use hota hai." } },
    { term: "AH", def: { en: "Authentication Header, IP protocol 51. Integrity and authentication only, no encryption; does not work through NAT.", hi: "Authentication Header, IP protocol 51. Sirf integrity aur authentication, encryption nahi; NAT ke through kaam nahi karta." } },
    { term: "IKE / ISAKMP", def: { en: "The key exchange on UDP 500 that authenticates the peers and creates the keys and SAs IPsec uses.", hi: "UDP 500 par chalne wala key exchange jo peers ko authenticate karta hai aur IPsec ke keys aur SAs banata hai." } },
    { term: "Tunnel mode", def: { en: "IPsec mode that encrypts the whole original packet and adds a new IP header between the tunnel ends.", hi: "IPsec mode jo poore original packet ko encrypt karta hai aur tunnel ke ends ke beech naya IP header lagata hai." } },
    { term: "GRE", def: { en: "Generic Routing Encapsulation, IP protocol 47. A tunnel that carries multicast and routing protocols but does not encrypt.", hi: "Generic Routing Encapsulation, IP protocol 47. Aisa tunnel jo multicast aur routing protocols le jaata hai lekin encrypt nahi karta." } },
    { term: "DMVPN", def: { en: "Cisco Dynamic Multipoint VPN: hub-and-spoke configuration with on-demand direct spoke-to-spoke tunnels.", hi: "Cisco Dynamic Multipoint VPN: hub-and-spoke configuration ke saath zaroorat par direct spoke-to-spoke tunnels." } },
  ],
  commands: [
    { cmd: "crypto isakmp policy 10", mode: "Global config", does: { en: "Define IKE phase 1 settings: encryption, hash, authentication, DH group", hi: "IKE phase 1 settings define karo: encryption, hash, authentication, DH group" } },
    { cmd: "crypto isakmp key V9n-Key-77 address 198.51.100.1", mode: "Global config", does: { en: "Set the pre-shared key for one peer", hi: "Ek peer ke liye pre-shared key set karo" } },
    { cmd: "crypto ipsec transform-set TS esp-aes 256 esp-sha256-hmac", mode: "Global config", does: { en: "Choose ESP with AES-256 encryption and SHA-256 integrity for the data", hi: "Data ke liye AES-256 encryption aur SHA-256 integrity wala ESP choose karo" } },
    { cmd: "crypto map VPN 10 ipsec-isakmp", mode: "Global config", does: { en: "Tie peer, transform set and protected-traffic ACL together", hi: "Peer, transform set aur protected-traffic ACL ko ek saath jodo" } },
    { cmd: "crypto map VPN", mode: "Interface config", does: { en: "Apply the crypto map to the internet-facing interface", hi: "Crypto map ko internet wale interface par apply karo" } },
    { cmd: "show crypto isakmp sa", mode: "Privileged EXEC", does: { en: "Show IKE phase 1 SAs and their state (QM_IDLE = up)", hi: "IKE phase 1 SAs aur unki state dikhao (QM_IDLE = up)" } },
    { cmd: "show crypto ipsec sa", mode: "Privileged EXEC", does: { en: "Show IPsec SAs with encrypt and decrypt counters", hi: "IPsec SAs ko encrypt aur decrypt counters ke saath dikhao" } },
  ],
  mistakes: [
    {
      en: "Saying AH encrypts. Only ESP encrypts; AH provides integrity and authentication only.",
      hi: "Yeh bolna ki AH encrypt karta hai. Sirf ESP encrypt karta hai; AH sirf integrity aur authentication deta hai.",
    },
    {
      en: "Thinking the PCs behind a site-to-site VPN need VPN software. The routers or firewalls do the work; the hosts send normal packets.",
      hi: "Yeh sochna ki site-to-site VPN ke peeche wale PCs ko VPN software chahiye. Kaam routers ya firewalls karte hain; hosts normal packets bhejte hain.",
    },
    {
      en: "Expecting the internet to see the private addresses in tunnel mode. The outer header carries the two public addresses; the inner header is encrypted.",
      hi: "Yeh expect karna ki tunnel mode mein internet ko private addresses dikhenge. Outer header mein do public addresses hote hain; inner header encrypted hota hai.",
    },
    {
      en: "Trying to run OSPF over a plain IPsec tunnel. IPsec alone carries only unicast; use GRE over IPsec.",
      hi: "Plain IPsec tunnel par OSPF chalane ki koshish karna. Akela IPsec sirf unicast le jaata hai; GRE over IPsec use karo.",
    },
    {
      en: "Assuming GRE is secure because it is a tunnel. GRE adds no encryption at all.",
      hi: "Yeh maan lena ki GRE tunnel hai isliye secure hai. GRE bilkul bhi encryption nahi deta.",
    },
    {
      en: "Mixing up the numbers. IKE is UDP 500 (4500 with NAT traversal); ESP is IP protocol 50, AH is 51, GRE is 47. They are protocol numbers, not ports.",
      hi: "Numbers mix karna. IKE UDP 500 hai (NAT traversal ke saath 4500); ESP IP protocol 50 hai, AH 51, GRE 47. Yeh protocol numbers hain, ports nahi.",
    },
  ],
  recap: [
    { en: "A VPN carries private traffic across the internet inside an encrypted tunnel.", hi: "VPN private traffic ko encrypted tunnel ke andar internet ke paar le jaata hai." },
    { en: "Site-to-site IPsec in tunnel mode: original packet encrypted, ESP added, new IP header between the public addresses.", hi: "Tunnel mode mein site-to-site IPsec: original packet encrypt hota hai, ESP lagta hai, public addresses ke beech naya IP header lagta hai." },
    { en: "IPsec gives confidentiality (AES), integrity (SHA HMAC), authentication (PSK or certificates) and anti-replay (sequence numbers).", hi: "IPsec deta hai confidentiality (AES), integrity (SHA HMAC), authentication (PSK ya certificates) aur anti-replay (sequence numbers)." },
    { en: "ESP (50) encrypts; AH (51) does not. IKE on UDP 500 negotiates the keys first.", hi: "ESP (50) encrypt karta hai; AH (51) nahi. UDP 500 par IKE pehle keys negotiate karta hai." },
    { en: "Remote access: a client such as Cisco Secure Client on one device, usually TLS on TCP 443.", hi: "Remote access: ek device par Cisco Secure Client jaisa client, aam taur par TCP 443 par TLS." },
    { en: "GRE over IPsec carries routing protocols securely; DMVPN adds on-demand spoke-to-spoke tunnels.", hi: "GRE over IPsec routing protocols ko securely le jaata hai; DMVPN zaroorat par spoke-to-spoke tunnels add karta hai." },
  ],
  quiz: [
    {
      q: { en: "Which IPsec protocol provides encryption of the data?", hi: "Kaunsa IPsec protocol data ka encryption deta hai?" },
      options: [
        { en: "AH", hi: "AH" },
        { en: "GRE", hi: "GRE" },
        { en: "ESP", hi: "ESP" },
        { en: "IKE", hi: "IKE" },
      ],
      answer: 2,
      explain: {
        en: "ESP (IP protocol 50) encrypts and also gives integrity and anti-replay. AH authenticates but never encrypts, GRE is an unencrypted tunnel, and IKE negotiates keys but does not carry the data.",
        hi: "ESP (IP protocol 50) encrypt karta hai aur integrity aur anti-replay bhi deta hai. AH authenticate karta hai par kabhi encrypt nahi karta, GRE ek unencrypted tunnel hai, aur IKE keys negotiate karta hai par data nahi le jaata.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "PC-B (10.1.1.10) sends to 10.2.2.20 through a site-to-site IPsec tunnel in tunnel mode between R1 (203.0.113.10) and R2 (198.51.100.1). Which addresses can a router on the internet read in the packet?",
        hi: "PC-B (10.1.1.10) R1 (203.0.113.10) aur R2 (198.51.100.1) ke beech tunnel mode wale site-to-site IPsec tunnel se 10.2.2.20 ko bhejta hai. Internet ka router packet mein kaunse addresses padh sakta hai?",
      },
      options: [
        { en: "Source 203.0.113.10, destination 198.51.100.1", hi: "Source 203.0.113.10, destination 198.51.100.1" },
        { en: "Source 10.1.1.10, destination 10.2.2.20", hi: "Source 10.1.1.10, destination 10.2.2.20" },
        { en: "Source 10.1.1.10, destination 198.51.100.1", hi: "Source 10.1.1.10, destination 198.51.100.1" },
        { en: "Both the inner and the outer addresses", hi: "Inner aur outer dono addresses" },
      ],
      answer: 0,
      explain: {
        en: "Tunnel mode encrypts the whole original packet, including the 10.x header, and adds a new header between the two public tunnel ends. Internet routers see and route on only that outer header.",
        hi: "Tunnel mode poore original packet ko encrypt karta hai, 10.x header ke saath, aur do public tunnel ends ke beech naya header lagata hai. Internet routers sirf woh outer header dekhte hain aur usi par route karte hain.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "HQ and a branch are joined by an IPsec tunnel over the internet. The team wants to run OSPF between the two routers across the tunnel, still encrypted. What should they use?",
        hi: "HQ aur ek branch internet par IPsec tunnel se jude hain. Team dono routers ke beech tunnel ke upar OSPF chalana chahti hai, encryption ke saath. Kya use karna chahiye?",
      },
      options: [
        { en: "AH instead of ESP", hi: "ESP ki jagah AH" },
        { en: "A plain GRE tunnel instead of IPsec", hi: "IPsec ki jagah plain GRE tunnel" },
        { en: "Transport mode instead of tunnel mode, with no GRE", hi: "Tunnel mode ki jagah transport mode, bina GRE" },
        { en: "GRE over IPsec", hi: "GRE over IPsec" },
      ],
      answer: 3,
      explain: {
        en: "OSPF hellos go to multicast 224.0.0.5, which plain IPsec does not carry. GRE carries multicast and routing protocols, and IPsec encrypts the GRE packets. GRE alone would work for OSPF but would send everything unencrypted.",
        hi: "OSPF hellos multicast 224.0.0.5 par jaate hain, jo plain IPsec nahi le jaata. GRE multicast aur routing protocols le jaata hai, aur IPsec GRE packets ko encrypt karta hai. Sirf GRE se OSPF chal jaata, lekin sab kuch bina encryption ke jaata.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Which statement is true of a remote-access VPN but not of a site-to-site VPN?",
        hi: "Kaunsa statement remote-access VPN ke liye sahi hai lekin site-to-site VPN ke liye nahi?",
      },
      options: [
        { en: "It encrypts traffic crossing the internet", hi: "Yeh internet paar karne wale traffic ko encrypt karta hai" },
        { en: "Each user device runs VPN client software, such as Cisco Secure Client", hi: "Har user device par VPN client software chalta hai, jaise Cisco Secure Client" },
        { en: "It can use IPsec", hi: "Yeh IPsec use kar sakta hai" },
        { en: "It hides private addresses from internet routers", hi: "Yeh private addresses ko internet routers se chhupata hai" },
      ],
      answer: 1,
      explain: {
        en: "Both kinds encrypt, both can use IPsec, and both hide the inner addresses. What sets remote access apart is the client on each device. In a site-to-site VPN the hosts run nothing; the routers or firewalls build the tunnel.",
        hi: "Dono encrypt karte hain, dono IPsec use kar sakte hain, aur dono inner addresses chhupate hain. Remote access ko alag banata hai har device par client. Site-to-site VPN mein hosts par kuch nahi chalta; tunnel routers ya firewalls banate hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An attacker captures an ESP packet between R1 and R2 and sends the exact same packet to R2 again a minute later. What happens?",
        hi: "Attacker R1 aur R2 ke beech ek ESP packet capture karta hai aur ek minute baad bilkul wahi packet R2 ko dobara bhejta hai. Kya hota hai?",
      },
      options: [
        { en: "R2 decrypts and forwards it again, because the integrity check still matches", hi: "R2 use phir decrypt karke forward karta hai, kyunki integrity check abhi bhi match karta hai" },
        { en: "R2 tears down the tunnel and renegotiates IKE", hi: "R2 tunnel tod deta hai aur IKE dobara negotiate karta hai" },
        { en: "R2 drops it, because it has already received that sequence number", hi: "R2 use drop kar deta hai, kyunki woh sequence number pehle hi aa chuka hai" },
        { en: "R2 forwards it, but the server ignores it", hi: "R2 use forward kar deta hai, lekin server use ignore karta hai" },
      ],
      answer: 2,
      explain: {
        en: "The integrity check would pass, since nothing was changed, which is exactly why anti-replay exists. Every ESP packet has a sequence number, and R2 drops any number it has already accepted.",
        hi: "Integrity check pass ho jaata, kyunki kuch badla nahi, aur isi wajah se anti-replay hota hai. Har ESP packet mein sequence number hota hai, aur R2 pehle se accept kiya hua koi bhi number drop kar deta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`show crypto isakmp sa` on R1 shows `198.51.100.1  203.0.113.10  QM_IDLE  1001 ACTIVE`. What does this tell you?",
        hi: "R1 par `show crypto isakmp sa` mein `198.51.100.1  203.0.113.10  QM_IDLE  1001 ACTIVE` dikhta hai. Isse kya pata chalta hai?",
      },
      options: [
        { en: "IKE phase 1 with 198.51.100.1 is up and ready", hi: "198.51.100.1 ke saath IKE phase 1 up hai aur ready hai" },
        { en: "The tunnel is down and waiting for interesting traffic", hi: "Tunnel down hai aur interesting traffic ka wait kar raha hai" },
        { en: "Phase 1 failed because the pre-shared keys do not match", hi: "Phase 1 fail hua kyunki pre-shared keys match nahi karti" },
        { en: "R1 has no peer configured", hi: "R1 par koi peer configured nahi hai" },
      ],
      answer: 0,
      explain: {
        en: "QM_IDLE with status ACTIVE means the IKE SA with the peer is established and idle, ready for phase 2 (quick mode) exchanges. To confirm data is flowing, check the encrypt and decrypt counters in `show crypto ipsec sa`.",
        hi: "QM_IDLE aur status ACTIVE ka matlab hai peer ke saath IKE SA ban chuka hai aur idle hai, phase 2 (quick mode) exchanges ke liye ready. Data chal raha hai ya nahi, yeh confirm karne ke liye `show crypto ipsec sa` mein encrypt aur decrypt counters dekho.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "BW3fQgdf4-w",
      title: "Free CCNA | WAN Architectures | Day 53",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Watch the Internet VPNs part: site-to-site IPsec, GRE over IPsec, DMVPN and remote-access TLS VPNs.", hi: "Internet VPNs wala part dekho: site-to-site IPsec, GRE over IPsec, DMVPN aur remote-access TLS VPNs." },
    },
    {
      id: "CuxyZiSCSfc",
      title: "MicroNugget: IPsec Site to Site VPN Tunnels Explained | CBT Nuggets",
      channel: "CBT Nuggets",
      lang: "en",
      note: { en: "A short explanation of how a site-to-site IPsec tunnel is negotiated and used.", hi: "Site-to-site IPsec tunnel kaise negotiate aur use hota hai, iska chhota explanation." },
    },
    {
      id: "UkR0wNr1W6k",
      title: "270. CCNP Encore + Enarsi | VPN: Virtual Private Network - Types of VPN",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of site-to-site and remote-access VPNs.", hi: "Site-to-site aur remote-access VPN ka Hindi explanation." },
    },
    {
      id: "m5eY5TVzTwA",
      title: "273. CCNP Encore + Enarsi | VPN: Introduction to IPSec VPN",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi introduction to IPsec and what it protects; part of a CCNP series, so it goes a little deeper.", hi: "IPsec aur woh kya protect karta hai, iska Hindi introduction; CCNP series ka part hai, isliye thoda deep jaata hai." },
    },
  ],
  lab: {
    title: { en: "Build a site-to-site IPsec VPN in Packet Tracer", hi: "Packet Tracer mein site-to-site IPsec VPN banao" },
    steps: [
      { en: "Use three 1941 ISR routers: R1 (branch LAN 10.1.1.1/24 on Gi0/0, outside 203.0.113.10/24 on Gi0/1), an ISP router in the middle (203.0.113.1 and 198.51.100.254), and R2 (HQ LAN 10.2.2.1/24, outside 198.51.100.1/24). Add PC-B 10.1.1.10 and a server 10.2.2.20. Give R1 and R2 a default route to the ISP; the ISP gets no routes to 10.x.", hi: "Teen 1941 ISR routers lo: R1 (Gi0/0 par branch LAN 10.1.1.1/24, Gi0/1 par outside 203.0.113.10/24), beech mein ek ISP router (203.0.113.1 aur 198.51.100.254), aur R2 (HQ LAN 10.2.2.1/24, outside 198.51.100.1/24). PC-B 10.1.1.10 aur ek server 10.2.2.20 add karo. R1 aur R2 ko ISP ki taraf default route do; ISP ko 10.x ke routes mat do." },
      { en: "Ping from PC-B to 10.2.2.20 and confirm it fails: the ISP router has no route to 10.x networks.", hi: "PC-B se 10.2.2.20 ping karo aur confirm karo ki fail hota hai: ISP router ke paas 10.x networks ka route nahi hai." },
      { en: "Enter the reference config from this lesson on R1, and its mirror on R2. If the crypto commands are missing, enable the security license with `license boot module c1900 technology-package securityk9` and reload. Packet Tracer accepts fewer algorithms than real IOS; if it rejects `hash sha256`, `group 14` or `esp-sha256-hmac`, use `hash sha`, `group 5` and `esp-sha-hmac` for the lab only.", hi: "Is lesson ka reference config R1 par daalo, aur uska mirror R2 par. Agar crypto commands nahi mil rahe, toh `license boot module c1900 technology-package securityk9` se security license enable karo aur reload karo. Packet Tracer real IOS se kam algorithms accept karta hai; agar woh `hash sha256`, `group 14` ya `esp-sha256-hmac` reject kare, toh sirf lab ke liye `hash sha`, `group 5` aur `esp-sha-hmac` use karo." },
      { en: "Ping again. The first ping may time out while IKE builds the tunnel; then it succeeds.", hi: "Phir ping karo. Pehla ping time out ho sakta hai jab IKE tunnel bana raha ho; phir success." },
      { en: "On R1 run `show crypto isakmp sa` and `show crypto ipsec sa`. In Simulation mode, open a packet on the ISP router and check that the outer header is 203.0.113.10 to 198.51.100.1 with ESP.", hi: "R1 par `show crypto isakmp sa` aur `show crypto ipsec sa` chalao. Simulation mode mein ISP router par ek packet kholo aur check karo ki outer header 203.0.113.10 se 198.51.100.1 hai aur ESP hai." },
    ],
  },
};

export default lesson;
