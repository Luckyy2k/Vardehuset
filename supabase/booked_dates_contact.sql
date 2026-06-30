-- Navn og telefon på manuelt opptatte datoer (admin-kalenderen).
-- Kjør denne filen én gang i Supabase SQL Editor. Trygg å kjøre flere ganger.
--
-- For datoer som kommer fra en forespørsel hentes navn/telefon fra forespørselen
-- (via inquiry_id). For manuelle bookinger lagres de direkte her.

alter table public.booked_dates
  add column if not exists name text,
  add column if not exists phone text;
