-- =============================================================
-- seed-from-old.sql  —  AUTO-GENERATED from the old Payload CMS DB
-- Run this in the Supabase SQL Editor (replaces the mock seed data).
-- DB-sourced: tech_stack, certifications, experiences, projects, blocks.
-- App-sourced (hard-coded in the old Express app): profile, memberships,
-- social_links, highlights.  Gallery had no source and is left untouched.
-- =============================================================

begin;

-- Clear the mock rows for the sections we are migrating
delete from project_blocks;
delete from projects;
delete from experiences;
delete from certifications;
delete from tech_stack;

-- ---------- tech_stack ----------
insert into tech_stack (category, name, sort_order) values
  ('Backend & Databases', 'PHP', 1),
  ('Backend & Databases', 'MySQL', 2),
  ('Backend & Databases', 'SQL', 3),
  ('Backend & Databases', 'REST APIs', 4),
  ('Backend & Databases', 'Python', 5),
  ('Frontend', 'JavaScript', 6),
  ('Frontend', 'HTML5', 7),
  ('Frontend', 'CSS3', 8),
  ('Frontend', 'Bootstrap', 9),
  ('Frontend', 'Figma', 10),
  ('Data & Analytics', 'Power BI', 11),
  ('Data & Analytics', 'Microsoft Excel', 12),
  ('Data & Analytics', 'Google Analytics', 13),
  ('Data & Analytics', 'Google Ads', 14),
  ('QA & Tools', 'Git/GitHub', 15),
  ('QA & Tools', 'VS Code', 16),
  ('QA & Tools', 'GIS Mapping', 17),
  ('QA & Tools', 'UAT & System Testing', 18);

-- ---------- certifications ----------
insert into certifications (title, issuer, url, featured, sort_order) values
  ('Google Analytics Certification', 'Google Digital Academy (Skillshop)', 'https://skillshop.credential.net/d7e607f2-2faa-4da6-be75-c4a36bca279f#acc.BIlNfKc6', true, 1),
  ('Google Ads Measurement Certification', 'Google Digital Academy (Skillshop)', 'https://skillshop.credential.net/d7e607f2-2faa-4da6-be75-c4a36bca279f#acc.BIlNfKc6', true, 2),
  ('Introduction to Data Science', 'Cisco Networking Academy', 'https://www.credly.com/badges/93c9dc92-0cc2-49f3-852c-94ad43e5e20f', false, 3),
  ('Introduction to Cybersecurity', 'Cisco Networking Academy', 'https://www.credly.com/badges/66dc61e7-c5ee-41ea-b795-c73bcca81991', false, 4);

-- ---------- experiences ----------
insert into experiences (title, organization, year_label, is_current, sort_order) values
  ('IT Intern / Systems Developer', 'ALM Management Services & NAM Builders Supply Corp', 'Feb – Apr 2026', false, 1),
  ('Full-Stack Web Developer (Sole Developer, Contract)', 'Persons with Disability Affairs Office (PDAO), City of Sto. Tomas', 'May – Dec 2025', false, 2),
  ('Freelance UI Designer', 'THEEA Agency (Australia)', '2025', false, 3),
  ('Commissioned Artist', 'Freelance (US Clients)', '2024', false, 4),
  ('BS Information Technology — Business Analytics', 'Batangas State University', '2022 – 2026', true, 5),
  ('Hello World! 👋🏻', 'Wrote my first line of code', '2022', false, 6);

