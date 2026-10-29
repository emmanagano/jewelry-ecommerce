import React from "react";

// Eyebrow + serif title, with an optional action (e.g. "View all") on the right
export default function SectionHeading({
	eyebrow,
	title,
	action,
	align = "left",
	as: Tag = "h2",
}: {
	eyebrow?: string;
	title: string;
	action?: React.ReactNode;
	align?: "left" | "center";
	as?: "h1" | "h2";
}) {
	const centered = align === "center";
	return (
		<div
			className={`mb-10 lg:mb-12 flex gap-6 ${
				centered
					? "flex-col items-center text-center"
					: "flex-col sm:flex-row sm:items-end sm:justify-between"
			}`}
		>
			<div>
				{eyebrow && (
					<span className="eyebrow block mb-3 text-(--text-muted)">{eyebrow}</span>
				)}
				<Tag className="font-serif text-heading lg:text-title tracking-tight text-(--text-headline)">
					{title}
				</Tag>
			</div>
			{action && <div className="shrink-0">{action}</div>}
		</div>
	);
}
