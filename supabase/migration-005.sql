-- =============================================================
-- Migration 005 — run this in the Supabase SQL Editor
--
-- Adds:
--   highlights.hide_label — hide the small "ACCESS CARD" label on an access
--                            card (keeps the title, subtitle, name and logo).
--   profile.accent_color  — a page-wide accent colour (hex, e.g. '#7a0c2e').
--                            Empty = the default black/white theme.
-- =============================================================

alter table highlights add column if not exists hide_label boolean not null default false;
alter table profile    add column if not exists accent_color text default '';
