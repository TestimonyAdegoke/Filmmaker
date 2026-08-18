-- Reposition the default portfolio identity around the artist's actual disciplines.
-- This only replaces the starter/demo positioning. Customize artist_name, bio and links in production.
update public.site_settings
set value = value || jsonb_build_object(
  'eyebrow', 'COMPOSER · MUSIC PRODUCER · SOUND DESIGNER',
  'hero_line_1', 'I build emotion',
  'hero_line_2', 'through music and sound.',
  'bio', 'I compose, produce and design sound for film, records and brands. My work lives where melody, texture, rhythm and picture meet — building sonic worlds that make stories feel larger, sharper and more human.'
), updated_at = now()
where key = 'portfolio'
  and (
    value->>'eyebrow' = 'FILMMAKER · FILM COMPOSER · SCORE ENGINEER · MUSIC PRODUCER'
    or value->>'artist_name' = 'NOIRFRAME'
  );
