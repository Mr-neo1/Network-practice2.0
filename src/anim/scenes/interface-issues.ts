import type { TerminalScene } from "../types.ts";

// SW1 Fa0/1 <-> SW2 Fa0/1. SW1 is on speed/duplex auto; someone hard-coded SW2 to 100/full.
const scene: TerminalScene = {
  kind: "terminal",
  id: "interface-issues",
  title: { en: "Finding and fixing a duplex mismatch", hi: "Duplex mismatch dhoondhna aur fix karna" },
  device: "SW1 and SW2 — console",
  steps: [
    {
      title: { en: "One line per port", hi: "Har port ki ek line" },
      text: {
        en: "Users say file copies between SW1 and SW2 are slow. On SW1, `show interfaces status` shows the uplink Fa0/1 connected at `a-half`: auto-negotiation ended in half duplex, which should never happen on a switch-to-switch link. Fa0/3 has no link (`notconnect`) and Fa0/4 is shut down (`disabled`).",
        hi: "Users bolte hain ki SW1 aur SW2 ke beech file copy slow hai. SW1 par `show interfaces status` dikhata hai ki uplink Fa0/1 connected hai, lekin `a-half` par: auto-negotiation ka result half duplex aaya, jo switch-to-switch link par kabhi nahi hona chahiye. Fa0/3 par link nahi hai (`notconnect`) aur Fa0/4 shut down hai (`disabled`).",
      },
      lines: [
        { prompt: "SW1#", cmd: "show interfaces status" },
        {
          out:
            "Port      Name               Status       Vlan       Duplex  Speed Type\n" +
            "Fa0/1     Link to SW2        connected    1          a-half  a-100 10/100BaseTX\n" +
            "Fa0/2     PC-B               connected    1          a-full  a-100 10/100BaseTX\n" +
            "Fa0/3                        notconnect   1            auto   auto 10/100BaseTX\n" +
            "Fa0/4                        disabled     1            auto   auto 10/100BaseTX",
        },
      ],
    },
    {
      title: { en: "Up/up, but half duplex", hi: "Up/up, lekin half duplex" },
      text: {
        en: "`show interfaces fa0/1` says the port is up and line protocol is up, so this is not a speed mismatch: that would bring the link down. The speed is 100 Mb/s, but the port runs half duplex.",
        hi: "`show interfaces fa0/1` batata hai ki port up hai aur line protocol bhi up hai, toh yeh speed mismatch nahi hai: usme link down ho jaata. Speed 100 Mb/s hai, lekin port half duplex par chal raha hai.",
      },
      lines: [
        { prompt: "SW1#", cmd: "show interfaces fa0/1" },
        {
          out:
            "FastEthernet0/1 is up, line protocol is up (connected)\n" +
            "  Hardware is Fast Ethernet, address is 0019.e86a.6f81 (bia 0019.e86a.6f81)\n" +
            "  Description: Link to SW2\n" +
            "  Half-duplex, 100Mb/s, media type is 10/100BaseTX",
        },
      ],
    },
    {
      title: { en: "The half side counts late collisions", hi: "Half side late collisions ginta hai" },
      text: {
        en: "Further down the same output, SW1 shows thousands of collisions and late collisions. A correctly working link has none. Late collisions (after the first 64 bytes of a frame) mean the far end sends whenever it likes, ignoring CSMA/CD: the signature of a duplex mismatch, seen on the half-duplex side.",
        hi: "Usi output mein neeche, SW1 hazaaron collisions aur late collisions dikhata hai. Sahi chal rahe link par ek bhi nahi hona chahiye. Late collisions (frame ke pehle 64 bytes ke baad) ka matlab hai ki doosra end CSMA/CD ko ignore karke jab chahe bhej raha hai: yeh duplex mismatch ki pehchaan hai, jo half-duplex side par dikhti hai.",
      },
      lines: [
        {
          out:
            "     0 runts, 0 giants, 0 throttles\n" +
            "     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored\n" +
            "     58213 packets output, 6120448 bytes, 0 underruns\n" +
            "     1829 output errors, 3462 collisions, 1 interface resets\n" +
            "     0 babbles, 1829 late collision, 2710 deferred",
        },
      ],
    },
    {
      title: { en: "The full side counts runts and CRC errors", hi: "Full side runts aur CRC errors ginta hai" },
      text: {
        en: "On SW2 the same link runs full duplex. When SW2 transmits in the middle of an SW1 frame, SW1 aborts that frame, so SW2 receives cut-off frames: runts when they are under 64 bytes, CRC errors when they are longer.",
        hi: "SW2 par wahi link full duplex par hai. Jab SW2, SW1 ke frame ke beech mein transmit karta hai, SW1 apna frame beech mein chhod deta hai, isliye SW2 ko kate hue frames milte hain: 64 bytes se chhote hon toh runts, bade hon toh CRC errors.",
      },
      clear: true,
      lines: [
        { prompt: "SW2#", cmd: "show interfaces fa0/1 | include duplex|runts|input errors" },
        {
          out:
            "  Full-duplex, 100Mb/s, media type is 10/100BaseTX\n" +
            "     1741 runts, 0 giants, 0 throttles\n" +
            "     3956 input errors, 2215 CRC, 0 frame, 0 overrun, 0 ignored",
        },
      ],
    },
    {
      title: { en: "The cause: SW2 is hard-coded", hi: "Wajah: SW2 hard-coded hai" },
      text: {
        en: "SW2's config shows `speed 100` and `duplex full`, so SW2 does not negotiate. SW1, still on auto, sensed 100 Mb/s from the signal but could not learn the duplex, so it fell back to half duplex.",
        hi: "SW2 ki config mein `speed 100` aur `duplex full` hai, isliye SW2 negotiate nahi karta. SW1 abhi bhi auto par hai: usne signal se 100 Mb/s sense kar liya, lekin duplex nahi seekh paaya, toh half duplex par aa gaya.",
      },
      lines: [
        { prompt: "SW2#", cmd: "show running-config interface fa0/1" },
        { out: "interface FastEthernet0/1\n description Link to SW1\n speed 100\n duplex full\nend" },
      ],
    },
    {
      title: { en: "Fix: both ends on auto", hi: "Fix: dono ends auto par" },
      text: {
        en: "SW1 is already on auto, so only SW2 needs changing. With both ends negotiating, the link drops for a few seconds and comes back at the best common setting. Hard-coding SW1 to 100/full as well would also work; one end fixed and the other on auto is what caused the problem.",
        hi: "SW1 pehle se auto par hai, isliye sirf SW2 badalna hai. Dono ends negotiate karenge toh link kuch seconds ke liye down hoga aur best common setting par wapas aayega. SW1 ko bhi 100/full par hard-code karte toh woh bhi chal jaata; problem ki jad yahi thi ki ek end fixed tha aur doosra auto par.",
      },
      lines: [
        { prompt: "SW2#", cmd: "configure terminal" },
        { out: "Enter configuration commands, one per line.  End with CNTL/Z." },
        { prompt: "SW2(config)#", cmd: "interface fa0/1" },
        { prompt: "SW2(config-if)#", cmd: "speed auto" },
        { prompt: "SW2(config-if)#", cmd: "duplex auto" },
        { prompt: "SW2(config-if)#", cmd: "end" },
      ],
    },
    {
      title: { en: "Verify, then reset the counters", hi: "Verify karo, phir counters reset" },
      text: {
        en: "Back on SW1, Fa0/1 now shows `a-full` and `a-100`. The old error totals would make a healthy link look broken, so clear the counters on both ends of the link and let traffic run.",
        hi: "Wapas SW1 par, Fa0/1 ab `a-full` aur `a-100` dikhata hai. Purane error totals ki wajah se healthy link bhi kharab lagega, isliye link ke dono ends par counters clear karo aur traffic chalne do.",
      },
      clear: true,
      lines: [
        { prompt: "SW1#", cmd: "show interfaces fa0/1 status" },
        {
          out:
            "Port      Name               Status       Vlan       Duplex  Speed Type\n" +
            "Fa0/1     Link to SW2        connected    1          a-full  a-100 10/100BaseTX",
        },
        { prompt: "SW1#", cmd: "clear counters fa0/1" },
        { out: 'Clear "show interface" counters on this interface [confirm]' },
        { prompt: "SW2#", cmd: "clear counters fa0/1" },
        { out: 'Clear "show interface" counters on this interface [confirm]' },
      ],
    },
    {
      title: { en: "An hour later: clean counters", hi: "Ek ghante baad: counters saaf" },
      text: {
        en: "One hour after the clear, SW1 runs full duplex with 0 collisions and 0 late collisions, and SW2 has 0 runts and 0 CRC errors. Both ends are clean, so the mismatch is gone and copies between the switches run at full speed again.",
        hi: "Clear karne ke ek ghante baad SW1 full duplex par hai, 0 collisions aur 0 late collisions ke saath, aur SW2 par 0 runts aur 0 CRC errors hain. Dono ends saaf hain, matlab mismatch khatam, aur switches ke beech copy phir se poori speed par chalti hai.",
      },
      clear: true,
      lines: [
        { prompt: "SW1#", cmd: "show interfaces fa0/1 | include duplex|clearing|collision" },
        {
          out:
            "  Full-duplex, 100Mb/s, media type is 10/100BaseTX\n" +
            '  Last clearing of "show interface" counters 01:00:14\n' +
            "     0 output errors, 0 collisions, 0 interface resets\n" +
            "     0 babbles, 0 late collision, 0 deferred",
        },
        { prompt: "SW2#", cmd: "show interfaces fa0/1 | include runts|input errors" },
        {
          out:
            "     0 runts, 0 giants, 0 throttles\n" +
            "     0 input errors, 0 CRC, 0 frame, 0 overrun, 0 ignored",
        },
      ],
    },
  ],
};

export default scene;
