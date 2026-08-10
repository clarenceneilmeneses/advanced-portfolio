-- =============================================================
-- Case-study refresh — 2026-08-10
--
-- Rewrites all five existing case studies to match what is
-- actually in the GitHub repos today, and adds four projects
-- that were never in the CMS at all.
--
-- Run in: Supabase dashboard -> SQL Editor -> New query -> Run.
-- Idempotent: every project is deleted and re-inserted, so this
-- is safe to re-run. Blocks cascade on delete.
--
-- WARNING: this replaces project_blocks for all nine projects.
-- Any edits you made in /admin since 2026-06 will be overwritten.
--
-- Publish flags are preserved from the current live state:
--   nam-landing-page -> published = false
--   pdao-helps       -> published = false
-- Flip those to true when you are ready.
-- =============================================================

begin;

-- =============================================================
-- PART 1 — EXISTING PROJECTS, REFRESHED
-- =============================================================

-- -------------------------------------------------------------
-- 1. Portfolio Revamped  (repo: advanced-portfolio)
--
--    Blocks 1, 4 and 11 render corrupted on the live site today
--    ("admin panase", "backed by Sud image Storage", "publish a
--    new projeswap ... I use tokeep"). Repaired here.
--    Tech string pinned to Next.js 14, which is what
--    package.json actually has (next@14.2.5).
-- -------------------------------------------------------------

delete from project_blocks where project_id in (select id from projects where slug = 'portfolio-revamped');
delete from projects where slug = 'portfolio-revamped';

insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('Portfolio Revamped: Portfolio & CMS',
   'A self-hosted portfolio with a built-in admin CMS, where every section is editable without redeploying.',
   'https://clarenceneilmeneses.vercel.app/', 'clarenceneilmeneses.vercel.app',
   'portfolio-revamped',
   'Next.js 14, React, Supabase, PostgreSQL, Tailwind CSS, Vercel',
   'https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1782046657116-screencapture-clarenceneilmeneses-vercel-app-2026-06-21-20_53_07.png',
   true, true, 1);

insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'text', 'I wanted a portfolio I could keep current without touching code or redeploying every time. So I rebuilt mine as a fully content-managed site: every section, from my profile and tech stack to projects, experience, certifications, and gallery, is editable from a private admin panel.', '', '', 1 from projects where slug = 'portfolio-revamped'
union all
select id, 'heading', 'What I built', '', '', 2 from projects where slug = 'portfolio-revamped'
union all
select id, 'image', '', 'https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1782046518337-screencapture-clarenceneilmeneses-vercel-app-admin-2026-06-21-20_54_46.png', 'The admin CMS, where I edit and reorder every section of the live site.', 3 from projects where slug = 'portfolio-revamped'
union all
select id, 'text', 'I built it on Next.js 14 with the App Router and Tailwind CSS, backed by Supabase for Postgres, Auth, and image Storage. The admin lives at /admin behind Supabase Auth, and I deliberately kept all secret keys out of the app. Every write is gated by row-level security, so the public site only ever uses the publishable key.', '', '', 4 from projects where slug = 'portfolio-revamped'
union all
select id, 'heading', 'Everything is editable', '', '', 5 from projects where slug = 'portfolio-revamped'
union all
select id, 'text', 'There are no hard-coded sections. I manage projects, work history, skills, certifications, social links, and gallery photos directly in the CMS, with drag-and-drop reordering. Slugs are generated automatically, drafts stay hidden until I publish, and changes appear on the live site within seconds.', '', '', 6 from projects where slug = 'portfolio-revamped'
union all
select id, 'heading', 'The challenge: free-tier cold starts', '', '', 7 from projects where slug = 'portfolio-revamped'
union all
select id, 'text', 'Supabase pauses free projects after about a week of inactivity, which would leave a portfolio loading slowly or blank. I solved this in three layers: a daily keep-alive cron that pings a lightweight endpoint so the project never registers as idle, ISR caching so visitors always get an instant cached page, and a bundled fallback snapshot that renders the site from local content if the database is ever truly unreachable.', '', '', 8 from projects where slug = 'portfolio-revamped'
union all
select id, 'heading', 'SEO that maintains itself', '', '', 9 from projects where slug = 'portfolio-revamped'
union all
select id, 'text', 'Per-page titles, descriptions, canonical URLs, and Open Graph and Twitter tags are generated from the same CMS content. A sitemap that includes every published case study and a robots.txt are produced automatically, so my SEO stays correct as I add new work, with no manual upkeep.', '', '', 10 from projects where slug = 'portfolio-revamped'
union all
select id, 'text', 'The result is the site you are viewing right now. I can publish a new project or swap an image in seconds, with no deploy and no downtime. It is the foundation I use to keep my entire portfolio current.', '', '', 11 from projects where slug = 'portfolio-revamped';


-- -------------------------------------------------------------
-- 2. NAM Builders Supply Corp — Sales & Inventory Platform
--    (repos: nam-refactored, sales_dashboard)
--
--    Full rewrite. The live version still describes a PHP-only
--    inventory tool and claims a revenue increase. The repo is
--    now a React 19 + TypeScript SPA on Supabase with 24
--    migrations, nine documented modules, and Vitest coverage
--    over the money math.
-- -------------------------------------------------------------

delete from project_blocks where project_id in (select id from projects where slug = 'nam-inventory-system');
delete from projects where slug = 'nam-inventory-system';

insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('NAM Builders Supply Corp — Sales & Inventory Platform',
   'The company''s first sales system — quotations, inventory, and finance in one place, now running ₱1M+ in monthly operations.',
   'https://nam-internal.org/', 'nam-internal.org',
   'nam-inventory-system',
   'React 19, TypeScript, Vite, Supabase, PostgreSQL, TanStack Query, Tailwind CSS, Recharts, Vitest, PHP, MySQL',
   'https://i.imgur.com/9Ook8yd.png',
   true, true, 2);

insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'text', 'NAM Builders Supply Corp was running a building-supply business on spreadsheets. Quotations were typed by hand, sales lived in one workbook and inventory in another, and putting a single report in front of management meant a week of chasing files across departments. I joined as an IT intern for a 500-hour internship and built the company its first real system.', '', '', 1 from projects where slug = 'nam-inventory-system'
union all
select id, 'heading', 'What I built', '', '', 2 from projects where slug = 'nam-inventory-system'
union all
select id, 'text', 'I replaced the spreadsheet workflow with one platform covering quotations, sales entry, the sales ledger, products and stock, finance, logistics, and bulk imports. It is now used daily by staff to run over ₱1M in monthly sales operations. The goal was never to digitise the spreadsheets — it was to make the numbers agree with each other for the first time.', '', '', 3 from projects where slug = 'nam-inventory-system'
union all
select id, 'image', '', 'https://i.imgur.com/EuIy8Ht.png', 'The executive dashboard — sales performance and key metrics in one view, replacing a week of manual compilation.', 4 from projects where slug = 'nam-inventory-system'
union all
select id, 'heading', 'Quotation to sale', '', '', 5 from projects where slug = 'nam-inventory-system'
union all
select id, 'text', 'The core workflow moves a quotation through drafting and approval into a confirmed sale, deducting stock as it goes. Quotations print in the company''s existing formal document format, so staff did not have to change how they present to clients, and a quote can be converted partially when a client only takes some of the line items. Deliveries carry their own DR numbers through logistics, and finance tracks receivables against payment status.', '', '', 6 from projects where slug = 'nam-inventory-system'
union all
select id, 'image', '', 'https://i.imgur.com/7hpDunP.png', 'Inventory management — centralized supplier pricing with bulk CSV import.', 7 from projects where slug = 'nam-inventory-system'
union all
select id, 'heading', 'Numbers that reconcile', '', '', 8 from projects where slug = 'nam-inventory-system'
union all
select id, 'text', 'On top of the operational data I built a reporting layer: an executive view with cross-filtering drilldowns by company, category, and account manager. The hard part was trust, not charts. I wrote the pricing and margin logic — income, markup and margin solvers, withholding tax, and the formal-document arithmetic — as a unit-tested calculation engine, so that what the dashboard shows reconciles with what finance calculates by hand.', '', '', 9 from projects where slug = 'nam-inventory-system'
union all
select id, 'heading', 'Re-architecting on Postgres', '', '', 10 from projects where slug = 'nam-inventory-system'
union all
select id, 'text', 'The system shipped first in PHP and MySQL. I later re-architected it as a React and TypeScript single-page app on Supabase, which meant moving years of live production data without losing any of it. I wrote the migration myself: a converter that reads the legacy MySQL dump, scrubs currency-formatted values back into numerics, normalises malformed and zero dates, and corrects timezone handling that would otherwise have shifted historical records by a day. A Legacy Restore screen inside the app lets that import be re-run and checked rather than trusted blindly.', '', '', 11 from projects where slug = 'nam-inventory-system'
union all
select id, 'heading', 'Who can see what', '', '', 12 from projects where slug = 'nam-inventory-system'
union all
select id, 'text', 'Several departments touch the same record, so access is a first-class feature rather than a checkbox. Roles and per-privilege gates are defined in the database and enforced by row-level security, account managers are assigned to the companies they handle, sessions are limited to one active login per account, and an activity log records who changed what. The frontend only ever holds the publishable key.', '', '', 13 from projects where slug = 'nam-inventory-system'
union all
select id, 'text', 'I finished the internship with a full handover — per-module technical documentation plus training, so staff could run their own reporting without me. The system stayed in daily use after I left, which is the part I judge it by.', '', '', 14 from projects where slug = 'nam-inventory-system';


-- -------------------------------------------------------------
-- 3. NAM Builders Supply Corp — Official Website
--    (repo: nam-landing-page)
--
--    Full rewrite in the same voice as the platform case study.
--    published stays FALSE, matching the current live state.
-- -------------------------------------------------------------

delete from project_blocks where project_id in (select id from projects where slug = 'nam-landing-page');
delete from projects where slug = 'nam-landing-page';

insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('NAM Builders Supply Corp — Official Website',
   'A public company site backed by a custom CMS, so staff can keep it current without a developer.',
   'https://nambuildersandsupplycorp.com/', 'nambuildersandsupplycorp.com',
   'nam-landing-page',
   'PHP, MySQL, JavaScript, Bootstrap, HTML5, CSS3',
   'https://i.imgur.com/I5algSI.png',
   true, false, 3);

insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'text', 'With the internal system in place, NAM still had no public presence — clients found them by word of mouth or by walking in. They needed a site that showed their materials and services, and more importantly one they could keep current themselves. A static page would have been out of date within a month.', '', '', 1 from projects where slug = 'nam-landing-page'
union all
select id, 'image', '', 'https://i.imgur.com/ANs0s1j.jpeg', 'The public site — product categories, services, and company information.', 2 from projects where slug = 'nam-landing-page'
union all
select id, 'heading', 'A CMS, not a static site', '', '', 3 from projects where slug = 'nam-landing-page'
union all
select id, 'text', 'So I built the site on a custom content management system in PHP and MySQL rather than hard-coding the pages. The front end is a responsive Bootstrap layout — hero, company profile, a services gallery, and a continuously scrolling client carousel — but every one of those sections reads from the database. Staff sign in to a secure admin dashboard and manage services, clients, business statistics, and incoming enquiries directly. Nobody needs to touch code, and nobody needs to call me to change a price list.', '', '', 4 from projects where slug = 'nam-landing-page'
union all
select id, 'image', '', 'https://i.imgur.com/PxRGLfT.png', 'The admin dashboard where staff manage site content and client messages.', 5 from projects where slug = 'nam-landing-page'
union all
select id, 'text', 'Building the admin side was the real work — session-guarded login, input validation on every write, image upload and replacement for services and client logos, and an editing flow simple enough that non-technical staff would actually use it rather than reverting to phone calls. Contact-form submissions land in the same dashboard, so an enquiry is a record to work through rather than an email someone might miss.', '', '', 6 from projects where slug = 'nam-landing-page'
union all
select id, 'image', '', 'https://i.imgur.com/Ygerhu2.png', 'Content updates writing straight to the database and appearing live on the site.', 7 from projects where slug = 'nam-landing-page'
union all
select id, 'text', 'The site is deployed as the company''s primary online presence, and staff update it themselves. Paired with the internal sales platform, it means both sides of the business — what clients see and what the company runs on — are systems the company owns rather than documents they maintain by hand.', '', '', 8 from projects where slug = 'nam-landing-page';


-- -------------------------------------------------------------
-- 4. PapaFix — Service Marketplace Admin Panel  (repo: papafix)
--
--    The existing write-up is strong and is kept almost intact.
--    Added: the money surface (pricing engine, payment
--    verification, QR codes) and the access/reports layer, both
--    of which shipped after the case study was written.
--    Fixed display_url, which pointed at papafix-admin.com while
--    url points at papafix.vercel.app.
-- -------------------------------------------------------------

delete from project_blocks where project_id in (select id from projects where slug = 'papafix-admin');
delete from projects where slug = 'papafix-admin';

insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('PapaFix — Service Marketplace Admin Panel',
   'A real-time admin, pricing, and analytics dashboard for an on-demand home-repair marketplace in the Philippines.',
   'https://papafix.vercel.app/', 'papafix.vercel.app',
   'papafix-admin',
   'React, Vite, Supabase, PostgreSQL, Edge Functions, Leaflet, Recharts',
   'https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1781685024610-screencapture-papafix-vercel-app-2026-06-17-15_59_01.png',
   true, true, 4);

insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'text', 'PapaFix is an on-demand home-repair marketplace for the Philippines: customers book electricians, plumbers, and aircon technicians from one mobile app, while technicians accept and complete those jobs from another. Both apps write to a single Supabase Postgres database, but the business had no way to actually oversee the operation — which jobs were stalling, which payments hadn''t cleared, where technicians were in the field, or whether a record had been quietly altered. I built the admin panel that sits over all of it: the control room for the entire platform.', '', '', 1 from projects where slug = 'papafix-admin'
union all
select id, 'heading', 'What I built', '', '', 2 from projects where slug = 'papafix-admin'
union all
select id, 'text', 'I designed and developed a dark-mode admin panel in React and Supabase that reads, oversees, and corrects everything the two mobile apps generate. The customer app, the technician app, and this panel all share one Postgres database — the apps own the operational writes, and the panel is the layer that gives the business visibility and control over them. It is locked to admin accounts only, enforced not just in the UI but by Postgres row-level security, so it holds full oversight without ever shipping a service key to the browser.', '', '', 3 from projects where slug = 'papafix-admin'
union all
select id, 'heading', 'Day-to-day operations', '', '', 4 from projects where slug = 'papafix-admin'
union all
select id, 'image', '', 'https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1781685086690-screencapture-papafix-vercel-app-2026-06-17-16_31_15.png', 'The Profiles tab managing customers, technicians, and admins, with role filters and server-side user creation.', 5 from projects where slug = 'papafix-admin'
union all
select id, 'text', 'The management tabs cover the operational core. I built full create-read-update-delete for user profiles — searchable and role-filtered across customers, technicians, and admins, with base location, service categories and service radius for technicians — and routed account creation and email changes through a secure server-side Edge Function so the service key never touches the browser. Bookings get the same treatment with status, category, payment, and date filters plus a full detail view down to the inspection checklist and on-site QR token. Alongside these sit saved customer locations with inline map previews, a technician availability scheduler with per-slot toggles, and a support-ticket queue with status and priority.', '', '', 6 from projects where slug = 'papafix-admin'
union all
select id, 'heading', 'Seeing the field in real time', '', '', 7 from projects where slug = 'papafix-admin'
union all
select id, 'text', 'Because technicians work in the field, the panel tracks them in real time. The Live Map renders every technician on an interactive Leaflet map — green when online, grey when offline — alongside the blue pins of active customer job sites, and it auto-refreshes on its own. A companion Tech Locations view lists each technician''s last-known coordinates and how long ago they reported in, for when I need the data as a table rather than a map.', '', '', 8 from projects where slug = 'papafix-admin'
union all
select id, 'image', '', 'https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1781685154894-screencapture-papafix-vercel-app-2026-06-17-16_01_10.png', 'The Live Map tracking technicians (online and offline) and customer job sites in real time across Batangas.', 9 from projects where slug = 'papafix-admin'
union all
select id, 'heading', 'Pricing and getting paid', '', '', 10 from projects where slug = 'papafix-admin'
union all
select id, 'text', 'A marketplace is only as trustworthy as its prices, so the panel owns them outright. I built a pricing surface where an admin sets the aircon price grid and per-category base prices, then layers on the add-on admin fee, VAT, and distance-banded travel-fee tiers — the same numbers the customer app quotes upfront, edited in one place instead of hard-coded in an app release. Payment is the other half: a verification queue moves jobs through awaiting, paid, and unpaid, with cash-proof photos reviewed and rejected with a reason, and settlement handled by a dedicated Edge Function rather than a client-side write. A separate tab manages the GCash, Maya, and bank QR codes customers actually pay against.', '', '', 11 from projects where slug = 'papafix-admin'
union all
select id, 'heading', 'Analytics and insight', '', '', 12 from projects where slug = 'papafix-admin'
union all
select id, 'text', 'The Overview dashboard is the at-a-glance health check: headline KPIs against the previous period, a bookings-and-revenue trend, demand patterns by hour and weekday, a top-technicians leaderboard, a per-city revenue split with an adjustable manager-share percentage, and a needs-attention queue that surfaces stale jobs, unpaid completed work, and low ratings. The Analytics tab goes deeper, with drill-downs by category, status, and payment, and a technician ranking where clicking one bar cross-filters every chart on the page. Both started out pulling thousands of raw booking rows into the browser to crunch client-side, which doesn''t scale — so I moved all of that aggregation into PostgreSQL functions that return pre-summarised JSON, backed by targeted indexes and server-side pagination so the panel stays responsive into the hundreds of thousands of rows.', '', '', 13 from projects where slug = 'papafix-admin'
union all
select id, 'image', '', 'https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1781685210658-screencapture-papafix-vercel-app-2026-06-17-16_03_12.png', 'The Analytics tab with a technician selected — one click cross-filters every chart on the page.', 14 from projects where slug = 'papafix-admin'
union all
select id, 'heading', 'Oversight and integrity', '', '', 15 from projects where slug = 'papafix-admin'
union all
select id, 'text', 'Oversight only means something if the records can be trusted. The audit trail records every booking and payment event the moment a row changes — created, status moved, technician reassigned, payment captured, fee adjusted — written by Postgres triggers through a SECURITY DEFINER function under row-level security with no update or delete policy, so even an admin can''t forge or erase one. I deliberately scoped it to the facts that change a record rather than taps, locations, or message contents: a complete paper trail without surveilling users. A separate activity log captures what admins themselves do inside the panel, keeping the two concerns cleanly apart.', '', '', 16 from projects where slug = 'papafix-admin'
union all
select id, 'image', '', 'https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1781685276643-screencapture-papafix-vercel-app-2026-06-17-16_23_37.png', 'The append-only audit trail, with every booking and payment event recorded server-side by database triggers.', 17 from projects where slug = 'papafix-admin'
union all
select id, 'text', 'Admin itself is tiered rather than all-or-nothing: a roles-and-access screen, reachable only by a super admin, decides which admins can touch pricing, payments, or accounts. Beside it sits a user-reports queue where misconduct reports filed in either direction — customer against technician, or technician against customer — are triaged, so the same trail that protects the records also protects the people using them.', '', '', 18 from projects where slug = 'papafix-admin'
union all
select id, 'heading', 'Conclusion', '', '', 19 from projects where slug = 'papafix-admin'
union all
select id, 'text', 'PapaFix is the project where I owned an entire operational surface end to end — from the React interface down to the Postgres triggers, RPCs, row-level security policies, and the Edge Functions that keep privileged work off the client. The throughline was building for scale and trust: aggregate on the server so it holds up as the data grows, and push integrity into the database where it can''t be bypassed. It is the clearest example of how I think about full-stack work — that the hard guarantees belong close to the data, and the browser is just an untrusted client looking in.', '', '', 20 from projects where slug = 'papafix-admin';


-- -------------------------------------------------------------
-- 5. PDAO Helps  (repo: pwd-portal)
--
--    Shortens the very long title, rewrites the opening and
--    closing, and keeps the middle blocks, which are accurate.
--    published stays FALSE, matching the current live state.
-- -------------------------------------------------------------

delete from project_blocks where project_id in (select id from projects where slug = 'pdao-helps');
delete from projects where slug = 'pdao-helps';

insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('PDAO Helps: PWD Services & Data Management System',
   'A constituent-services portal for a city PWD affairs office — ID applications, appointments, and demographic mapping across 30 barangays.',
   '', '',
   'pdao-helps',
   'PHP, MySQL, JavaScript, Leaflet.js, Chart.js, GIS Mapping, Web Accessibility',
   'https://i.imgur.com/iD0KcsF.jpeg',
   true, false, 5);

insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'text', 'The Persons with Disability Affairs Office of Sto. Tomas ran on paper. Every ID application, renewal, and appointment for the city''s roughly 4,000 registered PWDs moved through physical forms and in-person visits, so constituents travelled to the office just to check a status and staff had no way to see the data as a whole. I built this portal as my capstone project, under a memorandum of agreement with the city government.', '', '', 1 from projects where slug = 'pdao-helps'
union all
select id, 'image', '', 'https://i.imgur.com/zhuQrSq.png', 'The public-facing portal featuring a custom-built accessibility widget for inclusive navigation.', 2 from projects where slug = 'pdao-helps'
union all
select id, 'text', 'A core requirement was ensuring the platform was truly usable by its target audience. I engineered a dedicated Accessibility Widget that allows users to toggle High Contrast Mode, Grayscale, and Dyslexia-Friendly fonts without relying on third-party overlays. This required writing extensive CSS overrides and JavaScript handlers to dynamically manipulate the DOM in real-time.', '', '', 3 from projects where slug = 'pdao-helps'
union all
select id, 'image', '', 'https://i.imgur.com/T1QKCvh.png', 'The multi-step application form that handles personal data, document uploads, and scheduling.', 4 from projects where slug = 'pdao-helps'
union all
select id, 'text', 'The system features a comprehensive backend to handle PWD ID applications and appointment bookings. I implemented a secure file upload system for sensitive documents (like medical certificates) and a scheduling algorithm that prevents overbooking by checking daily slot limits against the database. Applicants receive a unique reference number to track their status online, reducing the need for physical follow-ups.', '', '', 5 from projects where slug = 'pdao-helps'
union all
select id, 'image', '', 'https://i.imgur.com/Fz9LVlL.png', 'The administrative command center providing real-time insights into application processing and daily schedules.', 6 from projects where slug = 'pdao-helps'
union all
select id, 'text', 'To assist local government in resource allocation, I built a GIS (Geographic Information System) module using Leaflet.js. This feature visualizes the distribution of PWDs across different barangays using interactive markers and choropleth layers. It allows officials to filter data by disability type or status, identifying specific areas that may require targeted medical missions or support programs.', '', '', 7 from projects where slug = 'pdao-helps'
union all
select id, 'image', '', 'https://i.imgur.com/Tr2BXpY.png', 'Interactive geospatial map helping administrators visualize PWD density across barangays.', 8 from projects where slug = 'pdao-helps'
union all
-- TODO: this image has no caption on the live site. Add one describing what it shows,
--       or delete this block if it is redundant.
select id, 'image', '', 'https://i.imgur.com/YCqK1Ot.png', '', 9 from projects where slug = 'pdao-helps'
union all
select id, 'text', 'The Analytics module transforms raw database records into actionable insights. Using Chart.js, I created dynamic visualizations for demographic data, including age distribution, gender, and employment status. The system also generates printable PDF reports, automating what used to be a tedious manual compilation process for monthly reporting.', '', '', 10 from projects where slug = 'pdao-helps'
union all
select id, 'text', 'I verified the system through structured testing and UAT with office staff before turnover. Throughout development and every demo, the database held synthetic records I generated to match the city''s real per-barangay PWD counts — realistic enough to prove the reporting worked, without a single real constituent record ever leaving the office. It was handed over as a system the staff could run themselves.', '', '', 11 from projects where slug = 'pdao-helps';


-- =============================================================
-- PART 2 — NEW PROJECTS FROM GITHUB
--
-- These four are live and deployed but were never in the CMS.
-- They have no screenshots yet: cover_image_url is empty and
-- `-- TODO` comments mark where image blocks belong. Add the
-- screenshots through /admin once you have them — the block
-- editor is easier than re-running SQL.
-- =============================================================

-- -------------------------------------------------------------
-- 6. Lexus Industrial  (repo: lexus)
-- -------------------------------------------------------------

delete from project_blocks where project_id in (select id from projects where slug = 'lexus-industrial');
delete from projects where slug = 'lexus-industrial';

insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('Lexus Industrial — Catalog Website & CMS',
   'A production catalog site with a role-secured admin dashboard, so staff manage the product range themselves.',
   'https://lexus-sand.vercel.app', 'lexus-sand.vercel.app',
   'lexus-industrial',
   'React, TypeScript, Vite, Supabase, PostgreSQL, Tailwind CSS, GSAP',
   -- TODO: add a cover screenshot URL
   '',
   true, true, 6);

insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'text', 'A product catalog is the worst possible thing to hard-code. The range changes, prices move, photos get replaced — and if every one of those edits needs a developer and a deploy, the site is out of date within weeks and the business stops trusting it. So the brief was less "build a website" than "build something the staff can own".', '', '', 1 from projects where slug = 'lexus-industrial'
union all
select id, 'heading', 'What I built', '', '', 2 from projects where slug = 'lexus-industrial'
union all
select id, 'text', 'I built the public site and its admin dashboard as one React and TypeScript application on Supabase. Visitors get a catalog with product listings and detail pages, services, company information, and an enquiry form. Staff sign in to an admin area covering products with image upload, categories, the enquiries that come in through the site, editable page content, user accounts, and settings — no developer in the loop, no redeploy.', '', '', 3 from projects where slug = 'lexus-industrial'
union all
-- TODO: image block — the public catalog / product detail page
select id, 'heading', 'Three tiers of access', '', '', 4 from projects where slug = 'lexus-industrial'
union all
select id, 'text', 'Not everyone who edits the site should be able to create logins for it, so I modelled access as three roles rather than a single admin flag: admin, editor, and viewer. The distinction is enforced by row-level security in Postgres, not by hiding buttons — an editor who forged a request would still be refused by the database. Creating and deleting login accounts genuinely needs a privileged key, so I moved that into a Supabase Edge Function that checks the caller is an admin before it acts, which keeps the service key on the server where it belongs.', '', '', 5 from projects where slug = 'lexus-industrial'
union all
-- TODO: image block — the admin dashboard
select id, 'heading', 'Finding things', '', '', 6 from projects where slug = 'lexus-industrial'
union all
select id, 'text', 'An industrial catalog is only useful if you can find the one part you came for. I used Postgres full-text search rather than filtering in the browser, so the work happens where the data is and search keeps up as the catalog grows. Product images live in their own storage bucket with its own policies, and every query in the app goes through a single typed API layer, so the shape of the data is checked at compile time instead of discovered in production.', '', '', 7 from projects where slug = 'lexus-industrial'
union all
select id, 'text', 'What I like about this one is how boring it became to maintain. The catalog stays current because the people who actually know the products are the ones editing it, and the security model means handing someone a login is a low-stakes decision rather than a risk.', '', '', 8 from projects where slug = 'lexus-industrial';


-- -------------------------------------------------------------
-- 7. Batangas Youth Civic Hub  (repo: civic)
-- -------------------------------------------------------------

delete from project_blocks where project_id in (select id from projects where slug = 'batangas-youth-civic-hub');
delete from projects where slug = 'batangas-youth-civic-hub';

insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('Batangas Youth Civic Hub',
   'An e-civic portal putting local government activities, legislation, and services in one place for Batangas City youth.',
   'https://civic-puce.vercel.app', 'civic-puce.vercel.app',
   'batangas-youth-civic-hub',
   'Next.js 14, TypeScript, Supabase, PostgreSQL, Tailwind CSS, Tiptap',
   -- TODO: add a cover screenshot URL
   '',
   true, true, 7);

insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'text', 'Local government information in the Philippines is scattered across Facebook posts, PDF attachments, and physical bulletin boards. For young people the practical effect is simple: they do not know what their city actually offers them, or how to take part in it. I built the Batangas Youth Civic Hub as a research initiative in partnership with the University of Batangas — one place where a student can find out what is happening and how to engage with it.', '', '', 1 from projects where slug = 'batangas-youth-civic-hub'
union all
select id, 'heading', 'What I built', '', '', 2 from projects where slug = 'batangas-youth-civic-hub'
union all
select id, 'text', 'The site pulls news, upcoming events, local legislation, a directory of officials, emergency hotlines, and youth proposals from a single Postgres database, and surfaces what is coming up rather than what was posted most recently. I built it on Next.js 14 with the App Router and TypeScript, which means each of those sections renders on the server with its own metadata — the pages are shareable and indexable, which matters when the thing you are competing with is a Facebook post.', '', '', 3 from projects where slug = 'batangas-youth-civic-hub'
union all
-- TODO: image block — the public homepage
select id, 'heading', 'A CMS the office can run', '', '', 4 from projects where slug = 'batangas-youth-civic-hub'
union all
select id, 'text', 'A civic site nobody updates is worse than no site at all, so the CMS was not an afterthought. Content is written in a Tiptap rich-text editor inside a private admin area, with separate storage buckets for images and for documents, since a lot of local legislation only exists as a PDF. Sign-in works by email or Google, and a single role column is the only thing separating a reader from an editor — promoted in the database, enforced by row-level security, not by the interface.', '', '', 5 from projects where slug = 'batangas-youth-civic-hub'
union all
-- TODO: image block — the /admin CMS
select id, 'heading', 'Designed to be read', '', '', 6 from projects where slug = 'batangas-youth-civic-hub'
union all
select id, 'text', 'I gave it a custom map-poster design system in Tailwind rather than reaching for a component library. Government sites tend to look either intimidating or improvised, and neither invites an eighteen-year-old to read a piece of legislation. Treating the city as a place worth putting on a poster made the tone right, and building the tokens myself kept the whole thing light enough to load quickly on a phone over mobile data.', '', '', 7 from projects where slug = 'batangas-youth-civic-hub'
union all
select id, 'text', 'The build ships with a full seed dataset whose event dates are relative to the current time, so the demo always shows something upcoming — a small thing that makes a research prototype presentable on any day, to anyone. It is the project where I most clearly built for a reader who did not ask for it, and that shaped every decision from the routing down to the type.', '', '', 8 from projects where slug = 'batangas-youth-civic-hub';


-- -------------------------------------------------------------
-- 8. Antiguo Store  (repo: clothing)
-- -------------------------------------------------------------

delete from project_blocks where project_id in (select id from projects where slug = 'antiguo-store');
delete from projects where slug = 'antiguo-store';

insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('Antiguo Store — Streetwear Storefront & Admin',
   'A full e-commerce storefront with a back office, so a clothing brand can run its own catalog, orders, and shipping.',
   'https://clothing-navy-phi.vercel.app', 'clothing-navy-phi.vercel.app',
   'antiguo-store',
   'React, Vite, Supabase, PostgreSQL, React Router',
   -- TODO: add a cover screenshot URL
   '',
   true, true, 8);

insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'text', 'Small clothing brands in the Philippines mostly sell through direct messages. Sizes, stock, shipping fees, and who has actually paid all live in a chat thread and somebody''s memory, and the whole thing quietly falls apart the moment a drop does well. I built Antiguo a real storefront — and, more importantly, the back office behind it.', '', '', 1 from projects where slug = 'antiguo-store'
union all
select id, 'heading', 'What I built', '', '', 2 from projects where slug = 'antiguo-store'
union all
select id, 'text', 'The storefront and the admin are one React application on Supabase. Customers register an account, browse collections, and check out; their delivery details are remembered between orders, and their full order history sits at /account. Requiring an account before checkout was a deliberate choice — it turns a repeat buyer into a record the brand can actually recognise, which is exactly what selling over DMs never gave them.', '', '', 3 from projects where slug = 'antiguo-store'
union all
-- TODO: image block — the storefront homepage
select id, 'heading', 'The back office', '', '', 4 from projects where slug = 'antiguo-store'
union all
select id, 'text', 'The admin is where the real work went. Orders move through pending, paid, shipped, and done, with cancellation as its own state. Customers are listed with their order count and total spent. Products support full editing with image upload, where the first photo is the card and the second is the hover, alongside sizes, compare-at pricing, and sold-out and visibility flags. Collections can be promoted to homepage sections, the hero slideshow is uploadable and reorderable, shipping rates by region drive the actual checkout fee, and each garment gets its own size chart. Nothing about the store is a code change.', '', '', 5 from projects where slug = 'antiguo-store'
union all
-- TODO: image block — the admin: orders or products
select id, 'heading', 'Security in the database, not the UI', '', '', 6 from projects where slug = 'antiguo-store'
union all
select id, 'text', 'This is a storefront, so the frontend ships only the publishable key and every guarantee lives underneath it. Only accounts flagged as admin in the profiles table can reach the admin area or modify catalog data, and that is enforced by row-level security in Postgres — hiding the route would not have been protection, it would have been decoration. Customers can read the catalog and their own orders, and nothing else.', '', '', 7 from projects where slug = 'antiguo-store'
union all
select id, 'text', 'One honest limitation: there is no online payment gateway yet. Checkout records the method as GCash, bank transfer, or cash on delivery, and an admin marks the order paid once it clears. That was intentional — those are the rails the brand already collects on, and the problem worth solving first was the manual tracking around them, not the payment itself. Adding a gateway later is a change to one step, not to the system.', '', '', 8 from projects where slug = 'antiguo-store';


-- -------------------------------------------------------------
-- 9. Daydream  (repo: daydream)
-- -------------------------------------------------------------

delete from project_blocks where project_id in (select id from projects where slug = 'daydream-research-app');
delete from projects where slug = 'daydream-research-app';

insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('Daydream — Emotional Regulation Research App',
   'A research prototype for a Senior High School study on daydreaming, with server-side scoring, a peer forum, and a support chatbot.',
   'https://daydream-mu.vercel.app', 'daydream-mu.vercel.app',
   'daydream-research-app',
   'React, TypeScript, Vite, Supabase, PostgreSQL, Edge Functions, Recharts, Tailwind CSS',
   -- TODO: add a cover screenshot URL
   '',
   true, true, 9);

insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'text', 'A Senior High School research team was studying how students use daydreaming to regulate emotion, and where that tips over into something harmful. Paper questionnaires would have given them one snapshot per participant and nothing to demonstrate. I built them a working prototype instead. The participants are minors and the subject is mental health, which meant the constraints mattered a great deal more than the feature list.', '', '', 1 from projects where slug = 'daydream-research-app'
union all
select id, 'heading', 'Not a diagnostic tool', '', '', 2 from projects where slug = 'daydream-research-app'
union all
select id, 'text', 'The first decision was what the app must never claim. It is a research prototype, and it says so on every assessment and results screen; a result is shown as a band with guidance, never as a diagnosis. The second decision followed from the timeline — the validated instrument does not arrive until next school year, so the questions, the likert options, their weights, and the severity bands are all rows in the database rather than values in the code. When the real questionnaire lands, the team swaps the data. Nobody has to touch the frontend.', '', '', 3 from projects where slug = 'daydream-research-app'
union all
-- TODO: image block — the assessment flow, one question per screen
select id, 'heading', 'Scoring on the server', '', '', 4 from projects where slug = 'daydream-research-app'
union all
select id, 'text', 'Scoring runs entirely in a Postgres function, so the browser never computes or submits a score — it submits answers and asks the database what they came to. Each answer is upserted against the attempt as the participant goes, which means someone can close the tab and pick the assessment back up rather than starting over. Results render as a semicircle gauge built in Recharts, with the severity bands drawn in their own colours and past attempts listed underneath, so repeat measurement over the study period is visible at a glance.', '', '', 5 from projects where slug = 'daydream-research-app'
union all
-- TODO: image block — the results gauge with severity bands
select id, 'heading', 'A forum and a chatbot', '', '', 6 from projects where slug = 'daydream-research-app'
union all
select id, 'text', 'Around the assessment sit two things the study wanted for engagement. The forum runs on Supabase Realtime, so threads and comments appear without a refresh, with row-level security ensuring people can only edit their own posts and a pinned guidelines banner setting the tone. The chatbot, Haraya, runs inside a Supabase Edge Function so the API key stays server-side, and it falls back to rule-based replies when no key is configured — which means the team can demo it at zero cost and switch on the model only when they need to. Its footer says plainly that it is not a counselor, and lists the national crisis line.', '', '', 7 from projects where slug = 'daydream-research-app'
union all
select id, 'heading', 'Ethics as an architecture problem', '', '', 8 from projects where slug = 'daydream-research-app'
union all
select id, 'text', 'Because participants are minors, I enabled anonymous sign-in so nobody has to hand over an email address to take part in a school study, and put a consent notice before the assessment stating that participation is voluntary and can be stopped at any time. Every table is behind row-level security and the app ships only the publishable key. None of that is visible in the interface, which is rather the point.', '', '', 9 from projects where slug = 'daydream-research-app'
union all
select id, 'text', 'The part I am most pleased with is how little of the actual study is written in code. When the validated instrument arrives, updating this app is a data change — and that was the whole design goal, on a build with a genuinely short runway.', '', '', 10 from projects where slug = 'daydream-research-app';


commit;


-- =============================================================
-- Verify after running:
--
--   select sort_order, slug, published, featured, title
--     from projects order by sort_order;
--
--   select p.slug, count(*) as blocks
--     from project_blocks b join projects p on p.id = b.project_id
--    group by p.slug order by p.slug;
--
--   -- confirm the corrupted portfolio text is gone (expect 0 rows):
--   select p.slug, b.sort_order, left(b.text, 80)
--     from project_blocks b join projects p on p.id = b.project_id
--    where b.text ilike '%panase%'
--       or b.text ilike '%Sud image%'
--       or b.text ilike '%projeswap%';
--
-- Then add screenshots for the four new projects at /admin.
-- =============================================================
