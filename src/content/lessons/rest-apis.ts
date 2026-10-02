import type { Lesson } from "../types.ts";

// Example used throughout: a Python script on 10.10.10.5 talks to a network controller's
// REST API at https://10.10.10.50/api/v1/...; the controller manages SW1 (10.10.10.11).
const lesson: Lesson = {
  slug: "rest-apis",
  intro: {
    en: "The CLI was built for a person reading a screen. A script that wants the inventory of 300 switches, or wants to add a VLAN everywhere, needs something a program can call and parse reliably. That is an API, and on controllers, cloud dashboards and modern IOS XE devices it is almost always a REST API over HTTPS. If you can read a REST request and its response code, you can automate the network and troubleshoot the tools that do.",
    hi: "CLI ek insaan ke liye bana tha jo screen padhta hai. Agar ek script ko 300 switches ki inventory chahiye, ya har jagah ek VLAN add karna hai, toh use aisi cheez chahiye jise program call kar sake aur reliably parse kar sake. Yahi API hai, aur controllers, cloud dashboards aur naye IOS XE devices par yeh lagbhag hamesha HTTPS par chalne wali REST API hoti hai. REST request aur uska response code padhna aa gaya, toh tum network automate bhi kar sakte ho aur automation tools ko troubleshoot bhi.",
  },
  outcomes: [
    { en: "Explain what an API is and why a controller's northbound API is a REST API", hi: "Samjha sako ki API kya hai aur controller ki northbound API REST API kyun hoti hai" },
    { en: "List the REST constraints and explain what stateless means in practice", hi: "REST constraints list kar sako aur samjha sako ki practice mein stateless ka matlab kya hai" },
    { en: "Map CRUD operations to HTTP verbs: POST, GET, PUT/PATCH and DELETE", hi: "CRUD operations ko HTTP verbs se map kar sako: POST, GET, PUT/PATCH aur DELETE" },
    { en: "Read a request's URI and headers, and interpret 2xx, 4xx and 5xx status codes", hi: "Request ka URI aur headers padh sako, aur 2xx, 4xx aur 5xx status codes ka matlab nikaal sako" },
    { en: "Compare basic authentication, API keys, bearer tokens and OAuth", hi: "Basic authentication, API keys, bearer tokens aur OAuth compare kar sako" },
  ],
  sections: [
    {
      id: "what-is-an-api",
      heading: { en: "What an API is, and why the CLI is not one", hi: "API kya hai, aur CLI API kyun nahi hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "An **API (Application Programming Interface)** is a defined way for one program to ask another program for data or to make it do something. The API fixes the address to call, the allowed operations, the format of the data and the possible answers, so both sides know exactly what to expect.",
            hi: "**API (Application Programming Interface)** ek fixed tareeka hai jisse ek program doosre program se data maang sake ya usse koi kaam karwa sake. API decide karti hai ki kis address ko call karna hai, kaunse operations allowed hain, data ka format kya hoga aur kaunse jawab aa sakte hain. Isliye dono sides ko pehle se pata hota hai ki kya expect karna hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "You can automate the CLI by sending commands over SSH and reading the text that comes back, but that text is formatted for eyes. Column widths, spacing and wording change between IOS versions and platforms, so a script that slices `show ip interface brief` output breaks easily. An API returns structured data, such as `\"status\": \"up\"`, that a program can read without guessing.",
            hi: "CLI ko bhi automate kar sakte ho: SSH par commands bhejo aur jo text wapas aaye use padho. Lekin woh text aankhon ke liye format kiya gaya hai. Column widths, spacing aur wording IOS versions aur platforms ke saath badalte hain, isliye jo script `show ip interface brief` ka output kaat-kaat kar padhti hai, woh aasani se toot jaati hai. API structured data deti hai, jaise `\"status\": \"up\"`, jise program bina andaaza lagaye padh leta hai.",
          },
        },
        {
          type: "p",
          text: {
            en: "In lesson 6.2 you met the controller's **northbound API**: the interface that apps and scripts use to talk to the controller. On Cisco Catalyst Center, Meraki, ACI and most cloud platforms that northbound API is a REST API. The controller then talks to the devices through its **southbound** interfaces (SSH, NETCONF, RESTCONF and others), so your script never has to log in to each switch.",
            hi: "Lesson 6.2 mein tumne controller ki **northbound API** dekhi thi: woh interface jisse apps aur scripts controller se baat karte hain. Cisco Catalyst Center, Meraki, ACI aur zyada tar cloud platforms par yeh northbound API ek REST API hoti hai. Phir controller apne **southbound** interfaces (SSH, NETCONF, RESTCONF waghera) se devices se baat karta hai, isliye tumhari script ko har switch par alag se login nahi karna padta.",
          },
        },
        {
          type: "callout",
          tone: "analogy",
          title: { en: "Think of it this way", hi: "Aise socho" },
          text: {
            en: "A restaurant menu is an API. You do not walk into the kitchen; you order item 12 from a fixed list, in a fixed way, and you get a plate in a known format. If item 12 is sold out, the waiter gives you a clear answer instead of silence. HTTP status codes are those clear answers.",
            hi: "Restaurant ka menu ek API hai. Tum kitchen mein nahi ghuste; ek fixed list se, ek fixed tareeke se item 12 order karte ho, aur ek known format mein plate milti hai. Item 12 khatam ho gaya ho toh waiter chup nahi rehta, saaf jawab deta hai. HTTP status codes yahi saaf jawab hain.",
          },
        },
      ],
    },
    {
      id: "rest-constraints",
      heading: { en: "What makes an API RESTful", hi: "API ko RESTful kya banata hai" },
      blocks: [
        {
          type: "p",
          text: {
            en: "**REST (Representational State Transfer)** is an architectural style, not a protocol. An API is called RESTful when it follows six constraints. REST does not strictly require HTTP, but in practice REST APIs use HTTP, almost always as HTTPS on TCP 443.",
            hi: "**REST (Representational State Transfer)** ek architectural style hai, protocol nahi. Jo API in chhe constraints ko follow karti hai, use RESTful kehte hain. REST ke liye HTTP strictly zaroori nahi hai, lekin practice mein REST APIs HTTP hi use karti hain, aur lagbhag hamesha HTTPS, yaani TCP 443 par.",
          },
        },
        {
          type: "table",
          caption: { en: "The six REST constraints", hi: "REST ke chhe constraints" },
          columns: [{ en: "Constraint", hi: "Constraint" }, { en: "What it means for you", hi: "Tumhare liye iska matlab" }],
          rows: [
            [
              { en: "Client-server", hi: "Client-server" },
              { en: "The client (your script) sends requests; the server (the controller) answers. Each side can change internally as long as the API stays the same.", hi: "Client (tumhari script) request bhejta hai; server (controller) jawab deta hai. Jab tak API same hai, dono sides andar se kuch bhi badal sakti hain." },
            ],
            [
              { en: "Stateless", hi: "Stateless" },
              { en: "The server keeps no session for you between requests. Every request carries everything needed to process it, including authentication.", hi: "Server requests ke beech tumhara koi session yaad nahi rakhta. Har request mein woh sab hota hai jo use process karne ke liye chahiye, authentication bhi." },
            ],
            [
              { en: "Cacheable", hi: "Cacheable" },
              { en: "Each response says whether it may be cached and for how long (for example with a `Cache-Control` header), so clients do not ask twice for data that has not changed.", hi: "Har response batata hai ki use cache kar sakte hain ya nahi, aur kitni der ke liye (jaise `Cache-Control` header se), taaki client na badle hue data ke liye dobara na pooche." },
            ],
            [
              { en: "Uniform interface", hi: "Uniform interface" },
              { en: "Every resource has its own URI, and you act on it with the same small set of methods and data formats, whatever the resource is.", hi: "Har resource ka apna URI hota hai, aur resource kuch bhi ho, tum us par wahi chhote se methods aur data formats use karte ho." },
            ],
            [
              { en: "Layered system", hi: "Layered system" },
              { en: "The client cannot tell whether it is talking to the real server or to a load balancer, proxy or cache in between.", hi: "Client ko pata nahi chalta ki woh asli server se baat kar raha hai ya beech mein baithe load balancer, proxy ya cache se." },
            ],
            [
              { en: "Code on demand (optional)", hi: "Code on demand (optional)" },
              { en: "The server may send code, such as JavaScript, for the client to run. It is the only optional constraint.", hi: "Server client ko chalane ke liye code bhej sakta hai, jaise JavaScript. Yahi ek optional constraint hai." },
            ],
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Stateless does not mean no login", hi: "Stateless ka matlab bina login nahi" },
          text: {
            en: "Because the server remembers nothing between requests, the client sends its credentials or token in **every** request. That is why every call to a controller carries an `Authorization` (or similar) header, not just the first one.",
            hi: "Server requests ke beech kuch yaad nahi rakhta, isliye client apne credentials ya token **har** request mein bhejta hai. Isi wajah se controller ki har call mein `Authorization` (ya waisa hi) header hota hai, sirf pehli call mein nahi.",
          },
        },
      ],
    },
    {
      id: "anatomy-of-a-request",
      heading: { en: "Anatomy of a request: URI, method, headers, body", hi: "Request ki anatomy: URI, method, headers, body" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Every REST call names a **resource** with a **URI** (Uniform Resource Identifier). Take `https://10.10.10.50:443/api/v1/devices?hostname=SW1`:",
            hi: "Har REST call ek **resource** ko **URI** (Uniform Resource Identifier) se point karti hai. Is URI ko dekho: `https://10.10.10.50:443/api/v1/devices?hostname=SW1`:",
          },
        },
        {
          type: "table",
          caption: { en: "The parts of a URI", hi: "URI ke hisse" },
          columns: [{ en: "Part", hi: "Hissa" }, { en: "Example", hi: "Example" }, { en: "Meaning", hi: "Matlab" }],
          rows: [
            ["Scheme", "https", { en: "HTTP inside TLS", hi: "TLS ke andar HTTP" }],
            ["Authority", "10.10.10.50:443", { en: "The server (host) and port; 443 is the HTTPS default and is usually left out", hi: "Server (host) aur port; 443 HTTPS ka default hai, isliye aksar likha nahi jaata" }],
            ["Path", "/api/v1/devices", { en: "Which resource, here the collection of devices (v1 is the API version)", hi: "Kaunsa resource, yahan devices ka collection (v1 API ka version hai)" }],
            ["Query", "?hostname=SW1", { en: "Optional key=value filters after the `?`", hi: "`?` ke baad optional key=value filters" }],
          ],
        },
        {
          type: "p",
          text: {
            en: "A request is a **method** (the verb), the URI, some **headers**, and for POST, PUT and PATCH a **body** with the data. The response is a three-digit **status code**, headers and usually a body. These three headers come up again and again:",
            hi: "Request mein hota hai ek **method** (verb), URI, kuch **headers**, aur POST, PUT aur PATCH ke saath data wali **body**. Response mein hota hai teen digit ka **status code**, headers aur aam taur par ek body. Yeh teen headers baar baar milenge:",
          },
        },
        {
          type: "table",
          columns: [{ en: "Header", hi: "Header" }, { en: "Example", hi: "Example" }, { en: "Meaning", hi: "Matlab" }],
          rows: [
            ["Content-Type", "application/json", { en: "The format of the body in this message", hi: "Is message ki body ka format" }],
            ["Accept", "application/json", { en: "The format the client wants back in the response", hi: "Client response mein kaunsa format chahta hai" }],
            ["Authorization", "Bearer eyJhbGciOi...", { en: "Who is asking: credentials or a token", hi: "Kaun pooch raha hai: credentials ya token" }],
          ],
        },
        {
          type: "code",
          lang: "text",
          title: { en: "One request and its response, as they travel inside HTTPS", hi: "Ek request aur uska response, jaise HTTPS ke andar jaate hain" },
          code: [
            "GET /api/v1/devices HTTP/1.1",
            "Host: 10.10.10.50",
            "Accept: application/json",
            "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZXRhZG1pbiJ9.k3F...",
            "",
            "HTTP/1.1 200 OK",
            "Content-Type: application/json",
            "",
            "[",
            "  {\"hostname\": \"SW1\", \"mgmt_ip\": \"10.10.10.11\", \"reachable\": true},",
            "  {\"hostname\": \"SW2\", \"mgmt_ip\": \"10.10.10.12\", \"reachable\": true},",
            "  {\"hostname\": \"SW3\", \"mgmt_ip\": \"10.10.10.13\", \"reachable\": false}",
            "]",
          ].join("\n"),
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "Content-Type or Accept?", hi: "Content-Type ya Accept?" },
          text: {
            en: "Content-Type describes the body **you are sending** in this message. Accept describes what you **want back**. A GET has no body, so it usually carries Accept but not Content-Type.",
            hi: "Content-Type us body ko describe karta hai jo **tum is message mein bhej rahe ho**. Accept batata hai ki tumhe **wapas kya chahiye**. GET mein body nahi hoti, isliye usme aam taur par Accept hota hai, Content-Type nahi.",
          },
        },
      ],
    },
    {
      id: "crud-and-verbs",
      heading: { en: "CRUD and the HTTP verbs", hi: "CRUD aur HTTP verbs" },
      blocks: [
        {
          type: "p",
          text: {
            en: "Almost everything you do to data is one of four operations, called **CRUD**: Create, Read, Update, Delete. REST maps each one to an HTTP method.",
            hi: "Data ke saath tum jo bhi karte ho, woh lagbhag hamesha chaar operations mein se ek hota hai, jise **CRUD** kehte hain: Create, Read, Update, Delete. REST har ek ko ek HTTP method se map karta hai.",
          },
        },
        {
          type: "table",
          caption: { en: "CRUD to HTTP, with the controller example", hi: "CRUD se HTTP, controller example ke saath" },
          columns: [{ en: "CRUD", hi: "CRUD" }, { en: "HTTP method", hi: "HTTP method" }, { en: "Example", hi: "Example" }, { en: "Typical success code", hi: "Aam success code" }],
          rows: [
            ["Create", "POST", "POST /api/v1/vlans", "201 Created"],
            ["Read", "GET", "GET /api/v1/devices", "200 OK"],
            ["Update", "PUT or PATCH", "PATCH /api/v1/vlans/30", "200 OK (or 204)"],
            ["Delete", "DELETE", "DELETE /api/v1/vlans/30", "204 No Content (or 200)"],
          ],
        },
        {
          type: "list",
          items: [
            {
              en: "**PUT** replaces the whole resource with the body you send. Fields you leave out may be reset or removed.",
              hi: "**PUT** poore resource ko tumhari bheji body se replace kar deta hai. Jo fields tumne nahi bheje, woh reset ya remove ho sakte hain.",
            },
            {
              en: "**PATCH** changes only the fields you send. To rename VLAN 30 you send just `{\"name\": \"VOICE-HQ\"}`.",
              hi: "**PATCH** sirf wahi fields badalta hai jo tum bhejte ho. VLAN 30 ka naam badalna hai toh sirf `{\"name\": \"VOICE-HQ\"}` bhejo.",
            },
            {
              en: "**POST** to a collection (`/api/v1/vlans`) creates a new member; the server answers with its new URI in a `Location` header. POST is also used for actions that are not really a create, such as asking for a login token.",
              hi: "Collection (`/api/v1/vlans`) par **POST** ek naya member banata hai; server naye member ka URI `Location` header mein lauta deta hai. POST un actions ke liye bhi use hota hai jo asal mein create nahi hain, jaise login token maangna.",
            },
            {
              en: "**GET** only reads. It must never change anything, which is why it is safe to repeat.",
              hi: "**GET** sirf padhta hai. Yeh kabhi kuch nahi badalta, isliye ise baar baar chalana safe hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "exam",
          title: { en: "Exam point", hi: "Exam point" },
          text: {
            en: "Create = POST, Read = GET, Update = PUT and PATCH, Delete = DELETE. A common trap offers PUT for Create or POST for Update.",
            hi: "Create = POST, Read = GET, Update = PUT aur PATCH, Delete = DELETE. Exam ka common trap hai Create ke liye PUT ya Update ke liye POST dikhana.",
          },
        },
      ],
    },
    {
      id: "status-codes",
      heading: { en: "Reading status codes", hi: "Status codes padhna" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The first digit tells you who is responsible: **2xx** success, **3xx** redirection (go elsewhere), **4xx** the client sent something wrong, **5xx** the server failed. 1xx (informational) exists but you will rarely see it.",
            hi: "Pehla digit batata hai ki zimmedaar kaun hai: **2xx** success, **3xx** redirection (kahin aur jao), **4xx** client ne kuch galat bheja, **5xx** server fail hua. 1xx (informational) bhi hota hai, par shaayad hi dikhega.",
          },
        },
        {
          type: "table",
          columns: [{ en: "Code", hi: "Code" }, { en: "Meaning", hi: "Matlab" }, { en: "When you see it", hi: "Kab dikhta hai" }],
          rows: [
            ["200 OK", { en: "Success, the answer is in the body", hi: "Success, jawab body mein hai" }, { en: "A GET that returned data; a PATCH that returned the updated object", hi: "GET jisne data diya; PATCH jisne updated object lautaya" }],
            ["201 Created", { en: "A new resource was created", hi: "Naya resource ban gaya" }, { en: "A POST that added VLAN 30", hi: "POST jisne VLAN 30 add kiya" }],
            ["202 Accepted", { en: "Accepted, but not finished yet", hi: "Accept ho gaya, par abhi poora nahi hua" }, { en: "Controllers that run the change as a background task and return a task ID", hi: "Woh controllers jo change ko background task ki tarah chalate hain aur task ID lautate hain" }],
            ["204 No Content", { en: "Success, nothing to return", hi: "Success, lautane ko kuch nahi" }, { en: "A DELETE that worked", hi: "DELETE jo kaam kar gaya" }],
            ["400 Bad Request", { en: "The request is malformed", hi: "Request galat bani hai" }, { en: "Broken JSON in the body, a missing required field", hi: "Body mein toota JSON, koi zaroori field missing" }],
            ["401 Unauthorized", { en: "Not authenticated", hi: "Authenticate nahi hua" }, { en: "No token, a wrong password, an expired token", hi: "Token nahi, galat password, expired token" }],
            ["403 Forbidden", { en: "Authenticated, but not allowed", hi: "Authenticate ho gaya, par permission nahi" }, { en: "A read-only account tries a DELETE", hi: "Read-only account DELETE try karta hai" }],
            ["404 Not Found", { en: "The resource does not exist", hi: "Resource exist nahi karta" }, { en: "GET /api/v1/vlans/99 when there is no VLAN 99, or a typo in the path", hi: "VLAN 99 hai hi nahi aur GET /api/v1/vlans/99, ya path mein typo" }],
            ["500 Internal Server Error", { en: "The server failed while processing", hi: "Process karte waqt server fail hua" }, { en: "A bug or crash on the controller; your request may be fine", hi: "Controller par bug ya crash; tumhari request shaayad theek hai" }],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: { en: "401 versus 403", hi: "401 aur 403 ka fark" },
          text: {
            en: "Despite its name, 401 Unauthorized means the server does not know **who** you are: fix the credentials or get a new token. 403 Forbidden means it knows exactly who you are and you are **not allowed**: a new token will not help, you need more privileges.",
            hi: "Naam kuch bhi ho, 401 Unauthorized ka matlab hai server ko pata hi nahi ki tum **kaun** ho: credentials theek karo ya naya token lo. 403 Forbidden ka matlab hai server ko achhe se pata hai tum kaun ho, lekin tumhe **permission nahi** hai: naya token kaam nahi aayega, zyada privileges chahiye.",
          },
        },
      ],
    },
    {
      id: "authentication",
      heading: { en: "Authentication: proving who the client is", hi: "Authentication: client kaun hai, yeh prove karna" },
      blocks: [
        {
          type: "list",
          items: [
            {
              en: "**Basic authentication**: the username and password are joined as `netadmin:Cisco123`, Base64-encoded to `bmV0YWRtaW46Q2lzY28xMjM=` and sent as `Authorization: Basic bmV0YWRtaW46Q2lzY28xMjM=`. Base64 is an encoding, not encryption; anyone who captures it can decode it, so it is only acceptable inside HTTPS.",
              hi: "**Basic authentication**: username aur password ko `netadmin:Cisco123` ki tarah joda jaata hai, Base64 mein `bmV0YWRtaW46Q2lzY28xMjM=` banaya jaata hai aur `Authorization: Basic bmV0YWRtaW46Q2lzY28xMjM=` bankar jaata hai. Base64 sirf encoding hai, encryption nahi; jo bhi ise capture kare woh decode kar sakta hai, isliye yeh sirf HTTPS ke andar hi chalega.",
            },
            {
              en: "**API key**: a long, fixed secret string that the platform issues to you once. You send it in a header (the header name depends on the API) with every request. It usually stays valid until someone revokes it, so treat it like a password and revoke it if it leaks.",
              hi: "**API key**: ek lambi, fixed secret string jo platform tumhe ek baar deta hai. Har request ke saath ise ek header mein bhejte ho (header ka naam API par depend karta hai). Aam taur par yeh tab tak valid rehti hai jab tak koi ise revoke na kare, isliye ise password ki tarah sambhalo aur leak ho jaaye toh turant revoke karo.",
            },
            {
              en: "**Bearer token**: you log in once (often with basic auth to a token endpoint) and receive a temporary token. You then send `Authorization: Bearer <token>` with each request until it expires. The password crosses the network only once.",
              hi: "**Bearer token**: tum ek baar login karte ho (aksar ek token endpoint par basic auth se) aur ek temporary token milta hai. Phir expire hone tak har request ke saath `Authorization: Bearer <token>` bhejte ho. Password network par sirf ek baar jaata hai.",
            },
            {
              en: "**OAuth (2.0)**: a framework for delegated access. An authorization server issues an access token to an application after the user approves it, so the application acts on the user's behalf without ever seeing the user's password. The application then usually sends that token as a bearer token.",
              hi: "**OAuth (2.0)**: delegated access ka framework. User ke approve karne ke baad ek authorization server application ko access token deta hai, taaki application user ki taraf se kaam kar sake, user ka password dekhe bina. Phir application aam taur par woh token bearer token ki tarah bhejti hai.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "On Cisco Catalyst Center", hi: "Cisco Catalyst Center par" },
          text: {
            en: "Catalyst Center (formerly DNA Center) uses the token pattern. You send `POST /dna/system/api/v1/auth/token` with basic authentication and receive a token, then send it in an `X-Auth-Token` header on every later call, for example `GET /dna/intent/api/v1/network-device`. The idea is the same as a bearer token; only the header name differs.",
            hi: "Catalyst Center (pehle DNA Center) token wala pattern use karta hai. Basic authentication ke saath `POST /dna/system/api/v1/auth/token` bhejo aur token lo, phir har agli call mein use `X-Auth-Token` header mein bhejo, jaise `GET /dna/intent/api/v1/network-device`. Idea bearer token wala hi hai; sirf header ka naam alag hai.",
          },
        },
      ],
    },
    {
      id: "data-and-full-example",
      heading: { en: "Data encoding and a complete session", hi: "Data encoding aur ek poora session" },
      blocks: [
        {
          type: "p",
          text: {
            en: "The body of a request or response is text in an agreed format. REST APIs mostly use **JSON**; some also offer **XML**, and **YAML** is common in tools such as Ansible. The client chooses with `Accept`, and both sides label what they send with `Content-Type`. You will learn to read all three in lesson 6.5.",
            hi: "Request ya response ki body ek pehle se agreed format mein likha text hoti hai. REST APIs zyada tar **JSON** use karti hain; kuch **XML** bhi deti hain, aur **YAML** Ansible jaise tools mein common hai. Client `Accept` se choose karta hai, aur dono sides jo bhejti hain use `Content-Type` se label karti hain. Teeno ko padhna lesson 6.5 mein seekhoge.",
          },
        },
        {
          type: "steps",
          items: [
            {
              en: "The script sends `POST /api/v1/auth/token` with basic authentication. The controller answers `200 OK` with `{\"token\": \"eyJhbGciOi...\"}`.",
              hi: "Script basic authentication ke saath `POST /api/v1/auth/token` bhejti hai. Controller `200 OK` aur `{\"token\": \"eyJhbGciOi...\"}` ke saath jawab deta hai.",
            },
            {
              en: "`GET /api/v1/devices` with the bearer token returns `200 OK` and a JSON list of SW1, SW2 and SW3 from the controller's inventory.",
              hi: "Bearer token ke saath `GET /api/v1/devices` `200 OK` aur controller ki inventory se SW1, SW2 aur SW3 ki JSON list lautata hai.",
            },
            {
              en: "`POST /api/v1/vlans` with body `{\"id\": 30, \"name\": \"VOICE\"}` makes the controller configure VLAN 30 on SW1 and answer `201 Created`.",
              hi: "Body `{\"id\": 30, \"name\": \"VOICE\"}` ke saath `POST /api/v1/vlans` bhejne par controller SW1 par VLAN 30 configure karta hai aur `201 Created` deta hai.",
            },
            {
              en: "`PATCH /api/v1/vlans/30` with `{\"name\": \"VOICE-HQ\"}` renames it: `200 OK`.",
              hi: "`{\"name\": \"VOICE-HQ\"}` ke saath `PATCH /api/v1/vlans/30` naam badal deta hai: `200 OK`.",
            },
            {
              en: "`DELETE /api/v1/vlans/30` removes it: `204 No Content`.",
              hi: "`DELETE /api/v1/vlans/30` use hata deta hai: `204 No Content`.",
            },
            {
              en: "An hour later the token has expired, so the next GET gets `401 Unauthorized`. The script must request a new token.",
              hi: "Ek ghante baad token expire ho chuka hai, isliye agla GET `401 Unauthorized` paata hai. Script ko naya token maangna padega.",
            },
          ],
        },
        {
          type: "code",
          lang: "text",
          title: { en: "The first two calls with curl (-k skips certificate checks in a lab)", hi: "Pehli do calls curl se (-k lab mein certificate check skip karta hai)" },
          code: [
            "$ curl -k -X POST -u netadmin:Cisco123 https://10.10.10.50/api/v1/auth/token",
            "{\"token\": \"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZXRhZG1pbiJ9.k3F...\"}",
            "",
            "$ curl -k https://10.10.10.50/api/v1/devices \\",
            "    -H \"Accept: application/json\" \\",
            "    -H \"Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJuZXRhZG1pbiJ9.k3F...\"",
            "[{\"hostname\": \"SW1\", \"mgmt_ip\": \"10.10.10.11\", \"reachable\": true}, ...]",
          ].join("\n"),
        },
        {
          type: "callout",
          tone: "tip",
          title: { en: "The paths here are an example", hi: "Yahan ke paths ek example hain" },
          text: {
            en: "Every product defines its own paths and field names, published in its API documentation. The verbs, headers, status codes and authentication patterns are what carry over from one API to the next.",
            hi: "Har product apne paths aur field names khud define karta hai, aur unhe apni API documentation mein publish karta hai. Ek API se doosri API tak jo cheezein same rehti hain, woh hain verbs, headers, status codes aur authentication patterns.",
          },
        },
      ],
    },
  ],
  terms: [
    { term: "API", def: { en: "A defined interface that lets one program request data or actions from another.", hi: "Ek defined interface jisse ek program doosre program se data ya action maang sakta hai." } },
    { term: "REST", def: { en: "An architectural style for APIs built on six constraints, used over HTTP in practice.", hi: "APIs ka ek architectural style jo chhe constraints par bana hai, aur practice mein HTTP par chalta hai." } },
    { term: "URI", def: { en: "The identifier of a resource, for example https://10.10.10.50/api/v1/devices.", hi: "Resource ka identifier, jaise https://10.10.10.50/api/v1/devices." } },
    { term: "CRUD", def: { en: "Create, Read, Update, Delete: the four basic data operations, mapped to POST, GET, PUT/PATCH and DELETE.", hi: "Create, Read, Update, Delete: data ke chaar basic operations, jo POST, GET, PUT/PATCH aur DELETE se map hote hain." } },
    { term: "Stateless", def: { en: "The server keeps no client session between requests, so each request must carry its own authentication.", hi: "Server requests ke beech client ka koi session nahi rakhta, isliye har request mein apna authentication hona chahiye." } },
    { term: "Status code", def: { en: "The three-digit result of an HTTP request: 2xx success, 4xx client error, 5xx server error.", hi: "HTTP request ka teen digit ka result: 2xx success, 4xx client error, 5xx server error." } },
    { term: "Bearer token", def: { en: "A temporary token received after login and sent as Authorization: Bearer on each request.", hi: "Login ke baad mila temporary token jo har request mein Authorization: Bearer bankar jaata hai." } },
    { term: "OAuth", def: { en: "A framework that lets an application get an access token to act for a user without seeing the user's password.", hi: "Ek framework jisse application user ka password dekhe bina, user ki taraf se kaam karne ke liye access token le sakti hai." } },
  ],
  commands: [
    { cmd: "curl -X POST -u <user>:<password> <token-URI>", mode: "Linux / macOS / Windows terminal", does: { en: "Request a token using basic authentication", hi: "Basic authentication se token maango" } },
    { cmd: "curl -H \"Authorization: Bearer <token>\" <URI>", mode: "Linux / macOS / Windows terminal", does: { en: "Send a GET with a bearer token", hi: "Bearer token ke saath GET bhejo" } },
    { cmd: "curl -X DELETE -H \"Authorization: Bearer <token>\" <URI>", mode: "Linux / macOS / Windows terminal", does: { en: "Delete the resource at that URI", hi: "Us URI wale resource ko delete karo" } },
    { cmd: "curl -i <URI>", mode: "Linux / macOS / Windows terminal", does: { en: "Show the response status line and headers as well as the body", hi: "Body ke saath response ki status line aur headers bhi dikhao" } },
  ],
  mistakes: [
    {
      en: "Mapping Create to PUT and Update to POST. On the exam, Create is POST and Update is PUT or PATCH.",
      hi: "Create ko PUT aur Update ko POST se map karna. Exam mein Create POST hai, aur Update PUT ya PATCH.",
    },
    {
      en: "Treating 401 and 403 as the same. 401 means the server does not know who you are; 403 means it knows and refuses.",
      hi: "401 aur 403 ko same samajhna. 401 ka matlab server ko pata nahi tum kaun ho; 403 ka matlab pata hai, phir bhi mana kar raha hai.",
    },
    {
      en: "Believing basic authentication is encrypted. Base64 is reversible by anyone; only HTTPS protects it.",
      hi: "Yeh maan lena ki basic authentication encrypted hai. Base64 ko koi bhi wapas decode kar sakta hai; use sirf HTTPS bachata hai.",
    },
    {
      en: "Thinking stateless means the server does not authenticate. It means every request must authenticate, because nothing is remembered between them.",
      hi: "Yeh sochna ki stateless ka matlab server authenticate nahi karta. Matlab yeh hai ki har request ko authenticate karna padta hai, kyunki beech mein kuch yaad nahi rehta.",
    },
    {
      en: "Reading 204 No Content as an error. It is a success that simply has no body, typical after a DELETE.",
      hi: "204 No Content ko error samajhna. Yeh success hai, bas body nahi hoti; DELETE ke baad aam hai.",
    },
    {
      en: "Calling REST a protocol. REST is an architectural style; HTTP is the protocol that carries it.",
      hi: "REST ko protocol bolna. REST ek architectural style hai; use carry karne wala protocol HTTP hai.",
    },
  ],
  recap: [
    { en: "A REST API is called with an HTTP method on a URI, with headers and an optional body; the answer is a status code, headers and a body.", hi: "REST API ko URI par HTTP method se call karte hain, headers aur optional body ke saath; jawab mein status code, headers aur body aati hai." },
    { en: "REST constraints: client-server, stateless, cacheable, uniform interface, layered system, and optional code on demand.", hi: "REST constraints: client-server, stateless, cacheable, uniform interface, layered system, aur optional code on demand." },
    { en: "CRUD: Create POST, Read GET, Update PUT/PATCH, Delete DELETE.", hi: "CRUD yaad rakho: Create ke liye POST, Read ke liye GET, Update ke liye PUT ya PATCH, aur Delete ke liye DELETE." },
    { en: "200 OK, 201 Created, 204 No Content; 400 bad request, 401 not authenticated, 403 not allowed, 404 not found, 500 server error.", hi: "200 OK, 201 Created, 204 No Content; 400 galat request, 401 authenticate nahi, 403 permission nahi, 404 mila nahi, 500 server error." },
    { en: "Content-Type labels the body you send, Accept asks for a format back, Authorization carries credentials or a token.", hi: "Content-Type bheji gayi body ka label hai, Accept wapas aane wala format maangta hai, Authorization credentials ya token le jaata hai." },
    { en: "Authentication: basic (Base64, needs HTTPS), API key, bearer token, OAuth for delegated access.", hi: "Authentication: basic (Base64, HTTPS zaroori), API key, bearer token, delegated access ke liye OAuth." },
  ],
  quiz: [
    {
      q: {
        en: "A script needs to rename VLAN 30 on a controller without sending the VLAN's other fields. Which HTTP method fits best?",
        hi: "Ek script ko controller par VLAN 30 ka naam badalna hai, VLAN ke baaki fields bheje bina. Kaunsa HTTP method sabse sahi hai?",
      },
      options: [
        { en: "POST", hi: "POST" },
        { en: "GET", hi: "GET" },
        { en: "PATCH", hi: "PATCH" },
        { en: "DELETE", hi: "DELETE" },
      ],
      answer: 2,
      explain: {
        en: "Renaming is an Update, and PATCH changes only the fields you send. PUT is also an Update method but replaces the whole resource, so you would have to send every field. POST creates a new resource.",
        hi: "Naam badalna Update hai, aur PATCH sirf bheje gaye fields badalta hai. PUT bhi Update method hai, lekin poora resource replace karta hai, toh har field bhejna padta. POST naya resource banata hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A script authenticates successfully with a read-only account, then sends DELETE /api/v1/vlans/30. Which response is most likely?",
        hi: "Ek script read-only account se successfully authenticate hoti hai, phir DELETE /api/v1/vlans/30 bhejti hai. Sabse likely response kaunsa hai?",
      },
      options: [
        { en: "401 Unauthorized", hi: "401 Unauthorized" },
        { en: "403 Forbidden", hi: "403 Forbidden" },
        { en: "404 Not Found", hi: "404 Not Found" },
        { en: "500 Internal Server Error", hi: "500 Internal Server Error" },
      ],
      answer: 1,
      explain: {
        en: "The server knows who the client is, so 401 does not fit. The account simply lacks permission to delete, which is 403 Forbidden.",
        hi: "Server ko pata hai client kaun hai, isliye 401 fit nahi hota. Account ke paas delete karne ki permission nahi hai, aur iska code 403 Forbidden hai.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "What does it mean that REST is stateless?",
        hi: "REST stateless hai, iska kya matlab hai?",
      },
      options: [
        { en: "Responses can never be cached", hi: "Responses kabhi cache nahi ho sakte" },
        { en: "The server does not check credentials", hi: "Server credentials check nahi karta" },
        { en: "The connection uses UDP instead of TCP", hi: "Connection TCP ki jagah UDP use karta hai" },
        { en: "Each request carries all the information needed to process it, including authentication", hi: "Har request mein use process karne ki saari jaankari hoti hai, authentication bhi" },
      ],
      answer: 3,
      explain: {
        en: "The server keeps no session state between requests, so every request must be self-contained, token included. Caching is a separate constraint, and REST over HTTPS runs on TCP.",
        hi: "Server requests ke beech koi session state nahi rakhta, isliye har request apne aap mein poori honi chahiye, token ke saath. Caching ek alag constraint hai, aur HTTPS par REST TCP par chalta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A script sends POST /api/v1/vlans with a valid body and token, and the controller creates VLAN 30 immediately. Which status code should come back?",
        hi: "Script valid body aur token ke saath POST /api/v1/vlans bhejti hai, aur controller turant VLAN 30 bana deta hai. Kaunsa status code aana chahiye?",
      },
      options: [
        { en: "201 Created", hi: "201 Created" },
        { en: "204 No Content", hi: "204 No Content" },
        { en: "301 Moved Permanently", hi: "301 Moved Permanently" },
        { en: "400 Bad Request", hi: "400 Bad Request" },
      ],
      answer: 0,
      explain: {
        en: "201 Created reports that a new resource exists, usually with its URI in a Location header. 204 is typical for a DELETE, and 400 would mean the request itself was malformed.",
        hi: "201 Created batata hai ki naya resource ban gaya, aam taur par Location header mein uske URI ke saath. 204 aam taur par DELETE ke baad aata hai, aur 400 ka matlab hota ki request hi galat bani thi.",
      },
      kind: "scenario",
    },
    {
      q: {
        en: "A script sends a JSON body in a POST. Which header tells the controller what format that body is in?",
        hi: "Script POST mein JSON body bhejti hai. Kaunsa header controller ko batata hai ki body kis format mein hai?",
      },
      options: [
        { en: "Accept: application/json", hi: "Accept: application/json" },
        { en: "Authorization: Bearer <token>", hi: "Authorization: Bearer <token>" },
        { en: "Content-Type: application/json", hi: "Content-Type: application/json" },
        { en: "Location: /api/v1/vlans/30", hi: "Location: /api/v1/vlans/30" },
      ],
      answer: 2,
      explain: {
        en: "Content-Type labels the body in the message it is attached to. Accept is the client asking for a format in the response, and Location is set by the server after a create.",
        hi: "Content-Type usi message ki body ko label karta hai jisme woh laga hai. Accept se client response ka format maangta hai, aur Location create ke baad server set karta hai.",
      },
      kind: "concept",
    },
    {
      q: {
        en: "A colleague captures traffic from a script that uses `Authorization: Basic bmV0YWRtaW46Q2lzY28xMjM=` over plain HTTP. What is the risk?",
        hi: "Ek colleague ek script ka traffic capture karta hai jo plain HTTP par `Authorization: Basic bmV0YWRtaW46Q2lzY28xMjM=` use karti hai. Risk kya hai?",
      },
      options: [
        { en: "None, because Basic authentication encrypts the password with AES", hi: "Koi nahi, kyunki Basic authentication password ko AES se encrypt karta hai" },
        { en: "Anyone with the capture can Base64-decode it to netadmin:Cisco123", hi: "Capture wala koi bhi ise Base64-decode karke netadmin:Cisco123 nikaal sakta hai" },
        { en: "The token expires too quickly", hi: "Token bahut jaldi expire hota hai" },
        { en: "The server will answer 403 to every request", hi: "Server har request ko 403 dega" },
      ],
      answer: 1,
      explain: {
        en: "Base64 is an encoding, not encryption, so the username and password are readable to anyone who sees the header. Basic authentication must only be used inside HTTPS.",
        hi: "Base64 encoding hai, encryption nahi, isliye header dekhne wala koi bhi username aur password padh sakta hai. Basic authentication sirf HTTPS ke andar hi use karna chahiye.",
      },
      kind: "scenario",
    },
  ],
  videos: [
    {
      id: "Luei0p-2h10",
      title: "Free CCNA | REST APIs | Day 61",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "REST constraints, CRUD and HTTP verbs, status codes and a live API call.", hi: "REST constraints, CRUD aur HTTP verbs, status codes aur ek live API call." },
    },
    {
      id: "bmqr_xpt6sc",
      title: "REST API Authentication | CCNA 200-301 Day 61 (part 2)",
      channel: "Jeremy's IT Lab",
      lang: "en",
      note: { en: "Basic auth, API keys, bearer tokens and OAuth, the v1.1 addition to this topic.", hi: "Basic auth, API keys, bearer tokens aur OAuth, jo is topic mein v1.1 ka addition hai." },
    },
    {
      id: "_7GjcZVz39U",
      title: "149. Free CCNA (NEW) | Rest Based APIs | Working of HTTP",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "REST and HTTP methods explained in Hindi.", hi: "REST aur HTTP methods Hindi mein samjhaye gaye hain." },
    },
    {
      id: "yfPKU2SoduI",
      title: "147. Free CCNA (NEW) | Understanding and Interpreting APIs",
      channel: "Network Nuggets",
      lang: "hi",
      note: { en: "What an API is and how to read one, in Hindi.", hi: "API kya hoti hai aur use kaise padhein, Hindi mein." },
    },
  ],
  lab: {
    title: { en: "Call a real controller API", hi: "Ek asli controller API call karo" },
    steps: [
      {
        en: "Open Cisco DevNet's free always-on Catalyst Center sandbox. The sandbox page lists the current URL and read-only username and password.",
        hi: "Cisco DevNet ka free always-on Catalyst Center sandbox kholo. Sandbox page par current URL aur read-only username-password diye hote hain.",
      },
      {
        en: "With curl or Postman, send `POST /dna/system/api/v1/auth/token` using basic authentication. Note the status code and copy the token from the JSON body.",
        hi: "curl ya Postman se basic authentication ke saath `POST /dna/system/api/v1/auth/token` bhejo. Status code note karo aur JSON body se token copy karo.",
      },
      {
        en: "Send `GET /dna/intent/api/v1/network-device` with the header `X-Auth-Token: <token>`. Find the hostname and management IP of one device in the response.",
        hi: "Header `X-Auth-Token: <token>` ke saath `GET /dna/intent/api/v1/network-device` bhejo. Response mein kisi ek device ka hostname aur management IP dhoondho.",
      },
      {
        en: "Repeat the GET with one character of the token changed. Which status code comes back, and why that one?",
        hi: "Token ka ek character badal kar wahi GET dobara bhejo. Kaunsa status code aaya, aur wahi kyun?",
      },
      {
        en: "Change the path to a resource that does not exist, such as `/dna/intent/api/v1/network-devicez`, and compare the code with the previous step.",
        hi: "Path ko kisi aise resource par badlo jo exist nahi karta, jaise `/dna/intent/api/v1/network-devicez`, aur code ko pichhle step se compare karo.",
      },
    ],
  },
};

export default lesson;
