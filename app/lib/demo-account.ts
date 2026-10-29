// Shared demo account so visitors (recruiters) can try signed-in features
// without signing up with a real email. Create the user in Supabase with
// "Auto Confirm User" checked, then set both env vars. Unset = the demo
// login is hidden. These are public on purpose: anyone may use them.
const email = process.env.NEXT_PUBLIC_DEMO_EMAIL?.trim();
const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

export const DEMO_ACCOUNT =
	email && password ? { email: email.toLowerCase(), password } : null;

// The demo account is shared, so its password must not be changed
export function isDemoAccount(userEmail: string | null | undefined) {
	return Boolean(
		DEMO_ACCOUNT && userEmail && userEmail.toLowerCase() === DEMO_ACCOUNT.email,
	);
}
