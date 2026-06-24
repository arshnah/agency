import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anon) {
  console.warn('Supabase env vars missing — set VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(url || '', anon || '')

// ── Leads ──
export async function submitLead({ name, email, message }) {
  const { error } = await supabase.from('leads').insert({ name, email, message })
  if (error) throw error
}

// ── Capture visitor email mid-chat: update conversation + create a lead ──
export async function setConversationEmail(conversationId, email, name = null) {
  // 1. attach email to the conversation (so admin inbox shows it)
  const { error: e1 } = await supabase
    .from('conversations')
    .update({ visitor_email: email, visitor_name: name })
    .eq('id', conversationId)
  if (e1) throw e1
  // 2. also drop it into leads so Gunar sees it as a lead
  const { error: e2 } = await supabase
    .from('leads')
    .insert({ name: name || 'Chat visitor', email, message: 'Started a chat on the site', source: 'chat' })
  // ignore duplicate-lead errors, email capture already succeeded
  if (e2) console.warn('lead insert (non-fatal):', e2.message)
}

// ── Chat: get or create a conversation (stored in localStorage) ──
const CONV_KEY = 'agency_conv_id'

export async function getOrCreateConversation({ name, email } = {}) {
  let id = localStorage.getItem(CONV_KEY)
  if (id) {
    // verify it still exists
    const { data } = await supabase.from('conversations').select('id').eq('id', id).maybeSingle()
    if (data) return id
  }
  const { data, error } = await supabase
    .from('conversations')
    .insert({ visitor_name: name || null, visitor_email: email || null })
    .select('id')
    .single()
  if (error) throw error
  localStorage.setItem(CONV_KEY, data.id)
  return data.id
}

export async function fetchMessages(conversationId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function sendMessage(conversationId, body, sender = 'visitor') {
  const { error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, body, sender })
  if (error) throw error
}

export function subscribeMessages(conversationId, onInsert) {
  const channel = supabase
    .channel(`conv:${conversationId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => onInsert(payload.new)
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}
