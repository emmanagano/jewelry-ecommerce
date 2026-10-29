# File: app/shopping-bag/page.tsx

```tsx
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
```

# File: app/category/[category]/page.tsx

```tsx
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import ProductCard from "@/components/ProductCard";

interface PageProps {
	params: Promise<{ category: string }>;
}

const CATEGORY_DETAILS: Record<
	string,
	{ title: string; description: string; bannerImage: string }
> = {
	bracelets: {
		title: "Bracelets",
		description:
			"Elevate your wrist stack with our handcrafted bracelets. Whether you love a customizable charm chain or a sleek, minimalist bangle, discover pieces designed for everyday elegance.",
		bannerImage:
			"https://images.unsplash.com/photo-1619119069152-a2b331eb392a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
	},
	rings: {
		title: "Rings",
		description:
			"From delicate micro-pavé stacking bands to bold statement cocktail rings, explore timeless designs crafted in solid gold, vermeil, and sterling silver.",
		bannerImage:
			"https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2000&auto=format&fit=crop",
	},
	necklaces: {
		title: "Necklaces",
		description:
			"Layer your style with sculpted pendants, lustrous pearl stations, and diamond-cut chains designed to shine from day to night.",
		bannerImage:
			"https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2000&auto=format&fit=crop",
	},
	earrings: {
		title: "Earrings",
		description:
			"Discover everyday huggies, statement sculptural drops, and luminous solitaire studs crafted for effortless comfort and radiant shine.",
		bannerImage:
			"https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
	},
};

// 1. Pre-render your primary known categories at build time for instant SEO
export async function generateStaticParams() {
	return [
		{ category: "bracelets" },
		{ category: "rings" },
		{ category: "necklaces" },
		{ category: "earrings" },
	];
}

// 2. Cached database query
async function getCategoryProducts(categoryTitle: string) {
	"use cache";
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.ilike("category", categoryTitle);

	if (error) {
		console.error("Error fetching category products:", error.message);
	}

	return data ?? [];
}

// 3. Skeleton UI shown instantly while params & Supabase resolve
function CategorySkeleton() {
	return (
		<div className="animate-pulse w-full">
			<div className="w-full h-[40vh] bg-(--card-sub) mb-8" />
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
				<div className="h-4 w-24 bg-(--card-sub) rounded mb-6" />
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="aspect-square bg-(--card-sub) rounded-xs"
						/>
					))}
				</div>
			</div>
		</div>
	);
}

// 4. Async component handling URL resolution and DB fetching inside Suspense
async function CategoryContent({ params }: PageProps) {
	const { category } = await params;
	const lowerSlug = category.toLowerCase();

	const info = CATEGORY_DETAILS[lowerSlug];

	if (!info) {
		notFound();
	}

	const categoryTitle =
		lowerSlug.charAt(0).toUpperCase() + lowerSlug.slice(1);

	const products = await getCategoryProducts(categoryTitle);

	return (
		<div className="w-full bg-(--bg-base)">
			{/* --- EDITORIAL HERO BANNER --- */}
			<div className="relative w-full h-[45vh] min-h-87.5 flex flex-col items-center justify-center overflow-hidden">
				{/* Background Image */}
				<img
					src={info.bannerImage}
					alt={`${info.title} Collection`}
					className="absolute inset-0 w-full h-full object-cover object-center"
				/>
				{/* Gradient Scrim for text readability */}
				<div className="absolute inset-0 bg-black/40" />

				{/* Centered Typography */}
				<div className="relative z-10 text-center text-white px-6 max-w-2xl flex flex-col items-center">
					<span className="text-[10px] uppercase tracking-[0.3em] font-medium mb-4 text-white/80">
						The Collection
					</span>
					<h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6 drop-shadow-sm">
						{info.title}
					</h1>
					<p className="text-xs sm:text-sm font-light leading-relaxed text-white/90 max-w-md">
						{info.description}
					</p>
				</div>
			</div>

			{/* --- MAIN CONTENT AREA --- */}
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
				{/* Breadcrumbs */}
				<nav className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center space-x-2 mb-10 text-(--text-muted)">
					<Link
						href="/"
						className="hover:text-(--text-headline) transition-colors"
					>
						Home
					</Link>
					<span className="opacity-50">/</span>
					<span className="text-(--text-headline)">
						{categoryTitle}
					</span>
				</nav>

				{/* Utility Ribbon (Filter/Sort Placeholder) */}
				<div className="mb-8 pb-4 border-b border-(--border-color) flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-semibold text-(--text-headline)">
					<div className="flex items-center gap-4">
						<button className="hover:opacity-70 transition-opacity cursor-pointer">
							Filter +
						</button>
					</div>
					<div>
						<span>
							{products.length}{" "}
							{products.length === 1 ? "Piece" : "Pieces"}
						</span>
					</div>
				</div>

				{/* Product Grid */}
				{products.length === 0 ? (
					<div className="py-24 text-center text-xs tracking-widest uppercase text-(--text-muted)">
						No pieces currently available in this collection.
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

// 5. The page entry point streams immediately without blocking
export default function CategoryPage({ params }: PageProps) {
	return (
		<main className="min-h-screen bg-(--bg-base)">
			<Suspense fallback={<CategorySkeleton />}>
				<CategoryContent params={params} />
			</Suspense>
		</main>
	);
}
```

# File: app/my-wishlist/page.tsx

```tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { supabase } from "@/app/lib/supabase";
import ProductCard, { Product } from "@/components/ProductCard";

export default function WishlistPage() {
	const { wishlist, totalWishlistCount, isHydrated } = useStore();
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let isMounted = true;

		async function fetchWishlistItems() {
			if (!isHydrated) return;

			if (wishlist.length === 0) {
				if (isMounted) {
					setProducts([]);
					setIsLoading(false);
				}
				return;
			}

			setIsLoading(true);
			const { data, error } = await supabase
				.from("products")
				.select("*")
				.in("id", wishlist);

			if (!isMounted) return;

			if (!error && data) {
				// We pass the full `images` array here so the ProductCard's
				// editorial hover reveal works perfectly in the wishlist too.
				const formatted: Product[] = data.map((item) => ({
					id: item.id,
					name: item.name,
					category: item.category,
					price: item.price,
					badge: item.badge,
					slug: item.slug,
					subtitle: item.subtitle,
					images: item.images,
				}));
				setProducts(formatted);
			}
			setIsLoading(false);
		}

		fetchWishlistItems();

		return () => {
			isMounted = false;
		};
	}, [wishlist, isHydrated]);

	if (!isHydrated) {
		return (
			<main className="min-h-screen py-12 lg:py-16 px-4 sm:px-8 max-w-screen-2xl mx-auto animate-pulse">
				<div className="h-4 w-32 bg-(--card-sub) rounded-xs mb-4" />
				<div className="h-8 w-64 bg-(--card-sub) rounded-xs mb-12" />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
					{[1, 2, 3, 4].map((n) => (
						<div key={n} className="space-y-4">
							<div className="aspect-4/5 bg-(--card-sub) rounded-xs" />
							<div className="h-4 w-2/3 bg-(--card-sub) rounded-xs" />
							<div className="h-4 w-1/3 bg-(--card-sub) rounded-xs" />
						</div>
					))}
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen py-12 lg:py-16 px-4 sm:px-8 max-w-screen-2xl mx-auto bg-(--bg-base)">
			{/* Editorial Header */}
			<div className="mb-12 pb-6 border-b border-(--border-color)/60 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<span className="text-[10px] uppercase tracking-[0.25em] font-medium text-(--text-muted) block mb-3">
						Curated Pieces
					</span>
					<h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-(--text-headline)">
						Saved Pieces{" "}
						{totalWishlistCount > 0 && `(${totalWishlistCount})`}
					</h1>
				</div>

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

			{/* Loading State */}
			{isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12 animate-pulse">
					{[1, 2, 3, 4].map((n) => (
						<div key={n} className="space-y-4">
							<div className="aspect-4/5 bg-(--card-sub) rounded-xs" />
							<div className="h-3 w-1/3 bg-(--card-sub) rounded-xs" />
							<div className="h-4 w-2/3 bg-(--card-sub) rounded-xs" />
						</div>
					))}
				</div>
			)}

			{/* Empty State */}
			{!isLoading && products.length === 0 && (
				<div className="py-32 text-center flex flex-col items-center justify-center">
					<div className="w-16 h-16 rounded-full border border-(--border-color) bg-(--card-sub)/50 flex items-center justify-center mb-6">
						<Heart
							size={20}
							className="stroke-[1.5] text-(--text-muted)"
						/>
					</div>
					<h2 className="font-serif text-2xl tracking-tight mb-3 text-(--text-headline)">
						Your Wishlist is Empty
					</h2>
					<p className="text-xs uppercase tracking-widest max-w-md mb-10 leading-relaxed text-(--text-muted) font-light">
						Select the heart icon on any piece across our collection
						to save your personal curation for later acquisition.
					</p>
					<Link
						href="/"
						className="py-3.5 px-10 text-[10px] uppercase tracking-[0.2em] font-semibold bg-(--text-headline) text-(--bg-base) hover:opacity-90 transition-opacity rounded-xs shadow-xs"
					>
						Discover The Collection
					</Link>
				</div>
			)}

			{/* Populated Wishlist Grid */}
			{!isLoading && products.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</main>
	);
}
```

# File: app/product/[slug]/page.tsx

