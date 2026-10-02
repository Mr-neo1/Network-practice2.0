import type { TopologyScene } from "../types.ts";

// Colours: blue = request, green = reply.
// The home router box is drawn as its three parts (AP, switch, router) so the learner
// can see which part each trip uses.

const scene: TopologyScene = {
  kind: "topology",
  id: "what-is-a-network",
  title: { en: "A home network: one trip stays local, one goes to the internet", hi: "Ghar ka network: ek trip local rehti hai, ek internet tak jaati hai" },
  height: 420,
  nodes: [
    { id: "laptop", kind: "laptop", x: 80, y: 80, label: "Laptop", sub: "192.168.1.10" },
    { id: "phone", kind: "phone", x: 80, y: 210, label: "Phone", sub: "192.168.1.11" },
    { id: "tv", kind: "pc", x: 80, y: 340, label: "Smart TV", sub: "192.168.1.12" },
    { id: "ap", kind: "ap", x: 215, y: 210, label: "Wi-Fi AP" },
    { id: "sw", kind: "switch", x: 340, y: 210, label: "Switch" },
    { id: "printer", kind: "printer", x: 340, y: 350, label: "Printer", sub: "192.168.1.20" },
    { id: "rtr", kind: "router", x: 465, y: 210, label: "Router", sub: "192.168.1.1", sub2: "WAN 203.0.113.25" },
    { id: "isp", kind: "cloud", x: 600, y: 210, label: "ISP" },
    { id: "internet", kind: "internet", x: 710, y: 100, label: "Internet" },
    { id: "server", kind: "server", x: 710, y: 330, label: "Web server", sub: "198.51.100.10" },
  ],
  links: [
    { id: "l-laptop", a: "laptop", b: "ap", style: "wireless" },
    { id: "l-phone", a: "phone", b: "ap", style: "wireless" },
    { id: "l-tv", a: "tv", b: "ap", style: "wireless" },
    { id: "l-ap-sw", a: "ap", b: "sw", style: "copper" },
    { id: "l-printer", a: "printer", b: "sw", style: "copper", label: "Ethernet" },
    { id: "l-sw-rtr", a: "sw", b: "rtr", style: "copper" },
    { id: "l-wan", a: "rtr", b: "isp", style: "fiber", label: "fiber" },
    { id: "l-isp-net", a: "isp", b: "internet", style: "fiber" },
    { id: "l-net-srv", a: "internet", b: "server", style: "fiber" },
  ],
  steps: [
    {
      title: { en: "Your home network", hi: "Tumhare ghar ka network" },
      text: {
        en: "The laptop, phone and TV join over Wi-Fi; the printer is plugged in with a cable. The box your ISP installed does three jobs, so it is drawn here as three devices: a Wi-Fi access point, a switch and a router.",
        hi: "Laptop, phone aur TV Wi-Fi se jude hain; printer cable se laga hai. ISP ne jo box lagaya hai woh teen kaam karta hai, isliye yahan use teen devices ki tarah dikhaya hai: Wi-Fi access point, switch aur router.",
      },
      focus: ["ap", "sw", "rtr"],
      badges: [
        { node: "ap", text: "home box", tone: "purple" },
        { node: "sw", text: "home box", tone: "purple" },
        { node: "rtr", text: "home box", tone: "purple" },
      ],
    },
    {
      title: { en: "LAN on the left, WAN on the right", hi: "Left mein LAN, right mein WAN" },
      text: {
        en: "Everything from the router leftwards is your LAN: your devices, in one place, run by you. The fiber from the router to the ISP is a WAN link. The ISP connects to thousands of other networks, and together they form the internet.",
        hi: "Router se left tak sab kuch tumhara LAN hai: tumhare devices, ek jagah par, tumhare control mein. Router se ISP tak jo fiber hai woh WAN link hai. ISP hazaaron doosre networks se juda hai, aur yeh sab milkar internet banate hain.",
      },
      focus: ["rtr", "isp", "internet"],
      badges: [
        { node: "ap", text: "" },
        { node: "sw", text: "" },
        { node: "rtr", text: "" },
      ],
      links: [{ id: "l-wan", state: "active", note: "WAN link" }],
    },
    {
      title: { en: "A print job stays inside the LAN", hi: "Print job LAN ke andar hi rehta hai" },
      text: {
        en: "The laptop, as client, sends a print job to the printer at 192.168.1.20. That is in the laptop's own network (192.168.1.x), so it goes straight across: Wi-Fi to the AP, through the switch, down the cable. The router part is not used.",
        hi: "Laptop client ban kar printer (192.168.1.20) ko print job bhejta hai. Yeh address laptop ke apne network (192.168.1.x) mein hai, isliye data seedha jaata hai: Wi-Fi se AP, phir switch, phir cable se printer. Router wala part use hi nahi hota.",
      },
      packets: [{ path: ["laptop", "ap", "sw", "printer"], label: "Print job", tone: "blue" }],
      badges: [
        { node: "laptop", text: "client", tone: "blue" },
        { node: "printer", text: "server", tone: "green" },
      ],
      links: [{ id: "l-wan", state: "dim" }],
    },
    {
      title: { en: "The printer answers locally", hi: "Printer local hi jawab deta hai" },
      text: {
        en: "The printer sends a status reply back along the same path. The whole conversation used only LAN links, so printing still works when the internet connection is down.",
        hi: "Printer usi raaste se status reply wapas bhejta hai. Poori baatcheet sirf LAN links par hui, isliye internet band ho tab bhi printing chalti rahegi.",
      },
      packets: [{ path: ["printer", "sw", "ap", "laptop"], label: "Status: OK", tone: "green" }],
    },
    {
      title: { en: "A website is outside the LAN", hi: "Website LAN ke bahar hai" },
      text: {
        en: "Now the browser asks for a page from the web server at 198.51.100.10. That is not a 192.168.1.x address, so the laptop hands the request to its default gateway: the router at 192.168.1.1.",
        hi: "Ab browser web server (198.51.100.10) se page maangta hai. Yeh 192.168.1.x wala address nahi hai, isliye laptop request apne default gateway ko de deta hai, yaani router ko jiska address 192.168.1.1 hai.",
      },
      packets: [{ path: ["laptop", "ap", "sw", "rtr"], label: "Web request", tone: "blue" }],
      badges: [
        { node: "printer", text: "" },
        { node: "rtr", text: "gateway", tone: "orange" },
      ],
      links: [{ id: "l-wan", state: "normal" }],
      focus: ["laptop", "rtr"],
    },
    {
      title: { en: "The router sends it out to the ISP", hi: "Router use ISP ki taraf bhejta hai" },
      text: {
        en: "The router forwards the request over the WAN link. On the way out it swaps the laptop's private address for the home's public address, 203.0.113.25 (this is NAT, lesson 4.3). The ISP and the networks beyond it carry the request to the server.",
        hi: "Router request ko WAN link par forward karta hai. Bahar bhejte waqt woh laptop ka private address hata kar ghar ka public address 203.0.113.25 laga deta hai (isse NAT kehte hain, lesson 4.3). Phir ISP aur uske aage ke networks request ko server tak pahunchaate hain.",
      },
      packets: [{ path: ["rtr", "isp", "internet", "server"], label: "Web request", tone: "blue" }],
      links: [{ id: "l-wan", state: "active" }],
    },
    {
      title: { en: "The page comes back", hi: "Page wapas aata hai" },
      text: {
        en: "The web server replies to 203.0.113.25. The router remembers which inside device asked, so it passes the page back through the switch and AP to the laptop at 192.168.1.10.",
        hi: "Web server 203.0.113.25 ko reply karta hai. Router ko yaad hai ki andar kis device ne poocha tha, isliye woh page switch aur AP ke through laptop (192.168.1.10) tak pahuncha deta hai.",
      },
      packets: [{ path: ["server", "internet", "isp", "rtr", "sw", "ap", "laptop"], label: "Web page", tone: "green" }],
      badges: [
        { node: "rtr", text: "" },
        { node: "server", text: "server", tone: "green" },
      ],
    },
    {
      title: { en: "Near is fast, far is slow: latency", hi: "Paas wala fast, door wala slow: latency" },
      text: {
        en: "Ping times the round trip. The printer answers in about 3 ms; the web server takes about 38 ms, because the data travels much farther through more devices. That delay is latency. The 100 Mbps on your plan is bandwidth: how much data per second the WAN link can carry.",
        hi: "Ping round trip ka time naapta hai. Printer lagbhag 3 ms mein jawab deta hai; web server ko lagbhag 38 ms lagte hain, kyunki data kaafi door aur zyada devices se hokar jaata hai. Yahi delay latency hai. Tumhare plan ka 100 Mbps bandwidth hai: WAN link ek second mein kitna data le ja sakta hai.",
      },
      focus: ["laptop"],
      badges: [
        { node: "laptop", text: "" },
        { node: "server", text: "" },
      ],
      links: [{ id: "l-wan", state: "active", note: "100 Mbps" }],
      tables: [
        {
          node: "laptop",
          title: "Laptop ping results",
          columns: ["Destination", "Round trip"],
          rows: [
            ["192.168.1.20 (printer)", "3 ms"],
            ["198.51.100.10 (web server)", "38 ms"],
          ],
          hl: [0, 1],
        },
      ],
    },
  ],
};

export default scene;
