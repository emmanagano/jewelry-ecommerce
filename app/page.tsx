// import Image from "next/image";

import BestSellers from "@/components/BestSellers";
import Hero from "../components/Hero";
import BrandStory from "@/components/BrandStory";

export default function Home() {
	return (
		<div>
			<Hero />
			<BestSellers />
			<BrandStory />
		</div>
	);
}
