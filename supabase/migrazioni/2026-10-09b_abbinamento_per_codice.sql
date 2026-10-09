-- =====================================================================
-- Area riservata famiglie: abbinamento genitore-studente solo per CODICE
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- Da eseguire DOPO 2026-10-09_area_famiglie_otp.sql
-- =====================================================================
-- Perché: finora le regole RLS riconoscevano lo studente anche per nome e
-- cognome. Con due omonimi un genitore vedrebbe i dati dell'altro. Inoltre
-- nel settembre 2026 alcuni codici sono stati riassegnati: righe di agosto
-- con il codice STU-0104 riguardano uno studente che oggi ha STU-0131,
-- mentre STU-0104 appartiene ora a un altro convittore. Con l'abbinamento
-- per codice, quelle righe vecchie finirebbero al genitore sbagliato.
--
-- Cosa fa, in sintesi:
--  1. correzioni_codici: registro delle correzioni (valore vecchio e nuovo),
--     per poterle verificare o annullare.
--  2. Riallinea le righe famiglie_* che portano un codice superato al codice
--     attuale dello stesso studente (il più recente usato per quel nome),
--     solo dove il codice attuale è univoco. Alle righe ambigue (codice usato
--     in passato da un nome diverso, senza altro codice) il codice è tolto.
--  3. I collegamenti genitore-studente esistenti NON vengono completati:
--     ogni famiglia rientra con il nuovo percorso e il modulo firmato.
--  4. richieste_accesso.codice_studente: il codice scelto dall'amministratore
--     all'approvazione. Due trigger lo copiano nel collegamento
--     genitori_studenti, sia nuovo sia già esistente.
--  5. famiglia_vede(): solo codice. Un collegamento senza codice non mostra
--     nulla (comportamento prudente).
-- =====================================================================

begin;

-- ── 1. Registro delle correzioni ─────────────────────────────────────
create table if not exists public.correzioni_codici (
  id             bigint generated always as identity primary key,
  tabella        text not null,
  riga_id        uuid not null,
  codice_vecchio text,
  codice_nuovo   text not null,
  corretto_at    timestamptz not null default now()
);
alter table public.correzioni_codici enable row level security;
revoke all on table public.correzioni_codici from anon;
create policy "correzioni admin" on public.correzioni_codici
  for select to authenticated using (public.is_admin());

-- ── 2. Codice attuale per ogni nome (dai dati più recenti) ───────────
create temporary table codice_attuale on commit drop as
with tutte as (
  select nome_studente, codice_studente, data from public.famiglie_presenze
  union all select nome_studente, codice_studente, data from public.famiglie_semafori
  union all select nome_studente, codice_studente, data from public.famiglie_note
), ultimo as (
  select distinct on (lower(btrim(nome_studente)))
         lower(btrim(nome_studente)) as nome, btrim(codice_studente) as codice
    from tutte
   where nullif(btrim(codice_studente), '') is not null
   order by lower(btrim(nome_studente)), data desc
)
-- un codice attuale vale solo se nessun altro nome lo usa come attuale
select u.nome, u.codice
  from ultimo u
 where (select count(*) from ultimo v where v.codice = u.codice) = 1;

-- Riallineamento delle tabelle famiglie_* (con registrazione)
do $$
declare t text;
begin
  foreach t in array array['famiglie_presenze','famiglie_semafori','famiglie_note',
                           'famiglie_colloqui','famiglie_relazioni'] loop
    execute format($f$
      with da_correggere as (
        select r.id, r.codice_studente as vecchio, c.codice as nuovo
          from public.%1$I r
          join codice_attuale c on c.nome = lower(btrim(r.nome_studente))
         where btrim(coalesce(r.codice_studente, '')) is distinct from c.codice
      ), registro as (
        insert into public.correzioni_codici (tabella, riga_id, codice_vecchio, codice_nuovo)
        select %1$L, id, vecchio, nuovo from da_correggere
      )
      update public.%1$I r set codice_studente = d.nuovo
        from da_correggere d where r.id = d.id$f$, t);
  end loop;
end $$;

-- Righe ambigue: un codice usato in passato con un nome diverso da quello
-- del suo titolare attuale (il nome con i dati più recenti per quel codice),
-- senza un codice attuale proprio. Non si può stabilire a chi appartengano:
-- il codice viene tolto, così nessun genitore le vede. Restano nel registro
-- delle correzioni e nel gestionale. Eccezioni confermate a mano (stessa
-- persona, nome corretto) vanno elencate in stessa_persona.
create temporary table stessa_persona (codice text, nome text) on commit drop;
-- insert into stessa_persona values ('STU-0000', 'cognome nome come in agosto');

