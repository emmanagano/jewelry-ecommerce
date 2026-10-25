import React from "react";
import Link from "next/link";

export default function Hero() {
	return (
		<section className="w-full px-8 py-6 h-auto md:h-[80vh] min-h-150">
			{/* Main Bento Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full max-w-screen-2xl mx-auto">
				{/* LEFT BLOCK: Main Campaign */}
				{/* Using a dark charcoal placeholder. Later, replace bg-[#1A1A1A] with a background image */}
				<div className="bg-[#1A1A1A] rounded-2xl p-10 flex flex-col justify-end h-125 md:h-full relative overflow-hidden group">
					<div className="relative z-10">
						<h1 className="font-primary text-large text-white leading-tight mb-4">
							From Your Heart <br /> To Theirs
						</h1>
						<p className="font-body text-base text-gray-300 mb-8 max-w-md">
							Discover our newest collection of handcrafted pieces
							designed to celebrate every moment.
						</p>
						<Link
							href="/collections/new"
							className="font-secondary text-sm uppercase tracking-widest bg-white text-black px-8 py-3 rounded-full hover:bg-gray-200 transition-colors"
						>
							Shop the Collection
						</Link>
					</div>
				</div>

				{/* RIGHT COLUMN: Sub-grid for the remaining blocks */}
				<div className="flex flex-col gap-4 h-full">
					{/* Top Row: Three Squares */}
					<div className="grid grid-cols-3 gap-4 h-37.5 md:h-2/5">
						{/* Square 1: Rings */}
						<div className="bg-[#1F1F1F] rounded-2xl flex items-end p-6 hover:bg-[#2A2A2A] transition-colors cursor-pointer">
							<span className="font-secondary text-base text-white font-medium">
								Rings
							</span>
						</div>

						{/* Square 2: Necklaces */}
						<div className="bg-[#1F1F1F] rounded-2xl flex items-end p-6 hover:bg-[#2A2A2A] transition-colors cursor-pointer">
							<span className="font-secondary text-base text-white font-medium">
								Necklaces
							</span>
						</div>

						{/* Square 3: Earrings */}
						<div className="bg-[#1F1F1F] rounded-2xl flex items-end p-6 hover:bg-[#2A2A2A] transition-colors cursor-pointer">
							<span className="font-secondary text-base text-white font-medium">
								Earrings
							</span>
						</div>
					</div>

					{/* Bottom Row: Wide Rectangle */}
					<div className="bg-[#1A1A1A] rounded-2xl grow flex items-center p-10 hover:bg-[#222222] transition-colors cursor-pointer relative overflow-hidden">
						<div className="relative z-10 w-full flex justify-between items-center">
							<div>
								<h2 className="font-primary text-2xl text-white mb-2">
									Lab-Grown Diamonds
								</h2>
								<p className="font-body text-sm text-gray-400">
									Sustainable brilliance for everyday wear.
								</p>
							</div>
							<span className="font-secondary text-sm text-white underline underline-offset-4">
								Explore
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
