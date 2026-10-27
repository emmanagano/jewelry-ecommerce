"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, X } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export interface Product {
	id: string;
	name: string;
	category: string;
	price: number;
	badge?: string | null;
	slug: string;
	imageUrl?: string;
	subtitle?: string;
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
	onQuickView,
}: ProductCardProps) {
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
		});
		setShowSizePicker(false);
		setJustAdded(true);
		setTimeout(() => setJustAdded(false), 1800);
	};

	const handleAddClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		// If item has multiple sizes, open the inline size picker
		if (hasMultipleSizes) {
			setShowSizePicker(true);
		} else {
			triggerAddToCart("Standard");
		}
	};

	return (
		<div className={`group flex flex-col relative ${className}`}>
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
					onClick={handleWishlist}
					aria-label={`Save ${product.name} to wishlist`}
					className="absolute top-3 right-3 p-2 transition-colors z-10 cursor-pointer"
				>
					<Heart
						className={`w-4 h-4 transition-colors duration-200 ${
							liked
								? "fill-[#f43f5e] text-[#f43f5e]"
								: "text-(--text-muted) stroke-[1.5] hover:text-[#f43f5e]"
						}`}
					/>
				</button>

				{/* Image Container */}
				<Link
					href={`/product/${product.slug}`}
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

				{/* Quick View banner (shows when size picker is NOT open) */}
				{!showSizePicker && (
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
				)}

				{/* Inline Size Picker Overlay */}
				{showSizePicker && (
					<div
						onClick={(e) => e.stopPropagation()}
						className="absolute inset-x-0 bottom-0 bg-(--card-main)/95 backdrop-blur-sm border-t border-(--border-color) p-3 z-20 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200"
					>
						<div className="flex items-center justify-between mb-2">
							<span className="text-[10px] uppercase tracking-widest font-secondary font-semibold text-(--text-muted)">
								Select Size
							</span>
							<button
								type="button"
								onClick={() => setShowSizePicker(false)}
								className="text-(--text-muted) hover:text-(--text-headline) p-0.5"
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
									className="px-2.5 py-1 text-[11px] border border-(--border-color) bg-(--card-sub) hover:bg-(--text-headline) hover:text-(--bg-base) transition-colors cursor-pointer rounded-xs"
								>
									{sz}
								</button>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Product Meta */}
			<div className="mt-4 flex justify-between items-end">
				<Link
					href={`/product/${product.slug}`}
					className="flex-1 min-w-0 pr-4 flex flex-col space-y-1"
				>
					<span className="font-secondary text-[11px] text-(--text-muted) uppercase tracking-wider block truncate">
						{product.category}
					</span>
					<h3 className="font-primary text-base text-(--text-headline) group-hover:opacity-75 transition-opacity truncate">
						{product.name}
					</h3>
					<span className="font-secondary text-sm text-(--text-headline) font-medium">
						{(product.price / 100).toLocaleString("en-US", {
							style: "currency",
							currency: "USD",
						})}
					</span>
				</Link>

				{/* Add to bag action */}
				<button
					type="button"
					onClick={handleAddClick}
					aria-label={`Add ${product.name} to bag`}
					className="flex items-center text-(--text-headline) hover:opacity-70 transition-opacity cursor-pointer shrink-0 underline underline-offset-4 decoration-1"
				>
					<span className="text-[10px] uppercase font-secondary tracking-widest font-semibold">
						{justAdded ? "Added ✓" : "Add to bag"}
					</span>
				</button>
			</div>
		</div>
	);
}
