-- Pris på konserter.
-- PÅKREVD: admin-skjemaet for konserter sender alltid disse feltene.
-- Kjør denne filen én gang i Supabase SQL Editor. Trygg å kjøre flere ganger.
--
-- price     = prisen som vises på konsertkortet, f.eks. "300" eller "kr 300 / 250 for honnør"
-- kids_free = viser "Barn under 12 år gratis" på konsertkortet

alter table public.concerts
  add column if not exists price text,
  add column if not exists kids_free boolean not null default false;

-- Be API-et lese databaseskjemaet på nytt, så de nye kolonnene kan brukes med en gang.
notify pgrst, 'reload schema';
