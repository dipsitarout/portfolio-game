export type LightSpot = [number, number, number, string]
export interface Zone {
  id: string
  name: string
  /** [xMin, xMax, zMin, zMax] */
  box: [number, number, number, number]
  /** Three light spots; the shared light pool glides to these when the player enters the zone. */
  lights: [LightSpot, LightSpot, LightSpot]
}

const C = '#38e8ff'
const V = '#b07cff'

export const PLAZA: Zone = {
  id: 'plaza', name: 'STARTING PLAZA', box: [-52, 52, -14, 34],
  lights: [[0, 14, 8, C], [-16, 6, -4, V], [14, 6, 22, C]],
}

export const ZONES: Zone[] = [
  { id: 'lobby', name: 'MAIN FACILITY', box: [-22.5, 22.5, -30, -14], lights: [[0, 10, -22, V], [-12, 4, -18, C], [12, 4, -26, C]] },
  { id: 'corridor', name: 'SECURITY CORRIDOR', box: [-4.5, 4.5, -46, -30], lights: [[0, 4, -35, C], [0, 4, -40, V], [0, 4, -44, C]] },
  { id: 'profile', name: 'PROFILE LAB', box: [-44.5, -22.5, -36, -14], lights: [[-33, 10, -25, C], [-40, 4, -20, V], [-28, 4, -31, V]] },
  { id: 'skills', name: 'SKILLS LAB', box: [22.5, 44.5, -36, -14], lights: [[33, 10, -25, V], [28, 4, -29, C], [38, 4, -20, C]] },
  { id: 'projects', name: 'PROJECT LAB', box: [-22.5, 22.5, -78, -46], lights: [[0, 11, -62, V], [-12, 5, -56, C], [12, 5, -56, C]] },
  { id: 'experience', name: 'EXPERIENCE LAB', box: [-44.5, -22.5, -74, -50], lights: [[-33, 10, -62, C], [-33, 4, -55, V], [-33, 4, -69, V]] },
  { id: 'achievements', name: 'ACHIEVEMENT CHAMBER', box: [22.5, 44.5, -74, -50], lights: [[33, 10, -62, V], [38, 4, -56, C], [38, 4, -68, C]] },
  { id: 'contact', name: 'CONTACT TERMINAL', box: [-14.5, 14.5, -97, -78], lights: [[0, 10, -88, C], [-7, 4, -92, V], [7, 4, -92, V]] },
]

export function zoneAt(x: number, z: number): Zone {
  return ZONES.find((q) => x >= q.box[0] && x <= q.box[1] && z >= q.box[2] && z <= q.box[3]) ?? PLAZA
}
