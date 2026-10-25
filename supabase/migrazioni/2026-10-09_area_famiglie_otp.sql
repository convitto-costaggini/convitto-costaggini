-- =====================================================================
-- Area riservata famiglie: secondo fattore di autenticazione (OTP via email)
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- Riferimenti: parere del DPO (CAP&G Consulting, 28/09/2026) sul consenso
-- come base giuridica; parere del Responsabile per la Transizione al
-- Digitale (08/10/2026), che indica come soluzione l'aggiunta di un codice
-- OTP inviato all'email del genitore o tutore.
--
-- Cosa fa, in sintesi:
--  1. famiglie_otp: registro dei codici monouso. Il codice non è mai
--     salvato in chiaro, ma solo come impronta (SHA-256 con un segreto
--     noto alla sola Edge Function "otp-famiglie"). La tabella non è
--     leggibile né scrivibile dal sito: la usa soltanto la Edge Function.
--  2. famiglie_otp_ok(): vero solo se la sessione in corso (non il solo
--     utente) ha superato la verifica del codice nelle ultime 12 ore.
--  3. Le regole di lettura riservate ai genitori (genitori_studenti e le
--     cinque tabelle famiglie_*) richiedono ora anche famiglie_otp_ok().
--     Chi conosce la sola password non legge nulla: il controllo è nel
--     database, non soltanto nella pagina.
--  4. richieste_accesso: data e riferimento del modulo di consenso
--     firmato ricevuto, registrati dall'amministratore all'approvazione.
--
-- Le regole degli amministratori (is_admin) non cambiano. Nessun dato
-- esistente viene cancellato.
-- =====================================================================

begin;

-- ── 1. Registro dei codici OTP ───────────────────────────────────────
create table if not exists public.famiglie_otp (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  session_id     uuid not null,
  codice_hash    text not null check (codice_hash ~ '^[0-9a-f]{64}$'),
  creato_at      timestamptz not null default now(),
  scade_at       timestamptz not null,
  tentativi      smallint not null default 0 check (tentativi between 0 and 10),
  verificato_at  timestamptz,
  annullato_at   timestamptz,
  check (scade_at > creato_at)
);
create index if not exists famiglie_otp_sessione
  on public.famiglie_otp (user_id, session_id, creato_at desc);
create index if not exists famiglie_otp_creato
  on public.famiglie_otp (creato_at);

-- RLS attiva e nessuna policy: solo la Edge Function (chiave di servizio)
-- legge e scrive questa tabella.
alter table public.famiglie_otp enable row level security;
revoke all on table public.famiglie_otp from anon, authenticated;

-- ── 2. La sessione in corso ha superato la verifica? ─────────────────
create or replace function public.famiglie_otp_ok()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
      from public.famiglie_otp o
     where o.user_id = auth.uid()
       and o.session_id::text = coalesce(auth.jwt() ->> 'session_id', '')
       and o.verificato_at is not null
       and o.annullato_at is null
       and o.verificato_at > now() - interval '12 hours'
  );
$$;
revoke all on function public.famiglie_otp_ok() from public, anon;
grant execute on function public.famiglie_otp_ok() to authenticated;

-- Regola unica per le cinque tabelle famiglie_*: stessa logica di prima
-- (codice studente, oppure nome per le righe ancora senza codice), con in
-- più la verifica OTP della sessione.
create or replace function public.famiglia_vede(p_codice text, p_nome text)
returns boolean
language sql stable security definer set search_path = public as $$
  select public.famiglie_otp_ok() and (
    (
      nullif(btrim(p_codice), '') is not null
      and btrim(p_codice) in (
        select btrim(g.codice_studente)
          from public.genitori_studenti g
         where g.email_genitore = auth.email()
           and nullif(btrim(g.codice_studente), '') is not null
      )
    )
    or lower(btrim(p_nome)) in (
      select lower(btrim(g.nome_studente))
        from public.genitori_studenti g
       where g.email_genitore = auth.email()
    )
  );
$$;
revoke all on function public.famiglia_vede(text, text) from public, anon;
grant execute on function public.famiglia_vede(text, text) to authenticated;

-- ── 3. Regole di lettura per i genitori ──────────────────────────────
drop policy if exists "Genitore vede solo le proprie associazioni" on public.genitori_studenti;
create policy "Genitore vede solo le proprie associazioni" on public.genitori_studenti
  for select to authenticated
  using (email_genitore = auth.email() and public.famiglie_otp_ok());

drop policy if exists "Genitore vede presenze figlio (codice+nome)" on public.famiglie_presenze;
create policy "Genitore vede presenze figlio (codice+nome)" on public.famiglie_presenze
  for select to authenticated
  using (public.famiglia_vede(codice_studente, nome_studente));

drop policy if exists "Genitore vede semafori figlio (codice+nome)" on public.famiglie_semafori;
create policy "Genitore vede semafori figlio (codice+nome)" on public.famiglie_semafori
  for select to authenticated
  using (public.famiglia_vede(codice_studente, nome_studente));

drop policy if exists "Genitore vede note figlio (codice+nome)" on public.famiglie_note;
create policy "Genitore vede note figlio (codice+nome)" on public.famiglie_note
  for select to authenticated
  using (public.famiglia_vede(codice_studente, nome_studente));

drop policy if exists "Genitore vede colloqui figlio (codice+nome)" on public.famiglie_colloqui;
create policy "Genitore vede colloqui figlio (codice+nome)" on public.famiglie_colloqui
  for select to authenticated
  using (public.famiglia_vede(codice_studente, nome_studente));

drop policy if exists "Genitore vede relazioni figlio (codice+nome)" on public.famiglie_relazioni;
create policy "Genitore vede relazioni figlio (codice+nome)" on public.famiglie_relazioni
  for select to authenticated
  using (public.famiglia_vede(codice_studente, nome_studente));

-- ── 4. Modulo di consenso firmato ────────────────────────────────────
alter table public.richieste_accesso
  add column if not exists modulo_consenso_ricevuto date,
  add column if not exists modulo_consenso_rif text
    check (modulo_consenso_rif is null or char_length(modulo_consenso_rif) <= 200);

commit;
