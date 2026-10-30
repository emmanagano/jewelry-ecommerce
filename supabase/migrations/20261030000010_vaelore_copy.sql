-- Vaelore collection copy
--
-- Brand-voiced descriptions for the three original collections (the Lumière,
-- Tide and Heirloom ones were written in 0008). Updates only.
--
-- Run once in the Supabase dashboard SQL Editor. One transaction; safe to
-- re-run.

begin;

update public.collections set description = 'Client favourites, chosen again and again.' where slug = 'best-sellers';
update public.collections set description = 'New from the atelier, and the pieces we are proudest of.' where slug = 'new-and-featured';
update public.collections set description = 'Chosen once, treasured for generations. Complimentary engraving and gift presentation.' where slug = 'gifts';

commit;
