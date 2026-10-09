import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import gsap from 'gsap'
import { DoubleSide, MeshStandardMaterial, type Group, type Mesh, type Object3D } from 'three'
import { Interactable } from '../components/Interactable'
import { occluders } from '../lib/interactables'
import { playDoor } from '../lib/audio'
import { makeHoloTexture } from '../lib/textures'
import { showPanel } from '../lib/panels'
import type { PanelContent } from '../data/types'

export type V3 = [number, number, number]
export const CYAN = '#38e8ff'
export const VIOLET = '#b07cff'
export const HULL = '#151f38'

const hullCache = new Map<string, MeshStandardMaterial>()
export const hullMat = (c: string) => {
  let m = hullCache.get(c)
  if (!m) hullCache.set(c, (m = new MeshStandardMaterial({ color: c, metalness: 0.45, roughness: 0.5 })))
  return m
}
const glowCache = new Map<string, MeshStandardMaterial>()
export const glowMat = (c: string, i = 2.6) => {
  const k = c + i
  let m = glowCache.get(k)
  if (!m) glowCache.set(k, (m = new MeshStandardMaterial({ color: '#000', emissive: c, emissiveIntensity: i, toneMapped: false })))
  return m
}

function useOccluder(ref: RefObject<Object3D | null>) {
  useEffect(() => {
    const o = ref.current
    if (!o) return
    occluders.add(o)
    return () => {
      occluders.delete(o)
    }
  }, [ref])
}

/** Solid box with a fixed collider. Everything the player can touch should be a Block/Pillar/Rack. */
export function Block({ pos, size, rot = [0, 0, 0], color = HULL }: { pos: V3; size: V3; rot?: V3; color?: string }) {
  const ref = useRef<Mesh>(null)
  useOccluder(ref)
  return (
    <RigidBody type="fixed" colliders="cuboid" position={pos} rotation={rot} friction={0}>
      <mesh ref={ref} castShadow receiveShadow material={hullMat(color)}>
        <boxGeometry args={size} />
      </mesh>
    </RigidBody>
  )
}

/** Non-solid emissive detail. */
export function Strip({ pos, size, color = CYAN, intensity }: { pos: V3; size: V3; color?: string; intensity?: number }) {
  return (
    <mesh position={pos} material={glowMat(color, intensity)}>
      <boxGeometry args={size} />
    </mesh>
  )
}

export function Pillar({ pos, h = 6, r = 0.5, color = CYAN }: { pos: V3; h?: number; r?: number; color?: string }) {
  const ref = useRef<Mesh>(null)
  useOccluder(ref)
  return (
    <RigidBody type="fixed" colliders={false} position={pos} friction={0}>
      <CylinderCollider args={[h / 2, r]} position={[0, h / 2, 0]} friction={0} />
      <mesh ref={ref} position={[0, h / 2, 0]} castShadow receiveShadow material={hullMat('#1b2946')}>
        <cylinderGeometry args={[r, r, h, 20]} />
      </mesh>
      {[0.3, h * 0.5, h - 0.3].map((y) => (
        <mesh key={y} position={[0, y, 0]} material={glowMat(color)}>
          <cylinderGeometry args={[r + 0.03, r + 0.03, 0.08, 20]} />
        </mesh>
      ))}
    </RigidBody>
  )
}

export function Rack({ pos, facing }: { pos: V3; facing: '+x' | '-x' | '+z' | '-z' }) {
  const faceZ = facing[1] === 'z'
  const s = facing[0] === '+' ? 1 : -1
  const size: V3 = faceZ ? [1.3, 2.8, 0.9] : [0.9, 2.8, 1.3]
  return (
    <>
      <Block pos={[pos[0], pos[1] + 1.4, pos[2]]} size={size} color="#10192e" />
      {[0.7, 1.3, 1.9, 2.4].map((y, i) => (
        <Strip
          key={y}
          color={i % 2 ? VIOLET : CYAN}
          pos={faceZ ? [pos[0], pos[1] + y, pos[2] + s * 0.46] : [pos[0] + s * 0.46, pos[1] + y, pos[2]]}
          size={faceZ ? [1.0, 0.05, 0.04] : [0.04, 0.05, 1.0]}
        />
      ))}
    </>
  )
}

