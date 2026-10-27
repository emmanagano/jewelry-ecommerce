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
				const formatted: Product[] = data.map((item) => ({
					id: item.id,
					name: item.name,
					category: item.category,
					price: item.price,
					badge: item.badge,
					slug: item.slug,
					subtitle: item.subtitle,
					imageUrl: item.images?.[0] ?? undefined,
				}));
				setProducts(formatted);
			}
			setIsLoading(false);
		}

		// Run asynchronously to avoid synchronous setState inside the effect body
		fetchWishlistItems();

		return () => {
			isMounted = false;
		};
	}, [wishlist, isHydrated]);

	if (!isHydrated) {
		return (
			<main className="min-h-screen py-16 px-6 sm:px-12 max-w-7xl mx-auto animate-pulse">
				<div className="h-4 w-32 bg-gray-200 rounded mb-4" />
				<div className="h-8 w-64 bg-gray-200 rounded mb-12" />
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{[1, 2, 3, 4].map((n) => (
						<div key={n} className="space-y-4">
							<div className="aspect-4/5 bg-gray-100 rounded-xs" />
							<div className="h-4 w-2/3 bg-gray-100 rounded-xs" />
							<div className="h-4 w-1/3 bg-gray-100 rounded-xs" />
						</div>
					))}
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
				className="mb-10 pb-6 border-b flex flex-col sm:flex-row sm:items-baseline justify-between gap-4"
				style={{ borderColor: "var(--border-color)" }}
			>
				<div>
					<span
						className="text-[10px] uppercase tracking-[0.25em] font-semibold block mb-2"
						style={{ color: "var(--text-muted)" }}
					>
						Curated Pieces
					</span>
					<h1
						className="font-serif text-3xl sm:text-4xl tracking-tight"
						style={{ color: "var(--text-headline)" }}
					>
						Saved Pieces ({totalWishlistCount})
					</h1>
				</div>

				<Link
					href="/"
					className="text-xs uppercase tracking-widest font-semibold hover:opacity-70 transition-opacity flex items-center gap-2"
					style={{ color: "var(--accent-blue)" }}
				>
					<ArrowLeft size={13} />
					<span>Continue Exploring</span>
				</Link>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
					{[1, 2, 3, 4].map((n) => (
						<div key={n} className="space-y-4">
							<div
								className="aspect-4/5 rounded-xs"
								style={{ backgroundColor: "var(--card-sub)" }}
							/>
							<div
								className="h-3 w-1/3 rounded-xs"
								style={{ backgroundColor: "var(--card-sub)" }}
							/>
							<div
								className="h-4 w-2/3 rounded-xs"
								style={{ backgroundColor: "var(--card-sub)" }}
							/>
						</div>
					))}
				</div>
			)}

			{/* Empty State */}
			{!isLoading && products.length === 0 && (
				<div className="py-24 text-center flex flex-col items-center justify-center">
					<div
						className="w-16 h-16 rounded-full border flex items-center justify-center mb-6"
						style={{
							borderColor: "var(--border-color)",
							backgroundColor: "var(--card-sub)",
						}}
					>
						<Heart
							size={20}
							className="stroke-[1.5]"
							style={{ color: "var(--text-muted)" }}
						/>
					</div>
					<h2
						className="font-serif text-2xl tracking-tight mb-2"
						style={{ color: "var(--text-headline)" }}
					>
						Your Wishlist is Empty
					</h2>
					<p
						className="text-xs uppercase tracking-wider max-w-sm mb-8 leading-relaxed"
						style={{ color: "var(--text-muted)" }}
					>
						Select the heart icon on any piece across our collection
						to save your personal curation for later acquisition.
					</p>
					<Link
						href="/"
						className="py-3.5 px-8 text-xs uppercase tracking-[0.2em] font-semibold text-white transition-opacity hover:opacity-90 rounded-xs"
						style={{ backgroundColor: "var(--accent-light)" }}
					>
						Discover Pieces
					</Link>
				</div>
			)}

			{/* Populated Wishlist Grid */}
			{!isLoading && products.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</main>
	);
}
