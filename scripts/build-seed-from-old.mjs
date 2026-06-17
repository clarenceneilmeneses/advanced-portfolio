// Reads old-portfolio-dump.json (Payload CMS export) and emits
// supabase/seed-from-old.sql — real data mapped onto the new schema.
import { readFileSync, writeFileSync } from "node:fs";

const dump = JSON.parse(readFileSync("old-portfolio-dump.json", "utf8"));

// --- helpers ---
const q = (v) => (v == null ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const stripHtml = (s) =>
  (s || "")
    .replace(/<\/?b>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .trim();
const noProto = (u) =>
  (u || "").replace(/^https?:\/\//i, "").replace(/\/+$/, "");
const withProto = (u) =>
  !u ? "" : /^https?:\/\//i.test(u) ? u : `https://${u}`;

let sql = `-- =============================================================
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

`;

// --- tech_stack (restructured to match the resume's skill groups) ---
sql += `-- ---------- tech_stack ----------\n`;
const techGroups = [
  ["Backend & Databases", ["PHP", "MySQL", "SQL", "REST APIs", "Python"]],
  ["Frontend", ["JavaScript", "HTML5", "CSS3", "Bootstrap", "Figma"]],
  ["Data & Analytics", ["Power BI", "Microsoft Excel", "Google Analytics", "Google Ads"]],
  ["QA & Tools", ["Git/GitHub", "VS Code", "GIS Mapping", "UAT & System Testing"]],
];
const techRows = [];
let tOrder = 1;
for (const [category, items] of techGroups)
  for (const item of items) techRows.push(`(${q(category)}, ${q(item)}, ${tOrder++})`);
sql += `insert into tech_stack (category, name, sort_order) values\n  ${techRows.join(",\n  ")};\n\n`;

// --- certifications ---
sql += `-- ---------- certifications ----------\n`;
const certs = [...(dump.certifications || [])].sort(
  (a, b) => (a.priority ?? 99) - (b.priority ?? 99)
);
const certRows = certs.map((c, i) =>
  `(${q(c.title)}, ${q(c.issuer)}, ${q(c.credentialUrl || "")}, ${c.priority === 1 ? "true" : "false"}, ${i + 1})`
);
if (certRows.length)
  sql += `insert into certifications (title, issuer, url, featured, sort_order) values\n  ${certRows.join(",\n  ")};\n\n`;

// --- experiences (resume-accurate dates, newest first; personal milestones kept) ---
sql += `-- ---------- experiences ----------\n`;
const experiences = [
  ["IT Intern / Systems Developer", "ALM Management Services & NAM Builders Supply Corp", "Feb – Apr 2026", false],
  ["Full-Stack Web Developer (Sole Developer, Contract)", "Persons with Disability Affairs Office (PDAO), City of Sto. Tomas", "May – Dec 2025", false],
  ["Freelance UI Designer", "THEEA Agency (Australia)", "2025", false],
  ["Commissioned Artist", "Freelance (US Clients)", "2024", false],
  ["BS Information Technology — Business Analytics", "Batangas State University", "2022 – 2026", true],
  ["Hello World! 👋🏻", "Wrote my first line of code", "2022", false],
];
const expRows = experiences.map(([title, org, year, cur], i) =>
  `(${q(title)}, ${q(org)}, ${q(year)}, ${cur}, ${i + 1})`
);
sql += `insert into experiences (title, organization, year_label, is_current, sort_order) values\n  ${expRows.join(",\n  ")};\n\n`;

// --- projects + project_blocks ---
sql += `-- ---------- projects + case-study blocks ----------\n`;
(dump.projects || []).forEach((p, i) => {
  const slug = p.id || p._id;
  const tech = (p.tags || []).map((t) => t.tag).join(", ");
  sql += `insert into projects (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order) values (\n`;
  sql += `  ${q((p.title || "").trim())}, ${q((p.subtitle || "").trim())}, ${q(withProto(p.link))}, ${q(noProto(p.link))},\n`;
  sql += `  ${q(slug)}, ${q(tech)}, ${q(p.image || "")}, ${p.isFeatured ? "true" : "false"}, true, ${i + 1});\n`;

  const blocks = p.contentBlocks || [];
  if (blocks.length) {
    const values = blocks.map((b, j) => {
      const so = j + 1;
      if (b.type === "image")
        return `select id, 'image', '', ${q(b.content || "")}, ${q(b.caption || "")}, ${so} from projects where slug = ${q(slug)}`;
      return `select id, 'text', ${q(stripHtml(b.content))}, '', '', ${so} from projects where slug = ${q(slug)}`;
    });
    sql += `insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)\n  ${values.join("\n  union all\n  ")};\n`;
  }
  sql += `\n`;
});

// --- profile / memberships / social_links / highlights ---
// (These weren't in the DB — they were hard-coded in the old Express app,
//  so they're transcribed here. Edit freely before running.)
sql += `-- ---------- profile (single row) ----------\n`;
const about =
  "I'm a full-stack web developer and Business Analytics student at Batangas State University (BS Information Technology, Class of 2026). I build data tools end-to-end — from PHP/MySQL web systems to automated Power BI reporting pipelines.\n\n" +
  "As the sole developer, I architected and deployed a government Client Management & Analytics Portal for the Persons with Disability Affairs Office of Sto. Tomas — digitizing 2,000+ records, mapping all 30 barangays via GIS, and shipping with zero critical defects at turnover.\n\n" +
  "I'm Google-certified in Analytics and Ads Measurement, and I work across PHP, MySQL, JavaScript, REST APIs, and Power BI, with a strong QA and testing discipline.";
sql += `delete from profile;
insert into profile (name, verified, location, headline, badge_text, badge_url, about, avatar_url, email, calendly_url, blog_url, speaking_text) values (
  ${q("Clarence Neil Meneses")}, true, ${q("Tanauan City, Batangas")}, ${q("Full-Stack Web Developer \\ Data Analyst")},
  '', '', ${q(about)}, '', ${q("clarenceneilpamplona@gmail.com")},
  ${q("https://calendly.com/clarenceneilpamplona/30min")}, '', '');

`;

sql += `-- ---------- memberships ----------\n`;
sql += `delete from memberships;
insert into memberships (name, url, sort_order) values
  (${q("BatStateU CICS")}, '', 1),
  (${q("JPLPC Students")}, '', 2);

`;

sql += `-- ---------- social_links (from resume) ----------\n`;
sql += `delete from social_links;
insert into social_links (platform, url, sort_order) values
  (${q("GitHub")}, ${q("https://github.com/clarenceneilmeneses")}, 1),
  (${q("LinkedIn")}, ${q("https://linkedin.com/in/clarenceneilmeneses")}, 2);

`;

sql += `-- ---------- highlights (right-column card) ----------\n`;
sql += `delete from highlights;
insert into highlights (kind, title, subtitle, member_name, image_url, link_url, sort_order) values
  (${q("access_card")}, ${q("BS INFORMATION TECHNOLOGY")}, ${q("Class of 2026")}, ${q("CLARENCE")}, '', '', 1);

`;

sql += `commit;\n`;

writeFileSync("supabase/seed-from-old.sql", sql);
console.log("Wrote supabase/seed-from-old.sql");
console.log(
  `tech_stack rows: ${techRows.length}, certifications: ${certRows.length}, experiences: ${expRows.length}, projects: ${(dump.projects || []).length}`
);