export function HoloPanel({
  pos, size, title, lines = [], color = CYAN, rotY = 0, float = true, center = false, titleScale, lineScale,
}: {
  pos: V3; size: [number, number]; title: string; lines?: string[]; color?: string; rotY?: number
  float?: boolean; center?: boolean; titleScale?: number; lineScale?: number
}) {
  const key = lines.join('|')
  const tex = useMemo(
    () => makeHoloTexture(title, lines, color, size[0] / size[1], { center, titleScale, lineScale, w: size[0] > 7 ? 1024 : 640 }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [title, key, color, size[0], size[1], center, titleScale, lineScale],
  )
  useEffect(() => () => tex.dispose(), [tex])
  const g = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (float && g.current) g.current.position.y = pos[1] + Math.sin(clock.elapsedTime * 0.8 + pos[0]) * 0.05
  })
  return (
    <group ref={g} position={pos} rotation={[0, rotY, 0]}>
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} side={DoubleSide} opacity={0.96} />
      </mesh>
    </group>
  )
}

const DOOR_W = 4
const DOOR_H = 4.4

/** `axis` is the direction the wall runs: 'x' = wall along X (door faces Z), 'z' = wall along Z (door faces X). */
export function Door({ id, pos, mode, axis = 'x', label = 'SECURITY DOOR' }: { id: string; pos: V3; mode: 'interact' | 'auto'; axis?: 'x' | 'z'; label?: string }) {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const slab = useRef<Group>(null)
  const camera = useThree((s) => s.camera)

  const move = (o: boolean) => {
    if (openRef.current === o) return
    openRef.current = o
    setOpen(o)
    if (slab.current) gsap.to(slab.current.position, { y: o ? DOOR_H + 0.7 : DOOR_H / 2, duration: 1.1, ease: 'power2.inOut', overwrite: true })
    playDoor()
  }
  useFrame(() => {
    if (mode !== 'auto') return
    const d = Math.hypot(camera.position.x - pos[0], camera.position.z - pos[2])
    if (!openRef.current && d < 4.5) move(true)
    else if (openRef.current && d > 8) move(false)
  })

  const col: V3 = axis === 'x' ? [DOOR_W / 2, DOOR_H / 2, 0.3] : [0.3, DOOR_H / 2, DOOR_W / 2]
  return (
    <>
      {!open && <CuboidCollider args={col} position={[pos[0], pos[1] + DOOR_H / 2, pos[2]]} friction={0} />}
      <group position={pos} rotation={[0, axis === 'x' ? 0 : Math.PI / 2, 0]}>
        <Interactable id={id} label={label} enabled={mode === 'interact' && !open} onInteract={() => move(true)}>
          <group ref={slab} position={[0, DOOR_H / 2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[DOOR_W, DOOR_H, 0.4]} />
              <meshStandardMaterial color="#13213d" metalness={0.7} roughness={0.35} />
            </mesh>
            {[-1, 1].flatMap((sx) =>
              [-1, 1].map((sz) => (
                <mesh key={`${sx}${sz}`} position={[sx * 0.7, 0, sz * 0.21]}>
                  <boxGeometry args={[0.1, DOOR_H * 0.8, 0.02]} />
                  <meshStandardMaterial color="#000" emissive={mode === 'auto' ? VIOLET : CYAN} emissiveIntensity={2.6} toneMapped={false} />
                </mesh>
              )),
            )}
          </group>
        </Interactable>
      </group>
    </>
  )
}

export function Terminal({
  id, pos, label, screenTitle, screenLines = [], content,
}: { id: string; pos: V3; label: string; screenTitle: string; screenLines?: string[]; content: PanelContent }) {
  const key = screenLines.join('|')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tex = useMemo(() => makeHoloTexture(screenTitle, screenLines, CYAN, 1.5, { w: 512, center: true, titleScale: 0.75 }), [screenTitle, key])
  useEffect(() => () => tex.dispose(), [tex])
  return (
    <Interactable id={id} label={label} position={pos} onInteract={() => showPanel(content)}>
      <RigidBody type="fixed" colliders="cuboid" friction={0}>
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 1.1, 0.7]} />
          <meshStandardMaterial color="#111b33" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.38, 0.04]} rotation={[-0.35, 0, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.08]} />
          <meshStandardMaterial color="#04161e" emissive="#ffffff" emissiveMap={tex} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </RigidBody>
    </Interactable>
  )
}

