export default function Footer() {
  return (
    <footer className="bg-bg border-t border-ink/10 py-10 px-5 md:px-14">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="#" className="font-display text-2xl tracking-wide text-acid">KOHAKU</a>
        <div className="flex items-center gap-5">
          <a href="/privacy.html" className="font-mono text-[9px] tracking-[0.2em] text-ink/40 hover:text-acid uppercase transition-colors">Privacy</a>
          <a href="/terms.html" className="font-mono text-[9px] tracking-[0.2em] text-ink/40 hover:text-acid uppercase transition-colors">Terms</a>
          <a href="mailto:goonerlogy@gmail.com" className="font-mono text-[9px] tracking-[0.2em] text-ink/40 hover:text-acid uppercase transition-colors">Contact</a>
        </div>
        <p className="font-mono text-[9px] tracking-[0.2em] text-ink/30 uppercase">Not Ad Slop. Never. · © 2026</p>
      </div>
    </footer>
  )
}
