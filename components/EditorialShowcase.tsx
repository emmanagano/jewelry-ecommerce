"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import type { ProductSummary } from "@/app/lib/products";

// Products are fetched on the server by the login page
export default function EditorialShowcase({
	products,
}: {
	products: ProductSummary[];
}) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const currentItem = products[currentIndex];

	const handleNext = () => {
		setCurrentIndex((prev) => (prev + 1) % products.length);
	};

	const handlePrev = () => {
		setCurrentIndex(
			(prev) => (prev - 1 + products.length) % products.length,
		);
	};

	if (!currentItem) {
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
		"https://images.unsplash.com/photo-1599458349289-18f0ee82e6ed?q=80&w=1200&auto=format&fit=crop";

	return (
		<div className="relative w-full h-full flex flex-col justify-between p-8 sm:p-10 text-white group overflow-hidden select-none">
			{/* High-res background image */}
			<Image
				key={displayImg}
				src={displayImg}
				alt={currentItem.name}
				fill
				sizes="(min-width: 1024px) 50vw, 0px"
				className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
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
						{currentItem.category.name}
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
