-- Vaelore shipping rules
--
-- Heirloom prices make the old demo fees meaningless, so place_order() now
-- charges (keep in sync with app/lib/pricing.ts):
--   insured courier    $75.00, free when the subtotal is $5,000.00 or more
--   gift presentation  complimentary
--   promo codes        unchanged
-- Everything else in place_order() is identical to migration 0006.
--
-- Run once in the Supabase dashboard SQL Editor. One transaction; safe to
-- re-run.

begin;


-- p_items:    [{ "id": "<product uuid>", "size": "7", "quantity": 1 }, ...]
-- p_contact:  { "email", "full_name", "phone"? }
-- p_shipping: { "line1", "line2"?, "city", "region"?, "postal_code", "country" }
-- p_payment:  { "brand", "last4" }   (demo only; never the full number)
-- Errors meant for the shopper are raised with errcode P0001.
create or replace function public.place_order(
	p_items jsonb,
	p_contact jsonb,
	p_shipping jsonb,
	p_payment jsonb,
	p_gift_packaging boolean default false,
	p_gift_note text default null,
	p_promo_code text default null
)
returns table (order_id uuid, order_number text, access_token uuid)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
declare
	c_courier_cents constant int := 7500;
	c_free_courier_threshold_cents constant int := 500000;
	c_gift_packaging_cents constant int := 0;

	v_email text := lower(trim(p_contact ->> 'email'));
	v_name text := trim(p_contact ->> 'full_name');
	v_phone text := nullif(trim(p_contact ->> 'phone'), '');
	v_brand text := p_payment ->> 'brand';
	v_last4 text := p_payment ->> 'last4';
	v_promo text := nullif(upper(trim(p_promo_code)), '');
	v_note text := nullif(trim(p_gift_note), '');
	v_shipping jsonb;
	v_requested int;
	v_matched int;
	v_percent int := 0;
	v_subtotal int;
	v_discount int := 0;
	v_gift int;
	v_courier int;
	v_order_id uuid;
	v_order_number text;
	v_token uuid;
