import React from "react";

// Page-width container with the site's vertical rhythm
export default function Section({
	children,
	className = "",
	bleed = false,
}: {
	children: React.ReactNode;
	className?: string;
	// Full width (no max-width or side padding), e.g. for a hero
	bleed?: boolean;
}) {
	return (
		<section
			className={`${bleed ? "" : "max-w-screen-2xl mx-auto px-4 sm:px-8"} py-20 lg:py-28 ${className}`}
		>
			{children}
		</section>
	);
}
