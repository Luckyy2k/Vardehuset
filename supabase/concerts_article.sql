-- Legger til artikkellenke på konserter (f.eks. omtale hos Bypatrioten).
-- article_url   = lenken til artikkelen/omtalen
-- article_label = teksten på lenken (tom = "Les omtalen")
-- Kjøres i Supabase SQL Editor.

alter table concerts
  add column if not exists article_url text,
  add column if not exists article_title text,
  add column if not exists article_image text;

-- Koble Bypatrioten-artikkelen til jubileumskonserten som allerede ligger inne.
update concerts
set article_url = 'https://bypatrioten.com/nyheter/mannskoret-varde-hedret/'
where title ilike '%jubileum%';
