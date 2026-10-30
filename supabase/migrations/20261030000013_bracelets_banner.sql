-- Warmer Bracelets category photo
--
-- The Bracelets tile on the home page used a dark, cool photo (black rock)
-- that clashed with the warm cream palette. Moves it to a Pexels photo of a
-- wrist with a gold chain, in cream and champagne tones.
--
-- Run once in the Supabase dashboard SQL Editor. One transaction; safe to
-- re-run.

begin;

update public.categories
set banner_image = 'https://images.pexels.com/photos/9886212/pexels-photo-9886212.jpeg?auto=compress&cs=tinysrgb&w=1600'
where slug = 'bracelets';

commit;
