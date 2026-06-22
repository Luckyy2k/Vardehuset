-- Lenk opptatte datoer til henvendelsen som booket dem.
-- Kjør denne filen én gang i Supabase SQL Editor. Trygg å kjøre flere ganger.
--
-- Når en henvendelse godkjennes i admin, settes datoen som opptatt og lenkes til
-- henvendelsen via inquiry_id. Da kan «Angre godkjenning» frigjøre datoen igjen
-- kun hvis det var denne henvendelsen som booket den (ikke en manuell booking
-- eller en annen henvendelse). Slettes henvendelsen, blir lenken null, men
-- datoen forblir opptatt.

alter table public.booked_dates
  add column if not exists inquiry_id uuid references public.inquiries(id) on delete set null;
