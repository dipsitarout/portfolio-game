import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, MathUtils, type PointLight } from 'three'
import { PLAZA, zoneAt } from '../lib/zones'
import { useGameStore } from '../store/gameStore'

/**
 * A fixed pool of 3 point lights that glide to the current zone's light spots.
 * Keeps the shader's light count constant (no recompiles) however large the facility is,
 * and updates the HUD location label when the player changes zone.
 */
export function ZoneLights() {
  const refs = [useRef<PointLight>(null), useRef<PointLight>(null), useRef<PointLight>(null)]
  const camera = useThree((s) => s.camera)
  const current = useRef('')
  const tmp = useMemo(() => new Color(), [])

  useFrame((_, dt) => {
    const z = zoneAt(camera.position.x, camera.position.z)
    if (z.id !== current.current) {
      current.current = z.id
      useGameStore.getState().setLocation(z.name)
    }
    const k = 1 - Math.exp(-3 * dt)
    z.lights.forEach(([x, y, zz, c], i) => {
      const l = refs[i].current
      if (!l) return
      l.position.set(MathUtils.lerp(l.position.x, x, k), MathUtils.lerp(l.position.y, y, k), MathUtils.lerp(l.position.z, zz, k))
      l.color.lerp(tmp.set(c), k)
    })
  })

  return (
    <>
      {PLAZA.lights.map(([x, y, z, c], i) => (
        <pointLight key={i} ref={refs[i]} position={[x, y, z]} color={c} intensity={i === 0 ? 90 : 40} distance={i === 0 ? 42 : 22} decay={2} />
      ))}
    </>
  )
}
