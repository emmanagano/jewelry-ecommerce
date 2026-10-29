import type { Metadata } from "next";
import Link from "next/link";
import AuthPanel from "@/components/AuthPanel";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
	title: "Reset Password",
	robots: { index: false },
};

export default function ForgotPasswordPage() {
	return (
		<AuthPanel eyebrow="Client Account" title="Forgot your password?">
			<ForgotPasswordForm />
			<p className="mt-8 pt-6 border-t border-(--border-color)/60 text-center eyebrow text-(--text-muted)">
				Remembered it?{" "}
				<Link
					href="/login"
					className="underline underline-offset-4 font-semibold text-(--text-headline)"
				>
					Sign In
				</Link>
			</p>
		</AuthPanel>
	);
}
