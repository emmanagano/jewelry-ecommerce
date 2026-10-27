import { Suspense } from "react";
import Link from "next/link";

interface ComingSoonProps {
	searchParams: Promise<{ feature?: string }>;
}

async function ComingSoonContent({ searchParams }: ComingSoonProps) {
	const { feature } = await searchParams;

	const featureTitle = feature
		? feature
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ")
		: "This Page";

	return (
		<section className="max-w-4xl w-full mx-auto py-24 px-6 flex flex-col items-center text-center">
			{/* Editorial Sub-tag */}
			<span
				className="text-[11px] tracking-[0.35em] uppercase font-medium mb-6"
				style={{ color: "var(--text-muted)" }}
			>
				In Development
			</span>

			{/* 2. Headline with whitespace-nowrap and balanced font sizing */}
			<h1
				className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-5 whitespace-nowrap"
				style={{ color: "var(--text-headline)" }}
			>
				{featureTitle} is coming soon.
			</h1>

			{/* Balanced narrative text */}
			<p
				className="text-sm md:text-base leading-relaxed max-w-md mb-12 font-light"
				style={{ color: "var(--text-body)" }}
			>
				We are crafting this experience for our upcoming release. In the
				meantime, discover our current collections.
			</p>

			{/* Minimalist hairline divider */}
			<div
				className="w-16 h-[1px] mb-12"
				style={{ backgroundColor: "var(--border-color)" }}
			/>

			{/* Understated inline typographic links */}
			<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs tracking-[0.2em] uppercase font-medium mb-12">
				{[
					{ name: "Bracelets", href: "/category/bracelets" },
					{ name: "Rings", href: "/category/rings" },
					{ name: "Necklaces", href: "/category/necklaces" },
					{ name: "Earrings", href: "/category/earrings" },
				].map((cat) => (
					<Link
						key={cat.name}
						href={cat.href}
						className="transition-opacity duration-200 hover:opacity-60 underline-offset-8 hover:underline"
						style={{ color: "var(--text-headline)" }}
					>
						{cat.name}
					</Link>
				))}
			</div>

			{/* Return home link */}
			<Link
				href="/"
				className="text-[11px] tracking-[0.25em] uppercase transition-opacity duration-200 hover:opacity-70"
				style={{ color: "var(--accent-blue)" }}
			>
				← Back to Storefront
			</Link>
		</section>
	);
}

export default function ComingSoonPage({ searchParams }: ComingSoonProps) {
	return (
		<main
			className="min-h-[75vh] flex items-center justify-center transition-colors duration-500"
			style={{
				backgroundColor: "var(--bg-base)",
			}}
		>
			<Suspense
				fallback={
					<div
						className="text-center py-24 text-xs tracking-widest uppercase"
						style={{ color: "var(--text-muted)" }}
					>
						Loading...
					</div>
				}
			>
				<ComingSoonContent searchParams={searchParams} />
			</Suspense>
		</main>
	);
}
