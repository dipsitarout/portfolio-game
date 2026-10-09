import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CapsuleCollider, RigidBody, useRapier, type RapierRigidBody } from '@react-three/rapier'
import { MathUtils, type PerspectiveCamera } from 'three'
import { useGameStore } from '../store/gameStore'
import { useSettings } from '../store/settingsStore'
import { footstep, land } from '../lib/audio'

const SPAWN = { x: 0, y: 1.5, z: 26 }
const WALK = 4.5
const SPRINT = 8
const JUMP_VELOCITY = 7.5
const EYE_OFFSET = 0.7
const CAPSULE_HALF = 0.5
const CAPSULE_RADIUS = 0.4
const GROUND_RAY = CAPSULE_HALF + CAPSULE_RADIUS + 0.15
const BASE_SENS = 0.0022
const BASE_FOV = 75
const STRIDE = 2.2 // metres per footstep
const { damp, clamp } = MathUtils
const NO_KEYS = new Set<string>()

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const { world, rapier } = useRapier()
  const keys = useRef(new Set<string>())
  const target = useRef({ yaw: 0, pitch: 0 })
  const view = useRef({
    yaw: 0, pitch: -0.35, roll: 0,
    x: SPAWN.x, y: SPAWN.y + EYE_OFFSET, z: SPAWN.z,
    phase: 0, step: 0, amp: 0, dip: 0,
    coyote: 0, jumpBuf: 0, jumping: false, wasGrounded: true, lastVy: 0, intro: 1.6,
  })
  const ray = useMemo(() => new rapier.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }), [rapier])

  useEffect(() => {
    camera.rotation.order = 'YXZ'
    camera.fov = 100 // cinematic settle into BASE_FOV on spawn
    camera.updateProjectionMatrix()
    const k = keys.current
    const v = view.current
    const onMove = (e: MouseEvent) => {
      if (!document.pointerLockElement || useGameStore.getState().phase !== 'playing') return
      if (Math.abs(e.movementX) > 300 || Math.abs(e.movementY) > 300) return // pointer-lock spikes
      const s = BASE_SENS * useSettings.getState().sensitivity
      target.current.yaw -= e.movementX * s
      target.current.pitch = clamp(target.current.pitch - e.movementY * s, -1.5, 1.5)
    }
    const onDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Tab') e.preventDefault()
      if (e.code === 'Space' && !e.repeat) v.jumpBuf = 0.12
      k.add(e.code)
    }
    const onUp = (e: KeyboardEvent) => k.delete(e.code)
    const clear = () => k.clear()
    document.addEventListener('mousemove', onMove)
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    window.addEventListener('blur', clear)
    const unsub = useGameStore.subscribe((s) => {
      if (s.phase !== 'playing') k.clear()
    })
    return () => {
      document.removeEventListener('mousemove', onMove)
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('blur', clear)
      unsub()
    }
  }, [camera])

  useFrame((state, rawDt) => {
    const b = body.current
    if (!b) return
    const dt = Math.min(rawDt, 0.05)
    const v = view.current
    const store = useGameStore.getState()
const playing = store.phase === 'playing'
const t = b.translation()
const vel = b.linvel()

    const teleport = store.teleportRequest

    if (teleport) {
      b.setTranslation(
        {
          x: teleport.position.x,
          y: teleport.position.y,
          z: teleport.position.z,
        },
        true,
      )

      b.setLinvel({ x: 0, y: 0, z: 0 }, true)
      b.setAngvel({ x: 0, y: 0, z: 0 }, true)

      const v = view.current
      v.x = teleport.position.x
      v.y = teleport.position.y + EYE_OFFSET
      v.z = teleport.position.z
      v.phase = 0
      v.step = 0
      v.amp = 0
      v.dip = 0
      v.coyote = 0
      v.jumpBuf = 0
      v.jumping = false
      v.wasGrounded = true
      v.lastVy = 0

      useGameStore.getState().setLocation(teleport.label)
      useGameStore.getState().clearTeleportRequest()
      return
    }

    const k = store.panel ? NO_KEYS : keys.current // movement is frozen while a panel is open
    if (store.panel) v.jumpBuf = 0
    let targetFov = BASE_FOV

    if (playing) {
      v.intro = Math.max(0, v.intro - dt)
      // Ground detection: ray down from capsule centre
      ray.origin.x = t.x
      ray.origin.y = t.y
      ray.origin.z = t.z
      const grounded = world.castRay(ray, GROUND_RAY, true, undefined, undefined, undefined, b) !== null && vel.y <= 0.5

      if (grounded) {
        v.coyote = 0.1
        if (!v.wasGrounded && v.lastVy < -3.5) {
          v.dip = -Math.min(0.2, -v.lastVy * 0.016)
          if (v.lastVy < -5) land()
        }
        v.jumping = false
        v.lastVy = 0
      } else {
        v.coyote -= dt
        v.lastVy = vel.y
      }
      v.wasGrounded = grounded
      v.jumpBuf -= dt

      // Input -> wish direction
      const fw = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0)
      const st = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0)
      const sin = Math.sin(v.yaw)
      const cos = Math.cos(v.yaw)
      let wx = -sin * fw + cos * st
      let wz = -cos * fw - sin * st
      const len = Math.hypot(wx, wz)
      const moving = len > 0
      if (moving) {
        wx /= len
        wz /= len
      }
      const sprinting = moving && (k.has('ShiftLeft') || k.has('ShiftRight')) && fw > 0
      const speed = (sprinting ? SPRINT : WALK) * (fw < 0 ? 0.75 : 1)

      // Acceleration / deceleration (less air control)
      const rate = grounded ? (moving ? 12 : 9) : 2.5
      const vx = damp(vel.x, wx * speed, rate, dt)
      const vz = damp(vel.z, wz * speed, rate, dt)

      // Jump: buffer + coyote time + variable height
      let vy = vel.y
      if (v.jumpBuf > 0 && v.coyote > 0) {
        vy = JUMP_VELOCITY
        v.jumpBuf = 0
        v.coyote = 0
        v.jumping = true
      }
      if (v.jumping && !k.has('Space') && vy > 2.5) {
        vy *= 0.55
        v.jumping = false
      }
      b.setLinvel({ x: vx, y: vy, z: vz }, true)

      // Bob / footsteps
      const hSpeed = Math.hypot(vx, vz)
      const walking = grounded && hSpeed > 0.8
      v.amp = damp(v.amp, walking ? Math.min(hSpeed / WALK, 1.6) : 0, 8, dt)
      if (walking) {
        v.phase += hSpeed * dt * (Math.PI / STRIDE)
        const step = Math.floor(v.phase / Math.PI)
        if (step !== v.step) {
          v.step = step
          footstep(sprinting)
        }
      }
      const bobY = ((1 - Math.cos(v.phase * 2)) / 2 - 0.5) * 0.06 * v.amp
      const bobX = Math.cos(v.phase) * 0.03 * v.amp
      const breathe = Math.sin(state.clock.elapsedTime * 1.4) * 0.004 * (1 - Math.min(v.amp, 1))
      v.dip = damp(v.dip, 0, 9, dt)

      // Strafe tilt + walk sway
      const strafe = vx * cos - vz * sin
      v.roll = damp(v.roll, -strafe * 0.004 + Math.cos(v.phase) * 0.006 * v.amp, 8, dt)

      if (sprinting) targetFov = BASE_FOV + 9
      if (store.panel) targetFov = BASE_FOV - 13 // zoom toward terminal UI
      const fovRate = v.intro > 0 ? 2.5 : 6
      const fov = damp(camera.fov, targetFov, fovRate, dt)
      if (Math.abs(fov - camera.fov) > 0.01) {
        camera.fov = fov
        camera.updateProjectionMatrix()
      }

      v.x = damp(v.x, t.x + cos * bobX, 40, dt)
      v.y = damp(v.y, t.y + EYE_OFFSET + bobY + breathe + v.dip, 40, dt)
      v.z = damp(v.z, t.z - sin * bobX, 40, dt)
    }

    // Smooth look (slow easing during the intro settle)
    const lookRate = v.intro > 0 ? 2.4 : 28
    v.yaw = damp(v.yaw, target.current.yaw, playing ? lookRate : 28, dt)
    v.pitch = damp(v.pitch, target.current.pitch, playing ? lookRate : 28, dt)
    camera.rotation.set(v.pitch, v.yaw, v.roll)
    camera.position.set(v.x, v.y, v.z)

    if (t.y < -20) {
      b.setTranslation(SPAWN, true)
      b.setLinvel({ x: 0, y: 0, z: 0 }, true)
    }
  })

  return (
    <RigidBody
      ref={body}
      position={[SPAWN.x, SPAWN.y, SPAWN.z]}
      colliders={false}
      enabledRotations={[false, false, false]}
      gravityScale={2.2}
      canSleep={false}
      ccd
    >
      <CapsuleCollider args={[CAPSULE_HALF, CAPSULE_RADIUS]} friction={0} restitution={0} />
    </RigidBody>
  )
}