begin
	-- Contact and payment summary
	if v_email is null or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or char_length(v_email) > 320 then
		raise exception 'Please enter a valid email address.' using errcode = 'P0001';
	end if;
	if coalesce(v_name, '') = '' or char_length(v_name) > 120 then
		raise exception 'Please enter your full name.' using errcode = 'P0001';
	end if;
	if v_phone is not null and char_length(v_phone) > 40 then
		raise exception 'Please enter a shorter phone number.' using errcode = 'P0001';
	end if;
	if v_brand is null or v_brand not in ('Visa', 'Mastercard', 'American Express', 'Discover', 'Card')
		or coalesce(v_last4, '') !~ '^[0-9]{4}$' then
		raise exception 'Please check your card details.' using errcode = 'P0001';
	end if;
	if v_note is not null and char_length(v_note) > 300 then
		raise exception 'Gift notes can be up to 300 characters.' using errcode = 'P0001';
	end if;

	-- Shipping address: keep only known fields, require the essentials
	v_shipping := jsonb_strip_nulls(jsonb_build_object(
		'line1', nullif(left(trim(p_shipping ->> 'line1'), 120), ''),
		'line2', nullif(left(trim(p_shipping ->> 'line2'), 120), ''),
		'city', nullif(left(trim(p_shipping ->> 'city'), 80), ''),
		'region', nullif(left(trim(p_shipping ->> 'region'), 80), ''),
		'postal_code', nullif(left(trim(p_shipping ->> 'postal_code'), 20), ''),
		'country', nullif(left(trim(p_shipping ->> 'country'), 2), '')
	));
	if not (v_shipping ? 'line1' and v_shipping ? 'city' and v_shipping ? 'postal_code' and v_shipping ? 'country') then
		raise exception 'Please complete your shipping address.' using errcode = 'P0001';
	end if;

	-- Lines: resolve variants and current prices from the catalog
	if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
		raise exception 'Your bag is empty.' using errcode = 'P0001';
	end if;
	if jsonb_array_length(p_items) > 50 then
		raise exception 'Your bag has too many lines.' using errcode = 'P0001';
	end if;

	drop table if exists order_lines;
	create temporary table order_lines on commit drop as
	select
		v.id as variant_id,
		p.id as product_id,
		p.name as product_name,
		p.slug as product_slug,
		v.size,
		p.images[1] as image,
		coalesce(v.price_override, p.price) as unit_price,
		least(sum(greatest(coalesce(i.quantity, 1), 1)), 10)::int as quantity,
		min(i.ord) as position
	from rows from (jsonb_to_recordset(p_items) as (id text, size text, quantity int))
		with ordinality as i (id, size, quantity, ord)
	join public.product_variants v on v.product_id::text = i.id and v.size = i.size
	join public.products p on p.id = v.product_id
	group by v.id, p.id;

	select count(distinct (i.id, i.size)) into v_requested
	from jsonb_to_recordset(p_items) as i (id text, size text);
	select count(*) into v_matched from order_lines;

	if v_matched = 0 then
		raise exception 'Your bag is empty.' using errcode = 'P0001';
	end if;
	if v_matched < v_requested then
		raise exception 'Some pieces in your bag are no longer available. Please review your bag.'
			using errcode = 'P0001';
	end if;

	-- Totals (same rules as the bag)
	select sum(unit_price * quantity) into v_subtotal from order_lines;

	if v_promo is not null then
		select pc.percent_off into v_percent from public.validate_promo_code(v_promo) pc;
		if v_percent is null then
			raise exception 'That promo code isn''t valid or has expired.' using errcode = 'P0001';
		end if;
		v_discount := round(v_subtotal * v_percent / 100.0);
	end if;

	v_gift := case when p_gift_packaging then c_gift_packaging_cents else 0 end;
	v_courier := case when v_subtotal >= c_free_courier_threshold_cents then 0 else c_courier_cents end;

	-- Order number like ORD-261030-4F7K2Q; retry on the rare collision
	loop
		v_order_number := 'ORD-' || to_char(now(), 'YYMMDD') || '-'
			|| upper(substr(md5(gen_random_uuid()::text), 1, 6));
		exit when not exists (select 1 from public.orders o where o.order_number = v_order_number);
	end loop;

	insert into public.orders (
		order_number, user_id, email, full_name, phone, shipping_address,
		payment_brand, payment_last4, gift_packaging, gift_note, promo_code,
		subtotal_cents, discount_cents, gift_cents, shipping_cents, total_cents
	)
	values (
		v_order_number, auth.uid(), v_email, v_name, v_phone, v_shipping,
		v_brand, v_last4, coalesce(p_gift_packaging, false),
		case when p_gift_packaging then v_note end,
		case when v_percent > 0 then v_promo end,
		v_subtotal, v_discount, v_gift, v_courier,
		greatest(v_subtotal - v_discount + v_gift, 0) + v_courier
	)
	returning id, orders.access_token into v_order_id, v_token;

	insert into public.order_items (
		order_id, product_id, variant_id, product_name, product_slug, size,
		image, unit_price_cents, quantity, position
	)
	select v_order_id, product_id, variant_id, product_name, product_slug, size,
		image, unit_price, quantity, position
	from order_lines;

	-- A signed-in shopper's saved bag empties of what they just ordered
	if auth.uid() is not null then
		delete from public.cart_items ci
		where ci.user_id = auth.uid()
			and ci.variant_id in (select ol.variant_id from order_lines ol);
	end if;

	return query select v_order_id, v_order_number, v_token;
end;
$$;

revoke execute on function public.place_order(jsonb, jsonb, jsonb, jsonb, boolean, text, text) from public;
grant execute on function public.place_order(jsonb, jsonb, jsonb, jsonb, boolean, text, text) to anon, authenticated;

commit;
