import type { TerminalScene } from "../types.ts";

// The scripts from the lesson, run from an automation VM against the lab:
// R1 10.10.10.1, SW1 10.10.10.11, SW2 10.10.10.12, SW3 10.10.10.13 (SW3 has a wrong local user on purpose).

const scene: TerminalScene = {
  kind: "terminal",
  id: "python-netmiko",
  title: { en: "Netmiko scripts: read, parse, loop, change safely", hi: "Netmiko scripts: padho, parse karo, loop chalao, safely change karo" },
  device: "netadmin@automation-vm: ~/netauto (bash)",
  steps: [
    {
      title: { en: "A venv and Netmiko", hi: "Venv aur Netmiko" },
      text: {
        en: "The project gets its own virtual environment in .venv. After activation the prompt starts with (.venv), so pip installs Netmiko and its dependencies (Paramiko for SSH, TextFSM for parsing) into this project only.",
        hi: "Project ka apna virtual environment .venv mein banta hai. Activate karne ke baad prompt (.venv) se shuru hota hai, toh pip Netmiko aur uski dependencies (SSH ke liye Paramiko, parsing ke liye TextFSM) sirf isi project mein install karta hai.",
      },
      lines: [
        { prompt: "~/netauto$", cmd: "python3 -m venv .venv" },
        { prompt: "~/netauto$", cmd: "source .venv/bin/activate" },
        { prompt: "(.venv) ~/netauto$", cmd: "pip install netmiko" },
        { out: "Collecting netmiko\n..." },
        { out: "Successfully installed ... netmiko-4.4.0 ... paramiko-3.4.0 ... textfsm-1.1.3" },
      ],
    },
    {
      title: { en: "Credentials come from outside the code", hi: "Credentials code ke bahar se aate hain" },
      text: {
        en: "The username goes into an environment variable. show_brief.py asks for the password with getpass, so nothing is typed on screen and nothing is saved in the file. ConnectHandler logs in to 10.10.10.1 and find_prompt() prints R1#, proving the session is in privileged EXEC.",
        hi: "Username environment variable mein jaata hai. show_brief.py password getpass se poochta hai, toh screen par kuch nahi dikhta aur file mein kuch save nahi hota. ConnectHandler 10.10.10.1 par login karta hai aur find_prompt() R1# print karta hai, yaani session privileged EXEC mein hai.",
      },
      lines: [
        { prompt: "(.venv) ~/netauto$", cmd: "export NET_USER=netadmin" },
        { prompt: "(.venv) ~/netauto$", cmd: "python3 show_brief.py" },
        { out: "Password:" },
        { out: "R1#" },
      ],
    },
    {
      title: { en: "send_command returns the output", hi: "send_command output return karta hai" },
      text: {
        en: "Netmiko sent terminal length 0 for you, then show ip interface brief, waited for R1# to return and handed back the text in between. It is the same output you would read over SSH by hand, now sitting in a Python string.",
        hi: "Netmiko ne tumhare liye terminal length 0 bheja, phir show ip interface brief, R1# wapas aane ka wait kiya aur beech ka text de diya. Yeh wahi output hai jo tum haath se SSH par padhte, bas ab Python string mein hai.",
      },
      lines: [
        {
          out: "Interface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0     10.10.10.1      YES NVRAM  up                    up\nGigabitEthernet0/1     192.168.12.1    YES NVRAM  up                    up\nGigabitEthernet0/2     unassigned      YES NVRAM  administratively down down\nLoopback0              1.1.1.1         YES NVRAM  up                    up",
        },
      ],
    },
    {
      title: { en: "Parse: read the protocol from the end", hi: "Parse: protocol line ke end se padho" },
      text: {
        en: "show_down.py splits every line into fields and takes the protocol with fields[-1], because administratively down is two words and would shift a fixed position. Only the one interface whose protocol is not up is printed.",
        hi: "show_down.py har line ko fields mein todta hai aur protocol fields[-1] se leta hai, kyunki administratively down do words hai aur fixed position khiska deta. Sirf woh ek interface print hota hai jiska protocol up nahi hai.",
      },
      clear: true,
      lines: [
        { prompt: "(.venv) ~/netauto$", cmd: "python3 show_down.py" },
        { out: "Password:" },
        { out: "GigabitEthernet0/2    unassigned      protocol down" },
      ],
    },
    {
      title: { en: "Loop over the inventory", hi: "Inventory par loop" },
      text: {
        en: "check_ints.py reads the password from NET_PASS, visits four devices in turn and asks for TextFSM parsing. Each row is now a dictionary, so counting interfaces whose proto is not up takes one line of code. R1, SW1 and SW2 report.",
        hi: "check_ints.py password NET_PASS se padhta hai, chaar devices par ek-ek karke jaata hai aur TextFSM parsing maangta hai. Har row ab dictionary hai, toh jinka proto up nahi unhe ginna ek line ka kaam hai. R1, SW1 aur SW2 report karte hain.",
      },
      lines: [
        { prompt: "(.venv) ~/netauto$", cmd: "read -s NET_PASS && export NET_PASS" },
        { prompt: "(.venv) ~/netauto$", cmd: "python3 check_ints.py" },
        { out: "10.10.10.1    R1    4 interfaces, 1 not up\n10.10.10.11   SW1   17 interfaces, 9 not up\n10.10.10.12   SW2   17 interfaces, 11 not up" },
      ],
    },
    {
      title: { en: "A failed login, handled cleanly", hi: "Failed login, saaf tareeke se handle" },
      text: {
        en: "SW3 accepts the SSH connection but rejects the login, so Netmiko raises NetmikoAuthenticationException. The except block prints one clear line and continue moves on; the loop ends normally instead of crashing with a traceback.",
        hi: "SW3 SSH connection accept karta hai lekin login reject kar deta hai, toh Netmiko NetmikoAuthenticationException raise karta hai. except block ek saaf line print karta hai aur continue aage badh jaata hai; loop traceback ke saath crash hone ki jagah normally khatam hota hai.",
      },
      lines: [
        { out: "10.10.10.13   AUTH FAILED  check the local user on this device" },
        { prompt: "(.venv) ~/netauto$", cmd: "" },
      ],
    },
    {
      title: { en: "Dry run before any change", hi: "Change se pehle dry run" },
      text: {
        en: "set_ntp.py is safe by default: without --apply it connects to nothing and only lists what each switch would receive. You check the device list and the exact command before anything touches the network.",
        hi: "set_ntp.py by default safe hai: --apply ke bina woh kisi se connect nahi karta, sirf list karta hai ki har switch ko kya milega. Network ko kuch bhi chhoone se pehle tum device list aur exact command check kar lete ho.",
      },
      clear: true,
      lines: [
        { prompt: "(.venv) ~/netauto$", cmd: "python3 set_ntp.py" },
        { out: "[dry-run] 10.10.10.11 would get: ['ntp server 10.10.10.1']\n[dry-run] 10.10.10.12 would get: ['ntp server 10.10.10.1']\n[dry-run] 10.10.10.13 would get: ['ntp server 10.10.10.1']" },
      ],
    },
    {
      title: { en: "Apply, save and verify", hi: "Apply, save aur verify" },
      text: {
        en: "With --apply, each switch gets send_config_set, then save_config, then a show command to confirm the line is really in the running-config. SW1 and SW2 pass all three. SW3 fails at login again and is reported, not skipped silently.",
        hi: "--apply ke saath har switch par send_config_set, phir save_config, phir ek show command chalta hai jo confirm karta hai ki line sach mein running-config mein hai. SW1 aur SW2 teeno pass karte hain. SW3 phir login par fail hota hai aur report hota hai, chupchaap skip nahi hota.",
      },
      lines: [
        { prompt: "(.venv) ~/netauto$", cmd: "python3 set_ntp.py --apply" },
        { out: "10.10.10.11 changed, saved and verified\n10.10.10.12 changed, saved and verified\n10.10.10.13 FAILED: NetmikoAuthenticationException" },
      ],
    },
    {
      title: { en: "changes.log records every device", hi: "changes.log har device record karta hai" },
      text: {
        en: "The logging module wrote one timestamped line per device: two INFO lines for the switches that changed and an ERROR line for SW3. Tomorrow you fix SW3's local user and run the script for that one host.",
        hi: "logging module ne har device ki ek timestamp wali line likhi: badle hue switches ki do INFO lines aur SW3 ki ek ERROR line. Kal SW3 ka local user theek karke sirf us host ke liye script chala doge.",
      },
      clear: true,
      lines: [
        { prompt: "(.venv) ~/netauto$", cmd: "cat changes.log" },
        { out: "2026-10-02 10:41:07,512 INFO 10.10.10.11 ntp server 10.10.10.1 added and saved\n2026-10-02 10:41:12,288 INFO 10.10.10.12 ntp server 10.10.10.1 added and saved\n2026-10-02 10:41:22,904 ERROR 10.10.10.13 NetmikoAuthenticationException" },
      ],
    },
    {
      title: { en: "The session log shows what was typed", hi: "Session log dikhata hai kya type hua" },
      text: {
        en: "SW1's session log is the raw SSH transcript. send_config_set typed the command in config mode and then end; save_config typed write mem and the switch answered [OK]. Attach this to the change ticket as evidence.",
        hi: "SW1 ka session log raw SSH transcript hai. send_config_set ne config mode mein command type kiya aur phir end; save_config ne write mem type kiya aur switch ne [OK] jawab diya. Ise change ticket mein saboot ke taur par lagao.",
      },
      lines: [
        { prompt: "(.venv) ~/netauto$", cmd: "grep -m1 -A4 \"ntp server 10\" 10.10.10.11-session.log" },
        { out: "SW1(config)#ntp server 10.10.10.1\nSW1(config)#end\nSW1#write mem\nBuilding configuration...\n[OK]" },
      ],
    },
  ],
};

export default scene;
