import type { SequenceScene } from "../types.ts";

// Colours: purple = UDP (DNS), blue = TCP handshake, green = TCP data,
// gray = TCP acknowledgment, orange = TCP close, red = lost on the way.

const scene: SequenceScene = {
  kind: "sequence",
  id: "tcp-udp",
  title: { en: "UDP for the name lookup, TCP for the data", hi: "Name lookup ke liye UDP, data ke liye TCP" },
  actors: [
    { id: "dns", label: "DNS server", kind: "server", sub: "8.8.8.8" },
    { id: "client", label: "Laptop", kind: "laptop", sub: "10.1.1.10" },
    { id: "server", label: "Web server", kind: "server", sub: "203.0.113.5" },
  ],
  steps: [
    {
      title: { en: "UDP: the DNS query is lost", hi: "UDP: DNS query kho gayi" },
      text: {
        en: "Before it can connect to www.example.com, the laptop needs its IP address. It sends a DNS query in one UDP datagram from port 51999 to port 53, with no handshake first. The datagram is lost on the way, and UDP neither notices nor resends it.",
        hi: "www.example.com se connect karne se pehle laptop ko uska IP address chahiye. Woh ek hi UDP datagram mein DNS query bhejta hai, port 51999 se port 53 par, bina kisi handshake ke. Datagram raaste mein kho jaata hai, aur UDP ko na pata chalta hai, na woh use dobara bhejta hai.",
      },
      messages: [{ from: "client", to: "dns", label: "DNS query", detail: "UDP 51999 → 53 · lost", tone: "red", drop: true }],
    },
    {
      title: { en: "The application retries, not UDP", hi: "Retry application karti hai, UDP nahi" },
      text: {
        en: "The DNS client software on the laptop runs its own timer. When no answer arrives, it sends the query again, and this time the answer comes back: www.example.com is 203.0.113.5. One question, one answer, nothing to open or close.",
        hi: "Laptop ka DNS client software apna khud ka timer chalata hai. Jawab nahi aaya, toh woh query dobara bhejta hai, aur is baar answer aa jaata hai: www.example.com ka IP 203.0.113.5 hai. Ek sawaal, ek jawab, na kuch kholna na band karna.",
      },
      messages: [
        { from: "client", to: "dns", label: "DNS query (retry)", detail: "UDP → port 53", tone: "purple" },
        { from: "dns", to: "client", label: "DNS answer", detail: "203.0.113.5 · from port 53", tone: "purple", dashed: true },
      ],
    },
    {
      title: { en: "SYN: ask to open a connection", hi: "SYN: connection kholne ki request" },
      text: {
        en: "Now TCP. The laptop picks a free source port, 51514, and sends a segment with only the SYN flag set to port 80. It carries the laptop's starting sequence number, 1000 here; real ones are random 32-bit numbers.",
        hi: "Ab TCP. Laptop ek free source port chunta hai, 51514, aur port 80 par sirf SYN flag wala segment bhejta hai. Isme laptop ka starting sequence number hota hai, yahan 1000; asli mein yeh random 32-bit number hota hai.",
      },
      messages: [{ from: "client", to: "server", label: "SYN", detail: "51514 → 80 · seq=1000", tone: "blue" }],
    },
    {
      title: { en: "SYN-ACK: acknowledge and answer", hi: "SYN-ACK: acknowledge bhi, jawab bhi" },
      text: {
        en: "The server sets both SYN and ACK. ack=1001 means \"I have your 1000, send 1001 next\", because a SYN counts as one byte. It adds its own starting number, 5000, and a window of 2000 bytes: the most the laptop may send before it must wait for an ACK.",
        hi: "Server SYN aur ACK dono flags set karta hai. ack=1001 ka matlab \"tumhara 1000 mil gaya, ab 1001 bhejo\", kyunki SYN ek byte gina jaata hai. Saath mein apna starting number 5000 aur 2000 bytes ka window bhejta hai: laptop ACK ka wait kiye bina maximum itna hi bhej sakta hai.",
      },
      messages: [{ from: "server", to: "client", label: "SYN-ACK", detail: "seq=5000 ack=1001 win=2000", tone: "blue", dashed: true }],
    },
    {
      title: { en: "ACK: the connection is established", hi: "ACK: connection ban gaya" },
      text: {
        en: "The laptop acknowledges the server's SYN with ack=5001. After three segments both sides know each other's starting number, and the connection is ESTABLISHED. No application data has moved yet.",
        hi: "Laptop ack=5001 bhej kar server ka SYN acknowledge karta hai. Teen segments ke baad dono ko ek doosre ka starting number pata hai, aur connection ESTABLISHED hai. Abhi tak koi application data nahi gaya.",
      },
      messages: [{ from: "client", to: "server", label: "ACK", detail: "seq=1001 ack=5001", tone: "blue" }],
      note: { actor: "server", text: "ESTABLISHED" },
    },
    {
      title: { en: "Windowing: two segments, one ACK", hi: "Windowing: do segments, ek ACK" },
      text: {
        en: "The laptop has 3000 bytes to send, in 1000-byte segments. The window is 2000, so it sends bytes 1001-3000 back to back without waiting. The server's single ack=3001 confirms both segments and slides the window forward.",
        hi: "Laptop ko 3000 bytes bhejne hain, 1000-1000 bytes ke segments mein. Window 2000 hai, isliye woh bytes 1001-3000 bina ruke ek ke baad ek bhej deta hai. Server ka ek hi ack=3001 dono segments confirm karta hai aur window aage slide ho jaata hai.",
      },
      messages: [
        { from: "client", to: "server", label: "Data 1000 B", detail: "seq=1001", tone: "green" },
        { from: "client", to: "server", label: "Data 1000 B", detail: "seq=2001", tone: "green" },
        { from: "server", to: "client", label: "ACK", detail: "ack=3001 win=2000", tone: "gray", dashed: true },
      ],
    },
    {
      title: { en: "A lost segment is sent again", hi: "Khoya hua segment dobara jaata hai" },
      text: {
        en: "The last 1000 bytes (seq=3001) are lost on the way. No ACK arrives before the laptop's retransmission timer expires, so TCP resends the same bytes with the same sequence number. ack=4001 confirms all 3000 bytes arrived, and the application never saw a problem.",
        hi: "Aakhri 1000 bytes (seq=3001) raaste mein kho jaate hain. Laptop ka retransmission timer expire hone tak koi ACK nahi aata, isliye TCP wahi bytes wahi sequence number ke saath dobara bhejta hai. ack=4001 confirm karta hai ki saare 3000 bytes pahunch gaye, aur application ko kuch pata bhi nahi chala.",
      },
      messages: [
        { from: "client", to: "server", label: "Data 1000 B", detail: "seq=3001 · lost", tone: "red", drop: true },
        { from: "client", to: "server", label: "Data 1000 B (resent)", detail: "seq=3001", tone: "green" },
        { from: "server", to: "client", label: "ACK", detail: "ack=4001", tone: "gray", dashed: true },
      ],
    },
    {
      title: { en: "FIN, ACK: the laptop has finished", hi: "FIN, ACK: laptop ka kaam khatam" },
      text: {
        en: "The laptop sets FIN to close its own direction. A FIN uses one sequence number, like a SYN, so the server acknowledges 4002. The server could still send data in its direction until it closes it.",
        hi: "Laptop FIN set karke apni direction band karta hai. SYN ki tarah FIN bhi ek sequence number leta hai, isliye server 4002 acknowledge karta hai. Server apni direction mein tab tak data bhej sakta hai jab tak woh use band na kare.",
      },
      messages: [
        { from: "client", to: "server", label: "FIN", detail: "seq=4001", tone: "orange" },
        { from: "server", to: "client", label: "ACK", detail: "ack=4002", tone: "orange", dashed: true },
      ],
    },
    {
      title: { en: "FIN, ACK: the server closes too", hi: "FIN, ACK: server bhi band karta hai" },
      text: {
        en: "The server sends its own FIN and the laptop acknowledges it. Four segments closed the two directions: the four-way close. All this setup and acknowledging is the price of TCP's reliability, and it is exactly what UDP skipped for the DNS lookup.",
        hi: "Server apna FIN bhejta hai aur laptop use acknowledge karta hai. Chaar segments ne dono directions band ki: yahi four-way close hai. Yeh saara setup aur acknowledging TCP ki reliability ki keemat hai, aur DNS lookup mein UDP ne yahi sab skip kiya tha.",
      },
      messages: [
        { from: "server", to: "client", label: "FIN", detail: "seq=5001", tone: "orange", dashed: true },
        { from: "client", to: "server", label: "ACK", detail: "ack=5002", tone: "orange" },
      ],
      note: { actor: "server", text: "CLOSED" },
    },
  ],
};

export default scene;
