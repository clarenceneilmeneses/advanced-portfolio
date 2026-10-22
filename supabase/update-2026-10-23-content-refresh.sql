-- =============================================================
-- Content refresh — 2026-10-23
--
-- Brings the site in line with the current resumes (v11, 2026-10-22):
--   * About text: Malaya is Freelance (10 villas, live since Oct 1),
--     PapaFix is Contract, Lumea (Shopify) added.
--   * Experience: real dates, Lumea added, PDAO marked as the capstone.
--   * Stats: the Cisco-cert stat (Cisco was dropped from the resumes)
--     becomes "10 villas".
--   * Projects: Malaya points at the live site, PapaFix gets its
--     15 modules / 292 tests, Lumea added, order re-ranked.
--   * Malaya OBS case study rewritten: it said "seven branches",
--     "guests pay by receipt upload" and "Xendit held off", all
--     out of date since the October go-live.
--   * Tech stack: Shopify (Liquid) and Claude Code added.
--
-- No rent, commission or cost figures from the Malaya PRD on purpose.
--
-- Run in: Supabase dashboard -> SQL Editor -> New query -> Run.
-- Then refresh the offline snapshot:  node scripts/export-fallback.mjs
-- Safe to re-run: inserts are guarded, updates are idempotent, and the
-- Malaya case-study blocks are replaced wholesale.
-- =============================================================

begin;

-- -------------------------------------------------------------
-- 1. Profile
-- -------------------------------------------------------------
update profile set
  about = $$I'm a full-stack developer and a BS Information Technology graduate of Batangas State University, major in Business Analytics (Class of 2026).

I build the systems small businesses run on. Right now that's Malaya Villas, a private rental business with ten villas: I built its booking site and staff back office on React, TypeScript, and Supabase, and on October 1 it replaced the owner's spreadsheets for every villa, with Xendit checkout and Airbnb calendar sync so nothing double-books.

I'm also the founding developer of PapaFix, a funded home-services marketplace under NAM Builders Supply Corp. They retained me after my internship, where I built the company's first sales platform, now handling ₱1M+ in monthly sales. On the side I build Shopify stores: custom Liquid product pages and a catalog pipeline for a German beauty brand.

I work across React, TypeScript, PostgreSQL, PHP, Shopify, and REST APIs, and I ship through reviewed pull requests with a test checklist for every change. Google-certified in Analytics and Ads Measurement.$$,
  updated_at = now();

-- -------------------------------------------------------------
-- 2. Experience
-- -------------------------------------------------------------
update experiences set title = 'Full-Stack Developer (Freelance)', organization = 'Malaya Villas',
       year_label = 'Aug 2026 – Present', is_current = true, sort_order = 0
 where id = '9fa8df18-58cd-4c87-bac5-d16c62edfa27';

update experiences set title = 'Founding Developer (Contract)', organization = 'PapaFix · NAM Builders Supply Corp',
       year_label = 'Jun 2026 – Present', is_current = true, sort_order = 1
 where id = '0512438b-5afe-4f59-96c7-0170551c95d5';

insert into experiences (title, organization, year_label, is_current, sort_order)
select 'Shopify Developer (Freelance)', 'Lumea · German beauty e-commerce store', 'Oct 2026', false, 2
 where not exists (select 1 from experiences where title = 'Shopify Developer (Freelance)');

update experiences set year_label = 'Feb – Apr 2026', sort_order = 3
 where id = 'afc47a20-06b9-4085-8413-e4e952c6a233';

update experiences set title = 'Full-Stack Developer (Capstone)', organization = 'PDAO, City of Sto. Tomas',
       year_label = '2025', sort_order = 4
 where id = 'add80698-4687-4efd-a31a-d9018aa9550b';

update experiences set sort_order = 5 where id = 'a5a0a005-55a0-4b9e-95a2-e632d71f8612';  -- BatStateU
update experiences set sort_order = 6 where id = '478dda5c-c1c3-4366-8bc1-39a9ea2bad53';  -- Hello World!

-- -------------------------------------------------------------
-- 3. Stats
-- -------------------------------------------------------------
update stats set value = '10', label = 'villas run on the booking system I built', sort_order = 2
 where id = 'e2e5bd26-eed7-44eb-b0a0-13a08c82f9a1';
update stats set sort_order = 3 where id = '0a48aa4f-ac50-4aa5-9d8d-969eb5bfac2a';  -- 9 projects shipped
update stats set sort_order = 4 where id = '0e1315e8-cf90-49c6-b270-b86db29b7bab';  -- 2,000+ records

-- -------------------------------------------------------------
-- 4. Projects
-- -------------------------------------------------------------
update projects set
  description = 'The booking site and staff back office a ten-villa rental business runs on: bookings, Xendit payments, Airbnb calendar sync, finance and owner P&L. It replaced the owner''s spreadsheets on October 1.',
  url = 'https://malayavillas.com',
  display_url = 'malayavillas.com',
  tech = 'React 19, TypeScript, TanStack Start, TanStack Router, Vite, Tailwind CSS 4, Supabase, PostgreSQL, Row Level Security, Xendit, Airbnb iCal, Claude API, Recharts, Vercel',
  sort_order = 0
 where slug = 'malaya-obs';

update projects set
  description = 'The web platform a funded home-repair marketplace runs on: 15 modules for bookings, technician onboarding, payment settlement, pricing and live dispatch, backed by a 292-case test suite.',
  display_url = 'papafixph.com',
  sort_order = 1
 where slug = 'papafix-admin';

