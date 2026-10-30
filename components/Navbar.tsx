"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Form from "next/form";
import type { Category } from "@/app/lib/products";
import { SITE_NAME } from "@/app/lib/site";
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
		{ name: "Gifts", href: "/collections/gifts" },
		{ name: "The House", href: "/the-house" },
	];

	return (
		<header className="w-full bg-(--bg-base)/95 text-(--text-headline) border-b border-(--border-color) sticky top-0 z-50 backdrop-blur-sm">
			{/* --- TOP ROW: search | centered wordmark | actions --- */}
			<div className="max-w-screen-2xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-8 py-4 sm:py-5">
				{/* Left: hamburger (mobile) / search (desktop) */}
				<div className="flex items-center">
					<button
						ref={menuButtonRef}
						type="button"
						onClick={() => setIsOpen(true)}
						aria-label="Open navigation menu"
						aria-expanded={isOpen}
						aria-controls="mobile-menu"
						className="md:hidden p-1 -ml-1 text-(--text-headline) hover:text-(--accent) transition-colors cursor-pointer"
					>
						<Menu className="w-5 h-5 stroke-[1.5]" />
					</button>

					{/* Desktop Search (mobile search lives in the drawer) */}
					<Form
						action="/search"
						role="search"
						className="hidden md:flex relative items-center"
					>
						<Search className="absolute left-0 w-4 h-4 text-(--text-muted) pointer-events-none" />
						<input
							type="search"
							name="q"
							placeholder="Search"
							aria-label="Search pieces"
							className="w-40 lg:w-56 bg-transparent border-b border-transparent hover:border-(--border-color) focus:border-(--text-headline) py-1.5 pl-7 pr-2 text-copy-sm text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none transition-colors"
						/>
					</Form>
				</div>

				{/* Center: wordmark */}
				<Link href="/" className="justify-self-center" aria-label={SITE_NAME}>
					<Image
						src="/logo/vaelore-logo-horizontal-ink.svg"
						alt={SITE_NAME}
						width={936}
						height={214}
						unoptimized
						priority
						className="h-8 sm:h-9 lg:h-10 w-auto"
					/>
				</Link>

				{/* Right: wishlist, bag, account */}
				<div className="flex items-center justify-end gap-4 sm:gap-6">
					<Link
						href="/my-wishlist"
						aria-label={`Saved pieces${totalWishlistCount ? `, ${totalWishlistCount} saved` : ""}`}
						className="relative p-1 text-(--text-headline) hover:text-(--accent) transition-colors"
					>
						<Heart className="w-5 h-5 stroke-[1.25]" />
						{totalWishlistCount > 0 && (
							<span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/4 min-w-4 h-4 px-1 text-[10px] leading-none font-medium rounded-full flex items-center justify-center bg-(--text-headline) text-(--bg-base)">
								{totalWishlistCount}
							</span>
						)}
					</Link>

					<Link
						href="/shopping-bag"
						aria-label={`Your bag${totalCartCount ? `, ${totalCartCount} items` : ""}`}
						className="relative p-1 text-(--text-headline) hover:text-(--accent) transition-colors"
					>
						<ShoppingBag className="w-5 h-5 stroke-[1.25]" />
						{totalCartCount > 0 && (
							<span className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/4 min-w-4 h-4 px-1 text-[10px] leading-none font-medium rounded-full flex items-center justify-center bg-(--accent) text-(--bg-base)">
								{totalCartCount}
							</span>
						)}
					</Link>

					{/* Account (dot = signed in) */}
					<Link
						href={accountHref}
						aria-label={user ? "Your account" : "Sign in"}
						className="relative p-1 text-(--text-headline) hover:text-(--accent) transition-colors"
					>
						<User className="w-5 h-5 stroke-[1.25]" />
						{user && (
							<span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-(--success)" />
						)}
					</Link>
				</div>
			</div>

			{/* --- DESKTOP CATEGORY NAVIGATION STRIP --- */}
			<nav aria-label="Main" className="hidden md:block w-full border-t border-(--border-color) py-3">
				<div className="max-w-screen-2xl mx-auto px-8">
					<motion.ul
						variants={navContainer}
						initial="hidden"
						animate="show"
						className="flex items-center justify-center gap-10 overflow-x-auto whitespace-nowrap text-label uppercase text-(--text-body) hide-scrollbar"
					>
						{navItems.map((item) => (
							<motion.li key={item.name} variants={staggerItem}>
								<Link
									href={item.href}
									className="relative py-1 hover:text-(--text-headline) transition-colors group inline-block"
								>
									<span>{item.name}</span>
									<span className="absolute inset-x-0 -bottom-0.5 h-px bg-(--text-headline) scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
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
									<Image
										src="/logo/vaelore-logo-horizontal-ink.svg"
										alt={SITE_NAME}
										width={936}
										height={214}
										unoptimized
										className="h-8 w-auto"
									/>
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										aria-label="Close menu"
										className="p-1 -mr-1 text-(--text-headline) hover:text-(--accent) transition-colors cursor-pointer"
									>
										<X className="w-5 h-5 stroke-[1.5]" />
									</button>
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
										<Search className="absolute left-0 w-4 h-4 text-(--text-muted) pointer-events-none" />
										<input
											type="search"
											name="q"
											placeholder="Search pieces"
											aria-label="Search pieces"
											className="w-full bg-transparent border-b border-(--border-color) focus:border-(--text-headline) py-2 pl-7 pr-2 text-copy text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none transition-colors"
										/>
									</Form>
								</motion.div>

								{/* Category Links */}
								<ul className="flex flex-col space-y-1 py-1">
									{navItems.map((item) => (
										<motion.li
											key={item.name}
											variants={staggerItem}
										>
											<Link
												href={item.href}
												onClick={() => setIsOpen(false)}
												className="block font-serif text-heading text-(--text-headline) hover:text-(--accent) transition-colors py-1.5"
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
								className="pt-6 border-t border-(--border-color) flex flex-col space-y-4 text-label uppercase text-(--text-body)"
							>
								<Link
									href="/shopping-bag"
									onClick={() => setIsOpen(false)}
									className="flex items-center justify-between text-(--text-headline)"
								>
									<span>Your Bag</span>
									{totalCartCount > 0 && (
										<span className="text-[10px] leading-none px-2 py-1 rounded-full bg-(--text-headline) text-(--bg-base) font-medium normal-case tracking-normal">
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
										<span className="text-[10px] leading-none px-2 py-1 rounded-full bg-(--text-headline) text-(--bg-base) font-medium normal-case tracking-normal">
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
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</header>
	);
}
