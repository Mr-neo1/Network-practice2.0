import { ArrowLeft, Check, Circle, Eye, Lightbulb, Lock, RotateCcw, Terminal as TermIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { DeviceGlyph } from "../anim/icons";
import { Layout } from "../components/Layout";
import { Terminal, type TermLine } from "../components/Terminal";
import { lessonMeta, lessonNumber } from "../content/curriculum";
import { usePrefs, useT } from "../lib/prefs";
import { progress, useProgress } from "../lib/progress";
import { rich } from "../lib/rich";
import { newSession, type Session } from "../sim/cli";
import { buildLab, taskDone, type CliLab } from "../sim/lab";
import { cliLab } from "../sim/labs";
import { ifStatus, type Net } from "../sim/net";
import NotFound from "./NotFound";

const storeKey = (id: string) => `nz2h.lab.${id}`;

type Saved = { net: Net; lines: Record<string, TermLine[]> };

function load(lab: CliLab): Saved {
  try {
    const raw = localStorage.getItem(storeKey(lab.id));
    if (raw) {
      const s = JSON.parse(raw) as Saved;
      if (s.net?.devices && lab.devices.every((d) => s.net.devices[d.id])) return s;
    }
  } catch {
    /* fall through to a fresh lab */
  }
  return { net: buildLab(lab), lines: {} };
}

function save(lab: CliLab, s: Saved) {
  try {
    localStorage.setItem(storeKey(lab.id), JSON.stringify(s));
  } catch {
    /* storage full: the lab still works for this visit */
  }
}

const KIND = {
  build: { en: "Build", hi: "Build" },
  troubleshoot: { en: "Troubleshoot", hi: "Troubleshoot" },
  challenge: { en: "Challenge", hi: "Challenge" },
};
const LEVEL = {
  beginner: { en: "Beginner", hi: "Beginner" },
  intermediate: { en: "Intermediate", hi: "Intermediate" },
  advanced: { en: "Advanced", hi: "Advanced" },
};

function Topology({ lab, net, active, onPick, version }: { lab: CliLab; net: Net; active: string; onPick: (id: string) => void; version: number }) {
  const t = useT();
  const pos = useMemo(() => new Map(lab.devices.map((d) => [d.id, d])), [lab]);
  void version;
  return (
    <div className="lab-topo">
      <svg viewBox={`0 0 800 ${lab.height ?? 360}`} role="img" aria-label={t(lab.title)}>
        {lab.links.map(([a, ai, b, bi]) => {
          const A = pos.get(a)!, B = pos.get(b)!;
          const sa = ifStatus(net, a, ai), sb = ifStatus(net, b, bi);
          const up = sa.up && sb.up;
          const admin = sa.status === "administratively down" || sb.status === "administratively down";
          const short = (n: string) => n.replace("GigabitEthernet", "Gi").replace("FastEthernet", "Fa");
          const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
          const ux = (B.x - A.x) / len, uy = (B.y - A.y) / len;
          // Port labels sit beside the cable, clear of the device's own name.
          const side = uy > 0.3 ? 1 : -1;
          const at = (from: typeof A, dir: number, dist: number) => ({ x: from.x + ux * dir * dist, y: from.y + uy * dir * dist });
          const near = Math.min(48, len * 0.3);
          // A cable leaving downwards runs through the device's name and note, so its label moves further out.
          const reach = (down: number) => Math.max(near, down > 0.3 ? Math.min(74 / down, len - 40) : 0);
          const la = at(A, 1, reach(uy)), lb = at(B, -1, reach(-uy));
          const endHost = (d: typeof A) => d.kind === "pc" || d.kind === "server";
          const off = { x: -uy * 14 * side, y: ux * 14 * side };
          return (
            <g key={`${a}${ai}${b}`} className={`lab-link ${up ? "is-up" : admin ? "is-admin" : "is-down"}`}>
              <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} />
              <circle cx={la.x} cy={la.y} r="4" className="lab-led" />
              <circle cx={lb.x} cy={lb.y} r="4" className="lab-led" />
              {!endHost(A) && (
                <text x={la.x + off.x} y={la.y + off.y + 4} textAnchor="middle" className="port-label">
                  {short(ai)}
                </text>
              )}
              {!endHost(B) && (
                <text x={lb.x + off.x} y={lb.y + off.y + 4} textAnchor="middle" className="port-label">
                  {short(bi)}
                </text>
              )}
            </g>
          );
        })}
        {lab.devices.map((d) => (
          <g
            key={d.id}
            transform={`translate(${d.x},${d.y})`}
            className={`node lab-node ${active === d.id ? "is-focus" : ""} ${d.locked ? "is-locked" : ""}`}
            onClick={() => !d.locked && onPick(d.id)}
            role={d.locked ? undefined : "button"}
            tabIndex={d.locked ? -1 : 0}
            onKeyDown={(e) => !d.locked && (e.key === "Enter" || e.key === " ") && onPick(d.id)}
            aria-label={d.locked ? `${net.devices[d.id].hostname} (locked)` : `Open ${net.devices[d.id].hostname} console`}
          >
            <circle className="node-halo" r="31" />
            <DeviceGlyph kind={d.kind === "l3switch" ? "l3switch" : d.kind} />
            <text className="node-label" y="46" textAnchor="middle">
              {net.devices[d.id].hostname}
            </text>
            {d.note && (
              <text className="node-sub" y="61" textAnchor="middle">
                {d.note}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function LabPage({ id }: { id: string }) {
  const lab = cliLab(id);
  if (!lab) return <NotFound />;
  return <LabWorkspace key={id} lab={lab} />;
}

function LabWorkspace({ lab }: { lab: CliLab }) {
  const t = useT();
  const { lang } = usePrefs();
  const prog = useProgress();
  const [state, setState] = useState<Saved>(() => load(lab));
  const sessions = useRef(new Map<string, Session>());
  const firstOpen = lab.devices.find((d) => !d.locked)!.id;
  const [active, setActive] = useState(firstOpen);
  const [version, setVersion] = useState(0);
  const [hints, setHints] = useState<Record<number, boolean>>({});
  const [showSolution, setShowSolution] = useState(false);
  const started = useRef(Date.now());

  const sessionFor = (dev: string) => {
    let s = sessions.current.get(dev);
    if (!s || s.net !== state.net) {
      s = newSession(state.net, dev);
      sessions.current.set(dev, s);
    }
    return s;
  };

  const results = useMemo(() => lab.tasks.map((task) => taskDone(state.net, task)), [lab, state.net, version]); // eslint-disable-line react-hooks/exhaustive-deps
  const allDone = results.every(Boolean);
  const labKey = `cli:${lab.id}`;
  const record = prog.labs[labKey];

  useEffect(() => {
    const passed = results.map((ok, i) => (ok ? i : -1)).filter((i) => i >= 0);
    const prev = progress.get().labs[labKey];
    const same = prev && JSON.stringify(prev.tasks) === JSON.stringify(passed) && prev.done === (allDone || prev.done);
    if (!same && (passed.length || prev)) {
      progress.setLab(labKey, { done: allDone || Boolean(prev?.done), tasks: passed, score: Math.round((passed.length / lab.tasks.length) * 100) });
      if (allDone && !prev?.done) progress.recordSession({ kind: "practice", label: `Lab: ${lab.title.en}`, total: lab.tasks.length, correct: lab.tasks.length, seconds: Math.round((Date.now() - started.current) / 1000) });
    }
  }, [results]); // eslint-disable-line react-hooks/exhaustive-deps

  const onCommand = () => {
    setVersion((v) => v + 1);
    save(lab, state);
  };

  const reset = () => {
    if (!confirm(lang === "hi" ? "Lab shuru se karein? Tumhari saari configuration hat jaayegi." : "Start the lab again? Your configuration on every device will be erased.")) return;
    sessions.current.clear();
    const fresh = { net: buildLab(lab), lines: {} };
    setState(fresh);
    save(lab, fresh);
    setVersion((v) => v + 1);
  };

  const setLines = (dev: string, lines: TermLine[]) => {
    setState((s) => {
      const next = { ...s, lines: { ...s.lines, [dev]: lines } };
      save(lab, next);
      return next;
    });
  };

  const session = sessionFor(active);
  const dev = state.net.devices[active];
  const greeting: TermLine[] = dev.host ? [{ kind: "out", text: `${dev.hostname} — Command Prompt. Type help for the list of commands.` }] : [{ kind: "out", text: `${dev.hostname} console. Press Enter to start.` }];

  return (
    <Layout wide>
      <div className="lab-page">
        <Link href="/labs" className="crumb">
          <ArrowLeft size={14} /> {t({ en: "All labs", hi: "Saare labs" })}
        </Link>
        <header className="lab-head">
          <div>
            <div className="lab-tags">
              <span className={`tag kind-${lab.kind}`}>{t(KIND[lab.kind])}</span>
              <span className="tag">{t(LEVEL[lab.level])}</span>
              <span className="tag">~{lab.minutes} min</span>
              {record?.done && (
                <span className="tag tag-ok">
                  <Check size={13} /> {t({ en: "Completed", hi: "Complete" })}
                </span>
              )}
            </div>
            <h1>{t(lab.title)}</h1>
            <p className="lede">{rich(t(lab.scenario))}</p>
            <p className="muted lab-lessons">
              {t({ en: "Practises", hi: "Practice karta hai" })}:{" "}
              {lab.lessons.map((s, i) => (
                <span key={s}>
                  {i > 0 && ", "}
                  <Link href={`/lesson/${s}`}>
                    {lessonNumber(s)} {t(lessonMeta(s)!.title)}
                  </Link>
                </span>
              ))}
            </p>
          </div>
        </header>

        <Topology lab={lab} net={state.net} active={active} onPick={setActive} version={version} />
        <p className="muted lab-tip">
          {t({
            en: "Click a device to open its console. Green link = up at both ends, grey = down, dashed = shut down. Use ? for help and Tab to complete commands, as on a real switch or router.",
            hi: "Kisi device par click karke uska console kholo. Green link = dono taraf up, grey = down, dashed = shutdown. Real switch ya router ki tarah ? se help aur Tab se command complete karo.",
          })}
        </p>

        <div className="lab-work">
          <section className="lab-tasks" aria-label="Tasks">
            <div className="lab-tasks-head">
              <h2 className="h-small">
                {t({ en: "Tasks", hi: "Tasks" })} · {results.filter(Boolean).length}/{lab.tasks.length}
              </h2>
            </div>
            <ol>
              {lab.tasks.map((task, i) => (
                <li key={i} className={results[i] ? "is-done" : ""}>
                  <span className="task-mark">{results[i] ? <Check size={15} strokeWidth={3} /> : <Circle size={15} />}</span>
                  <div>
                    <p>{rich(t(task.text))}</p>
                    {hints[i] ? (
                      <p className="task-hint">{rich(t(task.hint))}</p>
                    ) : (
                      <button className="link-btn" onClick={() => setHints((h) => ({ ...h, [i]: true }))}>
                        <Lightbulb size={13} /> {t({ en: "Hint", hi: "Hint" })}
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            {allDone && (
              <div className="lab-done">
                <b>{t({ en: "Lab complete.", hi: "Lab complete." })}</b>
                {lab.debrief && <p>{rich(t(lab.debrief))}</p>}
              </div>
            )}
            <div className="lab-actions">
              <button className="btn btn-ghost" onClick={() => setShowSolution((v) => !v)}>
                <Eye size={15} /> {showSolution ? t({ en: "Hide solution", hi: "Solution chhupao" }) : t({ en: "Show solution", hi: "Solution dikhao" })}
              </button>
              <button className="btn btn-ghost" onClick={reset}>
                <RotateCcw size={15} /> {t({ en: "Reset lab", hi: "Lab reset karo" })}
              </button>
            </div>
            {showSolution && (
              <div className="lab-solution">
                <p className="muted">{t({ en: "Try first; reading it before you try teaches much less. Commands are typed in global configuration mode unless shown at a PC prompt.", hi: "Pehle khud try karo; bina try kiye padhne se bahut kam seekhte ho. Commands global configuration mode mein type hote hain, jab tak PC prompt na dikhe." })}</p>
                {Object.entries(lab.solution).map(([d, cmds]) => (
                  <figure key={d} className="cli">
                    <figcaption>{state.net.devices[d].host ? state.net.devices[d].hostname : `${lab.devices.find((x) => x.id === d)?.hostname}`}</figcaption>
                    <div className="cli-body">
                      {cmds.map((c, k) => (
                        <div key={k} className="cli-line">
                          <span className="cli-cmd">{c}</span>
                        </div>
                      ))}
                    </div>
                  </figure>
                ))}
              </div>
            )}
          </section>

          <section className="lab-console" aria-label="Device consoles">
            <div className="lab-tabs" role="tablist">
              {lab.devices.map((d) => (
                <button key={d.id} role="tab" aria-selected={active === d.id} className={active === d.id ? "is-on" : ""} disabled={d.locked} onClick={() => setActive(d.id)}>
                  {d.locked ? <Lock size={12} /> : <TermIcon size={12} />} {state.net.devices[d.id].hostname}
                </button>
              ))}
            </div>
            <Terminal key={active} session={session} lines={state.lines[active] ?? greeting} onLines={(l) => setLines(active, l)} onCommand={onCommand} title={`${dev.hostname} — ${dev.host ? "Command Prompt" : "console"}`} />
          </section>
        </div>
      </div>
    </Layout>
  );
}
