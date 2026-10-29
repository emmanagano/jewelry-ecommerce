// Gift packaging, gift note and promo code chosen in the bag, carried to
// checkout for this browser tab. sessionStorage can be unavailable (private
// mode, blocked storage), so every access is guarded.

export interface CheckoutOptions {
	giftPackaging: boolean;
	giftNote: string;
	// Validated in the bag; the server checks the code again at order time
	promo: { code: string; percentOff: number } | null;
}

const KEY = "checkout_options";

export const DEFAULT_CHECKOUT_OPTIONS: CheckoutOptions = {
	giftPackaging: false,
	giftNote: "",
	promo: null,
};

export function readCheckoutOptions(): CheckoutOptions {
	try {
		const parsed = JSON.parse(sessionStorage.getItem(KEY) ?? "null");
		if (!parsed || typeof parsed !== "object") return DEFAULT_CHECKOUT_OPTIONS;
		return {
			giftPackaging: parsed.giftPackaging === true,
			giftNote: typeof parsed.giftNote === "string" ? parsed.giftNote.slice(0, 300) : "",
			promo:
				parsed.promo &&
				typeof parsed.promo.code === "string" &&
				Number.isInteger(parsed.promo.percentOff)
					? { code: parsed.promo.code, percentOff: parsed.promo.percentOff }
					: null,
		};
	} catch {
		return DEFAULT_CHECKOUT_OPTIONS;
	}
}

export function saveCheckoutOptions(options: CheckoutOptions) {
	try {
		sessionStorage.setItem(KEY, JSON.stringify(options));
	} catch {
		// Not fatal: checkout just starts without the bag's choices
	}
}

export function clearCheckoutOptions() {
	try {
		sessionStorage.removeItem(KEY);
	} catch {
		// Ignore
	}
}
