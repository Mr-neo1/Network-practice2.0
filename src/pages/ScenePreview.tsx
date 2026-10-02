// Development aid: render any scene, optionally frozen at one step.
//   #/scenes              list of all scenes
//   #/scene/<id>          interactive
//   #/scene/<id>/<step>   frozen at step (1-based), fully settled — used for screenshots
//   #/scene/<id>/play     starts playing immediately

import { Link } from "wouter";
import { Player } from "../anim/Player";
import { allLessons } from "../content/curriculum";
import { useScene } from "../content/load";

export function SceneList() {
  return (
    <div className="page">
      <h1>Scenes</h1>
      <ul className="scene-list">
        {allLessons.map((l) => (
          <li key={l.slug}>
            <Link href={`/scene/${l.scene}`}>{l.scene}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ScenePreview({ id, step }: { id: string; step?: string }) {
  const scene = useScene(id);
  if (scene.loading) return null;
  if (!scene.data) return <p style={{ padding: 24 }}>No scene "{id}".</p>;
  const autoplay = step === "play";
  const still = step && !autoplay ? Math.max(0, Math.min(scene.data.steps.length - 1, Number(step) - 1)) : undefined;
  return (
    <div className="scene-preview" data-ready="1">
      <Player scene={scene.data} still={still} autoplay={autoplay} />
    </div>
  );
}
