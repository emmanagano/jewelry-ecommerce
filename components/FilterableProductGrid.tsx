"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProductGrid from "@/components/ProductGrid";
import { luxurySpring } from "@/app/lib/motion";
import {
	SORT_OPTIONS,
	applyListingParams,
	getFilterOptions,
	parseListingParams,
} from "@/app/lib/listing";
import type { ProductSummary } from "@/app/lib/products";

// Filters a server-rendered listing in the browser. The full list ships in
// the static page, so filtering is instant and needs no extra requests.
export default function FilterableProductGrid({
	products,
}: {
	products: ProductSummary[];
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [panelOpen, setPanelOpen] = useState(false);

	const params = parseListingParams(searchParams);
	const options = getFilterOptions(products);
	const visible = applyListingParams(products, params);
	const activeCount = [params.metal, params.stone, params.price].filter(
		Boolean,
	).length;

	const setParam = (key: string, value: string | null) => {
		const next = new URLSearchParams(searchParams.toString());
		if (value) next.set(key, value);
		else next.delete(key);
		const query = next.toString();
		router.replace(query ? `${pathname}?${query}` : pathname, {
			scroll: false,
		});
	};

	const clearFilters = () => {
		const next = new URLSearchParams(searchParams.toString());
		["metal", "stone", "price"].forEach((key) => next.delete(key));
		const query = next.toString();
		router.replace(query ? `${pathname}?${query}` : pathname, {
			scroll: false,
		});
	};

	const facets = [
		{
			key: "metal",
			label: "Metal",
			active: params.metal,
			options: options.metals.map((m) => ({ value: m, label: m })),
		},
		{
			key: "stone",
			label: "Stone",
			active: params.stone,
			options: options.stones.map((s) => ({ value: s, label: s })),
		},
		{
			key: "price",
			label: "Price",
			active: params.price,
			options: options.prices.map((r) => ({
				value: r.value,
				label: r.label,
			})),
		},
	].filter((facet) => facet.options.length > 0);

	return (
		<>
			{/* Utility Ribbon */}
			<div className="mb-8 border-b border-(--border-color)">
				<div className="pb-4 flex items-center justify-between gap-4 text-label uppercase font-medium text-(--text-headline)">
					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={() => setPanelOpen((open) => !open)}
							aria-expanded={panelOpen}
							aria-controls="listing-filters"
							className="uppercase hover:text-(--accent) transition-colors cursor-pointer"
						>
							Filter {activeCount > 0 && `(${activeCount})`}{" "}
							{panelOpen ? "−" : "+"}
						</button>
						{activeCount > 0 && (
							<button
								type="button"
								onClick={clearFilters}
								className="uppercase text-(--text-muted) hover:text-(--text-headline) transition-colors cursor-pointer underline underline-offset-4"
							>
								Clear
							</button>
						)}
					</div>

					<div className="flex items-center gap-5">
						<span className="hidden sm:inline">
							{visible.length}{" "}
							{visible.length === 1 ? "Piece" : "Pieces"}
						</span>
						<label className="flex items-center gap-2">
							<span className="sr-only">Sort by</span>
							<select
								value={params.sort}
								onChange={(e) =>
									setParam(
										"sort",
										e.target.value === "featured"
											? null
											: e.target.value,
									)
								}
								className="bg-transparent text-label uppercase font-medium text-(--text-headline) cursor-pointer focus:outline-none"
							>
								{SORT_OPTIONS.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</label>
					</div>
				</div>

				{/* Filter Panel */}
				<AnimatePresence initial={false}>
					{panelOpen && (
						<motion.div
							id="listing-filters"
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={luxurySpring}
							className="overflow-hidden"
						>
							<div className="pb-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
								{facets.map((facet) => (
									<fieldset key={facet.key}>
										<legend className="eyebrow text-(--text-muted) mb-3">
											{facet.label}
										</legend>
										<div className="flex flex-wrap gap-2">
											{facet.options.map((option) => {
												const selected =
													facet.active === option.value;
												return (
													<button
														key={option.value}
														type="button"
														aria-pressed={selected}
														onClick={() =>
															setParam(
																facet.key,
																selected
																	? null
																	: option.value,
															)
														}
														className={`px-3 py-1.5 font-secondary text-label rounded-xs border transition-colors cursor-pointer ${
															selected
																? "bg-(--text-headline) text-(--bg-base) border-(--text-headline)"
																: "border-(--border-color) text-(--text-headline) hover:border-(--text-headline)"
														}`}
													>
														{option.label}
													</button>
												);
											})}
										</div>
									</fieldset>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<ProductGrid
				products={visible}
				emptyMessage={
					activeCount > 0
						? "No pieces match these filters."
						: undefined
				}
			/>
		</>
	);
}