-- ---------- projects + case-study blocks ----------
insert into projects (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order) values (
  'PDAO Helps: PWD Services & Data Management System (City Government of Sto. Tomas, Batangas Persons with Disability Affairs Office)', 'A centralized web platform digitizing PWD ID applications, appointment scheduling, and demographic mapping for local government units.', 'https://pdaohelps.online', 'pdaohelps.online',
  'pdao-helps', 'PHP, MySQL, JavaScript, Leaflet.js, Chart.js, GIS Mapping, Web Accessibility, Full Stack Development, Capstone Project', 'https://i.imgur.com/iD0KcsF.jpeg', true, true, 1);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
  select id, 'text', 'I developed this entirely as a capstone project for my 4th-year thesis, this system addresses the lack of digital infrastructure in local PWD Affairs Offices (PDAO). It transitions manual, paper-based workflows into a secure web application, allowing constituents to access services remotely while giving administrators powerful tools to manage records and visualize community data.', '', '', 1 from projects where slug = 'pdao-helps'
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
  select id, 'image', '', 'https://i.imgur.com/YCqK1Ot.png', '', 9 from projects where slug = 'pdao-helps'
  union all
  select id, 'text', 'The Analytics module transforms raw database records into actionable insights. Using Chart.js, I created dynamic visualizations for demographic data, including age distribution, gender, and employment status. The system also generates printable PDF reports, automating what used to be a tedious manual compilation process for monthly reporting.', '', '', 10 from projects where slug = 'pdao-helps'
  union all
  select id, 'text', 'This capstone project was a culmination of my studies, challenging me to architect a full-scale system from the database schema up to the user interface. By solving real-world problems like data inaccessibility and manual processing, PDAO Helps demonstrates how student-led innovation can provide tangible value to public service administration.', '', '', 11 from projects where slug = 'pdao-helps';

insert into projects (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order) values (
  'Holiday Hunter: Global Holiday Data Visualization', 'A maximalist global dashboard discovering the world''s best days off.', 'https://holiday-hunter.vercel.app/', 'holiday-hunter.vercel.app',
  'holiday-hunter', 'React, Next.js, TypeScript, REST APIs, Data Visualization, Recharts, Tailwind CSS', 'https://i.imgur.com/Q3nmIgJ.png', false, true, 2);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
  select id, 'text', 'Holiday Hunter is a high-energy, data-driven dashboard designed to answer a single, critical question: "Which country has the most holidays?" Built with a maximalist "cyber-neon" aesthetic, the application fetches real-time data from the Nager.Date API to analyze public holiday schedules across hundreds of nations. It transforms raw dates into an engaging visual experience, helping users discover the "laziest" places on Earth through interactive elements and real-time metrics.', '', '', 1 from projects where slug = 'holiday-hunter'
  union all
  select id, 'image', '', 'https://i.imgur.com/G8ts5jd.png', 'The hero section featuring glassmorphism cards and maximalist typography.', 2 from projects where slug = 'holiday-hunter'
  union all
  select id, 'text', 'The Hero section  immediately engages users with 3D-tilted glassmorphism cards that display high-level metrics, such as the total number of global breaks found and the number of countries scanned. The background features animated floating emojis and grain effects to create a dynamic, living texture.', '', '', 3 from projects where slug = 'holiday-hunter'
  union all
  select id, 'image', '', 'https://i.imgur.com/J8lBM8m.png', 'The interactive holographic world map allowing users to explore holiday data geographically.', 4 from projects where slug = 'holiday-hunter'
  union all
  select id, 'text', 'This interactive 3D globe auto-rotates and allows users to hover over countries to see instant holiday counts. Clicking a country opens a detailed side drawer (Sheet) listing every upcoming holiday, complete with local names and dates. The map uses a color scale to visually differentiate countries based on the density of their holiday calendar.', '', '', 5 from projects where slug = 'holiday-hunter'
  union all
  select id, 'image', '', 'https://i.imgur.com/lAcmR60.png', 'The animated podium ranking the top 3 countries with the most holidays.', 6 from projects where slug = 'holiday-hunter'
  union all
  select id, 'text', 'To gamify the data, I implemented a "Laziness Leaderboard" that programmatically sorts fetched countries to construct a virtual podium for the top three contenders. This section uses heavy animation and CSS transforms to highlight the winners. Below the podium, an "Honorable Mentions" list provides a collapsible, detailed view of other countries, utilizing a custom progress bar to compare their holiday counts against the leader.', '', '', 7 from projects where slug = 'holiday-hunter'
  union all
  select id, 'text', 'Holiday Hunter successfully transforms dry calendar data into an engaging, gamified experience through bold design and interactive data visualization. By combining complex UI libraries like react-simple-maps and recharts with a distinct maximalist identity, the project demonstrates how functional data dashboards can also be visually immersive and entertaining. It solves the challenge of presenting massive global datasets in a way that is digestible, responsive, and fun to explore.', '', '', 8 from projects where slug = 'holiday-hunter';

