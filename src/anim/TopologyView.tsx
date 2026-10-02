import { memo, useMemo } from "react";
import { changedTables, easeInOut, hops, HOP_MS, tableKey, topoState } from "./engine";
import { DeviceGlyph } from "./icons";
import type { PacketSpec, TopoLink, TopoNode, TopologyScene } from "./types";

type Props = { scene: TopologyScene; index: number; t: number; settled: boolean };

type Pt = { x: number; y: number };

function unit(a: Pt, b: Pt) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return { ux: dx / len, uy: dy / len, len };
}

/** Where a packet is at time t, or null if it has not left yet. */
function packetAt(p: PacketSpec, t: number, nodes: Map<string, TopoNode>) {
  const start = (p.delay ?? 0) * HOP_MS;
  const n = hops(p.path);
  const local = (t - start) / HOP_MS;
  if (local < 0 || n === 0) return null;
  if (local >= n) {
    const end = nodes.get(p.path[n])!;
    return { x: end.x, y: end.y, arrived: true, since: (local - n) * HOP_MS };
  }
  const seg = Math.floor(local);
  const f = easeInOut(local - seg);
  const a = nodes.get(p.path[seg])!, b = nodes.get(p.path[seg + 1])!;
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, arrived: false, since: 0 };
}

function LinkShape({ link, a, b, state, note }: { link: TopoLink; a: TopoNode; b: TopoNode; state?: string; note?: string }) {
  const { ux, uy, len } = unit(a, b);
  const nx = -uy, ny = ux;
  const style = link.style ?? "copper";
  const cls = `link link-${style} ${state ? `link-${state}` : ""}`;
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const portOffset = Math.min(46, len * 0.3);
  const portA = { x: a.x + ux * portOffset + nx * 10, y: a.y + uy * portOffset + ny * 10 };
  const portB = { x: b.x - ux * portOffset + nx * 10, y: b.y - uy * portOffset + ny * 10 };
  // Put text on the side of the line that faces up (or left for vertical lines).
  const flip = ny > 0 || (Math.abs(ny) < 0.01 && nx > 0) ? -1 : 1;
  const labelAt = { x: mid.x + nx * 13 * flip, y: mid.y + ny * 13 * flip };
  return (
    <g className={cls}>
      {style === "bundle" ? (
        [-5, 0, 5].map((o) => <line key={o} x1={a.x + nx * o} y1={a.y + ny * o} x2={b.x + nx * o} y2={b.y + ny * o} />)
      ) : (
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
      )}
      {style === "bundle" && <ellipse className="link-bundle-ring" cx={mid.x} cy={mid.y} rx="7" ry="13" transform={`rotate(${(Math.atan2(uy, ux) * 180) / Math.PI} ${mid.x} ${mid.y})`} />}
      {link.aPort && (
        <text className="port-label" x={portA.x} y={portA.y} textAnchor="middle" dominantBaseline="middle">
          {link.aPort}
        </text>
      )}
      {link.bPort && (
        <text className="port-label" x={portB.x} y={portB.y} textAnchor="middle" dominantBaseline="middle">
          {link.bPort}
        </text>
      )}
      {(note || link.label) && (
        <text className={note ? "link-note" : "link-label"} x={labelAt.x} y={labelAt.y} textAnchor="middle" dominantBaseline="middle">
          {note ?? link.label}
        </text>
      )}
      {state === "blocked" && (
        <g transform={`translate(${mid.x},${mid.y})`} className="link-mark-blocked">
          <rect x="-8" y="-8" width="16" height="16" rx="3" />
          <line x1="-4" y1="0" x2="4" y2="0" />
        </g>
      )}
      {state === "down" && (
        <g transform={`translate(${mid.x},${mid.y})`} className="link-mark-down">
          <circle r="9" />
          <path d="M-4,-4 L4,4 M4,-4 L-4,4" />
        </g>
      )}
    </g>
  );
}

