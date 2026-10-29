"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

// Our standard "Quiet Luxury" physics
const luxurySpring = {
	type: "spring" as const,
	damping: 30,
	stiffness: 100,
	mass: 0.8,
};

// Stagger sequence for the Bento grid tiles
const staggerContainer = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
			delayChildren: 0.1,
		},
	},
};

// Gentle fade-and-slide up for each individual block
const blockEntrance = {
	hidden: { opacity: 0, y: 30 },
	show: { opacity: 1, y: 0, transition: { ...luxurySpring, duration: 1.2 } },
};

export default function Hero() {
	return (
		<section className="w-full px-4 sm:px-8 py-6 h-auto lg:h-[82vh] min-h-160 bg-(--bg-base)">
			{/* Main Bento Grid */}
			<motion.div
				variants={staggerContainer}
				initial="hidden"
				animate="show"
				className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full w-full max-w-screen-2xl mx-auto"
			>
				{/* ============================================================== */}
				{/* LEFT BLOCK: Main Campaign (Silk & Warm Gold Heirlooms) (7 cols) */}
				{/* ============================================================== */}
				<motion.div
					variants={blockEntrance}
					className="lg:col-span-7 h-120 lg:h-full"
				>
					<Link
						href="/coming-soon?feature=new-and-featured"
						className="w-full h-full border border-(--border-color) relative overflow-hidden group block rounded-xs"
					>
						{/* Editorial Background Image */}
						<motion.img
							whileHover={{ scale: 1.05 }}
							transition={{
								duration: 1.5,
								ease: [0.25, 0.46, 0.45, 0.94],
							}}
							src="https://images.unsplash.com/photo-1599458349289-18f0ee82e6ed?q=80&w=989&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
							alt="Botanical Silver Heirlooms"
							className="absolute inset-0 w-full h-full object-cover object-center"
						/>

						{/* Luxury Vignette / Scrim Gradient */}
						<div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10 transition-opacity duration-700 group-hover:opacity-90" />

						{/* Campaign Content */}
						<div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12 text-white">
							<span className="font-secondary text-[10px] uppercase tracking-[0.3em] font-semibold text-white/70 mb-3 block">
								Edition 01 — The Atelier Collection
							</span>
							<h1 className="font-primary text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4 text-white">
								From Your Heart <br />
								<span className="italic font-normal">
									To Theirs
								</span>
							</h1>
							<p className="font-body text-xs sm:text-sm font-light text-white/80 max-w-md leading-relaxed mb-8">
								Handcrafted heirlooms sculpted in solid 14k gold
								and adorned with responsibly sourced stones,
								designed to celebrate every chapter.
							</p>

							<div className="inline-flex items-center gap-3">
								<span className="font-secondary text-[10px] uppercase tracking-[0.25em] font-semibold pb-1 border-b border-white text-white group-hover:border-white/50 transition-colors flex items-center gap-2">
									<span>Discover The Collection</span>
									<motion.div
										whileHover={{ x: 5 }}
										transition={luxurySpring}
									>
										<ArrowRight
											size={13}
											className="stroke-[1.5]"
										/>
									</motion.div>
								</span>
							</div>
						</div>
					</Link>
				</motion.div>

				{/* ============================================================== */}
				{/* RIGHT COLUMN: Category Tiles & Feature Card (5 cols)           */}
				{/* ============================================================== */}
				<div className="lg:col-span-5 flex flex-col gap-4 h-full">
					{/* Top Row: Category Tiles (Rings, Necklaces, Earrings) */}
					<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-44 lg:h-[36%]">
						{/* Tile 1: Rings */}
						<motion.div variants={blockEntrance} className="h-full">
							<Link
								href="/category/rings"
								className="relative h-full border border-(--border-color) overflow-hidden group rounded-xs flex flex-col justify-between p-4"
							>
								<motion.img
									whileHover={{ scale: 1.1 }}
									transition={{
										duration: 1.5,
										ease: [0.25, 0.46, 0.45, 0.94],
									}}
									src="https://images.unsplash.com/photo-1773142073097-166a5a379cab?q=80&w=800&auto=format&fit=crop"
									alt="Handcrafted Rings on Champagne Silk"
									className="absolute inset-0 w-full h-full object-cover object-center"
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

								<div className="relative z-10 flex justify-end w-full">
									<ArrowUpRight
										size={13}
										className="text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 stroke-[1.5]"
									/>
								</div>

								<div className="relative z-10 text-white">
									<span className="font-primary text-base tracking-wide block transition-transform duration-500 group-hover:-translate-y-0.5">
										Rings
									</span>
									<span className="font-secondary text-[9px] uppercase tracking-[0.2em] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 block -mt-0.5">
										Explore
									</span>
								</div>
							</Link>
						</motion.div>

						{/* Tile 2: Necklaces */}
						<motion.div variants={blockEntrance} className="h-full">
							<Link
								href="/category/necklaces"
								className="relative h-full border border-(--border-color) overflow-hidden group rounded-xs flex flex-col justify-between p-4"
							>
								<motion.img
									whileHover={{ scale: 1.1 }}
									transition={{
										duration: 1.5,
										ease: [0.25, 0.46, 0.45, 0.94],
									}}
									src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=800&auto=format&fit=crop"
									alt="Fine Necklaces"
									className="absolute inset-0 w-full h-full object-cover object-center"
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

								<div className="relative z-10 flex justify-end w-full">
									<ArrowUpRight
										size={13}
										className="text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 stroke-[1.5]"
									/>
								</div>

								<div className="relative z-10 text-white">
									<span className="font-primary text-base tracking-wide block transition-transform duration-500 group-hover:-translate-y-0.5">
										Necklaces
									</span>
									<span className="font-secondary text-[9px] uppercase tracking-[0.2em] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 block -mt-0.5">
										Explore
									</span>
								</div>
							</Link>
						</motion.div>

						{/* Tile 3: Earrings */}
						<motion.div
							variants={blockEntrance}
							className="h-full col-span-2 sm:col-span-1"
						>
							<Link
								href="/category/earrings"
								className="relative h-full border border-(--border-color) overflow-hidden group rounded-xs flex flex-col justify-between p-4"
							>
								<motion.img
									whileHover={{ scale: 1.1 }}
									transition={{
										duration: 1.5,
										ease: [0.25, 0.46, 0.45, 0.94],
									}}
									src="https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
									alt="Fine Earrings"
									className="absolute inset-0 w-full h-full object-cover object-center"
								/>
								<div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-black/10 transition-opacity duration-500 group-hover:opacity-90" />

								<div className="relative z-10 flex justify-end w-full">
									<ArrowUpRight
										size={13}
										className="text-white/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 stroke-[1.5]"
									/>
								</div>

								<div className="relative z-10 text-white">
									<span className="font-primary text-base tracking-wide block transition-transform duration-500 group-hover:-translate-y-0.5">
										Earrings
									</span>
									<span className="font-secondary text-[9px] uppercase tracking-[0.2em] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 block -mt-0.5">
										Explore
									</span>
								</div>
							</Link>
						</motion.div>
					</div>

					{/* Bottom Row: Wide Rectangle (Lab-Grown Solitaires) */}
					<motion.div
						variants={blockEntrance}
						className="grow h-full min-h-60"
					>
						<Link
							href="/category/rings"
							className="relative w-full h-full border border-(--border-color) overflow-hidden group rounded-xs p-8 sm:p-10 flex flex-col justify-end"
						>
							{/* Studio Solitaire Photography */}
							<motion.img
								whileHover={{ scale: 1.05 }}
								transition={{
									duration: 1.5,
									ease: [0.25, 0.46, 0.45, 0.94],
								}}
								src="https://images.unsplash.com/photo-1719924998065-0c60e329ef58?w=1200&auto=format&fit=crop&q=80"
								alt="Lab-Grown Solitaire Diamonds"
								className="absolute inset-0 w-full h-full object-cover object-center"
							/>
							{/* Gradient scrim */}
							<div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-500" />

							<div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
								<div>
									<span className="font-secondary text-[9px] uppercase tracking-[0.25em] font-medium text-white/70 block mb-1.5">
										Sustainable Brilliance
									</span>
									<h2 className="font-primary text-xl sm:text-2xl lg:text-3xl tracking-tight text-white mb-2">
										Lab-Grown Diamonds
									</h2>
									<p className="font-body text-xs text-white/75 font-light max-w-sm leading-relaxed">
										Conflict-free clarity engineered for
										modern eternity.
									</p>
								</div>

								<span className="font-secondary text-[10px] uppercase tracking-[0.25em] font-semibold flex items-center gap-1.5 pb-1 border-b border-white text-white group-hover:border-white/60 transition-colors shrink-0 self-start sm:self-auto">
									<span>Explore</span>
									<motion.div
										whileHover={{ x: 4 }}
										transition={luxurySpring}
									>
										<ArrowRight
											size={12}
											className="stroke-[1.5]"
										/>
									</motion.div>
								</span>
							</div>
						</Link>
					</motion.div>
				</div>
			</motion.div>
		</section>
	);
}