update projects set sort_order = 2 where slug = 'nam-inventory-system';

insert into projects (title, description, url, display_url, published, slug, cover_image_url, tech, featured, sort_order)
select 'Lumea: Shopify Product Pages & Catalog',
       'Custom Liquid product-page templates for a German beauty store, built from conversion research, with the catalog generated through the Shopify Admin API instead of by hand.',
       'https://lumea-de.com', 'lumea-de.com',
       false,   -- no case study yet; flip to true once it has blocks
       'lumea', '',
       'Shopify, Liquid, Python, Shopify GraphQL Admin API, Kaching Bundles',
       true, 3
 where not exists (select 1 from projects where slug = 'lumea');

update projects set sort_order = 4 where slug = 'portfolio-revamped';
update projects set sort_order = 5 where slug = 'lexus-industrial';
update projects set sort_order = 6 where slug = 'nam-landing-page';
update projects set sort_order = 7 where slug = 'pdao-helps';

-- -------------------------------------------------------------
-- 5. Malaya OBS case study (replaced wholesale)
-- -------------------------------------------------------------
delete from project_blocks
 where project_id = (select id from projects where slug = 'malaya-obs');

insert into project_blocks (project_id, kind, text, sort_order)
select p.id, b.kind, b.text, b.ord
  from projects p,
  (values
    (1, 'text', $$Malaya Villas rents out ten private villas, and until this year the business ran on spreadsheets and Messenger threads. In August 2026 I took on Malaya OBS as its developer. What I was handed was a click-through prototype: no database, no login, no public site, and every number invented in the browser. The job was to turn it into the system the company actually runs on.$$),
    (2, 'heading', $$What I built$$),
    (3, 'text', $$A booking website for guests and a back office for staff, on one Supabase Postgres database with row-level security per role. A guest picks dates and pays on the public site; the stay blocks the calendar, the payment lands in Finance, and staff see the next step on the booking page. Around that loop sit the calendar and pricing, an inbox, maintenance, team roles, and the owner's reports.$$),
    (4, 'heading', $$Going live$$),
    (5, 'text', $$On October 1 the system replaced the owner's spreadsheets as the record for all ten villas. Before the switch I imported each villa's booking and cash-flow workbook and reconciled it line by line, and every month since is crosschecked against the sheets, ending in a to-do list for the staff. Guests pay through Xendit checkout, and nine villa calendars sync with Airbnb, so nothing gets double-booked.$$),
    (6, 'heading', $$A database that refuses to be wrong$$),
    (7, 'text', $$Business rules live in constraints, not just TypeScript. Money is numeric, stay dates are calendar dates so Manila bookings never drift a day on a UTC server, and a GiST exclusion constraint makes a double booking physically impossible. A trigger on every table writes an audit log, so every change shows up as a plain sentence: who did what to which booking.$$),
    (8, 'heading', $$Security in the database, not the sidebar$$),
    (9, 'text', $$Staff, owners and guests share the same tables. The sidebar hides tabs and screens refuse actions, but only Postgres policies are the real boundary: a caretaker cannot read the P&L even by calling the API directly. When the owner asked for custom roles, roles became data, so policies check has_permission() instead of naming a role, and staff can be scoped to only the villas they are assigned.$$),
    (10, 'heading', $$Finance built to the owner's own workbooks$$),
    (11, 'text', $$The owner's spreadsheets outranked the spec for Finance, so the module was built to match them cell by cell: per-villa monthly P&L, owner earnings and cash position, with breakdowns that drill down to each receipt. The importers were ported from Python to TypeScript line for line, with a verifier that had to print IDENTICAL before either changed. Payments and expenses only count once a person has verified them.$$),
    (12, 'heading', $$Designed for the people using it$$),
    (13, 'text', $$Eighteen staff use it every day. When some of them missed that an action was a button at all, I gave the interface a small, strict vocabulary: brown for the main step, green to confirm, red to remove, white for everything safe, every clickable word underlined, and a confirmation that names the guest, the amount and the booking code before any one-click approval. Depth comes from shades instead of lines, and related controls sit together in rounded pills. This portfolio now follows the same rules.$$),
    (14, 'heading', $$Payments and AI, kept honest$$),
    (15, 'text', $$Online payments go through Xendit, and the webhook records the payment and confirms the booking in one transaction. Maya, the built-in assistant, is a real Claude call over the figures already on screen. It is never allowed to query the database or calculate a number itself, so it can never disagree with the Finance tab.$$),
    (16, 'heading', $$How I work$$),
    (17, 'text', $$Every change ships through a pull request the owner reviews, with a test checklist that says who checks what, and I recorded a training video for the staff. This is the project where I learned to own a system a business depends on: reading a spec closely enough to find its contradictions, asking the questions only the owner can answer, and refusing to invent a number. It is ongoing.$$)
  ) as b(ord, kind, text)
 where p.slug = 'malaya-obs';

-- -------------------------------------------------------------
-- 6. Tech stack
-- -------------------------------------------------------------
insert into tech_stack (category, name, featured, sort_order)
select 'Frontend', 'Shopify (Liquid)', true, 25
 where not exists (select 1 from tech_stack where name = 'Shopify (Liquid)');

insert into tech_stack (category, name, featured, sort_order)
select 'QA & Tools', 'Claude Code', true, 26
 where not exists (select 1 from tech_stack where name = 'Claude Code');

commit;
