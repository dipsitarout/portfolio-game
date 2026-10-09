import { Block, FloorArrow, HoloPanel, Strip, VIOLET } from '../primitives'

/** Security corridor (x ±4, z -30 .. -46) between the main hall and the Project Lab. */
export function Corridor() {
  return (
    <>
      <Block pos={[-4.5, 2.8, -38]} size={[1, 5.6, 16]} />
      <Block pos={[4.5, 2.8, -38]} size={[1, 5.6, 16]} />
      <Block pos={[0, 5.4, -38]} size={[10, 0.4, 16]} color="#101a30" />
      <Strip pos={[-3.2, 0.04, -38]} size={[0.12, 0.04, 16]} />
      <Strip pos={[3.2, 0.04, -38]} size={[0.12, 0.04, 16]} />
      <Strip pos={[0, 5.15, -38]} size={[0.3, 0.05, 15]} color={VIOLET} />
      {[-33, -38, -43].map((z) => (
        <group key={z}>
          <Strip pos={[-3.95, 2.8, z]} size={[0.05, 3.4, 0.1]} color={VIOLET} />
          <Strip pos={[3.95, 2.8, z]} size={[0.05, 3.4, 0.1]} color={VIOLET} />
        </group>
      ))}
      <HoloPanel pos={[-3.9, 2.6, -37]} size={[3, 1.3]} rotY={Math.PI / 2} title="PROJECT LAB" lines={['AHEAD']} center float={false} />
      {[-34, -37, -40, -43].map((z) => <FloorArrow key={z} pos={[0, z]} dir="n" />)}
    </>
  )
}
