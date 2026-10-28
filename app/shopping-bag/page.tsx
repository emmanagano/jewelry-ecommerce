"use client";

import React, { useState } from "react";
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
import { useStore } from "@/context/StoreContext";

// Extending CartItem locally to include image if it was added to StoreContext
export interface CartItem {
	id: string;
	slug: string;
	name: string;
	subtitle?: string;
	price: number;
	size: string;
	quantity: number;
	image?: string; // Ensure this is passed into addToCart
}

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

	const [includeGiftPackaging, setIncludeGiftPackaging] = useState(false);
	const [giftNote, setGiftNote] = useState("");
	const [promoCode, setPromoCode] = useState("");
	const [discountPercent, setDiscountPercent] = useState(0);

	// Calculations (cents)
	const GIFT_PACKAGING_FEE_CENTS = 500; // $5.00
	const FREE_SHIPPING_THRESHOLD_CENTS = 20000; // $200.00 complimentary courier threshold

	const subtotalCents = cart.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0,
	);
	const packagingCents = includeGiftPackaging ? GIFT_PACKAGING_FEE_CENTS : 0;
	const discountCents = Math.round(subtotalCents * discountPercent);
	const qualifiesForFreeCourier =
		subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
	const shippingProgress = Math.min(
		(subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100,
		100,
	);
	const finalTotalCents = Math.max(
		0,
		subtotalCents - discountCents + packagingCents,
	);

	const formatPrice = (cents: number) => {
		return (cents / 100).toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});
	};

	const handleApplyPromo = (e: React.FormEvent) => {
		e.preventDefault();
		if (promoCode.trim().toUpperCase() === "ARCHIVE10") {
			setDiscountPercent(0.1);
		} else {
			alert("Invalid promotion code. Try code: ARCHIVE10");
		}
	};

	const handleMoveToWishlist = (item: CartItem) => {
		removeFromCart(item.id, item.size);
		if (!isLiked(item.id)) {
			toggleWishlist(item.id);
		}
	};

	if (!isHydrated) {
		return (
			<main className="min-h-screen py-16 px-4 sm:px-8 max-w-screen-2xl mx-auto animate-pulse">
				<div className="h-4 w-32 bg-(--card-sub) rounded-xs mb-4" />
				<div className="h-8 w-64 bg-(--card-sub) rounded-xs mb-12" />
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
					<div className="lg:col-span-7 space-y-6">
						<div className="h-40 bg-(--card-sub) rounded-xs" />
						<div className="h-40 bg-(--card-sub) rounded-xs" />
					</div>
					<div className="lg:col-span-5 h-96 bg-(--card-sub) rounded-xs" />
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen py-12 px-4 sm:px-8 max-w-screen-2xl mx-auto bg-(--bg-base)">
			{/* Editorial Header */}
			<div className="mb-12 pb-6 border-b border-(--border-color)/60">
				<span className="text-[10px] uppercase tracking-[0.25em] font-medium text-(--text-muted) block mb-3">
					Selected Pieces
				</span>
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
					<h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-(--text-headline)">
						Shopping Bag{" "}
						{totalCartCount > 0 && `(${totalCartCount})`}
					</h1>
					<Link
						href="/"
						className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-(--text-headline) hover:text-(--text-muted) transition-colors pb-1 border-b border-transparent hover:border-(--text-muted)"
					>
						<ArrowLeft
							size={12}
							className="stroke-[1.5] transition-transform group-hover:-translate-x-1"
						/>
						<span>Continue Exploring</span>
					</Link>
				</div>

				{/* Quiet Courier Guarantee Indicator */}
				{cart.length > 0 && (
					<div className="mt-8 pt-5 border-t border-(--border-color)/60">
						<div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-medium mb-3">
							<span className="text-(--text-muted)">
								{qualifiesForFreeCourier
									? "Your order qualifies for complimentary insured courier delivery"
									: `Add ${formatPrice(FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents)} more for complimentary courier delivery`}
							</span>
							<span className="font-mono text-(--text-headline) tracking-tight">
								{Math.round(shippingProgress)}%
							</span>
						</div>
						<div className="w-full h-px bg-(--border-color) relative">
							<div
								className="absolute top-0 left-0 h-full bg-(--text-headline) transition-all duration-700 ease-out"
								style={{ width: `${shippingProgress}%` }}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Empty State */}
			{cart.length === 0 ? (
				<div className="py-32 text-center flex flex-col items-center justify-center">
					<div className="w-16 h-16 rounded-full border border-(--border-color) bg-(--card-sub)/50 flex items-center justify-center mb-6">
						<ShoppingBag
							size={20}
							className="stroke-[1.5] text-(--text-muted)"
						/>
					</div>
					<h2 className="font-serif text-2xl tracking-tight mb-3 text-(--text-headline)">
						Your Shopping Bag is Empty
					</h2>
					<p className="text-xs uppercase tracking-widest max-w-md mb-10 leading-relaxed text-(--text-muted) font-light">
						Explore our curated collections to select timeless
						handcrafted jewelry for your personal archive.
					</p>
					<Link
						href="/"
						className="py-3.5 px-10 text-[10px] uppercase tracking-[0.2em] font-semibold bg-(--text-headline) text-(--bg-base) hover:opacity-90 transition-opacity rounded-xs shadow-xs"
					>
						Discover The Collection
					</Link>
				</div>
			) : (
				/* Populated Bag Layout */
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					{/* LEFT: Item Rows (Spans 7 columns) */}
					<div className="lg:col-span-7 flex flex-col space-y-8">
						<div className="divide-y divide-(--border-color)/60 border-y border-(--border-color)/60">
							{cart.map((item) => (
								<div
									key={`${item.id}-${item.size}`}
									className="py-8 first:pt-6 last:pb-6 flex gap-6 sm:gap-8 relative group"
								>
									{/* 4:5 Editorial Image Frame */}
									<Link
										href={`/product/${item.slug}`}
										className="w-24 sm:w-32 aspect-4/5 bg-(--card-sub) border border-(--border-color) shrink-0 flex flex-col items-center justify-center relative overflow-hidden transition-opacity hover:opacity-85 rounded-xs"
									>
										{item.image ? (
											<img
												src={item.image}
												alt={item.name}
												className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
											/>
										) : (
											<span className="text-[9px] uppercase tracking-[0.25em] font-medium text-(--text-muted)">
												Photo
											</span>
										)}
									</Link>

									{/* Details */}
									{/* Details */}
									<div className="flex flex-col flex-1">
										{/* Top Row: Info + Price & X Button */}
										<div className="flex justify-between items-start gap-4">
											<div className="flex flex-col space-y-1.5 pr-4">
												<Link
													href={`/product/${item.slug}`}
													className="font-serif text-base sm:text-lg tracking-tight text-(--text-headline) hover:opacity-70 transition-opacity leading-snug"
												>
													{item.name}
												</Link>
												<p className="text-[10px] uppercase tracking-[0.25em] text-(--text-muted)">
													{item.subtitle}
												</p>
												<p className="text-[11px] tracking-widest text-(--text-muted) pt-1">
													Size:{" "}
													<span className="font-medium text-(--text-headline)">
														{item.size}
													</span>
												</p>
											</div>

											{/* Price & Remove Action Grouped Together */}
											<div className="flex items-start gap-3 sm:gap-4 shrink-0">
												<span className="font-medium text-sm text-(--text-headline) whitespace-nowrap mt-1">
													{formatPrice(
														item.price *
															item.quantity,
													)}
												</span>
												<button
													type="button"
													onClick={() =>
														removeFromCart(
															item.id,
															item.size,
														)
													}
													className="p-1 -mr-1 mt-0.5 transition-colors cursor-pointer text-(--text-muted) hover:text-(--text-headline)"
													aria-label="Remove item"
												>
													<X
														size={15}
														className="stroke-[1.5]"
													/>
												</button>
											</div>
										</div>

										{/* Stepper & Actions */}
										<div className="flex items-end justify-between mt-auto pt-6">
											{/* Minimal Stepper */}
											<div className="inline-flex items-center border border-(--border-color) rounded-xs bg-(--card-sub)/30">
												<button
													type="button"
													onClick={() =>
														updateQuantity(
															item.id,
															item.size,
															item.quantity - 1,
														)
													}
													className="p-2.5 transition-colors cursor-pointer text-(--text-muted) hover:text-(--text-headline)"
													aria-label="Decrease quantity"
												>
													<Minus
														size={11}
														className="stroke-[1.5]"
													/>
												</button>
												<span className="px-3 text-xs font-medium text-(--text-headline)">
													{item.quantity}
												</span>
												<button
													type="button"
													onClick={() =>
														updateQuantity(
															item.id,
															item.size,
															item.quantity + 1,
														)
													}
													className="p-2.5 transition-colors cursor-pointer text-(--text-muted) hover:text-(--text-headline)"
													aria-label="Increase quantity"
												>
													<Plus
														size={11}
														className="stroke-[1.5]"
													/>
												</button>
											</div>

											{/* Quiet Move to Wishlist */}
											<button
												type="button"
												onClick={() =>
													handleMoveToWishlist(item)
												}
												className="text-[9px] uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 transition-colors cursor-pointer text-(--text-muted) hover:text-[#f43f5e]"
											>
												<Heart
													size={12}
													className="stroke-[1.5]"
												/>
												<span>Save for Later</span>
											</button>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Bespoke Presentation Option */}
						<div className="p-6 sm:p-8 border border-(--border-color) bg-(--card-sub)/40 rounded-xs transition-colors">
							<div className="flex items-start justify-between">
								<div className="flex items-start gap-4">
									<Gift
										size={18}
										className="stroke-[1.5] mt-0.5 text-(--text-muted)"
									/>
									<div className="space-y-1.5">
										<h3 className="text-[10px] uppercase tracking-[0.2em] font-semibold text-(--text-headline)">
											Bespoke Gift Presentation (+$5.00)
										</h3>
										<p className="text-[11px] leading-relaxed text-(--text-muted) max-w-md font-light">
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

							{includeGiftPackaging && (
								<div className="mt-5 pt-5 border-t border-(--border-color)/60 animate-in fade-in slide-in-from-top-2 duration-300">
									<label
										htmlFor="giftNote"
										className="text-[9px] uppercase tracking-[0.25em] block mb-2 font-medium text-(--text-headline)"
									>
										Personalized Inscription (Complimentary)
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
										className="w-full text-xs p-3 bg-white/50 dark:bg-black/20 border border-(--border-color) rounded-xs focus:outline-none focus:border-(--text-headline)/50 text-(--text-headline) placeholder-(--text-muted)"
									/>
								</div>
							)}
						</div>
					</div>

					{/* RIGHT: Order Summary (Spans 5 columns, Sticky) */}
					<div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
						<div className="border border-(--border-color) bg-(--card-sub)/20 p-6 sm:p-8 rounded-xs">
							<h2 className="text-[10px] uppercase tracking-[0.3em] font-semibold pb-4 border-b border-(--border-color)/60 mb-6 text-(--text-headline)">
								Order Summary
							</h2>

							{/* Discreet Privilege / Archive Inscription */}
							<form
								onSubmit={handleApplyPromo}
								className="flex gap-2 mb-8"
							>
								<input
									type="text"
									placeholder="Code (e.g. ARCHIVE10)"
									value={promoCode}
									onChange={(e) =>
										setPromoCode(e.target.value)
									}
									className="flex-1 bg-transparent border border-(--border-color) px-3 py-2.5 text-xs uppercase tracking-wider placeholder:normal-case focus:outline-none focus:border-(--text-headline)/40 rounded-xs text-(--text-headline) placeholder-(--text-muted)"
								/>
								<button
									type="submit"
									className="px-5 border border-(--border-color) bg-(--card-sub) text-[9px] uppercase tracking-[0.2em] font-semibold transition-colors hover:bg-(--text-headline) hover:text-(--bg-base) cursor-pointer rounded-xs text-(--text-headline)"
								>
									Apply
								</button>
							</form>

							{/* Price Breakdown */}
							<div className="space-y-4 text-[11px] uppercase tracking-widest pb-6 border-b border-(--border-color)/60 font-medium">
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

								{includeGiftPackaging && (
									<div className="flex justify-between text-(--text-muted)">
										<span>Gift Presentation</span>
										<span className="text-(--text-headline)">
											{formatPrice(
												GIFT_PACKAGING_FEE_CENTS,
											)}
										</span>
									</div>
								)}

								{discountPercent > 0 && (
									<div className="flex justify-between text-[#f43f5e]">
										<span>
											Privilege Courtesy (-
											{discountPercent * 100}%)
										</span>
										<span>
											-{formatPrice(discountCents)}
										</span>
									</div>
								)}

								<div className="flex justify-between text-(--text-muted)">
									<span>Insured Courier</span>
									<span className="text-(--text-headline)">
										{qualifiesForFreeCourier
											? "Complimentary"
											: formatPrice(1500)}
									</span>
								</div>

								<div className="flex justify-between text-(--text-muted)">
									<span>Taxes & Duties</span>
									<span className="text-(--text-headline)">
										Included
									</span>
								</div>
							</div>

							{/* Final Total Investment */}
							<div className="flex justify-between items-baseline pt-6 mb-8">
								<span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
									Total Investment
								</span>
								<span className="font-serif text-3xl font-medium tracking-tight text-(--text-headline)">
									{formatPrice(
										finalTotalCents +
											(qualifiesForFreeCourier
												? 0
												: 1500),
									)}
								</span>
							</div>

							{/* High-Finish Acquisition CTA */}
							<button
								type="button"
								onClick={() =>
									alert(
										"Proceeding to secure acquisition gateway...",
									)
								}
								className="w-full py-4 text-[10px] uppercase tracking-[0.25em] font-semibold bg-(--text-headline) text-(--bg-base) transition-opacity hover:opacity-90 active:scale-[0.99] rounded-xs cursor-pointer flex items-center justify-center gap-2 shadow-xs"
							>
								<span>Proceed to Checkout</span>
								<ArrowRight
									size={14}
									className="stroke-[1.5]"
								/>
							</button>
						</div>

						{/* Editorial Guarantees */}
						<div className="space-y-4 text-[11px] tracking-wide text-(--text-muted) px-2 font-light">
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
					</div>
				</div>
			)}
		</main>
	);
}
