import React from "react";
import EditorialShowcase from "@/components/EditorialShowcase";
import GlassAuthCard from "@/components/GlassAuthCard";

export default function ClientLoginPage() {
	return (
		<main className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-center items-center py-10 px-4 sm:px-8 bg-(--bg-base)">
			<div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[620px] lg:h-[72vh] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(30,6,10,0.05)] border border-(--border-color)">
				{/* LEFT: Restrained 6-column editorial column */}
				<div className="hidden lg:block lg:col-span-6 h-full relative overflow-hidden">
					<EditorialShowcase />
				</div>

				{/* RIGHT: Perfectly centered auth salon desk (6 cols) */}
				<div className="col-span-1 lg:col-span-6 flex items-center justify-center p-8 sm:p-12 lg:p-14 bg-white/40 backdrop-blur-sm">
					<GlassAuthCard />
				</div>
			</div>
		</main>
	);
}
