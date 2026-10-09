import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import { interactables } from '../lib/interactables'
import { useGameStore } from '../store/gameStore'

interface Props {
  id: string
  label: string
  onInteract: () => void
  enabled?: boolean
  position?: [number, number, number]
  children: ReactNode
}

/**
 * Makes children targetable (crosshair + E) and glows them while targeted.
 * Children must use their own (unshared) MeshStandardMaterials, since the glow edits emissive.
 */
export function Interactable({ id, label, onInteract, enabled = true, position, children }: Props) {
  const ref = useRef<Group>(null)
  const cb = useRef(onInteract)
  cb.current = onInteract

  useEffect(() => {
    const object = ref.current
    if (!object || !enabled) return
    object.userData.interactId = id
    interactables.set(id, { id, label, object, onInteract: () => cb.current() })

    const glow = (on: boolean, instant = false) =>
      object.traverse((o) => {
        const m = (o as Mesh).material as MeshStandardMaterial | undefined
        if (!m || !('emissive' in m)) return
        if (m.userData.baseEI === undefined) {
          m.userData.baseEI = m.emissiveIntensity
          if (m.emissive.getHex() === 0) {
            m.emissive.set('#38e8ff')
            m.userData.baseEI = 0
          }
        }
        const base = m.userData.baseEI as number
        const to = on ? (base === 0 ? 0.45 : base * 1.6 + 0.6) : base
        if (instant) m.emissiveIntensity = to
        else gsap.to(m, { emissiveIntensity: to, duration: 0.18, overwrite: true })
      })

    const unsub = useGameStore.subscribe((s, p) => {
      const now = s.interactId === id
      if (now !== (p.interactId === id)) glow(now)
    })
    return () => {
      unsub()
      interactables.delete(id)
      glow(false, true)
    }
  }, [id, label, enabled])

  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  )
}
