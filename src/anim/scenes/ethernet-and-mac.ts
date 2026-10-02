import type { LayersScene } from "../types.ts";

// PC-A 10.1.1.10 / 0050.56aa.0001 sends to PC-B 10.1.1.20 / 0050.56aa.0002 on the same LAN
// (same hosts as the ARP lesson). Build the frame field by field, check it at the receiver,
// then zoom into the destination MAC.

const scene: LayersScene = {
  kind: "layers",
  id: "ethernet-and-mac",
  title: { en: "Building an Ethernet frame, then reading its MAC", hi: "Ethernet frame banana, phir uska MAC padhna" },
  stack: ["Network", "Data link", "Physical"],
  steps: [
    {
      title: { en: "Layer 3 hands over a packet", hi: "Layer 3 ek packet deta hai" },
      text: {
        en: "PC-A (10.1.1.10) has an IPv4 packet for PC-B (10.1.1.20) on the same LAN. The NIC cannot send a bare packet. It must wrap it in an Ethernet frame addressed to PC-B's MAC, 0050.56aa.0002, which PC-A has already learned with ARP (a later lesson).",
        hi: "PC-A (10.1.1.10) ke paas same LAN par PC-B (10.1.1.20) ke liye ek IPv4 packet hai. NIC akela packet nahi bhej sakta. Use packet ko Ethernet frame mein wrap karna padta hai, jiska destination PC-B ka MAC 0050.56aa.0002 ho. Yeh MAC PC-A ne ARP se pehle hi seekh liya hai (ARP aage ke lesson mein hai).",
      },
      stackActive: "Network",
      focus: ["pkt"],
      rows: [{ label: "Packet", blocks: [{ id: "pkt", label: "IPv4 packet", sub: "10.1.1.10 → 10.1.1.20", tone: "blue", w: 3 }] }],
    },
    {
      title: { en: "Destination MAC first, then source", hi: "Pehle destination MAC, phir source" },
      text: {
        en: "The header starts with the destination MAC (6 bytes), so a NIC or switch knows early whether the frame concerns it. Next comes the source MAC (6 bytes), always the sender's own unicast address: PC-A's 0050.56aa.0001.",
        hi: "Header destination MAC (6 bytes) se shuru hota hai, taaki NIC ya switch jaldi samajh le ki frame uske kaam ka hai ya nahi. Uske baad source MAC (6 bytes) aata hai, jo hamesha sender ka apna unicast address hota hai: PC-A ka 0050.56aa.0001.",
      },
      stackActive: "Data link",
      focus: ["dst", "src"],
      rows: [
        {
          label: "Frame",
          blocks: [
            { id: "dst", label: "Destination MAC", sub: "6 B · 0050.56aa.0002", tone: "orange", w: 1.6 },
            { id: "src", label: "Source MAC", sub: "6 B · 0050.56aa.0001", tone: "orange", w: 1.6 },
            { id: "pkt", label: "IPv4 packet", sub: "10.1.1.10 → 10.1.1.20", tone: "blue", w: 3 },
          ],
        },
      ],
    },
    {
      title: { en: "Type says what is inside", hi: "Type batata hai andar kya hai" },
      text: {
        en: "The 2-byte Type field tells the receiver which protocol gets the payload: 0x0800 is IPv4, 0x0806 is ARP, 0x86DD is IPv6. Destination + source + type make the 14-byte Ethernet header.",
        hi: "2-byte ka Type field receiver ko batata hai ki payload kis protocol ko dena hai: 0x0800 matlab IPv4, 0x0806 matlab ARP, 0x86DD matlab IPv6. Destination + source + type milkar 14-byte ka Ethernet header banate hain.",
      },
      stackActive: "Data link",
      focus: ["type"],
      rows: [
        {
          label: "Frame",
          blocks: [
            { id: "dst", label: "Destination MAC", sub: "6 B · 0050.56aa.0002", tone: "orange", w: 1.6 },
            { id: "src", label: "Source MAC", sub: "6 B · 0050.56aa.0001", tone: "orange", w: 1.6 },
            { id: "type", label: "Type", sub: "2 B · 0x0800", tone: "purple", w: 0.9 },
            { id: "pkt", label: "IPv4 packet", sub: "10.1.1.10 → 10.1.1.20", tone: "blue", w: 3 },
          ],
        },
      ],
    },
    {
      title: { en: "The FCS trailer closes the frame", hi: "FCS trailer frame ko band karta hai" },
      text: {
        en: "The sender runs a CRC-32 calculation over everything from the destination MAC to the end of the payload and writes the 4-byte result into the FCS. Header 14 + trailer 4 = 18 bytes wrapped around the packet.",
        hi: "Sender destination MAC se payload ke end tak sab par CRC-32 calculation chalata hai aur 4-byte result FCS mein likh deta hai. Header ke 14 aur trailer ke 4, yaani packet ke aage-peeche kul 18 bytes.",
      },
      stackActive: "Data link",
      focus: ["fcs"],
      rows: [
        {
          label: "Frame",
          blocks: [
            { id: "dst", label: "Destination MAC", sub: "6 B · 0050.56aa.0002", tone: "orange", w: 1.6 },
            { id: "src", label: "Source MAC", sub: "6 B · 0050.56aa.0001", tone: "orange", w: 1.6 },
            { id: "type", label: "Type", sub: "2 B · 0x0800", tone: "purple", w: 0.9 },
            { id: "pkt", label: "IPv4 packet", sub: "payload, 46-1500 B", tone: "blue", w: 3 },
            { id: "fcs", label: "FCS", sub: "4 B · CRC-32", tone: "teal", w: 0.9 },
          ],
        },
      ],
    },
    {
      title: { en: "Preamble and SFD go first on the wire", hi: "Wire par pehle Preamble aur SFD" },
      text: {
        en: "Before the frame, the NIC sends a 7-byte preamble of alternating 1s and 0s so the receiver can lock on to the signal, then the 1-byte SFD, 10101011, meaning \"the destination MAC starts now\". These 8 bytes are not counted in the frame size.",
        hi: "Frame se pehle NIC 7-byte ka preamble bhejta hai, 1 aur 0 baari-baari, taaki receiver signal ke saath sync ho jaaye. Phir 1-byte ka SFD, 10101011, jo kehta hai \"ab destination MAC shuru\". Yeh 8 bytes frame size mein count nahi hote.",
      },
      stackActive: "Physical",
      focus: ["pre", "sfd"],
      rows: [
        {
          label: "On the wire",
          blocks: [
            { id: "pre", label: "Preamble", sub: "7 B · 1010…1010", tone: "gray", w: 1.4 },
            { id: "sfd", label: "SFD", sub: "1 B · 10101011", tone: "gray", w: 1.2 },
            { id: "wire-frame", label: "Then the frame", sub: "64-1518 B, counted", tone: "orange", w: 2.4 },
          ],
        },
        {
          label: "Frame",
          blocks: [
            { id: "dst", label: "Destination MAC", sub: "6 B · 0050.56aa.0002", tone: "orange", w: 1.6 },
            { id: "src", label: "Source MAC", sub: "6 B · 0050.56aa.0001", tone: "orange", w: 1.6 },
            { id: "type", label: "Type", sub: "2 B · 0x0800", tone: "purple", w: 0.9 },
            { id: "pkt", label: "IPv4 packet", sub: "payload, 46-1500 B", tone: "blue", w: 3 },
            { id: "fcs", label: "FCS", sub: "4 B · CRC-32", tone: "teal", w: 0.9 },
          ],
        },
      ],
    },
    {
      title: { en: "A frame is 64 to 1518 bytes", hi: "Frame 64 se 1518 bytes ka hota hai" },
      text: {
        en: "The payload must be 46-1500 bytes, so a frame is 64-1518 bytes. A 28-byte ARP message is too short, so the sender adds 18 bytes of padding: 14 + 28 + 18 + 4 = 64.",
        hi: "Payload 46 se 1500 bytes ke beech hona chahiye, isliye frame 64 se 1518 bytes ka hota hai. 28-byte ka ARP message chhota padta hai, toh sender 18 bytes ki padding jodta hai: 14 + 28 + 18 + 4 = 64.",
      },
      stackActive: "Data link",
      focus: ["min-arp", "min-pad"],
      rows: [
        {
          label: "Largest: 1518",
          blocks: [
            { id: "max-hdr", label: "Header", sub: "14 B", tone: "orange", w: 1.2 },
            { id: "max-pay", label: "Payload", sub: "1500 B (the MTU)", tone: "blue", w: 4.8 },
            { id: "max-fcs", label: "FCS", sub: "4 B", tone: "teal", w: 0.8 },
          ],
        },
        {
          label: "Smallest: 64",
          blocks: [
            { id: "min-hdr", label: "Header", sub: "14 B", tone: "orange", w: 1.2 },
            { id: "min-arp", label: "ARP message", sub: "28 B", tone: "blue", w: 1.4 },
            { id: "min-pad", label: "Padding", sub: "18 B → payload 46", tone: "gray", w: 1.2 },
            { id: "min-fcs", label: "FCS", sub: "4 B", tone: "teal", w: 0.8 },
          ],
        },
      ],
    },
    {
      title: { en: "PC-B's NIC checks the frame", hi: "PC-B ka NIC frame check karta hai" },
      text: {
        en: "PC-B's NIC sees its own MAC as the destination, recalculates the CRC and compares it with the FCS. They match, so it strips header and trailer and hands the payload to IPv4, because Type is 0x0800. A mismatch would mean damaged bits, and the frame would be dropped.",
        hi: "PC-B ka NIC destination mein apna MAC dekhta hai, CRC dobara calculate karta hai aur FCS se compare karta hai. Dono match hote hain, toh header aur trailer hata kar payload IPv4 ko de deta hai, kyunki Type 0x0800 hai. Match na hota toh matlab bits kharab hui hain, aur frame drop ho jaata.",
      },
      stackActive: "Data link",
      focus: ["chk-dst", "chk-fcs", "chk-type"],
      rows: [
        {
          label: "Received",
          blocks: [
            { id: "dst", label: "Destination MAC", sub: "0050.56aa.0002", tone: "orange", w: 1.6 },
            { id: "src", label: "Source MAC", sub: "0050.56aa.0001", tone: "orange", w: 1.6 },
            { id: "type", label: "Type", sub: "0x0800", tone: "purple", w: 0.9 },
            { id: "pkt", label: "IPv4 packet", sub: "10.1.1.10 → 10.1.1.20", tone: "blue", w: 3 },
            { id: "fcs", label: "FCS", sub: "CRC-32", tone: "teal", w: 0.9 },
          ],
        },
        {
          label: "PC-B checks",
          blocks: [
            { id: "chk-dst", label: "Is it my MAC?", sub: "yes: keep reading", tone: "green", w: 1 },
            { id: "chk-fcs", label: "CRC = FCS?", sub: "yes: frame is intact", tone: "green", w: 1 },
            { id: "chk-type", label: "Type 0x0800", sub: "give payload to IPv4", tone: "green", w: 1 },
          ],
        },
      ],
    },
    {
      title: { en: "Zoom in: a MAC address is 48 bits", hi: "Zoom karo: MAC address 48 bits ka hai" },
      text: {
        en: "0050.56aa.0002 is 48 bits written as 12 hex digits. The first 24 bits are the OUI, which the IEEE gives to a manufacturer (00-50-56 is VMware's); the manufacturer sets the last 24 so each NIC is unique. Different systems write the same address three ways.",
        hi: "0050.56aa.0002 asal mein 48 bits hain, 12 hex digits mein likhe hue. Pehle 24 bits OUI hain, jo IEEE kisi manufacturer ko deta hai (00-50-56 VMware ka hai); aakhri 24 bits manufacturer khud set karta hai taaki har NIC unique ho. Alag systems yahi address teen tarah se likhte hain.",
      },
      stackActive: "Data link",
      focus: ["oui", "nic"],
      rows: [
        {
          label: "Destination MAC",
          blocks: [
            { id: "oui", label: "OUI: 00-50-56", sub: "24 bits · IEEE → VMware", tone: "orange", w: 1 },
            { id: "nic", label: "Device: AA-00-02", sub: "24 bits · set by vendor", tone: "pink", w: 1 },
          ],
        },
        {
          label: "Written as",
          blocks: [
            { id: "fmt-cisco", label: "0050.56aa.0002", sub: "Cisco IOS", tone: "gray", w: 1 },
            { id: "fmt-colon", label: "00:50:56:aa:00:02", sub: "Linux, macOS", tone: "gray", w: 1 },
            { id: "fmt-dash", label: "00-50-56-AA-00-02", sub: "Windows", tone: "gray", w: 1 },
          ],
        },
      ],
    },
    {
      title: { en: "The I/G bit: one NIC or a group?", hi: "I/G bit: ek NIC ya poora group?" },
      text: {
        en: "Look at the first byte, 0x00, in binary. Its lowest bit is the I/G bit: 0 means individual (unicast), 1 means group (multicast or broadcast). Ethernet sends each byte lowest bit first, so this is the very first address bit on the wire.",
        hi: "Pehle byte 0x00 ko binary mein dekho. Iska sabse chhota (lowest) bit I/G bit hai: 0 matlab individual (unicast), 1 matlab group (multicast ya broadcast). Ethernet har byte ka lowest bit pehle bhejta hai, isliye wire par address ka sabse pehla bit yahi hota hai.",
      },
      stackActive: "Data link",
      focus: ["bit0"],
      rows: [
        {
          label: "First byte 0x00",
          blocks: [
            { id: "bit7", label: "0", sub: "128", tone: "gray", w: 1 },
            { id: "bit6", label: "0", sub: "64", tone: "gray", w: 1 },
            { id: "bit5", label: "0", sub: "32", tone: "gray", w: 1 },
            { id: "bit4", label: "0", sub: "16", tone: "gray", w: 1 },
            { id: "bit3", label: "0", sub: "8", tone: "gray", w: 1 },
            { id: "bit2", label: "0", sub: "4", tone: "gray", w: 1 },
            { id: "bit1", label: "0", sub: "2", tone: "gray", w: 1 },
            { id: "bit0", label: "0", sub: "1 · I/G bit", tone: "green", w: 1.4 },
          ],
        },
      ],
    },
    {
      title: { en: "Unicast, broadcast, multicast", hi: "Unicast, broadcast, multicast" },
      text: {
        en: "Broadcast FFFF.FFFF.FFFF has every bit set, so every NIC in the VLAN accepts it. 0100.5E00.0005 starts with 01, so its I/G bit is 1 too: only NICs that joined that group accept it (this one is used by OSPF routers). Shortcut: an odd second hex digit means a group address.",
        hi: "Broadcast FFFF.FFFF.FFFF mein har bit 1 hai, isliye VLAN ka har NIC ise accept karta hai. 0100.5E00.0005 ki shuruaat 01 se hai, toh iska I/G bit bhi 1 hai: sirf wahi NICs ise lete hain jinhone woh group join kiya hai (yeh wala OSPF routers use karte hain). Shortcut: second hex digit odd hai toh group address hai.",
      },
      stackActive: "Data link",
      focus: ["b-type", "m-type"],
      rows: [
        {
          label: "0050.56aa.0002",
          blocks: [
            { id: "u-hex", label: "00", sub: "first byte", tone: "gray", w: 0.8 },
            { id: "u-bin", label: "0000 0000", sub: "I/G bit = 0", tone: "gray", w: 1.2 },
            { id: "u-type", label: "Unicast", sub: "one NIC", tone: "blue", w: 1.6 },
          ],
        },
        {
          label: "FFFF.FFFF.FFFF",
          blocks: [
            { id: "b-hex", label: "FF", sub: "first byte", tone: "gray", w: 0.8 },
            { id: "b-bin", label: "1111 1111", sub: "I/G bit = 1", tone: "gray", w: 1.2 },
            { id: "b-type", label: "Broadcast", sub: "every NIC in the VLAN", tone: "orange", w: 1.6 },
          ],
        },
        {
          label: "0100.5E00.0005",
          blocks: [
            { id: "m-hex", label: "01", sub: "first byte", tone: "gray", w: 0.8 },
            { id: "m-bin", label: "0000 0001", sub: "I/G bit = 1", tone: "gray", w: 1.2 },
            { id: "m-type", label: "Multicast", sub: "NICs that joined the group", tone: "purple", w: 1.6 },
          ],
        },
      ],
    },
  ],
};

export default scene;