/** Slowly turning holographic globe (non-solid). */
export function HoloGlobe({ pos, r = 0.9, color = CYAN }: { pos: V3; r?: number; color?: string }) {
  const g = useRef<Group>(null)
  const ring = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.5
    if (ring.current) ring.current.rotation.z += dt * 0.8
  })
  return (
    <group position={pos}>
      <group ref={g}>
        <mesh>
          <icosahedronGeometry args={[r, 1]} />
          <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={2.4} wireframe toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={ring} rotation={[1.2, 0, 0]}>
        <torusGeometry args={[r * 1.35, 0.015, 8, 48]} />
        <primitive object={glowMat(VIOLET)} attach="material" dispose={null} />
      </mesh>
    </group>
  )
}

/** Centrepiece of the core chamber. */
export function CoreHologram({ pos }: { pos: V3 }) {
  const a = useRef<Mesh>(null)
  const b = useRef<Mesh>(null)
  const c = useRef<Mesh>(null)
  const ico = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (a.current) a.current.rotation.x += dt * 0.6
    if (b.current) b.current.rotation.y += dt * 0.45
    if (c.current) c.current.rotation.z -= dt * 0.35
    if (ico.current) ico.current.rotation.y += dt * 0.25
  })
  return (
    <group position={pos}>
      <mesh ref={ico}>
        <icosahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial color="#000" emissive={VIOLET} emissiveIntensity={2.6} wireframe toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.35, 16, 12]} />
        <primitive object={glowMat(CYAN, 4)} attach="material" dispose={null} />
      </mesh>
      <mesh ref={a} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[1.5, 0.03, 8, 64]} />
        <primitive object={glowMat(CYAN)} attach="material" dispose={null} />
      </mesh>
      <mesh ref={b} rotation={[1.2, 0.3, 0]}>
        <torusGeometry args={[1.9, 0.03, 8, 64]} />
        <primitive object={glowMat(VIOLET)} attach="material" dispose={null} />
      </mesh>
      <mesh ref={c} rotation={[0.2, 1.2, 0]}>
        <torusGeometry args={[2.3, 0.025, 8, 64]} />
        <primitive object={glowMat(CYAN)} attach="material" dispose={null} />
      </mesh>
    </group>
  )
}

/** Glowing floor chevron pointing along `dir`. */
export function FloorArrow({ pos, dir = 'n', color = CYAN }: { pos: [number, number]; dir?: 'n' | 'w' | 'e' | 's'; color?: string }) {
  const rot = { n: 0, w: Math.PI / 2, e: -Math.PI / 2, s: Math.PI }[dir]
  return (
    <group position={[pos[0], 0.05, pos[1]]} rotation={[0, rot, 0]} scale={1.4}>
      <mesh position={[-0.3, 0, 0.3]} rotation={[0, Math.PI / 4, 0]} material={glowMat(color, 2)}>
        <boxGeometry args={[0.9, 0.03, 0.14]} />
      </mesh>
      <mesh position={[0.3, 0, 0.3]} rotation={[0, -Math.PI / 4, 0]} material={glowMat(color, 2)}>
        <boxGeometry args={[0.9, 0.03, 0.14]} />
      </mesh>
    </group>
  )
}
