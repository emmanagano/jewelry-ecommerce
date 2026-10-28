"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    ShoppingBag,
    Check,
    Sparkles,
} from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { useStore } from "@/context/StoreContext";

export interface FeaturedProduct {
    id: string;
    name: string;
    slug: string;
    subtitle: string;
    badge: string | null;
    category: string;
    price: number;
    images?: string[];
    imageUrl?: string;
}

const CATEGORY_SIZES: Record<string, string[]> = {
    Rings: ["5", "6", "7", "8"],
    Bracelets: ["16 CM", "17.5 CM", "19 CM"],
    Necklaces: ["16 IN", "18 IN", "20 IN"],
    Earrings: ["Standard"],
};

export default function EditorialShowcase() {
    const [products, setProducts] = useState<FeaturedProduct[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>("Standard");
    const [justAdded, setJustAdded] = useState(false);

    const { addToCart } = useStore();

    useEffect(() => {
        async function fetchFeatured() {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .ilike("badge", "%BEST SELLER%")
                .limit(6);

            if (error || !data || data.length === 0) {
                const { data: fallbackData } = await supabase
                    .from("products")
                    .select("*")
                    .limit(6);
                if (fallbackData) setProducts(fallbackData);
            } else {
                setProducts(data);
            }
            setLoading(false);
        }
        fetchFeatured();
    }, []);

    const currentItem = products[currentIndex];

    useEffect(() => {
        if (currentItem) {
            const sizes = CATEGORY_SIZES[currentItem.category] || ["Standard"];
            setSelectedSize(sizes[0]);
        }
    }, [currentIndex, currentItem]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
    };

    const handlePrev = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + products.length) % products.length,
        );
    };

    const handleQuickAdd = () => {
        if (!currentItem) return;
        addToCart({
            id: currentItem.id,
            slug: currentItem.slug,
            name: currentItem.name,
            subtitle: currentItem.subtitle || currentItem.category,
            price: currentItem.price,
            size: selectedSize,
            image: currentItem.images?.[0] || currentItem.imageUrl,
        });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1800);
    };

    if (loading || !currentItem) {
        return (
            <div className="w-full h-full bg-(--card-sub) animate-pulse flex flex-col justify-between p-12">
                <div className="h-4 w-32 bg-white/20 rounded-xs" />
                <div className="space-y-4">
                    <div className="h-8 w-64 bg-white/20 rounded-xs" />
                    <div className="h-16 w-full bg-white/20 rounded-xs" />
                </div>
            </div>
        );
    }

    const displayImg =
        currentItem.images?.[0] ||
        currentItem.imageUrl ||
        "https://images.unsplash.com/photo-1599458349289-18f0ee82e6ed?q=80&w=1200&auto=format&fit=crop";
    const currentSizes = CATEGORY_SIZES[currentItem.category] || ["Standard"];
    const formattedPrice = (currentItem.price / 100).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

    return (
        <div className="relative w-full h-full flex flex-col justify-between p-8 sm:p-12 lg:p-14 text-white group overflow-hidden">
            {/* High-res background image filling full height and width */}
            <img
                key={displayImg}
                src={displayImg}
                alt={currentItem.name}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            />

            {/* Soft vignette scrim overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/30 pointer-events-none" />

            {/* TOP: Atelier Link & Carousel Stepper */}
            <div className="relative z-10 flex items-center justify-between">
                <Link
                    href="/"
                    className="group/back inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-medium text-white/70 hover:text-white transition-colors"
                >
                    <ArrowLeft
                        size={12}
                        className="stroke-[1.5] transition-transform group-hover/back:-translate-x-1"
                    />
                    <span>The Atelier Front</span>
                </Link>

                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                    <button
                        type="button"
                        onClick={handlePrev}
                        aria-label="Previous piece"
                        className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={12} className="stroke-[1.5]" />
                    </button>
                    <span className="text-[10px] font-mono tracking-widest text-white/90 px-2">
                        0{currentIndex + 1} / 0{products.length}
                    </span>
                    <button
                        type="button"
                        onClick={handleNext}
                        aria-label="Next piece"
                        className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer"
                    >
                        <ArrowRight size={12} className="stroke-[1.5]" />
                    </button>
                </div>
            </div>

            {/* CENTER: Subtle Curator Pin */}
            <div className="relative z-10 self-start inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-medium">
                    Curated Spotlight
                </span>
            </div>

            {/* BOTTOM: Editorial Presentation & Compact Micro-Console */}
            <div className="relative z-10 max-w-xl space-y-5">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-white/70">
                        <Sparkles size={12} className="text-amber-200" />
                        <span className="text-[10px] uppercase tracking-[0.25em] font-medium">
                            {currentItem.badge || "Permanent Archive"} •{" "}
                            {currentItem.category}
                        </span>
                    </div>

                    <Link
                        href={`/product/${currentItem.slug}`}
                        className="group/link block"
                    >
                        <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight leading-tight group-hover/link:text-stone-200 transition-colors">
                            {currentItem.name}
                        </h2>
                    </Link>
                    <p className="text-xs text-white/80 font-light tracking-wide line-clamp-1 mt-1.5">
                        {currentItem.subtitle}
                    </p>
                </div>

                {/* Streamlined Acquisition Console */}
                <div className="bg-black/50 backdrop-blur-md border border-white/15 p-4 rounded-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                        <span className="font-serif text-xl tracking-tight text-white">
                            {formattedPrice}
                        </span>

                        {/* Size selection */}
                        {currentSizes.length > 1 && (
                            <div className="flex items-center gap-1">
                                {currentSizes.map((sz) => (
                                    <button
                                        key={sz}
                                        type="button"
                                        onClick={() => setSelectedSize(sz)}
                                        className={`px-2 py-0.5 text-[9px] uppercase tracking-wider rounded-xs border transition-colors cursor-pointer ${
                                            selectedSize === sz
                                                ? "bg-white text-stone-900 border-white font-medium"
                                                : "bg-transparent text-white/70 border-white/20 hover:border-white/50"
                                        }`}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleQuickAdd}
                        disabled={justAdded}
                        className="py-2.5 px-5 text-[9px] uppercase tracking-[0.22em] font-semibold bg-white text-stone-950 hover:bg-stone-100 active:scale-[0.99] transition-all rounded-xs cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0"
                    >
                        {justAdded ? (
                            <>
                                <Check
                                    size={12}
                                    className="text-emerald-700 stroke-[2.5]"
                                />
                                <span>Added to Bag</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag
                                    size={12}
                                    className="stroke-[1.5]"
                                />
                                <span>Add Piece</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
