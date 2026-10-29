import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductSlugs } from "@/app/lib/data/products";
import ProductInteractive from "@/components/ProductInteractive";
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
				className="font-secondary text-[10px] uppercase tracking-[0.2em] font-medium flex items-center space-x-2 mb-8 text-(--text-muted)">
				<Link
					href="/"
					className="hover:text-(--text-headline) transition-colors"
				>
					Home
				</Link>
				<span className="opacity-50">/</span>
				<Link
					href={`/category/${category.slug}`}
					className="hover:text-(--text-headline) transition-colors"
				>
					{category.name}
				</Link>
				<span className="opacity-50">/</span>
				<span className="truncate max-w-xs text-(--text-headline)">
					{product.name}
				</span>
			</nav>

			{/* Main Two-Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				{/* Left: 3-Image Editorial Stack */}
				<div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
					{galleryImages.map(({ src, detail }, idx) => (
						<div
							key={`${src}-${idx}`}
							className="relative w-full aspect-4/5 overflow-hidden bg-(--card-sub) border border-(--border-color) rounded-xs group"
						>
							<Image
								src={src}
								fill
								sizes="(min-width: 1024px) 58vw, 100vw"
								loading={idx === 0 ? "eager" : "lazy"}
								fetchPriority={idx === 0 ? "high" : "auto"}
								alt={
									detail
										? `${product.name} - Detail`
										: `${product.name} - View ${idx + 1}`
								}
								className={`object-cover transition-transform duration-700 ease-out ${
									detail
										? "scale-125 hover:scale-150 origin-center"
										: "hover:scale-105"
								}`}
							/>
						</div>
					))}
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
