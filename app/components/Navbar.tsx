import React from "react";
import { Search, Heart, ShoppingBag, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
	const categories = [
		"Holiday",
		"New & featured",
		"Charms",
		"Bracelets",
		"Rings",
		"Necklaces",
		"Earrings",
		"Lab-grown diamonds",
		"Engraving",
		"Gifts",
		"Jewelry guide",
	];

	return (
		<header className="w-full bg-[#0A0A0A] text-white">
			{/* --- TOP NAVBAR --- */}
			<div className="flex items-center justify-between px-8 py-5">
				{/* Left: Brand/Logo */}
				<div className="shrink-0">
					<Link href="/">
						{/* Replace with actual SVG logo if you have it */}
						<span className="text-2xl font-bold tracking-widest uppercase cursor-pointer">
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
							className="w-full bg-transparent border-b border-gray-500 py-1 pl-8 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
						/>
					</div>
				</div>

				{/* Right: Actions (Likes & Cart) */}
				<div className="flex items-center space-x-6 shrink-0">
					{/* Likes Button */}
					<Link
						href="/likes"
						className="hover:text-gray-300 transition-colors relative"
					>
						<Heart className="w-6 h-6" />
						{/* Optional: Add a badge here later for liked items count */}
					</Link>

					{/* Cart Button */}
					<button className="hover:text-gray-300 transition-colors">
						<ShoppingBag className="w-6 h-6" />
					</button>
				</div>
			</div>

			{/* --- CATEGORY NAVBAR --- */}
			<nav className="w-full px-8 pb-4">
				<ul className="flex items-center justify-center space-x-8 overflow-x-auto whitespace-nowrap text-sm font-medium text-gray-200 hide-scrollbar">
					{categories.map((category) => (
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
