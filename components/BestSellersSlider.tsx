"use client";

import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { ProductSummary } from "@/app/lib/products";

// Horizontal slider; products are fetched on the server by BestSellers
export default function BestSellersSlider({
	products,
}: {
	products: ProductSummary[];
}) {
	const sliderRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	const checkScroll = () => {
		if (!sliderRef.current) return;
		const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
		setCanScrollLeft(scrollLeft > 5);
		setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
	};

	useEffect(() => {
		checkScroll();
		window.addEventListener("resize", checkScroll);
		return () => window.removeEventListener("resize", checkScroll);
	}, [products]);

	const scroll = (direction: "left" | "right") => {
		if (!sliderRef.current) return;
		const offset = sliderRef.current.clientWidth * 0.75;
		sliderRef.current.scrollBy({
			left: direction === "left" ? -offset : offset,
			behavior: "smooth",
		});
	};

	return (
		<section className="w-full px-4 sm:px-8 py-20 max-w-screen-2xl mx-auto">
			{/* Section Header */}
			<div className="flex items-end justify-between mb-10 pb-5 border-b border-(--border-color)">
				<div>
					<span className="text-[10px] uppercase tracking-[0.28em] font-medium text-(--text-muted) block mb-2">
						Curated Essentials
					</span>
					<h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl tracking-tight text-(--text-headline)">
						Most Coveted Pieces
					</h2>
				</div>

				{/* Minimal Editorial Arrow Controls */}
				<div className="flex items-center space-x-2">
					<button
						onClick={() => scroll("left")}
						disabled={!canScrollLeft}
						aria-label="Previous pieces"
						className="w-10 h-10 rounded-full border border-(--border-color) flex items-center justify-center text-(--text-headline) disabled:opacity-20 disabled:cursor-not-allowed hover:border-(--text-headline) transition-all duration-300 active:scale-95 cursor-pointer"
					>
						<ArrowLeft className="w-4 h-4 stroke-[1.5]" />
					</button>
					<button
						onClick={() => scroll("right")}
						disabled={!canScrollRight}
						aria-label="Next pieces"
						className="w-10 h-10 rounded-full border border-(--border-color) flex items-center justify-center text-(--text-headline) disabled:opacity-20 disabled:cursor-not-allowed hover:border-(--text-headline) transition-all duration-300 active:scale-95 cursor-pointer"
					>
						<ArrowRight className="w-4 h-4 stroke-[1.5]" />
					</button>
				</div>
			</div>

			{/* Horizontal Scrolling Track */}
			<div
				ref={sliderRef}
				onScroll={checkScroll}
				className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 hide-scrollbar"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						className="flex-none w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[calc(25%-18px)] snap-start"
					/>
				))}
			</div>
		</section>
	);
}
