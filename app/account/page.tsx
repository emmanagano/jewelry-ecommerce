import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AuthMessage } from "@/components/AuthPanel";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { getSizeOptions } from "@/app/lib/data/products";
import {
	BagPreview,
	NewsletterCard,
	OrderHistoryCard,
	ProfileCard,
	SavedPiecesPreview,
	SecurityCard,
	SizesCard,
} from "./AccountClient";

export const metadata: Metadata = {
	title: "Your Account",
	robots: { index: false },
};

interface PageProps {
	searchParams: Promise<{ password?: string }>;
}

// Reads the session, so it streams in behind Suspense
async function AccountContent({ searchParams }: PageProps) {
	// Render only at request time: verifying the session compares the token's
	// expiry with the current time, which can't be part of a prerender
	await connection();

	const supabase = await createSupabaseServerClient();
	// getUser() verifies with Supabase Auth and includes the sign-up date
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		redirect("/login?next=/account");
	}

	const [
		profileResult,
		newsletterResult,
		sizeOptions,
		ordersResult,
		{ password },
	] = await Promise.all([
			supabase
				.from("profiles")
				.select("full_name, birthday, preferred_sizes")
				.eq("id", user.id)
				.maybeSingle(),
			supabase.rpc("get_newsletter_subscription"),
			getSizeOptions().catch((error) => {
				console.error(error);
				return [];
			}),
			// RLS limits this to the user's own orders
			supabase
				.from("orders")
				.select("id, order_number, created_at, total_cents, order_items(quantity)")
				.order("created_at", { ascending: false })
				.limit(5)
				.overrideTypes<
					{
						id: string;
						order_number: string;
						created_at: string;
						total_cents: number;
						order_items: { quantity: number }[];
					}[],
					{ merge: false }
				>(),
			searchParams,
		]);

	if (profileResult.error) {
		console.error("Failed to load profile:", profileResult.error.message);
	}
	if (ordersResult.error) {
		console.error("Failed to load orders:", ordersResult.error.message);
	}
	const orders = (ordersResult.data ?? []).map((order) => ({
		id: order.id,
		orderNumber: order.order_number,
		createdAt: order.created_at,
		totalCents: order.total_cents,
		itemCount: order.order_items.reduce((sum, item) => sum + item.quantity, 0),
	}));
	if (newsletterResult.error) {
		console.error(
			"Failed to load newsletter preference:",
			newsletterResult.error.message,
		);
	}

	const profile = profileResult.data;
	const fullName: string = profile?.full_name ?? "";
	const firstName = fullName.split(" ")[0];
	const clientSince = new Date(user.created_at).toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});

	return (
		<>
			{/* Welcome header */}
			<header className="mb-10 pb-6 border-b border-(--border-color)/60">
				<span className="eyebrow text-(--text-muted) block mb-3">
					Client Account
				</span>
				<h1 className="font-primary text-3xl sm:text-4xl tracking-tight text-(--text-headline)">
					{firstName ? `Welcome back, ${firstName}` : "Welcome back"}
				</h1>
				<p className="mt-2 eyebrow text-(--text-muted)">
					Client since {clientSince}
				</p>
			</header>

			{password === "updated" && (
				<AuthMessage tone="success">Your password has been updated.</AuthMessage>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-5 space-y-6">
					<ProfileCard
						email={user.email ?? ""}
						initial={{ fullName, birthday: profile?.birthday ?? "" }}
					/>
					{sizeOptions.length > 0 && (
						<SizesCard
							initial={(profile?.preferred_sizes as Record<string, string>) ?? {}}
							options={sizeOptions}
						/>
					)}
				</div>

				<div className="lg:col-span-7 space-y-6">
					<SavedPiecesPreview />
					<BagPreview />
					<OrderHistoryCard orders={orders} />
				</div>

				{/* Same 5/7 split as the cards above, so the columns line up */}
				<div className="lg:col-span-5">
					<SecurityCard />
				</div>
				<div className="lg:col-span-7">
					<NewsletterCard initial={newsletterResult.data === true} />
				</div>
			</div>
		</>
	);
}

function AccountSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="mb-10 pb-6 border-b border-(--border-color)/60">
				<div className="h-3 w-28 bg-(--card-sub) rounded-xs mb-4" />
				<div className="h-9 w-72 bg-(--card-sub) rounded-xs" />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-5 space-y-6">
					<div className="h-64 bg-(--card-sub) rounded-2xl" />
					<div className="h-56 bg-(--card-sub) rounded-2xl" />
				</div>
				<div className="lg:col-span-7 space-y-6">
					<div className="h-64 bg-(--card-sub) rounded-2xl" />
					<div className="h-56 bg-(--card-sub) rounded-2xl" />
				</div>
			</div>
		</div>
	);
}

export default function AccountPage({ searchParams }: PageProps) {
	return (
		<div className="min-h-screen max-w-screen-xl mx-auto px-4 sm:px-8 py-12 lg:py-16 bg-(--bg-base)">
			<Suspense fallback={<AccountSkeleton />}>
				<AccountContent searchParams={searchParams} />
			</Suspense>
		</div>
	);
}
