"use client";

import React from "react";
import Link from "next/link";
import {
	ArrowRight,
	ShieldCheck,
	Sparkles,
	Truck,
	RotateCcw,
} from "lucide-react";

export default function BrandStory() {
	return (
		<div className="w-full bg-(--bg-base)">
			{/* 1. Value Proposition Strip */}
			<section className="w-full border-y border-(--border-color) py-10 px-4 sm:px-8">
				<div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
					<div className="flex flex-col items-center space-y-2">
						<Sparkles className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Solid & Recycled Gold
						</h4>
						<p className="text-[11px] text-(--text-muted) max-w-50 leading-relaxed">
							Handcrafted exclusively in certified 14k and 18k
							solid gold.
						</p>
					</div>

					<div className="flex flex-col items-center space-y-2">
						<ShieldCheck className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Conflict-Free Stones
						</h4>
						<p className="text-[11px] text-(--text-muted) max-w-50 leading-relaxed">
							Responsibly sourced lab-grown diamonds and natural
							pearls.
						</p>
					</div>

					<div className="flex flex-col items-center space-y-2">
						<Truck className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Insured Delivery
						</h4>
						<p className="text-[11px] text-(--text-muted) max-w-50 leading-relaxed">
							Signature required, complimentary on all fine
							jewelry orders.
						</p>
					</div>

					<div className="flex flex-col items-center space-y-2">
						<RotateCcw className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="text-[11px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Lifetime Guarantee
						</h4>
						<p className="text-[11px] text-(--text-muted) max-w-50 leading-relaxed">
							Bespoke sizing, annual prong inspection, and polish
							care.
						</p>
					</div>
				</div>
			</section>

			{/* 2. Editorial 50/50 Brand Feature */}
			<section className="w-full px-4 sm:px-8 py-20 lg:py-28 max-w-screen-2xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Editorial Photography */}
					<div className="lg:col-span-6 relative aspect-4/5 sm:aspect-5/4 lg:aspect-4/5 overflow-hidden border border-(--border-color) rounded-xs group">
						<img
							src="https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?q=80&w=1200&auto=format&fit=crop"
							alt="The Atelier Craftsmanship"
							className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
						<span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs text-[9px] uppercase tracking-[0.25em] text-(--text-headline) font-medium px-3 py-1.5 border border-black/5 shadow-xs">
							Behind the Atelier
						</span>
					</div>

					{/* Editorial Copy */}
					<div className="lg:col-span-6 flex flex-col justify-center lg:pr-8 space-y-6">
						<span className="text-[10px] uppercase tracking-[0.3em] font-medium text-(--text-muted) block">
							Modern Longevity
						</span>

						<h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-(--text-headline) leading-[1.15]">
							Pieces sculpted for daily wear, <br />
							<span className="italic font-normal">
								cherished for generations.
							</span>
						</h2>

						<div className="space-y-4 text-xs sm:text-sm text-(--text-muted) leading-relaxed max-w-lg font-light">
							<p>
								We reject seasonal disposability. Every
								silhouette begins in our sketch
								atelier—balancing architectural weight,
								ergonomic comfort, and light refraction before
								casting.
							</p>
							<p>
								By pairing recycled solid gold with precision
								lab-grown solitaires, we create heirloom-grade
								pieces with complete traceability from stone to
								setting.
							</p>
						</div>

						{/* Action */}
						<div className="pt-4">
							<Link
								href="/coming-soon?feature=about-maison"
								className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-semibold text-(--text-headline) pb-1 border-b border-(--text-headline) hover:opacity-60 transition-opacity"
							>
								<span>Read The Maison Journal</span>
								<ArrowRight
									size={13}
									className="transition-transform group-hover:translate-x-1"
								/>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
