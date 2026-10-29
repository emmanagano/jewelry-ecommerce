"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
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
			<div className="w-full h-full bg-(--card-sub) animate-pulse flex flex-col justify-end p-12">
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

	const counter = (n: number) => String(n).padStart(2, "0");

	return (
		<div className="relative w-full h-full flex flex-col justify-end p-8 lg:p-12 text-white overflow-hidden select-none">
			<Image
				key={displayImg}
				src={displayImg}
				alt={currentItem.name}
				fill
				sizes="(min-width: 1024px) 50vw, 0px"
				className="object-cover object-center"
			/>
			{/* Scrim so the caption stays legible */}
			<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

			{/* Caption + stepper */}
			<div className="relative z-10 flex items-end justify-between gap-8">
				<div className="max-w-sm">
					<span className="eyebrow block mb-3 text-white/70">
						{currentItem.category.name}
					</span>
					<h2 className="font-serif text-heading text-white">
						{currentItem.name}
					</h2>
					{currentItem.subtitle && (
						<p className="mt-2 text-copy-sm text-white/75 line-clamp-1">
							{currentItem.subtitle}
						</p>
					)}
					<Link
						href={`/product/${currentItem.slug}`}
						className="mt-5 inline-flex items-center gap-1.5 text-label uppercase text-white border-b border-white/50 hover:border-white pb-0.5 transition-colors"
					>
						<span>View Piece</span>
						<ArrowUpRight size={13} className="stroke-[1.5]" />
					</Link>
				</div>

				{products.length > 1 && (
					<div className="flex items-center gap-3 shrink-0">
						<button
							type="button"
							onClick={handlePrev}
							aria-label="Previous piece"
							className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-(--text-headline) transition-colors cursor-pointer"
						>
							<ArrowLeft size={15} className="stroke-[1.5]" />
						</button>
						<span className="text-label tabular-nums text-white/80" aria-live="polite">
							{counter(currentIndex + 1)} / {counter(products.length)}
						</span>
						<button
							type="button"
							onClick={handleNext}
							aria-label="Next piece"
							className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-(--text-headline) transition-colors cursor-pointer"
						>
							<ArrowRight size={15} className="stroke-[1.5]" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
