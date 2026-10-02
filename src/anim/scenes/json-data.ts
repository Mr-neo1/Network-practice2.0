import type { LayersScene } from "../types.ts";

// The R1 document from the json-data lesson, built up and then read one level at a time.
// Each block is one key-value pair: label = the key, sub = the value and its type.
// Colours by value type: green = string, blue = number, orange = boolean, gray = null,
// purple = array, teal = object.

const hostname = { id: "hostname", label: "\"hostname\"", sub: "\"R1\" · string", tone: "green" as const };
const model = { id: "model", label: "\"model\"", sub: "\"ISR4331\" · string", tone: "green" as const };
const uptime = { id: "uptime", label: "\"uptime_days\"", sub: "41 · number", tone: "blue" as const };
const managed = { id: "managed", label: "\"managed\"", sub: "true · boolean", tone: "orange" as const };
const location = { id: "location", label: "\"location\"", sub: "null", tone: "gray" as const };

const top = { label: "{ } top-level object", blocks: [hostname, model, uptime, managed, location] };

const if0 = { id: "if0", label: "[0] object", sub: "GigabitEthernet0/0/0", tone: "teal" as const };
const if1 = { id: "if1", label: "[1] object", sub: "GigabitEthernet0/0/1", tone: "teal" as const };
const if2 = { id: "if2", label: "[2] object", sub: "GigabitEthernet0/0/2", tone: "teal" as const };
const array = { label: "\"interfaces\": [ array of 3 objects ]", blocks: [if0, if1, if2] };

const if1Obj = {
  label: "interfaces[1]: { object }",
  blocks: [
    { id: "name1", label: "\"name\"", sub: "\"GigabitEthernet0/0/1\"", tone: "green" as const, w: 1.3 },
    { id: "enabled1", label: "\"enabled\"", sub: "true · boolean", tone: "orange" as const },
    { id: "ipv4-1", label: "\"ipv4\"", sub: "{ ip, mask } · object", tone: "teal" as const },
  ],
};

