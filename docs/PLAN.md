# Improvement Plan

Scope: schema changes allowed; no payments.

## Current state (2026-10-30)

- Supabase `products` table, 8 rows: `id, name, slug, subtitle, badge, category, price, images[], description, created_at`.
- `category` is free text ("Necklaces"), matched with `ilike`.
- `badge` mixes several labels in one string ("BEST SELLER | TOP GIFT"); Best Sellers is found by matching text in it.
- Code references `imageUrl`, which is not a column.
- Cart and wishlist live in localStorage only. Auth calls exist but there is no session handling.

## Target schema

```
categories            id, slug (unique), name, description, banner_image,
                      size_label, sort_order

products              + category_id -> categories   (replaces text `category`)
                      + metal, stone                 (filters)
                      + materials_care text          (replaces hard-coded copy)
                      + search tsvector (generated)  (search)
                      badge -> one display label only

product_variants      id, product_id, size, stock, price_override (nullable)

collections           id, slug, name, description, banner_image
product_collections   product_id, collection_id, position

promo_codes           code, percent_off, active, expires_at
newsletter_subscribers email (unique), created_at

-- phase 3
profiles              id -> auth.users, full_name
wishlist_items        user_id, product_id
cart_items            user_id, variant_id, quantity
```

RLS: catalog tables public read-only; newsletter insert-only; wishlist/cart owner-only.

Migrations live in `supabase/migrations/*.sql`. A seed migration moves the existing 8 products into the new structure (combined badges -> collections, size lists -> variants).

## Phase 1: Foundation (done 2026-10-30)

- [x] `app/lib/motion.ts`: shared `luxurySpring`, `staggerContainer()`, `fadeSlide()` (replaced 11 copies)
- [x] `app/lib/format.ts`: `formatPrice`
- [x] `app/lib/products.ts`: `Product` / `ProductSummary` types, `PRODUCT_SUMMARY_COLUMNS`, single `getSizes()` source (replaced 4 `Product` and 2 `CartItem` interfaces, 2 conflicting size maps)
- [x] `app/lib/data/products.ts`: cached + tagged server fetchers (`getProductSlugs`, `getProductBySlug`, `getProductsByCategory`)
- [x] Product page: no default size; Add to Bag disabled until chosen; `aria-pressed` on sizes
- [x] Removed nested `<main>` elements (product, category, bag, wishlist, login, coming-soon)
- [x] Product gallery shows all real photos; detail crop only when fewer than 3
- [x] Coming-soon heading wraps; inline styles replaced with token classes
- [x] Fixed `absolute 0` class typo in Navbar
- [x] `addToCart` no longer mutates the existing cart item
- [x] Deleted `codebase.md` and `dataseed.ts`
- [x] Status colors moved to tokens (`--accent-love`, `--success`, `--error-*`)
- Left for later: Supabase-generated `Database` type (needs the CLI or schema export); decorative gradient/dot colors in GlassAuthCard and EditorialShowcase

## Phase 2: Data-driven catalog (done 2026-10-30)

- [x] Run `supabase/migrations/20261030000001_catalog_structure.sql` in the SQL Editor (tested on local Postgres 14: applies cleanly, safe to re-run)
- [x] Navbar, category routes, banners, `generateStaticParams`, coming-soon links read from `categories`
- [x] Sizes from `product_variants` in card and product page; size label from `categories.size_label`; variant `price_override` respected. Cart stays keyed on product id + size (unique per variant), so existing carts keep working
- [x] `/collections/[slug]` (Best Sellers, New & Featured, Gifts); homepage slider and login showcase fetch on the server
- [x] Filter (metal, stone, price) and sort via URL search params, applied in the browser over the prerendered list (`app/lib/listing.ts`)
- [x] `/search?q=` with Postgres full-text search; search input on desktop and mobile
- [x] `next/image` everywhere + `remotePatterns`; `generateMetadata` + title template; product JSON-LD; lighter page transition keyed on pathname
- [x] Accessibility: `aria-expanded` / `aria-controls` on accordions, filters, menu; `aria-pressed` on sizes and filter chips; size picker focus + Escape; mobile menu focus trap + Escape
- [x] Verified against the live database (joins, collection order, search, RLS blocks anon inserts); build passes; all routes smoke-tested
- [x] Run `supabase/migrations/20261030000002_drop_legacy_category.sql` (drops legacy `products.category`)
- [ ] Manual browser pass: filters, size picker, mobile menu, search

