"use client"; // 1. Added this so we can use React state and localStorage for the Likes feature later

import React from "react";
import { Search, Heart, ShoppingBag, ChevronDown } from "lucide-react";
import Link from "next/link";

// 2. Moved categories outside the component so it doesn't recreate this array on every render
const CATEGORIES = [
	"Bracelets",
	"Rings",
	"Necklaces",
	"Earrings",
	"Engraving",
	"Gifts",
];

export default function Navbar() {
	return (
		<header className="w-full bg-[#0A0A0A] text-white">
			{/* --- TOP NAVBAR --- */}
			<div className="flex items-center justify-between px-8 py-5">
				{/* Left: Brand/Logo */}
				<div className="shrink-0">
					<Link href="/">
						{/* 3. Applied your custom primary font and large size to the logo */}
						<span className="font-primary text-large font-bold tracking-widest uppercase cursor-pointer">
							BrandLogo
						</span>
					</Link>
				</div>

				{/* Center: Search Bar */}
				<div className="hidden md:flex flex-1 justify-center px-8">
					<div className="relative w-full max-w-md flex items-center group">
						<Search className="absolute left-0 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" />
						<input
							type="text"
							placeholder="Search"
							// 4. Applied your custom body font to the search input
							className="font-body w-full bg-transparent border-b border-gray-500 py-1 pl-8 pr-4 text-base text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
						/>
					</div>
				</div>

				{/* Right: Actions (Likes & Cart) */}
				<div className="flex items-center space-x-6 shrink-0">
					{/* Likes Button */}
					<Link
						href="/likes"
						className="hover:text-gray-300 transition-colors relative"
						aria-label="View Liked Items"
					>
						<Heart className="w-6 h-6" />
						{/* We will add the counter badge here in the next step */}
					</Link>

					{/* Cart Button */}
					<button
						className="hover:text-gray-300 transition-colors"
						aria-label="View Shopping Cart"
					>
						<ShoppingBag className="w-6 h-6" />
					</button>
				</div>
			</div>

			{/* --- CATEGORY NAVBAR --- */}
			<nav className="w-full px-8 pb-4">
				{/* 5. Applied your custom secondary font to the category links */}
				<ul className="font-secondary flex items-center justify-center space-x-8 overflow-x-auto whitespace-nowrap text-base font-medium text-gray-200 hide-scrollbar">
					{CATEGORIES.map((category) => (
						<li key={category}>
							<Link
								href={`/category/${category.toLowerCase().replace(/ /g, "-")}`}
								className="hover:text-white transition-colors"
							>
								{category}
							</Link>
						</li>
					))}
					{/* 'More' dropdown item */}
					<li className="flex items-center cursor-pointer hover:text-white transition-colors group">
						<span>More</span>
						<ChevronDown className="w-4 h-4 ml-1 group-hover:translate-y-0.5 transition-transform" />
					</li>
				</ul>
			</nav>
		</header>
	);
}
