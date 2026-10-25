"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard, { Product } from "./ProductCard";

const MOCK_PRODUCTS: Product[] = [
	{
		id: "prod-1",
		name: "Celestial Diamond Solitaire Ring",
		category: "18k Solid Yellow Gold",
		price: "$1,250",
		badge: "Best Seller",
		slug: "celestial-diamond-solitaire-ring",
	},
	{
		id: "prod-2",
		name: "Cascade Herringbone Chain",
		category: "Recycled Sterling Silver",
		price: "$340",
		badge: "Trending",
		slug: "cascade-herringbone-chain",
	},
	{
		id: "prod-3",
		name: "Lumière Baguette Huggie Hoops",
		category: "Lab-Grown Diamond & 14k Gold",
		price: "$580",
		badge: "Best Seller",
		slug: "lumiere-baguette-huggie-hoops",
	},
	{
		id: "prod-4",
		name: "Solstice Oval Pendant Necklace",
		category: "18k Gold Vermeil",
		price: "$420",
		badge: "Few Left",
		slug: "solstice-oval-pendant-necklace",
	},
	{
		id: "prod-5",
		name: "Elysian Emerald Cut Band",
		category: "Platinum & Lab-Grown Emerald",
		price: "$1,890",
		badge: "New",
		slug: "elysian-emerald-cut-band",
	},
	{
		id: "prod-6",
		name: "Aura Freshwater Pearl Choker",
		category: "14k Solid Yellow Gold",
		price: "$490",
		badge: null,
		slug: "aura-freshwater-pearl-choker",
	},
	{
		id: "prod-7",
		name: "Vesper Pavé Diamond Cuff",
		category: "18k White Gold",
		price: "$2,100",
		badge: "Iconic",
		slug: "vesper-pave-diamond-cuff",
	},
	{
		id: "prod-8",
		name: "Serpentine Spiral Drop Earrings",
		category: "18k Gold Vermeil",
		price: "$310",
		badge: null,
		slug: "serpentine-spiral-drop-earrings",
	},
];

export default function BestSellers() {
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
	}, []);

	const scroll = (direction: "left" | "right") => {
		if (!sliderRef.current) return;
		const offset = sliderRef.current.clientWidth * 0.75;
		sliderRef.current.scrollBy({
			left: direction === "left" ? -offset : offset,
			behavior: "smooth",
		});
	};

	return (
		<section className="w-full px-8 py-16 max-w-screen-2xl mx-auto">
			{/* Section Header */}
			<div className="flex items-end justify-between mb-8 pb-4 border-b border-(--border-color)">
				<div>
					<span className="font-secondary text-xs uppercase tracking-widest text-(--text-muted) block mb-2">
						Curated Essentials
					</span>
					<h2 className="font-primary text-2xl sm:text-3xl text-(--text-headline)">
						Most Coveted Pieces
					</h2>
				</div>

				{/* Arrow Controls & View All */}
				<div className="flex items-center space-x-6">
					<Link
						href="/collections/best-sellers"
						className="hidden sm:inline-block font-secondary text-xs uppercase tracking-widest text-(--accent-blue) hover:text-(--text-headline) transition-colors underline underline-offset-4"
					>
						View All (24)
					</Link>

					<div className="flex items-center space-x-2">
						<button
							onClick={() => scroll("left")}
							disabled={!canScrollLeft}
							aria-label="Previous items"
							className="p-2.5 border border-(--border-color) text-(--text-headline) disabled:opacity-25 disabled:cursor-not-allowed hover:bg-(--card-main) hover:text-(--accent-light) transition-colors"
						>
							<ChevronLeft className="w-4 h-4 stroke-[1.5]" />
						</button>
						<button
							onClick={() => scroll("right")}
							disabled={!canScrollRight}
							aria-label="Next items"
							className="p-2.5 border border-(--border-color) text-(--text-headline) disabled:opacity-25 disabled:cursor-not-allowed hover:bg-(--card-main) hover:text-(--accent-light) transition-colors"
						>
							<ChevronRight className="w-4 h-4 stroke-[1.5]" />
						</button>
					</div>
				</div>
			</div>

			{/* Horizontal Scrolling Track */}
			<div
				ref={sliderRef}
				onScroll={checkScroll}
				className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar pb-4"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
			>
				{MOCK_PRODUCTS.map((product) => (
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
