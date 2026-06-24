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
      scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
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
        {/* Left text */}
        <div ref={headRef}>
          <p className="font-mono text-[9px] tracking-[0.3em] text-acid uppercase mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-acid inline-block" /> Selected Work
          </p>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-4">Drag to see<br />the difference.</h2>
          <p className="font-body text-sm text-ink/40 leading-relaxed">Generic agency output vs. what we actually deliver. The difference is not subtle.</p>
          <p className="font-mono text-[8px] tracking-[0.2em] text-acid/40 uppercase mt-8 flex items-center gap-2">⇔ Drag the handle left or right</p>
        </div>

        {/* Diff slider */}
        <div
          ref={wrapRef}
          className="relative h-[440px] md:h-[520px] overflow-hidden select-none cursor-ew-resize shadow-2xl"
          onMouseDown={(e) => { dragging.current = true; move(e.clientX) }}
          onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX) }}
        >
          {/* AFTER (full bg) — manga panel */}
          <div className="absolute inset-0 bg-[#F8F7F4] p-5 flex flex-col gap-2">
            <span className="absolute top-3.5 left-3 z-10 font-mono text-[7.5px] tracking-[0.2em] bg-acid text-[#020403] px-2.5 py-1 font-medium">KOHAKU Work</span>
            <div className="font-mono text-[7.5px] tracking-[0.2em] text-forest border-b-2 border-[#1A2D24] pb-1.5 uppercase mt-6">Manga Campaign — Brewster Coffee</div>
            <div className="font-display text-2xl text-[#0D1A1A] tracking-wide -mb-1">Brewster Coffee Co.</div>
            <div className="grid grid-cols-3 gap-1.5">
              {[['2.4M', 'Organic Reach'], ['48K', 'Shares'], ['94%', 'Recall']].map(([n, l]) => (
                <div key={l} className="bg-white border-l-[3px] border-forest px-2.5 py-2">
                  <span className="font-display text-base text-forest block leading-none">{n}</span>
                  <span className="font-mono text-[6px] text-[#0D1A14]/40 tracking-wide uppercase mt-0.5 block">{l}</span>
                </div>
              ))}
            </div>
            {/* Manga panel grid */}
            <div className="flex-1 bg-white border-[2.5px] border-[#0D1A14] grid grid-cols-[3fr_2fr] grid-rows-2 overflow-hidden">
              <div className="row-span-2 border-r-[1.5px] border-[#0D1A14] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'repeating-linear-gradient(-45deg,transparent,transparent 4px,rgba(13,74,46,.05) 4px,rgba(13,74,46,.05) 5px)' }} />
                <div className="relative text-center px-2">
                  <div className="font-body text-xs font-bold text-[#0D1A14] leading-tight mb-1">THE<br />HIGHLANDS<br />FIND</div>
                  <div className="font-mono text-[7px] text-forest tracking-wide">PAGE 1 OF 4</div>
                </div>
              </div>
              <div className="border-b-[1.5px] border-[#0D1A14] flex items-center justify-center p-2">
                <span className="font-display text-[11px] text-[#0D1A14] text-center">"I found the perfect roast…"</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center"><div className="font-display text-3xl text-forest">2.4M</div><div className="font-mono text-[7px] text-forest tracking-wide">VIEWS</div></div>
              </div>
            </div>
            <div className="bg-[#0D1A14] px-3 py-2 flex items-center justify-between">
              <span className="font-mono text-[7px] text-[#4A7A5C] tracking-wide">Not a template. A story.</span>
              <span className="font-body text-[10px] font-semibold text-acid">Gets shared →</span>
            </div>
          </div>

          {/* BEFORE (clipped) — generic dashboard */}
          <div className="absolute inset-0 bg-[#0D1117] p-5 flex flex-col gap-2.5 font-mono" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <span className="absolute top-3.5 left-3 z-10 text-[7.5px] tracking-[0.2em] bg-white/[0.07] text-white/35 px-2.5 py-1">Generic Agency</span>
            <div className="text-[7.5px] tracking-[0.2em] text-[#484F58] border-b border-[#21262D] pb-2 uppercase mt-6">Campaign Dashboard — Q4</div>
            <div className="grid grid-cols-3 gap-1.5">
              {[['1.8%', 'CTR'], ['2.1K', 'Reach'], ['₹18', 'CPC']].map(([n, l]) => (
                <div key={l} className="bg-[#161B22] border border-[#21262D] p-2.5 text-center">
                  <span className="text-lg font-semibold text-[#586069] block">{n}</span>
                  <span className="text-[6px] text-[#30363D] tracking-wide uppercase mt-0.5 block">{l}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 bg-[#161B22] border border-[#21262D] flex flex-col items-center justify-center gap-2.5">
              <div className="w-40 bg-[#21262D] border border-[#30363D] p-3.5">
                <div className="h-[72px] bg-[#2D333B] mb-2.5 flex items-center justify-center"><span className="text-[7px] text-[#444] tracking-wide">STOCK PHOTO</span></div>
                <div className="h-1.5 bg-[#30363D] rounded-sm mb-1" /><div className="h-1.5 bg-[#30363D] rounded-sm mb-1 w-[55%]" />
                <div className="bg-[#1F6FEB] p-1.5 text-center text-[7px] text-white/50 tracking-wide mt-2">SHOP NOW</div>
              </div>
              <div className="flex gap-3 text-[7px] text-[#30363D]"><span>👍 12</span><span>👁 234</span><span>↗ 3</span></div>
            </div>
            <div className="text-[7px] text-[#21262D] tracking-[0.15em] text-center uppercase">Looks identical to every competitor</div>
          </div>

          {/* Handle */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-white z-20 pointer-events-none" style={{ left: `${pos}%`, boxShadow: '0 0 14px rgba(255,255,255,.3)' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border-2 border-forest flex items-center justify-center text-forest text-sm">⇔</div>
          </div>
        </div>
      </div>
    </section>
  )
}
