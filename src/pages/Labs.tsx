import { Check, CheckCircle2, ChevronDown, Circle, RefreshCw, Timer, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { BitsView } from "../anim/BitsView";
import type { BitsScene } from "../anim/types";
import { Layout } from "../components/Layout";
import { lessonNumber, lessonMeta } from "../content/curriculum";
import type { PtLab } from "../data/types";
import { usePrefs, useT } from "../lib/prefs";
import { progress, useProgress } from "../lib/progress";
import { cliLabs } from "../sim/labs";
import { rich } from "../lib/rich";
import { parseCidr, randomSubnetQuestion, SubnetInfo, subnetInfo } from "../lib/subnet";

function bitsSceneFor(info: SubnetInfo): BitsScene {
  return {
    kind: "bits",
    id: "calc",
    title: { en: "", hi: "" },
    steps: [
      {
        title: { en: "", hi: "" },
        text: { en: "", hi: "" },
        prefix: info.prefix,
        rows: [
          { label: "Address", ip: info.ip },
          { label: `Mask /${info.prefix}`, ip: info.mask },
          { label: "Network", ip: info.network },
          { label: "Broadcast", ip: info.broadcast },
        ],
      },
    ],
  };
}

function Calculator() {
  const t = useT();
  const [input, setInput] = useState("192.168.10.77/27");
  const parsed = parseCidr(input);
  const info = parsed ? subnetInfo(parsed.ip, parsed.prefix) : null;
  const scene = useMemo(() => (info ? bitsSceneFor(info) : null), [info?.ip, info?.prefix]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="lab-card">
      <h2>{t({ en: "Subnet calculator", hi: "Subnet calculator" })}</h2>
      <p className="muted">{t({ en: "Type an address with a prefix (10.1.1.9/26) or a mask (10.1.1.9 255.255.255.192).", hi: "Prefix ke saath address likho (10.1.1.9/26) ya mask ke saath (10.1.1.9 255.255.255.192)." })}</p>
      <input className="text-input mono" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} aria-label="IPv4 address and prefix" />
      {!info && <p className="error">{t({ en: "That doesn't look like a valid IPv4 address and prefix.", hi: "Yeh valid IPv4 address aur prefix nahi lag raha." })}</p>}
      {info && (
        <>
          <dl className="calc-results">
            {[
              ["Network", `${info.network}/${info.prefix}`],
              ["Broadcast", info.broadcast],
              [t({ en: "First usable", hi: "First usable" }), info.first],
              [t({ en: "Last usable", hi: "Last usable" }), info.last],
              [t({ en: "Usable hosts", hi: "Usable hosts" }), info.usable.toLocaleString()],
              ["Mask", info.mask],
              ["Wildcard", info.wildcard],
              [t({ en: "Block size", hi: "Block size" }), info.prefix === 0 ? "—" : `${info.blockSize} (octet ${info.interestingOctet})`],
              [t({ en: "Class / type", hi: "Class / type" }), `${info.cls}${info.isPrivate ? " · private (RFC 1918)" : ""}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          {scene && (
            <div className="calc-bits">
              <BitsView scene={scene} index={0} />
            </div>
          )}
        </>
      )}
    </section>
  );
}

const FIELDS = ["network", "broadcast", "first", "last", "usable"] as const;
type Field = (typeof FIELDS)[number];

function working(q: SubnetInfo, lang: "en" | "hi") {
  const n = q.interestingOctet;
  const octet = Number(q.ip.split(".")[n - 1]);
  const netOctet = Math.floor(octet / q.blockSize) * q.blockSize;
  const hostBits = 32 - q.prefix;
  if (lang === "hi") {
    return [
      `/${q.prefix} ka mask ${q.mask} hai. Mask octet ${n} mein khatam hota hai, toh wahi interesting octet hai.`,
      `Block size = 256 − ${q.mask.split(".")[n - 1]} = ${q.blockSize}. Subnets octet ${n} mein ${q.blockSize} ke multiples par shuru hote hain.`,
      `Address ka octet ${n} = ${octet}. ${q.blockSize} ka sabse bada multiple jo ${octet} se bada nahi: ${netOctet}. Isliye network ${q.network}.`,
      `Broadcast = agla block − 1 = ${q.broadcast}.`,
      `Hosts ${q.first} se ${q.last} tak. Host bits = ${hostBits}, toh usable = 2^${hostBits} − 2 = ${q.usable}.`,
    ];
  }
  return [
    `/${q.prefix} is mask ${q.mask}. The mask stops in octet ${n}, so that is the interesting octet.`,
    `Block size = 256 − ${q.mask.split(".")[n - 1]} = ${q.blockSize}. Subnets start at multiples of ${q.blockSize} in octet ${n}.`,
    `The address has ${octet} in octet ${n}. The biggest multiple of ${q.blockSize} that is not above ${octet} is ${netOctet}, so the network is ${q.network}.`,
    `Broadcast = next block − 1 = ${q.broadcast}.`,
    `Hosts run from ${q.first} to ${q.last}. There are ${hostBits} host bits, so usable = 2^${hostBits} − 2 = ${q.usable}.`,
  ];
}

function SubnetDrill() {
  const t = useT();
  const { lang } = usePrefs();
  const [q, setQ] = useState(() => randomSubnetQuestion());
  const [answers, setAnswers] = useState<Record<Field, string>>({ network: "", broadcast: "", first: "", last: "", usable: "" });
  const [checked, setChecked] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const [streak, setStreak] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (checked) return;
    const id = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(id);
  }, [checked]);
  const prog = useProgress();
  const elapsed = Math.round((now - startedAt) / 1000);

  const expected: Record<Field, string> = { network: q.network, broadcast: q.broadcast, first: q.first, last: q.last, usable: String(q.usable) };
  const ok = (f: Field) => answers[f].trim().replace(/,/g, "") === expected[f];
  const allOk = FIELDS.every(ok);
  const labels: Record<Field, string> = {
    network: "Network",
    broadcast: "Broadcast",
    first: t({ en: "First usable", hi: "First usable" }),
    last: t({ en: "Last usable", hi: "Last usable" }),
    usable: t({ en: "Usable hosts", hi: "Usable hosts" }),
  };

  const check = () => {
    if (!checked) progress.recordSubnet("network", FIELDS.every(ok), Math.round((Date.now() - startedAt) / 1000));
    setChecked(true);
    setStreak((s) => (FIELDS.every(ok) ? s + 1 : 0));
  };
  const next = () => {
    setQ(randomSubnetQuestion());
    setAnswers({ network: "", broadcast: "", first: "", last: "", usable: "" });
    setChecked(false);
    setShowWork(false);
    setStartedAt(Date.now());
    setNow(Date.now());
  };

  return (
    <section className="lab-card">
      <div className="lab-card-head">
        <h2>{t({ en: "Subnetting drill", hi: "Subnetting drill" })}</h2>
        <span className="drill-stats">
          {!checked && (
            <span className={`drill-timer ${elapsed > 30 ? "is-slow" : ""}`}>
              <Timer size={14} /> {elapsed}s
            </span>
          )}
          {streak > 0 && <span className="streak">{t({ en: "Streak", hi: "Streak" })}: {streak}</span>}
          {prog.subnet.attempts > 0 && (
            <span className="muted">
              {Math.round((prog.subnet.correct / prog.subnet.attempts) * 100)}% · avg {Math.round(prog.subnet.seconds / prog.subnet.attempts)}s · {prog.subnet.attempts}
            </span>
          )}
        </span>
      </div>
      <p className="muted">{t({ en: "Solve it on paper first, then type your answers. Aim for under a minute each before exam day.", hi: "Pehle paper par solve karo, phir answers type karo. Exam se pehle har question ek minute se kam mein karne ka target rakho." })}</p>
      <div className="drill-q mono">
        {q.ip}/{q.prefix}
      </div>
      <div className="drill-fields">
        {FIELDS.map((f) => (
          <label key={f} className={checked ? (ok(f) ? "is-ok" : "is-bad") : ""}>
            <span>{labels[f]}</span>
            <input
              className="text-input mono"
              value={answers[f]}
              onChange={(e) => {
                setAnswers((a) => ({ ...a, [f]: e.target.value }));
                setChecked(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && check()}
              spellCheck={false}
            />
            {checked && (ok(f) ? <Check size={16} className="field-mark" /> : <span className="field-expected">{expected[f]}</span>)}
            {checked && !ok(f) && <X size={16} className="field-mark" />}
          </label>
        ))}
      </div>
      <div className="drill-actions">
        <button className="btn btn-primary" onClick={check}>
          {t({ en: "Check", hi: "Check karo" })}
        </button>
        <button className="btn btn-ghost" onClick={() => setShowWork((s) => !s)}>
          {t({ en: "Show the working", hi: "Tarika dikhao" })}
        </button>
        <button className="btn btn-ghost" onClick={next}>
          <RefreshCw size={15} /> {t({ en: "New question", hi: "Naya question" })}
        </button>
        {checked && allOk && <span className="ok-text">{t({ en: "All correct.", hi: "Sab sahi." })}</span>}
      </div>
      {showWork && (
        <ol className="steps working">
          {working(q, lang).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      )}
    </section>
  );
}

function BinaryDrill() {
  const t = useT();
  const [kind, setKind] = useState<"toBin" | "toDec" | "toHex">("toBin");
  const [n, setN] = useState(() => Math.floor(Math.random() * 256));
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const bin = n.toString(2).padStart(8, "0");
  const hex = n.toString(16).toUpperCase().padStart(2, "0");
  const prompt = kind === "toBin" ? `${n} → binary` : kind === "toDec" ? `${bin} → decimal` : `${n} → hex`;
  const expected = kind === "toBin" ? bin : kind === "toDec" ? String(n) : hex;
  const norm = (s: string) => s.replace(/\s/g, "").replace(/^0x/i, "").toUpperCase();
  const ok = kind === "toBin" ? norm(answer).padStart(8, "0") === expected : norm(answer).replace(/^0+(?=.)/, "") === expected.replace(/^0+(?=.)/, "");

  const next = (k = kind) => {
    setKind(k);
    setN(Math.floor(Math.random() * 256));
    setAnswer("");
    setChecked(false);
  };

  return (
    <section className="lab-card">
      <h2>{t({ en: "Binary and hex drill", hi: "Binary aur hex drill" })}</h2>
      <div className="segmented">
        <button className={kind === "toBin" ? "is-on" : ""} onClick={() => next("toBin")}>
          Decimal → binary
        </button>
        <button className={kind === "toDec" ? "is-on" : ""} onClick={() => next("toDec")}>
          Binary → decimal
        </button>
        <button className={kind === "toHex" ? "is-on" : ""} onClick={() => next("toHex")}>
          Decimal → hex
        </button>
      </div>
      <div className="drill-q mono">{prompt}</div>
      <div className="drill-actions">
        <input
          className={`text-input mono ${checked ? (ok ? "is-ok" : "is-bad") : ""}`}
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setChecked(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && setChecked(true)}
          aria-label="Answer"
        />
        <button className="btn btn-primary" onClick={() => setChecked(true)}>
          {t({ en: "Check", hi: "Check karo" })}
        </button>
        <button className="btn btn-ghost" onClick={() => next()}>
          <RefreshCw size={15} /> {t({ en: "Next", hi: "Agla" })}
        </button>
      </div>
      {checked && (
        <p className={ok ? "ok-text" : "error"}>
          {ok ? t({ en: "Correct.", hi: "Sahi." }) : `${t({ en: "Answer", hi: "Answer" })}: ${expected}`}
          {"  "}
          <span className="muted mono">
            {n} = {bin} = 0x{hex}
          </span>
        </p>
      )}
    </section>
  );
}

function PacketTracerLabs() {
  const t = useT();
  const prog = useProgress();
  const [labs, setLabs] = useState<PtLab[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    import("../data/pt-labs.json").then((m) => setLabs(m.default as unknown as PtLab[]));
  }, []);
  const doneCount = (labs ?? []).filter((l) => prog.labs[`pt:${l.id}`]?.done).length;
  return (
    <section>
      <p className="muted">
        {t({
          en: "Each lab runs in Cisco Packet Tracer, which is free with a Cisco Networking Academy account. Tick tasks as you go; your notes and progress are saved.",
          hi: "Har lab Cisco Packet Tracer mein chalta hai, jo Cisco Networking Academy account ke saath free hai. Kaam karte hue tasks tick karo; tumhare notes aur progress save hote hain.",
        })}{" "}
        {labs && `${doneCount}/${labs.length} complete`}
      </p>
      {!labs && <p className="muted">…</p>}
      <div className="pt-list">
        {labs?.map((l) => {
          const key = `pt:${l.id}`;
          const st = prog.labs[key] ?? { done: false, tasks: [], notes: "", at: 0 };
          const isOpen = open === l.id;
          return (
            <article key={l.id} className={`pt-lab ${st.done ? "is-done" : ""}`}>
              <button className="pt-head" onClick={() => setOpen(isOpen ? null : l.id)} aria-expanded={isOpen}>
                <span className="pt-mark">{st.done ? <CheckCircle2 size={17} /> : <Circle size={17} />}</span>
                <span className="mono muted pt-num">{l.id.replace("lab-", "")}</span>
                <span className="pt-title">{t(l.title)}</span>
                <span className="muted pt-count">
                  {st.tasks.length}/{l.tasks.length}
                </span>
                <ChevronDown size={16} className="outline-chevron" />
              </button>
              {isOpen && (
                <div className="pt-body">
                  <p>{rich(t(l.objective))}</p>
                  {l.topology && (
                    <p className="mono pt-topo">
                      {t({ en: "Topology", hi: "Topology" })}: {l.topology}
                    </p>
                  )}
                  <ol className="pt-tasks">
                    {l.tasks.map((task, i) => {
                      const ticked = st.tasks.includes(i);
                      return (
                        <li key={i}>
                          <label>
                            <input
                              type="checkbox"
                              checked={ticked}
                              onChange={() => {
                                const tasks = ticked ? st.tasks.filter((x) => x !== i) : [...st.tasks, i];
                                progress.setLab(key, { tasks, done: tasks.length === l.tasks.length ? true : st.done });
                              }}
                            />
                            <span>{rich(t(task))}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ol>
                  {l.verify.length > 0 && (
                    <>
                      <h3 className="h-small">{t({ en: "Verify", hi: "Verify karo" })}</h3>
                      <ul className="pt-verify">
                        {l.verify.map((v, i) => (
                          <li key={i}>{rich(t(v))}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {t(l.note) && (
                    <aside className="callout callout-tip">
                      <p>{rich(t(l.note))}</p>
                    </aside>
                  )}
                  <label className="pt-notes">
                    <span className="h-small">{t({ en: "Your notes", hi: "Tumhare notes" })}</span>
                    <textarea className="text-input" rows={3} defaultValue={st.notes} onBlur={(e) => e.target.value !== st.notes && progress.setLab(key, { notes: e.target.value })} />
                  </label>
                  <div className="pt-foot">
                    <button className={`btn ${st.done ? "btn-ghost" : "btn-primary"}`} onClick={() => progress.setLab(key, { done: !st.done })}>
                      {st.done ? t({ en: "Mark not done", hi: "Not done mark karo" }) : t({ en: "Mark lab done", hi: "Lab done mark karo" })}
                    </button>
                    {l.lessons.map((s) => (
                      <Link key={s} href={`/lesson/${s}`} className="muted">
                        {lessonNumber(s)} {t(lessonMeta(s)!.title)}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

const LEVELS = { beginner: { en: "Beginner", hi: "Beginner" }, intermediate: { en: "Intermediate", hi: "Intermediate" }, advanced: { en: "Advanced", hi: "Advanced" } };
const KINDS = { build: { en: "Build", hi: "Build" }, troubleshoot: { en: "Troubleshoot", hi: "Troubleshoot" }, challenge: { en: "Challenge", hi: "Challenge" } };

function CliLabList() {
  const t = useT();
  const prog = useProgress();
  return (
    <section>
      <p className="muted">
        {t({
          en: "Real Cisco IOS commands in your browser: configure switches and routers, test with ping, and every task is checked automatically. Troubleshooting labs start broken; your job is to find out why.",
          hi: "Browser mein real Cisco IOS commands: switches aur routers configure karo, ping se test karo, aur har task apne aap check hota hai. Troubleshooting labs toote hue shuru hote hain; tumhe pata lagana hai kyun.",
        })}
      </p>
      <div className="cli-lab-grid">
        {cliLabs.map((lab) => {
          const st = prog.labs[`cli:${lab.id}`];
          const pct = st ? Math.round((st.tasks.length / lab.tasks.length) * 100) : 0;
          const scen = t(lab.scenario);
          return (
            <Link key={lab.id} href={`/lab/${lab.id}`} className={`cli-lab-card ${st?.done ? "is-done" : ""}`}>
              <div className="lab-tags">
                <span className={`tag kind-${lab.kind}`}>{t(KINDS[lab.kind])}</span>
                <span className="tag">{t(LEVELS[lab.level])}</span>
                <span className="tag">~{lab.minutes} min</span>
              </div>
              <h3>{t(lab.title)}</h3>
              <p>{scen.length > 160 ? `${scen.slice(0, 160)}…` : scen}</p>
              <div className="cli-lab-foot">
                <span className="muted">{lab.lessons.map((s) => lessonNumber(s)).join(" · ")}</span>
                <span className={st?.done ? "ok-text" : "muted"}>
                  {st?.done ? (
                    <>
                      <Check size={14} /> {t({ en: "Done", hi: "Done" })}
                    </>
                  ) : pct ? (
                    `${pct}%`
                  ) : (
                    t({ en: "Start", hi: "Shuru karo" })
                  )}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const TABS = ["cli", "pt", "subnet"] as const;
type Tab = (typeof TABS)[number];

export default function Labs() {
  const t = useT();
  const [tab, setTab] = useState<Tab>(() => {
    try {
      const v = localStorage.getItem("nz2h.labsTab");
      return TABS.includes(v as Tab) ? (v as Tab) : "cli";
    } catch {
      return "cli";
    }
  });
  const choose = (v: Tab) => {
    setTab(v);
    try {
      localStorage.setItem("nz2h.labsTab", v);
    } catch {
      /* ignore */
    }
  };
  return (
    <Layout>
      <div className="page">
        <header className="page-head">
          <h1>{t({ en: "Labs", hi: "Labs" })}</h1>
          <p className="lede">
            {t({
              en: "Reading teaches you what a command does. Labs teach you to use it under pressure. Do them in course order, and redo the troubleshooting ones until they feel easy.",
              hi: "Padhne se pata chalta hai command kya karta hai. Labs se seekhte ho use pressure mein kaise use karna hai. Inhe course ke order mein karo, aur troubleshooting wale tab tak dobara karo jab tak aasaan na lagne lagein.",
            })}
          </p>
        </header>
        <div className="segmented page-tabs" role="tablist">
          <button role="tab" aria-selected={tab === "cli"} className={tab === "cli" ? "is-on" : ""} onClick={() => choose("cli")}>
            {t({ en: "CLI labs", hi: "CLI labs" })} ({cliLabs.length})
          </button>
          <button role="tab" aria-selected={tab === "pt"} className={tab === "pt" ? "is-on" : ""} onClick={() => choose("pt")}>
            Packet Tracer
          </button>
          <button role="tab" aria-selected={tab === "subnet"} className={tab === "subnet" ? "is-on" : ""} onClick={() => choose("subnet")}>
            {t({ en: "Subnetting", hi: "Subnetting" })}
          </button>
        </div>
        {tab === "cli" && <CliLabList />}
        {tab === "pt" && <PacketTracerLabs />}
        {tab === "subnet" && (
          <div className="labs-grid">
            <SubnetDrill />
            <Calculator />
            <BinaryDrill />
          </div>
        )}
      </div>
    </Layout>
  );
}
