import { useRef } from 'react'
import gsap from 'gsap'
import { profile } from '../data/profile'
import { useGameStore } from '../store/gameStore'
import { initAudio } from '../lib/audio'

const isMobile = () =>
  window.matchMedia('(hover: none) and (pointer: coarse)').matches || /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent)

export function StartScreen() {
  const root = useRef<HTMLDivElement>(null)
  const busy = useRef(false)
  const mobile = isMobile()

  const play = () => {
    if (busy.current) return
    busy.current = true
    // Must run inside the click: grants pointer lock and unlocks audio.
    document.body.requestPointerLock?.()
    initAudio()
    gsap.to(root.current, {
      opacity: 0,
      scale: 1.06,
      duration: 0.7,
      ease: 'power2.in',
      onComplete: () => useGameStore.getState().startLoading(),
    })
  }

  return (
    <div className="start" ref={root}>
      <div className="start-grid" />
      <div className="start-inner">
        <h1 className="start-title">{profile.name}</h1>
        <p className="start-sub">{profile.tagline}</p>
        {mobile ? (
          <p className="start-note">
            This portfolio is designed as an interactive desktop experience.
            <br />
            Please open it on a desktop/laptop for the full experience.
          </p>
        ) : (
          <button className="btn btn-play" onClick={play}>
            ENTER THE WORLD
          </button>
        )}
      </div>
    </div>
  )
}
