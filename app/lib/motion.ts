import type { Transition, Variants } from "framer-motion";

// Our standard "Quiet Luxury" physics
export const luxurySpring = {
	type: "spring" as const,
	damping: 30,
	stiffness: 100,
	mass: 0.8,
};

// Parent variant that staggers its children's entrance
export function staggerContainer(
	staggerChildren = 0.1,
	delayChildren = 0,
): Variants {
	return {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: { staggerChildren, delayChildren },
		},
	};
}

// Child variant: fade in while sliding `y` pixels into place
export function fadeSlide(y = 20, transition: Transition = {}): Variants {
	return {
		hidden: { opacity: 0, y },
		show: { opacity: 1, y: 0, transition: { ...luxurySpring, ...transition } },
	};
}
