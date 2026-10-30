import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/app/lib/data/products";
import SectionHeading from "@/components/ui/SectionHeading";

// "Shop by category" tiles, driven by the categories table
export default async function CategoryTiles() {
	const categories = await getCategories().catch((error) => {
		console.error(error);
		return [];
	});
	if (categories.length === 0) return null;

	return (
		<section className="max-w-screen-2xl mx-auto px-4 sm:px-8 pt-20 lg:pt-28">
			<SectionHeading eyebrow="The Collections" title="Discover by Piece" />
			<ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{categories.map((category) => (
					<li key={category.slug}>
						<Link href={`/category/${category.slug}`} className="group block">
							<div className="relative aspect-3/4 overflow-hidden rounded-xs bg-(--card-sub)">
								{category.banner_image && (
									<Image
										src={category.banner_image}
										alt={category.name}
										fill
										sizes="(min-width: 1024px) 25vw, 50vw"
										className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
									/>
								)}
							</div>
							<div className="mt-4 flex items-center justify-between gap-2">
								<span className="font-serif text-lg sm:text-xl text-(--text-headline) group-hover:text-(--accent) transition-colors">
									{category.name}
								</span>
								<span className="text-label uppercase text-(--text-muted) group-hover:text-(--text-headline) transition-colors">
									Discover
								</span>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
