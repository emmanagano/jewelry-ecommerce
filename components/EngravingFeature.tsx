import EditorialSplit from "@/components/EditorialSplit";
import Button from "@/components/ui/Button";

export default function EngravingFeature() {
	return (
		<EditorialSplit
			reverse
			image="https://images.pexels.com/photos/4938199/pexels-photo-4938199.jpeg?auto=compress&cs=tinysrgb&w=1600"
			imageAlt="Engraved gold medallion pendant resting on an open book"
			caption="Bespoke Hand-Inscribed"
			eyebrow="Atelier Personalization"
			title="Gifts to Engrave"
			action={
				<Button href="/collections/gifts" variant="link">
					Shop Gifts
				</Button>
			}
		>
			<p>
				Inscribe initials, coordinates or meaningful milestones onto
				solid 14k gold pendants and signets. Every stroke is hand-carved
				to turn fine jewelry into an enduring heirloom.
			</p>
		</EditorialSplit>
	);
}
