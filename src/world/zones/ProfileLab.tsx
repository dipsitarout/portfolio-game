import { profile } from '../../data/profile'
import { skillGroups } from '../../data/skills'
import { profilePanel, showPanel } from '../../lib/panels'
import { wrapText } from '../../lib/textures'
import { ExhibitStand } from '../ExhibitStand'
import { HoloGlobe, HoloPanel, Pillar, Strip, VIOLET, CYAN } from '../primitives'

/** Profile lab: x -44..-22, z -36..-14. Entered from the east door; the identity panel faces the door. */
export function ProfileLab() {
  const g = (id: string) => skillGroups.find((s) => s.id === id)!
  const list = (id: string) => wrapText(g(id).skills.map((s) => s.name).join(' · '), 26)
  return (
    <>
      <HoloPanel pos={[-43.9, 3.4, -20.5]} size={[8, 4]} rotY={Math.PI / 2} title={profile.name} lines={[profile.degree, profile.specialization, profile.university]} float={false} />
      <HoloPanel
  pos={[-43.9, 3.4, -29.5]}
  size={[8, 3.6]}
  rotY={Math.PI / 2}
  title="PROFILE"
  color={VIOLET}
  lines={[
    'AI/ML and full-stack development.',
    'Building practical AI applications,',
    'RAG systems and multi-agent workflows.',
    'Interested in interactive technology.',
  ]}
  float={false}
  lineScale={0.72}
/>

      {[
        ['frontend', -40.5],
        ['backend', -33.5],
        ['databases', -26.5],
      ].map(([id, x]) => (
        <HoloPanel key={id as string} pos={[x as number, 3, -35.4]} size={[5.6, 3]} title={g(id as string).name} lines={list(id as string)} color={g(id as string).color} />
      ))}
      {[
        ['ai', -37],
        ['tools', -29],
      ].map(([id, x]) => (
        <HoloPanel key={id as string} pos={[x as number, 3, -14.6]} size={[5.6, 3]} rotY={Math.PI} title={g(id as string).name} lines={list(id as string)} color={g(id as string).color} />
      ))}

      <ExhibitStand id="profile-core" label="IDENTITY CORE" pos={[-33, 0, -25]} color={CYAN} onInteract={() => showPanel(profilePanel)}>
        <HoloGlobe pos={[0, 0.3, 0]} />
      </ExhibitStand>
      {[-14.6, -35.4].map((z) => <Strip key={z} pos={[-33, 0.04, z + (z < -25 ? 0.6 : -0.6)]} size={[20, 0.04, 0.1]} />)}
      <Pillar pos={[-24, 0, -34]} h={13.8} r={0.6} color={VIOLET} />
      <Pillar pos={[-24, 0, -16]} h={13.8} r={0.6} color={VIOLET} />
    </>
  )
}
