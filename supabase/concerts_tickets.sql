-- Billettlink på konserter.
-- Kjør denne filen én gang i Supabase SQL Editor. Trygg å kjøre flere ganger.
--
-- ticket_url   = lenken det skal gå til
-- ticket_label = teksten på knappen (tom = "Bestill billett her")

alter table public.concerts
  add column if not exists ticket_url text,
  add column if not exists ticket_label text;
