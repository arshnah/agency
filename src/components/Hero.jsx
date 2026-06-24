import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, Center, Float, Environment, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Helvetiker bold from drei CDN
const FONT = 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/helvetiker_bold.typeface.json'

function Line({ text, y, color, metal = true, delay = 0 }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = Math.sin(t * 0.35 + delay) * 0.08
    ref.current.position.y = y + Math.sin(t * 0.7 + delay) * 0.06
  })
  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.25}>
      <Center ref={ref} position={[0, y, 0]}>
        <Text3D
          font={FONT}
          size={1}
          height={0.28}
          curveSegments={8}
          bevelEnabled
          bevelThickness={0.035}
          bevelSize={0.022}
          bevelSegments={4}
        >
          {text}
          {metal ? (
            <meshStandardMaterial
              color={color}
              metalness={1}
              roughness={0.22}
              envMapIntensity={2.2}
            />
          ) : (
            <MeshTransmissionMaterial
              color={color}
              thickness={0.5}
              roughness={0.1}
              transmission={1}
              ior={1.4}
              chromaticAberration={0.04}
              backside
            />
          )}
        </Text3D>
      </Center>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 10]} intensity={1.3} color="#D0FFE8" />
      <directionalLight position={[-8, 3, 6]} intensity={1.0} color="#00E08A" />
      <directionalLight position={[8, -3, 6]} intensity={0.5} color="#00FF90" />
      <pointLight position={[0, 0, 6]} intensity={3} color="#00E08A" distance={20} />

      <group scale={[1, 1, 1]}>
        <Line text="NOT" y={2.4} color="#EAF5EE" delay={0} />
        <Line text="AD SLOP." y={0} color="#00E08A" delay={1.2} />
        <Line text="NEVER." y={-2.4} color="#EAF5EE" delay={2.4} />
      </group>

      <Environment preset="night" />
    </>
  )
}

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Overlay UI */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end pb-16 px-6 md:px-14">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[10px] md:text-xs tracking-[0.35em] text-acid/70 uppercase mb-4">
            Creative &amp; Advertising Agency
          </p>
          <p className="font-body text-base md:text-lg text-ink/70 mb-8">
            Manga campaigns · Cinematic films · Webcomics · UGC
          </p>
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
            <a href="#work" className="font-mono text-[11px] tracking-[0.2em] uppercase bg-acid text-bg px-7 py-3.5 hover:bg-ink transition-colors">
              See our work
            </a>
            <a href="#contact" className="font-mono text-[11px] tracking-[0.2em] uppercase border border-acid/40 text-acid px-7 py-3.5 hover:border-acid hover:bg-acid/10 transition-colors">
              Start a project
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.3em] text-acid/30 uppercase">
        Scroll
      </div>
    </section>
  )
}
