export interface PanelLink {
  label: string
  url?: string
}
export interface PanelSection {
  heading: string
  items: string[]
}
/** Everything the holographic panel UI can render. */
export interface PanelContent {
  eyebrow?: string
  category?: string
  title: string
  subtitle?: string
  body?: string
  tagsHeading?: string
  tags?: string[]
  sections?: PanelSection[]
  note?: string
  links?: PanelLink[]
}
export type HoloShape = 'icosahedron' | 'octahedron' | 'torusKnot' | 'dodecahedron' | 'box' | 'cone' | 'torus'
