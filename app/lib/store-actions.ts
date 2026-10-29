"use server";

import { createSupabaseServerClient } from "@/app/lib/supabase-server";

export type PromoResult =
	| { ok: true; code: string; percentOff: number }
	| { ok: false; message: string };

// Checks a promo code against the promo_codes table (via validate_promo_code,
// so the list of codes is never exposed)
export async function applyPromoCode(rawCode: string): Promise<PromoResult> {
	const code = rawCode.trim().slice(0, 32);
	if (!code) return { ok: false, message: "Enter a promo code." };

	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase.rpc("validate_promo_code", {
		p_code: code,
	});

	if (error) {
		console.error("Failed to validate promo code:", error.message);
		return { ok: false, message: "We couldn't check that code. Please try again." };
	}
	// A set-returning function: zero rows (invalid) or one row
	const match = (data as { code: string; percent_off: number }[] | null)?.[0];
	if (!match) {
		return { ok: false, message: "That code isn't valid or has expired." };
	}
	return { ok: true, code: match.code, percentOff: match.percent_off };
}

export type NewsletterSignupResult = { ok: boolean; message: string };

// Footer signup. Uses the session client so a signed-in visitor subscribing
// their own email is linked to their account.
export async function subscribeToNewsletter(
	email: string,
): Promise<NewsletterSignupResult> {
	const value = email.trim();
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) || value.length > 320) {
		return { ok: false, message: "Please enter a valid email address." };
	}

	const supabase = await createSupabaseServerClient();
	const { error } = await supabase.rpc("subscribe_newsletter", {
		p_email: value,
	});

	if (error) {
		console.error("Failed to subscribe to newsletter:", error.message);
		return { ok: false, message: "We couldn't subscribe you. Please try again." };
	}
	// Same message whether or not the email was already on the list
	return { ok: true, message: "You're on the list." };
}
