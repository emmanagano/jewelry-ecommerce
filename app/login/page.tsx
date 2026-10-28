import React from "react";
import EditorialShowcase from "@/components/EditorialShowcase";
import GlassAuthCard from "@/components/GlassAuthCard";

export default function ClientLoginPage() {
    return (
        <main className="w-full min-h-[calc(100vh-140px)] flex flex-col justify-center bg-(--bg-base)">
            <div className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[720px] lg:h-[82vh] border-y border-(--border-color)">
                {/* LEFT: Full-height Editorial Showcase (Spans 6 or 7 cols) */}
                <div className="hidden lg:block lg:col-span-7 h-full border-r border-(--border-color) relative overflow-hidden">
                    <EditorialShowcase />
                </div>

                {/* RIGHT: Centered 3D Glass Salon Desk (Spans 5 cols) */}
                <div className="col-span-1 lg:col-span-5 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-linear-to-b from-(--card-sub)/20 to-transparent">
                    <GlassAuthCard />
                </div>
            </div>
        </main>
    );
}
