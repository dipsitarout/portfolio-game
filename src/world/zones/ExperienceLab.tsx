import { experience } from '../../data/experience'
import { experiencePanel, showPanel } from '../../lib/panels'
import { ExhibitStand } from '../ExhibitStand'
import { glowMat, HoloPanel, Pillar, Strip, VIOLET, CYAN } from '../primitives'

/** Experience lab: x -44..-22, z -74..-50. A glowing timeline rail with one node per item. */
export function ExperienceLab() {
  return (
    <>
      <HoloPanel pos={[-43.9, 4, -62]} size={[8, 3]} rotY={Math.PI / 2} title="EXPERIENCE" lines={['TIMELINE  ·  PRESS E ON A NODE']} center float={false} />
      <Strip pos={[-33, 0.04, -62]} size={[0.2, 0.04, 21]} />
      <Strip pos={[-33.5, 0.04, -62]} size={[0.06, 0.04, 21]} color={VIOLET} />
      {experience.map((e, i) => {
        const east = i % 2 === 1
        const z = -53.5 - i * 3.4
        const x = east ? -30 : -36
        return (
          <group key={e.id}>
            <mesh position={[-33, 0.05, z]} material={glowMat(e.color, 2.4)}>
              <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
            </mesh>
            <Strip pos={[(x - 33) / 2, 0.04, z]} size={[Math.abs(x + 33) - 0.6, 0.03, 0.06]} color={e.color} />
            <ExhibitStand id={`exp-${e.id}`} label={e.label} pos={[x, 0, z]} color={e.color} height={0.6} radius={0.4} hover={0.8} onInteract={() => showPanel(experiencePanel(e))}>
              <mesh>
                <sphereGeometry args={[0.25, 16, 12]} />
                <meshStandardMaterial color="#000" emissive={e.color} emissiveIntensity={2.4} toneMapped={false} />
              </mesh>
              <HoloPanel pos={[0, 1.1, 0]} size={[3.2, 1.2]} rotY={east ? -Math.PI / 2 : Math.PI / 2} title={e.label} lines={[e.kind.toUpperCase()]} color={e.color} center titleScale={0.8} />
            </ExhibitStand>
          </group>
        )
      })}
      <Pillar pos={[-24, 0, -72]} h={13.8} r={0.6} color={CYAN} />
      <Pillar pos={[-24, 0, -52]} h={13.8} r={0.6} color={CYAN} />
    </>
  )
}
