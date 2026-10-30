"use client";

import React, { useRef, useState } from "react";
import { Heart, ChevronDown, ShieldCheck, Gift, Truck } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { luxurySpring, staggerContainer, fadeSlide } from "@/app/lib/motion";
import { formatPrice } from "@/app/lib/format";
import { ONE_SIZE, sortVariants, type Product } from "@/app/lib/products";
import MobileActionBar, { useMobileActionBar } from "@/components/MobileActionBar";

// Entrance stagger configuration
const staggerContainerVariants = staggerContainer(0.1);
const staggerItem = fadeSlide(15);

const DEFAULT_SHIPPING_COPY =
	"Every piece is packed by hand and sent insured, signature required, within two business days. Unworn, non-engraved pieces may be returned or exchanged within 30 days.";

function defaultCareCopy(material: string | null) {
	return `Hand-finished in ${material ?? "precious metals"}, with pearls and diamonds of documented origin. Wipe with the soft cloth after wearing and keep the piece in its pouch, away from perfume and water. Bring it to us for complimentary cleaning, for life.`;
}

export default function ProductInteractive({ product }: { product: Product }) {
	const variants = sortVariants(product.variants);
	const sizes = variants.length > 0 ? variants.map((v) => v.size) : [ONE_SIZE];
	// A size starts selected only for one-size pieces, or when a signed-in
	// client has saved their size for this category; otherwise they choose
	// before adding to the bag.
	const { preferredSizes } = useAuth();
	const savedSize = preferredSizes[product.category.slug];
	const defaultSize =
		sizes.length === 1
			? sizes[0]
			: savedSize && sizes.includes(savedSize)
				? savedSize
				: null;
	const [chosenSize, setSelectedSize] = useState<string | null>(null);
	const selectedSize = chosenSize ?? defaultSize;
	const selectedVariant = variants.find((v) => v.size === selectedSize);
	const unitPrice = selectedVariant?.price_override ?? product.price;
	const { addToCart, toggleWishlist, isLiked } = useStore();
	const liked = isLiked(product.id);
	const [addedNotice, setAddedNotice] = useState(false);
	const [openSection, setOpenSection] = useState<string | null>(
		"description",
	);

	const formattedPrice = formatPrice(unitPrice);

	// Phone sticky bar appears once the inline Acquire button is off screen
	const [mobileBarRef, showMobileBar] = useMobileActionBar();
	const sizePickerRef = useRef<HTMLDivElement>(null);

	const sections = [
		{
			id: "description",
			title: "Description & Details",
			body: product.description,
		},
		{
			id: "materials",
			title: "Materials & Care",
			body: product.materials_care ?? defaultCareCopy(product.subtitle),
		},
		{
			id: "shipping",
			title: "Delivery & Returns",
			body: DEFAULT_SHIPPING_COPY,
		},
	].filter((section) => section.body);

	const toggleAccordion = (section: string) => {
		setOpenSection((prev) => (prev === section ? null : section));
	};

	const handleAddToBag = () => {
		if (!selectedSize) return;
		addToCart({
			id: product.id,
			slug: product.slug,
			name: product.name,
			subtitle: product.subtitle ?? product.category.name,
			price: unitPrice,
			size: selectedSize,
			image: product.images?.[0],
		});
		setAddedNotice(true);
		setTimeout(() => setAddedNotice(false), 2000);
	};

	return (
		<motion.div
			variants={staggerContainerVariants}
			initial="hidden"
			animate="show"
			className="flex flex-col select-none"
		>
			{/* Badge */}
			<motion.div variants={staggerItem}>
				{product.badge && (
					<span className="eyebrow mb-4 inline-block text-(--accent)">
						{product.badge}
					</span>
				)}
			</motion.div>

			{/* Title */}
			<motion.h1
				variants={staggerItem}
				className="font-serif text-[2rem] sm:text-title tracking-tight mb-3 text-(--text-headline)"
			>
				{product.name}
			</motion.h1>

			{/* Subtitle / Material */}
			<motion.p
				variants={staggerItem}
				className="text-copy text-(--text-muted) mb-5"
			>
				{product.subtitle}
			</motion.p>

			{/* Main Display Price */}
			<motion.div
				variants={staggerItem}
				className="text-xl text-(--text-headline) mb-8 pb-8 border-b border-(--border-color)"
			>
				{formattedPrice}
			</motion.div>

			{/* Size Selector with Sliding Layout Indicator */}
			{sizes.length > 1 && (
				<motion.div
					ref={sizePickerRef}
					variants={staggerItem}
					className="mb-8 scroll-mt-32"
				>
					<div className="text-label uppercase mb-4 text-(--text-headline)">
						Select {product.category.size_label ?? "Size"}
						{savedSize && sizes.includes(savedSize) && (
							<span className="ml-2 normal-case tracking-normal text-(--text-muted)">
								· your saved size is {savedSize}
							</span>
						)}
					</div>
					<div className="flex flex-wrap gap-2">
						{sizes.map((size) => (
							<button
								key={size}
								type="button"
								onClick={() => setSelectedSize(size)}
								aria-pressed={selectedSize === size}
								className="relative min-w-14 min-h-11 px-4 py-3 text-label rounded-xs border border-(--border-color) hover:border-(--text-headline) transition-colors cursor-pointer"
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
				ref={mobileBarRef}
				variants={staggerItem}
				className="flex items-stretch gap-3 mb-6"
			>
				<button
					type="button"
					onClick={handleAddToBag}
					disabled={!selectedSize}
					className="flex-1 py-4 px-6 flex items-center justify-between text-label uppercase text-(--bg-base) bg-(--text-headline) hover:bg-(--accent) transition-colors rounded-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-(--text-headline)"
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
								key={selectedSize ? "add" : "select"}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								{selectedSize ? "Acquire" : "Select a Size"}
							</motion.span>
						)}
					</AnimatePresence>
				</button>

				<button
					type="button"
					onClick={() => toggleWishlist(product.id)}
					aria-label={liked ? "Remove from saved pieces" : "Save this piece"}
					aria-pressed={liked}
					className="group w-14 rounded-xs border border-(--border-color) hover:border-(--text-headline) transition-colors flex items-center justify-center cursor-pointer"
				>
					<Heart
						className={`w-5 h-5 stroke-[1.25] transition-colors duration-200 ${
							liked
								? "fill-(--accent-love) text-(--accent-love)"
								: "text-(--text-headline) group-hover:text-(--accent-love)"
						}`}
					/>
				</button>
			</motion.div>

			{/* Quiet promise line */}
			<motion.ul
				variants={staggerItem}
				className="flex flex-wrap gap-x-6 gap-y-2 mb-10 text-copy-sm text-(--text-muted)"
			>
				<li className="flex items-center gap-2">
					<Truck size={16} className="stroke-[1.25] text-(--accent)" />
					Complimentary insured shipping
				</li>
				<li className="flex items-center gap-2">
					<Gift size={16} className="stroke-[1.25] text-(--accent)" />
					Signature packaging
				</li>
				<li className="flex items-center gap-2">
					<ShieldCheck size={16} className="stroke-[1.25] text-(--accent)" />
					Lifetime warranty
				</li>
			</motion.ul>

			{/* Fluid Accordions */}
			<motion.div
				variants={staggerItem}
				className="flex flex-col divide-y divide-(--border-color) border-y border-(--border-color)"
			>
				{sections.map((section) => {
					const isOpen = openSection === section.id;
					return (
						<div key={section.id} className="py-1">
							<button
								type="button"
								onClick={() => toggleAccordion(section.id)}
								aria-expanded={isOpen}
								aria-controls={`section-${section.id}`}
								className="w-full py-5 flex items-center justify-between text-label uppercase text-left text-(--text-headline) cursor-pointer hover:text-(--accent) transition-colors"
							>
								<span>{section.title}</span>
								<motion.div
									animate={{ rotate: isOpen ? 180 : 0 }}
									transition={{ duration: 0.3, ease: "easeInOut" }}
								>
									<ChevronDown size={16} className="stroke-[1.25]" />
								</motion.div>
							</button>
							<AnimatePresence>
								{isOpen && (
									<motion.div
										id={`section-${section.id}`}
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={luxurySpring}
										className="overflow-hidden"
									>
										<p className="pb-6 text-copy text-(--text-body) pr-6">
											{section.body}
										</p>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					);
				})}
			</motion.div>

			<MobileActionBar visible={showMobileBar}>
				<div className="min-w-0 flex-1">
					<p className="font-serif text-copy text-(--text-headline) truncate">
						{product.name}
					</p>
					<p className="text-copy-sm text-(--text-muted)">
						{formattedPrice}
						{selectedSize && selectedSize !== ONE_SIZE && ` · ${selectedSize}`}
					</p>
				</div>
				<button
					type="button"
					onClick={
						selectedSize
							? handleAddToBag
							: () =>
									sizePickerRef.current?.scrollIntoView({
										behavior: "smooth",
										block: "start",
									})
					}
					className="shrink-0 min-h-11 px-5 text-label uppercase text-(--bg-base) bg-(--text-headline) hover:bg-(--accent) transition-colors rounded-xs cursor-pointer"
				>
					{addedNotice ? "Added to Bag" : selectedSize ? "Acquire" : "Select a Size"}
				</button>
			</MobileActionBar>
		</motion.div>
	);
}
