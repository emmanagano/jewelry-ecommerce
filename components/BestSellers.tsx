import { getCollection } from "@/app/lib/data/products";
import BestSellersSlider from "./BestSellersSlider";

// Server component: the slider's products are part of the prerendered page
export default async function BestSellers() {
	// A homepage section shouldn't take the page down; hide it instead
	const result = await getCollection("best-sellers").catch((error) => {
		console.error(error);
		return null;
	});
	const products = result?.products ?? [];

	if (products.length === 0) return null;
	return <BestSellersSlider products={products} />;
}
