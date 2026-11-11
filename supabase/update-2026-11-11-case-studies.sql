-- =============================================================
-- Case studies + covers, 2026-11-11
--   Every project's story rewritten in the PapaFix Mobile pattern (intro,
--   preview image, short headed sections with captioned images, "How I
--   worked"), a new one for Lumea, and a cover image for every project.
--   The images ship with the site under /work, so run this AFTER the
--   matching code is live.
-- Safe to run again: each project's blocks are replaced, not appended.
-- Then: node scripts/export-fallback.mjs
-- =============================================================
begin;

update projects set cover_image_url = $$/work/malaya/cover.webp$$ where slug = $$malaya-obs$$;
update projects set cover_image_url = $$/work/papafix/customer-app-1.webp$$ where slug = $$papafix-mobile$$;
update projects set cover_image_url = $$/work/papafix/web-cover.webp$$ where slug = $$papafix-admin$$;
update projects set cover_image_url = $$/work/films/cover.webp$$ where slug = $$motion-films$$;
update projects set cover_image_url = $$/work/nam/kpi-cover.webp$$ where slug = $$nam-kpi-board$$;
update projects set cover_image_url = $$/work/nam/inventory-cover.webp$$ where slug = $$nam-inventory-system$$;
update projects set cover_image_url = $$/work/lumea/cover.webp$$ where slug = $$lumea$$;
update projects set cover_image_url = $$/work/portfolio/cover.webp$$ where slug = $$portfolio-revamped$$;
update projects set cover_image_url = $$/work/lexus/cover.webp$$ where slug = $$lexus-industrial$$;
update projects set cover_image_url = $$/work/nam/website-cover.webp$$ where slug = $$nam-landing-page$$;
update projects set cover_image_url = $$/work/pdao/cover.webp$$ where slug = $$pdao-helps$$;

-- Lumea had no story until now, so its page was unpublished.
update projects set published = true where slug = $$lumea$$;

