"use client";

import React, { useState } from "react";
import { Heart, ChevronDown, ShieldCheck, Gift, Truck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";

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

const CATEGORY_SIZES: Record<string, string[]> = {
	Rings: ["4", "5", "6", "7", "8", "9", "10"],
	Bracelets: ["15 CM", "16 CM", "17.5 CM", "19 CM", "20.5 CM"],
	Necklaces: ["14 IN", "16 IN", "18 IN", "20 IN", "22 IN"],
	Earrings: ["Standard"],
};

// Standard luxury physics
const luxurySpring = {
	type: "spring" as const,
	damping: 30,
	stiffness: 100,
	mass: 0.8,
};

// Entrance stagger configuration
const staggerContainer = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: 0.1 },
	},
};

const staggerItem = {
	hidden: { opacity: 0, y: 15 },
	show: { opacity: 1, y: 0, transition: luxurySpring },
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
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			animate="show"
			className="flex flex-col select-none"
		>
			{/* Badge */}
			<motion.div variants={staggerItem}>
				{product.badge && (
					<span className="font-secondary text-[10px] tracking-[0.25em] font-semibold uppercase mb-3 inline-block text-(--accent-blue)">
						{product.badge}
					</span>
				)}
			</motion.div>

			{/* Title */}
			<motion.h1
				variants={staggerItem}
				className="font-primary text-3xl sm:text-4xl tracking-tight leading-tight mb-2 text-(--text-headline)"
			>
				{product.name}
			</motion.h1>

			{/* Subtitle / Material */}
			<motion.p
				variants={staggerItem}
				className="font-secondary text-[10px] uppercase tracking-widest font-medium mb-4 text-(--text-muted)"
			>
				{product.subtitle}
			</motion.p>

			{/* Main Display Price */}
			<motion.div
				variants={staggerItem}
				className="font-serif text-2xl mb-8 pb-6 border-b border-(--border-color) text-(--text-headline)"
			>
				{formattedPrice}
			</motion.div>

			{/* Size Selector with Sliding Layout Indicator */}
			{sizes.length > 1 && (
				<motion.div variants={staggerItem} className="mb-8">
					<div className="font-secondary text-[10px] tracking-[0.25em] uppercase mb-4 font-semibold text-(--text-headline)">
						Select Size
					</div>
					<div className="flex flex-wrap gap-2">
						{sizes.map((size) => (
							<button
								key={size}
								type="button"
								onClick={() => setSelectedSize(size)}
								className="relative px-5 py-2.5 font-secondary text-[10px] uppercase tracking-wider rounded-xs border border-(--border-color) transition-colors cursor-pointer"
								style={{
									color:
										selectedSize === size
											? "var(--bg-base)"
											: "var(--text-headline)",
									borderColor:
										selectedSize === size
											? "var(--text-headline)"
											: "var(--border-color)",
								}}
							>
								{/* The sliding background pill */}
								{selectedSize === size && (
									<motion.div
										layoutId="activeSize"
										className="absolute inset-0 bg-(--text-headline) rounded-xs -z-10"
										transition={luxurySpring}
									/>
								)}
								<span className="relative z-10">{size}</span>
							</button>
						))}
					</div>
				</motion.div>
			)}

			{/* Button Actions: Split Add to Bag & Interactive Pink Wishlist */}
			<motion.div
				variants={staggerItem}
				className="flex items-center gap-3 mb-10"
			>
				<motion.button
					whileHover={{ scale: 1.01 }}
					whileTap={{ scale: 0.98 }}
					transition={luxurySpring}
					type="button"
					onClick={handleAddToBag}
					className="flex-1 py-4 px-6 flex items-center justify-between font-secondary text-[10px] uppercase tracking-[0.25em] font-semibold text-white transition-opacity hover:opacity-95 rounded-xs cursor-pointer shadow-xs bg-(--text-headline)"
				>
					<span>{formattedPrice}</span>
					<AnimatePresence mode="wait">
						{addedNotice ? (
							<motion.span
								key="added"
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								className="flex items-center gap-2"
							>
								<span>Added to Bag</span>
							</motion.span>
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

				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					transition={luxurySpring}
					type="button"
					onClick={() => toggleWishlist(product.id)}
					aria-label="Save to Wishlist"
					className="group p-4 rounded-xs border border-(--border-color) bg-(--card-sub)/50 transition-colors flex items-center justify-center cursor-pointer shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]"
				>
					<Heart
						className={`w-4 h-4 transition-colors duration-200 ${
							liked
								? "fill-[#f43f5e] text-[#f43f5e]"
								: "text-(--text-headline) stroke-[1.5] group-hover:text-[#f43f5e] group-hover:fill-[#f43f5e]/20"
						}`}
					/>
				</motion.button>
			</motion.div>

			{/* Horizontal 3-Column Value Guarantees */}
			<motion.div
				variants={staggerItem}
				className="grid grid-cols-3 gap-2 py-6 mb-8 border-y border-(--border-color)/60 text-center"
			>
				<div className="flex flex-col items-center justify-center gap-2">
					<Truck
						size={17}
						className="text-(--accent-blue) stroke-[1.5]"
					/>
					<span className="font-secondary text-[9px] uppercase tracking-[0.2em] font-medium max-w-[100px] leading-tight text-(--text-muted)">
						Complimentary Shipping
					</span>
				</div>
				<div className="flex flex-col items-center justify-center gap-2">
					<Gift
						size={17}
						className="text-(--accent-blue) stroke-[1.5]"
					/>
					<span className="font-secondary text-[9px] uppercase tracking-[0.2em] font-medium max-w-[100px] leading-tight text-(--text-muted)">
						Signature Packaging
					</span>
				</div>
				<div className="flex flex-col items-center justify-center gap-2">
					<ShieldCheck
						size={17}
						className="text-(--accent-blue) stroke-[1.5]"
					/>
					<span className="font-secondary text-[9px] uppercase tracking-[0.2em] font-medium max-w-[100px] leading-tight text-(--text-muted)">
						Lifetime Warranty
					</span>
				</div>
			</motion.div>

			{/* Fluid Accordions */}
			<motion.div
				variants={staggerItem}
				className="flex flex-col divide-y divide-(--border-color)/60 border-b border-(--border-color)/60"
			>
				{/* Description */}
				<div className="py-1">
					<button
						type="button"
						onClick={() => toggleAccordion("description")}
						className="w-full py-4 flex items-center justify-between font-secondary text-[10px] uppercase tracking-[0.25em] font-medium text-left text-(--text-headline) cursor-pointer hover:opacity-70 transition-opacity"
					>
						<span>Description & Details</span>
						<motion.div
							animate={{
								rotate: openSection === "description" ? 180 : 0,
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							<ChevronDown size={14} className="stroke-[1.5]" />
						</motion.div>
					</button>
					<AnimatePresence>
						{openSection === "description" && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={luxurySpring}
								className="overflow-hidden"
							>
								<p className="pb-5 font-body text-[11px] leading-relaxed font-light text-(--text-muted) pr-6">
									{product.description}
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Materials */}
				<div className="py-1">
					<button
						type="button"
						onClick={() => toggleAccordion("materials")}
						className="w-full py-4 flex items-center justify-between font-secondary text-[10px] uppercase tracking-[0.25em] font-medium text-left text-(--text-headline) cursor-pointer hover:opacity-70 transition-opacity"
					>
						<span>Materials & Care</span>
						<motion.div
							animate={{
								rotate: openSection === "materials" ? 180 : 0,
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							<ChevronDown size={14} className="stroke-[1.5]" />
						</motion.div>
					</button>
					<AnimatePresence>
						{openSection === "materials" && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={luxurySpring}
								className="overflow-hidden"
							>
								<p className="pb-5 font-body text-[11px] leading-relaxed font-light text-(--text-muted) pr-6">
									Hand-finished in {product.subtitle}. Each
									piece is crafted using recycled precious
									metals and certified conflict-free stones.
									Store in the provided anti-tarnish pouch
									away from water and direct cosmetic
									application.
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Delivery & Returns */}
				<div className="py-1">
					<button
						type="button"
						onClick={() => toggleAccordion("shipping")}
						className="w-full py-4 flex items-center justify-between font-secondary text-[10px] uppercase tracking-[0.25em] font-medium text-left text-(--text-headline) cursor-pointer hover:opacity-70 transition-opacity"
					>
						<span>Delivery & Returns</span>
						<motion.div
							animate={{
								rotate: openSection === "shipping" ? 180 : 0,
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}
						>
							<ChevronDown size={14} className="stroke-[1.5]" />
						</motion.div>
					</button>
					<AnimatePresence>
						{openSection === "shipping" && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={luxurySpring}
								className="overflow-hidden"
							>
								<p className="pb-5 font-body text-[11px] leading-relaxed font-light text-(--text-muted) pr-6">
									Orders are packaged by hand and dispatched
									via insured courier in 1–2 business days. We
									gladly offer complimentary 30-day returns
									and exchanges on unworn pieces.
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
		</motion.div>
	);
}
