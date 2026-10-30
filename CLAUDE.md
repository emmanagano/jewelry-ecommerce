# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

This project runs Next.js 16 (App Router) with React 19. Its APIs differ from older Next.js versions, so check `node_modules/next/dist/docs/` (`01-app/`, `03-architecture/`) before using any framework API you aren't sure about.

It's a portfolio storefront that recruiters browse and test: checkout is a demo (no real payments) and there's a shared demo login. Build features so a visitor can try the whole flow without real accounts or money, but keep the engineering real (server-side pricing, RLS).

## Commands

- `npm run dev`: dev server at http://localhost:3000 (Turbopack)
- `npm run build`: production build, the main correctness check (there is no test suite or test runner yet)
- `npm run lint`: ESLint 9 flat config (`eslint.config.mjs`, `eslint-config-next`)
- `npx tsc --noEmit`: type check
- Catalog pages are cached for an hour. After editing catalog data locally, clear the cache (or restart the dev server):
  ```bash
  curl -X POST http://localhost:3000/api/revalidate -H "Content-Type: application/json" \
    -H "x-revalidate-secret: $(grep ^REVALIDATE_SECRET= .env.local | cut -d= -f2)" \
    -d '{"table":"products"}'   # or categories / collections
  ```

## Environment

Variables are listed in `.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (absolute URLs for sitemap/robots/social previews; falls back to the Vercel production domain, then localhost), `REVALIDATE_SECRET` (guards `/api/revalidate`), and `NEXT_PUBLIC_DEMO_EMAIL` / `NEXT_PUBLIC_DEMO_PASSWORD` (shared demo login; public by design). Deployment steps are in `docs/DEPLOY.md`.

Brand name, tagline and description live in `app/lib/site.ts` (`SITE_NAME` etc.); use them instead of hard-coding the brand. The brand is Maison Vaelore (brand book in `docs/`, logo SVGs in `public/logo/`; `app/icon.svg` is the favicon). Voice: "client", "piece", "discover/acquire", "saved pieces" (not wishlist), natural traceable diamonds (no lab-grown), no sale or exclamation language; a static `/the-house` page carries the founding story. The core promises are Certificate of Provenance, lifetime care, numbered editions and complimentary engraving and gift wrap; don't promise buy-back or valuation. The localStorage keys (`brandlogo_*`) intentionally don't follow the brand, so renaming it doesn't empty guests' bags.

## Database (Supabase)

Schema lives in `supabase/migrations/`, numbered `20261030000001`…`0011`. The user applies each one by pasting it into the Supabase SQL Editor, so every migration must be one transaction (`begin`/`commit`) and safe to re-run (`if not exists`, `on conflict do nothing`, `drop policy if exists`). In order: catalog structure (0001), drop legacy `products.category` + duplicate policy (0002), accounts (0003), profile details + newsletter (0004), promo codes + footer signup (0005), orders (0006), Pexels photography + 7 new products (0007), Vaelore catalog: the 15 products renamed in place (plus one new Lumière piece) into the `lumiere` / `tide` / `heirloom` collections, `ARCHIVE10` retired for `PRIVATE5` (0008), Vaelore shipping: insured courier $75, free from $5,000, gift presentation complimentary (0009, changes `place_order`), collection copy (0010), New & Featured banner moved off Unsplash (0011).

- **Catalog** (public read-only): `categories`, `products` (`category_id`, `metal`, `stone`, `materials_care`, generated `search` tsvector, `images[]` of full URLs), `product_variants` (sizes, optional `stock` / `price_override`), `collections` + `product_collections` (ordered, e.g. `best-sellers`, `new-and-featured`, `gifts`).
- **Accounts** (owner-only RLS): `profiles` (`full_name`, `birthday`, `preferred_sizes` jsonb keyed by category slug; created by an `auth.users` trigger), `cart_items` (variant + quantity, never a price), `wishlist_items`.
- **No direct access, functions only** (RLS on, no policies): `newsletter_subscribers` (keyed by email; `get/set_newsletter_subscription`, `subscribe_newsletter`), `promo_codes` (`validate_promo_code`), and order writes (`place_order`). `orders` / `order_items` are readable by their owner via RLS, or with `get_order(id, token)`.
- RPCs raise shopper-facing errors with `errcode = 'P0001'`; server actions pass those messages through and replace anything else with a generic message.
- **Testing migrations:** run them against a throwaway local Postgres (`initdb` in the scratchpad, listen on TCP since the socket path is too long) with stand-ins for `anon`/`authenticated` roles, `auth.users`, `auth.uid()` (from `request.jwt.claim.sub`) and `auth.jwt()`, plus Supabase-style default privileges. Then test as each role with `set role` / `set request.jwt.claim.sub`. Apply every migration twice to prove it re-runs. Don't write to the live database to test; verify it with read-only anon REST calls.

## Architecture

**Catalog reads** go through the cached, tagged fetchers in `app/lib/data/products.ts` (`"use cache"` + `cacheLife` + `cacheTag`). Add new server queries there.
- Fetchers **throw** on query failure (thrown results aren't cached). Callers that can degrade catch it themselves: the layout's nav categories, `BestSellers`, `CategoryTiles`, and the login showcase all fall back. Main pages let it reach `app/error.tsx` (Next 16 props: `error`, `retry`).
- Types and column lists (`PRODUCT_SUMMARY_COLUMNS`, `PRODUCT_DETAIL_COLUMNS`) live in `app/lib/products.ts`. Embedded joins use aliases (`category:categories!inner(...)`, `variants:product_variants(...)`). Select explicit columns, not `*`.
- Tags are cleared by `app/api/revalidate/route.ts` (called by Supabase Database Webhooks in production; `supabase/templates/revalidate_webhooks.sql`). A new cached fetcher needs an existing tag (`products`, `categories`, `collections`), or add its table to `TABLE_TAGS` there.
- With `cacheComponents: true`, dynamic routes follow one pattern: `generateStaticParams` → a sync default export that wraps an async `*Content` component in `<Suspense fallback={...}>` → `*Content` awaits `params` and calls a fetcher. Anything reading cookies, the session or the current time must render inside `<Suspense>`; call `await connection()` first when the work compares against the current time (e.g. session checks in `/account`, `/orders/[id]`).
- Category and collection pages render `components/ProductListing.tsx`. Filtering and sorting happen client-side in `FilterableProductGrid` over the prerendered list, with state in URL search params (`app/lib/listing.ts`).
- Navbar, footer and category tiles read categories from the database.
- Sizes come from `product_variants` (`getSizes` / `sortVariants`); `"Standard"` (`ONE_SIZE`) is the one-size value. A signed-in user's `preferred_sizes` (from `useAuth()`) pre-selects the size on product pages and is highlighted in card size pickers.
- **Prices are integer cents.** Display them with `formatPrice` (`app/lib/format.ts`).

**Three Supabase clients; pick the right one.**
- `app/lib/supabase.ts`: anonymous, no session. Catalog reads only (cached fetchers must never depend on who is signed in; also used in the browser for public catalog reads such as guest repricing and wishlist products).
- `app/lib/supabase-browser.ts`: session-aware, for Client Components (auth, account cart/wishlist, profile).
- `app/lib/supabase-server.ts`: session-aware, per request, for Server Components/Actions/Route Handlers. `getCurrentUser()` verifies the JWT; use it for any server-side authorization, and re-check it inside every server action.
- `proxy.ts` refreshes the session cookie on every request; it does not gate routes. Protected pages check the user and `redirect()` themselves.
- Auth email links land on `app/auth/confirm/route.ts` (handles both `code` and `token_hash`). Validate any `next` redirect with `safeNextPath`.

**Cart and wishlist** (`context/StoreContext.tsx`), same `useStore()` API in both modes:
- Signed out: localStorage (`brandlogo_cart` / `brandlogo_wishlist`) via `useSyncExternalStore`; writes go through `saveToStorage`. Guest lines are repriced from the catalog for display, so a tampered stored price never shows.
- Signed in (`useAuth()` from `context/AuthContext.tsx`): Supabase `cart_items` / `wishlist_items`. Cart writes use the `add_to_cart` / `set_cart_quantity` RPCs (resolve product id + size → variant). On sign-in, `merge_guest_items` moves localStorage items into the account (localStorage is cleared first and restored on failure). Writes are optimistic and reload from the database on error; data reloads on tab focus.
- A cart line's identity is product `id` + `size`. Quantity is capped at `MAX_QUANTITY` (10), matching the DB check constraint. `clearCart()` runs after an order.
- Check `isHydrated` before rendering cart/wishlist contents; it stays false until auth is known and, when signed in, the account items have loaded. `useWishlistProducts()` (`app/lib/use-wishlist-products.ts`) loads liked products for the wishlist page and account preview.

**Checkout and orders (demo, no real payments).** `/checkout` has "Fill Demo Details" and a Luhn-checked demo card form (`app/lib/demo-card.ts`). Card numbers never leave the browser; only brand + last 4 are sent. `placeOrder` (`app/lib/checkout-actions.ts`) calls `place_order`, which prices everything from the catalog, re-validates the promo code and stores an `orders` + `order_items` snapshot. Pricing rules live in `app/lib/pricing.ts` and are duplicated in `place_order`; change both together. Guests get a confirmation link `/orders/[id]?token=`. Gift/promo choices travel from the bag to checkout in sessionStorage (`app/lib/checkout-options.ts`). Promo codes are checked by `applyPromoCode` and the footer signup by `subscribeToNewsletter` (`app/lib/store-actions.ts`).

**Account** (`/account`): server-rendered cards with view/edit modes (`useEditableCard` in `app/account/AccountClient.tsx`); each save is a server action in `app/account/actions.ts` that returns the saved values.

**Demo account.** `app/lib/demo-account.ts` powers "Use the demo account" on the sign-in form. The account is shared, so password changes are hidden and refused for it (`isDemoAccount`); keep that guard on any new account-security UI. Its data (orders, likes, sizes) is allowed to accumulate.

## Styling

- Tailwind v4 is loaded through a Turbopack CSS loader rule in `next.config.ts`. There is no `tailwind.config` file. Tokens live in `app/globals.css`.
- **Warm editorial palette.** CSS variables on `:root`: `--bg-base` (Pearl White), `--surface` (paper, for raised cards), `--card-*` fills, `--text-headline` / `--text-body` / `--text-muted`, `--border-color` (hairline), `--accent` (deep gold `#846432`, the text-safe gold), `--gold` (`#b8955a`, 2.5:1 on light so rules/fills/dark bands only), `--lagoon`, plus `--accent-love` (an alias of `--accent`), `--success`, `--error-*`. Use the variable shorthand (`bg-(--bg-base)`, `text-(--text-muted)`), not hex values. `--accent-blue` is a legacy name for the deep-gold accent; prefer `--accent`. All text colors pass WCAG AA on `--bg-base` and `--surface`. A warm dark palette sits commented out in `globals.css`.
- **Type scale.** Use the `@theme` tokens instead of pixel sizes: `eyebrow` (utility: 11px uppercase label), `text-label` (12px; buttons, nav, meta), `text-copy-sm` / `text-copy` (14/15px body), `text-heading` / `text-title` / `text-display` (28/40/56px Playfair). Don't name new tokens `--text-body` / `--text-muted` / `--text-headline`; those are colors, and `@theme` tokens are emitted as CSS variables too. The only pixel sizes left are the 10px count badges in the Navbar.
- Buttons don't inherit `text-transform` (Tailwind preflight), so put `uppercase` on the button itself.
- **Layout style:** open layouts with hairlines and whitespace rather than nested bordered cards (see the sign-in page and product page). Every page now follows it, including the bag, checkout, order, account and forgot/reset pages (hairline `border-t` sections, no boxed cards).
- **Shared UI:** `components/ui/Button.tsx` (`primary`, `secondary`, `inverse`, `inverse-outline`, `link`; renders a `Link` with `href`), `SectionHeading`, `Section`; `components/EditorialSplit.tsx` (image + copy, `reverse` to alternate); `components/ProductGallery.tsx`; `components/AuthPanel.tsx` (centered card + input/button class strings for the password pages).
- **Motion:** Framer Motion. `components/MotionProvider.tsx` sets `MotionConfig reducedMotion="user"`. Import `luxurySpring`, `staggerContainer()`, `fadeSlide()` from `app/lib/motion.ts`. Keep entrance animations; don't add `whileHover` / `whileTap` springs (use CSS color/opacity transitions). `app/template.tsx` fades pages keyed on pathname only (filters don't remount), and its `usePathname()` must stay inside `<Suspense>` or routes with unknown params (e.g. `/orders/[id]`) fail to build.
- Fonts: Playfair Display (`font-serif`, aliased `font-primary`) and Inter (`font-sans`, aliased `font-secondary` / `font-body`), loaded with `next/font` in `layout.tsx`.
- **Images:** use `next/image` (usually `fill` + `sizes` inside a `relative` parent). Allowed hosts are in `images.remotePatterns` (`next.config.ts`). Product photos and category banners are full Pexels URLs stored in the database (free license, no attribution required); the hero is a Pexels photo and the editorial images are in `BrandStory` / `EngravingFeature`. Keep new photography warm and neutral (gold on cream/linen, soft light).

## Repo notes

- Pages must not render their own `<main>`; the root layout already provides it.
- Import alias: `@/*` maps to the repo root (e.g. `@/components/...`, `@/app/lib/supabase`).
- `docs/PLAN.md` tracks the roadmap; tick items off as they land. `docs/DEPLOY.md` covers Vercel, Supabase auth/email, webhooks and the demo account.
