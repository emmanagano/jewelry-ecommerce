import { supabase } from "@/app/lib/supabase";
import ProductCard from "@/components/ProductCard";

interface PageProps {
	params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
	return [
		{ category: "bracelets" },
		{ category: "rings" },
		{ category: "necklaces" },
		{ category: "earrings" },
	];
}

// 1. Define the cached data fetching helper outside the component
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

	// Format slug back to DB format (e.g., "bracelets" -> "Bracelets")
	const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

	// 2. Call the cached function here
	const products = await getCategoryProducts(categoryTitle);

	return (
		<main className="max-w-7xl mx-auto px-6 py-12">
			{/* Dynamic Header */}
			<div className="mb-8 border-b pb-6">
				<h1 className="text-3xl font-serif tracking-wider uppercase text-gray-900">
					{categoryTitle}
				</h1>
				<p className="text-sm text-gray-500 mt-2">
					{products.length} Products
				</p>
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
