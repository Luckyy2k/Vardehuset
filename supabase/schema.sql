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
  message text,
  status text not null default 'new'  -- 'new' = ikke håndtert, 'approved' = godkjent
);

-- Opptatte datoer (vises i kalenderen)
create table if not exists public.booked_dates (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  status text not null default 'opptatt',
  note text,
  inquiry_id uuid references public.inquiries(id) on delete set null,
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
  img text,
  role text
);

-- Redigerbare sidetekster (overstyrer standardtekstene i src/data/content.js)
create table if not exists public.site_content (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
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
alter table public.site_content  enable row level security;

-- Inquiries: alle kan sende inn
create policy "inquiries_insert_anon" on public.inquiries
  for insert to anon, authenticated with check (true);
create policy "inquiries_read_auth" on public.inquiries
  for select to authenticated using (true);
create policy "inquiries_update_auth" on public.inquiries
  for update to authenticated using (true) with check (true);
create policy "inquiries_delete_auth" on public.inquiries
  for delete to authenticated using (true);

-- Offentlig lesbare innholdstabeller + full tilgang for innloggede
do $$
declare t text;
begin
  foreach t in array array['booked_dates','concerts','board_members','sponsors','members','site_content']
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
  public.sponsors, public.members, public.site_content
  to anon, authenticated;

-- Forespørsler: alle kan sende inn, innloggede kan lese/slette
grant insert on public.inquiries to anon, authenticated;
grant select, update, delete on public.inquiries to authenticated;

-- Admin (innlogget): full skrivetilgang til innhold og kalender
grant insert, update, delete on
  public.booked_dates, public.concerts, public.board_members,
  public.sponsors, public.members, public.site_content
  to authenticated;

-- =========================================================
--  SMS-bruk per år (for fakturering)
--  Teller alle sendte SMS-segmenter (varsel + bekreftelse).
-- =========================================================
create table if not exists public.sms_usage (
  year int primary key,
  segments int not null default 0,
  messages int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.sms_usage enable row level security;

create policy "sms_usage_read_auth" on public.sms_usage
  for select to anon, authenticated using (true);

grant select on public.sms_usage to anon, authenticated;

-- Atomisk opptelling, kalles server-side fra Edge Functions (service role).
-- SECURITY DEFINER så service_role kan skrive uten egne tabell-rettigheter.
create or replace function public.increment_sms_usage(p_segments int)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.sms_usage (year, segments, messages)
  values (extract(year from now())::int, greatest(p_segments, 0), 1)
  on conflict (year) do update
    set segments = sms_usage.segments + greatest(excluded.segments, 0),
        messages = sms_usage.messages + 1,
        updated_at = now();
$$;

grant execute on function public.increment_sms_usage(int) to service_role, authenticated;
