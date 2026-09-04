import '@/lib/three-console'
import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { AdditiveBlending, CatmullRomCurve3, Color, Vector3 } from 'three'
import type { Group, Mesh, PointLight, Points as ThreePoints } from 'three'
import type { ScrollState } from '@/hooks/useScrollProgress'
import { useQualityTier } from '@/hooks/useQualityTier'
import type { QualityTier } from '@/hooks/useQualityTier'

const TRAVEL_DISTANCE = 70
const START_Z = 6
const CORE_Z = START_Z - TRAVEL_DISTANCE - 12

/** Colors the scene drifts through as you scroll  echoes the palette used in Hero/Services/About. */
const PALETTE = ['#a06bff', '#4fe3d0', '#ff5fb0', '#ffb454', '#c9a9ff']

function paletteColorAt(t: number) {
  const scaled = Math.min(0.999, Math.max(0, t)) * (PALETTE.length - 1)
  const i = Math.floor(scaled)
  const f = scaled - i
  return new Color(PALETTE[i]).lerp(new Color(PALETTE[i + 1] ?? PALETTE[i]), f)
}

function StarLayer({
  count,
  spread,
  size,
  color,
  opacity,
  parallax,
  scrollRef,
}: {
  count: number
  spread: number
  size: number
  color: string
  opacity: number
  parallax: number
  scrollRef: React.RefObject<ScrollState>
}) {
  const ref = useRef<ThreePoints>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread
      arr[i * 3 + 2] = Math.random() * (TRAVEL_DISTANCE + 20) - TRAVEL_DISTANCE - 10
    }
    return arr
  }, [count, spread])

  useFrame((_, delta) => {
    const points = ref.current
    if (!points) return
    points.rotation.y += delta * 0.01
    points.position.z = scrollRef.current.progress * TRAVEL_DISTANCE * parallax
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

/** Builds a sparse graph: each node links to its 1-2 nearest neighbors within range. */
function buildConnections(positions: Float32Array, count: number, maxDist: number, maxPerNode: number) {
  const lines: number[] = []
  const drawn = new Set<string>()
  const maxDistSq = maxDist * maxDist

  for (let i = 0; i < count; i++) {
    const ix = positions[i * 3]
    const iy = positions[i * 3 + 1]
    const iz = positions[i * 3 + 2]
    const candidates: { j: number; d: number }[] = []

    for (let j = 0; j < count; j++) {
      if (j === i) continue
      const dx = ix - positions[j * 3]
      const dy = iy - positions[j * 3 + 1]
      const dz = iz - positions[j * 3 + 2]
      const d = dx * dx + dy * dy + dz * dz
      if (d < maxDistSq) candidates.push({ j, d })
    }

    candidates.sort((a, b) => a.d - b.d)
    for (const { j } of candidates.slice(0, maxPerNode)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (drawn.has(key)) continue
      drawn.add(key)
      lines.push(ix, iy, iz, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
    }
  }

  return new Float32Array(lines)
}

/** A sparse constellation of connected nodes drifting through the tunnel  the "data network" motif. */
function ConstellationNetwork({
  scrollRef,
  count,
  dim,
}: {
  scrollRef: React.RefObject<ScrollState>
  count: number
  dim: boolean
}) {
  const groupRef = useRef<Group>(null)

  const nodePositions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14
      arr[i * 3 + 2] = Math.random() * (TRAVEL_DISTANCE + 20) - TRAVEL_DISTANCE - 14
    }
    return arr
  }, [count])

  const linePositions = useMemo(
    () => buildConnections(nodePositions, count, 6.5, 2),
    [nodePositions, count],
  )

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return
    group.rotation.y += delta * 0.006
    group.position.z = scrollRef.current.progress * TRAVEL_DISTANCE * 0.25
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#c9a9ff"
          transparent
          opacity={dim ? 0.4 : 0.75}
          blending={AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#7d78c9"
          transparent
          opacity={dim ? 0.12 : 0.22}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}

interface WaypointDef {
  z: number
  x: number
  y: number
  color: string
  scale: number
  variant: 'distort' | 'wire-oct' | 'wire-torus'
}

const WAYPOINTS: WaypointDef[] = [
  { z: -8, x: -3.2, y: 1.2, color: '#a06bff', scale: 0.5, variant: 'distort' },
  { z: -18, x: 3, y: -1.6, color: '#4fe3d0', scale: 0.32, variant: 'wire-oct' },
  { z: -30, x: -2.6, y: -1, color: '#ff5fb0', scale: 0.42, variant: 'wire-torus' },
  { z: -42, x: 3.4, y: 1.4, color: '#ffb454', scale: 0.34, variant: 'wire-oct' },
  { z: -54, x: -3, y: 0.6, color: '#c9a9ff', scale: 0.46, variant: 'distort' },
  { z: -66, x: 2.6, y: -0.8, color: '#4fe3d0', scale: 0.36, variant: 'wire-torus' },
]

function Waypoint({ def, tier }: { def: WaypointDef; tier: QualityTier }) {
  const ref = useRef<Mesh>(null)
  // Mobile has no text-free "safe zone" beside the copy (single column, full width),
  // so waypoints there render as dim wireframes instead of solid glowing blobs to
  // keep body text legible wherever they happen to drift behind it.
  const subdued = tier === 'low'

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.elapsedTime
    mesh.rotation.x = t * 0.15
    mesh.rotation.y = t * 0.2
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.4}>
      <mesh ref={ref} position={[def.x, def.y, def.z]} scale={subdued ? def.scale * 0.5 : def.scale}>
        {def.variant === 'wire-torus' ? (
          <torusGeometry args={[1, 0.35, 12, 32]} />
        ) : def.variant === 'wire-oct' ? (
          <octahedronGeometry args={[1, 0]} />
        ) : (
          <icosahedronGeometry args={[1, 8]} />
        )}
        {subdued ? (
          // A wireframe's overlapping edges compound their opacity visually
          // (each line draws over the last), so it never actually reads as
          // faint  a plain low-opacity solid fill gives predictable,
          // uniform transparency instead, keeping body text legible wherever
          // this drifts behind it.
          <meshBasicMaterial color={def.color} transparent opacity={0.14} depthWrite={false} />
        ) : def.variant === 'distort' ? (
          <MeshDistortMaterial color={def.color} distort={0.4} speed={1.5} roughness={0.3} metalness={0.3} />
        ) : (
          <meshStandardMaterial color={def.color} roughness={0.4} metalness={0.2} wireframe />
        )}
      </mesh>
    </Float>
  )
}

