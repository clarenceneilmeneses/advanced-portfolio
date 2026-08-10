-- =============================================================
-- Profile refresh — graduated  (2026-08-10)
--
-- Moves the site from "student" to "graduate, open to work",
-- refreshes the tech stack so it matches what the repos actually
-- use, and corrects the project count in the stat strip.
--
-- RUN THIS *AFTER* update-case-studies-2026-08.sql.
-- The stat strip below says 9 projects; that only becomes true
-- once the case-study script has added the four new ones.
--
-- Run in: Supabase dashboard -> SQL Editor -> New query -> Run.
-- Safe to re-run.
--
-- Deliberately NOT changed:
--   * highlights.subtitle is "Class of 2026" — that is already
--     correct alumni phrasing, so it stays.
--   * profile.badge_text is empty. It renders as a trophy badge
--     beside your headline, so it suits an award rather than an
--     availability notice. See the optional block at the bottom.
--   * profile.speaking_text ("Open for Inquiries") is a leftover
--     from the original template — no component renders it.
-- =============================================================

begin;

-- -------------------------------------------------------------
-- 1. About — graduate, and openly looking.
--    Paragraphs are separated by a blank line; the site splits
--    on that. Only the opening paragraph changed; the NAM and
--    tooling paragraphs are kept as they were.
-- -------------------------------------------------------------

update profile
set about = 'I''m a full-stack developer and a BS Information Technology graduate of Batangas State University, where I majored in Business Analytics (Class of 2026). I''m open to full-stack development and data analyst roles.

I build systems that replace manual workflows — like the sales platform I built during my internship at NAM Builders Supply Corp, which took the company from spreadsheets to one-click dashboards and now runs ₱1M+ in monthly sales daily. Shipped in PHP/MySQL, later re-architected in React + TypeScript on Supabase.

I work across React, TypeScript, PHP, PostgreSQL, and REST APIs, with a stubborn QA habit — nothing ships without tests. Google-certified in Analytics and Ads Measurement.',
    updated_at = now();


-- -------------------------------------------------------------
-- 2. Experience — the degree is finished.
--    is_current drives the filled marker on the timeline, so
--    leaving it true keeps showing you as enrolled.
-- -------------------------------------------------------------

update experiences
set is_current = false
where organization = 'Batangas State University';


-- -------------------------------------------------------------
-- 3. Tech stack — full replace.
--    The old list was PHP/MySQL/Bootstrap/Figma era and never
--    picked up the stack behind nam-refactored, papafix, civic,
--    lexus, or this portfolio. Every entry below appears in a
--    repo you actually shipped.
--
--    Dropped: Bootstrap (only in the legacy NAM site) and
--    VS Code (an editor, not a skill).
--    All rows are featured = true, matching current behaviour —
--    set any to false to keep it off the home page while still
--    listing it on /tech-stack.
-- -------------------------------------------------------------

delete from tech_stack;

insert into tech_stack (category, name, featured, sort_order) values
  ('Backend & Databases', 'PostgreSQL',           true,  1),
  ('Backend & Databases', 'Supabase',             true,  2),
  ('Backend & Databases', 'PHP',                  true,  3),
  ('Backend & Databases', 'MySQL',                true,  4),
  ('Backend & Databases', 'REST APIs',            true,  5),
  ('Backend & Databases', 'Python',               true,  6),
  ('Frontend',            'React',                true,  7),
  ('Frontend',            'TypeScript',           true,  8),
  ('Frontend',            'Next.js',              true,  9),
  ('Frontend',            'Tailwind CSS',         true, 10),
  ('Frontend',            'JavaScript',           true, 11),
  ('Frontend',            'HTML5',                true, 12),
  ('Frontend',            'CSS3',                 true, 13),
  ('Data & Analytics',    'Power BI',             true, 14),
  ('Data & Analytics',    'SQL',                  true, 15),
  ('Data & Analytics',    'Microsoft Excel',      true, 16),
  ('Data & Analytics',    'Google Analytics',     true, 17),
  ('Data & Analytics',    'Google Ads',           true, 18),
  ('Data & Analytics',    'GIS Mapping',          true, 19),
  ('QA & Tools',          'Git/GitHub',           true, 20),
  ('QA & Tools',          'Vite',                 true, 21),
  ('QA & Tools',          'Vitest',               true, 22),
  ('QA & Tools',          'UAT & System Testing', true, 23),
  ('QA & Tools',          'Figma',                true, 24);


-- -------------------------------------------------------------
-- 4. Stat strip — the project count was stale.
--    It read "5 projects shipped"; the case-study script brings
--    the CMS to 9 published case studies.
-- -------------------------------------------------------------

update stats
set value = '9'
where label = 'projects shipped';

commit;


-- =============================================================
-- OPTIONAL — an "open to work" badge beside your headline.
--
-- badge_text renders as a small pill with a trophy icon next to
-- your name, linking to badge_url. It was built for awards, so
-- an availability notice sits a little oddly in it — but if you
-- want the signal to be visible without reading the About text,
-- uncomment and run this on its own:
--
--   update profile
--   set badge_text = 'Open to Work',
--       badge_url  = 'https://linkedin.com/in/clarenceneilmeneses'
--   where id is not null;
--
-- To remove it later:  update profile set badge_text = '', badge_url = '';
-- =============================================================


-- =============================================================
-- Verify after running:
--
--   select left(about, 140) from profile;
--   select title, organization, year_label, is_current
--     from experiences order by sort_order;
--   select category, count(*) from tech_stack group by category;
--   select value, label from stats order by sort_order;
-- =============================================================
