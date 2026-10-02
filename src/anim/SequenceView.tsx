import { memo, useEffect, useMemo, useRef } from "react";
import { MSG_MS } from "./engine";
import { DeviceGlyph } from "./icons";
import type { SeqMessage, SequenceScene } from "./types";

type Props = { scene: SequenceScene; index: number; t: number; settled: boolean };

type Item = { kind: "msg"; step: number; k: number; msg: SeqMessage } | { kind: "note"; step: number; actor: string; text: string };

const TOP = 128;
const ROW = 46;

function SequenceViewInner({ scene, index, t, settled }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const n = scene.actors.length;
  const xs = useMemo(() => {
    const map = new Map<string, number>();
    const margin = n <= 2 ? 190 : n === 3 ? 130 : 90;
    scene.actors.forEach((a, i) => map.set(a.id, n === 1 ? 400 : margin + (i * (800 - 2 * margin)) / (n - 1)));
    return map;
  }, [scene, n]);

  const items = useMemo(() => {
    const out: Item[] = [];
    scene.steps.forEach((s, si) => {
      (s.messages ?? []).forEach((msg, k) => out.push({ kind: "msg", step: si, k, msg }));
      if (s.note) out.push({ kind: "note", step: si, actor: s.note.actor, text: s.note.text });
    });
    return out;
  }, [scene]);

  const height = TOP + items.length * ROW + 24;
  const rows = items.map((it, i) => ({ ...it, y: TOP + i * ROW + ROW / 2 }));
  const current = rows.filter((r) => r.step === index);
  const bandTop = current.length ? current[0].y - ROW / 2 : 0;
  const bandHeight = current.length * ROW;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !current.length) return;
    const scale = el.clientWidth / 800;
    const target = (bandTop + bandHeight / 2) * scale - el.clientHeight / 2;
    el.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div className="seq" ref={wrapRef}>
      <svg viewBox={`0 0 800 ${height}`} role="img" aria-label={scene.title.en}>
        <defs>
          {["blue", "green", "orange", "red", "purple", "teal", "pink", "gray"].map((tone) => (
            <marker key={tone} id={`seq-arrow-${tone}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className={`fill-${tone}`} />
            </marker>
          ))}
        </defs>

        {current.length > 0 && <rect className="seq-band" x="8" y={bandTop} width="784" height={bandHeight} rx="8" />}

        {scene.actors.map((a) => {
          const x = xs.get(a.id)!;
          return (
            <g key={a.id}>
              <line className="lifeline" x1={x} y1={TOP - 14} x2={x} y2={height - 8} />
              <g transform={`translate(${x},40) scale(0.82)`} className="node">
                <DeviceGlyph kind={a.kind ?? "server"} />
              </g>
              <text className="node-label" x={x} y={86} textAnchor="middle">
                {a.label}
              </text>
              {a.sub && (
                <text className="node-sub" x={x} y={101} textAnchor="middle">
                  {a.sub}
                </text>
              )}
            </g>
          );
        })}

        {rows.map((r, i) => {
          if (r.step > index) return null;
          const past = r.step < index;
          if (r.kind === "note") {
            if (!past && !settled) return null;
            const x = xs.get(r.actor)!;
            const w = r.text.length * 7 + 22;
            return (
              <g key={i} className={`seq-note ${past ? "is-past" : "is-now"}`} transform={`translate(${x},${r.y})`}>
                <rect x={-w / 2} y="-13" width={w} height="26" rx="6" />
                <text textAnchor="middle" dominantBaseline="central">
                  {r.text}
                </text>
              </g>
            );
          }
          const m = r.msg;
          const x1 = xs.get(m.from)!, x2 = xs.get(m.to)!;
          let p = 1;
          if (!past) {
            const start = r.k * MSG_MS;
            p = Math.max(0, Math.min(1, (t - start) / (MSG_MS * 0.72)));
            if (p === 0) return null;
          }
          const reach = m.drop ? 0.58 : 1;
          const tipX = x1 + (x2 - x1) * reach * p;
          const tone = m.tone ?? "blue";
          const mid = m.drop ? x1 + ((x2 - x1) * reach) / 2 : (x1 + x2) / 2;
          const labelOpacity = past ? 1 : Math.min(1, Math.max(0, (p - 0.2) / 0.4));
          return (
            <g key={i} className={`seq-msg stroke-${tone} ${past ? "is-past" : "is-now"}`}>
              <line
                x1={x1}
                y1={r.y}
                x2={tipX}
                y2={r.y}
                className={m.dashed ? "dashed" : ""}
                markerEnd={!m.drop && p > 0.04 ? `url(#seq-arrow-${tone})` : undefined}
              />
              <text className="seq-label" x={mid} y={r.y - 8} textAnchor="middle" opacity={labelOpacity}>
                {m.label}
              </text>
              {m.detail && (
                <text className="seq-detail" x={mid} y={r.y + 15} textAnchor="middle" opacity={labelOpacity}>
                  {m.detail}
                </text>
              )}
              {m.drop && p >= 1 && (
                <g transform={`translate(${tipX},${r.y})`} className="drop-mark">
                  <circle r="9" />
                  <path d="M-4,-4 L4,4 M4,-4 L-4,4" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export const SequenceView = memo(SequenceViewInner);