/** A faint thread linking the waypoints in sequence  the "flight path" through the journey. */
function TrajectoryLine() {
  const geometry = useMemo(() => {
    const points = [
      new Vector3(0, 0, START_Z + 4),
      ...WAYPOINTS.map((wp) => new Vector3(wp.x * 0.6, wp.y * 0.6, wp.z)),
      new Vector3(0, 0, CORE_Z + 8),
    ]
    const curve = new CatmullRomCurve3(points)
    return curve.getPoints(150)
  }, [])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(geometry.flatMap((p) => [p.x, p.y, p.z])), 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#8f8fd9" transparent opacity={0.14} blending={AdditiveBlending} depthWrite={false} />
    </line>
  )
}

/** The glowing hub waiting at the end of the journey  grows more prominent as you approach the footer. */
function DestinationCore({ tier }: { tier: QualityTier }) {
  const outerRef = useRef<Mesh>(null)
  const innerRef = useRef<Mesh>(null)
  // Even parked at the far end of the tunnel, this object is large enough to
  // stay faintly visible for most of the scroll including right at the top
  // of the page, where mobile's single-column text has no safe zone to avoid
  // it. Dim it and drop the emissive glow on the low tier so it stays a
  // background presence instead of a legibility problem.
  const subdued = tier === 'low'

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (outerRef.current) {
      outerRef.current.rotation.y = t * 0.08
      outerRef.current.rotation.x = t * 0.05
    }
    if (innerRef.current) {
      innerRef.current.rotation.y = -t * 0.12
    }
  })

  return (
    <group position={[4.5, 1.5, CORE_Z]}>
      <mesh ref={outerRef} scale={4.2}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#4fe3d0" wireframe transparent opacity={subdued ? 0.18 : 0.5} />
      </mesh>
      <mesh ref={innerRef} scale={2.1}>
        <icosahedronGeometry args={[1, 2]} />
        {subdued ? (
          <meshBasicMaterial color="#c9a9ff" transparent opacity={0.16} depthWrite={false} />
        ) : (
          <MeshDistortMaterial
            color="#c9a9ff"
            emissive="#a06bff"
            emissiveIntensity={0.6}
            distort={0.25}
            speed={1}
            roughness={0.2}
            metalness={0.4}
          />
        )}
      </mesh>
      <pointLight color="#c9a9ff" intensity={subdued ? 1.2 : 4} distance={30} />
    </group>
  )
}

