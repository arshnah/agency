// ════════════════════════════════════════════════
//  KOHAKU — Option B: Work section -> clean "Coming soon"
//  Run: node patch6.mjs  (run AFTER patch5)
// ════════════════════════════════════════════════
import { readFileSync, writeFileSync } from 'fs'

// 1. Replace WorkCards component body with a clean placeholder section
writeFileSync('src/components/WorkCards.jsx', `import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function WorkCards() {
  const ref = useRef(null)

  useEffect(() => {
    const items = ref.current?.querySelectorAll('.cw-rev')
    if (items) {
      gsap.from(items, {
        scrollTrigger: { trigger: ref.current, start: 'top 92%', toggleActions: 'play none none none', once: true },
        y: 30, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
      })
    }
  }, [])

  return (
    <section ref={ref} className="relative py-28 md:py-36 px-5 md:px-14 bg-[#070A09] overflow-hidden">
      {/* faint grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,224,138,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,224,138,0.4) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="cw-rev font-mono text-[11px] tracking-[0.3em] text-acid uppercase mb-6 flex items-center justify-center gap-3">
          <span className="w-8 h-px bg-acid inline-block" /> The Work <span className="w-8 h-px bg-acid inline-block" />
        </p>

        <h2 className="cw-rev font-display text-5xl md:text-7xl leading-[0.95] mb-6">
          First campaigns<br /><span className="text-acid">in production.</span>
        </h2>

        <p className="cw-rev font-body text-base md:text-lg text-ink/50 max-w-md mx-auto mb-10">
          We just opened our doors. The first manga campaigns and brand films are being made right now. This is where they\u2019ll live.
        </p>

        <div className="cw-rev inline-flex items-center gap-3 border border-acid/25 rounded-full px-6 py-3">
          <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
          <span className="font-mono text-[11px] tracking-[0.2em] text-acid uppercase">Work drops soon</span>
        </div>

        <p className="cw-rev font-body text-sm text-ink/40 mt-10">
          Want to be one of the first?{' '}
          <a href="#contact" className="text-acid hover:underline">Start a project →</a>
        </p>
      </div>
    </section>
  )
}
`)
console.log('OK src/components/WorkCards.jsx -- replaced with Coming Soon')

console.log('\\nDone. Ab chalao: npm run dev')
