-- Account page details
--
-- 1. profiles.birthday and profiles.preferred_sizes (one saved size per
--    category, e.g. {"rings": "7", "necklaces": "18 IN"}), which pre-select
--    sizes on product pages. Covered by the existing owner-only policies.
-- 2. newsletter_subscribers, keyed by email so a footer signup (Phase 4) and
--    an account toggle refer to the same subscription. The table has RLS on
--    and no policies: it is only reachable through the two functions below,
--    which act on the signed-in user's own (confirmed) email.
--
-- Run once in the Supabase dashboard SQL Editor. Runs as one transaction and
-- is safe to re-run.

begin;

-- ---------------------------------------------------------------------------
-- Profile details
-- ---------------------------------------------------------------------------

alter table public.profiles
	add column if not exists birthday date
		check (birthday is null or birthday > '1900-01-01'),
	add column if not exists preferred_sizes jsonb not null default '{}'::jsonb
		check (jsonb_typeof(preferred_sizes) = 'object');

-- ---------------------------------------------------------------------------
-- Newsletter
-- ---------------------------------------------------------------------------

create table if not exists public.newsletter_subscribers (
	id uuid primary key default gen_random_uuid(),
	email text not null unique
		check (email = lower(email) and char_length(email) <= 320 and position('@' in email) > 1),
	user_id uuid references auth.users (id) on delete set null,
	subscribed boolean not null default true,
	source text not null default 'account' check (source in ('account', 'footer')),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Whether the signed-in user's email is subscribed
create or replace function public.get_newsletter_subscription()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
	select coalesce(
		(select subscribed
		 from public.newsletter_subscribers
		 where email = lower(auth.jwt() ->> 'email')),
		false
	);
$$;

-- Subscribes or unsubscribes the signed-in user's email; returns the new state
create or replace function public.set_newsletter_subscription(p_subscribed boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
	v_email text := lower(auth.jwt() ->> 'email');
begin
	if auth.uid() is null or coalesce(v_email, '') = '' then
		raise exception 'Not signed in';
	end if;

	insert into public.newsletter_subscribers (email, user_id, subscribed, source)
	values (v_email, auth.uid(), p_subscribed, 'account')
	on conflict (email) do update
		set subscribed = excluded.subscribed,
			user_id = auth.uid(),
			updated_at = now();

	return p_subscribed;
end;
$$;

revoke execute on function public.get_newsletter_subscription() from public, anon;
revoke execute on function public.set_newsletter_subscription(boolean) from public, anon;
grant execute on function public.get_newsletter_subscription() to authenticated;
grant execute on function public.set_newsletter_subscription(boolean) to authenticated;

commit;
