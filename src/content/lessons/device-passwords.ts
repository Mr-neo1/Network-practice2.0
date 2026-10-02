import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "device-passwords",
  intro: {
    en: "Whoever reaches privileged EXEC on a router can reroute, copy or shut down everything that passes through it. Passwords are the first lock, but on Cisco IOS how a password is stored matters as much as whether it exists, because configs end up in backups, tickets and emails. This lesson hardens a router step by step and then looks at what a modern password policy, and the alternatives to passwords, add on top.",
    hi: "Jo bhi router ke privileged EXEC tak pahunch gaya, woh usse guzarne wala sab kuch reroute, copy ya band kar sakta hai. Passwords pehla taala hain, lekin Cisco IOS par password kaise store hota hai yeh utna hi matter karta hai jitna ki password hai ya nahi, kyunki configs backups, tickets aur emails mein pahunch jaati hain. Yeh lesson ek router ko step by step harden karta hai, aur phir dekhta hai ki modern password policy aur passwords ke alternatives upar se kya jodte hain.",
  },
  outcomes: [
    { en: "Read password lines in a running-config and say whether each is type 0, 7, 5, 8 or 9", hi: "Running-config ki password lines padh kar bata sako ki har ek type 0, 7, 5, 8 ya 9 hai" },
    { en: "Configure enable secret with scrypt and remove enable password", hi: "Scrypt ke saath enable secret configure karo aur enable password hatao" },
    { en: "Create local users and make the console and VTY lines use them with login local and exec-timeout", hi: "Local users banao aur console aur VTY lines ko login local aur exec-timeout ke saath unhe use karwao" },
    { en: "Slow down guessing with security passwords min-length and login block-for", hi: "security passwords min-length aur login block-for se guessing ko slow karo" },
    { en: "Describe password policy elements and the alternatives: MFA, digital certificates and biometrics", hi: "Password policy ke elements aur alternatives describe kar sako: MFA, digital certificates aur biometrics" },
  ],
  sections: [
    {
      id: "ways-in",
      heading: { en: "Every way into the CLI needs a lock", hi: "CLI tak pahunchne ke har raaste par taala chahiye" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A Cisco router has three kinds of login lines: the **console** (`line con 0`), the **auxiliary** port on routers that have one (`line aux 0`), and the **VTY** lines (`line vty 0 4`) that receive SSH and Telnet sessions. Many routers and switches also have `line vty 5 15`; an attacker can use any VTY line you leave open, so configure all of them. After any of these lines, the `enable` command leads to privileged EXEC. That makes four doors, and each needs its own protection.",
            hi: "Cisco router par teen tarah ki login lines hoti hain: **console** (`line con 0`), **auxiliary** port un routers par jinme hota hai (`line aux 0`), aur **VTY** lines (`line vty 0 4`) jo SSH aur Telnet sessions receive karti hain. Kai routers aur switches par `line vty 5 15` bhi hoti hai; jo bhi VTY line tum khuli chhodoge, attacker use use kar sakta hai, isliye sab configure karo. Inme se kisi bhi line ke baad `enable` command privileged EXEC tak le jaata hai. Yeh hue chaar darwaze, aur har ek ko apni protection chahiye.",
          },
        },
        {
          type: "p",
          text: {
            en: "In lesson 0.8 you set `enable secret`, a console `password` with `login`, and `service password-encryption`. That is the minimum. A production router also needs per-person accounts, idle timeouts, protection against guessing and, above all, passwords stored in a form that is useless to whoever reads a leaked config. Remote access with SSH was lesson 4.7; here we lock what SSH connects to.",
            hi: "Lesson 0.8 mein tumne `enable secret`, `login` ke saath console `password`, aur `service password-encryption` set kiya tha. Yeh minimum hai. Production router ko per-person accounts, idle timeouts, guessing se protection, aur sabse zaroori, aise form mein stored passwords chahiye jo leaked config padhne wale ke kisi kaam ke na hon. SSH se remote access lesson 4.7 tha; yahan hum us cheez ko lock karte hain jisse SSH connect hota hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Configs travel", hi: "Configs ghoomti rehti hain" },
          text: {
            en: "Running-configs are copied to TFTP servers, pasted into support tickets and attached to emails. Assume an attacker will one day read yours, and make sure the password lines in it are hashes they cannot reverse.",
            hi: "Running-configs TFTP servers par copy hoti hain, support tickets mein paste hoti hain aur emails mein attach hoti hain. Maan ke chalo ki ek din attacker tumhari config padh lega, aur pakka karo ki usme password lines aise hashes hon jinhe woh reverse na kar sake.",
          },
        },
      ],
    },
    {
      id: "password-types",
      heading: { en: "How IOS stores a password: types 0, 7, 5, 8 and 9", hi: "IOS password kaise store karta hai: types 0, 7, 5, 8 aur 9" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The number after `secret` or `password` in the running-config tells you the storage type. A **hash** is one-way: IOS hashes what you type at login and compares the result, so the password itself is never stored. **Type 7** is not a hash; it is a cipher with a key that has been public for decades, so anyone can turn it back into the password.",
            hi: "Running-config mein `secret` ya `password` ke baad wala number storage type batata hai. **Hash** one-way hota hai: login par tum jo type karte ho IOS uska hash banakar compare karta hai, isliye password khud kabhi store nahi hota. **Type 7** hash nahi hai; yeh ek cipher hai jiski key barson se public hai, isliye koi bhi ise wapas password mein badal sakta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Password types you will see in a running-config", hi: "Running-config mein dikhne wale password types" },
          columns: [{ en: "Type", hi: "Type" }, { en: "Stored as", hi: "Kaise store hota hai" }, { en: "Created by", hi: "Kaun banata hai" }, { en: "Verdict", hi: "Verdict" }],
          rows: [
            ["0", { en: "Clear text", hi: "Clear text" }, "`enable password`, line `password`, `username ... password`", { en: "Anyone reading the config sees it", hi: "Config padhne wala seedha dekh leta hai" }],
            ["7", { en: "Reversible Cisco cipher", hi: "Reversible Cisco cipher" }, "`service password-encryption` on type 0", { en: "Hides it from a glance only; reversed in seconds", hi: "Sirf sarsari nazar se chhupata hai; seconds mein reverse" }],
            ["5", { en: "Salted MD5 hash", hi: "Salted MD5 hash" }, { en: "`enable secret` or `username ... secret` (default on IOS 15)", hi: "`enable secret` ya `username ... secret` (IOS 15 par default)" }, { en: "One-way, but MD5 is fast to brute-force; being phased out", hi: "One-way, lekin MD5 brute-force karna fast hai; dheere-dheere hataya ja raha hai" }],
            ["8", { en: "PBKDF2 with SHA-256 hash", hi: "PBKDF2 with SHA-256 hash" }, "`algorithm-type sha256`", { en: "Strong", hi: "Strong" }],
            ["9", { en: "scrypt hash", hi: "scrypt hash" }, "`algorithm-type scrypt`", { en: "Strongest; the one to use", hi: "Sabse strong; yahi use karo" }],
          ],
        },
        {
          type: "cli",
          title: { en: "Upgrading the enable secret on R1", hi: "R1 par enable secret upgrade karna" },
          lines: [
            { prompt: "R1(config)#", cmd: "enable secret Cisco123", comment: { en: "Type 5 on this IOS 15 router", hi: "Is IOS 15 router par type 5" } },
            { prompt: "R1(config)#", cmd: "enable algorithm-type scrypt secret Kettle-Rain-Sky-42", comment: { en: "Replaces it with a type 9 hash", hi: "Ise type 9 hash se replace karta hai" } },
            { prompt: "R1(config)#", cmd: "no enable password", comment: { en: "Remove the old clear-text one", hi: "Purana clear-text wala hatao" } },
            { prompt: "R1(config)#", cmd: "do show running-config | include enable" },
            { out: "enable secret 9 $9$KKClHh/8YCtGie$DPJtWJDosWY6/Ly9A4Qa.4nC116h0omTXeeOITBhKsI" },
          ],
          note: {
            en: "`algorithm-type` needs IOS 15.3(3)M or later. With `sha256` instead of `scrypt` you get a type 8 line, `$8$...`. Newer IOS XE releases may use type 9 even for a plain `enable secret`, and warn when you configure type 5, so always check what the config shows.",
            hi: "`algorithm-type` ke liye IOS 15.3(3)M ya baad ka version chahiye. `scrypt` ki jagah `sha256` doge toh type 8 line milegi, `$8$...`. Naye IOS XE releases simple `enable secret` par bhi type 9 use kar sakte hain, aur type 5 configure karne par warning dete hain, isliye hamesha dekho ki config kya dikha rahi hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "If both `enable secret` and `enable password` exist, the secret is used. `service password-encryption` only turns type 0 passwords into type 7; it never touches secrets, and type 7 is reversible. Turning it off with `no service password-encryption` does not change existing type 7 lines back to clear text. The digit tells you the type: `secret 5` MD5, `secret 8` PBKDF2, `secret 9` scrypt, `password 7` reversible.",
            hi: "Agar `enable secret` aur `enable password` dono hain, toh secret use hota hai. `service password-encryption` sirf type 0 passwords ko type 7 banata hai; secrets ko kabhi nahi chhoota, aur type 7 reversible hai. `no service password-encryption` se ise off karne par bhi pehle se bani type 7 lines wapas clear text nahi banti. Digit type batata hai: `secret 5` MD5, `secret 8` PBKDF2, `secret 9` scrypt, `password 7` reversible.",
          },
        },
      ],
    },
    {
      id: "local-users",
      heading: { en: "Local users and login local", hi: "Local users aur login local" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A line password is shared by everyone who manages the device. You cannot tell who logged in, and when one engineer leaves you must change it everywhere. **Local user accounts** give each person a username and secret, and `login local` tells a line to check that database instead of the line password.",
            hi: "Line password device manage karne wale sab log share karte hain. Pata nahi chalta ki kaun login hua, aur ek engineer chhod de toh har jagah password badalna padta hai. **Local user accounts** har insaan ko apna username aur secret dete hain, aur `login local` line ko kehta hai ki line password ki jagah yeh database check kare.",
          },
        },
        {
          type: "table",
          caption: { en: "What a line asks for", hi: "Line kya maangti hai" },
          columns: [{ en: "Line configuration", hi: "Line configuration" }, { en: "Prompt at connect", hi: "Connect par prompt" }, { en: "Checked against", hi: "Kisse check hota hai" }],
          rows: [
            ["`no login`", { en: "None", hi: "Kuch nahi" }, { en: "Nothing: open access", hi: "Kuch nahi: khula access" }],
            ["`password ...` + `login`", "Password:", { en: "The line password", hi: "Line password" }],
            [{ en: "`login` with no password set (VTY)", hi: "`login`, lekin password set nahi (VTY)" }, { en: "None: the session is closed with `Password required, but none set`", hi: "Kuch nahi: session `Password required, but none set` ke saath band ho jaata hai" }, { en: "Nothing can succeed", hi: "Kuch bhi succeed nahi ho sakta" }],
            ["`login local`", "Username: / Password:", { en: "The `username` entries; the line password is ignored", hi: "`username` entries; line password ignore hota hai" }],
          ],
        },
        {
          type: "cli",
          title: { en: "R1: a local admin, used on console and VTY", hi: "R1: ek local admin, console aur VTY dono par" },
          lines: [
            { prompt: "R1(config)#", cmd: "username admin algorithm-type scrypt secret Lake-Fern-Lamp-17" },
            { prompt: "R1(config)#", cmd: "line con 0" },
            { prompt: "R1(config-line)#", cmd: "login local" },
            { prompt: "R1(config-line)#", cmd: "exec-timeout 5 0", comment: { en: "Log out after 5 minutes 0 seconds idle", hi: "5 minute 0 second idle ke baad logout" } },
            { prompt: "R1(config-line)#", cmd: "line vty 0 4" },
            { prompt: "R1(config-line)#", cmd: "login local" },
            { prompt: "R1(config-line)#", cmd: "exec-timeout 5 0" },
            { prompt: "R1(config-line)#", cmd: "transport input ssh", comment: { en: "From lesson 4.7: SSH only", hi: "Lesson 4.7 se: sirf SSH" } },
          ],
          note: {
            en: "The default `exec-timeout` is 10 minutes. `exec-timeout 0 0` means never time out: handy in a home lab, a real risk on a console left logged in.",
            hi: "Default `exec-timeout` 10 minute hai. `exec-timeout 0 0` ka matlab kabhi timeout nahi: home lab mein aaram ka hai, lekin logged-in chhode gaye console par asli risk hai.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "secret, not password", hi: "secret, password nahi" },
          text: {
            en: "`username admin password Lake-Fern-Lamp-17` also works, but it stores type 0, or type 7 with service password-encryption. Always use `username ... secret`. Create the user before you type `login local` on the VTY lines, or remote logins fail until a user exists.",
            hi: "`username admin password Lake-Fern-Lamp-17` bhi chalta hai, lekin yeh type 0 store karta hai, ya service password-encryption ke saath type 7. Hamesha `username ... secret` use karo. VTY lines par `login local` likhne se pehle user banao, warna jab tak user nahi banta, remote logins fail honge.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Straight to privileged EXEC", hi: "Seedha privileged EXEC" },
          text: {
            en: "`username admin privilege 15 algorithm-type scrypt secret ...` puts that user directly at the `#` prompt after login. Without `privilege 15` the user lands at `>` and still needs the enable secret. Central accounts with RADIUS or TACACS+ come in lesson 5.3.",
            hi: "`username admin privilege 15 algorithm-type scrypt secret ...` us user ko login ke baad seedha `#` prompt par le jaata hai. `privilege 15` ke bina user `>` par aata hai aur use enable secret phir bhi chahiye. RADIUS ya TACACS+ wale central accounts lesson 5.3 mein aayenge.",
          },
        },
      ],
    },
    {
      id: "slow-down-guessing",
      heading: { en: "Slowing down password guessing", hi: "Password guessing ko slow karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A brute-force tool against SSH can try many passwords per second. Two global commands make that pointless: one forces long passwords, the other stops logins for a while after repeated failures.",
            hi: "SSH par brute-force tool har second kai passwords try kar sakta hai. Do global commands ise bekaar bana dete hain: ek lambe passwords force karta hai, doosra baar-baar fail hone par kuch der ke liye logins rok deta hai.",
          },
        },
        {
          type: "cli",
          lines: [
            { prompt: "R1(config)#", cmd: "security passwords min-length 10", comment: { en: "New passwords and secrets must be 10+ characters", hi: "Naye passwords aur secrets 10+ characters ke hone chahiye" } },
            { prompt: "R1(config)#", cmd: "login block-for 120 attempts 3 within 60", comment: { en: "3 failures in 60 s = no logins for 120 s", hi: "60 s mein 3 failures = 120 s tak koi login nahi" } },
            { prompt: "R1(config)#", cmd: "do show running-config | include block" },
            { out: "login block-for 120 attempts 3 within 60" },
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "`security passwords min-length 10` is checked when a password is configured. Passwords already in the config are not checked again, so set it before you create users.",
              hi: "`security passwords min-length 10` tab check hota hai jab password configure hota hai. Config mein pehle se maujood passwords dobara check nahi hote, isliye users banane se pehle ise set karo.",
            },
            {
              en: "`login block-for 120 attempts 3 within 60`: if 3 logins fail within 60 seconds, the router enters **quiet mode** and refuses all Telnet, SSH and HTTP logins for 120 seconds. An attacker is held to about 3 guesses every 2 minutes, a few thousand a day instead of millions.",
              hi: "`login block-for 120 attempts 3 within 60`: agar 60 second mein 3 logins fail hon, toh router **quiet mode** mein chala jaata hai aur 120 second tak saare Telnet, SSH aur HTTP logins refuse karta hai. Attacker lagbhag har 2 minute mein 3 guesses tak simat jaata hai, din mein millions ki jagah kuch hazaar.",
            },
            {
              en: "Quiet mode blocks you too. `login quiet-mode access-class` can exempt an admin subnet; that is beyond the CCNA, but good to know before you lock yourself out.",
              hi: "Quiet mode tumhe bhi block karta hai. `login quiet-mode access-class` ek admin subnet ko chhoot de sakta hai; yeh CCNA se aage hai, lekin khud ko lock karne se pehle jaan lena achha hai.",
            },
          ],
        },
      ],
    },
    {
      id: "password-policy",
      heading: { en: "Password policy: management and complexity", hi: "Password policy: management aur complexity" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Commands enforce a policy on one device. The **password policy** is the written rule for the whole organisation. CCNA topic 5.4 names its elements as management, complexity and password alternatives.",
            hi: "Commands ek device par policy enforce karte hain. **Password policy** poore organisation ka likha hua rule hai. CCNA topic 5.4 iske elements ka naam management, complexity aur password alternatives deta hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Length over complexity**: a passphrase such as `Kettle-Rain-Sky-42` (18 characters) is far harder to brute-force and easier to remember than `P@ss1!` (6 characters). Set a generous minimum length: 12 or more is common, and current NIST guidance asks for at least 15 characters when the password is the only factor.",
              hi: "**Complexity se zyada length**: `Kettle-Rain-Sky-42` (18 characters) jaisa passphrase `P@ss1!` (6 characters) se brute-force karne mein kahin zyada mushkil aur yaad rakhne mein aasaan hai. Minimum length achhi khaasi rakho: 12 ya zyada common hai, aur abhi ki NIST guidance kehti hai ki jab password akela factor ho toh kam se kam 15 characters hon.",
            },
            {
              en: "**Complexity**: many policies also require a mix of upper case, lower case, digits and symbols. It helps a little; length helps much more.",
              hi: "**Complexity**: kai policies upper case, lower case, digits aur symbols ka mix bhi maangti hain. Isse thoda fayda hai; length se kahin zyada.",
            },
            {
              en: "**No reuse**: a password history stops users cycling back to old ones, and every device or service gets a different password, so one leak does not open everything.",
              hi: "**No reuse**: password history users ko purane passwords par wapas jaane se rokti hai, aur har device ya service ka password alag hota hai, taaki ek leak se sab kuch na khul jaaye.",
            },
            {
              en: "**Lockout**: lock or slow an account after a few failures, as `login block-for` does on IOS.",
              hi: "**Lockout**: kuch failures ke baad account lock ya slow karo, jaise IOS par `login block-for` karta hai.",
            },
            {
              en: "**Management**: who issues, stores and revokes passwords. Use a **password manager** to generate and keep long unique passwords, never share accounts, change a password at once when it may be exposed, and remove accounts the day someone leaves.",
              hi: "**Management**: passwords kaun issue, store aur revoke karta hai. Lambe unique passwords banane aur rakhne ke liye **password manager** use karo, accounts kabhi share mat karo, password expose hone ka shak ho toh turant badlo, aur jis din koi chhode usi din uske accounts hatao.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Old advice vs current advice", hi: "Purani advice vs abhi ki advice" },
          text: {
            en: "Older policies force complex passwords changed every 60 or 90 days, which pushes people to `Summer2024!` followed by `Autumn2024!`. Current guidance such as NIST SP 800-63B favours long passphrases, checks against lists of leaked passwords, and changes only when there is a sign of compromise. Expect the exam to treat both complexity and expiry as normal policy elements.",
            hi: "Purani policies complex passwords ko har 60 ya 90 din mein badalwaati thi, jisse log `Summer2024!` ke baad `Autumn2024!` rakhne lagte hain. NIST SP 800-63B jaisi abhi ki guidance lambe passphrases, leaked passwords ki lists se check, aur sirf compromise ke sign par badalne ko prefer karti hai. Exam mein complexity aur expiry dono ko normal policy elements maana jaayega.",
          },
        },
      ],
    },
    {
      id: "password-alternatives",
      heading: { en: "Beyond passwords: MFA, certificates and biometrics", hi: "Passwords se aage: MFA, certificates aur biometrics" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A password is something you know, and anything known can be phished, guessed or leaked. **Multifactor authentication (MFA)** requires two or more factors from **different** categories, so a stolen password alone is not enough.",
            hi: "Password woh cheez hai jo tum jaante ho, aur jo cheez jaani ja sakti hai woh phish, guess ya leak bhi ho sakti hai. **Multifactor authentication (MFA)** **alag-alag** categories ke do ya zyada factors maangta hai, isliye sirf chori ka password kaafi nahi hota.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Factor", hi: "Factor" }, { en: "Examples", hi: "Examples" }],
          rows: [
            [{ en: "Something you **know**", hi: "Jo tum **jaante** ho" }, { en: "Password, PIN, answer to a security question", hi: "Password, PIN, security question ka jawab" }],
            [{ en: "Something you **have**", hi: "Jo tumhare **paas** hai" }, "Phone authenticator app, push notification, hardware token, smart card, badge"],
            [{ en: "Something you **are**", hi: "Jo tum **ho**" }, { en: "Fingerprint, face, iris, voice (biometrics)", hi: "Fingerprint, face, iris, voice (biometrics)" }],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**Digital certificates** prove identity with public-key cryptography. A **certificate authority (CA)** signs a certificate that binds a name, such as `vpn.example.com` or a user, to a public key. The holder proves it owns the matching private key, which never leaves the device. The CAs, certificates and trust between them form a **PKI** (public key infrastructure). Certificates authenticate web servers over HTTPS, VPN peers (lesson 5.9) and Wi-Fi users with EAP-TLS (lesson 5.10).",
              hi: "**Digital certificates** public-key cryptography se identity prove karte hain. Ek **certificate authority (CA)** certificate sign karti hai jo ek naam, jaise `vpn.example.com` ya ek user, ko ek public key se jodta hai. Holder prove karta hai ki matching private key uske paas hai, jo device se kabhi bahar nahi jaati. CAs, certificates aur unke beech ka trust milkar **PKI** (public key infrastructure) banate hain. Certificates HTTPS par web servers, VPN peers (lesson 5.9) aur EAP-TLS se Wi-Fi users (lesson 5.10) ko authenticate karte hain.",
            },
            {
              en: "**Biometrics** cannot be forgotten or shared, but they also cannot be changed if copied. They are best used as one factor of MFA, for example a fingerprint that unlocks the phone app holding the second factor.",
              hi: "**Biometrics** bhool nahi sakte, share nahi kar sakte, lekin copy ho gaye toh badle bhi nahi ja sakte. Inka best use MFA ke ek factor ki tarah hai, jaise fingerprint jo phone app unlock kare jisme doosra factor hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam trap", hi: "Exam trap" },
          text: {
            en: "A password plus a PIN is not MFA: both are something you know. A fingerprint plus a face scan is not MFA either. A password plus a code from a phone app is, because it combines know and have.",
            hi: "Password plus PIN MFA nahi hai: dono jo tum jaante ho wali category hain. Fingerprint plus face scan bhi MFA nahi hai. Password plus phone app ka code MFA hai, kyunki yeh know aur have ko jodta hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "enable secret", def: { en: "The hashed password that protects privileged EXEC; it overrides enable password.", hi: "Privileged EXEC ko protect karne wala hashed password; yeh enable password ko override karta hai." } },
    { term: "Type 7", def: { en: "Cisco's reversible password cipher, produced by service password-encryption. Not secure.", hi: "Cisco ka reversible password cipher, jo service password-encryption banata hai. Secure nahi hai." } },
    { term: "Type 9", def: { en: "A password stored as an scrypt hash, set with algorithm-type scrypt. The strongest IOS type.", hi: "scrypt hash ke roop mein stored password, algorithm-type scrypt se set hota hai. IOS ka sabse strong type." } },
    { term: "login local", def: { en: "Line command that authenticates users against the local username database.", hi: "Line command jo users ko local username database se authenticate karta hai." } },
    { term: "exec-timeout", def: { en: "Line command that logs out an idle session after the given minutes and seconds; default 10 minutes.", hi: "Line command jo idle session ko diye gaye minutes aur seconds ke baad logout karta hai; default 10 minute." } },
    { term: "Quiet mode", def: { en: "The period set by login block-for during which the device refuses remote logins.", hi: "login block-for se set hua time jisme device remote logins refuse karta hai." } },
    { term: "MFA", def: { en: "Authentication with factors from at least two categories: know, have, are.", hi: "Kam se kam do categories ke factors se authentication: know, have, are." } },
    { term: "PKI", def: { en: "Public key infrastructure: CAs and the certificates they sign, used to prove identity.", hi: "Public key infrastructure: CAs aur unke sign kiye certificates, jo identity prove karne ke kaam aate hain." } },
  ],
  commands: [
    { cmd: "enable secret <password>", mode: "Global configuration", does: { en: "Hashed privileged EXEC password (type 5 on IOS 15)", hi: "Privileged EXEC ka hashed password (IOS 15 par type 5)" } },
    { cmd: "enable algorithm-type scrypt secret <password>", mode: "Global configuration", does: { en: "Enable secret stored as type 9", hi: "Enable secret ko type 9 mein store karo" } },
    { cmd: "enable algorithm-type sha256 secret <password>", mode: "Global configuration", does: { en: "Enable secret stored as type 8", hi: "Enable secret ko type 8 mein store karo" } },
    { cmd: "no enable password", mode: "Global configuration", does: { en: "Remove the clear-text enable password", hi: "Clear-text enable password hatao" } },
    { cmd: "username admin algorithm-type scrypt secret <password>", mode: "Global configuration", does: { en: "Create a local user with a type 9 secret", hi: "Type 9 secret ke saath local user banao" } },
    { cmd: "login local", mode: "Line configuration", does: { en: "Ask for a username and check the local database", hi: "Username maango aur local database se check karo" } },
    { cmd: "exec-timeout 5 0", mode: "Line configuration", does: { en: "Log out after 5 minutes idle", hi: "5 minute idle ke baad logout" } },
    { cmd: "security passwords min-length 10", mode: "Global configuration", does: { en: "Reject new passwords shorter than 10 characters", hi: "10 characters se chhote naye passwords reject karo" } },
    { cmd: "login block-for 120 attempts 3 within 60", mode: "Global configuration", does: { en: "Block logins for 120 s after 3 failures in 60 s", hi: "60 s mein 3 failures ke baad 120 s tak logins block" } },
    { cmd: "service password-encryption", mode: "Global configuration", does: { en: "Turn type 0 passwords into reversible type 7", hi: "Type 0 passwords ko reversible type 7 banao" } },
    { cmd: "show running-config | include secret|password", mode: "Privileged EXEC", does: { en: "Check how every password is stored", hi: "Check karo ki har password kaise store hai" } },
    { cmd: "show login", mode: "Privileged EXEC", does: { en: "Show the login block settings and whether quiet mode is active", hi: "Login block settings aur quiet mode active hai ya nahi, dikhao" } },
  ],
  mistakes: [
    {
      en: "Believing `service password-encryption` secures passwords. It produces type 7, which free tools reverse instantly. Use secrets (type 8 or 9) and treat type 7 as clear text.",
      hi: "Yeh maanna ki `service password-encryption` passwords secure karta hai. Yeh type 7 banata hai, jise free tools turant reverse kar dete hain. Secrets (type 8 ya 9) use karo aur type 7 ko clear text hi samjho.",
    },
    {
      en: "Leaving `enable password` configured after adding `enable secret`. It is ignored for login, but it still sits in the config in clear text or type 7. Remove it with `no enable password`.",
      hi: "`enable secret` add karne ke baad `enable password` configured chhod dena. Login ke liye yeh ignore hota hai, lekin config mein clear text ya type 7 mein pada rehta hai. `no enable password` se hatao.",
    },
    {
      en: "Creating `username admin secret ...` but leaving the line on `login`. With plain `login` the line still asks for its own password; only `login local` uses the usernames.",
      hi: "`username admin secret ...` bana dena lekin line ko `login` par hi chhod dena. Simple `login` ke saath line apna password hi maangti hai; usernames sirf `login local` use karta hai.",
    },
    {
      en: "Using `username admin password ...` instead of `secret`. The password form stores type 0 or type 7.",
      hi: "`secret` ki jagah `username admin password ...` use karna. Password wala form type 0 ya type 7 store karta hai.",
    },
    {
      en: "Setting `exec-timeout 0 0` on production devices. It disables the idle timeout, so an unattended console stays logged in forever.",
      hi: "Production devices par `exec-timeout 0 0` set karna. Yeh idle timeout band kar deta hai, toh bina dekh-rekh ka console hamesha logged in rehta hai.",
    },
    {
      en: "Calling a password plus a PIN multifactor. Both are something you know; MFA needs two different categories.",
      hi: "Password plus PIN ko multifactor bolna. Dono jo tum jaante ho wali category hain; MFA ko do alag categories chahiye.",
    },
  ],
  recap: [
    { en: "Type 0 is clear text, 7 is reversible, 5 is MD5, 8 is PBKDF2-SHA256, 9 is scrypt. Aim for 9.", hi: "Type 0 clear text hai, 7 reversible, 5 MD5, 8 PBKDF2-SHA256, 9 scrypt. Target 9 rakho." },
    { en: "`enable algorithm-type scrypt secret` and `username ... algorithm-type scrypt secret` give type 9; then `no enable password`.", hi: "`enable algorithm-type scrypt secret` aur `username ... algorithm-type scrypt secret` type 9 dete hain; phir `no enable password`." },
    { en: "`login` uses the line password; `login local` uses usernames. Add `exec-timeout` to every line.", hi: "`login` line password use karta hai; `login local` usernames. Har line par `exec-timeout` lagao." },
    { en: "`security passwords min-length` enforces length on new passwords; `login block-for` stops guessing with quiet mode.", hi: "`security passwords min-length` naye passwords par length enforce karta hai; `login block-for` quiet mode se guessing rokta hai." },
    { en: "Policy: length over complexity, no reuse, lockout, password managers, remove leavers' accounts.", hi: "Policy: complexity se zyada length, no reuse, lockout, password managers, chhodne walon ke accounts hatao." },
    { en: "MFA = two different factors (know, have, are). Certificates prove identity through a CA; biometrics are something you are.", hi: "MFA = do alag factors (know, have, are). Certificates CA ke through identity prove karte hain; biometrics jo tum ho wali category hai." },
  ],
  quiz: [
    {
      q: {
        en: "A router's running-config contains `enable secret 9 $9$KKClHh/8YCtGie$DPJtWJ...`. Which command most likely created it?",
        hi: "Router ki running-config mein `enable secret 9 $9$KKClHh/8YCtGie$DPJtWJ...` hai. Ise sabse likely kis command ne banaya?",
      },
      options: [
        { en: "enable password with service password-encryption", hi: "service password-encryption ke saath enable password" },
        { en: "enable algorithm-type scrypt secret", hi: "enable algorithm-type scrypt secret" },
        { en: "enable algorithm-type sha256 secret", hi: "enable algorithm-type sha256 secret" },
        { en: "enable secret on an IOS 12 router", hi: "IOS 12 router par enable secret" },
      ],
      answer: 1,
      explain: {
        en: "Type 9 is scrypt, set with `algorithm-type scrypt`. `sha256` would give type 8, service password-encryption gives type 7, and plain `enable secret` on older IOS gives type 5.",
        hi: "Type 9 scrypt hai, jo `algorithm-type scrypt` se set hota hai. `sha256` se type 8 milta, service password-encryption se type 7, aur purane IOS par simple `enable secret` se type 5.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "What does `service password-encryption` do?",
        hi: "`service password-encryption` kya karta hai?",
      },
      options: [
        { en: "Converts every enable secret to type 9", hi: "Har enable secret ko type 9 mein convert karta hai" },
        { en: "Encrypts the SSH session to the device", hi: "Device tak ke SSH session ko encrypt karta hai" },
        { en: "Forces users to choose complex passwords", hi: "Users ko complex passwords chunne par majboor karta hai" },
        { en: "Stores clear-text passwords as type 7, which can easily be reversed", hi: "Clear-text passwords ko type 7 mein store karta hai, jo aasani se reverse ho jaata hai" },
      ],
      answer: 3,
      explain: {
        en: "It only scrambles type 0 passwords in the config into type 7, a reversible cipher. It does not touch secrets, does not affect SSH, and does not enforce complexity; `security passwords min-length` enforces length.",
        hi: "Yeh sirf config ke type 0 passwords ko type 7 mein scramble karta hai, jo reversible cipher hai. Secrets ko nahi chhoota, SSH par asar nahi, aur complexity enforce nahi karta; length `security passwords min-length` enforce karta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "R1 has `username admin secret Lake-Fern-Lamp-17`. Under `line con 0` it has `password ConPass1` and `login`. What happens when someone connects to the console?",
        hi: "R1 par `username admin secret Lake-Fern-Lamp-17` hai. `line con 0` ke andar `password ConPass1` aur `login` hai. Console se connect karne par kya hoga?",
      },
      options: [
        { en: "Only a Password: prompt appears, and ConPass1 is accepted", hi: "Sirf Password: prompt aata hai, aur ConPass1 accept hota hai" },
        { en: "Username: and Password: prompts appear, checked against admin", hi: "Username: aur Password: prompts aate hain, admin se check hote hain" },
        { en: "No prompt appears, because a username exists", hi: "Koi prompt nahi aata, kyunki username exist karta hai" },
        { en: "Both ConPass1 and the admin secret are accepted", hi: "ConPass1 aur admin secret dono accept hote hain" },
      ],
      answer: 0,
      explain: {
        en: "Plain `login` checks the line password and ignores the username database. To use the admin account, the line needs `login local`.",
        hi: "Simple `login` line password check karta hai aur username database ko ignore karta hai. Admin account use karne ke liye line par `login local` chahiye.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Which login method is multifactor authentication?",
        hi: "Kaunsa login method multifactor authentication hai?",
      },
      options: [
        { en: "A password and then a PIN", hi: "Pehle password, phir PIN" },
        { en: "A fingerprint and then a face scan", hi: "Pehle fingerprint, phir face scan" },
        { en: "A password and then a code from an authenticator app on your phone", hi: "Pehle password, phir phone ke authenticator app ka code" },
        { en: "Two different passwords for two different systems", hi: "Do alag systems ke liye do alag passwords" },
      ],
      answer: 2,
      explain: {
        en: "MFA needs factors from different categories. The password is something you know and the app code proves something you have. Password plus PIN is two knowledge factors; fingerprint plus face is two inherence factors.",
        hi: "MFA ko alag categories ke factors chahiye. Password jo tum jaante ho, aur app ka code prove karta hai ki kuch tumhare paas hai. Password plus PIN do knowledge factors hain; fingerprint plus face do inherence factors.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A router has `login block-for 120 attempts 3 within 60`. What does it do?",
        hi: "Router par `login block-for 120 attempts 3 within 60` hai. Yeh kya karta hai?",
      },
      options: [
        { en: "Locks the user account permanently after 3 failures", hi: "3 failures ke baad user account hamesha ke liye lock" },
        { en: "Refuses all remote logins for 120 seconds if 3 logins fail within 60 seconds", hi: "60 second mein 3 logins fail hon toh 120 second tak saare remote logins refuse" },
        { en: "Disconnects idle sessions after 120 seconds", hi: "Idle sessions ko 120 second baad disconnect" },
        { en: "Allows only 3 SSH sessions at a time for 60 seconds", hi: "60 second ke liye ek saath sirf 3 SSH sessions allow" },
      ],
      answer: 1,
      explain: {
        en: "The command watches for 3 failed attempts within 60 seconds and then enters quiet mode for 120 seconds, refusing Telnet, SSH and HTTP logins. It does not lock accounts permanently, and idle sessions are handled by exec-timeout.",
        hi: "Command 60 second mein 3 failed attempts dekhta hai aur phir 120 second ke liye quiet mode mein chala jaata hai, Telnet, SSH aur HTTP logins refuse karta hai. Yeh accounts ko hamesha ke liye lock nahi karta, aur idle sessions exec-timeout handle karta hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "Engineers often leave console sessions logged in on lab carts. Which line command logs a session out after 5 minutes without input?",
        hi: "Engineers aksar lab carts par console sessions logged in chhod dete hain. Kaunsa line command bina input ke 5 minute baad session logout karega?",
      },
      options: [
        { en: "exec-timeout 0 5", hi: "exec-timeout 0 5" },
        { en: "exec-timeout 0 0", hi: "exec-timeout 0 0" },
        { en: "exec-timeout 5 0", hi: "exec-timeout 5 0" },
        { en: "exec-timeout 300", hi: "exec-timeout 300" },
      ],
      answer: 2,
      explain: {
        en: "`exec-timeout` takes minutes, then seconds, so `5 0` is 5 minutes. `0 5` is only 5 seconds, `0 0` disables the timeout, and `300` alone means 300 minutes, not 300 seconds.",
        hi: "`exec-timeout` pehle minutes, phir seconds leta hai, toh `5 0` matlab 5 minute. `0 5` sirf 5 second hai, `0 0` timeout band kar deta hai, aur akela `300` matlab 300 minute, 300 second nahi.",
      },
      kind: "cli",
    },
  ],
  videos: [
    {
      id: "AvgYqI2qSD4",
      title: "Free CCNA | SSH | Day 42",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Watch 1:56 to 5:14: console security with login and with login local and a username.",
        hi: "1:56 se 5:14 tak dekho: login aur username ke saath login local wali console security.",
      },
    },
    {
      id: "VvFuieyTTSw",
      title: "Free CCNA | Security Fundamentals | Day 48",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: {
        en: "Watch 21:12 to 25:30: password attacks, multi-factor authentication and digital certificates.",
        hi: "21:12 se 25:30 tak dekho: password attacks, multi-factor authentication aur digital certificates.",
      },
    },
    {
      id: "Vzdd5DUOQwY",
      title: "19. Configure Passwords and Access Lines on Cisco Devices | CCNA 200-301 (Hindi)",
      channel: "NetworkPath",
      lang: "hi",
      note: {
        en: "Enable password vs secret, console and VTY passwords, and login local with local users, on a router CLI.",
        hi: "Router CLI par enable password vs secret, console aur VTY passwords, aur local users ke saath login local.",
      },
    },
    {
      id: "TXuBDeSnOR0",
      title: "132. Free CCNA (NEW) | Network Security - Protecting CLI Access",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "A short Hindi overview of protecting CLI access on Cisco devices.", hi: "Cisco devices par CLI access protect karne ka chhota Hindi overview." },
    },
  ],
  lab: {
    title: { en: "Harden R1 and check every password line", hi: "R1 ko harden karo aur har password line check karo" },
    steps: [
      {
        en: "On a Packet Tracer router, set `enable password cisco` and a console `password cisco` with `login`. Run `show running-config | include password` and note that both are readable.",
        hi: "Packet Tracer router par `enable password cisco` aur `login` ke saath console `password cisco` set karo. `show running-config | include password` chalao aur dekho ki dono padhe ja sakte hain.",
      },
      {
        en: "Add `enable algorithm-type scrypt secret Kettle-Rain-Sky-42` and `no enable password`. If your Packet Tracer version rejects `algorithm-type`, use `enable secret` and note that you get type 5.",
        hi: "`enable algorithm-type scrypt secret Kettle-Rain-Sky-42` aur `no enable password` add karo. Agar tumhara Packet Tracer version `algorithm-type` reject kare, toh `enable secret` use karo aur note karo ki type 5 milta hai.",
      },
      {
        en: "Set `security passwords min-length 10`, then try `username test secret short1`. Then create `username admin` with a secret of 10 or more characters.",
        hi: "`security passwords min-length 10` set karo, phir `username test secret short1` try karo. Uske baad 10 ya zyada characters ke secret ke saath `username admin` banao.",
      },
      {
        en: "Under `line con 0` and `line vty 0 4`, configure `login local` and `exec-timeout 5 0`. Log out, log back in as admin, and leave the session idle to watch the timeout.",
        hi: "`line con 0` aur `line vty 0 4` ke andar `login local` aur `exec-timeout 5 0` configure karo. Logout karo, admin bankar wapas login karo, aur session idle chhod kar timeout dekho.",
      },
      {
        en: "Turn on `service password-encryption` and run `show running-config | include password 7`. Which lines changed, and why did the secrets not change?",
        hi: "`service password-encryption` on karo aur `show running-config | include password 7` chalao. Kaunsi lines badli, aur secrets kyun nahi badle?",
      },
      {
        en: "Configure `login block-for 120 attempts 3 within 60`, fail three SSH or Telnet logins from a PC, and run `show login` on the router to see quiet mode.",
        hi: "`login block-for 120 attempts 3 within 60` configure karo, PC se teen SSH ya Telnet logins fail karo, aur router par `show login` chala kar quiet mode dekho.",
      },
    ],
  },
};

export default lesson;
