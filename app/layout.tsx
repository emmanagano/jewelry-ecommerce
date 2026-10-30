import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";
import { StoreProvider } from "../context/StoreContext";
import MotionProvider from "../components/MotionProvider";
import { getCategories } from "./lib/data/products";
import {
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_TAGLINE,
	getSiteUrl,
} from "./lib/site";

const serifFont = Playfair_Display({
	variable: "--font-serif",
	subsets: ["latin"],
});

const sansFont = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	// Lets pages use relative URLs for canonical links and social images
	metadataBase: new URL(getSiteUrl()),
	title: {
		default: `${SITE_NAME} | ${SITE_TAGLINE}`,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	applicationName: SITE_NAME,
	openGraph: {
		type: "website",
		siteName: SITE_NAME,
		locale: "en_US",
	},
	twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
	// Browser chrome matches the Pearl White canvas (--bg-base)
	themeColor: "#f6f2ea",
	// Lets sticky bottom bars pad for the iPhone home indicator
	viewportFit: "cover",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// The nav degrades to its fixed links rather than taking the site down
	const categories = await getCategories().catch((error) => {
		console.error(error);
		return [];
	});

	const navCategories = categories.map(({ slug, name }) => ({ slug, name }));

	return (
		<html
			lang="en"
			className={`${serifFont.variable} ${sansFont.variable} h-full antialiased`}
		>
			<body className="font-sans min-h-full flex flex-col bg-(--bg-base) text-(--text-headline)">
				<MotionProvider>
					<AuthProvider>
						<StoreProvider>
							<a href="#main" className="skip-link">
								Skip to content
							</a>
							<Navbar categories={navCategories} />
							<main id="main" className="grow">{children}</main>
							<Footer categories={navCategories} />
						</StoreProvider>
					</AuthProvider>
				</MotionProvider>
			</body>
		</html>
	);
}
