import type { TopologyScene } from "../types.ts";

// Ansible control node 10.10.10.5 manages SW1-SW3 (10.10.10.11-13) over SSH and adds VLAN 30 VOICE.
// Terraform builds VPC 10.50.0.0/16 and subnet 10.50.1.0/24 in ap-south-1 through the provider API.
// Colours: purple = reading current state, green = a change being made, gray = state reported back,
// red = drift.

const recap = (sw1: string, sw2: string, sw3: string, hl: number[]) => ({
  node: "ansible",
  title: "PLAY RECAP",
  columns: ["Host", "ok", "changed", "failed"],
  rows: [
    ["SW1", "1", sw1, "0"],
    ["SW2", "1", sw2, "0"],
    ["SW3", "1", sw3, "0"],
  ],
  hl,
});

const scene: TopologyScene = {
  kind: "topology",
  id: "ansible-terraform",
  title: { en: "Ansible pushes a VLAN; Terraform plans and builds a cloud network", hi: "Ansible VLAN push karta hai; Terraform cloud network plan karke banata hai" },
  height: 460,
  nodes: [
    { id: "ansible", kind: "controller", x: 120, y: 120, label: "Ansible", sub: "control node", sub2: "10.10.10.5" },
    { id: "sw1", kind: "switch", x: 460, y: 70, label: "SW1", sub: "10.10.10.11" },
    { id: "sw2", kind: "switch", x: 460, y: 185, label: "SW2", sub: "10.10.10.12" },
    { id: "sw3", kind: "switch", x: 460, y: 300, label: "SW3", sub: "10.10.10.13" },
    { id: "tf", kind: "controller", x: 120, y: 380, label: "Terraform", sub: "main.tf" },
    { id: "cloud", kind: "cloud", x: 660, y: 380, label: "Cloud API", sub: "ap-south-1" },
  ],
  links: [
    { id: "l-sw1", a: "ansible", b: "sw1", label: "SSH" },
    { id: "l-sw2", a: "ansible", b: "sw2", label: "SSH" },
    { id: "l-sw3", a: "ansible", b: "sw3", label: "SSH" },
    { id: "l-cloud", a: "tf", b: "cloud", label: "HTTPS API" },
  ],
  steps: [
    {
      title: { en: "Inventory and playbook on the control node", hi: "Control node par inventory aur playbook" },
      text: {
        en: "The control node holds two files. inventory.ini lists the group switches: SW1, SW2 and SW3 with their management IPs. vlan30.yml says VLAN 30 must exist with the name VOICE. Nothing is installed on the switches; SSH is all Ansible needs.",
        hi: "Control node par do files hain. inventory.ini group switches ki list hai: SW1, SW2 aur SW3 apne management IPs ke saath. vlan30.yml kehti hai ki VLAN 30 VOICE naam ke saath maujood hona chahiye. Switches par kuch install nahi hai; Ansible ko sirf SSH chahiye.",
      },
      focus: ["ansible"],
      badges: [{ node: "ansible", text: "vlan30.yml", tone: "blue" }],
      tables: [
        {
          node: "ansible",
          title: "inventory.ini [switches]",
          columns: ["Host", "ansible_host"],
          rows: [
            ["SW1", "10.10.10.11"],
            ["SW2", "10.10.10.12"],
            ["SW3", "10.10.10.13"],
          ],
        },
      ],
    },
    {
      title: { en: "Connect over SSH and read current VLANs", hi: "SSH se connect karke current VLANs padhna" },
      text: {
        en: "ansible-playbook opens an SSH session to all three switches in parallel. Before changing anything, the ios_vlans module reads each switch's current VLANs. All three answer the same way: there is no VLAN 30.",
        hi: "ansible-playbook teeno switches ke saath parallel mein SSH session kholta hai. Kuch badalne se pehle ios_vlans module har switch ke current VLANs padhta hai. Teeno ka jawab same hai: VLAN 30 nahi hai.",
      },
      links: [
        { id: "l-sw1", state: "active" },
        { id: "l-sw2", state: "active" },
        { id: "l-sw3", state: "active" },
      ],
      packets: [
        { path: ["ansible", "sw1"], label: "read VLANs", tone: "purple" },
        { path: ["ansible", "sw2"], label: "read VLANs", tone: "purple" },
        { path: ["ansible", "sw3"], label: "read VLANs", tone: "purple" },
        { path: ["sw1", "ansible"], label: "no VLAN 30", tone: "gray", delay: 1 },
        { path: ["sw2", "ansible"], label: "no VLAN 30", tone: "gray", delay: 1 },
        { path: ["sw3", "ansible"], label: "no VLAN 30", tone: "gray", delay: 1 },
      ],
    },
    {
      title: { en: "Push only the missing lines: changed=1", hi: "Sirf missing lines push: changed=1" },
      text: {
        en: "The module compares wanted with actual and sends just the difference: vlan 30, then name VOICE. Each switch now has VLAN 30 VOICE, and the PLAY RECAP shows changed=1 for every host.",
        hi: "Module wanted aur actual ko compare karta hai aur sirf fark bhejta hai: vlan 30, phir name VOICE. Ab har switch par VLAN 30 VOICE hai, aur PLAY RECAP har host ke liye changed=1 dikhata hai.",
      },
      packets: [
        { path: ["ansible", "sw1"], label: "vlan 30 VOICE", tone: "green" },
        { path: ["ansible", "sw2"], label: "vlan 30 VOICE", tone: "green" },
        { path: ["ansible", "sw3"], label: "vlan 30 VOICE", tone: "green" },
      ],
      badges: [
        { node: "sw1", text: "VLAN 30 VOICE", tone: "green" },
        { node: "sw2", text: "VLAN 30 VOICE", tone: "green" },
        { node: "sw3", text: "VLAN 30 VOICE", tone: "green" },
      ],
      tables: [recap("1", "1", "1", [0, 1, 2])],
    },
    {
      title: { en: "Run it again: changed=0", hi: "Dobara chalao: changed=0" },
      text: {
        en: "The same playbook runs a second time. Ansible reads the VLANs again, finds VLAN 30 VOICE already on every switch, and sends nothing. changed=0 everywhere: the playbook is idempotent, so it is safe to run every night.",
        hi: "Wahi playbook doosri baar chalti hai. Ansible phir VLANs padhta hai, har switch par VLAN 30 VOICE pehle se paata hai, aur kuch nahi bhejta. Har jagah changed=0: playbook idempotent hai, isliye ise har raat chalana safe hai.",
      },
      packets: [
        { path: ["ansible", "sw1"], label: "read VLANs", tone: "purple" },
        { path: ["ansible", "sw2"], label: "read VLANs", tone: "purple" },
        { path: ["ansible", "sw3"], label: "read VLANs", tone: "purple" },
        { path: ["sw1", "ansible"], label: "30 VOICE", tone: "gray", delay: 1 },
        { path: ["sw2", "ansible"], label: "30 VOICE", tone: "gray", delay: 1 },
        { path: ["sw3", "ansible"], label: "30 VOICE", tone: "gray", delay: 1 },
      ],
      badges: [
        { node: "sw1", text: "ok", tone: "gray" },
        { node: "sw2", text: "ok", tone: "gray" },
        { node: "sw3", text: "ok", tone: "gray" },
      ],
      tables: [recap("0", "0", "0", [0, 1, 2])],
    },
    {
      title: { en: "Drift on SW2, found with --check", hi: "SW2 par drift, --check se pakda" },
      text: {
        en: "Someone renamed VLAN 30 to TEST on SW2 by hand. A run with --check reads all three switches but pushes nothing. SW2 reports name TEST, so the recap shows changed=1 for SW2 only, meaning it would change. SW1 and SW3 still match.",
        hi: "Kisi ne SW2 par haath se VLAN 30 ka naam TEST kar diya. --check wala run teeno switches padhta hai par kuch push nahi karta. SW2 name TEST report karta hai, isliye recap sirf SW2 ke liye changed=1 dikhata hai, matlab yeh badlega. SW1 aur SW3 abhi bhi match karte hain.",
      },
      focus: ["sw2"],
      packets: [
        { path: ["ansible", "sw1"], label: "read VLANs", tone: "purple" },
        { path: ["ansible", "sw2"], label: "read VLANs", tone: "purple" },
        { path: ["ansible", "sw3"], label: "read VLANs", tone: "purple" },
        { path: ["sw1", "ansible"], label: "30 VOICE", tone: "gray", delay: 1 },
        { path: ["sw2", "ansible"], label: "30 TEST", tone: "red", delay: 1 },
        { path: ["sw3", "ansible"], label: "30 VOICE", tone: "gray", delay: 1 },
      ],
      badges: [
        { node: "ansible", text: "--check", tone: "orange" },
        { node: "sw1", text: "ok", tone: "gray" },
        { node: "sw2", text: "VLAN 30 TEST", tone: "red" },
        { node: "sw3", text: "ok", tone: "gray" },
      ],
      tables: [recap("0", "1", "0", [1])],
    },
    {
      title: { en: "A normal run fixes only SW2", hi: "Normal run sirf SW2 ko theek karta hai" },
      text: {
        en: "Without --check, Ansible sends name VOICE to SW2 alone. SW1 and SW3 receive no configuration at all. The playbook in Git is the source of truth, and the hand-made change is gone.",
        hi: "--check ke bina Ansible sirf SW2 ko name VOICE bhejta hai. SW1 aur SW3 ko koi configuration nahi jaati. Git mein rakhi playbook hi source of truth hai, aur haath se kiya gaya change hat gaya.",
      },
      links: [
        { id: "l-sw1", state: "dim" },
        { id: "l-sw3", state: "dim" },
      ],
      packets: [{ path: ["ansible", "sw2"], label: "name VOICE", tone: "green" }],
      badges: [
        { node: "ansible", text: "vlan30.yml", tone: "blue" },
        { node: "sw2", text: "VLAN 30 VOICE", tone: "green" },
      ],
      tables: [recap("0", "1", "0", [1])],
    },
    {
      title: { en: "terraform plan: 2 to add", hi: "terraform plan: 2 to add" },
      text: {
        en: "Now Terraform. main.tf declares a VPC 10.50.0.0/16 and a subnet 10.50.1.0/24. The state file is empty, so Terraform plans to create both: Plan: 2 to add, 0 to change, 0 to destroy. Nothing has been sent to the cloud yet.",
        hi: "Ab Terraform. main.tf ek VPC 10.50.0.0/16 aur ek subnet 10.50.1.0/24 declare karti hai. State file khaali hai, isliye Terraform dono banane ka plan karta hai: Plan: 2 to add, 0 to change, 0 to destroy. Cloud ko abhi tak kuch nahi bheja gaya.",
      },
      reset: true,
      focus: ["tf"],
      badges: [{ node: "tf", text: "Plan: 2 to add", tone: "blue" }],
      tables: [{ node: "tf", title: "terraform.tfstate", columns: ["Resource", "Real object"], rows: [["(empty)", ""]] }],
    },
    {
      title: { en: "terraform apply: create, then record", hi: "terraform apply: banao, phir record karo" },
      text: {
        en: "After you type yes, Terraform calls the cloud API. The subnet refers to the VPC's ID, so the VPC is created first and its ID comes back; then the subnet. Both IDs are written to terraform.tfstate.",
        hi: "Tum yes type karte ho, phir Terraform cloud API call karta hai. Subnet VPC ki ID ko refer karta hai, isliye pehle VPC banta hai aur uski ID wapas aati hai; phir subnet. Dono IDs terraform.tfstate mein likh di jaati hain.",
      },
      links: [{ id: "l-cloud", state: "active" }],
      packets: [
        { path: ["tf", "cloud"], label: "create VPC", tone: "green" },
        { path: ["cloud", "tf"], label: "vpc-0a1b…", tone: "gray", delay: 1 },
        { path: ["tf", "cloud"], label: "create subnet", tone: "green", delay: 2 },
        { path: ["cloud", "tf"], label: "subnet-0f1e…", tone: "gray", delay: 3 },
      ],
      badges: [
        { node: "tf", text: "2 added", tone: "green" },
        { node: "cloud", text: "10.50.0.0/16", tone: "green" },
      ],
      tables: [
        {
          node: "tf",
          title: "terraform.tfstate",
          columns: ["Resource", "Real object"],
          rows: [
            ["aws_vpc.lab", "vpc-0a1b2c3d4e5f60718"],
            ["aws_subnet.web", "subnet-0f1e2d3c4b5a69788"],
          ],
          hl: [0, 1],
        },
      ],
    },
    {
      title: { en: "Plan again: no changes", hi: "Dobara plan: no changes" },
      text: {
        en: "A second terraform plan reads the two real objects listed in the state and compares them with main.tf. They match, so the answer is No changes. Had someone edited the subnet in the cloud console, this plan would show the drift and offer to put it back.",
        hi: "Doosra terraform plan state mein listed dono asli objects ko padhta hai aur unhe main.tf se compare karta hai. Dono match karte hain, isliye jawab hai No changes. Agar kisi ne cloud console mein subnet edit kiya hota, toh yahi plan drift dikhata aur use wapas theek karne ka offer deta.",
      },
      packets: [
        { path: ["tf", "cloud"], label: "read 2 objects", tone: "purple" },
        { path: ["cloud", "tf"], label: "matches", tone: "gray", delay: 1 },
      ],
      badges: [{ node: "tf", text: "No changes", tone: "gray" }],
    },
  ],
};

export default scene;
