import { useMemo } from 'react'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { DoubleSide, RepeatWrapping, type Texture } from 'three'
import { makeFloorTextures } from '../lib/textures'
import { Block, CYAN, Door, glowMat, hullMat, VIOLET, type V3 } from './primitives'
import { Wall, WALL_H } from './walls'
import { Plaza } from './zones/Plaza'
import { Lobby } from './zones/Lobby'
import { Corridor } from './zones/Corridor'
import { ProfileLab } from './zones/ProfileLab'
import { SkillsLab } from './zones/SkillsLab'
import { ProjectLab } from './zones/ProjectLab'
import { ExperienceLab } from './zones/ExperienceLab'
import { AchievementsLab } from './zones/AchievementsLab'
import { ContactLab } from './zones/ContactLab'

/*
 * World layout (x east, z north = negative). Island: x ±52, z -105 .. 34.
 *   Plaza (z 34..-14) -> Lobby (z -14..-30) -> Corridor (-30..-46) -> Project Lab (-46..-78) -> Contact (-78..-97)
 *   Lobby west/east doors  -> Profile Lab / Skills Lab        (x ∓22.5, z -22)
 *   Project Lab west/east  -> Experience Lab / Achievements   (x ∓22.5, z -62)
 */
const H = WALL_H

function tiled(t: Texture, rx: number, ry: number) {
  const c = t.clone()
  c.wrapS = c.wrapT = RepeatWrapping
  c.repeat.set(rx, ry)
  c.needsUpdate = true
  return c
}

function Floors() {
  const { plaza, interior } = useMemo(() => {
    const p = makeFloorTextures(CYAN)
    const i = makeFloorTextures(VIOLET)
    return {
      plaza: { map: tiled(p.map, 26, 34.75), glow: tiled(p.glow, 26, 34.75) },
      interior: { map: tiled(i.map, 22.25, 20.75), glow: tiled(i.glow, 22.25, 20.75) },
    }
  }, [])
  return (
    <>
      <CuboidCollider args={[52, 0.5, 69.5]} position={[0, -0.5, -35.5]} friction={0} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -35.5]} receiveShadow>
        <planeGeometry args={[104, 139]} />
        <meshStandardMaterial map={plaza.map} emissive="#ffffff" emissiveMap={plaza.glow} emissiveIntensity={0.55} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -55.5]} receiveShadow>
        <planeGeometry args={[89, 83]} />
        <meshStandardMaterial map={interior.map} emissive="#ffffff" emissiveMap={interior.glow} emissiveIntensity={0.6} metalness={0.35} roughness={0.35} />
      </mesh>
      <mesh position={[0, -4.5, -35.5]} material={hullMat('#0a1020')}>
        <boxGeometry args={[103, 8, 138]} />
      </mesh>
    </>
  )
}

function Rail({ pos, len, axis }: { pos: V3; len: number; axis: 'x' | 'z' }) {
  const sz: V3 = axis === 'x' ? [len, 4, 0.6] : [0.6, 4, len]
  const glass: V3 = axis === 'x' ? [len, 2.9, 0.08] : [0.08, 2.9, len]
  const top: V3 = axis === 'x' ? [len, 0.08, 0.14] : [0.14, 0.08, len]
  return (
    <RigidBody type="fixed" colliders={false} position={pos} friction={0}>
      <CuboidCollider args={[sz[0] / 2, sz[1] / 2, sz[2] / 2]} friction={0} />
      <mesh position={[0, -1.5, 0]} material={hullMat('#16223c')} castShadow receiveShadow>
        <boxGeometry args={[axis === 'x' ? len : 0.6, 1, axis === 'x' ? 0.6 : len]} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={glass} />
        <meshBasicMaterial color={CYAN} transparent opacity={0.07} depthWrite={false} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 1.95, 0]} material={glowMat(CYAN)}>
        <boxGeometry args={top} />
      </mesh>
    </RigidBody>
  )
}

function Shell() {
  return (
    <>
      {/* outer shell: facade (with entrance arch), sides, back, roof */}
      <Wall axis="x" at={-14} from={-44.5} to={44.5} gaps={[{ c: 0, w: 6, gh: 6 }]} />
      <Block pos={[-44.5, 7, -55.5]} size={[1, H, 83]} />
      <Block pos={[44.5, 7, -55.5]} size={[1, H, 83]} />
      <Block pos={[0, 7, -97]} size={[90, H, 1]} />
      <Block pos={[0, 14.5, -55.5]} size={[90, 1, 84]} color="#101a30" />

      {/* lobby */}
      <Wall axis="x" at={-30} from={-22.5} to={22.5} gaps={[{ c: 0, w: 4 }]} />
      <Wall axis="z" at={-22.5} from={-36} to={-14} gaps={[{ c: -22, w: 4 }]} />
      <Wall axis="z" at={22.5} from={-36} to={-14} gaps={[{ c: -22, w: 4 }]} />
      <Wall axis="x" at={-36} from={-44.5} to={-22.5} />
      <Wall axis="x" at={-36} from={22.5} to={44.5} />

      {/* project lab */}
      <Wall axis="x" at={-46} from={-22.5} to={22.5} gaps={[{ c: 0, w: 4 }]} />
      <Wall axis="x" at={-78} from={-22.5} to={22.5} gaps={[{ c: 0, w: 4 }]} />
      <Wall axis="z" at={-22.5} from={-78} to={-46} gaps={[{ c: -62, w: 4 }]} />
      <Wall axis="z" at={22.5} from={-78} to={-46} gaps={[{ c: -62, w: 4 }]} />

      {/* experience + achievements wings */}
      <Wall axis="x" at={-50} from={-44.5} to={-22.5} />
      <Wall axis="x" at={-74} from={-44.5} to={-22.5} />
      <Wall axis="x" at={-50} from={22.5} to={44.5} />
      <Wall axis="x" at={-74} from={22.5} to={44.5} />

      {/* contact room */}
      <Wall axis="z" at={-14.5} from={-97} to={-78} />
      <Wall axis="z" at={14.5} from={-97} to={-78} />

      <Door id="door-lobby" pos={[0, 0, -30]} mode="interact" label="SECURITY DOOR" />
      <Door id="door-profile" pos={[-22.5, 0, -22]} mode="auto" axis="z" />
      <Door id="door-skills" pos={[22.5, 0, -22]} mode="auto" axis="z" />
      <Door id="door-projects" pos={[0, 0, -46]} mode="auto" />
      <Door id="door-experience" pos={[-22.5, 0, -62]} mode="auto" axis="z" />
      <Door id="door-achievements" pos={[22.5, 0, -62]} mode="auto" axis="z" />
      <Door id="door-contact" pos={[0, 0, -78]} mode="auto" />
    </>
  )
}

export function Facility() {
  return (
    <>
      <Floors />
      <Rail pos={[0, 2, 34]} len={104} axis="x" />
      <Rail pos={[0, 2, -105]} len={104} axis="x" />
      <Rail pos={[-52, 2, -35.5]} len={139} axis="z" />
      <Rail pos={[52, 2, -35.5]} len={139} axis="z" />
      <Shell />
      <Plaza />
      <Lobby />
      <Corridor />
      <ProfileLab />
      <SkillsLab />
      <ProjectLab />
      <ExperienceLab />
      <AchievementsLab />
      <ContactLab />
    </>
  )
}
