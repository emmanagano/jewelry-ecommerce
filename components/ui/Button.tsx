import React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "inverse" | "inverse-outline" | "link";

const BASE =
	"inline-flex items-center justify-center gap-2 font-sans text-label font-medium uppercase transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const VARIANTS: Record<Variant, string> = {
	primary:
		"px-7 py-3.5 rounded-xs bg-(--text-headline) text-(--bg-base) hover:bg-(--accent)",
	secondary:
		"px-7 py-3.5 rounded-xs border border-(--text-headline) text-(--text-headline) hover:bg-(--text-headline) hover:text-(--bg-base)",
	// For use on photography
	inverse:
		"px-7 py-3.5 rounded-xs bg-(--bg-base) text-(--text-headline) hover:bg-white",
	"inverse-outline":
		"px-7 py-3.5 rounded-xs border border-(--bg-base) text-(--bg-base) hover:bg-(--bg-base) hover:text-(--text-headline)",
	link: "pb-0.5 border-b border-current text-(--text-headline) hover:text-(--accent)",
};

export function buttonClass(variant: Variant = "primary", className = "") {
	return `${BASE} ${VARIANTS[variant]} ${className}`;
}

type ButtonProps = {
	variant?: Variant;
	className?: string;
	children: React.ReactNode;
} & (
	| ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
	| ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
);

// A link when given href, otherwise a button
export default function Button({
	variant = "primary",
	className = "",
	children,
	...props
}: ButtonProps) {
	if (typeof props.href === "string") {
		const { href, ...linkProps } = props as { href: string } & Omit<
			React.ComponentProps<typeof Link>,
			"href" | "className"
		>;
		return (
			<Link href={href} className={buttonClass(variant, className)} {...linkProps}>
				{children}
			</Link>
		);
	}
	const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
	return (
		<button
			type={buttonProps.type ?? "button"}
			className={buttonClass(variant, className)}
			{...buttonProps}
		>
			{children}
		</button>
	);
}
