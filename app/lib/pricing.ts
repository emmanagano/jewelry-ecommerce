// Bag and checkout pricing rules, in cents. The server applies the same rules
// when an order is placed (place_order in
// supabase/migrations/20261030000009_vaelore_shipping.sql); keep the two in sync.
export const COURIER_CENTS = 7500;
export const FREE_COURIER_THRESHOLD_CENTS = 500000;
export const GIFT_PACKAGING_CENTS = 0;

export function computeTotals(
	subtotalCents: number,
	{ giftPackaging = false, percentOff = 0 } = {},
) {
	const discountCents = Math.round((subtotalCents * percentOff) / 100);
	const giftCents = giftPackaging ? GIFT_PACKAGING_CENTS : 0;
	const qualifiesForFreeCourier =
		subtotalCents >= FREE_COURIER_THRESHOLD_CENTS;
	const shippingCents = qualifiesForFreeCourier ? 0 : COURIER_CENTS;
	const totalCents =
		Math.max(0, subtotalCents - discountCents + giftCents) + shippingCents;

	return {
		discountCents,
		giftCents,
		shippingCents,
		qualifiesForFreeCourier,
		totalCents,
	};
}
