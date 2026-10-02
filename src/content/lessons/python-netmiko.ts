import type { Lesson } from "../types.ts";

// Lab addressing (same management range as the Ansible lesson):
// R1 10.10.10.1, SW1 10.10.10.11, SW2 10.10.10.12, SW3 10.10.10.13, user netadmin.

const lesson: Lesson = {
  slug: "python-netmiko",
  intro: {
    en: "Logging in to 40 switches one by one to run the same `show` command, or to add one VLAN, takes an afternoon and invites typos. A short Python script can do the same work in a minute, the same way every time, and keep a record of what it did. Netmiko is the library most network engineers start with, because it speaks SSH and the Cisco CLI you already know.",
    hi: "40 switches par ek-ek karke login karna, same `show` command chalana ya ek VLAN add karna, poori dopahar kha jaata hai aur typo ka chance bhi rehta hai. Ek chhota Python script yahi kaam ek minute mein, har baar ek hi tareeke se kar deta hai, aur jo kiya uska record bhi rakhta hai. Zyada tar network engineers Netmiko se shuru karte hain, kyunki yeh SSH aur wahi Cisco CLI bolta hai jo tumhe pehle se aata hai.",
  },
  outcomes: [
    { en: "Set up a Python virtual environment and install Netmiko", hi: "Python virtual environment banana aur usme Netmiko install karna" },
    { en: "Connect to a Cisco device with a device dictionary and `ConnectHandler`, and run `show` commands", hi: "Device dictionary aur `ConnectHandler` se Cisco device se connect karna aur `show` commands chalana" },
    { en: "Turn CLI output into data with simple string handling or TextFSM", hi: "Simple string handling ya TextFSM se CLI output ko data mein badalna" },
    { en: "Loop over an inventory and handle failed logins and unreachable devices without the script crashing", hi: "Inventory par loop chalana aur failed login ya unreachable device ko handle karna, bina script crash hue" },
    { en: "Push a small change with `send_config_set`, save it, and run a dry run first", hi: "`send_config_set` se chhota change push karna, save karna, aur pehle dry run chalana" },
    { en: "Keep credentials out of your code and log what the script did", hi: "Credentials ko code se bahar rakhna aur script ne jo kiya uska log rakhna" },
  ],
  sections: [
    {
      id: "why-netmiko",
      heading: { en: "What Netmiko does for you", hi: "Netmiko tumhare liye kya karta hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 6.6 you saw Ansible: you describe the end state and Ansible works out the steps. Python is the other common path. You write the steps yourself, which is more work but gives you full control: custom checks, reports, decisions based on what a device says.",
            hi: "Lesson 6.6 mein tumne Ansible dekha: tum end state describe karte ho aur steps Ansible khud nikalta hai. Python doosra common raasta hai. Yahan steps tum khud likhte ho, thoda zyada kaam hai lekin poora control milta hai: apne checks, reports, aur device ke output ke hisaab se decisions.",
          },
        },
        {
          type: "p",
          text: {
            en: "Python can open an SSH session with a low-level library such as Paramiko, but then you must wait for prompts, turn off paging, enter enable mode and strip the echoed command yourself. **Netmiko** is built on Paramiko and does all of that per platform. You pick a `device_type` such as `cisco_ios`, and Netmiko knows the prompts, sends `terminal length 0`, and returns clean output as a Python string.",
            hi: "Python, Paramiko jaisi low-level library se SSH session khol sakta hai, lekin tab prompts ka wait karna, paging band karna, enable mode mein jaana aur echo hua command hatana sab tumhe khud karna padta hai. **Netmiko** Paramiko ke upar bana hai aur yeh sab har platform ke liye khud karta hai. Tum `cisco_ios` jaisa `device_type` chunte ho, aur Netmiko ko prompts pata hote hain, woh `terminal length 0` bhejta hai, aur saaf output Python string ke roop mein deta hai.",
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Netmiko is still the CLI", hi: "Netmiko bhi CLI hi hai" },
          text: {
            en: "Netmiko screen-scrapes the same CLI a human uses over SSH. It is not a REST API like RESTCONF (lesson 6.4). That makes it work on almost any device that has SSH, including old ones, but the output is text meant for humans, so you have to parse it.",
            hi: "Netmiko wahi CLI screen-scrape karta hai jo insaan SSH par use karta hai. Yeh RESTCONF jaisa REST API nahi hai (lesson 6.4). Isliye yeh lagbhag har us device par chalta hai jisme SSH hai, purane devices par bhi, lekin output insaano ke liye bana text hota hai, toh use parse karna padta hai.",
          },
        },
      ],
    },
    {
      id: "setup",
      heading: { en: "Set up: a virtual environment and a reachable device", hi: "Setup: virtual environment aur ek reachable device" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A **virtual environment** is a private folder of Python packages for one project. It stops one project's library versions from breaking another's, and you can delete it and rebuild it any time. Create it once per project, activate it each time you open a new terminal, then install Netmiko into it.",
            hi: "**Virtual environment** ek project ke liye Python packages ka private folder hai. Isse ek project ke library versions doosre project ko nahi todte, aur ise kabhi bhi delete karke dobara bana sakte ho. Har project ke liye ek baar banao, har naye terminal mein activate karo, phir usme Netmiko install karo.",
          },
        },
        {
          type: "cli",
          title: { en: "Linux or macOS (on Windows use `python` and `.venv\\Scripts\\activate`)", hi: "Linux ya macOS (Windows par `python` aur `.venv\\Scripts\\activate` use karo)" },
          lines: [
            { prompt: "$", cmd: "mkdir netauto && cd netauto" },
            { prompt: "$", cmd: "python3 -m venv .venv", comment: { en: "Creates the environment in the .venv folder", hi: ".venv folder mein environment banata hai" } },
            { prompt: "$", cmd: "source .venv/bin/activate", comment: { en: "The prompt now starts with (.venv)", hi: "Ab prompt (.venv) se shuru hota hai" } },
            { prompt: "(.venv) $", cmd: "pip install netmiko", comment: { en: "Also pulls in Paramiko, TextFSM and ntc-templates", hi: "Saath mein Paramiko, TextFSM aur ntc-templates bhi aate hain" } },
          ],
        },
        {
          type: "p",
          text: {
            en: "The device side is exactly what you built in the SSH lesson: a hostname, a domain name, RSA keys, a local user and VTY lines that accept SSH. Giving the user privilege 15 means the script lands straight in privileged EXEC (`#`), so it does not need an enable password.",
            hi: "Device side par wahi chahiye jo tumne SSH lesson mein banaya tha: hostname, domain name, RSA keys, local user aur VTY lines jo SSH accept karein. User ko privilege 15 doge toh script seedha privileged EXEC (`#`) mein pahunchega, enable password ki zaroorat nahi padegi.",
          },
        },
        {
          type: "cli",
          title: { en: "Minimum SSH config on each device", hi: "Har device par minimum SSH config" },
          lines: [
            { prompt: "SW1(config)#", cmd: "ip domain-name lab.local" },
            { prompt: "SW1(config)#", cmd: "crypto key generate rsa modulus 2048" },
            { prompt: "SW1(config)#", cmd: "ip ssh version 2" },
            { prompt: "SW1(config)#", cmd: "username netadmin privilege 15 secret Lab-Pass-2026" },
            { prompt: "SW1(config)#", cmd: "line vty 0 15" },
            { prompt: "SW1(config-line)#", cmd: "transport input ssh" },
            { prompt: "SW1(config-line)#", cmd: "login local" },
          ],
          note: {
            en: "Packet Tracer devices cannot be reached by real Python. Use Cisco Modeling Labs (CML-Free), GNS3 or EVE-NG with IOSv images, a Cisco DevNet Sandbox device, or real lab gear.",
            hi: "Packet Tracer ke devices tak asli Python nahi pahunch sakta. Cisco Modeling Labs (CML-Free), IOSv images ke saath GNS3 ya EVE-NG, Cisco DevNet Sandbox ka device, ya real lab gear use karo.",
          },
        },
      ],
    },
    {
      id: "first-script",
      heading: { en: "Your first script: connect and run a show command", hi: "Pehla script: connect karo aur show command chalao" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Netmiko needs to know four things about a device, and you give them as a Python **dictionary**. `ConnectHandler(**device)` opens the SSH session, logs in and prepares the terminal. `send_command()` sends one command, waits for the prompt to come back, and returns everything in between as a string.",
            hi: "Netmiko ko device ke baare mein chaar cheezein chahiye, aur tum unhe Python **dictionary** ke roop mein dete ho. `ConnectHandler(**device)` SSH session kholta hai, login karta hai aur terminal ready karta hai. `send_command()` ek command bhejta hai, prompt wapas aane ka wait karta hai, aur beech ka sab kuch string ke roop mein return karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The device dictionary", hi: "Device dictionary" },
          columns: [{ en: "Key", hi: "Key" }, { en: "Example", hi: "Example" }, { en: "Why it is needed", hi: "Kyun chahiye" }],
          rows: [
            ["device_type", "cisco_ios", { en: "Picks the driver: prompts, paging and config-mode commands", hi: "Driver chunta hai: prompts, paging aur config-mode commands" }],
            ["host", "10.10.10.1", { en: "IP address or DNS name to SSH to", hi: "Kis IP address ya DNS naam par SSH karna hai" }],
            ["username / password", "netadmin / (from getpass)", { en: "The local user from `login local`", hi: "`login local` wala local user" }],
            ["secret (optional)", "(enable secret)", { en: "Only if the user lands in `>` and the script calls `enable()`", hi: "Sirf tab jab user `>` par aaye aur script `enable()` call kare" }],
            ["port (optional)", "22", { en: "Default is 22; change it only if SSH listens elsewhere", hi: "Default 22 hai; sirf tab badlo jab SSH kisi aur port par ho" }],
          ],
        },
        {
          type: "code",
          lang: "python",
          title: { en: "show_brief.py", hi: "show_brief.py" },
          code: `import os
from getpass import getpass

from netmiko import ConnectHandler

r1 = {
    "device_type": "cisco_ios",
    "host": "10.10.10.1",
    "username": os.environ.get("NET_USER", "netadmin"),
    "password": getpass("Password: "),   # typed at run time, never stored
}

# "with" disconnects automatically, even if a command fails
with ConnectHandler(**r1) as conn:
    print(conn.find_prompt())                         # R1#
    output = conn.send_command("show ip interface brief")

print(output)`,
        },
        {
          type: "p",
          text: {
            en: "The `with` block calls `disconnect()` for you when it ends. Without it, write `conn = ConnectHandler(**r1)` and finish with `conn.disconnect()`. Forget that inside a loop and every device you visit keeps a VTY line busy until the script ends or the session times out, and a switch has only 16 of them.",
            hi: "`with` block khatam hote hi tumhare liye `disconnect()` call kar deta hai. Iske bina `conn = ConnectHandler(**r1)` likho aur aakhir mein `conn.disconnect()`. Loop ke andar yeh bhool gaye toh har device ki ek VTY line tab tak busy rehti hai jab tak script khatam na ho ya session time out na ho, aur switch par aisi sirf 16 lines hoti hain.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Never put the password in the .py file", hi: "Password kabhi .py file mein mat daalo" },
          text: {
            en: "Scripts get copied, emailed and pushed to Git. Read the password at run time with `getpass()` (it does not echo), or from an environment variable such as `NET_PASS` that you set in the terminal or that your scheduler provides. Store the username the same way if it is sensitive.",
            hi: "Scripts copy hote hain, email hote hain, Git par push hote hain. Password run time par `getpass()` se lo (yeh screen par echo nahi karta), ya `NET_PASS` jaise environment variable se jo tum terminal mein set karo ya scheduler de. Username sensitive ho toh use bhi aise hi rakho.",
          },
        },
      ],
    },
    {
      id: "parsing",
      heading: { en: "Parsing: from text to data", hi: "Parsing: text se data tak" },
      blocks: [
        {
          type: "p",
          text: {
            en: "`send_command()` gives you the same text you would see on screen. To act on it, you need fields. The quick way is to split each line on spaces. Watch the trap: `administratively down` is two words, so the column positions shift on exactly the lines you care about. Take the protocol from the **end** of the line with `fields[-1]`.",
            hi: "`send_command()` wahi text deta hai jo screen par dikhta. Us par action lene ke liye fields chahiye. Jaldi wala tareeka hai har line ko spaces par split karna. Trap dhyan do: `administratively down` do words hai, toh column positions theek unhi lines par khisak jaati hain jo tumhe chahiye. Protocol line ke **end** se lo, `fields[-1]` se.",
          },
        },
        {
          type: "code",
          lang: "python",
          title: { en: "show_down.py: simple string handling (after the code above)", hi: "show_down.py: simple string handling (upar wale code ke baad)" },
          code: `for line in output.splitlines()[1:]:          # skip the header row
    fields = line.split()
    name, ip, protocol = fields[0], fields[1], fields[-1]
    if protocol != "up":
        print(f"{name:<22}{ip:<16}protocol {protocol}")

# GigabitEthernet0/2    unassigned      protocol down`,
        },
        {
          type: "p",
          text: {
            en: "The robust way is **TextFSM** with the community **ntc-templates**, which Netmiko installs. Add `use_textfsm=True` and, if a template exists for that platform and command, you get a list of dictionaries, one per row. If no template matches, Netmiko quietly returns the plain string, so check the type before you loop.",
            hi: "Pakka tareeka hai **TextFSM**, community ke **ntc-templates** ke saath, jo Netmiko install kar deta hai. `use_textfsm=True` lagao aur agar us platform aur command ka template hai, toh tumhe dictionaries ki list milti hai, har row ki ek. Template match nahi hua toh Netmiko chupchaap plain string de deta hai, isliye loop se pehle type check karo.",
          },
        },
        {
          type: "code",
          lang: "python",
          title: { en: "TextFSM: structured output", hi: "TextFSM: structured output" },
          code: `rows = conn.send_command("show ip interface brief", use_textfsm=True)
if not isinstance(rows, list):
    raise SystemExit("No TextFSM template matched; got plain text back")

print(rows[0])
# {'interface': 'GigabitEthernet0/0', 'ip_address': '10.10.10.1',
#  'status': 'up', 'proto': 'up'}

down = [r["interface"] for r in rows if r["proto"] != "up"]`,
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Print one row first", hi: "Pehle ek row print karo" },
          text: {
            en: "The key names come from the template, not from Cisco, and they have changed between ntc-templates versions (older ones used `intf` and `ipaddr`). Print `rows[0]` once before you write code that depends on the keys.",
            hi: "Key names template se aate hain, Cisco se nahi, aur ntc-templates ke versions ke beech badle bhi hain (purane versions `intf` aur `ipaddr` use karte the). Keys par depend karne wala code likhne se pehle ek baar `rows[0]` print kar lo.",
          },
        },
      ],
    },
    {
      id: "inventory-and-errors",
      heading: { en: "Loop over an inventory and survive failures", hi: "Inventory par loop aur failures ko jhelna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Real runs hit real problems: one switch has a different password, another is powered off. Without error handling, the first failure raises an exception and the script stops, so every device after it is skipped. Catch the two Netmiko exceptions you will meet most, record the problem, and `continue` to the next device.",
            hi: "Real runs mein real problems aati hain: ek switch ka password alag hai, doosra band pada hai. Error handling ke bina pehli failure exception raise karti hai aur script ruk jaata hai, toh uske baad ke saare devices skip ho jaate hain. Netmiko ke do sabse common exceptions catch karo, problem record karo, aur `continue` se agle device par jao.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Exception", hi: "Exception" }, { en: "What happened", hi: "Kya hua" }, { en: "Usual cause", hi: "Aam wajah" }],
          rows: [
            ["NetmikoAuthenticationException", { en: "SSH connected, but the login was rejected", hi: "SSH connect hua, lekin login reject ho gaya" }, { en: "Wrong password, user missing, no `login local`", hi: "Galat password, user nahi hai, `login local` nahi hai" }],
            ["NetmikoTimeoutException", { en: "No SSH answer within the connection timeout", hi: "Connection timeout ke andar SSH ka jawab nahi aaya" }, { en: "Device down, no route, ACL on the VTY lines, SSH not enabled", hi: "Device down, route nahi, VTY lines par ACL, SSH enable nahi" }],
          ],
        },
        {
          type: "code",
          lang: "python",
          title: { en: "check_ints.py", hi: "check_ints.py" },
          code: `import os
from getpass import getpass

from netmiko import ConnectHandler
from netmiko.exceptions import (
    NetmikoAuthenticationException,
    NetmikoTimeoutException,
)

USER = os.environ["NET_USER"]
PASSWORD = os.environ.get("NET_PASS") or getpass("Password: ")
INVENTORY = ["10.10.10.1", "10.10.10.11", "10.10.10.12", "10.10.10.13"]

for host in INVENTORY:
    device = {"device_type": "cisco_ios", "host": host,
              "username": USER, "password": PASSWORD}
    try:
        with ConnectHandler(**device) as conn:
            name = conn.find_prompt().rstrip("#>")
            rows = conn.send_command("show ip interface brief", use_textfsm=True)
    except NetmikoAuthenticationException:
        print(f"{host:<13} AUTH FAILED  check the local user on this device")
        continue
    except NetmikoTimeoutException:
        print(f"{host:<13} UNREACHABLE  no SSH answer on port 22")
        continue

    if not isinstance(rows, list):        # no TextFSM template: plain text came back
        print(f"{host:<13} {name:<5} could not parse the output")
        continue
    down = [r for r in rows if r["proto"] != "up"]
    print(f"{host:<13} {name:<5} {len(rows)} interfaces, {len(down)} not up")`,
        },
        {
          type: "p",
          text: {
            en: "Notice the order: the exception handlers sit around the connection, and the reporting happens after it. A failure on SW3 prints one clear line and the loop moves on. At the end you have a full report plus a short list of devices to fix by hand.",
            hi: "Order dekho: exception handlers connection ke around hain, aur reporting uske baad hoti hai. SW3 par failure ek saaf line print karta hai aur loop aage badh jaata hai. Aakhir mein poori report milti hai, saath mein haath se fix karne wale devices ki chhoti list.",
          },
        },
      ],
    },
    {
      id: "safe-changes",
      heading: { en: "Making a change safely: dry run, apply, save, verify, log", hi: "Change safely karna: dry run, apply, save, verify, log" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Reading is harmless; writing is where scripts cause outages. `send_config_set()` takes a list of commands, enters `configure terminal`, sends them in order, and exits config mode. `save_config()` runs `write memory` on IOS. Netmiko has no built-in check mode like Ansible's `--check`, so build one: make the script print what it **would** send unless you pass `--apply`.",
            hi: "Padhna safe hai; likhte waqt hi scripts outage karwaate hain. `send_config_set()` commands ki list leta hai, `configure terminal` mein jaata hai, unhe order mein bhejta hai, aur config mode se bahar aata hai. `save_config()` IOS par `write memory` chalata hai. Netmiko mein Ansible ke `--check` jaisa built-in check mode nahi hai, toh khud banao: jab tak `--apply` na do, script sirf print kare ki woh kya **bhejega**.",
          },
        },
        {
          type: "code",
          lang: "python",
          title: { en: "set_ntp.py", hi: "set_ntp.py" },
          code: `import logging
import os
import sys

from netmiko import ConnectHandler
from netmiko.exceptions import (
    NetmikoAuthenticationException,
    NetmikoTimeoutException,
)

logging.basicConfig(filename="changes.log", level=logging.INFO,
                    format="%(asctime)s %(levelname)s %(message)s")

APPLY = "--apply" in sys.argv          # dry run unless asked
SWITCHES = ["10.10.10.11", "10.10.10.12", "10.10.10.13"]
COMMANDS = ["ntp server 10.10.10.1"]

for host in SWITCHES:
    if not APPLY:
        print(f"[dry-run] {host} would get: {COMMANDS}")
        continue
    device = {"device_type": "cisco_ios", "host": host,
              "username": os.environ["NET_USER"],
              "password": os.environ["NET_PASS"],
              "session_log": f"{host}-session.log"}
    try:
        with ConnectHandler(**device) as conn:
            conn.send_config_set(COMMANDS)     # conf t, commands, end
            conn.save_config()                 # write mem
            check = conn.send_command("show running-config | include ntp server")
    except (NetmikoAuthenticationException, NetmikoTimeoutException) as err:
        logging.error("%s %s", host, type(err).__name__)
        print(f"{host} FAILED: {type(err).__name__}")
        continue

    if "ntp server 10.10.10.1" in check:
        logging.info("%s ntp server 10.10.10.1 added and saved", host)
        print(f"{host} changed, saved and verified")
    else:
        logging.warning("%s ntp server line missing after change", host)
        print(f"{host} CHECK FAILED: line missing after change")`,
        },
        {
          type: "steps",
          items: [
            { en: "Run `python3 set_ntp.py` first. Read the dry-run list: right devices, right commands, nothing extra.", hi: "Pehle `python3 set_ntp.py` chalao. Dry-run list padho: sahi devices, sahi commands, kuch extra nahi." },
            { en: "Try `--apply` on one lab or low-risk device (shorten `SWITCHES`), then on the rest.", hi: "`--apply` pehle ek lab ya low-risk device par try karo (`SWITCHES` chhota kar do), phir baaki par." },
            { en: "The script saves only after the commands are accepted, then **verifies** with a `show` command instead of trusting that no error appeared.", hi: "Script commands accept hone ke baad hi save karta hai, phir sirf error na aane par bharosa karne ki jagah `show` command se **verify** karta hai." },
            { en: "`changes.log` records what changed on which device and when; `session_log` keeps the full SSH transcript per device. Treat both as sensitive and keep them out of Git.", hi: "`changes.log` record karta hai kis device par kya aur kab badla; `session_log` har device ka poora SSH transcript rakhta hai. Dono ko sensitive samjho aur Git se bahar rakho." },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "CCNA link", hi: "CCNA se connection" },
          text: {
            en: "The CCNA does not ask you to write Python. It does expect you to explain how automation changes network management compared with configuring devices one by one (6.1), and to read structured data such as JSON (6.7). The list of dictionaries TextFSM returns is exactly that kind of data.",
            hi: "CCNA tumse Python likhwata nahi hai. Lekin expect karta hai ki tum samjha sako ki ek-ek device configure karne ke mukable automation network management ko kaise badalta hai (6.1), aur JSON jaisa structured data padh sako (6.7). TextFSM jo dictionaries ki list deta hai, woh bilkul aisa hi data hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Virtual environment", def: { en: "A per-project folder of Python packages, created with `python3 -m venv`, that keeps library versions separate.", hi: "Har project ka alag Python packages folder, `python3 -m venv` se banta hai, taaki library versions alag rahein." } },
    { term: "Netmiko", def: { en: "A Python library, built on Paramiko, that handles SSH logins, prompts and paging for many network platforms.", hi: "Paramiko par bani Python library jo kai network platforms ke liye SSH login, prompts aur paging handle karti hai." } },
    { term: "device_type", def: { en: "The Netmiko key that selects the platform driver, for example `cisco_ios` or `cisco_nxos`.", hi: "Netmiko ki woh key jo platform driver chunti hai, jaise `cisco_ios` ya `cisco_nxos`." } },
    { term: "ConnectHandler", def: { en: "The Netmiko function that takes a device dictionary and returns a logged-in connection object.", hi: "Netmiko ka function jo device dictionary leta hai aur logged-in connection object return karta hai." } },
    { term: "TextFSM / ntc-templates", def: { en: "A template-based parser and a community set of templates that turn CLI text into a list of dictionaries.", hi: "Template-based parser aur community templates ka set jo CLI text ko dictionaries ki list mein badalte hain." } },
    { term: "Dry run", def: { en: "A run that shows what would change without sending anything to the devices.", hi: "Aisa run jo dikhata hai kya badlega, bina devices ko kuch bheje." } },
    { term: "Exception", def: { en: "Python's way of signalling an error; if it is not caught with try/except, the script stops.", hi: "Python ka error batane ka tareeka; try/except se catch nahi kiya toh script ruk jaata hai." } },
  ],
  commands: [
    { cmd: "python3 -m venv .venv", mode: "Linux / macOS terminal", does: { en: "Create a virtual environment in the .venv folder", hi: ".venv folder mein virtual environment banata hai" } },
    { cmd: "source .venv/bin/activate", mode: "Linux / macOS terminal", does: { en: "Activate the environment (Windows: `.venv\\Scripts\\activate`)", hi: "Environment activate karta hai (Windows: `.venv\\Scripts\\activate`)" } },
    { cmd: "pip install netmiko", mode: "Terminal, inside the venv", does: { en: "Install Netmiko and its dependencies", hi: "Netmiko aur uski dependencies install karta hai" } },
    { cmd: "export NET_USER=netadmin", mode: "Linux / macOS terminal", does: { en: "Set an environment variable the script reads with `os.environ`", hi: "Environment variable set karta hai jo script `os.environ` se padhta hai" } },
    { cmd: "show ip interface brief", mode: "Cisco privileged EXEC", does: { en: "One line per interface with IP, status and protocol; the command the scripts read", hi: "Har interface ki ek line, IP, status aur protocol ke saath; scripts yahi padhte hain" } },
    { cmd: "show running-config | include ntp server", mode: "Cisco privileged EXEC", does: { en: "Show only the NTP server lines, used to verify the change", hi: "Sirf NTP server wali lines dikhata hai, change verify karne ke liye" } },
    { cmd: "write memory", mode: "Cisco privileged EXEC", does: { en: "Save the running-config; what `save_config()` sends on IOS", hi: "Running-config save karta hai; IOS par `save_config()` yahi bhejta hai" } },
  ],
  mistakes: [
    {
      en: "Hard-coding the password in the script. Read it with `getpass()` or from an environment variable, and never commit it to Git.",
      hi: "Password script mein hard-code karna. Use `getpass()` se ya environment variable se padho, aur Git mein kabhi commit mat karo.",
    },
    {
      en: "Using `send_command()` for configuration. It does not enter config mode; use `send_config_set()` with a list of commands.",
      hi: "Configuration ke liye `send_command()` use karna. Yeh config mode mein nahi jaata; commands ki list ke saath `send_config_set()` use karo.",
    },
    {
      en: "Forgetting `save_config()`. The change works until the next reload, then disappears.",
      hi: "`save_config()` bhool jaana. Change agle reload tak chalta hai, phir gayab ho jaata hai.",
    },
    {
      en: "No try/except around the connection, so one dead switch stops the whole run and the remaining devices are never touched.",
      hi: "Connection ke around try/except nahi, toh ek dead switch poora run rok deta hai aur baaki devices tak script pahunchta hi nahi.",
    },
    {
      en: "Splitting `show` output on spaces and trusting fixed positions. Multi-word values like `administratively down` shift the columns; use `fields[-1]` or TextFSM.",
      hi: "`show` output ko spaces par split karke fixed positions par bharosa karna. `administratively down` jaise multi-word values columns khiska dete hain; `fields[-1]` ya TextFSM use karo.",
    },
    {
      en: "Running a change against every device on the first try. Dry run, then one device, then the rest.",
      hi: "Pehli hi baar mein change har device par chala dena. Pehle dry run, phir ek device, phir baaki.",
    },
  ],
  recap: [
    { en: "Create a venv, activate it, `pip install netmiko`. The devices need working SSH and a local user.", hi: "Venv banao, activate karo, `pip install netmiko`. Devices par SSH aur local user chalna chahiye." },
    { en: "Device dictionary + `ConnectHandler(**device)`; `send_command()` for show, `send_config_set()` for config, `save_config()` to save.", hi: "Device dictionary + `ConnectHandler(**device)`; show ke liye `send_command()`, config ke liye `send_config_set()`, save ke liye `save_config()`." },
    { en: "`use_textfsm=True` returns a list of dictionaries when a template matches; otherwise you get the plain string.", hi: "Template match ho toh `use_textfsm=True` dictionaries ki list deta hai; warna plain string milti hai." },
    { en: "Catch `NetmikoAuthenticationException` and `NetmikoTimeoutException` so one bad device does not stop the loop.", hi: "`NetmikoAuthenticationException` aur `NetmikoTimeoutException` catch karo taaki ek kharab device loop na roke." },
    { en: "Passwords from `getpass()` or environment variables; dry run before `--apply`; verify with show; log every change.", hi: "Password `getpass()` ya environment variables se; `--apply` se pehle dry run; show se verify; har change log karo." },
  ],
  quiz: [
    {
      q: { en: "What does `\"device_type\": \"cisco_ios\"` in the device dictionary tell Netmiko?", hi: "Device dictionary mein `\"device_type\": \"cisco_ios\"` Netmiko ko kya batata hai?" },
      options: [
        { en: "Which driver to use, so it knows the prompts, paging command and how to enter config mode", hi: "Kaunsa driver use karna hai, taaki use prompts, paging command aur config mode mein jaane ka tareeka pata ho" },
        { en: "Which IOS image to upgrade the device to", hi: "Device ko kaunsi IOS image par upgrade karna hai" },
        { en: "That the device must be reached with Telnet instead of SSH", hi: "Ki device tak SSH ki jagah Telnet se pahunchna hai" },
        { en: "Which TextFSM template to use for every command", hi: "Har command ke liye kaunsa TextFSM template use karna hai" },
      ],
      answer: 0,
      explain: {
        en: "`device_type` selects the platform driver. For `cisco_ios` that means SSH (Telnet would be `cisco_ios_telnet`), `terminal length 0`, `#` and `(config)#` prompts, and `write memory` for saving. TextFSM templates are chosen per command, using the platform as part of the lookup, only when you ask for parsing.",
        hi: "`device_type` platform driver chunta hai. `cisco_ios` ka matlab SSH (Telnet ke liye `cisco_ios_telnet` hota), `terminal length 0`, `#` aur `(config)#` prompts, aur save ke liye `write memory`. TextFSM template har command ke liye chuna jaata hai, platform ko lookup mein use karke, aur sirf tab jab tum parsing maango.",
      },
      kind: "concept",
    },
    {
      q: { en: "You want a script to create VLAN 30 named VOICE on a switch. Which Netmiko call fits?", hi: "Tumhe script se switch par VLAN 30 banana hai jiska naam VOICE ho. Kaunsa Netmiko call sahi hai?" },
      options: [
        { en: "`conn.send_command(\"vlan 30\")`", hi: "`conn.send_command(\"vlan 30\")`" },
        { en: "`conn.save_config(\"vlan 30\")`", hi: "`conn.save_config(\"vlan 30\")`" },
        { en: "`conn.send_config_set([\"vlan 30\", \"name VOICE\"])`", hi: "`conn.send_config_set([\"vlan 30\", \"name VOICE\"])`" },
        { en: "`conn.find_prompt([\"vlan 30\", \"name VOICE\"])`", hi: "`conn.find_prompt([\"vlan 30\", \"name VOICE\"])`" },
      ],
      answer: 2,
      explain: {
        en: "`send_config_set()` enters global config mode, sends each command in the list in order (so `name VOICE` lands in the VLAN sub-mode), then exits. `send_command()` runs in EXEC mode, where `vlan 30` is not a valid command.",
        hi: "`send_config_set()` global config mode mein jaata hai, list ka har command order mein bhejta hai (isliye `name VOICE` VLAN sub-mode mein pahunchta hai), phir bahar aata hai. `send_command()` EXEC mode mein chalta hai, jahan `vlan 30` valid command hi nahi hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "A script loops over 50 switches with no try/except. Switch 7 has a different password. What happens?",
        hi: "Ek script bina try/except ke 50 switches par loop karta hai. Switch 7 ka password alag hai. Kya hoga?",
      },
      options: [
        { en: "Netmiko skips switch 7 automatically and continues", hi: "Netmiko switch 7 ko apne aap skip karke aage badhta hai" },
        { en: "Netmiko retries with the enable secret instead", hi: "Netmiko enable secret se dobara try karta hai" },
        { en: "Switches 1-50 are all rolled back", hi: "Switches 1-50 sab roll back ho jaate hain" },
        { en: "A `NetmikoAuthenticationException` stops the script; switches 8-50 are never processed", hi: "`NetmikoAuthenticationException` script rok deta hai; switches 8-50 tak script pahunchta hi nahi" },
      ],
      answer: 3,
      explain: {
        en: "An uncaught exception ends the program. Switches 1-6 were already handled and stay as they are; nothing is rolled back. Wrapping the connection in try/except and using `continue` lets the run finish and report switch 7 as failed.",
        hi: "Uncaught exception program khatam kar deta hai. Switches 1-6 pehle hi ho chuke hain aur waise hi rehte hain; kuch roll back nahi hota. Connection ko try/except mein lapet kar `continue` use karo, toh run poora hota hai aur switch 7 failed report hota hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "`line.split()` is run on `GigabitEthernet0/2  unassigned  YES NVRAM  administratively down down`. What is `fields[4]`?",
        hi: "`GigabitEthernet0/2  unassigned  YES NVRAM  administratively down down` par `line.split()` chalaya. `fields[4]` kya hoga?",
      },
      options: [
        { en: "`down`", hi: "`down`" },
        { en: "`administratively`", hi: "`administratively`" },
        { en: "`administratively down`", hi: "`administratively down`" },
        { en: "`NVRAM`", hi: "`NVRAM`" },
      ],
      answer: 1,
      explain: {
        en: "Counting from 0: `GigabitEthernet0/2`, `unassigned`, `YES`, `NVRAM`, `administratively`, `down`, `down`. Index 4 is half of the status. That is why the protocol should be read with `fields[-1]`, or the line parsed with TextFSM.",
        hi: "0 se gino: `GigabitEthernet0/2`, `unassigned`, `YES`, `NVRAM`, `administratively`, `down`, `down`. Index 4 status ka aadha hissa hai. Isiliye protocol `fields[-1]` se padhna chahiye, ya line TextFSM se parse karni chahiye.",
      },
      kind: "calc",
    },
    {
      q: { en: "Where should a Netmiko script get the device password from?", hi: "Netmiko script ko device password kahan se lena chahiye?" },
      options: [
        { en: "A `getpass()` prompt or an environment variable set outside the script", hi: "`getpass()` prompt se ya script ke bahar set kiye environment variable se" },
        { en: "A string at the top of the .py file, so the team can see it", hi: "`.py` file ke upar ek string mein, taaki team dekh sake" },
        { en: "The `session_log` file from the previous run", hi: "Pichle run ki `session_log` file se" },
        { en: "The device's running-config, read with `show run`", hi: "Device ki running-config se, `show run` padh kar" },
      ],
      answer: 0,
      explain: {
        en: "Code is shared and versioned, so a password in it leaks. `getpass()` asks at run time without echoing; an environment variable lets a scheduler supply it. With `username ... secret`, the running-config holds only a hash, and you would need to log in to read it anyway.",
        hi: "Code share aur version hota hai, toh usme rakha password leak hota hai. `getpass()` run time par bina echo kiye poochta hai; environment variable se scheduler password de sakta hai. `username ... secret` ke saath running-config mein sirf hash hota hai, aur use padhne ke liye bhi pehle login karna padta.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "`send_command(\"show ip interface brief\", use_textfsm=True)` returns a list. What is each item in it?",
        hi: "`send_command(\"show ip interface brief\", use_textfsm=True)` ek list return karta hai. Uska har item kya hai?",
      },
      options: [
        { en: "One line of raw text from the output", hi: "Output ki raw text ki ek line" },
        { en: "One SSH session per interface", hi: "Har interface ka ek SSH session" },
        { en: "A dictionary for one interface row, with keys such as the interface name, IP, status and protocol", hi: "Ek interface row ki dictionary, jisme interface name, IP, status aur protocol jaisi keys hain" },
        { en: "A JSON string that must be loaded with `json.loads()` first", hi: "JSON string jise pehle `json.loads()` se load karna padega" },
      ],
      answer: 2,
      explain: {
        en: "TextFSM matches each output row against the template and returns one dictionary per row, already a Python object, so no `json.loads()` is needed. Key names come from the template, so print one row to check them.",
        hi: "TextFSM har output row ko template se match karke har row ki ek dictionary deta hai, jo pehle se Python object hai, toh `json.loads()` ki zaroorat nahi. Key names template se aate hain, isliye ek row print karke check kar lo.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "NSnrvVhbuy8",
      title: "Netmiko Python Tutorial - Connecting to Cisco Router and Running Commands",
      channel: "Roger Perkin | Network Automation Consultant",
      lang: "en",
      note: { en: "Ten minutes: install check, the device dictionary, ConnectHandler and send_command against a Cisco router.", hi: "Das minute: install check, device dictionary, ConnectHandler aur Cisco router par send_command." },
    },
    {
      id: "v5PVSh6AQsE",
      title: "Hindi| Netmiko Python Tutorial | Python Network Automation with Netmiko | Automating Network Devices",
      channel: "NetMinion Solutions",
      lang: "hi",
      note: { en: "A Hindi walkthrough of connecting with Netmiko and running show and config commands.", hi: "Netmiko se connect karne aur show aur config commands chalane ka Hindi walkthrough." },
    },
  ],
  lab: {
    title: { en: "Automate a three-switch lab", hi: "Teen switch wala lab automate karo" },
    steps: [
      { en: "In CML-Free, GNS3 or EVE-NG, build R1 and three IOSv switches with management IPs 10.10.10.1 and .11-.13, and the SSH config from this lesson. Check that you can SSH to each by hand.", hi: "CML-Free, GNS3 ya EVE-NG mein R1 aur teen IOSv switches banao, management IPs 10.10.10.1 aur .11-.13, aur is lesson ka SSH config. Har ek par haath se SSH karke check karo." },
      { en: "Create a venv, install Netmiko, and run `show_brief.py` against R1.", hi: "Venv banao, Netmiko install karo, aur R1 par `show_brief.py` chalao." },
      { en: "Run `check_ints.py`. Then change SW3's password on the device and run it again: you should see one AUTH FAILED line and the loop should finish.", hi: "`check_ints.py` chalao. Phir device par SW3 ka password badlo aur dobara chalao: ek AUTH FAILED line dikhni chahiye aur loop poora hona chahiye." },
      { en: "Run `set_ntp.py` without `--apply` and read the dry run. Then run it with `--apply`.", hi: "`set_ntp.py` bina `--apply` ke chalao aur dry run padho. Phir `--apply` ke saath chalao." },
      { en: "On one switch run `show startup-config | include ntp` by hand to prove the save worked, then read `changes.log` and one `-session.log` file.", hi: "Ek switch par haath se `show startup-config | include ntp` chalao taaki pata chale save hua, phir `changes.log` aur ek `-session.log` file padho." },
    ],
  },
};

export default lesson;
