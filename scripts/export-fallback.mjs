// Refresh lib/fallback.json from your live Supabase data.
// Run before deploying so the offline snapshot matches your latest content:
//   node scripts/export-fallback.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";

// Read env from .env.local (no dotenv dependency)
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const tables = {
  tech: "tech_stack", projects: "projects", experiences: "experiences",
  certs: "certifications", memberships: "memberships", socials: "social_links",
  gallery: "gallery", highlights: "highlights",
};

const out = {};
const { data: profile, error } = await db.from("profile").select("*").limit(1).maybeSingle();
if (error) { console.error("Could not reach Supabase:", error.message); process.exit(1); }
out.profile = profile;
for (const [key, table] of Object.entries(tables)) {
  const { data } = await db.from(table).select("*").order("sort_order");
  out[key] = data || [];
}
// Attach case-study blocks to each project so story pages work offline too
const { data: allBlocks } = await db.from("project_blocks").select("*").order("sort_order");
for (const project of out.projects) {
  project.blocks = (allBlocks || []).filter((b) => b.project_id === project.id);
}
writeFileSync("lib/fallback.json", JSON.stringify(out, null, 2));
console.log("lib/fallback.json refreshed from live data.");
