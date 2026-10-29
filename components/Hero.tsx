"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { staggerContainer, fadeSlide } from "@/app/lib/motion";
import Button from "@/components/ui/Button";

// Gentle stagger for the eyebrow, headline, copy and buttons
const heroContainer = staggerContainer(0.12, 0.15);
const heroItem = fadeSlide(16, { duration: 1 });

// One full-bleed campaign image with a single focal message
export default function Hero() {
	return (
		<section className="relative w-full h-[78vh] min-h-130 max-h-220 overflow-hidden bg-(--card-sub)">
			<Image
				src="https://images.unsplash.com/photo-1599458349289-18f0ee82e6ed?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
				alt="Botanical heirloom jewelry on silk"
				fill
				sizes="100vw"
				loading="eager"
				fetchPriority="high"
				className="object-cover object-center"
			/>
			{/* Scrim for legible type over the photo */}
			<div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/25 to-black/5" />

			<motion.div
				variants={heroContainer}
				initial="hidden"
				animate="show"
				className="relative z-10 h-full max-w-screen-2xl mx-auto px-4 sm:px-8 pb-14 sm:pb-20 flex flex-col justify-end text-(--bg-base)"
			>
				<motion.span variants={heroItem} className="eyebrow mb-4 text-(--bg-base)/80">
					Edition 01: The Atelier Collection
				</motion.span>
				<motion.h1
					variants={heroItem}
					className="font-serif text-[2.5rem] sm:text-title lg:text-display tracking-tight max-w-2xl"
				>
					From Your Heart, <span className="italic">To Theirs</span>
				</motion.h1>
				<motion.p
					variants={heroItem}
					className="mt-4 text-copy max-w-md text-(--bg-base)/85"
				>
					Handcrafted heirlooms in recycled solid gold, made to be
					given and kept for a lifetime.
				</motion.p>
				<motion.div variants={heroItem} className="mt-8 flex flex-wrap gap-3">
					<Button href="/collections/new-and-featured" variant="inverse">
						Shop New &amp; Featured
					</Button>
					<Button href="/collections/gifts" variant="inverse-outline">
						Shop Gifts
					</Button>
				</motion.div>
			</motion.div>
		</section>
	);
}
