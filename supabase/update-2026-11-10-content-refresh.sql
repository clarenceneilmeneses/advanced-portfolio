-- =============================================================
-- Content refresh, 2026-11-10
--   PapaFix mobile redesign, motion films, the KPI board, logos on
--   projects / experience, video blocks in case studies, new resumes.
-- Run once in the Supabase SQL Editor, AFTER the matching code is live
-- (the resume links and logos point at files that ship with the site).
-- Safe to run again: nothing is duplicated.
-- Then: node scripts/export-fallback.mjs
-- =============================================================
begin;

-- 1. New columns, and "video" as a case-study block.
alter table projects    add column if not exists logo_url text default '';
alter table experiences add column if not exists logo_url text default '';
alter table project_blocks drop constraint if exists project_blocks_kind_check;
alter table project_blocks add constraint project_blocks_kind_check
  check (kind in ('heading', 'text', 'image', 'video'));

-- 2. Profile: About, and resumes that now ship with the site.
update profile set
  about = $$I'm a full-stack developer and a BS Information Technology graduate of Batangas State University, major in Business Analytics (Class of 2026).

I build the systems small businesses run on. Right now that's Malaya Villas, a private rental business with ten villas: I built its booking site and staff back office on React, TypeScript, and Supabase, and on October 1 it replaced the owner's spreadsheets for every villa, with Xendit checkout and Airbnb calendar sync so nothing double-books.

I'm also the founding developer of PapaFix, a funded home-services marketplace under NAM Builders Supply Corp. They retained me after my internship, where I built the company's first sales platform, now handling ₱1M+ in monthly sales. I built PapaFix's web platform, and in November I redesigned both of its mobile apps, customer and technician, on one shared design kit. For the same company I'm now building a KPI board that scores its three businesses against one scorecard.

I design the interfaces I build, and I make product walkthrough films in code with Remotion, for my own projects and on commission. On the side I also build Shopify stores: custom Liquid product pages and a catalog pipeline for a German beauty brand.

I work across React, TypeScript, React Native, PostgreSQL, PHP, Shopify, and REST APIs, and I ship through reviewed pull requests with a test checklist for every change. Google-certified in Analytics and Ads Measurement.$$,
  resume_dev_url = $$/resume/Clarence-Meneses-Web-Developer-Resume.pdf$$,
  resume_analytics_url = $$/resume/Clarence-Meneses-Data-Analyst-Resume.pdf$$,
  updated_at = now();

-- 3. Experience: logos, the motion work, and the order.
update experiences set logo_url = $$/logos/malaya-mono.png$$, sort_order = 0 where organization = $$Malaya Villas$$;
update experiences set logo_url = $$/logos/papafix.png$$, sort_order = 1, title = $$Founding Developer, Web & Mobile (Contract)$$ where organization = $$PapaFix · NAM Builders Supply Corp$$;
insert into experiences (title, organization, year_label, is_current, sort_order)
select $$Motion Designer (Commissions)$$, $$Product walkthrough films, built in Remotion$$, $$Nov 2026 – Present$$, true, 2
 where not exists (select 1 from experiences where title = $$Motion Designer (Commissions)$$);
update experiences set logo_url = $$tech:remotion$$, sort_order = 2 where title = $$Motion Designer (Commissions)$$;
update experiences set logo_url = $$tech:shopify$$, sort_order = 3 where organization = $$Lumea · German beauty e-commerce store$$;
update experiences set logo_url = $$/logos/nam-mono.png$$, sort_order = 4 where organization = $$ALM Management Services & NAM Builders Supply Corp$$;
update experiences set logo_url = '', sort_order = 5 where organization = $$PDAO, City of Sto. Tomas$$;
update experiences set logo_url = $$/logos/batstate-mono.png$$, sort_order = 6 where organization = $$Batangas State University$$;
update experiences set logo_url = $$tech:code$$, sort_order = 7 where organization = $$Wrote my first line of code$$;

