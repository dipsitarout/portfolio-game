import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Quality = 'low' | 'medium' | 'high'

interface SettingsState {
  sensitivity: number // multiplier, 1 = default
  volume: number // 0..1
  quality: Quality
  set: (p: Partial<Pick<SettingsState, 'sensitivity' | 'volume' | 'quality'>>) => void
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      sensitivity: 1,
      volume: 0.7,
      quality: 'medium',
      set: (p) => set(p),
    }),
    { name: 'dr-settings', partialize: (s) => ({ sensitivity: s.sensitivity, volume: s.volume, quality: s.quality }) },
  ),
)
