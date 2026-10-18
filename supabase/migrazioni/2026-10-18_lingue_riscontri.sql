-- =====================================================================
-- Minisito Lingue: scheda di riscontro del Dipartimento (presentazione)
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- Chi compila la scheda in lingue/presentazione.html la puo' inviare dal
-- sito: il testo arriva in questa tabella e si legge nel pannello admin
-- (scheda "Lingue"). Chiunque puo' solo INSERIRE; leggere, segnare come
-- letto ed eliminare e' riservato agli amministratori (is_admin, con il
-- secondo passaggio). Tutte le modifiche sono additive.
-- =====================================================================

begin;

create table if not exists public.lingue_riscontri (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  tipo        text not null default 'scheda' check (tipo in ('scheda')),
  docenti     text check (docenti is null or char_length(docenti) <= 200),
  testo       text not null check (char_length(testo) between 1 and 8000),
  letto       boolean not null default false
);

alter table public.lingue_riscontri enable row level security;

revoke all on public.lingue_riscontri from anon, authenticated;
grant insert on public.lingue_riscontri to anon, authenticated;
grant select, update, delete on public.lingue_riscontri to authenticated;

create policy "riscontri: inserimento da chiunque" on public.lingue_riscontri
  for insert to anon, authenticated
  with check (letto = false);

create policy "riscontri: solo admin" on public.lingue_riscontri
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Freno contro gli invii in massa: al massimo 30 schede ogni 10 minuti.
create or replace function public.lingue_riscontri_limite()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.lingue_riscontri
       where created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'Troppi invii in questo momento: riprovare tra qualche minuto.';
  end if;
  return new;
end $$;
revoke all on function public.lingue_riscontri_limite() from public, anon, authenticated;

drop trigger if exists lingue_riscontri_limite on public.lingue_riscontri;
create trigger lingue_riscontri_limite
  before insert on public.lingue_riscontri
  for each row execute function public.lingue_riscontri_limite();

commit;
