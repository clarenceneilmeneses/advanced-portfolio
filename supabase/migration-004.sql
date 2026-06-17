-- =============================================================
-- Migration 004 — run this in the Supabase SQL Editor
--
-- Adds: highlights.card_color
--   Lets the access-card background colour be edited in the CMS.
--   Empty = the default dark (zinc → black) gradient.
--   A hex value (e.g. '#7a0c2e') renders as a dark gradient of that hue.
--   The QR icon is replaced by the access card's image_url when one is set,
--   so you can drop in a university / company logo from the admin panel.
-- =============================================================

alter table highlights add column if not exists card_color text default '';
