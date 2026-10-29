-- Phase 2: data-driven catalog
--
-- Adds categories, collections and product variants, plus filter/search
-- columns on products, and moves the existing 8 products into the new
-- structure. Purely additive: the old text column `products.category` is
-- kept (unused by the app after this change) and dropped in a later migration.
--
-- Run once in the Supabase dashboard SQL Editor. Runs as one transaction:
-- if any statement fails, nothing is applied.

begin;

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------

create table if not exists public.categories (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	name text not null,
	description text,
	banner_image text,
	size_label text, -- e.g. "Ring Size"; null for one-size categories
	sort_order int not null default 0,
	created_at timestamptz not null default now()
);

insert into public.categories (slug, name, description, banner_image, size_label, sort_order)
values
	('bracelets', 'Bracelets',
		'Elevate your wrist stack with our handcrafted bracelets. Whether you love a customizable charm chain or a sleek, minimalist bangle, discover pieces designed for everyday elegance.',
		'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
		'Wrist Length', 1),
	('rings', 'Rings',
		'From delicate micro-pavé stacking bands to bold statement cocktail rings, explore timeless designs crafted in solid gold, vermeil, and sterling silver.',
		'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2000&auto=format&fit=crop',
		'Ring Size', 2),
	('necklaces', 'Necklaces',
		'Layer your style with sculpted pendants, lustrous pearl stations, and diamond-cut chains designed to shine from day to night.',
		'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=2000&auto=format&fit=crop',
		'Chain Length', 3),
	('earrings', 'Earrings',
		'Discover everyday huggies, statement sculptural drops, and luminous solitaire studs crafted for effortless comfort and radiant shine.',
		'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
		null, 4)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Products: category link, filter attributes, care copy, search
-- ---------------------------------------------------------------------------

alter table public.products
	add column if not exists category_id uuid references public.categories (id) on delete restrict,
	add column if not exists metal text,
	add column if not exists stone text,
	add column if not exists materials_care text; -- null = use the default care copy

update public.products p
set category_id = c.id
from public.categories c
where lower(p.category) = c.slug
	and p.category_id is null;

-- Fails (and rolls everything back) if any product has a category that
-- doesn't match one of the four slugs above.
alter table public.products alter column category_id set not null;

create index if not exists products_category_id_idx on public.products (category_id);

-- Filter attributes, derived from each product's subtitle. Review and adjust.
update public.products set metal = v.metal, stone = v.stone
from (values
	('sovereign-tri-tone-filigree-chandeliers', 'Mixed Gold',  null),
	('aurelia-teardrop-pave-drops',             'Yellow Gold', 'Diamond'),
	('eos-tapered-spear-pave-bangle',           'Vermeil',     null),
	('ouroboros-pave-serpent-bangle',           'Platinum',    'Diamond'),
	('sovereign-emerald-heritage-choker',       'Yellow Gold', 'Emerald'),
	('atelier-multi-gauge-chain-suite',         'Yellow Gold', null),
	('pave-celestial-stacking-trio',            'Rose Gold',   'Diamond'),
	('baroque-pearl-flora-pendant',             'Yellow Gold', 'Pearl')
) as v (slug, metal, stone)
where products.slug = v.slug;

-- Weighted full-text search over name > subtitle > description
alter table public.products
	add column if not exists search tsvector
	generated always as (
		setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
		setweight(to_tsvector('english', coalesce(subtitle, '')), 'B') ||
		setweight(to_tsvector('english', coalesce(description, '')), 'C')
	) stored;

create index if not exists products_search_idx on public.products using gin (search);

-- ---------------------------------------------------------------------------
-- Variants: the single source of sizes (and later, stock)
-- ---------------------------------------------------------------------------

create table if not exists public.product_variants (
	id uuid primary key default gen_random_uuid(),
	product_id uuid not null references public.products (id) on delete cascade,
	size text not null,
	sort_order int not null default 0,
	stock int check (stock is null or stock >= 0), -- null = not tracked
	price_override int check (price_override is null or price_override >= 0), -- cents
	created_at timestamptz not null default now(),
	unique (product_id, size)
);

