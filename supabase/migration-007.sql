-- =============================================================
-- Migration 007 — run this in the Supabase SQL Editor
--
-- Adds the "By the numbers" stat strip: a new `stats` table and a matching
-- home-page section (manage rows from the admin's Stats tab). Seeds it with
-- real numbers, led by the NAM Builders internship system — edit or delete
-- them in the admin.
-- =============================================================

create table if not exists stats (
  id uuid primary key default gen_random_uuid(),
  value text not null default '',        -- the big number, e.g. "2,000+"
  label text not null default '',        -- what it counts, e.g. "records digitized"
  sort_order int not null default 0
);

alter table stats enable row level security;
drop policy if exists "public read" on stats;
create policy "public read" on stats for select using (true);
drop policy if exists "auth write" on stats;
create policy "auth write" on stats for all to authenticated using (true) with check (true);

-- Starter rows (only inserted if the table is empty)
insert into stats (value, label, sort_order)
select * from (values
  ('2,000+', 'PWD records digitized', 1),
  ('30', 'barangays mapped via GIS', 2),
  ('0', 'critical defects at turnover', 3),
  ('7', 'projects shipped', 4)
) as seed(value, label, sort_order)
where not exists (select 1 from stats);