insert into projects (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order) values (
  'CET Tracker PH', 'A comprehensive web application for tracking Philippine college entrance exam schedules and requirements.', 'https://cet-tracker-app.vercel.app/', 'cet-tracker-app.vercel.app',
  'cet-tracker', 'Next.js 16, TypeScript, Supabase, Tailwind CSS v4, Shadcn UI, OpenAI API, AI Integration, Full Stack', 'https://i.imgur.com/RdnQ6UT.png', false, true, 3);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
  select id, 'text', 'CET Tracker PH is a centralized platform designed to simplify the college application process for Filipino students. It aggregates crucial information such as application deadlines, exam dates, and document requirements for major universities like UP, Ateneo, and DLSU into one accessible interface. By providing a clear, searchable database, the app eliminates the need for students to navigate multiple confused websites to find admission details.', '', '', 1 from projects where slug = 'cet-tracker'
  union all
  select id, 'image', '', 'https://i.imgur.com/kykUpzZ.png', 'The landing page features a clean, responsive search interface and academic year filtering.', 2 from projects where slug = 'cet-tracker'
  union all
  select id, 'text', 'The core of the user experience is the dynamic University Selector. Users can filter universities by name or academic year, instantly viewing their application status (Open, Upcoming, or Closed). Real-time status indicators use color-coded badges to create an immediate visual hierarchy, ensuring students never miss a critical deadline.', '', '', 3 from projects where slug = 'cet-tracker'
  union all
  select id, 'image', '', 'https://i.imgur.com/CfrMgM1.png', 'Detailed view displaying specific requirements, testing locations, and admission links.', 4 from projects where slug = 'cet-tracker'
  union all
  select id, 'text', 'Selecting a university reveals a comprehensive details panel. This section breaks down complex admission data into digestible cards: application periods, exam dates with specific notes, result release targets, and a checklist of requirements. Direct links to official admission portals are included to facilitate the actual application process.', '', '', 5 from projects where slug = 'cet-tracker'
  union all
  select id, 'image', '', 'https://i.imgur.com/cUZSfhH.png', 'Admin Login', 6 from projects where slug = 'cet-tracker'
  union all
  select id, 'text', 'To keep information current, the system includes a secure Admin Dashboard protected by Supabase Authentication.', '', '', 7 from projects where slug = 'cet-tracker'
  union all
  select id, 'image', '', 'https://i.imgur.com/Exm0raF.png', 'Admin Dashboard', 8 from projects where slug = 'cet-tracker'
  union all
  select id, 'text', 'Administrators can perform full CRUD (Create, Read, Update, Delete) operations on university data and manage global announcements. The dashboard provides a statistical overview of total tracked universities and their current application statuses.', '', '', 9 from projects where slug = 'cet-tracker';

