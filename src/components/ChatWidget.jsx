import { useState, useEffect, useRef } from 'react'
import { getOrCreateConversation, fetchMessages, sendMessage, subscribeMessages, setConversationEmail } from '../lib/supabase'

const EMAIL_KEY = 'agency_email_given'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [convId, setConvId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [booting, setBooting] = useState(false)

  // email capture state
  const [askEmail, setAskEmail] = useState(false)       // show the email prompt row
  const [emailGiven, setEmailGiven] = useState(false)   // already captured (this browser)
  const [emailInput, setEmailInput] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const endRef = useRef(null)

  // Boot conversation when first opened
  useEffect(() => {
    if (!open || convId) return
    setBooting(true)
    getOrCreateConversation()
      .then(async (id) => {
        setConvId(id)
        const msgs = await fetchMessages(id)
        setMessages(msgs)
        setBooting(false)
      })
      .catch((e) => { console.error(e); setBooting(false) })
  }, [open, convId])

  // restore "email already given" flag for returning visitors
  useEffect(() => {
    if (localStorage.getItem(EMAIL_KEY)) setEmailGiven(true)
  }, [])

  // Realtime subscription
  useEffect(() => {
    if (!convId) return
    const unsub = subscribeMessages(convId, (m) => {
      setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m])
    })
    return unsub
  }, [convId])

  // Auto-scroll
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, open, askEmail])

  const send = async () => {
    const body = input.trim()
    if (!body || !convId) return
    setInput('')
    const temp = { id: 'temp-' + Date.now(), conversation_id: convId, sender: 'visitor', body, created_at: new Date().toISOString() }
    const isFirst = messages.filter((m) => m.sender === 'visitor').length === 0
    setMessages((prev) => [...prev, temp])
    try { await sendMessage(convId, body, 'visitor') }
    catch (e) { console.error(e) }
    // After the very first visitor message, ask for email (once)
    if (isFirst && !emailGiven) {
      setTimeout(() => setAskEmail(true), 600)
    }
  }

  const submitEmail = async () => {
    const email = emailInput.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailErr('Enter a valid email'); return }
    setEmailErr('')
    try {
      await setConversationEmail(convId, email)
      localStorage.setItem(EMAIL_KEY, '1')
      setEmailGiven(true)
      setAskEmail(false)
      // confirmation message from "agency" side (local only, not stored)
      setMessages((prev) => [...prev, {
        id: 'sys-' + Date.now(), conversation_id: convId, sender: 'agency',
        body: 'Got it. We will reply right here, and over email too. 👍', created_at: new Date().toISOString(),
      }])
    } catch (e) {
      console.error(e); setEmailErr('Something went wrong, try again')
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-acid text-bg flex items-center justify-center shadow-lg shadow-acid/20 hover:scale-105 transition-transform"
        aria-label="Chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>

      {/* Chat panel */}
      <div className={`fixed bottom-24 right-6 z-[100] w-[calc(100vw-3rem)] max-w-sm origin-bottom-right transition-all duration-300 ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className="bg-[#0B0F0D] border border-ink/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ height: 'min(70vh, 520px)' }}>
          {/* Header */}
          <div className="px-5 py-4 border-b border-ink/10 bg-[#0E1311]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-acid animate-pulse" />
              <span className="font-display text-lg text-acid">KOHAKU</span>
            </div>
            <p className="font-mono text-[9px] tracking-wider text-ink/40 uppercase mt-1">Usually replies within an hour</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {booting && <p className="font-mono text-xs text-ink/30 text-center">Connecting…</p>}
            {!booting && messages.length === 0 && (
              <div className="text-center py-8">
                <p className="font-body text-ink/50 text-sm">👋 Hey. What are you working on?</p>
                <p className="font-mono text-[10px] text-ink/30 mt-2">No bots here, a real person reads these.</p>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl font-body text-sm ${m.sender === 'visitor' ? 'bg-acid text-bg rounded-br-sm' : 'bg-ink/10 text-ink rounded-bl-sm'}`}>
                  {m.body}
                </div>
              </div>
            ))}

            {/* Email prompt (after first message) */}
            {askEmail && !emailGiven && (
              <div className="bg-ink/5 border border-acid/20 rounded-xl p-3.5 mt-1">
                <p className="font-body text-sm text-ink/80">Drop your email so we can reply here and follow up if you leave.</p>
                <div className="flex gap-2 mt-2.5">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => { setEmailInput(e.target.value); setEmailErr('') }}
                    onKeyDown={(e) => e.key === 'Enter' && submitEmail()}
                    placeholder="you@email.com"
                    className="flex-1 bg-bg border border-ink/15 rounded-lg px-3 py-2 font-body text-sm text-ink placeholder:text-ink/30 focus:border-acid/50 focus:outline-none"
                    autoFocus
                  />
                  <button onClick={submitEmail} className="px-3.5 py-2 rounded-lg bg-acid text-bg font-mono text-[11px] uppercase tracking-wide hover:bg-ink transition-colors shrink-0">Send</button>
                </div>
                {emailErr && <p className="font-mono text-[10px] text-red-400 mt-1.5">{emailErr}</p>}
                <button onClick={() => setAskEmail(false)} className="font-mono text-[10px] text-ink/30 hover:text-ink/50 mt-2 transition-colors">later</button>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-ink/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message…"
              className="flex-1 bg-ink/5 border border-ink/10 rounded-full px-4 py-2.5 font-body text-sm text-ink placeholder:text-ink/30 focus:border-acid/40 focus:outline-none"
            />
            <button onClick={send} className="w-10 h-10 rounded-full bg-acid text-bg flex items-center justify-center hover:scale-105 transition-transform shrink-0" aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
