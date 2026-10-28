"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export interface CartItem {
	id: string;
	slug: string;
	name: string;
	subtitle: string;
	price: number;
	size: string;
	quantity: number;
	image?: string;
}

interface StoreContextType {
	cart: CartItem[];
	wishlist: string[];
	addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
	removeFromCart: (id: string, size: string) => void;
	updateQuantity: (id: string, size: string, quantity: number) => void;
	toggleWishlist: (productId: string) => void;
	isLiked: (productId: string) => boolean;
	totalCartCount: number;
	totalWishlistCount: number;
	isHydrated: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to safely write to localStorage and dispatch custom storage event
function saveToStorage(key: string, value: unknown) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
		window.dispatchEvent(new Event("local-storage-sync"));
	} catch (e) {
		console.error(`Failed to save ${key} to localStorage:`, e);
	}
}

// Helpers to subscribe to storage updates
function subscribeToStorage(callback: () => void) {
	window.addEventListener("storage", callback);
	window.addEventListener("local-storage-sync", callback);
	return () => {
		window.removeEventListener("storage", callback);
		window.removeEventListener("local-storage-sync", callback);
	};
}

// Static snapshot functions (prevents re-render loops in useSyncExternalStore)
const emptySubscribe = () => () => {};
const getClientHydrated = () => true;
const getServerHydrated = () => false;

const getCartSnapshot = () => {
	if (typeof window === "undefined") return "[]";
	return localStorage.getItem("brandlogo_cart") ?? "[]";
};

const getWishlistSnapshot = () => {
	if (typeof window === "undefined") return "[]";
	return localStorage.getItem("brandlogo_wishlist") ?? "[]";
};

const getServerSnapshot = () => "[]";

export function StoreProvider({ children }: { children: React.ReactNode }) {
	// 1. Hydration detection without cascading setState
	const isHydrated = useSyncExternalStore(
		emptySubscribe,
		getClientHydrated,
		getServerHydrated,
	);

	// 2. Stable snapshots
	const cartRaw = useSyncExternalStore(
		subscribeToStorage,
		getCartSnapshot,
		getServerSnapshot,
	);

	const wishlistRaw = useSyncExternalStore(
		subscribeToStorage,
		getWishlistSnapshot,
		getServerSnapshot,
	);

	const cart: CartItem[] = React.useMemo(() => {
		try {
			return JSON.parse(cartRaw);
		} catch {
			return [];
		}
	}, [cartRaw]);

	const wishlist: string[] = React.useMemo(() => {
		try {
			return JSON.parse(wishlistRaw);
		} catch {
			return [];
		}
	}, [wishlistRaw]);

	// Cart operations
	const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
		const existingIndex = cart.findIndex(
			(ci) => ci.id === item.id && ci.size === item.size,
		);

		let updated: CartItem[];
		if (existingIndex > -1) {
			updated = [...cart];
			updated[existingIndex].quantity += quantity;
		} else {
			updated = [...cart, { ...item, quantity }];
		}

		saveToStorage("brandlogo_cart", updated);
	};

	const removeFromCart = (id: string, size: string) => {
		const updated = cart.filter(
			(ci) => !(ci.id === id && ci.size === size),
		);
		saveToStorage("brandlogo_cart", updated);
	};

	const updateQuantity = (id: string, size: string, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(id, size);
			return;
		}
		const updated = cart.map((ci) =>
			ci.id === id && ci.size === size ? { ...ci, quantity } : ci,
		);
		saveToStorage("brandlogo_cart", updated);
	};

	// Wishlist operations
	const toggleWishlist = (productId: string) => {
		const updated = wishlist.includes(productId)
			? wishlist.filter((id) => id !== productId)
			: [...wishlist, productId];
		saveToStorage("brandlogo_wishlist", updated);
	};

	const isLiked = (productId: string) => wishlist.includes(productId);

	const totalCartCount = cart.reduce(
		(total, item) => total + item.quantity,
		0,
	);
	const totalWishlistCount = wishlist.length;

	return (
		<StoreContext.Provider
			value={{
				cart,
				wishlist,
				addToCart,
				removeFromCart,
				updateQuantity,
				toggleWishlist,
				isLiked,
				totalCartCount,
				totalWishlistCount,
				isHydrated,
			}}
		>
			{children}
		</StoreContext.Provider>
	);
}

export function useStore() {
	const context = useContext(StoreContext);
	if (!context) {
		throw new Error("useStore must be used within a StoreProvider");
	}
	return context;
}
