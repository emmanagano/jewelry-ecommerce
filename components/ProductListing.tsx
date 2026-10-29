import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import FilterableProductGrid from "@/components/FilterableProductGrid";
import ProductGrid from "@/components/ProductGrid";
import type { ProductSummary } from "@/app/lib/products";

interface ProductListingProps {
	eyebrow: string;
	title: string;
	description: string | null;
	bannerImage: string | null;
	products: ProductSummary[];
}

// Editorial banner + breadcrumbs + filterable grid, shared by category and
// collection pages
export default function ProductListing({
	eyebrow,
	title,
	description,
	bannerImage,
	products,
}: ProductListingProps) {
	return (
		<div className="w-full bg-(--bg-base)">
			{/* --- EDITORIAL HERO BANNER --- */}
			<div className="relative w-full h-[45vh] min-h-87.5 flex flex-col items-center justify-center overflow-hidden bg-(--card-main)">
				{bannerImage && (
					<Image
						src={bannerImage}
						alt={`${title} Collection`}
						fill
						sizes="100vw"
						loading="eager"
						fetchPriority="high"
						className="object-cover object-center"
					/>
				)}
				{/* Gradient Scrim for text readability */}
				<div className="absolute inset-0 bg-black/40" />

				{/* Centered Typography */}
				<div className="relative z-10 text-center text-white px-6 max-w-2xl flex flex-col items-center">
					<span className="text-[10px] uppercase tracking-[0.3em] font-medium mb-4 text-white/80">
						{eyebrow}
					</span>
					<h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6 drop-shadow-sm">
						{title}
					</h1>
					{description && (
						<p className="text-xs sm:text-sm font-light leading-relaxed text-white/90 max-w-md">
							{description}
						</p>
					)}
				</div>
			</div>

			{/* --- MAIN CONTENT AREA --- */}
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
				{/* Breadcrumbs */}
				<nav
					aria-label="Breadcrumb"
					className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center space-x-2 mb-10 text-(--text-muted)"
				>
					<Link
						href="/"
						className="hover:text-(--text-headline) transition-colors"
					>
						Home
					</Link>
					<span className="opacity-50">/</span>
					<span className="text-(--text-headline)">{title}</span>
				</nav>

				{/* Filters read the URL, so they hydrate inside Suspense; the
				    unfiltered grid is the prerendered fallback. */}
				<Suspense
					fallback={
						<>
							{/* Same footprint as the live ribbon, so nothing shifts */}
							<div className="mb-8 border-b border-(--border-color)">
								<div className="pb-4 flex items-center justify-between font-secondary text-[10px] uppercase tracking-[0.2em] font-semibold text-(--text-headline)">
									<span>Filter +</span>
									<span>
										{products.length}{" "}
										{products.length === 1 ? "Piece" : "Pieces"}
									</span>
								</div>
							</div>
							<ProductGrid products={products} />
						</>
					}
				>
					<FilterableProductGrid products={products} />
				</Suspense>
			</div>
		</div>
	);
}

export function ListingSkeleton() {
	return (
		<div className="animate-pulse w-full">
			<div className="w-full h-[40vh] bg-(--card-sub) mb-8" />
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
				<div className="h-4 w-24 bg-(--card-sub) rounded mb-6" />
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="aspect-square bg-(--card-sub) rounded-xs"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
