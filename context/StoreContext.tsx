"use client";

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	useSyncExternalStore,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { createSupabaseBrowserClient } from "@/app/lib/supabase-browser";
import { supabase as catalogClient } from "@/app/lib/supabase";

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

// Matches the check constraint on cart_items.quantity
export const MAX_QUANTITY = 10;

const CART_KEY = "brandlogo_cart";
const WISHLIST_KEY = "brandlogo_wishlist";

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Guest storage (localStorage)
// ---------------------------------------------------------------------------

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

function readStorage<T>(key: string): T[] {
	try {
		const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
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
	return localStorage.getItem(CART_KEY) ?? "[]";
};

const getWishlistSnapshot = () => {
	if (typeof window === "undefined") return "[]";
	return localStorage.getItem(WISHLIST_KEY) ?? "[]";
};

const getServerSnapshot = () => "[]";

const sameLine = (a: Pick<CartItem, "id" | "size">, id: string, size: string) =>
	a.id === id && a.size === size;

function addLine(
	cart: CartItem[],
	item: Omit<CartItem, "quantity">,
	quantity: number,
): CartItem[] {
	const exists = cart.some((ci) => sameLine(ci, item.id, item.size));
	// Build new item objects instead of mutating the existing cart
	return exists
		? cart.map((ci) =>
				sameLine(ci, item.id, item.size)
					? {
							...ci,
							quantity: Math.min(ci.quantity + quantity, MAX_QUANTITY),
						}
					: ci,
			)
		: [...cart, { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }];
}

// ---------------------------------------------------------------------------
// Account storage (Supabase, signed in)
// ---------------------------------------------------------------------------

interface AccountItems {
	userId: string;
	cart: CartItem[];
	wishlist: string[];
}

interface CartRow {
	quantity: number;
	variant: {
		size: string;
		price_override: number | null;
		product: {
			id: string;
			slug: string;
			name: string;
			subtitle: string | null;
			price: number;
			images: string[] | null;
			category: { name: string };
		};
	};
}

// Prices come from the catalog, not from anything the browser stored
async function fetchAccountItems(userId: string): Promise<AccountItems> {
	const supabase = createSupabaseBrowserClient();
	const [cartResult, wishlistResult] = await Promise.all([
		supabase
			.from("cart_items")
			.select(
				"quantity, variant:product_variants!inner(size, price_override, product:products!inner(id, slug, name, subtitle, price, images, category:categories!inner(name)))",
			)
			.order("created_at")
			.overrideTypes<CartRow[], { merge: false }>(),
		supabase
			.from("wishlist_items")
			.select("product_id")
			.order("created_at")
			.overrideTypes<{ product_id: string }[], { merge: false }>(),
	]);

	if (cartResult.error) throw cartResult.error;
	if (wishlistResult.error) throw wishlistResult.error;

	return {
		userId,
		cart: cartResult.data.map(({ quantity, variant }) => ({
			id: variant.product.id,
			slug: variant.product.slug,
			name: variant.product.name,
			subtitle: variant.product.subtitle ?? variant.product.category.name,
			price: variant.price_override ?? variant.product.price,
			size: variant.size,
			quantity,
			image: variant.product.images?.[0],
		})),
		wishlist: wishlistResult.data.map((row) => row.product_id),
	};
}

// Current catalog prices for guest cart lines, keyed "productId|size". A
// guest's stored price is only a fallback until these load, so editing
// localStorage can't change what the bag shows.
async function fetchGuestPrices(productIds: string[]) {
	const { data, error } = await catalogClient
		.from("product_variants")
		.select("product_id, size, price_override, product:products!inner(price)")
		.in("product_id", productIds)
		.overrideTypes<
			{
				product_id: string;
				size: string;
				price_override: number | null;
				product: { price: number };
			}[],
			{ merge: false }
		>();

	if (error) {
		console.error("Failed to load current prices:", error.message);
		return null;
	}
	return new Map(
		data.map((v) => [
			`${v.product_id}|${v.size}`,
			v.price_override ?? v.product.price,
		]),
	);
}

// Moves the guest cart/wishlist into the account. localStorage is cleared
// before the request so a second tab (or React's dev double-effect) can't
// merge the same items again; if the request fails the items are put back
// and the merge is retried later.
let pendingMerge: Promise<void> | null = null;

function mergeGuestItems(): Promise<void> {
	if (pendingMerge) return pendingMerge;

	const cart = readStorage<CartItem>(CART_KEY);
	const wishlist = readStorage<string>(WISHLIST_KEY);
	if (cart.length === 0 && wishlist.length === 0) return Promise.resolve();

	saveToStorage(CART_KEY, []);
	saveToStorage(WISHLIST_KEY, []);

	pendingMerge = Promise.resolve(
		createSupabaseBrowserClient().rpc("merge_guest_items", {
			p_cart: cart.map(({ id, size, quantity }) => ({ id, size, quantity })),
			p_wishlist: wishlist,
		}),
	)
		.then(({ error }) => {
			if (error) throw error;
		})
		.catch((error) => {
			console.error("Failed to merge guest items into account:", error);
			let restored = readStorage<CartItem>(CART_KEY);
			cart.forEach((item) => {
				restored = addLine(restored, item, item.quantity);
			});
			saveToStorage(CART_KEY, restored);
			saveToStorage(WISHLIST_KEY, [
				...new Set([...readStorage<string>(WISHLIST_KEY), ...wishlist]),
			]);
		})
		.finally(() => {
			pendingMerge = null;
		});

	return pendingMerge;
}

// ---------------------------------------------------------------------------
// Provider: same API whether the cart lives in localStorage or the account
// ---------------------------------------------------------------------------

export function StoreProvider({ children }: { children: React.ReactNode }) {
	const { user, isAuthReady } = useAuth();

	// 1. Hydration detection without cascading setState
	const isClient = useSyncExternalStore(
		emptySubscribe,
		getClientHydrated,
		getServerHydrated,
	);

	// 2. Stable guest snapshots
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

	const guestCart: CartItem[] = React.useMemo(() => {
		try {
			return JSON.parse(cartRaw);
		} catch {
			return [];
		}
	}, [cartRaw]);

	const guestWishlist: string[] = React.useMemo(() => {
		try {
			return JSON.parse(wishlistRaw);
		} catch {
			return [];
		}
	}, [wishlistRaw]);

	// Guest lines are repriced from the catalog whenever the set of products
	// in the bag changes
	const guestProductKey = [...new Set(guestCart.map((ci) => ci.id))]
		.sort()
		.join(",");
	const [guestPrices, setGuestPrices] = useState<Map<string, number> | null>(
		null,
	);

	useEffect(() => {
		if (user || !guestProductKey) return;
		let active = true;
		fetchGuestPrices(guestProductKey.split(",")).then((prices) => {
			if (active && prices) setGuestPrices(prices);
		});
		return () => {
			active = false;
		};
	}, [user, guestProductKey]);

	const pricedGuestCart = React.useMemo(
		() =>
			guestCart.map((ci) => ({
				...ci,
				price: guestPrices?.get(`${ci.id}|${ci.size}`) ?? ci.price,
			})),
		[guestCart, guestPrices],
	);

	// 3. Account items, only valid for the user they were loaded for
	const [accountItems, setAccountItems] = useState<AccountItems | null>(null);
	const account =
		user && accountItems?.userId === user.id ? accountItems : null;

	const refreshAccount = useCallback(async (userId: string) => {
		try {
			setAccountItems(await fetchAccountItems(userId));
		} catch (error) {
			console.error("Failed to load saved cart and wishlist:", error);
			// Show an empty bag rather than a skeleton forever
			setAccountItems(
				(prev) =>
					prev?.userId === userId
						? prev
						: { userId, cart: [], wishlist: [] },
			);
		}
	}, []);

	// On sign-in (and on every visit while signed in): merge any guest items,
	// then load the account. Reload when the tab regains focus so other
	// devices' changes show up.
	useEffect(() => {
		if (!user) return;
		const sync = () =>
			mergeGuestItems().then(() => refreshAccount(user.id));
		sync();

		const onVisible = () => {
			if (document.visibilityState === "visible") sync();
		};
		document.addEventListener("visibilitychange", onVisible);
		return () => document.removeEventListener("visibilitychange", onVisible);
	}, [user, refreshAccount]);

	// Optimistically update the account, then persist; on failure reload the
	// truth from the database
	const mutateAccount = (
		update: (items: AccountItems) => AccountItems,
		persist: () => PromiseLike<{ error: unknown }>,
	) => {
		if (!user) return;
		setAccountItems((prev) =>
			prev && prev.userId === user.id ? update(prev) : prev,
		);
		Promise.resolve(persist()).then(({ error }) => {
			if (error) {
				console.error("Failed to save change to account:", error);
				refreshAccount(user.id);
			}
		});
	};

	// Cart operations
	const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
		if (user) {
			mutateAccount(
				(items) => ({ ...items, cart: addLine(items.cart, item, quantity) }),
				() =>
					createSupabaseBrowserClient().rpc("add_to_cart", {
						p_product_id: item.id,
						p_size: item.size,
						p_quantity: quantity,
					}),
			);
			return;
		}
		saveToStorage(CART_KEY, addLine(guestCart, item, quantity));
	};

	const removeFromCart = (id: string, size: string) => {
		if (user) {
			mutateAccount(
				(items) => ({
					...items,
					cart: items.cart.filter((ci) => !sameLine(ci, id, size)),
				}),
				() =>
					createSupabaseBrowserClient().rpc("set_cart_quantity", {
						p_product_id: id,
						p_size: size,
						p_quantity: 0,
					}),
			);
			return;
		}
		saveToStorage(
			CART_KEY,
			guestCart.filter((ci) => !sameLine(ci, id, size)),
		);
	};

	const updateQuantity = (id: string, size: string, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(id, size);
			return;
		}
		const capped = Math.min(quantity, MAX_QUANTITY);
		const setLine = (cart: CartItem[]) =>
			cart.map((ci) =>
				sameLine(ci, id, size) ? { ...ci, quantity: capped } : ci,
			);

		if (user) {
			mutateAccount(
				(items) => ({ ...items, cart: setLine(items.cart) }),
				() =>
					createSupabaseBrowserClient().rpc("set_cart_quantity", {
						p_product_id: id,
						p_size: size,
						p_quantity: capped,
					}),
			);
			return;
		}
		saveToStorage(CART_KEY, setLine(guestCart));
	};

	const cart = user ? (account?.cart ?? []) : pricedGuestCart;
	const wishlist = user ? (account?.wishlist ?? []) : guestWishlist;

	// Wishlist operations
	const toggleWishlist = (productId: string) => {
		const liked = wishlist.includes(productId);

		if (user) {
			const supabase = createSupabaseBrowserClient();
			mutateAccount(
				(items) => ({
					...items,
					wishlist: liked
						? items.wishlist.filter((id) => id !== productId)
						: [...items.wishlist, productId],
				}),
				() =>
					liked
						? supabase
								.from("wishlist_items")
								.delete()
								.eq("product_id", productId)
						: supabase
								.from("wishlist_items")
								.insert({ product_id: productId }),
			);
			return;
		}

		saveToStorage(
			WISHLIST_KEY,
			liked
				? guestWishlist.filter((id) => id !== productId)
				: [...guestWishlist, productId],
		);
	};

	const isLiked = (productId: string) => wishlist.includes(productId);

	const totalCartCount = cart.reduce(
		(total, item) => total + item.quantity,
		0,
	);
	const totalWishlistCount = wishlist.length;

	// Ready once we know who is signed in and their items have loaded
	const isHydrated = isClient && isAuthReady && (!user || account !== null);

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
