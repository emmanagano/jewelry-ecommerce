// Demo checkout card helpers. Card details are only validated in the browser;
// the order stores just the brand and last 4 digits.

export type CardBrand =
	| "Visa"
	| "Mastercard"
	| "American Express"
	| "Discover"
	| "Card";

export function digitsOnly(value: string) {
	return value.replace(/\D/g, "");
}

export function detectBrand(number: string): CardBrand {
	const n = digitsOnly(number);
	if (/^4/.test(n)) return "Visa";
	if (/^(5[1-5]|2[2-7])/.test(n)) return "Mastercard";
	if (/^3[47]/.test(n)) return "American Express";
	if (/^6(011|5)/.test(n)) return "Discover";
	return "Card";
}

// Groups of 4 (Amex: 4-6-5) as the shopper types
export function formatCardNumber(value: string) {
	const n = digitsOnly(value).slice(0, 19);
	if (detectBrand(n) === "American Express") {
		return [n.slice(0, 4), n.slice(4, 10), n.slice(10, 15)]
			.filter(Boolean)
			.join(" ");
	}
	return n.replace(/(.{4})/g, "$1 ").trim();
}

export function formatExpiry(value: string) {
	const n = digitsOnly(value).slice(0, 4);
	return n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n;
}

// Luhn checksum, so typos are caught the way a real form would
export function isValidCardNumber(number: string) {
	const n = digitsOnly(number);
	if (n.length < 13 || n.length > 19) return false;
	let sum = 0;
	for (let i = 0; i < n.length; i++) {
		let digit = Number(n[n.length - 1 - i]);
		if (i % 2 === 1) {
			digit *= 2;
			if (digit > 9) digit -= 9;
		}
		sum += digit;
	}
	return sum % 10 === 0;
}

export function isValidExpiry(value: string, now = new Date()) {
	const match = /^(\d{2})\/(\d{2})$/.exec(value);
	if (!match) return false;
	const month = Number(match[1]);
	const year = 2000 + Number(match[2]);
	if (month < 1 || month > 12) return false;
	// Valid through the last day of the expiry month
	return new Date(year, month, 1) > now;
}

export function isValidCvc(value: string, brand: CardBrand) {
	return brand === "American Express"
		? /^\d{4}$/.test(value)
		: /^\d{3}$/.test(value);
}

// Stripe's well-known test number; it passes the Luhn check
export const DEMO_CARD_NUMBER = "4242 4242 4242 4242";

export function demoExpiry(now = new Date()) {
	return `12/${String((now.getFullYear() + 3) % 100).padStart(2, "0")}`;
}
