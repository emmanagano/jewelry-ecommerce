import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CheckCircle2 } from "lucide-react";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";
import { formatPrice } from "@/app/lib/format";
import { ONE_SIZE } from "@/app/lib/products";

export const metadata: Metadata = {
	title: "Your Order",
	robots: { index: false },
};

interface PageProps {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ token?: string; placed?: string }>;
}

interface OrderDetail {
	order_number: string;
	created_at: string;
	email: string;
	full_name: string;
	phone: string | null;
	shipping_address: {
		line1: string;
		line2?: string;
		city: string;
		region?: string;
		postal_code: string;
		country: string;
	};
	payment_brand: string;
	payment_last4: string;
	gift_packaging: boolean;
	gift_note: string | null;
	promo_code: string | null;
	subtotal_cents: number;
	discount_cents: number;
	gift_cents: number;
	shipping_cents: number;
	total_cents: number;
	is_demo: boolean;
	items: {
		product_name: string;
		product_slug: string;
		size: string;
		image: string | null;
		unit_price_cents: number;
		quantity: number;
	}[];
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LABEL_CLASS =
	"eyebrow text-(--text-muted)";
const SECTION_CLASS =
	"border border-(--border-color) bg-(--card-sub)/20 p-6 sm:p-8 rounded-xs";

// Visible to the order's owner, or to anyone with the confirmation link's
// token (guest orders); see get_order() in the orders migration
async function OrderContent({ params, searchParams }: PageProps) {
	await connection();
	const [{ id }, { token, placed }] = await Promise.all([params, searchParams]);
	if (!UUID.test(id) || (token && !UUID.test(token))) notFound();

	const supabase = await createSupabaseServerClient();
	const { data, error } = await supabase.rpc("get_order", {
		p_order_id: id,
		p_access_token: token ?? null,
	});
	if (error) {
		console.error("Failed to load order:", error.message);
		throw new Error("Failed to load order");
	}
	const order = data as OrderDetail | null;
	if (!order) notFound();

	const placedOn = new Date(order.created_at).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
	const address = order.shipping_address;

	return (
		<>
			<div className="mb-10 pb-6 border-b border-(--border-color)/60">
				{placed === "1" && (
					<div className="flex items-center gap-2 mb-4 text-(--success)">
						<CheckCircle2 size={16} className="stroke-[1.5]" />
						<span className="text-label uppercase font-medium">
							Order placed
						</span>
					</div>
				)}
				<h1 className="font-primary text-3xl sm:text-4xl tracking-tight text-(--text-headline)">
					{placed === "1"
						? `Thank you, ${order.full_name.split(" ")[0]}`
						: `Order ${order.order_number}`}
				</h1>
				<p className="mt-3 font-body text-sm text-(--text-body)">
					Order <span className="font-medium text-(--text-headline)">{order.order_number}</span>{" "}
					· {placedOn} · Confirmation for {order.email}
				</p>
				{order.is_demo && (
					<p className="mt-4 inline-block px-3 py-1.5 rounded-xs border border-(--border-color) bg-(--card-main)/40 text-copy-sm text-(--text-body)">
						This is a demo order. No payment was taken and nothing will ship.
					</p>
				)}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
				<section className={`${SECTION_CLASS} lg:col-span-7`}>
					<h2 className={`${LABEL_CLASS} mb-6`}>Pieces</h2>
					<ul className="divide-y divide-(--border-color)/60">
						{order.items.map((item, idx) => (
							<li key={`${item.product_slug}-${item.size}-${idx}`} className="py-4 first:pt-0 flex items-center gap-4">
								<Link
									href={`/product/${item.product_slug}`}
									className="relative w-16 aspect-4/5 shrink-0 overflow-hidden bg-(--card-sub) border border-(--border-color) rounded-xs"
								>
									{item.image && (
										<Image src={item.image} alt={item.product_name} fill sizes="64px" className="object-cover" />
									)}
								</Link>
								<div className="flex-1 min-w-0">
									<p className="font-primary text-sm sm:text-base text-(--text-headline) truncate">
										{item.product_name}
									</p>
									<p className="font-secondary eyebrow text-(--text-muted)">
										{item.size === ONE_SIZE ? "One Size" : `Size ${item.size}`} · Qty {item.quantity} ·{" "}
										{formatPrice(item.unit_price_cents)} each
									</p>
								</div>
								<span className="font-serif text-sm text-(--text-headline)">
									{formatPrice(item.unit_price_cents * item.quantity)}
								</span>
							</li>
						))}
					</ul>
				</section>

				<div className="lg:col-span-5 space-y-6">
					<section className={SECTION_CLASS}>
						<h2 className={`${LABEL_CLASS} mb-5`}>Summary</h2>
						<dl className="space-y-3 text-label uppercase pb-5 border-b border-(--border-color)/60 text-(--text-muted)">
							<Row label="Subtotal" value={formatPrice(order.subtotal_cents)} />
							{order.gift_cents > 0 && <Row label="Gift Presentation" value={formatPrice(order.gift_cents)} />}
							{order.discount_cents > 0 && (
								<Row label={`Code ${order.promo_code}`} value={`-${formatPrice(order.discount_cents)}`} />
							)}
							<Row
								label="Insured Courier"
								value={order.shipping_cents === 0 ? "Complimentary" : formatPrice(order.shipping_cents)}
							/>
							<Row label="Taxes & Duties" value="Included" />
						</dl>
						<div className="flex justify-between items-baseline pt-5">
							<span className="text-label uppercase font-medium text-(--text-headline)">
								Total
							</span>
							<span className="font-primary text-2xl text-(--text-headline)">
								{formatPrice(order.total_cents)}
							</span>
						</div>
					</section>

					<section className={`${SECTION_CLASS} grid grid-cols-1 sm:grid-cols-2 gap-6 font-body text-xs leading-relaxed text-(--text-body)`}>
						<div>
							<h2 className={`${LABEL_CLASS} mb-2`}>Shipping To</h2>
							<p className="text-(--text-headline)">{order.full_name}</p>
							<p>{address.line1}</p>
							{address.line2 && <p>{address.line2}</p>}
							<p>
								{address.city}
								{address.region ? `, ${address.region}` : ""} {address.postal_code}
							</p>
							<p>{address.country}</p>
						</div>
						<div>
							<h2 className={`${LABEL_CLASS} mb-2`}>Payment</h2>
							<p className="text-(--text-headline)">
								{order.payment_brand} ending {order.payment_last4}
							</p>
							{order.is_demo && <p className="text-(--text-muted)">Demo card, not charged</p>}
							{order.gift_packaging && (
								<>
									<h2 className={`${LABEL_CLASS} mt-5 mb-2`}>Gift</h2>
									<p>Signature gift presentation</p>
									{order.gift_note && <p className="italic">&ldquo;{order.gift_note}&rdquo;</p>}
								</>
							)}
						</div>
					</section>

					<div className="flex flex-wrap items-center gap-6">
						<Link
							href="/"
							className="py-3.5 px-8 text-label uppercase font-medium bg-(--text-headline) text-(--bg-base) hover:opacity-90 transition-opacity rounded-xs"
						>
							Continue Shopping
						</Link>
						<Link
							href="/account"
							className="text-label uppercase font-medium text-(--text-muted) hover:text-(--text-headline) underline underline-offset-4 transition-colors"
						>
							Your Account
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}

function Row({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex justify-between">
			<dt>{label}</dt>
			<dd className="text-(--text-headline)">{value}</dd>
		</div>
	);
}

export default function OrderPage(props: PageProps) {
	return (
		<div className="min-h-screen max-w-screen-xl mx-auto px-4 sm:px-8 py-12 lg:py-16 bg-(--bg-base)">
			<Suspense
				fallback={
					<div className="animate-pulse space-y-6">
						<div className="h-10 w-72 bg-(--card-sub) rounded-xs" />
						<div className="h-80 bg-(--card-sub) rounded-xs" />
					</div>
				}
			>
				<OrderContent {...props} />
			</Suspense>
		</div>
	);
}
