import { Suspense } from "react";
import type { Metadata } from "next";
import Form from "next/form";
import { Search } from "lucide-react";
import { searchProducts } from "@/app/lib/data/products";
import ProductGrid from "@/components/ProductGrid";

interface PageProps {
	searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
	title: "Search",
	robots: { index: false },
};

async function SearchResults({ searchParams }: PageProps) {
	const { q } = await searchParams;
	const query = q?.trim() ?? "";

	if (!query) {
		return (
			<p className="py-24 text-center text-label tracking-widest uppercase text-(--text-muted)">
				Search by piece, metal or stone.
			</p>
		);
	}

	const products = await searchProducts(query);

	return (
		<>
			<p className="mb-8 pb-4 border-b border-(--border-color) text-label uppercase font-medium text-(--text-headline)">
				{products.length} {products.length === 1 ? "Result" : "Results"}{" "}
				for &ldquo;{query}&rdquo;
			</p>
			<ProductGrid
				products={products}
				emptyMessage="No piece matches your search."
			/>
		</>
	);
}

// The input's default value also depends on the query, so it streams too
async function SearchField({ searchParams }: PageProps) {
	const { q } = await searchParams;
	return <SearchForm defaultValue={q ?? ""} />;
}

function SearchForm({ defaultValue = "" }: { defaultValue?: string }) {
	return (
		<Form action="/search" className="relative flex items-center max-w-xl">
			<Search className="absolute left-4 w-4 h-4 text-(--text-muted)" />
			<input
				key={defaultValue}
				type="search"
				name="q"
				defaultValue={defaultValue}
				placeholder="Search pieces..."
				aria-label="Search pieces"
				className="w-full bg-(--card-sub)/70 border border-(--border-color) rounded-full py-3 pl-11 pr-4 font-body text-copy-sm text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-white"
			/>
		</Form>
	);
}

export default function SearchPage({ searchParams }: PageProps) {
	return (
		<div className="min-h-screen max-w-screen-2xl mx-auto px-4 sm:px-8 py-12 lg:py-16 bg-(--bg-base)">
			<span className="eyebrow text-(--text-muted) block mb-3">
				The Collections
			</span>
			<h1 className="font-primary text-heading sm:text-title tracking-tight text-(--text-headline) mb-8">
				Search
			</h1>

			<div className="mb-12">
				<Suspense fallback={<SearchForm />}>
					<SearchField searchParams={searchParams} />
				</Suspense>
			</div>

			<Suspense
				fallback={
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
						{[1, 2, 3, 4].map((n) => (
							<div
								key={n}
								className="aspect-4/5 bg-(--card-sub) rounded-xs"
							/>
						))}
					</div>
				}
			>
				<SearchResults searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
