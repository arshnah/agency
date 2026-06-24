// ════════════════════════════════════════════════
//  KOHAKU — Fix patch
//  Run: node patch.mjs
//  Fixes: logo (`n bug), mobile-responsive 3D hero
// ════════════════════════════════════════════════
import { writeFileSync } from 'fs'

const files = {}

// ── Nav.jsx (clean logo) ──
files['src/components/Nav.jsx'] = `import { useState, useEffect } from 'react'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    ['Work', '#work'],
    ['Services', '#services'],
    ['About', '#about'],
    ['Contact', '#contact'],
  ]

  return (
    <nav className={\`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \${scrolled ? 'bg-bg/80 backdrop-blur-md py-3' : 'py-5'}\`}>
      <div className="flex items-center justify-between px-5 md:px-14">
        <a href="#" className="font-display text-2xl md:text-3xl tracking-wide text-acid">KOHAKU</a>

        <div className="hidden md:flex items-center gap-9">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink/60 hover:text-acid transition-colors">
              {label}
            </a>
          ))}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1.5 p-2 z-50" aria-label="Menu">
          <span className={\`w-6 h-px bg-ink transition-all \${open ? 'rotate-45 translate-y-2' : ''}\`} />
          <span className={\`w-6 h-px bg-ink transition-all \${open ? 'opacity-0' : ''}\`} />
          <span className={\`w-6 h-px bg-ink transition-all \${open ? '-rotate-45 -translate-y-2' : ''}\`} />
        </button>
      </div>

      <div className={\`md:hidden fixed inset-0 bg-bg/98 backdrop-blur-xl flex flex-col items-center justify-center gap-7 transition-all duration-300 \${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}\`}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)} className="font-display text-4xl text-ink hover:text-acid transition-colors tracking-wide">
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}
`

// ── Footer.jsx (clean logo) ──
files['src/components/Footer.jsx'] = `export default function Footer() {
  return (
    <footer className="bg-bg border-t border-ink/10 py-10 px-5 md:px-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="#" className="font-display text-2xl tracking-wide text-acid">KOHAKU</a>
        <p className="font-mono text-[9px] tracking-[0.2em] text-ink/30 uppercase">Not Ad Slop. Never. · © 2026</p>
      </div>
    </footer>
  )
}
`

// ── Hero.jsx (mobile-responsive 3D + scrim) ──
files['src/components/Hero.jsx'] = `import { Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Text3D, Center, Float, Environment } from '@react-three/drei'

const FONT = 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/helvetiker_bold.typeface.json'

function Line({ text, y, color, delay = 0 }) {
  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.25}>
      <Center position={[0, y, 0]}>
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
          <meshStandardMaterial color={color} metalness={1} roughness={0.22} envMapIntensity={2.2} />
        </Text3D>
      </Center>
    </Float>
  )
}

function Scene() {
  const { viewport } = useThree()
  // widest line "AD SLOP." ~8 world units — scale so it fits any viewport width
  const s = Math.min(viewport.width / 9.5, 1.1)
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 10]} intensity={1.3} color="#D0FFE8" />
      <directionalLight position={[-8, 3, 6]} intensity={1.0} color="#00E08A" />
      <directionalLight position={[8, -3, 6]} intensity={0.5} color="#00FF90" />
      <pointLight position={[0, 0, 6]} intensity={3} color="#00E08A" distance={20} />

      <group scale={[s, s, s]}>
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

      {/* Bamboo decorations */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-[60px] md:w-[100px] opacity-[0.14] z-[1]">
        <svg viewBox="0 0 80 600" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g fill="#0D4A2E" opacity="0.7">
            <rect x="22" y="0" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="46" rx="11" ry="3"/>
            <rect x="22" y="50" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="96" rx="11" ry="3"/>
            <rect x="22" y="100" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="146" rx="11" ry="3"/>
            <rect x="22" y="150" width="7" height="250" rx="3.5"/>
          </g>
        </svg>
      </div>
      <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-[60px] md:w-[100px] opacity-[0.14] z-[1] scale-x-[-1]">
        <svg viewBox="0 0 80 600" height="100%" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <g fill="#0D4A2E" opacity="0.7">
            <rect x="22" y="20" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="66" rx="11" ry="3"/>
            <rect x="22" y="70" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="116" rx="11" ry="3"/>
            <rect x="22" y="120" width="7" height="44" rx="3.5"/><ellipse cx="25" cy="166" rx="11" ry="3"/>
            <rect x="22" y="170" width="7" height="250" rx="3.5"/>
          </g>
        </svg>
      </div>

      {/* Bottom scrim so overlay text stays readable over 3D */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-bg via-bg/85 to-transparent z-[2]" />

      {/* Overlay UI */}
      <div className="pointer-events-none absolute inset-x-0 bottom-10 md:bottom-14 px-6 z-[3]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[9px] md:text-xs tracking-[0.35em] text-acid/70 uppercase mb-3">
            Creative &amp; Advertising Agency
          </p>
          <p className="font-body text-sm md:text-lg text-ink/70 mb-7 px-4">
            Manga campaigns · Cinematic films · Webcomics · UGC
          </p>
          <div className="pointer-events-auto flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#work" className="font-mono text-[11px] tracking-[0.2em] uppercase bg-acid text-bg px-7 py-3.5 hover:bg-ink transition-colors w-full sm:w-auto text-center">
              See our work
            </a>
            <a href="#contact" className="font-mono text-[11px] tracking-[0.2em] uppercase border border-acid/40 text-acid px-7 py-3.5 hover:border-acid hover:bg-acid/10 transition-colors w-full sm:w-auto text-center">
              Start a project
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.3em] text-acid/30 uppercase z-[3]">
        Scroll
      </div>
    </section>
  )
}
`

let count = 0
for (const [path, content] of Object.entries(files)) {
  writeFileSync(path, content)
  console.log('✓ patched', path)
  count++
}
console.log('\\nDone — ' + count + ' files fixed. Ab chalao: npm run dev')
