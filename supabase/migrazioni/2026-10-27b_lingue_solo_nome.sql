-- =====================================================================
-- Lingue: delle spunte e delle correzioni dei docenti resta solo il nome
-- Progetto Supabase: sawclsysqnjsvbobioqo
-- =====================================================================
-- Decisione del 27/10/2026: la mail di chi spunta o corregge una frase
-- non si conserva. Resta il nome ricavato dalla mail («Mario Rossi»),
-- che serve anche a riconoscere le spunte e le correzioni proprie.
-- Le mail già salvate vengono cancellate: modifica NON additiva.
-- Da applicare insieme alla nuova versione della funzione studio-genera.
-- =====================================================================
begin;

-- il nome c'è sempre (dove mancasse, lo si ricava dalla mail prima di toglierla)
update public.lingue_revisioni
  set nome = initcap(regexp_replace(split_part(email, '@', 1), '[._-]+', ' ', 'g'))
  where nome is null or btrim(nome) = '';
update public.lingue_correzioni
  set nome = initcap(regexp_replace(split_part(email, '@', 1), '[._-]+', ' ', 'g'))
  where nome is null or btrim(nome) = '';

-- spunte: una riga per frase, lingua e nome (in caso di omonimi resta la più recente)
delete from public.lingue_revisioni a
  using public.lingue_revisioni b
  where a.chiave = b.chiave and a.lingua = b.lingua and a.nome = b.nome
    and a.email <> b.email and (a.aggiornata, a.email) < (b.aggiornata, b.email);
alter table public.lingue_revisioni drop constraint if exists lingue_revisioni_pkey;
alter table public.lingue_revisioni alter column nome set not null;
alter table public.lingue_revisioni add primary key (chiave, lingua, nome);
alter table public.lingue_revisioni drop column email;

-- correzioni
alter table public.lingue_correzioni alter column nome set not null;
alter table public.lingue_correzioni drop column email;

commit;
