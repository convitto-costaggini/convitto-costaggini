-- =====================================================================
-- Minisito Sala studio: lezioni interattive create dalle foto del libro
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- L'educatore fotografa le pagine in studio/docente.html; la funzione
-- "studio-genera" (scripts/studio-genera/index.ts) le manda a Claude e
-- salva qui la lezione che ne esce, con un codice breve per il QR.
-- Le foto NON vengono salvate: resta solo la lezione (testo).
-- Nessuno puo' leggere la tabella direttamente: i ragazzi aprono una
-- lezione solo conoscendone il codice (funzione studio_lezione), non
-- possono elencarle. Scrive solo la funzione con la chiave di servizio.
-- Tutte le modifiche sono additive.
-- =====================================================================

begin;

create table if not exists public.studio_lezioni (
  codice      text primary key check (codice ~ '^[A-Z2-9]{6}$'),
  created_at  timestamptz not null default now(),
  titolo      text not null check (char_length(titolo) between 1 and 200),
  materia     text check (materia is null or char_length(materia) <= 80),
  classe      text check (classe is null or char_length(classe) <= 40),
  autore      text check (autore is null or char_length(autore) <= 80),
  pagine      smallint not null default 1,
  contenuto   jsonb not null,
  aperture    integer not null default 0
);

create index if not exists studio_lezioni_created_at on public.studio_lezioni (created_at desc);

alter table public.studio_lezioni enable row level security;
revoke all on public.studio_lezioni from anon, authenticated;
grant select, delete on public.studio_lezioni to authenticated;

create policy "studio: lettura e pulizia solo admin" on public.studio_lezioni
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Apertura di una lezione dal codice (QR). Conta anche le aperture.
create or replace function public.studio_lezione(p_codice text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  c text := upper(regexp_replace(coalesce(p_codice, ''), '[^A-Za-z0-9]', '', 'g'));
  r jsonb;
begin
  if c !~ '^[A-Z2-9]{6}$' then return null; end if;
  update public.studio_lezioni set aperture = aperture + 1 where codice = c
    returning contenuto || jsonb_build_object('codice', codice, 'creata', created_at::date) into r;
  return r;
end $$;

revoke all on function public.studio_lezione(text) from public;
grant execute on function public.studio_lezione(text) to anon, authenticated;

commit;
