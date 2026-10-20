// Deferred Living Lab source. Restore to api/config.js before release.
// Serves the *public* Supabase project URL + anon key to the browser.
// These two values are safe to expose (the anon key only ever grants what
// Row Level Security allows -- see supabase/migrations/0001_living_lab_schema.sql)
// but are kept in Vercel env vars rather than hardcoded in committed JS so
// they can be rotated or pointed at a different project without a code
// change. The service-role key is NEVER read or returned here.
function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "public, max-age=300" },
  });
}

export default {
  async fetch() {
    const url = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      console.error("Living Lab: SUPABASE_URL / SUPABASE_ANON_KEY not configured.");
      return json(
        { ok: false, message: "Living Lab data is not configured yet." },
        503,
      );
    }

    return json({ ok: true, supabaseUrl: url, supabaseAnonKey: anonKey });
  },
};
