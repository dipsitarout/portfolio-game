import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { useSettings, type Quality } from '../store/settingsStore'
import { stopAudio } from '../lib/audio'

const CONTROLS: [string, string][] = [
  ['W A S D', 'Move'],
  ['MOUSE', 'Look around'],
  ['SHIFT', 'Sprint'],
  ['SPACE', 'Jump'],
  ['E', 'Interact'],
  ['ESC', 'Pause menu'],
]
const QUALITIES: Quality[] = ['low', 'medium', 'high']

function Slider({ label, value, min, max, step, format, onChange }: {
  label: string; value: number; min: number; max: number; step: number; format: (v: number) => string; onChange: (v: number) => void
}) {
  return (
    <label className="row">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
      <span className="val">{format(value)}</span>
    </label>
  )
}

function Settings() {
  const { sensitivity, volume, quality, set } = useSettings()
  return (
    <div className="settings">
      <Slider label="SENSITIVITY" value={sensitivity} min={0.2} max={2.5} step={0.05} format={(v) => v.toFixed(2) + 'x'} onChange={(v) => set({ sensitivity: v })} />
      <Slider label="VOLUME" value={volume} min={0} max={1} step={0.05} format={(v) => Math.round(v * 100) + '%'} onChange={(v) => set({ volume: v })} />
      <div className="row">
        <span>GRAPHICS</span>
        <div className="seg">
          {QUALITIES.map((q) => (
            <button key={q} className={q === quality ? 'seg-btn on' : 'seg-btn'} onClick={() => set({ quality: q })}>
              {q.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <p className="hint-text">LOW: no shadows, fewer particles · MEDIUM: shadows · HIGH: shadows + glow, sharper</p>
    </div>
  )
}

export function PauseMenu() {
  const view = useGameStore((s) => s.pauseView)
  const { resume, setPauseView, exitToMenu } = useGameStore.getState()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && useGameStore.getState().pauseView !== 'main') useGameStore.getState().setPauseView('main')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onResume = () => {
    resume()
    document.body.requestPointerLock?.()
  }
  const onExit = () => {
    exitToMenu() // set phase first so the pointer-lock handler doesn't re-pause
    stopAudio()
    if (document.pointerLockElement) document.exitPointerLock()
  }

  return (
    <div className="pause">
      <div className="pause-card">
        <h2>PAUSED</h2>
        {view === 'controls' && (
          <ul className="controls">
            {CONTROLS.map(([k, a]) => (
              <li key={k}>
                <span className="key">{k}</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        )}
        {view === 'settings' && <Settings />}
        {view === 'main' ? (
          <>
            <button className="btn" onClick={onResume}>RESUME</button>
            <button className="btn" onClick={() => setPauseView('settings')}>SETTINGS</button>
            <button className="btn" onClick={() => setPauseView('controls')}>CONTROLS</button>
            <button className="btn" onClick={onExit}>EXIT TO MENU</button>
          </>
        ) : (
          <button className="btn" onClick={() => setPauseView('main')}>BACK</button>
        )}
      </div>
    </div>
  )
}
