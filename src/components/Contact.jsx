import { useState } from 'react'
import { submitLead } from '../lib/supabase'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', msg: '' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    setErr('')
    if (!form.name || !form.email) { setErr('Name aur email zaroori hai.'); return }
    setLoading(true)
    try {
      await submitLead({ name: form.name, email: form.email, message: form.msg })
      setSent(true)
      setForm({ name: '', email: '', msg: '' })
    } catch (e) {
      setErr('Kuch gadbad hui — dobara try karo.')
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6 md:px-14 bg-[#070A09]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-5xl md:text-8xl leading-[0.95] mb-8">
          Got something<br /><span className="text-acid">worth making?</span>
        </h2>
        <p className="font-body text-lg text-ink/55 mb-12 max-w-md">
          Tell us what you're building. We'll show you how to make people stop scrolling.
        </p>

        {sent ? (
          <div className="border border-acid/30 bg-acid/5 rounded-xl p-8 text-center">
            <p className="font-display text-2xl text-acid mb-2">Got it.</p>
            <p className="font-body text-ink/60">We'll reply within 24 hours.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="bg-ink/5 border border-ink/10 rounded-lg px-5 py-4 font-body text-ink placeholder:text-ink/30 focus:border-acid/40 focus:outline-none transition-colors" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className="bg-ink/5 border border-ink/10 rounded-lg px-5 py-4 font-body text-ink placeholder:text-ink/30 focus:border-acid/40 focus:outline-none transition-colors" />
            <textarea value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} placeholder="What are you building?" rows={4} className="md:col-span-2 bg-ink/5 border border-ink/10 rounded-lg px-5 py-4 font-body text-ink placeholder:text-ink/30 focus:border-acid/40 focus:outline-none transition-colors resize-none" />
            {err && <p className="md:col-span-2 font-mono text-xs text-red-400">{err}</p>}
            <button onClick={submit} disabled={loading} className="md:col-span-2 bg-acid text-bg font-mono text-xs tracking-[0.2em] uppercase py-4 hover:bg-ink transition-colors disabled:opacity-50">
              {loading ? 'Sending…' : 'Send it →'}
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-ink/10">
          {[['Email', 'goonerlogy@gmail.com'], ['Response', 'Within 24h'], ['Location', 'India · Remote'], ['Kickoff', 'Within 72h']].map(([l, v]) => (
            <div key={l}>
              <div className="font-mono text-[8px] tracking-[0.2em] text-acid uppercase mb-2">{l}</div>
              <div className="font-body text-sm text-ink/70">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
