-- =====================================================================
-- Lingue: le correzioni dei docenti, valide subito per tutti
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- Ogni correzione è una riga nuova (la cronologia resta): chi l'ha fatta,
-- quando, il testo di prima e quello nuovo. Annullare non cancella: segna
-- la riga come annullata e torna in vigore la versione precedente.
-- La correzione in vigore per una frase è l'ultima non annullata.
-- Si legge e si scrive solo dalla funzione studio-genera. Modifica additiva.
-- =====================================================================

begin;

create table if not exists public.lingue_correzioni (
  id            bigint generated always as identity primary key,
  chiave        text not null check (char_length(chiave) <= 200),
  lingua        text not null check (lingua in ('en', 'fr', 'es')),
  originale     text check (char_length(originale) <= 2000),
  testo         text not null check (char_length(testo) <= 2000),
  nota          text check (char_length(nota) <= 300),
  email         text not null check (char_length(email) <= 254),
  nome          text check (char_length(nome) <= 80),
  creata        timestamptz not null default now(),
  annullata     timestamptz,
  annullata_da  text check (char_length(annullata_da) <= 80)
);
create index if not exists lingue_correzioni_chiave on public.lingue_correzioni (chiave, lingua, creata desc);

alter table public.lingue_correzioni enable row level security;
revoke all on public.lingue_correzioni from anon, authenticated;

commit;
