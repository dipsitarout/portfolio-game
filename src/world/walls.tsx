import { Block } from './primitives'

export const WALL_H = 14
const T = 1
export interface Gap {
  c: number // centre along the wall
  w: number
  gh?: number // opening height (default: door height)
}

/**
 * Wall with door openings. axis 'x': runs along X at z = `at`; axis 'z': runs along Z at x = `at`.
 * Generates solid segments plus a lintel above each opening, all with colliders.
 */
export function Wall({ axis, at, from, to, gaps = [], h = WALL_H }: { axis: 'x' | 'z'; at: number; from: number; to: number; gaps?: Gap[]; h?: number }) {
  const parts: { a: number; b: number; y0: number; y1: number }[] = []
  let cur = from
  for (const g of [...gaps].sort((p, q) => p.c - q.c)) {
    const s = g.c - g.w / 2
    const e = g.c + g.w / 2
    const gh = g.gh ?? 4.4
    if (s > cur) parts.push({ a: cur, b: s, y0: 0, y1: h })
    parts.push({ a: s, b: e, y0: gh, y1: h })
    cur = e
  }
  if (cur < to) parts.push({ a: cur, b: to, y0: 0, y1: h })
  return (
    <>
      {parts.map((p, i) => {
        const len = p.b - p.a
        const c = (p.a + p.b) / 2
        const ht = p.y1 - p.y0
        const y = p.y0 + ht / 2
        return axis === 'x' ? (
          <Block key={i} pos={[c, y, at]} size={[len, ht, T]} />
        ) : (
          <Block key={i} pos={[at, y, c]} size={[T, ht, len]} />
        )
      })}
    </>
  )
}
