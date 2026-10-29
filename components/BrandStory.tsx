import EditorialSplit from "@/components/EditorialSplit";

export default function BrandStory() {
	return (
		<EditorialSplit
			image="https://images.pexels.com/photos/5984625/pexels-photo-5984625.jpeg?auto=compress&cs=tinysrgb&w=1600"
			imageAlt="A fine gold chain worn with an open white shirt"
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
