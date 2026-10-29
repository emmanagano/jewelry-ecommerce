"use server";

import { createSupabaseServerClient } from "@/app/lib/supabase-server";

export interface PlaceOrderInput {
	items: { id: string; size: string; quantity: number }[];
	contact: { email: string; fullName: string; phone: string };
	shipping: {
		line1: string;
		line2: string;
		city: string;
		region: string;
		postalCode: string;
		country: string;
	};
	// Demo only: never the full card number
	payment: { brand: string; last4: string };
	giftPackaging: boolean;
	giftNote: string;
	promoCode: string | null;
}

export type PlaceOrderResult =
	| { ok: true; orderId: string; orderNumber: string; accessToken: string }
	| { ok: false; message: string };

const str = (value: unknown, max: number) =>
	typeof value === "string" ? value.slice(0, max) : "";

// Places the order through place_order(), which prices everything from the
// catalog and validates the details again. Uses the session client so a
// signed-in shopper's order is linked to their account.
export async function placeOrder(
	input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
	const items = Array.isArray(input?.items)
		? input.items.slice(0, 50).map((item) => ({
				id: str(item?.id, 64),
				size: str(item?.size, 32),
				quantity: Number.isInteger(item?.quantity) ? item.quantity : 1,
			}))
		: [];

	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase.rpc("place_order", {
		p_items: items,
		p_contact: {
			email: str(input?.contact?.email, 320),
			full_name: str(input?.contact?.fullName, 120),
			phone: str(input?.contact?.phone, 40),
		},
		p_shipping: {
			line1: str(input?.shipping?.line1, 120),
			line2: str(input?.shipping?.line2, 120),
			city: str(input?.shipping?.city, 80),
			region: str(input?.shipping?.region, 80),
			postal_code: str(input?.shipping?.postalCode, 20),
			country: str(input?.shipping?.country, 2),
		},
		p_payment: {
			brand: str(input?.payment?.brand, 32),
			last4: str(input?.payment?.last4, 4),
		},
		p_gift_packaging: input?.giftPackaging === true,
		p_gift_note: str(input?.giftNote, 300) || null,
		p_promo_code: str(input?.promoCode, 32) || null,
	});

	if (error) {
		// P0001 errors are written for the shopper (empty bag, bad address…)
		if (error.code === "P0001") return { ok: false, message: error.message };
		console.error("Failed to place order:", error.message);
		return {
			ok: false,
			message: "We couldn't place your order. Please try again.",
		};
	}

	const row = (
		data as { order_id: string; order_number: string; access_token: string }[] | null
	)?.[0];
	if (!row) {
		return { ok: false, message: "We couldn't place your order. Please try again." };
	}
	return {
		ok: true,
		orderId: row.order_id,
		orderNumber: row.order_number,
		accessToken: row.access_token,
	};
}
