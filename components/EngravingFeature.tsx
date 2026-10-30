import EditorialSplit from "@/components/EditorialSplit";
import Button from "@/components/ui/Button";

export default function EngravingFeature() {
	return (
		<EditorialSplit
			reverse
			image="https://images.pexels.com/photos/4938199/pexels-photo-4938199.jpeg?auto=compress&cs=tinysrgb&w=1600"
			imageAlt="Engraved gold medallion pendant resting on an open book"
			caption="Hand-inscribed"
			eyebrow="Complimentary engraving"
			title="Chosen once. Treasured for generations."
			action={
				<Button href="/collections/gifts" variant="link">
					Discover Gifts
				</Button>
			}
		>
			<p>
				Inscribe initials, a date or a few words onto 18k gold pendants and
				bands, complimentary with every piece. Each stroke is made by hand
				to turn a gift into an heirloom.
			</p>
		</EditorialSplit>
	);
}
