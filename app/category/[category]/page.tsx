import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
	getCategories,
	getCategory,
	getProductsByCategory,
} from "@/app/lib/data/products";
import ProductListing, { ListingSkeleton } from "@/components/ProductListing";

interface PageProps {
	params: Promise<{ category: string }>;
}

// 1. Pre-render every category in the database at build time
export async function generateStaticParams() {
	const categories = await getCategories();
	return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { category: slug } = await params;
	const category = await getCategory(slug.toLowerCase());
	if (!category) return {};

	return {
		title: category.name,
		description: category.description ?? undefined,
		alternates: { canonical: `/category/${category.slug}` },
		openGraph: {
			title: category.name,
			description: category.description ?? undefined,
			images: category.banner_image ? [category.banner_image] : undefined,
		},
	};
}

// 2. Async component handling URL resolution and DB fetching inside Suspense
async function CategoryContent({ params }: PageProps) {
	const { category: slug } = await params;
	const category = await getCategory(slug.toLowerCase());

	if (!category) {
		notFound();
	}

	const products = await getProductsByCategory(category.slug);

	return (
		<ProductListing
			eyebrow="Maison Vaelore"
			title={category.name}
			description={category.description}
			bannerImage={category.banner_image}
			products={products}
		/>
	);
}

// 3. The page entry point streams immediately without blocking
export default function CategoryPage({ params }: PageProps) {
	return (
		<div className="min-h-screen bg-(--bg-base)">
			<Suspense fallback={<ListingSkeleton />}>
				<CategoryContent params={params} />
			</Suspense>
		</div>
	);
}
