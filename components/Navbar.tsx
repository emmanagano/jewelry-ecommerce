"use client";

import React, { useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const { totalCartCount, totalWishlistCount } = useStore();

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
		<header className="w-full bg-(--bg-base) text-(--text-headline) border-b border-(--border-color) sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
			{/* --- TOP ROW: LOGO, SEARCH PILL, ACTIONS --- */}
			<div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4">
				{/* Mobile: Hamburger Button */}
				<div className="flex items-center md:hidden">
					<button
						onClick={() => setIsOpen(true)}
						aria-label="Open navigation menu"
						className="p-1 -ml-1 text-(--text-headline) hover:opacity-60 transition-opacity cursor-pointer"
					>
						<Menu className="w-5 h-5 stroke-[1.5]" />
					</button>
				</div>

				{/* Brand Logo */}
				<div className="shrink-0">
					<Link href="/">
						<span className="font-serif text-lg sm:text-2xl tracking-[0.2em] font-medium uppercase text-(--text-headline)">
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
							className="w-full bg-(--card-sub)/70 border border-(--border-color) rounded-full py-1.5 pl-9 pr-4 text-xs text-(--text-headline) placeholder-(--text-muted) tracking-wide transition-all duration-300 focus:outline-none focus:bg-white focus:border-(--text-headline)/40 focus:ring-1 focus:ring-(--text-headline)/20"
						/>
					</div>
				</div>

				{/* Right Actions: Wishlist & Bag */}
				<div className="flex items-center space-x-5 sm:space-x-6 shrink-0">
					{/* Wishlist Link */}
					<Link
						href="/my-wishlist"
						className="text-(--text-headline) hover:opacity-60 transition-opacity relative p-1 cursor-pointer"
						aria-label="Wishlist"
					>
						<Heart className="w-4.5 h-4.5 stroke-[1.5]" />
						{totalWishlistCount > 0 && (
							<span className="absolute 0 right-0 translate-x-1/3 -translate-y-1/3 min-w-4 h-4 px-1 text-[8px] font-semibold rounded-full flex items-center justify-center bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs">
								{totalWishlistCount}
							</span>
						)}
					</Link>

					{/* Shopping Bag Link */}
					<Link
						href="/shopping-bag"
						className="text-(--text-headline) hover:opacity-60 transition-opacity relative p-1 cursor-pointer"
						aria-label="Shopping Bag"
					>
						<ShoppingBag className="w-4.5 h-4.5 stroke-[1.5]" />
						{totalCartCount > 0 && (
							<span className="absolute 0 right-0 translate-x-1/3 -translate-y-1/3 min-w-4 h-4 px-1 text-[8px] font-semibold rounded-full flex items-center justify-center bg-(--text-headline) text-(--bg-base) shadow-xs">
								{totalCartCount}
							</span>
						)}
					</Link>
				</div>
			</div>

			{/* --- DESKTOP CATEGORY NAVIGATION STRIP --- */}
			<nav className="hidden md:block w-full border-t border-(--border-color)/60 py-2.5">
				<div className="max-w-screen-2xl mx-auto px-8">
					<ul className="flex items-center justify-center space-x-9 overflow-x-auto whitespace-nowrap text-[11px] uppercase tracking-[0.22em] font-medium text-(--text-muted) hide-scrollbar">
						{navItems.map((item) => (
							<li key={item.name}>
								<Link
									href={item.href}
									className="relative py-1 hover:text-(--text-headline) transition-colors group inline-block"
								>
									<span>{item.name}</span>
									<span className="absolute inset-x-0 bottom-0 h-px bg-(--text-headline) scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
								</Link>
							</li>
						))}
					</ul>
				</div>
			</nav>

			{/* --- MOBILE DRAWER OVERLAY --- */}
			<div
				className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
					isOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				}`}
				onClick={() => setIsOpen(false)}
			/>

			{/* Mobile Slide-out Menu */}
			<div
				className={`fixed top-0 left-0 bottom-0 w-[84vw] max-w-xs bg-(--bg-base) border-r border-(--border-color) p-6 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden shadow-2xl ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div>
					{/* Drawer Header */}
					<div className="flex items-center justify-between pb-5 border-b border-(--border-color)">
						<span className="font-serif text-base tracking-[0.2em] font-medium uppercase">
							Navigation
						</span>
						<button
							onClick={() => setIsOpen(false)}
							aria-label="Close menu"
							className="p-1 -mr-1 text-(--text-headline) hover:opacity-60 transition-opacity cursor-pointer"
						>
							<X className="w-5 h-5 stroke-[1.5]" />
						</button>
					</div>

					{/* Mobile Enclosed Search */}
					<div className="mt-5 mb-6">
						<div className="relative flex items-center">
							<Search className="absolute left-3.5 w-3.5 h-3.5 text-(--text-muted)" />
							<input
								type="text"
								placeholder="Search pieces..."
								className="w-full bg-(--card-sub)/70 border border-(--border-color) rounded-full py-2 pl-9 pr-3 text-xs text-(--text-headline) placeholder-(--text-muted) focus:outline-none focus:border-(--text-headline)"
							/>
						</div>
					</div>

					{/* Category Links */}
					<ul className="flex flex-col space-y-3.5 py-1">
						{navItems.map((item) => (
							<li key={item.name}>
								<Link
									href={item.href}
									onClick={() => setIsOpen(false)}
									className="block text-xs uppercase tracking-[0.2em] font-medium text-(--text-headline) hover:text-(--text-muted) transition-colors py-1"
								>
									{item.name}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Mobile Drawer Footer */}
				<div className="pt-6 border-t border-(--border-color) flex flex-col space-y-3 text-xs tracking-wider font-light text-(--text-muted)">
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
						href="/coming-soon?feature=account"
						onClick={() => setIsOpen(false)}
					>
						Client Account
					</Link>
					<Link
						href="/coming-soon?feature=concierge"
						onClick={() => setIsOpen(false)}
					>
						Concierge & Care
					</Link>
				</div>
			</div>
		</header>
	);
}
