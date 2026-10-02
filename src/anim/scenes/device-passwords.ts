import type { TerminalScene } from "../types.ts";

// Hardening an IOS 15 router (15.3(3)M or later, so algorithm-type is available).
// Every hash below is a real encoding of the password shown:
//   type 5  Cisco123            -> $1$mERr$RldxcCZEZsTFTETUyRaA50
//   type 9  Kettle-Rain-Sky-42  -> $9$KKClHh/8YCtGie$DPJtWJ...
//   type 9  Lake-Fern-Lamp-17   -> $9$p1DEvRKb1tjgDb$kDQ/TA...
//   type 7  cisco               -> 02050D480809 and 094F471A1A0A

const scene: TerminalScene = {
  kind: "terminal",
  id: "device-passwords",
  title: { en: "Hardening R1's passwords, one command at a time", hi: "R1 ke passwords ko ek-ek command se harden karna" },
  device: "R1 — console",
  steps: [
    {
      title: { en: "Before: every password is readable", hi: "Pehle: har password padha ja sakta hai" },
      text: {
        en: "This router was set up quickly: an enable password and the same line password, cisco, on the console and the VTY lines. The filter shows every line containing \"password\". All three are type 0, plain text for anyone who sees this config.",
        hi: "Yeh router jaldi mein set hua tha: ek enable password aur console aur VTY lines par wahi line password, cisco. Filter \"password\" wali har line dikhata hai. Teeno type 0 hain, yaani config dekhne wale har insaan ke liye plain text.",
      },
      lines: [
        { prompt: "R1#", cmd: "show running-config | include password" },
        { out: "no service password-encryption\nenable password cisco\n password cisco\n password cisco" },
      ],
    },
    {
      title: { en: "enable secret: a type 5 hash", hi: "enable secret: type 5 hash" },
      text: {
        en: "enable secret stores only a salted MD5 hash, type 5 on this IOS 15 router, and when both exist the secret is the one enable checks. But the old enable password cisco is still sitting in the config in clear text.",
        hi: "enable secret sirf salted MD5 hash store karta hai, is IOS 15 router par type 5, aur jab dono hon toh enable secret hi check karta hai. Lekin purana enable password cisco abhi bhi config mein clear text mein pada hai.",
      },
      lines: [
        { prompt: "R1#", cmd: "configure terminal" },
        { out: "Enter configuration commands, one per line.  End with CNTL/Z." },
        { prompt: "R1(config)#", cmd: "enable secret Cisco123" },
        { prompt: "R1(config)#", cmd: "do show running-config | include enable" },
        { out: "enable secret 5 $1$mERr$RldxcCZEZsTFTETUyRaA50\nenable password cisco" },
      ],
    },
    {
      title: { en: "Upgrade to type 9 and remove the leftover", hi: "Type 9 par upgrade aur bacha hua hatao" },
      text: {
        en: "algorithm-type scrypt replaces the secret with a type 9 scrypt hash and a longer passphrase. no enable password deletes the clear-text line. Now only one enable line is left, and it cannot be reversed.",
        hi: "algorithm-type scrypt secret ko type 9 scrypt hash aur lambe passphrase se replace karta hai. no enable password clear-text line delete kar deta hai. Ab sirf ek enable line bachi hai, aur use reverse nahi kiya ja sakta.",
      },
      lines: [
        { prompt: "R1(config)#", cmd: "enable algorithm-type scrypt secret Kettle-Rain-Sky-42" },
        { prompt: "R1(config)#", cmd: "no enable password" },
        { prompt: "R1(config)#", cmd: "do show running-config | include enable" },
        { out: "enable secret 9 $9$KKClHh/8YCtGie$DPJtWJDosWY6/Ly9A4Qa.4nC116h0omTXeeOITBhKsI" },
      ],
    },
    {
      title: { en: "A minimum length, then a local user", hi: "Minimum length, phir ek local user" },
      text: {
        en: "security passwords min-length 10 makes IOS reject any new password shorter than 10 characters, so set it before creating users. The admin account gets its own type 9 secret.",
        hi: "security passwords min-length 10 ke baad IOS 10 characters se chhota koi bhi naya password reject karta hai, isliye users banane se pehle ise set karo. Admin account ko apna type 9 secret milta hai.",
      },
      clear: true,
      lines: [
        { prompt: "R1(config)#", cmd: "security passwords min-length 10" },
        { prompt: "R1(config)#", cmd: "username admin algorithm-type scrypt secret Lake-Fern-Lamp-17" },
        { prompt: "R1(config)#", cmd: "do show running-config | include username" },
        { out: "username admin secret 9 $9$p1DEvRKb1tjgDb$kDQ/TAcp4CMnfYmw62yKJSfanuShQf/py6eAswOwPwQ" },
      ],
    },
    {
      title: { en: "Lines use the local database and time out", hi: "Lines local database use karti hain aur timeout hoti hain" },
      text: {
        en: "login local makes the console and VTY lines ask for a username and check it against the local users; the old line passwords are now ignored. exec-timeout 5 0 logs out a session idle for 5 minutes, and transport input ssh keeps Telnet out.",
        hi: "login local ke baad console aur VTY lines username maangti hain aur local users se check karti hain; purane line passwords ab ignore hote hain. exec-timeout 5 0, 5 minute idle session ko logout kar deta hai, aur transport input ssh Telnet ko bahar rakhta hai.",
      },
      lines: [
        { prompt: "R1(config)#", cmd: "line con 0" },
        { prompt: "R1(config-line)#", cmd: "login local" },
        { prompt: "R1(config-line)#", cmd: "exec-timeout 5 0" },
        { prompt: "R1(config-line)#", cmd: "line vty 0 4" },
        { prompt: "R1(config-line)#", cmd: "login local" },
        { prompt: "R1(config-line)#", cmd: "exec-timeout 5 0" },
        { prompt: "R1(config-line)#", cmd: "transport input ssh" },
        { prompt: "R1(config-line)#", cmd: "exit" },
      ],
    },
    {
      title: { en: "Stop guessing with login block-for", hi: "login block-for se guessing roko" },
      text: {
        en: "If 3 logins fail within 60 seconds, R1 enters quiet mode and refuses every Telnet, SSH and HTTP login for 120 seconds. A brute-force tool that tried many passwords a second now gets about 3 guesses every 2 minutes.",
        hi: "Agar 60 second mein 3 logins fail hon, toh R1 quiet mode mein chala jaata hai aur 120 second tak har Telnet, SSH aur HTTP login refuse karta hai. Jo brute-force tool har second kai passwords try karta tha, use ab har 2 minute mein lagbhag 3 guesses milte hain.",
      },
      lines: [
        { prompt: "R1(config)#", cmd: "login block-for 120 attempts 3 within 60" },
        { prompt: "R1(config)#", cmd: "do show running-config | include block" },
        { out: "login block-for 120 attempts 3 within 60" },
      ],
    },
    {
      title: { en: "service password-encryption: only type 7", hi: "service password-encryption: sirf type 7" },
      text: {
        en: "The two old line passwords, cisco, were still clear text. service password-encryption turns them into type 7, which hides them from a glance but can be reversed in seconds. The type 9 secrets are untouched; the command never changes secrets.",
        hi: "Do purane line passwords, cisco, abhi bhi clear text the. service password-encryption unhe type 7 bana deta hai, jo sarsari nazar se chhupata hai lekin seconds mein reverse ho sakta hai. Type 9 secrets ko yeh chhoota bhi nahi; yeh command secrets ko kabhi nahi badalta.",
      },
      clear: true,
      lines: [
        { prompt: "R1(config)#", cmd: "service password-encryption" },
        { prompt: "R1(config)#", cmd: "end" },
        { out: "%SYS-5-CONFIG_I: Configured from console by console" },
        { prompt: "R1#", cmd: "show running-config | include password 7" },
        { out: " password 7 02050D480809\n password 7 094F471A1A0A" },
      ],
    },
    {
      title: { en: "Check the VTY lines and save", hi: "VTY lines check karo aur save karo" },
      text: {
        en: "The VTY section shows the result: a 5-minute timeout, login local and SSH only. The type 7 line password is unused now that login local is set; no password under the line would remove it. Copy the config to NVRAM so it survives a reload.",
        hi: "VTY section result dikhata hai: 5 minute timeout, login local aur sirf SSH. login local set hone ke baad type 7 line password ab use nahi hota; line ke andar no password use hata dega. Config ko NVRAM mein copy karo taaki reload ke baad bhi rahe.",
      },
      lines: [
        { prompt: "R1#", cmd: "show running-config | section vty" },
        { out: "line vty 0 4\n exec-timeout 5 0\n password 7 094F471A1A0A\n login local\n transport input ssh" },
        { prompt: "R1#", cmd: "copy running-config startup-config" },
        { out: "Destination filename [startup-config]?\nBuilding configuration...\n[OK]" },
      ],
    },
    {
      title: { en: "Log in again as admin", hi: "Admin bankar dobara login karo" },
      text: {
        en: "After exit, the console now asks for a username, not just a password, because of login local. admin lands at user EXEC, and enable asks for the type 9 enable secret before the # prompt appears.",
        hi: "exit ke baad console ab sirf password nahi, username bhi maangta hai, login local ki wajah se. admin user EXEC par aata hai, aur # prompt aane se pehle enable type 9 enable secret maangta hai.",
      },
      clear: true,
      lines: [
        { prompt: "R1#", cmd: "exit" },
        { out: "R1 con0 is now available\n\nPress RETURN to get started." },
        { out: "User Access Verification\n\nUsername: admin\nPassword:" },
        { prompt: "R1>", cmd: "enable" },
        { out: "Password:" },
        { prompt: "R1#", cmd: "" },
      ],
    },
  ],
};

export default scene;
