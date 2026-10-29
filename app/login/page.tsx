import React from "react";
import type { Metadata } from "next";
import { getCollection } from "@/app/lib/data/products";
import EditorialShowcase from "@/components/EditorialShowcase";
import GlassAuthCard from "@/components/GlassAuthCard";

export const metadata: Metadata = {
	title: "Client Account",
};

export default async function ClientLoginPage() {
	const featured = await getCollection("best-sellers").catch((error) => {
		console.error(error);
		return null;
	});
	return (
		// Full-bleed split: photo left (desktop only), form on the canvas right.
		// No fixed height, so the form can never be clipped.
		<div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-129px)] bg-(--bg-base)">
			<div className="hidden lg:block relative min-h-160">
				<EditorialShowcase products={featured?.products.slice(0, 6) ?? []} />
			</div>
			<div className="flex items-start lg:items-center justify-center px-4 sm:px-8 py-12 lg:py-20">
				<GlassAuthCard />
			</div>
		</div>
	);
}
