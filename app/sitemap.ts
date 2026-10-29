import type { MetadataRoute } from "next";
import {
	getCategories,
	getCollectionSlugs,
	getProductSlugs,
} from "@/app/lib/data/products";
import { getSiteUrl } from "@/app/lib/site";

// Every public catalog page. Reuses the cached catalog fetchers, so it
// refreshes along with them when the catalog changes.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const base = getSiteUrl();
	const [categories, collectionSlugs, productSlugs] = await Promise.all([
		getCategories(),
		getCollectionSlugs(),
		getProductSlugs(),
	]);

	return [
		{ url: `${base}/`, changeFrequency: "weekly", priority: 1 },
		...categories.map((c) => ({
			url: `${base}/category/${c.slug}`,
			changeFrequency: "weekly" as const,
			priority: 0.8,
		})),
		...collectionSlugs.map((slug) => ({
			url: `${base}/collections/${slug}`,
			changeFrequency: "weekly" as const,
			priority: 0.7,
		})),
		...productSlugs.map((slug) => ({
			url: `${base}/product/${slug}`,
			changeFrequency: "weekly" as const,
			priority: 0.6,
		})),
	];
}
