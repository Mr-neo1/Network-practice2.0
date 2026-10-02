import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "wireless-security",
  intro: {
    en: "A switch port only reaches the one device plugged into it, but a radio frame reaches everyone in range, including the car park outside. So a WLAN has to decide who may join, encrypt every frame, and detect frames that were changed on the way. In lesson 2.9 you ticked WPA2, AES and PSK on a WLC; this lesson explains what those choices do, why the older options are broken, and what WPA3 fixes.",
    hi: "Switch port sirf us ek device tak pahunchta hai jo usmein plug hai, lekin radio frame range mein sabko milta hai, bahar parking mein khade bande ko bhi. Isliye WLAN ko decide karna padta hai ki kaun join kar sakta hai, har frame encrypt karna padta hai, aur raaste mein badle gaye frames pakadne padte hain. Lesson 2.9 mein tumne WLC par WPA2, AES aur PSK tick kiya tha; yeh lesson batata hai ki un choices ka asal kaam kya hai, purane options kyun toot chuke hain, aur WPA3 kya theek karta hai.",
  },
  outcomes: [
    { en: "Compare Open, WEP, WPA, WPA2 and WPA3 by authentication, encryption and integrity", hi: "Open, WEP, WPA, WPA2 aur WPA3 ko authentication, encryption aur integrity ke hisaab se compare kar sako" },
    { en: "Explain Personal (PSK or SAE) and Enterprise (802.1X with EAP and RADIUS) modes, and pick the right one", hi: "Personal (PSK ya SAE) aur Enterprise (802.1X, EAP aur RADIUS) modes samjha sako, aur sahi wala chun sako" },
    { en: "Walk through the WPA2 4-way handshake and say what each message carries", hi: "WPA2 4-way handshake step by step samjha sako aur bata sako ki har message mein kya hota hai" },
    { en: "Explain why a weak WPA2 passphrase can be cracked offline and how WPA3 SAE prevents it", hi: "Samjha sako ki kamzor WPA2 passphrase offline crack kyun ho sakta hai aur WPA3 SAE ise kaise rokta hai" },
    { en: "Configure WPA2-PSK on a WLC and verify the result from a client", hi: "WLC par WPA2-PSK configure karo aur client se result verify kar sako" },
  ],
  sections: [
    {
      id: "three-jobs",
      heading: { en: "Three jobs: authentication, encryption, integrity", hi: "Teen kaam: authentication, encryption, integrity" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every wireless security method is judged on the same three jobs. Keep them separate in your head, because the exam asks about each one by name.",
            hi: "Har wireless security method ko inhi teen kaamon par parkha jaata hai. Inhe dimaag mein alag alag rakho, kyunki exam har ek ke baare mein naam le kar poochta hai.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Job", hi: "Kaam" }, { en: "Question it answers", hi: "Kis sawaal ka jawab" }, { en: "How WPA2 does it", hi: "WPA2 kaise karta hai" }],
          rows: [
            [
              "Authentication",
              { en: "Is this client allowed on the WLAN, and is this really our AP?", hi: "Kya is client ko WLAN par aane ki permission hai, aur kya yeh sach mein hamara AP hai?" },
              { en: "A shared passphrase (PSK) or a per-user login (802.1X)", hi: "Shared passphrase (PSK) ya har user ka apna login (802.1X)" },
            ],
            [
              "Encryption",
              { en: "Can someone in range read the frames?", hi: "Kya range mein baitha koi frames padh sakta hai?" },
              { en: "AES in CCMP mode, with keys from the 4-way handshake", hi: "CCMP mode mein AES, 4-way handshake se bani keys ke saath" },
            ],
            [
              "Integrity",
              { en: "Was the frame changed or forged on the way?", hi: "Kya frame raaste mein badla ya fake banaya gaya?" },
              { en: "A MIC (Message Integrity Check) on every frame", hi: "Har frame par MIC (Message Integrity Check)" },
            ],
          ],
        },
        {
          type: "p",
          text: {
            en: "Authentication works both ways. A client should only send its keys to an AP that proves it knows the same secret, otherwise an attacker's **rogue AP** advertising your SSID could collect them. You will see both sides prove themselves in the 4-way handshake.",
            hi: "Authentication dono taraf se hota hai. Client ko apni keys sirf us AP ko deni chahiye jo prove kare ki use bhi wahi secret pata hai, warna attacker ka **rogue AP** tumhara SSID advertise karke keys collect kar sakta hai. 4-way handshake mein tum dono taraf se yeh proof hote dekhoge.",
          },
        },
      ],
    },
    {
      id: "generations",
      heading: { en: "From Open to WPA3", hi: "Open se WPA3 tak" },
      blocks: [
        {
          type: "table",
          caption: { en: "The security options you will see on an AP or WLC", hi: "AP ya WLC par dikhne wale security options" },
          columns: [{ en: "Option", hi: "Option" }, { en: "Year", hi: "Saal" }, { en: "Encryption and integrity", hi: "Encryption aur integrity" }, { en: "Status", hi: "Status" }],
          rows: [
            ["Open", "1997", { en: "None", hi: "Kuch nahi" }, { en: "Guest networks only, usually with a web login page", hi: "Sirf guest networks, aam taur par web login page ke saath" }],
            ["WEP", "1997", { en: "RC4 with a static 40- or 104-bit key and a 24-bit IV", hi: "RC4, static 40- ya 104-bit key aur 24-bit IV ke saath" }, { en: "Broken; cracked in minutes", hi: "Toot chuka; minutes mein crack hota hai" }],
            ["WPA", "2003", { en: "TKIP: RC4 with per-packet keys, plus a MIC", hi: "TKIP: per-packet keys wala RC4, saath mein MIC" }, { en: "Interim fix; deprecated", hi: "Temporary fix tha; ab deprecated" }],
            ["WPA2", "2004", { en: "AES-CCMP (128-bit)", hi: "AES-CCMP (128-bit)" }, { en: "Still the most common", hi: "Abhi bhi sabse common" }],
            ["WPA3", "2018", { en: "AES-CCMP; AES-GCMP-256 in Enterprise 192-bit mode", hi: "AES-CCMP; Enterprise 192-bit mode mein AES-GCMP-256" }, { en: "Current; 6 GHz allows only WPA3 or Enhanced Open", hi: "Current standard; 6 GHz par sirf WPA3 ya Enhanced Open allowed" }],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**Open authentication** lets anyone associate and encrypts nothing. Guest WLANs pair it with web authentication (a captive portal), which is a Layer 3 login, not encryption. **Enhanced Open (OWE)**, from the WPA3 era, adds encryption to open networks without a password.",
              hi: "**Open authentication** mein koi bhi associate ho sakta hai aur kuch encrypt nahi hota. Guest WLANs ise web authentication (captive portal) ke saath use karte hain, jo Layer 3 login hai, encryption nahi. WPA3 ke time ka **Enhanced Open (OWE)** open networks mein bina password ke encryption jod deta hai.",
            },
            {
              en: "**WEP** uses one static key for everyone with a 24-bit IV. IVs repeat quickly on a busy WLAN, and enough captured frames reveal the key. Its integrity check (CRC-32) can be forged.",
              hi: "**WEP** sabke liye ek static key aur 24-bit IV use karta hai. Busy WLAN par IVs jaldi repeat hote hain, aur kaafi frames capture karne par key nikal aati hai. Iska integrity check (CRC-32) bhi forge kiya ja sakta hai.",
            },
            {
              en: "**WPA** was the Wi-Fi Alliance's stopgap while the 802.11i standard was finished. **TKIP** still uses RC4, so it could run on WEP-era hardware after a firmware update, but it mixes a new key for every packet and adds a MIC.",
              hi: "**WPA** Wi-Fi Alliance ka temporary jugaad tha jab tak 802.11i standard poora nahi hua. **TKIP** abhi bhi RC4 use karta hai, isliye firmware update ke baad WEP wale hardware par chal jaata tha, lekin har packet ke liye nayi key mix karta hai aur MIC jodta hai.",
            },
            {
              en: "**WPA2** implements 802.11i. **CCMP** uses AES for encryption and CBC-MAC for the MIC. With a strong passphrase or 802.1X it is still sound; its weakness is the offline attack on weak passphrases, covered below.",
              hi: "**WPA2** 802.11i ko implement karta hai. **CCMP** encryption ke liye AES aur MIC ke liye CBC-MAC use karta hai. Strong passphrase ya 802.1X ke saath yeh abhi bhi theek hai; iski kamzori kamzor passphrases par offline attack hai, jo neeche dekhoge.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Match the protocol to the standard", hi: "Protocol ko standard se match karo" },
          text: {
            en: "TKIP goes with WPA, CCMP with WPA2, GCMP with WPA3 (WPA3 still uses CCMP as its baseline; GCMP-256 is the cipher it adds). RC4 is the cipher inside WEP and TKIP; AES is the cipher inside CCMP and GCMP. If an option says \"WPA2 with TKIP\", that is a legacy compatibility setting, not the WPA2 you should configure.",
            hi: "TKIP WPA ke saath, CCMP WPA2 ke saath, GCMP WPA3 ke saath (WPA3 ka baseline abhi bhi CCMP hai; GCMP-256 woh naya cipher hai jo WPA3 jodta hai). RC4 WEP aur TKIP ke andar ka cipher hai; AES CCMP aur GCMP ke andar ka cipher hai. Agar option mein \"WPA2 with TKIP\" likha ho, toh woh purane devices ke liye compatibility setting hai, woh WPA2 nahi jo tumhe configure karna chahiye.",
          },
        },
      ],
    },
    {
      id: "personal-enterprise",
      heading: { en: "Personal vs Enterprise", hi: "Personal vs Enterprise" },
      blocks: [
        {
          type: "p",
          text: {
            en: "WPA2 and WPA3 each come in two modes. They encrypt the same way; they differ in where the **PMK** (Pairwise Master Key), the secret both sides start from, comes from.",
            hi: "WPA2 aur WPA3 dono ke do modes hote hain. Encryption same tarike se hota hai; fark sirf is baat ka hai ki **PMK** (Pairwise Master Key), yaani woh secret jisse dono side shuru karte hain, kahan se aata hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Personal (WPA2-PSK)**: everyone types the same passphrase, 8 to 63 characters. The PMK is calculated from the passphrase and the SSID, so every client on the WLAN has the same PMK. WPA3-Personal replaces this with **SAE**.",
              hi: "**Personal (WPA2-PSK)**: sab log same passphrase type karte hain, 8 se 63 characters. PMK passphrase aur SSID se calculate hota hai, isliye WLAN ke har client ka PMK same hota hai. WPA3-Personal isko **SAE** se replace karta hai.",
            },
            {
              en: "**Enterprise (802.1X)**: each user or device logs in with its own credentials, checked by a RADIUS server such as Cisco ISE. Each login produces a different PMK. When someone leaves, you disable one account instead of changing the passphrase on every device.",
              hi: "**Enterprise (802.1X)**: har user ya device apne credentials se login karta hai, jinhe Cisco ISE jaisa RADIUS server check karta hai. Har login ka PMK alag hota hai. Koi company chhode toh sirf ek account disable karo, har device par passphrase badalne ki zaroorat nahi.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "The three 802.1X roles in the animation", hi: "Animation mein 802.1X ke teen roles" },
          columns: [{ en: "Role", hi: "Role" }, { en: "Device", hi: "Device" }, { en: "Talks using", hi: "Kis protocol se baat karta hai" }],
          rows: [
            ["Supplicant", "Laptop1", { en: "EAP inside EAPOL frames, to the authenticator", hi: "EAPOL frames ke andar EAP, authenticator se" }],
            ["Authenticator", { en: "AP1 (or the WLC)", hi: "AP1 (ya WLC)" }, { en: "EAPOL to the client, RADIUS to the server; relays EAP without judging it", hi: "Client se EAPOL, server se RADIUS; EAP ko bina judge kiye relay karta hai" }],
            ["Authentication server", "ISE1, 10.1.30.20", { en: "RADIUS on UDP 1812 (accounting 1813)", hi: "RADIUS, UDP 1812 par (accounting 1813)" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "**EAP** (Extensible Authentication Protocol) is a framework; the **EAP method** decides how the user is actually checked. The ones the CCNA names:",
            hi: "**EAP** (Extensible Authentication Protocol) ek framework hai; user asal mein kaise check hoga, yeh **EAP method** decide karta hai. CCNA mein yeh naam aate hain:",
          },
        },
        {
          type: "table",
          columns: [{ en: "EAP method", hi: "EAP method" }, { en: "How it works", hi: "Kaise kaam karta hai" }, { en: "Certificates needed", hi: "Certificates kahan chahiye" }],
          rows: [
            ["LEAP", { en: "Cisco's early username and password method; weak, do not use", hi: "Cisco ka purana username-password method; kamzor hai, use mat karo" }, { en: "None", hi: "Kahin nahi" }],
            ["EAP-FAST", { en: "Cisco method: a PAC (Protected Access Credential) builds a TLS tunnel, then the user logs in inside it", hi: "Cisco method: PAC (Protected Access Credential) se TLS tunnel banta hai, phir user uske andar login karta hai" }, { en: "None required", hi: "Zaroori nahi" }],
            ["PEAP", { en: "The server's certificate builds a TLS tunnel; the username and password are checked inside it", hi: "Server ke certificate se TLS tunnel banta hai; username aur password uske andar check hote hain" }, { en: "Server only", hi: "Sirf server par" }],
            ["EAP-TLS", { en: "Client and server prove themselves with certificates; no password at all", hi: "Client aur server dono certificates se khud ko prove karte hain; password hota hi nahi" }, { en: "Server and every client", hi: "Server aur har client par" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Where the WLC fits", hi: "WLC kahan fit hota hai" },
          text: {
            en: "The animation uses a single AP so the roles stay clear. In the controller-based network from lessons 2.8 and 2.9, WLC1 is the authenticator and the RADIUS client: the AP tunnels the EAPOL frames to WLC1 over CAPWAP, and ISE1 is configured with WLC1's address and a shared secret.",
            hi: "Animation mein ek hi AP hai taaki roles saaf rahein. Lesson 2.8 aur 2.9 wale controller-based network mein WLC1 authenticator aur RADIUS client hota hai: AP EAPOL frames ko CAPWAP se WLC1 tak tunnel karta hai, aur ISE1 par WLC1 ka address aur shared secret configure hota hai.",
          },
        },
      ],
    },
    {
      id: "four-way-handshake",
      heading: { en: "The WPA2 4-way handshake", hi: "WPA2 ka 4-way handshake" },
      blocks: [
        {
          type: "p",
          text: {
            en: "After association (and after 802.1X, in Enterprise mode), the client and the AP both hold the same PMK. They never encrypt frames with it directly. Instead, four EAPOL-Key messages create fresh keys for this session, and prove that both sides have the PMK without ever sending it.",
            hi: "Association ke baad (aur Enterprise mode mein 802.1X ke baad), client aur AP dono ke paas same PMK hota hai. Isse seedha frames encrypt nahi hote. Iske bajaye chaar EAPOL-Key messages is session ke liye fresh keys banate hain, aur bina PMK bheje prove karte hain ki dono ke paas woh hai.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "**Message 1, AP to client: ANonce.** A random number from the AP, with no MIC. The client picks its own random **SNonce** and computes the **PTK** from five inputs: PMK, ANonce, SNonce, the AP's MAC and its own MAC.",
              hi: "**Message 1, AP se client: ANonce.** AP ka random number, bina MIC ke. Client apna random **SNonce** chunta hai aur paanch inputs se **PTK** compute karta hai: PMK, ANonce, SNonce, AP ka MAC aur apna MAC.",
            },
            {
              en: "**Message 2, client to AP: SNonce + MIC.** The AP now computes the same PTK and checks the MIC. A match proves the client has the right PMK. A wrong passphrase fails here.",
              hi: "**Message 2, client se AP: SNonce + MIC.** Ab AP wahi PTK compute karta hai aur MIC check karta hai. Match hua matlab client ke paas sahi PMK hai. Galat passphrase yahin fail hota hai.",
            },
            {
              en: "**Message 3, AP to client: GTK + MIC.** The AP's MIC proves the AP has the PMK too. It carries the **GTK**, the group key for broadcast and multicast, encrypted, and tells the client to install its keys.",
              hi: "**Message 3, AP se client: GTK + MIC.** AP ka MIC prove karta hai ki PMK AP ke paas bhi hai. Isme **GTK**, yaani broadcast aur multicast ki group key, encrypted hoti hai, aur client ko keys install karne ko kaha jaata hai.",
            },
            {
              en: "**Message 4, client to AP: ACK + MIC.** Both sides install their keys, the AP opens the port, and encrypted data can flow.",
              hi: "**Message 4, client se AP: ACK + MIC.** Dono taraf keys install hoti hain, AP port khol deta hai, aur encrypted data chalne lagta hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "The keys, from the top down", hi: "Keys, upar se neeche" },
          columns: [{ en: "Key", hi: "Key" }, { en: "Where it comes from", hi: "Kahan se aati hai" }, { en: "Used for", hi: "Kis kaam aati hai" }],
          rows: [
            ["PMK", { en: "Passphrase + SSID (PSK), SAE (WPA3-Personal) or the EAP login (Enterprise)", hi: "Passphrase + SSID (PSK), SAE (WPA3-Personal) ya EAP login (Enterprise)" }, { en: "Input to the 4-way handshake only", hi: "Sirf 4-way handshake ka input" }],
            ["PTK", { en: "PMK + ANonce + SNonce + both MACs", hi: "PMK + ANonce + SNonce + dono MACs" }, { en: "Split into KCK, KEK and TK", hi: "KCK, KEK aur TK mein bant jaati hai" }],
            ["KCK", { en: "Part of the PTK", hi: "PTK ka hissa" }, { en: "Calculating the MIC on handshake messages", hi: "Handshake messages ka MIC calculate karna" }],
            ["KEK", { en: "Part of the PTK", hi: "PTK ka hissa" }, { en: "Encrypting the GTK in message 3", hi: "Message 3 mein GTK encrypt karna" }],
            ["TK", { en: "Part of the PTK", hi: "PTK ka hissa" }, { en: "Encrypting this client's unicast frames with AES-CCMP", hi: "Is client ke unicast frames ko AES-CCMP se encrypt karna" }],
            ["GTK", { en: "Chosen by the AP, sent in message 3", hi: "AP chunta hai, message 3 mein bhejta hai" }, { en: "Broadcast and multicast frames, shared by all clients of the AP", hi: "Broadcast aur multicast frames, AP ke saare clients ke beech shared" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "How deep the exam goes", hi: "Exam kitna deep jaata hai" },
          text: {
            en: "The CCNA tests what the handshake achieves: the PMK is never sent, both sides prove they hold it, and the PTK is unique per client and per session because the nonces and MAC addresses differ. So two users on the same WPA2-PSK SSID still use different encryption keys. The message order (ANonce; SNonce + MIC; GTK + MIC; ACK) is a little beyond the exam topics, but it explains the offline attack below.",
            hi: "CCNA yeh test karta hai ki handshake kya achieve karta hai: PMK kabhi bheja nahi jaata, dono side prove karte hain ki PMK unke paas hai, aur PTK har client aur har session ke liye unique hota hai kyunki nonces aur MAC addresses alag hote hain. Isliye same WPA2-PSK SSID par do users bhi alag encryption keys use karte hain. Message order (ANonce; SNonce + MIC; GTK + MIC; ACK) exam topics se thoda aage hai, lekin neeche wala offline attack isi se samajh aata hai.",
          },
        },
      ],
    },
    {
      id: "offline-cracking",
      heading: { en: "Why a weak WPA2 passphrase falls offline", hi: "Kamzor WPA2 passphrase offline kyun toot jaata hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Look at what crosses the air unencrypted in messages 1 and 2: both nonces, both MAC addresses and a MIC. The SSID is in every beacon. The only thing missing is the passphrase, and the MIC is a way to test any guess.",
            hi: "Dekho message 1 aur 2 mein bina encryption ke kya jaata hai: dono nonces, dono MAC addresses aur ek MIC. SSID har beacon mein hota hai. Sirf passphrase missing hai, aur MIC se kisi bhi guess ko test kiya ja sakta hai.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "The attacker sits in range and captures a handshake. To avoid waiting, they can send forged deauthentication frames so a client disconnects and immediately reconnects.",
              hi: "Attacker range mein baith kar ek handshake capture karta hai. Wait na karna pade, isliye woh fake deauthentication frames bhej sakta hai taaki client disconnect ho kar turant reconnect kare.",
            },
            {
              en: "At home, offline, a cracking tool takes a guess, computes PMK, then PTK, then the MIC, and compares it with the captured MIC.",
              hi: "Ghar par, offline, cracking tool ek guess leta hai, usse PMK, phir PTK, phir MIC compute karta hai, aur captured MIC se compare karta hai.",
            },
            {
              en: "It repeats this for millions of dictionary words and common patterns. The AP never sees a single attempt, so it cannot lock anyone out.",
              hi: "Yahi kaam lakhon dictionary words aur common patterns ke liye repeat hota hai. AP ko ek bhi attempt dikhta nahi, isliye woh kisi ko lock out bhi nahi kar sakta.",
            },
          ],
        },
        {
          type: "p",
          text: {
            en: "A passphrase like `Office@2024` falls quickly. A long random one, say 20 or more random characters, does not finish in any useful time. And once someone knows the passphrase, they can also decrypt traffic of other clients whose handshakes they captured, because every PTK on a PSK network starts from the same PMK.",
            hi: "`Office@2024` jaisa passphrase jaldi toot jaata hai. Lamba random passphrase, maan lo 20 ya usse zyada random characters, practically crack hi nahi hota. Aur jab kisi ko passphrase pata ho, toh woh un doosre clients ka traffic bhi decrypt kar sakta hai jinke handshakes usne capture kiye, kyunki PSK network par har PTK same PMK se shuru hota hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The encryption is not what breaks", hi: "Encryption nahi tootta" },
          text: {
            en: "Nobody is breaking AES here. The attack guesses the passphrase. That is why the fixes are a long random PSK, Enterprise mode with per-user credentials, or WPA3-Personal with SAE.",
            hi: "Yahan koi AES nahi tod raha. Attack passphrase guess karta hai. Isliye solution hain: lamba random PSK, per-user credentials wala Enterprise mode, ya SAE wala WPA3-Personal.",
          },
        },
      ],
    },
    {
      id: "wpa3",
      heading: { en: "What WPA3 changes", hi: "WPA3 kya badalta hai" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**SAE (Simultaneous Authentication of Equals)** replaces the PSK way of making the PMK in WPA3-Personal. Client and AP run a key exchange, carried in the 802.11 Authentication frames in place of Open System authentication, that proves both know the passphrase without revealing anything an attacker can test offline. Each guess needs a live exchange with the AP. The 4-way handshake still follows, using the PMK that SAE produced.",
              hi: "**SAE (Simultaneous Authentication of Equals)** WPA3-Personal mein PMK banane ka PSK wala tareeka replace karta hai. Client aur AP ek key exchange chalate hain, jo Open System authentication ki jagah 802.11 Authentication frames mein hi hota hai, aur yeh prove karta hai ki dono ko passphrase pata hai, lekin attacker ko offline test karne laayak kuch nahi milta. Har guess ke liye AP ke saath live exchange chahiye. Uske baad 4-way handshake phir bhi chalta hai, SAE se bane PMK ke saath.",
            },
            {
              en: "**Forward secrecy**: every SAE exchange produces a new random PMK, so learning the passphrase later does not decrypt traffic captured earlier.",
              hi: "**Forward secrecy**: har SAE exchange ek naya random PMK banata hai, isliye baad mein passphrase pata chal bhi jaaye toh pehle capture kiya gaya traffic decrypt nahi hota.",
            },
            {
              en: "**PMF (Protected Management Frames, 802.11w)** is mandatory. Deauthentication and disassociation frames are protected, so the forged-deauth trick from the last section stops working. In WPA2, PMF is optional.",
              hi: "**PMF (Protected Management Frames, 802.11w)** mandatory hai. Deauthentication aur disassociation frames protected hote hain, isliye pichhle section wala fake-deauth trick kaam nahi karta. WPA2 mein PMF optional hai.",
            },
            {
              en: "**WPA3-Enterprise** keeps 802.1X and adds an optional **192-bit mode** for high-security networks, using **AES-GCMP-256** and stronger hashing. Standard WPA3-Personal and WPA3-Enterprise keep AES-CCMP-128 as their baseline cipher.",
              hi: "**WPA3-Enterprise** 802.1X rakhta hai aur high-security networks ke liye optional **192-bit mode** jodta hai, jisme **AES-GCMP-256** aur stronger hashing hoti hai. Normal WPA3-Personal aur WPA3-Enterprise ka baseline cipher abhi bhi AES-CCMP-128 hai.",
            },
            {
              en: "**Transition mode** (WPA2/WPA3 on one SSID) lets old clients keep using WPA2-PSK while new ones use SAE. The WPA2 clients keep the WPA2 weaknesses.",
              hi: "**Transition mode** (ek SSID par WPA2/WPA3) mein purane clients WPA2-PSK use karte rehte hain aur naye clients SAE. WPA2 clients ki kamzoriyan WPA2 wali hi rehti hain.",
            },
          ],
        },
      ],
    },
    {
      id: "configure-wpa2-psk",
      heading: { en: "Configure and verify WPA2-PSK", hi: "WPA2-PSK configure aur verify karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Exam topic 5.10 asks you to configure a WLAN with WPA2-PSK in the WLC GUI. You built it in lesson 2.9 for SSID CORP; here is what each setting maps to in this lesson.",
            hi: "Exam topic 5.10 kehta hai ki WLC GUI mein WPA2-PSK ke saath WLAN configure karo. Yeh tumne lesson 2.9 mein SSID CORP ke liye banaya tha; yahan dekho ki har setting is lesson ki kis cheez se judi hai.",
          },
        },
        {
          type: "table",
          caption: { en: "WLANs > Edit CORP > Security > Layer 2 (AireOS)", hi: "AireOS GUI mein WLANs > Edit CORP > Security > Layer 2" },
          columns: [{ en: "Setting", hi: "Setting" }, { en: "Value", hi: "Value" }, { en: "What it means", hi: "Matlab" }],
          rows: [
            ["Layer 2 Security", "WPA+WPA2", { en: "Use the WPA family, not Open or WEP", hi: "WPA family use karo, Open ya WEP nahi" }],
            ["WPA2 Policy", { en: "Ticked (WPA Policy unticked)", hi: "Ticked (WPA Policy unticked)" }, { en: "Advertise WPA2 in the RSN element", hi: "RSN element mein WPA2 advertise karo" }],
            ["WPA2 Encryption", { en: "AES (TKIP unticked)", hi: "AES (TKIP unticked)" }, "CCMP"],
            ["Authentication Key Management", { en: "PSK (802.1X unticked)", hi: "PSK (802.1X unticked)" }, { en: "Personal mode: the PMK comes from the passphrase", hi: "Personal mode: PMK passphrase se banta hai" }],
            ["PSK Format", { en: "ASCII, 8-63 characters", hi: "ASCII, 8-63 characters" }, { en: "The passphrase every client types", hi: "Woh passphrase jo har client type karta hai" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "Leaving 802.1X ticked (the default) makes the WLAN WPA2-Enterprise, and clients will be asked for a username that no RADIUS server is ready to check. Newer AireOS releases also show a WPA3 policy and SAE under the same tab; the idea is the same.",
            hi: "802.1X ticked chhod diya (jo default hai) toh WLAN WPA2-Enterprise ban jaata hai, aur clients se username maanga jaayega jise check karne ke liye koi RADIUS server ready nahi hai. Naye AireOS releases isi tab mein WPA3 policy aur SAE bhi dikhate hain; concept same hai.",
          },
        },
        {
          type: "cli",
          title: { en: "Verify from a Windows client", hi: "Windows client se verify karo" },
          lines: [
            { prompt: "C:\\>", cmd: "netsh wlan show interfaces" },
            { out: "    State                  : connected" },
            { out: "    SSID                   : CORP" },
            { out: "    BSSID                  : 00:a2:ee:00:01:01" },
            {
              out: "    Authentication         : WPA2-Personal",
              comment: { en: "WPA2 with PSK key management", hi: "WPA2, PSK key management ke saath" },
            },
            {
              out: "    Cipher                 : CCMP",
              comment: { en: "AES-CCMP; a TKIP network would show TKIP here", hi: "AES-CCMP; TKIP network hota toh yahan TKIP dikhta" },
            },
          ],
          note: {
            en: "On a STAFF-style 802.1X WLAN the same line reads `WPA2-Enterprise`, and on an SAE network `WPA3-Personal`.",
            hi: "STAFF jaise 802.1X WLAN par yahi line `WPA2-Enterprise` dikhati hai, aur SAE network par `WPA3-Personal`.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "PSK", def: { en: "Pre-shared key: one passphrase (8-63 characters) shared by every client in WPA2-Personal.", hi: "Pre-shared key: ek passphrase (8-63 characters) jo WPA2-Personal mein har client share karta hai." } },
    { term: "SAE", def: { en: "Simultaneous Authentication of Equals: WPA3-Personal's password exchange, which resists offline guessing and gives forward secrecy.", hi: "Simultaneous Authentication of Equals: WPA3-Personal ka password exchange, jo offline guessing se bachata hai aur forward secrecy deta hai." } },
    { term: "802.1X", def: { en: "Port-based access control: a supplicant, an authenticator and an authentication server, with EAP carrying the login.", hi: "Port-based access control: supplicant, authenticator aur authentication server, jisme login EAP ke through jaata hai." } },
    { term: "EAP", def: { en: "Extensible Authentication Protocol: the framework that carries methods such as PEAP, EAP-TLS and EAP-FAST.", hi: "Extensible Authentication Protocol: woh framework jo PEAP, EAP-TLS aur EAP-FAST jaise methods ko carry karta hai." } },
    { term: "PMK", def: { en: "Pairwise Master Key: the shared secret, from the PSK, SAE or an EAP login, that the 4-way handshake starts from.", hi: "Pairwise Master Key: woh shared secret, PSK, SAE ya EAP login se, jisse 4-way handshake shuru hota hai." } },
    { term: "PTK", def: { en: "Pairwise Transient Key: per-client, per-session keys (KCK, KEK, TK) derived in the 4-way handshake.", hi: "Pairwise Transient Key: har client aur har session ki keys (KCK, KEK, TK) jo 4-way handshake mein banti hain." } },
    { term: "GTK", def: { en: "Group Temporal Key: the key an AP shares with all its clients for broadcast and multicast frames.", hi: "Group Temporal Key: woh key jo AP apne saare clients ke saath broadcast aur multicast frames ke liye share karta hai." } },
    { term: "PMF", def: { en: "Protected Management Frames (802.11w): protects deauthentication and disassociation frames from forgery; mandatory in WPA3.", hi: "Protected Management Frames (802.11w): deauthentication aur disassociation frames ko forgery se bachata hai; WPA3 mein mandatory." } },
  ],
  commands: [
    { cmd: "netsh wlan show interfaces", mode: "Windows terminal", does: { en: "Show the connected SSID, BSSID, authentication type and cipher", hi: "Connected SSID, BSSID, authentication type aur cipher dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Treating 802.11 Open System authentication as a security check. It accepts every client; the real check is the 4-way handshake (and 802.1X in Enterprise mode). WPA3-Personal replaces it with SAE.",
      hi: "802.11 Open System authentication ko security check samajhna. Yeh har client ko accept karta hai; asli check 4-way handshake hai (aur Enterprise mode mein 802.1X). WPA3-Personal mein iski jagah SAE hota hai.",
    },
    {
      en: "Thinking the passphrase or the PMK is sent during the handshake. Neither ever crosses the air; the MICs prove that both sides know it.",
      hi: "Yeh sochna ki handshake mein passphrase ya PMK bheja jaata hai. Dono kabhi hawa mein nahi jaate; MICs prove karte hain ki dono side ko pata hai.",
    },
    {
      en: "Pairing the wrong protocols: TKIP belongs to WPA, CCMP to WPA2, GCMP to WPA3. WEP and TKIP use RC4; CCMP and GCMP use AES.",
      hi: "Galat protocols jodna: TKIP WPA ka hai, CCMP WPA2 ka, GCMP WPA3 ka. WEP aur TKIP RC4 use karte hain; CCMP aur GCMP AES.",
    },
    {
      en: "Believing that \"WPA2 is uncrackable\" protects a short passphrase. A captured handshake lets an attacker guess offline; use a long random PSK, Enterprise mode, or WPA3 SAE.",
      hi: "Yeh maanna ki \"WPA2 crack nahi hota\" toh chhota passphrase bhi safe hai. Captured handshake se attacker offline guess kar sakta hai; lamba random PSK, Enterprise mode, ya WPA3 SAE use karo.",
    },
    {
      en: "Saying the AP checks the user's password in WPA2-Enterprise. The AP or WLC only relays EAP; the RADIUS server decides.",
      hi: "Yeh kehna ki WPA2-Enterprise mein AP user ka password check karta hai. AP ya WLC sirf EAP relay karta hai; faisla RADIUS server karta hai.",
    },
    {
      en: "Treating the 192-bit mode (GCMP-256) as part of WPA3-Personal. It is a WPA3-Enterprise option; WPA3-Personal is built on SAE with AES-CCMP.",
      hi: "192-bit mode (GCMP-256) ko WPA3-Personal ka hissa samajhna. Yeh WPA3-Enterprise ka option hai; WPA3-Personal SAE aur AES-CCMP par bana hai.",
    },
  ],
  recap: [
    { en: "Three jobs: authentication, encryption, integrity (MIC). WEP (RC4) is broken, WPA (TKIP) is deprecated, WPA2 uses AES-CCMP, WPA3 adds SAE, PMF and GCMP-256 in 192-bit mode.", hi: "Teen kaam: authentication, encryption, integrity (MIC). WEP (RC4) toota hua hai, WPA (TKIP) deprecated hai, WPA2 AES-CCMP use karta hai, WPA3 SAE, PMF aur 192-bit mode mein GCMP-256 jodta hai." },
    { en: "Personal: shared passphrase (PSK, or SAE in WPA3). Enterprise: 802.1X with EAP to a RADIUS server, one login per user.", hi: "Personal: shared passphrase (PSK, ya WPA3 mein SAE). Enterprise: 802.1X, EAP ke saath RADIUS server tak, har user ka apna login." },
    { en: "802.1X roles: supplicant (client), authenticator (AP or WLC), authentication server (RADIUS). EAP-TLS needs certificates on both sides; PEAP only on the server.", hi: "802.1X roles: supplicant (client), authenticator (AP ya WLC), authentication server (RADIUS). EAP-TLS mein dono taraf certificates chahiye; PEAP mein sirf server par." },
    { en: "4-way handshake: ANonce; SNonce + MIC; GTK + MIC; ACK. PMK + nonces + MACs = PTK (KCK, KEK, TK); GTK for broadcast and multicast.", hi: "4-way handshake: ANonce; SNonce + MIC; GTK + MIC; ACK. PMK + nonces + MACs = PTK (KCK, KEK, TK); broadcast aur multicast ke liye GTK." },
    { en: "A captured WPA2-PSK handshake allows offline guessing; long random passphrases, Enterprise or WPA3 SAE defeat it.", hi: "Captured WPA2-PSK handshake se offline guessing ho sakti hai; lamba random passphrase, Enterprise ya WPA3 SAE ise rokte hain." },
    { en: "WPA2-PSK on a WLC: WPA+WPA2, WPA2 Policy, AES, PSK instead of 802.1X, 8-63 character ASCII key.", hi: "WLC par WPA2-PSK: WPA+WPA2, WPA2 Policy, AES, 802.1X ki jagah PSK, 8-63 character ki ASCII key." },
  ],
  quiz: [
    {
      q: { en: "Which pairing of wireless security standard and encryption protocol is correct?", hi: "Wireless security standard aur encryption protocol ki kaunsi jodi sahi hai?" },
      options: [
        { en: "WEP with AES", hi: "WEP ke saath AES" },
        { en: "WPA with TKIP", hi: "WPA ke saath TKIP" },
        { en: "WPA2 with RC4", hi: "WPA2 ke saath RC4" },
        { en: "WPA3 with TKIP", hi: "WPA3 ke saath TKIP" },
      ],
      answer: 1,
      explain: {
        en: "WPA introduced TKIP as an interim fix that could run on WEP-era hardware. WEP uses RC4 (not AES), WPA2 uses AES-CCMP (not RC4), and WPA3 does not allow TKIP at all.",
        hi: "WPA ne TKIP ko temporary fix ki tarah laaya tha jo WEP wale hardware par chal sake. WEP RC4 use karta hai (AES nahi), WPA2 AES-CCMP use karta hai (RC4 nahi), aur WPA3 mein TKIP allowed hi nahi hai.",
      },
      kind: "concept",
    },
    {
      q: { en: "What does message 3 of the WPA2 4-way handshake carry?", hi: "WPA2 4-way handshake ke message 3 mein kya hota hai?" },
      options: [
        { en: "The ANonce only, with no MIC", hi: "Sirf ANonce, bina MIC ke" },
        { en: "The SNonce and a MIC", hi: "SNonce aur ek MIC" },
        { en: "The PMK, encrypted with the passphrase", hi: "PMK, passphrase se encrypted" },
        { en: "The GTK encrypted with the KEK, and a MIC", hi: "KEK se encrypted GTK, aur ek MIC" },
      ],
      answer: 3,
      explain: {
        en: "Message 3 goes from the AP to the client. Its MIC proves the AP holds the PMK, and it delivers the group key (GTK) encrypted with the KEK. The ANonce is message 1, the SNonce is message 2, and the PMK is never sent in the handshake.",
        hi: "Message 3 AP se client ko jaata hai. Iska MIC prove karta hai ki PMK AP ke paas hai, aur yeh KEK se encrypted group key (GTK) deliver karta hai. ANonce message 1 mein hota hai, SNonce message 2 mein, aur PMK handshake mein kabhi bheja hi nahi jaata.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An attacker in the car park captures a client's 4-way handshake on a WPA2-PSK network with the passphrase `Office@2024`. What can the attacker do next?",
        hi: "Parking mein baitha attacker `Office@2024` passphrase wale WPA2-PSK network par ek client ka 4-way handshake capture kar leta hai. Attacker aage kya kar sakta hai?",
      },
      options: [
        { en: "Guess passphrases offline, testing each guess against the captured MIC, without contacting the AP again", hi: "Offline passphrases guess karna, har guess ko captured MIC se test karke, AP se dobara contact kiye bina" },
        { en: "Read the passphrase directly from message 2", hi: "Message 2 se seedha passphrase padh lena" },
        { en: "Nothing, because the handshake messages are encrypted with AES", hi: "Kuch nahi, kyunki handshake messages AES se encrypted hote hain" },
        { en: "Decrypt traffic at once, because the PMK is sent in message 1", hi: "Turant traffic decrypt karna, kyunki PMK message 1 mein bheja jaata hai" },
      ],
      answer: 0,
      explain: {
        en: "The nonces, MAC addresses and MIC travel unencrypted, and the SSID is public. For each guess the attacker computes PMK, PTK and MIC and compares. A short dictionary-style passphrase falls quickly. The passphrase and PMK are never sent, so they cannot be read directly.",
        hi: "Nonces, MAC addresses aur MIC bina encryption ke jaate hain, aur SSID public hai. Har guess ke liye attacker PMK, PTK aur MIC compute karke compare karta hai. Chhota dictionary jaisa passphrase jaldi toot jaata hai. Passphrase aur PMK kabhi bheje nahi jaate, isliye unhe seedha padha nahi ja sakta.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A company with 300 staff wants each employee to log in to the WLAN with their own credentials, and to remove one person's access without affecting anyone else. What should it use?",
        hi: "300 staff wali company chahti hai ki har employee apne credentials se WLAN par login kare, aur kisi ek ka access hataane par baaki kisi par asar na pade. Use kya use karna chahiye?",
      },
      options: [
        { en: "WPA2-Personal with a 30-character passphrase", hi: "30-character passphrase wala WPA2-Personal" },
        { en: "WPA3-Personal with SAE", hi: "SAE wala WPA3-Personal" },
        { en: "WPA2- or WPA3-Enterprise with 802.1X and a RADIUS server", hi: "802.1X aur RADIUS server ke saath WPA2- ya WPA3-Enterprise" },
        { en: "An open SSID with MAC address filtering", hi: "MAC address filtering wala open SSID" },
      ],
      answer: 2,
      explain: {
        en: "Only Enterprise mode gives each user their own login, checked by RADIUS, so one account can be disabled. Both Personal options use one shared passphrase that must be changed everywhere when someone leaves. MAC filtering is easily bypassed by copying an allowed MAC, and an open SSID encrypts nothing.",
        hi: "Sirf Enterprise mode mein har user ka apna login hota hai jise RADIUS check karta hai, isliye ek account disable kiya ja sakta hai. Dono Personal options mein ek shared passphrase hota hai jo kisi ke jaane par har jagah badalna padta hai. MAC filtering ko allowed MAC copy karke aasani se bypass kiya ja sakta hai, aur open SSID kuch encrypt hi nahi karta.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Which WPA3 feature stops an attacker from cracking the passphrase offline from captured frames?", hi: "WPA3 ka kaunsa feature attacker ko captured frames se passphrase offline crack karne se rokta hai?" },
      options: [
        { en: "PMF (802.11w)", hi: "PMF (802.11w)" },
        { en: "SAE", hi: "SAE" },
        { en: "GCMP-256", hi: "GCMP-256" },
        { en: "The GTK", hi: "GTK" },
      ],
      answer: 1,
      explain: {
        en: "SAE proves both sides know the passphrase without exposing anything that can be tested offline, so every guess needs a live exchange with the AP. PMF protects management frames such as deauthentication, which helps but does not stop cracking of a captured exchange. GCMP-256 is an encryption protocol, and the GTK is the group key.",
        hi: "SAE prove karta hai ki dono side ko passphrase pata hai, lekin offline test karne laayak kuch expose nahi hota, isliye har guess ke liye AP ke saath live exchange chahiye. PMF deauthentication jaise management frames ko protect karta hai, jo madad karta hai lekin captured exchange ki cracking nahi rokta. GCMP-256 encryption protocol hai, aur GTK group key hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "`netsh wlan show interfaces` on a laptop shows `Authentication : WPA2-Personal` and `Cipher : CCMP`. Which statement is correct?",
        hi: "Laptop par `netsh wlan show interfaces` mein `Authentication : WPA2-Personal` aur `Cipher : CCMP` dikhta hai. Kaunsa statement sahi hai?",
      },
      options: [
        { en: "The laptop logged in with its own username through a RADIUS server", hi: "Laptop ne RADIUS server ke through apne username se login kiya" },
        { en: "The WLAN uses TKIP for backward compatibility", hi: "WLAN backward compatibility ke liye TKIP use karta hai" },
        { en: "The WLAN uses SAE and Protected Management Frames", hi: "WLAN SAE aur Protected Management Frames use karta hai" },
        { en: "The laptop used a shared passphrase, and its frames are encrypted with AES", hi: "Laptop ne shared passphrase use kiya, aur uske frames AES se encrypted hain" },
      ],
      answer: 3,
      explain: {
        en: "WPA2-Personal means PSK key management, a shared passphrase. CCMP is the AES-based protocol. A RADIUS login would show WPA2-Enterprise, TKIP would show as the cipher TKIP, and SAE would show WPA3-Personal.",
        hi: "WPA2-Personal ka matlab PSK key management, yaani shared passphrase. CCMP AES-based protocol hai. RADIUS login hota toh WPA2-Enterprise dikhta, TKIP hota toh cipher TKIP dikhta, aur SAE hota toh WPA3-Personal dikhta.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "wHXKo9So5y8",
      title: "Free CCNA | Wireless Security | Day 57",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The CCNA view of authentication, encryption and integrity: WEP, WPA, WPA2, WPA3, 802.1X and the EAP methods.", hi: "Authentication, encryption aur integrity ka CCNA view: WEP, WPA, WPA2, WPA3, 802.1X aur EAP methods." },
    },
    {
      id: "9M8kVYFhMDw",
      title: "The 4-Way Handshake (Marcus Burton, CWNP)",
      channel: "CWNPTV",
      lang: "en",
      note: { en: "A short, precise walk through the four EAPOL-Key messages and the keys they create.", hi: "Chaar EAPOL-Key messages aur unse banne wali keys ka chhota, precise walkthrough." },
    },
    {
      id: "Dk7FTQYJ3Zw",
      title: "122. Free CCNA (NEW) | Wireless Networking - Securing WiFi | CCNA 200-301 Complete Course in Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi explanation of the wireless security protocols, Personal vs Enterprise, and 802.1X.", hi: "Wireless security protocols, Personal vs Enterprise aur 802.1X ka Hindi mein explanation." },
    },
  ],
  lab: {
    title: { en: "WPA2-Personal, then WPA2-Enterprise, in Packet Tracer", hi: "Packet Tracer mein pehle WPA2-Personal, phir WPA2-Enterprise" },
    steps: [
      {
        en: "Build a wireless router with its LAN address set to 10.1.30.1/24 (or reuse the WLC lab from lesson 2.9), two laptops with wireless NICs, and a server at 10.1.30.20 on the wired side.",
        hi: "Ek wireless router lagao jiska LAN address 10.1.30.1/24 ho (ya lesson 2.9 wala WLC lab reuse karo), wireless NIC wale do laptops, aur wired side par 10.1.30.20 wala ek server.",
      },
      {
        en: "Set SSID CORP to WPA2-Personal with AES and a passphrase. Join Laptop1 with the right passphrase and Laptop2 with a wrong one. Only Laptop1 gets an IP address.",
        hi: "SSID CORP ko AES aur passphrase ke saath WPA2-Personal par set karo. Laptop1 ko sahi passphrase se aur Laptop2 ko galat se join karao. Sirf Laptop1 ko IP address milta hai.",
      },
      {
        en: "On the server, open Services > AAA: add the wireless router (or WLC) as a RADIUS client with a shared secret, and create users alice and bob.",
        hi: "Server par Services > AAA kholo: wireless router (ya WLC) ko shared secret ke saath RADIUS client ki tarah add karo, aur users alice aur bob banao.",
      },
      {
        en: "Change the SSID to WPA2-Enterprise, pointing at RADIUS server 10.1.30.20 with the same secret. On each laptop's wireless settings choose the WPA2 802.1X (Enterprise) option and log in as alice and bob.",
        hi: "SSID ko WPA2-Enterprise par badlo, RADIUS server 10.1.30.20 aur same secret ke saath. Har laptop ki wireless settings mein WPA2 802.1X (Enterprise) option chuno aur alice aur bob se login karo.",
      },
      {
        en: "Delete bob on the server and reconnect both laptops. alice still joins; bob does not. That is the per-user control a PSK cannot give you.",
        hi: "Server par bob ko delete karo aur dono laptops reconnect karo. alice abhi bhi join hoti hai; bob nahi. Yahi per-user control hai jo PSK nahi de sakta.",
      },
      {
        en: "On a real Windows laptop, run `netsh wlan show interfaces` on your home or office Wi-Fi and read the Authentication and Cipher lines.",
        hi: "Asli Windows laptop par apne ghar ya office ke Wi-Fi par `netsh wlan show interfaces` chalao aur Authentication aur Cipher lines padho.",
      },
    ],
  },
};

export default lesson;
