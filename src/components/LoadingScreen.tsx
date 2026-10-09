import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGameStore } from '../store/gameStore'

export function LoadingScreen() {
  const ready = useGameStore((s) => s.worldReady)
  const root = useRef<HTMLDivElement>(null)
  const prog = useRef({ v: 0 })
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const tw = gsap.to(prog.current, {
      v: 90,
      duration: 1.4,
      ease: 'power1.out',
      onUpdate: () => setPct(Math.round(prog.current.v)),
    })
    return () => {
      tw.kill()
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    const tl = gsap.timeline()
    tl.to(prog.current, {
      v: 100,
      duration: 0.5,
      overwrite: 'auto',
      onUpdate: () => setPct(Math.round(prog.current.v)),
    }).to(root.current, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => useGameStore.getState().finishLoading(!!document.pointerLockElement),
    })
    return () => {
      tl.kill()
    }
  }, [ready])

  return (
    <div className="loading" ref={root}>
      <p className="loading-text">INITIALIZING FACILITY</p>
      <div className="bar">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="loading-pct">{pct}%</p>
    </div>
  )
}
