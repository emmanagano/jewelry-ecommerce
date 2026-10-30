import type { Metadata } from "next";

// The saved-pieces page is a Client Component, so its title lives here
export const metadata: Metadata = {
	title: "Saved Pieces",
	robots: { index: false },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
	return children;
}
