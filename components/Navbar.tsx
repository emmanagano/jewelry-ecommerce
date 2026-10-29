"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import Link from "next/link";
import Form from "next/form";
import type { Category } from "@/app/lib/products";
import { useStore } from "@/context/StoreContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { luxurySpring, staggerContainer, fadeSlide } from "@/app/lib/motion";

// Variants for staggering children (desktop links & mobile links)
const navContainer = staggerContainer(0.05, 0.1);
const staggerItem = fadeSlide(-5);

interface NavbarProps {
	categories: Pick<Category, "slug" | "name">[];
}

export default function Navbar({ categories }: NavbarProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { totalCartCount, totalWishlistCount } = useStore();
	const { user } = useAuth();
	const accountHref = user ? "/account" : "/login";
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);

	// While the mobile menu is open: focus it, keep Tab inside it, close on
	// Escape, and return focus to the hamburger button afterwards
	useEffect(() => {
		if (!isOpen) return;
		const panel = panelRef.current;
		const menuButton = menuButtonRef.current;
		const focusables = () =>
			Array.from(
				panel?.querySelectorAll<HTMLElement>("a[href], button, input") ??
					[],
			);
		focusables()[0]?.focus();

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsOpen(false);
				return;
			}
			if (e.key !== "Tab") return;
			const items = focusables();
			const first = items[0];
			const last = items[items.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last?.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first?.focus();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			menuButton?.focus();
		};
	}, [isOpen]);

	// Prevent scrolling when mobile menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const navItems = [
		{ name: "New & Featured", href: "/collections/new-and-featured" },
		...categories.map((c) => ({
			name: c.name,
			href: `/category/${c.slug}`,
		})),
		{ name: "Engraving", href: "/coming-soon?feature=engraving" },
		{ name: "Gifts", href: "/collections/gifts" },
		{ name: "Blog", href: "/coming-soon?feature=blog" },
	];

	return (
		<motion.header
			initial={{ y: "-100%" }}
			animate={{ y: 0 }}
			transition={{ ...luxurySpring, duration: 1.2, mass: 1 }}
			className="w-full bg-(--bg-base)/95 text-(--text-headline) border-b border-(--border-color) sticky top-0 z-50 backdrop-blur-md"
		>
			{/* --- TOP ROW: LOGO, SEARCH PILL, ACTIONS --- */}
			<div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4">
				{/* Mobile: Hamburger Button */}
				<div className="flex items-center md:hidden">
					<motion.button
						ref={menuButtonRef}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						transition={luxurySpring}
						onClick={() => setIsOpen(true)}
						aria-label="Open navigation menu"
						aria-expanded={isOpen}
						aria-controls="mobile-menu"
						className="p-1 -ml-1 text-(--text-headline) hover:opacity-60 transition-opacity cursor-pointer"
					>
						<Menu className="w-5 h-5 stroke-[1.5]" />
					</motion.button>
				</div>

				{/* Brand Logo */}
				<div className="shrink-0">
					<Link href="/">
						<span className="font-primary text-xl sm:text-2xl tracking-[0.2em] font-medium uppercase text-(--text-headline)">
							BrandLogo
						</span>
					</Link>
				</div>

				{/* Right Actions: Search, Wishlist & Bag */}
				<div className="flex items-center space-x-5 sm:space-x-6 shrink-0">
					{/* Desktop Search (mobile search lives in the drawer) */}
					<Form
						action="/search"
						role="search"
						className="hidden md:flex relative items-center"
					>
						<Search className="absolute left-3 w-3.5 h-3.5 text-(--text-muted) pointer-events-none" />
						<input
							type="search"
							name="q"
							placeholder="Search pieces..."
							aria-label="Search pieces"
							className="w-44 lg:w-56 bg-(--card-sub)/70 border border-(--border-color) rounded-full py-1.5 pl-8 pr-3 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-white"
						/>
					</Form>

					{/* Wishlist Link */}
					<Link href="/my-wishlist" aria-label="Wishlist">
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={luxurySpring}
							className="text-(--text-headline) hover:opacity-60 transition-opacity relative p-1 cursor-pointer"
						>
							<Heart className="w-4.5 h-4.5 stroke-[1.5]" />
							<AnimatePresence>
								{totalWishlistCount > 0 && (
									<motion.span
										initial={{ scale: 0, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0, opacity: 0 }}
										transition={luxurySpring}
										className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 min-w-4 h-4 px-1 font-secondary text-[8px] font-semibold rounded-full flex items-center justify-center bg-(--text-headline) text-(--bg-base) shadow-xs"
									>
										{totalWishlistCount}
									</motion.span>
								)}
							</AnimatePresence>
						</motion.div>
					</Link>

					{/* Shopping Bag Link */}
					<Link href="/shopping-bag" aria-label="Shopping Bag">
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={luxurySpring}
							className="text-(--text-headline) hover:opacity-60 transition-opacity relative p-1 cursor-pointer"
						>
							<ShoppingBag className="w-4.5 h-4.5 stroke-[1.5]" />
							<AnimatePresence>
								{totalCartCount > 0 && (
									<motion.span
										initial={{ scale: 0, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0, opacity: 0 }}
										transition={luxurySpring}
										className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 min-w-4 h-4 px-1 font-secondary text-[8px] font-semibold rounded-full flex items-center justify-center bg-(--text-headline) text-(--bg-base) shadow-xs"
									>
										{totalCartCount}
									</motion.span>
								)}
							</AnimatePresence>
						</motion.div>
					</Link>

					{/* Account Link (dot = signed in) */}
					<Link
						href={accountHref}
						aria-label={user ? "Your account" : "Sign in"}
					>
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={luxurySpring}
							className="text-(--text-headline) hover:opacity-60 transition-opacity relative p-1 cursor-pointer"
						>
							<User className="w-4.5 h-4.5 stroke-[1.5]" />
							{user && (
								<span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-(--success)" />
							)}
						</motion.div>
					</Link>
				</div>
			</div>

			{/* --- DESKTOP CATEGORY NAVIGATION STRIP --- */}
			<nav className="hidden md:block w-full border-t border-(--border-color)/60 py-2.5">
				<div className="max-w-screen-2xl mx-auto px-8">
					<motion.ul
						variants={navContainer}
						initial="hidden"
						animate="show"
						className="flex items-center justify-center space-x-9 overflow-x-auto whitespace-nowrap font-secondary text-[10px] uppercase tracking-[0.22em] font-medium text-(--text-muted) hide-scrollbar"
					>
						{navItems.map((item) => (
							<motion.li key={item.name} variants={staggerItem}>
								<Link
									href={item.href}
									className="relative py-1 hover:text-(--text-headline) transition-colors group inline-block"
								>
									<span>{item.name}</span>
									<span className="absolute inset-x-0 bottom-0 h-px bg-(--text-headline) scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
								</Link>
							</motion.li>
						))}
					</motion.ul>
				</div>
			</nav>

			{/* --- MOBILE DRAWER OVERLAY & PANEL --- */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Background Scrim */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{
								duration: 0.4,
								ease: [0.25, 0.46, 0.45, 0.94],
							}}
							className="fixed inset-0 bg-black/40 backdrop-blur-xs md:hidden z-40"
							onClick={() => setIsOpen(false)}
						/>

						{/* Slide-out Menu Panel */}
						<motion.div
							initial={{ x: "-100%" }}
							animate={{ x: 0 }}
							exit={{ x: "-100%" }}
							transition={luxurySpring}
							ref={panelRef}
							id="mobile-menu"
							role="dialog"
							aria-modal="true"
							aria-label="Navigation"
							className="fixed top-0 left-0 bottom-0 z-50 w-[84vw] max-w-xs bg-(--bg-base) border-r border-(--border-color) p-6 flex flex-col justify-between md:hidden shadow-2xl"
						>
							<motion.div
								variants={navContainer}
								initial="hidden"
								animate="show"
							>
								{/* Drawer Header */}
								<div className="flex items-center justify-between pb-5 border-b border-(--border-color)">
									<span className="font-primary text-base tracking-[0.2em] font-medium uppercase text-(--text-headline)">
										Navigation
									</span>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										transition={luxurySpring}
										onClick={() => setIsOpen(false)}
										aria-label="Close menu"
										className="p-1 -mr-1 text-(--text-headline) hover:opacity-60 transition-opacity cursor-pointer"
									>
										<X className="w-5 h-5 stroke-[1.5]" />
									</motion.button>
								</div>

								{/* Mobile Enclosed Search */}
								<motion.div
									variants={staggerItem}
									className="mt-5 mb-6"
								>
									<Form
										action="/search"
										role="search"
										onSubmit={() => setIsOpen(false)}
										className="relative flex items-center"
									>
										<Search className="absolute left-3.5 w-3.5 h-3.5 text-(--text-muted) pointer-events-none" />
										<input
											type="search"
											name="q"
											placeholder="Search pieces..."
											aria-label="Search pieces"
											className="w-full bg-(--card-sub)/70 border border-(--border-color) rounded-full py-2 pl-9 pr-3 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-white"
										/>
									</Form>
								</motion.div>

								{/* Category Links */}
								<ul className="flex flex-col space-y-3.5 py-1">
									{navItems.map((item) => (
										<motion.li
											key={item.name}
											variants={staggerItem}
										>
											<Link
												href={item.href}
												onClick={() => setIsOpen(false)}
												className="block font-secondary text-xs uppercase tracking-[0.2em] font-medium text-(--text-headline) hover:text-(--text-muted) transition-colors py-1"
											>
												{item.name}
											</Link>
										</motion.li>
									))}
								</ul>
							</motion.div>

							{/* Mobile Drawer Footer */}
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ ...luxurySpring, delay: 0.3 }}
								className="pt-6 border-t border-(--border-color) flex flex-col space-y-3 font-secondary text-xs tracking-wider font-medium text-(--text-muted)"
							>
								<Link
									href="/shopping-bag"
									onClick={() => setIsOpen(false)}
									className="flex items-center justify-between text-(--text-headline)"
								>
									<span>Shopping Bag</span>
									{totalCartCount > 0 && (
										<span className="text-[9px] px-2 py-0.5 rounded-full bg-(--text-headline) text-(--bg-base) font-semibold">
											{totalCartCount}
										</span>
									)}
								</Link>
								<Link
									href="/my-wishlist"
									onClick={() => setIsOpen(false)}
									className="flex items-center justify-between text-(--text-headline)"
								>
									<span>Saved Pieces</span>
									{totalWishlistCount > 0 && (
										<span className="text-[9px] px-2 py-0.5 rounded-full bg-(--text-headline) text-(--bg-base) font-semibold">
											{totalWishlistCount}
										</span>
									)}
								</Link>
								<Link
									href={accountHref}
									onClick={() => setIsOpen(false)}
									className="hover:text-(--text-headline) transition-colors"
								>
									{user ? "Client Account" : "Sign In"}
								</Link>
								<Link
									href="/coming-soon?feature=concierge"
									onClick={() => setIsOpen(false)}
									className="hover:text-(--text-headline) transition-colors"
								>
									Concierge & Care
								</Link>
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</motion.header>
	);
}
