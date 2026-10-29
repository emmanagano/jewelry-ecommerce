import type { ProductSummary } from "@/app/lib/products";

// Filter & sort state lives in the URL (?metal=…&stone=…&price=…&sort=…)
// so listings can be shared and bookmarked.

export const PRICE_RANGES = [
	{ value: "under-1000", label: "Under $1,000", min: 0, max: 100000 },
	{ value: "1000-2000", label: "$1,000 – $2,000", min: 100000, max: 200000 },
	{ value: "over-2000", label: "Over $2,000", min: 200000, max: Infinity },
] as const;

export const SORT_OPTIONS = [
	{ value: "featured", label: "Featured" },
	{ value: "newest", label: "Newest" },
	{ value: "price-asc", label: "Price: Low to High" },
	{ value: "price-desc", label: "Price: High to Low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export interface ListingParams {
	metal: string | null;
	stone: string | null;
	price: string | null;
	sort: SortValue;
}

export function parseListingParams(params: URLSearchParams): ListingParams {
	const sort = params.get("sort");
	return {
		metal: params.get("metal"),
		stone: params.get("stone"),
		price: params.get("price"),
		sort: SORT_OPTIONS.some((o) => o.value === sort)
			? (sort as SortValue)
			: "featured",
	};
}

// Distinct filter values present in a listing, so empty options never show
export function getFilterOptions(products: ProductSummary[]) {
	const distinct = (values: (string | null)[]) =>
		[...new Set(values.filter((v): v is string => Boolean(v)))].sort();

	return {
		metals: distinct(products.map((p) => p.metal)),
		stones: distinct(products.map((p) => p.stone)),
		prices: PRICE_RANGES.filter((r) =>
			products.some((p) => p.price >= r.min && p.price < r.max),
		),
	};
}

// "featured" keeps the order the server returned (curated or newest first)
export function applyListingParams(
	products: ProductSummary[],
	{ metal, stone, price, sort }: ListingParams,
) {
	const range = PRICE_RANGES.find((r) => r.value === price);

	const filtered = products.filter(
		(p) =>
			(!metal || p.metal === metal) &&
			(!stone || p.stone === stone) &&
			(!range || (p.price >= range.min && p.price < range.max)),
	);

	switch (sort) {
		case "newest":
			return [...filtered].sort((a, b) =>
				b.created_at.localeCompare(a.created_at),
			);
		case "price-asc":
			return [...filtered].sort((a, b) => a.price - b.price);
		case "price-desc":
			return [...filtered].sort((a, b) => b.price - a.price);
		default:
			return filtered;
	}
}
