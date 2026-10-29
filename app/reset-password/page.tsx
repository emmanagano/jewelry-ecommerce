import type { Metadata } from "next";
import AuthPanel from "@/components/AuthPanel";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
	title: "Set a New Password",
	robots: { index: false },
};

// Reached from the reset email (via /auth/confirm, which signs the visitor in)
// or from the account page's "Change password" link
export default function ResetPasswordPage() {
	return (
		<AuthPanel eyebrow="Client Account" title="Set a new password">
			<ResetPasswordForm />
		</AuthPanel>
	);
}
