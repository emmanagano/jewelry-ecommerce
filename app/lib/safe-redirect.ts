// Only allow same-site relative paths as redirect targets ("/account"), never
// "//evil.com" or "https://evil.com", so links can't bounce users off-site.
export function safeNextPath(next: string | null | undefined, fallback = "/") {
	if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
	if (next.includes("\\")) return fallback;
	return next;
}
