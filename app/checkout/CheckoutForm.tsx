"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Lock, ShoppingBag, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/app/lib/format";
import { computeTotals } from "@/app/lib/pricing";
import { ONE_SIZE } from "@/app/lib/products";
import {
	DEFAULT_CHECKOUT_OPTIONS,
	clearCheckoutOptions,
	readCheckoutOptions,
	type CheckoutOptions,
} from "@/app/lib/checkout-options";
import {
	DEMO_CARD_NUMBER,
	demoExpiry,
	detectBrand,
	digitsOnly,
	formatCardNumber,
	formatExpiry,
	isValidCardNumber,
	isValidCvc,
	isValidExpiry,
} from "@/app/lib/demo-card";
import { placeOrder } from "@/app/lib/checkout-actions";
import { AUTH_INPUT_CLASS, AuthMessage } from "@/components/AuthPanel";

const COUNTRIES = [
	{ code: "US", name: "United States" },
	{ code: "CA", name: "Canada" },
	{ code: "GB", name: "United Kingdom" },
	{ code: "AU", name: "Australia" },
	{ code: "FR", name: "France" },
	{ code: "DE", name: "Germany" },
	{ code: "JP", name: "Japan" },
	{ code: "PH", name: "Philippines" },
];

const LABEL_CLASS =
	"block eyebrow text-(--text-muted)";
const SECTION_CLASS =
	"border-t border-(--border-color) pt-8";
const SECTION_TITLE_CLASS =
	"text-label uppercase font-medium pb-4 border-b border-(--border-color)/60 mb-6 text-(--text-headline)";

interface FormFields {
	email: string;
	fullName: string;
	phone: string;
	line1: string;
	line2: string;
	city: string;
	region: string;
	postalCode: string;
	country: string;
	cardName: string;
	cardNumber: string;
	expiry: string;
	cvc: string;
}

type FieldErrors = Partial<Record<keyof FormFields, string>>;

const EMPTY_FIELDS: FormFields = {
	email: "",
	fullName: "",
	phone: "",
	line1: "",
	line2: "",
	city: "",
	region: "",
	postalCode: "",
	country: "US",
	cardName: "",
	cardNumber: "",
	expiry: "",
	cvc: "",
};

function validate(fields: FormFields): FieldErrors {
	const errors: FieldErrors = {};
	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(fields.email.trim())) {
		errors.email = "Enter a valid email address.";
	}
	if (!fields.fullName.trim()) errors.fullName = "Enter your full name.";
	if (!fields.line1.trim()) errors.line1 = "Enter your street address.";
	if (!fields.city.trim()) errors.city = "Enter your city.";
	if (!fields.postalCode.trim()) errors.postalCode = "Enter your postal code.";
	if (!fields.cardName.trim()) errors.cardName = "Enter the name on the card.";
	if (!isValidCardNumber(fields.cardNumber)) {
		errors.cardNumber = "Enter a valid card number.";
	}
	if (!isValidExpiry(fields.expiry)) {
		errors.expiry = "Enter a future date as MM/YY.";
	}
	if (!isValidCvc(fields.cvc, detectBrand(fields.cardNumber))) {
		errors.cvc = "Enter the security code.";
	}
	return errors;
}

