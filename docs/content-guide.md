# Content guide

How lessons and animations are written for Network Zero2Hero. Read this before adding or editing a lesson.

## Who we write for

- Learners who start with **zero networking knowledge** and want to pass **Cisco CCNA 200-301 (v1.1)**, then keep going.
- Most are Indian students and working people. They read English fine, but many think and learn faster in **Hinglish**.
- Every lesson must work for both: someone who reads only English, and someone who switches to Hinglish.

## Files

| What | Where |
| --- | --- |
| Course outline (titles, order, scene ids, exam refs) | `src/content/curriculum.ts` |
| One lesson | `src/content/lessons/<slug>.ts` (default export, type `Lesson`) |
| One animation | `src/anim/scenes/<scene-id>.ts` (default export, type `Scene`) |
| Types | `src/content/types.ts`, `src/anim/types.ts` |
| Checker | `node scripts/check-lesson.ts <slug>` |
| Video checker | `node scripts/verify-videos.ts <slug>` |

Reference lesson: `src/content/lessons/arp.ts` with `src/anim/scenes/arp.ts`. It is the quality bar.
Reference scenes for the other kinds: `tcp-udp.ts` (sequence), `tcp-ip-encapsulation.ts` (layers), `subnetting.ts` (bits), `cisco-cli-basics.ts` (terminal).

Imports in content and scene files must use relative paths with the `.ts` extension and `import type`, e.g. `import type { Lesson } from "../types.ts";`. That lets the checker run on plain Node without a build.

## Lesson shape

| Field | What goes in it |
| --- | --- |
| `intro` | 2-4 sentences: the problem this topic solves and why a network engineer cares. No "In this lesson we will…". |
| `outcomes` | 3-6 concrete abilities ("Configure…", "Predict…", "Read…"). |
| `sections` | 4-7 sections. Each teaches one idea, in order of understanding. Mix blocks: paragraphs, lists, steps, tables, callouts, CLI. |
| `terms` | 5-8 key terms with one-sentence definitions. |
| `commands` | Every Cisco (or host) command the lesson uses, with its mode. Omit for lessons with no commands. |
| `mistakes` | 4-6 real mistakes and exam traps, each saying what is wrong and what is right. |
| `recap` | 4-6 bullets a learner could revise from the night before the exam. |
| `quiz` | 6 questions, 4 options each. Mix concept, scenario, CLI-output and calculation questions. Spread the correct answer across positions 0-3. Every explanation says why the right answer is right, and where useful why a tempting wrong one is wrong. |
| `videos` | 1-2 English and 1-2 Hindi videos (see below). |
| `lab` | 4-6 steps the learner can do in Cisco Packet Tracer (free) or on real gear. |

Callout tones: `exam` (what the exam tests), `warn` (a trap), `tip` (practical advice), `analogy` (an everyday comparison; at most one per lesson, and only when it genuinely helps).

Inline formatting inside any string: `**bold**` and `` `code` ``. Use `code` for commands, addresses in running text, field names and values like `FFFF.FFFF.FFFF`.

## Accuracy rules

