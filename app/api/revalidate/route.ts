import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

// Called by Supabase Database Webhooks whenever a catalog table changes
// (see supabase/templates/revalidate_webhooks.sql), so dashboard edits show
// on the site straight away instead of when the hour-long cache expires.
//
// Expects the webhook payload ({ type, table, record, old_record, ... }) and
// an `x-revalidate-secret` header matching REVALIDATE_SECRET.

// Which cache tags (see app/lib/data/products.ts) each table feeds
const TABLE_TAGS: Record<string, string[]> = {
	products: ["products"],
	product_variants: ["products"],
	categories: ["categories"],
	collections: ["collections"],
	product_collections: ["collections"],
};

function secretMatches(provided: string, expected: string) {
	const a = Buffer.from(provided);
	const b = Buffer.from(expected);
	return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
	const secret = process.env.REVALIDATE_SECRET;
	if (!secret) {
		console.error("REVALIDATE_SECRET is not set; refusing to revalidate");
		return NextResponse.json({ error: "Not configured" }, { status: 500 });
	}

	const provided = request.headers.get("x-revalidate-secret") ?? "";
	if (!secretMatches(provided, secret)) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	let table: unknown;
	try {
		({ table } = await request.json());
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const tags = typeof table === "string" ? TABLE_TAGS[table] : undefined;
	if (!tags) {
		return NextResponse.json({ error: "Unknown table" }, { status: 400 });
	}

	// expire: 0 so the next visitor gets fresh data, not one last stale copy
	tags.forEach((tag) => revalidateTag(tag, { expire: 0 }));

	return NextResponse.json({ revalidated: tags });
}
