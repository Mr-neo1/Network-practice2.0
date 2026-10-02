import type { TopologyScene } from "../types.ts";

// Same story as the lesson's worked example. R1 Gi0/0/1 is a 100 Mbps WAN link.
// Baseline weekdays 09-18: 50-70 Mbps. Anomaly: 96 Mbps at 11:00 Tuesday, backup server 10.20.0.45 -> data-centre backup store 10.200.0.80:443.
// Colours: teal = telemetry, red = anomaly, orange = alert, pink = generative assistant, blue = config push, green = good result.
const scene: TopologyScene = {
  kind: "topology",
  id: "ai-ml-netops",
  title: { en: "Telemetry to baseline to anomaly, then an AI draft a human approves", hi: "Telemetry se baseline, phir anomaly, phir AI draft jo insaan approve karta hai" },
  height: 480,
  nodes: [
    { id: "sw1", kind: "switch", x: 110, y: 80, label: "SW1", sub: "10.10.0.11" },
    { id: "sw2", kind: "switch", x: 110, y: 230, label: "SW2", sub: "10.10.0.12" },
    { id: "r1", kind: "router", x: 400, y: 80, label: "R1" },
    { id: "wan", kind: "cloud", x: 680, y: 80, label: "WAN", sub: "private WAN" },
    { id: "ctrl", kind: "controller", x: 400, y: 265, label: "Analytics", sub: "10.10.0.60", sub2: "telemetry + ML" },
    { id: "eng", kind: "laptop", x: 150, y: 410, label: "Engineer", sub: "10.10.0.100" },
    { id: "asst", kind: "server", x: 660, y: 330, label: "AI Assistant", sub: "generative (LLM)" },
  ],
  links: [
    { id: "l-sw1", a: "sw1", b: "r1" },
    { id: "l-sw2", a: "sw2", b: "r1" },
    { id: "l-wan", a: "r1", b: "wan", aPort: "Gi0/0/1", label: "100 Mbps" },
    { id: "l-ctrl", a: "r1", b: "ctrl" },
    { id: "l-eng", a: "eng", b: "ctrl" },
    { id: "l-asst", a: "ctrl", b: "asst", label: "HTTPS" },
  ],
  steps: [
    {
      title: { en: "Devices stream telemetry", hi: "Devices telemetry stream karte hain" },
      text: {
        en: "SW1, SW2 and R1 push counters, states and events to the analytics platform without being polled. At 500 devices this is tens of millions of readings a day, far more than a person could watch.",
        hi: "SW1, SW2 aur R1 bina poll hue counters, states aur events analytics platform ko push karte hain. 500 devices par yeh roz karodon readings hain, jitna koi insaan dekh hi nahi sakta.",
      },
      packets: [
        { path: ["sw1", "r1", "ctrl"], label: "Telemetry", tone: "teal" },
        { path: ["sw2", "r1", "ctrl"], label: "Telemetry", tone: "teal" },
        { path: ["r1", "ctrl"], label: "Telemetry", tone: "teal", delay: 1 },
      ],
      tables: [
        {
          node: "ctrl",
          title: "Telemetry received",
          columns: ["Source", "Data", "How often"],
          rows: [["R1", "Gi0/0/1 in/out bps", "every 30 s"], ["SW1", "port counters, CPU", "every 30 s"], ["SW2", "syslog, client stats", "on each event"]],
        },
      ],
    },
    {
      title: { en: "ML learns the baseline", hi: "ML baseline seekhta hai" },
      text: {
        en: "From four weeks of history the model learns what normal is for R1 Gi0/0/1, hour by hour and day by day. Nobody labelled anything: finding the pattern in unlabelled data is unsupervised learning.",
        hi: "Chaar hafton ki history se model seekhta hai ki R1 Gi0/0/1 ke liye normal kya hai, ghante-ghante aur din-din ke hisaab se. Kisi ne kuch label nahi kiya: bina label ke data mein pattern dhoondhna unsupervised learning hai.",
      },
      focus: ["ctrl"],
      badges: [{ node: "ctrl", text: "baseline learned", tone: "purple" }],
      tables: [
        { node: "ctrl", title: "Telemetry received", columns: ["Source", "Data", "How often"], rows: [] },
        {
          node: "ctrl",
          title: "Baseline: R1 Gi0/0/1 out",
          columns: ["When", "Normal range"],
          rows: [["Weekday 09-18", "50-70 Mbps"], ["Weekday 00-06", "5-15 Mbps"], ["Weekend", "10-25 Mbps"]],
          hl: [0, 1, 2],
        },
      ],
    },
    {
      title: { en: "An anomaly on the WAN link", hi: "WAN link par anomaly" },
      text: {
        en: "Tuesday 11:00: R1 reports 96 Mbps out on Gi0/0/1, 96% of the circuit. The normal range for this hour is 50-70 Mbps, so the platform raises an anomaly and says how far from normal the reading is.",
        hi: "Tuesday 11:00: R1 Gi0/0/1 par 96 Mbps out report karta hai, circuit ka 96%. Is ghante ki normal range 50-70 Mbps hai, isliye platform anomaly raise karta hai aur batata hai ki reading normal se kitni door hai.",
      },
      links: [{ id: "l-wan", state: "active", note: "96 Mbps" }],
      packets: [{ path: ["r1", "ctrl"], label: "96 Mbps out", tone: "red" }],
      badges: [
        { node: "ctrl", text: "" },
        { node: "r1", text: "anomaly", tone: "red" },
      ],
      tables: [
        {
          node: "ctrl",
          title: "Baseline: R1 Gi0/0/1 out",
          columns: ["When", "Normal range"],
          rows: [["Weekday 09-18", "50-70 Mbps"], ["Weekday 00-06", "5-15 Mbps"], ["Weekend", "10-25 Mbps"], ["Tue 11:00 (now)", "96 Mbps: anomaly"]],
          hl: [3],
        },
      ],
    },
    {
      title: { en: "Likely cause and a forecast", hi: "Likely cause aur ek forecast" },
      text: {
        en: "Flow data shows the top talker: backup server 10.20.0.45 sending to the data centre at 10.200.0.80 on TCP 443 since 10:58. Separately, the weekday peak has grown about 4% a week, so even normal traffic reaches 90% in about 6 weeks. The platform alerts the engineer.",
        hi: "Flow data top talker dikhata hai: backup server 10.20.0.45 10:58 se data centre mein 10.200.0.80 ko TCP 443 par bhej raha hai. Alag se, weekday peak har hafte lagbhag 4% badha hai, toh normal traffic bhi lagbhag 6 hafton mein 90% tak pahunch jaayega. Platform engineer ko alert karta hai.",
      },
      packets: [{ path: ["ctrl", "eng"], label: "Alert", tone: "orange" }],
      badges: [{ node: "ctrl", text: "forecast: 90% in ~6 wk", tone: "orange" }],
      tables: [
        { node: "ctrl", title: "Baseline: R1 Gi0/0/1 out", columns: ["When", "Normal range"], rows: [] },
        {
          node: "ctrl",
          title: "Analysis",
          columns: ["Finding", "Detail"],
          rows: [["Top talker", "10.20.0.45 to 10.200.0.80:443"], ["Likely cause", "backup job started 10:58"], ["Forecast", "peak +4%/week, 90% in ~6 weeks"]],
          hl: [0, 1, 2],
        },
      ],
    },
    {
      title: { en: "The engineer asks the assistant", hi: "Engineer assistant se poochta hai" },
      text: {
        en: "In plain language the engineer asks the generative assistant: \"Why is R1 Gi0/0/1 near 100%, and how can I protect business traffic right now?\" The question and the analysis go to the assistant over HTTPS.",
        hi: "Engineer simple language mein generative assistant se poochta hai: \"R1 Gi0/0/1 100% ke paas kyun hai, aur abhi business traffic ko kaise protect karoon?\" Sawaal aur analysis HTTPS par assistant tak jaate hain.",
      },
      focus: ["eng", "asst"],
      packets: [{ path: ["eng", "ctrl", "asst"], label: "Question", tone: "pink" }],
    },
    {
      title: { en: "A useful draft with one invented line", hi: "Kaam ka draft, ek banayi hui line ke saath" },
      text: {
        en: "The assistant summarises the cause correctly and drafts a QoS policy that polices the backup flow to 20 Mbps. Reviewing it line by line, the engineer finds `qos backup-limit 20`: it looks plausible but is not an IOS command. That is a hallucination.",
        hi: "Assistant cause sahi summarise karta hai aur ek QoS policy draft karta hai jo backup flow ko 20 Mbps par police karti hai. Line by line review karte hue engineer ko `qos backup-limit 20` milta hai: dikhne mein theek lagta hai lekin IOS command nahi hai. Yahi hallucination hai.",
      },
      packets: [{ path: ["asst", "ctrl", "eng"], label: "Summary + draft", tone: "pink" }],
      tables: [
        {
          node: "eng",
          title: "Draft review",
          columns: ["Draft line", "Check"],
          rows: [["class-map match-all BACKUP", "valid"], ["police 20000000", "valid"], ["qos backup-limit 20", "not an IOS command"], ["service-policy output WAN-OUT", "valid"]],
          hl: [2],
        },
      ],
    },
    {
      title: { en: "Human review and change control", hi: "Insaani review aur change control" },
      text: {
        en: "The engineer deletes the invented line, tests the policy on a lab router, and raises change CHG-1042 with a written rollback. A peer reviews it and it is approved as an urgent change. The AI drafted; people verified and decided.",
        hi: "Engineer banayi hui line delete karta hai, policy ko lab router par test karta hai, aur likhe hue rollback ke saath change CHG-1042 raise karta hai. Ek peer review karta hai aur ise urgent change ke roop mein approve kiya jaata hai. AI ne draft kiya; verify aur decide insaanon ne kiya.",
      },
      focus: ["eng"],
      badges: [{ node: "eng", text: "CHG-1042 approved", tone: "green" }],
      tables: [
        { node: "eng", title: "Draft review", columns: ["Draft line", "Check"], rows: [] },
        {
          node: "eng",
          title: "CHG-1042",
          columns: ["Step", "Status"],
          rows: [["Invented line removed", "done"], ["Lab test", "pass"], ["Peer review", "approved"], ["Rollback", "no service-policy output WAN-OUT"]],
          hl: [0, 1, 2, 3],
        },
      ],
    },
    {
      title: { en: "Pushed through the controller", hi: "Controller ke through push" },
      text: {
        en: "The approved config goes from the engineer through the platform to R1 and is applied outbound on Gi0/0/1. The ACL matches only the backup flow, so business traffic is not policed.",
        hi: "Approved config engineer se platform ke through R1 tak jaata hai aur Gi0/0/1 par outbound apply hota hai. ACL sirf backup flow ko match karta hai, isliye business traffic police nahi hota.",
      },
      packets: [{ path: ["eng", "ctrl", "r1"], label: "Push WAN-OUT", tone: "blue" }],
      badges: [
        { node: "eng", text: "" },
        { node: "r1", text: "WAN-OUT applied", tone: "blue" },
      ],
    },
    {
      title: { en: "Post-check: back inside the baseline", hi: "Post-check: wapas baseline ke andar" },
      text: {
        en: "New telemetry shows the backup flow held near 20 Mbps and the link at 68 Mbps, inside the 50-70 Mbps baseline. The anomaly closes. The forecast does not: growth still fills the link in about 6 weeks, so the engineer opens a request for a bigger circuit.",
        hi: "Nayi telemetry dikhati hai ki backup flow lagbhag 20 Mbps par ruka hai aur link 68 Mbps par hai, 50-70 Mbps baseline ke andar. Anomaly close ho jaati hai. Forecast nahi: growth abhi bhi lagbhag 6 hafton mein link bhar degi, isliye engineer bade circuit ki request kholta hai.",
      },
      links: [{ id: "l-wan", state: "normal", note: "68 Mbps" }],
      packets: [{ path: ["r1", "ctrl"], label: "68 Mbps out", tone: "green" }],
      badges: [
        { node: "r1", text: "within baseline", tone: "green" },
        { node: "ctrl", text: "forecast: 90% in ~6 wk", tone: "orange" },
      ],
      tables: [
        { node: "eng", title: "CHG-1042", columns: ["Step", "Status"], rows: [] },
        {
          node: "ctrl",
          title: "Analysis",
          columns: ["Finding", "Detail"],
          rows: [["Anomaly", "closed: 68 Mbps at 11:30"], ["Backup flow", "policed to ~20 Mbps"], ["Forecast", "still 90% in ~6 weeks: upgrade"]],
          hl: [0, 1],
        },
      ],
    },
  ],
};

export default scene;
