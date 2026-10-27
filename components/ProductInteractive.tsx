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
