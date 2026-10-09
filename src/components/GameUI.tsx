
import { memo } from 'react'
import { useGameStore, type TeleportDestination } from '../store/gameStore'
import { HolographicPanel } from './HolographicPanel'

const HINTS: [string, string][] = [
  ['WASD', 'MOVE'],
  ['SHIFT', 'SPRINT'],
  ['SPACE', 'JUMP'],
  ['E', 'INTERACT'],
  ['ESC', 'MENU'],
]

const DESTINATIONS: TeleportDestination[] = [
  { id: 'plaza', label: 'STARTING PLAZA', position: { x: 0, y: 1.5, z: 20 } },
  { id: 'lobby', label: 'LOBBY', position: { x: 0, y: 1.5, z: -20 } },
  { id: 'profile', label: 'PROFILE LAB', position: { x: -33, y: 1.5, z: -25 } },
  { id: 'skills', label: 'SKILLS LAB', position: { x: 33, y: 1.5, z: -25 } },
  { id: 'projects', label: 'PROJECTS LAB', position: { x: 0, y: 1.5, z: -60 } },
  { id: 'experience', label: 'EXPERIENCE LAB', position: { x: -33, y: 1.5, z: -62 } },
  { id: 'achievements', label: 'ACHIEVEMENTS LAB', position: { x: 33, y: 1.5, z: -62 } },
  { id: 'contact', label: 'CONTACT LAB', position: { x: 0, y: 1.5, z: -87 } },
]

const Hints = memo(function Hints() {
  return (
    <div className="hints">
      {HINTS.map(([k, a]) => (
        <div key={k} className="hint">
          <span className="key">{k}</span>
          <span>{a}</span>
        </div>
      ))}
    </div>
  )
})

function Crosshair() {
  const active = useGameStore((s) => s.interactId !== null)
  const hidden = useGameStore((s) => s.panel !== null || s.mapOpen)
  return <div className={(active ? 'crosshair active' : 'crosshair') + (hidden ? ' hidden' : '')} />
}

function Prompt() {
  const label = useGameStore((s) => s.interactLabel)
  const open = useGameStore((s) => s.panel !== null || s.mapOpen)
  if (!label || open) return null
  return (
    <div className="prompt">
      <span className="prompt-main">[E] INTERACT</span>
      <span className="prompt-sub">{label}</span>
    </div>
  )
}

function LocationHud() {
  const location = useGameStore((s) => s.location)
  return (
    <>
      <div className="loc" key={location}>
        <span className="loc-label">LOCATION</span> {location}
      </div>
      <div className="esc-hint">
        <span className="key">ESC</span> MENU
      </div>
    </>
  )
}

function QuickMap() {
  const mapOpen = useGameStore((s) => s.mapOpen)
  const setMapOpen = useGameStore((s) => s.setMapOpen)
  const requestTeleport = useGameStore((s) => s.requestTeleport)

  const closeMap = () => {
    setMapOpen(false)
    if (useGameStore.getState().phase === 'playing') {
      document.body.requestPointerLock?.()
    }
  }

  const teleport = (destination: TeleportDestination) => {
    requestTeleport(destination)
    document.body.requestPointerLock?.()
  }

  return (
    <>
      <button
        className="btn"
        style={{ position: 'fixed', top: 18, right: 18, zIndex: 30 }}
        onClick={() => {
          if (mapOpen) {
            closeMap()
          } else {
            document.exitPointerLock?.()
            setMapOpen(true)
          }
        }}
      >
        {mapOpen ? 'CLOSE MAP' : 'MAP / QUICK TRAVEL'}
      </button>

      {mapOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick travel map"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 29,
            display: 'grid',
            placeItems: 'center',
            padding: 20,
            background: 'rgba(3, 8, 20, 0.88)',
            color: '#e7faff',
            fontFamily: 'inherit',
          }}
        >
          <div
            style={{
              width: 'min(560px, 100%)',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: 24,
              border: '1px solid rgba(70, 230, 255, 0.5)',
              background: 'rgba(8, 18, 38, 0.98)',
              boxShadow: '0 0 35px rgba(0, 210, 255, 0.12)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>FACILITY NAVIGATION</h2>
            <p>Select a destination to travel there instantly.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
              {DESTINATIONS.map((destination) => (
                <button
                  key={destination.id}
                  className="btn"
                  onClick={() => teleport(destination)}
                  style={{ minHeight: 48, textAlign: 'left' }}
                >
                  {destination.label}
                </button>
              ))}
            </div>

            <button className="btn" style={{ marginTop: 16, width: '100%' }} onClick={closeMap}>
              BACK TO GAME
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export function GameUI() {
  const playing = useGameStore((s) => s.phase === 'playing')
  return (
    <div className="hud">
      <div className="fadein" />
      <Crosshair />
      <Prompt />
      <HolographicPanel />
      {playing && <QuickMap />}
      <LocationHud />
      <Hints />
    </div>
  )
}