insert into projects (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order) values (
  'Gastos Tracker', 'My personal attempt to stop being broke and finally manage my baon properly.', 'https://gastos-tracking-app.vercel.app/', 'gastos-tracking-app.vercel.app',
  'gastos-tracker', 'Next.js 16, TypeScript, Tailwind CSS, Supabase, shadcn/ui, Recharts, Personal Project, Learning', 'https://i.imgur.com/Qhg6Iej.png', false, true, 4);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
  select id, 'text', 'I''ve always struggled with budgeting my allowance ("baon"), often running out of cash way before the week ends. I decided to build Gastos Tracker as a solution to my own problem, while simultaneously challenging myself to learn a completely modern tech stack with Next.js 16 and Supabase.', '', '', 1 from projects where slug = 'gastos-tracker'
  union all
  select id, 'image', '', 'https://i.imgur.com/wOgUEfT.png', 'The Daily Dashboard acts as my daily reality check for my allowance.', 2 from projects where slug = 'gastos-tracker'
  union all
  select id, 'text', 'The Daily Dashboard is the heart of the app. I set my daily allowance limit here, and the progress bar shifts colors to scream at me (red) if I''m spending too fast. I designed it to be super simple and responsive so I have no excuse not to log my expenses when I''m out', '', '', 3 from projects where slug = 'gastos-tracker'
  union all
  select id, 'image', '', 'https://i.imgur.com/c8rTpec.png', 'A streamlined transaction entry form with category selection and automatic date handling.', 4 from projects where slug = 'gastos-tracker'
  union all
  select id, 'text', 'Since I need to log things quickly, I built a streamlined transaction form. I can toggle between income (when I get my allowance) and expenses, then tag them with categories like Food or Transport. This data is saved instantly to Supabase, which was a joy to experiment with for the backend.', '', '', 5 from projects where slug = 'gastos-tracker'
  union all
  select id, 'image', '', 'https://i.imgur.com/UwKxxD7.png', 'My attempt at visualizing where all my money actually goes.', 6 from projects where slug = 'gastos-tracker'
  union all
  select id, 'text', 'I used Recharts to visualize my spending habits, which helps me realize exactly how much of my "baon" goes to specific things like snacks or travel.', '', '', 7 from projects where slug = 'gastos-tracker'
  union all
  select id, 'image', '', 'https://i.imgur.com/OPpj2ie.png', 'Setting harder limits for myself on specific categories.', 8 from projects where slug = 'gastos-tracker'
  union all
  select id, 'text', 'To get better at saving, I added a Monthly Budget view where I can cap my spending on certain categories. It’s my way of planning ahead so I don''t blow my entire budget on one thing early in the month.', '', '', 9 from projects where slug = 'gastos-tracker'
  union all
  select id, 'text', 'Building Gastos Tracker didn''t just help me save money; it gave me hands-on experience with the latest web technologies. It’s a personal tool that solved a real problem for me while helping me level up my engineering skills.', '', '', 10 from projects where slug = 'gastos-tracker';

insert into projects (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order) values (
  'Dynamic Personal Portfolio & CMS', 'A self-engineered platform for showcasing professional work with a built-in content management system.', 'https://clarencemeneses.vercel.app/', 'clarencemeneses.vercel.app',
  'dynamic-portfolio-cms', 'Node.js, Express.js, MongoDB, Mongoose, Server-Side Rendering, Authentication, CSS3, Vercel', 'https://i.imgur.com/4sX99rV.png', false, true, 5);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
  select id, 'text', 'This project started as an exploration into backend development, moving away from static HTML sites to a fully dynamic application. I built a custom Content Management System (CMS) using Node.js and Express to serve as the backbone, allowing me to treat my portfolio as a living document that grows with my skills.', '', '', 1 from projects where slug = 'dynamic-portfolio-cms'
  union all
  select id, 'image', '', 'https://i.imgur.com/1oxcZ5D.png', 'The public-facing interface displaying dynamically fetched project cards.', 2 from projects where slug = 'dynamic-portfolio-cms'
  union all
  select id, 'text', 'The core of the system is the backend architecture built with Node.js and Express. I utilized Mongoose schemas to structure data for Projects, Experience, and Certifications, allowing for strict data modeling while maintaining the flexibility to scale. The application employs Server-Side Rendering (SSR) using JavaScript template literals to deliver fast, SEO-friendly HTML directly to the browser.', '', '', 3 from projects where slug = 'dynamic-portfolio-cms'
  union all
  select id, 'text', 'To manage content efficiently, I developed a secure Admin Dashboard restricted by custom middleware authentication. This dashboard provides a CRUD (Create, Read, Update, Delete) interface, enabling the management of the portfolio''s content without needing to touch the codebase or database directly.', '', '', 4 from projects where slug = 'dynamic-portfolio-cms'
  union all
  select id, 'image', '', 'https://i.imgur.com/tZzjzye.png', 'The secure Admin Dashboard for managing portfolio content.', 5 from projects where slug = 'dynamic-portfolio-cms'
  union all
  select id, 'text', 'One of the key engineering challenges solved was creating a "Dynamic Content Block" system. I designed a flexible data structure that allows me to mix and match text paragraphs and image blocks in any order for project detail pages. This ensures that case studies can be formatted uniquely depending on the content required, rather than being stuck in a rigid layout.', '', '', 6 from projects where slug = 'dynamic-portfolio-cms'
  union all
  select id, 'image', '', 'https://i.imgur.com/cvIDR1E.png', 'The dynamic form interface allowing flexible content creation.', 7 from projects where slug = 'dynamic-portfolio-cms'
  union all
  select id, 'text', 'The frontend implementation focuses on user experience and accessibility, featuring a custom dark mode toggle that persists user preference via local storage. The design uses CSS Grid and Flexbox for a fully responsive layout, ensuring the portfolio looks professional on devices ranging from mobile phones to large desktop screens.', '', '', 8 from projects where slug = 'dynamic-portfolio-cms'
  union all
  select id, 'text', 'This project successfully transitioned my portfolio from a static page to a dynamic, scalable web application. By building a custom CMS, I gained deep insights into authentication flows, database schema design, and server-side logic, resulting in a system that makes keeping my professional presence up-to-date effortless.', '', '', 9 from projects where slug = 'dynamic-portfolio-cms';

