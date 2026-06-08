-- Redigerbare sidetekster.
-- Kjør denne filen én gang i Supabase SQL Editor (Project → SQL Editor → New query).
--
-- Tabellen lagrer kun overstyringer: en rad per tekst som er endret i admin.
-- Tekster som ikke finnes her bruker standardteksten fra koden
-- (src/data/content.js). Trygg å kjøre flere ganger.

create table if not exists public.site_content (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Offentlig lesbar, kun innloggede (admin) kan skrive.
drop policy if exists "site_content_read_public" on public.site_content;
create policy "site_content_read_public" on public.site_content
  for select to anon, authenticated using (true);

drop policy if exists "site_content_write_auth" on public.site_content;
create policy "site_content_write_auth" on public.site_content
  for all to authenticated using (true) with check (true);

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;
