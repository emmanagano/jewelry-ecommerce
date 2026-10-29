"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { luxurySpring, staggerContainer, fadeSlide } from "@/app/lib/motion";
import { subscribeToNewsletter } from "@/app/lib/store-actions";

const footerContainer = staggerContainer(0.12, 0.1);
const footerColumn = fadeSlide(24, { duration: 1.1 });

export default function Footer() {
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
						<span className="font-primary text-2xl font-medium tracking-[0.2em] uppercase text-(--text-headline)">
							BrandLogo
						</span>
						<p className="font-body text-xs text-(--text-muted) max-w-sm leading-relaxed font-light">
							Handcrafted heirlooms designed for modern longevity.
							Subscribe to receive private collection previews and
							editorial journals.
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
								placeholder="Enter your email address"
								aria-label="Email address"
								aria-describedby={message ? "newsletter-message" : undefined}
								className="w-full bg-transparent border border-(--border-color) py-2.5 pl-4 pr-32 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 transition-colors rounded-xs"
							/>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.96 }}
								transition={luxurySpring}
								type="submit"
								disabled={isSubmitting}
								aria-label="Join private client list"
								className="absolute right-1 top-1 bottom-1 px-4 bg-(--bg-base) hover:bg-(--text-headline) hover:text-(--bg-base) text-(--text-headline) font-secondary text-[9px] uppercase tracking-[0.2em] font-medium transition-colors border border-(--border-color) cursor-pointer flex items-center gap-1.5 rounded-xs"
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
											<span>Subscribe</span>
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
								className={`-mt-3 font-body text-[11px] ${
									message.ok ? "text-(--text-muted)" : "text-(--error-text)"
								}`}
							>
								{message.text}
							</p>
						)}
					</motion.div>

					{/* Navigation Links Container (Spans 7 columns) */}
					<div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-12">
						{/* Column 1: Client Care */}
						<motion.div
							variants={footerColumn}
							className="flex flex-col space-y-5"
						>
							<span className="font-secondary text-[10px] uppercase tracking-[0.25em] text-(--text-headline) font-medium">
								Client Care
							</span>
							<ul className="flex flex-col space-y-3.5 font-secondary text-[11px] tracking-wide text-(--text-muted) font-light">
								<li>
									<Link
										href="/coming-soon?feature=concierge"
										className="hover:text-(--text-headline) transition-colors"
									>
										Concierge & Appointments
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=ring-sizer"
										className="hover:text-(--text-headline) transition-colors"
									>
										Ring Size Guide
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=shipping"
										className="hover:text-(--text-headline) transition-colors"
									>
										Insured Shipping & Delivery
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=returns"
										className="hover:text-(--text-headline) transition-colors"
									>
										Returns & Lifetime Warranty
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=care"
										className="hover:text-(--text-headline) transition-colors"
									>
										Jewelry Care & Cleaning
									</Link>
								</li>
							</ul>
						</motion.div>

						{/* Column 2: The Maison */}
						<motion.div
							variants={footerColumn}
							className="flex flex-col space-y-5"
						>
							<span className="font-secondary text-[10px] uppercase tracking-[0.25em] text-(--text-headline) font-medium">
								The Maison
							</span>
							<ul className="flex flex-col space-y-3.5 font-secondary text-[11px] tracking-wide text-(--text-muted) font-light">
								<li>
									<Link
										href="/coming-soon?feature=about"
										className="hover:text-(--text-headline) transition-colors"
									>
										Our Philosophy
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=sustainability"
										className="hover:text-(--text-headline) transition-colors"
									>
										Ethical Craft & Traceability
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=materials"
										className="hover:text-(--text-headline) transition-colors"
									>
										Solid Gold & Lab Diamonds
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=press"
										className="hover:text-(--text-headline) transition-colors"
									>
										Press & Editorial
									</Link>
								</li>
							</ul>
						</motion.div>

						{/* Column 3: Boutiques & Services */}
						<motion.div
							variants={footerColumn}
							className="flex flex-col space-y-5"
						>
							<span className="font-secondary text-[10px] uppercase tracking-[0.25em] text-(--text-headline) font-medium">
								Services
							</span>
							<ul className="flex flex-col space-y-3.5 font-secondary text-[11px] tracking-wide text-(--text-muted) font-light">
								<li>
									<Link
										href="/coming-soon?feature=custom"
										className="hover:text-(--text-headline) transition-colors"
									>
										Bespoke Commissions
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=engraving"
										className="hover:text-(--text-headline) transition-colors"
									>
										Custom Engraving
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=stores"
										className="hover:text-(--text-headline) transition-colors"
									>
										Locate a Boutique
									</Link>
								</li>
								<li>
									<Link
										href="/coming-soon?feature=corporate"
										className="hover:text-(--text-headline) transition-colors"
									>
										Corporate Gifting
									</Link>
								</li>
							</ul>
						</motion.div>
					</div>
				</div>

				{/* Bottom Bar: Copyright, Region, Legal */}
				<motion.div
					variants={footerColumn}
					className="pt-8 flex flex-col md:flex-row items-center justify-between font-secondary text-[10px] uppercase tracking-widest text-(--text-muted) font-medium space-y-4 md:space-y-0"
				>
					<div>
						<span>© 2026 BrandLogo Inc. All rights reserved.</span>
					</div>

					{/* Region / Currency */}
					<div className="flex items-center space-x-6 md:space-x-8">
						<span className="hover:text-(--text-headline) cursor-pointer transition-colors">
							United States (USD $)
						</span>
						<Link
							href="/coming-soon?feature=privacy"
							className="hover:text-(--text-headline) transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							href="/coming-soon?feature=terms"
							className="hover:text-(--text-headline) transition-colors"
						>
							Terms of Use
						</Link>
					</div>
				</motion.div>
			</motion.div>
		</footer>
	);
}
