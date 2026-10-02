import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "cisco-cli-basics",
  intro: {
    en: "Cisco routers and switches are configured through the same command line, IOS. Before you can build VLANs, routes or security, you need to open a console session, move between the modes, find commands with the built-in help, and save your work so it survives a reboot. You will use these commands in every lab from here to the exam.",
    hi: "Cisco routers aur switches ek hi command line se configure hote hain: IOS. VLAN, routing ya security banane se pehle tumhe console session kholna, modes ke beech move karna, built-in help se commands dhoondhna, aur apna kaam save karna aana chahiye taaki reboot ke baad bhi bacha rahe. Yeh commands tum yahan se exam tak har lab mein use karoge.",
  },
  outcomes: [
    { en: "Connect to a switch console with the right cable and 9600 8N1 settings", hi: "Sahi cable aur 9600 8N1 settings ke saath switch ke console se connect kar sako" },
    { en: "Move between user EXEC, privileged EXEC, global configuration and sub-modes, and back out", hi: "User EXEC, privileged EXEC, global configuration aur sub-modes ke beech aana-jaana kar sako" },
    { en: "Use ?, Tab, abbreviations and command history to find and repeat commands", hi: "?, Tab, abbreviations aur command history se commands dhoondh aur dobara chala sako" },
    { en: "Explain running-config versus startup-config and save your changes", hi: "Running-config aur startup-config ka fark samjha sako aur changes save kar sako" },
    { en: "Configure a hostname, enable secret, console password, banner and service password-encryption", hi: "Hostname, enable secret, console password, banner aur service password-encryption configure kar sako" },
  ],
  sections: [
    {
      id: "console-access",
      heading: { en: "Getting a console session", hi: "Console session kaise kholein" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A brand-new switch has no IP address, so you cannot reach it over the network yet. The **console port** is a direct serial connection that works even when the network is broken. It is the first thing you use on new equipment and the last resort when remote access fails.",
            hi: "Bilkul naye switch ka koi IP address nahi hota, isliye abhi network ke through usse connect nahi kar sakte. **Console port** ek direct serial connection hai jo network kharab hone par bhi kaam karta hai. Naye device par sabse pehle yahi use hota hai, aur jab remote access fail ho jaaye tab aakhri raasta bhi yahi hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Rollover (console) cable**: RJ-45 into the device's console port, DB-9 serial at the PC end. Most laptops also need a USB-to-serial adapter.",
              hi: "**Rollover (console) cable**: ek taraf RJ-45 device ke console port mein, doosri taraf DB-9 serial PC mein. Zyaadatar laptops ke liye USB-to-serial adapter bhi chahiye hota hai.",
            },
            {
              en: "**USB console**: many newer devices also have a USB console port (mini-B or USB-C, depending on the model). Install the vendor's driver and it shows up as a COM port.",
              hi: "**USB console**: kaafi naye devices mein USB console port bhi hota hai (model ke hisaab se mini-B ya USB-C). Vendor ka driver install karo, phir yeh ek COM port ki tarah dikhta hai.",
            },
            {
              en: "**Terminal program**: PuTTY, Tera Term or SecureCRT. Choose Serial, pick the COM port (Device Manager on Windows shows the number) and set the speed.",
              hi: "**Terminal program**: PuTTY, Tera Term ya SecureCRT. Serial choose karo, COM port chuno (Windows par Device Manager mein number dikhta hai) aur speed set karo.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Default console settings, often written 9600 8N1", hi: "Default console settings, jinhe aksar 9600 8N1 likhte hain" },
          columns: [{ en: "Setting", hi: "Setting" }, { en: "Value", hi: "Value" }],
          rows: [
            [{ en: "Speed", hi: "Speed" }, "9600 baud"],
            [{ en: "Data bits", hi: "Data bits" }, "8"],
            [{ en: "Parity", hi: "Parity" }, { en: "None", hi: "None" }],
            [{ en: "Stop bits", hi: "Stop bits" }, "1"],
            [{ en: "Flow control", hi: "Flow control" }, { en: "None", hi: "None" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "A device with no saved configuration offers the setup dialog: `Would you like to enter the initial configuration dialog? [yes/no]:`. The exact wording varies a little between platforms and Packet Tracer. Answer `no`. You will configure everything by hand, which is how you learn what each command does.",
            hi: "Jis device mein koi saved configuration nahi hoti, woh setup dialog offer karta hai: `Would you like to enter the initial configuration dialog? [yes/no]:`. Exact wording platform aur Packet Tracer ke hisaab se thoda alag ho sakta hai. Jawab do `no`. Sab kuch haath se configure karoge, tabhi samajh aayega ki har command kya karta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "In Packet Tracer", hi: "Packet Tracer mein" },
          text: {
            en: "Connect a Console cable from the PC's RS 232 port to the switch's Console port, then open Desktop > Terminal on the PC. The defaults are already 9600 8N1, so just click OK. You can also click the switch and use its CLI tab.",
            hi: "PC ke RS 232 port se switch ke Console port tak Console cable lagao, phir PC par Desktop > Terminal kholo. Defaults pehle se 9600 8N1 hain, bas OK click karo. Chaaho toh switch par click karke uska CLI tab bhi use kar sakte ho.",
          },
        },
      ],
    },
    {
      id: "modes",
      heading: { en: "The command modes", hi: "Command modes" },
      blocks: [
        {
          type: "p",
          text: {
            en: "IOS separates looking from changing. Each mode has its own prompt, so the prompt always tells you where you are and what you are allowed to do.",
            hi: "IOS mein dekhna aur badalna alag-alag rakha gaya hai. Har mode ka apna prompt hota hai, isliye prompt dekh kar hamesha pata chalta hai ki tum kahan ho aur kya kar sakte ho.",
          },
        },
        {
          type: "table",
          caption: { en: "The modes you will use in every lab", hi: "Woh modes jo har lab mein use honge" },
          columns: [{ en: "Mode", hi: "Mode" }, "Prompt", { en: "How you get there", hi: "Wahan kaise pahunchein" }, { en: "What it is for", hi: "Kis kaam ke liye" }],
          rows: [
            ["User EXEC", "`SW1>`", { en: "Log in on the console", hi: "Console par login karke" }, { en: "Basic checks: ping, traceroute, a few show commands", hi: "Basic checks: ping, traceroute, kuch show commands" }],
            ["Privileged EXEC", "`SW1#`", "`enable`", { en: "Every show command, saving, reload, debug", hi: "Har show command, saving, reload, debug" }],
            ["Global configuration", "`SW1(config)#`", "`configure terminal`", { en: "Settings for the whole device, such as the hostname", hi: "Poore device ki settings, jaise hostname" }],
            ["Interface configuration", "`SW1(config-if)#`", "`interface gigabitethernet0/1`", { en: "Settings for one interface", hi: "Sirf ek interface ki settings" }],
            ["Line configuration", "`SW1(config-line)#`", "`line console 0`", { en: "Settings for the console and remote-login lines", hi: "Console aur remote-login lines ki settings" }],
          ],
        },
        {
          type: "table",
          caption: { en: "Moving back out", hi: "Wapas bahar kaise aayein" },
          columns: [{ en: "Type", hi: "Type karo" }, { en: "From", hi: "Kahan se" }, { en: "Goes to", hi: "Kahan jaata hai" }],
          rows: [
            ["`exit`", { en: "A sub-mode such as `(config-if)#`", hi: "`(config-if)#` jaisa sub-mode" }, { en: "One level up: `(config)#`", hi: "Ek level upar: `(config)#`" }],
            ["`exit`", "`(config)#`", { en: "Privileged EXEC: `#`", hi: "Privileged EXEC: `#`" }],
            [{ en: "`end` or Ctrl+Z", hi: "`end` ya Ctrl+Z" }, { en: "Any configuration mode", hi: "Koi bhi configuration mode" }, { en: "Straight to privileged EXEC: `#`", hi: "Seedha privileged EXEC: `#`" }],
            ["`disable`", "`#`", { en: "User EXEC: `>`", hi: "User EXEC: `>`" }],
            ["`exit`", { en: "`>` or `#`", hi: "`>` ya `#`" }, { en: "Ends the session (you log out)", hi: "Session khatam (logout ho jaate ho)" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Config commands need config mode", hi: "Config commands ke liye config mode chahiye" },
          text: {
            en: "Configuration commands only work in a configuration mode, and `show` commands only in the EXEC modes. Inside a configuration mode, put `do` in front to run an EXEC command without leaving: `do show running-config`.",
            hi: "Configuration commands sirf configuration mode mein chalte hain, aur `show` commands sirf EXEC modes mein. Configuration mode ke andar se EXEC command chalana ho toh aage `do` lagao, mode chhodne ki zaroorat nahi: `do show running-config`.",
          },
        },
      ],
    },
    {
      id: "help-and-shortcuts",
      heading: { en: "Help, shortcuts and error messages", hi: "Help, shortcuts aur error messages" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Nobody memorises every IOS command. The CLI helps you find the next word, and it lets you type far less.",
            hi: "IOS ke saare commands koi yaad nahi rakhta. CLI khud agla word dhoondhne mein help karta hai, aur bahut kam type karna padta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Help and shortcut keys", hi: "Help aur shortcut keys" },
          columns: [{ en: "Type", hi: "Type karo" }, { en: "What happens", hi: "Kya hota hai" }],
          rows: [
            ["`?`", { en: "Lists every command available in the current mode", hi: "Current mode ke saare available commands list karta hai" }],
            [{ en: "`sh?` (no space)", hi: "`sh?` (bina space)" }, { en: "Lists the commands that start with \"sh\"", hi: "\"sh\" se shuru hone wale commands list karta hai" }],
            [{ en: "`show ?` (with a space)", hi: "`show ?` (space ke saath)" }, { en: "Lists the keywords that can come next. `<cr>` in the list means you can press Enter now", hi: "Aage aa sakne wale keywords list karta hai. List mein `<cr>` ka matlab hai ab Enter daba sakte ho" }],
            ["Tab", { en: "Completes a partly typed keyword if only one command matches", hi: "Adhoora keyword poora kar deta hai, agar sirf ek command match kare" }],
            ["`conf t`, `sh run`, `int g0/1`", { en: "Abbreviations work as long as they match only one command", hi: "Abbreviations tab tak chalte hain jab tak sirf ek command se match karein" }],
            [{ en: "Up arrow or Ctrl+P", hi: "Up arrow ya Ctrl+P" }, { en: "Recalls earlier commands (the last 10 by default). `show history` lists them", hi: "Pichhle commands wapas laata hai (default mein last 10). `show history` unhe list karta hai" }],
            ["Ctrl+Shift+6", { en: "Breaks out of a long ping, traceroute or name lookup", hi: "Lambe ping, traceroute ya name lookup se bahar nikalta hai" }],
          ],
        },
        {
          type: "cli",
          title: { en: "The three error messages you will see most", hi: "Teen error messages jo sabse zyada dikhenge" },
          lines: [
            { prompt: "SW1#", cmd: "co" },
            { out: '% Ambiguous command:  "co"', comment: { en: "configure, copy and connect all start with co: type more letters", hi: "configure, copy aur connect sab co se shuru hote hain: aur letters type karo" } },
            { prompt: "SW1(config)#", cmd: "hostname" },
            { out: "% Incomplete command.", comment: { en: "The command needs more: here, the new name", hi: "Command ko aur chahiye: yahan naya naam" } },
            { prompt: "SW1(config)#", cmd: "show running-config" },
            { out: "            ^" },
            { out: "% Invalid input detected at '^' marker.", comment: { en: "show is not a config command: use do show running-config", hi: "show config command nahi hai: do show running-config use karo" } },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "The typo that freezes your console", hi: "Woh typo jo console ko atka deta hai" },
          text: {
            en: "At a `>` or `#` prompt, IOS treats an unknown single word, such as `shwo`, as the name of a host to connect to, and first asks DNS for its address. The console can hang while it waits. Press **Ctrl+Shift+6** to abort, and add `no ip domain-lookup` in global configuration on lab devices so typos fail at once.",
            hi: "`>` ya `#` prompt par IOS kisi anjaan single word, jaise `shwo`, ko connect karne wale host ka naam samajhta hai, aur pehle DNS se uska address poochta hai. Jab tak jawab ka wait hota hai, console atka rehta hai. Bahar nikalne ke liye **Ctrl+Shift+6** dabao, aur lab devices par global configuration mein `no ip domain-lookup` daal do taaki typo turant fail ho.",
          },
        },
      ],
    },
    {
      id: "running-vs-startup",
      heading: { en: "Running-config and startup-config", hi: "Running-config aur startup-config" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A Cisco device keeps two copies of its configuration. The **running-config** is in RAM and is what the device is doing right now; every configuration command changes it the moment you press Enter. The **startup-config** is in **NVRAM** and is loaded at boot. RAM is wiped when the device restarts, so anything you did not copy to the startup-config is lost.",
            hi: "Cisco device apni configuration ki do copies rakhta hai. **Running-config** RAM mein hoti hai aur dikhati hai ki device abhi kya kar raha hai; har configuration command Enter dabate hi ise badal deta hai. **Startup-config** **NVRAM** mein hoti hai aur boot ke time load hoti hai. Device restart hote hi RAM saaf ho jaati hai, isliye jo startup-config mein copy nahi kiya, woh gaya.",
          },
        },
        {
          type: "table",
          columns: ["", "running-config", "startup-config"],
          rows: [
            [{ en: "Stored in", hi: "Kahan store hoti hai" }, "RAM", "NVRAM"],
            [{ en: "Changes when", hi: "Kab badalti hai" }, { en: "Instantly, with every config command", hi: "Turant, har config command ke saath" }, { en: "Only when you save", hi: "Sirf jab tum save karo" }],
            [{ en: "After a reboot", hi: "Reboot ke baad" }, { en: "Rebuilt from the startup-config", hi: "Startup-config se dobara banti hai" }, { en: "Unchanged", hi: "Waisi hi rehti hai" }],
            [{ en: "View it with", hi: "Kaise dekhein" }, "`show running-config`", "`show startup-config`"],
          ],
        },
        {
          type: "cli",
          title: { en: "Two ways to save", hi: "Save karne ke do tareeke" },
          lines: [
            { prompt: "SW1#", cmd: "copy running-config startup-config" },
            { out: "Destination filename [startup-config]?", comment: { en: "Press Enter to accept the default name", hi: "Default naam accept karne ke liye Enter dabao" } },
            { out: "Building configuration..." },
            { out: "[OK]" },
            { prompt: "SW1#", cmd: "write memory", comment: { en: "Older command, same result", hi: "Purana command, result same" } },
            { out: "Building configuration..." },
            { out: "[OK]" },
          ],
        },
        {
          type: "p",
          text: {
            en: "`show running-config` gets long quickly, so filter it with a pipe. `| include hostname` shows only matching lines, `| section line con` shows a whole block, and `| begin interface` starts the output at the first match.",
            hi: "`show running-config` jaldi lambi ho jaati hai, isliye pipe se filter karo. `| include hostname` sirf matching lines dikhata hai, `| section line con` poora block dikhata hai, aur `| begin interface` output ko pehle match se shuru karta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Undo a mess you have not saved", hi: "Bina save ki hui gadbad undo karo" },
          text: {
            en: "`reload` restarts the device. If there are unsaved changes, IOS asks `System configuration has been modified. Save? [yes/no]:`. Answer `no`, and the device boots from the last saved startup-config, so your unsaved mistakes are gone.",
            hi: "`reload` device ko restart karta hai. Agar unsaved changes hain toh IOS poochta hai `System configuration has been modified. Save? [yes/no]:`. Jawab do `no`, aur device pichhli saved startup-config se boot hoga, yaani bina save ki galtiyan khatam.",
          },
        },
      ],
    },
    {
      id: "first-config",
      heading: { en: "A first secure configuration", hi: "Pehli secure configuration" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every new device should get at least a name, a protected privileged mode and a protected console. These are the first commands in almost every lab.",
            hi: "Har naye device ko kam se kam ek naam, protected privileged mode aur protected console milna chahiye. Lagbhag har lab ke pehle commands yahi hote hain.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "`hostname SW1` names the device. The prompt changes at once, so you always know which device you are typing on.",
              hi: "`hostname SW1` device ko naam deta hai. Prompt turant badal jaata hai, isliye hamesha pata rehta hai ki kis device par type kar rahe ho.",
            },
            {
              en: "`enable secret` sets the password for the `enable` command and stores it as a one-way hash. The older `enable password` stores it in clear text. If both are set, the secret wins, so configure only `enable secret`.",
              hi: "`enable secret` `enable` command ka password set karta hai aur use one-way hash bana kar store karta hai. Purana `enable password` use clear text mein rakhta hai. Dono set hon toh secret hi chalta hai, isliye sirf `enable secret` configure karo.",
            },
            {
              en: "Under `line console 0`, `password` sets the console password and `login` tells IOS to ask for it. A password without `login` is never checked.",
              hi: "`line console 0` ke andar `password` console password set karta hai aur `login` IOS ko use poochne ko kehta hai. `login` ke bina password kabhi check hi nahi hota.",
            },
            {
              en: "`service password-encryption` scrambles clear-text passwords in the configuration (type 7). It only stops someone reading them over your shoulder; type 7 can be reversed in seconds.",
              hi: "`service password-encryption` configuration ke clear-text passwords ko scramble karta hai (type 7). Yeh bas itna rokta hai ki koi kandhe ke upar se padh na le; type 7 seconds mein reverse ho sakta hai.",
            },
            {
              en: "`banner motd` sets a message shown before login, usually a legal warning. The first character after `motd` is the delimiter, and the text ends at the next copy of it.",
              hi: "`banner motd` login se pehle dikhne wala message set karta hai, aam taur par legal warning. `motd` ke baad ka pehla character delimiter hota hai, aur text wahi character dobara aane par khatam hota hai.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "The whole first configuration", hi: "Poori pehli configuration" },
          lines: [
            { prompt: "Switch>", cmd: "enable" },
            { prompt: "Switch#", cmd: "configure terminal" },
            { out: "Enter configuration commands, one per line.  End with CNTL/Z." },
            { prompt: "Switch(config)#", cmd: "hostname SW1" },
            { prompt: "SW1(config)#", cmd: "enable secret Cisco123" },
            { prompt: "SW1(config)#", cmd: "line console 0" },
            { prompt: "SW1(config-line)#", cmd: "password ConPass1" },
            { prompt: "SW1(config-line)#", cmd: "login" },
            { prompt: "SW1(config-line)#", cmd: "exit" },
            { prompt: "SW1(config)#", cmd: "service password-encryption" },
            { prompt: "SW1(config)#", cmd: "banner motd # Authorized access only #" },
            { prompt: "SW1(config)#", cmd: "no ip domain-lookup" },
            { prompt: "SW1(config)#", cmd: "end" },
            { prompt: "SW1#", cmd: "copy running-config startup-config" },
          ],
        },
        {
          type: "cli",
          title: { en: "What the config now shows", hi: "Config mein ab kya dikhta hai" },
          lines: [
            { prompt: "SW1#", cmd: "show running-config | include hostname|secret|password" },
            { out: "service password-encryption" },
            { out: "hostname SW1" },
            { out: "enable secret 5 $1$mERr$RldxcCZEZsTFTETUyRaA50", comment: { en: "Type 5: an MD5-based hash of Cisco123", hi: "Type 5: Cisco123 ka MD5-based hash" } },
            { out: " password 7 080243403918160443", comment: { en: "Type 7: ConPass1, scrambled but reversible", hi: "Type 7: ConPass1, scrambled lekin reversible" } },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Know the password types", hi: "Password types yaad rakho" },
          text: {
            en: "`enable password` and line passwords are clear text unless `service password-encryption` turns them into weak type 7. `enable secret` is always hashed: type 5 on most IOS 15 devices and in Packet Tracer, while newer releases can use type 8 or 9. Local usernames and SSH come in later lessons.",
            hi: "`enable password` aur line passwords clear text mein rehte hain, jab tak `service password-encryption` unhe kamzor type 7 mein na badal de. `enable secret` hamesha hash hota hai: zyaadatar IOS 15 devices aur Packet Tracer mein type 5, aur naye releases type 8 ya 9 bhi use kar sakte hain. Local usernames aur SSH aage ke lessons mein aayenge.",
          },
        },
      ],
    },
    {
      id: "no-and-do",
      heading: { en: "Undo with no, run EXEC commands with do", hi: "no se undo, do se EXEC commands" },
      blocks: [
        {
          type: "p",
          text: {
            en: "IOS has no undo button. To remove or reverse a setting, repeat the command with `no` in front: `no banner motd` deletes the banner, `no ip domain-lookup` turns name lookups off, and on an interface `no shutdown` turns the port on.",
            hi: "IOS mein koi undo button nahi hai. Koi setting hatani ya ulti karni ho toh wahi command aage `no` lagakar dobara likho: `no banner motd` banner hata deta hai, `no ip domain-lookup` name lookup band kar deta hai, aur interface par `no shutdown` port ko on karta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "Configuration modes do not accept EXEC commands. Instead of typing `end`, checking something and typing `configure terminal` again, prefix the command with `do`.",
            hi: "Configuration modes EXEC commands accept nahi karte. `end` likh kar check karna aur phir dobara `configure terminal` likhne ki jagah, command ke aage `do` laga do.",
          },
        },
        {
          type: "cli",
          lines: [
            { prompt: "SW1(config)#", cmd: "no banner motd", comment: { en: "Deletes the banner", hi: "Banner hata deta hai" } },
            { prompt: "SW1(config)#", cmd: "do show running-config | include banner", comment: { en: "No output: the banner is gone", hi: "Koi output nahi: banner hat gaya" } },
            { prompt: "SW1(config)#", cmd: "do show running-config | include hostname" },
            { out: "hostname SW1" },
            { prompt: "SW1(config)#", cmd: "do write memory", comment: { en: "Save without leaving config mode", hi: "Config mode chhode bina save karo" } },
            { out: "Building configuration..." },
            { out: "[OK]" },
          ],
        },
      ],
    },
  ],
  terms: [
    { term: "User EXEC mode", def: { en: "The `>` mode you reach after login. Basic checks only; no configuration and few show commands.", hi: "Login ke baad wala `>` mode. Sirf basic checks; configuration nahi aur show commands bhi kam." } },
    { term: "Privileged EXEC mode", def: { en: "The `#` mode reached with `enable`. All show commands, saving, reloading and debugging.", hi: "`enable` se milne wala `#` mode. Saare show commands, save, reload aur debug yahin se." } },
    { term: "Global configuration mode", def: { en: "The `(config)#` mode reached with `configure terminal`. Commands here change the whole device.", hi: "`configure terminal` se milne wala `(config)#` mode. Yahan ke commands poore device ko badalte hain." } },
    { term: "running-config", def: { en: "The active configuration in RAM. It changes as you type and is lost on reboot unless saved.", hi: "RAM mein chal rahi active configuration. Type karte hi badalti hai aur save na karo toh reboot par chali jaati hai." } },
    { term: "startup-config", def: { en: "The saved configuration in NVRAM that the device loads when it boots.", hi: "NVRAM mein saved configuration jo device boot hote time load karta hai." } },
    { term: "NVRAM", def: { en: "Non-volatile RAM: memory that keeps its contents without power, where the startup-config lives.", hi: "Non-volatile RAM: aisi memory jo power jaane par bhi data rakhti hai, startup-config yahin rehti hai." } },
    { term: "enable secret", def: { en: "The hashed password that protects privileged EXEC mode. It overrides enable password.", hi: "Hashed password jo privileged EXEC mode ko protect karta hai. Yeh enable password ko override karta hai." } },
    { term: "Console port", def: { en: "A serial management port for direct access with a rollover or USB cable, at 9600 8N1 by default.", hi: "Direct access ke liye serial management port, rollover ya USB cable ke saath, default 9600 8N1 par." } },
  ],
  commands: [
    { cmd: "enable", mode: "User EXEC", does: { en: "Go to privileged EXEC mode", hi: "Privileged EXEC mode mein jao" } },
    { cmd: "disable", mode: "Privileged EXEC", does: { en: "Go back to user EXEC mode", hi: "Wapas user EXEC mode mein jao" } },
    { cmd: "configure terminal", mode: "Privileged EXEC", does: { en: "Enter global configuration mode", hi: "Global configuration mode mein jao" } },
    { cmd: "exit", mode: "Any mode", does: { en: "Go up one level; at > or # it ends the session", hi: "Ek level upar jao; > ya # par session khatam karta hai" } },
    { cmd: "end (or Ctrl+Z)", mode: "Any configuration mode", does: { en: "Return straight to privileged EXEC", hi: "Seedha privileged EXEC par wapas" } },
    { cmd: "hostname SW1", mode: "Global configuration", does: { en: "Set the device name, which also changes the prompt", hi: "Device ka naam set karo, prompt bhi badal jaata hai" } },
    { cmd: "enable secret Cisco123", mode: "Global configuration", does: { en: "Set a hashed password for privileged EXEC", hi: "Privileged EXEC ke liye hashed password set karo" } },
    { cmd: "enable password <password>", mode: "Global configuration", does: { en: "Older clear-text version; ignored when enable secret is set", hi: "Purana clear-text version; enable secret set ho toh ignore hota hai" } },
    { cmd: "line console 0", mode: "Global configuration", does: { en: "Enter line configuration for the console port", hi: "Console port ki line configuration mein jao" } },
    { cmd: "password ConPass1", mode: "Line configuration", does: { en: "Set the password for this line", hi: "Is line ka password set karo" } },
    { cmd: "login", mode: "Line configuration", does: { en: "Ask for the line password when someone connects", hi: "Connect karne wale se line password maango" } },
    { cmd: "service password-encryption", mode: "Global configuration", does: { en: "Store clear-text passwords as weak type 7", hi: "Clear-text passwords ko kamzor type 7 mein store karo" } },
    { cmd: "banner motd # Authorized access only #", mode: "Global configuration", does: { en: "Show a message before login", hi: "Login se pehle message dikhao" } },
    { cmd: "no ip domain-lookup", mode: "Global configuration", does: { en: "Stop IOS from looking up mistyped commands as hostnames", hi: "Galat type kiye commands ko hostname samajh kar lookup karna band karo" } },
    { cmd: "show running-config", mode: "Privileged EXEC", does: { en: "Show the active configuration in RAM", hi: "RAM ki active configuration dikhao" } },
    { cmd: "show startup-config", mode: "Privileged EXEC", does: { en: "Show the saved configuration in NVRAM", hi: "NVRAM ki saved configuration dikhao" } },
    { cmd: "copy running-config startup-config", mode: "Privileged EXEC", does: { en: "Save the running-config to NVRAM", hi: "Running-config ko NVRAM mein save karo" } },
    { cmd: "write memory", mode: "Privileged EXEC", does: { en: "Older command with the same effect as the copy", hi: "Purana command, copy jaisa hi result" } },
    { cmd: "show history", mode: "User or privileged EXEC", does: { en: "List the commands you entered recently", hi: "Haal mein type kiye commands list karo" } },
    { cmd: "do <command>", mode: "Any configuration mode", does: { en: "Run an EXEC command without leaving configuration mode", hi: "Configuration mode chhode bina EXEC command chalao" } },
    { cmd: "reload", mode: "Privileged EXEC", does: { en: "Restart the device; it boots from the startup-config", hi: "Device restart karo; woh startup-config se boot hota hai" } },
  ],
  mistakes: [
    {
      en: "Configuring and not saving. The running-config lives in RAM, so after a power cut the device boots from the old startup-config. Save with `copy running-config startup-config`.",
      hi: "Configure karna aur save na karna. Running-config RAM mein rehti hai, isliye power jaane ke baad device purani startup-config se boot hota hai. `copy running-config startup-config` se save karo.",
    },
    {
      en: "Setting a console `password` but forgetting `login`. Without `login`, IOS never asks for the password.",
      hi: "Console par `password` set karna lekin `login` bhool jaana. `login` ke bina IOS password kabhi poochta hi nahi.",
    },
    {
      en: "Using `enable password` and thinking it is safe. It sits in the config in clear text. Use `enable secret`, which is hashed and wins if both are set.",
      hi: "`enable password` use karke sochna ki safe hai. Yeh config mein clear text mein padha rehta hai. `enable secret` use karo, jo hashed hai aur dono set hon toh wahi chalta hai.",
    },
    {
      en: "Believing `service password-encryption` makes passwords secure. Type 7 can be reversed in seconds; it only hides passwords from a casual glance.",
      hi: "Yeh maanna ki `service password-encryption` passwords ko secure kar deta hai. Type 7 seconds mein reverse ho jaata hai; yeh sirf sarsari nazar se passwords chhupata hai.",
    },
    {
      en: "Typing `show` commands in configuration mode and getting `% Invalid input detected`. Use `do show ...`, or leave with `end` first.",
      hi: "Configuration mode mein `show` commands type karke `% Invalid input detected` paana. `do show ...` use karo, ya pehle `end` se bahar aao.",
    },
    {
      en: "Mixing up `exit` and `end`. `exit` goes up one level, and at the `#` prompt it logs you out; `end` goes straight to privileged EXEC.",
      hi: "`exit` aur `end` mein confuse hona. `exit` ek level upar le jaata hai, aur `#` prompt par logout kar deta hai; `end` seedha privileged EXEC par le aata hai.",
    },
  ],
  recap: [
    { en: "Console: rollover or USB cable, 9600 baud, 8 data bits, no parity, 1 stop bit, no flow control.", hi: "Console: rollover ya USB cable, 9600 baud, 8 data bits, no parity, 1 stop bit, no flow control." },
    { en: "`>` user EXEC → `enable` → `#` privileged → `configure terminal` → `(config)#` → sub-modes such as `(config-if)#` and `(config-line)#`.", hi: "`>` user EXEC → `enable` → `#` privileged → `configure terminal` → `(config)#` → sub-modes jaise `(config-if)#` aur `(config-line)#`." },
    { en: "`exit` goes up one level, `end` or Ctrl+Z returns to `#`, and `do` runs EXEC commands from configuration mode.", hi: "`exit` ek level upar le jaata hai, `end` ya Ctrl+Z `#` par wapas laata hai, aur `do` configuration mode se EXEC commands chalata hai." },
    { en: "`sh?` lists commands starting with sh; `show ?` lists the next keywords. Tab completes, unique abbreviations work, Ctrl+Shift+6 breaks.", hi: "`sh?` sh se shuru hone wale commands dikhata hai; `show ?` agle keywords dikhata hai. Tab complete karta hai, unique abbreviations chalte hain, Ctrl+Shift+6 se break karo." },
    { en: "running-config is in RAM and live; startup-config is in NVRAM and used at boot. Save with `copy running-config startup-config` or `write memory`.", hi: "Running-config RAM mein hai aur live hai; startup-config NVRAM mein hai aur boot par use hoti hai. `copy running-config startup-config` ya `write memory` se save karo." },
    { en: "`enable secret` (hashed) beats `enable password` (clear text). The console needs `password` plus `login`. Type 7 is weak.", hi: "`enable secret` (hashed) `enable password` (clear text) se upar hai. Console ko `password` aur `login` dono chahiye. Type 7 kamzor hai." },
  ],
  quiz: [
    {
      q: {
        en: "Your prompt is `SW1(config-line)#`. Which command takes you straight to `SW1#`?",
        hi: "Tumhara prompt `SW1(config-line)#` hai. Kaunsa command tumhe seedha `SW1#` par le jaayega?",
      },
      options: [
        { en: "exit", hi: "exit" },
        { en: "end", hi: "end" },
        { en: "disable", hi: "disable" },
        { en: "logout", hi: "logout" },
      ],
      answer: 1,
      explain: {
        en: "`end` (or Ctrl+Z) leaves any configuration mode and returns to privileged EXEC. `exit` would only go up one level, to `SW1(config)#`. `disable` and `logout` are EXEC commands, not configuration commands.",
        hi: "`end` (ya Ctrl+Z) kisi bhi configuration mode se nikal kar privileged EXEC par le aata hai. `exit` sirf ek level upar, `SW1(config)#` tak le jaata. `disable` aur `logout` EXEC commands hain, configuration commands nahi.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A switch has both `enable password Pass1` and `enable secret Cisco123` configured. Which password does the `enable` command accept?",
        hi: "Ek switch par `enable password Pass1` aur `enable secret Cisco123` dono configured hain. `enable` command kaunsa password accept karega?",
      },
      options: [
        { en: "Pass1 only", hi: "Sirf Pass1" },
        { en: "Either one", hi: "Dono mein se koi bhi" },
        { en: "Neither, until the switch reloads", hi: "Koi nahi, jab tak switch reload na ho" },
        { en: "Cisco123 only", hi: "Sirf Cisco123" },
      ],
      answer: 3,
      explain: {
        en: "When both are configured, `enable secret` takes precedence and the `enable password` is ignored. That is why you should configure only the secret, which is also stored as a hash.",
        hi: "Jab dono configured hon, toh `enable secret` ki priority hoti hai aur `enable password` ignore ho jaata hai. Isiliye sirf secret configure karna chahiye, jo hash bana kar store bhi hota hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "You configured `line console 0` and `password ConPass1`, but the console never asks for a password. What is missing?",
        hi: "Tumne `line console 0` aur `password ConPass1` configure kiya, lekin console kabhi password nahi poochta. Kya missing hai?",
      },
      options: [
        { en: "The login command under the console line", hi: "Console line ke andar login command" },
        { en: "service password-encryption", hi: "service password-encryption" },
        { en: "An enable secret", hi: "Enable secret" },
        { en: "A banner motd", hi: "Banner motd" },
      ],
      answer: 0,
      explain: {
        en: "`password` only stores the password; `login` is what tells IOS to check it on that line. `service password-encryption` just changes how the password is stored, and the enable secret protects privileged mode, not the console login.",
        hi: "`password` sirf password store karta hai; us line par use check karwane ka kaam `login` karta hai. `service password-encryption` sirf store karne ka tarika badalta hai, aur enable secret privileged mode ko protect karta hai, console login ko nahi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "You configure a switch, verify it works, and leave. Overnight the power fails. In the morning the prompt is `Switch>` and your settings are gone. Why?",
        hi: "Tumne switch configure kiya, check kiya ki chal raha hai, aur chale gaye. Raat ko power chali gayi. Subah prompt `Switch>` hai aur settings gayab hain. Kyun?",
      },
      options: [
        { en: "The startup-config was corrupted by the power cut", hi: "Power cut se startup-config corrupt ho gayi" },
        { en: "You forgot to run service password-encryption", hi: "Tum service password-encryption chalana bhool gaye" },
        { en: "The changes were only in the running-config and were never saved", hi: "Changes sirf running-config mein the aur kabhi save nahi hue" },
        { en: "Switches reset to factory defaults after every reboot", hi: "Switch har reboot ke baad factory defaults par reset hota hai" },
      ],
      answer: 2,
      explain: {
        en: "The running-config is in RAM, which is wiped at power loss. At boot the switch loaded the startup-config from NVRAM, which never received your changes. `copy running-config startup-config` would have kept them.",
        hi: "Running-config RAM mein hoti hai, jo power jaate hi saaf ho jaati hai. Boot par switch ne NVRAM se startup-config load ki, jisme tumhare changes kabhi gaye hi nahi the. `copy running-config startup-config` karte toh changes bache rehte.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "The running-config shows ` password 7 080243403918160443` under `line con 0`. What does the 7 mean?",
        hi: "Running-config mein `line con 0` ke neeche ` password 7 080243403918160443` dikhta hai. Is 7 ka kya matlab hai?",
      },
      options: [
        { en: "The password is 7 characters long", hi: "Password 7 characters ka hai" },
        { en: "It was scrambled by service password-encryption and can be reversed", hi: "Ise service password-encryption ne scramble kiya hai aur yeh reverse ho sakta hai" },
        { en: "It is a one-way MD5 hash", hi: "Yeh one-way MD5 hash hai" },
        { en: "It applies to console line 7", hi: "Yeh console line 7 par lagta hai" },
      ],
      answer: 1,
      explain: {
        en: "Type 7 is the weak scrambling that `service password-encryption` applies to clear-text passwords, and free tools reverse it instantly. The one-way MD5-based hash is type 5, which is what `enable secret` uses.",
        hi: "Type 7 woh kamzor scrambling hai jo `service password-encryption` clear-text passwords par lagata hai, aur free tools ise turant reverse kar dete hain. One-way MD5-based hash type 5 hai, jo `enable secret` use karta hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "At the `SW1#` prompt, what do you type to list the keywords that can follow the `show` command?",
        hi: "`SW1#` prompt par `show` command ke baad aa sakne wale keywords list karne ke liye kya type karoge?",
      },
      options: [
        { en: "show?", hi: "show?" },
        { en: "help show", hi: "help show" },
        { en: "show ?", hi: "show ?" },
        { en: "? show", hi: "? show" },
      ],
      answer: 2,
      explain: {
        en: "With a space before the question mark, `show ?` lists what can come next. Without the space, `show?` lists commands whose names start with \"show\", which is a different question.",
        hi: "Question mark se pehle space ho, toh `show ?` batata hai ki aage kya aa sakta hai. Bina space ke `show?` un commands ko list karta hai jinka naam \"show\" se shuru hota hai, jo alag sawaal hai.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "IYbtai7Nu2g",
      title: "Free CCNA | Intro to the CLI | Day 4",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Console cables and settings, the IOS modes, enable password versus enable secret, running versus startup config and service password-encryption.",
        hi: "Console cables aur settings, IOS modes, enable password vs enable secret, running vs startup config aur service password-encryption.",
      },
    },
    {
      id: "SDocmq1c05s",
      title: "Free CCNA | Basic Device Security | Day 4 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The Packet Tracer lab that goes with Day 4. Do it after this lesson's lab.", hi: "Day 4 ke saath wala Packet Tracer lab. Is lesson ka lab karne ke baad karo." },
    },
    {
      id: "LatQVW0B7hc",
      title: "39. Free CCNA (NEW) | Router & iOS - CISCO Basic Commands - Part 1",
      channel: "Network Nuggets",
      lang: "hi",
      note: {
        en: "A Hindi walkthrough of the first IOS commands on a router. The same commands work on a switch.",
        hi: "Router par pehle IOS commands ka Hindi walkthrough. Switch par bhi yahi commands chalte hain.",
      },
    },
    {
      id: "XKdI6MDcqCs",
      title: "17. Cisco IOS CLI Modes Explained | CCNA 200-301 (Hindi) Course",
      channel: "NetworkPath",
      lang: "hi",
      note: { en: "A short Hindi video on user, privileged and configuration modes.", hi: "User, privileged aur configuration modes par chhota Hindi video." },
    },
  ],
  lab: {
    title: { en: "Give a new switch a name and passwords", hi: "Naye switch ko naam aur passwords do" },
    steps: [
      {
        en: "In Packet Tracer, add a 2960 switch and a PC. Connect a Console cable from the PC's RS 232 port to the switch's Console port, then open Desktop > Terminal and keep 9600 8N1.",
        hi: "Packet Tracer mein ek 2960 switch aur ek PC lo. PC ke RS 232 port se switch ke Console port tak Console cable lagao, phir Desktop > Terminal kholo aur 9600 8N1 hi rehne do.",
      },
      {
        en: "Answer `no` to the setup dialog and go to `#` with `enable`. Try `?`, `sh?` and `show ?` and compare the three lists.",
        hi: "Setup dialog ko `no` bolo aur `enable` se `#` par jao. `?`, `sh?` aur `show ?` try karo aur teeno lists compare karo.",
      },
      {
        en: "In global configuration set `hostname SW1`, `enable secret Cisco123` and `no ip domain-lookup`. Under `line console 0` set `password ConPass1` and `login`.",
        hi: "Global configuration mein `hostname SW1`, `enable secret Cisco123` aur `no ip domain-lookup` set karo. `line console 0` ke andar `password ConPass1` aur `login` do.",
      },
      {
        en: "Add `service password-encryption` and a `banner motd`, then run `do show running-config` and find the type 5 and type 7 lines.",
        hi: "`service password-encryption` aur ek `banner motd` add karo, phir `do show running-config` chala kar type 5 aur type 7 wali lines dhoondho.",
      },
      {
        en: "Save with `copy running-config startup-config`. Type `exit`, press Enter, and log back in to test the banner, the console password and the enable secret.",
        hi: "`copy running-config startup-config` se save karo. `exit` likho, Enter dabao, aur wapas login karke banner, console password aur enable secret test karo.",
      },
      {
        en: "Change the hostname to TEST without saving, run `reload` and answer `no` when asked to save. After the boot the prompt says SW1 again: the startup-config won.",
        hi: "Hostname TEST kar do lekin save mat karo, phir `reload` chalao aur save ke sawaal par `no` bolo. Boot ke baad prompt phir se SW1 hoga: startup-config jeet gayi.",
      },
    ],
  },
};

export default lesson;
