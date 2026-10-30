"use client";

import React, { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import { useWishlistProducts } from "@/app/lib/use-wishlist-products";
import { isDemoAccount } from "@/app/lib/demo-account";
import { useAccountTab } from "./AccountTabs";
import { formatPrice } from "@/app/lib/format";
import type { SizeOption } from "@/app/lib/data/products";
import { ONE_SIZE } from "@/app/lib/products";
import {
	setNewsletter,
	updateProfile,
	updateSizes,
	type ActionResult,
	type ProfileValues,
	type SizeValues,
} from "./actions";
import { AUTH_INPUT_CLASS, AuthMessage } from "@/components/AuthPanel";

const LABEL_CLASS =
	"block eyebrow text-(--text-muted)";
const TEXT_LINK_CLASS =
	"text-label uppercase font-medium text-(--text-muted) hover:text-(--text-headline) transition-colors cursor-pointer underline underline-offset-4 disabled:opacity-50";
const PRIMARY_BUTTON_CLASS =
	"py-3 px-6 rounded-xs bg-(--text-headline) text-(--bg-base) text-label uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer";

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

export function AccountCard({
	title,
	action,
	className = "",
	flush = false,
	children,
}: {
	title: string;
	action?: React.ReactNode;
	className?: string;
	// The first card on a panel sits under the page rule, so it drops its own
	flush?: boolean;
	children: React.ReactNode;
}) {
	return (
		<section
			className={`${className} ${flush ? "" : "border-t border-(--border-color) pt-8"}`}
		>
			<div className="flex items-center justify-between gap-4 mb-6">
				<h2 className="text-label uppercase font-medium text-(--text-headline)">
					{title}
				</h2>
				{action}
			</div>
			{children}
		</section>
	);
}

// View mode by default; the form shows only while editing, and a successful
// save returns to view mode with the saved values
function useEditableCard<T>(
	action: (
		prev: ActionResult<T> | null,
		formData: FormData,
	) => Promise<ActionResult<T>>,
	initial: T,
	onSaved?: (values: T) => void,
) {
	const [editing, setEditing] = useState(false);
	const [values, setValues] = useState(initial);
	const [result, formAction, pending] = useActionState(
		async (prev: ActionResult<T> | null, formData: FormData) => {
			const next = await action(prev, formData);
			if (next.ok) {
				setValues(next.values);
				setEditing(false);
				onSaved?.(next.values);
			}
			return next;
		},
		null,
	);

	// Errors show while editing; the success note shows after returning
	const message =
		result && (editing ? !result.ok : result.ok) ? result : null;

	return { editing, setEditing, values, formAction, pending, message };
}

function EditButton({ onClick }: { onClick: () => void }) {
	return (
		<button type="button" onClick={onClick} className={TEXT_LINK_CLASS}>
			Edit
		</button>
	);
}

function FormActions({
	pending,
	onCancel,
}: {
	pending: boolean;
	onCancel: () => void;
}) {
	return (
		<div className="flex items-center gap-6 pt-2">
			<button type="submit" disabled={pending} className={PRIMARY_BUTTON_CLASS}>
				{pending ? "Saving..." : "Save"}
			</button>
			<button
				type="button"
				onClick={onCancel}
				disabled={pending}
				className={TEXT_LINK_CLASS}
			>
				Cancel
			</button>
		</div>
	);
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div>
			<dt className={LABEL_CLASS}>{label}</dt>
			<dd className="mt-1.5 font-body text-copy-sm text-(--text-headline)">
				{value}
			</dd>
		</div>
	);
}

function NotSet() {
	return <span className="text-(--text-muted)">Not set</span>;
}

function formatBirthday(birthday: string) {
	return new Date(`${birthday}T00:00:00Z`).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	});
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export function ProfileCard({
	email,
	initial,
}: {
	email: string;
	initial: ProfileValues;
}) {
	const { editing, setEditing, values, formAction, pending, message } =
		useEditableCard(updateProfile, initial);

	return (
		<AccountCard
			flush
			title="Profile"
			action={!editing && <EditButton onClick={() => setEditing(true)} />}
		>
			{message && (
				<AuthMessage tone={message.ok ? "success" : "error"}>
					{message.message}
				</AuthMessage>
			)}

			{editing ? (
				<form action={formAction} className="space-y-4">
					<label className={LABEL_CLASS}>
						Full Name
						<input
							name="full_name"
							defaultValue={values.fullName}
							maxLength={120}
							autoComplete="name"
							className={`${AUTH_INPUT_CLASS} mt-2`}
						/>
					</label>
					<label className={LABEL_CLASS}>
						Birthday <span className="normal-case tracking-normal">(optional, for gift reminders)</span>
						<input
							type="date"
							name="birthday"
							defaultValue={values.birthday}
							min="1900-01-02"
							max={new Date().toISOString().slice(0, 10)}
							autoComplete="bday"
							className={`${AUTH_INPUT_CLASS} mt-2`}
						/>
					</label>
					<FormActions pending={pending} onCancel={() => setEditing(false)} />
				</form>
			) : (
				<dl className="space-y-5">
					<Detail label="Full Name" value={values.fullName || <NotSet />} />
					<Detail label="Email" value={email} />
					<Detail
						label="Birthday"
						value={values.birthday ? formatBirthday(values.birthday) : <NotSet />}
					/>
				</dl>
			)}
		</AccountCard>
	);
}

