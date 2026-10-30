// Shared by the server page (to pick the first tab from ?tab=) and the client
// tab shell, so it can't live in a "use client" file
export const ACCOUNT_TABS = [
	{ id: "overview", label: "Overview" },
	{ id: "orders", label: "Orders" },
	{ id: "saved", label: "Saved Pieces" },
	{ id: "details", label: "Details & Sizes" },
	{ id: "preferences", label: "Preferences" },
] as const;

export type AccountTabId = (typeof ACCOUNT_TABS)[number]["id"];

export function parseAccountTab(value: string | undefined): AccountTabId {
	return ACCOUNT_TABS.find((tab) => tab.id === value)?.id ?? "overview";
}
