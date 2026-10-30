-- Maison Vaelore catalog
--
-- Re-themes the catalog around the Vaelore brand book (docs/). The 15 existing
-- products keep their id and slug (so bags, wishlists and orders keep working)
-- but become Vaelore pieces in the Lumière, Tide and Heirloom collections, with
-- brand-voiced copy and heirloom prices (integer cents). Photos are kept except
-- for the Lumière huggies, and one new Lumière piece is added (Pexels photos,
-- free licence). Constellation (price on request) is not seeded.
--
-- The brand never discounts, so the old ARCHIVE10 code is retired and replaced
-- by a small "private" code so the bag's code field can still be tried.
--
-- Run once in the Supabase dashboard SQL Editor. One transaction; safe to
-- re-run.

begin;

-- ---------------------------------------------------------------------------
-- Collections
-- ---------------------------------------------------------------------------

insert into public.collections (slug, name, description, banner_image)
values
	('lumiere', 'Lumière',
		'The house signature. A single pearl, cradled in fine gold, as if floating.', null),
	('tide', 'Tide',
		'Fluid 18k gold forms shaped like water drawn back by the tide. Stackable and bold.', null),
	('heirloom', 'Heirloom',
		'Pearls and diamonds for weddings and the moments that become history.', null)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Products: rename in place, keep photos
-- ---------------------------------------------------------------------------

update public.products as p set
	name = v.name,
	subtitle = v.subtitle,
	description = v.description,
	price = v.price,
	badge = v.badge,
	metal = v.metal,
	stone = v.stone
from (values
	('perle-mini-hoops', 'Lumière Pearl Huggies', '18k Yellow Gold & Pearls', 180000,
		'Petite huggies lined with pearls, for an everyday glow. Where most clients begin.',
		'Numbered edition', 'Yellow Gold', 'Pearl'),
	('baroque-pearl-flora-pendant', 'Lumière Pearl Medallion Necklace', '18k Yellow Gold & Pearls', 480000,
		'A strand of lustrous pearls paired with a hand-struck gold medallion. Worn alone or layered with finer chains.',
		null, 'Yellow Gold', 'Pearl'),
	('petite-baroque-pearl-choker', 'Lumière Pearl Choker', '18k Gold Clasp & Pearls', 920000,
		'Two delicate rows of rice-shaped pearls, matched by eye and finished with a gold clasp.',
		'Numbered edition', 'Yellow Gold', 'Pearl'),

	('sovereign-tri-tone-filigree-chandeliers', 'Tide Sculpted Hoops', '18k Yellow Gold', 320000,
		'Bold, rounded hoops with a high polish and a hollow core, so they stay light on the ear.',
		null, 'Yellow Gold', null),
	('aurelia-teardrop-pave-drops', 'Tide Faceted Huggies', '18k Yellow Gold', 240000,
		'Small, weighty huggies with a softly faceted profile, made to be worn every day.',
		null, 'Yellow Gold', null),
	('luna-moonstone-pendant', 'Tide Moonstone Pendant', '18k Yellow Gold & Rainbow Moonstone', 360000,
		'A cabochon of rainbow moonstone in a slim gold bezel, on an 18-inch chain.',
		null, 'Yellow Gold', 'Moonstone'),
	('sovereign-emerald-heritage-choker', 'Tide Sunburst Collar', '18k Yellow Gold', 1400000,
		'A sculptural fan of hand-forged gold rays that frames the collarbone. Our most dramatic piece in gold.',
		'Numbered edition', 'Yellow Gold', null),
	('atelier-multi-gauge-chain-suite', 'Tide Chain', '18k Yellow Gold', 280000,
		'Links of several gauges, each polished by hand, to wear alone or together.',
		null, 'Yellow Gold', null),
	('linea-stacking-ring-set', 'Tide Stacking Rings', '18k Yellow Gold', 380000,
		'Three fine bands in polished, textured and twisted finishes, worn together or apart.',
		null, 'Yellow Gold', null),
	('eos-tapered-spear-pave-bangle', 'Tide Cuff', '18k Yellow Gold', 580000,
		'Two polished ribbons of gold curve into an open cuff that slips on easily and catches the light.',
		null, 'Yellow Gold', null),
	('soleil-fine-chain-bracelet', 'Tide Chain Bracelet', '18k Yellow Gold', 240000,
		'A whisper-fine chain with a single polished bar, made for stacking.',
		null, 'Yellow Gold', null),

	('amour-heart-outline-pendant', 'Heirloom Pendant', '18k Yellow Gold', 800000,
		'A hand-bent heart outline on a fine cable chain. Chosen once, made to be passed down.',
		null, 'Yellow Gold', null),
	('pave-celestial-stacking-trio', 'Heirloom Solitaire & Band Set', '18k Yellow Gold & Diamond', 1850000,
		'A diamond solitaire and a sleek polished band, designed to sit flush together or be worn apart.',
		'Numbered edition', 'Yellow Gold', 'Diamond'),
	('ouroboros-pave-serpent-bangle', 'Heirloom Pavé Bangle', '18k Yellow Gold & Round Brilliant Diamonds', 1650000,
		'Two pavé-set terminals cross at the wrist on a slim, hinged bangle. Set with round brilliant diamonds.',
		null, 'Yellow Gold', 'Diamond'),
	('eterna-diamond-eternity-band', 'Heirloom Eternity Band', '18k Yellow Gold & Diamonds', 2800000,
		'A full circle of diamonds in a low, comfortable setting. The first heirloom of a family.',
		'Numbered edition', 'Yellow Gold', 'Diamond')
) as v (slug, name, subtitle, price, description, badge, metal, stone)
where p.slug = v.slug;