insert into projects (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order) values (
  'NAM Builders Supply Corp - Inventory & Sales Analytics System', 'Transforming manual operations into data-driven success.', 'https://nam-internal.org/', 'nam-internal.org',
  'nam-inventory-system', 'PHP, Full-Stack Development, Data Analytics, Database Management, System Architecture, Business Intelligence', 'https://i.imgur.com/9Ook8yd.png', true, true, 6);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
  select id, 'text', 'Landing an internship at NAM Builders Supply Corp was the perfect opportunity to bridge the gap between classroom theory and real-world application. I noticed their operations could benefit from a more streamlined approach to tracking inventory and sales. Taking the initiative, I began developing a full-stack inventory and sales analytics system from the ground up, diving deep into PHP and database management to build a solution tailored specifically to their daily workflow.', '', '', 1 from projects where slug = 'nam-inventory-system'
  union all
  select id, 'image', '', 'https://i.imgur.com/EuIy8Ht.png', 'Tracking total sales and key metrics at a glance.', 2 from projects where slug = 'nam-inventory-system'
  union all
  select id, 'text', 'The development process was a massive learning curve. I implemented features like automated quotation generation, delivery tracking, and centralized supplier price management. I had to learn how to structure the database to handle bulk CSV imports and manage different user roles securely. It was incredibly rewarding to figure out how to take raw data and turn it into actionable insights that the company could actually use to make business decisions.', '', '', 3 from projects where slug = 'nam-inventory-system'
  union all
  select id, 'image', '', 'https://i.imgur.com/7hpDunP.png', 'Inventory Management: Centralized supplier pricing and bulk data handling.', 4 from projects where slug = 'nam-inventory-system'
  union all
  select id, 'text', 'The most fulfilling part of this project was seeing it go live. The system was officially implemented and is now actively being used by the company''s staff. It replaced their old manual processes, significantly boosting their operational performance and contributing to a noticeable increase in company revenue. Building a full-stack system that solves a real business problem and delivers tangible results was an invaluable experience.', '', '', 5 from projects where slug = 'nam-inventory-system';

