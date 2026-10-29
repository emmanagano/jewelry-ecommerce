# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

This project runs Next.js 16 (App Router) with React 19. Its APIs differ from older Next.js versions, so check `node_modules/next/dist/docs/` (`01-app/`, `03-architecture/`) before using any framework API you aren't sure about.

## Commands

- `npm run dev`: dev server at http://localhost:3000 (Turbopack)
- `npm run build`: production build. This is the main type and correctness check, because there is no test suite.
- `npm run lint`: ESLint 9 flat config (`eslint.config.mjs`, `eslint-config-next`)

There are no tests and no test runner.

## Environment

`.env.local` must define `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. The app has a single Supabase client in `app/lib/supabase.ts`, which uses the anon key and is shared by server and client code.

## Architecture

**Data: Supabase catalog tables.** `categories`, `products` (with `category_id`, `metal`, `stone`, `materials_care`, generated `search` tsvector), `product_variants` (sizes, optional `stock` / `price_override`), `collections` + `product_collections` (curated, ordered groups such as `best-sellers`). Schema lives in `supabase/migrations/`; the user runs migrations by pasting them into the Supabase SQL Editor. RLS makes the catalog public read-only.
- Types and the column lists (`PRODUCT_SUMMARY_COLUMNS`, `PRODUCT_DETAIL_COLUMNS`) live in `app/lib/products.ts`. Embedded joins use aliases (`category:categories!inner(...)`, `variants:product_variants(...)`); select explicit columns, never `*`, because the legacy text column `products.category` would collide with the `category` alias.
- Server reads go through the cached, tagged fetchers in `app/lib/data/products.ts` (`"use cache"` + `cacheLife` + `cacheTag`). Add new server queries there. With `cacheComponents: true`, dynamic routes follow one pattern: `generateStaticParams` → a sync default export that wraps an async `*Content` component in `<Suspense fallback={...}>` → `*Content` awaits `params` and calls a fetcher.
- Only `my-wishlist` queries Supabase from the browser (its IDs live in localStorage).
- Category and collection pages render `components/ProductListing.tsx`. Filtering and sorting happen client-side in `FilterableProductGrid` over the prerendered list, with state in URL search params (`app/lib/listing.ts`).
- Sizes come from `product_variants` (`getSizes` / `sortVariants`); `"Standard"` (`ONE_SIZE`) is the one-size value.
- **Prices are integer cents.** Display them with `formatPrice` from `app/lib/format.ts`.

**Three Supabase clients; pick the right one.**
- `app/lib/supabase.ts`: anonymous, no session. Only for catalog reads (the cached fetchers must never depend on who is signed in).
- `app/lib/supabase-browser.ts`: session-aware, for Client Components.
- `app/lib/supabase-server.ts`: session-aware, per request, for Server Components/Actions/Route Handlers. `getCurrentUser()` verifies the JWT; use it for any server-side authorization. Reading cookies makes a component dynamic, so it must sit inside `<Suspense>`; never read the session at the top level of a layout.
- `proxy.ts` refreshes the session cookie on every request; it does not gate routes. Protected pages (e.g. `/account`) check `getCurrentUser()` and `redirect()` themselves.
- Auth email links land on `app/auth/confirm/route.ts`. Validate any `next` redirect with `safeNextPath`.

**Cart and wishlist** (`context/StoreContext.tsx`), same `useStore()` API in both modes:
- Signed out: localStorage keys `brandlogo_cart` / `brandlogo_wishlist`, read through `useSyncExternalStore`; writes go through `saveToStorage`.
- Signed in (`useAuth()` from `context/AuthContext.tsx`): Supabase `cart_items` (variant + quantity, no price) and `wishlist_items`, owner-only RLS. Cart writes go through the `add_to_cart` / `set_cart_quantity` RPCs, which resolve product id + size to a variant. On sign-in, `merge_guest_items` moves localStorage items into the account and localStorage is cleared. Writes are optimistic and reload from the database on failure.
- A cart line's identity is product `id` + `size`. Quantity is capped at `MAX_QUANTITY` (10), matching the DB check constraint. Prices shown for signed-in carts come from the catalog.
- Check `isHydrated` before rendering cart/wishlist contents; it stays false until auth is known and, when signed in, the account items have loaded.

**Animation:** Framer Motion. `app/template.tsx` runs a light fade on route changes, keyed on pathname only so search-param changes (filters) don't remount the page. Import `luxurySpring`, `staggerContainer()` and `fadeSlide()` from `app/lib/motion.ts` rather than defining animation configs per component.

## Styling

- Tailwind v4 is loaded through a Turbopack CSS loader rule in `next.config.ts`. There is no `tailwind.config` file. Theme tokens live in `@theme` in `app/globals.css`.
- Colors come from CSS variables on `:root` (`--bg-base`, `--card-*`, `--accent-*`, `--text-*`, `--border-color`, plus status colors `--accent-love`, `--success`, `--error-*`). Reference them with Tailwind v4's variable shorthand, e.g. `bg-(--bg-base)` and `text-(--text-muted)`, not hex values. An alternate dark palette sits commented out in `globals.css`.
- Fonts: Playfair Display (`font-serif`, aliased `font-primary`) and Inter (`font-sans`, aliased `font-secondary` / `font-body`), loaded with `next/font` in `layout.tsx`.
- Use `next/image` (usually `fill` + `sizes` inside a `relative` parent). Allowed hosts are listed in `images.remotePatterns` in `next.config.ts`.

## Repo notes

- Pages must not render their own `<main>`; the root layout already provides it.
- Import alias: `@/*` maps to the repo root (e.g. `@/components/...`, `@/app/lib/supabase`).
- `docs/PLAN.md` tracks the improvement roadmap; tick items off as they land.
- "BrandLogo" is a placeholder brand name.
