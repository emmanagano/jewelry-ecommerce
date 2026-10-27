import Link from "next/link";
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

export async function generateStaticParams() {
	return [
		{ category: "bracelets" },
		{ category: "rings" },
		{ category: "necklaces" },
		{ category: "earrings" },
	];
}

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

export default async function CategoryPage({ params }: PageProps) {
	const { category } = await params;
	const lowerSlug = category.toLowerCase();

	const info = CATEGORY_DETAILS[lowerSlug] ?? {
		title: category.toUpperCase(),
		description: "Explore our curated jewelry collection.",
	};

	const categoryTitle =
		category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

	const products = await getCategoryProducts(categoryTitle);

	return (
		<main className="max-w-7xl mx-auto px-6 py-8">
			{/* Breadcrumbs */}
			<nav className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
				<Link href="/" className="hover:text-black transition">
					Home
				</Link>
				<span>/</span>
				<span className="text-gray-900 capitalize">{category}</span>
			</nav>

			{/* Category Header */}
			<div className="mb-8 border-b border-gray-200 pb-8">
				<h1 className="text-4xl md:text-5xl font-sans font-bold tracking-tight text-gray-900 mb-3">
					{info.title}
				</h1>
				<p className="max-w-xl text-sm leading-relaxed text-gray-600">
					{info.description}
				</p>
			</div>

			{/* Sub-header / Product Count */}
			<div className="mb-6 flex items-center justify-between">
				<span className="text-xs font-semibold tracking-wider uppercase text-gray-800">
					{products.length} Products
				</span>
			</div>

			{/* Reusable Product Grid */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</main>
	);
}
