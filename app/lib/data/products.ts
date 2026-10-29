import { cacheLife, cacheTag } from "next/cache";
import { supabase } from "@/app/lib/supabase";
import {
	PRODUCT_DETAIL_COLUMNS,
	PRODUCT_SUMMARY_COLUMNS,
	type Category,
	type Collection,
	type Product,
	type ProductSummary,
} from "@/app/lib/products";

// Server-only, cached catalog queries. Entries are tagged so a future admin
// action can refresh them with revalidateTag("products") / ("categories") /
// ("collections").
//
// Failed queries throw instead of returning empty results: a thrown error is
// not cached, so a brief Supabase outage can't blank the catalog for the whole
// cache lifetime. Callers that can degrade gracefully catch it themselves.

function queryFailed(what: string, message: string): never {
	throw new Error(`Error fetching ${what}: ${message}`);
}

export async function getCategories() {
	"use cache";
	cacheLife("hours");
	cacheTag("categories");

	const { data, error } = await supabase
		.from("categories")
		.select("id, slug, name, description, banner_image, size_label, sort_order")
		.order("sort_order")
		.overrideTypes<Category[], { merge: false }>();

	if (error) queryFailed("categories", error.message);
	return data ?? [];
}

export async function getCategory(slug: string) {
	const categories = await getCategories();
	return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProductSlugs() {
	"use cache";
	cacheLife("hours");
	cacheTag("products");

	const { data, error } = await supabase
		.from("products")
		.select("slug")
		.overrideTypes<Pick<Product, "slug">[], { merge: false }>();

	if (error) queryFailed("product slugs", error.message);
	return (data ?? []).map((p) => p.slug);
}

export async function getProductBySlug(slug: string) {
	"use cache";
	cacheLife("hours");
	cacheTag("products", `product:${slug}`);

	const { data, error } = await supabase
		.from("products")
		.select(PRODUCT_DETAIL_COLUMNS)
		.eq("slug", slug)
		.maybeSingle();

	if (error) queryFailed(`product "${slug}"`, error.message);
	return data as Product | null;
}

// Newest first; listings re-sort on the client when a sort is chosen
export async function getProductsByCategory(categorySlug: string) {
	"use cache";
	cacheLife("hours");
	cacheTag("products", `category:${categorySlug}`);

	const { data, error } = await supabase
		.from("products")
		.select(PRODUCT_SUMMARY_COLUMNS)
		.eq("category.slug", categorySlug)
		.order("created_at", { ascending: false })
		.overrideTypes<ProductSummary[], { merge: false }>();

	if (error) queryFailed(`"${categorySlug}" products`, error.message);
	return data ?? [];
}

export async function getCollectionSlugs() {
	"use cache";
	cacheLife("hours");
	cacheTag("collections");

	const { data, error } = await supabase
		.from("collections")
		.select("slug")
		.overrideTypes<Pick<Collection, "slug">[], { merge: false }>();

	if (error) queryFailed("collection slugs", error.message);
	return (data ?? []).map((c) => c.slug);
}

// A collection and its products in curated order, or null if it doesn't exist
export async function getCollection(slug: string) {
	"use cache";
	cacheLife("hours");
	cacheTag("collections", "products", `collection:${slug}`);

	const { data, error } = await supabase
		.from("collections")
		.select(
			`id, slug, name, description, banner_image, items:product_collections(position, product:products!inner(${PRODUCT_SUMMARY_COLUMNS}))`,
		)
		.eq("slug", slug)
		.maybeSingle();

	if (error) queryFailed(`collection "${slug}"`, error.message);
	if (!data) return null;

	const { items, ...collection } = data as unknown as Collection & {
		items: { position: number; product: ProductSummary }[];
	};
	const products = [...items]
		.sort((a, b) => a.position - b.position)
		.map((item) => item.product);

	return { collection: collection as Collection, products };
}

export async function searchProducts(query: string) {
	"use cache";
	cacheLife("minutes");
	cacheTag("products");

	const { data, error } = await supabase
		.from("products")
		.select(PRODUCT_SUMMARY_COLUMNS)
		.textSearch("search", query, { type: "websearch", config: "english" })
		.overrideTypes<ProductSummary[], { merge: false }>();

	if (error) queryFailed(`search results for "${query}"`, error.message);
	return data ?? [];
}

export interface SizeOption {
	categorySlug: string;
	categoryName: string;
	sizeLabel: string;
	sizes: string[];
}

// Size choices per sized category (e.g. Ring Size: 4–10), from the variants
// actually in the catalog. One-size categories (no size_label) are left out.
export async function getSizeOptions(): Promise<SizeOption[]> {
	"use cache";
	cacheLife("hours");
	cacheTag("categories", "products");

	const { data, error } = await supabase
		.from("categories")
		.select("slug, name, size_label, sort_order, products(variants:product_variants(size, sort_order))")
		.not("size_label", "is", null)
		.order("sort_order")
		.overrideTypes<
			{
				slug: string;
				name: string;
				size_label: string;
				products: { variants: { size: string; sort_order: number }[] }[];
			}[],
			{ merge: false }
		>();

	if (error) queryFailed("size options", error.message);

	return (data ?? []).map((category) => {
		const order = new Map<string, number>();
		category.products
			.flatMap((p) => p.variants)
			.forEach((v) => {
				order.set(v.size, Math.min(order.get(v.size) ?? Infinity, v.sort_order));
			});
		return {
			categorySlug: category.slug,
			categoryName: category.name,
			sizeLabel: category.size_label,
			sizes: [...order.entries()]
				.sort((a, b) => a[1] - b[1])
				.map(([size]) => size),
		};
	});
}
