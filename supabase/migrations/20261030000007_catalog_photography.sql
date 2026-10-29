-- Catalog photography refresh
--
-- Replaces every product photo and category banner with warm, neutral
-- photography from Pexels (free for commercial use, no attribution required;
-- https://www.pexels.com/license/). Existing products keep their id and slug
-- (so bags, wishlists and orders keep working) but their copy is rewritten to
-- match the new photos. Adds 7 products, 5 of them under $200, so the courier
-- fee and free-shipping progress show up.
--
-- Run once in the Supabase dashboard SQL Editor. One transaction; safe to
-- re-run (new products are skipped if their slug already exists).

begin;

-- ---------------------------------------------------------------------------
-- Existing products: new photos, copy rewritten to match
-- ---------------------------------------------------------------------------

update public.products set
	name = 'Baroque Pearl Medallion Necklace',
	subtitle = '18k Yellow Gold & Freshwater Pearls',
	description = 'A strand of lustrous freshwater pearls paired with a hand-struck gold medallion. Wear it alone or layer it with finer chains.',
	images = array['https://images.pexels.com/photos/23495720/pexels-photo-23495720.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/8776984/pexels-photo-8776984.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	metal = 'Yellow Gold',
	stone = 'Pearl'
where slug = 'baroque-pearl-flora-pendant';

update public.products set
	name = 'Celestial Solitaire & Band Set',
	subtitle = '14k Yellow Gold & Lab-Grown Diamond',
	description = 'A lab-grown diamond solitaire and a sleek polished band, designed to sit flush together or be worn apart.',
	images = array['https://images.pexels.com/photos/5009521/pexels-photo-5009521.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/8433597/pexels-photo-8433597.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	metal = 'Yellow Gold',
	stone = 'Diamond'
where slug = 'pave-celestial-stacking-trio';

update public.products set
	images = array['https://images.pexels.com/photos/14641597/pexels-photo-14641597.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/7273388/pexels-photo-7273388.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	metal = 'Yellow Gold',
	stone = null
where slug = 'atelier-multi-gauge-chain-suite';

update public.products set
	name = 'Sovereign Sunburst Collar',
	subtitle = '22k Antique Gold',
	description = 'A sculptural fan of hand-forged gold rays that frames the collarbone. Our most dramatic heirloom piece.',
	images = array['https://images.pexels.com/photos/9509036/pexels-photo-9509036.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	metal = 'Yellow Gold',
	stone = null
where slug = 'sovereign-emerald-heritage-choker';

update public.products set
	name = 'Ouroboros Pavé Crossover Bangle',
	subtitle = '18k Yellow Gold & Round Brilliant Diamonds',
	description = 'Two pavé-set terminals cross at the wrist on a slim, hinged bangle. Set with round brilliant diamonds.',
	images = array['https://images.pexels.com/photos/34399115/pexels-photo-34399115.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/14509640/pexels-photo-14509640.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	metal = 'Yellow Gold',
	stone = 'Diamond'
where slug = 'ouroboros-pave-serpent-bangle';

update public.products set
	name = 'Eos Double Wave Cuff',
	subtitle = '18k Gold Vermeil',
	description = 'Two polished ribbons of gold curve into an open cuff that slips on easily and catches the light.',
	images = array['https://images.pexels.com/photos/38827915/pexels-photo-38827915.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/10341191/pexels-photo-10341191.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	metal = 'Vermeil',
	stone = null
where slug = 'eos-tapered-spear-pave-bangle';

update public.products set
	name = 'Aurelia Sculpted Huggies',
	subtitle = '18k Yellow Gold',
	description = 'Small, weighty huggies with a softly faceted profile, made to be worn every day.',
	images = array['https://images.pexels.com/photos/12168883/pexels-photo-12168883.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/15785528/pexels-photo-15785528.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	metal = 'Yellow Gold',
	stone = null
where slug = 'aurelia-teardrop-pave-drops';

update public.products set
	name = 'Sovereign Sculpted Hoops',
	subtitle = '18k Yellow Gold',
	description = 'Bold, rounded hoops with a high polish and a hollow core, so they stay light on the ear.',
	images = array['https://images.pexels.com/photos/7882737/pexels-photo-7882737.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/18075559/pexels-photo-18075559.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	metal = 'Yellow Gold',
	stone = null
where slug = 'sovereign-tri-tone-filigree-chandeliers';

-- ---------------------------------------------------------------------------
-- New products
-- ---------------------------------------------------------------------------

insert into public.products (name, slug, subtitle, badge, price, images, description, category_id, metal, stone)
select 'Amour Heart Outline Pendant', 'amour-heart-outline-pendant', '14k Yellow Gold', 'NEW ARRIVAL', 16500, array['https://images.pexels.com/photos/16935588/pexels-photo-16935588.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/16037833/pexels-photo-16037833.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	'A hand-bent heart outline on a fine cable chain. A small gesture, made to last.',
	c.id, 'Yellow Gold', null
from public.categories c
where c.slug = 'necklaces'
on conflict (slug) do nothing;

insert into public.products (name, slug, subtitle, badge, price, images, description, category_id, metal, stone)
select 'Luna Moonstone Pendant', 'luna-moonstone-pendant', '14k Yellow Gold & Rainbow Moonstone', null, 24000, array['https://images.pexels.com/photos/34372548/pexels-photo-34372548.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/32480611/pexels-photo-32480611.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	'A cabochon of rainbow moonstone in a slim gold bezel, on an 18-inch chain.',
	c.id, 'Yellow Gold', 'Moonstone'
from public.categories c
where c.slug = 'necklaces'
on conflict (slug) do nothing;

insert into public.products (name, slug, subtitle, badge, price, images, description, category_id, metal, stone)
select 'Petite Baroque Pearl Choker', 'petite-baroque-pearl-choker', 'Freshwater Pearls & 14k Gold Clasp', 'NEW ARRIVAL', 18500, array['https://images.pexels.com/photos/36854160/pexels-photo-36854160.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/17940326/pexels-photo-17940326.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	'Two delicate rows of rice-shaped freshwater pearls, finished with a gold clasp.',
	c.id, 'Yellow Gold', 'Pearl'
from public.categories c
where c.slug = 'necklaces'
on conflict (slug) do nothing;

insert into public.products (name, slug, subtitle, badge, price, images, description, category_id, metal, stone)
select 'Soleil Fine Chain Bracelet', 'soleil-fine-chain-bracelet', '14k Yellow Gold', 'TOP GIFT', 14500, array['https://images.pexels.com/photos/14509641/pexels-photo-14509641.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/33218676/pexels-photo-33218676.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	'A whisper-fine chain with a single polished bar, made for stacking.',
	c.id, 'Yellow Gold', null
from public.categories c
where c.slug = 'bracelets'
on conflict (slug) do nothing;

insert into public.products (name, slug, subtitle, badge, price, images, description, category_id, metal, stone)
select 'Perle Mini Hoops', 'perle-mini-hoops', '14k Yellow Gold & Seed Pearls', null, 12000, array['https://images.pexels.com/photos/15176438/pexels-photo-15176438.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/11456370/pexels-photo-11456370.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	'Petite hoops lined with seed pearls, for an everyday glow.',
	c.id, 'Yellow Gold', 'Pearl'
from public.categories c
where c.slug = 'earrings'
on conflict (slug) do nothing;

insert into public.products (name, slug, subtitle, badge, price, images, description, category_id, metal, stone)
select 'Eterna Diamond Eternity Band', 'eterna-diamond-eternity-band', '18k Yellow Gold & Lab-Grown Diamonds', 'ICONIC', 89000, array['https://images.pexels.com/photos/30541169/pexels-photo-30541169.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/14509875/pexels-photo-14509875.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	'A full circle of lab-grown diamonds in a low, comfortable setting.',
	c.id, 'Yellow Gold', 'Diamond'
from public.categories c
where c.slug = 'rings'
on conflict (slug) do nothing;

insert into public.products (name, slug, subtitle, badge, price, images, description, category_id, metal, stone)
select 'Linea Stacking Ring Set', 'linea-stacking-ring-set', '14k Yellow Gold', null, 17500, array['https://images.pexels.com/photos/9886212/pexels-photo-9886212.jpeg?auto=compress&cs=tinysrgb&w=1600', 'https://images.pexels.com/photos/14436095/pexels-photo-14436095.jpeg?auto=compress&cs=tinysrgb&w=1600'],
	'Three fine bands in polished, textured and twisted finishes, worn together or apart.',
	c.id, 'Yellow Gold', null
from public.categories c
where c.slug = 'rings'
on conflict (slug) do nothing;

-- Sizes for the new products, using the same lists as the rest of the catalog
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
where p.slug in ('amour-heart-outline-pendant', 'luna-moonstone-pendant', 'petite-baroque-pearl-choker', 'soleil-fine-chain-bracelet', 'perle-mini-hoops', 'eterna-diamond-eternity-band', 'linea-stacking-ring-set')
on conflict (product_id, size) do nothing;

-- Collection membership for the new products, appended after existing pieces
insert into public.product_collections (product_id, collection_id, position)
select p.id, col.id,
	coalesce((select max(pc.position) from public.product_collections pc where pc.collection_id = col.id), 0)
		+ row_number() over (partition by col.id order by m.ord)
from (values
	('amour-heart-outline-pendant', 'new-and-featured', 0),
	('amour-heart-outline-pendant', 'gifts', 0),
	('luna-moonstone-pendant', 'new-and-featured', 1),
	('petite-baroque-pearl-choker', 'new-and-featured', 2),
	('petite-baroque-pearl-choker', 'gifts', 2),
	('soleil-fine-chain-bracelet', 'gifts', 3),
	('perle-mini-hoops', 'new-and-featured', 4),
	('perle-mini-hoops', 'gifts', 4),
	('linea-stacking-ring-set', 'new-and-featured', 6)
) as m (slug, collection, ord)
join public.products p on p.slug = m.slug
join public.collections col on col.slug = m.collection
on conflict (product_id, collection_id) do nothing;

-- ---------------------------------------------------------------------------
-- Category banners
-- ---------------------------------------------------------------------------

update public.categories set banner_image = 'https://images.pexels.com/photos/14873626/pexels-photo-14873626.jpeg?auto=compress&cs=tinysrgb&w=1600' where slug = 'bracelets';

update public.categories set banner_image = 'https://images.pexels.com/photos/17261921/pexels-photo-17261921.jpeg?auto=compress&cs=tinysrgb&w=1600' where slug = 'rings';

update public.categories set banner_image = 'https://images.pexels.com/photos/12753204/pexels-photo-12753204.jpeg?auto=compress&cs=tinysrgb&w=1600' where slug = 'necklaces';

update public.categories set banner_image = 'https://images.pexels.com/photos/10457796/pexels-photo-10457796.jpeg?auto=compress&cs=tinysrgb&w=1600' where slug = 'earrings';


commit;