function TopologyViewInner({ scene, index, t, settled }: Props) {
  const height = scene.height ?? 400;
  const nodes = useMemo(() => new Map(scene.nodes.map((n) => [n.id, n])), [scene]);
  const step = scene.steps[index];
  const state = useMemo(() => topoState(scene, index, settled), [scene, index, settled]);
  const fresh = useMemo(() => (settled ? changedTables(step) : new Set<string>()), [step, settled]);
  const focus = new Set(step.focus ?? []);
  const packets = step.packets ?? [];

  return (
    <div className="topo">
      <div className="topo-canvas">
        <svg viewBox={`0 0 800 ${height}`} role="img" aria-label={scene.title.en}>
          <defs>
            {["blue", "green", "orange", "red", "purple", "teal", "pink", "gray"].map((tone) => (
              <marker key={tone} id={`arrow-${tone}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className={`fill-${tone}`} />
              </marker>
            ))}
          </defs>

          <g className="links">
            {scene.links.map((l) => {
              const ls = state.links.get(l.id);
              return <LinkShape key={l.id} link={l} a={nodes.get(l.a)!} b={nodes.get(l.b)!} state={ls?.state} note={ls?.note} />;
            })}
          </g>

          <g className="traces">
            {packets.map((p, i) => {
              if (t < (p.delay ?? 0) * HOP_MS) return null;
              const pts = p.path.map((id) => nodes.get(id)!).map((n) => `${n.x},${n.y}`).join(" ");
              return <polyline key={i} className={`trace stroke-${p.tone ?? "blue"}`} points={pts} markerEnd={`url(#arrow-${p.tone ?? "blue"})`} />;
            })}
          </g>

          <g className="nodes">
            {scene.nodes.map((n) => {
              const badge = state.badges.get(n.id);
              return (
                <g key={n.id} transform={`translate(${n.x},${n.y})`} className={`node ${focus.has(n.id) ? "is-focus" : ""} ${n.kind === "attacker" ? "is-attacker" : ""}`}>
                  <circle className="node-halo" r="31" />
                  <DeviceGlyph kind={n.kind} />
                  <text className="node-label" y="46" textAnchor="middle">
                    {n.label}
                  </text>
                  {n.sub && (
                    <text className="node-sub" y="61" textAnchor="middle">
                      {n.sub}
                    </text>
                  )}
                  {n.sub2 && (
                    <text className="node-sub" y="75" textAnchor="middle">
                      {n.sub2}
                    </text>
                  )}
                  {badge && (
                    <g className={`badge tone-${badge.tone ?? "blue"}`} transform="translate(0,-40)">
                      <rect x={-(badge.text.length * 3.6 + 9)} y="-10" width={badge.text.length * 7.2 + 18} height="20" rx="10" />
                      <text textAnchor="middle" dominantBaseline="central">
                        {badge.text}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          <g className="packets">
            {packets.map((p, i) => {
              const pos = packetAt(p, t, nodes);
              if (!pos) return null;
              const tone = p.drop && pos.arrived ? "red" : p.tone ?? "blue";
              const fade = pos.arrived && !p.drop ? Math.max(0, 1 - pos.since / 200) : 1;
              if (fade <= 0) return null;
              const w = p.label.length * 6.9 + 18;
              return (
                <g key={i} className={`packet tone-${tone} ${p.drop && pos.arrived ? "is-dropped" : ""}`} transform={`translate(${pos.x},${pos.y - 1})`} opacity={fade}>
                  <rect x={-w / 2} y="-11.5" width={w} height="23" rx="11.5" />
                  <text textAnchor="middle" dominantBaseline="central">
                    {p.label}
                  </text>
                  {p.drop && pos.arrived && (
                    <g transform={`translate(${w / 2 + 2},-12)`} className="drop-mark">
                      <circle r="9" />
                      <path d="M-4,-4 L4,4 M4,-4 L-4,4" />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {state.tables.size > 0 && (
        <div className="topo-tables">
          {[...state.tables.values()].map((tb) => {
            const isFresh = fresh.has(tableKey(tb));
            return (
              <div key={tableKey(tb)} className={`topo-table ${isFresh ? "is-fresh" : ""}`}>
                <div className="topo-table-title">{tb.title}</div>
                <table>
                  <thead>
                    <tr>
                      {tb.columns.map((c) => (
                        <th key={c}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tb.rows.map((row, ri) => (
                      <tr key={ri} className={isFresh && tb.hl?.includes(ri) ? "is-new" : ""}>
                        {row.map((cell, ci) => (
                          <td key={ci}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const TopologyView = memo(TopologyViewInner);