- Teach what the CCNA 200-301 v1.1 exam expects, and say so when something goes beyond it.
- Cisco IOS syntax must be exact: real command names, real modes, real prompts such as `R1(config-if)#`, `R1(config-router)#`, `SW1(config-vlan)#`, `R1(config-subif)#`.
- `show` output must look like real IOS output (column names, spacing, codes). Shorten it, but never invent fields.
- Get defaults right: administrative distances, timers, port numbers, cost formulas, VLAN ranges, STP costs and priorities.
- Use consistent, realistic addressing: RFC 1918 for inside networks, documentation ranges (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`) for "public" examples. MAC addresses in Cisco dotted format (`0050.56aa.0001`). Interface names like `Gi0/1`, `Gi0/0/0`, `Fa0/1`.
- The addresses and names in the animation must match the lesson text.
- If a behaviour differs by platform or version, say so briefly instead of pretending there is one answer.

## English style

- Plain, direct, specific. Short sentences. Second person ("you").
- Explain why before how. Give the reason a feature exists before its commands.
- Prefer a concrete example with real numbers to an abstract sentence.
- No hype, no filler, no emoji, no exclamation marks.
- Never use: delve, tapestry, "in today's…", fast-paced, "let's dive in", embark, game-changer, unleash, seamless(ly), "plays a crucial/vital role", "it is important to note", cutting-edge, ever-evolving, "unlock the power", "without further ado". The checker warns on these.
- Avoid chains of em dashes. Use a full stop or a comma.

## Hinglish style

Hinglish here means **Hindi grammar written in Roman letters, with English technical words kept in English**. It is how a helpful senior colleague explains something at a whiteboard in an Indian office. It is not a word-for-word translation, and it is never Devanagari.

Keep in English: every networking term (router, switch, frame, packet, subnet, broadcast, VLAN, trunk, interface, port, default gateway, routing table, configure, command, output, neighbour, etc.), command names, numbers and units.

Use everyday Hindi for the connecting words: hai/hain, ka/ki/ke, ko, se, mein, par, aur, ya, lekin, isliye, kyunki, jab/tab, agar/toh, yaani, matlab, asal mein, seedha, pehle, phir, baad mein, sirf, bhi, zaroori, dhyan do, dekho, samjho, socho.

Avoid formal or Sanskritised Hindi that nobody says at work: prayog, uplabdh, sanchar, pranali, suvidha, aavashyak, nirdharit, vishesh roop se. Say "use", "available", "communication", "system", "facility", "zaroori", "decide", "khaas taur par".

Spelling conventions (be consistent): hai, hain, mein (not "me"), nahi, kyun, kya, kaise, karo, karna, karta/karti/karte, hota/hoti/hote, yeh, woh, aur, ke liye, zaroorat, matlab, bahut, thoda.

Good:
> Switch har frame ka source MAC dekh kar seekhta hai ki kaunsa device kis port par hai. Destination MAC table mein nahi mila, toh frame ko flood kar deta hai.

Bad (translated English, stiff):
> Switch pratyek frame ke source MAC ko dekhkar sikhta hai ki kaunsa upkaran kis port par sthit hai.

Bad (just English with a Hindi word stuck on):
> The switch learns the source MAC of every frame, samjho.

Bad (Devanagari): anything like स्विच. The checker rejects it.

Keep Hinglish the same length and depth as the English. Same facts, same numbers, same commands. Do not drop details in Hinglish.

## Animations (scenes)

Every lesson has one scene, chosen to show the mechanism of the topic, not just its vocabulary. Kinds:

| Kind | Use it for |
| --- | --- |
| `topology` | Anything where devices exchange traffic: switching, ARP, VLANs, STP, routing, NAT, ACLs, attacks, wireless. |
| `sequence` | Protocol conversations over time: TCP handshake, DHCP DORA, DNS resolution, AAA, REST calls, SNMP, handshakes. |
| `layers` | Things built from stacked parts: encapsulation, headers, OSI, hypervisor stacks, SDN planes, IPv6 notation, data formats. |
| `bits` | Binary math on IPv4: conversions, masks, subnetting, VLSM, wildcard masks. |
| `terminal` | Configuration and verification workflows at the CLI (or a host shell). |

General rules:

- 5-10 steps. Each step shows one thing happening and its caption explains exactly that thing, referring to what is on screen.
- Captions are 1-3 sentences in both `en` and `hi`. Step titles are short (under ~45 characters).
- The animation must be technically correct in order and direction: who sends, to what address, what gets learned or changed.
- Don't just list facts. Show cause and effect: a packet arrives, so a table changes; a link fails, so the path changes.

### Topology layout

The canvas is 800 units wide, `height` 260-560 (default 400). The renderer draws:

- a device icon about 56 units square centred on (x, y)
- the `label` (bold, ~8 units per character) under the icon, then `sub` and `sub2` (monospace, ~7 units per character)
- badges just above the icon
- interface names (`aPort`/`bPort`) near each end of a link, and the link `label` at its middle
- packets as coloured pills with their label, travelling centre to centre along links

So:

- Keep x in 50-750 and y in 45-(height-55).
- Leave room for text: nodes side by side need about 110-160 units between centres (more if `sub` is long); stacked nodes need 95-125 units. The checker enforces this.
- Keep labels ≤ 12 characters, `sub`/`sub2` ≤ 20, packet labels ≤ 16.
- Every hop of a packet `path` must follow an existing link. A packet from PC to server through a switch and router is `["pc", "sw1", "r1", "server"]`.
- Use `delay` (in hops) to order packets inside a step, e.g. a reply that starts after the request arrives.
- Timing inside a step: link state changes (`links`) show from the start of the step (they are causes); `tables` and `badges` appear once the step's packets have arrived (they are effects). So "the frame arrives, then the switch learns the MAC" works naturally in one step.
- `tables`, `badges` and link states carry forward to later steps. Repeat a table only when it changes, and mark new or changed rows with `hl`. Tables are drawn under the diagram, so they don't need canvas space. Keep them to 2-4 columns and ≤ 6 rows.
- Packet colours: pick a meaning and stick to it within a scene (e.g. orange = broadcast/discovery, green = reply/allowed, blue = data, red = attack/denied, purple = control-plane protocol).

### Sequence

2-5 actors. At most 16 messages in total. Use `dashed: true` for replies, `detail` for addresses/ports/flags, `drop: true` for a lost or rejected message, and `note` for a state change on an actor (e.g. "Lease stored").

### Layers

Rows of blocks. Give each block a stable `id` so it animates when it moves between steps. Up to ~8 blocks per row, labels ≤ 20 characters, `sub` ≤ 28. Use `stack` + `stackActive` when a layer model on the side helps.

### Bits

IPv4 only. 1-4 rows per step. `prefix` colours network bits blue and host bits orange. `mark` highlights a bit range. `results` shows the answers so far.

### Terminal

Realistic prompts and output. At most ~8 lines per step, output lines under ~80 characters. Use `clear: true` to start a fresh screen.

## Videos

Each lesson links real YouTube videos that match its topic closely.

- English: prefer **Jeremy's IT Lab** (the free CCNA 200-301 course). **NetworkChuck** suits the very first beginner lessons.
- Hindi: prefer **Network Nuggets** (short topic-by-topic videos), then **NetworkPath**, then **PyNet Labs**.
- Avoid multi-hour "full course" videos. Pick the video that covers this lesson's topic.
- For topics beyond the CCNA, search YouTube for a well-known channel's video on exactly that topic.
- `title` must be the real YouTube title (you may drop a trailing "| CCNA 200-301 Complete Course" style suffix) and `channel` must be the exact channel name. Every video must pass `node scripts/verify-videos.ts <slug>`.
- Add a short `note` saying what the video covers or which part to watch.

## Before you finish

1. `node scripts/check-lesson.ts <slug>` shows 0 errors. Fix the warnings too unless there is a clear reason not to.
2. `node scripts/verify-videos.ts <slug>` shows 0 problems.
3. Re-read the Hinglish out loud in your head. If it sounds like a textbook translation, rewrite it.
