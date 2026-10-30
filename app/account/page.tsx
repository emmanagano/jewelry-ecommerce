import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { AuthMessage } from "@/components/AuthPanel";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { getSizeOptions } from "@/app/lib/data/products";
import {
	BagPreview,
	LatestOrderCard,
	NewsletterCard,
	OrderHistoryCard,
	ProfileCard,
	SavedPiecesPreview,
	SecurityCard,
	SizesCard,
} from "./AccountClient";
import AccountTabs from "./AccountTabs";
import { parseAccountTab } from "./tabs";

export const metadata: Metadata = {
	title: "Your Account",
	robots: { index: false },
};

interface PageProps {
	searchParams: Promise<{ password?: string; tab?: string }>;
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
		{ password, tab },
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
				.limit(20)
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
			<header className="mb-10 pb-8 border-b border-(--border-color)">
				<span className="eyebrow text-(--text-muted) block mb-3">
					Your Account
				</span>
				<h1 className="font-primary text-heading sm:text-title tracking-tight text-(--text-headline)">
					{firstName ? `Welcome back, ${firstName}` : "Welcome back"}
				</h1>
				<p className="mt-2 eyebrow text-(--text-muted)">
					Client since {clientSince}
				</p>
			</header>

			{password === "updated" && (
				<AuthMessage tone="success">Your password has been updated.</AuthMessage>
			)}

			<AccountTabs
				initialTab={parseAccountTab(tab)}
				orderCount={orders.length}
				panels={{
					overview: (
						<div className="space-y-12">
							<LatestOrderCard order={orders[0]} />
							<SavedPiecesPreview />
							<BagPreview />
						</div>
					),
					orders: <OrderHistoryCard orders={orders} />,
					saved: <SavedPiecesPreview flush limit={12} />,
					details: (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
					),
					preferences: (
						<div className="space-y-12">
							<NewsletterCard initial={newsletterResult.data === true} />
							<SecurityCard />
						</div>
					),
				}}
			/>
		</>
	);
}

function AccountSkeleton() {
	return (
		<div className="animate-pulse">
			<div className="mb-10 pb-8 border-b border-(--border-color)">
				<div className="h-3 w-28 bg-(--card-sub) rounded-xs mb-4" />
				<div className="h-9 w-72 bg-(--card-sub) rounded-xs" />
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-[13rem_1fr] gap-x-16 gap-y-8">
				<div className="space-y-3">
					{[1, 2, 3, 4, 5].map((n) => (
						<div key={n} className="h-5 w-32 bg-(--card-sub) rounded-xs" />
					))}
				</div>
				<div className="space-y-8">
					<div className="h-28 bg-(--card-sub) rounded-xs" />
					<div className="h-56 bg-(--card-sub) rounded-xs" />
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
