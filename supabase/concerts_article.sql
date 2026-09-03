-- Artikkelkort ved siden av konserten (f.eks. omtale hos Bypatrioten).
-- article_url     = lenken "Les mer" går til
-- article_title   = overskriften på kortet
-- article_excerpt = kort tekst fra artikkelen
-- article_image   = bildet på kortet
-- Kjøres i Supabase SQL Editor.

alter table concerts
  add column if not exists article_url text,
  add column if not exists article_title text,
  add column if not exists article_excerpt text,
  add column if not exists article_image text;

-- Gammelt felt fra første utkast, ikke lenger i bruk.
alter table concerts drop column if exists article_label;

-- Koble Bypatrioten-artikkelen til jubileumskonserten som allerede ligger inne.
update concerts
set article_url = 'https://bypatrioten.com/nyheter/mannskoret-varde-hedret/',
    article_title = 'Mannskoret Varde hedret',
    article_excerpt = 'Etter 100 år med sang fikk Mannskoret Varde hederspris og 10 000 kroner fra Sparebanken Møre under BraBy-konferansen.',
    article_image = '/images/konserter/bypatrioten-varde-hedret.jpg'
where title ilike '%jubileum%';
