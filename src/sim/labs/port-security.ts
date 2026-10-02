import type { CliLab } from "../lab.ts";

const ps = (iface: string) => `interface ${iface}`;

const lab: CliLab = {
  id: "port-security",
  title: { en: "Lock down user ports with port security", hi: "Port security se user ports lock karo" },
  level: "intermediate",
  kind: "build",
  minutes: 20,
  lessons: ["port-security"],
  scenario: {
    en: "Last month a visitor unplugged the reception PC and plugged a laptop with a small hub into its wall socket. The office switch SW1 must now remember the one PC allowed on each user port. Reception is a public area, so a violation there should only drop the stranger's traffic and log it; the Finance port should shut down completely. Ports with nothing on them should be switched off.",
    hi: "Pichhle mahine ek visitor ne reception PC ka cable nikaala aur wall socket mein chhote hub ke saath apna laptop laga diya. Ab office switch SW1 ko har user port par sirf ek allowed PC yaad rakhna hai. Reception public area hai, isliye wahan violation hone par sirf anjaan device ka traffic drop ho aur log bane; Finance wala port poora band ho jaana chahiye. Jin ports par kuch nahi laga, unhe band kar do.",
  },
  devices: [
    { id: "r1", kind: "router", hostname: "GW", x: 400, y: 70, note: "192.168.1.1", locked: true, config: ["interface g0/0", "ip address 192.168.1.1 255.255.255.0", "no shutdown"] },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 400, y: 205 },
    { id: "pc1", kind: "pc", hostname: "Reception", x: 220, y: 351, host: { ip: "192.168.1.21", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.21" },
    { id: "pc2", kind: "pc", hostname: "Finance", x: 580, y: 351, host: { ip: "192.168.1.22", prefix: 24, gateway: "192.168.1.1" }, note: "192.168.1.22" },
  ],
  links: [
    ["r1", "GigabitEthernet0/0", "sw1", "GigabitEthernet0/1"],
    ["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["pc2", "FastEthernet0", "sw1", "FastEthernet0/2"],
  ],
  height: 421,
  tasks: [
    {
      text: { en: "Make Fa0/1 and Fa0/2 static access ports and enable port security on them.", hi: "Fa0/1 aur Fa0/2 ko static access ports banao aur un par port security enable karo." },
      hint: {
        en: "`interface range f0/1 - 2`, `switchport mode access`, `switchport port-security`. IOS refuses port security on a port that is still in a dynamic (DTP) mode, so set the mode first.",
        hi: "`interface range f0/1 - 2`, phir `switchport mode access` aur `switchport port-security`. Port abhi dynamic (DTP) mode mein ho toh IOS port security mana kar deta hai, isliye pehle mode set karo.",
      },
      check: [
        { t: "config", dev: "sw1", section: "interface FastEthernet0/1", has: "^ switchport mode access$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/1", has: "^ switchport port-security$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/2", has: "^ switchport mode access$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/2", has: "^ switchport port-security$" },
      ],
    },
    {
      text: { en: "On both ports allow only one MAC address, and learn it automatically as a sticky address.", hi: "Dono ports par sirf ek MAC address allow karo, aur use sticky address ki tarah apne aap seekhne do." },
      hint: {
        en: "`switchport port-security maximum 1` and `switchport port-security mac-address sticky`. Maximum 1 is the default, so it doesn't show in the running config.",
        hi: "`switchport port-security maximum 1` aur `switchport port-security mac-address sticky` do. Maximum 1 default hai, isliye woh running config mein nahi dikhta.",
      },
      check: [
        { t: "config", dev: "sw1", section: "interface FastEthernet0/1", has: "^ switchport port-security mac-address sticky$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/1", has: "port-security maximum", not: true },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/2", has: "^ switchport port-security mac-address sticky$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/2", has: "port-security maximum", not: true },
      ],
    },
    {
      text: {
        en: "Set the violation mode: restrict on Fa0/1 (Reception), shutdown on Fa0/2 (Finance).",
        hi: "Violation mode set karo: Fa0/1 (Reception) par restrict, Fa0/2 (Finance) par shutdown.",
      },
      hint: {
        en: "`switchport port-security violation restrict` on Fa0/1. Shutdown is the default, so on Fa0/2 you can type `switchport port-security violation shutdown` or leave it. Check with `show port-security interface f0/1`.",
        hi: "Fa0/1 par `switchport port-security violation restrict` do. Shutdown default hai, isliye Fa0/2 par `switchport port-security violation shutdown` type karo ya waise hi chhod do. `show port-security interface f0/1` se check karo.",
      },
      check: [
        { t: "config", dev: "sw1", section: "interface FastEthernet0/1", has: "^ switchport port-security violation restrict$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/2", has: "^ switchport port-security$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/2", has: "port-security violation", not: true },
      ],
    },
    {
      text: { en: "Shut down every unused port: Fa0/3 to Fa0/24 and Gi0/2.", hi: "Har unused port band karo: Fa0/3 se Fa0/24 tak aur Gi0/2." },
      hint: {
        en: "`interface range f0/3 - 24, g0/2` then `shutdown`. `show interfaces status` should list them as disabled.",
        hi: "`interface range f0/3 - 24, g0/2` mein jao, phir `shutdown` do. `show interfaces status` mein yeh disabled dikhne chahiye.",
      },
      check: [
        { t: "config", dev: "sw1", section: "interface FastEthernet0/3", has: "^ shutdown$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/12", has: "^ shutdown$" },
        { t: "config", dev: "sw1", section: "interface FastEthernet0/24", has: "^ shutdown$" },
        { t: "config", dev: "sw1", section: "interface GigabitEthernet0/2", has: "^ shutdown$" },
      ],
    },
    {
      text: { en: "Prove the real users still work: Reception and Finance can both ping the gateway 192.168.1.1.", hi: "Prove karo ki asli users ka kaam chal raha hai: Reception aur Finance dono gateway 192.168.1.1 ko ping kar sakein." },
      hint: {
        en: "From each PC run `ping 192.168.1.1`. If a port went down, `show interfaces status` tells you whether it is err-disabled or you shut the wrong one.",
        hi: "Dono PCs se `ping 192.168.1.1` chalao. Koi port down ho gaya ho toh `show interfaces status` batayega ki woh err-disabled hai ya galti se tumne galat port band kar diya.",
      },
      check: [
        { t: "up", dev: "sw1", iface: "FastEthernet0/1" },
        { t: "up", dev: "sw1", iface: "FastEthernet0/2" },
        { t: "up", dev: "sw1", iface: "GigabitEthernet0/1" },
        { t: "ping", from: "pc1", to: "192.168.1.1" },
        { t: "ping", from: "pc2", to: "192.168.1.1" },
      ],
    },
  ],
  solution: {
    sw1: [
      "interface range f0/1 - 2", "switchport mode access", "switchport port-security", "switchport port-security maximum 1", "switchport port-security mac-address sticky",
      ps("f0/1"), "switchport port-security violation restrict",
      ps("f0/2"), "switchport port-security violation shutdown",
      "interface range f0/3 - 24, g0/2", "shutdown",
    ],
    pc1: ["ping 192.168.1.1"],
    pc2: ["ping 192.168.1.1"],
  },
  debrief: {
    en: "Port security only works on a static access (or trunk) port. Sticky learning writes the first MAC it sees into the running config, so save the config or the switch forgets it after a reload. Protect drops silently, restrict drops and logs (and counts violations), shutdown err-disables the port until someone does `shutdown` then `no shutdown`.",
    hi: "Port security sirf static access (ya trunk) port par kaam karti hai. Sticky learning pehla dikha MAC running config mein likh deti hai, isliye config save karo warna reload ke baad switch use bhool jaata hai. Protect chupchaap drop karta hai, restrict drop karke log karta hai (aur violations count karta hai), aur shutdown port ko err-disable kar deta hai jab tak koi `shutdown` phir `no shutdown` na kare.",
  },
};

export default lab;
