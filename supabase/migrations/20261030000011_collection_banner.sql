-- Collection banner without Unsplash
--
-- The New & Featured banner was the last catalog photo still hosted on
-- Unsplash. Moves it to a Pexels photo that matches the rest of the catalog.
--
-- Run once in the Supabase dashboard SQL Editor. One transaction; safe to
-- re-run.

begin;

update public.collections
set banner_image = 'https://images.pexels.com/photos/10457796/pexels-photo-10457796.jpeg?auto=compress&cs=tinysrgb&w=1600'
where slug = 'new-and-featured';

commit;