## Phase 3: Accounts (code done 2026-10-30; migrations applied and verified)

Decisions: email confirmation required (real users, custom SMTP); password reset included; on sign-in guest items merge into the account with quantities added together, capped at 10 per line; on sign-out the bag on screen empties (items stay saved in the account); guests can still like products.

- [x] Run `supabase/migrations/20261030000003_accounts.sql` (tested on local Postgres with auth stubs: merge, cap, cascades, cross-user RLS, anon denied)
- [ ] Dashboard: Site URL + Redirect URLs, Confirm email on, custom SMTP, min password length 8, optional token_hash email templates
- [x] `@supabase/ssr` cookie sessions: `app/lib/supabase-browser.ts`, `app/lib/supabase-server.ts` (`getCurrentUser()` verifies the JWT), `proxy.ts` refreshes sessions
- [x] `/auth/confirm` route for confirmation and reset links (PKCE `code` and `token_hash`), with `safeNextPath` redirect guard
- [x] Sign-up sends confirmation with redirect; "email not confirmed" error offers resend; sign-in honors `?next=`
- [x] `/forgot-password` and `/reset-password` (also used for "Change Password" while signed in)
- [x] `/account`: email, editable name (server action), saved-pieces/bag shortcuts, change password, sign out
- [x] Navbar account icon links to `/account` when signed in (dot indicator), `/login` otherwise
- [x] `StoreContext` switches between localStorage (guest) and Supabase (signed in) behind the same `useStore()` API; merge on sign-in via `merge_guest_items`; optimistic writes with reload on failure; reload on tab focus
- [x] Run `supabase/migrations/20261030000004_account_details.sql` (birthday, preferred sizes, newsletter_subscribers + RPCs; tested locally)
- [x] Account page redesign: welcome header with client-since date; Profile (name, email, birthday) and My Sizes cards in view mode with Edit/Save/Cancel; Saved Pieces and Bag previews; Email Preferences switch; Security (change password, sign out)
- [x] Saved sizes pre-select on product pages and are highlighted in card size pickers
- [ ] Manual end-to-end test with a real email (see checklist in the Phase 3 handoff)

## Phase 4: Bag without payments (done 2026-10-30)

Decision: no orders yet; "Proceed to Checkout" links to the coming-soon page.

- [x] Run `supabase/migrations/20261030000005_promo_and_newsletter_signup.sql` (promo_codes + `validate_promo_code`, `subscribe_newsletter`; tested locally)
- [x] Promo codes checked by a server action via `validate_promo_code` (code list never exposed); inline success/error with Remove; `alert()` and the ARCHIVE10 hint removed
- [x] Bag prices come from the catalog: signed-in carts already did; guest carts are now repriced from `product_variants` / `products`, so editing localStorage can't change totals
- [x] Footer newsletter form saves via `subscribe_newsletter` (same table as the account switch; links to the account when a signed-in user subscribes their own email; same message whether or not already subscribed)
- [x] "Proceed to Checkout" links to `/coming-soon?feature=checkout`
- Later: orders + payments (server-side totals at order time), double opt-in for the newsletter, rate limiting on promo checks

## Next: go-live readiness (code done 2026-10-30)

- [x] `/api/revalidate` route (shared secret, constant-time check) clearing catalog cache tags; webhook SQL template in `supabase/templates/`
- [x] `sitemap.xml` (home, categories, collections, products), `robots.txt` (disallows account/auth/bag/search/etc.)
- [x] `metadataBase` from `NEXT_PUBLIC_SITE_URL`, Open Graph/Twitter defaults, generated default social image, canonical URLs, brand in product JSON-LD
- [x] Brand name centralized in `app/lib/site.ts`; `.env.example`; `docs/DEPLOY.md`
- [ ] Deploy to Vercel, set env vars, point Supabase auth URLs/templates at the domain, run the webhook template
- [ ] Choose the real brand name (one line in `app/lib/site.ts`)
- Later: load Playfair Display into the social image (it currently renders in a fallback sans-serif)

