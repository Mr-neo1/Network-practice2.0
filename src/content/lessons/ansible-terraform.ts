import type { Lesson } from "../types.ts";

// Example used throughout: Ansible control node 10.10.10.5 manages SW1-SW3 (10.10.10.11-13)
// and adds VLAN 30 "VOICE"; Terraform creates a VPC 10.50.0.0/16 and subnet 10.50.1.0/24 in ap-south-1.
const lesson: Lesson = {
  slug: "ansible-terraform",
  intro: {
    en: "Adding one VLAN by hand is easy. Adding it to 200 switches, all with the same name, and proving six months later that nobody has changed it since, is not. Configuration management tools keep the intended configuration in files, push it to every device the same way, and show you where reality has drifted. CCNA v1.1 names Ansible and Terraform: you need to know what each one does and how they differ. Puppet and Chef, from the older v1.0 blueprint, are worth recognising as the contrast.",
    hi: "Haath se ek VLAN add karna aasaan hai. Lekin use 200 switches par same naam ke saath add karna, aur chhe mahine baad prove karna ki tab se kisi ne use badla nahi, mushkil hai. Configuration management tools intended configuration ko files mein rakhte hain, use har device par ek hi tareeke se push karte hain, aur dikhate hain ki asli state kahan drift ho gayi hai. CCNA v1.1 mein Ansible aur Terraform ka naam hai: tumhe pata hona chahiye ki dono kya karte hain aur dono mein fark kya hai. Puppet aur Chef purane v1.0 blueprint mein the; contrast ke liye unhe pehchaanna bhi kaam aata hai.",
  },
  outcomes: [
    { en: "Explain the goals of configuration management: consistency, drift detection and version control", hi: "Configuration management ke goals samjha sako: consistency, drift detection aur version control" },
    { en: "Describe Ansible's parts: control node, inventory, playbook, task and module", hi: "Ansible ke parts describe kar sako: control node, inventory, playbook, task aur module" },
    { en: "Read a simple playbook and its output, and explain idempotence and check mode", hi: "Ek simple playbook aur uska output padh sako, aur idempotence aur check mode samjha sako" },
    { en: "Describe Terraform's workflow: HCL files, providers, plan, apply and the state file", hi: "Terraform ka workflow describe kar sako: HCL files, providers, plan, apply aur state file" },
    { en: "Compare Ansible, Terraform, Puppet and Chef: agent, push or pull, language and main use", hi: "Ansible, Terraform, Puppet aur Chef compare kar sako: agent, push ya pull, language aur main use" },
  ],
  sections: [
    {
      id: "why-config-management",
      heading: { en: "Why configuration management", hi: "Configuration management kyun" },
      blocks: [
        {
          type: "p",
          text: {
            en: "In lesson 6.1 you saw what manual changes cost: typing mistakes, devices configured slightly differently, and nobody sure what the configuration should be. Configuration management tools fix this by treating the configuration as code: you describe the intended state in text files, and the tool makes the devices match.",
            hi: "Lesson 6.1 mein tumne dekha tha ki manual changes ki keemat kya hai: typing ki galtiyan, har device thoda alag configure, aur kisi ko pakka pata nahi ki configuration honi kya chahiye. Configuration management tools isse configuration ko code ki tarah treat karke solve karte hain: tum intended state text files mein likhte ho, aur tool devices ko uske hisaab se match kar deta hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Consistency**: the same file is applied to every switch in a group, so all 200 get the same VLAN name, NTP servers and banners.",
              hi: "**Consistency**: ek hi file group ke har switch par lagti hai, isliye saare 200 ko same VLAN naam, NTP servers aur banners milte hain.",
            },
            {
              en: "**Drift detection**: someone changes a device by hand at 2 a.m. and forgets to tell anyone. The tool compares the device with the files and reports the difference, and can put it back.",
              hi: "**Drift detection**: koi raat 2 baje haath se device badal deta hai aur kisi ko batana bhool jaata hai. Tool device ko files se compare karke fark report karta hai, aur use wapas theek bhi kar sakta hai.",
            },
            {
              en: "**Version control**: the files live in Git, so every change has an author, a date, a reason and a review, and you can roll back to last week's version.",
              hi: "**Version control**: files Git mein rehti hain, isliye har change ka author, date, reason aur review hota hai, aur pichhle hafte ke version par wapas ja sakte ho.",
            },
            {
              en: "**Provisioning and templates**: new devices or sites get built from the same templates and variables, instead of copying an old config and editing it by hand.",
              hi: "**Provisioning aur templates**: naye devices ya sites same templates aur variables se bante hain, kisi purani config ko copy karke haath se edit karne ki jagah.",
            },
          ],
        },
      ],
    },
    {
      id: "ansible-parts",
      heading: { en: "Ansible: agentless, push over SSH", hi: "Ansible: agentless, SSH par push" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Ansible** (owned by Red Hat, written in Python) runs on one machine, the **control node**, usually Linux. The devices it manages run **no agent**: for network devices Ansible logs in over SSH, exactly as you would, sends commands and reads the output. It can also use NETCONF or a device's REST API. Because the control node starts every connection, Ansible is a **push** model.",
            hi: "**Ansible** (Red Hat ka, Python mein likha hua) ek machine par chalta hai, jise **control node** kehte hain, aam taur par Linux. Jo devices yeh manage karta hai un par **koi agent nahi** chalta: network devices par Ansible bilkul tumhari tarah SSH se login karta hai, commands bhejta hai aur output padhta hai. Yeh NETCONF ya device ki REST API bhi use kar sakta hai. Har connection control node shuru karta hai, isliye Ansible **push** model hai.",
          },
        },
        {
          type: "table",
          caption: { en: "Ansible's building blocks", hi: "Ansible ke building blocks" },
          columns: [{ en: "Part", hi: "Part" }, { en: "What it is", hi: "Kya hai" }],
          rows: [
            [{ en: "Control node", hi: "Control node" }, { en: "The machine with Ansible installed that runs playbooks and opens the connections", hi: "Woh machine jis par Ansible installed hai, jo playbooks chalati hai aur connections kholti hai" }],
            [{ en: "Inventory", hi: "Inventory" }, { en: "A file listing the managed devices, their addresses and groups (INI or YAML)", hi: "File jisme managed devices, unke addresses aur groups ki list hoti hai (INI ya YAML)" }],
            [{ en: "Playbook", hi: "Playbook" }, { en: "A YAML file with one or more plays; each play targets a group of hosts", hi: "YAML file jisme ek ya zyada plays hote hain; har play hosts ke ek group ko target karta hai" }],
            [{ en: "Task", hi: "Task" }, { en: "One step in a play, run in order on every host of the play", hi: "Play ka ek step, jo play ke har host par order mein chalta hai" }],
            [{ en: "Module", hi: "Module" }, { en: "The code a task calls, such as `cisco.ios.ios_vlans` or `cisco.ios.ios_config`", hi: "Woh code jise task call karta hai, jaise `cisco.ios.ios_vlans` ya `cisco.ios.ios_config`" }],
            [{ en: "Variables and templates", hi: "Variables aur templates" }, { en: "Per-device values and Jinja2 templates, so one playbook fits many devices", hi: "Har device ki apni values aur Jinja2 templates, taaki ek playbook bahut saare devices par chale" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Ansible: agentless, push, SSH (TCP 22) by default, playbooks written in YAML. If a question mentions YAML playbooks or no agent on the device, the answer is Ansible.",
            hi: "Ansible: agentless, push, default mein SSH (TCP 22), playbooks YAML mein. Sawaal mein YAML playbooks ya device par agent na hone ki baat ho, toh jawab Ansible hai.",
          },
        },
      ],
    },
    {
      id: "a-playbook",
      heading: { en: "A playbook that adds a VLAN to three switches", hi: "Ek playbook jo teen switches par VLAN add karti hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Two files are enough. The inventory names the switches and tells Ansible how to reach them. The playbook says what state they must be in.",
            hi: "Do files kaafi hain. Inventory switches ke naam batati hai aur Ansible ko batati hai ki unhe kaise reach karna hai. Playbook batati hai ki unhe kis state mein hona chahiye.",
          },
        },
        {
          type: "code",
          lang: "text",
          title: { en: "inventory.ini", hi: "inventory.ini" },
          code: [
            "[switches]",
            "SW1 ansible_host=10.10.10.11",
            "SW2 ansible_host=10.10.10.12",
            "SW3 ansible_host=10.10.10.13",
            "",
            "[switches:vars]",
            "ansible_connection=ansible.netcommon.network_cli",
            "ansible_network_os=cisco.ios.ios",
            "ansible_user=netadmin",
          ].join("\n"),
        },
        {
          type: "code",
          lang: "yaml",
          title: { en: "vlan30.yml", hi: "vlan30.yml" },
          code: [
            "---",
            "- name: Add the voice VLAN to the access switches",
            "  hosts: switches",
            "  gather_facts: false",
            "  tasks:",
            "    - name: VLAN 30 exists and is named VOICE",
            "      cisco.ios.ios_vlans:",
            "        config:",
            "          - vlan_id: 30",
            "            name: VOICE",
            "        state: merged",
          ].join("\n"),
        },
        {
          type: "p",
          text: {
            en: "Notice that the task does not say \"type `vlan 30`\". It describes the result: VLAN 30 exists with the name VOICE. The `ios_vlans` module reads the switch's current VLANs, works out the difference, and sends only the commands needed. `state: merged` means add or update what is listed and leave other VLANs alone.",
            hi: "Dhyan do, task yeh nahi kehta ki \"`vlan 30` type karo\". Woh result describe karta hai: VLAN 30 maujood ho aur uska naam VOICE ho. `ios_vlans` module switch ke current VLANs padhta hai, fark nikaalta hai, aur sirf zaroori commands bhejta hai. `state: merged` ka matlab hai jo list mein hai use add ya update karo aur baaki VLANs ko mat chhedo.",
          },
        },
        {
          type: "cli",
          title: { en: "First run from the control node (output shortened)", hi: "Control node se pehla run (output chhota kiya hua)" },
          lines: [
            { prompt: "netops@ctl:~$", cmd: "ansible-playbook -i inventory.ini vlan30.yml -k" },
            { out: "SSH password:" },
            { out: "PLAY [Add the voice VLAN to the access switches] ******************************" },
            { out: "TASK [VLAN 30 exists and is named VOICE] **************************************" },
            { out: "changed: [SW1]" },
            { out: "changed: [SW2]" },
            { out: "changed: [SW3]", comment: { en: "changed = Ansible had to send commands to this switch", hi: "changed = Ansible ko is switch par commands bhejne pade" } },
            { out: "PLAY RECAP ********************************************************************" },
            { out: "SW1     : ok=1    changed=1    unreachable=0    failed=0" },
            { out: "SW2     : ok=1    changed=1    unreachable=0    failed=0" },
            { out: "SW3     : ok=1    changed=1    unreachable=0    failed=0" },
          ],
          note: {
            en: "`-k` asks for the SSH password. In production the password lives in an encrypted Ansible Vault file or is replaced by SSH keys, never in the inventory in clear text.",
            hi: "`-k` SSH password poochta hai. Production mein password encrypted Ansible Vault file mein rehta hai ya uski jagah SSH keys hoti hain, inventory mein clear text mein kabhi nahi.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Why not ios_config for VLANs?", hi: "VLANs ke liye ios_config kyun nahi?" },
          text: {
            en: "`cisco.ios.ios_config` sends raw configuration lines and compares them with the running-config. That works well for lines such as `ntp server 10.10.10.123`. But on many Catalyst switches in VTP server or client mode (server is the default), normal-range VLANs are stored in vlan.dat and are not shown in the running-config. `ios_config` cannot see them, so it pushes the lines again and reports a change on every run. Resource modules such as `ios_vlans` read the real VLAN table (`show vlan`) instead. This detail goes beyond the CCNA.",
            hi: "`cisco.ios.ios_config` raw configuration lines bhejta hai aur unhe running-config se compare karta hai. `ntp server 10.10.10.123` jaisi lines ke liye yeh achha chalta hai. Lekin kai Catalyst switches par, VTP server ya client mode mein (default server hai), normal-range VLANs vlan.dat mein store hote hain aur running-config mein nahi dikhte. `ios_config` unhe dekh hi nahi pata, isliye har run par lines dobara push karta hai aur change report karta hai. `ios_vlans` jaise resource modules asli VLAN table (`show vlan`) padhte hain. Yeh detail CCNA se aage ki hai.",
          },
        },
      ],
    },
    {
      id: "idempotence-and-check-mode",
      heading: { en: "Idempotence, check mode and drift", hi: "Idempotence, check mode aur drift" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Run the same playbook again and every switch reports `ok`, with `changed=0`. Nothing was sent, because VLAN 30 VOICE already exists. This property is **idempotence**: applying the same desired state once or ten times gives the same result, so it is safe to run a playbook on a schedule.",
            hi: "Wahi playbook dobara chalao toh har switch `ok` report karta hai, `changed=0` ke saath. Kuch nahi bheja gaya, kyunki VLAN 30 VOICE pehle se hai. Is property ko **idempotence** kehte hain: same desired state ek baar lagao ya dus baar, result same rehta hai, isliye playbook ko schedule par chalana safe hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "**Check mode** (`--check`) is a dry run: Ansible connects, compares and reports what it **would** change, but sends no configuration. Add `--diff` to see the difference. Suppose someone renamed VLAN 30 to TEST on SW2 by hand:",
            hi: "**Check mode** (`--check`) ek dry run hai: Ansible connect karta hai, compare karta hai aur batata hai ki woh kya **badlega**, lekin koi configuration nahi bhejta. Fark dekhna ho toh `--diff` jodo. Maan lo kisi ne SW2 par haath se VLAN 30 ka naam TEST kar diya:",
          },
        },
        {
          type: "cli",
          title: { en: "Drift found in check mode (output shortened)", hi: "Check mode mein drift mila (output chhota kiya hua)" },
          lines: [
            { prompt: "netops@ctl:~$", cmd: "ansible-playbook -i inventory.ini vlan30.yml -k --check" },
            { out: "TASK [VLAN 30 exists and is named VOICE] **************************************" },
            { out: "ok: [SW1]" },
            { out: "changed: [SW2]", comment: { en: "In check mode this means \"would change\": SW2 has drifted", hi: "Check mode mein iska matlab \"badlega\": SW2 drift ho gaya hai" } },
            { out: "ok: [SW3]" },
            { out: "PLAY RECAP ********************************************************************" },
            { out: "SW2     : ok=1    changed=1    unreachable=0    failed=0" },
          ],
          note: {
            en: "Run without `--check` and only SW2 receives a command; SW1 and SW3 stay untouched.",
            hi: "`--check` ke bina chalao toh sirf SW2 ko command milta hai; SW1 aur SW3 ko chhua bhi nahi jaata.",
          },
        },
        {
          type: "cli",
          title: { en: "Confirming on SW2 afterwards (output shortened)", hi: "Baad mein SW2 par confirm karna (output chhota kiya hua)" },
          lines: [
            { prompt: "SW2#", cmd: "show vlan brief" },
            { out: "VLAN Name                             Status    Ports" },
            { out: "---- -------------------------------- --------- -------------------------------" },
            { out: "1    default                          active    Gi1/0/1, Gi1/0/2, Gi1/0/3" },
            { out: "30   VOICE                            active" },
          ],
        },
      ],
    },
    {
      id: "terraform",
      heading: { en: "Terraform: declare the end state, plan, apply", hi: "Terraform: end state declare karo, plan, apply" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Terraform** (from HashiCorp) is **infrastructure as code** for building things: cloud networks, subnets, virtual machines, firewalls, load balancers. You write **declarative** files in **HCL** (HashiCorp Configuration Language) describing the end result, not the steps. Terraform works out the order itself from the dependencies between resources.",
            hi: "**Terraform** (HashiCorp ka) cheezein banane ke liye **infrastructure as code** hai: cloud networks, subnets, virtual machines, firewalls, load balancers. Tum **HCL** (HashiCorp Configuration Language) mein **declarative** files likhte ho jo end result describe karti hain, steps nahi. Order Terraform khud resources ke beech ki dependencies se nikaal leta hai.",
          },
        },
        {
          type: "code",
          lang: "text",
          title: { en: "main.tf (HCL): one VPC and one subnet in a public cloud", hi: "main.tf (HCL): public cloud mein ek VPC aur ek subnet" },
          code: [
            "provider \"aws\" {",
            "  region = \"ap-south-1\"",
            "}",
            "",
            "resource \"aws_vpc\" \"lab\" {",
            "  cidr_block = \"10.50.0.0/16\"",
            "}",
            "",
            "resource \"aws_subnet\" \"web\" {",
            "  vpc_id     = aws_vpc.lab.id",
            "  cidr_block = \"10.50.1.0/24\"",
            "}",
          ].join("\n"),
        },
        {
          type: "list",
          items: [
            {
              en: "A **provider** is a plugin that knows one platform's API: AWS, Azure, Google Cloud, and network platforms such as Cisco ACI, Meraki and IOS XE. Terraform itself is agentless; providers usually make REST calls over HTTPS.",
              hi: "**Provider** ek plugin hai jo ek platform ki API samajhta hai: AWS, Azure, Google Cloud, aur Cisco ACI, Meraki aur IOS XE jaise network platforms. Terraform khud agentless hai; providers aam taur par HTTPS par REST calls karte hain.",
            },
            {
              en: "A **resource** block is one thing to create. Because `aws_subnet.web` refers to `aws_vpc.lab.id`, Terraform knows the VPC must exist before the subnet.",
              hi: "**Resource** block ek cheez hai jo banani hai. `aws_subnet.web` mein `aws_vpc.lab.id` ka reference hai, isliye Terraform jaanta hai ki subnet se pehle VPC banna zaroori hai.",
            },
            {
              en: "The **state file** (`terraform.tfstate`) records which real object belongs to each resource, for example `aws_vpc.lab` is `vpc-0a1b2c3d4e5f60718`. Terraform compares the files, the state and the real infrastructure to decide what to do. Teams store state remotely with locking, and never edit it by hand.",
              hi: "**State file** (`terraform.tfstate`) record karti hai ki har resource ka asli object kaunsa hai, jaise `aws_vpc.lab` matlab `vpc-0a1b2c3d4e5f60718`. Kya karna hai, yeh Terraform files, state aur asli infrastructure ko compare karke decide karta hai. Teams state ko locking ke saath remote store karti hain, aur use kabhi haath se edit nahi karti.",
            },
          ],
        },
        {
          type: "steps",
          items: [
            { en: "`terraform init` downloads the providers the files need.", hi: "`terraform init` woh providers download karta hai jo files ko chahiye." },
            { en: "`terraform plan` shows what would be created (+), changed (~) or destroyed (-), and changes nothing.", hi: "`terraform plan` dikhata hai kya banega (+), kya badlega (~) ya kya hatega (-), aur kuch badalta nahi." },
            { en: "`terraform apply` shows the plan again, asks you to type `yes`, makes the API calls and updates the state file.", hi: "`terraform apply` plan dobara dikhata hai, `yes` type karne ko kehta hai, API calls karta hai aur state file update karta hai." },
            { en: "Run `terraform plan` again and it reports no changes: Terraform's version of idempotence. If someone changes a resource outside Terraform, the next plan shows that drift and proposes to put it back.", hi: "`terraform plan` dobara chalao toh woh no changes batata hai: yeh Terraform wali idempotence hai. Agar koi Terraform ke bahar resource badal de, toh agla plan woh drift dikhata hai aur use wapas theek karne ka proposal deta hai." },
            { en: "`terraform destroy` removes everything the state file tracks.", hi: "`terraform destroy` woh sab hata deta hai jo state file track kar rahi hai." },
          ],
        },
        {
          type: "cli",
          title: { en: "plan and apply (output shortened)", hi: "plan aur apply (output chhota kiya hua)" },
          lines: [
            { prompt: "netops@ctl:~/lab$", cmd: "terraform plan" },
            { out: "  # aws_subnet.web will be created" },
            { out: "  + resource \"aws_subnet\" \"web\" {" },
            { out: "      + cidr_block = \"10.50.1.0/24\"" },
            { out: "  # aws_vpc.lab will be created" },
            { out: "  + resource \"aws_vpc\" \"lab\" {" },
            { out: "      + cidr_block = \"10.50.0.0/16\"" },
            { out: "Plan: 2 to add, 0 to change, 0 to destroy." },
            { prompt: "netops@ctl:~/lab$", cmd: "terraform apply" },
            { out: "  Enter a value: yes", comment: { en: "apply shows the plan again and waits for you to type yes", hi: "apply plan dobara dikhata hai aur tumhare yes type karne ka wait karta hai" } },
            { out: "aws_vpc.lab: Creation complete after 2s [id=vpc-0a1b2c3d4e5f60718]" },
            { out: "aws_subnet.web: Creation complete after 1s [id=subnet-0f1e2d3c4b5a69788]" },
            { out: "Apply complete! Resources: 2 added, 0 changed, 0 destroyed." },
            { prompt: "netops@ctl:~/lab$", cmd: "terraform plan" },
            { out: "No changes. Your infrastructure matches the configuration.", comment: { en: "Real state matches the files and the state file", hi: "Asli state files aur state file se match karti hai" } },
          ],
        },
      ],
    },
    {
      id: "puppet-and-chef",
      heading: { en: "Puppet and Chef: agents that pull", hi: "Puppet aur Chef: agents jo pull karte hain" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Puppet and Chef are older configuration management tools. They were named in the CCNA v1.0 blueprint and are no longer listed in v1.1, but they are still the classic contrast to Ansible, and older practice questions use them. Both are mainly **agent-based** and **pull**: an agent on each managed device contacts a central server on a schedule, downloads its intended configuration and applies it.",
            hi: "Puppet aur Chef purane configuration management tools hain. CCNA v1.0 blueprint mein inka naam tha, v1.1 mein nahi hai, lekin Ansible ke contrast ke liye yahi classic example hain, aur purane practice questions mein yeh aate hain. Dono mainly **agent-based** aur **pull** hain: har managed device par ek agent schedule par central server se contact karta hai, apni intended configuration download karta hai aur apply karta hai.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Puppet**: the Puppet agent checks in with the Puppet server (called the Puppet master in older material) over HTTPS on **TCP 8140**, every 30 minutes by default. Configurations are **manifests** in Puppet's own declarative language. Devices that cannot run an agent can be managed through a proxy agent.",
              hi: "**Puppet**: Puppet agent HTTPS par, **TCP 8140** par, Puppet server se check in karta hai (purane material mein ise Puppet master kehte hain), default mein har 30 minute. Configurations **manifests** hoti hain, Puppet ki apni declarative language mein. Jo devices agent nahi chala sakte, unhe proxy agent ke through manage kiya ja sakta hai.",
            },
            {
              en: "**Chef**: the Chef client pulls from the Chef server over HTTPS. Configurations are **recipes**, grouped into **cookbooks**, written in Ruby. CCNA study material often lists the Chef server port as **TCP 10002**; current Chef Infra Server listens on the standard HTTPS port, TCP 443.",
              hi: "**Chef**: Chef client HTTPS par Chef server se pull karta hai. Configurations **recipes** hoti hain, jo **cookbooks** mein group hoti hain, aur Ruby mein likhi jaati hain. CCNA study material mein Chef server ka port aksar **TCP 10002** likha hota hai; aaj ka Chef Infra Server normal HTTPS port, TCP 443, par sunta hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Why agents are rare on network gear", hi: "Network gear par agents kam kyun dikhte hain" },
          text: {
            en: "Servers can install any agent you like. Most switches and routers cannot, and SSH is already on every one of them. That is a big reason Ansible became the common choice for network configuration.",
            hi: "Servers par tum koi bhi agent install kar sakte ho. Zyada tar switches aur routers par nahi kar sakte, aur SSH un sab par pehle se hota hai. Network configuration ke liye Ansible ke common choice banne ki yeh badi wajah hai.",
          },
        },
      ],
    },
    {
      id: "choosing-a-tool",
      heading: { en: "Choosing a tool", hi: "Tool chunna" },
      blocks: [
        {
          type: "table",
          caption: { en: "The four tools side by side", hi: "Chaaron tools side by side" },
          columns: [{ en: "Feature", hi: "Feature" }, "Ansible", "Terraform", "Puppet", "Chef"],
          rows: [
            [{ en: "Agent on device", hi: "Device par agent" }, { en: "No", hi: "Nahi" }, { en: "No", hi: "Nahi" }, { en: "Yes (or proxy)", hi: "Haan (ya proxy)" }, { en: "Yes", hi: "Haan" }],
            [{ en: "Push or pull", hi: "Push ya pull" }, "Push", { en: "Push (API calls)", hi: "Push (API calls)" }, "Pull", "Pull"],
            [{ en: "Files written in", hi: "Files kis mein" }, { en: "YAML playbooks", hi: "YAML playbooks" }, { en: "HCL", hi: "HCL" }, { en: "Puppet DSL manifests", hi: "Puppet DSL manifests" }, { en: "Ruby recipes", hi: "Ruby recipes" }],
            [{ en: "Style", hi: "Style" }, { en: "Procedural: ordered tasks (each module describes a state)", hi: "Procedural: order mein tasks (har module ek state describe karta hai)" }, { en: "Declarative", hi: "Declarative" }, { en: "Declarative", hi: "Declarative" }, { en: "Procedural Ruby code", hi: "Procedural Ruby code" }],
            [{ en: "Talks to devices via", hi: "Devices se kaise baat" }, { en: "SSH (also NETCONF, REST)", hi: "SSH (NETCONF, REST bhi)" }, { en: "Provider APIs, usually HTTPS", hi: "Provider APIs, aam taur par HTTPS" }, { en: "Agent to server, HTTPS on TCP 8140", hi: "Agent se server, HTTPS, TCP 8140" }, { en: "Client to server, HTTPS (guides often say TCP 10002)", hi: "Client se server, HTTPS (guides mein aksar TCP 10002)" }],
            [{ en: "Main job", hi: "Main kaam" }, { en: "Configuring existing devices", hi: "Maujood devices configure karna" }, { en: "Provisioning infrastructure", hi: "Infrastructure provision karna" }, { en: "Configuring servers", hi: "Servers configure karna" }, { en: "Configuring servers", hi: "Servers configure karna" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "In practice teams often combine them: Terraform builds the cloud network and the virtual routers, then Ansible configures what runs on them. Both keep their files in Git, so a change starts as a reviewed commit rather than a late-night CLI session.",
            hi: "Practice mein teams aksar dono ko saath use karti hain: Terraform cloud network aur virtual routers banata hai, phir Ansible un par chalne wali cheezein configure karta hai. Dono apni files Git mein rakhte hain, isliye change raat ke CLI session se nahi, ek reviewed commit se shuru hota hai.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point: Ansible or Terraform?", hi: "Exam point: Ansible ya Terraform?" },
          text: {
            en: "Ansible: agentless, push over SSH, YAML playbooks, procedural tasks, mainly configuring devices that already exist. Terraform: agentless, declarative HCL, `plan` then `apply`, a state file, mainly provisioning infrastructure such as cloud networks. Both are idempotent when used as intended.",
            hi: "Ansible: agentless, SSH par push, YAML playbooks, procedural tasks, mainly pehle se maujood devices ko configure karna. Terraform: agentless, declarative HCL, pehle `plan` phir `apply`, ek state file, mainly infrastructure provision karna, jaise cloud networks. Sahi tareeke se use karo toh dono idempotent hain.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Configuration drift", def: { en: "The difference that builds up between a device's real configuration and its intended configuration.", hi: "Device ki asli configuration aur intended configuration ke beech dheere dheere banne wala fark." } },
    { term: "Idempotence", def: { en: "Applying the same desired state repeatedly gives the same result and makes no further changes.", hi: "Same desired state baar baar lagane par result same rehta hai aur koi naya change nahi hota." } },
    { term: "Control node", def: { en: "The machine where Ansible runs and from which it connects to managed devices.", hi: "Woh machine jahan Ansible chalta hai aur jahan se woh managed devices se connect karta hai." } },
    { term: "Inventory", def: { en: "Ansible's list of managed hosts, their addresses, groups and connection variables.", hi: "Ansible ki managed hosts ki list, unke addresses, groups aur connection variables ke saath." } },
    { term: "Playbook", def: { en: "A YAML file of plays and tasks that Ansible runs against hosts from the inventory.", hi: "Plays aur tasks wali YAML file jise Ansible inventory ke hosts par chalata hai." } },
    { term: "Infrastructure as code", def: { en: "Defining infrastructure in version-controlled text files that a tool applies, instead of building it by hand.", hi: "Infrastructure ko haath se banane ki jagah version-controlled text files mein define karna, jinhe tool apply karta hai." } },
    { term: "Terraform state", def: { en: "The terraform.tfstate file that maps each resource in the configuration to a real object.", hi: "terraform.tfstate file jo configuration ke har resource ko ek asli object se map karti hai." } },
    { term: "Agent-based (pull)", def: { en: "Software on each managed node fetches its configuration from a server on a schedule, as with Puppet and Chef.", hi: "Har managed node par software schedule par server se apni configuration le aata hai, jaise Puppet aur Chef mein." } },
  ],
  commands: [
    { cmd: "ansible-playbook -i inventory.ini vlan30.yml", mode: "Control node shell (Linux)", does: { en: "Run the playbook against the hosts in the inventory", hi: "Inventory ke hosts par playbook chalao" } },
    { cmd: "ansible-playbook -i inventory.ini vlan30.yml --check --diff", mode: "Control node shell (Linux)", does: { en: "Dry run: show what would change, change nothing", hi: "Dry run: kya badlega woh dikhao, kuch mat badlo" } },
    { cmd: "terraform init", mode: "Shell in the Terraform folder", does: { en: "Download the providers the configuration needs", hi: "Configuration ke liye zaroori providers download karo" } },
    { cmd: "terraform plan", mode: "Shell in the Terraform folder", does: { en: "Show what would be created, changed or destroyed", hi: "Dikhao kya banega, badlega ya hatega" } },
    { cmd: "terraform apply", mode: "Shell in the Terraform folder", does: { en: "Make the changes after confirmation and update the state file", hi: "Confirmation ke baad changes karo aur state file update karo" } },
    { cmd: "terraform destroy", mode: "Shell in the Terraform folder", does: { en: "Remove every resource tracked in the state", hi: "State mein track hone wala har resource hatao" } },
    { cmd: "show vlan brief", mode: "Cisco privileged EXEC", does: { en: "Verify on the switch what the playbook changed", hi: "Switch par verify karo ki playbook ne kya badla" } },
  ],
  mistakes: [
    {
      en: "Saying Ansible needs an agent on each switch. It is agentless and pushes over SSH; Puppet and Chef are the agent-based tools.",
      hi: "Yeh kehna ki Ansible ko har switch par agent chahiye. Woh agentless hai aur SSH par push karta hai; agent-based tools Puppet aur Chef hain.",
    },
    {
      en: "Mixing up the file languages. Ansible playbooks are YAML, Terraform uses HCL, Puppet uses its own DSL, Chef uses Ruby.",
      hi: "File languages mix karna. Ansible playbooks YAML hain, Terraform HCL use karta hai, Puppet apni DSL, aur Chef Ruby.",
    },
    {
      en: "Reading `changed` in a second run as a success. If a correct playbook keeps reporting `changed`, the device drifted again or the module is not idempotent for that config.",
      hi: "Doosre run mein `changed` ko success samajhna. Agar sahi playbook baar baar `changed` dikha rahi hai, toh device phir drift hua hai ya module us config ke liye idempotent nahi hai.",
    },
    {
      en: "Thinking `terraform plan` changes anything. Only `apply` (and `destroy`) make changes; plan is a preview.",
      hi: "Yeh sochna ki `terraform plan` kuch badalta hai. Sirf `apply` (aur `destroy`) changes karte hain; plan sirf preview hai.",
    },
    {
      en: "Deleting or hand-editing the Terraform state file. Without it Terraform no longer knows which real objects it manages and may try to create them again.",
      hi: "Terraform state file delete ya haath se edit karna. Uske bina Terraform ko pata hi nahi rehta ki woh kaunse asli objects manage karta hai, aur woh unhe dobara banane ki koshish kar sakta hai.",
    },
  ],
  recap: [
    { en: "Configuration management gives consistency, drift detection and version control by keeping intended state in files.", hi: "Configuration management intended state ko files mein rakh kar consistency, drift detection aur version control deta hai." },
    { en: "Ansible: agentless push over SSH from a control node; inventory lists devices; YAML playbooks hold tasks that call modules.", hi: "Ansible: control node se SSH par agentless push; inventory devices list karti hai; YAML playbooks mein tasks hote hain jo modules call karte hain." },
    { en: "Idempotent: a second run reports changed=0. `--check` is a dry run that reveals drift.", hi: "Idempotent: doosra run changed=0 batata hai. `--check` ek dry run hai jo drift dikhata hai." },
    { en: "Terraform: declarative HCL, providers, `init` / `plan` / `apply`, and a state file mapping resources to real objects.", hi: "Terraform: declarative HCL, providers, `init` / `plan` / `apply`, aur ek state file jo resources ko asli objects se map karti hai." },
    { en: "Puppet (TCP 8140, manifests) and Chef (Ruby recipes) are agent-based pull tools.", hi: "Puppet (TCP 8140, manifests) aur Chef (Ruby recipes) agent-based pull tools hain." },
  ],
  quiz: [
    {
      q: {
        en: "Which tool manages network devices without installing an agent on them and pushes changes over SSH using YAML playbooks?",
        hi: "Kaunsa tool network devices par agent install kiye bina unhe manage karta hai aur YAML playbooks se SSH par changes push karta hai?",
      },
      options: [
        { en: "Ansible", hi: "Ansible" },
        { en: "Puppet", hi: "Puppet" },
        { en: "Chef", hi: "Chef" },
        { en: "Terraform", hi: "Terraform" },
      ],
      answer: 0,
      explain: {
        en: "Ansible is agentless, pushes from a control node over SSH, and uses YAML playbooks. Puppet and Chef rely on agents that pull. Terraform is also agentless but uses HCL and provider APIs, not playbooks over SSH.",
        hi: "Ansible agentless hai, control node se SSH par push karta hai, aur YAML playbooks use karta hai. Puppet aur Chef pull karne wale agents par chalte hain. Terraform bhi agentless hai, lekin HCL aur provider APIs use karta hai, SSH par playbooks nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A playbook ran yesterday and configured VLAN 30 on 50 switches. Today it is run again with no changes to the switches, and the PLAY RECAP shows changed=0 for every host. Which property does this show?",
        hi: "Ek playbook ne kal 50 switches par VLAN 30 configure kiya. Aaj switches mein bina kisi change ke use dobara chalaya gaya, aur PLAY RECAP har host ke liye changed=0 dikhata hai. Yeh kaunsi property hai?",
      },
      options: [
        { en: "Check mode", hi: "Check mode" },
        { en: "Statelessness", hi: "Statelessness" },
        { en: "Idempotence", hi: "Idempotence" },
        { en: "Configuration drift", hi: "Configuration drift" },
      ],
      answer: 2,
      explain: {
        en: "Applying the same desired state again changed nothing because the devices already matched it: that is idempotence. Check mode is a dry run you choose with --check, and drift would show up as changed on a host.",
        hi: "Same desired state dobara lagane par kuch nahi badla kyunki devices pehle se match kar rahe the: yahi idempotence hai. Check mode ek dry run hai jo --check se chalta hai, aur drift hota toh kisi host par changed dikhta.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "What is the job of Terraform's state file?",
        hi: "Terraform ki state file ka kaam kya hai?",
      },
      options: [
        { en: "It lists the SSH usernames for each device", hi: "Har device ke SSH usernames list karti hai" },
        { en: "It stores the YAML tasks to run in order", hi: "Order mein chalane wale YAML tasks store karti hai" },
        { en: "It holds the provider plugins downloaded by terraform init", hi: "terraform init se download hue provider plugins rakhti hai" },
        { en: "It maps each resource in the configuration to the real object it created", hi: "Configuration ke har resource ko us asli object se map karti hai jo usne banaya" },
      ],
      answer: 3,
      explain: {
        en: "terraform.tfstate records, for example, that aws_vpc.lab is vpc-0a1b2c3d4e5f60718. Plan compares the configuration, the state and the real infrastructure to decide what to do. Providers are downloaded by init but are not the state.",
        hi: "terraform.tfstate record karti hai, jaise ki aws_vpc.lab matlab vpc-0a1b2c3d4e5f60718. Plan configuration, state aur asli infrastructure ko compare karke decide karta hai ki kya karna hai. Providers init se download hote hain, lekin woh state nahi hain.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An engineer wants to see exactly what Terraform would create or change in the cloud, without changing anything yet. Which command should they run?",
        hi: "Ek engineer dekhna chahta hai ki Terraform cloud mein exactly kya banayega ya badlega, abhi kuch badle bina. Use kaunsa command chalana chahiye?",
      },
      options: [
        { en: "terraform apply", hi: "terraform apply" },
        { en: "terraform plan", hi: "terraform plan" },
        { en: "terraform destroy", hi: "terraform destroy" },
        { en: "ansible-playbook --diff", hi: "ansible-playbook --diff" },
      ],
      answer: 1,
      explain: {
        en: "terraform plan compares the files with the state and the real infrastructure and prints the additions, changes and deletions without making them. apply makes the changes after you confirm.",
        hi: "terraform plan files ko state aur asli infrastructure se compare karta hai aur additions, changes aur deletions print karta hai, bina unhe kiye. apply confirm karne ke baad changes karta hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "Which pairing of tool and file language is correct?",
        hi: "Tool aur file language ki kaunsi jodi sahi hai?",
      },
      options: [
        { en: "Ansible: HCL", hi: "Ansible: HCL" },
        { en: "Terraform: YAML playbooks", hi: "Terraform: YAML playbooks" },
        { en: "Chef: Ruby recipes", hi: "Chef: Ruby recipes" },
        { en: "Puppet: JSON playbooks", hi: "Puppet: JSON playbooks" },
      ],
      answer: 2,
      explain: {
        en: "Chef recipes and cookbooks are written in Ruby. Ansible uses YAML playbooks, Terraform uses HCL, and Puppet uses manifests in its own declarative language.",
        hi: "Chef recipes aur cookbooks Ruby mein likhe jaate hain. Ansible YAML playbooks use karta hai, Terraform HCL, aur Puppet apni declarative language mein manifests.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A company wants each server to run an agent that contacts a central server every 30 minutes on TCP 8140 and pulls its configuration. Which tool matches?",
        hi: "Ek company chahti hai ki har server par ek agent chale jo har 30 minute TCP 8140 par central server se contact kare aur apni configuration pull kare. Kaunsa tool match karta hai?",
      },
      options: [
        { en: "Ansible", hi: "Ansible" },
        { en: "Puppet", hi: "Puppet" },
        { en: "Terraform", hi: "Terraform" },
        { en: "Chef", hi: "Chef" },
      ],
      answer: 1,
      explain: {
        en: "The Puppet agent pulls from the Puppet server on TCP 8140, every 30 minutes by default. Chef is also agent-based and pull, but TCP 8140 is Puppet's port; the Chef client uses HTTPS on 443 (study guides often say 10002). Ansible and Terraform are agentless and push.",
        hi: "Puppet agent TCP 8140 par Puppet server se pull karta hai, default mein har 30 minute. Chef bhi agent-based aur pull hai, lekin TCP 8140 Puppet ka port hai; Chef client HTTPS par 443 use karta hai (study guides mein aksar 10002 likha hota hai). Ansible aur Terraform agentless aur push hain.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "Kog9gHTjALI",
      title: "Free CCNA | Ansible, Puppet, & Chef | Day 63 (part 1)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Configuration drift, then Ansible, Puppet and Chef compared.", hi: "Configuration drift, phir Ansible, Puppet aur Chef ka comparison." },
    },
    {
      id: "VAwUaffejWU",
      title: "Terraform | CCNA 200-301 Day 63 (part 2)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Terraform for the v1.1 exam: HCL, providers, plan, apply and state.", hi: "v1.1 exam ke liye Terraform: HCL, providers, plan, apply aur state." },
    },
    {
      id: "DWWyNyunLLY",
      title: "153. Free CCNA (NEW) | Introduction to Network Automation Tools - Ansible, Puppet, Chef",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Ansible, Puppet and Chef explained in Hindi.", hi: "Ansible, Puppet aur Chef Hindi mein samjhaye gaye hain." },
    },
    {
      id: "0sLa5W46JlE",
      title: "190. CCNA 200-301 Full Course in Hindi 2024 | Terraform",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Terraform in Hindi, for the v1.1 topic.", hi: "Terraform Hindi mein, v1.1 topic ke liye." },
    },
  ],
  lab: {
    title: { en: "Push a VLAN with Ansible and catch drift", hi: "Ansible se VLAN push karo aur drift pakdo" },
    steps: [
      {
        en: "You need a Linux machine (or WSL on Windows) that can reach real switches or virtual IOS images in GNS3, EVE-NG or Cisco Modeling Labs; Packet Tracer devices cannot be reached by Ansible. Install Ansible with `pip install ansible`, and the IOS collection with `ansible-galaxy collection install cisco.ios` if it is not already included.",
        hi: "Ek Linux machine chahiye (ya Windows par WSL) jo asli switches ya GNS3, EVE-NG ya Cisco Modeling Labs ki virtual IOS images tak pahunch sake; Packet Tracer ke devices tak Ansible nahi pahunch sakta. `pip install ansible` se Ansible install karo, aur agar IOS collection pehle se na ho toh `ansible-galaxy collection install cisco.ios` chalao.",
      },
      {
        en: "Enable SSH on two or three switches (lesson 4.7), give each a management IP, and write `inventory.ini` and `vlan30.yml` from this lesson with your own addresses.",
        hi: "Do-teen switches par SSH enable karo (lesson 4.7), har ek ko management IP do, aur apne addresses ke saath is lesson se `inventory.ini` aur `vlan30.yml` likho.",
      },
      {
        en: "Run `ansible-playbook -i inventory.ini vlan30.yml -k`. Confirm `changed` for each switch, then check `show vlan brief` on one of them.",
        hi: "`ansible-playbook -i inventory.ini vlan30.yml -k` chalao. Har switch ke liye `changed` confirm karo, phir kisi ek par `show vlan brief` check karo.",
      },
      {
        en: "Run the playbook again and confirm `changed=0` everywhere.",
        hi: "Playbook dobara chalao aur confirm karo ki har jagah `changed=0` hai.",
      },
      {
        en: "On one switch, rename VLAN 30 by hand (`vlan 30`, `name TEST`). Run with `--check --diff`, read which host would change, then run normally and verify that only that switch was touched.",
        hi: "Ek switch par haath se VLAN 30 ka naam badlo (`vlan 30`, `name TEST`). `--check --diff` ke saath chalao, dekho kaunsa host badlega, phir normal chalao aur verify karo ki sirf wahi switch chhua gaya.",
      },
    ],
  },
};

export default lesson;
