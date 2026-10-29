"use client";

import React, { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { motion, AnimatePresence } from "framer-motion";

// Our standard "Quiet Luxury" physics
const luxurySpring = {
	type: "spring" as const,
	damping: 30,
	stiffness: 100,
	mass: 0.8,
};

// Variants for staggering children (desktop links & mobile links)
const staggerContainer = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.1,
		},
	},
};

const staggerItem = {
	hidden: { opacity: 0, y: -5 },
	show: { opacity: 1, y: 0, transition: luxurySpring },
};

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const { totalCartCount, totalWishlistCount } = useStore();

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
		{
			name: "New & Featured",
			href: "/coming-soon?feature=new-and-featured",
		},
		{ name: "Bracelets", href: "/category/bracelets" },
		{ name: "Rings", href: "/category/rings" },
		{ name: "Necklaces", href: "/category/necklaces" },
		{ name: "Earrings", href: "/category/earrings" },
		{ name: "Engraving", href: "/coming-soon?feature=engraving" },
		{ name: "Gifts", href: "/coming-soon?feature=gifts" },
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
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						transition={luxurySpring}
						onClick={() => setIsOpen(true)}
						aria-label="Open navigation menu"
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

				{/* Desktop: Enclosed Search Pill */}
				<div className="hidden md:flex flex-1 justify-center px-8">
					<div className="relative w-full max-w-sm flex items-center group">
						<Search className="absolute left-3.5 w-3.5 h-3.5 text-(--text-muted) group-focus-within:text-(--text-headline) transition-colors pointer-events-none" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search by collection or stone..."
							className="w-full bg-(--card-sub)/70 border border-(--border-color) rounded-full py-1.5 pl-9 pr-4 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) tracking-wide transition-all duration-300 focus:outline-none focus:bg-white focus:border-(--text-headline)/40 focus:ring-1 focus:ring-(--text-headline)/20"
						/>
					</div>
				</div>

				{/* Right Actions: Wishlist & Bag */}
				<div className="flex items-center space-x-5 sm:space-x-6 shrink-0">
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
										className="absolute 0 right-0 translate-x-1/3 -translate-y-1/3 min-w-4 h-4 px-1 font-secondary text-[8px] font-semibold rounded-full flex items-center justify-center bg-stone-900 text-white shadow-xs"
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
										className="absolute 0 right-0 translate-x-1/3 -translate-y-1/3 min-w-4 h-4 px-1 font-secondary text-[8px] font-semibold rounded-full flex items-center justify-center bg-(--text-headline) text-(--bg-base) shadow-xs"
									>
										{totalCartCount}
									</motion.span>
								)}
							</AnimatePresence>
						</motion.div>
					</Link>

					{/* Login Link */}
					<Link href="/login" aria-label="User">
						<motion.div
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={luxurySpring}
							className="text-(--text-headline) hover:opacity-60 transition-opacity relative p-1 cursor-pointer"
						>
							<User className="w-4.5 h-4.5 stroke-[1.5]" />
						</motion.div>
					</Link>
				</div>
			</div>

			{/* --- DESKTOP CATEGORY NAVIGATION STRIP --- */}
			<nav className="hidden md:block w-full border-t border-(--border-color)/60 py-2.5">
				<div className="max-w-screen-2xl mx-auto px-8">
					<motion.ul
						variants={staggerContainer}
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
							className="fixed top-0 left-0 bottom-0 z-50 w-[84vw] max-w-xs bg-(--bg-base) border-r border-(--border-color) p-6 flex flex-col justify-between md:hidden shadow-2xl"
						>
							<motion.div
								variants={staggerContainer}
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
									<div className="relative flex items-center">
										<Search className="absolute left-3.5 w-3.5 h-3.5 text-(--text-muted)" />
										<input
											type="text"
											placeholder="Search pieces..."
											className="w-full bg-(--card-sub)/70 border border-(--border-color) rounded-full py-2 pl-9 pr-3 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-white"
										/>
									</div>
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
										<span className="text-[9px] px-2 py-0.5 rounded-full bg-stone-900 text-white font-semibold">
											{totalWishlistCount}
										</span>
									)}
								</Link>
								<Link
									href="/login"
									onClick={() => setIsOpen(false)}
									className="hover:text-(--text-headline) transition-colors"
								>
									Client Account
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
