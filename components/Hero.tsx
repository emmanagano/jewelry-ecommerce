import React from "react";
import Link from "next/link";

export default function Hero() {
	return (
		<section className="w-full px-8 py-6 h-auto md:h-[80vh] min-h-150 bg-(--bg-base)">
			{/* Main Bento Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full w-full max-w-screen-2xl mx-auto">
				{/* LEFT BLOCK: Main Campaign */}
				<div className="bg-(--card-main) border border-(--border-color) p-10 flex flex-col justify-end h-125 md:h-full relative overflow-hidden group">
					<div className="relative z-10">
						<h1 className="font-primary text-large text-(--text-headline) leading-tight mb-4">
							From Your Heart <br /> To Theirs
						</h1>
						<p className="font-body text-base text-(--text-body) mb-8 max-w-md">
							Discover our newest collection of handcrafted pieces
							designed to celebrate every moment.
						</p>
						<Link
							href="/collections/new"
							className="inline-block font-secondary text-sm uppercase tracking-widest bg-(--accent-light) text-(--card-main) font-semibold px-8 py-4 hover:bg-white transition-colors"
						>
							Shop the Collection
						</Link>
					</div>
				</div>

				{/* RIGHT COLUMN: Sub-grid */}
				<div className="flex flex-col gap-4 h-full">
					{/* Top Row: 2 items on md screens, 3 on lg screens */}
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-37.5 md:h-2/5">
						{/* Square 1: Rings */}
						<div className="bg-(--card-sub) border border-(--border-color) flex items-end p-6 hover:brightness-125 transition-all cursor-pointer">
							<span className="font-secondary text-base text-(--text-headline) font-medium">
								Rings
							</span>
						</div>

						{/* Square 2: Necklaces */}
						<div className="bg-(--card-sub) border border-(--border-color) flex items-end p-6 hover:brightness-125 transition-all cursor-pointer">
							<span className="font-secondary text-base text-(--text-headline) font-medium">
								Necklaces
							</span>
						</div>

						{/* Square 3: Earrings (Hidden on md, visible on lg) */}
						<div className="hidden lg:flex bg-(--card-sub) border border-(--border-color) items-end p-6 hover:brightness-125 transition-all cursor-pointer">
							<span className="font-secondary text-base text-(--text-headline) font-medium">
								Earrings
							</span>
						</div>
					</div>

					{/* Bottom Row: Wide Rectangle */}
					<div className="bg-(--card-wide) border border-(--border-color) grow flex items-center p-10 hover:brightness-110 transition-all cursor-pointer relative overflow-hidden">
						<div className="relative z-10 w-full flex justify-between items-center">
							<div>
								<h2 className="font-primary text-2xl text-(--text-headline) mb-2">
									Lab-Grown Diamonds
								</h2>
								<p className="font-body text-sm text-(--text-muted)">
									Sustainable brilliance for everyday wear.
								</p>
							</div>
							<span className="font-secondary text-sm text-(--accent-blue) underline underline-offset-4 hover:text-(--accent-light) transition-colors">
								Explore
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
