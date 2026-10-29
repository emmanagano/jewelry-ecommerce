"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isDemoAccount } from "@/app/lib/demo-account";
import { createSupabaseBrowserClient } from "@/app/lib/supabase-browser";
import {
	AUTH_BUTTON_CLASS,
	AUTH_INPUT_CLASS,
	AuthMessage,
} from "@/components/AuthPanel";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordForm() {
	const router = useRouter();
	const { user, isAuthReady } = useAuth();
	const [password, setPassword] = useState("");
	const [confirm, setConfirm] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	if (!isAuthReady) {
		return <div className="h-40 bg-(--card-sub) rounded-xs animate-pulse" />;
	}

	// The reset link signs the visitor in; without a session it expired or
	// was opened in a different browser
	if (!user) {
		return (
			<div className="text-center">
				<AuthMessage tone="error">
					This reset link has expired or was opened in a different
					browser.
				</AuthMessage>
				<Link
					href="/forgot-password"
					className="text-label uppercase font-medium underline underline-offset-4 text-(--text-headline)"
				>
					Request a new link
				</Link>
			</div>
		);
	}

	if (isDemoAccount(user.email)) {
		return (
			<div className="text-center">
				<AuthMessage tone="error">
					The shared demo account&rsquo;s password can&rsquo;t be changed.
				</AuthMessage>
				<Link
					href="/account"
					className="text-label uppercase font-medium underline underline-offset-4 text-(--text-headline)"
				>
					Back to your account
				</Link>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);

		if (password !== confirm) {
			setErrorMessage("The passwords don't match.");
			return;
		}

		setLoading(true);
		const { error } = await createSupabaseBrowserClient().auth.updateUser({
			password,
		});
		setLoading(false);

		if (error) {
			setErrorMessage(error.message);
			return;
		}
		router.push("/account?password=updated");
		router.refresh();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{errorMessage && <AuthMessage tone="error">{errorMessage}</AuthMessage>}
			<p className="font-body text-xs leading-relaxed text-(--text-body) text-center mb-2">
				Choose a new password for {user.email ?? "your account"}.
			</p>
			<input
				type="password"
				required
				minLength={MIN_PASSWORD_LENGTH}
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder={`New password (${MIN_PASSWORD_LENGTH}+ characters)`}
				aria-label="New password"
				autoComplete="new-password"
				className={AUTH_INPUT_CLASS}
			/>
			<input
				type="password"
				required
				minLength={MIN_PASSWORD_LENGTH}
				value={confirm}
				onChange={(e) => setConfirm(e.target.value)}
				placeholder="Confirm new password"
				aria-label="Confirm new password"
				autoComplete="new-password"
				className={AUTH_INPUT_CLASS}
			/>
			<button type="submit" disabled={loading} className={AUTH_BUTTON_CLASS}>
				{loading ? "Saving..." : "Save Password"}
			</button>
		</form>
	);
}
