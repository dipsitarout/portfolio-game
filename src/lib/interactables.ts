import type { Object3D } from 'three'

export interface InteractableEntry {
  id: string
  label: string
  object: Object3D
  onInteract: () => void
}

/** Objects the InteractionSystem can target. Plain data, read a few times per second. */
export const interactables = new Map<string, InteractableEntry>()
/** Solid scenery that blocks the interaction ray (so you can't use things through walls). */
export const occluders = new Set<Object3D>()
