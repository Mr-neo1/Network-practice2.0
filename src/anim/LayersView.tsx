import { memo, useMemo } from "react";
import type { LayersScene } from "./types";

type Props = { scene: LayersScene; index: number };

function LayersViewInner({ scene, index }: Props) {
  const step = scene.steps[index];
  const before = useMemo(() => {
    const prev = scene.steps[index - 1];
    return new Set(prev ? prev.rows.flatMap((r) => r.blocks.map((b) => b.id)) : []);
  }, [scene, index]);
  const focus = new Set(step.focus ?? []);
  const anyFocus = focus.size > 0;

  return (
    <div className={`layers ${scene.stack ? "has-stack" : ""}`}>
      {scene.stack && (
        <ol className="layer-stack" aria-label="Layers">
          {scene.stack.map((name) => (
            <li key={name} className={step.stackActive === name ? "is-active" : ""}>
              {name}
            </li>
          ))}
        </ol>
      )}
      <div className="layer-rows">
        {step.rows.map((row, ri) => {
          const total = row.blocks.reduce((s, b) => s + (b.w ?? 1), 0) || 1;
          let cum = 0;
          return (
            <div className="layer-row" key={ri}>
              {row.label && <div className="layer-row-label">{row.label}</div>}
              <div className="layer-track">
                {row.blocks.map((b) => {
                  const w = b.w ?? 1;
                  const left = (cum / total) * 100;
                  const width = (w / total) * 100;
                  cum += w;
                  const cls = [
                    "block",
                    `tone-${b.tone ?? "gray"}`,
                    before.has(b.id) ? "" : "is-enter",
                    focus.has(b.id) ? "is-focus" : anyFocus ? "is-dim" : "",
                  ].join(" ");
                  return (
                    <div key={b.id} className={cls} style={{ left: `calc(${left}% + 3px)`, width: `calc(${width}% - 6px)` }} title={b.sub ? `${b.label} · ${b.sub}` : b.label}>
                      <span className="block-label">{b.label}</span>
                      {b.sub && <span className="block-sub">{b.sub}</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const LayersView = memo(LayersViewInner);