delete from project_blocks where project_id = (select id from projects where slug = $$malaya-obs$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$Malaya Villas rents out ten private villas, and until this year the business ran on spreadsheets and Messenger threads. In August 2026 I took on Malaya OBS as its developer. What I was handed was a click-through prototype: no database, no login, no public site, and every number invented in the browser. The job was to turn it into the system the company actually runs on.$$, $$$$, $$$$),
    (2, $$image$$, $$$$, $$/work/malaya/cover.webp$$, $$Malaya Villas' booking site, on a laptop and a phone.$$),
    (3, $$heading$$, $$What I built$$, $$$$, $$$$),
    (4, $$text$$, $$A booking website for guests and a back office for staff, on one Supabase Postgres database with row-level security per role. A guest picks dates and pays on the public site; the stay blocks the calendar, the payment lands in Finance, and staff see the next step on the booking page. Around that loop sit the calendar and pricing, an inbox, maintenance, team roles, and the owner's reports.$$, $$$$, $$$$),
    (5, $$image$$, $$$$, $$/work/malaya/guest-site.webp$$, $$The guest side: one search across every villa, a page for each villa, and booking with online payment.$$),
    (6, $$heading$$, $$Going live$$, $$$$, $$$$),
    (7, $$text$$, $$On October 1 the system replaced the owner's spreadsheets as the record for all ten villas. Before the switch I imported each villa's booking and cash-flow workbook and reconciled it line by line, and every month since is crosschecked against the sheets, ending in a to-do list for the staff. Guests pay through Xendit checkout, and nine villa calendars sync with Airbnb, so nothing gets double-booked.$$, $$$$, $$$$),
    (8, $$heading$$, $$A database that refuses to be wrong$$, $$$$, $$$$),
    (9, $$text$$, $$Business rules live in constraints, not just TypeScript. Money is numeric, stay dates are calendar dates so Manila bookings never drift a day on a UTC server, and a GiST exclusion constraint makes a double booking physically impossible. A trigger on every table writes an audit log, so every change shows up as a plain sentence: who did what to which booking.$$, $$$$, $$$$),
    (10, $$heading$$, $$Security in the database, not the sidebar$$, $$$$, $$$$),
    (11, $$text$$, $$Staff, owners and guests share the same tables. The sidebar hides tabs and screens refuse actions, but only Postgres policies are the real boundary: a caretaker cannot read the P&L even by calling the API directly. When the owner asked for custom roles, roles became data, so policies check has_permission() instead of naming a role, and staff can be scoped to only the villas they are assigned.$$, $$$$, $$$$),
    (12, $$heading$$, $$Finance built to the owner's own workbooks$$, $$$$, $$$$),
    (13, $$text$$, $$The owner's spreadsheets outranked the spec for Finance, so the module was built to match them cell by cell: per-villa monthly P&L, owner earnings and cash position, with breakdowns that drill down to each receipt. The importers were ported from Python to TypeScript line for line, with a verifier that had to print IDENTICAL before either changed. Payments and expenses only count once a person has verified them.$$, $$$$, $$$$),
    (14, $$heading$$, $$Designed for the people using it$$, $$$$, $$$$),
    (15, $$text$$, $$Eighteen staff use it every day. When some of them missed that an action was a button at all, I gave the interface a small, strict vocabulary: brown for the main step, green to confirm, red to remove, white for everything safe, every clickable word underlined, and a confirmation that names the guest, the amount and the booking code before any one-click approval. Depth comes from shades instead of lines, and related controls sit together in rounded pills. This portfolio follows the same rules, and so do the PapaFix mobile apps I redesigned afterwards.$$, $$$$, $$$$),
    (16, $$heading$$, $$Maya, the assistant$$, $$$$, $$$$),
    (17, $$text$$, $$Maya is a small sparrow and the system's built-in assistant. In the back office she is a real Claude call over the figures already on screen, and she is never allowed to query the database or calculate a number herself, so she can never disagree with the Finance tab. Everywhere else she is a picture: she sits in the top bar, flies over to open the chat, and fills every empty state on the site, guest side included.$$, $$$$, $$$$),
    (18, $$image$$, $$$$, $$/work/malaya/maya-poses.webp$$, $$Maya's poses, each tied to a moment in the app.$$),
    (19, $$heading$$, $$A map on the About page$$, $$$$, $$$$),
    (20, $$text$$, $$The About page draws Cavite and Taal Lake from public PSA and OpenStreetMap shapes, puts a pin on every live villa, and traces a route between them as you scroll.$$, $$$$, $$$$),
    (21, $$image$$, $$$$, $$/work/malaya/about-map.webp$$, $$The About page map.$$),
    (22, $$heading$$, $$Since the switch-over$$, $$$$, $$$$),
    (23, $$text$$, $$The system has kept growing with the business. The owner gets a report by email every night. Receipts are filed in folders that download as one archive. Xendit's fees are reconciled against the gateway's own records. The P&L was rebuilt around one date rule, with a break-even per villa and a forecast. Investors sign in to see only their own branch, and affiliates earn a share of the bookings they bring.$$, $$$$, $$$$),
    (24, $$heading$$, $$How I worked$$, $$$$, $$$$),
    (25, $$text$$, $$Every change ships through a pull request the owner reviews, more than 150 so far, each with a test checklist that says who checks what, and I recorded a training video for the staff. Type-checking and tests run on every pull request before it can merge. This is the project where I learned to own a system a business depends on: reading a spec closely enough to find its contradictions, asking the questions only the owner can answer, and refusing to invent a number. It is ongoing.$$, $$$$, $$$$)
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$malaya-obs$$;

delete from project_blocks where project_id = (select id from projects where slug = $$papafix-admin$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$PapaFix is a home-repair marketplace in Batangas, a funded venture under NAM Builders Supply Corp. Customers book aircon, plumbing and electrical technicians in one Android app, and technicians take the jobs in another. Both apps write to one Supabase database, but nobody could see the whole operation: which jobs were stalling, which payments hadn't cleared, where the technicians were. As founding developer I built the web platform that sits over all of it.$$, $$$$, $$$$),
    (2, $$image$$, $$$$, $$/work/papafix/web-cover.webp$$, $$The web platform: the overview dashboard and the live map.$$),
    (3, $$heading$$, $$One panel over two apps$$, $$$$, $$$$),
    (4, $$text$$, $$The admin panel is React on the same Postgres database as the apps. The apps own the day-to-day writes; the panel is where the business sees them and corrects them. Only admin accounts get in, and that is enforced by row-level security, not just by the interface. Anything that needs a privileged key, like creating an account or changing an email, runs in an Edge Function, so the key never reaches the browser.$$, $$$$, $$$$),
    (5, $$heading$$, $$Day-to-day operations$$, $$$$, $$$$),
    (6, $$text$$, $$Profiles for customers, technicians and admins, with search, role filters, and each technician's base location, service categories and radius. Bookings with filters for status, category, payment and date, down to the inspection checklist and the QR code checked at the door. Saved customer locations with map previews, a technician schedule with a toggle for every slot, and a support-ticket queue.$$, $$$$, $$$$),
    (7, $$image$$, $$$$, $$https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1781685086690-screencapture-papafix-vercel-app-2026-06-17-16_31_15.png$$, $$The Profiles tab: customers, technicians and admins, with role filters and accounts created on the server.$$),
    (8, $$heading$$, $$The field, live$$, $$$$, $$$$),
    (9, $$text$$, $$Technicians work out in the field, so the Live Map shows every one of them, green when online and grey when offline, beside the blue pins of active job sites, and refreshes on its own. A Tech Locations table lists each technician's last-known position and how long ago it came in.$$, $$$$, $$$$),
    (10, $$image$$, $$$$, $$https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1781685154894-screencapture-papafix-vercel-app-2026-06-17-16_01_10.png$$, $$The Live Map across Batangas: technicians online and offline, and customer job sites.$$),
    (11, $$heading$$, $$Prices in one place$$, $$$$, $$$$),
    (12, $$text$$, $$The aircon price grid, the base price per category, the admin fee, VAT and the distance-based travel fee are all set in the panel. They are the same numbers the customer app quotes up front, changed here instead of in an app release. Payments go through a verification queue: awaiting, paid or unpaid, with cash-proof photos approved or rejected with a reason, and settlement handled by an Edge Function rather than a write from the browser. The GCash, Maya and bank QR codes customers pay against are managed here too.$$, $$$$, $$$$),
    (13, $$heading$$, $$Numbers that hold up as data grows$$, $$$$, $$$$),
    (14, $$text$$, $$The Overview is the daily health check: headline figures against the previous period, bookings and revenue over time, demand by hour and weekday, a technician leaderboard, revenue per city, and a queue of what needs attention, like stale jobs, unpaid finished work and low ratings. Analytics goes deeper, and clicking one technician filters every chart on the page. Both first pulled thousands of raw rows into the browser, so I moved the aggregation into Postgres functions with the right indexes and server-side paging.$$, $$$$, $$$$),
    (15, $$image$$, $$$$, $$https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1781685210658-screencapture-papafix-vercel-app-2026-06-17-16_03_12.png$$, $$Analytics with one technician selected: every chart on the page follows.$$),
    (16, $$heading$$, $$A record nobody can rewrite$$, $$$$, $$$$),
    (17, $$text$$, $$Every booking and payment event is written to an audit trail by database triggers the moment a row changes: created, status moved, technician reassigned, payment captured, fee adjusted. The table has no update or delete policy, so not even an admin can forge or erase an entry. It records what changed a record, not taps, locations or messages. Admin itself is tiered: a super admin decides which admins can touch pricing, payments or accounts, and misconduct reports from either side land in their own queue.$$, $$$$, $$$$),
    (18, $$image$$, $$$$, $$https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1781685276643-screencapture-papafix-vercel-app-2026-06-17-16_23_37.png$$, $$The audit trail, written by the database, never by the browser.$$),
    (19, $$heading$$, $$How I worked$$, $$$$, $$$$),
    (20, $$text$$, $$I owned this surface end to end, from the React screens down to the triggers, functions, policies and Edge Functions. The rule I kept was simple: the hard guarantees belong next to the data, and the browser is an untrusted client looking in. Fifteen modules are covered by a 292-case test suite.$$, $$$$, $$$$)
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$papafix-admin$$;

delete from project_blocks where project_id = (select id from projects where slug = $$nam-kpi-board$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$NAM's CEO runs three businesses and grades them on one scorecard: nine categories, from sales and finance to quality and governance, each with a weight, adding up to 100. He asked for a board that shows where each business stands without anyone compiling a spreadsheet. It is phase one of a larger internal system, started in November 2026.$$, $$$$, $$$$),
    (2, $$image$$, $$$$, $$/work/nam/kpi-cover.webp$$, $$An illustration of the board's layout with made-up colours. The real board shows what clients owe, so its figures stay private.$$),
    (3, $$heading$$, $$What it shows$$, $$$$, $$$$),
    (4, $$text$$, $$One screen answers the first question: a group score, a heatmap of businesses against categories, and a list of what is costing the most points, ranked. Every tile opens the list behind it, every score opens a breakdown of where it came from, and a twelve-month trend sits against the target.$$, $$$$, $$$$),
    (5, $$heading$$, $$Scoring that can be explained$$, $$$$, $$$$),
    (6, $$text$$, $$A score nobody can explain gets ignored, so the rules are plain. Attainment is capped at 100 percent, so one great month cannot hide a weak category. A figure nobody reported shows as a gap instead of counting as a zero. A "How it works" page walks through the arithmetic using the board's own live numbers.$$, $$$$, $$$$),
    (7, $$heading$$, $$Real figures, not typed ones$$, $$$$, $$$$),
    (8, $$text$$, $$For the supply business, sales, margin and collections are read straight from the sales platform I built for the company earlier, so the board and the system of record cannot disagree. For figures that only exist on paper, staff enter two counts, such as 19 out of 20, and the board works out the percentage.$$, $$$$, $$$$),
    (9, $$heading$$, $$Private by default$$, $$$$, $$$$),
    (10, $$text$$, $$Nothing on the board is public. Editors sign in. The CEO opens a private view link that reads the board through a single database function, while the tables themselves stay closed.$$, $$$$, $$$$),
    (11, $$heading$$, $$Where it stands$$, $$$$, $$$$),
    (12, $$text$$, $$It is live. The supply business is loaded from January 2026 onward, and the other two are waiting on their first figures.$$, $$$$, $$$$)
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$nam-kpi-board$$;

delete from project_blocks where project_id = (select id from projects where slug = $$nam-inventory-system$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$NAM Builders Supply Corp ran a building-supply business on spreadsheets. Quotations were typed by hand, sales lived in one workbook and stock in another, and one report for management meant a week of chasing files across departments. I joined as an IT intern for 500 hours and built the company its first real system.$$, $$$$, $$$$),
    (2, $$image$$, $$$$, $$/work/nam/inventory-cover.webp$$, $$The sales and inventory platform: the executive dashboard and the stock list.$$),
    (3, $$heading$$, $$One platform instead of five workbooks$$, $$$$, $$$$),
    (4, $$text$$, $$Quotations, sales entry, the sales ledger, products and stock, finance, logistics and bulk imports, all in one place. Staff use it every day to run more than ₱1M in monthly sales. The point was never to put the spreadsheets online. It was to make the numbers agree with each other for the first time.$$, $$$$, $$$$),
    (5, $$image$$, $$$$, $$https://i.imgur.com/EuIy8Ht.png$$, $$The executive dashboard: sales and key figures in one view, instead of a week of compiling.$$),
    (6, $$heading$$, $$Quotation to sale$$, $$$$, $$$$),
    (7, $$text$$, $$A quotation is drafted, approved and turned into a confirmed sale, and stock comes off as it goes. Quotations print in the company's own formal layout, so staff present to clients the way they always have, and a quote can be converted in part when a client only takes some of the lines. Deliveries carry their own DR numbers, and finance tracks what is owed against what is paid.$$, $$$$, $$$$),
    (8, $$image$$, $$$$, $$https://i.imgur.com/7hpDunP.png$$, $$Inventory: supplier prices in one list, with bulk CSV import.$$),
    (9, $$heading$$, $$Numbers that reconcile$$, $$$$, $$$$),
    (10, $$text$$, $$The reporting layer filters by company, category and account manager. The hard part was trust, not charts: income, markup and margin, withholding tax and the formal-document arithmetic live in one unit-tested calculation engine, so the dashboard agrees with what finance works out by hand.$$, $$$$, $$$$),
    (11, $$heading$$, $$Moved to Postgres without losing a row$$, $$$$, $$$$),
    (12, $$text$$, $$The system first shipped in PHP and MySQL. I later rebuilt it as a React and TypeScript app on Supabase, which meant moving years of live data. My converter reads the old MySQL dump, turns currency-formatted text back into numbers, fixes broken and zero dates, and corrects a timezone shift that would have moved old records by a day. A Legacy Restore screen lets the import be re-run and checked instead of trusted blindly.$$, $$$$, $$$$),
    (13, $$heading$$, $$Who can see what$$, $$$$, $$$$),
    (14, $$text$$, $$Several departments touch the same record, so roles and per-privilege gates live in the database and are enforced by row-level security. Account managers are assigned to the companies they handle, each account can only be signed in once at a time, and an activity log records who changed what. The browser only ever holds the publishable key.$$, $$$$, $$$$),
    (15, $$heading$$, $$How I worked$$, $$$$, $$$$),
    (16, $$text$$, $$I finished the internship with a full handover: technical notes for every module and training, so staff could run their own reports without me. The system stayed in daily use after I left, which is the part I judge it by. The company kept me on afterwards, as founding developer of PapaFix.$$, $$$$, $$$$)
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$nam-inventory-system$$;

delete from project_blocks where project_id = (select id from projects where slug = $$lumea$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$Lumea is a German beauty store on Shopify. In October 2026 the owner hired me to build its product pages: six products, each with its own page design based on a reference page he chose, in German, priced in euros, with quantity bundles.$$, $$$$, $$$$),
    (2, $$image$$, $$$$, $$/work/lumea/cover.webp$$, $$Sections from the soap page I built. The store has since been renamed Eversso.$$),
    (3, $$heading$$, $$Templates, not page-builder pages$$, $$$$, $$$$),
    (4, $$text$$, $$Every page is a Shopify product template made of my own Liquid sections: the reason the product exists, a comparison table, ingredient cards, a guarantee box and an FAQ, plus a size finder for the shapewear. The German copy lives in a Python script that writes the template files, so changing a sentence is a re-run, not an afternoon in the theme editor. Fonts are hosted inside the theme instead of loaded from Google, which keeps the pages clear of a GDPR question.$$, $$$$, $$$$),
    (5, $$image$$, $$$$, $$/work/lumea/sections.webp$$, $$Three of the soap page's sections: the reason, the comparison and the ingredients.$$),
    (6, $$heading$$, $$Bundles that add up$$, $$$$, $$$$),
    (7, $$text$$, $$Quantity deals run through the Kaching app: 2, 4 or 8 bars of soap, or 1+1, 2+2 and 3+3 free on the shapewear with colour and size picked per piece, and gifts that unlock at each step. Crossed-out prices on bundles are the real quantity times the single price, so the saving shown is the saving you get.$$, $$$$, $$$$),
    (8, $$heading$$, $$Every image in German$$, $$$$, $$$$),
    (9, $$text$$, $$The product images came in English with another brand's name on them. I wrote a Python pipeline that finds the text with OCR, paints it out and sets the German translation in its place. For bottles and tubes it removes the old name and rebuilds the surface from the bottle's own shading, so the Lumea name could go on instead.$$, $$$$, $$$$),
    (10, $$heading$$, $$What I left out$$, $$$$, $$$$),
    (11, $$text$$, $$German competition law forbids fake reviews and invented urgency, so the templates I delivered had none: no made-up ratings or "100,000+ customers", no countdowns or "only 3 left", no claims the store couldn't prove, and no crossed-out prices that were never charged. The review section was built but left switched off, for real reviews only. Every one of these I listed for the owner with the reason.$$, $$$$, $$$$),
    (12, $$heading$$, $$How I worked$$, $$$$, $$$$),
    (13, $$text$$, $$Products started as drafts and went live only after the owner approved each page. Theme work went to an unpublished copy of the theme first, and files were pushed without deleting anything, so nothing in the live theme was overwritten. The README I kept for the owner lists every price, bundle and open question.$$, $$$$, $$$$)
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$lumea$$;

delete from project_blocks where project_id = (select id from projects where slug = $$portfolio-revamped$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$I wanted a portfolio I could keep current without touching code or redeploying every time. So I built mine as a content-managed site: every section, from my profile and tech stack to projects, experience, certifications and gallery, is edited from a private admin panel. Case studies like this one are content too, built from text, heading, image and video blocks.$$, $$$$, $$$$),
    (2, $$image$$, $$$$, $$/work/portfolio/cover.webp$$, $$The site you are on, on a laptop and a phone.$$),
    (3, $$heading$$, $$What I built$$, $$$$, $$$$),
    (4, $$text$$, $$Next.js 14 with the App Router and Tailwind CSS, on Supabase for Postgres, Auth and image storage. The admin lives at /admin behind Supabase Auth, every write is gated by row-level security, and the public site only ever uses the publishable key.$$, $$$$, $$$$),
    (5, $$image$$, $$$$, $$https://coxblavototbhnhhtprv.supabase.co/storage/v1/object/public/media/1782046518337-screencapture-clarenceneilmeneses-vercel-app-admin-2026-06-21-20_54_46.png$$, $$The admin CMS, where I edit and reorder every section of the live site.$$),
    (6, $$heading$$, $$Everything is editable$$, $$$$, $$$$),
    (7, $$text$$, $$There are no hard-coded sections. Projects, work history, skills, certifications, links and gallery photos are managed in the CMS with drag-and-drop ordering. Slugs are made automatically, drafts stay hidden until I publish, and changes reach the live site within minutes.$$, $$$$, $$$$),
    (8, $$heading$$, $$The same design language as my client work$$, $$$$, $$$$),
    (9, $$text$$, $$In November I rebuilt the public side in the language I use for Malaya Villas and PapaFix: flat cards, rounded pills and depth from shades instead of lines. On a phone it has a top bar and a floating tab bar. The tab bar, the buttons and the switches are Liquid Glass, from the glisse library, over a still wallpaper in the page's accent colour, and the icons are an iOS-style set.$$, $$$$, $$$$),
    (10, $$heading$$, $$Never cold, never blank$$, $$$$, $$$$),
    (11, $$text$$, $$Supabase pauses free projects after about a week without traffic. I handled that in three layers: a daily keep-alive ping, cached pages that rebuild in the background, and a snapshot of the content bundled with the site, so it renders even if the database can't be reached.$$, $$$$, $$$$),
    (12, $$heading$$, $$SEO that maintains itself$$, $$$$, $$$$),
    (13, $$text$$, $$Titles, descriptions, canonical URLs and social preview tags are generated from the same content, and the sitemap includes every published case study, so search stays correct as I add work.$$, $$$$, $$$$)
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$portfolio-revamped$$;

delete from project_blocks where project_id = (select id from projects where slug = $$lexus-industrial$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$A product catalog is the worst thing to hard-code. The range changes, prices move, photos get replaced, and if every edit needs a developer and a deploy, the site is out of date within weeks. So the brief was less "build a website" than "build something the staff can own".$$, $$$$, $$$$),
    (2, $$image$$, $$$$, $$/work/lexus/cover.webp$$, $$The site and a product page, running on its own sample catalog.$$),
    (3, $$heading$$, $$What I built$$, $$$$, $$$$),
    (4, $$text$$, $$The public site and its admin as one React and TypeScript app on Supabase. Visitors get a catalog with product pages, services, company information and an enquiry form. Staff sign in to manage products and their photos, categories, the enquiries that come in, page content, user accounts and settings, with no developer in the loop and no redeploy.$$, $$$$, $$$$),
    (5, $$heading$$, $$Three tiers of access$$, $$$$, $$$$),
    (6, $$text$$, $$Not everyone who edits the site should be able to create logins for it, so access is three roles: admin, editor and viewer. Postgres row-level security enforces them, not hidden buttons, so an editor who forged a request would still be refused. Creating and deleting accounts needs a privileged key, so that runs in an Edge Function that checks the caller is an admin first.$$, $$$$, $$$$),
    (7, $$heading$$, $$Finding the one part$$, $$$$, $$$$),
    (8, $$text$$, $$Eighteen categories, from scaffolding to compact boards, and a search that runs as Postgres full-text search rather than filtering in the browser, so it keeps up as the range grows. Product photos have their own storage bucket and policies, and every query goes through one typed API layer, so a wrong data shape is caught when the code is built instead of in production.$$, $$$$, $$$$),
    (9, $$image$$, $$$$, $$/work/lexus/catalog.webp$$, $$The catalog: categories, search and product cards.$$),
    (10, $$heading$$, $$How it turned out$$, $$$$, $$$$),
    (11, $$text$$, $$What I like about this one is how boring it became to maintain. The catalog stays current because the people who know the products edit it themselves, and the role model makes handing someone a login a small decision instead of a risk.$$, $$$$, $$$$)
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$lexus-industrial$$;

delete from project_blocks where project_id = (select id from projects where slug = $$nam-landing-page$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$With the internal system in place, NAM still had no public presence: clients found the company by word of mouth or by walking in. It needed a site that showed its materials and services, and one the staff could keep current themselves.$$, $$$$, $$$$),
    (2, $$image$$, $$$$, $$/work/nam/website-cover.webp$$, $$nambuildersandsupplycorp.com on a laptop and a phone.$$),
    (3, $$heading$$, $$A CMS, not a static site$$, $$$$, $$$$),
    (4, $$text$$, $$I built the site on a small content management system in PHP and MySQL. The front end is a responsive Bootstrap layout with a hero, the company profile, a services gallery and a scrolling client carousel, and every one of those sections reads from the database. Staff sign in to manage services, clients, business figures and incoming enquiries, without touching code or calling me to change a price list.$$, $$$$, $$$$),
    (5, $$image$$, $$$$, $$https://i.imgur.com/ANs0s1j.jpeg$$, $$The public site: product categories, services and company information.$$),
    (6, $$heading$$, $$An admin staff actually use$$, $$$$, $$$$),
    (7, $$text$$, $$The real work was the admin side: a session-guarded login, validation on every write, image upload and replacement for services and client logos, and an editing flow simple enough that staff use it instead of going back to phone calls. Contact-form messages land in the same dashboard, so an enquiry is a record to work through, not an email someone might miss.$$, $$$$, $$$$),
    (8, $$image$$, $$$$, $$https://i.imgur.com/PxRGLfT.png$$, $$The dashboard where staff manage content and messages.$$),
    (9, $$image$$, $$$$, $$https://i.imgur.com/Ygerhu2.png$$, $$An edit in the admin goes straight to the database and shows on the site.$$),
    (10, $$heading$$, $$How it turned out$$, $$$$, $$$$),
    (11, $$text$$, $$The site is the company's main online presence, and staff keep it up themselves. Together with the sales platform, both sides of the business, what clients see and what the company runs on, are systems the company owns instead of documents kept by hand.$$, $$$$, $$$$)
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$nam-landing-page$$;

delete from project_blocks where project_id = (select id from projects where slug = $$pdao-helps$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$text$$, $$The Persons with Disability Affairs Office of Sto. Tomas ran on paper. Every ID application, renewal and appointment for the city's roughly 4,000 registered PWDs went through physical forms and office visits, so people travelled just to check a status, and staff could never see the data as a whole. I built this portal as my capstone project, under a memorandum of agreement with the city government.$$, $$$$, $$$$),
    (2, $$image$$, $$$$, $$/work/pdao/cover.webp$$, $$PDAO Helps: the barangay map and the application form.$$),
    (3, $$heading$$, $$Built for the people using it$$, $$$$, $$$$),
    (4, $$text$$, $$An accessibility widget, written from scratch rather than bought as an overlay, switches the site to high contrast, grayscale or a dyslexia-friendly font.$$, $$$$, $$$$),
    (5, $$image$$, $$$$, $$https://i.imgur.com/zhuQrSq.png$$, $$The public portal, with the accessibility widget.$$),
    (6, $$heading$$, $$Applications without the trip$$, $$$$, $$$$),
    (7, $$text$$, $$A multi-step form takes the applicant's details, uploads documents like medical certificates securely, and books an appointment, with daily slot limits checked against the database so a day can't be overbooked. Each applicant gets a reference number to follow their status online instead of coming in to ask.$$, $$$$, $$$$),
    (8, $$image$$, $$$$, $$https://i.imgur.com/T1QKCvh.png$$, $$The application form: personal details, documents and scheduling.$$),
    (9, $$image$$, $$$$, $$https://i.imgur.com/Fz9LVlL.png$$, $$The staff dashboard: applications in progress and today's schedule.$$),
    (10, $$heading$$, $$A map by barangay$$, $$$$, $$$$),
    (11, $$text$$, $$A Leaflet map shows how registered PWDs are spread across the barangays, with markers and shaded areas that filter by disability type or status, so the office can see where a medical mission or support program is needed.$$, $$$$, $$$$),
    (12, $$image$$, $$$$, $$https://i.imgur.com/Tr2BXpY.png$$, $$The GIS map, by barangay.$$),
    (13, $$heading$$, $$Reports without the compiling$$, $$$$, $$$$),
    (14, $$text$$, $$Charts break the records down by age, gender and employment, and the monthly report prints as a PDF instead of being compiled by hand.$$, $$$$, $$$$),
    (15, $$heading$$, $$How I worked$$, $$$$, $$$$),
    (16, $$text$$, $$The system went through structured testing and acceptance testing with the office staff before turnover. In development and every demo, the database held synthetic records I generated to match the city's real counts per barangay, realistic enough to prove the reports worked without a single real record leaving the office. It was handed over as a system the staff run themselves.$$, $$$$, $$$$)
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$pdao-helps$$;

delete from project_blocks where project_id = (select id from projects where slug = $$motion-films$$);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select p.id, b.kind, b.text, b.image_url, b.caption, b.ord
  from projects p,
  (values
    (1, $$image$$, $$$$, $$/work/films/cover.webp$$, $$Three films, all made in code: FixLink, Malaya Villas and PapaFix.$$),
    (2, $$text$$, $$I make product films the way I make products: in code. Each one is a React project rendered with Remotion, so a screen in the film is a real component, a wrong number is fixed by changing a line, and a new cut is a re-render instead of a re-edit.$$, $$$$, $$$$),
    (3, $$heading$$, $$FixLink: app walkthrough (commission)$$, $$$$, $$$$),
    (4, $$video$$, $$$$, $$/work/films/fixlink-walkthrough.mp4$$, $$FixLink app walkthrough, 2:30. Every name, address and price in it is invented.$$),
    (5, $$text$$, $$FixLink is a home-services app concept from a student's research, and the brief was a film that explains it from sign-up to review. I followed the client's own flow chart: nine steps, each shown on one phone, with the step's name on the left and a callout on the right. The app's screens are rebuilt as clean cards and made to work. A fingertip taps, fields fill in, a quote adds up, and the camera leans in on each tap. The soundtrack is written in code too, timed to the cuts, with a sound for every tap.$$, $$$$, $$$$),
    (6, $$heading$$, $$Malaya Villas: guest features$$, $$$$, $$$$),
    (7, $$video$$, $$$$, $$/work/films/malaya-features.mp4$$, $$Malaya Villas guest features, one minute.$$),
    (8, $$text$$, $$Made for the villa business whose booking system I build. It shows the guest's side, from searching dates to signing the waiver, one feature per beat, in the brand's own type and colours.$$, $$$$, $$$$),
    (9, $$heading$$, $$PapaFix: product reel$$, $$$$, $$$$),
    (10, $$video$$, $$$$, $$/work/films/papafix-reel.mp4$$, $$PapaFix product reel, 63 seconds. Also cut in 9:16 for social.$$),
    (11, $$text$$, $$A reel for the home-services app: booking, matching, live tracking, the QR check at the door, and payment. It comes in a wide cut and a vertical cut that share every frame and one soundtrack.$$, $$$$, $$$$),
    (12, $$heading$$, $$Why code$$, $$$$, $$$$),
    (13, $$text$$, $$A film built this way stays editable for as long as the product does. When a screen changes, I change the component and render again. I made a seven-minute training video for Malaya's staff the same way, from real screens with guest names replaced, so the people using the system could learn it without having to explore on their own.$$, $$$$, $$$$),
    (14, $$text$$, $$Music in the FixLink film uses the Salamander Grand Piano by Alexander Holm (CC BY 3.0), with instruments from Versilian Studios, FreePats and Karoryfer Samples.$$, $$$$, $$$$)
  ) as b(ord, kind, text, image_url, caption)
 where p.slug = $$motion-films$$;

commit;
