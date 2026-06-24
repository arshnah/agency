import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Water() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const glassRef = useRef(null)
  const crackRef = useRef(null)
  const word1Ref = useRef(null)
  const word2Ref = useRef(null)
  const progressRef = useRef(0)

  // Canvas water animation (driven by scroll progress)
  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    let raf
    let W = 0, H = 0

    const resize = () => {
      W = cv.width = cv.offsetWidth
      H = cv.height = cv.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    const draw = () => {
      if (!W) { raf = requestAnimationFrame(draw); return }
      const p = progressRef.current  // 0 → 1 scroll progress
      t += 0.02
      ctx.clearRect(0, 0, W, H)

      // ── Phase 1 (0–0.4): waves rising from bottom ──
      const waveBase = H - (H * 0.25 * Math.min(p / 0.4, 1))

      // 3 layered ocean waves
      const layers = [
        { amp: 26, len: 0.008, sp: 1.0, col: 'rgba(0,90,140,0.5)', off: 0 },
        { amp: 20, len: 0.011, sp: 1.4, col: 'rgba(0,140,190,0.45)', off: 30 },
        { amp: 15, len: 0.015, sp: 0.8, col: 'rgba(60,190,220,0.4)', off: 55 },
      ]
      layers.forEach((L) => {
        ctx.beginPath()
        ctx.moveTo(0, H)
        for (let x = 0; x <= W; x += 6) {
          const y = waveBase + L.off + Math.sin(x * L.len + t * L.sp) * L.amp
          ctx.lineTo(x, y)
        }
        ctx.lineTo(W, H)
        ctx.closePath()
        ctx.fillStyle = L.col
        ctx.fill()
      })

      // ── Phase 3 (0.55–1): water floods from crack radially ──
      if (p > 0.55) {
        const fp = (p - 0.55) / 0.45  // 0 → 1
        const cx = W / 2, cy = H / 2
        const maxR = Math.hypot(W, H) * 0.75
        const r = maxR * fp

        ctx.save()
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.clip()

        // flood fill with animated waves inside the expanding circle
        const grad = ctx.createLinearGradient(0, 0, 0, H)
        grad.addColorStop(0, 'rgba(0,120,170,0.85)')
        grad.addColorStop(1, 'rgba(0,60,110,0.95)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, W, H)

        // ripple lines inside flood
        ctx.strokeStyle = 'rgba(120,210,240,0.25)'
        ctx.lineWidth = 1.5
        for (let i = 0; i < 3; i++) {
          ctx.beginPath()
          for (let x = 0; x <= W; x += 6) {
            const y = cy + Math.sin(x * 0.012 + t * (1 + i * 0.3) + i) * (18 + i * 6) + (i - 1) * 50
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
        ctx.restore()
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  // GSAP scroll-pinned timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          onUpdate: (self) => { progressRef.current = self.progress },
        },
      })

      // glass intact → shake → crack appears
      tl.to(glassRef.current, { duration: 0.35, x: 0 }, 0)
        .to(glassRef.current, {
          duration: 0.15,
          keyframes: { x: [0, -6, 5, -4, 3, 0] },
          ease: 'none',
        }, 0.35)
        // crack reveal
        .to(crackRef.current, { opacity: 1, duration: 0.1 }, 0.48)
        // glass fades as water floods
        .to(glassRef.current, { opacity: 0, scale: 0.96, duration: 0.3 }, 0.55)
        // black words float up
        .fromTo(word1Ref.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 }, 0.6)
        .fromTo(word2Ref.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 }, 0.72)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-[#020608]">
      {/* Water canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Liquid glass panel */}
      <div
        ref={glassRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl flex items-center justify-center"
        style={{
          width: 'min(800px, 90vw)',
          height: 'min(560px, 76vh)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 40%, rgba(200,225,255,0.03) 100%)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.7), inset 1.5px 0 0 rgba(255,255,255,0.4), 0 0 0 1px rgba(255,255,255,0.2), 0 30px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* top specular */}
        <div className="absolute top-0 left-[12%] right-[12%] h-0.5" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.95),transparent)' }} />

        {/* Glass content — white lines + text */}
        <div className="text-center px-8">
          <div className="w-3/4 h-px mx-auto mb-6" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)' }} />
          <h2 className="font-display text-5xl md:text-7xl text-white tracking-wide" style={{ textShadow: '0 0 28px rgba(255,255,255,0.4)' }}>KOHAKU</h2>
          <p className="font-mono text-[10px] md:text-xs tracking-[0.4em] text-white/60 uppercase mt-4">Creative &amp; Advertising</p>
          <div className="w-3/4 h-px mx-auto mt-6" style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)' }} />
        </div>

        {/* Crack SVG overlay */}
        <svg ref={crackRef} className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" viewBox="0 0 800 560" preserveAspectRatio="none">
          <g stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" fill="none">
            <path d="M400,280 L340,180 L300,90" />
            <path d="M400,280 L470,200 L520,120 L560,40" />
            <path d="M400,280 L330,360 L290,450" />
            <path d="M400,280 L480,350 L540,440" />
            <path d="M400,280 L280,290 L160,270" />
            <path d="M400,280 L520,300 L640,285" />
            <path d="M340,180 L380,210 M470,200 L430,240 M330,360 L375,330 M480,350 L440,310" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          </g>
        </svg>
      </div>

      {/* Black words that float up through water */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <h2 ref={word1Ref} className="font-display text-6xl md:text-8xl text-[#020608] opacity-0" style={{ textShadow: '0 2px 20px rgba(120,210,240,0.3)' }}>NOT AD SLOP.</h2>
        <p ref={word2Ref} className="font-body text-xl md:text-3xl text-[#041018] opacity-0 mt-4 font-bold">stories that flood the internet.</p>
      </div>
    </section>
  )
}
