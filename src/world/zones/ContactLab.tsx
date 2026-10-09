import { profile } from '../../data/profile'
import { contactPanel } from '../../lib/panels'
import { glowMat, HoloPanel, Pillar, Strip, Terminal, CYAN, VIOLET } from '../primitives'

/** Contact room: x -14..14, z -97..-78. A big terminal at the far end. */
export function ContactLab() {
  return (
    <>
      <HoloPanel pos={[0, 7, -96.4]} size={[13, 4.4]} title="LET'S BUILD SOMETHING." lines={[profile.name]} center float={false} titleScale={0.8} lineScale={1.3} />
      <Terminal id="terminal-contact" label="CONTACT TERMINAL" pos={[0, 0, -92]} screenTitle="CONTACT" screenLines={['GITHUB · LINKEDIN', 'EMAIL · RESUME']} content={contactPanel} />
      <mesh position={[0, 0.04, -92]} rotation={[Math.PI / 2, 0, 0]} material={glowMat(CYAN)}>
        <torusGeometry args={[3, 0.05, 6, 48]} />
      </mesh>
      <Strip pos={[0, 0.04, -85]} size={[0.2, 0.04, 14]} />
      <Pillar pos={[-9, 0, -84]} h={13.8} r={0.6} color={VIOLET} />
      <Pillar pos={[9, 0, -84]} h={13.8} r={0.6} color={VIOLET} />
    </>
  )
}
