import { RotateCcw, ScrollText, ShieldCheck, Sparkles } from "lucide-react";

const PROMISES = [
	{ icon: Sparkles, title: "Recycled 18k Gold", text: "Never plated. Finished by hand." },
	{ icon: ShieldCheck, title: "Traceable Stones", text: "Natural diamonds and pearls with a documented origin." },
	{ icon: ScrollText, title: "Certificate of Provenance", text: "Every piece is numbered and named." },
	{ icon: RotateCcw, title: "Lifetime Care", text: "Complimentary cleaning and polishing." },
];

// Slim strip of brand promises under the hero
export default function TrustBar() {
	return (
		<section aria-label="The Vaelore promise" className="border-b border-(--border-color)">
			<ul className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
				{PROMISES.map(({ icon: Icon, title, text }) => (
					<li key={title} className="flex items-start gap-3">
						<Icon className="w-5 h-5 mt-0.5 shrink-0 stroke-[1.25] text-(--accent)" />
						<div>
							<p className="text-label uppercase text-(--text-headline)">{title}</p>
							<p className="mt-1 text-copy-sm text-(--text-muted)">{text}</p>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}