// ---------------------------------------------------------------------------
// Saved sizes
// ---------------------------------------------------------------------------

export function SizesCard({
	initial,
	options,
}: {
	initial: SizeValues;
	options: SizeOption[];
}) {
	const { refreshProfile } = useAuth();
	// Saved sizes pre-select on product pages, so reload them after saving
	const { editing, setEditing, values, formAction, pending, message } =
		useEditableCard(updateSizes, initial, () => refreshProfile());

	return (
		<AccountCard
			flush
			title="My Sizes"
			action={!editing && <EditButton onClick={() => setEditing(true)} />}
		>
			{message && (
				<AuthMessage tone={message.ok ? "success" : "error"}>
					{message.message}
				</AuthMessage>
			)}

			{editing ? (
				<form action={formAction} className="space-y-4">
					{options.map((option) => (
						<label key={option.categorySlug} className={LABEL_CLASS}>
							{option.sizeLabel}{" "}
							<span className="normal-case tracking-normal">
								({option.categoryName})
							</span>
							<select
								name={`size:${option.categorySlug}`}
								defaultValue={values[option.categorySlug] ?? ""}
								className={`${AUTH_INPUT_CLASS} mt-2 cursor-pointer`}
							>
								<option value="">Not set</option>
								{option.sizes.map((size) => (
									<option key={size} value={size}>
										{size}
									</option>
								))}
							</select>
						</label>
					))}
					<FormActions pending={pending} onCancel={() => setEditing(false)} />
				</form>
			) : (
				<>
					<dl className="space-y-5">
						{options.map((option) => (
							<Detail
								key={option.categorySlug}
								label={`${option.sizeLabel} (${option.categoryName})`}
								value={values[option.categorySlug] ?? <NotSet />}
							/>
						))}
					</dl>
					<p className="mt-6 text-copy-sm text-(--text-muted)">
						Saved sizes are selected for you on product pages.
					</p>
				</>
			)}
		</AccountCard>
	);
}

// ---------------------------------------------------------------------------
// Saved pieces and bag previews
// ---------------------------------------------------------------------------

function ViewAllLink({ href, label }: { href: string; label: string }) {
	return (
		<Link
			href={href}
			className="group inline-flex items-center gap-1.5 text-label uppercase font-medium text-(--text-headline) hover:opacity-70 transition-opacity"
		>
			<span>{label}</span>
			<ArrowRight
				size={12}
				className="stroke-[1.5] transition-transform group-hover:translate-x-0.5"
			/>
		</Link>
	);
}

function EmptyPreview({
	icon,
	text,
	href,
	cta,
}: {
	icon: React.ReactNode;
	text: string;
	href: string;
	cta: string;
}) {
	return (
		<div className="py-8 flex flex-col items-center text-center">
			<div className="w-12 h-12 rounded-full border border-(--border-color) bg-(--card-sub)/50 flex items-center justify-center mb-4 text-(--text-muted)">
				{icon}
			</div>
			<p className="font-body text-copy-sm text-(--text-muted) mb-4">{text}</p>
			<ViewAllLink href={href} label={cta} />
		</div>
	);
}

function PreviewSkeleton() {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
			{[1, 2, 3, 4].map((n) => (
				<div key={n} className="aspect-4/5 bg-(--card-sub) rounded-xs" />
			))}
		</div>
	);
}