create temporary table titolare_codice on commit drop as
with tutte as (
  select nome_studente, codice_studente, data from public.famiglie_presenze
  union all select nome_studente, codice_studente, data from public.famiglie_semafori
  union all select nome_studente, codice_studente, data from public.famiglie_note
)
select distinct on (btrim(codice_studente))
       btrim(codice_studente) as codice, lower(btrim(nome_studente)) as nome
  from tutte
 where nullif(btrim(codice_studente), '') is not null
 order by btrim(codice_studente), data desc;

do $$
declare t text;
begin
  foreach t in array array['famiglie_presenze','famiglie_semafori','famiglie_note',
                           'famiglie_colloqui','famiglie_relazioni'] loop
    execute format($f$
      with ambigue as (
        select r.id, r.codice_studente as vecchio
          from public.%1$I r
          join titolare_codice tc on tc.codice = btrim(r.codice_studente)
         where tc.nome <> lower(btrim(r.nome_studente))
           and not exists (select 1 from stessa_persona s
                            where s.codice = tc.codice
                              and lower(btrim(s.nome)) = lower(btrim(r.nome_studente)))
      ), registro as (
        insert into public.correzioni_codici (tabella, riga_id, codice_vecchio, codice_nuovo)
        select %1$L, id, vecchio, '(rimosso: ambiguo)' from ambigue
      )
      update public.%1$I r set codice_studente = null
        from ambigue a where r.id = a.id$f$, t);
  end loop;
end $$;

-- ── 3. Collegamenti genitore-studente esistenti ──────────────────────
-- Non vengono completati in automatico: risalgono a prima del modulo di
-- consenso firmato. Ogni famiglia riottiene l'accesso solo con il nuovo
-- percorso (modulo firmato → approvazione con codice). Senza codice un
-- collegamento non mostra nulla.

-- ── 4. Codice scelto all'approvazione ────────────────────────────────
alter table public.richieste_accesso
  add column if not exists codice_studente text
    check (codice_studente is null or codice_studente ~ '^STU-[0-9]{4,}$');

create or replace function public.genitori_studenti_codice_da_richiesta()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if nullif(btrim(new.codice_studente), '') is null then
    select r.codice_studente into new.codice_studente
      from public.richieste_accesso r
     where r.stato = 'approvata'
       and lower(btrim(r.email_genitore)) = lower(btrim(new.email_genitore))
       and lower(btrim(r.nome_studente))  = lower(btrim(new.nome_studente))
       and r.codice_studente is not null
     order by r.processed_at desc nulls last, r.created_at desc
     limit 1;
  end if;
  return new;
end $$;

drop trigger if exists genitori_studenti_codice on public.genitori_studenti;
create trigger genitori_studenti_codice before insert on public.genitori_studenti
  for each row execute function public.genitori_studenti_codice_da_richiesta();

-- Account già esistente (collegamento creato prima di questa procedura):
-- la Edge Function non inserisce una riga nuova, quindi il codice si
-- aggiorna quando la richiesta viene approvata.
create or replace function public.richiesta_approvata_aggiorna_codice()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.stato = 'approvata' and new.codice_studente is not null then
    update public.genitori_studenti g
       set codice_studente = new.codice_studente
     where lower(btrim(g.email_genitore)) = lower(btrim(new.email_genitore))
       and lower(btrim(g.nome_studente))  = lower(btrim(new.nome_studente))
       and g.codice_studente is distinct from new.codice_studente;
  end if;
  return new;
end $$;

drop trigger if exists richieste_accesso_codice on public.richieste_accesso;
create trigger richieste_accesso_codice after update of stato, codice_studente on public.richieste_accesso
  for each row execute function public.richiesta_approvata_aggiorna_codice();

-- ── 5. Regola di visibilità: solo codice ─────────────────────────────
create or replace function public.famiglia_vede(p_codice text, p_nome text)
returns boolean
language sql stable security definer set search_path = public as $$
  select public.famiglie_otp_ok()
     and nullif(btrim(p_codice), '') is not null
     and btrim(p_codice) in (
       select btrim(g.codice_studente)
         from public.genitori_studenti g
        where g.email_genitore = auth.email()
          and nullif(btrim(g.codice_studente), '') is not null
     );
$$;

commit;
