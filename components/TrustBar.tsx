import { RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";

const PROMISES = [
	{ icon: Sparkles, title: "Recycled Solid Gold", text: "Certified 14k and 18k, never plated." },
	{ icon: ShieldCheck, title: "Conflict-Free Stones", text: "Lab-grown diamonds and natural pearls." },
	{ icon: Truck, title: "Insured Delivery", text: "Complimentary on fine jewelry." },
	{ icon: RotateCcw, title: "Lifetime Care", text: "Resizing, inspection and polishing." },
];

// Slim strip of brand promises under the hero
export default function TrustBar() {
	return (
		<section aria-label="Our promises" className="border-b border-(--border-color)">
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
