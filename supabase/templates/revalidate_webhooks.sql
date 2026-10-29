-- Template: Database Webhooks that refresh the site's catalog cache.
--
-- NOT a migration. Before running it in the SQL Editor:
--   1. Database -> Webhooks: click "Enable webhooks" once (creates the
--      supabase_functions schema these triggers use).
--   2. Replace both placeholders below:
--        <SITE_URL>           your deployed origin, e.g. https://example.com
--        <REVALIDATE_SECRET>  the same value as the REVALIDATE_SECRET env var
--   3. Don't commit the filled-in copy; it contains the secret.
--
-- Each trigger POSTs the changed row to /api/revalidate, which clears the
-- matching cache tags. Safe to re-run (drops and recreates the triggers).
-- To remove them, run only the `drop trigger` lines.

begin;

drop trigger if exists revalidate_site on public.products;
create trigger revalidate_site
	after insert or update or delete on public.products
	for each row execute function supabase_functions.http_request(
		'<SITE_URL>/api/revalidate', 'POST',
		'{"Content-Type":"application/json","x-revalidate-secret":"<REVALIDATE_SECRET>"}',
		'{}', '5000');

drop trigger if exists revalidate_site on public.product_variants;
create trigger revalidate_site
	after insert or update or delete on public.product_variants
	for each row execute function supabase_functions.http_request(
		'<SITE_URL>/api/revalidate', 'POST',
		'{"Content-Type":"application/json","x-revalidate-secret":"<REVALIDATE_SECRET>"}',
		'{}', '5000');

drop trigger if exists revalidate_site on public.categories;
create trigger revalidate_site
	after insert or update or delete on public.categories
	for each row execute function supabase_functions.http_request(
		'<SITE_URL>/api/revalidate', 'POST',
		'{"Content-Type":"application/json","x-revalidate-secret":"<REVALIDATE_SECRET>"}',
		'{}', '5000');

drop trigger if exists revalidate_site on public.collections;
create trigger revalidate_site
	after insert or update or delete on public.collections
	for each row execute function supabase_functions.http_request(
		'<SITE_URL>/api/revalidate', 'POST',
		'{"Content-Type":"application/json","x-revalidate-secret":"<REVALIDATE_SECRET>"}',
		'{}', '5000');

drop trigger if exists revalidate_site on public.product_collections;
create trigger revalidate_site
	after insert or update or delete on public.product_collections
	for each row execute function supabase_functions.http_request(
		'<SITE_URL>/api/revalidate', 'POST',
		'{"Content-Type":"application/json","x-revalidate-secret":"<REVALIDATE_SECRET>"}',
		'{}', '5000');

commit;
