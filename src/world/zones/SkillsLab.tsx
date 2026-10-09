import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { Interactable } from '../../components/Interactable'
import { skillGroups, type SkillGroup } from '../../data/skills'
import { showPanel, skillPanel } from '../../lib/panels'
import { glowMat, HoloPanel, Pillar, VIOLET } from '../primitives'

/** Cluster centres (x, z) and ring radii inside the skills lab: x 22..44, z -36..-14. */
const LAYOUT: Record<SkillGroup['id'], { c: [number, number]; r: number }> = {
  frontend: { c: [28, -30], r: 2.6 },
  backend: { c: [39, -31], r: 1.4 },
  databases: { c: [39, -19], r: 1.4 },
  ai: { c: [31, -19.5], r: 3.2 },
  tools: { c: [41, -25], r: 1.8 },
}

function SkillCluster({ group }: { group: SkillGroup }) {
  const { c, r } = LAYOUT[group.id]
  const ring = useRef<Group>(null)
  useFrame((_, dt) => {
    if (ring.current) ring.current.rotation.y += dt * 0.15
  })
  const n = group.skills.length
  return (
    <>
      <mesh position={[c[0], 0.04, c[1]]} rotation={[Math.PI / 2, 0, 0]} material={glowMat(group.color, 1.6)}>
        <torusGeometry args={[r + 0.5, 0.04, 6, 48]} />
      </mesh>
      <HoloPanel pos={[c[0], 3.7, c[1]]} size={[3.4, 1.1]} rotY={Math.PI / 2} title={group.name} color={group.color} center titleScale={1.1} />
      <group ref={ring} position={[c[0], 0, c[1]]}>
        {group.skills.map((skill, i) => {
          const a = (i / n) * Math.PI * 2
          return (
            <Interactable
              key={skill.name}
              id={`skill-${group.id}-${i}`}
              label={skill.name.toUpperCase()}
              position={[Math.cos(a) * r, 1.5 + Math.sin(i * 1.3) * 0.3, Math.sin(a) * r]}
              onInteract={() => showPanel(skillPanel(group, skill))}
            >
              <mesh>
                <octahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial color="#000" emissive={group.color} emissiveIntensity={1.8} toneMapped={false} />
              </mesh>
              <mesh visible={false}>
                <sphereGeometry args={[0.45, 8, 6]} />
                <meshBasicMaterial />
              </mesh>
            </Interactable>
          )
        })}
      </group>
    </>
  )
}

/** Skills lab: entered from the west door; look at a node to see its name, press E for details. */
export function SkillsLab() {
  return (
    <>
      <HoloPanel pos={[43.9, 3.6, -25]} size={[8, 3]} rotY={-Math.PI / 2} title="SKILLS LAB" lines={['LOOK AT A NODE  ·  PRESS E']} color={VIOLET} center float={false} />
      {skillGroups.map((g) => (
        <SkillCluster key={g.id} group={g} />
      ))}
      <Pillar pos={[24, 0, -34]} h={13.8} r={0.6} color={VIOLET} />
      <Pillar pos={[24, 0, -16]} h={13.8} r={0.6} color={VIOLET} />
    </>
  )
}
