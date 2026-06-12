-- =============================================================
-- Portfolio CMS schema — run this in the Supabase SQL Editor
-- Project: portfolio-revamped
-- =============================================================

-- ---------- Tables ----------

create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  verified boolean not null default false,
  location text default '',
  headline text default '',              -- e.g. "AI \ Software Engineer \ Content Creator"
  badge_text text default '',            -- e.g. "DICT OpenGov Hackathon 2025 Champion"
  badge_url text default '',
  about text default '',                 -- paragraphs separated by blank lines
  avatar_url text default '',
  email text default '',
  calendly_url text default '',
  blog_url text default '',
  speaking_text text default '',
  updated_at timestamptz not null default now()
);

create table if not exists tech_stack (
  id uuid primary key default gen_random_uuid(),
  category text not null,                -- Frontend / Backend / DevOps & Cloud / ...
  name text not null,
  featured boolean not null default true,
  sort_order int not null default 0
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  url text default '',
  display_url text default '',           -- pretty label e.g. codecred.dev
  published boolean not null default true,
  slug text unique,                      -- enables the /projects/[slug] case-study page
  cover_image_url text default '',
  tech text default '',                  -- comma-separated chips shown on the case study
  featured boolean not null default true,
  sort_order int not null default 0
);

-- Case-study content blocks (heading / text / image), edited in the CMS
create table if not exists project_blocks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  kind text not null default 'text' check (kind in ('heading', 'text', 'image')),
  text text default '',
  image_url text default '',
  caption text default '',
  sort_order int not null default 0
);

create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text default '',
  year_label text default '',
  is_current boolean not null default false,
  sort_order int not null default 0
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text default '',
  url text default '',
  featured boolean not null default true,
  sort_order int not null default 0
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text default '',
  sort_order int not null default 0
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,                -- LinkedIn / GitHub / Instagram / ...
  url text not null,
  sort_order int not null default 0
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text default '',
  sort_order int not null default 0
);

-- Right-column cards/banners (e.g. the "DEVS ONE HUNDRED" access card, PH100 banner)
create table if not exists highlights (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'image' check (kind in ('image', 'access_card')),
  title text default '',                 -- access_card: card title
  subtitle text default '',              -- access_card: role line, e.g. "Founding Member"
  member_name text default '',           -- access_card: name on the card
  image_url text default '',             -- image kind
  link_url text default '',
  sort_order int not null default 0
);

-- ---------- Row Level Security ----------
-- Public (anon) can read everything; only authenticated users can write.

do $$
declare t text;
begin
  foreach t in array array['profile','tech_stack','projects','project_blocks','experiences','certifications',
                           'memberships','social_links','gallery','highlights']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select using (true)', t);
    execute format('drop policy if exists "auth write" on %I', t);
    execute format('create policy "auth write" on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ---------- Storage ----------
-- Public media bucket for avatar, gallery and highlight images.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media auth insert" on storage.objects;
create policy "media auth insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media auth update" on storage.objects;
create policy "media auth update" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media auth delete" on storage.objects;
create policy "media auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
