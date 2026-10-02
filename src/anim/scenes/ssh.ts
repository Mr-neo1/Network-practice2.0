import type { TerminalScene } from "../types.ts";

// SW1 is a Layer 2 switch managed through SVI VLAN 99: 10.1.99.2/24, ip default-gateway 10.1.99.1 (R1).
// The admin PC is 10.1.10.50 in another subnet, so the reply path needs the default gateway.
// Local user admin / Str0ng-Pa55, domain example.com, ACL 10 permits 10.1.10.0/24 on the VTY lines.
// The first steps run on SW1's console; from step 8 the window is the admin PC's command prompt.

const scene: TerminalScene = {
  kind: "terminal",
  id: "ssh",
  title: { en: "Enable SSHv2 on a switch, then log in from a PC", hi: "Switch par SSHv2 enable karo, phir PC se login karo" },
  device: "SW1 console, then Admin PC 10.1.10.50",
  steps: [
    {
      title: { en: "First check the management IP", hi: "Pehle management IP check karo" },
      text: {
        en: "SSH is in-band, so SW1 needs an IP address that the admin PC can reach. The SVI Vlan99 is up/up with 10.1.99.2, and ip default-gateway 10.1.99.1 lets SW1 reply to the admin PC in 10.1.10.0/24.",
        hi: "SSH in-band hai, isliye SW1 ka aisa IP address hona chahiye jis tak admin PC pahunch sake. SVI Vlan99 up/up hai aur IP 10.1.99.2 hai, aur ip default-gateway 10.1.99.1 ki wajah se SW1, 10.1.10.0/24 wale admin PC ko reply bhej sakta hai.",
      },
      lines: [
        { prompt: "SW1#", cmd: "show ip interface brief | include Vlan99" },
        { out: "Vlan99                 10.1.99.2       YES manual up                    up" },
        { prompt: "SW1#", cmd: "show running-config | include default-gateway" },
        { out: "ip default-gateway 10.1.99.1" },
      ],
    },
    {
      title: { en: "The key needs a domain name", hi: "Key ke liye domain name chahiye" },
      text: {
        en: "The RSA key pair is named hostname.domain, so IOS refuses to generate it while the domain name is missing. The hostname is already SW1, not the default Switch. ip domain-name example.com supplies the second half of the name.",
        hi: "RSA key pair ka naam hostname.domain hota hai, isliye domain name na ho toh IOS key generate karne se mana kar deta hai. Hostname pehle se SW1 hai, default Switch nahi. ip domain-name example.com naam ka doosra hissa de deta hai.",
      },
      lines: [
        { prompt: "SW1#", cmd: "configure terminal" },
        { out: "Enter configuration commands, one per line.  End with CNTL/Z." },
        { prompt: "SW1(config)#", cmd: "crypto key generate rsa modulus 2048" },
        { out: "% Please define a domain-name first." },
        { prompt: "SW1(config)#", cmd: "ip domain-name example.com" },
      ],
    },
    {
      title: { en: "Generate the RSA key pair", hi: "RSA key pair generate karo" },
      text: {
        en: "Now the key is created as SW1.example.com with a 2048-bit modulus. The moment a key pair exists, IOS turns the SSH server on and logs it. Version 1.99 means it accepts both SSH version 1 and version 2 clients.",
        hi: "Ab key SW1.example.com naam se 2048-bit modulus ke saath ban jaati hai. Key pair bante hi IOS SSH server on kar deta hai aur log bhi karta hai. Version 1.99 ka matlab hai ki woh SSH version 1 aur version 2 dono clients accept karega.",
      },
      lines: [
        { prompt: "SW1(config)#", cmd: "crypto key generate rsa modulus 2048" },
        { out: "The name for the keys will be: SW1.example.com\n\n% The key modulus size is 2048 bits\n% Generating 2048 bit RSA keys, keys will be non-exportable...\n[OK] (elapsed time was 3 seconds)" },
        { out: "*Mar  1 00:42:17.311: %SSH-5-ENABLED: SSH 1.99 has been enabled" },
      ],
    },
    {
      title: { en: "Version 2 only, plus a local user", hi: "Sirf version 2, aur ek local user" },
      text: {
        en: "ip ssh version 2 stops SW1 from accepting the weaker version 1. SSH logins always carry a username, so SW1 needs an account to check them against: admin, with the password stored as a secret hash.",
        hi: "ip ssh version 2 se SW1 kamzor version 1 accept karna band kar deta hai. SSH login mein hamesha username hota hai, isliye SW1 ke paas check karne ke liye ek account chahiye: admin, jiska password secret ki wajah se hash bana kar store hota hai.",
      },
      lines: [
        { prompt: "SW1(config)#", cmd: "ip ssh version 2" },
        { prompt: "SW1(config)#", cmd: "username admin secret Str0ng-Pa55" },
      ],
    },
    {
      title: { en: "Lock all 16 VTY lines to SSH", hi: "Saari 16 VTY lines ko SSH par lock karo" },
      text: {
        en: "Remote sessions land on VTY lines, and this switch has 16 (0 to 15). login local checks the username database, transport input ssh refuses Telnet on TCP 23, and exec-timeout 10 0 logs out a session idle for 10 minutes.",
        hi: "Remote sessions VTY lines par aate hain, aur is switch mein 16 hain (0 se 15). login local username database check karta hai, transport input ssh TCP 23 par Telnet ko refuse karta hai, aur exec-timeout 10 0 kisi bhi session ko 10 minute idle rehne par logout kar deta hai.",
      },
      lines: [
        { prompt: "SW1(config)#", cmd: "line vty 0 15" },
        { prompt: "SW1(config-line)#", cmd: "login local" },
        { prompt: "SW1(config-line)#", cmd: "transport input ssh" },
        { prompt: "SW1(config-line)#", cmd: "exec-timeout 10 0" },
      ],
    },
    {
      title: { en: "Allow only the admin subnet", hi: "Sirf admin subnet ko allow karo" },
      text: {
        en: "A standard ACL lists who may connect: only sources in 10.1.10.0/24. access-class 10 in applies it to sessions coming in on the VTY lines, so a password guesser in any other subnet is refused before the login prompt.",
        hi: "Ek standard ACL batata hai ki kaun connect kar sakta hai: sirf 10.1.10.0/24 ke sources. access-class 10 in ise VTY lines par aane wale sessions par lagata hai, toh kisi doosre subnet se password guess karne wala login prompt se pehle hi refuse ho jaata hai.",
      },
      lines: [
        { prompt: "SW1(config-line)#", cmd: "exit" },
        { prompt: "SW1(config)#", cmd: "access-list 10 permit 10.1.10.0 0.0.0.255" },
        { prompt: "SW1(config)#", cmd: "line vty 0 15" },
        { prompt: "SW1(config-line)#", cmd: "access-class 10 in" },
        { prompt: "SW1(config-line)#", cmd: "end" },
        { out: "%SYS-5-CONFIG_I: Configured from console by console" },
      ],
    },
    {
      title: { en: "Verify, then save", hi: "Verify karo, phir save karo" },
      text: {
        en: "show ip ssh now reports version 2.0, along with the default 120-second login timeout and 3 password attempts. Copying the running-config to the startup-config makes the whole SSH setup survive a reload.",
        hi: "show ip ssh ab version 2.0 dikhata hai, saath mein default 120-second login timeout aur 3 password attempts. Running-config ko startup-config mein copy karne se poora SSH setup reload ke baad bhi bacha rehta hai.",
      },
      lines: [
        { prompt: "SW1#", cmd: "show ip ssh" },
        { out: "SSH Enabled - version 2.0\nAuthentication timeout: 120 secs; Authentication retries: 3" },
        { prompt: "SW1#", cmd: "copy running-config startup-config" },
        { out: "Destination filename [startup-config]?\nBuilding configuration...\n[OK]" },
      ],
    },
    {
      title: { en: "Log in from the admin PC", hi: "Admin PC se login karo" },
      text: {
        en: "On the admin PC, ssh -l admin 10.1.99.2 opens TCP port 22. This is the first visit, so the client shows SW1's host key fingerprint and asks whether to trust it; after yes it is remembered. The password travels encrypted, and SW1 answers with its user EXEC prompt.",
        hi: "Admin PC par ssh -l admin 10.1.99.2 TCP port 22 kholta hai. Pehli baar connect ho rahe hain, isliye client SW1 ki host key ka fingerprint dikhata hai aur poochta hai ki ispar trust karein ya nahi; yes ke baad yeh yaad rakha jaata hai. Password encrypted jaata hai, aur SW1 apna user EXEC prompt deta hai.",
      },
      clear: true,
      lines: [
        { prompt: "C:\\>", cmd: "ssh -l admin 10.1.99.2" },
        { out: "The authenticity of host '10.1.99.2 (10.1.99.2)' can't be established.\nRSA key fingerprint is SHA256:q7Lm0vT2kXc9JfW3sYb8RzN1hPdE4uGa6iKoQ5tVy0M.\nAre you sure you want to continue connecting (yes/no/[fingerprint])? yes\nWarning: Permanently added '10.1.99.2' (RSA) to the list of known hosts.\nadmin@10.1.99.2's password:" },
        { prompt: "SW1>", cmd: "" },
      ],
    },
    {
      title: { en: "Inside the session: show ssh", hi: "Session ke andar: show ssh" },
      text: {
        en: "enable asks for the enable secret, exactly as on the console. show ssh lists this session: version 2.0, AES encryption in both directions (IN and OUT), and the user admin. No SSH version 1 sessions exist.",
        hi: "enable, console ki tarah hi enable secret maangta hai. show ssh yahi session dikhata hai: version 2.0, dono directions (IN aur OUT) mein AES encryption, aur user admin. SSH version 1 ka koi session nahi hai.",
      },
      lines: [
        { prompt: "SW1>", cmd: "enable" },
        { out: "Password:" },
        { prompt: "SW1#", cmd: "show ssh" },
        { out: "Connection Version Mode Encryption  Hmac         State                 Username\n0          2.0     IN   aes128-ctr  hmac-sha1    Session started       admin\n0          2.0     OUT  aes128-ctr  hmac-sha1    Session started       admin\n%No SSHv1 server connections running." },
      ],
    },
    {
      title: { en: "Telnet is refused", hi: "Telnet refuse ho jaata hai" },
      text: {
        en: "After exit closes the SSH session, the admin tries Telnet to the same address. transport input ssh means SW1 accepts nothing on TCP 23, so the connection fails before any login prompt, and no password ever crosses the network in clear text.",
        hi: "exit se SSH session band hone ke baad admin usi address par Telnet try karta hai. transport input ssh ka matlab hai ki SW1 TCP 23 par kuch accept nahi karta, isliye connection login prompt se pehle hi fail ho jaata hai, aur koi password kabhi clear text mein network par nahi jaata.",
      },
      lines: [
        { prompt: "SW1#", cmd: "exit" },
        { out: "Connection to 10.1.99.2 closed." },
        { prompt: "C:\\>", cmd: "telnet 10.1.99.2" },
        { out: "Connecting To 10.1.99.2...\nCould not open connection to the host, on port 23: Connect failed" },
      ],
    },
  ],
};

export default scene;
