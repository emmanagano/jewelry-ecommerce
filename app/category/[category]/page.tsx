import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import ProductCard from "@/components/ProductCard";

interface PageProps {
	params: Promise<{ category: string }>;
}

const CATEGORY_DETAILS: Record<string, { title: string; description: string }> =
	{
		bracelets: {
			title: "BRACELETS",
			description:
				"Elevate your wrist stack with our handcrafted bracelets. Whether you love a customizable charm chain or a sleek, minimalist bangle, discover pieces designed for everyday elegance.",
		},
		rings: {
			title: "RINGS",
			description:
				"From delicate micro-pavé stacking bands to bold statement cocktail rings, explore timeless designs crafted in solid gold, vermeil, and sterling silver.",
		},
		necklaces: {
			title: "NECKLACES",
			description:
				"Layer your style with sculpted pendants, lustrous pearl stations, and diamond-cut chains designed to shine from day to night.",
		},
		earrings: {
			title: "EARRINGS",
			description:
				"Discover everyday huggies, statement sculptural drops, and luminous solitaire studs crafted for effortless comfort and radiant shine.",
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
		<div className="animate-pulse">
			<div className="h-4 w-24 bg-gray-200 rounded mb-6" />
			<div className="border-b border-gray-200 pb-8 mb-8">
				<div className="h-10 w-48 bg-gray-200 rounded mb-4" />
				<div className="h-4 w-96 bg-gray-200 rounded" />
			</div>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
				{[...Array(8)].map((_, i) => (
					<div
						key={i}
						className="aspect-square bg-gray-100 rounded-sm"
					/>
				))}
			</div>
		</div>
	);
}

// 4. Async component handling URL resolution and DB fetching inside Suspense
async function CategoryContent({ params }: PageProps) {
	const { category } = await params;
	const lowerSlug = category.toLowerCase();

	const info = CATEGORY_DETAILS[lowerSlug];

	// Gracefully handle categories that don't exist (like /category/engraving)
	if (!info) {
		notFound();
	}

	const categoryTitle =
		lowerSlug.charAt(0).toUpperCase() + lowerSlug.slice(1);

	const products = await getCategoryProducts(categoryTitle);

	return (
		<>
			<nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
				<Link href="/" className="hover:text-black transition">
					Home
				</Link>
				<span>/</span>
				<span className="text-gray-900 capitalize">{category}</span>
			</nav>

			<div className="mb-8 border-b border-gray-200 pb-8">
				<h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-gray-900 mb-3">
					{info.title}
				</h1>
				<p className="max-w-xl text-sm leading-relaxed text-gray-600">
					{info.description}
				</p>
			</div>

			<div className="mb-6 flex items-center justify-between">
				<span className="text-xs font-semibold tracking-wider uppercase text-gray-800">
					{products.length}{" "}
					{products.length === 1 ? "Product" : "Products"}
				</span>
			</div>

			{products.length === 0 ? (
				<div className="py-20 text-center text-gray-400">
					No products found in this category.
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			)}
		</>
	);
}

// 5. The page entry point streams immediately without blocking
export default function CategoryPage({ params }: PageProps) {
	return (
		<main className="max-w-7xl mx-auto px-6 py-8">
			<Suspense fallback={<CategorySkeleton />}>
				<CategoryContent params={params} />
			</Suspense>
		</main>
	);
}
