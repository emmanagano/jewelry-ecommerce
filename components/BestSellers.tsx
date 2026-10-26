"use client";

import React, { useRef, useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
				.ilike("badge", "%BEST SELLER%") // Matches any badge containing "BEST SELLER"
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
						View All ({products.length})
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
				{loading ? (
					<div className="w-full py-12 text-center text-(--text-muted)">
						Loading collection...
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
