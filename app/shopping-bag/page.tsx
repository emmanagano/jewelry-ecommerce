"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	X,
	Plus,
	Minus,
	ShieldCheck,
	Truck,
	RotateCcw,
	ShoppingBag,
	ArrowRight,
	Heart,
	Gift,
	ArrowLeft,
} from "lucide-react";
import {
	MAX_QUANTITY,
	useStore,
	type CartItem,
} from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";
import { luxurySpring, staggerContainer, fadeSlide } from "@/app/lib/motion";
import { formatPrice } from "@/app/lib/format";
import { applyPromoCode } from "@/app/lib/store-actions";
import {
	COURIER_CENTS,
	FREE_COURIER_THRESHOLD_CENTS,
	GIFT_PACKAGING_CENTS,
	computeTotals,
} from "@/app/lib/pricing";
import {
	DEFAULT_CHECKOUT_OPTIONS,
	readCheckoutOptions,
	saveCheckoutOptions,
} from "@/app/lib/checkout-options";

const staggerContainerVariants = staggerContainer(0.1);
const staggerItem = fadeSlide(20);

export default function BagPage() {
	const {
		cart,
		updateQuantity,
		removeFromCart,
		toggleWishlist,
		isLiked,
		totalCartCount,
		isHydrated,
	} = useStore();

	// Gift and promo choices persist for this tab and carry into checkout
	const [initialOptions] = useState(() =>
		typeof window === "undefined"
			? DEFAULT_CHECKOUT_OPTIONS
			: readCheckoutOptions(),
	);
	const [includeGiftPackaging, setIncludeGiftPackaging] = useState(
		initialOptions.giftPackaging,
	);
	const [giftNote, setGiftNote] = useState(initialOptions.giftNote);
	const [promoCode, setPromoCode] = useState("");
	const [appliedPromo, setAppliedPromo] = useState<{
		code: string;
		percentOff: number;
	} | null>(initialOptions.promo);

	useEffect(() => {
		saveCheckoutOptions({
			giftPackaging: includeGiftPackaging,
			giftNote,
			promo: appliedPromo,
		});
	}, [includeGiftPackaging, giftNote, appliedPromo]);
	const [promoError, setPromoError] = useState<string | null>(null);
	const [isCheckingPromo, startPromoCheck] = useTransition();
	const discountPercent = (appliedPromo?.percentOff ?? 0) / 100;

	// Calculations (cents), shared with checkout and the server's place_order
	const subtotalCents = cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);
	const totals = computeTotals(subtotalCents, {
		giftPackaging: includeGiftPackaging,
		percentOff: appliedPromo?.percentOff ?? 0,
	});
	const { discountCents, qualifiesForFreeCourier } = totals;
	const shippingProgress = Math.min(
		(subtotalCents / FREE_COURIER_THRESHOLD_CENTS) * 100,
		100,
	);

	// Codes are checked on the server against the promo_codes table
	const handleApplyPromo = (e: React.FormEvent) => {
		e.preventDefault();
		setPromoError(null);
		startPromoCheck(async () => {
			const result = await applyPromoCode(promoCode);
			if (result.ok) {
				setAppliedPromo({ code: result.code, percentOff: result.percentOff });
				setPromoCode("");
			} else {
				setPromoError(result.message);
			}
		});
	};

	const handleMoveToWishlist = (item: CartItem) => {
		removeFromCart(item.id, item.size);
		if (!isLiked(item.id)) {
			toggleWishlist(item.id);
		}
	};

	if (!isHydrated) {
		return (
			<div className="min-h-screen py-16 px-4 sm:px-8 max-w-screen-2xl mx-auto animate-pulse">
				<div className="h-4 w-32 bg-(--card-sub) rounded-xs mb-4" />
				<div className="h-8 w-64 bg-(--card-sub) rounded-xs mb-12" />
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
					<div className="lg:col-span-7 space-y-6">
						<div className="h-40 bg-(--card-sub) rounded-xs" />
						<div className="h-40 bg-(--card-sub) rounded-xs" />
					</div>
					<div className="lg:col-span-5 h-96 bg-(--card-sub) rounded-xs" />
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-12 px-4 sm:px-8 max-w-screen-2xl mx-auto bg-(--bg-base)">
			{/* Editorial Header */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={luxurySpring}
				className="mb-12 pb-6 border-b border-(--border-color)/60"
			>
				<span className="eyebrow text-(--text-muted) block mb-3">
					Selected Pieces
				</span>
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
					<h1 className="font-primary text-3xl sm:text-4xl tracking-tight text-(--text-headline)">
						Shopping Bag{" "}
						{totalCartCount > 0 && (
							<span className="text-(--text-muted) font-light">
								({totalCartCount})
							</span>
						)}
					</h1>
					<Link
						href="/"
						className="group flex items-center gap-2 text-label uppercase font-medium text-(--text-headline) hover:text-(--text-muted) transition-colors pb-1 border-b border-transparent hover:border-(--text-muted)"
					>
						<ArrowLeft
							size={12}
							className="stroke-[1.5] transition-transform group-hover:-translate-x-1"
						/>
						<span>Continue Exploring</span>
					</Link>
				</div>

				{/* Quiet Courier Guarantee Indicator */}
				<AnimatePresence>
					{cart.length > 0 && (
						<motion.div
							key="courier-indicator"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={luxurySpring}
							className="mt-8 pt-5 border-t border-(--border-color)/60 overflow-hidden"
						>
							<div className="flex justify-between items-center eyebrow mb-3">
								<span className="text-(--text-muted)">
									{qualifiesForFreeCourier
										? "Your order qualifies for complimentary insured courier delivery"
										: `Add ${formatPrice(FREE_COURIER_THRESHOLD_CENTS - subtotalCents)} more for complimentary courier delivery`}
								</span>
								<span className="font-mono text-(--text-headline) tracking-tight">
									{Math.round(shippingProgress)}%
								</span>
							</div>
							<div className="w-full h-px bg-(--border-color) relative overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${shippingProgress}%` }}
									transition={{
										duration: 1.5,
										ease: [0.25, 0.46, 0.45, 0.94],
									}}
									className="absolute top-0 left-0 h-full bg-(--text-headline)"
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>

			{/* Empty State */}
			{cart.length === 0 ? (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={luxurySpring}
					className="py-32 text-center flex flex-col items-center justify-center"
				>
					<div className="w-16 h-16 rounded-full border border-(--border-color) bg-(--card-sub)/50 flex items-center justify-center mb-6">
						<ShoppingBag
							size={20}
							className="stroke-[1.5] text-(--text-muted)"
						/>
					</div>
					<h2 className="font-primary text-2xl tracking-tight mb-3 text-(--text-headline)">
						Your Shopping Bag is Empty
					</h2>
					<p className="font-body text-xs uppercase tracking-widest max-w-md mb-10 leading-relaxed text-(--text-muted) font-light">
						Explore our curated collections to select timeless
						handcrafted jewelry for your personal archive.
					</p>
					<Link href="/">
						<motion.div
							transition={luxurySpring}
							className="py-3.5 px-10 text-label uppercase font-medium bg-(--text-headline) text-(--bg-base) hover:opacity-90 transition-opacity rounded-xs shadow-xs inline-block"
						>
							Discover The Collection
						</motion.div>
					</Link>
				</motion.div>
			) : (
				/* Populated Bag Layout */
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					{/* LEFT: Item Rows (Spans 7 columns) */}
					<motion.div
						variants={staggerContainerVariants}
						initial="hidden"
						animate="show"
						className="lg:col-span-7 flex flex-col space-y-8"
					>
						<div className="divide-y divide-(--border-color)/60 border-y border-(--border-color)/60">
							<AnimatePresence initial={false}>
								{cart.map((item) => (
									<motion.div
										key={`${item.id}-${item.size}`}
										layout
										initial={{
											opacity: 0,
											y: 20,
											scale: 0.95,
										}}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{
											opacity: 0,
											scale: 0.95,
											height: 0,
											padding: 0,
											margin: 0,
											overflow: "hidden",
										}}
										transition={luxurySpring}
										className="py-8 first:pt-6 last:pb-6 flex gap-6 sm:gap-8 relative group origin-top"
									>
										{/* 4:5 Editorial Image Frame */}
										<Link
											href={`/product/${item.slug}`}
											className="w-24 sm:w-32 aspect-4/5 bg-(--card-sub) border border-(--border-color) shrink-0 flex flex-col items-center justify-center relative overflow-hidden transition-opacity hover:opacity-85 rounded-xs"
										>
											{item.image ? (
												<Image
													src={item.image}
													alt={item.name}
													fill
													sizes="128px"
													className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
												/>
											) : (
												<span className="eyebrow text-(--text-muted)">
													Photo
												</span>
											)}
										</Link>

										{/* Details */}
										<div className="flex flex-col flex-1">
											{/* Top Row: Info + Price & X Button */}
											<div className="flex justify-between items-start gap-4">
												<div className="flex flex-col space-y-1.5 pr-4">
													<Link
														href={`/product/${item.slug}`}
														className="font-primary text-base sm:text-lg tracking-tight text-(--text-headline) hover:opacity-70 transition-opacity leading-snug"
													>
														{item.name}
													</Link>
													<p className="eyebrow text-(--text-muted)">
														{item.subtitle}
													</p>
													<p className="font-secondary text-copy-sm text-(--text-muted) pt-1">
														Size:{" "}
														<span className="font-medium text-(--text-headline)">
															{item.size}
														</span>
													</p>
												</div>

												{/* Price & Remove Action */}
												<div className="flex items-start gap-3 sm:gap-4 shrink-0">
													<span className="font-serif font-medium text-sm text-(--text-headline) whitespace-nowrap mt-1">
														{formatPrice(
															item.price *
																item.quantity,
														)}
													</span>
													<motion.button
														transition={
															luxurySpring
														}
														type="button"
														onClick={() =>
															removeFromCart(
																item.id,
																item.size,
															)
														}
														className="p-1 -mr-1 mt-0.5 text-(--text-muted) hover:text-(--text-headline) cursor-pointer"
														aria-label="Remove item"
													>
														<X
															size={15}
															className="stroke-[1.5]"
														/>
													</motion.button>
												</div>
											</div>

											{/* Stepper & Actions */}
											<div className="flex items-end justify-between mt-auto pt-6">
												{/* Minimal Stepper */}
												<div className="inline-flex items-center border border-(--border-color) rounded-xs bg-(--card-sub)/30">
													<motion.button
														type="button"
														onClick={() =>
															updateQuantity(
																item.id,
																item.size,
																item.quantity -
																	1,
															)
														}
														className="p-2.5 text-(--text-muted) hover:text-(--text-headline) cursor-pointer"
														aria-label="Decrease quantity"
													>
														<Minus
															size={11}
															className="stroke-[1.5]"
														/>
													</motion.button>
													<span className="px-3 font-body text-xs font-medium text-(--text-headline)">
														{item.quantity}
													</span>
													<motion.button
														type="button"
														onClick={() =>
															updateQuantity(
																item.id,
																item.size,
																item.quantity +
																	1,
															)
														}
														disabled={
															item.quantity >=
															MAX_QUANTITY
														}
														className="p-2.5 text-(--text-muted) hover:text-(--text-headline) cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
														aria-label="Increase quantity"
													>
														<Plus
															size={11}
															className="stroke-[1.5]"
														/>
													</motion.button>
												</div>

												{/* Quiet Move to Wishlist */}
												<motion.button
													type="button"
													onClick={() =>
														handleMoveToWishlist(
															item,
														)
													}
													className="eyebrow flex items-center gap-1.5 cursor-pointer text-(--text-muted) hover:text-(--accent-love) transition-colors"
												>
													<Heart
														size={12}
														className="stroke-[1.5]"
													/>
													<span>Save for Later</span>
												</motion.button>
											</div>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
						</div>

						{/* Bespoke Presentation Option */}
						<motion.div
							variants={staggerItem}
							className="p-6 sm:p-8 border border-(--border-color) bg-(--card-sub)/40 rounded-xs transition-colors"
						>
							<div className="flex items-start justify-between">
								<div className="flex items-start gap-4">
									<Gift
										size={18}
										className="stroke-[1.5] mt-0.5 text-(--text-muted)"
									/>
									<div className="space-y-1.5">
										<h3 className="text-label uppercase font-medium text-(--text-headline)">
											Bespoke Gift Presentation (+$5.00)
										</h3>
										<p className="text-copy-sm text-(--text-muted) max-w-md font-light">
											Individually housed in our signature
											textured gift box, bound with raw
											silk ribbon and accompanied by a
											wax-sealed envelope.
										</p>
									</div>
								</div>
								<input
									type="checkbox"
									id="giftPackaging"
									checked={includeGiftPackaging}
									onChange={(e) =>
										setIncludeGiftPackaging(
											e.target.checked,
										)
									}
									className="w-4 h-4 cursor-pointer accent-(--text-headline) mt-1 shrink-0"
								/>
							</div>

							<AnimatePresence>
								{includeGiftPackaging && (
									<motion.div
										key="gift-note-panel"
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={luxurySpring}
										className="overflow-hidden"
									>
										<div className="mt-5 pt-5 border-t border-(--border-color)/60">
											<label
												htmlFor="giftNote"
												className="eyebrow block mb-2 font-medium text-(--text-headline)"
											>
												Personalized Inscription
												(Complimentary)
											</label>
											<textarea
												id="giftNote"
												rows={2}
												maxLength={140}
												value={giftNote}
												onChange={(e) =>
													setGiftNote(e.target.value)
												}
												placeholder="Write your note to be handwritten by our studio..."
												className="w-full font-body text-xs p-3 bg-white/50 dark:bg-black/20 border border-(--border-color) rounded-xs focus:outline-none focus:border-(--text-headline)/50 text-(--text-headline) placeholder:text-(--text-muted)"
											/>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</motion.div>

					{/* RIGHT: Order Summary (Spans 5 columns, Sticky) */}
					<motion.div
						layout
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ ...luxurySpring, delay: 0.2 }}
						className="lg:col-span-5 lg:sticky lg:top-32 space-y-6"
					>
						<div className="border border-(--border-color) bg-(--card-sub)/20 p-6 sm:p-8 rounded-xs">
							<h2 className="text-label uppercase font-medium pb-4 border-b border-(--border-color)/60 mb-6 text-(--text-headline)">
								Order Summary
							</h2>

							{/* Discreet Privilege / Archive Inscription */}
							<form
								onSubmit={handleApplyPromo}
								className={`flex gap-2 ${promoError || appliedPromo ? "mb-3" : "mb-8"}`}
							>
								<input
									type="text"
									placeholder="Promo code"
									aria-label="Promo code"
									aria-invalid={promoError ? true : undefined}
									aria-describedby={promoError ? "promo-message" : undefined}
									value={promoCode}
									onChange={(e) =>
										setPromoCode(e.target.value)
									}
									className="flex-1 bg-transparent border border-(--border-color) px-3 py-2.5 font-secondary text-xs uppercase tracking-wider placeholder:normal-case focus:outline-none focus:border-(--text-headline)/40 rounded-xs text-(--text-headline) placeholder:text-(--text-muted)"
								/>
								<motion.button
									type="submit"
									disabled={isCheckingPromo || !promoCode.trim()}
									className="px-5 border border-(--border-color) bg-(--card-sub) text-label uppercase font-medium transition-colors hover:bg-(--text-headline) hover:text-(--bg-base) cursor-pointer rounded-xs text-(--text-headline) disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isCheckingPromo ? "Checking" : "Apply"}
								</motion.button>
							</form>
							{promoError && (
								<p
									id="promo-message"
									role="alert"
									className="mb-8 text-copy-sm text-(--error-text)"
								>
									{promoError}
								</p>
							)}
							{appliedPromo && !promoError && (
								<p
									role="status"
									className="mb-8 flex items-center justify-between eyebrow text-(--text-muted)"
								>
									<span>
										Code{" "}
										<span className="font-semibold text-(--text-headline)">
											{appliedPromo.code}
										</span>{" "}
										applied
									</span>
									<button
										type="button"
										onClick={() => setAppliedPromo(null)}
										className="underline underline-offset-4 hover:text-(--text-headline) cursor-pointer"
									>
										Remove
									</button>
								</p>
							)}

							{/* Price Breakdown */}
							<motion.div
								layout
								className="space-y-4 text-label uppercase pb-6 border-b border-(--border-color)/60 font-medium"
							>
								<div className="flex justify-between text-(--text-muted)">
									<span>
										Subtotal ({totalCartCount}{" "}
										{totalCartCount === 1
											? "item"
											: "items"}
										)
									</span>
									<span className="text-(--text-headline)">
										{formatPrice(subtotalCents)}
									</span>
								</div>

								<AnimatePresence>
									{includeGiftPackaging && (
										<motion.div
											key="gift-fee"
											initial={{ opacity: 0, height: 0 }}
											animate={{
												opacity: 1,
												height: "auto",
											}}
											exit={{ opacity: 0, height: 0 }}
											className="flex justify-between text-(--text-muted) overflow-hidden"
										>
											<span>Gift Presentation</span>
											<span className="text-(--text-headline)">
												{formatPrice(
													GIFT_PACKAGING_CENTS,
												)}
											</span>
										</motion.div>
									)}
									{discountPercent > 0 && (
										<motion.div
											key="discount-row"
											initial={{ opacity: 0, height: 0 }}
											animate={{
												opacity: 1,
												height: "auto",
											}}
											exit={{ opacity: 0, height: 0 }}
											className="flex justify-between text-(--accent-love) overflow-hidden"
										>
											<span>
												Privilege Courtesy (-
												{appliedPromo?.percentOff}%)
											</span>
											<span>
												-{formatPrice(discountCents)}
											</span>
										</motion.div>
									)}
								</AnimatePresence>

								<div className="flex justify-between text-(--text-muted)">
									<span>Insured Courier</span>
									<span className="text-(--text-headline)">
										{qualifiesForFreeCourier
											? "Complimentary"
											: formatPrice(COURIER_CENTS)}
									</span>
								</div>

								<div className="flex justify-between text-(--text-muted)">
									<span>Taxes & Duties</span>
									<span className="text-(--text-headline)">
										Included
									</span>
								</div>
							</motion.div>

							{/* Final Total Investment */}
							<motion.div
								layout
								className="flex justify-between items-baseline pt-6 mb-8"
							>
								<span className="text-label uppercase font-medium text-(--text-headline)">
									Total Investment
								</span>
								<motion.span
									layout="position"
									className="font-primary text-3xl font-medium tracking-tight text-(--text-headline)"
								>
									{formatPrice(totals.totalCents)}
								</motion.span>
							</motion.div>

							<Link
								href="/checkout"
								className="w-full py-4 text-label uppercase font-medium bg-(--text-headline) text-(--bg-base) hover:opacity-95 transition-opacity rounded-xs cursor-pointer flex items-center justify-center gap-2 shadow-xs"
							>
								<span>Proceed to Checkout</span>
								<ArrowRight
									size={14}
									className="stroke-[1.5]"
								/>
							</Link>
						</div>

						{/* Editorial Guarantees */}
						<div className="space-y-4 text-copy-sm tracking-wide text-(--text-muted) px-2 font-light">
							<div className="flex items-start gap-3.5">
								<Truck
									size={14}
									className="stroke-[1.5] mt-0.5 text-(--text-headline)"
								/>
								<span>
									Insured direct courier dispatch with
									tamper-evident seal.
								</span>
							</div>
							<div className="flex items-start gap-3.5">
								<RotateCcw
									size={14}
									className="stroke-[1.5] mt-0.5 text-(--text-headline)"
								/>
								<span>
									30-day complimentary return or exchange
									privilege.
								</span>
							</div>
							<div className="flex items-start gap-3.5">
								<ShieldCheck
									size={14}
									className="stroke-[1.5] mt-0.5 text-(--text-headline)"
								/>
								<span>
									Certificate of authenticity & lifetime
									atelier guarantee.
								</span>
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</div>
	);
}