-- Lumière huggies: a pearl drop on gold hoops, on cream, leads the gallery
update public.products set images = array[
	'https://images.pexels.com/photos/36823005/pexels-photo-36823005.jpeg?auto=compress&cs=tinysrgb&w=1600',
	'https://images.pexels.com/photos/15176438/pexels-photo-15176438.jpeg?auto=compress&cs=tinysrgb&w=1600'
] where slug = 'perle-mini-hoops';

-- New Lumière piece
insert into public.products (name, slug, subtitle, badge, price, images, description, category_id, metal, stone)
select 'Lumière Cameo Pearl Drops', 'lumiere-cameo-pearl-drops', '18k Yellow Gold & Pearls', 'Numbered edition', 680000,
	array[
		'https://images.pexels.com/photos/23495776/pexels-photo-23495776.jpeg?auto=compress&cs=tinysrgb&w=1600',
		'https://images.pexels.com/photos/23495777/pexels-photo-23495777.jpeg?auto=compress&cs=tinysrgb&w=1600'
	],
	'Matte gold cameos, each hung with a long baroque pearl chosen for its lustre and matched by eye.',
	c.id, 'Yellow Gold', 'Pearl'
from public.categories c
where c.slug = 'earrings'
on conflict (slug) do nothing;

insert into public.product_variants (product_id, size, sort_order)
select p.id, 'Standard', 1
from public.products p
where p.slug = 'lumiere-cameo-pearl-drops'
on conflict (product_id, size) do nothing;

-- ---------------------------------------------------------------------------
-- Collection membership
-- ---------------------------------------------------------------------------

insert into public.product_collections (product_id, collection_id, position)
select p.id, col.id, m.ord
from (values
	('perle-mini-hoops', 'lumiere', 1),
	('baroque-pearl-flora-pendant', 'lumiere', 2),
	('petite-baroque-pearl-choker', 'lumiere', 3),
	('lumiere-cameo-pearl-drops', 'lumiere', 4),

	('sovereign-tri-tone-filigree-chandeliers', 'tide', 1),
	('aurelia-teardrop-pave-drops', 'tide', 2),
	('luna-moonstone-pendant', 'tide', 3),
	('sovereign-emerald-heritage-choker', 'tide', 4),
	('atelier-multi-gauge-chain-suite', 'tide', 5),
	('linea-stacking-ring-set', 'tide', 6),
	('eos-tapered-spear-pave-bangle', 'tide', 7),
	('soleil-fine-chain-bracelet', 'tide', 8),

	('amour-heart-outline-pendant', 'heirloom', 1),
	('pave-celestial-stacking-trio', 'heirloom', 2),
	('ouroboros-pave-serpent-bangle', 'heirloom', 3),
	('eterna-diamond-eternity-band', 'heirloom', 4)
) as m (slug, collection, ord)
join public.products p on p.slug = m.slug
join public.collections col on col.slug = m.collection
on conflict (product_id, collection_id) do nothing;

-- ---------------------------------------------------------------------------
-- Category copy
-- ---------------------------------------------------------------------------

update public.categories set description = 'Cuffs, bangles and fine chains in 18k gold, finished by hand and made to be worn every day.' where slug = 'bracelets';
update public.categories set description = 'Stacking bands, solitaires and eternity rings in 18k gold and traceable diamonds.' where slug = 'rings';
update public.categories set description = 'Pearl strands, sculpted collars and fine chains, made slowly and meant to be passed down.' where slug = 'necklaces';
update public.categories set description = 'Pearl huggies, hoops and drops in 18k gold, chosen for lustre and made to be worn for decades.' where slug = 'earrings';

-- ---------------------------------------------------------------------------
-- Codes: Vaelore does not discount, so retire the old code. The new one is a
-- small private courtesy so the bag's code field can still be tried.
-- ---------------------------------------------------------------------------

update public.promo_codes set active = false where code = 'ARCHIVE10';

insert into public.promo_codes (code, percent_off)
values ('PRIVATE5', 5)
on conflict (code) do nothing;

commit;
