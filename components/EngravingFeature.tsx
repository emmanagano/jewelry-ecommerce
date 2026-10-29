import EditorialSplit from "@/components/EditorialSplit";
import Button from "@/components/ui/Button";

export default function EngravingFeature() {
	return (
		<EditorialSplit
			reverse
			image="https://images.unsplash.com/photo-1779238226276-79d6cc60fdb1?q=80&w=1400&auto=format&fit=crop"
			imageAlt="Hand-engraved gold pendant on textured paper"
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
