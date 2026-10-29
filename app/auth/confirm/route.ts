import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { safeNextPath } from "@/app/lib/safe-redirect";

// Landing page for links in Supabase auth emails (sign-up confirmation and
// password reset). Exchanges the link's one-time credential for a session
// cookie, then forwards to `next`.
//
// Handles both link styles:
// - ?code=…              default email templates (PKCE). Must be opened in
//                         the same browser that requested the email.
// - ?token_hash=…&type=… customized templates. Works on any device.
export async function GET(request: NextRequest) {
	const { searchParams, origin } = request.nextUrl;
	const next = safeNextPath(searchParams.get("next"), "/account");
	const code = searchParams.get("code");
	const tokenHash = searchParams.get("token_hash");
	const type = searchParams.get("type") as EmailOtpType | null;

	const supabase = await createSupabaseServerClient();

	let ok = false;
	if (code) {
		const { error } = await supabase.auth.exchangeCodeForSession(code);
		ok = !error;
	} else if (tokenHash && type) {
		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash: tokenHash,
		});
		ok = !error;
	}

	if (ok) {
		return NextResponse.redirect(new URL(next, origin));
	}

	// Expired, already used, or opened in a different browser (PKCE)
	return NextResponse.redirect(new URL("/login?error=link-invalid", origin));
}
