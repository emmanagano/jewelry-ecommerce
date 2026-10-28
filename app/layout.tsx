import type { Metadata } from "next";
import { Playfair_Display, Inter, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { StoreProvider } from "../context/StoreContext";

// 1. Configure your three fonts
const fontPrimary = Playfair_Display({
	variable: "--font-primary",
	subsets: ["latin"],
});

const fontSecondary = Inter({
	variable: "--font-secondary",
	subsets: ["latin"],
});

const fontBody = Roboto({
	variable: "--font-body",
	weight: ["400", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "BrandLogo | Fine Jewelry & Heirlooms",
	description: "Handcrafted fine jewelry designed for modern longevity.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${fontPrimary.variable} ${fontSecondary.variable} ${fontBody.variable} h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-(--bg-base) text-(--text-headline)">
				<StoreProvider>
					<Navbar />
					<main className="grow">{children}</main>
					<Footer />
				</StoreProvider>
			</body>
		</html>
	);
}
