import type { SequenceScene } from "../types.ts";

// Matches the aaa lesson: admin neha at 10.1.10.25, SW1 10.1.1.2, ISE 10.2.2.100,
// staff user rahul on SW1 Gi1/0/5 (802.1X).
// Colours: blue = user to switch, purple = TACACS+, green = permit/accept,
// red = denied, orange = accounting, teal = RADIUS.

const scene: SequenceScene = {
  kind: "sequence",
  id: "aaa",
  title: { en: "AAA: an admin login over TACACS+, then a user login over RADIUS", hi: "AAA: TACACS+ par admin login, phir RADIUS par user login" },
  actors: [
    { id: "staff", label: "Staff PC", kind: "pc", sub: "rahul · Gi1/0/5" },
    { id: "admin", label: "Admin", kind: "laptop", sub: "neha · 10.1.10.25" },
    { id: "sw1", label: "SW1", kind: "switch", sub: "10.1.1.2" },
    { id: "ise", label: "Cisco ISE", kind: "server", sub: "10.2.2.100" },
  ],
  steps: [
    {
      title: { en: "neha opens SSH to SW1", hi: "neha SW1 par SSH kholti hai" },
      text: {
        en: "Engineer neha connects from 10.1.10.25 to SW1 on TCP 22 and types her username and password. SW1 has no local account for her. Because of `aaa authentication login default group tacacs+ local`, it will ask the TACACS+ server.",
        hi: "Engineer neha 10.1.10.25 se TCP 22 par SW1 se connect karti hai aur apna username aur password type karti hai. SW1 par uska koi local account nahi hai. `aaa authentication login default group tacacs+ local` ki wajah se SW1 TACACS+ server se poochega.",
      },
      messages: [{ from: "admin", to: "sw1", label: "SSH login: neha", detail: "10.1.10.25 → 10.1.1.2 · TCP 22", tone: "blue" }],
    },
    {
      title: { en: "Authentication: who are you?", hi: "Authentication: tum kaun ho?" },
      text: {
        en: "SW1 sends neha's credentials to ISE over TCP 49. The whole TACACS+ body is encrypted with the shared key, so nobody on the path can read even the username. ISE checks them against Active Directory and answers PASS. (On the wire this can take a few packets; it is drawn here as one request and one reply.)",
        hi: "SW1 neha ke credentials TCP 49 par ISE ko bhejta hai. Poori TACACS+ body shared key se encrypted hai, isliye raaste mein koi username tak nahi padh sakta. ISE inhe Active Directory se check karta hai aur PASS jawab deta hai. (Wire par isme kuch packets lag sakte hain; yahan ek request aur ek reply ki tarah dikhaya hai.)",
      },
      messages: [
        { from: "sw1", to: "ise", label: "TACACS+ Authentication", detail: "TCP 49 · user neha + password · body encrypted", tone: "purple" },
        { from: "ise", to: "sw1", label: "Authentication PASS", detail: "password matches Active Directory", tone: "green", dashed: true },
      ],
    },
    {
      title: { en: "Authorization: may she get a CLI?", hi: "Authorization: kya use CLI milegi?" },
      text: {
        en: "Logging in is not the same as being allowed in. In a separate TACACS+ exchange SW1 asks whether neha may start an exec shell. ISE sees she is in the NOC-Engineers group and answers PASS with priv-lvl=15, so she lands at the SW1# prompt.",
        hi: "Login hona aur andar aane ki permission milna ek baat nahi hai. Ek alag TACACS+ exchange mein SW1 poochta hai ki neha exec shell start kar sakti hai ya nahi. ISE dekhta hai ki woh NOC-Engineers group mein hai aur priv-lvl=15 ke saath PASS jawab deta hai, toh woh SW1# prompt par pahunch jaati hai.",
      },
      messages: [
        { from: "sw1", to: "ise", label: "Authorization: exec shell", detail: "may neha start a CLI? at what level?", tone: "purple" },
        { from: "ise", to: "sw1", label: "PASS · priv-lvl=15", detail: "group NOC-Engineers", tone: "green", dashed: true },
      ],
      note: { actor: "sw1", text: "neha at SW1#" },
    },
    {
      title: { en: "A permitted command, and its record", hi: "Ek allowed command, aur uska record" },
      text: {
        en: "neha types show running-config. Before running it, SW1 asks ISE about this exact command; ISE answers PASS and the output appears. As the command completes, SW1 sends an accounting record to ISE: who, from where, which command, at what time.",
        hi: "neha show running-config type karti hai. Chalane se pehle SW1 ISE se isi exact command ke baare mein poochta hai; ISE PASS jawab deta hai aur output aa jaata hai. Command poori hote hi SW1 ISE ko accounting record bhejta hai: kisne, kahan se, kaunsi command, kis time.",
      },
      messages: [
        { from: "admin", to: "sw1", label: "show running-config", detail: "typed at SW1#", tone: "blue" },
        { from: "sw1", to: "ise", label: "Authorization: command", detail: "cmd=show running-config", tone: "purple" },
        { from: "ise", to: "sw1", label: "PASS", detail: "show commands allowed", tone: "green", dashed: true },
        { from: "sw1", to: "ise", label: "Accounting: command", detail: "neha · 10.1.10.25 · show running-config · 10:42", tone: "orange" },
      ],
      note: { actor: "ise", text: "Logged: neha ran show run" },
    },
    {
      title: { en: "A denied command", hi: "Ek denied command" },
      text: {
        en: "neha types reload. SW1 asks ISE again, because every level-15 command is checked. The ISE policy for NOC-Engineers does not include reload, so ISE answers FAIL. SW1 prints Command authorization failed. and the switch keeps running.",
        hi: "neha reload type karti hai. SW1 phir se ISE se poochta hai, kyunki har level-15 command check hoti hai. ISE ki NOC-Engineers wali policy mein reload allowed nahi hai, isliye ISE FAIL jawab deta hai. SW1 Command authorization failed. print karta hai aur switch chalta rehta hai.",
      },
      messages: [
        { from: "admin", to: "sw1", label: "reload", detail: "typed at SW1#", tone: "blue" },
        { from: "sw1", to: "ise", label: "Authorization: command", detail: "cmd=reload", tone: "purple" },
        { from: "ise", to: "sw1", label: "FAIL", detail: "reload not in NOC-Engineers policy", tone: "red", dashed: true },
      ],
      note: { actor: "sw1", text: "Command authorization failed." },
    },
    {
      title: { en: "RADIUS: a staff PC joins via 802.1X", hi: "RADIUS: staff PC 802.1X se join karta hai" },
      text: {
        en: "Now a different job: staff user rahul plugs his PC into Gi1/0/5. The PC (supplicant) sends his identity to SW1 in EAPOL frames. SW1 (authenticator) cannot check it, so it wraps the EAP data in a RADIUS Access-Request to ISE on UDP 1812; attributes such as the username and the port travel in clear text.",
        hi: "Ab ek alag kaam: staff user rahul apna PC Gi1/0/5 mein lagata hai. PC (supplicant) EAPOL frames mein apni identity SW1 ko bhejta hai. SW1 (authenticator) ise khud check nahi kar sakta, isliye EAP data ko RADIUS Access-Request mein wrap karke UDP 1812 par ISE ko bhejta hai; username aur port jaise attributes clear text mein jaate hain.",
      },
      messages: [
        { from: "staff", to: "sw1", label: "EAPOL: identity", detail: "802.1X on Gi1/0/5 · user rahul", tone: "blue" },
        { from: "sw1", to: "ise", label: "RADIUS Access-Request", detail: "UDP 1812 · EAP inside · port Gi1/0/5", tone: "teal" },
      ],
      note: { actor: "sw1", text: "Gi1/0/5: EAPOL only" },
    },
    {
      title: { en: "One reply: authenticated and authorized", hi: "Ek reply: authenticated bhi, authorized bhi" },
      text: {
        en: "After the EAP exchange (several round trips, condensed here), ISE sends Access-Accept. The same message carries the authorization: put rahul in VLAN 20. RADIUS combines authentication and authorization; TACACS+ needed separate exchanges. SW1 opens the port in VLAN 20 and tells the PC it succeeded.",
        hi: "EAP exchange ke baad (kai round trips, yahan chhota karke dikhaye), ISE Access-Accept bhejta hai. Usi message mein authorization bhi hai: rahul ko VLAN 20 mein daalo. RADIUS authentication aur authorization combine karta hai; TACACS+ mein alag exchanges lage the. SW1 port ko VLAN 20 mein khol deta hai aur PC ko success bata deta hai.",
      },
      messages: [{ from: "ise", to: "sw1", label: "RADIUS Access-Accept", detail: "UDP 1812 · VLAN 20 attributes included", tone: "green", dashed: true }],
      note: { actor: "sw1", text: "Gi1/0/5 authorized · VLAN 20" },
    },
    {
      title: { en: "RADIUS accounting on its own port", hi: "RADIUS accounting apne alag port par" },
      text: {
        en: "SW1 sends an Accounting-Request (Start) to UDP 1813: rahul is on Gi1/0/5 from now. A Stop record follows when he unplugs. Side by side: TACACS+ on TCP 49 controlled what an admin could type; RADIUS on UDP 1812/1813 controlled whether a user got onto the network.",
        hi: "SW1 UDP 1813 par Accounting-Request (Start) bhejta hai: rahul ab se Gi1/0/5 par hai. Jab woh cable nikaalega tab Stop record jaayega. Dono ko saath rakho: TCP 49 par TACACS+ ne control kiya ki admin kya type kar sakta hai; UDP 1812/1813 par RADIUS ne control kiya ki user network par aa sakta hai ya nahi.",
      },
      messages: [{ from: "sw1", to: "ise", label: "Accounting-Request", detail: "UDP 1813 · Start · rahul on Gi1/0/5", tone: "orange" }],
      note: { actor: "ise", text: "TACACS+ admins · RADIUS users" },
    },
  ],
};

export default scene;
