"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

export interface GalleryImage {
	src: string;
	alt: string;
	// A zoomed crop of the first photo, for products with few photos
	detail?: boolean;
}

// One swipeable image area (scroll-snap). Desktop adds a thumbnail rail;
// phones get dots. Both stay in sync with the visible slide.
export default function ProductGallery({ images }: { images: GalleryImage[] }) {
	const trackRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);

	const goTo = (index: number) => {
		const track = trackRef.current;
		if (!track) return;
		track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
	};

	const onScroll = () => {
		const track = trackRef.current;
		if (!track || track.clientWidth === 0) return;
		setActive(Math.round(track.scrollLeft / track.clientWidth));
	};

	if (images.length === 0) {
		return <div className="aspect-4/5 rounded-xs bg-(--card-sub)" />;
	}

	return (
		<div className="flex gap-4">
			{/* Thumbnail rail (desktop) */}
			{images.length > 1 && (
				<ul className="hidden lg:flex flex-col gap-3 w-20 shrink-0">
					{images.map((image, idx) => (
						<li key={`${image.src}-${idx}`}>
							<button
								type="button"
								onClick={() => goTo(idx)}
								aria-label={`Show image ${idx + 1} of ${images.length}`}
								aria-current={active === idx}
								className={`relative block w-full aspect-4/5 overflow-hidden rounded-xs bg-(--card-sub) cursor-pointer transition-opacity ${
									active === idx
										? "ring-1 ring-(--text-headline) ring-offset-2 ring-offset-(--bg-base)"
										: "opacity-60 hover:opacity-100"
								}`}
							>
								<Image
									src={image.src}
									alt=""
									fill
									sizes="80px"
									className={`object-cover ${image.detail ? "scale-150" : ""}`}
								/>
							</button>
						</li>
					))}
				</ul>
			)}

			<div className="flex-1 min-w-0">
				<div
					ref={trackRef}
					onScroll={onScroll}
					role="region"
					aria-roledescription="carousel"
					aria-label="Product images"
					tabIndex={0}
					className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar rounded-xs focus-visible:outline-2 focus-visible:outline-(--text-headline)"
					style={{ scrollbarWidth: "none" }}
				>
					{images.map((image, idx) => (
						<div
							key={`${image.src}-${idx}`}
							className="relative w-full shrink-0 snap-center aspect-4/5 overflow-hidden bg-(--card-sub)"
							aria-hidden={active !== idx}
						>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								sizes="(min-width: 1024px) 50vw, 100vw"
								loading={idx === 0 ? "eager" : "lazy"}
								fetchPriority={idx === 0 ? "high" : "auto"}
								className={`object-cover ${image.detail ? "scale-150" : ""}`}
							/>
						</div>
					))}
				</div>

				{/* Dots (phones and tablets) */}
				{images.length > 1 && (
					<div className="lg:hidden mt-4 flex justify-center gap-2">
						{images.map((_, idx) => (
							<button
								key={idx}
								type="button"
								onClick={() => goTo(idx)}
								aria-label={`Show image ${idx + 1} of ${images.length}`}
								aria-current={active === idx}
								className={`h-1.5 rounded-full transition-all cursor-pointer ${
									active === idx
										? "w-6 bg-(--text-headline)"
										: "w-1.5 bg-(--border-color)"
								}`}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