export function SavedPiecesPreview({
	limit = 4,
	flush = false,
}: {
	limit?: number;
	flush?: boolean;
}) {
	const { totalWishlistCount } = useStore();
	const { products, isLoading } = useWishlistProducts();
	const preview = products.slice(0, limit);

	return (
		<AccountCard
			flush={flush}
			title={`Saved Pieces${totalWishlistCount ? ` (${totalWishlistCount})` : ""}`}
			action={
				totalWishlistCount > 0 && (
					<ViewAllLink href="/my-wishlist" label="View All" />
				)
			}
		>
			{isLoading ? (
				<PreviewSkeleton />
			) : preview.length === 0 ? (
				<EmptyPreview
					icon={<Heart size={16} className="stroke-[1.5]" />}
					text="Select the heart on any piece to keep it here."
					href="/collections/new-and-featured"
					cta="Discover New Pieces"
				/>
			) : (
				<ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					{preview.map((product) => (
						<li key={product.id}>
							<Link href={`/product/${product.slug}`} className="group block">
								<div className="relative aspect-4/5 overflow-hidden bg-(--card-sub) border border-(--border-color) rounded-xs">
									{product.images?.[0] && (
										<Image
											src={product.images[0]}
											alt={product.name}
											fill
											sizes="(min-width: 1024px) 12vw, (min-width: 640px) 22vw, 45vw"
											className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
										/>
									)}
								</div>
								<p className="mt-2 font-primary text-copy-sm text-(--text-headline) truncate group-hover:opacity-70 transition-opacity">
									{product.name}
								</p>
								<p className="font-secondary text-copy-sm text-(--text-muted)">
									{formatPrice(product.price)}
								</p>
							</Link>
						</li>
					))}
				</ul>
			)}
		</AccountCard>
	);
}

export function BagPreview() {
	const { cart, totalCartCount, isHydrated } = useStore();
	const preview = cart.slice(0, 3);
	const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	return (
		<AccountCard
			title={`Your Bag${totalCartCount ? ` (${totalCartCount})` : ""}`}
		>
			{!isHydrated ? (
				<div className="space-y-3 animate-pulse">
					<div className="h-16 bg-(--card-sub) rounded-xs" />
					<div className="h-16 bg-(--card-sub) rounded-xs" />
				</div>
			) : cart.length === 0 ? (
				<EmptyPreview
					icon={<ShoppingBag size={16} className="stroke-[1.5]" />}
					text="Your bag is empty."
					href="/collections/best-sellers"
					cta="Discover Best Sellers"
				/>
			) : (
				<>
					<ul className="divide-y divide-(--border-color)/60">
						{preview.map((item) => (
							<li
								key={`${item.id}-${item.size}`}
								className="py-3 first:pt-0 flex items-center gap-4"
							>
								<Link
									href={`/product/${item.slug}`}
									className="relative w-12 aspect-4/5 shrink-0 overflow-hidden bg-(--card-sub) border border-(--border-color) rounded-xs"
								>
									{item.image && (
										<Image
											src={item.image}
											alt={item.name}
											fill
											sizes="48px"
											className="object-cover"
										/>
									)}
								</Link>
								<div className="flex-1 min-w-0">
									<p className="font-primary text-copy-sm text-(--text-headline) truncate">
										{item.name}
									</p>
									<p className="font-secondary eyebrow text-(--text-muted)">
										{item.size === ONE_SIZE ? "One Size" : `Size ${item.size}`} · Qty{" "}
										{item.quantity}
									</p>
								</div>
								<span className="font-serif text-copy-sm text-(--text-headline)">
									{formatPrice(item.price * item.quantity)}
								</span>
							</li>
						))}
					</ul>
					{cart.length > preview.length && (
						<p className="mt-2 text-copy-sm text-(--text-muted)">
							+ {cart.length - preview.length} more{" "}
							{cart.length - preview.length === 1 ? "piece" : "pieces"}
						</p>
					)}
					<div className="mt-6 pt-5 border-t border-(--border-color)/60 flex items-center justify-between gap-4">
						<div>
							<span className={LABEL_CLASS}>Subtotal</span>
							<span className="font-serif text-lg text-(--text-headline)">
								{formatPrice(subtotal)}
							</span>
						</div>
						<Link href="/shopping-bag" className={PRIMARY_BUTTON_CLASS}>
							Go to Bag
						</Link>
					</div>
				</>
			)}
		</AccountCard>
	);
}

// ---------------------------------------------------------------------------
// Email preferences and security
// ---------------------------------------------------------------------------

