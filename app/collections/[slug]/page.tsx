import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCollection, getCollectionSlugs } from "@/app/lib/data/products";
import ProductListing, { ListingSkeleton } from "@/components/ProductListing";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const slugs = await getCollectionSlugs();
	return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const result = await getCollection(slug);
	if (!result) return {};

	const { collection, products } = result;
	const image = collection.banner_image ?? products[0]?.images?.[0];
	return {
		title: collection.name,
		description: collection.description ?? undefined,
		openGraph: {
			title: collection.name,
			description: collection.description ?? undefined,
			images: image ? [image] : undefined,
		},
	};
}

async function CollectionContent({ params }: PageProps) {
	const { slug } = await params;
	const result = await getCollection(slug);

	if (!result) {
		notFound();
	}

	const { collection, products } = result;

	return (
		<ProductListing
			eyebrow="Curated Edit"
			title={collection.name}
			description={collection.description}
			bannerImage={collection.banner_image ?? products[0]?.images?.[0] ?? null}
			products={products}
		/>
	);
}

export default function CollectionPage({ params }: PageProps) {
	return (
		<div className="min-h-screen bg-(--bg-base)">
			<Suspense fallback={<ListingSkeleton />}>
				<CollectionContent params={params} />
			</Suspense>
		</div>
	);
}
