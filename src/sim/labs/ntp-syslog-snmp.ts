import type { CliLab } from "../lab.ts";

const lab: CliLab = {
  id: "ntp-syslog-snmp",
  title: { en: "Hook a router up to NTP, syslog and SNMP", hi: "Router ko NTP, syslog aur SNMP se jodo" },
  level: "beginner",
  kind: "build",
  minutes: 20,
  lessons: ["ntp", "syslog", "snmp"],
  scenario: {
    en: "The NOC is onboarding a new branch router, BR-R1. Their checklist says: correct time from the NTP server, logs sent to the syslog server with useful timestamps, and read-only SNMP so the monitoring system can poll it. The three servers sit on the management LAN 192.168.50.0/24, and BR-R1's Gi0/0 is still unconfigured.",
    hi: "NOC ek naye branch router BR-R1 ko onboard kar raha hai. Unki checklist kehti hai: NTP server se sahi time, logs syslog server par kaam ke timestamps ke saath, aur read-only SNMP taaki monitoring system ise poll kar sake. Teeno servers management LAN 192.168.50.0/24 par hain, aur BR-R1 ka Gi0/0 abhi configure nahi hua hai.",
  },
  height: 416,
  devices: [
    { id: "r1", kind: "router", hostname: "BR-R1", x: 400, y: 70, note: "Gi0/0 192.168.50.1" },
    { id: "sw1", kind: "switch", hostname: "SW1", x: 400, y: 211 },
    { id: "ntp", kind: "server", hostname: "NTP-Server", x: 160, y: 346, host: { ip: "192.168.50.10", prefix: 24, gateway: "192.168.50.1" }, note: "192.168.50.10" },
    { id: "syslog", kind: "server", hostname: "Syslog-Server", x: 400, y: 346, host: { ip: "192.168.50.11", prefix: 24, gateway: "192.168.50.1" }, note: "192.168.50.11" },
    { id: "nms", kind: "server", hostname: "NMS", x: 640, y: 346, host: { ip: "192.168.50.12", prefix: 24, gateway: "192.168.50.1" }, note: "192.168.50.12" },
  ],
  links: [
    ["r1", "GigabitEthernet0/0", "sw1", "GigabitEthernet0/1"],
    ["ntp", "FastEthernet0", "sw1", "FastEthernet0/1"],
    ["syslog", "FastEthernet0", "sw1", "FastEthernet0/2"],
    ["nms", "FastEthernet0", "sw1", "FastEthernet0/3"],
  ],
  tasks: [
    {
      text: {
        en: "Give BR-R1's Gi0/0 the address 192.168.50.1/24 and bring it up. BR-R1 must ping all three servers.",
        hi: "BR-R1 ke Gi0/0 ko address 192.168.50.1/24 do aur use up karo. BR-R1 se teeno servers ping hone chahiye.",
      },
      hint: {
        en: "`interface g0/0`, `ip address 192.168.50.1 255.255.255.0`, `no shutdown`. Then `do ping 192.168.50.10`, `.11` and `.12`.",
        hi: "`interface g0/0` mein `ip address 192.168.50.1 255.255.255.0` aur `no shutdown` do. Phir `do ping 192.168.50.10`, `.11` aur `.12` se check karo.",
      },
      check: [
        { t: "ping", from: "r1", to: "192.168.50.10" },
        { t: "ping", from: "r1", to: "192.168.50.11" },
        { t: "ping", from: "r1", to: "192.168.50.12" },
      ],
    },
    {
      text: { en: "Make BR-R1 take its time from NTP-Server 192.168.50.10.", hi: "BR-R1 ko NTP-Server 192.168.50.10 se time lene do." },
      hint: { en: "`ntp server 192.168.50.10` in global config. Correct time makes log messages from different devices line up.", hi: "Global config mein `ntp server 192.168.50.10` do. Sahi time hone se alag-alag devices ke log messages aapas mein match ho jaate hain." },
      check: { t: "config", dev: "r1", has: "^ntp server 192\\.168\\.50\\.10$" },
    },
    {
      text: {
        en: "Stamp every log message with the date and time to the millisecond, send logs to Syslog-Server 192.168.50.11, and send severity levels 0 to 6 (informational and more severe).",
        hi: "Har log message par date aur time millisecond tak lagao, logs Syslog-Server 192.168.50.11 par bhejo, aur severity level 0 se 6 tak (informational aur usse zyada severe) bhejo.",
      },
      hint: {
        en: "`service timestamps log datetime msec`, `logging host 192.168.50.11`, `logging trap informational`.",
        hi: "`service timestamps log datetime msec`, `logging host 192.168.50.11` aur `logging trap informational` chalao.",
      },
      check: [
        { t: "config", dev: "r1", has: "^service timestamps log datetime msec$" },
        { t: "config", dev: "r1", has: "^logging host 192\\.168\\.50\\.11$" },
        { t: "config", dev: "r1", has: "^logging trap (informational|6)$" },
      ],
    },
    {
      text: {
        en: "Let the NMS poll BR-R1 with the read-only SNMP community NOC-View. Don't create any read-write community.",
        hi: "NMS ko read-only SNMP community NOC-View se BR-R1 ko poll karne do. Koi read-write community mat banao.",
      },
      hint: {
        en: "`snmp-server community NOC-View RO`. RW would let anyone who knows the string change the config.",
        hi: "`snmp-server community NOC-View RO` do. RW dene se jisko bhi string pata hai woh config badal sakta hai.",
      },
      check: [
        { t: "config", dev: "r1", has: "^snmp-server community NOC-View RO$" },
        { t: "config", dev: "r1", has: "^snmp-server community \\S+ RW$", not: true },
      ],
    },
    {
      text: { en: "Save the configuration so it survives a reload.", hi: "Configuration save karo taaki reload ke baad bhi bachi rahe." },
      hint: { en: "`do copy running-config startup-config` from config mode, or `copy running-config startup-config` after `end`.", hi: "Config mode se `do copy running-config startup-config`, ya `end` ke baad `copy running-config startup-config` chalao." },
      check: { t: "saved", dev: "r1" },
    },
  ],
  solution: {
    r1: [
      "interface g0/0",
      "ip address 192.168.50.1 255.255.255.0",
      "no shutdown",
      "exit",
      "ntp server 192.168.50.10",
      "service timestamps log datetime msec",
      "logging host 192.168.50.11",
      "logging trap informational",
      "snmp-server community NOC-View RO",
      "end",
      "copy running-config startup-config",
    ],
  },
  debrief: {
    en: "NTP, syslog and SNMP work as a team: NTP gives every device the same clock, timestamps make the log lines useful, syslog collects them in one place, and SNMP lets the monitoring system read the device. `logging trap informational` sends levels 0-6; debugging (7) stays local. Use RO communities for polling.",
    hi: "NTP, syslog aur SNMP ek team ki tarah kaam karte hain: NTP har device ko same clock deta hai, timestamps log lines ko kaam ka banate hain, syslog unhe ek jagah collect karta hai, aur SNMP se monitoring system device ko padh sakta hai. `logging trap informational` level 0-6 bhejta hai; debugging (7) local hi rehta hai. Polling ke liye RO communities use karo.",
  },
};

export default lab;
