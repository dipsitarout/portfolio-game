import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Sparkles, Stars } from '@react-three/drei'
import { Color, Matrix4, Quaternion, Vector3, type DirectionalLight, type Group, type InstancedMesh } from 'three'
import { useSettings } from '../store/settingsStore'
import { CYAN, VIOLET, glowMat } from './primitives'

const FOG = '#060b18'

function mulberry32(a: number) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Ring of far-away towers (2 instanced draw calls) that sell the scale of the facility. */
function Skyline() {
  const body = useRef<InstancedMesh>(null)
  const glow = useRef<InstancedMesh>(null)
  const towers = useMemo(() => {
    const r = mulberry32(7)
    return Array.from({ length: 32 }, (_, i) => {
      const a = (i / 32) * Math.PI * 2 + r() * 0.1
      const d = 130 + r() * 110
      return { x: Math.cos(a) * d, z: -35 + Math.sin(a) * d, w: 8 + r() * 14, h: 35 + r() * (r() > 0.8 ? 150 : 70), a, violet: r() > 0.5 }
    })
  }, [])
  useLayoutEffect(() => {
    const m = new Matrix4()
    const q = new Quaternion()
    const col = new Color()
    towers.forEach((t, i) => {
      m.compose(new Vector3(t.x, t.h / 2 - 20, t.z), q, new Vector3(t.w, t.h, t.w))
      body.current?.setMatrixAt(i, m)
      const dx = -Math.cos(t.a)
      const dz = -Math.sin(t.a)
      m.compose(new Vector3(t.x + dx * (t.w / 2 + 0.1), t.h * 0.45 - 20, t.z + dz * (t.w / 2 + 0.1)), q, new Vector3(1.3, t.h * 0.85, 1.3))
      glow.current?.setMatrixAt(i, m)
      glow.current?.setColorAt(i, col.set(t.violet ? VIOLET : CYAN).multiplyScalar(1.8))
    })
    for (const mesh of [body.current, glow.current]) if (mesh) mesh.instanceMatrix.needsUpdate = true
    if (glow.current?.instanceColor) glow.current.instanceColor.needsUpdate = true
  }, [towers])
  return (
    <>
      <instancedMesh ref={body} args={[undefined, undefined, towers.length]} frustumCulled={false}>
        <boxGeometry />
        <meshStandardMaterial color="#0c1428" metalness={0.5} roughness={0.6} />
      </instancedMesh>
      <instancedMesh ref={glow} args={[undefined, undefined, towers.length]} frustumCulled={false}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </>
  )
}

function Rings() {
  const refs = [useRef<Group>(null), useRef<Group>(null), useRef<Group>(null)]
  const defs: { p: [number, number, number]; r: number; c: string; s: number }[] = [
    { p: [-90, 60, -150], r: 18, c: CYAN, s: 0.12 },
    { p: [110, 80, -200], r: 26, c: VIOLET, s: -0.08 },
    { p: [0, 120, -330], r: 60, c: CYAN, s: 0.04 },
  ]
  useFrame((_, dt) => refs.forEach((r, i) => r.current && (r.current.rotation.z += dt * defs[i].s)))
  return (
    <>
      {defs.map((d, i) => (
        <group key={i} ref={refs[i]} position={d.p} rotation={[1.1, 0.3 * i, 0]}>
          <mesh material={glowMat(d.c, 2)}>
            <torusGeometry args={[d.r, d.r * 0.025, 8, 80]} />
          </mesh>
          <mesh rotation={[0, 0, 0.4]} material={glowMat(d.c, 1.2)}>
            <torusGeometry args={[d.r * 0.7, d.r * 0.012, 8, 64]} />
          </mesh>
        </group>
      ))}
    </>
  )
}

export function Environment() {
  const quality = useSettings((s) => s.quality)
  const k = quality === 'low' ? 0.4 : 1
  const light = useRef<DirectionalLight>(null)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    const l = light.current
    if (!l) return
    l.target.position.set(0, 0, -35) // aim the shadow frustum at the middle of the facility
    scene.add(l.target)
    return () => {
      scene.remove(l.target)
    }
  }, [scene])
  return (
    <>
      <color attach="background" args={[FOG]} />
      <fog attach="fog" args={[FOG, 30, 260]} />
      <ambientLight intensity={0.26} color="#8fb4ff" />
      <hemisphereLight args={['#6fa0ff', '#0a1020', 0.35]} />
      <directionalLight
        ref={light}
        position={[40, 70, -10]}
        intensity={0.9}
        color="#bcd2ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-camera-near={5}
        shadow-camera-far={200}
        shadow-bias={-0.0005}
      />
      <Stars radius={320} depth={60} count={1500} factor={5} fade speed={0.3} />
      <mesh position={[-120, 90, -300]}>
        <sphereGeometry args={[42, 24, 16]} />
        <meshBasicMaterial color="#6f57c9" fog={false} toneMapped={false} />
      </mesh>
      <Skyline />
      <Rings />
      <Sparkles count={Math.round(60 * k)} scale={[100, 12, 50]} size={3} speed={0.3} color={CYAN} position={[0, 6, 10]} />
      <Sparkles count={Math.round(30 * k)} scale={[40, 10, 15]} size={3} speed={0.25} color={VIOLET} position={[0, 6, -22]} />
      <Sparkles count={Math.round(40 * k)} scale={[42, 10, 30]} size={3} speed={0.25} color={VIOLET} position={[0, 6, -62]} />
    </>
  )
}
