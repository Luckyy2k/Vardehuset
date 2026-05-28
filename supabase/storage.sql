-- Storage-bucket for opplastede bilder (medlemmer, konserter).
-- Kjør i Supabase SQL Editor (eller via MCP).

-- Offentlig bucket slik at bildene kan vises direkte via public URL.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Alle kan lese, innloggede (admin) kan laste opp / endre / slette.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'media_read'
  ) then
    create policy "media_read" on storage.objects
      for select to anon, authenticated
      using (bucket_id = 'media');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'media_write'
  ) then
    create policy "media_write" on storage.objects
      for all to authenticated
      using (bucket_id = 'media')
      with check (bucket_id = 'media');
  end if;
end $$;
