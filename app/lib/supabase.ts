// Catalog client: anonymous, no session. Used by the cached catalog fetchers
// (which must not depend on who is signed in) and for public catalog reads in
// the browser. For anything tied to a user, use supabase-browser.ts or
// supabase-server.ts instead.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: { persistSession: false, autoRefreshToken: false },
});
