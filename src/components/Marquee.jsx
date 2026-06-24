export default function Marquee() {
  const items = ['MANGA CAMPAIGNS', 'CINEMATIC FILMS', 'WEBCOMICS', 'UGC THAT CONVERTS', 'BRAND STORIES', 'NOT AD SLOP']
  const row = [...items, ...items]
  return (
    <div className="relative py-6 border-y border-ink/10 bg-bg overflow-hidden">
      <div className="flex whitespace-nowrap animate-[marquee_28s_linear_infinite]">
        {row.map((it, i) => (
          <span key={i} className="flex items-center font-display text-3xl md:text-5xl text-ink/90 mx-6">
            {it}
            <span className="text-acid mx-6 text-2xl">✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  )
}
