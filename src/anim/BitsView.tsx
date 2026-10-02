import { memo, useMemo } from "react";
import type { BitsRow, BitsScene } from "./types";

type Props = { scene: BitsScene; index: number };

function toBits(row: BitsRow) {
  if (row.ip) return row.ip.split(".").map((o) => Number(o).toString(2).padStart(8, "0")).join("");
  return (row.bits ?? "").replace(/\s/g, "");
}

/** Split a bit string into display groups: octets for IPv4 or byte-multiples, otherwise nibbles. */
function groups(bits: string, isIp: boolean) {
  const size = isIp || bits.length % 8 === 0 ? 8 : 4;
  const out: { start: number; bits: string }[] = [];
  for (let i = 0; i < bits.length; i += size) out.push({ start: i, bits: bits.slice(i, i + size) });
  return out;
}

const PLACE8 = [128, 64, 32, 16, 8, 4, 2, 1];

function BitsViewInner({ scene, index }: Props) {
  const step = scene.steps[index];
  const prevResults = useMemo(() => new Set((scene.steps[index - 1]?.results ?? []).map((r) => `${r.label}=${r.value}`)), [scene, index]);
  const prefix = step.prefix;
  const [m0, m1] = step.mark ?? [-1, -2];

  return (
    <div className="bits">
      <div className="bits-grid">
        {step.rows.map((row, ri) => {
          const bits = toBits(row);
          const isIp = Boolean(row.ip);
          const gs = groups(bits, isIp);
          const decimals = isIp ? row.ip!.split(".") : gs.map((g) => (g.bits.length === 8 ? String(parseInt(g.bits, 2)) : ""));
          return (
            <div className="bits-row" key={`${ri}-${row.label}`}>
              <div className="bits-label">
                {row.label}
                {row.note && <span className="bits-note">{row.note}</span>}
              </div>
              <div className="bits-groups">
                {gs.map((g, gi) => (
                  <div className="bits-group" key={gi}>
                    {step.placeValues && ri === 0 && g.bits.length === 8 && (
                      <div className="bits-place">
                        {PLACE8.map((p) => (
                          <span key={p}>{p}</span>
                        ))}
                      </div>
                    )}
                    <div className="bits-dec">{decimals[gi]}</div>
                    <div className="bits-cells">
                      {g.bits.split("").map((b, bi) => {
                        const i = g.start + bi;
                        const side = prefix === undefined ? "" : i < prefix ? "is-net" : "is-host";
                        const marked = i >= m0 && i <= m1 ? "is-mark" : "";
                        return (
                          <span key={`${i}-${b}`} className={`bit ${side} ${marked} ${b === "1" ? "is-one" : ""}`}>
                            {b}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {(prefix !== undefined || step.results?.length) && (
        <div className="bits-foot">
          {prefix !== undefined && (
            <div className="bits-legend">
              <span className="bit is-net">1</span> network bits · <span className="bit is-host">0</span> host bits
            </div>
          )}
          {step.results && step.results.length > 0 && (
            <dl className="bits-results">
              {step.results.map((r) => (
                <div key={r.label} className={prevResults.has(`${r.label}=${r.value}`) ? "" : "is-new"}>
                  <dt>{r.label}</dt>
                  <dd>{r.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
    </div>
  );
}

export const BitsView = memo(BitsViewInner);
