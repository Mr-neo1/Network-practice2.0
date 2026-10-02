import type { SequenceScene } from "../types.ts";

// Colours: purple = PC1 <-> resolver (recursive), blue = resolver queries (iterative),
// orange = referral, green = answer with records.
// Addressing matches the lesson: PC1 192.168.10.11 uses resolver 8.8.8.8;
// a.root-servers.net 198.41.0.4, a.gtld-servers.net 192.5.6.30,
// ns1.example.com 198.51.100.53 holds www.example.com A 203.0.113.5.

const scene: SequenceScene = {
  kind: "sequence",
  id: "dns",
  title: { en: "Resolving www.example.com, then from cache", hi: "www.example.com resolve karna, phir cache se" },
  actors: [
    { id: "pc", label: "PC1", kind: "pc", sub: "192.168.10.11" },
    { id: "res", label: "Resolver", kind: "server", sub: "8.8.8.8" },
    { id: "root", label: "Root", kind: "server", sub: "198.41.0.4" },
    { id: "tld", label: ".com TLD", kind: "server", sub: "192.5.6.30" },
    { id: "auth", label: "Authoritative", kind: "server", sub: "ns1 198.51.100.53" },
  ],
  steps: [
    {
      title: { en: "PC1 sends one recursive query", hi: "PC1 ek recursive query bhejta hai" },
      text: {
        en: "PC1 needs the IPv4 address of www.example.com. Its own cache and hosts file have nothing, so it asks its configured DNS server, the resolver 8.8.8.8, in one UDP datagram to port 53. The query is recursive: \"find the full answer for me\". The resolver's cache is empty too.",
        hi: "PC1 ko www.example.com ka IPv4 address chahiye. Uske apne cache aur hosts file mein kuch nahi hai, isliye woh apne configured DNS server, yaani resolver 8.8.8.8, se ek UDP datagram mein port 53 par poochta hai. Query recursive hai: \"poora answer tum dhoondh kar do\". Resolver ka cache bhi khaali hai.",
      },
      messages: [{ from: "pc", to: "res", label: "A? www.example.com", detail: "UDP 53 · recursive", tone: "purple" }],
      note: { actor: "res", text: "Not in cache" },
    },
    {
      title: { en: "Root: \"ask the .com servers\"", hi: "Root: \".com servers se poocho\"" },
      text: {
        en: "The resolver starts at the top. It knows the root server addresses from its built-in root hints and asks a.root-servers.net. The root does not know www.example.com, but it knows who runs .com, so it returns a referral: the .com name servers and their addresses.",
        hi: "Resolver top se shuru karta hai. Root servers ke addresses use built-in root hints se pata hain, toh woh a.root-servers.net se poochta hai. Root ko www.example.com nahi pata, lekin use pata hai .com kaun chalata hai, isliye woh referral deta hai: .com ke name servers aur unke addresses.",
      },
      messages: [
        { from: "res", to: "root", label: "A? www.example.com", detail: "iterative", tone: "blue" },
        { from: "root", to: "res", label: "Referral: com NS", detail: "a.gtld-servers.net", tone: "orange", dashed: true },
      ],
    },
    {
      title: { en: "TLD: \"ask example.com's server\"", hi: "TLD: \"example.com ke server se poocho\"" },
      text: {
        en: "The resolver asks a .com server, 192.5.6.30. The .com TLD does not hold the records of example.com either, but it knows the domain's authoritative name server: ns1.example.com, 198.51.100.53. It sends another referral, with that address included as glue.",
        hi: "Resolver ek .com server, 192.5.6.30, se poochta hai. .com TLD ke paas bhi example.com ke records nahi hain, lekin use domain ka authoritative name server pata hai: ns1.example.com, 198.51.100.53. Woh ek aur referral bhejta hai, jisme yeh address glue ke roop mein hota hai.",
      },
      messages: [
        { from: "res", to: "tld", label: "A? www.example.com", detail: "iterative", tone: "blue" },
        { from: "tld", to: "res", label: "Referral: example.com NS", detail: "ns1.example.com + glue", tone: "orange", dashed: true },
      ],
    },
    {
      title: { en: "The authoritative server answers", hi: "Authoritative server jawab deta hai" },
      text: {
        en: "ns1.example.com holds the zone, so it gives a real answer: www.example.com A 203.0.113.5 with a TTL of 3600 seconds. The AA (authoritative answer) flag is set because it comes from the source, not from a cache.",
        hi: "ns1.example.com ke paas zone hai, isliye woh asli answer deta hai: www.example.com A 203.0.113.5, TTL 3600 seconds. AA (authoritative answer) flag set hota hai kyunki answer seedha source se aa raha hai, kisi cache se nahi.",
      },
      messages: [
        { from: "res", to: "auth", label: "A? www.example.com", detail: "iterative", tone: "blue" },
        { from: "auth", to: "res", label: "A 203.0.113.5", detail: "TTL 3600 · AA flag", tone: "green", dashed: true },
      ],
    },
    {
      title: { en: "Resolver replies and caches", hi: "Resolver reply karta hai aur cache karta hai" },
      text: {
        en: "The resolver caches the answer for 3600 seconds, plus the two referrals (the .com and example.com name servers, which have long TTLs of their own), and sends the answer to PC1. That reply has no AA flag, because the resolver does not own the zone; it only passes the answer on. PC1 caches it too and can now open its TCP connection to 203.0.113.5.",
        hi: "Resolver answer ko 3600 seconds ke liye cache karta hai, saath mein dono referrals bhi (.com aur example.com ke name servers, jinke apne lambe TTL hote hain), aur answer PC1 ko bhejta hai. Is reply mein AA flag nahi hota, kyunki zone resolver ka nahi hai; woh sirf answer aage pass karta hai. PC1 bhi ise cache karta hai aur ab 203.0.113.5 se TCP connection khol sakta hai.",
      },
      messages: [{ from: "res", to: "pc", label: "A 203.0.113.5", detail: "TTL 3600 · no AA flag", tone: "green", dashed: true }],
      note: { actor: "res", text: "Cached 3600 s" },
    },
    {
      title: { en: "Ten minutes later: answered from cache", hi: "Das minute baad: cache se jawab" },
      text: {
        en: "PC1's cache was flushed with `ipconfig /flushdns`, so it asks again. The resolver still holds the record, now with about 3000 seconds of TTL left, so it answers at once with no root, TLD or authoritative queries. As in the first lookup, the answer comes from the resolver and not from ns1.example.com, so nslookup labels it \"Non-authoritative answer\".",
        hi: "PC1 ka cache `ipconfig /flushdns` se clear kiya gaya, isliye woh dobara poochta hai. Resolver ke paas record abhi bhi hai, ab lagbhag 3000 seconds TTL bacha hai, toh woh root, TLD ya authoritative se kuch poochhe bina turant jawab deta hai. Pehle lookup ki tarah answer resolver se aa raha hai, ns1.example.com se nahi, isliye nslookup ise \"Non-authoritative answer\" dikhata hai.",
      },
      messages: [
        { from: "pc", to: "res", label: "A? www.example.com", detail: "UDP 53 · recursive", tone: "purple" },
        { from: "res", to: "pc", label: "A 203.0.113.5", detail: "from cache · TTL 3000", tone: "green", dashed: true },
      ],
    },
    {
      title: { en: "AAAA lookup skips root and TLD", hi: "AAAA lookup root aur TLD skip karta hai" },
      text: {
        en: "PC1 now asks for the IPv6 address, an AAAA record. The resolver has no AAAA answer cached, but it still has the example.com referral, so it goes straight to ns1.example.com. One query instead of three: caching the referrals is what keeps the root and TLD servers from being flooded.",
        hi: "Ab PC1 IPv6 address maangta hai, yaani AAAA record. Resolver ke cache mein AAAA answer nahi hai, lekin example.com wala referral abhi bhi hai, isliye woh seedha ns1.example.com se poochta hai. Teen ki jagah ek query: referrals cache karne se hi root aur TLD servers par load kam rehta hai.",
      },
      messages: [
        { from: "pc", to: "res", label: "AAAA? www.example.com", detail: "recursive", tone: "purple" },
        { from: "res", to: "auth", label: "AAAA? www.example.com", detail: "straight to ns1", tone: "blue" },
        { from: "auth", to: "res", label: "AAAA 2001:db8:5::5", detail: "TTL 3600 · AA flag", tone: "green", dashed: true },
        { from: "res", to: "pc", label: "AAAA 2001:db8:5::5", detail: "TTL 3600", tone: "green", dashed: true },
      ],
      note: { actor: "pc", text: "IPv4 + IPv6 known" },
    },
  ],
};

export default scene;