insert into projects (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order) values (
  'NAM Builders Supply Corp - Official Website', 'Establishing a digital presence with a dynamic, custom-built CMS.', 'https://nambuildersandsupplycorp.com/', 'nambuildersandsupplycorp.com',
  'nam-landing-page', 'PHP, CMS Development, Front-End Design, JavaScript, Web Architecture, MySQL', 'https://i.imgur.com/I5algSI.png', true, true, 7);
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
  select id, 'text', 'Continuing my work with NAM Builders Supply Corp, I noticed that while their internal operations were becoming more efficient, they needed a strong public-facing digital presence. I took the initiative to design and develop their official company website from scratch. The goal was to create a modern, responsive platform to showcase their building materials, services, and company milestones to potential clients.', '', '', 1 from projects where slug = 'nam-landing-page'
  union all
  select id, 'image', '', 'https://i.imgur.com/ANs0s1j.jpeg', 'Official Website: A responsive and modern digital storefront to attract new clients.', 2 from projects where slug = 'nam-landing-page'
  union all
  select id, 'text', 'I knew a static website wouldn''t be enough for a growing business, so I built a fully functional, custom Content Management System (CMS) alongside it using PHP and MySQL. I developed a secure admin dashboard that allows the company''s staff to dynamically update the website''s content themselves. They can seamlessly add new supply categories, update live business statistics, and manage incoming client messages directly from the backend without needing to touch a single line of code.', '', '', 3 from projects where slug = 'nam-landing-page'
  union all
  select id, 'image', '', 'https://i.imgur.com/PxRGLfT.png', 'Custom Admin Dashboard: Empowering staff to manage website content and client messages dynamically.', 4 from projects where slug = 'nam-landing-page'
  union all
  select id, 'text', 'Developing this system pushed my full-stack skills to the next level, particularly in building secure backend interfaces and connecting them to dynamic front-end components. The website is now officially deployed and serves as the company''s primary online footprint. Seeing the staff actively use the admin panel to update their services and interact with website data is incredibly rewarding, proving the value of building scalable, user-friendly tech solutions for real businesses.', '', '', 5 from projects where slug = 'nam-landing-page'
  union all
  select id, 'image', '', 'https://i.imgur.com/Ygerhu2.png', 'Content Management: Real-time database updates for seamless website maintenance.', 6 from projects where slug = 'nam-landing-page';

-- ---------- profile (single row) ----------
delete from profile;
insert into profile (name, verified, location, headline, badge_text, badge_url, about, avatar_url, email, calendly_url, blog_url, speaking_text) values (
  'Clarence Neil Meneses', true, 'Tanauan City, Batangas', 'Full-Stack Web Developer \ Data Analyst',
  '', '', 'I''m a full-stack web developer and Business Analytics student at Batangas State University (BS Information Technology, Class of 2026). I build data tools end-to-end — from PHP/MySQL web systems to automated Power BI reporting pipelines.

As the sole developer, I architected and deployed a government Client Management & Analytics Portal for the Persons with Disability Affairs Office of Sto. Tomas — digitizing 2,000+ records, mapping all 30 barangays via GIS, and shipping with zero critical defects at turnover.

I''m Google-certified in Analytics and Ads Measurement, and I work across PHP, MySQL, JavaScript, REST APIs, and Power BI, with a strong QA and testing discipline.', '', 'clarenceneilpamplona@gmail.com',
  'https://calendly.com/clarenceneilpamplona/30min', '', '');

-- ---------- memberships ----------
delete from memberships;
insert into memberships (name, url, sort_order) values
  ('BatStateU CICS', '', 1),
  ('JPLPC Students', '', 2);

-- ---------- social_links (from resume) ----------
delete from social_links;
insert into social_links (platform, url, sort_order) values
  ('GitHub', 'https://github.com/clarenceneilmeneses', 1),
  ('LinkedIn', 'https://linkedin.com/in/clarenceneilmeneses', 2);

-- ---------- highlights (right-column card) ----------
delete from highlights;
insert into highlights (kind, title, subtitle, member_name, image_url, link_url, sort_order) values
  ('access_card', 'BS INFORMATION TECHNOLOGY', 'Class of 2026', 'CLARENCE', '', '', 1);

commit;
