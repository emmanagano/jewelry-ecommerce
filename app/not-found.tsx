import Button from "@/components/ui/Button";

// Shown for unknown URLs and when a page calls notFound()
export default function NotFound() {
	return (
		<section className="min-h-[60vh] max-w-xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
			<span className="eyebrow mb-6 text-(--text-muted)">Not Found</span>
			<h1 className="font-serif text-heading sm:text-title tracking-tight leading-tight mb-5 text-balance text-(--text-headline)">
				This piece could not be found.
			</h1>
			<p className="text-copy mb-10 text-(--text-body)">
				It may have moved, or the link may be incomplete.
			</p>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<Button href="/">Return Home</Button>
				<Button href="/collections/new-and-featured" variant="secondary">
					Discover the Collections
				</Button>
			</div>
		</section>
	);
}
