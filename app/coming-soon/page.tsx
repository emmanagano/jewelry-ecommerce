import { Suspense } from "react";
import Link from "next/link";
import { getCategories } from "@/app/lib/data/products";

interface ComingSoonProps {
	searchParams: Promise<{ feature?: string }>;
}

async function ComingSoonContent({ searchParams }: ComingSoonProps) {
	const { feature } = await searchParams;
	const categories = await getCategories().catch((error) => {
		console.error(error);
		return [];
	});

	const featureTitle = feature
		? feature
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		: "This Page";

	return (
		<section className="max-w-4xl w-full mx-auto py-24 px-6 flex flex-col items-center text-center">
			{/* Editorial Sub-tag */}
			<span className="eyebrow font-medium mb-6 text-(--text-muted)">
				In Development
			</span>

			{/* Headline wraps with balanced lines on narrow screens */}
			<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-5 text-balance text-(--text-headline)">
				{featureTitle} is coming soon.
			</h1>

			{/* Balanced narrative text */}
			<p className="text-sm md:text-base leading-relaxed max-w-md mb-12 font-light text-(--text-body)">
				We are crafting this experience for our upcoming release. In the
				meantime, discover our current collections.
			</p>

			{/* Minimalist hairline divider */}
			<div className="w-16 h-px mb-12 bg-(--border-color)" />

			{/* Understated inline typographic links */}
			<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs tracking-[0.2em] uppercase font-medium mb-12">
				{categories.map((cat) => (
					<Link
						key={cat.slug}
						href={`/category/${cat.slug}`}
						className="transition-opacity duration-200 hover:opacity-60 underline-offset-8 hover:underline text-(--text-headline)"
					>
						{cat.name}
					</Link>
				))}
			</div>

			{/* Return home link */}
			<Link
				href="/"
				className="eyebrow transition-opacity duration-200 hover:opacity-70 text-(--accent-blue)"
			>
				← Back to Storefront
			</Link>
		</section>
	);
}

export default function ComingSoonPage({ searchParams }: ComingSoonProps) {
	return (
		<div className="min-h-[75vh] flex items-center justify-center transition-colors duration-500 bg-(--bg-base)">
			<Suspense
				fallback={
					<div className="text-center py-24 text-xs tracking-widest uppercase text-(--text-muted)">
						Loading...
					</div>
				}
			>
				<ComingSoonContent searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
