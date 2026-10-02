import type { SequenceScene } from "../types.ts";

// Colours: purple = authentication, blue = read (GET), green = create/update/delete,
// teal = controller to device (southbound), red = rejected.
// Script 10.10.10.5 calls https://10.10.10.50/api/v1/...; the controller manages SW1 (10.10.10.11).

const scene: SequenceScene = {
  kind: "sequence",
  id: "rest-apis",
  title: { en: "A script drives the network through a controller's REST API", hi: "Ek script controller ki REST API se network chalati hai" },
  actors: [
    { id: "script", label: "Python script", kind: "laptop", sub: "10.10.10.5" },
    { id: "ctrl", label: "Controller API", kind: "controller", sub: "10.10.10.50:443" },
    { id: "sw1", label: "SW1", kind: "switch", sub: "10.10.10.11" },
  ],
  steps: [
    {
      title: { en: "POST for a token, using basic auth", hi: "Basic auth se token ke liye POST" },
      text: {
        en: "The script sends POST /api/v1/auth/token over HTTPS with the header Authorization: Basic and the Base64 of netadmin:Cisco123. The controller checks the password and answers 200 OK with a JSON body holding a temporary token. The password has now crossed the network for the only time.",
        hi: "Script HTTPS par POST /api/v1/auth/token bhejti hai, header Authorization: Basic ke saath, jisme netadmin:Cisco123 ka Base64 hai. Controller password check karta hai aur 200 OK ke saath ek JSON body deta hai jisme temporary token hai. Password ab network par pehli aur aakhri baar gaya.",
      },
      messages: [
        { from: "script", to: "ctrl", label: "POST /api/v1/auth/token", detail: "Authorization: Basic bmV0YWRtaW46...", tone: "purple" },
        { from: "ctrl", to: "script", label: "200 OK", detail: "{\"token\": \"eyJhbGciOi...\"}", tone: "purple", dashed: true },
      ],
      note: { actor: "ctrl", text: "token valid 60 min" },
    },
    {
      title: { en: "GET the device list: 200 and JSON", hi: "Device list ka GET: 200 aur JSON" },
      text: {
        en: "Read is GET. The script sends GET /api/v1/devices with Authorization: Bearer and the token, plus Accept: application/json. The controller answers from its own inventory, so SW1 is not contacted at all. The 200 OK body is a JSON list with SW1, SW2 and SW3.",
        hi: "Read matlab GET. Script GET /api/v1/devices bhejti hai, Authorization: Bearer ke saath token aur Accept: application/json. Controller apni inventory se jawab deta hai, isliye SW1 se baat hi nahi hoti. 200 OK ki body ek JSON list hai jisme SW1, SW2 aur SW3 hain.",
      },
      messages: [
        { from: "script", to: "ctrl", label: "GET /api/v1/devices", detail: "Bearer eyJhbGciOi... · Accept: application/json", tone: "blue" },
        { from: "ctrl", to: "script", label: "200 OK", detail: "[{\"hostname\": \"SW1\", ...}, ...] 3 devices", tone: "blue", dashed: true },
      ],
    },
    {
      title: { en: "POST a new VLAN: 201 Created", hi: "Naye VLAN ka POST: 201 Created" },
      text: {
        en: "Create is POST to the collection. The body {\"id\": 30, \"name\": \"VOICE\"} is labelled Content-Type: application/json. The controller configures VLAN 30 on SW1 through its southbound interface, then answers 201 Created with the new resource's URI in the Location header.",
        hi: "Create matlab collection par POST. Body {\"id\": 30, \"name\": \"VOICE\"} par Content-Type: application/json ka label hai. Controller apne southbound interface se SW1 par VLAN 30 configure karta hai, phir 201 Created ke saath Location header mein naye resource ka URI deta hai.",
      },
      messages: [
        { from: "script", to: "ctrl", label: "POST /api/v1/vlans", detail: "{\"id\": 30, \"name\": \"VOICE\"}", tone: "green" },
        { from: "ctrl", to: "sw1", label: "vlan 30 / name VOICE", detail: "southbound: SSH or NETCONF", tone: "teal" },
        { from: "ctrl", to: "script", label: "201 Created", detail: "Location: /api/v1/vlans/30", tone: "green", dashed: true },
      ],
      note: { actor: "sw1", text: "VLAN 30 VOICE" },
    },
    {
      title: { en: "PATCH one field: 200 OK", hi: "Ek field ka PATCH: 200 OK" },
      text: {
        en: "Update can be PUT or PATCH. PATCH /api/v1/vlans/30 sends only the field that changes, {\"name\": \"VOICE-HQ\"}. The controller renames the VLAN on SW1 and returns 200 OK with the updated object.",
        hi: "Update PUT ya PATCH ho sakta hai. PATCH /api/v1/vlans/30 sirf badalne wala field bhejta hai, {\"name\": \"VOICE-HQ\"}. Controller SW1 par VLAN ka naam badalta hai aur 200 OK ke saath updated object lautata hai.",
      },
      messages: [
        { from: "script", to: "ctrl", label: "PATCH /api/v1/vlans/30", detail: "{\"name\": \"VOICE-HQ\"}", tone: "green" },
        { from: "ctrl", to: "sw1", label: "vlan 30 / name VOICE-HQ", detail: "southbound", tone: "teal" },
        { from: "ctrl", to: "script", label: "200 OK", detail: "{\"id\": 30, \"name\": \"VOICE-HQ\"}", tone: "green", dashed: true },
      ],
      note: { actor: "sw1", text: "VLAN 30 VOICE-HQ" },
    },
    {
      title: { en: "DELETE the VLAN: 204 No Content", hi: "VLAN ka DELETE: 204 No Content" },
      text: {
        en: "Delete is DELETE on the resource's own URI, with no body. The controller removes VLAN 30 from SW1 and answers 204 No Content: the operation worked and there is simply nothing to send back.",
        hi: "Delete matlab resource ke apne URI par DELETE, bina body ke. Controller SW1 se VLAN 30 hata deta hai aur 204 No Content deta hai: kaam ho gaya, bas lautane ko kuch nahi hai.",
      },
      messages: [
        { from: "script", to: "ctrl", label: "DELETE /api/v1/vlans/30", detail: "Bearer eyJhbGciOi...", tone: "green" },
        { from: "ctrl", to: "sw1", label: "no vlan 30", detail: "southbound", tone: "teal" },
        { from: "ctrl", to: "script", label: "204 No Content", detail: "empty body", tone: "green", dashed: true },
      ],
      note: { actor: "sw1", text: "VLAN 30 removed" },
    },
    {
      title: { en: "An hour later: 401 Unauthorized", hi: "Ek ghante baad: 401 Unauthorized" },
      text: {
        en: "The script reuses the same token after it has expired. REST is stateless, so the controller judges this request on its own: the token is no longer valid, and it answers 401 Unauthorized without touching any data. The fix is to POST for a new token, not to change permissions.",
        hi: "Script wahi token expire hone ke baad dobara use karti hai. REST stateless hai, isliye controller is request ko akele judge karta hai: token ab valid nahi, toh woh bina kisi data ko chhuye 401 Unauthorized deta hai. Iska fix naye token ke liye POST karna hai, permissions badalna nahi.",
      },
      messages: [
        { from: "script", to: "ctrl", label: "GET /api/v1/devices", detail: "Bearer eyJhbGciOi... (expired)", tone: "blue" },
        { from: "ctrl", to: "script", label: "401 Unauthorized", detail: "{\"error\": \"token expired\"}", tone: "red", dashed: true },
      ],
      note: { actor: "ctrl", text: "token expired" },
    },
  ],
};

export default scene;
