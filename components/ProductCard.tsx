"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

export interface Product {
	id: string;
	name: string;
	category: string;
	price: string;
	badge?: string | null;
	slug: string;
	imageUrl?: string;
}

interface ProductCardProps {
	product: Product;
	className?: string;
	onQuickView?: (product: Product) => void;
	onWishlistToggle?: (product: Product) => void;
	onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
	product,
	className = "",
	onQuickView,
	onWishlistToggle,
	onAddToCart,
}: ProductCardProps) {
	return (
		<div className={`group flex flex-col cursor-pointer ${className}`}>
			{/* Product Image Card */}
			<div className="w-full aspect-4/5 bg-(--card-sub) border border-(--border-color) relative overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-(--text-headline)">
				{/* Badge */}
				{product.badge && (
					<span className="absolute top-3 left-3 bg-(--card-main) text-(--accent-light) text-[10px] uppercase tracking-widest font-secondary px-2.5 py-1 z-10">
						{product.badge}
					</span>
				)}

				{/* Wishlist Button */}
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onWishlistToggle?.(product);
					}}
					aria-label={`Save ${product.name} to wishlist`}
					className="absolute top-3 right-3 p-2 text-(--text-muted) hover:text-(--text-headline) transition-colors z-10 cursor-pointer"
				>
					<Heart className="w-4 h-4 stroke-[1.5]" />
				</button>

				{/* Image Container / Placeholder */}
				<Link
					href={`/products/${product.slug}`}
					className="w-full h-full flex items-center justify-center"
				>
					{product.imageUrl ? (
						<img
							src={product.imageUrl}
							alt={product.name}
							className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						/>
					) : (
						<div className="w-24 h-24 rounded-full border border-(--border-color) flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-500">
							<span className="font-secondary text-[11px] uppercase tracking-widest text-(--text-muted)">
								Photo
							</span>
						</div>
					)}
				</Link>

				{/* Hover-only subtle Quick View banner (No dual Split buttons) */}
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onQuickView?.(product);
					}}
					className="absolute bottom-0 inset-x-0 bg-(--card-main)/90 backdrop-blur-xs text-(--text-headline) text-center py-3 text-xs uppercase tracking-widest font-secondary font-semibold translate-y-full group-hover:translate-y-0 transition-all duration-300 cursor-pointer hover:bg-(--card-main) hover:text-(--accent-light)"
				>
					Quick View
				</button>
			</div>

			{/* Product Meta with bottom-right action */}
			<div className="mt-4 flex justify-between items-end">
				{/* Info block */}
				<Link
					href={`/products/${product.slug}`}
					className="flex-1 min-w-0 pr-4 flex flex-col space-y-1"
				>
					<span className="font-secondary text-[11px] text-(--text-muted) uppercase tracking-wider block truncate">
						{product.category}
					</span>
					<h3 className="font-primary text-base text-(--text-headline) group-hover:opacity-75 transition-opacity truncate">
						{product.name}
					</h3>
					<span className="font-secondary text-sm text-(--text-headline) font-medium pt-0.5 block">
						{product.price}
					</span>
				</Link>

				{/* Static + Add to Bag Button on bottom-right */}
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onAddToCart?.(product);
					}}
					aria-label={`Add ${product.name} to bag`}
					className="flex items-center space-x-2 border border-(--border-color) bg-transparent text-(--text-headline) px-4 py-2.5 text-xs font-secondary uppercase tracking-widest hover:bg-(--accent-light) hover:text-(--card-main) hover:border-(--accent-light) transition-all duration-200 cursor-pointer shrink-0"
				>
					<ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
					<span>+ Add</span>
				</button>
			</div>
		</div>
	);
}
