# [ AGENCY ] — Creative Agency Site

Vite + React + React Three Fiber + GSAP + Lenis

## Local dev
```
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Deploy — Frontend (Vercel)
1. Push to GitHub
2. Import repo on vercel.com → Framework: Vite → Deploy
3. Edit `vercel.json` → replace `api.your-domain.com` with your VPS API domain
   (so `/api/contact` proxies to the VPS backend, avoiding CORS)

## Deploy — Backend (VPS 213.210.36.47, Ubuntu + PM2)
```
# On VPS:
cd /var/www
git clone <repo> agency && cd agency/backend
npm install
cp .env.example .env
nano .env                          # fill DB + SMTP creds

# MySQL setup:
mysql -u root -p
CREATE DATABASE agency;
CREATE USER 'agency_user'@'localhost' IDENTIFIED BY 'ChangeMe@2026';
GRANT ALL ON agency.* TO 'agency_user'@'localhost';
FLUSH PRIVILEGES; EXIT;

# Start with PM2:
pm2 start server.js --name agency-api
pm2 save
pm2 logs agency-api

# Nginx reverse proxy (api.your-domain.com → :5055):
# location /api/ { proxy_pass http://127.0.0.1:5055; }
```

## Gmail SMTP
Use an App Password (not your login password):
Google Account → Security → 2-Step Verification → App passwords
