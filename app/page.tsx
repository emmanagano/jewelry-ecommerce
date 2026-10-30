import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import CategoryTiles from "@/components/CategoryTiles";
import BestSellers from "@/components/BestSellers";
import BrandStory from "@/components/BrandStory";
import EngravingFeature from "@/components/EngravingFeature";
import HeirloomPromise from "@/components/HeirloomPromise";

export default function Home() {
	return (
		<div>
			<Hero />
			<TrustBar />
			<CategoryTiles />
			<BestSellers />
			<BrandStory />
			<EngravingFeature />
			<HeirloomPromise />
		</div>
	);
}
