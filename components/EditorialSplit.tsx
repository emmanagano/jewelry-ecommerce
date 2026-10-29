"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeSlide } from "@/app/lib/motion";

const reveal = fadeSlide(20, { duration: 1 });

// Image beside editorial copy; `reverse` puts the image on the right, so
// consecutive sections can alternate
export default function EditorialSplit({
	image,
	imageAlt,
	caption,
	eyebrow,
	title,
	children,
	action,
	reverse = false,
}: {
	image: string;
	imageAlt: string;
	caption?: string;
	eyebrow: string;
	title: React.ReactNode;
	children: React.ReactNode;
	action?: React.ReactNode;
	reverse?: boolean;
}) {
	return (
		<section className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-14 lg:py-20">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
				<motion.div
					variants={reveal}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-60px" }}
					className={`lg:col-span-6 relative aspect-4/5 sm:aspect-5/4 lg:aspect-square overflow-hidden rounded-xs bg-(--card-sub) ${
						reverse ? "lg:order-2 lg:col-start-7" : ""
					}`}
				>
					<Image
						src={image}
						alt={imageAlt}
						fill
						sizes="(min-width: 1024px) 50vw, 100vw"
						className="object-cover object-center"
					/>
					{caption && (
						<span className="eyebrow absolute bottom-4 left-4 bg-(--bg-base)/95 text-(--text-headline) px-3 py-1.5 rounded-full">
							{caption}
						</span>
					)}
				</motion.div>

				<motion.div
					variants={reveal}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, margin: "-60px" }}
					className={`lg:col-span-5 flex flex-col items-start ${
						reverse ? "lg:col-start-1 lg:order-1" : "lg:col-start-8"
					}`}
				>
					<span className="eyebrow mb-4 text-(--text-muted)">{eyebrow}</span>
					<h2 className="font-serif text-heading sm:text-title tracking-tight text-(--text-headline) mb-6">
						{title}
					</h2>
					<div className="space-y-4 text-copy text-(--text-body) max-w-lg">
						{children}
					</div>
					{action && <div className="mt-8">{action}</div>}
				</motion.div>
			</div>
		</section>
	);
}
