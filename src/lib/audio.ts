import { useSettings } from '../store/settingsStore'

/** Fully procedural WebAudio: no asset files. Must be initialised from a user gesture. */
let ctx: AudioContext | null = null
let master: GainNode
let noise: AudioBuffer
let paused = false
let unsub: (() => void) | null = null
const timers: number[] = []

const chain = (...n: AudioNode[]) => {
  for (let i = 0; i < n.length - 1; i++) n[i].connect(n[i + 1])
}

function applyVolume(v: number) {
  if (ctx) master.gain.setTargetAtTime(v * (paused ? 0.35 : 1), ctx.currentTime, 0.12)
}

export function initAudio() {
  if (ctx && ctx.state !== 'closed') {
    void ctx.resume()
    return
  }
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = useSettings.getState().volume
  master.connect(ctx.destination)
  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  startAmbient(ctx)
  unsub = useSettings.subscribe((s) => applyVolume(s.volume))
  void ctx.resume()
}

export function setAudioPaused(p: boolean) {
  paused = p
  applyVolume(useSettings.getState().volume)
}

export function stopAudio() {
  timers.splice(0).forEach((t) => window.clearTimeout(t))
  unsub?.()
  unsub = null
  void ctx?.close()
  ctx = null
}

function startAmbient(c: AudioContext) {
  const out = c.createGain()
  out.gain.value = 0.55
  out.connect(master)

  // Low reactor-style drone
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 260
  lp.connect(out)
  const voices: [number, OscillatorType, number][] = [
    [55, 'sine', 0.5],
    [55.35, 'triangle', 0.22],
    [110.2, 'sine', 0.14],
    [82.4, 'sine', 0.1],
  ]
  for (const [f, t, g] of voices) {
    const o = c.createOscillator()
    o.type = t
    o.frequency.value = f
    const gn = c.createGain()
    gn.gain.value = g
    chain(o, gn, lp)
    o.start()
  }
  const lfo = c.createOscillator()
  lfo.frequency.value = 0.07
  const lg = c.createGain()
  lg.gain.value = 90
  lfo.connect(lg)
  lg.connect(lp.frequency)
  lfo.start()

  // Ventilation air
  const air = c.createBufferSource()
  air.buffer = noise
  air.loop = true
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1700
  bp.Q.value = 0.6
  const ag = c.createGain()
  ag.gain.value = 0.012
  chain(air, bp, ag, out)
  air.start()

  // Echoing data blips
  const delay = c.createDelay(1)
  delay.delayTime.value = 0.37
  const fb = c.createGain()
  fb.gain.value = 0.42
  delay.connect(fb)
  fb.connect(delay)
  const wet = c.createGain()
  wet.gain.value = 0.5
  chain(delay, wet, out)
  const blip = () => {
    if (!ctx) return
    const t = c.currentTime
    const o = c.createOscillator()
    o.type = 'sine'
    o.frequency.value = 1200 + Math.floor(Math.random() * 6) * 220
    const g = c.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.025, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0005, t + 0.35)
    chain(o, g, delay)
    o.start(t)
    o.stop(t + 0.4)
    timers.push(window.setTimeout(blip, 4000 + Math.random() * 6000))
  }
  timers.push(window.setTimeout(blip, 2500))
}

function thump(freq: number, gain: number, len: number) {
  if (!ctx) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  o.frequency.setValueAtTime(freq, t)
  o.frequency.exponentialRampToValueAtTime(freq * 0.5, t + len)
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0005, t + len)
  chain(o, g, master)
  o.start(t)
  o.stop(t + len + 0.02)
}

function burst(freq: number, q: number, gain: number, len: number) {
  if (!ctx) return
  const t = ctx.currentTime
  const s = ctx.createBufferSource()
  s.buffer = noise
  s.playbackRate.value = 0.8 + Math.random() * 0.4
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = freq + Math.random() * 90
  f.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0008, t + len)
  chain(s, f, g, master)
  s.start(t, Math.random() * 1.5, len + 0.05)
}

export function footstep(sprint: boolean) {
  burst(sprint ? 430 : 330, 0.9, sprint ? 0.5 : 0.32, sprint ? 0.11 : 0.14)
  thump(sprint ? 120 : 100, sprint ? 0.22 : 0.15, 0.09)
}
export function land() {
  burst(260, 0.7, 0.6, 0.2)
  thump(90, 0.4, 0.18)
}
export function playDoor() {
  if (!ctx) return
  const t = ctx.currentTime
  const s = ctx.createBufferSource()
  s.buffer = noise
  const f = ctx.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = 2
  f.frequency.setValueAtTime(300, t)
  f.frequency.exponentialRampToValueAtTime(1400, t + 1)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(0.12, t + 0.15)
  g.gain.linearRampToValueAtTime(0, t + 1.1)
  chain(s, f, g, master)
  s.start(t, 0, 1.2)
  thump(70, 0.25, 0.3)
}
export function playUi() {
  if (!ctx) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  o.type = 'sine'
  o.frequency.setValueAtTime(760, t)
  o.frequency.exponentialRampToValueAtTime(1500, t + 0.12)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(0.14, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0005, t + 0.2)
  chain(o, g, master)
  o.start(t)
  o.stop(t + 0.25)
}

export function playHover() {
  if (!ctx) return
  const t = ctx.currentTime
  const o = ctx.createOscillator()
  o.type = 'sine'
  o.frequency.value = 1900
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.linearRampToValueAtTime(0.04, t + 0.004)
  g.gain.exponentialRampToValueAtTime(0.0005, t + 0.06)
  chain(o, g, master)
  o.start(t)
  o.stop(t + 0.08)
}
