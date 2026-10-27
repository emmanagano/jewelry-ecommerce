"use client";

import React, { useState } from "react";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { totalCartCount, totalWishlistCount } = useStore();

	// Explicitly assign the correct route to each link
	const navItems = [
		{
			name: "New & featured",
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
		<header className="w-full bg-(--bg-base) text-(--text-headline) border-b border-(--border-color) relative z-50">
			{/* --- TOP NAVBAR --- */}
			<div className="flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5">
				{/* Mobile: Hamburger Button */}
				<div className="flex items-center md:hidden">
					<button
						onClick={() => setIsOpen(true)}
						aria-label="Open menu"
						className="p-1 -ml-1 text-(--text-headline) hover:opacity-70 transition-opacity"
					>
						<Menu className="w-6 h-6 stroke-[1.5]" />
					</button>
				</div>

				{/* Brand/Logo */}
				<div className="shrink-0">
					<Link href="/">
						<span className="font-primary text-xl sm:text-2xl font-bold tracking-widest uppercase cursor-pointer">
							BrandLogo
						</span>
					</Link>
				</div>

				{/* Desktop: Centered Search Bar */}
				<div className="hidden md:flex flex-1 justify-center px-8">
					<div className="relative w-full max-w-md flex items-center group">
						<Search className="absolute left-0 w-4 h-4 text-(--text-muted) group-focus-within:text-(--text-headline) transition-colors" />
						<input
							type="text"
							placeholder="Search"
							className="w-full bg-transparent border-b border-(--border-color) py-1 pl-7 pr-4 text-sm text-(--text-headline) placeholder-(--text-muted) focus:outline-none focus:border-(--text-headline) transition-colors"
						/>
					</div>
				</div>

				{/* Right: Actions (Likes & Cart) */}
				<div className="flex items-center space-x-4 sm:space-x-6 shrink-0">
					{/* Wishlist Link with dynamic badge */}
					<Link
						href="/likes"
						className="text-(--text-headline) hover:opacity-70 transition-opacity relative"
						aria-label="Wishlist"
					>
						<Heart className="w-5 h-5 stroke-[1.5]" />
						{totalWishlistCount > 0 && (
							<span
								className="absolute -top-1.5 -right-2 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center text-white"
								style={{ backgroundColor: "#f43f5e" }}
							>
								{totalWishlistCount}
							</span>
						)}
					</Link>

					{/* Shopping Bag Button with dynamic badge */}
					<Link
						className="text-(--text-headline) hover:opacity-70 transition-opacity relative cursor-pointer"
						aria-label="Shopping Bag"
						href={"/shopping-bag"}
					>
						<ShoppingBag className="w-5 h-5 stroke-[1.5]" />
						{totalCartCount > 0 && (
							<span
								className="absolute -top-1.5 -right-2 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center text-white"
								style={{
									backgroundColor: "var(--accent-blue)",
								}}
							>
								{totalCartCount}
							</span>
						)}
					</Link>
				</div>
			</div>

			{/* --- DESKTOP CATEGORY NAVBAR (Hidden on mobile) --- */}
			<nav className="hidden md:block w-full px-8 pb-4">
				<ul className="flex items-center justify-center space-x-8 overflow-x-auto whitespace-nowrap text-xs uppercase tracking-widest font-secondary text-(--text-muted) hide-scrollbar">
					{navItems.map((item) => (
						<li key={item.name}>
							<Link
								href={item.href}
								className="hover:text-(--text-headline) transition-colors"
							>
								{item.name}
							</Link>
						</li>
					))}
				</ul>
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

			{/* Slide-out Menu Panel */}
			<div
				className={`fixed top-0 left-0 bottom-0 w-[82vw] max-w-sm bg-(--bg-base) border-r border-(--border-color) p-6 flex flex-col justify-between transition-transform duration-300 ease-out md:hidden shadow-2xl ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div>
					{/* Header inside drawer */}
					<div className="flex items-center justify-between pb-6 border-b border-(--border-color)">
						<span className="font-primary text-lg font-bold tracking-widest uppercase">
							Menu
						</span>
						<button
							onClick={() => setIsOpen(false)}
							aria-label="Close menu"
							className="p-1 -mr-1 text-(--text-headline) hover:opacity-70 transition-opacity"
						>
							<X className="w-5 h-5 stroke-[1.5]" />
						</button>
					</div>

					{/* Mobile Search Bar */}
					<div className="mt-6 mb-6">
						<div className="relative flex items-center">
							<Search className="absolute left-0 w-4 h-4 text-(--text-muted)" />
							<input
								type="text"
								placeholder="Search pieces..."
								className="w-full bg-transparent border-b border-(--border-color) py-1.5 pl-7 pr-2 text-sm text-(--text-headline) placeholder-(--text-muted) focus:outline-none focus:border-(--text-headline)"
							/>
						</div>
					</div>

					{/* Category Links */}
					<ul className="flex flex-col space-y-4 py-2">
						{navItems.map((item) => (
							<li key={item.name}>
								<Link
									href={item.href}
									onClick={() => setIsOpen(false)}
									className="block text-sm uppercase tracking-widest font-secondary text-(--text-headline) hover:text-(--accent-blue) transition-colors py-1"
								>
									{item.name}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Bottom of drawer: Account & Customer Care */}
				<div className="pt-6 border-t border-(--border-color) flex flex-col space-y-3 text-xs tracking-wider font-secondary text-(--text-muted)">
					<Link
						href="/shopping-bag"
						onClick={() => setIsOpen(false)}
						className="flex items-center justify-between text-(--text-headline) font-medium"
					>
						<span>Shopping Bag</span>
						{totalCartCount > 0 && (
							<span
								className="text-[10px] px-2 py-0.5 rounded-full text-white"
								style={{
									backgroundColor: "var(--accent-blue)",
								}}
							>
								{totalCartCount}
							</span>
						)}
					</Link>
					<Link
						href="/likes"
						onClick={() => setIsOpen(false)}
						className="flex items-center justify-between"
					>
						<span>Saved Pieces</span>
						{totalWishlistCount > 0 && (
							<span className="text-[10px] px-2 py-0.5 rounded-full text-white bg-[#f43f5e]">
								{totalWishlistCount}
							</span>
						)}
					</Link>
					<Link href="/account" onClick={() => setIsOpen(false)}>
						My Account
					</Link>
					<Link href="/contact" onClick={() => setIsOpen(false)}>
						Customer Care
					</Link>
				</div>
			</div>
		</header>
	);
}
