import type { TerminalScene } from "../types.ts";

// Three hosts on the same LAN, 192.168.10.0/24. The router 192.168.10.1 is the
// default gateway and the DHCP server; DNS servers are 8.8.8.8 and 8.8.4.4.
//   Windows PC  192.168.10.25  00-50-56-AA-00-01
//   MacBook     192.168.10.26  00:50:56:aa:00:02 (en0 = Wi-Fi)
//   Ubuntu      192.168.10.27  00:50:56:aa:00:03 (eth0)

const WIN = "C:\\Users\\student>";
const MAC = "student@MacBook-Air ~ %";
const LNX = "student@ubuntu:~$";

const scene: TerminalScene = {
  kind: "terminal",
  id: "client-ip-settings",
  title: { en: "Reading IP settings on Windows, macOS and Linux", hi: "Windows, macOS aur Linux par IP settings padhna" },
  device: "Client terminal",
  steps: [
    {
      title: { en: "Windows: ipconfig", hi: "Windows: ipconfig" },
      text: {
        en: "Plain `ipconfig` shows the three settings you check first: IPv4 address 192.168.10.25, mask 255.255.255.0 (/24) and default gateway 192.168.10.1. The gateway is inside 192.168.10.0/24, so this part is fine.",
        hi: "Simple `ipconfig` woh teen settings dikhata hai jo sabse pehle check karte hain: IPv4 address 192.168.10.25, mask 255.255.255.0 (/24) aur default gateway 192.168.10.1. Gateway 192.168.10.0/24 ke andar hai, toh yeh hissa theek hai.",
      },
      lines: [
        { prompt: WIN, cmd: "ipconfig" },
        {
          out: "Ethernet adapter Ethernet:\n\n   Link-local IPv6 Address . . . . . : fe80::1c2b:3a4d:5e6f:7a8b%12\n   IPv4 Address. . . . . . . . . . . : 192.168.10.25\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.10.1",
        },
      ],
    },
    {
      title: { en: "Windows: ipconfig /all", hi: "Windows: ipconfig /all" },
      text: {
        en: "`/all` adds what plain ipconfig hides: the MAC (Physical Address), whether DHCP is on, which DHCP server gave the lease and when it expires, and the DNS servers. `DHCP Enabled: No` would mean the settings were typed in by hand.",
        hi: "`/all` woh sab dikhata hai jo simple ipconfig chhupa leta hai: MAC (Physical Address), DHCP on hai ya nahi, lease kis DHCP server ne di aur kab expire hogi, aur DNS servers. `DHCP Enabled: No` ka matlab hota ki settings haath se type ki gayi hain.",
      },
      clear: true,
      lines: [
        { prompt: WIN, cmd: "ipconfig /all" },
        {
          out: "   Physical Address. . . . . . . . . : 00-50-56-AA-00-01\n   DHCP Enabled. . . . . . . . . . . : Yes\n   IPv4 Address. . . . . . . . . . . : 192.168.10.25(Preferred)\n   Lease Expires . . . . . . . . . . : Thursday, October 1, 2026 8:15:02 AM\n   DHCP Server . . . . . . . . . . . : 192.168.10.1\n   DNS Servers . . . . . . . . . . . : 8.8.8.8\n                                       8.8.4.4",
        },
      ],
    },
    {
      title: { en: "Fault: a 169.254.x.x address", hi: "Fault: 169.254.x.x address" },
      text: {
        en: "After the PC is moved to another switch port, `ipconfig` shows 169.254.37.112, mask 255.255.0.0 and no gateway. Windows asked for DHCP, got no answer, and gave itself an APIPA address. Look at the path to DHCP: the cable, the switch port's VLAN, the DHCP server or relay.",
        hi: "PC ko doosre switch port par shift karne ke baad `ipconfig` dikhata hai 169.254.37.112, mask 255.255.0.0 aur koi gateway nahi. Windows ne DHCP maanga, jawab nahi mila, toh khud ko APIPA address de diya. Ab DHCP tak ka raasta check karo: cable, switch port ka VLAN, DHCP server ya relay.",
      },
      clear: true,
      lines: [
        { prompt: WIN, cmd: "ipconfig" },
        {
          out: "Ethernet adapter Ethernet:\n\n   Autoconfiguration IPv4 Address. . : 169.254.37.112\n   Subnet Mask . . . . . . . . . . . : 255.255.0.0\n   Default Gateway . . . . . . . . . :",
        },
      ],
    },
    {
      title: { en: "Fix the cause, then renew the lease", hi: "Cause fix karo, phir lease renew karo" },
      text: {
        en: "The new port turned out to be in the wrong VLAN. Once it is moved to the right VLAN, `ipconfig /renew` makes Windows ask DHCP again, and the proper settings return. `ipconfig /release` is the opposite: it hands the lease back and leaves the adapter with no IPv4 address.",
        hi: "Pata chala ki naya port galat VLAN mein tha. Port ko sahi VLAN mein daalte hi `ipconfig /renew` se Windows DHCP se dobara maangta hai, aur sahi settings wapas aa jaati hain. `ipconfig /release` iska ulta hai: lease wapas kar deta hai aur adapter bina IPv4 address ke reh jaata hai.",
      },
      lines: [
        { prompt: WIN, cmd: "ipconfig /renew" },
        {
          out: "Ethernet adapter Ethernet:\n\n   IPv4 Address. . . . . . . . . . . : 192.168.10.25\n   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n   Default Gateway . . . . . . . . . : 192.168.10.1",
        },
      ],
    },
    {
      title: { en: "macOS: ifconfig en0", hi: "macOS: ifconfig en0" },
      text: {
        en: "On a MacBook, en0 is usually the Wi-Fi interface. `ether` is the MAC and `inet` the IPv4 address. The mask is printed in hex: 0xffffff00 is ff.ff.ff.00, which is 255.255.255.0, a /24.",
        hi: "MacBook par en0 aam taur par Wi-Fi interface hota hai. `ether` MAC hai aur `inet` IPv4 address. Mask hex mein print hota hai: 0xffffff00 yaani ff.ff.ff.00, jo 255.255.255.0 hai, yaani /24.",
      },
      clear: true,
      lines: [
        { prompt: MAC, cmd: "ifconfig en0" },
        {
          out: "en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500\n\tether 00:50:56:aa:00:02\n\tinet 192.168.10.26 netmask 0xffffff00 broadcast 192.168.10.255\n\tstatus: active",
        },
      ],
    },
    {
      title: { en: "macOS: networksetup -getinfo", hi: "macOS: networksetup -getinfo" },
      text: {
        en: "`networksetup -getinfo Wi-Fi` prints the same facts in plain words, including the gateway, which macOS calls Router. The first line says the settings came from DHCP; a hand-typed setup shows Manual Configuration.",
        hi: "`networksetup -getinfo Wi-Fi` yahi baatein simple words mein dikhata hai, gateway bhi, jise macOS Router kehta hai. Pehli line batati hai ki settings DHCP se aayi hain; haath se set ki gayi settings mein Manual Configuration dikhta hai.",
      },
      lines: [
        { prompt: MAC, cmd: "networksetup -getinfo Wi-Fi" },
        { out: "DHCP Configuration\nIP address: 192.168.10.26\nSubnet mask: 255.255.255.0\nRouter: 192.168.10.1\nWi-Fi ID: 00:50:56:aa:00:02" },
      ],
    },
    {
      title: { en: "macOS: gateway and DNS servers", hi: "macOS: gateway aur DNS servers" },
      text: {
        en: "`netstat -rn` prints the routing table, and its default line is the default gateway, 192.168.10.1 out of en0. `scutil --dns` lists the resolvers macOS is using; filtering for nameserver shows 8.8.8.8 and 8.8.4.4.",
        hi: "`netstat -rn` routing table print karta hai, aur uski default line hi default gateway hai: en0 se 192.168.10.1. `scutil --dns` batata hai macOS kaunse resolvers use kar raha hai; nameserver filter karne par 8.8.8.8 aur 8.8.4.4 dikhte hain.",
      },
      clear: true,
      lines: [
        { prompt: MAC, cmd: "netstat -rn | grep default" },
        { out: "default            192.168.10.1       UGScg                 en0" },
        { prompt: MAC, cmd: "scutil --dns | grep nameserver" },
        { out: "  nameserver[0] : 8.8.8.8\n  nameserver[1] : 8.8.4.4" },
      ],
    },
    {
      title: { en: "Linux: ip addr", hi: "Linux: ip addr" },
      text: {
        en: "`ip addr show eth0` gives the MAC (link/ether) and the address with its prefix, 192.168.10.27/24. The word `dynamic` and the `valid_lft` timer tell you this is a DHCP lease with just under 24 hours left.",
        hi: "`ip addr show eth0` MAC (link/ether) aur prefix ke saath address, 192.168.10.27/24, dikhata hai. `dynamic` word aur `valid_lft` timer batate hain ki yeh DHCP lease hai jiske 24 ghante se thoda kam bache hain.",
      },
      clear: true,
      lines: [
        { prompt: LNX, cmd: "ip addr show eth0" },
        {
          out: "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP\n    link/ether 00:50:56:aa:00:03 brd ff:ff:ff:ff:ff:ff\n    inet 192.168.10.27/24 brd 192.168.10.255 scope global dynamic eth0\n       valid_lft 85934sec preferred_lft 85934sec",
        },
      ],
    },
    {
      title: { en: "Linux: gateway and DNS", hi: "Linux: gateway aur DNS" },
      text: {
        en: "The default line of `ip route` is the gateway, learned from DHCP (proto dhcp). On Ubuntu, /etc/resolv.conf shows only 127.0.0.53, the local systemd-resolved stub; `resolvectl` shows the real DNS servers behind it.",
        hi: "`ip route` ki default line gateway hai, jo DHCP se seekhi gayi (proto dhcp). Ubuntu par /etc/resolv.conf sirf 127.0.0.53 dikhata hai, jo local systemd-resolved stub hai; uske peeche ke asli DNS servers `resolvectl` dikhata hai.",
      },
      lines: [
        { prompt: LNX, cmd: "ip route" },
        { out: "default via 192.168.10.1 dev eth0 proto dhcp src 192.168.10.27 metric 100\n192.168.10.0/24 dev eth0 proto kernel scope link src 192.168.10.27 metric 100" },
        { prompt: LNX, cmd: "grep nameserver /etc/resolv.conf" },
        { out: "nameserver 127.0.0.53" },
        { prompt: LNX, cmd: "resolvectl dns eth0" },
        { out: "Link 2 (eth0): 8.8.8.8 8.8.4.4" },
      ],
    },
    {
      title: { en: "Fault: no DNS server", hi: "Fault: DNS server hi nahi" },
      text: {
        en: "A different day: a colleague has reconfigured this host by hand with the same address, mask and gateway, but left DNS empty. Ping to 8.8.8.8 works, which proves the address, mask and gateway are fine, but every name fails. `resolvectl dns eth0` confirms the link has no DNS server.",
        hi: "Ab ek alag din: ek colleague ne is host ko haath se configure kiya, address, mask aur gateway wahi rakhe, lekin DNS khaali chhod diya. 8.8.8.8 ka ping chalta hai, yaani address, mask aur gateway theek hain, lekin har naam fail hota hai. `resolvectl dns eth0` confirm karta hai ki link par koi DNS server nahi hai.",
      },
      clear: true,
      lines: [
        { prompt: LNX, cmd: "ping -c 1 8.8.8.8" },
        { out: "PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.\n64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.4 ms" },
        { prompt: LNX, cmd: "ping -c 1 www.example.com" },
        { out: "ping: www.example.com: Temporary failure in name resolution" },
        { prompt: LNX, cmd: "resolvectl dns eth0" },
        { out: "Link 2 (eth0):" },
      ],
    },
  ],
};

export default scene;
