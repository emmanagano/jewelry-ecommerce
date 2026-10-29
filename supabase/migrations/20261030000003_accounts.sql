-- Phase 3: accounts
--
-- Adds profiles, a saved wishlist and a saved cart for signed-in users, plus
-- the functions the app calls to change the cart and to merge a guest's
-- localStorage cart/wishlist into the account on sign-in.
--
-- Every table is owner-only: a signed-in user can read and write only their
-- own rows; signed-out visitors can't read any of it.
--
-- Run once in the Supabase dashboard SQL Editor. Runs as one transaction and
-- is safe to re-run.

begin;

-- ---------------------------------------------------------------------------
-- Profiles: one row per user, created automatically at sign-up
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
	id uuid primary key references auth.users (id) on delete cascade,
	full_name text check (char_length(full_name) <= 120),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles
	for select to authenticated using (id = (select auth.uid()));

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
	for update to authenticated
	using (id = (select auth.uid()))
	with check (id = (select auth.uid()));

-- Copies the name the sign-up form sends (options.data.full_name).
-- security definer so it can write profiles while running as the auth system.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
	insert into public.profiles (id, full_name)
	values (new.id, left(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 120))
	on conflict (id) do nothing;
	return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
	after insert on auth.users
	for each row execute function public.handle_new_user();

-- Profiles for anyone who signed up before this migration
insert into public.profiles (id, full_name)
select id, left(nullif(trim(raw_user_meta_data ->> 'full_name'), ''), 120)
from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Wishlist
-- ---------------------------------------------------------------------------

create table if not exists public.wishlist_items (
	user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
	product_id uuid not null references public.products (id) on delete cascade,
	created_at timestamptz not null default now(),
	primary key (user_id, product_id)
);

alter table public.wishlist_items enable row level security;

drop policy if exists "Users can read their own wishlist" on public.wishlist_items;
create policy "Users can read their own wishlist" on public.wishlist_items
	for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Users can add to their own wishlist" on public.wishlist_items;
create policy "Users can add to their own wishlist" on public.wishlist_items
	for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "Users can remove from their own wishlist" on public.wishlist_items;
create policy "Users can remove from their own wishlist" on public.wishlist_items
	for delete to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Cart: stores the variant and quantity only. Prices always come from the
-- catalog, never from the client.
-- ---------------------------------------------------------------------------

create table if not exists public.cart_items (
	user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
	variant_id uuid not null references public.product_variants (id) on delete cascade,
	quantity int not null check (quantity between 1 and 10),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	primary key (user_id, variant_id)
);

alter table public.cart_items enable row level security;

drop policy if exists "Users can read their own cart" on public.cart_items;
create policy "Users can read their own cart" on public.cart_items
	for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Users can add to their own cart" on public.cart_items;
create policy "Users can add to their own cart" on public.cart_items
	for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "Users can update their own cart" on public.cart_items;
create policy "Users can update their own cart" on public.cart_items
	for update to authenticated
	using (user_id = (select auth.uid()))
	with check (user_id = (select auth.uid()));

drop policy if exists "Users can remove from their own cart" on public.cart_items;
create policy "Users can remove from their own cart" on public.cart_items
	for delete to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Cart functions. The app identifies a cart line by product id + size (as the
-- guest cart does); these resolve the variant. They run as the calling user
-- (security invoker), so the policies above still apply.
-- ---------------------------------------------------------------------------

-- Adds to a line, capping the line at 10
create or replace function public.add_to_cart(p_product_id uuid, p_size text, p_quantity int default 1)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
	v_variant uuid;
begin
	if auth.uid() is null then
		raise exception 'Not signed in';
	end if;

	select id into v_variant
	from public.product_variants
	where product_id = p_product_id and size = p_size;

	if v_variant is null then
		raise exception 'No variant for product % in size %', p_product_id, p_size;
	end if;

	insert into public.cart_items (user_id, variant_id, quantity)
	values (auth.uid(), v_variant, least(greatest(p_quantity, 1), 10))
	on conflict (user_id, variant_id) do update
		set quantity = least(public.cart_items.quantity + excluded.quantity, 10),
			updated_at = now();
end;
$$;

-- Sets a line's quantity (capped at 10); 0 or less removes it
create or replace function public.set_cart_quantity(p_product_id uuid, p_size text, p_quantity int)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
	v_variant uuid;
begin
	if auth.uid() is null then
		raise exception 'Not signed in';
	end if;

	select id into v_variant
	from public.product_variants
	where product_id = p_product_id and size = p_size;

	if v_variant is null then
		return; -- the variant was removed from the catalog; nothing to change
	end if;

	if p_quantity <= 0 then
		delete from public.cart_items
		where user_id = auth.uid() and variant_id = v_variant;
	else
		insert into public.cart_items (user_id, variant_id, quantity)
		values (auth.uid(), v_variant, least(p_quantity, 10))
		on conflict (user_id, variant_id) do update
			set quantity = excluded.quantity,
				updated_at = now();
	end if;
end;
$$;

-- Merges a guest's localStorage cart and wishlist into the signed-in account
-- in one transaction. Quantities for the same item are added together (capped
-- at 10). Items whose product or size no longer exists are skipped. Ids are
-- compared as text so a malformed local value is skipped instead of failing
-- the whole merge.
--   p_cart:     [{ "id": "<product uuid>", "size": "7", "quantity": 1 }, ...]
--   p_wishlist: ['<product uuid>', ...]
create or replace function public.merge_guest_items(p_cart jsonb default '[]', p_wishlist text[] default '{}')
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
	if auth.uid() is null then
		raise exception 'Not signed in';
	end if;

	insert into public.cart_items (user_id, variant_id, quantity)
	select auth.uid(), v.id, least(sum(greatest(coalesce(c.quantity, 1), 1)), 10)
	from jsonb_to_recordset(coalesce(p_cart, '[]'::jsonb)) as c (id text, size text, quantity int)
	join public.product_variants v on v.product_id::text = c.id and v.size = c.size
	group by v.id
	on conflict (user_id, variant_id) do update
		set quantity = least(public.cart_items.quantity + excluded.quantity, 10),
			updated_at = now();

	insert into public.wishlist_items (user_id, product_id)
	select distinct auth.uid(), p.id
	from unnest(coalesce(p_wishlist, '{}')) as w (product_id)
	join public.products p on p.id::text = w.product_id
	on conflict (user_id, product_id) do nothing;
end;
$$;

-- Only signed-in users may call the cart functions
revoke execute on function public.add_to_cart(uuid, text, int) from public, anon;
revoke execute on function public.set_cart_quantity(uuid, text, int) from public, anon;
revoke execute on function public.merge_guest_items(jsonb, text[]) from public, anon;
grant execute on function public.add_to_cart(uuid, text, int) to authenticated;
grant execute on function public.set_cart_quantity(uuid, text, int) to authenticated;
grant execute on function public.merge_guest_items(jsonb, text[]) to authenticated;

-- The trigger function is internal; nobody should call it directly
revoke execute on function public.handle_new_user() from public, anon, authenticated;

commit;
