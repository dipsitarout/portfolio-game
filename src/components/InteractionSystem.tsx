import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Raycaster, Vector2, type Object3D } from 'three'
import { interactables, occluders } from '../lib/interactables'
import { playHover, playUi } from '../lib/audio'
import { hidePanel } from '../lib/panels'
import { useGameStore } from '../store/gameStore'

const RANGE = 3.5
const CHECK_INTERVAL = 0.08

/** Looks along the crosshair a few times per second; walls block the ray; E activates the target. */
export function InteractionSystem() {
  const camera = useThree((s) => s.camera)
  const raycaster = useMemo(() => {
    const r = new Raycaster()
    r.far = RANGE
    return r
  }, [])
  const center = useMemo(() => new Vector2(0, 0), [])
  const timer = useRef(0)
  const current = useRef<string | null>(null)

  useFrame((_, dt) => {
    if (useGameStore.getState().phase !== 'playing') return
    timer.current += dt
    if (timer.current < CHECK_INTERVAL) return
    timer.current = 0

    raycaster.setFromCamera(center, camera)
    const targets = [...Array.from(interactables.values(), (i) => i.object), ...occluders]
    const hit = raycaster.intersectObjects(targets, true)[0]
    let id: string | null = null
    if (hit) {
      let o: Object3D | null = hit.object
      while (o && !o.userData.interactId) o = o.parent
      id = (o?.userData.interactId as string | undefined) ?? null
    }
    if (id !== current.current) {
      current.current = id
      if (id) playHover()
      useGameStore.getState().setInteract(id, id ? (interactables.get(id)?.label ?? null) : null)
    }
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE' || e.repeat) return
      const s = useGameStore.getState()
      if (s.phase !== 'playing') return
      if (s.panel) {
        hidePanel()
        return
      }
      if (current.current) {
        playUi()
        interactables.get(current.current)?.onInteract()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}
