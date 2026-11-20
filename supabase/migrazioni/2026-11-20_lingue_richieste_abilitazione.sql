-- =====================================================================
-- Lingue: richieste di abilitazione all'area docenti
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- Un docente che entra nell'Aula con la mail della scuola ma non è
-- nell'elenco lingue_docenti può chiedere l'abilitazione dalla pagina.
-- La richiesta la registra solo la funzione aula-accesso (con una
-- sessione valida, quindi da chi ha dimostrato di leggere quella
-- casella). Una richiesta NON abilita nessuno.
-- Approvare, rifiutare e revocare si può solo dal pannello admin, con
-- un amministratore verificato in due passaggi (is_admin): nessun link
-- via mail, quindi niente link inoltrati o aperti da altri.
-- Modifiche additive.
-- =====================================================================
begin;

create table if not exists public.lingue_richieste (
  email   text primary key check (email ~ '^[a-z0-9._-]{1,64}@alberghierorieti\.(edu\.)?it$'),
  nome    text not null check (char_length(nome) between 1 and 80),
  stato   text not null default 'in_attesa' check (stato in ('in_attesa', 'approvata', 'rifiutata')),
  creata  timestamptz not null default now(),
  decisa  timestamptz
);

alter table public.lingue_richieste enable row level security;
revoke all on public.lingue_richieste from anon, authenticated;
grant select on public.lingue_richieste to authenticated;
create policy "richieste lingue: lettura solo admin" on public.lingue_richieste
  for select to authenticated using (public.is_admin());

-- elenco dei docenti abilitati: leggibile dal pannello, solo admin
grant select on public.lingue_docenti to authenticated;
drop policy if exists "docenti lingue: lettura solo admin" on public.lingue_docenti;
create policy "docenti lingue: lettura solo admin" on public.lingue_docenti
  for select to authenticated using (public.is_admin());

-- Le decisioni passano da qui: il controllo is_admin() è dentro la funzione.
-- azione: 'approva' | 'rifiuta' | 'revoca' | 'riattiva'
create or replace function public.admin_lingue_decidi(p_email text, p_azione text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  e text := lower(btrim(p_email));
  u text := split_part(lower(btrim(p_email)), '@', 1);
  n text;
begin
  if not public.is_admin() then raise exception 'non autorizzato'; end if;
  if e !~ '^[a-z0-9._-]{1,64}@alberghierorieti\.(edu\.)?it$' then raise exception 'indirizzo non valido'; end if;

  if p_azione = 'approva' then
    select nome into n from public.lingue_richieste where email = e;
    if n is null then raise exception 'richiesta non trovata'; end if;
    insert into public.lingue_docenti (email, nome, attivo) values (e, n, true)
      on conflict (email) do update set attivo = true;
    -- se l'altra forma dell'indirizzo era revocata, resterebbe chiuso: la si riattiva
    update public.lingue_docenti set attivo = true
      where email in (u || '@alberghierorieti.it', u || '@alberghierorieti.edu.it');
    update public.lingue_richieste set stato = 'approvata', decisa = now() where email = e;
  elsif p_azione = 'rifiuta' then
    update public.lingue_richieste set stato = 'rifiutata', decisa = now() where email = e;
  elsif p_azione = 'revoca' then
    update public.lingue_docenti set attivo = false
      where email in (u || '@alberghierorieti.it', u || '@alberghierorieti.edu.it');
  elsif p_azione = 'riattiva' then
    update public.lingue_docenti set attivo = true
      where email in (u || '@alberghierorieti.it', u || '@alberghierorieti.edu.it');
  else
    raise exception 'azione non valida';
  end if;
  return p_azione;
end $$;
revoke all on function public.admin_lingue_decidi(text, text) from public, anon;
grant execute on function public.admin_lingue_decidi(text, text) to authenticated;

commit;
