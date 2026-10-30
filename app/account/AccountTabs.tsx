"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { ACCOUNT_TABS, type AccountTabId } from "./tabs";

const AccountTabContext = createContext<(tab: AccountTabId) => void>(() => {});

// Lets a card inside a panel jump to another tab (e.g. "All orders")
export function useAccountTab() {
	return useContext(AccountTabContext);
}

const NAV_ITEM_CLASS =
	"shrink-0 text-left py-2 text-label uppercase font-medium transition-colors cursor-pointer";

// Side navigation (a scrolling row on small screens) with one panel at a
// time. All panels stay mounted, so an edit in progress survives a tab switch.
export default function AccountTabs({
	initialTab,
	orderCount,
	panels,
}: {
	initialTab: AccountTabId;
	orderCount: number;
	panels: Record<AccountTabId, React.ReactNode>;
}) {
	const router = useRouter();
	const { signOut } = useAuth();
	const { totalWishlistCount } = useStore();
	const [tab, setTabState] = useState(initialTab);
	const [signingOut, setSigningOut] = useState(false);

	const setTab = useCallback((next: AccountTabId) => {
		setTabState(next);
		// Keep the tab in the URL so a refresh or shared link returns here
		const url = next === "overview" ? "/account" : `/account?tab=${next}`;
		window.history.replaceState(null, "", url);
		window.scrollTo({ top: 0 });
	}, []);

	const counts: Partial<Record<AccountTabId, number>> = {
		orders: orderCount,
		saved: totalWishlistCount,
	};

	return (
		<AccountTabContext.Provider value={setTab}>
			<div className="grid grid-cols-1 lg:grid-cols-[13rem_1fr] gap-x-16 gap-y-8">
				<nav
					aria-label="Account"
					className="flex lg:flex-col gap-x-8 lg:gap-x-0 lg:gap-y-1 overflow-x-auto lg:overflow-visible border-b lg:border-b-0 border-(--border-color) lg:sticky lg:top-40 lg:self-start"
				>
					{ACCOUNT_TABS.map(({ id, label }) => {
						const active = tab === id;
						const count = counts[id];
						return (
							<button
								key={id}
								type="button"
								onClick={() => setTab(id)}
								aria-current={active ? "page" : undefined}
								className={`${NAV_ITEM_CLASS} ${
									active
										? "text-(--text-headline) lg:border-l-2 lg:border-(--accent) lg:pl-4 border-b-2 border-(--accent) lg:border-b-0"
										: "text-(--text-muted) hover:text-(--text-headline) lg:border-l-2 lg:border-transparent lg:pl-4"
								}`}
							>
								{label}
								{count ? (
									<span className="ml-2 text-(--text-muted)">({count})</span>
								) : null}
							</button>
						);
					})}
					<button
						type="button"
						disabled={signingOut}
						onClick={async () => {
							setSigningOut(true);
							await signOut();
							router.push("/");
							router.refresh();
						}}
						className={`${NAV_ITEM_CLASS} text-(--text-muted) hover:text-(--text-headline) lg:mt-6 lg:pt-6 lg:border-t lg:border-(--border-color) lg:pl-4 disabled:opacity-50`}
					>
						{signingOut ? "Signing out..." : "Sign Out"}
					</button>
				</nav>

				<div className="min-w-0">
					{ACCOUNT_TABS.map(({ id }) => (
						<div key={id} hidden={tab !== id}>
							{panels[id]}
						</div>
					))}
				</div>
			</div>
		</AccountTabContext.Provider>
	);
}
