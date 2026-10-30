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
		<section className="on-photo relative w-full h-[70svh] sm:h-[78svh] min-h-130 max-h-220 overflow-hidden bg-(--card-sub)">
			<Image
				src="https://images.pexels.com/photos/17940328/pexels-photo-17940328.jpeg?auto=compress&cs=tinysrgb&w=2000"
				alt="A strand of cream pearls worn with an open white shirt"
				fill
				sizes="100vw"
				loading="eager"
				fetchPriority="high"
				className="object-cover object-center"
			/>
			{/* Scrim for legible type over the photo */}
			<div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-black/5 sm:from-black/65 sm:via-black/25" />

			<motion.div
				variants={heroContainer}
				initial="hidden"
				animate="show"
				className="relative z-10 h-full max-w-screen-2xl mx-auto px-4 sm:px-8 pb-14 sm:pb-20 flex flex-col justify-end text-(--bg-base)"
			>
				<motion.span variants={heroItem} className="eyebrow mb-4 text-(--bg-base)/80">
					Maison Vaelore
				</motion.span>
				<motion.h1
					variants={heroItem}
					className="font-serif text-[2.5rem] sm:text-title lg:text-display tracking-tight max-w-2xl"
				>
					Light, <span className="italic">kept.</span>
				</motion.h1>
				<motion.p
					variants={heroItem}
					className="mt-4 text-copy max-w-md text-(--bg-base)/85"
				>
					Golden South Sea pearls and sculptural 18k gold, made by hand
					to be passed down.
				</motion.p>
				<motion.div variants={heroItem} className="mt-8 flex flex-col sm:flex-row gap-3 [&>a]:w-full sm:[&>a]:w-auto">
					<Button href="/collections/new-and-featured" variant="inverse">
						Discover New &amp; Featured
					</Button>
					<Button href="/collections/gifts" variant="inverse-outline">
						Discover Gifts
					</Button>
				</motion.div>
			</motion.div>
		</section>
	);
}
