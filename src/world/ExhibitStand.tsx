import type { ReactNode } from 'react'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { Interactable } from '../components/Interactable'
import type { V3 } from './primitives'

interface Props {
  id: string
  label: string
  pos: V3
  color: string
  onInteract: () => void
  height?: number
  radius?: number
  hover?: number
  children: ReactNode
}

/**
 * Solid pedestal with a floating hologram above it. The whole thing glows when targeted.
 * Uses unshared materials on purpose (Interactable edits emissive intensity).
 */
export function ExhibitStand({ id, label, pos, color, onInteract, height = 0.9, radius = 0.6, hover = 0.9, children }: Props) {
  return (
    <Interactable id={id} label={label} position={pos} onInteract={onInteract}>
      <RigidBody type="fixed" colliders={false} friction={0}>
        <CylinderCollider args={[height / 2, radius]} position={[0, height / 2, 0]} friction={0} />
        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[radius, radius * 1.12, height, 20]} />
          <meshStandardMaterial color="#17233f" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, height + 0.02, 0]}>
          <cylinderGeometry args={[radius * 0.92, radius * 0.92, 0.05, 20]} />
          <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      </RigidBody>
      <group position={[0, height + hover, 0]}>{children}</group>
      {/* generous invisible hit target so the crosshair doesn't need pixel precision */}
      <mesh position={[0, height + hover, 0]} visible={false}>
        <sphereGeometry args={[0.9, 8, 6]} />
        <meshBasicMaterial />
      </mesh>
    </Interactable>
  )
}
