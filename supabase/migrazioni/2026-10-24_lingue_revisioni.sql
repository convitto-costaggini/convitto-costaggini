-- =====================================================================
-- Lingue: le spunte di revisione dei docenti
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- Un docente, mentre usa il vocabolario, può segnare una frase come
-- «va bene» (ok) oppure suggerire una correzione (proposta).
-- Una riga per frase, lingua e docente. Si legge e si scrive solo dalla
-- funzione studio-genera (chiave di servizio), con l'accesso via mail.
-- Modifica additiva.
-- =====================================================================

begin;

create table if not exists public.lingue_revisioni (
  chiave      text not null check (char_length(chiave) <= 200),
  lingua      text not null check (lingua in ('en', 'fr', 'es')),
  email       text not null check (char_length(email) <= 254),
  nome        text check (char_length(nome) <= 80),
  stato       text not null check (stato in ('ok', 'proposta')),
  testo       text check (char_length(testo) <= 300),
  proposta    text check (char_length(proposta) <= 300),
  nota        text check (char_length(nota) <= 300),
  aggiornata  timestamptz not null default now(),
  primary key (chiave, lingua, email)
);

alter table public.lingue_revisioni enable row level security;
revoke all on public.lingue_revisioni from anon, authenticated;

commit;
