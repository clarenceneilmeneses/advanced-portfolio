# Portfolio Content Generator — Prompt Pack

**Paste this whole file into another AI (ChatGPT, Claude, Gemini, etc.), then
describe your project(s) at the bottom.** The AI's job is to turn your plain
description into **ready-to-run PostgreSQL `INSERT` statements** that drop
straight into the Supabase SQL Editor for this portfolio.

You (the human) run the AI's output here:
**Supabase dashboard → SQL Editor → paste → Run.**

---

## 0. Instructions to the AI (read this first)

You are generating SQL seed data for a Next.js + Supabase portfolio CMS.

- Output **only valid PostgreSQL**, wrapped in a single `begin; … commit;`
  transaction, inside one ```sql code block. No prose outside the code block
  unless the user asks.
- Follow the **schema** and **rules** below exactly. Do not invent columns.
- Write in the **first person** ("I built…", "I designed…") to match the
  owner's voice, unless told otherwise.
- If the user's description is thin, write a reasonable, concrete case study —
  but never fabricate specific metrics, employers, or dates. Leave a
  `-- TODO:` comment where a real number/link is needed.
- Ask for anything you genuinely need (e.g. live URL, cover image URL) instead
  of guessing it.

---

## 1. Data model (the tables you can write to)

### `projects` — one row per project (the card + case-study header)

| column | type | notes |
|---|---|---|
| `title` | text | Project name. |
| `description` | text | **Short** one-line tagline for the project card. |
| `url` | text | Full live link incl. `https://`. Empty string if none. |
| `display_url` | text | Pretty label, e.g. `myapp.com` (no `https://`, no trailing `/`). |
| `slug` | text | **Unique**, lowercase, kebab-case. Used in `/projects/<slug>`. |
| `cover_image_url` | text | Hero image URL (https). Empty string if none. |
| `tech` | text | **Comma-separated** chips, e.g. `Next.js, Node.js, PostgreSQL`. |
| `featured` | boolean | `true` shows it in "Featured Projects" on the home page. |
| `published` | boolean | `true` to make it live. |
| `sort_order` | int | Lower = shown first. |

### `project_blocks` — the case-study body (heading / text / image)

| column | type | notes |
|---|---|---|
| `project_id` | uuid | **Don't hard-code** — select it by slug (see §3). |
| `kind` | text | **Must be one of** `'heading'`, `'text'`, `'image'`. |
| `text` | text | Used by `heading` (the title) and `text` (a paragraph). |
| `image_url` | text | Used by `image` only. |
| `caption` | text | Used by `image` only (optional). |
| `sort_order` | int | Order of blocks within the project, starting at 1. |

**How blocks render (write content accordingly):**
- `heading` → an `<h2>` section title. Keep it short (2–5 words).
- `text` → paragraph(s). **Plain text only — no HTML.** `<b>`/`<i>` tags show
  up literally, so don't use them. For multiple paragraphs in one block,
  separate them with a blank line (`\n\n`), or just use several `text` blocks.
- `image` → full-width image with an optional italic caption underneath.

A good case study alternates `heading` → `text` → `image` → `text` …

---

## 2. The other page sections (only if asked to do "the whole page")

```
profile         (single row) — name, verified(bool), location, headline,
                  badge_text, badge_url, about (paragraphs sep. by blank lines),
                  avatar_url, email, calendly_url, blog_url,
                  accent_color (hex page accent, '' = default theme)
tech_stack      — category, name, sort_order        (one row per skill)
experiences     — title, organization, year_label, is_current(bool), sort_order
certifications  — title, issuer, url, featured(bool), sort_order
memberships     — name, url, sort_order
social_links    — platform, url, sort_order
gallery         — image_url, caption, sort_order
highlights      — kind ('image' | 'access_card'), title, subtitle,
                  member_name, image_url (access_card: a logo, replaces the QR),
                  card_color (access_card: hex bg, '' = default dark),
                  hide_label (access_card bool: hide the "ACCESS CARD" label),
                  link_url, sort_order
```

`headline` uses ` \ ` as a visual separator, e.g. `Full-Stack Web Developer \ Data Analyst`.

---

## 3. Required SQL format

### Escaping
Single quotes inside text **must be doubled**: `I'm` → `'I''m'`.

