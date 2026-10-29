import EditorialSplit from "@/components/EditorialSplit";

export default function BrandStory() {
	return (
		<EditorialSplit
			image="https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?q=80&w=1400&auto=format&fit=crop"
			imageAlt="Jewelry being finished by hand in the atelier"
			caption="Behind the Atelier"
			eyebrow="Modern Longevity"
			title={
				<>
					Pieces sculpted for daily wear,{" "}
					<span className="italic">cherished for generations.</span>
				</>
			}
		>
			<p>
				We reject seasonal disposability. Every silhouette begins in our
				sketch atelier, balancing architectural weight, ergonomic comfort
				and light refraction before casting.
			</p>
			<p>
				By pairing recycled solid gold with precision lab-grown
				solitaires, we create heirloom-grade pieces with complete
				traceability from stone to setting.
			</p>
		</EditorialSplit>
	);
}
