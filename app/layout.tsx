import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthProvider } from "../context/AuthContext";
import { StoreProvider } from "../context/StoreContext";
import { getCategories } from "./lib/data/products";

const serifFont = Playfair_Display({
	variable: "--font-serif",
	subsets: ["latin"],
});

const sansFont = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "BrandLogo | Fine Jewelry & Heirlooms",
		template: "%s | BrandLogo",
	},
	description: "Handcrafted fine jewelry designed for modern longevity.",
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

	return (
		<html
			lang="en"
			className={`${serifFont.variable} ${sansFont.variable} h-full antialiased`}
		>
			<body className="font-sans min-h-full flex flex-col bg-(--bg-base) text-(--text-headline)">
				<AuthProvider>
					<StoreProvider>
						<Navbar
							categories={categories.map(({ slug, name }) => ({ slug, name }))}
						/>
						<main className="grow">{children}</main>
						<Footer />
					</StoreProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