### A single project + its case-study blocks

```sql
begin;

-- Optional: remove an existing version first (safe to re-run)
delete from project_blocks where project_id in (select id from projects where slug = 'my-app');
delete from projects where slug = 'my-app';

insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('My App', 'A short one-line tagline.', 'https://myapp.com', 'myapp.com',
   'my-app', 'Next.js, TypeScript, Supabase', 'https://images.example.com/cover.png',
   true, true, 10);

-- Blocks are tied to the project by its slug, so you never hard-code the id:
insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'heading', 'The problem', '', '', 1 from projects where slug = 'my-app'
union all
select id, 'text', 'Describe the problem in plain text. I''m writing in first person.', '', '', 2 from projects where slug = 'my-app'
union all
select id, 'image', '', 'https://images.example.com/screen1.png', 'A caption for the screenshot.', 3 from projects where slug = 'my-app'
union all
select id, 'heading', 'What I built', '', '', 4 from projects where slug = 'my-app'
union all
select id, 'text', 'Explain the solution and your role.', '', '', 5 from projects where slug = 'my-app';

commit;
```

**Rules recap for blocks:**
- `heading`/`text` → put content in the `text` column; `image_url` and `caption` are `''`.
- `image` → put the URL in `image_url`, optional `caption`; `text` is `''`.
- Keep `sort_order` sequential (1, 2, 3, …) per project.

### Multiple projects
Repeat the project + blocks pattern for each, giving each a unique `slug` and an
increasing `sort_order`. Keep everything inside one `begin; … commit;`.

---

## 4. Worked example (real one from this portfolio)

```sql
insert into projects
  (title, description, url, display_url, slug, tech, cover_image_url, featured, published, sort_order)
values
  ('CET Tracker PH',
   'A web app for tracking Philippine college entrance exam schedules and requirements.',
   'https://cet-tracker-app.vercel.app/', 'cet-tracker-app.vercel.app',
   'cet-tracker', 'Next.js, TypeScript, Supabase, Tailwind CSS, OpenAI API',
   'https://i.imgur.com/RdnQ6UT.png', true, true, 3);

insert into project_blocks (project_id, kind, text, image_url, caption, sort_order)
select id, 'text', 'CET Tracker PH is a centralized platform that simplifies the college application process for Filipino students by aggregating deadlines, exam dates, and requirements into one searchable interface.', '', '', 1 from projects where slug = 'cet-tracker'
union all
select id, 'image', '', 'https://i.imgur.com/kykUpzZ.png', 'The landing page with a responsive search interface.', 2 from projects where slug = 'cet-tracker'
union all
select id, 'heading', 'Admin dashboard', '', '', 3 from projects where slug = 'cet-tracker'
union all
select id, 'text', 'A secure admin dashboard protected by Supabase Auth lets administrators perform full CRUD on university data and manage announcements.', '', '', 4 from projects where slug = 'cet-tracker';
```

---

## 5. Template — fill this in and hand it to the AI

> **My info (delete the brackets and fill in):**
>
> - **Project name:** [ ]
> - **One-line tagline (for the card):** [ ]
> - **Live URL:** [ or "none" ]
> - **Cover image URL:** [ or "none" ]
> - **Tech used:** [ comma-separated ]
> - **Featured on home page?** [ yes / no ]
> - **The story** (problem, what you built, your role, challenges, results — bullet points are fine, the AI will turn them into headings/paragraphs):
>   - [ ]
>   - [ ]
> - **Screenshots** (paste image URLs + a caption for each, in the order they should appear):
>   - [ url ] — [ caption ]
>   - [ url ] — [ caption ]
>
> **Ask:** Generate the `INSERT` SQL for the above following the schema and
> format in this guide. Use the next `sort_order` after my existing projects
> (ask me what that is if unsure). Output one ```sql block only.

---

## 6. After you get the SQL back

1. Skim it — make sure the `slug` is unique and the image URLs are real.
2. Open **Supabase → SQL Editor → New query**, paste, **Run**.
3. Reload the portfolio. The project appears at `/projects/<slug>`.

> Tip: you can always edit/add/reorder blocks later in the site's **`/admin`**
> panel instead of SQL — this guide is just for bulk/first-time generation.
