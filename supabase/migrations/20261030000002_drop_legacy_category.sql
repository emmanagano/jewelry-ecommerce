-- Cleanup after migration 0001:
-- 1. Drops the legacy free-text `products.category` column. The app reads the
--    category through `category_id` -> `categories` since 0001.
--    To undo, re-add the column and backfill it from categories.name.
-- 2. Drops the original "Allow public read access" policy on products, which
--    duplicates 0001's "Catalog is publicly readable" (both SELECT-only).
--
-- Run in the Supabase SQL Editor after confirming the site works on 0001.

begin;

alter table public.products drop column if exists category;

drop policy if exists "Allow public read access" on public.products;

commit;
