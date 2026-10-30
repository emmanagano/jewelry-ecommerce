import ProductCard from "@/components/ProductCard";
import type { ProductSummary } from "@/app/lib/products";

export default function ProductGrid({
	products,
	emptyMessage = "No pieces currently available in this collection.",
}: {
	products: ProductSummary[];
	emptyMessage?: string;
}) {
	if (products.length === 0) {
		return (
			<div className="py-24 text-center text-label tracking-widest uppercase text-(--text-muted)">
				{emptyMessage}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
