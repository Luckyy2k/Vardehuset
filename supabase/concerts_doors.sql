-- "Dørene åpner" på konserter.
-- Kjør denne filen én gang i Supabase SQL Editor. Trygg å kjøre flere ganger.

alter table public.concerts
  add column if not exists doors text;
