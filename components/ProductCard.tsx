"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, X, Check } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { luxurySpring } from "@/app/lib/motion";
import { formatPrice } from "@/app/lib/format";
import { getSizes, ONE_SIZE, type ProductSummary } from "@/app/lib/products";

const CARD_IMAGE_SIZES =
	"(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

interface ProductCardProps {
	product: ProductSummary;
	className?: string;
}

export default function ProductCard({
	product,
	className = "",
}: ProductCardProps) {
	const primaryImage = product.images?.[0];
	const secondaryImage = product.images?.[1];

	const [primaryError, setPrimaryError] = useState(false);
	const [secondaryError, setSecondaryError] = useState(false);

	const { addToCart, toggleWishlist, isLiked } = useStore();
	const { preferredSizes } = useAuth();
	const savedSize = preferredSizes[product.category.slug];
	const liked = isLiked(product.id);

	const [showSizePicker, setShowSizePicker] = useState(false);
	const [justAdded, setJustAdded] = useState(false);

	const availableSizes = getSizes(product.variants);
	const hasMultipleSizes = availableSizes.length > 1;

	const addButtonRef = useRef<HTMLButtonElement>(null);
	const firstSizeRef = useRef<HTMLButtonElement>(null);

	// Move focus into the size picker when it opens
	useEffect(() => {
		if (showSizePicker) firstSizeRef.current?.focus();
	}, [showSizePicker]);

	const closeSizePicker = () => {
		setShowSizePicker(false);
		addButtonRef.current?.focus();
	};

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
			subtitle: product.subtitle || product.category.name,
			price:
				product.variants.find((v) => v.size === selectedSize)
					?.price_override ?? product.price,
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
			triggerAddToCart(ONE_SIZE);
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
			<div className="w-full aspect-4/5 bg-(--card-sub) relative overflow-hidden flex items-center justify-center rounded-xs">
				{/* Badge */}
				{product.badge && (
					<div className="absolute top-3 left-3 z-10 pointer-events-none">
						<span className="eyebrow inline-block bg-(--bg-base)/95 text-(--text-headline) px-2.5 py-1 rounded-full border border-(--border-color)">
							{product.badge}
						</span>
					</div>
				)}

				{/* Wishlist */}
				<button
					type="button"
					onClick={handleWishlist}
					aria-label={liked ? `Remove ${product.name} from saved pieces` : `Save ${product.name}`}
					aria-pressed={liked}
					className="absolute top-1.5 right-1.5 w-12 h-12 flex items-center justify-center z-10 cursor-pointer text-(--text-body) hover:text-(--accent-love) transition-colors"
				>
					{/* 36px circle inside a 48px touch target */}
					<span className="w-9 h-9 rounded-full bg-(--bg-base)/90 flex items-center justify-center">
						<Heart
							className={`w-4 h-4 stroke-[1.5] transition-colors duration-200 ${
								liked ? "fill-(--accent-love) text-(--accent-love)" : ""
							}`}
						/>
					</span>
				</button>

				{/* Image Container with Dual-Angle Hover Reveal */}
				<Link
					href={`/product/${product.slug}`}
					className="w-full h-full flex items-center justify-center relative overflow-hidden"
				>
					{primaryImage && !primaryError ? (
						<>
							{/* Still Product Photo */}
							<Image
								src={primaryImage}
								alt={product.name}
								fill
								sizes={CARD_IMAGE_SIZES}
								onError={() => setPrimaryError(true)}
								className={`object-cover transition-all duration-700 ease-out ${
									secondaryImage && !secondaryError
										? "group-hover:opacity-0 group-hover:scale-105"
										: "group-hover:scale-105"
								}`}
							/>

							{/* On-Model Photo (Revealed on Hover) */}
							{secondaryImage && !secondaryError && (
								<Image
									src={secondaryImage}
									alt={`${product.name} on model`}
									fill
									sizes={CARD_IMAGE_SIZES}
									onError={() => setSecondaryError(true)}
									className="object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
								/>
							)}
						</>
					) : (
						<div className="w-20 h-20 rounded-full border border-(--border-color) flex items-center justify-center opacity-30 group-hover:scale-110 transition-transform duration-500">
							<span className="eyebrow text-(--text-muted)">Atelier</span>
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
							onKeyDown={(e) => {
								if (e.key === "Escape") closeSizePicker();
							}}
							role="group"
							aria-label={`Choose a size for ${product.name}`}
							className="absolute inset-x-0 bottom-0 bg-(--surface) border-t border-(--border-color) p-4 z-20 flex flex-col"
						>
							<div className="flex items-center justify-between mb-3">
								<span className="eyebrow text-(--text-muted)">Select Size</span>
								<button
									type="button"
									onClick={closeSizePicker}
									aria-label="Close size picker"
									className="text-(--text-muted) hover:text-(--text-headline) p-3 -m-3 cursor-pointer"
								>
									<X size={14} />
								</button>
							</div>

							<div className="flex flex-wrap gap-2 justify-center">
								{availableSizes.map((sz, idx) => (
									<button
										key={sz}
										ref={idx === 0 ? firstSizeRef : undefined}
										type="button"
										onClick={() => triggerAddToCart(sz)}
										aria-label={sz === savedSize ? `${sz} (your saved size)` : undefined}
										className={`min-w-11 min-h-11 sm:min-h-0 px-3 py-1.5 flex items-center justify-center text-label border hover:bg-(--text-headline) hover:text-(--bg-base) hover:border-(--text-headline) transition-colors cursor-pointer rounded-xs ${
											sz === savedSize
												? "border-(--text-headline) font-semibold"
												: "border-(--border-color)"
										}`}
									>
										{sz}
									</button>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Name, category & price */}
			<div className="mt-4 flex flex-col gap-1">
				<span className="eyebrow text-(--text-muted)">
					{product.category.name}
				</span>

				<Link href={`/product/${product.slug}`} className="block">
					<h3 className="font-serif text-copy sm:text-[1.0625rem] leading-snug text-(--text-headline) hover:text-(--accent) transition-colors truncate">
						{product.name}
					</h3>
				</Link>

				<div className="flex items-center justify-between gap-3 pt-0.5">
					<span className="text-copy-sm text-(--text-body)">
						{formatPrice(product.price)}
					</span>

					{/* Shown on hover/focus on pointer devices, always on touch */}
					<button
						ref={addButtonRef}
						type="button"
						onClick={handleAddClick}
						disabled={justAdded}
						aria-expanded={hasMultipleSizes ? showSizePicker : undefined}
						className={`text-label uppercase text-(--text-headline) hover:text-(--accent) border-b border-current pb-0.5 cursor-pointer relative after:absolute after:-inset-3 after:content-[''] flex items-center gap-1 transition-[opacity,color] duration-200 focus-visible:opacity-100 ${
							justAdded || showSizePicker
								? "opacity-100"
								: "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100"
						}`}
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
										size={12}
										className="text-(--success)"
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
					</button>
				</div>
			</div>
		</motion.div>
	);
}
