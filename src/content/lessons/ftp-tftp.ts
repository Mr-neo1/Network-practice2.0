import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "ftp-tftp",
  intro: {
    en: "A router's operating system and its configuration are just files. When you upgrade IOS, back up a configuration before a change, or rebuild a failed device, you move those files across the network. TFTP and FTP are the two classic protocols for the job: TFTP is tiny and has no security at all, FTP has logins and directory commands but still sends everything in clear text. The CCNA asks you to describe both and know when each fits.",
    hi: "Router ka operating system aur uski configuration asal mein sirf files hain. Jab tum IOS upgrade karte ho, change se pehle configuration ka backup lete ho, ya kharab device ko dobara banate ho, tab yeh files network par move karni padti hain. Iske do classic protocols hain TFTP aur FTP: TFTP bahut chhota hai aur usme security bilkul nahi, FTP mein login aur directory commands hain lekin woh bhi sab kuch clear text mein bhejta hai. CCNA chahta hai ki tum dono ko describe kar sako aur jaano kab kaunsa fit hota hai.",
  },
  outcomes: [
    { en: "Name the IOS file systems (flash:, nvram:, system:) and what each holds", hi: "IOS file systems (flash:, nvram:, system:) ke naam aur unme kya rehta hai bata sako" },
    { en: "Describe how TFTP transfers a file: UDP 69, no authentication, one acknowledged block at a time", hi: "Describe kar sako ki TFTP file kaise transfer karta hai: UDP 69, koi authentication nahi, ek baar mein ek acknowledged block" },
    { en: "Describe FTP's control and data connections, and active versus passive mode", hi: "FTP ke control aur data connections, aur active vs passive mode describe kar sako" },
    { en: "Upgrade an IOS image with `copy tftp: flash:` and `boot system`, and verify it with `show version`", hi: "`copy tftp: flash:` aur `boot system` se IOS image upgrade kar sako, aur `show version` se verify kar sako" },
    { en: "Back up and restore configurations with TFTP and FTP without falling into the merge trap", hi: "TFTP aur FTP se configurations ka backup aur restore kar sako, merge wale trap mein phanse bina" },
  ],
  sections: [
    {
      id: "files-on-a-router",
      heading: { en: "Files on a router: the IOS file system", hi: "Router par files: IOS file system" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 0.8 you saved the running-config to the startup-config. Both are files, and IOS keeps them, along with the operating system, in named storage areas. Every `copy` command is simply \"copy from this place to that place\".",
            hi: "Lesson 0.8 mein tumne running-config ko startup-config mein save kiya tha. Dono files hain, aur IOS inhe, operating system ke saath, alag-alag naam wale storage areas mein rakhta hai. Har `copy` command bas itna kehta hai: \"is jagah se us jagah copy karo\".",
          },
        },
        {
          type: "table",
          caption: { en: "Where things live", hi: "Kya kahan rehta hai" },
          columns: [{ en: "File system", hi: "File system" }, { en: "What it is", hi: "Kya hai" }, { en: "Typical contents", hi: "Usually kya hota hai" }],
          rows: [
            ["flash:", { en: "Flash memory, keeps files across reboots", hi: "Flash memory, reboot ke baad bhi files rehti hain" }, { en: "IOS image files; vlan.dat on switches", hi: "IOS image files; switches par vlan.dat" }],
            ["nvram:", { en: "Non-volatile RAM", hi: "Non-volatile RAM" }, "startup-config"],
            ["system:", { en: "The device's RAM", hi: "Device ki RAM" }, { en: "running-config (lost on reload)", hi: "running-config (reload par chali jaati hai)" }],
            ["tftp:  ftp:  scp:", { en: "Remote servers, reached over the network", hi: "Network par remote servers" }, { en: "Backups and new images", hi: "Backups aur nayi images" }],
          ],
        },
        {
          type: "cli",
          title: { en: "What is in R1's flash?", hi: "R1 ki flash mein kya hai?" },
          lines: [
            { prompt: "R1#", cmd: "show flash:" },
            { out: "-#- --length-- -----date/time------ path" },
            { out: "1     68831808 Mar 14 2016 10:22:04 +00:00 c1900-universalk9-mz.SPA.151-4.M4.bin", comment: { en: "The running IOS image, about 69 MB", hi: "Chalti hui IOS image, lagbhag 69 MB" } },
            { out: "2         3064 Mar 14 2016 10:31:18 +00:00 cpconfig-19xx.cfg" },
            { out: "187416576 bytes available (68845568 bytes used)", comment: { en: "Room for a second image before you delete the first", hi: "Pehli image delete karne se pehle doosri ke liye jagah hai" } },
          ],
          note: {
            en: "`dir flash:` shows the same files. On ISR G2 routers such as the 1941, flash: is another name for flash0:, so `show version` reports the image as flash0:.",
            hi: "`dir flash:` bhi yahi files dikhata hai. 1941 jaise ISR G2 routers par flash: asal mein flash0: ka doosra naam hai, isliye `show version` image ko flash0: ke saath dikhata hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "The image name tells you a lot: `c1900` is the platform, `universalk9` the feature set (k9 means it has cryptography, which SSH needs), and `151-4.M4` the release, 15.1(4)M4.",
            hi: "Image ka naam bahut kuch batata hai: `c1900` platform hai, `universalk9` feature set (k9 matlab cryptography hai, jo SSH ke liye chahiye), aur `151-4.M4` release, yaani 15.1(4)M4.",
          },
        },
      ],
    },
    {
      id: "tftp",
      heading: { en: "TFTP: trivial on purpose", hi: "TFTP: jaan-boojh kar simple" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**TFTP (Trivial File Transfer Protocol)** does one thing: read or write a single named file. It is small enough to live in a router's ROMMON for disaster recovery and in IP phones that fetch their configuration at boot. To stay that small, it leaves almost everything out.",
            hi: "**TFTP (Trivial File Transfer Protocol)** sirf ek kaam karta hai: ek naam wali file read ya write karna. Yeh itna chhota hai ki disaster recovery ke liye router ke ROMMON mein bhi rehta hai, aur IP phones boot par isi se apni configuration laate hain. Itna chhota rehne ke liye isme lagbhag sab kuch chhod diya gaya hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**UDP port 69** for the first request. The server then answers from a new random port, and the transfer continues on that port pair.",
              hi: "Pehli request ke liye **UDP port 69**. Phir server ek naye random port se jawab deta hai, aur transfer usi port pair par chalta hai.",
            },
            {
              en: "**No authentication.** Anyone who can reach the server can read files from it, and often write to it.",
              hi: "**Koi authentication nahi.** Jo bhi server tak pahunch sake, woh usse files padh sakta hai, aur aksar likh bhi sakta hai.",
            },
            {
              en: "**No directory listing**, no rename, no delete. You must already know the exact file name.",
              hi: "**Koi directory listing nahi**, na rename, na delete. Tumhe file ka exact naam pehle se pata hona chahiye.",
            },
            {
              en: "**Lock-step reliability.** UDP gives none, so TFTP numbers each 512-byte DATA block and waits for its ACK before sending the next. A lost block is resent when the sender's timer expires. 512 bytes is the default; client and server can agree on a bigger block with the `blksize` option, which is beyond the CCNA.",
              hi: "**Lock-step reliability.** UDP koi reliability nahi deta, isliye TFTP har 512-byte DATA block ko number deta hai aur agla bhejne se pehle uske ACK ka wait karta hai. Block kho jaaye toh sender ka timer expire hone par woh dobara jaata hai. 512 bytes default hai; client aur server `blksize` option se bada block decide kar sakte hain, lekin yeh CCNA se bahar hai.",
            },
            {
              en: "**A short block means the end.** A DATA block with fewer than 512 bytes is the last one. If the file is an exact multiple of 512 bytes, a final empty block is sent.",
              hi: "**Chhota block matlab end.** 512 se kam bytes wala DATA block aakhri hota hai. Agar file exactly 512 ka multiple ho, toh end mein ek khaali block bheja jaata hai.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "The five TFTP message types", hi: "TFTP ke paanch message types" },
          columns: [{ en: "Opcode", hi: "Opcode" }, { en: "Message", hi: "Message" }, { en: "Used for", hi: "Kis liye" }],
          rows: [
            ["1", "RRQ", { en: "Read request: client downloads a file (copy tftp: flash:)", hi: "Read request: client file download karta hai (copy tftp: flash:)" }],
            ["2", "WRQ", { en: "Write request: client uploads a file (copy running-config tftp:)", hi: "Write request: client file upload karta hai (copy running-config tftp:)" }],
            ["3", "DATA", { en: "Block number plus up to 512 bytes", hi: "Block number aur 512 bytes tak data" }],
            ["4", "ACK", { en: "Confirms one block number", hi: "Ek block number confirm karta hai" }],
            ["5", "ERROR", { en: "For example \"File not found\"; ends the transfer", hi: "Jaise \"File not found\"; transfer khatam kar deta hai" }],
          ],
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "TFTP is like reading a long phone number to someone one digit group at a time and waiting for \"got it\" after each group. It never goes wrong, but on a bad line it takes a while.",
            hi: "TFTP aisa hai jaise kisi ko lamba phone number ek-ek group karke bolo aur har group ke baad \"haan, likh liya\" ka wait karo. Galti nahi hoti, lekin line kharab ho toh time lagta hai.",
          },
        },
      ],
    },
    {
      id: "ftp",
      heading: { en: "FTP: logins, directories and two connections", hi: "FTP: login, directories aur do connections" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**FTP (File Transfer Protocol)** runs over TCP, so TCP handles reliability and windowing (lesson 1.7) and transfers of large images are faster than with TFTP. FTP needs a username and password, and it lets you list, create, rename and delete files and directories on the server.",
            hi: "**FTP (File Transfer Protocol)** TCP par chalta hai, isliye reliability aur windowing TCP sambhalta hai (lesson 1.7), aur badi images ka transfer TFTP se fast hota hai. FTP ko username aur password chahiye, aur isse tum server par files aur directories list, create, rename aur delete kar sakte ho.",
          },
        },
        {
          type: "p",
          text: {
            en: "FTP uses **two TCP connections**. The **control connection** goes to server port **21** and stays open for the whole session; commands such as `USER`, `PASS`, `LIST`, `RETR` (download) and `STOR` (upload) travel on it, with numbered replies such as `230` and `226`. Each file or directory listing travels on a separate **data connection**, opened for that transfer and closed afterwards. Who opens the data connection depends on the mode.",
            hi: "FTP **do TCP connections** use karta hai. **Control connection** server ke port **21** par jaata hai aur poore session tak khula rehta hai; `USER`, `PASS`, `LIST`, `RETR` (download) aur `STOR` (upload) jaise commands isi par jaate hain, aur `230`, `226` jaise numbered replies aate hain. Har file ya directory listing ek alag **data connection** par jaati hai, jo us transfer ke liye khulta hai aur baad mein band ho jaata hai. Data connection kaun kholta hai, yeh mode par depend karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Active and passive FTP", hi: "Active aur passive FTP" },
          columns: ["", { en: "Active mode", hi: "Active mode" }, { en: "Passive mode", hi: "Passive mode" }],
          rows: [
            [{ en: "Client tells the server", hi: "Client server ko kya bolta hai" }, { en: "`PORT`: its own IP and a port to connect to", hi: "`PORT`: apna IP aur ek port jispar connect karna hai" }, { en: "`PASV`: please give me a port", hi: "`PASV`: mujhe ek port do" }],
            [{ en: "Data connection opened by", hi: "Data connection kaun kholta hai" }, { en: "Server, from **TCP 20** to the client's port", hi: "Server, **TCP 20** se client ke port par" }, { en: "Client, to the port in the server's `227` reply", hi: "Client, server ke `227` reply mein diye port par" }],
            [{ en: "Behind a firewall or NAT", hi: "Firewall ya NAT ke peeche" }, { en: "Often fails: the connection comes in from outside", hi: "Aksar fail hota hai: connection bahar se andar aata hai" }, { en: "Works: the client opens every connection outward", hi: "Chalta hai: client har connection bahar ki taraf kholta hai" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "A password is not encryption", hi: "Password hona encryption nahi hai" },
          text: {
            en: "FTP sends the username, the password and the file contents in clear text, exactly like Telnet. For a secure transfer use **SFTP** (a file transfer inside SSH, TCP 22) or **FTPS** (FTP wrapped in TLS). They are different protocols despite the similar names. Cisco devices also support **SCP** (`copy scp: flash:`), which runs over SSH.",
            hi: "FTP username, password aur file ka content clear text mein bhejta hai, bilkul Telnet ki tarah. Secure transfer ke liye **SFTP** (SSH ke andar file transfer, TCP 22) ya **FTPS** (TLS mein lipta FTP) use karo. Naam milte-julte hain, lekin yeh alag protocols hain. Cisco devices **SCP** (`copy scp: flash:`) bhi support karte hain, jo SSH par chalta hai.",
          },
        },
      ],
    },
    {
      id: "compare",
      heading: { en: "TFTP and FTP compared", hi: "TFTP aur FTP ka comparison" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Feature", hi: "Feature" }, "TFTP", "FTP"],
          rows: [
            [{ en: "Transport and port", hi: "Transport aur port" }, "UDP 69", { en: "TCP 21 control; TCP 20 (active) or a server-chosen port (passive) for data", hi: "TCP 21 control; data ke liye TCP 20 (active) ya server ka chuna port (passive)" }],
            [{ en: "Reliability", hi: "Reliability" }, { en: "TFTP's own block-by-block ACKs", hi: "TFTP ke apne block-by-block ACKs" }, { en: "TCP", hi: "TCP" }],
            [{ en: "Authentication", hi: "Authentication" }, { en: "None", hi: "Koi nahi" }, { en: "Username and password", hi: "Username aur password" }],
            [{ en: "Directory operations", hi: "Directory operations" }, { en: "None; read or write one known file", hi: "Koi nahi; sirf ek pata file read ya write" }, { en: "List, change, create, rename, delete", hi: "List, change, create, rename, delete" }],
            [{ en: "Encryption", hi: "Encryption" }, { en: "None", hi: "Koi nahi" }, { en: "None (use SFTP or FTPS)", hi: "Koi nahi (SFTP ya FTPS use karo)" }],
            [{ en: "Best for", hi: "Kis kaam ke liye best" }, { en: "Quick transfers on a trusted LAN, phones, ROMMON recovery", hi: "Trusted LAN par jaldi transfer, phones, ROMMON recovery" }, { en: "Large images, transfers that need a login", hi: "Badi images, aise transfers jinme login chahiye" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "TFTP: UDP 69, no authentication, no directory listing, simple. FTP: TCP 21 control and TCP 20 data in active mode, username and password, directory operations. Neither one encrypts.",
            hi: "TFTP: UDP 69, koi authentication nahi, directory listing nahi, simple. FTP: TCP 21 control aur active mode mein TCP 20 data, username aur password, directory operations. Dono mein se koi encrypt nahi karta.",
          },
        },
      ],
    },
    {
      id: "upgrade-ios",
      heading: { en: "Upgrading IOS step by step", hi: "IOS upgrade step by step" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "Check the current image and free space with `show version` and `show flash:`. R1 runs 15.1(4)M4 and has about 187 MB free.",
              hi: "`show version` aur `show flash:` se current image aur free space check karo. R1 par 15.1(4)M4 chal raha hai aur lagbhag 187 MB free hai.",
            },
            {
              en: "Copy the new image from the TFTP server at 10.1.1.100 into flash.",
              hi: "Nayi image ko 10.1.1.100 wale TFTP server se flash mein copy karo.",
            },
            {
              en: "Optionally check the file with `verify /md5` against the MD5 hash on Cisco's download page, so you never boot a corrupted image.",
              hi: "Chaho toh `verify /md5` se file ko Cisco download page ke MD5 hash se match karo, taaki kabhi corrupt image boot na ho.",
            },
            {
              en: "Point the boot process at the new file with `boot system`, then save, because `boot system` is part of the configuration.",
              hi: "`boot system` se boot process ko nayi file par point karo, phir save karo, kyunki `boot system` configuration ka hissa hai.",
            },
            {
              en: "Reload, then confirm the new image with `show version`. Delete the old image only after the new one has booted.",
              hi: "Reload karo, phir `show version` se nayi image confirm karo. Purani image tabhi delete karo jab nayi image se boot ho jaaye.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "Upgrade over TFTP", hi: "TFTP se upgrade" },
          lines: [
            { prompt: "R1#", cmd: "copy tftp: flash:" },
            { out: "Address or name of remote host []? 10.1.1.100" },
            { out: "Source filename []? c1900-universalk9-mz.SPA.157-3.M.bin" },
            { out: "Destination filename [c1900-universalk9-mz.SPA.157-3.M.bin]?", comment: { en: "Enter keeps the same name", hi: "Enter dabao toh wahi naam rehta hai" } },
            { out: "Accessing tftp://10.1.1.100/c1900-universalk9-mz.SPA.157-3.M.bin..." },
            { out: "Loading c1900-universalk9-mz.SPA.157-3.M.bin from 10.1.1.100 (via GigabitEthernet0/0): !!!!!!!!!!", comment: { en: "The ! marks show progress while the file arrives", hi: "! marks dikhate hain ki file aa rahi hai" } },
            { out: "[OK - 108725524 bytes]" },
            { out: "108725524 bytes copied in 401.220 secs (270987 bytes/sec)" },
            { prompt: "R1#", cmd: "verify /md5 flash:c1900-universalk9-mz.SPA.157-3.M.bin", comment: { en: "Compare the result with Cisco's published MD5", hi: "Result ko Cisco ke published MD5 se match karo" } },
            { prompt: "R1#", cmd: "configure terminal" },
            { prompt: "R1(config)#", cmd: "boot system flash:c1900-universalk9-mz.SPA.157-3.M.bin" },
            { prompt: "R1(config)#", cmd: "end" },
            { prompt: "R1#", cmd: "copy running-config startup-config" },
            { prompt: "R1#", cmd: "reload" },
          ],
        },
        {
          type: "cli",
          title: { en: "After the reload", hi: "Reload ke baad" },
          lines: [
            { prompt: "R1#", cmd: "show version | include image" },
            { out: "System image file is \"flash0:c1900-universalk9-mz.SPA.157-3.M.bin\"" },
          ],
          note: {
            en: "With no `boot system` command, the router boots the first IOS image it finds in flash, which here would still be the old 15.1 image.",
            hi: "`boot system` command na ho toh router flash mein mili pehli IOS image se boot karta hai, jo yahan abhi bhi purani 15.1 image hoti.",
          },
        },
        {
          type: "cli",
          title: { en: "The same download over FTP", hi: "Yahi download FTP se" },
          lines: [
            { prompt: "R1(config)#", cmd: "ip ftp username admin", comment: { en: "Credentials R1 sends to every FTP server", hi: "Credentials jo R1 har FTP server ko bhejta hai" } },
            { prompt: "R1(config)#", cmd: "ip ftp password Ftp-Pa55" },
            { prompt: "R1(config)#", cmd: "end" },
            { prompt: "R1#", cmd: "copy ftp: flash:" },
            { out: "Address or name of remote host []? 10.1.1.200" },
            { out: "Source filename []? c1900-universalk9-mz.SPA.157-3.M.bin" },
          ],
          note: {
            en: "You can also put the credentials in the URL: `copy ftp://admin:Ftp-Pa55@10.1.1.200/c1900-universalk9-mz.SPA.157-3.M.bin flash:`. Without `ip ftp username`, IOS tries an anonymous login.",
            hi: "Credentials URL mein bhi de sakte ho: `copy ftp://admin:Ftp-Pa55@10.1.1.200/c1900-universalk9-mz.SPA.157-3.M.bin flash:`. `ip ftp username` na ho toh IOS anonymous login try karta hai.",
          },
        },
      ],
    },
    {
      id: "backup-restore",
      heading: { en: "Backing up and restoring configurations", hi: "Configurations ka backup aur restore" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Take a backup before every risky change. IOS suggests the file name `r1-confg` (hostname plus -confg); type a better name, such as one with the date, if you keep several.",
            hi: "Har risky change se pehle backup lo. IOS file name `r1-confg` suggest karta hai (hostname plus -confg); agar kai backups rakhte ho toh date wala koi achha naam type karo.",
          },
        },
        {
          type: "cli",
          title: { en: "Backups to TFTP and FTP", hi: "TFTP aur FTP par backups" },
          lines: [
            { prompt: "R1#", cmd: "copy running-config tftp:" },
            { out: "Address or name of remote host []? 10.1.1.100" },
            { out: "Destination filename [r1-confg]? R1-2026-10-01.cfg" },
            { out: "!!" },
            { out: "1652 bytes copied in 0.208 secs (7942 bytes/sec)" },
            { prompt: "R1#", cmd: "copy running-config ftp:" },
            { out: "Address or name of remote host []? 10.1.1.200" },
            { out: "Destination filename [r1-confg]?" },
            { out: "Writing r1-confg !" },
            { out: "1652 bytes copied in 0.315 secs (5244 bytes/sec)" },
          ],
        },
        {
          type: "table",
          caption: { en: "Two ways to restore, with different results", hi: "Restore ke do tareeke, alag results ke saath" },
          columns: [{ en: "Command", hi: "Command" }, { en: "What happens", hi: "Kya hota hai" }],
          rows: [
            ["copy tftp: running-config", { en: "The file is **merged** into the running config, as if you typed it. Commands in the file are added or overwritten; lines that are not in the file stay.", hi: "File running config mein **merge** hoti hai, jaise tumne khud type ki ho. File ke commands add ya overwrite hote hain; jo lines file mein nahi hain, woh bani rehti hain." }],
            ["copy tftp: startup-config  +  reload", { en: "The file **replaces** the startup-config, and the device boots with exactly that configuration.", hi: "File startup-config ko **replace** karti hai, aur device bilkul usi configuration se boot hota hai." }],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Automate it later", hi: "Baad mein ise automate karo" },
          text: {
            en: "Copying configs by hand does not scale. In module 6 you will see tools such as Ansible pull backups from hundreds of devices on a schedule, usually over SSH-based transfers instead of TFTP.",
            hi: "Haath se configs copy karna scale nahi hota. Module 6 mein dekhoge ki Ansible jaise tools schedule par sainkdon devices se backups lete hain, aur aam taur par TFTP ki jagah SSH-based transfers use karte hain.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "TFTP", def: { en: "Trivial File Transfer Protocol. UDP 69, no authentication, reads or writes one file in 512-byte acknowledged blocks.", hi: "Trivial File Transfer Protocol. UDP 69, koi authentication nahi, ek file ko 512-byte ke acknowledged blocks mein read ya write karta hai." } },
    { term: "FTP", def: { en: "File Transfer Protocol. Runs over TCP with a username and password and supports directory operations, all in clear text.", hi: "File Transfer Protocol. TCP par username aur password ke saath chalta hai aur directory operations support karta hai, sab clear text mein." } },
    { term: "Control connection", def: { en: "FTP's TCP connection to server port 21 that carries commands and replies for the whole session.", hi: "FTP ka server port 21 wala TCP connection jo poore session ke commands aur replies le jaata hai." } },
    { term: "Data connection", def: { en: "The separate TCP connection FTP opens for each file transfer or directory listing.", hi: "Alag TCP connection jo FTP har file transfer ya directory listing ke liye kholta hai." } },
    { term: "Passive mode", def: { en: "FTP mode where the client sends PASV and opens the data connection to a port the server names.", hi: "FTP mode jisme client PASV bhejta hai aur server ke bataye port par data connection kholta hai." } },
    { term: "Active mode", def: { en: "FTP mode where the server opens the data connection from TCP 20 to a port the client named with PORT.", hi: "FTP mode jisme server TCP 20 se client ke PORT mein bataye port par data connection kholta hai." } },
    { term: "flash:", def: { en: "The non-volatile file system that holds IOS image files.", hi: "Non-volatile file system jisme IOS image files rehti hain." } },
    { term: "boot system", def: { en: "Global command that tells the device which image file to load at the next boot.", hi: "Global command jo device ko batata hai ki agle boot par kaunsi image file load karni hai." } },
  ],
  commands: [
    { cmd: "show flash:", mode: "Privileged EXEC", does: { en: "List files in flash and the free space", hi: "Flash ki files aur free space dikhata hai" } },
    { cmd: "show version", mode: "Privileged EXEC", does: { en: "Show the running IOS release and the image file it booted from", hi: "Chalta IOS release aur jis image file se boot hua woh dikhata hai" } },
    { cmd: "copy tftp: flash:", mode: "Privileged EXEC", does: { en: "Download a file, usually an IOS image, from a TFTP server into flash", hi: "TFTP server se file, aam taur par IOS image, flash mein download karo" } },
    { cmd: "copy running-config tftp:", mode: "Privileged EXEC", does: { en: "Back up the running configuration to a TFTP server", hi: "Running configuration ka backup TFTP server par lo" } },
    { cmd: "copy tftp: startup-config", mode: "Privileged EXEC", does: { en: "Replace the startup-config with a file from the server", hi: "Server ki file se startup-config replace karo" } },
    { cmd: "ip ftp username admin", mode: "Global config", does: { en: "Username IOS uses for FTP transfers", hi: "FTP transfers ke liye IOS ka username" } },
    { cmd: "ip ftp password Ftp-Pa55", mode: "Global config", does: { en: "Password IOS uses for FTP transfers", hi: "FTP transfers ke liye IOS ka password" } },
    { cmd: "copy ftp: flash:", mode: "Privileged EXEC", does: { en: "Download a file from an FTP server into flash", hi: "FTP server se file flash mein download karo" } },
    { cmd: "copy running-config ftp:", mode: "Privileged EXEC", does: { en: "Back up the running configuration to an FTP server", hi: "Running configuration ka backup FTP server par lo" } },
    { cmd: "verify /md5 flash:<image>", mode: "Privileged EXEC", does: { en: "Compute the MD5 hash of a file to check it is not corrupted", hi: "File ka MD5 hash nikalo taaki pata chale woh corrupt nahi hai" } },
    { cmd: "boot system flash:<image>", mode: "Global config", does: { en: "Choose the image to load at the next boot", hi: "Agle boot par load hone wali image chuno" } },
    { cmd: "delete flash:<image>", mode: "Privileged EXEC", does: { en: "Remove an old image to free space", hi: "Space khaali karne ke liye purani image hatao" } },
  ],
  mistakes: [
    {
      en: "Saying TFTP uses TCP or asks for a password. TFTP is UDP 69 with no authentication; FTP is the one with TCP and a login.",
      hi: "Yeh kehna ki TFTP TCP use karta hai ya password maangta hai. TFTP UDP 69 par hai aur koi authentication nahi; TCP aur login FTP mein hote hain.",
    },
    {
      en: "Calling FTP secure because it has a password. The password crosses the network in clear text. Use SFTP, FTPS or SCP when security matters.",
      hi: "FTP ko secure bolna kyunki usme password hai. Password network par clear text mein jaata hai. Security chahiye toh SFTP, FTPS ya SCP use karo.",
    },
    {
      en: "Mixing up SFTP and FTPS. SFTP runs inside SSH on TCP 22; FTPS is ordinary FTP protected by TLS.",
      hi: "SFTP aur FTPS ko mix karna. SFTP SSH ke andar TCP 22 par chalta hai; FTPS normal FTP hai jise TLS protect karta hai.",
    },
    {
      en: "Copying a new image and reloading without `boot system` and a saved config. The router boots the first image in flash, often the old one.",
      hi: "Nayi image copy karke `boot system` aur saved config ke bina reload kar dena. Router flash ki pehli image se boot karta hai, jo aksar purani hoti hai.",
    },
    {
      en: "Restoring with `copy tftp: running-config` and expecting a clean replacement. It merges; to replace, copy to the startup-config and reload.",
      hi: "`copy tftp: running-config` se restore karke clean replacement expect karna. Yeh merge karta hai; replace karna hai toh startup-config mein copy karke reload karo.",
    },
    {
      en: "Deleting the old image before the new one has booted successfully. If the new file is corrupt, the router has nothing to boot and ends up in ROMMON.",
      hi: "Nayi image se successfully boot hone se pehle purani image delete kar dena. Nayi file corrupt nikli toh router ke paas boot karne ko kuch nahi bachta aur woh ROMMON mein pahunch jaata hai.",
    },
  ],
  recap: [
    { en: "IOS images live in flash:, the startup-config in nvram:, the running-config in RAM (system:).", hi: "IOS images flash: mein rehti hain, startup-config nvram: mein, running-config RAM (system:) mein." },
    { en: "TFTP: UDP 69, no login, no directory listing, 512-byte blocks each acknowledged; a short block ends the file.", hi: "TFTP: UDP 69, koi login nahi, directory listing nahi, 512-byte blocks jinka har ek acknowledge hota hai; chhota block file khatam karta hai." },
    { en: "FTP: TCP 21 control connection plus a data connection per transfer (TCP 20 in active mode, server-chosen port in passive mode).", hi: "FTP: TCP 21 control connection aur har transfer ke liye ek data connection (active mode mein TCP 20, passive mode mein server ka chuna port)." },
    { en: "Neither encrypts. Use SFTP (over SSH), FTPS (over TLS) or SCP for secure transfers.", hi: "Dono encrypt nahi karte. Secure transfer ke liye SFTP (SSH par), FTPS (TLS par) ya SCP use karo." },
    { en: "Upgrade: `copy tftp: flash:`, `boot system flash:<image>`, save, `reload`, check `show version`.", hi: "Upgrade: `copy tftp: flash:`, `boot system flash:<image>`, save, `reload`, phir `show version` check karo." },
    { en: "`copy tftp: running-config` merges; `copy tftp: startup-config` plus reload replaces.", hi: "`copy tftp: running-config` merge karta hai; `copy tftp: startup-config` aur reload replace karta hai." },
  ],
  quiz: [
    {
      q: { en: "Which statement about TFTP is correct?", hi: "TFTP ke baare mein kaunsa statement sahi hai?" },
      options: [
        { en: "It uses TCP port 69", hi: "Yeh TCP port 69 use karta hai" },
        { en: "It authenticates users with a username and password", hi: "Yeh username aur password se users ko authenticate karta hai" },
        { en: "It can list the files in a directory on the server", hi: "Yeh server ki directory ki files list kar sakta hai" },
        { en: "It uses UDP port 69 and acknowledges every data block", hi: "Yeh UDP port 69 use karta hai aur har data block acknowledge karta hai" },
      ],
      answer: 3,
      explain: {
        en: "TFTP runs over UDP 69 and adds its own reliability by acknowledging each 512-byte block before the next is sent. It has no authentication and no directory listing; those are FTP features.",
        hi: "TFTP UDP 69 par chalta hai aur har 512-byte block ko agla bhejne se pehle acknowledge karke apni reliability khud deta hai. Isme na authentication hai na directory listing; woh FTP ke features hain.",
      },
      kind: "concept",
    },
    {
      q: { en: "In active-mode FTP, which connection does the server open?", hi: "Active-mode FTP mein server kaunsa connection kholta hai?" },
      options: [
        { en: "A data connection from TCP port 20 to a port the client named with PORT", hi: "TCP port 20 se client ke PORT mein bataye port par data connection" },
        { en: "The control connection, from TCP port 21 to the client", hi: "Control connection, TCP port 21 se client tak" },
        { en: "A data connection from the port it announced in a 227 reply", hi: "227 reply mein bataye port se data connection" },
        { en: "None; the client opens both connections", hi: "Koi nahi; dono connections client kholta hai" },
      ],
      answer: 0,
      explain: {
        en: "The client always opens the control connection to port 21. In active mode the client sends PORT, and the server connects back from TCP 20. The 227 reply and \"client opens both\" describe passive mode.",
        hi: "Port 21 wala control connection hamesha client kholta hai. Active mode mein client PORT bhejta hai, aur server TCP 20 se wapas connect karta hai. 227 reply aur \"dono client kholta hai\" passive mode ki baatein hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An engineer must log in to a file server, see which IOS images it holds, and download one. Which protocol supports all of this?",
        hi: "Engineer ko file server par login karna hai, dekhna hai ki uspar kaunsi IOS images hain, aur ek download karni hai. Kaunsa protocol yeh sab support karta hai?",
      },
      options: [
        { en: "TFTP, because it is the simplest", hi: "TFTP, kyunki yeh sabse simple hai" },
        { en: "TFTP, using a read request for the directory", hi: "TFTP, directory ke liye read request bhej kar" },
        { en: "FTP, using its login and directory commands", hi: "FTP, iske login aur directory commands se" },
        { en: "Either one; both support logins and listings", hi: "Dono mein se koi bhi; dono login aur listing support karte hain" },
      ],
      answer: 2,
      explain: {
        en: "Only FTP has a login (USER and PASS) and directory commands such as LIST. TFTP can only read or write a file whose exact name you already know.",
        hi: "Login (USER aur PASS) aur LIST jaise directory commands sirf FTP mein hain. TFTP sirf aisi file read ya write kar sakta hai jiska exact naam tumhe pehle se pata ho.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "You copied c1900-universalk9-mz.SPA.157-3.M.bin into flash and reloaded R1. `show version` still reports the 15.1(4)M4 image, and `show flash:` lists the old image as file 1 and the new one as file 2. What was missed?",
        hi: "Tumne c1900-universalk9-mz.SPA.157-3.M.bin flash mein copy karke R1 reload kiya. `show version` abhi bhi 15.1(4)M4 image dikhata hai, aur `show flash:` mein purani image file 1 hai aur nayi file 2. Kya chhoot gaya?",
      },
      options: [
        { en: "The new image should have been copied to nvram:", hi: "Nayi image nvram: mein copy honi chahiye thi" },
        { en: "A `boot system flash:` command for the new image, saved to the startup-config", hi: "Nayi image ke liye `boot system flash:` command, startup-config mein saved" },
        { en: "`ip ftp username` and `ip ftp password`", hi: "`ip ftp username` aur `ip ftp password`" },
        { en: "The image must be copied with FTP, not TFTP", hi: "Image FTP se copy honi chahiye thi, TFTP se nahi" },
      ],
      answer: 1,
      explain: {
        en: "Without a saved `boot system` command, the router boots the first image in flash, which is the old one. Images belong in flash, not NVRAM, and the protocol used for the copy makes no difference.",
        hi: "Saved `boot system` command ke bina router flash ki pehli image se boot karta hai, jo purani hai. Images flash mein rehti hain, NVRAM mein nahi, aur copy kis protocol se hui isse koi fark nahi padta.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "You restore yesterday's backup with `copy tftp: running-config`. Afterwards Gi0/1 still has `ip access-group 101 in`, which is not in the backup file. Why?",
        hi: "Tum kal ka backup `copy tftp: running-config` se restore karte ho. Uske baad bhi Gi0/1 par `ip access-group 101 in` hai, jo backup file mein nahi hai. Kyun?",
      },
      options: [
        { en: "The TFTP transfer lost the last block", hi: "TFTP transfer mein aakhri block kho gaya" },
        { en: "ACL commands are never stored in backups", hi: "ACL commands backups mein kabhi store nahi hote" },
        { en: "The router needs a reload before any copied command takes effect", hi: "Copy kiye commands lagne ke liye router ko reload chahiye" },
        { en: "Copying into the running-config merges the file; it does not remove existing lines", hi: "Running-config mein copy karne se file merge hoti hai; purani lines hatti nahi" },
      ],
      answer: 3,
      explain: {
        en: "A copy into the running-config acts like typing the file's commands: it adds and overwrites, but never removes. To get exactly the backup, copy it to the startup-config and reload.",
        hi: "Running-config mein copy aisa hai jaise file ke commands type karna: add aur overwrite hota hai, lekin kuch hatta nahi. Bilkul backup jaisi config chahiye toh use startup-config mein copy karke reload karo.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A TFTP server sends a file that is exactly 1024 bytes long, using 512-byte blocks. How many DATA messages does it send?",
        hi: "TFTP server exactly 1024 bytes ki file 512-byte blocks mein bhejta hai. Woh kitne DATA messages bhejega?",
      },
      options: [
        { en: "2", hi: "2" },
        { en: "4", hi: "4" },
        { en: "3", hi: "3" },
        { en: "1", hi: "1" },
      ],
      answer: 2,
      explain: {
        en: "Two full blocks carry the 1024 bytes, but a full 512-byte block never signals the end. The server sends a third DATA message with 0 bytes so the client knows the file is complete.",
        hi: "Do full blocks mein 1024 bytes chale jaate hain, lekin full 512-byte block kabhi end nahi batata. Isliye server 0 bytes wala teesra DATA message bhejta hai taaki client ko pata chale ki file poori ho gayi.",
      },
      kind: "calc",
    },
  ],
  videos: [
    {
      id: "50hcfsoBf4Q",
      title: "Free CCNA | FTP & TFTP | Day 43",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Covers both protocols, the IOS file system and an IOS upgrade, matching this lesson closely.", hi: "Dono protocols, IOS file system aur IOS upgrade cover karta hai, is lesson se kaafi match karta hai." },
    },
    {
      id: "W9PLvA2wZ28",
      title: "Free CCNA | FTP & TFTP | Day 43 Lab",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Packet Tracer lab: upgrade a router's IOS over TFTP and FTP.", hi: "Packet Tracer lab: TFTP aur FTP se router ka IOS upgrade." },
    },
    {
      id: "xt-9D-XqW6c",
      title: "43. Free CCNA (NEW) | Router & iOS - Backup & Restore by TFTP | CCNA 200-301 Complete Course Hindi",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi lab on backing up and restoring configurations with a TFTP server.", hi: "TFTP server se configuration backup aur restore ka Hindi lab." },
    },
    {
      id: "Sq_udCDUE5I",
      title: "44. Free CCNA (NEW) | Router & iOS - iOS Installation using TFTP Server | CCNA 200-301 Full Course",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Hindi walkthrough of copying a new IOS image over TFTP and booting it.", hi: "TFTP se nayi IOS image copy karke boot karne ka Hindi walkthrough." },
    },
  ],
  lab: {
    title: { en: "Back up a config and upgrade IOS in Packet Tracer", hi: "Packet Tracer mein config backup aur IOS upgrade karo" },
    steps: [
      {
        en: "Connect a 1941 router R1 (Gi0/0 10.1.1.1/24) and a Server-PT (10.1.1.100/24) to a switch. On the server's Services tab, check that TFTP and FTP are on; one server can play both roles in this lab.",
        hi: "1941 router R1 (Gi0/0 10.1.1.1/24) aur ek Server-PT (10.1.1.100/24) ko switch se jodo. Server ke Services tab mein check karo ki TFTP aur FTP on hain; is lab mein ek hi server dono kaam kar sakta hai.",
      },
      {
        en: "On R1 run `show version` and `show flash:`. Note the image name and the free space.",
        hi: "R1 par `show version` aur `show flash:` chalao. Image ka naam aur free space note karo.",
      },
      {
        en: "Run `copy running-config tftp:` and confirm the file appears in the server's TFTP file list.",
        hi: "`copy running-config tftp:` chalao aur confirm karo ki file server ki TFTP file list mein dikh rahi hai.",
      },
      {
        en: "Pick a newer c1900 image from that TFTP list, copy it with `copy tftp: flash:`, set `boot system flash:<image>`, save, reload, and check `show version`.",
        hi: "Usi TFTP list se ek nayi c1900 image chuno, `copy tftp: flash:` se copy karo, `boot system flash:<image>` set karo, save karo, reload karo, aur `show version` check karo.",
      },
      {
        en: "Create an FTP user on the server, set `ip ftp username` and `ip ftp password` on R1 to match, and run `copy running-config ftp:`.",
        hi: "Server par ek FTP user banao, R1 par usi se match karta `ip ftp username` aur `ip ftp password` set karo, aur `copy running-config ftp:` chalao.",
      },
      {
        en: "Repeat both copies in Simulation mode, filtered to TFTP and FTP. Compare the UDP blocks and ACKs with the FTP control and data connections.",
        hi: "Dono copies Simulation mode mein dobara karo, TFTP aur FTP par filter karke. UDP blocks aur ACKs ko FTP ke control aur data connections se compare karo.",
      },
    ],
  },
};

export default lesson;
