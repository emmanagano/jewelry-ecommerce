"use client";

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { createSupabaseBrowserClient } from "@/app/lib/supabase-browser";

export interface AuthUser {
	id: string;
	email: string | null;
}

// Category slug -> saved size, e.g. { rings: "7" }
export type PreferredSizes = Record<string, string>;

interface AuthContextType {
	user: AuthUser | null;
	preferredSizes: PreferredSizes;
	refreshProfile: () => Promise<void>;
	// False until the initial session check finishes, so UI doesn't flash the
	// signed-out state for a signed-in visitor
	isAuthReady: boolean;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loadProfile(userId: string) {
	const { data, error } = await createSupabaseBrowserClient()
		.from("profiles")
		.select("preferred_sizes")
		.eq("id", userId)
		.maybeSingle();
	if (error) {
		console.error("Failed to load profile:", error.message);
		return null;
	}
	return {
		userId,
		preferredSizes: (data?.preferred_sizes as PreferredSizes) ?? {},
	};
}

// Tracks the signed-in user in the browser. Pages stay statically
// prerendered; signed-in UI (Navbar icon, saved cart) fills in on the client.
// Server code that needs a trustworthy identity uses getCurrentUser() in
// app/lib/supabase-server.ts instead.
export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isAuthReady, setIsAuthReady] = useState(false);
	const [profile, setProfile] = useState<{
		userId: string;
		preferredSizes: PreferredSizes;
	} | null>(null);

	useEffect(() => {
		const supabase = createSupabaseBrowserClient();
		// Fires INITIAL_SESSION immediately, then on every sign-in/out/refresh
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			const next = session?.user
				? { id: session.user.id, email: session.user.email ?? null }
				: null;
			// Keep the same object while the user is unchanged (token refreshes)
			setUser((prev) => (prev?.id === next?.id ? prev : next));
			setIsAuthReady(true);
		});
		return () => subscription.unsubscribe();
	}, []);

	const refreshProfile = useCallback(async () => {
		if (!user) return;
		const loaded = await loadProfile(user.id);
		if (loaded) setProfile(loaded);
	}, [user]);

	// Load saved sizes whenever a different user signs in
	useEffect(() => {
		if (!user) return;
		loadProfile(user.id).then((loaded) => {
			if (loaded) setProfile(loaded);
		});
	}, [user]);

	// Only trust the profile if it belongs to the current user
	const preferredSizes =
		user && profile?.userId === user.id ? profile.preferredSizes : {};

	const signOut = useCallback(async () => {
		await createSupabaseBrowserClient().auth.signOut();
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, isAuthReady, preferredSizes, refreshProfile, signOut }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
