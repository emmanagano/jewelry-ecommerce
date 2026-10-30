# Maison Vaelore

A portfolio storefront for a fictional high-jewelry house, built to be browsed and tested. Checkout is a demo (no real payments, nothing ships), and there's a shared demo login on the sign-in page.

**Stack:** Next.js 16 (App Router, `cacheComponents`), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Supabase (Postgres, Auth, RLS).

## What to try

- Browse the Lumière, Tide and Heirloom collections; filter and sort by metal, stone and price.
- Save pieces and fill a bag as a guest, then sign in with "Use the demo account": the guest bag merges into the account.
- Check out with "Fill Demo Details", then open the order confirmation.

## Engineering notes

- **Server-side pricing.** The browser sends product ids, sizes and quantities, never prices. `place_order` (a Postgres function) prices the order from the catalog, re-validates the promo code and stores a snapshot. Rules are mirrored in `app/lib/pricing.ts`.
- **Row Level Security.** The catalog is public read-only; carts, wishlists and profiles are owner-only; orders, promo codes and newsletter data are reachable only through functions.
- **Cached catalog.** Reads go through tagged `"use cache"` fetchers (`app/lib/data/products.ts`) that Supabase webhooks revalidate through `/api/revalidate`.
- **Cart that follows the user.** `context/StoreContext.tsx` has one API for guest (localStorage) and signed-in (Supabase) carts, with optimistic writes and a merge on sign-in.
- **Card numbers never leave the browser.** The demo card form is Luhn-checked; only brand and last 4 are sent.

## Run it locally

```bash
cp .env.example .env.local   # add your Supabase URL, anon key and a REVALIDATE_SECRET
npm install
npm run dev                  # http://localhost:3000
```

Apply the SQL files in `supabase/migrations/` in order in the Supabase SQL Editor. Checks: `npm run build`, `npm run lint`, `npx tsc --noEmit`. Deployment, auth emails and webhooks are covered in [`docs/DEPLOY.md`](docs/DEPLOY.md); the brand book is in `docs/`.

## Notes

Product photography is from [Pexels](https://www.pexels.com/license/). Maison Vaelore is a fictional brand and the pieces are not for sale.
