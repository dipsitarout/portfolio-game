import { projects } from '../../data/projects'
import { ProjectStation } from './ProjectStation'
import { FloorArrow, CoreHologram, glowMat, HoloPanel, Pillar, Strip, VIOLET, CYAN } from '../primitives'

const CENTER: [number, number] = [0, -62]
const RADIUS = 11

/** Seven project stations on an arc facing the central core; the middle one sits in front of the north door. */
export function ProjectLab() {
  return (
    <>
      <CoreHologram pos={[CENTER[0], 4.8, CENTER[1]]} />
      {[6, 9].map((r) => (
        <mesh key={r} position={[CENTER[0], 0.04, CENTER[1]]} rotation={[Math.PI / 2, 0, 0]} material={glowMat(r === 6 ? CYAN : VIOLET)}>
          <torusGeometry args={[r, 0.06, 6, 72]} />
        </mesh>
      ))}
      {projects.map((p, i) => {
        const theta = ((15 + (150 / (projects.length - 1)) * i) * Math.PI) / 180
        const x = CENTER[0] + RADIUS * Math.cos(theta)
        const z = CENTER[1] - RADIUS * Math.sin(theta)
        const rotY = Math.atan2(CENTER[0] - x, CENTER[1] - z)
        return <ProjectStation key={p.id} project={p} pos={[x, 0, z]} rotY={rotY} />
      })}

      {[-16, 16].flatMap((x) => [-52, -72].map((z) => <Pillar key={`${x}${z}`} pos={[x, 0, z]} h={13.8} r={0.7} color={VIOLET} />))}
      <mesh position={[0, 13.4, CENTER[1]]} rotation={[Math.PI / 2, 0, 0]} material={glowMat(VIOLET)}>
        <torusGeometry args={[10, 0.12, 8, 72]} />
      </mesh>
      {[-12, -8, -4, 4, 8, 12].map((x) => <Strip key={x} color={VIOLET} pos={[x, 6, -77.45]} size={[0.12, 8, 0.05]} />)}

      <HoloPanel pos={[0, 9, -77.35]} size={[12, 3.4]} title="PROJECT LAB" lines={['STEP UP TO A STATION  ·  PRESS E TO INSPECT']} center float={false} />
      <HoloPanel pos={[-21.9, 6.6, -62]} size={[6, 2]} rotY={Math.PI / 2} title="← EXPERIENCE" lines={['TIMELINE LAB']} color={VIOLET} center float={false} />
      <HoloPanel pos={[21.9, 6.6, -62]} size={[6, 2]} rotY={-Math.PI / 2} title="ACHIEVEMENTS →" lines={['TROPHY CHAMBER']} color={VIOLET} center float={false} />
      <HoloPanel pos={[0, 6.6, -45.5]} size={[5, 1.6]} rotY={Math.PI} title="↑ CONTACT" lines={['NORTH DOOR']} center float={false} />

      <FloorArrow pos={[-17, -62]} dir="w" color={VIOLET} />
      <FloorArrow pos={[-19.5, -62]} dir="w" color={VIOLET} />
      <FloorArrow pos={[17, -62]} dir="e" color={VIOLET} />
      <FloorArrow pos={[19.5, -62]} dir="e" color={VIOLET} />
      <FloorArrow pos={[0, -48.5]} dir="n" />
      <FloorArrow pos={[0, -50.5]} dir="n" />
    </>
  )
}
