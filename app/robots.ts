import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/app/lib/site";

// Keep crawlers on the catalog; personal, transactional and placeholder
// pages aren't useful search results
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: [
				"/account",
				"/auth/",
				"/api/",
				"/login",
				"/forgot-password",
				"/reset-password",
				"/shopping-bag",
				"/checkout",
				"/orders/",
				"/my-wishlist",
				"/search",
				"/coming-soon",
			],
		},
		sitemap: `${getSiteUrl()}/sitemap.xml`,
	};
}
