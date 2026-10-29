"use client";

import React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

// A light fade-and-rise on each route change. Keyed on the pathname only, so
// changing filters or sort (search params) doesn't replay the transition or
// remount the page. Opacity/transform only — animating blur is costly.
export default function Template({ children }: { children: React.ReactNode }) {
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
