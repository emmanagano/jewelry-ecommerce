-- Vaelore product slugs
--
-- Renames each product's slug to match its Vaelore name (the old slugs came
-- from the previous brand). Carts, wishlists and orders reference products by
-- id, so only order_items.product_slug (used for the product links on order
-- pages) needs to follow. Old addresses are redirected in next.config.ts.
--
-- Run once in the Supabase dashboard SQL Editor. One transaction; safe to
-- re-run (a row whose old slug is already gone is skipped). Creates no tables.

begin;

-- order_items first, so order pages never point at a missing product
update public.order_items oi
set product_slug = m.new_slug
from (values
		('perle-mini-hoops', 'lumiere-pearl-huggies'),
		('baroque-pearl-flora-pendant', 'lumiere-pearl-medallion-necklace'),
		('petite-baroque-pearl-choker', 'lumiere-pearl-choker'),
		('sovereign-tri-tone-filigree-chandeliers', 'tide-sculpted-hoops'),
		('aurelia-teardrop-pave-drops', 'tide-faceted-huggies'),
		('luna-moonstone-pendant', 'tide-moonstone-pendant'),
		('sovereign-emerald-heritage-choker', 'tide-sunburst-collar'),
		('atelier-multi-gauge-chain-suite', 'tide-chain'),
		('linea-stacking-ring-set', 'tide-stacking-rings'),
		('eos-tapered-spear-pave-bangle', 'tide-cuff'),
		('soleil-fine-chain-bracelet', 'tide-chain-bracelet'),
		('amour-heart-outline-pendant', 'heirloom-pendant'),
		('pave-celestial-stacking-trio', 'heirloom-solitaire-and-band-set'),
		('ouroboros-pave-serpent-bangle', 'heirloom-pave-bangle'),
		('eterna-diamond-eternity-band', 'heirloom-eternity-band')
) as m (old_slug, new_slug)
where oi.product_slug = m.old_slug;

update public.products p
set slug = m.new_slug
from (values
		('perle-mini-hoops', 'lumiere-pearl-huggies'),
		('baroque-pearl-flora-pendant', 'lumiere-pearl-medallion-necklace'),
		('petite-baroque-pearl-choker', 'lumiere-pearl-choker'),
		('sovereign-tri-tone-filigree-chandeliers', 'tide-sculpted-hoops'),
		('aurelia-teardrop-pave-drops', 'tide-faceted-huggies'),
		('luna-moonstone-pendant', 'tide-moonstone-pendant'),
		('sovereign-emerald-heritage-choker', 'tide-sunburst-collar'),
		('atelier-multi-gauge-chain-suite', 'tide-chain'),
		('linea-stacking-ring-set', 'tide-stacking-rings'),
		('eos-tapered-spear-pave-bangle', 'tide-cuff'),
		('soleil-fine-chain-bracelet', 'tide-chain-bracelet'),
		('amour-heart-outline-pendant', 'heirloom-pendant'),
		('pave-celestial-stacking-trio', 'heirloom-solitaire-and-band-set'),
		('ouroboros-pave-serpent-bangle', 'heirloom-pave-bangle'),
		('eterna-diamond-eternity-band', 'heirloom-eternity-band')
) as m (old_slug, new_slug)
where p.slug = m.old_slug;

commit;
