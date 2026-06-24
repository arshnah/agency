import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const SERVICES = [
  { n: '01', t: 'Manga Brand Campaigns', d: '4–12 panel manga series. The format people screenshot and share. 40x more shares than standard ads.' },
  { n: '02', t: 'Cinematic Brand Films', d: '2–5 min short films with real narrative arcs. Cinematic quality at a fraction of production cost.' },
  { n: '03', t: 'Webcomic Ad Series', d: 'Episodic content with recurring characters. Builds community, not just impressions.' },
  { n: '04', t: 'UGC That Converts', d: 'Platform-native content with real creative direction. Built for Reels, Shorts, TikTok.' },
  { n: '05', t: 'Launch Packages', d: 'Pre-launch teaser + launch-day hero + post-launch series. An event, not an announcement.' },
  { n: '06', t: 'Monthly Retainers', d: 'Consistent creative direction every month. Same visual language, same narrative voice.' },
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
    if (cards) gsap.from(cards, { scrollTrigger: { trigger: gridRef.current, start: 'top 80%' }, y: 40, opacity: 0, stagger: 0.07, duration: 0.7, ease: 'power3.out' })
  }, [])

  return (
    <section id="services" className="relative py-24 md:py-32 px-6 md:px-14 bg-black overflow-hidden">
      <MotionGfxBg />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <p className="font-mono text-[11px] tracking-[0.3em] text-acid uppercase mb-4">What We Make</p>
          <h2 className="font-display text-5xl md:text-7xl">Six formats.<br /><span className="text-acid">All unforgettable.</span></h2>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <div key={s.n} className="svc-card relative p-8 rounded-2xl overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(180,220,200,0.02) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.5), inset 1.5px 0 0 rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.1), 0 30px 60px rgba(0,0,0,0.4)',
              }}>
              <div className="font-mono text-[10px] text-acid mb-4">{s.n}</div>
              <h3 className="font-body font-bold text-xl text-white mb-3">{s.t}</h3>
              <p className="font-body text-sm text-white/55 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
