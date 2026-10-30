import type { Metadata } from "next";
import EditorialSplit from "@/components/EditorialSplit";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE_NAME, SITE_TAGLINE } from "@/app/lib/site";

export const metadata: Metadata = {
	title: "The House",
	description: `The story of ${SITE_NAME}: golden pearls, recycled 18k gold and traceable diamonds, made by hand to be passed down.`,
};

const PEXELS = "?auto=compress&cs=tinysrgb&w=1600";

export default function TheHousePage() {
	return (
		<>
			<section className="max-w-3xl mx-auto px-4 sm:px-8 pt-20 lg:pt-28 pb-6 text-center">
				<SectionHeading
					as="h1"
					align="center"
					eyebrow="The House"
					title="Some treasures are found. Others are waited for."
				/>
				<p className="text-copy text-(--text-body) text-balance">
					A golden pearl takes up to four years to grow, in warm, clean
					water, inside a single oyster tended by hand. Most never reach
					the colour of deep gold. Fewer still are round.
				</p>
			</section>

			<EditorialSplit
				image={`https://images.pexels.com/photos/23495776/pexels-photo-23495776.jpeg${PEXELS}`}
				imageAlt="Gold and pearl earrings resting on ivory silk"
				caption="Our beginning"
				eyebrow="Why we began"
				title={
					<>
						We wanted to tell the story{" "}
						<span className="italic">the pearl never told.</span>
					</>
				}
			>
				<p>
					{SITE_NAME} began with a simple belief: the most precious
					jewelry is not the loudest, but the most deeply made. We work
					with pearl farms, with refiners of recycled 18k gold, and with
					diamond suppliers who can trace every stone to its mine.
				</p>
				<p>
					Then we hand the materials to artisans who spend weeks on a
					single piece. The result holds light the way memory holds a
					moment.
				</p>
			</EditorialSplit>

			<EditorialSplit
				reverse
				image={`https://images.pexels.com/photos/36823005/pexels-photo-36823005.jpeg${PEXELS}`}
				imageAlt="Gold huggies with a pearl each, on a cream tray"
				caption="The Golden Pearl"
				eyebrow="The signature"
				title="Four years in the making."
			>
				<p>
					We look for three things: depth of colour, a mirror-like
					lustre, and a surface that holds the light without
					distraction. The pearls that do not meet our standard are
					returned.
				</p>
				<p>
					Each one we choose is set in gold, numbered, and matched by
					eye over many hours.
				</p>
			</EditorialSplit>

			<EditorialSplit
				image={`https://images.pexels.com/photos/4938199/pexels-photo-4938199.jpeg${PEXELS}`}
				imageAlt="An engraved gold medallion resting on an open book"
				caption="The Craft"
				eyebrow="By hand"
				title="One hundred hours. One pair of hands."
			>
				<p>
					Every piece is finished by hand and signed with the
					artisan&rsquo;s mark, engraved where only you will know it is
					there.
				</p>
				<p>
					Inscriptions are complimentary, and every creation is packed
					in its signature box and closed with a wax seal.
				</p>
			</EditorialSplit>

			<EditorialSplit
				reverse
				image={`https://images.pexels.com/photos/23495777/pexels-photo-23495777.jpeg${PEXELS}`}
				imageAlt="Gold cameo earrings with pearl drops on champagne silk"
				caption="Provenance"
				eyebrow="Traceable to the oyster"
				title="A name, a number, and a story."
			>
				<p>
					Every piece comes with a Certificate of Provenance naming its
					pearls, its gold source and the hands that made it. Lifetime
					care means complimentary cleaning and polishing, for as long
					as you own it.
				</p>
			</EditorialSplit>

			<section className="max-w-3xl mx-auto px-4 sm:px-8 py-20 lg:py-28 text-center flex flex-col items-center">
				<h2 className="font-serif text-title tracking-tight text-(--text-headline)">
					{SITE_TAGLINE}
				</h2>
				<p className="mt-4 text-copy text-(--text-body)">
					Made once. Kept forever.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Button href="/collections/lumiere">Discover Lumi&egrave;re</Button>
					<Button href="/" variant="secondary">
						Discover the Collections
					</Button>
				</div>
			</section>
		</>
	);
}
