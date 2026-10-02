import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "ssh",
  intro: {
    en: "You will spend most of your working life on routers and switches through a remote CLI session, not a console cable. In lesson 2.10 you saw that Telnet sends that session, password included, across the network in clear text. SSH gives you the same CLI inside an encrypted tunnel, and the CCNA expects you to configure it from memory: hostname, domain name, RSA key, version 2, a local user and locked-down VTY lines.",
    hi: "Tumhara zyada kaam routers aur switches par remote CLI session se hoga, console cable se nahi. Lesson 2.10 mein dekha tha ki Telnet yeh poora session, password bhi, network par clear text mein bhejta hai. SSH wahi CLI ek encrypted tunnel ke andar deta hai, aur CCNA expect karta hai ki tum ise yaad se configure kar sako: hostname, domain name, RSA key, version 2, ek local user aur lock ki hui VTY lines.",
  },
  outcomes: [
    { en: "Explain what SSH protects that Telnet does not, and name both ports", hi: "Samjha sako ki SSH kya protect karta hai jo Telnet nahi karta, aur dono ke ports bata sako" },
    { en: "Configure SSHv2 on a Cisco router or switch in the correct order", hi: "Cisco router ya switch par sahi order mein SSHv2 configure kar sako" },
    { en: "Restrict VTY lines with `login local`, `transport input ssh`, `access-class` and `exec-timeout`", hi: "VTY lines ko `login local`, `transport input ssh`, `access-class` aur `exec-timeout` se restrict kar sako" },
    { en: "Verify SSH with `show ip ssh` and `show ssh`, and connect from a PC or another router", hi: "`show ip ssh` aur `show ssh` se SSH verify kar sako, aur PC ya doosre router se connect kar sako" },
    { en: "Troubleshoot the common reasons an SSH login fails", hi: "SSH login fail hone ke common reasons troubleshoot kar sako" },
  ],
  sections: [
    {
      id: "why-not-telnet",
      heading: { en: "Why Telnet is not good enough", hi: "Telnet kaafi kyun nahi hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Telnet (TCP port 23) sends every keystroke as plain characters. Anyone who captures the packets on the path, with a mirrored switch port or after poisoning ARP caches, reads your username, your password and every command you type. SSH (Secure Shell, TCP port 22) carries the same CLI session, but it encrypts everything after a short key exchange at the start.",
            hi: "Telnet (TCP port 23) har keystroke plain characters mein bhejta hai. Path par jo bhi packets capture kar le, mirrored switch port se ya ARP caches poison karke, woh tumhara username, password aur har command padh leta hai. SSH (Secure Shell, TCP port 22) wahi CLI session le jaata hai, lekin shuru mein ek chhote key exchange ke baad sab kuch encrypt kar deta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Telnet and SSH side by side", hi: "Telnet aur SSH aamne-saamne" },
          columns: [{ en: "Feature", hi: "Feature" }, "Telnet", "SSHv2"],
          rows: [
            [{ en: "Transport and port", hi: "Transport aur port" }, "TCP 23", "TCP 22"],
            [{ en: "Session encrypted", hi: "Session encrypted" }, { en: "No, clear text", hi: "Nahi, clear text" }, { en: "Yes, for example with AES", hi: "Haan, jaise AES se" }],
            [{ en: "Tampering detected", hi: "Tampering pakdi jaati hai" }, { en: "No", hi: "Nahi" }, { en: "Yes, every packet carries a message authentication code (an integrity check, not a MAC address)", hi: "Haan, har packet mein message authentication code hota hai (integrity check, MAC address nahi)" }],
            [{ en: "Server proves its identity", hi: "Server apni identity prove karta hai" }, { en: "No", hi: "Nahi" }, { en: "Yes, with its RSA host key", hi: "Haan, apni RSA host key se" }],
            [{ en: "Use it on a production network", hi: "Production network par use karein" }, { en: "No", hi: "Nahi" }, { en: "Yes", hi: "Haan" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Telnet = TCP 23, clear text. SSH = TCP 22, encrypted. Both arrive on the VTY lines. Use SSH version 2; version 1 has known weaknesses.",
            hi: "Telnet = TCP 23, clear text. SSH = TCP 22, encrypted. Dono VTY lines par aate hain. SSH version 2 use karo; version 1 mein known weaknesses hain.",
          },
        },
      ],
    },
    {
      id: "what-happens-on-connect",
      heading: { en: "What happens when you connect", hi: "Connect karte waqt kya hota hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "You do not need the cryptography in detail for the CCNA, but knowing the order explains the configuration steps and the prompts you will see.",
            hi: "CCNA ke liye cryptography detail mein nahi chahiye, lekin order pata ho toh configuration steps aur screen par aane wale prompts dono samajh aate hain.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "The client opens a TCP connection to port 22 (the normal three-way handshake from lesson 1.7).",
              hi: "Client port 22 par TCP connection kholta hai (lesson 1.7 wala normal three-way handshake).",
            },
            {
              en: "Both sides announce their SSH version and agree on algorithms: key exchange, encryption (such as AES) and integrity (such as HMAC-SHA1).",
              hi: "Dono sides apna SSH version batate hain aur algorithms par agree karte hain: key exchange, encryption (jaise AES) aur integrity (jaise HMAC-SHA1).",
            },
            {
              en: "A Diffie-Hellman key exchange creates a shared session key that never crosses the wire. The device signs the exchange with its **RSA host key**, which proves it is the device you meant to reach.",
              hi: "Diffie-Hellman key exchange ek shared session key banata hai jo kabhi wire par nahi jaati. Device is exchange ko apni **RSA host key** se sign karta hai, jisse prove hota hai ki yeh wahi device hai jisse tum connect karna chahte the.",
            },
            {
              en: "On the first connection the client shows the host key's fingerprint and asks you to trust it. It stores the key and warns you loudly if it ever changes, which could mean someone is impersonating the device.",
              hi: "Pehle connection par client host key ka fingerprint dikhata hai aur trust karne ko kehta hai. Woh key store kar leta hai, aur agar key kabhi badli toh zor se warning deta hai, kyunki iska matlab ho sakta hai ki koi device ki nakal kar raha hai.",
            },
            {
              en: "Only now, inside the encrypted channel, do you send your username and password. The device checks them against its local users (or a AAA server) and gives you a prompt.",
              hi: "Ab jaakar, encrypted channel ke andar, tum apna username aur password bhejte ho. Device unhe apne local users (ya AAA server) se check karta hai aur tumhe prompt deta hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Why the router needs a key pair", hi: "Router ko key pair kyun chahiye" },
          text: {
            en: "Step 3 is the reason for `crypto key generate rsa`. With no RSA key pair, the device cannot prove its identity, so IOS does not run the SSH server at all.",
            hi: "Step 3 hi `crypto key generate rsa` ki wajah hai. RSA key pair nahi hai toh device apni identity prove nahi kar sakta, isliye IOS SSH server chalata hi nahi.",
          },
        },
      ],
    },
    {
      id: "prerequisites",
      heading: { en: "What a Cisco device needs before SSH works", hi: "SSH chalne se pehle Cisco device ko kya chahiye" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Requirement", hi: "Requirement" }, { en: "Why", hi: "Kyun" }],
          rows: [
            [{ en: "An IOS image with cryptography (`k9` in the file name)", hi: "Cryptography wali IOS image (file name mein `k9`)" }, { en: "Images without crypto have no SSH commands", hi: "Bina crypto wali images mein SSH commands hote hi nahi" }],
            [{ en: "A hostname other than the default", hi: "Default ke alawa koi hostname" }, { en: "The key pair is named hostname.domain", hi: "Key pair ka naam hostname.domain hota hai" }],
            [{ en: "A domain name: `ip domain-name`", hi: "Domain name: `ip domain-name`" }, { en: "Second half of the key name", hi: "Key name ka doosra hissa" }],
            [{ en: "An RSA key pair of at least 768 bits", hi: "Kam se kam 768 bits ka RSA key pair" }, { en: "SSHv2 refuses smaller keys; use 2048", hi: "SSHv2 isse chhoti keys nahi leta; 2048 use karo" }],
            [{ en: "A username and secret (or AAA)", hi: "Username aur secret (ya AAA)" }, { en: "SSH logins always include a username", hi: "SSH login mein hamesha username hota hai" }],
            [{ en: "VTY lines with `login local` and `transport input ssh`", hi: "VTY lines par `login local` aur `transport input ssh`" }, { en: "Check that user and accept SSH only", hi: "Us user ko check karo aur sirf SSH accept karo" }],
            [{ en: "A reachable IP address", hi: "Reachable IP address" }, { en: "Interface IP on a router; SVI plus `ip default-gateway` on a Layer 2 switch", hi: "Router par interface IP; Layer 2 switch par SVI aur `ip default-gateway`" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Do not forget the switch's gateway", hi: "Switch ka gateway mat bhoolna" },
          text: {
            en: "SW1 with SVI 10.1.99.2/24 and no `ip default-gateway` answers SSH only from inside 10.1.99.0/24. An admin at 10.1.10.50 gets a timeout: the SYN arrives, but SW1 has no route to send the SYN-ACK back. You set this up in lesson 2.10; it is still the most common reason SSH to a switch fails.",
            hi: "SW1 ka SVI 10.1.99.2/24 hai aur `ip default-gateway` nahi hai, toh woh sirf 10.1.99.0/24 ke andar se SSH ka jawab dega. 10.1.10.50 wale admin ko timeout milega: SYN pahunch jaata hai, lekin SYN-ACK wapas bhejne ka raasta SW1 ko pata hi nahi. Yeh tumne lesson 2.10 mein set kiya tha; switch par SSH fail hone ka yeh aaj bhi sabse common reason hai.",
          },
        },
      ],
    },
    {
      id: "configure-ssh",
      heading: { en: "Configuring SSHv2 step by step", hi: "SSHv2 step by step configure karna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The same commands work on a router and a switch. Here SW1 is a Layer 2 switch managed at 10.1.99.2, and the admins sit in 10.1.10.0/24. The order matters: the hostname and domain name must exist before the key, and the key should exist before `ip ssh version 2`, because many IOS releases refuse version 2 until there is an RSA key of at least 768 bits.",
            hi: "Router aur switch dono par yahi commands chalte hain. Yahan SW1 ek Layer 2 switch hai jise 10.1.99.2 par manage karte hain, aur admins 10.1.10.0/24 mein baithe hain. Order matter karta hai: key se pehle hostname aur domain name hone chahiye, aur `ip ssh version 2` se pehle key, kyunki kai IOS releases tab tak version 2 enable nahi karte jab tak kam se kam 768 bits ki RSA key na ho.",
          },
        },
        {
          type: "cli",
          title: { en: "SSHv2 on SW1", hi: "SW1 par SSHv2" },
          lines: [
            { prompt: "Switch(config)#", cmd: "hostname SW1", comment: { en: "Any name except the default", hi: "Default ke alawa koi bhi naam" } },
            { prompt: "SW1(config)#", cmd: "ip domain-name example.com", comment: { en: "Newer IOS also accepts ip domain name", hi: "Naye IOS mein ip domain name bhi chalta hai" } },
            { prompt: "SW1(config)#", cmd: "crypto key generate rsa modulus 2048", comment: { en: "Creates SW1.example.com keys and enables SSH", hi: "SW1.example.com keys banata hai aur SSH enable karta hai" } },
            { out: "The name for the keys will be: SW1.example.com" },
            { out: "% Generating 2048 bit RSA keys, keys will be non-exportable..." },
            { out: "[OK] (elapsed time was 3 seconds)" },
            { prompt: "SW1(config)#", cmd: "ip ssh version 2", comment: { en: "Refuse SSH version 1 clients", hi: "SSH version 1 clients ko refuse karo" } },
            { prompt: "SW1(config)#", cmd: "username admin secret Str0ng-Pa55", comment: { en: "Local account, stored as a hash", hi: "Local account, password hash bana kar store hota hai" } },
            { prompt: "SW1(config)#", cmd: "line vty 0 15" },
            { prompt: "SW1(config-line)#", cmd: "login local", comment: { en: "Check the local username database", hi: "Local username database check karo" } },
            { prompt: "SW1(config-line)#", cmd: "transport input ssh", comment: { en: "Accept SSH only, refuse Telnet", hi: "Sirf SSH accept karo, Telnet refuse" } },
            { prompt: "SW1(config-line)#", cmd: "end" },
            { prompt: "SW1#", cmd: "copy running-config startup-config" },
          ],
          note: {
            en: "If you leave out `modulus 2048`, IOS asks \"How many bits in the modulus\" and suggests a default that depends on the release. Type 2048 so you never end up with a key too small for SSHv2.",
            hi: "Agar `modulus 2048` chhod do, toh IOS poochta hai \"How many bits in the modulus\" aur ek default suggest karta hai jo release par depend karta hai. 2048 type karo taaki SSHv2 ke liye kabhi chhoti key na ban jaaye.",
          },
        },
        {
          type: "p",
          text: {
            en: "Generating the key is what switches the SSH server on; IOS logs `%SSH-5-ENABLED: SSH 1.99 has been enabled`. **1.99** means \"I accept versions 1 and 2\". After `ip ssh version 2`, `show ip ssh` reports `version 2.0`. Removing the keys with `crypto key zeroize rsa` turns SSH off again.",
            hi: "Key generate karte hi SSH server on ho jaata hai; IOS log karta hai `%SSH-5-ENABLED: SSH 1.99 has been enabled`. **1.99** ka matlab hai \"main version 1 aur 2 dono accept karta hoon\". `ip ssh version 2` ke baad `show ip ssh` mein `version 2.0` dikhta hai. `crypto key zeroize rsa` se keys hata do toh SSH phir se band ho jaata hai.",
          },
        },
      ],
    },
    {
      id: "hardening-vty",
      heading: { en: "Tightening the VTY lines", hi: "VTY lines ko aur tight karna" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**Configure every VTY line.** Catalyst switches have 16 lines (`line vty 0 15`). Many routers show only `line vty 0 4` by default. If you configure 0 4 on a switch, lines 5 to 15 keep their old settings, and the sixth session open at the same time lands on one of them, still accepting Telnet or an old password.",
              hi: "**Har VTY line configure karo.** Catalyst switches mein 16 lines hoti hain (`line vty 0 15`). Kai routers by default sirf `line vty 0 4` dikhate hain. Switch par sirf 0 4 configure kiya toh lines 5 se 15 purani settings par rehti hain, aur ek saath khula chhatha session unhi mein se kisi line par aayega, jahan shayad abhi bhi Telnet ya purana password chalta hai.",
            },
            {
              en: "**`transport input`** takes `ssh`, `telnet`, `ssh telnet`, `all` or `none`. The default differs by platform and release (older IOS accepts every protocol), so always set it yourself.",
              hi: "**`transport input`** mein `ssh`, `telnet`, `ssh telnet`, `all` ya `none` de sakte ho. Default platform aur release ke hisaab se alag hota hai (purana IOS har protocol accept karta hai), isliye ise hamesha khud set karo.",
            },
            {
              en: "**`login local`** checks usernames in the running-config. Plain `login` checks only a line password and ignores usernames, which does not fit SSH.",
              hi: "**`login local`** running-config ke usernames check karta hai. Sirf `login` likha toh woh sirf line password check karta hai aur usernames ignore karta hai, jo SSH ke saath fit nahi baithta.",
            },
            {
              en: "**`exec-timeout 10 0`** logs out an idle session after 10 minutes and 0 seconds. That is the default; lower it if you like, but never use `exec-timeout 0 0`, which means never.",
              hi: "**`exec-timeout 10 0`** idle session ko 10 minute 0 second baad logout kar deta hai. Yahi default hai; chaho toh kam karo, lekin `exec-timeout 0 0` kabhi mat lagao, uska matlab hai kabhi timeout nahi.",
            },
            {
              en: "**`access-class 10 in`** applies standard ACL 10 to incoming VTY sessions, so only the listed source addresses even get a login prompt. You will learn ACLs properly in lesson 5.4; for now read `access-list 10 permit 10.1.10.0 0.0.0.255` as \"allow 10.1.10.0/24, deny everyone else\".",
              hi: "**`access-class 10 in`** standard ACL 10 ko aane wale VTY sessions par lagata hai, toh sirf listed source addresses ko hi login prompt milta hai. ACLs lesson 5.4 mein theek se seekhoge; abhi ke liye `access-list 10 permit 10.1.10.0 0.0.0.255` ko aise padho: \"10.1.10.0/24 ko allow karo, baaki sabko deny\".",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "Only the admin subnet may connect", hi: "Sirf admin subnet connect kar sakta hai" },
          lines: [
            { prompt: "SW1(config)#", cmd: "access-list 10 permit 10.1.10.0 0.0.0.255" },
            { prompt: "SW1(config)#", cmd: "line vty 0 15" },
            { prompt: "SW1(config-line)#", cmd: "access-class 10 in", comment: { en: "Filter by source IP before login", hi: "Login se pehle source IP se filter" } },
            { prompt: "SW1(config-line)#", cmd: "exec-timeout 10 0" },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Land directly in privileged EXEC", hi: "Seedha privileged EXEC mein pahuncho" },
          text: {
            en: "A user created with `username admin secret ...` lands at the `>` prompt and still needs the enable secret. If the device has no enable secret at all, `enable` over SSH fails with `% No password set`. Either set `enable secret`, or create the user with `username admin privilege 15 secret ...` so the login goes straight to `#`.",
            hi: "`username admin secret ...` se bana user `>` prompt par aata hai aur use ab bhi enable secret chahiye. Agar device par enable secret hai hi nahi, toh SSH par `enable` `% No password set` ke saath fail hota hai. Ya toh `enable secret` set karo, ya user ko `username admin privilege 15 secret ...` se banao taaki login seedha `#` par pahunche.",
          },
        },
      ],
    },
    {
      id: "verify-and-connect",
      heading: { en: "Verifying and connecting", hi: "Verify karna aur connect karna" },
      blocks: [
        {
          type: "cli",
          title: { en: "Is the SSH server running, and who is connected?", hi: "SSH server chal raha hai, aur kaun connected hai?" },
          lines: [
            { prompt: "SW1#", cmd: "show ip ssh" },
            { out: "SSH Enabled - version 2.0" },
            { out: "Authentication timeout: 120 secs; Authentication retries: 3", comment: { en: "Defaults, changed with ip ssh time-out and ip ssh authentication-retries", hi: "Defaults hain, ip ssh time-out aur ip ssh authentication-retries se badalte hain" } },
            { prompt: "SW1#", cmd: "show ssh" },
            { out: "Connection Version Mode Encryption  Hmac         State                 Username" },
            { out: "0          2.0     IN   aes128-ctr  hmac-sha1    Session started       admin" },
            { out: "0          2.0     OUT  aes128-ctr  hmac-sha1    Session started       admin" },
            { out: "%No SSHv1 server connections running." },
          ],
          note: {
            en: "`show ssh` lists one row per direction of each session. The exact algorithm list in `show ip ssh` varies by IOS release.",
            hi: "`show ssh` har session ki har direction ke liye ek row dikhata hai. `show ip ssh` mein algorithms ki exact list IOS release ke hisaab se badalti hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Opening an SSH session", hi: "SSH session kholna" },
          columns: [{ en: "From", hi: "Kahan se" }, { en: "Command", hi: "Command" }],
          rows: [
            [{ en: "Windows, macOS or Linux terminal", hi: "Windows, macOS ya Linux terminal" }, "ssh admin@10.1.99.2   or   ssh -l admin 10.1.99.2"],
            [{ en: "Packet Tracer PC command prompt", hi: "Packet Tracer PC ka command prompt" }, "ssh -l admin 10.1.99.2"],
            [{ en: "Another Cisco router (EXEC mode)", hi: "Doosra Cisco router (EXEC mode)" }, "R1# ssh -l admin 10.1.99.2"],
            [{ en: "GUI client", hi: "GUI client" }, { en: "PuTTY or SecureCRT, host 10.1.99.2, port 22", hi: "PuTTY ya SecureCRT, host 10.1.99.2, port 22" }],
          ],
        },
        {
          type: "table",
          caption: { en: "When SSH does not work", hi: "Jab SSH kaam na kare" },
          columns: [{ en: "Symptom", hi: "Symptom" }, { en: "Likely cause", hi: "Shayad wajah" }],
          rows: [
            [{ en: "`% Please define a domain-name first.` when generating keys", hi: "Keys generate karte waqt `% Please define a domain-name first.`" }, { en: "Missing `ip domain-name`", hi: "`ip domain-name` missing hai" }],
            [{ en: "Connection refused on port 22", hi: "Port 22 par connection refused" }, { en: "No RSA keys, so no SSH server; or an `access-class` denies your source", hi: "RSA keys nahi, toh SSH server nahi; ya `access-class` tumhara source deny kar raha hai" }],
            [{ en: "Timeout from other subnets only", hi: "Sirf doosre subnets se timeout" }, { en: "Switch has no `ip default-gateway`", hi: "Switch par `ip default-gateway` nahi hai" }],
            [{ en: "Password rejected although it is correct", hi: "Sahi password bhi reject ho raha hai" }, { en: "Lines use `login` instead of `login local`, or the username is wrong", hi: "Lines par `login local` ki jagah `login` hai, ya username galat hai" }],
            [{ en: "`% No password set` after typing enable", hi: "enable type karne par `% No password set`" }, { en: "No `enable secret` configured", hi: "`enable secret` configure nahi hai" }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Old IOS, new laptop", hi: "Purana IOS, naya laptop" },
          text: {
            en: "Recent OpenSSH clients turned off some old algorithms. Against an old IOS release you may see `no matching host key type found. Their offer: ssh-rsa`. Upgrading IOS is the real fix; for a lab, `ssh -o HostKeyAlgorithms=+ssh-rsa admin@10.1.99.2` gets you in. This is beyond the exam, but you will meet it at work.",
            hi: "Naye OpenSSH clients ne kuch purane algorithms band kar diye hain. Purane IOS release se connect karte waqt `no matching host key type found. Their offer: ssh-rsa` dikh sakta hai. Asli fix IOS upgrade karna hai; lab ke liye `ssh -o HostKeyAlgorithms=+ssh-rsa admin@10.1.99.2` se andar ja sakte ho. Yeh exam se bahar hai, lekin job par zaroor milega.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "SSH", def: { en: "Secure Shell, a remote CLI protocol on TCP port 22 that encrypts the whole session. Use version 2.", hi: "Secure Shell, TCP port 22 par chalne wala remote CLI protocol jo poora session encrypt karta hai. Version 2 use karo." } },
    { term: "Telnet", def: { en: "A remote CLI protocol on TCP port 23 that sends everything in clear text.", hi: "TCP port 23 par chalne wala remote CLI protocol jo sab kuch clear text mein bhejta hai." } },
    { term: "RSA key pair", def: { en: "The public and private key the device uses to prove its identity during the SSH key exchange. Named hostname.domain.", hi: "Public aur private key jinse device SSH key exchange ke dauran apni identity prove karta hai. Naam hostname.domain hota hai." } },
    { term: "Host key fingerprint", def: { en: "A short hash of the device's public key that the client shows on first connection and remembers afterwards.", hi: "Device ki public key ka chhota hash jo client pehle connection par dikhata hai aur baad mein yaad rakhta hai." } },
    { term: "VTY lines", def: { en: "Virtual terminal lines where remote Telnet and SSH sessions arrive; 0 15 on Catalyst switches.", hi: "Virtual terminal lines jahan remote Telnet aur SSH sessions aate hain; Catalyst switches par 0 15." } },
    { term: "transport input", def: { en: "The line command that decides which protocols may open a session on the VTY lines.", hi: "Line command jo decide karta hai ki VTY lines par kaunse protocols session khol sakte hain." } },
    { term: "access-class", def: { en: "Applies a standard ACL to VTY lines to control which source IPs may connect.", hi: "VTY lines par standard ACL lagata hai taaki control ho ki kaunse source IPs connect kar sakte hain." } },
    { term: "exec-timeout", def: { en: "Idle time after which a line logs the user out; the default is 10 minutes.", hi: "Woh idle time jiske baad line user ko logout kar deti hai; default 10 minute hai." } },
  ],
  commands: [
    { cmd: "hostname SW1", mode: "Global config", does: { en: "Set a non-default hostname (needed for the key name)", hi: "Non-default hostname set karo (key name ke liye zaroori)" } },
    { cmd: "ip domain-name example.com", mode: "Global config", does: { en: "Set the domain name used in the key name", hi: "Key name mein use hone wala domain name set karo" } },
    { cmd: "crypto key generate rsa modulus 2048", mode: "Global config", does: { en: "Create the RSA key pair and enable the SSH server", hi: "RSA key pair banao aur SSH server enable karo" } },
    { cmd: "ip ssh version 2", mode: "Global config", does: { en: "Accept SSH version 2 only", hi: "Sirf SSH version 2 accept karo" } },
    { cmd: "username admin secret Str0ng-Pa55", mode: "Global config", does: { en: "Create a local user with a hashed password", hi: "Hashed password wala local user banao" } },
    { cmd: "line vty 0 15", mode: "Global config", does: { en: "Enter the 16 VTY lines", hi: "16 VTY lines mein jao" } },
    { cmd: "login local", mode: "Line config", does: { en: "Authenticate against the local username database", hi: "Local username database se authenticate karo" } },
    { cmd: "transport input ssh", mode: "Line config", does: { en: "Allow SSH only on these lines", hi: "In lines par sirf SSH allow karo" } },
    { cmd: "access-class 10 in", mode: "Line config", does: { en: "Allow sessions only from sources permitted by ACL 10", hi: "Sirf ACL 10 mein permitted sources se sessions allow karo" } },
    { cmd: "exec-timeout 10 0", mode: "Line config", does: { en: "Log out idle sessions after 10 minutes", hi: "Idle sessions ko 10 minute baad logout karo" } },
    { cmd: "crypto key zeroize rsa", mode: "Global config", does: { en: "Delete the RSA keys, which disables SSH", hi: "RSA keys delete karo, jisse SSH band ho jaata hai" } },
    { cmd: "show ip ssh", mode: "Privileged EXEC", does: { en: "Show whether SSH is enabled, its version, timeout and retries", hi: "Dikhata hai SSH enabled hai ya nahi, version, timeout aur retries" } },
    { cmd: "show ssh", mode: "Privileged EXEC", does: { en: "List active SSH sessions", hi: "Active SSH sessions list karta hai" } },
    { cmd: "ssh -l admin 10.1.99.2", mode: "IOS EXEC, Packet Tracer PC or host terminal", does: { en: "Open an SSH session as user admin", hi: "User admin ke roop mein SSH session kholo" } },
  ],
  mistakes: [
    {
      en: "Generating the key before setting a domain name (or while the hostname is still the default). IOS refuses; set `hostname` and `ip domain-name` first.",
      hi: "Domain name set karne se pehle (ya default hostname ke saath hi) key generate karna. IOS mana kar deta hai; pehle `hostname` aur `ip domain-name` set karo.",
    },
    {
      en: "Generating a 512-bit key. SSHv2 needs at least 768 bits, so IOS will not enable version 2 with it. Use `modulus 2048`.",
      hi: "512-bit key generate karna. SSHv2 ko kam se kam 768 bits chahiye, isliye us key ke saath IOS version 2 enable nahi karta. `modulus 2048` use karo.",
    },
    {
      en: "Using `login` instead of `login local`. Plain `login` checks a line password and ignores the username you created.",
      hi: "`login local` ki jagah `login` lagana. Sirf `login` line password check karta hai aur tumhara banaya username ignore karta hai.",
    },
    {
      en: "Leaving out `transport input ssh`. On platforms whose default accepts Telnet, the device keeps answering on TCP 23 even though SSH works.",
      hi: "`transport input ssh` chhod dena. Jin platforms ka default Telnet accept karta hai, wahan SSH chalne ke baad bhi device TCP 23 par jawab deta rehta hai.",
    },
    {
      en: "Configuring `line vty 0 4` on a switch that has 16 lines. Lines 5 to 15 keep their old settings. Use `line vty 0 15`.",
      hi: "16 lines wale switch par sirf `line vty 0 4` configure karna. Lines 5 se 15 purani settings par reh jaati hain. `line vty 0 15` use karo.",
    },
    {
      en: "Forgetting `ip default-gateway` on a Layer 2 switch. SSH then works only from the management subnet itself.",
      hi: "Layer 2 switch par `ip default-gateway` bhool jaana. Phir SSH sirf management subnet ke andar se hi chalta hai.",
    },
  ],
  recap: [
    { en: "Telnet TCP 23 is clear text; SSH TCP 22 is encrypted. Use SSHv2.", hi: "Telnet TCP 23 clear text hai; SSH TCP 22 encrypted hai. SSHv2 use karo." },
    { en: "Order: `hostname`, `ip domain-name`, `crypto key generate rsa modulus 2048`, `ip ssh version 2`, `username ... secret ...`.", hi: "Order yaad rakho: `hostname`, `ip domain-name`, `crypto key generate rsa modulus 2048`, `ip ssh version 2`, phir `username ... secret ...`." },
    { en: "VTY lines: `login local`, `transport input ssh`, optional `access-class` and `exec-timeout`. Configure 0 15 on switches.", hi: "VTY lines: `login local`, `transport input ssh`, optional `access-class` aur `exec-timeout`. Switches par 0 15 configure karo." },
    { en: "SSHv2 needs an RSA key of at least 768 bits. Version 1.99 means v1 and v2 are both accepted.", hi: "SSHv2 ko kam se kam 768 bits ki RSA key chahiye. Version 1.99 ka matlab v1 aur v2 dono accept hote hain." },
    { en: "Verify with `show ip ssh` and `show ssh`; connect with `ssh -l admin 10.1.99.2` or `ssh admin@10.1.99.2`.", hi: "`show ip ssh` aur `show ssh` se verify karo; `ssh -l admin 10.1.99.2` ya `ssh admin@10.1.99.2` se connect karo." },
    { en: "A Layer 2 switch needs an SVI and `ip default-gateway` to be reached from other subnets.", hi: "Doosre subnets se pahunchne ke liye Layer 2 switch ko SVI aur `ip default-gateway` chahiye." },
  ],
  quiz: [
    {
      q: {
        en: "Why should you use SSH instead of Telnet to manage a router?",
        hi: "Router manage karne ke liye Telnet ki jagah SSH kyun use karna chahiye?",
      },
      options: [
        { en: "SSH uses UDP, so it is faster than Telnet", hi: "SSH UDP use karta hai, isliye Telnet se fast hai" },
        { en: "SSH does not need a username or password", hi: "SSH ko username ya password nahi chahiye" },
        { en: "SSH encrypts the session, including the login credentials", hi: "SSH poora session encrypt karta hai, login credentials bhi" },
        { en: "SSH works without an IP address on the router", hi: "SSH router par bina IP address ke kaam karta hai" },
      ],
      answer: 2,
      explain: {
        en: "SSH runs over TCP port 22 and encrypts everything after the key exchange, so a capture shows no password. It still needs a username and an IP address; only out-of-band access such as the console port works without an IP.",
        hi: "SSH TCP port 22 par chalta hai aur key exchange ke baad sab kuch encrypt karta hai, isliye capture mein koi password nahi dikhta. Use phir bhi username aur IP address chahiye; bina IP ke sirf console port jaisa out-of-band access kaam karta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "On SW1 you type `crypto key generate rsa modulus 2048` and get `% Please define a domain-name first.` What do you configure next?",
        hi: "SW1 par tum `crypto key generate rsa modulus 2048` type karte ho aur `% Please define a domain-name first.` aata hai. Ab kya configure karoge?",
      },
      options: [
        { en: "ip domain-name example.com", hi: "ip domain-name example.com" },
        { en: "ip ssh version 2", hi: "ip ssh version 2" },
        { en: "ip domain-lookup", hi: "ip domain-lookup" },
        { en: "transport input ssh", hi: "transport input ssh" },
      ],
      answer: 0,
      explain: {
        en: "The key pair is named hostname.domain, so IOS needs a domain name before it can create it. `ip domain-lookup` turns on DNS lookups, which is unrelated, and `ip ssh version 2` needs the key to exist first.",
        hi: "Key pair ka naam hostname.domain hota hai, isliye key banane se pehle IOS ko domain name chahiye. `ip domain-lookup` DNS lookups on karta hai, uska isse koi lena-dena nahi, aur `ip ssh version 2` ke liye pehle key honi chahiye.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "SW1 has SVI Vlan99 10.1.99.2/24 and a working SSH configuration. A PC at 10.1.99.20 can SSH to it, but an admin at 10.1.10.50 gets a timeout. No ACLs are configured. What is the most likely cause?",
        hi: "SW1 ka SVI Vlan99 10.1.99.2/24 hai aur SSH configuration sahi hai. 10.1.99.20 wala PC SSH kar pa raha hai, lekin 10.1.10.50 wale admin ko timeout milta hai. Koi ACL configure nahi hai. Sabse likely wajah kya hai?",
      },
      options: [
        { en: "The RSA key is smaller than 768 bits", hi: "RSA key 768 bits se chhoti hai" },
        { en: "`transport input telnet` is configured", hi: "`transport input telnet` configure hai" },
        { en: "`login local` is missing on the VTY lines", hi: "VTY lines par `login local` missing hai" },
        { en: "SW1 has no `ip default-gateway`", hi: "SW1 par `ip default-gateway` nahi hai" },
      ],
      answer: 3,
      explain: {
        en: "SSH works from the local subnet, so the keys, the transport and the login are fine. From another subnet the SYN arrives but SW1 cannot send replies off its subnet without `ip default-gateway`, so the admin sees a timeout.",
        hi: "Local subnet se SSH chal raha hai, matlab keys, transport aur login sab theek hain. Doosre subnet se SYN pahunch jaata hai, lekin `ip default-gateway` ke bina SW1 apne subnet ke bahar reply nahi bhej sakta, isliye admin ko timeout dikhta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "What is the smallest RSA modulus that allows `ip ssh version 2` to be enabled?",
        hi: "Sabse chhota RSA modulus kaunsa hai jiske saath `ip ssh version 2` enable ho sakta hai?",
      },
      options: [
        { en: "512 bits", hi: "512 bits" },
        { en: "768 bits", hi: "768 bits" },
        { en: "1024 bits", hi: "1024 bits" },
        { en: "2048 bits", hi: "2048 bits" },
      ],
      answer: 1,
      explain: {
        en: "SSHv2 needs a key of at least 768 bits. 2048 is what you should actually use, but it is the recommendation, not the minimum. A 512-bit key allows only SSH version 1.",
        hi: "SSHv2 ko kam se kam 768 bits ki key chahiye. Asli mein 2048 use karna chahiye, lekin woh recommendation hai, minimum nahi. 512-bit key ke saath sirf SSH version 1 chal sakta hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "`show ip ssh` on R1 shows `SSH Enabled - version 1.99`. What does this mean?",
        hi: "R1 par `show ip ssh` dikhata hai `SSH Enabled - version 1.99`. Iska kya matlab hai?",
      },
      options: [
        { en: "R1 runs a pre-release version of SSH 2", hi: "R1 SSH 2 ka pre-release version chala raha hai" },
        { en: "R1 accepts only SSH version 1", hi: "R1 sirf SSH version 1 accept karta hai" },
        { en: "R1 accepts both SSH version 1 and version 2", hi: "R1 SSH version 1 aur version 2 dono accept karta hai" },
        { en: "The RSA key is too small for SSH", hi: "RSA key SSH ke liye bahut chhoti hai" },
      ],
      answer: 2,
      explain: {
        en: "1.99 is the compatibility value: the server speaks both versions. `ip ssh version 2` changes it to 2.0 so that clients cannot fall back to the weaker version 1.",
        hi: "1.99 compatibility value hai: server dono versions bolta hai. `ip ssh version 2` ise 2.0 kar deta hai taaki clients kamzor version 1 par wapas na ja sakein.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "R1's VTY lines have `login local`, `transport input ssh` and `access-class 10 in`, where `access-list 10 permit 10.1.10.0 0.0.0.255`. Which connection succeeds?",
        hi: "R1 ki VTY lines par `login local`, `transport input ssh` aur `access-class 10 in` hai, aur `access-list 10 permit 10.1.10.0 0.0.0.255` hai. Kaunsa connection successful hoga?",
      },
      options: [
        { en: "SSH from 10.1.10.50", hi: "10.1.10.50 se SSH" },
        { en: "Telnet from 10.1.10.50", hi: "10.1.10.50 se Telnet" },
        { en: "SSH from 10.1.20.50", hi: "10.1.20.50 se SSH" },
        { en: "Telnet from 10.1.20.50", hi: "10.1.20.50 se Telnet" },
      ],
      answer: 0,
      explain: {
        en: "A session must pass both checks: the protocol must be SSH (`transport input ssh`) and the source must be in 10.1.10.0/24 (ACL 10 ends with an implicit deny). Only SSH from 10.1.10.50 passes both.",
        hi: "Session ko dono checks pass karne honge: protocol SSH hona chahiye (`transport input ssh`) aur source 10.1.10.0/24 mein hona chahiye (ACL 10 ke end mein implicit deny hai). Sirf 10.1.10.50 se SSH dono pass karta hai.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "AvgYqI2qSD4",
      title: "Free CCNA | SSH | Day 42",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Console and VTY security, the SSHv2 configuration steps and a packet capture comparing Telnet with SSH.", hi: "Console aur VTY security, SSHv2 configuration steps, aur Telnet vs SSH ka packet capture." },
    },
    {
      id: "QnHq7iCOtTc",
      title: "Free CCNA | SSH | Day 42 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Packet Tracer lab: configure SSH on a router and a switch, then connect from a PC.", hi: "Packet Tracer lab: router aur switch par SSH configure karo, phir PC se connect karo." },
    },
    {
      id: "XQiaXNre9TU",
      title: "46. Free CCNA (NEW) | Router & iOS - Telnet and SSH Configuration | CCNA 200-301 Full Hindi Course",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walkthrough of Telnet and SSH configuration on a router.", hi: "Router par Telnet aur SSH configuration ka Hindi walkthrough." },
    },
  ],
  lab: {
    title: { en: "SSH into a switch from another subnet", hi: "Doosre subnet se switch par SSH karo" },
    steps: [
      {
        en: "In Packet Tracer, connect a 2960 switch SW1 and a PC (10.1.10.50/24, gateway 10.1.10.1) to router R1. Give R1 Gi0/0 10.1.10.1/24 and Gi0/1 10.1.99.1/24, and put SW1's uplink in VLAN 99.",
        hi: "Packet Tracer mein 2960 switch SW1 aur ek PC (10.1.10.50/24, gateway 10.1.10.1) ko router R1 se jodo. R1 ke Gi0/0 ko 10.1.10.1/24 aur Gi0/1 ko 10.1.99.1/24 do, aur SW1 ka uplink VLAN 99 mein daalo.",
      },
      {
        en: "On SW1 create `interface vlan 99` with 10.1.99.2/24 and `no shutdown`, but do not set a default gateway yet.",
        hi: "SW1 par `interface vlan 99` banao, IP 10.1.99.2/24 aur `no shutdown`, lekin abhi default gateway set mat karo.",
      },
      {
        en: "Configure SSH: `hostname`, `ip domain-name`, `crypto key generate rsa modulus 2048`, `ip ssh version 2`, a user, and `line vty 0 15` with `login local` and `transport input ssh`.",
        hi: "SSH configure karo: `hostname`, `ip domain-name`, `crypto key generate rsa modulus 2048`, `ip ssh version 2`, ek user, aur `line vty 0 15` par `login local` aur `transport input ssh`.",
      },
      {
        en: "From the PC run `ssh -l admin 10.1.99.2`. It times out. Add `ip default-gateway 10.1.99.1` on SW1 and try again.",
        hi: "PC se `ssh -l admin 10.1.99.2` chalao. Timeout aayega. SW1 par `ip default-gateway 10.1.99.1` add karo aur dobara try karo.",
      },
      {
        en: "Once logged in, run `show ssh` and `show users`. Then try `telnet 10.1.99.2` from the PC and confirm it is refused.",
        hi: "Login hone ke baad `show ssh` aur `show users` chalao. Phir PC se `telnet 10.1.99.2` try karo aur confirm karo ki woh refuse hota hai.",
      },
      {
        en: "Add `access-list 10 permit 10.1.10.0 0.0.0.255` and `access-class 10 in` on the VTY lines, then add a second PC in VLAN 99 (10.1.99.20/24) and watch its SSH attempt get refused.",
        hi: "`access-list 10 permit 10.1.10.0 0.0.0.255` aur VTY lines par `access-class 10 in` add karo, phir VLAN 99 mein doosra PC (10.1.99.20/24) lagao aur dekho uska SSH attempt refuse hota hai.",
      },
    ],
  },
};

export default lesson;
