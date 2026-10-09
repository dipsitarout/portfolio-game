import { CanvasTexture, LinearFilter, RepeatWrapping, SRGBColorSpace } from 'three'

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return { c, g: c.getContext('2d')! }
}

function finish(c: HTMLCanvasElement, repeat = true) {
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 8
  if (repeat) t.wrapS = t.wrapT = RepeatWrapping
  return t
}

/** Procedural floor tile + matching seams-only glow map. One tile = one 4 m panel. */
export function makeFloorTextures(color: string) {
  const s = 512
  const a = canvas(s, s)
  a.g.fillStyle = '#0b1325'
  a.g.fillRect(0, 0, s, s)
  for (let i = 0; i < 2600; i++) {
    const v = Math.random() * 20
    a.g.fillStyle = `rgba(${50 + v},${80 + v},${120 + v},0.05)`
    a.g.fillRect(Math.random() * s, Math.random() * s, 2, 2)
  }
  const b = canvas(s, s)
  b.g.fillStyle = '#000'
  b.g.fillRect(0, 0, s, s)
  for (const g of [a.g, b.g]) {
    g.strokeStyle = color
    g.lineWidth = 4
    g.strokeRect(2, 2, s - 4, s - 4)
    g.globalAlpha = 0.35
    g.lineWidth = 1.5
    g.beginPath()
    g.moveTo(s / 2, 24)
    g.lineTo(s / 2, s - 24)
    g.moveTo(24, s / 2)
    g.lineTo(s - 24, s / 2)
    g.stroke()
    g.globalAlpha = 1
    g.fillStyle = color
    for (const [x, y] of [[14, 14], [s - 26, 14], [14, s - 26], [s - 26, s - 26]]) g.fillRect(x, y, 12, 12)
  }
  return { map: finish(a.c), glow: finish(b.c) }
}

export interface HoloOpts {
  w?: number
  titleScale?: number
  lineScale?: number
  center?: boolean
}

export function wrapText(text: string, max: number): string[] {
  const out: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > max) {
      out.push(line)
      line = word
    } else line = (line + ' ' + word).trim()
  }
  if (line) out.push(line)
  return out
}

/** Holographic panel texture (transparent background). */
export function makeHoloTexture(title: string, lines: string[], color: string, aspect: number, opts: HoloOpts = {}) {
  const w = opts.w ?? 768
  const h = Math.round(w / aspect)
  const { c, g } = canvas(w, h)
  const ts = opts.titleScale ?? 1
  const ls = opts.lineScale ?? 1
  const center = !!opts.center
  g.fillStyle = 'rgba(4,28,42,0.6)'
  g.fillRect(0, 0, w, h)
  g.strokeStyle = color
  g.globalAlpha = 0.5
  g.lineWidth = 3
  g.strokeRect(8, 8, w - 16, h - 16)
  g.globalAlpha = 1
  g.lineWidth = Math.max(6, w / 100)
  const L = w * 0.07
  for (const [x, y, dx, dy] of [[8, 8, 1, 1], [w - 8, 8, -1, 1], [8, h - 8, 1, -1], [w - 8, h - 8, -1, -1]]) {
    g.beginPath()
    g.moveTo(x + dx * L, y)
    g.lineTo(x, y)
    g.lineTo(x, y + dy * L)
    g.stroke()
  }
  g.textBaseline = 'alphabetic'
  g.textAlign = center ? 'center' : 'left'
  const x = center ? w / 2 : w * 0.06
  g.fillStyle = '#fff'
  g.shadowColor = color
  g.shadowBlur = 20
  g.font = `700 ${Math.round(h * 0.17 * ts)}px Orbitron, 'Segoe UI', sans-serif`
  g.fillText(title, x, center ? h * (lines.length ? 0.4 : 0.6) : h * 0.27, w * 0.88)
  g.shadowBlur = 0
  g.fillStyle = '#c4ecf7'
  g.font = `600 ${Math.round(h * 0.085 * ls)}px Rajdhani, 'Segoe UI', sans-serif`
  lines.forEach((t, i) => g.fillText(t, x, (center ? h * 0.6 : h * 0.45) + i * h * 0.115 * ls, w * 0.88))
  if (!center) {
    g.fillStyle = color
    g.globalAlpha = 0.5
    for (let i = 0; i < 26; i++) {
      const bh = (0.25 + 0.75 * Math.abs(Math.sin(i * 1.7))) * h * 0.07
      g.fillRect(w * 0.06 + i * (w / 40), h * 0.93 - bh, w / 64, bh)
    }
    g.globalAlpha = 1
  }
  g.fillStyle = 'rgba(255,255,255,0.035)'
  for (let y = 0; y < h; y += 5) g.fillRect(0, y, w, 1)
  const t = finish(c, false)
  t.generateMipmaps = false // saves memory; panels are viewed fairly close
  t.minFilter = LinearFilter
  return t
}
