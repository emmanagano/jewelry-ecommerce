// Shapes of the catalog tables in Supabase
// (see supabase/migrations/20261030000001_catalog_structure.sql)

export interface Category {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	banner_image: string | null;
	size_label: string | null;
	sort_order: number;
}

export interface Collection {
	id: string;
	slug: string;
	name: string;
	description: string | null;
	banner_image: string | null;
}

export interface Variant {
	id: string;
	size: string;
	sort_order: number;
	stock: number | null; // null = not tracked
	price_override: number | null; // cents
}

// A product with everything the detail page needs
export interface Product {
	id: string;
	name: string;
	slug: string;
	subtitle: string | null;
	badge: string | null;
	price: number; // cents
	images: string[] | null;
	description: string | null;
	metal: string | null;
	stone: string | null;
	materials_care: string | null;
	created_at: string;
	category: Pick<Category, "slug" | "name" | "size_label">;
	variants: Variant[];
}

// The subset needed to render, filter and sort a ProductCard
export type ProductSummary = Pick<
	Product,
	| "id"
	| "name"
	| "slug"
	| "subtitle"
	| "badge"
	| "price"
	| "images"
	| "metal"
	| "stone"
	| "created_at"
> & {
	category: Pick<Category, "slug" | "name">;
	variants: Pick<Variant, "id" | "size" | "sort_order" | "price_override">[];
};

// `!inner` makes the category join required, which lets queries filter on it
export const PRODUCT_SUMMARY_COLUMNS =
	"id, name, slug, subtitle, badge, price, images, metal, stone, created_at, category:categories!inner(slug, name), variants:product_variants(id, size, sort_order, price_override)";

export const PRODUCT_DETAIL_COLUMNS =
	"id, name, slug, subtitle, badge, price, images, description, metal, stone, materials_care, created_at, category:categories!inner(slug, name, size_label), variants:product_variants(id, size, sort_order, stock, price_override)";

export const ONE_SIZE = "Standard";

// Variants arrive unordered from the join; sort them for display
export function sortVariants<T extends Pick<Variant, "sort_order">>(
	variants: T[],
) {
	return [...variants].sort((a, b) => a.sort_order - b.sort_order);
}

export function getSizes(variants: Pick<Variant, "size" | "sort_order">[]) {
	const sizes = sortVariants(variants).map((v) => v.size);
	return sizes.length > 0 ? sizes : [ONE_SIZE];
}
