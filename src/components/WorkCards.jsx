import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const CARDS = [
  { tag: 'Manga', type: 'Manga Campaign', brand: 'Brewster Coffee', stats: [['2.4M', 'Views'], ['48K', 'Shares'], ['94%', 'Recall']], bg: '#F5ECD8', fg: '#1A2D24',
    art: (<><polygon points="150,30 40,170 260,170" fill="#2D5A3D"/><polygon points="150,45 75,170 225,170" fill="#4A8A5E"/><circle cx="130" cy="150" r="14" fill="#6B3A2A"/><rect x="165" y="80" width="110" height="48" rx="5" fill="#fff" stroke="#1A1A1A"/><text x="220" y="100" textAnchor="middle" fontFamily="Georgia" fontSize="9" fontStyle="italic" fill="#1A1A1A">"The perfect</text><text x="220" y="114" textAnchor="middle" fontFamily="Georgia" fontSize="9" fontStyle="italic" fill="#1A1A1A">roast."</text></>) },
  { tag: 'Webcomic', type: 'Webcomic Series', brand: 'Qbox', stats: [['1M', 'Users'], ['72h', 'To milestone'], ['4', 'Episodes']], bg: '#EEF6FF', fg: '#0B2240',
    art: (<><rect x="4" y="20" width="292" height="50" fill="#1A2D50"/><text x="150" y="50" textAnchor="middle" fontFamily="Arial Black" fontSize="14" fill="#7AB4FF">EPISODE 01</text><rect x="4" y="80" width="292" height="100" fill="#0D1B2A"/><text x="150" y="130" textAnchor="middle" fontFamily="Arial Black" fontSize="22" fill="#4AF0A0">WE DID IT.</text><text x="150" y="155" textAnchor="middle" fontFamily="Space Mono" fontSize="9" fill="#7A9EBF">1M users · 72 hours</text></>) },
  { tag: 'Brand Film', type: 'Cinematic Film', brand: 'Luminary', stats: [['3.2M', 'Views'], ['4 min', 'Runtime'], ['↑86%', 'Recall']], bg: '#0A1020', fg: '#fff', dark: true,
    art: (<><rect width="300" height="200" fill="#0A1020"/><rect width="300" height="22" fill="#000"/><rect y="178" width="300" height="22" fill="#000"/><circle cx="230" cy="60" r="13" fill="#FFF8E8" opacity="0.9"/><rect x="40" y="120" width="16" height="58" fill="#141C30"/><rect x="100" y="95" width="18" height="83" fill="#141C30"/><rect x="160" y="110" width="16" height="68" fill="#0E1424"/><rect x="220" y="100" width="18" height="78" fill="#141C30"/><text x="150" y="150" textAnchor="middle" fontFamily="Georgia" fontSize="13" fill="#fff" letterSpacing="6">LUMINARY</text></>) },
  { tag: 'Manga', type: 'Manga Campaign', brand: 'Nova Studio', stats: [['3.8M', 'Reach'], ['95%', 'Retention'], ['6', 'Pages']], bg: '#FFF0F5', fg: '#E84060',
    art: (<><circle cx="80" cy="80" r="30" fill="#FFD699" stroke="#222" strokeWidth="2"/><circle cx="72" cy="73" r="5" fill="#222"/><circle cx="90" cy="73" r="5" fill="#222"/><rect x="130" y="45" width="150" height="70" rx="8" fill="#fff" stroke="#1A1A1A" strokeWidth="2"/><text x="205" y="80" textAnchor="middle" fontFamily="Arial Black" fontSize="20" fill="#E84060">NOVA!</text><text x="205" y="100" textAnchor="middle" fontFamily="Georgia" fontSize="8" fontStyle="italic" fill="#333">"Be remembered."</text></>) },
  { tag: 'UGC Series', type: 'UGC Campaign', brand: 'HealthTrack', stats: [['3.2M', 'Views'], ['4.8x', 'ROAS'], ['+180%', 'Sales']], bg: '#0A0A0A', fg: '#10B981', dark: true,
    art: (<><rect width="300" height="200" fill="#0A0A0A"/><rect x="10" y="20" width="130" height="80" rx="4" fill="#111120" stroke="rgba(124,58,237,0.4)"/><text x="75" y="60" textAnchor="middle" fontFamily="Arial Black" fontSize="26" fill="#7C3AED">3.2M</text><text x="75" y="80" textAnchor="middle" fontFamily="Space Mono" fontSize="8" fill="#555">VIEWS</text><rect x="160" y="20" width="130" height="80" rx="4" fill="#111120" stroke="rgba(16,185,129,0.4)"/><text x="225" y="60" textAnchor="middle" fontFamily="Arial Black" fontSize="26" fill="#10B981">+180%</text><text x="225" y="80" textAnchor="middle" fontFamily="Space Mono" fontSize="8" fill="#555">SALES</text><rect x="10" y="115" width="280" height="65" rx="4" fill="#111120"/><text x="150" y="140" textAnchor="middle" fontFamily="Arial Black" fontSize="10" fill="#fff">4 CREATORS · DIRECTED</text><rect x="30" y="155" width="240" height="6" rx="3" fill="#1A1A2A"/><rect x="30" y="155" width="195" height="6" rx="3" fill="#10B981"/></>) },
]

export default function WorkCards() {
  const stripRef = useRef(null)
  const down = useRef(false)
  const start = useRef(0)
  const sl = useRef(0)

  useEffect(() => {
    const cards = stripRef.current?.querySelectorAll('.wc-card')
    if (cards) {
      gsap.from(cards, {
        scrollTrigger: { trigger: stripRef.current, start: 'top 82%' },
        y: 50, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'power3.out',
      })
    }
  }, [])

  const onDown = (e) => { down.current = true; start.current = e.pageX; sl.current = stripRef.current.scrollLeft }
  const onMove = (e) => { if (!down.current) return; e.preventDefault(); stripRef.current.scrollLeft = sl.current - (e.pageX - start.current) }
  const onUp = () => { down.current = false }

  return (
    <section className="relative py-24 md:py-28 bg-[#070A09] overflow-hidden">
      <div className="flex items-end justify-between px-6 md:px-14 mb-10">
        <div>
          <p className="font-mono text-[11px] tracking-[0.3em] text-acid uppercase mb-3 flex items-center gap-3">
            <span className="w-8 h-px bg-acid inline-block" /> Our Formats
          </p>
          <h2 className="font-display text-5xl md:text-7xl">The work.</h2>
        </div>
        <span className="hidden md:block font-mono text-[10px] tracking-[0.2em] text-acid/40 uppercase">← drag to explore →</span>
      </div>

      <div
        ref={stripRef}
        className="flex gap-5 overflow-x-auto px-6 md:px-14 pb-8 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      >
        {CARDS.map((c, i) => (
          <div key={i} className="wc-card flex-none w-[300px] scroll-ml-6" style={{ scrollSnapAlign: 'start' }}>
            <div className="group bg-[#111] border border-ink/[0.06] overflow-hidden hover:border-acid/20 hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative h-[200px] overflow-hidden">
                <span className="absolute top-3 left-3 z-10 font-mono text-[7px] tracking-[0.2em] text-bg bg-acid px-2.5 py-1 uppercase">{c.tag}</span>
                <svg viewBox="0 0 300 200" className="w-full h-full" style={{ background: c.bg }}>{c.art}</svg>
              </div>
              <div className="p-4 border-t border-ink/[0.06]">
                <div className="font-mono text-[7.5px] tracking-[0.2em] text-acid/50 uppercase mb-1">{c.type}</div>
                <div className="font-display text-xl text-ink mb-3">{c.brand}</div>
                <div className="flex gap-4 pt-3 border-t border-ink/5">
                  {c.stats.map(([n, l]) => (
                    <div key={l} className="flex flex-col">
                      <span className="font-display text-base text-acid leading-none">{n}</span>
                      <span className="font-mono text-[6px] tracking-wider text-ink/25 uppercase mt-1">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
