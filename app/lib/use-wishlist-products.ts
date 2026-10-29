"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/context/StoreContext";
import { supabase } from "@/app/lib/supabase";
import {
	PRODUCT_SUMMARY_COLUMNS,
	type ProductSummary,
} from "@/app/lib/products";

// The liked products' catalog data, most recently liked first. While a
// change reloads, already-loaded products stay visible (minus any unliked).
export function useWishlistProducts() {
	const { wishlist, isHydrated } = useStore();
	const [loaded, setLoaded] = useState<{
		key: string;
		products: ProductSummary[];
	} | null>(null);
	const key = wishlist.join(",");

	useEffect(() => {
		if (!isHydrated || !key) return;
		const ids = key.split(",");
		let active = true;

		supabase
			.from("products")
			.select(PRODUCT_SUMMARY_COLUMNS)
			.in("id", ids)
			.overrideTypes<ProductSummary[], { merge: false }>()
			.then(({ data, error }) => {
				if (!active) return;
				if (error) {
					console.error("Failed to load saved pieces:", error.message);
				}
				const position = new Map(ids.map((id, i) => [id, i]));
				const products = [...(data ?? [])].sort(
					(a, b) => (position.get(b.id) ?? 0) - (position.get(a.id) ?? 0),
				);
				setLoaded({ key, products });
			});

		return () => {
			active = false;
		};
	}, [key, isHydrated]);

	const products = (loaded?.products ?? []).filter((p) =>
		wishlist.includes(p.id),
	);
	const isLoading =
		!isHydrated || (wishlist.length > 0 && loaded === null);

	return { products, isLoading };
}
