"use client";

import React, { useRef, useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

export interface Product {
	id: string;
	name: string;
	slug: string;
	subtitle: string;
	badge: string;
	category: string;
	price: number;
	images: string[];
	description: string;
}

export default function BestSellers() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const sliderRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);

	// Fetch live items from Supabase
	useEffect(() => {
		async function fetchProducts() {
			const { data, error } = await supabase
				.from("products")
				.select("*")
				.ilike("badge", "%BEST SELLER%")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error fetching best sellers:", error);
			} else if (data) {
				setProducts(data);
			}
			setLoading(false);
		}

		fetchProducts();
	}, []);

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
				{loading ? (
					// Subtle luxury skeleton loading cards
					<div className="flex gap-6 w-full">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="flex-none w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[calc(25%-18px)] animate-pulse"
							>
								<div className="aspect-4/5 bg-(--card-sub) rounded-xs mb-4" />
								<div className="h-3 w-1/3 bg-(--card-sub) rounded-xs mb-2" />
								<div className="h-4 w-2/3 bg-(--card-sub) rounded-xs mb-2" />
								<div className="h-4 w-1/4 bg-(--card-sub) rounded-xs" />
							</div>
						))}
					</div>
				) : (
					products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							className="flex-none w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[calc(25%-18px)] snap-start"
						/>
					))
				)}
			</div>
		</section>
	);
}