create index if not exists product_variants_product_id_idx on public.product_variants (product_id);

-- One variant per size, using the size lists the app hard-coded until now
insert into public.product_variants (product_id, size, sort_order)
select p.id, s.size, s.ord
from public.products p
join public.categories c on c.id = p.category_id
cross join lateral unnest(
	case c.slug
		when 'rings'     then array['4', '5', '6', '7', '8', '9', '10']
		when 'bracelets' then array['15 CM', '16 CM', '17.5 CM', '19 CM', '20.5 CM']
		when 'necklaces' then array['14 IN', '16 IN', '18 IN', '20 IN', '22 IN']
		else array['Standard']
	end
) with ordinality as s (size, ord)
on conflict (product_id, size) do nothing;

-- ---------------------------------------------------------------------------
-- Collections: curated product groups (replaces matching text in `badge`)
-- ---------------------------------------------------------------------------

create table if not exists public.collections (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	name text not null,
	description text,
	banner_image text, -- null = use the first product's image
	created_at timestamptz not null default now()
);

create table if not exists public.product_collections (
	product_id uuid not null references public.products (id) on delete cascade,
	collection_id uuid not null references public.collections (id) on delete cascade,
	position int not null default 0,
	primary key (product_id, collection_id)
);

create index if not exists product_collections_collection_idx
	on public.product_collections (collection_id, position);

insert into public.collections (slug, name, description, banner_image)
values
	('best-sellers', 'Best Sellers',
		'Our most coveted pieces, chosen again and again by our clients.', null),
	('new-and-featured', 'New & Featured',
		'Fresh arrivals and signature designs from the atelier.',
		'https://images.unsplash.com/photo-1599458349289-18f0ee82e6ed?q=80&w=2000&auto=format&fit=crop'),
	('gifts', 'Gifts',
		'Thoughtful heirlooms for the people who matter most.', null)
on conflict (slug) do nothing;

-- Membership comes from the old badge labels. Curate freely afterwards.
insert into public.product_collections (product_id, collection_id, position)
select p.id, col.id,
	row_number() over (partition by col.id order by p.created_at desc)
from public.products p
join public.collections col on
	(col.slug = 'best-sellers'     and p.badge ilike '%BEST SELLER%') or
	(col.slug = 'gifts'            and p.badge ilike '%TOP GIFT%') or
	(col.slug = 'new-and-featured' and (p.badge ilike '%NEW ARRIVAL%'
		or p.badge ilike '%TRENDING%' or p.badge ilike '%ICONIC%'))
on conflict (product_id, collection_id) do nothing;

-- `badge` is now a single display label
update public.products
set badge = trim(split_part(badge, '|', 1))
where badge like '%|%';

-- ---------------------------------------------------------------------------
-- Row Level Security: the catalog is public and read-only
-- (The dashboard and service role bypass RLS, so you can still edit rows.)
-- ---------------------------------------------------------------------------

alter table public.products            enable row level security;
alter table public.categories          enable row level security;
alter table public.product_variants    enable row level security;
alter table public.collections         enable row level security;
alter table public.product_collections enable row level security;

drop policy if exists "Catalog is publicly readable" on public.products;
create policy "Catalog is publicly readable" on public.products
	for select to anon, authenticated using (true);

drop policy if exists "Catalog is publicly readable" on public.categories;
create policy "Catalog is publicly readable" on public.categories
	for select to anon, authenticated using (true);

drop policy if exists "Catalog is publicly readable" on public.product_variants;
create policy "Catalog is publicly readable" on public.product_variants
	for select to anon, authenticated using (true);

drop policy if exists "Catalog is publicly readable" on public.collections;
create policy "Catalog is publicly readable" on public.collections
	for select to anon, authenticated using (true);

drop policy if exists "Catalog is publicly readable" on public.product_collections;
create policy "Catalog is publicly readable" on public.product_collections
	for select to anon, authenticated using (true);

commit;
