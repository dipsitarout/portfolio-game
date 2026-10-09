import { RigidBody, CylinderCollider } from '@react-three/rapier'
import { AdditiveBlending, DoubleSide } from 'three'
import { directoryPanel } from '../../lib/panels'
import { CYAN, FloorArrow, glowMat, HoloGlobe, HoloPanel, hullMat, Pillar, Rack, Strip, Terminal, VIOLET } from '../primitives'

/** Main facility hall (x ±22, z -14 .. -30): doors west (Profile), east (Skills), north (Projects). */
export function Lobby() {
  return (
    <>
      {[-10, 10].flatMap((x) => [-20, -26].map((z) => <Pillar key={`${x}${z}`} pos={[x, 0, z]} h={13.8} r={0.8} color={VIOLET} />))}
      <RigidBody type="fixed" colliders={false} position={[0, 0, -20]} friction={0}>
        <CylinderCollider args={[0.5, 2.2]} position={[0, 0.5, 0]} friction={0} />
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow material={hullMat('#1a2745')}>
          <cylinderGeometry args={[2.2, 2.4, 1, 32]} />
        </mesh>
        <mesh position={[0, 1.02, 0]} material={glowMat(CYAN, 1.6)}>
          <cylinderGeometry args={[1.9, 1.9, 0.03, 32]} />
        </mesh>
      </RigidBody>
      <HoloGlobe pos={[0, 2.5, -20]} />
      <Terminal id="terminal-directory" label="FACILITY DIRECTORY" pos={[7, 0, -27.5]} screenTitle="DIRECTORY" screenLines={['PRESS E']} content={directoryPanel} />

      {[-16.2, -17.6, -26.4, -27.8].flatMap((z) => [
        <Rack key={`l${z}`} pos={[-21.5, 0, z]} facing="+x" />,
        <Rack key={`r${z}`} pos={[21.5, 0, z]} facing="-x" />,
      ])}
      {[-14, -6, 6, 14].map((x) => <Strip key={x} color={Math.abs(x) > 10 ? VIOLET : CYAN} pos={[x, 13.9, -22]} size={[0.3, 0.08, 14]} />)}
      {[-14, 14].map((x) => (
        <mesh key={x} position={[x, 7, -22]}>
          <coneGeometry args={[3.2, 14, 24, 1, true]} />
          <meshBasicMaterial color={VIOLET} transparent opacity={0.05} depthWrite={false} blending={AdditiveBlending} side={DoubleSide} toneMapped={false} />
        </mesh>
      ))}

      {/* room signs + floor paths */}
      <HoloPanel pos={[0, 7.2, -29.4]} size={[7, 2.2]} title="PROJECT LAB" lines={['↑ NORTH  ·  PRESS E ON THE DOOR']} center float={false} />
      <HoloPanel pos={[-21.9, 6.4, -22]} size={[6, 2]} rotY={Math.PI / 2} title="← PROFILE LAB" lines={['WEST DOOR']} color={VIOLET} center float={false} />
      <HoloPanel pos={[21.9, 6.4, -22]} size={[6, 2]} rotY={-Math.PI / 2} title="SKILLS LAB →" lines={['EAST DOOR']} color={VIOLET} center float={false} />
      <Strip pos={[0, 0.03, -16]} size={[0.15, 0.04, 3]} />
      <FloorArrow pos={[0, -17]} dir="n" />
      <FloorArrow pos={[0, -27.3]} dir="n" />
      {[-12, -15, -18].map((x) => <FloorArrow key={x} pos={[x, -22]} dir="w" color={VIOLET} />)}
      {[12, 15, 18].map((x) => <FloorArrow key={x} pos={[x, -22]} dir="e" color={VIOLET} />)}
    </>
  )
}
