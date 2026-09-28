-- =====================================================================
-- Misure richieste dal DPO (riscontro CAP&G Consulting del 28/09/2026)
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- Cosa fa, in sintesi:
--  1. Email degli ex convittori: non più leggibili da chi visita il sito
--     (prima la vista alumni_pubblici e la tabella alumni le esponevano
--     per chi aveva scelto "contattabile"). Il pulsante "Scrivimi" passa
--     ora dalla casella del Convitto.
--  2. Registro dei consensi (consensi_privacy): per la Mappa e per il
--     Muro dei Ricordi si conserva, in una tabella leggibile solo dagli
--     amministratori, l'email di chi pubblica, la data del consenso e la
--     versione dell'informativa accettata. Serve per revoca, rinnovo e
--     moderazione. L'email non è mai pubblicata.
--  3. Mappa degli ex convittori: il consenso vale due anni. Un pin con
--     consenso più vecchio di due anni sparisce da solo dalla mappa
--     pubblica finché il consenso non viene rinnovato.
--  4. Muro dei Ricordi: massimo 280 caratteri anche lato database;
--     elenco degli utenti bloccati dalla moderazione (moderazione_blocchi),
--     i cui nuovi invii vengono rifiutati.
-- Tutte le modifiche sono additive o restrittive: nessun dato viene
-- cancellato.
-- =====================================================================

begin;

-- ── 1. Email alumni non più pubbliche ────────────────────────────────
drop view if exists public.alumni_pubblici;
create view public.alumni_pubblici with (security_invoker = true) as
  select id, nome, firma, anni, citta, lavoro, settore, ricordo,
         social_fb, social_ig, social_li, social_web, contattabile,
         colore, created_at, video_url
    from public.alumni
   where approvato = true;

revoke select on public.alumni from anon, authenticated;
grant select (id, nome, firma, anni, citta, lavoro, settore, ricordo,
              social_fb, social_ig, social_li, social_web, contattabile,
              colore, approvato, created_at, video_url)
  on public.alumni to anon, authenticated;
grant select on public.alumni_pubblici to anon, authenticated;

-- Gli amministratori leggono le email tramite questa funzione.
create or replace function public.admin_email_alumni()
returns table (id uuid, email text)
language sql stable security definer set search_path = public as $$
  select a.id, a.email from public.alumni a where public.is_admin();
$$;
revoke all on function public.admin_email_alumni() from public, anon;
grant execute on function public.admin_email_alumni() to authenticated;

-- ── 2. Elenco utenti bloccati dalla moderazione ──────────────────────
create table if not exists public.moderazione_blocchi (
  email       text primary key check (email = lower(email)),
  motivo      text,
  created_at  timestamptz not null default now()
);
alter table public.moderazione_blocchi enable row level security;
create policy "blocchi admin" on public.moderazione_blocchi
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.rifiuta_utenti_bloccati()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email is not null and exists (
       select 1 from public.moderazione_blocchi b where b.email = lower(trim(new.email))) then
    raise exception 'Invio non consentito' using errcode = '42501';
  end if;
  return new;
end $$;

drop trigger if exists alumni_blocchi on public.alumni;
create trigger alumni_blocchi before insert on public.alumni
  for each row execute function public.rifiuta_utenti_bloccati();

-- ── 3. Registro dei consensi (Mappa, Muro dei Ricordi) ───────────────
create table if not exists public.consensi_privacy (
  id                   uuid primary key default gen_random_uuid(),
  servizio             text not null check (servizio in ('mappa','ricordi')),
  riferimento_id       uuid not null,
  email                text not null check (char_length(email) between 5 and 200),
  versione_informativa text not null,
  consenso_at          timestamptz not null default now(),
  revocato_at          timestamptz
);
create index if not exists consensi_privacy_rif on public.consensi_privacy (servizio, riferimento_id);
alter table public.consensi_privacy enable row level security;
create policy "Inserimento pubblico consensi" on public.consensi_privacy
  for insert to anon, authenticated
  with check (revocato_at is null and consenso_at <= now() + interval '1 minute');
create policy "consensi admin" on public.consensi_privacy
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop trigger if exists consensi_blocchi on public.consensi_privacy;
create trigger consensi_blocchi before insert on public.consensi_privacy
  for each row execute function public.rifiuta_utenti_bloccati();

-- ── 4. Mappa: consenso biennale ──────────────────────────────────────
alter table public.pin_mappa add column if not exists consenso_at timestamptz;
update public.pin_mappa set consenso_at = created_at where consenso_at is null;
alter table public.pin_mappa alter column consenso_at set default now();
alter table public.pin_mappa alter column consenso_at set not null;

drop policy if exists "Lettura pubblica pin approvati" on public.pin_mappa;
create policy "Lettura pubblica pin approvati" on public.pin_mappa
  for select using (approvato = true and consenso_at > now() - interval '2 years');

-- Chi invia dal sito non può retrodatare o allungare il consenso.
drop policy if exists "Inserimento pubblico pin" on public.pin_mappa;
create policy "Inserimento pubblico pin" on public.pin_mappa
  for insert with check (approvato is not true and consenso_at <= now() + interval '1 minute');

-- ── 5. Muro dei Ricordi: limite di 280 caratteri ─────────────────────
alter table public.ricordi drop constraint if exists ricordi_testo_max_280;
alter table public.ricordi add constraint ricordi_testo_max_280
  check (char_length(testo) <= 280) not valid;

commit;
