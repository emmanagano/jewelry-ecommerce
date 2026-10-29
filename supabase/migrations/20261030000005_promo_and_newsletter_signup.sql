-- Phase 4: the bag without payments
--
-- 1. promo_codes, checked by validate_promo_code(). The table has RLS on and
--    no policies, so the list of codes can't be read; a visitor can only ask
--    whether one specific code is valid right now.
-- 2. subscribe_newsletter() for the footer form (signed in or not). It writes
--    to the same newsletter_subscribers table as the account switch.
--
-- Run once in the Supabase dashboard SQL Editor. Runs as one transaction and
-- is safe to re-run.

begin;

-- ---------------------------------------------------------------------------
-- Promo codes
-- ---------------------------------------------------------------------------

create table if not exists public.promo_codes (
	code text primary key check (code = upper(code) and char_length(code) between 3 and 32),
	percent_off int not null check (percent_off between 1 and 100),
	active boolean not null default true,
	starts_at timestamptz,
	expires_at timestamptz,
	created_at timestamptz not null default now(),
	check (expires_at is null or starts_at is null or expires_at > starts_at)
);

alter table public.promo_codes enable row level security;

-- The code the bag used to hard-code. Add or retire codes in the Table Editor.
insert into public.promo_codes (code, percent_off)
values ('ARCHIVE10', 10)
on conflict (code) do nothing;

-- The discount for a code if it is active and within its dates, else null.
-- Case and surrounding spaces in the input are ignored.
create or replace function public.validate_promo_code(p_code text)
returns table (code text, percent_off int)
language sql
stable
security definer
set search_path = ''
as $$
	select pc.code, pc.percent_off
	from public.promo_codes pc
	where pc.code = upper(trim(p_code))
		and pc.active
		and (pc.starts_at is null or pc.starts_at <= now())
		and (pc.expires_at is null or pc.expires_at > now());
$$;

revoke execute on function public.validate_promo_code(text) from public;
grant execute on function public.validate_promo_code(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Footer newsletter signup
-- ---------------------------------------------------------------------------

-- Subscribes an email. Returns nothing either way, so the form can't be used
-- to discover who is already subscribed. Links the row to the account when
-- the signed-in user subscribes their own email.
create or replace function public.subscribe_newsletter(p_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_email text := lower(trim(p_email));
	v_user uuid := case
		when auth.uid() is not null and v_email = lower(auth.jwt() ->> 'email')
			then auth.uid()
	end;
begin
	if v_email is null or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' or char_length(v_email) > 320 then
		raise exception 'Invalid email address' using errcode = '22023';
	end if;

	insert into public.newsletter_subscribers (email, user_id, subscribed, source)
	values (v_email, v_user, true, 'footer')
	on conflict (email) do update
		set subscribed = true,
			user_id = coalesce(excluded.user_id, public.newsletter_subscribers.user_id),
			updated_at = now();
end;
$$;

revoke execute on function public.subscribe_newsletter(text) from public;
grant execute on function public.subscribe_newsletter(text) to anon, authenticated;

commit;
