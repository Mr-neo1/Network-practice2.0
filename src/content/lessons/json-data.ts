import type { Lesson } from "../types.ts";

// One example document is used throughout the lesson and the scene: router R1 (an ISR4331)
// with three interfaces. Gi0/0/0 10.1.1.1/24 (LAN), Gi0/0/1 203.0.113.2/30 (ISP), Gi0/0/2 disabled.
const R1_JSON = [
  "{",
  "  \"hostname\": \"R1\",",
  "  \"model\": \"ISR4331\",",
  "  \"uptime_days\": 41,",
  "  \"managed\": true,",
  "  \"location\": null,",
  "  \"interfaces\": [",
  "    {",
  "      \"name\": \"GigabitEthernet0/0/0\",",
  "      \"enabled\": true,",
  "      \"ipv4\": { \"ip\": \"10.1.1.1\", \"mask\": \"255.255.255.0\" }",
  "    },",
  "    {",
  "      \"name\": \"GigabitEthernet0/0/1\",",
  "      \"enabled\": true,",
  "      \"ipv4\": { \"ip\": \"203.0.113.2\", \"mask\": \"255.255.255.252\" }",
  "    },",
  "    {",
  "      \"name\": \"GigabitEthernet0/0/2\",",
  "      \"enabled\": false,",
  "      \"ipv4\": null",
  "    }",
  "  ]",
  "}",
].join("\n");

