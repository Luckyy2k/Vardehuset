-- Status på forespørsler (godkjenning i admin).
-- Kjør denne filen én gang i Supabase SQL Editor. Trygg å kjøre flere ganger.
--
-- status: 'new' = ikke håndtert, 'approved' = godkjent

alter table public.inquiries
  add column if not exists status text not null default 'new';

-- Admin (innlogget) må kunne oppdatere status.
drop policy if exists "inquiries_update_auth" on public.inquiries;
create policy "inquiries_update_auth" on public.inquiries
  for update to authenticated using (true) with check (true);

grant update on public.inquiries to authenticated;
