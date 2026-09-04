import '@/lib/three-console'
import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import type { Mesh } from 'three'
import { useQualityTier } from '@/hooks/useQualityTier'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const RIG_OFFSET: [number, number, number] = [4.6, -0.8, -6.5]

function CoreBlob() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    const mesh = meshRef.current
    if (!mesh) return
    const t = state.clock.getElapsedTime()
    mesh.rotation.x = t * 0.08
    mesh.rotation.y = t * 0.12
    const pointer = state.pointer
    mesh.position.x = pointer.x * 0.25
    mesh.position.y = pointer.y * 0.18
  })

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.4}>
        <icosahedronGeometry args={[1, 12]} />
        <MeshDistortMaterial
          color="#a06bff"
          attach="material"
          distort={0.45}
          speed={1.8}
          roughness={0.25}
          metalness={0.3}
          emissive="#4b1f8f"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  )
}

function OrbitRing() {
  const ref = useRef<Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.08
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.6, 0, 0]}>
      <torusGeometry args={[1.8, 0.005, 16, 200]} />
      <meshBasicMaterial color="#4fe3d0" transparent opacity={0.5} />
    </mesh>
  )
}

function SecondaryShard() {
  const ref = useRef<Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = t * 0.3
    ref.current.rotation.y = t * 0.2
  })
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.6}>
      <mesh ref={ref} position={[1.1, -1.1, -0.8]} scale={0.32}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#ff5fb0" roughness={0.4} metalness={0.2} wireframe />
      </mesh>
    </Float>
  )
}

export default function HeroCanvas() {
  const tier = useQualityTier()
  // The blob/ring/shard accent is positioned to sit beside the portrait in
  // Hero's two-column layout (which only kicks in at `lg`). Below that, the
  // hero stacks into a single column with no side "safe zone" for it, so it
  // would otherwise land behind body copy and hurt legibility.
  const isTwoColumnLayout = useMediaQuery('(min-width: 1024px)')

  return (
    <Canvas
      dpr={tier === 'high' ? [1, 1.8] : 1}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: tier === 'high', alpha: true }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.9} />
        <pointLight position={[4, 4, 4]} intensity={2.2} color="#a06bff" />
        <pointLight position={[-4, -2, 2]} intensity={2.4} color="#4fe3d0" />
        <pointLight position={[0, 3, -3]} intensity={1.6} color="#ff5fb0" />
        <directionalLight position={[2, 2, 5]} intensity={0.8} />
        {isTwoColumnLayout && (
          <group position={RIG_OFFSET}>
            <CoreBlob />
            <OrbitRing />
            <SecondaryShard />
          </group>
        )}
        <Sparkles count={tier === 'high' ? 80 : 40} scale={[8, 5, 4]} size={2} speed={0.3} color="#c9a9ff" opacity={0.6} />
      </Suspense>
    </Canvas>
  )
}