```tsx
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import ProductInteractive from "@/components/ProductInteractive";

interface PageProps {
	params: Promise<{ slug: string }>;
}

// 1. Build-time static generation for all products in DB
export async function generateStaticParams() {
	const { data: products } = await supabase.from("products").select("slug");
	return (products ?? []).map((p) => ({
		slug: p.slug,
	}));
}

// 2. Cached product query
async function getProductBySlug(slug: string) {
	"use cache";
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("slug", slug)
		.single();

	if (error || !data) {
		return null;
	}
	return data;
}

// 3. Loading skeleton
function ProductSkeleton() {
	return (
		<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 lg:py-10 animate-pulse">
			<div className="h-4 w-48 bg-(--card-sub) rounded-xs mb-8" />
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
				<div className="lg:col-span-7 flex flex-col gap-4">
					<div className="aspect-4/5 bg-(--card-sub) rounded-xs" />
					<div className="aspect-4/5 bg-(--card-sub) rounded-xs" />
				</div>
				<div className="lg:col-span-5 space-y-4">
					<div className="h-8 w-3/4 bg-(--card-sub) rounded-xs" />
					<div className="h-4 w-1/3 bg-(--card-sub) rounded-xs" />
					<div className="h-6 w-1/4 bg-(--card-sub) rounded-xs" />
					<div className="h-12 w-full bg-(--card-sub) rounded-xs mt-6" />
				</div>
			</div>
		</div>
	);
}

// 4. Product content
async function ProductContent({ params }: PageProps) {
	const { slug } = await params;
	const product = await getProductBySlug(slug);

	if (!product) {
		notFound();
	}

	// Guarantee 3 images in the stack
	// Uses images[0] (Front View), images[1] (Scale & Wear), and a zoomed images[0] for the Detail Angle
	const rawImages: string[] = product.images ?? [];
	const galleryImages = [
		rawImages[0] ?? "",
		rawImages[1] ?? rawImages[0] ?? "",
		rawImages[0] ?? "", // 3rd stack angle (macro detail)
	].filter(Boolean); // Remove empty strings if images are missing

	return (
		<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
			{/* Breadcrumbs */}
			<nav className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center space-x-2 mb-8 text-(--text-muted)">
				<Link
					href="/"
					className="hover:text-(--text-headline) transition-colors"
				>
					Home
				</Link>
				<span className="opacity-50">/</span>
				<Link
					href={`/category/${product.category.toLowerCase()}`}
					className="hover:text-(--text-headline) transition-colors"
				>
					{product.category}
				</Link>
				<span className="opacity-50">/</span>
				<span className="truncate max-w-xs text-(--text-headline)">
					{product.name}
				</span>
			</nav>

			{/* Main Two-Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				{/* Left: 3-Image Editorial Stack */}
				<div className="lg:col-span-7 flex flex-col gap-4">
					{galleryImages.map((imgSrc, idx) => (
						<div
							key={`${imgSrc}-${idx}`}
							className="relative w-full aspect-4/5 overflow-hidden bg-(--card-sub) border border-(--border-color) rounded-xs"
						>
							<img
								src={imgSrc}
								alt={`${product.name} - View 0${idx + 1}`}
								// The 3rd image (idx 2) is zoomed in by default to act as a detail/macro shot
								className={`w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105 ${
									idx === 2
										? "scale-125 hover:scale-150 origin-center"
										: ""
								}`}
							/>
						</div>
					))}
				</div>

				{/* Right: Sticky Details and Actions */}
				<div className="lg:col-span-5 top-32">
					<ProductInteractive product={product} />
				</div>
			</div>
		</div>
	);
}

export default function ProductPage({ params }: PageProps) {
	return (
		<main className="min-h-screen bg-(--bg-base)">
			<Suspense fallback={<ProductSkeleton />}>
				<ProductContent params={params} />
			</Suspense>
		</main>
	);
}
```

# File: app/layout.tsx

```tsx
import type { Metadata } from "next";
import { Playfair_Display, Inter, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { StoreProvider } from "../context/StoreContext";

// 1. Configure your three fonts
const fontPrimary = Playfair_Display({
	variable: "--font-primary",
	subsets: ["latin"],
});

const fontSecondary = Inter({
	variable: "--font-secondary",
	subsets: ["latin"],
});

const fontBody = Roboto({
	variable: "--font-body",
	weight: ["400", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "BrandLogo | Fine Jewelry & Heirlooms",
	description: "Handcrafted fine jewelry designed for modern longevity.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${fontPrimary.variable} ${fontSecondary.variable} ${fontBody.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-(--bg-base) text-(--text-headline)">
				<StoreProvider>
					<Navbar />
					<main className="grow">{children}</main>
					<Footer />
				</StoreProvider>
			</body>
		</html>
	);
}
```

# File: app/lib/supabase.ts

```tsx
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

# File: app/coming-soon/page.tsx

```tsx
import { Suspense } from "react";
import Link from "next/link";

interface ComingSoonProps {
	searchParams: Promise<{ feature?: string }>;
}

async function ComingSoonContent({ searchParams }: ComingSoonProps) {
	const { feature } = await searchParams;

	const featureTitle = feature
		? feature
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		: "This Page";

	return (
		<section className="max-w-4xl w-full mx-auto py-24 px-6 flex flex-col items-center text-center">
			{/* Editorial Sub-tag */}
			<span
				className="text-[11px] tracking-[0.35em] uppercase font-medium mb-6"
				style={{ color: "var(--text-muted)" }}
			>
				In Development
			</span>

			{/* 2. Headline with whitespace-nowrap and balanced font sizing */}
			<h1
				className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-5 whitespace-nowrap"
				style={{ color: "var(--text-headline)" }}
			>
				{featureTitle} is coming soon.
			</h1>

			{/* Balanced narrative text */}
			<p
				className="text-sm md:text-base leading-relaxed max-w-md mb-12 font-light"
				style={{ color: "var(--text-body)" }}
			>
				We are crafting this experience for our upcoming release. In the
				meantime, discover our current collections.
			</p>

			{/* Minimalist hairline divider */}
			<div
				className="w-16 h-px mb-12"
				style={{ backgroundColor: "var(--border-color)" }}
			/>

			{/* Understated inline typographic links */}
			<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs tracking-[0.2em] uppercase font-medium mb-12">
				{[
					{ name: "Bracelets", href: "/category/bracelets" },
					{ name: "Rings", href: "/category/rings" },
					{ name: "Necklaces", href: "/category/necklaces" },
					{ name: "Earrings", href: "/category/earrings" },
				].map((cat) => (
					<Link
						key={cat.name}
						href={cat.href}
						className="transition-opacity duration-200 hover:opacity-60 underline-offset-8 hover:underline"
						style={{ color: "var(--text-headline)" }}
					>
						{cat.name}
					</Link>
				))}
			</div>

			{/* Return home link */}
			<Link
				href="/"
				className="text-[11px] tracking-[0.25em] uppercase transition-opacity duration-200 hover:opacity-70"
				style={{ color: "var(--accent-blue)" }}
			>
				← Back to Storefront
			</Link>
		</section>
	);
}

