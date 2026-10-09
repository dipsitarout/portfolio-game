import { useRef, type ReactElement } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import type { Project } from '../../data/projects'
import type { HoloShape } from '../../data/types'
import { projectPanel, showPanel } from '../../lib/panels'
import { ExhibitStand } from '../ExhibitStand'
import { HoloPanel, type V3 } from '../primitives'

const GEOMETRY: Record<HoloShape, ReactElement> = {
  icosahedron: <icosahedronGeometry args={[0.45, 1]} />,
  octahedron: <octahedronGeometry args={[0.5]} />,
  torusKnot: <torusKnotGeometry args={[0.3, 0.1, 64, 8]} />,
  dodecahedron: <dodecahedronGeometry args={[0.46]} />,
  box: <boxGeometry args={[0.6, 0.6, 0.6]} />,
  cone: <coneGeometry args={[0.4, 0.8, 6]} />,
  torus: <torusGeometry args={[0.38, 0.12, 8, 24]} />,
}

function HoloShapeMesh({ shape, color }: { shape: HoloShape; color: string }) {
  const ref = useRef<Mesh>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.6
    ref.current.rotation.x += dt * 0.2
  })
  return (
    <mesh ref={ref}>
      {GEOMETRY[shape]}
      <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={2.2} wireframe toneMapped={false} />
    </mesh>
  )
}

/** One physical, interactive project exhibit. Data comes from src/data/projects.ts. */
export function ProjectStation({ project, pos, rotY }: { project: Project; pos: V3; rotY: number }) {
  const sub = project.category
  return (
    <ExhibitStand
      id={`project-${project.id}`}
      label={project.name.toUpperCase()}
      pos={pos}
      color={project.color}
      onInteract={() => showPanel(projectPanel(project))}
    >
      <HoloShapeMesh shape={project.shape} color={project.color} />
      <HoloPanel pos={[0, 1.15, 0]} size={[3.4, 1.2]} rotY={rotY} title={project.name.toUpperCase()} lines={[sub.length > 34 ? sub.slice(0, 33) + '…' : sub]} color={project.color} center titleScale={0.75} />
    </ExhibitStand>
  )
}
