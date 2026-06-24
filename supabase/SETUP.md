# 🟢 Supabase Setup — [ AGENCY ]

Pura backend Supabase pe. VPS ki zarurat nahi. Steps:

## 1. Supabase project banao
1. supabase.com → New Project
2. Name: `agency` · region: Mumbai (ap-south-1) · DB password set karo
3. Project ready hone ka wait karo (~2 min)

## 2. Schema daalo
1. Supabase dashboard → **SQL Editor** → New Query
2. `supabase/schema.sql` ka pura content paste karo → **Run**
3. Ye banayega: `leads`, `conversations`, `messages` tables + RLS + realtime

## 3. Creds nikaalo
Supabase → **Settings → API**:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public key** → `VITE_SUPABASE_ANON_KEY`

## 4. Frontend .env banao
Project root mein `.env` file:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```
(Vercel pe deploy karte waqt ye dono Environment Variables mein bhi daalo)

## 5. Run karo
```
npm install
npm run dev
```
- Contact form → leads table mein save hoga
- Chat bubble (bottom-right) → real-time messaging

## 6. Admin Inbox (tum + Gunar ke liye)
`supabase/admin-inbox.html` — ye standalone file hai, koi build nahi:
- Browser mein kholo (ya kahin host kar do)
- Pehli baar Supabase URL + anon key daalo (locally save ho jayega)
- Saari conversations + leads dikhenge, real-time reply kar sakte ho

**Tip:** admin-inbox.html ko Vercel pe `/admin` path pe daal sakte ho, ya Hostinger pe upload kar do.

---

## ⚠️ Security note (production ke liye)
Abhi RLS anon ko messages read/write dega (conversation uuid unguessable hai — MVP ke liye theek).
Production mein per-conversation token add karna better hai. Bata dena jab scale karo.

## Next: Messaging upgrade ideas
- Email alert on new message (Supabase Edge Function + Resend)
- File attachments (Supabase Storage)
- Typing indicators (Realtime presence)
- Admin auth (Supabase Auth — sirf tum/Gunar login)
