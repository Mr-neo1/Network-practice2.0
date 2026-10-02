# Network Zero2Hero

A free study platform for **Cisco CCNA 200-301 (v1.1)** that starts from zero networking knowledge and goes past the exam.

- **75 lessons in 8 modules**: foundations, the six CCNA exam domains, and a "Beyond the CCNA" module (troubleshooting, multi-area OSPF, EIGRP, BGP, design, SD-WAN, Python, a capstone lab, exam strategy).
- **English or Hinglish**: one switch in the top bar changes every lesson, animation caption, quiz, lab and flashcard. Hinglish is written in Roman script, never Devanagari.
- **An animation for every topic**: packets moving along links, MAC/ARP/routing/NAT tables filling in, ports blocking, protocol conversations, headers being added, bits flipping, commands typing into a console. Play, pause, step, replay and change speed.
- **Real YouTube videos** per lesson, English (mostly Jeremy's IT Lab) and Hindi (mostly Network Nuggets). Every video id is checked against YouTube.
- **30 CLI labs** in a Cisco IOS simulator that runs in the browser: VLANs and trunks, router-on-a-stick, Layer 3 switching, EtherChannel, STP, port security, CDP, DHCP and relay, static and floating routes, OSPF, NAT/PAT, standard and extended ACLs, SSH, NTP/syslog/SNMP, troubleshooting tickets and two capstones. Each task is checked automatically against the live state of the simulated network (pings, routing tables, neighbours, translations).
- **43 Packet Tracer labs** with tickable tasks and notes, plus **subnetting drills**, a **subnet calculator** and a **binary trainer**.
- **Practice**: about 750 questions (a 300-question exam bank plus every lesson quiz) in four formats: single answer, multiple answers, matching and typed commands. Pick domains and formats, drill your weak spots, or review the questions due today (wrong answers come back after 1, 3 and 7 days).
- **Exam simulator**: 100, 50 or 25 questions drawn by the official domain weights, timed, no going back, with a per-domain result.
- **210 flashcards** with SM-2 spaced repetition.
- **8-week study plan**: 56 days of lessons, labs, quizzes and reviews that you tick off.
- **Progress dashboard**: exam readiness by domain, streak, study time, activity heatmap, weak spots, and a "ready to book?" checklist.
- **Accounts (optional)**: sign up to keep progress on every device (Supabase on the hosted site, the bundled Node server when self-hosting). Without an account everything is saved in the browser, and guest progress moves into the account when you sign up.

## Run it

Requires Node.js 22.13 or newer (the server uses the built-in `node:sqlite`).

```bash
npm install
npm run dev        # API on :8787 and the site on http://localhost:5173
```

Production (one process serves the API and the built site):

```bash
npm run build      # type-checks, then writes dist/
npm start          # http://localhost:8787
```

Server settings are environment variables: `PORT` (default 8787), `NZ2H_DB` (SQLite file, default `data/nz2h.sqlite`), `NZ2H_STATIC` (default `dist`). Passwords are hashed with scrypt; sessions are HttpOnly cookies.

## Deploy for free (Vercel, GitHub Pages, Supabase)

Hosted copies of the site have no server of their own: accounts and progress live in Supabase, and the site talks to it from the browser. The same build runs on Vercel and on GitHub Pages, sharing one Supabase project.

1. **Supabase** (accounts and progress): create a free project at supabase.com. In **SQL Editor**, run `supabase/setup.sql`. In **Project Settings > API**, copy the Project URL and the anon (or publishable) key. For personal use, turn off **Authentication > Sign In / Providers > Email > Confirm email** so new accounts work straight away; otherwise add your site addresses under **Authentication > URL Configuration**.
2. **Keys**: put both values in `.env.production` (see `.env.example`) and commit it. They are public by design; row-level security in `setup.sql` stops anyone reading another user's progress.
3. **GitHub Pages**: in the repo, **Settings > Pages > Source: GitHub Actions**. Every push to `main` runs the tests, builds and publishes (`.github/workflows/pages.yml`).
4. **Vercel**: import the GitHub repo at vercel.com (settings come from `vercel.json`). Every push redeploys.

Without Supabase keys a hosted build still works fully in guest mode: progress stays in the browser and can be moved with Settings > Backup.

Checks:

```bash
npm test                 # unit tests, simulator tests, every lesson and scene validated
npm run check            # TypeScript
npm run check:content    # lesson/scene checker with readable messages (add slugs to limit it)
npm run check:labs       # every CLI lab fails at the start and passes after its solution is typed in
npm run verify:videos    # confirms every YouTube video still exists and matches its title
```

## Where things live

| Path | What |
| --- | --- |
| `src/content/curriculum.ts` | The course outline: modules, lesson order, titles, exam references |
| `src/content/lessons/<slug>.ts` | One lesson each: text, tables, CLI, quiz, videos, lab |
| `src/anim/scenes/<slug>.ts` | One animation each (pure data) |
| `src/anim/` | The animation engine: `Player.tsx` plus a view per scene kind |
| `src/sim/` | The IOS simulator: command grammar, CLI modes, network engine, show output |
| `src/sim/labs/<id>.ts` | One CLI lab each: devices, cabling, starting config, tasks, checks, solution |
| `src/data/` | Question bank, flashcards, Packet Tracer labs, study plan, IOS cheat sheet |
| `src/lib/progress*.ts`, `analytics.ts` | Progress model, spaced repetition, readiness and streak maths |
| `backend/` | Accounts and progress sync (`node:http` + `node:sqlite`) |
| `src/pages/`, `src/components/` | The site |
| `docs/content-guide.md` | How to write lessons, Hinglish style, animation layout rules |
| `scripts/` | Content checker, lab checker, video verifier, screenshot helpers |

To add or change a lesson, read `docs/content-guide.md`, edit the lesson and scene files, and run `npm run check:content <slug>` and `npm run verify:videos <slug>`. To add a lab, copy a file in `src/sim/labs/` and run `npm run check:labs`.

Dev-only pages: `#/scenes` lists every animation, and `#/scene/<id>/<step>` shows one step frozen (used for screenshots).

## What the simulator does not do

It covers what the labs need, not all of IOS. Not simulated: HSRP, IPv6 forwarding, port-security violation shutdowns triggered by traffic, `show ip interface` (only `brief`), and checks on which DHCP address a host received. Packet Tracer labs cover those.

## About the older version

This project started as an export from Manus that needed Manus sign-in and a MySQL database. That version is backed up in `archive/original-manus-export.zip`. Its folders (`client/`, `server/`, `shared/`, `drizzle/`, `patches/`, `template.json`, `components.json`, `pnpm-lock.yaml` and the old audit notes) are no longer used by the app and can be deleted. The question bank, flashcards, Packet Tracer labs and study plan come from the earlier [Network-practice](https://github.com/Mr-neo1/Network-practice) project, translated into Hinglish.

## Credits

Videos belong to their creators and play from YouTube. Not affiliated with Cisco. CCNA is a trademark of Cisco Systems, Inc.
