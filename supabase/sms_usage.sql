-- SMS-bruk per år (for fakturering).
-- Kjør denne filen én gang i Supabase SQL Editor. Trygg å kjøre flere ganger.
--
-- Teller ALLE sendte SMS-segmenter: både varsel til forvalter når en booking
-- kommer inn, og bekreftelse til kunde ved godkjenning. Én rad per år, slik at
-- tidligere år beholdes. `segments` er det som faktureres (en lang melding kan
-- bli flere segmenter); `messages` er antall sendte meldinger.

create table if not exists public.sms_usage (
  year int primary key,
  segments int not null default 0,
  messages int not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.sms_usage enable row level security;

-- Innlogget admin kan lese statistikken (dashboard/SQL Editor leser uansett).
drop policy if exists "sms_usage_read_auth" on public.sms_usage;
create policy "sms_usage_read_auth" on public.sms_usage
  for select to authenticated using (true);

grant select on public.sms_usage to anon, authenticated;

-- Atomisk opptelling. Kalles server-side fra Edge Functions (service role).
-- Legger til segmenter for inneværende år og øker meldingstelleren med 1.
create or replace function public.increment_sms_usage(p_segments int)
returns void
language sql
as $$
  insert into public.sms_usage (year, segments, messages)
  values (extract(year from now())::int, greatest(p_segments, 0), 1)
  on conflict (year) do update
    set segments = sms_usage.segments + greatest(excluded.segments, 0),
        messages = sms_usage.messages + 1,
        updated_at = now();
$$;
