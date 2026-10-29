"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import { useWishlistProducts } from "@/app/lib/use-wishlist-products";

export default function WishlistPage() {
	const { totalWishlistCount, isHydrated } = useStore();
	const { products, isLoading } = useWishlistProducts();

	if (!isHydrated) {
		return (
			<div className="min-h-screen py-12 lg:py-16 px-4 sm:px-8 max-w-screen-2xl mx-auto animate-pulse">
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
			</div>
		);
	}

	return (
		<div className="min-h-screen py-12 lg:py-16 px-4 sm:px-8 max-w-screen-2xl mx-auto bg-(--bg-base)">
			{/* Editorial Header */}
			<div className="mb-12 pb-6 border-b border-(--border-color)/60 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<span className="eyebrow text-(--text-muted) block mb-3">
						Curated Pieces
					</span>
					<h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-(--text-headline)">
						Saved Pieces{" "}
						{totalWishlistCount > 0 && `(${totalWishlistCount})`}
					</h1>
				</div>

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
						className="py-3.5 px-10 text-label uppercase font-medium bg-(--text-headline) text-(--bg-base) hover:opacity-90 transition-opacity rounded-xs shadow-xs"
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
		</div>
	);
}
