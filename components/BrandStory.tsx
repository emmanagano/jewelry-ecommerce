import EditorialSplit from "@/components/EditorialSplit";

export default function BrandStory() {
	return (
		<EditorialSplit
			image="https://images.pexels.com/photos/10457796/pexels-photo-10457796.jpeg?auto=compress&cs=tinysrgb&w=1600"
			imageAlt="Gold earrings and a fine chain on cream fur in soft light"
			caption="The Golden Pearl"
			eyebrow="Four years in the making"
			title={
				<>
					Grown for four years,{" "}
					<span className="italic">chosen in a moment.</span>
				</>
			}
		>
			<p>
				A pearl grows slowly, in warm water, tended by hand. We make
				fewer pieces, finish each one by hand, and sign it with the
				artisan&rsquo;s mark.
			</p>
			<p>
				Recycled 18k gold, traceable diamonds and pearls with a
				documented origin: every piece is made to be passed down.
			</p>
		</EditorialSplit>
	);
}