## Demo checkout (done 2026-10-30)

Decisions: portfolio site, so no real payment provider; guests and signed-in users can check out; orders are saved; same pricing rules as the bag.

- [x] Run `supabase/migrations/20261030000006_orders.sql` (orders, order_items, `place_order`, `get_order`; tested locally)
- [x] `/checkout`: contact, shipping, demo payment with "Fill Demo Details"; client-side Luhn/expiry/CVC checks; only brand + last 4 sent
- [x] Server-priced `place_order` (catalog prices, promo re-check, courier/gift rules, line snapshots, signed-in bag lines cleared)
- [x] `/orders/[id]` confirmation (owner, or guest with token), demo labelling
- [x] Account Order History card (last 5)
- [x] Shared pricing helper `app/lib/pricing.ts`; bag gift/promo choices carried to checkout via sessionStorage

## Demo account, navigation cleanup (done 2026-10-30)

- [x] Shared demo login (`NEXT_PUBLIC_DEMO_EMAIL` / `_PASSWORD`), password changes blocked for it in the UI
- [x] Footer, Navbar and homepage links point only to real pages; categories come from the database
- [x] Deleted the unlinked `/coming-soon` page

## Redesign: warm editorial (done 2026-10-30)

- [x] Warm palette + type scale tokens, `MotionProvider` (reduced motion), shared UI (`Button`, `SectionHeading`, `Section`, `EditorialSplit`)
- [x] Navbar, product card, homepage (single hero, trust bar, category tiles, best sellers, editorial splits), product page (`ProductGallery`)
- [x] Type-size sweep across all pages; sign-in page rebuilt as an open split layout (fixed clipping bug)
- [ ] Round 2: bag, checkout, account, order confirmation, forgot/reset password in the open style
- [ ] Load Playfair Display into the generated social image

## Photography and catalog (done 2026-10-30)

- [x] `supabase/migrations/20261030000007_catalog_photography.sql`: Pexels photography for all products and category banners, copy rewritten to match, 7 new products (5 under $200)
- [x] Vaelore rebrand: logos in Navbar/Footer, Pearl White / Abyss Ink / deep-gold tokens, hero copy, `supabase/migrations/20261030000008_vaelore_catalog.sql` (15 pieces in Lumière, Tide, Heirloom; `PRIVATE5` replaces `ARCHIVE10`); `20261030000009_vaelore_shipping.sql` (courier $75, free from $5,000, gift wrap complimentary; mirrored in `app/lib/pricing.ts`)
- [x] Polish pass: 404 page, page titles, README, OG logo, skip link + focus ring, type tokens, hairline layout on bag/checkout/orders/account/password pages, template leftovers removed; `20261030000011_collection_banner.sql`
- [x] Brand copy pass: TrustBar, footer, nav, bag, checkout, account, auth, errors in Vaelore voice; new `/the-house` page; `20261030000010_vaelore_copy.sql`
- [x] Editorial images swapped; `images.pexels.com` allowed in `next.config.ts`

## Next

- [ ] Deploy (see `docs/DEPLOY.md`), set Vercel env vars incl. demo login, run webhook template
- [ ] Recruiter-facing README (live link, demo login, screenshots, key technical decisions, Pexels credit)
- [ ] Playwright e2e tests + saved DB security test script + GitHub Actions CI
- [ ] Choose the real brand name (`app/lib/site.ts`)

## Open questions

- Run migrations via Supabase dashboard SQL editor, or install the Supabase CLI?
- Checkout: save pending orders, or stop at the bag?
- ~~Real brand name to replace "BrandLogo"?~~ Maison Vaelore (logos in `public/logo/`)
