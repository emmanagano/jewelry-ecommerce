import type { Metadata } from "next";
import { Playfair_Display, Inter, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
	weight: ["400", "700"], // Roboto requires you to specify weights
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Your Store Name",
	description: "Your store description",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			// 2. Inject all three variables into the HTML
			className={`${fontPrimary.variable} ${fontSecondary.variable} ${fontBody.variable} h-full antialiased`}
		>
			<body>
				{/* 3. Navbar goes INSIDE the body, right above your page content */}
				<Navbar />
				<main className="grow">{children}</main>
			</body>
		</html>
	);
}
