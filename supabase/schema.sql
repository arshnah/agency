-- ════════════════════════════════════════════════════
--  [ AGENCY ] — Supabase Schema
--  Paste this whole file into: Supabase → SQL Editor → Run
-- ════════════════════════════════════════════════════

-- ── 1. LEADS (contact form submissions) ──
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text,
  source      text default 'website',
  status      text default 'new',      -- new · contacted · converted · archived
  created_at  timestamptz default now()
);

-- ── 2. CONVERSATIONS (chat threads) ──
create table if not exists public.conversations (
  id              uuid primary key default gen_random_uuid(),
  visitor_name    text,
  visitor_email   text,
  status          text default 'open',  -- open · closed
  last_message_at timestamptz default now(),
  created_at      timestamptz default now()
);

-- ── 3. MESSAGES (individual chat messages) ──
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender          text not null,        -- 'visitor' or 'agency'
  body            text not null,
  read            boolean default false,
  created_at      timestamptz default now()
);

create index if not exists idx_messages_conv on public.messages(conversation_id, created_at);
create index if not exists idx_leads_status  on public.leads(status, created_at desc);

-- ── Auto-update conversation last_message_at on new message ──
create or replace function public.bump_conversation()
returns trigger language plpgsql as $$
begin
  update public.conversations
    set last_message_at = now()
    where id = new.conversation_id;
  return new;
end; $$;

drop trigger if exists trg_bump_conv on public.messages;
create trigger trg_bump_conv
  after insert on public.messages
  for each row execute function public.bump_conversation();

-- ════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════
alter table public.leads         enable row level security;
alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

-- LEADS: anyone can submit (insert only). No public read.
drop policy if exists "leads_insert" on public.leads;
create policy "leads_insert" on public.leads
  for insert to anon, authenticated with check (true);

-- CONVERSATIONS: anyone can create + read (uuid is unguessable).
drop policy if exists "conv_insert" on public.conversations;
create policy "conv_insert" on public.conversations
  for insert to anon, authenticated with check (true);

drop policy if exists "conv_select" on public.conversations;
create policy "conv_select" on public.conversations
  for select to anon, authenticated using (true);

drop policy if exists "conv_update" on public.conversations;
create policy "conv_update" on public.conversations
  for update to anon, authenticated using (true) with check (true);

-- MESSAGES: anyone can insert + read. Scoped client-side by conversation_id.
-- (NOTE: For production, scope reads with a per-conversation token. See guide.)
drop policy if exists "msg_insert" on public.messages;
create policy "msg_insert" on public.messages
  for insert to anon, authenticated with check (true);

drop policy if exists "msg_select" on public.messages;
create policy "msg_select" on public.messages
  for select to anon, authenticated using (true);

drop policy if exists "msg_update" on public.messages;
create policy "msg_update" on public.messages
  for update to anon, authenticated using (true) with check (true);

-- ════════════════════════════════════════════════════
--  REALTIME (for live chat)
-- ════════════════════════════════════════════════════
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;
