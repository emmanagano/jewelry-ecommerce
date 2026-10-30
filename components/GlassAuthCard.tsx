"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { AuthError } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/app/lib/supabase-browser";
import { safeNextPath } from "@/app/lib/safe-redirect";
import { DEMO_ACCOUNT } from "@/app/lib/demo-account";
import { motion, AnimatePresence } from "framer-motion";
import { luxurySpring } from "@/app/lib/motion";

// Where email links land; see app/auth/confirm/route.ts
function confirmUrl(next: string) {
	return `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`;
}

// Explains why the visitor was sent back here from an email link
function LinkErrorNotice() {
	const searchParams = useSearchParams();
	if (searchParams.get("error") !== "link-invalid") return null;
	return (
		<div role="alert" className="mb-5 p-3 rounded-xs text-copy-sm text-(--error-text) bg-(--error-bg) border border-(--error-border)">
			That link has expired or was already used. Sign in, or request a new
			link.
		</div>
	);
}

export default function GlassAuthCard() {
	const router = useRouter();
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [needsConfirmation, setNeedsConfirmation] = useState(false);

	const resendConfirmation = async () => {
		setErrorMessage(null);
		const { error } = await createSupabaseBrowserClient().auth.resend({
			type: "signup",
			email,
			options: { emailRedirectTo: confirmUrl("/account") },
		});
		if (error) {
			setErrorMessage(error.message);
		} else {
			setNeedsConfirmation(false);
			setSuccessMessage("A new confirmation link is on its way.");
		}
	};

	// Fills the shared demo login (and switches to sign-in) so visitors don't
	// need to use a real email
	const fillDemoLogin = () => {
		if (!DEMO_ACCOUNT) return;
		setIsSignUp(false);
		setEmail(DEMO_ACCOUNT.email);
		setPassword(DEMO_ACCOUNT.password);
		setErrorMessage(null);
		setSuccessMessage(null);
		setNeedsConfirmation(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage(null);
		setSuccessMessage(null);
		setNeedsConfirmation(false);
		const supabase = createSupabaseBrowserClient();

		try {
			if (isSignUp) {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: { full_name: fullName },
						emailRedirectTo: confirmUrl("/account"),
					},
				});
				if (error) throw error;
				// Same message whether or not the email was already registered,
				// so the form doesn't reveal who has an account
				setSuccessMessage(
					"We have sent a confirmation link to your email. Please open it to continue.",
				);
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				});
				if (error) throw error;
				const next = new URLSearchParams(window.location.search).get(
					"next",
				);
				router.push(safeNextPath(next, "/account"));
				router.refresh();
			}
		} catch (err: unknown) {
			if (err instanceof AuthError && err.code === "email_not_confirmed") {
				setNeedsConfirmation(true);
				setErrorMessage(
					"Please confirm your email before signing in. The link is waiting in your inbox.",
				);
			} else if (err instanceof Error) {
				setErrorMessage(err.message);
			} else {
				setErrorMessage("We could not sign you in. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	const fieldClass =
		"mt-2 w-full bg-(--surface) border border-(--border-color) rounded-xs px-4 py-3.5 text-copy-sm text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline) transition-colors";
	const labelClass = "block text-label uppercase text-(--text-headline)";

	const switchMode = () => {
		setIsSignUp(!isSignUp);
		setErrorMessage(null);
		setSuccessMessage(null);
		setNeedsConfirmation(false);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ ...luxurySpring, duration: 1 }}
			className="w-full max-w-sm mx-auto"
		>
			{/* Heading */}
			<span className="eyebrow block mb-4 text-(--text-muted)">Client Account</span>
			<h1 className="font-serif text-heading sm:text-title tracking-tight text-(--text-headline)">
				{isSignUp ? "Create your account" : "Welcome back"}
			</h1>
			<p className="mt-3 text-copy text-(--text-body)">
				{isSignUp
					? "Save pieces, keep your sizes and see your orders in one place."
					: "Sign in to see your saved pieces, sizes and orders."}
			</p>

			{/* Demo login for visitors exploring the site */}
			{DEMO_ACCOUNT && (
				<p className="mt-6 pt-6 border-t border-(--border-color) text-copy-sm text-(--text-muted)">
					Just exploring?{" "}
					<button
						type="button"
						onClick={fillDemoLogin}
						className="text-(--text-headline) border-b border-current hover:text-(--accent) transition-colors cursor-pointer"
					>
						Use the demo account
					</button>
					{isSignUp ? " instead. No real email needed." : ". No real email needed."}
				</p>
			)}

			{/* Notices */}
			<div className="mt-6">
				<Suspense fallback={null}>
					<LinkErrorNotice />
				</Suspense>
				<AnimatePresence mode="popLayout">
					{errorMessage && (
						<motion.div
							key="error"
							role="alert"
							initial={{ opacity: 0, y: -6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							className="mb-5 p-3 rounded-xs text-copy-sm text-(--error-text) bg-(--error-bg) border border-(--error-border)"
						>
							{errorMessage}
							{needsConfirmation && (
								<button
									type="button"
									onClick={resendConfirmation}
									className="block mt-2 underline underline-offset-4 font-medium cursor-pointer"
								>
									Resend confirmation email
								</button>
							)}
						</motion.div>
					)}
					{successMessage && (
						<motion.div
							key="success"
							role="status"
							initial={{ opacity: 0, y: -6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							className="mb-5 p-3 rounded-xs text-copy-sm text-(--text-headline) bg-(--card-main)/60 border border-(--border-color)"
						>
							{successMessage}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-5">
				{isSignUp && (
					<label className={labelClass}>
						Full Name
						<input
							type="text"
							required
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							autoComplete="name"
							className={fieldClass}
						/>
					</label>
				)}

				<label className={labelClass}>
					Email
					<input
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						className={fieldClass}
					/>
				</label>

				<div>
					<div className="flex items-baseline justify-between">
						<label htmlFor="auth-password" className={labelClass}>
							Password
						</label>
						{!isSignUp && (
							<Link
								href="/forgot-password"
								className="text-copy-sm text-(--text-muted) hover:text-(--text-headline) transition-colors"
							>
								Forgot password?
							</Link>
						)}
					</div>
					<div className="relative">
						<input
							id="auth-password"
							type={showPassword ? "text" : "password"}
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder={isSignUp ? "At least 8 characters" : undefined}
							minLength={isSignUp ? 8 : undefined}
							autoComplete={isSignUp ? "new-password" : "current-password"}
							className={`${fieldClass} pr-12`}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							aria-label={showPassword ? "Hide password" : "Show password"}
							className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 p-1 text-(--text-muted) hover:text-(--text-headline) transition-colors cursor-pointer"
						>
							{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
						</button>
					</div>
				</div>

				<button
					type="submit"
					disabled={loading}
					className="w-full mt-2 py-4 px-6 rounded-xs bg-(--text-headline) text-(--bg-base) text-label uppercase hover:bg-(--accent) transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
				>
					<span>
						{loading
							? isSignUp
								? "Creating account..."
								: "Signing in..."
							: isSignUp
								? "Create Account"
								: "Sign In"}
					</span>
					{!loading && <ArrowRight size={14} className="stroke-[1.5]" />}
				</button>
			</form>

			{/* Mode switch */}
			<p className="mt-8 text-copy-sm text-(--text-muted)">
				{isSignUp ? "Already have an account? " : "New here? "}
				<button
					type="button"
					onClick={switchMode}
					className="text-(--text-headline) border-b border-current hover:text-(--accent) transition-colors cursor-pointer"
				>
					{isSignUp ? "Sign in" : "Create an account"}
				</button>
			</p>
		</motion.div>
	);
}