-- 4. Projects: three new ones, logos, order, and which show on the home page.
update projects set logo_url = $$/logos/malaya-mono.png$$, featured = true, sort_order = 0 where slug = $$malaya-obs$$;
insert into projects (title, description, url, display_url, published, slug, cover_image_url, tech, featured, sort_order)
select $$PapaFix Mobile: Customer & Technician Apps$$, $$A full UI/UX redesign of both Android apps on one shared design kit: 40+ screens, a guided booking flow and a mascot with 14 poses, shipped over the air with no new store build.$$, $$https://play.google.com/store/apps/details?id=com.papafix.customer$$, $$Google Play$$, true, $$papafix-mobile$$, '', $$React Native, Expo, Expo Router, TypeScript, Supabase, EAS Update$$, true, 1
 where not exists (select 1 from projects where slug = $$papafix-mobile$$);
update projects set title = $$PapaFix Mobile: Customer & Technician Apps$$, description = $$A full UI/UX redesign of both Android apps on one shared design kit: 40+ screens, a guided booking flow and a mascot with 14 poses, shipped over the air with no new store build.$$, url = $$https://play.google.com/store/apps/details?id=com.papafix.customer$$, display_url = $$Google Play$$,
       tech = $$React Native, Expo, Expo Router, TypeScript, Supabase, EAS Update$$, logo_url = $$/logos/papafix.png$$, featured = true, sort_order = 1
 where slug = $$papafix-mobile$$;
update projects set logo_url = $$/logos/papafix.png$$, featured = true, sort_order = 2 where slug = $$papafix-admin$$;
insert into projects (title, description, url, display_url, published, slug, cover_image_url, tech, featured, sort_order)
select $$Product Walkthrough Films: Motion Graphics$$, $$Motion-graphics films that walk through an app one action at a time. Built in code with Remotion, for my own projects and on commission.$$, '', '', true, $$motion-films$$, '', $$Remotion, React, TypeScript, FFmpeg$$, true, 3
 where not exists (select 1 from projects where slug = $$motion-films$$);
update projects set title = $$Product Walkthrough Films: Motion Graphics$$, description = $$Motion-graphics films that walk through an app one action at a time. Built in code with Remotion, for my own projects and on commission.$$, url = '', display_url = '',
       tech = $$Remotion, React, TypeScript, FFmpeg$$, logo_url = $$tech:remotion$$, featured = true, sort_order = 3
 where slug = $$motion-films$$;
insert into projects (title, description, url, display_url, published, slug, cover_image_url, tech, featured, sort_order)
select $$Mainframe: KPI Board for Three Businesses$$, $$A board that scores a company's three businesses against one weighted KPI scorecard, with every score traceable to the figures behind it.$$, '', '', true, $$nam-kpi-board$$, '', $$React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, PostgreSQL, Row Level Security, Recharts$$, true, 4
 where not exists (select 1 from projects where slug = $$nam-kpi-board$$);
update projects set title = $$Mainframe: KPI Board for Three Businesses$$, description = $$A board that scores a company's three businesses against one weighted KPI scorecard, with every score traceable to the figures behind it.$$, url = '', display_url = '',
       tech = $$React 19, TypeScript, Vite, Tailwind CSS 4, Supabase, PostgreSQL, Row Level Security, Recharts$$, logo_url = $$/logos/nam-mono.png$$, featured = true, sort_order = 4
 where slug = $$nam-kpi-board$$;
update projects set logo_url = $$/logos/nam-mono.png$$, featured = true, sort_order = 5 where slug = $$nam-inventory-system$$;
update projects set logo_url = $$tech:shopify$$, featured = true, sort_order = 6 where slug = $$lumea$$;
update projects set logo_url = $$tech:next.js$$, featured = true, sort_order = 7 where slug = $$portfolio-revamped$$;
update projects set logo_url = $$/logos/lexus-mono.png$$, featured = false, sort_order = 8 where slug = $$lexus-industrial$$;
update projects set logo_url = $$/logos/nam-mono.png$$, featured = false, sort_order = 9 where slug = $$nam-landing-page$$;
update projects set logo_url = '', featured = false, sort_order = 10 where slug = $$pdao-helps$$;