export default function ComingSoonPage({ searchParams }: ComingSoonProps) {
	return (
		<main
			className="min-h-[75vh] flex items-center justify-center transition-colors duration-500"
			style={{
				backgroundColor: "var(--bg-base)",
			}}
		>
			<Suspense
				fallback={
					<div
						className="text-center py-24 text-xs tracking-widest uppercase"
						style={{ color: "var(--text-muted)" }}
					>
						Loading...
					</div>
				}
			>
				<ComingSoonContent searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
```

# File: app/page.tsx

```tsx
// import Image from "next/image";

import BestSellers from "@/components/BestSellers";
import Hero from "../components/Hero";
import BrandStory from "@/components/BrandStory";

export default function Home() {
	return (
		<div>
			<Hero />
			<BestSellers />
			<BrandStory />
		</div>
	);
}
```

# File: app/globals.css

```tsx
@import "tailwindcss";

:root {
	/* LIGHT THEME */
	--bg-base: #f4f6f8; /* Crisp clean editorial canvas */
	--card-main: #dbe5ee; /* Soft French slate/powder blue */
	--card-sub: #eef2f6; /* Light plaster tint */
	--card-wide: #e3ebf2; /* Subtle neutral blue */

	--accent-blue: #360a11; /* Deep wine for contrast links */
	--accent-light: #360a11; /* Deep wine button background */

	--text-headline: #1e060a; /* Deep wine near-black text */
	--text-body: #4a2027; /* Muted wine body text */
	--text-muted: rgba(74, 32, 39, 0.6);

	--border-color: rgba(125, 159, 195, 0.35); /* Subtle border lines */
}

/*
DARK THEME (To switch back to dark, just swap :root values with these):
:root {
    --bg-base: #0e0c0d;
    --card-main: #360a11;
    --card-sub: #22080d;
    --card-wide: #1a060a;
    --accent-blue: #7d9fc3;
    --accent-light: #d5e0eb;
    --text-headline: #ffffff;
    --text-body: #d5e0eb;
    --text-muted: rgba(213, 224, 235, 0.5);
    --border-color: rgba(125, 159, 195, 0.2);
}
*/

@theme {
	/* Custom Fonts */
	--font-primary: var(--font-primary);
	--font-secondary: var(--font-secondary);
	--font-body: var(--font-body);

	/* Custom Sizes */
	--text-small: 0.875rem;
	--text-base: 1rem;
	--text-large: 2rem;
}

body {
	background-color: var(--bg-base);
	color: var(--text-headline);
}

/* =========================================
    GLOBAL LUXURY TRANSITIONS
    Forces all interactive elements to use a
    deliberate, fluid ease-out timing.
========================================= */
a,
button,
input,
textarea,
[role="button"] {
	transition-property: color, background-color, border-color, opacity, transform, box-shadow;
	transition-duration: 400ms; /* Slowed down from the standard 150ms */
	transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); /* A bespoke, elegant ease-out curve */
}

```

# File: app/login/page.tsx

```tsx
import React from "react";
import EditorialShowcase from "@/components/EditorialShowcase";
import GlassAuthCard from "@/components/GlassAuthCard";

export default function ClientLoginPage() {
	return (
		<main className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-10 px-4 sm:px-8 bg-(--bg-base)">
			<div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-155 lg:h-[72vh] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(30,6,10,0.05)] border border-(--border-color)">
				{/* LEFT: Restrained 6-column editorial column */}
				<div className="hidden lg:block lg:col-span-6 h-full relative overflow-hidden">
					<EditorialShowcase />
				</div>

				{/* RIGHT: Perfectly centered auth salon desk (6 cols) */}
				<div className="col-span-1 lg:col-span-6 flex items-center justify-center p-8 sm:p-12 lg:p-14 bg-white/40 backdrop-blur-sm">
					<GlassAuthCard />
				</div>
			</div>
		</main>
	);
}
```

# File: components/Hero.tsx

```tsx
"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function Hero() {
	return (
		<section className="w-full px-4 sm:px-8 py-6 h-auto lg:h-[82vh] min-h-160 bg-(--bg-base)">
			{/* Main Bento Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full w-full max-w-screen-2xl mx-auto">
				{/* ============================================================== */}
				{/* LEFT BLOCK: Main Campaign (Silk & Warm Gold Heirlooms) (7 cols) */}
				{/* ============================================================== */}
				<Link
					href="/coming-soon?feature=new-and-featured"
					className="lg:col-span-7 border border-(--border-color) h-120 lg:h-full relative overflow-hidden group block rounded-xs"
				>
					{/* Editorial Background Image */}
					<img
						src="https://images.unsplash.com/photo-1599458349289-18f0ee82e6ed?q=80&w=989&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
						alt="Botanical Silver Heirlooms"
						className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
					/>

					{/* Luxury Vignette / Scrim Gradient */}
					<div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10 transition-opacity group-hover:opacity-90" />

					{/* Campaign Content */}
					<div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12 text-white">
						<span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/70 mb-3 block">
							Edition 01 — The Atelier Collection
						</span>
						<h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4 text-white">
							From Your Heart <br />
							<span className="italic font-normal">
								To Theirs
							</span>
						</h1>
						<p className="text-xs sm:text-sm font-light text-white/80 max-w-md leading-relaxed mb-8">
							Handcrafted heirlooms sculpted in solid 14k gold and
							adorned with responsibly sourced stones, designed to
							celebrate every chapter.
						</p>

						<div className="inline-flex items-center gap-3">
							<span className="text-xs uppercase tracking-[0.25em] font-semibold pb-1 border-b border-white text-white group-hover:border-white/50 transition-colors flex items-center gap-2">
								<span>Discover The Collection</span>
								<ArrowRight
									size={14}
									className="transition-transform duration-300 group-hover:translate-x-1"
								/>
							</span>
						</div>
					</div>
				</Link>

				{/* ============================================================== */}
				{/* RIGHT COLUMN: Category Tiles & Feature Card (5 cols)           */}
				{/* ============================================================== */}
				<div className="lg:col-span-5 flex flex-col gap-4 h-full">
					{/* Top Row: Category Tiles (Rings, Necklaces, Earrings) */}
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-44 lg:h-[36%]">
						{/* Tile 1: Rings (Warm Gold on Silk) */}
						<Link
							href="/category/rings"
							className="relative border border-(--border-color) overflow-hidden group rounded-xs flex flex-col justify-between p-4"
						>
							<img
								src="https://images.unsplash.com/photo-1773142073097-166a5a379cab?q=80&w=800&auto=format&fit=crop"
								alt="Handcrafted Rings on Champagne Silk"
								className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10 transition-opacity group-hover:opacity-90" />

							<div className="relative z-10 flex justify-end w-full">
								<ArrowUpRight
									size={13}
									className="text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
								/>
							</div>

							<div className="relative z-10 text-white">
								<span className="font-serif text-sm tracking-wide block transition-transform duration-300 group-hover:-translate-y-0.5">
									Rings
								</span>
								<span className="text-[9px] uppercase tracking-[0.2em] text-white/70 font-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 block -mt-0.5">
									Explore
								</span>
							</div>
						</Link>

						{/* Tile 2: Necklaces (Delicate Golden Pendant) */}
						<Link
							href="/category/necklaces"
							className="relative border border-(--border-color) overflow-hidden group rounded-xs flex flex-col justify-between p-4"
						>
							<img
								src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
								alt="Fine Necklaces"
								className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10 transition-opacity group-hover:opacity-90" />

							<div className="relative z-10 flex justify-end w-full">
								<ArrowUpRight
									size={13}
									className="text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
								/>
							</div>

							<div className="relative z-10 text-white">
								<span className="font-serif text-sm tracking-wide block transition-transform duration-300 group-hover:-translate-y-0.5">
									Necklaces
								</span>
								<span className="text-[9px] uppercase tracking-[0.2em] text-white/70 font-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 block -mt-0.5">
									Explore
								</span>
							</div>
						</Link>

						{/* Tile 3: Earrings (Sculptural Drops) */}
						<Link
							href="/category/earrings"
							className="relative border border-(--border-color) overflow-hidden group rounded-xs col-span-2 sm:col-span-1 flex flex-col justify-between p-4"
						>
							<img
								src="https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
								alt="Fine Earrings"
								className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10 transition-opacity group-hover:opacity-90" />

							<div className="relative z-10 flex justify-end w-full">
								<ArrowUpRight
									size={13}
									className="text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
								/>
							</div>

							<div className="relative z-10 text-white">
								<span className="font-serif text-sm tracking-wide block transition-transform duration-300 group-hover:-translate-y-0.5">
									Earrings
								</span>
								<span className="text-[9px] uppercase tracking-[0.2em] text-white/70 font-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 block -mt-0.5">
									Explore
								</span>
							</div>
						</Link>
					</div>

					{/* Bottom Row: Wide Rectangle (Lab-Grown Solitaires) */}
					<Link
						href="/category/rings"
						className="relative border border-(--border-color) overflow-hidden group rounded-xs grow p-8 sm:p-10 flex flex-col justify-end min-h-60"
					>
						{/* Studio Solitaire Photography */}
						<img
							src="https://images.unsplash.com/photo-1719924998065-0c60e329ef58?w=1200&auto=format&fit=crop&q=80"
							alt="Lab-Grown Solitaire Diamonds"
							className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
						/>
						{/* Gradient scrim ensuring light silver rings pop while keeping bottom text readable */}
						<div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

						<div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
							<div>
								<span className="text-[9px] uppercase tracking-[0.25em] font-medium text-white/70 block mb-1.5">
									Sustainable Brilliance
								</span>
								<h2 className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-tight text-white mb-2">
									Lab-Grown Diamonds
								</h2>
								<p className="text-xs text-white/75 font-light max-w-sm leading-relaxed">
									Conflict-free clarity engineered for modern
									eternity.
								</p>
							</div>

							<span className="text-[11px] uppercase tracking-widest font-semibold flex items-center gap-1.5 pb-1 border-b border-white text-white group-hover:border-white/60 transition-colors shrink-0 self-start sm:self-auto">
								<span>Explore</span>
								<ArrowRight
									size={12}
									className="transition-transform duration-300 group-hover:translate-x-1"
								/>
							</span>
						</div>
					</Link>
				</div>
			</div>
		</section>
	);
}
```

# File: components/Navbar.tsx

```tsx
"use client";

