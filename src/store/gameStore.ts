
import { create } from 'zustand'
import type { PanelContent } from '../data/types'

export type Phase = 'menu' | 'loading' | 'playing' | 'paused'
export type PauseView = 'main' | 'controls' | 'settings'

export interface TeleportDestination {
  id: string
  label: string
  position: { x: number; y: number; z: number }
}

interface GameState {
  phase: Phase
  worldReady: boolean
  pauseView: PauseView
  interactId: string | null
  interactLabel: string | null
  panel: PanelContent | null
  location: string
  mapOpen: boolean
  teleportRequest: TeleportDestination | null
  setLocation: (l: string) => void
  setMapOpen: (open: boolean) => void
  requestTeleport: (destination: TeleportDestination) => void
  clearTeleportRequest: () => void
  startLoading: () => void
  setWorldReady: () => void
  finishLoading: (locked: boolean) => void
  pause: () => void
  resume: () => void
  exitToMenu: () => void
  setPauseView: (v: PauseView) => void
  setInteract: (id: string | null, label: string | null) => void
  openPanel: (p: PanelContent) => void
  closePanel: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  worldReady: false,
  pauseView: 'main',
  interactId: null,
  interactLabel: null,
  panel: null,
  location: 'STARTING PLAZA',
  mapOpen: false,
  teleportRequest: null,

  setLocation: (location) => set({ location }),
  setMapOpen: (mapOpen) => set({ mapOpen }),
  requestTeleport: (teleportRequest) =>
    set({ teleportRequest, mapOpen: false }),
  clearTeleportRequest: () => set({ teleportRequest: null }),

  startLoading: () =>
    set({ phase: 'loading', worldReady: false, mapOpen: false, teleportRequest: null }),
  setWorldReady: () => set({ worldReady: true }),
  finishLoading: (locked) => set({ phase: locked ? 'playing' : 'paused' }),

  pause: () => {
    if (get().phase === 'playing') {
      set({
        phase: 'paused',
        pauseView: 'main',
        interactId: null,
        interactLabel: null,
        mapOpen: false,
      })
    }
  },

  resume: () => set({ phase: 'playing', pauseView: 'main' }),

  exitToMenu: () =>
    set({
      phase: 'menu',
      worldReady: false,
      pauseView: 'main',
      interactId: null,
      interactLabel: null,
      panel: null,
      location: 'STARTING PLAZA',
      mapOpen: false,
      teleportRequest: null,
    }),

  setPauseView: (pauseView) => set({ pauseView }),
  setInteract: (interactId, interactLabel) => set({ interactId, interactLabel }),
  openPanel: (panel) => set({ panel }),
  closePanel: () => set({ panel: null }),
}))
