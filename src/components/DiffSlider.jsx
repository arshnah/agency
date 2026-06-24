import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function DiffSlider() {
  const [pos, setPos] = useState(50)
  const wrapRef = useRef(null)
  const headRef = useRef(null)
  const dragging = useRef(false)

  useEffect(() => {
    if (!headRef.current) return
    gsap.from(headRef.current.children, {
      scrollTrigger: { trigger: headRef.current, start: 'top 92%', toggleActions: 'play none none none', once: true },
      y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
    })
  }, [])

  const move = (clientX) => {
    if (!wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    const p = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(3, Math.min(97, p)))
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
    <section id="work" className="relative py-24 md:py-28 px-5 md:px-14 bg-[#0A0F0A]">
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.8fr] gap-10 lg:gap-20 items-start">
        <div ref={headRef}>
          <p className="font-mono text-[9px] tracking-[0.3em] text-acid uppercase mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-acid inline-block" /> The Difference
          </p>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-4">Most ads<br />look the same.</h2>
          <p className="font-body text-sm text-ink/40 leading-relaxed">On the left, the ad everyone scrolls past. On the right, the kind of thing we make. Drag the handle and see for yourself.</p>
          <p className="font-mono text-[8px] tracking-[0.2em] text-acid/40 uppercase mt-8">Drag the handle left or right</p>
        </div>

        <div
          ref={wrapRef}
          className="relative h-[440px] md:h-[520px] overflow-hidden select-none cursor-ew-resize shadow-2xl"
          onMouseDown={(e) => { dragging.current = true; move(e.clientX) }}
          onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX) }}
        >
          {/* RIGHT (full bg): KOHAKU manga concept — no client, no metrics */}
          <div className="absolute inset-0 bg-[#F8F7F4] p-4 md:p-6 flex flex-col">
            <span className="absolute top-3.5 left-3 z-10 font-mono text-[7.5px] tracking-[0.2em] bg-acid text-[#020403] px-2.5 py-1 font-medium">KOHAKU · Manga concept</span>
            <div className="flex-1 mt-7 border-[3px] border-[#0D1A14] grid grid-cols-[1.4fr_1fr] grid-rows-2 overflow-hidden bg-white">
              {/* big panel: scene */}
              <div className="row-span-2 border-r-[2px] border-[#0D1A14] relative overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 220 360" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                  <rect width="220" height="360" fill="#EAE3D2"/>
                  <g opacity="0.5" stroke="#8B6914" strokeWidth="0.7">
                    <line x1="110" y1="170" x2="0" y2="0"/><line x1="110" y1="170" x2="70" y2="0"/>
                    <line x1="110" y1="170" x2="150" y2="0"/><line x1="110" y1="170" x2="220" y2="0"/>
                    <line x1="110" y1="170" x2="0" y2="120"/><line x1="110" y1="170" x2="220" y2="120"/>
                  </g>
                  <polygon points="110,40 20,250 200,250" fill="#2D5A3D"/>
                  <polygon points="110,70 55,250 165,250" fill="#4A8A5E"/>
                  <rect x="88" y="225" width="44" height="30" rx="4" fill="#6B3A2A"/>
                  <ellipse cx="110" cy="225" rx="24" ry="7" fill="#8B4F3A"/>
                  <path d="M134,230 Q146,242 140,256 Q136,264 130,260" fill="none" stroke="#6B3A2A" strokeWidth="3.5" strokeLinecap="round"/>
                  <text x="110" y="300" textAnchor="middle" fontFamily="Arial Black" fontSize="15" fill="#0D1A14">SCROLL</text>
                  <text x="110" y="320" textAnchor="middle" fontFamily="Arial Black" fontSize="15" fill="#2D5A3D">STOPPED.</text>
                </svg>
              </div>
              {/* top right: speech bubble */}
              <div className="border-b-[2px] border-[#0D1A14] flex items-center justify-center p-3 relative">
                <div className="relative bg-white border-2 border-[#0D1A14] rounded-xl px-3 py-2">
                  <span className="font-display text-lg text-[#0D1A14] leading-none">"Wait, what<br/>is this?"</span>
                </div>
              </div>
              {/* bottom right: line art */}
              <div className="flex items-center justify-center bg-[#0D1A14] p-2">
                <div className="text-center">
                  <div className="font-display text-2xl text-acid leading-none">A STORY</div>
                  <div className="font-mono text-[7px] text-white/50 tracking-[0.2em] mt-1">NOT AN AD</div>
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-[7px] text-forest/60 tracking-wide uppercase">The kind of thing people screenshot</span>
              <span className="font-display text-sm text-forest">KOHAKU</span>
            </div>
          </div>

          {/* LEFT (clipped): generic ad — no fake metrics, just visually bland */}
          <div className="absolute inset-0 bg-[#0D1117] p-4 md:p-6 flex flex-col font-mono" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <span className="absolute top-3.5 left-3 z-10 text-[7.5px] tracking-[0.2em] bg-white/[0.07] text-white/35 px-2.5 py-1">Typical ad</span>
            <div className="flex-1 mt-7 bg-[#161B22] border border-[#21262D] flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-44 h-28 bg-[#21262D] border border-[#30363D] flex items-center justify-center">
                <span className="text-[8px] text-[#444] tracking-wide">STOCK PHOTO</span>
              </div>
              <div className="w-44 space-y-1.5">
                <div className="h-2 bg-[#30363D] rounded-sm" />
                <div className="h-2 bg-[#30363D] rounded-sm w-2/3" />
              </div>
              <div className="bg-[#1F6FEB] px-6 py-2 text-[9px] text-white/60 tracking-wide">SHOP NOW</div>
              <span className="text-[7px] text-[#21262D] tracking-[0.15em] uppercase">Looks like every other ad</span>
            </div>
          </div>

          {/* Handle */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none" style={{ left: `${pos}%`, boxShadow: '0 0 14px rgba(255,255,255,.3)' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-acid border-2 border-[#0A0F0A] flex items-center justify-center text-[#0A0F0A] text-sm">⇄</div>
          </div>
        </div>
      </div>
    </section>
  )
}
