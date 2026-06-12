import { createClient } from "@supabase/supabase-js";
import fallback from "./fallback.json";

// Server-side client (anon key — public reads only, RLS enforced)
function serverClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );
}

// If Supabase is unreachable (e.g. a paused free-tier project), we serve the
// bundled snapshot in lib/fallback.json instead of an empty page.
// Refresh the snapshot from your live data with: node scripts/export-fallback.mjs
export async function getPortfolioData() {
  try {
    const db = serverClient();
    const [profile, tech, projects, experiences, certs, memberships, socials, gallery, highlights] =
      await Promise.all([
        db.from("profile").select("*").limit(1).maybeSingle(),
        db.from("tech_stack").select("*").order("sort_order"),
        db.from("projects").select("*").order("sort_order"),
        db.from("experiences").select("*").order("sort_order"),
        db.from("certifications").select("*").order("sort_order"),
        db.from("memberships").select("*").order("sort_order"),
        db.from("social_links").select("*").order("sort_order"),
        db.from("gallery").select("*").order("sort_order"),
        db.from("highlights").select("*").order("sort_order"),
      ]);

    // A connection-level failure surfaces as an error on every query
    if (profile.error) throw profile.error;

    return {
      live: true,
      profile: profile.data,
      tech: tech.data || [],
      projects: projects.data || [],
      experiences: experiences.data || [],
      certs: certs.data || [],
      memberships: memberships.data || [],
      socials: socials.data || [],
      gallery: gallery.data || [],
      highlights: highlights.data || [],
    };
  } catch (e) {
    console.error("Supabase unreachable, serving fallback snapshot:", e?.message || e);
    return { live: false, ...fallback };
  }
}

export async function getProject(slug) {
  try {
    const db = serverClient();
    const { data, error } = await db.from("projects").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const { data: blocks } = await db
      .from("project_blocks")
      .select("*")
      .eq("project_id", data.id)
      .order("sort_order");
    return { ...data, blocks: blocks || [] };
  } catch (e) {
    console.error("Supabase unreachable, serving fallback project:", e?.message || e);
    return (fallback.projects || []).find((p) => p.slug === slug) || null;
  }
}

export async function getProjectSlugs() {
  try {
    const db = serverClient();
    const { data, error } = await db
      .from("projects")
      .select("slug")
      .eq("published", true)
      .not("slug", "is", null);
    if (error) throw error;
    return (data || []).map((r) => r.slug);
  } catch {
    return (fallback.projects || []).filter((p) => p.slug).map((p) => p.slug);
  }
}
