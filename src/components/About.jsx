import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const STATS = [['40x', 'More shares'], ['94%', 'Recall rate'], ['48h', 'First draft'], ['₹12K', 'Starting/mo']]

export default function About() {
  const ref = useRef(null)
  useEffect(() => {
    const items = ref.current?.querySelectorAll('.stat-item')
    if (items) gsap.from(items, { scrollTrigger: { trigger: ref.current, start: 'top 82%' }, y: 30, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out' })
  }, [])

  return (
    <section id="about" className="relative py-24 md:py-32 px-6 md:px-14 bg-bg">
      <div className="max-w-5xl mx-auto">
        <p className="font-mono text-[11px] tracking-[0.3em] text-acid uppercase mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-acid inline-block" /> Who We Are
        </p>
        <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-8">
          We make ads people <span className="text-acid">screenshot, not skip.</span>
        </h2>
        <p className="font-body text-lg text-ink/55 max-w-2xl mb-16">
          Most agencies chase volume and the work starts to blur together. We go the other way. Every piece gets real creative direction, so it lands like a story someone wants to send to a friend. Manga panels, short films, webcomics, UGC, whatever the brand actually needs.
        </p>

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-ink/10 pt-12">
          {STATS.map(([n, l]) => (
            <div key={l} className="stat-item">
              <div className="font-display text-4xl md:text-6xl text-acid mb-2">{n}</div>
              <div className="font-mono text-[9px] tracking-[0.2em] text-ink/40 uppercase">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
