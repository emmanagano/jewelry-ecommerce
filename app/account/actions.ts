"use server";

import {
	createSupabaseServerClient,
	getCurrentUser,
} from "@/app/lib/supabase-server";
import { getSizeOptions } from "@/app/lib/data/products";

// Every action re-checks the session rather than trusting the page that
// rendered the form; RLS also limits writes to the user's own rows.
// Each returns the saved values so the card can switch back to view mode.

export type ActionResult<T> =
	| { ok: true; message: string; values: T }
	| { ok: false; message: string };

const SIGNED_OUT = {
	ok: false,
	message: "Your session has ended. Please sign in again.",
} as const;

export interface ProfileValues {
	fullName: string;
	birthday: string; // YYYY-MM-DD or ""
}

export async function updateProfile(
	_prev: ActionResult<ProfileValues> | null,
	formData: FormData,
): Promise<ActionResult<ProfileValues>> {
	const user = await getCurrentUser();
	if (!user) return SIGNED_OUT;

	const fullName = String(formData.get("full_name") ?? "")
		.trim()
		.slice(0, 120);
	const birthday = String(formData.get("birthday") ?? "").trim();

	if (birthday) {
		const date = new Date(`${birthday}T00:00:00Z`);
		if (
			!/^\d{4}-\d{2}-\d{2}$/.test(birthday) ||
			Number.isNaN(date.getTime()) ||
			birthday <= "1900-01-01" ||
			date > new Date()
		) {
			return { ok: false, message: "Please enter a valid birthday." };
		}
	}

	const supabase = await createSupabaseServerClient();
	const { error } = await supabase
		.from("profiles")
		.update({
			full_name: fullName || null,
			birthday: birthday || null,
			updated_at: new Date().toISOString(),
		})
		.eq("id", user.id);

	if (error) {
		console.error("Failed to update profile:", error.message);
		return { ok: false, message: "Your details couldn't be saved. Please try again." };
	}
	return { ok: true, message: "Details saved.", values: { fullName, birthday } };
}

export type SizeValues = Record<string, string>;

export async function updateSizes(
	_prev: ActionResult<SizeValues> | null,
	formData: FormData,
): Promise<ActionResult<SizeValues>> {
	const user = await getCurrentUser();
	if (!user) return SIGNED_OUT;

	// Keep only sizes that really exist for that category
	const options = await getSizeOptions();
	const sizes: SizeValues = {};
	for (const option of options) {
		const value = String(formData.get(`size:${option.categorySlug}`) ?? "");
		if (value && option.sizes.includes(value)) {
			sizes[option.categorySlug] = value;
		}
	}

	const supabase = await createSupabaseServerClient();
	const { error } = await supabase
		.from("profiles")
		.update({ preferred_sizes: sizes, updated_at: new Date().toISOString() })
		.eq("id", user.id);

	if (error) {
		console.error("Failed to update sizes:", error.message);
		return { ok: false, message: "Your sizes couldn't be saved. Please try again." };
	}
	return { ok: true, message: "Sizes saved.", values: sizes };
}

export async function setNewsletter(
	_prev: ActionResult<boolean> | null,
	formData: FormData,
): Promise<ActionResult<boolean>> {
	const user = await getCurrentUser();
	if (!user) return SIGNED_OUT;

	const subscribe = formData.get("subscribe") === "true";
	const supabase = await createSupabaseServerClient();
	const { error } = await supabase.rpc("set_newsletter_subscription", {
		p_subscribed: subscribe,
	});

	if (error) {
		console.error("Failed to update newsletter preference:", error.message);
		return { ok: false, message: "Your preference couldn't be saved. Please try again." };
	}
	return {
		ok: true,
		message: subscribe ? "You're subscribed." : "You've been unsubscribed.",
		values: subscribe,
	};
}