const lesson: Lesson = {
  slug: "json-data",
  intro: {
    en: "When a script asks a controller for its devices (lesson 6.4), the answer arrives as text in a structured format, almost always JSON. Before you can automate anything you have to read that text the way a program does: which part is an object, which is a list, which value is a number and which is a string. The CCNA asks you to interpret JSON, and you will meet XML and YAML on the job, so this lesson covers all three.",
    hi: "Jab script controller se uske devices maangti hai (lesson 6.4), toh jawab ek structured format mein text bankar aata hai, lagbhag hamesha JSON. Kuch bhi automate karne se pehle tumhe yeh text waise padhna aana chahiye jaise program padhta hai: kaunsa hissa object hai, kaunsa list, kaunsi value number hai aur kaunsi string. CCNA mein JSON interpret karna poocha jaata hai, aur kaam par XML aur YAML bhi milenge, isliye yeh lesson teeno cover karta hai.",
  },
  outcomes: [
    { en: "Explain why automation needs a data serialization format instead of show output", hi: "Samjha sako ki automation ko show output ki jagah data serialization format kyun chahiye" },
    { en: "Identify objects, arrays, keys and the six JSON value types", hi: "Objects, arrays, keys aur JSON ki chhe value types pehchaan sako" },
    { en: "Follow a path through nested JSON to find a specific value", hi: "Nested JSON mein ek path follow karke koi khaas value dhoondh sako" },
    { en: "Spot invalid JSON: single quotes, unquoted keys, trailing commas", hi: "Invalid JSON pakad sako: single quotes, bina quotes ke keys, trailing commas" },
    { en: "Compare JSON with XML and YAML and say where each one is used", hi: "JSON ko XML aur YAML se compare kar sako aur bata sako ki kaun kahan use hota hai" },
  ],
  sections: [
    {
      id: "why-structured-data",
      heading: { en: "Why automation needs structured data", hi: "Automation ko structured data kyun chahiye" },
      blocks: [
        {
          type: "p",
          text: {
            en: "`show ip interface brief` is easy for you to read, but a program has to guess where each column starts, and the layout changes between platforms. A **data serialization format** writes data as text with explicit structure, so any program in any language can turn it back into the same data. Serialization means turning data in memory into text to send or store; deserialization (parsing) is the reverse.",
            hi: "`show ip interface brief` tumhare liye padhna aasaan hai, lekin program ko andaaza lagana padta hai ki har column kahan shuru hota hai, aur layout platform ke saath badal jaata hai. **Data serialization format** data ko ek saaf structure ke saath text mein likhta hai, taaki kisi bhi language ka koi bhi program use wapas bilkul wahi data bana sake. Serialization matlab memory ke data ko bhejne ya store karne ke liye text banana; deserialization (parsing) iska ulta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "The three formats you need to recognise", hi: "Teen formats jo tumhe pehchaanne hain" },
          columns: [{ en: "Format", hi: "Format" }, { en: "Where you meet it", hi: "Kahan milta hai" }],
          rows: [
            ["JSON", { en: "REST APIs on controllers and cloud platforms, RESTCONF on IOS XE", hi: "Controllers aur cloud platforms ki REST APIs, IOS XE par RESTCONF" }],
            ["XML", { en: "NETCONF, older APIs, RESTCONF (which can also return XML)", hi: "NETCONF, purani APIs, RESTCONF (jo XML bhi de sakta hai)" }],
            ["YAML", { en: "Ansible playbooks and inventories (lesson 6.6), many config files", hi: "Ansible playbooks aur inventories (lesson 6.6), kai config files" }],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Exam topic 6.7 is \"Interpret JSON encoded data\". Expect to be shown a JSON snippet and asked to identify an object, an array, a data type, a value, or whether the snippet is valid.",
            hi: "Exam topic 6.7 hai \"Interpret JSON encoded data\". Expect karo ki ek JSON snippet dikhaya jaayega aur poocha jaayega ki object, array, data type ya value kya hai, ya snippet valid hai ya nahi.",
          },
        },
      ],
    },
    {
      id: "json-building-blocks",
      heading: { en: "JSON building blocks: objects and arrays", hi: "JSON ke building blocks: objects aur arrays" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "An **object** is wrapped in curly braces `{ }` and holds **key-value pairs** (also called members). Each pair is `\"key\": value`, and pairs are separated by commas. The order of pairs inside an object carries no meaning.",
              hi: "**Object** curly braces `{ }` mein band hota hai aur usme **key-value pairs** (members) hote hain. Har pair `\"key\": value` hota hai, aur pairs comma se alag hote hain. Object ke andar pairs ka order koi matlab nahi rakhta.",
            },
            {
              en: "A **key** is always a string in **double quotes**. Keys in the same object should be unique.",
              hi: "**Key** hamesha **double quotes** mein string hoti hai. Ek object mein keys unique honi chahiye.",
            },
            {
              en: "An **array** is wrapped in square brackets `[ ]` and holds an **ordered** list of values separated by commas, such as `[10, 20, 30]`. The values do not have to be the same type, but in practice they usually are.",
              hi: "**Array** square brackets `[ ]` mein band hota hai aur commas se alag values ki **ordered** list rakhta hai, jaise `[10, 20, 30]`. Values ka type same hona zaroori nahi, par practice mein aksar same hota hai.",
            },
            {
              en: "**Whitespace** outside strings is ignored. Indentation and line breaks are only for humans; the same document on one line is identical to a program.",
              hi: "Strings ke bahar ka **whitespace** ignore hota hai. Indentation aur line breaks sirf insaanon ke liye hain; wahi document ek line mein likho toh program ke liye bilkul same hai.",
            },
            {
              en: "There is **no trailing comma** after the last item, and JSON has **no comments**.",
              hi: "Aakhri item ke baad **trailing comma nahi** lagta, aur JSON mein **comments nahi** hote.",
            },
          ],
        },
        {
          type: "code",
          lang: "json",
          title: { en: "An object with three pairs; the third value is an array", hi: "Teen pairs wala object; teesri value ek array hai" },
          code: ["{", "  \"hostname\": \"SW1\",", "  \"mgmt_ip\": \"10.10.10.11\",", "  \"vlans\": [1, 10, 20, 30]", "}"].join("\n"),
        },
        {
          type: "code",
          lang: "json",
          title: { en: "Exactly the same data, minified", hi: "Bilkul wahi data, minified" },
          code: "{\"hostname\":\"SW1\",\"mgmt_ip\":\"10.10.10.11\",\"vlans\":[1,10,20,30]}",
        },
      ],
    },
    {
      id: "value-types",
      heading: { en: "The six value types", hi: "Chhe value types" },
      blocks: [
        {
          type: "table",
          columns: [{ en: "Type", hi: "Type" }, { en: "Written as", hi: "Kaise likhte hain" }, { en: "Example", hi: "Example" }],
          rows: [
            ["String", { en: "Text in double quotes", hi: "Double quotes mein text" }, "\"GigabitEthernet0/0/1\""],
            ["Number", { en: "Digits, no quotes; may be negative or have a decimal point, but no leading zeros", hi: "Digits, bina quotes; negative ya decimal bhi ho sakta hai, lekin aage zero nahi lagta" }, "41, -3, 99.5"],
            ["Boolean", { en: "true or false, lowercase, no quotes", hi: "true ya false, lowercase, bina quotes" }, "true"],
            ["Null", { en: "null, lowercase, no quotes: a deliberately empty value", hi: "null, lowercase, bina quotes: jaan-boojh kar khaali value" }, "null"],
            ["Object", { en: "{ } with key-value pairs", hi: "{ } jisme key-value pairs hain" }, "{\"ip\": \"10.1.1.1\"}"],
            ["Array", { en: "[ ] with an ordered list of values", hi: "[ ] jisme values ki ordered list hai" }, "[10, 20, 30]"],
          ],
        },
        {
          type: "p",
          text: {
            en: "String, number, boolean and null are simple values. Object and array are **containers**: their values can be any type, including more objects and arrays. That is how JSON builds nested data, such as a device that contains a list of interfaces, each containing its own address object.",
            hi: "String, number, boolean aur null simple values hain. Object aur array **containers** hain: unki values kisi bhi type ki ho sakti hain, aur objects aur arrays bhi. Isi tarah JSON nested data banata hai, jaise ek device jisme interfaces ki list hai, aur har interface mein apna address object.",
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "Quotes change the type", hi: "Quotes se type badal jaata hai" },
          text: {
            en: "`\"vlan\": 10` is a number. `\"vlan\": \"10\"` is a string. `\"enabled\": true` is a boolean, but `\"enabled\": \"true\"` is a four-letter string. Exam questions often hinge on exactly this.",
            hi: "`\"vlan\": 10` number hai. `\"vlan\": \"10\"` string hai. `\"enabled\": true` boolean hai, lekin `\"enabled\": \"true\"` chaar letters ki string hai. Exam ke sawaal aksar isi baat par tike hote hain.",
          },
        },
      ],
    },
    {
      id: "reading-nested-json",
      heading: { en: "Reading nested JSON: a router's interfaces", hi: "Nested JSON padhna: ek router ke interfaces" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Here is the kind of document an API returns for one router. Read it from the outside in: the whole thing is one object; one of its keys holds an array; each array element is an object; and one key of each element holds another object.",
            hi: "Ek router ke liye API aisa document lautati hai. Ise bahar se andar ki taraf padho: poori cheez ek object hai; uski ek key mein array hai; array ka har element ek object hai; aur har element ki ek key mein ek aur object hai.",
          },
        },
        { type: "code", lang: "json", title: { en: "R1 as JSON", hi: "R1 JSON mein" }, code: R1_JSON },
        {
          type: "steps",
          items: [
            {
              en: "Question: what IP address does GigabitEthernet0/0/1 have? Start at the outer object and find the key `interfaces`. Its value starts with `[`, so it is an array of three elements.",
              hi: "Sawaal: GigabitEthernet0/0/1 ka IP address kya hai? Bahar wale object se shuru karo aur key `interfaces` dhoondho. Uski value `[` se shuru hoti hai, yaani yeh teen elements ka array hai.",
            },
            {
              en: "Find the element whose `name` is `\"GigabitEthernet0/0/1\"`. It is the second element. Programs count array positions from 0, so this is index 1.",
              hi: "Woh element dhoondho jiska `name` `\"GigabitEthernet0/0/1\"` hai. Yeh doosra element hai. Programs array positions 0 se ginte hain, isliye yeh index 1 hai.",
            },
            {
              en: "Inside it, `ipv4` holds an object. Its `ip` key holds the string `\"203.0.113.2\"`, and `mask` holds `\"255.255.255.252\"`: a /30 to the ISP.",
              hi: "Iske andar `ipv4` mein ek object hai. Uski `ip` key mein string `\"203.0.113.2\"` hai, aur `mask` mein `\"255.255.255.252\"`: ISP ki taraf ek /30.",
            },
            {
              en: "In Python the same path is `data[\"interfaces\"][1][\"ipv4\"][\"ip\"]`. Every step of the path is either a key (for an object) or an index (for an array).",
              hi: "Python mein yahi path `data[\"interfaces\"][1][\"ipv4\"][\"ip\"]` hai. Path ka har step ya toh key hota hai (object ke liye) ya index (array ke liye).",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "false, null and missing are three different answers", hi: "false, null aur missing teen alag jawab hain" },
          text: {
            en: "For GigabitEthernet0/0/2, `\"enabled\": false` says the interface is disabled, and `\"ipv4\": null` says the key exists but has no value: no address is configured. If the `ipv4` key were missing altogether, the API simply did not report it. Code that treats these three cases the same way produces wrong reports.",
            hi: "GigabitEthernet0/0/2 ke liye `\"enabled\": false` batata hai ki interface disabled hai, aur `\"ipv4\": null` batata hai ki key hai par uski koi value nahi: koi address configure nahi hai. Agar `ipv4` key hoti hi nahi, toh matlab API ne use report hi nahi kiya. Jo code in teeno cases ko ek jaisa treat karta hai, woh galat reports banata hai.",
          },
        },
      ],
    },
    {
      id: "valid-or-not",
      heading: { en: "Valid or invalid: the usual syntax errors", hi: "Valid ya invalid: aam syntax galtiyan" },
      blocks: [
        {
          type: "p",
          text: {
            en: "A JSON parser is strict. One wrong character and it rejects the whole document; an API answers with 400 Bad Request. This snippet has four errors:",
            hi: "JSON parser bahut strict hota hai. Ek galat character, aur woh poora document reject kar deta hai; API 400 Bad Request ke saath jawab deti hai. Is snippet mein chaar galtiyan hain:",
          },
        },
        {
          type: "code",
          lang: "text",
          title: { en: "Invalid JSON", hi: "Invalid JSON" },
          code: ["{", "  hostname: \"SW1\",", "  'model': 'C9300-48P',", "  \"managed\": True,", "  \"vlans\": [10, 20, 30],", "}"].join("\n"),
        },
        {
          type: "list",
          items: [
            { en: "`hostname` has no quotes. Keys must be double-quoted strings.", hi: "`hostname` par quotes nahi hain. Keys double quotes wali strings honi chahiye." },
            { en: "`'model'` and `'C9300-48P'` use single quotes. JSON accepts only double quotes.", hi: "`'model'` aur `'C9300-48P'` mein single quotes hain. JSON sirf double quotes maanta hai." },
            { en: "`True` is capitalised. JSON booleans are lowercase `true` and `false` (Python's `True` is not JSON).", hi: "`True` capital mein hai. JSON booleans lowercase `true` aur `false` hote hain (Python ka `True` JSON nahi hai)." },
            { en: "The comma after `[10, 20, 30]` is a trailing comma before `}`. Remove it.", hi: "`[10, 20, 30]` ke baad wala comma `}` se pehle trailing comma hai. Ise hatao." },
          ],
        },
        {
          type: "code",
          lang: "json",
          title: { en: "Fixed", hi: "Theek kiya hua" },
          code: ["{", "  \"hostname\": \"SW1\",", "  \"model\": \"C9300-48P\",", "  \"managed\": true,", "  \"vlans\": [10, 20, 30]", "}"].join("\n"),
        },
      ],
    },
    {
      id: "xml-and-yaml",
      heading: { en: "The same data in XML and YAML", hi: "Wahi data XML aur YAML mein" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**XML (Extensible Markup Language)** wraps every value in an opening and closing tag, like HTML. It has no built-in types: `<enabled>true</enabled>` is text until a schema says otherwise. A list is simply the same element repeated. NETCONF carries its data as XML.",
            hi: "**XML (Extensible Markup Language)** har value ko opening aur closing tag mein band karta hai, HTML ki tarah. Isme built-in types nahi hote: `<enabled>true</enabled>` tab tak text hai jab tak koi schema kuch aur na kahe. List bas ek hi element ko baar baar likhna hai. NETCONF apna data XML mein le jaata hai.",
          },
        },
        {
          type: "code",
          lang: "xml",
          title: { en: "R1 with one interface, as XML", hi: "R1 ek interface ke saath, XML mein" },
          code: [
            "<device>",
            "  <hostname>R1</hostname>",
            "  <interfaces>",
            "    <interface>",
            "      <name>GigabitEthernet0/0/1</name>",
            "      <enabled>true</enabled>",
            "      <ipv4>",
            "        <ip>203.0.113.2</ip>",
            "        <mask>255.255.255.252</mask>",
            "      </ipv4>",
            "    </interface>",
            "  </interfaces>",
            "</device>",
          ].join("\n"),
        },
        {
          type: "p",
          text: {
            en: "**YAML (YAML Ain't Markup Language)** drops the braces and most quotes. Nesting is shown by **indentation with spaces** (tabs are not allowed), `key: value` makes a pair, and a dash `- ` starts each list item. In YAML, unlike JSON, indentation is meaning, so one space out of place changes the structure. Ansible playbooks are YAML.",
            hi: "**YAML (YAML Ain't Markup Language)** braces aur zyada tar quotes hata deta hai. Nesting **spaces ke indentation** se dikhti hai (tabs allowed nahi), `key: value` se pair banta hai, aur har list item dash `- ` se shuru hota hai. JSON ke ulat, YAML mein indentation ka matlab hai, isliye ek space idhar-udhar hua toh structure badal jaata hai. Ansible playbooks YAML mein hote hain.",
          },
        },
        {
          type: "code",
          lang: "yaml",
          title: { en: "The same data as YAML", hi: "Wahi data YAML mein" },
          code: [
            "---",
            "hostname: R1",
            "interfaces:",
            "  - name: GigabitEthernet0/0/1",
            "    enabled: true",
            "    ipv4:",
            "      ip: 203.0.113.2",
            "      mask: 255.255.255.252",
          ].join("\n"),
        },
        {
          type: "table",
          caption: { en: "JSON, XML and YAML compared", hi: "JSON, XML aur YAML ka comparison" },
          columns: [{ en: "Feature", hi: "Feature" }, "JSON", "XML", "YAML"],
          rows: [
            [{ en: "Structure shown by", hi: "Structure kaise dikhta hai" }, "{ } [ ] , :", { en: "Opening and closing tags", hi: "Opening aur closing tags" }, { en: "Indentation, - and :", hi: "Indentation, - aur :" }],
            [{ en: "Whitespace", hi: "Whitespace" }, { en: "Ignored", hi: "Ignore hota hai" }, { en: "Mostly ignored", hi: "Zyada tar ignore" }, { en: "Significant", hi: "Matlab rakhta hai" }],
            [{ en: "Comments", hi: "Comments" }, { en: "Not allowed", hi: "Allowed nahi" }, "<!-- ... -->", "# ..."],
            [{ en: "Strings need quotes", hi: "Strings par quotes" }, { en: "Always, double quotes", hi: "Hamesha, double quotes" }, { en: "No, text between tags", hi: "Nahi, tags ke beech text" }, { en: "Usually optional", hi: "Aam taur par optional" }],
            [{ en: "Typical use", hi: "Aam use" }, { en: "REST APIs", hi: "REST APIs" }, "NETCONF", "Ansible"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "YAML can read JSON", hi: "YAML JSON padh sakta hai" },
          text: {
            en: "YAML 1.2 is designed as a superset of JSON, so a YAML parser accepts JSON documents too. The reverse is not true.",
            hi: "YAML 1.2 JSON ka superset bana kar design kiya gaya hai, isliye YAML parser JSON documents bhi accept kar leta hai. Ulta sach nahi hai.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "Data serialization", def: { en: "Writing data from memory as structured text so another program can rebuild exactly the same data.", hi: "Memory ke data ko structured text mein likhna, taaki doosra program bilkul wahi data wapas bana sake." } },
    { term: "JSON", def: { en: "JavaScript Object Notation: a text format built from objects, arrays and four simple value types.", hi: "JavaScript Object Notation: objects, arrays aur chaar simple value types se bana text format." } },
    { term: "Object", def: { en: "Curly braces holding key-value pairs, for example {\"ip\": \"10.1.1.1\"}.", hi: "Curly braces jinme key-value pairs hote hain, jaise {\"ip\": \"10.1.1.1\"}." } },
    { term: "Array", def: { en: "Square brackets holding an ordered list of values, for example [10, 20, 30].", hi: "Square brackets jinme values ki ordered list hoti hai, jaise [10, 20, 30]." } },
    { term: "Key-value pair", def: { en: "A double-quoted key, a colon and a value; the basic unit inside an object.", hi: "Double quotes wali key, colon aur ek value; object ke andar ki basic unit." } },
    { term: "null", def: { en: "A JSON value that means the key exists but deliberately has no value.", hi: "JSON value jiska matlab hai key maujood hai par jaan-boojh kar uski koi value nahi." } },
    { term: "XML", def: { en: "A tag-based format where each value sits between an opening and a closing tag; used by NETCONF.", hi: "Tag-based format jisme har value opening aur closing tag ke beech hoti hai; NETCONF ise use karta hai." } },
    { term: "YAML", def: { en: "A format that uses indentation, colons and dashes instead of brackets; used by Ansible.", hi: "Format jo brackets ki jagah indentation, colons aur dashes use karta hai; Ansible ise use karta hai." } },
  ],
  mistakes: [
    {
      en: "Reading `\"10\"` as a number. Anything in double quotes is a string, even if it looks like a number or `true`.",
      hi: "`\"10\"` ko number padhna. Double quotes mein jo bhi hai woh string hai, chahe number ya `true` jaisa dikhe.",
    },
    {
      en: "Leaving a comma after the last pair or last array item. JSON rejects trailing commas.",
      hi: "Aakhri pair ya aakhri array item ke baad comma chhod dena. JSON trailing commas reject kar deta hai.",
    },
    {
      en: "Using single quotes or unquoted keys because Python or JavaScript code allows them. JSON needs double quotes around every key and every string.",
      hi: "Single quotes ya bina quotes ki keys use karna, kyunki Python ya JavaScript code mein chal jaati hain. JSON mein har key aur har string par double quotes chahiye.",
    },
    {
      en: "Mixing up `{ }` and `[ ]`. Braces hold key-value pairs (an object); brackets hold an ordered list of values (an array).",
      hi: "`{ }` aur `[ ]` ko mix karna. Braces mein key-value pairs hote hain (object); brackets mein values ki ordered list (array).",
    },
    {
      en: "Thinking indentation matters in JSON. It does not; it only matters in YAML.",
      hi: "Yeh sochna ki JSON mein indentation matter karta hai. Nahi karta; sirf YAML mein karta hai.",
    },
  ],
  recap: [
    { en: "JSON objects are `{ }` with \"key\": value pairs; arrays are `[ ]` with ordered values.", hi: "JSON objects `{ }` hote hain jinme \"key\": value pairs hain; arrays `[ ]` hote hain jinme ordered values hain." },
    { en: "Six value types: string, number, boolean, null, object, array. Keys are always double-quoted strings.", hi: "Chhe value types: string, number, boolean, null, object, array. Keys hamesha double quotes wali strings hoti hain." },
    { en: "true, false and null are lowercase and unquoted; quoting them turns them into strings.", hi: "true, false aur null lowercase aur bina quotes ke hote hain; quotes lagao toh woh strings ban jaate hain." },
    { en: "No trailing commas, no comments, whitespace ignored.", hi: "Trailing comma nahi, comments nahi, aur whitespace ignore hota hai." },
    { en: "XML uses tags (NETCONF); YAML uses indentation and dashes (Ansible).", hi: "XML tags use karta hai (NETCONF); YAML indentation aur dashes use karta hai (Ansible)." },
  ],
  quiz: [
    {
      q: { en: "Which of these is valid JSON?", hi: "Inme se kaunsa valid JSON hai?" },
      options: [
        { en: "{'hostname': 'R1', 'vlans': [10, 20]}", hi: "{'hostname': 'R1', 'vlans': [10, 20]}" },
        { en: "{hostname: \"R1\", vlans: [10, 20]}", hi: "{hostname: \"R1\", vlans: [10, 20]}" },
        { en: "{\"hostname\": \"R1\", \"vlans\": [10, 20]}", hi: "{\"hostname\": \"R1\", \"vlans\": [10, 20]}" },
        { en: "{\"hostname\": \"R1\", \"vlans\": [10, 20],}", hi: "{\"hostname\": \"R1\", \"vlans\": [10, 20],}" },
      ],
      answer: 2,
      explain: {
        en: "Keys and strings need double quotes, and nothing may follow the last pair. The first option uses single quotes, the second leaves keys unquoted, and the fourth has a trailing comma.",
        hi: "Keys aur strings par double quotes chahiye, aur aakhri pair ke baad kuch nahi aana chahiye. Pehle option mein single quotes hain, doosre mein keys bina quotes ke hain, aur chauthe mein trailing comma hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An API returns `{\"vlan\": \"10\", \"enabled\": true}`. What is the data type of the value of \"vlan\"?",
        hi: "Ek API `{\"vlan\": \"10\", \"enabled\": true}` lautati hai. \"vlan\" ki value ka data type kya hai?",
      },
      options: [
        { en: "Number", hi: "Number" },
        { en: "String", hi: "String" },
        { en: "Boolean", hi: "Boolean" },
        { en: "Array", hi: "Array" },
      ],
      answer: 1,
      explain: {
        en: "\"10\" is in double quotes, so it is a string, even though it contains digits. Written as 10 without quotes it would be a number. The value of \"enabled\" is a boolean.",
        hi: "\"10\" double quotes mein hai, isliye digits hone ke bawajood yeh string hai. Bina quotes ke 10 likha hota toh number hota. \"enabled\" ki value boolean hai.",
      },
      kind: "cli",
    },
    {
      q: {
        en: "In the R1 document from this lesson, what value do you reach by following interfaces → second element → ipv4 → ip?",
        hi: "Is lesson ke R1 document mein interfaces → doosra element → ipv4 → ip follow karne par kaunsi value milti hai?",
      },
      options: [
        { en: "\"10.1.1.1\"", hi: "\"10.1.1.1\"" },
        { en: "null", hi: "null" },
        { en: "\"255.255.255.252\"", hi: "\"255.255.255.252\"" },
        { en: "\"203.0.113.2\"", hi: "\"203.0.113.2\"" },
      ],
      answer: 3,
      explain: {
        en: "The second element (index 1) is GigabitEthernet0/0/1. Its ipv4 object holds ip \"203.0.113.2\" and mask \"255.255.255.252\". \"10.1.1.1\" belongs to the first element, and null is the ipv4 value of the third.",
        hi: "Doosra element (index 1) GigabitEthernet0/0/1 hai. Uske ipv4 object mein ip \"203.0.113.2\" aur mask \"255.255.255.252\" hai. \"10.1.1.1\" pehle element ka hai, aur null teesre element ki ipv4 value hai.",
      },
      kind: "calc",
    },
    {
      q: {
        en: "Which format shows nesting with indentation, starts list items with a dash, and is used for Ansible playbooks?",
        hi: "Kaunsa format nesting ko indentation se dikhata hai, list items dash se shuru karta hai, aur Ansible playbooks ke liye use hota hai?",
      },
      options: [
        { en: "YAML", hi: "YAML" },
        { en: "JSON", hi: "JSON" },
        { en: "XML", hi: "XML" },
        { en: "HTML", hi: "HTML" },
      ],
      answer: 0,
      explain: {
        en: "YAML uses indentation and `- ` for list items, and Ansible playbooks are written in it. JSON uses braces and brackets and ignores indentation; XML uses tags.",
        hi: "YAML indentation aur list items ke liye `- ` use karta hai, aur Ansible playbooks isi mein likhe jaate hain. JSON braces aur brackets use karta hai aur indentation ignore karta hai; XML tags use karta hai.",
      },
      kind: "concept",
    },
    {
      q: { en: "Which statement about `{ }` and `[ ]` in JSON is correct?", hi: "JSON mein `{ }` aur `[ ]` ke baare mein kaunsa statement sahi hai?" },
      options: [
        { en: "{ } is an array of values; [ ] is an object of key-value pairs", hi: "{ } values ka array hai; [ ] key-value pairs ka object hai" },
        { en: "Both hold key-value pairs; [ ] is only for numbers", hi: "Dono mein key-value pairs hote hain; [ ] sirf numbers ke liye hai" },
        { en: "{ } is an object of key-value pairs; [ ] is an ordered list of values", hi: "{ } key-value pairs ka object hai; [ ] values ki ordered list hai" },
        { en: "{ } marks a comment; [ ] marks a string", hi: "{ } comment dikhata hai; [ ] string dikhata hai" },
      ],
      answer: 2,
      explain: {
        en: "Curly braces make an object of \"key\": value pairs; square brackets make an array, an ordered list whose values can be of any type, including objects. JSON has no comments at all.",
        hi: "Curly braces se \"key\": value pairs ka object banta hai; square brackets se array, yaani ordered list jiski values kisi bhi type ki ho sakti hain, objects bhi. JSON mein comments hote hi nahi.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "An interface object reads `{\"name\": \"GigabitEthernet0/0/2\", \"enabled\": false, \"ipv4\": null}`. What does it tell you?",
        hi: "Ek interface object mein likha hai `{\"name\": \"GigabitEthernet0/0/2\", \"enabled\": false, \"ipv4\": null}`. Isse kya pata chalta hai?",
      },
      options: [
        { en: "The interface is up with IPv4 address 0.0.0.0", hi: "Interface up hai aur IPv4 address 0.0.0.0 hai" },
        { en: "The interface is disabled and has no IPv4 address configured", hi: "Interface disabled hai aur koi IPv4 address configure nahi hai" },
        { en: "The JSON is invalid because null must be in quotes", hi: "JSON invalid hai kyunki null quotes mein hona chahiye" },
        { en: "The ipv4 key is missing from the object", hi: "Object mein ipv4 key missing hai" },
      ],
      answer: 1,
      explain: {
        en: "false is a boolean saying the interface is not enabled, and null means the ipv4 key exists but deliberately has no value. null is a valid unquoted JSON value; \"null\" in quotes would be a string.",
        hi: "false ek boolean hai jo batata hai ki interface enabled nahi hai, aur null ka matlab hai ipv4 key maujood hai par jaan-boojh kar uski koi value nahi. null bina quotes ke valid JSON value hai; quotes mein \"null\" string ban jaata.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "nohde2-QNJ4",
      title: "Free CCNA | JSON, XML, & YAML | Day 60",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Data serialization, JSON data types, and side-by-side XML and YAML.", hi: "Data serialization, JSON data types, aur XML aur YAML side by side." },
    },
    {
      id: "HH1ltloVbS4",
      title: "150. Free CCNA (NEW) | Understanding and Interpreting JSON",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "Reading JSON objects, arrays and values, in Hindi.", hi: "JSON objects, arrays aur values padhna, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Parse and break a JSON document", hi: "Ek JSON document parse karo aur todo" },
    steps: [
      {
        en: "Save the R1 document from this lesson as `r1.json` on any computer with Python 3 installed.",
        hi: "Is lesson ka R1 document kisi bhi Python 3 wale computer par `r1.json` naam se save karo.",
      },
      {
        en: "Run `python3 -m json.tool r1.json` (on Windows, `python -m json.tool r1.json`). Valid JSON is printed back neatly formatted.",
        hi: "`python3 -m json.tool r1.json` chalao (Windows par `python -m json.tool r1.json`). Valid JSON ho toh woh saaf format hokar wapas print hota hai.",
      },
      {
        en: "Add a comma after the last interface object, run it again and read the error with its line number. Then try `True` instead of `true`, and single quotes around a key.",
        hi: "Aakhri interface object ke baad ek comma lagao, dobara chalao aur line number ke saath error padho. Phir `true` ki jagah `True` try karo, aur ek key par single quotes.",
      },
      {
        en: "Fix the file, start `python3`, and run `import json` then `data = json.load(open(\"r1.json\"))`. Print `data[\"interfaces\"][1][\"ipv4\"][\"ip\"]` and `len(data[\"interfaces\"])`.",
        hi: "File theek karo, `python3` start karo, aur `import json` phir `data = json.load(open(\"r1.json\"))` chalao. `data[\"interfaces\"][1][\"ipv4\"][\"ip\"]` aur `len(data[\"interfaces\"])` print karo.",
      },
      {
        en: "Rewrite GigabitEthernet0/0/0 in YAML by hand and compare it with the YAML in this lesson.",
        hi: "GigabitEthernet0/0/0 ko haath se YAML mein likho aur is lesson ke YAML se compare karo.",
      },
    ],
  },
};

export default lesson;
