"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export interface CartItem {
    id: string; // product id
    slug: string;
    name: string;
    subtitle: string;
    price: number;
    size: string;
    quantity: number;
}

interface StoreContextType {
    cart: CartItem[];
    wishlist: string[]; // array of product IDs
    addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeFromCart: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, quantity: number) => void;
    toggleWishlist: (productId: string) => void;
    isLiked: (productId: string) => boolean;
    totalCartCount: number;
    totalWishlistCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // 1. Initial Load from localStorage
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem("brandlogo_cart");
            const savedWishlist = localStorage.getItem("brandlogo_wishlist");

            if (savedCart) setCart(JSON.parse(savedCart));
            if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        } catch (e) {
            console.error("Failed to read from localStorage", e);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // 2. Persist to localStorage whenever cart changes
    useEffect(() => {
        if (!isInitialized) return;
        try {
            localStorage.setItem("brandlogo_cart", JSON.stringify(cart));
        } catch (e) {
            console.error("Failed to save cart to localStorage", e);
        }
    }, [cart, isInitialized]);

    // 3. Persist to localStorage whenever wishlist changes
    useEffect(() => {
        if (!isInitialized) return;
        try {
            localStorage.setItem(
                "brandlogo_wishlist",
                JSON.stringify(wishlist),
            );
        } catch (e) {
            console.error("Failed to save wishlist to localStorage", e);
        }
    }, [wishlist, isInitialized]);

    // 4. Cart Operations
    const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
        setCart((prev) => {
            const existingIndex = prev.findIndex(
                (ci) => ci.id === item.id && ci.size === item.size,
            );

            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }

            return [...prev, { ...item, quantity }];
        });
    };

    const removeFromCart = (id: string, size: string) => {
        setCart((prev) =>
            prev.filter((ci) => !(ci.id === id && ci.size === size)),
        );
    };

    const updateQuantity = (id: string, size: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id, size);
            return;
        }
        setCart((prev) =>
            prev.map((ci) =>
                ci.id === id && ci.size === size ? { ...ci, quantity } : ci,
            ),
        );
    };

    // 5. Wishlist Operations
    const toggleWishlist = (productId: string) => {
        setWishlist((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId],
        );
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
