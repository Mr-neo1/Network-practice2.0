import type { SequenceScene } from "../types.ts";

// R1 Gi0/0 10.1.1.1 is the client for both transfers.
// TFTP server 10.1.1.100 holds the new IOS image c1900-universalk9-mz.SPA.157-3.M.bin (108725524 bytes,
// so the last 512-byte block carries 276 bytes). FTP server 10.1.1.200 receives a config backup,
// logging in as admin / Ftp-Pa55 (set with ip ftp username / ip ftp password).
// Colours: purple = TFTP request, blue = TFTP DATA, gray = TFTP ACK,
// orange = FTP control connection, red = password in clear text, green = FTP data connection.

const scene: SequenceScene = {
  kind: "sequence",
  id: "ftp-tftp",
  title: { en: "TFTP pulls an IOS image, FTP pushes a backup", hi: "TFTP se IOS image aati hai, FTP se backup jaata hai" },
  actors: [
    { id: "tftp", label: "TFTP server", kind: "server", sub: "10.1.1.100" },
    { id: "r1", label: "R1", kind: "router", sub: "10.1.1.1" },
    { id: "ftp", label: "FTP server", kind: "server", sub: "10.1.1.200" },
  ],
  steps: [
    {
      title: { en: "TFTP: a read request to UDP 69", hi: "TFTP: UDP 69 par read request" },
      text: {
        en: "The admin runs copy tftp: flash: on R1. R1 sends one UDP datagram, a Read Request (RRQ), from a random port 50123 to the server's well-known port 69. It names the file c1900-universalk9-mz.SPA.157-3.M.bin and binary (octet) mode. No username, no password: TFTP has none.",
        hi: "Admin R1 par copy tftp: flash: chalata hai. R1 ek UDP datagram bhejta hai, Read Request (RRQ), random port 50123 se server ke well-known port 69 par. Isme file ka naam c1900-universalk9-mz.SPA.157-3.M.bin aur binary (octet) mode hota hai. Na username, na password: TFTP mein yeh hote hi nahi.",
      },
      messages: [{ from: "r1", to: "tftp", label: "RRQ", detail: "UDP 50123 → 69 · file name, octet", tone: "purple" }],
    },
    {
      title: { en: "DATA 1 arrives from a new port", hi: "DATA 1 ek naye port se aata hai" },
      text: {
        en: "The server answers with block 1: a 4-byte TFTP header and 512 bytes of the file. It sends from a new random port, 61002, not from 69, and the rest of the transfer uses the port pair 61002 and 50123. R1 confirms with ACK 1.",
        hi: "Server block 1 ke saath jawab deta hai: 4-byte TFTP header aur file ke 512 bytes. Yeh port 69 se nahi, ek naye random port 61002 se aata hai, aur baaki poora transfer 61002 aur 50123 wale port pair par chalta hai. R1 ACK 1 se confirm karta hai.",
      },
      messages: [
        { from: "tftp", to: "r1", label: "DATA block 1", detail: "UDP 61002 → 50123 · 512 B", tone: "blue", dashed: true },
        { from: "r1", to: "tftp", label: "ACK 1", detail: "UDP 50123 → 61002", tone: "gray" },
      ],
    },
    {
      title: { en: "Lock-step: one block, one ACK", hi: "Lock-step: ek block, ek ACK" },
      text: {
        en: "The server sends block 2 only after ACK 1 arrives, and so on: exactly one block is ever in flight. If DATA 2 were lost, no ACK 2 would come back, the server's timer would expire and it would send DATA 2 again. TFTP does its own reliability because UDP does none, but waiting for every ACK makes it slow on long links.",
        hi: "Server block 2 tabhi bhejta hai jab ACK 1 aa jaaye, aur aise hi aage: ek waqt mein sirf ek block raaste mein hota hai. Agar DATA 2 kho jaata, toh ACK 2 nahi aata, server ka timer expire hota aur woh DATA 2 dobara bhejta. UDP koi reliability nahi deta, isliye TFTP khud deta hai, lekin har ACK ka wait karne se lambe links par yeh slow ho jaata hai.",
      },
      messages: [
        { from: "tftp", to: "r1", label: "DATA block 2", detail: "512 B", tone: "blue", dashed: true },
        { from: "r1", to: "tftp", label: "ACK 2", tone: "gray" },
      ],
    },
    {
      title: { en: "A short block ends the transfer", hi: "Chhota block transfer khatam karta hai" },
      text: {
        en: "108,725,524 bytes need 212,355 blocks, so after 212,354 full blocks the last one carries only 276 bytes. A block shorter than 512 bytes tells R1 that the file is complete; TFTP has no separate end message. R1 sends the final ACK and prints [OK - 108725524 bytes].",
        hi: "108,725,524 bytes ke liye 212,355 blocks chahiye, isliye 212,354 full blocks ke baad aakhri block mein sirf 276 bytes hote hain. 512 se chhota block R1 ko batata hai ki file poori ho gayi; TFTP mein end ka alag message nahi hota. R1 final ACK bhejta hai aur [OK - 108725524 bytes] print karta hai.",
      },
      messages: [
        { from: "tftp", to: "r1", label: "DATA (last block)", detail: "276 B < 512 → end of file", tone: "blue", dashed: true },
        { from: "r1", to: "tftp", label: "ACK (last block)", tone: "gray" },
      ],
      note: { actor: "r1", text: "Image saved in flash:" },
    },
    {
      title: { en: "FTP: log in on the control connection", hi: "FTP: control connection par login" },
      text: {
        en: "Now a backup with copy running-config ftp:. R1 first opens a TCP connection to port 21 on 10.1.1.200, the control connection; the handshake and the server's 220 welcome are not drawn. R1 sends USER admin, taken from ip ftp username, and the server asks for the password with 331.",
        hi: "Ab copy running-config ftp: se backup. R1 pehle 10.1.1.200 ke port 21 par TCP connection kholta hai, yahi control connection hai; handshake aur server ka 220 welcome yahan draw nahi kiya. R1 USER admin bhejta hai, jo ip ftp username se aata hai, aur server 331 se password maangta hai.",
      },
      messages: [
        { from: "r1", to: "ftp", label: "USER admin", detail: "TCP 51000 → 21 · control", tone: "orange" },
        { from: "ftp", to: "r1", label: "331 Password required", tone: "orange", dashed: true },
      ],
    },
    {
      title: { en: "The password crosses in clear text", hi: "Password clear text mein jaata hai" },
      text: {
        en: "PASS Ftp-Pa55 travels as plain characters, exactly like a Telnet login, so a packet capture shows it. The server checks it and replies 230. FTP authenticates, but it does not encrypt; SFTP or FTPS do.",
        hi: "PASS Ftp-Pa55 plain characters mein jaata hai, bilkul Telnet login ki tarah, isliye packet capture mein saaf dikhta hai. Server use check karke 230 bhejta hai. FTP authenticate karta hai, lekin encrypt nahi karta; woh kaam SFTP ya FTPS karte hain.",
      },
      messages: [
        { from: "r1", to: "ftp", label: "PASS Ftp-Pa55", detail: "clear text on TCP 21", tone: "red" },
        { from: "ftp", to: "r1", label: "230 Logged in", tone: "orange", dashed: true },
      ],
      note: { actor: "ftp", text: "User admin logged in" },
    },
    {
      title: { en: "Passive mode: the server picks a data port", hi: "Passive mode: data port server chunta hai" },
      text: {
        en: "File contents never travel on the control connection. R1 sends PASV, and the server answers with an address and port for a second connection: (10,1,1,200,195,80), which means 10.1.1.200 port 195 × 256 + 80 = 50000.",
        hi: "File ka content kabhi control connection par nahi jaata. R1 PASV bhejta hai, aur server ek doosre connection ke liye address aur port batata hai: (10,1,1,200,195,80), yaani 10.1.1.200 ka port 195 × 256 + 80 = 50000.",
      },
      messages: [
        { from: "r1", to: "ftp", label: "PASV", tone: "orange" },
        { from: "ftp", to: "r1", label: "227 Entering Passive Mode", detail: "(10,1,1,200,195,80) → port 50000", tone: "orange", dashed: true },
      ],
    },
    {
      title: { en: "STOR over a separate data connection", hi: "Alag data connection par STOR" },
      text: {
        en: "R1 sends STOR r1-confg on the control connection, then opens a new TCP connection to port 50000 and sends the configuration over it. TCP handles acknowledgments and retransmission. When the data connection closes, the server reports 226 on the control connection, and the file is on the server.",
        hi: "R1 control connection par STOR r1-confg bhejta hai, phir port 50000 par naya TCP connection kholta hai aur uspar configuration bhejta hai. Acknowledgment aur retransmission TCP sambhalta hai. Data connection band hone par server control connection par 226 bhejta hai, aur file server par pahunch jaati hai.",
      },
      messages: [
        { from: "r1", to: "ftp", label: "STOR r1-confg", detail: "control · TCP 21", tone: "orange" },
        { from: "r1", to: "ftp", label: "Config file data", detail: "data · TCP 51001 → 50000", tone: "green" },
        { from: "ftp", to: "r1", label: "226 Transfer complete", detail: "control · TCP 21", tone: "orange", dashed: true },
      ],
      note: { actor: "ftp", text: "r1-confg stored" },
    },
  ],
};

export default scene;
