import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Tiny query that counts as "activity" so the Supabase free-tier project
// never pauses. Hit daily by the Vercel cron in vercel.json (or any cron).
export async function GET() {
  try {
    const db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false } }
    );
    const { error } = await db.from("profile").select("id").limit(1);
    if (error) throw error;
    return Response.json({ ok: true, at: new Date().toISOString() });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