-- 5. Case studies. Each listed story is replaced whole, so re-running is clean.
delete from project_blocks where project_id = (select id from projects where slug = $$malaya-obs$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$Malaya Villas rents out ten private villas, and until this year the business ran on spreadsheets and Messenger threads. In August 2026 I took on Malaya OBS as its developer. What I was handed was a click-through prototype: no database, no login, no public site, and every number invented in the browser. The job was to turn it into the system the company actually runs on.$$, '', ''),
    (2, $$heading$$, $$What I built$$, '', ''),
    (3, $$text$$, $$A booking website for guests and a back office for staff, on one Supabase Postgres database with row-level security per role. A guest picks dates and pays on the public site; the stay blocks the calendar, the payment lands in Finance, and staff see the next step on the booking page. Around that loop sit the calendar and pricing, an inbox, maintenance, team roles, and the owner's reports.$$, '', ''),
    (4, $$heading$$, $$Going live$$, '', ''),
    (5, $$text$$, $$On October 1 the system replaced the owner's spreadsheets as the record for all ten villas. Before the switch I imported each villa's booking and cash-flow workbook and reconciled it line by line, and every month since is crosschecked against the sheets, ending in a to-do list for the staff. Guests pay through Xendit checkout, and nine villa calendars sync with Airbnb, so nothing gets double-booked.$$, '', ''),
    (6, $$heading$$, $$A database that refuses to be wrong$$, '', ''),
    (7, $$text$$, $$Business rules live in constraints, not just TypeScript. Money is numeric, stay dates are calendar dates so Manila bookings never drift a day on a UTC server, and a GiST exclusion constraint makes a double booking physically impossible. A trigger on every table writes an audit log, so every change shows up as a plain sentence: who did what to which booking.$$, '', ''),
    (8, $$heading$$, $$Security in the database, not the sidebar$$, '', ''),
    (9, $$text$$, $$Staff, owners and guests share the same tables. The sidebar hides tabs and screens refuse actions, but only Postgres policies are the real boundary: a caretaker cannot read the P&L even by calling the API directly. When the owner asked for custom roles, roles became data, so policies check has_permission() instead of naming a role, and staff can be scoped to only the villas they are assigned.$$, '', ''),
    (10, $$heading$$, $$Finance built to the owner's own workbooks$$, '', ''),
    (11, $$text$$, $$The owner's spreadsheets outranked the spec for Finance, so the module was built to match them cell by cell: per-villa monthly P&L, owner earnings and cash position, with breakdowns that drill down to each receipt. The importers were ported from Python to TypeScript line for line, with a verifier that had to print IDENTICAL before either changed. Payments and expenses only count once a person has verified them.$$, '', ''),
    (12, $$heading$$, $$Designed for the people using it$$, '', ''),
    (13, $$text$$, $$Eighteen staff use it every day. When some of them missed that an action was a button at all, I gave the interface a small, strict vocabulary: brown for the main step, green to confirm, red to remove, white for everything safe, every clickable word underlined, and a confirmation that names the guest, the amount and the booking code before any one-click approval. Depth comes from shades instead of lines, and related controls sit together in rounded pills. This portfolio follows the same rules, and so do the PapaFix mobile apps I redesigned afterwards.$$, '', ''),
    (14, $$heading$$, $$Payments and AI, kept honest$$, '', ''),
    (15, $$text$$, $$Online payments go through Xendit, and the webhook records the payment and confirms the booking in one transaction. Maya, the built-in assistant, is a real Claude call over the figures already on screen. It is never allowed to query the database or calculate a number itself, so it can never disagree with the Finance tab.$$, '', ''),
    (16, $$heading$$, $$Since the switch-over$$, '', ''),
    (17, $$text$$, $$The system has kept growing with the business. The owner now gets a report by email every night. Receipts are filed in folders that download as one archive. Xendit's fees are reconciled against the gateway's own records. The P&L was rebuilt around one date rule, with a break-even per villa and a forecast. Investors sign in to see only their own branch, and affiliates earn a share of the bookings they bring.$$, '', ''),
    (18, $$heading$$, $$How I work$$, '', ''),
    (19, $$text$$, $$Every change ships through a pull request the owner reviews, more than 150 so far, each with a test checklist that says who checks what, and I recorded a training video for the staff. Type-checking and tests now run on every pull request before it can merge. This is the project where I learned to own a system a business depends on: reading a spec closely enough to find its contradictions, asking the questions only the owner can answer, and refusing to invent a number. It is ongoing.$$, '', '')
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$malaya-obs$$;

delete from project_blocks where project_id = (select id from projects where slug = $$papafix-mobile$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$PapaFix has two Android apps on Google Play: one where customers book an aircon, plumbing or electrical technician, and one where technicians take and finish those jobs. Both worked, but they had grown one screen at a time. An audit found about 150 hand-bordered cards, no shared button, and type as small as 9 points. In November 2026 I redesigned both apps without changing how anything works.$$, '', ''),
    (2, $$image$$, '', $$/work/papafix/customer-app-1.webp$$, $$The customer app after the redesign, in the Google Play listing art I designed for it.$$),
    (3, $$heading$$, $$One kit, two apps$$, '', ''),
    (4, $$text$$, $$The two apps live in one monorepo and share a package, so the redesign started there: colour and spacing tokens, a card, one button with a few tones, a text field, status pills, tab pills, list cards and stat tiles. Every screen in both apps was then rebuilt from those pieces. The customer app is blue and the technician app is orange, and that accent is the only thing that differs between them.$$, '', ''),
    (5, $$heading$$, $$The same language as Malaya$$, '', ''),
    (6, $$text$$, $$The look follows the design language I built for Malaya Villas' back office: depth from shades instead of drawn lines, related controls grouped in rounded pills, the open tab as a soft fill, and one typeface at light weights under spaced small-caps labels. The bottom navigation is a floating pill with a separate round + button that opens the app's main actions.$$, '', ''),
    (7, $$heading$$, $$Booking, one decision at a time$$, '', ''),
    (8, $$text$$, $$Booking a technician became a four-step flow with a progress bar and a card for each decision. The price stays pinned to the bottom of the screen the whole way through, so a customer sees what they will pay before they commit. Aircon, plumbing and electrical get the same treatment, each with its own colour and icon.$$, '', ''),
    (9, $$image$$, '', $$/work/papafix/customer-app-2.webp$$, $$The + menu and Help & Support.$$),
    (10, $$image$$, '', $$/work/papafix/technician-app.webp$$, $$The technician app: home, incoming jobs, and the schedule where a technician sets their hours.$$),
    (11, $$heading$$, $$Papa, the mascot$$, '', ''),
    (12, $$text$$, $$The apps' mascot, Papa, used to appear only on the launch screen. I produced a set of 14 poses in one consistent style, generated from the original art and cleaned up by hand, and gave him a job. He greets you on the home screen, searches while a technician is being matched, shrugs at an empty list, and owns up when something fails to load. Every full-screen loading spinner in both apps became Papa.$$, '', ''),
    (13, $$image$$, '', $$/work/papafix/papa-poses.webp$$, $$Papa's 14 poses, each tied to a moment in the app.$$),
    (14, $$heading$$, $$Shipped without a store release$$, '', ''),
    (15, $$text$$, $$The redesign changed 91 files, and none of it needed a new build. I kept every change inside JavaScript and compared each branch's native fingerprint with the released apps', so the mobile lead could publish it over the air and users got the new look the next time they opened the app. The one native change, a cleaner launch screen, went into its own pull request to wait for the next store build.$$, '', ''),
    (16, $$heading$$, $$How I worked$$, '', ''),
    (17, $$text$$, $$It is another developer's codebase, so everything went through pull requests he reviewed: three merged within two days. To test, I set up an Android emulator and local builds of both apps. Along the way I found and fixed a bug older than the redesign, where customers who skipped entering a name were bounced away from every Book button.$$, '', '')
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$papafix-mobile$$;

delete from project_blocks where project_id = (select id from projects where slug = $$motion-films$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$I make product films the way I make products: in code. Each one is a React project rendered with Remotion, so a screen in the film is a real component, a wrong number is fixed by changing a line, and a new cut is a re-render instead of a re-edit.$$, '', ''),
    (2, $$heading$$, $$FixLink: app walkthrough (commission)$$, '', ''),
    (3, $$video$$, '', $$/work/films/fixlink-walkthrough.mp4$$, $$FixLink app walkthrough, 2:30. Every name, address and price in it is invented.$$),
    (4, $$text$$, $$FixLink is a home-services app concept from a student's research, and the brief was a film that explains it from sign-up to review. I followed the client's own flow chart: nine steps, each shown on one phone, with the step's name on the left and a callout on the right. The app's screens are rebuilt as clean cards and made to work. A fingertip taps, fields fill in, a quote adds up, and the camera leans in on each tap. The soundtrack is written in code too, timed to the cuts, with a sound for every tap.$$, '', ''),
    (5, $$heading$$, $$Malaya Villas: guest features$$, '', ''),
    (6, $$video$$, '', $$/work/films/malaya-features.mp4$$, $$Malaya Villas guest features, one minute.$$),
    (7, $$text$$, $$Made for the villa business whose booking system I build. It shows the guest's side, from searching dates to signing the waiver, one feature per beat, in the brand's own type and colours.$$, '', ''),
    (8, $$heading$$, $$PapaFix: product reel$$, '', ''),
    (9, $$video$$, '', $$/work/films/papafix-reel.mp4$$, $$PapaFix product reel, 63 seconds. Also cut in 9:16 for social.$$),
    (10, $$text$$, $$A reel for the home-services app: booking, matching, live tracking, the QR check at the door, and payment. It comes in a wide cut and a vertical cut that share every frame and one soundtrack.$$, '', ''),
    (11, $$heading$$, $$Why code$$, '', ''),
    (12, $$text$$, $$A film built this way stays editable for as long as the product does. When a screen changes, I change the component and render again. I made a seven-minute training video for Malaya's staff the same way, from real screens with guest names replaced, so the people using the system could learn it without having to explore on their own.$$, '', ''),
    (13, $$text$$, $$Music in the FixLink film uses the Salamander Grand Piano by Alexander Holm (CC BY 3.0), with instruments from Versilian Studios, FreePats and Karoryfer Samples.$$, '', '')
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$motion-films$$;

delete from project_blocks where project_id = (select id from projects where slug = $$nam-kpi-board$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$NAM's CEO runs three businesses and grades them on one scorecard: nine categories, from sales and finance to quality and governance, each with a weight, adding up to 100. He asked for a board that shows where each business stands without anyone compiling a spreadsheet. It is phase one of a larger internal system, started in November 2026.$$, '', ''),
    (2, $$heading$$, $$What it shows$$, '', ''),
    (3, $$text$$, $$One screen answers the first question: a group score, a heatmap of businesses against categories, and a list of what is costing the most points, ranked. Every tile opens the list behind it, every score opens a breakdown of where it came from, and a twelve-month trend sits against the target.$$, '', ''),
    (4, $$heading$$, $$Scoring that can be explained$$, '', ''),
    (5, $$text$$, $$A score nobody can explain gets ignored, so the rules are plain. Attainment is capped at 100 percent, so one great month cannot hide a weak category. A figure nobody reported shows as a gap instead of counting as a zero. A "How it works" page walks through the arithmetic using the board's own live numbers.$$, '', ''),
    (6, $$heading$$, $$Real figures, not typed ones$$, '', ''),
    (7, $$text$$, $$For the supply business, sales, margin and collections are read straight from the sales platform I built for the company earlier, so the board and the system of record cannot disagree. For figures that only exist on paper, staff enter two counts, such as 19 out of 20, and the board works out the percentage.$$, '', ''),
    (8, $$heading$$, $$Private by default$$, '', ''),
    (9, $$text$$, $$The board shows what clients owe, so nothing on it is public and there are no screenshots here. Editors sign in. The CEO opens a private view link that reads the board through a single database function, while the tables themselves stay closed.$$, '', ''),
    (10, $$text$$, $$It is live. The supply business is loaded from January 2026 onward, and the other two are waiting on their first figures.$$, '', '')
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$nam-kpi-board$$;

-- The apps are past closed testing.
update project_blocks set text = replace(text, $$both now through Google Play closed testing$$, $$both now on Google Play$$)
 where project_id = (select id from projects where slug = 'papafix-admin');

-- 6. Tech stack: React Native, Expo, TanStack Start and Remotion; Figma moves to "Design & Motion".
insert into tech_stack (category, name, featured, sort_order)
select v.cat, v.name, true, v.ord
  from (values
    ($$PostgreSQL$$, $$Backend & Databases$$, 1),
    ($$Supabase$$, $$Backend & Databases$$, 2),
    ($$PHP$$, $$Backend & Databases$$, 3),
    ($$MySQL$$, $$Backend & Databases$$, 4),
    ($$REST APIs$$, $$Backend & Databases$$, 5),
    ($$Python$$, $$Backend & Databases$$, 6),
    ($$React$$, $$Frontend$$, 7),
    ($$TypeScript$$, $$Frontend$$, 8),
    ($$Next.js$$, $$Frontend$$, 9),
    ($$React Native$$, $$Frontend$$, 10),
    ($$Expo$$, $$Frontend$$, 11),
    ($$TanStack Start$$, $$Frontend$$, 12),
    ($$Tailwind CSS$$, $$Frontend$$, 13),
    ($$JavaScript$$, $$Frontend$$, 14),
    ($$HTML5$$, $$Frontend$$, 15),
    ($$CSS3$$, $$Frontend$$, 16),
    ($$Shopify (Liquid)$$, $$Frontend$$, 17),
    ($$Power BI$$, $$Data & Analytics$$, 18),
    ($$SQL$$, $$Data & Analytics$$, 19),
    ($$Microsoft Excel$$, $$Data & Analytics$$, 20),
    ($$Google Analytics$$, $$Data & Analytics$$, 21),
    ($$Google Ads$$, $$Data & Analytics$$, 22),
    ($$GIS Mapping$$, $$Data & Analytics$$, 23),
    ($$Figma$$, $$Design & Motion$$, 24),
    ($$Remotion$$, $$Design & Motion$$, 25),
    ($$Git/GitHub$$, $$QA & Tools$$, 26),
    ($$Vite$$, $$QA & Tools$$, 27),
    ($$Vitest$$, $$QA & Tools$$, 28),
    ($$UAT & System Testing$$, $$QA & Tools$$, 29),
    ($$Claude Code$$, $$QA & Tools$$, 30)
  ) as v(name, cat, ord)
 where not exists (select 1 from tech_stack t where t.name = v.name);
update tech_stack t set category = v.cat, sort_order = v.ord
  from (values
    ($$PostgreSQL$$, $$Backend & Databases$$, 1),
    ($$Supabase$$, $$Backend & Databases$$, 2),
    ($$PHP$$, $$Backend & Databases$$, 3),
    ($$MySQL$$, $$Backend & Databases$$, 4),
    ($$REST APIs$$, $$Backend & Databases$$, 5),
    ($$Python$$, $$Backend & Databases$$, 6),
    ($$React$$, $$Frontend$$, 7),
    ($$TypeScript$$, $$Frontend$$, 8),
    ($$Next.js$$, $$Frontend$$, 9),
    ($$React Native$$, $$Frontend$$, 10),
    ($$Expo$$, $$Frontend$$, 11),
    ($$TanStack Start$$, $$Frontend$$, 12),
    ($$Tailwind CSS$$, $$Frontend$$, 13),
    ($$JavaScript$$, $$Frontend$$, 14),
    ($$HTML5$$, $$Frontend$$, 15),
    ($$CSS3$$, $$Frontend$$, 16),
    ($$Shopify (Liquid)$$, $$Frontend$$, 17),
    ($$Power BI$$, $$Data & Analytics$$, 18),
    ($$SQL$$, $$Data & Analytics$$, 19),
    ($$Microsoft Excel$$, $$Data & Analytics$$, 20),
    ($$Google Analytics$$, $$Data & Analytics$$, 21),
    ($$Google Ads$$, $$Data & Analytics$$, 22),
    ($$GIS Mapping$$, $$Data & Analytics$$, 23),
    ($$Figma$$, $$Design & Motion$$, 24),
    ($$Remotion$$, $$Design & Motion$$, 25),
    ($$Git/GitHub$$, $$QA & Tools$$, 26),
    ($$Vite$$, $$QA & Tools$$, 27),
    ($$Vitest$$, $$QA & Tools$$, 28),
    ($$UAT & System Testing$$, $$QA & Tools$$, 29),
    ($$Claude Code$$, $$QA & Tools$$, 30)
  ) as v(name, cat, ord)
 where t.name = v.name;

commit;
