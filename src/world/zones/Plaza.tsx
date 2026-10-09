import { profile } from '../../data/profile'
import { welcomePanel } from '../../lib/panels'
import { Block, CYAN, FloorArrow, glowMat, HoloPanel, Pillar, Strip, Terminal, VIOLET } from '../primitives'

/** Starting plaza (z 34 .. -14) and the facade that carries the hero sign. */
export function Plaza() {
  return (
    <>
      {/* spawn inlay + light rails to the entrance */}
      <mesh position={[0, 0.04, 24]} rotation={[Math.PI / 2, 0, 0]} material={glowMat(CYAN)}>
        <torusGeometry args={[6, 0.06, 6, 64]} />
      </mesh>
      <mesh position={[0, 0.04, 24]} rotation={[Math.PI / 2, 0, 0]} material={glowMat(VIOLET)}>
        <torusGeometry args={[3.5, 0.04, 6, 64]} />
      </mesh>
      <Strip pos={[-4, 0.03, 6]} size={[0.15, 0.04, 40]} />
      <Strip pos={[4, 0.03, 6]} size={[0.15, 0.04, 40]} />
      {[14, 4, -6].map((z) => <FloorArrow key={z} pos={[0, z]} dir="n" />)}
      {[-8, 8].flatMap((x) => [14, 2, -8].map((z) => <Pillar key={`${x}${z}`} pos={[x, 0, z]} h={8} r={0.55} color={x < 0 ? CYAN : VIOLET} />))}

      {/* facade: hero sign + lighting */}
      <HoloPanel pos={[0, 10.2, -13.3]} size={[15, 5.4]} title={profile.name} lines={[profile.role, 'EXPLORE MY WORLD']} center float={false} titleScale={1.6} lineScale={1.5} />
      <HoloPanel pos={[-12, 3.4, -13.3]} size={[7, 1.2]} title="WASD TO MOVE • MOUSE TO LOOK • E TO INTERACT" center float={false} titleScale={0.42} color={VIOLET} />
      <HoloPanel pos={[-3.2, 1.7, 19]} size={[4.6, 0.9]} rotY={0.3} title="WASD MOVE • MOUSE LOOK • E INTERACT" center titleScale={0.5} />
      {[7, 10, 13, 16, 19, 25, 31, 37, 43].flatMap((x) => [-x, x].map((sx) => <Strip key={sx} color={VIOLET} pos={[sx, 7, -13.45]} size={[0.18, 11, 0.06]} />))}
      <Strip pos={[0, 13.2, -13.45]} size={[88, 0.15, 0.06]} />
      <Strip pos={[-3.1, 3.2, -13.45]} size={[0.15, 6.4, 0.06]} />
      <Strip pos={[3.1, 3.2, -13.45]} size={[0.15, 6.4, 0.06]} />
      <Strip pos={[0, 6.05, -13.45]} size={[6.3, 0.15, 0.06]} />

      {/* observation deck with a map panel (jump up) */}
      <Block pos={[-18, 0.5, 12]} size={[10, 1, 8]} color="#1a2745" />
      <Strip pos={[-18, 1.03, 16]} size={[10, 0.05, 0.08]} />
      <Strip pos={[-13, 1.03, 12]} size={[0.08, 0.05, 8]} />
      <HoloPanel pos={[-18, 2.6, 8.2]} size={[5, 2.5]} title="FACILITY MAP" lines={['PROFILE  ·  SKILLS  ·  PROJECTS', 'EXPERIENCE  ·  ACHIEVEMENTS', 'CONTACT']} />
      {[16, 10].map((z) => (
        <group key={z}>
          <Block pos={[16, 0.3, z]} size={[4, 0.6, 0.9]} color="#1a2745" />
          <Strip pos={[14.01, 0.62, z]} size={[0.02, 0.03, 0.9]} color={VIOLET} />
        </group>
      ))}

      <Terminal id="terminal-welcome" label="NAVIGATION TERMINAL" pos={[8, 0, 22]} screenTitle="WELCOME" screenLines={['PRESS E']} content={welcomePanel} />
    </>
  )
}
