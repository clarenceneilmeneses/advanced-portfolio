-- =============================================================
-- Migration 006 — run this in the Supabase SQL Editor
--
-- Adds two resume links (uploaded PDFs or external URLs). Each shows as its
-- own "Resume" button in the header/footer when set, so you can offer both
-- a development and an analytics resume.
--   profile.resume_dev_url       — development-focused resume
--   profile.resume_analytics_url — analytics-focused resume
-- =============================================================

alter table profile add column if not exists resume_dev_url text default '';
alter table profile add column if not exists resume_analytics_url text default '';
