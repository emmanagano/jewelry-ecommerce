import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Keeps the Supabase session fresh: on each request, an expired access token
// is refreshed and the new cookies are written to both the request (for this
// render) and the response (for the browser). It does not gate routes; pages
// that need a user check for one themselves.
export async function proxy(request: NextRequest) {
	let response = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					response = NextResponse.next({ request });
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	// Triggers the refresh when needed; the result itself isn't used here
	await supabase.auth.getClaims();

	return response;
}

export const config = {
	// Skip static assets and image optimization
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
	],
};
