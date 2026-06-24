import { useState, useEffect } from 'react'

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-bg/80 backdrop-blur-md py-3' : 'py-5'}`}>
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
          <span className={`w-6 h-px bg-ink transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-px bg-ink transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-px bg-ink transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      <div className={`md:hidden fixed inset-0 bg-bg/98 backdrop-blur-xl flex flex-col items-center justify-center gap-7 transition-all duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)} className="font-display text-4xl text-ink hover:text-acid transition-colors tracking-wide">
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}