import React, { useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const { totalCartCount, totalWishlistCount } = useStore();

	const navItems = [
		{
			name: "New & Featured",
			href: "/coming-soon?feature=new-and-featured",
		},
		{ name: "Bracelets", href: "/category/bracelets" },
		{ name: "Rings", href: "/category/rings" },
		{ name: "Necklaces", href: "/category/necklaces" },
		{ name: "Earrings", href: "/category/earrings" },
		{ name: "Engraving", href: "/coming-soon?feature=engraving" },
		{ name: "Gifts", href: "/coming-soon?feature=gifts" },
		{ name: "Blog", href: "/coming-soon?feature=blog" },
	];

	return (
		<header className="w-full bg-(--bg-base) text-(--text-headline) border-b border-(--border-color) sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
			{/* --- TOP ROW: LOGO, SEARCH PILL, ACTIONS --- */}
			<div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4">
				{/* Mobile: Hamburger Button */}
				<div className="flex items-center md:hidden">
					<button
						onClick={() => setIsOpen(true)}
						aria-label="Open navigation menu"
						className="p-1 -ml-1 text-(--text-headline) hover:opacity-60 transition-opacity cursor-pointer"
					>
						<Menu className="w-5 h-5 stroke-[1.5]" />
					</button>
				</div>

				{/* Brand Logo */}
				<div className="shrink-0">
					<Link href="/">
						<span className="font-serif text-lg sm:text-2xl tracking-[0.2em] font-medium uppercase text-(--text-headline)">
							BrandLogo
						</span>
					</Link>
				</div>

				{/* Desktop: Enclosed Search Pill */}
				<div className="hidden md:flex flex-1 justify-center px-8">
					<div className="relative w-full max-w-sm flex items-center group">
						<Search className="absolute left-3.5 w-3.5 h-3.5 text-(--text-muted) group-focus-within:text-(--text-headline) transition-colors pointer-events-none" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search by collection or stone..."
							className="w-full bg-(--card-sub)/70 border border-(--border-color) rounded-full py-1.5 pl-9 pr-4 text-xs text-(--text-headline) placeholder-(--text-muted) tracking-wide transition-all duration-300 focus:outline-none focus:bg-white focus:border-(--text-headline)/40 focus:ring-1 focus:ring-(--text-headline)/20"
						/>
					</div>
				</div>

				{/* Right Actions: Wishlist & Bag */}
				<div className="flex items-center space-x-5 sm:space-x-6 shrink-0">
					{/* Wishlist Link */}
					<Link
						href="/my-wishlist"
						className="text-(--text-headline) hover:opacity-60 transition-opacity relative p-1 cursor-pointer"
						aria-label="Wishlist"
					>
						<Heart className="w-4.5 h-4.5 stroke-[1.5]" />
						{totalWishlistCount > 0 && (
							<span className="absolute 0 right-0 translate-x-1/3 -translate-y-1/3 min-w-4 h-4 px-1 text-[8px] font-semibold rounded-full flex items-center justify-center bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs">
								{totalWishlistCount}
							</span>
						)}
					</Link>

					{/* Shopping Bag Link */}
					<Link
						href="/shopping-bag"
						className="text-(--text-headline) hover:opacity-60 transition-opacity relative p-1 cursor-pointer"
						aria-label="Shopping Bag"
					>
						<ShoppingBag className="w-4.5 h-4.5 stroke-[1.5]" />
						{totalCartCount > 0 && (
							<span className="absolute 0 right-0 translate-x-1/3 -translate-y-1/3 min-w-4 h-4 px-1 text-[8px] font-semibold rounded-full flex items-center justify-center bg-(--text-headline) text-(--bg-base) shadow-xs">
								{totalCartCount}
							</span>
						)}
					</Link>

					<Link
						href="/login"
						className="text-(--text-headline) hover:opacity-60 transition-opacity relative p-1 cursor-pointer"
						aria-label="User"
					>
						<User className="w-4.5 h-4.5 stroke-[1.5]" />
					</Link>
				</div>
			</div>

			{/* --- DESKTOP CATEGORY NAVIGATION STRIP --- */}
			<nav className="hidden md:block w-full border-t border-(--border-color)/60 py-2.5">
				<div className="max-w-screen-2xl mx-auto px-8">
					<ul className="flex items-center justify-center space-x-9 overflow-x-auto whitespace-nowrap text-[11px] uppercase tracking-[0.22em] font-medium text-(--text-muted) hide-scrollbar">
						{navItems.map((item) => (
							<li key={item.name}>
								<Link
									href={item.href}
									className="relative py-1 hover:text-(--text-headline) transition-colors group inline-block"
								>
									<span>{item.name}</span>
									<span className="absolute inset-x-0 bottom-0 h-px bg-(--text-headline) scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
								</Link>
							</li>
						))}
					</ul>
				</div>
			</nav>

			{/* --- MOBILE DRAWER OVERLAY --- */}
			<div
				className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={() => setIsOpen(false)}
			/>

			{/* Mobile Slide-out Menu */}
			<div
				className={`fixed top-0 left-0 bottom-0 w-[84vw] max-w-xs bg-(--bg-base) border-r border-(--border-color) p-6 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden shadow-2xl ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div>
					{/* Drawer Header */}
					<div className="flex items-center justify-between pb-5 border-b border-(--border-color)">
						<span className="font-serif text-base tracking-[0.2em] font-medium uppercase">
							Navigation
						</span>
						<button
							onClick={() => setIsOpen(false)}
							aria-label="Close menu"
							className="p-1 -mr-1 text-(--text-headline) hover:opacity-60 transition-opacity cursor-pointer"
						>
							<X className="w-5 h-5 stroke-[1.5]" />
						</button>
					</div>

					{/* Mobile Enclosed Search */}
					<div className="mt-5 mb-6">
						<div className="relative flex items-center">
							<Search className="absolute left-3.5 w-3.5 h-3.5 text-(--text-muted)" />
							<input
								type="text"
								placeholder="Search pieces..."
								className="w-full bg-(--card-sub)/70 border border-(--border-color) rounded-full py-2 pl-9 pr-3 text-xs text-(--text-headline) placeholder-(--text-muted) focus:outline-none focus:border-(--text-headline)"
							/>
						</div>
					</div>

					{/* Category Links */}
					<ul className="flex flex-col space-y-3.5 py-1">
						{navItems.map((item) => (
							<li key={item.name}>
								<Link
									href={item.href}
									onClick={() => setIsOpen(false)}
									className="block text-xs uppercase tracking-[0.2em] font-medium text-(--text-headline) hover:text-(--text-muted) transition-colors py-1"
								>
									{item.name}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Mobile Drawer Footer */}
				<div className="pt-6 border-t border-(--border-color) flex flex-col space-y-3 text-xs tracking-wider font-light text-(--text-muted)">
					<Link
						href="/shopping-bag"
						onClick={() => setIsOpen(false)}
						className="flex items-center justify-between text-(--text-headline)"
					>
						<span>Shopping Bag</span>
						{totalCartCount > 0 && (
							<span className="text-[9px] px-2 py-0.5 rounded-full bg-(--text-headline) text-(--bg-base) font-semibold">
								{totalCartCount}
							</span>
						)}
					</Link>
					<Link
						href="/my-wishlist"
						onClick={() => setIsOpen(false)}
						className="flex items-center justify-between text-(--text-headline)"
					>
						<span>Saved Pieces</span>
						{totalWishlistCount > 0 && (
							<span className="text-[9px] px-2 py-0.5 rounded-full bg-stone-900 text-white font-semibold">
								{totalWishlistCount}
							</span>
						)}
					</Link>
					<Link
						href="/coming-soon?feature=account"
						onClick={() => setIsOpen(false)}
					>
						Client Account
					</Link>
					<Link
						href="/coming-soon?feature=concierge"
						onClick={() => setIsOpen(false)}
					>
						Concierge & Care
					</Link>
				</div>
			</div>
		</header>
	);
}
```

# File: components/EditorialShowcase.tsx

```tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

export interface FeaturedProduct {
	id: string;
	name: string;
	slug: string;
	subtitle: string;
	badge: string | null;
	category: string;
	price: number;
	images?: string[];
	imageUrl?: string;
}

export default function EditorialShowcase() {
	const [products, setProducts] = useState<FeaturedProduct[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchFeatured() {
			const { data, error } = await supabase
				.from("products")
				.select("*")
				.ilike("badge", "%BEST SELLER%")
				.limit(6);

			if (error || !data || data.length === 0) {
				const { data: fallbackData } = await supabase
					.from("products")
					.select("*")
					.limit(6);
				if (fallbackData) setProducts(fallbackData);
			} else {
				setProducts(data);
			}
			setLoading(false);
		}
		fetchFeatured();
	}, []);

	const currentItem = products[currentIndex];

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % products.length);
	};

	const handlePrev = () => {
		setCurrentIndex(
			(prev) => (prev - 1 + products.length) % products.length,
		);
	};

	if (loading || !currentItem) {
		return (
			<div className="w-full h-full bg-(--card-sub) animate-pulse flex flex-col justify-between p-10">
				<div className="h-4 w-28 bg-white/20 rounded-xs" />
				<div className="space-y-3">
					<div className="h-6 w-48 bg-white/20 rounded-xs" />
					<div className="h-10 w-full bg-white/20 rounded-xs" />
				</div>
			</div>
		);
	}

	const displayImg =
		currentItem.images?.[0] ||
		currentItem.imageUrl ||
		"https://images.unsplash.com/photo-1599458349289-18f0ee82e6ed?q=80&w=1200&auto=format&fit=crop";

	return (
		<div className="relative w-full h-full flex flex-col justify-between p-8 sm:p-10 text-white group overflow-hidden select-none">
			{/* High-res background image */}
			<img
				key={displayImg}
				src={displayImg}
				alt={currentItem.name}
				className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
			/>

			{/* Soft subtle vignette scrim (lighter so photography breathes) */}
			<div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />

			{/* TOP: Subtle Stepper */}
			<div className="relative z-10 flex items-center justify-between">
				<Link
					href="/"
					className="group/back inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] font-secondary font-medium text-white/70 hover:text-white transition-colors"
				>
					<ArrowLeft
						size={11}
						className="stroke-[1.5] transition-transform group-hover/back:-translate-x-1"
					/>
					<span>The Atelier</span>
				</Link>

				<div className="flex items-center gap-1 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
					<button
						type="button"
						onClick={handlePrev}
						aria-label="Previous piece"
						className="p-0.5 text-white/70 hover:text-white transition-colors cursor-pointer"
					>
						<ArrowLeft size={10} className="stroke-[1.5]" />
					</button>
					<span className="text-[9px] font-mono tracking-widest text-white/80 px-1.5">
						0{currentIndex + 1} / 0{products.length}
					</span>
					<button
						type="button"
						onClick={handleNext}
						aria-label="Next piece"
						className="p-0.5 text-white/70 hover:text-white transition-colors cursor-pointer"
					>
						<ArrowRight size={10} className="stroke-[1.5]" />
					</button>
				</div>
			</div>

			{/* CENTER: Quiet pill indicator */}
			<div className="relative z-10 self-start inline-flex items-center gap-2 bg-black/25 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-white/80">
				<span className="w-1.5 h-1.5 rounded-full bg-emerald-400/90" />
				<span className="text-[8.5px] uppercase tracking-[0.2em] font-secondary">
					Archive Spotlight
				</span>
			</div>

			{/* BOTTOM: Scaled-back, balanced typography */}
			<div className="relative z-10 max-w-sm space-y-2.5">
				<div className="flex items-center gap-1.5 text-white/65 text-[9px] uppercase tracking-[0.22em] font-secondary">
					<Sparkles size={10} className="text-amber-200/80" />
					<span>
						{currentItem.badge || "Permanent Archive"} •{" "}
						{currentItem.category}
					</span>
				</div>

				<h2 className="font-primary text-2xl sm:text-3xl text-white tracking-tight leading-snug drop-shadow-xs">
					{currentItem.name}
				</h2>

				<p className="font-body text-[11px] text-white/75 font-light tracking-wide line-clamp-1 leading-relaxed">
					{currentItem.subtitle}
				</p>

				<div className="pt-1.5">
					<Link
						href={`/product/${currentItem.slug}`}
						className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] font-secondary font-medium text-white/80 hover:text-white border-b border-white/30 hover:border-white pb-0.5 transition-all"
					>
						<span>View Piece</span>
						<ArrowUpRight size={11} className="stroke-[1.5]" />
					</Link>
				</div>
			</div>
		</div>
	);
}
```

# File: components/BestSellers.tsx

```tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

export interface Product {
	id: string;
	name: string;
	slug: string;
	subtitle: string;
	badge: string;
	category: string;
	price: number;
	images: string[];
	description: string;
}

export default function BestSellers() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const sliderRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	// Fetch live items from Supabase
	useEffect(() => {
		async function fetchProducts() {
			const { data, error } = await supabase
				.from("products")
				.select("*")
				.ilike("badge", "%BEST SELLER%")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching best sellers:", error);
			} else if (data) {
				setProducts(data);
			}
			setLoading(false);
		}

		fetchProducts();
	}, []);

	const checkScroll = () => {
		if (!sliderRef.current) return;
		const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
		setCanScrollLeft(scrollLeft > 5);
		setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
	};

	useEffect(() => {
		checkScroll();
		window.addEventListener("resize", checkScroll);
		return () => window.removeEventListener("resize", checkScroll);
	}, [products]);

	const scroll = (direction: "left" | "right") => {
		if (!sliderRef.current) return;
		const offset = sliderRef.current.clientWidth * 0.75;
		sliderRef.current.scrollBy({
			left: direction === "left" ? -offset : offset,
			behavior: "smooth",
		});
	};

	return (
		<section className="w-full px-4 sm:px-8 py-20 max-w-screen-2xl mx-auto">
			{/* Section Header */}
			<div className="flex items-end justify-between mb-10 pb-5 border-b border-(--border-color)">
				<div>
					<span className="text-[10px] uppercase tracking-[0.28em] font-medium text-(--text-muted) block mb-2">
						Curated Essentials
					</span>
					<h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-(--text-headline)">
						Most Coveted Pieces
					</h2>
				</div>

				{/* Minimal Editorial Arrow Controls */}
				<div className="flex items-center space-x-2">
					<button
						onClick={() => scroll("left")}
						disabled={!canScrollLeft}
						aria-label="Previous pieces"
						className="w-10 h-10 rounded-full border border-(--border-color) flex items-center justify-center text-(--text-headline) disabled:opacity-20 disabled:cursor-not-allowed hover:border-(--text-headline) transition-all duration-300 active:scale-95 cursor-pointer"
					>
						<ArrowLeft className="w-4 h-4 stroke-[1.5]" />
					</button>
					<button
						onClick={() => scroll("right")}
						disabled={!canScrollRight}
						aria-label="Next pieces"
						className="w-10 h-10 rounded-full border border-(--border-color) flex items-center justify-center text-(--text-headline) disabled:opacity-20 disabled:cursor-not-allowed hover:border-(--text-headline) transition-all duration-300 active:scale-95 cursor-pointer"
					>
						<ArrowRight className="w-4 h-4 stroke-[1.5]" />
					</button>
				</div>
			</div>

			{/* Horizontal Scrolling Track */}
			<div
				ref={sliderRef}
				onScroll={checkScroll}
				className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{loading ? (
					// Subtle luxury skeleton loading cards
					<div className="flex gap-6 w-full">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="flex-none w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[calc(25%-18px)] animate-pulse"
							>
								<div className="aspect-4/5 bg-(--card-sub) rounded-xs mb-4" />
								<div className="h-3 w-1/3 bg-(--card-sub) rounded-xs mb-2" />
								<div className="h-4 w-2/3 bg-(--card-sub) rounded-xs mb-2" />
								<div className="h-4 w-1/4 bg-(--card-sub) rounded-xs" />
							</div>
						))}
					</div>
				) : (
					products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							className="flex-none w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[calc(25%-18px)] snap-start"
						/>
					))
				)}
			</div>
		</section>
	);
}
```

# File: components/ProductCard.tsx

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, X, Check } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export interface Product {
	id: string;
	name: string;
	category: string;
	price: number;
	badge?: string | null;
	slug: string;
	subtitle?: string;
	imageUrl?: string;
	images?: string[];
}

interface ProductCardProps {
	product: Product;
	className?: string;
	onQuickView?: (product: Product) => void;
}

const CATEGORY_SIZES: Record<string, string[]> = {
	Rings: ["5", "6", "7", "8", "9"],
	Bracelets: ["16 CM", "17.5 CM", "19 CM"],
	Necklaces: ["16 IN", "18 IN", "20 IN"],
	Earrings: ["Standard"],
};

export default function ProductCard({
	product,
	className = "",
}: ProductCardProps) {
	// 1. Primary Still Image (images[0] or legacy imageUrl)
	const primaryImage = product.images?.[0] || product.imageUrl;
	// 2. Secondary Editorial / On-Model Image (images[1])
	const secondaryImage = product.images?.[1];

	const [primaryError, setPrimaryError] = useState(false);
	const [secondaryError, setSecondaryError] = useState(false);

	const { addToCart, toggleWishlist, isLiked } = useStore();
	const liked = isLiked(product.id);

	const [showSizePicker, setShowSizePicker] = useState(false);
	const [justAdded, setJustAdded] = useState(false);

	const availableSizes = CATEGORY_SIZES[product.category] || ["Standard"];
	const hasMultipleSizes =
		availableSizes.length > 1 && availableSizes[0] !== "Standard";

	const handleWishlist = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		toggleWishlist(product.id);
	};

	const triggerAddToCart = (selectedSize: string) => {
		addToCart({
			id: product.id,
			slug: product.slug,
			name: product.name,
			subtitle: product.subtitle || product.category,
			price: product.price,
			size: selectedSize,
			image: primaryImage,
		});
		setShowSizePicker(false);
		setJustAdded(true);
		setTimeout(() => setJustAdded(false), 1800);
	};

	const handleAddClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (hasMultipleSizes) {
			setShowSizePicker(true);
		} else {
			triggerAddToCart("Standard");
		}
	};

	return (
		<div className={`group flex flex-col relative ${className}`}>
			{/* Product Image Frame */}
			<div className="w-full aspect-4/5 bg-(--card-sub) border border-(--border-color) relative overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-(--text-headline)/40 rounded-xs">
				{/* Clean Luxury Badge */}
				{product.badge && (
					<div className="absolute top-3 left-3 z-10 pointer-events-none">
						<span className="bg-white/95 text-(--text-headline) text-[9px] uppercase tracking-[0.22em] font-medium px-2.5 py-1 border border-black/5 shadow-xs">
							{product.badge}
						</span>
					</div>
				)}

				{/* Floating Wishlist Button */}
				<button
					type="button"
					onClick={handleWishlist}
					aria-label={`Save ${product.name} to wishlist`}
					className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-black/5 flex items-center justify-center z-10 transition-transform duration-200 hover:scale-110 active:scale-95 shadow-xs cursor-pointer"
				>
					<Heart
						className={`w-3.5 h-3.5 transition-colors duration-200 ${
							liked
								? "fill-[#f43f5e] text-[#f43f5e]"
								: "text-stone-600 stroke-[1.5] hover:text-[#f43f5e]"
						}`}
					/>
				</button>

				{/* Image Container with Dual-Angle Hover Reveal */}
				<Link
					href={`/product/${product.slug}`}
					className="w-full h-full flex items-center justify-center relative overflow-hidden"
				>
					{primaryImage && !primaryError ? (
						<>
							{/* Still Product Photo (Always Base) */}
							<img
								src={primaryImage}
								alt={product.name}
								onError={() => setPrimaryError(true)}
								className={`w-full h-full object-cover transition-all duration-700 ease-out ${
									secondaryImage && !secondaryError
										? "group-hover:opacity-0 group-hover:scale-105"
										: "group-hover:scale-105"
								}`}
							/>

							{/* On-Model / Worn Lookbook Photo (Revealed on Hover) */}
							{secondaryImage && !secondaryError && (
								<img
									src={secondaryImage}
									alt={`${product.name} on model`}
									onError={() => setSecondaryError(true)}
									className="w-full h-full object-cover absolute inset-0 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
								/>
							)}
						</>
					) : (
						<div className="w-20 h-20 rounded-full border border-(--border-color) flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-500">
							<span className="text-[10px] uppercase tracking-[0.25em] text-(--text-muted)">
								Atelier
							</span>
						</div>
					)}
				</Link>

				{/* Inline Size Picker Drawer */}
				{showSizePicker && (
					<div
						onClick={(e) => e.stopPropagation()}
						className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md border-t border-(--border-color) p-3 z-20 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200 shadow-md"
					>
						<div className="flex items-center justify-between mb-2">
							<span className="text-[9px] uppercase tracking-[0.22em] font-medium text-stone-500">
								Select Size
							</span>
							<button
								type="button"
								onClick={() => setShowSizePicker(false)}
								className="text-stone-400 hover:text-stone-900 p-0.5"
							>
								<X size={12} />
							</button>
						</div>

						<div className="flex flex-wrap gap-1.5 justify-center">
							{availableSizes.map((sz) => (
								<button
									key={sz}
									type="button"
									onClick={() => triggerAddToCart(sz)}
									className="px-2.5 py-1 text-[10px] tracking-wider uppercase border border-stone-200 bg-stone-50 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer rounded-xs"
								>
									{sz}
								</button>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Product Typography & Pricing */}
			<div className="mt-4 flex flex-col space-y-1.5">
				{/* Category Tag */}
				<span className="text-[10px] uppercase tracking-[0.25em] text-(--text-muted) block">
					{product.category}
				</span>

				{/* Product Title (Full Width) */}
				<Link
					href={`/product/${product.slug}`}
					className="group/link block"
				>
					<h3 className="font-serif text-sm sm:text-base text-(--text-headline) leading-snug group-hover/link:opacity-70 transition-opacity truncate">
						{product.name}
					</h3>
				</Link>

				{/* Dedicated Price & Action Row */}
				<div className="flex items-center justify-between pt-1">
					<span className="text-xs sm:text-sm font-medium text-(--text-headline) tracking-tight">
						{(product.price / 100).toLocaleString("en-US", {
							style: "currency",
							currency: "USD",
						})}
					</span>

					<button
						type="button"
						onClick={handleAddClick}
						disabled={justAdded}
						className="text-[10px] uppercase tracking-[0.2em] font-semibold text-(--text-headline) hover:opacity-60 transition-opacity cursor-pointer underline underline-offset-4 decoration-1 flex items-center gap-1"
					>
						{justAdded ? (
							<>
								<Check size={11} className="text-emerald-600" />
								<span>Added</span>
							</>
						) : (
							<span>Add to Bag</span>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
```

# File: components/Footer.tsx

```tsx
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
	return (
		<footer className="w-full bg-(--card-wide) text-(--text-headline) border-t border-(--border-color) mt-24">
			<div className="max-w-screen-2xl mx-auto px-6 sm:px-8 py-16 lg:py-20">
				{/* Top Grid: Newsletter + Navigation Columns */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-(--border-color)/60">
					{/* Brand & Newsletter Column (Spans 5 columns on desktop) */}
					<div className="lg:col-span-5 pr-0 lg:pr-12 flex flex-col space-y-6">
						<span className="font-serif text-2xl font-medium tracking-[0.2em] uppercase text-(--text-headline)">
							BrandLogo
						</span>
						<p className="text-xs text-(--text-muted) max-w-sm leading-relaxed font-light">
							Handcrafted heirlooms designed for modern longevity.
							Subscribe to receive private collection previews and
							editorial journals.
						</p>

						{/* Enclosed Newsletter Signup Form */}
						<form className="relative max-w-sm flex w-full group mt-2">
							<input
								type="email"
								placeholder="Enter your email address"
								className="w-full bg-transparent border border-(--border-color) py-2.5 pl-4 pr-32 text-xs text-(--text-headline) placeholder-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 transition-colors rounded-xs"
							/>
							<button
								type="submit"
								aria-label="Join private client list"
								className="absolute right-1 top-1 bottom-1 px-4 bg-(--bg-base) hover:bg-(--text-headline) hover:text-(--bg-base) text-(--text-headline) text-[9px] uppercase tracking-[0.2em] font-medium transition-colors border border-(--border-color) cursor-pointer flex items-center gap-1.5 rounded-xs"
							>
								<span>Subscribe</span>
								<ArrowRight
									size={10}
									className="stroke-[1.5]"
								/>
							</button>
						</form>
					</div>

					{/* Navigation Links Container (Spans 7 columns) */}
					<div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
						{/* Column 1: Client Care */}
						<div className="flex flex-col space-y-5">
							<span className="text-[10px] uppercase tracking-[0.25em] text-(--text-headline) font-medium">
								Client Care
							</span>
							<ul className="flex flex-col space-y-3.5 text-[11px] tracking-wide text-(--text-muted) font-light">
								<li>
									<Link
										href="/coming-soon?feature=concierge"
										className="hover:text-(--text-headline) transition-colors"
									>
										Concierge & Appointments
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=ring-sizer"
										className="hover:text-(--text-headline) transition-colors"
									>
										Ring Size Guide
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=shipping"
										className="hover:text-(--text-headline) transition-colors"
									>
										Insured Shipping & Delivery
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=returns"
										className="hover:text-(--text-headline) transition-colors"
									>
										Returns & Lifetime Warranty
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=care"
										className="hover:text-(--text-headline) transition-colors"
									>
										Jewelry Care & Cleaning
									</Link>
								</li>
							</ul>
						</div>

						{/* Column 2: The Maison */}
						<div className="flex flex-col space-y-5">
							<span className="text-[10px] uppercase tracking-[0.25em] text-(--text-headline) font-medium">
								The Maison
							</span>
							<ul className="flex flex-col space-y-3.5 text-[11px] tracking-wide text-(--text-muted) font-light">
								<li>
									<Link
										href="/coming-soon?feature=about"
										className="hover:text-(--text-headline) transition-colors"
									>
										Our Philosophy
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=sustainability"
										className="hover:text-(--text-headline) transition-colors"
									>
										Ethical Craft & Traceability
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=materials"
										className="hover:text-(--text-headline) transition-colors"
									>
										Solid Gold & Lab Diamonds
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=press"
										className="hover:text-(--text-headline) transition-colors"
									>
										Press & Editorial
									</Link>
								</li>
							</ul>
						</div>

						{/* Column 3: Boutiques & Services */}
						<div className="flex flex-col space-y-5">
							<span className="text-[10px] uppercase tracking-[0.25em] text-(--text-headline) font-medium">
								Services
							</span>
							<ul className="flex flex-col space-y-3.5 text-[11px] tracking-wide text-(--text-muted) font-light">
								<li>
									<Link
										href="/coming-soon?feature=custom"
										className="hover:text-(--text-headline) transition-colors"
									>
										Bespoke Commissions
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=engraving"
										className="hover:text-(--text-headline) transition-colors"
									>
										Custom Engraving
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=stores"
										className="hover:text-(--text-headline) transition-colors"
									>
										Locate a Boutique
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=corporate"
										className="hover:text-(--text-headline) transition-colors"
									>
										Corporate Gifting
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom Bar: Copyright, Region, Legal */}
				<div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-(--text-muted) font-medium space-y-4 md:space-y-0">
					<div>
						<span>© 2026 BrandLogo Inc. All rights reserved.</span>
					</div>

					{/* Region / Currency */}
					<div className="flex items-center space-x-6 md:space-x-8">
						<span className="hover:text-(--text-headline) cursor-pointer transition-colors">
							United States (USD $)
						</span>
						<Link
							href="/coming-soon?feature=privacy"
							className="hover:text-(--text-headline) transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/coming-soon?feature=terms"
							className="hover:text-(--text-headline) transition-colors"
						>
							Terms of Use
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
```

# File: components/BrandStory.tsx

```tsx
"use client";

import React from "react";
import Link from "next/link";
import {
	ArrowRight,
	ShieldCheck,
	Sparkles,
	Truck,
	RotateCcw,
} from "lucide-react";

export default function BrandStory() {
	return (
		<div className="w-full bg-(--bg-base)">
			{/* 1. Value Proposition Strip */}
			<section className="w-full border-y border-(--border-color) py-10 px-4 sm:px-8">
				<div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
					<div className="flex flex-col items-center space-y-2">
						<Sparkles className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Solid & Recycled Gold
						</h4>
						<p className="text-[11px] text-(--text-muted) max-w-50 leading-relaxed">
							Handcrafted exclusively in certified 14k and 18k
							solid gold.
						</p>
					</div>

					<div className="flex flex-col items-center space-y-2">
						<ShieldCheck className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Conflict-Free Stones
						</h4>
						<p className="text-[11px] text-(--text-muted) max-w-50 leading-relaxed">
							Responsibly sourced lab-grown diamonds and natural
							pearls.
						</p>
					</div>

					<div className="flex flex-col items-center space-y-2">
						<Truck className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Insured Delivery
						</h4>
						<p className="text-[11px] text-(--text-muted) max-w-50 leading-relaxed">
							Signature required, complimentary on all fine
							jewelry orders.
						</p>
					</div>

					<div className="flex flex-col items-center space-y-2">
						<RotateCcw className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Lifetime Guarantee
						</h4>
						<p className="text-[11px] text-(--text-muted) max-w-50 leading-relaxed">
							Bespoke sizing, annual prong inspection, and polish
							care.
						</p>
					</div>
				</div>
			</section>

			{/* 2. Editorial 50/50 Brand Feature */}
			<section className="w-full px-4 sm:px-8 py-20 lg:py-28 max-w-screen-2xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Editorial Photography */}
					<div className="lg:col-span-6 relative aspect-4/5 sm:aspect-5/4 lg:aspect-4/5 overflow-hidden border border-(--border-color) rounded-xs group">
						<img
							src="https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?q=80&w=1200&auto=format&fit=crop"
							alt="The Atelier Craftsmanship"
							className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
						<span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs text-[9px] uppercase tracking-[0.25em] text-(--text-headline) font-medium px-3 py-1.5 border border-black/5 shadow-xs">
							Behind the Atelier
						</span>
					</div>

					{/* Editorial Copy */}
					<div className="lg:col-span-6 flex flex-col justify-center lg:pr-8 space-y-6">
						<span className="text-[10px] uppercase tracking-[0.3em] font-medium text-(--text-muted) block">
							Modern Longevity
						</span>

						<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-(--text-headline) leading-[1.15]">
							Pieces sculpted for daily wear, <br />
							<span className="italic font-normal">
								cherished for generations.
							</span>
						</h2>

						<div className="space-y-4 text-xs sm:text-sm text-(--text-muted) leading-relaxed max-w-lg font-light">
							<p>
								We reject seasonal disposability. Every
								silhouette begins in our sketch
								atelier—balancing architectural weight,
								ergonomic comfort, and light refraction before
								casting.
							</p>
							<p>
								By pairing recycled solid gold with precision
								lab-grown solitaires, we create heirloom-grade
								pieces with complete traceability from stone to
								setting.
							</p>
						</div>

						{/* Action */}
						<div className="pt-4">
							<Link
								href="/coming-soon?feature=about-maison"
								className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-semibold text-(--text-headline) pb-1 border-b border-(--text-headline) hover:opacity-60 transition-opacity"
							>
								<span>Read The Maison Journal</span>
								<ArrowRight
									size={13}
									className="transition-transform group-hover:translate-x-1"
								/>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
```

# File: components/GlassAuthCard.tsx

```tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Eye, EyeOff, User } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

// By adding `as const`, TypeScript knows this is strictly a "spring" type
const luxurySpring = {
	type: "spring" as const,
	damping: 30,
	stiffness: 100,
	mass: 0.8,
};

export default function GlassAuthCard() {
	const router = useRouter();
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage(null);
		setSuccessMessage(null);

		try {
			if (isSignUp) {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: { data: { full_name: fullName } },
				});
				if (error) throw error;
				setSuccessMessage(
					"An activation dispatch has been sent. Please confirm your email.",
				);
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
				router.push("/");
				router.refresh();
			}
		} catch (err: unknown) {
			// Replaced 'any' with 'unknown' for strict ESLint compliance
			if (err instanceof Error) {
				setErrorMessage(err.message);
			} else {
				setErrorMessage("An authentication error occurred.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-105 mx-auto relative group">
			{/* Specular Ambient Glow Rings Behind Card */}
			<div className="absolute -inset-2 bg-linear-to-tr from-rose-200/30 via-slate-200/40 to-transparent rounded-4xl blur-2xl opacity-60 pointer-events-none" />

			{/* Frosted Crystalline Glass Surface Card - Fades & slides in */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ ...luxurySpring, duration: 1.2 }}
				className="relative rounded-2xl bg-white/85 backdrop-blur-2xl border border-(--border-color) shadow-[0_20px_50px_rgba(30,6,10,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] p-8 sm:p-10"
			>
				{/* Top Minimalist Seal */}
				<motion.div
					whileHover={{ scale: 1.05, rotate: 2 }}
					transition={luxurySpring}
					className="w-12 h-12 mx-auto mb-6 rounded-xl bg-(--card-sub) border border-(--border-color) shadow-xs flex items-center justify-center text-(--text-headline) cursor-default"
				>
					<Lock size={17} className="stroke-[1.5]" />
				</motion.div>

				{/* Title and Subtitle */}
				<motion.div layout className="text-center mb-8">
					<motion.h1
						layout="position"
						className="font-primary text-2xl sm:text-3xl tracking-tight text-(--text-headline) font-normal mb-2"
					>
						{isSignUp ? "Join the Maison" : "Sign in to Archive"}
					</motion.h1>
					<motion.p
						layout="position"
						className="font-secondary text-[10px] uppercase tracking-[0.25em] text-(--text-muted) font-medium"
					>
						{isSignUp
							? "Create your client curation vault"
							: "Access your bespoke collection"}
					</motion.p>
				</motion.div>

				{/* Alert Notices */}
				<AnimatePresence mode="popLayout">
					{errorMessage && (
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={luxurySpring}
							className="mb-5 p-3 rounded-xs text-xs font-body text-rose-800 bg-rose-50/90 border border-rose-200 text-center"
						>
							{errorMessage}
						</motion.div>
					)}
					{successMessage && (
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={luxurySpring}
							className="mb-5 p-3 rounded-xs text-xs font-body text-(--text-headline) bg-(--card-main)/60 border border-(--border-color) text-center"
						>
							{successMessage}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Authentication Form - layout prop enables smooth shifting */}
				<motion.form
					layout
					transition={luxurySpring}
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					<AnimatePresence>
						{isSignUp && (
							<motion.div
								initial={{
									opacity: 0,
									height: 0,
									overflow: "hidden",
								}}
								animate={{
									opacity: 1,
									height: "auto",
									overflow: "visible",
								}}
								exit={{
									opacity: 0,
									height: 0,
									overflow: "hidden",
								}}
								transition={luxurySpring}
							>
								<div className="relative flex items-center pt-1">
									<User
										size={14}
										className="absolute left-4 text-(--text-muted) stroke-[1.5]"
									/>
									<input
										type="text"
										required
										value={fullName}
										onChange={(e) =>
											setFullName(e.target.value)
										}
										placeholder="Full Name"
										className="w-full bg-(--card-sub)/50 border border-(--border-color) rounded-xs py-3.5 pl-11 pr-4 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-white transition-all"
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<motion.div
						layout
						transition={luxurySpring}
						className="relative flex items-center"
					>
						<Mail
							size={14}
							className="absolute left-4 text-(--text-muted) stroke-[1.5]"
						/>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Client Email"
							className="w-full bg-(--card-sub)/50 border border-(--border-color) rounded-xs py-3.5 pl-11 pr-4 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-white transition-all"
						/>
					</motion.div>

					<motion.div
						layout
						transition={luxurySpring}
						className="relative flex items-center"
					>
						<Lock
							size={14}
							className="absolute left-4 text-(--text-muted) stroke-[1.5]"
						/>
						<input
							type={showPassword ? "text" : "password"}
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Password"
							className="w-full bg-(--card-sub)/50 border border-(--border-color) rounded-xs py-3.5 pl-11 pr-11 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-white transition-all tracking-wider"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3.5 p-1 text-(--text-muted) hover:text-(--text-headline) transition-colors cursor-pointer"
						>
							{showPassword ? (
								<EyeOff size={14} />
							) : (
								<Eye size={14} />
							)}
						</button>
					</motion.div>

					{!isSignUp && (
						<motion.div
							layout
							transition={luxurySpring}
							className="flex justify-end pr-1 pt-0.5"
						>
							<Link
								href="/coming-soon?feature=forgot-password"
								className="font-secondary text-[9px] uppercase tracking-[0.2em] text-(--text-muted) hover:text-(--text-headline) transition-colors font-medium"
							>
								Forgot password?
							</Link>
						</motion.div>
					)}

					{/* Framer Motion Action Button */}
					<motion.button
						layout
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.98 }}
						transition={luxurySpring}
						type="submit"
						disabled={loading}
						className="w-full mt-3 py-4 px-6 rounded-xs bg-(--text-headline) text-(--bg-base) font-secondary text-[10px] uppercase tracking-[0.25em] font-semibold shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
					>
						<span>
							{loading
								? "Authenticating..."
								: isSignUp
									? "Request Access"
									: "Enter Salon"}
						</span>
						{!loading && (
							<ArrowRight size={13} className="stroke-[1.5]" />
						)}
					</motion.button>
				</motion.form>

				{/* Toggle Switch */}
				<motion.div
					layout
					transition={luxurySpring}
					className="mt-8 pt-6 border-t border-(--border-color)/60 text-center"
				>
					<button
						type="button"
						onClick={() => {
							setIsSignUp(!isSignUp);
							setErrorMessage(null);
							setSuccessMessage(null);
						}}
						className="font-secondary text-[10px] uppercase tracking-[0.2em] text-(--text-muted) hover:text-(--text-headline) transition-colors cursor-pointer"
					>
						{isSignUp ? (
							<span>
								Existing client?{" "}
								<strong className="underline underline-offset-4 font-semibold text-(--text-headline)">
									Sign In
								</strong>
							</span>
						) : (
							<span>
								New to the Maison?{" "}
								<strong className="underline underline-offset-4 font-semibold text-(--text-headline)">
									Create Account
								</strong>
							</span>
						)}
					</button>
				</motion.div>
			</motion.div>
		</div>
	);
}
```

# File: components/ProductInteractive.tsx

```tsx
"use client";

import React, { useState } from "react";
import { Heart, ChevronDown, ShieldCheck, Gift, Truck } from "lucide-react";
import { useStore } from "@/context/StoreContext";

interface Product {
	id: string;
	slug: string;
	name: string;
	subtitle: string;
	badge: string | null;
	category: string;
	price: number;
	description: string;
	images?: string[];
	imageUrl?: string;
}

// 4. Expanded size variety across all categories
const CATEGORY_SIZES: Record<string, string[]> = {
	Rings: ["4", "5", "6", "7", "8", "9", "10"],
	Bracelets: ["15 CM", "16 CM", "17.5 CM", "19 CM", "20.5 CM"],
	Necklaces: ["14 IN", "16 IN", "18 IN", "20 IN", "22 IN"],
	Earrings: ["Standard"],
};

export default function ProductInteractive({ product }: { product: Product }) {
	const sizes = CATEGORY_SIZES[product.category] || ["One Size"];
	const [selectedSize, setSelectedSize] = useState<string>(
		sizes[1] ?? sizes[0],
	);
	const { addToCart, toggleWishlist, isLiked } = useStore();
	const liked = isLiked(product.id);
	const [addedNotice, setAddedNotice] = useState(false);
	const [openSection, setOpenSection] = useState<string | null>(
		"description",
	);

	const formattedPrice = (product.price / 100).toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	});

	const toggleAccordion = (section: string) => {
		setOpenSection((prev) => (prev === section ? null : section));
	};

	const handleAddToBag = () => {
		addToCart({
			id: product.id,
			slug: product.slug,
			name: product.name,
			subtitle: product.subtitle,
			price: product.price,
			size: selectedSize,
			image: product.images?.[0] || product.imageUrl,
		});
		setAddedNotice(true);
		setTimeout(() => setAddedNotice(false), 2000);
	};

	return (
		<div className="flex flex-col">
			{/* Badge */}
			{product.badge && (
				<span
					className="text-[10px] tracking-[0.25em] font-semibold uppercase mb-3 inline-block"
					style={{ color: "var(--accent-blue)" }}
				>
					{product.badge}
				</span>
			)}

			{/* Title */}
			<h1
				className="font-serif text-3xl sm:text-4xl tracking-tight leading-tight mb-2"
				style={{ color: "var(--text-headline)" }}
			>
				{product.name}
			</h1>

			{/* Subtitle / Material */}
			<p
				className="text-xs uppercase tracking-widest font-medium mb-4"
				style={{ color: "var(--text-muted)" }}
			>
				{product.subtitle}
			</p>

			{/* Main Display Price */}
			<div
				className="text-2xl font-serif mb-8 pb-6 border-b"
				style={{
					color: "var(--text-headline)",
					borderColor: "var(--border-color)",
				}}
			>
				{formattedPrice}
			</div>

			{/* 3 & 4. Size Selector (Removed Size Guide link, added more sizes) */}
			{sizes.length > 1 && (
				<div className="mb-8">
					<div
						className="text-xs tracking-wider uppercase mb-3 font-semibold"
						style={{ color: "var(--text-headline)" }}
					>
						Select Size
					</div>
					<div className="flex flex-wrap gap-2">
						{sizes.map((size) => (
							<button
								key={size}
								type="button"
								onClick={() => setSelectedSize(size)}
								className="px-4 py-2.5 text-xs uppercase tracking-wider rounded-md border transition-all duration-150"
								style={{
									borderColor:
										selectedSize === size
											? "var(--text-headline)"
											: "var(--border-color)",
									backgroundColor:
										selectedSize === size
											? "var(--card-sub)"
											: "transparent",
									color: "var(--text-headline)",
									fontWeight:
										selectedSize === size ? "600" : "400",
								}}
							>
								{size}
							</button>
						))}
					</div>
				</div>
			)}

			{/* 1 & 5. Button Actions: Split Add to Bag & Interactive Pink Wishlist */}
			<div className="flex items-center gap-3 mb-10">
				<button
					type="button"
					onClick={handleAddToBag}
					className="flex-1 py-4 px-6 flex items-center justify-between text-xs uppercase tracking-[0.2em] font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.99] rounded-sm"
					style={{ backgroundColor: "var(--accent-light)" }}
				>
					<span>{formattedPrice}</span>
					<span>{addedNotice ? "Added to Bag ✓" : "Add to Bag"}</span>
				</button>

				<button
					type="button"
					onClick={() => toggleWishlist(product.id)}
					aria-label="Save to Wishlist"
					className="group p-4 rounded-sm border transition-colors flex items-center justify-center cursor-pointer"
					style={{
						borderColor: "var(--border-color)",
						backgroundColor: "var(--card-sub)",
					}}
				>
					<Heart
						className={`w-5 h-5 transition-colors duration-200 ${
							liked
								? "fill-[#f43f5e] text-[#f43f5e]"
								: "text-(--text-headline) stroke-[1.5] group-hover:text-[#f43f5e] group-hover:fill-[#f43f5e]/30"
						}`}
					/>
				</button>
			</div>

			{/* Horizontal 3-Column Value Guarantees */}
			<div
				className="grid grid-cols-3 gap-2 py-6 mb-8 border-y text-center"
				style={{
					borderColor: "var(--border-color)",
				}}
			>
				<div className="flex flex-col items-center justify-center gap-2">
					<Truck
						size={18}
						style={{ color: "var(--accent-blue)" }}
						strokeWidth={1.5}
					/>
					<span
						className="text-[10px] uppercase tracking-wider font-medium max-w-27.5 leading-tight"
						style={{ color: "var(--text-muted)" }}
					>
						Complimentary Shipping
					</span>
				</div>

				<div className="flex flex-col items-center justify-center gap-2">
					<Gift
						size={18}
						style={{ color: "var(--accent-blue)" }}
						strokeWidth={1.5}
					/>
					<span
						className="text-[10px] uppercase tracking-wider font-medium max-w-27.5 leading-tight"
						style={{ color: "var(--text-muted)" }}
					>
						Signature Packaging
					</span>
				</div>

				<div className="flex flex-col items-center justify-center gap-2">
					<ShieldCheck
						size={18}
						style={{ color: "var(--accent-blue)" }}
						strokeWidth={1.5}
					/>
					<span
						className="text-[10px] uppercase tracking-wider font-medium max-w-27.5 leading-tight"
						style={{ color: "var(--text-muted)" }}
					>
						Lifetime Warranty
					</span>
				</div>
			</div>

			{/* Accordions */}
			<div
				className="flex flex-col divide-y text-sm"
				style={{ borderColor: "var(--border-color)" }}
			>
				{/* Description */}
				<div className="py-4">
					<button
						type="button"
						onClick={() => toggleAccordion("description")}
						className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-semibold text-left"
						style={{ color: "var(--text-headline)" }}
					>
						<span>Description & Details</span>
						<ChevronDown
							size={14}
							className={`transition-transform duration-200 ${
								openSection === "description"
									? "rotate-180"
									: ""
							}`}
						/>
					</button>
					{openSection === "description" && (
						<p
							className="mt-3 text-xs leading-relaxed font-light"
							style={{ color: "var(--text-body)" }}
						>
							{product.description}
						</p>
					)}
				</div>

				{/* Materials */}
				<div className="py-4">
					<button
						type="button"
						onClick={() => toggleAccordion("materials")}
						className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-semibold text-left"
						style={{ color: "var(--text-headline)" }}
					>
						<span>Materials & Care</span>
						<ChevronDown
							size={14}
							className={`transition-transform duration-200 ${
								openSection === "materials" ? "rotate-180" : ""
							}`}
						/>
					</button>
					{openSection === "materials" && (
						<p
							className="mt-3 text-xs leading-relaxed font-light"
							style={{ color: "var(--text-body)" }}
						>
							Hand-finished in {product.subtitle}. Each piece is
							crafted using recycled precious metals and certified
							conflict-free stones. Store in the provided
							anti-tarnish pouch away from water and direct
							cosmetic application.
						</p>
					)}
				</div>

				{/* Delivery & Returns */}
				<div className="py-4">
					<button
						type="button"
						onClick={() => toggleAccordion("shipping")}
						className="w-full flex items-center justify-between text-xs uppercase tracking-widest font-semibold text-left"
						style={{ color: "var(--text-headline)" }}
					>
						<span>Delivery & Returns</span>
						<ChevronDown
							size={14}
							className={`transition-transform duration-200 ${
								openSection === "shipping" ? "rotate-180" : ""
							}`}
						/>
					</button>
					{openSection === "shipping" && (
						<p
							className="mt-3 text-xs leading-relaxed font-light"
							style={{ color: "var(--text-body)" }}
						>
							Orders are packaged by hand and dispatched via
							insured courier in 1–2 business days. We gladly
							offer complimentary 30-day returns and exchanges on
							unworn pieces.
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
```

# File: context/StoreContext.tsx

```tsx
"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export interface CartItem {
	id: string;
	slug: string;
	name: string;
	subtitle: string;
	price: number;
	size: string;
	quantity: number;
	image?: string;
}

interface StoreContextType {
	cart: CartItem[];
	wishlist: string[];
	addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
	removeFromCart: (id: string, size: string) => void;
	updateQuantity: (id: string, size: string, quantity: number) => void;
	toggleWishlist: (productId: string) => void;
	isLiked: (productId: string) => boolean;
	totalCartCount: number;
	totalWishlistCount: number;
	isHydrated: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to safely write to localStorage and dispatch custom storage event
function saveToStorage(key: string, value: unknown) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
		window.dispatchEvent(new Event("local-storage-sync"));
	} catch (e) {
		console.error(`Failed to save ${key} to localStorage:`, e);
	}
}

// Helpers to subscribe to storage updates
function subscribeToStorage(callback: () => void) {
	window.addEventListener("storage", callback);
	window.addEventListener("local-storage-sync", callback);
	return () => {
		window.removeEventListener("storage", callback);
		window.removeEventListener("local-storage-sync", callback);
	};
}

// Static snapshot functions (prevents re-render loops in useSyncExternalStore)
const emptySubscribe = () => () => {};
const getClientHydrated = () => true;
const getServerHydrated = () => false;

const getCartSnapshot = () => {
	if (typeof window === "undefined") return "[]";
	return localStorage.getItem("brandlogo_cart") ?? "[]";
};

const getWishlistSnapshot = () => {
	if (typeof window === "undefined") return "[]";
	return localStorage.getItem("brandlogo_wishlist") ?? "[]";
};

const getServerSnapshot = () => "[]";

export function StoreProvider({ children }: { children: React.ReactNode }) {
	// 1. Hydration detection without cascading setState
	const isHydrated = useSyncExternalStore(
		emptySubscribe,
		getClientHydrated,
		getServerHydrated,
	);

	// 2. Stable snapshots
	const cartRaw = useSyncExternalStore(
		subscribeToStorage,
		getCartSnapshot,
		getServerSnapshot,
	);

	const wishlistRaw = useSyncExternalStore(
		subscribeToStorage,
		getWishlistSnapshot,
		getServerSnapshot,
	);

	const cart: CartItem[] = React.useMemo(() => {
		try {
			return JSON.parse(cartRaw);
		} catch {
			return [];
		}
	}, [cartRaw]);

	const wishlist: string[] = React.useMemo(() => {
		try {
			return JSON.parse(wishlistRaw);
		} catch {
			return [];
		}
	}, [wishlistRaw]);

	// Cart operations
	const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
		const existingIndex = cart.findIndex(
			(ci) => ci.id === item.id && ci.size === item.size,
		);

		let updated: CartItem[];
		if (existingIndex > -1) {
			updated = [...cart];
			updated[existingIndex].quantity += quantity;
		} else {
			updated = [...cart, { ...item, quantity }];
		}

		saveToStorage("brandlogo_cart", updated);
	};

	const removeFromCart = (id: string, size: string) => {
		const updated = cart.filter(
			(ci) => !(ci.id === id && ci.size === size),
		);
		saveToStorage("brandlogo_cart", updated);
	};

	const updateQuantity = (id: string, size: string, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(id, size);
			return;
		}
		const updated = cart.map((ci) =>
			ci.id === id && ci.size === size ? { ...ci, quantity } : ci,
		);
		saveToStorage("brandlogo_cart", updated);
	};

	// Wishlist operations
	const toggleWishlist = (productId: string) => {
		const updated = wishlist.includes(productId)
			? wishlist.filter((id) => id !== productId)
			: [...wishlist, productId];
		saveToStorage("brandlogo_wishlist", updated);
	};

	const isLiked = (productId: string) => wishlist.includes(productId);

	const totalCartCount = cart.reduce(
		(total, item) => total + item.quantity,
		0,
	);
	const totalWishlistCount = wishlist.length;

	return (
		<StoreContext.Provider
			value={{
				cart,
				wishlist,
				addToCart,
				removeFromCart,
				updateQuantity,
				toggleWishlist,
				isLiked,
				totalCartCount,
				totalWishlistCount,
				isHydrated,
			}}
		>
			{children}
		</StoreContext.Provider>
	);
}

export function useStore() {
	const context = useContext(StoreContext);
	if (!context) {
		throw new Error("useStore must be used within a StoreProvider");
	}
	return context;
}
```
