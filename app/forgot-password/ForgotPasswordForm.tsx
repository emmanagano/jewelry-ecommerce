"use client";

import React, { useState } from "react";
import { createSupabaseBrowserClient } from "@/app/lib/supabase-browser";
import {
	AUTH_BUTTON_CLASS,
	AUTH_INPUT_CLASS,
	AuthMessage,
} from "@/components/AuthPanel";

export default function ForgotPasswordForm() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage(null);

		const { error } = await createSupabaseBrowserClient().auth.resetPasswordForEmail(
			email,
			{
				redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
			},
		);

		setLoading(false);
		// Rate limits are worth reporting; anything else gets the same message
		// as success, so the form doesn't reveal which emails have accounts
		if (error?.status === 429) {
			setErrorMessage(
				"Too many requests. Please wait a few minutes and try again.",
			);
		} else {
			setSent(true);
		}
	};

	if (sent) {
		return (
			<AuthMessage tone="success">
				If an account exists for {email}, a link to reset your password is
				on its way. It expires after one hour.
			</AuthMessage>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{errorMessage && <AuthMessage tone="error">{errorMessage}</AuthMessage>}
			<p className="font-body text-xs leading-relaxed text-(--text-body) text-center mb-2">
				Enter your email and we&rsquo;ll send you a link to choose a new
				password.
			</p>
			<input
				type="email"
				required
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Client Email"
				aria-label="Email"
				autoComplete="email"
				className={AUTH_INPUT_CLASS}
			/>
			<button type="submit" disabled={loading} className={AUTH_BUTTON_CLASS}>
				{loading ? "Sending..." : "Send Reset Link"}
			</button>
		</form>
	);
}
