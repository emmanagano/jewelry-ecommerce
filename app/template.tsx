"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// A light fade-and-rise on each route change. Keyed on the pathname only, so
// changing filters or sort (search params) doesn't replay the transition or
// remount the page. Opacity/transform only — animating blur is costly.
function AnimatedTemplate({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<motion.div
			key={pathname}
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
			className="w-full h-full"
		>
			{children}
		</motion.div>
	);
}

export default function Template({ children }: { children: React.ReactNode }) {
	return (
		// usePathname() is URL data, so it needs a Suspense boundary on routes
		// whose paths aren't known at build time (e.g. /orders/[id]). The
		// fallback renders the page without the animation.
		<Suspense fallback={<div className="w-full h-full">{children}</div>}>
			<AnimatedTemplate>{children}</AnimatedTemplate>
		</Suspense>
	);
}
