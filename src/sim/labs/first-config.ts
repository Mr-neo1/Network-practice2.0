import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "first-config",
  title: { en: "First config: a brand-new switch from the console", hi: "Pehli config: console se ek bilkul naya switch" },
  level: "beginner",
  kind: "build",
  minutes: 15,
  lessons: ["cisco-cli-basics", "device-passwords"],
  scenario: {
    en: "A new 2960 has arrived for the second floor, still on factory defaults. Your laptop is plugged into its console port and you have the prompt. Before it goes into the rack, give it a proper name, lock privileged mode and the console, put up a legal warning banner, keep passwords out of plain sight, stop typos from hanging the CLI, and save everything so it survives a reboot.",
    hi: "Second floor ke liye ek naya 2960 aaya hai, abhi factory defaults par hai. Tumhara laptop uske console port se juda hai aur prompt tumhare saamne hai. Rack mein lagne se pehle ise ek sahi naam do, privileged mode aur console ko lock karo, ek legal warning banner lagao, passwords ko plain text mein dikhne se roko, typos par CLI atakna band karo, aur sab kuch save karo taaki reboot ke baad bhi rahe.",
  },
  devices: [
    { id: "pc1", kind: "pc", hostname: "Tech-Laptop", x: 200, y: 140, note: "on the console" },
    { id: "sw1", kind: "switch", hostname: "Switch", x: 520, y: 140, note: "factory defaults" },
  ],
  links: [["pc1", "FastEthernet0", "sw1", "FastEthernet0/1"]],
  height: 280,
  tasks: [
    {
      text: { en: "Name the switch FL2-SW1.", hi: "Switch ka naam FL2-SW1 rakho." },
      hint: {
        en: "`enable`, `configure terminal`, then `hostname FL2-SW1`. The prompt changes straight away.",
        hi: "Pehle `enable`, phir `configure terminal`, aur uske baad `hostname FL2-SW1`. Prompt turant badal jaata hai.",
      },
      check: { t: "config", dev: "sw1", has: "^hostname FL2-SW1$" },
    },
    {
      text: { en: "Protect privileged EXEC mode with an enable secret.", hi: "Privileged EXEC mode ko enable secret se protect karo." },
      hint: {
        en: "`enable secret <password>`. Use secret, not `enable password`: the secret is stored as a hash.",
        hi: "`enable secret <password>` use karo, `enable password` nahi, kyunki secret hash ke roop mein store hota hai.",
      },
      check: { t: "config", dev: "sw1", has: "^enable secret 9 " },
    },
    {
      text: { en: "Put a password on the console line and make the line ask for it.", hi: "Console line par password lagao aur line ko woh password maangne do." },
      hint: {
        en: "`line console 0`, `password <password>`, `login`. Without `login` the password is never asked for.",
        hi: "`line console 0` mein jao, phir `password <password>` aur `login` do. `login` ke bina password kabhi maanga hi nahi jaata.",
      },
      check: [
        { t: "config", dev: "sw1", section: "line con 0", has: "^ password " },
        { t: "config", dev: "sw1", section: "line con 0", has: "^ login$" },
      ],
    },
    {
      text: { en: "Add a message-of-the-day banner that warns: authorized access only.", hi: "Ek message-of-the-day banner lagao jo warning de: sirf authorized access." },
      hint: {
        en: "`banner motd #Authorized access only#`. The first character is the delimiter, and the banner ends where it appears again.",
        hi: "`banner motd #Authorized access only#` likho. Pehla character delimiter hota hai, aur jahan woh dobara aata hai wahan banner khatam hota hai.",
      },
      check: { t: "config", dev: "sw1", has: "^banner motd .*authori[sz]ed" },
    },
    {
      text: {
        en: "Encrypt the plain-text passwords in the config, and stop the switch from treating a mistyped command as a hostname to look up.",
        hi: "Config ke plain-text passwords encrypt karo, aur switch ko galat type kiye command ko hostname samajh kar lookup karne se roko.",
      },
      hint: {
        en: "`service password-encryption` and `no ip domain-lookup`. Then check `show running-config`: the console password now starts with 7.",
        hi: "`service password-encryption` aur `no ip domain-lookup` do. Phir `show running-config` dekho: console password ab 7 se shuru hoga.",
      },
      check: [
        { t: "config", dev: "sw1", has: "^service password-encryption$" },
        { t: "config", dev: "sw1", section: "line con 0", has: "^ password 7 " },
        { t: "config", dev: "sw1", has: "^no ip domain-lookup$" },
      ],
    },
    {
      text: { en: "Save the configuration so it survives a reload.", hi: "Configuration save karo taaki reload ke baad bhi bachi rahe." },
      hint: {
        en: "`end`, then `copy running-config startup-config` and press Enter at the file name prompt.",
        hi: "`end` karo, phir `copy running-config startup-config` chalao aur file name wale prompt par Enter dabao.",
      },
      check: { t: "saved", dev: "sw1" },
    },
  ],
  solution: {
    sw1: [
      "hostname FL2-SW1",
      "enable secret Fl00r2!Enable",
      "line console 0",
      "password C0nsole!Pass",
      "login",
      "exit",
      "banner motd #Authorized access only. Disconnect now if you are not allowed here.#",
      "service password-encryption",
      "no ip domain-lookup",
      "end",
      "copy running-config startup-config",
    ],
  },
  debrief: {
    en: "Every new device gets the same first few lines: hostname, enable secret, console password with `login`, a banner and `service password-encryption`. Type 7 encryption only hides passwords from someone looking over your shoulder; the enable secret is a real hash. Nothing counts until `copy running-config startup-config`.",
    hi: "Har naye device par pehle yahi lines jaati hain: hostname, enable secret, `login` ke saath console password, ek banner aur `service password-encryption`. Type 7 encryption sirf kandhe ke upar se dekhne wale se password chhupata hai; enable secret asli hash hai. Jab tak `copy running-config startup-config` nahi kiya, kuch bhi save nahi hua.",
  },
};

export default lab;
