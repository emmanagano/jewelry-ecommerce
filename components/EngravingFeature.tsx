"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { luxurySpring } from "@/app/lib/motion";

export default function EngravingFeature() {
	return (
		<section className="w-full bg-(--bg-base) py-16 lg:py-24 border-t border-(--border-color)">
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
					{/* Editorial Copy Block */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-40px" }}
						transition={luxurySpring}
						className="lg:col-span-5 flex flex-col justify-center items-start lg:pr-8"
					>
						<span className="font-secondary text-[10px] uppercase tracking-[0.3em] font-medium text-(--text-muted) mb-3 block">
							Atelier Personalization
						</span>

						<h2 className="font-primary text-3xl sm:text-4xl lg:text-5xl tracking-tight text-(--text-headline) leading-[1.12] mb-4">
							Gifts to Engrave
						</h2>

						<p className="font-body text-xs sm:text-[13px] text-(--text-muted) leading-relaxed max-w-md font-light mb-8">
							Inscribe initials, coordinates, or meaningful
							milestones onto solid 14k gold pendants and signets.
							Every stroke is hand-carved to transform fine
							jewelry into an enduring heirloom.
						</p>
					</motion.div>

					{/* Editorial Visual */}
					<motion.div
						initial={{ opacity: 0, scale: 0.98 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true, margin: "-40px" }}
						transition={{ ...luxurySpring, duration: 1.2 }}
						className="lg:col-span-7 relative aspect-4/3 sm:aspect-16/10 lg:aspect-16/10 max-h-120 w-full overflow-hidden border border-(--border-color) rounded-xs group bg-(--card-sub)"
					>
						<motion.div
							whileHover={{ scale: 1.04 }}
							transition={{
								duration: 1.6,
								ease: [0.25, 0.46, 0.45, 0.94],
							}}
							className="absolute inset-0"
						>
							<Image
								src="https://images.unsplash.com/photo-1779238226276-79d6cc60fdb1?q=80&w=1200&auto=format&fit=crop"
								alt="Bespoke hand-engraved gold pendant on textured paper"
								fill
								sizes="(min-width: 1024px) 58vw, 100vw"
								className="object-cover object-center"
							/>
						</motion.div>
						<div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />

						<div className="absolute bottom-4 left-4 pointer-events-none">
							<span className="font-secondary text-[9px] uppercase tracking-[0.25em] text-(--text-headline) bg-(--bg-base)/90 backdrop-blur-xs px-3 py-1.5 border border-(--border-color) rounded-xs shadow-xs">
								Bespoke Hand-Inscribed
							</span>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
