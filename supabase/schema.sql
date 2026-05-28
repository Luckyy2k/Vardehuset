-- Kulturhuset Varde – databaseskjema for Supabase.
-- Kjør hele filen i Supabase SQL Editor (Project → SQL Editor → New query).

-- =========================================================
--  Tabeller
-- =========================================================

-- Forespørsler om leie (sendt fra skjemaet på /foresporsel)
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  event_type text,
  event_date date,
  guests int,
  message text
);

-- Opptatte datoer (vises i kalenderen)
create table if not exists public.booked_dates (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  status text not null default 'opptatt',
  note text,
  created_at timestamptz not null default now()
);

-- Konserter & arrangementer
create table if not exists public.concerts (
  id bigint generated always as identity primary key,
  title text not null,
  date date not null,
  venue text,
  description text,
  image text,
  created_at timestamptz not null default now()
);

-- Styret
create table if not exists public.board_members (
  id bigint generated always as identity primary key,
  name text not null,
  role text,
  phone text
);

-- Sponsorer
create table if not exists public.sponsors (
  id bigint generated always as identity primary key,
  name text not null
);

-- Kormedlemmer
create table if not exists public.members (
  id bigint generated always as identity primary key,
  name text not null,
  voice text,
  img text
);

-- =========================================================
--  Row Level Security
--  - Offentlig innhold: lesbart for alle (anon)
--  - Forespørsler: alle kan sende inn, kun innloggede kan lese/slette
--  - Skriving til innhold: kun innloggede (admin)
-- =========================================================

alter table public.inquiries     enable row level security;
alter table public.booked_dates  enable row level security;
alter table public.concerts      enable row level security;
alter table public.board_members enable row level security;
alter table public.sponsors      enable row level security;
alter table public.members       enable row level security;

-- Inquiries: alle kan sende inn
create policy "inquiries_insert_anon" on public.inquiries
  for insert to anon, authenticated with check (true);
create policy "inquiries_read_auth" on public.inquiries
  for select to authenticated using (true);
create policy "inquiries_delete_auth" on public.inquiries
  for delete to authenticated using (true);

-- Offentlig lesbare innholdstabeller + full tilgang for innloggede
do $$
declare t text;
begin
  foreach t in array array['booked_dates','concerts','board_members','sponsors','members']
  loop
    execute format('create policy "%1$s_read_public" on public.%1$s for select to anon, authenticated using (true);', t);
    execute format('create policy "%1$s_write_auth" on public.%1$s for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- =========================================================
--  Tabell-rettigheter (GRANT)
--  RLS styrer rad-tilgang, men rollene trenger også
--  tabell-privilegier for at PostgREST skal slippe dem til.
-- =========================================================

grant usage on schema public to anon, authenticated;

-- Offentlig lesetilgang
grant select on
  public.booked_dates, public.concerts, public.board_members,
  public.sponsors, public.members
  to anon, authenticated;

-- Forespørsler: alle kan sende inn, innloggede kan lese/slette
grant insert on public.inquiries to anon, authenticated;
grant select, delete on public.inquiries to authenticated;

-- Admin (innlogget): full skrivetilgang til innhold og kalender
grant insert, update, delete on
  public.booked_dates, public.concerts, public.board_members,
  public.sponsors, public.members
  to authenticated;
