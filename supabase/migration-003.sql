-- =============================================================
-- Migration 003 — run this in the Supabase SQL Editor
--
-- Adds: section_config JSONB to profile
--       Stores ordered section visibility for the Layout editor
-- =============================================================

alter table profile
  add column if not exists section_config jsonb default null;

-- section_config shape (written by the admin Layout tab):
-- {
--   "sections": [
--     { "key": "header",         "visible": true  },
--     { "key": "about",          "visible": true  },
--     { "key": "highlights",     "visible": true  },
--     { "key": "tech_stack",     "visible": true  },
--     { "key": "projects",       "visible": true  },
--     { "key": "experience",     "visible": true  },
--     { "key": "certifications", "visible": true  },
--     { "key": "gallery",        "visible": false },
--     { "key": "footer",         "visible": true  }
--   ]
-- }
--
-- null = use the hard-coded default order (safe fallback).