/** Flies the camera through the scene as the page scrolls, with mouse parallax and a subtle bank into fast scrolls. */
function Rig({ scrollRef }: { scrollRef: React.RefObject<ScrollState> }) {
  const { camera, pointer } = useThree()
  const rollRef = useRef(0)

  useFrame((_, delta) => {
    const { progress, velocity } = scrollRef.current
    const targetZ = START_Z - progress * TRAVEL_DISTANCE
    const damp = Math.min(1, delta * 3)

    camera.position.z += (targetZ - camera.position.z) * damp
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * Math.min(1, delta * 2)
    camera.position.y += (pointer.y * 0.35 - camera.position.y) * Math.min(1, delta * 2)

    const targetRoll = Math.max(-0.25, Math.min(0.25, -velocity * 0.6))
    rollRef.current += (targetRoll - rollRef.current) * Math.min(1, delta * 4)

    camera.lookAt(0, 0, camera.position.z - 10)
    camera.rotateZ(rollRef.current)
  })

  return null
}

/** Point lights that travel with the camera and shift hue across the site's palette as you scroll. */
function TravelingLights({ scrollRef }: { scrollRef: React.RefObject<ScrollState> }) {
  const groupRef = useRef<Group>(null)
  const light1Ref = useRef<PointLight>(null)
  const light2Ref = useRef<PointLight>(null)

  useFrame(() => {
    const progress = scrollRef.current.progress
    if (groupRef.current) {
      groupRef.current.position.z = START_Z - progress * TRAVEL_DISTANCE - 4
    }
    light1Ref.current?.color.copy(paletteColorAt(progress))
    light2Ref.current?.color.copy(paletteColorAt(progress + 0.35))
  })

  return (
    <group ref={groupRef}>
      <pointLight ref={light1Ref} intensity={2.2} distance={20} color="#a06bff" position={[2, 1, 0]} />
      <pointLight ref={light2Ref} intensity={1.8} distance={22} color="#4fe3d0" position={[-2, -1, -4]} />
    </group>
  )
}

function Scene({ scrollRef, tier }: { scrollRef: React.RefObject<ScrollState>; tier: QualityTier }) {
  const scale = tier === 'high' ? 1 : 0.55

  return (
    <>
      <ambientLight intensity={0.3} />
      <TravelingLights scrollRef={scrollRef} />
      <Rig scrollRef={scrollRef} />

      <StarLayer count={Math.round(550 * scale)} spread={26} size={0.03} color="#c9a9ff" opacity={0.6} parallax={0.4} scrollRef={scrollRef} />
      <StarLayer count={Math.round(400 * scale)} spread={40} size={0.02} color="#4fe3d0" opacity={0.35} parallax={0.15} scrollRef={scrollRef} />
      <StarLayer count={Math.round(280 * scale)} spread={16} size={0.045} color="#ff5fb0" opacity={0.45} parallax={0.7} scrollRef={scrollRef} />

      <ConstellationNetwork scrollRef={scrollRef} count={tier === 'high' ? 85 : 40} dim={tier === 'low'} />
      <TrajectoryLine />
      <DestinationCore tier={tier} />

      {WAYPOINTS.map((wp, i) => (
        <Waypoint key={i} def={wp} tier={tier} />
      ))}
    </>
  )
}

export default function ScrollUniverse({ scrollRef }: { scrollRef: React.RefObject<ScrollState> }) {
  const tier = useQualityTier()

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={tier === 'high' ? [1, 1.5] : 1}
        camera={{ position: [0, 0, START_Z], fov: 58 }}
        gl={{ antialias: false, alpha: true }}
      >
        <Scene scrollRef={scrollRef} tier={tier} />
        {tier === 'high' && (
          <EffectComposer>
            <Bloom intensity={0.55} luminanceThreshold={0.18} luminanceSmoothing={0.85} mipmapBlur radius={0.6} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