export default function CheckoutForm() {
	const router = useRouter();
	const { user, fullName: profileName } = useAuth();
	const { cart, totalCartCount, isHydrated, clearCart } = useStore();

	// The bag's gift and promo choices for this tab (read once on mount)
	const [options] = useState<CheckoutOptions>(() =>
		typeof window === "undefined"
			? DEFAULT_CHECKOUT_OPTIONS
			: readCheckoutOptions(),
	);
	// Edits by the shopper; signed-in details fill in until they type
	const [edited, setEdited] = useState<Partial<FormFields>>({});
	const [errors, setErrors] = useState<FieldErrors>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [isPlacing, startPlacing] = useTransition();
	// Set once the order exists, so the emptied bag doesn't flash the
	// empty state while navigating to the confirmation page
	const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(
		null,
	);

	const fields: FormFields = {
		...EMPTY_FIELDS,
		email: user?.email ?? "",
		fullName: profileName ?? "",
		...edited,
	};

	const setField = (name: keyof FormFields, value: string) => {
		setEdited((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	// One click fills every field with demo data, keeping a signed-in
	// shopper's own email and name
	const fillDemoDetails = () => {
		const name = fields.fullName.trim() || "Jordan Reed";
		setEdited({
			email: fields.email.trim() || "jordan.reed@example.com",
			fullName: name,
			phone: "(212) 555-0147",
			line1: "221 Atelier Lane",
			line2: "Suite 4",
			city: "New York",
			region: "NY",
			postalCode: "10013",
			country: "US",
			cardName: name,
			cardNumber: DEMO_CARD_NUMBER,
			expiry: demoExpiry(),
			cvc: "123",
		});
		setErrors({});
		setFormError(null);
	};

	const subtotalCents = cart.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);
	// Display totals; the server recalculates them from catalog prices
	const totals = computeTotals(subtotalCents, {
		giftPackaging: options.giftPackaging,
		percentOff: options.promo?.percentOff ?? 0,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		const nextErrors = validate(fields);
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) {
			document
				.getElementById(`checkout-${Object.keys(nextErrors)[0]}`)
				?.focus();
			return;
		}

		const digits = digitsOnly(fields.cardNumber);
		startPlacing(async () => {
			const result = await placeOrder({
				items: cart.map(({ id, size, quantity }) => ({ id, size, quantity })),
				contact: {
					email: fields.email,
					fullName: fields.fullName,
					phone: fields.phone,
				},
				shipping: {
					line1: fields.line1,
					line2: fields.line2,
					city: fields.city,
					region: fields.region,
					postalCode: fields.postalCode,
					country: fields.country,
				},
				// Only the brand and last 4 digits leave the browser
				payment: { brand: detectBrand(digits), last4: digits.slice(-4) },
				giftPackaging: options.giftPackaging,
				giftNote: options.giftNote,
				promoCode: options.promo?.code ?? null,
			});

			if (!result.ok) {
				setFormError(result.message);
				window.scrollTo({ top: 0, behavior: "smooth" });
				return;
			}
			setPlacedOrderNumber(result.orderNumber);
			clearCart();
			clearCheckoutOptions();
			router.push(
				`/orders/${result.orderId}?token=${result.accessToken}&placed=1`,
			);
		});
	};

	if (!isHydrated) {
		return (
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
				<div className="lg:col-span-7 space-y-6">
					<div className="h-48 bg-(--card-sub) rounded-xs" />
					<div className="h-72 bg-(--card-sub) rounded-xs" />
				</div>
				<div className="lg:col-span-5 h-96 bg-(--card-sub) rounded-xs" />
			</div>
		);
	}

	if (placedOrderNumber) {
		return (
			<div className="py-32 text-center">
				<p className="text-label uppercase font-medium text-(--success) mb-3">
					Order placed
				</p>
				<p className="font-primary text-heading text-(--text-headline)">
					{placedOrderNumber}
				</p>
				<p className="mt-3 font-body text-copy-sm text-(--text-muted)">
					Taking you to your confirmation…
				</p>
			</div>
		);
	}

	if (cart.length === 0 && !isPlacing) {
		return (
			<div className="py-32 text-center flex flex-col items-center">
				<div className="w-16 h-16 rounded-full border border-(--border-color) bg-(--card-sub)/50 flex items-center justify-center mb-6">
					<ShoppingBag size={20} className="stroke-[1.5] text-(--text-muted)" />
				</div>
				<h1 className="font-primary text-heading tracking-tight mb-3 text-(--text-headline)">
					Your bag is empty
				</h1>
				<p className="font-body text-copy-sm text-(--text-muted) mb-10">
					Choose a piece to begin.
				</p>
				<Link
					href="/collections/best-sellers"
					className="py-3.5 px-10 text-label uppercase font-medium bg-(--text-headline) text-(--bg-base) hover:opacity-90 transition-opacity rounded-xs"
				>
					Discover Best Sellers
				</Link>
			</div>
		);
	}

	const input = (
		name: keyof FormFields,
		label: string,
		props: React.InputHTMLAttributes<HTMLInputElement> = {},
		format?: (value: string) => string,
	) => (
		<label className={LABEL_CLASS}>
			{label}
			<input
				id={`checkout-${name}`}
				value={fields[name]}
				onChange={(e) =>
					setField(name, format ? format(e.target.value) : e.target.value)
				}
				aria-invalid={errors[name] ? true : undefined}
				aria-describedby={errors[name] ? `checkout-${name}-error` : undefined}
				className={`${AUTH_INPUT_CLASS} mt-2 normal-case tracking-normal ${
					errors[name] ? "border-(--error-border)" : ""
				}`}
				{...props}
			/>
			{errors[name] && (
				<span
					id={`checkout-${name}-error`}
					className="block mt-1.5 normal-case tracking-normal text-copy-sm text-(--error-text)"
				>
					{errors[name]}
				</span>
			)}
		</label>
	);

	const brand = detectBrand(fields.cardNumber);

	return (
		<form onSubmit={handleSubmit} noValidate>
			{/* Header */}
			<div className="mb-10 pb-6 border-b border-(--border-color)/60 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<span className="eyebrow text-(--text-muted) block mb-3">
						Almost yours
					</span>
					<h1 className="font-primary text-heading sm:text-title tracking-tight text-(--text-headline)">
						Checkout
					</h1>
				</div>
				<Link
					href="/shopping-bag"
					className="group flex items-center gap-2 text-label uppercase font-medium text-(--text-headline) hover:text-(--text-muted) transition-colors"
				>
					<ArrowLeft
						size={12}
						className="stroke-[1.5] transition-transform group-hover:-translate-x-1"
					/>
					<span>Back to Bag</span>
				</Link>
			</div>

			{/* Demo notice + one-click fill */}
			<div className="mb-8 p-5 rounded-xs border border-(--border-color) bg-(--card-main)/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-start gap-3">
					<Sparkles size={16} className="stroke-[1.5] mt-0.5 text-(--text-headline) shrink-0" />
					<p className="font-body text-copy-sm leading-relaxed text-(--text-body)">
						<span className="font-semibold text-(--text-headline)">
							Demo checkout.
						</span>{" "}
						No payment is taken and no card details are stored. Use the
						demo details. Please don&rsquo;t enter a real card.
					</p>
				</div>
				<button
					type="button"
					onClick={fillDemoDetails}
					className="shrink-0 py-3 px-6 rounded-xs border border-(--text-headline) text-label uppercase font-medium text-(--text-headline) hover:bg-(--text-headline) hover:text-(--bg-base) transition-colors cursor-pointer"
				>
					Fill Demo Details
				</button>
			</div>

			{formError && <AuthMessage tone="error">{formError}</AuthMessage>}

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				{/* Left: details */}
				<div className="lg:col-span-7 space-y-6">
					<section className={SECTION_CLASS}>
						<h2 className={SECTION_TITLE_CLASS}>Contact</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="sm:col-span-2">
								{input("email", "Email", { type: "email", autoComplete: "email" })}
							</div>
							{input("fullName", "Full Name", { autoComplete: "name" })}
							{input("phone", "Phone (optional)", { type: "tel", autoComplete: "tel" })}
						</div>
						{!user && (
							<p className="mt-4 text-copy-sm text-(--text-muted)">
								Have an account?{" "}
								<Link
									href="/login?next=/checkout"
									className="underline underline-offset-4 text-(--text-headline)"
								>
									Sign in
								</Link>{" "}
								to save this order to your history.
							</p>
						)}
					</section>

					<section className={SECTION_CLASS}>
						<h2 className={SECTION_TITLE_CLASS}>Shipping Address</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="sm:col-span-2">
								{input("line1", "Street Address", { autoComplete: "address-line1" })}
							</div>
							<div className="sm:col-span-2">
								{input("line2", "Apartment, Suite (optional)", { autoComplete: "address-line2" })}
							</div>
							{input("city", "City", { autoComplete: "address-level2" })}
							{input("region", "State / Region", { autoComplete: "address-level1" })}
							{input("postalCode", "Postal Code", { autoComplete: "postal-code" })}
							<label className={LABEL_CLASS}>
								Country
								<select
									id="checkout-country"
									value={fields.country}
									onChange={(e) => setField("country", e.target.value)}
									autoComplete="country"
									className={`${AUTH_INPUT_CLASS} mt-2 cursor-pointer normal-case tracking-normal`}
								>
									{COUNTRIES.map((c) => (
										<option key={c.code} value={c.code}>
											{c.name}
										</option>
									))}
								</select>
							</label>
						</div>
					</section>

					<section className={SECTION_CLASS}>
						<h2 className={`${SECTION_TITLE_CLASS} flex items-center justify-between`}>
							<span>Payment</span>
							<span className="flex items-center gap-1.5 font-medium tracking-[0.2em] text-(--text-muted)">
								<Lock size={11} className="stroke-[1.5]" />
								Demo
							</span>
						</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="sm:col-span-2">
								{input("cardName", "Name on Card", { autoComplete: "off" })}
							</div>
							<div className="sm:col-span-2 relative">
								{/* autoComplete off: don't offer the browser's real saved cards */}
								{input(
									"cardNumber",
									"Card Number",
									{ inputMode: "numeric", autoComplete: "off", placeholder: "4242 4242 4242 4242" },
									formatCardNumber,
								)}
								<span className="absolute right-4 top-9 flex items-center gap-1.5 eyebrow text-(--text-muted) pointer-events-none">
									<CreditCard size={13} className="stroke-[1.5]" />
									{fields.cardNumber ? brand : ""}
								</span>
							</div>
							{input(
								"expiry",
								"Expiry (MM/YY)",
								{ inputMode: "numeric", autoComplete: "off", placeholder: "MM/YY" },
								formatExpiry,
							)}
							{input(
								"cvc",
								"Security Code",
								{ inputMode: "numeric", autoComplete: "off", placeholder: brand === "American Express" ? "4 digits" : "3 digits" },
								(value) => digitsOnly(value).slice(0, 4),
							)}
						</div>
					</section>
				</div>

				{/* Right: order summary */}
				<div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
					<section className={SECTION_CLASS}>
						<h2 className={SECTION_TITLE_CLASS}>
							Order Summary ({totalCartCount})
						</h2>

						<ul className="divide-y divide-(--border-color)/60 mb-6">
							{cart.map((item) => (
								<li key={`${item.id}-${item.size}`} className="py-3 first:pt-0 flex items-center gap-4">
									<div className="relative w-14 aspect-4/5 shrink-0 overflow-hidden bg-(--card-sub) border border-(--border-color) rounded-xs">
										{item.image && (
											<Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
										)}
									</div>
									<div className="flex-1 min-w-0">
										<p className="font-primary text-copy-sm text-(--text-headline) truncate">{item.name}</p>
										<p className="font-secondary eyebrow text-(--text-muted)">
											{item.size === ONE_SIZE ? "One Size" : `Size ${item.size}`} · Qty {item.quantity}
										</p>
									</div>
									<span className="font-serif text-copy-sm text-(--text-headline)">
										{formatPrice(item.price * item.quantity)}
									</span>
								</li>
							))}
						</ul>

						<dl className="space-y-3 text-label uppercase pb-5 border-b border-(--border-color)/60">
							<SummaryRow label="Subtotal" value={formatPrice(subtotalCents)} />
							{options.giftPackaging && (
								<SummaryRow label="Gift Presentation" value={totals.giftCents === 0 ? "Complimentary" : formatPrice(totals.giftCents)} />
							)}
							{totals.discountCents > 0 && (
								<SummaryRow
									label={`Code ${options.promo?.code}`}
									value={`-${formatPrice(totals.discountCents)}`}
									accent
								/>
							)}
							<SummaryRow
								label="Insured Courier"
								value={totals.shippingCents === 0 ? "Complimentary" : formatPrice(totals.shippingCents)}
							/>
							<SummaryRow label="Taxes & Duties" value="Included" />
						</dl>

						<div className="flex justify-between items-baseline pt-5 mb-6">
							<span className="text-label uppercase font-medium text-(--text-headline)">
								Total
							</span>
							<span className="font-primary text-heading font-medium tracking-tight text-(--text-headline)">
								{formatPrice(totals.totalCents)}
							</span>
						</div>

						{options.giftPackaging && options.giftNote && (
							<p className="mb-6 text-copy-sm italic text-(--text-muted)">
								Gift note: &ldquo;{options.giftNote}&rdquo;
							</p>
						)}

						<button
							type="submit"
							disabled={isPlacing}
							className="w-full py-4 text-label uppercase font-medium bg-(--text-headline) text-(--bg-base) hover:opacity-95 transition-opacity rounded-xs cursor-pointer disabled:opacity-60 disabled:cursor-wait"
						>
							{isPlacing ? "Placing Order..." : `Place Order · ${formatPrice(totals.totalCents)}`}
						</button>
						<p className="mt-3 text-center font-body text-copy-sm text-(--text-muted)">
							Demo order: no payment will be taken.
						</p>
					</section>
				</div>
			</div>
		</form>
	);
}

function SummaryRow({
	label,
	value,
	accent = false,
}: {
	label: string;
	value: string;
	accent?: boolean;
}) {
	return (
		<div className={`flex justify-between ${accent ? "text-(--text-body)" : "text-(--text-muted)"}`}>
			<dt>{label}</dt>
			<dd className={accent ? "" : "text-(--text-headline)"}>{value}</dd>
		</div>
	);
}
