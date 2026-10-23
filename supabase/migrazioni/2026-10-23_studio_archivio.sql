-- =====================================================================
-- Sala studio: lezioni modificabili e cancellabili dall'autore,
-- condivise (o no) nell'Archivio degli educatori per anno e materia
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- proprietario: impronta (sha256) del codice educatori usato per
--   pubblicare. Solo chi ha lo stesso codice modifica o cancella la
--   lezione. Le lezioni pubblicate prima di questa modifica non hanno
--   proprietario: le prende il primo educatore che le modifica.
-- condivisa: se true la lezione compare nell'Archivio di tutti gli
--   educatori; se false la vede solo il suo autore.
-- anno: anno di corso (1-5), per raggruppare l'Archivio.
-- Tutte le modifiche sono additive; i permessi restano quelli di prima
-- (la tabella si legge e si scrive solo dalla funzione studio-genera).
-- =====================================================================

begin;

alter table public.studio_lezioni
  add column if not exists proprietario text check (proprietario is null or proprietario ~ '^[0-9a-f]{64}$'),
  add column if not exists condivisa    boolean not null default false,
  add column if not exists anno         smallint check (anno is null or anno between 1 and 5),
  add column if not exists modificata   timestamptz;

create index if not exists studio_lezioni_proprietario on public.studio_lezioni (proprietario);
create index if not exists studio_lezioni_condivise on public.studio_lezioni (anno, materia) where condivisa;

commit;
