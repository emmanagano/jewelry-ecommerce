"use client";

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";

// Our standard Quiet Luxury physics
const luxurySpring = {
	type: "spring" as const,
	damping: 30,
	stiffness: 100,
	mass: 0.8,
};

// We separate the actual animated content into its own component
// so we can safely wrap it in <Suspense> (a Next.js requirement when using useSearchParams)
function AnimatedTemplate({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Combine the path and the query string to create a 100% unique key
	const urlKey = `${pathname}?${searchParams.toString()}`;

	return (
		<motion.div
			key={urlKey}
			initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
			animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
			transition={{
				...luxurySpring,
				duration: 1.2,
				delay: 0.1,
			}}
			className="w-full h-full"
		>
			{children}
		</motion.div>
	);
}

export default function Template({ children }: { children: React.ReactNode }) {
	return (
		// Suspense is required by Next.js when reading URL parameters globally
		<Suspense fallback={<div>{children}</div>}>
			<AnimatedTemplate>{children}</AnimatedTemplate>
		</Suspense>
	);
}
