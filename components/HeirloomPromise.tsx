import EditorialSplit from "@/components/EditorialSplit";
import Button from "@/components/ui/Button";

export default function HeirloomPromise() {
	return (
		<EditorialSplit
			image="https://images.pexels.com/photos/23495777/pexels-photo-23495777.jpeg?auto=compress&cs=tinysrgb&w=1600"
			imageAlt="Gold cameo earrings with pearl drops on champagne silk"
			caption="The Heirloom Promise"
			eyebrow="Made once. Kept forever."
			title="An heirloom is not a purchase. It is a beginning."
			action={
				<Button href="/the-house" variant="link">
					The House
				</Button>
			}
		>
			<p>
				Every piece comes with a Certificate of Provenance, lifetime care
				and complimentary engraving.
			</p>
		</EditorialSplit>
	);
}
