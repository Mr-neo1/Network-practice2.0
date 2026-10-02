import type { SequenceScene } from "../types.ts";

// Colours: gray = 802.11 management frames, purple = 802.1X / EAP / RADIUS,
// blue = 4-way handshake (EAPOL-Key), green = encrypted user data.

const scene: SequenceScene = {
  kind: "sequence",
  id: "wireless-security",
  title: { en: "Joining a WPA2-Enterprise WLAN: associate, 802.1X, then the 4-way handshake", hi: "WPA2-Enterprise WLAN join karna: associate, 802.1X, phir 4-way handshake" },
  actors: [
    { id: "laptop", label: "Laptop1", kind: "laptop", sub: "0050.56aa.0010" },
    { id: "ap", label: "AP1", kind: "ap", sub: "BSSID 00a2.ee00.0102" },
    { id: "ise", label: "ISE1 (RADIUS)", kind: "server", sub: "10.1.30.20" },
  ],
  steps: [
    {
      title: { en: "The beacon says what security STAFF needs", hi: "Beacon batata hai STAFF ko kaunsi security chahiye" },
      text: {
        en: "About ten times a second AP1 sends a beacon for SSID STAFF. Its RSN information element lists the rules: WPA2, AES-CCMP encryption, and key management 802.1X, which means Enterprise. A WPA2-Personal SSID would say PSK here instead.",
        hi: "AP1 lagbhag second mein das baar SSID STAFF ka beacon bhejta hai. Uske RSN information element mein rules likhe hote hain: WPA2, AES-CCMP encryption, aur key management 802.1X, yaani Enterprise. WPA2-Personal SSID hota toh yahan PSK likha hota.",
      },
      messages: [{ from: "ap", to: "laptop", label: "Beacon: SSID STAFF", detail: "RSN: WPA2 · AES-CCMP · AKM 802.1X", tone: "gray" }],
    },
    {
      title: { en: "Open System authentication checks nothing", hi: "Open System authentication kuch check nahi karta" },
      text: {
        en: "Laptop1 sends an 802.11 Authentication frame using Open System, and AP1 answers success. Despite the name, nothing is verified here: no password, no user. It is a leftover from the original 802.11 standard that every WPA2 network still uses; WPA3-Personal runs its SAE exchange in these same frames instead.",
        hi: "Laptop1 Open System wala 802.11 Authentication frame bhejta hai, aur AP1 success bol deta hai. Naam authentication hai, lekin yahan kuch verify nahi hota: na password, na user. Yeh original 802.11 standard ka bacha hua step hai jo har WPA2 network aaj bhi use karta hai; WPA3-Personal inhi frames mein apna SAE exchange chalata hai.",
      },
      messages: [
        { from: "laptop", to: "ap", label: "Authentication (Open)", detail: "802.11 auth · algorithm 0", tone: "gray" },
        { from: "ap", to: "laptop", label: "Authentication: success", detail: "no credentials checked", tone: "gray", dashed: true },
      ],
    },
    {
      title: { en: "Associated, but only EAPOL may pass", hi: "Associated, lekin sirf EAPOL pass ho sakta hai" },
      text: {
        en: "Laptop1 asks to join STAFF and repeats the cipher and key management it accepts. AP1 accepts and gives it association ID 1. Laptop1 is now associated, but AP1's 802.1X port is still blocked: only EAPOL frames (EtherType 0x888E) get through, so no DHCP, ARP or other data yet.",
        hi: "Laptop1 STAFF join karne ki request bhejta hai aur bata deta hai ki woh kaunsa cipher aur key management use karega. AP1 accept karke use association ID 1 deta hai. Laptop1 ab associated hai, lekin AP1 ka 802.1X port abhi bhi blocked hai: sirf EAPOL frames (EtherType 0x888E) jaate hain, isliye abhi na DHCP, na ARP, na koi aur data.",
      },
      messages: [
        { from: "laptop", to: "ap", label: "Association Request", detail: "SSID STAFF · RSN: CCMP, 802.1X", tone: "gray" },
        { from: "ap", to: "laptop", label: "Association Response", detail: "status success · AID 1", tone: "gray", dashed: true },
      ],
      note: { actor: "ap", text: "Port blocked: EAPOL only" },
    },
    {
      title: { en: "802.1X: AP1 relays EAP to the RADIUS server", hi: "802.1X: AP1 EAP ko RADIUS server tak relay karta hai" },
      text: {
        en: "AP1 is the authenticator. It asks Laptop1 (the supplicant) for an identity over EAPOL and gets back alice. AP1 does not judge it: it copies the EAP message into a RADIUS Access-Request to ISE1, the authentication server, on UDP port 1812. On a WPA2-Personal SSID this step and the next one do not happen.",
        hi: "AP1 authenticator hai. Woh Laptop1 (supplicant) se EAPOL par identity maangta hai aur jawab aata hai alice. AP1 khud kuch decide nahi karta: EAP message ko RADIUS Access-Request mein daal kar ISE1, yaani authentication server, ko UDP port 1812 par bhej deta hai. WPA2-Personal SSID par yeh step aur agla step hote hi nahi.",
      },
      messages: [
        { from: "ap", to: "laptop", label: "EAP-Request/Identity", detail: "EAPOL", tone: "purple" },
        { from: "laptop", to: "ap", label: "EAP-Response/Identity", detail: "EAPOL · identity alice", tone: "purple", dashed: true },
        { from: "ap", to: "ise", label: "RADIUS Access-Request", detail: "UDP 1812 · EAP inside", tone: "purple" },
      ],
    },
    {
      title: { en: "PEAP checks alice, and both ends get a PMK", hi: "PEAP alice ko check karta hai, dono taraf PMK banta hai" },
      text: {
        en: "Using PEAP, ISE1 sends its certificate, Laptop1 verifies it, and a TLS tunnel forms. alice's password is checked inside the tunnel. Laptop1 and ISE1 each derive the same PMK from the TLS keys. ISE1 sends the PMK to AP1 inside Access-Accept, protected by the RADIUS shared secret; the PMK never crosses the air.",
        hi: "PEAP mein ISE1 apna certificate bhejta hai, Laptop1 use verify karta hai, aur ek TLS tunnel ban jaata hai. alice ka password tunnel ke andar check hota hai. Laptop1 aur ISE1 dono TLS keys se same PMK khud derive karte hain. ISE1 PMK ko Access-Accept ke andar AP1 ko bhejta hai, RADIUS shared secret se protected; PMK kabhi hawa mein nahi jaata.",
      },
      messages: [
        { from: "laptop", to: "ise", label: "PEAP exchange (TLS)", detail: "several rounds · relayed by AP1", tone: "purple" },
        { from: "ise", to: "ap", label: "RADIUS Access-Accept", detail: "EAP-Success + PMK", tone: "purple", dashed: true },
        { from: "ap", to: "laptop", label: "EAP-Success", detail: "EAPOL", tone: "purple", dashed: true },
      ],
      note: { actor: "laptop", text: "PMK (same as AP1's)" },
    },
    {
      title: { en: "Message 1: AP1 sends its ANonce", hi: "Message 1: AP1 apna ANonce bhejta hai" },
      text: {
        en: "Both sides hold the PMK, but it is never used to encrypt frames. The 4-way handshake makes fresh keys for this session. AP1 sends a random number, the ANonce, with no MIC. Laptop1 picks its own random SNonce and now has all five inputs: PMK, ANonce, SNonce and both MAC addresses. It computes the PTK.",
        hi: "PMK dono ke paas hai, lekin usse kabhi frames encrypt nahi hote. 4-way handshake is session ke liye fresh keys banata hai. AP1 ek random number, ANonce, bhejta hai, bina MIC ke. Laptop1 apna random SNonce chunta hai, aur ab uske paas paanchon inputs hain: PMK, ANonce, SNonce aur dono MAC addresses. Woh PTK calculate kar leta hai.",
      },
      messages: [{ from: "ap", to: "laptop", label: "EAPOL-Key 1: ANonce", detail: "random from AP1 · no MIC", tone: "blue" }],
      note: { actor: "laptop", text: "PTK computed" },
    },
    {
      title: { en: "Message 2: SNonce plus a MIC", hi: "Message 2: SNonce aur saath mein MIC" },
      text: {
        en: "Laptop1 sends its SNonce with a MIC, calculated with the KCK part of its PTK. AP1 uses the SNonce to compute the same PTK and recalculates the MIC. They match, so Laptop1 must hold the right PMK. A wrong passphrase on a PSK network fails exactly here. The nonces and MIC travel unencrypted, which is what an offline cracker captures.",
        hi: "Laptop1 apna SNonce MIC ke saath bhejta hai; MIC uske PTK ke KCK part se calculate hota hai. AP1 SNonce se wahi PTK compute karta hai aur MIC dobara calculate karta hai. Dono match karte hain, matlab Laptop1 ke paas sahi PMK hai. PSK network par galat passphrase theek isi jagah fail hota hai. Nonces aur MIC bina encryption ke jaate hain, aur offline cracker yahi capture karta hai.",
      },
      messages: [{ from: "laptop", to: "ap", label: "EAPOL-Key 2: SNonce + MIC", detail: "MIC keyed with the KCK", tone: "blue", dashed: true }],
      note: { actor: "ap", text: "PTK computed · MIC valid" },
    },
    {
      title: { en: "Message 3: the GTK, encrypted", hi: "Message 3: GTK, encrypted" },
      text: {
        en: "AP1 now proves it has the PMK too, with its own MIC. It also sends the GTK, the group key every client on AP1 shares for broadcast and multicast frames. The GTK is encrypted with the KEK part of the PTK, so only Laptop1 can read it. The message tells Laptop1 to install its keys.",
        hi: "Ab AP1 apne MIC se prove karta hai ki PMK uske paas bhi hai. Saath mein GTK bhejta hai, yaani group key jo AP1 ke saare clients broadcast aur multicast frames ke liye share karte hain. GTK PTK ke KEK part se encrypted hota hai, isliye sirf Laptop1 use padh sakta hai. Message Laptop1 ko keys install karne ko kehta hai.",
      },
      messages: [{ from: "ap", to: "laptop", label: "EAPOL-Key 3: GTK + MIC", detail: "GTK encrypted with KEK · install", tone: "blue" }],
    },
    {
      title: { en: "Message 4: ACK, and the port opens", hi: "Message 4: ACK, aur port khul jaata hai" },
      text: {
        en: "Laptop1 confirms with a final MIC-protected ACK. Both sides install the TK (the encryption part of the PTK) for unicast frames, and Laptop1 installs the GTK. AP1 opens the 802.1X port for Laptop1: normal data frames are now allowed, and every one of them will be encrypted.",
        hi: "Laptop1 aakhri MIC-protected ACK se confirm karta hai. Dono taraf TK (PTK ka encryption part) unicast frames ke liye install hota hai, aur Laptop1 GTK bhi install karta hai. AP1 Laptop1 ke liye 802.1X port khol deta hai: ab normal data frames allowed hain, aur har frame encrypted jaayega.",
      },
      messages: [{ from: "laptop", to: "ap", label: "EAPOL-Key 4: ACK + MIC", detail: "keys installed", tone: "blue", dashed: true }],
      note: { actor: "ap", text: "Port open · data allowed" },
    },
    {
      title: { en: "The first data frame is encrypted", hi: "Pehla data frame encrypted jaata hai" },
      text: {
        en: "Laptop1's first data frame is usually a DHCP Discover. It is a broadcast, but Laptop1 sends it to AP1 encrypted with AES-CCMP under its own TK; only when AP1 sends broadcasts out to its clients does it use the GTK. Another client on AP1 has a different PTK, because its nonces and MAC differ, so it cannot read Laptop1's unicast traffic even on the same SSID.",
        hi: "Laptop1 ka pehla data frame aam taur par DHCP Discover hota hai. Yeh broadcast hai, lekin Laptop1 ise apne TK se AES-CCMP mein encrypt karke AP1 ko bhejta hai; GTK tab use hota hai jab AP1 apne clients ko broadcast bhejta hai. AP1 ke kisi doosre client ka PTK alag hota hai, kyunki uske nonces aur MAC alag hain, isliye same SSID par hote hue bhi woh Laptop1 ka unicast traffic nahi padh sakta.",
      },
      messages: [{ from: "laptop", to: "ap", label: "Data: DHCP Discover", detail: "AES-CCMP with Laptop1's TK", tone: "green" }],
    },
  ],
};

export default scene;
