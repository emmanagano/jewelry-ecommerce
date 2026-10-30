"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { luxurySpring, staggerContainer, fadeSlide } from "@/app/lib/motion";
import { subscribeToNewsletter } from "@/app/lib/store-actions";
import { SITE_NAME } from "@/app/lib/site";
import { useAuth } from "@/context/AuthContext";
import type { Category } from "@/app/lib/products";

const footerContainer = staggerContainer(0.12, 0.1);
const footerColumn = fadeSlide(24, { duration: 1.1 });

interface FooterProps {
	categories: Pick<Category, "slug" | "name">[];
}

export default function Footer({ categories }: FooterProps) {
	const { user } = useAuth();

	const columns = [
		{
			title: "Discover",
			links: [
				{ name: "New & Featured", href: "/collections/new-and-featured" },
				{ name: "Best Sellers", href: "/collections/best-sellers" },
				{ name: "Gifts", href: "/collections/gifts" },
				{ name: "Search", href: "/search" },
				{ name: "The House", href: "/the-house" },
			],
		},
		{
			title: "Collections",
			links: categories.map((c) => ({
				name: c.name,
				href: `/category/${c.slug}`,
			})),
		},
		{
			title: "Client Care",
			links: [
				user
					? { name: "Account & Orders", href: "/account" }
					: { name: "Sign In", href: "/login" },
				{ name: "Saved Pieces", href: "/my-wishlist" },
				{ name: "Your Bag", href: "/shopping-bag" },
			],
		},
	].filter((column) => column.links.length > 0);

	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);
	const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
		null,
	);
	const [isSubmitting, startSubmit] = useTransition();

	// Saves to newsletter_subscribers, the same subscription the account
	// page's Email Preferences switch controls
	const handleSubscribe = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim()) return;
		setMessage(null);
		startSubmit(async () => {
			const result = await subscribeToNewsletter(email);
			setMessage({ ok: result.ok, text: result.message });
			if (result.ok) {
				setSubscribed(true);
				setEmail("");
				setTimeout(() => setSubscribed(false), 3000);
			}
		});
	};

	return (
		<footer className="w-full bg-(--card-wide) text-(--text-headline) border-t border-(--border-color) mt-24">
			<motion.div
				variants={footerContainer}
				initial="hidden"
				whileInView="show"
				viewport={{ once: true, margin: "-60px" }}
				className="max-w-screen-2xl mx-auto px-6 sm:px-8 py-16 lg:py-20"
			>
				{/* Top Grid: Newsletter + Navigation Columns */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-(--border-color)/60">
					{/* Brand & Newsletter Column (Spans 5 columns on desktop) */}
					<motion.div
						variants={footerColumn}
						className="lg:col-span-5 pr-0 lg:pr-12 flex flex-col space-y-6"
					>
						<Image
							src="/logo/vaelore-logo-horizontal-ink.svg"
							alt={SITE_NAME}
							width={936}
							height={214}
							unoptimized
							className="h-10 w-auto self-start"
						/>
						<p className="font-body text-copy-sm text-(--text-muted) max-w-sm leading-relaxed font-light">
							Modern heirlooms in golden pearls and 18k gold, made by hand to be
							passed down. Join for private previews and notes from the
							atelier, two letters a month.
						</p>

						{/* Enclosed Newsletter Signup Form */}
						<form
							onSubmit={handleSubscribe}
							className="relative max-w-sm flex w-full group mt-2"
						>
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Your email address"
								aria-label="Email address"
								aria-describedby={message ? "newsletter-message" : undefined}
								className="w-full bg-transparent border border-(--border-color) py-2.5 pl-4 pr-32 font-body text-copy-sm text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 transition-colors rounded-xs"
							/>
							<motion.button
								transition={luxurySpring}
								type="submit"
								disabled={isSubmitting}
								aria-label="Join the Vaelore Letter"
								className="absolute right-1 top-1 bottom-1 px-4 bg-(--bg-base) hover:bg-(--text-headline) hover:text-(--bg-base) text-(--text-headline) eyebrow transition-colors border border-(--border-color) cursor-pointer flex items-center gap-1.5 rounded-xs"
							>
								<AnimatePresence mode="wait">
									{subscribed ? (
										<motion.span
											key="confirmed"
											initial={{ opacity: 0, y: 3 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -3 }}
											className="flex items-center gap-1 text-(--success) font-semibold"
										>
											<Check
												size={10}
												className="stroke-2"
											/>
											<span>Joined</span>
										</motion.span>
									) : (
										<motion.span
											key="default"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="flex items-center gap-1.5"
										>
											<span>Join</span>
											<ArrowRight
												size={10}
												className="stroke-[1.5] transition-transform duration-200 group-hover:translate-x-0.5"
											/>
										</motion.span>
									)}
								</AnimatePresence>
							</motion.button>
						</form>
						{message && (
							<p
								id="newsletter-message"
								role={message.ok ? "status" : "alert"}
								className={`-mt-3 text-copy-sm ${
									message.ok ? "text-(--text-muted)" : "text-(--error-text)"
								}`}
							>
								{message.text}
							</p>
						)}
					</motion.div>

					{/* Navigation Links (Spans 7 columns); every link goes to a real page */}
					<div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
						{columns.map((column) => (
							<motion.div
								key={column.title}
								variants={footerColumn}
								className="flex flex-col space-y-5"
							>
								<span className="eyebrow text-(--text-headline) font-medium">
									{column.title}
								</span>
								<ul className="flex flex-col space-y-3.5 text-copy-sm text-(--text-muted)">
									{column.links.map((link) => (
										<li key={link.href}>
											<Link
												href={link.href}
												className="hover:text-(--text-headline) transition-colors"
											>
												{link.name}
											</Link>
										</li>
									))}
								</ul>
							</motion.div>
						))}
					</div>
				</div>

				{/* Bottom Bar: Copyright, Region */}
				<motion.div
					variants={footerColumn}
					className="pt-8 flex flex-col md:flex-row items-center justify-between eyebrow text-(--text-muted) space-y-4 md:space-y-0"
				>
					<span>© 2026 {SITE_NAME}. All rights reserved.</span>
					<div className="flex items-center space-x-6 md:space-x-8">
						<span>Demo storefront · No real orders ship</span>
						<span>United States (USD $)</span>
					</div>
				</motion.div>
			</motion.div>
		</footer>
	);
}
