"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Eye, EyeOff, User } from "lucide-react";
import { supabase } from "@/app/lib/supabase";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: fullName } },
                });
                if (error) throw error;
                setSuccessMessage(
                    "An activation dispatch has been sent. Please confirm your email.",
                );
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/");
                router.refresh();
            }
        } catch (err: any) {
            setErrorMessage(err.message || "An authentication error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[420px] mx-auto relative group">
            {/* Specular Ambient Glow Rings Behind Card */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-rose-200/40 via-sky-200/40 to-slate-200/20 rounded-[32px] blur-xl opacity-70 group-hover:opacity-100 transition duration-700 pointer-events-none" />

            {/* 3D Glass Surface Card */}
            <div className="relative rounded-[28px] bg-white/70 dark:bg-stone-900/60 backdrop-blur-2xl border border-white/60 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] p-8 sm:p-10 transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)]">
                {/* Top 3D Floating Icon Stamp */}
                <div className="w-13 h-13 mx-auto mb-6 rounded-2xl bg-gradient-to-b from-white to-stone-100/80 dark:from-stone-800 dark:to-stone-900 border border-white/80 dark:border-white/15 shadow-[0_8px_16px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center justify-center text-(--text-headline) transform transition-transform group-hover:-translate-y-0.5">
                    <Lock size={18} className="stroke-[1.75]" />
                </div>

                {/* Title and Subtitle */}
                <div className="text-center mb-8">
                    <h1 className="font-serif text-2xl sm:text-3xl tracking-tight text-(--text-headline) font-medium mb-2">
                        {isSignUp ? "Join the Maison" : "Sign in to Archive"}
                    </h1>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-(--text-muted) font-medium">
                        {isSignUp
                            ? "Create your client curation vault"
                            : "Access your bespoke collection"}
                    </p>
                </div>

                {/* Alert Notices */}
                {errorMessage && (
                    <div className="mb-5 p-3 rounded-xl text-xs text-rose-700 bg-rose-50/80 border border-rose-200/70 text-center">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="mb-5 p-3 rounded-xl text-xs text-(--text-headline) bg-stone-100/80 border border-stone-200/70 text-center">
                        {successMessage}
                    </div>
                )}

                {/* Pill Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div className="relative flex items-center">
                            <User
                                size={15}
                                className="absolute left-4 text-(--text-muted) stroke-[1.5]"
                            />
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full bg-stone-100/60 dark:bg-stone-800/40 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--text-headline)/15 focus:bg-white dark:focus:bg-stone-800 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
                            />
                        </div>
                    )}

                    <div className="relative flex items-center">
                        <Mail
                            size={15}
                            className="absolute left-4 text-(--text-muted) stroke-[1.5]"
                        />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Client Email"
                            className="w-full bg-stone-100/60 dark:bg-stone-800/40 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--text-headline)/15 focus:bg-white dark:focus:bg-stone-800 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
                        />
                    </div>

                    <div className="relative flex items-center">
                        <Lock
                            size={15}
                            className="absolute left-4 text-(--text-muted) stroke-[1.5]"
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-stone-100/60 dark:bg-stone-800/40 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 pl-11 pr-11 text-xs text-(--text-headline) placeholder:text-(--text-muted) focus:outline-none focus:ring-2 focus:ring-(--text-headline)/15 focus:bg-white dark:focus:bg-stone-800 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] tracking-wider"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 p-1 text-(--text-muted) hover:text-(--text-headline) transition-colors cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOff size={14} />
                            ) : (
                                <Eye size={14} />
                            )}
                        </button>
                    </div>

                    {!isSignUp && (
                        <div className="flex justify-end pr-1 pt-0.5">
                            <Link
                                href="/coming-soon?feature=forgot-password"
                                className="text-[10px] uppercase tracking-wider text-(--text-muted) hover:text-(--text-headline) transition-colors font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    )}

                    {/* 3D Tactile Push Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-3 py-4 px-6 rounded-2xl bg-(--text-headline) text-(--bg-base) text-[11px] uppercase tracking-[0.25em] font-semibold shadow-[0_10px_20px_rgba(30,6,10,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <span>
                            {loading
                                ? "Authenticating..."
                                : isSignUp
                                  ? "Request Access"
                                  : "Enter Salon"}
                        </span>
                        {!loading && (
                            <ArrowRight size={13} className="stroke-[1.75]" />
                        )}
                    </button>
                </form>

                {/* Toggle Switch */}
                <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setErrorMessage(null);
                            setSuccessMessage(null);
                        }}
                        className="text-[10px] uppercase tracking-[0.2em] text-(--text-muted) hover:text-(--text-headline) transition-colors cursor-pointer"
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
                </div>
            </div>
        </div>
    );
}
