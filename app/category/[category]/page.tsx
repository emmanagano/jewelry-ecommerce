import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import ProductCard from "@/components/ProductCard";

interface PageProps {
	params: Promise<{ category: string }>;
}

const CATEGORY_DETAILS: Record<
	string,
	{ title: string; description: string; bannerImage: string }
> = {
	bracelets: {
		title: "Bracelets",
		description:
			"Elevate your wrist stack with our handcrafted bracelets. Whether you love a customizable charm chain or a sleek, minimalist bangle, discover pieces designed for everyday elegance.",
		bannerImage:
			"https://images.unsplash.com/photo-1619119069152-a2b331eb392a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
	},
	rings: {
		title: "Rings",
		description:
			"From delicate micro-pavé stacking bands to bold statement cocktail rings, explore timeless designs crafted in solid gold, vermeil, and sterling silver.",
		bannerImage:
			"https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2000&auto=format&fit=crop",
	},
	necklaces: {
		title: "Necklaces",
		description:
			"Layer your style with sculpted pendants, lustrous pearl stations, and diamond-cut chains designed to shine from day to night.",
		bannerImage:
			"https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2000&auto=format&fit=crop",
	},
	earrings: {
		title: "Earrings",
		description:
			"Discover everyday huggies, statement sculptural drops, and luminous solitaire studs crafted for effortless comfort and radiant shine.",
		bannerImage:
			"https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
	},
};

// 1. Pre-render your primary known categories at build time for instant SEO
export async function generateStaticParams() {
	return [
		{ category: "bracelets" },
		{ category: "rings" },
		{ category: "necklaces" },
		{ category: "earrings" },
	];
}

// 2. Cached database query
async function getCategoryProducts(categoryTitle: string) {
	"use cache";
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.ilike("category", categoryTitle);

	if (error) {
		console.error("Error fetching category products:", error.message);
	}

	return data ?? [];
}

// 3. Skeleton UI shown instantly while params & Supabase resolve
function CategorySkeleton() {
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

// 4. Async component handling URL resolution and DB fetching inside Suspense
async function CategoryContent({ params }: PageProps) {
	const { category } = await params;
	const lowerSlug = category.toLowerCase();

	const info = CATEGORY_DETAILS[lowerSlug];

	if (!info) {
		notFound();
	}

	const categoryTitle =
		lowerSlug.charAt(0).toUpperCase() + lowerSlug.slice(1);

	const products = await getCategoryProducts(categoryTitle);

	return (
		<div className="w-full bg-(--bg-base)">
			{/* --- EDITORIAL HERO BANNER --- */}
			<div className="relative w-full h-[45vh] min-h-87.5 flex flex-col items-center justify-center overflow-hidden">
				{/* Background Image */}
				<img
					src={info.bannerImage}
					alt={`${info.title} Collection`}
					className="absolute inset-0 w-full h-full object-cover object-center"
				/>
				{/* Gradient Scrim for text readability */}
				<div className="absolute inset-0 bg-black/40" />

				{/* Centered Typography */}
				<div className="relative z-10 text-center text-white px-6 max-w-2xl flex flex-col items-center">
					<span className="text-[10px] uppercase tracking-[0.3em] font-medium mb-4 text-white/80">
						The Collection
					</span>
					<h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide mb-6 drop-shadow-sm">
						{info.title}
					</h1>
					<p className="text-xs sm:text-sm font-light leading-relaxed text-white/90 max-w-md">
						{info.description}
					</p>
				</div>
			</div>

			{/* --- MAIN CONTENT AREA --- */}
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
				{/* Breadcrumbs */}
				<nav className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center space-x-2 mb-10 text-(--text-muted)">
					<Link
						href="/"
						className="hover:text-(--text-headline) transition-colors"
					>
						Home
					</Link>
					<span className="opacity-50">/</span>
					<span className="text-(--text-headline)">
						{categoryTitle}
					</span>
				</nav>

				{/* Utility Ribbon (Filter/Sort Placeholder) */}
				<div className="mb-8 pb-4 border-b border-(--border-color) flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-semibold text-(--text-headline)">
					<div className="flex items-center gap-4">
						<button className="hover:opacity-70 transition-opacity cursor-pointer">
							Filter +
						</button>
					</div>
					<div>
						<span>
							{products.length}{" "}
							{products.length === 1 ? "Piece" : "Pieces"}
						</span>
					</div>
				</div>

				{/* Product Grid */}
				{products.length === 0 ? (
					<div className="py-24 text-center text-xs tracking-widest uppercase text-(--text-muted)">
						No pieces currently available in this collection.
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

// 5. The page entry point streams immediately without blocking
export default function CategoryPage({ params }: PageProps) {
	return (
		<main className="min-h-screen bg-(--bg-base)">
			<Suspense fallback={<CategorySkeleton />}>
				<CategoryContent params={params} />
			</Suspense>
		</main>
	);
}
