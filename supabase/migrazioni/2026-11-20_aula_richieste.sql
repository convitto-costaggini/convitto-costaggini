-- Aula: richieste di abilitazione dei colleghi.
-- Chi scrive una mail non ancora in lingue_docenti non riceve il codice: la richiesta resta qui,
-- e l'amministratore la approva dal pannello (tab "Aula"). Si legge dal pannello (is_admin, quindi con il secondo passaggio);
-- si scrive solo dalle funzioni aula-accesso, studio-genera e aula-admin (chiave di servizio). Modifica additiva.
create table if not exists public.aula_richieste (
  email     text primary key,
  nome      text,
  stato     text not null default 'in_attesa' check (stato in ('in_attesa','abilitata','rifiutata')),
  tentativi int  not null default 1,
  creata    timestamptz not null default now(),
  ultima    timestamptz not null default now(),
  decisa    timestamptz
);
alter table public.aula_richieste enable row level security;
drop policy if exists aula_richieste_admin_legge on public.aula_richieste;
create policy aula_richieste_admin_legge on public.aula_richieste for select to authenticated using (public.is_admin());
