import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import type { Material, Mesh } from 'three'
import { useGameStore } from '../store/gameStore'
import { useSettings } from '../store/settingsStore'
import { setAudioPaused } from '../lib/audio'
import { World } from './World'
import { Player } from './Player'
import { InteractionSystem } from './InteractionSystem'
import { ZoneLights } from '../world/ZoneLights'

function ReadySignal() {
  useEffect(() => {
    useGameStore.getState().setWorldReady()
  }, [])
  return null
}

/** Applies graphics setting changes that three.js needs to be told about (shadow toggle). */
function QualityManager() {
  const quality = useSettings((s) => s.quality)
  const { gl, scene } = useThree()
  useEffect(() => {
    gl.shadowMap.enabled = quality !== 'low'
    scene.traverse((o) => {
      const m = (o as Mesh).material as Material | Material[] | undefined
      if (m) (Array.isArray(m) ? m : [m]).forEach((x) => (x.needsUpdate = true))
    })
  }, [quality, gl, scene])
  return null
}

function useGameLifecycle() {
  useEffect(() => {
    // Pointer lock lost (ESC) or refused -> pause.
    const onLost = () => {
  const state = useGameStore.getState()

  if (
    !document.pointerLockElement &&
    !state.panel &&
    !state.mapOpen
  ) {
    state.pause()
  }
}
    const onError = () => {
      if (!useGameStore.getState().panel) useGameStore.getState().pause()
    }
    document.addEventListener('pointerlockchange', onLost)
    document.addEventListener('pointerlockerror', onError)
    // Duck audio while paused.
    const unsub = useGameStore.subscribe((s, p) => {
      if (s.phase !== p.phase) setAudioPaused(s.phase === 'paused')
    })
    return () => {
      document.removeEventListener('pointerlockchange', onLost)
      document.removeEventListener('pointerlockerror', onError)
      unsub()
    }
  }, [])
}

export function Game() {
  const paused = useGameStore((s) => s.phase !== 'playing')
  const quality = useSettings((s) => s.quality)
  useGameLifecycle()
  return (
    <Canvas
      shadows
      dpr={quality === 'low' ? 1 : quality === 'medium' ? [1, 1.25] : [1, 2]}
      camera={{ fov: 75, near: 0.1, far: 700, position: [0, 2.2, 26] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <QualityManager />
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]} paused={paused}>
          <World />
          <Player />
          <ZoneLights />
          <InteractionSystem />
          <ReadySignal />
        </Physics>
      </Suspense>
      {quality === 'high' && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.95} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      )}
    </Canvas>
  )
}
