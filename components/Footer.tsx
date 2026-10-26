import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
	return (
		<footer className="w-full bg-(--card-wide) text-(--text-headline) border-t border-(--border-color) mt-24">
			<div className="max-w-screen-2xl mx-auto px-8 py-16 lg:py-20">
				{/* Top Grid: Newsletter + Navigation Columns */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-(--border-color)">
					{/* Brand & Newsletter Column (Spans 2 on desktop) */}
					<div className="lg:col-span-2 pr-0 lg:pr-12">
						<span className="font-primary text-xl font-bold tracking-widest uppercase block mb-4">
							BrandLogo
						</span>
						<p className="font-body text-sm text-(--text-muted) max-w-sm mb-6 leading-relaxed">
							Handcrafted heirlooms designed for modern longevity.
							Subscribe to receive private collection previews and
							editorial journals.
						</p>

						{/* Newsletter Signup Form */}
						<form className="relative max-w-sm flex items-center group">
							<input
								type="email"
								placeholder="Enter your email address"
								className="w-full bg-transparent border-b border-(--border-color) py-2 pr-8 text-sm text-(--text-headline) placeholder-(--text-muted) focus:outline-none focus:border-(--text-headline) transition-colors"
							/>
							<button
								type="submit"
								aria-label="Join private client list"
								className="absolute right-0 p-1 text-(--text-muted) hover:text-(--text-headline) transition-colors cursor-pointer"
							>
								<ArrowRight className="w-4 h-4 stroke-[1.5]" />
							</button>
						</form>
					</div>

					{/* Column 1: Client Care */}
					<div className="flex flex-col space-y-4">
						<span className="font-secondary text-xs uppercase tracking-widest text-(--text-headline) font-medium">
							Client Care
						</span>
						<ul className="flex flex-col space-y-3 font-body text-xs text-(--text-muted)">
							<li>
								<Link
									href="/concierge"
									className="hover:text-(--text-headline) transition-colors"
								>
									Concierge & Appointments
								</Link>
							</li>
							<li>
								<Link
									href="/ring-sizer"
									className="hover:text-(--text-headline) transition-colors"
								>
									Ring Size Guide
								</Link>
							</li>
							<li>
								<Link
									href="/shipping"
									className="hover:text-(--text-headline) transition-colors"
								>
									Insured Shipping & Delivery
								</Link>
							</li>
							<li>
								<Link
									href="/returns"
									className="hover:text-(--text-headline) transition-colors"
								>
									Returns & Lifetime Warranty
								</Link>
							</li>
							<li>
								<Link
									href="/care"
									className="hover:text-(--text-headline) transition-colors"
								>
									Jewelry Care & Cleaning
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 2: The Maison */}
					<div className="flex flex-col space-y-4">
						<span className="font-secondary text-xs uppercase tracking-widest text-(--text-headline) font-medium">
							The Maison
						</span>
						<ul className="flex flex-col space-y-3 font-body text-xs text-(--text-muted)">
							<li>
								<Link
									href="/about"
									className="hover:text-(--text-headline) transition-colors"
								>
									Our Philosophy
								</Link>
							</li>
							<li>
								<Link
									href="/sustainability"
									className="hover:text-(--text-headline) transition-colors"
								>
									Ethical Craft & Traceability
								</Link>
							</li>
							<li>
								<Link
									href="/materials"
									className="hover:text-(--text-headline) transition-colors"
								>
									Solid Gold & Lab Diamonds
								</Link>
							</li>
							<li>
								<Link
									href="/press"
									className="hover:text-(--text-headline) transition-colors"
								>
									Press & Editorial
								</Link>
							</li>
						</ul>
					</div>

					{/* Column 3: Boutiques & Services */}
					<div className="flex flex-col space-y-4">
						<span className="font-secondary text-xs uppercase tracking-widest text-(--text-headline) font-medium">
							Services
						</span>
						<ul className="flex flex-col space-y-3 font-body text-xs text-(--text-muted)">
							<li>
								<Link
									href="/custom"
									className="hover:text-(--text-headline) transition-colors"
								>
									Bespoke Commissions
								</Link>
							</li>
							<li>
								<Link
									href="/engraving"
									className="hover:text-(--text-headline) transition-colors"
								>
									Custom Engraving
								</Link>
							</li>
							<li>
								<Link
									href="/stores"
									className="hover:text-(--text-headline) transition-colors"
								>
									Locate a Boutique
								</Link>
							</li>
							<li>
								<Link
									href="/corporate"
									className="hover:text-(--text-headline) transition-colors"
								>
									Corporate Gifting
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar: Copyright, Region, Legal */}
				<div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-secondary tracking-wider text-(--text-muted) space-y-4 sm:space-y-0">
					<div>
						<span>© 2026 BrandLogo Inc. All rights reserved.</span>
					</div>

					{/* Region / Currency */}
					<div className="flex items-center space-x-6">
						<span className="hover:text-(--text-headline) cursor-pointer transition-colors">
							United States (USD $)
						</span>
						<Link
							href="/privacy"
							className="hover:text-(--text-headline) transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/terms"
							className="hover:text-(--text-headline) transition-colors"
						>
							Terms of Use
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
