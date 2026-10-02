import { ExternalLink, Play } from "lucide-react";
import { useMemo, useState } from "react";
import type { Video } from "../content/types";
import { usePrefs, useT } from "../lib/prefs";
import { ui } from "../lib/ui";

/**
 * Videos from YouTube creators. Thumbnails load first; the player only loads when the learner clicks,
 * so a lesson page stays light. Hinglish mode puts Hindi videos first.
 */
export function VideoPanel({ videos }: { videos: Video[] }) {
  const { lang } = usePrefs();
  const t = useT();
  const ordered = useMemo(() => {
    const first = lang === "hi" ? "hi" : "en";
    return [...videos].sort((a, b) => (a.lang === first ? 0 : 1) - (b.lang === first ? 0 : 1));
  }, [videos, lang]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState(0);
  const video = ordered[Math.min(selected, ordered.length - 1)];
  if (!video) return null;

  return (
    <div className="videos">
      {ordered.length > 1 && (
        <div className="video-tabs" role="tablist">
          {ordered.map((v, i) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={i === selected}
              className={i === selected ? "is-on" : ""}
              onClick={() => {
                setSelected(i);
                setActiveId(null);
              }}
            >
              <span className={`lang-tag lang-${v.lang}`}>{v.lang === "hi" ? t(ui.hindi) : t(ui.english)}</span>
              <span className="video-tab-title">{v.channel}</span>
            </button>
          ))}
        </div>
      )}
      <div className="video-frame">
        {activeId === video.id ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button className="video-facade" onClick={() => setActiveId(video.id)} aria-label={`${t(ui.play)}: ${video.title}`}>
            <img src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="video-play">
              <Play size={22} fill="currentColor" />
            </span>
          </button>
        )}
      </div>
      <div className="video-meta">
        <div>
          <div className="video-title">{video.title}</div>
          <div className="video-sub">
            {video.channel} · <span className={`lang-tag lang-${video.lang}`}>{video.lang === "hi" ? t(ui.hindi) : t(ui.english)}</span>
          </div>
          {video.note && <p className="video-note">{t(video.note)}</p>}
        </div>
        <a className="video-link" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">
          {t(ui.openOnYoutube)} <ExternalLink size={14} />
        </a>
      </div>
    </div>
  );
}
