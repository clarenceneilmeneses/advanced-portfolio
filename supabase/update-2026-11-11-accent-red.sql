-- =============================================================
-- Accent colour, 2026-11-11
--   The page accent becomes the access card's red (#d0112b, was the
--   near-black #1b1818). It colours the glass wallpaper behind the
--   cards, Schedule a Call, links and the open tab in the glass bar.
-- Run once in the Supabase SQL Editor, AFTER the wallpaper code is live.
-- Safe to run again. To go back: set accent_color = '#1b1818'.
-- Then: node scripts/export-fallback.mjs
-- =============================================================
update profile set accent_color = '#d0112b';
