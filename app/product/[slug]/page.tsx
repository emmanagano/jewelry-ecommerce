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
		<div className="max-w-7xl mx-auto px-6 py-10 animate-pulse">
			<div className="h-4 w-48 bg-gray-200 rounded mb-8" />
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
				<div className="lg:col-span-7 flex flex-col gap-4">
					<div className="aspect-[4/5] bg-gray-200 rounded-sm" />
					<div className="aspect-[4/5] bg-gray-200 rounded-sm" />
				</div>
				<div className="lg:col-span-5 space-y-4">
					<div className="h-8 w-3/4 bg-gray-200 rounded" />
					<div className="h-4 w-1/3 bg-gray-200 rounded" />
					<div className="h-6 w-1/4 bg-gray-200 rounded" />
					<div className="h-12 w-full bg-gray-200 rounded mt-6" />
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
	// Uses images[0], images[1], and creates a 3rd focused perspective
	const rawImages: string[] = product.images ?? [];
	const galleryImages = [
		rawImages[0] ??
			"https://images.unsplash.com/photo-1611591475152-47354c5ce794?auto=format&fit=crop&w=800&q=80",
		rawImages[1] ?? rawImages[0],
		rawImages[0] ?? rawImages[1], // 3rd stack angle
	];

	return (
		<div className="max-w-7xl mx-auto px-6 py-8">
			{/* Breadcrumbs */}
			<nav
				className="text-[11px] uppercase tracking-widest flex items-center space-x-2 mb-8"
				style={{ color: "var(--text-muted)" }}
			>
				<Link href="/" className="hover:opacity-70 transition">
					Home
				</Link>
				<span>/</span>
				<Link
					href={`/category/${product.category.toLowerCase()}`}
					className="hover:opacity-70 transition"
				>
					{product.category}
				</Link>
				<span>/</span>
				<span
					className="font-medium truncate max-w-xs"
					style={{ color: "var(--text-headline)" }}
				>
					{product.name}
				</span>
			</nav>

			{/* Main Two-Column Layout */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				{/* Left: 3-Image Editorial Placeholder Stack */}
				<div className="lg:col-span-7 flex flex-col gap-4">
					{[1, 2, 3].map((num) => (
						<div
							key={num}
							className="relative w-full aspect-[4/5] flex flex-col items-center justify-center border transition-all select-none"
							style={{
								backgroundColor: "var(--card-sub)",
								borderColor: "var(--border-color)",
							}}
						>
							{/* Editorial circle badge */}
							<div
								className="w-24 h-24 rounded-full flex flex-col items-center justify-center border mb-3 transition-transform duration-300 hover:scale-105"
								style={{
									borderColor: "var(--border-color)",
									backgroundColor: "var(--card-main)",
								}}
							>
								<span
									className="text-[10px] uppercase tracking-[0.25em] font-semibold"
									style={{ color: "var(--text-muted)" }}
								>
									Photo
								</span>
								<span
									className="text-[9px] font-mono mt-0.5"
									style={{ color: "var(--text-muted)" }}
								>
									0{num}
								</span>
							</div>

							<span
								className="text-[10px] uppercase tracking-[0.2em] font-medium"
								style={{ color: "var(--text-muted)" }}
							>
								{num === 1
									? "Front View"
									: num === 2
										? "Detail Angle"
										: "Scale & Wear"}
							</span>
						</div>
					))}
				</div>

				{/* Right: Sticky Details and Actions */}
				<div className="lg:col-span-5 lg:top-28">
					<ProductInteractive product={product} />
				</div>
			</div>
		</div>
	);
}

export default function ProductPage({ params }: PageProps) {
	return (
		<main
			className="min-h-screen transition-colors duration-500"
			style={{
				backgroundColor: "var(--bg-base)",
			}}
		>
			<Suspense fallback={<ProductSkeleton />}>
				<ProductContent params={params} />
			</Suspense>
		</main>
	);
}
