import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SERVICES = [
  { n: '01', t: 'Manga Brand Campaigns', d: 'Four to twelve panel stories with your product woven in. People screenshot these and send them around. We’ve seen them pull far more shares than a normal ad.' },
  { n: '02', t: 'Cinematic Brand Films', d: 'Two to five minute films with an actual story, not a product demo. Cinematic quality without the cinematic budget.' },
  { n: '03', t: 'Webcomic Ad Series', d: 'Episodic stuff with characters people come back for. Builds a following, not just a view count.' },
  { n: '04', t: 'UGC That Converts', d: 'Platform-native content that still has real direction behind it. Made for Reels, Shorts, and TikTok, not churned out by a farm.' },
  { n: '05', t: 'Launch Packages', d: 'Teaser, launch day, then a follow-up series. Makes a launch feel like an event instead of a single post.' },
  { n: '06', t: 'Monthly Retainers', d: 'Same creative direction every month. Your whole feed starts to look like it belongs together.' },
]

// Generic motion graphics canvas (the ironic "what others deliver" bg)
function MotionGfxBg() {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    let raf, t = 0
    const shapes = []
    const cols = ['rgba(0,120,255,', 'rgba(255,50,80,', 'rgba(255,180,0,', 'rgba(0,200,150,']
    const init = () => {
      cv.width = cv.offsetWidth; cv.height = cv.offsetHeight
      shapes.length = 0
      for (let i = 0; i < 16; i++) shapes.push({ x: Math.random() * cv.width, y: Math.random() * cv.height, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, s: Math.random() * 36 + 14, rot: Math.random() * 6, rs: (Math.random() - 0.5) * 0.012, col: cols[i % 4], op: Math.random() * 0.05 + 0.02, form: i % 3 })
    }
    const draw = () => {
      if (!cv.width) { raf = requestAnimationFrame(draw); return }
      ctx.clearRect(0, 0, cv.width, cv.height); t += 0.006
      shapes.forEach(s => {
        s.x = (s.x + s.vx + cv.width) % cv.width; s.y = (s.y + s.vy + cv.height) % cv.height; s.rot += s.rs
        ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.rot)
        ctx.fillStyle = s.col + s.op + ')'; ctx.strokeStyle = s.col + (s.op * 3) + ')'; ctx.lineWidth = 1
        ctx.beginPath()
        if (s.form === 0) { ctx.moveTo(0, -s.s); ctx.lineTo(s.s * 0.86, s.s * 0.5); ctx.lineTo(-s.s * 0.86, s.s * 0.5); ctx.closePath() }
        else if (s.form === 1) ctx.arc(0, 0, s.s, 0, Math.PI * 2)
        else ctx.rect(-s.s / 2, -s.s / 2, s.s, s.s)
        ctx.fill(); ctx.stroke(); ctx.restore()
      })
      // scan line
      const sy = (Math.sin(t) * 0.5 + 0.5) * cv.height
      ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.fillRect(0, sy, cv.width, 1)
      raf = requestAnimationFrame(draw)
    }
    init(); draw()
    window.addEventListener('resize', init)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', init) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />
}

export default function Services() {
  const gridRef = useRef(null)
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.svc-card')
    if (cards) gsap.from(cards, { scrollTrigger: { trigger: gridRef.current, start: 'top 92%', toggleActions: 'play none none none', once: true }, y: 40, opacity: 0, stagger: 0.07, duration: 0.7, ease: 'power3.out' })
  }, [])

  return (
    <section id="services" className="relative py-24 md:py-32 px-6 md:px-14 bg-[#04140D] overflow-hidden">
      <MotionGfxBg />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-acid uppercase mb-4">What We Make</p>
          <h2 className="font-display text-5xl md:text-7xl">Six things<br /><span className="text-acid">we’re good at.</span></h2>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <div key={s.n} className="svc-card relative p-8 rounded-2xl overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.07) 50%, rgba(0,224,138,0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.5), inset 1.5px 0 0 rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.1), 0 30px 60px rgba(0,0,0,0.4)',
              }}>
              <div className="font-mono text-[10px] text-acid mb-4">{s.n}</div>
              <h3 className="font-body font-bold text-xl text-white mb-3">{s.t}</h3>
              <p className="font-body text-sm text-white/75 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
