import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { achievements } from '../../data/achievements'
import { achievementPanel, showPanel } from '../../lib/panels'
import { ExhibitStand } from '../ExhibitStand'
import { HoloPanel, Pillar, Strip, VIOLET } from '../primitives'

function Trophy({ color }: { color: string }) {
  const g = useRef<Group>(null)
  const ring = useRef<Group>(null)
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.7
    if (ring.current) ring.current.rotation.z += dt * 1.1
  })
  const mat = <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={2.2} toneMapped={false} />
  return (
    <group>
      <group ref={g}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
          {mat}
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.3, 0.1, 0.45, 12, 1, true]} />
          {mat}
        </mesh>
        <mesh position={[0, -0.38, 0]}>
          <cylinderGeometry args={[0.18, 0.2, 0.06, 12]} />
          {mat}
        </mesh>
      </group>
      <group ref={ring} rotation={[1.2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.55, 0.012, 6, 40]} />
          {mat}
        </mesh>
      </group>
    </group>
  )
}

/** Achievement chamber: x 22..44, z -74..-50. Trophies in a row facing the west door. */
export function AchievementsLab() {
  return (
    <>
      <HoloPanel pos={[43.9, 5.6, -62]} size={[8, 3]} rotY={-Math.PI / 2} title="ACHIEVEMENTS" lines={['PRESS E ON A TROPHY']} color={VIOLET} center float={false} />
      <Strip pos={[39, 0.04, -62]} size={[0.1, 0.04, 20]} color={VIOLET} />
      {achievements.map((a, i) => (
        <ExhibitStand key={a.id} id={`ach-${a.id}`} label={(a.event ?? a.title).toUpperCase()} pos={[39, 0, -54 - i * 4]} color={a.color} height={1} radius={0.55} hover={1} onInteract={() => showPanel(achievementPanel(a, i, achievements.length))}>
          <Trophy color={a.color} />
          <HoloPanel pos={[-0.4, 1.3, 0]} size={[3.6, 1.3]} rotY={-Math.PI / 2} title={a.event ?? a.title} lines={a.event ? [a.title] : []} color={a.color} center titleScale={a.event ? 0.55 : 0.6} lineScale={1.1} />
        </ExhibitStand>
      ))}
      <Pillar pos={[43, 0, -72]} h={13.8} r={0.6} color={VIOLET} />
      <Pillar pos={[43, 0, -52]} h={13.8} r={0.6} color={VIOLET} />
    </>
  )
}
