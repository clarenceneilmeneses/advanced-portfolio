# Portfolio Revamped — Portfolio + CMS

A bryllim.com-style portfolio with a built-in admin CMS, backed by your Supabase
project (`portfolio-revamped`). Everything on the public site — profile, tech stack,
projects (with full case-study pages), experience, certifications, highlights,
memberships, social links, gallery — is editable at `/admin`.

## Stack
- Next.js 14 (App Router) + Tailwind CSS
- Supabase: Postgres (content), Auth (admin login), Storage (images)
- No server secrets in the app — only the publishable key; writes are gated by RLS.

## Setup (one time, ~5 minutes)

### 1. Create the database
Supabase dashboard → **SQL Editor**:
- **Fresh database**: run `supabase/schema.sql`, then `supabase/seed.sql`.
- **Already ran the v1 schema**: run `supabase/migration-002.sql` instead.

### 2. Create your admin user
**Authentication → Users → Add user** (enable "Auto confirm user"). That's your `/admin` login.

### 3. Run the app
```bash
npm install
npm run dev
```
`.env.local` is prefilled with your project URL + publishable key. Set
`NEXT_PUBLIC_SITE_URL` to your real domain when you deploy (used for sitemap/OG tags).

- Public site: http://localhost:3000
- CMS: http://localhost:3000/admin

## Features

### Project case studies
Each project can have its own scrollable story page at `/projects/[slug]`:
title, description, tech chips, cover image, then any sequence of content blocks
(headings, paragraphs, images with captions). Manage everything from the
**Projects** tab in the admin — expand a project to edit its fields and its blocks
(add / reorder / delete). The "Case study visible to the public" toggle lets you
keep drafts hidden; slugs are auto-generated from the title if left blank.

### Gallery
Photos open in a fullscreen preview with arrow-key / swipe-through navigation,
captions, and Esc to close.

### SEO
- Per-page titles, descriptions, canonical URLs, and Open Graph / Twitter tags
  generated from your CMS content (profile → home page, each project → its story page)
- `sitemap.xml` (includes every published case study) and `robots.txt`
  (blocks `/admin` and `/api`) generated automatically

### Free-tier cold starts — three layers of protection
Supabase pauses free projects after ~1 week without activity. This template handles it:
1. **Keep-alive cron** — `vercel.json` pings `/api/keepalive` daily (a 1-row query),
   so the project never registers as inactive. Not on Vercel? Enable the included
   GitHub Action (`.github/workflows/keepalive.yml`) instead — it pings Supabase directly.
2. **ISR caching** — public pages are cached and revalidated in the background
   (60s), so visitors get an instant cached page; a brief DB hiccup just means
   they see the last good version.
3. **Bundled fallback snapshot** — if Supabase is truly unreachable, the site
   renders from `lib/fallback.json` instead of showing an empty page. Refresh the
   snapshot from your live content before deploying: `node scripts/export-fallback.mjs`.

## Deploy
Vercel: import the repo, set `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL`. The keep-alive cron
in `vercel.json` is picked up automatically.

## Security notes
- The service-role / secret keys are not used anywhere in this app. Since they were
  shared in chat, rotate them in Supabase → Settings → API.
- All tables: public `SELECT`, authenticated-only writes. Storage (`media` bucket):
  public read, authenticated-only uploads/deletes.
