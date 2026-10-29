import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Session-aware client for Server Components, Server Actions and Route
// Handlers. Create a new one per request. Reading cookies makes the caller
// dynamic, so it must render inside <Suspense> (or in an action/route).
export async function createSupabaseServerClient() {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options),
						);
					} catch {
						// Server Components can't set cookies; proxy.ts refreshes
						// the session on every request instead.
					}
				},
			},
		},
	);
}

// The verified signed-in user (JWT checked), or null
export async function getCurrentUser() {
	const supabase = await createSupabaseServerClient();
	const { data } = await supabase.auth.getClaims();
	const claims = data?.claims;
	if (!claims?.sub) return null;
	return { id: claims.sub, email: (claims.email as string | undefined) ?? null };
}
