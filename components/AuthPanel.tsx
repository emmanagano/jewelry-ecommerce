import React from "react";

export const AUTH_INPUT_CLASS =
	"w-full bg-(--card-sub)/50 border border-(--border-color) rounded-xs py-3.5 px-4 text-copy-sm text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-(--surface) transition-all";

export const AUTH_BUTTON_CLASS =
	"w-full py-4 px-6 rounded-xs bg-(--text-headline) text-(--bg-base) text-label uppercase font-medium shadow-xs hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer";

// Centered card shared by the password and account pages
export default function AuthPanel({
	eyebrow,
	title,
	children,
}: {
	eyebrow: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center py-16 px-4 sm:px-8 bg-(--bg-base)">
			<div className="w-full max-w-md rounded-2xl bg-(--surface) border border-(--border-color) shadow-[0_20px_50px_rgba(30,6,10,0.06)] p-8 sm:p-10">
				<div className="text-center mb-8">
					<span className="eyebrow text-(--text-muted) font-medium block mb-3">
						{eyebrow}
					</span>
					<h1 className="font-primary text-2xl sm:text-3xl tracking-tight text-(--text-headline)">
						{title}
					</h1>
				</div>
				{children}
			</div>
		</div>
	);
}

export function AuthMessage({
	tone,
	children,
}: {
	tone: "error" | "success";
	children: React.ReactNode;
}) {
	return (
		<div
			role={tone === "error" ? "alert" : "status"}
			className={`mb-5 p-3 rounded-xs text-xs font-body text-center border ${
				tone === "error"
					? "text-(--error-text) bg-(--error-bg) border-(--error-border)"
					: "text-(--text-headline) bg-(--card-main)/60 border-(--border-color)"
			}`}
		>
			{children}
		</div>
	);
}
