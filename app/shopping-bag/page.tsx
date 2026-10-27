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
} from "lucide-react";
import { useStore, CartItem } from "@/context/StoreContext";

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
			<main className="min-h-screen py-16 px-6 sm:px-12 max-w-7xl mx-auto animate-pulse">
				<div className="h-4 w-32 bg-gray-200 rounded mb-4" />
				<div className="h-8 w-64 bg-gray-200 rounded mb-12" />
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
					<div className="lg:col-span-7 space-y-6">
						<div className="h-36 bg-gray-100 rounded-xs" />
						<div className="h-36 bg-gray-100 rounded-xs" />
					</div>
					<div className="lg:col-span-5 h-96 bg-gray-100 rounded-xs" />
				</div>
			</main>
		);
	}

	return (
		<main
			className="min-h-screen py-12 px-6 sm:px-12 max-w-7xl mx-auto"
			style={{ backgroundColor: "var(--bg-base)" }}
		>
			{/* Editorial Header */}
			<div
				className="mb-10 pb-6 border-b"
				style={{ borderColor: "var(--border-color)" }}
			>
				<span
					className="text-[10px] uppercase tracking-[0.25em] font-semibold block mb-2"
					style={{ color: "var(--text-muted)" }}
				>
					Selected Pieces
				</span>
				<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
					<h1
						className="font-serif text-3xl sm:text-4xl tracking-tight"
						style={{ color: "var(--text-headline)" }}
					>
						Shopping Bag ({totalCartCount})
					</h1>
					<Link
						href="/"
						className="text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity"
						style={{ color: "var(--accent-blue)" }}
					>
						← Continue Exploring
					</Link>
				</div>

				{/* Quiet Courier Guarantee Indicator */}
				{cart.length > 0 && (
					<div
						className="mt-8 pt-4 border-t"
						style={{ borderColor: "var(--border-color)" }}
					>
						<div className="flex justify-between items-center text-[11px] uppercase tracking-wider mb-2">
							<span style={{ color: "var(--text-muted)" }}>
								{qualifiesForFreeCourier
									? "Your order qualifies for complimentary insured courier delivery"
									: `Add ${formatPrice(FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents)} more for complimentary courier delivery`}
							</span>
							<span
								className="font-mono text-[10px]"
								style={{ color: "var(--text-headline)" }}
							>
								{Math.round(shippingProgress)}%
							</span>
						</div>
						<div
							className="w-full h-0.5 rounded-full overflow-hidden"
							style={{ backgroundColor: "var(--card-sub)" }}
						>
							<div
								className="h-full transition-all duration-500 ease-out"
								style={{
									width: `${shippingProgress}%`,
									backgroundColor: "var(--accent-light)",
								}}
							/>
						</div>
					</div>
				)}
			</div>

			{/* Empty State */}
			{cart.length === 0 ? (
				<div className="py-24 text-center flex flex-col items-center justify-center">
					<div
						className="w-16 h-16 rounded-full border flex items-center justify-center mb-6"
						style={{
							borderColor: "var(--border-color)",
							backgroundColor: "var(--card-sub)",
						}}
					>
						<ShoppingBag
							size={20}
							className="stroke-[1.5]"
							style={{ color: "var(--text-muted)" }}
						/>
					</div>
					<h2
						className="font-serif text-2xl tracking-tight mb-2"
						style={{ color: "var(--text-headline)" }}
					>
						Your Shopping Bag is Empty
					</h2>
					<p
						className="text-xs uppercase tracking-wider max-w-sm mb-8 leading-relaxed"
						style={{ color: "var(--text-muted)" }}
					>
						Explore our curated collections to select timeless
						handcrafted jewelry.
					</p>
					<Link
						href="/"
						className="py-3.5 px-8 text-xs uppercase tracking-[0.2em] font-semibold text-white transition-opacity hover:opacity-90 rounded-xs"
						style={{ backgroundColor: "var(--accent-light)" }}
					>
						Discover Pieces
					</Link>
				</div>
			) : (
				/* Populated Bag Layout */
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					{/* LEFT: Item Rows (65%) */}
					<div
						className="lg:col-span-7 divide-y"
						style={{ borderColor: "var(--border-color)" }}
					>
						{cart.map((item) => (
							<div
								key={`${item.id}-${item.size}`}
								className="py-6 first:pt-0 flex gap-6 relative group"
							>
								{/* 4:5 Editorial Image Frame */}
								<Link
									href={`/product/${item.slug}`}
									className="w-24 sm:w-28 aspect-4/5 border shrink-0 flex flex-col items-center justify-center relative overflow-hidden transition-opacity hover:opacity-85"
									style={{
										backgroundColor: "var(--card-sub)",
										borderColor: "var(--border-color)",
									}}
								>
									<div
										className="w-12 h-12 rounded-full border flex items-center justify-center mb-1"
										style={{
											borderColor: "var(--border-color)",
											backgroundColor: "var(--card-main)",
										}}
									>
										<span
											className="text-[9px] uppercase tracking-widest font-semibold"
											style={{
												color: "var(--text-muted)",
											}}
										>
											Piece
										</span>
									</div>
								</Link>

								{/* Details */}
								<div className="flex flex-col justify-between flex-1 pr-6">
									<div>
										<div className="flex justify-between items-start gap-4">
											<Link
												href={`/product/${item.slug}`}
												className="font-serif text-base sm:text-lg tracking-tight hover:opacity-75 transition-opacity"
												style={{
													color: "var(--text-headline)",
												}}
											>
												{item.name}
											</Link>
											<span
												className="font-serif text-base font-medium whitespace-nowrap"
												style={{
													color: "var(--text-headline)",
												}}
											>
												{formatPrice(
													item.price * item.quantity,
												)}
											</span>
										</div>

										<p
											className="text-xs uppercase tracking-wider mt-1"
											style={{
												color: "var(--text-muted)",
											}}
										>
											{item.subtitle}
										</p>
										<p className="text-xs tracking-wider mt-1">
											<span
												style={{
													color: "var(--text-muted)",
												}}
											>
												Size:{" "}
											</span>
											<span
												className="font-medium"
												style={{
													color: "var(--text-headline)",
												}}
											>
												{item.size}
											</span>
										</p>
									</div>

									{/* Stepper & Actions */}
									<div className="flex items-center justify-between mt-6">
										{/* Minimal Stepper */}
										<div
											className="inline-flex items-center border rounded-xs"
											style={{
												borderColor:
													"var(--border-color)",
											}}
										>
											<button
												type="button"
												onClick={() =>
													updateQuantity(
														item.id,
														item.size,
														item.quantity - 1,
													)
												}
												className="p-2 transition cursor-pointer hover:opacity-70"
												style={{
													color: "var(--text-headline)",
												}}
												aria-label="Decrease quantity"
											>
												<Minus size={11} />
											</button>
											<span
												className="px-3 text-xs font-mono"
												style={{
													color: "var(--text-headline)",
												}}
											>
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
												className="p-2 transition cursor-pointer hover:opacity-70"
												style={{
													color: "var(--text-headline)",
												}}
												aria-label="Increase quantity"
											>
												<Plus size={11} />
											</button>
										</div>

										{/* Quiet Move to Wishlist */}
										<button
											type="button"
											onClick={() =>
												handleMoveToWishlist(item)
											}
											className="text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
											style={{
												color: "var(--text-muted)",
											}}
											onMouseEnter={(e) =>
												(e.currentTarget.style.color =
													"#f43f5e")
											}
											onMouseLeave={(e) =>
												(e.currentTarget.style.color =
													"var(--text-muted)")
											}
										>
											<Heart
												size={13}
												className="stroke-[1.5]"
											/>
											<span>Save for Later</span>
										</button>
									</div>
								</div>

								{/* Remove Line Item */}
								<button
									type="button"
									onClick={() =>
										removeFromCart(item.id, item.size)
									}
									className="absolute top-6 right-0 p-1 transition cursor-pointer hover:opacity-60"
									style={{ color: "var(--text-muted)" }}
									aria-label="Remove item"
								>
									<X size={14} />
								</button>
							</div>
						))}

						{/* Bespoke Presentation Option */}
						<div className="pt-8 mt-4">
							<div
								className="p-5 border rounded-xs transition-colors"
								style={{
									borderColor: "var(--border-color)",
									backgroundColor: "var(--card-sub)",
								}}
							>
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-3">
										<Gift
											size={18}
											className="stroke-[1.5] mt-0.5"
											style={{
												color: "var(--accent-blue)",
											}}
										/>
										<div>
											<h3
												className="text-xs uppercase tracking-widest font-semibold"
												style={{
													color: "var(--text-headline)",
												}}
											>
												Bespoke Gift Presentation
												(+$5.00)
											</h3>
											<p
												className="text-[11px] mt-1 leading-relaxed"
												style={{
													color: "var(--text-body)",
												}}
											>
												Individually housed in our
												signature textured gift box,
												bound with raw silk ribbon and
												accompanied by a wax-sealed
												envelope.
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
										className="w-4 h-4 cursor-pointer accent-(--accent-light) mt-1"
									/>
								</div>

								{includeGiftPackaging && (
									<div
										className="mt-4 pt-4 border-t"
										style={{
											borderColor: "var(--border-color)",
										}}
									>
										<label
											htmlFor="giftNote"
											className="text-[10px] uppercase tracking-widest block mb-1.5 font-medium"
											style={{
												color: "var(--text-muted)",
											}}
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
											className="w-full text-xs p-2.5 bg-transparent border rounded-xs focus:outline-none focus:border-(--text-headline)"
											style={{
												borderColor:
													"var(--border-color)",
												color: "var(--text-headline)",
											}}
										/>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* RIGHT: Order Summary (35% Sticky) */}
					<div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
						<div
							className="border p-6 sm:p-8 rounded-xs"
							style={{
								backgroundColor: "var(--card-sub)",
								borderColor: "var(--border-color)",
							}}
						>
							<h2
								className="text-xs uppercase tracking-[0.25em] font-semibold pb-4 border-b mb-6"
								style={{
									color: "var(--text-headline)",
									borderColor: "var(--border-color)",
								}}
							>
								Order Summary
							</h2>

							{/* Discreet Privilege / Archive Inscription */}
							<form
								onSubmit={handleApplyPromo}
								className="flex gap-2 mb-6"
							>
								<input
									type="text"
									placeholder="Code (e.g. ARCHIVE10)"
									value={promoCode}
									onChange={(e) =>
										setPromoCode(e.target.value)
									}
									className="flex-1 bg-transparent border px-3 py-2 text-xs uppercase tracking-wider placeholder:normal-case focus:outline-none"
									style={{
										borderColor: "var(--border-color)",
										color: "var(--text-headline)",
									}}
								/>
								<button
									type="submit"
									className="px-4 py-2 border text-xs uppercase tracking-widest font-semibold transition hover:opacity-75 cursor-pointer"
									style={{
										borderColor: "var(--border-color)",
										backgroundColor: "var(--card-main)",
										color: "var(--text-headline)",
									}}
								>
									Apply
								</button>
							</form>

							{/* Price Breakdown */}
							<div
								className="space-y-3 text-xs tracking-wider pb-6 border-b"
								style={{ borderColor: "var(--border-color)" }}
							>
								<div
									className="flex justify-between"
									style={{ color: "var(--text-muted)" }}
								>
									<span>
										Subtotal ({totalCartCount}{" "}
										{totalCartCount === 1
											? "item"
											: "items"}
										)
									</span>
									<span
										style={{
											color: "var(--text-headline)",
										}}
									>
										{formatPrice(subtotalCents)}
									</span>
								</div>

								{includeGiftPackaging && (
									<div
										className="flex justify-between"
										style={{ color: "var(--text-muted)" }}
									>
										<span>Gift Presentation</span>
										<span
											style={{
												color: "var(--text-headline)",
											}}
										>
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

								<div
									className="flex justify-between"
									style={{ color: "var(--text-muted)" }}
								>
									<span>Insured Courier Delivery</span>
									<span
										style={{
											color: "var(--text-headline)",
										}}
									>
										{qualifiesForFreeCourier
											? "Complimentary"
											: formatPrice(1500)}
									</span>
								</div>

								<div
									className="flex justify-between"
									style={{ color: "var(--text-muted)" }}
								>
									<span>Taxes & Duties</span>
									<span
										style={{
											color: "var(--text-headline)",
										}}
									>
										Included
									</span>
								</div>
							</div>

							{/* Final Total Investment */}
							<div className="flex justify-between items-baseline pt-6 mb-8">
								<span
									className="text-xs uppercase tracking-widest font-semibold"
									style={{ color: "var(--text-headline)" }}
								>
									Total Investment
								</span>
								<span
									className="font-serif text-2xl sm:text-3xl font-medium tracking-tight"
									style={{ color: "var(--text-headline)" }}
								>
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
								className="w-full py-4 text-xs uppercase tracking-[0.25em] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.99] rounded-xs cursor-pointer flex items-center justify-center gap-2"
								style={{
									backgroundColor: "var(--accent-light)",
								}}
							>
								<span>Proceed to Checkout</span>
								<ArrowRight size={14} />
							</button>
						</div>

						{/* Editorial Guarantees */}
						<div
							className="space-y-3 text-xs px-2"
							style={{ color: "var(--text-muted)" }}
						>
							<div className="flex items-center gap-3">
								<Truck
									size={14}
									style={{ color: "var(--accent-blue)" }}
									strokeWidth={1.5}
								/>
								<span>
									Insured direct courier dispatch with
									tamper-evident seal
								</span>
							</div>
							<div className="flex items-center gap-3">
								<RotateCcw
									size={14}
									style={{ color: "var(--accent-blue)" }}
									strokeWidth={1.5}
								/>
								<span>
									30-day complimentary return or exchange
									privilege
								</span>
							</div>
							<div className="flex items-center gap-3">
								<ShieldCheck
									size={14}
									style={{ color: "var(--accent-blue)" }}
									strokeWidth={1.5}
								/>
								<span>
									Certificate of authenticity & lifetime
									atelier guarantee
								</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}
