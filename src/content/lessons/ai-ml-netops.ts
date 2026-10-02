import type { Lesson } from "../types.ts";

const lesson: Lesson = {
  slug: "ai-ml-netops",
  intro: {
    en: "A network of 500 devices produces tens of millions of counter readings, log lines and flow records every day, far more than any team can read. Fixed alarm thresholds either fire all night or stay silent while something odd happens. AI tools help in two different ways: predictive AI learns what normal looks like and warns you about what is not, and generative AI answers questions in plain language and drafts configs and reports. CCNA v1.1 (topic 6.4) expects you to tell the two apart, know the basic kinds of machine learning, and understand why an engineer still checks and approves every change.",
    hi: "500 devices wala network roz karodon counter readings, log lines aur flow records banata hai, jitna koi team padh hi nahi sakti. Fixed alarm thresholds ya toh raat bhar bajte rehte hain ya chup rehte hain jab kuch ajeeb ho raha ho. AI tools do alag tareekon se madad karte hain: predictive AI seekhta hai ki normal kaisa dikhta hai aur jo normal nahi hai uski warning deta hai, aur generative AI simple language mein sawaalon ke jawab deta hai aur configs aur reports draft karta hai. CCNA v1.1 (topic 6.4) expect karta hai ki tum dono mein fark bata sako, machine learning ke basic types jaano, aur samjho ki engineer ab bhi har change check aur approve kyun karta hai.",
  },
  outcomes: [
    { en: "Explain the difference between AI and machine learning", hi: "AI aur machine learning ka fark samjha sako" },
    { en: "Compare predictive AI (baselines, anomalies, forecasts, root cause) with generative AI (questions, drafts, summaries)", hi: "Predictive AI (baselines, anomalies, forecasts, root cause) ko generative AI (questions, drafts, summaries) se compare kar sako" },
    { en: "Identify supervised, unsupervised and reinforcement learning from a description", hi: "Description se supervised, unsupervised aur reinforcement learning pehchaan sako" },
    { en: "Explain why a learned baseline catches problems a fixed threshold misses", hi: "Samjha sako ki learned baseline woh problems kyun pakadti hai jo fixed threshold miss kar deta hai" },
    { en: "Review AI-generated output and push it safely through change control", hi: "AI-generated output review kar sako aur use change control ke through safely push kar sako" },
  ],
  sections: [
    {
      id: "the-data-problem",
      heading: { en: "Too much data for humans", hi: "Insaanon ke liye bahut zyada data" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Take 500 switches with 48 ports each, reporting interface counters every 30 seconds. That is 24,000 interfaces × 2,880 readings a day: about **69 million** readings, before you add syslog (lesson 4.6), SNMP traps (lesson 4.5), wireless client data and flow records. Devices increasingly **stream** this data as **telemetry** to a collector instead of waiting to be polled.",
            hi: "500 switches lo, har ek mein 48 ports, jo har 30 seconds mein interface counters report karte hain. Yeh 24,000 interfaces × din ki 2,880 readings hain: lagbhag **69 million** readings, aur abhi syslog (lesson 4.6), SNMP traps (lesson 4.5), wireless client data aur flow records judne baaki hain. Devices aajkal yeh data **telemetry** ke roop mein collector ko **stream** karte hain, poll hone ka wait nahi karte.",
          },
        },
        {
          type: "p",
          text: {
            en: "The classic answer is a fixed threshold: alert when a link passes 80%. It fails both ways. A link that carries a planned backup at 85% every night alerts every night, so people learn to ignore it. A link that normally carries 5% at 03:00 and suddenly carries 60% never alerts, even though something is clearly wrong.",
            hi: "Purana jawab hai fixed threshold: link 80% cross kare toh alert. Yeh dono taraf fail hota hai. Jis link par har raat planned backup 85% par chalta hai, woh har raat alert deta hai, toh log use ignore karna seekh jaate hain. Jo link 03:00 baje normally 5% le jaata hai aur achanak 60% le jaane lage, woh kabhi alert nahi deta, jabki kuch saaf galat hai.",
          },
        },
      ],
    },
    {
      id: "ai-and-ml",
      heading: { en: "AI, machine learning and how machines learn", hi: "AI, machine learning aur machines kaise seekhti hain" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**Artificial intelligence (AI)** is the broad field: systems that do tasks we would normally say need human judgement, such as spotting a problem or answering a question.",
              hi: "**Artificial intelligence (AI)** poora field hai: aise systems jo woh kaam karte hain jinke liye normally insaani judgement chahiye, jaise problem pakadna ya sawaal ka jawab dena.",
            },
            {
              en: "**Machine learning (ML)** is a subset of AI. Instead of following rules a programmer wrote, an ML model learns patterns from data. Most AI built into current network tools uses ML, including the large language models behind generative AI.",
              hi: "**Machine learning (ML)** AI ka ek subset hai. Programmer ke likhe rules follow karne ki jagah ML model data se patterns seekhta hai. Aaj network tools ka zyada tar AI ML se hi bana hai, generative AI ke peeche wale large language models bhi.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Three ways a model learns", hi: "Model seekhne ke teen tareeke" },
          columns: [{ en: "Type", hi: "Type" }, { en: "How it learns", hi: "Kaise seekhta hai" }, { en: "Network example", hi: "Network example" }],
          rows: [
            [
              { en: "Supervised", hi: "Supervised" },
              { en: "From labelled examples: input plus the right answer", hi: "Labelled examples se: input aur saath mein sahi answer" },
              { en: "Trained on thousands of past incidents, each labelled with its root cause, it classifies a new event as \"failing optic\"", hi: "Hazaaron purane incidents par trained, har ek par root cause ka label, naye event ko \"failing optic\" classify karta hai" },
            ],
            [
              { en: "Unsupervised", hi: "Unsupervised" },
              { en: "From unlabelled data: finds structure, groups and outliers by itself", hi: "Bina label ke data se: structure, groups aur outliers khud dhoondhta hai" },
              { en: "Learns each link's normal traffic pattern and flags readings that do not fit", hi: "Har link ka normal traffic pattern seekhta hai aur jo readings fit nahi hoti unhe flag karta hai" },
            ],
            [
              { en: "Reinforcement", hi: "Reinforcement" },
              { en: "By trial and feedback: an agent acts, gets a reward or penalty, and adjusts", hi: "Trial aur feedback se: agent action leta hai, reward ya penalty milti hai, aur woh adjust karta hai" },
              { en: "An agent tries path choices and is rewarded when measured latency drops", hi: "Agent path choices try karta hai aur measured latency kam hone par reward milta hai" },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Labels mean **supervised**. No labels, find the pattern or the outlier: **unsupervised**. Reward and penalty from trying actions: **reinforcement**. The exam stays at this level; you do not need the maths.",
            hi: "Labels hain toh **supervised**. Labels nahi, pattern ya outlier dhoondhna hai: **unsupervised**. Actions try karke reward aur penalty: **reinforcement**. Exam isi level par rehta hai; maths ki zaroorat nahi.",
          },
        },
      ],
    },
    {
      id: "predictive-ai",
      heading: { en: "Predictive AI: baselines, anomalies and forecasts", hi: "Predictive AI: baselines, anomalies aur forecasts" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Predictive AI** analyses telemetry to describe what is normal, spot what is not, and estimate what will happen next. Its output is an alert, a score or a forecast, not new text.",
            hi: "**Predictive AI** telemetry analyse karke batata hai kya normal hai, kya normal nahi hai, aur aage kya hone wala hai. Iska output alert, score ya forecast hota hai, naya text nahi.",
          },
        },
        {
          type: "list",
          items: [
            {
              en: "**Baseline**: R1's WAN link Gi0/0/1 (100 Mbps) normally sends 50-70 Mbps on weekdays between 09:00 and 18:00, and 5-15 Mbps at night. The model learns this per link, per hour and per day of the week from weeks of history.",
              hi: "**Baseline**: R1 ka WAN link Gi0/0/1 (100 Mbps) weekdays mein 09:00 se 18:00 tak normally 50-70 Mbps bhejta hai, aur raat ko 5-15 Mbps. Model yeh hafton ki history se har link, har ghante aur hafte ke har din ke liye seekhta hai.",
            },
            {
              en: "**Anomaly detection**: 96 Mbps at 11:00 on a Tuesday is far outside that range, so it is flagged. So is 60 Mbps at 03:00, which a fixed 80% threshold would miss.",
              hi: "**Anomaly detection**: Tuesday ko 11:00 baje 96 Mbps us range se bahut bahar hai, isliye flag hota hai. 03:00 baje 60 Mbps bhi flag hota hai, jise fixed 80% threshold miss kar deta.",
            },
            {
              en: "**Forecasting**: the weekday peak is growing about 4% a week. From 70 Mbps that reaches 90 Mbps in about 6 weeks, early enough to order a bigger circuit.",
              hi: "**Forecasting**: weekday peak har hafte lagbhag 4% badh raha hai. 70 Mbps se yeh lagbhag 6 hafton mein 90 Mbps tak pahunch jaayega, itna pehle ki bada circuit order kiya ja sake.",
            },
            {
              en: "**Failure prediction**: CRC errors creeping up on one port, an optic's receive power slowly falling, or memory use climbing a little every day all point to a failure before it happens.",
              hi: "**Failure prediction**: ek port par CRC errors dheere-dheere badhna, optic ki receive power dheere-dheere girna, ya memory use roz thoda badhna, yeh sab failure hone se pehle uski taraf ishara karte hain.",
            },
            {
              en: "**Root-cause suggestions**: 60 alarms at 09:14 (APs down, OSPF neighbour down, interfaces down) are grouped into one event with a likely cause: the distribution switch uplink that failed first.",
              hi: "**Root-cause suggestions**: 09:14 par 60 alarms (APs down, OSPF neighbour down, interfaces down) ek event mein group ho jaate hain, saath mein likely cause: distribution switch ka uplink jo sabse pehle fail hua.",
            },
          ],
        },
        {
          type: "table",
          caption: { en: "Fixed threshold vs learned baseline on three links", hi: "Teen links par fixed threshold vs learned baseline" },
          columns: [{ en: "Situation", hi: "Situation" }, { en: "Fixed 80% threshold", hi: "Fixed 80% threshold" }, { en: "Learned baseline", hi: "Learned baseline" }],
          rows: [
            [{ en: "Link A: planned backup, 85% every night", hi: "Link A: planned backup, har raat 85%" }, { en: "Alerts every night (noise)", hi: "Har raat alert (noise)" }, { en: "Normal for that hour: no alert", hi: "Us ghante ke liye normal: koi alert nahi" }],
            [{ en: "Link B: 60% at 03:00, normally 5%", hi: "Link B: 03:00 par 60%, normally 5%" }, { en: "Silent", hi: "Chup" }, { en: "Anomaly", hi: "Anomaly" }],
            [{ en: "R1 Gi0/0/1: 96% at 11:00 on a weekday, normally 50-70%", hi: "R1 Gi0/0/1: weekday par 11:00 baje 96%, normally 50-70%" }, { en: "Alert", hi: "Alert" }, { en: "Anomaly, with how far from normal and the top talker", hi: "Anomaly, saath mein normal se kitna door aur top talker" }],
          ],
        },
      ],
    },
    {
      id: "generative-ai",
      heading: { en: "Generative AI: questions, drafts and summaries", hi: "Generative AI: questions, drafts aur summaries" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**Generative AI** creates new content: text, config, code. Its core is a **large language model (LLM)** trained on huge amounts of text. In operations it is used to:",
            hi: "**Generative AI** naya content banata hai: text, config, code. Iske core mein ek **large language model (LLM)** hota hai jo bahut zyada text par trained hai. Operations mein iska use hota hai:",
          },
        },
        {
          type: "list",
          items: [
            { en: "Answer natural-language questions about the network, such as \"Which APs had the most client join failures yesterday?\"", hi: "Network ke baare mein simple language ke sawaalon ka jawab dena, jaise \"Kal kin APs par sabse zyada client join failures hue?\"" },
            { en: "Draft configuration: an ACL, a QoS policy, interface descriptions for a new floor", hi: "Configuration draft karna: ACL, QoS policy, naye floor ke liye interface descriptions" },
            { en: "Summarise 2,000 syslog lines into what happened, in order", hi: "2,000 syslog lines ko summarise karna ki kya hua, kis order mein" },
            { en: "Write documentation and explain unfamiliar `show` output", hi: "Documentation likhna aur anjaan `show` output samjhana" },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "It can be confidently wrong", hi: "Yeh poore confidence se galat ho sakta hai" },
          text: {
            en: "An LLM predicts likely text; it does not check facts. It can **hallucinate**: invent a command that does not exist, use syntax from another platform or release, or describe your network wrongly because it has never seen it. Never paste passwords, keys or full configs into a public AI tool either; follow your company's data rules.",
            hi: "LLM likely text predict karta hai; facts check nahi karta. Yeh **hallucinate** kar sakta hai: aisi command bana deta hai jo exist hi nahi karti, doosre platform ya release ka syntax use karta hai, ya tumhare network ko galat describe karta hai kyunki usne use kabhi dekha hi nahi. Kisi public AI tool mein passwords, keys ya poore configs bhi kabhi paste mat karo; company ke data rules follow karo.",
          },
        },
        {
          type: "table",
          caption: { en: "Predictive vs generative at a glance", hi: "Predictive vs generative ek nazar mein" },
          columns: ["", { en: "Predictive AI", hi: "Predictive AI" }, { en: "Generative AI", hi: "Generative AI" }],
          rows: [
            [{ en: "Input", hi: "Input" }, { en: "Telemetry, logs, flows", hi: "Telemetry, logs, flows" }, { en: "A prompt in plain language, plus any data you give it", hi: "Simple language mein prompt, aur jo data tum do" }],
            [{ en: "Output", hi: "Output" }, { en: "Anomaly, forecast, likely root cause", hi: "Anomaly, forecast, likely root cause" }, { en: "New text: answers, configs, summaries", hi: "Naya text: answers, configs, summaries" }],
            [{ en: "Typical risk", hi: "Typical risk" }, { en: "False alarms, missed events if data is poor", hi: "Data kharab ho toh false alarms ya missed events" }, { en: "Fluent but invented answers", hi: "Fluent lekin banaye hue answers" }],
          ],
        },
      ],
    },
    {
      id: "data-quality",
      heading: { en: "Data quality decides the result", hi: "Data quality hi result decide karti hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A model is only as good as the data it learned from. Problems you can cause, and prevent, as a network engineer:",
            hi: "Model utna hi accha hai jitna woh data jisse usne seekha. Kuch problems jo network engineer ke roop mein tum paida bhi kar sakte ho aur rok bhi sakte ho:",
          },
        },
        {
          type: "list",
          items: [
            { en: "**Wrong clocks**: if switches are not synced by NTP (lesson 4.4), events cannot be put in order and root-cause correlation points at the wrong device.", hi: "**Galat clocks**: agar switches NTP (lesson 4.4) se synced nahi hain, toh events ko order mein nahi rakha ja sakta aur root-cause correlation galat device ki taraf ishara karta hai." },
            { en: "**Gaps**: devices not sending telemetry are invisible, so their problems never become anomalies.", hi: "**Gaps**: jo devices telemetry nahi bhejte woh invisible hain, toh unki problems kabhi anomaly nahi banti." },
            { en: "**A bad baseline**: if the model learned during a month with a broken link, it treats broken as normal.", hi: "**Kharab baseline**: agar model ne us mahine seekha jab ek link toota hua tha, toh woh toote hue ko normal maanta hai." },
            { en: "**Wrong labels**: incidents closed with the wrong root cause teach a supervised model the wrong answer.", hi: "**Galat labels**: galat root cause ke saath close kiye gaye incidents supervised model ko galat answer sikhate hain." },
          ],
        },
      ],
    },
    {
      id: "worked-example",
      heading: { en: "From anomaly to change: a worked example", hi: "Anomaly se change tak: ek worked example" },
      blocks: [
        {
          type: "steps",
          items: [
            {
              en: "The analytics platform flags R1 Gi0/0/1 at 96 Mbps outbound at 11:00 on Tuesday, outside its 50-70 Mbps baseline. Top talker: backup server `10.20.0.45` to `10.200.0.80` on TCP 443, an offsite backup job to the data centre that started at 10:58.",
              hi: "Analytics platform Tuesday 11:00 baje R1 Gi0/0/1 ko 96 Mbps outbound par flag karta hai, jo 50-70 Mbps baseline se bahar hai. Top talker: backup server `10.20.0.45` se `10.200.0.80` par TCP 443, data centre ko jaane wala ek offsite backup job jo 10:58 par shuru hua.",
            },
            {
              en: "The engineer confirms on the device before trusting the dashboard.",
              hi: "Dashboard par bharosa karne se pehle engineer device par confirm karta hai.",
            },
            {
              en: "The engineer asks the generative assistant: \"Why is R1 Gi0/0/1 near 100% and how can I protect business traffic right now?\" It summarises the cause correctly and drafts a QoS policy that polices the backup flow to 20 Mbps.",
              hi: "Engineer generative assistant se poochta hai: \"R1 Gi0/0/1 100% ke paas kyun hai aur abhi business traffic ko kaise protect karoon?\" Woh cause sahi summarise karta hai aur ek QoS policy draft karta hai jo backup flow ko 20 Mbps par police karti hai.",
            },
            {
              en: "Reviewing the draft line by line, the engineer finds one line that is not an IOS command at all, removes it, and tests the rest on a lab router.",
              hi: "Draft ko line by line review karte hue engineer ko ek line milti hai jo IOS command hai hi nahi; woh use hata deta hai aur baaki ko lab router par test karta hai.",
            },
            {
              en: "The change goes through change control: ticket, peer review, approval and a written rollback (`no service-policy output WAN-OUT`). Then it is pushed and checked.",
              hi: "Change, change control se guzarta hai: ticket, peer review, approval aur likha hua rollback (`no service-policy output WAN-OUT`). Phir push aur check hota hai.",
            },
          ],
        },
        {
          type: "cli",
          title: { en: "Step 2: confirm on the device", hi: "Step 2: device par confirm karo" },
          lines: [
            { prompt: "R1#", cmd: "show interfaces GigabitEthernet0/0/1 | include rate" },
            { out: "  5 minute input rate 12483000 bits/sec, 2310 packets/sec\n  5 minute output rate 95318000 bits/sec, 8122 packets/sec" },
          ],
        },
        {
          type: "code",
          lang: "text",
          title: { en: "The assistant's draft, with the reviewer's mark", hi: "Assistant ka draft, reviewer ke mark ke saath" },
          code: "ip access-list extended BACKUP\n permit tcp host 10.20.0.45 host 10.200.0.80 eq 443\n!\nclass-map match-all BACKUP\n match access-group name BACKUP\n!\npolicy-map WAN-OUT\n class BACKUP\n  police 20000000\n qos backup-limit 20        <-- REVIEW: not an IOS command, invented. Removed.\n!\ninterface GigabitEthernet0/0/1\n service-policy output WAN-OUT",
        },
        {
          type: "cli",
          title: { en: "Post-check after the push (shortened)", hi: "Push ke baad post-check (chhota kiya hua)" },
          lines: [
            { prompt: "R1#", cmd: "show policy-map interface GigabitEthernet0/0/1 output" },
            { out: " GigabitEthernet0/0/1\n  Service-policy output: WAN-OUT\n    Class-map: BACKUP (match-all)\n      30 second offered rate 21843000 bps, drop rate 1786000 bps\n      Match: access-group name BACKUP\n      police:\n          cir 20000000 bps, bc 625000 bytes" },
            { comment: { en: "Backup traffic is now held near 20 Mbps; the excess is dropped and TCP slows down", hi: "Backup traffic ab lagbhag 20 Mbps par ruka hai; extra drop hota hai aur TCP slow ho jaata hai" } },
          ],
          note: {
            en: "QoS policing was covered in lesson 4.9. The point here is the process: the AI found and explained the problem, but a human verified, corrected, approved and checked the fix.",
            hi: "QoS policing lesson 4.9 mein cover hua tha. Yahan point process hai: AI ne problem dhoondhi aur samjhayi, lekin fix ko insaan ne verify, correct, approve aur check kiya.",
          },
        },
      ],
    },
    {
      id: "humans-in-the-loop",
      heading: { en: "Why humans stay in the loop", hi: "Insaan loop mein kyun rehta hai" },
      blocks: [
        {
          type: "list",
          items: [
            { en: "**Accountability**: the engineer and the change board own the outage if a change breaks the network, not the model.", hi: "**Accountability**: change se network toote toh outage ki zimmedari engineer aur change board ki hai, model ki nahi." },
            { en: "**Context**: the AI does not know the CEO's video call starts at 11:30 or that this backup is legally required tonight.", hi: "**Context**: AI ko nahi pata ki CEO ki video call 11:30 par hai, ya yeh backup aaj raat legally zaroori hai." },
            { en: "**Validation**: check commands against Cisco documentation for your platform and release, test in a lab, and read the diff before it is pushed.", hi: "**Validation**: commands ko apne platform aur release ke Cisco documentation se check karo, lab mein test karo, aur push se pehle diff padho." },
            { en: "**Change control**: AI-drafted changes follow the same ticket, review, approval, rollback plan and post-check as any other change.", hi: "**Change control**: AI ke draft kiye changes bhi wahi ticket, review, approval, rollback plan aur post-check follow karte hain jo baaki changes." },
          ],
        },
        {
          type: "p",
          text: {
            en: "In Cisco's tools, Catalyst Center Assurance (with its AI Network Analytics feature) uses ML-based baselines to flag issues and suggest causes, and Cisco has added an AI Assistant that accepts natural-language questions to several of its management platforms. Product names, features and licences change often, so learn the concepts rather than a product menu.",
            hi: "Cisco ke tools mein Catalyst Center Assurance (apne AI Network Analytics feature ke saath) ML-based baselines se issues flag karta hai aur causes suggest karta hai, aur Cisco ne apne kai management platforms mein ek AI Assistant joda hai jo simple language ke sawaal leta hai. Product names, features aur licences aksar badalte hain, isliye product menu ki jagah concepts seekho.",
          },
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Predictive AI: learns from historical and live data to detect anomalies and forecast. Generative AI: produces new content such as configs, answers and summaries. Either way, its output is reviewed by a person before it changes the network.",
            hi: "Predictive AI: historical aur live data se seekh kar anomalies detect aur forecast karta hai. Generative AI: configs, answers aur summaries jaisa naya content banata hai. Dono case mein network badalne se pehle uska output ek insaan review karta hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Machine learning (ML)", def: { en: "A subset of AI in which a model learns patterns from data instead of following hand-written rules.", hi: "AI ka subset jisme model hand-written rules ki jagah data se patterns seekhta hai." } },
    { term: "Predictive AI", def: { en: "AI that analyses data to detect anomalies, forecast trends and suggest likely causes.", hi: "AI jo data analyse karke anomalies detect karta hai, trends forecast karta hai aur likely causes suggest karta hai." } },
    { term: "Generative AI", def: { en: "AI that creates new content, such as text, configuration or code, from a prompt.", hi: "AI jo prompt se naya content banata hai, jaise text, configuration ya code." } },
    { term: "Baseline", def: { en: "The learned normal range of a metric, often per hour and per day of the week.", hi: "Kisi metric ki seekhi hui normal range, aksar har ghante aur hafte ke har din ke hisaab se." } },
    { term: "Telemetry", def: { en: "Operational data such as counters and states that devices stream to a collector.", hi: "Counters aur states jaisa operational data jo devices collector ko stream karte hain." } },
    { term: "Hallucination", def: { en: "Output from a generative model that sounds right but is invented or false.", hi: "Generative model ka aisa output jo sahi lagta hai lekin banaya hua ya galat hai." } },
    { term: "Supervised learning", def: { en: "Training a model on examples that are labelled with the correct answer.", hi: "Model ko aise examples par train karna jin par sahi answer ka label laga ho." } },
    { term: "Unsupervised learning", def: { en: "Finding patterns, groups or outliers in data that has no labels.", hi: "Bina labels wale data mein patterns, groups ya outliers dhoondhna." } },
  ],
  commands: [
    { cmd: "show interfaces GigabitEthernet0/0/1 | include rate", mode: "Cisco privileged EXEC", does: { en: "Show the interface's 5-minute input and output rates", hi: "Interface ke 5-minute input aur output rates dikhata hai" } },
    { cmd: "ip access-list extended BACKUP", mode: "Cisco global config", does: { en: "Create a named extended ACL to match the backup flow", hi: "Backup flow match karne ke liye named extended ACL banata hai" } },
    { cmd: "class-map match-all BACKUP", mode: "Cisco global config", does: { en: "Create a class that matches traffic, here by ACL", hi: "Traffic match karne wali class banata hai, yahan ACL se" } },
    { cmd: "policy-map WAN-OUT", mode: "Cisco global config", does: { en: "Create a QoS policy that acts on classes", hi: "Classes par action lene wali QoS policy banata hai" } },
    { cmd: "police 20000000", mode: "Cisco policy-map class config", does: { en: "Limit the class to 20 Mbps; excess is dropped by default", hi: "Class ko 20 Mbps tak limit karta hai; extra by default drop hota hai" } },
    { cmd: "service-policy output WAN-OUT", mode: "Cisco interface config", does: { en: "Apply the policy to outbound traffic on the interface", hi: "Policy ko interface ke outbound traffic par apply karta hai" } },
    { cmd: "show policy-map interface GigabitEthernet0/0/1 output", mode: "Cisco privileged EXEC", does: { en: "Show the policy's counters and policing results", hi: "Policy ke counters aur policing results dikhata hai" } },
  ],
  mistakes: [
    {
      en: "Calling every AI feature \"generative\". Anomaly detection and forecasting from telemetry are predictive AI; generative AI produces new text or config.",
      hi: "Har AI feature ko \"generative\" bolna. Telemetry se anomaly detection aur forecasting predictive AI hai; generative AI naya text ya config banata hai.",
    },
    {
      en: "Pasting an AI-drafted config straight into production. It can contain invented commands or wrong syntax for your release; review, test and use change control.",
      hi: "AI ka draft kiya config seedha production mein paste karna. Usme banayi hui commands ya tumhare release ke liye galat syntax ho sakta hai; review karo, test karo aur change control use karo.",
    },
    {
      en: "Mixing up supervised and unsupervised. Labels mean supervised; finding outliers in unlabelled telemetry is unsupervised.",
      hi: "Supervised aur unsupervised mix karna. Labels hain toh supervised; bina label ki telemetry mein outliers dhoondhna unsupervised hai.",
    },
    {
      en: "Assuming a quiet dashboard means a healthy network. Devices that send no telemetry, or have wrong clocks, are blind spots.",
      hi: "Yeh maan lena ki shaant dashboard matlab healthy network. Jo devices telemetry nahi bhejte, ya jinke clocks galat hain, woh blind spots hain.",
    },
    {
      en: "Thinking AI fixes capacity. It can forecast that a link will fill in 6 weeks; people still have to plan and buy the upgrade.",
      hi: "Yeh sochna ki AI capacity theek kar dega. Woh forecast kar sakta hai ki link 6 hafton mein bhar jaayega; upgrade plan aur purchase insaanon ko hi karna hai.",
    },
  ],
  recap: [
    { en: "AI is the broad field; ML is the subset that learns from data. Generative AI is built on ML too.", hi: "AI poora field hai; ML uska subset hai jo data se seekhta hai. Generative AI bhi ML par bana hai." },
    { en: "Predictive AI: baselines, anomaly detection, forecasting, failure prediction, root-cause suggestions.", hi: "Predictive AI ka kaam: baselines, anomaly detection, forecasting, failure prediction aur root-cause suggestions." },
    { en: "Generative AI: natural-language answers, drafted configs and documentation, log summaries; it can hallucinate.", hi: "Generative AI: simple language mein answers, draft kiye configs aur documentation, log summaries; yeh hallucinate kar sakta hai." },
    { en: "Supervised = labelled data; unsupervised = no labels, find patterns and outliers; reinforcement = reward and penalty.", hi: "Supervised = labelled data; unsupervised = labels nahi, patterns aur outliers dhoondho; reinforcement = reward aur penalty." },
    { en: "Good data (NTP-synced, complete, correctly labelled) and human review with change control are what make AI safe to use.", hi: "Accha data (NTP-synced, complete, sahi labelled) aur change control ke saath insaani review hi AI ko safe banate hain." },
  ],
  quiz: [
    {
      q: { en: "Which task is an example of predictive AI?", hi: "Kaunsa task predictive AI ka example hai?" },
      options: [
        { en: "Writing interface descriptions for a new floor from a short request", hi: "Chhoti si request se naye floor ke liye interface descriptions likhna" },
        { en: "Summarising last night's syslog into a paragraph", hi: "Kal raat ke syslog ko ek paragraph mein summarise karna" },
        { en: "Answering \"how do I configure HSRP?\" in plain language", hi: "\"HSRP kaise configure karoon?\" ka simple language mein jawab dena" },
        { en: "Learning each link's normal traffic per hour and flagging readings outside it", hi: "Har link ka har ghante ka normal traffic seekhna aur usse bahar ki readings flag karna" },
      ],
      answer: 3,
      explain: {
        en: "Building a baseline from telemetry and detecting deviations is predictive AI. The other three all generate new text, which is generative AI.",
        hi: "Telemetry se baseline banana aur deviations detect karna predictive AI hai. Baaki teeno naya text generate karte hain, jo generative AI hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An engineer types \"Create an ACL that blocks Telnet from the guest subnet 10.30.0.0/24\" and receives a complete ACL. What kind of AI is this?",
        hi: "Engineer type karta hai \"Guest subnet 10.30.0.0/24 se Telnet block karne wala ACL banao\" aur use poora ACL mil jaata hai. Yeh kaunsa AI hai?",
      },
      options: [
        { en: "Generative AI", hi: "Generative AI" },
        { en: "Predictive AI", hi: "Predictive AI" },
        { en: "Unsupervised anomaly detection", hi: "Unsupervised anomaly detection" },
        { en: "Reinforcement learning", hi: "Reinforcement learning" },
      ],
      answer: 0,
      explain: {
        en: "A natural-language prompt producing new configuration is generative AI. The engineer must still check the ACL (wildcard mask, direction, the implicit deny) before using it.",
        hi: "Simple language ke prompt se naya configuration banna generative AI hai. Use karne se pehle engineer ko ACL (wildcard mask, direction, implicit deny) phir bhi check karna hoga.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A model is trained on 20,000 past incidents, each tagged with its confirmed root cause, and then classifies new incidents. Which type of learning is this?",
        hi: "Ek model 20,000 purane incidents par train hota hai, har ek par confirmed root cause ka tag hai, aur phir naye incidents classify karta hai. Yeh kaunsi learning hai?",
      },
      options: [
        { en: "Unsupervised learning", hi: "Unsupervised learning" },
        { en: "Supervised learning", hi: "Supervised learning" },
        { en: "Reinforcement learning", hi: "Reinforcement learning" },
        { en: "Generative learning", hi: "Generative learning" },
      ],
      answer: 1,
      explain: {
        en: "Each example comes with the right answer (a label), so this is supervised learning. Unsupervised learning has no labels, and reinforcement learning learns from rewards after taking actions.",
        hi: "Har example ke saath sahi answer (label) hai, isliye yeh supervised learning hai. Unsupervised mein labels nahi hote, aur reinforcement learning actions lene ke baad rewards se seekhta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An AI assistant drafts a QoS change for R1. One line, `qos backup-limit 20`, does not appear in any Cisco documentation. What should the engineer do?",
        hi: "AI assistant R1 ke liye QoS change draft karta hai. Ek line, `qos backup-limit 20`, kisi Cisco documentation mein nahi hai. Engineer ko kya karna chahiye?",
      },
      options: [
        { en: "Push it anyway; IOS will ignore any line it does not understand", hi: "Phir bhi push kar do; IOS jo line nahi samjhega use ignore kar dega" },
        { en: "Ask the assistant to confirm the line exists, then push if it says yes", hi: "Assistant se confirm karwao ki line exist karti hai, haan bole toh push karo" },
        { en: "Treat it as a hallucination: remove or replace it, test the change in a lab, and send it through change control", hi: "Ise hallucination maano: hatao ya replace karo, change ko lab mein test karo, aur change control se bhejo" },
        { en: "Disable QoS on R1 so the line cannot cause problems", hi: "R1 par QoS disable kar do taaki line problem na kare" },
      ],
      answer: 2,
      explain: {
        en: "An invented command is a classic hallucination. Asking the same model to confirm is not verification; it may confidently agree. Check documentation, test, and use normal change control. IOS does reject an unknown line with `% Invalid input detected`, but a pasted or scripted change carries on with the next lines, so you can end up with a half-applied config that nobody reviewed.",
        hi: "Banayi hui command classic hallucination hai. Usi model se confirm karwana verification nahi hai; woh confidently haan bol sakta hai. Documentation check karo, test karo, aur normal change control use karo. IOS unknown line ko `% Invalid input detected` ke saath reject zaroor karta hai, lekin paste ya script se bheja change agli lines par chalta rehta hai, toh aadha-adhoora config lag sakta hai jo kisi ne review hi nahi kiya.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A WAN link normally carries 5% at 03:00. Tonight it carries 60%. The monitoring system alerts only above 80%. What happens, and what would a learned baseline do?",
        hi: "Ek WAN link 03:00 baje normally 5% le jaata hai. Aaj raat 60% le jaa raha hai. Monitoring system sirf 80% se upar alert karta hai. Kya hoga, aur learned baseline kya karegi?",
      },
      options: [
        { en: "Both alert, because 60% is high for any link", hi: "Dono alert karenge, kyunki kisi bhi link ke liye 60% zyada hai" },
        { en: "The threshold stays silent; the baseline flags an anomaly because 60% is far outside normal for 03:00", hi: "Threshold chup rahega; baseline anomaly flag karegi kyunki 03:00 ke liye 60% normal se bahut bahar hai" },
        { en: "Neither alerts, because the link is below 80%", hi: "Koi alert nahi karega, kyunki link 80% se neeche hai" },
        { en: "The threshold alerts; the baseline ignores it because nights are always quiet", hi: "Threshold alert karega; baseline ignore karegi kyunki raatein hamesha shaant hoti hain" },
      ],
      answer: 1,
      explain: {
        en: "A fixed 80% threshold cannot fire at 60%. A baseline compares the reading with what is normal for that link at that hour, so 60% against a usual 5% is a clear anomaly.",
        hi: "Fixed 80% threshold 60% par fire nahi ho sakta. Baseline reading ko us link ke us ghante ke normal se compare karti hai, isliye usual 5% ke against 60% saaf anomaly hai.",
      },
      kind: "scenario",
    },
    {
      q: { en: "Why does NTP matter to an AI platform that suggests root causes?", hi: "Root causes suggest karne wale AI platform ke liye NTP kyun zaroori hai?" },
      options: [
        { en: "NTP encrypts the telemetry stream", hi: "NTP telemetry stream ko encrypt karta hai" },
        { en: "The platform uses NTP to push config to devices", hi: "Platform devices par config push karne ke liye NTP use karta hai" },
        { en: "It correlates events from many devices by time, so wrong clocks put events in the wrong order", hi: "Woh bahut saare devices ke events ko time se correlate karta hai, isliye galat clocks events ko galat order mein rakh dete hain" },
        { en: "Models can only learn from data collected at midnight", hi: "Models sirf midnight par collect hue data se seekh sakte hain" },
      ],
      answer: 2,
      explain: {
        en: "Root-cause analysis asks which event happened first. If one switch's clock is minutes off, its alarms appear before or after the real trigger and the platform blames the wrong device. NTP does not encrypt or push anything.",
        hi: "Root-cause analysis poochta hai ki pehle kaunsa event hua. Agar ek switch ka clock kuch minute aage-peeche hai, toh uske alarms asli trigger se pehle ya baad dikhte hain aur platform galat device ko blame karta hai. NTP na kuch encrypt karta hai na push.",
      },
      kind: "concept",
    },
  ],
  videos: [
    {
      id: "Fn_kAv35W5A",
      title: "AI & Machine Learning | CCNA 200-301 Day 59 (part 2)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "The CCNA v1.1 AI and ML topic: predictive vs generative AI and the types of machine learning.", hi: "CCNA v1.1 ka AI aur ML topic: predictive vs generative AI aur machine learning ke types." },
    },
    {
      id: "AJshu0gZKdw",
      title: "Artificial Intelligence (AI) for Network Operations (a CCNA v1.1 Topic)",
      channel: "Kevin Wallace Training, LLC",
      lang: "en",
      note: { en: "A shorter overview of AI in network operations for the same exam topic.", hi: "Isi exam topic ke liye network operations mein AI ka chhota overview." },
    },
    {
      id: "fzAN2NGvbSo",
      title: "189. CCNA 200-301 Full Course in Hindi 2024 | AI, ML in Network Operations |Predictive&Generative AI",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Predictive and generative AI in network operations, explained in Hindi.", hi: "Network operations mein predictive aur generative AI, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Be the baseline, then review an AI draft", hi: "Khud baseline bano, phir AI draft review karo" },
    steps: [
      { en: "In Packet Tracer or on a lab router, run `show interfaces GigabitEthernet0/0/1` every few minutes while you send traffic between two PCs, and read the `5 minute output rate` line. Write down what \"normal\" looks like.", hi: "Packet Tracer ya lab router par do PCs ke beech traffic bhejte hue har kuch minute mein `show interfaces GigabitEthernet0/0/1` chalao aur `5 minute output rate` wali line padho. Likho ki \"normal\" kaisa dikhta hai." },
      { en: "Start a much heavier flow and note how far the rate moves from your normal. That gap is what an anomaly detector measures.", hi: "Ek bahut heavy flow shuru karo aur note karo rate tumhare normal se kitna door gaya. Yahi gap anomaly detector measure karta hai." },
      { en: "Ask any AI assistant to write a QoS policy that limits traffic from one host to 20 Mbps on a Cisco IOS XE router.", hi: "Kisi bhi AI assistant se Cisco IOS XE router par ek host ka traffic 20 Mbps tak limit karne wali QoS policy likhwao." },
      { en: "Check every line against Cisco documentation for your platform. Mark any line you cannot find, and any wrong direction or interface.", hi: "Har line ko apne platform ke Cisco documentation se check karo. Jo line na mile, aur jahan direction ya interface galat ho, use mark karo." },
      { en: "Apply the corrected policy in the lab only, then verify with `show policy-map interface`. Write the rollback command before you apply it.", hi: "Corrected policy sirf lab mein apply karo, phir `show policy-map interface` se verify karo. Apply karne se pehle rollback command likh lo." },
    ],
  },
};

export default lesson;
