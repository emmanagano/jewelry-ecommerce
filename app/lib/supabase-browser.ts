import { createBrowserClient } from "@supabase/ssr";

// Session-aware client for Client Components. The session lives in cookies,
// so the server (proxy.ts, Server Components, Route Handlers) sees it too.
// createBrowserClient returns the same instance on every call in the browser.
export function createSupabaseBrowserClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	);
}
