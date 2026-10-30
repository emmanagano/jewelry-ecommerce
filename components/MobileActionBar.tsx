"use client";

import React, {
	useEffect,
	useState,
	useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const noopSubscribe = () => () => {};
import { luxurySpring } from "@/app/lib/motion";

// Returns [ref, visible]. Attach `ref` to the page's inline call to action;
// `visible` is true while
// that element is off screen and the footer isn't showing, so the sticky bar
// never duplicates the inline button or covers the footer. A callback ref, so
// elements that mount later (after hydration) are still observed.
export function useMobileActionBar() {
	const [el, setEl] = useState<Element | null>(null);
	const [targetVisible, setTargetVisible] = useState(true);
	const [footerVisible, setFooterVisible] = useState(false);

	useEffect(() => {
		const footer = document.querySelector("footer");
		if (!el) return;
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.target === el) setTargetVisible(entry.isIntersecting);
				else setFooterVisible(entry.isIntersecting);
			}
		});
		observer.observe(el);
		if (footer) observer.observe(footer);
		return () => observer.disconnect();
	}, [el]);

	return [setEl, el !== null && !targetVisible && !footerVisible] as const;
}

// Phone-only bar pinned to the bottom of the screen, padded for the iPhone
// home indicator (needs viewportFit: "cover" in the root layout). Portaled to
// <body> because a transformed ancestor (page fade, motion wrappers) would
// otherwise become the containing block for `fixed`.
export default function MobileActionBar({
	visible,
	children,
}: {
	visible: boolean;
	children: React.ReactNode;
}) {
	const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
	if (!isClient) return null;

	return createPortal(
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ y: "100%" }}
					animate={{ y: 0 }}
					exit={{ y: "100%" }}
					transition={luxurySpring}
					className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-(--bg-base)/95 backdrop-blur-sm border-t border-(--border-color) px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
				>
					<div className="flex items-center gap-4">{children}</div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
}