export function NewsletterCard({ initial }: { initial: boolean }) {
	const [subscribed, setSubscribed] = useState(initial);
	const [result, formAction, pending] = useActionState(
		async (prev: ActionResult<boolean> | null, formData: FormData) => {
			const next = await setNewsletter(prev, formData);
			if (next.ok) setSubscribed(next.values);
			return next;
		},
		null,
	);

	return (
		<AccountCard flush title="Email Preferences" className="h-full">
			{result && !result.ok && (
				<AuthMessage tone="error">{result.message}</AuthMessage>
			)}
			<form action={formAction} className="flex items-start justify-between gap-6">
				<div>
					<p className="font-body text-copy-sm text-(--text-headline)">
						The Vaelore Letter
					</p>
					<p className="mt-1 text-copy-sm text-(--text-muted)">
						Private previews, new collections and care notes. Never
						more than twice a month.
					</p>
				</div>
				<input type="hidden" name="subscribe" value={String(!subscribed)} />
				<button
					type="submit"
					role="switch"
					aria-checked={subscribed}
					aria-label="Subscribe to The Vaelore Letter"
					disabled={pending}
					className={`relative shrink-0 w-11 h-6 rounded-full border transition-colors cursor-pointer disabled:opacity-50 ${
						subscribed
							? "bg-(--text-headline) border-(--text-headline)"
							: "bg-(--card-sub) border-(--border-color)"
					}`}
				>
					<span
						className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform ${
							subscribed ? "translate-x-5" : ""
						}`}
					/>
				</button>
			</form>
			{result?.ok && (
				<p role="status" className="mt-4 text-copy-sm text-(--text-muted)">
					{result.message}
				</p>
			)}
		</AccountCard>
	);
}

export function SecurityCard() {
	const { user } = useAuth();
	// The demo login is shared, so its password stays fixed
	const isDemo = isDemoAccount(user?.email);

	return (
		<AccountCard title="Security" className="h-full">
			{isDemo && (
				<p className="mb-4 text-copy-sm text-(--text-muted)">
					You&rsquo;re using the shared demo account, so the password
					can&rsquo;t be changed. Everything else works as usual.
				</p>
			)}
			{!isDemo && (
				<Link href="/reset-password" className={TEXT_LINK_CLASS}>
					Change Password
				</Link>
			)}
		</AccountCard>
	);
}

// ---------------------------------------------------------------------------
// Order history
// ---------------------------------------------------------------------------

export interface OrderSummary {
	id: string;
	orderNumber: string;
	createdAt: string;
	totalCents: number;
	itemCount: number;
}

function formatOrderDate(createdAt: string) {
	return new Date(createdAt).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

// The most recent order, front and centre on the overview
export function LatestOrderCard({ order }: { order: OrderSummary | undefined }) {
	const setTab = useAccountTab();

	return (
		<AccountCard
			flush
			title="Latest Order"
			action={
				order && (
					<button type="button" onClick={() => setTab("orders")} className={TEXT_LINK_CLASS}>
						All Orders
					</button>
				)
			}
		>
			{order ? (
				<div className="flex flex-wrap items-end justify-between gap-6">
					<div>
						<p className="font-secondary text-label uppercase font-medium text-(--text-headline)">
							{order.orderNumber}
						</p>
						<p className="mt-1 text-copy-sm text-(--text-muted)">
							{formatOrderDate(order.createdAt)} · {order.itemCount}{" "}
							{order.itemCount === 1 ? "piece" : "pieces"}
						</p>
						<p className="mt-4 font-serif text-heading text-(--text-headline)">
							{formatPrice(order.totalCents)}
						</p>
					</div>
					<Link href={`/orders/${order.id}`} className={PRIMARY_BUTTON_CLASS}>
						View Order
					</Link>
				</div>
			) : (
				<EmptyPreview
					icon={<ShoppingBag size={16} className="stroke-[1.5]" />}
					text="Your orders will appear here."
					href="/collections/new-and-featured"
					cta="Discover New Pieces"
				/>
			)}
		</AccountCard>
	);
}

export function OrderHistoryCard({ orders }: { orders: OrderSummary[] }) {
	return (
		<AccountCard flush title="Order History">
			{orders.length === 0 ? (
				<EmptyPreview
					icon={<ShoppingBag size={16} className="stroke-[1.5]" />}
					text="Your orders will appear here."
					href="/shopping-bag"
					cta="View Your Bag"
				/>
			) : (
				<ul className="divide-y divide-(--border-color)/60">
					{orders.map((order) => (
						<li key={order.id}>
							<Link
								href={`/orders/${order.id}`}
								className="group py-3.5 first:pt-0 flex items-center justify-between gap-4"
							>
								<div>
									<p className="font-secondary text-label uppercase font-medium text-(--text-headline) group-hover:opacity-70 transition-opacity">
										{order.orderNumber}
									</p>
									<p className="text-copy-sm text-(--text-muted)">
										{formatOrderDate(order.createdAt)} · {order.itemCount} {order.itemCount === 1 ? "piece" : "pieces"}
									</p>
								</div>
								<span className="flex items-center gap-3 font-serif text-copy-sm text-(--text-headline)">
									{formatPrice(order.totalCents)}
									<ArrowRight
										size={12}
										className="stroke-[1.5] text-(--text-muted) transition-transform group-hover:translate-x-0.5"
									/>
								</span>
							</Link>
						</li>
					))}
				</ul>
			)}
		</AccountCard>
	);
}
