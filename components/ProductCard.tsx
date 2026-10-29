"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, X, Check } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";

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

// Standard physics
const luxurySpring = {
	type: "spring" as const,
	damping: 30,
	stiffness: 100,
	mass: 0.8,
};

export default function ProductCard({
	product,
	className = "",
}: ProductCardProps) {
	const primaryImage = product.images?.[0] || product.imageUrl;
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
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={luxurySpring}
			className={`group flex flex-col relative ${className}`}
		>
			{/* Product Image Frame */}
			<div className="w-full aspect-4/5 bg-(--card-sub) border border-(--border-color) relative overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:border-(--text-headline)/40 rounded-xs">
				{/* Clean Luxury Badge */}
				{product.badge && (
					<div className="absolute top-3 left-3 z-10 pointer-events-none">
						<span className="bg-white/95 font-secondary text-(--text-headline) text-[9px] uppercase tracking-[0.22em] font-medium px-2.5 py-1 border border-black/5 shadow-xs">
							{product.badge}
						</span>
					</div>
				)}

				{/* Floating Wishlist Button */}
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					type="button"
					onClick={handleWishlist}
					aria-label={`Save ${product.name} to wishlist`}
					className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-black/5 flex items-center justify-center z-10 shadow-xs cursor-pointer"
				>
					<Heart
						className={`w-3.5 h-3.5 transition-colors duration-200 ${
							liked
								? "fill-[#f43f5e] text-[#f43f5e]"
								: "text-stone-600 stroke-[1.5] hover:text-[#f43f5e]"
						}`}
					/>
				</motion.button>

				{/* Image Container with Dual-Angle Hover Reveal */}
				<Link
					href={`/product/${product.slug}`}
					className="w-full h-full flex items-center justify-center relative overflow-hidden"
				>
					{primaryImage && !primaryError ? (
						<>
							{/* Still Product Photo */}
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

							{/* On-Model Photo (Revealed on Hover) */}
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
							<span className="font-secondary text-[10px] uppercase tracking-[0.25em] text-(--text-muted)">
								Atelier
							</span>
						</div>
					)}
				</Link>

				{/* Inline Size Picker Drawer */}
				<AnimatePresence>
					{showSizePicker && (
						<motion.div
							initial={{ y: "100%", opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: "100%", opacity: 0 }}
							transition={luxurySpring}
							onClick={(e) => e.stopPropagation()}
							className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md border-t border-(--border-color) p-3 z-20 flex flex-col shadow-md"
						>
							<div className="flex items-center justify-between mb-2">
								<span className="font-secondary text-[9px] uppercase tracking-[0.22em] font-medium text-stone-500">
									Select Size
								</span>
								<button
									type="button"
									onClick={() => setShowSizePicker(false)}
									className="text-stone-400 hover:text-stone-900 p-0.5 cursor-pointer"
								>
									<X size={12} />
								</button>
							</div>

							<div className="flex flex-wrap gap-1.5 justify-center">
								{availableSizes.map((sz) => (
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										key={sz}
										type="button"
										onClick={() => triggerAddToCart(sz)}
										className="px-2.5 py-1 font-secondary text-[10px] tracking-wider uppercase border border-stone-200 bg-stone-50 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer rounded-xs"
									>
										{sz}
									</motion.button>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Product Typography & Pricing */}
			<div className="mt-4 flex flex-col space-y-1.5">
				{/* Category Tag */}
				<span className="font-secondary text-[10px] uppercase tracking-[0.25em] text-(--text-muted) block">
					{product.category}
				</span>

				{/* Product Title (Full Width) */}
				<Link
					href={`/product/${product.slug}`}
					className="group/link block"
				>
					<h3 className="font-primary text-sm sm:text-base text-(--text-headline) leading-snug group-hover/link:opacity-70 transition-opacity truncate">
						{product.name}
					</h3>
				</Link>

				{/* Dedicated Price & Action Row */}
				<div className="flex items-center justify-between pt-1">
					<span className="font-serif text-xs sm:text-sm font-medium text-(--text-headline) tracking-tight">
						{(product.price / 100).toLocaleString("en-US", {
							style: "currency",
							currency: "USD",
						})}
					</span>

					<motion.button
						whileTap={{ scale: 0.95 }}
						type="button"
						onClick={handleAddClick}
						disabled={justAdded}
						className="font-secondary text-[10px] uppercase tracking-[0.2em] font-semibold text-(--text-headline) hover:opacity-60 transition-opacity cursor-pointer underline underline-offset-4 decoration-1 flex items-center gap-1 min-w-[70px] justify-end"
					>
						<AnimatePresence mode="wait">
							{justAdded ? (
								<motion.div
									key="added"
									initial={{ opacity: 0, y: 5 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -5 }}
									className="flex items-center gap-1"
								>
									<Check
										size={11}
										className="text-emerald-600"
									/>
									<span>Added</span>
								</motion.div>
							) : (
								<motion.span
									key="add"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									Add to Bag
								</motion.span>
							)}
						</AnimatePresence>
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
}
