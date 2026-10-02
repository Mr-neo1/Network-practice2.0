import type { SequenceScene } from "../types.ts";

// Matches the snmp lesson: NMS 10.1.1.50, R1 10.1.1.1, SW1 10.1.1.2.
// Communities: NOCread99 (RO), NOCwrite99 (RW). SNMPv3 user nms1.
// Colours: blue = polling (Get/GetBulk + Response), purple = Set,
// orange = notifications (Trap/Inform), green = acknowledgment / v3,
// red = dropped or lost.

const scene: SequenceScene = {
  kind: "sequence",
  id: "snmp",
  title: { en: "SNMP: polling, Set, Trap and Inform", hi: "SNMP: polling, Set, Trap aur Inform" },
  actors: [
    { id: "nms", label: "NMS", kind: "server", sub: "10.1.1.50" },
    { id: "r1", label: "R1 (agent)", kind: "router", sub: "10.1.1.1" },
    { id: "sw1", label: "SW1 (agent)", kind: "switch", sub: "10.1.1.2" },
  ],
  steps: [
    {
      title: { en: "Get: the NMS polls R1", hi: "Get: NMS R1 ko poll karta hai" },
      text: {
        en: "Every 5 minutes the NMS asks R1 for one MIB object: ifOperStatus.2, the state of Gi0/1. The GetRequest goes to UDP port 161, where R1's agent listens, and carries the read-only community NOCread99 in clear text. R1 answers with a Response: up(1).",
        hi: "NMS har 5 minute mein R1 se ek MIB object maangta hai: ifOperStatus.2, yaani Gi0/1 ki state. GetRequest UDP port 161 par jaati hai, jahan R1 ka agent sun raha hai, aur isme read-only community NOCread99 clear text mein hoti hai. R1 Response bhejta hai: up(1).",
      },
      messages: [
        { from: "nms", to: "r1", label: "GetRequest", detail: "UDP 50211 → 161 · ifOperStatus.2", tone: "blue" },
        { from: "r1", to: "nms", label: "Response", detail: "ifOperStatus.2 = up(1)", tone: "blue", dashed: true },
      ],
    },
    {
      title: { en: "GetBulk: a whole table in one go", hi: "GetBulk: poori table ek baar mein" },
      text: {
        en: "To learn SW1's interface names the NMS needs a whole column of the MIB, not one value. A GetBulkRequest (SNMPv2c and later) asks for up to 30 next objects after ifDescr, and SW1 returns them all in a single Response instead of 30 separate replies.",
        hi: "SW1 ke interface names jaanne ke liye NMS ko ek value nahi, MIB ka poora column chahiye. GetBulkRequest (SNMPv2c aur uske baad) ifDescr ke baad ke 30 tak objects maangti hai, aur SW1 30 alag replies ki jagah sab kuch ek hi Response mein bhej deta hai.",
      },
      messages: [
        { from: "nms", to: "sw1", label: "GetBulkRequest", detail: "ifDescr · max-repetitions 30", tone: "blue" },
        { from: "sw1", to: "nms", label: "Response", detail: "30 ifDescr values in one reply", tone: "blue", dashed: true },
      ],
    },
    {
      title: { en: "Wrong community: no answer at all", hi: "Galat community: koi jawab nahi" },
      text: {
        en: "A new monitoring tool is set up with the default community `public`. R1 has no community called public, so it discards the request without replying, and the tool just times out. The community string is the only authentication SNMPv1 and v2c have. (With authentication traps enabled, R1 can also report the failed attempt to the NMS in a Trap.)",
        hi: "Ek naya monitoring tool default community `public` ke saath setup hua hai. R1 par public naam ki koi community nahi hai, isliye woh request bina jawab diye discard kar deta hai, aur tool bas time out ho jaata hai. SNMPv1 aur v2c mein authentication ke naam par bas yahi ek cheez hai: community string. (Authentication traps on hon, toh R1 is failed attempt ki report Trap mein NMS ko bhi bhej sakta hai.)",
      },
      messages: [{ from: "nms", to: "r1", label: "GetRequest", detail: "community public · discarded", tone: "red", drop: true }],
      note: { actor: "r1", text: "Unknown community" },
    },
    {
      title: { en: "Set: the NMS changes a value", hi: "Set: NMS ek value badalta hai" },
      text: {
        en: "R1 has moved from rack 4 to rack 7. A SetRequest writes to the MIB, so it needs the read-write community NOCwrite99. The NMS sets sysLocation.0 to \"Mumbai DC rack 7\". R1 applies it and confirms with a Response that echoes the new value. With NOCread99 the same Set would be refused.",
        hi: "R1 rack 4 se rack 7 mein shift hua hai. SetRequest MIB mein likhti hai, isliye use read-write community NOCwrite99 chahiye. NMS sysLocation.0 ko \"Mumbai DC rack 7\" set karta hai. R1 ise apply karta hai aur Response mein nayi value wapas bhej kar confirm karta hai. NOCread99 ke saath yahi Set refuse ho jaata.",
      },
      messages: [
        { from: "nms", to: "r1", label: "SetRequest", detail: "NOCwrite99 · sysLocation.0 = rack 7", tone: "purple" },
        { from: "r1", to: "nms", label: "Response", detail: "noError · new value echoed", tone: "purple", dashed: true },
      ],
      note: { actor: "r1", text: "sysLocation updated" },
    },
    {
      title: { en: "Gi0/1 goes down: R1 sends a Trap", hi: "Gi0/1 down: R1 Trap bhejta hai" },
      text: {
        en: "The cable on R1 Gi0/1 is pulled. R1 does not wait for the next poll: its agent immediately sends a linkDown Trap to the NMS on UDP port 162, naming ifIndex 2. The NMS turns Gi0/1 red within a second instead of up to 5 minutes later.",
        hi: "R1 ke Gi0/1 ki cable nikal di gayi. R1 agle poll ka wait nahi karta: uska agent turant NMS ko UDP port 162 par linkDown Trap bhejta hai, jisme ifIndex 2 likha hota hai. NMS 5 minute baad nahi, ek second ke andar Gi0/1 ko red kar deta hai.",
      },
      messages: [{ from: "r1", to: "nms", label: "Trap: linkDown", detail: "UDP → 162 · ifIndex 2", tone: "orange" }],
      note: { actor: "r1", text: "Gi0/1 down" },
    },
    {
      title: { en: "A Trap can vanish", hi: "Trap gayab ho sakta hai" },
      text: {
        en: "Later an uplink on SW1 fails and SW1 sends its own linkDown Trap. This time the UDP datagram is lost on the way. A Trap is never acknowledged, so SW1 does not know, does not resend, and the NMS still shows the uplink as up.",
        hi: "Thodi der baad SW1 ka ek uplink fail hota hai aur SW1 apna linkDown Trap bhejta hai. Is baar UDP datagram raaste mein kho jaata hai. Trap ka kabhi acknowledgment nahi aata, isliye SW1 ko pata nahi chalta, woh dobara nahi bhejta, aur NMS par uplink ab bhi up dikh raha hai.",
      },
      messages: [{ from: "sw1", to: "nms", label: "Trap: linkDown", detail: "UDP → 162 · lost", tone: "red", drop: true }],
    },
    {
      title: { en: "Inform: resent until acknowledged", hi: "Inform: acknowledge hone tak dobara" },
      text: {
        en: "SW1 is changed to send Informs instead (`snmp-server host 10.1.1.50 informs version 2c NOCread99`). The uplink fails again and the first datagram is lost again. But this time SW1 keeps a copy and waits for an acknowledgment. When none comes before its timer expires, it sends the Inform again, and the NMS confirms with a Response.",
        hi: "Ab SW1 ko Informs bhejne ke liye configure kiya (`snmp-server host 10.1.1.50 informs version 2c NOCread99`). Uplink phir fail hota hai aur pehla datagram phir kho jaata hai. Lekin is baar SW1 ek copy rakhta hai aur acknowledgment ka wait karta hai. Timer expire hone tak kuch nahi aaya, toh woh Inform dobara bhejta hai, aur NMS Response bhej kar confirm karta hai.",
      },
      messages: [
        { from: "sw1", to: "nms", label: "Inform: linkDown", detail: "UDP → 162 · lost", tone: "red", drop: true },
        { from: "sw1", to: "nms", label: "Inform: linkDown (retry)", detail: "UDP → 162", tone: "orange" },
        { from: "nms", to: "sw1", label: "Response", detail: "acknowledges the Inform", tone: "green", dashed: true },
      ],
    },
    {
      title: { en: "SNMPv3: same Get, now protected", hi: "SNMPv3: wahi Get, ab protected" },
      text: {
        en: "Everything so far crossed the network in clear text, communities included. With SNMPv3 at authPriv, the NMS sends the same GetRequest as user nms1: a hash (SHA) proves who sent it and that nobody changed it, and the payload is encrypted with AES. R1's Response is protected the same way.",
        hi: "Ab tak sab kuch network par clear text mein gaya, communities bhi. SNMPv3 authPriv ke saath NMS wahi GetRequest user nms1 ke naam se bhejta hai: hash (SHA) prove karta hai ki kisne bheja aur beech mein kisi ne badla nahi, aur payload AES se encrypt hota hai. R1 ka Response bhi isi tarah protected hota hai.",
      },
      messages: [
        { from: "nms", to: "r1", label: "GetRequest (v3)", detail: "user nms1 · authPriv · encrypted", tone: "green" },
        { from: "r1", to: "nms", label: "Response (v3)", detail: "authenticated · encrypted", tone: "green", dashed: true },
      ],
    },
  ],
};

export default scene;
