"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

// Shown when a page's data can't load (e.g. Supabase is unreachable)
export default function Error({
	error,
	retry,
}: {
	error: unknown;
	retry: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<section className="min-h-[60vh] max-w-xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
			<span className="font-secondary text-[11px] tracking-[0.35em] uppercase font-medium mb-6 text-(--text-muted)">
				A Brief Pause
			</span>
			<h1 className="font-serif text-3xl sm:text-4xl tracking-tight leading-tight mb-5 text-balance text-(--text-headline)">
				This page couldn&rsquo;t be loaded.
			</h1>
			<p className="text-sm leading-relaxed mb-10 font-light text-(--text-body)">
				Please try again in a moment.
			</p>
			<div className="flex items-center gap-8 font-secondary text-[11px] tracking-[0.25em] uppercase">
				<button
					type="button"
					onClick={() => retry()}
					className="py-3 px-8 bg-(--text-headline) text-(--bg-base) hover:opacity-90 transition-opacity rounded-xs cursor-pointer"
				>
					Try Again
				</button>
				<Link
					href="/"
					className="text-(--accent-blue) hover:opacity-70 transition-opacity"
				>
					Back to Storefront
				</Link>
			</div>
		</section>
	);
}
