import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductSlugs } from "@/app/lib/data/products";
import ProductInteractive from "@/components/ProductInteractive";
import ProductGallery from "@/components/ProductGallery";
import { SITE_NAME, getSiteUrl } from "@/app/lib/site";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const slugs = await getProductSlugs();
	return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const product = await getProductBySlug(slug);
	if (!product) return {};

	const description =
		product.description ?? product.subtitle ?? product.category.name;
	return {
		title: product.name,
		description,
		alternates: { canonical: `/product/${product.slug}` },
		openGraph: {
			title: product.name,
			description,
			images: product.images?.slice(0, 1),
		},
	};
}

function ProductSkeleton() {
	return (
		<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 lg:py-10 animate-pulse">
			<div className="h-4 w-48 bg-(--card-sub) rounded-xs mb-8" />
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
				<div className="lg:col-span-7 flex flex-col gap-4">
					<div className="aspect-4/5 bg-(--card-sub) rounded-xs" />
					<div className="aspect-4/5 bg-(--card-sub) rounded-xs" />
				</div>
				<div className="lg:col-span-5 space-y-4">
					<div className="h-8 w-3/4 bg-(--card-sub) rounded-xs" />
					<div className="h-4 w-1/3 bg-(--card-sub) rounded-xs" />
					<div className="h-6 w-1/4 bg-(--card-sub) rounded-xs" />
					<div className="h-12 w-full bg-(--card-sub) rounded-xs mt-6" />
				</div>
			</div>
		</div>
	);
}

async function ProductContent({ params }: PageProps) {
	const { slug } = await params;
	const product = await getProductBySlug(slug);

	if (!product) {
		notFound();
	}

	const { category } = product;

	// Structured data so search engines can show price and availability
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.description ?? product.subtitle ?? undefined,
		image: product.images ?? [],
		category: category.name,
		material: product.metal ?? undefined,
		brand: { "@type": "Brand", name: SITE_NAME },
		url: `${getSiteUrl()}/product/${product.slug}`,
		offers: {
			"@type": "Offer",
			url: `${getSiteUrl()}/product/${product.slug}`,
			price: (product.price / 100).toFixed(2),
			priceCurrency: "USD",
			availability: "https://schema.org/InStock",
		},
	};

	// Show every real photo. Products with fewer than three photos get a
	// zoomed "detail" crop of the first one as a final panel.
	const images = product.images ?? [];
	const galleryImages = images.map((src) => ({ src, detail: false }));
	if (images.length > 0 && images.length < 3) {
		galleryImages.push({ src: images[0], detail: true });
	}

	return (
		<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
				}}
			/>

			{/* Breadcrumbs */}
			<nav
				aria-label="Breadcrumb"
				className="eyebrow flex items-center gap-2 mb-8 text-(--text-muted)"
			>
				<Link
					href="/"
					className="hover:text-(--text-headline) transition-colors"
				>
					Home
				</Link>
				<span aria-hidden>/</span>
				<Link
					href={`/category/${category.slug}`}
					className="hover:text-(--text-headline) transition-colors"
				>
					{category.name}
				</Link>
				<span aria-hidden>/</span>
				<span className="truncate max-w-xs text-(--text-headline)">
					{product.name}
				</span>
			</nav>

			{/* Main Two-Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
				<div className="lg:col-span-7">
					<ProductGallery
						images={galleryImages.map(({ src, detail }, idx) => ({
							src,
							detail,
							alt: detail
								? `${product.name}, detail`
								: `${product.name}, view ${idx + 1}`,
						}))}
					/>
				</div>

				{/* Right: Sticky Details and Actions */}
				<div className="lg:col-span-5 lg:sticky lg:top-32">
					<ProductInteractive product={product} />
				</div>
			</div>
		</div>
	);
}

export default function ProductPage({ params }: PageProps) {
	return (
		<div className="min-h-screen bg-(--bg-base)">
			<Suspense fallback={<ProductSkeleton />}>
				<ProductContent params={params} />
			</Suspense>
		</div>
	);
}
