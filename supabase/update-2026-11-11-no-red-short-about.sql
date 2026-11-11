-- =============================================================
-- Accent back to near-black + a shorter About, 2026-11-11
--   Undoes update-2026-11-11-accent-red.sql: the page accent goes
--   back to #1b1818, so the wallpaper glows, Schedule a Call, links
--   and the open tab are graphite again, not red. (The access card
--   keeps its own red.)
--   About goes from ~230 words to ~80. The detail it dropped already
--   lives in Experience, Projects and Certifications.
-- Run once in the Supabase SQL Editor. Safe to run again.
-- Then: node scripts/export-fallback.mjs
-- =============================================================
update profile set
  accent_color = '#1b1818',
  about = $$I'm a full-stack developer and BS Information Technology graduate of Batangas State University (Business Analytics, Class of 2026). I build the systems small businesses run on.

Right now that's Malaya Villas, whose booking site and back office I built and which has run all ten of its villas since October 1, and PapaFix, a funded home-services marketplace where I'm the founding developer behind the web platform and both mobile apps.

I design what I build, ship through reviewed pull requests, and work mostly in React, TypeScript, React Native, PostgreSQL and Supabase.$$,
  updated_at = now();