const scene: LayersScene = {
  kind: "layers",
  id: "json-data",
  title: { en: "Building and reading one JSON document", hi: "Ek JSON document banana aur padhna" },
  steps: [
    {
      title: { en: "Braces make an object", hi: "Braces se object banta hai" },
      text: {
        en: "The document an API returns for router R1 starts with { and ends with }, so it is one object. Its first member is the pair \"hostname\": \"R1\". The key is always a string in double quotes, and \"R1\" is in quotes too, so the value is a string.",
        hi: "Router R1 ke liye API jo document lautati hai, woh { se shuru hokar } par khatam hota hai, yaani yeh ek object hai. Uska pehla member pair \"hostname\": \"R1\" hai. Key hamesha double quotes mein string hoti hai, aur \"R1\" bhi quotes mein hai, isliye value string hai.",
      },
      focus: ["hostname"],
      rows: [{ label: "{ } top-level object", blocks: [hostname] }],
    },
    {
      title: { en: "No quotes, so 41 is a number", hi: "Quotes nahi, isliye 41 number hai" },
      text: {
        en: "Two more pairs are added, separated by commas. \"model\": \"ISR4331\" is another string. \"uptime_days\": 41 has no quotes around the value, so it is a number a program can do maths with. Written as \"41\" it would be a string.",
        hi: "Do aur pairs judte hain, commas se alag. \"model\": \"ISR4331\" ek aur string hai. \"uptime_days\": 41 ki value par quotes nahi hain, isliye yeh number hai jis par program calculation kar sakta hai. \"41\" likha hota toh string hota.",
      },
      focus: ["model", "uptime"],
      rows: [{ label: "{ } top-level object", blocks: [hostname, model, uptime] }],
    },
    {
      title: { en: "Boolean and null: lowercase, unquoted", hi: "Boolean aur null: lowercase, bina quotes" },
      text: {
        en: "\"managed\": true is a boolean, written in lowercase with no quotes. \"location\": null means the key exists but nobody has set a value. Five pairs now, and the order of pairs inside an object carries no meaning.",
        hi: "\"managed\": true ek boolean hai, lowercase mein aur bina quotes. \"location\": null ka matlab key maujood hai par kisi ne value set nahi ki. Ab paanch pairs hain, aur object ke andar pairs ke order ka koi matlab nahi hota.",
      },
      focus: ["managed", "location"],
      rows: [top],
    },
    {
      title: { en: "A key whose value is an array", hi: "Ek key jiski value array hai" },
      text: {
        en: "The sixth pair is \"interfaces\", and its value starts with [, so it is an array: an ordered list. Each of its three elements is itself an object, one per interface. Programs number the elements from 0, so GigabitEthernet0/0/1 is element [1].",
        hi: "Chhatha pair \"interfaces\" hai, aur uski value [ se shuru hoti hai, yaani yeh array hai: ek ordered list. Uske teeno elements khud objects hain, har interface ka ek. Programs elements ko 0 se number karte hain, isliye GigabitEthernet0/0/1 element [1] hai.",
      },
      focus: ["if0", "if1", "if2"],
      rows: [top, array],
    },
    {
      title: { en: "Open element [1]", hi: "Element [1] kholo" },
      text: {
        en: "Inside element [1] are three pairs: a string \"name\", a boolean \"enabled\": true, and \"ipv4\", whose value is another object. So the ipv4 object sits inside element [1], which sits inside the interfaces array, which sits inside the top-level object: this is what nested JSON means.",
        hi: "Element [1] ke andar teen pairs hain: string \"name\", boolean \"enabled\": true, aur \"ipv4\", jiski value ek aur object hai. Yaani ipv4 object element [1] ke andar hai, element [1] interfaces array ke andar, aur array top-level object ke andar: nested JSON ka yahi matlab hai.",
      },
      focus: ["if1", "name1", "enabled1", "ipv4-1"],
      rows: [top, array, if1Obj],
    },
    {
      title: { en: "Follow the path to the IP address", hi: "Path follow karke IP address tak pahuncho" },
      text: {
        en: "The ipv4 object holds two strings: \"ip\": \"203.0.113.2\" and \"mask\": \"255.255.255.252\". The full path is interfaces, then [1], then ipv4, then ip; in Python, data[\"interfaces\"][1][\"ipv4\"][\"ip\"]. Each step is a key for an object or an index for an array.",
        hi: "ipv4 object mein do strings hain: \"ip\": \"203.0.113.2\" aur \"mask\": \"255.255.255.252\". Poora path hai interfaces, phir [1], phir ipv4, phir ip; Python mein data[\"interfaces\"][1][\"ipv4\"][\"ip\"]. Har step object ke liye key hai ya array ke liye index.",
      },
      focus: ["if1", "ipv4-1", "ip1"],
      rows: [
        top,
        array,
        if1Obj,
        {
          label: "interfaces[1].ipv4: { object }",
          blocks: [
            { id: "ip1", label: "\"ip\"", sub: "\"203.0.113.2\" · string", tone: "green" },
            { id: "mask1", label: "\"mask\"", sub: "\"255.255.255.252\" · string", tone: "green" },
          ],
        },
      ],
    },
    {
      title: { en: "Element [2]: false and null", hi: "Element [2]: false aur null" },
      text: {
        en: "Element [2] is GigabitEthernet0/0/2. \"enabled\": false says the interface is disabled, and \"ipv4\": null says the key is there but holds no address. A missing key would be a third, different case: the API did not report it at all.",
        hi: "Element [2] GigabitEthernet0/0/2 hai. \"enabled\": false batata hai ki interface disabled hai, aur \"ipv4\": null batata hai ki key hai par usme koi address nahi. Key hoti hi nahi toh woh teesra, alag case hota: API ne use report hi nahi kiya.",
      },
      focus: ["if2", "enabled2", "ipv4-2"],
      rows: [
        top,
        array,
        {
          label: "interfaces[2]: { object }",
          blocks: [
            { id: "name2", label: "\"name\"", sub: "\"GigabitEthernet0/0/2\"", tone: "green", w: 1.3 },
            { id: "enabled2", label: "\"enabled\"", sub: "false · boolean", tone: "orange" },
            { id: "ipv4-2", label: "\"ipv4\"", sub: "null", tone: "gray" },
          ],
        },
      ],
    },
    {
      title: { en: "The same pair in JSON, YAML and XML", hi: "Wahi pair JSON, YAML aur XML mein" },
      text: {
        en: "The ip pair from element [1], written three ways. JSON uses braces and double quotes and has no comments. YAML uses indentation and dashes, usually without quotes, and is what Ansible reads. XML puts the value between tags and is what NETCONF carries.",
        hi: "Element [1] ka ip pair, teen tareeke se likha hua. JSON braces aur double quotes use karta hai aur usme comments nahi hote. YAML indentation aur dashes use karta hai, aam taur par bina quotes, aur Ansible yahi padhta hai. XML value ko tags ke beech rakhta hai aur NETCONF yahi le jaata hai.",
      },
      focus: ["j-pair", "y-pair", "x-pair"],
      rows: [
        {
          label: "JSON",
          blocks: [
            { id: "j-struct", label: "Braces, brackets", sub: "{ } object · [ ] array", tone: "teal" },
            { id: "j-pair", label: "Pair", sub: "\"ip\": \"203.0.113.2\"", tone: "green" },
            { id: "j-comment", label: "Comments", sub: "not allowed", tone: "gray" },
          ],
        },
        {
          label: "YAML",
          blocks: [
            { id: "y-struct", label: "Indentation", sub: "spaces nest · - list item", tone: "teal" },
            { id: "y-pair", label: "Pair", sub: "ip: 203.0.113.2", tone: "green" },
            { id: "y-comment", label: "Comments", sub: "# like this", tone: "gray" },
          ],
        },
        {
          label: "XML",
          blocks: [
            { id: "x-struct", label: "Nested tags", sub: "<ipv4> … </ipv4>", tone: "teal" },
            { id: "x-pair", label: "Element", sub: "<ip>203.0.113.2</ip>", tone: "green" },
            { id: "x-comment", label: "Comments", sub: "<!-- like this -->", tone: "gray" },
          ],
        },
      ],
    },
  ],
};

export default scene;
