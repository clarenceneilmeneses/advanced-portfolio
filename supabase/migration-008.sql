-- =============================================================
-- Migration 008 — run this in the Supabase SQL Editor
--
-- Adds a strip video to projects: a short muted clip that loops behind the
-- project's strip in Recent Projects on the home page (the cover photo shows
-- until it plays, and stays for visitors who turn motion off).
--   projects.preview_video_url — an .mp4 path or URL; blank = the photo only
--
-- Sets Malaya OBS's clip, cut from its walkthrough film.
-- =============================================================

alter table projects add column if not exists preview_video_url text default '';

update projects set preview_video_url = '/work/malaya/strip.mp4' where slug = 'malaya-obs';
