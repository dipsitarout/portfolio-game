import { useEffect, useState } from 'react'
import type { PanelContent } from '../data/types'
import { hidePanel } from '../lib/panels'
import { useGameStore } from '../store/gameStore'

/** In-game holographic terminal for projects, skills, experience, achievements and contact. */
export function HolographicPanel() {
  const panel = useGameStore((s) => s.panel)
  const [shown, setShown] = useState<PanelContent | null>(null)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (panel) {
      setShown(panel)
      setLeaving(false)
      return
    }
    setLeaving(true)
    const t = window.setTimeout(() => {
      setShown(null)
      setLeaving(false)
    }, 320)
    return () => window.clearTimeout(t)
  }, [panel])

  // ESC while a panel is open (cursor is free): close it and open the pause menu.
  useEffect(() => {
    if (!panel) return
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Escape') return
      const s = useGameStore.getState()
      s.closePanel()
      s.pause()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panel])

  if (!shown) return null
  return (
    <div className={leaving ? 'hp leave' : 'hp enter'} key={leaving ? 'leaving' : shown.title}>
      <div className="hp-scan" />
      {!leaving && (
        <div className="hp-boot">
          <span>ACCESSING {shown.eyebrow ?? 'FILE'}…</span>
          <i />
        </div>
      )}
      <div className="hp-content">
        {shown.eyebrow && <p className="hp-eyebrow">{shown.eyebrow}</p>}
        <h2>{shown.title}</h2>
        {shown.category && <p className="hp-cat">{shown.category}</p>}
        {shown.subtitle && <p className="hp-sub">{shown.subtitle}</p>}
        {shown.body && <p className="hp-body">{shown.body}</p>}
        {shown.tags && shown.tags.length > 0 && (
          <div className="hp-block">
            {shown.tagsHeading && <h3>{shown.tagsHeading}</h3>}
            <div className="hp-tags">
              {shown.tags.map((t) => (
                <span key={t} className="hp-tag">{t}</span>
              ))}
            </div>
          </div>
        )}
        {shown.sections?.map((s) => (
          <div key={s.heading} className="hp-block">
            <h3>{s.heading}</h3>
            <ul className={s.items.length > 1 ? '' : 'one'}>
              {s.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
        {shown.note && <p className="hp-note">{shown.note}</p>}
        {shown.links && shown.links.length > 0 && (
          <div className="hp-links">
            {shown.links.map((l) =>
              l.url ? (
                <a key={l.label} className="hp-link" href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>
              ) : (
                <span key={l.label} className="hp-link off" title="Link not added yet">{l.label}</span>
              ),
            )}
          </div>
        )}
        <div className="hp-foot">
          <button className="hp-close" onClick={hidePanel}>CLOSE</button>
          <span>[E] CLOSE</span>
        </div>
      </div>
    </div>
  )
}
