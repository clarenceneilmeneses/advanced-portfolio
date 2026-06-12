-- =============================================================
-- Seed data — content lifted from the reference page.
-- Run AFTER schema.sql. Safe to edit before running.
-- =============================================================

insert into profile (name, verified, location, headline, badge_text, badge_url, about, email, calendly_url, blog_url, speaking_text)
values (
  'Bryl Lim',
  true,
  'Metro Manila, Philippines',
  'AI \ Software Engineer \ Content Creator',
  'DICT OpenGov Hackathon 2025 Champion',
  'https://dict.gov.ph/news-and-updates/21070',
  'I''m a full-stack software engineer specializing in developing solutions with JavaScript, Python, and PHP. I work on projects including building modern web applications, mobile apps, search engine optimization, digital marketing, and making code tutorials.

I''ve helped startups and MSMEs grow and streamline their processes through software solutions. I''ve also built a community of over 200,000 developers sharing knowledge and mentorship.

Lately, I''ve been diving deeper into the world of artificial intelligence, focusing on integrating AI tools and techniques into modern applications. My work now includes developing AI-powered solutions, creating intelligent applications, and leveraging generative AI to optimize development workflows and deliver cutting-edge technology.',
  'bryllim@gmail.com',
  'https://calendly.com/bryllim/consultation',
  'https://blog.bryllim.com/',
  'Available for speaking at events about software development and emerging technologies.'
);

insert into tech_stack (category, name, sort_order) values
('Frontend', 'JavaScript', 1), ('Frontend', 'TypeScript', 2), ('Frontend', 'React', 3),
('Frontend', 'Next.js', 4), ('Frontend', 'Vue.js', 5), ('Frontend', 'Tailwind CSS', 6),
('Backend', 'Node.js', 7), ('Backend', 'Python', 8), ('Backend', 'PHP', 9),
('Backend', 'Laravel', 10), ('Backend', 'PostgreSQL', 11), ('Backend', 'MongoDB', 12),
('DevOps & Cloud', 'AWS', 13), ('DevOps & Cloud', 'Docker', 14),
('DevOps & Cloud', 'Kubernetes', 15), ('DevOps & Cloud', 'GitHub Actions', 16);

insert into projects (title, description, url, display_url, slug, tech, published, sort_order) values
('CodeCred', 'Online certifications for programmers', 'https://codecred.dev/', 'codecred.dev', 'codecred', 'Next.js, Node.js, PostgreSQL', true, 1),
('BASE404', 'Online coding bootcamp', 'https://base-404.com/', 'base-404.com', 'base404', 'Laravel, Vue.js, MySQL', true, 2),
('DIIN.PH', 'AI-powered wardrobe assistant', 'https://diin.ph/', 'diin.ph', 'diin-ph', 'Next.js, Python, OpenAI', true, 3),
('DYNAMIS Workout Tracker', 'AI-powered workout tracker', 'https://dynamis-app.online/', 'dynamis-app.online', 'dynamis', 'React Native, Supabase', true, 4);

insert into project_blocks (project_id, kind, text, sort_order)
select id, 'heading', 'The problem', 1 from projects where slug = 'codecred'
union all
select id, 'text', 'Developers collect skills faster than they can prove them. CodeCred started as a way to issue verifiable, shareable certifications that employers can actually trust.', 2 from projects where slug = 'codecred'
union all
select id, 'heading', 'What I built', 3 from projects where slug = 'codecred'
union all
select id, 'text', 'I designed and shipped the full platform: assessment engine, certificate issuing with public verification pages, and the payment flow. Replace this with your own write-up — add headings, paragraphs and images from the admin panel.', 4 from projects where slug = 'codecred';

insert into experiences (title, organization, year_label, is_current, sort_order) values
('AI Engineer', 'Standard Chartered', '2025', true, 1),
('AI Ops Engineer', 'Centre of Excellence for GenAI, Cambridge', '2025', false, 2),
('Senior Full-Stack Developer', 'Core Technology, Cambridge', '2024', false, 3),
('Software Engineering Lead', 'PocketDevs', '2022', false, 4),
('Lead Application Developer', 'Bluewind Asia', '2021', false, 5),
('Software Engineer', 'GCM', '2020', false, 6),
('BS Information Technology', 'University of San Carlos', '2019', false, 7),
('Hello World! 👋🏻', 'Wrote my first line of code', '2015', false, 8);

insert into certifications (title, issuer, url, sort_order) values
('Huawei Developer Expert', 'Huawei', '', 1),
('Generative AI Leader', 'Google', 'https://www.credly.com/badges/d4ea07f0-f7f1-4889-8b15-2a0ec22850ff/public_url', 2),
('Software Engineering', 'TestDome', 'https://app.testdome.com/cert/e802401d0f874e78b3e4bceff900c52f', 3),
('Generative AI Professional', 'Oracle', 'https://catalog-education.oracle.com/pls/certview/sharebadge?id=F0EB18EE68E7EB1AD69624684FB5B8ABB18AC8852C247882BE5DF4E51D7AAB07', 4);

insert into memberships (name, url, sort_order) values
('Analytics & Artificial Intelligence Association of the Philippines (AAP)', 'https://www.aap.ph/', 1),
('Philippine Software Industry Association', 'https://www.psia.org.ph/', 2);

insert into social_links (platform, url, sort_order) values
('LinkedIn', 'https://linkedin.com/in/bryllim', 1),
('GitHub', 'https://github.com/bryllim', 2),
('Instagram', 'https://www.instagram.com/bryl.lim/', 3);

insert into highlights (kind, title, subtitle, member_name, link_url, sort_order) values
('access_card', 'DEVS ONE HUNDRED', 'Founding Member', 'BRYL', '', 1);
