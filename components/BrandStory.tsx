"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Sparkles, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { luxurySpring } from "@/app/lib/motion";

export default function BrandStory() {
	return (
		<div className="w-full bg-(--bg-base)">
			{/* 1. Value Proposition Strip */}
			<section className="w-full border-y border-(--border-color) py-8 px-4 sm:px-8">
				<div className="max-w-screen-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
					<div className="flex flex-col items-center space-y-1.5">
						<Sparkles className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="font-secondary text-[10px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Solid & Recycled Gold
						</h4>
						<p className="font-body text-[11px] text-(--text-muted) max-w-44 leading-relaxed font-light">
							Handcrafted exclusively in certified 14k and 18k
							solid gold.
						</p>
					</div>

					<div className="flex flex-col items-center space-y-1.5">
						<ShieldCheck className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="font-secondary text-[10px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Conflict-Free Stones
						</h4>
						<p className="font-body text-[11px] text-(--text-muted) max-w-44 leading-relaxed font-light">
							Responsibly sourced lab-grown diamonds and natural
							pearls.
						</p>
					</div>

					<div className="flex flex-col items-center space-y-1.5">
						<Truck className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="font-secondary text-[10px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Insured Delivery
						</h4>
						<p className="font-body text-[11px] text-(--text-muted) max-w-44 leading-relaxed font-light">
							Signature required, complimentary on all fine
							jewelry orders.
						</p>
					</div>

					<div className="flex flex-col items-center space-y-1.5">
						<RotateCcw className="w-4 h-4 text-(--text-muted) stroke-[1.25]" />
						<h4 className="font-secondary text-[10px] uppercase tracking-[0.25em] font-semibold text-(--text-headline)">
							Lifetime Guarantee
						</h4>
						<p className="font-body text-[11px] text-(--text-muted) max-w-44 leading-relaxed font-light">
							Bespoke sizing, annual prong inspection, and polish
							care.
						</p>
					</div>
				</div>
			</section>

			{/* 2. Editorial Compact Brand Feature */}
			<section className="w-full px-4 sm:px-8 py-12 lg:py-16 max-w-screen-2xl mx-auto">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
					{/* Editorial Photography - Controlled scale with max height */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-40px" }}
						transition={luxurySpring}
						className="lg:col-span-5 relative aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 max-h-110 overflow-hidden border border-(--border-color) rounded-xs group"
					>
						<motion.div
							whileHover={{ scale: 1.05 }}
							transition={{
								duration: 1.5,
								ease: [0.25, 0.46, 0.45, 0.94],
							}}
							className="absolute inset-0"
						>
							<Image
								src="https://images.unsplash.com/photo-1616837874254-8d5aaa63e273?q=80&w=1200&auto=format&fit=crop"
								alt="The Atelier Craftsmanship"
								fill
								sizes="(min-width: 1024px) 40vw, 100vw"
								className="object-cover object-center"
							/>
						</motion.div>
						<div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
						<span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs font-secondary text-[9px] uppercase tracking-[0.25em] text-(--text-headline) font-medium px-2.5 py-1 border border-black/5 shadow-xs">
							Behind the Atelier
						</span>
					</motion.div>

					{/* Editorial Copy */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-40px" }}
						transition={{ ...luxurySpring, delay: 0.1 }}
						className="lg:col-span-7 flex flex-col justify-center space-y-5 lg:pl-4"
					>
						<span className="font-secondary text-[10px] uppercase tracking-[0.3em] font-medium text-(--text-muted) block">
							Modern Longevity
						</span>

						<h2 className="font-primary text-2xl sm:text-3xl lg:text-4xl tracking-tight text-(--text-headline) leading-[1.18]">
							Pieces sculpted for daily wear, <br />
							<span className="italic font-normal">
								cherished for generations.
							</span>
						</h2>

						<div className="space-y-3.5 font-body text-xs sm:text-[13px] text-(--text-muted) leading-relaxed max-w-lg font-light">
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
					</motion.div>
				</div>
			</section>
		</div>
	);
}
