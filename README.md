# Lawndale Park Pet Registry

Seen here. Safe here. Found faster.

A mobile-first, historic-Houston themed neighbor board for Lawndale Park pet sightings, missing pets, and familiar regulars.

## Stack
- Next.js App Router + TypeScript + Tailwind
- Prisma + SQLite
- Uploads: local filesystem in dev, Cloudinary in production

## Commands
```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

## Deploy (Vercel)
1. Import repo in Vercel.
2. Set env vars:
   - `DATABASE_URL` (for hosted DB provider if moving off SQLite)
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Build command: `npm run build`
4. Start command: `npm run start`

## Notes
- Default neighborhood filter is Houston — Lawndale Park.
- Adminless moderation auto-hides a target after 3 reports.
- No public leaderboard; stewardship points are gentle and non-competitive.
