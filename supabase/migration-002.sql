-- =============================================================
-- Migration 002 — run this in the Supabase SQL Editor
-- (for the database you already created with schema.sql)
--
-- Adds: project case-study fields + content blocks table
-- Removes: recommendations
-- =============================================================

-- Project case-study fields
alter table projects add column if not exists slug text unique;
alter table projects add column if not exists cover_image_url text default '';
alter table projects add column if not exists tech text default '';        -- comma-separated chips
alter table projects add column if not exists published boolean not null default true;

-- Content blocks for the case-study page (heading / text / image)
create table if not exists project_blocks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  kind text not null default 'text' check (kind in ('heading', 'text', 'image')),
  text text default '',          -- heading text or paragraph body
  image_url text default '',     -- image kind
  caption text default '',       -- image kind
  sort_order int not null default 0
);

alter table project_blocks enable row level security;
drop policy if exists "public read" on project_blocks;
create policy "public read" on project_blocks for select using (true);
drop policy if exists "auth write" on project_blocks;
create policy "auth write" on project_blocks for all to authenticated using (true) with check (true);

-- Backfill slugs for any other existing projects
update projects
set slug = regexp_replace(lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')), '(^-|-$)', '', 'g')
where slug is null;

-- Give the seeded projects slugs + tech so their pages work out of the box
update projects set slug = 'codecred',  tech = 'Next.js, Node.js, PostgreSQL', published = true where title = 'CodeCred' and slug is null;
update projects set slug = 'base404',   tech = 'Laravel, Vue.js, MySQL',        published = true where title = 'BASE404' and slug is null;
update projects set slug = 'diin-ph',   tech = 'Next.js, Python, OpenAI',       published = true where title = 'DIIN.PH' and slug is null;
update projects set slug = 'dynamis',   tech = 'React Native, Supabase',        published = true where title = 'DYNAMIS Workout Tracker' and slug is null;

-- Starter case study for CodeCred (edit/delete freely in the CMS)
insert into project_blocks (project_id, kind, text, sort_order)
select id, 'heading', 'The problem', 1 from projects where slug = 'codecred'
union all
select id, 'text', 'Developers collect skills faster than they can prove them. CodeCred started as a way to issue verifiable, shareable certifications that employers can actually trust.', 2 from projects where slug = 'codecred'
union all
select id, 'heading', 'What I built', 3 from projects where slug = 'codecred'
union all
select id, 'text', 'I designed and shipped the full platform: assessment engine, certificate issuing with public verification pages, and the payment flow. Replace this with your own write-up — add headings, paragraphs and images from the admin panel.', 4 from projects where slug = 'codecred';

-- Recommendations section is gone from the site
drop table if exists recommendations;
