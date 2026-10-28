import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import ProductInteractive from "@/components/ProductInteractive";

interface PageProps {
	params: Promise<{ slug: string }>;
}

// 1. Build-time static generation for all products in DB
export async function generateStaticParams() {
	const { data: products } = await supabase.from("products").select("slug");
	return (products ?? []).map((p) => ({
		slug: p.slug,
	}));
}

// 2. Cached product query
async function getProductBySlug(slug: string) {
	"use cache";
	const { data, error } = await supabase
		.from("products")
		.select("*")
		.eq("slug", slug)
		.single();

	if (error || !data) {
		return null;
	}
	return data;
}

// 3. Loading skeleton
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

// 4. Product content
async function ProductContent({ params }: PageProps) {
	const { slug } = await params;
	const product = await getProductBySlug(slug);

	if (!product) {
		notFound();
	}

	// Guarantee 3 images in the stack
	// Uses images[0] (Front View), images[1] (Scale & Wear), and a zoomed images[0] for the Detail Angle
	const rawImages: string[] = product.images ?? [];
	const galleryImages = [
		rawImages[0] ?? "",
		rawImages[1] ?? rawImages[0] ?? "",
		rawImages[0] ?? "", // 3rd stack angle (macro detail)
	].filter(Boolean); // Remove empty strings if images are missing

	return (
		<div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
			{/* Breadcrumbs */}
			<nav className="text-[10px] uppercase tracking-[0.2em] font-medium flex items-center space-x-2 mb-8 text-(--text-muted)">
				<Link
					href="/"
					className="hover:text-(--text-headline) transition-colors"
				>
					Home
				</Link>
				<span className="opacity-50">/</span>
				<Link
					href={`/category/${product.category.toLowerCase()}`}
					className="hover:text-(--text-headline) transition-colors"
				>
					{product.category}
				</Link>
				<span className="opacity-50">/</span>
				<span className="truncate max-w-xs text-(--text-headline)">
					{product.name}
				</span>
			</nav>

			{/* Main Two-Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				{/* Left: 3-Image Editorial Stack */}
				<div className="lg:col-span-7 flex flex-col gap-4">
					{galleryImages.map((imgSrc, idx) => (
						<div
							key={`${imgSrc}-${idx}`}
							className="relative w-full aspect-4/5 overflow-hidden bg-(--card-sub) border border-(--border-color) rounded-xs"
						>
							<img
								src={imgSrc}
								alt={`${product.name} - View 0${idx + 1}`}
								// The 3rd image (idx 2) is zoomed in by default to act as a detail/macro shot
								className={`w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105 ${
									idx === 2
										? "scale-125 hover:scale-150 origin-center"
										: ""
								}`}
							/>
						</div>
					))}
				</div>

				{/* Right: Sticky Details and Actions */}
				<div className="lg:col-span-5 top-32">
					<ProductInteractive product={product} />
				</div>
			</div>
		</div>
	);
}

export default function ProductPage({ params }: PageProps) {
	return (
		<main className="min-h-screen bg-(--bg-base)">
			<Suspense fallback={<ProductSkeleton />}>
				<ProductContent params={params} />
			</Suspense>
		</main>
	);
}
