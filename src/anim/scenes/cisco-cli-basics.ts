import type { TerminalScene } from "../types.ts";

// First configuration of a brand-new Catalyst switch over the console (9600 8N1).
// Passwords match the lesson: enable secret Cisco123, console password ConPass1.
// The type 5 and type 7 strings below are the real encodings of those passwords.

const scene: TerminalScene = {
  kind: "terminal",
  id: "cisco-cli-basics",
  title: { en: "First configuration of a new switch", hi: "Naye switch ki pehli configuration" },
  device: "Switch — console (9600 8N1)",
  steps: [
    {
      title: { en: "Console connected: user EXEC", hi: "Console connect hua: user EXEC" },
      text: {
        en: "PuTTY is connected to the console port at 9600 8N1. The switch has no saved config, so it offers the setup dialog; answer no. The > prompt means user EXEC mode: you can look at a little and change nothing.",
        hi: "PuTTY console port se 9600 8N1 par connect hai. Switch mein koi saved config nahi hai, isliye woh setup dialog offer karta hai; jawab do no. > prompt ka matlab user EXEC mode hai: thoda dekh sakte ho, badal kuch nahi sakte.",
      },
      lines: [
        { out: "--- System Configuration Dialog ---" },
        { out: "Would you like to enter the initial configuration dialog? [yes/no]: no" },
        { out: "Press RETURN to get started!" },
        { prompt: "Switch>", cmd: "" },
      ],
    },
    {
      title: { en: "? finds the command, enable goes up", hi: "? se command dhoondho, enable se upar jao" },
      text: {
        en: "en? with no space lists every command that starts with en; here there is only one, enable. enable moves you to privileged EXEC mode, shown by #, where every show command and file operation is available.",
        hi: "Bina space ke en? likho toh en se shuru hone wale saare commands dikhte hain; yahan sirf ek hai, enable. enable tumhe privileged EXEC mode mein le jaata hai, prompt # ho jaata hai, aur yahan har show command aur file operation available hai.",
      },
      lines: [
        { prompt: "Switch>", cmd: "en?" },
        { out: "enable" },
        { prompt: "Switch>", cmd: "enable" },
        { prompt: "Switch#", cmd: "" },
      ],
    },
    {
      title: { en: "Global config and a hostname", hi: "Global config aur hostname" },
      text: {
        en: "configure terminal (conf t for short) enters global configuration mode. hostname ? with a space shows what must come next: a WORD. The name takes effect the moment you press Enter, so the prompt changes to SW1.",
        hi: "configure terminal (short mein conf t) global configuration mode mein le jaata hai. Space ke saath hostname ? batata hai ki aage kya aana chahiye: ek WORD. Enter dabate hi naam lag jaata hai, isliye prompt turant SW1 ho jaata hai.",
      },
      lines: [
        { prompt: "Switch#", cmd: "configure terminal" },
        { out: "Enter configuration commands, one per line.  End with CNTL/Z." },
        { prompt: "Switch(config)#", cmd: "hostname ?" },
        { out: "  WORD  This system's network name" },
        { prompt: "Switch(config)#", cmd: "hostname SW1" },
        { prompt: "SW1(config)#", cmd: "" },
      ],
    },
    {
      title: { en: "Protect privileged mode", hi: "Privileged mode ko protect karo" },
      text: {
        en: "enable secret sets the password the enable command will ask for, and stores only a hash of it (type 5). show is not a config command, so do runs it without leaving config mode.",
        hi: "enable secret woh password set karta hai jo enable command poochega, aur sirf uska hash (type 5) store karta hai. show config command nahi hai, isliye do lagakar use config mode chhode bina chalate hain.",
      },
      lines: [
        { prompt: "SW1(config)#", cmd: "enable secret Cisco123" },
        { prompt: "SW1(config)#", cmd: "do show running-config | include enable" },
        { out: "enable secret 5 $1$mERr$RldxcCZEZsTFTETUyRaA50" },
      ],
    },
    {
      title: { en: "Console password in a sub-mode", hi: "Sub-mode mein console password" },
      text: {
        en: "line console 0 opens a sub-mode for the console port only. password sets the password and login makes IOS ask for it; without login it is never checked. exit goes up one level, back to global config.",
        hi: "line console 0 sirf console port ke liye ek sub-mode kholta hai. password se password set hota hai aur login IOS ko use poochne ko kehta hai; login ke bina password kabhi check nahi hota. exit ek level upar, wapas global config mein le jaata hai.",
      },
      lines: [
        { prompt: "SW1(config)#", cmd: "line console 0" },
        { prompt: "SW1(config-line)#", cmd: "password ConPass1" },
        { prompt: "SW1(config-line)#", cmd: "login" },
        { prompt: "SW1(config-line)#", cmd: "exit" },
        { prompt: "SW1(config)#", cmd: "" },
      ],
    },
    {
      title: { en: "Hide passwords, add a banner, end", hi: "Passwords chhupao, banner lagao, end karo" },
      text: {
        en: "service password-encryption scrambles clear-text passwords such as the console one. banner motd sets a message shown before login; the # marks where the text starts and ends. end (or Ctrl+Z) jumps straight back to #, and IOS logs that the config changed.",
        hi: "service password-encryption console jaise clear-text passwords ko scramble kar deta hai. banner motd login se pehle dikhne wala message set karta hai; # batata hai text kahan shuru aur kahan khatam hai. end (ya Ctrl+Z) seedha # par le aata hai, aur IOS log karta hai ki config badli.",
      },
      lines: [
        { prompt: "SW1(config)#", cmd: "service password-encryption" },
        { prompt: "SW1(config)#", cmd: "banner motd # Authorized access only #" },
        { prompt: "SW1(config)#", cmd: "end" },
        { out: "%SYS-5-CONFIG_I: Configured from console by console" },
        { prompt: "SW1#", cmd: "" },
      ],
    },
    {
      title: { en: "A typo becomes a name lookup", hi: "Typo ban jaata hai name lookup" },
      text: {
        en: "IOS treats an unknown word as a hostname and asks DNS for it, which can hold the console for a while; Ctrl+Shift+6 breaks out. no ip domain-lookup turns lookups off so the next typo fails at once. Putting no in front of a command removes or reverses it.",
        hi: "IOS anjaan word ko hostname samajh kar DNS se poochta hai, aur console kaafi der atak sakta hai; Ctrl+Shift+6 se bahar niklo. no ip domain-lookup lookup band kar deta hai, toh agla typo turant fail hoga. Kisi command ke aage no lagao toh woh setting hat jaati hai ya ulat jaati hai.",
      },
      lines: [
        { prompt: "SW1#", cmd: "shwo" },
        { out: 'Translating "shwo"...domain server (255.255.255.255)' },
        { out: "% Unknown command or computer name, or unable to find computer address" },
        { prompt: "SW1#", cmd: "conf t" },
        { out: "Enter configuration commands, one per line.  End with CNTL/Z." },
        { prompt: "SW1(config)#", cmd: "no ip domain-lookup" },
        { prompt: "SW1(config)#", cmd: "end" },
        { out: "%SYS-5-CONFIG_I: Configured from console by console" },
      ],
    },
    {
      title: { en: "Check the running-config", hi: "Running-config check karo" },
      text: {
        en: "The running-config in RAM is what the switch is doing right now. The filter shows only the lines you changed: the enable secret is a type 5 hash, and the console password is now type 7, which is scrambled but easy to reverse.",
        hi: "RAM mein rakhi running-config dikhati hai ki switch abhi kya kar raha hai. Filter sirf badli hui lines dikhata hai: enable secret type 5 hash hai, aur console password ab type 7 hai, jo scrambled toh hai par aasani se reverse ho jaata hai.",
      },
      lines: [
        { prompt: "SW1#", cmd: "show running-config | include hostname|secret|password" },
        { out: "service password-encryption\nhostname SW1\nenable secret 5 $1$mERr$RldxcCZEZsTFTETUyRaA50\n password 7 080243403918160443" },
      ],
    },
    {
      title: { en: "Save it to NVRAM", hi: "NVRAM mein save karo" },
      text: {
        en: "RAM is wiped on reboot. Copying the running-config to the startup-config in NVRAM makes your work survive; press Enter to accept the file name. write memory does the same job.",
        hi: "Reboot par RAM saaf ho jaati hai. Running-config ko NVRAM ki startup-config mein copy karne se tumhara kaam reboot ke baad bhi bacha rehta hai; file name accept karne ke liye Enter dabao. write memory bhi yahi kaam karta hai.",
      },
      lines: [
        { prompt: "SW1#", cmd: "copy running-config startup-config" },
        { out: "Destination filename [startup-config]?" },
        { out: "Building configuration...\n[OK]" },
      ],
    },
    {
      title: { en: "Log out and test the login", hi: "Logout karke login test karo" },
      text: {
        en: "exit at the # prompt ends the session. Pressing Enter shows the banner, then the console password prompt, because of login; typed passwords are never echoed. enable then asks for the secret before you reach #.",
        hi: "# prompt par exit session khatam kar deta hai. Enter dabane par pehle banner dikhta hai, phir login ki wajah se console password maanga jaata hai; type kiye passwords screen par kabhi nahi dikhte. Phir enable, # tak pahunchne se pehle secret maangta hai.",
      },
      clear: true,
      lines: [
        { prompt: "SW1#", cmd: "exit" },
        { out: "SW1 con0 is now available\n\nPress RETURN to get started." },
        { out: "Authorized access only" },
        { out: "User Access Verification\nPassword:" },
        { prompt: "SW1>", cmd: "enable" },
        { out: "Password:" },
        { prompt: "SW1#", cmd: "" },
      ],
    },
  ],
};

export default scene;
