"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, Mail, Eye, EyeOff, User } from "lucide-react";
import { AuthError } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/app/lib/supabase-browser";
import { safeNextPath } from "@/app/lib/safe-redirect";
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
		<div className="mb-5 p-3 rounded-xs text-xs font-body text-(--error-text) bg-(--error-bg) border border-(--error-border) text-center">
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
			setSuccessMessage("A new confirmation email is on its way.");
		}
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
					"An activation dispatch has been sent. Please confirm your email.",
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
					"Please confirm your email before signing in. Check your inbox for the activation link.",
				);
			} else if (err instanceof Error) {
				setErrorMessage(err.message);
			} else {
				setErrorMessage("An authentication error occurred.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-full max-w-105 mx-auto relative group">
			{/* Specular Ambient Glow Rings Behind Card */}
			<div className="absolute -inset-2 bg-linear-to-tr from-rose-200/30 via-slate-200/40 to-transparent rounded-4xl blur-2xl opacity-60 pointer-events-none" />

			{/* Frosted Crystalline Glass Surface Card - Fades & slides in */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ ...luxurySpring, duration: 1.2 }}
				className="relative rounded-2xl bg-white/85 backdrop-blur-2xl border border-(--border-color) shadow-[0_20px_50px_rgba(30,6,10,0.06),inset_0_1px_2px_rgba(255,255,255,0.9)] p-8 sm:p-10"
			>
				{/* Top Minimalist Seal */}
				<motion.div
					whileHover={{ scale: 1.05, rotate: 2 }}
					transition={luxurySpring}
					className="w-12 h-12 mx-auto mb-6 rounded-xl bg-(--card-sub) border border-(--border-color) shadow-xs flex items-center justify-center text-(--text-headline) cursor-default"
				>
					<Lock size={17} className="stroke-[1.5]" />
				</motion.div>

				{/* Title and Subtitle */}
				<motion.div layout className="text-center mb-8">
					<motion.h1
						layout="position"
						className="font-primary text-2xl sm:text-3xl tracking-tight text-(--text-headline) font-normal mb-2"
					>
						{isSignUp ? "Join the Maison" : "Sign in to Archive"}
					</motion.h1>
					<motion.p
						layout="position"
						className="font-secondary text-[10px] uppercase tracking-[0.25em] text-(--text-muted) font-medium"
					>
						{isSignUp
							? "Create your client curation vault"
							: "Access your bespoke collection"}
					</motion.p>
				</motion.div>

				{/* Alert Notices */}
				<Suspense fallback={null}>
					<LinkErrorNotice />
				</Suspense>
				<AnimatePresence mode="popLayout">
					{errorMessage && (
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={luxurySpring}
							className="mb-5 p-3 rounded-xs text-xs font-body text-(--error-text) bg-(--error-bg) border border-(--error-border) text-center"
						>
							{errorMessage}
							{needsConfirmation && (
								<button
									type="button"
									onClick={resendConfirmation}
									className="block mx-auto mt-2 underline underline-offset-4 font-semibold cursor-pointer"
								>
									Resend confirmation email
								</button>
							)}
						</motion.div>
					)}
					{successMessage && (
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={luxurySpring}
							className="mb-5 p-3 rounded-xs text-xs font-body text-(--text-headline) bg-(--card-main)/60 border border-(--border-color) text-center"
						>
							{successMessage}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Authentication Form - layout prop enables smooth shifting */}
				<motion.form
					layout
					transition={luxurySpring}
					onSubmit={handleSubmit}
					className="space-y-4"
				>
					<AnimatePresence>
						{isSignUp && (
							<motion.div
								initial={{
									opacity: 0,
									height: 0,
									overflow: "hidden",
								}}
								animate={{
									opacity: 1,
									height: "auto",
									overflow: "visible",
								}}
								exit={{
									opacity: 0,
									height: 0,
									overflow: "hidden",
								}}
								transition={luxurySpring}
							>
								<div className="relative flex items-center pt-1">
									<User
										size={14}
										className="absolute left-4 text-(--text-muted) stroke-[1.5]"
									/>
									<input
										type="text"
										required
										value={fullName}
										onChange={(e) =>
											setFullName(e.target.value)
										}
										placeholder="Full Name"
										className="w-full bg-(--card-sub)/50 border border-(--border-color) rounded-xs py-3.5 pl-11 pr-4 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-white transition-all"
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					<motion.div
						layout
						transition={luxurySpring}
						className="relative flex items-center"
					>
						<Mail
							size={14}
							className="absolute left-4 text-(--text-muted) stroke-[1.5]"
						/>
						<input
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Client Email"
							autoComplete="email"
							className="w-full bg-(--card-sub)/50 border border-(--border-color) rounded-xs py-3.5 pl-11 pr-4 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-white transition-all"
						/>
					</motion.div>

					<motion.div
						layout
						transition={luxurySpring}
						className="relative flex items-center"
					>
						<Lock
							size={14}
							className="absolute left-4 text-(--text-muted) stroke-[1.5]"
						/>
						<input
							type={showPassword ? "text" : "password"}
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder={isSignUp ? "Password (8+ characters)" : "Password"}
							minLength={isSignUp ? 8 : undefined}
							autoComplete={isSignUp ? "new-password" : "current-password"}
							className="w-full bg-(--card-sub)/50 border border-(--border-color) rounded-xs py-3.5 pl-11 pr-11 font-body text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:border-(--text-headline)/40 focus:bg-white transition-all tracking-wider"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							aria-label={showPassword ? "Hide password" : "Show password"}
							className="absolute right-3.5 p-1 text-(--text-muted) hover:text-(--text-headline) transition-colors cursor-pointer"
						>
							{showPassword ? (
								<EyeOff size={14} />
							) : (
								<Eye size={14} />
							)}
						</button>
					</motion.div>

					{!isSignUp && (
						<motion.div
							layout
							transition={luxurySpring}
							className="flex justify-end pr-1 pt-0.5"
						>
							<Link
								href="/forgot-password"
								className="font-secondary text-[9px] uppercase tracking-[0.2em] text-(--text-muted) hover:text-(--text-headline) transition-colors font-medium"
							>
								Forgot password?
							</Link>
						</motion.div>
					)}

					{/* Framer Motion Action Button */}
					<motion.button
						layout
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.98 }}
						transition={luxurySpring}
						type="submit"
						disabled={loading}
						className="w-full mt-3 py-4 px-6 rounded-xs bg-(--text-headline) text-(--bg-base) font-secondary text-[10px] uppercase tracking-[0.25em] font-semibold shadow-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
					>
						<span>
							{loading
								? "Authenticating..."
								: isSignUp
									? "Request Access"
									: "Enter Salon"}
						</span>
						{!loading && (
							<ArrowRight size={13} className="stroke-[1.5]" />
						)}
					</motion.button>
				</motion.form>

				{/* Toggle Switch */}
				<motion.div
					layout
					transition={luxurySpring}
					className="mt-8 pt-6 border-t border-(--border-color)/60 text-center"
				>
					<button
						type="button"
						onClick={() => {
							setIsSignUp(!isSignUp);
							setErrorMessage(null);
							setSuccessMessage(null);
						}}
						className="font-secondary text-[10px] uppercase tracking-[0.2em] text-(--text-muted) hover:text-(--text-headline) transition-colors cursor-pointer"
					>
						{isSignUp ? (
							<span>
								Existing client?{" "}
								<strong className="underline underline-offset-4 font-semibold text-(--text-headline)">
									Sign In
								</strong>
							</span>
						) : (
							<span>
								New to the Maison?{" "}
								<strong className="underline underline-offset-4 font-semibold text-(--text-headline)">
									Create Account
								</strong>
							</span>
						)}
					</button>
				</motion.div>
			</motion.div>
		</div>
	);
}
