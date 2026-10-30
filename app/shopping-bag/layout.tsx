import type { Metadata } from "next";

// The bag page is a Client Component, so its title lives here
export const metadata: Metadata = {
	title: "Your Bag",
	robots: { index: false },
};

export default function ShoppingBagLayout({ children }: { children: React.ReactNode }) {
	return children;
}
