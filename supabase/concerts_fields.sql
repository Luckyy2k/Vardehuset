-- Ekstra felter på konserter: tidspunkt og billettlink.
-- Kjør denne filen én gang i Supabase SQL Editor. Trygg å kjøre flere ganger.

alter table public.concerts
  add column if not exists doors text,         -- "dørene åpner", f.eks. kl. 18:30
  add column if not exists start_time text,    -- konserten starter, f.eks. kl. 19:00
  add column if not exists ticket_url text,    -- lenke for billettknappen
  add column if not exists ticket_label text;  -- knappetekst (tom = "Bestill billett her")
