import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function DiffSlider() {
  const [pos, setPos] = useState(50)
  const wrapRef = useRef(null)
  const headRef = useRef(null)
  const dragging = useRef(false)

  useEffect(() => {
    if (!headRef.current) return
    gsap.from(headRef.current, {
      scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
    })
  }, [])

  const move = (clientX) => {
    if (!wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    const p = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(2, Math.min(98, p)))
  }

  useEffect(() => {
    const onMove = (e) => { if (dragging.current) move(e.touches ? e.touches[0].clientX : e.clientX) }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  return (
    <section id="work" className="relative py-24 md:py-32 px-6 md:px-14 bg-bg">
      <div ref={headRef} className="max-w-7xl mx-auto mb-12">
        <p className="font-mono text-[11px] tracking-[0.3em] text-acid uppercase mb-4 flex items-center gap-3">
          <span className="w-8 h-px bg-acid inline-block" /> Selected Work
        </p>
        <h2 className="font-display text-5xl md:text-7xl leading-[0.95]">
          Drag to see<br />the difference.
        </h2>
        <p className="font-body text-ink/50 mt-5 max-w-md">
          Generic agency output vs what we actually deliver. The difference is not subtle.
        </p>
      </div>

      <div
        ref={wrapRef}
        className="relative max-w-4xl mx-auto aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-lg select-none cursor-ew-resize border border-ink/10"
        onMouseDown={(e) => { dragging.current = true; move(e.clientX) }}
        onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX) }}
      >
        {/* RIGHT: our work (full bg) */}
        <div className="absolute inset-0 bg-[#F5ECD8] flex items-center justify-center">
          <div className="text-center px-8">
            <p className="font-mono text-[9px] tracking-[0.3em] text-forest/60 uppercase mb-3">[ Agency ] Work · Brewster Coffee</p>
            <h3 className="font-display text-3xl md:text-5xl text-[#1A2D24] mb-4">BREWSTER COFFEE</h3>
            <div className="flex items-center justify-center gap-6 md:gap-10">
              {[['2.4M', 'Reach'], ['48K', 'Shares'], ['94%', 'Recall']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl md:text-4xl text-forest">{n}</div>
                  <div className="font-mono text-[7px] tracking-widest text-forest/50 uppercase">{l}</div>
                </div>
              ))}
            </div>
            <p className="font-body text-sm text-[#1A2D24]/60 mt-5 italic">"Not a template. A story."</p>
          </div>
        </div>

        {/* LEFT: generic (clipped) */}
        <div className="absolute inset-0 bg-[#0E1220] flex items-center justify-center" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <div className="text-center px-8">
            <p className="font-mono text-[9px] tracking-[0.3em] text-ink/30 uppercase mb-3">Generic Agency · Dashboard Q4</p>
            <div className="w-32 h-20 md:w-44 md:h-28 bg-ink/5 border border-ink/10 mx-auto mb-4 flex items-center justify-center">
              <span className="font-mono text-[8px] text-ink/20">STOCK PHOTO</span>
            </div>
            <div className="flex items-center justify-center gap-6 md:gap-10">
              {[['1.8%', 'CTR'], ['2.1K', 'Reach'], ['12', 'Likes']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl md:text-4xl text-ink/40">{n}</div>
                  <div className="font-mono text-[7px] tracking-widest text-ink/20 uppercase">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 inline-block bg-[#1E5BFF] text-white font-mono text-[9px] px-5 py-2">SHOP NOW</div>
          </div>
        </div>

        {/* Handle */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-acid z-20 pointer-events-none" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-acid flex items-center justify-center text-bg text-sm font-bold shadow-lg">⇄</div>
        </div>
      </div>

      <p className="text-center font-mono text-[9px] tracking-[0.25em] text-acid/40 uppercase mt-6">← drag the handle →</p>
    </section>
  )
}
