// Site-wide identity. Change the brand here and it updates the page titles,
// Navbar, Footer, social preview image and structured data.
export const SITE_NAME = "Maison Vaelore";
export const SITE_TAGLINE = "Light, kept.";
export const SITE_DESCRIPTION =
	"Modern heirlooms from rare golden South Sea pearls, recycled 18k gold and traceable diamonds. Each piece is made by hand and meant to be passed down.";

// The public origin, used for absolute URLs (sitemap, robots, social
// previews). Set NEXT_PUBLIC_SITE_URL in production; on Vercel the
// production domain is used automatically if it isn't set.
export function getSiteUrl() {
	const configured =
		process.env.NEXT_PUBLIC_SITE_URL ??
		(process.env.VERCEL_PROJECT_PRODUCTION_URL
			? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
			: "http://localhost:3000");
	return configured.replace(/\/+$/, "");
}
